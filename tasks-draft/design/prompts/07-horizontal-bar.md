---
task_id: DES-007
title: Horizontal Bar Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 07 — Horizontal Bar Chart

> **Category:** Magnitude
> **When to use:** Comparing 3-15 categories by size. ALWAYS sort highest to lowest. Horizontal gives room for long labels.
> **Flourish template:** Bar chart (horizontal)
> **Best for:** AI adoption by industry, survey rankings, feature importance, market comparison

---

## Prompt A — Generate Horizontal Bar Chart

```
You are a senior data visualization designer creating a BCG-editorial horizontal bar chart.

PROJECT: [Report / infographic / presentation] about [TOPIC] for [AUDIENCE]

DATA: [e.g., "AI adoption rate by industry: Healthcare 78%, Finance 72%, Retail 65%, Manufacturing 58%, Education 45%"]

STORY: [e.g., "Healthcare leads AI adoption but education is lagging far behind"]

Create:
1. Bars sorted HIGHEST to LOWEST (mandatory — never unsorted)
2. Single color for all bars (BCG green #0B6E4F) OR highlight the top bar and bottom bar with accent colors
3. Value labels at the END of each bar (outside, not inside)
4. Category labels LEFT-aligned with consistent indentation
5. No gridlines — value labels make them redundant
6. No chart border or box
7. Source citation bottom-left: "Source: [NAME], [YEAR] (n=[SAMPLE SIZE])"

Data as 2-column CSV: Category, Value

Headline that tells the STORY:
- Good: "Healthcare leads — but education risks falling behind on AI"
- Bad: "AI adoption rates by industry"

RULES:
- NEVER leave bars unsorted
- Max 12 bars — group the rest as "Other" in gray
- No 3D effects, no gradients, no shadows
- Font: clean sans-serif (Inter, Roboto, Helvetica)
- Bar height: consistent, with 40-50% whitespace between bars
```

---

## Prompt B — Highlighted Comparison Bar

```
I want to show [METRIC] across [NUMBER] categories, but I want to HIGHLIGHT one specific category.

DATA: [Paste or describe data]
HIGHLIGHT: [Which item and why — e.g., "Our company vs competitors" or "The outlier that's lagging"]

Create a horizontal bar chart where:
1. All bars are light gray (#E5E7EB) EXCEPT the highlighted item in accent color (#0B6E4F)
2. Add an annotation callout next to the highlighted bar explaining why it stands out
3. Sort highest to lowest regardless of which item is highlighted
```

---

## Anti-Patterns

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Unsorted bars | Reader can't see the ranking | Sort highest to lowest — always |
| Too many bars (15+) | Visual overload | Group bottom items into "Other" |
| Values inside bars | Hard to read when bars are short | Place values outside, at bar end |
| Using vertical bars with long labels | Labels overlap or rotate | Switch to horizontal |
