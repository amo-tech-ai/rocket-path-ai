---
task_id: DES-054
title: Component Specification & Design System
phase: MVP
priority: P2
status: Not Started
skill: /high-fidelity-prototyping, /frontend-design
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047, DES-048]
---

# 54 — Component Specification & Design System

> **Category:** Design Workflow
> **When to use:** Specifying reusable UI components for infographic/chart systems, building a design system
> **Source:** Parallel HQ, shadcn/ui patterns
> **Best for:** Chart component specs, infographic section templates, reusable visual blocks

---

## Prompt A — Chart Component Specification

```
Create a component specification for a reusable [CHART TYPE] component.

COMPONENT NAME: [e.g., "StatCard", "BarChart", "DonutChart", "ComparisonPanel"]

PROPS (configurable inputs):
- List every parameter the component accepts
- For each: name, type, default value, description
- Mark required vs optional

VARIANTS:
- List 2-4 visual variants (e.g., "light", "dark", "minimal", "detailed")
- Describe what changes between variants

STATES:
- Loading (skeleton placeholder)
- Empty (no data message)
- Error (failed to load)
- Default (data rendered)
- Animated (entrance animation)

RESPONSIVE BEHAVIOR:
- Desktop (>1024px): [description]
- Tablet (640-1024px): [description]
- Mobile (<640px): [description]

ACCESSIBILITY:
- ARIA labels
- Keyboard navigation
- Screen reader description
- Color contrast compliance

Output as: [TypeScript interface / Storybook story / Figma component spec]

Example usage:
<BarChart
  data={[{label: "AI", value: 85}, ...]}
  sorted={true}
  color="#0B6E4F"
  animated={true}
  source="BCG, 2026 (n=500)"
/>
```

---

## Prompt B — Infographic Section Template System

```
Design a system of reusable infographic section components.

Each section template should be a self-contained block that can be stacked vertically to build a full infographic page.

TEMPLATES NEEDED:

1. HeroStat — big number + label + supporting text
   Props: number, label, description, accentColor

2. ChartSection — chart + headline + caption
   Props: chartType, data, headline, caption, source, layout ("left" | "right" | "full")

3. ComparisonPanel — A vs B side by side
   Props: leftData, rightData, leftLabel, rightLabel, metric

4. ThreeStatRow — 3 KPIs horizontally
   Props: stats[{number, label, trend}], accentColor

5. RankedList — sorted bars with annotations
   Props: items[{label, value}], highlight, source

6. QuoteBlock — expert quote with attribution
   Props: quote, author, title, image

7. TimelineStrip — horizontal process/timeline
   Props: steps[{label, status, description}]

8. SourceFooter — source citations + methodology note
   Props: sources[], methodology, sampleSize

For each template, provide:
- CSS Grid layout specification
- Spacing tokens (padding, gaps)
- Typography roles used
- Animation trigger behavior (scroll-into-view)
```

---

## Prompt C — Design Token Extraction

```
I have an existing design (or reference image). Extract the design tokens.

REFERENCE: [Describe the design or attach an image]

Extract:
1. COLORS: all colors used with hex codes and purpose
2. TYPOGRAPHY: fonts, sizes, weights, line heights for each role
3. SPACING: padding, margins, gaps (identify the system — 4px, 8px, 16px, etc.)
4. BORDERS: radius values, border widths, border colors
5. SHADOWS: box-shadow values for each elevation level
6. ANIMATION: timing, easing, duration tokens

Output as: [CSS custom properties / Tailwind config / JSON design tokens]
```
