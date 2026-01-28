# StartupAI Dashboard System — Progress Plan

> **Updated:** 2026-01-28 | **Version:** 2.8 | **Status:** Active
> **Strategy:** `100-dashboard-system.md` (source of truth for all screens)
> **Overall Progress:** 85% complete

---

## Module Progress

| # | Module | Screens | Backend | AI Wired | Frontend | Overall | Phase | Prompt |
|---|--------|---------|---------|----------|----------|---------|-------|--------|
| 1 | **Onboarding** | 4-step wizard | ✅ 95% | ✅ 100% | ✅ 95% | **95%** | Done | — |
| 2 | **Cloudinary** | — (infra) | ✅ 100% | N/A | ✅ 100% | **100%** | Done | — |
| 3 | **Events** | 3 screens | ✅ 100% | ✅ 100% | ✅ 100% | **100%** | Done | — |
| 4 | **Lean Canvas** | 2 screens | ✅ 100% | ✅ 100% | ✅ 95% | **98%** | Done | `01-lean-canvas.md` |
| 5 | **Pitch Deck** | 3 screens | ✅ 95% | ✅ 90% | ✅ 85% | **90%** | Active | `pitch-decks/` |
| 6 | **Main Dashboard** | 1 screen | ✅ 100% | ✅ 100% | ✅ 85% | **95%** | Done | `11-main-dashboard.md` |
| 7 | **CRM** | 3 screens | ✅ 100% | ✅ 100% | ✅ 80% | **90%** | Active | `12-crm.md` |
| 8 | **Documents** | 3 screens | ✅ 100% | ✅ 100% | ✅ 90% | **95%** | Done | `13-documents.md` |
| 9 | **Investors** | 3 screens | ✅ 100% | ✅ 100% | ✅ 95% | **98%** | Done | `14-investors.md` |
| 10 | **Projects** | 3 screens | ✅ 100% | ✅ 100% | ✅ 90% | **95%** | Done | `15-projects.md` |
| 11 | **AI Chat** | 2 screens | ✅ 100% | ✅ 80% | ✅ 80% | **85%** | Active | `16-ai-chat.md` |
| 12 | **Settings** | 6 tabs | N/A | N/A | ✅ 100% | **100%** | Done | `17-settings.md` |

---

## Implementation Order (Recommended)

| Priority | Module | Why This Order | Depends On |
|----------|--------|---------------|------------|
| **1** | ~~Onboarding~~ | ✅ Complete | — |
| **2** | ~~Cloudinary~~ | ✅ Complete | — |
| **3** | ~~Events~~ | ✅ Complete — event-agent deployed | — |
| **4** | ~~**Lean Canvas**~~ | ✅ Complete — ProfileMappingBanner integrated | Onboarding data |
| **5** | ~~**Pitch Deck**~~ | ✅ Export modal integrated | Onboarding data |
| **6** | ~~**CRM**~~ | ✅ Backend + hooks + AI panel complete | — |
| **7** | ~~**Documents**~~ | ✅ Backend + hooks + AI panel + DetailSheet complete | Cloudinary (done) |
| **8** | ~~**Main Dashboard**~~ | ✅ Real data wired, insights-generator deployed | Pitch deck + lean canvas data |
| **9** | ~~**Investors**~~ | ✅ Detail sheet with AI wired (fit, prep, outreach) | CRM patterns |
| **10** | ~~**AI Chat**~~ | ✅ Dedicated page created at `/ai-chat` | — |
| **11** | ~~**Projects**~~ | ✅ task-agent deployed, TaskDetailSheet AI breakdown wired | — |
| **12** | ~~**Settings**~~ | ✅ Complete — 6 tabs (Profile, Appearance, Notifications, Startup, Team, Account) | — |

---

## Edge Functions Status

### ✅ DEPLOYED (in supabase/functions/)

| Function | Actions | Status | Frontend Hooks | Frontend Wiring | Prompt |
|----------|---------|--------|----------------|-----------------|--------|
| `onboarding-agent` | 12 | ✅ Deployed | ✅ useOnboardingAgent | ✅ 95% | — |
| `lean-canvas-agent` | 11 | ✅ Deployed | ✅ useLeanCanvasAgent | ✅ 95% | `01-lean-canvas.md` |
| `pitch-deck-agent` | 17 | ✅ Deployed | ✅ usePitchDeckEditor | ✅ 85% | See pitch-deck prompts |
| `ai-chat` | 5+ | ✅ Deployed | ✅ useAIChat | ✅ 80% | `16-ai-chat.md` |
| `crm-agent` | 8 | ✅ Deployed | ✅ useCRMAgent | ✅ 80% | `12-crm.md` |
| `documents-agent` | 6 | ✅ Deployed | ✅ useDocumentsAgent | ✅ 90% | `13-documents.md` |
| `investor-agent` | 12 | ✅ Deployed | ✅ useInvestorAgent | ✅ 95% | `14-investors.md` |
| `task-agent` | 6 | ✅ Deployed | ✅ useTaskAgent | ✅ 95% | `15-projects.md` |
| `insights-generator` | 4 | ✅ Deployed | ✅ useInsights | ✅ 90% | `11-main-dashboard.md` |
| `event-agent` | 5 | ✅ Deployed | ✅ useEventAgent | ✅ 80% | — |

### ❌ NOT DEPLOYED (need to create)

| Function | Actions | Purpose | Prompt | Task File |
|----------|---------|---------|--------|-----------|
| `chatbot-agent` | 22 | Advanced chat features | `16-ai-chat.md` | — |
| `stage-analyzer` | 3 | Auto-detect startup stage | `11-main-dashboard.md` | `tasks/04-create-stage-analyzer.md` |

