# Prompt 10 — Auto-Generate Lean Canvas from Validation Report

> **Source:** Validator Pipeline Output → Lean Canvas (9 blocks) | **Priority:** P1 | **Phase:** Report Completeness
> **Depends on:** Existing Lean Canvas module (`LeanCanvas.tsx`, `useLeanCanvas.ts`)

### Progress Tracker

| # | Task | Status | % | Blocker / Note |
|---|------|:------:|--:|----------------|
| LC1 | Map validator output to 9 Lean Canvas blocks | 🔴 Not Started | 0% | Data exists in pipeline — no mapping logic |
| LC2 | Auto-generate canvas after report completes | 🔴 Not Started | 0% | No trigger from validator to lean canvas |
| LC3 | Link report and canvas bidirectionally | 🔴 Not Started | 0% | No relationship between validation_reports and lean_canvases |
| LC4 | Pre-fill canvas with validated, cited data | 🔴 Not Started | 0% | Current AI pre-fill uses generic prompts, not validator data |
| LC5 | "View Lean Canvas" button on report page | 🔴 Not Started | 0% | No navigation from report → canvas |
| **Overall** | **5 tasks** | | **0%** | **Lean Canvas exists standalone — needs validator integration** |

---

## Context

The validation pipeline already produces all the data needed to populate a Lean Canvas. The 7-agent pipeline outputs: target customer, problem, solution, competitive landscape, market sizing, revenue model recommendations, MVP scope, and key risks. The Lean Canvas module already exists with a 9-box grid, inline editing, AI panel, and export. But the two systems are completely disconnected.

The opportunity: when a founder completes a validation report, the system should auto-generate a Lean Canvas pre-filled with validated, evidence-backed data — not generic AI guesses, but grounded insights from the actual analysis.

---

## The 9 Lean Canvas Blocks — Mapped to Validator Data

### How Ash Maurya's Lean Canvas Maps to the 7-Agent Pipeline

| # | Lean Canvas Block | Validator Source Agent | What Gets Pre-filled |
|---|-------------------|----------------------|---------------------|
| 1 | **Problem** | ExtractorAgent + ScoringAgent | Top 3 problems extracted from founder input, validated against market research |
| 2 | **Customer Segments** | ExtractorAgent + ResearchAgent | Target customer from extraction, refined with market sizing data |
| 3 | **Unique Value Proposition** | ExtractorAgent + CompetitorAgent | Differentiation from extraction, validated against competitor gaps |
| 4 | **Solution** | ExtractorAgent + MVPAgent | Core solution features mapped to MVP Phase 1 scope |
| 5 | **Channels** | ResearchAgent + CompetitorAgent | Distribution channels inferred from market research + competitor strategies |
| 6 | **Revenue Streams** | ScoringAgent + ComposerAgent | Revenue model recommendation from scoring + industry benchmarks |
| 7 | **Cost Structure** | MVPAgent + ScoringAgent | MVP build cost + operational cost estimates from agent analysis |
| 8 | **Key Metrics** | ScoringAgent + VerifierAgent | Top 3-5 metrics tied to validation score dimensions |
| 9 | **Unfair Advantage** | CompetitorAgent + ComposerAgent | Competitive moats identified, or "needs development" if none found |

---

## Prompt: Lean Canvas Generation from Validator Output

You are generating a Lean Canvas from a completed startup validation report. The validation pipeline has already analyzed the founder's idea through 7 AI agents. Your job is to translate those findings into the 9 blocks of a Lean Canvas — concise, actionable, evidence-backed.

**Rules:**
- Every block should contain 2-5 bullet points, not paragraphs
- Cite the source agent when possible ("Based on market research..." or "Competitor analysis shows...")
- If a block can't be confidently filled, write "Needs founder input" with a specific question
- The canvas should be immediately useful — a founder should look at it and think "this captures my business model"
- Do not repeat the validation report. The canvas is a distillation, not a copy.

---

### Block 1: Problem

> What are the top 1-3 problems worth solving?

**Data source:** The ExtractorAgent captures the founder's stated problem. The ScoringAgent evaluates problem severity and market need.

**Real-world example — SaaS customer onboarding platform:**
- SaaS companies lose 40-60% of trial signups before activation (industry avg 23% trial-to-paid conversion)
- Manual onboarding emails are generic — same sequence for a solo freelancer and a 50-person team
- Product analytics tools track behavior but don't trigger real-time intervention when users stall

