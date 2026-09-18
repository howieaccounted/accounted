import {
  type MonthlyNettingStatement,
  computeMonthlyStatement,
  saveLockedStatement,
  getLockedStatement,
  getStatementDates,
  type NettedTransactionItem,
} from '@/lib/statements/bilateral-netting'
import { TENANT_A_COMPANY_ID, TENANT_B_COMPANY_ID } from '@/lib/company/active-company'
import { generatePaymentInstructions } from '@/lib/statements/payment-instructions'

/**
 * Seed historical closed and settled statements for previous months (e.g. 2026-08, 2026-07).
 */
export function createHistoricalStatement(options: {
  month: string
  companyId: string
  settlementStatus?: 'settled' | 'open'
  isLocked?: boolean
  settledAt?: string
  lockReference?: string
  receivables: NettedTransactionItem[]
  payables: NettedTransactionItem[]
}): MonthlyNettingStatement {
  const { month, companyId, receivables, payables } = options
  const dates = getStatementDates(month)
  const isTenantA = companyId === TENANT_A_COMPANY_ID

  const counterpartyName = isTenantA ? 'Nordic Logistics AB (Tenant B)' : 'Riminton AB (Company A)'
  const counterpartyOrg = isTenantA ? '556123-4567' : '556000-0001'
  const counterpartyId = isTenantA ? TENANT_B_COMPANY_ID : TENANT_A_COMPANY_ID

  const totalRec = receivables.reduce((sum, r) => sum + r.amountSek, 0)
  const totalPay = payables.reduce((sum, p) => sum + p.amountSek, 0)
  const net = totalRec - totalPay
  const dir = net < 0 ? 'pay' : net > 0 ? 'receive' : 'balanced'
  const amountSek = Math.abs(net)

  const monthNum = month.replace('-', '')
  const ref = `NET-${monthNum}-NETWORK`
  const isSettled = options.settlementStatus !== 'open'

  const voucherLines =
    dir === 'pay'
      ? [
          {
            accountNumber: '2440',
            accountName: 'Leverantörsskulder',
            debitSek: totalPay,
            creditSek: 0,
            description: `Avräkning ${ref} - Nettade leverantörsskulder`,
          },
          {
            accountNumber: '1510',
            accountName: 'Kundfordringar',
            debitSek: 0,
            creditSek: totalRec,
            description: `Avräkning ${ref} - Nettade kundfordringar`,
          },
          {
            accountNumber: '1930',
            accountName: 'Företagskonto / Checkkonto',
            debitSek: 0,
            creditSek: amountSek,
            description: `Avräkning ${ref} - Nettolikvid till Accounted Network`,
          },
        ]
      : dir === 'receive'
      ? [
          {
            accountNumber: '2440',
            accountName: 'Leverantörsskulder',
            debitSek: totalPay,
            creditSek: 0,
            description: `Avräkning ${ref} - Nettade leverantörsskulder`,
          },
          {
            accountNumber: '1930',
            accountName: 'Företagskonto / Checkkonto',
            debitSek: amountSek,
            creditSek: 0,
            description: `Avräkning ${ref} - Nettolikvid från Accounted Network`,
          },
          {
            accountNumber: '1510',
            accountName: 'Kundfordringar',
            debitSek: 0,
            creditSek: totalRec,
            description: `Avräkning ${ref} - Nettade kundfordringar`,
          },
        ]
      : [
          {
            accountNumber: '2440',
            accountName: 'Leverantörsskulder',
            debitSek: totalPay,
            creditSek: 0,
            description: `Avräkning ${ref} - Balanserade leverantörsskulder`,
          },
          {
            accountNumber: '1510',
            accountName: 'Kundfordringar',
            debitSek: 0,
            creditSek: totalRec,
            description: `Avräkning ${ref} - Balanserade kundfordringar`,
          },
        ]

  const paymentInstructions =
    dir === 'pay'
      ? generatePaymentInstructions({
          companyId,
          month,
          amountSek,
          dueDate: dates.statementDueDate,
          counterpartyBankgiro: '5050-1055',
          counterpartyName: 'Accounted Network Clearing',
          isNetworkWide: true,
        })
      : null

  const statement: MonthlyNettingStatement = {
    month,
    activeCompanyId: companyId,
    scope: 'all',
    isNetworkWide: true,
    counterparty: null,
    counterpartySummaries: [
      {
        counterpartyId,
        companyId: counterpartyId,
        name: counterpartyName,
        orgNumber: counterpartyOrg,
        receivablesSek: totalRec,
        payablesSek: totalPay,
        netSek: net,
        direction: dir,
        invoiceCount: receivables.length,
        supplierInvoiceCount: payables.length,
        bankgiro: isTenantA ? '5123-4567' : '5050-1055',
        isConnected: true,
      },
    ],
    receivables,
    payables,
    totalReceivablesSek: totalRec,
    totalPayablesSek: totalPay,
    netAmountSek: net,
    settlementDirection: dir,
    settlementAmountSek: amountSek,
    settlementStatus: isSettled ? 'settled' : 'open',
    settledAt: isSettled ? options.settledAt || `${dates.statementDueDate}T10:00:00.000Z` : null,
    settlementReference: ref,
    settlementNotes: `Månadsavräkning för ${month} genomförd via Accounted Network.`,
    selectionCriterion: 'issue_date',
    billingPeriodStart: dates.billingPeriodStart,
    billingPeriodEnd: dates.billingPeriodEnd,
    statementDate: dates.statementDate,
    statementDueDate: dates.statementDueDate,
    isLocked: options.isLocked !== undefined ? options.isLocked : true,
    lockedAt: options.isLocked !== false ? `${dates.statementDate}T00:00:00.000Z` : null,
    lockReference: options.lockReference || `LOCK-${monthNum}-AUTO`,
    accountingVoucher: {
      series: 'A',
      voucherNumber: parseInt(monthNum.slice(2), 10),
      voucherDate: dates.statementDueDate,
      description: `Månadsavräkning ${month} - Accounted Network`,
      lines: voucherLines,
      totalDebitSek: voucherLines.reduce((s, l) => s + l.debitSek, 0),
      totalCreditSek: voucherLines.reduce((s, l) => s + l.creditSek, 0),
      isBalanced: true,
    },
    erpSyncStatus: {
      voucherId: `vch-${monthNum}-netting`,
      series: 'A',
      voucherNumber: parseInt(monthNum.slice(2), 10),
      postedAt: isSettled ? options.settledAt || `${dates.statementDueDate}T10:00:00.000Z` : '',
      invoicesUpdatedCount: receivables.length + payables.length,
      syncedToErp: true,
    },
    paymentInstructions,
  }

  return statement
}

