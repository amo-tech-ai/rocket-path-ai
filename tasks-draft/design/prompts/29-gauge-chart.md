---
task_id: DES-029
title: Gauge Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 29 — Gauge Chart

> **Category:** Deviation
> **When to use:** A SINGLE metric on a scale. Speedometer-style — where do you stand relative to a target or range?
> **Flourish template:** Gauge
> **Best for:** NPS score, fundraiser progress, completion %, performance rating, single KPI dashboards

---

## Prompt A — Generate Gauge Chart

```
Create a gauge chart for a single KPI.

DATA: [e.g., "Current NPS score: 72 out of 100. Target: 80. Industry average: 65"]
STORY: [e.g., "We're in the 'good' range but still 8 points below our stretch target"]

Create:
1. Semi-circle gauge (180 degrees) with color zones:
   - Red zone (poor): [0-40]
   - Yellow zone (average): [40-70]
   - Green zone (excellent): [70-100]
   Zone boundaries should match meaningful thresholds for this metric
2. Needle or dot marker at current value
3. Target marker: dashed line or triangle at goal value
4. Center number: large bold display of current value
5. Below center: metric name + "Target: [X]"
6. Optional: small arrow or text showing trend (up/down from last period)

Color zones:
- Red: #EF4444
- Yellow: #F59E0B
- Green: #0B6E4F
- Background track: #F3F4F6

RULE: Gauges are for ONE number only. If you have 3+ KPIs, use a bar chart or a grid of mini gauges.
```

---

## Prompt B — Multi-Gauge Dashboard

```
I need to show [3-5] KPIs at a glance on a dashboard.

METRICS: [e.g., "NPS: 72/100, CSAT: 4.2/5, Response Time: 2.3s target 2.0s, Uptime: 99.7% target 99.9%"]

Create a specification for a grid of mini gauges:
1. One gauge per metric, arranged in a 2x2 or 1x4 grid
2. Each gauge with consistent styling but independent scales
3. Color coding: green if at/above target, yellow if within 10%, red if below
4. Each gauge shows: metric name, current value, target, and status color
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Multiple gauges when a bar chart would work | If comparing metrics, use bar chart |
| No target/benchmark line | Without a reference point, gauge is meaningless |
| Full circle gauge | Semi-circle (180) is standard and more readable |
| Zones that don't match meaningful thresholds | Zones must correspond to real performance categories |
