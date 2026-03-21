---
task_id: DES-022
title: Population Pyramid
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 22 — Population Pyramid

> **Category:** Distribution
> **When to use:** Comparing two distributions side-by-side. Classic: male/female by age. Works for any two-group comparison.
> **Flourish template:** Population pyramid
> **Best for:** Employee demographics, customer segments, early vs growth-stage, any A vs B distribution

---

## Prompt A — Generate Population Pyramid

```
Create a population pyramid comparing two groups across a shared scale.

DATA: [e.g., "Employees by age band: Male vs Female counts for 20-25, 25-30, 30-35, ..., 60-65"]
STORY: [e.g., "The company skews young and male in technical roles but is more balanced in senior leadership"]

Create:
1. Horizontal bars extending LEFT for Group A, RIGHT for Group B
2. Y-axis (center): categories/bins (age bands, tiers, stages)
3. Symmetric X-axes on both sides with matching scales
4. Color: distinct color per group (#0B6E4F for Group A, #6366F1 for Group B)
5. Group labels at top: clear names for left and right
6. Value labels on each bar (inside or outside based on bar width)
7. Center labels: category names

Data as CSV: Category, Group_A_Value, Group_B_Value
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Asymmetric X-axis scales | Both sides must have the same scale for fair comparison |
| Using for more than 2 groups | Population pyramid is for A vs B only — use grouped bar for 3+ |
| Random category order | Use natural order (age bands ascending, stages sequential) |