/**
 * Built-in historical statements for past months.
 */
function getSeededHistoricalStatements(companyId: string): MonthlyNettingStatement[] {
  const isTenantA = companyId === TENANT_A_COMPANY_ID
  const cpName = isTenantA ? 'Nordic Logistics AB (Tenant B)' : 'Riminton AB (Company A)'
  const cpOrg = isTenantA ? '556123-4567' : '556000-0001'
  const cpId = isTenantA ? TENANT_B_COMPANY_ID : TENANT_A_COMPANY_ID

  // August 2026 (2026-08) - Settled
  const stmtAugust = createHistoricalStatement({
    month: '2026-08',
    companyId,
    settlementStatus: 'settled',
    isLocked: true,
    settledAt: '2026-09-24T09:30:00.000Z',
    lockReference: 'LOCK-202608-A9B1',
    receivables: [
      {
        id: 'rec-202608-01',
        invoiceNumber: '1002',
        type: 'receivable',
        accountNumber: '1510 (Kundfordringar)',
        invoiceDate: '2026-08-05',
        dueDate: '2026-09-05',
        description: 'Transport & Logistikoptimering augusti',
        amountSek: 25000,
        status: 'paid',
        counterpartyId: cpId,
        counterpartyName: cpName,
        counterpartyOrgNumber: cpOrg,
      },
      {
        id: 'rec-202608-02',
        invoiceNumber: '1003',
        type: 'receivable',
        accountNumber: '1510 (Kundfordringar)',
        invoiceDate: '2026-08-18',
        dueDate: '2026-09-18',
        description: 'Lagerhantering & distribution',
        amountSek: 15000,
        status: 'paid',
        counterpartyId: cpId,
        counterpartyName: cpName,
        counterpartyOrgNumber: cpOrg,
      },
    ],
    payables: [
      {
        id: 'pay-202608-01',
        invoiceNumber: 'SUP-801',
        type: 'payable',
        accountNumber: '2440 (Leverantörsskulder)',
        invoiceDate: '2026-08-10',
        dueDate: '2026-09-10',
        description: 'Ekonomikonsultation & Systemintegration',
        amountSek: 28000,
        status: 'paid',
        counterpartyId: cpId,
        counterpartyName: cpName,
        counterpartyOrgNumber: cpOrg,
      },
    ],
  })

  // July 2026 (2026-07) - Settled
  const stmtJuly = createHistoricalStatement({
    month: '2026-07',
    companyId,
    settlementStatus: 'settled',
    isLocked: true,
    settledAt: '2026-08-23T14:15:00.000Z',
    lockReference: 'LOCK-202607-C4F8',
    receivables: [
      {
        id: 'rec-202607-01',
        invoiceNumber: '1001',
        type: 'receivable',
        accountNumber: '1510 (Kundfordringar)',
        invoiceDate: '2026-07-08',
        dueDate: '2026-08-08',
        description: 'Inledande logistikanalys juli',
        amountSek: 18000,
        status: 'paid',
        counterpartyId: cpId,
        counterpartyName: cpName,
        counterpartyOrgNumber: cpOrg,
      },
    ],
    payables: [
      {
        id: 'pay-202607-01',
        invoiceNumber: 'SUP-701',
        type: 'payable',
        accountNumber: '2440 (Leverantörsskulder)',
        invoiceDate: '2026-07-15',
        dueDate: '2026-08-15',
        description: 'Molninfrastruktur och drift juli',
        amountSek: 24500,
        status: 'paid',
        counterpartyId: cpId,
        counterpartyName: cpName,
        counterpartyOrgNumber: cpOrg,
      },
    ],
  })

  return [stmtAugust, stmtJuly]
}

