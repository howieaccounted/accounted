import type { SupabaseClient } from '@supabase/supabase-js'
import {
  computeMonthlyStatement,
  getConnectedCounterparties,
  getLockedStatement,
  saveLockedStatement,
  resetLockedStatementsStore,
  type MonthlyNettingStatement,
} from '@/lib/statements/bilateral-netting'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { createLogger } from '@/lib/logger'

const log = createLogger('statements:lock')

export { getLockedStatement }

/**
 * Calculate the preceding calendar billing month (YYYY-MM).
 * When running on the 1st of month M+1, the target month to lock is month M.
 * E.g., on 2026-10-01 -> returns "2026-09".
 * On 2027-01-01 -> returns "2026-12".
 */
export function getPrecedingBillingMonth(date?: Date): string {
  const d = date || new Date()
  let year = d.getUTCFullYear()
  let month = d.getUTCMonth() // 0-indexed: 0 = Jan, 9 = Oct

  if (month === 0) {
    year -= 1
    month = 12
  }
  // month is now 1-12 representing the preceding month
  return `${year}-${String(month).padStart(2, '0')}`
}

export interface LockStatementResult {
  statement: MonthlyNettingStatement
  isNewLock: boolean
  lockReference: string
  lockedAt: string
}

/**
 * Lock and freeze a monthly netting statement for a company.
 * Generates an immutable snapshot so subsequent invoice additions or edits
 * cannot retroactively alter the closed billing cycle.
 */
export async function lockMonthlyStatement(options: {
  companyId: string
  scope?: string
  month: string
  supabase?: SupabaseClient
  force?: boolean
}): Promise<LockStatementResult> {
  const { companyId, scope = 'all', month, supabase, force = false } = options

  // If already locked and not forcing, return the existing frozen snapshot
  const existing = getLockedStatement(companyId, scope, month)
  if (existing && !force) {
    return {
      statement: JSON.parse(JSON.stringify(existing)) as MonthlyNettingStatement,
      isNewLock: false,
      lockReference: existing.lockReference || `LOCK-${month.replace('-', '')}`,
      lockedAt: existing.lockedAt || new Date().toISOString(),
    }
  }

  // Compute fresh statement
  const computed = computeMonthlyStatement({
    activeCompanyId: companyId,
    counterpartyId: scope,
    month,
  })

  const lockedAt = new Date().toISOString()
  const lockReference = `LOCK-${month.replace('-', '')}-${companyId.slice(0, 4).toUpperCase()}`

  // Create deep cloned snapshot
  const lockedSnapshot: MonthlyNettingStatement = {
    ...JSON.parse(JSON.stringify(computed)),
    isLocked: true,
    lockedAt,
    lockReference,
  }

  // Save to in-memory store
  saveLockedStatement(lockedSnapshot)

  // Persist to Supabase settlement_batches if client available
  if (supabase) {
    try {
      const batchRef = `BATCH-${month.replace('-', '')}-${companyId.slice(0, 8)}`
      await supabase.from('settlement_batches').upsert(
        {
          tenant_id: companyId,
          batch_reference: batchRef,
          total_ar_offset: lockedSnapshot.totalReceivablesSek,
          total_ap_offset: lockedSnapshot.totalPayablesSek,
          net_settlement_amount: lockedSnapshot.netAmountSek,
          currency: 'SEK',
          status: 'proposed',
          created_at: lockedAt,
          updated_at: lockedAt,
        },
        { onConflict: 'batch_reference' }
      )
    } catch (err) {
      log.warn('Could not persist locked batch to settlement_batches table', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  log.info('Successfully locked statement', {
    companyId,
    scope,
    month,
    lockReference,
    receivablesSek: lockedSnapshot.totalReceivablesSek,
    payablesSek: lockedSnapshot.totalPayablesSek,
    netAmountSek: lockedSnapshot.netAmountSek,
  })

  return {
    statement: lockedSnapshot,
    isNewLock: true,
    lockReference,
    lockedAt,
  }
}

export interface LockAllNetworkStatementsResult {
  month: string
  lockedCount: number
  totalCompanies: number
  results: Array<{
    companyId: string
    lockReference: string
    lockedAt: string
    isNewLock: boolean
    netAmountSek: number
    settlementDirection: string
  }>
}

/**
 * Execute the automated monthly lock across all active network companies.
 * Typically invoked on the 1st of each month by the Vercel Cron or Supabase cron.
 */
export async function lockAllNetworkStatements(options?: {
  month?: string
  supabase?: SupabaseClient
  force?: boolean
}): Promise<LockAllNetworkStatementsResult> {
  const targetMonth = options?.month || getPrecedingBillingMonth()

  // Identify active network companies
  const companyIds = [TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID]

  if (options?.supabase) {
    try {
      const { data: peers } = await options.supabase
        .from('network_peers')
        .select('tenant_id')
        .eq('status', 'active')

      if (peers && peers.length > 0) {
        for (const p of peers) {
          if (p.tenant_id && !companyIds.includes(p.tenant_id)) {
            companyIds.push(p.tenant_id)
          }
        }
      }
    } catch {
      // Tolerate DB offline
    }
  }

  const results: LockAllNetworkStatementsResult['results'] = []

  for (const companyId of companyIds) {
    try {
      const lockRes = await lockMonthlyStatement({
        companyId,
        scope: 'all',
        month: targetMonth,
        supabase: options?.supabase,
        force: options?.force,
      })

      results.push({
        companyId,
        lockReference: lockRes.lockReference,
        lockedAt: lockRes.lockedAt,
        isNewLock: lockRes.isNewLock,
        netAmountSek: lockRes.statement.netAmountSek,
        settlementDirection: lockRes.statement.settlementDirection,
      })
    } catch (err) {
      log.error('Failed to lock statement for company', err as Error, {
        companyId,
        month: targetMonth,
      })
    }
  }

  return {
    month: targetMonth,
    lockedCount: results.filter((r) => r.isNewLock).length,
    totalCompanies: results.length,
    results,
  }
}

/**
 * Reset locked statements store (for unit tests).
 */
export function resetLockedStatements(): void {
  resetLockedStatementsStore()
}
