---
id: AGN-09
phase: ALL
type: gantt
title: Agency Implementation Gantt
prd_section: Implementation Phases
roadmap_task: All
---

# AGN-09: 5-Phase Implementation Gantt

15-day timeline across 5 phases.

```mermaid
gantt
    title Agency-Enhanced Features — 15 Day Plan
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section CORE
    C-01 Agent Loader Runtime       :c01, 2026-03-13, 0.5d
    C-02 Scoring Fragment           :c02, after c01, 1d
    C-03 Composer Fragment          :c03, after c01, 1d
    C-04 Report UI Badges           :c04, after c03, 0.5d
    CORE Milestone                  :milestone, after c04, 0d

    section MVP
    M-01 Sprint RICE+Kano           :m01, after c01, 1d
    M-02 Investor MEDDPICC          :m02, after c01, 1d
    M-03 Pitch Deck Challenger      :m03, after c01, 1d
    M-04 Canvas Specificity         :m04, after c01, 0.5d
    M-05 Chat Mode Selector         :m05, after c01, 1.5d
    MVP Milestone                   :milestone, after m05, 0d

    section POST-MVP
    P-01 Chat Session Persistence   :p01, after m05, 0.5d
    P-02 Practice Pitch Panel       :p02, after m05, 0.5d
    P-03 Growth Strategy Panel      :p03, after m05, 0.5d
    P-04 Behavioral Nudge System    :p04, after m01, 1d
    P-05 Export Overlays            :p05, after c04, 0.5d
    POST-MVP Milestone              :milestone, after p04, 0d

    section ADVANCED
    A-01 Quality Tracking           :a01, after p04, 0.5d
    A-02 Fragment Caching           :a02, after c01, 0.5d
    A-03 Remaining Panels           :a03, after m05, 0.5d
    A-04 MEDDPICC Detail Sheet      :a04, after m02, 0.5d
    ADVANCED Milestone              :milestone, after a01, 0d

    section PRODUCTION
    PROD-01 Backward Compat         :pr01, after a01, 0.5d
    PROD-02 Test Suite 38+          :pr02, after a01, 1d
    PROD-03 Staged Deploy           :pr03, after pr02, 0.25d
    PROD-04 Monitoring              :pr04, after pr03, 0.25d
    PRODUCTION Milestone            :milestone, after pr04, 0d
```

## Phase Milestones

| Phase | Day | Milestone |
|-------|-----|-----------|
| CORE | 3 | Validator reports show evidence tiers + bias flags |
| MVP | 8 | All 6 screens enhanced, 4 chat modes selectable |
| POST-MVP | 11 | Chat sessions persist, nudge banners active |
| ADVANCED | 13 | Quality tracked in ai_runs, caching proven |
| PRODUCTION | 15 | 38+ tests pass, all EFs deployed, monitoring live |

## Solo vs Parallel

- **Solo developer:** ~15 days (sequential)
- **2 developers:** ~10 days (MVP tasks parallelize after C-01)
- **Critical path:** C-01 → M-05 → P-01 → PROD-03 → PROD-04
