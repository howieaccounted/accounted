'use client';

import { useState } from 'react';

interface PeerSettlementCardProps {
  peerId: string;
  peerName: string;
  netAmount: number;
  currency: string;
}

export function PeerSettlementCard({
  peerId,
  peerName,
  netAmount,
  currency,
}: PeerSettlementCardProps) {
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSettlement() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/overlay/settlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to trigger settlement');

      setBatchId(data.batchId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{peerName}</h3>
          <p className="text-sm text-neutral-400">
            Net Position:{' '}
            <span className={netAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {netAmount >= 0 ? `+${netAmount}` : netAmount} {currency}
            </span>
          </p>
        </div>

        <button
          onClick={handleSettlement}
          disabled={loading || !!batchId}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : batchId ? 'Batch Initialized' : 'Net & Settle'}
        </button>
      </div>

      {batchId && (
        <p className="mt-3 text-xs text-emerald-400">
          Created settlement batch: <code className="font-mono">{batchId}</code>
        </p>
      )}

      {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
