---
task_id: 021-BWC
title: Backward Compatibility Verification
phase: PRODUCTION
priority: P0
status: Not Started
estimated_effort: 0.5 day
skill: [startup, devops]
subagents: [debugger, code-reviewer]
edge_function: all
schema_tables: []
depends_on: [005-SBR, 006-IMS, 007-IMW, 008-PDC, 009-LCS, 010-CMB, 011-CMF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Report, Sprint Board, Investor Pipeline, Pitch Deck, Lean Canvas, AI Chat |
| **Features** | Legacy report rendering, pre-agency edge function output, graceful empty states |
| **Edge Functions** | validator-start, sprint-agent, investor-agent, pitch-deck-agent, lean-canvas-agent, ai-chat |
| **Real-World** | "Open a report created before the agency deploy — it renders identically, no crashes" |

## Description

**The situation:** The agency enhancement adds optional new fields and behaviors to 6 edge functions and 6 frontend screens. All new output fields are optional by design — evidence tiers, RICE scores, MEDDPICC grades, win themes, chat modes, and specificity scores. However, no systematic verification has been done to confirm that: (1) existing reports created before the agency update still render correctly in the modified report components, (2) edge functions called without agency context loaded still produce valid output with the same structure as before, (3) UI components handle both old (no agency data) and new (with agency data) responses gracefully without layout shifts, empty badges, or null reference crashes.

**Why it matters:** If existing reports break after deploy, users lose trust in the platform. There are 5 confirmed E2E pipeline runs in production (FashionOS 78, Restaurant 72, InboxPilot 68, Travel AI 62, ipix 78) plus sprint tasks, investor records, and pitch decks created before agency features existed. A single missed null check on an agency-only field could crash the report page for every user who revisits an old report. Backward compatibility is the highest-risk item in the agency rollout because it affects 100% of existing users on their very first page load after the deploy.

**What already exists:**
- `src/components/validator/report/ReportV2Layout.tsx` — Main report layout with `isV2Report()` type guard for version detection
- `src/components/validator/v3/DimensionPage.tsx` — V3 dimension detail with state machine (loading/success/error/empty/v2-fallback)
- `src/types/validation-report.ts` — Frontend types with `ReportDetailsV2` union types
- `src/pages/SprintPlan.tsx` — Kanban board with `useSprintAgent` hook
- `src/pages/ValidatorReport.tsx` — Report page entry point
- `src/hooks/useInvestorAgent.ts` — 12-action investor hook
- `src/hooks/usePitchDeckAgent.ts` — Pitch deck generation hook
- `supabase/functions/ai-chat/index.ts` — Chat with optional mode routing
- 5 existing validator reports in database (scores 62-78, V2 and V3 formats)
- 389 existing tests passing across 24+ test files

**The build:** Run a systematic compatibility checklist across all 6 affected screens and 6 edge functions. This is a verification-only task — no code changes unless a bug is found. The checklist covers:
1. Load each of the 5 existing validator reports — verify all 14 sections render, no crashes, no empty badges from missing agency fields.
2. Trigger a new validator pipeline run without agency fragments loaded — verify the report generates successfully with the standard field set.
3. Call `sprint-agent` without RICE/Kano metadata in the response — verify tasks are created and the Kanban board renders with standard cards (no RICE badge, no Kano tabs visible).
4. Call `investor-agent` without MEDDPICC fields — verify basic scoring and deal pipeline work as before.
5. Call `pitch-deck-agent` without win themes or narrative steps — verify standard deck generation works.
6. Call `ai-chat` without a mode parameter — verify general chat mode works as the default.
7. Open Lean Canvas and verify specificity scores are absent without layout issues.
8. Check that all new UI components (EvidenceTierBadge, BiasAlertBanner, ICEChannelChip, RICEScoreBadge, MEDDPICCBadge, WinThemeLabel, ChatModeSelector) render nothing when their data props are undefined/null.

**Example:** Sarah opens her old FashionOS report (score 78, V2 format). After the agency deploy, she sees the exact same report with no visual changes — the same hero, the same 14 sections, the same score ring. The evidence tier badges are not shown because the report predates the agency, and no crash occurs because `EvidenceTierBadge` checks `evidence_tier?.exists` before rendering. She then runs a new validation for a different idea. The new report shows evidence tiers, bias flags, and ICE channel recommendations because the agency-enhanced pipeline produced them. Both old and new reports coexist in her history without issues.

## Rationale
**Problem:** Agency enhancement modifies 6 screens and 6 edge functions — any regression breaks existing users on their first page load.
**Solution:** Systematic manual verification of every affected screen with both pre-agency and post-agency data, plus automated null-safety checks.
**Impact:** Guarantees zero-regression deploy for all existing users while enabling agency features for new data.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | open my old validation report | it looks exactly the same as before the update |
| Founder | generate a new sprint plan | I get valid tasks even if RICE scoring fails to load |
| Founder | use the AI chat | it works in general mode without me selecting a mode |
| Developer | deploy the agency update | I know existing data is safe and no pages crash |

## Goals
1. **Primary:** All 5 existing validator reports render without errors after agency code deploys
2. **Quality:** Zero visual regressions on pre-agency data (no empty badges, no layout shifts, no missing sections)
3. **Coverage:** All 6 edge functions produce valid output when called without agency context

## Acceptance Criteria
- [ ] FashionOS report (78/100, V2) renders all 14 sections without errors
- [ ] Restaurant report (72/100) renders without errors
- [ ] InboxPilot report (68/100) renders without errors
- [ ] Travel AI report (62/100) renders without errors
- [ ] ipix report (78/100) renders without errors
- [ ] New validator pipeline run produces valid report without agency fragments loaded
- [ ] Sprint agent generates tasks without RICE metadata (returns basic task objects)
- [ ] Investor agent scores deals without MEDDPICC fields (returns standard scoring)
- [ ] Pitch deck agent generates deck without win themes (returns standard slides)
- [ ] AI chat works in default general mode (no mode parameter required)
- [ ] Lean Canvas loads without specificity scores (no empty badges)
- [ ] All new UI badge/chip components show nothing when agency data is absent (not empty shells)
- [ ] No TypeScript errors from optional agency field access
- [ ] `npm run build` succeeds with 0 errors
- [ ] Existing 389 tests still passing (no regressions)

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Verification | All 5 existing reports | Load in browser, verify rendering |
| Verification | `supabase/functions/validator-start/` | Trigger pipeline without fragments |
| Verification | `supabase/functions/sprint-agent/` | Call without RICE/Kano in schema |
| Verification | `supabase/functions/investor-agent/` | Call without MEDDPICC fields |
| Verification | `supabase/functions/pitch-deck-agent/` | Call without win themes |
| Verification | `supabase/functions/ai-chat/` | Call without mode parameter |
| Verification | `src/components/validator/report/EvidenceTierBadge.tsx` | Render with undefined props |
| Verification | `src/components/validator/report/BiasAlertBanner.tsx` | Render with empty array |
| Verification | `src/components/validator/report/ICEChannelChip.tsx` | Render with undefined |
| Fix (if needed) | Any file with missing null guard | Add optional chaining |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Report JSON has no `evidence_tiers` key | Dimension pages show scores only, no badges |
| Report JSON has no `bias_flags` key | No amber banners rendered anywhere |
| Report JSON has no `narrative_arc` key | Executive summary shows flat verdict text |
| Report JSON has no `ice_channels` key | Growth section shows flat list or nothing |
| Sprint task has no `rice_score` field | Card shows title + priority only (standard layout) |
| Sprint task has no `kano_class` field | Kano filter tabs hidden or show all tasks |
| Investor record has no `meddpicc_score` field | Deal card shows basic stage + amount only |
| Pitch deck has no `win_themes` field | Standard slide generation, no win theme labels |
| AI chat called with `mode: undefined` | Defaults to general mode, no mode selector shown |
| Lean Canvas box has no `specificity_score` field | Box renders normally without score indicator |
| Report version is "v2" (not "v3") | `isV2Report()` returns true, V2 rendering path used |
| Report version field is missing entirely | Falls back to V2 rendering (safe default) |

## Real-World Examples

**Scenario 1 — Returning founder with old report:** Jake validated his fintech startup 3 weeks ago (score 68, V2 report). He logs in after the agency deploy. He clicks on his report in the validator dashboard. The report loads in under 2 seconds. All 14 sections display exactly as he remembers — the same market sizing chart, the same competitor matrix, the same score ring showing 68. No evidence tier badges appear because his report was created before the agency enhancement. No layout shifts. No error toasts. **With backward compatibility verified,** Jake's trust in the platform is maintained.

**Scenario 2 — Edge function without fragments:** The deployment pipeline runs but the agency fragment files fail to deploy to the edge function runtime (e.g., missing file, path error). The sprint-agent receives a request to generate tasks. `loadFragment()` returns an empty string for the missing fragment. The system prompt runs without RICE/Kano rules appended. Gemini generates 24 standard tasks with title, priority, and status — no RICE scores, no Kano classes. **With graceful degradation,** the sprint board renders a standard Kanban with all tasks visible, just without the scoring badges.

**Scenario 3 — Mixed data in history:** Priya has two validator reports — one from before the agency (score 72, no evidence tiers) and one from after (score 81, full agency data). She switches between them in the validator dashboard. The old report shows clean sections without badges. The new report shows evidence tiers, bias flags, and ICE channels. **With version-aware rendering,** both reports display correctly in the same UI without any conditional logic visible to the user.

## Outcomes

| Before | After |
|--------|-------|
| No systematic check that old reports survive new code | All 5 production reports verified rendering correctly |
| Unknown whether EFs degrade gracefully without fragments | Confirmed: all 6 EFs produce valid output without agency context |
| Risk of null reference crash on first user page load | All optional agency fields verified with existence guards |
| No documentation of what "working" means for old data | Explicit checklist with pass/fail per screen per data vintage |
| Agency deploy is a leap of faith | Agency deploy has a verified safety net |
