---
id: AGN-08
phase: ALL
type: flowchart
title: Phase Dependency Graph
prd_section: Implementation Phases
roadmap_task: All
---

# AGN-08: Phase Dependency Graph

All 22 tasks across 5 phases with dependency arrows.

```mermaid
flowchart TD
    subgraph CORE["CORE (3 days)"]
        C01["C-01<br/>Agent Loader<br/>Runtime"]
        C02["C-02<br/>Scoring<br/>Fragment"]
        C03["C-03<br/>Composer<br/>Fragment"]
        C04["C-04<br/>Report UI<br/>Badges"]
    end

    subgraph MVP["MVP (5 days)"]
        M01["M-01<br/>Sprint Board<br/>RICE + Kano"]
        M02["M-02<br/>Investor<br/>MEDDPICC"]
        M03["M-03<br/>Pitch Deck<br/>Challenger"]
        M04["M-04<br/>Lean Canvas<br/>Specificity"]
        M05["M-05<br/>AI Chat<br/>4 Modes"]
    end

    subgraph POSTMVP["POST-MVP (3 days)"]
        P01["P-01<br/>Chat Session<br/>Persistence"]
        P02["P-02<br/>Practice Pitch<br/>Panel"]
        P03["P-03<br/>Growth Strategy<br/>Panel"]
        P04["P-04<br/>Behavioral<br/>Nudge System"]
        P05["P-05<br/>Export<br/>Overlays"]
    end

    subgraph ADV["ADVANCED (2 days)"]
        A01["A-01<br/>Quality<br/>Tracking"]
        A02["A-02<br/>Fragment<br/>Caching"]
        A03["A-03<br/>Remaining<br/>Panels"]
        A04["A-04<br/>MEDDPICC<br/>Detail Sheet"]
    end

    subgraph PROD["PRODUCTION (2 days)"]
        PR01["PROD-01<br/>Backward<br/>Compat"]
        PR02["PROD-02<br/>Test Suite<br/>38+ tests"]
        PR03["PROD-03<br/>Staged<br/>Deploy"]
        PR04["PROD-04<br/>Monitoring"]
    end

    %% CORE dependencies
    C01 --> C02
    C01 --> C03
    C03 --> C04

    %% MVP all depend on C-01
    C01 --> M01
    C01 --> M02
    C01 --> M03
    C01 --> M04
    C01 --> M05

    %% POST-MVP dependencies
    M05 --> P01
    M05 --> P02
    M05 --> P03
    C04 --> P05
    M01 --> P04
    M04 --> P04

    %% ADVANCED dependencies
    M02 --> A04
    M05 --> A03
    C01 --> A02

    %% PRODUCTION dependencies
    M01 --> PR01
    M02 --> PR01
    M03 --> PR01
    M04 --> PR01
    M05 --> PR01
    PR01 --> PR03
    PR02 --> PR03
    PR03 --> PR04

    style CORE fill:#dbeafe,stroke:#3b82f6
    style MVP fill:#dcfce7,stroke:#22c55e
    style POSTMVP fill:#fef3c7,stroke:#f59e0b
    style ADV fill:#f3e8ff,stroke:#a855f7
    style PROD fill:#fee2e2,stroke:#ef4444
```

## Critical Path

```
C-01 → C-02 → C-03 → C-04 → P-05
C-01 → M-05 → P-01/P-02/P-03 → A-03
All MVP → PROD-01 → PROD-03 → PROD-04
```

## Parallelism Opportunities

After C-01 completes, all 5 MVP tasks (M-01 through M-05) can run in parallel.
