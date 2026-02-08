# Validator Prompts — Diagrams

> **Updated:** 2026-02-06 | **Source:** `tasks/validator/prompts/00-index.md` v2.0

## Diagrams

### Status & Planning (01-04)

| # | Diagram | Type | File |
|---|---------|------|------|
| 01 | Implementation Timeline | Gantt | `01-implementation-timeline.svg` |
| 02 | Phase Dependencies | Flowchart | `02-phase-dependencies.svg` |
| 03 | Task Distribution | Pie Chart | `03-task-distribution.svg` |
| 04 | Kanban Board | Kanban | `04-kanban-board.svg` |

### Feature Workflows (05-10)

| # | Diagram | Type | Prompts | File |
|---|---------|------|---------|------|
| 05 | Full Pipeline Sequence | Sequence | 01, 02 | `05-full-pipeline-sequence.svg` |
| 06 | Agent Data Flow | Flowchart | 01, 02 | `06-agent-data-flow.svg` |
| 07 | Export & Sharing Workflows | Flowchart | 03 | `07-export-sharing-workflows.svg` |
| 08 | Knowledge & RAG Pipeline | Flowchart | 04 | `08-knowledge-rag-pipeline.svg` |
| 09 | Agent Intelligence | Flowchart | 05 | `09-agent-intelligence.svg` |
| 10 | URL Context Real-World Example | Sequence | 01 | `10-url-context-real-world.svg` |

### Real-World Examples (11-12)

| # | Diagram | Type | Industry | File |
|---|---------|------|----------|------|
| 11 | Fashion AI Strategy Overview | Flowchart | Fashion/Retail | `11-fashion-strategy-overview.svg` |
| 12 | Fashion Pipeline Sequence | Sequence | Fashion/Retail | `12-fashion-pipeline-sequence.svg` |

**Documentation:** `11-fashion-retail-real-world-example.md` — Full walkthrough of StyleSync AI (markdown optimization for mid-market fashion brands) through the 7-agent pipeline with data from McKinsey, BCG, K3 research.

---

## 01 — Implementation Timeline (Gantt)

```mermaid
gantt
    title Validator Prompts — Implementation Timeline
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase 0 (DONE)
        Pipeline Fixes (archived)        :done, p0a, 2026-01-20, 14d
        Curated Links (archived)         :done, p0b, 2026-02-01, 5d
        Smart Follow-Up (archived)       :done, p0c, 2026-02-03, 3d
        Modular Refactor (archived)      :done, p0d, 2026-01-28, 5d

    section Phase 1 — Report (P0)
        01 Gemini Tools Upgrade          :crit, p1a, 2026-02-07, 5d
        02 Report Sections (8 missing)   :crit, p1b, after p1a, 9d

    section Phase 2 — Export (P0)
        03 Export & Sharing              :crit, p2a, after p1b, 7d

    section Phase 3 — Knowledge (P1)
        04 Knowledge Integration         :active, p3a, after p2a, 7d

    section Phase 4 — Intelligence (P1)
        05 Agent Intelligence            :p4a, after p3a, 7d
        06 UX Enhancements               :p4b, after p3a, 7d

    section Phase 5 — Reliability (P1)
        07 Reliability & Security        :p5a, after p4a, 7d

    section Deferred
        08 Plan Mode                     :p6a, after p5a, 14d
        09 Plan Mode System Prompt       :p6b, after p6a, 3d
        10 Lean Canvas from Validation   :p6c, after p6b, 7d
        11 Scenario Planning             :p6d, after p6c, 7d
        12 Trend Intelligence Engine     :p6e, after p6d, 21d
```

---

## 02 — Phase Dependencies (Flowchart)

