import { createClient } from '@/lib/supabase/server';
import { PeerSettlementCard } from '@/components/overlay/PeerSettlementCard';

interface NetworkPeer {
  id: string;
  peer_name: string;
}

interface OverlayInvoice {
  peer_id: string;
  direction: 'outbound_ar' | 'inbound_ap';
  gross_amount: number;
  currency: string;
}

export default async function SettlementPage() {
  const supabase = await createClient();

  const { data: peers } = await supabase
    .from('network_peers')
    .select('id, peer_name')
    .eq('status', 'active');

  const { data: invoices } = await supabase
    .from('overlay_invoices')
    .select('peer_id, direction, gross_amount, currency')
    .eq('state', 'approved');

  const peerBalances = (peers || []).map((peer: NetworkPeer) => {
    const peerInvoices = (invoices || []).filter((inv: OverlayInvoice) => inv.peer_id === peer.id);
    const netAmount = peerInvoices.reduce((acc: number, inv: OverlayInvoice) => {
      return inv.direction === 'outbound_ar'
        ? acc + Number(inv.gross_amount)
        : acc - Number(inv.gross_amount);
    }, 0);

    const currency = peerInvoices[0]?.currency || 'SEK';

    return {
      ...peer,
      netAmount,
      currency,
    };
  });

  return (
    <main className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Bilateral Settlement & Netting</h1>
      <div className="grid gap-4">
        {peerBalances.map((peer) => (
          <PeerSettlementCard
            key={peer.id}
            peerId={peer.id}
            peerName={peer.peer_name}
            netAmount={peer.netAmount}
            currency={peer.currency}
          />
        ))}
      </div>
    </main>
  );
}
