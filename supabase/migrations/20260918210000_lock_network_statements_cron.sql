-- Migration: lock_network_statements_cron
-- Automated monthly network statement freeze job scheduled for the 1st of each month at 00:00 UTC (0 0 1 * *)

-- 1. Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- 2. Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- 3. Stored procedure to lock preceding month's network statements
CREATE OR REPLACE FUNCTION public.lock_monthly_network_statements()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  preceding_month TEXT;
  peer_record RECORD;
  batch_ref TEXT;
BEGIN
  -- Calculate preceding month YYYY-MM (e.g. on 2026-10-01, resolves to '2026-09')
  preceding_month := to_char(CURRENT_DATE - INTERVAL '1 month', 'YYYY-MM');

  -- Log execution start in audit logs if audit_logs table exists
  BEGIN
    INSERT INTO public.audit_logs (
      event_type,
      action,
      entity_type,
      details,
      created_at
    ) VALUES (
      'system.cron',
      'lock_monthly_statements',
      'settlement_batch',
      jsonb_build_object('target_month', preceding_month, 'scheduled_at', NOW()),
      NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Audit log optional; continue
  END;

  -- Iterate through active network peers and ensure settlement batch records exist
  FOR peer_record IN
    SELECT p.id AS peer_id, p.tenant_id, p.peer_tenant_id
    FROM public.network_peers p
    WHERE p.status = 'active'
  LOOP
    batch_ref := 'BATCH-' || replace(preceding_month, '-', '') || '-' || substring(peer_record.tenant_id::text from 1 for 8);

    -- Insert or update batch with status 'proposed' (immutable lock placeholder)
    INSERT INTO public.settlement_batches (
      tenant_id,
      peer_id,
      batch_reference,
      total_ar_offset,
      total_ap_offset,
      net_settlement_amount,
      currency,
      status,
      created_at,
      updated_at
    ) VALUES (
      peer_record.tenant_id,
      peer_record.peer_id,
      batch_ref,
      0.00,
      0.00,
      0.00,
      'SEK',
      'proposed',
      NOW(),
      NOW()
    )
    ON CONFLICT (batch_reference) DO UPDATE
    SET updated_at = NOW();
  END LOOP;
END;
$$;

-- 4. Unschedule previous cron job if registered, then schedule for 00:00 UTC on the 1st of every month
DO $$
BEGIN
  PERFORM cron.unschedule('lock-monthly-network-statements');
EXCEPTION WHEN OTHERS THEN
  -- Ignore if not already scheduled
END;
$$;

SELECT cron.schedule(
  'lock-monthly-network-statements',
  '0 0 1 * *',
  $$SELECT public.lock_monthly_network_statements()$$
);
