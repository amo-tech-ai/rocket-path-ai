---
task_id: 008-BLOG-HA
title: Blog Page — Handoff & Audit
phase: MVP
priority: P0
status: Not Started
estimated_effort: 1 day
skill: /high-fidelity-prototyping, /ui-ux-pro-max, /accessibility
subagents: [code-reviewer, security-auditor]
depends_on: [007-BLOG-PI]
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`), BlogPost (`/blog/:slug`) |
| **Features** | Developer handoff spec, accessibility audit, pre-launch checklist |
| **Reference** | All specs in `tasks/blog/`, production code in `src/pages/` |
| **Real-World** | "Verify everything works, document the spec, ship it" |

## Description

Final quality gate before the blog pages ship. Generate developer handoff documentation (per-screen, per-component, per-flow specs), run a UI/UX pre-delivery audit, and verify WCAG 2.1 AA accessibility compliance. This prompt produces documentation and fixes — no new features.

## Rationale

**Problem:** Production code exists but lacks spec documentation and hasn't been audited for accessibility or UX quality.
**Solution:** Use three complementary skills to audit, document, and verify the blog pages.
**Impact:** Pages ship with confidence — documented, accessible, and quality-verified.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | Reference a handoff spec for the blog pages | I can maintain or extend them without guessing |
| Visitor using a screen reader | Navigate the blog with keyboard and assistive tech | I can access all content |
| QA reviewer | Check a pre-launch checklist | I confirm nothing was missed |

## Goals

1. **Primary:** Complete handoff documentation and pass all audit checks
2. **Quality:** Lighthouse accessibility score > 90. Zero critical WCAG violations.

## Acceptance Criteria

- [ ] Developer handoff doc covers all 5 BlogIndex sections (grid, spacing, typography, color tokens)
- [ ] Per-component spec for FeaturedCard and StoryCard (props, states, responsive behavior)
- [ ] Per-flow spec for BlogPost routing (entry points, loading, error, navigation)
- [ ] UI/UX pre-delivery checklist passes (all 8 priority levels from `/ui-ux-pro-max`)
- [ ] All interactive elements have visible focus states (`:focus-visible` ring)
- [ ] All images/icons have appropriate `aria-label` or `alt` text
- [ ] Color contrast ratio meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] Keyboard navigation works: Tab through all cards, Enter activates links
- [ ] `prefers-reduced-motion` disables Framer Motion animations
- [ ] Semantic HTML: proper heading hierarchy (h1 > h2 > h3, no skips)
- [ ] Lighthouse accessibility audit > 90
- [ ] All findings documented with fix status

## Skill Usage

### `/high-fidelity-prototyping` — Use for handoff documentation

Generate per-screen, per-component, and per-flow specs:

**Per-screen (BlogIndex, BlogPost):**
- Grid system and spacing measurements
- All colors reference design tokens (not raw hex)
- Typography specs (font, size, weight, line-height, color)
- Responsive breakpoint behavior at 375px, 768px, 1024px, 1280px

**Per-component (FeaturedCard, StoryCard, DarkCTASection):**
- All visual states with examples (default, hover, focus)
- Interaction behavior description
- Content constraints (min/max length, truncation rules)
- Touch target minimum: 44x44px

**Per-flow (BlogPost routing):**
- Entry points: card click from BlogIndex, direct URL
- Navigation destinations: report component or redirect to `/blog`
- Loading state: Suspense spinner (`min-h-[60vh]`)
- Error state: ErrorBoundary recovery UI

### `/ui-ux-pro-max` — Use for pre-delivery audit

Run through all 8 priority levels:
1. Layout & spacing consistency
2. Typography hierarchy
3. Color and contrast
4. Interactive element states
5. Responsive behavior
6. Loading and error states
7. Content overflow handling
8. Animation and transition quality

Document each finding as: pass, warning, or fail. Fix any fails before marking complete.

### `/accessibility` — Use for WCAG 2.1 AA compliance

Run the 6-phase accessibility workflow:

1. **Semantic structure:** Verify heading hierarchy, landmark regions, list semantics
2. **Keyboard navigation:** Tab order through all interactive elements, Enter/Space activation
3. **Focus management:** Visible `:focus-visible` ring on all focusable elements
4. **Screen reader:** `aria-label` on icon-only elements, `aria-hidden` on decorative gradients
5. **Motion:** `prefers-reduced-motion` media query disables `whileInView` animations
6. **Color:** Contrast ratios meet 4.5:1 (normal text) and 3:1 (large text / UI components)

### Reference

- Read production `src/pages/BlogIndex.tsx` for current implementation
- Read production `src/pages/BlogPost.tsx` for routing implementation
- Read `tasks/blog/03-hifi-spec.md` for design token reference
- Read `tasks/blog/04-interaction-states.md` for state definitions
- Read `tasks/blog/infographics-style.md` Section 4 (Color System) for contrast requirements

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Doc | `tasks/blog/05-developer-handoff.md` | Create |
| Doc | `tasks/blog/06-launch-checklist.md` | Create |
| Page | `src/pages/BlogIndex.tsx` | Fix — accessibility issues found during audit |
| Page | `src/pages/BlogPost.tsx` | Fix — accessibility issues found during audit |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Screen reader on gradient cards | `aria-label` describes the report title and category |
| Keyboard-only user on card grid | Tab moves through cards in reading order, Enter navigates |
| `prefers-reduced-motion: reduce` | All Framer Motion animations disabled, content visible immediately |
| High contrast mode | Cards remain distinguishable via borders (not just color) |
| Zoom to 200% | Layout remains usable, no horizontal scroll, text reflows |

---

## Production Ready Checklist

- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] Lighthouse accessibility > 90
- [ ] Keyboard navigation works end-to-end
- [ ] Screen reader announces all content correctly
- [ ] `prefers-reduced-motion` respected
- [ ] Developer handoff doc complete
- [ ] Pre-launch checklist complete
- [ ] All audit findings resolved or documented as known issues

---

## Workflow

```
1. Read production BlogIndex.tsx and BlogPost.tsx
2. Invoke /high-fidelity-prototyping — generate handoff spec
3. Save to tasks/blog/05-developer-handoff.md
4. Invoke /ui-ux-pro-max — run pre-delivery audit
5. Invoke /accessibility — run WCAG 2.1 AA audit
6. Fix any critical/high findings in production code
7. Re-run npm run build to verify fixes
8. Compile launch checklist with all audit results
9. Save to tasks/blog/06-launch-checklist.md
10. Run code-reviewer and security-auditor subagents
```
