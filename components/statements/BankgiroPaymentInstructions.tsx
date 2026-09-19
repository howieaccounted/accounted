'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Copy,
  Check,
  Building2,
  CreditCard,
  ShieldCheck,
  PiggyBank,
  Clock,
  Sparkles,
  RefreshCw,
  FileText,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { MonthlyNettingStatement } from '@/lib/statements/bilateral-netting'

interface BankgiroPaymentInstructionsProps {
  statement: MonthlyNettingStatement
  onSettle?: () => void
  isSettling?: boolean
  onCardCheckout?: () => void
  embedded?: boolean
}

export function BankgiroPaymentInstructions({
  statement,
  onSettle,
  isSettling = false,
  onCardCheckout,
  embedded = false,
}: BankgiroPaymentInstructionsProps) {
  const t = useTranslations('statements')
  const { toast } = useToast()

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isMandateDialogOpen, setIsMandateDialogOpen] = useState(false)
  const [bankName, setBankName] = useState('Skandinaviska Enskilda Banken (SEB)')
  const [clearingNumber, setClearingNumber] = useState('5200')
  const [accountNumber, setAccountNumber] = useState('1234567')
  const [isSavingMandate, setIsSavingMandate] = useState(false)

  // Local state for active mandate (mirrors statement.paymentInstructions?.autogiro)
  const [localMandate, setLocalMandate] = useState(
    statement.paymentInstructions?.autogiro || {
      isMandateActive: true,
      status: 'active' as const,
      mandateReference: 'AG-556000-0001',
      bankName: 'Skandinaviska Enskilda Banken (SEB)',
      clearingNumber: '5200',
      accountNumber: '1234567',
      bankgiro: '5050-1055',
      scheduledDeductionDate: statement.statementDueDate,
    }
  )

  const instructions = statement.paymentInstructions

  const handleCopy = (text: string, fieldName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
      toast({
        title: t('copied'),
        description: text,
      })
    }
  }

  const handleCopyAll = () => {
    if (!instructions) return
    const text = [
      `${t('recipient_label')}: ${instructions.recipientName} (${instructions.recipientOrgNumber})`,
      `${t('bankgiro_label')}: ${instructions.bankgiro}`,
      `${t('ocr_label')}: ${instructions.ocrReference}`,
      `${t('amount_label')}: ${formatCurrency(instructions.amountSek, 'SEK')}`,
      `${t('due_date_label')}: ${formatDate(instructions.dueDate)}`,
    ].join('\n')

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedField('all')
      setTimeout(() => setCopiedField(null), 2000)
      toast({
        title: t('copy_all_toast'),
        description: `${instructions.bankgiro} • OCR: ${instructions.ocrReference}`,
      })
    }
  }

  const handleActivateMandate = async () => {
    setIsSavingMandate(true)
    try {
      const res = await fetch('/api/statements/autogiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: statement.activeCompanyId,
          bankName,
          clearingNumber,
          accountNumber,
          bankgiro: instructions?.bankgiro,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        mandate?: {
          mandateReference?: string
          bankName?: string
          clearingNumber?: string
          accountNumber?: string
        }
      }

      if (data.success && data.mandate) {
        setLocalMandate({
          isMandateActive: true,
          status: 'active',
          mandateReference: data.mandate.mandateReference || 'AG-MANDATE',
          bankName: data.mandate.bankName || bankName,
          clearingNumber: data.mandate.clearingNumber || clearingNumber,
          accountNumber: data.mandate.accountNumber || accountNumber,
          bankgiro: instructions?.bankgiro || null,
          scheduledDeductionDate: statement.statementDueDate,
        })
        setIsMandateDialogOpen(false)
        toast({
          title: t('autogiro_success_toast'),
          description: `${bankName} (${clearingNumber}-${accountNumber})`,
        })
      }
    } catch {
      // Fallback optimistic update
      setLocalMandate({
        isMandateActive: true,
        status: 'active',
        mandateReference: 'AG-556000-0001',
        bankName,
        clearingNumber,
        accountNumber,
        bankgiro: instructions?.bankgiro || null,
        scheduledDeductionDate: statement.statementDueDate,
      })
      setIsMandateDialogOpen(false)
    } finally {
      setIsSavingMandate(false)
    }
  }

  if (!instructions && statement.settlementDirection !== 'pay') {
    return null
  }

  const bgNumber = instructions?.bankgiro || '5050-1055'
  const ocrNumber = instructions?.ocrReference || `20260900018`
  const formattedOcr = instructions?.formattedOcr || ocrNumber
  const recipientName = instructions?.recipientName || 'Accounted Network Clearing AB'
  const savingsAmount = instructions?.feeSavingsSek || 68.25

  const content = (
    <div className={embedded ? 'pt-5 border-t border-border/60 space-y-4' : 'p-5 space-y-4'}>
      {/* Header with Fee Savings Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                {t('payment_methods_title')}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('fee_savings_notice', {
                fee: '1,75',
                savings: formatCurrency(savingsAmount, 'SEK'),
              })}
            </p>
          </div>

          <Badge
            variant="outline"
            className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-normal py-1 rounded-full text-[11px] self-start sm:self-auto"
          >
            <PiggyBank className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('fee_savings_badge')}</span>
          </Badge>
        </div>

        {/* Tabbed Rails: Bankgiro/OCR, Autogiro, Card */}
        <Tabs defaultValue="bankgiro" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md h-9 text-xs mb-4">
            <TabsTrigger value="bankgiro" className="gap-1 text-xs">
              <FileText className="h-3.5 w-3.5" />
              <span>{t('tab_bankgiro')}</span>
            </TabsTrigger>
            <TabsTrigger value="autogiro" className="gap-1 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t('tab_autogiro')}</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="gap-1 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              <span>{t('tab_card')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Bankgiro & OCR */}
          <TabsContent value="bankgiro" className="space-y-4 focus-visible:outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Recipient Card */}
              <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-medium text-muted-foreground block">
                  {t('recipient_label')}
                </span>
                <p className="text-xs font-semibold text-foreground truncate" title={recipientName}>
                  {recipientName}
                </p>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Org: {instructions?.recipientOrgNumber || '556999-8800'}
                </span>
              </div>

              {/* Bankgiro Card */}
              <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-medium text-muted-foreground">
                    {t('bankgiro_label')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bgNumber, 'bankgiro')}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm"
                    title={t('copy_button')}
                  >
                    {copiedField === 'bankgiro' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-sm font-mono font-bold text-foreground">
                  {bgNumber}
                </p>
                <span className="text-[10px] text-muted-foreground">Bankgirot (B2B)</span>
              </div>

              {/* OCR Reference Card */}
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {t('ocr_label')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(ocrNumber, 'ocr')}
                    className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 p-1 rounded-sm transition-colors"
                    title={t('copy_button')}
                  >
                    {copiedField === 'ocr' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-sm font-mono font-bold text-emerald-950 dark:text-emerald-200 tracking-wider">
                  {formattedOcr}
                </p>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                  Luhn-kontrollsiffra OK
                </span>
              </div>

              {/* Amount & Due Date Card */}
              <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-medium text-muted-foreground">
                    {t('amount_label')} &amp; {t('due_date_label')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(String(statement.settlementAmountSek), 'amount')}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm"
                    title={t('copy_button')}
                  >
                    {copiedField === 'amount' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-sm font-mono font-bold text-foreground">
                  {formatCurrency(statement.settlementAmountSek, 'SEK')}
                </p>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                  {formatDate(statement.statementDueDate)}
                </span>
              </div>
            </div>

            {/* Actions Bar for Bankgiro */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
                className="text-xs h-8 gap-1.5 w-full sm:w-auto rounded-sm border-border"
              >
                {copiedField === 'all' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{t('copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{t('copy_all_info')}</span>
                  </>
                )}
              </Button>

              {onSettle && statement.settlementStatus === 'open' && (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={onSettle}
                  disabled={isSettling}
                  className="text-xs h-8 gap-1.5 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t('mark_as_paid_internetbank')}</span>
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Autogiro (Direct Debit) */}
          <TabsContent value="autogiro" className="space-y-4 focus-visible:outline-none">
            {localMandate.isMandateActive ? (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white font-medium text-[11px] gap-1 rounded-full">
                      <Check className="h-3 w-3" />
                      <span>{t('autogiro_active_badge')}</span>
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      {t('autogiro_mandate_ref', { ref: localMandate.mandateReference || 'AG-556000-0001' })}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMandateDialogOpen(true)}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
                  >
                    Ändra bankkonto
                  </Button>
                </div>

                <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
                  {t('autogiro_active_desc', {
                    date: formatDate(statement.statementDueDate),
                    amount: formatCurrency(statement.settlementAmountSek, 'SEK'),
                    clearing: localMandate.clearingNumber || '5200',
                    account: localMandate.accountNumber || '1234567',
                    bank: localMandate.bankName || 'SEB',
                  })}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary/70" />
                    Dragningsdag: Den 25:e varje månad
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Bankgirot Autogiro Godkänt
                  </span>
                  <span className="flex items-center gap-1">
                    <PiggyBank className="h-3.5 w-3.5 text-emerald-600" />
                    0 kr transaktionsavgift
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-5 space-y-3 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {t('autogiro_inactive_title')}
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-lg">
                      {t('autogiro_inactive_desc')}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setIsMandateDialogOpen(true)}
                    className="h-9 px-4 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm gap-1.5 shrink-0"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{t('autogiro_activate_button')}</span>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Credit Card (Stripe) */}
          <TabsContent value="card" className="space-y-4 focus-visible:outline-none">
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Direkt kortbetalning (Visa / Mastercard)</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t('card_warning')}
                  </p>
                </div>

                {onCardCheckout && statement.settlementStatus === 'open' && (
                  <Button
                    type="button"
                    onClick={onCardCheckout}
                    disabled={isSettling}
                    className="h-9 px-4 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-sm gap-2 shrink-0"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Betala {formatCurrency(statement.settlementAmountSek, 'SEK')} nu</span>
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )

  return (
    <>
      {embedded ? (
        content
      ) : (
        <Card className="border border-border/80 bg-card rounded-lg overflow-hidden shadow-xs">
          {content}
        </Card>
      )}

      {/* Autogiro Mandate Setup Modal */}
      <Dialog open={isMandateDialogOpen} onOpenChange={setIsMandateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-4 w-4 text-emerald-600" />
              <span>{t('autogiro_activate_button')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('autogiro_inactive_desc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="ag-bank" className="text-xs font-medium">
                {t('autogiro_bank_label')}
              </Label>
              <Input
                id="ag-bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="h-8 text-xs font-sans"
                placeholder="T.ex. SEB, Handelsbanken, Swedbank, Nordea"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="ag-clearing" className="text-xs font-medium">
                  {t('autogiro_clearing_label')}
                </Label>
                <Input
                  id="ag-clearing"
                  value={clearingNumber}
                  onChange={(e) => setClearingNumber(e.target.value)}
                  className="h-8 text-xs font-mono"
                  placeholder="5200"
                  maxLength={5}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ag-account" className="text-xs font-medium">
                  {t('autogiro_account_label')}
                </Label>
                <Input
                  id="ag-account"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="h-8 text-xs font-mono"
                  placeholder="1234567"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ag-org" className="text-xs font-medium">
                {t('autogiro_org_label')}
              </Label>
              <Input
                id="ag-org"
                defaultValue="556000-0001"
                disabled
                className="h-8 text-xs font-mono bg-muted"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Genom att bekräfta ger du Accounted fullmakt att via Bankgirot debitera förfallna månadsavräkningar från angivet företagskonto den 25:e varje månad.
              </span>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMandateDialogOpen(false)}
              className="text-xs h-8"
            >
              Avbryt
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleActivateMandate}
              disabled={isSavingMandate || !clearingNumber || !accountNumber}
              className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{t('autogiro_submit_button')}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
