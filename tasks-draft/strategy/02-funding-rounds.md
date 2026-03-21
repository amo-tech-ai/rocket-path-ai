# StartupAI — Funding Rounds & Stage Assessment Strategy

> **Version:** 1.0 | **Date:** 2026-02-13
> **Status:** Strategy Document — Ready for Implementation
> **Audience:** StartupAI product team, AI agents, prompt engineers
> **Sources:** 15+ sources analyzed (see Appendix A)
> **Related:** `tasks/strategy/01-validation-strategy.md`, `tasks/strategy/strategy.md`

---

## Executive Summary

StartupAI needs to understand where a startup is in its lifecycle — not just to label it, but to provide **stage-appropriate guidance**. A pre-seed founder validating an idea needs different advice than a Series A company optimizing unit economics. This document synthesizes 15+ sources on funding stages, benchmarks, and VC processes into a strategy for how StartupAI's AI agents can automatically assess startup stage and provide funding-aware guidance.

**Core insight:** Funding stages aren't just about money — they're milestones that map to specific metrics, team sizes, product maturity, and investor expectations. By detecting these signals from what a founder has already entered into StartupAI (profile, canvas, validator report, experiments), we can infer stage and tailor every recommendation.

---

## Part 1: The Funding Landscape

### Complete Stage Reference

Synthesized from Antler, Visible.vc, Digits, Slidebean, FI.co benchmarks, Pitchwise 2026 guide, and YC startup stage framework.

#### Stage 0: Bootstrapping / Self-Funded

| Metric | Value |
|--------|-------|
| **Funding** | $0 — personal savings, revenue reinvestment |
| **Team** | 1-2 founders |
| **Product** | Idea → MVP |
| **Revenue** | $0 to early revenue |
| **Equity given** | 0% (full ownership retained) |
| **Investors** | None — self-funded |

**Characteristics:**
- Full control, no dilution, no board pressure
- Slower growth but sustainable
- 8 bootstrapping methods (Startup Grind): customer-focused marketing, in-house operations, equity leverage, small target goals, creative branding, virtual offices, payment term management, security basics
- Works best for: capital-light businesses, founders with savings/income, markets where speed-to-market isn't critical

**When to transition out:** When growth is limited by capital, not by product-market fit. If you've validated demand but can't fulfill it, it's time to raise.

---

#### Stage 1: Pre-Seed

| Metric | Value |
|--------|-------|
| **Funding** | $150K — $1M (Antler); up to $4M (FI.co) |
| **Valuation** | $3M — $12.5M post-money |
| **Team** | 1-3 people |
| **Product** | Concept → prototype → early MVP |
| **Revenue** | $0 — $25K MRR |
| **Growth** | 10-20% MoM |
| **Equity given** | 2.5-12.5% (convertible) |
| **Instrument** | SAFE / Convertible Note |
| **Investors** | Friends & family, angels, pre-seed VCs, accelerators ($20K-$150K) |

**What investors evaluate:**
- Founding team quality, determination, relevant skills
- Significant market opportunity addressing real problems
- Clear next milestone (first customers, working prototype, or validation)
- At this stage, investors bet on the **founder**, not the metrics

**Deal breakers (Slidebean):** Missing co-founder, incomplete founding team skills

**StartupAI signals:** Validator Chat completed, Lean Canvas drafted, no revenue data in profile

---

#### Stage 2: Seed

| Metric | Value |
|--------|-------|
| **Funding** | $1M — $5M (Antler); median $3.1M (Pitchwise 2026) |
| **Valuation** | $10M — $40M post-money; median $12-16M pre-money |
| **Team** | 2-10 people |
| **Product** | Launched MVP with organic growth |
| **Revenue** | $25K — $200K MRR; SaaS: $25K-$1M ARR growing 2-3x YoY |
| **Growth** | 15-30% MoM |
| **Equity given** | 15-25% (priced round) |
| **Instrument** | Priced round (typically) |
| **Investors** | Angels (larger checks), early-stage VCs |

**What investors evaluate:**
- Traction: revenue, user growth, or product-market fit signals
- Scalable growth path beyond early adopters
- Proven founding team track record
- Understanding of CAC, LTV, burn rate
- Well-articulated capital deployment plan

**Deal breakers (Slidebean):** Launched product with no traction; failed post-pre-seed execution

