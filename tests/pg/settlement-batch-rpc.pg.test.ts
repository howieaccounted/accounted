import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { getPool, withUserContext } from './setup'
import { seedCompany, insertAuthUser } from './fixtures'

async function insertPeer(companyId: string, userId: string, peerName: string): Promise<string> {
  const id = randomUUID()
  await getPool().query(
    `INSERT INTO public.network_peers (id, tenant_id, peer_org_number, peer_name, status)
     VALUES ($1, $2, $3, $4, 'active')`,
    [id, companyId, `556677-${Math.floor(Math.random() * 1000)}`, peerName],
  )
  return id
}

async function insertInvoice(
  companyId: string,
  peerId: string,
  direction: 'outbound_ar' | 'inbound_ap',
  amount: number,
): Promise<string> {
  const id = randomUUID()
  await getPool().query(
    `INSERT INTO public.overlay_invoices
       (id, tenant_id, peer_id, direction, external_reference, gross_amount, net_amount, issue_date, due_date, state)
     VALUES ($1, $2, $3, $4, $5, $6, $6, '2026-09-01', '2026-09-30', 'approved')`,
    [id, companyId, peerId, direction, `INV-${id.slice(0, 8)}`, amount],
  )
  return id
}

describe('create_peer_settlement_batch RPC', () => {
  it('creates a settlement batch with net amount', async () => {
    const ctx = await seedCompany()
    const peerId = await insertPeer(ctx.companyId, ctx.userId, 'Test Peer')
    await insertInvoice(ctx.companyId, peerId, 'outbound_ar', 1000)
    await insertInvoice(ctx.companyId, peerId, 'inbound_ap', 400)

    const batchId = await withUserContext(ctx.userId, async (client) => {
      const { rows } = await client.query(
        'SELECT public.create_peer_settlement_batch($1, $2) AS batch_id',
        [ctx.companyId, peerId],
      )
      return rows[0].batch_id
    })

    const { rows } = await getPool().query(
      'SELECT net_settlement_amount, total_ar_offset, total_ap_offset FROM public.settlement_batches WHERE id = $1',
      [batchId],
    )
    expect(Number(rows[0].net_settlement_amount)).toBe(600)
    expect(Number(rows[0].total_ar_offset)).toBe(1000)
    expect(Number(rows[0].total_ap_offset)).toBe(400)

    const { rows: items } = await getPool().query(
      'SELECT count(*) as cnt FROM public.settlement_batch_items WHERE settlement_batch_id = $1',
      [batchId],
    )
    expect(Number(items[0].cnt)).toBe(2)
  })

  it('fails if no invoices are approved', async () => {
    const ctx = await seedCompany()
    const peerId = await insertPeer(ctx.companyId, ctx.userId, 'Test Peer')
    // No invoices inserted

    await expect(
      withUserContext(ctx.userId, (client) =>
        client.query('SELECT public.create_peer_settlement_batch($1, $2)', [ctx.companyId, peerId]),
      ),
    ).rejects.toThrow(/No approved invoices available/)
  })

  it('isolates batches to tenant', async () => {
    const ctx = await seedCompany()
    const stranger = await seedCompany()
    const peerId = await insertPeer(ctx.companyId, ctx.userId, 'Test Peer')
    await insertInvoice(ctx.companyId, peerId, 'outbound_ar', 1000)

    // Should fail for stranger
    await expect(
      withUserContext(stranger.userId, (client) =>
        client.query('SELECT public.create_peer_settlement_batch($1, $2)', [stranger.companyId, peerId]),
      ),
    ).rejects.toThrow(/violates foreign key constraint/)
  })
})
