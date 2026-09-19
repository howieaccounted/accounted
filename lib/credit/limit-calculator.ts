/**
 * Accounted Network — Dynamic Credit Limit & Eligibility Calculator (MVP)
 *
 * Translates the Accounted Network Score (ANS) into dynamic operational
 * credit limits for Invoice Advances (BAS 2890) and Statement Installments (BAS 2840).
 */

import { roundOre } from '@/lib/money'
import {
  AccountedNetworkScore,
  CompanyCreditProfile,
  CreditLimits,
  CreditRiskTier,
  InstallmentPlanEligibility,
  InvoiceDrawdownEligibility,
} from './types'

// Tier caps for maximum total credit exposure (SEK)
export const TIER_MAX_EXPOSURE_SEK: Record<CreditRiskTier, number> = {
  tier_1_prime: 500000,
  tier_2_standard: 250000,
  tier_3_elevated: 100000,
  tier_4_ineligible: 0,
}

// Tier advance rates for verified invoice drawdowns
export const TIER_INVOICE_ADVANCE_RATES: Record<CreditRiskTier, number> = {
  tier_1_prime: 95,
  tier_2_standard: 90,
  tier_3_elevated: 80,
  tier_4_ineligible: 0,
}

// Tier flat advance fees (Product A)
export const TIER_INVOICE_ADVANCE_FEES: Record<CreditRiskTier, number> = {
  tier_1_prime: 0.75,
  tier_2_standard: 1.0,
  tier_3_elevated: 1.5,
  tier_4_ineligible: 0.0,
}

// Eligible installment terms by tier
export const TIER_ELIGIBLE_INSTALLMENT_TERMS: Record<CreditRiskTier, (2 | 3 | 4)[]> = {
  tier_1_prime: [2, 3, 4],
  tier_2_standard: [2, 3],
  tier_3_elevated: [2],
  tier_4_ineligible: [],
}

/**
 * Calculate dynamic credit limits based on financial health and ANS tier.
 */
export function calculateCreditLimits(
  profile: CompanyCreditProfile,
  score: AccountedNetworkScore
): CreditLimits {
  const { tier } = score

  if (tier === 'tier_4_ineligible') {
    return {
      tier,
      maxTotalExposureSek: 0,
      maxInvoiceAdvanceRatePercentage: 0,
      maxInvoiceAdvanceSek: 0,
      maxInstallmentPrincipalSek: 0,
      eligibleInstallmentTerms: [],
      invoiceAdvanceFeePercentage: 0,
      installmentFeePercentages: {
        twoMonths: 0,
        threeMonths: 0,
        fourMonths: 0,
      },
    }
  }

  // Monthly turnover
  const monthlyTurnover = profile.annualTurnoverSek / 12
  const turnoverCap = monthlyTurnover * 0.25

  // Working capital: (1930 + 1510) - (2440 + 2800)
  const currentAssets = profile.bankBalanceSek + profile.customerReceivablesSek
  const currentLiabilities = profile.supplierPayablesSek + profile.shortTermDebtSek
  const workingCapital = Math.max(0, currentAssets - currentLiabilities)
  const workingCapitalCap = workingCapital * 0.4

  const tierAbsoluteCap = TIER_MAX_EXPOSURE_SEK[tier]

  // Global Limit: min(turnoverCap, workingCapitalCap, tierAbsoluteCap)
  // Ensure minimum baseline limit for active network participants if working capital is tight
  const baselineLimit = Math.min(25000, tierAbsoluteCap)
  const computedLimit = Math.min(turnoverCap, workingCapitalCap, tierAbsoluteCap)
  const maxTotalExposureSek = roundOre(Math.max(baselineLimit, computedLimit))

  const maxAdvanceRate = TIER_INVOICE_ADVANCE_RATES[tier]
  const advanceFee = TIER_INVOICE_ADVANCE_FEES[tier]
  const eligibleTerms = TIER_ELIGIBLE_INSTALLMENT_TERMS[tier]

  // Sub-limits:
  // Invoice advance limit: up to 80% of total exposure limit
  const maxInvoiceAdvanceSek = roundOre(maxTotalExposureSek * 0.8)

  // Statement installment limit: up to 60% of total exposure limit
  const maxInstallmentPrincipalSek = roundOre(maxTotalExposureSek * 0.6)

  return {
    tier,
    maxTotalExposureSek,
    maxInvoiceAdvanceRatePercentage: maxAdvanceRate,
    maxInvoiceAdvanceSek,
    maxInstallmentPrincipalSek,
    eligibleInstallmentTerms: eligibleTerms,
    invoiceAdvanceFeePercentage: advanceFee,
    installmentFeePercentages: {
      twoMonths: 1.25,
      threeMonths: 2.25,
      fourMonths: 3.2,
    },
  }
}

/**
 * Evaluate single invoice drawdown eligibility and advance economics.
 * Enforces:
 * - Minimum invoice verification status
 * - Risk tier advance rate
 * - Single-debtor concentration limit (max 35% of total exposure)
 * - Available drawdown line
 */
