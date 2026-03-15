---
id: AGN-02
phase: CORE
type: flowchart
title: Fragment Wiring Map
prd_section: Architecture > Wiring Map
roadmap_task: C-02, C-03, M-01, M-02, M-03
---

# AGN-02: Fragment & Mode Wiring Map

Which agency files feed which edge functions and screens.

```mermaid
flowchart LR
    subgraph FRAGMENTS["Prompt Fragments (5)"]
        VS["validator-scoring<br/>-fragment.md"]
        VC["validator-composer<br/>-fragment.md"]
        CI["crm-investor<br/>-fragment.md"]
        SA["sprint-agent<br/>-fragment.md"]
        PD["pitch-deck<br/>-fragment.md"]
    end

    subgraph MODES["Chat Modes (4)"]
        PP["practice-pitch.md"]
        GS["growth-strategy.md"]
        DR["deal-review.md"]
        CC["canvas-coach.md"]
    end

    subgraph EF["Edge Functions"]
        VAL["validator-start"]
        SPR["sprint-agent"]
        INV["investor-agent"]
        PDA["pitch-deck-agent"]
        LCA["lean-canvas-agent"]
        AIC["ai-chat"]
    end

    subgraph SCREENS["Screens"]
        S1["Validator Report"]
        S2["Sprint Board"]
        S3["Investor Pipeline"]
        S4["Pitch Deck Editor"]
        S5["Lean Canvas"]
        S6["AI Chat"]
    end

    VS -->|"scoring agent"| VAL
    VC -->|"composer agent"| VAL
    CI --> INV
    SA --> SPR
    PD --> PDA

    PP --> AIC
    GS --> AIC
    DR --> AIC
    CC --> AIC

    VAL --> S1
    SPR --> S2
    INV --> S3
    PDA --> S4
    LCA --> S5
    AIC --> S6

    style FRAGMENTS fill:#eff6ff,stroke:#3b82f6
    style MODES fill:#f0fdf4,stroke:#22c55e
    style EF fill:#fefce8,stroke:#eab308
    style SCREENS fill:#fdf2f8,stroke:#ec4899
```

## Wiring Summary

| Fragment | Edge Function | Screen | Frameworks |
|----------|--------------|--------|-----------|
| validator-scoring | validator-start (scoring) | Validator Report | Evidence tiers, bias detection, RICE actions |
| validator-composer | validator-start (composer) | Validator Report | Three-act narrative, win themes, ICE channels |
| crm-investor | investor-agent | Investor Pipeline | MEDDPICC /40, signal timing, email anatomy |
| sprint-agent | sprint-agent | Sprint Board | RICE scoring, Kano class, momentum sequence |
| pitch-deck | pitch-deck-agent | Pitch Deck Editor | Challenger narrative, persuasion architecture |
| practice-pitch | ai-chat | AI Chat | Pitch scoring /50, coaching loop |
| growth-strategy | ai-chat | AI Chat | AARRR funnel, ICE experiments |
| deal-review | ai-chat | AI Chat | MEDDPICC per deal, red flags |
| canvas-coach | ai-chat | AI Chat | Specificity scoring, behavioral nudges |
