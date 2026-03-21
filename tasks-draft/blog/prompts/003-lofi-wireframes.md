---
task_id: 003-BLOG-WF
title: Blog Page — Low-Fidelity Wireframes
phase: CORE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: /low-fidelity-prototyping
subagents: []
depends_on: [002-BLOG-CN]
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`), BlogPost (`/blog/:slug`) |
| **Features** | ASCII wireframes for desktop, tablet, mobile |
| **Reference** | `tasks/blog/blog-redesign-plan.md`, `tasks/blog/01-content-structure.md` |
| **Real-World** | "Validate structure and hierarchy before any visual polish" |

## Description

Create low-fidelity wireframes for the BlogIndex and BlogPost pages. Black and white only. No colors, no gradients, no branding. Focus on content hierarchy, spatial relationships, and responsive behavior across 3 breakpoints.

## Rationale

**Problem:** Jumping to hi-fi design hides structural problems under visual polish.
**Solution:** ASCII wireframes force evaluation of hierarchy, flow, and CTA placement without distraction.
**Impact:** Structural issues are caught before any code is written.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Designer | See the page structure without visual noise | I validate the information hierarchy |
| Developer | Understand the layout grid before coding | I know exactly what to build |

## Goals

1. **Primary:** Wireframes for all breakpoints — desktop (1280px), tablet (768px), mobile (375px)
2. **Quality:** Real section titles and content labels, not placeholder text

## Acceptance Criteria

- [ ] BlogIndex desktop wireframe with all 5 sections (Hero, Featured, Top Stories, More Reports, CTA)
- [ ] BlogIndex tablet wireframe showing responsive grid changes
- [ ] BlogIndex mobile wireframe showing single-column stack
- [ ] BlogPost desktop wireframe showing shell layout (Header → Report → Footer)
- [ ] BlogPost loading state wireframe (spinner)
- [ ] BlogPost error state wireframe (redirect to /blog)
- [ ] Navigation flows documented (which card links where)
- [ ] Content hierarchy validated: most important content is biggest/first

## Skill Usage

### `/low-fidelity-prototyping` — Use for wireframe creation

Follow the skill's rules:

1. **Grayscale only** — black, white, grays. No color tokens.
2. **Use boxes with labels** for images: `[Hero Image]`, `░░░ [Icon] ░░░` for gradient areas
3. **Real section titles** — "AI Intelligence Reports" not "Headline Here"
4. **Show hierarchy through size and position**, not styling
5. **Annotate interactive elements**: `[Button]`, `→` for navigation links
6. **Draw all three breakpoints**: desktop, tablet, mobile

Validate against the skill's checklist:
- Does the content flow make sense top to bottom?
- Is the most important thing (featured report) the biggest/first thing?
- Can users find the CTA without scrolling forever?
- Does the hierarchy feel right without any visual polish?

### Reference

- Read `tasks/blog/blog-redesign-plan.md` for the 5-section layout
- Read `tasks/blog/01-content-structure.md` for real content to put in wireframes
- Read `tasks/blog/infographics-style.md` Section 2 (Layout System) for grid patterns

## Output

Save wireframes to `tasks/blog/02-lofi-wireframes.md`.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Doc | `tasks/blog/02-lofi-wireframes.md` | Create |

---

## Workflow

```
1. Invoke /low-fidelity-prototyping skill
2. Read content structure and blog redesign plan
3. Draw BlogIndex desktop wireframe (all 5 sections)
4. Draw BlogIndex tablet wireframe
5. Draw BlogIndex mobile wireframe
6. Draw BlogPost wireframes (normal, loading, error)
7. Document navigation flows
8. Validate against skill checklist
9. Save to tasks/blog/02-lofi-wireframes.md
```
