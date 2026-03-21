---
task_id: DES-015
title: Sunburst Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 15 — Sunburst Chart

> **Category:** Parts of a Whole
> **When to use:** Same as treemap but circular. Shows parent-child relationships with concentric rings. More visually striking for presentations.
> **Flourish template:** Hierarchy (sunburst)
> **Best for:** Org charts, content taxonomy, budget hierarchy, classification systems

---

## Prompt A — Generate Sunburst Chart

```
Create a sunburst chart for hierarchical data.

DATA: [e.g., "Company org: Division -> Department -> Team, sized by headcount"]
STORY: [e.g., "Engineering is 45% of the company, with ML alone being 20% of total headcount"]

Create:
1. Innermost ring = top-level categories (Level 1)
2. Middle ring = sub-categories (Level 2)
3. Outer ring = individual items (Level 3, optional)
4. Arc width proportional to value
5. Color by Level 1 category with graduating shades for sub-levels
6. Click-to-zoom: clicking a segment expands it to fill the view
7. Center: show selected segment name + value + % on hover/click

Data as CSV: Level1, Level2, Level3, Value

Flourish settings:
- Max visible levels: 2-3 (more gets unreadable)
- Inner radius: 30-40% (leave room for center label)
- Transition animation: smooth zoom on click
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Too many levels (4+) | Max 3 levels visible at once |
| Outer ring segments too narrow | Collapse or aggregate small items |
| No interactivity | Sunbursts NEED click-to-zoom to be useful |
