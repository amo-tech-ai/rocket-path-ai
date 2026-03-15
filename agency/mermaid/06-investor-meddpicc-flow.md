---
id: AGN-06
phase: MVP
type: flowchart
title: Investor MEDDPICC Flow
prd_section: Enhanced Screens > Investor Pipeline
roadmap_task: M-02
---

# AGN-06: Investor MEDDPICC Scoring Flow

How the investor-agent scores deals using MEDDPICC and generates cold emails.

```mermaid
flowchart TD
    START["Founder adds investor<br/>or triggers AI scoring"] --> LOAD["loadFragment<br/>crm-investor-fragment"]

    LOAD --> SCORE["MEDDPICC Scoring<br/>(8 dimensions x 5 = /40)"]

    subgraph MEDDPICC["8 MEDDPICC Dimensions"]
        M["Metrics (0-5)"]
        E["Economic Buyer (0-5)"]
        D1["Decision Criteria (0-5)"]
        D2["Decision Process (0-5)"]
        P1["Paper Process (0-5)"]
        I["Identify Pain (0-5)"]
        C["Champion (0-5)"]
        CO["Competition (0-5)"]
    end

    SCORE --> MEDDPICC
    MEDDPICC --> TOTAL["Total Score /40"]

    TOTAL --> VERDICT{"Score Range?"}

    VERDICT -->|"32-40"| SB["Strong Buy<br/>green pill"]
    VERDICT -->|"24-31"| BU["Buy<br/>blue pill"]
    VERDICT -->|"16-23"| HO["Hold<br/>amber pill"]
    VERDICT -->|"0-15"| PA["Pass<br/>red pill"]

    SB --> SIGNAL["Signal-Based Timing"]
    BU --> SIGNAL
    HO --> SIGNAL
    PA --> SIGNAL

    SIGNAL --> SIG_CHECK{"Active signals<br/>detected?"}
    SIG_CHECK -->|"Yes: funding round,<br/>portfolio fit,<br/>warm intro available"| ACT["Act Now indicator<br/>green dot"]
    SIG_CHECK -->|"No active signals"| WAIT["Monitor indicator<br/>gray dot"]

    ACT --> EMAIL["Cold Email Builder"]
    WAIT --> STORE["Store score + verdict<br/>in investors table"]

    EMAIL --> ANATOMY["Email Anatomy<br/>signal + value + proof + CTA<br/>< 120 words"]
    ANATOMY --> STORE

    style MEDDPICC fill:#fefce8,stroke:#eab308
    style SB fill:#059669,color:#fff
    style BU fill:#3b82f6,color:#fff
    style HO fill:#d97706,color:#fff
    style PA fill:#dc2626,color:#fff
```

## Schema Changes

```sql
ALTER TABLE investors ADD COLUMN meddpicc_score int;
ALTER TABLE investors ADD COLUMN deal_verdict text;
ALTER TABLE investors ADD COLUMN signal_data jsonb;
```

## Email Anatomy (from crm-investor-fragment)

```
Subject: [Signal] — [Value hook] for [Fund name]

[1 sentence: signal that triggered outreach]
[1 sentence: specific value to this investor]
[1 sentence: proof point / traction]
[1 sentence: clear CTA with specific ask]

Total: < 120 words
```
