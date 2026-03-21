# StartupAI — Master Index & Progress Tracker

> **Version:** 30.0 | **Updated:** 2026-03-09
> **Audited by:** Claude Opus 4.6 (full codebase audit — 3 parallel agents, all domains verified)
> **Previous audits:** Supabase 93% A (2026-02-25), Gemini 92% A (2026-02-25), System 7/7 (2026-02-12), Skills 10/10 (2026-02-16)
> **Latest audit:** Full System Audit (2026-03-01) — 44 pages, 432 components, 115 hooks, 30 edge functions, 94 tables, 3,748 RAG chunks verified
> **Comprehensive tracker:** `tasks/progress-tracker-audit.md` (color-coded status for every subsystem)
> **Session 38 (2026-03-09):** POST-02: Sprint Board ← report import. `useSprintImport` hook, `source_action_id` dedup migration, Strategy tab "Start Next Sprint" button, per-dimension "Import to Sprint" button. 389/389 tests. Build 6.79s.
> **Session 37 (2026-03-09):** RT-AUDIT: 10-item Supabase Realtime overhaul (A1-A3 quick wins, B1-B3 new features, C1-C3 advanced). Exponential backoff, 7→1 dashboard channels, polling fallback, sprint sync, typing indicators, ingest progress, coach broadcast, report presence, health badge. Deployed ai-chat v85, knowledge-ingest v7, lean-canvas-agent v53. 389/389 tests.
> **Session 36 (2026-03-09):** K7: ai-chat hybrid search — rag.ts + search action switched to `hybrid_search_knowledge` (semantic + FTS + RRF). Removed 45-line duplicate embedding function. Deployed ai-chat (967KB). All proof tests pass.
> **Session 35 (2026-03-09):** K6 deployed + verified: 5/5 proof tests (RPC works, OPENAI_API_KEY set, 3,748 chunks, 0/3 previous runs had RAG). Mermaid diagrams 10 (verification) + 11 (full architecture: 10 consumers). Comprehensive vector system audit.
> **Session 34 (2026-03-08):** Vector storage audit: K6 validator direct RPC (no 401, no HTTP round-trip), K5 hybrid search in chat UI, citation fields in types. Mermaid diagram 09 (vector flow). Updated all trackers.
> **Session 33 (2026-03-08):** E2E audit: 8 issues found+fixed (C1-C3, H1-H3, M1-M2). 9 mermaid diagrams in `02-diagrams/`. knowledge-search 401 fix, realtime warn, pipeline startup guard, chat readiness fix. 389/389 tests.
> **Session 31 (2026-03-07):** PROD-06 Lint cleanup: 990→340 errors. Fixed 18 React hooks violations (exhaustive-deps, ref cleanup). Fixed case declarations, escape chars, prefer-const, require-imports. Excluded non-source dirs from ESLint. 3 new production prompts (PROD-06/07/08). 30 files, 389/389 tests.
> **Session 30 (2026-03-07):** pg-vector skills (15 issue fixes), Supabase live verification (90 migrations, 37 EFs, 56 tables confirmed), .env.example created.
> **Session 29 (2026-03-07):** Supabase migrations: CRM FK conditional (20260227110000), chat P0 idempotent (20260227110100), drop 17 redundant service_role RLS (20260307100000), split industry_questions FOR ALL (20260307100001). db reset applies through new migrations; verified per `.cursor/rules/supabase`.
> **Session 17 (2026-02-27):** Fixed React Error #31 (report crash), fixed auth redirect flow (3 bugs), MVP-01 V3 types foundation complete
> **Session 18 (2026-02-27):** Fixed tab nav (hero inside overview tab), BCG chart enhancements (5 components: Radar, Gap Analysis, Benchmarks, Maturity Funnel, Trend Lines)
> **Session 19 (2026-02-27):** MVP-02 (Composer Group E — 9 dimension Gemini calls + report versioning), MVP-03 (12-topic chat interview), MVP-04 (5 V3 components + useDimensionPage hook). Phase 2: 57%
> **Session 20 (2026-02-27):** MVP-05 (9 diagram components + Deep Dive tab + 3-act dimension nav grid + stepper navigation). Phase 2: 71%
> **Session 21 (2026-02-28):** Dashboard redesign (Focus + Expand: 101→25 data points, 12→3 zones), MVP-06+07 complete, Vercel build fix + production deploy. Phase 2: **100%**
> **Session 22 (2026-03-01):** 035-GCF (Composer Group C silent failure fix), 036-CUC (Competitor URL Context), 037-DSC (Dynamic AI suggestion chips for chat intake). 3 commits, Vercel production Ready.
> **Session 28 (2026-03-06):** Auth redirect race condition fix, Chat state persistence + race condition architecture (phase state machine + request identity), ScoringAgent pipeline timeout fix (15→30s), Duplicate AI icon fix, test fix. 389/389 tests. Full E2E flow verified.
> **Session 23 (2026-03-01):** 038-PPO (Pipeline parallelization — Research+Scoring parallel, timeout 300→140s), 039-VAR (V1-V3 agent runs tracking: pipeline→status→frontend). Free plan crash fixed.
> **Session 24 (2026-03-01):** 040-VRT (V4: Selective agent retry — new `validator-retry` edge function with cascade logic, per-agent retry buttons in frontend). Pipeline reliability complete.
> **Session 25 (2026-03-01):** K3: Canvas Coach RAG — wired `search_knowledge` vector search into lean-canvas-agent coach action with OpenAI embeddings, Gemini citation schema, graceful degradation, and frontend citation badges.
> **Session 26 (2026-03-01):** POST-01: Strategic Summary tab — 1 "Strategy" tab with 3 sections (Positioning Snapshot, Build Focus, Fundability Signals). `useStrategicSummary` hook with V2/V3 dual extraction. Pure client-side derivation, no API calls.
> **Audit 30 (2026-02-27):** Validator report React Error #31 — 7 fixes + 6 regression tests. Objects rendered as React children due to mixed V1/V2 JSONB.
> **Audit 31 (2026-02-27):** Auth redirect flow — redirectTo URL had query params breaking Supabase allowlist matching. 3 fixes + 26 regression tests.
> **Goal:** Best-in-class AI system to validate startup ideas — expert on startups, AI, and industries

### Status Key

| Icon | Meaning |
|------|---------|
| 🟢 | Complete and working |
| 🟡 | In progress or needs minor fix |
| 🔴 | Not started or missing |
| 🟥 | Blocked — missing dependency or critical failure |

---

## Executive Summary

| Metric | v27.0 (Mar 6) | v29.0 (Mar 7) | Delta | Status |
|--------|:-------------:|:-------------:|:-----:|:------:|
| Pages/Routes | 47 | **47** | — | 🟢 |
| React Components | 456 | **456** | — | 🟢 |
| Custom Hooks (total) | 112 | **112** | — | 🟢 |
| Hooks invoking Edge Functions | 40 | 40 | — | 🟢 |
| Edge Functions (active dirs) | 32 | **32** | — | 🟢 |
| Database Tables (live) | 94 | **94** | — | 🟢 |
| RLS-Enabled Tables | 94/94 (100%) | **94/94** (100%) | — | 🟢 |
| Validator Pipeline Agents | 7/7 | 7/7 | — | 🟢 |
| Knowledge Chunks (pgvector) | 4,251 | **3,748** | -503 (dedupe) | 🟢 |
| Tests (passing) | 389/389 | **389/389** | — | 🟢 |
| Test Files | 31 | **31** | — | 🟢 |
| Build | pass (Vercel Ready) | **pass** (Vercel Ready) | — | 🟢 |
| TypeScript | 0 errors | **0 errors** | — | 🟢 |
| Lint Problems | 990 | **340** | -650 | 🟢 |
| React Hooks Bugs Fixed | 0 | **18 files** | NEW | 🟢 |
| PROD-06 Lint Cleanup | — | **Complete** | NEW | 🟢 |
| Task Prompts | 38 files | **41 files** | +3 | 🟢 |
| Security Advisors | 1 WARN (leaked passwords) | 1 WARN | — | 🟡 |
| Vercel Production | Ready (startupai.me) | **Ready** | — | 🟢 |
| RAG (K4-K7) | K3 done | **K4-K7 ✅** | +4 tasks | 🟢 |
| RT-AUDIT (10 items) | — | **10/10 ✅** | NEW | 🟢 |
| POST-02 Sprint Import | — | **Complete** | NEW | 🟢 |
| **Overall Completion** | **~76%** | **~84%** | +8% | — |

---

## 1. Phase Progress

### Founder OS Delivery Plan (5 Phases, 29 Tasks, ~81 Days)

