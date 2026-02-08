# Forensic Audit Report — Validator Pipeline

> **Date:** 2026-02-05 | **Auditor:** Claude Code
> **Scope:** Full-stack validator pipeline (Edge Functions + Frontend + Database)
> **Trigger:** ResearchAgent JSON parse failure on session `47ab5e74-2b70-4932-b734-49c1eee79b29`

---

## Executive Summary

| Severity | Count | Status |
|----------|:-----:|--------|
| CRITICAL | 8 | All unresolved |
| HIGH | 5 | All unresolved |
| MEDIUM | 10 | All unresolved |
| LOW | 5 | All unresolved |
| **Total** | **28** | **0 resolved** |

**Verdict:** Pipeline is **NOT production-ready**. The root cause of the observed failure (ResearchAgent crash) is unsafe JSON parsing compounded by missing `responseJsonSchema` and incorrect temperature settings for Gemini 3 models. Additional issues include stuck sessions, no timeout protection, and a non-functional retry button.

---

## Current Pipeline State (Session `47ab5e74...`)

| Agent | Status | Issue |
|-------|--------|-------|
| ExtractorAgent | completed | OK |
| ResearchAgent | **failed** | `Unexpected non-whitespace character after JSON at position 1568 (line 30 column 2)` |
| CompetitorAgent | completed | OK |
| ScoringAgent | completed | OK |
| MVPAgent | completed | OK |
| ComposerAgent | **running** (stuck) | Never completed - edge function timed out |
| VerifierAgent | pending | Never started |
| **Session** | **running** (stuck) | Never updated to failed/partial |

---

## CRITICAL Issues (P0 - Fix Immediately)

### C1: Unsafe JSON.parse on All 7 Agents

**File:** `supabase/functions/validator-start/index.ts`
**Lines:** 497, 540, 604, 676, 744, 806 (every agent output parse)
**Root cause of observed failure.**

```
// Current (crashes on any non-JSON trailing content)
const result = JSON.parse(text);

// Gemini with googleSearch grounding returns JSON + trailing metadata
// e.g., valid JSON followed by "\n\nSources: [1] https://..."
```

**Impact:** Any agent can crash the entire pipeline if Gemini returns JSON with trailing characters. This is especially common when `tools: [{ googleSearch: {} }]` is enabled (Research and Competitor agents).

**Evidence:** Session `47ab5e74` — ResearchAgent crashed at line 540 with `Unexpected non-whitespace character after JSON at position 1568`.

**Fix:** Use safe JSON extraction with regex fallback. The pattern already exists in the codebase at `supabase/functions/lean-canvas-agent/ai-utils.ts` line 146 (`extractJSON<T>()`):

```typescript
function extractJSON<T>(text: string): T {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
    throw new Error('No valid JSON found in response');
  }
}
```

---

### C2: Research and Competitor Agents Run Sequentially

**File:** `supabase/functions/validator-start/index.ts`
**Lines:** 237-255

```
// Current: sequential (~38s wasted)
const research = await runResearch(profile);
updateRun('research', 'completed', research);
const competitors = await runCompetitor(profile);
updateRun('competitor', 'completed', competitors);

// Should be: parallel (~19s saved)
const [research, competitors] = await Promise.all([
  runResearch(profile),
  runCompetitor(profile),
]);
```

**Impact:** Wastes ~19 seconds of the 150-second edge function timeout budget. With 7 agents at ~15-20s each, the pipeline is dangerously close to the timeout limit.

---

### C3: No Timeout on Gemini API Calls

**File:** `supabase/functions/validator-start/index.ts`
**Function:** `callGemini()` (line 330)

The `fetch()` call to Gemini has no `AbortController` timeout. If Gemini hangs (which happens with large prompts or high load), the call blocks until the edge function's 150-second hard limit kills it.

**Evidence:** ComposerAgent stuck at "running" — likely hung on a Gemini call that never completed.

