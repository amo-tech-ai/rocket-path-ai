# Executive-Level Infographic Style Guide

> **Source:** `src/components/blog/reports/FashionAiReport.tsx` (1658 lines)
> **Date:** 2026-02-15
> **Aesthetic:** McKinsey x Fashion House — luxury editorial infographic

---

## 1. Design Philosophy

### Core Aesthetic
The report follows a **luxury editorial** aesthetic — the visual language of McKinsey whitepapers crossed with high-fashion lookbooks. Every section is designed as a standalone "slide" that communicates one strategic idea through data, typography, and restrained color.

### Visual Hierarchy Principles
1. **One idea per section.** Each slide (section) communicates exactly one strategic concept. The hero says "this industry is massive and AI is reshaping it." The strategic forces slide says "four converging pressures make AI inevitable." Never two arguments in one section.
2. **Data leads, prose follows.** The first thing the eye hits is always a number — `$89B`, `40.8%`, `71%`. The explanation comes after. Numbers are rendered at `clamp(3rem, 5vw, 4.5rem)` in `font-display` (Playfair Display). Prose is `text-sm` or `text-base` in Inter.
3. **Whitespace is structural.** Sections use `py-20 md:py-28` to `py-24 md:py-32` — roughly 80–128px of breathing room. Inside sections, spacing follows a `mt-14` → `mt-16` rhythm. This isn't decorative — it creates the "one page per idea" cadence.
4. **Tension through contrast.** Light ivory sections (`#F1EEEA`) alternate with deep green dark panels (`#12211D`). This rhythm prevents visual fatigue across 10+ sections and creates natural "chapter breaks."
5. **Everything earns its place.** No decorative elements exist without data purpose. Gradient underlines mark key thresholds. Dot endpoints on bar charts highlight the most important value. Circle nodes in flow diagrams encode relationships. If it doesn't communicate data, it doesn't exist.

### Tone
**Quiet authority.** The design never shouts. It uses scale (big numbers), contrast (dark panels), and motion (scroll-triggered reveals) instead of bold colors, gradients, or visual noise. The palette is muted — FOREST green, SLATE gray, IVORY white — with LAVENDER and CORAL reserved for singular emphasis moments.

---

## 2. Layout System

### Container
- **Class:** `container-premium` → `max-w-7xl` with responsive horizontal padding (`px-4 sm:px-6 lg:px-8`)
- **Narrowed content:** Hero text and thesis paragraphs use `max-w-3xl mx-auto` or `max-w-2xl` or `max-w-md` to control line length

### Grid System
| Pattern | Tailwind | Usage |
|---------|----------|-------|
| Hero split | `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16` | Hero section: editorial text left, chart right |
| 4-card feature | `grid sm:grid-cols-2 lg:grid-cols-4 gap-6` | Strategic forces, ecosystem clusters, growth segments |
| 2-card row | `grid sm:grid-cols-2 gap-x-16 gap-y-14` | Inflection point metrics (2x2) |
| 3-stat row | `grid sm:grid-cols-3 gap-6` | Gen Z stats, future vision KPIs |
| 2-col dark panel | `grid md:grid-cols-2 gap-10 items-start` | Dark insight panels (bullet list + thesis) |
| 8-node process | `hidden lg:flex items-start gap-0` | Value chain (desktop), `grid-cols-4` (tablet), `space-y-3` (mobile) |

### Section Padding Scale
| Section Type | Padding | Pixel Equivalent |
|-------------|---------|-----------------|
| Standard section | `py-24 md:py-32` | 96px → 128px |
| Compact section | `py-20 md:py-28` | 80px → 112px |
| Hero section | `py-24 md:py-32` (inside container) | 96px → 128px |
| Dark panel (inside section) | `p-8 md:p-10` or `p-8 md:p-12` | 32px → 40px/48px |

### Card Padding
| Card Type | Padding | Context |
|-----------|---------|---------|
| Feature card (strategic forces) | `p-7` | 4-up grid |
| Process node (value chain) | `p-5` | 8-up horizontal flow |
| Cluster card | `p-6` | 4-up ecosystem grid |
| Value proposition card | `p-6` | 4-up with bullet lists |
| Growth segment card | `p-7` | 4-up dark background |