---

## Supabase Config Status

**Current `supabase/config.toml`:**
```toml
project_id = "yvyesmiczbjqwbqtlidy"

[functions.ai-chat]
verify_jwt = false

[functions.onboarding-agent]
verify_jwt = false

[functions.pitch-deck-agent]
verify_jwt = false

[functions.lean-canvas-agent]
verify_jwt = false

[functions.crm-agent]
verify_jwt = false

[functions.documents-agent]
verify_jwt = false

[functions.investor-agent]
verify_jwt = false

[functions.task-agent]
verify_jwt = false

[functions.insights-generator]
verify_jwt = false
```

---

## Frontend Hooks Status

All deployed edge functions now have corresponding frontend hooks:

| Hook | File | Actions | Status |
|------|------|---------|--------|
| `useCRMAgent` | `src/hooks/useCRMAgent.ts` | 8 (enrich, score, pipeline, email, duplicates, summarize, follow-ups) | ✅ Created |
| `useDocumentsAgent` | `src/hooks/useDocumentsAgent.ts` | 6 (generate, analyze, improve, search, summarize, compare) | ✅ Created |
| `useLeanCanvasAgent` | `src/hooks/useLeanCanvasAgent.ts` | 11 (map, prefill, suggest, validate, benchmarks, versions) | ✅ Created |
| `useInvestorAgent` | `src/hooks/useInvestorAgent.ts` | 12 (discover, fit, warm paths, outreach, pipeline, meeting prep) | ✅ Created |
| `useDashboardMetrics` | `src/hooks/useDashboardMetrics.ts` | Real-time dashboard counts + week-over-week changes | ✅ Created |
| `useTaskAgent` | `src/hooks/useTaskAgent.ts` | 6 (generate, prioritize, suggest, breakdown, productivity, daily plan) | ✅ Created |
| `useInsights` | `src/hooks/useInsights.ts` | 4 (daily insights, quick insights, stage recommendations, weekly summary) | ✅ Created |

---

## Completed This Session (v2.7)

1. ✅ **Created task-agent edge function** — 6 actions: generate_tasks, prioritize_tasks, suggest_next, breakdown_task, analyze_productivity, generate_daily_plan
2. ✅ **Created insights-generator edge function** — 4 actions: generate_daily_insights, generate_quick_insights, get_stage_recommendations, generate_weekly_summary
3. ✅ **Created useTaskAgent hook** — Full frontend interface for task AI actions
4. ✅ **Created useInsights hook** — Full frontend interface for dashboard insights
5. ✅ **Wired TasksAIPanel** — Connected prioritize, analyze productivity, daily plan actions
6. ✅ **Wired AIStrategicReview** — Connected to insights-generator, real AI insights
7. ✅ **Created DocumentDetailSheet** — Analyze, summarize, improve actions with tabbed UI
8. ✅ **Wired Documents page** — Opens detail sheet on document click

---

## Next Steps (Priority Order)

### P0 — This Week

1. ✅ ~~Create task-agent edge function~~ — Done with 6 actions
2. ✅ ~~Create insights-generator edge function~~ — Done with 4 actions
3. ✅ ~~Wire DocumentDetail with AI~~ — DetailSheet created with analyze/improve/summarize
4. **Wire TaskDetailSheet with AI** — Break down task, suggest subtasks

### P1 — Next Week

5. **Create `event-agent` edge function** — Speaker research, event discovery
6. **Chat history persistence** — Save/load sessions from database
7. **Complete Settings tabs** — Profile, integrations, billing, team

### P2 — Following Weeks

8. **Create `stage-analyzer` edge function** — Auto-detect startup stage
9. **Smart AI System** — Agent orchestration, spec pipeline, QA loops

---

## Critical Blockers: NONE

## High-Risk Issues: NONE

## Production Readiness Checklist

| Area | Status | Notes |
|------|--------|-------|
| Edge Functions | ✅ 9/9 deployed | All have CORS, auth, error handling |
| Frontend Hooks | ✅ 9/9 created | All use React Query + toast notifications |
| AI Panel Wiring | ✅ 6/6 complete | CRM, Documents, Investors, Dashboard, Lean Canvas, Tasks |
| Detail Sheet AI | ✅ 2/2 complete | Investors + Documents |
| Routes | ✅ All protected | ProtectedRoute wrapper on all dashboard routes |
| Database | ✅ RLS enabled | All tables have row-level security |
| API Keys | ✅ Configured | GEMINI_API_KEY, ANTHROPIC_API_KEY in secrets |
| Error Handling | ✅ Consistent | Try/catch with user-friendly messages |

---

## Changelog

| Date | Change | Version |
|------|--------|---------|
| 2026-01-27 | Created task-agent + insights-generator, wired TasksAIPanel + AIStrategicReview + DocumentDetailSheet | 2.7 |
| 2026-01-27 | Integrated ProfileMappingBanner, wired InvestorDetailSheet with AI | 2.6 |
| 2026-01-27 | Wired InvestorsAIPanel with useInvestorAgent hooks | 2.5 |
| 2026-01-27 | Created investor-agent (12 actions), AI Chat page, real dashboard data | 2.4 |
| 2026-01-27 | Wired CRM + Documents AI panels, integrated ExportModal | 2.3 |
| 2026-01-27 | Created useCRMAgent, useDocumentsAgent, useLeanCanvasAgent hooks | 2.2 |
| 2026-01-27 | Created crm-agent, documents-agent edge functions | 2.1 |
| 2026-01-27 | Created comprehensive dashboard docs system | 2.0 |
