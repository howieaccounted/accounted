import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import {
  DEFAULT_SUPPLIER_SIDE_STATUSES,
  resolveSupplierSideStatus,
  updateRuntimeSupplierSideStatus,
  type SupplierSideAccountingStatus,
} from '@/lib/supplier-invoices/supplier-side-status'
import { TENANT_A_COMPANY_ID } from '@/lib/company/active-company'
import { getTenantCustomerInvoices, getTenantSupplierInvoices } from '@/lib/invoices/tenant-invoices'
import type { Invoice, SupplierInvoice } from '@/types'

export const dynamic = 'force-dynamic'

interface UpdateSupplierSideStatusPayload {
  invoiceNumber?: string
  status?: SupplierSideAccountingStatus
  paymentReceivedAt?: string
}

export const GET = withRouteContext(
  'supplier_invoice.supplier_side_status.list',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    const { searchParams } = new URL(request.url)
    const invoiceNumber = searchParams.get('invoice_number')

    // Fetch live customer invoices if possible to check supplier AR status
    let customerInvoices: Invoice[] = []
    try {
      const { data } = await supabase.from('invoices').select('*')
      if (data && data.length > 0) {
        customerInvoices = data as Invoice[]
      } else {
        customerInvoices = getTenantCustomerInvoices(TENANT_A_COMPANY_ID) as Invoice[]
      }
    } catch {
      customerInvoices = getTenantCustomerInvoices(TENANT_A_COMPANY_ID) as Invoice[]
    }

    if (invoiceNumber) {
      const statusInfo = resolveSupplierSideStatus(
        { id: invoiceNumber, supplier_invoice_number: invoiceNumber },
        customerInvoices
      )
      return NextResponse.json({ data: statusInfo })
    }

    // Return list of all default statuses merged with runtime state
    const list = Object.entries(DEFAULT_SUPPLIER_SIDE_STATUSES).map(([num]) =>
      resolveSupplierSideStatus({ id: num, supplier_invoice_number: num }, customerInvoices)
    )

    return NextResponse.json({ data: list })
  }
)

export const POST = withRouteContext(
  'supplier_invoice.supplier_side_status.update',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    let body: UpdateSupplierSideStatusPayload
    try {
      body = (await request.json()) as UpdateSupplierSideStatusPayload
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { invoiceNumber, status, paymentReceivedAt } = body

    if (!invoiceNumber) {
      return NextResponse.json({ error: 'invoiceNumber is required' }, { status: 400 })
    }

    const updated = updateRuntimeSupplierSideStatus(invoiceNumber, {
      supplierSideStatus: status as SupplierSideAccountingStatus,
      ...(paymentReceivedAt ? { paymentReceivedAt } : {}),
      ...((status === 'payment_received' || status === 'reconciled') && !paymentReceivedAt
        ? { paymentReceivedAt: new Date().toISOString() }
        : {}),
    })

    // If marked payment_received or reconciled, also sync supplier_invoices record
    if (status === 'payment_received' || status === 'reconciled') {
      try {
        await supabase
          .from('supplier_invoices')
          .update({
            status: 'paid',
            paid_at: paymentReceivedAt || new Date().toISOString(),
          })
          .or(`supplier_invoice_number.eq.${invoiceNumber},supplier_invoice_number.eq.INV-${invoiceNumber},id.eq.${invoiceNumber}`)
      } catch {
        // Fallback tolerated in unmigrated environments
      }

      // Also attempt to update customer invoice if bilateral peer exists
      try {
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: paymentReceivedAt || new Date().toISOString(),
          })
          .eq('invoice_number', invoiceNumber)
      } catch {
        // Fallback tolerated
      }
    }

    return NextResponse.json({ success: true, data: updated })
  }
)
