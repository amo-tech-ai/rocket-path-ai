---
task_id: DES-023
title: Beeswarm Plot
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 23 — Beeswarm Plot

> **Category:** Distribution
> **When to use:** Individual data points within a distribution. Each dot is a real entity — more detail than a histogram.
> **Flourish template:** Scatter variant / Survey
> **Best for:** Individual company scores, employee ratings, city rankings, any "show me every data point" need

---

## Prompt A — Generate Beeswarm Plot

```
Create a beeswarm plot showing individual data points in a distribution.

DATA: [e.g., "150 companies: each with an AI maturity score (1-100), colored by industry"]
STORY: [e.g., "Tech companies cluster at 70-85 while manufacturing spreads widely from 20-60"]

Create:
1. X-axis: the measured value (continuous)
2. Dots jittered vertically to avoid overlap (no stacking)
3. Each dot = one real entity
4. Color by category (max 5 colors):
   - Tech: #0B6E4F
   - Finance: #6366F1
   - Manufacturing: #F59E0B
   - Healthcare: #14B8A6
   - Other: #9CA3AF
5. Median line per category: dashed vertical line with label
6. Dot size: 4-6px (uniform)
7. Interactive: hover to see entity name + exact value + category
8. Source with sample size

Data as CSV: Name, Value, Category
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Too few points (<20) | Use a strip plot or just a table |
| Dots overlapping completely | Increase jitter or chart width |
| No category grouping | Beeswarm is most useful when comparing distributions ACROSS groups |
