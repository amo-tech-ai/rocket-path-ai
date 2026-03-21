# Fashion Infographic Blog — Design Document

> **Date:** 2026-02-14
> **Status:** Approved
> **Audience:** General fashion industry
> **Platform:** StartupAI website (React + Vite + shadcn/ui)

---

## Overview

A 13-slide, scroll-driven infographic blog synthesizing 9 fashion industry research reports into a thematic narrative arc: **Context → Disruption → Opportunity → Future**.

## Source Reports

| # | Report | Source |
|---|--------|--------|
| 1 | The State of Fashion 2026 | BoF × McKinsey |
| 2 | Fashion Industry Validation Report | McKinsey/BoF/BCG/K3 |
| 3 | Fashion Industry Intelligence Report | McKinsey/BoF/BCG/K3 |
| 4 | State of Fashion 2026 Strategic Report | McKinsey/BoF |
| 5 | Current State of Fashion Industry | Power Digital |
| 6 | AI-First Companies Win the Future | BCG |
| 7 | Fashion AI Startups to Watch | BoF |
| 8 | Finding the Future: Fashion | Kantar |
| 9 | Gen Z × Gen Alpha Rewiring Fashion | WWD × BCG |
| 10 | The Interline AI Report 2024 | The Interline |

## Design System

### Colors
- **Background:** `#0E1117` (dark)
- **Accent primary:** `#7C3AED` (violet)
- **Accent secondary:** `#10B981` (emerald)
- **Text primary:** `#F8FAFC` (slate-50)
- **Text muted:** `#94A3B8` (slate-400)
- **Card surface:** `#1E293B` (slate-800)
- **Border:** `#334155` (slate-700)

### Typography
- **Hero stat:** 72-96px, bold, accent color
- **Section title:** 32-40px, semibold
- **Body:** 16-18px, regular
- **Supporting stat:** 24-28px, medium
- **Captions/source:** 12-14px, muted

### Motion
- Scroll-triggered reveals (Framer Motion `useInView`)
- Parallax hero section (`useScroll` + `useTransform`)
- Staggered stat card entries (0.1s stagger)
- Chart draw-on animations (SVG path)
- Number count-up animations for hero stats
- `useReducedMotion` for accessibility

### Layout
- Full-viewport hero slide
- Max-width 1280px content area
- Mobile-first responsive
- Minimal grid, white-space heavy
- Each slide is a full section with scroll-snap

## Slide Map

| Slide | Title | Hero Stat | Chart Type |
|-------|-------|-----------|------------|
| 01 | Fashion's $2T Crossroads | $2.0T → $2.4T by 2030 | Bar: exec sentiment |
| 02 | The $27B Tariff Tax | $27B incremental duties | Stacked bar: tariffs by country |
| 03 | The Discount Trap | 66% need 30%+ discount | Line: consumer behavior |
| 04 | AI Shopping Revolution | 4,700% AI search surge | Area: search volume |
| 05 | Gen Z Rewires Everything | 41% use AI weekly | Dual-axis: AI × spend |
| 06 | AI Across the Value Chain | 90% pilots fail | Grouped bar: AI impact |
| 07 | Resale Hits $317B | $197B → $317B CAGR 13% | Stacked area: regional |
| 08 | Sustainable Materials | 8.3% annual growth | Bar: material search growth |
| 09 | Jewellery & Wearables | 4.1% CAGR | Dual-axis: market + shipments |
| 10 | Luxury Recalibrated | EBITA -3.2%pts | Line: margin trajectory |
| 11 | $400M+ Startup Wave | 17 startups | Treemap: funding by category |
| 12 | Mid-Market Rises | EP index +21% | Stacked bar: segment EP |
| 13 | 2026: Adapt or Disappear | $2.9B → $89.4B | Timeline: inflection points |

## Per-Slide JSON Structure

```json
{
  "section_title": "string",
  "primary_stat": "string",
  "supporting_stats": ["max 3 strings, <18 words each"],
  "analysis": "string (2-3 sentences)",
  "chart": {
    "type": "bar | line | area | stacked_bar | treemap | dual_axis | timeline",
    "x_axis": "string",
    "y_axis": "string",
    "data_points": [{"label": "", "value": 0}]
  },
  "diagram": {
    "type": "flow | ecosystem | convergence | cycle",
    "mermaid": "mermaid syntax string"
  },
  "design_guidelines": {
    "background": "#hex",
    "accent": "#hex",
    "animation_sequence": "string",
    "reveal_order": ["element1", "element2"],
    "transition_style": "fade-up | slide-left | scale-in | draw-on"
  },
  "source": "Report name (org, year)"
}
```

## Skills Used Per Task

| Skill | Purpose |
|-------|---------|
| `design/frontend-design` | Production-grade React components, distinctive aesthetic |
| `design/high-fidelity-prototyping` | Component states, responsive breakpoints, handoff specs |
| `design/low-fidelity-prototyping` | ASCII wireframes for layout validation |
| `design/color-palette` | Dark theme palette from `#7C3AED`, WCAG contrast |
| `design/framer-motion-animator` | Scroll reveals, parallax, staggered lists, chart draws |
| `design/accessibility` | WCAG 2.1 AA, keyboard nav, screen reader, contrast |

## Implementation Approach

Each slide is a self-contained React component:
- `src/pages/infographic/FashionInfographic.tsx` — main page, scroll container
- `src/components/infographic/Slide01Hero.tsx` through `Slide13RoadAhead.tsx`
- `src/components/infographic/shared/` — reusable chart, stat card, diagram components
- `src/data/fashion-infographic.ts` — all slide data (JSON structure above)

## Task Files

13 task prompts in `/home/sk/startupai16L/tasks/infographics/`:
- `001-hero-crossroads.md` through `013-road-ahead.md`

---

**Path:** `docs/plans/2026-02-14-fashion-infographic-blog-design.md`
**Updated:** 2026-02-14
