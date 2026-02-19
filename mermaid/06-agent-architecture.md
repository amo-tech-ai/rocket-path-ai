# Agent Architecture - 10 Agent Types

> **Type:** Class + Flowchart
> **PRD Section:** 17. AI Models & Agents
> **Strategy:** Gemini (Phase 1-2) + Claude (Phase 3+)

---

## Agent Hierarchy

```mermaid
classDiagram
    class BaseAgent {
        +String name
        +String model
        +execute(input)
        +formatOutput()
    }

    class Extractor {
        +extractFromURL()
        +parseEntities()
        +structureData()
    }

    class Scorer {
        +calculateHealth()
        +scoreDeal()
        +assessReadiness()
    }

    class Planner {
        +breakdownGoal()
        +createTasks()
        +setMilestones()
    }

    class Analyst {
        +detectRisks()
        +findPatterns()
        +generateInsights()
    }

    class Content {
        +writeDeck()
        +draftEmail()
        +generateDocs()
    }

    class Retriever {
        +searchDocs()
        +fetchPlaybook()
        +queryKnowledge()
    }

    class Optimizer {
        +improveTimeline()
        +balanceBudget()
        +suggestEfficiency()
    }

    class Controller {
        +validateAction()
        +enforceApproval()
        +auditWrite()
    }

    class Orchestrator {
        +routeRequest()
        +coordinateAgents()
        +handleHandoff()
    }

    class OpsAutomation {
        +watchTriggers()
        +sendAlerts()
        +scheduleJobs()
    }

    BaseAgent <|-- Extractor
    BaseAgent <|-- Scorer
    BaseAgent <|-- Planner
    BaseAgent <|-- Analyst
    BaseAgent <|-- Content
    BaseAgent <|-- Retriever
    BaseAgent <|-- Optimizer
    BaseAgent <|-- Controller
    BaseAgent <|-- Orchestrator
    BaseAgent <|-- OpsAutomation
```

---

## Agent Routing Flow

```mermaid
flowchart TD
    subgraph Input["User Request"]
        I1[Natural Language Input]
    end

    subgraph Router["Orchestrator - Phase 3+"]
        R1{Intent Classification}
    end

    subgraph Agents["Agent Selection"]
        A1[Extractor<br/>Data extraction]
        A2[Scorer<br/>Scoring/Rating]
        A3[Planner<br/>Task creation]
        A4[Analyst<br/>Risk/Insights]
        A5[Content<br/>Writing]
        A6[Retriever<br/>Search]
    end

    subgraph Control["Controller Gate"]
        C1{Action Type?}
        C2[Read - Allow]
        C3[Write - Require Approval]
    end

    subgraph Output["Response"]
        O1[Suggestion Card]
        O2[Direct Response]
    end

    I1 --> R1
    R1 -->|Extract| A1
    R1 -->|Score| A2
    R1 -->|Plan| A3
    R1 -->|Analyze| A4
    R1 -->|Write| A5
    R1 -->|Search| A6

    A1 & A2 & A3 & A4 & A5 & A6 --> C1
    C1 -->|Read| C2 --> O2
    C1 -->|Write| C3 --> O1

    classDef input fill:#E3F2FD,stroke:#1565C0
    classDef router fill:#FCE4EC,stroke:#C2185B
    classDef agent fill:#E8F5E9,stroke:#2E7D32
    classDef control fill:#FFF3E0,stroke:#EF6C00
    classDef output fill:#F3E5F5,stroke:#7B1FA2

    class I1 input
    class R1 router
    class A1,A2,A3,A4,A5,A6 agent
    class C1,C2,C3 control
    class O1,O2 output
```

---

## Model Assignment

| Agent | Primary Model | Phase |
|-------|--------------|-------|
| Extractor | gemini-3-flash-preview | 1+ |
| Scorer | gemini-3-flash-preview | 1+ |
| Planner | gemini-3-pro-preview | 2+ |
| Analyst | gemini-3-pro-preview | 2+ |
| Content | gemini-3-flash-preview | 1+ |
| Retriever | gemini-3-flash-preview | 1+ |
| Optimizer | gemini-3-pro-preview | 2+ |
| Controller | gemini-3-pro-preview | 2+ |
| Orchestrator | claude-sonnet-4-5 | 3+ |
| OpsAutomation | claude-haiku-4-5 | 3+ |

---

## Edge Function → Agent Mapping

| Edge Function | Agents Used |
|---------------|-------------|
| onboarding-agent | Extractor, Scorer, Planner |
| lean-canvas-agent | Analyst, Content, Scorer |
| crm-agent | Extractor, Scorer |
| investor-agent | Retriever, Scorer, Analyst |
| pitch-deck-agent | Content, Retriever |
| ai-chat | Orchestrator, multiple |
| task-agent (missing) | Planner, Scorer |

---

## Controller Gate Rules

```mermaid
stateDiagram-v2
    [*] --> Received

    Received --> Classified: Analyze intent

    state Classified {
        [*] --> Read
        [*] --> Create
        [*] --> Update
        [*] --> Delete
    }

    Read --> Allowed: No approval needed
    Create --> PendingApproval: Show suggestion
    Update --> PendingApproval: Show suggestion
    Delete --> DoubleConfirm: Show warning

    PendingApproval --> Approved: User clicks Yes
    PendingApproval --> Rejected: User clicks No
    DoubleConfirm --> Approved: User confirms twice
    DoubleConfirm --> Rejected: User cancels

    Approved --> Executed: Write to DB
    Executed --> Logged: Audit trail
    Logged --> [*]
    Rejected --> [*]
    Allowed --> [*]
```

---

## Verification

- [x] 10 agent types documented
- [x] Routing flow shows decision points
- [x] Controller enforces approval gate
- [x] Model assignment by phase
- [x] Edge function mapping complete
