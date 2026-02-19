# System Architecture

> **Type:** Flowchart + C4
> **PRD Section:** 16. AI Architecture
> **Rule:** Frontend → Edge Functions → AI Models → Database

---

## End-to-End Flow

```mermaid
flowchart TD
    subgraph User["User Layer"]
        U1[Browser]
    end

    subgraph Frontend["Frontend - React/Vite"]
        F1[Pages/Components]
        F2[Hooks]
        F3[Providers]
    end

    subgraph Edge["Edge Functions - Deno"]
        E1[onboarding-agent]
        E2[lean-canvas-agent]
        E3[crm-agent]
        E4[investor-agent]
        E5[pitch-deck-agent]
        E6[ai-chat]
        E7[Other Agents...]
    end

    subgraph AI["AI Models"]
        A1[Gemini Flash]
        A2[Gemini Pro]
        A3[Gemini Image]
        A4[Claude - Phase 3+]
    end

    subgraph Data["Supabase"]
        D1[(PostgreSQL)]
        D2[RLS Policies]
        D3[Realtime Channels]
    end

    subgraph External["External Services"]
        X1[Cloudinary]
        X2[Stripe]
    end

    U1 --> F1
    F1 --> F2
    F2 --> F3
    F3 -->|POST| E1 & E2 & E3 & E4 & E5 & E6 & E7

    E1 & E2 & E3 & E4 --> A1 & A2
    E5 --> A3
    E6 --> A1

    E1 & E2 & E3 & E4 & E5 & E6 & E7 --> D1
    D1 --> D2
    D2 --> D3
    D3 -->|Realtime| F3

    E5 --> X1
    E7 --> X2

    classDef user fill:#E3F2FD,stroke:#1565C0
    classDef frontend fill:#E8F5E9,stroke:#2E7D32
    classDef edge fill:#FFF3E0,stroke:#EF6C00
    classDef ai fill:#FCE4EC,stroke:#C2185B
    classDef data fill:#E0F2F1,stroke:#00695C
    classDef external fill:#F3E5F5,stroke:#7B1FA2

    class U1 user
    class F1,F2,F3 frontend
    class E1,E2,E3,E4,E5,E6,E7 edge
    class A1,A2,A3,A4 ai
    class D1,D2,D3 data
    class X1,X2 external
```

---

## Component Ownership

| Layer | Owner | Responsibility |
|-------|-------|----------------|
| User | End User | Input, approval, feedback |
| Frontend | React/TS | UI, state, hooks |
| Edge | Deno/Supabase | Business logic, AI calls |
| AI | Gemini/Claude | Analysis, generation, scoring |
| Data | PostgreSQL | Storage, RLS, realtime |
| External | Third-party | Images, payments |

---

## Edge Functions (14 Deployed)

| Function | Status | Purpose |
|----------|--------|---------|
| onboarding-agent | ✅ | Wizard enrichment |
| lean-canvas-agent | ✅ | Canvas prefill, validate |
| crm-agent | ✅ | Contact enrichment |
| investor-agent | ✅ | Investor search |
| pitch-deck-agent | ✅ | Deck generation |
| documents-agent | ✅ | Document generation |
| event-agent | ✅ | Event planning |
| ai-chat | ✅ | Chat assistant |
| generate-image | ✅ | Image generation |
| auth-check | ✅ | Auth verification |
| health | ✅ | Health check |
| stripe-webhook | ✅ | Payments |
| task-agent | ❌ | Missing |
| dashboard-metrics | ❌ | Missing |

---

## Verification

- [x] Start: User browser
- [x] End: Realtime updates to frontend
- [x] Ownership: Each layer clearly labeled
- [x] AI: Calls through Edge Functions only
- [x] Data: RLS enforced on all queries
