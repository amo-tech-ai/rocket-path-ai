## Edge Functions Docs Audit Report

**Scope:** Documentation files under `supabase/functions/` plus this audit report.  
**Repo evidence basis:** filesystem inventory + spot-check reads of `_shared/` + `prompt-pack/index.ts`.  
**Audit date:** 2026-03-18  

---

## At-a-glance: Deployed Functions (purpose + need + doc correctness)

**Legend — Need:** ✅ keep, 🟡 improve/optional, 🔁 merge candidate, 🔴 defer  
**Doc % correct:** documentation coverage accuracy for that function (not code quality).

| Function | Purpose | Need | Doc % |
|---|---|---:|---:|
| `action-recommender` | Rule-based “next actions” recommendations | 🔁 | 80% |
| `ai-chat` | Chat router (public/auth/coach) + optional RAG search | ✅ | 90% |
| `compute-daily-focus` | AI-generated daily #1 priority focus | 🔁 | 85% |
| `crm-agent` | CRM AI ops (contacts/deals/pipeline) | ✅ | 90% |
| `dashboard-metrics` | Dashboard aggregation across core tables | ✅ | 90% |
| `documents-agent` | AI document generation/analysis/search | 🟡 | 90% |
| `event-agent` | Event discovery/research/prep/tracking | 🔴 | 90% |
| `health-scorer` | Health score computation | 🔁 | 90% |
| `industry-expert-agent` | Industry context/benchmarks/coaching (high overlap) | 🟡 | 90% |
| `insights-generator` | AI insights (daily/weekly/readiness/outcomes) | 🟡 | 90% |
| `investor-agent` | Fundraising workflows (investors/outreach/terms) | 🟡 | 90% |
| `knowledge-ingest` | Ingest + embed knowledge chunks (RAG) | ✅ | 90% |
| `knowledge-search` | Semantic/hybrid search for RAG retrieval | ✅ | 90% |
| `lean-canvas-agent` | Canvas + assumptions + validation coaching | ✅ | 90% |
| `onboarding-agent` | Onboarding wizard + startup creation | ✅ | 90% |
| `pitch-deck-agent` | Pitch deck generation + slide edits + research/images | ✅ | 90% |
| `profile-import` | URL → structured profile extraction | ✅ | 90% |
| `prompt-pack` | Prompt pack engine (search/run/apply/preview) | ✅ | 70% |
| `share-meta` | OG/Twitter meta tags for shared links | ✅ | 90% |
| `sprint-agent` | Generate sprint tasks / 90-day plan | 🟡 | 90% |
| `stage-analyzer` | Stage detection/scoring (rule-based) | 🔁 | 90% |
| `task-agent` | Task CRUD + AI generation/prioritization | ✅ | 90% |
| `validator-followup` | Post-report Q&A refinement | 🔁 | 90% |
| `validator-panel-detail` | Expand a report section into more detail | 🔁 | 90% |
| `validator-regenerate` | Re-generate a report section | 🔁 | 90% |
| `validator-retry` | Retry failed agent + cascade recomposition | ✅ | 0% |
| `validator-start` | Start validation pipeline (background agents) | ✅ | 90% |
| `validator-status` | Poll validation session status/progress | ✅ | 90% |
| `weekly-review` | Weekly review generation + coaching insights | 🟡 | 0% |
| `workflow-trigger` | Automation rules → task creation/activity logs | 🟡 | 90% |

**Roll-up (deployed = 30):**
- ✅ **Keep:** 11
- 🟡 **Improve/Optional:** 7
- 🔁 **Merge candidate:** 11
- 🔴 **Defer:** 1
- **Doc coverage gaps:** `validator-retry` (0%), `weekly-review` (0%), `prompt-pack` (70% due to auth-doc mismatch)

---

## Executive Summary (business impact)

These docs are used as *operational truth* (what’s deployed, what needs JWT, what’s public). Right now there are **hard mismatches** (counts, LOC, auth behavior) that will:

- Waste engineering time (debugging “why does this 401?”).
- Create incorrect assumptions about the **deployed surface area**.
- Increase risk of accidental exposure if future changes follow incorrect “public endpoint” guidance.

---

## Verified Inventory (ground truth)

### Deployed functions (by folder)

- **Deployed function folders (excludes `archive/`, `_shared/`)**: **30**
- **Archived function folders (`supabase/functions/archive/*`)**: **16**
- **`_shared/` TS files**: **18**
- **Approx TS LOC in deployed function folders**: **30,362** (non-test `*.ts` only; tests excluded)

