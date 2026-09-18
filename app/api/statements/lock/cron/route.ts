import { NextResponse } from 'next/server'
import { withCronContext } from '@/lib/api/with-cron-context'
import { createServiceClient } from '@/lib/supabase/server'
import {
  lockAllNetworkStatements,
  getPrecedingBillingMonth,
} from '@/lib/statements/statement-lock'

/**
 * GET /api/statements/lock/cron: monthly statement freeze job (1st of each month at 00:00 UTC).
 *
 * Automatically executes across all active network companies, snapshots the exact
 * receivables (1510), payables (2440), and net settlement balances, marks each statement
 * as locked (immutable snapshot), and saves the locked batch.
 *
 * Query parameters (optional):
 *  - `month`: Explicit billing month to lock (YYYY-MM). Defaults to preceding calendar month.
 *  - `force`: 'true' to re-lock/overwrite existing locked snapshot.
 *
 * Authenticated via CRON_SECRET using withCronContext.
 */
export const GET = withCronContext('cron.statement-lock', async (request, ctx) => {
  const url = new URL(request.url)
  const explicitMonth = url.searchParams.get('month')
  const force = url.searchParams.get('force') === 'true'

  const targetMonth = explicitMonth || getPrecedingBillingMonth()

  ctx.log.info('Starting network statement locking job', {
    targetMonth,
    explicitMonth: explicitMonth || null,
    force,
  })

  let supabase
  try {
    supabase = createServiceClient()
  } catch (err) {
    ctx.log.warn('Could not initialize Supabase service client, running in-memory', {
      error: err instanceof Error ? err.message : String(err),
    })
  }

  const result = await lockAllNetworkStatements({
    month: targetMonth,
    supabase,
    force,
  })

  ctx.log.info('Network statement locking job completed', {
    month: result.month,
    lockedCount: result.lockedCount,
    totalCompanies: result.totalCompanies,
  })

  return NextResponse.json({
    success: true,
    month: result.month,
    lockedCount: result.lockedCount,
    totalCompanies: result.totalCompanies,
    results: result.results,
  })
})

export const POST = GET
