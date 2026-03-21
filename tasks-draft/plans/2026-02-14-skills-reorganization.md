# Skills Reorganization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate 17 startup skills into 8 pipeline-aligned skills with deduplication, enrichment, and redirect preservation.

**Architecture:** Each new skill merges 2-3 source skills, keeps only domain knowledge (frameworks, formulas, benchmarks), removes Claude-session process guidance. Old skills become 10-line redirects. Reference files (scripts/, assets/) copied to new skill directories.

**Tech Stack:** Markdown files only. No code changes. Skills in `.agents/skills/startup/`.

---

### Task 1: Create Directory Structure

**Files:**
- Create: `.agents/skills/startup/idea-discovery/SKILL.md` (placeholder)
- Create: `.agents/skills/startup/market-intelligence/SKILL.md` (placeholder)
- Create: `.agents/skills/startup/competitive-strategy/SKILL.md` (placeholder)
- Create: `.agents/skills/startup/validation-scoring/SKILL.md` (placeholder)
- Create: `.agents/skills/startup/mvp-execution/SKILL.md` (placeholder)
- Create: `.agents/skills/startup/financial-modeling/SKILL.md` (placeholder)
- Create: `.agents/skills/startup/go-to-market/SKILL.md` (placeholder)
- Create: `.agents/skills/startup/fundraising-strategy/SKILL.md` (placeholder)

**Step 1: Create 8 directories with placeholder files**

```bash
for skill in idea-discovery market-intelligence competitive-strategy validation-scoring mvp-execution financial-modeling go-to-market fundraising-strategy; do
  mkdir -p .agents/skills/startup/$skill
  echo "# $skill — PLACEHOLDER" > .agents/skills/startup/$skill/SKILL.md
done
```

**Step 2: Copy reference directories from source skills that have them**

```bash
# startup-idea-validation → validation-scoring
cp -r .agents/skills/startup/startup-idea-validation/references .agents/skills/startup/validation-scoring/
cp -r .agents/skills/startup/startup-idea-validation/scripts .agents/skills/startup/validation-scoring/

# market-research-reports → market-intelligence
cp -r .agents/skills/startup/market-research-reports/references .agents/skills/startup/market-intelligence/
cp -r .agents/skills/startup/market-research-reports/scripts .agents/skills/startup/market-intelligence/
cp -r .agents/skills/startup/market-research-reports/assets .agents/skills/startup/market-intelligence/
```

**Step 3: Verify structure**

```bash
find .agents/skills/startup/idea-discovery .agents/skills/startup/market-intelligence .agents/skills/startup/competitive-strategy .agents/skills/startup/validation-scoring .agents/skills/startup/mvp-execution .agents/skills/startup/financial-modeling .agents/skills/startup/go-to-market .agents/skills/startup/fundraising-strategy -type f | sort
```

Expected: 8 SKILL.md files + copied reference/script/asset files.

**Step 4: Commit**

```bash
git add .agents/skills/startup/idea-discovery .agents/skills/startup/market-intelligence .agents/skills/startup/competitive-strategy .agents/skills/startup/validation-scoring .agents/skills/startup/mvp-execution .agents/skills/startup/financial-modeling .agents/skills/startup/go-to-market .agents/skills/startup/fundraising-strategy
git commit -m "chore: scaffold 8 merged startup skill directories"
```

---

### Task 2: Write `idea-discovery` (ExtractorAgent)

**Sources to read:**
- `.agents/skills/startup/startup-ideation/SKILL.md` (58 lines)
- `.agents/skills/startup/lean-canvas/SKILL.md` (135 lines)
- `.agents/skills/startup/creative-intelligence/SKILL.md` (441 lines)

**Target:** `.agents/skills/startup/idea-discovery/SKILL.md` (~400 lines)

**Step 1: Read all 3 source skills**

Read each source file completely. Extract only domain knowledge (frameworks, formulas, templates). Discard:
- Claude-session process guidance (brainstorming flow, subagent dispatch)
- Tool-specific instructions (edge function routing, API calls)
- Generic advice ("be creative", "think broadly")

**Step 2: Write the merged skill**

Structure:

