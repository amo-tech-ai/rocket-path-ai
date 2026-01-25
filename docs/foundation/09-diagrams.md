# Onboarding Wizard - Mermaid Diagrams

**Purpose:** Visual diagrams for onboarding wizard architecture, flow, and data model  
**Format:** Mermaid diagrams (render in Markdown)  
**Status:** Production-ready  
**Current Lovable Build:** `/home/sk/startupai16L/` (source of truth)

**Repository Status:**
- **Lovable Build:** `/home/sk/startupai16L/` - Current production build
- **Edge Function:** `supabase/functions/onboarding-agent/index.ts`
- **Database:** `wizard_sessions` table (6 migrations in startupai16L, 30 in startupai16)

---

## 1. User Journey - 4-Step Wizard Flow

```mermaid
journey
    title Onboarding Wizard User Journey
    section Step 1: Context
      Enter company info: 5: User
      Enter website URL: 5: User
      Click "Enrich": 4: User
      AI extracts data: 5: System
      Review AI suggestions: 4: User
      Add founders: 5: User
      Validate form: 4: System
    section Step 2: Analysis
      View AI analysis: 5: User
      See readiness score: 5: User
      Review competitors: 4: User
      Check signals: 4: User
    section Step 3: Interview
      Answer question 1: 5: User
      Answer question 2: 5: User
      Answer question 3: 5: User
      Answer question 4: 5: User
      Answer question 5: 5: User
      AI extracts signals: 5: System
    section Step 4: Review
      View investor score: 5: User
      Read AI summary: 5: User
      Review traction/funding: 5: User
      Complete setup: 5: User
      Redirect to dashboard: 5: System
```

---

## 2. Sequence Diagram - AI Enrichment Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant EdgeFunction
    participant Gemini
    participant Database

    User->>Frontend: Enter URL + Click "Enrich"
    Frontend->>EdgeFunction: POST enrich_url (session_id, url)
    EdgeFunction->>Database: Verify session ownership
    EdgeFunction->>Gemini: GenerateContent (URL Context + Google Search)
    alt Success
        Gemini-->>EdgeFunction: Extracted data (JSON)
        EdgeFunction->>Database: Update wizard_sessions.ai_extractions
        EdgeFunction-->>Frontend: Return extractions
        Frontend->>Frontend: Update local state
        Frontend->>User: Display AI suggestions
        alt Mobile (right panel hidden)
            Frontend->>User: Show toast notification
        end
    else Model 404
        EdgeFunction->>Gemini: Fallback to gemini-1.5-flash or gemini-2.0-flash
        Gemini-->>EdgeFunction: Extracted data (JSON)
        EdgeFunction->>Database: Update wizard_sessions.ai_extractions
        EdgeFunction-->>Frontend: Return extractions
    else URL Error (403/404/timeout)
        EdgeFunction-->>Frontend: Return error with manual_fallback: true
        Frontend->>User: Show error + "Manual Entry" button
    end
```

---

## 3. Sequence Diagram - Answer Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant EdgeFunction
    participant Database

    User->>Frontend: Select answer + Click "Continue"
    Frontend->>EdgeFunction: POST process_answer (question_id, answer_id)
    EdgeFunction->>Database: Load current session
    EdgeFunction->>EdgeFunction: Map answer to traction/funding/team/pmf
    Note over EdgeFunction: q1_traction:a1 → mrr_range:"pre_revenue"<br/>q2_users:a2 → users_range:"0_100"<br/>q3_fundraising:a2 → is_raising:true<br/>q4_team:a2 → team_size:"2_3"<br/>q5_pmf:a2 → pmf_stage:"early_signals"
    EdgeFunction->>EdgeFunction: Deduplicate signals array
    EdgeFunction->>EdgeFunction: Limit signals to 20 unique
    Note over EdgeFunction,Database: ATOMIC TRANSACTION via RPC function
    EdgeFunction->>Database: Call process_answer_atomic() RPC
    Note over Database: Single transaction updates:<br/>- form_data.extracted_traction<br/>- form_data.extracted_funding<br/>- form_data.team_size<br/>- form_data.pmf_stage<br/>- column-level extracted_traction<br/>- column-level extracted_funding<br/>- signals array (deduplicated, max 20)<br/>- interview_answers array
    alt Transaction Success
        EdgeFunction->>Database: Commit transaction
        EdgeFunction-->>Frontend: Return signals + extracted data
        Frontend->>Frontend: Update local state
        Frontend->>User: Show next question
    else Transaction Failure
        EdgeFunction->>Database: Rollback transaction
        EdgeFunction-->>Frontend: Return error (no partial state)
        Frontend->>User: Show error message
    end
```

