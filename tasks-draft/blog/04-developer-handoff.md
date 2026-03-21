# Blog Pages — Developer Handoff Checklist

> **Date:** 2026-02-15
> **Status:** Implemented and verified

---

## Per-Screen: BlogIndex (`/blog`)

### Layout
- [x] Grid system: `container-premium` (max-w-7xl, responsive px)
- [x] Spacing between sections: py-12 to py-32 scale
- [x] Responsive breakpoints: mobile (<768), tablet (768-1023), desktop (1024+)
- [x] Content area max-width: max-w-3xl for hero text
- [x] Overflow: no scroll areas, natural document flow

### Visual Design
- [x] Colors reference design tokens (bg-background, text-foreground, text-primary, etc.)
- [x] Typography uses font-display (Playfair) and font-body (Inter)
- [x] Shadows: shadow-lg (story cards hover), shadow-xl (featured hover)
- [x] Border radius: rounded-xl (cards), rounded-2xl (featured, CTA)
- [x] Icons: Lucide (Sparkles, BarChart3, Briefcase, ShoppingCart, Rocket, Globe, ArrowRight, Clock)

### Components
- [x] FeaturedCard — inline component in BlogIndex.tsx
- [x] StoryCard — inline component in BlogIndex.tsx
- [x] DarkCTASection — imported from `@/components/blog/DarkCTASection`
- [x] Badge — from `@/components/ui/badge` (variants: secondary, outline)
- [x] Header — from `@/components/marketing/Header`
- [x] Footer — from `@/components/marketing/Footer`
- [x] All component states documented (see `03-interaction-states.md`)

### Content
- [x] Real content used (report titles, subtitles, categories)
- [x] Subtitle truncation: `line-clamp-2` on StoryCard
- [x] No placeholder/Lorem Ipsum text
- [x] CTA copy finalized

### Interactions
- [x] All cards are `<Link>` elements (full-card clickable)
- [x] Navigation destinations: `/blog/:slug` for each card
- [x] CTA primary button → `/validate`
- [x] CTA secondary button → `/`
- [x] Hover states documented with transitions

---

## Per-Screen: BlogPost (`/blog/:slug`)

### Layout
- [x] Shell: Header + main + Footer
- [x] Report component fills main area
- [x] Loading state: centered spinner, min-h-[60vh]
- [x] Error state: ErrorBoundary with recovery actions

### Components
- [x] ErrorBoundary from `@/components/ErrorBoundary`
- [x] Suspense wrapper with spinner fallback
- [x] 6 report components mapped by slug
- [x] FashionAiReport lazy-loaded (`React.lazy`)

### Routing
- [x] Valid slugs render corresponding report component
- [x] Invalid slugs redirect to `/blog` via `<Navigate replace />`
- [x] Route: `/blog/:slug` in App.tsx

---

## Per-Component: FeaturedCard

### Visual Specs
- [x] States: default, hover (documented in interaction-states.md)
- [x] Dimensions: full-width container, min-h-[240px] md:min-h-[320px] gradient area
- [x] Padding: p-8 md:p-10 content area
- [x] Typography: title 2xl/3xl, subtitle base, link sm

### Behavior
- [x] Trigger: hover → border/shadow/icon/title/arrow transitions
- [x] Click: navigate to `/blog/:slug`
- [x] Animation: Framer Motion whileInView fade-up (600ms)

### Accessibility
- [x] Semantic: `<Link>` element (implicit role="link")
- [x] Keyboard: focusable, Enter/Space activates
- [x] Touch target: entire card is tappable (>44px)

---

## Per-Component: StoryCard

### Visual Specs
- [x] States: default, hover (documented in interaction-states.md)
- [x] Dimensions: h-48 gradient area, p-6 content
- [x] Typography: title lg, subtitle sm line-clamp-2, link sm

### Behavior
- [x] Trigger: hover → border/shadow/icon/title/link transitions
- [x] Click: navigate to `/blog/:slug`
- [x] Animation: Framer Motion whileInView fade-up (500ms, stagger 100ms)

### Accessibility
- [x] Semantic: `<Link>` element
- [x] Keyboard: focusable, Enter/Space activates
- [x] "Read report" text always in DOM (opacity-hidden, not display:none)
- [x] Touch target: entire card (>44px)

---

## Per-Component: DarkCTASection

### Visual Specs
- [x] Background: #1a1a1a with gradient overlay
- [x] Padding: p-8 md:p-12 lg:p-16
- [x] Buttons: rounded-full, primary (white), secondary (outline)

### Behavior
- [x] Animation: whileInView fade-up (600ms)
- [x] Primary button: `<a>` to /validate
- [x] Secondary button: `<a>` to /

### Accessibility
- [x] Buttons rendered as `<a>` links (via `asChild`)
- [x] Color contrast: white on #1a1a1a (passes WCAG AAA)
- [x] Focus visible ring on both buttons

---

## Per-Flow: BlogIndex → BlogPost

### Navigation
- [x] Entry: click any card on BlogIndex
- [x] Destination: `/blog/:slug`
- [x] Back: browser back returns to BlogIndex
- [x] Deep link: direct URL to `/blog/:slug` works

### Data
- [x] Static data (no API calls on BlogIndex)
- [x] Report components load their own data internally
- [x] FashionAiReport lazy-loaded on demand

### Edge Cases
- [x] Invalid slug → redirect to `/blog`
- [x] Component crash → ErrorBoundary UI
- [x] Slow load (FashionAiReport, 1600+ lines) → Suspense spinner
- [x] No empty states needed (static data, always 6 posts)

---

## Animation Specification

| Element | Property | Duration | Easing | Trigger | Delay |
|---------|----------|----------|--------|---------|-------|
| Hero text | opacity, translateY | 600ms | ease | on-mount | 0 |
| Featured card | opacity, translateY | 600ms | ease | on-scroll (once) | 0 |
| Top story cards | opacity, translateY | 500ms | ease | on-scroll (once) | index * 100ms |
| More report cards | opacity, translateY | 500ms | ease | on-scroll (once) | index * 100ms |
| CTA section | opacity, translateY | 600ms | ease | on-scroll (once) | 0 |
| Card hover (all) | border, shadow, color, transform | 150-300ms | ease | on-hover | 0 |

---

## Build Verification

- [x] `npm run build` passes with no errors
- [x] Dev server renders at `http://localhost:8082/blog` (200)
- [x] Route `/blog/fashion-ai-2026` loads report (200)
- [x] All imports resolve correctly
- [x] No TypeScript errors
