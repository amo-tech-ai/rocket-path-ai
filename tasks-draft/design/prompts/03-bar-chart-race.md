---
task_id: DES-003
title: Bar Chart Race
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /framer-motion-animator
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 03 — Bar Chart Race

> **Category:** Change Over Time / Ranking
> **When to use:** Rankings shifting over sequential time periods. Entertaining, shareable, viral-worthy.
> **Flourish template:** Bar Chart Race
> **Best for:** Top countries by metric over decades, market share shifts, trending topics, competitive rankings

---

## Prompt A — Generate Bar Chart Race Data

```
You are creating an animated bar chart race for [social media / presentation / website embed].

TOPIC: [e.g., "Top 10 countries by AI investment"]
PARTICIPANTS: [What are the bars? — e.g., "Countries: US, China, UK, Germany, India, France, Japan, Canada, South Korea, Israel"]
TIME PERIODS: [e.g., "Annual, 2015 to 2026"]
STORY: [e.g., "China is closing the gap with the US while India emerges as a surprise contender"]

Create:
1. Data table formatted for Flourish Bar Chart Race:
   - Row 1 headers: "Name", "Category", "Image URL", "2015", "2016", "2017", ..., "2026"
   - Each subsequent row: one participant with values per time period
   - Values must be CUMULATIVE or ABSOLUTE per period (not deltas/changes)

2. Configuration recommendations:
   - Number of bars visible: [8-12 for readability]
   - Duration per period: [400-600ms for web, 200-300ms for social video]
   - Color coding: by category or region
   - Timed captions: annotate 2-3 key moments (e.g., "COVID-19 impact" at 2020)
   - Running total counter: [Yes/No]

3. A punchy title (max 8 words) that creates curiosity:
   - Good: "The Global AI Race: Who's Winning?"
   - Bad: "AI Investment by Country 2015-2026"

If you don't have real data, generate realistic dummy data that tells a plausible story. Mark as "illustrative data" in the source line.
```

---

## Prompt B — Convert Existing Data to Race Format

```
I have data in this format:
[PASTE YOUR DATA — e.g., rows = years, columns = countries with values]

Transform this into Flourish Bar Chart Race format:
- Each ROW = one participant (country, company, person)
- Each COLUMN after the name = one time period
- Values should be [cumulative / absolute per period]
- Add a "Category" column grouping participants by [region / industry / type]
- Sort rows by final period value (highest first)

Return as clean CSV ready to paste into Flourish.
```

---

## Prompt C — Storyboard Key Moments

```
I'm creating a bar chart race about [TOPIC] spanning [TIME RANGE].

Identify 4-6 key moments where the rankings dramatically shift. For each:
1. Time period
2. What happened (which participant overtook which)
3. Real-world context (why did this happen — event, policy, market shift)
4. Suggested caption text (max 15 words)

I'll use these as timed annotations in the Flourish race.
```

---

## Anti-Patterns

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Using delta/change values instead of absolutes | Bars shrink and grow erratically, no meaningful race | Use cumulative or absolute values |
| Too many bars (15+) | Bottom bars never visible, visual chaos | Show top 8-12, group rest as "Other" |
| Too fast animation | Reader can't track changes | 400-600ms per period minimum |
| No captions at key moments | Viewer misses the story | Add 3-5 timed annotations |