**What to include:**
- The core problem in the founder's words (from extraction)
- Market evidence that validates the problem is real and widespread (from research)
- The cost of the problem to the customer (quantified if possible)

**What NOT to include:**
- The solution (that's Block 4)
- Generic statements like "inefficiency is a problem" — be specific

---

### Block 2: Customer Segments

> Who are the target customers? Who has the problem most acutely?

**Data source:** ExtractorAgent identifies the stated customer. ResearchAgent provides market sizing and segmentation.

**Real-world example — ecommerce personalization SaaS:**
- Primary: Ecommerce managers at DTC fashion brands doing $1M-$20M annual revenue
- Secondary: VP of Marketing who controls tech stack and attribution budgets
- Early adopter: Shopify Plus stores already using Klaviyo for email (data-rich, personalization-curious)
- Market: 185K DTC fashion brands in the US, 28K in the $1M-$20M revenue range

**What to include:**
- Specific customer persona (role, company size, industry)
- Early adopter profile (who would use this first and why)
- Market size of the segment (from ResearchAgent TAM/SAM/SOM)
- The "buyer vs user" distinction if applicable (who pays vs who uses)

---

### Block 3: Unique Value Proposition

> What is the single clear message that makes this worth paying attention to?

**Data source:** ExtractorAgent captures differentiation. CompetitorAgent reveals what competitors don't do.

**Real-world example — fashion returns reduction SaaS:**
- "Cut fashion return rates by 35% with AI-powered size recommendations — before the customer clicks buy"
- Competitor gap: Existing size chart tools use static measurements. True Fit has scale but focuses on enterprise brands (500+ SKUs). No solution works well for mid-market DTC brands with 50-200 SKUs.
- Differentiation: Uses purchase + return data from the brand's own customers, not industry averages

**What to include:**
- One-sentence UVP (clear, specific, measurable if possible)
- The competitor gap this fills (from CompetitorAgent)
- Why this matters to the target customer specifically (not generically)

**What NOT to include:**
- Feature lists (that's Block 4)
- "We use AI" as a value proposition — explain what the AI does for the customer

---

### Block 4: Solution

> What are the top 3 features that address the top problems?

**Data source:** ExtractorAgent captures the solution. MVPAgent defines the MVP scope.

**Real-world example — SaaS subscription analytics tool:**
- Feature 1: Connect Stripe/Chargebee in one click, get a churn prediction dashboard in 60 seconds (addresses: founders manually calculate churn in spreadsheets)
- Feature 2: AI-generated retention playbooks based on cohort behavior (addresses: founders don't know which users are at risk)
- Feature 3: Automated win-back campaigns triggered by predicted churn signals (addresses: founders react to churn after it happens, not before)

**What to include:**
- Map each feature to a specific problem from Block 1
- Use MVPAgent Phase 1 features (not the full product vision)
- Keep to 3-5 features maximum — this is the MVP, not the roadmap

**What NOT to include:**
- Features planned for Phase 2 or 3
- Technical implementation details
- "AI-powered" without explaining what that means for the user

---

### Block 5: Channels

> How will you reach your customer segments?

**Data source:** ResearchAgent identifies market channels. CompetitorAgent reveals how competitors distribute.

**Real-world example — DTC ecommerce analytics SaaS:**
- Primary: Shopify App Store listing (70% of DTC brands discover tools here)
- Secondary: Partnerships with Shopify agencies and ecommerce consultants who recommend tools to clients
- Content: Publish "State of Fashion Ecommerce Returns" annual report to build authority and capture inbound leads
- Events: Sponsor Shoptalk and eTail conferences where DTC brand operators gather

**What to include:**
- How the first 10 customers will find the product (specific, not "digital marketing")
- How competitors reach customers (from CompetitorAgent — reveals what channels work in this market)
- Both acquisition and awareness channels

**If the validator data doesn't include channel information:**
- Write: "Needs founder input: How will your first 10 customers discover you?"
- Suggest 2-3 options based on the startup type (B2B → direct sales/partnerships, B2C → SEO/social/community, Marketplace → supply-side outreach)

---

### Block 6: Revenue Streams

> How will you make money? What will customers pay?

**Data source:** ScoringAgent evaluates business model viability. ComposerAgent recommends revenue models based on market benchmarks.

**Real-world example — SaaS analytics for ecommerce brands:**
- Model: Tiered SaaS — $49/mo (Starter, 1 store), $149/mo (Growth, 3 stores), $399/mo (Scale, unlimited + API)
- Pricing reference: ProfitWell (now Paddle) charges $0-$500/mo, Baremetrics charges $108-$600/mo depending on MRR
- Upsell: Custom integrations and white-label reports for agencies ($99/mo per client)
- Revenue target: 500 paying stores at $120 avg = $60K MRR by end of Y1

**What to include:**
- Primary revenue model (subscription, per-transaction, commission, licensing)
- Pricing range with market justification
- How the price compares to the current alternative (from CompetitorAgent)
- Unit economics if available (LTV, CAC ratio from ScoringAgent)

**If the validator data doesn't include revenue model:**
- Write: "Needs founder input: How are you planning to charge?"
- Suggest 2-3 models common for the startup type with industry benchmarks

---

### Block 7: Cost Structure

> What are the key costs to build and run this business?

**Data source:** MVPAgent estimates build scope. ScoringAgent evaluates capital requirements.

**Real-world example — fashion rental platform:**
- Development: $0 (founder builds MVP) or $20K-$40K (contract developer for 3-4 months)
- Infrastructure: $400-$800/month (cloud hosting, image processing, AI APIs for style matching)
- Inventory: $5K-$15K initial clothing inventory (consignment model reduces capital needed)
- Marketing: $3K-$6K/month (Instagram ads, influencer partnerships for fashion audience)
- Logistics: $2K-$4K/month (dry cleaning, shipping, packaging per rental cycle)

**What to include:**
- Fixed costs (development, infrastructure, compliance)
- Variable costs (per-user costs, API costs, marketing spend)
- The biggest cost risk (the line item that could blow up)
- Burn rate estimate at MVP stage

**What NOT to include:**
- Detailed financial projections (that's in the validation report's Financials section)
- Optimistic-only estimates — include realistic ranges

---

### Block 8: Key Metrics

> What key numbers tell you this business is working?

**Data source:** ScoringAgent dimensions map directly to measurable metrics. VerifierAgent confirms which metrics have data behind them.

**Real-world example — online fashion resale marketplace:**
- Activation: % of sellers who list 5+ items within 14 days of signup (target: 30%)
- Retention: % of buyers who make a second purchase within 90 days (target: 35%)
- Supply health: Average items per seller and time-to-first-sale (target: <7 days)
- Unit economics: Revenue per transaction after seller payout and shipping costs (target: $12+)
- NPS: Buyer satisfaction score (target: 45+ to drive repeat purchases and word-of-mouth)

**What to include:**
- 3-5 metrics tied to the validation score dimensions
- Specific targets (not just "track growth" — give numbers)
- Leading indicators (metrics that predict success) not just lagging (revenue, users)
- The one metric that matters most right now (the "North Star")

**Mapping from validator scores to metrics:**
| Validator Dimension | Lean Canvas Metric |
|--------------------|--------------------|
| Market Size score | TAM penetration rate |
| Competition score | Win rate vs alternatives |
| Business Model score | Unit economics (LTV:CAC) |
| Timing score | Growth rate (MoM) |
| Differentiation score | NPS or retention rate |
| Feasibility score | Time to MVP launch |

---

### Block 9: Unfair Advantage

> What do you have that cannot be easily copied or bought?

**Data source:** CompetitorAgent identifies competitive moats. ComposerAgent assesses defensibility.

**Real-world example — SaaS churn prediction platform:**
- Proprietary dataset: 2M anonymized subscription events from 500 SaaS companies trained on churn patterns (competitors would need 18+ months to build equivalent data)
- Integration depth: Native Stripe/Chargebee/Recurly integrations with real-time webhooks (6-month engineering head start)
- Community lock-in: SaaS Metrics Benchmarks community with 3K founders sharing anonymized data — network effect grows the prediction model

**Real-world example — when there's no unfair advantage yet (honest):**
- "No defensible moat at this stage — the idea can be replicated by a well-funded competitor in 3-6 months"
- Potential moats to build: network effects (if marketplace), data advantage (if AI), regulatory approval (if healthcare/fintech), brand loyalty (if consumer)
- Founder note: "This is the weakest block — needs deliberate moat-building strategy in the first 12 months"

**What to include:**
- Honest assessment — most early-stage startups don't have an unfair advantage yet, and that's okay
- If the CompetitorAgent found a gap nobody else fills, highlight it
- If no moat exists, list 2-3 potential moats the founder could build over time
- Personal advantages: founder expertise, existing network, early customer relationships

---

## Integration Design

### When the Lean Canvas Gets Generated

**Trigger:** After the VerifierAgent completes and the validation report is ready.

**Flow:**
1. Validation pipeline completes → report saved to `validation_reports` table
2. System maps agent outputs to the 9 Lean Canvas blocks using the prompt above
3. New lean canvas record created, linked to `validation_report_id`
4. Report page shows "View Your Lean Canvas" button
5. Lean Canvas page loads with pre-filled, validated data
6. Founder can edit any block (existing inline editing works)

### What the Founder Sees

On the validation report page, after the scores and recommendations:

> **Your Business Model Canvas**
> We've translated your validation results into a Lean Canvas — your one-page business model. Every block is pre-filled with findings from the analysis.
>
> [View Lean Canvas →]

On the Lean Canvas page, a banner shows:
> "This canvas was generated from your validation report (Score: 72, CAUTION). Blocks highlighted in yellow need your input."

### Data Quality Indicators

Each block shows a confidence badge:
- 🟢 **Validated** — Data from multiple agents, grounded in research (Problem, Customer, Competition)
- 🟡 **Inferred** — Estimated from available data, founder should verify (Revenue, Costs, Channels)
- 🔴 **Needs Input** — Not enough data to fill confidently, founder must complete (Unfair Advantage, some Metrics)

### Bidirectional Link

- From report → "View Lean Canvas" button navigates to the canvas
- From canvas → "View Validation Report" link in the AI panel sidebar
- Editing the canvas does NOT change the validation report (they're separate artifacts)
- Re-running validation offers to update the existing canvas or create a new one

---

## Real-World Example: Complete Canvas from Validation

**Founder input:** "AI-powered size recommendation tool for DTC fashion brands that reduces returns by predicting the right fit before purchase"

**After 7-agent pipeline runs, the auto-generated canvas:**

| Block | Content | Confidence |
|-------|---------|:----------:|
| **Problem** | 1. Fashion ecommerce returns average 30-40%, costing brands $15-25 per return in shipping and processing. 2. Size charts are static and inaccurate — 52% of returns are due to poor fit. 3. Return-related losses cost the US fashion industry $40B+ annually. | 🟢 |
| **Customer Segments** | DTC fashion brands on Shopify, 50-500 SKUs, $1M-$20M revenue. Early adopter: brands already tracking return reasons or experiencing >35% return rates. Market: 28K fashion DTC brands in target segment (US). | 🟢 |
| **UVP** | "Cut fashion returns 35% with AI-powered size predictions — trained on your customers' actual purchase and return data" | 🟡 |
| **Solution** | 1. Auto-analyze return reasons and purchase data to build brand-specific size models. 2. Show personalized size recommendations on product pages in real time. 3. Dashboard showing predicted vs actual return rates by product and size. | 🟢 |
| **Channels** | Direct: Shopify App Store listing. Outbound: Email DTC brand operators from ecommerce communities. Content: "Fashion Returns Reduction Playbook" for SEO. | 🟡 |
| **Revenue Streams** | SaaS: $99-$299/mo based on monthly orders. Pricing reference: True Fit charges enterprise-only, Kiwi Sizing charges $50-$200/mo. Target: $149/mo mid-market (underserved segment). | 🟡 |
| **Cost Structure** | Dev: $0 (founder builds). Infra: $500/mo (cloud + ML model hosting). Marketing: $3K/mo. First hire: $8K/mo (part-time sales). Burn: $11.5K/mo. | 🟡 |
| **Key Metrics** | Activation: % brands connecting Shopify within 3 days (target 50%). Retention: Monthly churn < 4%. Impact: Measured return rate reduction vs baseline. Revenue: $149 ARPU x churn = LTV of $3,725. | 🟢 |
| **Unfair Advantage** | None yet. Potential moats: proprietary fit prediction model trained on brand-specific return data (6-12 months to build), Shopify integration partnerships as distribution lock-in. | 🔴 |

---

## Acceptance Criteria

- Lean Canvas auto-generated when validation report completes
- All 9 blocks populated from validator agent outputs
- Confidence badges (🟢 🟡 🔴) shown per block
- "View Lean Canvas" button visible on the report page
- "View Validation Report" link visible on the canvas page
- Founder can edit any block after generation (existing editing preserved)
- Blocks marked 🔴 prompt the founder with a specific question to answer
- Canvas stored in database, linked to the validation report
- Re-validation offers to update or create new canvas
