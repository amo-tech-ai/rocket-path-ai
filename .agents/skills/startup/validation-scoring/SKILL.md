# Validation Scoring

> **Pipeline stage:** ScoringAgent | **Merged from:** startup-idea-validation, startup-metrics, startup-expertise

Evidence-based scoring engine for startup ideas. 9-dimension scorecard, 15-domain risk taxonomy, 5-phase validation workflow, stage-appropriate benchmarks, and deterministic scoring formulas. Synthesized from 18 frameworks (HBS, YC, Ash Maurya, Strategyzer, Failory, FI.co).

## When to Use

| If the user asks... | Produce... |
|---|---|
| "Validate this idea" / "Is this worth building?" | Full 5-phase validation + scorecard + verdict |
| "Score this idea" / "Run the scorecard" | 9-dimension deterministic scorecard |
| "What's the riskiest assumption?" | Risk taxonomy + constraint identification |
| "How should I test this?" / "Design an experiment" | Validation ladder + experiment card |
| "Should I build X or Y?" | Comparative scorecard (score both, compare verdicts) |
| "Am I being biased?" / "Devil's advocate" | Bias check + counter-signals |
| "Calculate unit economics" / "What metrics should I track?" | Stage-appropriate KPI list + formulas |
| "Health score for my startup" | 5-dimension health score with stage weights |

## Intake Checklist (Ask First)

- One-sentence idea + target user + job-to-be-done
- Business model: B2B/B2C, SaaS/usage-based/marketplace/services, ACV range
- Geography, constraints (regulated domain, data access, procurement)
- Target outcome: venture-scale, profitable small business, or thesis-driven R&D
- Current evidence: interviews, pilots, pre-sales, traffic, competitors, pricing assumptions

---

## 1. 9-Dimension Scorecard

| Dimension | Weight | What It Measures |
|---|---:|---|
| Problem Severity | 15% | Urgency, cost of inaction, current workarounds |
| Market Size | 12% | Sufficient demand for the target outcome |
| Market Timing | 10% | Clear "why now" and tailwinds |
| Competitive Moat | 12% | Defensibility over time |
| Unit Economics | 15% | Profit path (payback, margins, LTV:CAC) |
| Founder-Market Fit | 8% | Access, expertise, execution capability |
| Technical Feasibility | 10% | Buildability, dependencies, constraints |
| GTM Clarity | 10% | ICP, channels, motion, first customers |
| Risk Profile | 8% | What can kill it and likelihood |

### Verdict Thresholds

| Score Range | Verdict | Meaning |
|---|---|---|
| 80-100 | **GO** | Strong foundation, proceed to build |
| 60-79 | **CONDITIONAL** | Validate riskiest assumption (RAT) first |
| 40-59 | **PIVOT** | Core hypothesis needs rework |
| < 40 | **NO-GO** | Significant pivot or kill |

### Deterministic Scoring Formula

```
overall_score = round(clamp(sum(dimension_score[i] * weight[i] / 100) + bias_correction, 0, 100))
```

**Pipeline implementation weights** (7-dimension variant used in `scoring-math.ts`):

| Dimension | Key | Weight |
|---|---|---:|
| Problem Clarity | `problemClarity` | 15% |
| Solution Strength | `solutionStrength` | 15% |
| Market Size | `marketSize` | 15% |
| Competition | `competition` | 10% |
| Business Model | `businessModel` | 15% |
| Team Fit | `teamFit` | 15% |
| Timing | `timing` | 15% |

**Pipeline verdict thresholds:** `75-100` GO | `50-74` CAUTION | `0-49` NO-GO

### Factor Status Derivation

Factor scores (1-10) from LLM map to status labels:

| Score Range | Status |
|---|---|
| 7-10 | `strong` |
| 4-6 | `moderate` |
| 1-3 | `weak` |

### Processing Steps

1. **Clamp** each dimension score to `[0, 100]`
2. **Compute** weighted average using dimension weights
3. **Apply** bias correction (starts at 0, calibrate after 20+ runs)
4. **Clamp** result to `[0, 100]`, round to nearest integer
5. **Derive** verdict from threshold table
6. **Derive** factor statuses from factor scores
7. **Build** `scores_matrix` for frontend rendering

