# StartupAI — Design System (Source of Truth)

**Updated:** 2026-02-11 | **Version:** 2.0
**Source:** `src/index.css` + `tailwind.config.ts`
**Fonts:** Google Fonts — Playfair Display + Inter

---

## Color Tokens

All colors defined as HSL in `index.css :root`. Hex equivalents computed for reference.

### Light Mode

#### Primary Brand
| Token | HSL | Hex | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| `--primary` | `162 75% 22%` | `#0E6249` | `primary` | CTAs, focus rings, progress, active borders |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | `primary-foreground` | Text on primary |
| `--ring` | `162 75% 22%` | `#0E6249` | `ring` | Focus ring color |

#### Sage Accent
| Token | HSL | Hex | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| `--sage` | `162 50% 40%` | `#33997A` | `sage` | Success badges, eyebrow-dark text, icon containers |
| `--sage-light` | `162 30% 95%` | `#EEF6F4` | `sage-light` | Completion badge bg, icon container bg |
| `--sage-foreground` | `162 60% 18%` | `#124939` | `sage-foreground` | Dark sage for emphasis |

#### Backgrounds
| Token | HSL | Hex | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| `--background` | `40 20% 98%` | `#FBFAF9` | `background` | Main page background (warm off-white) |
| `--background-secondary` | `40 15% 96%` | `#F6F5F3` | — | Alternate sections, featured card bg |
| `--card` | `0 0% 100%` | `#FFFFFF` | `card` | Card surfaces, panels |
| `--secondary` | `40 10% 95%` | `#F4F3F1` | `secondary` | Secondary button bg |
| `--muted` | `40 10% 93%` | `#EFEEEB` | `muted` | Muted areas, textarea default bg |
| `--accent` | `150 30% 95%` | `#EEF6F2` | `accent` | Sage-tinted light bg |
| `--warm` | `40 30% 95%` | `#F6F4EE` | `warm` | Warm highlight sections |

#### Text Hierarchy
| Token | HSL | Hex | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| `--foreground` | `220 20% 12%` | `#181D25` | `foreground` | Headings, primary body text |
| `--card-foreground` | `220 20% 12%` | `#181D25` | `card-foreground` | Text on cards |
| `--secondary-foreground` | `220 15% 25%` | `#363D49` | `secondary-foreground` | Secondary button text |
| `--muted-foreground` | `220 10% 45%` | `#676F7E` | `muted-foreground` | Labels, descriptions, placeholders |
| `--warm-foreground` | `40 40% 30%` | `#6B572E` | `warm-foreground` | Warm accent text |

#### Borders & Inputs
| Token | HSL | Hex | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| `--border` | `40 15% 88%` | `#E5E2DC` | `border` | Card borders, dividers (warm gray) |
| `--input` | `40 15% 88%` | `#E5E2DC` | `input` | Input field borders |

#### Dark Sections
| Token | HSL | Hex | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| `--dark` | `220 20% 12%` | `#181D25` | `dark` | Dark section backgrounds |
| `--dark-foreground` | `40 15% 95%` | `#F4F3F0` | `dark-foreground` | Text on dark sections |

#### Destructive
| Token | HSL | Hex | Tailwind | Usage |
|-------|-----|-----|----------|-------|
| `--destructive` | `0 72% 51%` | `#DC2828` | `destructive` | Error states, delete actions |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | `destructive-foreground` | Text on destructive |

#### Sidebar
| Token | HSL | Hex | Tailwind |
|-------|-----|-----|----------|
| `--sidebar-background` | `40 20% 97%` | `#F9F8F6` | `sidebar` |
| `--sidebar-foreground` | `220 15% 30%` | `#414958` | `sidebar-foreground` |
| `--sidebar-primary` | `162 75% 22%` | `#0E6249` | `sidebar-primary` |
| `--sidebar-border` | `40 15% 90%` | `#E9E7E2` | `sidebar-border` |

#### AI Panel
| Token | HSL | Hex | Tailwind |
|-------|-----|-----|----------|
| `--ai-background` | `40 15% 97%` | `#F8F8F6` | `ai-background` |
| `--ai-border` | `40 15% 90%` | `#E9E7E2` | `ai-border` |
| `--ai-accent` | `162 75% 22%` | `#0E6249` | `ai-accent` |

---

## Typography

### Font Families
| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `--font-display` | `'Playfair Display', Georgia, serif` | `font-display` |
| `--font-body` | `'Inter', system-ui, sans-serif` | `font-body` |

