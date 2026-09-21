'use client'

import React, { useState } from 'react'
import {
  Zap,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  FileSpreadsheet,
  ArrowDownLeft,
  X,
} from 'lucide-react'

export default function FortnoxCompanionDemoPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'vouchers' | 'installments'>('invoices')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncNotice, setSyncNotice] = useState('Fortnox API aktivt • Senaste synk nyss')
  const [selectedInvoice, setSelectedInvoice] = useState<{
    id: string
    number: string
    customer: string
    orgNr: string
    amount: number
    advanceAmount: number
    fee: number
    net: number
  } | null>(null)
  const [drawnInvoices, setDrawnInvoices] = useState<string[]>([])
  const [showToast, setShowToast] = useState<string | null>(null)

  const handleSync = () => {
    setIsSyncing(true)
    setSyncNotice('Hämtar öppna kund- och leverantörsfakturor från Fortnox…')
    setTimeout(() => {
      setIsSyncing(false)
      setSyncNotice('Synk slutförd: 3 kundfakturor & 1 lev-faktura uppdaterade')
      setShowToast('Fortnox-fakturor uppdaterade!')
      setTimeout(() => setShowToast(null), 3000)
    }, 1200)
  }

  const handleDrawdownConfirm = () => {
    if (!selectedInvoice) return
    const id = selectedInvoice.id
    setDrawnInvoices((prev) => [...prev, id])
    const payoutStr = selectedInvoice.net.toLocaleString('sv-SE')
    setSelectedInvoice(null)
    setShowToast(`⚡ Uttag bekräftat! ${payoutStr} SEK skickas till SEB Företagskonto. Verifikation genereras i Fortnox.`)
    setTimeout(() => setShowToast(null), 4500)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Shareable Demo Banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-300">Offentlig Demo-länk:</span>
            <span className="text-slate-300">Accounted Network i &ldquo;Fortnox Companion Mode&rdquo;</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono text-[11px] bg-slate-900 px-2.5 py-1 rounded-sm border border-slate-800">
              Krona Bygg AB (556999-4321)
            </span>
          </div>
        </div>

        {/* Top App Header */}
        <header className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-xl backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white">Accounted Network</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Fortnox Companion
                </span>
              </div>
              <p className="text-xs text-slate-400">Likviditets- & Bilateralt Kvittningslager för Fortnox</p>
            </div>
          </div>

          {/* Fortnox Connection Status Pill */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-xs">
              <div className="h-6 w-6 rounded-sm bg-emerald-700 text-white font-black text-[11px] flex items-center justify-center shadow-inner">
                FN
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <span>Ansluten till Fortnox</span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{syncNotice}</div>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synkar…' : 'Synka nu'}</span>
            </button>
          </div>
        </header>

        {/* Explainability Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 rounded-lg p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-slate-200 text-sm">
              Ni fortsätter bokföra i Fortnox som vanligt.
            </div>
            <p className="text-slate-400 leading-relaxed">
              Accounted fungerar som en direkt likviditetsbrygga ovanpå ert befintliga Fortnox. Kundfakturor och leverantörsskulder hämtas automatiskt, och alla förskottsuttag eller kvittningar återspeglas direkt som färdiga, balanserade verifikationer i er vanliga Fortnox-huvudbok (Serie A).
            </p>
          </div>
        </div>

        {/* 3 Core Financial Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1: Verified Instant Drawdown */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-lg p-5 shadow-lg relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                Tillgängligt att ta ut direkt
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/20">
                2 Fortnox-fakturor
              </span>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold tracking-tight text-white">
                175 750 <span className="text-sm font-sans font-normal text-slate-400">SEK</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">95% förskott på attesterade kundfordringar i Fortnox (1% avgift)</p>
            </div>
            <button
              onClick={() => {
                setSelectedInvoice({
                  id: 'batch',
                  number: 'Samtliga attesterade fakturor',
                  customer: 'Skanska Sverige & Peab Bygg',
                  orgNr: 'Kombinerat underlag',
                  amount: 185000,
                  advanceAmount: 175750,
                  fee: 1757.5,
                  net: 173992.5,
                })
              }}
              className="w-full py-2.5 px-3 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <Zap className="w-4 h-4" />
              Ta ut 173 992,50 SEK till bankkonto
            </button>
          </div>

          {/* Card 2: Automatic Netting Savings */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4 text-teal-400" />
                Automatiskt kvittat
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                Sep 2026
              </span>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold tracking-tight text-teal-400">
                45 000 <span className="text-sm font-sans font-normal text-slate-400">SEK</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Leverantörsskulder kvittade mot inkommande kundfakturor</p>
            </div>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Sparat 45 000 kr i onödiga banköverföringar</span>
            </div>
          </div>

          {/* Card 3: Net Statement Settlement / Delbetalning */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-400" />
                Netto att reglera 1 okt
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
                Delbetala aktivt
              </span>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold tracking-tight text-white">
                −8 500 <span className="text-sm font-sans font-normal text-slate-400">SEK</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Nettosaldo efter bilateral kvittning i nätverket</p>
            </div>
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-purple-400 font-medium">Eller delbetala: 2 833 kr/mån</span>
              <button
                onClick={() => setActiveTab('installments')}
                className="text-slate-300 hover:text-white underline underline-offset-2 transition"
              >
                Välj plan &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Tabbed Navigation Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
          <div className="border-b border-slate-800 px-6 pt-4 flex gap-6 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === 'invoices'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Synkade Fakturor & Uttag</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">4</span>
            </button>
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === 'vouchers'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Fortnox Verifikationsbrygga (Serie A)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">Autosynk</span>
            </button>
            <button
              onClick={() => setActiveTab('installments')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition ${
                activeTab === 'installments'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Delbetalningsplan (BAS 2840)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-400 text-[10px]">Flex</span>
            </button>
          </div>

          {/* TAB 1: INVOICES & DRAWDOWN */}
          {activeTab === 'invoices' && (
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">Fortnox Kundfakturor (Fordringar)</h3>
                    <p className="text-xs text-slate-400">
                      Hämtade via Fortnox API och matchade med verifierade nätverksköpare.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Konto 1510 i Fortnox</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Fakturanr</th>
                        <th className="py-3 px-4">Kund</th>
                        <th className="py-3 px-4">Förfallodag</th>
                        <th className="py-3 px-4">Belopp</th>
                        <th className="py-3 px-4">Fortnox Status</th>
                        <th className="py-3 px-4">Nätverksåtgärd</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {/* Invoice 1042 */}
                      <tr className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-medium">#1042</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">Skanska Sverige AB</div>
                          <div className="text-[10px] text-slate-400 font-mono">Org.nr: 556000-4615</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">2026-10-28 (37 dgr)</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">125 000 kr</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            Attesterad i Fortnox
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {drawnInvoices.includes('1042') ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Uttagen (118 750 kr)
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedInvoice({
                                  id: '1042',
                                  number: '#1042',
                                  customer: 'Skanska Sverige AB',
                                  orgNr: '556000-4615',
                                  amount: 125000,
                                  advanceAmount: 118750,
                                  fee: 1187.5,
                                  net: 117562.5,
                                })
                              }}
                              className="px-2.5 py-1 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow transition"
                            >
                              <Zap className="w-3 h-3" />
                              Ta ut 118 750 kr
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Invoice 1043 */}
                      <tr className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-medium">#1043</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">Peab Bygg AB</div>
                          <div className="text-[10px] text-slate-400 font-mono">Org.nr: 556273-2072</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">2026-11-15 (55 dgr)</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">60 000 kr</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            Attesterad i Fortnox
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {drawnInvoices.includes('1043') ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Uttagen (57 000 kr)
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedInvoice({
                                  id: '1043',
                                  number: '#1043',
                                  customer: 'Peab Bygg AB',
                                  orgNr: '556273-2072',
                                  amount: 60000,
                                  advanceAmount: 57000,
                                  fee: 570,
                                  net: 56430,
                                })
                              }}
                              className="px-2.5 py-1 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow transition"
                            >
                              <Zap className="w-3 h-3" />
                              Ta ut 57 000 kr
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Invoice 1044 (Unverified) */}
                      <tr className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-medium">#1044</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">JM Entreprenad AB</div>
                          <div className="text-[10px] text-slate-400 font-mono">Org.nr: 556587-9995</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">2026-11-30 (70 dgr)</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">90 000 kr</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                            Oattesterad
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setShowToast('Snabbattest-förfrågan skickad till ekonomi@jmentreprenad.se!')
                              setTimeout(() => setShowToast(null), 3000)
                            }}
                            className="px-2.5 py-1 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] border border-slate-700 transition"
                          >
                            Begär snabbattest
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Supplier Invoices Being Netted */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">Fortnox Leverantörsfakturor (Kvittas automatiskt)</h3>
                    <p className="text-xs text-slate-400">
                      Skulder som kvittas direkt mot kundfordringar den 1:a i månaden.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Konto 2440 i Fortnox</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Fakturanr</th>
                        <th className="py-3 px-4">Leverantör</th>
                        <th className="py-3 px-4">Förfallodag</th>
                        <th className="py-3 px-4">Belopp</th>
                        <th className="py-3 px-4">Kvittningsstatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      <tr className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-medium">#LF-8891</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">Ahlsell Sverige AB</div>
                          <div className="text-[10px] text-slate-400 font-mono">Org.nr: 556012-9206</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">2026-10-15</td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-400">−45 000 kr</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 text-[10px] font-medium border border-teal-500/20">
                            ⚖️ Kvittas mot Skanska-fordran (0 kr bankutflöde)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FORTNOX VOUCHER BRIDGE */}
          {activeTab === 'vouchers' && (
            <div className="p-6 space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                      Automatisk Återsynkning till Fortnox
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 font-mono">
                      Fortnox API v3
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Bokförs i Fortnox Serie A</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  När ett förskottsuttag eller en månadskvittning görs genererar Accounted en balanserad svensk BAS-verifikation och postar den direkt till ert Fortnox via API. Era konton <strong className="text-white">1510</strong>, <strong className="text-white">2440</strong>, <strong className="text-white">2890</strong> och <strong className="text-white">1930</strong> stäms av automatiskt utan manuell inmatning.
                </p>
              </div>

              {/* Fortnox Voucher Table */}
              <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden font-mono text-xs">
                <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">Verifikation: A 108</span>
                    <span className="text-slate-400 text-[11px]">Bokföringsdatum: 2026-10-01</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                    ● Redo att postas till Fortnox
                  </span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-[11px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Konto</th>
                      <th className="py-2.5 px-4">Kontonamn</th>
                      <th className="py-2.5 px-4 text-right">Debet</th>
                      <th className="py-2.5 px-4 text-right">Kredit</th>
                      <th className="py-2.5 px-4">Beskrivning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    <tr>
                      <td className="py-2 px-4 font-bold text-white">2440</td>
                      <td className="py-2 px-4">Leverantörsskulder</td>
                      <td className="py-2 px-4 text-right text-emerald-400">45 000,00 kr</td>
                      <td className="py-2 px-4 text-right text-slate-500">0,00 kr</td>
                      <td className="py-2 px-4 text-slate-400">Kvittad lev-faktura Ahlsell (#LF-8891)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-bold text-white">1510</td>
                      <td className="py-2 px-4">Kundfordringar</td>
                      <td className="py-2 px-4 text-right text-slate-500">0,00 kr</td>
                      <td className="py-2 px-4 text-right text-rose-400">45 000,00 kr</td>
                      <td className="py-2 px-4 text-slate-400">Avräknad kundfaktura Skanska (#1042)</td>
                    </tr>
                    <tr className="bg-slate-900/30">
                      <td className="py-2 px-4 font-bold text-white">1930</td>
                      <td className="py-2 px-4">Företagskonto (SEB)</td>
                      <td className="py-2 px-4 text-right text-emerald-400">118 750,00 kr</td>
                      <td className="py-2 px-4 text-right text-slate-500">0,00 kr</td>
                      <td className="py-2 px-4 text-slate-400">Inbetalt förtida uttag från Accounted</td>
                    </tr>
                    <tr className="bg-slate-900/30">
                      <td className="py-2 px-4 font-bold text-white">6570</td>
                      <td className="py-2 px-4">Bank- och finansieringsavgifter</td>
                      <td className="py-2 px-4 text-right text-emerald-400">1 187,50 kr</td>
                      <td className="py-2 px-4 text-right text-slate-500">0,00 kr</td>
                      <td className="py-2 px-4 text-slate-400">Nätverksavgift förtida uttag (1,0%)</td>
                    </tr>
                    <tr className="bg-slate-900/30">
                      <td className="py-2 px-4 font-bold text-white">2890</td>
                      <td className="py-2 px-4">Övriga kortfr. skulder (Accounted)</td>
                      <td className="py-2 px-4 text-right text-slate-500">0,00 kr</td>
                      <td className="py-2 px-4 text-right text-rose-400">119 937,50 kr</td>
                      <td className="py-2 px-4 text-slate-400">Regleras mot slutavräkning på 1 okt</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-900 font-bold border-t border-slate-800 text-white">
                    <tr>
                      <td colSpan={2} className="py-2 px-4">Summa (Balanserad: 0,00 kr diff)</td>
                      <td className="py-2 px-4 text-right text-emerald-400">164 937,50 kr</td>
                      <td className="py-2 px-4 text-right text-rose-400">164 937,50 kr</td>
                      <td className="py-2 px-4 text-emerald-400">✓ Redo för Fortnox API</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowToast('Verifikation A 108 skickad och bekräftad i Fortnox API!')
                    setTimeout(() => setShowToast(null), 3500)
                  }}
                  className="px-4 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Posta verifikation till Fortnox nu
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INSTALLMENTS */}
          {activeTab === 'installments' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white">Delbetalning av månadssaldo (BAS 2840)</h3>
                <p className="text-xs text-slate-400">
                  Dela upp nätverkssaldot över 2, 3 eller 4 månader istället för en klumpsumma på förfallodagen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 cursor-pointer transition">
                  <div className="text-xs text-slate-400 font-medium">2 Månader (1.25% avgift)</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">4 303 kr/mån</div>
                  <div className="text-[10px] text-slate-500 mt-1">Total avgift: 106 kr</div>
                </div>
                <div className="p-4 rounded-lg border-2 border-purple-500/80 bg-purple-950/20 cursor-pointer shadow-lg relative">
                  <span className="absolute -top-2.5 right-3 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white">
                    Rekommenderad
                  </span>
                  <div className="text-xs text-purple-300 font-medium">3 Månader (2.25% avgift)</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">2 897 kr/mån</div>
                  <div className="text-[10px] text-purple-400/80 mt-1">Total avgift: 191 kr</div>
                </div>
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 cursor-pointer transition">
                  <div className="text-xs text-slate-400 font-medium">4 Månader (3.20% avgift)</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">2 193 kr/mån</div>
                  <div className="text-[10px] text-slate-500 mt-1">Total avgift: 272 kr</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white">Hur bokförs delbetalningen i Fortnox?</div>
                <p className="text-slate-400 leading-relaxed">
                  Vid aktivering bokförs nettoskulden automatiskt om från <strong className="text-white">2440 Leverantörsskulder</strong> till <strong className="text-white">2840 Delbetalning Accounted Network</strong>. De månatliga Autogiro-dragningarna debiterar sedan konto 2840 och krediterar företagskontot (1930) med 0 kr i manuellt arbete.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Drawdown Confirmation Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <h3 className="text-sm font-bold text-white">Bekräfta direkt utbetalning</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Underlag från Fortnox:</span>
                <span className="font-medium text-white">{selectedInvoice.number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Kund:</span>
                <span className="font-medium text-white">{selectedInvoice.customer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Fakturans totalbelopp:</span>
                <span className="font-mono text-white">{selectedInvoice.amount.toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Förskottsbelopp (95%):</span>
                <span className="font-mono font-bold text-white">{selectedInvoice.advanceAmount.toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Nätverksavgift (1,0%):</span>
                <span className="font-mono text-slate-400">{selectedInvoice.fee.toLocaleString('sv-SE', { minimumFractionDigits: 2 })} SEK</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Till bankkonto:</span>
                <span className="font-mono font-medium text-emerald-400">SEB Företagskonto 1930 (Bg 5050-1055)</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-white">
                <span>Utbetalas direkt:</span>
                <span className="font-mono text-emerald-400 text-base">
                  {selectedInvoice.net.toLocaleString('sv-SE', { minimumFractionDigits: 2 })} SEK
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              💡 Verifikation genereras automatiskt och postas direkt till ert Fortnox med serie A. Pengarna finns på ert SEB-konto inom 15 minuter.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-2 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
              >
                Avbryt
              </button>
              <button
                onClick={handleDrawdownConfirm}
                className="px-4 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition"
              >
                Bekräfta & Ta ut pengar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

    </div>
  )
}