```markdown
# Idea Discovery

> **Pipeline stage:** ExtractorAgent | **Sources:** startup-ideation, lean-canvas, creative-intelligence

## When to Use
- Extracting startup profile from founder conversation
- Framing a problem statement from raw idea input
- Identifying canvas gaps and missing information
- Generating alternative approaches to a problem

## 1. Idea Generation Frameworks

### "Why Now" Test (Ryan Hoover)
[From startup-ideation: technology shifts, behavior shifts, infrastructure changes]

### Personal Experience Method (Dalton Caldwell)
[From startup-ideation: go off beaten path, use domain expertise]

### Tarpit Identification
[From startup-ideation: common idea categories with low success rates]

## 2. Problem Framing Techniques

### 5 Whys
[From creative-intelligence: root cause analysis template]

### SCAMPER
[From creative-intelligence: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse]

### Six Thinking Hats
[From creative-intelligence: White=facts, Red=feelings, Black=risks, Yellow=benefits, Green=creativity, Blue=process]

### Reverse Brainstorming
[From creative-intelligence: "How could we make this problem WORSE?" → invert for solutions]

## 3. Lean Canvas (9 Blocks)

### Block Definitions
[From lean-canvas: Problem, Customer Segments, UVP, Solution, Channels, Revenue, Cost Structure, Key Metrics, Unfair Advantage]

### Canvas Scoring Algorithm
[From lean-canvas: weighted block scores with formula]

### Solution-First Bias Detection
[From lean-canvas: 4 regex patterns that indicate solution-first thinking]

### Assumption Extraction
[From lean-canvas: Impact × Uncertainty scoring for each assumption]

## 4. Research Methods

### Market Research
[From creative-intelligence: approach, sources, outputs]

### Competitive Research
[From creative-intelligence: approach, sources, outputs]

### Technical Research
[From creative-intelligence: feasibility, architecture, constraints]

### User Research
[From creative-intelligence: interviews, surveys, observation]

## 5. Idea Evaluation Checklist
[From startup-ideation: 5 evaluation questions + tarpit check + timing check]
[From lean-canvas: canvas completeness score as evaluation gate]
```

**Step 3: Convert 3 source skills to redirects**

For each of `startup-ideation`, `lean-canvas`, `creative-intelligence`:

```markdown
# [Skill Name] — Merged

> **Merged into:** `idea-discovery`
> **Location:** `.agents/skills/startup/idea-discovery/SKILL.md`

## What Moved
- [List which sections went to idea-discovery]
```

**Step 4: Verify line count and content**

```bash
wc -l .agents/skills/startup/idea-discovery/SKILL.md
# Expected: ~350-450 lines
```

Check: Every framework/formula/benchmark from all 3 sources appears in the merged file.

**Step 5: Commit**

```bash
git add .agents/skills/startup/idea-discovery/SKILL.md .agents/skills/startup/startup-ideation/SKILL.md .agents/skills/startup/lean-canvas/SKILL.md .agents/skills/startup/creative-intelligence/SKILL.md
git commit -m "feat(skills): merge startup-ideation + lean-canvas + creative-intelligence → idea-discovery"
```

---

### Task 3: Write `market-intelligence` (ResearchAgent)

**Sources to read:**
- `.agents/skills/startup/market-research-reports/SKILL.md` (902 lines)
- `.agents/skills/startup/startup-trend-prediction/SKILL.md` (389 lines)
- `.agents/skills/startup/startup-analyst/SKILL.md` (329 lines — market sizing + market analysis portions only)

**Target:** `.agents/skills/startup/market-intelligence/SKILL.md` (~800 lines)

**Step 1: Read all 3 source skills**

Extract only domain knowledge. Discard from market-research-reports:
- LaTeX formatting instructions (~100 lines) — keep in assets/ for reference
- Python script instructions (~50 lines) — keep in scripts/
- Report structure process (page count targets, compilation workflow) — these are report-generation specific, not market analysis knowledge

Discard from startup-analyst:
- Competitive analysis sections (→ goes to competitive-strategy)
- Financial modeling sections (→ goes to financial-modeling)
- Team planning sections (→ goes to financial-modeling)

**Step 2: Write the merged skill**

Structure:

```markdown
# Market Intelligence

> **Pipeline stage:** ResearchAgent | **Sources:** market-research-reports, startup-trend-prediction, startup-analyst

## When to Use
- Market sizing (TAM/SAM/SOM) research
- Industry trend analysis and timing decisions
- Market dynamics assessment (drivers, barriers, growth)
- Adoption curve positioning

## 1. Market Sizing Methodology

### Top-Down Approach
[From startup-analyst: total market → segments → reachable]

### Bottom-Up Approach
[From startup-analyst: unit economics × customer count → SAM → TAM]
[Include sample calculation: "X brands × $Y/year = $Z SAM"]

### Value Theory Approach
[From startup-analyst: value created × capture rate]

### TAM/SAM/SOM Definitions & Relationships
[From market-research-reports: concentric circles model, calculation examples]

## 2. Market Analysis Frameworks

### Porter's Five Forces
[From market-research-reports + startup-analyst: 5 forces with High/Med/Low ratings]

### PESTLE Analysis
[From market-research-reports: Political, Economic, Social, Technological, Legal, Environmental]

### BCG Growth-Share Matrix
[From market-research-reports: Stars, Cash Cows, Question Marks, Dogs]

### Value Chain Analysis
[From market-research-reports: primary + support activities]

### SWOT Analysis (Market-Level)
[From market-research-reports: industry-level SWOT, not company-level]

## 3. Trend Analysis & Timing

### Leading vs Lagging Indicators
[From startup-trend-prediction: regulation, platform primitives, buyer behavior → usage/revenue → media/social]

### Rogers Diffusion Model
[From startup-trend-prediction: innovators 2.5%, early adopters 16%, early majority 50%, late majority 84%, laggards 100%]

### Bass Diffusion Model
[From startup-trend-prediction: quantitative parameters by market type]
- Consumer: p=0.03, q=0.38, 3 years to 50%
- B2B: p=0.01, q=0.25, 5 years to 50%
- Enterprise: p=0.005, q=0.15, 8 years to 50%

### Gartner Hype Cycle
[From startup-trend-prediction: 5 phases with duration ranges]

### Signal vs Noise Framework
[From startup-trend-prediction: strong/moderate/weak signal categorization]

### Cycle Patterns
[From startup-trend-prediction: Technology 7-10yr, Market 5-7yr, Business Model 3-5yr]

### Timing Decision Framework
[From startup-trend-prediction: enter/wait/avoid decision matrix]

## 4. Market Dynamics

### Market Drivers & Barriers
[From market-research-reports + startup-analyst: identification methodology]

### Customer Segmentation
[From market-research-reports: segment types, sizing per segment]

### Technology Readiness Levels (TRL)
[From market-research-reports: 1-9 scale with definitions]

### Risk Heatmap (Market-Level)
[From market-research-reports: Probability × Impact matrix]

## 5. Data Sources & Validation

### Primary Sources
[From market-research-reports: Gartner, Forrester, IDC, government statistics]

### Hype-Cycle Defenses
[From startup-trend-prediction: falsification, base rates, adoption constraints]

### Reference Class Forecasting
[From startup-trend-prediction: base rates from analogs for reality-checking projections]
```

