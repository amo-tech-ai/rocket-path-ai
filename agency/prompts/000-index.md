# StartupAI Enhancement Prompts — Master Index

> **Updated:** 2026-03-15 | **Version:** 3.0
> **Template:** `agency/TASK-TEMPLATE.md` v4.0
> **Total:** 40 files — 24 tasks (001-024) + 11 reference docs (025-035) + 5 fragments (036-040)
> **Naming:** `XXX-name.md` (sequential, no gaps)
> **Skills:** Each task references skills from `.agents/skills/`
> **Status:** Tasks 001-012 complete (except 013-014). 7 EFs deployed. 4 chat modes + persistence. Schema deployed. 393/393 tests.

---

## File Numbering

| Range | Type | Purpose |
|-------|------|---------|
| 000 | Index | This file |
| 001-004 | CORE tasks | Foundation + validator enhancements |
| 005-006 | MVP tasks | AI chat coaching modes |
| 007-008 | MVP tasks | Investor MEDDPICC intelligence |
| 009 | MVP task | Sprint RICE + Kano prioritization |
| 010-011 | MVP tasks | Pitch deck + lean canvas upgrades |
| 012-016 | POST-MVP tasks | Chat persistence, panels, nudges, exports |
| 017-020 | ADVANCED tasks | Quality tracking, caching, panels, detail sheets |
| 021-024 | PRODUCTION tasks | Backward compat, tests, deploy, monitoring |
| 025-035 | Reference docs | Index, schema, RLS, ERD, wiring, Gemini, Claude, auth, frontend, workflows |
| 036-040 | Fragments | Runtime prompt content injected into edge functions |

---

## Implementation Tasks (001-024)

### CORE — Foundation + Validator (001-004)

| # | File | Task | Depends | Effort | Skills | Status | % |
|:-:|------|------|:-------:|:------:|--------|:------:|:-:|
| 001 | `001-agent-loader-runtime.md` | Prompt loader with caching | — | 0.5d | `devops/edge-functions` | 🟢 | 100% |
| 002 | `002-validator-scoring-fragment.md` | Evidence tiers + bias detection in scoring agent | 001 | 1d | `startup/validation-scoring`, `gemeni` | 🟢 | 100% |
| 003 | `003-validator-composer-fragment.md` | Three-act narrative + ICE channels in composer | 001 | 1d | `startup/validation-scoring`, `gemeni` | 🟢 | 100% |
| 004 | `004-report-ui-agency-badges.md` | Evidence badges + bias banners in report UI | 002, 003 | 0.5d | `design/frontend-design` | 🟢 | 100% |

### MVP — Chat Modes + Investor + Sprint + Screens (005-011)

| # | File | Task | Depends | Effort | Skills | Status | % |
|:-:|------|------|:-------:|:------:|--------|:------:|:-:|
| 005 | `005-chat-modes-backend.md` | 4 coaching modes in ai-chat edge function | 001 | 1d | `sales-coach`, `gemeni` | 🟢 | 100% |
| 006 | `006-chat-modes-frontend.md` | Mode selector UI + mode-specific styling | 005 | 0.5d | `design/frontend-design`, `sales-coach` | 🟢 | 100% |
| 007 | `007-investor-meddpicc-schema.md` | MEDDPICC columns + constraints on investors table | — | 0.5d | `data/supabase-postgres-best-practices` | 🟢 | 100% |
| 008 | `008-investor-meddpicc-wiring.md` | MEDDPICC scoring in investor-agent + frontend badges | 001, 007 | 1d | `deal-strategist`, `gemeni` | 🟢 | 100% |
| 009 | `009-sprint-board-rice-kano.md` | RICE scoring + Kano filters on sprint board | 001 | 1d | `sprint-prioritizer`, `gemeni` | 🟢 | 100% |
| 010 | `010-pitch-deck-challenger.md` | Challenger narrative + win themes in pitch-deck-agent | 001 | 1d | `proposal-strategist`, `gemeni` | 🟢 | 100% |
| 011 | `011-lean-canvas-specificity.md` | Specificity scoring + evidence gap detection in canvas | 001 | 0.5d | `feedback-synthesizer`, `lean/lean-canvas` | 🟢 | 100% |

### POST-MVP — Persistence + Panels + Nudges (012-016)

