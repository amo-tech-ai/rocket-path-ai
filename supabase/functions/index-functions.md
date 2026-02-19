# Edge Functions — Architecture Audit & Index

> **Audited:** 2026-02-14 | **Updated:** 2026-02-14 | **Functions:** 31 deployed + 16 archived | **Total LOC:** 25,910 TS (deployed)
> **Shared infra:** `_shared/` (15 files: gemini, cors, rate-limit, openai-embeddings, industry-context, auth, types, etc.)
> **AI Models:** Gemini 3 Flash (speed), Gemini 3 Pro (deep analysis), OpenAI text-embedding-3-small (RAG)
> **Archived:** `archive/` — 5 legacy (prompt-pack-search, prompt-pack-run, prompt-pack-apply, validation-agent, canvas-coach) + 11 deferred (validator-flow, validator-orchestrate, 6x validator-agent-*, 3x validator-board-*)

---

## PART 1 — MASTER TABLE

### Verdict Key
- 🟢 **Keep** — essential, well-built, no action needed
- 🟡 **Improve** — needed but has issues (merge, refactor, or simplify)
- 🔴 **Remove/Defer** — not needed for MVP, redundant, or over-engineered

### Scoring Criteria (0–100)
- **Core journey value** (40%): Does it power a critical user flow?
- **Uniqueness** (20%): Is it the only function doing this?
- **Code quality** (20%): Uses shared patterns, error handling, rate limiting?
- **MVP necessity** (20%): Required for Phase 1 launch?

---

### A. Core Product Functions

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 1 | `ai-chat` | 2,008 | Central chat router — coach mode, RAG context, conversation memory | P1 | 92 | 🟢 | Low | High |
| 2 | `onboarding-agent` | 2,045 | 15-action wizard — URL enrichment, interview, scoring, startup creation | P1 | 95 | 🟢 | Med | High |
| 3 | `lean-canvas-agent` | 2,664 | 14 actions — canvas generation, validation, versioning, coaching, assumptions | P1 | 90 | 🟢 | Low | High |
| 4 | `pitch-deck-agent` | 2,840 | 14 actions — deck generation, slide editing, research, image gen, wizard | P1 | 88 | 🟢 | Low | High |
| 5 | `profile-import` | 159 | URL extraction — Gemini Flash with URL Context, confidence ratings | P1 | 82 | 🟢 | Low | Low |

### B. Validator Pipeline (v2 — Working E2E)

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 6 | `validator-start` | 2,798 | Pipeline entry + 7 bundled agents (extract→research→score→mvp→compose→verify) | P1 | 95 | 🟢 | Med | High |
| 7 | `validator-status` | 217 | Polling endpoint — returns session state + agent progress | P1 | 88 | 🟢 | Low | Low |
| 8 | `validator-followup` | 223 | Follow-up Q&A on completed reports — conversational refinement | P2 | 70 | 🟡 | Low | Med |
| 9 | `validator-regenerate` | 117 | Re-generate single report section with new instructions | P2 | 65 | 🟡 | Low | Low |
| 10 | `validator-panel-detail` | 131 | Expand report section into detailed sub-analysis | P2 | 62 | 🟡 | Low | Low |

### C. Validator v3 (Microservice Agents — ARCHIVED 2026-02-14)

> Moved to `archive/`. Code on disk, not deployed. Activate when v2 hits scaling limits.

| # | Function | LOC | Description | Phase | Score | Status |
|---|----------|----:|-------------|:-----:|------:|:------:|
| ~~11~~ | `validator-orchestrate` | 484 | v3 pipeline — calls standalone agents via HTTP | P3 | 42 | Archived |
| ~~12~~ | `validator-agent-extract` | 118 | Standalone extractor agent (v3) | P3 | 38 | Archived |
| ~~13~~ | `validator-agent-research` | 127 | Standalone research agent (v3) | P3 | 38 | Archived |
| ~~14~~ | `validator-agent-competitors` | 127 | Standalone competitors agent (v3) | P3 | 38 | Archived |
| ~~15~~ | `validator-agent-score` | 139 | Standalone scoring agent (v3) | P3 | 38 | Archived |
| ~~16~~ | `validator-agent-mvp` | 131 | Standalone MVP agent (v3) | P3 | 38 | Archived |
| ~~17~~ | `validator-agent-compose` | 234 | Standalone composer agent (v3) | P3 | 38 | Archived |

### D. Validator Board (Advisory Board — ARCHIVED 2026-02-14)

> Moved to `archive/`. No frontend exists for this feature.

| # | Function | LOC | Description | Phase | Score | Status |
|---|----------|----:|-------------|:-----:|------:|:------:|
| ~~18~~ | `validator-board-coach` | 126 | Advisory board coaching | P3 | 30 | Archived |
| ~~19~~ | `validator-board-extract` | 133 | Extract actionable items from board discussion | P3 | 30 | Archived |
| ~~20~~ | `validator-board-suggest` | 140 | Board suggestions | P3 | 30 | Archived |