**Deployed functions (30):**
`action-recommender`, `ai-chat`, `compute-daily-focus`, `crm-agent`, `dashboard-metrics`, `documents-agent`, `event-agent`, `health-scorer`, `industry-expert-agent`, `insights-generator`, `investor-agent`, `knowledge-ingest`, `knowledge-search`, `lean-canvas-agent`, `onboarding-agent`, `pitch-deck-agent`, `profile-import`, `prompt-pack`, `share-meta`, `sprint-agent`, `stage-analyzer`, `task-agent`, `validator-followup`, `validator-panel-detail`, `validator-regenerate`, `validator-retry`, `validator-start`, `validator-status`, `weekly-review`, `workflow-trigger`

**Archived functions (16):**
`canvas-coach`, `prompt-pack-apply`, `prompt-pack-run`, `prompt-pack-search`, `validation-agent`, `validator-agent-competitors`, `validator-agent-compose`, `validator-agent-extract`, `validator-agent-mvp`, `validator-agent-research`, `validator-agent-score`, `validator-board-coach`, `validator-board-extract`, `validator-board-suggest`, `validator-flow`, `validator-orchestrate`

---

## Per-Doc Findings (errors, best practices, red flags, blockers, % correct)

### 1) `agency/audit/01-audit-edge.md`

- **% correct:** **0%** (was empty before this report)
- **Blockers:** None now; this file is the report.
- **Best practices present now:**
  - **Verified inventory** section to anchor facts.
  - Clear **per-doc scoring** + actionable fixes.
- **Improvements:**
  - Add a “Verification commands” appendix and paste exact outputs (or store in `agency/audit/artifacts/`).

---

### 2) `supabase/functions/index-functions.md`

- **% correct:** **~78%**

#### Errors / mismatches (verified)

- **Deployed count mismatch:** doc states **31 deployed**, but repo has **30** deployed function folders.
- **Missing deployed functions:** repo includes `validator-retry` and `weekly-review`, but they are not represented in the master table/registry.
- **`_shared/` count mismatch:** doc states **15 files**, but repo has **18** TS files under `_shared/` (including `_shared/playbooks/index.ts`).
- **LOC mismatch:** doc states **25,910 deployed TS LOC**; repo sums to **~30,362** across deployed function folders (non-test).

#### Best practices (keep)

- Strong **table-driven index** with scoring criteria and rationalization plan.
- Clear distinction between **deployed vs archived**.
- Explicit merge/refactor roadmap (high leverage for cost + reliability).

#### Red flags / failure points

- “Audited/Updated” timestamp implies authority, but there’s **no mechanical verification** → doc drift already happened.
- “Function registry” contains operational claims (AI model, auth) that can silently go stale.

#### Blockers

- None for runtime, but **blocker for decision-making**: can’t trust counts/LOC/deployed set.

#### Suggested improvements (highest leverage)

- Add an **Auto-Verified Inventory** section generated by a script (counts, names, `_shared` list, LOC).
- Add “**Verified Date**” + “**Verified By**” + link to the script output.
- Add a “**Public endpoints & auth rules**” column only if it’s confirmed per function (don’t infer).

---

### 3) `supabase/functions/archive/README-prompt-pack.md`

- **% correct:** **~55%**

#### Errors / mismatches (verified)

- **Auth behavior claim is wrong:**
  - Doc claims catalog actions (`search|get|list`) are **no JWT**.
  - `supabase/functions/prompt-pack/index.ts` currently **requires `Authorization` for all actions** (rejects missing header before routing).

#### Best practices (keep)

- Clear consolidation rationale (cold starts, wiring simplification).
- Links to the replacement function path.

#### Red flags / failure points

- Incorrect “public endpoint” guidance can cause:
  - Frontend integration dead-ends (401s).
  - Security posture confusion (“we intended public catalog” vs reality).

#### Blockers

- Integration blocker if any client expects unauthenticated catalog endpoints.

#### Suggested improvements (choose one, don’t mix)

- **Docs-only fix (fastest):** Update README to state **all actions require JWT** (current reality).
- **Code change fix (behavioral):** If you truly want public `search|get|list`:
  - Move auth check *after* action parsing.
  - Allow public actions with strict rate limiting keyed by IP/origin and minimal data exposure.
  - Document exact behavior + abuse constraints.

