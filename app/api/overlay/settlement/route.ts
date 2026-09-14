import { requireAuth } from '@/lib/auth/require-auth';
import { getErrorMessage } from '@/lib/errors/get-error-message';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) {
    return auth.error;
  }
  const { user, supabase } = auth;

  const body = await request.json().catch(() => ({}));
  const { peerId } = body;

  if (!peerId) {
    return NextResponse.json({ error: 'Missing peerId parameter' }, { status: 400 });
  }

  const { data: batchId, error } = await supabase.rpc('create_peer_settlement_batch', {
    p_tenant_id: user.id,
    p_peer_id: peerId,
  });

  if (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }

  return NextResponse.json({ success: true, batchId });
}
