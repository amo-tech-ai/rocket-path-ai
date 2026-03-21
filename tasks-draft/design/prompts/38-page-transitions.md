---
task_id: DES-038
title: Page Transitions
phase: MVP
priority: P2
status: Not Started
skill: /motion-interaction-designer, /framer-motion-animator
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 38 — Page Transitions

> **Category:** Animation — Navigation
> **When to use:** Transitioning between pages/views in SPAs, multi-page apps, or slide decks
> **Tools:** Framer Motion AnimatePresence, View Transitions API, GSAP, CSS
> **Best for:** App navigation, slide presentations, wizard flows, infographic storytelling

---

## Prompt A — Fade + Slide Page Transition

```
Create a smooth page transition effect for a React SPA:

EXIT animation (current page):
- Fade out: opacity 1 → 0
- Slide left: transform translateX(0) → translateX(-20px)
- Duration: 350ms
- Timing: ease-in

ENTER animation (new page):
- Fade in: opacity 0 → 1
- Slide from right: transform translateX(20px) → translateX(0)
- Duration: 350ms
- Timing: ease-out

Requirements:
- Pages must overlap during transition (both briefly visible)
- No layout shift — use position absolute during transition
- Content should be scrolled to top on new page
- Handle browser back button (reverse the direction)

Output as: [Framer Motion AnimatePresence wrapper / View Transitions API / React Router + CSS]

Include prefers-reduced-motion: cross-fade only (no slide) when motion is reduced.
```

---

## Prompt B — Slide Deck Transitions (Infographic Storytelling)

```
Create transitions for an infographic slide deck with [NUMBER] slides.

TRANSITION TYPES by slide purpose:
1. Title slide → Content slide: fade + scale (0.95 → 1.0)
2. Content slide → Content slide: slide left/right (horizontal swipe)
3. Content slide → Data/Chart slide: crossfade (both visible briefly)
4. Chart slide → Summary slide: zoom out effect (current shrinks, summary appears)

CONTROLS:
- Arrow keys: next/previous
- Swipe gestures on touch devices
- Progress indicator bar at top
- Slide counter: "3 / 12"

Duration: 400ms per transition
Timing: cubic-bezier(0.4, 0, 0.2, 1) (Material Design standard easing)

Output as: [React component with slide array / HTML+CSS+JS / Framer Motion]
```

---

## Prompt C — Shared Element Transition

```
Create a shared element transition where a card thumbnail expands into a full detail view.

CARD state:
- Image: 200x150px, border-radius 12px
- Title: 16px below image
- Description: truncated to 2 lines

EXPANDED state:
- Image: full-width hero, border-radius 0
- Title: 24px overlaid on image
- Description: full text below

TRANSITION:
- Image morphs from card position/size to hero position/size (FLIP animation)
- Title animates from below-image to overlaid position
- Background overlay fades in (0 → 0.5 opacity black)
- Duration: 400ms, ease-out
- Clicking backdrop or X reverses the transition

Output as: [Framer Motion layoutId / View Transitions API / FLIP technique in vanilla JS]
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Transition longer than 500ms | Feels sluggish — 300-400ms is ideal |
| Content flash between pages | Use AnimatePresence or absolute positioning during transition |
| No back-button handling | Reverse direction for backward navigation |
| Same transition for all contexts | Match transition type to content relationship |
