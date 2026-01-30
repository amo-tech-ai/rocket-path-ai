# Playbook-to-Screen Integration

> **Version:** 1.0 | **Date:** January 30, 2026  
> **Purpose:** Connect frontend screens to the Industry Playbook intelligence layer.  
> **PRD:** [prd-industry-prompt-playbooks.md](../prd-industry-prompt-playbooks.md)  
> **Roadmap:** [roadmap.md](../roadmap.md)

---

## Summary Table

| Screen | Feature Context | Primary Prompt Pack | Knowledge Categories | Expected Outcome |
|--------|-----------------|---------------------|----------------------|------------------|
| `/onboarding` | `onboarding` | `industry-onboarding` | `terminology`, `failure_patterns` | Authenticated profile with industry context |
| `/validator` | `validator` | `industry-validation` | `benchmarks`, `warning_signs` | Scorecard with industry comparison |
| `/canvas` | `canvas` | `industry-canvas` | `gtm_patterns`, `benchmarks` | Populated canvas boxes with AI examples |
| `/pitch` | `pitch` | `industry-pitch-prep` | `investor_expectations`, `investor_questions` | Pitch deck slides aligned with investor needs |

---

## Description

This task involves the deep integration of the **Phase 1 (Intelligence)** and **Phase 2 (Experience)** layers. While screens exist and the backend contains 19 industries and 54 prompt packs, the connection between them must be finalized to ensure that:
1. The user's industry and stage are correctly passed to all AI requests.
2. The `invokeAgent` utility is used for all edge function calls.
3. The Right Panel (Intelligence) displays context-filtered advice from the correct playbook sections.
4. AI responses are saved back to the correct database tables (`lean_canvases`, `validation_reports`, etc.) with proper audit logging.

---

## Rationale

**Why this is critical:**
- **Value Realization** — Without integration, the 19 industry playbooks remain "dark data" that the user never sees.
- **Consistency** — Ensures the advice Maria gets in the Onboarding flow is consistent with the advice she gets in the Pitch Deck builder.
- **Automation Readiness** — Sets the stage for Task 3.16 (Workflow Triggers) by ensuring all data flows through a centralized mapping engine.

---

## User Stories

### Story 1: FinTech Founder Onboarding
**Context:** Maria is building a FinTech startup.
1. Maria selects "FinTech" and "Seed" in Step 1.
2. The system triggers the `industry-onboarding` pack.
3. The Right Panel shows: "FinTech Success Pattern: Focus on regulatory-first GTM."
4. The AI extracts features that are checked against `failure_patterns` in the FinTech playbook.

### Story 2: Healthcare AI Validation
**Context:** James is validating his Healthcare AI product.
1. James opens the Validator screen.
2. The screen detects his industry from the `startups` table.
3. The `industry-validation` pack is automatically selected via `feature_pack_routing`.
4. The generated score is compared against `benchmarks` (e.g., "Good: 18mo clinical trial plan") from the Healthcare playbook.

---

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| INT-1 | Screen detects Industry/Stage from User Profile | Log inspection: Industry ID visible in frontend state |
| INT-2 | `invokeAgent` used for all AI calls | Code grep: No direct `supabase.functions.invoke` in screens |
| INT-3 | Correct Prompt Pack triggered per screen | Audit Log: `pack_id` matches expected pack for that route |
| INT-4 | Knowledge injection filtered correctly | Edge Function Log: `categories` array matches `context_injection_map` |
| INT-5 | AI output mapped to correct DB fields | DB query: Verify data in `lean_canvases` or `pitch_decks` after run |
| INT-6 | Right Panel shows grounded advice | Visual: Panel displays industry-specific terminology and benchmarks |

---

## Purpose, Goals, Outcomes

### Purpose
Bridge the gap between raw industry data and the user interface to deliver personalized, expert-level guidance.

### Goals
- 100% of core wizards connected to the `prompt-pack` edge function.
- 0% generic AI responses (all must be industry-grounded).
- < 2s latency for context injection calls.

### Outcomes
- Founders feel the platform "understands" their specific industry.
- Higher trust in AI suggestions due to specific benchmarks.
- Clean database records with full audit trails of AI generations.

---

## Implementation Workflow

### 1. Context Wiring
- Update `useStartup` hook to provide `industry_id` and `stage_id` globally.
- Ensure `PlaybookProvider` wrap remains active across all child screens.

### 2. Screen Integration (Step-by-Step)
- **Onboarding**: Connect `useEnrichment` and `useInterview` to the `onboarding-agent`.
- **Validator**: Update `ValidatorPage` to use the `calculate_readiness` action via `invokeAgent`.
- **Canvas**: Map `CanvasBox` updates to the `generate_canvas_suggestions` action.
- **Pitch Deck**: Connect `PitchDeckWizard` to the `generate_pitch_content` pack.

### 3. Verification
- Use the **Dev Auth Bypass** to run automated browser checks.
- Verify that metadata (industry, stage) is present in the `audit_log` for every run.

---

## Key Points

- **中央 (Centralized) Mapping**: Use `feature_pack_routing` table as the single source of truth for which pack to run for which route.
- **JWT Integrity**: Always use `invokeAgent` to ensure the user's JWT is passed, even if the session is mocked.
- **Feedback Loops**: Ensure the "Apply" pattern (Task 3.15) is used so users can accept/reject AI suggestions.

---

## Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| `invokeAgent` | Secure API calls | ✅ Ready |
| `devAgentMock` | Headless testing | ✅ Ready |
| `industry_playbooks` | Content source | ✅ Seeded (19) |
| `prompt_packs` | Workflow definitions | ✅ Seeded (54) |
