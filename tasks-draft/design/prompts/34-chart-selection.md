---
task_id: DES-034
title: Chart Selection (AI Workflow)
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max
subagents: [frontend-designer]
depends_on: [DES-032]
---

# 34 — Chart Selection (AI Workflow)

> **Purpose:** Use AI to recommend the best chart type for your data and story
> **Source:** Flourish "AI for Better Charts" — Step 4, BlackLabel best practices

---

## Prompt A — Chart Type Recommendation

```
I want to visualize the following data. Help me choose the best chart type.

DATA: [Describe your data — e.g., "5 categories with percentages that sum to 100%"]
STORY: [What insight — e.g., "show which category dominates"]
AUDIENCE: [Who — e.g., "startup founders, non-technical"]
CHANNEL: [Where — e.g., "website embed with animation / presentation slide / social media / print report"]

Using this 9-category framework, recommend:

1. CHANGE OVER TIME: Line, area, bar chart race, fan chart
2. MAGNITUDE: Bar, column, lollipop, waterfall, bullet
3. PARTS OF A WHOLE: Donut, stacked bar, treemap, sunburst
4. CORRELATION: Scatter, bubble
5. RANKING: Sorted bar, bump chart
6. DISTRIBUTION: Histogram, population pyramid, beeswarm
7. FLOWS: Sankey, network, chord
8. SPATIAL: Choropleth, symbol map
9. DEVIATION: Gauge, diverging bar, surplus/deficit

Return:
1. PRIMARY chart type — the one chart that tells the story best, with rationale
2. SECONDARY chart type — alternative if primary doesn't work, with trade-offs
3. AVOID — one common wrong choice for this data and why it fails
4. Flourish template name for the primary choice
5. Animation/interaction recommendation
```

---

## Prompt B — Pros/Cons Comparison (Do This BEFORE Committing)

```
I'm deciding between these chart types for my data:

OPTION A: [e.g., "Column chart"]
OPTION B: [e.g., "Bullet chart"]
OPTION C: [e.g., "Grouped bar chart"]

DATA: [Describe]
STORY: [Key insight]

For each option, give me:
1. Pros (what it does well for this data)
2. Cons (what it loses or distorts)
3. Readability score (1-5, where 5 = instant understanding)
4. Best use case (when THIS is the right choice)

Recommend one with a clear rationale.
```

---

## Prompt C — "What Kind of Data Do I Have?"

```
I'm not sure what chart to use. Help me figure it out.

My data looks like: [DESCRIBE or paste a sample]

First, tell me:
1. Is this CATEGORICAL data (groups, types, names) or CONTINUOUS data (numbers that can be measured)?
2. Is there a TIME dimension?
3. Am I comparing BETWEEN groups or showing composition WITHIN one group?
4. Do I have a target/benchmark to compare against?

Based on your answers, recommend the top 2 chart types with reasoning.
```

---

## Decision Flowchart (Reference)

```
What are you trying to show?
  |
  +-- "How much?" → Bar chart (sorted)
  +-- "What changed?" → Line chart / Bar chart race
  +-- "What's the breakdown?" → Donut (2-5 items) / Stacked bar (6+)
  +-- "Are these related?" → Scatter / Bubble
  +-- "Who ranks highest?" → Sorted bar / Bump chart
  +-- "Where do most fall?" → Histogram / Gauge
  +-- "How does it flow?" → Sankey
  +-- "Where geographically?" → Map (only if location IS the story)
  +-- "Above or below target?" → Gauge / Diverging bar
```
