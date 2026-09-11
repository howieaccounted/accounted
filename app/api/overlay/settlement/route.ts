import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json().catch(() => ({}));
  const { peerId } = body;

  if (!peerId) {
    return NextResponse.json({ error: 'Missing peerId parameter' }, { status: 400 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: batchId, error } = await supabase.rpc('create_peer_settlement_batch', {
    p_tenant_id: user.id,
    p_peer_id: peerId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, batchId });
}
