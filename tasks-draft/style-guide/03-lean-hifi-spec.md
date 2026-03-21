# Lean Canvas — High-Fidelity Implementation Spec

**Updated:** 2026-02-11 | **Version:** 2.0
**Source of truth:** `lean-style-guide.md` (tokens) + `src/index.css` (classes)
**Route:** `/lean-canvas-v2`

---

## Design Philosophy

**Audience:** Serious founders, operators, accelerators. Think McKinsey deck, not Dribbble.

**Principles:**
1. **Calm** — Generous whitespace, muted palette, no aggressive colors
2. **Intelligent** — Structured thinking, clear hierarchy, strategic focus
3. **Premium** — Refined typography, subtle interactions, consulting-grade
4. **Trustworthy** — Professional, enterprise-grade feel

---

## Implementation Components

### 1. Header (Sticky)

```tsx
<header className="sticky top-0 z-20 border-b backdrop-blur-sm bg-card/80">
  <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4">
    {/* Logo, Progress, Actions */}
  </div>
</header>
```

- **Background:** `bg-card/80` with `backdrop-blur-sm`
- **Border:** `border-b border-border`
- **Height:** Auto (py-4 = ~72px with content)
- **Max Width:** 1400px
- **Logo:** 32px rounded-lg, `bg-primary`

**Progress Bar:**
- Width: 128px, Height: 6px
- Track: `bg-border`, Fill: `bg-primary`
- Label: `text-xs text-muted-foreground`
- Value: `text-sm font-medium`

---

### 2. Page Title

- **Back Link:** `text-sm text-muted-foreground` → hover: `text-primary`
- **Title:** `headline-lg` (font-display, text-3xl sm:text-4xl md:text-5xl)
- **Subtitle:** `body-lg` (text-lg md:text-xl text-muted-foreground)
- **Spacing:** Title section mb-12

---

### 3. Canvas Grid

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1400px] mx-auto">
  {/* 11 CanvasCard components */}
</div>
```

**Desktop:** 3 columns, 32px gap
**Mobile:** 1 column, 24px gap

---

### 4. Canvas Card (Standard)

Uses `.canvas-card` class from `index.css`:

```css
.canvas-card {
  bg-card rounded-xl border border-border p-6 lg:p-8 transition-all duration-300;
}
.canvas-card:hover { border-color: hsl(var(--border) / 0.8); }
.canvas-card:focus-within { border-primary; shadow: 0 10px 25px hsl(primary/0.05); }
```

**Card Header:**
- Title: `font-display text-xl lg:text-2xl text-foreground`
- Guidance: `font-body text-sm text-muted-foreground leading-relaxed`
- Badge: `.completion-badge` (20px, sage-light bg, primary border)

**Card Body (Textarea):**
Uses `.canvas-textarea`:

```css
.canvas-textarea {
  w-full p-3 bg-muted/50 border border-border rounded-lg text-sm;
  color: foreground;
}
.canvas-textarea::placeholder { muted-foreground/60; }
.canvas-textarea:focus { bg-card border-primary; ring: 2px primary/0.1; }
```

---

### 5. UVP Card (Featured)

Uses `.canvas-card-featured`:

```css
.canvas-card-featured {
  bg-background-secondary rounded-xl border-2 border-border/50 p-6 lg:p-8;
}
.canvas-card-featured:focus-within { border-primary; shadow; }
```

Badge: `.completion-badge-featured` (solid primary bg, white icon)

---

### 6. Action Bar

Uses `.canvas-action-bar`:

```css
.canvas-action-bar {
  mt-12 p-6 lg:p-8 bg-card rounded-xl border border-border;
  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4;
}
```

**Buttons:**
- Secondary: `bg-secondary text-secondary-foreground` → hover: darken
- Primary: `bg-primary text-primary-foreground` → hover: darken
- Padding: `px-6 py-3`, radius: `rounded-lg`
- Icon: 16px, gap-2

---

### 7. Completion Badge

**Standard:**
```css
.completion-badge {
  w-5 h-5 rounded-full bg-sage-light border border-primary;
  /* Check icon: w-3 h-3 text-primary */
}
```

**Featured (UVP):**
```css
.completion-badge-featured {
  w-5 h-5 rounded-full bg-primary;
  /* Check icon: w-3 h-3 text-primary-foreground */
}
```

**Animation:** `opacity 0→1, scale 0→1` on 300ms with bounce easing.

---

## Micro-Interactions

### Card Focus
```css
transition: border-color 200ms ease, box-shadow 300ms ease;
/* focus-within: border-primary + shadow 0 10px 25px hsl(primary/0.05) */
```

### Progress Bar
```css
.progress-fill {
  transition: width 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Hover Lift
Cards use `translateY(-2px)` on hover (via `.hover-lift` utility).

---

## Responsive Behavior

| Breakpoint | Grid | Gap | Card Padding | Container Padding |
|------------|------|-----|-------------|-------------------|
| < 640px | 1 col | 24px | 24px | 16px |
| 640–1023px | 1 col | 24px | 24px | 24px |
| >= 1024px | 3 col | 32px | 32px | 48px |

### Typography Scaling
| Element | Mobile | Desktop |
|---------|--------|---------|
| Page Title | text-3xl | text-5xl |
| Card Title | text-xl | text-2xl |
| Subtitle | text-lg | text-xl |
| Body/Input | text-sm | text-sm |

---

## Accessibility

### Contrast (WCAG AA)
| Pair | Ratio | Status |
|------|-------|--------|
| `foreground` on `card` | 16.5:1 | AAA |
| `muted-foreground` on `card` | 5.3:1 | AA |
| `primary-foreground` on `primary` | 5.8:1 | AA |

### Keyboard Navigation
1. Header actions
2. Back link
3. Canvas cards (top→bottom, left→right)
4. Action bar buttons

### Screen Reader
```html
<div role="region" aria-labelledby="problem-title">
  <h2 id="problem-title">Problem</h2>
  <p id="problem-guidance">List the top 1-3 problems...</p>
  <textarea aria-labelledby="problem-title" aria-describedby="problem-guidance" />
</div>
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .motion-safe { animation: none !important; transition: none !important; }
}
```

---

## Performance

- Memoize canvas cards: `React.memo(CanvasCard)`
- Debounce auto-save: 500ms
- No images — SVG icons only (lucide-react)
- GPU-only animations (transform, opacity)
- Max 3 simultaneous animations

---

## File Structure

```
src/pages/LeanCanvasV2.tsx        # Main page component
src/components/canvas/            # Canvas-specific components (future)
src/index.css                     # Canvas classes (lines 327–393)
tailwind.config.ts                # Token definitions
```

---

**Token reference:** `lean-style-guide.md`
**Layout reference:** `02-lean-styleguide.md`
