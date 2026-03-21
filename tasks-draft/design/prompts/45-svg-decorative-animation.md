---
task_id: DES-045
title: SVG Decorative & Background Animation
phase: MVP
priority: P2
status: Not Started
skill: /scroll-storyteller, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 45 — SVG Decorative & Background Animation

> **Category:** SVG — Visual Design
> **When to use:** Background ambient animations, decorative elements, hero section visual effects
> **Tools:** SVG + CSS, SMIL, canvas, requestAnimationFrame
> **Best for:** Hero backgrounds, section dividers, ambient motion, visual polish

---

## Prompt A — Gradient Wave Background

```
Create an animated SVG wave background for a hero section.

VISUAL:
- 2-3 overlapping wave paths at the bottom of the section
- Each wave has a slightly different amplitude, frequency, and speed
- Colors: graduating opacity of brand color (#0B6E4F at 10%, 15%, 20% opacity)

ANIMATION:
- Waves move horizontally in a continuous loop
- Wave 1: 8 second cycle, moves left
- Wave 2: 12 second cycle, moves right
- Wave 3: 10 second cycle, moves left (slower)
- Timing: linear, infinite loop

SVG:
- viewBox preserves aspect ratio
- Responsive: scales to container width
- Wave paths generated with cubic bezier curves

Output as: [SVG + CSS animation / React component]

Performance: use transform: translateX for movement, not path recalculation
```

---

## Prompt B — Floating Particles / Orbs

```
Create floating decorative orbs/particles that drift slowly in a section background.

ELEMENTS:
- 8-12 circles of varying sizes (20px to 80px diameter)
- Colors: brand palette at low opacity (10-20%)
- Optional: blur filter on some orbs (filter: blur(20px)) for depth effect

ANIMATION per orb:
- Float path: gentle up-down + slight horizontal drift
- Each orb has unique duration (15-30 seconds) and delay
- Movement distance: 20-40px vertically, 10-20px horizontally
- Opacity pulse: very subtle (0.1 to 0.15 and back)
- Timing: ease-in-out, infinite loop

DISTRIBUTION:
- Randomly positioned across the section (no clustering)
- Larger orbs in background (more blur, slower)
- Smaller orbs in foreground (less blur, slightly faster)

Output as: [SVG with CSS animations / React + Framer Motion / pure CSS]

Performance:
- will-change: transform on each orb
- Use CSS animations (not JS) for ambient motion
- Pause when section is off-screen (IntersectionObserver)
```

---

## Prompt C — Orbiting Elements

```
Create elements that orbit around a central object (logo, icon, or stat number).

CENTER: [e.g., "Large stat number: 2.96x" or "Brand logo"]

ORBITING ELEMENTS:
- 4-6 small icons or dots
- Orbit radius: 120px from center
- Each element at evenly spaced angles

ANIMATION:
- Continuous rotation around center (20 second full orbit)
- Elements maintain upright orientation (counter-rotate as they orbit)
- Orbit path is slightly elliptical (not perfect circle) for natural feel
- Speed variation: slight ease at top and bottom of orbit

Output as: [CSS transform-origin + rotate / SVG + animateTransform / React]
```

---

## Prompt D — Animated Section Divider

```
Create an animated SVG divider between page sections.

OPTIONS (pick one):
A) Wave divider: subtle wave that gently undulates
B) Diagonal line: with moving gradient (shimmer effect)
C) Dot pattern: dots that ripple outward from center
D) Line with traveling dot: horizontal line with a glowing dot that moves along it

SPECIFICATIONS:
- Full width, 40-60px height
- Color: brand accent at low opacity
- Animation: very slow, subtle (never distracting from content)
- Responsive: adapts to container width

Output as: [SVG inline / CSS background / React component]
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Background animation is distracting | Keep opacity below 20%, movement slow (10s+ cycles) |
| Too many animated elements | Max 12 particles — more causes performance issues |
| Not pausing off-screen | Use IntersectionObserver to pause when not visible |
| Heavy blur filters | Limit to 2-3 blurred elements — blur is expensive |