```mermaid
flowchart TD
    subgraph DONE["Phase 0 — ARCHIVED"]
        style DONE fill:#d4edda,stroke:#28a745
        A11["11 Pipeline Fixes 87%"] --> A13["13 Curated Links 100%"]
        A11 --> A14["14 Smart Follow-Up 83%"]
        A11 --> A12["12 Modular Refactor 100%"]
    end

    subgraph P1["Phase 1 — Report Completeness"]
        style P1 fill:#fff3cd,stroke:#ffc107
        P01["01 Gemini Tools 0%"]
        P02["02 Report Sections 25%"]
        P01 --> P02
    end

    subgraph P2["Phase 2 — Export & Sharing"]
        style P2 fill:#fff3cd,stroke:#ffc107
        P03["03 Export & Sharing 3%"]
    end

    subgraph P3["Phase 3 — Knowledge"]
        style P3 fill:#fff3cd,stroke:#ffc107
        P04["04 Knowledge Integration 49%"]
    end

    subgraph P4["Phase 4 — Intelligence + UX"]
        style P4 fill:#fff3cd,stroke:#ffc107
        P05["05 Agent Intelligence 30%"]
        P06["06 UX Enhancements 0%"]
    end

    subgraph P5["Phase 5 — Reliability"]
        style P5 fill:#f8d7da,stroke:#dc3545
        P07["07 Reliability & Security 18%"]
    end

    subgraph DEF["Deferred — P1-P3"]
        style DEF fill:#e2e3e5,stroke:#6c757d
        P08["08 Plan Mode 20%"]
        P09["09 Plan Mode Prompt"]
        P10["10 Lean Canvas 0%"]
        P11["11 Scenario Planning 0%"]
        P12["12 Trend Intelligence 0%"]
        P08 --> P09
    end

    A13 --> P01
    DONE --> P1
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P5 --> DEF
```

---

## 03 — Task Distribution (Pie)

```mermaid
pie title Validator Prompts — Task Status (82 active)
    "Done (7)" : 7
    "In Progress (10)" : 10
    "Not Started (65)" : 65
```

---

## 04 — Kanban Board

```mermaid
kanban
    column1["Archived"]
        a1["11 Pipeline Fixes @{ priority: 'Very High' }"]
        a2["12 Modular Refactor @{ priority: 'Very High' }"]
        a3["13 Curated Links @{ priority: 'Very High' }"]
        a4["14 Smart Follow-Up @{ priority: 'Very High' }"]
    column2["In Progress"]
        b1["02 Report Sections 25% @{ priority: 'Very High' }"]
        b2["04 Knowledge 49% @{ priority: 'High' }"]
        b3["05 Agent Intel 30% @{ priority: 'High' }"]
        b4["08 Plan Mode 20% @{ priority: 'Low' }"]
    column3["Not Started"]
        c1["01 Gemini Tools @{ priority: 'Very High' }"]
        c2["03 Export & Share @{ priority: 'Very High' }"]
        c3["06 UX Enhancements @{ priority: 'High' }"]
        c4["07 Reliability @{ priority: 'High' }"]
    column4["Deferred"]
        d1["10 Lean Canvas @{ priority: 'Low' }"]
        d2["11 Scenario Planning @{ priority: 'Low' }"]
        d3["12 Trend Intelligence @{ priority: 'Low' }"]
```

---

## 05 — Full Pipeline Sequence (Prompts 01 + 02)

Shows the complete end-to-end flow: founder chat -> follow-up questions -> 7-agent pipeline -> report.

```mermaid
sequenceDiagram
    autonumber
    participant F as Founder
    participant Chat as ValidatorChat
    participant FU as validator-followup<br/>(Gemini Flash)
    participant EF as validator-start<br/>(Edge Function)
    participant EX as ExtractorAgent
    participant R as ResearchAgent
    participant C as CompetitorAgent
    participant SC as ScoringAgent
    participant MV as MVPAgent
    participant CO as ComposerAgent
    participant VE as VerifierAgent
    participant DB as Supabase DB

    F->>Chat: "AI contract review for law firms"
    Chat->>FU: POST /validator-followup
    FU-->>Chat: {action:"ask", question:"Fine dining or chains?"}
    F->>Chat: "Mid-size firms, 50-500 attorneys"
    Chat->>FU: POST /validator-followup
    FU-->>Chat: {action:"ask", question:"Revenue model?"}
    F->>Chat: "SaaS, $299/mo per firm"
    Chat->>FU: POST /validator-followup
    FU-->>Chat: {action:"ready", coverage: 6/8 topics}

    Note over F,Chat: Founder clicks "Generate Report"

    Chat->>EF: POST /validator-start {idea, messages}
    EF->>DB: INSERT validator_sessions (status: running)
    EF-->>Chat: {sessionId} (fire-and-forget)

    rect rgb(230, 245, 255)
        Note over EX,VE: Pipeline (82s avg)
        EF->>EX: Extract 10 criteria from messages
        EX-->>EF: {idea, problem, customer, industry, revenue_model...}
        par Research + Competitors (parallel)
            EF->>R: systemPrompt + curated URLs + googleSearch
            Note over R: URL Context reads BCG, McKinsey
            R-->>EF: {market_size, trends, citations[]}
        and
            EF->>C: systemPrompt + curated URLs + googleSearch
            Note over C: Platform search URLs (PH, SaaSHub)
            C-->>EF: {competitors[], positioning, gaps}
        end
        EF->>SC: profile + research + competitors
        Note over SC: thinkingLevel: "high"
        SC-->>EF: {scores: {market:78, execution:82...}, reasoning}
        EF->>MV: profile + research + scores
        MV-->>EF: {mvp_features[], timeline, phases[]}
        EF->>CO: ALL agent outputs
        Note over CO: thinkingLevel: "medium"
        CO-->>EF: {report: 14 sections, citations[]}
        EF->>VE: full report
        VE-->>EF: {verified: true, issues[], quality_score}
    end

    EF->>DB: UPDATE validator_sessions (status: completed)
    EF->>DB: INSERT validation_reports (14 sections)

    Note over F,DB: Founder polls /validator-status
    Chat->>F: Report ready! Score: 78/100 CAUTION
```

