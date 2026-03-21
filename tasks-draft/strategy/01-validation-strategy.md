# StartupAI — Validation Strategy

> **Version:** 1.0 | **Date:** 2026-02-13
> **Status:** Strategy Document — Ready for Implementation
> **Audience:** StartupAI product team, AI agents, prompt engineers
> **Sources:** 18 frameworks analyzed (see Appendix A)
> **Implementation:** `tasks/prompts/design/17-risk-validation-framework.md`

---

## Executive Summary

StartupAI's validation system should guide founders through a structured, evidence-based process that turns vague ideas into validated business models. After analyzing 18 industry frameworks — from Harvard Business School to Y Combinator, Ash Maurya to Strategyzer — we synthesized the common patterns into a **5-phase validation engine** that maps directly to StartupAI's existing architecture.

The core insight across all frameworks: **34% of startups fail because they lack product-market fit** (Failory, 100+ founder interviews). Every framework we studied exists to prevent this single failure mode. The differences are in methodology, not goals.

---

## Part 1: Framework Synthesis

### 18 Frameworks → 5 Universal Principles

Every framework we analyzed shares these principles, regardless of author or methodology:

| # | Principle | Frameworks That Teach It | StartupAI Feature |
|:-:|-----------|--------------------------|-------------------|
| 1 | **Write assumptions down** — ideas are hypotheses, not facts | HBS, Lean, Startup Grind, FI.co, SPD Load, Failory | Validator Chat + Report |
| 2 | **Rank by risk** — test the riskiest assumption first | FI.co, Ash Maurya, LeanFoundry, Product Compass, Riskiest Assumption Canvas | Risk Heatmap + Validation Queue |
| 3 | **Talk to customers** — interviews beat surveys beat guessing | HBS, Startup Grind, Lean, VV7D, Failory | Smart Interviewer (06) |
| 4 | **Pre-sell before building** — money > opinions > likes | Failory, Startup Grind, SPD Load | Experiments Lab (005-EXP) |
| 5 | **Iterate or kill** — pivot on evidence, not emotion | All 18 frameworks | Lean Canvas + Sprint Cycle |

### Framework Comparison Matrix

| Framework | Source | Strengths | Gaps | Cost |
|-----------|--------|-----------|------|------|
| **HBS Market Validation** | Harvard Business School | Rigorous 5-step process, search volume analysis | Academic, no pre-selling, no prioritization | Free |
| **Lean Market Validation** | Jim Semick / ProductPlan | 10 rapid methods, network-first | No risk scoring, assumes existing audience | Free |
| **Startup Grind** | Mitchell Harper | Zero-cost, tier-1 problem focus, budget verification | Manual LinkedIn outreach, no automation | $0 |
| **Failory 4-Step** | Failory | Pre-selling focus, SMART goals, niceness gap concept | Narrow (pre-sales only), no risk mapping | Free |
| **SPD Load** | Andrii Blond | 7-step with checklist, value prop emphasis | Light on prioritization | Free |
| **VV7D** | Venture Validator | 7D data-backed discovery, PMF scoring | Proprietary, survey-heavy | Paid |
| **FI.co Risk Scoring** | Founder Institute | Possibility x Impact numerical scoring | No domain tagging, no validation methods | Free |
| **Ash Maurya / TOC** | Leanstack | Theory of Constraints, Customer Factory, canvas mapping | Requires traction data for full use | Free |
| **LeanFoundry GO-LEAN** | Lean Foundry | 6-step mnemonic, constraint focus, weekly metrics | Complex for early-stage | Free |
| **Assumption Prioritization Canvas** | Product Compass | 5 risk domains, Impact x Risk axes | No validation methods per risk | Free |
| **Riskiest Assumption Canvas** | UX Design / David Bland | Single riskiest assumption → experiment design | One-at-a-time only | Free |
| **Value Proposition Canvas** | Strategyzer | Jobs/Pains/Gains ↔ Products/Relievers/Creators | No risk scoring, no prioritization | Free |
| **YC Kevin Hale** | Y Combinator | Unfair advantage taxonomy, growth hypotheses | High-level, no step-by-step | Free |
| **Arnab Ray** | Independent | Visual framework, strength/weakness/risk mapping | Light on detail | Free |
| **Upsilon Risk Taxonomy** | Upsilon IT | 10 risk domains, 6-step management process | Enterprise-focused, no startup prioritization | Free |
| **Siift.ai Founder Risks** | Siift.ai | 5 founder-specific domains, cognitive bias awareness | No scoring methodology | Free |
| **Iterative.vc 5 Methods** | Iterative.vc | Cost/value matrix for validation methods | No risk scoring integration | Free |
| **Hexa Validation** | Inside Hexa (eFounders) | Structured B2B validation, ICP focus | Medium paywall, B2B only | Free |

