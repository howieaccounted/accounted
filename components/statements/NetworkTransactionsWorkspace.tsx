'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  Radio,
  Building2,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  CheckCircle2,
  ArrowRight,
  Info,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { HelpPopover } from '@/components/ui/help-popover'
import { useBilateralStatement } from '@/lib/hooks/use-bilateral-statement'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { InstantDrawdownDialog } from '@/components/statements/InstantDrawdownDialog'
import type { NettedTransactionItem } from '@/lib/statements/bilateral-netting'

interface NetworkTransactionsWorkspaceProps {
  initialCompanyId?: string | null
}

export function NetworkTransactionsWorkspace({ initialCompanyId }: NetworkTransactionsWorkspaceProps) {
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const t = useTranslations('statements')

  // Current active open billing cycle
  const currentMonth = '2026-09'

  const { statement, refreshStatement } = useBilateralStatement({
    initialCompanyId,
    initialMonth: currentMonth,
  })

  const [selectedDrawdownItem, setSelectedDrawdownItem] = useState<NettedTransactionItem | null>(null)
  const [drawdownDialogOpen, setDrawdownDialogOpen] = useState(false)

  const handleOpenDrawdown = (item: NettedTransactionItem) => {
    setSelectedDrawdownItem(item)
    setDrawdownDialogOpen(true)
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // Check if current month transactions have already been converted to a statement (locked or settled)
  const isConvertedToStatement = statement && (statement.isLocked || statement.settlementStatus === 'settled')

  return (
    <div className="space-y-6 print:p-0">
      {/* Page Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="page-header-title font-display text-2xl leading-8 tracking-tight">
              {t('transactions_title')}
            </h1>
            <HelpPopover>{t('transactions_help_body')}</HelpPopover>
          </div>
          <p className="text-sm text-muted-foreground">{t('transactions_subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-sm text-xs h-8 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{t('print_transactions')}</span>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-sm text-xs h-8 gap-1 text-primary hover:text-primary"
          >
            <Link href="/network/statements">
              <span>{t('view_previous_statements')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Control / Filter Bar: Month Selector is REMOVED per user requirement */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/30 rounded-lg border border-border/60">
        {/* Active Billing Cycle Display (No Month Dropdown) */}
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 text-primary/80" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              {t('current_billing_cycle')}:
            </span>
            <span className="text-xs font-mono font-medium text-foreground bg-background px-2.5 py-1 rounded-sm border border-border/80">
              {statement
                ? `${formatDate(statement.billingPeriodStart)} – ${formatDate(statement.billingPeriodEnd)}`
                : '2026-09-01 – 2026-09-30'}
            </span>
            <Badge variant="secondary" className="text-[11px] font-normal rounded-full px-2 py-0.5">
              September 2026
            </Badge>
          </div>
        </div>

        {/* Network Status Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-normal py-1 rounded-full text-[11px]"
          >
            <Radio className="h-3 w-3 text-emerald-500" />
            <span>
              {isEnglish ? 'Accounted Network Active' : 'Accounted Nätverksavräkning Aktiv'}
            </span>
          </Badge>
        </div>
      </div>

      {/* If current period has already been converted to a statement, show graceful conversion message */}
      {isConvertedToStatement ? (
        <Card className="border border-border/80 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-foreground">
              {t('no_open_transactions')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEnglish
                ? 'All netted transactions for September 2026 have been converted into a statement. You can review the finalized statement, payment records, and SIE4 vouchers in Statements.'
                : 'Alla nettade transaktioner för september 2026 har omvandlats till en avräkning. Du kan granska avräkningen, betalningen och SIE4-underlag under Avräkningar.'}
            </p>
          </div>
          <div className="pt-2">
            <Button asChild className="gap-2 rounded-sm text-xs font-medium">
              <Link href="/network/statements?month=2026-09">
                <span>{t('view_previous_statements')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Card>
      ) : statement ? (
        <>
          {/* Current Netted Running Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 rounded-lg border border-border/80 bg-card space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{t('receivables_total')}</span>
                </span>
                <Badge variant="secondary" className="text-[10px] font-normal rounded-full px-1.5 py-0">
                  {statement.receivables.length} {isEnglish ? 'invoices' : 'fakturor'}
                </Badge>
              </div>
              <p className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(statement.totalReceivablesSek, 'SEK')}
              </p>
            </Card>

            <Card className="p-4 rounded-lg border border-border/80 bg-card space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpRight className="h-3.5 w-3.5 text-rose-500" />
                  <span>{t('payables_total')}</span>
                </span>
                <Badge variant="secondary" className="text-[10px] font-normal rounded-full px-1.5 py-0">
                  {statement.payables.length} {isEnglish ? 'invoices' : 'fakturor'}
                </Badge>
              </div>
              <p className="text-2xl font-mono font-bold text-rose-600 dark:text-rose-400">
                −{formatCurrency(statement.totalPayablesSek, 'SEK')}
              </p>
            </Card>

            <Card
              className={cn(
                'p-4 rounded-lg border space-y-1 shadow-sm',
                statement.settlementDirection === 'pay'
                  ? 'border-rose-500/30 bg-rose-500/5'
                  : statement.settlementDirection === 'receive'
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-border/80 bg-card'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {isEnglish ? 'Balance' : 'Saldo'}
                </span>
                <Badge variant="outline" className="text-[10px] font-normal rounded-full border-muted-foreground/30">
                  {t('unfinalised_badge')}
                </Badge>
              </div>
              <div className="flex items-baseline justify-between">
                <p
                  className={cn(
                    'text-2xl font-mono font-bold tracking-tight',
                    statement.settlementDirection === 'pay'
                      ? 'text-rose-600 dark:text-rose-400'
                      : statement.settlementDirection === 'receive'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-foreground'
                  )}
                >
                  {statement.settlementDirection === 'pay'
                    ? formatCurrency(-statement.settlementAmountSek, 'SEK')
                    : formatCurrency(statement.settlementAmountSek, 'SEK')}
                </p>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {isEnglish ? '1st of month' : '1:a i månaden'}
                </span>
              </div>
            </Card>
          </div>

          {/* Informational notice that settlements unlock once statement is finalised */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/40 border border-border/70 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-primary/70" />
            <span>
              {t('finalisation_notice', {
                date: formatDate(statement.statementDate),
              })}
            </span>
          </div>

          {/* Netted Transactions Breakdown Tables */}
          <div className="space-y-6 pt-2">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                {t('netted_transactions_title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEnglish
                  ? 'All customer and supplier invoices accumulating towards your next monthly statement.'
                  : 'Alla kund- och leverantörsfakturor som ackumuleras inför nästa månadsavräkning.'}
              </p>
            </div>

            {/* Network Counterparties Breakdown */}
            {statement.isNetworkWide && statement.counterpartySummaries.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>{t('network_counterparties_title')}</span>
                  </h4>
                  <Badge variant="outline" className="text-xs font-normal rounded-full">
                    {statement.counterpartySummaries.length}{' '}
                    {isEnglish ? 'connected companies' : 'anslutna företag'}
                  </Badge>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-muted-foreground text-left">
                        <th className="py-2.5 px-3 font-medium">{t('th_counterparty')}</th>
                        <th className="py-2.5 px-3 font-medium text-right">
                          {t('th_receivables')} (1510)
                        </th>
                        <th className="py-2.5 px-3 font-medium text-right">
                          {t('th_payables')} (2440)
                        </th>
                        <th className="py-2.5 px-3 font-medium text-right">{t('th_net')}</th>
                        <th className="py-2.5 px-3 font-medium text-right hidden sm:table-cell">
                          {t('th_status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {statement.counterpartySummaries.map((summary) => (
                        <tr
                          key={summary.counterpartyId}
                          className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-medium text-foreground">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{summary.name}</span>
                              <span className="font-mono text-[11px] text-muted-foreground/80 hidden sm:inline">
                                ({summary.orgNumber})
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                            {summary.receivablesSek > 0
                              ? `+${formatCurrency(summary.receivablesSek, 'SEK')}`
                              : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-rose-600 dark:text-rose-400">
                            {summary.payablesSek > 0
                              ? `−${formatCurrency(summary.payablesSek, 'SEK')}`
                              : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">
                            <span
                              className={
                                summary.netSek > 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : summary.netSek < 0
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-muted-foreground'
                              }
                            >
                              {formatCurrency(summary.netSek, 'SEK')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right hidden sm:table-cell">
                            <Badge
                              variant="outline"
                              className="font-normal text-[10px] rounded-full border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            >
                              {isEnglish ? 'Connected' : 'Ansluten'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customer Invoices Section (Receivables) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                  <span>{t('customer_invoices_section')}</span>
                </h4>
                <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(statement.totalReceivablesSek || 0, 'SEK')}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-medium">{t('th_invoice_number')}</th>
                      <th className="py-2.5 px-3 font-medium">{t('th_counterparty')}</th>
                      <th className="py-2.5 px-3 font-medium">{t('th_date')}</th>
                      <th className="py-2.5 px-3 font-medium hidden sm:table-cell">{t('th_due_date')}</th>
                      <th className="py-2.5 px-3 font-medium">{t('th_description')}</th>
                      <th className="py-2.5 px-3 font-medium text-right">{t('th_amount')}</th>
                      <th className="py-2.5 px-3 font-medium text-right">{t('th_status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.receivables.length > 0 ? (
                      statement.receivables.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                            {item.invoiceNumber}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{item.counterpartyName}</td>
                          <td className="py-2.5 px-3 text-muted-foreground font-mono">
                            {formatDate(item.invoiceDate)}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground font-mono hidden sm:table-cell">
                            {item.dueDate ? formatDate(item.dueDate) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                            +{formatCurrency(item.amountSek, 'SEK')}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {item.drawdownStatus === 'drawn' ? (
                              <Badge
                                variant="outline"
                                className="font-normal text-[10px] rounded-full border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 gap-1 inline-flex items-center"
                              >
                                <CheckCircle2 className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                                <span>{isEnglish ? 'Drawn Down' : 'Förtida uttag'}</span>
                              </Badge>
                            ) : item.drawdownStatus === 'available' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Badge
                                  variant="outline"
                                  className="font-normal text-[10px] rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 gap-1 hidden sm:inline-flex items-center"
                                >
                                  <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>{isEnglish ? 'Verified' : 'Verifierad'}</span>
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenDrawdown(item)}
                                  className="h-6 px-2 text-[11px] gap-1 font-semibold rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                >
                                  <Zap className="h-3 w-3 fill-current" />
                                  <span>{isEnglish ? 'Draw down' : 'Ta ut'}</span>
                                </Button>
                              </div>
                            ) : (
                              <Badge variant="outline" className="font-normal text-[10px] rounded-full">
                                {item.status}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-xs text-muted-foreground">
                          {t('empty_desc')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supplier Invoices Section (Payables) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <ArrowUpRight className="h-4 w-4 text-rose-500" />
                  <span>{t('supplier_invoices_section')}</span>
                </h4>
                <span className="text-xs font-mono font-medium text-rose-600 dark:text-rose-400">
                  −{formatCurrency(statement.totalPayablesSek || 0, 'SEK')}
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-medium">{t('th_invoice_number')}</th>
                      <th className="py-2.5 px-3 font-medium">{t('th_counterparty')}</th>
                      <th className="py-2.5 px-3 font-medium">{t('th_date')}</th>
                      <th className="py-2.5 px-3 font-medium hidden sm:table-cell">{t('th_due_date')}</th>
                      <th className="py-2.5 px-3 font-medium">{t('th_description')}</th>
                      <th className="py-2.5 px-3 font-medium text-right">{t('th_amount')}</th>
                      <th className="py-2.5 px-3 font-medium text-right">{t('th_status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.payables.length > 0 ? (
                      statement.payables.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                            {item.invoiceNumber}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{item.counterpartyName}</td>
                          <td className="py-2.5 px-3 text-muted-foreground font-mono">
                            {formatDate(item.invoiceDate)}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground font-mono hidden sm:table-cell">
                            {item.dueDate ? formatDate(item.dueDate) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-rose-600 dark:text-rose-400">
                            −{formatCurrency(item.amountSek, 'SEK')}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <Badge variant="outline" className="font-normal text-[10px] rounded-full">
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-xs text-muted-foreground">
                          {t('empty_desc')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Instant Drawdown Action Dialog */}
      <InstantDrawdownDialog
        open={drawdownDialogOpen}
        onOpenChange={setDrawdownDialogOpen}
        item={selectedDrawdownItem}
        month={currentMonth}
        onSuccess={() => {
          refreshStatement()
        }}
      />
    </div>
  )
}
