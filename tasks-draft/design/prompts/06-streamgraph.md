---
task_id: DES-006
title: Streamgraph
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 06 — Streamgraph

> **Category:** Change Over Time
> **When to use:** Volume AND composition shifting over time. More organic/flowing than stacked area. 5-15 categories.
> **Flourish template:** Streamgraph
> **Best for:** Genre popularity, content type distribution, technology adoption waves, music streaming data

---

## Prompt A — Generate Streamgraph

```
Create a streamgraph specification showing volume and composition shifts over time.

DATA: [e.g., "Monthly content output by type: blogs, videos, podcasts, infographics, social — 2020-2026"]
STORY: [e.g., "Video content exploded after 2023 while blog output plateaued"]

Create:
1. Symmetric stream flowing around a central baseline
2. Each stream = one category, width proportional to value
3. Ordering: largest category in center for visual stability
4. Color: distinct but harmonious colors per category
5. Interactive tooltip: category name + value + % of total on hover
6. Time labels on X-axis at appropriate intervals
7. No Y-axis labels (streamgraphs are about shape, not precise values)

Data as CSV (same format as stacked area):
- Column 1: Date
- Columns 2-N: One per category with values
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Fewer than 4 categories | Use stacked area instead — streamgraph needs volume to look right |
| Precise value reading needed | Use stacked bar — streamgraphs are for trends and shapes, not exact numbers |
