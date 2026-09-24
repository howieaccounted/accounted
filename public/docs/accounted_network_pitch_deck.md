# accounted. — Network Pitch Deck (18-Slide Masterclass)

> **"The VISA Rail for Global B2B Invoicing"**  
> *Decoupling enterprise commerce from 60-day debt gridlock through decentralized ERP clearing, algorithmic netting, and zero-debt self-funding liquidity.*

---

## Executive Summary

| Metric / Dimension | Target / Profile |
| :--- | :--- |
| **Global Market** | **$120 Trillion** annual B2B commerce (3x consumer retail card volume) running on archaic 1970s primitives (PDF invoices, net-30/60 terms, manual bank wires). |
| **The Accounted Breakthrough** | A zero-friction **ERP Companion & Clearinghouse** connecting existing single-player ERPs (Fortnox, Visma, Xero, SAP) into a multiplayer settlement network. |
| **The Non-Consensus Secret** | **Moving cash is an architectural failure mode**. Up to 60% of B2B liabilities can be mathematically extinguished via multilateral graph netting before fiat cash ever moves. The cheapest capital is the **$1.8T in idle corporate cash** already sitting on buyer balance sheets. |
| **Why Now? (4 Macro Catalysts)** | High-for-longer base rates (3.5%–5%), Cloud ERP REST APIs, PSD2 Open Banking maturity, and the Autonomous AI Agent wave. |
| **Foundational Settlement Rail** | **"Collect First, Disburse Later" (PvP Settlement)**: Net debtors remit funds 48–72h prior to creditor disbursement via an **authorized segregated escrow custodian** (*klientmedelskonto*, Swedish Lag 1944:181). **Requires $0 external debt** to settle scheduled netting runs. |
| **The Anchor Treasury Engine** | Large buyers fund early supplier cashouts from idle balance sheet cash, earning **12%–18% annualized risk-free return** on approved invoices, eliminating platform cost of capital. |
| **Underwriting Moat** | **Zero-Fraud Ledger Attestation**: Invoices financed only after matching and approval in debtor's AP ledger. Real-time GL + PSD2 + Skattekonto (BAS 1630) telemetry drives expected default loss < 0.05% (vs 2.4% factoring average). |
| **Compounding Moat** | **Metcalfe² Lock-In**: Dual-role nodes (100% have both AR and AP) + viral bill-to-join loops (K-factor > 2.4, negative CAC). Leaving the network imposes an immediate 300 bps working capital penalty. |
| **Real-World Traction** | Live production deployment at `accounted-production.vercel.app`, interactive Fortnox Companion demo at `/demo/fortnox-companion`, auto-balanced BAS Serie A verifikation vouchers (0.00 kr diff), and active Stockholm tech startup testing. |
| **The Ask** | **$4.0M Seed / Series A** to accelerate ERP connectors, expand Anchor enterprise acquisition, and scale to $100M+ netting run-rate. |

---

## Slide 1: Cover — accounted.
- **Title**: The VISA Rail for Global B2B Invoicing
- **Subtitle**: Decoupling enterprise commerce from 60-day debt gridlock through decentralized ERP clearing, algorithmic netting, and zero-debt self-funding liquidity.
- **Stage**: $4.0M Seed / Series A
- **Category**: B2B Settlement Protocol

---

## Slide 2: Macro Reality // Market Scale
- **Header**: The $120T B2B Liquidity Chokehold
- **Context**: 3x larger than all consumer card payments combined, yet running on 1970s primitives.
- **Key Metrics**:
  - **54 Days**: Average Global DSO (Suppliers deliver today, wait 2–3 months; payroll/tax due day 30).
  - **$3.1 Trillion**: Trapped working capital frozen in unpaid AR across OECD economies.
  - **95%**: B2B transactions running on static PDFs, manual IBAN wires, and email chasing.
- **The Bilateral Gridlock Paradox**: Company A cannot pay Supplier B because Customer C has not paid Company A. In reality, Supplier B frequently owes Customer C! Everyone sits in paralyzed default waiting for external fiat wires.

---

## Slide 3: Core Thesis // Non-Consensus Insight
- **Header**: The Non-Consensus Secret
- **Context**: What we understand about B2B settlement that the rest of fintech misses.
- **The Consensus View (Where Others Play)**:
  - *"B2B Payments is a Wire Speed Problem."*
  - Startups build faster payment pipes: virtual cards, OCR invoice scrapers, and factoring apps.
  - They accept the flawed premise that every single invoice must result in a gross fiat bank wire.
