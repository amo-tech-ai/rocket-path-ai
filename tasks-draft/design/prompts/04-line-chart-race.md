---
task_id: DES-004
title: Line Chart Race (Horserace)
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /framer-motion-animator
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 04 — Line Chart Race (Horserace)

> **Category:** Change Over Time
> **When to use:** Cumulative progress over time where RANKING trajectory matters. Shows continuous paths unlike bar race.
> **Flourish template:** Line Chart Race (Horserace)
> **Best for:** Cumulative funding, debt growth, COVID case trajectories, startup runway burn

---

## Prompt A — Generate Line Chart Race

```
Create a line chart race (horserace) visualization specification.

DATA: [e.g., "Cumulative venture funding for 8 AI startups, monthly from Series A to present"]
PARTICIPANTS: [List entities]
TIME SPAN: [e.g., "Month 1 to Month 36 post-founding"]
STORY: [e.g., "Company X raised slower but more consistently, overtaking faster-burning rivals by month 24"]

Create:
1. Data formatted as:
   - Row 1 headers: "Name", "Category", "Month 1", "Month 2", ..., "Month 36"
   - Each row = one participant with cumulative values
2. Highlight the OVERTAKE moment with annotation
3. Recommended settings:
   - Race duration: [8-15 seconds total]
   - Label position: right of current position
   - Finish line annotation: final ranking callout
4. Color: highlight 2-3 key competitors, gray for the rest

Title emphasizing the JOURNEY, not just the outcome:
- Good: "The Slow Burn That Won: How Steady Fundraising Beats Speed"
- Bad: "Cumulative Funding by Startup"
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Non-cumulative data | Values must increase over time (or at least not decrease randomly) |
| Too many lines (10+) | Highlight 3-5 key competitors, gray the rest |
