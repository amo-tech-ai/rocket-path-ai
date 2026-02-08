# Validator v2 — Edge Function Architecture

> System architecture, container design, database schema, and implementation roadmap.

---

## System Context (C4 Level 1)

Who interacts with the Validator system and what external services does it depend on.

```mermaid
C4Context
    title Validator System Context

    Person(founder, "Startup Founder", "Validates startup ideas and gets actionable reports")

    System(validator, "Validator System", "AI-powered startup validation pipeline with 7 specialized agents")

    System_Ext(gemini, "Gemini API", "Google AI for extraction, research, scoring, composition")
    System_Ext(google, "Google Search", "Web search grounding for market research and competitors")
    System_Ext(supabase_auth, "Supabase Auth", "OAuth (Google, LinkedIn) and JWT tokens")

    Rel(founder, validator, "Submits idea, reviews report", "HTTPS")
    Rel(validator, gemini, "AI inference calls", "HTTPS REST")
    Rel(validator, google, "Search grounding via Gemini tools", "Internal")
    Rel(validator, supabase_auth, "Authenticates users", "JWT")
```

---

## Container Diagram (C4 Level 2)

The Validator system broken into deployable containers.

```mermaid
C4Container
    title Validator System Containers

    Person(founder, "Founder", "Uses browser")

    Container_Boundary(frontend, "Frontend") {
        Container(spa, "React SPA", "Vite + React 18 + TypeScript", "Chat UI, progress tracker, report viewer")
    }

    Container_Boundary(backend, "Backend (Supabase)") {
        Container(orchestrator, "validator-orchestrate", "Deno Edge Function", "Creates session, dispatches agents, returns immediately")
        Container(extractor, "validator-agent-extract", "Deno Edge Function", "Extracts StartupProfile from founder input")
        Container(research, "validator-agent-research", "Deno Edge Function", "Market research with Google Search + URL Context")
        Container(competitors, "validator-agent-competitors", "Deno Edge Function", "Competitor analysis with Google Search")
        Container(scoring, "validator-agent-score", "Deno Edge Function", "Multi-dimension scoring with thinking mode")
        Container(mvp, "validator-agent-mvp", "Deno Edge Function", "MVP roadmap and sprint plan")
        Container(composer, "validator-agent-compose", "Deno Edge Function", "Assembles 14-section report from all agent outputs")
        Container(verifier, "validator-agent-verify", "Deno Edge Function", "Validates report completeness")
        Container(status, "validator-status", "Deno Edge Function", "Polling endpoint for frontend")
        ContainerDb(db, "PostgreSQL", "Supabase Postgres", "Sessions, agent runs, reports, profiles")
    }

    Container_Ext(gemini, "Gemini API", "Google AI")

    Rel(founder, spa, "Uses", "HTTPS")
    Rel(spa, orchestrator, "Start validation", "POST")
    Rel(spa, status, "Poll progress", "GET")
    Rel(orchestrator, extractor, "Triggers", "fetch")
    Rel(extractor, research, "Triggers", "fetch")
    Rel(extractor, competitors, "Triggers", "fetch")
    Rel(research, scoring, "Triggers", "fetch")
    Rel(scoring, mvp, "Triggers", "fetch")
    Rel(scoring, composer, "Triggers", "fetch")
    Rel(composer, verifier, "Triggers", "fetch")
    Rel(extractor, gemini, "AI call", "HTTPS")
    Rel(research, gemini, "AI call", "HTTPS")
    Rel(competitors, gemini, "AI call", "HTTPS")
    Rel(scoring, gemini, "AI call", "HTTPS")
    Rel(mvp, gemini, "AI call", "HTTPS")
    Rel(composer, gemini, "AI call", "HTTPS")
    Rel(orchestrator, db, "R/W", "SQL")
    Rel(extractor, db, "R/W", "SQL")
    Rel(research, db, "R/W", "SQL")
    Rel(competitors, db, "R/W", "SQL")
    Rel(scoring, db, "R/W", "SQL")
    Rel(mvp, db, "R/W", "SQL")
    Rel(composer, db, "R/W", "SQL")
    Rel(verifier, db, "R/W", "SQL")
    Rel(status, db, "Read", "SQL")
```

