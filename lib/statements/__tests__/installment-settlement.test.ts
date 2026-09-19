import { describe, it, expect, beforeEach } from 'vitest'
import {
  simulateInstallmentPlan,
  simulateInstallmentOptions,
  createStatementInstallmentPlan,
  getStatementInstallmentPlan,
  cancelStatementInstallmentPlan,
  resetStatementInstallmentPlans,
  computeMonthlyStatement,
  INSTALLMENT_FEE_RATES,
} from '@/lib/statements/bilateral-netting'
import {
  generateInstallmentPlanVoucher,
  generateInstallmentPaymentVoucher,
  generateNettingVoucherTemplate,
} from '@/lib/statements/netting-erp-sync'
import { TENANT_A_COMPANY_ID } from '@/lib/company/active-company'

describe('Installment Settlement & BAS 2840 Accounting', () => {
  beforeEach(() => {
    resetStatementInstallmentPlans()
  })

  describe('Installment Simulation Engine', () => {
    it('accurately calculates 2, 3, and 4 month simulations with exact öre balancing', () => {
      const principal = 42500.5 // 42,500.50 SEK
      const startDate = '2026-10-25'

      const options = simulateInstallmentOptions(principal, startDate)
      expect(options).toHaveLength(3)

      for (const opt of options) {
        expect([2, 3, 4]).toContain(opt.termMonths)
        expect(opt.feeRatePercentage).toBe(INSTALLMENT_FEE_RATES[opt.termMonths])
        expect(opt.schedule).toHaveLength(opt.termMonths)

        // Verify exact öre sums match the totals
        const sumAmounts = Number(opt.schedule.reduce((acc, s) => acc + s.amountSek, 0).toFixed(2))
        const sumPrincipals = Number(opt.schedule.reduce((acc, s) => acc + s.principalSek, 0).toFixed(2))
        const sumFees = Number(opt.schedule.reduce((acc, s) => acc + s.feeSek, 0).toFixed(2))

        expect(sumAmounts).toBe(opt.totalPayableSek)
        expect(sumPrincipals).toBe(principal)
        expect(sumFees).toBe(opt.totalFeeSek)
        expect(Number((opt.totalPayableSek - opt.totalFeeSek).toFixed(2))).toBe(principal)

        // Verify dates increment month by month on the 25th
        expect(opt.schedule[0].dueDate).toBe('2026-10-25')
        expect(opt.schedule[1].dueDate).toBe('2026-11-25')
        if (opt.termMonths >= 3) {
          expect(opt.schedule[2].dueDate).toBe('2026-12-25')
        }
        if (opt.termMonths === 4) {
          expect(opt.schedule[3].dueDate).toBe('2027-01-25')
        }
      }
    })

    it('returns empty array when principal is zero or negative', () => {
      expect(simulateInstallmentOptions(0)).toEqual([])
      expect(simulateInstallmentOptions(-500)).toEqual([])
    })
  })

  describe('Plan Lifecycle Store', () => {
    it('creates, retrieves, and cancels an installment plan', () => {
      const plan = createStatementInstallmentPlan({
        companyId: TENANT_A_COMPANY_ID,
        statementMonth: '2026-09',
        principalSek: 30000,
        termMonths: 3,
        paymentMethod: 'autogiro',
        autogiroMandateRef: 'AG-556000-0001',
        startDate: '2026-10-25',
      })

      expect(plan.planId).toContain('PLAN-202609')
      expect(plan.status).toBe('active')
      expect(plan.termMonths).toBe(3)
      expect(plan.totalPrincipalSek).toBe(30000)
      expect(plan.schedule).toHaveLength(3)

      const retrieved = getStatementInstallmentPlan(TENANT_A_COMPANY_ID, '2026-09')
      expect(retrieved).not.toBeNull()
      expect(retrieved?.planId).toBe(plan.planId)

      const cancelled = cancelStatementInstallmentPlan(TENANT_A_COMPANY_ID, '2026-09')
      expect(cancelled).toBe(true)
      expect(getStatementInstallmentPlan(TENANT_A_COMPANY_ID, '2026-09')).toBeNull()
    })
  })

  describe('Double-Entry Bookkeeping on BAS 2840', () => {
    it('generates a balanced BAS 2840 plan voucher with exact Debits equal Credits', () => {
      const statement = computeMonthlyStatement({
        activeCompanyId: TENANT_A_COMPANY_ID,
        month: '2026-09',
      })

      // Ensure statement has payables
      expect(statement.totalPayablesSek).toBeGreaterThan(0)

      const plan = createStatementInstallmentPlan({
        companyId: TENANT_A_COMPANY_ID,
        statementMonth: '2026-09',
        principalSek: statement.settlementAmountSek,
        termMonths: 3,
        paymentMethod: 'autogiro',
        startDate: statement.statementDueDate,
      })

      const voucher = generateInstallmentPlanVoucher(statement, plan)

      expect(voucher.isBalanced).toBe(true)
      expect(voucher.totalDebitSek).toBe(voucher.totalCreditSek)

      // Account presence
      const debitAccounts = voucher.lines.filter((l) => l.debitSek > 0).map((l) => l.accountNumber)
      const creditAccounts = voucher.lines.filter((l) => l.creditSek > 0).map((l) => l.accountNumber)

      expect(debitAccounts).toContain('2440') // Clears supplier invoices
      expect(debitAccounts).toContain('6570') // Fee
      expect(creditAccounts).toContain('2840') // Short-term loan liability

      if (statement.totalReceivablesSek > 0) {
        expect(creditAccounts).toContain('1510') // Clears customer receivables
      }

      // Check SIE4 export snippet
      expect(voucher.sieContent).toContain('#TRANS 2840')
      expect(voucher.sieContent).toContain('#TRANS 2440')
    })

    it('generates a balanced monthly installment payment voucher (Debit 2840, Credit 1930)', () => {
      const plan = createStatementInstallmentPlan({
        companyId: TENANT_A_COMPANY_ID,
        statementMonth: '2026-09',
        principalSek: 15000,
        termMonths: 3,
        paymentMethod: 'autogiro',
        startDate: '2026-10-25',
      })

      const installment = plan.schedule[0]
      const paymentVoucher = generateInstallmentPaymentVoucher(plan, installment)

      expect(paymentVoucher.isBalanced).toBe(true)
      expect(paymentVoucher.totalDebitSek).toBe(installment.amountSek)
      expect(paymentVoucher.totalCreditSek).toBe(installment.amountSek)

      const debitLine = paymentVoucher.lines.find((l) => l.accountNumber === '2840')
      const creditLine = paymentVoucher.lines.find((l) => l.accountNumber === '1930')

      expect(debitLine?.debitSek).toBe(installment.amountSek)
      expect(creditLine?.creditSek).toBe(installment.amountSek)
      expect(paymentVoucher.sieContent).toContain('#TRANS 2840')
      expect(paymentVoucher.sieContent).toContain('#TRANS 1930')
    })

    it('integrates seamlessly with generateNettingVoucherTemplate when statement has active installment plan', () => {
      const statement = computeMonthlyStatement({
        activeCompanyId: TENANT_A_COMPANY_ID,
        month: '2026-09',
      })

      const plan = createStatementInstallmentPlan({
        companyId: TENANT_A_COMPANY_ID,
        statementMonth: '2026-09',
        principalSek: statement.settlementAmountSek,
        termMonths: 2,
        paymentMethod: 'autogiro',
        startDate: statement.statementDueDate,
      })

      statement.installmentPlan = plan

      const template = generateNettingVoucherTemplate(statement)
      expect(template.isBalanced).toBe(true)
      expect(template.totalDebitSek).toBe(template.totalCreditSek)

      const creditAccounts = template.lines.filter((l) => l.creditSek > 0).map((l) => l.accountNumber)
      expect(creditAccounts).toContain('2840')
      expect(creditAccounts).not.toContain('1930') // 1930 should not be credited at settlement when installment plan is active
    })
  })
})