### Bias Correction

- Starts at `0` (no correction)
- `metadata.raw_weighted_average` stored for auditing
- After 20+ runs, compare against human baseline and adjust

---

## 2. Evidence Grading

### A/B/C/D Hierarchy

| Grade | Source | Weight |
|:---:|---|:---:|
| **A** | Customer payment, usage data, signed LOI | High |
| **B** | Customer interview (behavioral question), waitlist signup | Medium |
| **C** | Survey response, industry report, expert opinion | Low |
| **D** | Founder intuition, analogy to other markets | Very Low |

### Signal Strength Hierarchy

```
verbal (low) < signup (medium) < payment (high) < referral (very high)
```

An idea is **NOT validated** until you have payment-level signal.

### Triangulation Requirement

- Every claim requires 2+ independent sources
- Especially critical for market sizing and competitor claims
- Strong evidence = behavioral commitment with cost (time, money, switching)
- Weak evidence = opinions and hypotheticals

### Counter-Signal Requirement

For every positive finding, require at least one counter-signal:
- Market is large -> but growth is slowing in segment X
- Customers express pain -> but current workarounds are "good enough" for 60%
- No direct competitors -> but adjacent players could enter easily

---

## 3. 15-Domain Risk Taxonomy

Full taxonomy in [references/risk-taxonomy.md](references/risk-taxonomy.md).

### Domain Categories

```
DESIRABILITY (test first for pre-traction startups)
  Problem Risk       Is this a real, painful, frequent problem?
  Customer Risk      Can you identify, reach, and convert the buyer?
  Channel Risk       Is there a viable, scalable acquisition path?
  Value Prop Risk    Is your offering 10x better than alternatives?

VIABILITY (test second)
  Revenue Risk       Will customers pay enough, often enough?
  Financial Risk     Can you sustain burn rate to PMF?
  Market Risk        Is the market large enough and growing?
  Competition Risk   Can you differentiate and defend position?

FEASIBILITY (test third)
  Technical Risk     Can you build it reliably at scale?
  Team Risk          Do you have the right people and skills?
  Operational Risk   Can you deliver consistently post-launch?

EXTERNAL (monitor continuously)
  Legal Risk         IP, compliance, regulatory barriers
  Pivot Risk         Can you adapt if core assumptions fail?
  Reputational Risk  Data privacy, trust, ethics concerns
  Exit Risk          Acquisition readiness, valuation path
```

### Composite Risk Scoring

```
RISK SCORE = Impact (1-10) x Probability (1-5) = 0-50

Impact:       1-3 = inconvenient  |  4-6 = serious  |  7-10 = fatal
Probability:  1 = very unlikely   |  3 = coin flip   |  5 = very likely
```

| Score | Severity | Action |
|---:|---|---|
| 35-50 | Fatal | Must validate before ANY building |
| 20-34 | High | Validate within current sprint |
| 10-19 | Medium | Monitor, validate when convenient |
| 1-9 | Low | Accept the risk, move on |

### Prioritization Rules

1. **Pre-traction -> desirability risks first** (Ash Maurya Theory of Constraints)
2. **Within domain -> highest risk score first** (FI.co scoring)
3. **Equal scores -> cheapest-to-test first** (Iterative.vc cost optimization)
4. **Max 5 active risks in validation queue** (cognitive load management)

### Theory of Constraints (TOC)

```
Constraint shifts as you validate:
  Pre-traction  ->  Acquisition (Do people want this?)
  Early traction ->  Activation (Do they get value quickly?)
  Growing        ->  Retention (Do they come back?)
  Scaling        ->  Revenue (Does unit economics work at scale?)
```

After each validation cycle, re-diagnose the constraint.

---

## 4. Validation Ladder

| Step | Goal | Strong Signal | Method |
|---|---|---|---|
| **Interviews** | Validate problem + context | Repeated pain with real workarounds | 10+ conversations |
| **Smoke test** | Validate demand | Qualified conversion with price shown | Landing page, 5%+ signup |
| **Concierge/WoZ** | Validate workflow | Users complete the job and return | Manual delivery |
| **Paid pilot** | Validate willingness-to-pay | Paid, renewed, or expanded | Real pricing |

