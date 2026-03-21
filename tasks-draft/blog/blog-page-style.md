# Blog Page Style Guide

> **Source:** `src/pages/BlogIndex.tsx` (268 lines), `src/pages/BlogPost.tsx` (52 lines)
> **Date:** 2026-02-15
> **Aesthetic:** Editorial magazine — Superside x McKinsey blog index
> **Companion:** `tasks/blog/infographics-style.md` (report page style guide)

---

## 1. Design Philosophy

### Core Aesthetic
The blog index follows a **magazine editorial** aesthetic — clean card-based layouts with gradient thumbnails standing in for photography. The page functions as a curated collection of 6 research reports, not a feed. Every element serves navigation: get the visitor into a report.

### Visual Hierarchy Principles
1. **Typography-first hero.** The hero section contains zero cards, zero images — just a badge, headline, and subtitle centered on a clean background. This forces the visitor to read the value proposition before scanning cards.
2. **Featured story dominance.** The featured card (Section B) is a full-width vertical layout — gradient thumbnail on top (`aspect-video`), text below. It establishes which report matters most right now, matching the Superside blog pattern.
3. **Uniform grid below featured.** All 5 remaining cards sit in a single 3-col grid with a "More Reports" heading. No artificial 2-col/3-col split — just one consistent grid, same as Superside.
4. **Gradient-as-identity.** Each report has a unique gradient that becomes its visual identifier — no photography, no illustrations. The gradient + icon combination creates a distinct "cover" for each report.
5. **Restrained interactivity.** Cards use CSS transitions for hover (not Framer Motion). Scroll animations use `whileInView` with `once: true`. The page feels calm, not performative.

### Tone
**Quiet editorial.** The page borrows authority from the reports it links to. It uses scale (large featured card), whitespace (generous section padding), and typography hierarchy (Playfair Display headlines) to signal quality. No marketing language in the layout — just titles, subtitles, and "Read report" links.

### Relationship to Infographic Style Guide
The blog index shares the same design system as the report pages (`infographics-style.md`) but applies it differently:

| Aspect | Infographic Reports | Blog Index |
|--------|-------------------|------------|
| Purpose | Deep reading (20+ min) | Navigation (scan + click) |
| Sections | 10–12 data sections per page | 4 fixed sections |
| Color | Full palette with data semantics | Gradients + neutral surface |
| Typography | Data display (clamp, tabular-nums) | Card hierarchy (title/subtitle/meta) |
| Animation | Complex (pathLength, bar fills, flow diagrams) | Simple (fade-up on scroll, CSS hover) |
| Layout | Unique per section | Repeating card grid |

---

## 2. Layout System

### Container
- **Class:** `container-premium` (same as infographic reports)
- **Resolves to:** `max-w-7xl` with responsive horizontal padding (`px-4 sm:px-6 lg:px-8`)

### Page Structure
```
┌─────────────────────────────────────────────────┐
│  Header (marketing)                             │
├─────────────────────────────────────────────────┤
│  Section A: Editorial Hero                      │
│  py-16 md:py-24 lg:py-32                        │
│  max-w-3xl mx-auto text-center                  │
├─────────────────────────────────────────────────┤
│  Section B: Featured Story                      │
│  pb-12                                          │
│  FeaturedCard (vertical — gradient top, text    │
│  below, full-width)                             │
├─────────────────────────────────────────────────┤
│  Section C: All Reports Grid                    │
│  py-12                                          │
│  "More Reports" heading                         │
│  sm:grid-cols-2 lg:grid-cols-3 gap-6 (5 cards)  │
├─────────────────────────────────────────────────┤
│  Section D: CTA Strip                           │
│  py-12 pb-24                                    │
│  DarkCTASection component                       │
├─────────────────────────────────────────────────┤
│  Footer (marketing)                             │
└─────────────────────────────────────────────────┘
```

### Grid System
| Section | Grid | Tailwind | Gap |
|---------|------|----------|-----|
| A: Hero | Single column, centered | `max-w-3xl mx-auto text-center` | — |
| B: Featured | Vertical card (no grid) | Stack: `aspect-video` gradient + content below | — |
| C: All Reports | 3-col card grid | `grid sm:grid-cols-2 lg:grid-cols-3 gap-6` | 24px |
| D: CTA | Single column, centered | `max-w-2xl mx-auto text-center` (inside component) | — |