**Fix:** Add AbortController with 30-second timeout per agent call:

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30_000);
const response = await fetch(url, { ...options, signal: controller.signal });
clearTimeout(timeout);
```

---

### C4: Session Never Updates After Edge Function Timeout

**File:** `supabase/functions/validator-start/index.ts`
**Lines:** 291-323

The session status update to `complete` or `failed` is at the end of `runPipeline()`. If the edge function is killed at the 150-second limit, this code never executes. The session remains permanently stuck in `running`.

**Evidence:** Session `47ab5e74` has status `running` with ComposerAgent also stuck at `running`.

**Impact:** The founder sees a forever-spinning progress page with no way to recover.

**Fix options:**
1. **Defensive:** Update session status to `partial` inside each agent's catch block
2. **Cleanup job:** Scheduled function that marks stale sessions (>5 min old, still `running`) as `failed`
3. **Frontend:** Add max polling duration (3 minutes) with auto-failure UI

---

### C5: `run_id` Foreign Key Violation Risk

**File:** `supabase/functions/validator-start/index.ts`
**Line:** 298

```typescript
run_id: startup_id || sessionId
```

The `run_id` field uses `startup_id` (from the request body) as a fallback, which may not correspond to a valid `validator_runs.id`. If `startup_id` is an arbitrary string or a different table's ID, the INSERT will silently fail or violate FK constraints.

---

## HIGH Issues (P1 - Fix This Week)

### H1: Progress Page Doesn't Stop Polling for "partial"

**File:** `src/pages/ValidatorProgress.tsx`, line 114

```typescript
if (status === 'complete' || status === 'failed') {
  clearInterval(interval);
}
// Missing: 'partial' — polling continues forever
```

**Fix:** Add `'partial'` to the stop condition.

---

### H2: No Auto-Navigate for Partial or Unverified Reports

**File:** `src/pages/ValidatorProgress.tsx`, line 131

Auto-navigation only triggers for `complete && verified`. If the pipeline completes with `partial` status or the VerifierAgent fails, the founder is stuck on the progress page.

**Fix:** Navigate to report for any terminal state (`complete`, `partial`, `failed`) with appropriate messaging.

---

### H3: Retry Button Restarts Polling, Not Pipeline

**File:** `src/pages/ValidatorProgress.tsx`, lines 358-361

The "Retry" button calls `startPolling()` which just restarts the status polling interval. It does NOT call `validator-start` again. The founder clicks "Retry" and sees the same failed state.

**Fix:** Retry button should call `validator-start` with a `retry: true` flag, or at minimum offer a "Start New Validation" link.

---

### H4: No Maximum Polling Duration

**File:** `src/pages/ValidatorProgress.tsx`

If the session is stuck (C4), polling continues every 2 seconds indefinitely. No timeout, no circuit breaker.

**Fix:** Stop polling after 3 minutes and show a timeout message with recovery options.

---

### H5: No Loading State on Initial Progress Page Render

**File:** `src/pages/ValidatorProgress.tsx`

On first render, the page shows empty agent cards before the first poll response arrives. Brief but visible flash of incomplete state.

**Fix:** Show skeleton/spinner until first successful poll response.

---

## MEDIUM Issues (P2 - Fix Before Launch)

### M1: `failedSteps` Computed but Never Used

**File:** `supabase/functions/validator-status/index.ts`, line 111

```typescript
const failedSteps = runs.filter(r => r.status === 'failed').length;
// Never included in the response body
```

The frontend has no way to know which agents failed without parsing individual run records.

---

### M2: Progress Calculation Ignores Failed Steps

**File:** `supabase/functions/validator-status/index.ts`, line 112

```typescript
const progress = Math.round((completedSteps / total) * 100);
```

A session with 5 completed and 2 failed agents shows 71% progress, not 100%. The progress bar never reaches 100% for partial completions.

---

### M3: Type Import Mismatch

**File:** `src/pages/ValidateIdea.tsx`

Imports `ValidationReport` type but the actual pipeline output structure doesn't match the frontend type definition. The `validation-report.ts` types define 14 sections, but the edge function only produces 8 report fields.

---

### M4: No CORS Preflight Handling

**File:** `supabase/functions/validator-start/index.ts`

No explicit `OPTIONS` handler for CORS preflight requests. While Supabase handles basic CORS, custom headers may cause preflight failures on some browsers.

---

### M5: Prompt Injection via User Messages

**File:** `supabase/functions/validator-start/index.ts`

User messages are concatenated directly into the Gemini prompt without sanitization:

```typescript
const userInput = messages.map(m => m.content).join('\n');
// This goes directly into: `Analyze this startup idea: ${userInput}`
```

A malicious user could inject prompt instructions. While the impact is limited (they'd be manipulating their own report), it could cause unexpected agent behavior or JSON parse failures.

---

### M6: `extractedData` Built But Never Sent

**File:** `src/components/validator/chat/ValidatorChat.tsx`, lines 127-131

The chat component builds an `extractedData` object from user responses but the `handleGenerate` function at line 155 concatenates raw message strings instead of sending the structured extraction. The ExtractorAgent re-extracts data that the frontend already has.

---

### M7: Report Structure Mismatch (14 Types vs 7 Rendered)

**File:** `src/types/validation-report.ts` defines 14 report section types.
**File:** `src/pages/ValidatorReport.tsx` renders 7 sections.
**File:** `supabase/functions/validator-start/index.ts` produces 8 fields.

The three layers disagree on report structure. This causes missing sections and potential undefined errors.

---

### M8: `handleGenerate` Uses Nested setTimeout with Race Condition

**File:** `src/components/validator/chat/ValidatorChat.tsx`, lines 155-177

```typescript
const handleGenerate = async () => {
  setIsGenerating(true);
  setTimeout(async () => {
    // ... async work inside setTimeout
    setTimeout(() => {
      navigate(`/validator/run/${session_id}`);
    }, 500);
  }, 1500);
};
```

Two nested `setTimeout` wrapping async work. If the user navigates away during the 1.5-second delay, state updates fire on an unmounted component. The inner 500ms delay before navigation is arbitrary and may not be enough for the edge function to start.

---

## LOW Issues (P3 - Nice to Have)

### L1: No Rate Limiting on Pipeline Start

A user could trigger multiple simultaneous validations by rapid-clicking the Generate button. No debounce or server-side rate limit.

---

### L2: Console Errors from Supabase Auth Refresh

Multiple `ERR_INTERNET_DISCONNECTED` and `ERR_CONNECTION_CLOSED` errors from Supabase GoTrue token refresh. While these are network issues (not code bugs), there's no graceful error handling or retry UI.

---

### L3: React Router v7 Future Flag Warnings

Console shows warnings about deprecated patterns. Not breaking now, but will break on upgrade.

---

### L4: No Structured Logging in Edge Functions

Agent outputs and errors are logged with `console.log`/`console.error` without structured format. Difficult to query in Supabase logs dashboard.

---

## Root Cause Analysis — The Failure Chain

```
1. User submits idea via ValidatorChat
   ↓
