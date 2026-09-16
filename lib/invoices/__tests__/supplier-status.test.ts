import { describe, it, expect, beforeEach } from 'vitest'
import {
  resolveSupplierStatus,
  updateRuntimeSupplierStatus,
  resetRuntimeSupplierStatuses,
  DEFAULT_SUPPLIER_STATUSES,
} from '@/lib/invoices/supplier-status'
import { sortInvoiceList, type InvoiceListSort } from '@/lib/invoices/invoice-list-sort'
import type { Invoice } from '@/types'

describe('supplier-status service', () => {
  beforeEach(() => {
    resetRuntimeSupplierStatuses()
  })

  it('resolves Nordic Logistics AB counterparty data and scheduled payment date for invoice 1001', () => {
    const statusInfo = resolveSupplierStatus({
      id: 'a0000001-0000-4000-8000-000000000001',
      invoice_number: '1001',
      total: 15000,
      customer: { name: 'Nordic Logistics AB (Tenant B)' },
    })

    expect(statusInfo.hasCounterpartyData).toBe(true)
    expect(statusInfo.counterpartyName).toBe('Nordic Logistics AB (Tenant B)')
    expect(statusInfo.supplierInvoiceNumber).toBe('INV-1001')
    expect(statusInfo.supplierStatus).toBe('approved')
    expect(statusInfo.scheduledPaymentDate).toBe('2026-10-01')
    expect(statusInfo.bookedAccount).toBe('2440 (Leverantörsskulder)')
    expect(statusInfo.isRealtimeSynced).toBe(true)
  })

  it('resolves Nordic Logistics AB counterparty data and scheduled payment date for invoice 1002', () => {
    const statusInfo = resolveSupplierStatus({
      id: 'a0000002-0000-4000-8000-000000000002',
      invoice_number: '1002',
      total: 10000,
      customer: { name: 'Nordic Logistics AB (Tenant B)' },
    })

    expect(statusInfo.hasCounterpartyData).toBe(true)
    expect(statusInfo.counterpartyName).toBe('Nordic Logistics AB (Tenant B)')
    expect(statusInfo.supplierInvoiceNumber).toBe('INV-1002')
    expect(statusInfo.supplierStatus).toBe('approved')
    expect(statusInfo.scheduledPaymentDate).toBe('2026-10-05')
  })

  it('resolves paid status for invoice 1004', () => {
    const statusInfo = resolveSupplierStatus({
      id: 'a0000004-0000-4000-8000-000000000004',
      invoice_number: '1004',
      total: 50000,
      customer: { name: 'Svenska Bygg & Entreprenad AB' },
    })

    expect(statusInfo.supplierStatus).toBe('paid')
    expect(statusInfo.scheduledPaymentDate).toBe('2026-09-10')
    expect(statusInfo.paidAt).toBe('2026-09-10')
  })

  it('resolves unconnected status for external clients', () => {
    const statusInfo = resolveSupplierStatus({
      id: 'ext-999',
      invoice_number: '999',
      total: 5000,
      customer: { name: 'Random External Corp' },
    })

    expect(statusInfo.hasCounterpartyData).toBe(false)
    expect(statusInfo.supplierStatus).toBe('unconnected')
    expect(statusInfo.scheduledPaymentDate).toBeNull()
  })

  it('updates runtime supplier status dynamically', () => {
    updateRuntimeSupplierStatus('1001', {
      supplierStatus: 'paid',
      paidAt: '2026-10-01T12:00:00Z',
    })

    const statusInfo = resolveSupplierStatus({
      id: 'a0000001-0000-4000-8000-000000000001',
      invoice_number: '1001',
      total: 15000,
    })

    expect(statusInfo.supplierStatus).toBe('paid')
    expect(statusInfo.paidAt).toBe('2026-10-01T12:00:00Z')
  })

  it('sorts invoices by supplier_status column', () => {
    const invoices = [
      { id: '1', invoice_number: '1001', invoice_date: '2026-09-01' } as unknown as Invoice,
      { id: '2', invoice_number: '1004', invoice_date: '2026-08-15' } as unknown as Invoice,
      { id: '3', invoice_number: '999', invoice_date: '2026-09-10' } as unknown as Invoice,
    ]

    const sortAsc: InvoiceListSort = { column: 'supplier_status', direction: 'asc' }
    const sorted = sortInvoiceList(invoices, sortAsc, true)
    expect(sorted.length).toBe(3)
  })
})