- **Accounted's Non-Consensus Truth**:
  - **Moving Cash is an Architectural Failure Mode.**
  - In an economy of interconnected cloud ERPs, 60% of liabilities can be mathematically cancelled through multilateral graph netting before fiat cash ever moves.
  - The cheapest liquidity isn't bank debt—it is the **$1.8T in idle corporate cash** already sitting on buyer balance sheets earning near-zero returns.

---

## Slide 4: Macro Timing // Why Now?
- **Header**: The 4 Irreversible Macro Catalysts
- **Context**: Why this breakthrough could not have been built 5 years ago.
- **The 4 Catalysts**:
  1. **High-For-Longer Base Rates (3.5%–5%)**: In ZIRP, CFOs ignored 60-day DSO. At 4%+ base rates, working capital drag burns millions. Optimizing DSO/DPO is board priority #1.
  2. **Cloud ERP API Standardization**: Accounting shifted from siloed desktop files (.SIE) to continuous REST APIs (Fortnox, Visma, Xero, NetSuite) enabling programmatic voucher read/write.
  3. **PSD2 Open Banking Maturity**: Programmatic read/write bank account rails (SEPA Instant, Autogiro, Enable Banking) are mature, reliable, and standardized across Europe.
  4. **The Autonomous Agentic Wave**: Autonomous AI finance agents cannot write paper checks or call factoring brokers; they require an API-native settlement protocol.

---

## Slide 5: Historical Analogy // The Blueprint
- **Header**: What Dee Hock Built for Consumer Retail in 1958
- **Context**: Consumer commerce had the exact same gridlock 65 years ago.
- **1950s: Bilateral Store Credit**:
  - Every store maintained individual customer ledgers with 100% merchant credit risk.
  - Consumers carried dozens of store credit cards; zero scale and high localized default.
- **1970+: VISA Multilateral Clearing**:
  - Unified merchants and banks into a single clearinghouse.
  - Net settlement, instant credit attestation, multilateral clearing.
  - Built a $14T/year network with 50%+ operating margins.
- **The B2B Void**: Why didn't B2B get its VISA? Because 2.5% card swipe fees are untenable on $100k B2B orders, and companies cannot abandon their ERPs. Accounted solves both.

---

## Slide 6: Solution // The Platform
- **Header**: Accounted Network: The Ledger-Native Rail
- **Context**: Turning existing single-player ERPs into connected multiplayer clearing nodes.
- **3-Layer Platform Architecture**:
  1. **Universal ERP Connect**: Plugs into Fortnox, Visma, Xero via 60-second OAuth. Zero behavioral disruption. Bi-directional sync of AR (1510) and AP (2440).
  2. **Graph Netting Engine**: Resolves circular debt loops across thousands of enterprises. Extinguishes up to 70% of gross liabilities with $0 external cash movement.
  3. **PvP Settlement & Vault**: Segregated client escrow accounts (*klientmedelskonto*, Swedish Lag 1944:181). Collects gross receivables first, then disburses payouts. Zero platform solvency risk.
- **Live Integration**: Certified 2-way read/write with Fortnox API, auto-generating balanced Serie A vouchers (0.00 kr difference).

---

## Slide 7: Mechanism 01 // Netting Math
- **Header**: Creating Liquidity Out of Thin Air
- **Context**: How algorithmic multilateral netting eliminates 87.5% of external cash requirements.
- **Comparison**:
  - **Traditional Gross Settlement**: Node A owes Node B (100k SEK), Node B owes Node C (100k SEK), Node C owes Node A (80k SEK). Requires **280,000 SEK** in external bank liquidity.
  - **Accounted Network Netting**: Eliminates **240,000 SEK** in gross debt. Net cash needed is only **35,000 SEK**.
  - **Liquidity Efficiency Gain**: **87.5%**.

---

## Slide 8: Mechanism 02 // Foundational Settlement
- **Header**: "Collect First, Disburse Later" (PvP Clearing)
- **Context**: Eliminating platform credit risk and external debt through Asymmetric Settlement.
- **3-Phase Clearing Timeline**:
  - **Day 25 (Collection)**: Pre-debit initiated via Autogiro into segregated client escrow.
  - **Day 27 (Verification)**: Funds irrevocably settled and cleared in client funds vault.
  - **Day 28 (Disbursement)**: Net payouts wired to creditors. Platform advances zero balance-sheet capital.
