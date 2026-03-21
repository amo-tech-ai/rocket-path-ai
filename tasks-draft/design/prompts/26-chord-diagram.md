---
task_id: DES-026
title: Chord Diagram
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /scroll-storyteller
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 26 — Chord Diagram

> **Category:** Flows & Relationships
> **When to use:** Bi-directional flows between groups in a circular layout. Shows direction AND volume.
> **Flourish template:** Chord diagram
> **Best for:** Trade flows, employee transfers, data exchange, user migration, departmental collaboration

---

## Prompt A — Generate Chord Diagram

```
Create a chord diagram showing bi-directional flows between groups.

DATA: [e.g., "Employee transfers between 6 departments: Engineering->Product 15, Product->Engineering 8, Engineering->Data 12, etc."]
STORY: [e.g., "Engineering exports the most talent — mostly to Product and Data Science"]

Create:
1. Arcs around the circle = groups (sized by total flow in+out)
2. Chords connecting arcs = flows between groups (width = volume)
3. Color by SOURCE group
4. Interactive:
   - Hover on arc: highlight all flows from/to that group, dim others
   - Hover on chord: show exact flow value and direction
5. Label each arc with group name and total
6. Chord tooltip: "From [A] to [B]: [value]"

Data as a MATRIX (CSV):
- Row/column headers = group names
- Cell values = flow volume from row to column
- Matrix can be asymmetric (A->B != B->A)

Example:
| From\To | Eng | Product | Data | Design | Sales | Ops |
|---------|-----|---------|------|--------|-------|-----|
| Eng     | 0   | 15      | 12   | 5      | 2     | 3   |
| Product | 8   | 0       | 4    | 6      | 3     | 1   |
| ...     |     |         |      |        |       |     |
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Too many groups (10+) | Max 8 groups or arcs become unreadable |
| Using for unidirectional flow | Use Sankey instead — chord implies bi-directional |
| No interactivity | Chord diagrams are complex — hover filtering is essential |
