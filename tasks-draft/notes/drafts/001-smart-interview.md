---
task_id: 001-VAL
title: Smart Interview — Depth Tracking & YC-Style Probing
diagram_ref: D-01 (Pipeline DAG), D-02 (Agent Sequence)
phase: CORE
priority: P0
status: Done
skill: /gemini
ai_model: gemini-3-flash-preview
subagents: [code-reviewer, debugger]
edge_function: validator-followup
schema_tables: [validator_sessions]
depends_on: []
---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screens** | ValidatorChat (existing) |
| **Features** | Depth tracking (none/shallow/deep), YC-style probing questions, extracted preview, anti-repetition |
| **Agents** | validator-followup (upgrade prompt + schema) |
| **Edge Functions** | /validator-followup |
| **Use Cases** | Founder describes idea, AI asks expert follow-ups, depth increases per topic |
| **Real-World** | "Founder says 'AI for restaurants'. Agent asks 'Which restaurants -- fast food, chains, independent? What specific problem?' instead of generic 'Tell me about your customers'" |

---

## Description

Upgrade the validator-followup edge function from boolean topic coverage (covered: true/false) to depth-based tracking (none/shallow/deep). Replace generic questions with YC-style probing that references the founder's specific words. Add an `extracted` object that captures what the AI understood so far, preventing information loss when passing to the pipeline.

## Rationale

**Problem:** Current interview checks 8 boolean flags. "Restaurant owners" marks customer as true. No depth. Pipeline receives surface-level input and must guess details.

**Solution:** Three-level depth per topic (none/shallow/deep) plus 5 interview techniques (probing, quantifying, challenging, deepening, pivoting). AI tracks what it understood in `extracted` fields, building a structured summary progressively.

**Impact:** Pipeline gets 3-5x richer input. Research and Competitors agents can build specific queries instead of generic ones. Scoring gets quantified claims to benchmark against.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get follow-up questions that reference my specific words | I feel heard and give better answers |
| Founder | see what the AI understood from my answers | I can correct misunderstandings before the report runs |
| Pipeline agent | receive structured depth + extracted fields | I build specific queries, not generic ones |
| Scoring agent | receive quantified claims (e.g., "$200/slot no-show cost") | I can benchmark against industry data |

---

## Real-World Example

> Alex types "I'm building an AI scheduling tool for dental practices." The AI responds: "Interesting -- which type of dental practices: independent solo practitioners, small group practices, or large chains? And what specifically about scheduling is the pain -- appointment booking, staff scheduling, or equipment allocation?" Alex answers: "Independent practices, 1-5 dentists. Appointment scheduling -- they use paper books, double-book constantly, no-shows cost them $200/slot." The AI marks customer: deep, problem: deep, and records extracted: { customer: "independent dental practices, 1-5 dentists", problem: "paper-based appointment scheduling, double-booking, $200/slot no-show cost" }.

---

## Goals

1. **Primary:** Follow-up questions drive toward deep, specific, quantified answers
2. **Secondary:** `extracted` object captures structured understanding per topic
3. **Quality:** Each question references founder's specific words (no generic templates)

---

## Acceptance Criteria

- [ ] Coverage uses 3 levels: `none` | `shallow` | `deep` (not boolean) #CORE
- [ ] Response schema includes `extracted` object with fields: problem, customer, solution, differentiation, demand, competitors, business_model, websites #CORE
- [ ] Questions use 5 techniques: probing (shallow to deep), quantifying (vague claims), challenging (assumptions), deepening (good answers), pivoting (topic exhausted) #CORE
- [ ] Readiness rule: 3+ messages AND 5+ shallow-or-deeper AND 2+ deep, OR 4+ messages AND 4+ deep, OR 8+ messages #CORE
- [ ] AI never re-asks a topic just answered in the previous message #CORE
- [ ] Questions reference founder's specific words (not "Tell me about your customers") #CORE
- [ ] `extracted` fields update progressively as conversation deepens #CORE
- [ ] Backwards compatible: frontend still works if it only reads boolean coverage (shallow or deeper = true) #CORE

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Prompt | `supabase/functions/validator-followup/prompt.ts` | **Rewrite** -- depth tracking instructions, 5 interview techniques, extracted field instructions, updated readiness rules |
| Schema | `supabase/functions/validator-followup/schema.ts` | **Update** -- coverage changes from `{topic: boolean}` to `{topic: "none" \| "shallow" \| "deep"}`, add `extracted` object with 8 string fields |
| Handler | `supabase/functions/validator-followup/index.ts` | **Minor** -- no structural changes needed; schema drives Gemini output. Add log line for extracted fields |
| Frontend | `src/components/validator/chat/ValidatorChat.tsx` | **Update** -- FALLBACK_QUESTIONS to use depth-aware logic; `pickFallbackQuestion` checks depth instead of boolean |
| Hook | `src/hooks/useValidatorFollowup.ts` | **Update** -- `FollowupCoverage` type changes from boolean to depth enum; `canGenerate` logic updated for new readiness rules |

