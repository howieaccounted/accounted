import type { Invoice, SupplierInvoice } from '@/types'

export type SupplierSideAccountingStatus =
  | 'booked_receivable'
  | 'payment_received'
  | 'reconciled'
  | 'overdue'
  | 'disputed'
  | 'unconnected'
  | 'invited'

export interface SupplierSideStatusInfo {
  supplierInvoiceId: string
  supplierInvoiceNumber: string
  hasSupplierData: boolean
  supplierName: string
  supplierOrgNumber?: string
  supplierEmail?: string
  invitedEmail?: string
  invitedAt?: string
  supplierSideStatus: SupplierSideAccountingStatus
  customerInvoiceNumber?: string
  bookedAccount: string
  totalSek: number
  dueDate: string | null
  paymentReceivedAt: string | null
  isRealtimeSynced: boolean
  lastSyncedAt: string
}

// In-memory live store for runtime updates across web sessions
const runtimeSupplierSideStatusMap = new Map<string, Partial<SupplierSideStatusInfo>>()

export const DEFAULT_SUPPLIER_SIDE_STATUSES: Record<string, Partial<SupplierSideStatusInfo>> = {
  // --- Company A Supplier Invoices (counterparties) ---
  'NL-88101': {
    supplierInvoiceNumber: 'NL-88101',
    hasSupplierData: true,
    supplierName: 'Nordic Logistics AB (Tenant B)',
    supplierOrgNumber: '556123-4567',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'NL-88101',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 20000,
    dueDate: '2026-10-02',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'NL-88102': {
    supplierInvoiceNumber: 'NL-88102',
    hasSupplierData: true,
    supplierName: 'Nordic Logistics AB (Tenant B)',
    supplierOrgNumber: '556123-4567',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'NL-88102',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 9000,
    dueDate: '2026-10-08',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'TEL-90412': {
    supplierInvoiceNumber: 'TEL-90412',
    hasSupplierData: true,
    supplierName: 'Telia Sverige AB',
    supplierOrgNumber: '556430-0142',
    supplierSideStatus: 'reconciled',
    customerInvoiceNumber: 'TEL-90412',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 4500,
    dueDate: '2026-09-25',
    paymentReceivedAt: '2026-09-20',
    isRealtimeSynced: true,
  },
  'FNX-482910': {
    supplierInvoiceNumber: 'FNX-482910',
    hasSupplierData: true,
    supplierName: 'Fortnox AB',
    supplierOrgNumber: '556469-6291',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'FNX-482910',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 3000,
    dueDate: '2026-09-30',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'AWS-9912044': {
    supplierInvoiceNumber: 'AWS-9912044',
    hasSupplierData: true,
    supplierName: 'Amazon Web Services EMEA SARL',
    supplierOrgNumber: 'LU26375245',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'AWS-9912044',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 12500,
    dueDate: '2026-10-03',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'WH-10492': {
    supplierInvoiceNumber: 'WH-10492',
    hasSupplierData: true,
    supplierName: 'Wihlborgs Fastigheter AB',
    supplierOrgNumber: '556367-0230',
    supplierSideStatus: 'reconciled',
    customerInvoiceNumber: 'WH-10492',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 31250,
    dueDate: '2026-09-30',
    paymentReceivedAt: '2026-09-28',
    isRealtimeSynced: true,
  },
  'DST-772190': {
    supplierInvoiceNumber: 'DST-772190',
    hasSupplierData: true,
    supplierName: 'Dustin Sverige AB',
    supplierOrgNumber: '556403-8668',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'DST-772190',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 18000,
    dueDate: '2026-10-10',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'VF-339182': {
    supplierInvoiceNumber: 'VF-339182',
    hasSupplierData: true,
    supplierName: 'Vattenfall Kundservice AB',
    supplierOrgNumber: '556447-1588',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'VF-339182',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 6000,
    dueDate: '2026-09-30',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'KIV-110294': {
    supplierInvoiceNumber: 'KIV-110294',
    hasSupplierData: true,
    supplierName: 'Kivra AB',
    supplierOrgNumber: '556840-2266',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'KIV-110294',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 2000,
    dueDate: '2026-10-05',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'PN-601932': {
    supplierInvoiceNumber: 'PN-601932',
    hasSupplierData: true,
    supplierName: 'PostNord Sverige AB',
    supplierOrgNumber: '556712-4166',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: 'PN-601932',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 1500,
    dueDate: '2026-10-01',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },

  // --- Company B Supplier Invoices (from Riminton AB / Company A) ---
  '1001': {
    supplierInvoiceNumber: '1001',
    hasSupplierData: true,
    supplierName: 'Riminton AB (Company A)',
    supplierOrgNumber: '556000-0001',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: '1001',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 15000,
    dueDate: '2026-10-01',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'INV-1001': {
    supplierInvoiceNumber: 'INV-1001',
    hasSupplierData: true,
    supplierName: 'Riminton AB (Company A)',
    supplierOrgNumber: '556000-0001',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: '1001',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 15000,
    dueDate: '2026-10-01',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  '1002': {
    supplierInvoiceNumber: '1002',
    hasSupplierData: true,
    supplierName: 'Riminton AB (Company A)',
    supplierOrgNumber: '556000-0001',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: '1002',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 10000,
    dueDate: '2026-10-05',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
  'INV-1002': {
    supplierInvoiceNumber: 'INV-1002',
    hasSupplierData: true,
    supplierName: 'Riminton AB (Company A)',
    supplierOrgNumber: '556000-0001',
    supplierSideStatus: 'booked_receivable',
    customerInvoiceNumber: '1002',
    bookedAccount: '1510 (Kundfordringar)',
    totalSek: 10000,
    dueDate: '2026-10-05',
    paymentReceivedAt: null,
    isRealtimeSynced: true,
  },
}

/**
 * Resolve supplier-side status (AR status, Konto 1510 Kundfordringar, live sync)
 * for a given supplier invoice.
 */
export function resolveSupplierSideStatus(
  invoice: Omit<Partial<SupplierInvoice>, 'supplier'> & {
    id: string
    supplier_invoice_number?: string | null
    supplier?: { name?: string | null; org_number?: string | null; email?: string | null } | null
  },
  liveCustomerInvoices?: Invoice[]
): SupplierSideStatusInfo {
  const invoiceNum = invoice.supplier_invoice_number || invoice.id
  const runtimeOverride =
    runtimeSupplierSideStatusMap.get(invoiceNum) ||
    runtimeSupplierSideStatusMap.get(invoice.id) ||
    (invoice.supplier_invoice_number ? runtimeSupplierSideStatusMap.get(invoice.supplier_invoice_number) : undefined)

  const supplierObj = invoice.supplier as { name?: string; org_number?: string; email?: string } | null | undefined

  // 1. Check live counterpart customer invoices if provided
  let matchedCustomerInv: Invoice | undefined
  if (liveCustomerInvoices && liveCustomerInvoices.length > 0) {
    matchedCustomerInv = liveCustomerInvoices.find(
      (ci) =>
        ci.invoice_number === invoiceNum ||
        `INV-${ci.invoice_number}` === invoiceNum ||
        ci.invoice_number === invoiceNum.replace(/^INV-/, '') ||
        ci.id === invoice.id
    )
  }

  if (matchedCustomerInv) {
    const status: SupplierSideAccountingStatus =
      matchedCustomerInv.status === 'paid'
        ? 'payment_received'
        : matchedCustomerInv.status === 'overdue'
        ? 'overdue'
        : 'booked_receivable'

    return {
      supplierInvoiceId: invoice.id,
      supplierInvoiceNumber: invoiceNum,
      hasSupplierData: true,
      supplierName: supplierObj?.name ?? 'Counterparty Supplier',
      supplierOrgNumber: supplierObj?.org_number,
      supplierEmail: supplierObj?.email,
      invitedEmail: runtimeOverride?.invitedEmail,
      invitedAt: runtimeOverride?.invitedAt,
      supplierSideStatus: runtimeOverride?.supplierSideStatus ?? status,
      customerInvoiceNumber: matchedCustomerInv.invoice_number ?? undefined,
      bookedAccount: '1510 (Kundfordringar)',
      totalSek: Number(matchedCustomerInv.total_sek || matchedCustomerInv.total || invoice.total || 0),
      dueDate: runtimeOverride?.dueDate ?? matchedCustomerInv.due_date ?? invoice.due_date ?? null,
      paymentReceivedAt:
        runtimeOverride?.paymentReceivedAt ??
        (status === 'payment_received' ? matchedCustomerInv.paid_at ?? new Date().toISOString() : null),
      isRealtimeSynced: true,
      lastSyncedAt: runtimeOverride?.lastSyncedAt ?? new Date().toISOString(),
    }
  }

  // 2. Default preset lookup
  const defaultInfo =
    DEFAULT_SUPPLIER_SIDE_STATUSES[invoiceNum] ||
    (invoice.supplier_invoice_number ? DEFAULT_SUPPLIER_SIDE_STATUSES[invoice.supplier_invoice_number] : undefined)

  if (defaultInfo) {
    return {
      supplierInvoiceId: invoice.id,
      supplierInvoiceNumber: invoiceNum,
      hasSupplierData: defaultInfo.hasSupplierData ?? true,
      supplierName: defaultInfo.supplierName ?? supplierObj?.name ?? 'Supplier',
      supplierOrgNumber: defaultInfo.supplierOrgNumber ?? supplierObj?.org_number,
      supplierEmail: supplierObj?.email ?? defaultInfo.supplierEmail,
      invitedEmail: runtimeOverride?.invitedEmail ?? defaultInfo.invitedEmail,
      invitedAt: runtimeOverride?.invitedAt ?? defaultInfo.invitedAt,
      supplierSideStatus: runtimeOverride?.supplierSideStatus ?? defaultInfo.supplierSideStatus ?? 'booked_receivable',
      customerInvoiceNumber: defaultInfo.customerInvoiceNumber ?? invoiceNum,
      bookedAccount: defaultInfo.bookedAccount ?? '1510 (Kundfordringar)',
      totalSek: Number(invoice.total || defaultInfo.totalSek || 0),
      dueDate: runtimeOverride?.dueDate ?? defaultInfo.dueDate ?? invoice.due_date ?? null,
      paymentReceivedAt: runtimeOverride?.paymentReceivedAt ?? defaultInfo.paymentReceivedAt ?? null,
      isRealtimeSynced: defaultInfo.isRealtimeSynced ?? true,
      lastSyncedAt: runtimeOverride?.lastSyncedAt ?? new Date().toISOString(),
    }
  }

  // 3. Unconnected supplier fallback
  return {
    supplierInvoiceId: invoice.id,
    supplierInvoiceNumber: invoiceNum,
    hasSupplierData: false,
    supplierName: supplierObj?.name ?? 'External Supplier',
    supplierOrgNumber: supplierObj?.org_number,
    supplierEmail: supplierObj?.email,
    invitedEmail: runtimeOverride?.invitedEmail,
    invitedAt: runtimeOverride?.invitedAt,
    supplierSideStatus: runtimeOverride?.supplierSideStatus ?? 'unconnected',
    customerInvoiceNumber: undefined,
    bookedAccount: 'N/A',
    totalSek: Number(invoice.total || 0),
    dueDate: runtimeOverride?.dueDate ?? invoice.due_date ?? null,
    paymentReceivedAt: runtimeOverride?.paymentReceivedAt ?? (invoice.status === 'paid' ? invoice.paid_at ?? null : null),
    isRealtimeSynced: false,
    lastSyncedAt: runtimeOverride?.lastSyncedAt ?? new Date().toISOString(),
  }
}

/**
 * Update the supplier side status for a supplier invoice in the runtime store.
 */
export function updateRuntimeSupplierSideStatus(
  invoiceKey: string,
  update: Partial<SupplierSideStatusInfo>
) {
  const current = runtimeSupplierSideStatusMap.get(invoiceKey) || {}
  const merged = { ...current, ...update, lastSyncedAt: new Date().toISOString() }
  runtimeSupplierSideStatusMap.set(invoiceKey, merged)
  return merged
}

/**
 * Reset runtime store back to initial default values.
 */
export function resetRuntimeSupplierSideStatuses() {
  runtimeSupplierSideStatusMap.clear()
}
