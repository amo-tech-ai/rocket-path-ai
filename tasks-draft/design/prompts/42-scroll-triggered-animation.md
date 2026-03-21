---
task_id: DES-042
title: Scroll-Triggered Animations
phase: MVP
priority: P2
status: Not Started
skill: /motion-interaction-designer, /scroll-storyteller
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047, DES-046]
---

# 42 — Scroll-Triggered Animations

> **Category:** Animation — Scroll
> **When to use:** Content sections that should animate as they enter the viewport. Infographic reveals, feature sections, testimonials.
> **Tools:** Intersection Observer API, Framer Motion useInView, GSAP ScrollTrigger, CSS scroll-driven animations
> **Best for:** Long-form landing pages, infographic articles, portfolio showcases, case study pages

---

## Prompt A — Section Entrance on Scroll

```
Implement scroll-triggered animations for content sections.

SECTION TYPES and their entrance animations:
1. LEFT content block: slides in from left (-30px), fades in, 600ms, ease-out
2. RIGHT content block: slides in from right (30px), fades in, 600ms, ease-out
3. CENTER content (headings, stats): fades in + moves up from 20px below, 600ms, ease-out
4. IMAGES: fade in + scale from 0.95 to 1.0, 800ms, ease-out
5. CARDS grid: stagger each card with 100ms delay between them

TRIGGER SETTINGS:
- Intersection Observer threshold: 0.15 (trigger when 15% visible)
- Root margin: "0px 0px -50px 0px" (trigger slightly before fully in view)
- Animate ONCE only — do not re-animate on scroll up
- Initial state: elements are invisible (opacity 0) until triggered

Output as: [React hooks / vanilla JS with IntersectionObserver / Framer Motion useInView / GSAP ScrollTrigger]

PERFORMANCE:
- Disconnect observer after animation fires (one-time trigger)
- Use transform + opacity only (GPU-accelerated)
- Batch DOM reads/writes to avoid layout thrashing
- Test on mobile — reduce animation distance for smaller screens

ACCESSIBILITY:
@media (prefers-reduced-motion: reduce) {
  - Skip all slide/scale animations
  - Elements appear immediately (no delay)
  - OR use simple fade only (300ms)
}
```

---

## Prompt B — Sticky Section with Scroll Progress

```
Create a sticky section where content animates based on scroll position.

LAYOUT:
- Left side: sticky element (stays fixed while scrolling)
- Right side: scrollable content (multiple paragraphs/cards)

AS USER SCROLLS:
- Progress bar fills (0% to 100% based on section scroll)
- Sticky element content changes (text swaps, image transitions, chart animates)
- Each scroll milestone (25%, 50%, 75%, 100%) triggers a content swap on the sticky side

SWAP ANIMATION:
- Old content fades out + slides up (200ms)
- New content fades in + slides up from below (300ms)
- Crossfade overlap for smooth transition

Output as: [React component with scroll listener / GSAP ScrollTrigger pinning]

Key: use position: sticky with calculated height for the scrollable container.
Height = number_of_sections * viewport_height
```

---

## Prompt C — Counter Animation on Scroll

```
Create numbers that count up when they scroll into view.

NUMBERS: [e.g., "95%", "5,000+", "$4.5M", "45+"]

BEHAVIOR:
1. Numbers start at 0 (invisible or showing "0")
2. When section enters viewport (IntersectionObserver threshold 0.3):
   - Each number counts from 0 to target value
   - Duration: 2 seconds
   - Easing: easeOutExpo (fast start, slow finish — feels satisfying)
   - Stagger: 200ms between each number
3. Format during count:
   - Integers: no decimals during count
   - Decimals: show appropriate precision
   - Prefix/suffix: "$", "%", "+" appear from the start
   - Use tabular-nums font feature (digits don't shift width)
4. After reaching target: brief overshoot to 102% then settle back (spring)

Trigger ONCE only — don't re-animate.

Output as: [React hook useCountUp / vanilla JS / Framer Motion useMotionValue + animate]
```

---

## Prompt D — Parallax Scroll Layers

```
Create a parallax scrolling effect with multiple layers moving at different speeds.

LAYERS (back to front):
1. Background: moves at 0.3x scroll speed (slowest, feels furthest)
2. Mid-ground decorative elements: moves at 0.6x scroll speed
3. Main content: moves at 1.0x (normal scroll)
4. Foreground accent elements: moves at 1.2x scroll speed (fastest, feels closest)

IMPLEMENTATION:
- Calculate offset: element.offsetTop * (1 - speed) on scroll event
- Apply as transform: translateY(calculated_offset)
- Use requestAnimationFrame for smooth 60fps updates
- Clamp movement to prevent elements going off-screen

Output as: [React component / vanilla JS / CSS scroll-driven animations (if browser supports)]

Mobile: disable parallax (reduce to simple fade-in) — parallax often performs poorly on mobile.
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Re-animating on every scroll pass | Trigger once, then disconnect observer |
| Too many animated elements at once | Max 5-6 elements animating simultaneously |
| Animation distance too large (50px+) | 20-30px slide is enough — more feels jumpy |
| No threshold (triggers at edge of viewport) | Use 0.1-0.2 threshold so content is partially visible before animating |
| Parallax on mobile | Disable or reduce to simple fade — performance issues |
| Layout shift during animation | Reserve space with min-height or explicit dimensions |