**2026 context (Pitchwise):** Seed landscape mirrors what Series A looked like years ago — more selective, higher traction bars. AI/ML companies attract disproportionate attention. Through Q3 2025, seed-stage startups raised ~$2.3B globally.

**StartupAI signals:** Validator report completed (score 60+), active experiments, some revenue in profile, Lean Canvas mostly filled

---

#### Stage 3: Series A

| Metric | Value |
|--------|-------|
| **Funding** | $5M — $20M; median $12M (Pitchwise 2026) |
| **Valuation** | $25M — $50M pre-money; median $47.9M (2025) |
| **Team** | 8-25 people; 2-3 experienced executives |
| **Product** | Iterated based on feedback, continuous feature development |
| **Revenue** | $200K+ MRR; $1M-$5M ARR growing 1.5-2.5x YoY |
| **Growth** | 15-25%+ MoM sustained |
| **Equity given** | 15-25%; median dilution 17.9% (Q1 2025) |
| **Instrument** | Priced round |
| **Investors** | Institutional VCs, corporate venture arms |

**What investors evaluate (Pitchwise 2026):**
- Clear product-market fit: high usage, low churn, high NPS
- Revenue traction with predictable growth patterns
- Positive CAC:LTV ratios with path to profitability
- Scalable go-to-market with repeatable sales process
- Strengthened team across functions
- Clear competitive differentiation

**Deal breakers (Slidebean):** High churn, unprofitable unit economics, team conflicts

**Success rate:** Less than 40% of seed-funded companies achieve Series A. Median time seed → Series A: ~616 days (Pitchwise 2025). Series A deal volume declined 18% YoY in 2025 with capital invested down 23%.

**StartupAI signals:** Multiple completed sprint cycles, experiments with evidence, financial projections entered, investor pipeline active

---

#### Stage 4: Series B

| Metric | Value |
|--------|-------|
| **Funding** | $15M — $60M; median $38M (Pitchwise) |
| **Valuation** | $80M — $140M; median $102.8M |
| **Team** | 25-100+ people; 1-2 proven VPs |
| **Product** | Scalable design with ongoing feature additions |
| **Revenue** | $5M — $10M+ ARR |
| **Growth** | 15-20% MoM sustained |
| **Key metrics** | NDR >110-120%, CAC payback <15 months, $300M+ ARR potential |
| **Equity given** | ~14.3% |
| **Investors** | Growth-focused VCs, late-stage specialists, PE firms |

**What investors evaluate:**
- Proven business model, operational stability
- Strong customer retention economics (NRR >100%)
- Efficient capital deployment
- Competitive positioning clarity
- Demonstrable path to profitability

**2026 context:** 2025 Series B market shifted toward quality over volume. Fewer startups reached this stage, but those succeeding brought stronger financials.

---

#### Stage 5: Series C

| Metric | Value |
|--------|-------|
| **Funding** | $30M — $100M; avg ~$50M |
| **Valuation** | $100M — $500M+ |
| **Revenue** | $20M — $50M+ ARR; $100M+ trajectory |
| **Key metrics** | Customer retention 90%+, profitable unit economics at scale |
| **Equity given** | 10-15% |
| **Investors** | Late-stage VCs, PE firms, hedge funds, banks |

**Uses:** Market expansion, acquisitions, new products, international expansion, IPO preparation

---

#### Stage 6+: Series D-E & Exit

| Stage | Funding | Revenue | Valuation |
|-------|---------|---------|-----------|
| **Series D** | $50M — $150M+ (median $96.5M) | $50M-$100M+ ARR | $700M — $2B+ |
| **Series E** | $50M — $500M+ | Unicorn territory | $1B+ |
| **Mezzanine** | Bridge to exit | IPO-ready | Near-exit valuation |
| **IPO** | Public markets | Public-company-ready | Varies |

Only 134 companies reached Series E in 2025. ~10% of all startups.

**Timeline:** 10-12 years from startup to IPO for a typical company. 4-5 funding rounds before IPO.

---

### Industry-Specific Benchmarks (FI.co)

| Vertical | Accelerator | Pre-Seed | Seed | Series A |
|----------|:-----------:|:--------:|:----:|:--------:|
| **SaaS** | Paid POCs/pilots | $5-25K MRR | $25-200K MRR | $300K+ MRR (12mo cohort) |
| **Marketplace** | $1-100K tx revenue | $25-500K tx | $250K-3M run rate | $7-20M run rate |
| **Consumer** | 1K+ DAU | 5K+ DAU | 25-100K DAU | 600K+ DAU |
| **Deep Tech** | Strong team | Team + LOIs + POCs | POCs + strong IP | Commercial validation |

