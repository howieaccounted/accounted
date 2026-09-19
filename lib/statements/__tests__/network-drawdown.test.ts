import { describe, it, expect, beforeEach } from 'vitest'
import {
  computeMonthlyStatement,
  recordNetworkDrawdown,
  getNetworkDrawdowns,
  resetRuntimeSettlements,
  type NetworkDrawdown,
} from '@/lib/statements/bilateral-netting'
import {
  generateNettingVoucherTemplate,
  generateDrawdownVoucher,
} from '@/lib/statements/netting-erp-sync'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'

describe('network-drawdown & early statement accounting', () => {
  beforeEach(() => {
    resetRuntimeSettlements()
  })

  it('marks network customer invoices as verified and available for drawdown', () => {
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      month: '2026-09',
    })

    expect(statement.receivables.length).toBe(2)
    const inv1001 = statement.receivables.find((r) => r.invoiceNumber === '1001')
    expect(inv1001).toBeDefined()
    expect(inv1001?.isNetworkVerified).toBe(true)
    expect(inv1001?.drawdownStatus).toBe('available')
    expect(inv1001?.amountSek).toBe(15000)
  })

  it('generates an interim double-entry voucher on BAS 2890 upon drawdown', () => {
    const drawdown: NetworkDrawdown = {
      id: 'dd_1001',
      invoiceId: 'inv_1001',
      invoiceNumber: '1001',
      companyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      counterpartyName: 'Nordic Logistics AB',
      grossAmountSek: 15000,
      feePercent: 1.0,
      feeAmountSek: 150,
      netDisbursedSek: 14850,
      requestedAt: '2026-09-02T10:00:00.000Z',
      disbursedAt: '2026-09-02T10:00:00.000Z',
      destinationAccount: 'SEB Företagskonto (1930 / Bg 5050-1055)',
      status: 'completed',
      statementMonth: '2026-09',
      reference: 'DD-202609-1001',
    }

    const voucher = generateDrawdownVoucher(drawdown)
    expect(voucher.isBalanced).toBe(true)
    expect(voucher.totalDebitSek).toBe(15000)
    expect(voucher.totalCreditSek).toBe(15000)

    // Check lines
    const line1930 = voucher.lines.find((l) => l.accountNumber === '1930')
    const line6570 = voucher.lines.find((l) => l.accountNumber === '6570')
    const line2890 = voucher.lines.find((l) => l.accountNumber === '2890')

    expect(line1930?.debitSek).toBe(14850)
    expect(line6570?.debitSek).toBe(150)
    expect(line2890?.creditSek).toBe(15000)
  })

  it('deducts early drawdowns on statement creation and marks invoice as drawn', () => {
    // 1. Initial statement before drawdown
    const initial = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      month: '2026-09',
    })
    expect(initial.grossNetSek).toBe(-4000)
    expect(initial.totalEarlyDrawdownsSek).toBe(0)
    expect(initial.netAmountSek).toBe(-4000)
    expect(initial.settlementAmountSek).toBe(4000)
    expect(initial.settlementDirection).toBe('pay')

    // 2. Record an early drawdown of 15,000 SEK on Invoice 1001
    const drawdown: NetworkDrawdown = {
      id: 'dd_1001',
      invoiceId: initial.receivables[0].id,
      invoiceNumber: '1001',
      companyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      counterpartyName: 'Nordic Logistics AB',
      grossAmountSek: 15000,
      feePercent: 1.0,
      feeAmountSek: 150,
      netDisbursedSek: 14850,
      requestedAt: '2026-09-02T10:00:00.000Z',
      disbursedAt: '2026-09-02T10:00:00.000Z',
      destinationAccount: 'SEB Företagskonto (1930)',
      status: 'completed',
      statementMonth: '2026-09',
      reference: 'DD-202609-1001',
    }
    recordNetworkDrawdown(drawdown)

    // 3. Re-compute statement
    const updated = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      month: '2026-09',
    })

    // Invoice status should now be 'drawn'
    const drawnInv = updated.receivables.find((r) => r.invoiceNumber === '1001')
    expect(drawnInv?.drawdownStatus).toBe('drawn')
    expect(drawnInv?.drawdown?.netDisbursedSek).toBe(14850)

    // Totals should reflect early drawdown
    expect(updated.totalReceivablesSek).toBe(25000)
    expect(updated.totalPayablesSek).toBe(29000)
    expect(updated.grossNetSek).toBe(-4000)
    expect(updated.totalEarlyDrawdownsSek).toBe(15000)
    // Net to pay: -4000 - 15000 = -19,000 SEK
    expect(updated.netAmountSek).toBe(-19000)
    expect(updated.settlementAmountSek).toBe(19000)
    expect(updated.settlementDirection).toBe('pay')
    expect(updated.earlyDrawdowns.length).toBe(1)
  })

  it('produces a perfectly balanced month-end settlement voucher including BAS 2890', () => {
    // Record early drawdown of 15,000 SEK
    recordNetworkDrawdown({
      id: 'dd_1001',
      invoiceId: 'a0000001-0000-4000-8000-000000000001',
      invoiceNumber: '1001',
      companyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      counterpartyName: 'Nordic Logistics AB',
      grossAmountSek: 15000,
      feePercent: 1.0,
      feeAmountSek: 150,
      netDisbursedSek: 14850,
      requestedAt: '2026-09-02T10:00:00.000Z',
      disbursedAt: '2026-09-02T10:00:00.000Z',
      destinationAccount: 'SEB Företagskonto (1930)',
      status: 'completed',
      statementMonth: '2026-09',
      reference: 'DD-202609-1001',
    })

    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      month: '2026-09',
    })

    const voucher = generateNettingVoucherTemplate(statement)
    expect(voucher.isBalanced).toBe(true)

    // Lines:
    // Debit 2440 (Leverantörsskulder): 29,000
    // Debit 2890 (Kortfristig avräkning nätverk): 15,000
    // Credit 1510 (Kundfordringar): 25,000
    // Credit 1930 (Företagskonto): 19,000
    const l2440 = voucher.lines.find((l) => l.accountNumber === '2440')
    const l2890 = voucher.lines.find((l) => l.accountNumber === '2890')
    const l1510 = voucher.lines.find((l) => l.accountNumber === '1510')
    const l1930 = voucher.lines.find((l) => l.accountNumber === '1930')

    expect(l2440?.debitSek).toBe(29000)
    expect(l2890?.debitSek).toBe(15000)
    expect(l1510?.creditSek).toBe(25000)
    expect(l1930?.creditSek).toBe(19000)

    expect(voucher.totalDebitSek).toBe(44000)
    expect(voucher.totalCreditSek).toBe(44000)
    expect(voucher.sieContent).toContain('#TRANS 2890 {} 15000.00')
  })
})
