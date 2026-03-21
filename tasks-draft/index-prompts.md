# Prompt Index — CORE + MVP Focus

> **Version:** 1.0 | **Date:** 2026-02-10
> **Scope:** CORE and MVP phases across all prompt streams (Validator, Platform, Vector, Data)
> **Sources:** `tasks/validator/strategy-roadmap.md` (v1.1), `tasks/validator/prd-validator.md` (v1.2), `tasks/drafts/index-prompts.md` (v3.2), `tasks/validator-prompts/000-index.md`, `tasks/vector/PROGRESS-TASK-TRACKER.md`
> **Full index:** `tasks/drafts/index-prompts.md` (95 tasks, all phases)

---

## Summary

| Stream | Total | CORE | MVP | DONE | Remaining |
|--------|:-----:|:----:|:---:|:----:|:---------:|
| Validator Pipeline | 22 | 5 | 12 | 3 | 19 |
| Platform (Lean Hybrid) | 47 | 3 | 16 | 0 | 19 |
| Vector DB / RAG | 10 | 1 | 3 | 7 | 3 |
| Data Strategy | 16 | 4 | 6 | **16** | 0 |
| ThinkTank Adaptation | 7 | 1 | 5 | 0 | 6 |
| **CORE + MVP totals** | — | **14** | **42** | **26** | **47** |

**47 prompts needed for CORE + MVP.** Data strategy is done. Vector is 72% done. Validator and Platform are the main work.

---

## Data Strategy Assessment

### Status: COMPLETE (16/16)

All schema work supporting CORE + MVP is done. No new migrations needed.

| Data Task | Supports | Status |
|-----------|----------|--------|
| 008-SI: Smart Interviewer Data Layer | Validator CORE (001-004) | DONE |
| 009-SI: Confidence Tracking + Depth | Validator CORE (001, 003) | DONE |
| 010-SI: Context Passthrough | Validator CORE (004) | DONE |
| 013-CF: Assumption Board Schema | Validator MVP (014 Board) | DONE |
| 011-CTL: Decision Log Tables | Platform MVP (decisions) | DONE |
| 012-CTL: Shareable Links + AI Budget | Platform MVP (010-SHR, AI cost) | DONE |
| 014-CF: Weekly Review Loop | Platform MVP (weekly review) | DONE |
| 015-SCH: Soft Delete + GDPR | Platform MVP (soft delete) | DONE |
| 016-CF: AI Cost Guardrails | Platform MVP (AI usage) | DONE |

### Data Changes Needed for CORE Prompts: NONE

The data layer already supports all CORE tasks:
- `validator_sessions.coverage` JSONB supports depth tracking (001)
- `interview_questions` table ready for structured questions (001A)
- `validator_sessions` has columns for `interview_context` passthrough (004)
- No new tables needed for Industry Playbooks (002) or Chat UI v2 (003) -- pure frontend/prompt changes

### Data Changes Needed for MVP Prompts: MINIMAL

| MVP Task | Schema Needed | Status |
|----------|--------------|--------|
| V-010 Agent Runs Table | `validator_agent_runs` table | Schema exists (data task 008-SI created it) |
| V-014 Validation Board | `assumptions`, `experiments`, `experiment_results` | Schema exists (data task 013-CF) |
| TT-001-004 New Sections | No schema change (JSONB `details` absorbs new fields) | N/A |
| 005-008 Agent Intelligence | No schema change (prompt-only improvements) | N/A |
| Platform 011-MKT | 4 new tables: `market_analyses`, `market_segments`, `market_trends`, `market_data_points` | **NEEDS MIGRATION** |
| Platform 012-CMP | 3 new tables: `competitor_profiles`, `competitor_features`, `competitive_positions` | **NEEDS MIGRATION** |

**Action:** 2 migrations needed for Market Analysis (011) and Competitor Intel (012). These are MVP P1 tasks that need schema before frontend work.

---

## Phase 1: CORE Prompts (14 tasks)

> **Goal:** Enrich existing pipeline. Zero new infrastructure. Ship incrementally.
> **Duration:** 2-3 weeks | All P0-P1

### Validator CORE (5 tasks)

