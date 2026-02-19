# StartupAI — Production-Ready System Roadmap

**Version:** 3.0 | **Date:** January 27, 2026
**Role:** Senior Product Strategist + Systems Architect
**Objective:** Deliver **Security → Core MVP → AI Features → Realtime → Production** with verification at every stage

**Current Overall Progress:** 42% Complete
- Phase 0 (Foundation): ✅ 95%
- Security (P0): 🟡 16%
- Phase 1 (Core MVP): 🟡 40%
- Phase 2 (AI & Realtime): 🟡 20%
- Phase 3 (Advanced AI): 🔴 0%
- Phase 4 (Production): 🔴 0%

---

## Table of Contents

1. [System Status](#1-system-status)
2. [Phase 0 — Foundation](#2-phase-0--foundation)
3. [Security Phase — P0 Critical](#3-security-phase--p0-critical)
4. [Phase 1 — Core MVP](#4-phase-1--core-mvp)
5. [Phase 2 — AI & Realtime](#5-phase-2--ai--realtime)
6. [Phase 3 — Advanced AI](#6-phase-3--advanced-ai)
7. [Phase 4 — Production Hardening](#7-phase-4--production-hardening)
8. [Edge Functions Status](#8-edge-functions-status)
9. [AI Agent Inventory](#9-ai-agent-inventory)
10. [Critical Path](#10-critical-path)
11. [Phase Gates](#11-phase-gates)
12. [Cross-References](#12-cross-references)

---

## 1. System Status

### Module Overview

| Module | Tasks | Backend | Frontend | Overall % | Phase |
|--------|-------|---------|----------|-----------|-------|
| **Security & Foundation** | 7 | 🟡 50% | 🟡 30% | **16%** | P0 |
| **Onboarding** | 14 | ✅ 95% | ✅ 95% | **95%** | P0 ✅ |
| **Cloudinary** | 9 | ✅ 100% | ✅ 100% | **100%** | P0 ✅ |
| **Lean Canvas** | 17 | ✅ 90% | 🟡 60% | **70%** | P1 |
| **CRM & Contacts** | 5 | ✅ 100% | 🔴 0% | **50%** | P1 |
| **Project Management** | 5 | 🔴 0% | 🟡 50% | **25%** | P1 |
| **Dashboards** | 5 | 🔴 0% | 🟡 30% | **15%** | P1 |
| **Documents** | 5 | ✅ 100% | 🔴 0% | **50%** | P1 |
| **Pitch Deck (legacy)** | 5 | ✅ 100% | 🔴 0% | **50%** | P1 |
| **Pitch Deck MVP** | 16 | 🟡 70% | 🔴 0% | **35%** | P1 |
| **Events** | 5+ | ✅ 100% | 🟡 70% | **80%** | P2 |
| **Chat** | 5 | ✅ 100% | 🟡 30% | **60%** | P2 |
| **Supabase Realtime** | 1 | 📋 Strategy | 📋 Strategy | **5%** | P2 |
| **AI Enhancement** | 3 | 🔴 0% | 🔴 0% | **0%** | P3 |
| **Investor Features** | 3 | 🟡 50% | 🔴 0% | **25%** | P3 |
| **Infrastructure** | 5 | 🔴 0% | 🔴 0% | **0%** | P3 |

**Total Active Tasks:** 112
**Implementation Tasks:** 84
**Strategy/Planning Docs:** 28
**Completed:** 18 (16%)

---

## 2. Phase 0 — Foundation (95% Complete)

| Deliverable | Status | Gate |
|-------------|--------|------|
| Vite + React + TypeScript | ✅ | Build succeeds |
| Database schema (42 tables) | ✅ | Migrations run |
| Supabase client | ✅ | Connection works |
| RLS policies | ✅ | Cross-org test fails |
| Auth wiring (OAuth) | ✅ | Login → Dashboard works |
| Cloudinary integration | ✅ 100% | Images upload + display |
| Onboarding Wizard (4 steps) | ✅ 95% | Browser audit passed (2026-01-26) |

**Phase Gate:** ✅ Auth works, RLS tested, wizard completes, browser audit passed

---

## 3. Security Phase — P0 Critical (16%)

**Priority:** CRITICAL — Must complete before any production deployment

| Deliverable | Status | % | Next Action |
|-------------|--------|---|-------------|
| Remove auth bypass | 🟡 | 50% | Complete removal |
| Remove hardcoded secrets | 🟡 | 60% | Audit all files |
| Update vulnerable dependencies | 🔴 | 0% | Run npm audit fix |
| Security headers & CSP | 🔴 | 0% | Add helmet.js |
| Secure session management | 🔴 | 0% | Move to httpOnly |
| Admin role enforcement | 🔴 | 0% | Enforce in RLS |
| API rate limiting | 🔴 | 0% | Add rate limits |

**Phase Gate:** All security vulnerabilities resolved, no auth bypass, no hardcoded secrets, RLS enforced

**Blocker:** This phase blocks ALL production deployment. No exceptions.

---

## 4. Phase 1 — Core MVP (40%)

**Goal:** Founder completes wizard → sees dashboard → has tasks → lean canvas populated → pitch deck generated

### Lean Canvas — 70%

| Task | Status | % | Next Action |
|------|--------|---|-------------|
| Profile Data Mapper | ✅ | 100% | Complete |
| Gap Detection Questions | 🟡 | 50% | Wire AI suggestions |
| Enhanced Canvas Generation | 🟡 | 60% | Improve prompts |
| Confidence Scores UI | 🔴 | 0% | Add score badges |
| Hypothesis Validator | 🟡 | 60% | validate_canvas exists |
| Version History | 🔴 | 0% | Add version tracking |
| Edge Function Audit | ✅ | 100% | Fixes applied (npm + SDK) |

### Pitch Deck MVP — 35%

| Task | Status | % | Next Action |
|------|--------|---|-------------|
| Data Aggregation Function | 🟡 | 70% | Add lean canvas fetch |
| Deck Generation Function | 🟡 | 70% | Fix type mismatches |
| Generation Wizard UI | 🔴 | 0% | Create PitchDeckWizard.tsx |
| Deck Editor UI | 🔴 | 0% | Requires wizard + generation |
| PDF Export | 🔴 | 0% | Requires editor |
| Shared Type Definitions | 🔴 | 0% | Single source of truth |

### CRM & Contacts — 50%

| Task | Status | % | Next Action |
|------|--------|---|-------------|
| Wire Contact Enrichment AI | 🔴 | 0% | Create useCRMAgent |
| Wire Deal Win Probability | 🔴 | 0% | Wire to DealCard |
| Wire Investor Fit Scoring | 🔴 | 0% | Wire to InvestorCard |
| Wire Pipeline Analysis | 🔴 | 0% | Add PipelineInsights |
| Wire AI Email Generation | 🔴 | 0% | Add ComposeDialog |

### Dashboard — 15%

| Task | Status | % | Next Action |
|------|--------|---|-------------|
| Create Metrics Aggregator | 🔴 | 0% | Create edge function |
| Create Daily Insights Generator | 🔴 | 0% | Create edge function |
| Complete Analytics Dashboard | 🔴 | 0% | Add Recharts |
| Create Stage Analyzer | 🔴 | 0% | Create auto-detect |
| Add Realtime Subscriptions | 🔴 | 0% | Wire Supabase realtime |

### Documents — 50%

| Task | Status | % | Next Action |
|------|--------|---|-------------|
| File Upload System | 🔴 | 0% | Add FileUploader |
| Document Preview Modal | 🔴 | 0% | Add PDF viewer |
| Folder Organization | 🔴 | 0% | Create folders table |
| Share Link Generation | 🔴 | 0% | Create share_links |
| Wire AI Document Analysis | 🔴 | 0% | Wire to panel |

**Phase Gate:** User journey works end-to-end: wizard → dashboard → tasks → canvas → deck

---

## 5. Phase 2 — AI & Realtime (20%)

**Goal:** AI features explain outputs, realtime updates working, events complete

### Events — 80%

| Task | Status | Next Action |
|------|--------|-------------|
| Events system (backend) | ✅ 100% | Complete |
| Events frontend (hub + detail) | 🟡 70% | Polish UI |
| Event Wizard | 🟡 70% | Complete flow |
| Event Attendance | 🔴 | Build tracking |

### Chat — 60%

| Task | Status | Next Action |
|------|--------|-------------|
| AI Chat with Context | 🟡 30% | Wire context |
| Frontend-Backend Wiring | 🟡 40% | Complete wiring |
| AI Chat Assistant | 🟡 30% | Improve UI |

### Supabase Realtime — 5% (Strategy Complete)

20 features planned across Core (10) and Advanced (10). See `tasks/supabase/01-ai-real-time.md`.

**Build order (by priority):**
1. Startup Health Score (foundation for all other features)
2. Strategy → Task Generator (most visible AI value)
3. Daily Priority Generator (daily habit, retention driver)
4. Investor Readiness Checker (fundraising — top founder priority)
5. Strategy Progress Feed (builds trust in AI)

### AI Enhancement Features (Planned)

| Feature | Score | Screen | Phase |
|---------|-------|--------|-------|
| Startup Health Score | 96 | Dashboard — top card | 2 |
| Strategy → Task Generator | 95 | Dashboard — tasks panel | 2 |
| Investor Readiness Checker | 94 | Dashboard — readiness card | 2 |
| Risk Detection Engine | 93 | Dashboard — alerts sidebar | 2 |
| 30-60-90 Day Plan | 92 | Wizard + Dashboard — roadmap | 2 |
| Deal Strategy Re-Scoring | 91 | CRM — deal detail | 2 |
| Strategy Alignment Monitor | 90 | Dashboard — alignment gauge | 2 |
| Daily Priority Generator | 89 | Dashboard — morning briefing | 2 |
| Bottleneck Detector | 88 | Dashboard — bottleneck alert | 2 |
| Strategy Progress Feed | 87 | Dashboard — activity sidebar | 2 |

**Phase Gate:** AI outputs explainable, no cross-org data leaks, realtime channels configured

---

## 6. Phase 3 — Advanced AI (0%)

**Goal:** Advanced AI features that make the platform feel like a living strategy engine

### Advanced Realtime Features (Planned)

| Feature | Score | Screen | Phase |
|---------|-------|--------|-------|
| Live Strategy Re-Simulation | 97 | Dashboard — strategy overview | 3 |
| Fundraising Scenario Planner | 96 | Wizard + Dashboard — fundraising | 3 |
| Market Signal Alerts | 95 | Dashboard — market signals card | 3 |
| AI Pivot Recommendation | 94 | Dashboard — pivot panel | 3 |
| Multi-Strategy Comparison | 93 | Dashboard — comparison view | 3 |
| Execution Load Balancer | 92 | Dashboard — workload card | 3 |
| Strategic Dependency Mapper | 91 | Dashboard — dependency view | 3 |
| Revenue Sensitivity Analyzer | 90 | Dashboard — financial insight | 3 |
| Investor Objection Anticipator | 89 | Pitch Deck + Dashboard | 3 |
| Cross-Module Strategy Sync | 88 | All screens — sync indicator | 3 |

### Claude SDK Integration (Phase 3+)

| Feature | Model | Purpose |
|---------|-------|---------|
| Workflow Orchestration | claude-sonnet-4-5 | Multi-step workflows with error recovery |
| Approval Gates | claude-sonnet-4-5 | Controller agent validates proposed actions |
| Agent Coordination | claude-sonnet-4-5 | Multi-agent workflows |

**Phase Gate:** Advanced features measurable, workflow orchestration operational, approval gates active

---

## 7. Phase 4 — Production Hardening (0%)

| Deliverable | Status | Priority |
|-------------|--------|----------|
| CI/CD Pipeline | 🔴 | P0 |
| Monitoring & Alerting | 🔴 | P0 |
| Performance Optimization | 🔴 | P1 |
| Load Testing | 🔴 | P1 |
| Cost Controls & Token Budgets | 🔴 | P1 |
| Production Deployment Checklist | 🔴 | P0 |

**Phase Gate:** System handles real usage, metrics tracked, cost controls active, all gates pass

---

## 8. Edge Functions Status

| Function | Actions | Backend | Frontend Wired | Best Practices |
|----------|---------|---------|----------------|----------------|
| onboarding-agent | 11 | ✅ | ✅ (95%) | ✅ |
| lean-canvas-agent | 5 | ✅ | 🟡 (60%) | ✅ Fixed (npm + SDK) |
| crm-agent | 15 | ✅ | ❌ | ⚠️ Needs audit |
| investor-agent | 12 | ✅ | ❌ | ⚠️ Needs audit |
| pitch-deck-agent | 8 | ✅ | ❌ | ⚠️ Needs audit |
| documents-agent | 6 | ✅ | ❌ | ⚠️ Needs audit |
| event-agent | 8 | ✅ | 🟡 (70%) | ⚠️ Needs audit |
| ai-chat | 3 | ✅ | 🟡 (30%) | ⚠️ Needs audit |
| chatbot-agent | — | ✅ | 🟡 | ⚠️ Needs audit |
| generate-image | — | ✅ | ✅ | ✅ |
| auth-check | — | ✅ | ✅ | ✅ |
| health | — | ✅ | ✅ | ✅ |
| stripe-webhook | — | ✅ | ✅ | ✅ |
| whatsapp-agent | — | ✅ | 🔴 | ⚠️ Needs audit |
| **task-agent** | — | ❌ **Missing** | — | — |
| **dashboard-metrics** | — | ❌ **Missing** | — | — |

**Summary:** 14 deployed, 2 missing. 5 pass best practices, 9 need audit.

---

## 9. AI Agent Inventory

### Active Agents (Phase 1)

| Agent | Model | Edge Function | Status |
|-------|-------|---------------|--------|
| ProfileExtractor | gemini-2.5-flash | onboarding-agent | ✅ Active |
| ReadinessScorer | gemini-2.5-flash | onboarding-agent | ✅ Active |
| TaskGenerator | gemini-2.5-flash | onboarding-agent | ✅ Active |
| CanvasGenerator | gemini-2.5-flash | lean-canvas-agent | ✅ Active |
| CanvasValidator | gemini-2.5-flash | lean-canvas-agent | ✅ Active |
| ChatbotAgent | gemini-3-flash | ai-chat | 🟡 Partial |
| EventPlanner | gemini-3-flash | event-agent | ✅ Active |
| SponsorScout | gemini-3-pro | event-agent | ✅ Active |

### Planned Agents (Phase 2-3)

| Agent | Model | Edge Function | Phase |
|-------|-------|---------------|-------|
| DealScorer | gemini-3-pro | crm-agent | 2 |
| ContactEnricher | gemini-2.5-flash | crm-agent | 2 |
| InvestorMatcher | gemini-3-pro | investor-agent | 2 |
| ContentGenerator | gemini-3-pro | pitch-deck-agent | 2 |
| HealthScorer | gemini-3-flash | dashboard-metrics | 2 |
| RiskAnalyzer | gemini-3-flash | dashboard-metrics | 2 |
| Orchestrator | claude-sonnet-4-5 | — | 3 |
| Controller | claude-sonnet-4-5 | — | 3 |

---

## 10. Critical Path

| # | Chain | Why Critical |
|---|-------|-------------|
| 1 | **RLS Audit → Security Tests → CRM Edge → Contact CRUD → CRM UI → Dashboard** | Everything depends on security. No feature ships without RLS. |
| 2 | **RLS Audit → Pitch Schema → Slide Templates → AI Generator → Editor UI → Export** | Pitch Deck MVP is highest-value P1 feature. |
| 3 | **Auth Fix → OAuth Audit → Rate Limiting → Security Tests** | Auth hardening gates all authenticated features. |
| 4 | **Dashboard Data → Health Score UI → Strategy Tasks → Risk Engine → Realtime** | AI strategy chain — each feature feeds the next. |
| 5 | **Realtime Setup → Live AI Progress → Co-Editing → Strategy Sync** | Realtime is the endgame differentiator. |

See `tasks/mermaid-gantt.md` for full Gantt chart with dependencies.

---

## 11. Phase Gates

| Phase | Gate | Method |
|-------|------|--------|
| 0 | Build succeeds, wizard completes | `npm run build`, browser audit |
| Security | No auth bypass, no secrets, RLS enforced | Security audit, penetration test |
| 1 | User journey end-to-end | E2E: wizard → dashboard → tasks → canvas → deck |
| 2 | AI explainable, realtime working | AI outputs include reasoning, channels configured |
| 3 | Advanced features measurable | Metrics tracked, orchestration operational |
| 4 | Production ready | Performance under load, cost controls, monitoring |

### Status Definition

| Status | Criteria |
|--------|----------|
| **Production-Ready** | All gates pass (Phases 0-4) |
| **MVP-Ready** | Phase 0 + Security + Phase 1 gates pass |
| **Not Ready** | Any critical gate fails |

**Current Status:** Not Ready (Security Phase incomplete)

---

## 12. Cross-References

| Document | Path | Purpose |
|----------|------|---------|
| **PRD** | `/prd.md` | Product requirements v4.0 |
| **Task Index** | `/tasks/00-tasks-index.md` | 112 tasks with status |
| **Gantt Chart** | `/tasks/mermaid-gantt.md` | Implementation sequence |
| **Realtime Strategy** | `/tasks/supabase/01-ai-real-time.md` | 20 AI Realtime features |
| **Lean Canvas Realtime** | `/tasks/lean-canvas/task/14-realtime-strategy.md` | 5 canvas features |
| **Onboarding Realtime** | `/tasks/onboarding/11-realtime-strategy.md` | 5 onboarding features |
| **Onboarding AI Features** | `/tasks/onboarding/12-realtime-ai-strategy-features.md` | 20 Core+Advanced |
| **Edge Function Audit** | `/tasks/lean-canvas/task/13-edge-function-audit.md` | Best practices |
| **Archived v2.3** | `/archive/roadmap-v2.3-archived-2026-01-27.md` | Previous version |

---

**Last Updated:** January 27, 2026
**Version:** 3.0
**Owner:** Product + Engineering

**Key Changes (v3.0):**
- Updated all progress from task index (42% overall, was 25%)
- Onboarding 95% (was 85%), added Lean Canvas 70%, Cloudinary 100%
- Added Supabase Realtime features (20 planned, scored and ranked)
- Added critical path analysis (5 chains)
- Added edge function audit status (5 pass, 9 need audit, 2 missing)
- Added active vs planned agent inventory
- Removed aspirational "consolidate to 4 functions" — tracking actual deployed state
- Simplified phase structure — Security separated as explicit blocker
- Cross-referenced Gantt chart and all strategy docs
