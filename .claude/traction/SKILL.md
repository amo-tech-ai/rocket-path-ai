---
name: traction
description: Use this skill when building traction features - metrics dashboards, OMTM tracking, Customer Factory analysis, PMF scoring, cohort analysis. Triggers on "traction", "metrics", "OMTM", "Customer Factory", "PMF", "cohort", "growth rate".
---

# Traction

## Overview

Track and optimize startup growth through Customer Factory metrics, OMTM identification, PMF scoring, and cohort analysis.

## When to Use

- Building metrics dashboards
- Implementing OMTM tracking
- Creating PMF assessment
- Designing cohort analysis
- Identifying growth bottlenecks

## Customer Factory Model

```
ACQUISITION → ACTIVATION → RETENTION → REVENUE → REFERRAL
     ↓            ↓            ↓           ↓          ↓
  Visitors    Engaged      Repeat     Paying     Advocates
              Users        Users      Customers

At any time, ONE step is the bottleneck.
Focus 80% effort there.
```

## Key Metrics by Stage

| Stage | Primary Metric | Secondary | Target |
|-------|----------------|-----------|--------|
| Idea | Interviews done | Problem severity | 20+ |
| PSF | Signup rate | Activation | 100+ signups |
| MVP | Active users | Retention | 25%+ week 1 |
| Traction | Growth rate | PMF score | 10% WoW |
| Scale | MRR | LTV:CAC | 3:1+ |

## PMF Assessment

```typescript
interface PMFScore {
  very_disappointed: number;  // Target: ≥40%
  somewhat_disappointed: number;
  not_disappointed: number;
}

function assessPMF(survey: PMFScore): PMFResult {
  if (survey.very_disappointed >= 40) {
    return { achieved: true, ready_to_scale: true };
  }
  if (survey.very_disappointed >= 25) {
    return { achieved: false, close: true, focus: 'activation' };
  }
  return { achieved: false, close: false, focus: 'product' };
}
```

## OMTM by Stage

```typescript
const OMTM_BY_STAGE = {
  idea: 'interviews_completed',
  psf: 'signup_rate',
  mvp: 'activation_rate',
  traction: 'week1_retention',
  scale: 'mrr_growth_rate'
};
```

## Bottleneck Detection

```typescript
function findBottleneck(funnel: FunnelMetrics): string {
  const stages = ['acquisition', 'activation', 'retention', 'revenue', 'referral'];
  const benchmarks = {
    acquisition: 0.05,  // 5% visitor to signup
    activation: 0.25,   // 25% signup to activated
    retention: 0.40,    // 40% week 1 retention
    revenue: 0.05,      // 5% to paid
    referral: 0.10      // 10% refer others
  };

  for (const stage of stages) {
    if (funnel[stage] < benchmarks[stage]) {
      return stage;
    }
  }
  return 'none'; // All healthy
}
```

## Traction Roadmap

```
NOW (+90 days)     NEXT (+180 days)    LATER (+360 days)
─────────────────  ─────────────────   ─────────────────
Most concrete      Less concrete        Fuzziest
├── 100 users      ├── 1000 users      ├── 10000 users
├── $1K MRR        ├── $10K MRR        ├── $100K MRR
└── 40% PMF        └── Hire #1         └── Series A
```

## Edge Function: `traction-analyst`

```typescript
// Actions
- 'analyze_funnel': Identify bottleneck in Customer Factory
- 'recommend_omtm': Suggest OMTM for current stage
- 'score_pmf': Run PMF assessment
- 'project_growth': Forecast based on current rates
```

## AI Model Selection

| Task | Model |
|------|-------|
| Metric analysis | `gemini-3-flash-preview` |
| Bottleneck ID | `gemini-3-pro-preview` |
| Growth projection | `gemini-3-pro-preview` |
| Strategy recommendations | `claude-sonnet-4-5-20250929` |

## References

- PRD Section 12: Dashboards & Analytics
- Diagram D-14: PMF Assessment
- `/tasks/guides/08-startup-metrics.md`
