import {
  generateOcrReference,
  validateOcrReference,
  formatBankgiroNumber,
} from '@/lib/bankgiro/luhn'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { roundOre } from '@/lib/money'

export const ACCOUNTED_CLEARING_BANKGIRO = '5050-1055'
export const ACCOUNTED_CLEARING_NAME = 'Accounted Network Clearing AB'
export const ACCOUNTED_CLEARING_ORG = '556999-8800'

export interface AutogiroMandate {
  mandateId: string
  companyId: string
  status: 'active' | 'pending' | 'cancelled'
  mandateReference: string
  bankName: string
  clearingNumber: string
  accountNumber: string
  bankgiro?: string | null
  payerOrgNumber?: string
  activatedAt: string
  scheduledDeductionDay: number // Usually 25th of month
}

export interface StatementPaymentInstructions {
  // Bankgiro / OCR rail (Low flat-fee B2B)
  bankgiro: string
  recipientName: string
  recipientOrgNumber: string
  ocrReference: string
  formattedOcr: string
  amountSek: number
  dueDate: string
  // Fee comparison & savings
  bankgiroFeeSek: number
  cardFeePercentage: number
  estimatedCardFeeSek: number
  feeSavingsSek: number
  // Autogiro (Direct Debit)
  autogiro: {
    isMandateActive: boolean
    status: 'active' | 'pending' | 'cancelled' | 'none'
    mandateReference: string | null
    bankName: string | null
    clearingNumber: string | null
    accountNumber: string | null
    bankgiro: string | null
    scheduledDeductionDate: string | null
  }
}

/**
 * In-memory storage for Autogiro direct debit mandates.
 * Key: `companyId`
 */
const autogiroMandatesStore = new Map<string, AutogiroMandate>()

// Seed default mandate for Company A so it is immediately usable in UI demos
autogiroMandatesStore.set(TENANT_A_COMPANY_ID, {
  mandateId: 'AG-MANDATE-5560000001',
  companyId: TENANT_A_COMPANY_ID,
  status: 'active',
  mandateReference: 'AG-556000-0001',
  bankName: 'Skandinaviska Enskilda Banken (SEB)',
  clearingNumber: '5200',
  accountNumber: '1234567',
  bankgiro: '5050-1055',
  payerOrgNumber: '556000-0001',
  activatedAt: '2026-08-01T09:00:00Z',
  scheduledDeductionDay: 25,
})

export function getAutogiroMandate(companyId: string): AutogiroMandate | null {
  const mandate = autogiroMandatesStore.get(companyId)
  if (!mandate) return null
  return JSON.parse(JSON.stringify(mandate)) as AutogiroMandate
}

export function saveAutogiroMandate(mandate: AutogiroMandate): void {
  autogiroMandatesStore.set(mandate.companyId, JSON.parse(JSON.stringify(mandate)))
}

export function activateAutogiroMandate(params: {
  companyId: string
  bankName: string
  clearingNumber: string
  accountNumber: string
  bankgiro?: string | null
  payerOrgNumber?: string
}): AutogiroMandate {
  const { companyId, bankName, clearingNumber, accountNumber, bankgiro, payerOrgNumber } = params
  const cleanClearing = clearingNumber.replace(/\D/g, '')
  const cleanAccount = accountNumber.replace(/\D/g, '')

  const existing = autogiroMandatesStore.get(companyId)
  const mandateRef =
    existing?.mandateReference ||
    `AG-${companyId.replace(/\D/g, '').slice(0, 6).padEnd(6, '1')}`

  const mandate: AutogiroMandate = {
    mandateId: existing?.mandateId || `AG-MANDATE-${Date.now()}`,
    companyId,
    status: 'active',
    mandateReference: mandateRef,
    bankName: bankName || 'Svensk Affärsbank',
    clearingNumber: cleanClearing,
    accountNumber: cleanAccount,
    bankgiro: bankgiro ? formatBankgiroNumber(bankgiro) : null,
    payerOrgNumber: payerOrgNumber || '556000-0001',
    activatedAt: new Date().toISOString(),
    scheduledDeductionDay: 25,
  }

  saveAutogiroMandate(mandate)
  return mandate
}