---

## 06 — Agent Data Flow (Prompts 01 + 02)

Shows what data flows between agents and the 14-section report output.

```mermaid
flowchart TD
    subgraph INPUT["Founder Input"]
        A1[Founder enters idea] --> A2[AI Follow-up Questions<br/>4-7 exchanges, 8-topic coverage]
        A2 --> A3{Coverage >= 5 topics<br/>AND >= 4 messages?}
        A3 -->|No| A2
        A3 -->|Yes| A4[Generate Report button enabled]
    end

    subgraph EXTRACT["Phase 1: Extraction"]
        B1[ExtractorAgent] --> B2[10 Criteria Extracted]
        B2 --> B3["1. Problem clarity<br/>2. Solution<br/>3. Key features<br/>4. Target market<br/>5. Channels<br/>6. Revenue model<br/>7. Industry vertical<br/>8. Startup type<br/>9. AI/tech component<br/>10. Competitive awareness"]
    end

    subgraph RESEARCH["Phase 2: Research (Parallel)"]
        direction LR
        C1[ResearchAgent<br/>googleSearch + urlContext] --> C2["Market Data<br/>TAM/SAM/SOM<br/>Growth trends<br/>Citations from BCG, McKinsey"]
        D1[CompetitorAgent<br/>googleSearch + urlContext] --> D2["Competitors<br/>Positioning matrix<br/>Feature comparison<br/>Platform data from PH, SaaSHub"]
    end

    subgraph ANALYSIS["Phase 3: Analysis"]
        E1["ScoringAgent<br/>thinkingLevel: high"] --> E2["7 Dimension Scores<br/>Market Size, Growth,<br/>Competition, Innovation,<br/>Execution, Team, Timing"]
        F1[MVPAgent] --> F2["3-Phase Roadmap<br/>Core features<br/>Timeline estimate"]
    end

    subgraph COMPOSE["Phase 4: Synthesis"]
        G1["ComposerAgent<br/>thinkingLevel: medium"] --> G2["14-Section Report"]
    end

    subgraph VERIFY["Phase 5: Verification"]
        H1[VerifierAgent] --> H2["Quality Check<br/>Citation verification<br/>Score calibration"]
    end

    A4 --> B1
    B3 --> C1
    B3 --> D1
    C2 --> E1
    D2 --> E1
    C2 --> F1
    E2 --> G1
    F2 --> G1
    C2 --> G1
    D2 --> G1
    G2 --> H1
    H2 --> I1[Report Saved to DB]
```

---

## 07 — Export & Sharing Workflows (Prompt 03)

Three features: PDF export, shareable links, competitive radar chart.

```mermaid
flowchart TD
    subgraph PDF["Prompt 03A — PDF Export"]
        P1[Founder clicks Download PDF] --> P2[Client-side generation<br/>html2canvas + jsPDF]
        P2 --> P3["Cover Page<br/>Logo, Score, Verdict, Date"]
        P3 --> P4["Content Pages 2-10"]
        P4 --> P5["Styled PDF<br/>McKinsey/BCG quality"]
        P5 --> P6[Download .pdf file]
    end

    subgraph SHARE["Prompt 03B — Shareable Links"]
        S1[Founder clicks Share] --> S2[Generate UUID link]
        S2 --> S3[INSERT shared_reports<br/>uuid, report_id, expires_at]
        S3 --> S4["Public URL<br/>startupai.app/report/uuid"]
        S4 --> S5{Visitor opens link}
        S5 --> S6[Read-only report view<br/>No login required]
        S5 --> S7[Expired? Show 404]
    end

    subgraph RADAR["Prompt 03C — Competitive Radar"]
        R1[CompetitorAgent output] --> R2["Parse competitor data"]
        R2 --> R3["Radar Chart (Recharts)"]
        R3 --> R4["Your startup vs 3-5 competitors<br/>across 5-7 dimensions"]
    end
```