// Ensure seeded historical statements are registered in the locked statements store
let isSeeded = false
export function ensureHistoricalStatementsSeeded(companyId: string = TENANT_A_COMPANY_ID): void {
  const seeded = getSeededHistoricalStatements(companyId)
  for (const s of seeded) {
    if (!getLockedStatement(companyId, 'all', s.month)) {
      saveLockedStatement(s)
    }
  }
  isSeeded = true
}

/**
 * Retrieve all previous statements for a company, sorted newest first.
 * Includes past months (August 2026, July 2026) plus any runtime locked or settled statements.
 */
export function getPreviousStatements(options?: {
  companyId?: string | null
}): MonthlyNettingStatement[] {
  const cid = options?.companyId || TENANT_A_COMPANY_ID
  ensureHistoricalStatementsSeeded(cid)

  const pastMonths = ['2026-08', '2026-07']
  const statements: MonthlyNettingStatement[] = []

  // Check if current month (2026-09) has been locked or settled at runtime
  const currentMonthStmt = computeMonthlyStatement({
    activeCompanyId: cid,
    month: '2026-09',
    counterpartyId: 'all',
  })
  if (currentMonthStmt.isLocked || currentMonthStmt.settlementStatus === 'settled') {
    statements.push(currentMonthStmt)
  }

  // Add past closed months
  for (const m of pastMonths) {
    const s = computeMonthlyStatement({
      activeCompanyId: cid,
      month: m,
      counterpartyId: 'all',
    })
    statements.push(s)
  }

  // Sort newest first
  return statements.sort((a, b) => b.month.localeCompare(a.month))
}

/**
 * Retrieve live netted transactions for the current open billing period
 * that have NOT yet been turned into a statement.
 */
export function getOpenNettedTransactions(options?: {
  companyId?: string | null
  currentMonth?: string
}): {
  hasOpenTransactions: boolean
  currentMonth: string
  statement: MonthlyNettingStatement | null
  allConvertedMessage?: string
} {
  const cid = options?.companyId || TENANT_A_COMPANY_ID
  const currentMonth = options?.currentMonth || '2026-09'

  ensureHistoricalStatementsSeeded(cid)

  const statement = computeMonthlyStatement({
    activeCompanyId: cid,
    month: currentMonth,
    counterpartyId: 'all',
  })

  // If already locked or settled, it has already been turned into a statement
  if (statement.isLocked || statement.settlementStatus === 'settled') {
    return {
      hasOpenTransactions: false,
      currentMonth,
      statement: null,
      allConvertedMessage:
        'All transactions for this billing period have been converted into a statement.',
    }
  }

  // Open transactions accumulating towards the next statement
  return {
    hasOpenTransactions: statement.receivables.length > 0 || statement.payables.length > 0,
    currentMonth,
    statement,
  }
}
