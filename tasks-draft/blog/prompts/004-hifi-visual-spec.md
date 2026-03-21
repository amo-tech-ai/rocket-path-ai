---
task_id: 004-BLOG-HF
title: Blog Page — High-Fidelity Visual Specification
phase: CORE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: /color-palette, /high-fidelity-prototyping
subagents: []
depends_on: [003-BLOG-WF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`), BlogPost (`/blog/:slug`) |
| **Features** | Color system, typography, spacing, card design, gradient specs |
| **Reference** | `tasks/blog/infographics-style.md`, `tasks/blog/02-lofi-wireframes.md` |
| **Real-World** | "Apply the visual layer — every color references a token, every size references the scale" |

## Description

Apply the full visual design system to the wireframes. Define color tokens, typography scale, spacing rhythm, card surfaces, gradient thumbnails, border treatments, and elevation. Every visual decision references the infographics style guide.

## Rationale

**Problem:** Ad-hoc color and spacing choices create visual inconsistency across pages.
**Solution:** Apply the existing design system from `infographics-style.md` to ensure the blog page matches the report pages.
**Impact:** Blog index feels like part of the same editorial brand as the reports.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Visitor | See the blog index and reports feel like one brand | I trust the entire site |
| Developer | Have exact color tokens and spacing values | I don't guess during implementation |

## Goals

1. **Primary:** Complete visual spec covering color, typography, spacing, and components
2. **Quality:** Every value references a design token — no raw hex or one-off sizes

## Acceptance Criteria

- [ ] Color system table: token name → hex → usage
- [ ] Typography table: element → font → size → weight → color
- [ ] Spacing scale documented: section padding, card padding, grid gaps
- [ ] FeaturedCard component spec (layout, gradient area, icon, content, hover state)
- [ ] StoryCard component spec (layout, gradient area, icon, content, hover state)
- [ ] DarkCTASection props documented
- [ ] Gradient specs per report (6 gradients with Tailwind classes)
- [ ] Elevation/border table: element → default → hover
- [ ] Responsive breakpoint behavior documented per section

## Skill Usage

### `infographics-style.md` — Primary authority

This is the design system source of truth. Read these sections:

- **Section 1 (Design Philosophy):** Quiet authority, data leads prose, whitespace is structural
- **Section 2 (Layout System):** `container-premium`, grid patterns, section padding scale
- **Section 3 (Typography):** Playfair Display (font-display) + Inter (font-body), full type scale
- **Section 4 (Color System):** IVORY, DEEP_GREEN, FOREST, TEAL, SLATE, LAVENDER, CORAL, TEXT_PRIMARY, INDIGO
- **Section 7 (Micro Details):** Card borders, dividers, surface colors

### `/color-palette` — Use for contrast verification

After defining the color assignments, run contrast checks:
- Card text on card surface (`TEXT_PRIMARY` on `#FAFAF8`)
- Badge text on badge background
- CTA button text on button background
- Subtitle text on ivory (`SLATE` on `IVORY`)
- Verify all pass WCAG AA (4.5:1 for body text, 3:1 for large text)

### `/high-fidelity-prototyping` — Use for component spec format

Follow the skill's spec format for each component:
- Visual specs table (dimensions, padding, typography, colors)
- All states (default, hover, focus, active)
- Accessibility notes (ARIA roles, keyboard nav, touch targets)

### Reference

- Read `tasks/blog/infographics-style.md` (the design system)
- Read `tasks/blog/02-lofi-wireframes.md` (the structure to dress)
- Read `tasks/blog/blog-redesign-plan.md` for gradient specs and card design

## Output

Save visual spec to `tasks/blog/03-hifi-spec.md`.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Doc | `tasks/blog/03-hifi-spec.md` | Create |

---

## Workflow

```
1. Read infographics-style.md Sections 1-4, 7
2. Read wireframes for structure reference
3. Define color token assignments for blog page
4. Define typography assignments per element
5. Invoke /color-palette skill — run contrast checks
6. Spec FeaturedCard and StoryCard components
7. Spec DarkCTASection usage
8. Document gradient thumbnails (6 reports)
9. Document responsive breakpoint behavior
10. Save to tasks/blog/03-hifi-spec.md
```