### D2. Validator Proxy (ARCHIVED 2026-02-14)

> Moved to `archive/`. Frontend calls validator-start/status directly.

| # | Function | LOC | Description | Phase | Score | Status |
|---|----------|----:|-------------|:-----:|------:|:------:|
| ~~21~~ | `validator-flow` | 68 | Thin proxy router — no business logic | P1 | 35 | Archived |

### E. Dashboard & Intelligence

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 22 | `dashboard-metrics` | 324 | Aggregates startup metrics — tasks, deals, canvas, team for dashboard | P1 | 78 | 🟢 | Low | Med |
| 23 | `health-scorer` | 428 | 6-dimension health score (0–100) with caching and trend calculation | P1 | 80 | 🟢 | Low | Med |
| 24 | `compute-daily-focus` | 467 | AI-generated daily focus — top priority + supporting tasks | P2 | 58 | 🟡 | Low | Med |
| 25 | `insights-generator` | 938 | 6 actions — daily insights, weekly summary, readiness, outcomes, ROI | P2 | 55 | 🟡 | Low | High |
| 26 | `stage-analyzer` | 472 | Rule-based stage detection — 16 metrics, 5-stage progression | P2 | 60 | 🟡 | Low | Med |
| 27 | `action-recommender` | 264 | Rule-based task recommendations from startup state | P2 | 45 | 🟡 | Low | Low |

### F. CRM & Fundraising

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 28 | `crm-agent` | 767 | CRM AI operations — contact management, deal tracking, pipeline analysis | P1 | 72 | 🟢 | Low | Med |
| 29 | `investor-agent` | 1,246 | 12 actions — discover, analyze fit, outreach, pipeline, term sheets | P2 | 68 | 🟡 | Low | High |
| 30 | `event-agent` | 816 | 5 actions — discover events, analyze fit, research speakers, prep, track | P3 | 38 | 🔴 | Low | Med |

### G. Knowledge System (RAG)

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 31 | `knowledge-search` | 85 | Semantic search via pgvector — single-purpose RAG retrieval | P1 | 82 | 🟢 | Low | Low |
| 32 | `knowledge-ingest` | 279 | Chunk markdown + generate embeddings — internal-only endpoint | P1 | 78 | 🟢 | Low | Med |
| 33 | `load-knowledge` | 615 | Admin tool — bulk ingest, LlamaCloud, status checks, test search | P2 | 50 | 🟡 | Low | Med |

### H. Content & Documents

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 34 | `documents-agent` | 1,168 | 10 actions — generate, analyze, improve, search, data room, investor updates | P2 | 52 | 🟡 | Low | High |
| 35 | `market-research` | 235 | TAM/SAM/SOM + trends + competitive landscape via Gemini Pro | P1 | 75 | 🟢 | Low | Med |
| 36 | `opportunity-canvas` | 230 | 5-dimension opportunity scoring — pursue/explore/defer/reject | P2 | 62 | 🟡 | Low | Med |

### I. Lean System (Sprints & Experiments)

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 37 | `sprint-agent` | 163 | Generate 24 sprint tasks (6 sprints x 4 tasks) from startup context | P2 | 60 | 🟡 | Low | Low |
| 38 | `experiment-agent` | 138 | AI-designs experiments from assumptions — hypothesis + success criteria | P2 | 58 | 🟡 | Low | Low |

### J. Industry & Prompts

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 39 | `industry-expert-agent` | 1,017 | 9 actions — industry context, coaching, benchmarks, full validation report | P1 | 70 | 🟡 | Med | High |
| 40 | `prompt-pack` | 720 | Pack execution engine — industry context injection, multi-target output | P1 | 72 | 🟢 | Low | High |

### K. Utility & Automation

| # | Function | LOC | Description | Phase | Score | Verdict | Risk | Complexity |
|---|----------|----:|-------------|:-----:|------:|:-------:|:----:|:----------:|
| 41 | `share-meta` | 80 | OG/Twitter meta tags for shared report links — no AI | P1 | 76 | 🟢 | Low | Low |
| 42 | `task-agent` | 770 | Task CRUD + AI generation + smart prioritization | P1 | 70 | 🟢 | Low | Med |
| 43 | `workflow-trigger` | 910 | Score-based automation — rule evaluation, task creation, activity logging | P2 | 55 | 🟡 | Med | High |

---

## PART 1B — SUMMARY SCORECARD

