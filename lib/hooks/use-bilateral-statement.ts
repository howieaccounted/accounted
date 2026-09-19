'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  computeMonthlyStatement,
  getConnectedCounterparties,
  settleStatement,
  unsettleStatement,
  type MonthlyNettingStatement,
  type BilateralCounterparty,
} from '@/lib/statements/bilateral-netting'

interface UseBilateralStatementProps {
  initialCompanyId?: string | null
  initialMonth?: string
  initialCounterpartyId?: string
}

export function useBilateralStatement({
  initialCompanyId,
  initialMonth = '2026-09',
  initialCounterpartyId,
}: UseBilateralStatementProps = {}) {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth)
  const counterparties = getConnectedCounterparties(initialCompanyId)
  const [selectedCounterpartyId, setSelectedCounterpartyId] = useState<string>(
    initialCounterpartyId || 'all'
  )
  const [statement, setStatement] = useState<MonthlyNettingStatement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const activeCid = initialCompanyId || null

  // Compute or fetch statement data
  const refreshStatement = useCallback(async () => {
    setIsLoading(true)
    try {
      const query = new URLSearchParams({
        month: selectedMonth,
        counterparty_id: selectedCounterpartyId,
      })
      const res = await fetch(`/api/statements/bilateral?${query.toString()}`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const json = await res.json()
        if (json?.data) {
          setStatement(json.data as MonthlyNettingStatement)
          setIsLoading(false)
          return
        }
      }
    } catch {
      // Local fallback in offline or initial render
    }

    // Local fallback computation
    const localStatement = computeMonthlyStatement({
      activeCompanyId: activeCid,
      counterpartyId: selectedCounterpartyId,
      month: selectedMonth,
    })
    setStatement(localStatement)
    setIsLoading(false)
  }, [activeCid, selectedMonth, selectedCounterpartyId])

  useEffect(() => {
    refreshStatement()
  }, [refreshStatement])

  // BroadcastChannel listener for multi-tab sync
  useEffect(() => {
    let bc: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('accounted:bilateral-netting')
        bc.onmessage = (event) => {
          const { month, action } = event.data || {}
          if ((action === 'settle' || action === 'unsettle') && month === selectedMonth) {
            refreshStatement()
          }
        }
      } catch {
        // ignore
      }
    }

    return () => {
      if (bc) bc.close()
    }
  }, [selectedMonth, refreshStatement])

  // Settlement action
  const settleStatementAction = useCallback(
    async (options?: { reference?: string; notes?: string }) => {
      // Optimistic update
      const localSettled = settleStatement(
        activeCid || 'c0000000-0000-4000-8000-00000000000a',
        selectedCounterpartyId,
        selectedMonth,
        options
      )
      setStatement(localSettled)

      // Broadcast to other tabs
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('accounted:bilateral-netting')
          bc.postMessage({
            action: 'settle',
            month: selectedMonth,
            counterpartyId: selectedCounterpartyId,
            timestamp: Date.now(),
          })
          bc.close()
        } catch {
          // ignore
        }
      }

      // Sync via server API
      try {
        await fetch('/api/statements/bilateral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'settle',
            month: selectedMonth,
            counterpartyId: selectedCounterpartyId,
            reference: options?.reference,
            notes: options?.notes,
          }),
        })
      } catch {
        // tolerate
      }
    },
    [activeCid, selectedCounterpartyId, selectedMonth]
  )

  // Unsettle (Reset to Unpaid) action for demo and testing
  const unsettleStatementAction = useCallback(async () => {
    // Optimistic update
    const localOpen = unsettleStatement(
      activeCid || 'c0000000-0000-4000-8000-00000000000a',
      selectedCounterpartyId,
      selectedMonth
    )
    setStatement(localOpen)

    // Broadcast to other tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('accounted:bilateral-netting')
        bc.postMessage({
          action: 'unsettle',
          month: selectedMonth,
          counterpartyId: selectedCounterpartyId,
          timestamp: Date.now(),
        })
        bc.close()
      } catch {
        // ignore
      }
    }

    // Sync via server API
    try {
      await fetch('/api/statements/bilateral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unsettle',
          month: selectedMonth,
          counterpartyId: selectedCounterpartyId,
        }),
      })
    } catch {
      // tolerate
    }
  }, [activeCid, selectedCounterpartyId, selectedMonth])

  return {
    statement,
    counterparties,
    selectedMonth,
    setSelectedMonth,
    selectedCounterpartyId,
    setSelectedCounterpartyId,
    isLoading,
    refreshStatement,
    settleStatementAction,
    unsettleStatementAction,
  }
}
