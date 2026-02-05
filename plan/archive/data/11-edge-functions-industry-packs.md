---
task_number: "07"
title: "Edge Functions — Industry & Prompt Packs"
category: "Supabase"
subcategory: "Edge Functions"
phase: 3
priority: "P1"
status: "Open"
percent_complete: 40
owner: "Backend Developer"
---

# Edge Functions: Industry & Prompt Packs

**Purpose:** Define how Supabase Edge Functions implement the Industry & Prompt Packs core—pack search, run, apply—and industry-expert flows. Align with official best practices so functions are secure, observable, and consistent.

**PRD:** [03-prd-industry-promptpacks.md](../03-prd-industry-promptpacks.md)  
**Roadmap:** [04-roadmap.md](../04-roadmap.md)  
**Agent strategy:** [04-agent-strategy.md](04-agent-strategy.md)  
**Best practices:** [`knowledge/supabase/best-practices-edge/`](../../../knowledge/supabase/best-practices-edge/) (index: [00-index.md](../../../knowledge/supabase/best-practices-edge/00-index.md))

---

## Purpose

**Why we define an edge-function strategy:** Industry & Prompt Packs run as **pack search → run step/pack → apply**. Those operations live in Edge Functions (e.g. `prompt-pack`, `industry-expert-agent`, `onboarding-agent`). A clear strategy ensures JWT handling, routing, error responses, cost tracking, and apply logic are consistent, auditable, and follow Supabase best practices.

---

## Goals

| Goal | What it means |
|------|----------------|
| **Pack search, run, apply** | Edge implements `prompt_pack_search(module, industry, stage)`, `run_step` / `run_pack`, and `apply(outputs_json, apply_to)` per PRD P3, P6. |
| **Industry-expert semantics** | `industry-expert-agent` (or equivalent) returns industry questions, terminology, and context; used by onboarding, validator, canvas, pitch. |
| **Security first** | JWT verification for authenticated flows; webhook signature verification for public endpoints (e.g. Stripe). Secrets in env, never in code. |
| **Consistent patterns** | CORS, error format, status codes, and cost logging match best-practices; shared `_shared/` utilities where possible. |
| **Observability** | Run history (pack, step, model, tokens, duration) and errors logged; traceable to org/user for cost and debugging. |

---

## Outcomes

- **Pack search** — Edge returns best pack + next step for `(module, industry, stage)`; used by orchestrator/frontend without “choose pack” UI.
- **Run step / run pack** — Edge executes prompt steps via Gemini (or Claude where specified); returns structured JSON per step schema.
- **Apply** — Edge writes to profile, canvas, slides, tasks, validation per `apply_to`; idempotent where possible; org/user-scoped.
- **Industry expert** — Edge serves industry questions and context for onboarding, validator, and other flows.
- **Existing agents** — `onboarding-agent`, `lean-canvas-agent`, `pitch-deck-agent`, `idea-validator` consume industry + prompt pack outputs; edge integration is explicit and documented.

---

## User stories and journeys

**Story 1 — Onboarding that fits my industry**  
Maria (FinTech) picks “FinTech — Payments” in the wizard. Frontend calls `industry-expert-agent` for questions, then `prompt-pack` (or onboarding-agent) for problem-sharpening. Edge runs the step, returns JSON, and apply writes to profile. No pack selection UI; edge implements search → run → apply.

**Story 2 — Validator that speaks my language**  
James (Healthcare) runs the idea validator. Frontend/orchestrator calls `prompt_pack_search` with module=validator, industry=Healthcare; edge returns validation pack. `run_step` / `run_pack` execute (Gemini); optional critic via separate flow. Edge `apply` writes to validation report. All via edge; no copy-paste.

**Story 3 — One answer, many places**  
After onboarding, “ICP and pain point” lives in profile. The same run’s output is applied to Lean Canvas and pitch deck problem slide via `apply(outputs_json, apply_to)` with `apply_to` in `[profile, canvas, slides]`. Edge apply logic maps JSON to the right tables.

**Story 4 — Pitch deck that gets my vertical**  
Maria generates a pitch deck. Pitch flow uses industry playbook; edge `run_pack` (pitch) + optional `generate-image`. Apply writes to `pitch_deck_slides` and related. Same edge patterns for James with Healthcare playbook.

**Story 5 — No “which pack?” in the main flow**  
Founders never choose a pack. Orchestrator/backend uses route + startup profile (industry, stage) to call `prompt_pack_search`. Edge returns pack + step; frontend calls `run_step` / `run_pack` and then `apply`. Edge enables this by exposing search, run, and apply as distinct operations.

---

## Flows (high level)

