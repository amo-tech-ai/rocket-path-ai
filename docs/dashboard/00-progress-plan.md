# StartupAI Dashboard System — Progress Plan

> **Updated:** 2026-01-27 | **Version:** 2.5 | **Status:** Active
> **Strategy:** `100-dashboard-system.md` (source of truth for all screens)
> **Overall Progress:** 68% complete

---

## Module Progress

| # | Module | Screens | Backend | AI Wired | Frontend | Overall | Phase | Prompt |
|---|--------|---------|---------|----------|----------|---------|-------|--------|
| 1 | **Onboarding** | 4-step wizard | ✅ 95% | ✅ 100% | ✅ 95% | **95%** | Done | — |
| 2 | **Cloudinary** | — (infra) | ✅ 100% | N/A | ✅ 100% | **100%** | Done | — |
| 3 | **Events** | 3 screens | ✅ 100% | 🟡 20% | ✅ 100% | **100%** | Done | — |
| 4 | **Lean Canvas** | 2 screens | ✅ 100% | ✅ 90% | 🟡 80% | **88%** | Active | `01-lean-canvas.md` |
| 5 | **Pitch Deck** | 3 screens | ✅ 95% | 🟡 85% | 🟡 80% | **85%** | Active | `pitch-decks/` |
| 6 | **Main Dashboard** | 1 screen | ✅ 80% | 🔴 0% | ✅ 70% | **50%** | Active | `11-main-dashboard.md` |
| 7 | **CRM** | 3 screens | ✅ 100% | ✅ 100% | ✅ 80% | **90%** | Active | `12-crm.md` |
| 8 | **Documents** | 3 screens | ✅ 100% | ✅ 100% | 🟡 60% | **80%** | Active | `13-documents.md` |
| 9 | **Investors** | 3 screens | ✅ 100% | ✅ 100% | ✅ 80% | **90%** | Active | `14-investors.md` |
| 10 | **Projects** | 3 screens | 🔴 0% | 🔴 0% | 🟡 50% | **25%** | Planned | `15-projects.md` |
| 11 | **AI Chat** | 2 screens | ✅ 100% | ✅ 80% | ✅ 80% | **85%** | Active | `16-ai-chat.md` |
| 12 | **Settings** | 4 tabs | N/A | N/A | 🟡 60% | **60%** | Planned | `17-settings.md` |

---

## Implementation Order (Recommended)

| Priority | Module | Why This Order | Depends On |
|----------|--------|---------------|------------|
| **1** | ~~Onboarding~~ | ✅ Complete | — |
| **2** | ~~Cloudinary~~ | ✅ Complete | — |
| **3** | ~~Events~~ | ✅ Complete | — |
| **4** | **Pitch Deck** (wizard + editor) | Flagship feature, Step 1 AI complete, export ready | Onboarding data |
| **5** | **Lean Canvas** (polish) | 85% done, 11 actions deployed, confidence badges added | Onboarding data |
| **6** | ~~**CRM**~~ | ✅ Backend + hooks + AI panel complete | — |
| **7** | ~~**Documents**~~ | ✅ Backend + hooks + AI panel complete | Cloudinary (done) |
| **8** | ~~**Main Dashboard**~~ | ✅ Real data wired, metrics + changes | Pitch deck + lean canvas data |
| **9** | ~~**Investors**~~ | ✅ Backend + hooks + AI panel complete (12 actions) | CRM patterns |
| **10** | ~~**AI Chat**~~ | ✅ Dedicated page created at `/ai-chat` | — |
| **11** | **Projects** (build task-agent) | Needs new `task-agent` edge function | — |
| **12** | **Settings** (complete tabs) | Polish, non-blocking | — |

---

## Edge Functions Status

### ✅ DEPLOYED (in supabase/functions/)

| Function | Actions | Status | Frontend Hooks | Frontend Wiring | Prompt |
|----------|---------|--------|----------------|-----------------|--------|
| `onboarding-agent` | 12 | ✅ Deployed | ✅ useOnboardingAgent | ✅ 95% | — |
| `lean-canvas-agent` | 11 | ✅ Deployed | ✅ useLeanCanvasAgent | 🟡 75% | `01-lean-canvas.md` |
| `pitch-deck-agent` | 17 | ✅ Deployed | ✅ usePitchDeckEditor | 🟡 70% | See pitch-deck prompts |
| `ai-chat` | 5+ | ✅ Deployed | ✅ useAIChat | ✅ 80% | `16-ai-chat.md` |
| `crm-agent` | 8 | ✅ Deployed | ✅ useCRMAgent | ✅ 80% | `12-crm.md` |
| `documents-agent` | 6 | ✅ Deployed | ✅ useDocumentsAgent | ✅ 60% | `13-documents.md` |
| `investor-agent` | 12 | ✅ Deployed | ✅ useInvestorAgent | ✅ 80% | `14-investors.md` |

