# Fundraising Strategy

> **Pipeline stage:** Composer Group D | **Merged from:** fundraising, startup-expertise

## When to Use

- Assessing fundraising readiness by stage (pre-seed, seed, Series A)
- Building investor targeting and fit-scoring features
- Creating pitch deck structure and presentation flow
- Organizing data rooms for due diligence
- Analyzing term sheets for red flags and negotiation points
- Applying YC best practices to fundraising narratives
- Using industry playbooks to frame investor conversations
- Guiding founders through stage-appropriate milestones

---

## 1. Readiness Assessment

Fundraising proceeds through five gated phases. Each gate must be cleared before advancing.

```
PHASE 1: READINESS ASSESSMENT
├── Investment readiness checklist
├── Gap analysis (metrics, docs, team)
├── Stage-appropriate benchmarks
└── GATE: Readiness score >= 70% -> Proceed

PHASE 2: MATERIALS PREPARATION
├── Pitch deck (industry-specific)
├── One-pager / Executive summary
├── Financial model
├── Data room setup
└── GATE: All docs complete -> Proceed

PHASE 3: INVESTOR TARGETING
├── Build investor list (50+ matched)
├── Prioritize by fit/activity
├── Personalization research
└── GATE: Target list approved -> Proceed

PHASE 4: OUTREACH & PIPELINE
├── Personalized email sequences
├── Pipeline tracking (stage, follow-ups)
├── Meeting prep / debrief
└── GATE: Term sheet received -> Proceed

PHASE 5: CLOSE
├── Term sheet analysis
├── Due diligence management
├── Negotiation support
└── CLOSE: Funds wired
```

### Pre-Seed Readiness (7 Categories)

| Category | Requirement | Weight |
|----------|-------------|--------|
| **Problem** | Clear who/struggle/why-now | 20% |
| **Solution** | Working prototype or mockup | 15% |
| **Team** | Founder-market fit evident | 20% |
| **Market** | TAM/SAM/SOM estimated | 10% |
| **Traction** | Early signals (waitlist, LOIs) | 15% |
| **Ask** | Clear use of funds | 10% |
| **Materials** | Deck + one-pager ready | 10% |

### Seed Readiness (7 Categories)

| Category | Requirement | Weight |
|----------|-------------|--------|
| **Product** | MVP in market | 15% |
| **Traction** | 100+ users or $10K MRR | 25% |
| **Metrics** | CAC, LTV, retention tracked | 15% |
| **Team** | 2+ founders, key hires identified | 15% |
| **Market** | Competitive analysis complete | 10% |
| **Financial** | 18-month projection | 10% |
| **Materials** | Deck, data room, model ready | 10% |

### Series A Readiness (7 Categories)

| Category | Requirement | Weight |
|----------|-------------|--------|
| **ARR** | $1M+ ARR | 25% |
| **Growth** | 10%+ MoM growth | 20% |
| **Unit Economics** | LTV:CAC 3:1+, payback <12mo | 20% |
| **Team** | Full founding team, key hires | 10% |
| **Market** | Clear path to $100M+ | 10% |
| **Retention** | NRR 100%+ | 10% |
| **Materials** | Complete data room | 5% |

### Weighted Scoring Formula

```
readiness_score = SUM(category_score * category_weight)

Where:
- category_score = 0 (not started), 25 (in progress), 50 (partial), 75 (mostly done), 100 (complete)
- category_weight = from the tables above (must sum to 100%)
- GATE threshold = 70% to proceed to next phase
```

---

## 2. Investor Matching

### Fit Score Algorithm (0-100)

Six matching factors with weighted scoring:

| Factor | Points | Condition |
|--------|--------|-----------|
| **Stage match** | 25 | Investor's active stages include startup's current stage |
| **Industry match** | 25 | Investor's focus industries include startup's industry |
| **Check size match** | 20 | Investor's typical check >= 10% of raise amount |
| **Geography match** | 10 | Investor and startup in same geography |
| **Recent activity** | 10 | Investor made an investment in last 90 days |
| **Portfolio synergy** | 10 | Complementary companies in investor's portfolio |

