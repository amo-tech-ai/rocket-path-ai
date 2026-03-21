---
task_id: DES-047
title: Color Palette & Theming
phase: MVP
priority: P2
status: Not Started
skill: /color-palette, /accessibility
subagents: [frontend-designer]
depends_on: []
---

# 47 — Color Palette & Theming

> **Category:** Visual Design — Color
> **When to use:** Choosing chart colors, brand palette generation, accessibility checking, dark mode variants
> **Tools:** Figma, Tailwind config, CSS custom properties
> **Best for:** Design system setup, chart color mapping, infographic theming, accessibility compliance

---

## Prompt A — Generate Chart Color Palette

```
Create a color palette optimized for data visualization.

BRAND PRIMARY: [e.g., "#0B6E4F" (BCG green)]
NUMBER OF DATA SERIES: [e.g., "5 distinct categories + 1 gray for 'Other'"]
CHART BACKGROUND: [e.g., "White (#FFFFFF)" or "Dark (#1E293B)"]

Create:
1. Primary palette: 5-6 colors that are:
   - Visually distinct from each other (no two adjacent on the color wheel)
   - High contrast against the background
   - Colorblind-safe (test deuteranopia, protanopia, tritanopia)
   - Consistent in perceived brightness (no neon + pastel mix)

2. Sequential palette (for heatmaps/choropleths): 5 shades from light to dark of the primary brand color

3. Diverging palette (for above/below): green through neutral to red, 5 steps

4. "Other/inactive" color: neutral gray that recedes visually

For each color provide:
- Hex code
- RGB values
- WCAG contrast ratio against background (must be 3:1 minimum for data, 4.5:1 for text)
- Name/purpose (e.g., "Category A — Technology")

Output as: [CSS custom properties / Tailwind config / JSON / Figma-ready swatches]
```

---

## Prompt B — Colorblind-Safe Audit

```
Review this color palette for colorblind accessibility:

COLORS: [List hex codes currently in use]
USAGE: [What each color represents in the chart]

Test against:
1. Deuteranopia (red-green, most common, ~6% of men)
2. Protanopia (red-green variant)
3. Tritanopia (blue-yellow, rare)

For each test:
- Which color pairs become indistinguishable?
- Suggest replacement colors that maintain distinction
- Alternative: suggest adding texture/pattern as secondary differentiator

RULES:
- Never rely on red vs green alone as the ONLY differentiator
- If using red for "bad" and green for "good," add icons (checkmark/X) as backup
- Use shapes, patterns, or direct labels in addition to color
```

---

## Prompt C — Dark Mode Chart Palette

```
Convert this light-theme chart palette to dark mode.

LIGHT PALETTE: [List colors]
LIGHT BACKGROUND: #FFFFFF
DARK BACKGROUND: #1E293B (or #0F172A)

Rules for dark mode conversion:
1. Increase brightness of data colors (they need to pop against dark bg)
2. Reduce saturation slightly (neon on dark is harsh)
3. Swap text color to light (#F8FAFC)
4. Grid lines: very faint (#334155 at 30% opacity)
5. Maintain the same color MEANING (if green = positive on light, green = positive on dark)
6. Test contrast: all data colors must be 3:1+ against dark background

Return: side-by-side comparison of light vs dark palette
```

---

## Prompt D — Brand-to-Chart Palette Generator

```
I have a brand identity with these colors:
- Primary: [HEX]
- Secondary: [HEX]
- Accent: [HEX]
- Neutrals: [Light gray, Mid gray, Dark]

Generate a complete chart palette derived from this brand:
1. 5-color categorical palette (for pie/bar/line with multiple series)
2. 3-color traffic light (positive/neutral/negative)
3. 5-step sequential (light to dark for heatmaps)
4. Highlight + muted pair (1 accent color + 1 gray for "this vs everything else")

Each derived color should feel "on brand" but be optimized for data readability.
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| 8+ colors in one chart | Max 5 distinct + gray "Other" |
| Red/green as only differentiator | Add icons, patterns, or direct labels as backup |
| Colors too similar in brightness | Vary both hue AND brightness |
| Neon colors on white background | Reduce saturation for on-white use |
| No dark mode consideration | Always provide light + dark variant |
