# StartupAI — Next Sessions

> **Updated:** 2026-03-18 | **Last session:** #45c (0.10.47, Mar 18)
> **Status:** All 3 phases done | Agency 12/12 ✅ | Skills wired 5/7 agents | 11 screens | ~93% overall | 688/688 tests | 0 TS errors

---

● ---
  Session 39 Grand Total — 6 Deliverables Shipped

  ┌─────┬──────────────────────────────────────────────────────────────────────┬───────┬────────────────────────────────────┐
  │  #  │                             Deliverable                              │ Tests │               Deploy               │
  ├─────┼──────────────────────────────────────────────────────────────────────┼───────┼────────────────────────────────────┤
  │ 1   │ Validator Fragments (scoring + composer)                             │ +30   │ validator-start v70                │
  ├─────┼──────────────────────────────────────────────────────────────────────┼───────┼────────────────────────────────────┤
  │ 2   │ Chat Mode Prompts (4 modes)                                          │ +30   │ ai-chat v87                        │
  ├─────┼──────────────────────────────────────────────────────────────────────┼───────┼────────────────────────────────────┤
  │ 3   │ Report Agency Badges (ICEChannelChip + NarrativeArcSummary + wiring) │ +21   │ frontend                           │
  ├─────┼──────────────────────────────────────────────────────────────────────┼───────┼────────────────────────────────────┤
  │ 4   │ Streaming AI Chat (SSE via Realtime)                                 │ +20   │ ai-chat v88                        │
  ├─────┼──────────────────────────────────────────────────────────────────────┼───────┼────────────────────────────────────┤
  │ 5   │ Sprint + Pitch + Investor Fragments (3 EFs)                          │ +20   │ sprint v6, pitch v67, investor v45 │
  └─────┴──────────────────────────────────────────────────────────────────────┴───────┴────────────────────────────────────┘

  Final Proof

  ┌─────────────────────────┬───────────────┬───────────────────────────────────────────────────────────────┐
  │         Metric          │ Session Start │                          Session End                          │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ Tests                   │ 389/389       │ 514/514 (+125)                                                │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ Build                   │ 6.79s         │ 6.81s                                                         │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ TypeScript              │ 0             │ 0                                                             │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ New files               │ —             │ 12 production + 5 test                                        │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ Edge functions deployed │ —             │ 6 (validator-start, ai-chat x2, sprint, pitch-deck, investor) │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ Agency archive tasks    │ 0/12          │ 8/12 (001-005, 009, 010, 039)                                 │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ Prompt fragments        │ 0/5           │ 5/5 complete                                                  │
  ├─────────────────────────┼───────────────┼───────────────────────────────────────────────────────────────┤
  │ Chat modes              │ 0/4           │ 4/4 complete                                                  │
  └─────────────────────────┴───────────────┴───────────────────────────────────────────────────────────────┘

  Suggested Next Steps

  ┌──────────┬─────────┬─────────────────────────────────────────────────────────┬────────────────────────────────────────────────────┐
  │ Priority │ Session │                          What                           │                      Why Now                       │
  ├──────────┼─────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
  │ 1        │ 45      │ Interview context → Report (task 22)                    │ Chat data → Composer — report feels disconnected   │
  │          │         │                                                         │ from interview                                     │
  ├──────────┼─────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
  │ 2        │ 46      │ POST-04: Research + Planning agent modes                │ Last Phase 3 item — Phase 3 → 4/4 ✅              │
  ├──────────┼─────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
  │ 3        │ 47      │ E2E tests (PROD-07) — Playwright                        │ 539 unit tests but 0 integration tests             │
  ├──────────┼─────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
  │ 4        │ 48      │ 13C + 13D: Data viz + Strategy layout polish            │ Report sections look inconsistent                  │
  ├──────────┼─────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
  │ 5        │ 49      │ PDF export cross-browser (3.1)                          │ Test Safari/Firefox/mobile                         │
  └──────────┴─────────┴─────────────────────────────────────────────────────────┴────────────────────────────────────────────────────┘

## Session 45: Skills Architecture + Expert Prompt + Validator Intelligence — DONE

### 45a: Skills Audit + Expert Prompt — DONE

