---
task_id: DES-011
title: Bullet Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 11 — Bullet Chart

> **Category:** Magnitude
> **When to use:** Comparing actual vs planned/target for single metrics. Compact and informative — replaces gauges for multi-KPI dashboards.
> **Flourish template:** Bullet graph
> **Best for:** Department spend vs budget, KPI actual vs target, quarterly performance tracking

---

## Prompt A — Generate Bullet Chart

```
Create a bullet chart comparing actual vs planned values.

PROJECT: [e.g., "Quarterly department spending report"]

DATA: [e.g., "Q1: Actual $180K, Planned $200K | Q2: Actual $220K, Planned $195K | Q3: Actual $175K, Planned $190K | Q4: Actual $210K, Planned $205K"]

STORY: [e.g., "Q2 was the only quarter where we exceeded budget — every other quarter was under control"]

Create:
1. Main bar: ACTUAL value (solid fill, BCG green #0B6E4F)
2. Vertical marker line: PLANNED/TARGET value (thin black line, 2px)
3. Background bands showing performance zones:
   - Light gray: poor range
   - Medium gray: acceptable range
   - No fill: excellent range
4. One bullet per category, stacked vertically
5. Category labels left-aligned
6. Value labels at bar end

Why bullet chart over column chart:
- Compact: shows actual, target, AND context in one row
- Clean: avoids stacking or grouping multiple bars
- Compare: planned vs actual without color-matching confusion

Data as CSV: Category, Actual, Target, Poor_Max, Acceptable_Max, Max_Value
```

---

## Prompt B — Convert Column Chart to Bullet Chart

```
I currently have a grouped column chart comparing planned vs actual values across categories. It's cluttered with 4 bars per group.

Transform this into a bullet chart format:
- Main bar = actual value (2024)
- Marker line = planned value (2024)
- Background gray band = last year's actual (2023) for context

This reduces 4 visual elements per category to 3, in a single row.

DATA: [Paste your grouped column data]

Return: bullet chart specification + reformatted data.
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Missing the target marker | The marker line IS the whole point of a bullet chart |
| Too many background zones | Max 3 zones (poor, acceptable, excellent) |
| Using when you have no target/benchmark | Use plain horizontal bar instead |