### Section Padding Scale
| Section | Padding | Pixel Equivalent |
|---------|---------|------------------|
| A: Hero | `py-16 md:py-24 lg:py-32` | 64px → 96px → 128px |
| B: Featured | `pb-12` | 48px bottom |
| C: All Reports | `py-12` | 48px |
| D: CTA | `py-12 pb-24` | 48px top, 96px bottom |

### Responsive Breakpoints
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Single column. All cards stack vertically. FeaturedCard is always vertical. |
| Tablet sm (640px+) | Section C becomes 2-col (`sm:grid-cols-2`). |
| Desktop (1024px+) | Section C expands to 3-col (`lg:grid-cols-3`). Hero padding reaches `py-32`. |

---

## 3. Typography System

### Font Families
| Role | Font | Tailwind | Usage |
|------|------|----------|-------|
| Display | Playfair Display | `font-display` | Hero H1, card titles, CTA headline |
| Body | Inter | `font-body` (default) | Subtitles, meta text, badge labels |

### Type Scale
| Element | Classes | Weight | Color |
|---------|---------|--------|-------|
| Hero H1 | `text-4xl md:text-5xl lg:text-6xl` | `font-medium` | `text-foreground` |
| Hero subtitle | `text-xl` | `font-normal` | `text-muted-foreground` |
| FeaturedCard title | `text-2xl md:text-3xl` | `font-medium` | `text-foreground` |
| StoryCard title | `text-lg` | `font-medium` | `text-foreground` |
| Card subtitle | `text-base` (featured) / `text-sm` (story) | `font-normal` | `text-muted-foreground` |
| Card read link | `text-sm` | `font-medium` | `text-primary` |
| Badge label | `text-xs` | — | Via `Badge` component |
| Meta text (read time) | `text-xs` | `font-normal` | `text-muted-foreground` |
| CTA headline | `text-2xl md:text-3xl lg:text-4xl` | `font-semibold` | `text-white` |
| CTA subtitle | `text-sm md:text-base` | `font-normal` | `text-white/60` |

### Typography Rules
- **Line height:** Subtitles use `leading-relaxed`. Headlines use default (tight).
- **Tracking:** Hero H1 uses `tracking-tight`. All other text uses default tracking.
- **Truncation:** StoryCard subtitles use `line-clamp-2` to prevent overflow.
- **Hover color shift:** Card titles transition to `text-primary` on hover via `group-hover:text-primary transition-colors`.

---

## 4. Color System

### Surface Colors
| Surface | Value | Usage |
|---------|-------|-------|
| Page background | `bg-background` | Overall page canvas — follows theme (light/dark) |
| Card surface | `bg-card` | FeaturedCard and StoryCard background |
| Card border | `border-border` | Default card border |
| Card border (hover) | `border-primary/30` | Elevated hover state |

### Text Colors
| Role | Class | Context |
|------|-------|---------|
| Headlines | `text-foreground` | Card titles, hero H1 |
| Body/subtitle | `text-muted-foreground` | Card subtitles, meta text |
| Action/link | `text-primary` | "Read report" link, hover title color |
| CTA text | `text-white` | DarkCTASection headline |
| CTA muted | `text-white/60` | DarkCTASection subtitle |

### Card Gradient Thumbnails
Each report has a unique gradient serving as its visual identity:

| Report | Gradient | Icon |
|--------|----------|------|
| fashion-ai-2026 | `from-purple-500/20 via-pink-500/20 to-rose-500/20` | Sparkles |
| ai-adoption-by-industry | `from-blue-500/20 via-cyan-500/20 to-teal-500/20` | BarChart3 |
| ai-jobs-future-of-work | `from-amber-500/20 via-orange-500/20 to-red-500/20` | Briefcase |
| ai-in-ecommerce | `from-green-500/20 via-emerald-500/20 to-teal-500/20` | ShoppingCart |
| ai-startup-products | `from-violet-500/20 via-purple-500/20 to-indigo-500/20` | Rocket |
| ai-investment-hubs | `from-sky-500/20 via-blue-500/20 to-indigo-500/20` | Globe |