```
fit_score = stage_match(25) + industry_match(25) + check_size_match(20)
          + geography_match(10) + recent_activity(10) + portfolio_synergy(10)

Tiers:
  80-100 = Strong fit  -> Prioritize outreach
  60-79  = Good fit    -> Include in target list
  40-59  = Moderate    -> Research further before outreach
  0-39   = Weak fit    -> Deprioritize
```

### Personalization Data Points

For each matched investor, collect:

- **Recent investments:** Last 3-5 deals to reference in outreach
- **Shared connections:** Mutual contacts for warm intros
- **Thesis alignment:** How startup maps to investor's stated thesis
- **Relevant content:** Blog posts, tweets, talks showing interest areas

---

## 3. Pitch Deck (12 Slides)

10-minute presentation with time allocations:

| Slide | Content | Time | Key Elements |
|-------|---------|------|--------------|
| 1 | **Cover + One-liner** | 30s | Company name, tagline, logo |
| 2 | **Problem** | 1m | Who suffers, how painful, why now |
| 3 | **Solution** | 1m | How you solve it, key insight |
| 4 | **Market** | 1m | TAM/SAM/SOM with bottoms-up analysis |
| 5 | **Product/Demo** | 2m | Screenshots, demo flow, user experience |
| 6 | **Business Model** | 1m | Revenue streams, pricing, unit economics |
| 7 | **Traction** | 1m | Growth chart, key metrics, milestones |
| 8 | **Competition** | 1m | Competitive landscape, differentiation |
| 9 | **Team** | 1m | Founders, key hires, relevant experience |
| 10 | **Financial Plan** | 1m | 3-year projections, key assumptions |
| 11 | **Ask + Use of Funds** | 30s | Amount, allocation, milestones to hit |
| 12 | **Appendix** | - | Detailed metrics, extra slides for Q&A |

### Slide Design Principles

- One key idea per slide
- Data-driven: every claim has a number
- Visual hierarchy: headline tells the story even if body is skipped
- Consistent branding throughout
- Traction slide = most important for seed+ rounds

---

## 4. Data Room (6 Categories)

15+ documents organized for due diligence:

```
DATA ROOM/
├── 01-company/
│   ├── pitch_deck.pdf
│   ├── executive_summary.pdf
│   └── company_overview.pdf
├── 02-financial/
│   ├── financial_model.xlsx
│   ├── historical_financials.pdf
│   └── cap_table.pdf
├── 03-legal/
│   ├── incorporation_docs.pdf
│   ├── ip_assignments.pdf
│   └── material_contracts.pdf
├── 04-product/
│   ├── product_roadmap.pdf
│   ├── technical_architecture.pdf
│   └── demo_video.mp4
├── 05-team/
│   ├── founder_bios.pdf
│   ├── org_chart.pdf
│   └── key_hires_plan.pdf
└── 06-traction/
    ├── metrics_dashboard.pdf
    ├── customer_testimonials.pdf
    └── case_studies.pdf
```

### Data Room Best Practices

- All documents in PDF format (except financial model in .xlsx)
- Version-controlled with dates in filenames for updates
- Access-controlled: share links with expiry and download tracking
- Update metrics monthly; refresh cap table before every meeting
- Include an index/README at root level

---

## 5. Term Sheet Analysis

### Term Sheet Structure

A term sheet contains four key areas to evaluate:

**Valuation:**
- Pre-money valuation
- Post-money valuation (pre-money + investment amount)
- Dilution percentage (investment / post-money)

**Investment:**
- Amount raised
- Security type: SAFE, Convertible Note, or Priced Round
- Lead investor identity and reputation

**Governance:**
- Board composition: founders vs. investors vs. independent seats
- Protective provisions (veto rights on key decisions)
- Drag-along rights (forcing sale)

