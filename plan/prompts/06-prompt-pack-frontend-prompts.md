# Prompt Pack Frontend – Implementation Prompts

Ready-to-use prompts for implementing the prompt pack UI. Use with task `06-prompt-pack-frontend.md`.

**Principle:** Prompt packs are **agent-driven**. The agent (or backend) invokes the right pack from context (onboarding, validator, canvas, pitch, GTM) — see **`101-agent-prompt-pack-routing.md`**. The catalog UI is optional (browse/override only).

---

## 0. Agent routing (when to call the hook)

**Prompt:**

```
Implement systematic prompt pack invocation from context. When the user is in a given screen/step, call usePromptPack as follows:

- Onboarding Step 1 (after description save): searchPacks({ module: 'onboarding' }), then run_step or run_pack for ideation pack; apply outputs to startup profile.
- Onboarding Step 2: same with validation/ideation focus; apply to profile + optional validation tasks.
- Onboarding Step 3: founder-fit pack; apply to profile.
- Onboarding Step 4 (review): pitch/ideation pack (e.g. One Sentence Pitch); show in summary.
- Validator (Quick/Deep): searchPacks({ module: 'validation', industry, stage }), run best pack, apply to validation_reports and tasks.
- Lean Canvas (empty UVP or Revenue): searchPacks({ module: 'canvas' }), run relevant step, apply to lean_canvases.
- Pitch Deck (generate deck/slide): searchPacks({ module: 'pitch' }), run step, apply to pitch_deck_slides.
- GTM / Documents: searchPacks({ module: 'gtm' }), run step, apply to documents/tasks.

Reference the full routing table in tasks/01-prompt-library/101-agent-prompt-pack-routing.md. No UI for "choose a pack" in the main flow — the agent or module wiring does it.
```

---

## 1. Hook: usePromptPack

**Prompt:**

```
Create src/hooks/usePromptPack.ts that invokes the edge function 'prompt-pack' for all actions.

- Use supabase.functions.invoke('prompt-pack', { body: { action, ...params }, headers? }).
- For actions search, get, list: no Authorization header (catalog is public).
- For run_step, run_pack, apply, preview: get session via useAuth or supabase.auth.getSession(), pass Authorization: Bearer ${session.access_token}.

Expose:
- searchPacks({ module?, industry?, stage?, startup_id?, limit? }) → action: 'search'
- getPack({ pack_id? | slug? }) → action: 'get'
- listPacks({ limit? }) → action: 'list'
- runStep({ startup_id, pack_id, step_id, context?, previous_outputs? }) → action: 'run_step'
- runPack({ startup_id, pack_id, context?, stop_on_error? }) → action: 'run_pack'
- applyOutputs({ startup_id, run_id?, outputs_json, apply_to?, action: 'apply'|'preview' }) → action from param

Return { data, error, isLoading } per call. Follow the pattern in src/hooks/useDocumentsAgent.ts or useEventAgent.ts for session and invoke.
```

---

## 2. Catalog page (optional — browse/override)

**Prompt:**

```
Add an optional Prompt Packs catalog at route /prompt-packs for power users who want to browse or run a pack manually (override). This is NOT the main activation path — the agent invokes packs from context per 101-agent-prompt-pack-routing.md.

- Use usePromptPack().listPacks() or searchPacks({ module, industry, stage }) with optional filters.
- Display each pack as a card: title, description, category, stage_tags, industry_tags, step count. Click card → getPack(pack_id), show steps; "Run this pack" → run flow with pack_id.
- Use existing DashboardLayout; shadcn Card, Badge, Button. Handle loading and error states.
```

---

## 3. Run flow: run step or run pack

**Prompt:**

```
Create the Prompt Pack run flow (page or modal) for running a single step or full pack.

- Route or state: pack_id, startup_id (from context/params). Optionally step_id for single step.
- Use usePromptPack().runStep({ startup_id, pack_id, step_id, ... }) or runPack({ startup_id, pack_id, context?, stop_on_error? }).
- Show loading during run; on success display results (step outputs, and for run_pack: final_output, meta.total_cost_usd, meta.total_latency_ms).
- If run_pack, show completed_steps / total_steps and list of step results. Add "Preview apply" and "Apply" buttons that pass the last step's outputs (or final_output) to the apply flow.
- Handle errors (e.g. Step not found, Execution failed) with user-facing messages.
```

---

## 4. Apply / Preview flow

**Prompt:**

```
Implement apply and preview for prompt pack outputs.

- Inputs: startup_id, outputs_json (from run result: final_output or last step outputs), apply_to (optional, e.g. ['profile','canvas','slides','tasks','score']), and action 'apply' | 'preview'.
- Call usePromptPack().applyOutputs({ startup_id, outputs_json, apply_to, action: 'preview' }) first; show which tables would be updated and counts (applied[].table, applied[].count).
- "Apply" button then call applyOutputs(..., action: 'apply'); on success show summary (tables_updated, total_records) and optionally link to profile/canvas/slides/tasks or refresh data.
- Use existing UI patterns (modal, toast) for success/error. Reference task 06-prompt-pack-frontend.md for API shape.
```

---

## 5. Dashboard (optional — no activation required)

**Prompt:**

```
Optional: Add a small "Prompt Packs" or "What ran" section to the dashboard for transparency/override only.

- Do NOT require users to "activate" a pack from here. Packs are invoked by the agent from context (onboarding, validator, canvas, pitch).
- Option A: Show "Last pack used: SaaS Validation v3" with link to catalog for override.
- Option B: Show 2–3 "Suggested packs" cards with "Run" for manual run; keep compact. Reuse PackCard if built.
```

---

## Quick reference: prompt-pack API

| Action    | Body keys (required)        | Auth  | Returns                    |
|-----------|-----------------------------|-------|----------------------------|
| search    | module?, industry?, stage?, startup_id?, limit? | No  | pack, next_step, alternatives, meta |
| get       | pack_id? or slug?           | No    | pack, step_count           |
| list      | limit?                      | No    | packs, by_category, total |
| run_step  | startup_id, pack_id, step_id | Yes   | success, outputs, tokens, cost_usd, latency_ms |
| run_pack  | startup_id, pack_id        | Yes   | results, final_output, meta |
| apply     | startup_id, outputs_json, apply_to? | Yes | applied, summary           |
| preview   | startup_id, outputs_json, apply_to? | Yes | applied (no DB write), summary |