**Step 3: Convert source skills to redirects**

- `market-research-reports/SKILL.md` → redirect (note: assets/, references/, scripts/ stay in old dir AND are copied to new)
- `startup-trend-prediction/SKILL.md` → redirect
- `startup-analyst/SKILL.md` → redirect noting content split across market-intelligence, competitive-strategy, and financial-modeling

**Step 4: Verify**

```bash
wc -l .agents/skills/startup/market-intelligence/SKILL.md
# Expected: ~700-900 lines
```

**Step 5: Commit**

```bash
git add .agents/skills/startup/market-intelligence/ .agents/skills/startup/market-research-reports/SKILL.md .agents/skills/startup/startup-trend-prediction/SKILL.md .agents/skills/startup/startup-analyst/SKILL.md
git commit -m "feat(skills): merge market-research-reports + startup-trend-prediction + startup-analyst → market-intelligence"
```

---

### Task 4: Write `competitive-strategy` (CompetitorAgent)

**Sources to read:**
- `.agents/skills/startup/marketing-strategy-pmm/SKILL.md` (1164 lines — §2 Positioning, §3 Competitive Intelligence)
- `.agents/skills/startup/product-strategist/SKILL.md` (380 lines — competitive sections)
- `.agents/skills/startup/startup-analyst/SKILL.md` (329 lines — competitive sections, already redirected in Task 3)

**Target:** `.agents/skills/startup/competitive-strategy/SKILL.md` (~500 lines)

**Step 1: Read sources, extract competitive-only content**

From marketing-strategy-pmm extract:
- §2 Positioning & Messaging (~200 lines): April Dunford framework, positioning statement, messaging architecture
- §3 Competitive Intelligence (~200 lines): Competitive analysis framework, battlecards, win/loss analysis

From product-strategist extract:
- Competitive matrix methodology
- SWOT template
- Positioning map (x/y axes)

From startup-analyst extract (already redirected):
- Porter's Five Forces application to competitors
- Blue Ocean Strategy identification
- Industry-specific competitive approaches

**Step 2: Write the merged skill**

Structure:

```markdown
# Competitive Strategy

> **Pipeline stage:** CompetitorAgent | **Sources:** marketing-strategy-pmm (§2-3), product-strategist, startup-analyst

## When to Use
- Competitive landscape analysis
- Positioning and differentiation strategy
- Battlecard creation for specific competitors
- Win/loss analysis after customer conversations

## 1. Positioning Framework (April Dunford)
[From PMM §2.1: 6-step process — alternatives → attributes → value → best-fit → category → trends]

## 2. Competitive Analysis
### Feature Comparison Matrix
### Threat Level Assessment
### SWOT Analysis Template
### Porter's Five Forces (Competitive)

## 3. Positioning Map
### Axis Selection Methodology
### Coordinate Assignment
### Founder Positioning vs Competitors

## 4. Battlecard Template (10 sections)
[From PMM §3.2: Overview, Positioning, Pricing, Strengths, Weaknesses, Objection Handling, Win Themes, Proof Points, Questions to Ask, Red Flags]

## 5. Win/Loss Analysis
[From PMM §3.3: Interview questions, pattern identification, competitive response playbook]

## 6. Messaging Architecture
[From PMM §2.2: Value proposition → Key messages → Proof points → CTAs]

## 7. Blue Ocean Strategy
[From startup-analyst: Finding uncontested market space, value innovation]
```

