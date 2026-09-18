import type { Invoice, SupplierInvoice } from '@/types'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { getTenantCustomerInvoices, getTenantSupplierInvoices } from '@/lib/invoices/tenant-invoices'
import { roundOre } from '@/lib/money'
import {
  type NettingAccountingVoucher,
  type NettingErpSyncResult,
  generateNettingVoucherTemplate,
} from '@/lib/statements/netting-erp-sync'
import {
  generatePaymentInstructions,
  type StatementPaymentInstructions,
} from '@/lib/statements/payment-instructions'

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

export interface CounterpartyNetSummary {
  counterpartyId: string
  companyId: string
  name: string
  orgNumber: string
  receivablesSek: number
  payablesSek: number
  netSek: number
  direction: 'pay' | 'receive' | 'balanced'
  invoiceCount: number
  supplierInvoiceCount: number
  bankgiro?: string
  isConnected: boolean
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
  counterpartyId?: string
  counterpartyName: string
  counterpartyOrgNumber?: string
}

export interface MonthlyNettingStatement {
  month: string
  activeCompanyId: string
  scope: string // 'all' for network-wide, or specific counterparty ID
  isNetworkWide: boolean
  counterparty: BilateralCounterparty | null
  counterpartySummaries: CounterpartyNetSummary[]
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
  // Option A (Credit Card / Network Billing Cycle) metadata
  selectionCriterion: 'issue_date'
  billingPeriodStart: string
  billingPeriodEnd: string
  statementDate: string
  statementDueDate: string
  // Monthly Freeze & Locking (Option A 1st of Month Cadence)
  isLocked: boolean
  lockedAt?: string | null
  lockReference?: string | null
  // Automated ERP / Bookkeeping Sync-Back
  accountingVoucher?: NettingAccountingVoucher | null
  erpSyncStatus?: NettingErpSyncResult | null
  // Low-cost B2B Settlement Rails (Bankgiro/OCR & Autogiro Direct Debit)
  paymentInstructions?: StatementPaymentInstructions | null
}

/**
 * Compute billing period, statement issue date (1st of next month),
 * and network due date (25th of next month) according to Option A.
 */
