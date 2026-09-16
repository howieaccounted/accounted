'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupplierInvoice } from '@/types'
import {
  resolveSupplierSideStatus,
  type SupplierSideStatusInfo,
  type SupplierSideAccountingStatus,
} from '@/lib/supplier-invoices/supplier-side-status'

interface UseSupplierSideStatusProps {
  invoices: SupplierInvoice[]
  companyId?: string | null
  onInvoiceStatusChange?: (invoiceNumber: string, status: string, paidAt?: string) => void
}

export function useSupplierSideStatus({
  invoices,
  companyId,
  onInvoiceStatusChange,
}: UseSupplierSideStatusProps) {
  const supabase = createClient()
  const [statuses, setStatuses] = useState<Record<string, SupplierSideStatusInfo>>({})
  const onStatusChangeRef = useRef(onInvoiceStatusChange)
  onStatusChangeRef.current = onInvoiceStatusChange

  // Compute initial status map from supplier invoices
  const refreshLocal = useCallback(() => {
    const map: Record<string, SupplierSideStatusInfo> = {}
    for (const inv of invoices) {
      const num = inv.supplier_invoice_number || inv.id
      map[num] = resolveSupplierSideStatus(inv)
    }
    setStatuses(map)
  }, [invoices])

  // Fetch updated statuses from API
  const fetchRemote = useCallback(async () => {
    try {
      const res = await fetch('/api/supplier-invoices/supplier-side-status', { cache: 'no-store' })
      if (!res.ok) return
      const json = await res.json()
      if (Array.isArray(json.data)) {
        setStatuses((prev) => {
          const next = { ...prev }
          for (const item of json.data as SupplierSideStatusInfo[]) {
            next[item.supplierInvoiceNumber] = item
            if (item.supplierSideStatus === 'payment_received' || item.supplierSideStatus === 'reconciled') {
              onStatusChangeRef.current?.(
                item.supplierInvoiceNumber,
                'paid',
                item.paymentReceivedAt || undefined
              )
            }
          }
          return next
        })
      }
    } catch {
      // Fallback tolerated in offline or local dev scenarios
    }
  }, [])

  // Action to update a supplier-side status and broadcast to other peers
  const updateSupplierSideStatusAction = useCallback(
    async (
      invoiceNumber: string,
      status: SupplierSideAccountingStatus,
      paymentReceivedAt?: string
    ) => {
      // Optimistic local update
      setStatuses((prev) => {
        const existing =
          prev[invoiceNumber] ||
          resolveSupplierSideStatus({ id: invoiceNumber, supplier_invoice_number: invoiceNumber })
        const updated: SupplierSideStatusInfo = {
          ...existing,
          supplierSideStatus: status,
          paymentReceivedAt:
            status === 'payment_received' || status === 'reconciled'
              ? paymentReceivedAt || new Date().toISOString()
              : null,
          lastSyncedAt: new Date().toISOString(),
        }
        return { ...prev, [invoiceNumber]: updated }
      })

      if (status === 'payment_received' || status === 'reconciled') {
        onStatusChangeRef.current?.(invoiceNumber, 'paid', new Date().toISOString())
      }

      // Broadcast to other tabs/windows
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('accounted:supplier-side-broadcast')
          bc.postMessage({ invoiceNumber, status, paymentReceivedAt, timestamp: Date.now() })
          bc.close()
        } catch {
          // ignore
        }
      }

      // Sync via server API
      try {
        await fetch('/api/supplier-invoices/supplier-side-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceNumber, status, paymentReceivedAt }),
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
      .channel('accounted:supplier-side-sync')
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
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('accounted:supplier-side-broadcast')
        bc.onmessage = (event) => {
          const { invoiceNumber, status, paymentReceivedAt } = event.data || {}
          if (invoiceNumber) {
            setStatuses((prev) => {
              const existing =
                prev[invoiceNumber] ||
                resolveSupplierSideStatus({ id: invoiceNumber, supplier_invoice_number: invoiceNumber })
              return {
                ...prev,
                [invoiceNumber]: {
                  ...existing,
                  supplierSideStatus: status,
                  paymentReceivedAt:
                    status === 'payment_received' || status === 'reconciled'
                      ? paymentReceivedAt || new Date().toISOString()
                      : null,
                  lastSyncedAt: new Date().toISOString(),
                },
              }
            })
            if (status === 'payment_received' || status === 'reconciled') {
              onStatusChangeRef.current?.(invoiceNumber, 'paid', new Date().toISOString())
            }
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
      void supabase.removeChannel(channel)
    }
  }, [fetchRemote, supabase])

  return {
    statuses,
    updateSupplierSideStatusAction,
    getStatusForInvoice: (
      invoice: Omit<Partial<SupplierInvoice>, 'supplier'> & {
        id: string
        supplier_invoice_number?: string | null
        supplier?: { name?: string | null; org_number?: string | null } | null
      }
    ): SupplierSideStatusInfo => {
      const num = invoice.supplier_invoice_number || invoice.id || ''
      return statuses[num] || resolveSupplierSideStatus(invoice)
    },
  }
}