| Phase | Focus | Tasks | Effort | Status | % |
|-------|-------|:-----:|:------:|:------:|:-:|
| **1. CORE** | Fix E2E flow (Home → Chat → Report → Canvas → Dashboard) | 9 | 16d | 🟢 **9/9 Complete** (v0.10.27–29) | 100% |
| **2. MVP** | V3 consulting report (BCG-style, 9 dimension pages, diagrams) | 7 | 24d | 🟢 **7/7 Complete** (MVP-01–07 ✅) | 100% |
| **3. POST-MVP** | Enhanced features (4 tabs, Sprint import, agent modes) | 4 | 15d | 🟡 3/4 (POST-01, POST-02, POST-03 ✅) | 75% |
| **4. ADVANCED** | Differentiation (RAG planning, chat-driven editing, financials) | 4 | 15d | 🔴 Not started | 0% |
| **5. PRODUCTION** | Launch ready (security, performance, mobile, GDPR, lint, tests) | 8 | 21d | 🟡 **1/8 Complete** (PROD-06 ✅) | 28% |

### CORE Tasks (Phase 1) — Complete

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| CORE-01 | Fix CoachPanel | 🟢 | 100% | Working E2E | — | None |
| CORE-02 | Persistent AI Panel (360px) | 🟢 | 100% | DashboardLayout updated | — | None |
| CORE-03 | Auto-generate Lean Canvas | 🟢 | 100% | From validator report | — | None |
| CORE-04 | Home → Validate flow polish | 🟢 | 100% | Smooth transitions | — | None |
| CORE-05 | Remove M1-M5 dead screens | 🟢 | 100% | Experiments, Market Research, Opportunity pages removed | — | None |
| CORE-06 | Wire validation skills | 🟢 | 100% | ~270 lines domain expertise in 7 agents | — | None |
| CORE-07 | Wire idea discovery skill | 🟢 | 100% | Extractor + Research agents enhanced | — | None |
| CORE-08 | Wire market intelligence | 🟢 | 100% | Scoring + Competitor agents enhanced | — | None |
| CORE-09 | Wire MVP execution skill | 🟢 | 100% | MVP + Composer agents enhanced | — | None |

**Phase 2 complete!** All 7 MVP tasks done. Next: Phase 3 (POST-MVP) or Dashboard polish.

---

## 2. Validator Pipeline (Core Product) — 7-Agent System

> 7-agent pipeline using Gemini 3 Flash — validates startup ideas in ~60-120s (300s deadline, paid plan 400s)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| ExtractorAgent | Extract startup profile (20+ fields) | 🟢 | 100% | JSON Schema output, refine mode | — | — |
| ResearchAgent | Market sizing (Google Search + URL Context + RAG) | 🟢 | 100% | Bottom-up, top-down, value theory | — | — |
| CompetitorAgent | Competitor analysis (background promise) | 🟢 | 100% | Decoupled from critical path | — | — |
| ScoringAgent | Multi-dimensional scoring + thinking:high | 🟢 | 100% | Evidence-based, 10-100 scale | — | — |
| MVPAgent | 30-day MVP plan from scoring risks | 🟢 | 100% | Features, milestones, validation metrics | — | — |
| ComposerAgent | 4-group parallel synthesis (8 report sections) | 🟢 | 95% | Groups A/B/C parallel, D sequential | No `responseJsonSchema` (intentional) | — |
| VerifierAgent | Report completeness validation (pure JS) | 🟢 | 100% | Markdown + section + citation checks | — | — |
| Skills → Agents | Domain knowledge in 7 agents + 4 composer groups | 🟢 | 100% | ~270 lines injected (v0.10.27) | — | — |
| Pipeline orchestration | Critical path: Extract→Research→Score→MVP→Compose→Verify | 🟢 | 100% | 300s deadline, grace periods | — | — |
| Zombie cleanup | Failed sessions after 360s | 🟢 | 100% | beforeunload handler | — | — |
| Rate limiting | Per-user sliding window (heavy: 5 req/5min) | 🟢 | 100% | 3 tiers configured | — | — |
| extractJSON repair | 6-strategy fallback (truncation, malformed) | 🟢 | 100% | Handles all edge cases | — | — |
| Integration tests | E2E pipeline test suite | 🔴 | 0% | — | No test suite | Write E2E tests |

### Pipeline Architecture

```
User Input → ExtractorAgent (60s) → ResearchAgent (40s) + CompetitorAgent (45s, background)
           → ScoringAgent (15s, thinking:high) → MVPAgent (30s) → [5s grace]
           → ComposerAgent (90s, 4 groups) → VerifierAgent (5s, pure JS)
           → Report stored → WebSocket broadcast → Frontend renders
```

---

## 3. Edge Functions (31 Active Directories)

| Function | Auth | CORS | AI Model | Status | Purpose |
|----------|:----:|:----:|----------|:------:|---------|
| **Validator Pipeline** | | | | | |
| `validator-start` | 🟢 | 🟢 | Gemini Flash | 🟢 | 7-agent pipeline orchestrator |
| `validator-status` | 🟢 | 🟢 | — | 🟢 | Pipeline progress queries |
| `validator-followup` | 🟢 | 🟢 | Gemini Flash | 🟢 | Chat followup questions |
| `validator-regenerate` | 🟢 | 🟢 | Gemini Flash | 🟢 | Re-run pipeline |
| `validator-panel-detail` | 🟢 | 🟢 | Gemini Flash | 🟢 | Section detail expansion |
| **AI Agents** | | | | | |
| `ai-chat` | 🟢 | 🟢 | Claude/Gemini | 🟢 | Multi-mode AI assistant (public/auth/coach) |
| `lean-canvas-agent` | 🟢 | 🟢 | Gemini Flash | 🟢 | 8-action canvas agent (prefill/suggest/validate/coach) |
| `industry-expert-agent` | 🟢 | 🟢 | Claude | 🟢 | Industry-specific guidance |
| `onboarding-agent` | 🟢 | 🟢 | Gemini Flash | 🟢 | 4-step onboarding AI (14 actions) |
| `pitch-deck-agent` | 🟢 | 🟢 | Gemini Pro | 🟢 | AI deck generation + image gen |
| `investor-agent` | 🟢 | 🟢 | Claude | 🟢 | 12-action investor agent |
| `documents-agent` | 🟢 | 🟢 | Gemini Pro | 🟢 | Document analysis |
| `crm-agent` | 🟢 | 🟢 | Claude | 🟢 | CRM intelligence |
| `task-agent` | 🟢 | 🟢 | Gemini Flash | 🟢 | 6-action task management |
| `sprint-agent` | 🟢 | 🟢 | Gemini Flash | 🟢 | Sprint planning |
| `event-agent` | 🟢 | 🟢 | Gemini Flash | 🟢 | Event management |
| **Knowledge & Research** | | | | | |
| `knowledge-ingest` | 🟢 | 🟢 | OpenAI Embed | 🟢 | Vector DB ingestion |
| `knowledge-search` | 🟢 | 🟢 | — | 🟢 | Semantic search |
| `load-knowledge` | 🟢 | 🟢 | OpenAI Embed | 🟢 | Bulk knowledge loading |
| `prompt-pack` | 🟢 | 🟢 | — | 🟢 | Prompt template library |
| **Workflows & Automation** | | | | | |
| `workflow-trigger` | 🟢 | 🟢 | — | 🟢 | Custom workflow automation |
| `compute-daily-focus` | 🟢 | 🟢 | Computed | 🟢 | Daily task prioritization |
| `action-recommender` | 🟢 | 🟢 | Claude | 🟢 | Next action recommendations |
| `insights-generator` | 🟢 | 🟢 | Claude | 🟢 | Business insights |
| **Dashboard & Metrics** | | | | | |
| `dashboard-metrics` | 🟢 | 🟢 | Computed | 🟢 | KPI calculations |
| `health-scorer` | 🟢 | 🟢 | Computed | 🟢 | 6-dimension health scoring |
| `stage-analyzer` | 🟢 | 🟢 | Claude | 🟢 | Startup stage assessment |
| `weekly-review` | 🟢 | 🟢 | Gemini Flash | 🟢 | AI weekly review + coaching |
| **Utilities** | | | | | |
| `share-meta` | 🟢 | 🟢 | — | 🟢 | Share metadata generation |
| `profile-import` | 🟢 | 🟢 | Gemini Flash | 🟢 | URL scraping + profile import |
| `_shared/` | — | — | — | 🟢 | 14 shared modules (auth, db, ai-client, gemini, errors, cors, rate-limit, prompts, types) |

### Shared Modules (`_shared/`) — 14 Files

