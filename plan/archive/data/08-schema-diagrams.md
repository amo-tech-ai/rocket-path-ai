# Database Schema & Data Flow Diagrams

> **Updated:** 2026-02-02 | **Tables:** 60+ | **Relationships:** 150+

---

## Executive Summary

This document provides comprehensive Entity Relationship Diagrams (ERD) and Data Flow Diagrams (DFD) for the StartupAI database schema. The architecture follows a multi-tenant model with organization-based isolation.

### Schema Statistics

| Metric | Count |
|--------|-------|
| Total Tables | 60+ |
| Core Tables | 8 |
| Domain Tables | 35 |
| Supporting Tables | 17 |
| Views | 3 |
| Foreign Keys | 150+ |

---

## Entity Relationship Diagrams

### 1. Core Domain ERD

The foundational tables that all other domains depend on.

```mermaid
erDiagram
    organizations ||--o{ profiles : "has members"
    organizations ||--o{ startups : "owns"
    organizations ||--o{ org_members : "has"
    organizations ||--o{ agent_configs : "configures"

    profiles ||--o{ org_members : "belongs to"
    profiles ||--o{ notifications : "receives"
    profiles ||--o{ user_roles : "has"
    profiles ||--o{ chat_sessions : "owns"

    startups ||--o{ projects : "contains"
    startups ||--o{ tasks : "has"
    startups ||--o{ contacts : "manages"
    startups ||--o{ deals : "tracks"
    startups ||--o{ documents : "stores"
    startups ||--o{ activities : "logs"

    organizations {
        uuid id PK
        string name
        string slug UK
        string subscription_tier
        string subscription_status
        jsonb settings
    }

    profiles {
        uuid id PK
        uuid org_id FK
        string email UK
        string full_name
        string role
        boolean onboarding_completed
    }

    startups {
        uuid id PK
        uuid org_id FK
        string name
        string industry
        string stage
        string description
        number profile_strength
        number investor_ready_score
    }

    org_members {
        uuid id PK
        uuid org_id FK
        uuid user_id FK
        string role
        string status
    }
```

### 2. Project & Task Domain ERD

Project management and task tracking relationships.

```mermaid
erDiagram
    startups ||--o{ projects : "contains"
    projects ||--o{ tasks : "has"
    tasks ||--o{ tasks : "subtasks"
    tasks }o--|| contacts : "linked to"
    tasks }o--|| deals : "related to"
    profiles ||--o{ tasks : "assigned to"
    profiles ||--o{ tasks : "created by"

    projects {
        uuid id PK
        uuid startup_id FK
        uuid owner_id FK
        string name
        string description
        string status
        number progress
        string health
        date start_date
        date end_date
    }

    tasks {
        uuid id PK
        uuid startup_id FK
        uuid project_id FK
        uuid assigned_to FK
        uuid created_by FK
        uuid parent_task_id FK
        uuid contact_id FK
        uuid deal_id FK
        string title
        string description
        string status
        string priority
        string category
        string phase
        timestamp due_at
        timestamp completed_at
        boolean ai_generated
    }
```

### 3. CRM Domain ERD

Customer relationship management entities.

```mermaid
erDiagram
    startups ||--o{ contacts : "manages"
    startups ||--o{ deals : "tracks"
    contacts ||--o{ deals : "associated with"
    contacts ||--o{ communications : "has"
    contacts ||--o{ contact_tags : "tagged with"
    contacts ||--o{ contacts : "referred by"
    deals ||--o{ communications : "involves"
    profiles ||--o{ communications : "created by"

    contacts {
        uuid id PK
        uuid startup_id FK
        uuid referred_by FK
        string name
        string email
        string phone
        string company
        string title
        string type
        string source
        string relationship_strength
        timestamp last_contacted_at
        text ai_summary
    }

    deals {
        uuid id PK
        uuid startup_id FK
        uuid contact_id FK
        string name
        number amount
        string currency
        string stage
        string type
        number probability
        number ai_score
        jsonb ai_insights
        date expected_close
    }

    communications {
        uuid id PK
        uuid startup_id FK
        uuid contact_id FK
        uuid deal_id FK
        uuid created_by FK
        string type
        string direction
        string subject
        text content
        text summary
        string sentiment
        timestamp occurred_at
    }

    contact_tags {
        uuid id PK
        uuid contact_id FK
        string tag
        string color
    }
```

### 4. Documents Domain ERD

Document management including Lean Canvas and Pitch Decks.