---

## 08 — Knowledge & RAG Pipeline (Prompt 04)

Three stages: seed knowledge base, wire RAG into agents, continuous embedding pipeline.

```mermaid
flowchart TD
    subgraph SEED["Prompt 04A — Seed Knowledge Base"]
        K1["500+ Curated URLs"] --> K2["Fetch & Extract Content"]
        K2 --> K3["Chunk into 500-1000 token segments"]
        K3 --> K4["Generate Embeddings<br/>Gemini text-embedding-004"]
        K4 --> K5["INSERT knowledge_chunks"]
    end

    subgraph RAG["Prompt 04B — RAG in Pipeline"]
        R1["Agent receives query"] --> R2["match_chunks(query, industry)<br/>pgvector cosine similarity"]
        R2 --> R3{"Relevant chunks found?"}
        R3 -->|Yes| R4["Inject top 3-5 chunks into prompt"]
        R3 -->|No| R5["Continue with Google Search only"]
        R4 --> R6["Agent generates response with RAG + Search"]
        R5 --> R6
    end

    subgraph EMBED["Prompt 04C — Link Embedding Pipeline"]
        E1["New research URLs discovered"] --> E2["Queue for processing"]
        E2 --> E3["Fetch URL content"]
        E3 --> E4["Chunk + Embed"]
        E4 --> E5["INSERT knowledge_chunks"]
    end

    K5 --> R2
    E5 -.-> R2
```

---

## 09 — Agent Intelligence (Prompt 05)

ExtractorAgent expansion from 5 to 10 criteria, and selective per-agent retry.

```mermaid
flowchart TD
    subgraph EXT["Prompt 05A — ExtractorAgent 10 Criteria"]
        X1["Founder messages"] --> X2[ExtractorAgent]
        X2 --> X3["Current: 5 criteria<br/>problem, solution, customer,<br/>features, differentiation"]
        X2 --> X4["NEW: 10 criteria<br/>+ channels, revenue_model,<br/>industry, startup_type, ai_component"]
        X4 --> X5["Richer agent context = better reports"]
    end

    subgraph RETRY["Prompt 05C — Selective Agent Retry"]
        Y1["Pipeline completes but<br/>CompetitorAgent failed"] --> Y2{Current behavior}
        Y2 --> Y3["Restart ENTIRE pipeline<br/>7 agents x 82s = waste"]
        Y1 --> Y4{New behavior}
        Y4 --> Y5["Retry ONLY CompetitorAgent<br/>~15s, reuse cached results"]
        Y5 --> Y6["Merge into existing report"]
    end
```

---

## 10 — URL Context Real-World Example (Prompt 01)

Step-by-step sequence showing how a law firm AI startup validation uses URL Context and Thinking.

```mermaid
sequenceDiagram
    autonumber
    participant F as Founder
    participant UI as React Frontend
    participant G as Gemini Flash
    participant CL as curated-links.ts
    participant UC as URL Context
    participant GS as Google Search

    F->>UI: "AI-powered contract review for mid-size law firms"

    Note over UI,CL: Step 1: Resolve Industry + Build URLs
    UI->>CL: resolveIndustry("law firms")
    CL-->>UI: "legal_compliance"
    UI->>CL: getCuratedLinks("legal_compliance", "AI contract review")
    CL-->>UI: 5 industry + 5 cross-industry + 5 platform search URLs

    Note over UI,GS: Step 2: ResearchAgent with URL Context
    UI->>G: systemPrompt + urls[] tools: [googleSearch, urlContext]
    G->>UC: Fetch NLR article
    UC-->>G: "78% of Am Law 200 firms adopted AI tools"
    G->>UC: Fetch Thomson Reuters report
    UC-->>G: "Legal AI market $1.2B, CAGR 28%"
    G->>GS: "AI contract review market size 2026"
    GS-->>G: Additional search results
    G-->>UI: {market_size: "$1.2B", citations: [NLR, Thomson Reuters]}

    Note over UI,GS: Step 3: CompetitorAgent with Smart Platform URLs
    UI->>G: systemPrompt + platform search URLs
    G->>UC: producthunt.com/search?q=AI+contract+review
    UC-->>G: "Ironclad (1,842 upvotes), Juro (943)"
    G-->>UI: {competitors: [Ironclad, Juro, SpotDraft]}

    Note over UI,GS: Step 4: ScoringAgent with Thinking
    UI->>G: profile + research + competitors thinkingLevel: "high"
    Note over G: Deep reasoning about market vs incumbents
    G-->>UI: {overall: 74, market: 82, competition: 45}

    F->>UI: Views report with REAL citations
```