| Module | Purpose | Status |
|--------|---------|:------:|
| `auth.ts` | JWT verification, role checking, startup access control | 🟢 |
| `database.ts` | CRUD, pagination, bulk ops, startup context | 🟢 |
| `ai-client.ts` | Unified Gemini + Claude interface, cost calculation | 🟢 |
| `gemini.ts` | Gemini with Search/URL Context/Thinking, 6-strategy JSON extraction | 🟢 |
| `errors.ts` | Error classes, response builders, input validators | 🟢 |
| `cors.ts` | CORS headers, preflight, middleware wrapper | 🟢 |
| `rate-limit.ts` | Per-user rate limiting (3 tiers) | 🟢 |
| `prompt-utils.ts` | Prompt templates, variable substitution | 🟢 |
| `master-system-prompt.ts` | Core identity, lean methodology, stage guidance | 🟢 |
| `industry-context.ts` | Industry playbook data for prompt grounding | 🟢 |
| `openai-embeddings.ts` | OpenAI embeddings for RAG | 🟢 |
| `types.ts` | Shared TypeScript interfaces | 🟢 |
| `mock-supabase.ts` | Test utilities | 🟢 |
| `index.ts` | Barrel export | 🟢 |

---

## 4. Frontend — Pages, Components, Hooks

### Pages (47 Routes)

#### Public Pages (10)

| Page | Route | Status | % | 💡 Next Action |
|------|-------|:------:|:-:|:--------------:|
| Landing | `/` | 🟢 | 100% | — |
| How It Works | `/how-it-works` | 🟢 | 100% | — |
| Features | `/features` | 🟢 | 100% | — |
| Blog Index | `/blog` | 🟢 | 100% | — |
| Blog Post | `/blog/:slug` | 🟢 | 100% | — |
| Public Events | `/events` | 🟢 | 100% | — |
| Public Event Detail | `/events/:eventId` | 🟢 | 100% | — |
| Shared Report | `/share/report/:token` | 🟢 | 100% | — |
| Login | `/login` | 🟢 | 100% | — |
| Auth Callback | `/auth/callback` | 🟢 | 100% | — |

#### Core App Pages (37 Protected)

| Page | Route | Status | % | AI Agent | 3-Panel |
|------|-------|:------:|:-:|----------|:-------:|
| **Dashboard** | `/dashboard` | 🟡 | 85% | health-scorer, action-recommender | 🟢 |
| **Onboarding Wizard** | `/onboarding` | 🟢 | 100% | onboarding-agent (14 actions) | 🟢 |
| **Onboarding Complete** | `/onboarding/complete` | 🟢 | 100% | — | — |
| **Validate Idea** | `/validate` | 🟢 | 100% | validator-start (7 agents) | 🟢 |
| **Validator Dashboard** | `/validator` | 🟢 | 90% | — | 🟢 |
| **Validator Progress** | `/validator/run/:sessionId` | 🟢 | 100% | validator-status | — |
| **Validator Report** | `/validator/report/:reportId` | 🟢 | 95% | PDF export | 🟢 |
| **Lean Canvas** | `/lean-canvas` | 🟢 | 100% | canvas-coach, lean-canvas-agent | 🟢 |
| **AI Chat** | `/ai-chat` | 🟢 | 80% | ai-chat (multi-mode) | 🟢 |
| **Company Profile** | `/company-profile` | 🟢 | 100% | profile-import | 🟢 |
| **User Profile** | `/user-profile` | 🟢 | 100% | — | — |
| **Pitch Deck Dashboard** | `/app/pitch-decks` | 🟢 | 100% | — | 🟢 |
| **Pitch Deck Wizard** | `/app/pitch-deck/new` | 🟢 | 100% | pitch-deck-agent | 🟢 |
| **Pitch Deck Editor** | `/app/pitch-deck/:id/edit` | 🟢 | 100% | AI + Critic panels | 🟢 |
| **Pitch Deck Generating** | `/app/pitch-deck/:id/generating` | 🟢 | 100% | — | — |
| **Projects** | `/projects` | 🟢 | 90% | — | 🟢 |
| **Project Detail** | `/projects/:projectId` | 🟢 | 90% | — | — |
| **Tasks** | `/tasks` | 🟢 | 90% | task-agent | 🟢 |
| **CRM** | `/crm` | 🟢 | 95% | crm-agent | 🟢 |
| **Investors** | `/investors` | 🟢 | 85% | investor-agent | 🟢 |
| **Documents** | `/documents` | 🟢 | 90% | documents-agent | 🟢 |
| **Events Dashboard** | `/app/events` | 🟢 | 85% | event-agent | 🟢 |
| **Event Detail** | `/app/events/:id` | 🟢 | 85% | — | — |
| **Event Wizard** | `/app/events/new` | 🟢 | 85% | — | — |
| **Analytics** | `/analytics` | 🟢 | 80% | — | — |
| **Weekly Review** | `/weekly-review` | 🟢 | 85% | weekly-review | — |
| **Settings** | `/settings` | 🟢 | 100% | — | — |
| **Embed Report** | `/embed/report/:token` | 🟢 | 100% | — | — |
| **Fashion Infographic** | `/fashion-infographic` | 🟢 | 100% | — | — |

#### Deprecated Redirects (4)

| Route | Redirects To | Status |
|-------|-------------|:------:|
| `/assumption-board` | `/dashboard` | 🟢 |
| `/decision-log` | `/dashboard` | 🟢 |
| `/sprint-plan` | `/tasks` | 🟢 |
| `/diagrams` | `/dashboard` | 🟢 |

### Component Inventory (429 Files, 38 Directories)

| Directory | Count | Status | AI Enabled | Key Components |
|-----------|:-----:|:------:|:----------:|----------------|
| `ui/` (shadcn) | 49 | 🟢 | — | button, card, dialog, form, tabs, sidebar, drawer, tooltip + 41 more |
| `onboarding/` | 52 | 🟢 | 80% | 4-step wizard, URLInput, InterviewNavigation, AIDetectedFields |
| `validator/` | 34 | 🟢 | 90% | ValidatorChat, ReportV2Layout, 10 V2 sections, 4 shared, StickyScoreBar |
| `blog/` | 34 | 🟢 | — | 6 AI reports, HeatmapTable, SkillsMatrix, MarketFunnel |
| `pitchdeck/` | 28 | 🟢 | 70% | SlideEditor, AIIntelligencePanel, CriticPanel, PresentationMode |
| `dashboard/` | 27 | 🟢 | 60% | MetricCard, TodaysFocus, StageGuidanceCard, AIStrategicReview |
| `home/` + `how-it-works/` | 20+ | 🟢 | — | HeroSection, AnimatedCursor, AppWindow, StepCapture |
| `marketing/` | 7 | 🟢 | — | ValuePillarsSection, OutcomesSection, FeaturesSection |
| `ai/` | 10 | 🟢 | 100% | GlobalAIAssistant, AIPanel, AIDrawer, AIFloatingIcon |
| `leancanvas/` | 9 | 🟢 | 80% | CanvasGrid, CanvasAIPanel, CanvasCoachChat, VersionHistory |
| `realtime/` | 6 | 🟢 | — | AnimatedBadge, AnimatedCard, AnimatedProgress, AnimatedScoreGauge |
| `coach/` | 5 | 🟢 | 90% | CoachPanel, CoachMessage, CoachInput, CoachProgress |
| `chat/` | 4 | 🟢 | 80% | ChatbotLauncher, EmbeddedChatPanel, ChatHistoryDialog |
| `crm/` | 4 | 🟢 | 60% | ContactCard, DealPipeline |
| `investors/` | 4 | 🟢 | 60% | InvestorCard, InvestorPipeline |
| `events/` | 4 | 🟢 | 50% | EventCard, EventDialog |
| `layout/` | 3 | 🟢 | — | DashboardLayout, Header, Footer |
| Other (14 dirs) | 129 | 🟡 | Varies | profile, settings, tasks, projects, documents, sharing, sprints, etc. |
| **TOTAL** | **429** | **95%** | **65%** | — |

### Hooks (110 Files, 85 Top-Level + 25 Subdirectory)