- **Headings** (`h1`–`h6`): `font-display` + `font-medium tracking-tight`
- **Body**: `font-body` (applied to `<body>`)
- **Google Fonts import:** Inter (300–700) + Playfair Display (400–700, italic)

### Type Scale (Tailwind classes)
| Element | Mobile | Desktop | Weight | Font |
|---------|--------|---------|--------|------|
| Hero title | `text-4xl` | `text-7xl` | `font-medium` | Display (Playfair) |
| Page title | `text-4xl` | `text-5xl` | `font-medium` | Display |
| Section heading | `text-2xl` | `text-4xl` | `font-medium` | Display |
| Card title | `text-xl` | `text-2xl` | `font-medium` | Display |
| Subtitle | `text-lg` | `text-xl` | `font-normal` | Body (Inter) |
| Body | `text-sm` | `text-sm` | `font-normal` | Body |
| Label | `text-xs` | `text-sm` | `font-medium` | Body |
| Eyebrow | `text-xs` | `text-xs` | `font-medium tracking-[0.2em] uppercase` | Body |

### Utility Classes
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

## Spacing

### Base Radius
`--radius: 0.5rem` (8px)

| Tailwind | Computed | Usage |
|----------|----------|-------|
| `rounded-sm` | 4px | Small elements |
| `rounded-md` | 6px | Inputs |
| `rounded-lg` | 8px | Cards (default) |
| `rounded-xl` | 12px | Prominent cards, canvas cards |
| `rounded-2xl` | 16px | Hero sections |
| `rounded-3xl` | 24px | Large containers |

### Container
- Max width: `1400px` (`2xl` screen)
- Padding: `2rem` (32px)
- Marketing: `max-w-7xl` (1280px) with `px-6 sm:px-8 lg:px-12`

### Responsive Spacing Classes
| Class | Value |
|-------|-------|
| `.p-responsive` | `p-4 sm:p-6 lg:p-8` |
| `.gap-responsive` | `gap-3 sm:gap-4 lg:gap-6` |
| `.section-padding` | `py-20 md:py-28 lg:py-32` |
| `.section-marketing` | `py-24 md:py-32 lg:py-40` |

---

## Shadows

| Token | Value | Tailwind |
|-------|-------|----------|
| `--shadow-sm` | `0 1px 2px 0 hsl(220 20% 12% / 0.03)` | `shadow-premium-sm` |
| `--shadow-md` | `0 4px 6px -1px hsl(220 20% 12% / 0.05), 0 2px 4px -2px ...0.03` | `shadow-premium-md` |
| `--shadow-lg` | `0 10px 15px -3px hsl(220 20% 12% / 0.06), 0 4px 6px -4px ...0.03` | `shadow-premium-lg` |
| `--shadow-xl` | `0 20px 25px -5px hsl(220 20% 12% / 0.08), 0 8px 10px -6px ...0.04` | `shadow-premium-xl` |

All shadows use `foreground` color at very low opacity — subtle, warm-tinted.

---

## Component Classes

### Cards
| Class | Description |
|-------|-------------|
| `.card-premium` | `bg-card rounded-lg border border-border` + `shadow-sm` |
| `.card-elevated` | `bg-white rounded-xl border border-border/50` + `shadow-lg` |
| `.marketing-card` | `bg-card rounded-lg border border-border p-6` — hover: `border-primary/30`, lift -2px |
| `.marketing-card-dark` | `bg-white/5 rounded-lg border border-white/10 p-6` — hover: `border-sage/40` |
| `.quick-action-card` | `bg-card rounded-xl border border-border p-4` — hover: `border-primary/40`, lift -2px, shadow-md |
| `.metric-card` | `bg-card rounded-xl border border-border/50 p-4` + shadow-sm |
| `.insight-card` | `bg-card rounded-xl border border-border/50 p-4` — hover: `border-primary/30` |

### Lean Canvas Components
| Class | Description |
|-------|-------------|
| `.canvas-card` | `bg-card rounded-xl border border-border p-6 lg:p-8` — focus-within: `border-primary` + emerald shadow |
| `.canvas-card-featured` | Same but `border-2 border-border/50` + `bg-background-secondary` — for UVP section |
| `.canvas-textarea` | `bg-muted/50 border border-border rounded-lg text-sm` — focus: `bg-card border-primary` + focus ring |
| `.canvas-action-bar` | `mt-12 p-6 lg:p-8 bg-card rounded-xl border border-border` — flex row on sm+ |
| `.completion-badge` | 20px circle, `bg-sage-light border-primary` + check icon |
| `.completion-badge-featured` | 20px circle, `bg-primary` + white check icon |

