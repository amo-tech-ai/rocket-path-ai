# Onboarding System Diagrams

## Database Entity Relationship

```mermaid
erDiagram
    profiles ||--o| wizard_sessions : "creates"
    wizard_sessions ||--o| startups : "generates"
    startups ||--o{ tasks : "has"
    organizations ||--o{ startups : "owns"
    organizations ||--o{ profiles : "has"

    profiles {
        uuid id PK
        uuid org_id FK
        text full_name
        text email
        text avatar_url
        timestamp created_at
    }

    wizard_sessions {
        uuid id PK
        uuid user_id FK
        uuid startup_id FK
        integer current_step
        text status
        jsonb form_data
        jsonb ai_extractions
        jsonb extracted_traction
        jsonb extracted_funding
        integer profile_strength
        timestamp started_at
        timestamp completed_at
    }

    startups {
        uuid id PK
        uuid org_id FK
        text name
        text description
        text tagline
        text industry
        text stage
        text website_url
        text[] business_model
        text[] target_customers
        text[] key_features
        jsonb traction_data
        boolean is_raising
        numeric raise_amount
        integer profile_strength
    }

    tasks {
        uuid id PK
        uuid startup_id FK
        uuid project_id FK
        text title
        text description
        text category
        text priority
        text status
        boolean ai_generated
        text ai_source
        timestamp due_at
    }

    organizations {
        uuid id PK
        text name
        text slug
    }
```

---

## Edge Function Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React)"]
        OW[OnboardingWizard.tsx]
        S1[Step1Profile.tsx]
        S2[Step2Traction.tsx]
        S3[Step3Review.tsx]
        AP[WizardAIPanel.tsx]
    end

    subgraph Hooks["React Hooks"]
        UWS[useWizardSession]
        UOA[useOnboardingAgent]
    end

    subgraph EdgeFn["Edge Function: onboarding-agent"]
        CS[create_session]
        GS[get_session]
        US[update_session]
        EU[enrich_url]
        EC[enrich_context]
        CW[complete_wizard]
    end

    subgraph AI["Gemini API"]
        PE[ProfileExtractor]
        TG[TaskGenerator]
    end

    subgraph DB["Supabase Database"]
        WS[(wizard_sessions)]
        ST[(startups)]
        TK[(tasks)]
    end

    OW --> UWS
    S1 --> UOA
    S2 --> UWS
    S3 --> UOA
    AP --> UOA

    UWS --> CS
    UWS --> GS
    UWS --> US
    UOA --> EU
    UOA --> EC
    UOA --> CW

    CS --> WS
    GS --> WS
    US --> WS
    EU --> PE
    EC --> PE
    CW --> ST
    CW --> TG
    TG --> TK

    PE --> WS
```

---

## Wizard Data Flow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant OW as OnboardingWizard
    participant UWS as useWizardSession
    participant EF as onboarding-agent
    participant GM as Gemini API
    participant DB as Supabase

    U->>OW: Navigate to /onboarding
    OW->>UWS: Load session
    UWS->>EF: get_session
    EF->>DB: SELECT wizard_sessions
    DB-->>EF: Session data (or null)
    EF-->>UWS: { session, isNew }
    
    alt No session exists
        UWS->>EF: create_session
        EF->>DB: INSERT wizard_sessions
        DB-->>EF: New session
    end

    UWS-->>OW: Session state
    OW->>U: Render Step 1

    U->>OW: Enter URL, click "Extract"
    OW->>EF: enrich_url(url)
    EF->>GM: Gemini URL Context
    GM-->>EF: Extracted profile
    EF->>DB: UPDATE ai_extractions
    EF-->>OW: Extraction results
    OW->>U: Show AI suggestions

    U->>OW: Apply suggestions, Continue
    OW->>EF: update_session(form_data)
    EF->>DB: UPDATE form_data
    OW->>U: Navigate to Step 2

    U->>OW: Enter traction, Continue
    OW->>EF: update_session(traction)
    EF->>DB: UPDATE form_data
    OW->>U: Navigate to Step 3

    U->>OW: Click "Complete Setup"
    OW->>EF: complete_wizard
    EF->>DB: INSERT startups
    EF->>GM: Generate tasks
    GM-->>EF: 5 tasks
    EF->>DB: INSERT tasks
    EF->>DB: UPDATE status='completed'
    EF-->>OW: { startup_id, tasks }
    OW->>U: Redirect to /dashboard
```

---

## Wizard Session State Machine