| Metric | Count |
|--------|------:|
| 🟢 Keep (score 70+) | **18** |
| 🟡 Improve (score 45–69) | **13** |
| ~~🔴 Remove/Defer (score <45)~~ | ~~11~~ → **0 deployed** |
| **Deployed functions** | **31** |
| **Archived functions** | **11** (moved 2026-02-14) + 5 legacy |
| **Deployed LOC** | **25,910** |
| Archived LOC | 1,827 |

**What changed (2026-02-14):** Archived 11 functions — validator-flow (proxy), 7x v3 agents (dormant), 3x board (no frontend). Removed from `config.toml`. Code stays on disk in `archive/`. Zero capability loss.

---

## PART 2 — DETAILED ANALYSIS

---

### 1. `ai-chat` — 🟢 92/100

- **Current Role:** Central chat router with coach mode, RAG context, conversation memory
- **Strategic Value:** PRIMARY USER INTERFACE — every user interaction starts here
- **Problem If Removed:** No chat. Product is dead.
- **Overlap With:** `industry-expert-agent` (coaching), but ai-chat is the router, not the specialist
- **Architectural Risk:** LOW — uses shared patterns, modular coach/ directory
- **Suggested Refactor:** None needed. Consider extracting RAG logic to shared if other functions need it.
- **Final Verdict:** **Keep**

---

### 2. `onboarding-agent` — 🟢 95/100

- **Current Role:** 15-action wizard — URL enrichment, readiness scoring, interview, org creation
- **Strategic Value:** FIRST TOUCH — converts signups to active users. Most complex function (2,045 LOC).
- **Problem If Removed:** No onboarding. Users can't create startups.
- **Overlap With:** `profile-import` (URL extraction), but onboarding does full workflow orchestration
- **Architectural Risk:** MEDIUM — 2,045 LOC in one file, older CORS imports. Should use modular actions/ pattern.
- **Suggested Refactor:** Extract into actions/ directory like pitch-deck-agent. Update to shared CORS.
- **Final Verdict:** **Keep** (refactor to actions/ pattern)

---

### 3. `lean-canvas-agent` — 🟢 90/100

- **Current Role:** 14 actions across 9 modules — canvas CRUD, AI generation, validation, versioning, coaching
- **Strategic Value:** CORE PRODUCT — Lean Canvas is the business model backbone
- **Problem If Removed:** No canvas editing, no AI suggestions, no version history
- **Overlap With:** `industry-expert-agent` (validate_canvas action overlaps), `prompt-pack` (can run canvas packs)
- **Architectural Risk:** LOW — clean actions/ directory pattern, shared utils
- **Suggested Refactor:** Merge `industry-expert-agent.validate_canvas` into lean-canvas-agent.
- **Final Verdict:** **Keep**

---

### 4. `pitch-deck-agent` — 🟢 88/100

- **Current Role:** 14 actions across 8 modules — deck wizard, slide generation, research, image gen
- **Strategic Value:** HIGH — pitch decks are the #1 investor deliverable
- **Problem If Removed:** No pitch deck generation
- **Overlap With:** `market-research` (pitch-deck has its own market research action), `documents-agent` (investor updates)
- **Architectural Risk:** LOW — clean modular architecture
- **Suggested Refactor:** Consider pulling market_research action to use shared `market-research` function instead of duplicating.
- **Final Verdict:** **Keep**

---

### 5. `profile-import` — 🟢 82/100

- **Current Role:** URL → structured startup profile via Gemini Flash + URL Context
- **Strategic Value:** MEDIUM-HIGH — fast profile enrichment used by onboarding
- **Problem If Removed:** Manual profile entry only
- **Overlap With:** `onboarding-agent.enrich_url` — near duplicate logic
- **Architectural Risk:** LOW — simple, single-purpose, well-scoped
- **Suggested Refactor:** Keep as standalone utility. Both onboarding and profile page call it.
- **Final Verdict:** **Keep**

---

### 6. `validator-start` — 🟢 95/100

- **Current Role:** v2 pipeline entry point + 7 bundled agents with DAG scheduling, deadline checks, graceful degradation
- **Strategic Value:** CORE — the entire validation engine. Working E2E, 6 successful runs.
- **Problem If Removed:** No validation. Product's #1 feature is gone.
- **Overlap With:** `validator-orchestrate` (v3 replacement, not yet activated)
- **Architectural Risk:** MEDIUM — 2,798 LOC, all agents bundled in one function. Cold starts can be slow.
- **Suggested Refactor:** When v3 is ready, migrate to `validator-orchestrate` for microservice separation.
- **Final Verdict:** **Keep** (current production pipeline)

---

### 7. `validator-status` — 🟢 88/100

- **Current Role:** Returns validator session state + per-agent progress for frontend polling
- **Strategic Value:** HIGH — frontend needs this to show progress bar and results
- **Problem If Removed:** Frontend can't poll validation progress
- **Overlap With:** None
- **Architectural Risk:** LOW — simple read-only endpoint
- **Suggested Refactor:** None needed.
- **Final Verdict:** **Keep**