export function getStatementDates(month: string): {
  billingPeriodStart: string
  billingPeriodEnd: string
  statementDate: string
  statementDueDate: string
} {
  const parts = month.split('-')
  const year = parseInt(parts[0], 10) || 2026
  const m = parseInt(parts[1], 10) || 9
  const lastDay = new Date(year, m, 0).getDate()
  const billingPeriodStart = `${parts[0]}-${String(m).padStart(2, '0')}-01`
  const billingPeriodEnd = `${parts[0]}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  let nextYear = year
  let nextMonth = m + 1
  if (nextMonth > 12) {
    nextMonth = 1
    nextYear += 1
  }
  const nextMonthStr = String(nextMonth).padStart(2, '0')
  const statementDate = `${nextYear}-${nextMonthStr}-01`
  const statementDueDate = `${nextYear}-${nextMonthStr}-25`

  return {
    billingPeriodStart,
    billingPeriodEnd,
    statementDate,
    statementDueDate,
  }
}

// In-memory runtime settlement store
const runtimeSettlementMap = new Map<
  string,
  {
    settledAt: string
    settlementReference: string
    settlementNotes?: string
    accountingVoucher?: NettingAccountingVoucher
    erpSyncStatus?: NettingErpSyncResult
  }
>()

// In-memory runtime locked statements store
const lockedStatementsStore = new Map<string, MonthlyNettingStatement>()

export function getLockedStatement(
  companyId: string,
  scope: string = 'all',
  month: string
): MonthlyNettingStatement | null {
  const key = `${companyId}:${scope}:${month}`
  const existing = lockedStatementsStore.get(key)
  if (!existing) return null
  return JSON.parse(JSON.stringify(existing)) as MonthlyNettingStatement
}

export function saveLockedStatement(statement: MonthlyNettingStatement): void {
  const key = `${statement.activeCompanyId}:${statement.scope}:${statement.month}`
  lockedStatementsStore.set(key, JSON.parse(JSON.stringify(statement)))
}

export function resetLockedStatementsStore(): void {
  lockedStatementsStore.clear()
}

export const DEFAULT_CONNECTED_COUNTERPARTIES: Record<string, BilateralCounterparty[]> = {
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

export let CONNECTED_COUNTERPARTIES: Record<string, BilateralCounterparty[]> = JSON.parse(
  JSON.stringify(DEFAULT_CONNECTED_COUNTERPARTIES)
)

export function resetConnectedCounterparties(): void {
  CONNECTED_COUNTERPARTIES = JSON.parse(JSON.stringify(DEFAULT_CONNECTED_COUNTERPARTIES))
}

export function addConnectedCounterparty(
  companyId: string,
  counterparty: BilateralCounterparty
): void {
  if (!CONNECTED_COUNTERPARTIES[companyId]) {
    CONNECTED_COUNTERPARTIES[companyId] = []
  }
  const exists = CONNECTED_COUNTERPARTIES[companyId].some(
    (c) => c.id === counterparty.id || c.orgNumber === counterparty.orgNumber
  )
  if (!exists) {
    CONNECTED_COUNTERPARTIES[companyId].push(counterparty)
  }
}

/**
 * Get connected counterparties on the Accounted network for a given company.
 * Only companies where isConnected === true are returned.
 */
export function getConnectedCounterparties(activeCompanyId?: string | null): BilateralCounterparty[] {
  const cid = activeCompanyId || TENANT_A_COMPANY_ID
  const list = CONNECTED_COUNTERPARTIES[cid] || CONNECTED_COUNTERPARTIES[TENANT_A_COMPANY_ID] || []
  return list.filter((c) => c.isConnected)
}

function matchesCounterparty(
  party: { id?: string; name?: string; org_number?: string | null; email?: string | null } | undefined,
  cp: BilateralCounterparty
): boolean {
  if (!party) return false
  if (party.id && (party.id === cp.id || party.id === cp.companyId)) return true
  if (party.org_number && cp.orgNumber && party.org_number === cp.orgNumber) return true
  if (party.name && cp.name) {
    const pNorm = party.name.toLowerCase().replace(/\s+ab$/i, '').replace(/\(tenant [ab]\)/i, '').trim()
    const cpNorm = cp.name.toLowerCase().replace(/\s+ab$/i, '').replace(/\(tenant [ab]\)/i, '').trim()
    if (pNorm.length >= 4 && cpNorm.length >= 4 && (pNorm.includes(cpNorm) || cpNorm.includes(pNorm))) {
      return true
    }
  }
  return false
}

/**
 * Compute the monthly netting statement across all companies in the Accounted network
 * or for a specific counterparty if scoped.
 */
export function computeMonthlyStatement(options: {
  activeCompanyId?: string | null
  counterpartyId?: string | null // 'all' or empty means all network companies
  month?: string | null
  customCounterparties?: BilateralCounterparty[]
  liveCustomerInvoices?: Invoice[]
  liveSupplierInvoices?: SupplierInvoice[]
}): MonthlyNettingStatement {
  const activeCid = options.activeCompanyId || TENANT_A_COMPANY_ID
  const counterparties =
    options.customCounterparties && options.customCounterparties.length > 0
      ? options.customCounterparties.filter((c) => c.isConnected)
      : getConnectedCounterparties(activeCid)

  const rawScope = options.counterpartyId || 'all'
  const isNetworkWide = rawScope === 'all'

  const selectedCounterparty = isNetworkWide
    ? null
    : counterparties.find((c) => c.id === rawScope || c.companyId === rawScope) || null

  const targetCounterparties = isNetworkWide
    ? counterparties
    : selectedCounterparty
      ? [selectedCounterparty]
      : []

  const month = options.month || '2026-09'
  const statementDates = getStatementDates(month)

  // Check if an immutable locked snapshot exists for this company, scope, and month
  const lockedSnapshot = getLockedStatement(activeCid, rawScope, month)
  if (lockedSnapshot) {
    if (lockedSnapshot.settlementDirection === 'pay' && !lockedSnapshot.paymentInstructions) {
      lockedSnapshot.paymentInstructions = generatePaymentInstructions({
        companyId: activeCid,
        month,
        amountSek: lockedSnapshot.settlementAmountSek,
        dueDate: lockedSnapshot.statementDueDate,
        counterpartyBankgiro: selectedCounterparty?.bankgiro,
        counterpartyName: selectedCounterparty?.name,
        isNetworkWide,
      })
    }
    const settlementKey = `${activeCid}:${rawScope}:${month}`
    const runtimeSettlement = runtimeSettlementMap.get(settlementKey)
    if (runtimeSettlement) {
      lockedSnapshot.settlementStatus = 'settled'
      lockedSnapshot.settledAt = runtimeSettlement.settledAt
      lockedSnapshot.settlementReference = runtimeSettlement.settlementReference
      lockedSnapshot.settlementNotes = runtimeSettlement.settlementNotes
      if (runtimeSettlement.accountingVoucher) {
        lockedSnapshot.accountingVoucher = runtimeSettlement.accountingVoucher
        lockedSnapshot.erpSyncStatus = runtimeSettlement.erpSyncStatus || null
      }
    }
    return lockedSnapshot
  }

  // Fetch or retrieve customer invoices (our receivables)
  let allCustomerInvoices: Invoice[] = []
  if (options.liveCustomerInvoices && options.liveCustomerInvoices.length > 0) {
    allCustomerInvoices = options.liveCustomerInvoices
  } else {
    allCustomerInvoices = getTenantCustomerInvoices(activeCid) as Invoice[]
    // In bilateral network, if activeCid is Tenant B and local customer invoices list is empty,
    // derive customer invoices from counterpart's supplier invoices
    if (allCustomerInvoices.length === 0 && activeCid === TENANT_B_COMPANY_ID) {
      const counterpartSupplierInvoices = getTenantSupplierInvoices(TENANT_A_COMPANY_ID)
      allCustomerInvoices = counterpartSupplierInvoices
        .filter((si) =>
          si.supplier?.org_number === '556123-4567' ||
          si.supplier_id === TENANT_B_COMPANY_ID ||
          (si.supplier as { name?: string })?.name?.toLowerCase().includes('nordic logistics')
        )
        .map((si) => ({
          id: si.id,
          company_id: activeCid,
          customer_id: TENANT_A_COMPANY_ID,
          invoice_number: si.supplier_invoice_number,
          invoice_date: si.invoice_date,
          due_date: si.due_date,
          total: si.total,
          total_sek: si.total_sek,
          notes: si.notes,
          status: si.status === 'paid' ? 'paid' : 'sent',
          customer: {
            id: TENANT_A_COMPANY_ID,
            name: 'Riminton AB (Company A)',
            org_number: '556000-0001',
            email: 'faktura@riminton.se',
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
    if (allSupplierInvoices.length === 0 && activeCid === TENANT_B_COMPANY_ID) {
      const counterpartCustInvoices = getTenantCustomerInvoices(TENANT_A_COMPANY_ID)
      allSupplierInvoices = counterpartCustInvoices
        .filter((ci) =>
          ci.customer?.org_number === '556123-4567' ||
          ci.customer_id === TENANT_B_COMPANY_ID ||
          (ci.customer as { name?: string })?.name?.toLowerCase().includes('nordic logistics')
        )
        .map((ci) => ({
          id: ci.id,
          company_id: activeCid,
          supplier_id: TENANT_A_COMPANY_ID,
          supplier_invoice_number: ci.invoice_number,
          invoice_date: ci.invoice_date,
          due_date: ci.due_date,
          total: ci.total,
          total_sek: ci.total_sek,
          notes: ci.notes,
          status: ci.status === 'paid' ? 'paid' : 'approved',
          supplier: {
            id: TENANT_A_COMPANY_ID,
            name: 'Riminton AB (Company A)',
            org_number: '556000-0001',
            email: 'faktura@riminton.se',
          },
        } as unknown as SupplierInvoice))
    }
  }

  // Filter customer invoices belonging to target counterparties and month
  // Option A (Credit Card Billing Cycle): strictly select by Issue Date (invoice_date) within the calendar month
  const receivables: NettedTransactionItem[] = []
  for (const inv of allCustomerInvoices) {
    const issueDate = inv.invoice_date || (inv.created_at ? inv.created_at.slice(0, 10) : null)
    const isDateMatch = Boolean(issueDate && issueDate.startsWith(month))
    if (!isDateMatch) continue

    const cust = inv.customer as { id?: string; name?: string; org_number?: string } | undefined
    const matchedCp = targetCounterparties.find((cp) => cp.isConnected && matchesCounterparty(cust, cp))
    if (!matchedCp) continue

    const num = inv.invoice_number || inv.id
    const gross = Number(inv.total_sek || inv.total || 0)
    receivables.push({
      id: inv.id,
      invoiceNumber: num,
      type: 'receivable',
      accountNumber: '1510 (Kundfordringar)',
      invoiceDate: inv.invoice_date,
      dueDate: inv.due_date || null,
      description: inv.notes || inv.your_reference || `Faktura ${num}`,
      amountSek: roundOre(gross),
      status: inv.status,
      counterpartyId: matchedCp.id,
      counterpartyName: matchedCp.name,
      counterpartyOrgNumber: matchedCp.orgNumber,
    })
  }

  // Filter supplier invoices belonging to target counterparties and month
  // Option A (Credit Card Billing Cycle): strictly select by Issue Date (invoice_date) within the calendar month
  const payables: NettedTransactionItem[] = []
  for (const inv of allSupplierInvoices) {
    const issueDate = inv.invoice_date || (inv.created_at ? inv.created_at.slice(0, 10) : null)
    const isDateMatch = Boolean(issueDate && issueDate.startsWith(month))
    if (!isDateMatch) continue

    const supp = inv.supplier as { id?: string; name?: string; org_number?: string } | undefined
    const matchedCp = targetCounterparties.find((cp) => cp.isConnected && matchesCounterparty(supp, cp))
    if (!matchedCp) continue

    const num = inv.supplier_invoice_number || inv.id
    const gross = Number(inv.total_sek || inv.total || 0)
    payables.push({
      id: inv.id,
      invoiceNumber: num,
      type: 'payable',
      accountNumber: '2440 (Leverantörsskulder)',
      invoiceDate: inv.invoice_date,
      dueDate: inv.due_date || null,
      description: inv.notes || `Leverantörsfaktura ${num}`,
      amountSek: roundOre(gross),
      status: inv.status,
      counterpartyId: matchedCp.id,
      counterpartyName: matchedCp.name,
      counterpartyOrgNumber: matchedCp.orgNumber,
    })
  }

  // Calculate per-counterparty summaries for all relevant counterparties
  const counterpartySummaries: CounterpartyNetSummary[] = counterparties
    .filter((cp) => cp.isConnected)
    .map((cp) => {
      const cpReceivables = receivables.filter((r) => r.counterpartyId === cp.id || matchesCounterparty({ name: r.counterpartyName, org_number: r.counterpartyOrgNumber }, cp))
      const cpPayables = payables.filter((p) => p.counterpartyId === cp.id || matchesCounterparty({ name: p.counterpartyName, org_number: p.counterpartyOrgNumber }, cp))

      const recSek = roundOre(cpReceivables.reduce((sum, item) => sum + item.amountSek, 0))
      const paySek = roundOre(cpPayables.reduce((sum, item) => sum + item.amountSek, 0))
      const net = roundOre(recSek - paySek)

      let dir: 'pay' | 'receive' | 'balanced' = 'balanced'
      if (net < 0) dir = 'pay'
      else if (net > 0) dir = 'receive'

      return {
        counterpartyId: cp.id,
        companyId: cp.companyId,
        name: cp.name,
        orgNumber: cp.orgNumber,
        receivablesSek: recSek,
        payablesSek: paySek,
        netSek: net,
        direction: dir,
        invoiceCount: cpReceivables.length,
        supplierInvoiceCount: cpPayables.length,
        bankgiro: cp.bankgiro,
        isConnected: cp.isConnected,
      }
    })
    .filter((summary) => isNetworkWide ? (summary.invoiceCount > 0 || summary.supplierInvoiceCount > 0) : summary.counterpartyId === selectedCounterparty?.id)

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
  const settlementKey = `${activeCid}:${rawScope}:${month}`
  const runtimeSettlement = runtimeSettlementMap.get(settlementKey)

  const statement: MonthlyNettingStatement = {
    month,
    activeCompanyId: activeCid,
    scope: rawScope,
    isNetworkWide,
    counterparty: selectedCounterparty,
    counterpartySummaries,
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
    selectionCriterion: 'issue_date',
    billingPeriodStart: statementDates.billingPeriodStart,
    billingPeriodEnd: statementDates.billingPeriodEnd,
    statementDate: statementDates.statementDate,
    statementDueDate: statementDates.statementDueDate,
    isLocked: false,
    lockedAt: null,
    lockReference: null,
  }

  // Attach ERP sync voucher: either from runtime settlement or generated template
  if (runtimeSettlement?.accountingVoucher) {
    statement.accountingVoucher = runtimeSettlement.accountingVoucher
    statement.erpSyncStatus = runtimeSettlement.erpSyncStatus || null
  } else {
    // Generate draft template so open statements can preview the exact double-entry booking
    statement.accountingVoucher = generateNettingVoucherTemplate(statement)
    statement.erpSyncStatus = null
  }

  // Attach low-cost B2B settlement instructions (Bankgiro / OCR / Autogiro)
  if (statement.settlementDirection === 'pay' && statement.settlementAmountSek > 0) {
    statement.paymentInstructions = generatePaymentInstructions({
      companyId: activeCid,
      month,
      amountSek: statement.settlementAmountSek,
      dueDate: statement.statementDueDate,
      counterpartyBankgiro: selectedCounterparty?.bankgiro,
      counterpartyName: selectedCounterparty?.name,
      isNetworkWide,
    })
  } else {
    statement.paymentInstructions = null
  }

  return statement
}

/**
 * Mark a monthly statement as settled and automatically produce the balancing accounting voucher.
 */
export function settleStatement(
  activeCompanyId: string,
  counterpartyId: string, // 'all' or specific ID
  month: string,
  options?: { reference?: string; notes?: string }
): MonthlyNettingStatement {
  const targetId = counterpartyId || 'all'
  const settlementKey = `${activeCompanyId}:${targetId}:${month}`
  const ref =
    options?.reference ||
    (targetId === 'all'
      ? `NET-${month.replace('-', '')}-NETWORK`
      : `NET-${month.replace('-', '')}-${targetId.slice(0, 4).toUpperCase()}`)

  const settledAt = new Date().toISOString()
  const notes =
    options?.notes ||
    (targetId === 'all'
      ? 'Reglerad via Accounted multilateral nätverksavräkning'
      : 'Reglerad via Accounted bilateral kvittning')

  // Temporary pre-computation to generate the voucher
  const interim = computeMonthlyStatement({
    activeCompanyId,
    counterpartyId: targetId,
    month,
  })
  interim.settlementStatus = 'settled'
  interim.settledAt = settledAt
  interim.settlementReference = ref
  interim.settlementNotes = notes

  const voucher = generateNettingVoucherTemplate(interim)
  const erpSyncStatus: NettingErpSyncResult = {
    status: 'completed',
    voucher,
    invoicesClearedCount: interim.receivables.length,
    supplierInvoicesClearedCount: interim.payables.length,
    journalEntryId: null,
    syncedAt: settledAt,
  }

  runtimeSettlementMap.set(settlementKey, {
    settledAt,
    settlementReference: ref,
    settlementNotes: notes,
    accountingVoucher: voucher,
    erpSyncStatus,
  })

  return computeMonthlyStatement({
    activeCompanyId,
    counterpartyId: targetId,
    month,
  })
}

/**
 * Reset runtime store back to initial default values (for testing).
 */
export function resetRuntimeSettlements() {
  runtimeSettlementMap.clear()
  resetLockedStatementsStore()
}