---

## Part 2: The StartupAI Validation Engine

### 5-Phase Model

Based on the synthesis, StartupAI's validation flows through five phases. Each phase maps to existing features and planned builds.

```
Phase 1          Phase 2           Phase 3          Phase 4          Phase 5
ARTICULATE  →    ASSESS    →      PRIORITIZE  →    TEST      →      DECIDE

"What do I       "How big is       "What's the      "Does evidence    "Go, pivot,
 believe?"        the risk?"        #1 risk?"        support it?"      or kill?"

┌──────────┐    ┌──────────┐     ┌──────────┐    ┌──────────┐     ┌──────────┐
│ Validator │    │ Validator │     │ Risk     │    │ Experi-  │     │ Lean     │
│ Chat +   │    │ Report   │     │ Heatmap  │    │ ments    │     │ Canvas   │
│ Report   │    │ Sections │     │ + Queue  │    │ Lab      │     │ + Sprint │
│          │    │ 1-3      │     │ Section 5│    │ 005-EXP  │     │ Review   │
└──────────┘    └──────────┘     └──────────┘    └──────────┘     └──────────┘

Sources:         Sources:          Sources:         Sources:          Sources:
HBS Step 1       HBS Steps 2-3    FI.co            Failory           All
Lean Step 1      Startup Grind    Ash Maurya       Startup Grind     YC Hale
SPD Load 1-3     VV7D Step 1      LeanFoundry      Iterative.vc     Lean
                 Strategyzer      Product Compass   SPD Load         LeanFoundry
```

---

### Phase 1: ARTICULATE — Write Down What You Believe

**What the frameworks say:**
Every single framework starts with writing down assumptions. HBS says "write down goals, assumptions, and hypotheses." Startup Grind says "write down the problem, not the solution." SPD Load says "define the why." This is universal.

**What StartupAI does today:**
- Validator Chat captures the idea through guided questions (8 coverage topics)
- Extractor Agent parses into structured data (problem, customer, solution, market)
- Report surfaces assumptions in Sections 1-3 (Problem, Customer, Market)

**What's missing:**
- Assumptions aren't explicitly labeled as "assumptions" — they read as facts
- No distinction between what the founder knows vs. believes
- No confidence level per assumption

**Recommendation:**
Add an "Assumptions Board" view that reframes every report insight as a testable hypothesis. Format: "We believe [X] because [evidence]. If wrong, [consequence]." This is partially covered by prompt 05-validation-board but should be explicit about the hypothesis framing.

**Implementation mapping:**
| Source Framework | StartupAI Feature | Status |
|------------------|-------------------|--------|
| HBS Step 1 | Validator Chat | Built |
| Startup Grind Step 1 | Extractor Agent | Built |
| SPD Load Steps 1-3 | Report Sections 1-3 | Built |
| Strategyzer VPC | Value Proposition Canvas (08) | 0% |
| **Hypothesis framing** | **05-validation-board** | **0%** |

---

### Phase 2: ASSESS — Understand the Landscape