---

## 4. State Diagram - Wizard Steps

```mermaid
stateDiagram-v2
    [*] --> Step1: Start wizard
    Step1 --> Step1: Fill form / Enrich URL
    Step1 --> Step2: Valid form + Next
    Step2 --> Step2: View analysis / Recalculate
    Step2 --> Step3: Next
    Step3 --> Step3: Answer questions
    Step3 --> Step4: All 5 questions answered
    Step4 --> Step4: Review / Calculate score
    Step4 --> Complete: Click "Complete Setup"
    Complete --> [*]: Redirect to dashboard
    Step1 --> [*]: Abandon
    Step2 --> [*]: Abandon
    Step3 --> [*]: Abandon
    Step4 --> [*]: Abandon
```

---

## 5. C4 Container Diagram - Architecture

```mermaid
C4Container
    title Onboarding Wizard Architecture
    
    Person(user, "User")
    
    Container_Boundary(frontend, "Frontend") {
        Container(react, "React App", "TypeScript, Vite")
        Container(hooks, "React Hooks", "useWizardSession, useOnboardingAgent")
    }
    
    Container_Boundary(backend, "Backend") {
        Container(edge, "Edge Function", "onboarding-agent, Deno")
        ContainerDb(supabase, "Supabase", "PostgreSQL + RLS")
    }
    
    System_Ext(gemini, "Gemini 3 Flash Preview API", "Google AI (primary: gemini-3-flash-preview, fallback: gemini-2.0-flash, gemini-1.5-flash)")
    
    Rel(user, react, "Uses")
    Rel(react, hooks, "Uses")
    Rel(hooks, edge, "API calls")
    Rel(edge, supabase, "Reads/Writes")
    Rel(edge, gemini, "AI processing")
    Rel(supabase, react, "Real-time updates")
```

---

## 6. ER Diagram - Wizard Sessions Data Model

```mermaid
erDiagram
    WIZARD_SESSIONS ||--o{ STARTUPS : creates
    WIZARD_SESSIONS }o--|| PROFILES : belongs_to
    
    WIZARD_SESSIONS {
        uuid id PK
        uuid user_id FK
        uuid startup_id FK
        integer current_step
        text status
        jsonb form_data
        jsonb ai_extractions
        jsonb interview_answers
        jsonb extracted_traction
        jsonb extracted_funding
        text_array signals
        jsonb diagnostic_answers
        integer interview_progress
        integer profile_strength
        integer enrichment_confidence
        text_array enrichment_sources
        uuid industry_pack_id FK
        timestamptz started_at
        timestamptz completed_at
        timestamptz last_activity_at
        timestamptz created_at
    }
    
    STARTUPS {
        uuid id PK
        uuid organization_id FK
        text name
        jsonb profile_data
    }
    
    PROFILES {
        uuid id PK
        text email
    }
```

---

## 7. Flowchart - Complete Wizard Flow

```mermaid
flowchart TD
    Start([User starts wizard]) --> Step1[Step 1: Context Collection]
    Step1 --> FillForm[Fill company info]
    FillForm --> EnrichURL{Enrich URL?}
    EnrichURL -->|Yes| AIExtract[AI extracts data]
    EnrichURL -->|No| Validate1{Form valid?}
    AIExtract --> Validate1
    Validate1 -->|No| FillForm
    Validate1 -->|Yes| Step2[Step 2: AI Analysis]
    
    Step2 --> CalculateScore[Calculate readiness score]
    CalculateScore --> DisplayAnalysis[Display analysis cards]
    DisplayAnalysis --> Step3[Step 3: Interview]
    
    Step3 --> LoadQuestions[Load 5 questions]
    LoadQuestions --> ShowQuestion[Show question]
    ShowQuestion --> AnswerQuestion[User answers]
    AnswerQuestion --> ProcessAnswer[Process answer]
    ProcessAnswer --> ExtractData[Extract signals/traction/funding]
    ExtractData --> SaveAnswer[Save to database]
    SaveAnswer --> MoreQuestions{More questions?}
    MoreQuestions -->|Yes| ShowQuestion
    MoreQuestions -->|No| Step4[Step 4: Review]
    
    Step4 --> CalculateInvestor[Calculate investor score]
    CalculateInvestor --> GenerateSummary[Generate AI summary]
    GenerateSummary --> DisplayReview[Display review]
    DisplayReview --> Complete{Complete?}
    Complete -->|Yes| CreateStartup[Create startup + org]
    Complete -->|No| DisplayReview
    CreateStartup --> Dashboard([Redirect to dashboard])
```

