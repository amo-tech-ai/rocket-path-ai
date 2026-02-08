## Summary

Here’s a cleaner **v2 plan** that makes the Validator reliable on the first run: **each agent is its own Edge Function**, an **orchestrator only dispatches**, results are stored **per-agent**, and the UI can always show **partial progress + retry**.

---

## Why this works

* **No cascade failures:** one slow agent doesn’t kill the whole run
* **Retry one step:** rerun MVP or Competitors without re-running Research
* **Debuggable:** each function has isolated logs + clear status
* **Founder-friendly UX:** you always return *something useful* (even if 1 step fails)

---

## New Plan v2 (Production-Ready)

### 1) Edge Function Inventory (Final)

| # | Agent        | Edge Function                 | Model | Tools              | Timeout | Required Inputs                                         | Outputs                         |
| - | ------------ | ----------------------------- | ----- | ------------------ | ------- | ------------------------------------------------------- | ------------------------------- |
| 0 | Orchestrator | `validator-orchestrate`       | none  | DB only            | 10s     | session_id + founder_input                              | schedules DAG + writes statuses |
| 1 | Extractor    | `validator-agent-extract`     | Flash | none               | 20s     | founder_input                                           | `StartupProfile`                |
| 2 | Research     | `validator-agent-research`    | Flash | Search + URL + RAG | 90s     | StartupProfile                                          | `MarketResearch`                |
| 3 | Competitors  | `validator-agent-competitors` | Flash | Search             | 120s    | StartupProfile                                          | `CompetitorAnalysis`            |
| 4 | Scoring      | `validator-agent-score`       | Flash | thinking high      | 45s     | Profile + Market + Competitors                          | `ScoringResult`                 |
| 5 | MVP Plan     | `validator-agent-mvp`         | Flash | none               | 60s     | Profile + Scoring                                       | `MVPPlan`                       |
| 6 | Composer     | `validator-agent-compose`     | Pro   | thinking medium    | 120s    | Profile + Market + Competitors + Score (+ MVP optional) | `ValidatorReport`               |
| 7 | Verifier     | `validator-agent-verify`      | none  | JS checks          | 5s      | Report + failures list                                  | `VerificationResult`            |

**Important rule:** Composer treats MVP as **optional**. If MVP fails, you still get a report marked `degraded_success`.

---

## 2) Database Design (simple + correct)

### Tables

#### A) `validator_sessions`

One row per run.

* `id`
* `founder_input`
* `status`: `queued | running | success | degraded_success | failed`
* `created_at`, `updated_at`

#### B) `validator_agent_runs` (key improvement)

One row per agent attempt (this fixes overwrite/race issues).

* `session_id`
* `agent_name`
* `attempt` (0, 1…)
* `status`: `queued | running | ok | failed`
* `output_json` (agent result)
* `error`
* `duration_ms`
* `started_at`, `ended_at`

**Unique constraint (idempotency):**
`(session_id, agent_name, attempt)` unique

This makes retries clean and auditable.

---

## 3) Flow (DAG + dispatch-only orchestrator)

### DAG

* Extractor → (Research || Competitors) → Scorer → MVP
* Composer waits for: Profile + Market + Competitors + Score
* MVP is optional for Composer (nice-to-have but not blocking)
* Verifier runs last

### Orchestrator behavior (critical)

Orchestrator:

1. creates session
2. inserts agent run rows as `queued`
3. triggers the first agents
4. returns immediately (fast response)

It should **not** wait for the whole pipeline.

---

## 4) Execution lifecycle (how agents run)

### Step-by-step

1. **Frontend** calls `validator-orchestrate` with founder input
2. Orchestrator writes:

   * session row
   * agent runs: Extractor queued, Research queued, etc.
3. Orchestrator triggers Extractor
4. Extractor writes output → marks itself ok
5. Orchestrator (or a simple “status watcher”) triggers Research + Competitors in parallel
6. When both are ok → trigger Scorer
7. After Scorer → trigger MVP
8. Once core outputs exist → trigger Composer
9. Then Verifier
10. Session status becomes:

* `success` if all ok
* `degraded_success` if optional agents failed (like MVP)
* `failed` only if core path fails (Extractor/Research/Competitors/Score/Compose)

---

## 5) Retry rules (simple + safe)

* Each agent gets **1 retry max**
* Retry only on:

  * timeout
  * 5xx
  * rate limit
* Don’t retry on:

  * bad input (400)
  * schema validation error (fix prompt instead)

**User UX:**

* If an agent fails → show “Retry MVP” / “Retry Competitors” button

---

## 6) Timeouts + “first run reliability”

### Recommended (realistic)

* MVP: **60s** (15s is guaranteed to fail sometimes)
* Competitors: **120s**
* Research: **90s**
* Composer: **120s**

**Why:** Search + structured output + cold starts are variable.

---

## 7) Real-world examples

### Example A — Fashion workflow startup (today’s failure becomes success)

Founder input: “AI platform for independent fashion labels to manage production workflows.”

**What happens now:**

