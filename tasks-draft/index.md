# Tasks Directory — Index & Cleanup Guide

> **Updated:** 2026-02-24 | **Version:** 1.0
> **Total files:** ~750 (16 root files + 27 subdirectories)
> **Verdict:** Most docs are stale. Only ~10 docs and ~8 folders are needed for the active plan.

---

## The Active Plan (from summary.md)

5 phases, 24 tasks, ~75 days:

| Phase | What | Status |
|-------|------|:------:|
| 1. CORE | Fix E2E flow (Chat->Report->Canvas->Dashboard) | DONE |
| 2. MVP | V3 consulting report with 9 dimension pages | IN PROGRESS |
| 3. POST-MVP | Sprint import, enhanced dashboard, research agents | Planned |
| 4. ADVANCED | RAG planning, financial agent, chat-driven editing | Planned |
| 5. PRODUCTION | Security, performance, mobile, GDPR | Planned |

**Three strategic imperatives:** (1) Prove V2 before building V3, (2) Simplify for launch (35 tables, 12 EFs, 5 screens), (3) The report IS the product.

---

## Root Files (16 files)

| File | Lines | Last Updated | Purpose | Needed? | Why |
|------|:-----:|:------------:|---------|:-------:|-----|
| `summary.md` | 586 | Feb 23 | Master project summary, plan, stats, skills index | **YES** | Source of truth for the plan |
| `prd.md` | 1050 | Feb 23 | PRD v10.0 — requirements, user journeys, features, screens | **YES** | Master requirements doc |
| `next-steps.md` | 253 | Feb 23 | Active task list (9 sections, 5 phases, priority-ordered) | **YES** | Execution tracker — what to work on next |
| `roadmap.md` | 621 | Feb 23 | Technical roadmap v4.0 — engineering priorities, resource allocation | **YES** | Single source for delivery timeline |
| `strategy.md` | 412 | Feb 23 | Strategy v1.1 — Report V3 upgrade, MVP buildout, launch readiness | **YES** | Architecture philosophy and approach |
| `index-progress.md` | 1420 | Feb 23 | Master progress tracker v10.0 — audits, fixes, 5-phase plan | **YES** | Tracks completion across all work |
| `sub-agents.md` | 698 | Feb 23 | Guide to 10 agents + 37 skills | **YES** | Reference for AI development work |
| `style-guide.md` | 1223 | Feb 16 | Design system v1.0 — tokens, components, infographic specs | **YES** | Required for any UI work |
| `changelog` | 1863 | Feb 19 | Complete version history (v0.1 through v0.10.25) | **YES** | Change log — keep but rarely referenced |
| `TASK-TEMPLATE.md` | 242 | Feb 14 | Template for creating new task prompts | **YES** | Template — needed when creating new tasks |
| `features.md` | 361 | Feb 10 | Feature inventory (42 pages, 31 EFs, ratings) | MAYBE | Overlaps with PRD; useful as quick reference |
| `sitemap.md` | 284 | Feb 8 | Screen inventory (41 pages, 8 dashboards) | MAYBE | May be outdated; PRD has newer route list |
| `index-prompts.md` | 404 | Feb 10 | Prompt task index (95+ prompts) | NO | Superseded by `prompts/00-index.md` |
| `product-roadmap.md` | 634 | Feb 10 | Product roadmap v1.0 | NO | Superseded by `roadmap.md` v4.0 |
| `timeline.md` | 528 | Feb 8 | Gantt timeline v1.2 | NO | Superseded by `roadmap.md` v4.0 |
| `notes.md` | 800 | Feb 13 | Session notes (Composer V2 work) | NO | Stale session notes — no ongoing value |
| `TT-000-index.md` | 289 | Feb 10 | Validator V2 ticket index (TT-001 to TT-006) | NO | V2 is done; V3 plan lives in `next-steps.md` |
| `universal-product-system.md` | 414 | Feb 4 | Blueprint for building products with AI | NO | Philosophical doc — not actionable for any phase |

---

## Subdirectories (27 folders)