```mermaid
erDiagram
    startups ||--o{ documents : "owns"
    startups ||--o{ lean_canvases : "has"
    startups ||--o{ pitch_decks : "creates"
    documents ||--o{ document_versions : "has versions"
    pitch_decks ||--o{ pitch_deck_slides : "contains"
    wizard_sessions ||--o{ documents : "generates"
    profiles ||--o{ documents : "created by"
    playbook_runs ||--o{ lean_canvases : "generates"
    playbook_runs ||--o{ pitch_decks : "generates"

    documents {
        uuid id PK
        uuid startup_id FK
        uuid created_by FK
        uuid wizard_session_id FK
        string title
        string type
        text content
        jsonb content_json
        string status
        number version
        boolean ai_generated
    }

    lean_canvases {
        uuid id PK
        uuid startup_id FK
        uuid playbook_run_id FK
        text problem
        text solution
        text unique_value_proposition
        text unfair_advantage
        text customer_segments
        text channels
        text revenue_streams
        text cost_structure
        text key_metrics
        number validation_score
        number completeness_score
        boolean is_current
    }

    pitch_decks {
        uuid id PK
        uuid startup_id FK
        uuid playbook_run_id FK
        string title
        string template
        string theme
        string status
        number slide_count
        number signal_strength
        jsonb wizard_data
        jsonb signal_breakdown
    }

    pitch_deck_slides {
        uuid id PK
        uuid deck_id FK
        number slide_number
        string slide_type
        string title
        string subtitle
        jsonb content
        string layout
        string image_url
    }

    document_versions {
        uuid id PK
        uuid document_id FK
        number version_number
        jsonb content_json
        string label
    }
```

### 5. AI & Chat Domain ERD

AI operations, chat sessions, and agent configurations.

```mermaid
erDiagram
    profiles ||--o{ chat_sessions : "owns"
    startups ||--o{ chat_sessions : "context"
    chat_sessions ||--o{ chat_messages : "contains"
    chat_messages ||--o{ ai_runs : "tracked by"
    chat_messages ||--o{ chat_facts : "extracts"
    chat_messages ||--o{ chat_pending : "suggests"
    organizations ||--o{ ai_runs : "billed to"
    organizations ||--o{ agent_configs : "configures"
    profiles ||--o{ ai_runs : "initiated by"
    startups ||--o{ ai_runs : "context"

    chat_sessions {
        uuid id PK
        uuid user_id FK
        uuid startup_id FK
        string title
        text summary
        number message_count
        jsonb context_snapshot
        timestamp started_at
        timestamp ended_at
    }

    chat_messages {
        uuid id PK
        uuid session_id FK
        uuid user_id FK
        uuid ai_run_id FK
        string role
        text content
        string tab
        jsonb routing
        jsonb sources
        jsonb suggested_actions
    }

    ai_runs {
        uuid id PK
        uuid org_id FK
        uuid user_id FK
        uuid startup_id FK
        string agent_name
        string action
        string model
        string provider
        string status
        number input_tokens
        number output_tokens
        number thinking_tokens
        number cost_usd
        number duration_ms
    }

    agent_configs {
        uuid id PK
        uuid org_id FK
        string agent_name UK
        string display_name
        string model
        number temperature
        text system_prompt
        boolean is_active
        number max_cost_per_run
        number daily_budget
    }

    chat_facts {
        uuid id PK
        uuid user_id FK
        uuid startup_id FK
        uuid source_message_id FK
        string fact_type
        text content
        number confidence
    }
```

### 6. Events Domain ERD

Event management for conferences, meetings, and hosted events.

```mermaid
erDiagram
    startups ||--o{ events : "organizes"
    events ||--o{ event_attendees : "has"
    events ||--o{ event_venues : "held at"
    events ||--o{ event_assets : "contains"
    contacts ||--o{ event_attendees : "linked to"
    industry_events ||--o{ event_speakers : "features"
    profiles ||--o{ user_event_tracking : "tracks"
    industry_events ||--o{ user_event_tracking : "tracked"

    events {
        uuid id PK
        uuid startup_id FK
        uuid created_by FK
        string name
        string event_type
        string event_scope
        string location_type
        text description
        timestamp start_date
        timestamp end_date
        number capacity
        number budget
        string status
    }

    event_attendees {
        uuid id PK
        uuid event_id FK
        uuid contact_id FK
        string name
        string email
        string company
        string attendee_type
        string rsvp_status
        boolean checked_in
        timestamp checked_in_at
        string ticket_type
    }

    event_venues {
        uuid id PK
        uuid event_id FK
        string name
        string address
        string city
        number capacity
        number rental_cost
        string status
        boolean is_primary
    }

    event_assets {
        uuid id PK
        uuid event_id FK
        string name
        string asset_type
        string platform
        string status
        string media_url
        text content
        boolean ai_generated
    }
```

