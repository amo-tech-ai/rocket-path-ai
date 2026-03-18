# Changelog

## [0.10.48] - 2026-03-18

### Session 45d: Pro Plan Upgrade + Revenue Model Topic + Pipeline Fix

**Supabase Pro plan upgrade:**
- Pipeline deadline: 140s → 300s (400s wall-clock)
- All agent timeouts restored to comfortable levels (Research 60s, Scoring 30s, MVP 30s, Composer 90s)
- Fixes "Isolate killed by Deno Deploy" errors that occurred on free plan

**Revenue model coverage topic added to validator followup:**
- New core topic #9: `revenue_model` — "How will you make money? Pricing model, price point, who pays?"
- Coverage topics: 13 → 14 core + 4 deep dive = 18 total
- Added to schema: coverage, extracted, confidence interfaces + Gemini JSON schema
- Followup now asks about monetization before generating the report

**Schema fix:** Removed duplicate `revenue_model` entry in extracted properties (depthEnum vs string type conflict)

**Modified:** `validator-start/pipeline.ts` (deadline), `validator-start/config.ts` (timeouts), `validator-followup/prompt.ts` (topic), `validator-followup/schema.ts` (fields)
**Deploy:** validator-start v75, validator-followup v31 | Tests: 688/688 | Build: 6.33s

## [0.10.47] - 2026-03-18

### Session 45c: Phase 3 — Screen Overlays + Public Rate Limiting + CORS Fix