**Step 3: Convert sources to redirects**

- `marketing-strategy-pmm/SKILL.md` → redirect noting split across competitive-strategy (§2-3) and go-to-market (§4-6) and financial-modeling (§7 KPIs)
- `product-strategist/SKILL.md` → redirect noting split across competitive-strategy and go-to-market

**Step 4: Verify and commit**

```bash
wc -l .agents/skills/startup/competitive-strategy/SKILL.md
# Expected: ~400-550 lines
git add .agents/skills/startup/competitive-strategy/ .agents/skills/startup/marketing-strategy-pmm/SKILL.md .agents/skills/startup/product-strategist/SKILL.md
git commit -m "feat(skills): merge PMM competitive + product-strategist + analyst → competitive-strategy"
```

---

### Task 5: Write `validation-scoring` (ScoringAgent)

**Sources to read:**
- `.agents/skills/startup/startup-idea-validation/SKILL.md` (153 lines + references/)
- `.agents/skills/startup/startup-metrics/SKILL.md` (170 lines)
- `.agents/skills/startup/startup-expertise/SKILL.md` (362 lines — health scoring + YC + playbooks)

**Target:** `.agents/skills/startup/validation-scoring/SKILL.md` (~500 lines)

**Step 1: Read sources**

From startup-idea-validation: ALL content (this is the core of scoring)
From startup-metrics: Benchmarks, KPI formulas, churn rates, stage targets
From startup-expertise: Health score calculation, YC success factors, stage weights, playbook references

**Step 2: Write the merged skill**

Structure:

```markdown
# Validation Scoring

> **Pipeline stage:** ScoringAgent | **Sources:** startup-idea-validation, startup-metrics, startup-expertise

## When to Use
- Scoring startup ideas across multiple dimensions
- Evaluating evidence quality and validation progress
- Health scoring for existing startups by stage
- Setting stage-appropriate KPI targets

## 1. 9-Dimension Scorecard
[From idea-validation: dimensions, weights, thresholds]
- Problem Severity 15%, Market Size 12%, Market Timing 10%, Competitive Moat 12%,
  Unit Economics 15%, Founder-Market Fit 8%, Technical Feasibility 10%, GTM Clarity 10%, Risk Profile 8%
- GO ≥80 | CONDITIONAL 60-79 | PIVOT 40-59 | NO-GO <40

## 2. Evidence Grading
[From idea-validation: A=payment/usage, B=interview/signup, C=survey/report, D=intuition]
[Triangulation requirement, signal strength hierarchy]

## 3. 15-Domain Risk Taxonomy
[From idea-validation references/risk-taxonomy.md: complete taxonomy]

## 4. Validation Ladder
[From idea-validation: Interviews → Smoke test → Concierge/WoZ → Paid pilot]

## 5. Health Score Calculation
[From startup-expertise: 5 dimensions × stage weights]
- Product, Market, Team, Traction, Financial
- Idea stage: Product 30%, Market 30%, Team 20%, Traction 10%, Financial 10%
- Seed stage: different weights
- Series A: different weights

## 6. YC Success Factors
[From startup-expertise: 5 factors with weights]
- Founder-Market Fit 30%, Problem Clarity 25%, Traction Velocity 20%, Market Size 15%, Team 10%

## 7. Stage-Appropriate Benchmarks

### Pre-Seed Targets
[From startup-metrics: 20+ customer interviews, MVP demo, $0-50K MRR]

### Seed Targets
[From startup-metrics: $10K-50K MRR, 3:1 LTV:CAC, 10% MoM growth]

### Series A Targets
[From startup-metrics: $1M-3M ARR, 10-15% MoM, LTV:CAC 3:1+, CAC payback <12mo, NRR 100%+, 60%+ GM]

### Series B+ Targets
[From startup-metrics: $5M+ ARR, Rule of 40 >40, Quick Ratio >4, NRR 110%+, 70%+ GM]

## 8. Churn Benchmarks by Segment
[From startup-metrics: Enterprise SaaS, Mid-market, SMB, Consumer with good/avg/concerning ranges]

## 9. Efficiency Metrics
[From startup-metrics: Burn Multiple, Magic Number, Rule of 40 formulas]

## 10. Cognitive Bias Detection
[From idea-validation: 6 founder biases with mitigation strategies]

## 11. Industry Playbook Context
[From startup-expertise: 19 available industries, playbook fields for scoring calibration]

## References
- `references/risk-taxonomy.md` — Full 15-domain risk taxonomy
- `references/scoring-formula.md` — Deterministic scoring math
- `references/validation-methods.md` — Test types and decision trees
- `references/cognitive-biases.md` — 6 founder biases
- `references/frameworks.md` — Validation frameworks
- `references/founder-frameworks.md` — Founder-specific frameworks
- `scripts/scoring_math.py` — Scoring calculation utility
- `scripts/market_analyzer.py` — Market analysis utility
```

**Step 3: Convert source skills to redirects**

