---
task_id: 104-INF
title: Agency Edge Function Wiring
phase: INFRASTRUCTURE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: [data/supabase-edge-functions, devops/edge-function-creator]
subagents: [supabase-expert, code-reviewer]
edge_function: validator-start, sprint-agent, investor-agent, pitch-deck-agent, lean-canvas-agent, ai-chat
schema_tables: []
depends_on: [100-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (backend wiring only) |
| **Features** | Fragment injection into 6 edge functions, chat mode routing, graceful degradation, deploy pipeline |
| **Edge Functions** | `validator-start` (scoring + composer), `sprint-agent`, `investor-agent`, `pitch-deck-agent`, `lean-canvas-agent` (canvas-coach mode), `ai-chat` (all 4 chat modes) |
| **Real-World** | "Developer deploys validator-start with the scoring fragment wired in. The next pipeline run produces reports with evidence-weighted scores and RICE-based priority actions — no other changes needed." |

## Description

**The situation:** The agency system has all runtime assets ready: 5 prompt fragments in `agency/prompts/` (validator-scoring, validator-composer, crm-investor, sprint-agent, pitch-deck) and 4 chat modes in `agency/chat-modes/` (practice-pitch, growth-strategy, deal-review, canvas-coach). The `agent-loader.ts` utility at `agency/lib/agent-loader.ts` provides `loadFragment()` and `loadChatMode()` functions that read these markdown files from disk with graceful fallback (empty string on failure). However, none of the 6 target edge functions actually import or use the loader. The fragments exist on disk but are never injected into any system prompt. The entire agency enhancement is inert.

**Why it matters:** Until the fragments are wired into edge functions, the agency investment produces zero user-facing value. The 5 prompt fragments contain evidence-weighted scoring, RICE-based priority actions, MEDDPICC deal frameworks, Challenger narrative structures, and specificity coaching — all sitting unused. The 4 chat modes define Practice Pitch, Growth Strategy, Deal Review, and Canvas Coach personas that cannot be selected. Every day this remains unwired is a day founders get the base-quality AI output instead of agency-enhanced output. The wiring is also the prerequisite for tasks 105 (Gemini integration), 106 (Claude SDK), and 108 (frontend wiring) — blocking the entire right side of the dependency graph.

**What already exists:**
- `agency/lib/agent-loader.ts` — `loadFragment(name)` and `loadChatMode(name)` with `FRAGMENTS` and `CHAT_MODES` const arrays, `FragmentName` and `ChatModeName` types
- `agency/prompts/validator-scoring-fragment.md` — Evidence tiers, RICE priority actions, bias detection
- `agency/prompts/validator-composer-fragment.md` — Narrative structure, specificity rules, dimension depth
- `agency/prompts/crm-investor-fragment.md` — MEDDPICC framework, deal scoring, objection handling
- `agency/prompts/sprint-agent-fragment.md` — RICE scoring, Kano classification, sprint sequencing
- `agency/prompts/pitch-deck-fragment.md` — Challenger narrative, persuasion scoring, slide quality
- `agency/chat-modes/practice-pitch.md` — VC practice pitch persona with objection bank
- `agency/chat-modes/growth-strategy.md` — AARRR funnel coaching persona
- `agency/chat-modes/deal-review.md` — Deal review coaching persona
- `agency/chat-modes/canvas-coach.md` — Lean canvas specificity coaching persona
- `supabase/functions/validator-start/agents/scoring.ts` — ScoringAgent with `systemPrompt` string literal (line ~24)
- `supabase/functions/validator-start/agents/composer.ts` — Composer with `TONE` const and 4 group prompts (Groups A-D + E)
- `supabase/functions/sprint-agent/index.ts` — Sprint agent with `SYSTEM_PROMPT` const (line ~38)
- `supabase/functions/investor-agent/prompt.ts` — 11 exported system prompt constants (DISCOVER_INVESTORS_SYSTEM, etc.)
- `supabase/functions/pitch-deck-agent/actions/generation.ts` — Deck generation with inline Gemini call
- `supabase/functions/lean-canvas-agent/actions/coach.ts` — Coach action with `callGeminiStructured` and RAG context
- `supabase/functions/ai-chat/index.ts` — Chat handler with `MODEL_CONFIG` and mode routing
- `supabase/functions/ai-chat/coach/index.ts` — Coach mode with `handleCoachMode` and persona builder

**The build:**
1. Wire `loadFragment('validator-scoring-fragment')` into `scoring.ts` — append after the existing domain knowledge section in the system prompt
2. Wire `loadFragment('validator-composer-fragment')` into `composer.ts` — append to the shared `TONE` const or inject per-group
3. Wire `loadFragment('sprint-agent-fragment')` into `sprint-agent/index.ts` — append after the existing `SYSTEM_PROMPT`
4. Wire `loadFragment('crm-investor-fragment')` into `investor-agent/prompt.ts` — create a shared enhancement function that appends the fragment to each of the 11 system prompts
5. Wire `loadFragment('pitch-deck-fragment')` into `pitch-deck-agent/actions/generation.ts` — append to the deck generation system prompt
6. Wire `loadChatMode('canvas-coach')` into `lean-canvas-agent/actions/coach.ts` — append after RAG context injection
7. Wire all 4 `loadChatMode()` calls into `ai-chat/index.ts` — add mode selector that loads the appropriate chat mode based on request `mode` field
8. Add `AGENCY_FRAGMENTS_ENABLED` env var check — default `true`, allows disabling fragments without redeploying
9. Each wiring point follows the same pattern: load fragment, check non-empty, append with `\n\n## Agency Enhancement\n` header
10. Deploy in dependency order with per-function smoke test

**Example:** Founder Priya runs the validator pipeline for her EdTech SaaS startup. Before this wiring, the scoring agent produces raw dimension scores with no evidence attribution. After wiring, `loadFragment('validator-scoring-fragment')` injects evidence tier weighting into the scoring prompt. The report now shows each dimension annotated with its evidence tier (High/Medium/Low), scores are discounted when based only on AI inference, and each dimension includes RICE-scored priority actions. The composer picks up these enriched scores and weaves them into a consulting-grade narrative. No frontend changes needed — the richer data flows through existing report rendering.

## Rationale

**Problem:** Agency prompt fragments and chat modes exist on disk but are not imported by any edge function. The agency enhancement is fully prepared but completely inert. Six edge functions continue to use their base system prompts without agency knowledge injection.

**Solution:** Wire `loadFragment()` and `loadChatMode()` from `agent-loader.ts` into each of the 6 target edge functions. Each function loads its designated fragment at the start of prompt construction and appends it after the existing system prompt. A feature flag env var allows disabling all fragments without redeployment. Deploy in dependency order with per-function verification.

**Impact:** All 6 edge functions immediately benefit from agency-enhanced prompts. Validator reports gain evidence tiers and RICE actions. Sprint tasks gain Kano classifications. Investor interactions gain MEDDPICC frameworks. Pitch decks gain Challenger narrative structure. Canvas coaching gains specificity meters. AI chat gains 4 selectable coaching modes.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get evidence-weighted validation scores | I know which scores are backed by data vs AI inference |
| Founder | see RICE-scored priority actions in my report | I focus on the highest-impact next steps first |
| Founder | have MEDDPICC-structured investor insights | I run a professional fundraising process |
| Founder | select coaching modes in AI chat | I get role-specific coaching (pitch practice, growth, deals, canvas) |
| Developer | disable fragments via env var | I can rollback agency enhancements without redeploying |
| DevOps | deploy functions one at a time in dependency order | I isolate failures to a single function domain |

## Goals

1. **Primary:** All 6 edge functions load and inject their designated agency fragments at runtime
2. **Resilience:** If any fragment fails to load, the edge function continues with its base prompt (zero regression)
3. **Controllability:** `AGENCY_FRAGMENTS_ENABLED` env var (default: `true`) disables all fragment injection when set to `false`
4. **Observability:** Each fragment injection is logged with fragment name and character count
5. **Performance:** Fragment loading adds less than 5ms to edge function cold start (cached after first load)

## Acceptance Criteria

- [ ] `validator-start/agents/scoring.ts` imports `loadFragment` and appends `validator-scoring-fragment` to its system prompt
- [ ] `validator-start/agents/composer.ts` imports `loadFragment` and appends `validator-composer-fragment` to the TONE or group prompts
- [ ] `sprint-agent/index.ts` imports `loadFragment` and appends `sprint-agent-fragment` to SYSTEM_PROMPT
- [ ] `investor-agent/prompt.ts` exports an `enhancePrompt()` function that appends `crm-investor-fragment` to any system prompt
- [ ] `pitch-deck-agent/actions/generation.ts` imports `loadFragment` and appends `pitch-deck-fragment` to the generation prompt
- [ ] `lean-canvas-agent/actions/coach.ts` imports `loadChatMode` and appends `canvas-coach` mode to the coaching system prompt
- [ ] `ai-chat/index.ts` imports `loadChatMode` and routes to the correct mode based on request `mode` field
- [ ] All 4 chat modes (practice-pitch, growth-strategy, deal-review, canvas-coach) are loadable via ai-chat
- [ ] `AGENCY_FRAGMENTS_ENABLED` env var check exists — when `false`, all `loadFragment`/`loadChatMode` calls return empty string
- [ ] Each injection point logs: `[agency] Loaded {name} ({N} chars)` or `[agency] Skipped {name} (disabled/missing)`
- [ ] Fragment load failure does not crash the edge function — graceful fallback to base prompt
- [ ] All 6 edge functions deploy successfully via CLI
- [ ] Validator pipeline E2E produces a report after wiring (smoke test)
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `npm run test` passes with no regressions

## Wiring Plan

### Research Before Implementation

Read these files to understand existing prompt structures before making changes:

- `agency/lib/agent-loader.ts` — loader API, types, constants
- `supabase/functions/validator-start/agents/scoring.ts` — where `systemPrompt` is defined (~line 24)
- `supabase/functions/validator-start/agents/composer.ts` — `TONE` const and group prompt construction
- `supabase/functions/sprint-agent/index.ts` — `SYSTEM_PROMPT` const (~line 38)
- `supabase/functions/investor-agent/prompt.ts` — 11 exported system prompt constants
- `supabase/functions/pitch-deck-agent/actions/generation.ts` — inline generation prompt
- `supabase/functions/lean-canvas-agent/actions/coach.ts` — coaching prompt construction
- `supabase/functions/ai-chat/index.ts` — mode routing and MODEL_CONFIG

### File Changes

| Layer | File | Action | Details |
|-------|------|--------|---------|
| **Shared utility** | `agency/lib/agent-loader.ts` | Modify | Add `isEnabled()` check for `AGENCY_FRAGMENTS_ENABLED` env var. Add logging to `loadFragment()` and `loadChatMode()`. |
| **Helper** | `agency/lib/inject-fragment.ts` | Create | Shared `injectFragment(basePrompt, fragmentContent)` — appends with `\n\n## Agency Enhancement\n` header. Returns base prompt unchanged if fragment is empty. |
| **EF 1a** | `supabase/functions/validator-start/agents/scoring.ts` | Modify | Import `loadFragment`. Call at top of `runScoring()`. Append result to `systemPrompt`. |
| **EF 1b** | `supabase/functions/validator-start/agents/composer.ts` | Modify | Import `loadFragment`. Call at top of `runComposer()`. Append result to the shared `TONE` variable passed to group prompts. |
| **EF 2** | `supabase/functions/sprint-agent/index.ts` | Modify | Import `loadFragment`. Load `sprint-agent-fragment` once at request start. Append to `SYSTEM_PROMPT` before Gemini call. |
| **EF 3** | `supabase/functions/investor-agent/prompt.ts` | Modify | Import `loadFragment`. Export `enhanceInvestorPrompt(basePrompt)` that appends `crm-investor-fragment`. |
| **EF 3** | `supabase/functions/investor-agent/index.ts` | Modify | Use `enhanceInvestorPrompt()` when constructing system prompts for each action's Gemini call. |
| **EF 4** | `supabase/functions/pitch-deck-agent/actions/generation.ts` | Modify | Import `loadFragment`. Load `pitch-deck-fragment` at start of `generateDeck()`. Append to the generation system prompt. |
| **EF 5** | `supabase/functions/lean-canvas-agent/actions/coach.ts` | Modify | Import `loadChatMode`. Load `canvas-coach` at start of coach action. Append after RAG context and before Gemini call. |
| **EF 6** | `supabase/functions/ai-chat/index.ts` | Modify | Import `loadChatMode`. Add `mode` field to `ChatRequest` type union for `'practice-pitch' \| 'growth-strategy' \| 'deal-review' \| 'canvas-coach'`. Route to loaded mode prompt when mode is specified. |
| **Test** | `agency/lib/agent-loader.test.ts` | Modify | Add tests for `isEnabled()` check, env var override, logging output verification. |
| **Test** | `agency/lib/inject-fragment.test.ts` | Create | Test `injectFragment()` — non-empty append, empty passthrough, header formatting. |

---

## Per-Function Wiring Specifications

### EF 1a: `validator-start/agents/scoring.ts` — Scoring Fragment

**Fragment:** `validator-scoring-fragment`
**Import:**
```typescript
import { loadFragment } from '../../../../agency/lib/agent-loader.ts'
```

**Injection point:** After the existing `systemPrompt` string literal (~line 24), before the `callGemini()` call.

**Code change (pseudo-diff):**
```typescript
// scoring.ts — inside runScoring()
const agentName = 'ScoringAgent';
await updateRunStatus(supabase, sessionId, agentName, 'running');

// --- Agency fragment injection ---
const scoringFragment = await loadFragment('validator-scoring-fragment')
const systemPrompt = `You are a sharp startup evaluator...
[existing domain knowledge sections]
${scoringFragment ? `\n\n## Agency Enhancement\n${scoringFragment}` : ''}`;
// --- End agency injection ---
```

**Where in prompt:** Appended after the existing "Domain Knowledge" sections (evidence requirements, unit economics check). The fragment adds evidence tier weighting, RICE priority actions, and bias detection — these build on the existing rubric anchors.

**Graceful degradation:** If `loadFragment` returns empty string (file missing or env var disabled), the template literal interpolation produces no extra content. The existing prompt is unchanged.

**Verification:** After deploy, run a validator pipeline. Check the report's `priority_actions` for RICE score fields. Check `scores_matrix` dimensions for `evidence_tier` annotations. If present, the fragment loaded successfully.

---

### EF 1b: `validator-start/agents/composer.ts` — Composer Fragment

**Fragment:** `validator-composer-fragment`
**Import:**
```typescript
import { loadFragment } from '../../../../agency/lib/agent-loader.ts'
```

**Injection point:** The `TONE` constant (line ~28) is shared across all 4+1 composer groups. Append the fragment to `TONE` before it is used in group prompts.

**Code change (pseudo-diff):**
```typescript
// composer.ts — module scope or inside runComposer()
const composerFragment = await loadFragment('validator-composer-fragment')

// Enhance the shared TONE with agency fragment
const enhancedTone = composerFragment
  ? `${TONE}\n\n## Agency Enhancement\n${composerFragment}`
  : TONE;

// Then use enhancedTone instead of TONE in group prompt construction
```

**Where in prompt:** Appended after the existing TONE instructions. The fragment adds narrative structure rules, specificity requirements, and dimension depth — these extend the "Be honest, not polite" base tone with consulting-grade composition rules.

**Graceful degradation:** If fragment is empty, `enhancedTone === TONE` — identical to current behavior.

**Verification:** Run a pipeline and check if the report narrative follows the fragment's structure (e.g., evidence citations, specificity in customer segments). Compare with a pre-wiring report for qualitative difference.

---

### EF 2: `sprint-agent/index.ts` — Sprint Agent Fragment

**Fragment:** `sprint-agent-fragment`
**Import:**
```typescript
import { loadFragment } from '../../../agency/lib/agent-loader.ts'
```

**Injection point:** The `SYSTEM_PROMPT` constant (line ~38) is defined at module scope. Since `loadFragment` is async, load the fragment inside the request handler and construct the enhanced prompt before the `callGemini()` call.

**Code change (pseudo-diff):**
```typescript
// Inside Deno.serve handler, before callGemini()
const sprintFragment = await loadFragment('sprint-agent-fragment')
const enhancedPrompt = sprintFragment
  ? `${SYSTEM_PROMPT}\n\n## Agency Enhancement\n${sprintFragment}`
  : SYSTEM_PROMPT;

const result = await callGemini(
  'gemini-3-flash-preview',
  enhancedPrompt,   // was: SYSTEM_PROMPT
  userPrompt,
  { responseJsonSchema: TASK_SCHEMA, timeoutMs: 30_000 }
);
```

**Where in prompt:** Appended after the existing sprint planning rules. The fragment adds RICE scoring for each task, Kano classification (Must-have/Performance/Delighter), and evidence-based sprint sequencing.

**Graceful degradation:** Empty fragment means `enhancedPrompt === SYSTEM_PROMPT`. Zero behavior change.

**Verification:** Generate sprint tasks and check for `rice_score` or `kano_class` fields in the task output. If present in the JSON response, the fragment was injected.

---

### EF 3: `investor-agent/prompt.ts` + `index.ts` — CRM Investor Fragment

**Fragment:** `crm-investor-fragment`
**Import (in prompt.ts):**
```typescript
import { loadFragment } from '../../../agency/lib/agent-loader.ts'
```

**Injection point:** The investor agent has 11 separate system prompt constants. Rather than modifying each constant, export a shared enhancement function.

**Code change (pseudo-diff) — prompt.ts:**
```typescript
// prompt.ts — new export
let _cachedFragment: string | null = null;

export async function enhanceInvestorPrompt(basePrompt: string): Promise<string> {
  if (_cachedFragment === null) {
    _cachedFragment = await loadFragment('crm-investor-fragment')
  }
  return _cachedFragment
    ? `${basePrompt}\n\n## Agency Enhancement\n${_cachedFragment}`
    : basePrompt;
}
```

**Code change (pseudo-diff) — index.ts:**
```typescript
// index.ts — in each action handler, before callGemini()
import { enhanceInvestorPrompt, DISCOVER_INVESTORS_SYSTEM, ... } from './prompt.ts'

// Example for discover_investors action:
const systemPrompt = await enhanceInvestorPrompt(DISCOVER_INVESTORS_SYSTEM);
const result = await callGemini('gemini-3-flash-preview', systemPrompt, userPrompt, opts);
```

**Where in prompt:** Appended after each action's base system prompt. The fragment adds MEDDPICC scoring framework, deal qualification criteria, and objection handling patterns — relevant to all 11 investor actions.

**Graceful degradation:** If fragment load fails, `enhanceInvestorPrompt` returns the base prompt unchanged. The per-request cache (`_cachedFragment`) avoids 11 disk reads per request.

**Verification:** Call the `score_deal` action and check if the response includes MEDDPICC-style fields (Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion). If present, the fragment loaded.

---

### EF 4: `pitch-deck-agent/actions/generation.ts` — Pitch Deck Fragment

**Fragment:** `pitch-deck-fragment`
**Import:**
```typescript
import { loadFragment } from '../../../../agency/lib/agent-loader.ts'
```

**Injection point:** Inside `generateDeck()`, before the Gemini call that generates slide content. The function constructs a generation prompt from wizard data — append the fragment after the generation instructions.

**Code change (pseudo-diff):**
```typescript
// generation.ts — inside generateDeck(), before callGemini()
const pitchFragment = await loadFragment('pitch-deck-fragment')

const generationPrompt = `You are a pitch deck expert...
[existing generation instructions]
${pitchFragment ? `\n\n## Agency Enhancement\n${pitchFragment}` : ''}`;
```

**Where in prompt:** Appended after the existing slide generation instructions. The fragment adds Challenger narrative structure (Teach, Tailor, Take Control), persuasion scoring per slide, and slide quality rubrics.

**Graceful degradation:** Empty fragment produces identical generation prompt to current behavior.

**Verification:** Generate a pitch deck and check if slides follow a Challenger narrative arc (Reframe → Teach → Differentiate → Close). Check speaker notes for persuasion score annotations.

---

### EF 5: `lean-canvas-agent/actions/coach.ts` — Canvas Coach Mode

**Chat mode:** `canvas-coach`
**Import:**
```typescript
import { loadChatMode } from '../../../../agency/lib/agent-loader.ts'
```

**Injection point:** Inside the coach action handler, after RAG context is assembled and before the Gemini call. The coaching prompt is constructed dynamically — append the chat mode after RAG citations.

**Code change (pseudo-diff):**
```typescript
// coach.ts — inside the coach action, after searchCoachingContext()
const canvasCoachMode = await loadChatMode('canvas-coach')

const systemPrompt = `You are a lean startup coach...
[existing coaching instructions]
${ragContext ? `\n\n## Knowledge Base\n${ragContext}` : ''}
${canvasCoachMode ? `\n\n## Coaching Enhancement\n${canvasCoachMode}` : ''}`;
```

**Where in prompt:** Appended after RAG knowledge base citations. The chat mode adds box quality checklist (specificity, evidence tier, measurability, uniqueness), coaching methodology (weakest box first), and replacement language examples.

**Graceful degradation:** Empty mode produces identical coaching prompt. RAG context continues to work independently.

**Verification:** Open the Lean Canvas coach and ask it to review a vague Problem box. If the response includes specificity scoring (e.g., "Your problem statement scores LOW on specificity") and replacement language suggestions, the mode loaded.

---

### EF 6: `ai-chat/index.ts` — All 4 Chat Modes

**Chat modes:** `practice-pitch`, `growth-strategy`, `deal-review`, `canvas-coach`
**Import:**
```typescript
import { loadChatMode, CHAT_MODES } from '../../../agency/lib/agent-loader.ts'
```

**Injection point:** The chat handler already routes by `action` field. Add a new `chat_mode` field to `ChatRequest` that selects an agency chat mode. When present, load the mode and prepend it to the system prompt.

**Code change (pseudo-diff):**
```typescript
// index.ts — ChatRequest interface
interface ChatRequest {
  // ... existing fields
  chat_mode?: 'practice-pitch' | 'growth-strategy' | 'deal-review' | 'canvas-coach';
}

// Inside the handler, before the main chat Gemini call:
let modePrompt = '';
if (body.chat_mode && CHAT_MODES.includes(body.chat_mode as any)) {
  modePrompt = await loadChatMode(body.chat_mode);
  if (modePrompt) {
    console.log(`[agency] Loaded chat mode: ${body.chat_mode} (${modePrompt.length} chars)`);
  }
}

// When constructing the system prompt for the chat action:
const systemPrompt = modePrompt
  ? `${modePrompt}\n\n---\n\n${baseSystemPrompt}`
  : baseSystemPrompt;
```

**Where in prompt:** Chat mode prompt is prepended (not appended) to the base system prompt. The mode defines the persona, methodology, and constraints — the base prompt provides platform context. This ordering ensures the mode persona takes precedence.

**Graceful degradation:** If `chat_mode` is absent or the mode file fails to load, the base system prompt is used unchanged. Existing chat behavior is unaffected.

**Verification:** Send a chat request with `{ "chat_mode": "practice-pitch", "message": "I need to practice my pitch" }`. If the response adopts a VC persona and asks probing investor questions, the mode loaded. Repeat for all 4 modes.

---

## Fragment Caching Strategy

Per prompt 018 (Fragment Caching), caching behavior is:

| Environment | Detection | TTL | Behavior |
|---|---|---|---|
| Development | `DENO_DEPLOYMENT_ID` env var absent | 5 minutes | Fragment re-read from disk after TTL expiry |
| Production | `DENO_DEPLOYMENT_ID` env var present | Infinite | Fragment cached for isolate lifetime |

The caching is handled inside `agent-loader.ts` (task 018). This task (104) only needs to call `loadFragment()` / `loadChatMode()` — caching is transparent to callers.

For the investor-agent pattern (11 prompts per request), the `_cachedFragment` variable in `prompt.ts` provides an additional request-scope cache layer to avoid 11 calls to the loader for the same fragment within a single request.

---

## Feature Flag: `AGENCY_FRAGMENTS_ENABLED`

Add an environment check inside `agent-loader.ts`:

```typescript
// agent-loader.ts — add at top
function isAgencyEnabled(): boolean {
  const flag = Deno.env.get('AGENCY_FRAGMENTS_ENABLED')
  // Default: enabled. Only disabled when explicitly set to 'false'
  return flag !== 'false'
}

export async function loadFragment(name: string): Promise<string> {
  if (!isAgencyEnabled()) {
    console.log(`[agency] Skipped ${name} (disabled via AGENCY_FRAGMENTS_ENABLED)`)
    return ''
  }
  // ... existing load logic
}
```

This allows disabling all agency fragments in production without redeploying any edge function. Set via Supabase dashboard (Project Settings > Edge Functions > Environment Variables) or CLI:
```bash
npx supabase secrets set AGENCY_FRAGMENTS_ENABLED=false --project-ref yvyesmiczbjqwbqtlidy
```

---

## Deploy Order

Deploy in this order. Each function is verified before proceeding to the next. If any function fails, stop and fix before continuing.

| Step | Function | Fragments/Modes | Verify | Rollback |
|---|---|---|---|---|
| 0 | (no deploy) | `agency/lib/agent-loader.ts` is bundled with each EF — no separate deploy | Import resolves | N/A |
| 1 | `validator-start` | `validator-scoring-fragment` + `validator-composer-fragment` | Run full pipeline, check report has evidence tiers | Redeploy previous version from Supabase dashboard |
| 2 | `sprint-agent` | `sprint-agent-fragment` | Generate sprint tasks, check for RICE fields | Redeploy previous version |
| 3 | `investor-agent` | `crm-investor-fragment` | Call `score_deal` action, check for MEDDPICC fields | Redeploy previous version |
| 4 | `pitch-deck-agent` | `pitch-deck-fragment` | Generate a test deck, check narrative structure | Redeploy previous version |
| 5 | `lean-canvas-agent` | `canvas-coach` chat mode | Send coach message, check specificity coaching | Redeploy previous version |
| 6 | `ai-chat` | All 4 chat modes | Send `chat_mode: 'practice-pitch'` request, verify persona | Redeploy previous version |

**Deploy command (per function):**
```bash
npx supabase functions deploy <function-name> --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt
```

**Rollback plan:**
1. **Immediate:** Set `AGENCY_FRAGMENTS_ENABLED=false` in Supabase secrets. All functions revert to base prompts within seconds (next isolate cold start).
2. **Per-function:** Redeploy previous version from Supabase dashboard (Functions > version history > Deploy).
3. **Full rollback:** Redeploy all 6 functions from the git commit before this task's changes.

---

## Schema

No schema changes. This task is pure edge function wiring. Fragment files are read from the filesystem at runtime, not from the database.

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Fragment file missing from deploy bundle | `loadFragment()` returns empty string. Edge function uses base prompt. Warning logged: `[agent-loader] Fragment not found: {name}`. |
| `AGENCY_FRAGMENTS_ENABLED` set to `false` | All `loadFragment()` and `loadChatMode()` calls return empty string immediately. No disk read attempted. Log: `[agency] Skipped {name} (disabled)`. |
| `AGENCY_FRAGMENTS_ENABLED` env var not set | Default behavior: fragments enabled. `isAgencyEnabled()` returns `true`. |
| Fragment file is empty (0 bytes) | `loadFragment()` returns empty string. The `if (fragment)` check prevents injection of the `## Agency Enhancement` header with no content. |
| Fragment file is very large (10KB+) | No hard limit enforced. Gemini handles large system prompts. Log character count for monitoring: `[agency] Loaded {name} ({N} chars)`. |
| `agent-loader.ts` import path wrong | TypeScript compilation fails. Caught at build time, not runtime. |
| Multiple concurrent requests to same EF | Each request calls `loadFragment()` independently. Module-scope cache (from task 001/018) ensures only the first request reads from disk. Thread-safe in Deno single-threaded model. |
| Invalid `chat_mode` value sent to ai-chat | `CHAT_MODES.includes()` check fails. Mode prompt stays empty. Base chat behavior used. No error — invalid mode silently ignored with log warning. |
| Deno Deploy bundles agency files differently | `import.meta.url` resolves relative to the deployed file. `new URL('../prompts/', import.meta.url)` should resolve correctly in both local and deploy environments. Test with `supabase functions serve` locally first. |
| Fragment contains markdown that conflicts with prompt | Fragments use `##` headers which nest under the base prompt's structure. The `## Agency Enhancement` header clearly separates base from agency content. No conflict expected — both are plain text to Gemini. |

## Real-World Examples

**Scenario 1 — Validator pipeline with evidence tiers:** Founder Kai submits his PropTech startup for validation. The scoring agent runs with both the base domain knowledge and the injected `validator-scoring-fragment`. The fragment instructs the agent to weight each evidence piece by tier (cited source = 1.0x, founder claim = 0.8x, AI inference = 0.6x). Kai's report shows his Market Size dimension scored 72 with "Medium confidence — based on founder-cited industry report (0.8x weight)." Without the fragment, the same dimension would show a raw 72 with no evidence attribution. **With this wiring,** Kai knows exactly where his validation is strong (cited data) and where he needs to do more research (AI inference only). The report becomes an actionable research roadmap, not just a score.

**Scenario 2 — Sprint board with RICE scoring:** Founder Amara generates a 90-day sprint plan for her HealthTech startup. Before wiring, the sprint agent produces 24 tasks with titles and success criteria. After wiring, the `sprint-agent-fragment` injects RICE scoring into each task (Reach x Impact x Confidence / Effort). Amara's sprint board now shows tasks ordered by RICE score — "Interview 15 hospital procurement officers" (RICE: 42) ranks above "Design landing page mockup" (RICE: 18). **With RICE scoring,** Amara spends her first sprint on validation interviews instead of premature design work. The fragment transforms the sprint board from a flat task list into a prioritized execution engine.

**Scenario 3 — Graceful degradation during partial deploy:** DevOps engineer deploys `validator-start` with the scoring fragment wired in (step 1). The deploy succeeds and the pipeline produces enhanced reports. Before deploying step 2, the `sprint-agent-fragment.md` file is accidentally deleted from the bundle. When the sprint agent is deployed, `loadFragment('sprint-agent-fragment')` returns empty string and logs a warning. The sprint agent continues to work with its base prompt — founders see no error, just the pre-enhancement task quality. **With graceful degradation,** a missing fragment file never causes a user-facing error. The DevOps engineer sees the warning in logs and re-deploys with the correct bundle.

## Outcomes

| Before | After |
|--------|-------|
| 5 prompt fragments sit on disk unused | All 5 fragments injected into their target edge functions at runtime |
| 4 chat modes defined but unselectable | All 4 modes available via `chat_mode` field in ai-chat requests |
| Validator scores have no evidence attribution | Each dimension annotated with evidence tier and confidence weight |
| Sprint tasks have equal priority (no ranking) | Tasks ranked by RICE score with Kano classification |
| Investor prompts are generic one-liners | All 11 investor prompts enhanced with MEDDPICC framework |
| Pitch deck generation uses base instructions | Challenger narrative structure and persuasion scoring injected |
| Canvas coach gives generic advice | Specificity meters and box quality checklist guide coaching |
| No way to disable agency enhancements | `AGENCY_FRAGMENTS_ENABLED=false` disables all fragments instantly |
| Broken fragment file crashes edge function | `loadFragment()` returns empty string — zero user-facing impact |

---

## Checklists

### Production Ready

- [ ] `npm run build` passes
- [ ] `npm run test` passes (no regressions)
- [ ] No `console.log` in production code (use `console.info` for agency logs)
- [ ] Loading, error, empty states handled in every injection point
- [ ] Edge functions verify JWT (pre-existing — no changes needed)
- [ ] No secrets in client code
- [ ] `AGENCY_FRAGMENTS_ENABLED` env var documented in `.env.example`

### Regression (manual spot-check)

- [ ] Validator: Chat > Progress > Report renders with enriched scores
- [ ] Sprint Board: Tasks generate with RICE fields (when fragment loaded)
- [ ] Investor: `score_deal` action returns MEDDPICC-style output
- [ ] Pitch Deck: Generation produces slides with narrative structure
- [ ] Lean Canvas: Coach chat responds with specificity coaching
- [ ] AI Chat: `chat_mode: 'practice-pitch'` activates VC persona
- [ ] AI Chat: Omitting `chat_mode` uses default behavior (no regression)
- [ ] All functions work with `AGENCY_FRAGMENTS_ENABLED=false` (base prompts only)

---

## Cross References

| Document | Path |
|----------|------|
| Agent Loader Source | `agency/lib/agent-loader.ts` |
| Fragment Caching (018) | `agency/prompts/018-fragment-caching.md` |
| Agent Loader Runtime (001) | `agency/prompts/001-agent-loader-runtime.md` |
| Staged Deploy (023) | `agency/prompts/023-staged-deploy.md` |
| Backward Compatibility (021) | `agency/prompts/021-backward-compatibility.md` |
| Feature Prompts Index | `agency/prompts/000-index.md` |
| Infrastructure Index | `agency/prompts/100-index.md` |
| Fragment Wiring Map (Mermaid) | `agency/mermaid/02-fragment-wiring-map.md` |
| Agency PRD | `agency/prd-agency.md` |
