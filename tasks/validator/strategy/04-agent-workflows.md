# Validator v2 — Agent Workflows

> AI agent orchestration, DAG execution, failure handling, and inter-agent communication.

---

## Agent Dependency Graph

The pipeline is a directed acyclic graph. Research and Competitors run in parallel after Extractor. Scoring waits for Research + Competitors. MVP needs Scoring. Composer assembles everything. Verifier checks the final output.

```mermaid
flowchart LR
    EXT[Extractor] --> RES[Research]
    EXT --> COMP[Competitors]
    RES --> SCORE[Scoring]
    COMP --> SCORE
    SCORE --> MVP[MVP]
    EXT --> COMPOSE[Composer]
    RES --> COMPOSE
    COMP -.->|optional| COMPOSE
    SCORE --> COMPOSE
    MVP -.->|optional| COMPOSE
    COMPOSE --> VERIFY[Verifier]

    style EXT fill:#4ade80,color:#000
    style RES fill:#60a5fa,color:#000
    style COMP fill:#60a5fa,color:#000
    style SCORE fill:#f59e0b,color:#000
    style MVP fill:#f59e0b,color:#000
    style COMPOSE fill:#c084fc,color:#000
    style VERIFY fill:#94a3b8,color:#000
```

**Legend:** Green = extraction, Blue = research, Amber = analysis, Purple = composition, Grey = validation. Dashed lines = optional inputs.

---

## Happy Path Sequence

All 7 agents succeed. Orchestrator dispatches, agents read inputs from DB, write outputs to DB.

```mermaid
sequenceDiagram
    autonumber
    participant F as Frontend
    participant O as Orchestrator
    participant DB as Database
    participant EX as Extractor
    participant RE as Research
    participant CO as Competitors
    participant SC as Scoring
    participant MV as MVP
    participant CM as Composer
    participant VR as Verifier

    F->>O: POST /validator-orchestrate
    O->>DB: Create session + 7 agent runs (queued)
    O-->>F: 200 OK {session_id}
    Note over F: Frontend starts polling

    O->>EX: Trigger Extractor
    EX->>DB: Read founder_input
    EX->>DB: Write StartupProfile (ok)

    par Research and Competitors
        EX-->>RE: Trigger Research
        RE->>DB: Read StartupProfile
        RE->>DB: Write MarketResearch (ok)
    and
        EX-->>CO: Trigger Competitors
        CO->>DB: Read StartupProfile
        CO->>DB: Write CompetitorAnalysis (ok)
    end

    RE-->>SC: Trigger Scoring
    SC->>DB: Read Profile + Market + Competitors
    SC->>DB: Write ScoringResult (ok)

    SC-->>MV: Trigger MVP
    MV->>DB: Read Profile + Scoring
    MV->>DB: Write MVPPlan (ok)

    MV-->>CM: Trigger Composer
    CM->>DB: Read all agent outputs
    CM->>DB: Write ValidatorReport (ok)

    CM-->>VR: Trigger Verifier
    VR->>DB: Read Report + failure list
    VR->>DB: Write VerificationResult (ok)
    VR->>DB: Update session status = success

    F->>DB: Poll status
    DB-->>F: status: success
    F->>F: Navigate to report page
```

---

## Failure and Retry Sequence

MVP times out. Composer runs without MVP data. Founder retries MVP later.

```mermaid
sequenceDiagram
    autonumber
    participant F as Frontend
    participant O as Orchestrator
    participant DB as Database
    participant MV as MVP
    participant CM as Composer
    participant VR as Verifier

    Note over MV: MVP agent times out after 60s
    MV->>DB: Write status = failed, error = timeout

    Note over CM: Composer reads DB, MVP output is null
    CM->>DB: Read all outputs (MVP = null)
    CM->>DB: Write report (mvp_scope = placeholder)

    VR->>DB: Write verified = false, warnings = [MVP missing]
    VR->>DB: Update session = degraded_success

    F->>DB: Poll status
    DB-->>F: status: degraded_success, failed: [MVP]
    F->>F: Show report with "Retry MVP" button

    Note over F: Founder clicks "Retry MVP"
    F->>O: POST /validator-orchestrate {retry: MVP}
    O->>DB: Insert new agent run (attempt: 1)
    O->>MV: Trigger MVP retry

    MV->>DB: Read Profile + Scoring (from previous run)
    MV->>DB: Write MVPPlan (ok)

    Note over CM: Re-compose with new MVP data
    O->>CM: Trigger Composer re-run
    CM->>DB: Read all outputs (MVP now present)
    CM->>DB: Write updated report

    VR->>DB: Update session = success
    F->>DB: Poll
    DB-->>F: status: success
```