---

## 8. Sequence Diagram - Complete Wizard Flow

```mermaid
sequenceDiagram
    participant User
    participant Step1
    participant Step2
    participant Step3
    participant Step4
    participant EdgeFunction
    participant Database

    User->>Step1: Enter company info
    Step1->>EdgeFunction: enrich_url
    EdgeFunction->>Database: Save extractions
    Step1->>Step2: Next (valid form)
    
    Step2->>EdgeFunction: calculate_readiness
    EdgeFunction->>Database: Save readiness_score
    Step2->>Step3: Next
    
    Step3->>EdgeFunction: get_questions
    EdgeFunction-->>Step3: 5 questions
    loop 5 times
        Step3->>EdgeFunction: process_answer
        EdgeFunction->>Database: Save answer + extract data
    end
    Step3->>Step4: Next (all answered)
    
    Step4->>EdgeFunction: calculate_score
    Step4->>EdgeFunction: generate_summary
    EdgeFunction->>Database: Save scores
    Step4->>EdgeFunction: complete_wizard
    EdgeFunction->>Gemini: Generate tasks (first, to get task data)
    Gemini-->>EdgeFunction: Return tasks array
    Note over EdgeFunction,Database: ATOMIC TRANSACTION via RPC function
    EdgeFunction->>Database: Call complete_wizard_atomic() RPC
    Note over Database: Single transaction:<br/>- Create organization (if needed)<br/>- Create startup<br/>- Update wizard_sessions (status=completed)<br/>- Create tasks (all in one transaction)
    alt All Success
        Note over Database: RPC function commits transaction automatically
        EdgeFunction-->>Step4: Return success (startup_id, org_id, tasks_created)
        Step4->>User: Redirect to dashboard
    else Task Generation Fails
        Note over EdgeFunction: If Gemini fails, pass empty tasks array
        EdgeFunction->>Database: Call complete_wizard_atomic() with empty tasks
        Note over Database: Startup/org still created (tasks optional)
        EdgeFunction-->>Step4: Return success (startup/org created, tasks_created: 0)
        Step4->>User: Redirect to dashboard
    else Startup/Org Creation Fails
        Note over Database: RPC function automatically rolls back
        EdgeFunction-->>Step4: Return error (all changes rolled back)
        Step4->>User: Show error + retry option
    end
```

---

## 9. State Diagram - Data Persistence States

```mermaid
stateDiagram-v2
    [*] --> Empty: New session
    Empty --> AutoSaving: User types
    AutoSaving --> Saved: Debounced save
    Saved --> AutoSaving: User types again
    AutoSaving --> Saving: Manual save
    Saving --> Saved: Save complete
    Saved --> Loading: Page refresh
    Loading --> Saved: Load complete
    Saved --> [*]: Session complete
```

---

## 10. Flowchart - process_answer Logic