### Prompt Rewrite Specification

The new `FOLLOWUP_SYSTEM_PROMPT` in `supabase/functions/validator-followup/prompt.ts` must include:

**Topic Checklist** (same 8 topics, same priority order):
1. problem, 2. customer, 3. competitors, 4. websites, 5. innovation, 6. uniqueness, 7. demand, 8. research

**Depth Definitions:**
- `none` -- zero information about this topic in the conversation
- `shallow` -- topic mentioned but lacks specifics (e.g., "restaurant owners" with no further detail)
- `deep` -- topic has specific, quantified, or multi-dimensional detail (e.g., "independent dental practices, 1-5 dentists, $200/slot no-show cost")

**5 Interview Techniques:**
1. **Probing** (shallow topic): "You mentioned [X] -- can you be more specific about [dimension]?"
2. **Quantifying** (vague claim): "You said [claim] -- roughly how many / how much / how often?"
3. **Challenging** (assumption): "What if [alternative]? How would that change your approach?"
4. **Deepening** (strong answer): "That's specific. What about [related dimension]?"
5. **Pivoting** (topic exhausted): Move to highest-priority `none` topic

**Extracted Fields Instructions:**
- After each message, update the `extracted` object with what the AI understood
- Use the founder's own words where possible, condensed to key phrases
- Empty string if nothing extracted yet for that topic
- Fields: problem, customer, solution, differentiation, demand, competitors, business_model, websites

**Updated Readiness Rules:**
- 3+ user messages AND 5+ topics at shallow-or-deeper AND 2+ topics at deep => ready
- 4+ user messages AND 4+ topics at deep => ready
- 8+ user messages => always ready (regardless of depth)
- When ready, set action to "ready", question to empty string, provide summary

### Schema Update Specification

Current `FollowupResponse` interface in `supabase/functions/validator-followup/schema.ts`:

```typescript
// CURRENT (boolean)
coverage: {
  customer: boolean;
  problem: boolean;
  // ...
};

// NEW (depth enum + extracted)
coverage: {
  customer: "none" | "shallow" | "deep";
  problem: "none" | "shallow" | "deep";
  competitors: "none" | "shallow" | "deep";
  innovation: "none" | "shallow" | "deep";
  demand: "none" | "shallow" | "deep";
  research: "none" | "shallow" | "deep";
  uniqueness: "none" | "shallow" | "deep";
  websites: "none" | "shallow" | "deep";
};
extracted: {
  problem: string;
  customer: string;
  solution: string;
  differentiation: string;
  demand: string;
  competitors: string;
  business_model: string;
  websites: string;
};
```

The `followupResponseSchema` (JSON Schema for Gemini `responseJsonSchema`) must use `enum: ["none", "shallow", "deep"]` for each coverage field, and add the `extracted` object as a required field.

### Frontend Backwards Compatibility

In `src/components/validator/chat/ValidatorChat.tsx` and `src/hooks/useValidatorFollowup.ts`, the `FollowupCoverage` type and any code that reads `coverage.topic === true` must be updated to treat `shallow` or `deep` as truthy. Helper function:

