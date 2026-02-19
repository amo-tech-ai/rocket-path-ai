# Financial Modeling

> **Pipeline stage:** Composer Group C | **Merged from:** startup-financial-modeling, startup-business-models, startup-metrics

Formulas, benchmarks, templates, and model structures for startup revenue projections, cost modeling, unit economics, pricing strategy, and SaaS health metrics.

## When to Use

- Building 3-5 year financial projections or revenue forecasts
- Choosing or evaluating a revenue model (subscription, usage-based, marketplace, etc.)
- Calculating unit economics: CAC, LTV, payback, gross margin, contribution margin
- Modeling cash flow, burn rate, runway, or headcount plans
- Designing pricing tiers, packaging, or running pricing experiments
- Preparing financial materials for fundraising (dilution, use of funds, milestones)
- Evaluating SaaS health: Quick Ratio, Magic Number, Rule of 40, Burn Multiple

---

## 1. Revenue Models (8 Types)

| Model | Value Metric | Best For | Selection Criteria |
|-------|-------------|----------|-------------------|
| **Subscription** | Seat / user / flat | Predictable SaaS, recurring value | High retention, clear user-count scaling |
| **Usage-Based** | API calls / tokens / compute | Variable workloads, AI/infra products | Cost scales with usage; need metering infrastructure |
| **Freemium** | Feature gates / limits | PLG with viral/network effects | Large TAM, low marginal cost, clear upgrade triggers |
| **Marketplace** | GMV take rate (10-30%) | Two-sided platforms | Liquidity achievable, defensible supply/demand matching |
| **Transaction Fee** | Per-transaction % or flat | Payments, fintech, booking | High volume, low per-transaction value |
| **Advertising** | CPM / CPC / CPA | Content, social, search | Massive free user base, engagement data |
| **Outcome-Based** | Success fee / performance | Consulting, lead gen, ROI-provable | Measurable outcomes, trust in attribution |
| **Hybrid / Credit** | Credits expiring on schedule | AI products, variable compute | Need to smooth revenue while reflecting usage; set credit expiries, commit tiers, rate limits |

**Model Fit Checklist:**
- Price metric aligns with value delivered and cost incurred
- Gross margin sustainable at scale (>70% software-only target)
- Customer can predict and control their spend
- Billing/metering infrastructure is feasible
- Failure modes identified: margin compression, adverse selection, channel conflict, support cost explosions

---

## 2. Pricing Strategy

### WTP Research Methods

- **Van Westendorp PSM:** Ask 4 price-point questions (too cheap, cheap, expensive, too expensive) to find acceptable range
- **Conjoint Analysis:** Trade-off experiments across features, price, and packaging
- **Gabor-Granger:** Sequential price acceptance to find demand curve
- **Customer Interviews:** Direct WTP questions with anchoring ("Would you pay $X?")
- **Competitive Benchmarking:** Map competitor pricing per value metric and tier

### Pricing Tier Design

| Element | Guidance |
|---------|----------|
| Number of tiers | 3 (good/better/best) is standard; 2 for simple, 4 max for enterprise |
| Value metric | Must align with how customers receive value (seats, usage, outcomes) |
| Tier differentiation | Feature gates, usage limits, support level, SLAs |
| Upgrade triggers | Usage approaching limit, team growth, feature need |
| Enforcement rules | Hard limits vs. soft limits with overage billing |
| Discount policy | Max discount %, approval levels, no ad-hoc deals without guardrails |
| Billing cadence | Monthly (lower friction) vs. annual (better cash flow, 15-20% discount typical) |

### Pricing Experiment Design

| Design | Best When | How to Read Results |
|--------|-----------|---------------------|
| A/B (randomized) | Self-serve / PLG flows | Compare conversion, ARPA, refunds, and downstream retention by assignment |
| Holdout / control cohort | Pricing hard to randomize | Compare treated vs. holdout cohorts matched on segment, channel, start month |
| Step rollout (time-based) | Enterprise contracts, invoicing cycles | Compare pre/post with parallel unexposed cohort to reduce seasonality bias |
| Geo / account rollout | Regions/segments separable | Compare regions/segments; watch for channel mix shifts |

**Decision Thresholds (example):** "NRR +2pts with no >0.5pt drop in activation and no >10% increase in support load"

