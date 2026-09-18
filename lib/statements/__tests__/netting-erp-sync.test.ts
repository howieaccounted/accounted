import { describe, it, expect } from 'vitest'
import {
  generateNettingVoucherTemplate,
  generateStandaloneSie4File,
  syncNettingToAccounting,
} from '@/lib/statements/netting-erp-sync'
import {
  computeMonthlyStatement,
  settleStatement,
  resetRuntimeSettlements,
} from '@/lib/statements/bilateral-netting'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'

describe('netting-erp-sync (Automated Bookkeeping & ERP Sync-Back)', () => {
  it('generates a perfectly balanced double-entry voucher for net payable (Debit 2440, Credit 1510, Credit 1930)', () => {
    resetRuntimeSettlements()
    // Company A owes net settlement for 2026-09
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      counterpartyId: 'all',
      month: '2026-09',
    })

    expect(statement.settlementDirection).toBe('pay')
    expect(statement.totalReceivablesSek).toBe(25000)
    expect(statement.totalPayablesSek).toBe(29000)
    expect(statement.settlementAmountSek).toBe(4000)

    const voucher = generateNettingVoucherTemplate(statement)

    // Verify voucher structure
    expect(voucher.isBalanced).toBe(true)
    expect(voucher.totalDebitSek).toBe(29000)
    expect(voucher.totalCreditSek).toBe(29000)

    // Lines breakdown
    const line2440 = voucher.lines.find((l) => l.accountNumber === '2440')
    const line1510 = voucher.lines.find((l) => l.accountNumber === '1510')
    const line1930 = voucher.lines.find((l) => l.accountNumber === '1930')

    expect(line2440).toBeDefined()
    expect(line2440?.debitSek).toBe(29000)
    expect(line2440?.creditSek).toBe(0)

    expect(line1510).toBeDefined()
    expect(line1510?.debitSek).toBe(0)
    expect(line1510?.creditSek).toBe(25000)

    expect(line1930).toBeDefined()
    expect(line1930?.debitSek).toBe(0)
    expect(line1930?.creditSek).toBe(4000)

    // Verify SIE snippet content
    expect(voucher.sieContent).toContain('#VER "A"')
    expect(voucher.sieContent).toContain('#TRANS 2440 {} 29000.00')
    expect(voucher.sieContent).toContain('#TRANS 1510 {} -25000.00')
    expect(voucher.sieContent).toContain('#TRANS 1930 {} -4000.00')
  })

  it('generates a perfectly balanced double-entry voucher for net receivable (Debit 2440, Debit 1930, Credit 1510)', () => {
    resetRuntimeSettlements()
    // Company B receives net settlement for 2026-09
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_B_COMPANY_ID,
      counterpartyId: 'all',
      month: '2026-09',
    })

    expect(statement.settlementDirection).toBe('receive')
    expect(statement.totalReceivablesSek).toBe(29000)
    expect(statement.totalPayablesSek).toBe(25000)
    expect(statement.settlementAmountSek).toBe(4000)

    const voucher = generateNettingVoucherTemplate(statement)

    expect(voucher.isBalanced).toBe(true)
    expect(voucher.totalDebitSek).toBe(29000)
    expect(voucher.totalCreditSek).toBe(29000)

    const line2440 = voucher.lines.find((l) => l.accountNumber === '2440')
    const line1510 = voucher.lines.find((l) => l.accountNumber === '1510')
    const line1930 = voucher.lines.find((l) => l.accountNumber === '1930')

    expect(line2440?.debitSek).toBe(25000)
    expect(line1510?.creditSek).toBe(29000)
    // Bank is debited when money is received
    expect(line1930?.debitSek).toBe(4000)
    expect(line1930?.creditSek).toBe(0)

    expect(voucher.sieContent).toContain('#TRANS 2440 {} 25000.00')
    expect(voucher.sieContent).toContain('#TRANS 1930 {} 4000.00')
    expect(voucher.sieContent).toContain('#TRANS 1510 {} -29000.00')
  })

  it('generates a standalone SIE4 export file with compliant Swedish headers', () => {
    resetRuntimeSettlements()
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      month: '2026-09',
    })
    const voucher = generateNettingVoucherTemplate(statement)

    const sieFile = generateStandaloneSie4File({
      statement,
      voucher,
      companyName: 'Riminton AB',
      orgNumber: '556000-0001',
    })

    expect(sieFile).toContain('#FLAGGA 0')
    expect(sieFile).toContain('#FORMAT PC8')
    expect(sieFile).toContain('#SIETYP 4')
    expect(sieFile).toContain('#FNAMN "Riminton AB"')
    expect(sieFile).toContain('#ORGNR 556000-0001')
    expect(sieFile).toContain('#KPTYP BAS2024')
    expect(sieFile).toContain('#VER "A"')
    expect(sieFile).toContain('#TRANS 2440')
    expect(sieFile).toContain('#TRANS 1510')
  })

  it('automatically attaches accounting voucher and completed sync status when statement is settled', () => {
    resetRuntimeSettlements()
    const settled = settleStatement(TENANT_A_COMPANY_ID, 'all', '2026-09', {
      reference: 'NET-202609-NETWORK',
    })

    expect(settled.settlementStatus).toBe('settled')
    expect(settled.accountingVoucher).toBeDefined()
    expect(settled.accountingVoucher?.isBalanced).toBe(true)
    expect(settled.accountingVoucher?.status).toBe('auto_synced')
    expect(settled.erpSyncStatus).toBeDefined()
    expect(settled.erpSyncStatus?.status).toBe('completed')
    expect(settled.erpSyncStatus?.invoicesClearedCount).toBe(settled.receivables.length)
    expect(settled.erpSyncStatus?.supplierInvoicesClearedCount).toBe(settled.payables.length)
  })

  it('syncNettingToAccounting returns valid result and updates underlying invoices count', async () => {
    resetRuntimeSettlements()
    const statement = computeMonthlyStatement({
      activeCompanyId: TENANT_A_COMPANY_ID,
      month: '2026-09',
    })

    const result = await syncNettingToAccounting(statement)
    expect(result.status).toBe('completed')
    expect(result.voucher.isBalanced).toBe(true)
    expect(result.invoicesClearedCount).toBeGreaterThan(0)
    expect(result.supplierInvoicesClearedCount).toBeGreaterThan(0)
  })
})
