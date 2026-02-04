# 152 - PMF Checker

> Measure product-market fit with Sean Ellis survey

---

| Aspect | Details |
|--------|---------|
| **Screens** | PMFChecker page |
| **Features** | Sean Ellis survey, retention signals, PMF score |
| **Agents** | — |
| **Edge Functions** | — |
| **Use Cases** | Quantify PMF, track improvement |
| **Real-World** | "42% say 'very disappointed' → PMF achieved!" |

---

```yaml
---
task_id: 152-PMF
title: PMF Checker
diagram_ref: —
phase: GROWTH
priority: P1
status: Not Started
skill: /feature-dev
ai_model: —
subagents: [frontend-designer, supabase-expert]
edge_function: —
schema_tables: [pmf_surveys, pmf_responses]
depends_on: [151-analytics]
---
```

---

## Description

Implement the Sean Ellis PMF survey: "How would you feel if you could no longer use this product?" Track responses over time and calculate PMF score. Target is 40%+ "very disappointed" responses.

## Rationale

**Problem:** PMF is vague and hard to measure.
**Solution:** Standardized Sean Ellis methodology.
**Impact:** Quantifiable PMF score to track over time.

---

## Goals

1. **Primary:** Run Sean Ellis survey
2. **Secondary:** Calculate PMF score
3. **Quality:** Track score over time

## Acceptance Criteria

- [ ] Survey with 4-option scale
- [ ] PMF score calculation (% very disappointed)
- [ ] Historical score tracking
- [ ] Benchmark comparison (40% target)
- [ ] Survey distribution (email, in-app)
- [ ] Response analytics

---

## Sean Ellis Scale

| Response | Weight | Interpretation |
|----------|--------|----------------|
| Very disappointed | PMF+ | Strong signal |
| Somewhat disappointed | Neutral | Weak signal |
| Not disappointed | No PMF | Red flag |
| N/A - no longer use | Churn | Critical |

**PMF Score** = (Very disappointed / Total responses) × 100

**Target:** ≥40% = PMF achieved

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_pmf.sql` | Create |
| Page | `src/pages/PMFChecker.tsx` | Create |
| Component | `src/components/pmf/SurveyForm.tsx` | Create |
| Component | `src/components/pmf/PMFGauge.tsx` | Create |
| Component | `src/components/pmf/ScoreHistory.tsx` | Create |
| Hook | `src/hooks/usePMF.ts` | Create |

---

## Verification

```bash
npm run lint && npm run typecheck && npm run build
# Submit survey response
# Verify score calculates
# Check history chart
```
