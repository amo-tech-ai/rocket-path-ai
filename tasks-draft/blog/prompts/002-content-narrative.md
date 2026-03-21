---
task_id: 002-BLOG-CN
title: Blog Page — Content Structure & Narrative
phase: CORE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: /data-storytelling
subagents: []
depends_on: [001-BLOG-CD]
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`) |
| **Features** | Section content outline, copy hierarchy, CTA messaging |
| **Reference** | `tasks/blog/blog-redesign-plan.md`, `tasks/blog/00-creative-direction.md` |
| **Real-World** | "Define what each section communicates before designing how it looks" |

## Description

Outline the content structure for all 5 sections of the blog index page. Define the narrative arc that leads a visitor from landing to clicking a report or CTA. Write real headlines, subtitles, and CTA copy — no Lorem Ipsum.

## Rationale

**Problem:** Designing layout before content leads to decorative pages that don't convert.
**Solution:** Use `/data-storytelling` narrative frameworks to structure content with a clear arc.
**Impact:** Every section has a defined communication purpose, and the page tells a story top-to-bottom.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Visitor | Scan the page and understand what's offered in 5 seconds | I decide whether to read a report |
| Founder | See the most relevant report featured prominently | I click through without hunting |

## Goals

1. **Primary:** Define content for all 5 sections with real copy
2. **Quality:** Page narrative follows Hook → Context → Content → CTA arc

## Acceptance Criteria

- [ ] Section A (Hero): headline, subtitle, badge text finalized
- [ ] Section B (Featured): title, subtitle, category, read-time for featured report
- [ ] Section C (Top Stories): titles, subtitles, categories for 2 reports
- [ ] Section D (More Reports): titles, subtitles, categories for 3 reports
- [ ] Section E (CTA): headline, subtitle, primary + secondary button copy
- [ ] Content hierarchy ranked by visual weight (featured > top > more > CTA)
- [ ] Narrative arc documented: what each section communicates and why it's in that order

## Skill Usage

### `/data-storytelling` — Use for narrative structure

Apply the skill's **Narrative Arc** framework to the page:

1. **Hook (Section A — Hero):** Badge + headline grab attention. "AI Intelligence Reports" tells you what this is. Subtitle tells you who it's for.
2. **Context (Section B — Featured):** The flagship report establishes credibility and depth.
3. **Rising Action (Sections C & D — Stories Grid):** More reports build breadth — different industries, different angles.
4. **Resolution (Section E — CTA):** Convert interest into action — "Start validating your startup idea."

Use the skill's **headline formula:**
```
[Specific Number] + [Business Impact] + [Actionable Context]
```

For each report card, the title and subtitle should follow this pattern:
- Title: The specific report topic (e.g., "The State of Fashion AI — 2026")
- Subtitle: The hook question or key finding (e.g., "How big is the AI opportunity in fashion?")

### Reference

- Read `tasks/blog/blog-redesign-plan.md` for section layout
- Read `tasks/blog/00-creative-direction.md` for tone and voice
- Read existing report data for accurate titles: `src/pages/BlogIndex.tsx` (blogPosts array)

## Output

Save content structure to `tasks/blog/01-content-structure.md`.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Doc | `tasks/blog/01-content-structure.md` | Create |

---

## Workflow

```
1. Invoke /data-storytelling skill
2. Read blog-redesign-plan.md and creative direction doc
3. Read existing BlogIndex.tsx for current report data
4. Structure narrative arc across 5 sections
5. Write real copy for each section
6. Save to tasks/blog/01-content-structure.md
```
