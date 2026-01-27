# Dashboard System — Master Index & Progress Tracker

> **Version:** 2.1 | **Date:** January 27, 2026  
> **Status:** 🟡 Active Implementation  
> **Overall Progress:** 48%

---

## Quick Navigation

| # | File | Topic | Priority |
|---|------|-------|----------|
| **Foundation Prompts (00-09)** | | |
| 00 | `00-index.md` | This index + progress tracker | — |
| 00a | `00-progress-plan.md` | Module progress & implementation order | — |
| 01a | `01-wireframes.md` | ASCII wireframes for all 27 screens | P0 |
| 01b | `01-lean-canvas.md` | Lean Canvas edge function architecture | P0 |
| 03 | `03-data-strategy.md` | 48 tables, ERDs, RLS, indexes | P0 |
| 03.1 | `03.1-smart-ai-system.md` | Auto-Claude adaptation (10 screens) | P1 |
| 04 | `04-navigation-routing.md` | Routes, nav sidebar, breadcrumbs | P0 |
| 05 | `05-authentication.md` | OAuth, roles, RLS helpers | P0 |
| 06 | `06-ai-architecture.md` | AI routing, models, prompts, costs | P0 |
| 07 | `07-state-realtime.md` | React Query, autosave, realtime | P1 |
| 08 | `08-edge-functions.md` | 14 functions, 100+ actions | P0 |
| 09 | `09-testing-qa.md` | Test strategy, QA checklists, benchmarks | P1 |
| **Module Prompts (10-17)** | | |
| 11 | `11-main-dashboard.md` | Main Dashboard (1 screen) | P0 |
| 12 | `12-crm.md` | CRM (3 screens) | P0 |
| 13 | `13-documents.md` | Documents (3 screens) | P1 |
| 14 | `14-investors.md` | Investors (3 screens) | P1 |
| 15 | `15-projects.md` | Projects (3 screens) | P1 |
| 16 | `16-ai-chat.md` | AI Chat (2 screens) | P2 |
| 17 | `17-settings.md` | Settings (4 tabs) | P2 |
| **Reference** | | |
| 100 | `100-dashboard-system.md` | Complete system plan (source of truth) | — |
| **Task Files** | | |
| T02 | `tasks/02-create-insights-generator.md` | Daily AI Insights edge function | P1 |
| T04 | `tasks/04-create-stage-analyzer.md` | Stage Analyzer edge function | P2 |

---

## Module Progress Summary

| # | Module | Screens | Backend | AI Wired | Frontend | Overall | Status |
|---|--------|---------|---------|----------|----------|---------|--------|
| 1 | **Onboarding** | 4-step wizard | ✅ 95% | ✅ 100% | ✅ 95% | **95%** | ✅ Done |
| 2 | **Events** | 3 screens | ✅ 100% | 🟡 20% | ✅ 100% | **100%** | ✅ Done |
| 3 | **Pitch Deck** | 3 screens | ✅ 95% | 🟡 80% | 🟡 50% | **65%** | 🔵 Active |
| 4 | **Lean Canvas** | 2 screens | ✅ 100% | ✅ 90% | 🟡 60% | **75%** | 🔵 Active |
| 5 | **Main Dashboard** | 1 screen | 🟡 50% | 🔴 0% | 🟡 30% | **25%** | ⬜ Next |
| 6 | **CRM** | 3 screens | ✅ 100% | 🔴 0% | 🟡 30% | **44%** | ⬜ Next |
| 7 | **Documents** | 3 screens | ✅ 100% | 🔴 0% | 🔴 0% | **40%** | ⬜ Planned |
| 8 | **Investors** | 3 screens | ✅ 100% | 🔴 0% | 🟡 30% | **44%** | ⬜ Planned |
| 9 | **Projects** | 3 screens | 🔴 0% | 🔴 0% | 🟡 50% | **25%** | ⬜ Planned |
| 10 | **AI Chat** | 2 screens | ✅ 100% | 🟡 40% | 🔴 0% | **30%** | ⬜ Planned |
| 11 | **Settings** | 4 tabs | N/A | N/A | 🟡 60% | **60%** | ⬜ Planned |
| 12 | **Smart AI** | 10 screens | 🔴 0% | 🔴 0% | 🔴 0% | **0%** | ⬜ Future |

---

## Edge Functions — Actual Deployment Status

### ✅ DEPLOYED (verified in supabase/functions/)

| Function | Actions | Config Entry | Frontend Wiring |
|----------|---------|--------------|-----------------|
| `onboarding-agent` | 12 | ✅ Yes | ✅ 95% |
| `lean-canvas-agent` | 11 | 🔴 Missing | 🟡 60% |
| `pitch-deck-agent` | 17 | ✅ Yes | 🟡 50% |
| `ai-chat` | 5+ | ✅ Yes | 🟡 30% |

