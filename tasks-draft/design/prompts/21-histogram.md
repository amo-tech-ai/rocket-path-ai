---
task_id: DES-021
title: Histogram
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 21 — Histogram

> **Category:** Distribution
> **When to use:** Frequency distribution — how many items fall into each value range. X-axis is continuous, divided into bins.
> **Flourish template:** Histogram
> **Best for:** Startup valuations, salary ranges, response times, score distributions, "Am I normal?"

---

## Prompt A — Generate Histogram

```
Create a histogram showing the distribution of a continuous variable.

DATA: [e.g., "200 startup valuations ranging from $1M to $500M" or paste raw values]
STORY: [e.g., "Most startups cluster in the $5M-$20M range — only 8% exceed $100M"]

Create:
1. X-axis: value range (continuous variable)
2. Y-axis: count or percentage of items per bin
3. Bin width: [auto-calculate OR specify — e.g., "$10M increments"]
4. Bar fill: solid color (#0B6E4F), no gaps between bars (continuous distribution)
5. Highlight annotations:
   - Peak bin in accent color with callout: "Most common: [range]"
   - Median line (dashed, red) with label
   - Mean line (dashed, blue) if significantly different from median
6. Optional: overlay normal distribution curve in light gray
7. Source with sample size: "Source: [NAME] (n=[COUNT])"

Data format:
- Option A: Raw values (one per row) — Flourish will bin automatically
- Option B: Pre-binned: Bin_Label, Count
```

---

## Prompt B — "Where Do I Fall?" Histogram

```
Create a histogram where the viewer can find where THEY fall in the distribution.

DATA: [e.g., "500 companies' AI maturity scores, 0-100"]
VIEWER'S VALUE: [Marked with a special indicator]

Create:
1. Standard histogram of the full distribution
2. A vertical highlighted bar or arrow at the viewer's position
3. Annotation: "You are here — top [X]%" or "Above [Y]% of peers"
4. Optional percentile bands: top 10%, top 25%, median, bottom 25%
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Gaps between bars | Histograms = continuous data = no gaps (bar charts have gaps) |
| Using for categorical data | Categories = bar chart. Continuous ranges = histogram. |
| Too few bins (<5) | Hides the shape of the distribution |
| Too many bins (30+) | Creates noise. Start with sqrt(n) bins. |