### AI Panel
| Class | Description |
|-------|-------------|
| `.ai-panel` | `bg-ai-background border-l border-ai-border` |
| `.ai-panel-card` | `bg-ai-card rounded-xl border border-border/50 p-4` + shadow-sm |

### Glass Effect
| Class | Description |
|-------|-------------|
| `.glass` | `bg-white/80 backdrop-blur-xl border border-white/50` |

---

## Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| `fade-in-up` | 500ms | ease-out | Section entry |
| `fade-in` | 400ms | ease-out | Element appearance |
| `slide-in-right` | 500ms | ease-out | Panel slides |
| `pulse-soft` | 3s | ease-in-out (infinite) | Subtle attention pulse |
| `draw-line` | 1s | ease-out | Timeline connector |
| `accordion-down/up` | 200ms | ease-out | Radix accordion |

### Stagger Delays
`.delay-100` through `.delay-500` (100ms increments)

### Hover Effects
| Class | Effect |
|-------|--------|
| `.hover-lift` | `translateY(-2px)` + `shadow-lg` on hover |
| Card hovers | `translateY(-2px)` + border color change |

---

## Dark Mode

Dark mode activated via `.dark` class on root. Key differences:

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `40 20% 98%` (#FBFAF9) | `220 20% 8%` (#121519) |
| `--foreground` | `220 20% 12%` (#181D25) | `40 15% 95%` (#F4F3F0) |
| `--card` | `0 0% 100%` (#FFFFFF) | `220 18% 10%` (#161A21) |
| `--primary` | `162 75% 22%` (#0E6249) | `162 60% 45%` (#2EB886) |
| `--border` | `40 15% 88%` (#E5E2DC) | `220 15% 18%` (#272D37) |
| `--sage` | `162 50% 40%` (#33997A) | `162 50% 50%` (#40BF99) |

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1400px | Max container |

### Responsive Text Classes
| Class | Value |
|-------|-------|
| `.text-responsive-xs` | `text-xs sm:text-sm` |
| `.text-responsive-sm` | `text-sm sm:text-base` |
| `.text-responsive-base` | `text-base sm:text-lg` |
| `.text-responsive-lg` | `text-lg sm:text-xl md:text-2xl` |
| `.text-responsive-xl` | `text-xl sm:text-2xl md:text-3xl` |
| `.text-responsive-2xl` | `text-2xl sm:text-3xl md:text-4xl lg:text-5xl` |

---

## Mobile Utilities

| Class | Purpose |
|-------|---------|
| `.pb-safe` / `.pt-safe` / `.px-safe` | Safe area insets for notched devices |
| `.touch-target` | Min 44px tap target |
| `.touch-manipulation` | Better scroll behavior |
| `.select-none-touch` | Prevent text selection on interactive |
| `.scroll-smooth-ios` | Momentum scrolling |
| `.scrollbar-hide` | Hidden scrollbar, keeps scroll |

---

## Accessibility

### Contrast Ratios (WCAG AA)
| Combination | Ratio | Status |
|-------------|-------|--------|
| `foreground` (#181D25) on `card` (#FFF) | 16.5:1 | AAA |
| `muted-foreground` (#676F7E) on `card` (#FFF) | 5.3:1 | AA |
| `primary-foreground` (#FFF) on `primary` (#0E6249) | 5.8:1 | AA |
| `sage` (#33997A) on `card` (#FFF) | 3.4:1 | AA Large |

### Focus Indicators
- Ring: `2px hsl(162 75% 22% / 0.1)` — emerald glow
- Border: `border-primary` on focus-within
- Canvas focus shadow: `0 10px 25px hsl(primary / 0.05)`

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .motion-safe { animation: none !important; transition: none !important; }
}
```

---

## Design Principles

1. **Calm Intelligence** — Warm off-white bg, muted palette, generous whitespace
2. **Premium Consulting** — Playfair Display headings, subtle shadows, no bright colors
3. **Trust & Clarity** — High contrast text, obvious focus states, structured hierarchy
4. **No Forbidden Colors** — No blues, purples, reds (except destructive), or bright yellows in the brand palette

---

**Source files:** `src/index.css` (lines 1–530) + `tailwind.config.ts` (lines 1–139)
