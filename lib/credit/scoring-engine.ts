/**
 * Accounted Network — Quantitative Credit Scoring Engine (ANS)
 *
 * Implements the Accounted Network Score (ANS, 0-100) and hard knock-out
 * underwriting gates for Swedish SME B2B credit facilities.
 */

import { roundOre } from '@/lib/money'
import {
  AccountedNetworkScore,
  CompanyCreditProfile,
  CreditGateResult,
  CreditRiskTier,
  ScoringPillarScore,
} from './types'

/**
 * Evaluate the 5 mandatory hard disqualification knock-out gates.
 * Failure on ANY gate leads to an automatic decline (Tier 4 Ineligible).
 */
export function evaluateUnderwritingGates(
  profile: CompanyCreditProfile
): CreditGateResult[] {
  const gates: CreditGateResult[] = []

  // Gate 1: No active Kronofogden payment enforcement debt
  const passedKronofogden = profile.kronofogdenDebtSek <= 0
  gates.push({
    gateId: 'GATE_KRONOFOGDEN',
    name: 'Kronofogden Enforcement Check',
    passed: passedKronofogden,
    valueObserved: `${profile.kronofogdenDebtSek} SEK`,
    thresholdRequired: '0 SEK',
    failureReason: passedKronofogden
      ? undefined
      : 'Active payment enforcement debt registered with Kronofogdemyndigheten',
  })

  // Gate 2: Skattekonto compliance (Tax debt < 10 000 SEK or < 14 days arrears)
  const isTaxArrearsExcessive =
    profile.skattekontoBalanceSek < -10000 && profile.skattekontoArrearsDays > 14
  const passedSkattekonto = !isTaxArrearsExcessive
  gates.push({
    gateId: 'GATE_SKATTEKONTO',
    name: 'Skattekonto (Tax Account) Arrears Gate',
    passed: passedSkattekonto,
    valueObserved: `${profile.skattekontoBalanceSek} SEK (${profile.skattekontoArrearsDays} days)`,
    thresholdRequired: 'Arrears <= 10 000 SEK or <= 14 days',
    failureReason: passedSkattekonto
      ? undefined
      : 'Material tax arrears on Skattekonto (> 10 000 SEK for > 14 days)',
  })

  // Gate 3: Capital Protection (Aktiebolagslagen 25:13)
  // Equity must be at least 50% of registered share capital (Account 2081)
  const requiredMinEquity = profile.registeredShareCapitalSek * 0.5
  const passedAblEquity = profile.totalEquitySek >= requiredMinEquity
  gates.push({
    gateId: 'GATE_ABL_EQUITY',
    name: 'Capital Protection (ABL 25:13)',
    passed: passedAblEquity,
    valueObserved: `${profile.totalEquitySek} SEK`,
    thresholdRequired: `>= ${requiredMinEquity} SEK (50% of share capital)`,
    failureReason: passedAblEquity
      ? undefined
      : 'Equity below 50% of registered share capital; mandatory Kontrollbalansräkning risk',
  })

  // Gate 4: Minimum platform trading tenure (>= 30 days & >= 2 settled cycles)
  const passedTenure =
    profile.platformTenureDays >= 30 && profile.completedSettlementCycles >= 2
  gates.push({
    gateId: 'GATE_TENURE',
    name: 'Network Trading Tenure Gate',
    passed: passedTenure,
    valueObserved: `${profile.platformTenureDays} days, ${profile.completedSettlementCycles} cycles`,
    thresholdRequired: '>= 30 days and >= 2 completed settlement cycles',
    failureReason: passedTenure
      ? undefined
      : 'Insufficient network trading history; requires >= 30 days and >= 2 settled cycles',
  })

  // Gate 5: Swedish legal corporate form & active tax credentials
  const passedCompanyForm =
    profile.isSwedishCorporateEntity &&
    profile.hasActiveFSkatt &&
    profile.hasActiveMoms
  gates.push({
    gateId: 'GATE_COMPANY_FORM',
    name: 'Corporate Entity & Tax Registration Gate',
    passed: passedCompanyForm,
    valueObserved: `AB/HB: ${profile.isSwedishCorporateEntity}, F-skatt: ${profile.hasActiveFSkatt}, Moms: ${profile.hasActiveMoms}`,
    thresholdRequired: 'Swedish Corporate Entity with active F-skatt and Moms registration',
    failureReason: passedCompanyForm
      ? undefined
      : 'Entity must be a registered Swedish company with active F-skatt and Moms',
  })

  return gates
}

