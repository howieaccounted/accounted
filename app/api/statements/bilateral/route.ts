import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import {
  computeMonthlyStatement,
  settleStatement,
  unsettleStatement,
  getConnectedCounterparties,
} from '@/lib/statements/bilateral-netting'
import { ensureHistoricalStatementsSeeded } from '@/lib/statements/previous-statements'
import { syncNettingToAccounting } from '@/lib/statements/netting-erp-sync'
import type { Invoice, SupplierInvoice } from '@/types'

export const dynamic = 'force-dynamic'

interface SettlePayload {
  month?: string
  counterpartyId?: string
  reference?: string
  notes?: string
  action?: 'settle' | 'unsettle'
}

export const GET = withRouteContext(
  'statement.bilateral.get',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || '2026-09'
    const counterpartyId = searchParams.get('counterparty_id') || 'all'

    let liveCustomerInvoices: Invoice[] | undefined
    let liveSupplierInvoices: SupplierInvoice[] | undefined

    let dbCounterparties: ReturnType<typeof getConnectedCounterparties> | undefined

    try {
      if (companyId) {
        const [custRes, suppRes, peersRes] = await Promise.all([
          supabase.from('invoices').select('*, customer:customers(*)').eq('company_id', companyId),
          supabase.from('supplier_invoices').select('*, supplier:suppliers(*)').eq('company_id', companyId),
          supabase.from('network_peers').select('*').eq('tenant_id', companyId).eq('status', 'active'),
        ])

        if (custRes.data && custRes.data.length > 0) {
          liveCustomerInvoices = custRes.data as Invoice[]
        }
        if (suppRes.data && suppRes.data.length > 0) {
          liveSupplierInvoices = suppRes.data as SupplierInvoice[]
        }
        if (peersRes.data && peersRes.data.length > 0) {
          dbCounterparties = peersRes.data.map((p) => ({
            id: p.peer_tenant_id || p.id,
            companyId: p.peer_tenant_id || p.id,
            name: p.peer_name,
            orgNumber: p.peer_org_number,
            isConnected: true,
            networkConnectionDate: p.created_at || new Date().toISOString(),
          }))
        }
      }
    } catch {
      // Fallback to tenant/local fixtures
    }

    const activeCompanyId = companyId || 'c0000000-0000-4000-8000-00000000000a'
    ensureHistoricalStatementsSeeded(activeCompanyId)

    const statement = computeMonthlyStatement({
      activeCompanyId,
      counterpartyId,
      month,
      customCounterparties: dbCounterparties,
      liveCustomerInvoices,
      liveSupplierInvoices,
    })

    const counterparties = dbCounterparties || getConnectedCounterparties(activeCompanyId)

    return NextResponse.json({
      data: statement,
      counterparties,
    })
  }
)

export const POST = withRouteContext(
  'statement.bilateral.settle',
  async (request, ctx) => {
    const { supabase, companyId, user } = ctx
    let body: SettlePayload
    try {
      body = (await request.json()) as SettlePayload
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { month = '2026-09', counterpartyId, reference, notes, action } = body
    const activeCid = companyId || 'c0000000-0000-4000-8000-00000000000a'
    const targetCounterpartyId = counterpartyId || 'all'
    ensureHistoricalStatementsSeeded(activeCid)

    if (action === 'unsettle') {
      const resetStatement = unsettleStatement(activeCid, targetCounterpartyId, month)
      return NextResponse.json({
        success: true,
        data: resetStatement,
        action: 'unsettle',
      })
    }

    const settledStatement = settleStatement(activeCid, targetCounterpartyId, month, {
      reference,
      notes,
    })

    // Perform automated ERP sync-back: create balancing journal entry in GL and mark invoices paid
    const erpSyncResult = await syncNettingToAccounting(settledStatement, {
      supabase,
      companyId: activeCid,
      userId: user?.id,
    })

    settledStatement.accountingVoucher = erpSyncResult.voucher
    settledStatement.erpSyncStatus = erpSyncResult

    return NextResponse.json({
      success: true,
      data: settledStatement,
      erpSync: erpSyncResult,
    })
  }
)