---

### 8. ~~`validator-flow`~~ — ARCHIVED 2026-02-14

- **Status:** Moved to `archive/`. Removed from `config.toml`.
- **Reason:** Unnecessary proxy layer. Frontend calls validator-start/status directly.

---

### 9. `validator-followup` — 🟡 70/100

- **Current Role:** Follow-up Q&A on completed validation reports
- **Strategic Value:** MEDIUM — nice-to-have for iterating on reports
- **Problem If Removed:** Users can't ask questions about their report
- **Overlap With:** `ai-chat` could handle this with report context
- **Architectural Risk:** LOW
- **Suggested Refactor:** Merge with regenerate + panel-detail into single `validator-refine` function.
- **Final Verdict:** **Keep** (P2 — merge candidate)

---

### 10–11. `validator-regenerate` + `validator-panel-detail` — 🟡 62–65/100

- **Current Role:** Re-generate / expand single report sections
- **Strategic Value:** MEDIUM — iterative report improvement
- **Problem If Removed:** Users must re-run entire pipeline to change one section
- **Overlap With:** `validator-followup` (all three modify reports post-generation)
- **Architectural Risk:** LOW — small, focused
- **Suggested Refactor:** **Merge** with followup into single `validator-refine` with actions: {followup, regenerate, expand}.
- **Final Verdict:** **Merge** into `validator-refine`

---

### 12–18. ~~`validator-orchestrate` + 6x `validator-agent-*`~~ — ARCHIVED 2026-02-14

- **Status:** Moved to `archive/`. Removed from `config.toml`. Code + specs on disk.
- **Reason:** v2 (`validator-start`) is working E2E. These are pre-built for v3 architecture.
- **Reactivation trigger:** Cold starts >5s, >50 concurrent validations, or need per-agent retry.
- **Specs:** `tasks/prompts/validator/15-*.md` through `20-*.md`

---

### 19–21. ~~`validator-board-*` (3 functions)~~ — ARCHIVED 2026-02-14

- **Status:** Moved to `archive/`. Removed from `config.toml`.
- **Reason:** No frontend exists. If built later, consolidate to 1 function with 3 actions.

---

### 22. `dashboard-metrics` — 🟢 78/100

- **Current Role:** Aggregates 6+ tables into dashboard summary (tasks, deals, canvas, health)
- **Strategic Value:** HIGH — dashboard is the landing page
- **Problem If Removed:** Empty dashboard
- **Overlap With:** `health-scorer` (both compute health-like metrics)
- **Architectural Risk:** LOW — pure data aggregation, no AI
- **Suggested Refactor:** Consider merging `health-scorer` into this as a `compute_health` action.
- **Final Verdict:** **Keep**

---

### 23. `health-scorer` — 🟢 80/100

- **Current Role:** 6-dimension weighted health score with 1-hour caching and trend calculation
- **Strategic Value:** HIGH — health score drives dashboard UI and recommendations
- **Problem If Removed:** No health score badge on dashboard
- **Overlap With:** `dashboard-metrics`, `stage-analyzer` (all compute startup quality metrics)
- **Architectural Risk:** LOW — uses older CORS import pattern
- **Suggested Refactor:** Merge into `dashboard-metrics` as action. Three scoring fns should be one.
- **Final Verdict:** **Keep** (merge candidate with dashboard-metrics)

---

### 24. `compute-daily-focus` — 🟡 58/100

- **Current Role:** AI-generated daily focus — "Here's your #1 priority today"
- **Strategic Value:** MEDIUM — nice-to-have UX, not core
- **Problem If Removed:** Dashboard shows static content instead of personalized focus
- **Overlap With:** `insights-generator` (daily_insights), `action-recommender`
- **Architectural Risk:** LOW
- **Suggested Refactor:** **Merge** into `insights-generator` as a `daily_focus` action.
- **Final Verdict:** **Merge** into insights-generator

---

### 25. `insights-generator` — 🟡 55/100

- **Current Role:** 6 actions — daily insights, stage recs, weekly summaries, readiness, outcomes
- **Strategic Value:** MEDIUM — strategic guidance but users rarely see these in MVP
- **Problem If Removed:** No AI-generated insights. Dashboard is data-only.
- **Overlap With:** `compute-daily-focus`, `health-scorer`, `stage-analyzer`
- **Architectural Risk:** LOW — well-built with shared patterns
- **Suggested Refactor:** ABSORB `compute-daily-focus` and parts of `action-recommender`.
- **Final Verdict:** **Improve** (absorb daily-focus)

---

### 26. `stage-analyzer` — 🟡 60/100