### Lag Windows (avoid premature conclusions)

| Window | What to Measure |
|--------|----------------|
| Short (days to 2 weeks) | Checkout conversion, activation, sales cycle friction, refund/support spikes |
| Medium (4 to 8 weeks) | Upgrades, expansion MRR, usage growth, discounting behavior, proration effects |
| Long (90 to 180+ days) | Churn, net revenue retention, renewal outcomes, contraction risk |

---

## 3. Unit Economics

### CAC (Customer Acquisition Cost)

```
CAC = Total Sales & Marketing Spend / New Customers Acquired
```

**Worked example:**
```
Q1 S&M spend: $150,000
New customers acquired in Q1: 50
CAC = $150,000 / 50 = $3,000
```

Include: paid ads, content, sales comp (base + variable), tools, events. Exclude: brand marketing, product costs.

**By segment:** Always calculate CAC per segment (SMB vs. mid-market vs. enterprise) rather than blended averages.

### LTV (Lifetime Value) -- Cohort-Based

```
LTV = ARPU x Gross Margin x Average Customer Lifetime (months)
```

**Worked example:**
```
ARPU: $100/month
Gross Margin: 70%
Average Lifetime: 36 months (implied by ~2.8% monthly churn)
LTV = $100 x 0.70 x 36 = $2,520
```

**Cohort method (preferred):** Sum actual revenue from each cohort over time, weighted by retention curve. More accurate than formula-based for early-stage with limited data.

**Warning:** LTV from immature cohorts (<12 months of data) overstates true lifetime. Use observed data, not extrapolations.

### LTV:CAC Ratio

| Ratio | Interpretation | Action |
|-------|---------------|--------|
| < 1:1 | Losing money per customer | Stop spending, fix retention or reduce CAC |
| 1:1 - 2:1 | Barely sustainable | Improve retention or reduce CAC |
| 3:1 | Healthy | Scale acquisition |
| 4:1 - 5:1 | Very efficient | Consider more aggressive growth spend |
| > 5:1 | Under-investing in growth | Increase acquisition spend |

**2026 SaaS target:** 3-5x. Prioritize payback and gross margin over LTV:CAC alone -- it is the easiest ratio to game.

### CAC Payback Period

```
CAC Payback (months) = CAC / (ARPU x Gross Margin)
```

**Worked example:**
```
CAC: $3,000
ARPU: $100/month
Gross Margin: 70%
Payback = $3,000 / ($100 x 0.70) = 42.9 months  <-- too long, needs fixing
```

| Motion | Target Payback |
|--------|---------------|
| PLG / self-serve | 6-12 months |
| Sales-led (early stage) | 12-18 months |
| Enterprise | 18-24 months (offset by higher LTV) |

### Gross Margin

```
Gross Margin = (Revenue - COGS) / Revenue
```

| Business Model | Target |
|---------------|--------|
| Pure SaaS | 75-85% |
| SaaS + AI/compute | 60-75% (variable COGS from LLM/infra) |
| Marketplace | 60-70% contribution margin |
| E-Commerce | 40-60% |
| Services | 50-70% |

### Contribution Margin Per Unit (Usage-Based / AI Products)

```
Contribution Margin = Revenue Per Unit - Variable Cost Per Unit
```

For AI products: model token cost per call/job/workflow + infrastructure + third-party API costs. Set pricing guardrails: rate limits, minimums, commit tiers, credit expiries.

---

## 4. Three-Scenario Framework

| Scenario | Probability | Purpose | Assumption Shifts |
|----------|------------|---------|-------------------|
| **Conservative (P10)** | Worst realistic case | Cash management, survival planning | Acquisition -30%, churn +20%, ACV -15%, CAC +25% |
| **Base (P50)** | Most likely outcome | Board reporting, primary plan | Realistic assumptions from current data |
| **Optimistic (P90)** | Best realistic case | Upside planning, stretch goals | Acquisition +30%, churn -20%, ACV +15%, CAC -25% |

**Variable vs. Fixed assumptions:**
- **Variable across scenarios:** Customer acquisition rate, churn rate, average contract value, CAC
- **Fixed across scenarios:** Pricing structure, core operating expenses, hiring plan (adjust timing only, not roles)

---

## 5. Revenue Projections (Cohort-Based)

### Cohort Revenue Formula