**What the frameworks say:**
HBS emphasizes market size and search volume analysis. Startup Grind says to determine if the problem is "tier 1" and research existing solutions. VV7D uses surveys to extract signal. Strategyzer maps jobs/pains/gains.

**What StartupAI does today:**
- Research Agent pulls market data (TAM/SAM/SOM, trends, citations)
- Competitors Agent identifies competitors, SWOT, feature comparison
- Scoring Agent evaluates 7 dimensions (problem clarity, timing, market size, competition, team fit, product, go-to-market)
- Report surfaces all of this in Sections 2-4, 8, 10

**What's missing:**
- No search volume analysis (Google Trends / keyword data)
- No "tier 1 problem" explicit check — scoring is holistic, not focused on problem severity ranking
- No customer jobs/pains/gains mapping (Value Proposition Canvas)

**Recommendation:**
1. Add search volume data to Research Agent (Google Trends API or proxy)
2. Add a "Problem Severity" sub-score in Scoring Agent: is this a top-3 problem for the customer?
3. Build Value Proposition Canvas (prompt 08) to complement Lean Canvas

**Implementation mapping:**
| Source Framework | StartupAI Feature | Status |
|------------------|-------------------|--------|
| HBS Steps 2-3 | Research Agent + Market Section | Built |
| Startup Grind Steps 2-4 | Competitors Agent + Problem Card | Built |
| VV7D Steps 1-4 | Chat + Report | Built |
| Strategyzer VPC | 08-value-proposition | 0% |
| **Search volume** | **Research Agent v2 (013)** | **0%** |
| **Problem severity** | **Scoring Agent enhancement** | **Not planned** |

---

### Phase 3: PRIORITIZE — Find the #1 Risk

**What the frameworks say:**
This is where frameworks diverge most — and where StartupAI can add the most value.

**FI.co:** Score each assumption by Possibility (1-5) x Impact (1-10). Test highest scores first. Simple and effective.

**Ash Maurya / TOC:** Don't score everything — find the ONE constraint. For pre-traction startups, it's always acquisition (desirability). Map constraints to Lean Canvas boxes. Don't optimize production until you prove people want it.

**LeanFoundry GO-LEAN:** Same TOC approach but adds weekly metrics cadence and 90-day goal structure.

**Product Compass:** 5 risk domains (Value, Usability, Viability, Feasibility, Go-to-Market). Plot on Impact x Risk (where Risk = (1-Confidence) x Effort). Focus on top-right quadrant.

**Upsilon IT / Siift.ai:** 10 risk categories including Legal, Leadership, Reputational — broader than most frameworks consider.

**What StartupAI does today:**
- RiskHeatmap shows risks on a 2x2 grid (impact x probability, binary high/low)
- Severity tiers (fatal/risky/watch)
- `howToTest` field exists but is generic text
- No numerical scoring, no domain tagging, no validation method recommendation

**What's missing — the big gap:**
The current system identifies risks but doesn't prioritize them with enough granularity to tell founders "test THIS one first, using THIS method." This is the highest-leverage improvement we can make.

**Recommendation — Composite Prioritization Model:**

```
RISK SCORE = Impact (1-10) × Probability (1-5) = 0-50

DOMAIN TAGS:
  Desirability: problem, customer_segments, channels, unique_value
  Viability: revenue_streams, cost_structure
  Feasibility: solution, key_metrics, key_resources
  Operational: team, process, technology
  Legal/Regulatory: compliance, IP, data privacy

PRIORITIZATION RULES:
  1. Pre-traction → desirability risks first (Ash Maurya TOC)
  2. Within a domain → highest risk_score first (FI.co)
  3. Equal scores → cheapest-to-test first (Iterative.vc)
  4. Max 5 active risks in queue (cognitive load management)

CONSTRAINT CALLOUT:
  Identify the ONE bottleneck (TOC). For most StartupAI users (pre-traction),
  this is acquisition. Surface it prominently before the full risk list.
```

**Implementation:** This is fully specified in `tasks/prompts/design/17-risk-validation-framework.md` (prompts 17A-17E).