**Economics:**
- Liquidation preference (standard: 1x non-participating)
- Anti-dilution protection (standard: broad-based weighted average)
- Participation rights (participating vs. non-participating preferred)

### Analysis Framework

```
For each term sheet, evaluate:

1. Valuation Fairness
   - Compare to stage-appropriate multiples
   - Check dilution stays under 20-25% per round
   - Validate against comparable recent deals

2. Governance Balance
   - Founders should retain board majority through Series A
   - Protective provisions should be standard, not excessive
   - Watch for full ratchet anti-dilution (red flag)

3. Economic Terms
   - 1x non-participating = founder-friendly (standard)
   - Participating preferred = investor-friendly (negotiate)
   - >1x liquidation preference = red flag at seed

4. Red Flags
   - Full ratchet anti-dilution
   - >2x liquidation preference
   - Investor board majority before Series B
   - Excessive protective provisions
   - Pay-to-play provisions at seed stage
   - Redemption rights

5. Negotiation Points
   - Identify 2-3 key terms to push back on
   - Prioritize economics over governance at seed
   - Prioritize governance at Series A+
```

---

## 6. YC Success Factors

### Why Startups Succeed (YC Data)

Five weighted factors determine startup success:

| Factor | Weight | How to Measure |
|--------|--------|----------------|
| **Founder-Market Fit** | 30% | Domain expertise, passion, unfair advantage |
| **Problem Clarity** | 25% | Can explain in one sentence, clear pain point |
| **Traction Velocity** | 20% | Week-over-week growth rate |
| **Market Size** | 15% | TAM/SAM/SOM with bottoms-up analysis |
| **Team Completeness** | 10% | Technical + business + domain coverage |

### YC Application Tips

What YC partners look for, in order of importance:

1. **Clarity** - Can you explain your startup in one sentence?
2. **Traction** - What have you built? What do users say?
3. **Insight** - What do you know that others don't?
4. **Determination** - What obstacles have you overcome?
5. **Speed** - How fast do you move?

### Common YC Application Mistakes

- Vague problem description
- No customer quotes or user evidence
- Feature-focused instead of problem-focused
- Unrealistic market size (top-down TAM without bottoms-up validation)
- No unfair advantage articulated

---

## 7. Stage-Appropriate Guidance

### Milestones by Stage

| Stage | Focus | Key Metrics | Core Advice |
|-------|-------|-------------|-------------|
| **Idea** | Problem validation | # interviews, problem severity | "Talk to users" |
| **Pre-Seed** | MVP + early users | Active users, engagement | "Do things that don't scale" |
| **Seed** | Product-market fit | Retention, NPS, growth rate | "Make something people want" |
| **Series A** | Repeatable growth | Unit economics, CAC payback | "Find your growth loop" |

### What Investors Look For at Each Stage

**Idea Stage:**
- Founder conviction and domain expertise
- Large problem in growing market
- Credible plan to build first version
- Investors fund: team + vision

**Pre-Seed:**
- Working prototype with early user feedback
- Evidence of customer pull (waitlist, LOIs, early revenue)
- Clear articulation of why now
- Investors fund: team + early signal

**Seed:**
- Product in market with real usage data
- 100+ users or $10K+ MRR
- Retention curves that flatten (not decline to zero)
- Clear understanding of acquisition channels
- Investors fund: product-market fit evidence

**Series A:**
- $1M+ ARR with 10%+ MoM growth
- Unit economics: LTV:CAC 3:1+, payback <12 months
- Net revenue retention 100%+
- Repeatable, scalable acquisition channel
- Investors fund: proven model + growth capital

### Red Flags That Kill Deals

- Declining or flat metrics presented as "growth"
- Founders who cannot articulate their customer
- Cap table issues (too many investors, high dilution already)
- No clear use of funds beyond "hiring"
- Founder conflict or misaligned commitment levels
- Market size claims without supporting logic
- Ignoring competition or claiming "no competitors"
- Burn rate inconsistent with stage and raise amount

