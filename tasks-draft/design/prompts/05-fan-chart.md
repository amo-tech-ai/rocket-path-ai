---
task_id: DES-005
title: Fan Chart (Forecast with Uncertainty)
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 05 — Fan Chart (Forecast with Uncertainty)

> **Category:** Change Over Time
> **When to use:** Projections with confidence intervals. Central line + widening bands of probability.
> **Flourish template:** Fan chart / Line chart (projected)
> **Best for:** Revenue forecasts, GDP projections, market size estimates, startup growth scenarios

---

## Prompt A — Generate Fan Chart

```
Create a fan chart showing a forecast with uncertainty bands.

DATA: [e.g., "Quarterly revenue: actuals Q1 2023 - Q4 2025, forecast Q1 2026 - Q4 2027"]
STORY: [e.g., "Base case is strong but downside risk widens significantly after Q4 2026"]
CONFIDENCE LEVELS: 50%, 80%, 95%

Create:
1. Solid line for historical ACTUAL data
2. Dashed line for central FORECAST projection
3. Vertical dashed line at the actual-to-forecast boundary
4. Three confidence bands:
   - 50% band: darkest shade (most likely range)
   - 80% band: medium shade
   - 95% band: lightest shade (widest range)
5. Label: "Actual" and "Projected" sections clearly
6. Annotation at any key inflection point

Data as CSV:
- Columns: Date, Actual, Forecast, Low_95, Low_80, Low_50, High_50, High_80, High_95
- Actual column: values for historical, blank for future
- Forecast column: blank for historical, values for future

Color: Use a single hue graduating from dark (50%) to light (95%). Suggested: #0B6E4F → #6EE7B7 → #D1FAE5
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| No clear boundary between actual and forecast | Add vertical dashed line where projection starts |
| Bands too narrow | Be honest about uncertainty — narrow bands imply false precision |
| Using for non-time data | Fan charts are exclusively for temporal forecasts |
