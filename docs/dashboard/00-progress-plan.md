# StartupAI Dashboard System — Progress Plan

> **Updated:** 2026-01-27 | **Version:** 2.2 | **Status:** Active
> **Strategy:** `100-dashboard-system.md` (source of truth for all screens)
> **Overall Progress:** 52% complete

---

## Module Progress

| # | Module | Screens | Backend | AI Wired | Frontend | Overall | Phase | Prompt |
|---|--------|---------|---------|----------|----------|---------|-------|--------|
| 1 | **Onboarding** | 4-step wizard | ✅ 95% | ✅ 100% | ✅ 95% | **95%** | Done | — |
| 2 | **Cloudinary** | — (infra) | ✅ 100% | N/A | ✅ 100% | **100%** | Done | — |
| 3 | **Events** | 3 screens | ✅ 100% | 🟡 20% | ✅ 100% | **100%** | Done | — |
| 4 | **Lean Canvas** | 2 screens | ✅ 100% | ✅ 90% | 🟡 75% | **85%** | Active | `01-lean-canvas.md` |
| 5 | **Pitch Deck** | 3 screens | ✅ 95% | 🟡 80% | 🟡 70% | **75%** | Active | `pitch-decks/` |
| 6 | **Main Dashboard** | 1 screen | 🟡 50% | 🔴 0% | 🟡 30% | **25%** | Next | `11-main-dashboard.md` |
| 7 | **CRM** | 3 screens | ✅ 100% | ✅ 100% | 🟡 30% | **70%** | Active | `12-crm.md` |
| 8 | **Documents** | 3 screens | ✅ 100% | ✅ 100% | 🔴 0% | **60%** | Active | `13-documents.md` |
| 9 | **Investors** | 3 screens | ✅ 100% | 🔴 0% | 🟡 30% | **44%** | Next | `14-investors.md` |
| 10 | **Projects** | 3 screens | 🔴 0% | 🔴 0% | 🟡 50% | **25%** | Planned | `15-projects.md` |
| 11 | **AI Chat** | 2 screens | ✅ 100% | 🟡 40% | 🔴 0% | **30%** | Planned | `16-ai-chat.md` |
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
| **6** | **CRM** (wire frontend) | Backend + hooks complete, needs UI wiring | — |
| **7** | **Documents** (wire frontend) | Backend + hooks complete, needs UI wiring | Cloudinary (done) |
| **8** | **Main Dashboard** | Daily landing page, shows all module data | Pitch deck + lean canvas data |
| **9** | **Investors** (build agent) | Backend 100%, needs `investor-agent` edge function | CRM patterns |
| **10** | **Projects** (build task-agent) | Needs new `task-agent` edge function | — |
| **11** | **AI Chat** (build pages) | Backend 100%, no dedicated pages yet | — |
| **12** | **Settings** (complete tabs) | Polish, non-blocking | — |

### Rationale

1. **Pitch Deck first** — highest user demand, export functionality now complete
2. **Lean Canvas next** — 85% complete, confidence badges and profile mapping added
3. **CRM + Documents immediately** — frontend hooks complete, just need UI wiring
4. **Main Dashboard after data modules** — needs real data from pitch deck + lean canvas to show meaningful KPIs
5. **Investors + Projects + Chat + Settings** — lower priority, can ship after core fundraising flow works

---

## Edge Functions Status

### ✅ DEPLOYED (in supabase/functions/)

| Function | Actions | Status | Frontend Hooks | Frontend Wiring | Prompt |
|----------|---------|--------|----------------|-----------------|--------|
| `onboarding-agent` | 12 | ✅ Deployed | ✅ useOnboardingAgent | ✅ 95% | — |
| `lean-canvas-agent` | 11 | ✅ Deployed | ✅ useLeanCanvasAgent | 🟡 75% | `01-lean-canvas.md` |
| `pitch-deck-agent` | 17 | ✅ Deployed | ✅ usePitchDeckEditor | 🟡 70% | See pitch-deck prompts |
| `ai-chat` | 5+ | ✅ Deployed | ✅ useAIChat | 🟡 30% | `16-ai-chat.md` |
| `crm-agent` | 8 | ✅ Deployed | ✅ useCRMAgent | 🔴 0% | `12-crm.md` |
| `documents-agent` | 6 | ✅ Deployed | ✅ useDocumentsAgent | 🔴 0% | `13-documents.md` |

