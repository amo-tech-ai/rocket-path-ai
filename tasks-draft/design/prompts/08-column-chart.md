---
task_id: DES-008
title: Column Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 08 — Column Chart

> **Category:** Magnitude
> **When to use:** Comparing fewer than 8 categories. Emphasizes height/growth visually. Good for sequential data.
> **Flourish template:** Column chart
> **Best for:** Revenue by quarter, headcount by department, funding by round

---

## Prompt A — Generate Column Chart

```
Create a clean column chart specification.

PROJECT: [Context] for [AUDIENCE]

DATA: [e.g., "Funding raised by round: Seed $2M, Series A $8M, Series B $25M, Series C $60M"]

STORY: [e.g., "Each round nearly tripled the previous — classic power-law fundraising"]

Create:
1. Vertical columns, max 8 bars
2. Y-axis starting at 0 (mandatory — NEVER truncate)
3. Value labels ABOVE each column
4. Subtle horizontal gridlines on Y-axis only (light gray #F3F4F6)
5. Column width: 60-70% of available space (avoid pencil-thin or touching bars)
6. Single color (#0B6E4F) or gradient from light to dark if showing progression
7. If showing growth: add percentage change annotation between columns

Data as CSV: Category, Value
```

---

## Prompt B — Grouped Column Chart (Side-by-Side Comparison)

```
Create a grouped column chart comparing [2-3 SERIES] across [CATEGORIES].

DATA: [e.g., "Q1-Q4 revenue: Planned vs Actual for 2023 and 2024"]
STORY: [e.g., "We consistently exceeded plan in H2 but underperformed in Q1"]

Create:
1. Groups of 2-3 columns per category
2. Consistent color per series across all groups
3. Legend at top (or direct labels if only 2 series)
4. Gap between groups > gap within groups (visually separates categories)
5. Value labels above each column
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Y-axis not starting at 0 | Always start at 0 — truncated axes exaggerate differences |
| Too many columns (10+) | Switch to horizontal bar chart |
| Stacking when comparison matters | Use grouped (side-by-side) instead of stacked |
| 3D columns | Never. Always 2D. |