### Gradient Rules
- Direction: `bg-gradient-to-br` (top-left to bottom-right)
- Opacity: All stops use `/20` (20% opacity) — keeps gradients soft and muted
- Icon overlay: Lucide icon centered on gradient, `text-foreground/40` (40% opacity)
- No solid backgrounds — gradient thumbnails replace photography entirely

### DarkCTASection Colors
| Element | Value |
|---------|-------|
| Background | `bg-[#1a1a1a]` |
| Overlay | `bg-gradient-to-br from-primary/5 to-transparent` |
| Primary button | `bg-white text-[#1a1a1a]` |
| Secondary button | `border-white/20 text-white hover:bg-white/10` |

---

## 5. Card Component Library

### FeaturedCard (Section B)
The largest card on the page — full-width, vertical layout (Superside-style). Gradient thumbnail on top, content below.

| Property | Specification |
|----------|---------------|
| Container | `rounded-2xl border border-border bg-card overflow-hidden` |
| Layout | Vertical stack (no grid) |
| Thumbnail | `bg-gradient-to-br ${gradient}`, `aspect-video` (~16:9) |
| Icon | `w-16 h-16`, `text-foreground/40`, centered in thumbnail |
| Content padding | `p-8 md:p-10` |
| Subtitle constraint | `max-w-3xl` — prevents text from spanning full width on large screens |
| Meta row | `flex items-center gap-3 mb-4` — Badge + read time |
| Title | `font-display text-2xl md:text-3xl font-medium` |
| Subtitle | Default text (no clamp) — `leading-relaxed mb-6` |
| Read link | `text-sm font-medium text-primary` with ArrowRight icon |
| Hover: border | `hover:border-primary/30` |
| Hover: shadow | `hover:shadow-xl` |
| Hover: icon | `group-hover:scale-110` |
| Hover: title | `group-hover:text-primary` |
| Hover: arrow | `group-hover:translate-x-1` |
| Transition | `transition-all duration-300` |

### StoryCard (Section C)
Vertical card used in the unified 3-col grid.

| Property | Specification |
|----------|---------------|
| Container | `rounded-xl border border-border bg-card overflow-hidden h-full` |
| Layout | Vertical — thumbnail top, content below |
| Thumbnail | `bg-gradient-to-br ${gradient}`, `h-48` (192px fixed) |
| Icon | `w-12 h-12`, `text-foreground/40`, centered in thumbnail |
| Content padding | `p-6` |
| Meta row | `flex items-center gap-3 mb-3` — Badge + read time |
| Title | `font-display text-lg font-medium` |
| Subtitle | `text-sm line-clamp-2 leading-relaxed mb-4` |
| Read link | `text-sm font-medium text-primary opacity-0 group-hover:opacity-100` — hidden by default |
| Hover: border | `hover:border-primary/30` |
| Hover: shadow | `hover:shadow-lg` |
| Hover: icon | `group-hover:scale-110` |
| Hover: title | `group-hover:text-primary` |
| Hover: read link | Fades in from `opacity-0` → `opacity-100` |
| Transition | `transition-all duration-300` |

### Key Differences: FeaturedCard vs StoryCard
| Aspect | FeaturedCard | StoryCard |
|--------|-------------|-----------|
| Layout | Vertical (aspect-video thumbnail) | Vertical (h-48 thumbnail) |
| Corner radius | `rounded-2xl` | `rounded-xl` |
| Thumbnail | `aspect-video` (~16:9, responsive) | `h-48` (fixed 192px) |
| Icon size | `w-16 h-16` | `w-12 h-12` |
| Title size | `text-2xl md:text-3xl` | `text-lg` |
| Subtitle | Full text, no clamp, `max-w-3xl` | `line-clamp-2` |
| Shadow hover | `shadow-xl` | `shadow-lg` |
| Read link | Always visible | Hidden → visible on hover |

---

## 6. Section Architecture Template

Every section follows this structural pattern:

