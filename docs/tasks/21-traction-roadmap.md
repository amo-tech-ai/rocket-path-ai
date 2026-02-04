# 150 - Traction Roadmap

> Plan and track growth milestones with channel testing

---

| Aspect | Details |
|--------|---------|
| **Screens** | TractionRoadmap page |
| **Features** | Milestones, channel tests, metrics tracking |
| **Agents** | — |
| **Edge Functions** | — |
| **Use Cases** | Plan growth, track progress, compare channels |
| **Real-World** | "Founder sets 'First 100 users' milestone, tracks weekly progress" |

---

```yaml
---
task_id: 150-TRC
title: Traction Roadmap
diagram_ref: —
phase: GROWTH
priority: P1
status: Not Started
skill: /traction
ai_model: —
subagents: [frontend-designer, supabase-expert]
edge_function: —
schema_tables: [traction_milestones, channel_tests]
depends_on: [MVP]
---
```

---

## Description

Build a traction planning and tracking system. Founders define growth milestones (100 users, $10K MRR), select channels to test (LinkedIn, Content, Ads), and track weekly progress. System visualizes trajectory and alerts when off-track.

## Rationale

**Problem:** Growth is chaotic without clear milestones.
**Solution:** Structured milestone planning with channel testing.
**Impact:** Founders have clear growth targets and track progress.

---

## Goals

1. **Primary:** Define and track growth milestones
2. **Secondary:** Compare channel effectiveness
3. **Quality:** Weekly progress updates

## Acceptance Criteria

- [ ] Create milestones with target metrics
- [ ] Set target dates for milestones
- [ ] Log weekly progress updates
- [ ] Visualize trajectory vs target
- [ ] Create channel tests
- [ ] Track channel metrics (CAC, conversion)
- [ ] Compare channel performance
- [ ] Alert when off-track (>20% behind)

---

## Schema

### Table: traction_milestones

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups |
| title | text | NOT NULL |
| metric_type | text | CHECK IN ('users', 'revenue', 'customers', 'custom') |
| target_value | numeric | NOT NULL |
| current_value | numeric | default 0 |
| target_date | date | NOT NULL |
| achieved_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

### Table: channel_tests

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups |
| channel | text | NOT NULL |
| budget | numeric | |
| leads | integer | default 0 |
| conversions | integer | default 0 |
| cac | numeric | computed |
| status | text | CHECK IN ('testing', 'scaling', 'paused', 'failed') |
| started_at | date | |
| ended_at | date | nullable |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_traction.sql` | Create |
| Page | `src/pages/TractionRoadmap.tsx` | Create |
| Component | `src/components/traction/MilestoneCard.tsx` | Create |
| Component | `src/components/traction/ChannelComparison.tsx` | Create |
| Component | `src/components/traction/ProgressChart.tsx` | Create |
| Hook | `src/hooks/useTraction.ts` | Create |

---

## UI Layout

```
┌─────────────────────────────────────────────────────┐
│ Traction Roadmap                    [+ Milestone]   │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│ │ 100 Users   │ │ $1K MRR     │ │ 10 Paying   │    │
│ │ 45/100 (45%)│ │ $0/$1K (0%) │ │ 2/10 (20%)  │    │
│ │ Due: Mar 1  │ │ Due: Apr 1  │ │ Due: Mar 15 │    │
│ │ [On Track]  │ │ [At Risk]   │ │ [Behind]    │    │
│ └─────────────┘ └─────────────┘ └─────────────┘    │
├─────────────────────────────────────────────────────┤
│ Channel Performance                                 │
│ ┌───────────────────────────────────────────────┐  │
│ │ Channel    │ Leads │ Conv │ CAC   │ Status    │  │
│ │ LinkedIn   │ 50    │ 5    │ $20   │ Scaling   │  │
│ │ Content    │ 200   │ 8    │ $12   │ Scaling   │  │
│ │ Cold Email │ 30    │ 1    │ $50   │ Testing   │  │
│ └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Verification

```bash
npm run lint && npm run typecheck && npm run build

# Manual testing
- Create milestone with target
- Log weekly progress
- Verify chart updates
- Create channel test
- Compare channel metrics
```