---

## Database Schema

Two tables replace the current monolith approach.

```mermaid
erDiagram
    validator_sessions ||--o{ validator_agent_runs : "has many"
    validator_sessions ||--o| validation_reports : "produces"

    validator_sessions {
        uuid id PK
        uuid startup_id FK
        text founder_input
        text status "queued | running | success | degraded_success | failed"
        timestamp created_at
        timestamp updated_at
    }

    validator_agent_runs {
        uuid id PK
        uuid session_id FK
        text agent_name "ExtractorAgent | ResearchAgent | etc"
        int attempt "0, 1 (max 1 retry)"
        text status "queued | running | ok | failed"
        jsonb output_json "Agent-specific output"
        text error "Error message if failed"
        int duration_ms
        timestamp started_at
        timestamp ended_at
    }

    validation_reports {
        uuid id PK
        uuid session_id FK
        uuid startup_id FK
        text report_type "overall"
        int score
        text summary
        jsonb details "Full 14-section report"
        jsonb key_findings
        boolean verified
        jsonb verification_json
        timestamp created_at
    }
```

**Key improvement:** `validator_agent_runs` tracks each agent independently with attempt numbers. Unique constraint on `(session_id, agent_name, attempt)` prevents duplicates and enables clean retries.

---

## Shared Module Structure

All agents share common utilities to avoid duplication.

```mermaid
flowchart TD
    subgraph Shared["_shared/"]
        GEM[gemini.ts<br/>Gemini API client + JSON extraction]
        DB[db.ts<br/>Agent run CRUD helpers]
        TYPES[types.ts<br/>Shared TypeScript types]
        SCHEMAS[schemas.ts<br/>JSON schemas for each agent]
        CORS[cors.ts<br/>CORS headers]
        subgraph Prompts["prompts/"]
            P1[extract.ts]
            P2[research.ts]
            P3[competitors.ts]
            P4[score.ts]
            P5[mvp.ts]
            P6[compose.ts]
        end
    end

    subgraph Functions["Edge Functions"]
        F0[validator-orchestrate]
        F1[validator-agent-extract]
        F2[validator-agent-research]
        F3[validator-agent-competitors]
        F4[validator-agent-score]
        F5[validator-agent-mvp]
        F6[validator-agent-compose]
        F7[validator-agent-verify]
        F8[validator-status]
    end

    F0 --> DB
    F0 --> TYPES
    F1 --> GEM
    F1 --> DB
    F1 --> SCHEMAS
    F1 --> P1
    F2 --> GEM
    F2 --> DB
    F2 --> SCHEMAS
    F2 --> P2
    F3 --> GEM
    F3 --> DB
    F3 --> P3
    F4 --> GEM
    F4 --> DB
    F4 --> SCHEMAS
    F4 --> P4
    F5 --> GEM
    F5 --> DB
    F5 --> P5
    F6 --> GEM
    F6 --> DB
    F6 --> SCHEMAS
    F6 --> P6
    F7 --> DB
    F7 --> TYPES
    F8 --> DB
    F8 --> CORS

    style Shared fill:#fef3c7,color:#000
    style Prompts fill:#fde68a,color:#000
    style Functions fill:#dbeafe,color:#000
```

---

## Request Flow (Orchestrator Detail)

What happens inside the orchestrator when a validation is triggered.

