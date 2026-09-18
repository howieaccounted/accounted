import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRouteContext } from '@/lib/api/with-route-context'
import { validateBody } from '@/lib/api/validate'
import { resolveRequestAppOrigin } from '@/lib/domains/trusted-app-origin'
import { getStripe } from '@/lib/stripe/client'
import { computeMonthlyStatement } from '@/lib/statements/bilateral-netting'

export const dynamic = 'force-dynamic'

const StatementCheckoutSchema = z.object({
  month: z.string().default('2026-09'),
  counterpartyId: z.string().default('all'),
  amountSek: z.number().optional(),
  reference: z.string().optional(),
})

export const POST = withRouteContext(
  'statement.bilateral.checkout',
  async (request, ctx) => {
    const { companyId, log } = ctx

    const validation = await validateBody(request, StatementCheckoutSchema, {
      log,
      operation: 'statement.bilateral.checkout',
    })
    if (!validation.success) return validation.response

    const { month, counterpartyId, amountSek, reference } = validation.data
    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'

    const statement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId,
      month,
    })

    const payableAmount =
      amountSek && amountSek > 0 ? amountSek : statement.settlementAmountSek

    if (statement.settlementDirection !== 'pay' && !(payableAmount > 0)) {
      return NextResponse.json(
        {
          error: {
            code: 'NO_PAYMENT_REQUIRED',
            message: 'Inget belopp att betala för denna avräkning.',
            message_en: 'No payment required for this statement settlement.',
          },
        },
        { status: 400 }
      )
    }

    const isNetworkWide = !counterpartyId || counterpartyId === 'all'
    const ref =
      reference ||
      `NET-${month.replace('-', '')}-${isNetworkWide ? 'NETWORK' : 'CO'}`

    const appOrigin = await resolveRequestAppOrigin(request)

    // Attempt real Stripe checkout if STRIPE_SECRET_KEY is configured
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = getStripe()
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'sek',
                product_data: {
                  name: isNetworkWide
                    ? `Accounted Network Settlement - ${month}`
                    : `Accounted Settlement - ${month}`,
                  description: `Avräkningslikvid till Accounted-nätverket (${ref}). Reglerar motstående fakturor.`,
                },
                unit_amount: Math.round(payableAmount * 100),
              },
              quantity: 1,
            },
          ],
          client_reference_id: activeCid,
          metadata: {
            company_id: activeCid,
            month,
            settlement_reference: ref,
            scope: counterpartyId,
            type: 'network_settlement',
          },
          success_url: `${appOrigin}/network/transactions?month=${encodeURIComponent(
            month
          )}&scope=${encodeURIComponent(counterpartyId)}&settled=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appOrigin}/network/transactions?month=${encodeURIComponent(
            month
          )}&scope=${encodeURIComponent(counterpartyId)}&canceled=true`,
        })

        if (session.url) {
          return NextResponse.json({ url: session.url })
        }
      } catch (err) {
        log.warn('Stripe checkout session creation failed, using local simulation fallback', {
          err: err instanceof Error ? err.message : String(err),
        })
      }
    }

    // Fallback: local Stripe checkout simulation page
    const fallbackUrl = `${appOrigin}/statements/checkout?month=${encodeURIComponent(
      month
    )}&scope=${encodeURIComponent(counterpartyId)}&amount=${encodeURIComponent(
      payableAmount.toString()
    )}&ref=${encodeURIComponent(ref)}`

    return NextResponse.json({ url: fallbackUrl })
  }
)
