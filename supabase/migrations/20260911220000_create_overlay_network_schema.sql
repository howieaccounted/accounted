-- Migration: Create Inter-Tenant E-Invoicing Overlay Network Schema

CREATE TYPE public.network_peer_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE public.overlay_invoice_state AS ENUM ('draft', 'delivered', 'approved', 'disputed', 'cleared', 'settled');
CREATE TYPE public.settlement_batch_status AS ENUM ('draft', 'proposed', 'accepted', 'cleared', 'settled', 'failed');

-- 1. Network Peers Table
CREATE TABLE IF NOT EXISTS public.network_peers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    peer_tenant_id UUID,
    peer_org_number VARCHAR(64) NOT NULL,
    peer_name VARCHAR(255) NOT NULL,
    peer_endpoint_url TEXT,
    public_key TEXT,
    status public.network_peer_status NOT NULL DEFAULT 'pending',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_peer_org UNIQUE (tenant_id, peer_org_number)
);

-- 2. Overlay Invoices Table
CREATE TABLE IF NOT EXISTS public.overlay_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    peer_id UUID NOT NULL REFERENCES public.network_peers(id) ON DELETE RESTRICT,
    local_invoice_id UUID,
    direction VARCHAR(16) NOT NULL CHECK (direction IN ('outbound_ar', 'inbound_ap')),
    external_reference VARCHAR(128) NOT NULL,
    gross_amount NUMERIC(15, 2) NOT NULL,
    net_amount NUMERIC(15, 2) NOT NULL,
    vat_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'SEK',
    state public.overlay_invoice_state NOT NULL DEFAULT 'delivered',
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payload_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Settlement Batches Table
CREATE TABLE IF NOT EXISTS public.settlement_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    peer_id UUID NOT NULL REFERENCES public.network_peers(id) ON DELETE RESTRICT,
    batch_reference VARCHAR(64) NOT NULL UNIQUE,
    total_ar_offset NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_ap_offset NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    net_settlement_amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'SEK',
    status public.settlement_batch_status NOT NULL DEFAULT 'draft',
    cleared_voucher_id UUID,
    cleared_at TIMESTAMPTZ,
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Settlement Batch Items
CREATE TABLE IF NOT EXISTS public.settlement_batch_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_batch_id UUID NOT NULL REFERENCES public.settlement_batches(id) ON DELETE CASCADE,
    overlay_invoice_id UUID NOT NULL REFERENCES public.overlay_invoices(id) ON DELETE RESTRICT,
    applied_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_batch_invoice UNIQUE (settlement_batch_id, overlay_invoice_id)
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_network_peers_tenant ON public.network_peers(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_overlay_invoices_lookup ON public.overlay_invoices(tenant_id, peer_id, state);
CREATE INDEX IF NOT EXISTS idx_settlement_batches_tenant ON public.settlement_batches(tenant_id, peer_id, status);

-- 6. Updated At Triggers
CREATE OR REPLACE FUNCTION public.set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_network_peers_updated_at
    BEFORE UPDATE ON public.network_peers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

CREATE TRIGGER trg_overlay_invoices_updated_at
    BEFORE UPDATE ON public.overlay_invoices
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

CREATE TRIGGER trg_settlement_batches_updated_at
    BEFORE UPDATE ON public.settlement_batches
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

-- 7. Row Level Security Configuration
ALTER TABLE public.network_peers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overlay_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_batch_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_network_peers ON public.network_peers
    FOR ALL USING (tenant_id = (SELECT auth.uid()));

CREATE POLICY tenant_isolation_overlay_invoices ON public.overlay_invoices
    FOR ALL USING (tenant_id = (SELECT auth.uid()));

CREATE POLICY tenant_isolation_settlement_batches ON public.settlement_batches
    FOR ALL USING (tenant_id = (SELECT auth.uid()));

CREATE POLICY tenant_isolation_settlement_batch_items ON public.settlement_batch_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.settlement_batches b 
            WHERE b.id = settlement_batch_id AND b.tenant_id = (SELECT auth.uid())
        )
    );