| # | Task | Status | What |
|---|------|--------|------|
| 1 | Skills audit (29 skills) | DONE | Audited startup/ (12) + startupai/ (17), found 3 dupes, 2 stubs, 3 MVP overlap |
| 2 | Skills architecture plan | DONE | `agency/skills/skills-architecture-plan.md` — 10-section plan |
| 3 | STARTUP_EXPERT_PROMPT | DONE | `_shared/startup-expert.ts` — 3-layer (core + 8 screen overlays + 4 stage overlays + 7 domain blocks) |
| 4 | ai-chat wiring | DONE | Default chat uses expert prompt, specialized actions keep legacy |

**Deploy:** ai-chat v90 | **Tests:** 599/599 (+60)

### 45b: Validator Intelligence Upgrade — DONE

| # | Task | Status | What |
|---|------|--------|------|
| 1 | RESEARCH_FRAGMENT | DONE | Porter's Five Forces, market accessibility, founder optimism detection → research.ts |
| 2 | COMPETITORS_FRAGMENT | DONE | Competitive velocity, zombie detection, pricing landscape, win/loss → competitors.ts |
| 3 | MVP_FRAGMENT | DONE | Build/Buy/Skip, resource allocation, pivot criteria, GTM motion → mvp.ts |
| 4 | Types updated | DONE | 12 new optional fields across MarketResearch, Competitor, CompetitorAnalysis, MVPPlan, ScoringResult |
| 5 | 7 Verifier cross-section rules | DONE | TAM↔score, revenue↔pricing, projection growth, crowded market, MVP scope, unsourced TAM |
| 6 | Evidence quality scoring | DONE | Deterministic A/B/C/D grade counting → strong/moderate/weak with confidence note |

**Deploy:** validator-start v72 | **Tests:** 674/674 (+75) | **Fragments:** 5→8 | **Agents with fragments:** 2/7→5/7

---

## Skills Improvement — Progress Tracker

### Production Wiring Status

| Component | Before | After | Status |
|-----------|--------|-------|--------|
| AI Chat expert prompt | 12-line generic | 3-layer (core + 11 screens + 4 stages + 7 domains) | 🟢 Deployed v91 |
| Validator fragments | 5 (scoring, composer, sprint, pitch, investor) | 8 (+research, competitors, mvp) | 🟢 Deployed v72 |
| Agents with fragments | 2/7 (scoring, composer) | 5/7 (+research, competitors, mvp) | 🟢 Deployed |
| Verifier consistency rules | 4 basic checks | 11 checks (+7 cross-section v2 rules) | 🟢 Deployed |
| Evidence quality scoring | None | Deterministic A/B/C/D grade computation | 🟢 Deployed |
| Types for new fields | None | 12 optional fields across 5 interfaces | 🟢 Types updated |
| Chat coaching modes | 4 modes | 4 modes (unchanged) | 🟢 Deployed |
| Agency chat modes | 4 (pitch, growth, deal, canvas) | 4 (unchanged) | 🟢 Deployed |
| Public rate limiting | None | IP-based light tier for public mode | 🟢 Deployed v91 |
| CORS standardization | Mixed static/dynamic | All getCorsHeaders(req) | 🟢 Deployed v91 |
| Tests | 599 | 688 (+89 new) | 🟢 All passing |

### Skills → Edge Function Mapping

| Skill | Fragment | Edge Function | Status |
|-------|----------|--------------|--------|
| validation-scoring | SCORING_FRAGMENT | validator-start/scoring.ts | 🟢 Wired (Session 39) |
| challenger-narrative | COMPOSER_FRAGMENT | validator-start/composer.ts | 🟢 Wired (Session 39) |
| sprint-prioritizer | SPRINT_FRAGMENT | sprint-agent | 🟢 Wired (Session 43) |
| challenger-narrative | PITCH_DECK_FRAGMENT | pitch-deck-agent | 🟢 Wired (Session 43) |
| outbound-strategist | CRM_INVESTOR_FRAGMENT | investor-agent | 🟢 Wired (Session 43) |
| market-intelligence | RESEARCH_FRAGMENT | validator-start/research.ts | 🟢 Wired (Session 45b) |
| competitive-strategy | COMPETITORS_FRAGMENT | validator-start/competitors.ts | 🟢 Wired (Session 45b) |
| mvp-execution | MVP_FRAGMENT | validator-start/mvp.ts | 🟢 Wired (Session 45b) |
| sales-coach | PRACTICE_PITCH_PROMPT | ai-chat (coaching mode) | 🟢 Wired (Session 39) |
| growth-hacker | GROWTH_STRATEGY_PROMPT | ai-chat (coaching mode) | 🟢 Wired (Session 39) |
| deal-strategist | DEAL_REVIEW_PROMPT | ai-chat (coaching mode) | 🟢 Wired (Session 39) |
| behavioral-nudge | CANVAS_COACH_PROMPT | ai-chat (coaching mode) | 🟢 Wired (Session 39) |
| 8 startup skills | STARTUP_EXPERT_PROMPT | ai-chat (default chat) | 🟢 Wired (Session 45a) |
| lean-startup | — | lean-canvas-agent | 🟡 Not yet wired |
| startup-canvas | — | lean-canvas-agent | 🟡 Not yet wired |
| financial-modeling | — | composer Group C (inline) | 🟡 Already inline, no fragment needed |