| Folder | Files | Purpose | Needed? | Why |
|--------|:-----:|---------|:-------:|-----|
| `prompts/` | 38 | Implementation prompts for all 5 phases (core/, mvp/, post-mvp/, advanced/, production/) | **YES** | Primary task specs — this IS the work |
| `wireframes/` | 27 | V3 screen wireframes (00-08 core + 50-58 dimensions + drafts) | **YES** | Required for MVP-04, MVP-05 (dimension pages) |
| `mermaid/` | 16 | 15 architecture + flow diagrams (user journey, pipeline, ERD, etc.) | **YES** | System documentation — actively maintained |
| `data/` | 11 | ERDs (6), dataflows (3), Supabase strategy, live audit | **YES** | Database reference for migration work |
| `validator/` | 5 | Validator wireframes (luxury redesign spec) | **YES** | Required for V3 report design (MVP-05) |
| `vector/` | 17 | Vector DB / RAG implementation specs + progress tracker | **YES** | Required for Phase 4 (ADV-01 RAG planning) |
| `testing/` | 1 | QA checklist for validator E2E flow | **YES** | Needed for any phase — keep and expand |
| `plans/` | 6 | Phase-specific planning docs (Feb 13-21) | MAYBE | Recent plans (V3 report, skills reorg) still relevant |
| `dashboard/` | 1 | Dashboard redesign master prompt | MAYBE | Useful for Phase 2-3 dashboard work |
| `design/` | ~100 | Design system, chart prompts, style guides, BCG/Superside | MAYBE | Massive — useful for design work, but most is reference |
| `style-guide/` | 15 | Lean style guides, Superside prototypes | MAYBE | Overlaps with root `style-guide.md` and `design/` |
| `diagrams/` | 8 | SVG architecture diagrams (ERD, flow, auth) | MAYBE | Visual reference — superseded by `mermaid/` |
| `audit/` | 26 | Completed audit reports (supabase, prompts, edge, tasks) | NO | Historical — all audits completed, findings in `next-steps.md` |
| `blog/` | 16 | Blog redesign specs + content + prompts | NO | Not in any plan phase |
| `claude-docs/` | 30 | System documentation, BCG strategy, phase plans | NO | Mostly superseded by `summary.md` and `prd.md` |
| `draft/` | ~120 | Draft wireframes, mermaid, prompts, auth, data, edge | NO | Superseded by final versions in `prompts/`, `wireframes/`, `mermaid/` |
| `entrepreneur/` | 22 | PrometAI resources (idea gen, validation, benchmarking) | NO | External reference — not actionable |
| `infographics/` | ~80 | Infographic design specs, fashion, overcommitted, prompts | NO | Not in any plan phase |
| `lean/` | 3 | Screenshot images from dev sessions | NO | Images only — no documentation value |
| `notes/` | 17 | Session notes + draft ideas | NO | Stale session notes |
| `plan/` | 12 | UX audit docs, summaries, dashboard plans | NO | Superseded by `strategy.md` and `roadmap.md` |
| `reference/` | 11 | PM template prompts (roadmap, persona, journeys) | NO | Generic templates — not tied to plan |
| `remotion/` | 5 | Remotion motion graphics / video planning | NO | Not in any plan phase |
| `reports/` | 8 | Sample validation reports + competitor screenshots | NO | Historical examples |
| `screenshots/` | ~10 | UI screenshots from development | NO | Visual archive — no documentation value |
| `strategy/` | 10 | Strategy docs (validation, funding, PRDs) | NO | Superseded by root `strategy.md` |
| `website/` | 3 | Website page design process | NO | Not in any plan phase |

---

## Summary

### Keep (actively needed for the plan)

| Doc/Folder | Used By |
|------------|---------|
| `summary.md` | Plan overview, onboarding |
| `prd.md` | All phases — master requirements |
| `next-steps.md` | Daily execution — what to work on |
| `roadmap.md` | Engineering timeline |
| `strategy.md` | Architecture decisions |
| `index-progress.md` | Completion tracking |
| `sub-agents.md` | AI agent development |
| `style-guide.md` | Any UI work |
| `changelog` | Version history |
| `TASK-TEMPLATE.md` | Creating new tasks |
| `prompts/` | All phases — task specs |
| `wireframes/` | MVP-04, MVP-05 — dimension pages |
| `mermaid/` | System documentation |
| `data/` | Database/migration reference |
| `validator/` | V3 report design |
| `vector/` | Phase 4 — RAG |
| `testing/` | QA for all phases |

**10 root files + 7 folders = 17 essential items**

### Could archive (not blocking any plan phase)

| Doc/Folder | Reason |
|------------|--------|
| `features.md` | Overlaps with PRD |
| `sitemap.md` | Possibly outdated |
| `plans/` | Recent but phase-specific |
| `dashboard/` | May need for Phase 3 |
| `design/` | Reference only |
| `style-guide/` (folder) | Overlaps with root file |
| `diagrams/` | Superseded by mermaid/ |

**7 items — keep accessible but not essential**

### Can archive/delete (stale, superseded, or off-plan)

| Doc/Folder | Reason |
|------------|--------|
| `index-prompts.md` | Superseded by `prompts/00-index.md` |
| `product-roadmap.md` | Superseded by `roadmap.md` v4.0 |
| `timeline.md` | Superseded by `roadmap.md` v4.0 |
| `notes.md` | Stale session notes |
| `TT-000-index.md` | V2 done, V3 in `next-steps.md` |
| `universal-product-system.md` | Not actionable |
| `audit/` (26 files) | Completed audits |
| `blog/` (16 files) | Not in plan |
| `claude-docs/` (30 files) | Superseded by summary.md/prd.md |
| `draft/` (~120 files) | Superseded by final versions |
| `entrepreneur/` (22 files) | External reference |
| `infographics/` (~80 files) | Not in plan |
| `lean/` (3 files) | Screenshots only |
| `notes/` (17 files) | Stale notes |
| `plan/` (12 files) | Superseded |
| `reference/` (11 files) | Generic templates |
| `remotion/` (5 files) | Not in plan |
| `reports/` (8 files) | Historical |
| `screenshots/` (~10 files) | Visual archive |
| `strategy/` (folder, 10 files) | Superseded by root strategy.md |
| `website/` (3 files) | Not in plan |

**~400 files across 6 root docs + 15 folders that could move to `tasks/archive/`**
