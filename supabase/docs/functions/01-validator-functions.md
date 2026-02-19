# Validator Functions — Architecture Review & Strategy

> **Reviewed:** 2026-02-14 | **Functions:** 16 validator + 1 workflow | **Total LOC:** 6,440
> **Pipeline version:** v2 (monolith, working E2E, 6 runs) | v3 (microservices, on disk, not activated)
> **Frontend:** `useValidatorPipeline` hook calls `validator-start` (v2)

The validator is StartupAI's core product feature: a founder types their startup idea, and 7 AI agents analyze it across market, competition, risk, and MVP dimensions, producing a 14-section investor-grade report in under 60 seconds. Today, all 7 agents are bundled inside a single edge function (`validator-start`, 2,798 LOC). A v3 microservice architecture exists on disk (7 standalone agents + orchestrator) but is not yet wired. This review scores all 16 validator functions plus `workflow-trigger`, identifies what to keep, merge, and defer, and recommends a concrete strategy for moving forward.

---

## Scoring Criteria

| Weight | Criterion | Description |
|:------:|-----------|-------------|
| 40% | **Core journey value** | Does it power a critical user flow? |
| 20% | **Uniqueness** | Is it the only function doing this? |
| 20% | **Code quality** | Uses shared patterns, error handling, rate limiting? |
| 20% | **MVP necessity** | Required for Phase 1 launch? |

**Verdict key:** 🟢 Keep (70+) | 🟡 Improve (45-69) | 🔴 Remove/Defer (<45)

---

## Master Table

### A. Production Pipeline (v2 — Working E2E)

These functions power the live validation flow today.

| # | Function | LOC | What It Does | Phase | Score | Verdict | Deployed | Frontend Calls |
|:-:|----------|----:|--------------|:-----:|------:|:-------:|:--------:|:--------------:|
| 1 | `validator-start` | 2,798 | Pipeline entry + 7 bundled agents (extract, research, competitors, score, mvp, compose, verify). Background execution via `EdgeRuntime.waitUntil`. | P1 | 95 | 🟢 | Yes | Yes |
| 2 | `validator-status` | 217 | Polling endpoint — session state + agent progress + zombie cleanup (6-min threshold). | P1 | 88 | 🟢 | Yes | Yes |
| 3 | `validator-followup` | 223 | Follow-up Q&A on completed reports. Uses industry playbooks, URL context, Google Search. | P2 | 70 | 🟡 | Yes | Yes |
| 4 | `validator-flow` | 68 | Thin proxy — routes POST/GET to validator-start/status/followup. No logic. | P1 | 35 | 🔴 | Yes | No |
| 5 | `validator-regenerate` | 117 | Re-runs pipeline for existing session (ownership check + proxy to validator-start). | P2 | 50 | 🟡 | Yes | No |
| 6 | `validator-panel-detail` | 131 | Expands one report section (1-14) into deeper sub-analysis on demand. | P2 | 48 | 🟡 | Yes | No |

### B. v3 Microservice Agents (On Disk, Not Activated)

Pre-built for future architecture. Each agent runs in its own isolate for independent scaling and retry.

| # | Function | LOC | What It Does | Phase | Score | Verdict | Deployed | Frontend Calls |
|:-:|----------|----:|--------------|:-----:|------:|:-------:|:--------:|:--------------:|
| 7 | `validator-orchestrate` | 484 | v3 entry point — dispatches 6 agents via HTTP, DAG scheduling, deadline checks. | P3 | 42 | 🔴 | Yes | No |
| 8 | `validator-agent-extract` | 118 | Standalone extractor — raw text to structured profile. | P3 | 38 | 🔴 | Yes | No |
| 9 | `validator-agent-research` | 127 | Standalone market research — TAM/SAM/SOM via Google Search + URL Context. | P3 | 38 | 🔴 | Yes | No |
| 10 | `validator-agent-score` | 139 | Standalone scoring — Gemini thinking mode (high) for deep analysis. | P3 | 38 | 🔴 | Yes | No |
| 11 | `validator-agent-mvp` | 131 | Standalone MVP planner — phases, timeline, build/buy/skip. | P3 | 38 | 🔴 | Yes | No |
| 12 | `validator-agent-compose` | 234 | Standalone composer — assembles 14-section report from all agent outputs. | P3 | 38 | 🔴 | Yes | No |

### C. Validator Board (Advisory Board Feature — Unfinished)

AI advisory board simulation. No frontend integration exists. Feature is spec'd but not built.

