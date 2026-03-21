---
task_id: DES-014
title: Treemap
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 14 — Treemap

> **Category:** Parts of a Whole
> **When to use:** Many categories (6+) with sub-categories. Rectangles sized proportionally. Great for showing hierarchical composition.
> **Flourish template:** Hierarchy (treemap)
> **Best for:** Market cap by sector/company, file storage usage, content library, tool ecosystem mapping

---

## Prompt A — Generate Treemap

```
Create a treemap specification for hierarchical data.

DATA: [e.g., "AI tool market: Category (Chatbots, Code Assistants, Image Gen, etc.) -> Sub-category (specific tools) -> Revenue or market size"]
STORY: [e.g., "Chatbots dominate the market by revenue but Code Assistants have the most individual tools"]

Create:
1. Data with hierarchy columns:
   - Level 1: top category
   - Level 2: sub-category (optional)
   - Size: numerical value for rectangle sizing
2. Color by Level 1 category
3. Label rules:
   - Level 1 labels: always visible, bold, larger font
   - Level 2 labels: visible only when rectangle is large enough (auto-hide small ones)
4. Interactive: click to zoom into a category (drill-down)
5. Tooltip: full name + value + percentage of total
6. Border between rectangles: thin white (1-2px) for visual separation

Data as CSV: Level1, Level2, Value
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Fewer than 6 items | Use donut or bar chart instead |
| No hierarchy (flat data) | Treemaps need at least 2 levels to be meaningful |
| Trying to compare precise areas | Rectangles are hard to compare — use bar chart for precision |