---

### Funding Types Beyond Equity

| Type | Description | Best For | Dilution |
|------|-------------|----------|:--------:|
| **Bootstrapping** | Self-funded from savings/revenue | Capital-light, validated ideas | 0% |
| **SAFE** | Simple Agreement for Future Equity | Pre-seed/seed, fast closing | Deferred |
| **Convertible Note** | Debt that converts to equity | Bridge rounds | Deferred |
| **Revenue-Based Financing** | Repay from % of revenue | Profitable but growing | 0% |
| **Grants** | Non-dilutive government/org funding | R&D, social impact | 0% |
| **Crowdfunding** | Public micro-investments | Consumer products, community | Low |
| **Angel Investment** | Individual investors | Pre-seed to seed | 2-15% |
| **Venture Capital** | Institutional fund investment | Seed to late stage | 15-25% |
| **Venture Debt** | Loans for VC-backed companies | Extend runway without dilution | 0% + warrants |
| **Private Equity** | Late-stage majority investments | Growth/pre-IPO | Varies |

---

## Part 2: Y Combinator's Startup Framework

### YC's Core Philosophy

YC (Kevin Hale) frames startup ideas as **hypotheses for growth** with three components:

| Component | What It Means | How to Test |
|-----------|--------------|-------------|
| **Problem** | A meaningful problem that allows rapid growth | Customer interviews, market research |
| **Solution** | Your product/service as the experiment | MVP, fake doors, pre-sales |
| **Insight** | Why THIS solution will gain traction | Unfair advantage analysis |

### YC's 5 Unfair Advantages

Every successful startup needs at least one:

1. **Unique Founders** — Expertise or rare skills that make you the best fit
2. **Market Growth** — Targeting markets growing 20%+ annually
3. **10x Product** — Significantly better than competitors (not just different)
4. **Word-of-Mouth** — Organic growth over paid acquisition
5. **Monopoly Potential** — Network effects that strengthen with scale

### YC Order of Operations

YC recommends this sequence from idea to MVP:

1. Find a co-founder (if solo)
2. Talk to users (customer discovery)
3. Build an MVP (launch within 2 months, regardless of complexity)
4. Launch and iterate based on feedback
5. Measure retention and growth
6. Raise funding (if needed) to accelerate

**Key YC principle:** Launch early. Aim to launch within 2 months no matter how complex. Feedback from early users is invaluable and guides further development.

---

## Part 3: The VC Process — What Founders Face

### The Investment Funnel

```
100 startups approach a VC fund
  └─ 10 get a detailed review
       └─ 3-5 get partner meetings
            └─ 1-2 get term sheets
                 └─ 1 gets funded

Rejection rate: ~99% per fund
Average: 17-18 "no"s for every "yes" (Antler)
```

### VC Investment Process (4 Stages)

1. **Deal Sourcing** — VCs find startups through networks, inbound, events, scout programs
2. **Initial Meeting** — Pitch presentation, business model review, team assessment
3. **Due Diligence** — Deep-dive analysis into all aspects of the business (see checklist below)
4. **Term Sheet & Negotiation** — Non-binding agreement outlining investment terms

### Due Diligence Checklist (2025 Standard)

VCs evaluate across 7 areas:

| Area | What They Check | StartupAI Can Provide |
|------|-----------------|----------------------|
| **Financial** | Income statements, cash flow, burn rate, projections | Financial projections from validator report |
| **Market** | TAM/SAM/SOM, competitive positioning, growth trends | Market sizing from Research Agent |
| **Product/Tech** | Roadmap, scalability, IP, technical debt | MVP scope from validator, tech stack |
| **Legal** | Compliance, contracts, IP protection, litigation | Flagged in risk assessment |
| **Operational** | Team, processes, workflows | Team plan from validator report |
| **Traction** | Revenue, users, growth rate, retention, NPS | Metrics from profile + experiments |
| **Risk** | Market risk, execution risk, competitive risk | Risk heatmap from validator report |

### Term Sheet Key Components