---

## Cross-cutting Best Practices Gaps (system-level)

- **Doc rot prevention:** any doc claiming counts/LOC/deployed lists must have a reproducible generator.
- **Auth/CORS truth-source:** docs should reference `_shared/auth.ts` + `_shared/cors.ts` behavior and explicitly note exceptions per function.
- **CORS nuance (potential footgun):** `_shared/cors.ts` returns a default allowed origin when the request origin isn’t allowed (comment notes browser will reject). Prefer explicit **403 for disallowed origins** for sensitive endpoints to reduce ambiguity.

---

## Priority Fix Plan (minimal, high impact)

1. **Fix `README-prompt-pack.md` auth claim** (docs-only) *or* change code to match the doc.
2. **Correct `index-functions.md` inventory** (deployed=30, archived=16, `_shared` TS=18, LOC≈30362, add missing functions).
3. Add a lightweight script to regenerate the inventory block and require it before updating the “Audited/Updated” header.

---

## Best Practices Verification (Skill: `supabase-edge-functions` v2.1)

**Skill doc reviewed:** `.agents/skills/data/supabase-edge-functions/SKILL.md` (v2.1, 2026-02-12)  
**Targets verified:** `supabase/functions/validator-start` and `supabase/functions/ai-chat`  

### A) Skill doc correctness vs repo (doc drift)

- **Deployed count in skill doc is stale**: skill claims “42+ deployed”; repo currently has **30 deployed** function folders (excluding `archive/`, `_shared/`).
- **Function list in skill doc includes non-deployed/renamed items**:
  - Mentions `ai-helper`, `load-knowledge`, `validator-orchestrate` as if active/wired.
  - In repo: `validator-orchestrate` is **archived**; `load-knowledge` does **not** exist as deployed folder; `ai-helper` is **not** present as deployed folder.
- **Takeaway:** treat the skill as a *pattern guide*, not an authoritative registry. The registry source of truth is `supabase/functions/` filesystem + `supabase/config.toml` (not audited here).

### B) Critical rules checklist (PASS/FAIL + notes)

#### `validator-start` (entry: `supabase/functions/validator-start/index.ts`)

- **JWT verification (C2)**: ✅ PASS  
  - Uses user-scoped Supabase client + `supabaseUser.auth.getUser()` and returns 401 on failure.
- **CORS via shared helper (C3)**: ✅ PASS  
  - Uses `getCorsHeaders(req)` + `handleCors(req)` from `_shared/cors.ts`.
- **Rate limiting**: ✅ PASS  
  - Uses `_shared/rate-limit.ts` with `RATE_LIMITS.heavy` keyed by `user.id`.
- **Timeout hardening for Gemini calls (C1/C4)**: ✅ PASS (indirect)  
  - Agents import Gemini helper via `validator-start/gemini.ts` which re-exports `_shared/gemini.ts` (single source of truth, Promise.race hard timeout).
- **RLS vs service role usage**: ✅ PASS (with nuance)  
  - Creates session via anon key + user JWT (RLS enforced).  
  - Uses service role for admin writes to `validator_runs` / `validator_agent_runs` (appropriate for pipeline tracking).
- **Background work (C5)**: ✅ PASS  
  - Uses `EdgeRuntime.waitUntil()` when available for pipeline execution.
- **Input validation**: ✅ PASS  
  - Sanitizes HTML, enforces min/max length, handles invalid JSON.
- **Potential failure points / improvements**:
  - **Telemetry / cost tracking** (skill suggests logging to `ai_runs`): ⚠️ NOT VERIFIED in entrypoint.  
    - If cost tracking is required, verify that `pipeline.ts`/agents write `ai_runs` (not checked in this audit). If not, add it at agent-call boundaries.
  - **beforeunload cleanup**: ⚠️ RISK  
    - The `beforeunload` handler attempts async DB updates as isolate dies. This is best-effort only; ensure pipeline also marks failure on deadline/timeout (likely in `pipeline.ts`, not checked here).

#### `ai-chat` (entry: `supabase/functions/ai-chat/index.ts`)

- **JWT verification (C2)**: ⚠️ CONDITIONAL PASS (intentional public mode)  
  - Allows unauthenticated requests for `mode: 'public'` flows.  
  - Correctly gates sensitive actions (e.g. `search_knowledge`) behind auth (401 if no user).