---

### Phase 4: TEST — Run the Cheapest Effective Experiment

**What the frameworks say:**

**Failory:** Pre-selling is the gold standard. Set a SMART goal ("If in 2 weeks I've made 10 pre-sales, it's validated"). Build a Minimum Viable Offer (landing page, explainer video, mockup). Pre-sell it. Analyze results.

**Startup Grind:** Talk to 20+ prospects. Ask how they handle the problem today, not what product they'd want. Verify there's a budget.

**Iterative.vc / 5 Methods:** Cost/value ranking:
| Method | Cost | Info Value | Best For |
|--------|------|------------|----------|
| Surveys | Low | Low | Initial signal |
| Interviews | Low | Medium | Problem validation |
| Mockups | Medium | Very Low | Visual concepts |
| Fake Doors | Medium | **High** | Demand validation |
| Actual Usage | High | Very High | Product-market fit |

**Key insight:** Fake doors (landing pages with signup/waitlist) have the best cost-to-value ratio for demand validation. Most founders skip straight to building when a fake door would answer the question in a weekend.

**What StartupAI does today:**
- Experiments Lab exists (45% complete) with CRUD for experiments
- `experiment-agent` edge function provides coaching
- Report's `howToTest` field suggests tests but doesn't structure them

**What's missing:**
- No connection between Report risks and Experiments (no deep link)
- No validation method recommendation per risk
- No SMART goal templates for experiments
- No pre-selling framework (landing page builder, payment integration)
- No interview script generator

**Recommendation:**
1. Deep link from Risk Heatmap → Experiments Lab (prompt 17E, already specified)
2. Each risk gets a recommended validation method badge (prompt 17C)
3. Add experiment templates for each method:
   - Survey template (Google Forms / Typeform link)
   - Interview script template (10 questions from Startup Grind)
   - Fake door template (landing page + CTA + tracking)
   - Pre-sell template (Stripe payment link + SMART goal)
4. Track experiment results with evidence scoring

**Implementation mapping:**
| Source Framework | StartupAI Feature | Status |
|------------------|-------------------|--------|
| Failory 4-Step | Experiments Lab | 45% |
| Startup Grind Step 6 | Interview templates | 0% |
| Iterative.vc | ValidationMethodBadge (17C) | 0% |
| FI.co Step 3 | Experiment-Risk deep link (17E) | 0% |
| **Pre-sell templates** | **005-EXP enhancement** | **0%** |

---

### Phase 5: DECIDE — Go, Pivot, or Kill

**What the frameworks say:**

**Failory:** Did you hit your SMART goal? Yes → build. Nearly → revise and retest. No → pivot or abandon. Refund pre-sales if killing.

**YC / Kevin Hale:** Think of startup ideas as hypotheses for growth. An unfair advantage is required: unique founders, market growth, 10x product, word-of-mouth, or monopoly potential.

**SPD Load:** Use the "real value" checklist: right timing, early adopter feedback, empathy, unique advantage, simplicity, customer life improvement.

**Ash Maurya:** The constraint shifts as you validate. Once acquisition is validated, the constraint moves to activation, then retention, then revenue. Re-diagnose after each cycle.

**What StartupAI does today:**
- Lean Canvas captures the business model
- Sprint Reviews provide retrospective tracking
- Weekly Reviews (CF5) track progress
- Validator score (0-100) gives a snapshot

**What's missing:**
- No structured go/pivot/kill decision framework
- No re-validation trigger (when should you re-run the validator?)
- No constraint shift detection (you validated acquisition — now what?)
- No "evidence weight" on the Lean Canvas showing which boxes are validated vs. assumed

**Recommendation:**
1. Add confidence badges to Lean Canvas boxes (prompt 16E in 16-validator-to-lean-canvas)
2. Build a "Validation Progress" view showing which assumptions have evidence
3. Re-validation trigger: when 3+ experiments complete, prompt re-run of validator
4. Constraint shift: after each sprint review, re-diagnose the bottleneck using updated metrics