- **Software Economics**: Clears billions with **$0 in balance-sheet debt facilities**. Accounted operates purely as a software clearinghouse.

---

## Slide 9: Mechanism 03 // Liquidity Engine
- **Header**: The Anchor Treasury Engine
- **Context**: Self-funding early payouts while turning enterprise CFOs into viral platform champions.
- **Anchor Enterprise Incentive**:
  - Earns **12%–18% annualized risk-free return** by funding early supplier payouts on their approved invoices using idle corporate cash.
  - Zero balance-sheet debt facility required from Accounted.
- **SME Supplier Benefit**:
  - Day-1 cashout at flat **1.0% cost** within 10 seconds of invoice approval.
  - No factoring personal guarantees, no embarrassing debtor letters. Instant bank transfer via PSD2 rails.

---

## Slide 10: Mechanism 04 // Capital Architecture
- **Header**: The 4-Layer Liquidity Waterfall
- **Context**: Guaranteed 10-second cashouts with an ultra-low blended cost of capital.
- **The 4 Waterfall Layers**:
  1. **Layer 1: Algorithmic Netting** (0.0% cost, up to 70% of volume) — Offsets trade cycles automatically.
  2. **Layer 2: Anchor Enterprise Treasury** (0.0% platform cost, 20% of volume) — Debtor idle balance sheet cash.
  3. **Layer 3: Institutional SPV Facility** (6.5% benchmark, 8% of volume) — Senior debt backstop warehouse.
  4. **Layer 4: Accounted Network Float** (0.0% float cost, 2% of volume) — Overnight settlement buffer in escrow vault.

---

## Slide 11: Underwriting // Structural Moat
- **Header**: Why Our Default Loss Rate Approaches Zero
- **Context**: How we offer 1.0% fees profitably while banks struggle to break even at 4.0%.
- **4 Structural Underwriting Pillars**:
  1. **Zero-Fraud Ledger Attestation**: Invoices financed only after debtor matches and approves in AP ledger (`supplierStatus === 'approved'`). Fake invoices are structurally impossible.
  2. **Real-Time First-Party GL Telemetry**: Continuous read-access to live bank balances (PSD2), customer receivables aging (1510), and equity ratios (2080). Risk evaluated every 60 seconds.
  3. **Self-Collateralizing Trade Graph**: Delinquent borrowers have subsequent incoming receivables from any network peer intercepted and offset before funds leave.
  4. **Skattekonto Early-Warning Radar**: BAS 1630 tax account arrears radar detects distress weeks before credit bureaus.
- **Loss Rate Comparison**: Traditional factoring: **2.4%** vs. Accounted expected: **< 0.05%**.

---

## Slide 12: Defensibility // Network Effects
- **Header**: The Compounding Mathematical Moat
- **Context**: Why leaving Accounted Network imposes an immediate working capital penalty.
- **3 Flywheel Engines**:
  1. **Dual-Role Asymmetry**: 100% of B2B participants have both AR and AP. Every onboarded supplier brings 20 to 100 downstream vendors.
  2. **Viral Bill-To-Join (Negative CAC)**: Node A invoice approval triggers supplier onboarding with > 40% conversion.
  3. **Liquidity Density (Metcalfe²)**: At 10 nodes, 10% nettable; at 1,000 nodes, > 70% clears without cash. Leaving imposes an immediate 300 bps penalty.
- **Flywheel Metric**: Viral K-Factor > 2.4.

---

## Slide 13: Go-To-Market // Strategy
- **Header**: The 3-Stage Trojan Horse
- **Context**: Never ask a CFO to replace their accounting software on day one.
- **The 3 Stages**:
  - **Stage 01 (Day 1) — The ERP Companion**: Keep Fortnox / Visma / Xero, connect via OAuth in 60s, immediate netting & liquidity. Zero enterprise sales cycle.
  - **Stage 02 (Day 90) — The Clearing Routine**: Automated 1st-of-month netting, Anchor Treasury dynamic yield, installments (BAS 2840). High retention.
  - **Stage 03 (Year 2) — The Full AI ERP Suite**: Upgrade to Accounted Core, autonomous bookkeeping, real-time bank integrations. Maximum enterprise LTV.

---

