---
task_id: DES-009
title: Lollipop Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 09 — Lollipop Chart

> **Category:** Magnitude
> **When to use:** Same as bar chart but cleaner with many items. Emphasizes the data point itself over the bar.
> **Flourish template:** Column + line variant / Lollipop
> **Best for:** Feature ratings, city scores, individual KPI performance, benchmarks

---

## Prompt A — Generate Lollipop Chart

```
Create a lollipop chart specification.

DATA: [e.g., "NPS scores by feature: Onboarding 82, Dashboard 75, Reports 71, API 68, Mobile 54"]
STORY: [e.g., "Onboarding is our clear strength; mobile is the biggest gap to close"]

Create:
1. Horizontal thin lines extending from Y-axis to a circular dot at the value
2. Sorted highest to lowest
3. Dot styling:
   - Top 3 items: solid filled dot in accent color (#0B6E4F), 8px diameter
   - Remaining items: gray dot (#9CA3AF), 6px diameter
4. Value label next to each dot (right side)
5. Category labels left-aligned
6. Optional: add a vertical reference line (e.g., average, target) as a dashed gray line
7. Source citation

Data as CSV: Category, Value
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Dots too small to see | Minimum 6px diameter |
| No sorting | Always sort highest to lowest |
| Using for time series | Lollipops are for categories, not continuous time |
