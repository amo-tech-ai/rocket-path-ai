---
task_number: PL-06
title: Prompt Pack Frontend (Catalog, Run, Apply)
category: Frontend
subcategory: Prompt Library
phase: 2
priority: P1
status: Not Started
percent_complete: 0
owner: Full Stack Developer
depends_on: PL-02 (Edge Functions), PL-03 (Seed Prompt Packs)
blocking: false
---

# PL-06: Prompt Pack Frontend (Catalog, Run, Apply)

## Current State

**Backend:** ✅ DONE
- Combined edge function `prompt-pack` at `POST /functions/v1/prompt-pack`
- Actions: `search` | `get` | `list` (catalog, no JWT) | `run_step` | `run_pack` | `apply` | `preview` (JWT required)
- Seed data in `prompt_packs`, `prompt_pack_steps`, `prompt_runs`

**Frontend:** ❌ MISSING
- No hooks or pages for prompt packs
- No catalog UI, run wizard, or apply/preview flow

## Goal

Build the frontend so users can discover prompt packs (by module/industry/stage), run a pack (single step or full pack) with startup context, and apply or preview outputs to profile, canvas, slides, tasks, and validation.

**Rationale:** Prompt packs power ideation, validation, canvas, pitch, and GTM flows; the UI must expose search → run → apply in a clear 3-panel or wizard pattern.

**User Stories:**
- As a founder I can search prompt packs by module (e.g. validation, canvas) and see the best match + next step.
- As a founder I can run a pack (or a single step) for my startup and see outputs and cost/latency.
- As a founder I can preview what would be applied (profile, canvas, slides, tasks) then apply with one click.

**3-panel layout:**
- **Left = Context:** Selected pack, steps list, startup summary.
- **Main = Work:** Run step/pack, view outputs, preview apply.
- **Right = Intelligence:** Suggestions, cost/tokens, validation feedback.

**Wiring:** One edge function `prompt-pack`; frontend calls with `action` + params. Catalog actions (search, get, list) do not require Authorization; run/apply require session and `Authorization: Bearer <access_token>`.

**Dependencies:** `supabase/functions/prompt-pack`, `prompt_packs` / `prompt_pack_steps` / `prompt_runs` tables, existing DashboardLayout and auth.

## Implementation

### 1. Add hook `usePromptPack`

Create `src/hooks/usePromptPack.ts`. Invoke `prompt-pack` with `body: { action, ...params }`. For run/apply, pass `Authorization: Bearer ${session.access_token}` (reuse pattern from `useDocumentsAgent.ts` / `useEventAgent.ts`). Expose:
- `searchPacks(params: { module?, industry?, stage?, startup_id?, limit? })` → search
- `getPack(pack_id | slug)` → get
- `listPacks(limit?)` → list
- `runStep({ startup_id, pack_id, step_id, context?, previous_outputs? })` → run_step
- `runPack({ startup_id, pack_id, context?, stop_on_error? })` → run_pack
- `applyOutputs({ startup_id, run_id?, outputs_json, apply_to?, action: 'apply'|'preview' })` → apply/preview

Return `{ data, error }` and loading state; parse `data.success`, `data.pack`, `data.results`, `data.applied`, etc. per action.

### 2. Catalog UI (search / get / list)

- **Option A – Dedicated page:** Add route `/prompt-packs` and page that lists packs (list) or shows search filters (module, industry, stage) and results (search). Clicking a pack calls get(pack_id) and shows pack + steps in left panel.
- **Option B – Embed in dashboard:** Add a “Prompt Packs” card or sidebar section that calls list() or search({ module: currentModule }), and a modal/drawer for pack detail and “Run” CTA.

Use `usePromptPack().searchPacks` / `getPack` / `listPacks` (no auth required for these). Display pack title, description, category, stage_tags, industry_tags, step count.

### 3. Run flow (step or pack)

- From catalog, “Run step” or “Run full pack” with current `startup_id` (from context or URL).
- Call `runStep` or `runPack` with optional `context` (e.g. idea_description, industry). Show loading; on success show `results` (and for run_pack: `final_output`, `meta.total_cost_usd`, `meta.total_latency_ms`).
- Main panel: show current step purpose, then outputs (JSON or formatted). Allow “Apply” or “Preview apply” from here.

### 4. Apply / Preview flow

- From run result, “Preview apply” → call apply with `action: 'preview'` and same `outputs_json` and `apply_to`; show which tables would be updated and counts.
- “Apply” → call apply with `action: 'apply'`; show success and `applied` summary (tables_updated, total_records). Optionally redirect to profile/canvas/slides/tasks or refresh local state.

### 5. Integration points

- **Onboarding / Validator:** If a prompt pack slug is used for “idea validation”, wire “Run pack” to that pack and then “Apply” to validation_reports and startup readiness.
- **Dashboard:** Show “Suggested packs” via search({ module: 'validation' }) or by stage; quick “Run” from dashboard card.
- **Lean Canvas / Pitch:** Allow “Run pack” for canvas or pitch and apply to lean_canvases or pitch_deck_slides.

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/hooks/usePromptPack.ts` | Create – invoke `prompt-pack`, expose search/get/list/runStep/runPack/applyOutputs |
| `src/pages/PromptPacks.tsx` | Create – catalog list + search + pack detail (or embed in dashboard) |
| `src/pages/PromptPackRun.tsx` | Create – run step/pack UI, show results, Apply/Preview CTAs |
| `src/App.tsx` or router config | Add routes e.g. `/prompt-packs`, `/prompt-packs/run?pack_id=...` |
| `src/components/prompt-pack/PackCard.tsx` | Optional – card for one pack (title, description, step count, Run button) |
| `src/components/prompt-pack/ApplyPreviewModal.tsx` | Optional – modal for preview result and Apply confirm |

## Acceptance Criteria

- [ ] User can list and search prompt packs (by module/industry/stage) without logging in (catalog).
- [ ] User can get a single pack by id or slug and see steps.
- [ ] Logged-in user can run a single step or full pack for a startup; results and cost/latency are shown.
- [ ] User can preview apply (see which tables and counts) then apply; success summary and optional navigation.
- [ ] Run/apply calls use JWT; catalog calls work without JWT.
- [ ] Errors from edge function are surfaced (e.g. 401, 400, 500).

## Tech Stack

**AI Model:** Backend only (Gemini/Claude in `prompt-pack`); frontend just displays outputs.

**API/SDK:**
- [x] Supabase Edge Functions (invoke `prompt-pack`)
- [ ] Supabase Realtime (optional, for run status later)

**Edge Function Pattern:**
```typescript
const { data, error } = await supabase.functions.invoke('prompt-pack', {
  body: { action: 'search', module: 'validation', limit: 5 },
});
// For run/apply:
const { data, error } = await supabase.functions.invoke('prompt-pack', {
  body: { action: 'run_pack', startup_id, pack_id, context: {} },
  headers: { Authorization: `Bearer ${session.access_token}` },
});
```

## Estimated Effort

- **Time:** 12–18 hours
- **Complexity:** Medium–High (catalog + run + apply flows, optional 3-panel layout)
