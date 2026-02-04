# 112 - Financial Projections

> Unit economics, revenue models, and pricing validation

---

| Aspect | Details |
|--------|---------|
| **Screens** | Financial Projections (new screen) |
| **Features** | Unit economics, revenue models, pricing strategies, 3-year projections |
| **Agents** | financial-agent (new) |
| **Edge Functions** | /financial-agent |
| **Use Cases** | Business model validation, investor-ready financials |
| **Real-World** | "LTV:CAC 5:1, 8-month payback, $1.2M ARR Year 3" |

---

```yaml
---
task_id: 112-financial-projections
title: Financial Projections
diagram_ref: validator-platform
phase: MVP
priority: P1
status: Not Started
skill: /feature-dev
ai_model: gemini-3-pro-preview
subagents: [frontend-designer, supabase-expert, ai-agent-dev]
edge_function: financial-agent
schema_tables: [idea_unit_economics, idea_revenue_projections, idea_revenue_models, idea_pricing_strategies]
depends_on: [111-competitor-intel]
---
```

---

## Description

Build a financial projections system that calculates unit economics (CAC, LTV, payback), evaluates revenue model fit, recommends pricing strategies, and generates 3-year revenue projections. Uses industry benchmarks from market analysis and competitor pricing data.

## Rationale

**Problem:** Founders struggle to validate business model viability before building.
**Solution:** AI-powered financial modeling with industry benchmarks.
**Impact:** Data-backed pricing and revenue projections for investor conversations.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see my unit economics | I know if the business model works |
| Founder | compare revenue models | I can pick the right monetization |
| Founder | get pricing recommendations | I don't leave money on the table |
| Investor | review financial projections | I can assess scalability |

## Real-World Example

> Marcus reviews financials for his restaurant inventory SaaS:
> - **CAC:** $450 (paid marketing + sales)
> - **LTV:** $2,700 (36 months × $75/mo avg)
> - **LTV:CAC:** 6:1 (excellent)
> - **Payback:** 6 months
> - **Recommended Model:** SaaS subscription with usage tiers
> - **Year 3 ARR:** $1.8M (200 customers × $750/mo avg)

---

## Goals

1. **Primary:** Calculate realistic unit economics with benchmarks
2. **Secondary:** Recommend optimal pricing and revenue model
3. **Quality:** Projections grounded in market data, not wishful thinking

## Acceptance Criteria

- [ ] Unit economics dashboard (CAC, LTV, ratio, payback)
- [ ] Revenue model comparison with fit scores
- [ ] Pricing strategy recommendations
- [ ] 3-year revenue projection chart
- [ ] Sensitivity analysis (best/base/worst case)
- [ ] Industry benchmark comparisons
- [ ] Assumptions clearly stated and editable
- [ ] Generation time <30 seconds

---

## Financial Analysis Structure

### Unit Economics Dashboard

| Metric | Definition | Benchmark Comparison |
|--------|------------|---------------------|
| CAC | Customer Acquisition Cost | vs industry average |
| LTV | Customer Lifetime Value | vs industry average |
| LTV:CAC | Ratio of value to cost | Target: 3:1 minimum |
| Payback | Months to recover CAC | Target: <12 months |
| Gross Margin | Revenue minus direct costs | Target: >70% for SaaS |
| Churn | Monthly customer loss rate | Target: <5% monthly |

### Revenue Model Evaluation

| Model | Fit Score | Best For | Considerations |
|-------|-----------|----------|----------------|
| Per-seat subscription | 1-10 | Collaboration tools | Predictable, but limits adoption |
| Usage-based | 1-10 | Developer tools, APIs | Scales with value, variable revenue |
| Flat-rate | 1-10 | Simple products | Easy decision, leaves money on table |
| Freemium | 1-10 | Viral products | Acquisition engine, conversion challenge |
| Tiered | 1-10 | Diverse customers | Captures more value, complexity |

### Pricing Strategy Recommendations

| Strategy | When to Use | Risk Level |
|----------|-------------|------------|
| Value-based | Clear ROI measurable | Low |
| Competitor-based | Established market | Medium |
| Cost-plus | Commodity market | High |
| Penetration | New market entry | Medium |
| Premium | Strong differentiation | Low |

### 3-Year Projection

| Year | Customers | ARPU | MRR | ARR | Growth |
|------|-----------|------|-----|-----|--------|
| Y1 | X | $X | $X | $X | — |
| Y2 | X | $X | $X | $X | X% |
| Y3 | X | $X | $X | $X | X% |

---

## Schema

### Table: idea_unit_economics

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups, NOT NULL |
| validation_report_id | uuid | FK → validation_reports |
| cac | numeric | Customer Acquisition Cost |
| cac_breakdown | jsonb | Marketing, sales, etc. |
| ltv | numeric | Lifetime Value |
| ltv_calculation | text | Methodology |
| ltv_cac_ratio | numeric | Ratio |
| payback_months | numeric | Months to recover CAC |
| gross_margin | numeric | Percentage |
| monthly_churn | numeric | Percentage |
| industry_benchmark_cac | numeric | Industry average |
| industry_benchmark_ltv | numeric | Industry average |
| created_at | timestamptz | default now() |