export function cancelAutogiroMandate(companyId: string): boolean {
  const existing = autogiroMandatesStore.get(companyId)
  if (!existing) return false
  existing.status = 'cancelled'
  saveAutogiroMandate(existing)
  return true
}

export function resetAutogiroMandatesStore(): void {
  autogiroMandatesStore.clear()
}

/**
 * Generate a compliant Swedish Bankgirot Luhn OCR reference for a netting statement.
 * Format: [Year 4d][Month 2d][Company numeric hash 4d][Luhn check digit 1d] -> total 11 digits
 * Example: 2026 09 0001 8
 */
export function generateStatementOcr(month: string, companyId: string): string {
  const cleanMonth = month.replace(/\D/g, '') // e.g. "202609"
  // Extract or derive 4 digits from companyId
  const digitsFromCid = companyId.replace(/\D/g, '')
  const companyNumeric = (digitsFromCid || '1001').slice(0, 4).padStart(4, '0')
  const payload = `${cleanMonth}${companyNumeric}`
  return generateOcrReference(payload)
}

/**
 * Format an 11-digit OCR reference into readable blocks: "2026 0900 018"
 */
export function formatOcrReference(ocr: string): string {
  if (ocr.length <= 4) return ocr
  return ocr.replace(/(\d{4})(\d{4})?(\d+)?/, (_match, p1, p2, p3) => {
    return [p1, p2, p3].filter(Boolean).join(' ')
  })
}

/**
 * Generate payment instructions and fee comparison for a netting statement.
 */
export function generatePaymentInstructions(options: {
  companyId: string
  month: string
  amountSek: number
  dueDate: string
  counterpartyBankgiro?: string | null
  counterpartyName?: string | null
  isNetworkWide?: boolean
}): StatementPaymentInstructions {
  const {
    companyId,
    month,
    amountSek,
    dueDate,
    counterpartyBankgiro,
    counterpartyName,
    isNetworkWide = true,
  } = options

  // Recipient Bankgiro: For network-wide multilateral statements, payment goes to Accounted Clearing Bankgiro.
  // For bilateral peer statements, payment goes directly to the counterparty's Bankgiro if provided.
  const bankgiro = !isNetworkWide && counterpartyBankgiro
    ? formatBankgiroNumber(counterpartyBankgiro)
    : ACCOUNTED_CLEARING_BANKGIRO

  const recipientName = !isNetworkWide && counterpartyName
    ? counterpartyName
    : ACCOUNTED_CLEARING_NAME

  const recipientOrgNumber = !isNetworkWide
    ? '556123-4567'
    : ACCOUNTED_CLEARING_ORG

  const rawOcr = generateStatementOcr(month, companyId)
  const formattedOcr = formatOcrReference(rawOcr)

  // Cost comparison:
  // Swedish Bankgiro / Autogiro: flat ~1.75 SEK per batch transfer
  // Standard B2B Card payment (Stripe/Visa/Mastercard): 1.75% + 2.50 SEK
  const bankgiroFeeSek = 1.75
  const cardFeePercentage = 1.75
  const estimatedCardFeeSek = roundOre((amountSek * (cardFeePercentage / 100)) + 2.50)
  const feeSavingsSek = Math.max(0, roundOre(estimatedCardFeeSek - bankgiroFeeSek))

  // Autogiro details
  const mandate = getAutogiroMandate(companyId)
  const isMandateActive = mandate?.status === 'active'

  // Scheduled deduction date: e.g. "2026-10-25"
  let scheduledDeductionDate: string | null = null
  if (isMandateActive && dueDate) {
    scheduledDeductionDate = dueDate
  }

  return {
    bankgiro,
    recipientName,
    recipientOrgNumber,
    ocrReference: rawOcr,
    formattedOcr,
    amountSek,
    dueDate,
    bankgiroFeeSek,
    cardFeePercentage,
    estimatedCardFeeSek,
    feeSavingsSek,
    autogiro: {
      isMandateActive,
      status: mandate?.status || 'none',
      mandateReference: mandate?.mandateReference || null,
      bankName: mandate?.bankName || null,
      clearingNumber: mandate?.clearingNumber || null,
      accountNumber: mandate?.accountNumber || null,
      bankgiro: mandate?.bankgiro || null,
      scheduledDeductionDate,
    },
  }
}
