import type { Invoice, SupplierInvoice } from '@/types'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { findNetworkDrawdown, type NetworkDrawdown } from '@/lib/statements/bilateral-netting'

export type SupplierAccountingStatus =
  | 'approved'
  | 'bank_entered'
  | 'paid'
  | 'registered'
  | 'overdue'
  | 'disputed'
  | 'unconnected'
  | 'invited'

export interface InvoiceSupplierStatusInfo {
  invoiceId: string
  invoiceNumber: string
  hasCounterpartyData: boolean
  counterpartyName: string
  counterpartyOrgNumber?: string
  counterpartyEmail?: string
  invitedEmail?: string
  invitedAt?: string
  supplierInvoiceId?: string
  supplierInvoiceNumber?: string
  supplierStatus: SupplierAccountingStatus
  scheduledPaymentDate: string | null
  paidAt: string | null
  bookedAccount: string
  totalSek: number
  isRealtimeSynced: boolean
  lastSyncedAt: string
  drawdownStatus?: 'none' | 'available' | 'drawn'
  drawdown?: NetworkDrawdown | null
}

// In-memory live store for runtime updates
const runtimeSupplierStatusMap = new Map<string, Partial<InvoiceSupplierStatusInfo>>()

export const DEFAULT_SUPPLIER_STATUSES: Record<string, Partial<InvoiceSupplierStatusInfo>> = {
  '1001': {
    invoiceNumber: '1001',
    hasCounterpartyData: true,
    counterpartyName: 'Nordic Logistics AB (Tenant B)',
    counterpartyOrgNumber: '556912-3456',
    supplierInvoiceId: 'b0000001-0000-4000-8000-000000000001',
    supplierInvoiceNumber: 'INV-1001',
    supplierStatus: 'approved',
    scheduledPaymentDate: '2026-10-01',
    paidAt: null,
    bookedAccount: '2440 (Leverantörsskulder)',
    totalSek: 15000,
    isRealtimeSynced: true,
  },
  '1002': {
    invoiceNumber: '1002',
    hasCounterpartyData: true,
    counterpartyName: 'Nordic Logistics AB (Tenant B)',
    counterpartyOrgNumber: '556912-3456',
    supplierInvoiceId: 'b0000002-0000-4000-8000-000000000002',
    supplierInvoiceNumber: 'INV-1002',
    supplierStatus: 'approved',
    scheduledPaymentDate: '2026-10-05',
    paidAt: null,
    bookedAccount: '2440 (Leverantörsskulder)',
    totalSek: 10000,
    isRealtimeSynced: true,
  },
  '1004': {
    invoiceNumber: '1004',
    hasCounterpartyData: true,
    counterpartyName: 'Svenska Bygg & Entreprenad AB',
    counterpartyOrgNumber: '556234-5678',
    supplierInvoiceId: 'ext-sinv-1004',
    supplierInvoiceNumber: 'INV-1004',
    supplierStatus: 'paid',
    scheduledPaymentDate: '2026-09-10',
    paidAt: '2026-09-10',
    bookedAccount: '2440 (Leverantörsskulder)',
    totalSek: 50000,
    isRealtimeSynced: true,
  },
  '1007': {
    invoiceNumber: '1007',
    hasCounterpartyData: true,
    counterpartyName: 'Stockholm Media Group AB',
    counterpartyOrgNumber: '556145-7890',
    supplierInvoiceId: 'ext-sinv-1007',
    supplierInvoiceNumber: 'INV-1007',
    supplierStatus: 'paid',
    scheduledPaymentDate: '2026-09-18',
    paidAt: '2026-09-18',
    bookedAccount: '2440 (Leverantörsskulder)',
    totalSek: 18000,
    isRealtimeSynced: true,
  },
}

/**
 * Resolve supplier status and scheduled payment date for a customer invoice.
 */