export function evaluateInvoiceDrawdownEligibility(params: {
  invoiceId: string
  invoiceNumber: string
  grossAmountSek: number
  isNetworkVerified: boolean
  isAlreadyDrawn: boolean
  currentDebtorExposureSek: number
  currentTotalAdvanceExposureSek: number
  limits: CreditLimits
}): InvoiceDrawdownEligibility {
  const {
    invoiceId,
    invoiceNumber,
    grossAmountSek,
    isNetworkVerified,
    isAlreadyDrawn,
    currentDebtorExposureSek,
    currentTotalAdvanceExposureSek,
    limits,
  } = params

  if (isAlreadyDrawn) {
    return {
      isEligible: false,
      invoiceId,
      invoiceNumber,
      grossAmountSek,
      advanceRatePercentage: 0,
      advanceAmountSek: 0,
      feePercentage: 0,
      feeAmountSek: 0,
      netPayoutSek: 0,
      ineligibilityReason: 'Invoice has already been drawn down.',
    }
  }

  if (!isNetworkVerified) {
    return {
      isEligible: false,
      invoiceId,
      invoiceNumber,
      grossAmountSek,
      advanceRatePercentage: 0,
      advanceAmountSek: 0,
      feePercentage: 0,
      feeAmountSek: 0,
      netPayoutSek: 0,
      ineligibilityReason:
        'Invoice is not verified by customer on the Accounted Network.',
    }
  }

  if (limits.tier === 'tier_4_ineligible' || limits.maxTotalExposureSek <= 0) {
    return {
      isEligible: false,
      invoiceId,
      invoiceNumber,
      grossAmountSek,
      advanceRatePercentage: 0,
      advanceAmountSek: 0,
      feePercentage: 0,
      feeAmountSek: 0,
      netPayoutSek: 0,
      ineligibilityReason:
        'Company does not currently meet Accounted Network underwriting requirements.',
    }
  }

  // Check remaining total invoice advance capacity
  const remainingTotalCapacity = Math.max(
    0,
    limits.maxInvoiceAdvanceSek - currentTotalAdvanceExposureSek
  )
  if (remainingTotalCapacity <= 0) {
    return {
      isEligible: false,
      invoiceId,
      invoiceNumber,
      grossAmountSek,
      advanceRatePercentage: 0,
      advanceAmountSek: 0,
      feePercentage: 0,
      feeAmountSek: 0,
      netPayoutSek: 0,
      ineligibilityReason: `Company invoice advance limit of ${limits.maxInvoiceAdvanceSek} SEK has been reached.`,
    }
  }

  // Check single-debtor concentration cap (35% of maxTotalExposure)
  const maxDebtorConcentrationSek = roundOre(limits.maxTotalExposureSek * 0.35)
  const potentialDebtorExposure = currentDebtorExposureSek + grossAmountSek
  if (potentialDebtorExposure > maxDebtorConcentrationSek) {
    return {
      isEligible: false,
      invoiceId,
      invoiceNumber,
      grossAmountSek,
      advanceRatePercentage: 0,
      advanceAmountSek: 0,
      feePercentage: 0,
      feeAmountSek: 0,
      netPayoutSek: 0,
      ineligibilityReason: `Exceeds single-counterparty exposure concentration cap of ${maxDebtorConcentrationSek} SEK.`,
    }
  }

  const advanceRate = limits.maxInvoiceAdvanceRatePercentage
  const feePercentage = limits.invoiceAdvanceFeePercentage

  const advanceAmountSek = roundOre((grossAmountSek * advanceRate) / 100)
  const feeAmountSek = roundOre((advanceAmountSek * feePercentage) / 100)
  const netPayoutSek = roundOre(advanceAmountSek - feeAmountSek)

  return {
    isEligible: true,
    invoiceId,
    invoiceNumber,
    grossAmountSek,
    advanceRatePercentage: advanceRate,
    advanceAmountSek,
    feePercentage,
    feeAmountSek,
    netPayoutSek,
  }
}

/**
 * Evaluate net statement installment plan eligibility.
 */
export function evaluateInstallmentEligibility(params: {
  netStatementBalanceSek: number
  settlementDirection: 'pay' | 'receive' | 'balanced'
  currentInstallmentExposureSek: number
  limits: CreditLimits
}): InstallmentPlanEligibility {
  const {
    netStatementBalanceSek,
    settlementDirection,
    currentInstallmentExposureSek,
    limits,
  } = params

  if (settlementDirection !== 'pay' || netStatementBalanceSek <= 0) {
    return {
      isEligible: false,
      netStatementBalanceSek,
      maxPrincipalSek: 0,
      allowedTerms: [],
      ineligibilityReason:
        'Installments are only applicable to net payable settlement balances.',
    }
  }

  if (limits.tier === 'tier_4_ineligible' || limits.eligibleInstallmentTerms.length === 0) {
    return {
      isEligible: false,
      netStatementBalanceSek,
      maxPrincipalSek: 0,
      allowedTerms: [],
      ineligibilityReason:
        'Company does not currently qualify for statement installment financing.',
    }
  }

  const remainingInstallmentCapacity = Math.max(
    0,
    limits.maxInstallmentPrincipalSek - currentInstallmentExposureSek
  )

  if (netStatementBalanceSek > remainingInstallmentCapacity) {
    return {
      isEligible: false,
      netStatementBalanceSek,
      maxPrincipalSek: remainingInstallmentCapacity,
      allowedTerms: [],
      ineligibilityReason: `Statement balance (${netStatementBalanceSek} SEK) exceeds maximum installment capacity of ${remainingInstallmentCapacity} SEK.`,
    }
  }

  return {
    isEligible: true,
    netStatementBalanceSek,
    maxPrincipalSek: remainingInstallmentCapacity,
    allowedTerms: limits.eligibleInstallmentTerms,
  }
}