```mermaid
flowchart TD
    REQ[POST /validator-orchestrate] --> AUTH{JWT valid?}
    AUTH -->|No| REJECT[401 Unauthorized]
    AUTH -->|Yes| PARSE[Parse founder_input]

    PARSE --> SESSION[Insert validator_session<br/>status: queued]
    SESSION --> RUNS["Insert 7 agent_runs<br/>all status: queued"]
    RUNS --> RESPOND[Return 200 {session_id}]

    RESPOND --> TRIGGER[Fire-and-forget:<br/>fetch validator-agent-extract]

    TRIGGER --> DONE[Orchestrator exits]

    style REQ fill:#60a5fa,color:#000
    style RESPOND fill:#4ade80,color:#000
    style TRIGGER fill:#f59e0b,color:#000
    style DONE fill:#94a3b8,color:#000
```

**Critical rule:** Orchestrator returns immediately. It does NOT wait for any agent. This keeps response time under 2 seconds.

---

## Agent Chain Dispatch

How agents chain to each other. Each agent triggers its successor(s) before exiting.

```mermaid
sequenceDiagram
    autonumber
    participant EX as Extractor
    participant DB as Database
    participant RE as Research
    participant CO as Competitors

    EX->>DB: Write StartupProfile (ok)

    par Dispatch successors
        EX->>RE: fetch(/validator-agent-research, {session_id})
        Note right of RE: Fire and forget
    and
        EX->>CO: fetch(/validator-agent-competitors, {session_id})
        Note right of CO: Fire and forget
    end

    EX->>EX: Exit (function completes)

    Note over RE,CO: Research and Competitors now run in parallel as separate isolates
```

**Each agent is responsible for:**
1. Reading its inputs from DB
2. Calling Gemini
3. Writing its output to DB
4. Triggering the next agent(s)
5. Exiting

---

## Failure Isolation

When one agent fails, the damage is contained.

```mermaid
flowchart TD
    subgraph OK["Agents that succeeded"]
        EXT_OK["Extractor: ok"]
        RES_OK["Research: ok"]
        SCORE_OK["Scoring: ok"]
    end

    subgraph FAILED["Agents that failed"]
        COMP_FAIL["Competitors: failed (timeout)"]
        MVP_FAIL["MVP: failed (rate limit)"]
    end

    subgraph RESULT["Outcome"]
        COMPOSE["Composer runs with:<br/>Profile, Market, Scoring<br/><br/>Missing: Competitors, MVP"]
        STATUS["Session: degraded_success"]
        REPORT["Report: 12/14 sections<br/>Competition + MVP sections = placeholder"]
    end

    OK --> COMPOSE
    FAILED -.->|null inputs| COMPOSE
    COMPOSE --> STATUS
    COMPOSE --> REPORT

    style OK fill:#dcfce7,color:#000
    style FAILED fill:#fee2e2,color:#000
    style RESULT fill:#fef3c7,color:#000
```

---

## Migration Strategy: v1 to v2

How to move from the current monolith pipeline to per-agent functions without downtime.

```mermaid
flowchart LR
    subgraph Phase1["Phase 1: Database"]
        P1A[Create validator_agent_runs table]
        P1B[Add unique constraint]
        P1C[Add RLS policies]
        P1A --> P1B --> P1C
    end

    subgraph Phase2["Phase 2: Shared Modules"]
        P2A[Extract prompts to _shared/prompts/]
        P2B[Create db.ts agent helpers]
        P2C[Update schemas.ts]
        P2A --> P2B --> P2C
    end

    subgraph Phase3["Phase 3: Agent Functions"]
        P3A[Create validator-agent-extract]
        P3B[Create validator-agent-research]
        P3C[Create validator-agent-competitors]
        P3D[Create validator-agent-score]
        P3E[Create validator-agent-mvp]
        P3F[Create validator-agent-compose]
        P3G[Create validator-agent-verify]
    end

    subgraph Phase4["Phase 4: Orchestrator"]
        P4A[Create validator-orchestrate]
        P4B[Wire dispatch chain]
        P4C[Update validator-status for new schema]
    end

    subgraph Phase5["Phase 5: Frontend"]
        P5A[Update progress tracker for per-agent status]
        P5B[Add retry buttons per agent]
        P5C[Update report page for degraded_success]
    end

    subgraph Phase6["Phase 6: Cutover"]
        P6A[Deploy all new functions]
        P6B[Switch frontend to validator-orchestrate]
        P6C[Deprecate validator-start]
    end

    Phase1 --> Phase2 --> Phase3 --> Phase4 --> Phase5 --> Phase6

    style Phase1 fill:#fef3c7,color:#000
    style Phase2 fill:#fde68a,color:#000
    style Phase3 fill:#dbeafe,color:#000
    style Phase4 fill:#c7d2fe,color:#000
    style Phase5 fill:#dcfce7,color:#000
    style Phase6 fill:#fce7f3,color:#000
```