- **Current Role:** Rule-based stage detection — 16 metrics, 5-stage progression
- **Strategic Value:** MEDIUM — stage progression useful but not core to validation
- **Problem If Removed:** No auto stage detection. Users set stage manually.
- **Overlap With:** `health-scorer`, `insights-generator`
- **Architectural Risk:** LOW — no AI, pure computation
- **Suggested Refactor:** **Merge** into `dashboard-metrics`. Three rule-based scoring fns is two too many.
- **Final Verdict:** **Merge** into dashboard-metrics

---

### 27. `action-recommender` — 🟡 45/100

- **Current Role:** Rule-based task recommendations from startup state
- **Strategic Value:** LOW — simple if/else logic could live in frontend
- **Problem If Removed:** No auto task recommendations. Users create tasks manually.
- **Overlap With:** `workflow-trigger`, `insights-generator` (both recommend actions)
- **Architectural Risk:** LOW — 264 LOC, no AI
- **Suggested Refactor:** **Merge** into `workflow-trigger`.
- **Final Verdict:** **Merge** into workflow-trigger

---

### 28. `crm-agent` — 🟢 72/100

- **Current Role:** CRM AI — contact enrichment, deal tracking, pipeline analysis
- **Strategic Value:** MEDIUM-HIGH — CRM is a core screen
- **Problem If Removed:** No AI in CRM. Manual-only contact/deal management.
- **Overlap With:** `investor-agent` (both manage contacts/deals)
- **Architectural Risk:** LOW — migrated to shared patterns
- **Suggested Refactor:** Consider merging `investor-agent` as fundraising-specific actions.
- **Final Verdict:** **Keep**

---

### 29. `investor-agent` — 🟡 68/100

- **Current Role:** 12 actions — discover investors, analyze fit, outreach, pipeline, term sheets
- **Strategic Value:** HIGH for fundraising, but P2
- **Problem If Removed:** No AI-powered fundraising.
- **Overlap With:** `crm-agent` (same tables), `documents-agent` (investor updates)
- **Architectural Risk:** LOW — well-structured
- **Suggested Refactor:** **Merge** into `crm-agent` as fundraising actions. Same data model.
- **Final Verdict:** **Keep** (P2 — merge candidate with crm-agent)

---

### 30. `event-agent` — 🔴 38/100

- **Current Role:** 5 actions — discover events, analyze fit, speakers, prep, track
- **Strategic Value:** LOW — events are peripheral to core validation/canvas/pitch
- **Problem If Removed:** No event management. Very minor product loss.
- **Overlap With:** `crm-agent` (networking)
- **Architectural Risk:** LOW
- **Suggested Refactor:** **Defer to P3.** If needed, merge into crm-agent.
- **Final Verdict:** **Defer**

---

### 31. `knowledge-search` — 🟢 82/100

- **Current Role:** Semantic search over pgvector — RAG retrieval for all agents
- **Strategic Value:** HIGH — powers all RAG-enabled features
- **Problem If Removed:** AI loses access to curated knowledge base
- **Overlap With:** None — unique
- **Architectural Risk:** LOW — 85 LOC
- **Suggested Refactor:** None needed.
- **Final Verdict:** **Keep**

---

### 32. `knowledge-ingest` — 🟢 78/100

- **Current Role:** Chunk markdown + generate OpenAI embeddings + insert into knowledge_chunks
- **Strategic Value:** HIGH — feeds the RAG system
- **Problem If Removed:** Can't add new knowledge. RAG becomes stale.
- **Overlap With:** `load-knowledge` (admin wrapper around same logic)
- **Architectural Risk:** LOW — internal-only
- **Suggested Refactor:** **Merge** `load-knowledge` INTO this as admin actions.
- **Final Verdict:** **Keep**

---

### 33. `load-knowledge` — 🟡 50/100

- **Current Role:** Admin tool — bulk ingest, LlamaCloud, status, test search
- **Strategic Value:** LOW — admin-only, rarely called
- **Problem If Removed:** Use knowledge-ingest directly. Minor inconvenience.
- **Overlap With:** `knowledge-ingest`
- **Architectural Risk:** LOW
- **Suggested Refactor:** **Merge** into `knowledge-ingest` as admin actions.
- **Final Verdict:** **Merge** into knowledge-ingest

---

### 34. `documents-agent` — 🟡 52/100

- **Current Role:** 10 actions — generate, analyze, improve, search, data room, investor updates
- **Strategic Value:** MEDIUM — useful but not core to validation flow
- **Problem If Removed:** No AI document generation.
- **Overlap With:** `pitch-deck-agent` (competitive analysis), `investor-agent` (investor updates)
- **Architectural Risk:** LOW
- **Suggested Refactor:** Reduce to 4 core actions (generate, analyze, improve, search). Move investor_update to investor-agent.
- **Final Verdict:** **Improve** (trim to core actions)

---

### 35. `market-research` — 🟢 75/100