```mermaid
flowchart TD
    Start([process_answer called]) --> LoadSession[Load current session]
    LoadSession --> GetAnswer[Get question_id + answer_id]
    GetAnswer --> CheckQuestion{Question type?}
    
    CheckQuestion -->|q1_traction| MapMRR[Map to mrr_range]
    CheckQuestion -->|q2_users| MapUsers[Map to users_range]
    CheckQuestion -->|q3_fundraising| MapFunding[Map to is_raising + status]
    CheckQuestion -->|q4_team| ExtractTeam[Extract team signals + team_size]
    CheckQuestion -->|q5_pmf| ExtractPMF[Extract PMF signals + pmf_stage]
    
    MapMRR --> MergeData[Merge with existing extracted_traction]
    MapUsers --> MergeData
    MapFunding --> MergeFunding[Merge with existing extracted_funding]
    ExtractTeam --> UpdateTeam[Update signals + form_data.team_size]
    ExtractPMF --> UpdatePMF[Update signals + form_data.pmf_stage]
    
    MergeData --> DeduplicateSignals[Deduplicate signals: [...new Set(signals)]]
    MergeFunding --> DeduplicateSignals
    UpdateTeam --> DeduplicateSignals
    UpdatePMF --> DeduplicateSignals
    
    DeduplicateSignals --> CheckLimit{Signals > 20?}
    CheckLimit -->|Yes| TrimSignals[Keep first 20 unique signals]
    CheckLimit -->|No| BeginTransaction[Begin atomic transaction]
    TrimSignals --> BeginTransaction
    
    BeginTransaction --> CallRPC[Call process_answer_atomic() RPC function]
    Note over CallRPC: RPC function handles all updates in single transaction
    CallRPC --> SaveBoth[Save to form_data AND column-level (atomic)]
    SaveBoth --> SaveTeamPMF[Save team_size and pmf_stage to form_data]
    SaveTeamPMF --> SaveAnswers[Save to interview_answers array]
    SaveAnswers --> CommitTransaction{RPC transaction success?}
    CommitTransaction -->|Yes| Return([Return success + data])
    CommitTransaction -->|No| RollbackTransaction[RPC automatically rolls back]
    RollbackTransaction --> ReturnError([Return error - no partial state])
```

---

## Diagram Summary

| Diagram | Purpose | Use Case |
|---------|---------|----------|
| **User Journey** | User experience flow | UX planning, user satisfaction |
| **Sequence (Enrichment)** | AI enrichment flow | Debugging URL enrichment, error handling |
| **Sequence (Answer)** | Answer processing flow | Debugging traction/funding/team/pmf extraction, transaction safety |
| **State (Steps)** | Wizard navigation | Navigation logic |
| **C4 Container** | System architecture | High-level architecture docs |
| **ER Diagram** | Data model | Database schema reference |
| **Flowchart (Complete)** | End-to-end flow | Complete workflow visualization |
| **Sequence (Complete)** | Full wizard sequence | Integration testing, atomicity verification |
| **State (Persistence)** | Data save states | Auto-save debugging |
| **Flowchart (process_answer)** | Answer mapping logic | Debugging extraction, Q4/Q5 logic, signal deduplication |

## Critical Implementation Notes

### Transaction Safety
- **All dual saves** (form_data + column-level) MUST use atomic transactions
- **complete_wizard** MUST use transaction for all 3 steps (startup, org, tasks)
- **Rollback on failure** - never leave partial state

### Signal Management
- **Deduplication:** `signals = [...new Set(signals)]` before saving
- **Limit:** Maximum 20 unique signals to prevent overflow
- **Applied:** On every `process_answer` call

### Error Handling
- **Model 404:** Fallback to `gemini-1.5-flash` or `gemini-2.0-flash`
- **URL 403/404:** Return error with `manual_fallback: true`
- **Transaction failure:** Rollback all changes, return error

### Mobile UX
- **Toast notifications:** Required when right panel hidden and AI completes
- **Error feedback:** Show manual fallback button on mobile

---

*Diagrams created: 2026-01-25*  
*Status: Production-ready*  
*Render: Use Mermaid-compatible Markdown viewer*

---

## Quick Reference

**Database:** `wizard_sessions` table with `form_data`, `ai_extractions`, `interview_answers`, `extracted_traction`, `extracted_funding`, `signals`  
**Edge Function:** `onboarding-agent` with 11 actions (enrich_url, calculate_readiness, process_answer, etc.)  
**AI Model:** `gemini-3-flash-preview` (fallback: gemini-2.0-flash)  
**Questions:** 5 questions (q1_traction, q2_users, q3_fundraising, q4_team, q5_pmf)  
**Transactions:** Use atomic RPC functions for dual saves (form_data + column-level)
