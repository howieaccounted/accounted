import { describe, expect, it } from 'vitest'
import {
  calculateCreditLimits,
  evaluateInstallmentEligibility,
  evaluateInvoiceDrawdownEligibility,
} from '../limit-calculator'
import {
  computeAccountedNetworkScore,
  determineCreditRiskTier,
  evaluateUnderwritingGates,
} from '../scoring-engine'
import { CompanyCreditProfile } from '../types'

function createMockCreditProfile(
  overrides: Partial<CompanyCreditProfile> = {}
): CompanyCreditProfile {
  return {
    companyId: 'company-nordic-tech',
    organizationNumber: '556999-1234',
    companyName: 'Nordic Tech Solutions AB',
    isSwedishCorporateEntity: true,
    hasActiveFSkatt: true,
    hasActiveMoms: true,
    platformTenureDays: 120,
    completedSettlementCycles: 4,

    // Compliance & Tax
    kronofogdenDebtSek: 0,
    skattekontoBalanceSek: 15000,
    skattekontoArrearsDays: 0,

    // Balance Sheet Solvency
    registeredShareCapitalSek: 50000,
    totalEquitySek: 450000,
    totalAssetsSek: 1200000,
    bankBalanceSek: 350000,
    customerReceivablesSek: 250000,
    supplierPayablesSek: 180000,
    shortTermDebtSek: 20000,
    annualTurnoverSek: 4800000,
    operatingProfitEbitdaSek: 580000,

    // Network Trade Dynamics
    monthlyNetworkReceivablesSek: 120000,
    monthlyNetworkPayablesSek: 80000,
    medianAttestationHours: 24,
    disputeAndCreditNoteRatio: 0.005,

    // Cash Flow Telemetry
    dailyNetOperatingCashBurnSek: 1200,
    positiveCashFlowMonthsInLast3: 3,
    minBankBalance30dSek: 180000,

    // Repayment History
    failedAutogiroCount: 0,
    hasHistoricalDefault: false,
    ...overrides,
  }
}

