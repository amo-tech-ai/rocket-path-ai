# Validator Pipeline Strategy Fix Plan

> **Date:** 2026-02-08 | **Status:** Active
> **Goal:** Make the validator pipeline complete successfully and reliably




  ---
  Verification Report: validator-start vs Best Practices Docs

  CRITICAL — Will break or degrade production
  #: C1
  Issue: Deprecated serve import
  File:Line: index.ts:7
  Doc Reference: 01-architecture:164
  Impact: Uses import { serve } from "https://deno.land/std@0.168.0/http/server.ts" — docs explicitly mark this as

    ❌ WRONG. Should use Deno.serve().
  ────────────────────────────────────────
  #: C2
  Issue: No EdgeRuntime.waitUntil() for background pipeline
  File:Line: index.ts:119
  Doc Reference: 08-background-tasks:20-33
  Impact: Pipeline fires as a plain unawaited promise. The official pattern is
    EdgeRuntime.waitUntil(runPipeline(...)). Without it, the runtime has no contract to keep the isolate
    alive — it works today but is not guaranteed.
  ────────────────────────────────────────
  #: C3
  Issue: thinkingLevel: 'medium' accepted in interface
  File:Line: gemini.ts:12
  Doc Reference: 09-ai-integration:31,244
  Impact: The type allows 'medium' but Gemini 3 only supports 'high' or 'low'. If any agent passes 'medium',
  Gemini
     returns 400. Currently no agent uses it, but the type is a trap.
  ────────────────────────────────────────
  #: C4
  Issue: Type/prompt mismatch: monthly_y1
  File:Line: types.ts:130 vs composer.ts:33-35
  Doc Reference: —
  Impact: FinancialProjections.monthly_y1 exists in the TypeScript type but the Composer prompt explicitly says
    "removed monthly_y1". Gemini won't generate it → downstream code expecting it will get undefined.
  HIGH — Reliability gaps
  #: H1
  Issue: No beforeunload handler
  File:Line: index.ts / pipeline.ts
  Doc Reference: 08-background-tasks:126-133
  Impact: When Deno Deploy kills the isolate at 150s, the catch-all safety net in pipeline.ts:232-246 never fires
    because the process is killed. addEventListener('beforeunload', ...) is the only way to mark the session
    as failed on forced shutdown. This is a direct cause of the 7 zombie sessions.
  ────────────────────────────────────────
  #: H2
  Issue: No unhandledrejection handler
  File:Line: index.ts
  Doc Reference: 08-background-tasks:114-119
  Impact: The .catch() on line 120 handles the pipeline promise, but any unexpected rejection elsewhere would be
    silently swallowed.
  ────────────────────────────────────────
  #: H3
  Issue: Dead code: preComposerStatus never used
  File:Line: pipeline.ts:141
  Doc Reference: —
  Impact: const preComposerStatus = failedAgents.length === 0 ? 'composing' : 'composing' — both branches return
    'composing', then the variable is never referenced. The actual update writes status: 'running'. Confusing
     but not breaking.
  ────────────────────────────────────────
  #: H4
  Issue: CORS missing Access-Control-Allow-Methods
  File:Line: config.ts:11-14
  Doc Reference: 02-security:316
  Impact: getCorsHeaders() omits Access-Control-Allow-Methods. Preflight requests may fail on strict browsers.
  Docs
     show this should be included.
  MEDIUM — Best practices gaps
  #: M1
  Issue: No ai_runs cost tracking
  File: All agents
  Doc Reference: 09-ai-integration:99-137, 14-ai-agents:85-106
  Impact: Docs strongly recommend logging token counts and costs to an ai_runs table. Implementation only logs to
    validator_runs. No cost visibility.
  ────────────────────────────────────────
  #: M2
  Issue: Raw fetch() instead of @google/genai SDK
  File: gemini.ts:98
  Doc Reference: 09-ai-integration:21-34, 14-ai-agents:148-150
  Impact: Implementation uses raw REST API calls. Docs use the npm:@google/genai@^0.21.0 SDK which provides type
    safety, better error handling, and structured response parsing.
  ────────────────────────────────────────
  #: M3
  Issue: No fallback model
  File: All agents
  Doc Reference: 14-ai-agents:203-204
  Impact: Docs recommend each agent have a fallbackModel. If gemini-3-flash-preview is down, all 7 agents fail
  with
     no fallback.
  ────────────────────────────────────────
  #: M4
  Issue: SupabaseClient = any
  File: types.ts:144
  Doc Reference: —
  Impact: Loses all type safety for DB operations. Should import from @supabase/supabase-js.
  ────────────────────────────────────────
  #: M5
  Issue: No structured logging
  File: All files
  Doc Reference: 04-error-handling:343-367
  Impact: Uses plain console.error() instead of structured JSON logging. Makes production debugging harder in
    Supabase Dashboard.
  LOW — Minor inconsistencies
  #: L1
  Issue: OPTIONS response body null
  File:Line: index.ts:17
  Note: Docs show new Response('ok', ...), code uses null. Both work.
  ────────────────────────────────────────
  #: L2
  Issue: serve() wrapper vs Deno.serve()
  File:Line: index.ts:13
  Note: Related to C1 — the serve() import wraps everything in a callback vs Deno.serve() which is the runtime
    primitive.
  ---
  Summary: What blocks the pipeline fix?

  Nothing blocks the pipeline reorder. The issues above are independent of the execution order change.

  But two findings directly explain the 87% failure rate:

  1. H1 (no beforeunload) — When Deno kills the isolate at 150s, there's no cleanup handler. This is why 7
  sessions are stuck as "running" forever. The catch-all safety net (F3) only works for JavaScript exceptions, not
   process termination.
  2. C2 (no waitUntil) — While fire-and-forget works today, EdgeRuntime.waitUntil() explicitly tells the runtime
  "I have background work, keep me alive." This is a future-proofing issue.

  Recommendation: Fix the pipeline reorder first (strategy plan Phase 1), then address H1 + C1 in the same deploy.
   The beforeunload handler is a 5-line addition that prevents zombie sessions. The serve → Deno.serve migration
  is a 2-line change.





