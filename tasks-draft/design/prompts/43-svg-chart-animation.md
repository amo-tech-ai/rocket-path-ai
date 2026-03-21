---
task_id: DES-043
title: SVG Chart Animation
phase: MVP
priority: P2
status: Not Started
skill: /motion, /framer-motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 43 — SVG Chart Animation

> **Category:** SVG — Data Visualization
> **When to use:** Animated charts rendered as SVG — bar growth, line drawing, donut filling, number counting
> **Tools:** SVG + CSS keyframes, SMIL, Framer Motion, D3.js, Flourish
> **Best for:** Infographic hero stats, animated bar charts, donut reveals, sparklines

---

## Prompt A — Animated Bar Chart (SVG)

```
Create an animated SVG bar chart where bars grow from the bottom up.

DATA: [e.g., "AI: 85%, Cloud: 72%, IoT: 58%, Blockchain: 34%, Quantum: 12%"]

ANIMATION:
- Each bar starts at height 0, grows to its value
- Stagger: 150ms between each bar (left to right)
- Duration: 800ms per bar
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) — slight overshoot then settle
- Y-axis labels fade in simultaneously
- Value labels appear above each bar after it finishes growing (fade in, 200ms)

SVG SPECIFICATIONS:
- viewBox: "0 0 600 400"
- Bars: rect elements with rounded top corners (rx="4")
- Colors: each bar a different shade from palette [#0B3D2E, #0B6E4F, #14B8A6, #6EE7B7, #A7F3D0]
- Axis: thin gray lines (#E5E7EB)
- Font: system sans-serif, 12px for labels, 14px bold for values

Output as: [Inline SVG with CSS animations / React SVG component / D3.js]

TRIGGER: animate when element enters viewport (IntersectionObserver)
```

---

## Prompt B — Self-Drawing Line Chart (SVG Stroke)

```
Create an SVG line chart that draws itself using stroke-dasharray animation.

DATA: [e.g., "Monthly values: Jan 20, Feb 35, Mar 28, Apr 42, May 55, Jun 48, Jul 62, Aug 71, Sep 65, Oct 78, Nov 82, Dec 90"]

TECHNIQUE (stroke-dasharray trick):
1. Create a <path> element for the line
2. Calculate total path length: path.getTotalLength()
3. Set stroke-dasharray and stroke-dashoffset to total length (line invisible)
4. Animate stroke-dashoffset from totalLength to 0 (line draws itself left to right)

ANIMATION:
- Duration: 2 seconds
- Timing: ease-in-out
- After line finishes drawing: dots appear at each data point (scale 0 → 1, staggered)
- After dots: value labels fade in at key points (min, max, latest)

SVG:
- viewBox: "0 0 800 300"
- Line: stroke="#0B6E4F", stroke-width="2.5", fill="none"
- Dots: circles r="4", fill="#0B6E4F"
- Optional: gradient fill below the line (area chart effect) fades in after line draws

Output as: [SVG + CSS / React component]
```

---

## Prompt C — Animated Donut Chart (SVG)

```
Create an SVG donut chart where segments fill clockwise.

DATA: [e.g., "Training 40%, Data Prep 25%, Infrastructure 20%, Talent 10%, Other 5%"]

TECHNIQUE (stroke-dasharray on circle):
1. Use <circle> elements with stroke-dasharray set to segment length
2. Rotate starting point to 12 o'clock (transform: rotate(-90deg))
3. Animate each segment's stroke-dashoffset from full to segment value

ANIMATION:
- Segments fill sequentially (largest first)
- Duration: 600ms per segment
- Stagger: 100ms gap between segments
- Center number counts up to total (e.g., "$2.4M")
- Labels fade in after their segment fills

SVG:
- viewBox: "0 0 200 200"
- Circle: cx="100" cy="100" r="70" (donut hole = inner radius 50)
- Stroke-width: 40 (creates donut thickness)
- Colors: palette from darkest to lightest
- Center text: 24px bold

Output as: [SVG + CSS / React component / D3.js]
```

---

## Prompt D — Animated Infographic Bars (Horizontal)

```
Create animated horizontal SVG bars for an infographic-style comparison.

DATA: [e.g., "Consumer Electronics 60%, Travel 51%, Grocery 44%, Apparel 43%, Entertainment 43%"]

STYLE: BCG-editorial (clean, minimal, green palette)

ANIMATION:
- Bars grow from left to right
- Stagger: 100ms between bars (top to bottom)
- Duration: 700ms per bar
- Value appears at bar end as it reaches final width
- Category labels are static (visible from start)

LAYOUT:
- Label column: 200px fixed width, right-aligned text
- Bar area: remaining width
- Bar height: 28px with 12px gap between bars
- Value labels: 14px bold, positioned 8px right of bar end

Output as: [SVG inline / React component]
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Animating SVG width/height instead of transform | Use transform: scaleX for bars, stroke-dashoffset for lines |
| No fallback for reduced motion | Show final state immediately |
| Path length calculation on SSR | Calculate path length client-side only (useEffect) |
| Too many simultaneous animations | Stagger elements — max 3-4 animating at once |