**Implementation mapping:**
| Source Framework | StartupAI Feature | Status |
|------------------|-------------------|--------|
| Failory decision | Sprint Review (existing) | 95% |
| YC unfair advantage | Report hero insights | Built |
| Ash Maurya constraint shift | **Constraint re-diagnosis** | **0%** |
| SPD Load checklist | **Validation progress view** | **0%** |
| **Canvas confidence badges** | **16-validator-to-lean-canvas (16E)** | **0%** |

---

## Part 3: Risk Taxonomy for StartupAI

### Unified Risk Domain Model

Synthesized from Upsilon IT (10 categories), Siift.ai (5 domains), Product Compass (5 types), and Ash Maurya (3 categories):

```
DESIRABILITY (test first for pre-traction)
├── Problem Risk      → Is this a real, painful problem?
├── Customer Risk     → Can you reach and identify the buyer?
├── Channel Risk      → Is there a viable acquisition path?
└── Value Prop Risk   → Is your offering 10x better?

VIABILITY (test second)
├── Revenue Risk      → Will customers pay enough?
├── Financial Risk    → Can you sustain burn rate to PMF?
├── Market Risk       → Is the market big enough and growing?
└── Competition Risk  → Can you differentiate and defend?

FEASIBILITY (test third)
├── Technical Risk    → Can you build it? At scale?
├── Team Risk         → Do you have the right people?
└── Operational Risk  → Can you deliver consistently?

EXTERNAL (monitor continuously)
├── Legal Risk        → IP, compliance, regulatory
├── Pivot Risk        → Can you adapt if wrong?
├── Reputational Risk → Data privacy, trust, ethics
└── Exit Risk         → Valuation, acquisition readiness
```

### Mapping to Lean Canvas Boxes

| Risk Domain | Canvas Box | Priority (Pre-Traction) |
|-------------|-----------|:-----------------------:|
| Problem Risk | Problem | 1 (highest) |
| Customer Risk | Customer Segments | 2 |
| Value Prop Risk | Unique Value Proposition | 3 |
| Channel Risk | Channels | 4 |
| Revenue Risk | Revenue Streams | 5 |
| Competition Risk | Unfair Advantage | 6 |
| Technical Risk | Solution + Key Metrics | 7 |
| Financial Risk | Cost Structure | 8 |
| Team Risk | (not on canvas) | 9 |
| Operational Risk | Key Activities / Resources | 10 |

**Rule (from Ash Maurya):** For pre-traction startups, always validate desirability (boxes 1-4) before viability (5-6) or feasibility (7-8). You don't need a product to test desirability — just a value proposition.

---

## Part 4: Validation Methods Matrix

### Method Selection by Risk Type

Synthesized from Iterative.vc (5 methods), FI.co (4 methods), Failory (3 pathways), and Startup Grind (6 steps):

| Method | Cost | Time | Info Value | Best For | StartupAI Feature |
|--------|:----:|:----:|:----------:|----------|-------------------|
| **Online Research** | Free | Hours | Low | Market size, competitors, trends | Research Agent (built) |
| **Surveys** | Low | Days | Low | Initial signal, broad patterns | Experiments Lab template |
| **Customer Interviews** | Low | 1-2 weeks | Medium | Problem validation, pain discovery | Smart Interviewer (planned) |
| **Landing Page / Fake Door** | Medium | Days | **High** | Demand validation, messaging test | Experiments Lab template |
| **Mockup / Prototype** | Medium | 1-2 weeks | Medium | UX validation, concept testing | Experiments Lab template |
| **Pre-Sales** | Medium | 2-4 weeks | **Very High** | Willingness to pay, PMF signal | Experiments Lab template |
| **Actual Usage / MVP** | High | 4-8 weeks | Very High | Product-market fit confirmation | Sprint Plan (built) |

### Decision Tree: Which Method?