```
MRR = SUM over all cohorts: (Cohort Size x Retention Rate at Month N x ARPU)
ARR = MRR x 12
```

**MRR Components:**
- New MRR (new customers x ARPU)
- Expansion MRR (upsells, cross-sells)
- Contraction MRR (downgrades)
- Churned MRR (lost customers)

```
Net New MRR = New MRR + Expansion MRR - Contraction MRR - Churned MRR
```

### SaaS Retention Curves (Typical)

| Month | Retained % | Notes |
|-------|-----------|-------|
| M1 | 100% | Starting cohort |
| M3 | 90% | Initial drop-off |
| M6 | 85% | Stabilizing |
| M12 | 75% | Annual benchmark |
| M24 | 70% | Mature retention |

### Time Horizon for Projections

| Period | Granularity | Purpose |
|--------|------------|---------|
| Year 1 | Monthly detail | Operational planning |
| Year 2 | Monthly detail | Growth modeling |
| Year 3 | Quarterly detail | Strategic direction |
| Years 4-5 | Annual projections | Long-term vision, fundraising narrative |

---

## 6. Cost Structure

### Operating Expense Categories

**1. Cost of Goods Sold (COGS)**
- Hosting and infrastructure (cloud compute, storage, CDN)
- Payment processing fees (2.9% + $0.30 typical)
- Customer support (variable portion)
- Third-party services per customer (APIs, LLM costs)

**2. Sales & Marketing (S&M)**
- Customer acquisition (paid ads, content, events)
- Sales team compensation (base + commission)
- Marketing tools and software
- Typical early-stage: 40-60% of revenue

**3. Research & Development (R&D)**
- Engineering team compensation
- Product management and design
- Development tools and infrastructure

**4. General & Administrative (G&A)**
- Executive team
- Finance, legal, HR
- Office, facilities, insurance, compliance

### Cost Behavior

| Type | Examples | Scaling |
|------|----------|---------|
| Fixed | Salaries, software licenses, rent | Step-function with hiring |
| Variable | Hosting, payment processing, support | Scales with revenue/usage |
| Semi-variable | Customer success, DevOps | Scales with customer count in steps |

### Fully-Loaded Compensation

```
Fully-Loaded Cost = Base Salary x 1.3 to 1.4
```

Multiplier covers: benefits, payroll taxes, equipment, software, office/remote stipend.

**Examples:**
```
Engineer:  $150K salary x 1.35 = $202K fully-loaded
Sales Rep: $100K OTE    x 1.30 = $130K fully-loaded
Designer:  $120K salary x 1.35 = $162K fully-loaded
```

---

## 7. Cash Flow Analysis

### Monthly Cash Flow Template

```
Beginning Cash Balance
  + Revenue Collected (consider payment terms: net-30, net-60)
  + Fundraising Proceeds
  - Operating Expenses Paid
  - Capital Expenditures
  = Ending Cash Balance
```

### Runway Calculation

```
Monthly Net Burn = Monthly Expenses - Monthly Revenue
Runway (months) = Cash Balance / Monthly Net Burn
```

If net burn is zero or negative (profitable), runway is infinite.

### Runway Planning Thresholds

| Runway | Status | Action |
|--------|--------|--------|
| 18+ months | Safe | Focus on growth |
| 12-18 months | Comfortable | Plan next raise |
| 6-12 months | Caution | Start fundraising NOW |
| < 6 months | Danger | Cut costs or raise urgently |

### Cash Flow Timing Pitfalls

- Revenue != cash: payment terms delay collection (enterprise net-30/60/90)
- Annual prepay improves cash flow but recognize revenue monthly
- Expenses often paid before revenue collected
- Model cash conversion cycle separately from P&L

---

## 8. Headcount Planning

### Department Ratios (Early-Stage SaaS)

| Department | % of Headcount | Notes |
|-----------|---------------|-------|
| Engineering | 40-50% | Higher pre-PMF, decreases post-scale |
| Sales & Marketing | 25-35% | Increases with go-to-market push |
| G&A | 10-15% | Lean early, grows with compliance needs |
| Customer Success | 5-10% | Grows with customer count |

### Stage-Appropriate Team Size