---

## 1. Forensic Analysis (15 sessions, last 24h)

### 1.1 Session Outcomes

| Outcome | Count | Rate |
|---------|-------|------|
| Full success (all 7 agents OK, report saved) | 2 | 13% |
| Composer stuck/killed (Deno wall-clock) | 9 | 60% |
| Composer failed (zombie cleanup) | 4 | 27% |

**Verdict: 87% failure rate. Composer is the single point of failure.**

### 1.2 Agent Timing (from all 15 runs)

| Agent | Min | Median | Max | Timeout | Fail Rate |
|-------|-----|--------|-----|---------|-----------|
| Extractor | 3.8s | 6.0s | 9.4s | 10s | 0% |
| Research | 17.9s | 20.4s | 24.8s | 40s | 13% (2/15) |
| Competitors | 17.4s | 28.4s | 40.6s | 35s | 33% (5/15) |
| Scoring | 9.3s | 11.4s | 13.2s | 15s | 0% |
| MVP | 7.1s | 9.7s | 12.8s | 15s | 7% (1/15) |
| Composer | 23.2s | N/A | 25.0s | 55s | **87%** (13/15) |
| Verifier | 0.3s | 0.3s | 0.3s | 5s | 0% (when run) |

### 1.3 The Two Successful Runs

| Session | Competitors | Pre-Composer | Composer | Total |
|---------|------------|--------------|----------|-------|
| `5ac229c0` | 24.1s | 68s | 23.2s | ~92s |
| `dac4964c` | 26.0s | 66s | 25.0s | ~91s |

**Pattern:** Composer works fine (23-25s) when total pre-Composer time stays under ~68s.

### 1.4 Why Composer Fails

