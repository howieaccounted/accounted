import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import {
  computeMonthlyStatement,
  getConnectedCounterparties,
} from '@/lib/statements/bilateral-netting'
import {
  generateNettingVoucherTemplate,
  generateStandaloneSie4File,
} from '@/lib/statements/netting-erp-sync'
import type { Invoice, SupplierInvoice } from '@/types'

export const dynamic = 'force-dynamic'

export const GET = withRouteContext(
  'statement.bilateral.sie.export',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || '2026-09'
    const counterpartyId = searchParams.get('counterparty_id') || 'all'

    let liveCustomerInvoices: Invoice[] | undefined
    let liveSupplierInvoices: SupplierInvoice[] | undefined
    let dbCounterparties: ReturnType<typeof getConnectedCounterparties> | undefined
    let companyName = 'Accounted Företag AB'
    let orgNumber = '556000-0000'

    try {
      if (companyId) {
        const [custRes, suppRes, peersRes, compRes] = await Promise.all([
          supabase.from('invoices').select('*, customer:customers(*)').eq('company_id', companyId),
          supabase.from('supplier_invoices').select('*, supplier:suppliers(*)').eq('company_id', companyId),
          supabase.from('network_peers').select('*').eq('tenant_id', companyId).eq('status', 'active'),
          supabase.from('companies').select('name, org_number').eq('id', companyId).single(),
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
        if (compRes.data) {
          companyName = compRes.data.name || companyName
          orgNumber = compRes.data.org_number || orgNumber
        }
      }
    } catch {
      // Fallback in demo/offline mode
    }

    const statement = computeMonthlyStatement({
      activeCompanyId: companyId,
      counterpartyId,
      month,
      customCounterparties: dbCounterparties,
      liveCustomerInvoices,
      liveSupplierInvoices,
    })

    const voucher = statement.accountingVoucher || generateNettingVoucherTemplate(statement)
    const sieContent = generateStandaloneSie4File({
      statement,
      voucher,
      companyName,
      orgNumber,
    })

    return new NextResponse(sieContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="accounted-netting-${month}.se"`,
      },
    })
  }
)
