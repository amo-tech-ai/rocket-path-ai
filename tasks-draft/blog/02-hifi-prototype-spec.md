# Blog Pages — High-Fidelity Prototype Specification

> **Date:** 2026-02-15
> **Pages:** BlogIndex (`/blog`), BlogPost (`/blog/:slug`)
> **Fidelity:** Production-ready — implemented in `src/pages/BlogIndex.tsx`

---

## 1. Visual Foundation

### Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `hsl(40 20% 98%)` | Page background (IVORY) |
| `--foreground` | `hsl(210 11% 15%)` | Primary text |
| `--primary` | `hsl(162 75% 22%)` | Accent, links, hover states |
| `--muted-foreground` | `hsl(215 16% 47%)` | Secondary text, subtitles |
| `--border` | `hsl(214 32% 91%)` | Card borders |
| `--card` | `#ffffff` | Card backgrounds |
| `--sage-light` | — | Badge background |
| `--sage-foreground` | — | Badge text |
| Dark CTA bg | `#1a1a1a` | CTA section background |

### Typography

| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| H1 (hero) | Playfair Display (`font-display`) | 4xl / 5xl / 6xl | 500 (medium) | tight |
| H2 (featured title) | Playfair Display | 2xl / 3xl | 500 | — |
| H3 (card title) | Playfair Display | lg | 500 | — |
| Body (subtitle) | Inter (`font-body`) | base / sm | 400 | — |
| Badge | Inter | xs | 500 | — |
| Meta (read time) | Inter | xs | 400 | — |
| CTA headline | Playfair Display | 2xl / 3xl / 4xl | 600 | — |
| CTA body | Inter | sm / base | 400 | — |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| Section padding | py-12 to py-32 | Vertical rhythm between sections |
| Container | `container-premium` | max-w-7xl, px-4 sm:px-6 lg:px-8 |
| Card padding | p-6 (story), p-8/p-10 (featured) | Internal card spacing |
| Grid gap | gap-6 | Between cards |
| mb (badge to title) | mb-3 / mb-4 | Badge to heading |
| mb (title to subtitle) | mb-2 / mb-3 | Heading to body |
| mb (subtitle to CTA link) | mb-4 / mb-6 | Body to action |

### Elevation / Borders

| Element | Default | Hover |
|---------|---------|-------|
| Featured card | rounded-2xl, border-border | border-primary/30, shadow-xl |
| Story card | rounded-xl, border-border | border-primary/30, shadow-lg |
| CTA section | rounded-2xl | — (no hover) |
| Badge | rounded (pill), border outline | — |

---

## 2. Component Library

### BlogPost Interface (Data Model)

```typescript
interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  gradient: string;         // Tailwind gradient classes
  icon: React.ComponentType; // Lucide icon component
  featured?: boolean;        // Featured hero flag
}
```

### Component: FeaturedCard

| Property | Spec |
|----------|------|
| Layout | `grid md:grid-cols-2` — gradient left, content right |
| Gradient area | `min-h-[240px] md:min-h-[320px]`, `bg-gradient-to-br ${gradient}` |
| Icon | Lucide component, `w-16 h-16`, `text-foreground/40` |
| Content padding | `p-8 md:p-10` |
| Title | `font-display text-2xl md:text-3xl font-medium` |
| Subtitle | `text-muted-foreground leading-relaxed` |
| Link text | `text-sm font-medium text-primary` + ArrowRight icon |
| Border | `rounded-2xl border border-border` |
| Hover | `border-primary/30 shadow-xl`, icon `scale-110`, title `text-primary`, arrow `translate-x-1` |

### Component: StoryCard

| Property | Spec |
|----------|------|
| Layout | Vertical — gradient top, content below |
| Gradient area | `h-48`, `bg-gradient-to-br ${gradient}` |
| Icon | Lucide component, `w-12 h-12`, `text-foreground/40` |
| Content padding | `p-6` |
| Title | `font-display text-lg font-medium` |
| Subtitle | `text-sm text-muted-foreground line-clamp-2` |
| Link text | `text-sm font-medium text-primary opacity-0 group-hover:opacity-100` |
| Border | `rounded-xl border border-border` |
| Hover | `border-primary/30 shadow-lg`, icon `scale-110`, title `text-primary`, arrow `translate-x-1` |

### Component: DarkCTASection (reused)

| Property | Spec |
|----------|------|
| Background | `#1a1a1a` with `from-primary/5 to-transparent` overlay |
| Padding | `p-8 md:p-12 lg:p-16` |
| Title | `font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white` |
| Subtitle | `text-white/60 text-sm md:text-base` |
| Primary button | `bg-white text-[#1a1a1a] rounded-full px-8` + ArrowRight |
| Secondary button | `border-white/20 text-white hover:bg-white/10 rounded-full px-8` |
| Animation | whileInView fade-up (0.6s) |

---

## 3. Gradient Thumbnail Specs

Each report gets a unique gradient and icon:

