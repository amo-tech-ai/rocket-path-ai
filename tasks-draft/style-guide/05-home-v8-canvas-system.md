# Homepage V8 — Canvas Visual System Application

**Updated:** 2026-02-11 | **Version:** 2.0
**Source of truth:** `lean-style-guide.md`

---

## Core Principle

> "The homepage should feel like part of the product, not a separate marketing site."

V8 applies the **Lean Canvas visual system** to the homepage — same tokens, components, and tone. Users feel immediate familiarity when entering the product.

---

## Why This Matters

- **Continuity** — No jarring transition from marketing to app
- **Trust** — Signals a serious strategy system, not another SaaS
- **Unity** — One visual language, one source of truth
- **Positioning** — Differentiates from typical SaaS landing pages

---

## Shared Visual System

### From Lean Canvas (identical tokens)

| Element | Token | Value |
|---------|-------|-------|
| Page BG | `--background` | `hsl(40 20% 98%)` = #FBFAF9 |
| Card BG | `--card` | `hsl(0 0% 100%)` = #FFFFFF |
| Primary | `--primary` | `hsl(162 75% 22%)` = #0E6249 |
| Text | `--foreground` | `hsl(220 20% 12%)` = #181D25 |
| Border | `--border` | `hsl(40 15% 88%)` = #E5E2DC |
| Display Font | `--font-display` | Playfair Display |
| Body Font | `--font-body` | Inter |

### Shared Component Classes

Used identically on homepage and in product:

| Class | Usage |
|-------|-------|
| `.card-premium` | Dashboard cards, feature cards |
| `.marketing-card` | Homepage feature grid |
| `.eyebrow` | Section labels |
| `.headline-xl/lg/md` | Page/section headings |
| `.body-lg/md` | Description text |
| `.hover-lift` | Interactive card hover |
| `.glass` | Overlay panels |

---

## Homepage-Specific Patterns

### Hero Section
```
bg: background (#FBFAF9)
headline-xl: "From idea to execution."
body-lg: Subtitle description
CTA: bg-primary text-primary-foreground rounded-lg px-8 py-4
```

### Feature Grid
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
Each: marketing-card with icon-container + headline + body
```

### Dark Section
```
section-marketing-dark (bg: dark #181D25)
eyebrow-dark (text: sage #33997A)
marketing-card-dark (bg: white/5 border: white/10)
icon-container-dark (bg: sage/20)
```

### Social Proof
```
bg: background-secondary (#F6F5F3)
card-premium for testimonial cards
text-foreground for quotes
text-muted-foreground for attribution
```

---

## Transition Points

Where marketing meets product — ensure visual consistency:

| From (Marketing) | To (Product) | Shared Elements |
|-------------------|-------------|-----------------|
| Homepage hero | Dashboard | background color, font-display headings |
| Feature cards | Product cards | card-premium, border, shadow-sm |
| CTA buttons | Action buttons | primary color, rounded-lg |
| Dark sections | Sidebar | dark/dark-foreground tokens |

---

**Full token reference:** `lean-style-guide.md`
**Layout reference:** `02-lean-styleguide.md`
**Implementation spec:** `03-lean-hifi-spec.md`
