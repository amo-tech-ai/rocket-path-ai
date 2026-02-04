# 154 - Growth Experiments

> Run and track A/B tests and growth experiments

---

| Aspect | Details |
|--------|---------|
| **Screens** | GrowthLab page |
| **Features** | Experiment design, A/B tracking, results analysis |
| **Agents** | — |
| **Edge Functions** | — |
| **Use Cases** | Test hypotheses, optimize conversion |
| **Real-World** | "Test headline A vs B → B wins with 15% lift" |

---

```yaml
---
task_id: 154-EXP
title: Growth Experiments
diagram_ref: —
phase: GROWTH
priority: P2
status: Not Started
skill: /feature-dev
ai_model: —
subagents: [frontend-designer, supabase-expert]
edge_function: —
schema_tables: [growth_experiments, experiment_results]
depends_on: [150-traction]
---
```

---

## Description

Build an experiment tracking system for growth tests. Founders create hypotheses, run experiments, track results, and document learnings. Supports A/B tests, landing page tests, pricing experiments, and more.

## Goals

1. **Primary:** Track growth experiments
2. **Secondary:** Document learnings
3. **Quality:** 2+ experiments per week velocity

## Acceptance Criteria

- [ ] Create experiment with hypothesis
- [ ] Define success metrics
- [ ] Track control vs variant
- [ ] Calculate statistical significance
- [ ] Record results and learnings
- [ ] Archive completed experiments

---

## Experiment Structure

| Field | Description |
|-------|-------------|
| Hypothesis | "If we [change], then [metric] will [improve by X%]" |
| Metric | Primary KPI to measure |
| Duration | Test length (days) |
| Sample Size | Minimum observations |
| Control | Baseline version |
| Variant | Test version |
| Result | Win / Lose / Inconclusive |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_experiments.sql` | Create |
| Page | `src/pages/GrowthLab.tsx` | Create |
| Component | `src/components/experiments/ExperimentCard.tsx` | Create |
| Component | `src/components/experiments/ResultsChart.tsx` | Create |
| Hook | `src/hooks/useExperiments.ts` | Create |
