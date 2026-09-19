import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockRequest, parseJsonResponse } from '@/tests/helpers'
import { resetStatementInstallmentPlans } from '@/lib/statements/bilateral-netting'
import type { StatementInstallmentPlan } from '@/lib/statements/bilateral-netting'

const requireAuthMock = vi.fn()
vi.mock('@/lib/auth/require-auth', () => ({
  requireAuth: (...args: unknown[]) => requireAuthMock(...args),
}))

vi.mock('@/lib/company/context', () => ({
  getActiveCompanyId: vi.fn().mockResolvedValue('c0000000-0000-4000-8000-00000000000a'),
  requireCompanyId: vi.fn().mockResolvedValue('c0000000-0000-4000-8000-00000000000a'),
}))

import { GET, POST, DELETE } from '../installments/route'

const routeParams = { params: Promise.resolve({}) }

describe('Bilateral Installments API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetStatementInstallmentPlans()
    requireAuthMock.mockResolvedValue({
      user: { id: 'user-1', email: 'test@accounted.test', is_anonymous: false },
      supabase: {},
      error: null,
    })
  })

  it('fetches installment simulation options via GET /api/statements/bilateral/installments', async () => {
    const req = createMockRequest('/api/statements/bilateral/installments?month=2026-09')
    const res = await GET(req, routeParams)
    const { status, body } = await parseJsonResponse<{
      success: boolean
      simulations: Array<{ termMonths: number; monthlyAmountSek: number }>
      settlementAmountSek: number
    }>(res)

    expect(status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.simulations).toHaveLength(3)
    expect(body.simulations.map((s) => s.termMonths)).toEqual([2, 3, 4])
  })

  it('creates an installment plan via POST /api/statements/bilateral/installments', async () => {
    const req = createMockRequest('/api/statements/bilateral/installments', {
      method: 'POST',
      body: {
        month: '2026-09',
        termMonths: 3,
        paymentMethod: 'autogiro',
      },
    })

    const res = await POST(req, routeParams)
    const { status, body } = await parseJsonResponse<{
      success: boolean
      plan: StatementInstallmentPlan
      voucher: { isBalanced: boolean; sieContent: string }
      statement: { installmentPlan?: StatementInstallmentPlan }
    }>(res)

    expect(status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.plan.termMonths).toBe(3)
    expect(body.plan.status).toBe('active')
    expect(body.voucher.isBalanced).toBe(true)
    expect(body.voucher.sieContent).toContain('#TRANS 2840')
    expect(body.statement.installmentPlan?.planId).toBe(body.plan.planId)
  })

  it('cancels an installment plan via DELETE /api/statements/bilateral/installments', async () => {
    // First create a plan
    const createReq = createMockRequest('/api/statements/bilateral/installments', {
      method: 'POST',
      body: {
        month: '2026-09',
        termMonths: 2,
      },
    })
    await POST(createReq, routeParams)

    // Then delete it
    const deleteReq = createMockRequest('/api/statements/bilateral/installments?month=2026-09', {
      method: 'DELETE',
    })
    const res = await DELETE(deleteReq, routeParams)
    const { status, body } = await parseJsonResponse<{
      success: boolean
      cancelled: boolean
      statement: { installmentPlan?: StatementInstallmentPlan | null }
    }>(res)

    expect(status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.cancelled).toBe(true)
    expect(body.statement.installmentPlan).toBeNull()
  })
})