### Table: idea_revenue_projections

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| unit_economics_id | uuid | FK → idea_unit_economics |
| year | integer | 1, 2, 3, etc. |
| scenario | text | CHECK IN ('best', 'base', 'worst') |
| customers | integer | End of year count |
| arpu | numeric | Average Revenue Per User |
| mrr | numeric | Monthly Recurring Revenue |
| arr | numeric | Annual Recurring Revenue |
| growth_rate | numeric | YoY growth percentage |
| assumptions | jsonb | Key assumptions for this projection |

### Table: idea_revenue_models

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups |
| model_type | text | NOT NULL |
| fit_score | integer | 1-10 |
| rationale | text | Why this score |
| pros | text[] | Advantages |
| cons | text[] | Disadvantages |
| recommended_implementation | text | How to implement |
| is_recommended | boolean | Top recommendation |

### Table: idea_pricing_strategies

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups |
| strategy_name | text | NOT NULL |
| recommended_price_low | numeric | Range low |
| recommended_price_high | numeric | Range high |
| rationale | text | Why this range |
| competitor_reference | text | What competitors charge |
| value_anchor | text | Value justification |
| risk_level | text | CHECK IN ('low', 'medium', 'high') |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_financial_tables.sql` | Create |
| Types | `src/types/financial.ts` | Create |
| Hook | `src/hooks/useFinancialProjections.ts` | Create |
| Page | `src/pages/FinancialProjections.tsx` | Create |
| Component | `src/components/financial/UnitEconomics.tsx` | Create |
| Component | `src/components/financial/RevenueModels.tsx` | Create |
| Component | `src/components/financial/PricingStrategy.tsx` | Create |
| Component | `src/components/financial/ProjectionChart.tsx` | Create |
| Edge Function | `supabase/functions/financial-agent/index.ts` | Create |

---

## Projection Visualization

### Revenue Chart (3-Year)

Display a line chart showing:
- Base case (solid line)
- Best case (dashed line, +30%)
- Worst case (dashed line, -30%)

X-axis: Months/Quarters
Y-axis: ARR ($)

### Unit Economics Gauge

Display gauges or progress bars for:
- LTV:CAC ratio (target: 3:1, excellent: 5:1+)
- Payback period (target: <12 months)
- Gross margin (target: >70%)

Color coding: Red (<target), Yellow (at target), Green (>target)

---

## Edge Function: financial-agent

### Actions

| Action | Input | Output |
|--------|-------|--------|
| `calculate_unit_economics` | startup_id, assumptions | Unit economics |
| `evaluate_revenue_models` | startup_id, industry | Model fit scores |
| `recommend_pricing` | startup_id, competitors | Pricing strategy |
| `generate_projections` | startup_id, assumptions | 3-year projections |

### AI Considerations

The agent should:
- Use industry benchmarks from 110-market-analysis
- Reference competitor pricing from 111-competitor-intel
- Apply conservative assumptions by default
- Clearly state all assumptions made
- Flag unrealistic projections (>100% YoY growth after Y1)

---

## Pricing Reference (from 20-saas.md)

Use the 15 pricing strategies documented in the knowledge base:
1. Value-Based
2. Tiered
3. Per-Seat/User
4. Usage-Based
5. Freemium
6. Free Trial
7. Flat-Rate
8. Feature-Based Tiers
9. Per-Active-User
10. Outcome-Based
11. Hybrid
12. Penetration
13. Premium
14. Dynamic
15. Platform/Marketplace

Match recommendation to startup characteristics.

---

## Benchmark Data Sources

| Metric | Source | Refresh |
|--------|--------|---------|
| SaaS CAC by industry | KeyBanc, OpenView | Quarterly |
| SaaS LTV benchmarks | SaaS Capital | Annual |
| Churn by company size | Recurly, ProfitWell | Monthly |
| Pricing benchmarks | Competitor analysis | On-demand |

---

## Assumptions Editor

Allow users to modify key assumptions:

| Assumption | Default | User Editable |
|------------|---------|---------------|
| Monthly growth rate | 10% | Yes |
| Churn rate | 3% | Yes |
| CAC trend | Flat | Yes |
| Price increase Year 2 | 0% | Yes |
| Expansion revenue | 10% of base | Yes |

Projections recalculate when assumptions change.

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No pricing data | Use industry averages, flag uncertainty |
| Very early stage | Focus on assumptions validation, not precision |
| Hardware + SaaS | Separate unit economics for each |
| Marketplace model | Calculate take rate economics |

---

## Verification

- Generate financials for SaaS startup
- Verify unit economics calculations are correct
- Check revenue models have appropriate fit scores
- Verify projections are realistic (flag >100% growth)
- Test assumption editing recalculates correctly
- Compare benchmarks to industry data

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Chart components | Recharts or existing charts |
| Data tables | `src/components/ui/table.tsx` |
| Edge function pattern | `supabase/functions/lean-canvas-agent/` |
| Market benchmarks | `idea_market_benchmarks` from 110 |
| Competitor pricing | `idea_competitors` from 111 |
