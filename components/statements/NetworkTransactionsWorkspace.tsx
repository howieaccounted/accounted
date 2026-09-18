'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Radio,
  Building2,
  Calendar,
  FileText,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  CreditCard,
  Download,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { HelpPopover } from '@/components/ui/help-popover'
import { useToast } from '@/components/ui/use-toast'
import { useBilateralStatement } from '@/lib/hooks/use-bilateral-statement'
import { BankgiroPaymentInstructions } from '@/components/statements/BankgiroPaymentInstructions'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

interface NetworkTransactionsWorkspaceProps {
  initialCompanyId?: string | null
}

export function NetworkTransactionsWorkspace({ initialCompanyId }: NetworkTransactionsWorkspaceProps) {
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const t = useTranslations('statements')
  const { toast } = useToast()

  const searchParams = useSearchParams()
  const hasHandledParams = useRef(false)

  // Current active open billing cycle
  const currentMonth = '2026-09'

  const {
    statement,
    selectedCounterpartyId,
    settleStatementAction,
    refreshStatement,
  } = useBilateralStatement({
    initialCompanyId,
    initialMonth: currentMonth,
  })

  const [isSettling, setIsSettling] = useState(false)
  const [showVoucherPreview, setShowVoucherPreview] = useState(false)

  // Handle return from Stripe checkout
  useEffect(() => {
    if (hasHandledParams.current) return
    const settled = searchParams.get('settled') === 'true'
    const canceled = searchParams.get('canceled') === 'true'

    if (settled) {
      hasHandledParams.current = true
      const ref = `NET-${currentMonth.replace('-', '')}-NETWORK`
      settleStatementAction({ reference: ref })
      toast({
        title: t('stripe_payment_title'),
        description: t('stripe_success_toast'),
      })
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', window.location.pathname)
      }
    } else if (canceled) {
      hasHandledParams.current = true
      toast({
        title: t('stripe_payment_title'),
        description: t('stripe_cancel_toast'),
        variant: 'destructive',
      })
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [searchParams, settleStatementAction, t, toast])

  const handleCardCheckout = async () => {
    if (!statement || statement.settlementStatus === 'settled') return
    setIsSettling(true)
    const ref = statement.isNetworkWide
      ? `NET-${currentMonth.replace('-', '')}-NETWORK`
      : `NET-${currentMonth.replace('-', '')}-${(statement.counterparty?.name || 'CO').slice(0, 2).toUpperCase()}`

    try {
      const res = await fetch('/api/statements/bilateral/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          counterpartyId: selectedCounterpartyId,
          amountSek: statement.settlementAmountSek,
          reference: ref,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: unknown }
      if (data?.url) {
        window.location.href = data.url
        return
      }
    } catch {
      // fallback
    } finally {
      setIsSettling(false)
    }
  }

  const handleSettle = async () => {
    if (!statement || statement.settlementStatus === 'settled') return
    setIsSettling(true)
    const ref = statement.isNetworkWide
      ? `NET-${currentMonth.replace('-', '')}-NETWORK`
      : `NET-${currentMonth.replace('-', '')}-${(statement.counterparty?.name || 'CO').slice(0, 2).toUpperCase()}`

    try {
      await settleStatementAction({ reference: ref })
      toast({
        title: t('settlement_success_title'),
        description: t('settlement_success_desc', {
          ref,
          count: statement.receivables.length + statement.payables.length,
        }),
      })
      refreshStatement()
    } catch {
      // fallback
    } finally {
      setIsSettling(false)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // Check if current month transactions have already been converted to a statement (locked or settled)
  const isConvertedToStatement = statement && (statement.isLocked || statement.settlementStatus === 'settled')

  return (
    <div className="space-y-8 print:p-0">
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
            variant="ghost"
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
              {isEnglish ? 'September 2026' : 'September 2026'}
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
          {/* Hero Settlement Card */}
          <Card
            className={`border ${
              statement.settlementStatus === 'settled'
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : statement.settlementDirection === 'pay'
                ? 'border-rose-500/30 bg-rose-500/5'
                : statement.settlementDirection === 'receive'
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-border bg-card'
            } rounded-lg shadow-sm overflow-hidden`}
          >
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {statement.settlementDirection === 'pay'
                        ? t('net_to_pay_title')
                        : statement.settlementDirection === 'receive'
                        ? t('net_to_receive_title')
                        : t('net_balanced_title')}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 text-amber-700 dark:text-amber-400 font-normal text-[11px] gap-1 rounded-full"
                    >
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span>{t('open_transactions_badge')}</span>
                    </Badge>

                    {statement.settlementDirection === 'pay' &&
                      statement.paymentInstructions?.autogiro?.isMandateActive && (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-normal text-[11px] gap-1 rounded-full"
                          title={t('autogiro_active_badge')}
                        >
                          <RefreshCw className="h-3 w-3 text-emerald-500" />
                          <span>{t('tab_autogiro')}</span>
                        </Badge>
                      )}
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span
                      className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight ${
                        statement.settlementDirection === 'pay'
                          ? 'text-rose-600 dark:text-rose-400'
                          : statement.settlementDirection === 'receive'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-foreground'
                      }`}
                    >
                      {formatCurrency(statement.settlementAmountSek, 'SEK')}
                    </span>
                  </div>
                </div>

                {/* Settlement Action Button (Early settlement option) */}
                <div className="flex flex-col items-start md:items-end gap-2 shrink-0 print:hidden">
                  <Button
                    size="lg"
                    onClick={handleSettle}
                    disabled={isSettling}
                    className={cn(
                      'rounded-sm font-medium gap-2 shadow-sm',
                      statement.settlementDirection === 'pay'
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : statement.settlementDirection === 'receive'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : ''
                    )}
                  >
                    {isSettling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>
                          {statement.settlementDirection === 'pay'
                            ? t('stripe_redirecting')
                            : t('settling')}
                        </span>
                      </>
                    ) : statement.settlementDirection === 'pay' ? (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>{t('action_make_payment')}</span>
                      </>
                    ) : statement.settlementDirection === 'receive' ? (
                      <>
                        <Download className="h-4 w-4" />
                        <span>{t('action_drawdown')}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{t('action_balance')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* The 3 Essential Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-border/60">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    <span>{t('period_covered')}</span>
                  </span>
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {formatDate(statement.billingPeriodStart)} – {formatDate(statement.billingPeriodEnd)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="h-3.5 w-3.5 text-primary/70" />
                    <span>{t('statement_creation_date')}</span>
                  </span>
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {formatDate(statement.statementDate)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>{t('due_date')}</span>
                  </span>
                  <p className="text-sm font-semibold font-mono text-amber-700 dark:text-amber-400">
                    {formatDate(statement.statementDueDate)}
                  </p>
                </div>
              </div>

              {/* Freezing / Locking Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-dashed border-border/80 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                <span>
                  {t('transactions_freeze_notice', {
                    date: formatDate(statement.statementDate),
                  })}
                </span>
              </div>

              {/* Automated Accounting Notice & Preview */}
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/25 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-semibold text-xs text-blue-900 dark:text-blue-200">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{t('erp_sync_notice_title')}</span>
                  </div>

                  {statement.accountingVoucher && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowVoucherPreview((prev) => !prev)}
                      className="h-7 text-[11px] font-medium px-2.5 gap-1 text-blue-700 dark:text-blue-300 hover:bg-blue-500/15"
                    >
                      <span>
                        {showVoucherPreview ? t('hide_voucher_preview') : t('preview_voucher_toggle')}
                      </span>
                      {showVoucherPreview ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-[11px] text-blue-800/90 dark:text-blue-300/90 leading-relaxed">
                  {t('erp_sync_notice_desc')}
                </p>

                {showVoucherPreview && statement.accountingVoucher && (
                  <div className="pt-2 border-t border-blue-500/20 space-y-2">
                    <span className="text-[11px] font-medium text-blue-900 dark:text-blue-200 block">
                      {t('voucher_lines_heading')}
                    </span>
                    <div className="overflow-x-auto rounded-sm border border-border/80 bg-background/90">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/60 bg-muted/40 text-[10px] uppercase text-muted-foreground">
                            <th className="py-1.5 px-3 text-left font-medium">Konto</th>
                            <th className="py-1.5 px-3 text-left font-medium">Beskrivning</th>
                            <th className="py-1.5 px-3 text-right font-medium">Debet</th>
                            <th className="py-1.5 px-3 text-right font-medium">Kredit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                          {statement.accountingVoucher.lines.map((l, idx) => (
                            <tr key={idx} className="hover:bg-muted/30">
                              <td className="py-1.5 px-3 font-semibold text-foreground">
                                {l.accountNumber}{' '}
                                <span className="font-normal text-muted-foreground font-sans text-[10px]">
                                  ({l.accountName})
                                </span>
                              </td>
                              <td className="py-1.5 px-3 text-muted-foreground font-sans">{l.description}</td>
                              <td className="py-1.5 px-3 text-right text-foreground">
                                {l.debitSek > 0 ? formatCurrency(l.debitSek, 'SEK') : '—'}
                              </td>
                              <td className="py-1.5 px-3 text-right text-foreground">
                                {l.creditSek > 0 ? formatCurrency(l.creditSek, 'SEK') : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Low-Cost B2B Settlement Rails (Bankgiro / OCR & Autogiro) */}
          {statement.settlementDirection === 'pay' && statement.settlementStatus === 'open' && (
            <BankgiroPaymentInstructions
              statement={statement}
              onSettle={handleSettle}
              isSettling={isSettling}
              onCardCheckout={handleCardCheckout}
            />
          )}

          {/* Netted Transactions Breakdown Tables */}
          <div className="space-y-6">
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
    </div>
  )
}