| # | ID | Prompt File | Title | Priority | Status | Key Change |
|---|-----|------------|-------|:--------:|:------:|------------|
| 1 | V-001 | `validator-prompts/001-smart-interview.md` | Smart Interview v2 | P0 | **DONE** | Depth tracking, YC probing |
| 2 | V-002 | `validator-prompts/002-industry-playbooks.md` | Industry Playbooks | P0 | Not Started | 8 TS playbook objects |
| 3 | V-003 | `validator-prompts/003-chat-ui-v2.md` | Chat UI v2 | P1 | Not Started | Depth bars, extraction preview |
| 4 | V-004 | `validator-prompts/004-context-passthrough.md` | Context Passthrough | P1 | Not Started | Structured context to pipeline |
| 5 | TT-005 | `validator/TT-005-enriched-agent-prompts.md` | Enriched Agent Prompts | P0 | Not Started | Named frameworks in all agents |

**Dependency chain:** TT-005 (ships first, zero risk) -> V-001 (DONE) -> V-002 -> V-003 -> V-004

**Notes:**
- V-001 is DONE but needs V-002 (playbooks) and V-003 (UI) to be complete
- TT-005 is pure prompt enrichment -- JTBD, Porter, Sequoia, Blue Ocean added to prompts
- V-004 is the bridge from interview to pipeline (structured JSON, not string concat)

### Platform CORE (3 tasks)

| # | ID | Prompt File | Title | Priority | Status | Key Change |
|---|-----|------------|-------|:--------:|:------:|------------|
| 6 | 001-PRF | `drafts/001-profile.md` | Startup Profile 3-Panel | P1 | Not Started | AI completeness scoring, URL import |
| 7 | 002-PLN | `drafts/002-plan.md` | 90-Day Plan + Kanban | P1 | Not Started | Sprint Kanban, PDCA review |
| 8 | 004-VEC | `drafts/004-vector-deploy.md` | Vector RAG Deploy | P0 | **DONE** | Search + ingest split |

### Vector CORE (1 task)

| # | ID | Prompt File | Title | Priority | Status | Key Change |
|---|-----|------------|-------|:--------:|:------:|------------|
| 9 | VEC-014 | `drafts/014-vector-chunking.md` | Chunk Quality | P2 | Not Started | 2400-4800 char chunks, FTS + GIN |

### Lean Hybrid CORE (5 tasks -- Validator + Lean System intersection)

These tasks connect the validator pipeline to the lean canvas system, creating the "hybrid" loop:

| # | Task | Lean Connection | Why CORE |
|---|------|----------------|----------|
| V-001 | Smart Interview | Interview feeds Lean Canvas pre-fill | Interview quality -> Canvas quality |
| V-004 | Context Passthrough | Structured data flows to pipeline AND lean screens | Single source of truth |
| TT-005 | Enriched Prompts | Framework-aligned output feeds Opportunity Canvas | Named frameworks in canvas data |
| 001-PRF | Startup Profile | Profile data feeds Lean Canvas + Validator | Central startup identity |
| 002-PLN | 90-Day Plan | Plan uses validator output for sprint generation | Pipeline -> Plan pipeline |

### CORE Build Order

```
Sprint 1 (Week 1):
  TT-005 Enriched Prompts (1d, zero risk)
  V-002 Industry Playbooks (2d, depends on TT-005)
  VEC-014 Chunk Quality (3d, independent)

Sprint 2 (Week 2-3):
  V-003 Chat UI v2 (2d, depends on V-001 DONE)
  V-004 Context Passthrough (2d, depends on V-003)
  001-PRF Startup Profile (3d, independent)
  002-PLN 90-Day Plan (3d, depends on V-001)
```

---

## Phase 2: MVP Prompts (42 tasks)

> **Goal:** Full V2 report, weighted scoring, Validation Board, platform lean screens.
> **Duration:** 3-4 weeks | All P1-P2

### Validator MVP (12 tasks)

