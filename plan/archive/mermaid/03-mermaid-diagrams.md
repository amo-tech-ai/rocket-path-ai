# StartupAI System Diagrams

> **Version:** 1.0 | **Created:** 2026-02-02
> **Purpose:** Visual system design for StartupAI using Mermaid diagrams
> **Phase Structure:** CORE → MVP → ADVANCED → PRODUCTION

---

## Diagram Index

| ID | Diagram | Type | Phase | Purpose |
|----|---------|------|-------|---------|
| D-01 | System Context | C4 Context | CORE | High-level system overview |
| D-02 | Container Architecture | C4 Container | CORE | Technical architecture |
| D-03 | Founder Journey | Journey | CORE | User experience mapping |
| D-04 | Lifecycle States | State | CORE | 10-stage startup lifecycle |
| D-05 | Onboarding Flow | Flowchart | CORE | New user onboarding |
| D-06 | Lean Canvas Flow | Flowchart | MVP | Canvas completion process |
| D-07 | Validation Lab Flow | Flowchart | MVP | Experiment design & execution |
| D-08 | AI Agent Architecture | Class | MVP | Agent system design |
| D-09 | Database Schema | ER | CORE | Data model |
| D-10 | Prompt Pack Flow | Sequence | MVP | Prompt pack execution |
| D-11 | Atlas Chat Flow | Sequence | MVP | Chatbot interaction |
| D-12 | Task Orchestration | Flowchart | ADVANCED | Task generation & priority |
| D-13 | Pitch Deck Generation | Sequence | ADVANCED | Deck builder flow |
| D-14 | PMF Assessment | Flowchart | ADVANCED | Product-market fit scoring |
| D-15 | Investor CRM Flow | Flowchart | ADVANCED | Fundraising pipeline |
| D-16 | Error Handling | State | PRODUCTION | System error states |
| D-17 | Monitoring Flow | Flowchart | PRODUCTION | Observability system |

---

## CORE PHASE DIAGRAMS

### D-01: System Context Diagram

```mermaid
C4Context
    title StartupAI System Context

    Person(founder, "Founder", "Startup founder building a company")
    Person(investor, "Investor", "Potential investor")

    System(startupai, "StartupAI", "AI-powered startup operating system")

    System_Ext(gemini, "Google Gemini", "Fast AI operations")
    System_Ext(claude, "Claude AI", "Deep reasoning")
    System_Ext(supabase, "Supabase", "Backend services")
    System_Ext(firecrawl, "Firecrawl", "Website scraping")

    Rel(founder, startupai, "Uses", "Web browser")
    Rel(investor, startupai, "Views pitch materials", "Web browser")
    Rel(startupai, gemini, "Fast ops", "API")
    Rel(startupai, claude, "Reasoning", "API")
    Rel(startupai, supabase, "Data", "PostgreSQL")
    Rel(startupai, firecrawl, "Scrape", "API")
```

### D-02: Container Architecture

```mermaid
C4Container
    title StartupAI Container Diagram

    Person(founder, "Founder")

    Container_Boundary(frontend, "Frontend") {
        Container(spa, "React SPA", "React + TypeScript", "Single page application")
        Container(ui, "shadcn/ui", "Component Library", "UI components")
    }

    Container_Boundary(backend, "Backend - Supabase") {
        Container(auth, "Auth Service", "Supabase Auth", "OAuth authentication")
        Container(db, "PostgreSQL", "Database", "Startup data storage")
        Container(rls, "RLS Policies", "Row Level Security", "Data isolation")
        Container(edge, "Edge Functions", "Deno", "AI orchestration")
    }

    Container_Boundary(ai, "AI Services") {
        Container(atlas, "Atlas Chatbot", "Edge Function", "Conversational AI")
        Container(agents, "AI Agents", "Edge Functions", "Specialized tasks")
    }

    System_Ext(gemini, "Gemini API")
    System_Ext(claude, "Claude API")

    Rel(founder, spa, "Uses")
    Rel(spa, auth, "Authenticates")
    Rel(spa, db, "CRUD")
    Rel(spa, edge, "Triggers")
    Rel(edge, atlas, "Routes")
    Rel(edge, agents, "Orchestrates")
    Rel(atlas, gemini, "Fast ops")
    Rel(agents, claude, "Reasoning")
```

