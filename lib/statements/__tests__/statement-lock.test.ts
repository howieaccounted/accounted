import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  getPrecedingBillingMonth,
  lockMonthlyStatement,
  lockAllNetworkStatements,
  getLockedStatement,
  resetLockedStatements,
} from '@/lib/statements/statement-lock'
import {
  computeMonthlyStatement,
  resetRuntimeSettlements,
} from '@/lib/statements/bilateral-netting'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { GET as lockCronHandler } from '@/app/api/statements/lock/cron/route'

describe('statement-lock service', () => {
  beforeEach(() => {
    resetRuntimeSettlements()
    resetLockedStatements()
  })

  describe('getPrecedingBillingMonth', () => {
    it('calculates the preceding month within the same calendar year', () => {
      // 2026-10-01 (October 1st) -> should lock September (2026-09)
      const oct1 = new Date(Date.UTC(2026, 9, 1, 0, 0, 0))
      expect(getPrecedingBillingMonth(oct1)).toBe('2026-09')

      // 2026-06-15 -> 2026-05
      const jun15 = new Date(Date.UTC(2026, 5, 15, 12, 0, 0))
      expect(getPrecedingBillingMonth(jun15)).toBe('2026-05')
    })

    it('rolls back across year boundary on January 1st', () => {
      // 2027-01-01 (January 1st) -> should lock December of previous year (2026-12)
      const jan1 = new Date(Date.UTC(2027, 0, 1, 0, 0, 0))
      expect(getPrecedingBillingMonth(jan1)).toBe('2026-12')
    })
  })

  describe('lockMonthlyStatement', () => {
    it('locks and freezes the statement snapshot with immutable metadata', async () => {
      const lockResult = await lockMonthlyStatement({
        companyId: TENANT_A_COMPANY_ID,
        scope: 'all',
        month: '2026-09',
      })

      expect(lockResult.isNewLock).toBe(true)
      expect(lockResult.lockReference).toContain('LOCK-202609')
      expect(lockResult.lockedAt).toBeDefined()

      const stmt = lockResult.statement
      expect(stmt.isLocked).toBe(true)
      expect(stmt.lockedAt).toBe(lockResult.lockedAt)
      expect(stmt.lockReference).toBe(lockResult.lockReference)
      expect(stmt.totalReceivablesSek).toBe(25000)
      expect(stmt.totalPayablesSek).toBe(29000)
      expect(stmt.netAmountSek).toBe(-4000)

      // In-memory retrieve returns the exact locked snapshot
      const cached = getLockedStatement(TENANT_A_COMPANY_ID, 'all', '2026-09')
      expect(cached).not.toBeNull()
      expect(cached?.isLocked).toBe(true)
      expect(cached?.netAmountSek).toBe(-4000)
    })

    it('is idempotent: subsequent lock calls return existing locked snapshot unless forced', async () => {
      const first = await lockMonthlyStatement({
        companyId: TENANT_A_COMPANY_ID,
        scope: 'all',
        month: '2026-09',
      })
      expect(first.isNewLock).toBe(true)

      const second = await lockMonthlyStatement({
        companyId: TENANT_A_COMPANY_ID,
        scope: 'all',
        month: '2026-09',
      })
      expect(second.isNewLock).toBe(false)
      expect(second.lockReference).toBe(first.lockReference)
      expect(second.lockedAt).toBe(first.lockedAt)
    })

    it('preserves immutability in computeMonthlyStatement once locked', async () => {
      // 1. Initial lock
      await lockMonthlyStatement({
        companyId: TENANT_A_COMPANY_ID,
        scope: 'all',
        month: '2026-09',
      })

      // 2. Normal computeMonthlyStatement now returns the locked snapshot
      const lockedStmt = computeMonthlyStatement({
        activeCompanyId: TENANT_A_COMPANY_ID,
        counterpartyId: 'all',
        month: '2026-09',
      })

      expect(lockedStmt.isLocked).toBe(true)
      expect(lockedStmt.lockReference).toContain('LOCK-202609')
      expect(lockedStmt.netAmountSek).toBe(-4000)
    })
  })

  describe('lockAllNetworkStatements', () => {
    it('locks all active network companies in one run', async () => {
      const result = await lockAllNetworkStatements({ month: '2026-09' })

      expect(result.month).toBe('2026-09')
      expect(result.totalCompanies).toBeGreaterThanOrEqual(2)
      expect(result.lockedCount).toBeGreaterThanOrEqual(2)

      // Verify Company A and Company B are in results
      const companyA = result.results.find((r) => r.companyId === TENANT_A_COMPANY_ID)
      const companyB = result.results.find((r) => r.companyId === TENANT_B_COMPANY_ID)

      expect(companyA).toBeDefined()
      expect(companyB).toBeDefined()
      expect(companyA?.netAmountSek).toBe(-4000)
      expect(companyB?.netAmountSek).toBe(4000)
    })
  })

  describe('cron route handler', () => {
    const originalCronSecret = process.env.CRON_SECRET

    beforeEach(() => {
      process.env.CRON_SECRET = 'test-secret-value-12345'
    })

    afterEach(() => {
      process.env.CRON_SECRET = originalCronSecret
    })

    it('rejects unauthorized requests missing CRON_SECRET', async () => {
      const req = new Request('http://localhost:3000/api/statements/lock/cron', {
        headers: {},
      })
      const res = await lockCronHandler(req)
      expect(res.status).toBe(401)
    })

    it('executes locking successfully when authorized with bearer secret', async () => {
      const req = new Request(
        'http://localhost:3000/api/statements/lock/cron?month=2026-09',
        {
          headers: {
            authorization: 'Bearer test-secret-value-12345',
          },
        }
      )
      const res = await lockCronHandler(req)
      expect(res.status).toBe(200)

      const body = (await res.json()) as {
        success: boolean
        month: string
        lockedCount: number
        totalCompanies: number
      }
      expect(body.success).toBe(true)
      expect(body.month).toBe('2026-09')
      expect(body.lockedCount).toBeGreaterThanOrEqual(2)
    })
  })
})
