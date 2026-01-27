# StartupAI Dashboard System — Progress Plan

> **Updated:** 2026-01-27 | **Version:** 2.0 | **Status:** Active
> **Strategy:** `100-new-dashboard-system.md` (source of truth for all screens)
> **Overall Progress:** 45% complete

---

## Module Progress

| # | Module | Screens | Backend | AI Wired | Frontend | Overall | Phase | Prompt |
|---|--------|---------|---------|----------|----------|---------|-------|--------|
| 1 | **Onboarding** | 4-step wizard | ✅ 95% | ✅ 100% | ✅ 95% | **95%** | Done | — |
| 2 | **Cloudinary** | — (infra) | ✅ 100% | N/A | ✅ 100% | **100%** | Done | — |
| 3 | **Events** | 3 screens | ✅ 100% | 🟡 20% | ✅ 100% | **100%** | Done | — |
| 4 | **Lean Canvas** | 2 screens | ✅ 90% | ✅ 90% | 🟡 60% | **70%** | Active | `10-lean-canvas.md` |
| 5 | **Pitch Deck** | 3 screens | 🟡 80% | 🟡 80% | 🔴 0% | **40%** | Active | See `pitch-deck/01-lovable-prompts/` |
| 6 | **Main Dashboard** | 1 screen | 🔴 0% | 🔴 0% | 🟡 30% | **15%** | Next | `11-main-dashboard.md` |
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
| **4** | **Pitch Deck** (wizard + editor) | Flagship feature, backend 80% ready | Onboarding data |
| **5** | **Lean Canvas** (polish) | 70% done, bridge to pitch deck | Onboarding data |
| **6** | **Main Dashboard** | Daily landing page, shows all module data | Pitch deck + lean canvas data |
| **7** | **CRM** (wire AI) | Backend 100%, needs AI wiring + polish | — |
| **8** | **Documents** (wire AI) | Backend 100%, needs upload + AI | Cloudinary (done) |
| **9** | **Investors** (wire AI) | Backend 100%, needs discovery + fit UI | CRM patterns |
| **10** | **Projects** (build task-agent) | Needs new edge function | — |
| **11** | **AI Chat** (build pages) | Backend 100%, no dedicated pages yet | — |
| **12** | **Settings** (complete tabs) | Polish, non-blocking | — |

### Rationale

1. **Pitch Deck first** — highest user demand, backend nearly complete, flagship differentiator
2. **Lean Canvas next** — already 70%, bridges into pitch deck via data cascade
3. **Main Dashboard after data modules** — needs real data from pitch deck + lean canvas to show meaningful KPIs
4. **CRM + Documents + Investors** — all have backends done, need AI wiring and frontend polish
5. **Projects + Chat + Settings** — lower priority, can ship after core fundraising flow works

---

## Edge Functions Status

| Function | Actions | Backend | AI Wired to Frontend | Prompt |
|----------|---------|---------|---------------------|--------|
| `onboarding-agent` | 11 | ✅ | ✅ 95% | — |
| `lean-canvas-agent` | 5 | ✅ | 🟡 60% | `10-lean-canvas.md` |
| `pitch-deck-agent` | 7 | ✅ | 🔴 0% | See pitch-deck prompts |
| `crm-agent` | 15 | ✅ | 🔴 0% | `12-crm.md` |
| `investor-agent` | 12 | ✅ | 🔴 0% | `14-investors.md` |
| `documents-agent` | 6 | ✅ | 🔴 0% | `13-documents.md` |
| `event-agent` | 8 | ✅ | 🟡 70% | — |
| `ai-chat` | 3 | ✅ | 🟡 30% | `16-ai-chat.md` |
| `chatbot-agent` | 22 | ✅ | 🔴 0% | `16-ai-chat.md` |
| `task-agent` | — | ❌ Missing | — | `15-projects.md` |
| `dashboard-metrics` | — | ❌ Missing | — | `11-main-dashboard.md` |

---

## Prompt Files Index

Each module has a dedicated prompt file (no code) describing screens, 3-panel layout, AI behavior, data flow, and acceptance criteria.

### Foundation Prompts (00-09)

| File | Topic | Status |
|------|-------|--------|
| `00-progress-plan.md` | Progress tracking, implementation order | Ready |
| `01-wire-frame.md` | Wireframes for all 11 modules (27 screens) | Ready |
| `02-design-system.md` | Design tokens, typography, colors, components, spacing | Ready |
| `03-data-strategy.md` | Schema (54 tables), ERDs, RLS, indexes, edge functions | Ready |
| `03.1-smart-ai-system.md` | Smart AI: agent orchestration, task lifecycle, spec pipeline, QA loops, memory, realtime | Ready |
| `04-navigation-routing.md` | Route map, nav sidebar, protected routes, breadcrumbs | Ready |
| `05-authentication.md` | OAuth flows, session management, roles, RLS helpers | Ready |
| `06-ai-architecture.md` | AI routing, model selection, prompts, cost management | Ready |
| `07-state-realtime.md` | React Query, autosave, realtime channels, offline | Ready |
| `08-edge-functions.md` | 14 functions, shared modules, action catalog | Ready |
| `09-testing-qa.md` | Test strategy, QA checklists, performance benchmarks | Ready |

### Module Prompts (10-17)

| File | Module | Screens | Status |
|------|--------|---------|--------|
| `10-lean-canvas.md` | Lean Canvas | Canvas Editor, AI Panel | Ready |
| `11-main-dashboard.md` | Main Dashboard | Command Center | Ready |
| `12-crm.md` | CRM | Contacts, Pipeline, AI Panel | Ready |
| `13-documents.md` | Documents | Library, Detail, AI Generate | Ready |
| `14-investors.md` | Investors | Discovery, Pipeline, AI Panel | Ready |
| `15-projects.md` | Projects | List, Detail, Tasks Board | Ready |
| `16-ai-chat.md` | AI Chat | Chat Interface, History | Ready |
| `17-settings.md` | Settings | Profile, Appearance, Notifications, Account | Ready |

---

## Strategy Review

The strategy in `100-new-dashboard-system.md` is **correct and comprehensive**. Key strengths:

- 11 modules with clear screen breakdowns (27 screens total)
- Every screen has data sources, agent workflows, user stories, acceptance criteria, real-world examples
- 3-panel layout consistently applied (left=context, main=work, right=AI intelligence)
- Visual identity defined (quiet luxury SaaS, Playfair Display + Inter, sage/warm palette)
- Agent workflows mapped to edge function actions with specific triggers

No changes needed to the strategy. Implementation should follow the order above.