| Stage | Typical Headcount | Focus |
|-------|------------------|-------|
| Pre-Seed | 2-5 | Founders + 1-2 engineers |
| Seed | 5-15 | Core product team + first sales/CS hire |
| Series A | 15-40 | Build repeatable sales, expand engineering |
| Series B | 40-100 | Scale all departments, add management layer |

### Hiring Assumptions

- Time to fill: 3-6 months for most roles
- Ramp to productivity: 3-6 months after start
- Annual attrition: 10-15% (budget for backfill)
- Revenue per employee should grow year-over-year

---

## 9. Business Model Templates

### SaaS Financial Model

**Revenue Drivers:** New MRR, Expansion MRR, Contraction MRR, Churned MRR

**Key Ratios:**
- Gross margin: 75-85%
- S&M as % revenue: 40-60% (early stage)
- CAC payback: <12 months (PLG), <18 months (sales-led)
- Net revenue retention: 100-120%

**Projection Template:**
```
Year 1:  $500K ARR,  50 customers,  $42K MRR avg -> $100K MRR by Dec
Year 2:  $2.5M ARR, 200 customers, $208K MRR by Dec
Year 3:  $8M ARR,   600 customers, $667K MRR by Dec
```

### Marketplace Financial Model

**Revenue Drivers:** GMV (Gross Merchandise Value), Take Rate (% of GMV)

```
Net Revenue = GMV x Take Rate
```

**Key Ratios:**
- Take rate: 10-30% depending on category
- Separate CAC for buyers vs. sellers
- Contribution margin: 60-70%

**Projection Template:**
```
Year 1:  $5M GMV,  15% take rate = $750K revenue
Year 2:  $20M GMV, 15% take rate = $3M revenue
Year 3:  $60M GMV, 15% take rate = $9M revenue
```

### E-Commerce Financial Model

**Revenue Drivers:**
```
Revenue = Traffic x Conversion Rate x Average Order Value (AOV) x Purchase Frequency
```

**Key Ratios:**
- Gross margin: 40-60%
- Contribution margin: 20-35%
- CAC payback: 3-6 months
- Repeat purchase rate: critical for LTV

### Services / Agency Financial Model

**Revenue Drivers:**
```
Revenue = Billable Staff x Utilization Rate x Hourly Rate (or Project Fees)
```

**Key Ratios:**
- Gross margin: 50-70%
- Utilization: 70-85% target
- Revenue per employee: primary scaling metric
- Project backlog: 3-6 months healthy

---

## 10. SaaS Health Metrics

### Core SaaS Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| MRR | Sum of monthly recurring subscriptions | Growing MoM |
| ARR | MRR x 12 | $1M+ for Series A readiness |
| Logo Churn | Customers lost / Starting customers | <5% monthly SMB, <2% mid-market, <1% enterprise |
| Revenue Churn | MRR lost / Starting MRR | Lower than logo churn if smaller customers churn |
| NRR (Net Revenue Retention) | (Starting MRR - Churn - Contraction + Expansion) / Starting MRR | 100-120% target |

### Growth Quality Metrics

**Quick Ratio:**
```
Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)
```

| Quick Ratio | Interpretation |
|-------------|---------------|
| < 1 | Shrinking -- losing more than gaining |
| 1-2 | Slow growth, high churn drag |
| 2-4 | Moderate growth |
| > 4 | Healthy, sustainable growth |

**Magic Number:**
```
Magic Number = Net New ARR (this quarter) / S&M Spend (previous quarter)
```

| Magic Number | Interpretation |
|--------------|---------------|
| < 0.5 | Inefficient -- fix go-to-market before scaling |
| 0.5 - 0.75 | Moderate -- optimize and invest cautiously |
| 0.75 - 1.0 | Efficient -- scale S&M spend |
| > 1.0 | Very efficient -- invest aggressively |

**Rule of 40:**
```
Rule of 40 = Revenue Growth Rate (%) + Profit Margin (%)
```

Target: >40%. Companies can trade growth for profitability or vice versa. Example: 30% growth + 15% margin = 45% (passing).

**Burn Multiple:**
```
Burn Multiple = Net Burn / Net New ARR
```

| Burn Multiple | Interpretation |
|--------------|---------------|
| < 1x | Outstanding efficiency |
| 1-1.5x | Good |
| 1.5-2x | Acceptable early stage |
| > 2x | Concerning -- burning too much per dollar of ARR |

### Revenue Metric Definitions

