'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/lib/errors/get-error-message'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Zap,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Info,
  Loader2,
} from 'lucide-react'
import type { NettedTransactionItem, NetworkDrawdown } from '@/lib/statements/bilateral-netting'

interface InstantDrawdownDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: NettedTransactionItem | null
  month: string
  onSuccess?: (drawdown: NetworkDrawdown) => void
}

export function InstantDrawdownDialog({
  open,
  onOpenChange,
  item,
  month,
  onSuccess,
}: InstantDrawdownDialogProps) {
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedDrawdown, setCompletedDrawdown] = useState<NetworkDrawdown | null>(null)

  if (!item) return null

  const feePercent = 1.0
  const grossSek = item.amountSek
  const feeSek = Math.round(grossSek * (feePercent / 100) * 100) / 100
  const netPayoutSek = Math.round((grossSek - feeSek) * 100) / 100

  const handleDrawdown = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/statements/bilateral/drawdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: item.id,
          invoiceNumber: item.invoiceNumber,
          month,
          feePercent,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to draw down monies')
      }

      const payload = (await res.json()) as {
        success: boolean
        data: NetworkDrawdown
      }

      setCompletedDrawdown(payload.data)
      toast({
        title: isEnglish ? 'Monies Disbursed!' : 'Utbetalning genomförd!',
        description: isEnglish
          ? `${formatCurrency(payload.data.netDisbursedSek, 'SEK')} transferred to your bank account.`
          : `${formatCurrency(payload.data.netDisbursedSek, 'SEK')} har överförts till ditt företagskonto.`,
      })

      if (onSuccess) {
        onSuccess(payload.data)
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: isEnglish ? 'Drawdown Failed' : 'Utbetalningen misslyckades',
        description: getErrorMessage(err),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCompletedDrawdown(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden sm:rounded-xl">
        {completedDrawdown ? (
          <div className="p-6 space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                {isEnglish ? 'Instant Drawdown Disbursed' : 'Direktutbetalning genomförd'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEnglish
                  ? `Funds have been wired to your bank account for Invoice #${completedDrawdown.invoiceNumber}.`
                  : `Likviden har överförts till ditt konto för faktura #${completedDrawdown.invoiceNumber}.`}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/40 border border-border/80 space-y-2 text-left">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-muted-foreground">{isEnglish ? 'Reference:' : 'Referens:'}</span>
                <span className="font-mono font-medium text-foreground">{completedDrawdown.reference}</span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-muted-foreground">{isEnglish ? 'Net Payout:' : 'Utbetalt nettobelopp:'}</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  {formatCurrency(completedDrawdown.netDisbursedSek, 'SEK')}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-muted-foreground">{isEnglish ? 'Accounted Deduction:' : 'Avräknas i månadsbesked:'}</span>
                <span className="text-foreground">
                  {isEnglish
                    ? `Will deduct ${formatCurrency(completedDrawdown.grossAmountSek, 'SEK')} on ${month} statement`
                    : `Dras av med ${formatCurrency(completedDrawdown.grossAmountSek, 'SEK')} på månadsavräkning ${month}`}
                </span>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full rounded-sm font-medium">
              {isEnglish ? 'Done' : 'Klar'}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 border-b border-border/60">
              <DialogHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium py-1 rounded-full text-[11px]"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      {isEnglish ? 'Verified on Accounted Network' : 'Verifierad i Accounted Network'}
                    </span>
                  </Badge>

                  <Badge variant="secondary" className="font-mono text-xs">
                    1.0% {isEnglish ? 'flat fee' : 'fast avgift'}
                  </Badge>
                </div>

                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span>
                    {isEnglish ? 'Accounted Instant Drawdown' : 'Direktutbetalning av faktura'}
                  </span>
                </DialogTitle>

                <DialogDescription className="text-xs text-muted-foreground">
                  {isEnglish
                    ? 'Your customer has verified this invoice on the network. Unlock working capital immediately instead of waiting for the due date.'
                    : 'Din kund har verifierat denna faktura i nätverket. Få tillgång till rörelsekapital direkt istället för att vänta på förfallodatumet.'}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-4">
              {/* Invoice details strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border/80 bg-card text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    <span>{item.counterpartyName}</span>
                  </div>
                  <p className="text-muted-foreground">
                    {isEnglish ? 'Invoice' : 'Faktura'} #{item.invoiceNumber}
                  </p>
                </div>

                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start text-xs font-mono">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {isEnglish ? 'Due' : 'Förfaller'}: {item.dueDate ? formatDate(item.dueDate) : '—'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    +{formatCurrency(grossSek, 'SEK')}
                  </span>
                </div>
              </div>

              {/* Transaction & Fee Breakdown */}
              <div className="space-y-2 rounded-lg bg-muted/30 p-3.5 border border-border/70 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{isEnglish ? 'Gross Verified Receivable (1510)' : 'Verifierad kundfordran (1510)'}</span>
                  <span className="font-mono font-medium text-foreground">
                    +{formatCurrency(grossSek, 'SEK')}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>{isEnglish ? 'Early Drawdown Fee (1.0% / 6570)' : 'Förtida uttagsavgift (1,0% / 6570)'}</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    −{formatCurrency(feeSek, 'SEK')}
                  </span>
                </div>

                <div className="pt-2 border-t border-border/60 flex justify-between items-baseline">
                  <span className="font-semibold text-foreground text-sm">
                    {isEnglish ? 'Net Payout to Bank (1930)' : 'Nettoutbetalning till Bank (1930)'}
                  </span>
                  <span className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(netPayoutSek, 'SEK')}
                  </span>
                </div>
              </div>

              {/* Payout rail destination */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card text-xs">
                <CreditCard className="h-4 w-4 text-primary shrink-0" />
                <div className="space-y-0.5 flex-1">
                  <p className="font-medium text-foreground">
                    {isEnglish ? 'SEB Företagskonto (1930)' : 'SEB Företagskonto (1930)'}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Bankgiro 5050-1055 • {isEnglish ? 'Estimated within 15 mins' : 'Beräknad överföring inom 15 min'}
                  </p>
                </div>
              </div>

              {/* Statement Reconciliation Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p>
                  {isEnglish
                    ? `This advance is recorded on BAS 2890 and will be automatically deducted from your upcoming monthly settlement statement on the 1st of the month. No manual bookkeeping required.`
                    : `Detta förskott bokförs på BAS 2890 och avräknas automatiskt från ditt kommande månadsbesked den 1:a i månaden. Ingen manuell bokföring krävs.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-sm text-xs"
                >
                  {isEnglish ? 'Cancel' : 'Avbryt'}
                </Button>

                <Button
                  onClick={handleDrawdown}
                  disabled={isSubmitting}
                  className="rounded-sm text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{isEnglish ? 'Transferring...' : 'Överför likvid...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 fill-current" />
                      <span>
                        {isEnglish
                          ? `Confirm & Draw Down ${formatCurrency(netPayoutSek, 'SEK')}`
                          : `Bekräfta & ta ut ${formatCurrency(netPayoutSek, 'SEK')}`}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