describe('Accounted Network Credit Scoring Engine (ANS)', () => {
  it('computes Tier 1 Prime for healthy profile', () => {
    const profile = createMockCreditProfile()
    const result = computeAccountedNetworkScore(profile)

    expect(result.passedAllGates).toBe(true)
    expect(result.totalScore).toBeGreaterThanOrEqual(85)
    expect(result.tier).toBe('tier_1_prime')

    // Verify all 4 pillars exist and have points
    expect(result.pillars).toHaveLength(4)
    expect(result.pillars.find((p) => p.pillarId === 'solvency_and_balance_sheet')?.pointsEarned).toBeGreaterThan(25)
    expect(result.pillars.find((p) => p.pillarId === 'network_trade_reciprocity')?.pointsEarned).toBeGreaterThan(20)
    expect(result.pillars.find((p) => p.pillarId === 'cash_flow_and_runway')?.pointsEarned).toBeGreaterThan(18)
    expect(result.pillars.find((p) => p.pillarId === 'repayment_track_record')?.pointsEarned).toBe(10)
  })

  it('fails GATE_KRONOFOGDEN when active enforcement debt exists', () => {
    const profile = createMockCreditProfile({ kronofogdenDebtSek: 12500 })
    const gates = evaluateUnderwritingGates(profile)
    const kfGate = gates.find((g) => g.gateId === 'GATE_KRONOFOGDEN')

    expect(kfGate?.passed).toBe(false)
    expect(kfGate?.failureReason).toContain('Kronofogdemyndigheten')

    const score = computeAccountedNetworkScore(profile)
    expect(score.passedAllGates).toBe(false)
    expect(score.totalScore).toBe(0)
    expect(score.tier).toBe('tier_4_ineligible')
  })

  it('fails GATE_SKATTEKONTO when tax arrears exceed 10 000 SEK for > 14 days', () => {
    const profile = createMockCreditProfile({
      skattekontoBalanceSek: -25000,
      skattekontoArrearsDays: 21,
    })
    const gates = evaluateUnderwritingGates(profile)
    const taxGate = gates.find((g) => g.gateId === 'GATE_SKATTEKONTO')

    expect(taxGate?.passed).toBe(false)

    const score = computeAccountedNetworkScore(profile)
    expect(score.passedAllGates).toBe(false)
    expect(score.tier).toBe('tier_4_ineligible')
  })

  it('allows minor or transient Skattekonto balance within tolerance', () => {
    const profile = createMockCreditProfile({
      skattekontoBalanceSek: -4000,
      skattekontoArrearsDays: 5,
    })
    const gates = evaluateUnderwritingGates(profile)
    const taxGate = gates.find((g) => g.gateId === 'GATE_SKATTEKONTO')

    expect(taxGate?.passed).toBe(true)
  })

  it('fails GATE_ABL_EQUITY when equity falls below 50% of registered share capital', () => {
    const profile = createMockCreditProfile({
      registeredShareCapitalSek: 50000,
      totalEquitySek: 20000, // < 25,000 SEK required
    })
    const gates = evaluateUnderwritingGates(profile)
    const ablGate = gates.find((g) => g.gateId === 'GATE_ABL_EQUITY')

    expect(ablGate?.passed).toBe(false)
    expect(ablGate?.failureReason).toContain('Kontrollbalansräkning')

    const score = computeAccountedNetworkScore(profile)
    expect(score.tier).toBe('tier_4_ineligible')
  })

  it('fails GATE_TENURE when company is new (< 30 days or < 2 cycles)', () => {
    const profile = createMockCreditProfile({
      platformTenureDays: 14,
      completedSettlementCycles: 0,
    })
    const gates = evaluateUnderwritingGates(profile)
    const tenureGate = gates.find((g) => g.gateId === 'GATE_TENURE')

    expect(tenureGate?.passed).toBe(false)
  })

  it('fails GATE_COMPANY_FORM when missing F-Skatt or not corporate entity', () => {
    const profile = createMockCreditProfile({ hasActiveFSkatt: false })
    const gates = evaluateUnderwritingGates(profile)
    const formGate = gates.find((g) => g.gateId === 'GATE_COMPANY_FORM')

    expect(formGate?.passed).toBe(false)
  })

  it('assigns correct risk tier boundaries', () => {
    expect(determineCreditRiskTier(90, true)).toBe('tier_1_prime')
    expect(determineCreditRiskTier(85, true)).toBe('tier_1_prime')
    expect(determineCreditRiskTier(75, true)).toBe('tier_2_standard')
    expect(determineCreditRiskTier(70, true)).toBe('tier_2_standard')
    expect(determineCreditRiskTier(60, true)).toBe('tier_3_elevated')
    expect(determineCreditRiskTier(54, true)).toBe('tier_4_ineligible')
    expect(determineCreditRiskTier(95, false)).toBe('tier_4_ineligible')
  })
})