---

## 11 — Fashion AI Strategy Overview

Market-to-pipeline strategy diagram for fashion retail AI, showing market forces, value chain, opportunities, pipeline, and buyer mapping.

```mermaid
graph TB
    subgraph MARKET["FASHION MARKET 2026 — $2T Global, $89B AI by 2035"]
        direction TB
        M1["Global Fashion<br/>$2.0T → $2.4T<br/>3-4% CAGR"]
        M2["AI in Fashion<br/>$2.9B → $89B<br/>40.8% CAGR"]
        M3["E-commerce Fashion<br/>$137B → $233B EU<br/>11% CAGR"]
        M4["Resale<br/>2-3x faster than<br/>first-hand growth"]
    end

    subgraph FORCES["INDUSTRY FORCES (Why Now)"]
        direction TB
        F1["Tariff Turbulence<br/>US: 13% to 36%<br/>$27B duties"]
        F2["AI = #1 Priority<br/>46% expect worse<br/>AI is the lever"]
        F3["Mid-Market Rise<br/>Fastest-growing<br/>replaces luxury"]
        F4["Regulation<br/>EU ESPR + DPP<br/>2026 deadlines"]
        F5["GEO replaces SEO<br/>53% shop via AI<br/>agents decide"]
        F6["90% Pilots Fail<br/>Data foundations<br/>broken at scale"]
    end

    subgraph CHAIN["VALUE CHAIN — Where AI Wins"]
        direction LR
        C1["Trend &<br/>Design"]
        C2["Sourcing &<br/>Materials"]
        C3["Manufacturing<br/>& Capacity"]
        C4["Logistics &<br/>Allocation"]
        C5["Merchandising<br/>& Pricing"]
        C6["Commerce &<br/>Marketing"]
        C7["Returns &<br/>Circularity"]
        C1 --> C2 --> C3 --> C4 --> C5 --> C6 --> C7
    end

    subgraph OPPS["TOP 5 AI OPPORTUNITIES"]
        direction TB
        O1["1. GEO / Product Data<br/>VP Digital 4-8 wks<br/>$50M-$200M SOM"]
        O2["2. Markdown Optimization<br/>VP Merch 8-12 wks<br/>$50M-$200M SOM"]
        O3["3. Compliance / DPP<br/>Legal 6-12 mo<br/>$50M-$200M SOM"]
        O4["4. Allocation Copilot<br/>VP Ops 6-9 mo<br/>$50M-$200M SOM"]
        O5["5. Content Pipeline<br/>CMO 2-6 wks<br/>$50M-$200M SOM"]
    end

    subgraph PIPELINE["STARTUPAI VALIDATOR PIPELINE (31 seconds)"]
        direction LR
        P1["Extractor<br/>4s"]
        P2["Research<br/>8s"]
        P3["Competitors<br/>7s"]
        P4["Scoring<br/>5s"]
        P5["MVP<br/>4s"]
        P6["Composer<br/>7s"]
        P7["Verifier<br/>3s"]
        P1 --> P2
        P1 --> P3
        P2 --> P4
        P3 --> P4
        P4 --> P5 --> P6 --> P7
    end

    subgraph OUTPUT["VALIDATION REPORT — 14 Sections"]
        direction TB
        R1["Executive Summary<br/>+ Problem + Market"]
        R2["Competitors Table<br/>+ Scores Radar"]
        R3["Financial Projections<br/>+ Revenue Model"]
        R4["MVP Roadmap<br/>+ Tech Stack"]
        R5["Team & Hiring<br/>+ Key Questions"]
        R6["Risk Assessment<br/>+ Resources"]
    end

    subgraph BUYERS["FASHION BUYERS & BUDGETS"]
        direction TB
        B1["VP Merchandising<br/>$15K-$75K 1-3 mo"]
        B2["VP Digital / CMO<br/>$10K-$50K 2-6 wks"]
        B3["Sustainability<br/>$20K-$100K 3-6 mo"]
        B4["COO / Supply Chain<br/>$50K-$200K 3-9 mo"]
    end

    MARKET --> FORCES
    FORCES --> CHAIN
    CHAIN --> OPPS
    OPPS --> PIPELINE
    PIPELINE --> OUTPUT
    OUTPUT --> BUYERS
```