- `startup-idea-validation/SKILL.md` → redirect (references/ and scripts/ stay in old dir AND copied to new)
- `startup-metrics/SKILL.md` → redirect noting split across validation-scoring (benchmarks) and financial-modeling (SaaS metrics)
- `startup-expertise/SKILL.md` → redirect noting split across validation-scoring (health, YC) and fundraising-strategy (playbooks, stage guidance)

**Step 4: Verify and commit**

```bash
wc -l .agents/skills/startup/validation-scoring/SKILL.md
# Expected: ~450-550 lines
git add .agents/skills/startup/validation-scoring/ .agents/skills/startup/startup-idea-validation/SKILL.md .agents/skills/startup/startup-metrics/SKILL.md .agents/skills/startup/startup-expertise/SKILL.md
git commit -m "feat(skills): merge idea-validation + metrics + expertise → validation-scoring"
```

---

### Task 6: Write `mvp-execution` (MVPAgent + Composer Group C)

**Sources to read:**
- `.agents/skills/startup/mvp-builder/SKILL.md` (95 lines)
- `.agents/skills/startup/lean-sprints/SKILL.md` (124 lines)
- `.agents/skills/startup/traction/SKILL.md` (131 lines)

**Target:** `.agents/skills/startup/mvp-execution/SKILL.md` (~350 lines)

**Step 1: Read all 3 source skills**

All 3 are thin — will need enrichment beyond just merging.

**Step 2: Write the merged skill with enrichment**

Structure:

```markdown
# MVP Execution

> **Pipeline stage:** MVPAgent + Composer Group C | **Sources:** mvp-builder, lean-sprints, traction

## When to Use
- Scoping MVP features from a validated idea
- Planning sprint execution cycles
- Tracking traction and product-market fit
- Making pivot/persevere decisions

## 1. MVP Canvas (7 Blocks)
[From mvp-builder: Proposal, Segmented Personas, Journeys, Features, Expected Result, Metrics, Cost & Schedule]

## 2. Feature Prioritization

### RICE Scoring
[From mvp-builder: Reach × Impact × Confidence / Effort]
- Reach: 0-100% of target users affected per quarter
- Impact: 0.25 (minimal) → 3 (massive)
- Confidence: 0-100%
- Effort: 1-30 person-days

### Kano Model
[From mvp-builder: Must-Have, Performance, Delighter, Indifferent, Reverse]

### MVP Scoping Rules
[From mvp-builder: 3-5 features max, 1 user journey, validate hypothesis]

### Build/Buy/Skip Framework [ENRICHMENT]
- Build: Core differentiator, no good alternatives exist
- Buy: Commodity functionality, well-served by existing tools
- Skip: Nice-to-have that doesn't test a critical assumption

## 3. Sprint Execution

### 2-Week Sprint Structure
[From lean-sprints: Week 1 (Expose/Define), Week 2 (Test/Decide)]

### 90-Day Macro-Cycles
[From lean-sprints: 5 sprints + retrospective + pivot/persevere]

### Sprint Goal Template
[From lean-sprints: hypothesis, experiment, success criteria, tasks]

### Retrospective Template
[From lean-sprints: 5 sections]

### Experiment Templates [ENRICHMENT]
- Smoke Test: Landing page, waitlist, fake door — measures demand signal
- Concierge: Manual service delivery — measures willingness to pay
- Wizard of Oz: Human-behind-curtain — measures UX assumptions
- A/B Test: Variant comparison — measures preference with statistical significance

## 4. Traction & Growth

### Customer Factory (5 Stages)
[From traction: Acquisition → Activation → Retention → Revenue → Referral]

### Bottleneck Detection
[From traction: find slowest funnel stage, benchmarks per stage]
- Acquisition: 5% conversion (visitor → signup)
- Activation: 25% (signup → first value)
- Retention: 40% (week 1 return)
- Revenue: 5% (free → paid)
- Referral: 10% (user → invite)

### OMTM by Stage
[From traction: Idea=interviews, Pre-seed=signups, MVP=activation, Traction=retention, Scale=MRR growth]

### PMF Assessment
[From traction: Sean Ellis test ≥40% "very disappointed"]

### Cohort Analysis Framework
[From traction: weekly/monthly cohorts, retention curves]

## 5. Traction Roadmap
[From traction: Now/+90d, Next/+180d, Later/+360d]
- Users: 100 → 1K → 10K
- Revenue: $1K MRR → $10K → $100K

## 6. Pivot/Persevere Framework [ENRICHMENT]
- Evidence threshold: 3+ experiments with consistent signal
- Pivot types: Customer pivot, Problem pivot, Solution pivot, Channel pivot, Revenue pivot
- Persevere signals: Retention improving, OMTM trending up, qualitative "pull" from users
- Kill signals: 90-day flat OMTM, no retention after 3 sprints, no willingness to pay
```

**Step 3: Convert source skills to redirects**

**Step 4: Verify and commit**

