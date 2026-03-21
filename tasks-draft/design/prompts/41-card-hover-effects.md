---
task_id: DES-041
title: Card Hover Effects
phase: MVP
priority: P2
status: Not Started
skill: /motion-interaction-designer, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 41 — Card Hover Effects

> **Category:** Animation — Micro-interaction
> **When to use:** Feature cards, pricing cards, team member cards, portfolio items, any grid of clickable items
> **Tools:** CSS transitions, Framer Motion, Tailwind hover:
> **Best for:** Dashboards, feature grids, portfolio galleries, pricing tables

---

## Prompt A — Elevated Card Hover

```
Create hover animations for feature cards.

DEFAULT state:
- Background: white
- Border: 1px solid #E5E7EB
- Border-radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.05)
- Padding: 24px
- Contains: icon (32px), title (18px bold), description (14px)

HOVER state (300ms ease-out transition):
- Elevate: translateY(-4px)
- Shadow increase: 0 12px 24px rgba(0,0,0,0.08)
- Border color: transparent (shadow replaces border visually)
- Icon: scales to 1.1x + color shifts to brand accent (#0B6E4F)
- Optional: subtle background gradient appears (white → very faint green tint)

ACTIVE/CLICK state:
- translateY(-2px) — slightly less elevated than hover
- Shadow reduces slightly
- Quick press feedback: 100ms

EXIT (mouse leave):
- Smooth return to default (300ms ease-out)
- Card settles back, shadow fades

Output as: [CSS / Tailwind classes / React + Framer Motion / styled-components]

Accessibility:
- Focus state mirrors hover state (for keyboard navigation)
- Cards should be focusable (tabIndex={0} or wrapped in <a> / <button>)
- prefers-reduced-motion: no translateY, instant shadow change only
```

---

## Prompt B — Card with Image Zoom on Hover

```
Create a card where the thumbnail image zooms on hover while the card frame stays fixed.

STRUCTURE:
- Image container: overflow hidden, border-radius top corners
- Image: fills container
- Content area below: title + description + tag

HOVER on card:
- Image: scale 1.0 → 1.08 (300ms ease-out) — zooms within the overflow container
- Optional: image slight brightness increase (filter: brightness(1.05))
- Content area: title color shifts to accent
- Card shadow elevates

MOUSE LEAVE:
- Image scales back to 1.0 (400ms ease — slightly slower return feels natural)

Key: overflow: hidden on the image container prevents image from breaking card bounds.
```

---

## Prompt C — Tilt Card (3D Perspective)

```
Create a card with 3D tilt effect that follows the cursor.

BEHAVIOR:
- Track cursor position relative to card center
- Rotate card on X and Y axes based on cursor offset
- Max rotation: 8 degrees on each axis
- Perspective: 800px on parent container

VISUAL:
- Card surface has slight gradient that shifts with tilt (simulates light reflection)
- Shadow moves opposite to tilt direction (realistic shadow)
- Inner elements have slight parallax (icon moves at 30% of tilt, text at 10%)

ON MOUSE LEAVE:
- Spring animation back to flat (0, 0 rotation)
- Duration: 400ms with slight overshoot

Output as: [React component with onMouseMove / Framer Motion useMotionValue + useTransform]

Performance: use transform3d for GPU acceleration, will-change: transform
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Hover effect too dramatic (20px lift) | Subtle 4-6px lift max |
| No exit animation | Always smooth return to default on mouse leave |
| Effects only work with mouse | Add focus state for keyboard users |
| Image zoom breaks card bounds | Always overflow: hidden on image container |
| Tilt angle too extreme (15+deg) | Max 8 degrees — more feels disorienting |