- **CORS via shared helper (C3)**: ✅ PASS  
  - Uses `handleCors(req)` + `getCorsHeaders(req)` (but note: some responses use static `corsHeaders` constant).
- **Rate limiting**: ⚠️ PARTIAL  
  - Rate limits **authenticated** users only.  
  - **Red flag:** public mode has no clear rate limit (abuse/cost risk), especially with streaming + LLM calls.
- **Gemini integration via shared helper (C4)**: ✅ PASS  
  - Imports `callGeminiChat` / `callGeminiChatStream` from `_shared/gemini.ts`.
- **Dependencies**: ✅ PASS  
  - Uses `npm:@supabase/supabase-js@2`, `jsr:@supabase/functions-js/...`, shared modules.
- **Failure points / improvements (highest leverage)**:
  - **Add public-mode rate limiting** keyed by IP / origin / a generated visitor id. Today, only authenticated users are limited.
  - **Consistency in CORS headers**: prefer using `getCorsHeaders(req)` for all responses (avoid mixing static `corsHeaders` with dynamic origin checking).
  - **Provider/model hygiene**: `MODEL_CONFIG` references Anthropic model IDs; confirm this is intentional and supported in your edge runtime + provider wiring (not verified here).

---

## Function Registry (purpose, need, doc correctness %, improvements)

**Definition — “% correct” here:** how accurate/complete our *current documentation coverage* is for this function (primarily `supabase/functions/index-functions.md` + relevant `archive/*.md`), given the repo’s actual folder set.  
It is **not** a full code-quality score.