| # | ID | Prompt File | Title | Priority | Status |
|---|-----|------------|-------|:--------:|:------:|
| 1 | V-005 | `validator-prompts/005-research-v2.md` | Research v2 | P1 | Not Started |
| 2 | V-006 | `validator-prompts/006-competitors-v2.md` | Competitors v2 | P1 | Not Started |
| 3 | V-007 | `validator-prompts/007-scoring-v2.md` | Scoring v2 | P1 | Not Started |
| 4 | V-008 | `validator-prompts/008-composer-v2.md` | Composer v2 | P1 | Not Started |
| 5 | V-009 | `validator-prompts/009-report-ui-v2.md` | Report UI v2 | P1 | Not Started |
| 6 | V-010 | `validator-prompts/010-agent-runs-table.md` | Agent Runs Table | P0 | Not Started |
| 7 | V-014 | `validator-prompts/014-validation-board-mvp.md` | Validation Board MVP | P1 | Not Started |
| 8 | V-015 | `validator-prompts/015-report-board-bridge.md` | Report-Board Bridge | P1 | Not Started |
| 9 | V-016 | `validator-prompts/016-experiment-suggester.md` | Experiment Suggester | P1 | Not Started |
| 10 | V-017 | `validator-prompts/017-board-coach.md` | Board Coach | P2 | Not Started |
| 11 | V-019 | `validator-prompts/019-regenerate-cleanup.md` | Regenerate Cleanup | P1 | Not Started |
| 12 | V-018 | `validator-prompts/018-canvas-board-sync.md` | Canvas-Board Sync | P2 | Not Started |

### ThinkTank MVP (5 tasks)

| # | ID | Prompt File | Title | Priority | Status |
|---|-----|------------|-------|:--------:|:------:|
| 1 | TT-001 | `validator/TT-001-customer-persona.md` | Customer Persona Section | P1 | Not Started |
| 2 | TT-002 | `validator/TT-002-competitive-moat.md` | Competitive Moat Section | P1 | Not Started |
| 3 | TT-003 | `validator/TT-003-gtm-strategy.md` | GTM Strategy Section | P1 | Not Started |
| 4 | TT-004 | `validator/TT-004-investor-readiness.md` | Investor Readiness Section | P1 | Not Started |
| 5 | TT-006 | `validator/TT-006-frontend-sections.md` | Frontend Components (4) | P1 | Not Started |

### Platform MVP (16 tasks)

| # | ID | Prompt File | Title | Priority | Status |
|---|-----|------------|-------|:--------:|:------:|
| 1 | 005-EXP | `drafts/005-experiments.md` | Experiments Lab | P2 | Not Started |
| 2 | 006-RES | `drafts/006-research.md` | Market Research Hub | P2 | Not Started |
| 3 | 007-OPP | `drafts/lean/007-opportunity.md` | Opportunity Canvas | P2 | Not Started |
| 4 | 008-RDY | `drafts/008-readiness.md` | Business Readiness Check | P2 | Not Started |
| 5 | 009-OUT | `drafts/009-outcomes.md` | Outcomes Dashboard | P2 | Not Started |
| 6 | 010-SHR | `drafts/010-share-links.md` | Share Links | P2 | Not Started |
| 7 | 011-MKT | `drafts/011-market-analysis.md` | Market Analysis | P1 | Not Started |
| 8 | 012-CMP | `drafts/012-competitor-intel.md` | Competitor Intelligence | P1 | Not Started |
| 9 | 027-DOC | `drafts/027-my-documents.md` | My Documents | P2 | Partial |
| 10 | 031-VAL | `drafts/031-assessment-tone.md` | Assessment Tone Selector | P1 | Not Started |
| 11 | 032-SSE | `drafts/032-sse-progress.md` | SSE Progress Streaming | P1 | Not Started |
| 12 | 033-RSK | `drafts/033-risk-dimensions.md` | Risk Dimensions + Verdict | P2 | Not Started |
| 13 | 034-TPL | `drafts/lean/034-experiment-templates.md` | Experiment Templates | P2 | Not Started |
| 14 | 035-PIN | `drafts/035-pain-index.md` | Pain Index Scoring | P2 | Not Started |
| 15 | 036-URL | `drafts/036-competitor-url.md` | Competitor URL Deep-Dive | P2 | Not Started |
| 16 | 037-KBN | `drafts/lean/037-kanban-board.md` | Sprint Kanban Board | P2 | Not Started |

### Vector MVP (3 tasks)

