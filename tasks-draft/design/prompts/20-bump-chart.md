---
task_id: DES-020
title: Bump Chart
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /framer-motion-animator
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 20 — Bump Chart

> **Category:** Ranking
> **When to use:** Rank changes for 5-10 items across 4-8 time periods. Shows who overtook whom.
> **Flourish template:** Line bump chart
> **Best for:** Brand rankings over quarters, app store positions, league standings, market share rank changes

---

## Prompt A — Generate Bump Chart

```
Create a bump chart showing rank changes over time.

DATA: [e.g., "Top 8 AI companies by market cap, ranked quarterly Q1 2024 to Q4 2025"]
STORY: [e.g., "NVIDIA went from #5 to #1 while Meta quietly climbed from #7 to #3"]

Create:
1. Y-axis: Rank (INVERTED — #1 at top, highest rank number at bottom)
2. X-axis: Time periods (4-8 periods ideal)
3. Lines connecting each entity's rank across periods
4. Color strategy:
   - Highlight 2-3 biggest movers in accent colors (#0B6E4F, #6366F1, #F59E0B)
   - Gray (#D1D5DB) for entities with minimal rank change
5. Dot at each rank position (6-8px)
6. Direct labels at START and END of each line: entity name + rank
7. Annotation at the biggest rank-swap moment

Data as CSV: Name, Period1_Rank, Period2_Rank, Period3_Rank, ...
- Ranks should be integers (1, 2, 3...) not values
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Too many items (12+) | Max 10 lines or it becomes unreadable |
| Too many time periods (10+) | Lines become flat and boring — max 8 periods |
| Y-axis not inverted | Rank #1 must be at the TOP |
| Using values instead of ranks | Bump charts show RANK, not magnitude — convert first |