2. handleGenerate concatenates messages (M6: structured data discarded)
   ↓
3. validator-start edge function invoked
   ↓
4. ExtractorAgent succeeds (JSON output clean)
   ↓
5. ResearchAgent calls Gemini with googleSearch grounding
   ↓
6. Gemini returns JSON + trailing search metadata
   ↓
7. JSON.parse(text) crashes (C1: no safe extraction)
   ↓
8. ResearchAgent marked "failed", pipeline continues
   ↓
9. ScoringAgent, MVPAgent complete
   ↓
10. ComposerAgent calls Gemini with large prompt (~4K tokens)
    ↓
11. Gemini hangs or returns slowly
    ↓
12. Edge function hits 150s timeout (C3: no per-call timeout)
    ↓
13. Edge function killed — session status never updated (C4)
    ↓
14. Frontend polls forever (H4: no max polling)
    ↓
15. Founder clicks "Retry" — restarts polling, not pipeline (H3)
    ↓
16. Session permanently stuck at "running"
```

---

## Recommended Fix Priority

### Immediate (Today)

| # | Fix | Files | Impact |
|---|-----|-------|--------|
| G1 | Add `responseJsonSchema` to all agents | `validator-start/index.ts` | **Guarantees** valid JSON output per Gemini docs |
| G2 | Set temperature to 1.0 for Gemini 3 | `validator-start/index.ts` | Prevents looping/degradation (docs warn against <1.0) |
| C1 | Safe JSON extraction as fallback | `validator-start/index.ts` | Defensive catch for any remaining edge cases |
| C3 | 30-second AbortController timeout | `validator-start/index.ts` | Prevents hung agents |
| C4 | Update session status in catch blocks | `validator-start/index.ts` | Prevents stuck sessions |
| H1 | Add `'partial'` to polling stop condition | `ValidatorProgress.tsx` | Stops infinite polling |

### This Week

| # | Fix | Files | Impact |
|---|-----|-------|--------|
| G3 | Combine schema + search on Research/Competitor | `validator-start/index.ts` | Structured JSON even with Google Search grounding |
| G4 | Move API key from query string to header | `validator-start/index.ts` | Security: stops key exposure in logs |
| C2 | Parallelize Research + Competitor | `validator-start/index.ts` | Saves ~19s, reduces timeout risk |
| H3 | Wire retry to actually restart pipeline | `ValidatorProgress.tsx` | Gives founders a recovery path |
| H4 | Max 3-minute polling with timeout UI | `ValidatorProgress.tsx` | Prevents infinite polling |
| M6 | Send extractedData to pipeline | `ValidatorChat.tsx`, `validator-start/index.ts` | Better extraction quality |

### Before Launch

| # | Fix | Files | Impact |
|---|-----|-------|--------|
| G5 | Extract grounding citations from search results | `validator-start/index.ts` | Clickable source URLs in reports |
| C5 | Validate run_id FK before INSERT | `validator-start/index.ts` | Prevents data integrity issues |
| H2 | Auto-navigate for partial/failed | `ValidatorProgress.tsx` | Better UX for error cases |
| M2 | Include failed steps in progress calc | `validator-status/index.ts` | Accurate progress display |
| M5 | Sanitize user input in prompts | `validator-start/index.ts` | Prevent prompt injection |
| M7 | Align report types across all layers | Types + frontend + edge function | Prevent undefined errors |
| M8 | Replace setTimeout with proper async flow | `ValidatorChat.tsx` | Prevent race conditions |

---

## Gemini API: Implementation vs Official Docs

> **Source:** `/home/sk/startupai16L/knowledge/gemeni/docs-gemeni/` (19 official doc files)
> **Compared against:** `supabase/functions/validator-start/index.ts`, `callGemini()` lines 330-394

### G1 (CRITICAL): Missing `responseJsonSchema` — Likely Root Cause of All JSON Failures

**File:** `validator-start/index.ts`, line 343-346

**Implementation:**
```
generationConfig: {
  temperature: 0.4,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
}
```

**Docs say (structured-output.md):** Use BOTH `responseMimeType` AND `responseJsonSchema` together. The docs state: "This ensures predictable, type-safe results" and "structured output guarantees syntactically correct JSON."

**Impact:** Using `responseMimeType` alone just *asks* the model to try outputting JSON. Adding `responseJsonSchema` **guarantees** syntactically valid JSON matching the schema. This single fix would likely eliminate most C1 JSON parse crashes.

**Fix:** Define a JSON schema for each agent's expected output shape and pass it as `responseJsonSchema` in `generationConfig`.

---

### G2 (CRITICAL): Temperature 0.4 — Explicitly Warned Against for Gemini 3

**File:** `validator-start/index.ts`, line 344

**Implementation:** `temperature: 0.4`

**Docs say (text-generation.md + troubleshooting.md):** "When using Gemini 3 models, we strongly recommend keeping the temperature at its default value of 1.0. Changing the temperature (setting it below 1.0) may lead to unexpected behavior, such as looping or degraded performance, particularly in complex mathematical or reasoning tasks."

**Impact:** The pipeline uses `gemini-3-flash-preview` and `gemini-3-pro-preview`. Setting temperature to 0.4 on these models goes directly against official guidance and may cause looping, repetitive output, or degraded JSON compliance.

**Fix:** Change `temperature` to `1.0` for all Gemini 3 model calls.

---

### G3 (CRITICAL): Structured Output + Google Search — Supported but Not Combined

**File:** `validator-start/index.ts`, lines 346 and 357

**Implementation:** Uses `responseMimeType: 'application/json'` and `tools: [{ googleSearch: {} }]` separately — but does NOT add `responseJsonSchema` when search is enabled.

**Docs say (structured-output.md):** "Gemini 3 lets you combine Structured Outputs with built-in tools, including Grounding with Google Search, URL Context, Code Execution, and File Search." Full REST example shows all three together:
```
"tools": [{"googleSearch": {}}],
"generationConfig": {
    "responseMimeType": "application/json",
    "responseJsonSchema": { ... }
}
```

**Impact:** This directly solves the ResearchAgent crash. By adding `responseJsonSchema` alongside `googleSearch`, Gemini 3 returns valid JSON **even with search grounding**. The trailing metadata that caused the parse error at position 1568 would not appear in structured output.

**Fix:** Add `responseJsonSchema` to all agent calls, including those with `googleSearch` enabled.

---

### G4 (MEDIUM): API Key Passed in Query String Instead of Header

**File:** `validator-start/index.ts`, line 360

**Implementation:**
```
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
```

**Docs say (every REST example across all doc files):**
```
-H "x-goog-api-key: $GEMINI_API_KEY"
```

**Impact:** The query parameter approach exposes the API key in server access logs, URL encoding, and referrer headers. The docs security section warns: "Never expose API keys on the client-side." While this is server-side (edge function), the header approach is consistently documented and more secure.

**Fix:** Move API key from URL query parameter to `x-goog-api-key` request header:
```
headers: {
  'Content-Type': 'application/json',
  'x-goog-api-key': GEMINI_API_KEY,
}
```

---

### G5 (MEDIUM): Grounding Citations Available but Discarded

**File:** `validator-start/index.ts`, line 380

**Implementation:**
```
const searchGrounding = data.candidates?.[0]?.groundingMetadata?.webSearchQueries?.length > 0;
```

Only checks if search queries exist. Discards the actual citation data.

**Docs say (google-search.md):** The response includes rich citation data:
- `groundingChunks` — source URLs and titles for each citation
- `groundingSupports` — maps text segments to specific sources (for inline citations)
- `searchEntryPoint` — rendered search widget HTML

**Impact:** Research and Competitor agents perform Google Search but throw away the source URLs. The `validator_runs.citations` column exists but receives no data from grounding. The report could show clickable source citations but doesn't.

**Fix:** Extract `groundingChunks` from the response and save as citations:
```
const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
const citations = chunks.map(c => ({ url: c.web?.uri, title: c.web?.title }));
```

---

### G6 (LOW): `google_search` Casing in REST Body

**File:** `validator-start/index.ts`, line 357

**Implementation:** `body.tools = [{ googleSearch: {} }]` (camelCase)

**Docs:** Inconsistent — `google-search.md` REST shows `"google_search": {}` (snake_case), but `structured-output.md` REST shows `{"googleSearch": {}}` (camelCase). The Gemini API accepts both via protobuf deserialization.

**Impact:** None — both formats work.

---

### Gemini Docs Comparison Summary

| # | Finding | Severity | Current | Docs Recommend |
|---|---------|----------|---------|----------------|
| G1 | Missing `responseJsonSchema` | **CRITICAL** | `responseMimeType` only | Add schema for guaranteed valid JSON |
| G2 | Temperature 0.4 on Gemini 3 | **CRITICAL** | `0.4` | `1.0` (default, strongly recommended) |
| G3 | Schema + Search not combined | **CRITICAL** | Separate usage | Combine all three for Research/Competitor agents |
| G4 | API key in query string | **MEDIUM** | `?key=` param | `x-goog-api-key` header |
| G5 | Grounding citations discarded | **MEDIUM** | Only checks existence | Extract `groundingChunks` for report citations |
| G6 | Tool name casing | **LOW** | camelCase | Both work (docs inconsistent) |

### Revised Root Cause Analysis

The original audit identified C1 (unsafe `JSON.parse`) as the root cause. The Gemini docs comparison reveals the **deeper root cause**: the implementation does not use `responseJsonSchema`, which would guarantee valid JSON output. Combined with temperature 0.4 (warned against for Gemini 3), the model produces unreliable JSON that then crashes the raw parser.

**Fix chain:**
1. Add `responseJsonSchema` per agent (G1) — eliminates malformed JSON at the source
2. Set temperature to 1.0 (G2) — prevents looping/degradation
3. Keep safe JSON extraction (C1) — defensive fallback for edge cases
4. Move API key to header (G4) — security hardening

---

## What's Working Well

| Component | Status | Notes |
|-----------|--------|-------|
| Authentication | OK | Supabase OAuth + JWT verification in edge functions |
| RLS policies | OK | 4 policies on sessions, 2 on runs, 3 on reports |
| Agent retry logic | OK | `callGemini()` has exponential backoff for 429/500/502/503/504 |
| Progress UI design | OK | Agent cards with status badges, expand/collapse |
| Report rendering | OK | 3-panel layout (Report + Coach + Trace) |
| Type definitions | OK | Comprehensive types in `validation-report.ts` |
| Error boundaries | Partial | Some agents have try/catch, but error handling is inconsistent |

---

## Database Schema Health

| Table | RLS | Policies | Issue |
|-------|:---:|:--------:|-------|
| `validator_sessions` | ON | 4 (CRUD) | OK - user can only access own sessions |
| `validator_runs` | ON | 2 (SELECT, INSERT) | Missing UPDATE policy for service_role — edge function may fail to update run status |
| `validation_reports` | ON | 3 (2 SELECT + 1 service_role ALL) | OK |

**Database finding:** `validator_runs` has no UPDATE policy for `service_role`. The edge function uses the service role key to update run status (`completed`, `failed`). If RLS is enforced on service_role calls (depends on Supabase config), status updates will silently fail.

**Verify with:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'validator_runs' AND cmd = 'UPDATE';
```

