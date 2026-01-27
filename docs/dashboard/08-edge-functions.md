# Prompt 08 — Edge Functions Guide

> **Phase:** Foundation | **Priority:** P0 | **Overall:** 85%
> **No code — function catalog, action specs, and deployment patterns only**

---

## Edge Function Catalog

| # | Function | Actions | AI Model | Auth | Status |
|---|----------|---------|----------|------|--------|
| 1 | `ai-chat` | 5+ | Gemini Flash + Claude Sonnet/Opus | JWT | Deployed |
| 2 | `onboarding-agent` | 12 | Gemini Flash + URL Context + Google Search | JWT | Deployed |
| 3 | `lean-canvas-agent` | 5 | Gemini Flash | JWT | Deployed |
| 4 | `pitch-deck-agent` | 7 | Gemini Pro | JWT | Deployed |
| 5 | `crm-agent` | 15 | Gemini Flash + Google Search | JWT | Deployed |
| 6 | `investor-agent` | 12 | Gemini Flash + Google Search | JWT | Deployed |
| 7 | `documents-agent` | 6 | Gemini Flash | JWT | Deployed |
| 8 | `event-agent` | 8 | Gemini Flash | JWT | Deployed |
| 9 | `chatbot-agent` | 22 | Gemini Flash + Thinking | JWT | Deployed |
| 10 | `whatsapp-agent` | 6 | None (API relay) | JWT + webhook | Deployed |
| 11 | `generate-image` | 4 | Gemini Image | JWT | Deployed |
| 12 | `health` | 1 | None | Public | Deployed |
| 13 | `auth-check` | 1 | None | JWT | Deployed |
| 14 | `stripe-webhook` | 7 | None | Stripe signature | Deployed |

---

## Shared Modules

Every edge function imports from `supabase/functions/_shared/`:

| Module | Exports | Purpose |
|--------|---------|---------|
| `auth.ts` | `verifyAuth()`, `AuthContext` | JWT verification, returns user + org + startup + supabase client |
| `cors.ts` | `getCorsHeaders()`, `handleCors()` | CORS headers for browser requests |
| `errors.ts` | `errorResponse()`, `jsonResponse()`, `ErrorCodes` | Standard error/success responses |
| `gemini.ts` | `generateStructuredContent()`, `GeminiModels`, `Type` | Gemini API with structured output |
| `logging.ts` | `createLogger()` | Structured logging with agent name prefix |
| `validators.ts` | `validateRequired()`, `validateUuid()`, `validateUrl()`, `validateEmail()` | Input validation |
| `supabase.ts` | `createClient()` | Authenticated Supabase client for DB queries |

---

## Action Routing Pattern

Every edge function follows the same entry point pattern:

1. Handle CORS preflight (OPTIONS request)
2. Verify JWT via `verifyAuth(req)`
3. Parse request body: `{ action, ...payload }`
4. Switch on `action` string to route to handler
5. Handler executes business logic + AI call
6. Return JSON response via `jsonResponse()` or `errorResponse()`
7. Catch-all error handler with structured logging

---

## Agent Action Reference

### onboarding-agent (12 actions)

| Action | Input | Output | Target |
|--------|-------|--------|--------|
| `enrich_url` | URL | Company data | wizard_extractions |
| `enrich_context` | Description, market | Competitors, trends | wizard_extractions |
| `enrich_founder` | LinkedIn URL | Founder profile | wizard_extractions |
| `calculate_readiness` | All extracted data | Score 0-100 | wizard_sessions |
| `get_questions` | Topic, context | 1-2 questions | UI |
| `process_answer` | Topic, answer | Signals, quality | wizard_extractions |
| `calculate_score` | All data | Final score | wizard_sessions |
| `generate_summary` | All data | Narrative summary | wizard_sessions |
| `complete_wizard` | Session data | Org + startup + profile | DB |

### lean-canvas-agent (5 actions)

