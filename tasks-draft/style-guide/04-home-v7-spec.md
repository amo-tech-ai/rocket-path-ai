# Homepage — Marketing Design Spec

**Updated:** 2026-02-11 | **Version:** 2.0
**Source of truth:** `lean-style-guide.md` (tokens) + `src/index.css` (classes)
**Design:** Same visual system as Lean Canvas — seamless product-to-marketing continuity

---

## Overview

The homepage applies the Lean Canvas visual system to create a premium consulting-style marketing page. Same tokens, same fonts, same aesthetic.

---

## Marketing-Specific Classes

All defined in `src/index.css`:

### Section Layout
| Class | Definition |
|-------|-----------|
| `.section-marketing` | `py-24 md:py-32 lg:py-40` |
| `.section-marketing-dark` | Same padding + `bg-dark text-dark-foreground` |
| `.container-marketing` | `max-w-7xl mx-auto px-6 sm:px-8 lg:px-12` |

### Cards
| Class | Definition |
|-------|-----------|
| `.marketing-card` | `bg-card rounded-lg border border-border p-6` — hover: `border-primary/30` + lift |
| `.marketing-card-dark` | `bg-white/5 rounded-lg border border-white/10 p-6` — hover: `border-sage/40` + lift |
| `.icon-container` | `w-12 h-12 rounded-xl bg-sage-light` centered |
| `.icon-container-dark` | `w-12 h-12 rounded-xl bg-sage/20` centered |

### Typography
| Class | Definition |
|-------|-----------|
| `.headline-xl` | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1]` |
| `.headline-lg` | `text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight` |
| `.headline-md` | `text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight` |
| `.body-lg` | `text-lg md:text-xl text-muted-foreground leading-relaxed font-body` |
| `.body-md` | `text-base text-muted-foreground leading-relaxed font-body` |
| `.eyebrow` | `text-xs font-medium tracking-[0.2em] uppercase text-primary mb-4` |
| `.eyebrow-dark` | `text-xs font-medium tracking-[0.2em] uppercase text-sage mb-4` |

---

## Color Application

### Light Sections
- Background: `background` (#FBFAF9)
- Cards: `card` (#FFF) with `border` (#E5E2DC)
- Headings: `foreground` (#181D25) in Playfair Display
- Body: `muted-foreground` (#676F7E) in Inter
- CTAs: `primary` (#0E6249) bg, white text
- Icons: `sage-light` (#EEF6F4) container, `primary` icon

### Dark Sections
- Background: `dark` (#181D25)
- Text: `dark-foreground` (#F4F3F0)
- Cards: `bg-white/5 border-white/10`
- Accents: `sage` (#33997A) for eyebrows, badges
- Icons: `sage/20` container

---

## Section Pattern

```
┌──────────────────────────────────────────────────┐
│ section-marketing (or section-marketing-dark)    │
│ ┌──────────────────────────────────────────────┐ │
│ │ container-marketing (max-w-7xl)              │ │
│ │                                              │ │
│ │  .eyebrow "FEATURE CATEGORY"                 │ │
│ │  .headline-lg "Main Headline"                │ │
│ │  .body-lg "Description text..."              │ │
│ │                                              │ │
│ │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│ │  │ card     │ │ card     │ │ card     │    │ │
│ │  │ icon-    │ │ icon-    │ │ icon-    │    │ │
│ │  │ container│ │ container│ │ container│    │ │
│ │  │ title    │ │ title    │ │ title    │    │ │
│ │  │ body     │ │ body     │ │ body     │    │ │
│ │  └──────────┘ └──────────┘ └──────────┘    │ │
│ │                                              │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## Design Continuity

The homepage uses the **exact same design tokens** as the product:
- Same `primary` emerald (#0E6249)
- Same Playfair Display + Inter fonts
- Same warm off-white backgrounds
- Same card/border styling
- Same shadow system

This ensures **zero visual transition** between marketing and product.

---

**Token reference:** `lean-style-guide.md`
