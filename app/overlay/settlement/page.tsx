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

  let peersList: NetworkPeer[] = [];
  try {
    const { data: peers } = await supabase
      .from('network_peers')
      .select('id, peer_name')
      .eq('status', 'active');
    peersList = peers || [];
  } catch {
    // Fallback below
  }

  let invoicesList: OverlayInvoice[] = [];
  try {
    const { data: invoices } = await supabase
      .from('overlay_invoices')
      .select('peer_id, direction, gross_amount, currency')
      .eq('state', 'approved');
    invoicesList = invoices || [];
  } catch {
    // Fallback below
  }

  const activePeers: NetworkPeer[] = peersList.length > 0 ? peersList : [
    { id: 'peer-nordic-logistics-ab', peer_name: 'Nordic Logistics AB (Tenant B)' },
  ];

  const activeInvoices: OverlayInvoice[] = invoicesList.length > 0 ? invoicesList : [
    { peer_id: 'peer-nordic-logistics-ab', direction: 'outbound_ar', gross_amount: 25000, currency: 'SEK' },
    { peer_id: 'peer-nordic-logistics-ab', direction: 'inbound_ap', gross_amount: 12500, currency: 'SEK' },
  ];

  const peerBalances = activePeers.map((peer: NetworkPeer) => {
    const peerInvoices = activeInvoices.filter((inv: OverlayInvoice) => inv.peer_id === peer.id);
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