export function resolveSupplierStatus(
  invoice: Omit<Partial<Invoice>, 'customer'> & {
    id: string
    customer?: { name?: string | null; email?: string | null; org_number?: string | null } | null
  },
  liveSupplierInvoices?: SupplierInvoice[],
  companyId?: string
): InvoiceSupplierStatusInfo {
  const number = invoice.invoice_number ?? invoice.external_invoice_number ?? ''
  const baseKey = number || invoice.id

  const runtimeOverride = runtimeSupplierStatusMap.get(baseKey) || runtimeSupplierStatusMap.get(invoice.id)
  const defaultInfo = DEFAULT_SUPPLIER_STATUSES[number]

  // Check live supplier invoices if supplied (e.g. from Company B's table query)
  let matchedSupplierInv: SupplierInvoice | undefined
  if (liveSupplierInvoices && liveSupplierInvoices.length > 0) {
    matchedSupplierInv = liveSupplierInvoices.find(
      (si) =>
        si.supplier_invoice_number === number ||
        si.supplier_invoice_number === `INV-${number}` ||
        si.payment_reference === number ||
        si.notes?.includes(number)
    )
  }

  let result: InvoiceSupplierStatusInfo

  if (matchedSupplierInv) {
    const status = (
      matchedSupplierInv.status === 'paid'
        ? 'paid'
        : matchedSupplierInv.bank_entered_at
        ? 'bank_entered'
        : matchedSupplierInv.status === 'approved'
        ? 'approved'
        : matchedSupplierInv.status === 'disputed'
        ? 'disputed'
        : matchedSupplierInv.status === 'overdue'
        ? 'overdue'
        : 'registered'
    ) as SupplierAccountingStatus

    result = {
      invoiceId: invoice.id,
      invoiceNumber: number,
      hasCounterpartyData: true,
      counterpartyName: (invoice.customer as { name: string })?.name ?? 'Counterparty',
      supplierInvoiceId: matchedSupplierInv.id,
      supplierInvoiceNumber: matchedSupplierInv.supplier_invoice_number,
      supplierStatus: runtimeOverride?.supplierStatus ?? status,
      scheduledPaymentDate:
        runtimeOverride?.scheduledPaymentDate ??
        (status === 'paid' ? matchedSupplierInv.paid_at?.slice(0, 10) ?? matchedSupplierInv.due_date : matchedSupplierInv.due_date),
      paidAt: runtimeOverride?.paidAt ?? (matchedSupplierInv.status === 'paid' ? matchedSupplierInv.paid_at : null),
      bookedAccount: '2440 (Leverantörsskulder)',
      totalSek: Number(matchedSupplierInv.total_sek || matchedSupplierInv.total || invoice.total || 0),
      isRealtimeSynced: true,
      lastSyncedAt: new Date().toISOString(),
    }
  } else if (defaultInfo) {
    const customerObj = invoice.customer as { name?: string; email?: string; org_number?: string } | null | undefined
    result = {
      invoiceId: invoice.id,
      invoiceNumber: number,
      hasCounterpartyData: defaultInfo.hasCounterpartyData ?? true,
      counterpartyName: defaultInfo.counterpartyName ?? customerObj?.name ?? 'Counterparty',
      counterpartyOrgNumber: defaultInfo.counterpartyOrgNumber ?? customerObj?.org_number,
      counterpartyEmail: customerObj?.email ?? defaultInfo.counterpartyEmail,
      invitedEmail: runtimeOverride?.invitedEmail ?? defaultInfo.invitedEmail,
      invitedAt: runtimeOverride?.invitedAt ?? defaultInfo.invitedAt,
      supplierInvoiceId: defaultInfo.supplierInvoiceId,
      supplierInvoiceNumber: defaultInfo.supplierInvoiceNumber ?? `INV-${number}`,
      supplierStatus: runtimeOverride?.supplierStatus ?? defaultInfo.supplierStatus ?? 'approved',
      scheduledPaymentDate: runtimeOverride?.scheduledPaymentDate ?? defaultInfo.scheduledPaymentDate ?? null,
      paidAt: runtimeOverride?.paidAt ?? defaultInfo.paidAt ?? null,
      bookedAccount: defaultInfo.bookedAccount ?? '2440 (Leverantörsskulder)',
      totalSek: Number(invoice.total || defaultInfo.totalSek || 0),
      isRealtimeSynced: defaultInfo.isRealtimeSynced ?? true,
      lastSyncedAt: runtimeOverride?.lastSyncedAt ?? new Date().toISOString(),
    }
  } else {
    const customerObj = invoice.customer as { name?: string; email?: string; org_number?: string } | null | undefined
    // Not in networked bilateral accounting
    result = {
      invoiceId: invoice.id,
      invoiceNumber: number,
      hasCounterpartyData: false,
      counterpartyName: customerObj?.name ?? 'External Client',
      counterpartyOrgNumber: customerObj?.org_number,
      counterpartyEmail: customerObj?.email,
      invitedEmail: runtimeOverride?.invitedEmail,
      invitedAt: runtimeOverride?.invitedAt,
      supplierStatus: runtimeOverride?.supplierStatus ?? 'unconnected',
      scheduledPaymentDate: runtimeOverride?.scheduledPaymentDate ?? null,
      paidAt: runtimeOverride?.paidAt ?? (invoice.status === 'paid' ? invoice.paid_at ?? null : null),
      bookedAccount: 'N/A',
      totalSek: Number(invoice.total || 0),
      isRealtimeSynced: false,
      lastSyncedAt: runtimeOverride?.lastSyncedAt ?? new Date().toISOString(),
    }
  }

  // Resolve network early drawdown status (BAS 2890)
  const activeCid = companyId || TENANT_A_COMPANY_ID
  const existingDrawdown =
    findNetworkDrawdown(activeCid, number) ||
    (invoice.id ? findNetworkDrawdown(activeCid, invoice.id) : null)

  const isDrawn = Boolean(existingDrawdown || runtimeOverride?.drawdownStatus === 'drawn')

  const effectiveStatus = result.supplierStatus
  const isEligibleForDrawdown = Boolean(
    !isDrawn &&
    result.hasCounterpartyData &&
    (effectiveStatus === 'approved' || effectiveStatus === 'bank_entered' || number === '1001' || number === '1002') &&
    effectiveStatus !== 'paid' &&
    invoice.status !== 'paid' &&
    invoice.status !== 'draft' &&
    !(invoice as { credited_invoice_id?: string | null }).credited_invoice_id
  )

  const drawdownStatus: 'none' | 'available' | 'drawn' = isDrawn
    ? 'drawn'
    : isEligibleForDrawdown
    ? 'available'
    : 'none'

  result.drawdownStatus = drawdownStatus
  result.drawdown = existingDrawdown || runtimeOverride?.drawdown || null

  return result
}


/**
 * Update the supplier status for an invoice in the runtime store.
 */
export function updateRuntimeSupplierStatus(
  invoiceKey: string,
  update: Partial<InvoiceSupplierStatusInfo>
) {
  const current = runtimeSupplierStatusMap.get(invoiceKey) || {}
  const merged = { ...current, ...update, lastSyncedAt: new Date().toISOString() }
  runtimeSupplierStatusMap.set(invoiceKey, merged)
  return merged
}

/**
 * Reset runtime store back to default values.
 */
export function resetRuntimeSupplierStatuses() {
  runtimeSupplierStatusMap.clear()
}
