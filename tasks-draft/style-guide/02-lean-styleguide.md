# Lean Canvas — Layout & Wireframe Reference

**Updated:** 2026-02-11 | **Version:** 2.0
**Source of truth:** `lean-style-guide.md` (design tokens) + `src/index.css` (implementation)

---

## Layout Overview

**Route:** `/lean-canvas-v2`
**Grid:** 3-column responsive (11 sections)
**Max Width:** 1400px (Tailwind `2xl` container)
**Background:** `hsl(40 20% 98%)` / `#FBFAF9` (warm off-white)
**Design:** Premium consulting aesthetic — Playfair Display + Inter

---

## Desktop Wireframe (>=1024px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                  bg: card (#FFF) | border-b: border       │
│ ← Back to Dashboard          LEAN CANVAS                          Progress: 40%    User · Exit  │
│                              font-display, foreground              color: primary                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3-COLUMN GRID                                    gap: 2rem (32px) | max-w: 1400px               │
│                                                                                                  │
│ COLUMN 1 (Problem)          COLUMN 2 (Solution)         COLUMN 3 (Market)                       │
│                                                                                                  │
│ ┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐                     │
│ │ [1] PROBLEM      │       │ [2] SOLUTION     │        │ [3] CUSTOMER     │                     │
│ │ canvas-card      │       │ canvas-card      │        │     SEGMENTS     │                     │
│ │ bg: card (#FFF)  │       │ bg: card (#FFF)  │        │ canvas-card      │                     │
│ │ border: border   │       │ border: border   │        │ bg: card (#FFF)  │                     │
│ │ p-6 lg:p-8       │       │ p-6 lg:p-8       │        │ p-6 lg:p-8       │                     │
│ └──────────────────┘       └──────────────────┘        └──────────────────┘                     │
│                                                                                                  │
│ ┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐                     │
│ │ [4] EXISTING     │       │ [5] UVP          │        │ [6] EARLY        │                     │
│ │     ALTERNATIVES │       │ canvas-card-     │        │     ADOPTERS     │                     │
│ │ canvas-card      │       │ featured         │        │ canvas-card      │                     │
│ │                  │       │ bg: bg-secondary │        │                  │                     │
│ │                  │       │ border-2         │        │                  │                     │
│ └──────────────────┘       └──────────────────┘        └──────────────────┘                     │
│                                                                                                  │
│ ┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐                     │
│ │ [7] KEY METRICS  │       │ [8] UNFAIR       │        │ [9] COST         │                     │
│ │ canvas-card      │       │     ADVANTAGE    │        │     STRUCTURE    │                     │
│ │                  │       │ canvas-card      │        │ canvas-card      │                     │
│ └──────────────────┘       └──────────────────┘        └──────────────────┘                     │
│                                                                                                  │
│                            ┌──────────────────┐        ┌──────────────────┐                     │
│                            │ [10] CHANNELS    │        │ [11] REVENUE     │                     │
│                            │ canvas-card      │        │      STREAMS     │                     │
│                            │                  │        │ canvas-card      │                     │
│                            └──────────────────┘        └──────────────────┘                     │
│                                                                                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ canvas-action-bar                                                                            │ │
│ │ "Ready to validate?"                              [Save Draft]  [Export Canvas]              │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Column Strategy:**
- Column 1 (Problem side): Problem → Existing Alternatives → Key Metrics
- Column 2 (Solution side): Solution → UVP → Unfair Advantage → Channels
- Column 3 (Market side): Customer Segments → Early Adopters → Cost → Revenue

---

## Mobile Wireframe (<1024px)

```
┌────────────────────────────────────┐
│ HEADER                             │
│ bg: card, backdrop-blur-sm         │
│ sticky top-0 z-20                  │
│ ☰  LEAN CANVAS          [40%]     │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ SINGLE COLUMN STACK                │
│ bg: background (#FBFAF9)           │
│ gap: 1.5rem (24px)                 │
│ p-4                                │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ [1] PROBLEM                    │ │
│ │ canvas-card p-6                │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ [2] SOLUTION                   │ │
│ └────────────────────────────────┘ │
│                                    │
│ ... (9 more cards stacked)         │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ canvas-action-bar              │ │
│ │ flex-col on mobile             │ │
│ │ [Save Draft]                   │ │
│ │ [Export Canvas]                │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

---

## Card Anatomy

```
┌─────────────────────────────────┐  ← canvas-card: rounded-xl border border-border
│ p-6 lg:p-8                      │
│                                  │
│  Title ─────────── ○ badge      │  ← font-display text-xl lg:text-2xl foreground
│  ↓ 8px                          │     completion-badge (20px circle)
│  Guidance text                   │  ← font-body text-sm muted-foreground
│  ↓ 16px                         │
│  ┌─────────────────────────┐    │
│  │ canvas-textarea          │    │  ← bg-muted/50 border-border rounded-lg
│  │ min-h varies by rows     │    │     text-sm foreground
│  │                          │    │     focus: bg-card border-primary + ring
│  │ Placeholder...           │    │     placeholder: muted-foreground/60
│  └─────────────────────────┘    │
│                                  │
└─────────────────────────────────┘
```

### UVP Card (Featured)
Same anatomy but uses `canvas-card-featured`:
- `border-2` (double thickness)
- `bg-background-secondary` (#F6F5F3) instead of white
- Completion badge: `completion-badge-featured` (solid primary bg, white icon)

---

## Interactive States

### Card States
| State | Border | Background | Shadow |
|-------|--------|------------|--------|
| Default | `border` (#E5E2DC) | `card` (#FFF) | none |
| Hover | `border/80` | `card` (#FFF) | none |
| Focus-within | `primary` (#0E6249) | `card` (#FFF) | `0 10px 25px hsl(primary/0.05)` |
| Completed | `border` (#E5E2DC) | `card` (#FFF) | none + badge visible |

### Input States
| State | Border | Background | Text |
|-------|--------|------------|------|
| Empty | `border` (#E5E2DC) | `muted/50` (#EFEEEB half) | placeholder: `muted-foreground/60` |
| Focus | `primary` (#0E6249) | `card` (#FFF) | `foreground` (#181D25) |
| Filled | `border` (#E5E2DC) | `card` (#FFF) | `foreground` (#181D25) |

### Button States
| Button | Default BG | Hover BG | Text |
|--------|-----------|----------|------|
| Primary | `primary` (#0E6249) | darker shade | `primary-foreground` (#FFF) |
| Secondary | `secondary` (#F4F3F1) | `border` (#E5E2DC) | `secondary-foreground` (#363D49) |

---

## Spacing Quick Reference

| Element | Value |
|---------|-------|
| Page background | `background` (#FBFAF9) |
| Grid gap (desktop) | `2rem` (32px) |
| Grid gap (mobile) | `1.5rem` (24px) |
| Card padding (mobile) | `1.5rem` (24px) |
| Card padding (desktop) | `2rem` (32px) |
| Container max-width | 1400px |
| Container padding | `2rem` (32px) |
| Action bar margin-top | `3rem` (48px) |

---

## Component Structure

```
LeanCanvasV2Page
├─ Header (sticky, backdrop-blur-sm)
│  ├─ BackLink
│  ├─ Title (font-display)
│  └─ ProgressBar (primary fill, border bg)
│
├─ CanvasGrid (grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8)
│  ├─ CanvasCard (Section 1–4, 6–11): canvas-card
│  └─ CanvasCard (Section 5 UVP): canvas-card-featured
│
└─ ActionBar (canvas-action-bar)
   ├─ CTA Text (font-display + body-md)
   └─ Buttons (secondary + primary)
```

---

**Color reference:** See `lean-style-guide.md` for complete token table.
**Implementation:** `src/index.css` lines 327–393 (canvas component classes).