1. **Request lifecycle** — `OPTIONS` → CORS handled; `POST` → JWT verified → body parsed (`action` + payload) → route to handler → business logic → response (JSON + status). Errors return consistent `{ error, message?, code?, details? }` and proper HTTP status.
2. **Context → pack** — Caller sends `(module, industry, stage)`. Edge `prompt_pack_search` queries DB (or routing table), returns best pack + next step. Used by onboarding, validator, canvas, pitch, GTM.
3. **Run step / run pack** — Caller sends pack id, step id (or pack id for full run), plus context (form data, profile snapshot). Edge fills prompt template, calls Gemini (or Claude), parses structured JSON, returns it. Optionally uses tools (e.g. Google Search, URL context) when step config says so.
4. **Apply** — Caller sends `outputs_json` and `apply_to` (profile | canvas | slides | tasks | validation). Edge maps JSON to Supabase tables, performs upserts/inserts with `org_id` / `user_id` / `startup_id` from context. Idempotent where feasible.
5. **Log and trace** — Every pack run logs to `ai_runs` (or run history table): pack, step, model, tokens, duration, status. Errors logged with message and context for debugging.

---

## Use cases and real-world examples

| Use case | Caller | Edge functions / actions | Outcome |
|----------|--------|---------------------------|---------|
| **Onboarding step 1** | Frontend (wizard) | `industry-expert-agent` (questions), `prompt-pack` run_step (e.g. ideation) | Profile updated; step 2 gets industry-specific questions. |
| **Onboarding step 2–4** | Frontend | `prompt_pack_search` → run_step → apply | Profile, and later canvas/slides, updated from one run. |
| **Quick validate** | Validator UI | `prompt_pack_search`(module=validator, industry, stage) → run_pack → apply(validation) | Scorecard and report in validation; industry-aware language. |
| **Generate pitch deck** | Pitch flow | `prompt-pack` run_pack (pitch) + industry playbook; `generate-image` for visuals; apply(slides) | Deck with industry-appropriate slides and imagery. |
| **Fill canvas UVP** | Canvas UI | `prompt_pack_search`(canvas) → run_step (UVP) → apply(canvas) | UVP and suggested channels filled without copy-paste. |
| **Admin adds industry** | Admin/ops | Seed + schema only; no edge in the loop. | New industry questions/playbooks available; edge search uses them. |

---

## Logic (implementation anchors)

### Routing and entrypoint

- **Single function, action-based routing** — One handler per operation (e.g. `prompt-pack`): `action` in body → `search` | `run_step` | `run_pack` | `apply`. Reduces cold starts; shared auth, CORS, error handling. *See* [05-routing-patterns.md](../../../knowledge/supabase/best-practices-edge/05-routing-patterns.md).
- **CORS** — Handle `OPTIONS`; return `Access-Control-Allow-*` headers on all responses. Use allowlist in production. *See* [02-security-authentication.md](../../../knowledge/supabase/best-practices-edge/02-security-authentication.md).

### Security and auth

- **JWT** — Verify for authenticated routes (pack search, run, apply, industry-expert). Use Supabase client `getUser` with `Authorization` header, or manual verify (e.g. jose) per best practices. Reject 401 when missing/invalid.
- **Secrets** — `GEMINI_API_KEY`, etc. via `Deno.env.get(...)`; never hardcode or log. Set in Dashboard / CLI. *See* [02-security-authentication.md](../../../knowledge/supabase/best-practices-edge/02-security-authentication.md).
- **Keys** — User-facing ops: anon key + RLS. Admin/system (e.g. `ai_runs`, internal apply): service role key server-side only. *See* [02-security-authentication.md](../../../knowledge/supabase/best-practices-edge/02-security-authentication.md).
- **Multi-tenant** — Filter by `org_id` (and `user_id` / `startup_id` where relevant). Apply and run history scoped to tenant.

### Pack search

- **Input** — `{ module, industry?, stage? }`. Module ∈ onboarding | validator | canvas | pitch | gtm | etc.
- **Logic** — Query `prompt_packs` (and steps) by category, `industry_tags`, `stage_tags`; use routing table (context → pack) from Phase 2. Return `{ pack_id, pack_slug, next_step_id?, steps? }`.
- **DB** — Prefer indexed lookups; optional DB helper (e.g. `get_pack_for_context`).

### Run step / run pack

- **Input** — `pack_id`, `step_id` (or omit for full pack), `context` (form data, profile snapshot, industry, stage).
- **Logic** — Load step(s) and prompt template; fill with context; call Gemini (or Claude) with structured-output schema; parse JSON; return `{ outputs, model, tokens?, duration_ms? }`.
- **AI** — Use Gemini for most steps (speed, structured output, optional search/URL context). Claude for critic/deep review when specified. *See* [09-ai-integration.md](../../../knowledge/supabase/best-practices-edge/09-ai-integration.md), [14-ai-agents.md](../../../knowledge/supabase/best-practices-edge/14-ai-agents.md).

