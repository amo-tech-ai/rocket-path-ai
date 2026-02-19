# AI Workflow - Propose → Approve → Execute

> **Type:** Flowchart + Sequence
> **PRD Section:** 10. Workflows
> **Hard Rule:** AI NEVER writes to database without user approval

---

## Core Workflow

```mermaid
flowchart TD
    subgraph User["User Action"]
        U1[User Input]
        U2[User Reviews]
        U3{Approve?}
    end

    subgraph AI["AI Processing"]
        A1[Analyze Request]
        A2[Generate Suggestion]
        A3[Format for Display]
    end

    subgraph Display["Right Panel - Intelligence"]
        D1[Show Suggestion]
        D2[Show Reasoning]
        D3[Show Alternatives]
    end

    subgraph Execution["System Execution"]
        E1[Validate Input]
        E2[Execute Write]
        E3[Log to Audit]
    end

    subgraph Result["Result"]
        R1[Success + Undo]
        R2[Rejected]
        R3[Error + Retry]
    end

    U1 --> A1 --> A2 --> A3
    A3 --> D1 --> D2 --> D3
    D3 --> U2 --> U3

    U3 -->|Yes| E1
    U3 -->|No| R2
    U3 -->|Edit| A2

    E1 -->|Valid| E2
    E1 -->|Invalid| R3
    E2 --> E3 --> R1

    R3 --> U1

    classDef user fill:#E3F2FD,stroke:#1565C0
    classDef ai fill:#FCE4EC,stroke:#C2185B
    classDef display fill:#FFF3E0,stroke:#EF6C00
    classDef exec fill:#E8F5E9,stroke:#2E7D32
    classDef result fill:#F3E5F5,stroke:#7B1FA2

    class U1,U2,U3 user
    class A1,A2,A3 ai
    class D1,D2,D3 display
    class E1,E2,E3 exec
    class R1,R2,R3 result
```

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant EF as Edge Function
    participant AI as Gemini API
    participant DB as Supabase

    U->>FE: Action (e.g., "Add contact")
    FE->>EF: POST /agent-endpoint
    EF->>AI: generateContent(prompt)
    AI-->>EF: Suggestion JSON

    Note over EF: AI PROPOSES - No DB write yet

    EF-->>FE: {type: "suggestion", data: {...}}
    FE->>U: Show in Right Panel

    alt User Approves
        U->>FE: Click "Approve"
        FE->>EF: POST /execute {approved: true}
        EF->>DB: INSERT/UPDATE
        DB-->>EF: Success
        EF-->>FE: {type: "result", success: true}
        FE->>U: Show Success + Undo
    else User Edits
        U->>FE: Modify suggestion
        FE->>EF: POST /agent-endpoint (modified)
        Note over EF: Re-run AI with edits
    else User Rejects
        U->>FE: Click "Cancel"
        FE->>U: "Action cancelled"
    end
```

---

## 3-Panel Layout Integration

```
┌─────────────────┬─────────────────────────────┬─────────────────┐
│   LEFT PANEL    │        MAIN PANEL           │   RIGHT PANEL   │
│    (Context)    │         (Work)              │  (Intelligence) │
├─────────────────┼─────────────────────────────┼─────────────────┤
│                 │                             │                 │
│ WHERE AM I?     │  User works here            │  AI PROPOSES    │
│                 │                             │                 │
│ • Navigation    │  • Forms                    │  • Suggestions  │
│ • Filters       │  • Tables                   │  • Reasoning    │
│ • Progress      │  • Editors                  │  • Alternatives │
│                 │                             │                 │
│                 │  HUMAN APPROVES             │                 │
│                 │  ↓                          │                 │
│                 │  SYSTEM EXECUTES            │                 │
│                 │                             │                 │
└─────────────────┴─────────────────────────────┴─────────────────┘
```

---

## Approval Rules by Action

| Action | Approval Required | Confirmation Level |
|--------|-------------------|-------------------|
| Read/Query | No | — |
| Create | Yes | Single click |
| Update | Yes | Single click |
| Delete | Yes + Confirm | Double confirm |
| Bulk | Yes + Extra Warning | Explicit list review |

---

## Verification

- [x] Start: User input
- [x] End: Success/Rejected/Error
- [x] AI: Never writes directly (suggestion only)
- [x] Failure: Invalid input → Error + Retry path
- [x] Ownership: User/AI/Display/Execution clearly separated