```
Net New MRR = New MRR + Expansion MRR - Contraction MRR - Churned MRR
NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR x 100
CMGR = (Last Month MRR / First Month MRR)^(1/months) - 1
```

---

## 11. Fundraising Financial Prep

### Dilution Modeling

```
Post-Money Valuation = Pre-Money Valuation + Investment Amount
Dilution % = Investment Amount / Post-Money Valuation
Founder Ownership Post-Round = Pre-Round Ownership x (1 - Dilution %)
```

**Worked example:**
```
Raise:       $5M at $20M pre-money valuation
Post-Money:  $25M
Dilution:    $5M / $25M = 20%
Founder at 80% pre-round -> 80% x 0.80 = 64% post-round
```

### Use of Funds Allocation (Typical)

```
Product Development:     $2.0M (40%)
Sales & Marketing:       $2.0M (40%)
G&A and Operations:      $0.5M (10%)
Working Capital / Buffer: $0.5M (10%)
Total:                   $5.0M (100%)
```

Adjust ratios by stage: pre-seed/seed heavier on product (50-60%), Series A+ heavier on S&M (40-50%).

### Milestone-Based Planning

Ensure runway covers next key milestone + 6 months buffer:

| Milestone | Typical Timing | What It Proves |
|-----------|---------------|----------------|
| Product launch | 6-12 months | Can you build it? |
| First $1M ARR | 12-24 months | Is there demand? |
| CAC payback breakeven | 18-30 months | Is the model sustainable? |
| Series A raise | 18-24 months post-seed | Repeatable growth engine |

**Funding amount formula:**
```
Target Raise = Monthly Burn x (Months to Milestone + 6 month buffer)
```

---

## 12. Model Validation

### Sanity Checks

- [ ] Revenue growth rate achievable (3x Year 2, 2x Year 3 is aggressive but standard for VC-backed)
- [ ] Unit economics realistic (LTV:CAC > 3x, payback < 18 months)
- [ ] Burn multiple reasonable (<2.0 by Year 2-3)
- [ ] Headcount scales with revenue (revenue per employee growing YoY)
- [ ] Gross margin appropriate for business model (75%+ pure SaaS)
- [ ] S&M spending aligns with CAC and growth targets
- [ ] Cash flow timing accounts for payment terms (not just P&L revenue)
- [ ] Hiring plan includes ramp time (3-6 months to productivity)
- [ ] Expense estimates include 20% buffer for unknowns

### Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Overly optimistic revenue | Use conservative acquisition assumptions; model realistic churn |
| Underestimating costs | Add 20% buffer; use fully-loaded comp (1.3-1.4x); include all tools |
| Ignoring cash timing | Revenue != cash; model payment terms separately |
| Static headcount | Account for 3-6 month hiring lag, 3-6 month ramp, 10-15% attrition |
| Single scenario | Always model Conservative + Base + Optimistic |
| Blended averages | Segment CAC, LTV, churn by customer type -- blended numbers hide problems |
| Immature cohort extrapolation | Don't project LTV from <12 months of data |
| Margin blindness | Shipping usage growth that destroys gross margin (especially AI/compute products) |
| Gaming LTV:CAC | Prioritize payback period and gross margin -- LTV:CAC is easy to manipulate |

### Benchmark Comparison

Compare your model against similar-stage companies on:
- Growth rate (MoM for early, YoY for later)
- Burn multiple and efficiency ratios
- Gross margin by business model
- Revenue per employee
- CAC payback by sales motion (PLG vs. sales-led)

---

## 13. Step-by-Step Workflow

Follow these 7 steps sequentially to build a complete financial model from scratch.

### Step 1: Define Business Model

Clarify the revenue model and pricing before projecting anything.

- **SaaS:** Subscription tiers, annual vs. monthly contracts, free trial or freemium, expansion revenue strategy
- **Marketplace:** GMV projections, take rate (% of transactions), buyer and seller economics, transaction frequency
- **Transactional:** Transaction volume, revenue per transaction, frequency and seasonality
- **Usage-Based / AI:** Value metric (tokens, API calls, compute), metering infrastructure, credit expiries, commit tiers

### Step 2: Build Revenue Projections

Use cohort-based methodology for accuracy.

