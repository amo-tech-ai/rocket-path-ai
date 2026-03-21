---
task_id: DES-046
title: Infographic Layout & Composition
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /frontend-design
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047, DES-048]
---

# 46 — Infographic Layout & Composition

> **Category:** Visual Design — Layout
> **When to use:** Full infographic page design, section composition, visual hierarchy planning
> **Tools:** Figma, CSS Grid, Tailwind, React components
> **Best for:** BCG-style editorial infographics, data reports, one-pagers, social media graphics

---

## Prompt A — Full Infographic Page Layout

```
You are a senior infographic designer at a BCG-tier consultancy.

Design a full-page infographic layout for: [TOPIC]

AUDIENCE: [Founders / Investors / C-suite / General public]
FORMAT: [Vertical scroll web page / A4 print / Social media carousel / Presentation slide]
SECTIONS: [NUMBER] sections

For each section, specify:
1. Layout type: [full-width hero / two-column / card grid / stat row / chart + text]
2. Content hierarchy: what's the #1 thing the viewer should see first?
3. Chart or visualization: which chart type from the 9-category framework
4. Supporting text: headline (5-8 words) + body (2-3 sentences max)
5. Visual weight: how much of the section is chart vs text vs whitespace

OVERALL COMPOSITION:
- Visual flow: reader's eye should follow a Z-pattern (left-to-right, top-to-bottom)
- Content ratio: 70% charts/visuals, 20% captions/labels, 10% body text
- Color: [Brand palette or BCG green family]
- Typography: [Font family], title 24-32px, body 14-16px, captions 11-12px

SPACING RULES:
- Section padding: 48-64px vertical, 24-32px horizontal
- Between elements: 16-24px
- Between sections: 32-48px divider or visual break

Output as: [Wireframe description / CSS Grid specification / Figma layout guide / HTML structure]
```

---

## Prompt B — Section Layout Templates

```
Give me 8 reusable section layout templates for data-driven infographics.

For each template, describe:
1. Grid structure (columns, rows, areas)
2. What goes where (chart position, text position, stat position)
3. Best use case (what data story this layout serves)
4. Responsive behavior (how it adapts to mobile)

TEMPLATES needed:
1. Hero stat (one massive number + supporting text)
2. Chart + explanation (60/40 split)
3. Three-stat row (3 KPIs side by side)
4. Comparison panel (A vs B side by side)
5. Ranked list (sorted bars + annotations)
6. Timeline / process flow (horizontal steps)
7. Grid of small multiples (2x3 or 3x3 mini charts)
8. Full-width chart with caption strip below

Format each as a CSS Grid template with named areas.
```

---

## Prompt C — Visual Hierarchy Audit

```
Review this infographic section layout and fix the visual hierarchy.

CURRENT LAYOUT: [Describe — e.g., "Title at top, then paragraph, then chart, then source line. Everything is the same size text."]

Audit against these hierarchy rules:
1. Is there ONE focal point per section? (the viewer's eye should land here first)
2. Size hierarchy: is the most important element the largest?
3. Color hierarchy: does the accent color draw attention to the right thing?
4. Whitespace: is there enough breathing room around the focal element?
5. Reading order: does the layout guide the eye in the correct sequence?

Return:
- Current score: [1-5]
- Top 3 fixes with specific CSS/sizing changes
- Recommended reading order: 1st → 2nd → 3rd → 4th element
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Too much text, not enough charts | 70% visual, 20% caption, 10% body text |
| Every element is the same size | Create clear size hierarchy — hero element 2-3x larger |
| No whitespace between sections | Minimum 32px divider between content blocks |
| Inconsistent alignment | Use CSS Grid or explicit column system — align everything |