---

## 8. Industry Playbooks

### 19 Available Industries

| Industry ID | Display Name | Key Metrics |
|-------------|--------------|-------------|
| `ai_saas` | AI SaaS / B2B | MRR, CAC, LTV, churn, NRR |
| `fintech` | FinTech | Transaction volume, take rate, compliance |
| `healthcare` | Healthcare | Outcomes, regulatory, reimbursement |
| `fashion_apparel` | Fashion & Apparel | Sell-through, markdown %, inventory |
| `ecommerce_pure` | eCommerce | AOV, conversion, repeat purchase |
| `education` | Education | Enrollment, completion, outcomes |
| `cybersecurity` | Cybersecurity | ARR, net retention, certifications |

Full list of 19 industries available via database query.

### Playbook Fields

Each industry playbook contains:

| Field | Purpose | Fundraising Use |
|-------|---------|----------------|
| `narrative_arc` | Story structure for pitches | Frame deck around industry narrative |
| `investor_expectations` | What investors look for | Tailor metrics and milestones |
| `failure_patterns` | Common mistakes | Proactively address in pitch |
| `benchmarks` | Industry performance benchmarks | Compare startup metrics to standard |
| `terminology` | Industry-specific terms | Speak investor's language |
| `gtm_patterns` | Go-to-market strategies | Show credible path to growth |
| `prompt_context` | AI prompt enhancement | Enrich AI-generated analysis |
| `success_stories` | Examples of exits | Reference in market narrative |
| `decision_frameworks` | How to evaluate opportunities | Structure analysis sections |
| `investor_questions` | FAQ from investors | Prepare for Q&A |
| `warning_signs` | Red flags specific to industry | Address preemptively |
| `stage_checklists` | Stage-specific tasks | Show readiness milestones |
| `slide_emphasis` | Pitch deck guidance | Weight slides by industry norms |

### Using Playbooks for Investor Framing

1. **Load playbook** for the startup's industry
2. **Adapt narrative_arc** to structure the pitch story
3. **Map metrics to benchmarks** so investors can compare
4. **Use terminology** that signals domain expertise
5. **Address failure_patterns** proactively in the pitch
6. **Prepare for investor_questions** specific to the industry
7. **Reference success_stories** to anchor market opportunity

---

## 9. Investor Framing Best Practices

### Narrative Structure for Board-Level Clarity

Every investor conversation should follow this arc:

```
1. CONTEXT    - Market landscape and why now (30 seconds)
2. PROBLEM    - Specific pain, who feels it, cost of status quo
3. INSIGHT    - What you uniquely understand about this problem
4. SOLUTION   - How you solve it differently
5. PROOF      - Traction, metrics, customer evidence
6. SCALE      - How this becomes a large business
7. ASK        - What you need and what you will do with it
```

### Stage-Specific Readiness Signals

Investors pattern-match on signals appropriate to each stage:

| Stage | Strong Signal | Weak Signal |
|-------|--------------|-------------|
| **Pre-Seed** | Paying LOIs, waitlist with emails | "People told me they'd use it" |
| **Seed** | Retention curve that flattens | Downloads without engagement |
| **Series A** | Cohort revenue growth | Total revenue without cohort breakdown |

### How to Frame Market Size

```
BAD:  "The global SaaS market is $200B" (top-down, meaningless)

GOOD: Bottoms-up analysis:
  - 50,000 target companies in our ICP
  - Average contract value: $24,000/year
  - Serviceable market: $1.2B
  - Current penetration: 0.1%
  - Path to 5% = $60M ARR
```

### How to Frame Unit Economics

```
Present clearly:
  - CAC: $X (by channel: paid $Y, organic $Z)
  - LTV: $X (based on N months of data)
  - LTV:CAC ratio: X:1 (target 3:1+)
  - Payback period: N months (target <12)
  - Gross margin: X% (target 70%+ for SaaS)

Show trend: "CAC decreased 15% QoQ as organic grew from 20% to 40%"
```

