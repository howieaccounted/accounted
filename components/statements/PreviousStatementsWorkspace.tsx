'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  Download,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { HelpPopover } from '@/components/ui/help-popover'
import { StatementWorkspace } from '@/components/statements/StatementWorkspace'
import {
  getPreviousStatements,
  ensureHistoricalStatementsSeeded,
} from '@/lib/statements/previous-statements'
import type { MonthlyNettingStatement } from '@/lib/statements/bilateral-netting'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PreviousStatementsWorkspaceProps {
  initialCompanyId?: string | null
}

export function PreviousStatementsWorkspace({
  initialCompanyId,
}: PreviousStatementsWorkspaceProps) {
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const t = useTranslations('statements')
  const router = useRouter()
  const searchParams = useSearchParams()

  const [statements, setStatements] = useState<MonthlyNettingStatement[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  const refreshList = () => {
    ensureHistoricalStatementsSeeded(initialCompanyId || undefined)
    const list = getPreviousStatements({ companyId: initialCompanyId })
    setStatements(list)
    return list
  }

  useEffect(() => {
    const list = refreshList()

    const queryMonth = searchParams?.get('month')
    if (queryMonth) {
      setSelectedMonth(queryMonth)
    } else if (list.length > 0 && !selectedMonth) {
      // Default to the most recent previous statement
      setSelectedMonth(list[0].month)
    }
  }, [initialCompanyId, searchParams])

  // Sync when statements are settled or unsettled in child or another tab
  useEffect(() => {
    let bc: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('accounted:bilateral-netting')
        bc.onmessage = (event) => {
          const { action } = event.data || {}
          if (action === 'settle' || action === 'unsettle') {
            refreshList()
          }
        }
      } catch {
        // ignore
      }
    }
    return () => {
      if (bc) bc.close()
    }
  }, [initialCompanyId])

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month)
    router.replace(`/network/statements?month=${encodeURIComponent(month)}`)
  }

  return (
    <div className="space-y-8 print:p-0">
      {/* Page Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="page-header-title font-display text-2xl leading-8 tracking-tight">
              {t('statements_archive_title')}
            </h1>
            <HelpPopover>{t('statements_help_body')}</HelpPopover>
          </div>
          <p className="text-sm text-muted-foreground">{t('statements_archive_subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-sm text-xs h-8 gap-1.5"
          >
            <Link href="/network/transactions">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>
                {isEnglish ? 'View Open Transactions' : 'Se öppna transaktioner'}
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Previous Statements Archive List Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>{t('all_previous_statements')}</span>
          </h2>
          <span className="text-xs text-muted-foreground">
            {statements.length} {isEnglish ? 'closed statements' : 'avslutade avräkningar'}
          </span>
        </div>

        {statements.length === 0 ? (
          <Card className="p-8 text-center border border-border/70 text-xs text-muted-foreground">
            {t('no_previous_statements')}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statements.map((stmt) => {
              const isSelected = selectedMonth === stmt.month
              const isPay = stmt.settlementDirection === 'pay'
              const isReceive = stmt.settlementDirection === 'receive'

              return (
                <Card
                  key={stmt.month}
                  onClick={() => handleSelectMonth(stmt.month)}
                  className={`p-4 cursor-pointer transition-all border rounded-lg space-y-3 hover:shadow-sm ${
                    isSelected
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'border-border/80 bg-card hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {stmt.month === '2026-08'
                            ? isEnglish ? 'August 2026' : 'Augusti 2026'
                            : stmt.month === '2026-07'
                            ? isEnglish ? 'July 2026' : 'Juli 2026'
                            : stmt.month === '2026-09'
                            ? isEnglish ? 'September 2026' : 'September 2026'
                            : stmt.month}
                        </span>
                        {stmt.settlementStatus === 'settled' ? (
                          <Badge className="bg-emerald-600 text-white text-[10px] font-medium py-0 px-1.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span>{t('status_paid')}</span>
                          </Badge>
                        ) : stmt.settlementStatus === 'open' ? (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-medium py-0 px-1.5 rounded-full flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5 text-amber-500" />
                            <span>{t('status_unpaid')}</span>
                          </Badge>
                        ) : stmt.isLocked ? (
                          <Badge variant="outline" className="border-slate-500/40 text-slate-600 text-[10px] py-0 px-1.5 rounded-full flex items-center gap-0.5">
                            <Lock className="h-2.5 w-2.5" />
                            <span>{t('statement_locked_badge')}</span>
                          </Badge>
                        ) : null}
                      </div>

                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {stmt.billingPeriodStart} – {stmt.billingPeriodEnd}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-base font-bold font-mono ${
                          isPay
                            ? 'text-rose-600 dark:text-rose-400'
                            : isReceive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        }`}
                      >
                        {formatCurrency(stmt.settlementAmountSek, 'SEK')}
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        {stmt.settlementStatus === 'open'
                          ? isPay
                            ? t('to_pay_label')
                            : isReceive
                            ? t('to_receive_label')
                            : isEnglish ? 'Balanced' : 'Kvittad'
                          : isPay
                          ? t('status_paid')
                          : isReceive
                          ? isEnglish ? 'Received' : 'Erhållen'
                          : isEnglish ? 'Balanced' : 'Kvittad'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {stmt.settlementStatus === 'settled' ? (
                        <>
                          <Sparkles className="h-3 w-3 text-emerald-500" />
                          <span>
                            {stmt.accountingVoucher
                              ? `Verifikat ${stmt.accountingVoucher.voucherSeries}${stmt.accountingVoucher.voucherNumber}`
                              : isEnglish ? 'Bookkept' : 'Bokförd'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-amber-500" />
                          <span>{t('auto_booked_upon_payment')}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/statements/bilateral/sie?month=${encodeURIComponent(stmt.month)}`}
                        onClick={(e) => e.stopPropagation()}
                        download
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                        title={t('download_sie4')}
                      >
                        <Download className="h-3 w-3" />
                        <span>SIE4</span>
                      </a>

                      <span className="inline-flex items-center gap-0.5 text-primary font-medium">
                        <span>{t('view_statement')}</span>
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Detailed Statement View for Selected Month */}
      {selectedMonth && (
        <div className="pt-4 border-t border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {isEnglish
                  ? `Statement Details: ${selectedMonth}`
                  : `Avräkningsdetaljer: ${selectedMonth}`}
              </span>
            </h3>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-7 gap-1"
            >
              <a
                href={`/api/statements/bilateral/sie?month=${encodeURIComponent(selectedMonth)}`}
                download
              >
                <Download className="h-3 w-3 text-muted-foreground" />
                <span>{t('download_sie_button')}</span>
              </a>
            </Button>
          </div>

          <StatementWorkspace
            key={selectedMonth}
            initialCompanyId={initialCompanyId}
            initialMonth={selectedMonth}
          />
        </div>
      )}
    </div>
  )
}