| Report | Gradient | Icon | Lucide Name |
|--------|----------|------|-------------|
| Fashion AI 2026 | `from-purple-500/20 via-pink-500/20 to-rose-500/20` | Sparkles | `Sparkles` |
| AI Adoption | `from-blue-500/20 via-cyan-500/20 to-teal-500/20` | Bar chart | `BarChart3` |
| AI Jobs | `from-amber-500/20 via-orange-500/20 to-red-500/20` | Briefcase | `Briefcase` |
| E-commerce | `from-green-500/20 via-emerald-500/20 to-teal-500/20` | Shopping cart | `ShoppingCart` |
| Startup Products | `from-violet-500/20 via-purple-500/20 to-indigo-500/20` | Rocket | `Rocket` |
| Investment Hubs | `from-sky-500/20 via-blue-500/20 to-indigo-500/20` | Globe | `Globe` |

---

## 4. Section-by-Section Specs

### Section A: Editorial Hero

| Property | Spec |
|----------|------|
| Padding | `py-16 md:py-24 lg:py-32` |
| Alignment | `text-center`, `max-w-3xl mx-auto` |
| Badge | `variant="secondary"`, sage bg, "Research Reports" |
| H1 | `text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight` |
| Subtitle | `text-xl text-muted-foreground leading-relaxed` |
| Animation | `initial={{ opacity: 0, y: 16 }}`, `animate={{ opacity: 1, y: 0 }}`, `duration: 0.6` |

### Section B: Featured Story

| Property | Spec |
|----------|------|
| Padding | `pb-12` |
| Content | Single `FeaturedCard` for `fashion-ai-2026` |
| Animation | `whileInView`, `duration: 0.6`, `viewport: { once: true }` |

### Section C: Top Stories Row

| Property | Spec |
|----------|------|
| Padding | `py-12` |
| Grid | `md:grid-cols-2 gap-6` |
| Cards | 2 `StoryCard` components (ai-adoption, ai-jobs) |
| Animation | Stagger: `delay: index * 0.1`, `duration: 0.5`, `whileInView` |

### Section D: More Reports Grid

| Property | Spec |
|----------|------|
| Padding | `py-12` |
| Grid | `sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| Cards | 3 `StoryCard` components (ecommerce, startups, investment) |
| Animation | Stagger: `delay: index * 0.1`, `duration: 0.5`, `whileInView` |

### Section E: CTA Strip

| Property | Spec |
|----------|------|
| Padding | `py-12 pb-24` |
| Component | `DarkCTASection` |
| Props | `title`: "Ready to validate your startup idea?", `subtitle`: "Use AI to test your business concept before you invest months building it.", `primaryButton`: { label: "Start validating", href: "/validate" }, `secondaryButton`: { label: "See how it works", href: "/" } |

---

## 5. Responsive Breakpoints

### Desktop (1024px+)
- Hero: centered, max-w-3xl
- Featured: horizontal 2-col card
- Top stories: 2-col grid
- More reports: 3-col grid
- CTA: full-width container

### Tablet (768px–1023px)
- Hero: same as desktop
- Featured: stacked (gradient top, content below)
- Top stories: 2-col grid
- More reports: 2-col grid (1 card wraps to next row)
- CTA: full-width

### Mobile (<768px)
- Hero: same but smaller text
- Featured: stacked vertical
- Top stories: single column
- More reports: single column
- CTA: stacked buttons

---

## 6. BlogPost Page (`/blog/:slug`)

### Shell Layout
```
Header (marketing)
  └── main
      └── ErrorBoundary
          └── Suspense (spinner fallback)
              └── ReportComponent (dynamic by slug)
Footer (marketing)
```

### Report Routing

| Slug | Component | Loading |
|------|-----------|---------|
| `fashion-ai-2026` | `FashionAiReport` (lazy) | Suspense spinner |
| `ai-adoption-by-industry` | `AiAdoptionReport` | Immediate |
| `ai-jobs-future-of-work` | `AiJobsReport` | Immediate |
| `ai-in-ecommerce` | `AiEcommerceReport` | Immediate |
| `ai-startup-products` | `AiStartupProductsReport` | Immediate |
| `ai-investment-hubs` | `AiInvestmentHubsReport` | Immediate |
| (invalid) | `Navigate to="/blog"` | Redirect |

### Loading Fallback
- Centered spinner: `min-h-[60vh]`, `animate-spin rounded-full h-8 w-8 border-b-2 border-primary`

### Error Handling
- `ErrorBoundary` wraps all reports
- Shows error UI with "Try Again", "Reload Page", "Go to Dashboard" buttons
- Development mode shows error stack trace

---

## 7. Implementation File Map

| File | Role |
|------|------|
| `src/pages/BlogIndex.tsx` | Blog hub page — complete rewrite |
| `src/pages/BlogPost.tsx` | Report shell with lazy loading |
| `src/components/blog/DarkCTASection.tsx` | Reusable CTA block |
| `src/components/ErrorBoundary.tsx` | Error boundary wrapper |
| `src/components/marketing/Header.tsx` | Shared marketing header |
| `src/components/marketing/Footer.tsx` | Shared marketing footer |
| `src/components/blog/reports/*.tsx` | Individual report components |