### How to Frame Risk for Investors

Investors respect founders who acknowledge risks honestly:

```
For each major risk:
  1. Name it explicitly (market, technical, regulatory, team)
  2. Explain what you have done to mitigate it
  3. Show what evidence would change the risk profile
  4. Frame remaining risk as upside opportunity

Example: "Regulatory risk exists in healthcare. We have hired a compliance
lead, obtained SOC 2 Type II, and our first two hospital customers passed
security review in <30 days. The regulatory moat is actually our advantage."
```

---

## 10. TypeScript Implementations

Concrete type definitions and scoring functions for fundraising features.

### InvestorMatch Interface

```typescript
interface InvestorMatch {
  investor_id: string;
  name: string;
  firm: string;
  fit_score: number;  // 0-100
  factors: {
    stage_match: boolean;
    industry_match: boolean;
    check_size_match: boolean;
    geography_match: boolean;
    recent_activity: boolean;
    portfolio_synergy: boolean;
  };
  personalization: {
    recent_investments: string[];
    shared_connections: string[];
    relevant_tweets: string[];
    thesis_alignment: string;
  };
}
```

### scoreInvestorFit Implementation

```typescript
function scoreInvestorFit(startup: Startup, investor: Investor): number {
  let score = 0;
  if (investor.stages.includes(startup.stage)) score += 25;
  if (investor.industries.includes(startup.industry)) score += 25;
  if (investor.check_size >= startup.raise_amount * 0.1) score += 20;
  if (investor.geography === startup.geography) score += 10;
  if (investor.last_investment_days < 90) score += 10;
  if (hasPortfolioSynergy(startup, investor)) score += 10;
  return score;
}
```

### TermSheet Interface

```typescript
interface TermSheet {
  valuation: {
    pre_money: number;
    post_money: number;
    dilution: number;
  };
  investment: {
    amount: number;
    security_type: 'SAFE' | 'Convertible' | 'Priced';
    lead_investor: string;
  };
  governance: {
    board_seats: { founders: number; investors: number; independent: number };
    protective_provisions: string[];
    drag_along: boolean;
  };
  economics: {
    liquidation_preference: string; // "1x non-participating"
    anti_dilution: string; // "broad-based weighted average"
    participation: boolean;
  };
}
```

### analyzeTermSheet Implementation

```typescript
function analyzeTermSheet(terms: TermSheet): TermSheetAnalysis {
  return {
    valuation_fair: assessValuation(terms.valuation),
    governance_balanced: assessGovernance(terms.governance),
    economics_standard: assessEconomics(terms.economics),
    red_flags: identifyRedFlags(terms),
    negotiation_points: suggestNegotiations(terms)
  };
}
```

---

## 11. Edge Functions & AI Models

### Edge Function: `fundraising-agent`

Six actions available through the fundraising edge function:

```typescript
// Actions
- 'assess_readiness': Check fundraising readiness by stage
- 'match_investors': Find and score investor matches
- 'generate_deck': Create industry-specific pitch deck
- 'setup_dataroom': Generate data room structure
- 'analyze_terms': Review term sheet for red flags
- 'personalize_outreach': Create personalized investor emails
```

### AI Model Selection

| Task | Model | Rationale |
|------|-------|-----------|
| Readiness assessment | `gemini-3-flash-preview` | Fast structured checklist evaluation |
| Investor matching | `gemini-3-pro-preview` | Deep analysis of fit factors and personalization |
| Deck generation | `claude-sonnet-4-5` | Narrative quality for pitch storytelling |
| Term sheet analysis | `claude-sonnet-4-5` | Nuanced legal/financial reasoning |
| Outreach personalization | `gemini-3-pro-preview` | Research synthesis and tone matching |

---

## Related Skills

- `startup-metrics` - Metrics tracking and benchmarking
- `financial-modeling` - Financial projections and models
- `competitive-strategy` - Competition analysis frameworks
- `go-to-market` - GTM strategy and execution
