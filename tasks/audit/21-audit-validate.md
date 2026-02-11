# 21 — Validator Pipeline Audit: Chat-to-Report Flow

> **Date:** 2026-02-11 | **Session:** `6aaf2ed7-e3da-4c6e-ba4d-d884969005bf`
> **Status:** PARTIAL — ExtractorAgent + ComposerAgent failed
> **Error:** `Gemini API hard timeout after 30000ms`

---

## 1. Complete Flow — Current State

```
USER CHAT (/validate)
  |
  +-- ValidatorChat.tsx — collects messages via AI interview
  |     useValidatorFollowup -> validator-followup edge fn (Gemini Flash, 25s)
  |       Returns: coverage(8 topics), extracted(8 fields), confidence, discoveredEntities
  |
  +-- Readiness check: canGenerate = true when:
  |     Quick: 3+ msgs, 6+ shallow, 3+ deep, min bar
  |     Normal: 5+ msgs, 5+ shallow, 2+ deep, min bar
  |     Forced: 10+ msgs (MAX_EXCHANGES)
  |     OR: 1 msg with 400+ chars
  |
  v  User clicks "Generate"
PIPELINE TRIGGER
  |
  +-- handleGenerate() — ValidatorChat.tsx:334-370
  |     Joins all USER messages with \n\n -> ideaDescription
  |     Builds interviewContext payload (coverage, extracted, confidence, entities)
  |
  +-- useValidatorPipeline.startValidation() — L34-129
  |     refreshSession() -> fresh JWT
  |     supabase.functions.invoke('validator-start', {
  |       headers: { Authorization: Bearer <fresh_token> },
  |       body: { input_text, startup_id, interview_context }
  |     })
  |
  v  navigate(/validator/run/:sessionId)
EDGE FUNCTION: validator-start/index.ts (v44)
  |
  +-- Auth: supabaseUser.auth.getUser() -> 401 if invalid
  +-- Rate limit: 5 reqs / 5 min (heavy tier)
  +-- Sanitize: strip HTML, 10-5000 chars
  +-- INSERT validator_sessions (status: 'running')
  +-- INSERT 7 validator_runs (status: 'queued')
  +-- EdgeRuntime.waitUntil(runPipeline(...))
  +-- Return 200 { session_id, status: 'running' }  <-- ~1s response
  |
  v  Background execution
PIPELINE: pipeline.ts
  |
  +-- Deadline: 300s (PIPELINE_TIMEOUT_MS)
  |
  +-- 1. ExtractorAgent (30s timeout)  <-- FAILS HERE
  |     callGemini(gemini-3-flash-preview, systemPrompt, inputText,
  |       { responseJsonSchema, timeoutMs: 30000 })
  |
  +-- 2. if (profile) -> Competitors (bg promise, 45s)
  |     Research (critical path, 40s)
  |
  +-- 3. ScoringAgent (15s, thinking: high)
  +-- 4. MVPAgent (30s)
  +-- 5. Competitors grace period (5s max)
  +-- 6. ComposerAgent (dynamic budget, 90s cap)  <-- SKIPPED (no profile)
  +-- 7. VerifierAgent (5s, JS-only)
  |
  +-- INSERT validator_reports
  +-- UPDATE validator_sessions (final status)
  |
  v
FRONTEND POLLING: ValidatorProgress.tsx
  |
  +-- Polls validator-status every 2s
  +-- Frontend timeout: 180s (MAX_POLL_MS)
  +-- Shows 7 agent progress cards
  |
  v  When terminal status reached
REPORT: /validator/report/:reportId
  +-- 14-section report with score, verification, trace drawer
```

---

## 2. Session Forensics — DB Evidence

### Session 6aaf2ed7 (latest failure)

| Field | Value |
|-------|-------|
| Status | `partial` |
| Failed Steps | `["ExtractorAgent", "ComposerAgent"]` |
| Duration | 31.7s (created -> updated) |
| Input | "ipix - AI-powered content creation platform..." |
| Deployed version | v44 |

### Agent Run Detail (validator_runs)

