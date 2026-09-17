import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import {
  computeMonthlyStatement,
  settleStatement,
  getConnectedCounterparties,
} from '@/lib/statements/bilateral-netting'
import type { Invoice, SupplierInvoice } from '@/types'

export const dynamic = 'force-dynamic'

interface SettlePayload {
  month?: string
  counterpartyId?: string
  reference?: string
  notes?: string
}

export const GET = withRouteContext(
  'statement.bilateral.get',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || '2026-09'
    const counterpartyId = searchParams.get('counterparty_id')

    let liveCustomerInvoices: Invoice[] | undefined
    let liveSupplierInvoices: SupplierInvoice[] | undefined

    try {
      if (companyId) {
        const [custRes, suppRes] = await Promise.all([
          supabase.from('invoices').select('*, customer:customers(*)').eq('company_id', companyId),
          supabase.from('supplier_invoices').select('*, supplier:suppliers(*)').eq('company_id', companyId),
        ])

        if (custRes.data && custRes.data.length > 0) {
          liveCustomerInvoices = custRes.data as Invoice[]
        }
        if (suppRes.data && suppRes.data.length > 0) {
          liveSupplierInvoices = suppRes.data as SupplierInvoice[]
        }
      }
    } catch {
      // Fallback to tenant/local fixtures
    }

    const statement = computeMonthlyStatement({
      activeCompanyId: companyId,
      counterpartyId,
      month,
      liveCustomerInvoices,
      liveSupplierInvoices,
    })

    const counterparties = getConnectedCounterparties(companyId)

    return NextResponse.json({
      data: statement,
      counterparties,
    })
  }
)

export const POST = withRouteContext(
  'statement.bilateral.settle',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    let body: SettlePayload
    try {
      body = (await request.json()) as SettlePayload
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { month = '2026-09', counterpartyId, reference, notes } = body
    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'
    const counterparties = getConnectedCounterparties(activeCid)
    const targetCounterpartyId = counterpartyId || counterparties[0]?.id || ''

    const settledStatement = settleStatement(activeCid, targetCounterpartyId, month, {
      reference,
      notes,
    })

    // Sync involved customer and supplier invoices in DB if available
    try {
      const customerInvoiceIds = settledStatement.receivables.map((r) => r.id)
      const supplierInvoiceIds = settledStatement.payables.map((p) => p.id)

      if (customerInvoiceIds.length > 0) {
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: settledStatement.settledAt || new Date().toISOString(),
          })
          .in('id', customerInvoiceIds)
      }

      if (supplierInvoiceIds.length > 0) {
        await supabase
          .from('supplier_invoices')
          .update({
            status: 'paid',
            paid_at: settledStatement.settledAt || new Date().toISOString(),
          })
          .in('id', supplierInvoiceIds)
      }
    } catch {
      // Tolerate in dev/unmigrated DBs
    }

    return NextResponse.json({
      success: true,
      data: settledStatement,
    })
  }
)
