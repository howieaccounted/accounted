import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import { roundOre } from '@/lib/money'
import {
  computeMonthlyStatement,
  recordNetworkDrawdown,
  getNetworkDrawdowns,
  type NetworkDrawdown,
} from '@/lib/statements/bilateral-netting'
import { generateDrawdownVoucher } from '@/lib/statements/netting-erp-sync'
import { ensureHistoricalStatementsSeeded } from '@/lib/statements/previous-statements'

export const dynamic = 'force-dynamic'

interface DrawdownRequestBody {
  invoiceId?: string
  invoiceNumber?: string
  month?: string
  feePercent?: number
  destinationAccount?: string
}

export const GET = withRouteContext(
  'statement.bilateral.drawdown.get',
  async (request, ctx) => {
    const { companyId } = ctx
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || '2026-09'
    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'

    ensureHistoricalStatementsSeeded(activeCid)
    const drawdowns = getNetworkDrawdowns(activeCid, month)

    return NextResponse.json({
      success: true,
      data: drawdowns,
    })
  }
)

export const POST = withRouteContext(
  'statement.bilateral.drawdown.post',
  async (request, ctx) => {
    const { companyId } = ctx
    let body: DrawdownRequestBody
    try {
      body = (await request.json()) as DrawdownRequestBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const {
      invoiceId,
      invoiceNumber,
      month = '2026-09',
      feePercent = 1.0,
      destinationAccount = 'SEB Företagskonto (1930 / Bg 5050-1055)',
    } = body

    if (!invoiceId && !invoiceNumber) {
      return NextResponse.json(
        { error: 'invoiceId or invoiceNumber is required to draw down funds' },
        { status: 400 }
      )
    }

    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'
    ensureHistoricalStatementsSeeded(activeCid)

    // Compute current statement to locate the verified invoice
    const currentStatement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId: 'all',
      month,
    })

    const targetItem = currentStatement.receivables.find(
      (r) =>
        (invoiceId && r.id === invoiceId) ||
        (invoiceNumber && r.invoiceNumber === invoiceNumber)
    )

    if (!targetItem) {
      return NextResponse.json(
        { error: 'Invoice not found in open network receivables for this month' },
        { status: 404 }
      )
    }

    if (!targetItem.isNetworkVerified) {
      return NextResponse.json(
        {
          error:
            'Invoice has not yet been verified by the counterparty on the Accounted Network',
        },
        { status: 422 }
      )
    }

    if (targetItem.drawdownStatus === 'drawn') {
      return NextResponse.json(
        { error: 'Monies for this verified invoice have already been drawn down' },
        { status: 409 }
      )
    }

    const grossAmountSek = roundOre(targetItem.amountSek)
    const feeAmountSek = roundOre(grossAmountSek * (feePercent / 100))
    const netDisbursedSek = roundOre(grossAmountSek - feeAmountSek)
    const nowIso = new Date().toISOString()
    const monthClean = month.replace('-', '')
    const ref = `DD-${monthClean}-${targetItem.invoiceNumber}`

    const drawdown: NetworkDrawdown = {
      id: `dd_${targetItem.id}`,
      invoiceId: targetItem.id,
      invoiceNumber: targetItem.invoiceNumber,
      companyId: activeCid,
      counterpartyId: targetItem.counterpartyId || 'unknown',
      counterpartyName: targetItem.counterpartyName,
      counterpartyOrgNumber: targetItem.counterpartyOrgNumber,
      grossAmountSek,
      feePercent,
      feeAmountSek,
      netDisbursedSek,
      requestedAt: nowIso,
      disbursedAt: nowIso,
      destinationAccount,
      status: 'completed',
      statementMonth: month,
      reference: ref,
    }

    // Persist the drawdown in the runtime store
    recordNetworkDrawdown(drawdown)

    // Generate the interim accounting voucher (debit 1930 & 6570, credit 2890)
    const voucher = generateDrawdownVoucher(drawdown)

    // Re-compute monthly statement with the new advance deducted
    const updatedStatement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId: 'all',
      month,
    })

    return NextResponse.json({
      success: true,
      data: drawdown,
      voucher,
      statement: updatedStatement,
    })
  }
)