### ❌ NOT DEPLOYED (documented but need creation)

| Function | Actions | Purpose | Blocks |
|----------|---------|---------|--------|
| `crm-agent` | 15 | Contact enrichment, deal scoring | CRM module |
| `investor-agent` | 12 | Investor discovery, fit scoring | Investors module |
| `documents-agent` | 6 | Document generation, analysis | Documents module |
| `event-agent` | 8 | Event management | Events AI features |
| `chatbot-agent` | 22 | Advanced chat | AI Chat module |
| `task-agent` | — | Task generation | Projects module |
| `insights-generator` | 3 | Daily AI insights | Main Dashboard |
| `stage-analyzer` | 3 | Stage detection | Main Dashboard |

---

## Implementation Order (Recommended)

| Priority | Module | Prompt File | Why This Order | Depends On |
|----------|--------|-------------|----------------|------------|
| ~~1~~ | ~~Onboarding~~ | — | ✅ Complete | — |
| ~~2~~ | ~~Events~~ | — | ✅ Complete | — |
| **3** | **Pitch Deck** | `pitch-decks/` | Flagship feature, 17 actions deployed | Onboarding data |
| **4** | **Lean Canvas** | `01-lean-canvas.md` | 75% done, 11 actions deployed | Onboarding data |
| **5** | **Main Dashboard** | `11-main-dashboard.md` | Daily landing page, needs module data | Pitch + Canvas |
| **6** | **CRM** | `12-crm.md` | Backend 100%, needs `crm-agent` | — |
| **7** | **Documents** | `13-documents.md` | Backend 100%, needs `documents-agent` | Cloudinary |
| **8** | **Investors** | `14-investors.md` | Backend 100%, needs `investor-agent` | CRM patterns |
| **9** | **Projects** | `15-projects.md` | Needs new `task-agent` edge function | — |
| **10** | **AI Chat** | `16-ai-chat.md` | Backend 100%, no dedicated pages | — |
| **11** | **Settings** | `17-settings.md` | Polish, non-blocking | — |
| **12** | **Smart AI** | `03.1-smart-ai-system.md` | Advanced autonomous layer | All modules |

---

## 3-Panel Layout (All Screens)

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  LEFT (w-64)    │  MAIN (flex-1, max-w-1200)                   │  RIGHT (w-80)   │
│  Fixed          │  Scrollable                                  │  Collapsible    │
│                 │                                              │                 │
│  Logo           │  Page content                                │  AI Intelligence│
│  Nav items      │  Grids, lists, forms                         │  Stats, insights│
│  Progress       │  Kanban boards                               │  Suggestions    │
│  Settings       │  Editors                                     │  Chat panel     │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Visual Identity

| Element | Value |
|---------|-------|
| Tone | Quiet luxury SaaS (Stripe meets Linear) |
| Primary accent | Deep Emerald / Sage green (`bg-sage`, `bg-sage-light`) |
| Secondary accent | Warm orange (`bg-warm`) for highlights only |
| Neutrals | Stone, Sand, Off-White surfaces |
| Typography | Playfair Display (headings) + Inter (body) |
| Spacing | Generous white space, no cramped layouts |
| AI presence | Calm nudges, never urgent or shouting |

---

## Next Steps (Priority Order)

### P0 — This Week
1. **Complete Pitch Deck Editor** — Slide editing UI, signal strength, export
2. **Lean Canvas Frontend Polish** — Profile mapping banner, confidence badges
3. **Fix supabase/config.toml** — Add lean-canvas-agent entry

### P1 — Next Week
4. **Create `crm-agent` edge function** — 15 actions
5. **Create `documents-agent` edge function** — 6 actions
6. **Main Dashboard KPIs** — Wire real data to metric cards

### P2 — Following Weeks
7. **Create `investor-agent` edge function** — 12 actions
8. **Create `insights-generator` edge function** — Daily AI insights
9. **AI Chat Pages** — Dedicated chat interface, history view

### P3 — Future
10. **Smart AI System** — Agent orchestration, spec pipeline, QA loops

---

## Changelog

| Date | Change | Version |
|------|--------|---------|
| 2026-01-27 | Verified edge functions, updated all status, added task files | 2.1 |
| 2026-01-27 | Created comprehensive dashboard docs system | 2.0 |
| 2026-01-27 | Added all foundation prompts (00-09) | 2.0 |
| 2026-01-27 | Added 100-dashboard-system.md as source of truth | 2.0 |
| 2026-01-27 | Updated lean-canvas-agent with 11 actions | 1.5 |

---

**Last Updated:** January 27, 2026  
**Maintainer:** AI Systems Architect
