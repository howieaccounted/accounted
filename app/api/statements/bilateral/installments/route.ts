import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import {
  computeMonthlyStatement,
  getStatementInstallmentPlan,
  createStatementInstallmentPlan,
  cancelStatementInstallmentPlan,
  simulateInstallmentOptions,
} from '@/lib/statements/bilateral-netting'
import { generateInstallmentPlanVoucher } from '@/lib/statements/netting-erp-sync'
import { ensureHistoricalStatementsSeeded } from '@/lib/statements/previous-statements'

export const dynamic = 'force-dynamic'

interface CreateInstallmentRequestBody {
  month?: string
  termMonths?: 2 | 3 | 4
  paymentMethod?: 'autogiro' | 'bankgiro'
  autogiroMandateRef?: string
}

export const GET = withRouteContext(
  'statement.bilateral.installments.get',
  async (request, ctx) => {
    const { companyId } = ctx
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || '2026-09'
    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'

    ensureHistoricalStatementsSeeded(activeCid)

    const statement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId: 'all',
      month,
    })

    const plan = getStatementInstallmentPlan(activeCid, month)
    const simulations = simulateInstallmentOptions(
      statement.settlementAmountSek,
      statement.statementDueDate
    )

    return NextResponse.json({
      success: true,
      plan,
      simulations,
      settlementAmountSek: statement.settlementAmountSek,
      settlementDirection: statement.settlementDirection,
    })
  }
)

export const POST = withRouteContext(
  'statement.bilateral.installments.post',
  async (request, ctx) => {
    const { companyId } = ctx
    let body: CreateInstallmentRequestBody
    try {
      body = (await request.json()) as CreateInstallmentRequestBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const {
      month = '2026-09',
      termMonths = 3,
      paymentMethod = 'autogiro',
      autogiroMandateRef,
    } = body

    if (![2, 3, 4].includes(termMonths)) {
      return NextResponse.json(
        { error: 'termMonths must be 2, 3, or 4' },
        { status: 400 }
      )
    }

    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'
    ensureHistoricalStatementsSeeded(activeCid)

    const statement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId: 'all',
      month,
    })

    if (statement.settlementDirection !== 'pay' || statement.settlementAmountSek <= 0) {
      return NextResponse.json(
        { error: 'Installment plans can only be created for statements with a net payable balance' },
        { status: 422 }
      )
    }

    const plan = createStatementInstallmentPlan({
      companyId: activeCid,
      statementMonth: month,
      principalSek: statement.settlementAmountSek,
      termMonths,
      paymentMethod,
      autogiroMandateRef,
      startDate: statement.statementDueDate,
    })

    const voucher = generateInstallmentPlanVoucher(statement, plan)

    // Recompute statement to reflect attached plan
    const updatedStatement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId: 'all',
      month,
    })

    return NextResponse.json({
      success: true,
      plan,
      voucher,
      statement: updatedStatement,
    })
  }
)

export const DELETE = withRouteContext(
  'statement.bilateral.installments.delete',
  async (request, ctx) => {
    const { companyId } = ctx
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || '2026-09'
    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'

    const cancelled = cancelStatementInstallmentPlan(activeCid, month)

    const updatedStatement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId: 'all',
      month,
    })

    return NextResponse.json({
      success: true,
      cancelled,
      statement: updatedStatement,
    })
  }
)