| Category | Count | Status | Key Hooks |
|----------|:-----:|:------:|-----------|
| **Agent Hooks** | 12 | 🟢 | useOnboardingAgent, useTaskAgent, useLeanCanvasAgent, usePitchDeckAgent, useInvestorAgent, useCRMAgent, useDocumentsAgent, useEventAgent, useSprintAgent, useActionRecommender, useIndustryExpert, useStep1AI |
| **Validator** | 4 | 🟢 | useValidatorPipeline, useValidatorRegenerate, useValidationReport, useValidationBoard |
| **Realtime** | 13 | 🟢 | useRealtimeSubscription, useRealtimeChannel, useEventsRealtime, useCRMRealtime, useValidatorRealtime, usePitchDeckRealtime, useCanvasRealtime + 6 more |
| **CRUD/Data** | 7 | 🟢 | useTasks, useEvents, useDocuments, useInvestors, useProjects, useCRM, usePitchDecks |
| **Dashboard** | 8 | 🟢 | useDashboardData, useDashboardMetrics, useModuleProgress, useJourneyStage, useCompletionUnlocks, useTopRisks, useSprints, useAnalytics |
| **AI Chat** | 5 | 🟢 | useAIChat, useAIChatPersistence, useGlobalAIAssistant, useCanvasCoach, useCoachSession |
| **Onboarding** | 7 | 🟢 | useInterview, useEnrichment, useScoring, usePromptPack, useInterviewPersistence, useOnboardingQuestions |
| **Stage/Journey** | 3 | 🟢 | useStageGuidance, useStageGuidanceAI, useStageAnalysis |
| **Pitch Deck** | 3 | 🟢 | usePitchDeckEditor, usePitchSuggestions, usePitchDeckGeneration |
| **Lean Canvas** | 2 | 🟢 | useLeanCanvas, useCanvasAutosave |
| **Auth & User** | 3 | 🟢 | useAuth, useFirstVisit, useSettings |
| **Utilities** | 15 | 🟢 | useDebounce, useMediaQuery, useMobileDetect, useScrollReveal, useCrossTabSync, useAIUsageLimits + 9 more |
| **Content** | 3 | 🟡 | useKnowledgeMap, useKnowledgeSearch, useInsights |
| **Sharing** | 3 | 🟢 | useShareableLinks, useShareAnalytics, useReportPanelDetail |
| **Other** | 22 | 🟢 | useWeeklyReviews, usePublicEvents, useHealthScore, useNotifications, etc. |

---

## 5. Supabase Database

> **Live DB:** 94 tables, 114+ migrations applied, RLS 94/94, 549 indexes, 120 triggers. **Session 29:** CRM FK + chat P0 conditional (db reset/shadow safe), 17 redundant service_role policies dropped, industry_questions FOR ALL split (example). See `supabase/migrations/VERIFICATION_CRM_RLS_2026.md` and `.cursor/rules/supabase`.

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| Migration idempotency | Conditional FK/table DDL (CRM, chat P0) | 🟢 | 100% | db reset applies through 20260307100001 | 20260227110400 view dep blocks full chain | Fix canvas_p0 if full reset needed |
| RLS cleanup | No redundant service_role; granular example | 🟢 | 100% | 17 policies dropped; industry_questions split | — | Over time: split other FOR ALL per rules |
| Core tables | profiles, orgs, org_members | 🟢 | 100% | All exist with RLS | — | — |
| Validator tables | sessions, reports, agent_runs, assessments | 🟢 | 100% | 76 sessions, 39 reports | — | — |
| Lean Canvas tables | canvases, versions | 🟢 | 100% | Auto-populate working | — | — |
| AI & Chat tables | chat_sessions, chat_messages, ai_runs | 🟢 | 100% | Full CRUD | — | — |
| Knowledge/RAG tables | knowledge_documents, knowledge_chunks | 🟢 | 100% | 4,251 chunks, pgvector | — | — |
| Workflow tables | workflows, triggers, actions | 🟢 | 100% | Schema deployed | — | — |
| Industry playbooks | 19 playbooks seeded | 🟢 | 100% | Prompt grounding active | — | — |
| Customer insights | segments, forces, jobs_to_be_done | 🟢 | 100% | Schema deployed | — | — |
| Experiments | experiments, experiment_results | 🟢 | 100% | Tables retained (pages removed) | — | — |
| Pitch decks | pitch_decks table | 🟢 | 100% | Full CRUD | — | — |
| Documents | document_versions | 🟢 | 100% | Version tracking | — | — |
| FK indexes | All foreign keys indexed | 🟢 | 100% | 549 indexes total | — | — |
| RLS policies | All 94 tables | 🟢 | 100% | initPlan caching, 0 bare auth.uid() | — | — |
| TypeScript types | Generated from schema | 🟢 | 100% | Auto-generated | — | — |
| `readiness_assessments` | Business readiness scoring | 🔴 | 0% | — | Table not created | Phase 2 (008-RDY) |
| `outcome_metrics` | ROI tracking | 🔴 | 0% | — | Table not created | Phase 2 (009-OUT) |
| `financial_models` | Financial projections | 🔴 | 0% | — | Table not created | Phase 4 |
| Storage buckets | File storage | 🔴 | 0% | — | Not configured | Phase 5 |
| pg_cron jobs | Scheduled tasks | 🔴 | 0% | — | Not configured | Phase 5 |

---

## 6. Knowledge/RAG System

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| Vector DB setup | pgvector extension, HNSW index | 🟢 | 100% | Deployed on Supabase | — | — |
| Knowledge documents | 51 docs ingested | 🟢 | 100% | Industry playbooks, competitor research | — | — |
| Knowledge chunks | 4,251 chunks with embeddings | 🟢 | 100% | text-embedding-3-small (OpenAI) | — | — |
| `search_knowledge` RPC | Semantic search function | 🟢 | 100% | Deployed with citation fields | — | — |
| Validator RAG integration | Research + Competitors use direct RPC | 🟢 | 100% | K6: admin client, no HTTP round-trip | — | — |
| E2E RAG verification | Verify chunks appear in pipeline logs | 🟢 | 100% | K6: 5/5 proof tests pass | — | — |
| CompetitorAgent RAG | Competitors use vector search | 🟢 | 100% | K6: direct RPC via admin client | — | — |
| Canvas Coach RAG | Coach uses RAG with citations | 🟢 | 100% | K3: 4,251 chunks, citation badges in UI | — | — |
| Hybrid search | Keyword + semantic + RRF fusion | 🟢 | 100% | K5: `hybrid_search_knowledge` RPC live | — | — |
| ai-chat hybrid | Chat search + RAG use hybrid | 🟢 | 100% | K7: rag.ts + search action both use hybrid | — | — |
| Vector schema v2 | content_hash, dedupe, chunk_kind | 🟢 | 100% | K4: unique index + CHECK, 384 rows cleaned | — | — |
| Chunking quality | 2400-4800 chars, table extraction, FTS | 🔴 | 0% | — | Not implemented | 014-VCK task |

---

## 7. AI Model Usage

| Use Case | Provider | Model | Edge Functions | Status |
|----------|----------|-------|:--------------:|:------:|
| Fast extraction/chat | Gemini | `gemini-3-flash-preview` | 12 | 🟢 |
| Deep analysis | Gemini | `gemini-3-pro-preview` | 3 | 🟢 |
| Latest deep analysis | Gemini | `gemini-3.1-pro-preview` | 1 | 🟢 |
| Image generation | Gemini | `gemini-3-pro-image-preview` | 1 | 🟢 |
| Complex reasoning | Claude | `claude-opus-4-6` | 6 | 🟢 |
| Fast tasks | Claude | `claude-haiku-4-5` | 2 | 🟢 |
| Balanced | Claude | `claude-sonnet-4-5` | — | 🟢 |
| RAG embeddings | OpenAI | `text-embedding-3-small` | 1 | 🟢 |

### Gemini API Compliance (Audit 28 — 92% A)

| Rule | Status | Details |
|------|:------:|---------|
| **G1** `responseJsonSchema` | 🟢 | All functions use JSON Schema (except Composer — intentional) |
| **G2** Temperature 1.0 | 🟢 | All 1.0 (lower causes looping) |
| **G4** API key in header | 🟢 | `x-goog-api-key` header everywhere |
| Thinking-aware extraction | 🟢 | ai-chat, industry-expert, onboarding — all fixed |
| 8 inline violations | 🟢 | All 8/8 migrated to shared patterns |

---

## 8. Authentication & Security

> **Auth audit (2026-02-27):** Full audit against Supabase official docs. 7 bugs found and fixed. Google/LinkedIn/Email flows verified E2E with Playwright.

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| Google OAuth | Sign in with Google | 🟢 | 100% | 9 users, `linkedin_oidc` correct | — | — |
| LinkedIn OIDC | Sign in with LinkedIn | 🟢 | 100% | 1 user, correct provider name | — | — |
| Email/Password (Dev) | Dev-only login, tree-shaken in prod | 🟢 | 100% | Working, test user created | — | — |
| Session Management | `onAuthStateChange` single listener | 🟢 | 100% | **Fixed:** Removed duplicate `getSession()`, event branching added | — | — |
| Auth Callback (OAuth) | Handle `SIGNED_IN` + `INITIAL_SESSION` | 🟢 | 100% | **Fixed:** 500ms timeout hack removed | — | — |
| Login pendingIdea | Email login preserves startup idea | 🟢 | 100% | **Fixed:** pendingIdea check added to Login.tsx | — | — |
| Sign-out cleanup | Clear sessionStorage on logout | 🟢 | 100% | **Fixed:** `auth:returnPath` + `pendingIdea` cleared | — | — |
| Protected Routes | ProtectedRoute wrapper | 🟢 | 100% | All authenticated routes | — | — |
| RLS Policies | 94/94 tables | 🟢 | 100% | initPlan cached, 0 bare auth.uid() | — | — |
| JWT Verification (code) | All 31 edge functions | 🟢 | 100% | `_shared/auth.ts` | — | — |
| JWT Verification (config) | config.toml verify_jwt | 🟢 | 100% | S2/S4 fixes applied | — | — |
| CORS Restriction | App domain only | 🟢 | 100% | `_shared/cors.ts` (dynamic, all 42+ functions) | — | — |
| Rate Limiting | 3 tiers (heavy/normal/light) | 🟡 | 85% | Per-user sliding window | 4 functions missing rate limits | Add to pitch-deck, onboarding, industry-expert, sprint |
| No Hardcoded Secrets | All from `Deno.env.get()` | 🟢 | 100% | Verified | — | — |
| Private IP Blocking | profile-import blocks localhost | 🟢 | 100% | URL validation | — | — |
| Dev Bypass Auth | DEV-only, guarded | 🟡 | 90% | — | Verify `false` in prod | Config check |
| Leaked Password Protection | Supabase Dashboard toggle | 🟡 | 0% | — | **Requires Pro Plan** | Upgrade to Pro, then enable |
| MFA | Multi-factor auth | 🔴 | 0% | — | Not needed for MVP | Phase 5 |

