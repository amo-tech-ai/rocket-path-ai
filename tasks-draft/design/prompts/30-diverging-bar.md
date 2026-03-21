---
task_id: DES-030
title: Diverging Bar Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 30 — Diverging Bar Chart

> **Category:** Deviation
> **When to use:** Positive vs negative values splitting from a center axis. Sentiment, agree/disagree, above/below average.
> **Flourish template:** Diverging bar chart
> **Best for:** Survey sentiment, profit/loss by product, performance vs benchmark, NPS breakdown

---

## Prompt A — Generate Diverging Bar Chart

```
Create a diverging bar chart showing positive/negative values from a center axis.

DATA: [e.g., "Employee satisfaction: 10 questions, responses from Strongly Disagree (-2) to Strongly Agree (+2)"]
STORY: [e.g., "Compensation and work-life balance are the biggest pain points; mission and team culture score highest"]

Create:
1. Center axis at zero (or neutral midpoint)
2. POSITIVE values extend RIGHT:
   - Agree: medium green (#14B8A6)
   - Strongly Agree: dark green (#0B6E4F)
3. NEGATIVE values extend LEFT:
   - Disagree: medium coral (#F87171)
   - Strongly Disagree: dark red (#EF4444)
4. Neutral: thin gray segment at center (#D1D5DB)
5. Sort categories by NET score (most positive at top, most negative at bottom)
6. Segment labels inside: percentage per segment
7. Net score label at far right of each row

Data as CSV: Category, Strongly_Disagree, Disagree, Neutral, Agree, Strongly_Agree
- Values should be percentages summing to 100% per row
```

---

## Prompt B — Benchmark Deviation Bar

```
Create a diverging bar showing each item's deviation from a benchmark.

DATA: [e.g., "10 products: each with actual margin vs industry average margin"]
BENCHMARK: [e.g., "Industry average: 35% margin"]

Create:
1. Center axis = benchmark value (35%)
2. Bars extending RIGHT = above benchmark (green)
3. Bars extending LEFT = below benchmark (red)
4. Length = magnitude of deviation
5. Labels: product name (left), deviation value and direction (right)
6. Sort: largest positive deviation at top, largest negative at bottom
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Not sorting by net score | Sort by net value so the pattern is visible |
| Too many response categories (7+) | Max 5 segments (SA, A, N, D, SD) |
| Asymmetric scales left vs right | Both sides must have the same scale |
| Using for non-deviation data | Diverging bars need a meaningful center point |
