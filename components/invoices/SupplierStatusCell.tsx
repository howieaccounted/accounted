'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useToast } from '@/components/ui/use-toast'
import { Check, Clock, Radio, Building2, Calendar, FileText, UserPlus, Send, Zap, CheckCircle2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { InvoiceSupplierStatusInfo, SupplierAccountingStatus } from '@/lib/invoices/supplier-status'
import type { NettedTransactionItem, NetworkDrawdown } from '@/lib/statements/bilateral-netting'
import type { Invoice } from '@/types'
import { InstantDrawdownDialog } from '@/components/statements/InstantDrawdownDialog'
import { formatDate } from '@/lib/utils'

interface SupplierStatusCellProps {
  info: InvoiceSupplierStatusInfo
  invoice?: Invoice
  onUpdateStatus?: (
    status: SupplierAccountingStatus,
    scheduledPaymentDate?: string,
    extra?: { email?: string }
  ) => void
  onDrawdownSuccess?: (drawdown: NetworkDrawdown) => void
}

export function SupplierStatusCell({
  info,
  invoice,
  onUpdateStatus,
  onDrawdownSuccess,
}: SupplierStatusCellProps) {
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const { toast } = useToast()

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isDrawdownOpen, setIsDrawdownOpen] = useState(false)
  const [localDrawdown, setLocalDrawdown] = useState<NetworkDrawdown | null>(info.drawdown || null)
  const [email, setEmail] = useState(info.counterpartyEmail || '')
  const [isSending, setIsSending] = useState(false)

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSending(true)
    setTimeout(() => {
      onUpdateStatus?.('invited', undefined, { email: email.trim() })
      setIsSending(false)
      setIsInviteOpen(false)
      toast({
        title: isEnglish ? 'Invitation sent' : 'Inbjudan skickad',
        description: isEnglish
          ? `An invitation was sent to ${email.trim()}.`
          : `En inbjudan har skickats till ${email.trim()}.`,
      })
    }, 400)
  }

  // Invite dialog component reused across both unconnected and invited states
  const inviteDialog = (
    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
      <DialogContent
        className="max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-semibold">
              {isEnglish ? 'Invite customer to network' : 'Bjud in kund till nätverket'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isEnglish
              ? `Connect with ${info.counterpartyName} to automatically receive real-time approval status and scheduled payment dates in your invoice list.`
              : `Koppla samman med ${info.counterpartyName} för att automatiskt se atteststatus och planerade betalningsdatum i realtid.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="counterpartyName" className="text-xs">
              {isEnglish ? 'Customer' : 'Kund'}
            </Label>
            <Input
              id="counterpartyName"
              value={info.counterpartyName}
              disabled
              className="h-8 text-xs bg-muted/40 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="inviteEmail" className="text-xs">
              {isEnglish ? 'Recipient email address' : 'Mottagarens e-postadress'}
            </Label>
            <Input
              id="inviteEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isEnglish ? 'e.g. accounting@company.com' : 't.ex. ekonomi@foretag.se'}
              required
              className="h-8 text-xs"
              autoFocus
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-sm text-xs h-8"
              onClick={() => setIsInviteOpen(false)}
              disabled={isSending}
            >
              {isEnglish ? 'Cancel' : 'Avbryt'}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-sm text-xs h-8 gap-1.5"
              disabled={isSending || !email.trim()}
            >
              {isSending ? (
                <span>{isEnglish ? 'Sending…' : 'Skickar…'}</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>{isEnglish ? 'Send invitation' : 'Skicka inbjudan'}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  // When there is no connection between the companies, display the invite button
  if (!info.hasCounterpartyData || info.supplierStatus === 'unconnected') {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 px-2 text-[11px] font-normal gap-1 rounded-sm border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => {
            if (!email && info.counterpartyEmail) {
              setEmail(info.counterpartyEmail)
            }
            setIsInviteOpen(true)
          }}
          title={isEnglish ? `Invite ${info.counterpartyName} to connect` : `Bjud in ${info.counterpartyName} till nätverket`}
        >
          <UserPlus className="h-3 w-3 text-muted-foreground" />
          <span>{isEnglish ? 'Invite' : 'Bjud in'}</span>
        </Button>
        {inviteDialog}
      </div>
    )
  }

  // When counterparty has already been invited
  if (info.supplierStatus === 'invited') {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="group/trigger inline-flex items-center text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
            >
              <Badge
                variant="outline"
                className="gap-1.5 border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-normal py-0.5 hover:bg-sky-500/20 transition-colors cursor-pointer"
              >
                <Clock className="h-3 w-3 text-sky-500" />
                <span>{isEnglish ? 'Invited' : 'Inbjuden'}</span>
              </Badge>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 p-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Radio className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
                <span>{isEnglish ? 'Network Invitation' : 'Nätverksinbjudan'}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 font-medium">
                {isEnglish ? 'Pending' : 'Väntar'}
              </span>
            </div>

            <div className="space-y-1.5 py-1 text-muted-foreground">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-foreground/80">
                  <Building2 className="h-3 w-3" />
                  {isEnglish ? 'Customer:' : 'Kund:'}
                </span>
                <span className="font-medium text-foreground">{info.counterpartyName}</span>
              </div>

              {(info.invitedEmail || info.counterpartyEmail) && (
                <div className="flex justify-between items-center text-[11px]">
                  <span>{isEnglish ? 'Recipient:' : 'Mottagare:'}</span>
                  <span className="font-mono">{info.invitedEmail || info.counterpartyEmail}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px]">
                <span>Status:</span>
                <span className="text-sky-600 dark:text-sky-400 font-medium">
                  {isEnglish ? 'Invitation sent' : 'Inbjudan skickad'}
                </span>
              </div>
            </div>

            {onUpdateStatus && (
              <>
                <DropdownMenuSeparator className="my-2" />
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(true)}
                    className="w-full text-left px-2 py-1.5 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 text-[11px] font-medium transition-colors"
                  >
                    ↺ {isEnglish ? 'Resend' : 'Skicka igen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus('approved', '2026-10-15')}
                    className="w-full text-left px-2 py-1.5 rounded-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-medium transition-colors"
                  >
                    ✓ {isEnglish ? 'Simulate connect' : 'Simulera anslutning'}
                  </button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {inviteDialog}
      </div>
    )
  }

  const payDateFormatted = info.scheduledPaymentDate ? formatDate(info.scheduledPaymentDate) : null
  const paidDateFormatted = info.paidAt ? formatDate(info.paidAt.slice(0, 10)) : payDateFormatted

  const isDrawn = Boolean(localDrawdown || info.drawdownStatus === 'drawn')
  const isVerified = Boolean(
    info.hasCounterpartyData &&
    (info.supplierStatus === 'approved' ||
      info.supplierStatus === 'bank_entered' ||
      info.invoiceNumber === '1001' ||
      info.invoiceNumber === '1002') &&
    info.supplierStatus !== 'paid' &&
    invoice?.status !== 'paid' &&
    invoice?.status !== 'draft' &&
    !(invoice as { credited_invoice_id?: string | null })?.credited_invoice_id
  )
  const canDrawDown = !isDrawn && (info.drawdownStatus === 'available' || isVerified)

  const drawdownMonth = invoice?.invoice_date ? invoice.invoice_date.slice(0, 7) : '2026-09'
  const drawdownItem: NettedTransactionItem = {
    id: invoice?.id || info.invoiceId,
    invoiceNumber: invoice?.invoice_number || info.invoiceNumber,
    type: 'receivable',
    accountNumber: '1510 (Kundfordringar)',
    invoiceDate: invoice?.invoice_date || new Date().toISOString().slice(0, 10),
    dueDate: invoice?.due_date || info.scheduledPaymentDate || null,
    description: invoice?.notes || `Faktura #${invoice?.invoice_number || info.invoiceNumber}`,
    amountSek: Number(invoice?.total_sek || invoice?.total || info.totalSek || 0),
    status: invoice?.status || 'sent',
    counterpartyId: (invoice?.customer as { id?: string })?.id || 'cp-nordic-design',
    counterpartyName: info.counterpartyName,
    counterpartyOrgNumber: info.counterpartyOrgNumber,
    isNetworkVerified: true,
    drawdownStatus: 'available',
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group/trigger inline-flex items-center text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
          >
            {info.supplierStatus === 'paid' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-normal py-0.5 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <Check className="h-3 w-3 text-emerald-500" />
                <span>Betald {paidDateFormatted}</span>
              </Badge>
            )}

            {info.supplierStatus === 'approved' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-normal py-0.5 hover:bg-emerald-500/15 transition-colors cursor-pointer"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Attesterad • Betalas {payDateFormatted}</span>
              </Badge>
            )}

            {info.supplierStatus === 'bank_entered' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-normal py-0.5 hover:bg-blue-500/20 transition-colors cursor-pointer"
              >
                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0"></span>
                <span>Inlagd i bank • {payDateFormatted}</span>
              </Badge>
            )}

            {info.supplierStatus === 'registered' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-border text-muted-foreground font-normal py-0.5 hover:bg-secondary transition-colors cursor-pointer"
              >
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>Mottagen • Prel. {payDateFormatted}</span>
              </Badge>
            )}

            {info.supplierStatus === 'overdue' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-normal py-0.5 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <span>Förfallen hos kund</span>
              </Badge>
            )}

            {info.supplierStatus === 'disputed' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-normal py-0.5 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <span>Bestridd av kund</span>
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 p-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>Bilateral Accounting Sync</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
              Realtime
            </span>
          </div>

          <div className="space-y-1.5 py-1 text-muted-foreground">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-foreground/80">
                <Building2 className="h-3 w-3" />
                Kund / Motpart:
              </span>
              <span className="font-medium text-foreground">{info.counterpartyName}</span>
            </div>

            {info.counterpartyOrgNumber && (
              <div className="flex justify-between items-center text-[11px]">
                <span>Org.nr:</span>
                <span className="font-mono">{info.counterpartyOrgNumber}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-foreground/80">
                <FileText className="h-3 w-3" />
                Kundens ref (AP):
              </span>
              <span className="font-mono font-medium">{info.supplierInvoiceNumber || `INV-${info.invoiceNumber}`}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Bokfört konto:</span>
              <span className="font-mono">{info.bookedAccount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-foreground/80">
                <Calendar className="h-3 w-3" />
                Planerad betalning:
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {payDateFormatted || 'Ej fastställd'}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
              <span>Senast synkad:</span>
              <span>{info.lastSyncedAt ? new Date(info.lastSyncedAt).toLocaleTimeString() : 'Nyss'}</span>
            </div>
          </div>

          {onUpdateStatus && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-0 py-1">
                Testa realtidssynk (Kund)
              </DropdownMenuLabel>

              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => onUpdateStatus('paid')}
                  className="w-full text-left px-2 py-1.5 rounded-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-medium transition-colors"
                >
                  ✓ Markera betald
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus('approved')}
                  className="w-full text-left px-2 py-1.5 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 text-[11px] font-medium transition-colors"
                >
                  ↺ Återställ attesterad
                </button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Draw down button / status badge exclusively for verified network invoices */}
      {isDrawn ? (
        <Badge
          variant="outline"
          className="font-normal text-[10px] rounded-full border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 gap-1 inline-flex items-center shrink-0"
          title={isEnglish ? 'Monies drawn down via Accounted Network' : 'Fakturan har förtidsinlösts via Accounted Network'}
        >
          <CheckCircle2 className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
          <span>{isEnglish ? 'Drawn Down' : 'Förtida uttag'}</span>
        </Badge>
      ) : canDrawDown ? (
        <Button
          type="button"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setIsDrawdownOpen(true)
          }}
          className="h-6 px-2 text-[11px] gap-1 font-semibold rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 transition-colors"
          title={isEnglish ? 'Draw down monies immediately on Accounted Network' : 'Ta ut pengarna direkt via Accounted Network'}
        >
          <Zap className="h-3 w-3 fill-current" />
          <span>{isEnglish ? 'Draw down' : 'Ta ut'}</span>
        </Button>
      ) : null}

      {isDrawdownOpen && (
        <InstantDrawdownDialog
          open={isDrawdownOpen}
          onOpenChange={setIsDrawdownOpen}
          item={drawdownItem}
          month={drawdownMonth}
          onSuccess={(dd) => {
            setLocalDrawdown(dd)
            onDrawdownSuccess?.(dd)
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              try {
                const bcNet = new BroadcastChannel('accounted:bilateral-netting')
                bcNet.postMessage({ type: 'drawdown', drawdown: dd, timestamp: Date.now() })
                bcNet.close()
                const bcSupp = new BroadcastChannel('accounted:supplier-status-broadcast')
                bcSupp.postMessage({
                  type: 'drawdown',
                  drawdown: dd,
                  invoiceNumber: info.invoiceNumber,
                  timestamp: Date.now(),
                })
                bcSupp.close()
              } catch {
                // ignore
              }
            }
          }}
        />
      )}
    </div>
  )
}
