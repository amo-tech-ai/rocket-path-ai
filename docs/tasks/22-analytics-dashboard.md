# 151 - Analytics Dashboard

> Track AARRR pirate metrics with cohort analysis

---

| Aspect | Details |
|--------|---------|
| **Screens** | AnalyticsDashboard page |
| **Features** | AARRR funnel, cohorts, LTV/CAC, retention curves |
| **Agents** | — |
| **Edge Functions** | /compute-metrics |
| **Use Cases** | Track growth health, identify bottlenecks |
| **Real-World** | "Founder sees 40% activation rate, identifies onboarding as bottleneck" |

---

```yaml
---
task_id: 151-ANA
title: Analytics Dashboard
diagram_ref: —
phase: GROWTH
priority: P1
status: Not Started
skill: /frontend-design
ai_model: —
subagents: [frontend-designer, supabase-expert]
edge_function: compute-metrics
schema_tables: [metric_snapshots, cohorts]
depends_on: [150-traction]
---
```

---

## Description

Build an AARRR (Pirate Metrics) dashboard showing Acquisition → Activation → Retention → Revenue → Referral funnel. Include cohort analysis, LTV/CAC calculator, and retention curves. Auto-compute metrics from existing data.

## Rationale

**Problem:** Founders don't know which metrics matter.
**Solution:** AARRR framework with visualizations.
**Impact:** Clear view of growth health and bottlenecks.

---

## Goals

1. **Primary:** Display AARRR funnel metrics
2. **Secondary:** Cohort retention analysis
3. **Quality:** Metrics compute in <5 seconds

## Acceptance Criteria

- [ ] AARRR funnel visualization
- [ ] Acquisition: signups, sources
- [ ] Activation: onboarding completion %
- [ ] Retention: D1, D7, D30 curves
- [ ] Revenue: MRR, ARPU, churn
- [ ] Referral: viral coefficient
- [ ] LTV/CAC ratio calculation
- [ ] Cohort retention heatmap
- [ ] Time period filters (7d, 30d, 90d)

---

## AARRR Metrics

| Stage | Metric | Calculation |
|-------|--------|-------------|
| **Acquisition** | Signups | COUNT(users) per period |
| **Activation** | Activation Rate | Completed onboarding / Signups |
| **Retention** | D7 Retention | Active on day 7 / Activated |
| **Revenue** | MRR | SUM(active subscriptions) |
| **Referral** | Viral Coeff | Invites sent × conversion rate |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_metrics.sql` | Create |
| Page | `src/pages/AnalyticsDashboard.tsx` | Create |
| Component | `src/components/analytics/AARRRFunnel.tsx` | Create |
| Component | `src/components/analytics/CohortHeatmap.tsx` | Create |
| Component | `src/components/analytics/RetentionCurve.tsx` | Create |
| Component | `src/components/analytics/LTVCalculator.tsx` | Create |
| Hook | `src/hooks/useMetrics.ts` | Create |
| Edge Function | `supabase/functions/compute-metrics/index.ts` | Create |

---

## Verification

```bash
npm run lint && npm run typecheck && npm run build
# Verify funnel renders
# Check cohort data populates
# Test time period filters
```