---

## 9. Design System

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| Tailwind Config | Custom theme with CSS vars | 🟢 | 100% | Dark mode, 12+ semantic colors | — | — |
| Color System | Emerald primary, off-white bg | 🟢 | 100% | Premium luxury SaaS aesthetic | — | — |
| Typography | Inter (body) + Playfair Display (display) | 🟢 | 100% | Google Fonts imported | — | — |
| shadcn/ui Library | 49 Radix components | 🟢 | 100% | Fully configured | — | — |
| Dark Mode | Class-based toggle | 🟢 | 100% | All colors adjusted | — | — |
| Animations | Framer Motion + CSS | 🟢 | 100% | fade-in-up, slide-in-right, pulse-soft | — | — |
| Responsive | Mobile-first utilities | 🟢 | 100% | touch-target, responsive text/spacing | — | — |
| Print Styles | A4 page, hide nav | 🟢 | 100% | break-inside avoid | — | — |
| Accessibility | prefers-reduced-motion | 🟢 | 100% | Animations disabled when set | — | — |
| 3-Panel Layout | Context / Work / Intelligence | 🟢 | 100% | 24 screens using pattern | — | — |
| Style Guide | `tasks/style-guide.md` (1,223 lines) | 🟢 | 100% | Tokens, components, layout specs | — | — |

---

## 10. User Journeys

| Journey | Screens | Status | % | ⚠️ Missing | 💡 Next Action |
|---------|---------|:------:|:-:|:----------:|:--------------:|
| **Validate idea** | Intake → Progress → Report | 🟢 | 100% | — | — |
| **Build canvas** | Report → Lean Canvas (auto-populate) | 🟢 | 100% | — | — |
| **Create pitch deck** | Wizard → Editor → Generate | 🟢 | 100% | — | — |
| **Onboarding** | 4-step wizard (URL → Analysis → Interview → Review) | 🟢 | 100% | — | — |
| **Manage investors** | Pipeline → Cards → Deals | 🟢 | 95% | — | — |
| **CRM tracking** | Contacts → Deals → Pipeline | 🟢 | 95% | — | — |
| **Plan sprints** | Report → Sprint Board (import) | 🟡 | 55% | Import from report done | Kanban drag-drop, sprint-agent integration |
| **Share report** | Report → Share Link → Public View | 🟡 | 40% | Tables exist, needs testing | Test expiry + views |
| **Deep market dive** | Report → Market Analysis | 🔴 | 0% | Standalone page not built | Phase 2 |
| **Competitor map** | Report → Competitor Intelligence | 🔴 | 0% | Standalone page not built | Phase 2 |
| **Check readiness** | All data → Readiness Assessment | 🔴 | 0% | Full build needed | Phase 2 |
| **Track outcomes** | All data → Outcomes Dashboard | 🔴 | 0% | Full build needed | Phase 2 |
| **Knowledge search** | Coach → RAG hybrid search → Cited answer | 🟢 | 95% | K5 hybrid + K7 ai-chat wired | Minor polish |
| **Expert advice** | Agent → Playbook + RAG → Expert response | 🟢 | 80% | K3 canvas coach + K6 validator direct RPC | Expert agent RAG wiring |

---

## 11. Build & Test Verification (Verified 2026-02-27)

| Command | Status | Detail | Verified |
|---------|:------:|--------|:--------:|
| `npm run build` | 🟢 | **6.79s**, code-split, no chunk warnings | 2026-03-09 |
| `npm run test` | 🟢 | **389/389 pass** (31 test files, 0 failures, 2.46s) | 2026-03-09 |
| `npx tsc --noEmit` | 🟢 | **0 errors** | 2026-03-09 |
| `npm run lint` | 🟢 | **340 problems** (was 990 → PROD-06 cleanup) | 2026-03-09 |
| Code splitting | 🟢 | 40+ lazy chunks via `React.lazy()` | 2026-03-09 |
| Largest chunk | 🟢 | recharts 440kB (R7 split: jspdf 391kB + html2canvas 201kB) | 2026-03-09 |

---

## 12. Lean Task Progress — P2 MVP (Next Phase)

### Founder OS Phase 2 Tasks

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| MVP-01 | V3 types foundation | 🔴 | 0% | — | Type system not started | **Start here** |
| MVP-02 | Composer Group E expansion | 🔴 | 0% | — | Not started | After MVP-01 |
| MVP-03 | Chat interview 8→12 topics | 🔴 | 0% | — | Not started | After MVP-01 |
| MVP-04 | DimensionPage shared components (5 new) | 🔴 | 0% | — | Not started | After MVP-02 |
| MVP-05 | 9 Dimension detail pages | 🟢 | 100% | Session 20 | 9 diagrams + Deep Dive tab + nav grid + stepper | Done |
| MVP-06 | Report AI Panel | 🔴 | 0% | — | Not started | After MVP-05 ✅ |
| MVP-07 | AI Lean Canvas page | 🔴 | 0% | — | Not started | After MVP-05 ✅ |

### Infrastructure Tasks (Parallel)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:------------:|:----------:|:--------------:|
| 010-SHR | Share Links | 🟡 | 40% | Tables + pages exist | Test expiry + view tracking | E2E test |
| 011-MKT | Market Analysis Deep Dive | 🟡 | 40% | TAM/SAM in report | Standalone page + benchmarks | Build page |
| 012-CMP | Competitor Intelligence | 🟡 | 35% | Competitor data in report | Positioning matrix, SWOT | Build page |
| 013-VCS | Vector Schema v2 | 🟡 | 15% | content_hash added | Dedupe + citation fields | Migration |
| 014-VCK | Vector Chunking Quality | 🔴 | 0% | — | Larger chunks + FTS | After 013 |
| 015-VHS | Vector Hybrid Search | 🔴 | 0% | — | hybrid_search + Coach wiring | After 014 |
| 016-VAR | Validator Agent Runs Schema | 🟡 | 25% | Table + indexes + RLS exist | Pipeline not writing rows | **Wire pipeline** |
| 020-EKS | Expert Knowledge System | 🟡 | 10% | 19 playbooks seeded | Prompt packs + RAG unification | After RAG |

### Reliability Tasks (from next-steps.md)

| Task | Description | Status | % | ⚠️ Missing | 💡 Next Action |
|------|-------------|:------:|:-:|:----------:|:--------------:|
| S3 | Leaked password protection | 🔴 | 0% | Dashboard toggle | **Toggle ON (2 min)** |
| K1 | Verify RAG in pipeline logs | 🟢 | 95% | Verified 2026-02-26 | Code wired in research + competitors |
| R4 | Pin edge function dependency versions | 🔴 | 0% | Unpinned deps | Pin in import_map.json |
| R6 | Reduce lint errors 200→<100 | 🟢 | 95% | 200 remaining (was 937) | Mostly `no-explicit-any` left |
| R8 | ai-client.ts timeout/retry | 🔴 | 0% | No timeout wrapper | Add Promise.race |
| R9 | Temperature model selector fix | 🔴 | 0% | temp=0 selects Pro | Proper model config |

---

## 13. Lean Task Progress — P2 Legacy Tasks

### Removed Tasks (CORE-05 Cleanup)

| Task | Area | Status | Notes |
|------|------|:------:|-------|
| 005-EXP | Experiments Lab | ❌ REMOVED | Page, components, hook, EF removed (v0.10.27). DB tables retained. |
| 006-RES | Market Research Hub | ❌ REMOVED | Page, components, hook, EF removed (v0.10.27). DB tables retained. |
| 007-OPP | Opportunity Canvas | ❌ REMOVED | Page, components, hook, EF removed (v0.10.27). DB tables retained. |

### Not Started (Phase 2-3)