### Remaining Work

### Phase 1: Skills Cleanup (1 session, ~2h)

| # | Action | Effort | What |
|---|--------|--------|------|
| 1 | Remove 3 nested duplicates | 5m | Delete `startupai/.agents/skills/{ai-startup-strategist,idea-validator,startup-analyst}` |
| 2 | Remove 2 redirect stubs | 5m | Delete `startup/{startup-idea-validation,creative-intelligence}` |
| 3 | Move 5 nested-only skills to top level | 10m | `startup-pitch`, `lean-startup`, `startup-positioning`, `startup-strategy-council`, `startup-canvas` |
| 4 | Merge MVP trio → 1 skill | 30m | Absorb mvp-planning + mvp-architect into mvp-execution |
| 5 | Merge news duo → 1 skill | 15m | Absorb ai-news-collector into daily-ai-news |
| 6 | Add YAML frontmatter to 3 skills | 10m | proposal-strategist, growth-hacker, deal-strategist |

**Result:** 29 → 22 canonical skills. Zero duplicates. Zero stubs.

### Phase 2: Validator Pipeline Upgrades — DONE ✅

| # | Fragment | Target Agent | Status |
|---|----------|-------------|--------|
| 1 | RESEARCH_FRAGMENT | research.ts | 🟢 Deployed v72 |
| 2 | COMPETITORS_FRAGMENT | competitors.ts | 🟢 Deployed v72 |
| 3 | MVP_FRAGMENT | mvp.ts | 🟢 Deployed v72 |
| 4 | Verifier 7 cross-section rules | verifier.ts | 🟢 Deployed v72 |
| 5 | Evidence quality scoring | scoring.ts | 🟢 Deployed v72 |

**Result:** 5/7 validator agents with fragment knowledge. 7 new consistency checks. Evidence quality computation.

### Phase 3: AI Chat + Audit Fixes — DONE ✅

| # | Action | Status |
|---|--------|--------|
| 1 | 3 screen overlays (/market-research, /investors, /experiments) | 🟢 Deployed v91 |
| 2 | gtm_strategy wired to /sprint-plan + /lean-canvas | 🟢 Deployed v91 |
| 3 | /crm narrowed to customer CRM (investors → /investors) | 🟢 Deployed v91 |
| 4 | Public-mode IP rate limiting | 🟢 Deployed v91 |
| 5 | CORS standardized (15 locations → getCorsHeaders) | 🟢 Deployed v91 |

**Result:** 11 screens covered, public abuse risk closed, CORS consistent.

### Future Work (not blocked)

| # | What | Target | Source Skills |
|---|------|--------|-------------|
| 1 | CANVAS_COACH_FRAGMENT | lean-canvas-agent/coach.ts | lean-startup, startup-canvas, behavioral-nudge |
| 2 | Additional chat modes | ai-chat | ai-startup-strategist (strategy mode), startup-strategy-council (council mode) |
| 3 | Financial enrichment | Composer Group C inline | financial-modeling |
| 4 | 3 E2E validator runs | validator-start | Test B2B SaaS, consumer, marketplace |
| 5 | Skills cleanup (Phase 1) | .agents/skills/ | Remove 3 dupes, 2 stubs, merge MVP trio |

---

## Session 44: Agency Arc Close (007/008/011/012) — DONE

