import { describe, it, expect, beforeEach } from 'vitest'
import {
  resolveSupplierSideStatus,
  updateRuntimeSupplierSideStatus,
  resetRuntimeSupplierSideStatuses,
  DEFAULT_SUPPLIER_SIDE_STATUSES,
} from '@/lib/supplier-invoices/supplier-side-status'
import {
  sortSupplierInvoiceList,
  type SupplierInvoiceListSort,
} from '@/lib/supplier-invoices/supplier-invoice-list-sort'
import type { SupplierInvoice } from '@/types'

describe('supplier-side-status service', () => {
  beforeEach(() => {
    resetRuntimeSupplierSideStatuses()
  })

  it('resolves Nordic Logistics AB supplier AR data for invoice NL-88101', () => {
    const statusInfo = resolveSupplierSideStatus({
      id: 'a1000001-0000-4000-8000-000000000001',
      supplier_invoice_number: 'NL-88101',
      total: 20000,
      due_date: '2026-10-02',
      supplier: { name: 'Nordic Logistics AB (Tenant B)' },
    })

    expect(statusInfo.hasSupplierData).toBe(true)
    expect(statusInfo.supplierName).toBe('Nordic Logistics AB (Tenant B)')
    expect(statusInfo.supplierSideStatus).toBe('booked_receivable')
    expect(statusInfo.bookedAccount).toBe('1510 (Kundfordringar)')
    expect(statusInfo.dueDate).toBe('2026-10-02')
    expect(statusInfo.isRealtimeSynced).toBe(true)
  })

  it('resolves Nordic Logistics AB supplier AR data for invoice NL-88102', () => {
    const statusInfo = resolveSupplierSideStatus({
      id: 'a1000002-0000-4000-8000-000000000002',
      supplier_invoice_number: 'NL-88102',
      total: 9000,
      due_date: '2026-10-08',
      supplier: { name: 'Nordic Logistics AB (Tenant B)' },
    })

    expect(statusInfo.hasSupplierData).toBe(true)
    expect(statusInfo.supplierName).toBe('Nordic Logistics AB (Tenant B)')
    expect(statusInfo.supplierSideStatus).toBe('booked_receivable')
    expect(statusInfo.dueDate).toBe('2026-10-08')
  })

  it('resolves reconciled / payment received status for Telia TEL-90412 and Wihlborgs WH-10492', () => {
    const teliaInfo = resolveSupplierSideStatus({
      id: 'a1000003-0000-4000-8000-000000000003',
      supplier_invoice_number: 'TEL-90412',
      total: 4500,
      supplier: { name: 'Telia Sverige AB' },
    })
    expect(teliaInfo.supplierSideStatus).toBe('reconciled')
    expect(teliaInfo.paymentReceivedAt).toBe('2026-09-20')

    const wihlborgsInfo = resolveSupplierSideStatus({
      id: 'a1000006-0000-4000-8000-000000000006',
      supplier_invoice_number: 'WH-10492',
      total: 31250,
      supplier: { name: 'Wihlborgs Fastigheter AB' },
    })
    expect(wihlborgsInfo.supplierSideStatus).toBe('reconciled')
    expect(wihlborgsInfo.paymentReceivedAt).toBe('2026-09-28')
  })

  it('resolves Riminton AB data for Tenant B invoice 1001', () => {
    const statusInfo = resolveSupplierSideStatus({
      id: 'b0000001-0000-4000-8000-000000000001',
      supplier_invoice_number: '1001',
      total: 15000,
      due_date: '2026-10-01',
      supplier: { name: 'Riminton AB (Company A)' },
    })

    expect(statusInfo.hasSupplierData).toBe(true)
    expect(statusInfo.supplierName).toBe('Riminton AB (Company A)')
    expect(statusInfo.supplierSideStatus).toBe('booked_receivable')
    expect(statusInfo.customerInvoiceNumber).toBe('1001')
    expect(statusInfo.bookedAccount).toBe('1510 (Kundfordringar)')
  })

  it('resolves unconnected status for external unrecognized suppliers', () => {
    const statusInfo = resolveSupplierSideStatus({
      id: 'ext-999',
      supplier_invoice_number: 'UNKNOWN-999',
      total: 5000,
      supplier: { name: 'Unconnected Supplier AB' },
    })

    expect(statusInfo.hasSupplierData).toBe(false)
    expect(statusInfo.supplierSideStatus).toBe('unconnected')
    expect(statusInfo.isRealtimeSynced).toBe(false)
  })

  it('updates runtime supplier side status dynamically', () => {
    updateRuntimeSupplierSideStatus('NL-88101', {
      supplierSideStatus: 'payment_received',
      paymentReceivedAt: '2026-09-29T15:00:00Z',
    })

    const statusInfo = resolveSupplierSideStatus({
      id: 'a1000001-0000-4000-8000-000000000001',
      supplier_invoice_number: 'NL-88101',
      total: 20000,
    })

    expect(statusInfo.supplierSideStatus).toBe('payment_received')
    expect(statusInfo.paymentReceivedAt).toBe('2026-09-29T15:00:00Z')
  })

  it('sorts supplier invoices by supplier_side_status column', () => {
    const invoices = [
      { id: '1', supplier_invoice_number: 'NL-88101', invoice_date: '2026-09-02' } as unknown as SupplierInvoice,
      { id: '2', supplier_invoice_number: 'TEL-90412', invoice_date: '2026-08-25' } as unknown as SupplierInvoice,
      { id: '3', supplier_invoice_number: 'UNKNOWN-999', invoice_date: '2026-09-10' } as unknown as SupplierInvoice,
    ]

    const sortAsc: SupplierInvoiceListSort = { column: 'supplier_side_status', direction: 'asc' }
    const sortedAsc = sortSupplierInvoiceList(invoices, sortAsc)
    expect(sortedAsc.length).toBe(3)

    const sortDesc: SupplierInvoiceListSort = { column: 'supplier_side_status', direction: 'desc' }
    const sortedDesc = sortSupplierInvoiceList(invoices, sortDesc)
    expect(sortedDesc.length).toBe(3)
  })
})