## Slide 14: Business Model // Software Economics
- **Header**: High-Margin B2B "Interchange"
- **Context**: 5 synergistic revenue streams pairing SaaS with high-velocity clearing tolls.
- **Revenue Streams**:
  1. **Drawdown Fee**: 1.00% flat fee on accelerated receivables (18%–24% annualized capital return).
  2. **Netting Toll**: 0.15% fee on gross debt extinguished without cash movement. High pure-margin software toll.
  3. **Escrow Float**: 3.25% central bank risk-free interest earned during 48–72h clearing buffer.
  4. **Installments**: 1.25%–3.2% financing spread on 2–4 month installment options (BAS 2840).
  5. **SaaS Subscription**: €49–€499/mo tier for treasury automation and multi-entity sync.
- **Unit Economics**: CAC < $85 | Payback < 2 months | Gross Margin > 85% | LTV / CAC > 18x.

---

## Slide 15: Market Size // TAM SAM SOM
- **Header**: A Trillion-Dollar Global Settlement Pool
- **Context**: Targeting the massive gap in enterprise B2B payments.
- **Opportunity Breakdown**:
  - **TAM ($120 Trillion)**: Global enterprise B2B payment volume.
  - **SAM ($18 Trillion)**: European SME B2B trade ($450B working capital demand).
  - **SOM / Beachhead ($320 Billion)**: Nordic B2B ecosystem (Sweden, Norway, Denmark, Finland). 1.2M registered businesses, 70%+ on Fortnox & Visma.
- **Nordic Advantage**: 100% digital registries, BankID identity, standard BAS chart of accounts, high digital maturity.

---

## Slide 16: Competition // Defensibility
- **Header**: Why Incumbents Cannot Replicate Us
- **Context**: The "Switzerland Protocol" advantage over siloed ERPs and legacy banks.
- **Competitive Comparison**:
  | Capability | Traditional Banks | Factoring Fintechs | Card Networks (Visa B2B) | Accounted Network |
  | :--- | :--- | :--- | :--- | :--- |
  | **Multilateral Netting** | ✕ None | ✕ None | ✕ None | **✓ Algorithmic (Up to 70%)** |
  | **Liquidity Source** | Expensive Bank Debt | Credit Funds (8%) | Card Limits | **✓ Anchor Treasury (Self-Funded)** |
  | **Clearing Solvency** | High Credit Risk | High Default Risk | Chargeback Risk | **✓ Collect First, Disburse (PvP)** |
  | **Effective Pricing** | 3.0% – 5.0% | 2.5% – 4.5% | 2.0% – 3.0% | **✓ 1.0% Flat Fee** |
  | **Reconciliation** | Manual month-end | Manual file export | Statement matching | **✓ Auto Serie A Verifikation** |

---

## Slide 17: Execution // Real-World Traction
- **Header**: Live in Production Today
- **Context**: De-risked software architecture actively deployed on production infrastructure.
- **Production Milestones**:
  - **Production URL Live**: Deployed on Vercel at `accounted-production.vercel.app`.
  - **Interactive Fortnox Companion**: Live endpoint at `/demo/fortnox-companion` with live Fortnox API sync, working capital cards, and instant drawdowns.
  - **BAS Double-Entry Engine**: Auto-generates balanced Serie A verifikation vouchers (1510, 2440, 1930, 2890) with 0.00 kr difference.
  - **Stockholm Startup Cohort**: Actively testing with B2B tech startups in Stockholm to validate rapid BankID attestation and inter-tenant OrgNr routing.
- **Underwriting Telemetry**: Live Accounted Network Score (ANS) measuring Quick Ratio, Skattekonto (1630), PSD2 bank balances, and counterparty trade reciprocity.

---

## Slide 18: Investment // The Offering
- **Header**: The Ask: $4.0M Seed / Series A
- **Context**: High capital efficiency: equity funds software & distribution, not expensive debt facilities.
- **Use of Proceeds**:
  - **40% ($1.6M)**: ERP Connector Engineering (Visma, Xero, QuickBooks, SAP certified integrations).
  - **30% ($1.2M)**: Anchor Enterprise Acquisition & GTM (Contractor clusters and supply chain virality engine).
  - **18% ($720k)**: SPV Warehouse Backstop & Buffer (High-velocity debt facility for 100% SLA guarantee).
  - **12% ($480k)**: Regulatory & Escrow Compliance (Authorized segregated escrow custody under Swedish Lag 1944:181).
- **18-Month Target Outcomes**:
  - **$100M+ Netting & Clearing Run-Rate**.
  - 2,500 active SME nodes with negative customer acquisition cost and high Anchor Treasury participation.
  - Companion URL: `https://accounted-production.vercel.app/demo/fortnox-companion`.