| # | Task | Source | Status | What |
|---|------|--------|--------|------|
| 1 | MEDDPICC migration | 007 | DONE | `meddpicc_elements` JSONB column on deals table |
| 2 | MEDDPICC schema + persist | 008 | DONE | 8-element scoring in scoreDealSchema, auto-persist to deals |
| 3 | MEDDPICCScorecard component | 008 | DONE | 8-row bar chart, verdict badge, wired in InvestorDetailSheet |
| 4 | Canvas specificity backend | 011 | DONE | specificity_scores/evidence_gaps required, check_specificity action |
| 5 | Canvas specificity frontend | 011 | DONE | checkSpecificity hook, button + results card in CanvasAIPanel |
| 6 | Chat persistence fix | 012 | DONE | Fixed schema mismatches (removed last_tab/ended_at/started_at) |
| 7 | Chat persistence wiring | 012 | DONE | Wired into AIAssistantProvider — load/save/end lifecycle |

**Agency archive: 12/12 complete.** All prompt fragments, chat modes, report badges, MEDDPICC, specificity, persistence done.
**New files:** `MEDDPICCScorecard.tsx`, migration, 3 test files
**Modified:** `prompt.ts`, `investor-agent/index.ts`, `InvestorDetailSheet.tsx`, `useInvestorAgent.ts`, `coach.ts`, `lean-canvas-agent/index.ts`, `useCanvasCoach.ts`, `CanvasAIPanel.tsx`, `useAIChatPersistence.ts`, `AIAssistantProvider.tsx`
**Tests:** 539/539 (+25) | **Build:** 6.36s | **Lint:** 350 (was 351) | **TypeScript:** 0 errors

---

## Session 39: Wire Agency Fragments into Validator — DONE

| # | Task | Source | Status | What |
|---|------|--------|--------|------|
| 1 | Shared fragments module | 001-ALR | DONE | `_shared/agency-fragments.ts` — Deno Deploy-safe TypeScript exports (not Deno.readTextFile) |
| 2 | Scoring fragment | 002 | DONE | Full RICE definitions (Reach/Impact/Confidence/Effort), evidence tiers, bias detection wired into scoring agent |
| 3 | Composer fragment | 003 | DONE | Three-act narrative, win themes, ICE growth channels, behavioral framing wired into composer Group D |

**New files:** `supabase/functions/_shared/agency-fragments.ts`, `supabase/functions/validator-start/agency-fragments.ts`, `src/test/validator/agency-fragments.test.ts`
**Modified:** `scoring.ts` (import + replace inline), `composer.ts` (import + replace inline)
**Tests:** 423/423 (+34) | **Build:** 6.49s | **TypeScript:** 0 errors | **Deploy:** validator-start v70 ACTIVE

---

## Session 40: Chat Modes (POST-04 + Agency) — DONE

| # | Task | Source | Status | What |
|---|------|--------|--------|------|
| 1 | Shared chat modes module | 005 | DONE | `_shared/agency-chat-modes.ts` — 4 full mode prompts as TypeScript exports |
| 2 | ai-chat wiring | 005 | DONE | Removed 85-line hardcoded `COACHING_MODE_PROMPTS`, imported from shared module |
| 3 | Chat modes tests | 005+006 | DONE | 30 tests verifying frameworks, wiring, source files |

**Note:** Frontend (006) was already built — `ChatModeSelector` component exists with 5 mode buttons. Backend prompts were the bottleneck.
**New files:** `_shared/agency-chat-modes.ts`, `src/test/validator/agency-chat-modes.test.ts`
**Modified:** `ai-chat/index.ts` (import shared + remove hardcoded)
**Tests:** 453/453 (+64 total) | **Build:** 6.39s | **Deploy:** ai-chat v87 ACTIVE

---

## Session 41: Report Polish — DONE

| # | Task | Source | Status | What |
|---|------|--------|--------|------|
| 1 | ICEChannelChip | 004/13A | DONE | Growth channel pills with ICE scores, color-coded, sorted |
| 2 | NarrativeArcSummary | 004/13A | DONE | Three-act cards (Opportunity/Risk/Path Forward) from summary_verdict |
| 3 | Wire all 6 badges | 004 | DONE | NarrativeArc + EvidenceTier + WinTheme + ICE in overview; WinTheme in StrategicSummary |