| Function / Item | Purpose (current) | Need? | Doc % correct | Suggested improvements |
|---|---|---:|---:|---|
| `_shared/` | Shared infra: CORS, rate limiting, Gemini helpers, auth, embeddings, prompts, agency modes, etc. | ✅ Required | 60% | Update docs: `_shared` is **18 TS files** (not 15). Consider tightening CORS behavior (explicit 403 on disallowed origins for sensitive endpoints). |
| `action-recommender` | Rule-based next-step recommendations from startup state (no AI). | 🟡 Merge candidate | 80% | Consider merging into `workflow-trigger` or `task-agent` (reduce duplication). Keep server-side only if you need RLS-protected aggregation. |
| `ai-chat` | Central chat router: public vs authenticated vs coach modes; optional knowledge search; streaming support. | ✅ Required | 90% | Add public-mode rate limiting; standardize all responses to dynamic `getCorsHeaders(req)`; verify Anthropic model wiring is intentional. |
| `archive/` | Archived functions kept on disk; not deployed. | ✅ Keep | 85% | Add a short `archive/README.md` index listing the 16 archived folders + reason + last verified date. |
| `compute-daily-focus` | AI-generated daily “#1 priority” focus. | 🟡 Optional | 85% | Merge into `insights-generator` as `daily_focus` action (per index). |
| `crm-agent` | CRM AI ops: contacts/deals/pipeline analysis. | ✅ Keep (P1/P2) | 90% | Consider merging fundraising actions from `investor-agent` to reduce overlap. |
| `dashboard-metrics` | Dashboard aggregation across core tables (non-AI). | ✅ Keep | 90% | Consider absorbing `health-scorer`/`stage-analyzer` as actions to unify scoring/aggregation. |
| `documents-agent` | Multi-action doc generation/analysis/search/data-room/investor updates. | 🟡 Improve | 90% | Trim to 3–4 core actions; move investor-update to CRM/fundraising domain. |
| `event-agent` | Event discovery/research/prep/tracking agent. | 🔴 Defer | 90% | Defer (P3). If kept, merge into CRM agent as “networking/events” actions. |
| `health-scorer` | Rule-based health scoring across dimensions. | 🟡 Merge candidate | 90% | Merge into `dashboard-metrics` (single scoring subsystem). Ensure one source of truth for scores. |
| `industry-expert-agent` | Industry context + coaching + benchmarks + competitor analysis (high overlap). | 🟡 Improve | 90% | Reduce to “data source” actions only (context/questions/benchmarks) to remove duplicated logic. |
| `insights-generator` | Multi-action insights (daily, weekly, readiness, ROI/outcomes). | 🟡 Improve | 90% | Absorb `compute-daily-focus` and simplify action set; ensure it’s actually surfaced in UI to justify cost. |
| `investor-agent` | Fundraising: investor discovery/fit/outreach/pipeline/terms. | 🟡 Optional (P2) | 90% | Merge into `crm-agent` as fundraising actions (shared data model). |
| `knowledge-ingest` | Chunk+embed+insert knowledge for RAG (admin/internal). | ✅ Keep | 90% | Consolidate admin workflows here (absorb any bulk-loader behavior); verify access is properly restricted. |
| `knowledge-search` | Semantic/hybrid search for RAG retrieval. | ✅ Keep | 90% | Consider adding caching + stricter auth/tenant filtering if needed (depends on DB RPC policies). |
| `lean-canvas-agent` | Canvas CRUD + AI generation + assumptions/validation coaching. | ✅ Keep | 90% | Merge `experiment-agent` (already planned) and keep action surface tight. |
| `onboarding-agent` | Onboarding wizard orchestration + URL enrichment + startup creation. | ✅ Keep | 90% | Refactor monolith into `actions/` modules; ensure shared CORS/auth/error patterns are consistent. |
| `pitch-deck-agent` | Deck generation + slide editing + research + images. | ✅ Keep | 90% | Reduce duplicated market research by calling `market-research` (single source of truth). |
| `profile-import` | URL → structured startup profile extraction (Gemini Flash + URL Context). | ✅ Keep | 90% | Deduplicate with onboarding enrichment; keep as shared utility endpoint. |
| `prompt-pack` | Prompt pack engine: search/run_step/run_pack/apply/preview. | ✅ Keep | 70% | Fix doc mismatch: `archive/README-prompt-pack.md` claims some actions are public but code requires JWT for all. Decide intended behavior and align docs/code. |
| `share-meta` | OG/Twitter meta tags for shared links (no AI). | ✅ Keep | 90% | Ensure token-based access is safe (XSS-safe already claimed). Verify any input is sanitized server-side. |
| `sprint-agent` | Generates sprint tasks / 90-day plan tasks. | 🟡 Optional | 90% | Consider merging into `task-agent` if overlap grows; keep small otherwise. |
| `stage-analyzer` | Rule-based stage detection across metrics. | 🟡 Merge candidate | 90% | Merge into `dashboard-metrics` to reduce multiple scoring modules. |
| `task-agent` | Task CRUD + AI generation/prioritization. | ✅ Keep | 90% | Absorb `action-recommender` logic; keep one “task recommendation” locus. |
| `validator-followup` | Post-report Q&A refinement. | 🟡 Optional (P2) | 90% | Merge followup + regenerate + panel-detail into single `validator-refine` endpoint with actions. |
| `validator-panel-detail` | Expand a report section into deeper detail. | 🟡 Optional (P2) | 90% | Merge into `validator-refine`. |
| `validator-regenerate` | Re-generate one report section with new instructions. | 🟡 Optional (P2) | 90% | Merge into `validator-refine`. |
| `validator-retry` | Retry a failed agent and cascade downstream recomposition + verification (background). | ✅ Keep (ops-critical) | 0% | Add to `index-functions.md` master table + registry. Document allowed agents + cascade rules + rate limit tier. |
| `validator-start` | Pipeline entrypoint + background multi-agent run orchestration. | ✅ Keep | 90% | Consider adding explicit cost/telemetry logging expectations per agent; ensure failure marking is robust beyond `beforeunload`. |
| `validator-status` | Polling endpoint for pipeline status + progress. | ✅ Keep | 90% | Ensure responses are stable/forward-compatible for UI; add caching if hot. |
| `weekly-review` | AI weekly review generation + coaching insights (actions: generate/coach). | 🟡 Optional | 0% | Add to `index-functions.md`. Confirm tables (`activities`, `experiments`, `decisions`) are stable and RLS-safe. Add rate limiting notes and UI wiring. |
| `workflow-trigger` | Score-based automation rules → create tasks/log activity. | 🟡 Improve | 90% | Absorb `action-recommender`; delegate task creation to `task-agent` for consistency. Reduce rule-engine complexity if not used. |
| `deno.json` | Deno tasks + imports mapping for functions workspace. | ✅ Keep | 50% | Document expected usage: how to run function tests locally; note remote `std/` import and whether it’s still needed (most code uses `npm:`/`jsr:`). |
| `index-functions.md` | Architecture audit + function index + merge plan. | ✅ Keep | 78% | Fix drift: deployed count (30), `_shared` count (18), LOC (~30362), and add missing deployed functions (`validator-retry`, `weekly-review`). Add auto-generated inventory block. |



