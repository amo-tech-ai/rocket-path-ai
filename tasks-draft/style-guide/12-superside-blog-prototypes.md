# Superside Blog — Wireframe, Lo-Fi & Hi-Fi Prototypes

> **Source:** [Superside Blog](https://www.superside.com/blog)  
> **Design skills:** [low-fidelity-prototyping](.agents/skills/design/low-fidelity-prototyping) · [high-fidelity-prototyping](.agents/skills/design/high-fidelity-prototyping)  
> **Use:** Content hubs, blog listings, article grids with filters

---

## 1. Lo-Fi Wireframe (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                            │
│ Services ▼  Our work  Why us ▼  Resources ▼  Pricing  Enterprise       [Book a demo]  Sign in      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SECTION LABEL: our blog                                                                            │
│ # Creative _Performance_                                                                           │
│ Creative ideas, practical tips and insider info—the Superside blog helps your team get             │
│ great design done at scale.                                                                        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FEATURED POSTS (2) — horizontal, large cards                                                       │
│ ┌─────────────────────────────────────────┬─────────────────────────────────────────┐            │
│ │ [IMG 1584×892]                           │ [IMG 1933×1103]                         │            │
│ │ CREATIVE LEADERSHIP • 6 min               │ CUSTOMER STORIES • 3 min                 │            │
│ │ ### Get off the conveyor belt: 22        │ ### How a Fortune 500 doubled their      │            │
│ │ leaders on _the secret to great work_    │ AI adoption                             │            │
│ │ [Excerpt 2-3 lines]                      │ [Excerpt 2-3 lines]                      │            │
│ │ [Author photo] Tessa Reid                │                                         │            │
│ │ Sr. Content Marketing Manager            │                                         │            │
│ └─────────────────────────────────────────┴─────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TRENDING — "AI-Powered Creative"                                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────┐│
│ │ [IMG thumbnail]  ### 10 Best AI Ad Creative Generators & Tools in 2026 (Tested)                 ││
│ │ #Expert Insights #Examples  [Author] Roger Match, Content Marketer                              ││
│ └────────────────────────────────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FILTERS ROW                                                                                       │
│ Category [▼]  Sub-category [▼]  Sort by [Latest ▼]                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ARTICLE GRID — 3 columns (desktop), 2 (tablet), 1 (mobile)                                       │
│                                                                                                   │
│ ┌─────────────────┬─────────────────┬─────────────────┐                                           │
│ │ [IMG]           │ [IMG]           │ [IMG]           │                                           │
│ │ CATEGORY • Sub  │ CATEGORY • Sub  │ CATEGORY • Sub  │                                           │
│ │ • X min to read │ • X min to read │ • X min to read │                                           │
│ │ ### Title       │ ### Title       │ ### Title       │                                           │
│ │ [Excerpt]       │ [Excerpt]       │ [Excerpt]       │                                           │
│ │ #Tag1 #Tag2     │ #Tag1 #Tag2     │ #Tag1 #Tag2     │                                           │
│ └─────────────────┴─────────────────┴─────────────────┘                                           │
│ ┌─────────────────┬─────────────────┬─────────────────┐                                           │
│ │ ...             │ ...             │ ...             │                                           │
│ └─────────────────┴─────────────────┴─────────────────┘                                           │
│                                                                                                   │
│ [Load More]                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FOOTER CTA — Your creative team's creative team™  [Book a demo]                                    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hi-Fi Color Palette

| Token | Value | Use |
|-------|-------|-----|
| Page BG | `#ffffff` | Default background |
| Section BG (alt) | `#F8F8F4` | Optional alternating sections |
| Text primary | `#1a1a2e` | Headlines, titles |
| Text secondary | `#64748b` | Excerpts, meta, labels |
| Category link | `#6366f1` | Category/sub-category links |
| Tag | `#6366f1` or `#64748b` | #Tag links |
| Border | `#e2e8f0` | Card borders, dividers |
| Card shadow | `0 2px 8px rgba(0,0,0,0.06)` | Article card hover |

---

## 3. Typography (Hi-Fi)

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Section label | 12px | 500 | #64748b | Uppercase |
| Hero headline | 48–56px | 700 | #1a1a2e | "_Performance_" italic |
| Hero subhead | 18–20px | 400 | #64748b | Max-width 720px |
| Featured title | 24–28px | 600 | #1a1a2e | Italic on key phrase |
| Featured excerpt | 16px | 400 | #64748b | 2–3 lines |
| Article card title | 18–20px | 600 | #1a1a2e | H3 |
| Article excerpt | 14–16px | 400 | #64748b | 2 lines max |
| Category | 12px | 500 | #6366f1 | Uppercase, link |
| Read time | 12px | 400 | #64748b | "• X min to read" |
| Tag | 12px | 500 | #6366f1 or #64748b | #Tag format |
| Author name | 14px | 500 | #1a1a2e | |
| Author role | 12px | 400 | #64748b | |

---

## 4. Layout & Components

### Hero
- Max-width: 720px, centered
- Padding: 64–80px vertical

### Featured Posts (2 cards)
- **Desktop:** 50/50, 32px gap
- **Tablet:** Stacked
- **Card:** Image (aspect 16:9 or 1.78:1), category + read time, title, excerpt, author block
- **Author block:** 40px avatar, name, role

### Article Card Structure
```
┌─────────────────────────────┐
│ [Image 16:9, 2800×1450 px]  │
├─────────────────────────────┤
│ CATEGORY • Sub-category      │
│ • X min to read              │
│ ### Title (2 lines max)      │
│ Excerpt (2 lines)             │
│ #Tag1 #Tag2                  │
└─────────────────────────────┘
```

### Grid
- **Desktop (≥1024px):** 3 columns, 32px gap
- **Tablet (768–1023px):** 2 columns, 24px gap
- **Mobile:** 1 column, 24px gap

### Filters
- **Category:** Dropdown (Creative Leadership, Customer Stories, All Things Brand, Video Marketing, AI Powered Creative, Digital Marketing, etc.)
- **Sub-category:** Dropdown (Website Design, Video Production, Ad Creative, etc.)
- **Sort by:** Latest (default), Popular, etc.

---

## 5. Component Spec (React/HTML)

```tsx
interface ArticleCardProps {
  slug: string;
  image: string;
  category: string;
  subCategory?: string;
  readTimeMinutes: number;
  title: string;
  excerpt: string;
  tags: string[];
  author?: { name: string; role: string; avatar?: string };
}

interface FeaturedPostProps extends ArticleCardProps {
  // Larger layout, full excerpt
}

interface BlogPageProps {
  featuredPosts: FeaturedPostProps[];
  trendingTopic?: { label: string; article: ArticleCardProps };
  articles: ArticleCardProps[];
  filters: { category: string[]; subCategory: string[] };
}
```

---

## 6. Interaction States (Hi-Fi)

| Element | Default | Hover |
|---------|---------|-------|
| Article card | border 1px #e2e8f0 | shadow 0 8px 24px rgba(0,0,0,0.08), translateY(-2px) |
| Category/tag link | color #6366f1 | color #4f46e5, underline |
| Load More | BG #6366f1, text #fff | BG #4f46e5 |
| Filter dropdown | border #e2e8f0 | border #6366f1 (focused) |

---

## 7. CSS Variables (Copy-Paste Ready)

```css
:root {
  /* Blog page */
  --blog-page-bg: #ffffff;
  --blog-hero-max-width: 720px;
  --blog-card-radius: 12px;
  --blog-card-gap: 32px;
  --blog-image-aspect: 16 / 9;
}
```

---

## 8. Responsive Breakpoints

| Breakpoint | Featured | Grid | Filters |
|------------|----------|------|---------|
| ≥1024px | 2 cols side-by-side | 3 cols | Inline |
| 768–1023px | Stacked | 2 cols | Inline or wrapped |
| <768px | Stacked | 1 col | Stacked / drawer |

---

## 9. Key Content (Real)

- **Hero:** "Creative _Performance_" — "Creative ideas, practical tips and insider info—the Superside blog helps your team get great design done at scale."
- **Featured examples:** "Get off the conveyor belt: 22 leaders on _the secret to great work_" (CREATIVE LEADERSHIP, 6 min), "How a Fortune 500 doubled their AI adoption" (CUSTOMER STORIES, 3 min)
- **Trending:** AI-Powered Creative → "10 Best AI Ad Creative Generators & Tools in 2026 (Tested)"
- **Categories:** Creative Leadership, Customer Stories, All Things Brand, Video Marketing, AI Powered Creative, Digital Marketing, Website Design Development
- **Tags:** #Expert Insights, #Examples, #Enterprise, #Creative Partners, #AI Adoption, #AI+Tools, #AI+Images

---

## 10. References

| Resource | Path |
|----------|------|
| Base style | `07-superside-ai-creative-prototypes.md` |
| Lo-fi skill | `.agents/skills/design/low-fidelity-prototyping/SKILL.md` |
| Hi-fi skill | `.agents/skills/design/high-fidelity-prototyping/SKILL.md` |
| Source | [superside.com/blog](https://www.superside.com/blog) |

---

**Path:** `tasks/style-guide/12-superside-blog-prototypes.md`  
**Updated:** 2026-02-12
