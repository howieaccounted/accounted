import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateStatementOcr,
  formatOcrReference,
  generatePaymentInstructions,
  activateAutogiroMandate,
  getAutogiroMandate,
  cancelAutogiroMandate,
  resetAutogiroMandatesStore,
  ACCOUNTED_CLEARING_BANKGIRO,
  ACCOUNTED_CLEARING_NAME,
} from '@/lib/statements/payment-instructions'
import {
  computeMonthlyStatement,
  resetRuntimeSettlements,
} from '@/lib/statements/bilateral-netting'
import { validateOcrReference } from '@/lib/bankgiro/luhn'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'

vi.mock('@/lib/auth/require-auth', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    user: { id: 'test-user-id' },
    supabase: {},
  }),
}))

vi.mock('@/lib/company/context', () => ({
  getActiveCompanyId: vi.fn().mockResolvedValue(TENANT_A_COMPANY_ID),
  requireCompanyId: vi.fn().mockResolvedValue(TENANT_A_COMPANY_ID),
}))

import {
  GET as autogiroGetHandler,
  POST as autogiroPostHandler,
  DELETE as autogiroDeleteHandler,
} from '@/app/api/statements/autogiro/route'

describe('payment-instructions service (Bankgiro / OCR / Autogiro)', () => {
  beforeEach(() => {
    resetRuntimeSettlements()
    resetAutogiroMandatesStore()
  })

  describe('OCR reference generation & validation', () => {
    it('generates an OCR reference with a valid Luhn check digit', () => {
      const ocr = generateStatementOcr('2026-09', TENANT_A_COMPANY_ID)
      expect(ocr).toBeDefined()
      expect(ocr.length).toBeGreaterThanOrEqual(8)
      expect(validateOcrReference(ocr)).toBe(true)
    })

    it('formats OCR references into readable blocks', () => {
      const ocr = '20260900018'
      const formatted = formatOcrReference(ocr)
      expect(formatted).toBe('2026 0900 018')
    })
  })

  describe('generatePaymentInstructions & fee comparison', () => {
    it('generates clearing Bankgiro and fee comparison showing significant savings vs credit card', () => {
      const instructions = generatePaymentInstructions({
        companyId: TENANT_A_COMPANY_ID,
        month: '2026-09',
        amountSek: 4000,
        dueDate: '2026-10-25',
        isNetworkWide: true,
      })

      expect(instructions.bankgiro).toBe(ACCOUNTED_CLEARING_BANKGIRO)
      expect(instructions.recipientName).toBe(ACCOUNTED_CLEARING_NAME)
      expect(instructions.amountSek).toBe(4000)
      expect(instructions.dueDate).toBe('2026-10-25')

      // Bankgiro fee: 1.75 SEK
      expect(instructions.bankgiroFeeSek).toBe(1.75)
      // Card fee at 1.75% + 2.50 SEK: 4000 * 0.0175 + 2.50 = 72.50 SEK
      expect(instructions.estimatedCardFeeSek).toBe(72.5)
      // Fee savings: 72.50 - 1.75 = 70.75 SEK (~98% savings)
      expect(instructions.feeSavingsSek).toBe(70.75)
    })

    it('uses counterparty Bankgiro for bilateral peer-to-peer statements', () => {
      const instructions = generatePaymentInstructions({
        companyId: TENANT_A_COMPANY_ID,
        month: '2026-09',
        amountSek: 4000,
        dueDate: '2026-10-25',
        counterpartyBankgiro: '5123-4567',
        counterpartyName: 'Nordic Logistics AB',
        isNetworkWide: false,
      })

      expect(instructions.bankgiro).toBe('5123-4567')
      expect(instructions.recipientName).toBe('Nordic Logistics AB')
    })
  })

  describe('Autogiro direct debit mandate lifecycle', () => {
    it('activates, retrieves, and cancels an Autogiro mandate', () => {
      const mandate = activateAutogiroMandate({
        companyId: 'test-company-1',
        bankName: 'Handelsbanken',
        clearingNumber: '6000',
        accountNumber: '987654321',
        bankgiro: '5050-1055',
        payerOrgNumber: '556111-2222',
      })

      expect(mandate.status).toBe('active')
      expect(mandate.bankName).toBe('Handelsbanken')
      expect(mandate.clearingNumber).toBe('6000')
      expect(mandate.accountNumber).toBe('987654321')

      // Retrieve
      const loaded = getAutogiroMandate('test-company-1')
      expect(loaded).not.toBeNull()
      expect(loaded?.status).toBe('active')

      // Cancel
      const cancelled = cancelAutogiroMandate('test-company-1')
      expect(cancelled).toBe(true)
      const afterCancel = getAutogiroMandate('test-company-1')
      expect(afterCancel?.status).toBe('cancelled')
    })
  })

  describe('bilateral-netting integration', () => {
    it('attaches paymentInstructions when company has net payable (Company A in Sep 2026)', () => {
      const statement = computeMonthlyStatement({
        activeCompanyId: TENANT_A_COMPANY_ID,
        counterpartyId: 'all',
        month: '2026-09',
      })

      expect(statement.settlementDirection).toBe('pay')
      expect(statement.paymentInstructions).toBeDefined()
      expect(statement.paymentInstructions?.bankgiro).toBe(ACCOUNTED_CLEARING_BANKGIRO)
      expect(statement.paymentInstructions?.feeSavingsSek).toBeGreaterThan(0)
    })

    it('sets paymentInstructions to null when company is in net receivable position (Company B in Sep 2026)', () => {
      const statement = computeMonthlyStatement({
        activeCompanyId: TENANT_B_COMPANY_ID,
        counterpartyId: 'all',
        month: '2026-09',
      })

      expect(statement.settlementDirection).toBe('receive')
      expect(statement.paymentInstructions).toBeNull()
    })
  })

  describe('Autogiro API route handler', () => {
    it('activates mandate via POST /api/statements/autogiro', async () => {
      const req = new Request('http://localhost:3000/api/statements/autogiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: 'api-test-company',
          bankName: 'Swedbank',
          clearingNumber: '8327',
          accountNumber: '912345678',
        }),
      })

      const res = await autogiroPostHandler(req, { params: Promise.resolve({}) })
      expect(res.status).toBe(200)

      const body = (await res.json()) as { success: boolean; mandate: { status: string; bankName: string } }
      expect(body.success).toBe(true)
      expect(body.mandate.status).toBe('active')
      expect(body.mandate.bankName).toBe('Swedbank')
    })

    it('retrieves mandate via GET /api/statements/autogiro', async () => {
      // First activate
      activateAutogiroMandate({
        companyId: 'api-get-company',
        bankName: 'SEB',
        clearingNumber: '5200',
        accountNumber: '11223344',
      })

      const req = new Request('http://localhost:3000/api/statements/autogiro?company_id=api-get-company')
      const res = await autogiroGetHandler(req, { params: Promise.resolve({}) })
      expect(res.status).toBe(200)

      const body = (await res.json()) as { isConfigured: boolean; mandate: { bankName: string } }
      expect(body.isConfigured).toBe(true)
      expect(body.mandate.bankName).toBe('SEB')
    })

    it('cancels mandate via DELETE /api/statements/autogiro', async () => {
      activateAutogiroMandate({
        companyId: 'api-delete-company',
        bankName: 'SEB',
        clearingNumber: '5200',
        accountNumber: '11223344',
      })

      const req = new Request('http://localhost:3000/api/statements/autogiro?company_id=api-delete-company', {
        method: 'DELETE',
      })
      const res = await autogiroDeleteHandler(req, { params: Promise.resolve({}) })
      expect(res.status).toBe(200)

      const body = (await res.json()) as { success: boolean }
      expect(body.success).toBe(true)
    })
  })
})
