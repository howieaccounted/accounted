-- Function to perform bilateral netting across open overlay invoices for a target peer

CREATE OR REPLACE FUNCTION public.create_peer_settlement_batch(
    p_tenant_id UUID,
    p_peer_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_batch_id UUID;
    v_batch_ref TEXT;
    v_total_ar NUMERIC(15, 2) := 0.00;
    v_total_ap NUMERIC(15, 2) := 0.00;
    v_net_amount NUMERIC(15, 2) := 0.00;
    v_currency VARCHAR(3) := 'SEK';
    r RECORD;
BEGIN
    v_batch_ref := 'SB-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

    -- Calculate total AR offset
    SELECT COALESCE(SUM(gross_amount), 0.00), COALESCE(MAX(currency), 'SEK')
    INTO v_total_ar, v_currency
    FROM public.overlay_invoices
    WHERE tenant_id = p_tenant_id 
      AND peer_id = p_peer_id 
      AND direction = 'outbound_ar' 
      AND state = 'approved';

    -- Calculate total AP offset
    SELECT COALESCE(SUM(gross_amount), 0.00)
    INTO v_total_ap
    FROM public.overlay_invoices
    WHERE tenant_id = p_tenant_id 
      AND peer_id = p_peer_id 
      AND direction = 'inbound_ap' 
      AND state = 'approved';

    IF v_total_ar = 0 AND v_total_ap = 0 THEN
        RAISE EXCEPTION 'No approved invoices available for settlement with peer %', p_peer_id;
    END IF;

    v_net_amount := v_total_ar - v_total_ap;

    -- Create settlement batch header
    INSERT INTO public.settlement_batches (
        tenant_id,
        peer_id,
        batch_reference,
        total_ar_offset,
        total_ap_offset,
        net_settlement_amount,
        currency,
        status
    ) VALUES (
        p_tenant_id,
        p_peer_id,
        v_batch_ref,
        v_total_ar,
        v_total_ap,
        v_net_amount,
        v_currency,
        'draft'
    ) RETURNING id INTO v_batch_id;

    -- Attach invoice items to batch
    FOR r IN 
        SELECT id, gross_amount 
        FROM public.overlay_invoices 
        WHERE tenant_id = p_tenant_id 
          AND peer_id = p_peer_id 
          AND state = 'approved'
    LOOP
        INSERT INTO public.settlement_batch_items (
            settlement_batch_id,
            overlay_invoice_id,
            applied_amount
        ) VALUES (
            v_batch_id,
            r.id,
            r.gross_amount
        );
    END LOOP;

    RETURN v_batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
