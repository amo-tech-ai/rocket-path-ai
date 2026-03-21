---
task_id: 006-BLOG-PT
title: Blog Page — Standalone Prototype
phase: MVP
priority: P1
status: Not Started
estimated_effort: 1 day
skill: /web-artifacts-builder
subagents: []
depends_on: [005-BLOG-IA]
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`) prototype |
| **Features** | Standalone React + Tailwind artifact, all 5 sections, responsive |
| **Reference** | `tasks/blog/03-hifi-spec.md`, `tasks/blog/04-interaction-states.md` |
| **Real-World** | "Build a throwaway prototype to validate the design in a real browser" |

## Description

Build a standalone React prototype of the blog index page using `/web-artifacts-builder`. This is a self-contained HTML artifact — not integrated into the main app. Purpose: validate the visual design, responsive behavior, and animations in a real browser before committing to production code.

## Rationale

**Problem:** Specs on paper can't reveal responsive issues, animation feel, or visual weight problems.
**Solution:** Build a real prototype using the same stack (React + Tailwind + shadcn/ui) and evaluate in-browser.
**Impact:** Design issues caught before production implementation. Prototype code can be referenced during production.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Designer | See the design running in a browser | I validate before committing to production |
| Developer | Have a working reference implementation | I know the exact patterns to follow |

## Goals

1. **Primary:** Standalone HTML prototype of BlogIndex with all 5 sections
2. **Quality:** Looks and behaves identically to the spec at desktop, tablet, and mobile breakpoints

## Acceptance Criteria

- [ ] Prototype renders all 5 sections (Hero, Featured, Top Stories, More Reports, CTA)
- [ ] FeaturedCard: horizontal on desktop, stacked on mobile
- [ ] StoryCard: grid responsive (3-col → 2-col → 1-col)
- [ ] Gradient thumbnails render correctly for all 6 reports
- [ ] Lucide icons visible on gradient backgrounds
- [ ] Scroll animations trigger on viewport entry
- [ ] Card hover states work (border, shadow, icon scale)
- [ ] CTA section renders with dark background and 2 buttons
- [ ] Prototype bundles to a single HTML file

## Skill Usage

### `/web-artifacts-builder` — Use for prototype creation

Follow the skill's workflow:

1. **Initialize:** `bash scripts/init-artifact.sh blog-prototype`
2. **Develop:** Build the 5 sections using hi-fi spec and animation spec
3. **Bundle:** `bash scripts/bundle-artifact.sh` → produces `bundle.html`
4. **Validate:** Open `bundle.html` in browser, test all breakpoints

Stack provided by the skill:
- React 18 + TypeScript + Vite
- Tailwind CSS with shadcn/ui theming
- 40+ shadcn components pre-installed
- Path aliases (`@/`) configured

Apply the skill's anti-slop guidelines:
- Avoid excessive centered layouts
- Avoid uniform rounded corners everywhere
- Avoid Inter as the only font — use Playfair Display for display text

### Design tokens to apply

From `tasks/blog/infographics-style.md`:

- **Fonts:** `font-display` (Playfair Display), `font-body` (Inter)
- **Page background:** IVORY `#F1EEEA`
- **Card surface:** `#FAFAF8`
- **Primary accent:** FOREST `#0E3E1B`
- **Text:** TEXT_PRIMARY `#212427`, SLATE `#697485`
- **Container:** `max-w-7xl` with `px-4 sm:px-6 lg:px-8`

### Reference

- Read `tasks/blog/03-hifi-spec.md` for all visual specs
- Read `tasks/blog/04-interaction-states.md` for animation timing
- Read `tasks/blog/blog-redesign-plan.md` for gradient values

## Output

Prototype artifact at `tasks/blog/prototype/bundle.html`.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Prototype | `tasks/blog/prototype/` | Create directory |
| Artifact | `tasks/blog/prototype/bundle.html` | Generate via bundle script |

---

## Workflow

```
1. Invoke /web-artifacts-builder skill
2. Read hi-fi spec and interaction states
3. Initialize artifact project
4. Build Section A (Editorial Hero)
5. Build Section B (FeaturedCard)
6. Build Section C (Top Stories — 2 StoryCards)
7. Build Section D (More Reports — 3 StoryCards)
8. Build Section E (CTA Strip)
9. Add Framer Motion scroll animations
10. Add card hover transitions
11. Test at 375px, 768px, 1280px
12. Bundle to single HTML
13. Save to tasks/blog/prototype/
```