| Term | What It Means | Founder Impact |
|------|--------------|----------------|
| **Pre-money valuation** | Company value before investment | Determines dilution |
| **Liquidation preference** | Who gets paid first on exit | 1x is standard; >1x is investor-favorable |
| **Anti-dilution** | Protection against down rounds | Broad-based weighted average is standard |
| **Board seats** | Investor control | Typical: 2 founders + 1 investor at seed |
| **Vesting** | Founder equity earned over time | 4-year with 1-year cliff is standard |
| **Pro-rata rights** | Investor's right to maintain % in future rounds | Standard for leads |
| **Drag-along** | Force minority to sell if majority agrees | Standard but negotiate threshold |
| **SAFE cap** | Maximum valuation for conversion | Protects early investors from high later valuations |

---

## Part 4: AI Agent Strategy for StartupAI

### The Stage Detection Agent

**Purpose:** Automatically assess what funding stage a startup is at based on data already in StartupAI, then tailor all AI recommendations to that stage.

#### Signal Detection Model

```typescript
interface StageSignals {
  // Team signals
  teamSize: number;                    // From profile
  hasCoFounder: boolean;               // From profile
  experiencedExecutives: number;       // From team plan

  // Product signals
  hasIdea: boolean;                    // Validator chat completed
  hasMVP: boolean;                     // From profile or experiments
  hasLaunchedProduct: boolean;         // From profile
  productIterations: number;           // From sprint reviews

  // Traction signals
  monthlyRevenue: number;             // From profile financials
  monthlyRevenueGrowth: number;       // Computed from history
  activeUsers: number;                // From profile
  userGrowthRate: number;             // Computed
  npsScore: number;                   // From experiments
  churnRate: number;                  // From profile

  // Funding signals
  totalRaised: number;               // From profile
  lastRoundType: string;             // From profile
  monthsOfRunway: number;            // Computed from burn rate
  hasInvestors: boolean;             // From investor pipeline

  // Validation signals
  validatorScore: number;            // From validator report
  experimentsCompleted: number;      // From experiments lab
  canvasCompleteness: number;        // From lean canvas
  assumptionsValidated: number;      // From experiments evidence
}
```

#### Stage Classification Rules

```
BOOTSTRAPPING:
  totalRaised == 0 AND hasIdea AND NOT hasInvestors
  → No funding, building with own resources

PRE-SEED:
  (totalRaised < $1M OR totalRaised == 0) AND
  (teamSize <= 3) AND
  (monthlyRevenue < $25K) AND
  (hasIdea OR hasMVP)
  → Early stage, validating concept

SEED:
  (totalRaised $1M-$5M OR monthlyRevenue $25K-$200K) AND
  (teamSize 2-10) AND
  (hasLaunchedProduct OR hasMVP with traction)
  → Product launched, proving traction

SERIES A:
  (totalRaised $5M-$20M OR monthlyRevenue > $200K) AND
  (teamSize 8-25) AND
  (hasLaunchedProduct) AND
  (productIterations > 0)
  → Scaling, proving repeatability

SERIES B+:
  (totalRaised > $20M OR monthlyRevenue > $500K) AND
  (teamSize > 25)
  → Growth stage, expanding
```

**Fallback:** If signals conflict (e.g., $0 raised but $200K MRR = successful bootstrapped company), use a weighted scoring model that prioritizes revenue and team signals over funding history.

---

### Stage-Aware Agent Behavior

Every AI agent in StartupAI should adapt its output based on detected stage:

#### Validator Report — Stage-Specific Scoring Weights

| Dimension | Pre-Seed Weight | Seed Weight | Series A Weight |
|-----------|:--------------:|:-----------:|:--------------:|
| Problem Clarity | 25% | 20% | 10% |
| Customer | 20% | 15% | 10% |
| Market Size | 15% | 20% | 20% |
| Competition | 10% | 15% | 20% |
| Team Fit | 15% | 10% | 15% |
| Product | 5% | 10% | 15% |
| Go-to-Market | 10% | 10% | 10% |

**Rationale:** Pre-seed → desirability matters most (problem + customer). Series A → execution matters most (competition + product + GTM).

#### Lean Canvas Coach — Stage-Specific Focus

| Stage | Priority Boxes | Coach Emphasis |
|-------|---------------|----------------|
| **Bootstrapping** | Problem, Customer Segments, Solution | "Validate the problem exists before building" |
| **Pre-Seed** | Problem, UVP, Channels | "Prove desirability — can you get anyone to try?" |
| **Seed** | Revenue Streams, Key Metrics, Channels | "Prove unit economics work at small scale" |
| **Series A** | Unfair Advantage, Cost Structure, Key Metrics | "Prove you can scale profitably" |