- **Current Role:** TAM/SAM/SOM + trends + competitive landscape via Gemini Pro
- **Strategic Value:** HIGH — market sizing critical for validation and pitch
- **Problem If Removed:** Validator and pitch deck lose market data.
- **Overlap With:** `pitch-deck-agent.market_research`, `documents-agent.competitive_analysis`
- **Architectural Risk:** LOW — clean, focused
- **Suggested Refactor:** Make this THE single source for market research. Others call it.
- **Final Verdict:** **Keep** (single source of truth)

---

### 36. `opportunity-canvas` — 🟡 62/100

- **Current Role:** 5-dimension opportunity scoring — pursue/explore/defer/reject
- **Strategic Value:** MEDIUM — useful P2 feature
- **Problem If Removed:** Users rely on validator report only.
- **Overlap With:** `health-scorer`
- **Architectural Risk:** LOW — 230 LOC
- **Suggested Refactor:** Standalone is fine at 230 LOC.
- **Final Verdict:** **Keep** (P2)

---

### 37. `sprint-agent` — 🟡 60/100

- **Current Role:** Generate 24 sprint tasks for 90-day validation plan
- **Strategic Value:** MEDIUM — lean methodology support
- **Problem If Removed:** Manual sprint creation
- **Overlap With:** `task-agent`
- **Architectural Risk:** LOW — 163 LOC
- **Suggested Refactor:** Keep. Small enough to not matter.
- **Final Verdict:** **Keep** (small, focused)

---

### 38. `experiment-agent` — 🟡 58/100

- **Current Role:** AI-designs experiments from assumptions
- **Strategic Value:** MEDIUM
- **Problem If Removed:** Manual experiment design
- **Overlap With:** `lean-canvas-agent` (has assumption management + experiment generation)
- **Architectural Risk:** LOW — 138 LOC
- **Suggested Refactor:** **Merge** into `lean-canvas-agent` as `design_experiment` action.
- **Final Verdict:** **Merge** into lean-canvas-agent

---

### 39. `industry-expert-agent` — 🟡 70/100

- **Current Role:** 9 actions — industry context, coaching, benchmarks, competitor analysis, reports
- **Strategic Value:** HIGH — industry-specific expertise is a key differentiator
- **Problem If Removed:** Generic advice instead of industry-specific
- **Overlap With:** `ai-chat` (coaching), `lean-canvas-agent` (validation), `market-research` (benchmarks), `validator-start` (reports). **HIGHEST OVERLAP function in the system.**
- **Architectural Risk:** MEDIUM — 1,017 LOC, duplicates logic from 4 other functions
- **Suggested Refactor:** Reduce to 3 core actions (get_industry_context, get_questions, get_benchmarks). Become a DATA SOURCE, not action executor.
- **Final Verdict:** **Improve** (reduce from 9 to 3 actions)

---

### 40. `prompt-pack` — 🟢 72/100

- **Current Role:** Pack execution engine — industry context injection, multi-model, field mapping
- **Strategic Value:** HIGH — powers guided onboarding prompt flows
- **Problem If Removed:** No prompt pack system.
- **Overlap With:** None — unique engine
- **Architectural Risk:** LOW
- **Suggested Refactor:** None needed.
- **Final Verdict:** **Keep**

---

### 41. `share-meta` — 🟢 76/100

- **Current Role:** OG/Twitter meta tags for shared validation report links
- **Strategic Value:** MEDIUM-HIGH — enables social sharing (growth)
- **Problem If Removed:** Generic preview on shared links
- **Overlap With:** None
- **Architectural Risk:** LOW — 80 LOC, XSS-safe
- **Suggested Refactor:** None.
- **Final Verdict:** **Keep**

---

### 42. `task-agent` — 🟢 70/100

- **Current Role:** Task CRUD + AI generation + smart prioritization
- **Strategic Value:** MEDIUM-HIGH — task management is a core screen
- **Problem If Removed:** No AI task prioritization.
- **Overlap With:** `action-recommender`, `workflow-trigger`
- **Architectural Risk:** LOW
- **Suggested Refactor:** Absorb `action-recommender` logic.
- **Final Verdict:** **Keep**

---

### 43. `workflow-trigger` — 🟡 55/100

- **Current Role:** Score-based automation — rule evaluation, task creation, activity logging
- **Strategic Value:** MEDIUM — automation reduces manual work
- **Problem If Removed:** No automatic task creation from scores.
- **Overlap With:** `action-recommender`, `task-agent`
- **Architectural Risk:** MEDIUM — 910 LOC, complex rule engine
- **Suggested Refactor:** Absorb `action-recommender`. Use `task-agent` for creation.
- **Final Verdict:** **Improve** (absorb action-recommender)

---

## PART 3 — RATIONALIZATION PLAN

### Phase 1: Archive Dormant Functions — DONE 2026-02-14