| # | ID | Prompt File | Title | Priority | Status |
|---|-----|------------|-------|:--------:|:------:|
| 1 | VEC-013 | `drafts/013-vector-schema.md` | Vector Schema v2 | P1 | 80% |
| 2 | VEC-015 | `drafts/015-vector-search.md` | Hybrid Search | P2 | 55% |
| 3 | VEC-017 | `drafts/017-ingest-supabase-docs.md` | Ingest Supabase Docs | P2 | Not Started |

---

## Lean Hybrid System — How Everything Connects

The "lean hybrid" is the intersection of the validator pipeline and the lean canvas screens. Data flows bidirectionally:

```
INTERVIEW ──► PIPELINE ──► REPORT ──► BOARD ──► CANVASES
                                        │            │
                                        └────────────┘
                                        (sync back)

Validator Pipeline (7 agents)          Lean System (screens)
==========================             ===================
Smart Interview (V-001)         ─►     ValidatorChat
Industry Playbooks (V-002)      ─►     (injected into agents)
Context Passthrough (V-004)     ─►     Pipeline input
Research v2 (V-005)             ─►     Market Research Hub (006-RES)
Competitors v2 (V-006)          ─►     Competitor Intel (012-CMP)
Scoring v2 (V-007)              ─►     Report Scores Panel
Composer v2 (V-008)             ─►     18-section Report
Report UI v2 (V-009)            ─►     ValidatorReport page
Validation Board (V-014)        ─►     Assumption Board (013-CF schema)
Board Bridge (V-015)            ─►     Report → Board extraction
Experiment Suggester (V-016)    ─►     Experiments Lab (005-EXP)

ThinkTank Sections               ─►    Lean Screen Connections
==================                     ====================
Customer Persona (TT-001)       ─►     Profile (001-PRF), Opportunity Canvas
Competitive Moat (TT-002)       ─►     Competitor Intel (012-CMP)
GTM Strategy (TT-003)           ─►     90-Day Plan (002-PLN), Readiness (008-RDY)
Investor Readiness (TT-004)     ─►     Investment Readiness Level (048)
```

### Key Hybrid Touchpoints (prompts that bridge validator + lean)

| # | Bridge | Validator Side | Lean Side | Why It Matters |
|---|--------|---------------|-----------|---------------|
| 1 | Interview to Canvas | V-001 extracted data | 001-PRF profile, Lean Canvas pre-fill | Richer interview = better canvas |
| 2 | Report to Board | V-015 board-extract | V-014 Validation Board, 005-EXP experiments | Report assumptions become testable hypotheses |
| 3 | Research to Hub | V-005 research output | 006-RES Market Research Hub, 011-MKT Market Analysis | Same data, two views (pipeline vs screen) |
| 4 | Competitors to Intel | V-006 competitor data | 012-CMP Competitor Intelligence | Pipeline data feeds standalone competitor screen |
| 5 | Scoring to Readiness | V-007 weighted scores | 008-RDY Business Readiness, 033-RSK Risk Dimensions | Scores inform readiness verdict |
| 6 | Board to Canvas | V-018 canvas-board sync | Lean Canvas, Opportunity Canvas (007-OPP) | Validated assumptions update canvas blocks |
| 7 | Tone across system | 031-VAL tone selector | Validator chat + report + coach | Single preference, multiple outputs |

---

## Prompts Still Needed (Not Yet Written)

These spec files are referenced in indexes but don't exist yet:

| # | ID | Title | Phase | Why Needed |
|---|-----|-------|-------|-----------|
| 1 | TT-005 | Enriched Agent Prompts | CORE | P0, ships first, referenced in strategy-roadmap.md |
| 2 | TT-001 | Customer Persona Section | MVP | P1, new report section type + schema |
| 3 | TT-002 | Competitive Moat Section | MVP | P1, new scoring dimension + Porter |
| 4 | TT-003 | GTM Strategy Section | MVP | P1, new report section type |
| 5 | TT-004 | Investor Readiness Section | MVP | P1, token compression + new section |
| 6 | TT-006 | Frontend Components (4 new) | MVP | P1, renders new sections in report |

