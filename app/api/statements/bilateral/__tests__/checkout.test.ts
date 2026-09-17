import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockRequest, parseJsonResponse } from '@/tests/helpers'

const requireAuthMock = vi.fn()
vi.mock('@/lib/auth/require-auth', () => ({
  requireAuth: (...args: unknown[]) => requireAuthMock(...args),
}))

vi.mock('@/lib/company/context', () => ({
  getActiveCompanyId: vi.fn().mockResolvedValue('c0000000-0000-4000-8000-00000000000a'),
  requireCompanyId: vi.fn().mockResolvedValue('c0000000-0000-4000-8000-00000000000a'),
}))

const sessionsCreate = vi.fn()
vi.mock('@/lib/stripe/client', () => ({
  getStripe: () => ({
    checkout: { sessions: { create: sessionsCreate } },
  }),
}))

import { POST } from '../checkout/route'

const routeParams = { params: Promise.resolve({}) }

describe('POST /api/statements/bilateral/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthMock.mockResolvedValue({
      user: { id: 'user-1', email: 'test@accounted.test', is_anonymous: false },
      supabase: {},
      error: null,
    })
  })

  it('creates a live Stripe checkout session when STRIPE_SECRET_KEY is configured', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_123456789')
    sessionsCreate.mockResolvedValueOnce({
      id: 'cs_test_abc123',
      url: 'https://checkout.stripe.com/c/pay/cs_test_abc123',
    })

    const req = createMockRequest('/api/statements/bilateral/checkout', {
      method: 'POST',
      body: {
        month: '2026-09',
        counterpartyId: 'all',
        amountSek: 4000,
        reference: 'NET-202609-NETWORK',
      },
    })

    const res = await POST(req, routeParams)
    const { status, body } = await parseJsonResponse<{ url: string }>(res)
    expect(status).toBe(200)
    expect(body.url).toBe('https://checkout.stripe.com/c/pay/cs_test_abc123')

    expect(sessionsCreate).toHaveBeenCalledTimes(1)
    const [createArgs] = sessionsCreate.mock.calls[0]
    expect(createArgs.mode).toBe('payment')
    expect(createArgs.payment_method_types).toContain('card')
    expect(createArgs.line_items[0].price_data.unit_amount).toBe(400000)
    expect(createArgs.line_items[0].price_data.currency).toBe('sek')
    expect(createArgs.metadata.month).toBe('2026-09')
    expect(createArgs.metadata.settlement_reference).toBe('NET-202609-NETWORK')
  })

  it('returns fallback checkout URL when STRIPE_SECRET_KEY is unset', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '')

    const req = createMockRequest('/api/statements/bilateral/checkout', {
      method: 'POST',
      body: {
        month: '2026-09',
        counterpartyId: 'all',
        amountSek: 4000,
        reference: 'NET-202609-NETWORK',
      },
    })

    const res = await POST(req, routeParams)
    const { status, body } = await parseJsonResponse<{ url: string }>(res)
    expect(status).toBe(200)
    expect(body.url).toContain('/statements/checkout')
    expect(body.url).toContain('month=2026-09')
    expect(body.url).toContain('amount=4000')
    expect(body.url).toContain('ref=NET-202609-NETWORK')
  })

  it('returns 400 if statement requires no payment', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '')

    const req = createMockRequest('/api/statements/bilateral/checkout', {
      method: 'POST',
      body: {
        month: '2026-07', // empty test month
        counterpartyId: 'all',
        amountSek: 0,
      },
    })

    const res = await POST(req, routeParams)
    const { status, body } = await parseJsonResponse<{ error: { code: string } }>(res)
    expect(status).toBe(400)
    expect(body.error.code).toBe('NO_PAYMENT_REQUIRED')
  })
})