| Task | Description | Status | % | Depends On |
|------|-------------|:------:|:-:|:----------:|
| 008-RDY | Business Readiness Check | 🔴 | 0% | Phase 2 screen |
| 009-OUT | Outcomes Dashboard | 🔴 | 0% | Phase 2 screen |
| 017-VCS | Validator Composer Split | 🔴 | 0% | 016-VAR |
| 018-VPA | Validator Parallel Agents | 🔴 | 0% | 017-VCS |
| 019-VOR | Validator Orchestrator v2 | 🔴 | 0% | 018-VPA |

---

## 14. Lean System — Agents & Workflows

### Agent Architecture (13 Agent Spec Files, 177KB)

| Spec File | Agent Category | Agents Defined | Status |
|-----------|---------------|:--------------:|:------:|
| `01-orchestrator-agents.md` | Orchestrators | Pipeline, workflow, session managers | 🟢 Spec'd |
| `02-planner-agents.md` | Planners | Sprint, roadmap, milestone planners | 🟢 Spec'd |
| `03-analyst-agents.md` | Analysts | Market, competitor, risk analyzers | 🟢 Spec'd |
| `04-automation-agents.md` | Automation | Task, CRM, event automation | 🟢 Spec'd |
| `05-content-agents.md` | Content | Report, pitch deck, document generators | 🟢 Spec'd |
| `06-retriever-agents.md` | Retrievers | Knowledge, RAG, search agents | 🟢 Spec'd |
| `07-extractor-agents.md` | Extractors | Profile, URL, data extractors | 🟢 Spec'd |
| `08-controller-agents.md` | Controllers | Rate limit, auth, access controllers | 🟢 Spec'd |
| `09-agent-schemas.md` | Schemas | JSON schemas for all agent I/O | 🟢 Spec'd |
| `10-agent-workflows.md` | Workflows | Multi-agent workflow definitions | 🟢 Spec'd |
| `11-best-practices.md` | Best Practices | Agent development guidelines | 🟢 Spec'd |
| `12-industry-agents.md` | Industry | 124KB of industry-specific agent configs | 🟢 Spec'd |

### Active AI Agents (Deployed & Working)

| Agent | Edge Function | Model | Actions | Status |
|-------|--------------|-------|:-------:|:------:|
| Validator (7-agent) | `validator-start/` | Gemini Flash | 7 agents | 🟢 |
| Validator Follow-up | `validator-followup/` | Gemini Flash | 1 | 🟢 |
| Canvas Coach | `lean-canvas-agent/` | Gemini Flash | 8 | 🟢 |
| Onboarding | `onboarding-agent/` | Gemini Flash | 14 | 🟢 |
| Pitch Deck | `pitch-deck-agent/` | Gemini Pro | 4 | 🟢 |
| Investor | `investor-agent/` | Claude | 12 | 🟢 |
| Task Manager | `task-agent/` | Gemini Flash | 6 | 🟢 |
| CRM | `crm-agent/` | Claude | 3 | 🟢 |
| Documents | `documents-agent/` | Gemini Pro | 2 | 🟢 |
| Events | `event-agent/` | Gemini Flash | 2 | 🟢 |
| Industry Expert | `industry-expert-agent/` | Claude | 1 | 🟢 |
| AI Chat | `ai-chat/` | Claude/Gemini | 3 modes | 🟢 |
| Health Scorer | `health-scorer/` | Computed | 1 | 🟢 |
| Action Recommender | `action-recommender/` | Claude | 1 | 🟢 |
| Stage Analyzer | `stage-analyzer/` | Claude | 1 | 🟢 |
| Insights Generator | `insights-generator/` | Claude | 1 | 🟢 |
| Daily Focus | `compute-daily-focus/` | Computed | 1 | 🟢 |
| Weekly Review | `weekly-review/` | Gemini Flash | 1 | 🟢 |
| Profile Import | `profile-import/` | Gemini Flash | 1 | 🟢 |

---

## 15. Dashboards, Wizards & Chatbots

| Feature | Type | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|---------|------|:------:|:-:|:------------:|:----------:|:--------------:|
| **Main Dashboard** | Dashboard | 🟡 | 85% | MetricCards, TodaysFocus, StageGuidance, AIStrategicReview, InsightsTabs | Command Centre redesign | Phase 2 redesign |
| **Validator Dashboard** | Dashboard | 🟢 | 90% | Mode selector, history, industry filters | — | — |
| **Pitch Deck Dashboard** | Dashboard | 🟢 | 100% | DeckCard, Filters, PortfolioSummary | — | — |
| **Analytics Dashboard** | Dashboard | 🟢 | 80% | Charts, metrics | — | — |
| **Onboarding Wizard** | Wizard | 🟢 | 100% | 4-step: URL→Analysis→Interview→Review (52 components) | — | — |
| **Pitch Deck Wizard** | Wizard | 🟢 | 100% | 4-step: Company→Problem→Canvas→Generate (10 components) | — | — |
| **Event Wizard** | Wizard | 🟢 | 85% | Event creation flow | — | — |
| **AI Chat** | Chatbot | 🟢 | 80% | Multi-mode (public/auth/coach), history, quick actions | Tool calling | Phase 3 |
| **Validator Chat** | Chatbot | 🟢 | 100% | Chat + follow-up + coaching + streaming | — | — |
| **Canvas Coach** | Chatbot | 🟢 | 100% | Canvas-specific coaching, suggestion popover | — | — |
| **Global AI Assistant** | Chatbot | 🟢 | 80% | Floating icon, drawer, bottom sheet | Deeper integration | Phase 3 |
| **Coach Panel** | Chatbot | 🟢 | 100% | CoachMessage, CoachInput, QuickActions | — | — |
| **Embedded Chat** | Chatbot | 🟢 | 90% | ChatbotLauncher, EmbeddedChatPanel | — | — |

---

## 16. Realtime Features

| Feature | Hook | Status | % | Notes |
|---------|------|:------:|:-:|-------|
| RT-1 Validator progress | useValidatorRealtime | 🟢 | 100% | WebSocket broadcasts from pipeline |
| RT-2 Canvas collaboration | useCanvasRealtime | 🟢 | 100% | Multi-user editing |
| RT-4 CRM updates | useCRMRealtime | 🟢 | 100% | Live deal changes |
| RT-5 Document sync | useDocumentsRealtime | 🟢 | 100% | Real-time document updates |
| RT-6 Event updates | useEventsRealtime | 🟢 | 100% | Live event changes |
| RT-7 Investor updates | useInvestorsRealtime | 🟢 | 100% | Pipeline changes |
| RT-8 Pitch deck sync | usePitchDeckRealtime | 🟢 | 100% | Collaborative editing |
| RT-3 Chat streaming | useChatRealtime | 🟡 | 70% | Basic, deferred for full implementation |
| Onboarding progress | useOnboardingRealtime | 🟢 | 100% | Step completion tracking |
| AI Chat realtime | useRealtimeAIChat | 🟢 | 100% | Message sync + typing indicators (B-2) |
| Cofounder presence | useCofounderPresence | 🟢 | 100% | Online indicators |
| Animated components | 6 animation components | 🟢 | 100% | Badge, Card, Progress, ScoreGauge, RiskAlert, Shimmer |
| **RT-AUDIT (Session 37)** | | | | |
| A-1 Reconnection backoff | supabase/client.ts | 🟢 | 100% | Exponential 1s→30s max |
| A-2 Dashboard consolidation | useRealtimeSubscription | 🟢 | 100% | 7→1 multiplexed channel |
| A-3 Polling fallback | usePollingFallback | 🟢 | 100% | Adopted in 5 domain hooks |
| B-1 Sprint board sync | useSprintRealtime | 🟢 | 100% | Live Kanban updates |
| B-2 Chat typing indicators | useRealtimeAIChat | 🟢 | 100% | + topic mismatch fix |
| B-3 Ingest progress | useKnowledgeIngestRealtime | 🟢 | 100% | Per-batch broadcast |
| C-1 Canvas coach broadcast | useCanvasRealtime | 🟢 | 100% | coach_suggestions event |
| C-2 Report presence | useReportPresence | 🟢 | 100% | Supabase Presence API |
| C-3 Health badge | useRealtimeHealth | 🟢 | 100% | Green/yellow/red + latency |

---

## 17. Feature Status Matrix

### Core Features (Shipped)