**Location:** These should be created in `tasks/validator/` (per TT-000-index.md plan). PRD v1.2 defines all types and acceptance criteria.

---

## Prompts That Need Updates (Existing but Stale)

| # | Prompt | Issue | Action |
|---|--------|-------|--------|
| 1 | `drafts/011-market-analysis.md` | References 4 new tables not in current schema | Add migration task or mark as needing data work |
| 2 | `drafts/012-competitor-intel.md` | References 3 new tables not in current schema | Add migration task |
| 3 | `validator-prompts/010-agent-runs-table.md` | Table already exists from data strategy 008-SI | Mark as partially done, clarify remaining work (dual-write logic) |
| 4 | `validator-prompts/014-validation-board-mvp.md` | Schema exists from data strategy 013-CF | Mark as partially done, clarify remaining work (frontend + CRUD) |
| 5 | `drafts/005-experiments.md` | Scope guard 4/5 — may need splitting | Review scope before building |
| 6 | `drafts/009-outcomes.md` | Scope guard 5/5 — SPLIT RECOMMENDED | Must split into 2-3 sub-tasks |

---

## Edge Function Changes for CORE + MVP

### CORE (0 new, 2 modified)

| Edge Function | Prompt | Change Type |
|---------------|--------|-------------|
| `validator-followup` | V-001, V-002 | Modify prompt + schema (depth tracking + playbooks) |
| `validator-start` | TT-005, V-004 | Modify agent prompts + input handling |

### MVP (7 new, 4 modified)

| Edge Function | Prompt | Change Type |
|---------------|--------|-------------|
| `validator-start` | V-005-008, TT-001-004 | Modify agent prompts + schemas |
| `validator-status` | V-010 | Modify to write agent_runs |
| `validator-regenerate` | V-019 | Refactor to Deno.serve + shared CORS |
| `validator-board-extract` (new) | V-015 | AI assumption extraction |
| `validator-board-suggest` (new) | V-016 | AI experiment design |
| `validator-board-coach` (new) | V-017 | AI coaching |
| `profile-agent` (new) | 001-PRF | Profile completeness AI |
| `sprint-agent` (new) | 002-PLN | Sprint planning AI |
| `market-research-agent` (new) | 011-MKT | Market analysis AI |
| `competitor-agent` (new) | 012-CMP | Competitor analysis AI |

---

## MVP Build Order (Recommended)

### Sprint 3 — Validator Intelligence (Week 4-5)

| Order | Task | Depends On |
|-------|------|-----------|
| 1 | V-005 + V-006 Research + Competitors v2 | V-004 (CORE) |
| 2 | V-007 Scoring v2 | V-005, V-006 |
| 3 | V-008 Composer v2 | V-007 |
| 4 | TT-001-004 New Report Sections | TT-005 (CORE), V-008 |
| 5 | V-009 + TT-006 Report UI v2 | V-008, TT-001-004 |

### Sprint 4 — Platform Lean P1 (Week 5-6)

| Order | Task | Depends On |
|-------|------|-----------|
| 6 | V-010 Agent Runs Table (dual-write) | None |
| 7 | 011-MKT Market Analysis | V-001 (validator data) |
| 8 | 012-CMP Competitor Intel | 011-MKT |
| 9 | 031-VAL Assessment Tone | V-001 |
| 10 | 032-SSE Progress Streaming | V-001 |

### Sprint 5 — Validation Board + Experiments (Week 6-7)

| Order | Task | Depends On |
|-------|------|-----------|
| 11 | V-014 Board MVP | V-010 |
| 12 | V-015 Report-Board Bridge | V-014 |
| 13 | V-016 Experiment Suggester | V-015, V-002 (playbooks) |
| 14 | 005-EXP Experiments Lab | V-014 |
| 15 | V-019 Regenerate Cleanup | None (independent) |

### Sprint 6 — Platform Lean P2 (Week 7-8)

| Order | Task | Depends On |
|-------|------|-----------|
| 16 | 006-RES Market Research Hub | V-001 |
| 17 | 007-OPP Opportunity Canvas | 006-RES |
| 18 | 010-SHR Share Links | V-001 |
| 19 | 027-DOC My Documents | None |
| 20 | 037-KBN Sprint Kanban Board | 002-PLN (CORE) |
| 21 | VEC-013 + VEC-015 Vector Schema + Hybrid Search | VEC-014 (CORE) |