describe('Dynamic Credit Limits & Exposure Engine', () => {
  it('calculates Tier 1 limits and sub-caps correctly', () => {
    const profile = createMockCreditProfile()
    const score = computeAccountedNetworkScore(profile)
    const limits = calculateCreditLimits(profile, score)

    expect(limits.tier).toBe('tier_1_prime')
    expect(limits.maxInvoiceAdvanceRatePercentage).toBe(95)
    expect(limits.invoiceAdvanceFeePercentage).toBe(0.75)
    expect(limits.eligibleInstallmentTerms).toEqual([2, 3, 4])
    expect(limits.maxTotalExposureSek).toBeGreaterThan(50000)
    expect(limits.maxInvoiceAdvanceSek).toBeLessThanOrEqual(limits.maxTotalExposureSek)
    expect(limits.maxInstallmentPrincipalSek).toBeLessThanOrEqual(limits.maxTotalExposureSek)
  })

  it('returns zero limits for ineligible Tier 4 companies', () => {
    const profile = createMockCreditProfile({ kronofogdenDebtSek: 10000 })
    const score = computeAccountedNetworkScore(profile)
    const limits = calculateCreditLimits(profile, score)

    expect(limits.tier).toBe('tier_4_ineligible')
    expect(limits.maxTotalExposureSek).toBe(0)
    expect(limits.maxInvoiceAdvanceSek).toBe(0)
    expect(limits.maxInstallmentPrincipalSek).toBe(0)
    expect(limits.eligibleInstallmentTerms).toEqual([])
  })

  it('evaluates invoice advance eligibility and fees with exact precision', () => {
    const profile = createMockCreditProfile()
    const score = computeAccountedNetworkScore(profile)
    const limits = calculateCreditLimits(profile, score)

    const evaluation = evaluateInvoiceDrawdownEligibility({
      invoiceId: 'inv-1001',
      invoiceNumber: '#1001',
      grossAmountSek: 10000,
      isNetworkVerified: true,
      isAlreadyDrawn: false,
      currentDebtorExposureSek: 0,
      currentTotalAdvanceExposureSek: 0,
      limits,
    })

    expect(evaluation.isEligible).toBe(true)
    expect(evaluation.grossAmountSek).toBe(10000)
    expect(evaluation.advanceRatePercentage).toBe(95)
    expect(evaluation.advanceAmountSek).toBe(9500) // 95% of 10,000
    expect(evaluation.feePercentage).toBe(0.75)
    expect(evaluation.feeAmountSek).toBe(71.25) // 0.75% of 9,500
    expect(evaluation.netPayoutSek).toBe(9428.75) // 9,500 - 71.25
  })

  it('rejects invoice advance when unverified or already drawn', () => {
    const profile = createMockCreditProfile()
    const score = computeAccountedNetworkScore(profile)
    const limits = calculateCreditLimits(profile, score)

    const unverified = evaluateInvoiceDrawdownEligibility({
      invoiceId: 'inv-1002',
      invoiceNumber: '#1002',
      grossAmountSek: 10000,
      isNetworkVerified: false,
      isAlreadyDrawn: false,
      currentDebtorExposureSek: 0,
      currentTotalAdvanceExposureSek: 0,
      limits,
    })
    expect(unverified.isEligible).toBe(false)
    expect(unverified.ineligibilityReason).toContain('not verified')

    const alreadyDrawn = evaluateInvoiceDrawdownEligibility({
      invoiceId: 'inv-1003',
      invoiceNumber: '#1003',
      grossAmountSek: 10000,
      isNetworkVerified: true,
      isAlreadyDrawn: true,
      currentDebtorExposureSek: 0,
      currentTotalAdvanceExposureSek: 0,
      limits,
    })
    expect(alreadyDrawn.isEligible).toBe(false)
    expect(alreadyDrawn.ineligibilityReason).toContain('already been drawn down')
  })

  it('enforces single-debtor concentration cap (max 35% of total exposure)', () => {
    const profile = createMockCreditProfile()
    const score = computeAccountedNetworkScore(profile)
    const limits = calculateCreditLimits(profile, score)

    // Attempt an invoice that would exceed 35% concentration to a single debtor
    const maxAllowedDebtorExposure = limits.maxTotalExposureSek * 0.35
    const evaluation = evaluateInvoiceDrawdownEligibility({
      invoiceId: 'inv-1004',
      invoiceNumber: '#1004',
      grossAmountSek: maxAllowedDebtorExposure + 1000,
      isNetworkVerified: true,
      isAlreadyDrawn: false,
      currentDebtorExposureSek: 0,
      currentTotalAdvanceExposureSek: 0,
      limits,
    })

    expect(evaluation.isEligible).toBe(false)
    expect(evaluation.ineligibilityReason).toContain('single-counterparty exposure concentration cap')
  })

  it('evaluates installment plan eligibility correctly', () => {
    const profile = createMockCreditProfile()
    const score = computeAccountedNetworkScore(profile)
    const limits = calculateCreditLimits(profile, score)

    // Valid net payable
    const valid = evaluateInstallmentEligibility({
      netStatementBalanceSek: 15000,
      settlementDirection: 'pay',
      currentInstallmentExposureSek: 0,
      limits,
    })

    expect(valid.isEligible).toBe(true)
    expect(valid.allowedTerms).toEqual([2, 3, 4])

    // Ineligible because direction is receive (surplus)
    const receive = evaluateInstallmentEligibility({
      netStatementBalanceSek: 15000,
      settlementDirection: 'receive',
      currentInstallmentExposureSek: 0,
      limits,
    })
    expect(receive.isEligible).toBe(false)

    // Ineligible because exceeds installment capacity
    const excessive = evaluateInstallmentEligibility({
      netStatementBalanceSek: 99999999,
      settlementDirection: 'pay',
      currentInstallmentExposureSek: 0,
      limits,
    })
    expect(excessive.isEligible).toBe(false)
    expect(excessive.ineligibilityReason).toContain('exceeds maximum installment capacity')
  })
})