```bash
wc -l .agents/skills/startup/mvp-execution/SKILL.md
# Expected: ~300-400 lines (enriched from original ~350 combined)
git add .agents/skills/startup/mvp-execution/ .agents/skills/startup/mvp-builder/SKILL.md .agents/skills/startup/lean-sprints/SKILL.md .agents/skills/startup/traction/SKILL.md
git commit -m "feat(skills): merge mvp-builder + lean-sprints + traction → mvp-execution"
```

---

### Task 7: Write `financial-modeling` (Composer Group C)

**Sources to read:**
- `.agents/skills/startup/startup-financial-modeling/SKILL.md` (495 lines)
- `.agents/skills/startup/startup-business-models/SKILL.md` (141 lines)
- `.agents/skills/startup/startup-metrics/SKILL.md` (170 lines — SaaS metrics, unit economics portions)

**Target:** `.agents/skills/startup/financial-modeling/SKILL.md` (~600 lines)

**Step 1: Read sources, extract financial content**

From startup-financial-modeling: ALL content (primary source)
From startup-business-models: Revenue model classification, pricing strategy, experiment design
From startup-metrics: SaaS metrics formulas, Quick Ratio, Magic Number, Rule of 40

**Step 2: Write the merged skill**

Structure:

```markdown
# Financial Modeling

> **Pipeline stage:** Composer Group C | **Sources:** startup-financial-modeling, startup-business-models, startup-metrics

## When to Use
- Building revenue projections and financial models
- Selecting and validating revenue models
- Calculating unit economics (CAC, LTV, payback)
- Pricing strategy design and experimentation
- Fundraising financial preparation

## 1. Revenue Models (8 Types)
[From business-models: Subscription, Usage-based, Freemium, Marketplace, Transaction, Ads, Outcome-based, Hybrid]

## 2. Pricing Strategy
### WTP Research Methods
### Pricing Tier Design
### Pricing Experiment Design (A/B, holdout, step rollout, geo rollout)
### Decision Thresholds (go/no-go based on NRR + constraints)

## 3. Unit Economics
### CAC (Customer Acquisition Cost)
### LTV (Lifetime Value) — cohort-based
### LTV:CAC Ratio (target 3-5x)
### CAC Payback Period (target 6-12 months PLG, 12-18 months sales-led)
### Gross Margin (target >70%)
### Contribution Margin Per Unit (for usage-based/AI products)

## 4. Three-Scenario Framework
### Conservative (P10)
### Base Case (P50)
### Optimistic (P90)

## 5. Revenue Projections (Cohort-Based)
[From financial-modeling: cohort revenue formula, retention curves]
- SaaS retention: M1 100%, M3 90%, M6 85%, M12 75%, M24 70%

## 6. Cost Structure
### COGS
### Sales & Marketing (40-60% early stage)
### R&D
### G&A
### Fully-loaded cost: 1.3-1.4x salary

## 7. Cash Flow Analysis
[From financial-modeling: beginning cash → inflows → outflows → ending cash]

## 8. Headcount Planning
### Department Ratios (Eng 40-50%, S&M 25-35%, G&A 10-15%, CS 5-10%)
### Stage-Appropriate Team Size
### Compensation Benchmarks

## 9. Business Model Templates
### SaaS (Y1 $500K → Y2 $2.5M → Y3 $8M)
### Marketplace (Y1 $5M GMV → $750K rev)
### E-Commerce
### Services/Agency

## 10. SaaS Health Metrics
### MRR, ARR
### Churn (logo + revenue)
### NRR (Net Revenue Retention) — target 100-120%
### Quick Ratio (> 4 healthy)
### Magic Number
### Rule of 40 (growth rate + profit margin > 40%)
### Burn Multiple

## 11. Fundraising Financial Preparation
### Dilution Modeling
### Use of Funds Allocation
### Milestone-Based Planning

## 12. Model Validation Checklist
[From financial-modeling: sanity checks, common pitfalls]
```

**Step 3: Convert source skills to redirects**

- `startup-financial-modeling/SKILL.md` → redirect
- `startup-business-models/SKILL.md` → redirect
- `startup-metrics/SKILL.md` → already redirected in Task 5, update to note dual-destination

**Step 4: Verify and commit**

```bash
wc -l .agents/skills/startup/financial-modeling/SKILL.md
# Expected: ~500-650 lines
git add .agents/skills/startup/financial-modeling/ .agents/skills/startup/startup-financial-modeling/SKILL.md .agents/skills/startup/startup-business-models/SKILL.md
git commit -m "feat(skills): merge startup-financial-modeling + business-models + metrics → financial-modeling"
```

---

### Task 8: Write `go-to-market` (Composer Group C)

**Sources to read:**
- `.agents/skills/startup/marketing-strategy-pmm/SKILL.md` (1164 lines — §4 GTM, §5 Launch, §6 Sales Enablement)
- `.agents/skills/startup/startup-go-to-market/SKILL.md` (262 lines)
- `.agents/skills/startup/product-strategist/SKILL.md` (380 lines — GTM, PLG sections)

