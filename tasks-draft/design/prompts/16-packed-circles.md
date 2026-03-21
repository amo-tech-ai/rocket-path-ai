---
task_id: DES-016
title: Packed Circles
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 16 — Packed Circles

> **Category:** Parts of a Whole
> **When to use:** Hierarchical data with organic, visual feel. Nested circles emphasize relative size. Alternative to treemap.
> **Flourish template:** Hierarchy (packed circles)
> **Best for:** Startup ecosystem mapping, research clusters, portfolio composition, investment breakdown

---

## Prompt A — Generate Packed Circles

```
Create a packed circles (circular treemap) visualization.

DATA: [e.g., "VC investments: Sector -> Subsector -> Company, sized by funding amount"]
STORY: [e.g., "AI/ML dominates VC, but within it, enterprise SaaS gets 3x more than consumer AI"]

Create:
1. Outer circles = top-level categories
2. Inner circles = items nested within
3. Circle area proportional to value (not radius — area is what the eye compares)
4. Color by top-level category
5. Labels:
   - Large circles: name + value
   - Medium circles: name only
   - Small circles: hidden (show on hover/tooltip)
6. Minimum circle size threshold: hide circles below 2% of total

Data as CSV: Category, Subcategory, Name, Value
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Using radius instead of area for sizing | Always map value to AREA, not radius |
| Too many tiny circles | Set minimum size threshold; group small items |
| Flat data with no hierarchy | Use a simple bubble chart instead |