| # | File | Task | Depends | Effort | Skills | Status | % |
|:-:|------|------|:-------:|:------:|--------|:------:|:-:|
| 012 | `012-chat-session-persistence.md` | Save/resume chat sessions per mode | 005 | 0.5d | `data/supabase-postgres-best-practices` | 🟢 | 100% |
| 013 | `013-practice-pitch-panel.md` | Right panel: 5-dimension pitch scoring + objections | 005 | 0.5d | `sales-coach`, `design/frontend-design` | 🔴 | 5% |
| 014 | `014-growth-strategy-panel.md` | Right panel: AARRR funnel + ICE experiments | 005 | 0.5d | `growth-hacker`, `design/frontend-design` | 🔴 | 5% |
| 015 | `015-behavioral-nudge-system.md` | Context-triggered nudges (empty canvas, stale sprint) | 009 | 1d | `behavioral-nudge`, `design/frontend-design` | 🟡 | 25% |
| 016 | `016-export-overlays.md` | Evidence + RICE/MEDDPICC scores in PDF exports | 004 | 0.5d | `design/frontend-design` | 🔴 | 0% |

### ADVANCED — Analytics + Optimization (017-020)

| # | File | Task | Depends | Effort | Skills | Status | % |
|:-:|------|------|:-------:|:------:|--------|:------:|:-:|
| 017 | `017-quality-tracking.md` | Track fragment usage + quality impact in ai_runs | 015 | 0.5d | `data/supabase-postgres-best-practices` | 🔴 | 0% |
| 018 | `018-fragment-caching.md` | Build-time fragment embedding (not runtime loading) | 001 | 0.5d | `devops/edge-functions` | 🔴 | 0% |
| 019 | `019-remaining-right-panels.md` | Deal Review + Canvas Coach right panels | 005 | 0.5d | `deal-strategist`, `design/frontend-design` | 🔴 | 0% |
| 020 | `020-meddpicc-detail-sheet.md` | Investor detail sheet with 8-dimension breakdown | 008 | 0.5d | `deal-strategist`, `design/frontend-design` | 🔴 | 0% |

### PRODUCTION — Hardening + Deploy (021-024)

| # | File | Task | Depends | Effort | Skills | Status | % |
|:-:|------|------|:-------:|:------:|--------|:------:|:-:|
| 021 | `021-backward-compatibility.md` | All new fields optional, existing data unaffected | All MVP | 0.5d | `devops/edge-functions` | 🔴 | 0% |
| 022 | `022-agency-test-suite.md` | 38+ tests for loader, fragments, modes, scoring | 021 | 1d | `devops/edge-functions` | 🔴 | 0% |
| 023 | `023-staged-deploy.md` | Deploy edge functions one at a time with rollback | 022 | 0.25d | `devops/edge-functions` | 🔴 | 0% |
| 024 | `024-monitoring-setup.md` | Fragment usage metrics + quality regression alerts | 023 | 0.25d | `devops/edge-functions`, `data/supabase-postgres-best-practices` | 🔴 | 0% |

---

## Reference Docs (025-034)

Specs that describe **how** the data layer, auth, AI, and wiring work. Consult when implementing tasks.

| # | File | Domain | Read When |
|:-:|------|--------|-----------|
| 025 | `025-ref-index.md` | Reference index | Overview of all reference docs |
| 026 | `026-ref-schema-migrations.md` | Schema | Implementing tasks 007, 009, 012, 015 |
| 027 | `027-ref-rls-policies.md` | RLS | Any new table or policy changes |
| 028 | `028-ref-erd-diagrams.md` | ERD | Understanding entity relationships |
| 029 | `029-ref-data-flow-diagrams.md` | Data flows | Tasks 002-011 (data movement) |
| 030 | `030-ref-edge-function-wiring.md` | EF wiring | Tasks 001-011 (loader + deploy) |
| 031 | `031-ref-gemini-integration.md` | Gemini 3 | Tasks 002, 003, 009, 010, 011 |
| 032 | `032-ref-claude-sdk.md` | Claude SDK | Tasks 005, 008 (investor/chat) |
| 033 | `033-ref-auth-security.md` | Auth | Any auth or RLS changes |
| 034 | `034-ref-frontend-wiring.md` | Frontend | Tasks 004, 006, 013-016, 019-020 |
| 035 | `035-ref-workflow-automation.md` | Workflows | Task 015 (nudge triggers) |

---

## Runtime Fragments (035-039)

Prompt content injected into edge function system prompts. Each fragment is a markdown file with domain knowledge frameworks.

| # | File | Target Edge Function | Frameworks |
|:-:|------|---------------------|------------|
| 036 | `036-fragment-validator-scoring.md` | `validator-start` (scoring agent) | Evidence tiers, RICE actions, bias detection |
| 037 | `037-fragment-validator-composer.md` | `validator-start` (composer agent) | Three-act narrative, win themes, ICE channels |
| 038 | `038-fragment-sprint-agent.md` | `sprint-agent` | RICE scoring, Kano classification, momentum sequencing |
| 039 | `039-fragment-crm-investor.md` | `investor-agent` | MEDDPICC /40, signal timing, cold email |
| 040 | `040-fragment-pitch-deck.md` | `pitch-deck-agent` | Win themes, Challenger narrative, persuasion |