**Target:** `.agents/skills/startup/go-to-market/SKILL.md` (~500 lines)

**Step 1: Read sources, extract GTM content**

From marketing-strategy-pmm extract:
- §4 Go-To-Market Strategy (~150 lines): GTM motion types, launch playbook, international expansion
- §5 Product Launch Framework (~150 lines): Launch tiers, major launch playbook, launch metrics
- §6 Sales Enablement (~100 lines): 6 core assets, training, handoffs

From startup-go-to-market: ALL content (motion selection, ICP, channels, PQL, growth loops)
From product-strategist: PLG flywheel, GTM plan template, launch checklist

**Step 2: Write the merged skill**

Structure:

```markdown
# Go-To-Market

> **Pipeline stage:** Composer Group C | **Sources:** marketing-strategy-pmm (§4-6), startup-go-to-market, product-strategist

## When to Use
- Selecting GTM motion (PLG vs Sales-Led vs Hybrid)
- Defining ICP and channel strategy
- Planning product launches
- Designing growth loops

## 1. GTM Motion Selection
### Motion Types (PLG, Sales-Led, Hybrid, Community-Led, Partner-Led)
### Decision Tree (by ACV and buyer type)

## 2. ICP Definition
### Firmographics, Technographics, Pain Indicators, Success Indicators
### ICP Scoring (6 factors with weights)

## 3. Channel Strategy
### Channel Types (Organic, Paid, Outbound, Product)
### Channel by Stage (Pre-PMF → Early → Growth → Scale)

## 4. PLG Flywheel
### 6-Stage Model (Acquire → Activate → Engage → Refer → Expand → Monetize)
### PQL Scoring Formula

## 5. Launch Playbooks
### Launch Types (Soft, Beta, ProductHunt, Full)
### Launch Tiers (Tier 1 quarterly, Tier 2 monthly, Tier 3 weekly)
### Major Launch Timeline (8-week)
### Launch Metrics Dashboard

## 6. Growth Loops
### 6 Types (Viral, Content, UGC, Paid, Sales, Partner)

## 7. Sales Enablement
### 6 Core Assets
### Sales Training Program
### Marketing ↔ Sales Handoffs

## 8. International Expansion
### 5-Phase Strategy (US → UK → DACH → France → Canada)
### Budget Allocation (50/20/15/10/5)

## 9. Messaging Architecture
### Value Proposition → Key Messages → Proof Points → CTAs
### Messaging Testing & Iteration
```

**Step 3: Convert source skills to redirects**

- `marketing-strategy-pmm/SKILL.md` → already redirected in Task 4, update dual-destination
- `startup-go-to-market/SKILL.md` → redirect
- `product-strategist/SKILL.md` → already redirected in Task 4, update dual-destination

**Step 4: Verify and commit**

```bash
wc -l .agents/skills/startup/go-to-market/SKILL.md
# Expected: ~400-550 lines
git add .agents/skills/startup/go-to-market/ .agents/skills/startup/startup-go-to-market/SKILL.md
git commit -m "feat(skills): merge PMM GTM + startup-go-to-market + product-strategist → go-to-market"
```

---

### Task 9: Write `fundraising-strategy` (Composer Group D)

**Sources to read:**
- `.agents/skills/startup/fundraising/SKILL.md` (241 lines)
- `.agents/skills/startup/startup-expertise/SKILL.md` (362 lines — YC, playbooks, stage guidance)

**Target:** `.agents/skills/startup/fundraising-strategy/SKILL.md` (~400 lines)

**Step 1: Read sources**

From fundraising: ALL content
From startup-expertise: YC best practices, stage-appropriate guidance, industry playbook access, investor expectations

**Step 2: Write the merged skill**

Structure:

```markdown
# Fundraising Strategy

> **Pipeline stage:** Composer Group D | **Sources:** fundraising, startup-expertise

## When to Use
- Assessing fundraising readiness
- Preparing pitch materials and data room
- Investor matching and outreach strategy
- Executive summary framing (investor lens)

## 1. Readiness Assessment
### Pre-Seed Criteria (7 categories, weighted)
### Seed Criteria (7 categories, weighted)
### Series A Criteria ($1M+ ARR, 10% MoM, 3:1 LTV:CAC)

## 2. Investor Matching
### Fit Scoring Algorithm (stage, industry, check size, geography, activity, synergy)

## 3. Pitch Deck (12 Slides)
### Slide-by-Slide Structure with Time Allocations

## 4. Data Room (6 Categories)
### 15+ Document Types Organized

## 5. Term Sheet Analysis
### Framework and Object Model

## 6. YC Success Factors (Weighted)
### Founder-Market Fit 30%, Problem Clarity 25%, Traction 20%, Market Size 15%, Team 10%

## 7. YC Application Tips
### Clarity, Traction, Insight, Determination, Speed

## 8. Stage-Appropriate Guidance
### Idea → Pre-Seed → Seed → Series A Milestones and Expectations

## 9. Industry Playbooks (19 Available)
### Playbook Fields: narrative_arc, investor_expectations, failure_patterns, benchmarks, terminology, GTM patterns
### Available Industries: AI SaaS, FinTech, Healthcare, Fashion, eCommerce, etc.

## 10. Investor Framing
### What investors look for at each stage
### Red flags that kill deals
### Narrative structure for board-level clarity
```

