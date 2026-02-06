# Orbital Loop Architecture — Visual Specification

> **Component:** `src/components/marketing/HubSection.tsx`  
> **Status:** Implemented  
> **Last Updated:** 2026-02-06

---

## Overview

The Orbital Loop Architecture is a minimal, calm architectural diagram representing StartupAI's core system with 5 interconnected phases arranged in a continuous orbital flow.

---

## Geometry Specification

```
┌─────────────────────────────────────────┐
│                                         │
│     Container: 560×560px (desktop)      │
│                                         │
│         ┌───────────────────┐           │
│         │                   │           │
│         │   Orbital Ring    │           │
│         │   r = 200px       │           │
│         │                   │           │
│         │   ┌─────────┐     │           │
│         │   │  Core   │     │           │
│         │   │ 180px ⌀ │     │           │
│         │   └─────────┘     │           │
│         │                   │           │
│         └───────────────────┘           │
│                                         │
│     Node circles: 56px ⌀               │
│     Positioned on orbital ring          │
│                                         │
└─────────────────────────────────────────┘
```

### Desktop Dimensions
| Element | Size | Notes |
|---------|------|-------|
| Container | 560×560px | Fixed square |
| Orbital radius | 200px | Center-to-node-center |
| Core circle | 180px ⌀ | Central hub |
| Node circles | 56px ⌀ | Icon containers |
| Orbital stroke | 1px dashed | 6-6 dash pattern |

### Mobile Dimensions
| Element | Size |
|---------|------|
| Container | 340×340px |
| Orbital radius | 120px |
| Core circle | 110px ⌀ |
| Node circles | 44px ⌀ |
| Orbital stroke | 1px dashed (5-5) |

---

## Node Positioning (Polar Coordinates)

Nodes are positioned using standard mathematical angles:
- **0°** = Right (3 o'clock)
- **90°** = Top (12 o'clock)
- **180°** = Left (9 o'clock)
- **-90°** = Bottom (6 o'clock)

### Node Angles

| Node | Icon | Angle | Position |
|------|------|-------|----------|
| Momentum | `Zap` | 90° | Top (12 o'clock) |
| Foundation | `Layers` | 18° | Right-lower (2 o'clock) |
| Analysis | `TrendingUp` | -54° | Bottom-right (4-5 o'clock) |
| Workflow | `RefreshCw` | -126° | Bottom-left (7-8 o'clock) |
| Scaling | `Network` | 162° | Left-upper (10 o'clock) |

### Positioning Formula

```typescript
// Convert angle to radians
const angleRad = (angleDeg * Math.PI) / 180;

// Calculate node center position
const centerX = containerCenter + radius * Math.cos(angleRad);
const centerY = containerCenter - radius * Math.sin(angleRad); // Y inverted

// Position element (top-left corner)
const left = centerX - nodeSize / 2;
const top = centerY - nodeSize / 2;
```

---

## Visual Wireframe

```
                    ○ MOMENTUM (90°)
                    │
                    │
        ○───────────┼───────────○
     SCALING        │        FOUNDATION
     (162°)         │           (18°)
                    │
           ┌───────────────┐
           │               │
           │   STARTUPAI   │
           │  CORE SYSTEM  │
           │               │
           └───────────────┘
                    │
        ○───────────┼───────────○
     WORKFLOW       │        ANALYSIS
     (-126°)        │          (-54°)
```

---

## Styling

### Core Circle
- Background: `bg-primary` (deep emerald)
- Shadow: `0 20px 60px -15px hsl(var(--primary)/0.4)`
- Typography:
  - Title: `font-display text-xl tracking-[0.2em]`
  - Subtitle: `text-[10px] tracking-[0.15em] uppercase`

### Node Circles
- Background: `bg-card` (white)
- Border: `border border-border` (light gray)
- Hover: `hover:shadow-md hover:border-primary/30`
- Icons: `w-6 h-6 text-primary` with `strokeWidth={1.5}`

### Orbital Ring
- Stroke: `hsl(var(--border))`
- Style: Dashed (`strokeDasharray="6 6"`)
- Opacity: 0.7

### Labels
- Font: `text-[11px] font-medium tracking-[0.08em] uppercase`
- Color: `text-muted-foreground`
- Position: Outside node based on quadrant

---

## Animation

Using `framer-motion`:

1. **Orbital ring**: Path draw animation (1.2s, delay 0.3s)
2. **Core circle**: Scale + fade in (0.6s, delay 0.2s)
3. **Nodes**: Staggered scale + fade (0.5s each, 0.1s stagger)
4. **Footer**: Fade up (0.5s, delay 1s)

---

## Label Positioning Logic

```typescript
const isTop = angleDeg > 45 && angleDeg < 135;
const isBottom = angleDeg < -45 && angleDeg > -135;
const isRight = angleDeg >= -45 && angleDeg <= 45;
const isLeft = angleDeg >= 135 || angleDeg <= -135;

// Apply appropriate class
isTop && "-top-6 left-1/2 -translate-x-1/2"
isBottom && "top-full mt-2 left-1/2 -translate-x-1/2"
isRight && "left-full ml-3 top-1/2 -translate-y-1/2"
isLeft && "right-full mr-3 top-1/2 -translate-y-1/2"
```

---

## Implementation Checklist

- [x] Fixed container dimensions (no percentage-based sizing)
- [x] Polar coordinate positioning
- [x] Perfect center alignment
- [x] Nodes on exact circumference
- [x] Equal angular distribution
- [x] Responsive mobile version
- [x] Smooth entry animations
- [x] Hover states on nodes
- [x] Semantic design tokens

---

## Files

| File | Purpose |
|------|---------|
| `src/components/marketing/HubSection.tsx` | Main component |
| `docs/website/01-orbital-loop-spec.md` | This specification |
