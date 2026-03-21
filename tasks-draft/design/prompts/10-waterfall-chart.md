---
task_id: DES-010
title: Waterfall Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 10 — Waterfall Chart

> **Category:** Magnitude
> **When to use:** Showing how sequential additions and subtractions lead to a final total. Each segment is a step.
> **Flourish template:** Waterfall chart
> **Best for:** Revenue bridge (gross to net), P&L breakdown, budget impact analysis, conversion funnel losses

---

## Prompt A — Generate Waterfall Chart

```
Create a waterfall chart showing how components add up (or subtract) to reach a final total.

DATA: [e.g., "Revenue $100M -> COGS -$35M -> OpEx -$25M -> D&A -$5M -> Tax -$8M -> Net Profit $27M"]
STORY: [e.g., "Operating expenses are the biggest drag on profitability — nearly matching COGS"]

Create:
1. Starting bar (total/gross) in neutral dark (#1E293B)
2. Positive additions in GREEN (#0B6E4F)
3. Negative subtractions in RED/CORAL (#EF4444)
4. Final total bar in dark (#1E293B) — visually distinct from intermediate steps
5. Thin connecting lines between bars showing cumulative level
6. Value labels ON each segment: show the delta amount (not cumulative)
7. Cumulative running total labels above each bar (optional, for complex waterfalls)

Data as CSV: Step_Name, Value, Type
- Type values: "start", "increase", "decrease", "total"
- Start: the opening balance
- Increase: positive additions (positive number)
- Decrease: negative subtractions (negative number)
- Total: the final result

Headline: Focus on the BIGGEST DRIVER, not the structure
- Good: "OpEx is the silent profit killer — $25M in annual drag"
- Bad: "Revenue to net profit waterfall breakdown"
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| No connecting lines | Connectors show the cumulative flow — always include |
| All same color | Must differentiate positive (green) from negative (red) |
| Too many steps (10+) | Group small items; max 7-8 steps for readability |