### Apply

- **Input** — `outputs_json`, `apply_to` ∈ { profile, canvas, slides, tasks, validation }, plus `org_id`, `user_id`, `startup_id` as applicable.
- **Logic** — Map JSON fields to target tables (e.g. profile ↔ `profiles`; canvas ↔ `lean_canvases` / sections; slides ↔ `pitch_deck_slides`; tasks ↔ `tasks`; validation ↔ validation report table). Upsert/insert with tenant IDs. Idempotent where possible.
- **Errors** — Validate `apply_to` and required IDs; return 400 on bad input, 404 if target missing, 500 on DB errors.

### Error handling and status codes

- **Format** — `{ error, message?, code?, details? }`. Use consistent helpers (e.g. `badRequest`, `unauthorized`, `notFound`, `serverError`). *See* [04-error-handling.md](../../../knowledge/supabase/best-practices-edge/04-error-handling.md).
- **Codes** — 200 OK, 201 Created; 400 Bad Request (validation, unknown action); 401 Unauthorized (JWT); 403 Forbidden; 404 Not Found; 409 Conflict; 500 Internal Server Error; 502/503 for upstream issues.

### Cost and run history

- **Log every pack run** — `ai_runs` (or run history): `user_id`, `org_id`, `startup_id?`, `agent_name`, `action`, `model`, `input_tokens`, `output_tokens`, `cost_usd`, `duration_ms`, `status`, `error_message?`. Use service-role client for inserts. *See* [09-ai-integration.md](../../../knowledge/supabase/best-practices-edge/09-ai-integration.md).

### Project layout and deploy

- **Layout** — One directory per function (`prompt-pack`, `industry-expert-agent`, etc.); shared utilities in `_shared/` (cors, jwt, errors, types). Per-function `deno.json`; no cross-function imports. *See* [01-architecture-setup.md](../../../knowledge/supabase/best-practices-edge/01-architecture-setup.md).
- **Deploy** — `supabase functions deploy <name>`; ensure secrets and `verify_jwt` (or equivalent) set per function. *See* [10-deployment.md](../../../knowledge/supabase/best-practices-edge/10-deployment.md).

---

## Principles (no code)

- **Single source of truth for edge behavior** — This doc and the best-practices guides. Implementations (e.g. `prompt-pack`, `industry-expert-agent`) follow them so security, routing, errors, and logging stay consistent.
- **Search, run, apply are distinct** — Clear boundaries and APIs; frontend/orchestrator composes them. No overloaded “do everything” single action.
- **Industry and stage are first-class** — Pack search and industry-expert always accept and use `industry` and `stage` when provided.
- **Observable and safe** — Log runs and errors; never expose secrets or service role key; validate inputs and scope apply by org/user/startup.

---

## References

- **PRD:** [03-prd-industry-promptpacks.md](../03-prd-industry-promptpacks.md) — P3 edge search/run/apply; P5 routing; P6 apply.
- **Roadmap:** [04-roadmap.md](../04-roadmap.md) — Phase 3 prompt pack implementation; Phase 4 integration.
- **Agent strategy:** [04-agent-strategy.md](04-agent-strategy.md) — Orchestrator, pack runner, industry expert, apply.
- **Schema / edge audit:** [02-supabase-schema.md](../02-supabase-schema.md) — Tables, deployed edge functions, migrations.
- **Best practices index:** [knowledge/supabase/best-practices-edge/00-index.md](../../../knowledge/supabase/best-practices-edge/00-index.md).
- **Key best-practice docs:**
  - [01-architecture-setup.md](../../../knowledge/supabase/best-practices-edge/01-architecture-setup.md) — Structure, Deno, layout, cold starts.
  - [02-security-authentication.md](../../../knowledge/supabase/best-practices-edge/02-security-authentication.md) — JWT, secrets, CORS, multi-tenant.
  - [04-error-handling.md](../../../knowledge/supabase/best-practices-edge/04-error-handling.md) — Status codes, error format, client handling.
  - [05-routing-patterns.md](../../../knowledge/supabase/best-practices-edge/05-routing-patterns.md) — Action-based routing, Hono, single-function patterns.
  - [09-ai-integration.md](../../../knowledge/supabase/best-practices-edge/09-ai-integration.md) — Gemini, structured output, cost tracking.
  - [14-ai-agents.md](../../../knowledge/supabase/best-practices-edge/14-ai-agents.md) — Agent layout, registry, orchestration.
