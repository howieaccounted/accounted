import { describe, it, expect, beforeEach } from 'vitest'
import {
  resolveSupplierStatus,
  updateRuntimeSupplierStatus,
  resetRuntimeSupplierStatuses,
  DEFAULT_SUPPLIER_STATUSES,
} from '@/lib/invoices/supplier-status'
import {
  resetNetworkDrawdowns,
  recordNetworkDrawdown,
  findNetworkDrawdown,
  type NetworkDrawdown,
} from '@/lib/statements/bilateral-netting'
import { sortInvoiceList, type InvoiceListSort } from '@/lib/invoices/invoice-list-sort'
import type { Invoice } from '@/types'

describe('supplier-status service', () => {
  beforeEach(() => {
    resetRuntimeSupplierStatuses()
    resetNetworkDrawdowns()
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
    expect(statusInfo.drawdownStatus).toBe('available')
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
    expect(statusInfo.drawdownStatus).toBe('available')
  })

  it('resolves paid status and drawdownStatus none for invoice 1004', () => {
    const statusInfo = resolveSupplierStatus({
      id: 'a0000004-0000-4000-8000-000000000004',
      invoice_number: '1004',
      total: 50000,
      customer: { name: 'Svenska Bygg & Entreprenad AB' },
    })

    expect(statusInfo.supplierStatus).toBe('paid')
    expect(statusInfo.scheduledPaymentDate).toBe('2026-09-10')
    expect(statusInfo.paidAt).toBe('2026-09-10')
    expect(statusInfo.drawdownStatus).toBe('none')
  })

  it('resolves unconnected status and drawdownStatus none for external clients', () => {
    const statusInfo = resolveSupplierStatus({
      id: 'ext-999',
      invoice_number: '999',
      total: 5000,
      customer: { name: 'Random External Corp' },
    })

    expect(statusInfo.hasCounterpartyData).toBe(false)
    expect(statusInfo.supplierStatus).toBe('unconnected')
    expect(statusInfo.scheduledPaymentDate).toBeNull()
    expect(statusInfo.drawdownStatus).toBe('none')
  })

  it('resolves drawdownStatus as drawn when early drawdown exists', () => {
    const sampleDrawdown: NetworkDrawdown = {
      id: 'dd-1001',
      invoiceId: 'a0000001-0000-4000-8000-000000000001',
      invoiceNumber: '1001',
      companyId: 'c0000000-0000-4000-8000-00000000000a',
      counterpartyId: 'cp-nordic-design',
      counterpartyName: 'Nordic Logistics AB',
      grossAmountSek: 15000,
      feePercent: 1.0,
      feeAmountSek: 150,
      netDisbursedSek: 14850,
      requestedAt: '2026-09-19T10:00:00Z',
      disbursedAt: '2026-09-19T10:05:00Z',
      destinationAccount: 'SEB Företagskonto (1930)',
      status: 'completed',
      statementMonth: '2026-09',
      reference: 'DD-202609-1001',
    }

    recordNetworkDrawdown(sampleDrawdown)

    const statusInfo = resolveSupplierStatus({
      id: 'a0000001-0000-4000-8000-000000000001',
      invoice_number: '1001',
      total: 15000,
      customer: { name: 'Nordic Logistics AB (Tenant B)' },
    })

    expect(statusInfo.drawdownStatus).toBe('drawn')
    expect(statusInfo.drawdown).toBeDefined()
    expect(statusInfo.drawdown?.reference).toBe('DD-202609-1001')
  })

  it('extracts customer email and supports invited status for unconnected invoices', () => {
    const statusInfo = resolveSupplierStatus({
      id: 'ext-1003',
      invoice_number: '1003',
      total: 30000,
      customer: { name: 'Acme Innovations AB', email: 'faktura@acme-innovations.se' },
    })

    expect(statusInfo.supplierStatus).toBe('unconnected')
    expect(statusInfo.counterpartyEmail).toBe('faktura@acme-innovations.se')
    expect(statusInfo.drawdownStatus).toBe('none')

    // Simulate user inviting the customer
    updateRuntimeSupplierStatus('1003', {
      supplierStatus: 'invited',
      invitedEmail: 'faktura@acme-innovations.se',
      invitedAt: '2026-09-16T22:30:00.000Z',
    })

    const invitedInfo = resolveSupplierStatus({
      id: 'ext-1003',
      invoice_number: '1003',
      total: 30000,
      customer: { name: 'Acme Innovations AB', email: 'faktura@acme-innovations.se' },
    })

    expect(invitedInfo.supplierStatus).toBe('invited')
    expect(invitedInfo.invitedEmail).toBe('faktura@acme-innovations.se')
    expect(invitedInfo.invitedAt).toBe('2026-09-16T22:30:00.000Z')
    expect(invitedInfo.drawdownStatus).toBe('none')
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
    expect(statusInfo.drawdownStatus).toBe('none')
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