### D-03: Founder Journey

```mermaid
journey
    title Founder Journey: Idea to Funded

    section Onboarding
        Sign up: 5: Founder
        Add website: 4: Founder
        Describe problem: 4: Founder
        Select industry: 5: Founder

    section Validation
        Complete Lean Canvas: 4: Founder
        Run experiments: 3: Founder
        Interview customers: 4: Founder
        Validate assumptions: 4: Founder

    section Building
        Scope MVP: 4: Founder
        Plan sprints: 3: Founder
        Track tasks: 4: Founder
        Launch MVP: 5: Founder

    section Growing
        Track metrics: 4: Founder
        Optimize funnel: 3: Founder
        Achieve PMF: 5: Founder

    section Fundraising
        Build pitch deck: 4: Founder
        Prepare data room: 3: Founder
        Meet investors: 4: Founder
        Close funding: 5: Founder
```

### D-04: Startup Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> Idea

    Idea --> MarketDiscovery: Problem defined
    MarketDiscovery --> Strategy: Market validated
    Strategy --> PSF: Business model complete
    PSF --> MVP: Solution validated
    MVP --> GTM: Product shipped
    GTM --> Traction: First customers
    Traction --> Scale: PMF achieved
    Scale --> Fundraising: Growth proven
    Fundraising --> Maturity: Funded
    Maturity --> [*]: Exit or continue

    note right of Idea
        Gate: Clarity ≥70%
    end note

    note right of PSF
        Gate: 10+ interviews
        1+ assumption validated
    end note

    note right of Traction
        Gate: 40%+ PMF score
    end note

    state Idea {
        [*] --> ProblemDiscovery
        ProblemDiscovery --> ProblemValidated: 10+ interviews
    }

    state PSF {
        [*] --> Experimenting
        Experimenting --> Validated: Success criteria met
        Experimenting --> Pivot: Failed
        Pivot --> Experimenting: New hypothesis
    }
```

### D-05: Onboarding Flow

```mermaid
flowchart TD
    Start([User Signs Up]) --> Auth{OAuth Provider?}
    Auth -->|Google| GoogleAuth[Google OAuth]
    Auth -->|LinkedIn| LinkedInAuth[LinkedIn OAuth]

    GoogleAuth --> Profile[Create Profile]
    LinkedInAuth --> Profile

    Profile --> Website{Has Website?}
    Website -->|Yes| Scrape[Firecrawl Scrape]
    Website -->|No| Manual[Manual Entry]

    Scrape --> Extract[AI Extraction]
    Extract --> AutoFill[Auto-fill Profile]
    AutoFill --> Review[Review & Edit]

    Manual --> Problem[Describe Problem]
    Review --> Problem

    Problem --> Industry[Select Industry]
    Industry --> Playbook[Assign Playbook]

    Playbook --> Stage[Detect Stage]
    Stage --> Goals[Set 90-day Goals]

    Goals --> Tasks[Generate First Tasks]
    Tasks --> Dashboard([Dashboard Ready])

    subgraph AI Processing
        Extract
        AutoFill
        Stage
        Tasks
    end

    style AI Processing fill:#e1f5fe
