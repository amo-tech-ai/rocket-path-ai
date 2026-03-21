---
task_id: DES-027
title: Choropleth Map
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 27 — Choropleth Map

> **Category:** Spatial
> **When to use:** Geographic data where value varies by region. Color intensity = data value. ONLY when geography IS the story.
> **Flourish template:** Projection Map
> **Best for:** AI readiness by country, election results, GDP per capita, regional adoption rates

---

## Prompt A — Generate Choropleth Map

```
Create a choropleth map specification.

DATA: [e.g., "AI readiness index by country, 0-100 scale, for 50 countries"]
STORY: [e.g., "North America and Northern Europe lead, but Southeast Asia is the surprise emerging region"]
GEOGRAPHY: [World / US States / Europe / Asia / Custom]

Create:
1. Geographic boundary: [specify]
2. Color scale:
   - Sequential (light to dark) for single metric going low-to-high
   - Diverging (red-white-green) for above/below average
3. Legend: 5 discrete color bins (NOT continuous gradient — bins are easier to read)
4. Label bins clearly: "0-20 Low", "21-40 Below Avg", "41-60 Average", "61-80 Above Avg", "81-100 High"
5. Tooltip on hover: country/region name + exact value + rank
6. Missing data: hatch pattern or distinct gray — never zero
7. Source citation with year

Data as CSV: Region_Name (or ISO 3166-1 alpha-2 code), Value

CRITICAL RULE: If you're comparing 5-10 regions by a number and geographic patterns don't matter, use a horizontal bar chart instead. Maps are ONLY for when WHERE matters.
```

---

## Prompt B — Animated Choropleth (Time Slider)

```
Create a choropleth map with a time slider showing change over [TIME RANGE].

DATA: [e.g., "Internet penetration by country, 2010 to 2025, annual snapshots"]

Add:
1. Time slider at bottom — auto-play through years
2. Smooth color transitions between time periods
3. Running year label displayed prominently
4. Key moment annotations (e.g., "2020: COVID accelerates digital")
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Map when geography isn't the story | Use bar chart with labels |
| Continuous color gradient | Bin into 5 discrete steps for readability |
| Missing data shown as zero | Use gray or hatch pattern — zero is a real value |
| Too many categories (8+) | Max 5-6 color bins |