---

## Agent State Machine

Each agent follows the same lifecycle. The orchestrator manages transitions.

```mermaid
stateDiagram-v2
    [*] --> queued: Orchestrator creates run

    queued --> running: Agent triggered
    running --> ok: Agent completes
    running --> failed: Timeout or error

    failed --> queued: Retry requested
    note right of failed
        Max 1 retry per agent
        Only on timeout/5xx/rate-limit
        Not on 400 or schema errors
    end note

    ok --> [*]
    failed --> [*]: No retry / max retries reached
```

---

## Session State Machine

The session aggregates agent states into a single founder-facing status.

```mermaid
stateDiagram-v2
    [*] --> queued: Session created

    queued --> running: First agent starts
    running --> success: All agents OK + Verifier passes
    running --> degraded_success: Optional agents failed, core OK
    running --> failed: Core agent failed or pipeline timeout

    degraded_success --> running: Retry triggered
    failed --> running: Retry triggered

    success --> [*]
    degraded_success --> [*]: Founder accepts
    failed --> [*]: Founder abandons
```

**Core agents** (failure = `failed`): Extractor, Research, Scoring, Composer
**Optional agents** (failure = `degraded_success`): Competitors, MVP

---

## Inter-Agent Communication Pattern

Agents never share in-memory state. All communication flows through the database.

```mermaid
flowchart TD
    subgraph Agent["Each Agent Function"]
        READ[Read inputs from DB]
        WORK[Call Gemini API]
        WRITE[Write output to DB]
        NEXT[Trigger next agent]
        READ --> WORK --> WRITE --> NEXT
    end

    subgraph DB["Database (validator_agent_runs)"]
        ROW["session_id + agent_name + attempt<br/>status | output_json | error | duration_ms"]
    end

    WRITE --> ROW
    ROW --> READ

    style DB fill:#fef3c7,color:#000
    style Agent fill:#eff6ff,color:#000
```

---

## Dispatch Pattern Options

How does one agent trigger the next? Three options evaluated.

```mermaid
flowchart TD
    subgraph A["Option A: DB Polling"]
        A1[Agent writes output] --> A2[Orchestrator polls DB every 2s]
        A2 --> A3[Sees dependency met] --> A4[Triggers next agent]
    end

    subgraph B["Option B: Direct Invoke"]
        B1[Agent finishes] --> B2[Agent calls next Edge Function via fetch]
        B2 --> B3[Next agent starts]
    end

    subgraph C["Option C: DB Trigger + Webhook"]
        C1[Agent writes output] --> C2[Postgres trigger fires]
        C2 --> C3[pg_net calls next Edge Function]
        C3 --> C4[Next agent starts]
    end

    style A fill:#fef3c7,color:#000
    style B fill:#dcfce7,color:#000
    style C fill:#fce7f3,color:#000
```

| Option | Latency | Complexity | Reliability |
|--------|---------|------------|-------------|
| A: DB Polling | 2-5s per hop | Low | High |
| B: Direct Invoke | Instant | Medium | Medium (agent must know next) |
| C: DB Trigger | ~1s | High | High (but pg_net limits) |

**Recommendation:** Start with Option B (direct invoke) for simplicity. Each agent knows its successor and calls it via `fetch()` before exiting. Fall back to Option A if direct invoke proves fragile.

---

## Timeout Budget Allocation

Each agent has an independent timeout. No shared pipeline deadline.

```mermaid
gantt
    title Agent Timeout Budgets (Independent)
    dateFormat s
    axisFormat %Ss

    section Critical Path
    Extractor (20s max)     :ext, 0, 20s
    Research (90s max)      :res, 0, 90s
    Scoring (45s max)       :score, 0, 45s
    Composer (120s max)     :comp, 0, 120s
    Verifier (5s max)       :ver, 0, 5s

    section Background
    Competitors (120s max)  :crit, competitors, 0, 120s

    section Optional
    MVP (60s max)           :mvp, 0, 60s
```

**Key difference from v1:** No shared 115s deadline. Each agent manages its own timeout. Deno Deploy's 150s limit applies per-function, not to the whole pipeline.
