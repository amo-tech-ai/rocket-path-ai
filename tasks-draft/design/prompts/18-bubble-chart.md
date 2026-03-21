---
task_id: DES-018
title: Bubble Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 18 — Bubble Chart

> **Category:** Correlation
> **When to use:** Like scatter but with a 3rd variable mapped to circle SIZE. Shows x, y, and magnitude simultaneously.
> **Flourish template:** Scatter (with size binding)
> **Best for:** Country comparisons (GDP vs life expectancy vs population), competitive landscape, market opportunity mapping

---

## Prompt A — Generate Bubble Chart

```
Create a bubble chart showing 3 variables simultaneously.

DATA: [e.g., "30 countries: X = CO2 per capita (tonnes), Y = GDP per capita ($), Size = population, Color = income group (Low/Lower-Middle/Upper-Middle/High)"]
STORY: [e.g., "High-income countries emit the most per capita — emissions track affluence, not population size"]

Create:
1. X-axis: [variable 1] with units
2. Y-axis: [variable 2] with units
3. Bubble size: mapped to [variable 3] — use AREA not radius
4. Bubble color: by [category] — max 4 colors
5. Size legend: show 3 reference circles (small, medium, large) with values
6. Label the 5-8 largest or most notable bubbles directly on chart
7. Smaller bubbles: show on hover/tooltip only
8. Opacity: 60-70% to handle overlap
9. Use logarithmic scale if data spans multiple orders of magnitude (e.g., population from 500K to 1.4B)

Data as CSV: Name, X_Value, Y_Value, Size_Value, Category

Headline: Focus on the INSIGHT the third dimension reveals
- Good: "Emissions are a function of wealth, not headcount"
- Bad: "CO2, GDP, and population by country"
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Mapping value to radius instead of area | A bubble with 2x the radius looks 4x bigger — always use area |
| Too many overlapping bubbles | Reduce opacity, increase chart size, or aggregate |
| No size legend | Viewer can't decode what bubble size means |
