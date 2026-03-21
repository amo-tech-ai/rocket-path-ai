---
task_id: DES-048
title: Typography for Data Visualization
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /frontend-design
subagents: [frontend-designer]
depends_on: []
---

# 48 — Typography for Data Visualization

> **Category:** Visual Design — Typography
> **When to use:** Setting up type hierarchy for charts, infographics, dashboards, data reports
> **Tools:** CSS, Tailwind, Figma
> **Best for:** Chart labels, infographic headings, dashboard typography, print report layout

---

## Prompt A — Chart Typography System

```
Create a typography specification for data-driven infographics and charts.

BRAND FONT: [e.g., "Inter" or "Roboto" — must be clean sans-serif]
FALLBACK: system-ui, -apple-system, sans-serif
MEDIUM: [Web / Print / Slide deck]

Define these type roles with exact sizes, weights, and colors:

1. CHART TITLE (the story headline):
   - Purpose: tell the insight, not describe the chart
   - Size: [px], weight: [bold/semibold], color: [dark]
   - Max length: 1-2 lines
   - Example: "Healthcare leads AI adoption, but education falls behind"

2. CHART SUBTITLE / SOURCE:
   - Purpose: context, date range, sample size
   - Size: [px], weight: [regular], color: [mid-gray]
   - Format: "Source: [Name], [Year] (n=[count])"

3. AXIS LABELS:
   - Size: [px], weight: [regular], color: [mid-gray]
   - Number format: abbreviated (1K, 2.5M, $1.2B) with tabular-nums

4. DATA LABELS (values on/near bars/dots):
   - Size: [px], weight: [semibold], color: [dark or white depending on background]
   - Feature: font-variant-numeric: tabular-nums (digits same width)

5. ANNOTATION CALLOUTS:
   - Size: [px], weight: [medium], color: [accent]
   - Background: light accent fill with no-wrap
   - Connected to data point with thin line

6. LEGEND TEXT:
   - Size: [px], weight: [regular], color: [mid-gray]
   - Prefer direct labels over legend when possible

7. BIG STAT NUMBER (hero KPI):
   - Size: [px], weight: [bold], color: [brand primary]
   - Feature: tabular-nums, letter-spacing tight
   - Supporting label below: [px], weight: [regular]

MINIMUM SIZES:
- Web: nothing below 11px
- Print: nothing below 8pt
- Slide: nothing below 14px (viewed at distance)

Output as: [CSS custom properties / Tailwind config / design tokens JSON]
```

---

## Prompt B — Number Formatting Specification

```
Create a number formatting guide for all charts in this project.

RULES:
1. Thousands: use comma separator (1,234 not 1234)
2. Millions: abbreviate to 1.2M (not 1,200,000)
3. Billions: abbreviate to $1.5B
4. Percentages: show % symbol, 1 decimal max (72.3%)
5. Currency: prefix with symbol ($, EUR, etc.), no cents for values over $1K
6. Negative: use minus sign, red color, or parentheses — be consistent
7. Zero: show "0" not blank or dash
8. Missing data: show "N/A" in italic gray

FONT FEATURE:
- Use font-variant-numeric: tabular-nums for ALL numbers in charts
- This ensures digits are the same width so columns align

AXIS ABBREVIATION:
- 0, 25K, 50K, 75K, 100K (not 0, 25000, 50000...)
- $0, $1M, $2M, $3M (not $0, $1,000,000...)

Provide a formatting function in JavaScript that handles all cases.
```

---

## Prompt C — Responsive Type Scale

```
Create a responsive type scale for infographics that work from mobile to desktop.

BREAKPOINTS:
- Mobile (<640px): base scale
- Tablet (640-1024px): +10-15% larger
- Desktop (>1024px): +25-30% larger

TYPE ROLES (from Prompt A) should scale proportionally.

CRITICAL RULES:
- Chart title: never below 16px on any device
- Axis labels: never below 10px on any device
- Data labels: never below 11px on any device
- Big stat number: scales from 32px (mobile) to 56px (desktop)

Output as: [CSS clamp() values / Tailwind responsive classes / CSS custom properties with media queries]

Example: font-size: clamp(16px, 2vw + 8px, 24px)
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Decorative/serif font in charts | Clean sans-serif only (Inter, Roboto, Helvetica) |
| Font size below 10px | Minimum 10px for web, 8pt for print |
| Numbers without tabular-nums | Always use tabular-nums in data contexts |
| Mixing multiple font families | One family, vary weight and size for hierarchy |
| Title that describes the chart instead of telling the story | "AI adoption rates by industry" → "Healthcare leads AI adoption" |