| Agent | Status | Error | Duration |
|-------|--------|-------|----------|
| ExtractorAgent | **failed** | `Gemini API hard timeout after 30000ms` | 30,304ms |
| ResearchAgent | queued | - | - |
| CompetitorAgent | queued | - | - |
| ScoringAgent | queued | - | - |
| MVPAgent | queued | - | - |
| ComposerAgent | queued | - | - |
| VerifierAgent | ok | - | 267ms |

### Previous attempt — Session 4aec1635

| Agent | Status | Error | Duration |
|-------|--------|-------|----------|
| ExtractorAgent | **failed** | `Gemini API hard timeout after 10000ms` | 10,557ms |
| All others | queued | - | - |
| VerifierAgent | ok | - | 276ms |

**Key finding:** v43 had 10s timeout, v44 increased to 30s — still not enough.

### Healthy sessions for comparison

| Session | Input | Status | Duration | Failed |
|---------|-------|--------|----------|--------|
| 97dfd52c | Freelance designers | complete | 1m26s | none |
| 457e43b1 | AI Travel | complete | 1m20s | none |
| 272389db | AI Marketplace | complete | 1m20s | none |
| d2a53c8c | AI Content Marketing | partial | 1m8s | ComposerAgent |

---

## 3. Root Cause Analysis

### B1: ExtractorAgent Hard Timeout (CRITICAL)

**What happens:**
1. `callGemini()` in `_shared/gemini.ts:115-122` runs `Promise.race`:
   - `doFetch()` — actual Gemini API call (fetch + response.json())
   - `setTimeout(reject, timeoutMs)` — hard timeout
2. The timeout (30s) fires before Gemini returns
3. Error thrown: `"Gemini API hard timeout after 30000ms"`
4. Error caught in `extractor.ts:83` -> `completeRun(status: 'failed')`
5. `profile` remains `null`

**Why Gemini is slow on this input:**
- "ipix" input is rich content (brand photoshoots, video planning, style guides, market trends)
- With interview context (002-EFN), the system prompt is ~2KB+ (context blocks + discovery blocks)
- `responseJsonSchema` adds processing overhead (Gemini validates against schema)
- Cold start on Deno Deploy: 5-10s, cold start on Gemini: 5-15s
- Gemini streams body slowly: headers arrive fast, but `response.json()` blocks for 30-60s
- Confirmed pattern: same input failed twice (10s timeout on v43, 30s timeout on v44)

**Why hard timeout throws instead of retrying:**
- `gemini.ts:127-129`: hard timeout error is detected and re-thrown immediately
- It does NOT fall into the retry loop — retries only happen for HTTP 429/500/502/503/504
- So `maxRetries: 2` (default) is useless for timeouts

### B2: ComposerAgent Cascade (NOT a real Composer bug)

**What happens:**
1. ExtractorAgent fails -> `profile = null`
2. Pipeline skips: Research (needs profile), Competitors (needs profile), Scoring (needs profile), MVP (needs profile+scoring)
3. `pipeline.ts:188`: `if (profile)` -> false -> `failedAgents.push('ComposerAgent')`
4. Composer never actually runs — status stays `queued` in `validator_runs`
5. But `failed_steps` on the session says `["ExtractorAgent", "ComposerAgent"]`

**This is misleading** — the UI shows ComposerAgent as "failed" when it was really "skipped".

### B3: Frontend Polling Timeout Mismatch

- Frontend: 180s (MAX_POLL_MS in ValidatorProgress.tsx)
- Pipeline: 300s deadline
- If pipeline takes 200s, frontend has already given up and shows "timed out"
- Message: `"Pipeline timed out after 3 minutes."`

---

## 4. Blocker Checklist

### Critical (P0)

- [x] **B1: ExtractorAgent 30s timeout too short** — Gemini API exceeds 30s for complex inputs
  - File: `supabase/functions/validator-start/config.ts:29`
  - Fix: `extractor: 30_000` -> `extractor: 60_000` (60s)
  - **VERIFIED**: v45 deployed, "ipix" input completed ExtractorAgent in 42.6s