### AI/Automation Validation

If the idea depends on AI, validate explicitly:
- **Data rights:** Can you legally and reliably access required data?
- **Reliability:** Define success metrics, failure modes, and human fallback
- **Cost-to-serve:** Model inference + retrieval + human-in-the-loop costs

---

## 5. Five-Phase Validation Workflow

```
ARTICULATE -> ASSESS -> PRIORITIZE -> TEST -> DECIDE
"What do I    "How big    "What's the   "Does evidence  "Go, pivot,
 believe?"     is the      #1 risk?"      support it?"    or kill?"
               risk?"
```

### Phase 1: ARTICULATE -- Write Down Assumptions

Frame every belief as a hypothesis:
> "We believe [X] because [evidence]. If wrong, [consequence]."

Separate facts (verified) from assumptions (unverified). Assign confidence: high / medium / low.

### Phase 2: ASSESS -- Research the Landscape

Minimum 10-15 web searches across 5 dimensions:
1. Market opportunity (TAM/SAM/growth)
2. Competitive landscape (direct, indirect, adjacent)
3. Problem validation (pain points, behavior, spend)
4. Trends (technology, regulatory, investment)
5. Business model (pricing, unit economics, channels)

### Phase 3: PRIORITIZE -- Find the #1 Risk

Score each assumption: **Impact (1-10) x Probability (1-5) = 0-50**

Rules: desirability first (pre-traction) -> highest score -> cheapest-to-test -> max 5 active.

### Phase 4: TEST -- Run the Cheapest Effective Experiment

Pre-register pass/fail thresholds before running. Use signal strength hierarchy to select method.

### Phase 5: DECIDE -- Verdict

Score all dimensions, apply evidence quality. Produce decision memo with GO / CONDITIONAL / PIVOT / NO-GO.

---

## 6. Health Score Calculation

5 dimensions weighted by startup stage. Produces overall score 0-100.

### Dimensions

| Dimension | What It Measures |
|---|---|
| Product | Feature completeness, user feedback |
| Market | Competition, timing, size |
| Team | Completeness, experience |
| Traction | Growth rate, engagement |
| Financial | Runway, unit economics |

### Stage Weights

| Dimension | Idea Stage | Seed Stage | Series A |
|---|---:|---:|---:|
| Product | 30% | 25% | 20% |
| Market | 30% | 20% | 15% |
| Team | 20% | 15% | 15% |
| Traction | 10% | 25% | 25% |
| Financial | 10% | 15% | 25% |

**Key insight:** At idea stage, product and market dominate. As you progress, traction and financial take over.

---

## 7. YC Success Factors

| Factor | Weight | How to Measure |
|---|---:|---|
| **Founder-Market Fit** | 30% | Domain expertise, passion, unfair advantage |
| **Problem Clarity** | 25% | Can explain in one sentence, clear pain point |
| **Traction Velocity** | 20% | Week-over-week growth rate |
| **Market Size** | 15% | TAM/SAM/SOM with bottoms-up analysis |
| **Team Completeness** | 10% | Technical + business + domain coverage |

### What YC Partners Look For

1. **Clarity** -- Can you explain your startup in one sentence?
2. **Traction** -- What have you built? What do users say?
3. **Insight** -- What do you know that others don't?
4. **Determination** -- What obstacles have you overcome?
5. **Speed** -- How fast do you move?

### Common Mistakes

- Vague problem description
- No customer quotes
- Feature-focused instead of problem-focused
- Unrealistic market size (top-down TAM)
- No unfair advantage articulated

### Stage-Appropriate YC Advice

| Stage | Focus | Key Metrics | YC Advice |
|---|---|---|---|
| Idea | Problem validation | # interviews, problem severity | "Talk to users" |
| Pre-seed | MVP + early users | Active users, engagement | "Do things that don't scale" |
| Seed | Product-market fit | Retention, NPS, growth rate | "Make something people want" |
| Series A | Repeatable growth | Unit economics, CAC payback | "Find your growth loop" |

---

## 8. Stage-Appropriate Benchmarks

### Pre-Seed