/**
 * Pillar 1: Solvency & Balance Sheet Health (Max 35 Points)
 */
export function scoreSolvencyPillar(profile: CompanyCreditProfile): ScoringPillarScore {
  let points = 0

  // 1. Quick Ratio (Kassalikviditet: (1930 + 1510) / (2440 + 2800))
  const shortTermLiabilities = profile.supplierPayablesSek + profile.shortTermDebtSek
  const liquidAssets = profile.bankBalanceSek + profile.customerReceivablesSek
  const quickRatio =
    shortTermLiabilities > 0
      ? liquidAssets / shortTermLiabilities
      : liquidAssets > 0
      ? 2.0
      : 1.0

  if (quickRatio >= 1.5) {
    points += 12
  } else if (quickRatio >= 1.2) {
    points += 9
  } else if (quickRatio >= 1.0) {
    points += 6
  }

  // 2. Equity Ratio (Soliditet: Equity / Assets)
  const equityRatio =
    profile.totalAssetsSek > 0 ? profile.totalEquitySek / profile.totalAssetsSek : 0

  if (equityRatio >= 0.35) {
    points += 10
  } else if (equityRatio >= 0.25) {
    points += 7
  } else if (equityRatio >= 0.15) {
    points += 4
  }

  // 3. Operating Profitability (EBITDA Margin)
  const ebitdaMargin =
    profile.annualTurnoverSek > 0
      ? profile.operatingProfitEbitdaSek / profile.annualTurnoverSek
      : 0

  if (ebitdaMargin >= 0.1) {
    points += 8
  } else if (ebitdaMargin >= 0.05) {
    points += 5
  } else if (ebitdaMargin > 0) {
    points += 2
  }

  // 4. Working Capital / Turnover Ratio
  const workingCapital = liquidAssets - shortTermLiabilities
  const workingCapitalRatio =
    profile.annualTurnoverSek > 0 ? workingCapital / profile.annualTurnoverSek : 0

  if (workingCapitalRatio >= 0.15) {
    points += 5
  }

  return {
    pillarId: 'solvency_and_balance_sheet',
    name: 'Solvency & Balance Sheet Health',
    pointsEarned: Math.min(35, points),
    maxPoints: 35,
    metrics: {
      quickRatio: roundOre(quickRatio),
      equityRatio: roundOre(equityRatio * 100) + '%',
      ebitdaMargin: roundOre(ebitdaMargin * 100) + '%',
      workingCapitalRatio: roundOre(workingCapitalRatio * 100) + '%',
    },
  }
}

/**
 * Pillar 2: Network Trade & Reciprocity Dynamics (Max 30 Points)
 */
export function scoreNetworkTradePillar(profile: CompanyCreditProfile): ScoringPillarScore {
  let points = 0

  // 1. Reciprocal Trade Ratio (TR = min(Rec, Pay) / max(Rec, Pay))
  const minTrade = Math.min(
    profile.monthlyNetworkReceivablesSek,
    profile.monthlyNetworkPayablesSek
  )
  const maxTrade = Math.max(
    profile.monthlyNetworkReceivablesSek,
    profile.monthlyNetworkPayablesSek
  )
  const tradeReciprocityRatio = maxTrade > 0 ? minTrade / maxTrade : 0

  if (tradeReciprocityRatio >= 0.5) {
    points += 12
  } else if (tradeReciprocityRatio >= 0.25) {
    points += 8
  } else if (tradeReciprocityRatio >= 0.1) {
    points += 4
  } else {
    points += 1
  }

  // 2. Debtor Network Attestation Velocity
  if (profile.medianAttestationHours <= 48) {
    points += 10
  } else if (profile.medianAttestationHours <= 120) {
    points += 6
  } else {
    points += 2
  }

  // 3. Dispute & Credit Note Frequency
  if (profile.disputeAndCreditNoteRatio <= 0.01) {
    points += 8
  } else if (profile.disputeAndCreditNoteRatio <= 0.03) {
    points += 4
  }

  return {
    pillarId: 'network_trade_reciprocity',
    name: 'Network Trade & Reciprocity',
    pointsEarned: Math.min(30, points),
    maxPoints: 30,
    metrics: {
      tradeReciprocityRatio: roundOre(tradeReciprocityRatio * 100) + '%',
      medianAttestationHours: profile.medianAttestationHours,
      disputeRatio: roundOre(profile.disputeAndCreditNoteRatio * 100) + '%',
    },
  }
}