1. Define monthly new customer acquisitions (by channel if possible)
2. Apply a retention curve to each cohort (use observed data; see Section 5 for typical curves)
3. For each cohort at each month: Retained Customers x ARPU = Cohort MRR
4. Sum across all cohorts for total MRR
5. Add expansion MRR (upsells, cross-sells) and subtract contraction MRR

### Step 3: Model Cost Structure

Break down costs by category (COGS, S&M, R&D, G&A) and behavior (fixed vs. variable). See Section 6 for detailed categories.

- Identify which costs scale with revenue/usage (variable) vs. headcount (step-function)
- Set COGS as % of revenue; S&M as % of revenue tied to CAC payback
- Include 20% buffer on all expense estimates

### Step 4: Create Hiring Plan

Model headcount growth by role and department. See Section 8 for ratios.

- Start from current headcount
- Define hiring velocity by role (when each hire starts)
- Apply fully-loaded compensation (1.3-1.4x base salary)
- Account for 3-6 month hiring lag and 3-6 month ramp to productivity
- Budget for 10-15% annual attrition

### Step 5: Project Cash Flow

Calculate monthly cash position and runway. See Section 7.

- Map revenue to cash collected (account for payment terms: net-30/60/90)
- Map expenses to cash paid (timing may differ from P&L recognition)
- Track beginning cash -> inflows -> outflows -> ending cash each month
- Calculate runway = ending cash / monthly net burn

### Step 6: Calculate Key Metrics

Compute and track the metrics that matter for your stage.

- **Revenue:** MRR, ARR, growth rate (MoM and YoY)
- **Unit economics:** CAC, LTV, LTV:CAC, payback period, gross margin (see Section 3)
- **Efficiency:** Burn multiple, Magic Number, Rule of 40, Quick Ratio (see Section 10)
- **Cash:** Monthly burn, runway, cash efficiency

### Step 7: Scenario Analysis

Create three scenarios (Conservative, Base, Optimistic) using the framework in Section 4.

- Vary: customer acquisition rate (+/-30%), churn (+/-20%), ACV (+/-15%), CAC (+/-25%)
- Hold fixed: pricing structure, core operating expenses, hiring plan (adjust timing only)
- Validate each scenario against sanity checks in Section 12
- Identify break-even points and cash-out dates per scenario

---

## 14. Quick Start

Ask for the smallest set of inputs that makes the analysis meaningful:

| Input | What to Ask |
|-------|-------------|
| **Business type** | SaaS, usage-based/API, marketplace, services, hardware + service |
| **ICP / segment(s)** | SMB / mid-market / enterprise (and ACV/ARPA bands) |
| **Current pricing & packaging** | Value metric, tiers, limits, discount policy, billing cadence |
| **Unit economics drivers** | Fully-loaded CAC, gross margin/COGS (include LLM/infra/third-party), churn/retention, expansion (NRR) |
| **Constraints** | Sales motion (PLG vs. sales-led), billing/metering feasibility, gross margin floor, payback target |

If numbers are missing, proceed with ranges + explicit assumptions and highlight what to measure next.

### Routing Workflow

1. **Classify the model** -- Subscription, usage-based, freemium, marketplace take-rate, transaction fee, ads, outcome-based, credit-based, hybrid
2. **Build a segment-level unit economics snapshot** -- Prefer cohort/segment views over blended averages (Section 3)
3. **Evaluate model fit and risks** -- Align price metric with value delivered and cost incurred; identify failure modes (margin compression, adverse selection, channel conflict, support cost explosions)
4. **Propose pricing + packaging changes** -- Use WTP research methods (Section 2) to draft tiers, limits, upgrade triggers, and enforcement rules
5. **Define measurement and roll-out** -- Success metric + guardrails, evaluation design, explicit lag windows (Section 2)
6. **Deliver a decision-ready output** -- Recommendation, rationale, assumptions, scenarios (base/best/worst), and next experiments

### 2026 Heuristics (Context-Dependent)

- Prioritize payback and gross margin over a single ratio; LTV:CAC is the easiest to game
- Typical SaaS targets (directional, by segment/stage): LTV:CAC 3-5x, payback 6-12 months (PLG) or 12-18 months (sales-led early), NRR >100% (mid-market/enterprise), gross margin >70% (software-only)
- For usage-based / AI products: model contribution margin per unit (token/job/workflow) and set pricing guardrails (rate limits, minimums, commit tiers, credit expiries)