| Metric | Target |
|---|---|
| Customer interviews | 20+ completed |
| Waitlist signups | 100+ engaged |
| Willingness to pay | 50%+ say yes |
| Problem severity | 8+/10 rating |

### Seed

| Metric | Target |
|---|---|
| MRR | $10K-50K |
| MoM Growth | 15-20% |
| Activation Rate | 25%+ |
| Day 30 Retention | 20%+ |
| Gross Retention | > 85% |
| ARR (SaaS) | $500K-$2M |

### Series A

| Metric | Target |
|---|---|
| ARR | $1M-3M ($2M-$10M SaaS) |
| MoM Growth | 10-15% |
| YoY Growth | 3-5x |
| LTV:CAC | 3:1+ |
| CAC Payback | < 12-18 months |
| NRR | 100%+ |
| Gross Margin | 60%+ |
| Burn Multiple | < 2.0 |
| Magic Number | > 0.5 |

### Series B+

| Metric | Target |
|---|---|
| ARR | $5M+ |
| Rule of 40 | > 40 |
| Quick Ratio | > 4 |
| NRR | 110%+ |
| Gross Margin | 70%+ |

---

## 9. Churn Benchmarks by Segment

### Monthly Churn

| Market | Good | Average | Concerning |
|---|---|---|---|
| Enterprise SaaS | < 1% | 1-2% | > 3% |
| Mid-market SaaS | < 2% | 2-4% | > 5% |
| SMB SaaS | < 3% | 3-5% | > 7% |
| Consumer | < 5% | 5-10% | > 15% |

### Net Dollar Retention (NDR)

| NDR | Rating |
|---|---|
| > 120% | Best-in-class |
| 100-120% | Good |
| < 100% | Needs work |

### Gross Retention

| Gross Retention | Rating |
|---|---|
| > 90% | Excellent |
| 85-90% | Good |
| < 85% | Concerning |

### LTV:CAC Interpretation

| Ratio | Meaning | Action |
|---|---|---|
| < 1:1 | Losing money | Stop spending, fix retention |
| 1:1-2:1 | Barely sustainable | Improve retention or reduce CAC |
| 3:1 | Healthy | Scale acquisition |
| 4:1-5:1 | Very efficient | Consider more aggressive growth |
| > 5:1 | Under-investing | Spend more on acquisition |

---

## 10. Efficiency Metrics

### Burn Multiple

```
Burn Multiple = Net Burn / Net New ARR
```

| Burn Multiple | Rating |
|---|---|
| < 1.0 | Exceptional |
| 1.0-1.5 | Good |
| 1.5-2.0 | Acceptable |
| > 2.0 | Inefficient |

### Magic Number

```
Magic Number = Net New ARR (quarter) / S&M Spend (prior quarter)
```

| Magic Number | Interpretation |
|---|---|
| > 0.75 | Efficient, ready to scale |
| 0.5-0.75 | Moderate efficiency |
| < 0.5 | Inefficient, don't scale yet |

### Rule of 40

```
Rule of 40 = Growth Rate (%) + Profit Margin (%)
```

Target: > 40% for Series B+ companies.

### Quick Ratio

```
Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)
```

| Quick Ratio | Rating |
|---|---|
| > 4 | Strong growth |
| 2-4 | Healthy |
| < 2 | Churn is outpacing growth |

### Core Unit Economics

```
CAC = Sales & Marketing Spend / New Customers
LTV = ARPU x Gross Margin x (1 / Monthly Churn)
CAC Payback = CAC / (ARPU x Gross Margin)     # in months
Runway = Cash / (Monthly Expenses - Monthly Revenue)
Net New MRR = New MRR + Expansion - Contraction - Churned
NDR = (ARR Start + Expansion - Contraction - Churn) / ARR Start
```

### Runway Planning

| Runway | Status | Action |
|---|---|---|
| 18+ months | Safe | Focus on growth |
| 12-18 months | Comfortable | Plan next raise |
| 6-12 months | Caution | Start fundraising NOW |
| < 6 months | Danger | Cut costs or raise urgently |

---

## 11. Cognitive Bias Detection

Six biases that derail startup validation. Full details in [references/cognitive-biases.md](references/cognitive-biases.md).

