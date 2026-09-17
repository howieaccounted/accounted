import type { Invoice, SupplierInvoice } from '@/types'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { getTenantCustomerInvoices, getTenantSupplierInvoices } from '@/lib/invoices/tenant-invoices'
import { roundOre } from '@/lib/money'

export interface BilateralCounterparty {
  id: string
  companyId: string
  name: string
  orgNumber: string
  email?: string
  bankgiro?: string
  isConnected: boolean
  networkConnectionDate: string
}

export interface NettedTransactionItem {
  id: string
  invoiceNumber: string
  type: 'receivable' | 'payable'
  accountNumber: string
  invoiceDate: string
  dueDate: string | null
  description: string
  amountSek: number
  status: string
}

export interface MonthlyNettingStatement {
  month: string
  activeCompanyId: string
  counterparty: BilateralCounterparty
  receivables: NettedTransactionItem[]
  payables: NettedTransactionItem[]
  totalReceivablesSek: number
  totalPayablesSek: number
  netAmountSek: number
  settlementDirection: 'pay' | 'receive' | 'balanced'
  settlementAmountSek: number
  settlementStatus: 'open' | 'settled'
  settledAt?: string | null
  settlementReference?: string | null
  settlementNotes?: string | null
}

// In-memory runtime settlement store
const runtimeSettlementMap = new Map<string, { settledAt: string; settlementReference: string; settlementNotes?: string }>()

export const CONNECTED_COUNTERPARTIES: Record<string, BilateralCounterparty[]> = {
  [TENANT_A_COMPANY_ID]: [
    {
      id: TENANT_B_COMPANY_ID,
      companyId: TENANT_B_COMPANY_ID,
      name: 'Nordic Logistics AB (Tenant B)',
      orgNumber: '556123-4567',
      email: 'ekonomi@nordiclogistics.se',
      bankgiro: '5123-4567',
      isConnected: true,
      networkConnectionDate: '2026-08-15',
    },
  ],
  [TENANT_B_COMPANY_ID]: [
    {
      id: TENANT_A_COMPANY_ID,
      companyId: TENANT_A_COMPANY_ID,
      name: 'Riminton AB (Company A)',
      orgNumber: '556000-0001',
      email: 'faktura@riminton.se',
      bankgiro: '5050-1055',
      isConnected: true,
      networkConnectionDate: '2026-08-15',
    },
  ],
}

/**
 * Get connected counterparties on the Accounted network for a given company.
 */
export function getConnectedCounterparties(activeCompanyId?: string | null): BilateralCounterparty[] {
  const cid = activeCompanyId || TENANT_A_COMPANY_ID
  if (CONNECTED_COUNTERPARTIES[cid]) {
    return CONNECTED_COUNTERPARTIES[cid]
  }
  // Default fallback for development/sandbox
  return CONNECTED_COUNTERPARTIES[TENANT_A_COMPANY_ID]
}

/**
 * Compute the monthly bilateral netting statement between two connected companies.
 */