**New files:** `ICEChannelChip.tsx`, `NarrativeArcSummary.tsx`, `AgencyReportBadges.test.tsx`
**Modified:** `ReportV2Layout.tsx` (imports + overview wiring), `StrategicSummary.tsx` (WinThemeLabel wiring)
**Agency badges:** 10/10 complete | **Tests:** 474/474 (+21) | **Build:** 6.36s

---

## Session 42: Streaming AI Chat — DONE

| # | Task | Source | Status | What |
|---|------|--------|--------|------|
| 1 | callGeminiChatStream | A3 | DONE | `_shared/gemini.ts` — streamGenerateContent + SSE parsing + ReadableStream reader |
| 2 | Backend wiring | A3 | DONE | ai-chat coaching + auth modes broadcast token_chunk via Realtime when stream=true |
| 3 | Frontend activation | A3 | DONE | `useRealtimeAIChat` sends stream:true — existing token_chunk handler now receives data |

**New file:** `src/test/validator/streaming-chat.test.ts` (20 tests)
**Modified:** `_shared/gemini.ts`, `ai-chat/index.ts`, `useRealtimeAIChat.ts`
**Tests:** 494/494 (+20) | **Build:** 6.45s | **Deploy:** ai-chat v88 ACTIVE

---

## Session 43: Sprint + Pitch + Investor Fragments — DONE

| # | Task | Source | Status | What |
|---|------|--------|--------|------|
| 1 | Sprint RICE/Kano | 009 | DONE | `SPRINT_FRAGMENT` — quadrant table, Kano examples, momentum sequencing, capacity planning |
| 2 | Pitch deck Challenger | 010 | DONE | `PITCH_DECK_FRAGMENT` — win themes, Challenger narrative, 5 persuasion principles, traction story |
| 3 | CRM investor MEDDPICC | 039 | DONE | `CRM_INVESTOR_FRAGMENT` — scoring table, signal timing, cold email framework |

**Agency prompt fragments: 5/5 complete.** All fragments now in `_shared/agency-fragments.ts`.
**New file:** `src/test/validator/agency-fragments-extended.test.ts` (20 tests)
**Deploy:** sprint-agent v6, pitch-deck-agent v67, investor-agent v45
**Tests:** 514/514 (+20) | **Build:** 6.81s

---

## Session 44: Remaining Agency Tasks

| # | Task | Source | Effort | What |
|---|------|--------|--------|------|
| 1 | Investor MEDDPICC schema | 007 | 1d | DB migration + types for MEDDPICC fields on deals |
| 2 | Investor MEDDPICC wiring | 008 | 0.5d | Frontend MEDDPICC display in investor detail |
| 3 | Lean canvas specificity | 011 | 0.5d | Wire specificity checks into canvas coach |

---

## Later

| Task | Source | Effort | What |
|------|--------|--------|------|
| Chat session persistence | 012 | 1d | Save/restore chat history across sessions |
| Interview context → Report | 22 | 2-3d | Chat extracts rich data but Composer barely uses it |
| ExtractorAgent expansion | A1 | 2d | Add channels, revenue model, competitive moat fields |
| Validation history timeline | A4 | 2d | Timeline view of all validation runs |
| Progress persistence | A5 | 3d | Resume interrupted pipelines from `validator_agent_runs` |
| Expert Knowledge wiring | A6 | 3d | Wire 19 playbooks into 5 agents via `getIndustryContext` |
| Sprint Plan full Kanban | M6 | 3d | Drag-drop board + sprint-agent AI generation |
| Composer standalone EF | V5 | 3d | Own Deno Deploy isolate — removes cascade timeout |
| Validator orchestrator v3 | V6 | 5d | DAG dispatch, per-agent retry, feature flag toggle |
| PDF export cross-browser | 3.1 | 1d | Test Safari, Firefox, mobile |
| Shareable links E2E | 3.2 | 0.5d | Generate → incognito → verify → test expiry |
| Data viz polish | 13C | 1d | Citation popovers, hover states |
| Strategy layout | 13D | 1d | Align sections to wireframe spec |
| E2E tests (Playwright) | PROD-07 | 3d | Set up Playwright + 5 critical flow suites |
| Edge function cleanup | PROD-08 | 1d | Remove 6 orphaned remote functions |
| GDPR data export | PROD-05 | 2d | `data-export` EF + cascade deletion |