11 functions moved to `archive/`, removed from `config.toml`. Zero code changes. Zero risk.

| Action | Functions | LOC | Status |
|--------|-----------|----:|:------:|
| Archive v3 agents | validator-orchestrate + 6x validator-agent-* | 1,360 | Done |
| Archive board | 3x validator-board-* | 399 | Done |
| Archive proxy | validator-flow | 68 | Done |

**Result:** 42 → 31 deployed. 11 fewer cold start pools.

### Phase 2: Merges (save 5 more functions)

| Merge From | Merge Into | Rationale |
|------------|------------|-----------|
| `validator-regenerate` + `validator-panel-detail` | `validator-followup` → rename `validator-refine` | 3 post-report fns → 1 |
| `compute-daily-focus` | `insights-generator` | Same domain |
| `load-knowledge` | `knowledge-ingest` | Same domain |
| `action-recommender` | `workflow-trigger` | Same domain |
| `experiment-agent` | `lean-canvas-agent` | Same domain |

**Result:** 31 → 26 deployed.

### Phase 3: Refactors (simplify, no count change)

| Function | Refactor |
|----------|----------|
| `onboarding-agent` | Extract into actions/ directory (2,045 LOC monolith) |
| `industry-expert-agent` | Reduce 9 → 3 actions (data source only) |
| `documents-agent` | Reduce 10 → 4 core actions |
| `investor-agent` | Merge into crm-agent as fundraising actions |
| `health-scorer` + `stage-analyzer` | Merge into dashboard-metrics |

**Result after all phases:** 31 → ~22 deployed. Same capability. ~30% further reduction.

---

### Ideal MVP Architecture (7 AI functions)

If starting from scratch per "max 5–7 AI functions" rule:

| # | Function | Covers |
|---|----------|--------|
| 1 | `ai-chat` | All conversational AI, coaching, Q&A |
| 2 | `onboarding-agent` | User onboarding + startup creation |
| 3 | `validator-start` | Full validation pipeline (7 agents) |
| 4 | `lean-canvas-agent` | Canvas + experiments + sprints |
| 5 | `pitch-deck-agent` | Deck generation + research + images |
| 6 | `knowledge-search` + `knowledge-ingest` | RAG system (2 endpoints) |
| 7 | `prompt-pack` | Guided prompt execution engine |

Everything else is non-AI (move to client/DB), P2+ (deploy when needed), or mergeable.

---

## PART 4 — FUNCTION REGISTRY

| Function | AI? | Model | LOC | Actions | DB Writes | Auth |
|----------|:---:|-------|----:|--------:|:---------:|:----:|
| `action-recommender` | No | — | 264 | 1 | 0 | JWT |
| `ai-chat` | Yes | Gemini Flash | 2,008 | ~5 | conversations | JWT |
| `compute-daily-focus` | Yes | Gemini Flash | 467 | 1 | 0 | JWT |
| `crm-agent` | Yes | Gemini Flash | 767 | ~8 | contacts, deals | JWT |
| `dashboard-metrics` | No | — | 324 | 1 | 0 | JWT |
| `documents-agent` | Yes | Gemini Flash | 1,168 | 10 | documents | JWT |
| `event-agent` | Yes | Gemini Flash | 816 | 5 | events | JWT |
| `experiment-agent` | Yes | Gemini Flash | 138 | 1 | 0 | JWT |
| `health-scorer` | No | — | 428 | 1 | 0 | JWT |
| `industry-expert-agent` | Yes | Flash + Pro | 1,017 | 9 | reports, ai_runs | JWT |
| `insights-generator` | Yes | Gemini Flash | 938 | 6 | 0 | JWT |
| `investor-agent` | Yes | Gemini Flash | 1,246 | 12 | investors, deals | JWT |
| `knowledge-ingest` | Yes | OpenAI Embed | 279 | 1 | knowledge_chunks | Internal |
| `knowledge-search` | Yes | OpenAI Embed | 85 | 1 | 0 | JWT |
| `lean-canvas-agent` | Yes | Gemini Flash | 2,664 | 14 | canvases, assumptions | JWT |
| `load-knowledge` | Yes | OpenAI Embed | 615 | 5 | knowledge_chunks | JWT |
| `market-research` | Yes | Gemini Pro | 235 | 1 | market_research | JWT |
| `onboarding-agent` | Yes | Flash + Pro | 2,045 | 15 | profiles, startups, orgs | JWT |
| `opportunity-canvas` | Yes | Gemini Pro | 230 | 1 | opportunity_canvas | JWT |
| `pitch-deck-agent` | Yes | Gemini + Claude | 2,840 | 14 | pitch_decks, slides | JWT |
| `profile-import` | Yes | Gemini Flash | 159 | 1 | 0 | JWT |
| `prompt-pack` | Yes | Gemini/Claude | 720 | 4 | startups, canvases, tasks | JWT |
| `share-meta` | No | — | 80 | 1 | 0 | Token |
| `sprint-agent` | Yes | Gemini Flash | 163 | 1 | 0 | JWT |
| `stage-analyzer` | No | — | 472 | 3 | 0 | JWT |
| `task-agent` | Yes | Gemini Flash | 770 | ~6 | tasks | JWT |
| ~~`validator-agent-competitors`~~ | Yes | Gemini Flash | 127 | 1 | agent_runs | Archived |
| ~~`validator-agent-compose`~~ | Yes | Gemini Flash | 234 | 1 | agent_runs | Archived |
| ~~`validator-agent-extract`~~ | Yes | Gemini Flash | 118 | 1 | agent_runs | Archived |
| ~~`validator-agent-mvp`~~ | Yes | Gemini Flash | 131 | 1 | agent_runs | Archived |
| ~~`validator-agent-research`~~ | Yes | Gemini Flash | 127 | 1 | agent_runs | Archived |
| ~~`validator-agent-score`~~ | Yes | Gemini Flash | 139 | 1 | agent_runs | Archived |
| ~~`validator-board-coach`~~ | Yes | Gemini Flash | 126 | 1 | 0 | Archived |
| ~~`validator-board-extract`~~ | Yes | Gemini Flash | 133 | 1 | 0 | Archived |
| ~~`validator-board-suggest`~~ | Yes | Gemini Flash | 140 | 1 | 0 | Archived |
| ~~`validator-flow`~~ | No | — | 68 | 3 | 0 | Archived |
| `validator-followup` | Yes | Gemini Flash | 223 | 1 | 0 | JWT |
| ~~`validator-orchestrate`~~ | No | — | 484 | 1 | sessions | Archived |
| `validator-panel-detail` | Yes | Gemini Flash | 131 | 1 | 0 | JWT |
| `validator-regenerate` | Yes | Gemini Flash | 117 | 1 | 0 | JWT |
| `validator-start` | Yes | Gemini Flash | 2,798 | 1 | sessions, runs, reports | JWT |
| `validator-status` | No | — | 217 | 1 | 0 | JWT |
| `workflow-trigger` | No | — | 910 | ~5 | tasks, workflow_log | JWT |

