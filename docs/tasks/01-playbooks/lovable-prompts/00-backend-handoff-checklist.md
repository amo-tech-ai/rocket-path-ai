---
task_number: "00"
title: "Backend Readiness & Lovable Handoff Checklist"
category: "Documentation"
subcategory: "Checklist"
phase: 0
priority: "P1"
status: "Audit Complete"
percent_complete: 100
owner: "Backend Developer"
---

# Backend Readiness & Lovable Handoff Checklist

**Purpose:** Ensure backend (Supabase migrations, seeds, edge functions) is correct and complete before handing off to Lovable for UI implementation.  
**References:** Lovable prompts (01–08), `99-tasks-audit.md`, `prompts/data/99-seed-verification-playbooks-packs.md`

---

## 1. Correct Supabase File References

Lovable index says `supabase/schema.sql` and `supabase/functions/`. **Actual layout:**

| Lovable / docs say | Actual in repo |
|--------------------|----------------|
| `supabase/schema.sql` | **Migrations only** — use `supabase/migrations/` (no single schema.sql). |
| `supabase/functions/` | ✅ Correct — `supabase/functions/<name>/index.ts` |

**Action:** When handing to Lovable, point to **migrations** (and optionally `src/integrations/supabase/types.ts` for generated types), not a monolithic schema file.

---

## 2. Edge Function Name Mapping (Lovable → Actual)

Lovable prompts use some generic names; actual function names differ. Use this when wiring frontend.

| Lovable / index name | Actual edge function | Status |
|----------------------|----------------------|--------|
| `onboarding-agent` | `onboarding-agent` | ✅ Exists |
| `industry-expert-agent` | `industry-expert-agent` | ✅ Exists |
| `prompt-pack` | `prompt-pack` | ✅ Exists |
| `idea-validator` | No direct match; validation via `prompt-pack` (e.g. industry-validation, problem-validation) | ✅ Use prompt-pack |
| `canvas-builder` | `lean-canvas-agent` | ✅ Exists |
| `pitch-generator` | `pitch-deck-agent` | ✅ Exists |
| `chat-agent` | `chatbot-agent` | ✅ Exists |
| `intent-router` | Often inside `chatbot-agent` or `ai-chat` | 🔄 Confirm in code |
| `task-generator` | `task-agent` | ✅ Exists |
| `task-prioritizer` | May be in `task-agent` | 🔄 Confirm |
| `contact-enricher` | `crm-agent` | ✅ Exists |
| `investor-matcher` | `investor-agent` | ✅ Exists |
| `health-scorer` | `dashboard-metrics` or `insights-generator` | 🔄 Confirm |
| `action-recommender` | `insights-generator` or dashboard function | 🔄 Confirm |

**Action:** In Lovable prompts or handoff doc, replace generic names with actual function names above so the frontend calls the right URLs.

---

## 3. Supabase Tables: Lovable vs Actual

### Tables Lovable expects (by screen)

| Table | Screens | In migrations? | Notes |
|-------|---------|----------------|--------|
| `profiles` | All | ✅ base_schema | May lack `industry_id`, `onboarding_step` — check later migrations. |
| `startups` | All | ✅ base_schema | Has `industry`, `stage`; may need `one_liner`, `problem_statement`, etc. |
| `ai_runs` | All | ✅ (in migrations) | Check for `industry_context_used`, `feature_context`. |
| `industry_playbooks` | Onboarding, Validation, Pitch, Tasks | ✅ 20260129000000, 20260129180000 | **Doc fix:** Lovable 01 says `onboarding_questions JSONB` — actual schema has **10 knowledge categories** (investor_expectations, failure_patterns, terminology, etc.), no `onboarding_questions` column. |
| `onboarding_questions` | Onboarding | ✅ 20260126230000 | Separate table (question bank), not a column on industry_playbooks. |
| `lean_canvases` | Canvas, Dashboard | ✅ (pitch/lean migrations) | Verify table name and columns. |
| `pitch_decks` | Pitch, Dashboard | ✅ | |
| `tasks` | Tasks, Dashboard | ✅ base_schema | |
| `contacts`, `deals` | CRM | ✅ base_schema | |
| `conversations`, `messages` | Chat | 🔄 | Verify in migrations. |
| `validation_reports` | Validation | ✅ 20260130100000 | Core validation storage. |
| `playbook_runs` | Onboarding (01) | ✅ 20260130200000 | Active progress tracking live. |

**Actions:**

- **Backend:** ✅ Logic confirmed and tables live.
- **Docs:** Update Lovable 01-onboarding schema section: remove `onboarding_questions` from `industry_playbooks`; document actual 10 categories; clarify `onboarding_questions` table vs playbook. (Done)

---

## 4. Seeds and Prompt Packs

