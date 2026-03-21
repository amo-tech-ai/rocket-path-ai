---
task_id: DES-044
title: SVG Icon & Logo Animation
phase: MVP
priority: P2
status: Not Started
skill: /motion, /framer-motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 44 — SVG Icon & Logo Animation

> **Category:** SVG — Branding
> **When to use:** Logo reveals, icon micro-animations, self-drawing logos, animated icons in navigation/features
> **Tools:** SVG + CSS, SMIL, Lottie, Framer Motion
> **Best for:** Brand loading screens, feature section icons, navigation indicators, success/error states

---

## Prompt A — Self-Drawing Logo (Stroke Animation)

```
Create a self-drawing SVG logo animation where the logo appears as if being sketched in real-time.

LOGO: [Describe or paste SVG path data]

TECHNIQUE:
1. Convert all fills to strokes (outline version of logo)
2. Calculate total path length per path element
3. Set stroke-dasharray = stroke-dashoffset = totalLength
4. Animate stroke-dashoffset to 0 (drawing effect)
5. After drawing completes: fill fades in (opacity 0 → 1, 400ms)

ANIMATION SEQUENCE:
- Phase 1: Logo outlines draw themselves (2 seconds, ease-in-out)
- Phase 2: Strokes fade, fills appear (400ms crossfade)
- Phase 3: Final logo sits static

If logo has multiple paths, stagger them:
- Primary shape draws first
- Secondary details draw 300ms later
- Text/wordmark draws last

Output as: [SVG + CSS keyframes / React component / Lottie JSON]

RULES:
- Stroke-width during draw phase: 1.5-2px (thinner than final strokes)
- Use stroke-linecap: round for natural drawing feel
- If logo has no clear stroke version, create a simplified outline
```

---

## Prompt B — Animated Feature Icons

```
Create a set of [NUMBER] animated SVG icons for feature sections.

ICONS: [e.g., "Lightning bolt (speed), Shield (security), Chart (analytics), Gear (settings), Users (team)"]

ANIMATION per icon (triggered on hover or scroll-into-view):
1. Lightning bolt: stroke draws, then fills with yellow, brief flash effect
2. Shield: draws from center outward, checkmark draws inside after
3. Chart: bars grow from bottom, line draws over top
4. Gear: rotates 360 degrees once, teeth draw in sequence
5. Users: figures fade in one by one, left to right

SPECIFICATIONS:
- Size: 48x48px viewBox
- Style: outlined (2px stroke), minimal detail
- Color: monochrome (#0B6E4F) with accent on hover
- Animation duration: 600-800ms per icon
- Trigger: once on viewport entry, replay on hover

Output as: [Individual SVG components / React icon component library / Lottie files]
```

---

## Prompt C — Morphing Icon (State Change)

```
Create an SVG icon that morphs between two states.

STATE A: [e.g., "Hamburger menu (3 horizontal lines)"]
STATE B: [e.g., "Close X (two diagonal lines)"]

MORPH ANIMATION:
- Top line: rotates 45 degrees clockwise, translates to center
- Middle line: fades out (opacity 1 → 0, scale X 1 → 0)
- Bottom line: rotates -45 degrees, translates to center
- Duration: 300ms
- Timing: ease-in-out
- Reversible: clicking again morphs back to original state

OTHER MORPH PAIRS:
- Play → Pause (triangle → two bars)
- Plus → Minus (remove vertical bar)
- Arrow down → Arrow up (rotate 180)
- Search → Close (circle shrinks, handle becomes X)

Output as: [React component with toggle state / CSS transitions on SVG paths]
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Logo draw animation too slow (3s+) | 1.5-2 seconds max for logo reveal |
| Animating on every page load | Play once, or on first visit only (sessionStorage flag) |
| Complex SVG paths that don't draw smoothly | Simplify paths or break into sub-paths |
| Fill appearing before stroke finishes | Coordinate timing — fill starts after draw ends |