```
┌─────────────────────────────────────────────────┐
│  <section className="py-12 bg-background">      │
│    <div className="container-premium">           │
│      <motion.div or <div>                       │
│        [grid layout with cards]                  │
│      </motion.div or </div>                     │
│    </div>                                       │
│  </section>                                     │
```

### Section A: Editorial Hero
```
┌─────────────────────────────────────────────────┐
│  py-16 md:py-24 lg:py-32                        │
│                                                 │
│  ┌─── max-w-3xl mx-auto text-center ──────────┐ │
│  │  Badge: "Research Reports"                  │ │
│  │  (bg-sage-light, mb-6)                      │ │
│  │                                             │ │
│  │  H1: "AI Intelligence Reports"              │ │
│  │  font-display · text-4xl→6xl · font-medium  │ │
│  │  tracking-tight · mb-6                      │ │
│  │                                             │ │
│  │  Subtitle paragraph                         │ │
│  │  text-xl · text-muted-foreground            │ │
│  │  leading-relaxed                            │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  Animation: on mount (not scroll)               │
│  opacity: 0→1, y: 16→0, 600ms                  │
└─────────────────────────────────────────────────┘
```

### Section B: Featured Story (Superside-style vertical card)
```
┌─────────────────────────────────────────────────┐
│  pb-12                                          │
│                                                 │
│  ┌─── FeaturedCard ────────────────────────────┐ │
│  │  ┌── Gradient (aspect-video, full-width) ──┐│ │
│  │  │         Icon 16×16 centered             ││ │
│  │  └─────────────────────────────────────────┘│ │
│  │  ┌── Content (p-8 md:p-10) ────────────────┐│ │
│  │  │  Badge + read time                      ││ │
│  │  │  Title (2xl→3xl)                        ││ │
│  │  │  Subtitle (max-w-3xl)                   ││ │
│  │  │  "Read report →"                        ││ │
│  │  └─────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  Animation: whileInView                         │
│  opacity: 0→1, y: 20→0, 600ms                  │
└─────────────────────────────────────────────────┘
```

### Section C: All Reports Grid (5 cards, unified)
```
┌─────────────────────────────────────────────────┐
│  py-12                                          │
│                                                 │
│  H2: "More Reports"                             │
│  font-display text-2xl font-medium mb-8         │
│                                                 │
│  grid sm:grid-cols-2 lg:grid-cols-3 gap-6       │
│  ┌── StoryCard ──┐ ┌── StoryCard ──┐ ┌── StoryCard ──┐
│  │ Gradient h-48 │ │ Gradient h-48 │ │ Gradient h-48 │
│  │ Icon 12×12   │ │ Icon 12×12   │ │ Icon 12×12   │
│  │ ─────────── │ │ ─────────── │ │ ─────────── │
│  │ Badge + time │ │ Badge + time │ │ Badge + time │
│  │ Title (lg)   │ │ Title (lg)   │ │ Title (lg)   │
│  │ Subtitle×2   │ │ Subtitle×2   │ │ Subtitle×2   │
│  └───────────────┘ └───────────────┘ └───────────────┘
│  ┌── StoryCard ──┐ ┌── StoryCard ──┐
│  │ (same)        │ │ (same)        │
│  └───────────────┘ └───────────────┘
│                                                 │
│  Animation: heading whileInView (500ms)         │
│  Cards: whileInView, stagger 0.1s               │
│  opacity: 0→1, y: 16→0, 500ms                  │
└─────────────────────────────────────────────────┘
```

### Section D: CTA Strip
```
┌─────────────────────────────────────────────────┐
│  py-12 pb-24                                    │
│                                                 │
│  DarkCTASection                                 │
│  ┌─── bg-[#1a1a1a] rounded-2xl ──────────────┐ │
│  │  H3: "Ready to validate your startup?"    │ │
│  │  Subtitle                                  │ │
│  │  [Primary Button]  [Secondary Button]      │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  Animation: whileInView (inside component)      │
│  opacity: 0→1, y: 20→0, 600ms                  │
└─────────────────────────────────────────────────┘
```

---

## 7. Micro Design Details

### Badge Styling
| Badge | Variant | Classes | Context |
|-------|---------|---------|---------|
| Hero badge | `secondary` | `bg-sage-light text-sage-foreground border-0` | Section A — identifies page type |
| Card category badge | `outline` | Default outline styling, `text-xs` | Sections B/C — identifies report category |

