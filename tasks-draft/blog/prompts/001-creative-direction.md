---
task_id: 001-BLOG-CD
title: Blog Page — Creative Direction
phase: CORE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: /frontend-design
subagents: []
depends_on: []
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`) |
| **Features** | Visual direction, tone, differentiation |
| **Reference** | `tasks/blog/blog-redesign-plan.md` |
| **Real-World** | "Establish the editorial voice before touching layout" |

## Description

Define the creative direction for the blog index page. This is a magazine-style hub for 6 AI research reports targeting founders, executives, and investors. The aesthetic is luxury editorial — McKinsey whitepapers crossed with high-fashion lookbooks.

## Rationale

**Problem:** Without a defined creative direction, the page risks looking like generic AI slop — centered layouts, purple gradients, Inter font everywhere.
**Solution:** Use the `/frontend-design` skill to force deliberate design decisions before any code.
**Impact:** Every subsequent prompt inherits this direction — typography, color, spacing, personality.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | Land on a blog that feels authoritative | I trust the reports before reading them |
| Investor | See a professional editorial layout | I take the content seriously |

## Goals

1. **Primary:** Define purpose, tone, constraints, and differentiation for the blog page
2. **Quality:** Creative brief fits on one page

## Acceptance Criteria

- [ ] Purpose statement: "This page helps [audience] do [action] so they [outcome]"
- [ ] Tone defined (e.g., quiet authority, not startup-shouty)
- [ ] Visual personality articulated (what it IS and what it is NOT)
- [ ] Anti-patterns listed (what to avoid — the "Never Use" list)
- [ ] Typography direction chosen (serif display + sans body)
- [ ] Color direction chosen (muted palette, accent restraint)

## Skill Usage

### `/frontend-design` — Use FIRST

Read the skill, then work through its design thinking framework:

1. **Purpose:** What is this page for? (Inform — time on page, scroll depth)
2. **Tone:** Quiet authority. Data-led. Not playful, not corporate-stiff.
3. **Constraints:** 6 reports only. No images — gradient placeholders. No filtering/search.
4. **Differentiation:** What makes this NOT look like every other startup blog?

Apply the skill's "Never Use" list to explicitly ban:
- Overused fonts for this context
- Cliched gradients
- Predictable card layouts
- Generic AI aesthetics

### Reference

- Read `tasks/blog/blog-redesign-plan.md` for the layout plan
- Read `tasks/blog/infographics-style.md` Section 1 (Design Philosophy) for the aesthetic already established in the report pages

## Output

Save creative brief to `tasks/blog/00-creative-direction.md`.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Doc | `tasks/blog/00-creative-direction.md` | Create |

---

## Workflow

```
1. Invoke /frontend-design skill
2. Read blog-redesign-plan.md and infographics-style.md Section 1
3. Work through design thinking framework
4. Write creative brief
5. Save to tasks/blog/00-creative-direction.md
```