---

## PART 5 — RISK MATRIX

| Risk | Functions Affected | Mitigation |
|------|--------------------|------------|
| **AI sprawl** — 30+ AI functions, hard to audit prompts | All AI fns | Consolidate to 7 core per plan |
| **Duplicate logic** — market research in 3 functions | pitch-deck, documents, market-research | Single source: `market-research` |
| **Duplicate scoring** — health/stage/readiness in 3+ fns | health-scorer, stage-analyzer, insights, action-recommender | Merge into `dashboard-metrics` |
| **Cold start costs** — 31 deployed (was 42) | All | ~~Cut to 22–26 deployed~~ Phase 1 done. Phase 2 targets 26. |
| **Prompt drift** — no shared prompt versioning | All AI fns | Move prompts to `_shared/prompts/` |
| **Onboarding monolith** — 2,045 LOC in one file | onboarding-agent | Refactor to actions/ pattern |
| **industry-expert-agent** — highest overlap in system | 4+ functions | Reduce to data source only |

---

## Shared Utilities (`_shared/`)

| File | Purpose | Used By |
|------|---------|---------|
| `gemini.ts` | Centralized Gemini API: Promise.race timeout, retry, URL Context, search | validator-*, profile-import, most agents |
| `ai-client.ts` | Unified AI interface (Gemini + Claude) with cost tracking | available for all |
| `auth.ts` | JWT verification, user context, RLS clients | validator-* |
| `cors.ts` | Dynamic CORS with ALLOWED_ORIGINS env var | validator-*, migrated agents |
| `rate-limit.ts` | In-memory sliding window (per-isolate) | validator-*, migrated agents |
| `errors.ts` | Typed error classes (AppError, ValidationError, AuthError) | available for all |
| `database.ts` | Pagination, filtering, sorting helpers | multiple |
| `industry-context.ts` | Industry-specific prompts + scoring (22KB) | industry-expert, prompt-pack |
| `master-system-prompt.ts` | Central system prompt definitions (18KB) | multiple |
| `openai-embeddings.ts` | OpenAI embedding API wrapper | knowledge-*, ai-chat |
| `prompt-utils.ts` | Prompt building utilities | multiple |
| `types.ts` | Shared TypeScript interfaces | available for all |
| `mock-supabase.ts` | Test mock for Supabase client | tests |
| `index.ts` | Barrel exports | all |
| `playbooks/` | Industry playbook data files | industry-context.ts |

---

*Generated by architecture audit — 2026-02-14 | Phase 1 archive completed 2026-02-14 (11 functions archived)*
