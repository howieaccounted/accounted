'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Invoice } from '@/types'
import {
  resolveSupplierStatus,
  type InvoiceSupplierStatusInfo,
  type SupplierAccountingStatus,
} from '@/lib/invoices/supplier-status'

interface UseSupplierStatusProps {
  invoices: Invoice[]
  companyId?: string | null
  onInvoiceStatusChange?: (invoiceNumber: string, status: string, paidAt?: string) => void
}

export function useSupplierStatus({
  invoices,
  companyId,
  onInvoiceStatusChange,
}: UseSupplierStatusProps) {
  const supabase = createClient()
  const [statuses, setStatuses] = useState<Record<string, InvoiceSupplierStatusInfo>>({})
  const onStatusChangeRef = useRef(onInvoiceStatusChange)
  onStatusChangeRef.current = onInvoiceStatusChange

  // Compute initial status map from invoices
  const refreshLocal = useCallback(() => {
    const map: Record<string, InvoiceSupplierStatusInfo> = {}
    for (const inv of invoices) {
      const num = inv.invoice_number ?? inv.external_invoice_number ?? inv.id
      map[num] = resolveSupplierStatus(inv)
    }
    setStatuses(map)
  }, [invoices])

  // Fetch updated statuses from API
  const fetchRemote = useCallback(async () => {
    try {
      const res = await fetch('/api/invoices/supplier-status', { cache: 'no-store' })
      if (!res.ok) return
      const json = await res.json()
      if (Array.isArray(json.data)) {
        setStatuses((prev) => {
          const next = { ...prev }
          for (const item of json.data as InvoiceSupplierStatusInfo[]) {
            next[item.invoiceNumber] = item
            if (item.supplierStatus === 'paid') {
              onStatusChangeRef.current?.(item.invoiceNumber, 'paid', item.paidAt || item.scheduledPaymentDate || undefined)
            }
          }
          return next
        })
      }
    } catch {
      // Fallback tolerated in unmigrated or offline scenarios
    }
  }, [])

  // Action to update a supplier status and broadcast to other peers
  const updateSupplierStatusAction = useCallback(
    async (
      invoiceNumber: string,
      status: SupplierAccountingStatus,
      scheduledPaymentDate?: string,
      extra?: { email?: string }
    ) => {
      // Optimistic local update
      setStatuses((prev) => {
        const existing = prev[invoiceNumber] || resolveSupplierStatus({ id: invoiceNumber, invoice_number: invoiceNumber })
        const updated: InvoiceSupplierStatusInfo = {
          ...existing,
          supplierStatus: status,
          scheduledPaymentDate: scheduledPaymentDate ?? existing.scheduledPaymentDate,
          paidAt: status === 'paid' ? new Date().toISOString() : null,
          invitedEmail: extra?.email ?? existing.invitedEmail,
          invitedAt: status === 'invited' ? new Date().toISOString() : existing.invitedAt,
          lastSyncedAt: new Date().toISOString(),
        }
        return { ...prev, [invoiceNumber]: updated }
      })

      if (status === 'paid') {
        onStatusChangeRef.current?.(invoiceNumber, 'paid', new Date().toISOString())
      }

      // Broadcast to other tabs/windows
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('accounted:supplier-status-broadcast')
          bc.postMessage({ invoiceNumber, status, scheduledPaymentDate, email: extra?.email, timestamp: Date.now() })
          bc.close()
        } catch {
          // ignore
        }
      }

      // Sync via server API
      try {
        await fetch('/api/invoices/supplier-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceNumber, status, scheduledPaymentDate, email: extra?.email }),
        })
      } catch {
        // tolerate
      }
    },
    []
  )

  useEffect(() => {
    refreshLocal()
  }, [refreshLocal])

  useEffect(() => {
    fetchRemote()

    // 1. Listen via Supabase Realtime channel
    const channel = supabase
      .channel('accounted:supplier-status-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'supplier_invoices' },
        () => {
          fetchRemote()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        () => {
          fetchRemote()
        }
      )
      .subscribe()

    // 2. Listen via BroadcastChannel for zero-latency multi-tab sync
    let bc: BroadcastChannel | null = null
    let bcNet: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('accounted:supplier-status-broadcast')
        bc.onmessage = (event) => {
          const { invoiceNumber, status, scheduledPaymentDate, email, type, drawdown } = event.data || {}
          if (type === 'drawdown' && (drawdown?.invoiceNumber || invoiceNumber)) {
            const num = drawdown?.invoiceNumber || invoiceNumber
            setStatuses((prev) => {
              const existing = prev[num] || resolveSupplierStatus({ id: num, invoice_number: num })
              return {
                ...prev,
                [num]: {
                  ...existing,
                  drawdownStatus: 'drawn',
                  drawdown: drawdown || existing.drawdown,
                  lastSyncedAt: new Date().toISOString(),
                },
              }
            })
            return
          }
          if (invoiceNumber) {
            setStatuses((prev) => {
              const existing = prev[invoiceNumber] || resolveSupplierStatus({ id: invoiceNumber, invoice_number: invoiceNumber })
              return {
                ...prev,
                [invoiceNumber]: {
                  ...existing,
                  supplierStatus: status,
                  scheduledPaymentDate: scheduledPaymentDate ?? existing.scheduledPaymentDate,
                  paidAt: status === 'paid' ? new Date().toISOString() : null,
                  invitedEmail: email ?? existing.invitedEmail,
                  invitedAt: status === 'invited' ? new Date().toISOString() : existing.invitedAt,
                  lastSyncedAt: new Date().toISOString(),
                },
              }
            })
            if (status === 'paid') {
              onStatusChangeRef.current?.(invoiceNumber, 'paid', new Date().toISOString())
            }
          }
        }

        bcNet = new BroadcastChannel('accounted:bilateral-netting')
        bcNet.onmessage = (event) => {
          if (event.data?.type === 'drawdown') {
            fetchRemote()
          }
        }
      } catch {
        // ignore
      }
    }

    // 3. Fallback background polling every 4 seconds
    const interval = setInterval(fetchRemote, 4000)

    return () => {
      clearInterval(interval)
      if (bc) bc.close()
      if (bcNet) bcNet.close()
      void supabase.removeChannel(channel)
    }
  }, [fetchRemote, supabase])

  return {
    statuses,
    updateSupplierStatusAction,
    getStatusForInvoice: (
      invoice: Omit<Partial<Invoice>, 'customer'> & {
        id: string
        customer?: { name?: string | null; email?: string | null; org_number?: string | null } | null
      }
    ): InvoiceSupplierStatusInfo => {
      const num = invoice.invoice_number ?? invoice.external_invoice_number ?? invoice.id ?? ''
      return statuses[num] || resolveSupplierStatus(invoice)
    },
  }
}