### 7. Validation & Playbook Domain ERD

Startup validation workflows and playbook execution.

```mermaid
erDiagram
    startups ||--o{ validation_runs : "validates"
    organizations ||--o{ validation_runs : "owns"
    validation_runs ||--o{ validation_reports : "produces"
    validation_runs ||--o{ validation_verdicts : "receives"
    startups ||--o{ playbook_runs : "executes"
    playbook_runs ||--o{ lean_canvases : "generates"
    playbook_runs ||--o{ pitch_decks : "generates"
    prompt_pack_runs ||--o{ validation_runs : "triggers"

    validation_runs {
        uuid id PK
        uuid startup_id FK
        uuid org_id FK
        uuid pack_run_id FK
        string validation_type
        string status
        text results_summary
        timestamp started_at
        timestamp completed_at
    }

    validation_reports {
        uuid id PK
        uuid run_id FK
        string report_type
        number score
        text summary
        array key_findings
        jsonb details
    }

    validation_verdicts {
        uuid id PK
        uuid run_id FK
        string critic_id
        string verdict
        text feedback
        string risk_level
        jsonb suggestions
    }

    playbook_runs {
        uuid id PK
        uuid startup_id FK
        string playbook_type
        string status
        number current_step
        number total_steps
        jsonb step_data
        timestamp started_at
        timestamp completed_at
    }
```

### 8. Wizard & Onboarding Domain ERD

Onboarding wizard sessions and data extraction.

```mermaid
erDiagram
    profiles ||--o{ wizard_sessions : "owns"
    startups ||--o{ wizard_sessions : "created from"
    wizard_sessions ||--o{ wizard_extractions : "extracts"
    wizard_sessions ||--o{ documents : "generates"
    ai_runs ||--o{ wizard_extractions : "powers"

    wizard_sessions {
        uuid id PK
        uuid user_id FK
        uuid startup_id FK
        string status
        number current_step
        jsonb form_data
        jsonb ai_extractions
        jsonb ai_enrichments
        jsonb ai_summary
        number profile_strength
        number investor_score
        timestamp started_at
        timestamp completed_at
    }

    wizard_extractions {
        uuid id PK
        uuid session_id FK
        uuid ai_run_id FK
        string extraction_type
        string source_url
        jsonb extracted_data
        number confidence
        text raw_content
    }

    onboarding_questions {
        string id PK
        string topic
        string type
        text text
        text why_matters
        jsonb options
        number display_order
        boolean is_active
    }
```

---

## Data Flow Diagrams

### 1. User Onboarding Flow

```mermaid
flowchart TD
    subgraph USER_INPUT["User Input"]
        A[User Signs Up] --> B[Enter Website URL]
        B --> C[Confirm Industry]
        C --> D[Add Team Members]
        D --> E[Enter Traction Data]
    end

    subgraph AI_PROCESSING["AI Processing"]
        B --> F[Website Extraction]
        F --> G[Gemini 3 Flash]
        G --> H[Extract Company Data]
        H --> I[Research Industry]
        I --> J[Calculate Scores]
    end

    subgraph DATA_STORAGE["Data Storage"]
        J --> K[(wizard_sessions)]
        K --> L[(startups)]
        L --> M[(profiles)]
        K --> N[(wizard_extractions)]
        J --> O[(ai_runs)]
    end

    subgraph POST_PROCESSING["Post-Processing"]
        L --> P[Generate Lean Canvas]
        P --> Q[(lean_canvases)]
        L --> R[Create Initial Tasks]
        R --> S[(tasks)]
        L --> T[Compute Daily Focus]
    end

    E --> K
    M --> U([Dashboard Ready])
    Q --> U
    S --> U
```

### 2. AI Chat Message Flow