### Responsive Breakpoints
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Single column. Value chain stacks vertically with `borderLeft` accent instead of `borderTop`. Process flow uses `x: -12` entrance instead of `y: 16`. |
| Tablet sm (640px+) | 2-col grids activate. Value chain uses `grid-cols-4` (2x4). |
| Tablet (768px+) | Dark panels switch to 2-col. Chart container gets `p-10`. |
| Desktop (1024px+) | Full layouts. Hero splits to 2-col. Value chain shows horizontal 8-node flow. Section watermarks appear (`lg:block`). |
| Wide (1280px+) | Hero title reaches `xl:text-[5rem]`. Generous spacing maintained by `max-w-7xl` container. |

---

## 3. Typography System

### Font Families
| Role | Font | Tailwind | Usage |
|------|------|----------|-------|
| Display | Playfair Display | `font-display` | Headlines, big numbers, hero titles, callout statistics |
| Body | Inter | `font-body` | Prose, labels, descriptions, meta text |

### Type Scale
| Element | Classes | Responsive | Weight | Color |
|---------|---------|------------|--------|-------|
| Hero H1 | `text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem]` | 5 breakpoint sizes | `font-medium` (500) | `TEXT_PRIMARY` (#212427) |
| Section H2 | `text-3xl md:text-4xl lg:text-5xl` | 3 sizes | `font-medium` | `TEXT_PRIMARY` |
| Section eyebrow | `text-xs tracking-[0.25em] uppercase` | Fixed | `font-medium` | `FOREST` or `INDIGO` or `CORAL` |
| Hero stat value | `text-3xl md:text-4xl` | 2 sizes | `font-medium` | `FOREST` |
| Card stat (big number) | `clamp(3rem, 5vw, 4.5rem)` via inline style | Fluid | `font-medium` | Accent color per card |
| Card title | `text-sm tracking-[0.12em] uppercase` | Fixed | `font-semibold` (600) | `TEXT_PRIMARY` |
| Body/description | `text-base md:text-lg leading-relaxed` | 2 sizes | `font-normal` (400) | `SLATE` |
| Card body | `text-sm leading-relaxed` | Fixed | `font-normal` | `SLATE` |
| Stat label | `text-xs tracking-wider uppercase` | Fixed | `font-normal` | `SLATE` |
| Chart axis labels | `fontSize="9"` (SVG) | Fixed | — | `#AEB5C2` |
| Process step number | `text-[10px] tracking-[0.15em] uppercase` | Fixed | `font-medium` | Accent color |
| Tiny meta text | `text-[10px]` or `text-[11px]` or `text-[9px]` | Fixed | — | `SLATE` or `#AEB5C2` |

### Typography Rules
- **Tracking:** Eyebrows use `tracking-[0.25em]` or `tracking-[0.2em]` — extremely wide. Labels use `tracking-[0.12em]` or `tracking-wider`. Body text uses default tracking.
- **Line height:** Body text always uses `leading-relaxed`. Headlines use `leading-[1.06]` for tight stacking. Card text uses `leading-snug`.
- **Numeric display:** Big numbers use `fontVariantNumeric: "tabular-nums"` for alignment in grids.
- **Fluid sizing:** Hero H1 and big stat numbers use `clamp()` via inline styles for smooth scaling between breakpoints without jumps.
- **Highlight spans:** Inside dark panels, key phrases wrap in `<span style={{ color: LAVENDER }}>` for editorial emphasis. On light backgrounds, `<span style={{ color: FOREST }}>` or `<span style={{ color: INDIGO }}>` serves the same role.

---

## 4. Color System for Data

### Base Palette
| Token | Hex | Role |
|-------|-----|------|
| `IVORY` | `#F1EEEA` | Page canvas — warm off-white background for all light sections |
| `DEEP_GREEN` | `#12211D` | Dark panel backgrounds — used for insight panels and full dark sections |
| `FOREST` | `#0E3E1B` | Primary accent — eyebrows, stat highlights, active timeline nodes, bar fills, positive indicators |
| `TEAL` | `#2A4E45` | Secondary accent — card borders, mid-intensity heat map, thesis tags |
| `SLATE` | `#697485` | Neutral — body text on ivory, chart gridlines, secondary labels, flow connectors |
| `LAVENDER` | `#CB9FD2` | Highlight — emphasis spans in dark panels, chart endpoint dots, consumer force accent |
| `CORAL` | `#FFC9C1` | Alert/emphasis — discount threshold dot, talent force accent, resale segment |
| `TEXT_PRIMARY` | `#212427` | Headlines — near-black for maximum readability on ivory |
| `INDIGO` | `#6366F1` | Section accent — inflection point eyebrow, gradient underline start |

### Card Surface Color
| Surface | Value | Context |
|---------|-------|---------|
| Elevated card on ivory | `#FAFAF8` | Feature cards, process nodes, cluster cards — slightly warmer than white |
| Dark section card | `rgba(255,255,255,0.04)` | Growth segment cards on `DEEP_GREEN` background |

### Semantic Color Assignment (Data Visualization)
| Data Meaning | Color Used | Example |
|-------------|------------|---------|
| Positive/growth indicator | `FOREST` (#0E3E1B) | AI growth line in chart, "AI-Optimized" column, lift badges |
| Baseline/comparison | `SLATE` (#697485) with opacity | Fashion market line (dashed), "Before AI" column |
| Critical threshold crossed | `CORAL` (#FFC9C1) | Endpoint dot on 66% discount bar |
| Emphasis in dark context | `LAVENDER` (#CB9FD2) | Chart endpoint highlight dot, "by 2035" label |
| Heat map intensity scale | `${SLATE}30` → `${TEAL}80` → `TEAL` → `FOREST` | 4-level value creation intensity |
| Strategic force per-card | Unique accent per card | Technology=FOREST, Consumers=LAVENDER, Competitors=TEAL, Talent=CORAL |
| Chart gridlines | `rgba(255,255,255,0.06)` | SVG grid lines on dark chart background |
| Opacity-based hierarchy | `${FOREST}06`, `${FOREST}08`, `${SLATE}12`, `${SLATE}18` | Watermark, background tint, track fill, divider |

### Dark vs Light Context Rules
| Context | Background | Text | Accent | Muted Text |
|---------|------------|------|--------|------------|
| Light section | `IVORY` (#F1EEEA) | `TEXT_PRIMARY` (#212427) | `FOREST` (#0E3E1B) | `SLATE` (#697485) |
| Dark panel (inline) | `DEEP_GREEN` (#12211D) | `IVORY` (#F1EEEA) | `LAVENDER` (#CB9FD2) | `#AEB5C2` |
| Dark section (full) | `DEEP_GREEN` (#12211D) | `white` | `CORAL` (#FFC9C1) | `#AEB5C2` |
| Chart container | `DEEP_GREEN` | `white` | `FOREST` (line) + `LAVENDER` (dot) | `#AEB5C2` |

---

## 5. Chart & Diagram Library

### Chart Type 1: SVG Line Chart (Hero Growth Comparison)
**Used in:** Hero section — Fashion market vs AI trajectory

| Property | Specification |
|----------|---------------|
| Viewbox | `0 0 400 200` |
| Grid | 5 horizontal lines at `y: 40, 80, 120, 160, 200`, stroke `rgba(255,255,255,0.06)` |
| Y-axis labels | `$89B`, `$40B`, `$0` — font-size 9, Inter, `#AEB5C2`, text-anchor end |
| X-axis labels | `2025`, `2030`, `2035` — font-size 9, positioned along bottom |
| Baseline line | Cubic bezier path, `stroke: SLATE`, `strokeWidth: 2`, `strokeDasharray: "6 4"` (dashed) |
| Growth line | Cubic bezier path (exponential curve), `stroke: FOREST`, `strokeWidth: 3` (solid) |
| Endpoint dot | Animated circle at growth terminus: `r=5` fill `LAVENDER`, outer ring `r=10` stroke `LAVENDER` opacity 0.4 |
| Callout | Absolute-positioned `$89B` in `font-display text-4xl md:text-5xl` white, with "by 2035" subtitle in LAVENDER |
| Animation | `pathLength: 0→1` for both lines (1.5s baseline, 1.8s growth), endpoint dots delayed 2.4s–2.5s |
| Legend | Horizontal flex row below chart: colored line swatch + label text |
| Container | `rounded-2xl`, `bg: DEEP_GREEN`, `boxShadow: 0 32px 64px -12px ${DEEP_GREEN}40`, emerald glow blob top-right |

### Chart Type 2: Animated Horizontal Bars (Consumer Behavior)
**Used in:** Consumer Intelligence section — behavioral shift data

| Property | Specification |
|----------|---------------|
| Track | Full-width `h-3 rounded-full`, bg `${SLATE}12` |
| Fill | `h-full rounded-full`, color from data object (TEAL variants), animated `width: 0 → {value}%` |
| Label row | Flex between: `text-sm font-medium` left (label), `font-display text-2xl` right (value%) |
| Endpoint dot | Conditional: only on the 66% bar, `CORAL` circle `w-3 h-3 rounded-full`, animated scale-in |
| Animation | `whileInView`, `duration: 1`, stagger `delay: 0.2 + i * 0.12` |
| Spacing | `space-y-8` between bars |

### Chart Type 3: Discount Threshold Track (Single Bar with Markers)
**Used in:** Consumer Intelligence section — discount psychology

| Property | Specification |
|----------|---------------|
| Track | `h-2 rounded-full`, bg `${SLATE}15`, filled to 60% with `${TEAL}40` |
| Markers | 4 absolute-positioned dots at 0%, 30%, 60%, 100%: `w-2.5 h-2.5 rounded-full` |
| Active marker | 30% position: `FOREST` color, bold label; others: `SLATE` with opacity 0.4 |
| Annotation row | 3 text items below: neutral, highlighted (FOREST, font-weight 600), neutral |

### Chart Type 4: Capital Allocation Bars (Investment Breakdown)
**Used in:** Startup Ecosystem section — funding distribution

| Property | Specification |
|----------|---------------|
| Track | Full-width `h-2 rounded-full`, bg `${SLATE}12` |
| Fill | `h-full rounded-full`, `FOREST` for highlighted row, `TEAL` for others |
| Label row | Flex between: `text-sm font-medium` left, `font-display text-lg font-medium` right |
| Highlight | First row ("Design & Generative AI") gets `FOREST` color on percentage |
| Animation | `whileInView`, `duration: 0.8`, stagger `delay: 0.2 + i * 0.08` |
| Spacing | `space-y-5` between bars |

### Diagram Type 1: Circle Flow (Strategic Forces → Imperative)
**Used in:** Strategic Forces section — convergence diagram

| Property | Specification |
|----------|---------------|
| Nodes | 4 circles: `w-20 h-20 md:w-24 md:h-24 rounded-full`, `border: 2px solid FOREST` |
| Labels | `text-[10px] md:text-xs font-semibold tracking-wider uppercase`, color `FOREST` |
| Connectors | Horizontal lines `w-6 md:w-10 h-px`, animated `scaleX: 0→1` |
| Terminal | Vertical line `w-px h-8` + pill `rounded-full bg-FOREST` with "AI Imperative" label in white |
| Animation | Circles: `scale: [0.9, 1]` stagger 0.12s; lines: `scaleX: 0→1` stagger; pill: fade-in at 1.2s |

### Diagram Type 2: Circle Flow (Gen Z Purchase Path)
**Used in:** Gen Z section — discovery-to-purchase flow

| Property | Specification |
|----------|---------------|
| Nodes | 5 circles: `w-24 h-24 md:w-28 md:h-28 rounded-full` |
| Node styling | First 4: `border: 2px solid FOREST`, transparent bg. Last: `border: 2px solid LAVENDER`, tinted bg |
| Connectors | `w-12 h-px`, bg `SLATE`, `hidden md:block` |
| Sublabels | Below each circle: `text-xs`, color `SLATE` |
| Layout | `flex flex-col md:flex-row items-center justify-between` |

### Diagram Type 3: Horizontal Timeline (AI Evolution)
**Used in:** AI Timeline section — 4-stage maturity model

| Property | Specification |
|----------|---------------|
| Spine | Horizontal line `absolute top-[60px] left-[12.5%] right-[12.5%] h-px`, color `${SLATE}30`, animated `scaleX: 0→1` (1.2s) |
| Nodes | 4 timeline points: `w-8 h-8 rounded-full`, active node (2025) filled `FOREST` with white inner dot, others: empty with `SLATE` border |
| Active glow | `w-14 h-14 rounded-full opacity-20 bg-FOREST` behind active node |
| Year label | `font-display text-3xl md:text-4xl font-medium`, active in `FOREST`, others in `TEXT_PRIMARY` |
| "We Are Here" | Pill indicator: `px-3 py-1.5 rounded-full`, bg `${FOREST}10`, border `${FOREST}30`, tiny green dot + text |
| Grid | `grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6` |
| Animation | Stagger: `delay: 0.3 + i * 0.15`, "We Are Here" pill at 1.2s |

### Diagram Type 4: Value Creation Heat Map
**Used in:** Value Chain section — intensity visualization

| Property | Specification |
|----------|---------------|
| Nodes | Inline flex row of colored boxes: `px-4 py-3 rounded-lg`, `minWidth: 80` |
| Intensity scale | Level 4 = `FOREST`, Level 3 = `TEAL`, Level 2 = `${TEAL}80`, Level 1 = `${SLATE}30` |
| Text color | Level >= 2: white; Level < 2: `TEXT_PRIMARY` |
| Labels | Node name `text-[10px] uppercase`, intensity word `text-[9px] opacity-80` |
| Legend | Gradient strip below: 4 small colored bars + "Low" / "Very High" text labels |

### Table Type: ROI Comparison (Striped Data Table)
**Used in:** ROI section — before/after metrics

| Property | Specification |
|----------|---------------|
| Container | `rounded-2xl`, `border: 1px solid ${TEAL}20` |
| Header | `bg: DEEP_GREEN`, `text-xs tracking-[0.12em] uppercase`, color `#AEB5C2`, grid `grid-cols-4` |
| Rows | Alternating `#FAFAF8` / `IVORY`, `grid-cols-4 gap-4 px-6 py-5` |
| "Before" column | `text-sm`, color `SLATE` |
| "After" column | `text-sm font-medium`, color `FOREST` |
| Lift badge | `inline-flex rounded-full px-3 py-1`, bg `${FOREST}12`, text `FOREST` |

---

## 6. Section Architecture Template

Every section follows this structural template:

```
┌─────────────────────────────────────────────────┐
│  EYEBROW (Section Tag)                          │
│  text-xs · tracking-[0.25em] · uppercase        │
│  Color: FOREST (light) or CORAL/LAVENDER (dark) │
├─────────────────────────────────────────────────┤
│  HEADLINE (H2)                                  │
│  font-display · text-3xl→5xl · font-medium      │
│  tracking-tight · max-w-3xl                     │
│  Color: TEXT_PRIMARY (light) or white (dark)    │
├─────────────────────────────────────────────────┤
│  SUBTITLE (1–2 sentences)                       │
│  text-base→lg · leading-relaxed · max-w-2xl     │
│  Color: SLATE (light) or #AEB5C2 (dark)         │
│  Margin: mt-5                                   │
├─────────────────────────────────────────────────┤
│  PRIMARY VISUALIZATION                          │
│  Charts, cards, flow diagrams, tables           │
│  Margin: mt-14 to mt-16                         │
├─────────────────────────────────────────────────┤
│  SECONDARY VISUALIZATION (optional)             │
│  KPI strip, heat map, legend                    │
│  Margin: mt-14 to mt-16                         │
├─────────────────────────────────────────────────┤
│  DARK INSIGHT PANEL (optional)                  │
│  bg: DEEP_GREEN · rounded-xl                    │
│  2-col: bullet list + thesis quote              │
│  Margin: mt-14                                  │
│  Padding: p-8 md:p-10 or p-8 md:p-12           │
└─────────────────────────────────────────────────┘
```

### Dark Insight Panel Structure
The recurring "dark insight panel" appears at the bottom of most sections. Its internal structure:

```
┌───────────────────────────────────────────────┐
│  bg: DEEP_GREEN  ·  rounded-xl                │
│  grid md:grid-cols-2 gap-10 items-start       │
│                                               │
│  ┌─── LEFT COL ────┐  ┌─── RIGHT COL ────┐   │
│  │ Eyebrow label   │  │ Thesis quote      │   │
│  │ (LAVENDER/CORAL) │  │ font-display      │   │
│  │                  │  │ text-xl→2xl       │   │
│  │ Bullet list     │  │ color: IVORY      │   │
│  │ • Item 1        │  │ + LAVENDER span   │   │
│  │ • Item 2        │  │ for emphasis       │   │
│  │ • Item 3        │  │                   │   │
│  └──────────────────┘  └──────────────────┘   │
│                                               │
│  (optional) Executive Takeaway border-top     │
│  text-sm · color: #AEB5C2 + IVORY spans      │
└───────────────────────────────────────────────┘
```

Bullet list items: `flex items-start gap-3`, dot `w-1.5 h-1.5 rounded-full bg-LAVENDER`, text `text-base color-IVORY`.

---

## 7. Micro Design Details

### Noise Texture Overlay
- Applied to hero section as a subtle paper-like grain
- Inline SVG data URL with `feTurbulence` filter (`baseFrequency: 0.9, numOctaves: 4`)
- `opacity-[0.03]`, `pointer-events-none`, `absolute inset-0`

### Section Watermarks
- Large transparent numbers (e.g., "01") positioned `absolute right-8 top-1/2 -translate-y-1/2`
- `fontSize: clamp(16rem, 22vw, 24rem)`, `color: ${FOREST}06` (nearly invisible)
- `hidden lg:block` — desktop only, `select-none pointer-events-none`

### Gradient Underline (Hero)
- Follows the H1 headline
- `height: 3px`, `borderRadius: 2px`
- Gradient: `linear-gradient(90deg, ${INDIGO} 0%, ${LAVENDER} 60%, transparent 100%)`
- `maxWidth: 240px`
- Animated: `width: 0→100%, opacity: 0→1`, 1s duration, 0.6s delay

### Structural Dividers
| Type | Specification |
|------|---------------|
| Metric grid divider | `absolute -bottom-7 left-0 right-0 h-px`, color `${SLATE}18` — only between first 2 of 4 stats |
| Section thesis divider | `mx-auto h-px`, color `${SLATE}20`, `maxWidth: "80%"`, mt-16 |
| Indigo section divider | `mx-auto mt-4 w-16 h-0.5`, color `${INDIGO}40` — centered under H2 |
| Card internal divider | `borderTop: 1px solid ${SLATE}12`, mt-3 pt-3 — inside process node cards |
| Dark panel divider | `borderTop: 1px solid rgba(255,255,255,0.08)`, mt-10 pt-8 |

### Glow Effects
| Location | Specification |
|----------|---------------|
| Hero chart container | `absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-30`, bg `FOREST` |
| Growth segment cards | `absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[60px] opacity-10`, bg per-card accent color |
| Future vision section | `absolute center w-[600px] h-[600px] rounded-full blur-[120px] opacity-15`, bg `FOREST` |

### Card Border Accents
| Card Type | Border Style |
|-----------|-------------|
| Feature card (4-up grid) | `borderTop: 3px solid ${force.accentColor}` — unique color per card |
| Process node (value chain) | `borderTop: 3px solid ${node.accent}`, plus `border: 1px solid ${TEAL}20` |
| Cluster card | `borderTop: 3px solid ${cluster.color}` |
| Value proposition card | `borderLeft: 3px solid ${card.accent}` — left accent variant |
| Mobile process node | `borderLeft: 3px solid ${node.accent}` — switches from top to left on mobile |
| Growth segment (dark) | `borderTop: 3px solid ${seg.color}`, plus `border: 1px solid rgba(255,255,255,0.08)` |
| Callout card (funding) | `border: 2px solid ${FOREST}` — stronger emphasis border |

### Bullet Point Styling
- Dot: `mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0`
- Smaller variant: `mt-1.5 w-1 h-1 rounded-full flex-shrink-0`
- Color: `LAVENDER` in dark panels, accent color in value proposition cards
- Layout: `flex items-start gap-3` (standard) or `gap-2` (compact)

---

## 8. Data Visualization Rules

### Animation Specifications

| Trigger | Animation | Duration | Easing | Delay Pattern |
|---------|-----------|----------|--------|---------------|
| On mount (hero only) | `opacity: 0→1, y: 8→0` (eyebrow) | 600ms | default | 0.1s |
| On mount (hero only) | `opacity: 0→1, y: 16→0` (headline) | 700ms | default | 0.25s |
| On mount (hero only) | `opacity: 0→1, y: 12→0` (subtitle) | 600ms | default | 0.5s |
| On mount (hero only) | `opacity: 0→1, y: 14→0` (metrics) | 600ms | default | 0.8s |
| On mount (hero only) | `opacity: 0→1, x: 24→0` (chart) | 800ms | default | 0.4s |
| Scroll reveal (FadeIn) | `opacity: 0→1, y: 14→0` | 500ms | `easeOut` | Configurable `delay` prop |
| Scroll reveal (inline) | `opacity: 0→1, y: 16→0` or `y: 12→0` or `y: 20→0` | 500ms | default | `i * 0.1` or `i * 0.08` stagger |
| Bar chart fill | `width: 0→{value}%` | 1000ms | default | `0.2 + i * 0.12` stagger |
| Line chart path | `pathLength: 0→1` | 1500–1800ms | `easeOut` | 0.6–0.8s initial delay |
| Endpoint dot | `opacity: 0→1, scale: 0→1` | 400–500ms | default | 2.4–2.5s (after path completes) |
| Flow connector lines | `scaleX: 0→1` | default | default | Stagger `0.7 + i * 0.12` |
| Timeline spine | `scaleX: 0→1` | 1200ms | `easeOut` | 0 |
| Card hover | `y: -4` or `y: -3` | 250ms or 200ms | default | 0 |
| Dark card hover | `backgroundColor: rgba(255,255,255,0.07)` | 250ms | default | 0 |

### FadeIn Component Spec
```typescript
const FadeIn = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

**Key rules:**
- `once: true` — never re-animates on scroll back
- `margin: "-60px"` — triggers 60px before element enters viewport
- Duration: 500ms with `easeOut`
- Y offset: 14px (subtle, not dramatic)

### Data Formatting Conventions
| Data Type | Format | Example |
|-----------|--------|---------|
| Currency (large) | `$XXB` or `$X.XT` | `$89B`, `$2.0T` |
| Percentage | `XX%` or `XX.X%` | `40.8%`, `71%` |
| Growth rate | `+XX%` or `−XX%` | `+62%`, `−45%` |
| Multiplier | `X×` | `10×`, `4×`, `2–3×` |
| Range | `X–Y%` or `$X–$Y` | `3–5%`, `$50M–$200M` |
| Year range | `YYYY–YYYY` | `2025–2035` |
| Ranking | `#N` | `#1` |

---

## 9. Component System

### Shared Report Components

#### ReportSection
**File:** `src/components/blog/ReportSection.tsx`

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `children` | ReactNode | — | Section content |
| `className` | string | `""` | Additional classes |
| `dark` | boolean | `false` | Dark background mode |
| `id` | string | — | Anchor ID |

- Wraps content in `container-premium`
- Scroll-triggered fade-in: `opacity: 0→1, y: 12→0`, 500ms, `easeOut`
- Trigger margin: `-100px`
- Padding: `py-16 md:py-24`

#### SourcesSection
**File:** `src/components/blog/SourcesSection.tsx`

| Prop | Type | Purpose |
|------|------|---------|
| `sources` | `{ name: string; url?: string }[]` | Source badges |
| `methodology` | string | Collapsible methodology text |
| `definitions` | `{ term: string; definition: string }[]` | Collapsible glossary |
| `limitations` | string[] | Collapsible limitations list |

- Container: `bg-muted/30 rounded-xl border border-border p-6 md:p-8`
- Source badges displayed as flex-wrap row
- Accordion (shadcn) for methodology, definitions, limitations
- Scroll-triggered fade-in with `-50px` margin

#### DarkCTASection
**File:** `src/components/blog/DarkCTASection.tsx`

| Prop | Type | Purpose |
|------|------|---------|
| `title` | string | CTA headline |
| `subtitle` | string | CTA body copy |
| `primaryButton` | `{ label: string; href: string }` | White filled button |
| `secondaryButton` | `{ label: string; href: string }` | Outline button |

- Background: `#1a1a1a` with `from-primary/5 to-transparent` overlay
- Padding: `p-8 md:p-12 lg:p-16`
- Primary button: `bg-white text-[#1a1a1a] rounded-full px-8`
- Secondary button: `border-white/20 text-white hover:bg-white/10 rounded-full px-8`
- Framer Motion whileInView fade-up (600ms)

### Inline Components (FashionAiReport-specific)

#### FadeIn
Scroll-triggered reveal wrapper. See Section 8 for full spec.

#### Inline card patterns
Cards are not extracted into separate components — they are rendered inline as `motion.div` elements within `.map()` calls. This is intentional: each section's cards have unique data shapes and slightly different styling, so extracting them would add abstraction overhead without reuse benefit.

### Data Architecture
**File:** `src/components/blog/reports/data/fashionAiData.ts`

All report data lives in a dedicated data file, separate from the component. Exports:
- `heroKpis`, `executiveSummaryPoints`, `executivePullQuote`
- `marketFunnelTiers`, `marketSupportingStats`, `opportunityChartData`, `opportunityPillars`
- `competitorTableHeaders`, `competitorTableRows`, `competitorMatrixQuadrants`
- `macroHeadwindStats`, `riskHeatmapRows`, `pilotFailureModes`
- `strategicForces`, `consumerShiftData`, `consumerInsights`
- `genZFlowSteps`, `genZStats`, `valueChainStages`
- `roiMetrics`, `startupClusters`, `startupMeta`, `growthSegments`
- `aiTimelineStages`, `sources`, `methodology`, `definitions`, `limitations`

**Data typing pattern:** Accent colors and status values are stored directly in the data objects as hex strings or `as const` literals. This keeps the component free of conditional color logic.

---

## 10. Production Output Format

### File Structure
```
src/components/blog/
├── index.ts                    # Barrel export (27 components)
├── ReportSection.tsx           # Shared section wrapper
├── SourcesSection.tsx          # Sources + methodology accordion
├── SourceBadge.tsx             # Individual source badge
├── DarkCTASection.tsx          # Reusable dark CTA block
└── reports/
    ├── FashionAiReport.tsx     # Full report component (1658 lines)
    └── data/
        └── fashionAiData.ts    # All report data (297 lines)
```

### Rendering Architecture
```
BlogPost.tsx (shell)
  └── Header (marketing)
  └── ErrorBoundary
      └── Suspense (spinner fallback)
          └── FashionAiReport (React.lazy)
              └── <article>
                  ├── <section> Hero (inline — no ReportSection wrapper)
                  ├── <section> Inflection Point (inline)
                  ├── <section> Strategic Forces (inline)
                  ├── <section> Consumer Intelligence (inline)
                  ├── <section> Gen Z Flow (inline)
                  ├── <section> Value Chain (inline)
                  ├── <section> ROI Dashboard (inline)
                  ├── <section> Startup Ecosystem (inline)
                  ├── <section> Growth Segments (inline — dark bg)
                  ├── <section> AI Timeline (inline)
                  ├── <section> Future Vision (inline — dark bg)
                  └── ReportSection id="cta"
                      ├── DarkCTASection
                      └── SourcesSection
  └── Footer (marketing)
```

### Why Inline Sections
The report uses raw `<section>` elements with inline styles rather than the shared `ReportSection` wrapper for most sections. This is because:
1. Each section has a unique background treatment (noise texture, radial glows, full dark backgrounds)
2. Section padding varies (`py-20` vs `py-24` vs `min-h-[90vh]` vs `min-h-[80vh]`)
3. The `FadeIn` wrapper handles scroll animation at the content level, not the section level
4. Only the final CTA+Sources uses `ReportSection` because it follows the standard pattern

### Performance Considerations
- `FashionAiReport` is lazy-loaded via `React.lazy()` — it's 1658 lines and the largest component in the app
- `Suspense` fallback: centered spinner at `min-h-[60vh]`
- All `whileInView` animations use `{ once: true }` — no re-triggering
- SVG chart is declarative — no `<canvas>`, no charting library, no JavaScript-driven rendering
- `useInView` with `margin: "-60px"` or `"-100px"` ensures animations trigger before the element is fully visible, creating a smooth reveal experience
- All Framer Motion animations target `opacity` and `transform` only — GPU-accelerated, no layout thrash

### Replication Checklist
To create a new infographic report in this style:

1. **Create data file** at `src/components/blog/reports/data/{topic}Data.ts` — export all data as typed arrays/objects with accent colors embedded
2. **Create report component** at `src/components/blog/reports/{Topic}Report.tsx`
3. **Import shared components:** `ReportSection`, `DarkCTASection`, `SourcesSection` from `@/components/blog`
4. **Copy the FadeIn component** into the report (or extract to shared if reused across 3+ reports)
5. **Define color constants** at top of file — keep the same base palette (IVORY, DEEP_GREEN, FOREST, TEAL, SLATE, TEXT_PRIMARY) but choose 2 accent colors for the specific report
6. **Structure as `<article>` with `<section>` children** — one section per strategic idea
7. **Follow the section template:** eyebrow → H2 → subtitle → visualization → dark insight panel
8. **Add to BlogPost.tsx** route mapping and to BlogIndex.tsx card data
9. **Lazy-load** if the component exceeds ~500 lines