| Bias | How It Hurts | Defense |
|---|---|---|
| **Confirmation Bias** | Seek data confirming the idea, ignore disconfirming evidence | Pre-register pass/fail thresholds. Actively seek counter-evidence. |
| **Optimism Bias** | Overestimate market, underestimate costs | Use conservative (P10) scenarios. Require bottom-up sizing. |
| **Sunk Cost Fallacy** | Keep building despite negative evidence | Set kill criteria before experiments. Recommend KILL when score < 40. |
| **Survivorship Bias** | Copy successes without understanding the 90% that failed | Analyze why similar ideas failed, not just why winners won. |
| **Anchoring** | First data point dominates thinking | Show confidence ranges. Present multiple estimates. |
| **Bandwagon Effect** | Chase trends without differentiation | Score unfair advantage independently. "What can't a competitor copy in 6 months?" |

### Red Flags in Founder Reasoning

| Phrase | Likely Bias | Better Question |
|---|---|---|
| "Everyone loved it" | Confirmation | "How many said they'd pay $X today?" |
| "The market is $50B" | Optimism / Anchoring | "What's the bottom-up SAM for your ICP?" |
| "We've worked on this for a year" | Sunk Cost | "What's the signal strength from experiments?" |
| "Look at how Uber did it" | Survivorship | "What about the 50 ride-sharing apps that failed?" |
| "AI is the future" | Bandwagon | "What's your unfair advantage vs. other AI tools?" |
| "We just need more time" | Sunk Cost + Optimism | "What specific evidence would change the verdict?" |

### Defense Strategies

1. **Pre-registration** -- Write pass/fail criteria BEFORE running any experiment
2. **Devil's advocate** -- For every key assumption, actively argue the opposite
3. **Evidence grading** -- Grade every data point A/B/C/D
4. **Counter-signal requirement** -- Every positive finding needs one counter-signal
5. **Time-boxing** -- No Level 3+ signal in 4 weeks -> formal pivot review; 3+ failed experiments -> mandatory kill/pivot; max 8 weeks from idea to go/no-go

---

## 12. Industry Playbook Context

19 industry playbooks available for scoring calibration.

| Industry ID | Display Name | Key Metrics |
|---|---|---|
| `ai_saas` | AI SaaS / B2B | MRR, CAC, LTV, churn, NRR |
| `fintech` | FinTech | Transaction volume, take rate, compliance |
| `healthcare` | Healthcare | Outcomes, regulatory, reimbursement |
| `fashion_apparel` | Fashion & Apparel | Sell-through, markdown %, inventory |
| `ecommerce_pure` | eCommerce | AOV, conversion, repeat purchase |
| `education` | Education | Enrollment, completion, outcomes |
| `cybersecurity` | Cybersecurity | ARR, net retention, certifications |

Full list: Query `SELECT industry_id, display_name FROM industry_playbooks WHERE is_active = true`

### Playbook Fields for Scoring Calibration

| Field | Use in Scoring |
|---|---|
| `benchmarks` | Industry-specific metric targets |
| `failure_patterns` | Common mistakes to check against |
| `investor_expectations` | What investors look for in this vertical |
| `warning_signs` | Red flags specific to the industry |
| `gtm_patterns` | Go-to-market strategies for GTM Clarity dimension |
| `terminology` | Industry-specific terms for context |
| `stage_checklists` | Stage-specific validation tasks |

### Lean Canvas Mapping to Risk Domains

| Risk Domain | Canvas Box | Pre-Traction Priority |
|---|---|:---:|
| Problem | Problem | 1 (highest) |
| Customer | Customer Segments | 2 |
| Value Prop | Unique Value Proposition | 3 |
| Channel | Channels | 4 |
| Revenue | Revenue Streams | 5 |
| Competition | Unfair Advantage | 6 |
| Technical | Solution + Key Metrics | 7 |
| Financial | Cost Structure | 8 |
| Team | (not on canvas) | 9 |
| Operational | Key Activities / Resources | 10 |

---

## 13. Top 20 Metrics Quick Reference

Compact lookup for the most-used startup KPIs. Full formulas in Section 10.