| Action | Input | Output | Target |
|--------|-------|--------|--------|
| `prefill_canvas` | Startup data | 9 box contents | documents |
| `suggest_box` | Box key, context | 3 suggestions | UI |
| `validate_canvas` | All 9 boxes | Per-box scores | UI |
| `save_canvas` | Canvas data | Saved document | documents |
| `load_canvas` | Startup ID | Canvas data | UI |

### pitch-deck-agent (7 actions)

| Action | Input | Output | Target |
|--------|-------|--------|--------|
| `save_wizard_step` | Step number, data | Updated deck | pitch_decks |
| `resume_wizard` | Deck ID | Wizard state | UI |
| `generate_deck` | Template, data | 12 slides | pitch_deck_slides |
| `get_deck` | Deck ID | Deck + slides | UI |
| `update_slide` | Slide ID, content | Updated slide | pitch_deck_slides |
| `get_signal_strength` | Deck ID | Score + breakdown | UI |
| `export_deck` | Deck ID, format | PDF/PPTX URL | pitch_decks |

### crm-agent (15 actions)

| Action | Input | Output | Target |
|--------|-------|--------|--------|
| `enrich_contact` | LinkedIn URL or name | Full profile | contacts |
| `score_lead` | Contact data | Score 0-100 | contacts |
| `score_deal` | Deal + contact | Probability 0-100 | deals |
| `analyze_pipeline` | All deals | Bottlenecks, forecast | UI |
| `generate_email` | Contact + startup | Email draft | UI |
| `detect_duplicate` | Contact data | Match list | UI |

### investor-agent (12 actions)

| Action | Input | Output | Target |
|--------|-------|--------|--------|
| `discover_investors` | Startup profile | Ranked list | investors |
| `analyze_investor_fit` | Investor + startup | Fit score breakdown | investors |
| `find_warm_paths` | Investor profile | Mutual connections | UI |
| `generate_outreach` | Investor + startup | Personalized email | UI |

### documents-agent (6 actions)

| Action | Input | Output | Target |
|--------|-------|--------|--------|
| `generate_document` | Template type, data | Document content | documents |
| `analyze_document` | Document content | Quality score | UI |
| `search_documents` | Query string | Ranked results | UI |

### chatbot-agent (key actions)

| Action | Input | Output | Target |
|--------|-------|--------|--------|
| `chat_message` | Message, context | Response | chat_messages |
| `get_benchmarks` | Industry, metric | Benchmarks | chat_messages |
| `route_to_dashboard` | Request | Module link | UI |
| `detect_industry` | First message | Industry, persona | chat_sessions |

---

## Deployment

| Command | Purpose |
|---------|---------|
| `supabase functions serve <name>` | Local development with hot reload |
| `supabase functions deploy <name>` | Deploy single function to production |
| `supabase functions deploy` | Deploy all functions |

### Environment Variables (Edge Functions)

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Gemini 3 API access |
| `ANTHROPIC_API_KEY` | Claude API access |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for system operations |

---

## Smart AI Edge Functions (Planned)

The Smart AI system requires 3 new edge functions (see `03.1-smart-ai-system.md`):

| Function | Actions | Purpose | Status |
|----------|---------|---------|--------|
| `ai-orchestrator` | 6+ | Coordinate multi-step agent workflows, assign tasks, handle failures | Planned |
| `ai-qa-validate` | 4+ | Automated acceptance criteria checking, fix loop, escalation | Planned |
| `ai-spec-create` | 6+ | Natural language → structured spec pipeline (6 phases) | Planned |

These functions follow the same shared module pattern as existing functions and add 6 new database tables (`ai_tasks`, `ai_specs`, `ai_sessions`, `ai_qa_results`, `ai_patterns`, `ai_changelogs`).

---

## Acceptance Criteria

- All edge functions use shared modules (no inline auth, CORS, or AI clients)
- All functions verify JWT before processing
- All AI calls log to `ai_runs` table
- All inputs validated before processing
- CORS headers set for browser requests
- Error responses use standard `ErrorCodes` enum
- Functions deploy without errors via `supabase functions deploy`
