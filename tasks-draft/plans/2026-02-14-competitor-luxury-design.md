# Design: Luxury Competition Section (S4)

> **Date:** 2026-02-14 | **Status:** Approved | **Approach:** A (Consulting Slide Deck)

## Goal

Replace the basic CompetitorMatrix with a consulting-grade competitive landscape visualization.
Plain English explanations, Playfair Display typography, staggered animations.

## Layout — 4 Stacked Zones

1. **Plain English Intro** — Auto-generated paragraph explaining what this section shows
2. **Enhanced 2×2 Positioning Matrix** — SVG scatter plot with quadrant tints, labeled axes, animated dots
3. **Competitor Profile Cards** — Responsive grid with threat bar + SWOT (strengths/weaknesses)
4. **Your Strategic Edge** — Premium callout card with moat description + market gaps

## Props Interface

```ts
interface CompetitorLuxuryProps {
  competitors: {
    name: string;
    threatLevel: 'high' | 'medium' | 'low';
    description: string;
    strengths?: string[];
    weaknesses?: string[];
    position?: { x: number; y: number };
  }[];
  positioning?: {
    xAxis: string;
    yAxis: string;
    description?: string;
    yourPosition?: { x: number; y: number };
  };
  yourEdge?: string;
  marketGaps?: string[];
}
```

## Files

| File | Action |
|------|--------|
| `src/components/validator/report/CompetitorLuxury.tsx` | New (~350 lines) |
| `src/components/validator/report/ReportV2Layout.tsx` | Edit — swap to CompetitorLuxury |

Old `CompetitorMatrix.tsx` preserved (never deleted).

## Typography

- Section intro: Inter 15px/400
- Axis labels: Inter 11px uppercase, tracking 0.12em
- Competitor name: Inter 14px/600
- Threat label: Inter 11px uppercase/600
- SWOT items: Inter 13px/400
- Edge heading: Playfair Display 18px/600

## Animation

- Matrix dots: fade-in + scale 0.5s staggered
- Cards: fade-up stagger 0.1s
- Threat bars: width 0→value 0.6s
- prefers-reduced-motion: skip to final state
