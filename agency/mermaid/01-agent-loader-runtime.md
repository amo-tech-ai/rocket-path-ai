---
id: AGN-01
phase: CORE
type: flowchart
title: Agent Loader Runtime
prd_section: Architecture > Agent Loader
roadmap_task: C-01
---

# AGN-01: Agent Loader Runtime

How `agency/lib/agent-loader.ts` loads markdown fragments and chat modes into edge function system prompts at runtime.

```mermaid
flowchart TD
    EF["Edge Function<br/>(e.g. validator-start)"] -->|"calls"| LF["loadFragment(name)"]
    EF -->|"calls"| LM["loadChatMode(name)"]

    LF --> CC{"Module-scope<br/>cache hit?"}
    LM --> CC2{"Module-scope<br/>cache hit?"}

    CC -->|"Yes"| RET1["Return cached string"]
    CC -->|"No"| RF["Read agency/prompts/{name}.md"]

    CC2 -->|"Yes"| RET2["Return cached string"]
    CC2 -->|"No"| RM["Read agency/chat-modes/{name}.md"]

    RF --> FE{"File exists?"}
    RM --> FE2{"File exists?"}

    FE -->|"Yes"| CACHE["Store in cache"]
    FE -->|"No"| WARN["console.warn + return empty string"]

    FE2 -->|"Yes"| CACHE2["Store in cache"]
    FE2 -->|"No"| WARN2["console.warn + return empty string"]

    CACHE --> RET3["Return fragment text"]
    CACHE2 --> RET4["Return mode prompt"]

    RET1 --> INJECT["Append to system prompt"]
    RET3 --> INJECT
    RET2 --> INJECT2["Set as system prompt"]
    RET4 --> INJECT2

    INJECT --> GEMINI["Call Gemini/Claude<br/>with enriched prompt"]
    INJECT2 --> GEMINI

    style EF fill:#1e40af,color:#fff
    style GEMINI fill:#059669,color:#fff
    style WARN fill:#d97706,color:#fff
    style WARN2 fill:#d97706,color:#fff
```

## Key Rules

1. **Cache once per cold start** — Deno Deploy isolates persist across requests
2. **Graceful fallback** — Missing file never crashes the edge function
3. **Fragment append** — Fragments are appended to existing system prompts (additive)
4. **Mode replace** — Chat modes replace the full system prompt (substitutive)