#### Risk Assessment — Stage-Specific Domains

| Stage | Primary Risk Domains | Secondary |
|-------|---------------------|-----------|
| **Bootstrapping** | Financial (runway), Problem (validation) | Team |
| **Pre-Seed** | Desirability (problem, customer, channel) | Financial |
| **Seed** | Viability (revenue, unit economics) | Competition |
| **Series A** | Execution (scaling, team, operations) | Market, Legal |
| **Series B+** | Strategic (moat, expansion, exit) | Operational |

#### Experiments Lab — Stage-Specific Methods

| Stage | Recommended Methods | Why |
|-------|-------------------|-----|
| **Bootstrapping** | Customer interviews, surveys | Zero cost, validates problem |
| **Pre-Seed** | Fake doors, landing pages | Best cost/value for demand validation |
| **Seed** | Pre-sales, pilot programs | Proves willingness to pay |
| **Series A** | A/B tests, cohort analysis | Optimizes conversion at scale |

---

### Funding Readiness Score

A new composite metric that tells founders how ready they are to raise their **next** round.

```typescript
interface FundingReadiness {
  overallScore: number;      // 0-100
  currentStage: string;      // "Pre-Seed", "Seed", etc.
  nextStage: string;         // The round they'd raise next
  readyToRaise: boolean;     // Score > 70
  gaps: FundingGap[];        // What's missing
  timeline: string;          // "3-6 months" estimated

  dimensions: {
    team: number;            // Do you have the right people?
    product: number;         // Is the product where it needs to be?
    traction: number;        // Do metrics meet benchmarks?
    market: number;          // Is the market validated?
    financial: number;       // Are unit economics proven?
    narrative: number;       // Can you tell a compelling story?
  };
}

interface FundingGap {
  dimension: string;
  gap: string;               // "Monthly revenue $15K, need $25K+ for seed"
  action: string;            // "Focus on conversion optimization"
  benchmarkCurrent: string;  // "$15K MRR"
  benchmarkTarget: string;   // "$25K-$200K MRR"
  urgency: 'critical' | 'important' | 'nice-to-have';
}
```

#### Benchmark Comparison Engine

For each detected stage, compare founder's actual metrics against stage benchmarks:

```
CURRENT STATE              SEED BENCHMARK          GAP
─────────────              ──────────────          ───
MRR: $15K                  $25K - $200K            ⚠ Below minimum
Team: 3 people             4+                      ⚠ Need 1 more hire
Growth: 12% MoM            15-30% MoM              ⚠ Below range
Product: MVP launched      MVP with organic growth  ✓ On track
ARR multiple: N/A          2-3x YoY                ⚠ Need 12mo data

FUNDING READINESS: 45/100
NEXT MILESTONE: Hit $25K MRR with 15%+ MoM growth
ESTIMATED TIMELINE: 3-4 months at current trajectory
```

---

### Fundraising Coach Agent

A new AI agent persona that activates when a founder is approaching fundraising readiness or explicitly asks about raising.

#### Capabilities

| Capability | Description | Data Source |
|------------|-------------|-------------|
| **Stage Assessment** | Auto-detect current stage from profile data | StageSignals model |
| **Benchmark Gap Analysis** | Compare metrics to stage benchmarks | FI.co + Pitchwise data |
| **Investor Type Guide** | Suggest investor types appropriate for stage | Stage → investor mapping |
| **Pitch Narrative** | Help craft stage-appropriate pitch story | Validator report + canvas |
| **Due Diligence Prep** | Checklist of what VCs will ask at this stage | 7-area DD checklist |
| **Term Sheet Education** | Explain terms in plain language | Term sheet glossary |
| **Runway Calculator** | Months of runway at current burn | Financial data from profile |
| **Dilution Modeling** | Show equity impact of raising at different valuations | Stage benchmarks |
| **Funding Type Advisor** | Bootstrap vs SAFE vs priced round recommendation | Stage + context |

#### Coach Dialogue Examples

**Pre-seed founder asks "Should I raise?":**
> Based on your profile, you have 2 team members, an MVP in progress, and no revenue yet. You're at the pre-seed stage. Before raising, I'd recommend:
> 1. Complete your validator report to prove the problem exists (currently at 0%)
> 2. Run 2-3 fake door experiments to show demand
> 3. Get to $5-10K MRR to strengthen your position
>
> Pre-seed rounds typically range $150K-$1M at $3-12M valuation. Investors at this stage bet on the founder — your team strength and market insight matter more than metrics.
>
> Alternative: Consider bootstrapping if your business is capital-light. You keep 100% equity and full control.
>
> Your funding readiness: 25/100. Key gap: No traction data yet.

