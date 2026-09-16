'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, Radio, Building2, Calendar, FileText, ArrowRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { InvoiceSupplierStatusInfo, SupplierAccountingStatus } from '@/lib/invoices/supplier-status'
import { formatDate } from '@/lib/utils'

interface SupplierStatusCellProps {
  info: InvoiceSupplierStatusInfo
  onUpdateStatus?: (status: SupplierAccountingStatus, scheduledPaymentDate?: string) => void
}

export function SupplierStatusCell({ info, onUpdateStatus }: SupplierStatusCellProps) {
  if (!info.hasCounterpartyData || info.supplierStatus === 'unconnected') {
    return (
      <span className="text-[11px] text-muted-foreground/60 italic" title="Not connected in network">
        Ej ansluten
      </span>
    )
  }

  const payDateFormatted = info.scheduledPaymentDate ? formatDate(info.scheduledPaymentDate) : null
  const paidDateFormatted = info.paidAt ? formatDate(info.paidAt.slice(0, 10)) : payDateFormatted

  return (
    <div onClick={(e) => e.stopPropagation()}>
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
                <span>Förfallen hos motpart</span>
              </Badge>
            )}

            {info.supplierStatus === 'disputed' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-normal py-0.5 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <span>Bestridd av motpart</span>
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
                Motpart / Köpare:
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
                Leverantörsfaktura:
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
                Testa realtidssynk (Motpart)
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
    </div>
  )
}