- [x] **B1b: Hard timeout skips retry logic** — `callGemini` throws immediately on timeout
  - File: `supabase/functions/_shared/gemini.ts:127-139`
  - Fix: Timeout errors now caught inside retry loop with `continue` + exponential backoff
  - **VERIFIED**: v45 deployed with retry-on-timeout logic

### Important (P1)

- [ ] **B2: Cascade reporting misleading** — ComposerAgent shown as "failed" when never ran
  - File: `supabase/functions/validator-start/pipeline.ts:191`
  - Fix: Use distinct status `"skipped"` for agents that never ran due to upstream failure
  - Also update `completeRun()` in `db.ts` to write `"skipped"` to `validator_runs`

- [x] **B3: Frontend polling timeout < pipeline deadline**
  - File: `src/pages/ValidatorProgress.tsx` (MAX_POLL_MS)
  - Fix: `180_000` -> `360_000` (300s pipeline + 60s buffer)

- [x] **B4: Composer min budget too low**
  - File: `supabase/functions/validator-start/pipeline.ts:181`
  - Fix: `15_000` -> `45_000` (Composer needs ~30-50s typical)

### Nice-to-have (P2)

- [ ] **Timeout logging** — Add console.log at agent start showing configured timeout
  - Files: all agents in `supabase/functions/validator-start/agents/`
  - Log: `[AgentName] Starting with ${timeoutMs}ms timeout`

- [ ] **Version tracking** — Add `FUNCTION_VERSION` constant to index.ts
  - File: `supabase/functions/validator-start/index.ts`
  - Log: `[validator-start] Version ${VERSION} starting`

---

## 5. Timeout Inventory

| Component | File:Line | Value | Status |
|-----------|-----------|-------|--------|
| Pipeline deadline | pipeline.ts:34 | 300,000ms (5m) | OK |
| Extractor | config.ts:29 | 30,000ms | **TOO SHORT** -> 60s |
| Research | config.ts:30 | 40,000ms | OK |
| Competitors | config.ts:31 | 45,000ms | OK (background) |
| Scoring | config.ts:32 | 15,000ms | OK |
| MVP | config.ts:33 | 30,000ms | OK |
| Composer base | config.ts:34 | 40,000ms | Fallback only |
| Composer cap | pipeline.ts:179 | 90,000ms | OK |
| Composer min | pipeline.ts:181 | 15,000ms | **TOO LOW** -> 45s |
| Verifier | config.ts:35 | 5,000ms | OK (JS only) |
| Competitors grace | pipeline.ts:139 | 5,000ms | OK |
| Frontend poll | ValidatorProgress.tsx | 180,000ms | **TOO SHORT** -> 360s |
| Zombie cleanup | validator-status | 360,000ms | OK |
| Follow-up chat | validator-followup | 25,000ms | OK |
| Promise.race | gemini.ts:117-121 | = timeoutMs | Hard guarantee |

### Critical path budget (with fix: extractor -> 60s)

```
Extractor: 60s (worst)
Research:  40s (worst)
Scoring:   15s (worst)
MVP:       30s (worst)
Grace:      5s
Composer:  90s (cap)
Verifier:   5s
-----------
Total:    245s < 300s pipeline deadline OK
```

---

## 6. Correct Steps vs Current Flow

### Correct steps (expected)

1. User chats -> follow-up agent collects idea details (3-10 messages)
2. Readiness met -> user clicks "Generate"
3. Frontend assembles: user messages + interview context
4. Frontend calls `validator-start` with fresh JWT
5. Edge function creates session, queues 7 agent runs
6. Pipeline runs in background: Extractor -> Research+Competitors -> Scoring -> MVP -> Composer -> Verifier
7. Each agent calls Gemini, writes results to `validator_runs`
8. Final report written to `validator_reports`
9. Session updated to `complete`
10. Frontend polls, detects completion, navigates to report

### Current flow (broken on "ipix" input)

