---
task_id: DES-040
title: Loading Animations
phase: MVP
priority: P2
status: Not Started
skill: /motion-interaction-designer, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 40 — Loading Animations

> **Category:** Animation — Feedback
> **When to use:** API calls, data fetching, image loading, form submission, any async operation
> **Tools:** CSS keyframes, Framer Motion, SVG animation, Lottie
> **Best for:** Dashboard loading, chart rendering, pipeline progress, skeleton screens

---

## Prompt A — Three-Dot Loader

```
Create a loading animation using three dots.

ANIMATION per dot:
- Scale: 0.5 → 1.2 → 0.5 (pulse)
- Opacity: 0.3 → 1.0 → 0.3 (fade)
- Duration: 600ms per cycle
- Delay: 200ms between each dot (staggered wave)
- Loop: infinite

LAYOUT:
- 3 dots horizontally, 8px gap between
- Dot size: 8px diameter
- Color: [primary brand color #0B6E4F]
- Centered in container

Output as: [CSS keyframes / React component / SVG animated / Tailwind]

Variants:
A) Bouncing dots (translateY instead of scale)
B) Fading dots (opacity only, no scale)
C) Spinning dots (rotate around a center point)
```

---

## Prompt B — Skeleton Screen

```
Create a skeleton loading screen for a [card / dashboard / chart / list].

LAYOUT to mimic:
- [Describe the real content layout, e.g., "Card with 200px image on top, 16px title line, two 14px description lines, and a tag row"]

SKELETON:
- Replace each element with a rounded rectangle in light gray (#F3F4F6)
- Add a shimmer animation: gradient sweep from left to right
  - Gradient: transparent → rgba(255,255,255,0.6) → transparent
  - Width: 200px gradient band
  - Duration: 1.5 seconds
  - Timing: linear, infinite loop
  - Direction: left to right across the entire skeleton

DIMENSIONS:
- Match exact dimensions of real content (prevents layout shift when content loads)
- Title line: 60% width, 16px height, border-radius 4px
- Description lines: 100% and 80% width, 14px height
- Image placeholder: full width, correct aspect ratio

Output as: [React component / CSS + HTML / Tailwind animate-pulse]

Transition to real content: crossfade (300ms) when data arrives
```

---

## Prompt C — Progress Bar (Pipeline/Multi-Step)

```
Create a multi-step progress indicator for a [NUMBER]-step process.

STEPS: [e.g., "1. Extract → 2. Analyze → 3. Generate → 4. Review → 5. Complete"]

VISUAL:
- Horizontal bar connecting step circles
- Each step: circle (24px) with step number inside
- Completed steps: filled green circle + green connecting bar
- Current step: pulsing ring animation (scale 1.0 → 1.15 → 1.0, infinite)
- Future steps: gray outline circle + gray bar

ANIMATION when step completes:
- Circle fills with color (scale from center, 300ms)
- Checkmark icon draws itself inside circle (SVG stroke, 200ms)
- Connecting bar fills left-to-right (400ms)
- Next step circle starts pulsing

Percentage label: show overall % above the bar

Output as: [React component with currentStep prop / CSS + JS]
```

---

## Prompt D — Chart Loading Animation

```
Create a loading animation specifically for a chart container.

PHASE 1 — Skeleton (while data loads):
- Gray placeholder axes (X and Y lines)
- Animated placeholder bars/lines that pulse (skeleton shimmer)

PHASE 2 — Data arrival (when data is ready):
- Bars grow from bottom to their values (staggered, 100ms between bars, easeOut)
- Lines draw from left to right (1 second duration)
- Donut segments fill clockwise from 12 o'clock
- Numbers count up to their values

PHASE 3 — Idle:
- All animations complete, chart is static
- Hover interactions activate

Duration: Phase 1 → Phase 2 transition is instant when data arrives
Minimum display time for skeleton: 300ms (avoid flash if data is fast)
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Spinner blocks entire page | Use skeleton screens inline — show layout shape |
| No loading state at all | Users think the app is broken — always show feedback |
| Loading animation is distracting | Keep it subtle — pulse or shimmer, not spinning fireworks |
| Skeleton doesn't match real layout | Measure real component dimensions and match exactly |
| Flash of skeleton then content | Minimum 300ms display + crossfade transition |