| # | Metric | Formula | Benchmark |
|---|--------|---------|-----------|
| 1 | MRR | Sum of monthly subscriptions | Growing MoM |
| 2 | ARR | MRR x 12 | $1M+ for Series A |
| 3 | Gross Margin | (Revenue - COGS) / Revenue | 60-80% SaaS |
| 4 | Burn Rate | Monthly expenses - Revenue | < 1/12 of cash |
| 5 | Runway | Cash / Monthly burn | 12-18 months |
| 6 | CAC | Sales+Marketing / New customers | Varies by model |
| 7 | LTV | ARPU x Gross Margin x (1/Churn) | 3x CAC minimum |
| 8 | LTV:CAC | LTV / CAC | 3:1 or higher |
| 9 | CAC Payback | CAC / (ARPU x Margin) | < 12 months |
| 10 | Churn | Lost customers / Starting customers | < 5% monthly |
| 11 | NRR | (MRR - Churn + Expansion) / MRR | > 100% |
| 12 | DAU/MAU | Daily active / Monthly active | > 20% |
| 13 | Activation | Users completing setup / Signups | 25-40% |
| 14 | Conversion | Paying / Free users | 2-5% freemium |
| 15 | NPS | Promoters - Detractors | > 40 excellent |
| 16 | CMGR | (Last/First)^(1/months) - 1 | 15-20% early |
| 17 | Quick Ratio | (New+Expansion) / (Churn+Contraction) | > 4 strong |
| 18 | Rule of 40 | Growth rate + Profit margin | > 40% |
| 19 | GMV | Total transaction value | Context-dependent |
| 20 | ACV | Annual contract value | Growing YoY |

---

## 14. TypeScript Metric Calculations

Copy-paste-ready functions for edge functions and frontend utilities.

### Revenue

```typescript
function calculateNetNewMRR(new_mrr: number, expansion: number, contraction: number, churned: number): number {
  return new_mrr + expansion - contraction - churned;
}
```

### Unit Economics

```typescript
function calculateCAC(salesMarketingCost: number, newCustomers: number): number {
  return salesMarketingCost / newCustomers;
}

function calculateLTV(arpu: number, grossMargin: number, monthlyChurn: number): number {
  return arpu * grossMargin * (1 / monthlyChurn);
}

function calculateCACPayback(cac: number, arpu: number, margin: number): number {
  return cac / (arpu * margin); // months
}
```

### Financial Health

```typescript
function calculateRunway(cashBalance: number, monthlyExpenses: number, monthlyRevenue: number): number {
  const netBurn = monthlyExpenses - monthlyRevenue;
  return netBurn > 0 ? cashBalance / netBurn : Infinity;
}

function calculateQuickRatio(newMRR: number, expansion: number, churned: number, contraction: number): number {
  return (newMRR + expansion) / (churned + contraction);
}

function calculateRuleOf40(growthRate: number, profitMargin: number): number {
  return growthRate + profitMargin;
}
```

---

## 15. Implementation Patterns

TypeScript interfaces and patterns for integrating scoring into edge functions and frontend.

### Health Score Interface

```typescript
// Reference: health-scorer edge function
interface HealthScore {
  overall: number;  // 0-100
  breakdown: {
    product: number;   // Feature completeness, user feedback
    market: number;    // Competition, timing, size
    team: number;      // Completeness, experience
    traction: number;  // Growth rate, engagement
    financial: number; // Runway, unit economics
  };
  recommendations: string[];
}

// Weights by stage (matches Section 6)
const stageWeights = {
  idea: { product: 0.3, market: 0.3, team: 0.2, traction: 0.1, financial: 0.1 },
  seed: { product: 0.25, market: 0.2, team: 0.15, traction: 0.25, financial: 0.15 },
  series_a: { product: 0.2, market: 0.15, team: 0.15, traction: 0.25, financial: 0.25 },
};
```

### IndustryPlaybook Interface