```
Is this a DESIRABILITY risk?
  ├─ YES → Have you talked to 10+ people?
  │         ├─ NO  → Customer Interview (low cost, medium value)
  │         └─ YES → Do interviews confirm the pain?
  │                   ├─ NO  → PIVOT or KILL
  │                   └─ YES → Fake Door / Landing Page (medium cost, high value)
  │                            └─ Did people sign up / click buy?
  │                                 ├─ NO  → Revise value prop, retest
  │                                 └─ YES → Pre-Sell (medium cost, very high value)
  │                                           └─ Did people PAY?
  │                                                ├─ NO  → Niceness gap — pivot
  │                                                └─ YES → BUILD MVP
  │
  └─ NO → Is this a VIABILITY risk?
           ├─ YES → Financial modeling + competitor revenue analysis
           └─ NO  → FEASIBILITY → Technical spike / prototype
```

### The Niceness Gap (from Failory)

The gap between verbal endorsement and actual payment. Critical concept for StartupAI to surface:
- People saying "I'd use that" = low signal
- People joining a waitlist = medium signal
- People paying money = high signal
- People referring others = very high signal

**Recommendation:** Add "Signal Strength" to experiment results: verbal → signup → payment → referral.

---

## Part 5: Implementation Roadmap for StartupAI

### What's Already Built (leverage these)

| Feature | Phase Coverage | Gap |
|---------|:-------------:|-----|
| Validator Chat | Phase 1 | No hypothesis framing |
| Validator Report (14 sections) | Phase 1-2 | Assumptions read as facts |
| Risk Heatmap | Phase 3 | Binary scoring, no methods |
| Lean Canvas | Phase 5 | No validation evidence |
| Sprint Plan | Phase 5 | No constraint-driven focus |
| Experiments Lab | Phase 4 | 45%, no risk connection |

### Prompt Implementations (ready to build)

| Prompt | Phase | What It Adds | Effort |
|--------|:-----:|--------------|:------:|
| **17A** Risk Schema Enhancement | 3 | Numerical scoring, domains, methods, TOC constraint | S |
| **17B** RiskHeatmapV2 | 3 | Positioned dots, validation queue, domain coverage | M |
| **17C** ValidationMethodBadge | 3-4 | Reusable cost/value badge | XS |
| **17D** Wiring | 3 | Connect enhanced data to UI | S |
| **17E** Experiments Deep Link | 3→4 | "Test This" → pre-filled experiment | S |
| **16A** Canvas Migration | 5 | validation_report_id FK | XS |
| **16B** Validator-to-Canvas EF | 1→5 | Auto-generate canvas from report | M |
| **16C-E** Canvas UI + Banner | 5 | Confidence badges, source banner | M |
| **05-EXP** Experiments Lab Full Build | 4 | Templates, evidence log, coaching | M |
| **15A-G** Magic Quadrant | 2 | Gartner-style competitive landscape | M |

### Recommended Build Order

```
Sprint 1 (Week 1-2): Risk Engine
  17A → 17C → 17B → 17D → 17E
  Impact: Transforms Section 5 from static list → actionable prioritized queue

Sprint 2 (Week 3-4): Report-to-Action Bridge
  16A → 16B → 16C → 16D → 16E
  Impact: Report auto-generates Lean Canvas with confidence badges

Sprint 3 (Week 5-6): Experiments Engine
  005-EXP full build (templates, evidence log, coaching)
  Impact: Founders can run structured experiments from risk queue

Sprint 4 (Week 7-8): Competitive Intelligence
  15A → 15B → 15C → 15D → 15E → 15F → 15G
  Impact: Gartner-style competitive landscape with SWOT + features
```

---

## Part 6: Cognitive Bias Defense

From Siift.ai's founder protection research — biases that derail validation:

| Bias | How It Hurts | StartupAI Defense |
|------|-------------|-------------------|
| **Confirmation Bias** | Founders seek data that confirms their idea | `counter_signal` field shows why assumptions might fail |
| **Optimism Bias** | Overestimate market size, underestimate costs | SAM > TAM validation, financial projections with ranges |
| **Sunk Cost Fallacy** | Keep building despite negative evidence | Explicit "kill" recommendation when score < 40 |
| **Survivorship Bias** | Copy successful startups without understanding context | Competitor SWOT shows full landscape, not just winners |
| **Anchoring** | First data point dominates thinking | Show confidence ranges, not single numbers |
| **Bandwagon Effect** | Chase trends without differentiation | Unfair advantage scoring, uniqueness dimension |

**Key principle:** The validator report should be a "smart friend who tells you what you don't want to hear" — honest about risks, specific about consequences, and actionable about next steps.

---

## Appendix A: Sources Analyzed

### Primary Sources (fetched and analyzed)

1. **HBS Market Validation** — 5-step process: goals → market size → search volume → interviews → test
2. **Lean Market Validation** (Jim Semick / ProductPlan) — 10 rapid testing methods
3. **Startup Grind** (Mitchell Harper) — Zero-cost 6-step: problem → tier-1 → solutions → pain → budget → roadmap
4. **Failory 4-Step** — Pre-selling: SMART goal → MVO → pre-sell → analyze (niceness gap concept)
5. **SPD Load** — 7-step with real-value checklist
6. **VV7D** (Venture Validator) — 7-step data-backed discovery with PMF scoring
7. **FI.co 3 Steps** — Possibility (1-5) x Impact (1-10) scoring, 9 BMC components
8. **Ash Maurya / Leanstack** — Theory of Constraints, Customer Factory, acquisition-first for pre-traction
9. **LeanFoundry GO-LEAN** — 6-step mnemonic: Goal-Obstacle-Learn-Experiment-Analyze-Next
10. **Assumption Prioritization Canvas** (Product Compass) — 5 risk domains, Impact x Risk axes
11. **Riskiest Assumption Canvas** (David Bland / UX Design) — Single riskiest assumption → experiment
12. **Value Proposition Canvas** (Strategyzer) — Jobs/Pains/Gains ↔ Products/Relievers/Creators
13. **YC / Kevin Hale** — Startup ideas as growth hypotheses, 5 unfair advantages
14. **Arnab Ray** — Visual strength/weakness/risk framework
15. **Upsilon IT** — 10 risk categories, 6-step management process
16. **Siift.ai Founder Risks** — 5 founder domains, cognitive bias awareness
17. **Iterative.vc 5 Methods** — Cost/value matrix for validation methods
18. **Hexa Validation** (eFounders) — Structured B2B validation with ICP focus

### Links

See `tasks/strategy/links.md` for full URL list.

---

## Appendix B: Key Definitions

| Term | Definition | Source |
|------|-----------|--------|
| **Assumption** | A belief about your business that hasn't been validated with evidence | All frameworks |
| **Riskiest Assumption** | The assumption that, if wrong, would kill the business | Ash Maurya, David Bland |
| **Constraint** | The single bottleneck limiting business growth at any point | Theory of Constraints (Goldratt via Maurya) |
| **Niceness Gap** | The difference between people saying "great idea" and paying money | Failory |
| **Tier 1 Problem** | A problem that ranks in the customer's top 3 priorities | Startup Grind |
| **Fake Door** | A landing page or feature that looks real but measures intent before building | Iterative.vc |
| **Customer Factory** | The 5-step pipeline: Awareness → Acquisition → Activation → Retention → Revenue | Ash Maurya |
| **Unfair Advantage** | Something that cannot be easily copied: expertise, network effects, data, brand | YC / Kevin Hale |
| **Signal Strength** | Evidence quality: verbal < signup < payment < referral | Failory + synthesis |
| **Pre-traction** | Before any paying customers or measurable acquisition | Ash Maurya |

---

*v1.0 — Initial strategy document synthesizing 18 validation frameworks into 5-phase engine for StartupAI. Created 2026-02-13.*