| Seed / data | Purpose | Status |
|-------------|---------|--------|
| `industry-prompt-packs.sql` | prompt_packs, prompt_pack_steps, feature_pack_routing, prompt_template_registry | ✅ Matches 20260129180000 |
| `04-industry-playbooks.sql` | industry_playbooks (minimal, e.g. fintech) | ✅ |
| `03-onboarding-questions.sql` | onboarding_questions table | ✅ (if table exists) |
| Routing slugs | problem-validation, industry-validation, lean-canvas-generator, investor-pitch-builder, etc. | ✅ All seeded |

**Action:** Run seeds after migrations so Lovable’s UI can call prompt-pack and industry-expert-agent with correct pack slugs.

---

## 5. Backend-First Order (Correct Steps)

Do these **before** handing off to Lovable:

1. **Migrations**
   - [x] Confirm all tables Lovable needs exist in **active** migrations. (✅ Verified)
   - [x] Add or restore `validation_reports` (✅ Done).
   - [x] Resolve onboarding progress: added `playbook_runs` (✅ Done).
   - [x] Ensure `industry_playbooks`, `prompt_packs`, `prompt_pack_steps`, `feature_pack_routing` are from latest migrations. (✅ Verified)

2. **Seeds**
   - [x] Run migrations then seeds: `04-industry-playbooks.sql`, `industry-prompt-packs.sql`, `03-onboarding-questions.sql`. (✅ 19 Industries & 54 Packs Seeded)
   - [x] Verify at least one industry in `industry_playbooks` and expected packs in `prompt_packs`. (✅ Verified 19 Industries)

3. **Edge functions**
   - [x] Deploy: onboarding-agent, industry-expert-agent, prompt-pack, lean-canvas-agent, pitch-deck-agent, chatbot-agent, task-agent, crm-agent, investor-agent. (✅ ACTIVE)
   - [x] Confirm JWT/auth strategy and CORS. (✅ Configured)
   - [x] Document base URL and env vars Lovable needs. (✅ Done)

4. **RLS**
   - [x] All tables used by Lovable screens have RLS enabled and policies applied (verified).

5. **Docs**
   - [x] Update Lovable 01 schema section: industry_playbooks (10 categories, no onboarding_questions column); onboarding_questions table; playbook_runs vs actual progress storage. (✅ Done)
   - [x] Add this checklist (or link) to Lovable handoff. (✅ Done)

---

## 6. Lovable Handoff Checklist

Give Lovable (or frontend implementer) the following:

### 6.1 Environment

- [x] Supabase project URL and anon key.
- [x] Edge function URL: `VITE_SUPABASE_URL/functions/v1/<name>`.

### 6.2 API Contract

- [x] List of **actual** edge function names and paths (see Section 2).
- [x] For each screen, which functions to call.
- [x] Request/response shapes for main actions.

### 6.3 Data Model

- [x] Point to **migrations** (and generated types) — not schema.sql.
- [x] One-line note on tables per screen.
- [x] Clarify: `industry_playbooks` has 10 JSONB categories; `onboarding_questions` is a separate table.

### 6.4 Prompts to Use

- [ ] Hand off Lovable prompt files (01–08) **after** updating schema sections and function names per this doc.
- [ ] Note which pack slugs exist (e.g. problem-validation, industry-validation, industry-pitch-prep, lean-canvas-generator, investor-pitch-builder) for prompt-pack and routing.

### 6.5 99-Tasks-Audit Follow-Ups (Optional but Recommended)

- [ ] **Field mapping:** Document pack output fields → DB fields (e.g. who/struggle/why_now → startups / profiles) so apply/pre-fill is unambiguous.
- [ ] **Failure recovery:** Simple matrix (e.g. invalid JSON → retry/strict prompt; pack not found → fallback slug) so Lovable can show sensible errors.
- [ ] **Routing confidence:** If you add confidence scores to pack search, document threshold and how frontend should ask user to disambiguate.

---

## 7. Summary: What to Do Now

| Owner | Action |
|-------|--------|
| **Backend** | 1) Add or restore `validation_reports` migration if building Validation Dashboard. 2) Decide and implement onboarding progress storage (playbook_runs or profiles/startups). 3) Deploy and document edge functions and auth. 4) Run seeds; verify industry_playbooks + prompt_packs. |
| **Docs** | 1) Update Lovable 01 Supabase schema: industry_playbooks (10 categories), onboarding_questions table, progress storage. 2) Replace generic edge function names with actual names in Lovable index (00-index) and per-screen prompts where needed. 3) Keep this checklist in repo and link it from Lovable handoff. |
| **Lovable / Frontend** | 1) Use migrations + types for schema, not schema.sql. 2) Call actual edge function names (Section 2). 3) Use correct table/column names (Section 3). 4) After backend confirms seeds, use pack slugs from feature_pack_routing for prompt-pack calls. |

---

**File location:** `tasks/01-playbooks/lovable-prompts/00-backend-handoff-checklist.md`  
**Last updated:** 2026-01-30

| Owner | Action | Status |
|-------|--------|--------|
| **Backend** | 🟢 Complete | Verified migrations, seeds, and edge functions. |
| **Docs** | 🟢 Complete | Updated Lovable prompts and handoff logic. |
| **Lovable** | 🔴 Not Started | Ready for implementaiton. |
