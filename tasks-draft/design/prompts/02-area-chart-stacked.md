---
task_id: DES-002
title: Stacked Area Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 02 — Stacked Area Chart

> **Category:** Change Over Time
> **When to use:** Composition changing over time — shows both individual series AND total
> **Flourish template:** Area chart (stacked)
> **Best for:** Market share shifts, revenue by product, energy mix by source, category evolution

---

## Prompt A — Generate Stacked Area Chart

```
You are a data visualization expert creating a stacked area chart.

PROJECT: [Report / infographic / dashboard] about [TOPIC] for [AUDIENCE]

DATA: [e.g., "AI market revenue by segment: ML, NLP, Computer Vision, Deep Learning, Others — yearly 2020-2030"]

STORY: [e.g., "Deep Learning is growing fastest and will dominate by 2030, while ML plateaus"]

Does the TOTAL matter? [Yes — reader needs to see overall growth / No — only composition matters]

Create:
1. X-axis: time periods
2. Y-axis: stacked values (absolute numbers or percentages)
3. Layer order: largest segment on bottom for visual stability
4. Color palette: darkest shade for largest segment, graduating lighter
   Suggested: #0B3D2E, #0B6E4F, #14B8A6, #6EE7B7, #D1FAE5
5. Direct labels on each area (at the widest point of each layer)
6. No legend box — direct labels only
7. Headline emphasizing the SHIFT: "NLP's share tripled while ML plateaued"
8. Source citation bottom-left

Data as CSV:
- Column 1: Date labels
- Columns 2-N: One column per category (values, not percentages)

Flourish note: Use "Area chart (stacked)" template. Set stacking to "absolute" or "percentage" based on story.
```

---

## Prompt B — Percentage vs Absolute Decision

```
I have data showing [DESCRIBE DATA — composition over time].

Should I use:
A) Absolute stacked area (shows total growth + composition)
B) 100% stacked area (shows only composition, totals hidden)

Analyze my data and recommend which approach with rationale. Consider:
- Does the total changing matter to my story?
- Are the segments growing at different rates?
- Will the audience care about absolute numbers or just relative share?
```

---

## Anti-Patterns

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Too many layers (6+) | Bottom layers get squeezed and unreadable | Group small categories into "Other" |
| Ordering layers randomly | Creates visual chaos | Largest on bottom, smallest on top |
| Using for non-time data | Area implies continuity | Use stacked bar for categories |