| Root Cause | Evidence | Sessions |
|------------|----------|----------|
| Deno Deploy kills isolate at 150s | `error: "Deno wall-clock timeout"` | 2 |
| Composer still running when pg_cron fires | `error: "Parent session timed out (zombie cleanup)"` | 4 |
| Composer stuck as "running" forever | `duration_ms: null, status: running` | 7 |
| Gemini 400 error (schema too complex) | `error: "Gemini API error: 400"` | 1 |

---

## 2. Root Cause Chain

```
CURRENT PIPELINE (blocked by Competitors):

Extractor(6s) → await BOTH [Research(20s) + Competitors(35-41s)] → Scoring(12s) → MVP(10s) → Composer(25s)
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                              Scoring WAITS for Competitors to finish
                              even though Scoring works fine with competitors=null

Critical path: 6 + 41 + 12 + 10 + 25 = 94s (best case)
With slow Competitors: 6 + 41 + 12 + 10 + 25 = 94s → Deno kills at 150s during Composer
```

**The core problem: Competitors blocks Scoring/MVP even though neither needs competitor data. This wastes 15-20s of Composer's time budget.**

---

## 3. Critical Blockers (ordered by severity)

| # | Blocker | Impact | Root Cause |
|---|---------|--------|------------|
| **B1** | Composer exceeds 150s Deno wall-clock | Pipeline always fails | All 7 agents in one function call |
| **B2** | Competitors Google Search takes 25-41s | Eats Composer's time budget | `googleSearch` tool latency is unpredictable |
| **B3** | AbortSignal.timeout cannot kill pending fetch | Composer runs until Deno kills it | Deno Deploy platform limitation |
| **B4** | No report saved when Composer fails | User gets nothing | Pipeline is all-or-nothing for the report |
| **B5** | 7 zombie Composer sessions still "running" in DB | Stale data | Zombie cleanup only catches sessions >3 min old |

---

## 4. Fix Plan

### Strategy: Unblock Critical Path + Tame Competitors

**Principle:** Competitors is slow but non-blocking. Don't let it hold up Scoring, MVP, or Composer.

```
NEW PIPELINE (Competitors runs in background):

Extractor(6s)
  |
  +---> Research(20s) ----+
  |                        |
  +---> Competitors(45s)   |  (background, non-blocking)
                           v
                    Scoring(12s)  (uses Research only, competitors=null OK)
                           |
                       MVP(10s)
                           |
                    await Competitors (if still running, wait up to remaining budget)
                           |
                    Composer(25s) (gets competitor data if available, or null)
                           |
                    Verifier(1s)

Critical path: 6 + 20 + 12 + 10 + 25 + 1 = 74s
Competitors gets 6+20+12+10 = 48s to finish (in parallel) before Composer starts
```

**Time budget: 74s critical path + 20s overhead = 94s total. 56s buffer before 150s Deno limit.**

---

### Phase 1: Reorder Pipeline (fixes B1, B2, B4)

