import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockRequest, parseJsonResponse } from '@/tests/helpers'
import {
  recordNetworkDrawdown,
  resetRuntimeSettlements,
  type NetworkDrawdown,
} from '@/lib/statements/bilateral-netting'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'

const requireAuthMock = vi.fn()
vi.mock('@/lib/auth/require-auth', () => ({
  requireAuth: (...args: unknown[]) => requireAuthMock(...args),
}))

vi.mock('@/lib/company/context', () => ({
  getActiveCompanyId: vi.fn().mockResolvedValue('c0000000-0000-4000-8000-00000000000a'),
  requireCompanyId: vi.fn().mockResolvedValue('c0000000-0000-4000-8000-00000000000a'),
}))

import { GET, POST } from '../drawdown/route'

const routeParams = { params: Promise.resolve({}) }

describe('Bilateral Drawdown API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRuntimeSettlements()
    requireAuthMock.mockResolvedValue({
      user: { id: 'user-1', email: 'test@accounted.test', is_anonymous: false },
      supabase: {},
      error: null,
    })
  })

  it('executes drawdown via POST /api/statements/bilateral/drawdown', async () => {
    const req = createMockRequest('/api/statements/bilateral/drawdown', {
      method: 'POST',
      body: {
        invoiceNumber: '1001',
        month: '2026-09',
        feePercent: 1.0,
      },
    })

    const res = await POST(req, routeParams)
    const { status, body } = await parseJsonResponse<{
      success: boolean
      data: NetworkDrawdown
      statement: { totalEarlyDrawdownsSek: number; settlementAmountSek: number }
    }>(res)

    expect(status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data.invoiceNumber).toBe('1001')
    expect(body.data.grossAmountSek).toBe(15000)
    expect(body.data.feeAmountSek).toBe(150)
    expect(body.data.netDisbursedSek).toBe(14850)
    expect(body.statement.totalEarlyDrawdownsSek).toBe(15000)
  })

  it('rejects duplicate drawdown attempt with 409 Conflict', async () => {
    const req1 = createMockRequest('/api/statements/bilateral/drawdown', {
      method: 'POST',
      body: {
        invoiceNumber: '1001',
        month: '2026-09',
      },
    })
    await POST(req1, routeParams)

    const req2 = createMockRequest('/api/statements/bilateral/drawdown', {
      method: 'POST',
      body: {
        invoiceNumber: '1001',
        month: '2026-09',
      },
    })
    const res2 = await POST(req2, routeParams)
    expect(res2.status).toBe(409)
  })

  it('returns list of drawdowns via GET /api/statements/bilateral/drawdown', async () => {
    recordNetworkDrawdown({
      id: 'dd_1002',
      invoiceId: 'a0000002-0000-4000-8000-000000000002',
      invoiceNumber: '1002',
      companyId: TENANT_A_COMPANY_ID,
      counterpartyId: TENANT_B_COMPANY_ID,
      counterpartyName: 'Nordic Logistics AB',
      grossAmountSek: 10000,
      feePercent: 1.0,
      feeAmountSek: 100,
      netDisbursedSek: 9900,
      requestedAt: '2026-09-05T10:00:00.000Z',
      disbursedAt: '2026-09-05T10:00:00.000Z',
      destinationAccount: 'SEB Företagskonto (1930)',
      status: 'completed',
      statementMonth: '2026-09',
      reference: 'DD-202609-1002',
    })

    const req = createMockRequest('/api/statements/bilateral/drawdown?month=2026-09', {
      method: 'GET',
    })
    const res = await GET(req, routeParams)
    const { status, body } = await parseJsonResponse<{ success: boolean; data: NetworkDrawdown[] }>(
      res
    )

    expect(status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
    expect(body.data.some((d) => d.invoiceNumber === '1002')).toBe(true)
  })
})
