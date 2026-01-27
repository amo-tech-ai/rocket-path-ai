# StartupAI Dashboard System — Progress Plan

> **Updated:** 2026-01-27 | **Version:** 2.1 | **Status:** Active
> **Strategy:** `100-dashboard-system.md` (source of truth for all screens)
> **Overall Progress:** 48% complete

---

## Module Progress

| # | Module | Screens | Backend | AI Wired | Frontend | Overall | Phase | Prompt |
|---|--------|---------|---------|----------|----------|---------|-------|--------|
| 1 | **Onboarding** | 4-step wizard | ✅ 95% | ✅ 100% | ✅ 95% | **95%** | Done | — |
| 2 | **Cloudinary** | — (infra) | ✅ 100% | N/A | ✅ 100% | **100%** | Done | — |
| 3 | **Events** | 3 screens | ✅ 100% | 🟡 20% | ✅ 100% | **100%** | Done | — |
| 4 | **Lean Canvas** | 2 screens | ✅ 100% | ✅ 90% | 🟡 60% | **75%** | Active | `01-lean-canvas.md` |
| 5 | **Pitch Deck** | 3 screens | ✅ 95% | 🟡 80% | 🟡 50% | **65%** | Active | `pitch-decks/` |
| 6 | **Main Dashboard** | 1 screen | 🟡 50% | 🔴 0% | 🟡 30% | **25%** | Next | `11-main-dashboard.md` |
| 7 | **CRM** | 3 screens | ✅ 100% | 🔴 0% | 🟡 30% | **44%** | Next | `12-crm.md` |
| 8 | **Documents** | 3 screens | ✅ 100% | 🔴 0% | 🔴 0% | **40%** | Next | `13-documents.md` |
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
| **4** | **Pitch Deck** (wizard + editor) | Flagship feature, Step 1 AI complete, 17 actions | Onboarding data |
| **5** | **Lean Canvas** (polish) | 75% done, 11 actions deployed, needs frontend polish | Onboarding data |
| **6** | **Main Dashboard** | Daily landing page, shows all module data | Pitch deck + lean canvas data |
| **7** | **CRM** (build agent) | Backend 100%, needs `crm-agent` edge function | — |
| **8** | **Documents** (build agent) | Backend 100%, needs `documents-agent` edge function | Cloudinary (done) |
| **9** | **Investors** (build agent) | Backend 100%, needs `investor-agent` edge function | CRM patterns |
| **10** | **Projects** (build task-agent) | Needs new `task-agent` edge function | — |
| **11** | **AI Chat** (build pages) | Backend 100%, no dedicated pages yet | — |
| **12** | **Settings** (complete tabs) | Polish, non-blocking | — |

### Rationale

1. **Pitch Deck first** — highest user demand, Step 1 AI-guided complete with 17 actions
2. **Lean Canvas next** — already 75%, 11 actions deployed, bridges into pitch deck via data cascade
3. **Main Dashboard after data modules** — needs real data from pitch deck + lean canvas to show meaningful KPIs
4. **CRM + Documents + Investors** — DB tables exist, need edge function creation and frontend polish
5. **Projects + Chat + Settings** — lower priority, can ship after core fundraising flow works

---

## Edge Functions Status

### ✅ DEPLOYED (in supabase/functions/)

| Function | Actions | Status | Frontend Wiring | Prompt |
|----------|---------|--------|-----------------|--------|
| `onboarding-agent` | 12 | ✅ Deployed | ✅ 95% | — |
| `lean-canvas-agent` | 11 | ✅ Deployed | 🟡 60% | `01-lean-canvas.md` |
| `pitch-deck-agent` | 17 | ✅ Deployed | 🟡 50% | See pitch-deck prompts |
| `ai-chat` | 5+ | ✅ Deployed | 🟡 30% | `16-ai-chat.md` |

### ❌ NOT DEPLOYED (need to create)

| Function | Actions | Purpose | Prompt | Task File |
|----------|---------|---------|--------|-----------|
| `crm-agent` | 15 | Contact enrichment, deal scoring, email generation | `12-crm.md` | — |
| `investor-agent` | 12 | Investor discovery, fit scoring, outreach | `14-investors.md` | — |
| `documents-agent` | 6 | Document generation, analysis, search | `13-documents.md` | — |
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

## Next Steps (Priority Order)

### P0 — This Week

1. **Complete Pitch Deck Editor** — Slide editing UI, signal strength display, export (Steps 2-5 wizard complete)
2. **Lean Canvas Frontend Polish** — Profile mapping banner, confidence badges, version history panel
3. **Update supabase/config.toml** — Add lean-canvas-agent entry

### P1 — Next Week

4. **Create `crm-agent` edge function** — 15 actions (enrich, score, pipeline, email)
5. **Create `documents-agent` edge function** — 6 actions (generate, analyze, search)
6. **Main Dashboard KPIs** — Wire real data to metric cards

### P2 — Following Weeks

7. **Create `investor-agent` edge function** — 12 actions (discover, fit score, outreach)
8. **Create `insights-generator` edge function** — Daily AI insights for dashboard
9. **AI Chat Pages** — Dedicated chat interface, history view
10. **Projects Task Agent** — New edge function for task generation

### P3 — Future

11. **Create `stage-analyzer` edge function** — Auto-detect startup stage
12. **Settings Completion** — All 4 tabs functional
13. **Smart AI System** — Agent orchestration, spec pipeline, QA loops

---

## Strategy Review

The strategy in `100-dashboard-system.md` is **correct and comprehensive**. Key strengths:

- 12 modules with clear screen breakdowns (27 screens total)
- Every screen has data sources, agent workflows, user stories, acceptance criteria
- 3-panel layout consistently applied (left=context, main=work, right=AI intelligence)
- Visual identity defined (quiet luxury SaaS, Playfair Display + Inter, sage/warm palette)
- Agent workflows mapped to edge function actions with specific triggers

**Key gaps identified:**
1. 6 edge functions documented but not yet created (crm, investor, documents, event, chatbot, task)
2. 2 new edge functions needed for dashboard (insights-generator, stage-analyzer)
3. `lean-canvas-agent` deployed but missing from `supabase/config.toml`

Implementation should follow the order above, prioritizing Pitch Deck and Lean Canvas completion before dashboard.

---

## Changelog

| Date | Change | Version |
|------|--------|---------|
| 2026-01-27 | Verified edge functions, updated status, added task files | 2.1 |
| 2026-01-27 | Added 09-testing-qa.md, task files (02, 04) | 2.1 |
| 2026-01-27 | Created comprehensive dashboard docs system | 2.0 |
| 2026-01-27 | Updated progress to reflect actual deployed edge functions | 2.0 |
