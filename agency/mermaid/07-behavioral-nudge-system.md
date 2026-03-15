---
id: AGN-07
phase: POST-MVP
type: flowchart
title: Behavioral Nudge System
prd_section: Enhanced Screens > Lean Canvas, Sprint Board, Dashboard
roadmap_task: P-04
---

# AGN-07: Behavioral Nudge System

Contextual nudge banners triggered by user state across 3 screens.

```mermaid
flowchart TD
    subgraph TRIGGERS["Trigger Conditions"]
        T1["Empty canvas box<br/>(any of 9 boxes blank)"]
        T2["Stale sprint<br/>(no task moved in 7 days)"]
        T3["Low coverage score<br/>(validator < 50%)"]
        T4["No validation run<br/>(startup has 0 reports)"]
        T5["Incomplete profile<br/>(< 80% fields filled)"]
    end

    subgraph EVAL["Nudge Evaluation"]
        CHECK{"Check user state<br/>on page load"}
    end

    T1 --> CHECK
    T2 --> CHECK
    T3 --> CHECK
    T4 --> CHECK
    T5 --> CHECK

    CHECK --> TYPE{"Nudge Type?"}

    TYPE -->|"Action needed"| PROGRESS["Progress Nudge<br/>(green banner)"]
    TYPE -->|"Opportunity"| SUGGEST["Suggestion Nudge<br/>(blue banner)"]
    TYPE -->|"Risk detected"| WARNING["Warning Nudge<br/>(amber banner)"]

    PROGRESS --> RENDER["Render NudgeBanner<br/>with CTA button"]
    SUGGEST --> RENDER
    WARNING --> RENDER

    RENDER --> ACTION{"User action?"}

    ACTION -->|"Click CTA"| NAVIGATE["Navigate to<br/>relevant screen"]
    ACTION -->|"Dismiss"| DISMISS["Hide permanently<br/>for this trigger"]
    ACTION -->|"Snooze"| SNOOZE["Hide for 24 hours<br/>(localStorage)"]
    ACTION -->|"Ignore"| PERSIST["Banner stays<br/>until resolved"]

    subgraph SCREENS["Target Screens"]
        SC1["Dashboard<br/>T3, T4, T5"]
        SC2["Lean Canvas<br/>T1"]
        SC3["Sprint Board<br/>T2"]
    end

    NAVIGATE --> SCREENS

    style PROGRESS fill:#059669,color:#fff
    style SUGGEST fill:#3b82f6,color:#fff
    style WARNING fill:#d97706,color:#fff
    style TRIGGERS fill:#f3f4f6,stroke:#9ca3af
```

## Nudge Rules

| Trigger | Type | Screen | CTA |
|---------|------|--------|-----|
| Empty canvas box | Suggestion | Lean Canvas | "Fill in [box name]" |
| Stale sprint (7d) | Warning | Sprint Board | "Review sprint tasks" |
| Coverage < 50% | Warning | Dashboard | "Continue validation chat" |
| No validation run | Progress | Dashboard | "Validate your idea" |
| Profile < 80% | Progress | Dashboard | "Complete your profile" |

## State Management

- Nudge state stored in `localStorage` (dismissed/snoozed per trigger key)
- No database table needed — pure client-side
- Snooze expires after 24 hours (timestamp comparison)
- Dismiss is permanent per trigger (reset on new session only if trigger changes)