| # | Feature | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|:-:|---------|:------:|:-:|:------------:|:----------:|:--------------:|
| 1 | **Validator Pipeline** (7 agents) | 🟢 | 95% | 76 sessions, 39 reports E2E | Integration tests | Write E2E tests |
| 2 | **Validator Chat** | 🟢 | 100% | Multi-turn + streaming + coaching | — | — |
| 3 | **Validator Report** (V2, 14 sections) | 🟢 | 95% | 6 visual components, PDF export | Chat coach in report | Phase 3 |
| 4 | **Authentication** (OAuth) | 🟢 | 95% | Google + LinkedIn | MFA (not needed) | — |
| 5 | **Onboarding Wizard** (4 steps) | 🟢 | 100% | 52 components, AI extraction | — | — |
| 6 | **Lean Canvas** | 🟢 | 100% | Auto-populate, AI coach, versioning | — | — |
| 7 | **Pitch Deck System** | 🟢 | 95% | Wizard + Editor + Image Gen + Presentation | — | — |
| 8 | **Database Schema** (94 tables) | 🟢 | 95% | 100% RLS, 549 indexes | 3 tables missing | Phase 2 |
| 9 | **Edge Functions** (31 active) | 🟢 | 95% | All JWT + CORS + rate limiting | — | — |
| 10 | **Gemini Integration** (12 functions) | 🟢 | 95% | G1/G2/G4 compliant, 92% A audit | — | — |

### Secondary Features (Shipped)

| # | Feature | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|:-:|---------|:------:|:-:|:------------:|:----------:|:--------------:|
| 11 | **CRM** | 🟢 | 95% | Contacts, Deals, Pipeline | — | — |
| 12 | **Company Profile** | 🟢 | 100% | URL import, headquarters | — | — |
| 13 | **Tasks** | 🟢 | 90% | Kanban, AI prioritization | — | — |
| 14 | **Documents** | 🟢 | 90% | Storage, AI extraction | — | — |
| 15 | **Investors** | 🟢 | 85% | 12-action agent, pipeline | — | — |
| 16 | **Dashboard** | 🟡 | 85% | Metrics, focus, guidance | Command Centre redesign | Phase 2 |
| 17 | **Events** | 🟢 | 85% | Management + wizard + public | — | — |
| 18 | **Blog System** | 🟢 | 100% | 6 AI reports, visualizations | — | — |
| 19 | **Weekly Review** | 🟢 | 85% | AI coaching + review | — | — |

### Growth Features (In Progress)

| # | Feature | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next Action |
|:-:|---------|:------:|:-:|:------------:|:----------:|:--------------:|
| 20 | **Knowledge/RAG** | 🟢 | 95% | 3,748 chunks, hybrid search, K3-K7 ✅ | Chunking quality | 014-VCK |
| 21 | **Realtime** | 🟢 | 95% | RT-AUDIT 10/10, 22+ hooks | RT-3 streaming | Phase 3 |
| 22 | **AI Chat** | 🟢 | 80% | Multi-mode, history | Tool calling | Phase 3 |
| 23 | **Analytics** | 🟢 | 80% | Charts, metrics | — | — |
| 24 | **Industry Playbooks** | 🟡 | 70% | 19 seeded | Prompt pack data | 020-EKS |
| 25 | **Sprint Planning** | 🟡 | 55% | Import from report done (POST-02) | Kanban drag-drop + sprint-agent | 002-PLN |
| 26 | **Share Links** | 🟡 | 40% | Tables + pages exist | Expiry testing, view tracking | 010-SHR |

### Future Features (Not Started)

| # | Feature | Status | % | Depends On |
|:-:|---------|:------:|:-:|:----------:|
| 27 | **Market Research Hub** | 🔴 | 0% | Phase 2 (standalone page) |
| 28 | **Competitor Intelligence** | 🔴 | 0% | Phase 2 (standalone page) |
| 29 | **Business Readiness** | 🔴 | 0% | Phase 2 (008-RDY) |
| 30 | **Outcomes Dashboard** | 🔴 | 0% | Phase 2 (009-OUT) |
| 31 | **9 Dimension Pages** | 🟢 | 100% | Phase 2 (MVP-05) — Session 20 |
| 32 | **V3 Report (BCG-style)** | 🟡 | 20% | MVP-01 ✅ types + 5 BCG chart components live. MVP-02→07 remaining |
| 33 | **Coach System (full)** | 🔴 | 10% | Phase 3 |
| 34 | **Idea Wall** | 🔴 | 0% | Phase 3 (021-IDW) |
| 35 | **Story Map** | 🔴 | 0% | Phase 3 (022-STM) |
| 36 | **Knowledge Map** | 🔴 | 0% | Phase 3 (023-KNW) |
| 37 | **Mobile Optimization** | 🔴 | 0% | Phase 5 |
| 38 | **GDPR Compliance** | 🔴 | 0% | Phase 5 |

---

## 18. Overall Health

| Domain | Score | Status | Evidence |
|--------|:-----:|:------:|:--------:|
| Validator Pipeline | 97% | 🟢 | 76 sessions, 39 reports, 7 agents E2E, Audit 29 P0 fixed |
| Gemini API Compliance | 92% | 🟢 | Audit 28: 3 rounds, 18 locations fixed |
| Supabase Security | 93% | 🟢 | Audit 27: 12 critical/high fixes applied |
| Database & RLS | 99% | 🟢 | 94/94 RLS, 549 indexes, 120 triggers |
| Edge Functions | 95% | 🟢 | 31 active, all JWT + CORS + rate limiting |
| Authentication | 95% | 🟢 | Google + LinkedIn OAuth, ProtectedRoute |
| Frontend | 90% | 🟢 | 47 pages, 429 components, 110 hooks |
| Build & Tests | 100% | 🟢 | 389/389 tests, 0 TS errors, 6.79s build |
| Knowledge/RAG | 95% | 🟢 | 3,748 chunks, hybrid search, K3-K7 ✅ |
| Design System | 95% | 🟢 | Premium aesthetic, dark mode, responsive |
| Realtime | 95% | 🟢 | RT-AUDIT 10/10, 22+ hooks, animations |
| Security | 92% | 🟡 | 1 WARN: leaked password protection OFF |
| Code Quality (lint) | 85% | 🟢 | 340 problems (PROD-06: 990→340) |
| **Overall** | **96%** | 🟢 | **P0 clean — production-ready core** |

---

## 19. Architecture Audit — 10-Domain Plan (2026-02-27)

> **Source:** `tasks/data/plan/05-14` (10 domain files + verified corrections)
> **Audit score:** 83% avg → 86% after removing 5 false findings → **95% after P0 sweep**
> **Tasks catalogued:** 92 active (30 P0 ✅, 34 P1, 28 P2) + 8 false findings removed

### P0 — ✅ ALL 30 COMPLETE (2026-02-27)

All P0 tasks done. Migrations: `20260227100000` through `20260227110400`. Key changes:
- 4 FK cascades fixed (CRM, Chat, Canvas)
- 9 dead tables dropped with backup (Canvas domain)
- 5 triggers + 4 functions removed
- Rate limiting added to 4 edge functions
- `load-knowledge` merged into `knowledge-ingest`
- Soft delete verified correct, `completed_at` trigger added
- 2 remote cleanups remaining: delete ghost EF deployments + `load-knowledge`

### P1 — This Sprint (~2-3 days)

| Domain | Task | Description | Effort | Status |
|--------|------|-------------|:------:|:------:|
| **Auth** | AUTH-P1-1 | ~~Add rate limiting to `profile-import`~~ (done in P0 sweep) | — | 🟢 Done |
| **Core** | CORE-P1-1 | Document `startup_in_org()` as single tenancy boundary | 20 min | 🔴 |
| **Validator** | VAL-P1-1 | ~~Review anon RLS on `validator_reports`~~ — token-gated, safe | 20 min | 🟢 Done |
| **Validator** | VAL-P1-2 | ~~Add index `validator_runs(session_id, agent_name)`~~ — already exists | 10 min | 🟢 Done |
| **Pitch** | PITCH-P1-1 | Verify `Promise.race` on Gemini calls in pitch-deck-agent | 20 min | 🔴 |
| **Pitch** | PITCH-P1-2 | Add slide type CHECK constraint allowlist | 15 min | 🔴 |
| **CRM** | CRM-P1-1 | Add UNIQUE(startup_id, lower(email)) WHERE email IS NOT NULL on contacts | 20 min | 🔴 |
| **CRM** | CRM-P1-2 | Fix `contacts.referred_by` FK: bare → ON DELETE SET NULL | 10 min | 🔴 |
| **Tasks** | TASKS-P1-1 | Drop dead columns: `parent_task_id`, `contact_id`, `deal_id`, `phase` | 20 min | 🔴 |
| **Tasks** | TASKS-P1-2 | Fix `projects.owner_id` FK: NO ACTION → SET NULL | 15 min | 🔴 |
| **Tasks** | TASKS-P1-3 | Fix `tasks.created_by` FK: NO ACTION → SET NULL | 15 min | 🔴 |
| **Tasks** | TASKS-P1-4 | Add rate limiting to `sprint-agent` | 15 min | 🔴 |
| **Tasks** | TASKS-P1-5 | Add rate limiting to `compute-daily-focus` | 15 min | 🔴 |
| **Chat** | CHAT-P1-1 | Refactor `ai-chat` to use `_shared/gemini.ts` (C4 fix) | 30 min | 🔴 |
| **Chat** | CHAT-P1-2 | Add count-based rate limiting to `ai-chat` | 15 min | 🔴 |
| **Knowledge** | KNOW-P1-1 | ~~Add rate limiting to `knowledge-ingest`~~ (done in P0 sweep) | — | 🟢 Done |
| **Knowledge** | KNOW-P1-2 | Migrate `industry-expert-agent` to `_shared/gemini.ts` | 20 min | 🔴 |
| **Knowledge** | KNOW-P1-3 | Fix tool name: `google_search` → `googleSearch` | 10 min | 🔴 |
| **Platform** | PLAT-P1-1 | Drop 23 dead tables in FK-safe order (single migration) | 1-2 hr | 🔴 |
| **Platform** | PLAT-P1-2 | Drop FKs before `playbook_runs` drop | 15 min | 🔴 |
| **Platform** | PLAT-P1-3 | Fix stage-analyzer phantom metrics | 30 min | 🔴 |
| **Platform** | PLAT-P1-4 | Fix health-scorer baseline=0 bug | 20 min | 🔴 |
| **Platform** | PLAT-P1-5 | Delete `_shared/ai-client.ts`, redirect to `_shared/gemini.ts` | 20 min | 🔴 |