1. User chats about "ipix" -> coverage collected OK
2. User clicks "Generate" OK
3. Frontend assembles input_text + interview_context OK
4. `validator-start` v44 receives POST, creates session OK
5. Pipeline starts in background via `EdgeRuntime.waitUntil()` OK
6. **ExtractorAgent calls Gemini -> 30s hard timeout fires** FAIL
7. `profile = null` -> all downstream agents SKIPPED FAIL
8. Pipeline marks session as `partial` with failed_steps FAIL
9. Frontend shows "Failed agents: ExtractorAgent, ComposerAgent" FAIL
10. No report generated FAIL

### Fix sequence

1. Increase `extractor` timeout: 30s -> 60s in `config.ts`
2. Move hard timeout catch inside retry loop in `gemini.ts`
3. Increase frontend poll timeout: 180s -> 360s in `ValidatorProgress.tsx`
4. Increase Composer min budget: 15s -> 45s in `pipeline.ts`
5. Add "skipped" status for cascade failures
6. Redeploy: `supabase functions deploy validator-start --no-verify-jwt`
7. Test with "ipix" input to verify fix

---

## 7. Key Files

### Frontend

| File | Purpose |
|------|---------|
| `src/components/validator/chat/ValidatorChat.tsx` | Chat logic, handleGenerate(), readiness |
| `src/hooks/useValidatorPipeline.ts` | Pipeline invocation, JWT refresh |
| `src/hooks/useValidatorFollowup.ts` | AI chat follow-up |
| `src/pages/ValidatorProgress.tsx` | Polling UI, timeout, auto-navigate |
| `src/pages/ValidatorReport.tsx` | 14-section report display |
| `src/pages/ValidateIdea.tsx` | Page wrapper with side panels |

### Edge Functions

| File | Purpose |
|------|---------|
| `supabase/functions/validator-start/index.ts` | Entry point, auth, session creation |
| `supabase/functions/validator-start/pipeline.ts` | 7-agent orchestration |
| `supabase/functions/validator-start/config.ts` | Timeout + model config |
| `supabase/functions/validator-start/agents/extractor.ts` | Profile extraction |
| `supabase/functions/validator-start/agents/composer.ts` | Report composition |
| `supabase/functions/_shared/gemini.ts` | Gemini client, Promise.race timeout |
| `supabase/functions/validator-status/index.ts` | Polling endpoint, zombie cleanup |
| `supabase/functions/validator-followup/index.ts` | Chat AI follow-up |

### DB Tables

| Table | Role |
|-------|------|
| `validator_sessions` | Pipeline session lifecycle (status, failed_steps, error_message) |
| `validator_runs` | Per-agent status tracking (7 rows per session) |
| `validator_reports` | Final composed report (details JSONB) |

---

## 8. Deployment History

| Version | Date | Change | Effect |
|---------|------|--------|--------|
| v42 | 2026-02-11 | `verify_jwt=true` (accidental) | 401 on all requests |
| v43 | 2026-02-11 | `--no-verify-jwt`, extractor: 10s | Extractor times out |
| v44 | 2026-02-11 | extractor: 30s | Still times out on "ipix" |
| **v45** | 2026-02-11 | extractor: 60s, retry-on-timeout | **FIXED** — ipix completed 78/100 in 117s |

---

## 9. E2E Test Result (v45)

| Field | Value |
|-------|-------|
| Session | `d95fcfbf-5c88-4976-b1ce-e6f629f789fe` |
| Input | "ipix" (same input that failed on v43+v44) |
| Status | `complete` |
| Failed Steps | `[]` (none) |
| Duration | 117s (1m57s) |
| Score | 78/100 — GO |
| Report ID | `a6b23daa-0ded-4ab3-9bea-1c911415b312` |

### Agent Timings (v45)

| Agent | Status | Duration |
|-------|--------|----------|
| ExtractorAgent | ok | **42.6s** (was failing at 30s) |
| ResearchAgent | ok | 26.8s |
| CompetitorAgent | ok | 25.9s |
| ScoringAgent | ok | 14.9s |
| MVPAgent | ok | ~10s |
| ComposerAgent | ok | ~30s |
| VerifierAgent | ok | <1s |