| # | Function | LOC | What It Does | Phase | Score | Verdict | Deployed | Frontend Calls |
|:-:|----------|----:|--------------|:-----:|------:|:-------:|:--------:|:--------------:|
| 13 | `validator-board-coach` | 126 | Expert personas analyze assumption board state, suggest next action. | P3 | 30 | 🔴 | Yes | No |
| 14 | `validator-board-extract` | 133 | Extracts testable assumptions from validation report sections. | P3 | 30 | 🔴 | Yes | No |
| 15 | `validator-board-suggest` | 140 | Recommends validation methods for specific assumptions. | P3 | 30 | 🔴 | Yes | No |

### D. Automation

| # | Function | LOC | What It Does | Phase | Score | Verdict | Deployed | Frontend Calls |
|:-:|----------|----:|--------------|:-----:|------:|:-------:|:--------:|:--------------:|
| 16 | `workflow-trigger` | 910 | Score-based automation — 18 trigger rules create tasks when scores fall below thresholds. | P2 | 55 | 🟡 | Yes | No |

---

## Scorecard Summary

| Metric | Count | LOC |
|--------|------:|----:|
| 🟢 Keep (70+) | **2** | 3,015 (47%) |
| 🟡 Improve (45-69) | **4** | 1,281 (20%) |
| 🔴 Remove/Defer (<45) | **10** | 2,144 (33%) |
| **Total** | **16** | **6,440** |

**The problem is clear:** 10 of 16 validator functions are either dormant (v3 agents, board) or unnecessary (flow proxy). Only 2 functions actually serve users today: `validator-start` and `validator-status`.

---

## Detailed Analysis

### 1. `validator-start` — 🟢 95/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | Monolith pipeline: creates session, runs 7 agents (extract → [research + competitors] → score → mvp → compose → verify) in background via `EdgeRuntime.waitUntil`. |
| **Strategic value** | THE product. Without this, there is no validation. 6 successful E2E runs. Scores 62-78 range. |
| **If removed** | Product is dead. |
| **Overlap** | `validator-orchestrate` (v3 replacement, not active). |
| **Risk** | MEDIUM — 2,798 LOC in one function. Cold starts ~3s. All agents bundled means one failure can cascade. |
| **Quality** | Uses shared `callGemini`, `extractJSON`, CORS, rate-limit. Clean pipeline.ts with DAG scheduling. Deadline checks at 300s. Graceful degradation for non-critical agents. |
| **Refactor path** | When v3 activates, this becomes the v3 orchestrator. Until then, leave it alone — it works. |
| **Action** | None. Production code. Do not touch. |

### 2. `validator-status` — 🟢 88/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | Read-only polling endpoint. Returns session state + per-step progress. Zombie cleanup marks sessions stuck >6 min as failed. |
| **Strategic value** | Frontend polls this every 2s during validation. No status = no progress bar. |
| **If removed** | Frontend shows infinite spinner. |
| **Overlap** | None. |
| **Risk** | LOW — 217 LOC, simple reads. |
| **Quality** | Clean. Lazy admin client for zombie cleanup. |
| **Refactor path** | When v3 activates, add JOIN to `validator_agent_runs` for per-agent bars (spec in task 20-VWR). |
| **Action** | None now. Modify for v3 when wiring happens. |

### 3. `validator-followup` — 🟡 70/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | Conversational follow-up on completed reports. Uses industry playbooks, URL context, Google Search grounding, entity discovery. |
| **Strategic value** | MEDIUM — lets founders dig deeper into their report. "Tell me more about the competitor landscape." |
| **If removed** | Users read the report but can't ask questions. Minor loss for MVP. |
| **Overlap** | `ai-chat` could handle this with report context injection. `validator-regenerate` and `validator-panel-detail` also modify reports post-generation. |
| **Risk** | LOW — 223 LOC, well-scoped. |
| **Quality** | Uses shared patterns. Industry playbook injection is unique value. |
| **Refactor path** | Merge with `validator-regenerate` + `validator-panel-detail` into single `validator-refine` with 3 actions: `{followup, regenerate, expand}`. |
| **Action** | Keep for now. Merge candidate when building report interactivity. |

### 4. `validator-flow` — 🔴 35/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | Proxy router. POST → validator-start, GET → validator-status, POST with followup → validator-followup. Zero business logic. |
| **Strategic value** | NONE — adds indirection. Frontend already calls individual functions directly. |
| **If removed** | Nothing breaks. Frontend routes don't use it. |
| **Overlap** | Pure duplicate of start + status + followup. |
| **Risk** | LOW — 68 LOC. But it's a deployed function consuming a slot for nothing. |
| **Action** | **Undeploy.** Remove from `config.toml`. Keep code on disk for reference. |

### 5. `validator-regenerate` — 🟡 50/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | Re-runs the full pipeline for an existing session. Verifies ownership, proxies to validator-start. |
| **Strategic value** | LOW-MEDIUM — "I don't like this report, redo it." |
| **If removed** | Users create a new validation instead of re-running. Minor friction. |
| **Overlap** | `validator-followup` (all 3 post-report functions could be one). |
| **Risk** | LOW — 117 LOC. |
| **Action** | Merge into `validator-refine` later. Not urgent. |