```mermaid
stateDiagram-v2
    [*] --> NoSession: User visits /onboarding

    NoSession --> InProgress: create_session
    
    InProgress --> InProgress: update_session
    InProgress --> InProgress: enrich_url
    InProgress --> InProgress: enrich_context
    
    InProgress --> Completed: complete_wizard
    
    Completed --> [*]: Redirect to /dashboard

    note right of InProgress
        current_step: 1, 2, or 3
        form_data: JSON
        ai_extractions: JSON
    end note

    note right of Completed
        startup_id: UUID
        tasks: 5 generated
        completed_at: timestamp
    end note
```

---

## AI Extraction Flow

```mermaid
flowchart LR
    subgraph Input
        URL[Website URL]
        DESC[Description Text]
    end

    subgraph EdgeFunction["onboarding-agent"]
        EU[enrich_url]
        EC[enrich_context]
    end

    subgraph Gemini["Gemini API"]
        UC[URL Context Tool]
        SO[Structured Output]
    end

    subgraph Output["Extracted Data"]
        CN[Company Name]
        IN[Industry]
        DS[Description]
        FT[Features]
        ST[Stage]
        CF[Confidence %]
    end

    URL --> EU
    EU --> UC
    UC --> SO
    
    DESC --> EC
    EC --> SO
    
    SO --> CN
    SO --> IN
    SO --> DS
    SO --> FT
    SO --> ST
    SO --> CF
```

---

## Task Generation Flow

```mermaid
flowchart TB
    subgraph Input["Startup Context"]
        S1D[Step 1: Profile]
        S2D[Step 2: Traction]
    end

    subgraph complete_wizard["complete_wizard Action"]
        VAL[Validate session]
        SAVE[Save to startups]
        GEN[Generate tasks]
        INS[Insert tasks]
        MARK[Mark completed]
    end

    subgraph Gemini["Gemini TaskGenerator"]
        PROMPT[Task prompt]
        SCHEMA[Structured schema]
        TASKS[5 tasks output]
    end

    subgraph DB["Database"]
        ST[(startups)]
        TK[(tasks)]
        WS[(wizard_sessions)]
    end

    S1D --> VAL
    S2D --> VAL
    VAL --> SAVE
    SAVE --> ST
    SAVE --> GEN
    GEN --> PROMPT
    PROMPT --> SCHEMA
    SCHEMA --> TASKS
    TASKS --> INS
    INS --> TK
    INS --> MARK
    MARK --> WS
```

---

## Component Hierarchy

```mermaid
flowchart TB
    subgraph Pages
        OW[OnboardingWizard]
    end

    subgraph Layout
        WL[WizardLayout]
    end

    subgraph LeftPanel["Left Panel (256px)"]
        SP[StepProgress]
    end

    subgraph MainPanel["Main Panel (flex)"]
        S1[Step1Profile]
        S2[Step2Traction]
        S3[Step3Review]
    end

    subgraph RightPanel["Right Panel (320px)"]
        WAP[WizardAIPanel]
        ED[ExtractionDisplay]
        TP[TaskPreview]
    end

    subgraph Hooks
        UWS[useWizardSession]
        UOA[useOnboardingAgent]
    end

    OW --> WL
    WL --> SP
    WL --> S1
    WL --> S2
    WL --> S3
    WL --> WAP

    WAP --> ED
    WAP --> TP

    S1 --> UWS
    S1 --> UOA
    S2 --> UWS
    S3 --> UWS
    S3 --> UOA
    WAP --> UOA
```

---

## Dashboard Redirect Logic

```mermaid
flowchart TB
    START[User navigates to /dashboard]
    
    CHECK{Check wizard_sessions}
    
    COMPLETE{status === 'completed'<br/>AND startup_id !== null}
    
    LOAD[Load dashboard data]
    REDIRECT[Redirect to /onboarding]
    SHOW[Show Dashboard]

    START --> CHECK
    CHECK --> COMPLETE
    COMPLETE -->|Yes| LOAD
    COMPLETE -->|No| REDIRECT
    LOAD --> SHOW
```

---

## Wizard Redirect Logic

```mermaid
flowchart TB
    START[User navigates to /onboarding]
    
    CHECK{Check wizard_sessions}
    
    COMPLETE{status === 'completed'}
    
    SHOW[Show Wizard]
    REDIRECT[Redirect to /dashboard]

    START --> CHECK
    CHECK --> COMPLETE
    COMPLETE -->|Yes| REDIRECT
    COMPLETE -->|No| SHOW
```