| Step | Action | File | Verify |
|------|--------|------|--------|
| 1.1 | Launch Competitors as background promise (don't await with Research) | `pipeline.ts` | Competitors starts at same time as Research |
| 1.2 | Start Scoring immediately after Research (pass `competitors=null`) | `pipeline.ts` | Scoring doesn't wait for Competitors |
| 1.3 | Start MVP immediately after Scoring | `pipeline.ts` | MVP doesn't wait for Competitors |
| 1.4 | After MVP: await Competitors with short grace period (5s or remaining budget) | `pipeline.ts` | Competitors result collected if ready |
| 1.5 | Pass Competitors result (or null) into Composer | `pipeline.ts` | Composer runs with whatever data is available |
| 1.6 | Update checkpoint to save after MVP (before Composer) | `pipeline.ts` | Pre-composer checkpoint includes competitor status |

### Phase 2: Tame Competitors Agent (fixes B2)

| Step | Action | File | Verify |
|------|--------|------|--------|
| 2.1 | Increase timeout from 35s to 45s | `config.ts:38` | Config shows 45_000 |
| 2.2 | Reduce scope: max 3 direct + 2 indirect (from 3-5 + 2-3) | `agents/competitors.ts` | Prompt says "Find 3 direct and 2 indirect" |
| 2.3 | Remove curated links block from prompt (reduces token count) | `agents/competitors.ts` | No curatedSourcesBlock in prompt |
| 2.4 | Add timeout fallback: return profile-based competitors on timeout | `agents/competitors.ts` | Partial result instead of null |

### Phase 3: Clean Up Zombie Data (fixes B5)

| Step | Action | File | Verify |
|------|--------|------|--------|
| 3.1 | One-time SQL: mark all stuck "running" agents older than 10 min as "failed" | SQL query | 0 zombie rows |
| 3.2 | One-time SQL: mark all stuck "running" sessions older than 10 min as "failed" | SQL query | 0 zombie rows |

### Phase 4: Deploy + Verify E2E

| Step | Action | Verify |
|------|--------|--------|
| 4.1 | Deploy `validator-start` (v31) | Edge function active, logs show new pipeline order |
| 4.2 | Run E2E test: enter idea (2 messages), generate | All 7 agents complete |
| 4.3 | Confirm Scoring starts BEFORE Competitors finishes | Scoring `started_at` < Competitors `finished_at` |
| 4.4 | Confirm report page loads with 15 sections | Report renders correctly |
| 4.5 | Confirm `validation_reports` row exists | DB row with score and details |
| 4.6 | Confirm session status is `complete` or `partial` | Terminal state, not stuck |
| 4.7 | Run 3 more E2E tests with different ideas | >75% success rate |
| 4.8 | Check edge function logs for total execution time | <100s consistently |

---

## 5. Files to Modify

| File | Full Path | Change |
|------|-----------|--------|
| **pipeline.ts** | `supabase/functions/validator-start/pipeline.ts` | Reorder: Competitors as background promise, don't block Scoring |
| **config.ts** | `supabase/functions/validator-start/config.ts` | Competitors timeout 35s -> 45s |
| **competitors.ts** | `supabase/functions/validator-start/agents/competitors.ts` | Reduce scope, remove curated links, add timeout fallback |
| **validator-start** | `supabase/functions/validator-start/index.ts` | No changes needed (pipeline.ts handles orchestration) |
| **validator-status** | `supabase/functions/validator-status/index.ts` | No changes needed (already reads agent statuses) |

---

## 6. Implementation Sequence

```
Phase 1 (Critical - do first, single deploy)
  Step 1.1  Reorder pipeline: Competitors as background promise
  Step 1.2  Scoring starts after Research (competitors=null)
  Step 1.3  MVP after Scoring
  Step 1.4  Await Competitors with grace period before Composer
  Step 1.5  Update checkpoint
  Step 1.6  Update config: Competitors timeout 45s

Phase 2 (Reliability - same deploy)
  Step 2.1-2.4  Tame Competitors prompt and add fallback

Phase 3 (Cleanup - SQL only)
  Step 3.1-3.2  Clean zombie data

Phase 4 (Verify)
  Step 4.1  Deploy validator-start v31
  Steps 4.2-4.8  E2E tests
```

---

## 7. What NOT to Do

| Anti-Pattern | Why It Fails |
|--------------|-------------|
| Split into two edge functions | Over-engineering; reordering pipeline is simpler and sufficient |
| Increase Deno Deploy timeout | Cannot exceed 150s, platform hard limit |
| Retry Composer on timeout | Doubles time, still hits 150s |
| Reduce Composer prompt further | Already streamlined, less produces bad report |
| Use setTimeout for pipeline deadline | setTimeout does not fire when event loop is blocked by pending fetch |
| Use AbortSignal.timeout on Composer | Cannot interrupt Deno pending TCP connections |
| Give Competitors more sources | More sources = slower Google Search = worse timing |

---

## 8. Success Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Pipeline success rate | 13% (2/15) | >90% |
| Composer completion rate | 13% (2/15) | >95% |
| Competitors completion rate | 67% (10/15) | >90% |
| End-to-end time | N/A (fails) | <60s total |
| Zombie sessions | 7 stuck | 0 |

---

*Generated by Claude Code diagnostic analysis | 2026-02-08*