### 6. `validator-panel-detail` — 🟡 48/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | On-demand deep dive into a single report section. Click section 3 → get expanded market analysis. |
| **Strategic value** | LOW-MEDIUM — nice-to-have for power users. |
| **If removed** | Report shows summary only, no drill-down. |
| **Overlap** | `validator-followup` can answer the same questions conversationally. |
| **Risk** | LOW — 131 LOC. |
| **Action** | Merge into `validator-refine` later. |

### 7-12. v3 Agents (6 functions) — 🔴 38-42/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | Pre-built microservice agents for v3 architecture. Each runs in its own isolate. Orchestrator dispatches via HTTP. |
| **Strategic value** | FUTURE — better cold starts, independent scaling, per-agent retry. But v2 works fine today. |
| **If removed** | Zero impact. v2 is production. |
| **Overlap** | All 7 agents exist bundled inside `validator-start`. |
| **Risk** | MEDIUM — 7 dormant functions taking deployment slots. Confusing for developers ("which one do I edit?"). |
| **Specs exist** | Tasks 15-20 in `tasks/prompts/validator/` have full specs: DAG scheduling, graceful degradation, agent_runs table, frontend wiring, archive plan. |
| **Action** | **Undeploy all 7.** Remove from `config.toml`. Keep code + specs on disk. Activate when v2 hits scaling limits (>50 concurrent validations, cold starts >5s, or need per-agent retry). |

### 13-15. Board Functions (3 functions) — 🔴 30/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | AI advisory board — expert personas discuss your startup assumptions. |
| **Strategic value** | NONE today — no frontend exists for this feature. P3 spec only. |
| **If removed** | Zero impact. Feature doesn't exist in the app. |
| **Overlap** | `ai-chat` (coaching) + `industry-expert-agent` (industry expertise) together cover this use case. |
| **Risk** | LOW — small functions, ~400 LOC total. |
| **Design note** | If built, should be ONE function with 3 actions (`{coach, extract, suggest}`), not 3 separate functions. |
| **Action** | **Undeploy all 3.** Keep code on disk. Build as single function if/when the Board feature is prioritized. |

### 16. `workflow-trigger` — 🟡 55/100

| Aspect | Assessment |
|--------|-----------|
| **Role** | Score-based automation engine. 18 trigger rules watch health scores, validation reports, investor/readiness scores. When scores drop below thresholds, creates corrective tasks. |
| **Strategic value** | MEDIUM — proactive guidance. "Your health score dropped below 60 → here's a task to fix it." |
| **If removed** | No automated task creation. Founders must monitor their own metrics. Acceptable for MVP. |
| **Overlap** | `action-recommender` (rule-based task recs), `task-agent` (task creation). |
| **Risk** | MEDIUM — 910 LOC, complex 18-rule engine. Uses service role auth. |
| **Quality** | Clean rule engine pattern. Activity logging to `workflow_activity_log`. |
| **Refactor path** | Absorb `action-recommender` (264 LOC) from the intelligence group. Both evaluate startup state → recommend actions. |
| **Action** | Keep deployed. Absorb action-recommender when cleaning up intelligence functions. |

---

## Strategy: What To Do Next

### Phase 1: Undeploy (Zero Risk, Zero Code Changes)

Remove 11 functions from `config.toml`. Keep code on disk. Save 11 deployment slots.

| Action | Functions | LOC Saved | Risk |
|--------|-----------|----------:|:----:|
| Undeploy v3 agents | `validator-orchestrate`, `validator-agent-extract`, `validator-agent-research`, `validator-agent-score`, `validator-agent-mvp`, `validator-agent-compose` | 1,233 | Zero |
| Undeploy board | `validator-board-coach`, `validator-board-extract`, `validator-board-suggest` | 399 | Zero |
| Undeploy proxy | `validator-flow` | 68 | Zero |

**Result:** 16 functions → 5 deployed. Same capability. 11 fewer cold start pools.

**Remaining deployed:** `validator-start`, `validator-status`, `validator-followup`, `validator-regenerate`, `validator-panel-detail`, `workflow-trigger`

### Phase 2: Merge Post-Report Functions (Small Effort)

Combine 3 post-report functions into 1.

| From | Into | Actions | Effort |
|------|------|---------|:------:|
| `validator-regenerate` (117 LOC) | `validator-refine` (new name for `validator-followup`) | `{followup, regenerate, expand}` | S |
| `validator-panel-detail` (131 LOC) | same | same | S |

**Result:** 5 deployed → 3 deployed + `workflow-trigger`.