### Read Time Meta
- Layout: `flex items-center gap-1`
- Icon: `Clock` from Lucide, `w-3 h-3`
- Text: `text-xs text-muted-foreground`
- Always paired with category badge in a `flex items-center gap-3` row

### Card Link Pattern
All cards are wrapped in `<Link to={/blog/${post.slug}}>` with `className="group block"`. The `group` class enables nested hover effects:
- `group-hover:border-primary/30` — border color change
- `group-hover:scale-110` — icon enlargement
- `group-hover:text-primary` — title color change
- `group-hover:translate-x-1` — arrow slide
- `group-hover:opacity-100` — read link reveal (StoryCard only)

### Shadow Elevation
| State | FeaturedCard | StoryCard |
|-------|-------------|-----------|
| Default | None | None |
| Hover | `shadow-xl` | `shadow-lg` |

### Corner Radius
| Element | Radius |
|---------|--------|
| FeaturedCard | `rounded-2xl` (16px) |
| StoryCard | `rounded-xl` (12px) |
| DarkCTASection | `rounded-2xl` (16px) |
| CTA buttons | `rounded-full` |

---

## 8. Animation Specifications

### Hero (Section A) — On Mount
| Property | Value |
|----------|-------|
| Trigger | Page load (not scroll) |
| Initial | `opacity: 0, y: 16` |
| Animate | `opacity: 1, y: 0` |
| Duration | 600ms |
| Easing | Default (spring) |

### Featured Card (Section B) — Scroll Reveal
| Property | Value |
|----------|-------|
| Trigger | `whileInView` |
| Viewport | `{ once: true }` |
| Initial | `opacity: 0, y: 20` |
| Animate | `opacity: 1, y: 0` |
| Duration | 600ms |

### Section Heading (Section C) — Scroll Reveal
| Property | Value |
|----------|-------|
| Trigger | `whileInView` |
| Viewport | `{ once: true }` |
| Initial | `opacity: 0, y: 12` |
| Animate | `opacity: 1, y: 0` |
| Duration | 500ms |

### Card Grid (Section C) — Staggered Scroll Reveal
| Property | Value |
|----------|-------|
| Trigger | `whileInView` |
| Viewport | `{ once: true }` |
| Initial | `opacity: 0, y: 16` |
| Animate | `opacity: 1, y: 0` |
| Duration | 500ms |
| Stagger | `delay: index * 0.1` (100ms between cards) |

### Card Hover — CSS Only (Not Framer Motion)
| Element | Property | Duration |
|---------|----------|----------|
| Card border + shadow | `transition-all` | 300ms |
| Icon scale | `transition-transform` | 300ms |
| Title color | `transition-colors` | default |
| Arrow translate | `transition-transform` | default |
| Read link opacity (StoryCard) | `transition-opacity` | default |

### DarkCTASection — Scroll Reveal
| Property | Value |
|----------|-------|
| Trigger | `whileInView` |
| Viewport | `{ once: true }` |
| Initial | `opacity: 0, y: 20` |
| Animate | `opacity: 1, y: 0` |
| Duration | 600ms |

### Key Rules
- `once: true` on all `whileInView` — never re-animate on scroll back
- Hero uses `animate` (on mount), all other sections use `whileInView` (on scroll)
- Card hover uses CSS `transition-all duration-300` — not Framer Motion
- Y offset: 16px for standard reveals, 20px for larger elements (featured card, CTA)

---

## 9. BlogPost Routing Architecture

### Component Structure
```
BlogPost.tsx (shell)
  └── Header (marketing)
  └── ErrorBoundary
      └── Suspense (spinner fallback)
          └── ReportComponent (dynamic by slug)
  └── Footer (marketing)
```

### Route Mapping
| Slug | Component | Loading |
|------|-----------|---------|
| `fashion-ai-2026` | `FashionAiReport` | `React.lazy()` — code-split |
| `ai-adoption-by-industry` | `AiAdoptionReport` | Direct import |
| `ai-jobs-future-of-work` | `AiJobsReport` | Direct import |
| `ai-in-ecommerce` | `AiEcommerceReport` | Direct import |
| `ai-startup-products` | `AiStartupProductsReport` | Direct import |
| `ai-investment-hubs` | `AiInvestmentHubsReport` | Direct import |

