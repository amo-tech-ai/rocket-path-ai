---
task_id: 022-ATS
title: Agency Test Suite (38+ Tests)
phase: PRODUCTION
priority: P0
status: Not Started
estimated_effort: 1 day
skill: [startup, devops]
subagents: [debugger, code-reviewer]
edge_function: all
schema_tables: []
depends_on: [001-ALR, 002-VSF, 003-VCF, 004-RUB, 005-SBR, 007-IMW, 008-PDC, 011-CMF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Report, Sprint Board, Investor Pipeline, Pitch Deck, AI Chat |
| **Features** | Agent loader tests, evidence tier rendering, RICE badges, MEDDPICC scoring, chat mode switching |
| **Edge Functions** | All 6 agency-enhanced functions (tested via mocked responses) |
| **Real-World** | "Run `npm test` and see 38+ new agency tests passing alongside the existing 389" |

## Description

**The situation:** The agency enhancement touches 6 screens, 6 edge functions, and introduces a new agent-loader runtime module. Currently there are 389 tests passing across 24+ test files, but zero tests cover agency-specific features: evidence tier badges, bias flag banners, RICE score rendering, Kano filter tabs, MEDDPICC scoring display, deal verdict pills, win theme labels, narrative arc components, chat mode selection, and the agent-loader itself. If any agency feature regresses after a future code change, there is no automated detection.

**Why it matters:** The agency enhancement is the largest single feature addition since the validator pipeline. It adds new UI components, new edge function behaviors, new data shapes, and a new runtime module (agent-loader). Without test coverage, every subsequent code change (bug fixes, dependency updates, refactors) risks silently breaking agency features. The existing 389 tests cover pre-agency functionality only. A minimum of 38 new tests are needed to cover the critical agency paths: loading fragments, rendering agency-specific UI, handling missing agency data, and mode switching.

**What already exists:**
- `src/test/` directory with 24+ test files following consistent patterns
- `src/test/mocks/mock-supabase.ts` — Supabase client mock for hook testing
- `@testing-library/react` + `@testing-library/user-event` — Component testing utilities
- `vitest` — Test runner with `vi.mock()`, `vi.fn()`, `describe/it/expect` patterns
- Existing test patterns to follow:
  - `src/test/hooks/useValidationReport.test.ts` (24 tests) — hook logic, type guards, config validation
  - `src/test/components/ReportV2Layout.test.tsx` (14 tests) — component rendering, v1/v2 detection
  - `src/test/components/ReportSections.test.tsx` (18 tests) — smoke tests for section components
  - `src/test/validate-report-e2e.test.ts` (31 tests) — integration tests for chat, pipeline, report
- `src/components/validator/report/EvidenceTierBadge.tsx` — Badge component (from task 004)
- `src/components/validator/report/BiasAlertBanner.tsx` — Banner component (from task 004)
- `src/components/validator/report/ICEChannelChip.tsx` — Channel chip component (from task 004)
- `src/pages/SprintPlan.tsx` — Sprint board with RICE badges (from task 005)
- `src/hooks/useInvestorAgent.ts` — Investor hook with MEDDPICC fields (from task 007)
- `src/components/ai/ChatModeSelector.tsx` — Mode selector component (from task 011)

**The build:** Create 6 new test files in `src/test/`:

1. **`agent-loader.test.ts`** (6 tests) — Unit tests for the agent-loader runtime module. Tests fragment loading, chat mode loading, missing file handling, caching behavior, cache busting, and tracking of loaded fragments.

2. **`validator-agency.test.ts`** (8 tests) — Component and integration tests for agency-enhanced validator report features. Tests EvidenceTierBadge rendering for all 3 tiers (cited/founder/ai_inferred), BiasAlertBanner rendering with warning content, ICEChannelChip rendering with score breakdown, evidence tiers in the full report context, bias flag banner in the report, graceful absence when agency data is missing from pre-agency reports, empty state handling for each component, and color mapping correctness for tier badges.

3. **`sprint-agency.test.ts`** (6 tests) — Component tests for RICE and Kano features on the sprint board. Tests RICE score badge rendering with numeric display, Kano filter tab rendering (All / Must-have / Performance / Delight), momentum order indicator on task cards, graceful fallback when RICE data is absent, Kano tabs hidden when no tasks have classification, and sprint card rendering with full RICE metadata.

4. **`investor-agency.test.ts`** (6 tests) — Component tests for MEDDPICC scoring and deal verdict features. Tests MEDDPICC badge rendering with /40 score format, deal verdict pill rendering for 4 verdict types (strong_buy / buy / hold / pass), signal timing indicator display, graceful MEDDPICC absence (badge hidden), verdict absence (pill hidden), and investor card rendering with full agency data populated.

5. **`pitch-deck-agency.test.ts`** (4 tests) — Component tests for Challenger Sale features in the pitch deck. Tests win theme label rendering with highlight styling, narrative step indicator showing progression, persuasion technique badge display, and win theme label hidden when data is absent.

6. **`chat-modes.test.ts`** (8 tests) — Component and interaction tests for the chat mode system. Tests ChatModeSelector rendering with 4 mode cards (general / fundraising / gtm / product), mode selection updating state, mode pill appearing in the chat header, quick action buttons changing per selected mode, default mode being "general" on initial load, mode switching clearing message history, chat input showing mode-specific context placeholder, and mode panel rendering all mode descriptions correctly.

**Example:** A developer runs `npm test` after modifying `DimensionPage.tsx` during a future refactor. The `validator-agency.test.ts` suite catches that the EvidenceTierBadge no longer receives its `tier` prop because the developer accidentally removed the prop passthrough. The test "EvidenceTierBadge renders green pill for cited tier" fails with a clear message. The developer fixes the prop, re-runs tests, and deploys with confidence.

## Rationale
**Problem:** Zero automated test coverage for agency-specific features — regressions are undetectable.
**Solution:** 38+ targeted tests across 6 files covering loading, rendering, interaction, and graceful degradation.
**Impact:** Agency features are protected from future regressions; developers can refactor safely.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | run `npm test` and see agency tests pass | I know agency features work after my changes |
| Developer | see a failing agency test | I catch regressions before they reach production |
| Reviewer | check test coverage for new components | I can verify the PR is safe to merge |
| QA | verify agency features are tested | I reduce manual testing burden on each deploy |

## Goals
1. **Primary:** 38+ new tests covering all agency-specific features
2. **Quality:** All 6 test files follow existing patterns (describe/it blocks, mocked Supabase, RTL for components)
3. **Regression safety:** Existing 389 tests remain passing with no modifications needed

## Acceptance Criteria
- [ ] `src/test/agency/agent-loader.test.ts` created with 6 passing tests
- [ ] `src/test/agency/validator-agency.test.ts` created with 8 passing tests
- [ ] `src/test/agency/sprint-agency.test.ts` created with 6 passing tests
- [ ] `src/test/agency/investor-agency.test.ts` created with 6 passing tests
- [ ] `src/test/agency/pitch-deck-agency.test.ts` created with 4 passing tests
- [ ] `src/test/agency/chat-modes.test.ts` created with 8 passing tests
- [ ] Total: 38+ new tests passing
- [ ] Existing 389 tests still passing (no regressions from test file additions)
- [ ] `npm test` completes all tests in under 30 seconds
- [ ] Each test file has a top-level `describe('Agency: [Module]')` block
- [ ] Component tests use `render()` from `@testing-library/react`
- [ ] Hook tests use `renderHook()` from `@testing-library/react`
- [ ] Mock data uses realistic agency field values (not placeholder strings)

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Test | `src/test/agency/agent-loader.test.ts` | Create — 6 unit tests for fragment loader |
| Test | `src/test/agency/validator-agency.test.ts` | Create — 8 component tests for report badges |
| Test | `src/test/agency/sprint-agency.test.ts` | Create — 6 component tests for RICE/Kano |
| Test | `src/test/agency/investor-agency.test.ts` | Create — 6 component tests for MEDDPICC |
| Test | `src/test/agency/pitch-deck-agency.test.ts` | Create — 4 component tests for Challenger |
| Test | `src/test/agency/chat-modes.test.ts` | Create — 8 component + interaction tests |
| Mock | `src/test/mocks/agency-data.ts` | Create — shared mock data for agency fields |
| Config | `vitest.config.ts` (if needed) | Verify `src/test/agency/` is included in test paths |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Agent loader called with nonexistent fragment name | Returns empty string, test verifies no throw |
| EvidenceTierBadge rendered with unknown tier value | Falls back to grey "Unknown" badge |
| RICE score is 0 | Badge shows "0" (not hidden) — zero is a valid score |
| RICE score is undefined | Badge not rendered at all |
| MEDDPICC score is null | Badge hidden, no crash |
| Chat mode param is empty string | Defaults to "general" mode |
| Multiple Kano tabs clicked rapidly | Only last selected tab active (no race condition) |
| Bias flags array is present but empty | Banner not rendered (length check) |
| ICE channel has missing sub-scores | Chip shows total only, no breakdown tooltip |
| Win theme is an empty string | Label not rendered (falsy check) |
| Report has V2 format with agency fields | Agency badges render (not version-gated) |
| Report has V3 format without agency fields | Standard V3 rendering, no badges |

## Real-World Examples

**Scenario 1 — Regression caught by test:** Two months after the agency deploy, a developer refactors the DimensionPage component to simplify the prop interface. They accidentally remove the `evidence_tier` prop passthrough. The `validator-agency.test.ts` test "renders green Cited badge for cited evidence tier" fails immediately in CI. The developer sees the failure, adds the prop back, and the refactor ships safely. **With the test suite,** the regression is caught in seconds instead of discovered by a user days later.

**Scenario 2 — New developer onboarding:** Marcus joins the team and needs to understand how agency features work. He opens `src/test/agency/` and reads through the 6 test files. Each file documents the expected behavior: "RICE badge shows numeric score", "Kano tabs filter tasks by classification", "MEDDPICC badge shows /40 format". The tests serve as living documentation of the agency feature contract. **With the test suite,** Marcus understands the expected behavior without reading implementation code.

**Scenario 3 — Dependency update breaks rendering:** A shadcn/ui Badge component update changes the default variant from "secondary" to "outline". The `sprint-agency.test.ts` test "RICE score badge renders with numeric display" passes (it checks text content, not styling). But `investor-agency.test.ts` "MEDDPICC badge renders /40 format" fails because the test also checks for the Badge component's class. **With granular tests,** the team knows exactly which components need visual review after the update.

## Outcomes

| Before | After |
|--------|-------|
| 0 tests for agency features | 38+ tests covering all 6 agency modules |
| Regressions in evidence tiers undetectable | EvidenceTierBadge tested for 3 tiers + empty state |
| RICE/Kano rendering untested | 6 tests verify badges, tabs, sorting, and fallback |
| MEDDPICC display untested | 6 tests verify score format, verdicts, and absence |
| Chat mode switching untested | 8 tests verify selection, default, clearing, and context |
| Agent loader has no tests | 6 tests verify loading, caching, missing files, and tracking |
| Future refactors are risky | Test suite catches prop removal, type changes, and rendering bugs |
| No documentation of expected agency behavior | Test descriptions serve as living specification |