```mermaid
flowchart TD
    subgraph USER["User"]
        A[Send Message] --> B{Select Tab}
    end

    subgraph ROUTING["Message Routing"]
        B -->|General| C[General Chat]
        B -->|Strategy| D[Strategy Assistant]
        B -->|Research| E[Research Mode]
    end

    subgraph CONTEXT["Context Assembly"]
        C --> F[Load Session Context]
        D --> F
        E --> F
        F --> G[Load Startup Context]
        G --> H[Load Recent Messages]
        H --> I[Assemble Prompt]
    end

    subgraph AI["AI Processing"]
        I --> J{Route to Model}
        J -->|Fast| K[Gemini 3 Flash]
        J -->|Complex| L[Claude Sonnet]
        J -->|Research| M[Web Search + Gemini]
        K --> N[Generate Response]
        L --> N
        M --> N
    end

    subgraph STORAGE["Data Storage"]
        N --> O[(chat_messages)]
        N --> P[(ai_runs)]
        N --> Q{Extract Facts?}
        Q -->|Yes| R[(chat_facts)]
        N --> S{Suggestions?}
        S -->|Yes| T[(chat_pending)]
    end

    O --> U[Stream to User]
```

### 3. Pitch Deck Generation Flow

```mermaid
flowchart TD
    subgraph WIZARD["Wizard Steps"]
        A[Start Wizard] --> B[Step 1: Company Info]
        B --> C[Step 2: Problem & Solution]
        C --> D[Step 3: Market Research]
        D --> E[Step 4: Generate Deck]
    end

    subgraph AI_STEPS["AI Processing"]
        B --> F[Extract from Startup Profile]
        C --> G[AI: Research Industry]
        C --> H[AI: Analyze Competitors]
        D --> I[AI: Market Size Analysis]
        E --> J[AI: Generate All Slides]
    end

    subgraph SLIDE_GENERATION["Slide Generation"]
        J --> K[Title Slide]
        J --> L[Problem Slide]
        J --> M[Solution Slide]
        J --> N[Market Slide]
        J --> O[Business Model Slide]
        J --> P[Traction Slide]
        J --> Q[Team Slide]
        J --> R[Financial Slide]
        J --> S[Ask Slide]
    end

    subgraph IMAGE_GEN["Visual Generation"]
        K --> T[Generate Images]
        L --> T
        M --> T
        N --> T
        O --> T
        T --> U[Gemini 3 Image]
    end

    subgraph STORAGE["Data Storage"]
        J --> V[(pitch_decks)]
        K --> W[(pitch_deck_slides)]
        L --> W
        M --> W
        N --> W
        O --> W
        P --> W
        Q --> W
        R --> W
        S --> W
        U --> W
    end

    W --> X[Calculate Signal Strength]
    X --> Y([Deck Ready for Review])
```

### 4. CRM Workflow Flow

```mermaid
flowchart TD
    subgraph TRIGGER["Triggers"]
        A[Contact Created] --> B[workflow-trigger]
        C[Deal Stage Changed] --> B
        D[Communication Logged] --> B
    end

    subgraph ROUTING["Event Routing"]
        B --> E{Event Type}
        E -->|contact.created| F[Contact Workflow]
        E -->|deal.updated| G[Deal Workflow]
        E -->|communication.created| H[Communication Workflow]
    end

    subgraph CONTACT_WF["Contact Workflow"]
        F --> I[Enrich Contact Data]
        I --> J[Calculate Relationship Score]
        J --> K[Generate AI Summary]
        K --> L[Create Follow-up Task]
    end

    subgraph DEAL_WF["Deal Workflow"]
        G --> M[Calculate AI Score]
        M --> N[Update Pipeline Metrics]
        N --> O[Check Win Probability]
        O --> P{High Priority?}
        P -->|Yes| Q[Send Notification]
        P -->|No| R[Log Activity]
    end

    subgraph COMM_WF["Communication Workflow"]
        H --> S[Analyze Sentiment]
        S --> T[Extract Action Items]
        T --> U[Update Contact Timeline]
        U --> V{Follow-up Needed?}
        V -->|Yes| W[Create Task]
    end

    subgraph STORAGE["Data Updates"]
        L --> X[(tasks)]
        K --> Y[(contacts)]
        M --> Z[(deals)]
        Q --> AA[(notifications)]
        R --> AB[(activities)]
        W --> X
    end
```

### 5. Validation Run Flow