### Error & Loading States
| State | Behavior |
|-------|----------|
| Invalid slug | `<Navigate to="/blog" replace />` — redirect to index |
| Missing slug | `<Navigate to="/blog" replace />` — redirect to index |
| Lazy load pending | Centered spinner: `animate-spin rounded-full h-8 w-8 border-b-2 border-primary` at `min-h-[60vh]` |
| Component crash | `ErrorBoundary` catches and shows recovery UI |

### Lazy Loading Strategy
Only `FashionAiReport` is lazy-loaded because it's 1658 lines — the largest component in the app. All other reports use direct imports. Add `React.lazy()` to any future report that exceeds ~500 lines.

---

## 10. Data Model & Production Output

### BlogPost Interface
```typescript
interface BlogPost {
  slug: string;           // URL path segment
  title: string;          // Card headline (font-display)
  subtitle: string;       // Card description (line-clamp-2 on StoryCard)
  category: string;       // Badge label
  readTime: string;       // "12 min read"
  date: string;           // "February 2026"
  gradient: string;       // Tailwind gradient classes
  icon: React.ComponentType<{ className?: string }>;  // Lucide icon component
  featured?: boolean;     // Marks the hero card (Section B)
}
```

### Data Partitioning
```typescript
const featuredPost = blogPosts.find((p) => p.featured)!;
const remainingPosts = blogPosts.filter((p) => !p.featured);
```

- `featuredPost`: 1 post → Section B (vertical featured card)
- `remainingPosts`: 5 posts → Section C (3-col grid)
- Total: 6 posts = 1 + 5

### File Structure
```
src/pages/
├── BlogIndex.tsx          # Blog index page (268 lines)
└── BlogPost.tsx           # Report shell with routing (52 lines)

src/components/blog/
├── DarkCTASection.tsx     # Reusable dark CTA block
├── ReportSection.tsx      # Shared report section wrapper
├── SourcesSection.tsx     # Sources + methodology accordion
└── reports/
    ├── FashionAiReport.tsx         # Fashion AI report (1658 lines)
    ├── AiAdoptionReport.tsx        # Industry adoption report
    ├── AiJobsReport.tsx            # Jobs & future of work report
    ├── AiEcommerceReport.tsx        # E-commerce report
    ├── AiStartupProductsReport.tsx  # Startup products report
    ├── AiInvestmentHubsReport.tsx   # Investment hubs report
    └── data/
        └── fashionAiData.ts        # Fashion AI data (297 lines)
```

### Shared Design Tokens (Both Pages)
These tokens are used by both BlogIndex and the report pages:

| Token | Value | Used By |
|-------|-------|---------|
| `font-display` | Playfair Display | Both — headlines |
| `font-body` | Inter | Both — body text |
| `container-premium` | `max-w-7xl` + responsive padding | Both — page container |
| `bg-background` | Theme background | Both — page canvas |
| `text-foreground` | Theme foreground | Both — primary text |
| `text-muted-foreground` | Theme muted | Both — secondary text |
| `border-border` | Theme border | Both — card borders |
| `text-primary` | Theme primary | BlogIndex — links and hover states |

### Replication Checklist
To add a new report to the blog:

1. **Create report component** at `src/components/blog/reports/{Topic}Report.tsx`
2. **Create data file** at `src/components/blog/reports/data/{topic}Data.ts` (follow `fashionAiData.ts` pattern)
3. **Add to BlogPost.tsx** route mapping: import component + add to `reportComponents` record
4. **Add to BlogIndex.tsx** data array: new `BlogPost` object with unique gradient, icon, and slug
5. **Choose gradient:** Pick 3 Tailwind colors at `/20` opacity — `from-{color}-500/20 via-{color}-500/20 to-{color}-500/20`
6. **Choose icon:** Select a Lucide icon that represents the report topic
7. **Set `featured`:** If this is the new hero, set `featured: true` and remove it from the previous featured post
8. **Lazy-load** if the component exceeds ~500 lines