export function computeMonthlyStatement(options: {
  activeCompanyId?: string | null
  counterpartyId?: string | null
  month?: string | null
  liveCustomerInvoices?: Invoice[]
  liveSupplierInvoices?: SupplierInvoice[]
}): MonthlyNettingStatement {
  const activeCid = options.activeCompanyId || TENANT_A_COMPANY_ID
  const counterparties = getConnectedCounterparties(activeCid)
  const counterparty =
    counterparties.find((c) => c.id === options.counterpartyId || c.companyId === options.counterpartyId) ||
    counterparties[0]

  const month = options.month || '2026-09'

  // Fetch or retrieve customer invoices (our receivables)
  let allCustomerInvoices: Invoice[] = []
  if (options.liveCustomerInvoices && options.liveCustomerInvoices.length > 0) {
    allCustomerInvoices = options.liveCustomerInvoices
  } else {
    allCustomerInvoices = getTenantCustomerInvoices(activeCid) as Invoice[]
    // In bilateral network, if activeCid is Tenant B and local customer invoices list is empty,
    // derive customer invoices from counterpart's supplier invoices!
    if (allCustomerInvoices.length === 0 && activeCid === TENANT_B_COMPANY_ID) {
      const counterpartSupplierInvoices = getTenantSupplierInvoices(counterparty.companyId || counterparty.id)
      allCustomerInvoices = counterpartSupplierInvoices
        .filter((si) =>
          si.supplier?.org_number === '556123-4567' ||
          si.supplier_id === TENANT_B_COMPANY_ID ||
          (si.supplier as { name?: string })?.name?.toLowerCase().includes('nordic logistics')
        )
        .map((si) => ({
          id: si.id,
          company_id: activeCid,
          customer_id: counterparty.id,
          invoice_number: si.supplier_invoice_number,
          invoice_date: si.invoice_date,
          due_date: si.due_date,
          total: si.total,
          total_sek: si.total_sek,
          notes: si.notes,
          status: si.status === 'paid' ? 'paid' : 'sent',
          customer: {
            id: counterparty.id,
            name: counterparty.name,
            org_number: counterparty.orgNumber,
            email: counterparty.email,
          },
        } as unknown as Invoice))
    }
  }

  // Fetch or retrieve supplier invoices (our payables)
  let allSupplierInvoices: SupplierInvoice[] = []
  if (options.liveSupplierInvoices && options.liveSupplierInvoices.length > 0) {
    allSupplierInvoices = options.liveSupplierInvoices
  } else {
    allSupplierInvoices = getTenantSupplierInvoices(activeCid) as SupplierInvoice[]
  }

  // Filter customer invoices belonging to counterparty and month
  const receivables: NettedTransactionItem[] = allCustomerInvoices
    .filter((inv) => {
      const isDateMatch = inv.invoice_date?.startsWith(month) || inv.due_date?.startsWith(month)
      if (!isDateMatch) return false

      const cust = inv.customer as { id?: string; name?: string; org_number?: string } | undefined
      const isCounterparty =
        cust?.id === counterparty.id ||
        cust?.id === counterparty.companyId ||
        cust?.org_number === counterparty.orgNumber ||
        cust?.name?.toLowerCase().includes(counterparty.name.toLowerCase().split(' ')[0])

      return Boolean(isCounterparty)
    })
    .map((inv) => {
      const num = inv.invoice_number || inv.id
      const gross = Number(inv.total_sek || inv.total || 0)
      return {
        id: inv.id,
        invoiceNumber: num,
        type: 'receivable',
        accountNumber: '1510 (Kundfordringar)',
        invoiceDate: inv.invoice_date,
        dueDate: inv.due_date || null,
        description: inv.notes || inv.your_reference || `Faktura ${num}`,
        amountSek: roundOre(gross),
        status: inv.status,
      }
    })

  // Filter supplier invoices belonging to counterparty and month
  const payables: NettedTransactionItem[] = allSupplierInvoices
    .filter((inv) => {
      const isDateMatch = inv.invoice_date?.startsWith(month) || inv.due_date?.startsWith(month)
      if (!isDateMatch) return false

      const supp = inv.supplier as { id?: string; name?: string; org_number?: string } | undefined
      const isCounterparty =
        supp?.id === counterparty.id ||
        supp?.id === counterparty.companyId ||
        supp?.org_number === counterparty.orgNumber ||
        supp?.name?.toLowerCase().includes(counterparty.name.toLowerCase().split(' ')[0])

      return Boolean(isCounterparty)
    })
    .map((inv) => {
      const num = inv.supplier_invoice_number || inv.id
      const gross = Number(inv.total_sek || inv.total || 0)
      return {
        id: inv.id,
        invoiceNumber: num,
        type: 'payable',
        accountNumber: '2440 (Leverantörsskulder)',
        invoiceDate: inv.invoice_date,
        dueDate: inv.due_date || null,
        description: inv.notes || `Leverantörsfaktura ${num}`,
        amountSek: roundOre(gross),
        status: inv.status,
      }
    })

  const totalReceivablesSek = roundOre(receivables.reduce((acc, item) => acc + item.amountSek, 0))
  const totalPayablesSek = roundOre(payables.reduce((acc, item) => acc + item.amountSek, 0))
  const netAmountSek = roundOre(totalReceivablesSek - totalPayablesSek)

  let settlementDirection: 'pay' | 'receive' | 'balanced' = 'balanced'
  if (netAmountSek < 0) {
    settlementDirection = 'pay'
  } else if (netAmountSek > 0) {
    settlementDirection = 'receive'
  }

  const settlementAmountSek = roundOre(Math.abs(netAmountSek))

  // Check runtime settlement store
  const settlementKey = `${activeCid}:${counterparty.id}:${month}`
  const runtimeSettlement = runtimeSettlementMap.get(settlementKey)

  return {
    month,
    activeCompanyId: activeCid,
    counterparty,
    receivables,
    payables,
    totalReceivablesSek,
    totalPayablesSek,
    netAmountSek,
    settlementDirection,
    settlementAmountSek,
    settlementStatus: runtimeSettlement ? 'settled' : 'open',
    settledAt: runtimeSettlement?.settledAt ?? null,
    settlementReference: runtimeSettlement?.settlementReference ?? null,
    settlementNotes: runtimeSettlement?.settlementNotes ?? null,
  }
}

/**
 * Mark a monthly statement as settled.
 */
export function settleStatement(
  activeCompanyId: string,
  counterpartyId: string,
  month: string,
  options?: { reference?: string; notes?: string }
): MonthlyNettingStatement {
  const settlementKey = `${activeCompanyId}:${counterpartyId}:${month}`
  const ref = options?.reference || `NET-${month.replace('-', '')}-${counterpartyId.slice(0, 4).toUpperCase()}`
  runtimeSettlementMap.set(settlementKey, {
    settledAt: new Date().toISOString(),
    settlementReference: ref,
    settlementNotes: options?.notes || 'Reglerad via Accounted bilateral kvittning',
  })

  return computeMonthlyStatement({
    activeCompanyId,
    counterpartyId,
    month,
  })
}

/**
 * Reset runtime store back to initial default values (for testing).
 */
export function resetRuntimeSettlements() {
  runtimeSettlementMap.clear()
}
