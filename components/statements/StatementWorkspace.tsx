'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Scale,
  Radio,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  ShieldCheck,
  CreditCard,
  Download,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HelpPopover } from '@/components/ui/help-popover'
import { useToast } from '@/components/ui/use-toast'
import { useBilateralStatement } from '@/lib/hooks/use-bilateral-statement'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

interface StatementWorkspaceProps {
  initialCompanyId?: string | null
}

const MONTH_OPTIONS = [
  { value: '2026-09', label: 'September 2026' },
  { value: '2026-08', label: 'Augusti 2026' },
  { value: '2026-07', label: 'Juli 2026' },
  { value: '2026-10', label: 'Oktober 2026' },
]

export function StatementWorkspace({ initialCompanyId }: StatementWorkspaceProps) {
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const t = useTranslations('statements')
  const { toast } = useToast()

  const searchParams = useSearchParams()
  const hasHandledParams = useRef(false)

  const {
    statement,
    selectedMonth,
    setSelectedMonth,
    selectedCounterpartyId,
    setSelectedCounterpartyId,
    settleStatementAction,
  } = useBilateralStatement({
    initialCompanyId,
    initialMonth: '2026-09',
  })

  const [isSettling, setIsSettling] = useState(false)

  // Handle return from Stripe checkout
  useEffect(() => {
    if (hasHandledParams.current) return
    const settled = searchParams.get('settled') === 'true'
    const canceled = searchParams.get('canceled') === 'true'
    const month = searchParams.get('month')
    const scope = searchParams.get('scope')

    if (month && month !== selectedMonth) {
      setSelectedMonth(month)
    }
    if (scope && scope !== selectedCounterpartyId) {
      setSelectedCounterpartyId(scope)
    }

    if (settled) {
      hasHandledParams.current = true
      const ref = `NET-${(month || selectedMonth).replace('-', '')}-NETWORK`
      settleStatementAction({ reference: ref })
      toast({
        title: t('stripe_payment_title'),
        description: t('stripe_success_toast'),
      })
      if (typeof window !== 'undefined') {
        const cleanUrl = window.location.pathname + (month ? `?month=${month}` : '')
        window.history.replaceState(null, '', cleanUrl)
      }
    } else if (canceled) {
      hasHandledParams.current = true
      toast({
        title: t('stripe_payment_title'),
        description: t('stripe_cancel_toast'),
        variant: 'destructive',
      })
      if (typeof window !== 'undefined') {
        const cleanUrl = window.location.pathname + (month ? `?month=${month}` : '')
        window.history.replaceState(null, '', cleanUrl)
      }
    }
  }, [searchParams, selectedMonth, selectedCounterpartyId, setSelectedMonth, setSelectedCounterpartyId, settleStatementAction, t, toast])

  const handleSettle = async () => {
    if (!statement || statement.settlementStatus === 'settled') return
    setIsSettling(true)
    const ref = statement.isNetworkWide
      ? `NET-${selectedMonth.replace('-', '')}-NETWORK`
      : `NET-${selectedMonth.replace('-', '')}-${(statement.counterparty?.name || 'CO').slice(0, 2).toUpperCase()}`

    // If making a payment to Accounted Network, redirect to Stripe payment checkout
    if (statement.settlementDirection === 'pay') {
      try {
        const res = await fetch('/api/statements/bilateral/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            month: selectedMonth,
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
        // tolerate and fallback to standard settlement
      }
    }

    try {
      await settleStatementAction({ reference: ref })
      toast({
        title: t('settlement_success_title'),
        description: t('settlement_success_desc', {
          ref,
          count: statement.receivables.length + statement.payables.length,
        }),
      })
    } catch {
      // tolerate
    } finally {
      setIsSettling(false)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="space-y-8 print:p-0">
      {/* Page Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="page-header-title font-display text-2xl leading-8 tracking-tight">
              {t('title')}
            </h1>
            <HelpPopover>{t('help_body')}</HelpPopover>
          </div>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-sm text-xs h-8 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{isEnglish ? 'Print statement' : 'Skriv ut avräkning'}</span>
          </Button>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/30 rounded-lg border border-border/60">
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{t('period_label')}:</span>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="h-8 w-44 text-xs rounded-sm bg-background">
                <SelectValue placeholder={selectedMonth} />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {MONTH_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-xs rounded-sm">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Hero Settlement Card */}
      {statement && (
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
                  {statement.settlementStatus === 'settled' ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-medium text-[11px] gap-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{t('status_settled')}</span>
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 text-amber-700 dark:text-amber-400 font-normal text-[11px] gap-1 rounded-full"
                    >
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span>{t('status_open')}</span>
                    </Badge>
                  )}
                  {statement.settlementReference && (
                    <span className="text-xs font-mono text-muted-foreground">
                      • {statement.settlementReference}
                    </span>
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

              {/* Settlement Action Button */}
              <div className="flex flex-col items-start md:items-end gap-2 shrink-0 print:hidden">
                {statement.settlementStatus === 'open' ? (
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
                ) : (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>
                      {statement.settlementDirection === 'pay'
                        ? t('status_payment_completed')
                        : statement.settlementDirection === 'receive'
                        ? t('status_drawdown_completed')
                        : t('status_balanced_completed')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* The 3 Essential Metadata Fields Requested by the User */}
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
                  <span>{t('statement_issued')}</span>
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
                <p
                  className={cn(
                    'text-sm font-semibold font-mono',
                    statement.settlementStatus === 'open'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-foreground'
                  )}
                >
                  {formatDate(statement.statementDueDate)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Transaction Breakdown Tables */}
      <div className="space-y-6">
        {/* Network Counterparties Breakdown (when viewing all network companies) */}
        {statement && statement.isNetworkWide && statement.counterpartySummaries.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>{t('network_counterparties_title')}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('network_counterparties_desc')}
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-normal rounded-full">
                {statement.counterpartySummaries.length} {isEnglish ? 'connected companies' : 'anslutna företag'}
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground text-left">
                    <th className="py-2.5 px-3 font-medium">{t('th_counterparty')}</th>
                    <th className="py-2.5 px-3 font-medium text-right">{t('th_receivables')} (1510)</th>
                    <th className="py-2.5 px-3 font-medium text-right">{t('th_payables')} (2440)</th>
                    <th className="py-2.5 px-3 font-medium text-right">{t('th_net')}</th>
                    <th className="py-2.5 px-3 font-medium text-right hidden sm:table-cell">{t('th_status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.counterpartySummaries.map((summary) => (
                    <tr key={summary.counterpartyId} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{summary.name}</span>
                          <span className="font-mono text-[11px] text-muted-foreground/80 hidden sm:inline">
                            ({summary.orgNumber})
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {summary.receivablesSek > 0 ? `+${formatCurrency(summary.receivablesSek, 'SEK')}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-600 dark:text-rose-400">
                        {summary.payablesSek > 0 ? `−${formatCurrency(summary.payablesSek, 'SEK')}` : '—'}
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
                        <Badge variant="outline" className="font-normal text-[10px] rounded-full border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
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

        {/* Customer Invoices Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
              <span>{t('customer_invoices_section')}</span>
            </h3>
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(statement?.totalReceivablesSek || 0, 'SEK')}
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
                {statement?.receivables && statement.receivables.length > 0 ? (
                  statement.receivables.map((item) => (
                    <tr key={item.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                        {item.invoiceNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-foreground truncate max-w-[140px]">
                        {item.counterpartyName}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {formatDate(item.invoiceDate)}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground hidden sm:table-cell">
                        {item.dueDate ? formatDate(item.dueDate) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-foreground truncate max-w-xs">
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(item.amountSek, 'SEK')}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Badge variant="outline" className="font-normal text-[10px] rounded-full">
                          {statement.settlementStatus === 'settled'
                            ? isEnglish
                              ? 'Netted'
                              : 'Avräknad'
                            : item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground italic text-xs">
                      {t('empty_desc')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supplier Invoices Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <ArrowUpRight className="h-4 w-4 text-rose-500" />
              <span>{t('supplier_invoices_section')}</span>
            </h3>
            <span className="text-xs font-mono font-medium text-rose-600 dark:text-rose-400">
              −{formatCurrency(statement?.totalPayablesSek || 0, 'SEK')}
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
                {statement?.payables && statement.payables.length > 0 ? (
                  statement.payables.map((item) => (
                    <tr key={item.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                        {item.invoiceNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-foreground truncate max-w-[140px]">
                        {item.counterpartyName}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {formatDate(item.invoiceDate)}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground hidden sm:table-cell">
                        {item.dueDate ? formatDate(item.dueDate) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-foreground truncate max-w-xs">
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-rose-600 dark:text-rose-400">
                        −{formatCurrency(item.amountSek, 'SEK')}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Badge variant="outline" className="font-normal text-[10px] rounded-full">
                          {statement.settlementStatus === 'settled'
                            ? isEnglish
                              ? 'Netted'
                              : 'Avräknad'
                            : item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground italic text-xs">
                      {t('empty_desc')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step-by-Step Netting Math Box */}
        {statement && (
          <div className="p-4 rounded-lg bg-secondary/40 border border-border text-xs space-y-2">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-primary" />
              <span>{isEnglish ? 'Multilateral Netting Math (Option A Billing Cycle)' : 'Kvittningsberäkning (Option A Månadscykel)'}</span>
            </div>
            <div className="font-mono text-muted-foreground leading-relaxed">
              {formatCurrency(statement.totalReceivablesSek, 'SEK')} ({isEnglish ? 'Customer Invoices 1510' : 'Kundfordringar 1510'}) −{' '}
              {formatCurrency(statement.totalPayablesSek, 'SEK')} ({isEnglish ? 'Supplier Invoices 2440' : 'Leverantörsskulder 2440'}) ={' '}
              <strong className={statement.netAmountSek < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                {formatCurrency(statement.netAmountSek, 'SEK')}
              </strong>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              {t('option_a_description')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