**Step 3: Convert source skills to redirects**

- `fundraising/SKILL.md` → redirect
- `startup-expertise/SKILL.md` → already redirected in Task 5, update dual-destination

**Step 4: Verify and commit**

```bash
wc -l .agents/skills/startup/fundraising-strategy/SKILL.md
# Expected: ~350-450 lines
git add .agents/skills/startup/fundraising-strategy/ .agents/skills/startup/fundraising/SKILL.md
git commit -m "feat(skills): merge fundraising + startup-expertise → fundraising-strategy"
```

---

### Task 10: Final Verification & Tracker Updates

**Step 1: Verify all 8 new skills exist with content**

```bash
for skill in idea-discovery market-intelligence competitive-strategy validation-scoring mvp-execution financial-modeling go-to-market fundraising-strategy; do
  echo "=== $skill ==="
  wc -l .agents/skills/startup/$skill/SKILL.md
done
```

Expected totals: ~4,000 lines across 8 skills (down from ~5,500 across 17).

**Step 2: Verify all 17 old skills are redirects (not deleted)**

```bash
for skill in startup-ideation lean-canvas creative-intelligence market-research-reports startup-trend-prediction startup-analyst marketing-strategy-pmm product-strategist startup-idea-validation startup-metrics startup-expertise startup-financial-modeling startup-business-models startup-go-to-market mvp-builder lean-sprints traction fundraising; do
  echo "=== $skill ==="
  head -3 .agents/skills/startup/$skill/SKILL.md
done
```

Expected: Each shows "Merged into" redirect header.

**Step 3: Verify reference files preserved**

```bash
ls .agents/skills/startup/validation-scoring/references/
ls .agents/skills/startup/validation-scoring/scripts/
ls .agents/skills/startup/market-intelligence/references/
ls .agents/skills/startup/market-intelligence/scripts/
ls .agents/skills/startup/market-intelligence/assets/
```

**Step 4: Update trackers**

Update these files:
- `CLAUDE.md` — Update skills table (8 pipeline-aligned skills replace 13 domain skills reference)
- `tasks/changelog` — Add entry for skills reorganization
- `tasks/prompts/validator/index-validator.md` — Update Section 15 (Skills → Agents) to reference new 8 skills

**Step 5: Final commit**

```bash
git add -A
git commit -m "docs: update trackers for skills reorganization (17 → 8 pipeline-aligned)"
```

---

## Execution Order & Dependencies

```
Task 1: directories ──────────────────────── (no deps)
  │
  ├─ Task 2: idea-discovery ──────────────── (needs: ideation, lean-canvas, creative-intel)
  ├─ Task 3: market-intelligence ─────────── (needs: market-reports, trend-prediction, analyst)
  ├─ Task 4: competitive-strategy ────────── (needs: PMM, product-strategist, analyst)
  ├─ Task 5: validation-scoring ──────────── (needs: idea-validation, metrics, expertise)
  ├─ Task 6: mvp-execution ──────────────── (needs: mvp-builder, lean-sprints, traction)
  ├─ Task 7: financial-modeling ──────────── (needs: fin-modeling, business-models, metrics)
  ├─ Task 8: go-to-market ───────────────── (needs: PMM, go-to-market, product-strategist)
  ├─ Task 9: fundraising-strategy ────────── (needs: fundraising, expertise)
  │
  └─ Task 10: verification + trackers ────── (needs: all above)
```

Tasks 2-9 can run in parallel (independent skill merges). Task 1 must complete first. Task 10 runs last.

**Shared redirect conflicts:** `startup-analyst`, `startup-metrics`, `startup-expertise`, `marketing-strategy-pmm`, and `product-strategist` each split across 2-3 new skills. Their redirect files must list ALL destinations. Write the redirect during the FIRST task that touches each source, then UPDATE it during subsequent tasks.

## Estimated Effort

| Task | Effort | Notes |
|------|--------|-------|
| Task 1 | 5 min | mkdir + cp |
| Task 2 | 20 min | 3 small sources, moderate dedup |
| Task 3 | 40 min | Largest output (~800 lines), heavy dedup |
| Task 4 | 30 min | Extracting from 1164-line PMM |
| Task 5 | 25 min | Core scoring + benchmarks merge |
| Task 6 | 20 min | 3 thin sources + enrichment |
| Task 7 | 35 min | Heavy financial dedup |
| Task 8 | 30 min | Extracting GTM from PMM + merge |
| Task 9 | 20 min | Straightforward merge |
| Task 10 | 15 min | Verification + tracker updates |
| **Total** | **~4 hours** | **1-2 sessions** |
