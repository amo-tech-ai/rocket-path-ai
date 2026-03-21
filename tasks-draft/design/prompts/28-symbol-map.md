---
task_id: DES-028
title: Proportional Symbol Map
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 28 — Proportional Symbol Map

> **Category:** Spatial
> **When to use:** Absolute values at specific locations. Circle size = data value. Better than choropleth for point data.
> **Flourish template:** Projection Map (with points)
> **Best for:** Startup density by city, earthquake magnitudes, store locations with revenue, event attendance

---

## Prompt A — Generate Symbol Map

```
Create a proportional symbol map with circles sized by value.

DATA: [e.g., "Number of AI startups in 30 cities worldwide"]
STORY: [e.g., "San Francisco and Beijing dominate, but London and Bangalore are closing the gap"]

Create:
1. Base map: minimal styling — light gray land, no distracting terrain or borders
2. Circles at each location:
   - Area proportional to value (NOT radius)
   - Opacity: 60-70% to handle overlap
3. Color by category if applicable (e.g., continent or tier)
4. Labels: directly on map for top 5-8 locations
5. Smaller locations: show on hover/tooltip only
6. Size legend: 3 reference circles showing small/medium/large values

Data as CSV: City, Latitude, Longitude, Value, Category (optional)

RULE: If comparing just 5-10 cities, a horizontal bar chart is clearer and simpler.
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Radius instead of area for sizing | Area mapping — otherwise large circles look exponentially bigger |
| Cluttered labels | Only label top locations; tooltip for the rest |
| Busy basemap | Minimal gray land, no terrain, minimal borders |