**Remaining deployed:** `validator-start`, `validator-status`, `validator-refine`, `workflow-trigger`

### Phase 3: v3 Activation (When Needed)

When v2 hits scaling limits, activate v3:

1. Deploy 7 standalone agents from disk
2. Wire `validator-orchestrate` as new entry point
3. Update `useValidatorPipeline` hook to call `validator-orchestrate` (spec: task 20-VWR)
4. Update `validator-status` to JOIN `validator_agent_runs` for per-agent progress bars
5. Archive `validator-start` (move to `supabase/functions/_archive/`)

**Trigger criteria for v3:**
- Cold starts consistently >5s
- >50 concurrent validations
- Need per-agent retry from UI
- Need independent agent scaling

### Phase 4: Report V2 + Deterministic Scoring (Quality)

From the design prompts and validator plan:

1. **Deterministic scoring** (task 01-plan Step 5): LLM provides qualitative dimension scores → TypeScript function computes `overall_score`, `verdict`, `factor_statuses`. Removes variance between runs.
2. **Structured Composer output** (task 13E/13-report-v2): Composer outputs structured JSON with conversational tone for v2 report components.
3. **Report V2 frontend** (tasks 13A-13F): 10 new visual components (Hero, ProblemCard, CustomerPersona, MarketBubbles, CompetitorMatrix, RiskHeatmap, MVPScope, NextStepsTimeline, RevenueModelDash, TeamPlanCards).

---

## Architecture: Current vs Target

```
CURRENT (v2 monolith — working)
────────────────────────────────
Frontend → validator-start (2,798 LOC, 7 bundled agents)
         → validator-status (polling)
         → validator-followup (Q&A)

TARGET (v3 microservices — future)
──────────────────────────────────
Frontend → validator-orchestrate (thin dispatcher)
         → validator-status (per-agent progress)
         → validator-refine (followup + regenerate + expand)

         validator-orchestrate dispatches:
           → validator-agent-extract
           → validator-agent-research  (parallel)
           → validator-agent-competitors (parallel)
           → validator-agent-score
           → validator-agent-mvp
           → validator-agent-compose
```

---

## Key Dependencies

| Function | Depends On | Feeds Into |
|----------|-----------|------------|
| `validator-start` | `_shared/gemini.ts`, `_shared/cors.ts`, `_shared/rate-limit.ts` | `validator_sessions`, `validator_reports` tables |
| `validator-status` | `validator_sessions`, `validator_agent_runs` tables | Frontend polling |
| `validator-followup` | `_shared/gemini.ts`, `_shared/playbooks/`, `_shared/industry-context.ts` | Conversation response |
| `workflow-trigger` | `health_scores`, `validator_reports`, `investor_scores` | `tasks`, `workflow_activity_log` tables |

---

## Risk Assessment

| Risk | Severity | Functions | Mitigation |
|------|:--------:|-----------|------------|
| v2 monolith cold start | MEDIUM | validator-start | Warm with periodic health check. Migrate to v3 when >5s consistently. |
| 11 dormant deployed functions | LOW | v3 agents, board, flow | Phase 1: undeploy from config.toml |
| 3 overlapping post-report fns | LOW | followup, regenerate, panel-detail | Phase 2: merge into validator-refine |
| Scoring variance between runs | MEDIUM | validator-start (scoring agent) | Phase 4: deterministic scoring math layer |
| No per-agent retry | LOW | validator-start | Phase 3: v3 enables single-agent retry |
| workflow-trigger + action-recommender overlap | LOW | workflow-trigger | Absorb action-recommender when cleaning intelligence functions |

---

## Reference Documents

| Topic | Path |
|-------|------|
| v3 Orchestrator spec | `tasks/prompts/validator/15-validator-v3-orchestrator.md` |
| v3 Agent specs | `tasks/prompts/validator/16-*.md` through `19-*.md` |
| v3 Frontend wiring | `tasks/prompts/validator/20-validator-v3-wiring.md` |
| Agent runs table | `tasks/prompts/validator/15a-validator-agent-runs-table.md` |
| Skill improvement plan | `tasks/prompts/validator/01-plan.md` |
| Report V2 components | `tasks/prompts/design/13-report-v2-prompts.md` |
| Report shared components | `tasks/prompts/design/13A-report-shared-components.md` |
| Report assembly | `tasks/prompts/design/13E-report-assembly-backend.md` |
| Executive summary | `tasks/prompts/design/13F-report-executive-summary.md` |
| Idea validation skill | `.agents/skills/startup/startup-idea-validation/SKILL.md` |
| Startup analyst skill | `.agents/skills/startup/startup-analyst/SKILL.md` |
| Full edge functions audit | `supabase/functions/index-functions.md` |

---

*Generated by architecture review — 2026-02-14*