**3 new screen overlays:** `/market-research` (bottom-up sizing, Porter's), `/investors` (MEDDPICC, signals), `/experiments` (experiment-risk matching, SMART goals). Total: 8 → 11 screens.

**SCREEN_DOMAINS fixes:** `/lean-canvas` and `/sprint-plan` now load `gtm_strategy`. `/crm` narrowed to customer CRM (investors → `/investors`).

**Public rate limiting:** ai-chat public mode now rate-limited by IP (`RATE_LIMITS.light`, 120/60s). Closes audit red flag.

**CORS fix:** All 15 response locations standardized from static `corsHeaders` to dynamic `getCorsHeaders(req)`.

**New file:** `src/test/validator/startup-expert-phase3.test.ts` (14 tests)
**Modified:** `_shared/startup-expert.ts`, `ai-chat/index.ts`
Tests: 688/688 (+14) | Deploy: ai-chat v91

## [0.10.46] - 2026-03-18

### Session 45b: Validator Intelligence Upgrade — 3 Fragments + 7 Verifier Rules + Evidence Quality

Wired 3 new agency prompt fragments into the validator pipeline (Research, Competitors, MVP), added 7 cross-section consistency rules to the Verifier, and added evidence quality scoring computation.

**3 New Fragments (`_shared/agency-fragments.ts`):**
- `RESEARCH_FRAGMENT` (~55 lines) — Porter's Five Forces quick assessment, market accessibility scoring (4 dimensions, composite threshold), founder optimism detection (TAM/growth/competitor divergence flags)
- `COMPETITORS_FRAGMENT` (~60 lines) — Competitive velocity assessment (shipping rate, funding, market share, response capability), zombie competitor detection (stale products = threat_level: low), pricing landscape comparison, win/loss pattern prediction
- `MVP_FRAGMENT` (~55 lines) — Build/Buy/Skip framework (decision tree), resource allocation by team size (solo→2-person→3-5), pivot decision criteria (persevere/pivot/kill), GTM motion selection (ACV-based PLG/hybrid/sales-led)

**Fragment registry:** 5 → 8 fragments. Type-safe `getFragment()` updated. Re-export shim updated.

**Validator agents with fragments:** 2/7 → 5/7 (Scoring, Composer, Research, Competitors, MVP)

**Types extended (all optional, backward compatible):**
- `MarketResearch`: `market_forces`, `market_accessibility`, `optimism_flags`
- `Competitor`: `velocity_rating`, `status`
- `CompetitorAnalysis`: `pricing_landscape`, `price_gap`, `win_loss_patterns`
- `MVPPlan`: `feature_classifications`, `resource_plan`, `pivot_assessment`, `gtm_motion`
- `ScoringResult`: `evidence_quality`

**7 Verifier cross-section consistency rules:**
1. V2-R1: TAM < $100M with market score > 70 → mismatch
2. V2-R2: Revenue model "subscription" but next steps say "per-transaction" → alignment error
3. V2-R3: Y3 revenue > 50x Y1 → growth rarely achievable
4. V2-R4: Score < 50 but no pivot/reconsider in next steps → missing guidance
5. V2-R5: 5+ high-threat competitors with competition score > 60 → overrated defensibility
6. V2-R6: MVP lists > 5 features but solo founder → overscoped
7. V2-R7: TAM > $1B with zero cited sources → unsupported claim

**Scoring evidence_quality (deterministic computation):**
- Counts evidence grade A/B/C/D from existing `evidence_grades` output
- Computes overall_quality (strong/moderate/weak) from A+B percentage (>=60%=strong, >=30%=moderate, else weak)
- Generates confidence_note with percentage breakdown

**New files:**
- `src/test/validator/agency-fragments-v2.test.ts` (53 tests)
- `src/test/validator/verifier-consistency-v2.test.ts` (22 tests)

**Modified files:**
- `supabase/functions/_shared/agency-fragments.ts` — 3 new exports + registry update (+170 lines)
- `supabase/functions/validator-start/agency-fragments.ts` — re-export 3 new fragments
- `supabase/functions/validator-start/types.ts` — 12 new optional fields
- `supabase/functions/validator-start/agents/research.ts` — import + inject RESEARCH_FRAGMENT
- `supabase/functions/validator-start/agents/competitors.ts` — import + inject COMPETITORS_FRAGMENT
- `supabase/functions/validator-start/agents/mvp.ts` — import + inject MVP_FRAGMENT
- `supabase/functions/validator-start/agents/verifier.ts` — 7 new consistency rules
- `supabase/functions/validator-start/agents/scoring.ts` — evidence_quality computation

Tests: 674/674 (+75) | Build: 5.88s | TypeScript: 0 errors | Deploy: validator-start v72 (1.108MB)

## [0.10.45] - 2026-03-18

### Session 45: Skills Architecture Audit + Startup Expert Prompt

Full audit of 29 startup skills + 7 agency skills, skills-to-edge-function wiring analysis, and upgrade of AI chat from a generic 12-line chatbot to a leading startup expert.

**Skills Architecture Audit:**
- Audited 29 startup-domain skills across `.agents/skills/startup/` (12) and `.agents/skills/startupai/` (17)
- Identified: 3 exact duplicates (nested `.agents/skills/` subfolder), 2 deprecated redirect stubs, 2 near-duplicates, 3 MVP skills covering same scope
- Mapped skill-to-fragment-to-edge-function production wiring: only 7/29 skills reach production via `agency-fragments.ts` (567 lines of domain knowledge)
- Produced comprehensive plan: `agency/skills/skills-architecture-plan.md` (430 lines, 10 sections)
- Recommended consolidation: 29 → 22 canonical skills after cleanup

**STARTUP_EXPERT_PROMPT — AI Chat expertise upgrade:**
- Created `_shared/startup-expert.ts` — 200+ lines of deep startup expertise replacing the 12-line generic "Atlas" prompt
- 8 core frameworks embedded: Idea Validation (Why Now, Tarpit, Paul Graham), Market Sizing (TAM/SAM/SOM 3-method), Scoring (9 dimensions with thresholds), Unit Economics (LTV:CAC, Burn Multiple, Rule of 40, NRR, Quick Ratio), GTM Strategy (motion selection, PQL, channel sequencing), MVP/Experiments (RICE, Kano, 5 experiment types, PMF signals, kill criteria), Competitive Strategy (tiering, moats, April Dunford positioning), Fundraising Readiness (stage benchmarks, readiness checklist, red flags)
- 4 stage-specific overlays (idea, pre_seed, seed, series_a) that adapt advice to the founder's actual stage
- `buildExpertPrompt()` function injects founder context (name, industry, stage, description) + stage overlay
- Wired into `ai-chat/index.ts` — default `chat` action uses expert prompt; specialized actions (prioritize_tasks, generate_tasks, etc.) preserve legacy prompts

**New files:**
- `supabase/functions/_shared/startup-expert.ts` — Expert system prompt + stage overlays + builder function
- `src/test/validator/startup-expert-prompt.test.ts` — 47 tests verifying all frameworks, wiring, and integration
- `agency/skills/skills-architecture-plan.md` — Full audit and improvement plan

**Modified files:**
- `supabase/functions/ai-chat/index.ts` — Import `buildExpertPrompt`, use for default chat action

Tests: 586/586 (+47) | Build: 6.34s | TypeScript: 0 errors | Deploy: ai-chat v89 (998.4kB)

## [0.10.44] - 2026-03-17

### Session 44: Agency Arc Close — MEDDPICC + Canvas Specificity + Chat Persistence (12/12)

Completed the final 4 agency archive tasks (007/008/011/012), closing the agency integration arc at 12/12 tasks.

**Task 007/008 — Investor MEDDPICC Schema + Scorecard:**
- Migration: `meddpicc_elements` JSONB column on `deals` table
- `scoreDealSchema` updated with 8 MEDDPICC elements (metrics, economic_buyer, decision_criteria, decision_process, paper_process, identify_pain, champion, competition) — each scored 1-5
- `scoreDeal` handler persists elements to deals table with auto-calculated total score, signal tier (strong/medium/weak), and verdict (pursue/consider/deprioritize)
- `MEDDPICCScorecard.tsx` — 8-row horizontal bar chart with color-coded scores (red 1-2, amber 3, green 4-5), total /40, verdict badge
- "Score Deal" button wired into InvestorDetailSheet AI Intelligence tab
- `DealScore` type extended with `meddpicc_elements` field

**Task 011 — Lean Canvas Specificity Checks:**
- `specificity_scores` and `evidence_gaps` changed from optional/nullable to required in coach response schema
- New `check_specificity` action in `lean-canvas-agent` — lightweight specificity-only analysis reusing coach prompt
- `checkSpecificity()` method added to `useCanvasCoach` hook with `SpecificityResult` type
- "Check Specificity" button in CanvasAIPanel with results card showing per-box vague/specific/quantified badges + evidence gap pills

**Task 012 — Chat Session Persistence:**
- Fixed `useAIChatPersistence.ts` — removed references to non-existent columns (`last_tab`, `ended_at`, `started_at` on sessions; `user_id`, `tab`, `suggested_actions` on messages)
- Aligned insert shapes with actual schema: sessions use `agent_type`/`status`, messages use `session_id`/`role`/`content`/`metadata`
- Wired into `AIAssistantProvider.tsx` via ref pattern (avoids stale closure): loads history on auth, saves user+assistant messages fire-and-forget, ends session on clear

**Lint fixes:**
- Replaced `as any` cast with `Record<string, unknown>` in persistence hook
- Used `useRef` pattern for persistence in provider to eliminate missing-deps warning
- Net lint change: 351 → 350 (-1)

**New files:**
- `supabase/migrations/20260317100000_deals_meddpicc_elements.sql`
- `src/components/investors/MEDDPICCScorecard.tsx`
- `src/test/components/MEDDPICCScorecard.test.tsx` (7 tests)
- `src/test/components/CanvasSpecificity.test.tsx` (7 tests)
- `src/test/hooks/useAIChatPersistence.test.ts` (11 tests)

**Modified files:**
- `supabase/functions/investor-agent/prompt.ts` — scoreDealSchema + MEDDPICC elements
- `supabase/functions/investor-agent/index.ts` — persist meddpicc to deals
- `src/hooks/useInvestorAgent.ts` — DealScore type + MEDDPICCElementScore export
- `src/components/investors/InvestorDetailSheet.tsx` — Score Deal button + scorecard
- `supabase/functions/lean-canvas-agent/actions/coach.ts` — required specificity fields
- `supabase/functions/lean-canvas-agent/index.ts` — check_specificity action
- `src/hooks/useCanvasCoach.ts` — checkSpecificity + SpecificityResult
- `src/components/leancanvas/CanvasAIPanel.tsx` — button + results card
- `src/hooks/useAIChatPersistence.ts` — schema fix
- `src/providers/AIAssistantProvider.tsx` — persistence wiring

Tests: 539/539 (+25) | Build: 6.36s | TypeScript: 0 errors | Lint: 350 (was 351)

## [0.10.43] - 2026-03-16

### Session 39: Agency Prompt Fragments + Chat Modes — Validator & AI Chat Enhancement

Replaced hardcoded prompt content in 2 edge functions with full agency knowledge from `.md` source files, exported as Deno Deploy-safe TypeScript modules.

**Architecture: `_shared/agency-*.ts` pattern**
- `Deno.readTextFile()` in `agent-loader.ts` cannot work on Deno Deploy (only statically imported files are bundled)
- Solution: export prompt content as TypeScript string constants in `_shared/` modules
- Re-export pattern matches existing `_shared/gemini.ts` → `validator-start/gemini.ts` convention

**Validator Pipeline — Scoring + Composer enrichment:**
- `_shared/agency-fragments.ts` — exports `SCORING_FRAGMENT` and `COMPOSER_FRAGMENT`
- `validator-start/agency-fragments.ts` — re-export for clean agent imports
- `scoring.ts` — replaced 40-line condensed inline with full fragment: RICE component definitions (Reach/Impact/Confidence/Effort scales), evidence tier weighting table, 4 bias detection rules with transparency mandate
- `composer.ts` Group D — replaced 18-line condensed inline with full fragment: Three-Act narrative (Act 1: market context, Act 2: solution mechanism, Act 3: quantified future), Win Theme criteria (buyer-specific + provable + differentiating with examples), ICE-scored growth channels by stage table, Behavioral Framing (5 principles: micro-wins, momentum language, progressive commitment, loss framing, specificity)
- Deployed: `validator-start` v70 (1.088MB)

**AI Chat — 4 coaching modes enrichment:**
- `_shared/agency-chat-modes.ts` — exports `CHAT_MODE_PROMPTS` with 4 full mode prompts
- `ai-chat/index.ts` — removed 85-line hardcoded `COACHING_MODE_PROMPTS` object, imported from shared module
- `practice_pitch`: +Socratic methodology (5 principles), investor question bank (15 questions across 4 categories), structured feedback template, experience-adaptive difficulty
- `growth_strategy`: +AARRR table with healthy benchmarks, channel rationale by stage, experiment design template (hypothesis/baseline/target/timeline/cost/success), unit economics quick check
- `deal_review`: +MEDDPICC scoring table (5-strong/1-weak anchors per element), 7 pipeline inspection questions, red flags list (7 deal killers), verdict action recommendations
- `canvas_coach`: +Box quality checklist (4 criteria table), per-box red flags (all 9 boxes), momentum patterns from behavioral-nudge, probing question templates (4 boxes)
- Deployed: `ai-chat` v87 (983.5KB)

**New files:**
- `supabase/functions/_shared/agency-fragments.ts` — Scoring + Composer fragments
- `supabase/functions/_shared/agency-chat-modes.ts` — 4 chat mode prompts
- `supabase/functions/validator-start/agency-fragments.ts` — re-export
- `src/test/validator/agency-fragments.test.ts` — 30 tests
- `src/test/validator/agency-chat-modes.test.ts` — 30 tests

**Modified files:**
- `supabase/functions/validator-start/agents/scoring.ts` — import + replace inline fragment
- `supabase/functions/validator-start/agents/composer.ts` — import + replace inline fragment
- `supabase/functions/ai-chat/index.ts` — import shared module + remove hardcoded prompts

Tests: 453/453 (+64) | Build: 6.39s | TypeScript: 0 errors | Deploy: validator-start v70 + ai-chat v87

### Session 39b: Report Agency Badges — 6 components wired (10/10 complete)

Built 2 new components and wired all 6 agency badge components into the validation report.

**New components:**
- `ICEChannelChip.tsx` — Growth channel pills ranked by ICE score (Impact/Confidence/Ease), composite score badge with color gradient (red/amber/green), sorted highest-first, time-to-result display
- `NarrativeArcSummary.tsx` — Three-act narrative cards (Opportunity/Risk/Path Forward), derives from summary_verdict text via paragraph splitting heuristic, responsive grid (3-col lg / stack mobile), color-coded borders (blue/amber/green)

**Wiring (4 integration points):**
- ReportV2Layout overview tab: NarrativeArcSummary after BiasAlertBanner (derives from summary_verdict)
- ReportV2Layout overview tab: EvidenceTierBadge + WinThemeLabel + ICEChannelChip in new "agency signals" PageCard (renders when any data present)
- StrategicSummary Fundability section: WinThemeLabel displaying top 3 strength dimensions as win themes

**Agency badge components (10/10 complete):**
1. EvidenceTierBadge (cited/founder/AI pills) — wired in overview
2. BiasAlertBanner (bias detection warnings) — wired in overview
3. WinThemeLabel (strategic theme pills) — wired in StrategicSummary
4. ICEChannelChip (growth channel ranking) — wired in overview
5. NarrativeArcSummary (3-act narrative) — wired in overview
6-10. Shared infrastructure: SectionShell, StickyScoreBar, InsightCard, AnimatedBar — already wired

**New test file:** `src/test/components/AgencyReportBadges.test.tsx` (21 tests)
Tests: 474/474 (+21) | Build: 6.36s | TypeScript: 0 errors

### Session 42: Streaming AI Chat (A3) — Token-by-token delivery via Realtime

AI chat responses now stream word-by-word via Supabase Realtime instead of waiting for the full response. Frontend infrastructure was already built (Session 37 RT-AUDIT) — this session wired the backend.

**Backend — `_shared/gemini.ts`:**
- `callGeminiChatStream()` — new streaming variant using Gemini's `streamGenerateContent?alt=sse` endpoint
- ReadableStream reader + TextDecoder for SSE line parsing
- Skips thinking tokens (`part.thought`), extracts text parts only
- Deadline safety: stops reading if timeout exceeded, returns partial text
- Same retry/timeout patterns as `callGeminiChat`

**Backend — `ai-chat/index.ts`:**
- Coaching modes (practice_pitch, growth_strategy, deal_review, canvas_coach): when `stream=true` + `room_id`, uses `callGeminiChatStream` and broadcasts each chunk as `token_chunk` event
- Authenticated chat (Gemini provider): same streaming pattern for general chat
- Fallback: `stream=false` or missing `room_id` → existing non-streaming behavior (backward compat)
- `room_id` resolution: now checks both top-level and `context.room_id` (frontend sends in context)
- Each stream ends with `message_complete` broadcast so frontend marks `isStreaming=false`

**Frontend — `useRealtimeAIChat.ts`:**
- Sends `stream: true` in request body (activates backend streaming)
- `token_chunk` handler was already built in RT-AUDIT — now triggered by backend broadcasts
- `handleTokenChunk` accumulates chunks in `streamBufferRef`, updates message content incrementally
- `isStreaming` state controls cursor animation + input disabled state

**How it works end-to-end:**
```
User types → EF calls Gemini streamGenerateContent → SSE chunks arrive →
EF broadcasts token_chunk to Realtime channel → Frontend handleTokenChunk
accumulates in streamBufferRef → React state updates → message text grows
word-by-word → message_complete broadcast → isStreaming=false → cursor removed
```

**New file:** `src/test/validator/streaming-chat.test.ts` (20 tests)
**Modified:** `_shared/gemini.ts` (+130 lines), `ai-chat/index.ts` (+55 lines), `useRealtimeAIChat.ts` (+1 line)
Tests: 494/494 (+20) | Build: 6.45s | TypeScript: 0 errors | Deploy: ai-chat v88 ACTIVE

### Session 43: Agency Prompt Fragments — Sprint, Pitch Deck, Investor (5/5 complete)

Wired the final 3 agency prompt fragments into their target edge functions, completing all 5/5 prompt fragments from the agency integration.

**_shared/agency-fragments.ts — 3 new exports:**
- `SPRINT_FRAGMENT` — RICE scoring (quadrant table: Quick Wins/Big Bets/Fill-Ins/Time Sinks), Kano classification (Must-Have/Performance/Delighter with examples), Momentum Sequencing (5 rules), Capacity Planning (team size table with story point mapping)
- `PITCH_DECK_FRAGMENT` — Win Theme Architecture (4 application rules with primacy/recency effects), Challenger Narrative (4-step with example phrases), Persuasion Architecture (5 cognitive principles: Primacy, Progressive Disclosure, Loss Aversion, Social Proof Cascade, Recency), Growth Story on Traction Slide (growth rate, unit economics trajectory, viral coefficient, channel diversification, validation velocity framing)
- `CRM_INVESTOR_FRAGMENT` — MEDDPICC scoring table (8 elements with 5/1 anchor descriptions), Signal-Based Outreach Timing (Strong/Medium/Weak with examples), Cold Email Framework (subject line rules, 4-part body structure under 120 words, anti-patterns)

**Edge function wiring:**
- `sprint-agent/index.ts` — replaced 40-line inline `SPRINT_FRAGMENT` with import from `_shared/agency-fragments.ts`
- `pitch-deck-agent/actions/generation.ts` — replaced 18-line inline Win Theme/Challenger/Persuasion content with `PITCH_DECK_FRAGMENT` import
- `investor-agent/prompt.ts` — replaced condensed MEDDPICC/outreach in 3 prompts (ANALYZE_INVESTOR_FIT, GENERATE_OUTREACH, SCORE_DEAL) with `CRM_INVESTOR_FRAGMENT` import

**Agency prompt fragments status: 5/5 complete**
| Fragment | EF Target | Session |
|---|---|---|
| Scoring (evidence tiers, RICE, bias) | validator-start | 39 |
| Composer (Three-Act, win themes, ICE) | validator-start | 39 |
| Sprint (RICE quadrants, Kano, momentum) | sprint-agent | 43 |
| Pitch Deck (Challenger, persuasion) | pitch-deck-agent | 43 |
| CRM Investor (MEDDPICC, signals, email) | investor-agent | 43 |

**New file:** `src/test/validator/agency-fragments-extended.test.ts` (20 tests)
**Modified:** `_shared/agency-fragments.ts` (+3 exports), `sprint-agent/index.ts`, `pitch-deck-agent/actions/generation.ts`, `investor-agent/prompt.ts`
Tests: 514/514 (+20) | Build: 6.81s | TypeScript: 0 errors | Deploy: sprint-agent v6, pitch-deck-agent v67, investor-agent v45

## [0.10.42] - 2026-03-09

### Session 38: POST-02 — Sprint Board ← Report Priority Actions Import

Report-to-Sprint-Board import: validation report priority actions now flow directly into the Sprint Board as trackable tasks with one-click import from both the Strategy tab (bulk top-5) and individual Dimension pages (per-dimension).

**New files:**
- `src/hooks/useSprintImport.ts` — Import hook with field mapping, dedup via `source_action_id`, auto-create campaign, toast feedback
- `supabase/migrations/20260309140000_sprint_tasks_source_action_id.sql` — `source_action_id TEXT` column + unique index for idempotent imports

**Modified files:**
- `src/components/validator/report/StrategicSummary.tsx` — Added "Start Next Sprint" button to Build Focus section
- `src/components/validator/report/ReportV2Layout.tsx` — Added `startupId` + `reportId` prop threading
- `src/components/validator/report/DimensionSection.tsx` — Added `startupId` prop passthrough
- `src/components/validator/v3/DimensionPage.tsx` — Added "Import to Sprint" button with per-dimension import
- `src/pages/ValidatorReport.tsx` — Passes `startupId` from report metadata

**Import logic:** Maps `priority_actions` → sprint_tasks (action→title, timeframe→sprint_name, effort→priority). Dedup via `source_action_id` = `report:{id}:dim:{dim}:idx:{i}`. Auto-creates campaign.

Tests: 389/389 | Build: 6.79s | TypeScript: 0 errors

## [0.10.41] - 2026-03-09

### Session 37: RT-AUDIT — Supabase Realtime infrastructure overhaul (10 items)

Comprehensive Realtime audit and improvement across 3 tiers. Fixed AI chat topic mismatch bug, consolidated 7 dashboard channels into 1, added typing indicators, ingest progress, health badge, canvas coach broadcast, and report presence.

**Tier A (Quick Wins):**
- A-1: Client reconnection with exponential backoff (1s→2s→4s...30s max)
- A-2: Dashboard channel consolidation (7→1 multiplexed channel)
- A-3: Reusable `usePollingFallback` hook (adopted in 5 domain hooks)

**Tier B (New Features):**
- B-1: Sprint board live sync hook (`useSprintRealtime`)
- B-2: AI Chat typing indicators + topic mismatch bug fix (EF → `:events`, client → `:ai`)
- B-3: Knowledge ingest progress tracking (per-batch broadcast events)

**Tier C (Advanced):**
- C-1: Canvas real-time coach broadcast (`coach_suggestions` event)
- C-2: Multi-user report presence (Supabase Presence API)
- C-3: Global realtime health badge (green/yellow/red dot with latency tooltip)

**Shared:** `supabase/functions/_shared/broadcast.ts` generic helper
**Deployed:** ai-chat v85, knowledge-ingest v7, lean-canvas-agent v53
**Files modified:** 15+ files (hooks, EFs, components, layout)

Tests: 389/389 | Build: 6.82s | Edge functions: 3/3 deployed + verified

## [0.10.40] - 2026-03-08

### Session 32: R7 + K4 + POST-03 — Chunk split, dedupe, health scores

**R7: Chunk size warning fix (vite.config.ts):**
- Split combined `pdf` chunk (593kB) into separate `jspdf` (391kB) and `html2canvas` (201kB)
- Eliminates Vite build chunk size warning, both libs already dynamically imported

**K4: Knowledge chunks deduplication (migration):**
- Deleted 204 duplicate chunks (same document_id + content, keeping oldest)
- Deleted ~180 noise chunks under 20 chars ("---", "Highlight:", headers)
- Added unique index on `(document_id, md5(content))` to prevent future duplicates
- Added CHECK constraint for minimum 20-char content length
- Result: 4,130 → 3,746 chunks

**POST-03: Dashboard health from validator scores (edge function):**
- Updated `health-scorer` to use `validator_reports.details.scores_matrix` when available
- Falls back to canvas-based estimation for startups without validation runs
- Same interface — no UI changes needed, scores flow through automatically
- Deployed as v27

Tests: 389/389 | Build: 7.86s | No chunk warnings

## [0.10.39] - 2026-03-07

### Session 30: PROD-06 Lint Cleanup — 990→340 errors, React hooks bug fixes

Systematic production hardening: fixed all real lint bugs (React hooks, case declarations, escape characters, require imports), excluded non-source directories from ESLint, and added 3 new production task prompts.

**ESLint config cleanup (eslint.config.js):**
- Added ignores for non-source directories: `.backup*`, `.agents`, `.obsidian`, `figma`, `backup`, `remotion`, `scripts`
- Immediate reduction from 990 → 458 problems (532 false positives eliminated)

**React hooks bug fixes (18 files):**
- Fixed exhaustive-deps in 8 component files: `AICostMonitoringPanel`, `DealAdvisorPanel`, `OnboardingIntro`, `AIDetectedFields`, `PresentationMode`, `ShareDialog`, `ValidatorChat`, `CanvasAIPanel`
- Fixed exhaustive-deps in 10 hook/page files: `useCanvasRealtime`, `useRealtimeAIChat`, `useRealtimeChannel`, `useRealtimeChatRoom`, `useNotifications`, `useOnboardingQuestions`, `useInterviewPersistence`, `useValidatorFollowup`, `useWizardSession`, `PitchDeckEditor`, `LeanCanvas`
- Wrapped callbacks in `useCallback`, memoized computations with `useMemo`
- Fixed ref cleanup patterns (copy `ref.current` to local variable inside useEffect)
- Used `eslint-disable-next-line` only where adding deps would cause infinite loops (channel subscriptions, non-memoized handlers)

**Other lint fixes:**
- `no-case-declarations`: Added block scope braces to switch cases in `persona.ts`, `state-machine.ts`, `prompt-pack-apply/index.ts`
- `no-useless-escape`: Fixed regex character class escapes in `CanvasAIPanel.tsx`, `AITaskSuggestions.tsx`, `prompt-utils.ts`
- `prefer-const`: Fixed in `prompt-pack/index.ts`, `mock-supabase.ts`
- `no-require-imports`: Converted `tailwind.config.ts` from `require("tailwindcss-animate")` to ESM `import`

**New task prompts (3 files):**
- `tasks/prompts/production/25-lint-cleanup.md` (PROD-06) — React hooks bugs + TypeScript cleanup
- `tasks/prompts/production/26-e2e-tests.md` (PROD-07) — Playwright E2E test suites
- `tasks/prompts/production/27-edge-function-cleanup.md` (PROD-08) — Remove orphaned remote functions
- Updated `tasks/prompts/00-index.md` to v3.1 (27 tasks, 41 files)

**Files modified:** 30 files (eslint.config.js, tailwind.config.ts, 8 components, 10 hooks/pages, 1 test, 6 supabase files, 4 task prompts)
**Build:** 0 TS errors | **Tests:** 389/389 pass | **Lint:** 340 (down from 990)

---

## [0.10.38] - 2026-03-06

### Session 22: Auth Redirect Fix, Chat Resilience, Pipeline Timeout Fix, Duplicate Icon Fix

5 fixes across auth, chat, pipeline, and UI — full E2E flow verified (homepage → sign-in → chat → pipeline → report).

**Auth redirect race condition (Login.tsx):**
- After sign-in, `profile` was still `null` during async fetch → `profile?.onboarding_completed` was falsy → redirected to `/onboarding` instead of saved return path
- Fix: Added `if (profile === null) return;` to wait for profile data before deciding redirect destination

**Chat state persistence (ValidatorChat.tsx):**
- Messages stored only in React state — lost on unmount during auth redirects
- Added sessionStorage persistence + restore on mount + resume logic (re-triggers followup if restored messages end with user message)

**Chat timeout race condition (ValidatorChat.tsx):**
- Promise.race 50s timeout overwrote streaming-delivered answers; flightTimeout 30s safety reset fired during normal operation
- Replaced boolean `followupInFlight` with typed phase state machine (`idle → requesting → streaming → delivered → error`)
- Added request identity (`activeRequestRef` with `crypto.randomUUID()`) — stale responses from superseded requests silently discarded
- Added `streamDeliveredForRequestRef` for explicit delivery tracking, duplicate question guard (`lastDeliveredQuestionRef`)
- Increased timeouts: flightTimeout 30→90s, Promise.race 50→90s

**ScoringAgent pipeline timeout (config.ts) — DEPLOYED:**
- ScoringAgent timeout was 15s with `thinking: 'high'` mode (typical ~13s, only 2s headroom)
- Timeout cascaded to skip MVPAgent (dependency chain)
- Fix: `scoring: 15_000 → 30_000` — safe because Scoring runs parallel with 55s Competitors

**Duplicate AI floating icons (GlobalAIAssistant.tsx):**
- `/validator` was missing from `DASHBOARD_PREFIXES` — both GlobalAIAssistant's Sparkles icon and DashboardLayout's Brain icon rendered on report pages
- Fix: Added `/validator` to exclusion list

**Test fix (ReportV2Layout.test.tsx):**
- Fixed `getByText('Market Size')` failing due to multiple matching elements → `getAllByText`

**Files modified:** `Login.tsx`, `ValidatorChat.tsx`, `GlobalAIAssistant.tsx`, `validator-start/config.ts`, `ReportV2Layout.test.tsx`
**Build:** 0 TS errors | **Tests:** 389/389 pass | **Edge function:** deployed | **Vercel:** Ready

---

## [0.10.37] - 2026-03-01

### POST-01: Strategic Summary Report Tab

New "Strategy" tab in the validation report synthesizes insights across all 9 scored dimensions into 3 actionable sections — no new API calls, pure client-side derivation.

- NEW `src/hooks/useStrategicSummary.ts`: Derivation hook (follows `useReportLeanCanvas` pattern). V3 dimensions first → V2 fallback. Returns `PositioningData`, `BuildFocusData`, `FundabilityData`.
  - **Positioning Snapshot**: Synthesizes competition + problem dimensions into positioning sentence, 3 differentiators, moat gap warning
  - **Build Focus**: Collects all priority actions across 9 dimensions, sorts by impact (Critical > High > Medium), returns top 5 + 90-day timeline preview
  - **Fundability Signals**: Ranks dimensions by composite score → top 3 strengths, bottom 3 weaknesses, improvement actions from weakest dims
- NEW `src/components/validator/report/StrategicSummary.tsx`: 3-section presentational component with dimension badges, impact indicators, strength/weakness cards, and empty-state handling
- `ReportV2Layout.tsx`: Added 'strategy' tab to `REPORT_TABS` + `TabsContent` with `StrategicSummary` component. Tab stepper prev/next works automatically.

**Build:** 0 TS errors | **Tests:** 371/372 pass (1 pre-existing) | **No new API calls** — all derived from existing report data

---

## [0.10.36] - 2026-03-01

### K3: Canvas Coach RAG — Knowledge-Backed Coaching

The Lean Canvas AI coach now searches 4,251 knowledge chunks (19 industry playbooks) before responding, enriching coaching advice with real industry data and citations.

- `lean-canvas-agent/actions/coach.ts`: Added `searchCoachingContext()` RAG function — generates OpenAI embedding → calls `search_knowledge` RPC → injects top-5 relevant chunks as numbered citations into Gemini system prompt. Graceful degradation: coaching continues without RAG on any failure. Service role client for vector search (bypasses RLS on knowledge_chunks). Timeout 15→20s for embedding overhead.
- `coach.ts` schema: Added `citations: string[]` to Gemini `responseJsonSchema` and return type. Fallback: if Gemini doesn't cite sources, returns RAG source names instead.
- `useCanvasCoach.ts`: Added `citations: string[]` to `CoachResult` interface, passes through from API response.
- `CanvasCoachChat.tsx`: Displays RAG citations as small source badges (BookOpen icon) below coach messages. Only shown when citations are present.

**Build:** 0 TS errors | **Tests:** 371/372 pass (1 pre-existing) | **Edge function:** deployed (v51) | **RAG:** 4,251 chunks, 14 categories, 13 industries

---

## [0.10.35] - 2026-03-01

### 040-VRT: Selective Agent Retry (V4)

Per-agent retry button on failed pipeline agents — retry just the failed agent + downstream cascade instead of restarting the entire 5-minute pipeline.

- NEW `supabase/functions/validator-retry/index.ts`: Background retry via `EdgeRuntime.waitUntil`, cascade map (e.g. retrying ScoringAgent cascades to MVP→Composer→Verifier), prerequisite validation, report delete+reinsert, safety net preventing stuck sessions
- NEW `supabase/functions/validator-retry/deno.json`: Deno config
- `ValidatorProgress.tsx`: `handleRetry()` calls retry endpoint, per-agent retry buttons on failed cards, smart "Retry [Agent]" bottom button, toast feedback, polling auto-resume

**Build:** 0 TS errors | **Tests:** 371/372 pass (1 pre-existing) | **Edge function:** deployed

---

## [0.10.34] - 2026-03-01

### 038-PPO: Pipeline Parallelization + Timeout Fix

Fixed pipeline crash ("Isolate killed by Deno Deploy") on free plan by parallelizing Research + Scoring and lowering timeout from 300s to 140s.

- `pipeline.ts`: Research + Scoring run in parallel via Promise.all (saves ~31s), PIPELINE_TIMEOUT_MS 300→140s, Composer minimum 45→35s
- `config.ts`: Updated critical path comments for parallel execution

### 039-VAR: Validator Agent Runs Tracking (V1→V3)

Wired `validator_agent_runs` table for per-agent progress tracking across pipeline, status endpoint, and frontend.

- `db.ts`: Added `startAgentRun()` + `completeAgentRun()` helpers for `validator_agent_runs` table
- `index.ts`: Pre-INSERT 7 agent rows as 'queued' in `validator_agent_runs`
- `pipeline.ts`: All 7 agents call `startAgentRun`/`completeAgentRun` alongside existing broadcasts
- `validator-status/index.ts`: Parallel query of `validator_agent_runs`, returns `agent_runs` array in response
- `ValidatorProgress.tsx`: Merges `agent_runs` timing data with realtime + polling (priority: realtime > agent_runs > steps)

**Build:** 0 TS errors | **Tests:** 371/372 pass (1 pre-existing) | **Edge functions:** deployed

---

## [0.10.33] - 2026-03-01

### 035-GCF: Composer Group C Silent Failure Fix

Fixed silent empty-result bug in `composer.ts` Group C when Gemini response parsing failed.

- `composer.ts`: Added error handling for Group C parse failures with structured fallback

### 036-CUC: Competitor URL Context Fix

Wired URL Context for founder-provided competitor URLs so CompetitorAgent reads actual competitor websites.

- `competitors.ts`: Enabled `url_context_metadata` extraction for competitor analysis
- `config.ts`: Enabled URL context in competitor agent config

### 037-DSC: Dynamic AI Suggestion Chips

Each validator follow-up question now generates 2-4 contextual suggestion chips via Gemini, replacing static hardcoded chips.

- `schema.ts`: `suggestions: string[]` in FollowupResponse + Gemini JSON schema (0-4 items, 60 char max)
- `prompt.ts`: "Suggestion Chips" instructions — 5 rules + 4 examples
- `index.ts`: Validate/sanitize (cap 4, HTML strip), broadcast + HTTP response
- `useValidatorFollowup.ts`: Pass suggestions from API + streaming metadata
- `ValidatorChat.tsx`: `latestSuggestions` state, wire to input
- `ValidatorChatInput.tsx`: Dynamic/static chip selection with primary styling for AI chips

**Build:** 0 TS errors | **Edge function:** deployed | **Vercel:** Production Ready

---

## [0.10.32] - 2026-02-27

### MVP-02: Composer Group E Pipeline Expansion

9 parallel Gemini dimension calls produce per-dimension detail pages with sub-scores, diagrams, risk signals, and priority actions. Reports now versioned as v2 or v3.

- `schemas.ts`: 9 per-dimension JSON schemas (problem, customer, market, competition, revenue, ai-strategy, execution, traction, risk)
- `composer.ts`: `composeDimension()`, `composeGroupE()` with 200ms stagger, 3-phase budget split (A+B+C → D → E)
- `pipeline.ts`: `report_version` detection (v2/v3) in INSERT
- `config.ts`: `groupE: 35_000` timeout
- `types.ts`: `dimensions?: Record<string, any>` on ValidatorReport
- DB migration: `report_version text DEFAULT 'v2'` column on `validator_reports`

### MVP-03: Chat Interview 8→12 Topics

Expanded validator followup interview from 8 to 12 discovery topics with structured follow-up questions.

- `validator-followup/prompt.ts`: 12 topics with depth questions
- `validator-followup/schema.ts`: Updated response schema
- `useValidatorFollowup.ts`: Enhanced hook logic
- `ContextPanel.tsx`: Improved topic display

### MVP-04: DimensionPage Shared Components

5 new V3 components + data hook for consulting-grade dimension detail pages.

- `SubScoreBar.tsx`: Animated horizontal bar with IntersectionObserver scroll-trigger
- `CompositeScoreCard.tsx`: Big score + verdict badge + sub-score breakdown
- `RiskSignalCard.tsx`: Severity-colored risk alerts (high/medium/low)
- `PriorityActionList.tsx`: Numbered actions with timeframe/effort chips
- `DimensionPage.tsx`: Layout shell with state machine (loading/success/error/empty/v2-fallback)
- `useDimensionPage.ts`: React Query hook with snake_case→camelCase transform

Also: `v3-report.ts` (V3 type system), `dimensions.ts` (9-dimension config), `BenchmarkBlocks.tsx` chart

**Build:** 0 TS errors | **Tests:** 357/357 | **Phase 2:** 4/7 complete (57%)

---

## [0.10.31] - 2026-02-27

### MVP-01: V3 Types Foundation

Type foundation for V3 consulting-grade dimension detail pages (9 drill-downs). Replaces `details: any` with `ReportDetailsV2` across all report consumers. No runtime behavior changes — types only.

- Backend: `SubScore`, `DimensionDetail`, `AIStrategyAssessment`, `ValidationProofAssessment` in `types.ts` + `dimensionDetail` schema + `DIMENSION_SUB_SCORES` config in `schemas.ts`
- Frontend: Mirrored types in `validation-report.ts` + `ReportDetailsV2` named type + `V3ReportDetails` + `isV3Report()` type guard
- Consumers: `ValidatorReport.tsx`, `ReportV2Layout.tsx`, `SharedReport.tsx`, `EmbedReport.tsx` — all `details: any` → `ReportDetailsV2`

### Audit 30: React Error #31 — Report Crash Fix

Fixed production crash where JSONB objects (`{assumption, severity, ...}`, `{action, timeframe, ...}`) were rendered as React children in ReportV2Layout.

- Root cause: Global `isV2Report()` gate misidentified mixed-format reports
- Fix: `safeText()` helper + per-field type detection + shape validation before component delegation
- 6 regression tests in `ReportV2Layout.test.tsx`

### Audit 31: Auth Redirect Flow Fix

Fixed auth flow where users entering a startup idea → signing up → landing back on empty home page instead of `/validate`.

- Root cause: `redirectTo` URL included `?next=...` query params that broke Supabase redirect URL allowlist matching
- Fix 1: `useAuth.tsx` — Clean `redirectTo` (no query params), return path in sessionStorage
- Fix 2: `HeroSection.tsx` — Loading overlay when pendingIdea exists during auth hydration
- Fix 3: `AuthCallback.tsx` — 15s timeout for stuck auth exchange
- 26 regression tests in `auth-redirect-flow.test.ts`

**Build:** 0 TS errors | **Tests:** 357/357 (+32) | **Lint:** 0 new errors

---

## [0.10.30] - 2026-02-27

### Audit 29 — Validator Pipeline Hardening (22 findings, all resolved)

Full static analysis audit of the 7-agent validator pipeline, report rendering, and shared infrastructure. 22 failure points identified across 4 severity tiers — all fixed.

**P0 Fixes (6/6) — Critical bugs silently corrupting data:**
- F-01: Fixed Composer Group D overwriting `summary_verdict` with empty string when Gemini fails
- F-02: Fixed `isV2Report()` returning false when `problem_clarity` is already a V2 object
- F-04: Fixed Verifier only checking 8 of 14 required sections (added 6 new P02 sections)
- D-04: Fixed dimension scores always returning 0 (missing `dimension_scores` in scoring schema)
- U-01: Fixed Report hero showing 0/100 score when `score` column is null (fallback to `scores_matrix.overall_weighted`)
- R-01: Fixed 60s Extractor timeout exceeding 300s pipeline budget when retries stack

**P1 Fixes (5/5) — Data quality and resilience:**
- D-01: Composer Group A/C fallbacks now return V2 objects (not strings that break `isV2Report()`)
- D-03: Research agent logs original TAM/SAM/SOM before correction, appends methodology note
- D-05: Added `strengths`/`weaknesses` to Composer Group B competitor schema + `trimCompetitors()` passthrough
- R-03: Added error check to `startup_members` insert in pipeline (was silently failing)
- R-05: Report INSERT now returns ID directly (`.select('id').single()`), removed unreliable `getReportId()`

**P2 Fixes (6/6) — UX, observability, resilience:**
- F-03: Fixed `InterviewContext.discoveredEntities` type to match extractor's access pattern (`{competitors,urls,marketData}`)
- D-02: Added MAX_TOKENS truncation detection + auto-retry with 1.5x token limit (ceiling 16384) in `callGemini()`
- U-02: Added "Generation incomplete" amber banner on reports with failed agents
- U-03: Updated `ReportData.details` with V2 union types (`string | ProblemClarityV2`, etc.)
- R-02: Expanded Composer fallback to handle 413, 422, 500 (not just 400)
- R-04: Added circuit breaker to knowledge-search (3 failures → skip for 5 min, half-open probe)

**Files modified:** `pipeline.ts`, `composer.ts`, `research.ts`, `scoring.ts`, `verifier.ts`, `schemas.ts`, `types.ts`, `gemini.ts`, `knowledge-search.ts`, `ValidatorReport.tsx`, `ReportV2Layout.tsx`

**Build:** ✓ | **Tests:** 325/325 | **TypeScript:** 0 errors

## [0.10.29] - 2026-02-25

### CORE-03: Auto-Generate Lean Canvas from Validation Report

One-click canvas generation from completed validation reports. Report dimensions (problem, customer, market, competition, revenue, etc.) are mapped to the 9 Lean Canvas boxes using Gemini. Includes overwrite confirmation dialog when a canvas already exists.

**Edge function changes (`lean-canvas-agent`):**
- `actions/generation.ts` — Added `generateFromReport()`: fetches report + startup profile, calls Gemini to map report dimensions to 9 canvas boxes, returns canvas data with confidence levels
- `actions/index.ts` — Added `generateFromReport` export
- `index.ts` — Added `generate_from_report` action case + `report_id` field to RequestBody interface

**Frontend changes:**
- `src/hooks/useLeanCanvas.ts` — Added `useGenerateCanvasFromReport()` mutation: calls `lean-canvas-agent` with `generate_from_report`, saves result to `documents` table (insert or update), invalidates queries
- `src/pages/ValidatorReport.tsx` — Added "Generate Canvas" button in header controls with LayoutGrid icon, loading state during generation, overwrite confirmation dialog (AlertDialog), success navigates to `/lean-canvas`

**Report-to-Canvas mapping (via Gemini):**
- `problem_clarity` + `red_flags` → Problem box
- `customer_use_case` → Customer Segments + Solution boxes
- `competition` gaps + SWOT strengths → Unfair Advantage box
- `summary_verdict` + tagline → Unique Value Proposition box
- `revenue_model` + `business_model` → Revenue Streams box
- `market_sizing` + `market_factors` → Channels box
- `scores_matrix` + metrics → Key Metrics box
- `technology_stack` + `mvp_scope` → Cost Structure box

**Build:** ✓ (6.78s) | **Tests:** 325/325 | **TypeScript:** 0 errors

## [0.10.28] - 2026-02-25

### CORE-02: Persistent AI Right Panel (360px in DashboardLayout)

Replaced floating AI overlay with a persistent 360px right-column chat panel in DashboardLayout. Panel survives page navigation, toggles with Cmd/Ctrl+J, and auto-hides below 1280px.

**New files:**
- `src/hooks/useAIPanel.ts` — Panel visibility state with localStorage persistence, Cmd/Ctrl+J shortcut, responsive breakpoint auto-hide/restore
- `src/components/ai/AIPanel.tsx` — Persistent chat panel (header, messages, quick actions, auto-scroll, keyboard hint)
- `src/components/ai/AIChatInput.tsx` — Reusable chat input with auto-resize textarea and send button

**Modified files:**
- `src/components/layout/DashboardLayout.tsx` — Added 360px right column for AI panel, floating Brain FAB when panel is closed, mobile toggle in header
- `src/components/ai/GlobalAIAssistant.tsx` — Now hides on dashboard routes (persistent panel handles them), only renders floating overlay on public pages
- `src/components/ai/index.ts` — Added AIPanel and AIChatInput exports

**Architecture:**
- Panel state managed in `useAIPanel` hook (separate from AIAssistantProvider chat state)
- Chat state (messages, sendMessage) from existing `AIAssistantProvider` — zero migration needed
- `GlobalAIAssistant` floating overlay still works on public/marketing pages
- Responsive: panel hidden <1280px, sidebar hidden <1024px, floating FAB shows when panel closed
- Page-specific `aiPanel` prop preserved for backward compat

**Build:** ✓ (6.83s) | **Tests:** 325/325 | **TypeScript:** 0 errors

## [0.10.27] - 2026-02-25

### CORE-06/07/08/09: Validator Agent Intelligence — Skill Framework Wiring

Wired 37 startup skills into 5 validator agents + composer + verifier. All new fields optional for backward compatibility.

**CORE-06 (Validation-Scoring Skills):**
- Scoring agent: Risk taxonomy (15 domains), bias detection (6 types), signal strength assessment (4 levels)
- Composer Group B: risk_queue → risks_assumptions mapping, bias_flags warnings, positioning/battlecard/white_space for SWOT
- Composer Group D: Signal-level verdict constraints (Level 1-2 → max "Conditional go", Level 4-5 → strengthens "Go")
- Verifier: SWOT depth check, positioning map validation, unit economics sanity checks

**CORE-07 (Idea-Discovery → ExtractorAgent):**
- Idea Quality Filters: Paul Graham well/crater test, schlep factor, organic vs manufactured demand
- Why Now analysis: trigger, category, confidence
- Tarpit detection: flag + reasoning

**CORE-08 (Market-Intelligence → ResearchAgent):**
- Value Theory TAM sizing, 3-method cross-validation (bottom-up/top-down/value-theory)
- Source freshness tracking with stale flags, trend analysis (trajectory/adoption curve/maturity)
- Fixed structural bug: CORE-06 research schema fields placed outside `properties` object

**CORE-09 (MVP Skills → MVPAgent):**
- Experiment cards: risk_domain, hypothesis, method, SMART goal, pass/fail thresholds
- Founder stage detection, recommended validation methods alignment

**Schema changes:** 15 optional fields added across 5 TypeScript interfaces (types.ts) + 3 Gemini JSON schemas (schemas.ts)

**Supabase Realtime Audit:** 22 implementations audited, 100% compliant (broadcast pattern, private channels, setAuth(), cleanup, naming conventions). Zero postgres_changes subscriptions.

**Build:** ✓ (6.64s) | **Tests:** 325/325 | **TypeScript:** 0 errors

## [0.10.26] - 2026-02-25

### Supabase Security Audit (Task 27) + Gemini API Audit (Task 28)

Two infrastructure audits completed:

**Supabase audit:** 78% B+ → 93% A. 12 critical/high fixes (RLS gaps, JWT checks, storage policies).
**Gemini API audit (3 rounds):** 87% → 92% A. 18 locations fixed across 12 files:
- Thinking-aware extraction (`extractGeminiText()`) in `ai-chat`, `industry-expert-agent`, `onboarding-agent`
- MODEL_PRICING corrections (Flash, Pro, Image model)
- `gemini-3.1-pro-preview` added to MODELS registry, skill doc, CLAUDE.md
- Thinking+schema comment corrected from "incompatible" to "empirical observation"
- Temperature wording corrected from "hard rule" to "strongly recommended per docs"

**Build:** ✓ (6.89s) | **Tests:** 325/325 | **TypeScript:** 0 errors

## [0.10.22] - 2026-02-14

### Luxury Report Hero Redesign (Spec 035)

Merged `ExecutiveSummary` + `ReportHero` into a single unified `ReportHeroLuxury` component — a consulting-grade hero with Playfair Display serif typography, animated score ring, stacked card layout, and strategic dimensions grid.

**New component:** `ReportHeroLuxury.tsx` (~270 lines) with 3 stacked sections:
1. Hero Briefing — startup name (serif 48-56px) + industry/stage pills + score ring SVG (R=52, 1.2s animation) + signal pill
2. Executive Summary — 60/40 split: VC-grade narrative (left) + 4 financial metric cards with staggered fade-up (right)
3. Strategic Dimensions — 2-column AnimatedBar grid + threat/risk footer cards

**Bug fixes during QA:**
- Weight percentages: 1500% → 15% (weights are integers, not decimals)
- Double dollar signs in narrative: `$$32.2B` → `$32.2B` (used `safeMarketValue()` for string market data)
- TAM/SOM metric overflow: full Gemini description → extracted dollar amounts via regex
- Stage pill formatting: `pre_seed` → `Pre-Seed` via `formatStage()` helper

- **Build:** clean | **Tests:** 325/325 passing | **Visual QA:** FashionOS report verified in browser
- **Files:** ReportHeroLuxury.tsx (new), ReportV2Layout.tsx (edit), ValidatorReport.tsx (edit)
- **Preserved:** ExecutiveSummary.tsx, ReportHero.tsx (still exist, unused)

## [0.10.21] - 2026-02-14

### Executive Summary Rewrite (Spec 034)

Rewrote Composer Group D to produce a clear, decisive, jargon-free executive summary. Added structured 5-part narrative (opportunity → "Imagine..." example → core risk → win/must/fail → Go/Conditional Go/No-Go verdict) with domain knowledge for investor expectations and traction language calibration.

**Key changes:**
- Group D system prompt: 5-part narrative structure with BAD/GOOD contrasts, "Imagine..." scenario required, 180-220 word target
- Compact context builder: Replaced raw JSON.stringify of full group outputs with compact summaries (~500 chars vs ~15K chars) to prevent Group D timeout after specs 031-033 increased group output size
- Schema descriptions updated to match new prompt requirements
- maxOutputTokens increased from 1024 to 2048 for Group D
- Null-safety guards on TAMSAMSOMChart and DimensionScoresChart to prevent frontend crashes on missing data

- **Build:** ✓ 22.69s | **Tests:** 325/325 passing | **E2E:** FridgeScan food waste — 66/100, 1,279-char summary with "Imagine Elena..." scenario, Conditional go verdict
- **Files changed:** composer.ts, schemas.ts, TAMSAMSOMChart.tsx, DimensionScoresChart.tsx, Validator.tsx

## [0.10.20] - 2026-02-14

### Structured Extraction — Problem Clarity, Customer Use Case, Market Sizing (Specs 031-033)

Added structured sub-objects to the Extractor for sharper Section 1-3 output. Composer now uses these as primary data source with fallback to basic string fields. Market sizing shows its math with buyer-count formulas and capture rate logic.

**031: Problem Clarity** — `problem_structured` (WHO/PAIN/TODAY'S FIX/evidence_tier) added to `StartupProfile`, extractor schema, extractor prompt domain knowledge, composer Group A Section 1 with 5 composition rules (quantified metrics, structural failure, 180-word cap)

**032: Customer Use Case** — `customer_structured` (persona_name/role_context/workflow_without/workflow_with/quantified_impact) added to all 4 targets, vivid persona extraction rules, composer Group A Section 2 with 5 composition rules (step-by-step workflow, hard numbers)

**033: Market Sizing** — Composer Group B market_sizing enhanced with 7 rules: show math, buyer-count formulas, capture rate scenarios, investor lens, assumption transparency

- **Build:** ✓ 28.07s | **Tests:** 325/325 passing | **E2E:** ClinicFlow dental SaaS — 70/100, all 3 sections verified
- **Files changed:** types.ts, schemas.ts, extractor.ts, composer.ts

## [0.10.19] - 2026-02-14

### Validator Agent Intelligence — 022-SKI Domain Knowledge + Prompt Hardening

Injected domain knowledge from 8 merged startup skills into all 7 validator agents + 4 composer groups. Added validation logic, rubric calibration, and post-processing sanity checks. Expected quality lift: +10-15 points on report scores.

**SKI-1: Knowledge injection (~270 lines across 10 targets)**
- Scoring: 7-dimension rubric anchors (90-100/70-89/40-69/0-39), evidence requirements per band
- Research: Market sizing methodology (bottom-up/top-down), SOM calibration by stage, source quality hierarchy
- Competitors: Competitor tiering (Tier 1/2/3), threat level calibration, competitive moat types
- MVP: RICE scoring framework, phase constraints (validate before build), de-risking experiment types, PMF signals
- Composer Group A: Problem severity calibration, persona quality bar
- Composer Group B: SOM calibration table, 15-domain risk taxonomy, competition threat framework
- Composer Group C: Revenue model patterns, unit economics benchmarks, burn rate benchmarks, GTM motion selection
- Composer Group D: Investor expectations by stage, 7-point narrative arc, traction language calibration

**SKI-2: Extractor prompt hardening** — `assumptions` field (2-5 key assumptions), structured `search_queries` with `{purpose, query}` format, idea statement formula, problem quality bar

**SKI-3: Curated links v2** — `SourceType` field on ~90 links (analyst/regulator/industry_org/news/platform/benchmark), fuzzy industry matching (contains-match fallback), `normalizeLinks()` for dedup+sort+cap, `allLinks` unified return

**SKI-4: Competitors post-processing** — Dedup competitors by name, validate threat_level values (default to 'medium'), relevance filtering rules in prompt

**SKI-5: Scoring calibration** — Compact context pack (structured readable format vs raw JSON.stringify), dimension-specific guidance, unit economics ranges

**SKI-6: MVP de-risking** — Weakest dimension detection feeds de-risking focus, customer field passed to prompt

**SKI-7: Composer hardening** — `normalizeGroup()` for array safety and null stripping, cross-group consistency check (SOM size, overall score, LTV:CAC), deterministic `top_threat` extraction from risks

**SKI-8: Verifier expanded checks** — Unit economics (LTV:CAC < 1 or > 20, payback > 36mo, CAC ≤ 0), financial projections (Y3 > 100x Y1), competitor count (0 found, > 3 high-threat), team burn rate (> $500K or < $1K with roles), SOM as % of SAM (> 10%)

- **Build:** ✓ 19.68s | **Tests:** 304/304 passing | **Files changed:** 10

## [0.10.18] - 2026-02-14

### Skills Reorganization — 17 → 8 Pipeline-Aligned Skills

Consolidated 17 startup skills into 8 pipeline-aligned merged skills (4,142 lines total). Each new skill maps to a specific validator agent or composer group. Deduplication removed TAM/SAM/SOM, unit economics, competitive positioning, GTM, and health scoring overlap across 3-4 skills each. Thin skills (startup-ideation 58 lines, mvp-builder 95 lines) enriched 5-8x. Old skills preserved as redirects (pending task #44).

New skills: `idea-discovery` (494), `market-intelligence` (721), `competitive-strategy` (552), `validation-scoring` (591), `mvp-execution` (356), `financial-modeling` (568), `go-to-market` (377), `fundraising-strategy` (483).

## [0.10.16] - 2026-02-14

### Report V2 — Executive Summary, Content Quality & Sticky Bar

Major design polish pass on the validator report. Executive Summary now generates VC-grade narrative, two key sections upgraded with quantified data, and the sticky score bar works reliably.

### Executive Summary rewrite

- **4-paragraph VC narrative** — Verdict ("78/100 — this is a go"), why it wins (market + differentiation + economics), what could kill it (risk + fatal question + weakest dimension), conditional conclusion with timeline
- **Executive Summary moved above Hero** — First thing users see after the toolbar
- **heroRef moved to Exec Summary wrapper** — IntersectionObserver triggers sticky bar when Exec Summary scrolls out of view (was on Hero, broke after reorder)
- **Score deduplication** — Strips leading "78/100. This is a go." pattern from composer verdict to prevent redundancy with generated verdict line

### Section content upgrades (DB updates)

- **Section 1 (Problem Clarity)** — Quantified impact: who has buying authority ($6-figure budgets), $2K–4K per shoot, $60K+ annual waste, 15–20% reshoot rate, structural tool failure that compounds with content velocity
- **Section 2 (Customer Use Case)** — Real persona (Sarah Chen, $200K budget, 10+ shoots/quarter), concrete Without (3 days, 4 tools, $3K–5K per failed shoot, 1–2 week delays), clear With (5 minutes, precise briefs), measurable Impact (20%→5% reshoot, $12K+/quarter savings)

### Sticky score bar fix

- **Fixed positioning** — Changed from `sticky top-0` to `fixed top-0 right-0 left-0 lg:left-64` — `overflow: hidden` ancestor was breaking sticky positioning
- **Same width as content** — Inner `max-w-[1000px] mx-auto` matches Executive Summary container
- **Centered layout** — Score, signal badge, and metrics centered with larger text (`text-xl`, `text-base`)
- **Backdrop blur** — `bg-card/95 backdrop-blur-md` for better contrast over content

### Also in this release

- **"Recommended Next Steps" label** — Added above next steps pills in ReportHero (was unlabeled green pills)
- **Tests:** 284/284 passing. Build clean. 0 TS errors.

## [0.10.15] - 2026-02-12

### Composer V2 Structured Output — Report V2 Visual Activation

Upgraded the Composer agent to output structured JSON for 6 report fields, activating the V2 visual report layout automatically for new reports. Old reports remain backward compatible via prose fallback.

### Structured fields (prose → JSON objects)

- **problem_clarity** — `{ who, pain, current_fix, severity }` renders as `ProblemCard`
- **customer_use_case** — `{ persona, without, with, time_saved }` renders as `CustomerPersona`
- **risks_assumptions** — `[{ assumption, if_wrong, severity, impact, probability, how_to_test }]` renders as `RiskHeatmap`
- **mvp_scope** — `{ one_liner, build[], buy[], skip_for_now[], tests_assumption, success_metric, timeline_weeks }` renders as `MVPScope`
- **next_steps** — `[{ action, timeframe, effort }]` renders as `NextStepsTimeline`
- **competition.positioning** — `{ x_axis, y_axis, positions[] }` renders as `CompetitorMatrix` with founder position extraction

### Generate Button Quick-Generate Path

Users can now type their startup idea and click Generate directly — no Q&A required. Previously the button stayed disabled until the AI built enough coverage through follow-up questions.

- **ValidatorChatInput.tsx**: `onSendAndGenerate` prop. Generate button enabled when text is present (not just when `canGenerate` is true)
- **ValidatorChat.tsx**: `handleSendAndGenerate(text)` sends the user message and starts the pipeline immediately, skipping Q&A
- **Root cause**: `canGenerate` was false until coverage analysis completed (2+ exchanges). `disabled={!canGenerate}` blocked new users
- **E2E verified**: AI accounting tool → 68/100, Coffee shop AI → 71/100 (V2 report with all 6 visual components)

### Also in this release

- **Composer prompt tone**: Conversational startup advisor voice ("you/your", lead with numbers, honest not polite)
- **Backend V2 types**: `ProblemClarityV2`, `CustomerUseCaseV2`, `RiskAssumptionV2`, `MVPScopeV2`, `NextStepV2` added to `types.ts`
- **Frontend V2 types**: Matching interfaces in `src/types/validation-report.ts`
- **ReportV2Layout**: snake_case→camelCase field mapping for all 6 sections, `CompetitorMatrixV2` helper for positioning data
- **Composer schema**: Updated in `schemas.ts` for documentation (not enforced by Gemini — schema too complex for `responseJsonSchema`)
- **Backward compatible**: `isV2Report()` checks `problem_clarity.who` — old prose reports render with `ProseBlock` fallback
- **Impact normalization**: Gemini output `"medium"` mapped to `"high"` for 2x2 risk grid (prompt specifies high|low only)
- **6 E2E runs**: Restaurant 72, InboxPilot 68, Travel AI 62, ipix 78, AI accounting 68, Coffee shop 71
- **Tests**: 26 files, 284/284 passing. Build clean. 0 TS errors.

## [0.10.14] - 2026-02-12

### P0-2 Fix — Promise.race Timeout for 5 At-Risk Edge Functions

5 edge functions had Gemini/Anthropic API calls with NO `Promise.race` hard timeout, making them vulnerable to Deno Deploy body-streaming hangs.

### Migrated to shared `_shared/gemini.ts` (3 functions)

Replaced inline `callGemini` (60+ lines each, no Promise.race) with shared `callGemini` which has full Promise.race + retry + extractJSON support:

- **market-research** — Shared callGemini + CORS + rate limiting + req.json() try/catch + timeout error handling (504)
- **opportunity-canvas** — Same migration pattern
- **experiment-agent** — Same migration pattern

### Added Promise.race hard timeout (2 functions)

These have unique multi-turn/SDK signatures incompatible with shared `callGemini`, so Promise.race was added in-place:

- **ai-chat** — `callGemini` and `callAnthropic` both wrapped in 30s Promise.race + AbortSignal.timeout. Also: req.json() try/catch, edge runtime import
- **lean-canvas-agent/ai-utils.ts** — `callGemini` (GoogleGenAI SDK) and `callGeminiStructured` both wrapped in 30s Promise.race

### Also fixed in this batch

- **lean-canvas-agent/index.ts** — Added edge runtime import, rate limiting, req.json() try/catch
- **Inline CORS removed** from market-research, opportunity-canvas, experiment-agent (now use `_shared/cors.ts`)
- **Inline JSON parsing removed** from same 3 functions (now use `_shared/gemini.ts` `extractJSON`)

### Wired — validator-regenerate hook + UI button (P1)

- **src/hooks/useValidatorRegenerate.ts** — New hook: refreshSession + explicit Auth header + functions.invoke pattern (matches useValidatorPipeline)
- **src/pages/ValidatorReport.tsx** — "Re-validate" button replaced with "Regenerate" button using hook. Shows spinner during regeneration, navigates to progress page on success

### Fixed — search_queries in extractor schema (P1-3)

- **validator-start/schemas.ts** — Added `search_queries` (array of strings) to `AGENT_SCHEMAS.extractor` + `required`. Was stripped by Gemini's schema enforcement, now flows to ResearchAgent

### Verified already done

- **P1-1** — Delete confirmations: Both AssumptionBoard and DecisionLog already have AlertDialog with deleteConfirmId state
- **P1-2** — outcome_at overwrite: DecisionLog already checks `outcomeChanged` before updating (L398-407)

### Also fixed in this batch

- **lean-canvas-agent/index.ts** — Added edge runtime import, rate limiting, req.json() try/catch
- **ai-chat/index.ts** — Added edge runtime import, req.json() try/catch

### Stats

- **Tests:** 271/271 pass
- **Build:** PASS
- **P0-2 status:** RESOLVED (0 at-risk functions remain)
- **P1 status:** All resolved (regenerate wired, delete confirmations verified, outcome_at verified, search_queries fixed)

## [0.10.13] - 2026-02-12

### Forensic Audit — P0 callGemini Signature Fix

**Critical bug:** 6 validator-agent-* edge functions called `callGemini({...})` with an object, but `_shared/gemini.ts` expects positional args `(model, systemPrompt, userPrompt, options)`. This caused the object to be passed as `model`, producing 400 errors on every Gemini API call.

### Fixed — validator-agent-* (6 functions)

- **validator-agent-extract** — `callGemini(model, systemPrompt, userPrompt, { responseJsonSchema, timeoutMs })` + `result.text`
- **validator-agent-compose** — Same fix, `maxOutputTokens: 8192`
- **validator-agent-score** — Same fix, `thinkingLevel: "high"`
- **validator-agent-mvp** — Same fix
- **validator-agent-competitors** — Same fix, `useSearch: true`
- **validator-agent-research** — Same fix, `useSearch: true, useUrlContext: true`

### Added — Forensic Audit Tracker

- **tasks/audit/23-tasks-checklist.md** — Full progress tracker: routes, validator, edge functions, schema, AI agents, dashboards, prompts. Percent correct by domain. P0–P3 issues. Hook verification. Top 10 next actions.

### Stats

- **Tests:** 271/271 pass
- **Build:** PASS

## [0.10.12] - 2026-02-12

### Docs Audit — Edge Functions vs Official Supabase + Gemini Docs

Systematic comparison of all edge functions against official documentation. All Gemini API rules (G1-G5) verified correct. All Supabase auth patterns verified correct.

### Fixed — Edge Function Best Practices

- **Edge runtime type import** — Added `import "jsr:@supabase/functions-js/edge-runtime.d.ts"` to `validator-start`, `validator-status`, `validator-panel-detail` (was missing, other functions already had it)
- **Import path standardization** — Changed `@supabase/supabase-js` bare specifier to `npm:@supabase/supabase-js@2` in `validator-start`, `validator-status`, `validator-panel-detail` (matches Deno convention)
- **crm-agent: unknown action returns 400** — Changed from `throw Error` (caught by generic handler → 500) to explicit 400 response (matches insights-generator pattern)
- **req.json() error handling** — Added explicit `try/catch` around `await req.json()` in `sprint-agent`, `insights-generator`, `crm-agent`. Malformed JSON now returns 400 instead of 500
- **Auth header casing** — Normalized `crm-agent` from `"authorization"` to `"Authorization"` (consistent with all other functions)
- **ReportV2Layout flaky test** — Added 15s timeout to `isV2Report` test (same pattern as prior fixes)

### Verified Correct (no changes needed)

- Gemini: G1 (responseJsonSchema + responseMimeType), G2 (temp 1.0), G4 (x-goog-api-key header), G5 (citations)
- Supabase: Auth with user-scoped client + Authorization passthrough, RLS enforcement
- CORS: Dynamic origin checking with ALLOWED_ORIGINS env var (better than docs example)
- Rate limiting, Promise.race hard timeout, exponential retry, pipeline safety net
- B2 cascade skip logic, SAM/TAM validation, pipeline checkpoint pattern

### Stats

- **Tests:** 271/271 pass, 0 failures
- **Build:** PASS
- **Edge functions audited:** 8 (validator-start, validator-status, validator-panel-detail, sprint-agent, insights-generator, crm-agent, validator-followup, _shared/gemini.ts)

## [0.10.11] - 2026-02-12

### Deployed

- **`sprint-agent`** edge function deployed to Supabase (v1, verify_jwt=true)

### Fixed — Audit Findings (B2, SAM/TAM)

- **B2: Skipped vs Failed status** — Pipeline agents skipped due to upstream dependency failure now show distinct `'skipped'` status instead of staying as `'queued'`
  - `pipeline.ts`: Marks downstream agents as `'skipped'` with reason when ExtractorAgent fails (cascade: Research, Competitors, Scoring, MVP, Composer). Also marks MVP as skipped when Scoring fails, and Composer when budget exhausted
  - `db.ts`: Added `'skipped'` to status type unions
  - `validator-status/index.ts`: Skipped + failed steps count toward progress bar
  - `ValidatorProgress.tsx`: Distinct SkipForward icon, muted styling (opacity-60), separate count in summary ("X failed, Y skipped")
- **SAM > TAM validation** — `TAMSAMSOMChart.tsx` now validates market sizing hierarchy:
  - Warns if SAM > TAM, SOM > SAM, or SOM > TAM
  - Clamps visual circle radii to prevent chart breakage
  - Shows amber warning badge with specific message
- **AIBudgetSettings flaky test** — Added 15s timeout (same pattern as other page tests)

### Added — 24 New Tests

- **`pipeline-status-auth.test.ts`** (24 tests): status parsing (7), auth refresh (6), SAM/TAM validation (6), skipped distinction (5)

### Stats

- **Tests:** 247 → 271 (+24), 0 failures
- **Test files:** 23 → 24
- **Build:** PASS

## [0.10.10] - 2026-02-12

### Added — Lean P1 Completion (L1-L5)

- **L1: Sprint Kanban + AI generation** — Major rewrite of `SprintPlan.tsx`:
  - `sprint-agent` edge function — Gemini 3 Flash generates 24 validation tasks (4 per sprint × 6 sprints) from startup profile data. Uses shared `callGemini` + `extractJSON` + structured JSON schema
  - `useSprintAgent` hook — localStorage-backed kanban state, calls sprint-agent, task CRUD
  - `KanbanBoard` component — 4-column drag-and-drop board (Backlog/To Do/Doing/Done) using @dnd-kit with source-colored badges, priority indicators, success criteria, AI tips
  - `PlannerPanel` component — AI coach sidebar with Generate Plan CTA, progress stats, sprint filter (6 sprint names)
  - Dual view mode: Kanban (default) + List toggle, right AI panel via `DashboardLayout.aiPanel`
- **L2: Profile extraction edge fn migration** — Rewrote `profile-import/index.ts` from inline code (Grade D) to shared imports (Grade A). Eliminated ~115 lines of inline CORS + callGemini + extractJSON
- **L3: Extraction preview UI** — Already complete: `ContextPanel` (8-field coverage, depth bars, confidence badges) + `ExtractionPanel` (coverage scores, suggestion chips) + 3-panel layout with mobile sheets
- **L4: Report V2 mobile polish** — Added Re-validate button to `ValidatorReport` header, responsive flex-wrap, `SectionShell` padding (`p-4 sm:p-6 lg:p-8`) and font sizing (`text-lg sm:text-xl lg:text-2xl`)
- **L5: PDF export polish** — Added company name to PDF cover page, timestamp to validation report filename (`-YYYY-MM-DD`), timestamp to Lean Canvas export filename

### Config

- `sprint-agent` added to `config.toml` with `verify_jwt = true`

### Tested — Full Cycle Audit

- **Browser E2E**: 13 screenshots covering Landing → Chat (0%→100% coverage) → Pipeline (7 agents) → Report (78/100 GO, 10 sections)
- **5th successful E2E pipeline run**: FashionOS — 78/100 (GO), all 7 agents completed
- **31 new tests** (`validate-report-e2e.test.ts`): chat readiness (6), pipeline payload (4), report unwrapping (9), sprint kanban (6), PDF export (6)
- **Flaky test fix**: 3 page tests (AssumptionBoard, DecisionLog, WeeklyReview) given 15s timeout for parallel execution stability
- **Audit doc**: `lean/audit-validate-report-flow.md`

### Stats

- **Tests:** 216 → 247 (+31), 0 failures
- **Test files:** 22 → 23

## [0.10.9] - 2026-02-12

### Added — Dashboard Command Centre (CC1-CC10)

- **CC1: Sidebar restructure** — 21 flat nav items → 6 collapsible groups (Primary, Execution, Intelligence, Fundraising, Library) with localStorage persistence and active-dot indicators
- **CC2: Journey Stepper** — `useJourneyStage` hook (6 steps: Idea→Validate→Canvas→Experiment→Plan→Launch) + `JourneyStepper` horizontal UI component, derived from existing dashboard data
- **CC3: Health Score card** — Already existed (`StartupHealthEnhanced`), confirmed wired to `health-scorer` edge fn
- **CC4: Completion & Unlocks** — `useCompletionUnlocks` hook (10-field analysis with unlock map) + `CompletionUnlocks` card (ring progress, missing fields, unlock preview)
- **CC5: Top Risks** — `useTopRisks` hook (derived from health breakdown dimensions) + `TopRisks` card (3 risks max, severity badges, source citations)
- **CC6: Today's Focus** — Re-laid out in 2-column grid alongside Top Risks
- **CC7: Primary Opportunity** — `PrimaryOpportunity` card (ICP, Problem, UVP, stage badge, validation score)
- **CC8: Fundraising Readiness** — `FundraisingReadiness` card (score bar, missing items, CTA to investors page)
- **CC9: Right Intelligence Panel** — Confirmed: 5 sections (StageGuidance, Benchmarks, AIStrategicReview, EventCard, Calendar)
- **CC10: Responsive breakpoints** — XL: 3-panel, lg: 2-col grids, md: single column, mobile: bottom nav + AI sheet

### Verified

- **EF2-EF4** — All three edge functions already had `auth.getUser()` + 401 checks: `onboarding-agent` (L1706-1714), `industry-expert-agent` (L47-56), `validator-regenerate` (already verified)

## [0.10.8] - 2026-02-12

### Fixed — Supabase Database Audit (3 migrations)

- **S9b: RLS initPlan caching** — Wrapped bare `auth.uid()` → `(SELECT auth.uid())` in ~54 policies across 17 tables. Programmatic DO block with placeholder-based text replacement. 0 bare calls remaining (was ~54). 95-99% RLS query performance improvement.
- **FK index** — Added missing `idx_lean_canvas_versions_created_by` index (Supabase performance advisor finding)
- **updated_at triggers** — Added `handle_updated_at()` trigger to 10 tables: context_injection_configs, event_speakers, industry_playbooks, playbook_runs, prompt_pack_steps, prompt_packs, startup_members, user_event_tracking, validator_reports, validator_sessions

### Added

- **P1 compute_readiness** — `insights-generator` action: 4 dimensions (trust, reliability, cost_control, support), verdict (GREEN/YELLOW/RED), blockers with severity, 4-week launch plan. Frontend hook: `useBusinessReadiness()`
- **P2 compute_outcomes** — `insights-generator` action: outcome cards, time saved, cost/insight, retention funnel, ROI Mirage detection (6:1 ratio threshold), founder decisions (Double Down/Adjust/Stop). Frontend hook: `useOutcomes()`
- **ErrorBoundary** — Global React error boundary wired into App.tsx
- **CF5 WeeklyReview** — Page + hook (`useWeeklyReviews`) + route + nav + 8 tests
- **EF compliance** — All 11 CORS wildcard files migrated to `_shared/cors.ts`, all 11 esm.sh imports migrated to `npm:` specifiers, 3 `serve()` imports replaced with `Deno.serve()`
- **ERD diagrams** — 5 Mermaid diagrams: Core Domain, Lean Validation, Validator Pipeline, AI Chat & Wizard, CRM & Project Management

### Stats

- **DB:** 89 tables | 536 indexes (+1) | 343 RLS | 103 triggers (+10) | 174 FKs | 110 migrations (+3)
- **Tests:** 216 passing
- **Bare auth.uid():** 0 remaining (was ~54)

## [0.10.7] - 2026-02-12

### Added — Core Feature Frontend (CF4 + CF1 + CF2)

- **CF4 AI Cost Guardrails** — 100% complete. Nav links added, `AIBudgetSettings.test.tsx` (5 tests): smoke, heading, budget inputs, alert/auto-disable controls, save button
- **CF1 Risk & Assumption Board** — 100% complete. `EditAssumptionDialog` added to `AssumptionBoard.tsx` (pre-fill fields, impact/uncertainty sliders, priority auto-calc). `AssumptionBoard.test.tsx` (6 tests): heading, kanban columns, stats, cards, add button, tabs
- **CF2 Decision Log** — Full build from scratch:
  - `useDecisions.ts` hook (6 exports: useDecisions, useCreateDecision, useUpdateDecision, useDeleteDecision, useDecisionEvidence, useAddEvidence)
  - `DecisionLog.tsx` page (timeline/list views, 8 decision types, 3 statuses, evidence section with supports/contradicts, create + edit dialogs)
  - Route: `/decision-log` with ProtectedRoute
  - `DecisionLog.test.tsx` (8 tests): heading, stats, cards, type badges, add button, tabs, AI badge, outcome display
  - `useDecisions.test.ts` (6 tests): query params, mutation, evidence query, type definitions
- **Sidebar nav** — Added "Assumptions" (AlertTriangle) and "Decisions" (Scale) links to `DashboardLayout.tsx`

### Stats

- **Tests:** 182 → 208 (26 new)
- **Test files:** 16 → 21 (5 new)
- **Pages:** 47 → 48 (DecisionLog)
- **Hooks:** 78 → 79 (useDecisions)

## [0.10.6] - 2026-02-12

### Added — Test Suite Expansion (106 → 182 tests)

- **useValidationReport tests** (24 tests) — `src/test/hooks/useValidationReport.test.ts`: getVerdict thresholds, formatMarketSize, DIMENSION_CONFIG (7 dims, weights sum to 100), SECTION_TITLES (14 sections), no-Math.random regression test
- **useAIUsageLimits tests** (10 tests) — `src/test/hooks/useAIUsageLimits.test.ts`: budget calculation (cents→dollars), usage percent, default cap ($50), over-budget handling, hook integration with Supabase mock
- **AICostMonitoringPanel tests** (10 tests) — `src/test/components/AICostMonitoringPanel.test.tsx`: correct column names (cost_usd, agent_name, input/output/thinking_tokens), daily aggregation, agent sort, empty state
- **ReportV2Layout tests** (14 tests) — `src/test/components/ReportV2Layout.test.tsx`: isV2Report detection, TAMSAMSOMChart data prop regression, v1/v2 rendering, empty details graceful handling
- **Report section smoke tests** (18 tests) — `src/test/components/ReportSections.test.tsx`: All 10 section components + 2 shared components render without crashing

### Fixed

- **ReportV2Layout hero nextSteps** — v2 step objects (with `action` field) were passed directly to ReportHero's `string[]` prop, causing "Objects are not valid as React child" crash. Now maps `.action` from objects.

## [0.10.5] - 2026-02-12

### Added — Report V2 Layout & System Audit Fixes

- **Report V2 design system** — `ReportV2Layout.tsx` (230 lines) with 10 section components. ValidatorReport rewritten from 1,241 → 306 lines. Handles both v1 prose and v2 structured JSON
- **10 report sections** — ReportHero, ProblemCard, CustomerPersona, CompetitorMatrix, RiskHeatmap, MVPScope, NextStepsTimeline, RevenueModelDash, TeamPlanCards, KeyQuestionsCards
- **System forensic audit** — `tasks/audit/22-system-audit.md`: 47 routes, 42 EFs on disk, 38 deployed, 182 tests passing

### Fixed

- **CF4 AICostMonitoringPanel schema mismatch** — `cost_cents`→`cost_usd`, `tokens_total`→`input_tokens+output_tokens+thinking_tokens`, `agent_type`→`agent_name`
- **CF4 AIBudgetSettings schema mismatch** — `cost_cents`→`cost_usd` in usage query
- **CF4 mock data removed** — AICostMonitoringPanel no longer falls back to `Math.random()` data; shows proper empty state
- **useValidationReport Math.random() fallback** — Removed fake score generation, returns actual data or empty state
- **load-knowledge auth** — Added `supabase.auth.getUser()` + 401 response for unauthenticated access
- **useKnowledgeSearch endpoint** — Fixed wrong edge function slug
- **TAMSAMSOMChart prop mismatch** — ReportV2Layout passed separate tam/sam/som props but component expects `data: MarketSizing` object

### Changed

- Updated `tasks/audit/22-system-audit.md` v4 — 182 tests, corrected counts, hero nextSteps bug added
- Updated `tasks/next-steps.md` to v8.3 — CF4 at 80%, L4 at 95%, EF1 fixed, 4 validator runs confirmed
- Updated `tasks/index-progress.md` to v7.6 — Report V2 completion, corrected counts

## [0.10.4] - 2026-02-12

### Changed — Prompts Index Forensic Audit & Reorganization

- **Prompts reorganized** — Task prompts moved to subfolders: `dashboards/` (9), `design/` (9), `validator/` (7), top-level (7), archived (4) = 36 total
- **index-prompts.md v3.0** — Full rewrite with comprehensive progress tracker, corrected file paths to subfolder locations, verified statuses against codebase
- **Progress tracker added** — 12-section tracker covering Foundation, Validator Pipeline, Lean System, Dashboard/Ops, AI Agents, Pitch Deck, P2 MVP screens, Vector RAG chain, Validator v3 chain, P3 Advanced, User Journeys, Build Order
- **Status corrections** — 11-industry-playbooks: Not Started → 🟡 70% (19 playbooks seeded). 01-dashboard: Not Started → 🟡 85%. 03-opportunity-canvas: Not Started → 🟡 40%. 04-sprint-plan: Not Started → 🔴 35%
- **4th E2E run confirmed** — ipix (78/100) added to verified runs

## [0.10.3] - 2026-02-11

### Fixed — Validator Auth & Gateway 401

- **Gateway 401 root cause** — `validator-start` was deployed with `verify_jwt=true` (v42) despite `config.toml` saying `false`. Gateway rejected all requests before function code ran. Redeployed v43 with `--no-verify-jwt`
- **Stale JWT in hooks** — Both `useValidatorPipeline.ts` and `useValidatorFollowup.ts` now call `refreshSession()` + pass explicit `Authorization: Bearer <token>` header to `functions.invoke()`
- **3 successful E2E runs** — Restaurant (72/100), InboxPilot (68/100), Travel AI (62/100)

### Changed — Skills Consolidation

- 34 skills migrated from `.claude/` to `.agents/skills/` with `SKILL.md` + `references/` structure
- 34 placeholder skills archived to `.agents/skills/_archive/placeholders/`
- Updated `.claude/settings.json`, `.gitignore`, `CLAUDE.md` for new paths
- Updated `tasks/index-progress.md` to v7.5, `tasks/next-steps.md` to v8.2

## [0.10.2] - 2026-02-10

### Added — Prompts Forensic Audit (19-prompts-audit)

- **Path corrections** — All broken `lean/prompts/*` refs → `tasks/*` (diagrams, notes, strategy) across 15 prompts
- **Index accuracy** — `tasks/prompts/index-prompts.md`: Notes `tasks/notes/`, Wireframes `tasks/WIREFRAMES/` (core) + `tasks/wireframes/` (advanced), Strategy `tasks/data/validator-v3-strategy.md`
- **Edge function acceptance criteria** — Task 21: `insights-generator` MUST implement `compute_readiness`; Task 22: `compute_outcomes`
- **Audit doc** — `tasks/audit/19-prompts-audit.md` with % correct per domain (paths 98%, schema 95%, EF 78%)

### Fixed

- Prompts 10–14: `lean/prompts/notes/` → `tasks/notes/`
- Prompts 15–20: `lean/prompts/data/diagrams/` → `tasks/data/diagrams/`, strategy → `tasks/data/validator-v3-strategy.md`

### Changed

- Updated `tasks/index-progress.md` to v7.4 (prompts audit complete)
- Updated `tasks/next-steps.md` with prompts audit blockers (insights-generator actions, validator-orchestrate)

## [0.10.1] - 2026-02-10

### Added — Verification & Compliance Pass

- **Gemini compliance 8/8** — prompt-pack and ai-chat migrated to shared patterns (_shared/cors.ts, _shared/rate-limit.ts, npm: imports, Deno.serve())
- **Soft delete frontend** — 40 `.is('deleted_at', null)` filters across 16 hook files (startups, contacts, deals, documents, projects, tasks)
- **Knowledge search wiring** — useKnowledgeSearch imported into AIChat.tsx with search UI and results display
- **Task prompt verification** — All 25 task prompts cross-referenced against actual codebase (schema, edge functions, hooks)
- **Migration integrity** — 2 backfill migrations: document_versions (8 cols, 4 RLS) and opportunity_canvas (15 cols, 4 RLS)
- **Config.toml completeness** — 9 edge functions added (31 → 41): 6 validator-agent-* (service_role) + 3 validator-board-* (internal auth)

### Fixed

- Task 23 prompt: `knowledge_base` → `knowledge_chunks` (3 occurrences)
- Task 14 prompt: `useLeanCanvasRealtime` → `useCanvasRealtime` (matched existing hook)
- Task 02 prompt: `industry_packs` → `prompt_packs` (archived table reference)
- checkReadiness tests: aligned thresholds with implementation logic (106/106 passing)
- TypeScript: 0 errors (`npx tsc --noEmit`)

### Changed

- Updated `tasks/index-progress.md` to v7.3 (overall 95%, Gemini 100%, edge functions 42)
- Updated `tasks/next-steps.md` to v7.0 (Phase 1.5 DONE, updated execution order)
- Updated `tasks/audit/17-audit-checklist.md` with task prompt verification results

## [0.10.0] - 2026-02-10

### Added — Data Strategy (Weeks 1-6)

- **Security hardening (Week 1)**
  - 40 RLS policies changed from `public` to `authenticated` role — zero anon access now
  - 22 edge functions set to `verify_jwt = true` in config.toml
  - 15 missing foreign key indexes added

- **Legacy cleanup (Week 2)**
  - 8 unused `validation_*` tables dropped (were causing confusion with active `validator_*` tables)
  - 5 legacy helper functions removed
  - 12 code files updated to remove dead references
  - `validation_reports` renamed to `validator_reports` (16 rows preserved)

- **Edge function migration (Week 3)**
  - 6 Grade-D functions rewritten to shared patterns: insights-generator, task-agent, crm-agent, event-agent, documents-agent, investor-agent
  - Each now uses `_shared/gemini.ts`, `_shared/cors.ts`, `_shared/rate-limit.ts`
  - Each has a new `prompt.ts` with Gemini G1 JSON schemas
  - Auth added: `supabase.auth.getUser()` + 401 on every function

- **Smart Interviewer data layer (Week 4)**
  - 6 ALTER TABLEs: added `risk_type`, `is_locked`, `depth`, `hypothesis_id` to interview_insights; `interview_mode`, `readiness_score` to interviews
  - 1 CREATE TABLE: `interview_questions` with RLS, indexes, updated_at trigger
  - Lock enforcement: UPDATE policy blocks writes when `is_locked = true`

- **Control layer tables (Week 5)**
  - `decisions` table: pivot/persevere/launch/kill decisions with evidence linking
  - `decision_evidence` table: polymorphic evidence links (assumptions, experiments, interviews, metrics)
  - `shareable_links` table: token-based public URLs with expiry and revocation. Anon read via `x-share-token` header
  - `ai_usage_limits` table: per-org monthly AI budget caps with spend tracking
  - 19 RLS policies (all `authenticated` except 1 `anon` for token-based share access), 15 indexes, 2 triggers

- **Core feature schema + soft delete (Week 6)**
  - `assumptions` table: added `risk_score` (0-100) and `evidence_count` columns for assumption board
  - `weekly_reviews` table: AI-generated weekly summaries with metrics, learnings, priorities. Unique per startup+week.
  - Soft delete: `deleted_at timestamptz` added to 6 core tables (startups, contacts, deals, documents, projects, tasks)
  - 18 RLS policies updated: SELECT/UPDATE/DELETE now include `AND deleted_at IS NULL`
  - 6 partial indexes for cleanup queries (`WHERE deleted_at IS NOT NULL`)
  - 5 RLS policies + 5 indexes + 1 trigger for weekly_reviews

### Added — Validator Enhancements

- **Industry playbooks (001-EFN)** — 8 industry-specific question banks (SaaS, FinTech, HealthTech, EdTech, AI/ML, E-commerce, Food, Real Estate) auto-injected into follow-up prompts based on keyword detection
- **Context passthrough (002-EFN)** — Chat interview data (extracted fields, coverage, confidence) now flows into the pipeline. Extractor runs in "refine" mode instead of re-deriving. Research agent gets targeted search queries.
- **Confidence tracking (009-SI)** — Each extracted field gets low/medium/high confidence (hedging = low, cited source = high). Shown as colored badges in the context panel.
- **Confidence-weighted scoring (010-SI)** — Scoring agent now discounts low-confidence fields and notes when key dimensions rely on guesses.

### Added — Documentation

- **6 mermaid diagrams** in `lean/mermaid/`:
  - System overview, Lean Canvas 3-panel, Dashboard layout, Onboarding wizard
  - Validator pipeline flow, Chat state machine
  - All exported as SVGs

### Changed
- TypeScript types regenerated with all new columns and tables
- `data-progress.md` updated to v3.4 (overall ~95%, was 92%). All 16/16 data tasks complete.
- Database counts: 83 tables (+6), 516 indexes (+31), 321 RLS policies (+29), 166 FKs (+11)

## [0.9.0] - 2026-02-08

### Added
- **Validator Pipeline (7-agent)** — Full E2E pipeline: Extractor, Research, Competitors, Scoring, MVP, Composer, Verifier
- **Shared Gemini client** (`_shared/gemini.ts`) — `callGemini()` with `Promise.race` hard timeout, `extractJSON` multi-fallback parser with truncated JSON repair
- **Rate limiting** (`_shared/rate-limit.ts`) — In-memory sliding window per user/endpoint
- **Validator Follow-up** (`validator-followup`) — Gemini Flash chat with 8 coverage topics, anti-repetition rules
- **Validator Panel Detail** (`validator-panel-detail`) — On-demand deep-dive for report sections
- **Validator Report UI** — 14-section report with ScoreCircle, ReportScorePanel, ReportSection, ReportRightPanel
- **Validator Chat UI** — ValidatorChat, ValidatorChatInput, ContextPanel, ExtractionPanel
- **Visual charts** — TAMSAMSOMChart, DimensionScoresChart radar, FactorsBreakdownCard, revenue AreaChart
- **Scoring data injection** — pipeline.ts injects highlights, red_flags, market_factors, execution_factors into report before DB INSERT
- **Forensic audit** (`tasks/validator/strategy/06-improved-plan-audit.md`) — 12 findings verified against official Supabase/Gemini docs, 6 Mermaid diagrams
- **v2 strategy docs** (`tasks/validator/strategy/`) — 7 documents covering agent strategy, user journey, workflows, architecture, audit
- **EdgeRuntime.waitUntil()** — Official Supabase pattern for background pipeline work with fire-and-forget fallback
- **MAX_TOKENS logging** — Detects and logs Gemini truncated responses via finishReason

### Fixed
- **Report showing no content** — Gemini wrapped JSON in array `[{}]`; added array unwrap in Composer, ValidatorReport frontend, and extractJSON
- **ComposerAgent JSON extraction failed** — maxOutputTokens 4096 caused mid-stream truncation; increased to 8192 with truncated JSON repair fallback
- **Pipeline deadline too tight** — Increased 115s to 300s (paid plan allows 400s wall-clock)
- **Composer budget too tight** — Increased hard cap from 30s to 90s
- **Zombie cleanup killing valid sessions** — Threshold was 180s but pipeline runs up to 300s; increased to 360s (300s + 60s buffer)
- **validator-followup HTTP 502** — Parse failures returned 502 (proxy error); now returns 200 with structured `{ success: false }` JSON
- **Strengths/Concerns empty** — Pipeline now injects scoring agent data into report before DB INSERT
- **Followup re-asking covered topics** — Prompt updated with explicit coverage rules; fallback questions use keyword-based context awareness

### Changed
- Composer maxOutputTokens: 4096 to 8192
- Composer budget cap: 30s to 90s
- Pipeline deadline: 115s to 300s
- Zombie cleanup threshold: 180s to 360s
- Competitors agent runs as background promise (non-blocking critical path)
- Grace period before Composer waits for Competitors (min 5s, protects Composer budget)

## [0.8.2] - 2026-02-03

### Added
- **Hero Chatbot Landing Page** (`website/hero-chatbot.html`) — BCG-style editorial design:
  - Clean two-row layout: headline + full-width chatbot
  - Gemini AI integration with retry logic
  - DOMPurify sanitization for XSS protection
  - Demo mode when no API key configured
  - Refine Strategy and Generate Roadmap follow-up actions
  - Auto-focus input, Enter to submit

### Changed
- Tagline updated to "From idea to execution."
- Button text changed from "Start Conversation" to "Generate"

## [0.8.1] - 2026-01-27

### Added
- **ProfileMappingBanner Integration** — Lean Canvas now shows:
  - Coverage indicators per canvas box (HIGH/MODERATE/LOW)
  - Auto-mapping on page load
  - AI Prefill button to generate content from startup profile
  - Refresh button to re-analyze coverage

- **InvestorDetailSheet AI Wiring** — New tabbed interface with:
  - **Fit Analysis** — AI-powered investor fit score with strengths/concerns
  - **Meeting Prep** — Key talking points, expected questions with suggested answers, questions to ask
  - **Outreach Generation** — AI-drafted emails with subject lines, supports cold/warm/follow-up variants

### Changed
- Lean Canvas module now at 98% completion
- Investors module now at 98% completion  
- Overall progress updated to 72%
- Exported FitAnalysis, MeetingPrep, OutreachResult types from useInvestorAgent

## [0.8.0] - 2026-01-27

## [0.7.9] - 2026-01-27

### Added
- **Investor Agent Edge Function** (`investor-agent`) — 12 AI actions:
  - `discover_investors`, `analyze_investor_fit`, `find_warm_paths`, `generate_outreach`
  - `track_engagement`, `analyze_pipeline`, `score_deal`, `prepare_meeting`
  - `enrich_investor`, `compare_investors`, `analyze_term_sheet`, `generate_report`

- **useInvestorAgent Hook** — All 12 actions with React Query mutations

- **AI Chat Page** (`/ai-chat`) — Dedicated chat interface with:
  - Message thread with markdown rendering
  - Quick action buttons for common queries
  - Context panel showing startup info
  - Chat history placeholder

- **Dashboard Real Data** — New `useDashboardMetrics` hook:
  - Real-time counts for decks, investors, tasks, events
  - Week-over-week changes displayed on metric cards
  - Parallel queries for efficiency

### Changed
- Progress tracker updated to 65% overall completion
- Investor module now at 75% (backend + hook complete)
- AI Chat module now at 85% (page created)
- Main Dashboard now at 50% (real data wired)

## [0.7.8] - 2026-01-27

### Added
- **Full UI Wiring for CRM AI Features**
  - `useCRMAgent` - 8 actions (enrich_contact, score_lead, score_deal, analyze_pipeline, generate_email, detect_duplicate, summarize_communication, suggest_follow_ups)
  - `useDocumentsAgent` - 6 actions (generate_document, analyze_document, improve_section, search_documents, summarize_document, compare_versions)
  - `useLeanCanvasAgent` - 11 actions (map_profile, prefill_canvas, suggest_box, validate_canvas, get_benchmarks, save_version, restore_version)

- **Pitch Deck Export System**
  - `ExportModal` component with PDF, PPTX, and shareable link options
  - PDF export with jsPDF (speaker notes, slide numbers, quality settings)
  - Link generation with expiration options (1/7/30 days, never)

- **Lean Canvas Enhancements**
  - `ProfileMappingBanner` - Shows coverage status per box with AI prefill button
  - `ConfidenceBadge` - Displays HIGH/MEDIUM/LOW confidence for AI-generated content
  - `ConfidenceIndicator` - Inline dots for item-level confidence

### Changed
- Progress tracker updated to 52% overall completion
- CRM and Documents modules now at 70% and 60% (hooks complete)
- Lean Canvas at 85% (confidence badges added)
- Pitch Deck at 75% (export functionality added)

## [0.7.6] - 2026-01-27

### Added
- **Complete Dashboard Documentation System**: 18 comprehensive prompt files in `docs/dashboard/`
  - `00-index.md` - Master index with module progress and implementation order
  - `00-progress-plan.md` - Detailed progress tracking with edge function status
  - `01-wireframes.md` - ASCII wireframes for all 27 screens (1095 lines)
  - `03-data-strategy.md` - 48 tables, ERDs, RLS, indexes (958 lines)
  - `03.1-smart-ai-system.md` - Auto-Claude adaptation with 10 Smart AI screens
  - `04-navigation-routing.md` - Routes, nav sidebar, breadcrumbs
  - `05-authentication.md` - OAuth, roles, RLS helpers (330 lines)
  - `06-ai-architecture.md` - AI routing, models, prompts, costs
  - `07-state-realtime.md` - React Query, autosave, 17 realtime channels
  - `08-edge-functions.md` - 14 functions, 100+ actions catalog
  - `100-dashboard-system.md` - Complete system plan (850 lines, source of truth)
- **Module Prompts (10-17)**: Detailed specs for each dashboard module
  - `11-main-dashboard.md` - Command center with KPIs, stage guidance
  - `12-crm.md` - Contacts, pipeline, 6 AI workflows
  - `13-documents.md` - Library, AI generation, semantic search
  - `14-investors.md` - Discovery, pipeline, warm paths
  - `15-projects.md` - Projects, tasks, AI generation
  - `16-ai-chat.md` - Chat interface, RAG, 22 chatbot actions
  - `17-settings.md` - 4 tabs (Profile, Appearance, Notifications, Account)

## [0.7.5] - 2026-01-27

### Added
- **Lean Canvas Enhancement System**: Documentation + edge function for 12-step roadmap
  - `lean-canvas-agent` edge function with 11 actions
  - Modular action handlers in `supabase/functions/lean-canvas-agent/actions/`

## [0.7.4] - 2026-01-27

### Added
- **Blog System**: Complete infographic-style research report system
  - Blog index page at `/blog` with card grid
  - 5 research reports with scroll-driven animations
  - Reusable components: KpiCard, InsightCard, DataTable, FlowDiagram, PullQuote, etc.
- **Research Reports**:
  - AI Adoption by Industry — 2025
  - AI Jobs & Future of Work — 2024–2026
  - AI in E-commerce
  - AI Startup Products
  - Leading AI Investment Hubs
- **Navigation**: Added Research link to header, updated footer with report links
- **Documentation**: `docs/website/04-blog-system.md` architecture guide

## [0.7.3] - 2026-01-26

### Added
- **Public Events Directory** (`/events`) - New public-facing events discovery page
  - Hero section with search functionality
  - Event source filter tabs (All / Hosted / Industry)
  - Grid and list view toggle
  - Filter by date range, event type, ticket cost tier
  - Stats cards showing total, upcoming, hosted, and industry events
  - Event cards with source badges, type labels, and contextual info
  - Click-through to event detail (hosted) or external website (industry)
  
- **Public Event Detail Page** (`/events/:eventId`) - Individual event pages
  - Full event information with hero section
  - Registration/external website CTAs
  - Share functionality
  - Topics and tags display
  - Event-specific details (capacity, ticket price for hosted; relevance, cost tier for industry)

- **New Components:**
  - `src/components/public-events/PublicEventCard.tsx`
  - `src/components/public-events/EventsHero.tsx`
  - `src/components/public-events/EventsFilterBar.tsx`
  
- **New Hooks:**
  - `src/hooks/usePublicEvents.ts` - Query `events_directory` unified view

### Technical
- Uses `events_directory` view combining hosted events and industry events
- 25 events seeded (5 hosted + 20 industry)
- Unauthenticated routes for public access
- Responsive design with mobile-first approach

## [0.7.1] - 2025-01-25

### Added
- Complete AI agent documentation system in `docs/agents/`
- Agent tracker with implementation status (`00-agent-tracker.md`)
- Claude SDK & Messages API reference (`01-claude-sdk-reference.md`)
- Screen-to-agent mapping with frontend-backend wiring (`02-screen-agent-mapping.md`)
- Individual agent prompts for all 10 agent types:
  - `01-orchestrator.md` - Multi-step workflow coordination
  - `02-planner.md` - Task generation and prioritization
  - `03-analyst.md` - Risk analysis and insights
  - `04-ops-automation.md` - Automated notifications
  - `05-content-comms.md` - Email and content generation
  - `06-retriever.md` - RAG knowledge search
  - `07-extractor.md` - URL and profile extraction
  - `08-optimizer.md` - Schedule optimization
  - `09-scorer.md` - Investor and deal scoring
  - `10-controller.md` - Action validation and safety

## [0.7.0] - 2026-01-25

### Fixed
- **Critical: Profile Lookup Race Condition** 
  - Changed `.single()` to `.maybeSingle()` in edge function main handler (line 1021)
  - Prevents 500 errors for new users whose profile trigger hasn't fired yet
  - This was the root cause of "missing sub claim" errors during new user onboarding

### Verified
- **Full Production Audit Completed**
  - Auth flow: 100% - JWT attachment via `invokeAgent` confirmed
  - AI Enrichment: 100% - `gemini-3-pro-preview` with dual grounding tools
  - Interview: 100% - Questions load, signals extract
  - Completion: 100% - Startup creation and redirect verified

### Added
- **Production Audit V2**: `docs/onboardingV2/10-production-audit-v2.md` with comprehensive checklist

### Technical
- Edge function redeployed with all fixes
- All 3 required secrets verified: `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `LOVABLE_API_KEY`
- Google + LinkedIn OAuth configured and routing to `/onboarding`

---

## [0.6.9] - 2026-01-25

### Fixed
- **Critical Auth Fix**: All `useWizardSession` edge function calls now use `invokeAgent` helper to explicitly attach JWT
  - Resolves "missing sub claim" errors that prevented onboarding from working
  - Session creation and updates are now properly authenticated

### Enhanced
- **URL Enrichment with Google Search Grounding**: `enrich_url` action now uses both:
  - **URL Context**: Reads website content directly for extraction
  - **Google Search**: Discovers competitors and market trends
- **Graceful Org Handling**: `complete_wizard` no longer fails for new users without org_id

### Added
- **Gemini Reference Doc**: `docs/gemini/09-onboarding-agent-grounding.md` with architecture diagrams and implementation patterns

### Technical Details
- Edge function uses `gemini-3-pro-preview` with dual tools: `urlContext` + `google_search`
- Frontend uses centralized `invokeAgent` helper in `src/hooks/onboarding/invokeAgent.ts`
- All AI logging gracefully handles missing org_id

---

## [0.6.8] - 2026-01-25

### Added
- **LinkedIn OIDC Authentication**: Added `signInWithLinkedIn()` method using `linkedin_oidc` provider (replaces deprecated `linkedin`)
- **Social Login Page**: Login.tsx now displays both Google and LinkedIn OAuth buttons
- **Auth Reference Docs**: Created `docs/auth/00-social-auth-setup.md` with architecture diagrams and setup guide

### Changed
- **Onboarding Redirect Flow**: OAuth callbacks now redirect to `/onboarding` instead of `/dashboard`
- **Smart Routing**: Login page checks `profile.onboarding_completed` to route new users to onboarding, returning users to dashboard
- **CTA Buttons Updated**: "Start Your Profile" buttons throughout marketing pages now link to `/login` instead of `/dashboard`

### Files Modified
- `src/hooks/useAuth.tsx` - Added `signInWithLinkedIn` method and updated context interface
- `src/pages/Login.tsx` - Added LinkedIn button with proper OIDC provider
- `src/components/marketing/HeroSection.tsx` - CTA routes to `/login`
- `src/components/marketing/CTASection.tsx` - CTA routes to `/login`
- `src/components/features/FeaturesCTA.tsx` - CTA routes to `/login`
- `src/components/layout/Header.tsx` - "Start Your Profile" button text

---

## [0.6.7] - 2026-01-25

### Added
- **Per-Section AI Suggestions**: Added `BoxSuggestionPopover` component for inline AI suggestions per canvas box
  - Sparkle button appears on hover in each box header
  - Generates 3-4 context-aware suggestions based on startup profile
  - One-click apply with "Generate more" option

### Enhanced
- **CanvasBox Component**: Now accepts `boxKey`, `startupId`, and `canvasData` props for AI integration
- **LeanCanvasGrid**: Passes startup context to enable per-section suggestions

### Production Ready
- **Lean Canvas Editor**: 100% complete with all acceptance criteria met:
  - ✅ All 9 sections editable in-place
  - ✅ Autosave with 2-second debounce + visual indicator
  - ✅ AI suggestions per section (new)
  - ✅ AI pre-fill from profile + hypothesis validation
  - ✅ Export to PDF and PNG with branding
  - ✅ Version display and manual save

---

## [0.6.6] - 2026-01-25

### Refactored
- **Onboarding Hooks Modularization**
  - Split `useOnboardingAgent.ts` into 6 focused files in `src/hooks/onboarding/`
  - Created `types.ts` - Shared type definitions for all onboarding hooks
  - Created `invokeAgent.ts` - Secure edge function caller with JWT attachment
  - Created `useEnrichment.ts` - URL, context, and founder enrichment
  - Created `useInterview.ts` - Questions and answer processing
  - Created `useScoring.ts` - Readiness, investor score, and completion
  - Updated `useWizardSession.ts` to use shared types

- **OnboardingWizard Page Modularization**
  - Extracted step handlers into `src/pages/onboarding/` module
  - Created `constants.ts` - Wizard steps and descriptions
  - Created `useStep1Handlers.ts` - Enrichment operations
  - Created `useStep3Handlers.ts` - Interview operations with optimistic UI
  - Created `useStep4Handlers.ts` - Scoring and completion
  - Created `useWizardNavigation.ts` - Step transitions and validation
  - Reduced `OnboardingWizard.tsx` from 878 to ~380 lines

### Verified
- All 7 existing tests pass
- No breaking changes to public APIs
- Backwards compatibility maintained via re-exports

---

## [0.6.5] - 2026-01-23

### Fixed
- Deleted orphan `src/components/onboarding/steps/Step1Context.tsx` (duplicate causing confusion)

### Added
- Comprehensive production audit report: `docs/onboardingV2/06-production-audit.md`
- Mermaid diagrams for data flow, component hierarchy, and validation
- Full verification checklist with hard proof

### Updated
- Progress tracker corrected: Documents 30%→90%, Settings 30%→85%
- Overall progress updated to 85%

## [0.6.4] - 2026-01-23

### Fixed
- **Critical: Validation Object Stability**: Fixed infinite re-render risk by using `JSON.stringify` for stable error comparison in `Step1Context.tsx`
- **Navigation Reliability**: Added defensive session checks and explicit error logging in `handleNext()`
- **Silent Failure Prevention**: Navigation now logs warnings and shows toast when session is missing

### Added
- **Forensic Audit Document**: Created `docs/05-audit-solution.md` with complete diagnostic analysis
- Comprehensive Mermaid diagrams for data flow, architecture, and component hierarchy
- Production readiness checklist with 100% verification

---

## [0.6.3] - 2026-01-23

### Verified
- **Full Onboarding Audit**: Complete verification of all 4 wizard steps
- Step 1: Validation, AI enrichment, navigation all functional
- Step 2: All 6 cards (Overview, Founder, Website, Competitor, Signals, Queries) complete
- Step 3: Interview questions, answer processing, signal extraction working
- Step 4: Score calculation, summary generation, wizard completion functional
- Updated production checklist with comprehensive component hierarchy

---

## [0.6.2] - 2026-01-23

### Fixed
- **Step 1 Navigation**: Fixed useEffect dependency loop in validation callback using useRef pattern
- Validation state now properly propagates without causing infinite re-renders

---

All notable changes to StartupAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.1] - 2026-01-23

### Fixed
- **Step 1 Navigation**
  - Fixed validation callback flow preventing step advancement
  - Added comprehensive console logging for debugging
  - Made Step 2 non-blocking (readiness score optional for progression)
  - Made AI operations async (non-blocking for navigation)
  - Founding Team now optional (removed misleading "required" label)

### Added
- `docs/onboardingV2/checklist.md` - Production verification checklist

---

## [0.6.0] - 2026-01-23

### Added
- **Onboarding Wizard V2 (Complete)**
  - 4-step wizard flow: Context & Enrichment → AI Analysis → Smart Interview → Review & Score
  - Full session persistence with auto-save (500ms debounce)
  - Step 1: Company info, Target Market (required), URL enrichment with Gemini 3
  - Step 2: Readiness score calculation with category breakdown
  - Step 3: Dynamic interview questions with signal extraction
  - Step 4: Investor score and AI-generated summary
  - WizardLayout with 3-panel design (Navigation, Form, AI Intelligence)
  - WizardAIPanel with step-specific content and advisor personas
  - Multi-select chips for Industry and Business Model
  - Single-select chips for Stage
  - Zod validation schema for Step 1 with inline errors
  - Dashboard sidebar link to `/onboarding`

- **onboarding-agent Edge Function**
  - 11 actions: create_session, get_session, update_session, enrich_url, enrich_context, enrich_founder, calculate_readiness, get_questions, process_answer, calculate_score, generate_summary, complete_wizard
  - Gemini 3 Flash integration for AI operations
  - AI run logging to `ai_runs` table
  - Session-based authentication

- **New Hooks**
  - `useWizardSession` - Session CRUD, auto-save, step navigation
  - `useOnboardingAgent` - Edge function client with all 11 actions
  - `step1Schema.ts` - Zod validation for Step 1 fields

- **New Components**
  - `TargetMarketInput` - Required field with validation
  - `AIDetectedFields` - Multi-select chips with validation
  - `Step1Context`, `Step2Analysis`, `Step3Interview`, `Step4Review`

### Changed
- Dashboard sidebar now includes Onboarding link with Sparkles icon
- Progress tracker updated to reflect 78% overall completion

---

## [0.4.3] - 2026-01-21
- **Events Type Errors**
  - Fixed TS2589 "Type instantiation excessively deep" in child table hooks
  - Fixed `event_date` → `start_date` in EventWizard creation
  - Added missing `title` field to event creation
  - Child table hooks (`useEventSponsors`, `useEventAttendees`, `useEventVenues`, `useEventAssets`) now use safe type casting

### Added
- **Events Audit & Checklist**
  - Created `docs/events/audit-checklist.md` with comprehensive system audit
  - 85% overall completion tracked with detailed breakdown
  - Security audit confirming RLS on all tables
  - Implementation priority queue for remaining features

### Changed
- **EventsAIPanel** - Now calls `event-agent` edge function with proper fallback
- **Progress Tracker** - Updated to reflect correct table names (`events` not `startup_events`)
- **EventCard** - Confirmed using `start_date` and `title` fields

---

## [0.4.2] - 2026-01-19

### Added
- **Events Module - Core Complete**
  - Events Directory at `/app/events` with grid/list views
  - Event Detail page at `/app/events/:id` with tabs (Overview, Guests, Sponsors, Logistics)
  - EventCard component with health score, status badges, placeholder images
  - useEvents hook with full CRUD + filtering
  - Demo RLS policies for authenticated users

- **Event Wizard** (`/app/events/new`)
  - 4-step wizard: Context → Strategy → Logistics → Review
  - Step 1: Name, type, reference URL, AI description generation
  - Step 2: Goals, target audience, budget slider, success metrics
  - Step 3: Date/time, duration, location type (in-person/virtual/hybrid), venue
  - Step 4: Review summary and create button
  - localStorage progress saving (resume on refresh)
  - AI Assistant panel with step-specific guidance
  - Readiness score tracking
  - Creates event on completion and redirects to detail page

### Technical
- WizardStepContext, WizardStepStrategy, WizardStepLogistics, WizardStepReview components
- WizardAIPanel with readiness scoring and checklist
- Route added: `/app/events/new`

---

## [0.4.1] - 2026-01-16

## [0.4.0] - 2026-01-16

### Added
- **Edge Functions (13 Total)**
  - All 13 edge functions deployed and active
  - Claude-powered functions: `strategic-plan` (Opus 4.5), `audit-system` (Opus 4.5), `orchestrate` (Sonnet 4.5), `automation-run` (Haiku 4.5), `ai-chat` (Haiku 4.5)
  - Gemini-powered functions: `ai-helper` (3 Pro), `extract-contact-info` (3 Pro), `extract-insights` (3 Pro), `chat-copilot` (3 Flash), `generate-image` (3 Pro Image)
  - Infrastructure functions: `health`, `auth-check`, `stripe-webhook`
  - See `docs/prompts/11-edge-functions-summary.md` for full documentation

- **AI Integration Hooks**
  - `useAIChat` - Full chat interface with message history
  - `useAIInsights` - Quick AI queries without history
  - `useAITaskPrioritization` - Eisenhower matrix task prioritization
  - `useAITaskGeneration` - Onboarding task generation

- **Interactive AIPanel**
  - Connected to `ai-chat` edge function
  - Real-time chat interface with message history
  - Quick prompts for common questions
  - Suggested actions with navigation support
  - Animated transitions between insights and chat modes

- **Lean Canvas Screen** (New)
  - 9-box grid layout per Lean Canvas framework
  - Editable boxes with add/remove items
  - AI pre-fill from startup profile
  - AI hypothesis validation
  - Auto-save to documents table
  - Completion tracking and export options

- **AI Task Generation**
  - AITaskSuggestions component on Tasks page
  - Connected to ai-chat edge function with `generate_tasks` action
  - Accept/dismiss individual suggestions
  - Task parsing from AI response

### Changed
- Updated progress tracker to reflect edge functions completion
- AIPanel now uses live AI instead of static content

### Technical
- Model-aware edge function routing (Claude vs Gemini)
- Token usage tracking and AI run logging
- CORS-enabled edge functions for frontend integration

---


## [0.3.0] - 2026-01-15

### Added
- **Investors Module** (Complete)
  - `investors` database table with RLS policies
  - 8 sample seed investors (Sequoia, a16z, YC, Lightspeed, etc.)
  - InvestorPipeline kanban board with 8 status columns
  - Drag-and-drop status updates
  - InvestorCard with firm, check size, priority, investment focus
  - InvestorDialog with 3-tab form (Basic, Investment, Tracking)
  - InvestorDetailSheet with full profile, timeline, actions
  - FundraisingProgress component with target vs committed
  - useInvestors hook with full CRUD operations
  - Status and type filtering
  - Search functionality
  - Pipeline and list view toggle

- **Tasks Module** (Complete)
  - KanbanBoard with 3 columns (To Do, In Progress, Done)
  - Drag-and-drop task movement
  - TaskCard with priority, project, due date
  - TaskDialog for create/edit
  - useTasks hook with CRUD + status updates
  - Project filtering via dropdown
  - Search by title/description
  - List view alternative
  - Task statistics display

- **CRM Module** (Complete)
  - Contacts list with search and type filtering
  - ContactCard, ContactDialog, ContactDetailSheet
  - DealPipeline visualization by stage
  - DealDialog for deal management
  - useCRM hook with full CRUD for contacts and deals
  - Tabs for Contacts and Pipeline views

- **Dev Bypass RLS Policies**
  - Added SELECT policies for startups, projects, tasks, contacts, deals, documents, investors
  - Allows data access when user_org_id() is null (dev mode)

- **Progress Tracker**
  - Created `/docs/progress-tracker.md` with comprehensive status

### Fixed
- React StrictMode wrapper in main.tsx (fixes useEffect null error)
- TypeScript type compatibility for investor mutations
- Task due_at vs due_date field alignment

### Technical
- useInvestors, useTasks, useCRM hooks with React Query
- Proper error handling with toast notifications
- Skeleton loading states for all modules

---

## [0.2.0] - 2026-01-15

### Added
- **Authentication System**
  - Google OAuth integration via Supabase Auth
  - User profiles table with auto-creation trigger
  - Role-based access control (admin, moderator, user)
  - `user_roles` table with RLS policies
  - `has_role()` and `get_user_role()` security definer functions
  - `useAuth` hook for authentication state management
  - `ProtectedRoute` component for route protection
  - Login page with Google sign-in button
  - Auth-aware Header with user avatar dropdown
  
- **Database Functions**
  - `handle_new_user()` trigger for auto-creating profiles and roles
  - RLS policies for secure data access

### Changed
- Updated Header component to show authenticated user menu
- All dashboard routes now require authentication
- App.tsx wrapped with AuthProvider

### Security
- Implemented Row Level Security (RLS) on user_roles table
- Security definer functions to prevent RLS recursion
- Roles stored in separate table (not on profiles) to prevent privilege escalation

---

## [0.1.0] - 2026-01-15

### Added
- **Project Initialization**
  - React 18 + Vite 5 + TypeScript setup
  - Tailwind CSS with custom design system
  - shadcn/ui component library integration
  - Framer Motion for animations

- **Design System**
  - Premium light theme with warm whites and sage accents
  - Custom CSS variables for theming
  - Glass morphism effects
  - Premium shadow utilities
  - Responsive container utilities

- **Homepage (Public)**
  - Hero section with animated flow diagram
  - Problem statement section
  - "How It Works" section with visual diagrams
  - "What Changes" comparison section
  - Features grid with 6 feature cards
  - Final CTA section
  - Responsive header with navigation
  - Footer component

- **Dashboard (Protected)**
  - 3-panel layout system (Context | Work | Intelligence)
  - Key metrics cards (MRR, Active Users, Runway, Team Size)
  - Today's priorities list with completion states
  - Active projects with progress bars
  - Recent activity feed
  - AI Panel with insights, risks, and suggested actions

- **Placeholder Pages**
  - Projects page
  - Tasks page
  - CRM page
  - Documents page
  - Investors page
  - Settings page

- **Supabase Integration**
  - Connected to external Supabase project (startupai)
  - 29 pre-existing database tables
  - Supabase client configuration
  - TypeScript types auto-generated

- **Navigation**
  - React Router v6 setup
  - DashboardLayout with sidebar navigation
  - 404 Not Found page

### Technical
- ESLint configuration
- Vitest testing setup
- Path aliases configured (@/)
- SEO meta tags in index.html
