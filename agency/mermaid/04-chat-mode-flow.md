---
id: AGN-04
phase: MVP
type: sequence
title: AI Chat Mode Selection Flow
prd_section: New Chat Modes (4)
roadmap_task: M-05
---

# AGN-04: AI Chat Mode Selection Flow

How a founder selects a chat mode and gets a specialized AI personality.

```mermaid
sequenceDiagram
    participant U as Founder
    participant FE as AI Chat Page
    participant MS as Mode Selector
    participant AIC as ai-chat EF
    participant AL as Agent Loader
    participant AI as Gemini/Claude

    U->>FE: Open /ai-chat
    FE->>MS: Show mode selector cards

    Note over MS: 5 options shown
    Note over MS: General (default)
    Note over MS: Practice Pitch
    Note over MS: Growth Strategy
    Note over MS: Deal Review
    Note over MS: Canvas Coach

    U->>MS: Select "Practice Pitch"
    MS->>FE: Set mode = "practice-pitch"
    FE->>FE: Show mode pill in header
    FE->>FE: Show mode-specific quick actions

    U->>FE: Type message
    FE->>AIC: POST /ai-chat {mode: "practice-pitch", message}

    AIC->>AL: loadChatMode("practice-pitch")
    AL-->>AIC: Full mode system prompt

    Note over AIC: System prompt =<br/>base context + mode prompt

    AIC->>AI: Chat with specialized prompt
    AI-->>AIC: Response as VC investor persona

    AIC-->>FE: Streamed response
    FE-->>U: AI responds in character

    Note over FE: Practice Pitch specific
    Note over FE: Scores pitch /50
    Note over FE: Coaches weakest dimension
    Note over FE: Asks for re-delivery
```

## Mode Behaviors

| Mode | AI Persona | Scoring | Quick Actions |
|------|-----------|---------|---------------|
| General | Helpful assistant | None | General startup questions |
| Practice Pitch | Skeptical VC investor | /50 (5 dims × 10) | "Score my pitch", "Common objections" |
| Growth Strategy | Growth advisor | AARRR diagnosis | "Diagnose my funnel", "Design experiment" |
| Deal Review | Deal strategist | MEDDPICC /40 | "Score this deal", "Red flags" |
| Canvas Coach | Business model coach | Specificity 0-100% | "Find weakest box", "Sharpen segment" |

## Default Behavior

- No `mode` param → general mode (existing behavior, zero changes)
- Mode prompt loaded only when explicitly selected
- Mode can be changed mid-conversation (clears history)