### P2 — Deferred to Phase 2+ (28 tasks)

Tracked in `tasks/data/plan/05-14`. Key items: soft-delete patterns, function consolidations, data retention policies, indexing optimizations, embedding model upgrades.

### Verified FALSE Findings (Removed)

| Finding | Domain | Why False |
|---------|--------|-----------|
| CORS inconsistency (all domains) | All | All 42+ functions use shared `_shared/cors.ts` with dynamic origin |
| `search_knowledge` SQL injection | Knowledge | All params typed + direct equality, no string interpolation |
| `proposed_actions.ai_run_id` FK issue | Platform | Table doesn't have this column |
| `sprint_tasks` missing all FKs | Tasks | Has `campaign_id` FK, only missing `sprint_id` |
| `documents.created_by` FK issue | Platform | Not verified as issue in codebase |

### Auth Bugs Fixed (2026-02-27) — 7 items

| Fix | File | Root Cause |
|-----|------|------------|
| Double handleSession guard | `AuthCallback.tsx` | `onAuthStateChange` + setTimeout both fired |
| Remove duplicate `getSession()` | `useAuth.tsx` | Double `fetchUserData` on every page load |
| Await `fetchUserData` before `setLoading(false)` | `useAuth.tsx` | Profile race: redirect before profile loaded |
| Handle `INITIAL_SESSION` event | `AuthCallback.tsx` | Back-navigation caused 500ms delay |
| Skip `fetchUserData` on `TOKEN_REFRESHED` | `useAuth.tsx` | Unnecessary DB fetch on token refresh |
| Add pendingIdea check to Login.tsx | `Login.tsx` | Email login path didn't check pendingIdea |
| Clear sessionStorage on signOut | `useAuth.tsx` | Stale `auth:returnPath` + `pendingIdea` across users |

---

## 20. Priority Action Items

### Immediate — P1 Cleanup + Phase 2 Start

| # | Task | Effort | Impact | Status |
|:-:|------|:------:|:------:|:------:|
| 1 | **PLAT-P1-1:** Drop 23 dead tables (single migration) | 1-2 hr | Cleanup | 🔴 |
| 2 | **K1a:** Fix knowledge-search.ts `AbortSignal.timeout` → `Promise.race` | 15 min | Reliability | 🔴 |
| 3 | **PLAT-P1-5:** Delete `_shared/ai-client.ts` → redirect to `gemini.ts` | 20 min | Code quality | 🔴 |
| 4 | **Remote cleanup:** Delete 4 ghost EF deployments (manual) | 10 min | Cleanup | 🟡 |
| 5 | **MVP-01:** V3 types foundation | 3-5 days | Phase 2 start | 🔴 |

### This Week — Remaining P1 Fixes (19 tasks)

| # | Task | Effort | Impact | Status |
|:-:|------|:------:|:------:|:------:|
| 6 | P1 DB migrations (FK fixes, dead columns, constraints) | 2-3 hr | Schema | 🔴 |
| 7 | P1 Rate limiting (sprint-agent, compute-daily-focus, ai-chat) | 45 min | Cost control | 🔴 |
| 8 | P1 Code quality (ai-chat gemini migration, tool name fix) | 1 hr | Code quality | 🔴 |
| 9 | P1 Platform (stage-analyzer phantom metrics, health-scorer bug) | 50 min | Correctness | 🔴 |

### Next 2-3 Weeks — Phase 2 MVP

| # | Task | Effort | Impact | Status |
|:-:|------|:------:|:------:|:------:|
| 10 | MVP-02: Composer Group E pipeline | 3-5 days | Phase 2 | 🔴 |
| 11 | MVP-03: Chat interview 8→12 topics | 2-3 days | Phase 2 | 🔴 |
| 12 | MVP-04: DimensionPage shared components | 3-5 days | Phase 2 | 🔴 |
| 13 | K3: Wire RAG into Canvas Coach | 1-2 days | RAG | 🔴 |

### Reliability (Parallel)

| # | Task | Effort | Impact | Status |
|:-:|------|:------:|:------:|:------:|
| 14 | R4: Pin edge function deps | 1 day | Stability | 🔴 |
| 15 | R8: ai-client.ts timeout/retry | 1 day | Reliability | 🔴 |
| 16 | R9: Temperature model selector | 1 day | Correctness | 🔴 |

---

## 21. Project Documentation Inventory

| Category | Files | Size | Status |
|----------|:-----:|:----:|:------:|
| Task Prompts | 44 | ~350KB | 🟢 Core complete |
| Audit Reports | 27 | ~380KB | 🟢 Comprehensive |
| Wireframes | 39 | ~200KB | 🟢 All screens spec'd |
| Data Diagrams (ERD) | 11 | ~100KB | 🟢 94-table schema |
| Vector/RAG Specs | 19 | ~150KB | 🟡 Stage 1 done |
| Agent Specs | 13 | ~177KB | 🟢 Full agent taxonomy |
| Mermaid Diagrams | 51 | ~200KB | 🟢 4 sets |
| Reference Docs | 10 | ~50KB | 🟢 Prompt library |
| Working Notes | 13 | ~80KB | 🟢 Active planning |
| Screenshots | 20+ | ~5MB | 🟢 Visual reference |
| **TOTAL** | **~247** | **~1.7MB** | **95% complete** |

### Key Reference Paths

| Document | Path |
|----------|------|
| PRD (v6.0) | `prd.md` |
| CLAUDE.md (v4.2) | `CLAUDE.md` |
| Changelog | `CHANGELOG.md` |
| This file | `tasks/index-progress.md` |
| Active priorities | `tasks/next-steps.md` |
| Task prompt index | `tasks/prompts/00-index.md` |
| Roadmap | `tasks/roadmap.md` |
| Style guide | `tasks/style-guide.md` |
| Supabase audit | `tasks/audit/27-supabase-audit.md` |
| Gemini audit | `tasks/audit/28-gemeni-audit.md` |
| Validator audit | `tasks/audit/29-validator-audit.md` |
| System audit | `tasks/audit/22-system-audit.md` |
| Skills audit | `tasks/audit/25-audit-onboarding.md` |
| Validator strategy | `tasks/validator/strategy/00-INDEX.md` |
| Agent specs | `lean/agents/00-agents-index.md` |
| Wireframe index | `tasks/wireframes/index-wireframes.md` |
| Vector progress | `tasks/vector/index-progress-vector.md` |

---

*v15.0 — P1 audit complete (2026-02-27): 20/20 P1 tasks done. All edge functions migrated to shared gemini.ts. Tenancy boundaries documented. Dead tables dropped. Rate limiting added.*

*v16.0 — Audit 29 + Multipage Report (2026-02-27): Validator pipeline audit found 22 failure points (4 critical, 5 data quality, 3 UX, 5 resilience). All 6 P0 fixes applied: CORE-06 fields restored in scoring, interviewContext serialized, failed status for null reports, null score handling (no misleading "No-Go"), Realtime polling fallback, JSON schema kept with thinking mode. Multipage report with 6 tabs + PageCard wrappers + route-based navigation. SharedReport/EmbedReport migrated to ReportV2Layout (1700 lines removed). 325/325 tests, 0 TS errors, 6.5s build.*

*v17.0 — Session 16: Deploy + Env Vars + Tab Layout (2026-02-27): Multi-page report merged to main via PR #2, Vercel auto-deployed. Fixed production "Missing Supabase environment variables" error — added VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to Vercel Production env vars via CLI, redeployed. All 6 report tabs verified on local dev with real data (FashionOS, 69/100). Moved tab navigation to top of report (above hero section) for better UX — tabs now first element users see. Build: pass, TS: 0 errors, Tests: 20/20 ReportV2Layout tests pass.*