---

## Notes

### 1. Data Strategy is Complete -- No Blockers

All 16/16 data tasks are done. The schema supports:
- Smart Interview depth tracking (validator_sessions.coverage JSONB)
- Assumptions + experiments (assumptions, experiments, experiment_results tables)
- Decision log (decisions, decision_evidence tables)
- Shareable links (shareable_links table)
- Weekly reviews (weekly_reviews table)
- AI cost tracking (ai_usage_limits table)
- Soft delete on 6 core tables (deleted_at column + RLS)

**Only 2 new migrations needed** for Platform MVP:
- Market Analysis (4 tables): `market_analyses`, `market_segments`, `market_trends`, `market_data_points`
- Competitor Intel (3 tables): `competitor_profiles`, `competitor_features`, `competitive_positions`

### 2. ThinkTank Specs Not Yet Written

The 6 TT-001 through TT-006 spec files don't exist yet. The PRD (`prd-validator.md` v1.2) defines types, acceptance criteria, and file lists. But the individual spec files following TASK-TEMPLATE format still need writing. TT-005 (enriched prompts) ships first.

### 3. Vector DB Is 72% Done -- Chunk Quality Is the Bottleneck

Current 600-char chunks are too small for good RAG. The CORE task (VEC-014) upgrades to 2400-4800 chars. This needs to happen before Research v2 (V-005) can use hybrid search effectively. **Priority: Do VEC-014 in parallel with Sprint 1.**

### 4. Scope Guards on Platform Prompts

Several platform MVP prompts have over-engineering warnings:
- `009-outcomes.md`: Scope guard 5/5 -- **MUST SPLIT** before building
- `005-experiments.md`: Scope guard 4/5 -- review scope
- `008-readiness.md`: Scope guard 4/5 -- review scope
- `002-plan.md`: Scope guard 4/5 -- cut 5 features for v1.0

### 5. Lean Hybrid = Bidirectional Data Flow

The key insight: validator pipeline outputs should feed lean canvas screens, AND lean canvas data should enrich future validation runs. This creates a feedback loop:
- Report data -> Market Research Hub, Competitor Intel, Business Readiness
- Board experiments -> Lean Canvas updates, 90-Day Plan sprints
- Canvas changes -> Re-validation triggers

### 6. Research Source Library Not Yet Wired

155+ scored research sources exist in `research/links/` but aren't programmatically used by the Research agent. This is a CORE task (strategy-roadmap.md section 1.7) that should be built alongside V-005 Research v2.

### 7. Edge Function Architecture Stays Monolith for Now

The orchestrator (V-013) and agent extraction (V-011, V-012, V-020-022) are MVP/ADVANCED tasks. CORE and early MVP work within the existing `validator-start` monolith. Architecture extraction happens after agent intelligence is proven.

---

## File Reference

| Document | Location | Lines | Purpose |
|----------|----------|:-----:|---------|
| Strategy Roadmap | `tasks/validator/strategy-roadmap.md` | 875 | 4-phase roadmap (CORE/MVP/ADV/PROD) |
| PRD v1.2 | `tasks/validator/prd-validator.md` | 811 | ThinkTank adaptation + wireframe audit |
| TT-000 Index | `tasks/validator/TT-000-index.md` | 290 | ThinkTank spec index + dependency graph |
| Master Index (all phases) | `tasks/drafts/index-prompts.md` | 336 | 95 tasks across all 4 streams |
| Validator Index | `tasks/validator-prompts/000-index.md` | 184 | 22 validator tasks, 5 phases |
| Vector Progress | `tasks/vector/PROGRESS-TASK-TRACKER.md` | 189 | Vector DB 72% complete |
| Data Progress | `tasks/drafts/data-prompts/data-progress.md` | — | 16/16 data tasks DONE |
| Next Steps | `tasks/next-steps.md` | 371 | Current priorities v6.2 |
| Research Sources | `research/links/100-research-list.md` | 289 | 155+ scored research sources |
| Research Index | `research/links/index-links.md` | 134 | 15 industry link docs |