```mermaid
flowchart TD
    subgraph TRIGGER["Validation Trigger"]
        A[User Requests Validation] --> B[Create Validation Run]
        C[Prompt Pack Complete] --> B
    end

    subgraph INIT["Initialization"]
        B --> D[(validation_runs)]
        D --> E[Load Startup Context]
        E --> F[Load Industry Pack]
        F --> G[Assemble Validation Criteria]
    end

    subgraph VALIDATION["Validation Steps"]
        G --> H{Validation Type}
        H -->|Problem| I[Problem Validation]
        H -->|Market| J[Market Validation]
        H -->|Solution| K[Solution Validation]
        H -->|Full| L[Full Validation]
    end

    subgraph CRITICS["AI Critics"]
        I --> M[Critic 1: Market Fit]
        I --> N[Critic 2: Problem Severity]
        J --> O[Critic 3: Market Size]
        J --> P[Critic 4: Competition]
        K --> Q[Critic 5: Solution Fit]
        L --> M
        L --> N
        L --> O
        L --> P
        L --> Q
    end

    subgraph SCORING["Score Calculation"]
        M --> R[Aggregate Verdicts]
        N --> R
        O --> R
        P --> R
        Q --> R
        R --> S[Calculate Final Score]
        S --> T[Generate Summary]
    end

    subgraph OUTPUT["Results"]
        R --> U[(validation_verdicts)]
        T --> V[(validation_reports)]
        S --> W[Update Startup Score]
        W --> X[(startups)]
    end

    V --> Y([Validation Complete])
```

### 6. Activity Logging Flow

```mermaid
flowchart TD
    subgraph SOURCES["Activity Sources"]
        A[User Action] --> B[Log Activity]
        C[AI Agent Action] --> B
        D[System Event] --> B
        E[Workflow Trigger] --> B
    end

    subgraph ACTIVITY["Activity Processing"]
        B --> F{Activity Type}
        F -->|task_created| G[Task Activity]
        F -->|deal_updated| H[Deal Activity]
        F -->|contact_created| I[Contact Activity]
        F -->|document_created| J[Document Activity]
        F -->|note_added| K[Note Activity]
    end

    subgraph ENRICHMENT["Enrichment"]
        G --> L[Add Entity References]
        H --> L
        I --> L
        J --> L
        K --> L
        L --> M[Set Importance Level]
        M --> N[Add Metadata]
    end

    subgraph STORAGE["Storage"]
        N --> O[(activities)]
        O --> P{Notify User?}
        P -->|Yes| Q[(notifications)]
        P -->|High Importance| R[Push Notification]
    end

    subgraph DISPLAY["Display"]
        O --> S[Activity Feed]
        O --> T[Timeline View]
        O --> U[Dashboard Cards]
    end
```

---

## Table Relationship Summary

### Core Tables Dependency Map

```mermaid
flowchart TB
    subgraph CORE["Core Layer"]
        ORG[organizations]
        PROF[profiles]
        START[startups]
    end

    subgraph DOMAIN["Domain Layer"]
        PROJ[projects]
        TASK[tasks]
        CONT[contacts]
        DEAL[deals]
        DOC[documents]
        LC[lean_canvases]
        PD[pitch_decks]
        EVT[events]
    end

    subgraph AI["AI Layer"]
        CHAT[chat_sessions]
        MSG[chat_messages]
        RUN[ai_runs]
        CFG[agent_configs]
    end

    subgraph SUPPORT["Support Layer"]
        ACT[activities]
        NOT[notifications]
        AUDIT[audit_log]
        VR[validation_runs]
    end

    ORG --> PROF
    ORG --> START
    ORG --> CFG
    ORG --> RUN

    START --> PROJ
    START --> TASK
    START --> CONT
    START --> DEAL
    START --> DOC
    START --> LC
    START --> PD
    START --> EVT
    START --> ACT
    START --> CHAT
    START --> VR

    PROF --> CHAT
    PROF --> MSG
    PROF --> NOT
    PROF --> TASK

    PROJ --> TASK
    CONT --> DEAL
    CONT --> TASK
```

---

## Index Strategy

### Primary Indexes (Automatic)

All tables have primary key indexes on `id` column.

### Foreign Key Indexes

| Table | Index Column | Referenced Table |
|-------|-------------|------------------|
| startups | org_id | organizations |
| profiles | org_id | organizations |
| projects | startup_id | startups |
| tasks | startup_id, project_id | startups, projects |
| contacts | startup_id | startups |
| deals | startup_id, contact_id | startups, contacts |
| documents | startup_id | startups |
| activities | startup_id | startups |
| chat_sessions | user_id, startup_id | profiles, startups |
| ai_runs | org_id, user_id | organizations, profiles |

### Query Optimization Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| tasks | (startup_id, status) | Task list filtering |
| tasks | (assigned_to, status) | User task view |
| contacts | (startup_id, type) | Contact filtering |
| deals | (startup_id, stage) | Pipeline view |
| activities | (startup_id, created_at) | Activity feed |
| chat_messages | (session_id, created_at) | Chat history |
| ai_runs | (created_at) | Cost tracking |

---

*Schema documentation maintained by StartupAI Engineering — Last updated 2026-02-02*
