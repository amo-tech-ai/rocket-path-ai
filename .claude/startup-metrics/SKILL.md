---
name: startup-metrics
description: Use this skill when building metrics dashboards, tracking KPIs, calculating unit economics, or analyzing startup health. Triggers on "MRR", "ARR", "CAC", "LTV", "churn", "retention", "runway", "burn rate", "unit economics", "Quick Ratio", "Rule of 40".
---

# Startup Metrics

## Overview

Comprehensive startup KPI tracking with formulas, benchmarks, and stage-specific guidance. Covers revenue metrics (MRR/ARR), customer metrics (CAC/LTV/Churn), financial metrics (burn/runway), and growth metrics (NRR/Quick Ratio/Rule of 40).

## When to Use

- Building metrics dashboards
- Calculating unit economics (CAC, LTV, payback)
- Analyzing startup health (Quick Ratio, Rule of 40)
- Tracking stage-appropriate KPIs
- Generating investor-ready metrics reports

## Top 20 Metrics Quick Reference

| # | Metric | Category | Formula | Benchmark |
|---|--------|----------|---------|-----------|
| 1 | MRR | Revenue | Sum of monthly subscriptions | Growing MoM |
| 2 | ARR | Revenue | MRR × 12 | $1M+ for Series A |
| 3 | Gross Margin | Financial | (Revenue - COGS) / Revenue | 60-80% SaaS |
| 4 | Burn Rate | Financial | Monthly expenses - Revenue | < 1/12 of cash |
| 5 | Runway | Financial | Cash / Monthly burn | 12-18 months |
| 6 | CAC | Customer | Sales+Marketing / New customers | Varies by model |
| 7 | LTV | Customer | ARPU × Avg lifespan | 3× CAC minimum |
| 8 | LTV:CAC | Ratio | LTV / CAC | 3:1 or higher |
| 9 | CAC Payback | Ratio | CAC / Monthly margin | < 12 months |
| 10 | Churn | Retention | Lost customers / Starting customers | < 5% monthly |
| 11 | Net Revenue Retention | Retention | (MRR - Churn + Expansion) / MRR | > 100% |
| 12 | DAU/MAU | Engagement | Daily active / Monthly active | > 20% |
| 13 | Activation Rate | Product | Users completing setup / Signups | 25-40% |
| 14 | Conversion Rate | Product | Paying / Free users | 2-5% freemium |
| 15 | NPS | Satisfaction | Promoters - Detractors | > 40 excellent |
| 16 | CMGR | Growth | (Last/First)^(1/months) - 1 | 15-20% early |
| 17 | Quick Ratio | Health | (New+Expansion) / (Churn+Contraction) | > 4 strong |
| 18 | Rule of 40 | Health | Growth rate + Profit margin | > 40% |
| 19 | GMV | Marketplace | Total transaction value | Context-dependent |
| 20 | ACV | Sales | Annual contract value | Growing YoY |

## Metric Formulas

### Revenue Metrics

```typescript
interface MRRComponents {
  new_mrr: number;       // Revenue from new customers
  expansion_mrr: number; // Upsells and upgrades
  contraction_mrr: number; // Downgrades
  churned_mrr: number;   // Cancellations
}

function calculateNetNewMRR(mrr: MRRComponents): number {
  return mrr.new_mrr + mrr.expansion_mrr - mrr.contraction_mrr - mrr.churned_mrr;
}

function calculateARR(mrr: number): number {
  return mrr * 12;
}
```

### Customer Metrics

```typescript
interface UnitEconomics {
  arpu: number;          // Average Revenue Per User
  grossMargin: number;   // 0-1
  monthlyChurn: number;  // 0-1
  salesMarketingCost: number;
  newCustomers: number;
}

function calculateCAC(data: UnitEconomics): number {
  return data.salesMarketingCost / data.newCustomers;
}

function calculateLTV(data: UnitEconomics): number {
  const avgLifespan = 1 / data.monthlyChurn;
  return data.arpu * data.grossMargin * avgLifespan;
}

function calculateLTVCACRatio(ltv: number, cac: number): number {
  return ltv / cac;
}

function calculateCACPayback(cac: number, arpu: number, margin: number): number {
  return cac / (arpu * margin); // months
}
```

### Financial Metrics

```typescript
interface FinancialHealth {
  cashBalance: number;
  monthlyExpenses: number;
  monthlyRevenue: number;
}

function calculateGrossBurn(data: FinancialHealth): number {
  return data.monthlyExpenses;
}

function calculateNetBurn(data: FinancialHealth): number {
  return data.monthlyExpenses - data.monthlyRevenue;
}

function calculateRunway(data: FinancialHealth): number {
  const netBurn = calculateNetBurn(data);
  return netBurn > 0 ? data.cashBalance / netBurn : Infinity;
}
```