---

## Files Audited

| File | Lines | Role |
|------|------:|------|
| `supabase/functions/validator-start/index.ts` | 897 | Pipeline orchestration + 7 agents |
| `supabase/functions/validator-status/index.ts` | 156 | Status polling endpoint |
| `src/hooks/useValidatorPipeline.ts` | 109 | Frontend pipeline trigger hook |
| `src/pages/ValidateIdea.tsx` | 129 | Chat entry page |
| `src/pages/ValidatorProgress.tsx` | 368 | Progress tracking page |
| `src/pages/ValidatorReport.tsx` | 494 | Report display page |
| `src/components/validator/chat/ValidatorChat.tsx` | 251 | Chat component |
| `src/types/validation-report.ts` | 171 | Type definitions |
| **Total code** | **2,575** | **8 files** |

### Gemini Docs Compared

| Doc File | Key Content |
|----------|-------------|
| `structured-output.md` | `responseJsonSchema` usage, structured output + tools combination |
| `google-search.md` | Google Search grounding, `groundingMetadata` response structure, citations |
| `text-generation.md` | System instructions, temperature warning for Gemini 3 (keep at 1.0) |
| `troubleshooting.md` | Error codes, temperature warning, retry guidance |
| `api-key.md` | `x-goog-api-key` header (not query param), security best practices |
| `quickstart.md` | REST API endpoint format, auth pattern |

---

## Conclusion

The validator pipeline has a solid architectural foundation (7-agent design, Supabase RLS, typed report structure) but suffers from **fragile error handling** and **incorrect Gemini API usage** that cause cascading failures. The observed crash (ResearchAgent JSON parse) traces to a deeper root cause: missing `responseJsonSchema` and non-recommended temperature settings for Gemini 3 models.

**Priority 1:** Add `responseJsonSchema` to all agents (G1) + set temperature to 1.0 (G2) — eliminates malformed JSON at the source per official Gemini docs.
**Priority 2:** Add safe JSON extraction (C1) as defensive fallback — handles edge cases the schema can't prevent.
**Priority 3:** Fix C3 + C4 (timeouts + session cleanup) to prevent stuck sessions.
**Priority 4:** Fix H3 (retry button) to give founders a recovery path when things go wrong.
**Priority 5:** Move API key to header (G4) + extract grounding citations (G5) — security and data quality.

With priorities 1-3, the pipeline moves from "breaks frequently, stuck forever" to "reliable output, graceful recovery."
