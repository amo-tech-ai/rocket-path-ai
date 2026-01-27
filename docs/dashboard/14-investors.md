# Prompt 14 — Investors Module

> **Phase:** Module | **Priority:** P1 | **Overall:** 44%
> **No code — screen specs, data sources, agent workflows only**
> **Reference:** `100-dashboard-system.md` Section 3

---

## Purpose

Fundraising command center. Discover, match, track, and engage investors with AI-powered fit scoring.

## Goals

- Discover investors matching the startup's stage, sector, and geography
- Score investor fit (0-100) based on thesis alignment
- Track pipeline from discovery to term sheet
- Generate personalized outreach with warm intro paths

## Outcomes

Founders run a structured fundraising process instead of random LinkedIn cold outreach.

---

## Screen 14a: Investor Discovery

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  Investor Intel │
│                 │  Investors                [Discover ▸]       │                 │
│                 │                                              │  Total: 28      │
│                 │  🔍 Search investors...                      │  Avg Fit: 74    │
│                 │  [Stage ▾] [Sector ▾] [Geography ▾]         │  In Pipeline: 15│
│                 │                                              │                 │
│                 │  ┌──────────────────────────────────────┐    │ ─────────────── │
│                 │  │  a16z Bio Fund                  ●91  │    │                 │
│                 │  │  Andreessen Horowitz                  │    │  AI Actions     │
│                 │  │  Focus: Healthcare AI, Seed-A         │    │                 │
│                 │  │  1 mutual connection                  │    │  [Discover   ▸] │
│                 │  └──────────────────────────────────────┘    │  [Match      ▸] │
│                 │  ┌──────────────────────────────────────┐    │  [Enrich     ▸] │
│                 │  │  Sequoia Seed                   ●82  │    │  [Outreach   ▸] │
│                 │  │  Focus: B2B SaaS, AI/ML, Seed         │    │                 │
│                 │  │  2 mutual connections                 │    │ ─────────────── │
│                 │  └──────────────────────────────────────┘    │                 │
│                 │                                              │  Warm Paths     │
│                 │  Sorted by Fit Score (highest first)         │  [Connection    │
│                 │                                              │   hints]        │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Screen 14b: Investor Pipeline

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  Fundraise      │
│                 │  Investor Pipeline                            │                 │
│                 │                                              │  Target: $2M    │
│                 │  ▓▓▓▓▓▓▓▓░░░░░░░ $800K / $2M committed     │  Committed:$800K│
│                 │                                              │  Pipeline: $3.2M│
│                 │  Research  Reached   Meeting  Due Dil  Term  │                 │
│                 │           Out                         Sheet  │ ─────────────── │
│                 │                                              │                 │
│                 │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │  AI Actions     │
│                 │  │First │ │YC    │ │a16z  │ │Sequoia│ Closed│                 │
│                 │  │Round │ │      │ │Bio   │ │Seed  │       │  [Track      ▸] │
│                 │  │●76   │ │●68   │ │●91   │ │●82   │ $800K │  [Forecast   ▸] │
│                 │  └──────┘ └──────┘ └──────┘ └──────┘       │  [Outreach   ▸] │
│                 │                                              │                 │
│                 │  ← Drag investors between stages             │                 │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Screen 14c: Investor Detail Sheet

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | Name, firm, fit score, status | `investors` row |
| Fit Breakdown | Thesis alignment, stage match, sector, geography | `investor-agent` analysis |
| Thesis | Investment focus areas, check sizes | `investors` fields |
| Portfolio | Relevant portfolio companies | Enrichment data |
| Warm Paths | Mutual connections via LinkedIn | `investor-agent` -> `find_warm_paths` |
| Engagement History | Timeline of interactions | `communications` |

---

## Data Sources

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `investors` | Investor tracking | name, firm, fit_score, status, thesis_summary |
| `contacts` | Contact integration | Can convert investor to contact |
| `communications` | Engagement log | Emails, meetings with investors |

---

## Agent Workflows

| Workflow | Trigger | Edge Function | Action | Output |
|----------|---------|---------------|--------|--------|
| Investor Discovery | Click "Discover" | `investor-agent` | `discover_investors` | Ranked list |
| Fit Scoring | Investor added | `investor-agent` | `analyze_investor_fit` | Score breakdown |
| Warm Intro Paths | View detail | `investor-agent` | `find_warm_paths` | Mutual connections |
| Outreach Generation | Click "Outreach" | `investor-agent` | `generate_outreach` | Email draft |
| Status Tracking | Move in pipeline | `investor-agent` | `track_investor_engagement` | Updated status |

---

## User Stories

- As a founder raising seed, I click "Discover" and get ranked VCs matching my sector
- As a founder, I see warm intro paths showing mutual connections for each investor
- As a founder, I track my fundraising pipeline visually with committed vs target
- As a founder, I generate personalized cold emails referencing investor thesis

---

## Acceptance Criteria

- [ ] Discovery returns investors sorted by fit score (highest first)
- [ ] Fit score breakdown shows: thesis alignment, stage, sector, geography
- [ ] Pipeline supports drag-and-drop between stages
- [ ] Fundraising progress bar updates as investors move to "Closed"
- [ ] Outreach email references at least 2 specific data points about investor

---

## Frontend Components

| Component | File | Status |
|-----------|------|--------|
| `Investors.tsx` | `src/pages/Investors.tsx` | ✅ Exists |
| `InvestorCard.tsx` | `src/components/investors/InvestorCard.tsx` | ✅ Exists |
| `InvestorPipeline.tsx` | `src/components/investors/InvestorPipeline.tsx` | ✅ Exists |
| `InvestorDetailSheet.tsx` | `src/components/investors/InvestorDetailSheet.tsx` | ✅ Exists |
| `InvestorsAIPanel.tsx` | `src/components/investors/InvestorsAIPanel.tsx` | ✅ Exists |
| `FundraisingProgress.tsx` | `src/components/investors/FundraisingProgress.tsx` | ✅ Exists |

---

## Missing Work

1. **Discovery UI** — Search filters + discovery button wiring
2. **Fit score display** — Visual breakdown in detail sheet
3. **Warm paths UI** — Show mutual connections
4. **Outreach generation** — Email preview/edit modal

---

## Implementation Priority

| Step | Task | Effort | Impact |
|------|------|--------|--------|
| 1 | Create `useInvestorAgent` hook | 2h | High |
| 2 | Wire discovery to `discover_investors` | 1h | High |
| 3 | Build fit score breakdown UI | 2h | Medium |
| 4 | Add outreach generation modal | 2h | Medium |
| 5 | Implement warm paths display | 2h | Medium |
