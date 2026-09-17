'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Building2,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const t = useTranslations('statements')

  const month = searchParams.get('month') || '2026-09'
  const scope = searchParams.get('scope') || 'all'
  const ref = searchParams.get('ref') || `NET-${month.replace('-', '')}-NETWORK`
  const rawAmount = parseFloat(searchParams.get('amount') || '4000')
  const amountSek = isNaN(rawAmount) ? 4000 : Math.abs(rawAmount)

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardExpiry, setCardExpiry] = useState('12 / 28')
  const [cardCvc, setCardCvc] = useState('123')
  const [cardholderName, setCardholderName] = useState(
    isEnglish ? 'Company Finance Manager' : 'Ekonomiansvarig'
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Settle the statement in the backend
      await fetch('/api/statements/bilateral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          counterpartyId: scope,
          reference: ref,
        }),
      })

      // Broadcast across tabs
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('accounted:bilateral-netting')
          bc.postMessage({
            action: 'settle',
            month,
            counterpartyId: scope,
            timestamp: Date.now(),
          })
          bc.close()
        } catch {
          // ignore
        }
      }

      setIsDone(true)
      setTimeout(() => {
        router.push(`/statements?month=${encodeURIComponent(month)}&settled=true`)
      }, 1000)
    } catch {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    router.push(`/statements?month=${encodeURIComponent(month)}&canceled=true`)
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50/50 dark:bg-background">
      {/* Top Banner: Stripe Powered & Test Badge */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-6 border-b border-border/40">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t('checkout_cancel_return')}</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[11px] font-mono"
          >
            {t('checkout_test_mode')}
          </Badge>
          <div className="flex items-center gap-1 text-xs font-semibold tracking-tight text-muted-foreground">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>{t('checkout_powered_by')}</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 bg-background rounded-lg border border-border/80 shadow-sm overflow-hidden">
        {/* Left Column: Settlement Information */}
        <div className="md:col-span-5 p-6 sm:p-8 bg-muted/20 border-b md:border-b-0 md:border-r border-border/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Accounted Network
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('stripe_payment_title')}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <span className="text-xs text-muted-foreground block font-medium">
                {isEnglish ? 'Amount due' : 'Belopp att betala'}
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground mt-1 tracking-tight">
                {formatCurrency(amountSek, 'SEK')}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/40 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{isEnglish ? 'Period' : 'Period'}</span>
                <span className="font-mono text-foreground font-medium">{month}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Reference' : 'Referens'}</span>
                <span className="font-mono text-foreground">{ref}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Clearing network' : 'Clearingnätverk'}</span>
                <span className="text-foreground">Accounted Multilateral</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border/40">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {isEnglish
                  ? 'Guaranteed end-to-end encryption with 256-bit SSL'
                  : 'Säker krypterad överföring med 256-bitars SSL'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Stripe Card Payment Form */}
        <div className="md:col-span-7 p-6 sm:p-8">
          <form onSubmit={handlePay} className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {t('checkout_page_title')}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEnglish
                  ? 'Complete your network settlement using card payment.'
                  : 'Genomför din nätverksbetalning med betalkort.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cardNumber" className="text-xs font-medium">
                  {t('checkout_card_number')}
                </Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="rounded-sm pr-10 font-mono text-xs"
                    placeholder="4242 4242 4242 4242"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cardExpiry" className="text-xs font-medium">
                    {t('checkout_expires')}
                  </Label>
                  <Input
                    id="cardExpiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    className="rounded-sm font-mono text-xs"
                    placeholder="MM / YY"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cardCvc" className="text-xs font-medium">
                    {t('checkout_cvc')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="cardCvc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      required
                      maxLength={4}
                      className="rounded-sm font-mono text-xs pr-8"
                      placeholder="CVC"
                    />
                    <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cardholderName" className="text-xs font-medium">
                  {t('checkout_cardholder_name')}
                </Label>
                <Input
                  id="cardholderName"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                  className="rounded-sm text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-xs font-medium">
                  {t('checkout_country')}
                </Label>
                <Input
                  id="country"
                  value={isEnglish ? 'Sweden (SE)' : 'Sverige (SE)'}
                  disabled
                  className="rounded-sm text-xs bg-muted/40 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isProcessing || isDone}
                className="w-full rounded-sm font-medium gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-11"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('checkout_processing')}</span>
                  </>
                ) : isDone ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>
                      {isEnglish ? 'Payment Approved!' : 'Betalning godkänd!'}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>
                      {t('checkout_pay_button', {
                        amount: formatCurrency(amountSek, 'SEK'),
                      })}
                    </span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-[11px] text-muted-foreground">
              {isEnglish
                ? 'By confirming payment, you authorize Accounted Network to settle all period netted invoices.'
                : 'Genom att bekräfta betalningen godkänner du reglering av månadens kvittade fakturor.'}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function StatementCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  )
}