```typescript
interface IndustryPlaybook {
  industry_id: string;
  display_name: string;
  narrative_arc: string;           // Story structure for pitches
  prompt_context: string;          // AI prompt enhancement
  investor_expectations: object;   // What investors look for
  failure_patterns: string[];      // Common mistakes
  success_stories: object[];       // Examples
  benchmarks: object;              // Industry benchmarks
  terminology: object;             // Industry-specific terms
  gtm_patterns: object;            // Go-to-market strategies
  decision_frameworks: object;     // How to make decisions
  investor_questions: string[];    // FAQ from investors
  warning_signs: string[];         // Red flags
  stage_checklists: object;        // Stage-specific tasks
  slide_emphasis: object;          // Pitch deck guidance
}
```

### Canvas Analysis Interface

```typescript
// Reference: lean-canvas-agent edge function
interface CanvasAnalysis {
  completeness: number;  // 0-100
  coherence: number;     // 0-100 (do sections align?)
  gaps: string[];        // Missing or weak sections
  suggestions: {
    section: string;
    current: string;
    suggested: string;
    reason: string;
  }[];
}

// Section validation rules
const validationRules = {
  problem: { min_length: 50, requires: ['pain_point', 'frequency'] },
  solution: { must_address: 'problem', avoid: ['feature_list'] },
  unique_value: { formula: 'For [X] who [Y], we [Z] unlike [W]' },
  unfair_advantage: { not_allowed: ['first_mover', 'passion', 'hard_work'] },
};
```

### Injecting Industry Context into AI Prompts

```typescript
async function buildPromptWithPlaybook(
  basePrompt: string,
  startupId: string
): Promise<string> {
  const { data: startup } = await supabase
    .from('startups')
    .select('industry')
    .eq('id', startupId)
    .single();

  const { data: playbook } = await supabase
    .from('industry_playbooks')
    .select('prompt_context, terminology, benchmarks')
    .eq('industry_id', startup.industry)
    .single();

  if (!playbook) return basePrompt;

  return `${basePrompt}

Industry Context (${startup.industry}):
${playbook.prompt_context}

Key Terminology:
${JSON.stringify(playbook.terminology, null, 2)}

Industry Benchmarks:
${JSON.stringify(playbook.benchmarks, null, 2)}`;
}
```

### Stage-Appropriate Task Generation

```typescript
async function generateStageTasks(
  startupId: string
): Promise<Task[]> {
  const { data: startup } = await supabase
    .from('startups')
    .select('stage, industry')
    .eq('id', startupId)
    .single();

  const { data: playbook } = await supabase
    .from('industry_playbooks')
    .select('stage_checklists')
    .eq('industry_id', startup.industry)
    .single();

  const checklist = playbook?.stage_checklists?.[startup.stage] || [];

  return checklist.map(item => ({
    title: item.title,
    description: item.description,
    category: item.category,
    priority: item.priority,
    stage_relevant: true,
  }));
}
```

---

## 16. Edge Functions & Database Tables

### Edge Functions for Startup Features

| Function | Purpose | Playbook Integration |
|----------|---------|---------------------|
| `health-scorer` | Calculate startup health | Uses `benchmarks` |
| `stage-analyzer` | Determine/validate stage | Uses `stage_checklists` |
| `investor-agent` | Match and research investors | Uses `investor_expectations` |
| `lean-canvas-agent` | Canvas analysis | Uses `decision_frameworks` |
| `pitch-deck-agent` | Deck generation | Uses `narrative_arc`, `slide_emphasis` |
| `industry-expert-agent` | Industry guidance | Full playbook access |
| `compute-daily-focus` | Daily recommendations | Uses `stage_checklists` |
| `validator-start` | 7-agent validation pipeline | Uses `scoring-math.ts` |

### Database Tables

| Table | Purpose |
|-------|---------|
| `industry_playbooks` | Industry-specific knowledge (19 playbooks) |
| `prompt_packs` | AI workflow templates |
| `startups` | User startup data |
| `health_scores` | Historical health scores |
| `lean_canvases` | Business model canvases |
| `validator_reports` | Pipeline scoring results |

### Prompt Packs

Pre-built AI workflows for common startup tasks. Each pack is a multi-step prompt sequence.