**Seed founder asks "Am I ready for Series A?":**
> Your metrics: $80K MRR, 18% MoM growth, 6 team members, 14 months since seed.
>
> Series A benchmarks: $200K+ MRR, 15-25% MoM, 8+ team, $1-5M ARR.
>
> You're trending well on growth (18% vs 15% minimum) but need to hit $200K MRR first. At 18% MoM growth, you'll reach that in ~5 months.
>
> Less than 40% of seed companies raise Series A. Median time is ~616 days (~20 months). You're at month 14 — on track if you maintain growth.
>
> Your funding readiness for Series A: 55/100.
> Critical gaps: Revenue ($80K vs $200K target), team size (6 vs 8+).

**Founder asks "What's a SAFE?":**
> A SAFE (Simple Agreement for Future Equity) is the standard pre-seed/seed investment instrument. It's not debt — it's a promise to give the investor equity at a future priced round.
>
> Key terms:
> - Valuation cap: Max valuation at which the SAFE converts (protects investor)
> - Discount: Typically 10-20% discount to the future round price
> - Pro-rata: Right to maintain ownership % in future rounds
>
> For your stage (pre-seed), a SAFE with a $5-8M cap is typical. This means if your Series A values you at $20M, the SAFE investor gets shares as if the company were worth $5-8M — a significant discount for taking early risk.

---

## Part 5: Implementation Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    STARTUP PROFILE                        │
│  (team, revenue, product stage, funding history)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              STAGE DETECTION AGENT                        │
│  Analyzes signals → classifies stage → sets context       │
│                                                           │
│  Input: Profile + Canvas + Report + Experiments           │
│  Output: { stage, confidence, nextStage, gaps[] }         │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┼──────────────┐
          ▼          ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌─────────────────┐
   │ VALIDATOR  │ │ LEAN       │ │ FUNDRAISING     │
   │ REPORT     │ │ CANVAS     │ │ COACH           │
   │            │ │ COACH      │ │                 │
   │ Stage-     │ │ Stage-     │ │ Readiness score │
   │ weighted   │ │ specific   │ │ Benchmark gaps  │
   │ scoring    │ │ box focus  │ │ Investor match  │
   │            │ │            │ │ DD prep         │
   └────────────┘ └────────────┘ └─────────────────┘
          │          │              │
          └──────────┼──────────────┘
                     ▼
   ┌──────────────────────────────────────────────────────┐
   │              EXPERIMENTS LAB                           │
   │  Stage-appropriate validation methods                  │
   │  Pre-seed: interviews + fake doors                     │
   │  Seed: pre-sales + pilots                              │
   │  Series A: cohort analysis + A/B tests                 │
   └──────────────────────────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────────────────────────────┐
   │              FUNDING READINESS DASHBOARD               │
   │  Score: 55/100 | Next: Series A | Timeline: 5 months  │
   │                                                        │
   │  [Team ●●●○○] [Product ●●●●○] [Traction ●●○○○]       │
   │  [Market ●●●●○] [Financial ●●○○○] [Narrative ●●●○○]  │
   │                                                        │
   │  Top gaps:                                             │
   │  1. MRR: $80K → need $200K (critical)                 │
   │  2. Team: 6 → need 8+ (important)                     │
   │  3. Cohort data: 8mo → need 12mo (important)          │
   └──────────────────────────────────────────────────────┘
