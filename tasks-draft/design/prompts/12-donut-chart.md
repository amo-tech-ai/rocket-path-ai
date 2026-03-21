---
task_id: DES-012
title: Donut Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 12 — Donut Chart

> **Category:** Parts of a Whole
> **When to use:** 2-5 segments showing composition. Always donut over pie — center space holds a label or total.
> **Flourish template:** Donut chart
> **Best for:** Market share, survey splits, budget allocation, device usage, role breakdown

---

## Prompt A — Generate Donut Chart

```
Create a donut chart specification. MAXIMUM 5 segments.

DATA: [e.g., "AI budget allocation: Model Training 40%, Data Prep 25%, Infrastructure 20%, Talent 10%, Other 5%"]
STORY: [e.g., "Training costs dominate — but data prep is a hidden 25% that most teams underestimate"]

Create:
1. Segments ordered LARGEST to smallest (clockwise from 12 o'clock)
2. Max 5 segments — merge everything else into "Other" (gray #E5E7EB)
3. Center label: the total value or key metric (e.g., "$2.4M Total" or "100%")
4. Direct labels on each segment: Category name + percentage
5. No legend box — direct labels only
6. Color palette:
   - Primary: #0B6E4F (largest segment)
   - Secondary: #14B8A6
   - Tertiary: #6EE7B7
   - Fourth: #A7F3D0
   - Other: #E5E7EB (always gray)
7. Donut thickness: 40-50% of radius (not too thin, not too fat)
8. Source citation below chart

RULES:
- NEVER use pie chart — always donut
- NEVER more than 5 segments
- NEVER use for time series data
- If segments are nearly equal (within 5%), use bar chart instead — angles are hard to compare
```

---

## Prompt B — Dual Donut Comparison

```
Create a side-by-side dual donut chart comparing two states.

DATA LEFT: [e.g., "Current AI maturity: Very Mature 15%, Mature 48%, Somewhat 37%"]
DATA RIGHT: [e.g., "Target AI maturity (2-3 years): Market Leader 7%, Industry Leading 36%, More Mature 42%, Match Competitors 14%, As-is 1%"]

Create:
1. Two donuts side-by-side
2. Left labeled "Current" / Right labeled "Target"
3. Consistent color mapping where categories overlap
4. Center of each donut: key headline stat
5. 2-3 callout stats between or below the donuts (e.g., "92% want to grow more mature")
```

---

## Anti-Patterns

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Pie chart (no hole) | Dated, no room for center label | Use donut — always |
| 6+ segments | Too many wedges to compare visually | Merge into "Other" at 5 max |
| Similar-sized segments | Angles impossible to distinguish | Use horizontal bar chart instead |
| Using for comparison across groups | Donuts compare within ONE group | Use grouped/stacked bar for cross-group |