### ❌ NOT DEPLOYED (need to create)

| Function | Actions | Purpose | Prompt | Task File |
|----------|---------|---------|--------|-----------|
| `investor-agent` | 12 | Investor discovery, fit scoring, outreach | `14-investors.md` | — |
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
```

**Missing entries (add when creating):**
- `[functions.lean-canvas-agent]` — already deployed but not in config
- `[functions.crm-agent]` 
- `[functions.investor-agent]`
- `[functions.documents-agent]`
- `[functions.event-agent]`
- `[functions.chatbot-agent]`
- `[functions.insights-generator]`
- `[functions.stage-analyzer]`

---

## Prompt Files Index

Each module has a dedicated prompt file (no code) describing screens, 3-panel layout, AI behavior, data flow, and acceptance criteria.

### Foundation Prompts (00-09)

| File | Topic | Status |
|------|-------|--------|
| `00-index.md` | Master index + quick navigation | ✅ Ready |
| `00-progress-plan.md` | Progress tracking, implementation order | ✅ Ready |
| `01-wireframes.md` | Wireframes for all 11 modules (27 screens) | ✅ Ready |
| `01-lean-canvas.md` | Lean Canvas edge function + UI architecture | ✅ Ready |
| `03-data-strategy.md` | Schema (48 tables), ERDs, RLS, indexes, edge functions | ✅ Ready |
| `03.1-smart-ai-system.md` | Smart AI: agent orchestration, task lifecycle, spec pipeline, QA loops, memory, realtime | ✅ Ready |
| `04-navigation-routing.md` | Route map, nav sidebar, protected routes, breadcrumbs | ✅ Ready |
| `05-authentication.md` | OAuth flows, session management, roles, RLS helpers | ✅ Ready |
| `06-ai-architecture.md` | AI routing, model selection, prompts, cost management | ✅ Ready |
| `07-state-realtime.md` | React Query, autosave, realtime channels, offline | ✅ Ready |
| `08-edge-functions.md` | 14 functions, shared modules, action catalog | ✅ Ready |
| `09-testing-qa.md` | Test strategy, QA checklists, performance benchmarks | ✅ Ready |

### Module Prompts (10-17)

| File | Module | Screens | Status |
|------|--------|---------|--------|
| `11-main-dashboard.md` | Main Dashboard | Command Center | ✅ Ready |
| `12-crm.md` | CRM | Contacts, Pipeline, Detail | ✅ Ready |
| `13-documents.md` | Documents | Library, Detail, Generator | ✅ Ready |
| `14-investors.md` | Investors | Discovery, Pipeline, Detail | ✅ Ready |
| `15-projects.md` | Projects | List, Detail, Tasks Board | ✅ Ready |
| `16-ai-chat.md` | AI Chat | Chat Interface, History | ✅ Ready |
| `17-settings.md` | Settings | Profile, Appearance, Notifications, Account | ✅ Ready |

### Task Files (tasks/)

| File | Task | Priority | Status |
|------|------|----------|--------|
| `tasks/02-create-insights-generator.md` | Daily AI Insights Edge Function | P1 | ⬜ Not Started |
| `tasks/04-create-stage-analyzer.md` | Stage Analyzer Edge Function | P2 | ⬜ Not Started |

---

## Frontend Hooks Status

All deployed edge functions now have corresponding frontend hooks:

| Hook | File | Actions | Status |
|------|------|---------|--------|
| `useCRMAgent` | `src/hooks/useCRMAgent.ts` | 8 (enrich, score, pipeline, email, duplicates, summarize, follow-ups) | ✅ Created |
| `useDocumentsAgent` | `src/hooks/useDocumentsAgent.ts` | 6 (generate, analyze, improve, search, summarize, compare) | ✅ Created |
| `useLeanCanvasAgent` | `src/hooks/useLeanCanvasAgent.ts` | 11 (map, prefill, suggest, validate, benchmarks, versions) | ✅ Created |

---

## New Components Status

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `ExportModal` | `src/components/pitchdeck/editor/ExportModal.tsx` | PDF/PPTX/Link export | ✅ Created |
| `ProfileMappingBanner` | `src/components/leancanvas/ProfileMappingBanner.tsx` | Coverage indicators + prefill | ✅ Created |
| `ConfidenceBadge` | `src/components/leancanvas/ConfidenceBadge.tsx` | AI confidence indicators | ✅ Created |

---

## Next Steps (Priority Order)

### P0 — This Week

1. ✅ ~~Complete Pitch Deck Export~~ — PDF/PPTX/Link modal created
2. ✅ ~~Lean Canvas Confidence Badges~~ — ProfileMappingBanner + ConfidenceBadge created
3. ✅ ~~Create useCRMAgent hook~~ — 8 actions wired
4. ✅ ~~Create useDocumentsAgent hook~~ — 6 actions wired
5. **Wire CRM UI** — Connect useCRMAgent to ContactDetail, PipelineView components
6. **Wire Documents UI** — Connect useDocumentsAgent to DocumentLibrary, DocumentDetail

### P1 — Next Week

7. **Integrate ExportModal** — Add to SlideEditorPanel header
8. **Integrate ProfileMappingBanner** — Add to LeanCanvasEditor page
9. **Main Dashboard KPIs** — Wire real data to metric cards
10. **Create `investor-agent` edge function** — 12 actions (discover, fit score, outreach)

### P2 — Following Weeks

11. **Create `insights-generator` edge function** — Daily AI insights for dashboard
12. **AI Chat Pages** — Dedicated chat interface, history view
13. **Projects Task Agent** — New edge function for task generation

### P3 — Future

14. **Create `stage-analyzer` edge function** — Auto-detect startup stage
15. **Settings Completion** — All 4 tabs functional
16. **Smart AI System** — Agent orchestration, spec pipeline, QA loops

---

## Strategy Review

The strategy in `100-dashboard-system.md` is **correct and comprehensive**. Key strengths:

- 12 modules with clear screen breakdowns (27 screens total)
- Every screen has data sources, agent workflows, user stories, acceptance criteria
- 3-panel layout consistently applied (left=context, main=work, right=AI intelligence)
- Visual identity defined (quiet luxury SaaS, Playfair Display + Inter, sage/warm palette)
- Agent workflows mapped to edge function actions with specific triggers

**Completed this session:**
1. ✅ Created `useCRMAgent` hook (8 actions)
2. ✅ Created `useDocumentsAgent` hook (6 actions)
3. ✅ Created `useLeanCanvasAgent` hook (11 actions)
4. ✅ Created `ExportModal` component (PDF/PPTX/Link)
5. ✅ Created `ProfileMappingBanner` component (coverage indicators)
6. ✅ Created `ConfidenceBadge` component (AI confidence display)

**Key gaps remaining:**
1. Wire CRM hooks to UI components
2. Wire Documents hooks to UI components
3. Integrate ExportModal into SlideEditorPanel
4. Integrate ProfileMappingBanner into LeanCanvasEditor
5. Create remaining edge functions (investor, insights, stage)

---

## Changelog

| Date | Change | Version |
|------|--------|---------|
| 2026-01-27 | Verified edge functions, updated status, added task files | 2.1 |
| 2026-01-27 | Added 09-testing-qa.md, task files (02, 04) | 2.1 |
| 2026-01-27 | Created comprehensive dashboard docs system | 2.0 |
| 2026-01-27 | Updated progress to reflect actual deployed edge functions | 2.0 |
