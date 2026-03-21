---
task_id: 007-BLOG-PI
title: Blog Page — Production Implementation
phase: MVP
priority: P0
status: Not Started
estimated_effort: 3 days
skill: /frontend-design, /framer-motion-animator
subagents: [code-reviewer]
depends_on: [006-BLOG-PT]
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`), BlogPost (`/blog/:slug`) |
| **Features** | Complete page rewrite, data model, routing, lazy loading |
| **Reference** | All specs in `tasks/blog/`, prototype at `tasks/blog/prototype/` |
| **Real-World** | "Implement the production blog pages in the main app" |

## Description

Implement the blog pages in production. Rewrite `src/pages/BlogIndex.tsx` with the new editorial layout. Update `src/pages/BlogPost.tsx` for report routing with lazy loading. This is the main implementation task — all prior prompts were design work.

## Rationale

**Problem:** The current blog page needs to match the validated design from the prototype.
**Solution:** Implement production-quality React components following the specs and prototype.
**Impact:** Users see the new editorial blog at `/blog` with all 6 reports accessible.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Visitor | Browse research reports on an editorial blog page | I find relevant AI industry analysis |
| Visitor | Click any report card | I navigate to the full report |
| Visitor | See a CTA to validate my startup idea | I convert from reader to product user |

## Goals

1. **Primary:** Production blog pages that match the validated design spec
2. **Quality:** `npm run build` passes with zero errors. All routes return 200.

## Acceptance Criteria

- [ ] BlogIndex renders 5 sections: Hero, Featured, Top Stories, More Reports, CTA
- [ ] BlogPost interface updated: removed `kpis[]`, added `gradient`, `icon`, `featured`
- [ ] 6 blog posts with correct data (titles, subtitles, categories, gradients, icons)
- [ ] FeaturedCard: horizontal on desktop (grid-cols-2), stacked on mobile
- [ ] StoryCard: vertical card with gradient top, text below
- [ ] Section C: `md:grid-cols-2 gap-6`
- [ ] Section D: `sm:grid-cols-2 lg:grid-cols-3 gap-6`
- [ ] DarkCTASection reused with correct props
- [ ] Framer Motion scroll animations on all sections
- [ ] Stagger delay on card groups (index * 0.1s)
- [ ] Card hover: border-primary/30, shadow, icon scale-110
- [ ] BlogPost routes all 6 slugs to correct report components
- [ ] FashionAiReport lazy-loaded with Suspense fallback
- [ ] Invalid slug redirects to `/blog`
- [ ] ErrorBoundary wraps report rendering
- [ ] `npm run build` passes
- [ ] Dev server renders `/blog` (200) and `/blog/fashion-ai-2026` (200)

## Skill Usage

### `/frontend-design` — Use for implementation quality

Reference the skill's implementation guidance:
- Tailwind classes for all styling (no inline styles except dynamic values)
- shadcn/ui components for Badge, Button
- `@/` path alias for all imports
- Component composition: FeaturedCard and StoryCard as inline components (not extracted — they're page-specific)

### `/framer-motion-animator` — Use for animation implementation

Implement these patterns:

**Hero (on mount):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

**Cards (whileInView with stagger):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
>
```

**Card hover:** Use CSS `transition-all duration-300` and Tailwind `group-hover:` — not Framer Motion for hover.

### Reference

- Read `tasks/blog/03-hifi-spec.md` for all visual specs
- Read `tasks/blog/04-interaction-states.md` for animation timing
- Read `tasks/blog/blog-redesign-plan.md` for complete layout plan
- Read prototype code at `tasks/blog/prototype/` for reference implementation
- Read existing `src/components/blog/DarkCTASection.tsx` for CTA component API
- Read existing `src/pages/BlogPost.tsx` for report routing pattern

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/pages/BlogIndex.tsx` | Complete rewrite |
| Page | `src/pages/BlogPost.tsx` | Update report routing |
| Component | `src/components/blog/DarkCTASection.tsx` | Reuse (no changes) |
| Component | `src/components/ErrorBoundary.tsx` | Reuse (no changes) |
| Route | `src/App.tsx` | Verify `/blog` and `/blog/:slug` routes |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Invalid slug (`/blog/nonexistent`) | Redirect to `/blog` via `<Navigate replace />` |
| Report component crash | ErrorBoundary catches, shows recovery UI |
| FashionAiReport slow load | Suspense spinner (min-h-[60vh]) |
| Very long subtitle text | `line-clamp-2` truncation on StoryCard |

---

## Production Ready Checklist

- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] No `console.log` in production code
- [ ] All imports resolve correctly
- [ ] Loading state (Suspense spinner) renders
- [ ] Error state (ErrorBoundary) renders
- [ ] All 6 report routes work
- [ ] Responsive at 375px, 768px, 1024px, 1280px

---

## Workflow

```
1. Read all spec docs (03-hifi-spec.md, 04-interaction-states.md, blog-redesign-plan.md)
2. Read existing files: DarkCTASection.tsx, BlogPost.tsx, ErrorBoundary.tsx
3. Reference prototype code
4. Implement BlogIndex.tsx (data model + 5 sections + animations)
5. Update BlogPost.tsx (6 report routes + lazy loading + error boundary)
6. Run npm run build — fix any errors
7. Start dev server, verify /blog returns 200
8. Verify /blog/fashion-ai-2026 returns 200
9. Test responsive breakpoints
10. Run code-reviewer subagent
```