---

## Dependency Graph

```
001 (loader) ──┬── 002 (scoring) ── 003 (composer) ── 004 (badges) ── 016 (exports)
               ├── 005 (chat backend) ── 006 (chat frontend)
               │                       ├── 012 (persistence)
               │                       ├── 013 (pitch panel)
               │                       ├── 014 (growth panel)
               │                       └── 019 (remaining panels)
               ├── 008 (investor wiring) ── 020 (MEDDPICC detail)
               ├── 009 (sprint RICE) ── 015 (nudges) ── 017 (quality)
               ├── 010 (pitch deck)
               └── 011 (canvas specificity)

007 (investor schema) ── 008 (investor wiring)

All MVP ── 021 (compat) ── 022 (tests) ── 023 (deploy) ── 024 (monitoring)
```

---

## Implementation Progress

| Phase | Tasks | Done | % | Status |
|-------|:-----:|:----:|:-:|:------:|
| CORE (001-004) | 4 | 4 | 100% | 🟢 |
| MVP (005-011) | 7 | 7 | 100% | 🟢 |
| POST-MVP (012-016) | 5 | 1 | 20% | 🟡 |
| ADVANCED (017-020) | 4 | 0 | 0% | 🔴 |
| PRODUCTION (021-024) | 4 | 0 | 0% | 🔴 |
| **Total** | **24** | **12** | **50%** | 🟡 |

---

## Skill Reference

Skills from `.agents/skills/` referenced in task prompts:

| Skill | Used In Tasks | Purpose |
|-------|:-------------:|---------|
| `startup/validation-scoring` | 002, 003 | Rubric anchors, evidence grading |
| `gemeni` (Gemini API) | 002, 003, 005, 008, 009, 010 | Structured output, search, tools |
| `design/frontend-design` | 004, 006, 013, 014, 015, 016, 019, 020 | React + shadcn/ui components |
| `deal-strategist` | 008, 019, 020 | MEDDPICC, investor scoring |
| `sprint-prioritizer` | 009 | RICE scoring, Kano classification |
| `sales-coach` | 005, 006, 013 | Practice pitch, AI chat modes |
| `growth-hacker` | 014 | Growth strategy, AARRR funnel |
| `behavioral-nudge` | 015 | Nudge triggers, contextual prompts |
| `feedback-synthesizer` | 011 | Canvas specificity, evidence gaps |
| `proposal-strategist` | 010 | Challenger narrative, persuasion |
| `outbound-strategist` | 008 | Signal-based outreach |
| `data/supabase-postgres-best-practices` | 007, 012, 017, 024 | Schema, RLS, migrations |
| `devops/edge-functions` | 001, 018, 021-024 | Edge function patterns, deploy |
| `lean/lean-canvas` | 011 | Lean Canvas domain knowledge |

---

## Cross References

| Document | Path |
|----------|------|
| Task Template | `agency/TASK-TEMPLATE.md` |
| Agency PRD | `agency/prd-agency.md` |
| Agency Roadmap | `agency/roadmap-agency.md` |
| Chat Modes | `agency/chat-modes/*.md` (4 files) |
| Agent Loader | `agency/lib/agent-loader.ts` |
| Mermaid Diagrams | `agency/mermaid/00-index.md` (10 diagrams) |
| Wireframes | `agency/wireframes/00-index.md` (6 screens) |
| Platform Progress | `tasks/index-progress.md` |
| Platform Next Steps | `tasks/next-steps.md` |
| Implementation Plan | `docs/superpowers/plans/2026-03-15-startupai-enhancements.md` |

---

## Key Decisions

1. **Fragments are inlined, not loaded at runtime.** Supabase Deploy bundles only `supabase/functions/` — files in `agency/` aren't accessible. Fragment content is embedded as string constants in each edge function. The `agent-loader.ts` utility remains for local dev reference only.

2. **MEDDPICC columns are text/jsonb (not integer).** The `investors` table already had MEDDPICC columns from a prior migration with text/jsonb types. The `meddpicc_score` column is integer. New integer constraints can't be applied to text columns — accept current types.

3. **Implementation order prioritizes founder value.** Chat modes (005-006) come before sprint board (009) because 4 coaching modes deliver more immediate value than RICE scoring.