### Growth Metrics

```typescript
function calculateNRR(
  startMRR: number,
  churnedMRR: number,
  expansionMRR: number
): number {
  return ((startMRR - churnedMRR + expansionMRR) / startMRR) * 100;
}

function calculateQuickRatio(
  newMRR: number,
  expansionMRR: number,
  churnedMRR: number,
  contractionMRR: number
): number {
  return (newMRR + expansionMRR) / (churnedMRR + contractionMRR);
}

function calculateRuleOf40(growthRate: number, profitMargin: number): number {
  return growthRate + profitMargin;
}

function calculateCMGR(lastMonth: number, firstMonth: number, months: number): number {
  return Math.pow(lastMonth / firstMonth, 1 / months) - 1;
}
```

## Metrics by Stage

### Pre-Seed Metrics

| Priority | Metric | Target |
|----------|--------|--------|
| 1 | Customer interviews | 20+ completed |
| 2 | Waitlist signups | 100+ engaged |
| 3 | Willingness to pay | 50%+ say yes |
| 4 | Problem severity | 8+/10 rating |
| 5 | Early evangelists | 5+ identified |

### Seed Metrics

| Priority | Metric | Target |
|----------|--------|--------|
| 1 | MRR | $10K-50K |
| 2 | MoM Growth | 15-20% |
| 3 | Activation Rate | 25%+ |
| 4 | Retention (Day 30) | 20%+ |
| 5 | NPS | 30+ |

### Series A Metrics

| Priority | Metric | Target |
|----------|--------|--------|
| 1 | ARR | $1M-3M |
| 2 | MoM Growth | 10-15% |
| 3 | LTV:CAC | 3:1+ |
| 4 | CAC Payback | < 12 months |
| 5 | Net Revenue Retention | 100%+ |
| 6 | Gross Margin | 60%+ |

### Series B+ Metrics

| Priority | Metric | Target |
|----------|--------|--------|
| 1 | ARR | $5M+ |
| 2 | Rule of 40 | > 40 |
| 3 | Quick Ratio | > 4 |
| 4 | NRR | 110%+ |
| 5 | CAC Payback | < 12 months |
| 6 | Gross Margin | 70%+ |

## Benchmark Tables

### LTV:CAC Interpretation

| Ratio | Meaning | Action |
|-------|---------|--------|
| < 1:1 | Losing money | Stop spending, fix retention |
| 1:1 - 2:1 | Barely sustainable | Improve retention or reduce CAC |
| 3:1 | Healthy | Scale acquisition |
| 4:1 - 5:1 | Very efficient | Consider more aggressive growth |
| > 5:1 | Under-investing | Spend more on acquisition |

### Churn Benchmarks (Monthly)

| Market | Good | Average | Concerning |
|--------|------|---------|------------|
| Enterprise SaaS | < 1% | 1-2% | > 3% |
| Mid-market SaaS | < 2% | 2-4% | > 5% |
| SMB SaaS | < 3% | 3-5% | > 7% |
| Consumer | < 5% | 5-10% | > 15% |

### Runway Planning

| Runway | Status | Action |
|--------|--------|--------|
| 18+ months | Safe | Focus on growth |
| 12-18 months | Comfortable | Plan next raise |
| 6-12 months | Caution | Start fundraising NOW |
| < 6 months | Danger | Cut costs or raise urgently |

## Vanity Metrics to Avoid

| Vanity Metric | Better Alternative | Why |
|---------------|-------------------|-----|
| Total downloads | Activated users | Downloads don't mean usage |
| Page views | Conversion rate | Views don't mean engagement |
| Registered users | Active users | Registrations don't mean retention |
| Social followers | Engagement rate | Followers don't mean customers |
| Cumulative revenue | MoM growth | Cumulative always goes up |

## Edge Function: `metrics-analyzer`

```typescript
// Actions
- 'calculate_unit_economics': Compute CAC, LTV, payback
- 'assess_health': Quick Ratio, Rule of 40 analysis
- 'stage_metrics': Recommend metrics for current stage
- 'benchmark_compare': Compare against industry benchmarks
- 'forecast_runway': Project runway based on growth
```

## AI Model Selection

| Task | Model |
|------|-------|
| Metric calculations | `gemini-3-flash-preview` |
| Benchmark analysis | `gemini-3-pro-preview` |
| Health assessment | `gemini-3-pro-preview` |
| Strategic recommendations | `claude-sonnet-4-5-20250929` |

## References

- [a16z: 16 Startup Metrics](https://a16z.com/16-startup-metrics/)
- PRD Section 12: Dashboards & Analytics
- `/startup-system/guides/08-startup-metrics.md`
