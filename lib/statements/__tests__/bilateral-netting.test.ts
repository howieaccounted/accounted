import { describe, it, expect, beforeEach } from 'vitest'
import {
  computeMonthlyStatement,
  getConnectedCounterparties,
  settleStatement,
  resetRuntimeSettlements,
  getStatementDates,
} from '@/lib/statements/bilateral-netting'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import type { Invoice } from '@/types'

describe('bilateral-netting service', () => {
  beforeEach(() => {
    resetRuntimeSettlements()
  })

  it('detects connected counterparties between Company A and Company B', () => {
    const counterpartiesA = getConnectedCounterparties(TENANT_A_COMPANY_ID)
    expect(counterpartiesA.length).toBeGreaterThanOrEqual(1)
    expect(counterpartiesA[0].name).toBe('Nordic Logistics AB (Tenant B)')
    expect(counterpartiesA[0].orgNumber).toBe('556123-4567')
    expect(counterpartiesA[0].isConnected).toBe(true)

    const counterpartiesB = getConnectedCounterparties(TENANT_B_COMPANY_ID)
    expect(counterpartiesB.length).toBeGreaterThanOrEqual(1)
    expect(counterpartiesB[0].name).toBe('Riminton AB (Company A)')
    expect(counterpartiesB[0].orgNumber).toBe('556000-0001')
  })

  it('computes Company A bilateral netting for September 2026 with exact single settlement amount to pay', () => {
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      month: '2026-09',
    })

    // Receivables (Customer invoices: 1001 for 15,000 and 1002 for 10,000)
    expect(statement.receivables.length).toBe(2)
    expect(statement.totalReceivablesSek).toBe(25000)

    // Payables (Supplier invoices: NL-88101 for 20,000 and NL-88102 for 9,000)
    expect(statement.payables.length).toBe(2)
    expect(statement.totalPayablesSek).toBe(29000)

    // Net position: 25,000 - 29,000 = -4,000 SEK
    expect(statement.netAmountSek).toBe(-4000)
    expect(statement.settlementDirection).toBe('pay')
    expect(statement.settlementAmountSek).toBe(4000)
    expect(statement.settlementStatus).toBe('open')
  })

  it('computes Company B reciprocal bilateral netting with exact single settlement amount to receive', () => {
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_B_COMPANY_ID,
      counterpartyId: TENANT_A_COMPANY_ID,
      month: '2026-09',
    })

    // From Company B's perspective, they billed 29,000 and were billed 25,000
    expect(statement.totalReceivablesSek).toBe(29000)
    expect(statement.totalPayablesSek).toBe(25000)
    expect(statement.netAmountSek).toBe(4000)
    expect(statement.settlementDirection).toBe('receive')
    expect(statement.settlementAmountSek).toBe(4000)
  })

  it('settles a monthly statement and marks all netted transactions as settled', () => {
    const settled = settleStatement(TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID, '2026-09', {
      reference: 'NET-202609-NL',
      notes: 'Bilateral settlement completed via Accounted',
    })

    expect(settled.settlementStatus).toBe('settled')
    expect(settled.settlementReference).toBe('NET-202609-NL')
    expect(settled.settledAt).toBeDefined()
    expect(settled.settlementNotes).toBe('Bilateral settlement completed via Accounted')

    // Subsequent retrieval reflects settled state
    const retrieved = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      month: '2026-09',
    })
    expect(retrieved.settlementStatus).toBe('settled')
    expect(retrieved.settlementReference).toBe('NET-202609-NL')
  })

  it('handles empty months without transactions gracefully', () => {
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      month: '2025-01',
    })

    expect(statement.receivables.length).toBe(0)
    expect(statement.payables.length).toBe(0)
    expect(statement.totalReceivablesSek).toBe(0)
    expect(statement.totalPayablesSek).toBe(0)
    expect(statement.netAmountSek).toBe(0)
    expect(statement.settlementDirection).toBe('balanced')
    expect(statement.settlementAmountSek).toBe(0)
  })

  it('computes network-wide multilateral netting covering all connected companies in the Accounted network', () => {
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: 'all',
      month: '2026-09',
    })

    expect(statement.isNetworkWide).toBe(true)
    expect(statement.scope).toBe('all')
    expect(statement.counterparty).toBeNull()

    // Must have connected counterparties in breakdown
    expect(statement.counterpartySummaries.length).toBeGreaterThanOrEqual(1)

    // Verify mathematical integrity: sum of counterparty nets must equal total net
    const sumCounterpartyNets = statement.counterpartySummaries.reduce((acc, c) => acc + c.netSek, 0)
    expect(sumCounterpartyNets).toBe(statement.netAmountSek)

    // Total receivables and payables must be positive and non-zero
    expect(statement.totalReceivablesSek).toBeGreaterThan(0)
    expect(statement.totalPayablesSek).toBeGreaterThan(0)
    expect(statement.settlementAmountSek).toBe(Math.abs(statement.netAmountSek))

    // Every item in receivables and payables must specify its counterparty name
    for (const rec of statement.receivables) {
      expect(rec.counterpartyName).toBeDefined()
      expect(rec.counterpartyName.length).toBeGreaterThan(0)
    }
    for (const pay of statement.payables) {
      expect(pay.counterpartyName).toBeDefined()
      expect(pay.counterpartyName.length).toBeGreaterThan(0)
    }
  })

  it('strictly excludes any companies that are not connected to the Accounted network', () => {
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: 'all',
      month: '2026-09',
    })

    const allPartyNames = [
      ...statement.counterpartySummaries.map((c) => c.name),
      ...statement.receivables.map((r) => r.counterpartyName),
      ...statement.payables.map((p) => p.counterpartyName),
    ].map((n) => n.toLowerCase())

    // Fortnox, Dustin, Telia, AWS, etc. must NEVER appear in the statement
    expect(allPartyNames.some((n) => n.includes('fortnox'))).toBe(false)
    expect(allPartyNames.some((n) => n.includes('dustin'))).toBe(false)
    expect(allPartyNames.some((n) => n.includes('telia'))).toBe(false)
    expect(allPartyNames.some((n) => n.includes('aws') || n.includes('amazon'))).toBe(false)

    // Only connected network companies appear
    expect(statement.counterpartySummaries.every((c) => c.isConnected)).toBe(true)
  })

  it('settles a network-wide statement across all companies in the Accounted network', () => {
    const settled = settleStatement(TENANT_A_COMPANY_ID, 'all', '2026-09', {
      reference: 'NET-202609-NETWORK',
      notes: 'Multilateral network settlement completed via Accounted',
    })

    expect(settled.settlementStatus).toBe('settled')
    expect(settled.settlementReference).toBe('NET-202609-NETWORK')
    expect(settled.settledAt).toBeDefined()
    expect(settled.isNetworkWide).toBe(true)

    const retrieved = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: 'all',
      month: '2026-09',
    })
    expect(retrieved.settlementStatus).toBe('settled')
    expect(retrieved.settlementReference).toBe('NET-202609-NETWORK')
  })

  describe('Option A (Issue Date Cut-off / Credit Card Network Cycle)', () => {
    it('calculates correct statement dates: billing period, statement issue date (1st), and network due date (25th)', () => {
      const datesSept = getStatementDates('2026-09')
      expect(datesSept.billingPeriodStart).toBe('2026-09-01')
      expect(datesSept.billingPeriodEnd).toBe('2026-09-30')
      expect(datesSept.statementDate).toBe('2026-10-01')
      expect(datesSept.statementDueDate).toBe('2026-10-25')

      // Year boundary rollover
      const datesDec = getStatementDates('2026-12')
      expect(datesDec.billingPeriodStart).toBe('2026-12-01')
      expect(datesDec.billingPeriodEnd).toBe('2026-12-31')
      expect(datesDec.statementDate).toBe('2027-01-01')
      expect(datesDec.statementDueDate).toBe('2027-01-25')
    })

    it('populates Option A metadata in the monthly statement', () => {
      const statement = computeMonthlyStatement({
        activeCompanyId: TENANT_A_COMPANY_ID,
        counterpartyId: TENANT_B_COMPANY_ID,
        month: '2026-09',
      })

      expect(statement.selectionCriterion).toBe('issue_date')
      expect(statement.billingPeriodStart).toBe('2026-09-01')
      expect(statement.billingPeriodEnd).toBe('2026-09-30')
      expect(statement.statementDate).toBe('2026-10-01')
      expect(statement.statementDueDate).toBe('2026-10-25')
    })

    it('strictly includes invoices based on issue date even when their individual due date is in the next month', () => {
      // Invoices 1001 & 1002 and NL-88101 & NL-88102 are issued in September but due in October
      const statement = computeMonthlyStatement({
        activeCompanyId: TENANT_A_COMPANY_ID,
        counterpartyId: TENANT_B_COMPANY_ID,
        month: '2026-09',
      })

      // All 4 invoices are properly included in the September statement
      expect(statement.receivables.length).toBe(2)
      expect(statement.receivables.every((r) => r.invoiceDate.startsWith('2026-09'))).toBe(true)
      expect(statement.payables.length).toBe(2)
      expect(statement.payables.every((p) => p.invoiceDate.startsWith('2026-09'))).toBe(true)
    })

    it('strictly excludes invoices issued in other months even if their due date falls into the statement month', () => {
      // Create test invoice issued in August with due date in September
      const augustInvoice = {
        id: 'test-august-inv',
        company_id: TENANT_A_COMPANY_ID,
        customer_id: TENANT_B_COMPANY_ID,
        invoice_number: 'AUG-001',
        invoice_date: '2026-08-15',
        due_date: '2026-09-15', // Due in September, but issued in August
        total: 5000,
        total_sek: 5000,
        status: 'sent',
        customer: {
          id: TENANT_B_COMPANY_ID,
          name: 'Nordic Logistics AB (Tenant B)',
          org_number: '556123-4567',
        },
      }

      const statement = computeMonthlyStatement({
        activeCompanyId: TENANT_A_COMPANY_ID,
        counterpartyId: TENANT_B_COMPANY_ID,
        month: '2026-09',
        liveCustomerInvoices: [augustInvoice as unknown as Invoice],
      })

      // Must NOT include the August-issued invoice in September statement despite its September due date
      expect(statement.receivables.some((r) => r.invoiceNumber === 'AUG-001')).toBe(false)
      expect(statement.receivables.length).toBe(0)
    })
  })
})