| Category | Packs | Use Case |
|----------|-------|----------|
| **Validation** | Problem validation, Customer interview, Market sizing | Early-stage founders |
| **Fundraising** | Pitch deck outline, Investor email, Due diligence prep | Raising capital |
| **Growth** | Channel analysis, Retention strategy, Pricing model | Scaling startups |
| **Planning** | OKR setting, Roadmap creation, Sprint planning | Execution |

```typescript
// Accessing prompt packs in edge functions
const { data: pack } = await supabase
  .from('prompt_packs')
  .select('*')
  .eq('category', 'fundraising')
  .eq('name', 'pitch_deck_outline')
  .single();

for (const step of pack.steps) {
  const result = await executePromptStep(step, context);
}
```

---

## 17. AI Model Selection

| Task | Model |
|------|-------|
| Fast extraction / metric calculations | `gemini-3-flash-preview` |
| Benchmark analysis / deep research | `gemini-3-pro-preview` |
| Strategic recommendations / scoring | `claude-sonnet-4-5` |
| Complex reasoning / validation verdicts | `claude-opus-4-6` |

---

## 18. Implementation Best Practices

### When Building Startup Features

- [ ] Check if industry playbook exists for user's industry
- [ ] Use stage-appropriate metrics and guidance (Section 8)
- [ ] Reference YC best practices where applicable (Section 7)
- [ ] Include industry-specific terminology from playbook
- [ ] Validate against common failure patterns
- [ ] Provide actionable recommendations, not just scores

### When Accessing Playbooks

- [ ] Always filter by `is_active = true`
- [ ] Cache playbook data (update frequency: monthly)
- [ ] Fall back to generic advice if industry not found
- [ ] Use `prompt_context` to enhance AI responses

### When Implementing Scoring

- [ ] Use stage-appropriate weights (Section 6)
- [ ] Provide breakdown, not just total score
- [ ] Include specific recommendations
- [ ] Compare to industry benchmarks where available
- [ ] Explain score changes over time

### Model-Specific Metrics References

For deeper metrics by business model, see:
- **SaaS:** [saas-metrics.md](../startup-metrics/references/saas-metrics.md) -- NDR, magic number, burn multiple, investor expectations
- **Marketplace / Consumer / B2B:** [marketplace-consumer-b2b-metrics.md](../startup-metrics/references/marketplace-consumer-b2b-metrics.md) -- GMV, take rate, K-factor, pipeline
- **Tracking setup:** [tracking-best-practices.md](../startup-metrics/references/tracking-best-practices.md) -- Infrastructure, cadence, common mistakes

---

## 19. References

### Reference Files

| File | Purpose |
|---|---|
| [risk-taxonomy.md](references/risk-taxonomy.md) | 15-domain risk model, composite scoring, TOC, Lean Canvas mapping |
| [scoring-formula.md](references/scoring-formula.md) | Deterministic scoring: weights, thresholds, bias correction, example calculation |
| [validation-methods.md](references/validation-methods.md) | Methods matrix, decision tree, signal strength, experiment templates |
| [cognitive-biases.md](references/cognitive-biases.md) | 6 founder biases, defense strategies, red flags |
| [research-execution-guide.md](references/research-execution-guide.md) | Web research workflow, query templates, data sources |
| [frameworks.md](references/frameworks.md) | Porter's Five Forces, TAM/SAM/SOM, problem-solution fit |
| [founder-frameworks.md](references/founder-frameworks.md) | Paul Graham criteria, Ash Maurya PMF thresholds, innovation funnel |
| [schemas.md](references/schemas.md) | Intake/output JSON schemas matching edge function types |

### Scripts

| Script | Purpose | Usage |
|---|---|---|
| [scoring_math.py](scripts/scoring_math.py) | Deterministic weighted scoring CLI | `python scripts/scoring_math.py '{"problemClarity":75,...}'` |
| [market_analyzer.py](scripts/market_analyzer.py) | Market metrics + viability scoring | `python scripts/market_analyzer.py data.json` |

### Implementation Files

| File | Runtime | Purpose |
|---|---|---|
| `supabase/functions/validator-start/scoring-math.ts` | Deno | Edge function (canonical) |
| `src/lib/scoring-math.ts` | Browser | Frontend copy (identical logic) |
| `src/types/validation-report.ts` | Browser | `DIMENSION_CONFIG` source of truth |