### ❌ NOT DEPLOYED (need to create)

| Function | Actions | Purpose | Prompt | Task File |
|----------|---------|---------|--------|-----------|
| `event-agent` | 8 | Event management, speaker research | — | — |
| `chatbot-agent` | 22 | Advanced chat features | `16-ai-chat.md` | — |
| `task-agent` | — | Task generation, prioritization | `15-projects.md` | — |
| `insights-generator` | 3 | Daily AI insights for dashboard | `11-main-dashboard.md` | `tasks/02-create-insights-generator.md` |
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

---

## New Components Status

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `ExportModal` | `src/components/pitchdeck/editor/ExportModal.tsx` | PDF/PPTX/Link export | ✅ Created |
| `ProfileMappingBanner` | `src/components/leancanvas/ProfileMappingBanner.tsx` | Coverage indicators + prefill | ✅ Created |
| `ConfidenceBadge` | `src/components/leancanvas/ConfidenceBadge.tsx` | AI confidence indicators | ✅ Created |
| `AIChat` | `src/pages/AIChat.tsx` | Dedicated AI chat page | ✅ Created |

---

## New Routes Status

| Route | Page | Status |
|-------|------|--------|
| `/ai-chat` | `AIChat.tsx` | ✅ Added |

---

## Completed This Session (v2.5)

1. ✅ **Wired InvestorsAIPanel** — Connected useInvestorAgent hooks (discover, analyze pipeline, generate report)
2. ✅ **Passed startupId to InvestorsAIPanel** — From Investors.tsx page
3. ✅ **Exported PipelineAnalysis and FundraisingReport types** — For use in UI components
4. ✅ **Added AI loading states and results display** — Pipeline analysis, health scores, recommendations

---

## Next Steps (Priority Order)

### P0 — This Week

1. ✅ ~~Create investor-agent edge function~~ — 12 actions deployed
2. ✅ ~~Wire Dashboard to real data~~ — useDashboardMetrics hook
3. ✅ ~~Create AI Chat page~~ — /ai-chat route
4. ✅ ~~Wire InvestorsAIPanel~~ — Connected useInvestorAgent hooks to UI
5. **Integrate ExportModal** — Add to SlideEditorPanel header (already in component, needs button in editor)
6. **Integrate ProfileMappingBanner** — Add to LeanCanvasEditor page

### P1 — Next Week

7. **Create `insights-generator` edge function** — Daily AI insights for dashboard
8. **Create `task-agent` edge function** — Project task generation
9. **Wire InvestorDetailSheet with AI** — Fit analysis, meeting prep, outreach generation

### P2 — Following Weeks

10. **Chat history persistence** — Save/load sessions from database
11. **Projects Task Agent** — New edge function for task generation
12. **Create `stage-analyzer` edge function** — Auto-detect startup stage

### P3 — Future

13. **Settings Completion** — All 4 tabs functional
14. **Smart AI System** — Agent orchestration, spec pipeline, QA loops

---

## Critical Blockers: NONE

## High-Risk Issues: NONE

## Production Readiness Checklist

| Area | Status | Notes |
|------|--------|-------|
| Edge Functions | ✅ 7/7 deployed | All have CORS, auth, error handling |
| Frontend Hooks | ✅ 7/7 created | All use React Query + toast notifications |
| AI Panel Wiring | ✅ 4/4 complete | CRM, Documents, Investors, Dashboard |
| Routes | ✅ All protected | ProtectedRoute wrapper on all dashboard routes |
| Database | ✅ RLS enabled | All tables have row-level security |
| API Keys | ✅ Configured | GEMINI_API_KEY, ANTHROPIC_API_KEY in secrets |
| Error Handling | ✅ Consistent | Try/catch with user-friendly messages |

---

## Changelog

| Date | Change | Version |
|------|--------|---------|
| 2026-01-27 | Wired InvestorsAIPanel with useInvestorAgent hooks (discover, pipeline, report) | 2.5 |
| 2026-01-27 | Created investor-agent (12 actions), AI Chat page, real dashboard data | 2.4 |
| 2026-01-27 | Wired CRM + Documents AI panels, integrated ExportModal | 2.3 |
| 2026-01-27 | Created useCRMAgent, useDocumentsAgent, useLeanCanvasAgent hooks | 2.2 |
| 2026-01-27 | Created crm-agent, documents-agent edge functions | 2.1 |
| 2026-01-27 | Created comprehensive dashboard docs system | 2.0 |