```

### D-09: Database Schema

```mermaid
erDiagram
    USER ||--o{ STARTUP : owns
    STARTUP ||--o{ LEAN_CANVAS : has
    STARTUP ||--o{ EXPERIMENT : runs
    STARTUP ||--o{ TASK : contains
    STARTUP ||--o{ CHAT_MESSAGE : logs
    STARTUP ||--|| PLAYBOOK : assigned

    USER {
        uuid id PK
        string email
        string name
        string avatar_url
        timestamp created_at
    }

    STARTUP {
        uuid id PK
        uuid user_id FK
        string name
        string description
        string industry
        string stage
        string website
        json lean_canvas
        timestamp created_at
    }

    LEAN_CANVAS {
        uuid id PK
        uuid startup_id FK
        int version
        json problem
        json customer_segments
        json uvp
        json solution
        json channels
        json revenue
        json costs
        json metrics
        json unfair_advantage
        int score
        timestamp created_at
    }

    EXPERIMENT {
        uuid id PK
        uuid startup_id FK
        string type
        string hypothesis
        json success_criteria
        string status
        json results
        timestamp created_at
    }

    TASK {
        uuid id PK
        uuid startup_id FK
        string title
        string description
        string priority
        string status
        string category
        timestamp due_date
    }

    PLAYBOOK {
        uuid id PK
        string industry
        string name
        json interview_questions
        json experiment_templates
        json metrics_benchmarks
    }

    CHAT_MESSAGE {
        uuid id PK
        uuid startup_id FK
        string role
        text content
        string agent_used
        json context
        timestamp created_at
    }
```

---

## MVP PHASE DIAGRAMS

### D-06: Lean Canvas Completion Flow

```mermaid
flowchart TD
    Start([Open Canvas]) --> Block1[Problem Block]

    Block1 --> AI1{AI Assist?}
    AI1 -->|Yes| Suggest1[AI Suggests Content]
    AI1 -->|No| Manual1[Manual Entry]
    Suggest1 --> Edit1[User Edits]
    Manual1 --> Edit1

    Edit1 --> Bias1{Solution Bias?}
    Bias1 -->|Yes| Warn1[Show Warning]
    Bias1 -->|No| Save1[Save Block]
    Warn1 --> Edit1

    Save1 --> Extract1[Extract Assumptions]
    Extract1 --> Block2[Customer Segments]

    Block2 --> AI2{AI Assist?}
    AI2 -->|Yes| Suggest2[AI Suggests ICP]
    AI2 -->|No| Manual2[Manual Entry]
    Suggest2 --> Edit2[User Edits]
    Manual2 --> Edit2
    Edit2 --> Save2[Save Block]
    Save2 --> Extract2[Extract Assumptions]

    Extract2 --> UVP[UVP Block]
    UVP --> Generate[AI Generates 3 Options]
    Generate --> Select[User Selects/Edits]
    Select --> Validate{≤120 chars?}
    Validate -->|No| Edit3[Edit UVP]
    Edit3 --> Validate
    Validate -->|Yes| SaveUVP[Save UVP]

    SaveUVP --> Remaining[Complete Remaining Blocks]
    Remaining --> Score[Calculate Canvas Score]
    Score --> Risk[Populate Risk Board]
    Risk --> Complete([Canvas Complete])

    subgraph AI Agents
        Suggest1
        Extract1
        Suggest2
        Extract2
        Generate
        Score
    end

    style AI Agents fill:#fff3e0
```

### D-07: Validation Lab Flow

```mermaid
flowchart TD
    Start([Select Assumption]) --> Type{Experiment Type?}

    Type -->|Interview| Interview[Problem Interview]
    Type -->|Landing| Landing[Landing Page Test]
    Type -->|Concierge| Concierge[Concierge MVP]
    Type -->|WizardOz| Wizard[Wizard of Oz]
    Type -->|PreOrder| PreOrder[Pre-order Test]

    Interview --> Script[AI Generates Script]
    Landing --> Copy[AI Generates Copy]
    Concierge --> Plan[AI Creates Plan]
    Wizard --> Spec[AI Creates Spec]
    PreOrder --> Page[AI Creates Page]

    Script --> Design[Design Experiment]
    Copy --> Design
    Plan --> Design
    Spec --> Design
    Page --> Design

    Design --> Hypothesis[Define Hypothesis]
    Hypothesis --> Success[Set Success Criteria]
    Success --> Sample[Set Sample Size]
    Sample --> Duration[Set Duration]

    Duration --> Run([Run Experiment])

    Run --> Collect[Collect Data]
    Collect --> Analyze[AI Analyzes Results]

    Analyze --> Result{Success?}
    Result -->|Yes| Validated[Mark Validated]
    Result -->|No| Failed[Mark Failed]
    Result -->|Mixed| Refine[Refine & Retry]

    Validated --> Update[Update Canvas]
    Failed --> Pivot{Pivot?}
    Refine --> Design

    Pivot -->|Yes| NewHyp[New Hypothesis]
    Pivot -->|No| Continue[Continue Testing]
    NewHyp --> Start
    Continue --> Start

    Update --> Gate{Gate Passed?}
    Gate -->|Yes| Unlock[Unlock Next Stage]
    Gate -->|No| More[Run More Experiments]
    More --> Start
    Unlock --> Done([Proceed to MVP])
```

### D-08: AI Agent Architecture

```mermaid
classDiagram
    class Agent {
        <<abstract>>
        +String id
        +String name
        +String purpose
        +AutonomyLevel autonomy
        +trigger()
        +process()
        +output()
    }

    class ValidationAgent {
        <<interface>>
        +validateInput()
        +extractAssumptions()
    }

    class PlanningAgent {
        <<interface>>
        +generatePlan()
        +prioritize()
    }

    class IdeaStructurer {
        +structureProblem()
        +scoreClariry()
    }

    class MarketEvaluator {
        +analyzeTAM()
        +assessCompetition()
        +recommendGoNoGo()
    }

    class CanvasAgent {
        +suggestContent()
        +detectBias()
        +extractAssumptions()
    }

    class ExperimentDesigner {
        +designExperiment()
        +generateScript()
        +setSuccessCriteria()
    }

    class RiskDetector {
        +scoreAssumptions()
        +prioritizeRisks()
    }

    class MVPScoper {
        +defineFeatures()
        +applyRICE()
        +scopeMinimum()
    }

    class TaskOrchestrator {
        +generateTasks()
        +prioritize()
        +assignDueDates()
    }

    class TractionAnalyst {
        +analyzeMetrics()
        +identifyBottleneck()
        +recommendOMTM()
    }

    class PitchBuilder {
        +generateDeck()
        +createOnePager()
        +prepareDataRoom()
    }

    Agent <|-- IdeaStructurer
    Agent <|-- MarketEvaluator
    Agent <|-- CanvasAgent
    Agent <|-- ExperimentDesigner
    Agent <|-- RiskDetector
    Agent <|-- MVPScoper
    Agent <|-- TaskOrchestrator
    Agent <|-- TractionAnalyst
    Agent <|-- PitchBuilder

    ValidationAgent <|.. IdeaStructurer
    ValidationAgent <|.. MarketEvaluator
    ValidationAgent <|.. CanvasAgent
    ValidationAgent <|.. ExperimentDesigner

    PlanningAgent <|.. RiskDetector
    PlanningAgent <|.. MVPScoper
    PlanningAgent <|.. TaskOrchestrator
    PlanningAgent <|.. TractionAnalyst
    PlanningAgent <|.. PitchBuilder

    CanvasAgent --> ExperimentDesigner : triggers
    ExperimentDesigner --> RiskDetector : informs
    RiskDetector --> TaskOrchestrator : prioritizes
```

### D-10: Prompt Pack Execution Flow

```mermaid
sequenceDiagram
    participant U as Founder
    participant UI as Frontend
    participant EP as Edge Function
    participant PP as Prompt Pack
    participant AI as Gemini/Claude
    participant DB as Database

    U->>UI: Trigger prompt pack
    UI->>EP: POST /prompt-pack-executor
    EP->>DB: Load pack config
    DB-->>EP: Pack steps

    loop Each Step
        EP->>AI: Execute step prompt
        AI-->>EP: AI response
        EP->>UI: Show step output
        UI->>U: Display & collect input
        U->>UI: Provide input/confirm
        UI->>EP: Submit step response
        EP->>DB: Save step progress
    end

    EP->>DB: Mark pack complete
    EP->>DB: Auto-populate fields
    EP-->>UI: Pack completion summary
    UI-->>U: Show next actions
```

### D-11: Atlas Chat Interaction Flow

```mermaid
sequenceDiagram
    participant U as Founder
    participant UI as Chat Interface
    participant EP as ai-chat Function
    participant CTX as Context Builder
    participant AI as Gemini/Claude
    participant DB as Database

    U->>UI: Send message
    UI->>EP: POST /ai-chat

    EP->>DB: Load startup profile
    EP->>DB: Load canvas state
    EP->>DB: Load recent messages
    EP->>DB: Load playbook

    EP->>CTX: Build context
    CTX->>CTX: Add core identity
    CTX->>CTX: Add stage guidance
    CTX->>CTX: Add screen context
    CTX->>CTX: Add startup data
    CTX-->>EP: Full context

    alt Fast Operation
        EP->>AI: Gemini Flash
    else Deep Reasoning
        EP->>AI: Claude Sonnet
    end

    AI-->>EP: Response
    EP->>DB: Save message
    EP-->>UI: Stream response
    UI-->>U: Display response

    opt Tool Call
        EP->>EP: Execute tool
        EP->>DB: Update data
        EP-->>UI: Tool result
    end
```

---

## ADVANCED PHASE DIAGRAMS

### D-12: Task Orchestration Flow

```mermaid
flowchart TD
    Start([Trigger Event]) --> Detect{Event Type?}

    Detect -->|Canvas Update| Canvas[Canvas Agent]
    Detect -->|Stage Change| Stage[Stage Detector]
    Detect -->|Experiment Complete| Exp[Experiment Analyzer]
    Detect -->|Sprint End| Sprint[Sprint Planner]

    Canvas --> Extract[Extract Gaps]
    Stage --> Generate[Generate Stage Tasks]
    Exp --> Learn[Generate Learning Tasks]
    Sprint --> Retro[Generate Retro Tasks]

    Extract --> Queue[Task Queue]
    Generate --> Queue
    Learn --> Queue
    Retro --> Queue

    Queue --> Prioritize[AI Prioritization]

    Prioritize --> P1{Priority?}
    P1 -->|High| Urgent[Mark Urgent]
    P1 -->|Medium| Normal[Mark Normal]
    P1 -->|Low| Later[Mark Later]

    Urgent --> Assign[Assign Due Dates]
    Normal --> Assign
    Later --> Assign

    Assign --> Notify[Notify Founder]
    Notify --> Dashboard([Update Dashboard])

    subgraph Prioritization Rules
        Impact[Impact Score]
        Effort[Effort Estimate]
        Stage[Stage Relevance]
        Blocking[Blocking Status]
        Impact --> Priority[Priority = Impact × Stage / Effort]
        Effort --> Priority
        Stage --> Priority
        Blocking --> Priority
    end
```

### D-13: Pitch Deck Generation Flow

```mermaid
sequenceDiagram
    participant U as Founder
    participant UI as Deck Builder
    participant EP as pitch-deck-generator
    participant AI as Claude
    participant DB as Database
    participant Export as Export Service

    U->>UI: Start deck creation
    UI->>EP: GET startup data
    EP->>DB: Load canvas
    EP->>DB: Load metrics
    EP->>DB: Load experiments
    EP->>DB: Load profile
    DB-->>EP: All data

    loop Each Slide (1-12)
        EP->>AI: Generate slide content
        AI-->>EP: Slide text + notes
        EP->>UI: Show slide preview
        UI->>U: Review slide
        U->>UI: Edit or approve
        UI->>EP: Save slide
    end

    EP->>DB: Save deck

    U->>UI: Export deck
    UI->>Export: Generate PDF
    Export-->>UI: PDF file
    UI-->>U: Download deck

    opt One-Pager
        U->>UI: Generate one-pager
        UI->>EP: Create summary
        EP->>AI: Summarize deck
        AI-->>EP: One-pager content
        EP-->>UI: One-pager preview
    end
```

### D-14: PMF Assessment Flow

```mermaid
flowchart TD
    Start([Trigger PMF Check]) --> Survey[Run Sean Ellis Survey]

    Survey --> Collect[Collect Responses]
    Collect --> Calculate[Calculate Scores]

    Calculate --> VeryDisappointed[Very Disappointed %]
    Calculate --> SomewhatDisappointed[Somewhat Disappointed %]
    Calculate --> NotDisappointed[Not Disappointed %]

    VeryDisappointed --> Score{≥40%?}

    Score -->|Yes| PMFAchieved[PMF Achieved]
    Score -->|No| Analyze[Analyze Gaps]

    PMFAchieved --> Unlock[Unlock Scale Features]
    PMFAchieved --> Celebrate[Show Success]

    Analyze --> Segment[Segment by Customer Type]
    Segment --> Find[Find High-Fit Segments]
    Find --> Recommend[AI Recommendations]

    Recommend --> Actions{Actions?}
    Actions -->|Focus| Focus[Focus on high-fit segment]
    Actions -->|Improve| Improve[Improve activation]
    Actions -->|Pivot| Pivot[Consider pivot]

    Focus --> Tasks[Generate Tasks]
    Improve --> Tasks
    Pivot --> Tasks

    Tasks --> Dashboard([Update Dashboard])

    subgraph PMF Metrics
        Retention[Week 1 Retention]
        NPS[NPS Score]
        Growth[Growth Rate]
        Engagement[DAU/MAU]
    end
```

### D-15: Investor CRM Flow

```mermaid
flowchart TD
    Start([Add Investor]) --> Profile[Create Profile]

    Profile --> Research[AI Research Investor]
    Research --> Match{Match Score?}

    Match -->|High| Hot[Mark Hot Lead]
    Match -->|Medium| Warm[Mark Warm Lead]
    Match -->|Low| Cold[Mark Cold Lead]

    Hot --> Outreach[Plan Outreach]
    Warm --> Nurture[Add to Nurture List]
    Cold --> Archive[Archive]

    Outreach --> Intro{Warm Intro?}
    Intro -->|Yes| WarmIntro[Find Connection Path]
    Intro -->|No| ColdOutreach[Prepare Cold Email]

    WarmIntro --> Request[Request Introduction]
    ColdOutreach --> Send[Send Email]
    Request --> Meeting
    Send --> Response{Response?}

    Response -->|Yes| Meeting[Schedule Meeting]
    Response -->|No| FollowUp[Add Follow-up Task]
    FollowUp --> Response

    Meeting --> Prep[AI Meeting Prep]
    Prep --> Notes[AI Brief + Questions]
    Notes --> Conduct[Conduct Meeting]

    Conduct --> Log[Log Meeting Notes]
    Log --> NextStep{Next Step?}

    NextStep -->|DD| DueDiligence[Enter Due Diligence]
    NextStep -->|Pass| Pass[Mark Passed]
    NextStep -->|FollowUp| MoreMeetings[More Meetings]

    DueDiligence --> DataRoom[Prepare Data Room]
    DataRoom --> TermSheet{Term Sheet?}

    TermSheet -->|Yes| Review[Review Terms]
    TermSheet -->|No| Negotiate[Negotiate]
    Negotiate --> TermSheet

    Review --> Sign[Sign & Close]
    Sign --> Funded([Mark Funded])
```

---

## PRODUCTION PHASE DIAGRAMS

### D-16: Error Handling States

```mermaid
stateDiagram-v2
    [*] --> Normal

    Normal --> Warning: Minor issue
    Normal --> Error: Operation failed
    Normal --> Critical: System failure

    Warning --> Normal: Auto-resolved
    Warning --> Error: Escalated

    Error --> Retry: Retry available
    Error --> Fallback: Degraded mode
    Error --> UserAction: User intervention needed

    Retry --> Normal: Success
    Retry --> Error: Max retries

    Fallback --> Normal: Service restored
    Fallback --> Critical: Cascade failure

    UserAction --> Normal: User resolved
    UserAction --> Support: Support ticket

    Critical --> Maintenance: System down
    Maintenance --> Normal: Restored

    Support --> Normal: Resolved

    state Error {
        [*] --> Detecting
        Detecting --> Logging
        Logging --> Alerting
        Alerting --> Handling
    }

    state Fallback {
        [*] --> SafeMode
        SafeMode --> SuggestOnly
        SuggestOnly --> ManualOverride
    }
```

### D-17: Monitoring & Observability Flow

```mermaid
flowchart TD
    Start([System Events]) --> Collect[Collect Metrics]

    Collect --> Types{Metric Type?}

    Types -->|Performance| Perf[Response Time, Latency]
    Types -->|Usage| Usage[API Calls, User Actions]
    Types -->|Error| Errors[Error Rates, Exceptions]
    Types -->|Business| Biz[Conversions, Retention]

    Perf --> Aggregate[Aggregate Metrics]
    Usage --> Aggregate
    Errors --> Aggregate
    Biz --> Aggregate

    Aggregate --> Dashboard[Monitoring Dashboard]
    Aggregate --> Alerts{Threshold?}

    Alerts -->|Exceeded| Alert[Trigger Alert]
    Alerts -->|Normal| Log[Log Only]

    Alert --> Severity{Severity?}

    Severity -->|Critical| Page[Page On-Call]
    Severity -->|High| Slack[Slack Notification]
    Severity -->|Medium| Email[Email Notification]

    Page --> Investigate[Investigate Issue]
    Slack --> Investigate

    Investigate --> RootCause[Root Cause Analysis]
    RootCause --> Fix[Apply Fix]
    Fix --> Verify[Verify Resolution]
    Verify --> Close[Close Incident]

    Close --> PostMortem[Post-Mortem]
    PostMortem --> Improve[Improve Monitoring]

    subgraph Key Metrics
        direction LR
        API[API Latency p99]
        AI[AI Response Time]
        DB[DB Query Time]
        Err[Error Rate %]
    end
```

---

## Diagram Phase Summary

| Phase | Diagrams | Status | Milestone |
|-------|----------|--------|-----------|
| **CORE** | D-01 to D-05, D-09 | Required | Basic flow works end-to-end |
| **MVP** | D-06 to D-11 | Required | Users can validate ideas reliably |
| **ADVANCED** | D-12 to D-15 | Optional | System proactively assists |
| **PRODUCTION** | D-16, D-17 | Optional | System is stable at scale |

---

## Diagram to Skill Mapping

Each diagram maps to one or more Claude skills that implement the described behavior.

### CORE Phase Skills

| Diagram | Primary Skill | Secondary Skills |
|---------|---------------|------------------|
| D-01 System Context | - | - |
| D-02 Container Architecture | - | `supabase-cli`, `supabase-schema` |
| D-03 Founder Journey | `playbooks` | `lean-canvas`, `validation-lab` |
| D-04 Lifecycle States | `startup-expertise` | `lean-sprints`, `traction` |
| D-05 Onboarding Flow | `playbooks` | `idea-validator` |
| D-09 Database Schema | `supabase-schema` | `supabase-create-migration`, `supabase-seeding` |

### MVP Phase Skills

| Diagram | Primary Skill | Secondary Skills |
|---------|---------------|------------------|
| D-06 Lean Canvas Flow | `lean-canvas` | `idea-validator`, `validation-lab` |
| D-07 Validation Lab Flow | `validation-lab` | `lean-sprints`, `prompt-packs` |
| D-08 AI Agent Architecture | `atlas-chat` | `gemini`, `sdk-agent` |
| D-10 Prompt Pack Flow | `prompt-packs` | `playbooks` |
| D-11 Atlas Chat Flow | `atlas-chat` | `playbooks`, `prompt-packs` |

### ADVANCED Phase Skills

| Diagram | Primary Skill | Secondary Skills |
|---------|---------------|------------------|
| D-12 Task Orchestration | `lean-sprints` | `traction`, `playbooks` |
| D-13 Pitch Deck Generation | `pitch-deck` | `fundraising`, `prompt-packs` |
| D-14 PMF Assessment | `traction` | `startup-metrics`, `validation-lab` |
| D-15 Investor CRM Flow | `fundraising` | `pitch-deck`, `startup-metrics` |

### PRODUCTION Phase Skills

| Diagram | Primary Skill | Secondary Skills |
|---------|---------------|------------------|
| D-16 Error Handling | `performance-optimization` | `security-hardening` |
| D-17 Monitoring Flow | `performance-optimization` | `cicd-pipeline` |

### Supabase Skills (Infrastructure)

| Skill | Triggers | Description |
|-------|----------|-------------|
| `supabase-schema` | schema design | Database schema patterns |
| `supabase-create-migration` | migrations | Creating database migrations |
| `supabase-seeding` | seed data | Database seeding |
| `supabase-create-db-functions` | DB functions | PostgreSQL functions |
| `supabase-postgres-sql-style-guide` | SQL style | SQL conventions |
| `supabase-auth` | authentication | Auth patterns |
| `supabase-create-rls-policies` | RLS, security | Row-level security |
| `supabase-cli` | CLI, Supabase | CLI commands |
| `writing-supabase-edge-functions` | edge functions | Deno edge functions |
| `ai-Realtime-assistant-` | realtime, AI | AI + Realtime patterns |
| `test-supabase` | testing | Supabase testing |

---

## Usage Notes

1. **Rendering**: Use Mermaid Live Editor (https://mermaid.live) to test diagrams
2. **Updates**: When PRD changes, update affected diagrams first
3. **Tasks**: Generate tasks only from diagram behaviors
4. **Validation**: Each diagram should have clear inputs/outputs

---

*Generated by Claude Code — 2026-02-02*