/**
 * Pillar 3: Real-Time Cash Flow & Runway (Max 25 Points)
 */
export function scoreCashFlowPillar(profile: CompanyCreditProfile): ScoringPillarScore {
  let points = 0

  // 1. Cash Runway in Days (Bank Balance / Daily Net Operating Burn)
  let runwayDays = 999
  if (profile.dailyNetOperatingCashBurnSek > 0) {
    runwayDays = Math.floor(
      profile.bankBalanceSek / profile.dailyNetOperatingCashBurnSek
    )
  }

  if (runwayDays >= 90) {
    points += 12
  } else if (runwayDays >= 60) {
    points += 9
  } else if (runwayDays >= 30) {
    points += 5
  }

  // 2. Operating Cash Flow Consistency
  if (profile.positiveCashFlowMonthsInLast3 >= 2) {
    points += 8
  } else {
    points += 2
  }

  // 3. Minimum Bank Balance Buffer
  const avgMonthlyTurnover = profile.annualTurnoverSek / 12
  const minBalanceRatio =
    avgMonthlyTurnover > 0 ? profile.minBankBalance30dSek / avgMonthlyTurnover : 0

  if (minBalanceRatio >= 0.1) {
    points += 5
  }

  return {
    pillarId: 'cash_flow_and_runway',
    name: 'Real-Time Cash Flow & Runway',
    pointsEarned: Math.min(25, points),
    maxPoints: 25,
    metrics: {
      runwayDays,
      positiveCashFlowMonthsInLast3: profile.positiveCashFlowMonthsInLast3,
      minBankBalanceRatio: roundOre(minBalanceRatio * 100) + '%',
    },
  }
}

/**
 * Pillar 4: Historical Network Repayment (Max 10 Points)
 */
export function scoreRepaymentPillar(profile: CompanyCreditProfile): ScoringPillarScore {
  let points = 0

  if (profile.hasHistoricalDefault) {
    points = 0
  } else if (profile.failedAutogiroCount === 0) {
    points = 10
  } else if (profile.failedAutogiroCount === 1) {
    points = 5
  }

  return {
    pillarId: 'repayment_track_record',
    name: 'Repayment Track Record',
    pointsEarned: Math.min(10, points),
    maxPoints: 10,
    metrics: {
      failedAutogiroCount: profile.failedAutogiroCount,
      hasHistoricalDefault: profile.hasHistoricalDefault,
    },
  }
}

/**
 * Determine operational Credit Risk Tier from the ANS score.
 */
export function determineCreditRiskTier(
  totalScore: number,
  passedAllGates: boolean
): CreditRiskTier {
  if (!passedAllGates || totalScore < 55) {
    return 'tier_4_ineligible'
  }
  if (totalScore >= 85) {
    return 'tier_1_prime'
  }
  if (totalScore >= 70) {
    return 'tier_2_standard'
  }
  return 'tier_3_elevated'
}

/**
 * Compute the complete Accounted Network Score (ANS) for a company.
 */
export function computeAccountedNetworkScore(
  profile: CompanyCreditProfile
): AccountedNetworkScore {
  const gateResults = evaluateUnderwritingGates(profile)
  const passedAllGates = gateResults.every((g) => g.passed)

  const solvencyPillar = scoreSolvencyPillar(profile)
  const networkPillar = scoreNetworkTradePillar(profile)
  const cashFlowPillar = scoreCashFlowPillar(profile)
  const repaymentPillar = scoreRepaymentPillar(profile)

  const pillars = [solvencyPillar, networkPillar, cashFlowPillar, repaymentPillar]

  const rawTotal = pillars.reduce((sum, p) => sum + p.pointsEarned, 0)
  const totalScore = passedAllGates ? Math.min(100, Math.max(0, rawTotal)) : 0
  const tier = determineCreditRiskTier(totalScore, passedAllGates)

  return {
    totalScore,
    tier,
    passedAllGates,
    gateResults,
    pillars,
    calculatedAt: new Date().toISOString(),
  }
}