---

## Implementation Timeline

```mermaid
gantt
    title Validator v2 Implementation
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase 1 — Database
    Create validator_agent_runs table  :p1a, 2026-02-10, 1d
    Add constraints + RLS              :p1b, after p1a, 1d

    section Phase 2 — Shared Modules
    Extract prompts to shared          :p2a, after p1b, 1d
    Create db.ts agent helpers         :p2b, after p2a, 1d
    Update schemas                     :p2c, after p2b, 1d

    section Phase 3 — Agent Functions
    Extractor function                 :p3a, after p2c, 1d
    Research function                  :p3b, after p3a, 1d
    Competitors function               :p3c, after p3a, 1d
    Scoring function                   :p3d, after p3b, 1d
    MVP function                       :p3e, after p3d, 1d
    Composer function                  :p3f, after p3e, 2d
    Verifier function                  :p3g, after p3f, 1d

    section Phase 4 — Orchestrator
    Build orchestrator                 :p4a, after p3g, 2d
    Wire dispatch chain                :p4b, after p4a, 1d
    Update status endpoint             :p4c, after p4b, 1d

    section Phase 5 — Frontend
    Per-agent progress tracker         :p5a, after p4c, 2d
    Retry buttons                      :p5b, after p5a, 1d
    Degraded success UX                :p5c, after p5b, 1d

    section Phase 6 — Cutover
    Deploy and test                    :p6a, after p5c, 2d
    Switch traffic                     :p6b, after p6a, 1d
    Deprecate validator-start          :p6c, after p6b, 1d

    section Milestones
    v1 stable (current)                :milestone, 2026-02-08, 0d
    v2 agents ready                    :milestone, after p3g, 0d
    v2 live                            :milestone, after p6c, 0d
```

---

## Risk Matrix

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Inter-agent dispatch fails silently | High | Medium | Agent writes "triggered_next" to DB; status endpoint detects stuck agents |
| Deno Deploy cold starts add latency | Medium | High | Accept 2-3s cold start per agent; pre-warm with health checks |
| Retry creates duplicate agent runs | High | Low | Unique constraint on (session_id, agent_name, attempt) |
| Migration breaks existing sessions | High | Low | Keep v1 running until v2 is stable; no shared DB tables |
| 8 function deployments are slow | Low | Medium | CI/CD deploys in parallel; shared modules reduce per-function code |

---

## Decision Log

| Decision | Chosen | Rejected | Rationale |
|----------|--------|----------|-----------|
| Agent communication | DB relay | Shared memory, message queue | Supabase DB is already available, no new infra |
| Dispatch pattern | Direct invoke (fetch) | DB polling, Postgres triggers | Lowest latency, simplest to implement |
| Retry strategy | Max 1 retry, timeout/5xx only | Unlimited retries, retry all errors | Prevents cost explosion, schema errors need prompt fixes not retries |
| Composer input handling | Accept null optional inputs | Fail if any input missing | Enables degraded_success, founder always gets partial value |
| Session status model | 5 states (queued, running, success, degraded_success, failed) | 3 states (pending, complete, failed) | degraded_success is critical for founder UX |