```

---

### Benchmark Data (Static Reference Config)

Store FI.co + Pitchwise benchmark data as a static JSON config in the frontend:

```typescript
const STAGE_BENCHMARKS = {
  bootstrapping: {
    revenue: { min: 0, max: 0, unit: 'MRR' },
    team: { min: 1, max: 2 },
    growth: { min: 0, max: 0, unit: 'MoM' },
    funding: { min: 0, max: 0 },
  },
  pre_seed: {
    revenue: { min: 0, max: 25_000, unit: 'MRR' },
    team: { min: 1, max: 3 },
    growth: { min: 10, max: 20, unit: 'MoM %' },
    funding: { min: 150_000, max: 1_000_000 },
    valuation: { min: 3_000_000, max: 12_500_000 },
    equity: { min: 2.5, max: 12.5, unit: '%' },
  },
  seed: {
    revenue: { min: 25_000, max: 200_000, unit: 'MRR' },
    team: { min: 4, max: 10 },
    growth: { min: 15, max: 30, unit: 'MoM %' },
    funding: { min: 2_000_000, max: 10_000_000 },
    valuation: { min: 10_000_000, max: 40_000_000 },
    equity: { min: 17.5, max: 25, unit: '%' },
  },
  series_a: {
    revenue: { min: 200_000, max: null, unit: 'MRR' },
    team: { min: 8, max: 25 },
    growth: { min: 15, max: 25, unit: 'MoM %' },
    funding: { min: 5_000_000, max: 50_000_000 },
    valuation: { min: 30_000_000, max: 100_000_000 },
    equity: { min: 15, max: 25, unit: '%' },
    arr: { min: 1_000_000, max: 5_000_000 },
  },
  series_b: {
    revenue: { min: 500_000, max: null, unit: 'MRR' },
    team: { min: 25, max: 100 },
    growth: { min: 15, max: 20, unit: 'MoM %' },
    funding: { min: 15_000_000, max: 60_000_000 },
    valuation: { min: 80_000_000, max: 140_000_000 },
    equity: { min: 14, max: 15, unit: '%' },
    ndr: { min: 110, max: 120, unit: '%' },
  },
} as const;
```

---

## Part 6: How AI Agents Help Startups Move Forward

### The Startup Progression Engine

For each stage, StartupAI identifies what the founder needs to **do next** to advance:

#### Bootstrapping → Pre-Seed

| What to do | How StartupAI helps | Feature |
|------------|---------------------|---------|
| Validate problem exists | Validator Chat + Report | Built |
| Talk to 20+ potential customers | Smart Interviewer agent | Planned (06) |
| Build an MVP | MVP Scope section of report | Built |
| Draft Lean Canvas | Auto-generate from validator | Prompt 16 |
| Find co-founder (if solo) | Team gap flagging | Stage detection |

#### Pre-Seed → Seed

| What to do | How StartupAI helps | Feature |
|------------|---------------------|---------|
| Prove demand (fake door) | Experiments Lab + method badge | Prompt 17 |
| Get first 10 paying customers | Pre-sell experiment template | 005-EXP |
| Show 15%+ MoM growth | Metrics tracking in profile | Profile |
| Build investor deck | Pitch Deck Wizard | Built |
| Refine unit economics | Financial projections | Report |

#### Seed → Series A

| What to do | How StartupAI helps | Feature |
|------------|---------------------|---------|
| Hit $200K+ MRR | Benchmark gap analysis | Readiness score |
| Prove retention (12mo cohort) | Cohort tracking | New feature |
| Hire key executives | Team Plan cards | Report Section 11 |
| Establish repeatable GTM | Experiment evidence | 005-EXP |
| Prepare for DD | Due diligence checklist | New feature |

#### Series A → Series B

| What to do | How StartupAI helps | Feature |
|------------|---------------------|---------|
| Scale to $5M+ ARR | Growth analytics | Dashboard |
| Achieve NDR >110% | Retention monitoring | New feature |
| CAC payback <15 months | Unit economics dashboard | New feature |
| Prove operational maturity | Sprint Reviews + metrics | Built |

---

## Part 7: Feature Roadmap

### New Features to Build

| # | Feature | Description | Effort | Priority |
|:-:|---------|-------------|:------:|:--------:|
| 1 | **Stage Detection** | Auto-classify startup stage from profile signals | M | P1 |
| 2 | **Funding Readiness Score** | 6-dimension score with benchmark gaps | M | P1 |
| 3 | **Fundraising Coach** | AI agent for funding guidance, DD prep, term sheet education | L | P2 |
| 4 | **Stage-Aware Scoring** | Validator report weights shift by stage | S | P1 |
| 5 | **Benchmark Dashboard** | Visual comparison of metrics vs stage benchmarks | M | P2 |
| 6 | **Dilution Calculator** | Model equity impact of raising at different valuations | S | P2 |
| 7 | **Investor Type Guide** | Recommend investor types based on stage + vertical | S | P2 |
| 8 | **DD Checklist** | Interactive due diligence preparation checklist | M | P2 |
| 9 | **Runway Calculator** | Months of runway from burn rate + cash | S | P1 |
| 10 | **Funding Type Advisor** | Bootstrap vs SAFE vs priced round recommendation | S | P2 |

### Existing Features to Enhance

| Feature | Enhancement | Effort |
|---------|-------------|:------:|
| **Validator Report** | Stage-weighted dimension scoring | S |
| **Lean Canvas Coach** | Stage-specific box prioritization | S |
| **Risk Heatmap** | Stage-specific domain emphasis | S |
| **Experiments Lab** | Stage-specific method recommendations | S |
| **Company Profile** | Funding history + metrics fields for stage detection | S |
| **Dashboard** | Funding readiness widget | M |
| **Pitch Deck Wizard** | Stage-specific deck templates | M |
| **Investor Pipeline** | Investor type filtering by stage | S |

---

## Part 8: Competitive Intelligence — AI in VC

### How VCs Already Use AI

| Tool | What It Does | StartupAI Parallel |
|------|-------------|-------------------|
| **SignalFire Scout** | Auto-detect promising startups from data | We provide the startup side of this |
| **Hone Capital** | Predictive analytics across deals | Our benchmarks serve similar purpose |
| **Correlation Ventures** | AI-powered deal scoring | Our validator score does this |
| **GemScore** | AI evaluation for pre-seed to Series A | Direct competitor — we go deeper |
| **Evalyze** | Pitch deck analysis + investor matching | Our pitch deck wizard + investor pipeline |
| **Athanor Market** | Dual-axis AI startup evaluation | Our stage detection + readiness score |

**StartupAI's edge:** We have the founder's **complete context** — their canvas, validation data, experiments, metrics, team, financial projections. External tools only see the pitch deck. We see everything, so our stage assessment and recommendations are far more accurate.

### AI-Specific Valuation Context (2025)

- AI startups attracted $89.4B in global VC (34% of all VC despite 18% of funded companies)
- AI agent EV/Revenue spans 3-12x for value clusters, 30-50x for premium niches
- Key AI-specific metrics VCs evaluate: model accuracy, inference costs, infrastructure scaling, data acquisition costs
- ARR per employee ($200K+ preferred), burn multiples under 2x, runway 18-24 months

---

## Appendix A: Sources

### Funding Stage Sources
- [Antler — Startup Funding Stages](https://www.antler.co/blog/startup-funding-stages)
- [Antler — Pre-Seed Funding](https://www.antler.co/blog/pre-seed-funding)
- [Visible.vc — Ultimate Guide to Startup Funding Stages](https://visible.vc/blog/startup-funding-stages/)
- [Digits — Startup Funding Stages](https://digits.com/blog/startup-funding-stages/)
- [FI.co — Startup Benchmarks](https://fi.co/benchmarks)
- [Pitchwise — 2026 Seed and Series Funding Guide](https://www.pitchwise.se/blog/the-complete-guide-to-seed-and-series-funding-rounds-for-founders-in-2026)
- [Slidebean — Early Startup Funding Stages](https://slidebean.com/tools/early-startup-funding-stages)
- [Zeni — Series A Valuations in 2026](https://www.zeni.ai/blog/series-a-valuations)

### Bootstrapping Sources
- [Startup Grind — 8 Ways to Bootstrap](https://www.startupgrind.com/blog/8-ways-to-bootstrap-your-small-business/)
- Stripe — Bootstrapping Guide for Startups
- Investopedia — Bootstrapping Definition

### VC Process Sources
- [Akira.ai — AI Agents in Venture Capital](https://www.akira.ai/blog/ai-agents-venture-capital-investment-analysis)
- [4Degrees — 2025 VC Due Diligence Checklist](https://www.4degrees.ai/blog/2025-venture-capital-due-diligence-checklist)

### YC Sources
- [YC — Stages of Startups](https://www.ycombinator.com/library/Ek-stages-of-startups)
- [YC — Different Startup Stages](https://www.ycombinator.com/library/K1-different-startup-stages-and-what-they-mean-for-you)
- [YC — Order of Operations](https://www.ycombinator.com/library/61-order-of-operations-for-starting-a-startup)
- [YC — Essential Startup Advice](https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice)

### Validation Framework Sources (cross-reference)
- `tasks/strategy/6-methods-validation.md` (7 frameworks + YC Kevin Hale)
- `tasks/strategy/01-validation-strategy.md` (18 frameworks synthesized)

---

*v1.0 — Initial funding rounds strategy document. Synthesizes 15+ sources into stage assessment model, funding readiness score, and AI agent strategy for StartupAI. Created 2026-02-13.*
