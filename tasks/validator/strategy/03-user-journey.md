# Validator v2 — User Journey

> Founder experience from idea input to actionable report.

---

## Founder Validation Journey

```mermaid
journey
    title Founder Validates a Startup Idea
    section Enter Idea
      Open Validator page: 5: Founder
      Type startup description: 4: Founder
      Chat with AI to refine: 5: Founder, AI
      See extraction preview: 4: Founder, AI
    section Generate Report
      Click Generate: 5: Founder
      See progress tracker: 4: Founder
      Watch agents complete: 3: Founder
      Handle partial failure: 2: Founder
    section Review Report
      Read summary verdict: 5: Founder
      Explore 14 sections: 4: Founder
      Check scores matrix: 4: Founder
      Review citations: 3: Founder
    section Take Action
      Retry failed agents: 4: Founder
      Download PDF: 3: Founder
      Share with co-founder: 4: Founder
      Start Lean Canvas: 5: Founder
```

---

## Session Lifecycle (Founder Perspective)

```mermaid
stateDiagram-v2
    [*] --> ChatPhase: Open /validate

    ChatPhase --> Extracting: Click Generate
    note right of ChatPhase
        Founder describes idea
        AI asks follow-ups
        Extraction preview shown
    end note

    Extracting --> AgentsRunning: Profile extracted
    Extracting --> ChatPhase: Extraction failed (retry)

    AgentsRunning --> ReportReady: All agents OK
    AgentsRunning --> PartialReport: Some agents failed
    AgentsRunning --> Failed: Core agents failed

    note right of AgentsRunning
        Progress bar shows per-agent status
        Each agent reports independently
    end note

    PartialReport --> ReportReady: Retry succeeds
    PartialReport --> [*]: Founder accepts partial

    ReportReady --> [*]: Founder reviews report
    Failed --> ChatPhase: Founder retries
    Failed --> [*]: Founder abandons
```

---

## Progress Tracker UX Flow

What the founder sees during pipeline execution:

```mermaid
flowchart TD
    START[Generate clicked] --> EXT[Extractor running...]
    EXT --> EXT_OK{OK?}
    EXT_OK -->|Yes| PAR["Research running...<br/>Competitors running..."]
    EXT_OK -->|No| FAIL_EARLY[Show error + Retry button]

    PAR --> SCORE[Scoring running...]
    SCORE --> MVP[MVP running...]
    MVP --> COMPOSE[Composing report...]
    COMPOSE --> VERIFY[Verifying...]

    VERIFY --> RESULT{All OK?}
    RESULT -->|Yes| SUCCESS["Report ready<br/>(green checkmark)"]
    RESULT -->|Partial| PARTIAL["Report ready with warnings<br/>(amber, retry buttons)"]
    RESULT -->|Failed| FAIL["Generation failed<br/>(red, retry all)"]

    FAIL_EARLY --> RETRY_ALL[Retry from start]
    RETRY_ALL --> EXT

    PARTIAL --> RETRY_ONE[Retry single agent]
    RETRY_ONE --> PAR
```

---

## Retry Experience

When an agent fails, the founder should never lose work from agents that succeeded.

```mermaid
journey
    title Founder Retries a Failed MVP Agent
    section Initial Run
      Report generated: 4: Founder
      MVP section missing: 2: Founder
      See "Retry MVP" button: 3: Founder
    section Retry
      Click Retry MVP: 5: Founder
      MVP agent re-runs alone: 4: System
      MVP completes: 5: System
      Report updates with MVP data: 5: Founder
    section Result
      Full report available: 5: Founder
      Status upgrades to success: 5: System
```

---

## Key UX Principles

1. **Always show something** — even if 3 agents fail, the founder gets partial data
2. **Per-agent retry** — no need to re-run the entire pipeline
3. **Real-time progress** — each agent status updates independently via polling
4. **Clear attribution** — each report section shows which agent produced it
5. **Graceful degradation** — missing optional sections are marked, not hidden