---

## 12 — Fashion Pipeline Sequence (StyleSync AI)

Full pipeline walkthrough for a fashion markdown optimization startup, showing 7-agent execution with curated URLs from McKinsey, BCG, K3.

See `11-fashion-retail-real-world-example.md` for the complete narrative walkthrough.

```mermaid
sequenceDiagram
    autonumber
    participant F as Founder
    participant UI as StartupAI Chat
    participant EX as ExtractorAgent
    participant RE as ResearchAgent
    participant CO as CompetitorAgent
    participant SC as ScoringAgent
    participant MV as MVPAgent
    participant CM as ComposerAgent
    participant VE as VerifierAgent
    participant DB as Supabase DB
    participant GEM as Gemini 3 Pro
    participant URLs as Curated Links<br/>McKinsey, BCG, K3

    rect rgb(30, 30, 50)
        Note over F,UI: Founder describes StyleSync AI
        F->>UI: "AI for mid-market fashion brands...<br/>markdown timing... 12 VP interviews...<br/>Shopify Plus... $2K-$8K/mo SaaS"
        UI->>DB: Create session + store input
    end

    rect rgb(50, 30, 30)
        Note over EX,GEM: Phase 1 — Extract 10 Criteria (4s)
        UI->>EX: Parse founder input
        EX->>GEM: Extract structured profile
        GEM-->>EX: 10 criteria: problem, solution,<br/>channels, revenue, industry...
        EX->>DB: Store profile
    end

    rect rgb(30, 30, 60)
        Note over UI,EX: Adaptive Follow-Up (2 questions)
        UI->>F: Team ML + fashion expertise?
        F->>UI: Ex-Stitch Fix + ex-Nordstrom
        UI->>F: How do Blue Yonder fail mid-market?
        F->>UI: $200K+ cost, no fashion logic
    end

    rect rgb(30, 50, 30)
        Note over RE,CO: Phase 2 — Parallel Research (8s)
        par Research reads curated URLs
            UI->>RE: Market research with URL Context
            RE->>URLs: Read McKinsey State of Fashion 2026
            RE->>URLs: Read BCG AI-first fashion
            RE->>URLs: Read K3 Fashion Solutions
            RE->>DB: Store research output
        and Competitor analysis
            UI->>CO: Competitor landscape
            CO->>GEM: Google Search grounding
            GEM-->>CO: Blue Yonder, Revionics, EDITED
            CO->>DB: Store competitor matrix
        end
    end

    rect rgb(50, 30, 50)
        Note over SC,GEM: Phase 3 — Scoring (5s, thinkingLevel: high)
        SC->>DB: Read profile + research + competitors
        SC->>GEM: Score 10 dimensions
        GEM-->>SC: Problem 85, Timing 88,<br/>Solution 82, Overall 76/100
        SC->>DB: Store scores
    end

    rect rgb(30, 40, 50)
        Note over MV,GEM: Phase 4 — MVP (4s)
        MV->>GEM: Design MVP scope
        GEM-->>MV: Shopify Plus, single category,<br/>8-10 wk build, RICE: 65
        MV->>DB: Store MVP plan
    end

    rect rgb(40, 30, 40)
        Note over CM,GEM: Phase 5 — 14-Section Report (7s)
        CM->>DB: Read ALL upstream outputs
        CM->>GEM: Generate full report
        GEM-->>CM: 14 sections with citations
        CM->>DB: Store report
    end

    rect rgb(30, 50, 40)
        Note over VE,GEM: Phase 6 — Verify (3s)
        VE->>GEM: Cross-check consistency
        GEM-->>VE: PASS — 1 warning, 1 gap
        VE->>DB: Store verification
    end

    rect rgb(40, 40, 20)
        Note over F,DB: Report Delivered — 31s total
        UI->>F: Score: 76/100 — Strong validation
        F->>UI: Export PDF + Share link
    end
```