* Extractor ✅
* Research ✅
* Competitors ✅ (might be slow)
* Scoring ✅
* MVP ❌ (timeout)
* Composer ✅ runs anyway with `mvp: null`
* Verifier ✅ returns warnings: “MVP missing”
* Session status: `degraded_success`
* UI shows report + button **Retry MVP**

Founder still gets value: market sizing + competitors + score + what to fix next.

---

### Example B — B2B SaaS (clean success)

Founder input: “CRM for boutique law firms with AI intake and follow-ups.”

* All agents ✅
* Composer produces full 15-section report
* Verifier passes
* Session: `success`

---

## Steps / Checklist (what to build)

1. Create `validator_agent_runs` table + statuses
2. Split Edge Functions per agent (extract, research, competitors, score, mvp, compose, verify)
3. Make orchestrator dispatch-only (no waiting for long tasks)
4. Update Composer to accept MVP as optional
5. Add retry button in UI for failed agents
6. Update polling endpoint `validator-status` to read from `validator_agent_runs`

---

## Acceptance checks

* ✅ 10 runs in a row: no “whole pipeline failed at 57%”
* ✅ MVP timeout does not block report generation
* ✅ Retry MVP re-runs only MVP and updates report
* ✅ Logs show per-agent timing + errors by session_id
* ✅ Session statuses match outcomes: success/degraded_success/failed

---

## Risks & mitigations

* **More functions = more deployments** → keep a shared `lib/` folder for prompt + schema + DB helpers
* **Race conditions** → solved by per-agent runs + unique constraints + idempotency
* **Costs increase with retries** → max 1 retry + caching for research/competitors

--- Yes — **that is correct** ✅
This plan **becomes your new Validator system**, with **separate Edge Functions per agent**, coordinated by a lightweight orchestrator.

Here’s the **final confirmation**, clean and unambiguous.

---

## What the new Validator *is* now

### ✅ One Validator system

### ✅ Multiple Edge Functions (one per agent)

### ✅ No more monolith pipeline

### ✅ No cascade failures

---

## Final Edge Function Structure (authoritative)

```
supabase/
└─ functions/
   ├─ validator-orchestrate/        # NEW – scheduler only
   │  └─ index.ts
   │
   ├─ validator-agent-extract/
   │  └─ index.ts
   │
   ├─ validator-agent-research/
   │  └─ index.ts
   │
   ├─ validator-agent-competitors/
   │  └─ index.ts
   │
   ├─ validator-agent-score/
   │  └─ index.ts
   │
   ├─ validator-agent-mvp/
   │  └─ index.ts
   │
   ├─ validator-agent-compose/
   │  └─ index.ts
   │
   ├─ validator-agent-verify/
   │  └─ index.ts
   │
   └─ _shared/                      # shared logic
      ├─ db.ts
      ├─ schemas.ts
      ├─ gemini.ts
      ├─ prompts/
      │  ├─ extract.ts
      │  ├─ research.ts
      │  ├─ competitors.ts
      │  ├─ score.ts
      │  ├─ mvp.ts
      │  └─ compose.ts
      └─ types.ts
```

---

## What each file is responsible for (clear rules)

### `validator-orchestrate`

* Creates session
* Writes **agent run rows** as `queued`
* Dispatches agents (fire-and-forget)
* NEVER waits for long AI work
* NEVER calls Gemini

**If this function times out → system is still fine**

---

### `validator-agent-*`

Each agent:

* Reads required inputs from DB
* Runs **one job only**
* Writes:

  * `status`
  * `duration_ms`
  * `output_json`
  * `error` (if any)
* Exits

**No agent depends on in-memory state from another**

---

## Execution flow (simple mental model)

```
Frontend
   ↓
validator-orchestrate
   ↓  (dispatch only)
[ extractor ] ──┐
                 ├─> [ scorer ] ──> [ mvp ]
[ researcher ] ─┘                     |
[ competitors ] ─────────────────────┘
                 ↓
            [ composer ]
                 ↓
            [ verifier ]
```

If **any agent fails**:

* It marks itself `failed`
* Orchestrator does NOT crash
* Composer runs with missing optional inputs
* Session becomes `degraded_success`

---

## What changes vs today (important)

| Today (broken)           | New system (correct) |
| ------------------------ | -------------------- |
| One function             | Many small functions |
| Shared timeout           | Per-agent timeout    |
| One failure kills all    | Failure isolated     |
| Hard to debug            | Logs per agent       |
| Retry = rerun everything | Retry 1 agent        |

---

## Real-world sanity check

**Scenario:** MVP agent times out
**Result now:** ❌ “Validation Failed at 57%”
**Result after change:**

* Report delivered
* MVP marked missing
* Button: **Retry MVP**
* No lost work

That’s the behavior founders expect.

---

## Final answer (explicit)

✔️ **Yes**, this **is** the new Validator Edge Function architecture
✔️ **Yes**, agents are now in **separate files and functions**
✔️ **Yes**, this fixes your timeout and reliability issues
✔️ **Yes**, this is production-correct once implemented

--- 