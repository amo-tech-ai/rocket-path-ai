---
task_id: DES-001
title: Line Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 01 — Line Chart

> **Category:** Change Over Time
> **When to use:** Continuous trends over months/years with 1-5 series. X-axis MUST be time.
> **Flourish template:** Line chart (standard, projected, small multiples)
> **Best for:** Revenue trends, user growth, adoption rates, stock prices

---

## Prompt A — Generate Line Chart Specification

```
You are a senior data visualization designer at a BCG-tier consultancy.

PROJECT CONTEXT: I am creating a [report / infographic / presentation / social post] about [TOPIC] for [AUDIENCE: founders / investors / C-suite / general public].

DATA: [Paste your data OR describe it — e.g., "Monthly active users for 3 products, Jan 2023 to Dec 2025"]

STORY: [What insight should the reader walk away with? — e.g., "Product A overtook Product B in Q3 2024"]

Create a clean line chart specification with:
1. X-axis: time periods with appropriate intervals (monthly / quarterly / yearly)
2. Y-axis: values with clear units, starting at 0
3. Max 5 lines, each with a distinct color from this palette: #0B6E4F, #14B8A6, #6366F1, #F59E0B, #9CA3AF
4. Direct labels ON the lines at the endpoint (no legend box)
5. One annotation callout at the key inflection point with a brief explanation
6. Source citation at bottom-left: "Source: [NAME], [YEAR] (n=[SAMPLE SIZE])"
7. A 1-sentence headline that tells the STORY (not describes the chart)
   - Good: "AI adoption doubled in 18 months, outpacing cloud's early trajectory"
   - Bad: "AI adoption rates from 2023 to 2025"

Format the data as a CSV table ready for Flourish:
- Column 1: Date/period labels
- Columns 2-N: One column per series

Style: Minimal grid, no chart junk, BCG green (#0B6E4F) as primary accent. Sans-serif font (Inter or Roboto). Title 18-24px bold, axis labels 12-14px.
```

---

## Prompt B — Animated Line Chart (Slow Reveal)

```
Create an animated line chart that draws itself left-to-right.

DATA: [Describe data]
STORY: [Key insight]

Animation specification:
1. Lines draw from left to right over 3 seconds
2. Pause at the key inflection point with a callout annotation appearing
3. Resume drawing to the end
4. Final state: all lines visible with endpoint labels

Output as: [SVG with CSS animation / React component / Flourish configuration notes]
```

---

## Prompt C — Small Multiples Line Grid

```
I want to show [METRIC] across [NUMBER] groups using a grid of small line charts (small multiples).

DATA: [e.g., "Inflation rates for 20 countries, monthly from 2000 to 2024, grouped by region"]

Create a specification for a Flourish grid of charts:
1. One mini line chart per group
2. Consistent Y-axis scale across ALL charts (mandatory for comparison)
3. Single color per region, gray for context
4. Grid layout: [3x4 / 4x5 / etc.]
5. Shared X-axis labels (only on bottom row)
6. Each chart labeled with group name, no redundant axis labels

Data format: Transform from wide to grid-ready format for Flourish.
```

---

## Anti-Patterns

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Line chart without time on X-axis | Lines imply continuity between points | Use bar chart for categories |
| More than 5 lines | Spaghetti — impossible to read | Use small multiples or highlight 2-3 key lines |
| Y-axis not starting at 0 | Exaggerates small differences | Start at 0 or clearly label the axis break |
| Using for discrete categories | Connecting bars, quarters with a line implies values in between | Use column chart |
