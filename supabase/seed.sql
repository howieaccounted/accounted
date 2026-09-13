DO $$
DECLARE
  v_tenant_id uuid;
BEGIN
  -- Select existing local user or create a fallback test user
  SELECT id INTO v_tenant_id FROM auth.users LIMIT 1;

  IF v_tenant_id IS NULL THEN
    v_tenant_id := '00000000-0000-0000-0000-000000000000'::uuid;
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
    ) VALUES (
      v_tenant_id,
      '00000000-0000-0000-0000-000000000000'::uuid,
      'dev@example.com',
      '$2a$10$abcdefghijklmnopqrstuu',
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Insert test network peers
  INSERT INTO public.network_peers (id, tenant_id, peer_name, peer_org_number, status)
  VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, v_tenant_id, 'Acme Corp Sweden AB', '556123-4567', 'active'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, v_tenant_id, 'Nordic Logistics AB', '556987-6543', 'active')
  ON CONFLICT (id) DO NOTHING;

  -- Insert mock AR/AP overlay invoices with issue_date and due_date
  INSERT INTO public.overlay_invoices (tenant_id, peer_id, external_reference, direction, issue_date, due_date, net_amount, gross_amount, currency, state)
  VALUES
    (v_tenant_id, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'INV-2026-001', 'outbound_ar', '2026-09-01'::date, '2026-10-01'::date, 12000.00, 15000.00, 'SEK', 'approved'),
    (v_tenant_id, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'INV-2026-002', 'inbound_ap',  '2026-09-02'::date, '2026-10-02'::date,  5200.00,  6500.00, 'SEK', 'approved'),
    (v_tenant_id, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'INV-2026-003', 'outbound_ar', '2026-09-03'::date, '2026-10-03'::date,  6400.00,  8000.00, 'SEK', 'approved'),
    (v_tenant_id, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'INV-2026-004', 'inbound_ap',  '2026-09-04'::date, '2026-10-04'::date,  9600.00, 12000.00, 'SEK', 'approved');
END $$;