```typescript
function isCovered(depth: "none" | "shallow" | "deep" | boolean): boolean {
  if (typeof depth === "boolean") return depth; // backwards compat
  return depth !== "none";
}
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Founder gives one-word answers | Agent uses probing technique, asks more specific question about the same topic |
| Founder provides very detailed answer covering multiple topics | Mark multiple topics as deep, pivot to next gap |
| Founder says "I don't know" to a topic | Mark as shallow (acknowledged but no data), move to next topic |
| Industry ambiguous | Ask: "Would you describe this as SaaS, marketplace, fintech, etc.?" |
| Founder shares URLs | Mark websites as deep, note URLs in extracted.websites |
| Old frontend sends boolean coverage | Handler still returns depth strings; old frontend treats any non-false as covered |
| Gemini returns boolean instead of depth string | extractJSON should handle gracefully; treat true as "shallow", false as "none" |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Generic "Tell me about your customers" | Reference their words: "You mentioned restaurant owners -- independent or chains?" |
| Re-ask a topic from the previous message | Pivot to the next uncovered or shallow topic |
| Ask 3 questions at once | One focused question per turn |
| Mark "deep" for vague answers | Only "deep" when specific, quantified, or multi-dimensional |
| Lose information between turns | Accumulate in `extracted` fields progressively |
| Boolean coverage check | Three-level depth check |

---

## AI Prompt Instructions

### Context Block

You are implementing Smart Interview depth tracking for the StartupAI validator.
- Stack: React 18 + TypeScript + Vite + Supabase + shadcn/ui
- Edge functions: Deno runtime, Gemini 3 Flash
- Path alias: `@/` maps to `./src/`
- Use existing patterns from `supabase/functions/validator-followup/`
- Follow the wiring plan exactly

### Constraints

- Gemini: Always use `responseJsonSchema` + `responseMimeType` for guaranteed JSON (G1 rule)
- Gemini 3: Keep temperature at 1.0 (G2 rule -- lower causes looping)
- API key in `x-goog-api-key` header (G4 rule)
- Edge function timeout: 25s (existing, no change)
- Max output tokens: 2048 (existing, no change)
- No `any` types, no inline styles
- Keep components under 200 lines

### Expected Output

1. Approach explanation (2-3 sentences)
2. Updated `prompt.ts` with full rewritten system prompt
3. Updated `schema.ts` with depth enum and extracted object
4. Updated `ValidatorChat.tsx` fallback logic
5. Updated `useValidatorFollowup.ts` type and readiness logic

---

## Security Checklist

- [ ] JWT verified in edge function (existing -- no change needed) #CORE
- [ ] Input sanitized: max 20 messages, max 2000 chars each, HTML stripped (existing in `index.ts`) #CORE
- [ ] Rate limiting active: 30 requests per 60s per user (existing in `index.ts`) #CORE
- [ ] No secrets in client code (`import.meta.env.VITE_*` only) #CORE
- [ ] XSS prevention: extracted fields are AI-generated strings, never rendered as raw HTML #CORE
- [ ] No PII logged: only coverage depth and question number in console.log #CORE

---

## Production Ready Checklist

### Build Verification

- [ ] `npm run build` passes (no new errors) #CORE
- [ ] `npm run test` passes (no regressions, all 96+ tests green) #CORE
- [ ] `npm run lint` -- no new errors introduced #CORE
- [ ] No `console.log` left in production code (edge function logs use `console.log` by convention, frontend must not) #CORE

### Feature Verification

- [ ] Follow-up questions reference founder's specific words #CORE
- [ ] Coverage depth progresses: none -> shallow -> deep across conversation #CORE
- [ ] `extracted` fields accumulate progressively (not reset each turn) #CORE
- [ ] Readiness triggers at correct thresholds (test all 3 readiness paths) #CORE
- [ ] Backwards compatibility: old frontend code does not break with depth strings #CORE

### Security (edge function)

- [ ] JWT verification unchanged and working #CORE
- [ ] Rate limiting unchanged and working #CORE
- [ ] Input sanitization unchanged and working #CORE
- [ ] No new secrets exposed to client #CORE

### Deployment

- [ ] Edge function deployed: `supabase functions deploy validator-followup` #CORE
- [ ] Edge function responds 200 on valid request #CORE
- [ ] Edge function responds 401 on missing auth #CORE
- [ ] Schema change does not break existing validator_sessions data #CORE

---

## Regression Checklist

- [ ] **Validator**: Chat sends message, follow-up returns, depth coverage displays, Generate button enables at readiness threshold #CORE
- [ ] **Validator**: Pipeline runs end-to-end after chat (all 7 agents complete) #CORE
- [ ] **Validator**: Report renders all 14 sections #CORE
- [ ] **Lean Canvas**: Auto-populate from report still works #CORE
- [ ] **Dashboard**: Loads without errors #CORE
- [ ] **Auth**: Google OAuth login/logout cycle works #CORE

---

## Testing Requirements

| Type | Coverage | When |
|------|----------|------|
| Unit | Schema validation, depth enum parsing, isCovered helper | This task |
| Integration | Edge function returns valid depth-based response | This task |
| E2E | Full chat-to-pipeline flow with depth tracking | This task |
| Manual | 3 conversations testing all 5 interview techniques | This task |

### Test Cases (minimum)

- [ ] Happy path: 4-message conversation reaches "ready" with 4+ deep topics #CORE
- [ ] Slow founder: 8 messages with mostly shallow answers triggers readiness #CORE
- [ ] One-word answers: agent probes for specifics, does not mark deep #CORE
- [ ] URL provided: websites marked deep, URL captured in extracted.websites #CORE
- [ ] Edge function timeout: returns 504 with user-friendly message (existing behavior) #CORE
- [ ] Gemini parse failure: returns 200 with error message (existing behavior) #CORE
- [ ] Old frontend compatibility: boolean-style checks still work with depth strings #CORE

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Current followup prompt | `supabase/functions/validator-followup/prompt.ts` |
| Current followup schema | `supabase/functions/validator-followup/schema.ts` |
| Current followup handler | `supabase/functions/validator-followup/index.ts` |
| Chat UI component | `src/components/validator/chat/ValidatorChat.tsx` |
| Followup hook | `src/hooks/useValidatorFollowup.ts` |
| Gemini shared client | `supabase/functions/_shared/gemini.ts` |
| Pipeline config | `supabase/functions/validator-start/config.ts` |
| Extractor agent (consumes input) | `supabase/functions/validator-start/agents/extractor.ts` |

### Import Map

```typescript
// Edge function (Deno)
import { FOLLOWUP_SYSTEM_PROMPT } from "./prompt.ts";
import { followupResponseSchema, type FollowupResponse } from "./schema.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";

// Frontend (React)
import { useValidatorFollowup, type FollowupCoverage } from "@/hooks/useValidatorFollowup";
```
