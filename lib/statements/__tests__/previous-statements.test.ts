import { describe, it, expect, beforeEach } from 'vitest'
import {
  getPreviousStatements,
  getOpenNettedTransactions,
  ensureHistoricalStatementsSeeded,
} from '@/lib/statements/previous-statements'
import {
  resetLockedStatementsStore,
  saveLockedStatement,
  computeMonthlyStatement,
  settleStatement,
  unsettleStatement,
} from '@/lib/statements/bilateral-netting'
import { TENANT_A_COMPANY_ID } from '@/lib/company/active-company'

describe('previous-statements engine', () => {
  beforeEach(() => {
    resetLockedStatementsStore()
    ensureHistoricalStatementsSeeded(TENANT_A_COMPANY_ID)
  })

  it('retrieves seeded previous statements for closed months (2026-08 and 2026-07)', () => {
    const stmts = getPreviousStatements({ companyId: TENANT_A_COMPANY_ID })
    expect(stmts.length).toBeGreaterThanOrEqual(2)

    const aug = stmts.find((s) => s.month === '2026-08')
    expect(aug).toBeDefined()
    expect(aug?.settlementStatus).toBe('open')
    expect(aug?.isLocked).toBe(true)
    expect(aug?.billingPeriodStart).toBe('2026-08-01')
    expect(aug?.billingPeriodEnd).toBe('2026-08-31')
    expect(aug?.statementDate).toBe('2026-09-01')
    expect(aug?.statementDueDate).toBe('2026-09-25')
    expect(aug?.settlementAmountSek).toBe(12000)
    expect(aug?.settlementDirection).toBe('pay')
    expect(aug?.accountingVoucher?.isBalanced).toBe(true)
    expect(aug?.erpSyncStatus?.status).toBe('ready')

    const jul = stmts.find((s) => s.month === '2026-07')
    expect(jul).toBeDefined()
    expect(jul?.settlementStatus).toBe('settled')
    expect(jul?.isLocked).toBe(true)
    expect(jul?.settlementReference).toBe('NET-202607-NETWORK')
  })

  it('returns open netted transactions for current month when not yet converted to statement', () => {
    const res = getOpenNettedTransactions({
      companyId: TENANT_A_COMPANY_ID,
      currentMonth: '2026-09',
    })

    expect(res.hasOpenTransactions).toBe(true)
    expect(res.statement).toBeDefined()
    expect(res.statement?.month).toBe('2026-09')
    expect(res.statement?.settlementStatus).toBe('open')
    expect(res.statement?.isLocked).toBe(false)
    expect(res.statement?.receivables.length).toBeGreaterThan(0)
    expect(res.statement?.payables.length).toBeGreaterThan(0)
  })

  it('excludes month from open transactions once it is locked or settled and includes it in statements', () => {
    // 1. Lock the statement for 2026-09
    const stmt = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      month: '2026-09',
      counterpartyId: 'all',
    })
    stmt.isLocked = true
    stmt.lockReference = 'LOCK-202609-TEST'
    saveLockedStatement(stmt)

    // 2. Open transactions should now show none (all converted to statement)
    const openRes = getOpenNettedTransactions({
      companyId: TENANT_A_COMPANY_ID,
      currentMonth: '2026-09',
    })
    expect(openRes.hasOpenTransactions).toBe(false)
    expect(openRes.statement).toBeNull()

    // 3. Previous statements list should now include 2026-09 at the top
    const prevStmts = getPreviousStatements({ companyId: TENANT_A_COMPANY_ID })
    expect(prevStmts[0].month).toBe('2026-09')
    expect(prevStmts[0].isLocked).toBe(true)
    expect(prevStmts[0].lockReference).toBe('LOCK-202609-TEST')
  })

  it('settles and auto-completes accounting for August unpaid statement, then unsettles cleanly', () => {
    // 1. Initially August is open/unpaid with Bankgiro payment instructions
    const initial = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      month: '2026-08',
      counterpartyId: 'all',
    })
    expect(initial.settlementStatus).toBe('open')
    expect(initial.settlementAmountSek).toBe(12000)
    expect(initial.paymentInstructions).toBeDefined()
    expect(initial.paymentInstructions?.bankgiro).toBe('5050-1055')

    // 2. Settle the statement (user makes payment or settles)
    const settled = settleStatement(TENANT_A_COMPANY_ID, 'all', '2026-08', {
      reference: 'NET-202608-NETWORK',
    })
    expect(settled.settlementStatus).toBe('settled')
    expect(settled.settledAt).toBeDefined()
    expect(settled.accountingVoucher).toBeDefined()
    expect(settled.accountingVoucher?.isBalanced).toBe(true)
    expect(settled.accountingVoucher?.lines.length).toBe(3)

    // 3. Re-reading statement yields the settled state
    const afterSettle = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      month: '2026-08',
      counterpartyId: 'all',
    })
    expect(afterSettle.settlementStatus).toBe('settled')

    // 4. Unsettle (demo reset back to unpaid)
    const unsettled = unsettleStatement(TENANT_A_COMPANY_ID, 'all', '2026-08')
    expect(unsettled.settlementStatus).toBe('open')
    expect(unsettled.settledAt).toBeNull()

    const afterUnsettle = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      month: '2026-08',
      counterpartyId: 'all',
    })
    expect(afterUnsettle.settlementStatus).toBe('open')
  })
})
