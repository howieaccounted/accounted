import { NextResponse } from 'next/server'
import { withRouteContext } from '@/lib/api/with-route-context'
import { ensureInitialized } from '@/lib/init'
import {
  DEFAULT_SUPPLIER_STATUSES,
  resolveSupplierStatus,
  updateRuntimeSupplierStatus,
  type SupplierAccountingStatus,
} from '@/lib/invoices/supplier-status'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { getTenantCustomerInvoices, getTenantSupplierInvoices } from '@/lib/invoices/tenant-invoices'
import type { SupplierInvoice } from '@/types'

ensureInitialized()

interface UpdateSupplierStatusPayload {
  invoiceNumber?: string
  status?: SupplierAccountingStatus
  scheduledPaymentDate?: string
  paidAt?: string
}

export const GET = withRouteContext(
  'invoice.supplier_status.list',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    const { searchParams } = new URL(request.url)
    const invoiceNumber = searchParams.get('invoice_number')

    // Fetch supplier invoices if possible
    let supplierInvoices: SupplierInvoice[] = []
    try {
      const { data } = await supabase
        .from('supplier_invoices')
        .select('*')
      if (data && data.length > 0) {
        supplierInvoices = data as SupplierInvoice[]
      } else {
        supplierInvoices = getTenantSupplierInvoices(TENANT_B_COMPANY_ID) as SupplierInvoice[]
      }
    } catch {
      supplierInvoices = getTenantSupplierInvoices(TENANT_B_COMPANY_ID) as SupplierInvoice[]
    }

    if (invoiceNumber) {
      const statusInfo = resolveSupplierStatus(
        { id: invoiceNumber, invoice_number: invoiceNumber },
        supplierInvoices
      )
      return NextResponse.json({ data: statusInfo })
    }

    // Return map of all default and runtime statuses
    const list = Object.entries(DEFAULT_SUPPLIER_STATUSES).map(([num]) =>
      resolveSupplierStatus({ id: num, invoice_number: num }, supplierInvoices)
    )

    return NextResponse.json({ data: list })
  }
)

export const POST = withRouteContext(
  'invoice.supplier_status.update',
  async (request, ctx) => {
    const { supabase, companyId } = ctx
    let body: UpdateSupplierStatusPayload
    try {
      body = (await request.json()) as UpdateSupplierStatusPayload
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { invoiceNumber, status, scheduledPaymentDate, paidAt } = body

    if (!invoiceNumber) {
      return NextResponse.json({ error: 'invoiceNumber is required' }, { status: 400 })
    }

    const updated = updateRuntimeSupplierStatus(invoiceNumber, {
      supplierStatus: status as SupplierAccountingStatus,
      ...(scheduledPaymentDate ? { scheduledPaymentDate } : {}),
      ...(paidAt !== undefined ? { paidAt } : {}),
      ...(status === 'paid' && !paidAt ? { paidAt: new Date().toISOString() } : {}),
    })

    // If marked paid, also attempt to update matching database records
    if (status === 'paid') {
      try {
        await supabase
          .from('supplier_invoices')
          .update({
            status: 'paid',
            paid_at: paidAt || new Date().toISOString(),
          })
          .or(`supplier_invoice_number.eq.${invoiceNumber},supplier_invoice_number.eq.INV-${invoiceNumber}`)
      } catch {
        // Fallback tolerated in unmigrated environments
      }

      try {
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: paidAt || new Date().toISOString(),
          })
          .eq('invoice_number', invoiceNumber)
      } catch {
        // Fallback tolerated in unmigrated environments
      }
    }

    return NextResponse.json({ success: true, data: updated })
  }
)
