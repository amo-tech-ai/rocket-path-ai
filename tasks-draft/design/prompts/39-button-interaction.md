---
task_id: DES-039
title: Interactive Button & CTA Animation
phase: MVP
priority: P2
status: Not Started
skill: /motion-interaction-designer, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 39 — Interactive Button & CTA Animation

> **Category:** Animation — Micro-interaction
> **When to use:** Call-to-action buttons, form submits, clickable cards, any interactive element
> **Tools:** CSS transitions, Framer Motion whileHover/whileTap, Tailwind
> **Best for:** Landing pages, sign-up forms, pricing cards, any conversion-focused UI

---

## Prompt A — Multi-State Button Animation

```
Create a multi-state animated CTA button with these states:

DEFAULT state:
- Background: solid color (#0B6E4F)
- Text: white, 16px, font-weight 600
- Border-radius: 8px
- Padding: 12px 24px

HOVER state (200ms ease transition):
- Scale: 1.03x
- Shadow: 0 4px 12px rgba(0,0,0,0.15) (elevated)
- Background: slightly lighter (#0D8A63)
- Cursor: pointer

ACTIVE/CLICK state (150ms ease):
- Scale: 0.97x (pressed in)
- Shadow: 0 1px 4px rgba(0,0,0,0.1) (flattened)
- Background: slightly darker (#095C42)
- Return to hover state after release

FOCUS state:
- Outline: 2px solid #0B6E4F with 2px offset (accessibility ring)
- Same as hover visually

DISABLED state:
- Opacity: 0.5
- Cursor: not-allowed
- No hover/active effects

LOADING state:
- Text replaced with spinner animation
- Button width locked (no layout shift)
- All interaction disabled
- Background: gray (#9CA3AF)

Output as: [React component with state management / CSS-only / Tailwind classes / Framer Motion]

Include: prefers-reduced-motion fallback (no scale, instant color transitions only)
```

---

## Prompt B — Magnetic Button (Follows Cursor)

```
Create a button that subtly follows the cursor when hovering near it.

BEHAVIOR:
- When cursor is within 100px of button, button moves slightly toward cursor
- Maximum displacement: 8px in any direction
- Movement uses spring physics (slight overshoot, settles into position)
- On mouse leave: spring back to original position (300ms)

VISUAL:
- Subtle gradient shift in direction of cursor
- Shadow offset follows cursor direction
- Inner text moves at 50% of button displacement (parallax)

Output as: [React component with onMouseMove handler / Framer Motion useMotionValue]

Performance: use transform only, requestAnimationFrame for smooth updates
```

---

## Prompt C — Success/Error Button States

```
Create a submit button that shows success or error states after form submission.

FLOW:
1. DEFAULT: "Submit" text, green background
2. LOADING: text replaced with animated spinner, width stays locked
3a. SUCCESS: background transitions to deeper green, spinner replaced with checkmark icon that draws itself (SVG stroke animation, 400ms), text changes to "Done!"
3b. ERROR: background transitions to red (#EF4444), spinner replaced with X icon, text changes to "Try again", subtle shake animation (translateX -4px, 4px, -4px, 0 over 400ms)
4. RESET: after 2 seconds, button transitions back to DEFAULT

Output as: [React component with async handler / Framer Motion variants]
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Scale too large on hover (1.1x+) | Subtle is better — 1.02-1.05x max |
| No active/pressed state | Always show feedback on click — scale down slightly |
| Width changes during loading | Lock width before showing spinner |
| No focus ring | Accessibility requirement — always show focus outline |
| Hover effects on touch devices | Detect touch and skip hover animations |
