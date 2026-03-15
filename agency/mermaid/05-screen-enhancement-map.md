---
id: AGN-05
phase: MVP
type: flowchart
title: Screen Enhancement Map
prd_section: Enhanced Screens (6)
roadmap_task: C-04, M-01, M-02, M-03, M-04, M-05
---

# AGN-05: Screen Enhancement Map

How agency frameworks map to UI components across 6 screens.

```mermaid
flowchart TD
    subgraph VALIDATOR["Validator Report"]
        V1["Evidence Tier Badges<br/>Cited > Founder > AI"]
        V2["Bias Flag Banner<br/>amber warning strip"]
        V3["Three-Act Summary<br/>Setup | Tension | Resolution"]
        V4["ICE Channel Chips<br/>scored recommendations"]
        V5["Win Theme Labels<br/>on scored dimensions"]
    end

    subgraph SPRINT["Sprint Board"]
        S1["RICE Score Badge<br/>on each task card"]
        S2["Kano Filter Tabs<br/>Must-have | Perf | Delight"]
        S3["Momentum Order<br/>quick wins first indicator"]
    end

    subgraph INVESTOR["Investor Pipeline"]
        I1["MEDDPICC Score /40<br/>badge on investor card"]
        I2["Deal Verdict Pill<br/>Strong Buy | Buy | Hold | Pass"]
        I3["Signal Timing Indicator<br/>green = act now"]
        I4["Email Builder<br/>signal + value + proof + CTA"]
    end

    subgraph PITCH["Pitch Deck Editor"]
        P1["Win Theme Label<br/>above each slide"]
        P2["Narrative Step<br/>Challenger 5-step"]
        P3["Persuasion Badge<br/>cognitive bias mapped"]
    end

    subgraph CANVAS["Lean Canvas"]
        C1["Specificity Meter<br/>vague | specific | quantified"]
        C2["Evidence Gap Markers<br/>per canvas box"]
    end

    subgraph CHAT["AI Chat"]
        CH1["Mode Selector<br/>4 card picker"]
        CH2["Mode Pill<br/>in chat header"]
        CH3["Quick Action Chips<br/>mode-specific"]
    end

    FRAG1["validator-scoring<br/>fragment"] --> VALIDATOR
    FRAG2["validator-composer<br/>fragment"] --> VALIDATOR
    FRAG3["sprint-agent<br/>fragment"] --> SPRINT
    FRAG4["crm-investor<br/>fragment"] --> INVESTOR
    FRAG5["pitch-deck<br/>fragment"] --> PITCH
    FRAG6["Canvas coach<br/>mode"] --> CANVAS
    FRAG7["4 chat modes"] --> CHAT

    style VALIDATOR fill:#eff6ff,stroke:#3b82f6
    style SPRINT fill:#f0fdf4,stroke:#22c55e
    style INVESTOR fill:#fefce8,stroke:#eab308
    style PITCH fill:#fdf2f8,stroke:#ec4899
    style CANVAS fill:#f5f3ff,stroke:#8b5cf6
    style CHAT fill:#fff7ed,stroke:#f97316
```

## Component Count by Screen

| Screen | New Components | Source Fragment |
|--------|---------------|----------------|
| Validator Report | 5 | scoring + composer |
| Sprint Board | 3 | sprint-agent |
| Investor Pipeline | 4 | crm-investor |
| Pitch Deck Editor | 3 | pitch-deck |
| Lean Canvas | 2 | composer (reused) |
| AI Chat | 3 | 4 chat modes |
| **Total** | **20** | |
