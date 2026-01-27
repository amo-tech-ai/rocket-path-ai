# Prompt 06 — AI Integration Architecture

> **Phase:** Foundation | **Priority:** P0 | **Overall:** 80%
> **No code — AI routing, model selection, prompt patterns, and cost strategy only**

---

## AI Provider Strategy

| Provider | Models | Strengths | Used For |
|----------|--------|-----------|----------|
| Gemini 3 | Flash, Pro, Flash (Thinking) | Speed, structured output, URL context, Google Search, image gen | 90% of AI calls: enrichment, scoring, suggestions, chat, generation |
| Claude | Sonnet 4.5, Opus 4.5, Haiku 4.5 | Reasoning, prioritization, complex analysis | 10% of AI calls: task ranking, strategic analysis, orchestration |

---

## Model Selection Matrix

| Use Case | Model | Why |
|----------|-------|-----|
| Data enrichment (URL, LinkedIn) | Gemini Flash + URL Context | Native URL reading, fast, cheap |
| Scoring (contacts, deals, investors) | Gemini Flash + Structured Output | Consistent JSON, sub-2s response |
| Suggestions (canvas boxes, slides) | Gemini Flash | Fast iteration, good quality |
| Validation (canvas, documents) | Gemini Flash | Structured feedback output |
| Chat (general Q&A) | Gemini Flash | Speed for conversational flow |
| Strategic analysis (benchmarks, pivots) | Gemini Flash + Thinking | Extended reasoning with thinking tokens |
| Deck generation (12 slides) | Gemini Pro | Higher quality for long-form content |
| Task prioritization | Claude Sonnet | Superior reasoning about tradeoffs |
| Task generation | Claude Haiku | Fast + good quality for lists |
| Complex multi-factor analysis | Claude Opus | Deepest reasoning, handles ambiguity |
| Image generation | Gemini Image | Native capability |

---

## Gemini 3 Features

| Feature | Description | Agents Using It |
|---------|-------------|-----------------|
| URL Context | Pass a URL, Gemini reads and extracts structured data | onboarding-agent, crm-agent, investor-agent |
| Google Search Grounding | Real-time web search as AI context with citations | onboarding-agent, crm-agent, investor-agent, event-agent |
| Structured Output | JSON schema-constrained responses, eliminates parsing | All 8 AI agents |
| Thinking Mode | Extended reasoning before responding | chatbot-agent (strategic questions) |
| Function Calling | AI calls dashboard tools within conversation | chatbot-agent (create_task, navigate_to) |
| Image Generation | Create images from text prompts | generate-image |

---

## Prompt Architecture

### System Prompt Pattern

Every AI call follows this structure:

1. **Role**: Who the AI is (e.g., "You are a startup advisor specializing in SaaS")
2. **Context**: Startup data, industry pack, user history
3. **Task**: What to do (e.g., "Score this contact's fit")
4. **Constraints**: Output format, length limits, forbidden patterns
5. **Schema**: JSON schema for structured output

### Industry Pack Integration

All AI prompts can be augmented with industry-specific context from `industry_packs` table:

| Pack Data | Injected Into Prompt As |
|-----------|------------------------|
| `terminology` (JSONB) | "Use these industry terms: {terms}" |
| `benchmarks` (JSONB) | "Reference these benchmarks: {benchmarks}" |
| `competitive_intel` (JSONB) | "Consider this competitive landscape: {intel}" |
| `advisor_persona` (TEXT) | Replaces generic system prompt role |

Active packs: fintech, healthcare, marketplace, saas, generic (fallback).

---

## Shared Module Architecture

All edge functions use these shared modules (no inline implementations):

| Module | Path | Purpose |
|--------|------|---------|
| auth | `_shared/auth.ts` | JWT verification, profile + org resolution |
| cors | `_shared/cors.ts` | CORS headers for browser requests |
| errors | `_shared/errors.ts` | Standard error responses with error codes |
| gemini | `_shared/gemini.ts` | Gemini API wrapper with structured output |
| logging | `_shared/logging.ts` | Structured logging per agent |
| validators | `_shared/validators.ts` | Input validation (UUID, required fields, URL, email) |
| supabase | `_shared/supabase.ts` | Authenticated Supabase client |

---

## Cost Management

### Per-Agent Budgets

| Agent | Daily Budget | Avg Cost/Call | Model |
|-------|-------------|---------------|-------|
| onboarding-agent | $5.00 | $0.002 | Gemini Flash |
| lean-canvas-agent | $3.00 | $0.001 | Gemini Flash |
| pitch-deck-agent | $10.00 | $0.008 | Gemini Pro |
| crm-agent | $5.00 | $0.002 | Gemini Flash |
| investor-agent | $5.00 | $0.002 | Gemini Flash |
| documents-agent | $3.00 | $0.002 | Gemini Flash |
| chatbot-agent | $8.00 | $0.003 | Gemini Flash |
| event-agent | $3.00 | $0.002 | Gemini Flash |
| ai-chat (Claude) | $15.00 | $0.01-$0.08 | Sonnet/Opus |

### Cost Tracking

- Every AI call logs to `ai_runs` table: agent_name, model, tokens in/out, cost_usd, latency_ms, status
- Dashboard widget shows daily/monthly AI spend per agent
- Rate limiting per user prevents abuse (configurable per agent)

---

## AI Data Flow

| Step | What Happens |
|------|-------------|
| 1. User triggers action | Frontend calls edge function via `supabase.functions.invoke()` |
| 2. Auth + validation | Edge function verifies JWT, validates input |
| 3. Context gathering | Query startup profile, relevant records, industry pack |
| 4. Prompt assembly | System prompt + context + user input + output schema |
| 5. AI call | Gemini or Claude API with structured output |
| 6. Response processing | Parse JSON, validate against schema |
| 7. Storage | Write results to target table, log to `ai_runs` |
| 8. Return | JSON response to frontend |

---

## Smart AI Integration

The AI architecture extends into the Smart AI autonomous development layer (see `03.1-smart-ai-system.md`):

| Component | How AI Architecture Applies |
|-----------|---------------------------|
| Agent orchestration | Orchestrator routes tasks to Planner → Coder → QA agents using the same edge function action routing pattern |
| Spec pipeline | Spec Writer and Planner agents call Gemini/Claude via shared modules |
| QA validation | QA Reviewer uses structured output to validate acceptance criteria |
| Cost tracking | All agent sessions log to `ai_runs` + `ai_sessions` tables |
| Pattern memory | Agents discover and store patterns during implementation |

Agent models: Coder + Planner + Spec Writer use Sonnet 4.5; QA Reviewer + Fixer use Opus 4.5 for deeper reasoning.

---

## Acceptance Criteria

- All AI calls use shared modules (never inline Gemini/Claude clients)
- All AI calls log to `ai_runs` with tokens, cost, and latency
- Industry packs inject context into all prompts when available
- Structured output schemas are defined for every AI action
- Rate limiting prevents runaway costs
- Gemini used for speed-sensitive actions, Claude for reasoning-heavy actions
- Every agent has a configured daily budget
