# Prompt 11 — Main Dashboard (Command Center)

> **Phase:** Module | **Priority:** P0 | **Overall:** 15%
> **No code — screen specs, data sources, agent workflows only**
> **Reference:** `100-dashboard-system.md` Section 1

---

## Purpose

Founder's daily starting point. At-a-glance health of the startup with AI-powered strategic guidance.

## Goals

- Show real-time startup health and progress
- Surface actionable AI insights
- Enable quick navigation to any module

## Outcomes

Founders spend less than 30 seconds understanding their startup's status each morning.

---

## Screen Layout

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  AI Strategic   │
│                 │  Good morning, [Name]              🔍 Search │  Review         │
│                 │                                              │                 │
│                 │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──┐ │  "Your traction │
│                 │  │ + Pitch  │ │ + Project│ │ + Contact│ │ +E│ │  metrics show   │
│                 │  │  Deck    │ │          │ │          │ │ ve│ │  steady growth" │
│                 │  └──────────┘ └──────────┘ └──────────┘ └──┘ │                 │
│                 │  Quick Actions                               │ ─────────────── │
│                 │                                              │                 │
│                 │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐│  Upcoming       │
│                 │  │   3     │ │   12    │ │   24    │ │  8  ││  Events         │
│                 │  │ Decks   │ │Investors│ │ Tasks   │ │Events│                 │
│                 │  │ ↑2 new  │ │ ↑4 new  │ │ 6 done  │ │ 2 th││  [Event cards]  │
│                 │  └─────────┘ └─────────┘ └─────────┘ └─────┘│                 │
│                 │  Summary Metrics (KPI cards)                 │ ─────────────── │
│                 │                                              │                 │
│                 │  ┌────────────────────────────────────────┐ │  📅 Calendar    │
│                 │  │  Startup Health          ┌─────────┐   │ │                 │
│                 │  │  Brand Story ▓▓▓▓░ 72   │   68    │   │ │  [Month view]   │
│                 │  │  Traction    ▓▓▓░░ 58   │  /100   │   │ │                 │
│                 │  │  Team        ▓▓▓▓▓ 81   └─────────┘   │ │                 │
│                 │  │  Market      ▓▓░░░ 45                   │ │                 │
│                 │  └────────────────────────────────────────┘ │                 │
│                 │                                              │                 │
│                 │  ┌──────────────────────────────────────────┐│                 │
│                 │  │  Insights [Traction] [Team] [Market]     ││                 │
│                 │  │  "Your MRR grew 12% this month..."       ││                 │
│                 │  │  Stage: Seed → Next: Close 1st VC        ││                 │
│                 │  └──────────────────────────────────────────┘│                 │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Data Sources

| Section | Content | Data Source |
|---------|---------|-------------|
| Greeting bar | "Good morning, [Name]" + global search | `profiles` table |
| Quick Actions | 4 CTAs: Create Pitch, Start Project, Add Contact, View Events | Static links |
| Summary Metrics | 4 KPI cards: Decks, Investors, Tasks, Events | Aggregated counts |
| Startup Health | Score gauge (0-100) with category breakdown | `startups.readiness_score` |
| Deck Activity | Recent pitch deck edits and views | `pitch_decks` + `pitch_deck_slides` |
| Insights Tabs | Traction / Team / Market tabs with AI analysis | `ai-chat` edge function |
| Stage Guidance | Current stage with next-step recommendations | `startups.stage` + AI |

---

## Right Panel (AI Intelligence)

| Section | Content | Data Source |
|---------|---------|-------------|
| AI Strategic Review | Daily insights generated by AI | `ai-chat` -> `stage_guidance` |
| Upcoming Events | Next 2-3 events from calendar | `events` + `industry_events` |
| Dashboard Calendar | Mini month view with event dots | `events` dates |

---

## Agent Workflows

| Workflow | Trigger | Edge Function | Action |
|----------|---------|---------------|--------|
| Stage Guidance | Dashboard loads | `ai-chat` | `stage_guidance` |
| Daily Insights | Dashboard loads (cached 24h) | `ai-chat` | `strategic_review` |
| KPI Aggregation | Dashboard loads | Direct Supabase | Count queries |

---

## User Stories

- As a founder, I open my dashboard and immediately see my startup health score
- As a founder, I see AI-generated insights about my traction metrics
- As a founder, I click a quick action to jump straight into creating a pitch deck

---

## Acceptance Criteria

- [ ] Dashboard loads in under 2 seconds with cached data
- [ ] KPI cards show real counts from database (not hardcoded)
- [ ] AI insights refresh daily with a manual refresh button
- [ ] Stage guidance updates automatically when startup data changes
- [ ] Quick actions navigate to correct pages
- [ ] Startup health gauge animates on load

---

## Frontend Components

| Component | File | Status |
|-----------|------|--------|
| `Dashboard.tsx` | `src/pages/Dashboard.tsx` | ✅ Exists |
| `SummaryMetrics.tsx` | `src/components/dashboard/SummaryMetrics.tsx` | ✅ Exists |
| `StartupHealth.tsx` | `src/components/dashboard/StartupHealth.tsx` | ✅ Exists |
| `InsightsTabs.tsx` | `src/components/dashboard/InsightsTabs.tsx` | ✅ Exists |
| `StageGuidanceCard.tsx` | `src/components/dashboard/StageGuidanceCard.tsx` | ✅ Exists |
| `AIStrategicReview.tsx` | `src/components/dashboard/AIStrategicReview.tsx` | ✅ Exists |
| `DashboardCalendar.tsx` | `src/components/dashboard/DashboardCalendar.tsx` | ✅ Exists |

---

## Missing Work

1. **Wire real data** — KPI cards currently use mock data
2. **Dashboard metrics edge function** — Aggregate queries in one call
3. **AI strategic review** — Daily cached insights
4. **Stage guidance AI** — Context-aware recommendations

---

## Implementation Priority

| Step | Task | Effort | Impact |
|------|------|--------|--------|
| 1 | Create `useDashboardData` with real queries | 2h | High |
| 2 | Wire KPI cards to aggregated counts | 1h | High |
| 3 | Implement AI strategic review call | 2h | Medium |
| 4 | Add stage guidance integration | 1h | Medium |