---

## 15. Pricing Experiments

Use this framework when changing pricing, packaging, value metric, limits, discounts, or billing cadence.

### Part 1: Define Success and Guardrails (Before Launch)

| Type | Examples |
|------|----------|
| **Primary success metric** | Net revenue retention (NRR), ARPA/ARPU, gross margin %, payback period, upgrade rate, expansion MRR |
| **Guardrails** | New logo conversion, activation rate, refund rate, support load, churn (logo + revenue), sales cycle length |

Write a go/no-go decision rule before launching (example: "NRR +2pts with no >0.5pt drop in activation and no >10% increase in support load").

### Part 2: Pick an Evaluation Design

| Design | Best When | How to Read Results |
|--------|-----------|---------------------|
| A/B (randomized) | Self-serve / PLG flows | Compare conversion, ARPA, refunds, and downstream retention by assignment |
| Holdout / control cohort | Pricing is hard to randomize | Compare treated vs. holdout cohorts matched on segment, channel, and start month |
| Step rollout (time-based) | Enterprise contracts, invoicing cycles | Compare pre/post with a parallel unexposed cohort to reduce seasonality bias |
| Geo / account rollout | Regions/segments are separable | Compare regions/segments; watch for channel mix shifts |

### Part 3: Use Explicit Lag Windows (Avoid Premature Conclusions)

- **Short lag (days to 2 weeks):** Checkout conversion, activation, sales cycle friction, refund/support spikes
- **Medium lag (4 to 8 weeks):** Upgrades, expansion MRR, usage growth, discounting behavior, proration effects
- **Long lag (90 to 180+ days, B2B):** Churn, net revenue retention, renewal outcomes, contraction risk

### Part 4: Report an "All-In" View (Not Just Conversion)

- **Revenue quality:** Net revenue after refunds, discounts, and credits; gross margin impact (including variable compute/COGS)
- **Segments:** Break down by plan, seat band, channel, ACV/ARR band, and customer age (new vs. renewal)
- **Decision rule:** Evaluate against the pre-defined go/no-go threshold from Part 1

---

## 16. Do / Avoid

### Do

- Define your value metric (seat / usage / outcome) and validate willingness-to-pay early
- Include COGS drivers in pricing decisions (especially usage-based and AI products)
- Use discount guardrails and renewal logic (avoid ad-hoc deals without approval levels)
- Segment all metrics by customer type -- blended averages hide problems
- Model three scenarios (conservative, base, optimistic) for every projection
- Use cohort-based LTV calculations with observed data, not formula extrapolations from immature cohorts

### Avoid

- Pricing as an afterthought ("we'll figure it out later")
- Margin blindness (shipping usage growth that destroys gross margin)
- Misleading LTV calculations from immature cohorts (<12 months of data)
- Single-scenario planning (always model the downside)
- Blended CAC/LTV across vastly different segments
- Ignoring cash flow timing (revenue != cash collected)

---

## 17. What Good Looks Like

A complete financial model meets these acceptance criteria:

- **Packaging:** A clear value metric, tier logic, and discount policy (with enforcement rules)
- **Unit economics:** CAC, gross margin, churn, payback, and retention defined and tied to cohorts -- by segment, not blended
- **Assumptions:** One inputs sheet with ranges/sensitivities and three scenarios (conservative / base / optimistic)
- **Projections:** Cohort-based revenue, monthly detail for Years 1-2, quarterly for Year 3, annual for Years 4-5
- **Experiments:** Pricing changes tested with pre-defined decision rules and lag windows (not "gut feel" rollouts)
- **Risks:** Margin compression, adverse selection, channel conflict, and support cost explosion modeled as failure modes
- **Cash flow:** Separate cash flow model accounting for payment terms, not just P&L recognition
- **Validation:** All sanity checks in Section 12 pass; benchmarks compared against similar-stage companies

---

## Related Skills

- [startup-idea-validation](../startup-idea-validation/) -- Problem-market fit, ICP definition
- [startup-competitive-analysis](../startup-competitive-analysis/) -- Competitor pricing benchmarks
- [startup-fundraising](../startup-fundraising/) -- Pitch decks, dilution, investor materials
- [startup-go-to-market](../startup-go-to-market/) -- Channel strategy, sales motion design
