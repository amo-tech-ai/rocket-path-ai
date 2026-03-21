---
task_id: DES-013
title: Stacked Bar Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 13 — Stacked Bar Chart

> **Category:** Parts of a Whole
> **When to use:** Composition across multiple groups. Shows individual segments AND group totals. Better than donut for 6+ segments.
> **Flourish template:** Bar chart (stacked)
> **Best for:** Revenue by product per region, workforce composition, survey responses by segment

---

## Prompt A — Generate Stacked Bar Chart

```
Create a stacked bar chart showing composition across multiple groups.

DATA: [e.g., "AI workforce by role across 4 companies: Engineers %, Researchers %, Product %, Operations %"]
STORY: [e.g., "Company A is engineering-heavy while Company D has the most balanced team structure"]

Create:
1. Each bar = one group, segments = categories within that group
2. Consistent color per category across ALL bars (mandatory for comparison)
3. Segment order: largest category on bottom, consistent across all bars
4. Labels:
   - Inside segments if wide enough (>15% of bar width)
   - Tooltip specification if segments too narrow
5. Total value label at the end of each bar
6. Color palette: 3-5 distinct colors max, graduating within a hue family
7. Source citation

Data as CSV:
- Column 1: Group name
- Columns 2-N: One per category (values or percentages)

For 100% stacked: normalize all rows to 100%. Emphasizes composition only.
For absolute stacked: keeps raw values. Shows both composition AND total size.
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Inconsistent segment order across bars | Same segment in same position everywhere |
| Too many segments (7+) | Group smallest into "Other" |
| Comparing specific segments across bars | Middle segments are hard to compare — use grouped bar if precision matters |
