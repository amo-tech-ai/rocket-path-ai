---
task_id: 106-INF
title: Agency Claude SDK Integration
phase: INFRASTRUCTURE
priority: P1
status: Not Started
estimated_effort: 0.5 day
skill: [claude-developer-platform]
subagents: [ai-agent-dev]
edge_function: investor-agent, crm-agent, ai-chat
depends_on: [104-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Investor Pipeline, CRM, AI Chat |
| **Features** | MEDDPICC scoring, deal analysis, pipeline intelligence, cold email generation, chat modes |
| **Edge Functions** | `investor-agent` (12 actions), `crm-agent` (8 actions), `ai-chat` (deal-review mode) |
| **Real-World** | "Claude scores each investor using MEDDPICC, generates a cold email, and powers the deal-review chat mode" |

## Description

**The situation:** Three edge functions use the Anthropic Claude API for tasks requiring nuanced reasoning: `investor-agent` for 12 investor actions (discover, analyze_fit, score_deal, generate_outreach, etc.), `crm-agent` for contact enrichment and deal scoring, and `ai-chat` for task prioritization and generation via the `callAnthropic` function. Currently, `investor-agent` and `crm-agent` actually call Gemini for all actions — Claude is declared in the PRD and architecture docs as the intended model but has not been wired. The `ai-chat` function is the only one with a working `callAnthropic` implementation (used for `prioritize_tasks` with Sonnet 4.5 and `generate_tasks` with Haiku 4.5). The agency integration adds MEDDPICC scoring to the investor-agent and enhanced deal scoring to the CRM agent, both of which benefit from Claude's structured reasoning over Gemini's pattern-matching.

**Why it matters:** MEDDPICC deal qualification requires multi-step reasoning: assess 8 dimensions, weigh evidence quality, detect "happy ears" bias, and produce a calibrated verdict. Cold email generation requires creative writing with precise constraint adherence (under 120 words, signal-based opening, no deck attachment). Deal pipeline analysis requires synthesizing multiple data points into ranked recommendations. These are Claude's strongest capabilities — reasoning chains, constraint following, and nuanced judgment. Using Gemini for these tasks produces generic, checkbox-style outputs. Additionally, the `deal-review` chat mode needs Claude's conversational reasoning to challenge founders on pipeline quality rather than agreeing with their optimistic assessments.

**What already exists:**
- `supabase/functions/investor-agent/index.ts` — 12 actions, currently calls `callGemini` from `_shared/gemini.ts`
- `supabase/functions/investor-agent/prompt.ts` — 12 system prompts + 11 JSON schemas
- `supabase/functions/crm-agent/index.ts` — 8 actions, currently calls `callGemini` from `_shared/gemini.ts`
- `supabase/functions/crm-agent/prompt.ts` — 8 system prompts + 6 JSON schemas
- `supabase/functions/ai-chat/index.ts` — Working `callAnthropic()` function (lines 564-649) with `Promise.race` timeout, ephemeral cache_control, context management
- `agency/prompts/crm-investor-fragment.md` — MEDDPICC scoring rules, signal-based timing, cold email anatomy
- `agency/chat-modes/deal-review.md` — Deal strategist persona, MEDDPICC quick assessment, pipeline inspection questions, red flags, deal verdict categories
- `agency/lib/agent-loader.ts` — `loadFragment()` and `loadChatMode()` utilities
- Model config in ai-chat: `prioritize_tasks` uses `claude-sonnet-4-5-20250929`, `generate_tasks` uses `claude-haiku-4-5-20251001`

**The build:**
1. Create `supabase/functions/_shared/anthropic.ts` — Shared `callClaude()` utility extracted from ai-chat's `callAnthropic()`, parameterized for model, max_tokens, temperature, and system prompt structure (base + fragment injection)
2. Migrate `investor-agent` actions `score_deal`, `analyze_investor_fit`, `generate_outreach`, `analyze_term_sheet`, and `analyze_pipeline` from Gemini to Claude via `callClaude()`. These 5 actions require reasoning depth. The other 7 actions stay on Gemini (fast extraction tasks).
3. Migrate `crm-agent` actions `score_lead`, `score_deal`, and `suggest_follow_ups` from Gemini to Claude. The other 5 actions stay on Gemini.
4. Wire `loadFragment('crm-investor-fragment')` into the system prompt for Claude-powered investor and CRM actions
5. Wire `loadChatMode('deal-review')` in `ai-chat` for the deal-review mode (currently not connected)
6. Refactor ai-chat's inline `callAnthropic()` to import from `_shared/anthropic.ts`
7. Deploy all 3 edge functions

**Example:** Marcus triggers `score_deal` on Sequoia Capital. The investor-agent calls `loadFragment('crm-investor-fragment')` to get MEDDPICC rules, builds a system prompt of `SCORE_DEAL_SYSTEM + '\n\n' + fragment`, and calls Claude Haiku 4.5 with the investor data. Claude returns: `{ meddpicc_score: 31, deal_verdict: 'buy', dimensions: { metrics: { score: 4, reasoning: 'Strong MRR growth of 25% MoM...' }, economic_buyer: { score: 3, reasoning: 'Partner identified but no direct meeting yet' }, ... }, signal_tier: 'hot', recommended_actions: ['Request GP intro via portfolio founder', 'Send updated metrics deck'] }`. The frontend shows a "31/40 Buy" badge on the Sequoia card.

## Rationale
**Problem:** Investor scoring and deal analysis use Gemini, which produces generic checkbox-style outputs for nuanced multi-step reasoning tasks. Cold email generation lacks the constraint adherence Claude provides. The deal-review chat mode has no specialized AI persona connected.
**Solution:** Shared `callClaude()` utility with fragment injection. Five investor-agent actions and three CRM-agent actions migrate to Claude for reasoning-heavy work. Gemini stays for fast extraction actions. Deal-review chat mode wired via `loadChatMode()`.
**Impact:** MEDDPICC scores reflect actual evidence quality instead of pattern matching. Cold emails follow the signal-value-ask structure under 120 words. Deal-review chat challenges founders on pipeline assumptions.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get MEDDPICC scores powered by Claude reasoning | investor prioritization reflects real deal evidence, not pattern matching |
| Founder | receive cold emails that follow signal-based structure | outreach gets higher response rates from investors |
| Founder | chat in deal-review mode with a skeptical AI strategist | I get honest pipeline assessment instead of cheerleading |
| Developer | import `callClaude()` from `_shared/anthropic.ts` | any edge function can use Claude without duplicating the API client |

## Goals
1. **Primary:** Shared `callClaude()` utility with `Promise.race` timeout, used by investor-agent, crm-agent, and ai-chat
2. **Secondary:** MEDDPICC scoring via Claude returns 8-dimension breakdown with evidence-grounded reasoning
3. **Quality:** Claude response latency under 10s for Haiku, under 25s for Sonnet; hard timeout at 30s

## Acceptance Criteria
- [ ] `_shared/anthropic.ts` exports `callClaude(options)` with model, system, messages, max_tokens, temperature params
- [ ] `callClaude` wraps the API call in `Promise.race` with a configurable timeout (default 30s)
- [ ] `callClaude` returns `{ text, inputTokens, outputTokens }` matching the existing ai-chat interface
- [ ] `callClaude` handles 429 rate limit errors with a descriptive error message
- [ ] `investor-agent` actions `score_deal`, `analyze_investor_fit`, `generate_outreach`, `analyze_term_sheet`, `analyze_pipeline` call `callClaude` instead of `callGemini`
- [ ] `crm-agent` actions `score_lead`, `score_deal`, `suggest_follow_ups` call `callClaude` instead of `callGemini`
- [ ] Fragment injection: `loadFragment('crm-investor-fragment')` appended to system prompt for all Claude-powered actions
- [ ] `ai-chat` deal-review mode: when `mode === 'deal-review'`, uses `loadChatMode('deal-review')` as system prompt via `callClaude`
- [ ] `ai-chat` refactored: inline `callAnthropic()` replaced with import from `_shared/anthropic.ts`
- [ ] All 3 edge functions deployed
- [ ] Existing Gemini-powered actions unchanged (backward compatible)

## Research Before Implementation

Read these files before writing code:
- `supabase/functions/ai-chat/index.ts` lines 564-649 — existing `callAnthropic()` to extract into shared utility
- `supabase/functions/investor-agent/index.ts` — current Gemini call pattern for each action
- `supabase/functions/crm-agent/index.ts` — current Gemini call pattern for each action
- `supabase/functions/_shared/gemini.ts` — shared utility pattern to mirror for Claude
- `agency/prompts/crm-investor-fragment.md` — MEDDPICC rules injected into system prompts
- `agency/chat-modes/deal-review.md` — deal-review mode persona and rules
- `agency/lib/agent-loader.ts` — `loadFragment()` and `loadChatMode()` API

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Shared Utility | `supabase/functions/_shared/anthropic.ts` | Create — `callClaude()`, `CallClaudeOptions` type |
| Edge Function | `supabase/functions/investor-agent/index.ts` | Modify — import `callClaude`, migrate 5 actions |
| Edge Function | `supabase/functions/crm-agent/index.ts` | Modify — import `callClaude`, migrate 3 actions |
| Edge Function | `supabase/functions/ai-chat/index.ts` | Modify — replace inline `callAnthropic` with shared import, wire deal-review mode |
| Prompts | `supabase/functions/investor-agent/prompt.ts` | Modify — no changes needed (prompts are model-agnostic) |
| Deploy | 3 edge functions | Deploy — `investor-agent`, `crm-agent`, `ai-chat` |

## Claude Integration Details

### Model Selection

| Action | Model | Rationale | max_tokens | temperature |
|--------|-------|-----------|------------|-------------|
| `score_deal` | `claude-haiku-4-5-20251001` | Fast structured scoring, 8 dimensions | 2048 | 0.7 |
| `analyze_investor_fit` | `claude-haiku-4-5-20251001` | Structured breakdown with reasoning | 2048 | 0.7 |
| `generate_outreach` | `claude-haiku-4-5-20251001` | Creative constraint writing (<120 words) | 1024 | 0.9 |
| `analyze_term_sheet` | `claude-sonnet-4-5-20250929` | Complex legal reasoning, risk flagging | 4096 | 0.7 |
| `analyze_pipeline` | `claude-haiku-4-5-20251001` | Multi-deal synthesis, ranking | 2048 | 0.7 |
| `score_lead` (CRM) | `claude-haiku-4-5-20251001` | Lead quality scoring with MEDDPICC dimensions | 2048 | 0.7 |
| `score_deal` (CRM) | `claude-haiku-4-5-20251001` | CRM deal scoring | 2048 | 0.7 |
| `suggest_follow_ups` (CRM) | `claude-haiku-4-5-20251001` | Signal-based timing recommendations | 1024 | 0.7 |
| `deal-review` chat mode | `claude-sonnet-4-5-20250929` | Conversational reasoning, challenges assumptions | 2048 | 0.8 |
| `prioritize_tasks` (existing) | `claude-sonnet-4-5-20250929` | Multi-criteria task ranking | 2048 | 0.7 |
| `generate_tasks` (existing) | `claude-haiku-4-5-20251001` | Fast task generation | 2048 | 0.7 |

**Rule:** Use Haiku 4.5 for structured scoring and fast tasks. Use Sonnet 4.5 for complex reasoning (term sheets, pipeline analysis, conversational modes). Opus 4.6 is reserved for future strategic planning tasks not in this scope.

### Shared Utility: `_shared/anthropic.ts`

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

export interface CallClaudeOptions {
  model: string;
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  max_tokens?: number;    // default: 2048
  temperature?: number;   // default: 0.7
  timeoutMs?: number;     // default: 30_000
}

export interface ClaudeResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export async function callClaude(options: CallClaudeOptions): Promise<ClaudeResponse> {
  const {
    model,
    system,
    messages,
    max_tokens = 2048,
    temperature = 0.7,
    timeoutMs = 30_000,
  } = options;

  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const doFetch = async (): Promise<ClaudeResponse> => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens,
        temperature,
        system: [{ type: 'text', text: system }],
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Claude API error: ${response.status}`, errorText);

      if (response.status === 429) {
        throw new Error('Claude rate limit exceeded. Please try again later.');
      }
      if (response.status === 529) {
        throw new Error('Claude API overloaded. Please retry in a moment.');
      }
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.content?.[0]?.text || '',
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
    };
  };

  // Promise.race: hard timeout backup for Deno Deploy body-streaming hangs
  return await Promise.race([
    doFetch(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Claude API hard timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}
```

### System Prompt Structure (Base + Fragment)

For every Claude-powered action, the system prompt is composed by concatenating the action-specific base prompt with the agency fragment:

```typescript
import { loadFragment } from '../../../agency/lib/agent-loader.ts';

// At invocation time:
const fragment = await loadFragment('crm-investor-fragment');
const system = `${SCORE_DEAL_SYSTEM}\n\n${fragment}`;

const result = await callClaude({
  model: 'claude-haiku-4-5-20251001',
  system,
  messages: [{ role: 'user', content: userPrompt }],
  max_tokens: 2048,
  temperature: 0.7,
});
```

The fragment appends MEDDPICC scoring rules, signal-based outreach timing, and cold email structure to whatever base prompt the action already has. This keeps action prompts model-agnostic while injecting domain knowledge at runtime.

### Response Parsing

Claude does not support `responseJsonSchema` like Gemini. Instead, instruct JSON output in the system prompt and parse the response:

```typescript
// Add to system prompt for structured actions:
const JSON_INSTRUCTION = `\nRespond with valid JSON only. No markdown fences. No explanation outside the JSON.`;

const system = `${SCORE_DEAL_SYSTEM}\n\n${fragment}${JSON_INSTRUCTION}`;

// Parse response:
const parsed = JSON.parse(result.text);
```

For actions that return structured data (score_deal, analyze_investor_fit, score_lead, etc.), the existing JSON schemas from `prompt.ts` serve as documentation for the expected shape. Include the schema description in the system prompt so Claude knows what fields to return.

### Deal-Review Chat Mode Wiring

In `ai-chat/index.ts`, add deal-review to the mode routing:

```typescript
import { loadChatMode } from '../../../agency/lib/agent-loader.ts';

// In the chat handler, when mode === 'deal-review':
const modePrompt = await loadChatMode('deal-review');
if (modePrompt) {
  // Use Claude for deal-review mode
  const result = await callClaude({
    model: 'claude-sonnet-4-5-20250929',
    system: modePrompt,
    messages: formattedMessages,
    max_tokens: 2048,
    temperature: 0.8,
  });
}
```

### Token Budget Reference

| Model | Input Cost | Output Cost | Context Window |
|-------|-----------|------------|----------------|
| `claude-haiku-4-5-20251001` | $1/M input | $5/M output | 200K |
| `claude-sonnet-4-5-20250929` | $3/M input | $15/M output | 200K |

Typical per-call cost:
- score_deal (Haiku): ~800 input + ~600 output = ~$0.004
- analyze_term_sheet (Sonnet): ~2000 input + ~1500 output = ~$0.03
- deal-review chat turn (Sonnet): ~1500 input + ~800 output = ~$0.017

### Error Handling and Retries

```typescript
// Pattern for Claude calls in edge functions:
try {
  const result = await callClaude({ model, system, messages, timeoutMs: 30_000 });
  const parsed = JSON.parse(result.text);
  // ... process result
} catch (error) {
  const errMsg = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[investor-agent] score_deal Claude error:`, errMsg);

  if (errMsg.includes('timeout')) {
    return { success: false, error: 'AI scoring timed out. Please retry.' };
  }
  if (errMsg.includes('rate limit')) {
    return { success: false, error: 'Rate limit reached. Please wait a moment.' };
  }
  // Fallback: return without AI scoring rather than crashing
  return { success: false, error: 'AI scoring unavailable. Please retry.' };
}
```

No automatic retries for Claude — the 30s timeout plus `Promise.race` is the safety net. If Claude fails, the action returns an error to the frontend rather than hanging.

### Actions Staying on Gemini

These actions use fast extraction and pattern matching — no migration needed:

**Investor-agent (7 Gemini actions):** `discover_investors`, `find_warm_paths`, `track_engagement`, `prepare_meeting`, `enrich_investor`, `compare_investors`, `generate_report`

**CRM-agent (5 Gemini actions):** `enrich_contact`, `analyze_pipeline`, `generate_email`, `detect_duplicate`, `summarize_communication`

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| `ANTHROPIC_API_KEY` not set | `callClaude` throws immediately with clear error message |
| Claude returns non-JSON for structured action | Catch `JSON.parse` error, return `{ success: false, error: 'Failed to parse AI response' }` |
| Claude returns incomplete MEDDPICC (missing dimensions) | Fill missing dimensions with `{ score: 0, reasoning: 'Not assessed' }` |
| Claude 429 rate limit | Error message suggests retry; no automatic retry loop |
| Claude 529 overloaded | Error message suggests retry in a moment |
| Fragment file missing at runtime | `loadFragment` returns empty string; Claude runs with base prompt only (degraded but functional) |
| Deal-review mode with no investor data in context | Claude acts as general deal coach; asks founder to describe their pipeline |
| ai-chat receives `mode: 'deal-review'` but mode file missing | Falls back to general chat mode (existing behavior) |
| Concurrent calls from same user | Each call is independent; no shared state between requests |
| Claude response exceeds max_tokens | Response is truncated; for structured output, this may produce invalid JSON — catch and return error |

## Real-World Examples

**Scenario 1 — MEDDPICC scoring with evidence gaps:** Marcus adds Lightspeed Ventures to his pipeline and triggers AI scoring. Claude evaluates 8 dimensions against the data Marcus has entered. Champion scores 1/5 because Marcus only has an associate contact, no partner relationship. Decision Process scores 2/5 because Marcus wrote "they said they'd get back to me" with no timeline. Claude returns a total of 19/40 "Hold" verdict with the specific recommendation: "You're single-threaded to an associate — request an intro to a partner before your next follow-up." **With Claude's reasoning,** Marcus gets actionable next steps per dimension instead of a generic score.

**Scenario 2 — Cold email generation:** Aisha wants to reach out to an angel investor who just published a blog post about AI in healthcare. She triggers `generate_outreach`. Claude loads the `crm-investor-fragment` with cold email rules (signal-based opening, under 120 words, no deck attachment). Claude generates: subject "your AI healthcare thesis, from the practitioner side", body of 98 words with the blog post as signal, her clinical AI metrics as proof, and a 15-minute ask. **With Claude's constraint adherence,** the email follows the exact signal-value-ask structure at the right length, unlike Gemini which tends to write 200+ word emails that bury the ask.

**Scenario 3 — Deal-review chat session:** Sarah opens AI Chat and selects "Deal Review" mode. She types "I have 5 investors in my pipeline, what should I focus on?" Claude loads the deal-review persona and responds by asking for specifics: "Let's look at each one. For your strongest lead, tell me: when did you last speak to the decision-maker, and what did they say the next step was?" Sarah says "The partner at Fund X said they loved the pitch last week." Claude challenges: "What specific next step did they commit to? A partner saying they 'loved it' without scheduling diligence or requesting a data room is a yellow flag, not a green light." **With Claude's skeptical persona,** Sarah gets honest pipeline coaching instead of validation.

## Outcomes

| Before | After |
|--------|-------|
| investor-agent calls Gemini for all 12 actions including complex reasoning tasks | 5 reasoning-heavy actions (score_deal, analyze_fit, outreach, term_sheet, pipeline) use Claude; 7 fast actions stay on Gemini |
| crm-agent calls Gemini for all 8 actions | 3 scoring/follow-up actions use Claude; 5 extraction actions stay on Gemini |
| `callAnthropic()` is inline in ai-chat (65 lines, not reusable) | Shared `_shared/anthropic.ts` utility imported by 3 edge functions |
| MEDDPICC scoring produces generic checkbox output | Claude provides evidence-grounded reasoning per dimension with specific next steps |
| Cold emails are 200+ words without structure | Claude follows signal-value-ask structure under 120 words |
| Deal-review chat mode not connected | Deal-review mode loads specialized persona via `loadChatMode('deal-review')` and uses Claude Sonnet |
| No agency fragment injection for Claude actions | `loadFragment('crm-investor-fragment')` appended to system prompt for all Claude-powered actions |

## Checklists

### Production Ready

- [ ] `npm run build` passes
- [ ] `npm run test` passes (no regressions)
- [ ] No `console.log` in production code (use `console.error` for errors only)
- [ ] `callClaude` handles timeout, rate limit, overload, missing API key
- [ ] Existing Gemini-powered actions unaffected
- [ ] 3 edge functions deployed

### Regression

- [ ] Validator: Chat → Progress → Report renders (unrelated, sanity check)
- [ ] Investor pipeline: existing investor cards display correctly
- [ ] CRM: contact enrichment and email generation still work (Gemini actions)
- [ ] AI Chat: general mode, coach mode still work
- [ ] AI Chat: prioritize_tasks and generate_tasks still work (already on Claude)
