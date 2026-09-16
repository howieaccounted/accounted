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
import { Check, Clock, Radio, Building2, Calendar, FileText, UserPlus, Send } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SupplierSideStatusInfo, SupplierSideAccountingStatus } from '@/lib/supplier-invoices/supplier-side-status'
import { formatDate } from '@/lib/utils'

interface SupplierSideStatusCellProps {
  info: SupplierSideStatusInfo
  onUpdateStatus?: (
    status: SupplierSideAccountingStatus,
    paymentReceivedAt?: string,
    extra?: { email?: string }
  ) => void
}

export function SupplierSideStatusCell({ info, onUpdateStatus }: SupplierSideStatusCellProps) {
  const locale = useLocale()
  const isEnglish = locale === 'en'
  const { toast } = useToast()

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [email, setEmail] = useState(info.supplierEmail || '')
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

  // Invite dialog component reused across unconnected and invited states
  const inviteDialog = (
    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
      <DialogContent
        className="max-w-md p-6 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-semibold">
              {isEnglish ? 'Invite supplier to network' : 'Bjud in leverantör till nätverket'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isEnglish
              ? `Connect with ${info.supplierName} to automatically sync accounts receivable (1510) and payments directly from the supplier in real time.`
              : `Koppla samman med ${info.supplierName} för att automatiskt synkronisera leverantörens kundfordringar (1510) och betalningar i realtid.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="supplierName" className="text-xs">
              {isEnglish ? 'Supplier' : 'Leverantör'}
            </Label>
            <Input
              id="supplierName"
              value={info.supplierName}
              disabled
              className="h-8 text-xs bg-muted/40 cursor-not-allowed rounded-sm"
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
              className="h-8 text-xs rounded-sm"
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
  if (!info.hasSupplierData || info.supplierSideStatus === 'unconnected') {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 px-2 text-[11px] font-normal gap-1 rounded-sm border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => {
            if (!email && info.supplierEmail) {
              setEmail(info.supplierEmail)
            }
            setIsInviteOpen(true)
          }}
          title={isEnglish ? `Invite ${info.supplierName} to connect` : `Bjud in ${info.supplierName} till nätverket`}
        >
          <UserPlus className="h-3 w-3 text-muted-foreground" />
          <span>{isEnglish ? 'Invite' : 'Bjud in'}</span>
        </Button>
        {inviteDialog}
      </div>
    )
  }

  // When supplier has already been invited
  if (info.supplierSideStatus === 'invited') {
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

          <DropdownMenuContent align="end" className="w-80 p-3 text-xs rounded-lg">
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
                  {isEnglish ? 'Supplier:' : 'Leverantör:'}
                </span>
                <span className="font-medium text-foreground">{info.supplierName}</span>
              </div>

              {(info.invitedEmail || info.supplierEmail) && (
                <div className="flex justify-between items-center text-[11px]">
                  <span>{isEnglish ? 'Recipient:' : 'Mottagare:'}</span>
                  <span className="font-mono">{info.invitedEmail || info.supplierEmail}</span>
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
                    onClick={() => onUpdateStatus('booked_receivable')}
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

  const dueDateFormatted = info.dueDate ? formatDate(info.dueDate) : null
  const paidDateFormatted = info.paymentReceivedAt ? formatDate(info.paymentReceivedAt.slice(0, 10)) : dueDateFormatted

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group/trigger inline-flex items-center text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
          >
            {(info.supplierSideStatus === 'payment_received' || info.supplierSideStatus === 'reconciled') && (
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-normal py-0.5 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <Check className="h-3 w-3 text-emerald-500" />
                <span>
                  {info.supplierSideStatus === 'reconciled' ? 'Avstämd' : 'Mottagen'} {paidDateFormatted}
                </span>
              </Badge>
            )}

            {info.supplierSideStatus === 'booked_receivable' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-normal py-0.5 hover:bg-emerald-500/15 transition-colors cursor-pointer"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Bokförd • Förfaller {dueDateFormatted}</span>
              </Badge>
            )}

            {info.supplierSideStatus === 'overdue' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-normal py-0.5 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <span>Förfallen hos lev.</span>
              </Badge>
            )}

            {info.supplierSideStatus === 'disputed' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-normal py-0.5 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <span>Bestridd hos lev.</span>
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 p-3 text-xs rounded-lg">
          <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>Bilateral Supplier Sync</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
              Realtime
            </span>
          </div>

          <div className="space-y-1.5 py-1 text-muted-foreground">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-foreground/80">
                <Building2 className="h-3 w-3" />
                Leverantör:
              </span>
              <span className="font-medium text-foreground truncate max-w-[160px] text-right" title={info.supplierName}>
                {info.supplierName}
              </span>
            </div>

            {info.supplierOrgNumber && (
              <div className="flex justify-between items-center text-[11px]">
                <span>Org.nr:</span>
                <span className="font-mono">{info.supplierOrgNumber}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-foreground/80">
                <FileText className="h-3 w-3" />
                Kundfakturanr (AR):
              </span>
              <span className="font-mono font-medium">
                {info.customerInvoiceNumber || info.supplierInvoiceNumber}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Bokfört konto:</span>
              <span className="font-mono">{info.bookedAccount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-foreground/80">
                <Calendar className="h-3 w-3" />
                Förfallodatum hos lev.:
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {dueDateFormatted || 'Ej fastställt'}
              </span>
            </div>

            {info.paymentReceivedAt && (
              <div className="flex justify-between items-center text-[11px]">
                <span>Mottagen betalning:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatDate(info.paymentReceivedAt.slice(0, 10))}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
              <span>Senast synkad:</span>
              <span>{info.lastSyncedAt ? new Date(info.lastSyncedAt).toLocaleTimeString() : 'Nyss'}</span>
            </div>
          </div>

          {onUpdateStatus && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-0 py-1">
                Testa realtidssynk (Leverantör)
              </DropdownMenuLabel>

              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => onUpdateStatus('payment_received')}
                  className="w-full text-left px-2 py-1.5 rounded-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-medium transition-colors"
                >
                  ✓ Markera mottagen
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus('booked_receivable')}
                  className="w-full text-left px-2 py-1.5 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 text-[11px] font-medium transition-colors"
                >
                  ↺ Återställ fordran
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
