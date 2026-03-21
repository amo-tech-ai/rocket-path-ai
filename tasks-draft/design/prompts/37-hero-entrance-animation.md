---
task_id: DES-037
title: Hero Section Entrance Animation
phase: MVP
priority: P2
status: Not Started
skill: /motion-interaction-designer, /framer-motion-animator
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047, DES-046]
---

# 37 — Hero Section Entrance Animation

> **Category:** Animation — Entrance
> **When to use:** Landing page hero sections, above-the-fold content that needs to grab attention on load
> **Tools:** CSS keyframes, Framer Motion, GSAP, Tailwind animate
> **Best for:** SaaS landing pages, portfolio sites, product launches, infographic headers

---

## Prompt A — Staggered Hero Entrance

```
Create a staggered entrance animation for a hero section with these elements:
1. Heading (h1)
2. Subheading / description paragraph
3. CTA button
4. Optional: hero image or illustration

Animation sequence:
- Heading: fades in + slides up from 20px below, duration 600ms, ease-out
- Subheading: same animation, starts 200ms after heading begins
- CTA button: same animation, starts 300ms after subheading begins
- Hero image: fades in + scales from 0.95 to 1.0, starts 400ms after CTA

Timing function: cubic-bezier(0.16, 1, 0.3, 1) (smooth ease-out with slight overshoot)

Output as: [CSS keyframes / Framer Motion React component / Tailwind classes / GSAP timeline]

RULES:
- Total entrance sequence must complete within 1.5 seconds
- No element should be invisible for more than 800ms after page load
- Respect prefers-reduced-motion: disable animations if user has motion sensitivity
- Initial state: all elements opacity 0, transform translateY(20px)
- Final state: all elements opacity 1, transform translateY(0)
```

---

## Prompt B — Hero with Counter Animation

```
Create a hero section where a large stat number counts up from 0 to [TARGET NUMBER].

ELEMENTS:
- Stat number: [e.g., "$4.5M"] counting from $0 to $4.5M
- Label below number: [e.g., "in creative costs saved"]
- Supporting text paragraph
- CTA button

Animation:
1. Container fades in (300ms)
2. Number starts counting up (duration: 2 seconds, easeOutExpo curve)
3. Number uses tabular-nums font feature (digits don't shift width during count)
4. Label and CTA fade in after number reaches 80% of target value

Output as: [React component with useState/useEffect / vanilla JS / Framer Motion]

Include: formatNumber function that adds commas and appropriate prefix ($, %, etc.)
```

---

## Prompt C — Parallax Hero Entrance

```
Create a parallax hero section where:
- Background image: fixed position, slight zoom (scale 1.0 to 1.05) on scroll
- Foreground text: slides up faster than background on scroll
- Overlay gradient: dark to transparent, fades as user scrolls down

On initial load:
- Background fades in from black (800ms)
- Text elements stagger in from below (same as Prompt A)
- Subtle floating particles or gradient orbs animate slowly in background

Keep performance in mind:
- Use transform and opacity only (GPU-accelerated properties)
- No layout-triggering properties (top, left, width, height)
- Use will-change: transform on animated elements
- IntersectionObserver to pause off-screen animations
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Animation longer than 2 seconds total | Users lose patience — keep total sequence under 1.5s |
| Elements jumping/shifting layout during animation | Set explicit dimensions, use transform only |
| No prefers-reduced-motion fallback | Always check `@media (prefers-reduced-motion: reduce)` |
| Animating on every re-render | Trigger entrance animation once with a state flag |
| Using margin/padding for movement | Use transform: translate — it's GPU-accelerated |
