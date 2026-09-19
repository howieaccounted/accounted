/**
 * Accounted Network — Credit Model & Underwriting Domain Types (MVP)
 *
 * Provides structured types for the Accounted Network Score (ANS),
 * hard knock-out underwriting gates, dynamic credit exposure limits,
 * risk tiering, and invoice advance/installment qualification.
 */

export type CreditRiskTier =
  | 'tier_1_prime'       // ANS 85-100: Auto-approved, up to 95% advance rate, highest limits
  | 'tier_2_standard'    // ANS 70-84:  Auto-approved, 90% advance rate, standard limits
  | 'tier_3_elevated'    // ANS 55-69:  Algorithmic approval, 80% advance rate, cautious limits
  | 'tier_4_ineligible'  // ANS 0-54 or failed hard gate: Cash settlement only

export type CreditGateId =
  | 'GATE_KRONOFOGDEN'   // No active enforcement debt records
  | 'GATE_SKATTEKONTO'   // Tax arrears under threshold (Account 1630)
  | 'GATE_ABL_EQUITY'    // Registered equity >= 50% of share capital (ABL 25:13)
  | 'GATE_TENURE'        // Platform tenure >= 30 days & >= 2 settled cycles
  | 'GATE_COMPANY_FORM'  // Valid Swedish Aktiebolag or Handelsbolag with active F-skatt

export interface CreditGateResult {
  gateId: CreditGateId
  name: string
  passed: boolean
  failureReason?: string
  valueObserved?: string | number
  thresholdRequired?: string | number
}

export type ScoringPillarId =
  | 'solvency_and_balance_sheet' // 35 points max
  | 'network_trade_reciprocity'  // 30 points max
  | 'cash_flow_and_runway'       // 25 points max
  | 'repayment_track_record'     // 10 points max

export interface ScoringPillarScore {
  pillarId: ScoringPillarId
  name: string
  pointsEarned: number
  maxPoints: number
  metrics: Record<string, number | string | boolean>
}

export interface AccountedNetworkScore {
  totalScore: number // 0 to 100
  tier: CreditRiskTier
  passedAllGates: boolean
  gateResults: CreditGateResult[]
  pillars: ScoringPillarScore[]
  calculatedAt: string
}

export interface CompanyCreditProfile {
  companyId: string
  organizationNumber: string
  companyName: string
  isSwedishCorporateEntity: boolean
  hasActiveFSkatt: boolean
  hasActiveMoms: boolean
  platformTenureDays: number
  completedSettlementCycles: number
  
  // Tax & Compliance (Gate 1 & Gate 2)
  kronofogdenDebtSek: number
  skattekontoBalanceSek: number // Negative if in arrears
  skattekontoArrearsDays: number

  // Balance Sheet Solvency (Pillar 1 & Gate 3)
  registeredShareCapitalSek: number // Account 2081
  totalEquitySek: number           // Accounts 2080 - 2099
  totalAssetsSek: number           // Accounts 1000 - 1999
  bankBalanceSek: number           // Account 1930
  customerReceivablesSek: number   // Account 1510
  supplierPayablesSek: number      // Account 2440
  shortTermDebtSek: number         // Accounts 2800 - 2899
  annualTurnoverSek: number
  operatingProfitEbitdaSek: number

  // Network Trade Dynamics (Pillar 2)
  monthlyNetworkReceivablesSek: number
  monthlyNetworkPayablesSek: number
  medianAttestationHours: number
  disputeAndCreditNoteRatio: number // e.g. 0.01 for 1%

  // Cash Flow & Open Banking Telemetry (Pillar 3)
  dailyNetOperatingCashBurnSek: number // >= 0
  positiveCashFlowMonthsInLast3: number
  minBankBalance30dSek: number

  // Historical Repayment (Pillar 4)
  failedAutogiroCount: number
  hasHistoricalDefault: boolean
}

export interface CreditLimits {
  tier: CreditRiskTier
  maxTotalExposureSek: number
  maxInvoiceAdvanceRatePercentage: number
  maxInvoiceAdvanceSek: number
  maxInstallmentPrincipalSek: number
  eligibleInstallmentTerms: (2 | 3 | 4)[]
  invoiceAdvanceFeePercentage: number
  installmentFeePercentages: {
    twoMonths: number
    threeMonths: number
    fourMonths: number
  }
}

export interface InvoiceDrawdownEligibility {
  isEligible: boolean
  invoiceId: string
  invoiceNumber: string
  grossAmountSek: number
  advanceRatePercentage: number
  advanceAmountSek: number
  feePercentage: number
  feeAmountSek: number
  netPayoutSek: number
  ineligibilityReason?: string
}

export interface InstallmentPlanEligibility {
  isEligible: boolean
  netStatementBalanceSek: number
  maxPrincipalSek: number
  allowedTerms: (2 | 3 | 4)[]
  ineligibilityReason?: string
}
