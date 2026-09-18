import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import {
  getAutogiroMandate,
  activateAutogiroMandate,
  cancelAutogiroMandate,
} from '@/lib/statements/payment-instructions'
import { TENANT_A_COMPANY_ID } from '@/lib/company/active-company'

export const dynamic = 'force-dynamic'

interface MandatePayload {
  companyId?: string
  bankName: string
  clearingNumber: string
  accountNumber: string
  bankgiro?: string | null
  payerOrgNumber?: string
}

export const GET = withRouteContext(
  'statement.autogiro.get',
  async (request, ctx) => {
    const { companyId } = ctx
    const { searchParams } = new URL(request.url)
    const targetCid = searchParams.get('company_id') || companyId || TENANT_A_COMPANY_ID

    const mandate = getAutogiroMandate(targetCid)

    return NextResponse.json({
      mandate,
      isConfigured: mandate?.status === 'active',
    })
  }
)

export const POST = withRouteContext(
  'statement.autogiro.activate',
  async (request, ctx) => {
    const { companyId } = ctx
    let body: MandatePayload
    try {
      body = (await request.json()) as MandatePayload
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const targetCid = body.companyId || companyId || TENANT_A_COMPANY_ID

    if (!body.clearingNumber || !body.accountNumber) {
      return NextResponse.json(
        { error: 'Clearing number and account number are required' },
        { status: 400 }
      )
    }

    const mandate = activateAutogiroMandate({
      companyId: targetCid,
      bankName: body.bankName,
      clearingNumber: body.clearingNumber,
      accountNumber: body.accountNumber,
      bankgiro: body.bankgiro,
      payerOrgNumber: body.payerOrgNumber,
    })

    return NextResponse.json({
      success: true,
      mandate,
    })
  }
)

export const DELETE = withRouteContext(
  'statement.autogiro.cancel',
  async (request, ctx) => {
    const { companyId } = ctx
    const { searchParams } = new URL(request.url)
    const targetCid = searchParams.get('company_id') || companyId || TENANT_A_COMPANY_ID

    const cancelled = cancelAutogiroMandate(targetCid)

    return NextResponse.json({
      success: cancelled,
    })
  }
)
