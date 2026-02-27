# FigJam Diagram Examples

Detailed examples organized by diagram type and common use cases.

## Table of Contents

- [Flowcharts](#flowcharts)
- [Decision Trees](#decision-trees)
- [Gantt Charts](#gantt-charts)
- [Sequence Diagrams](#sequence-diagrams)
- [State Diagrams](#state-diagrams)
- [Startup & Product Use Cases](#startup--product-use-cases)

---

## Flowcharts

### User Onboarding Flow

```mermaid
flowchart LR
  A["Landing Page"] --> B["Sign Up"]
  B --> C{"Email Verified?"}
  C -->|"Yes"| D["Onboarding Wizard"]
  C -->|"No"| E["Resend Email"]
  E --> C
  D --> F["Step 1: Profile"]
  F --> G["Step 2: Business Info"]
  G --> H["Step 3: Goals"]
  H --> I["Dashboard"]
```

### CI/CD Pipeline

```mermaid
flowchart LR
  A["Push to Main"] --> B["Run Tests"]
  B --> C{"Tests Pass?"}
  C -->|"Yes"| D["Build"]
  C -->|"No"| E["Notify Dev"]
  D --> F["Deploy Staging"]
  F --> G{"QA Approved?"}
  G -->|"Yes"| H["Deploy Production"]
  G -->|"No"| E
```

### System Architecture

```mermaid
flowchart LR
  subgraph "Frontend"
    A["React SPA"]
    B["Vite Dev Server"]
  end
  subgraph "Backend"
    C["Supabase Auth"]
    D["Edge Functions"]
    E["PostgreSQL"]
  end
  subgraph "AI Services"
    F["Gemini API"]
    G["Claude API"]
  end
  A --> C
  A --> D
  D --> E
  D --> F
  D --> G
```

### Data Pipeline

```mermaid
flowchart LR
  A["Raw Input"] --> B["Validate"]
  B --> C["Transform"]
  C --> D["Enrich with AI"]
  D --> E{"Quality Check"}
  E -->|"Pass"| F["Store in DB"]
  E -->|"Fail"| G["Error Queue"]
  G --> B
```

---

## Decision Trees

### Feature Prioritization

```mermaid
flowchart TD
  A{"User Impact?"} -->|"High"| B{"Dev Effort?"}
  A -->|"Low"| C["Backlog"]
  B -->|"Low"| D["Do First"]
  B -->|"High"| E{"Revenue Impact?"}
  E -->|"High"| F["Schedule Next Sprint"]
  E -->|"Low"| G["Evaluate Later"]
```

### Bug Triage

```mermaid
flowchart TD
  A{"Severity?"} -->|"Critical"| B["Fix Immediately"]
  A -->|"High"| C{"Workaround Available?"}
  A -->|"Low"| D["Add to Backlog"]
  C -->|"No"| E["Fix This Sprint"]
  C -->|"Yes"| F["Schedule Next Sprint"]
```

### Customer Support Routing

```mermaid
flowchart TD
  A{"Issue Type?"} -->|"Billing"| B["Billing Team"]
  A -->|"Technical"| C{"Account Tier?"}
  A -->|"Feature Request"| D["Product Team"]
  C -->|"Enterprise"| E["Priority Support"]
  C -->|"Free/Pro"| F["Standard Queue"]
```

---

## Gantt Charts

### MVP Launch Plan

```mermaid
gantt
  title MVP Launch Roadmap
  dateFormat YYYY-MM-DD
  section Foundation
  Database Schema         :a1, 2026-02-17, 5d
  Auth System             :a2, after a1, 3d
  API Endpoints           :a3, after a1, 7d
  section Core Features
  Onboarding Wizard       :b1, after a2, 10d
  Dashboard               :b2, after a3, 8d
  AI Integration          :b3, after a3, 12d
  section Launch
  QA Testing              :c1, after b1, 5d
  Beta Launch             :milestone, after c1, 0d
  Iterate on Feedback     :c2, after c1, 14d
```

### Sprint Plan

```mermaid
gantt
  title Sprint 12 - Feb 17 to Mar 2
  dateFormat YYYY-MM-DD
  section Backend
  Validator pipeline fixes  :a1, 2026-02-17, 3d
  Rate limiting middleware   :a2, after a1, 2d
  Edge function deploy       :a3, after a2, 1d
  section Frontend
  Dashboard redesign         :b1, 2026-02-17, 5d
  Chart components           :b2, after b1, 3d
  section Testing
  E2E test suite             :c1, 2026-02-24, 4d
  Performance benchmarks     :c2, after c1, 2d
```

### Product Roadmap (Quarterly)

```mermaid
gantt
  title 2026 Product Roadmap
  dateFormat YYYY-MM-DD
  section Q1
  Core Platform        :2026-01-01, 90d
  Beta Launch          :milestone, 2026-03-01, 0d
  section Q2
  AI Features          :2026-04-01, 60d
  Marketplace          :2026-05-01, 60d
  Public Launch        :milestone, 2026-06-15, 0d
  section Q3
  Enterprise Features  :2026-07-01, 90d
  Scale Infrastructure :2026-08-01, 60d
```

---

## Sequence Diagrams

### OAuth Login Flow

```mermaid
sequenceDiagram
  participant U as User
  participant App as React App
  participant Auth as Supabase Auth
  participant G as Google OAuth
  participant DB as Database
  U->>App: Click "Sign in with Google"
  App->>Auth: signInWithOAuth()
  Auth->>G: Redirect to Google
  G-->>Auth: Auth code
  Auth->>DB: Create/update user
  DB-->>Auth: User record
  Auth-->>App: Session + JWT
  App-->>U: Redirect to Dashboard
```

### AI Agent Pipeline

```mermaid
sequenceDiagram
  participant U as User
  participant EF as Edge Function
  participant G as Gemini API
  participant DB as Database
  U->>EF: Submit validation request
  EF->>G: Extract business data
  G-->>EF: Structured JSON
  EF->>G: Analyze market
  G-->>EF: Market analysis
  EF->>G: Score viability
  G-->>EF: Scores + insights
  EF->>DB: Store results
  DB-->>EF: Confirmation
  EF-->>U: Validation report
```

### Webhook Processing

```mermaid
sequenceDiagram
  participant W as Webhook Source
  participant EF as Edge Function
  participant Q as Queue
  participant P as Processor
  participant DB as Database
  W->>EF: POST /webhook
  EF->>EF: Verify signature
  EF->>Q: Enqueue event
  EF-->>W: 200 OK
  Q->>P: Process event
  P->>DB: Update records
  P->>P: Trigger side effects
```

---

## State Diagrams

### Subscription Lifecycle

```mermaid
stateDiagram-v2
  [*] --> Free
  Free --> Trial: start_trial
  Trial --> Active: subscribe
  Trial --> Free: trial_expired
  Active --> PastDue: payment_failed
  PastDue --> Active: payment_retry_success
  PastDue --> Cancelled: max_retries
  Active --> Cancelled: cancel
  Cancelled --> Active: resubscribe
  Cancelled --> [*]
```

### Validation Pipeline States

```mermaid
stateDiagram-v2
  [*] --> Queued
  Queued --> Extracting: agent_start
  Extracting --> Analyzing: extraction_done
  Analyzing --> Scoring: analysis_done
  Scoring --> Composing: scoring_done
  Composing --> Complete: report_ready
  Extracting --> Failed: error
  Analyzing --> Failed: error
  Scoring --> Failed: error
  Failed --> Queued: retry
  Complete --> [*]
```

### Pull Request Lifecycle

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Open: ready_for_review
  Open --> InReview: reviewer_assigned
  InReview --> ChangesRequested: request_changes
  ChangesRequested --> InReview: push_fixes
  InReview --> Approved: approve
  Approved --> Merged: merge
  Merged --> [*]
  Open --> Closed: close
  Closed --> Open: reopen
```

---

## Startup & Product Use Cases

### Lean Validation Process

```mermaid
flowchart LR
  A["Idea"] --> B["Problem Interview"]
  B --> C{"Problem Validated?"}
  C -->|"No"| D["Pivot Idea"]
  D --> A
  C -->|"Yes"| E["Solution Interview"]
  E --> F{"Solution Fit?"}
  F -->|"No"| G["Iterate Solution"]
  G --> E
  F -->|"Yes"| H["Build MVP"]
  H --> I["Measure"]
  I --> J{"PMF Signal?"}
  J -->|"No"| K["Learn & Iterate"]
  K --> H
  J -->|"Yes"| L["Scale"]
```

### Fundraising Pipeline

```mermaid
stateDiagram-v2
  [*] --> Researching
  Researching --> Outreach: investor_identified
  Outreach --> Meeting: intro_accepted
  Meeting --> DueDiligence: positive_meeting
  Meeting --> Passed: not_interested
  DueDiligence --> TermSheet: dd_complete
  DueDiligence --> Passed: concerns
  TermSheet --> Closed: signed
  TermSheet --> Negotiating: counter_offer
  Negotiating --> TermSheet: revised_terms
  Negotiating --> Passed: no_agreement
  Closed --> [*]
  Passed --> [*]
```

### Customer Journey Map

```mermaid
flowchart LR
  subgraph "Awareness"
    A["Blog Post"] --> B["Social Share"]
    C["Ad Campaign"] --> B
  end
  subgraph "Consideration"
    B --> D["Landing Page"]
    D --> E["Free Trial"]
  end
  subgraph "Activation"
    E --> F["Onboarding"]
    F --> G["First Value Moment"]
  end
  subgraph "Retention"
    G --> H["Weekly Usage"]
    H --> I["Feature Adoption"]
  end
  subgraph "Revenue"
    I --> J["Upgrade to Paid"]
    J --> K["Expansion"]
  end
```

### Event Planning Timeline

```mermaid
gantt
  title Startup Conference Planning
  dateFormat YYYY-MM-DD
  section Pre-Event
  Venue booking          :a1, 2026-03-01, 14d
  Speaker outreach       :a2, 2026-03-01, 21d
  Sponsor acquisition    :a3, 2026-03-08, 28d
  section Marketing
  Website launch         :b1, 2026-03-15, 7d
  Email campaigns        :b2, after b1, 21d
  Social media push      :b3, 2026-04-01, 14d
  section Logistics
  AV setup               :c1, 2026-04-07, 7d
  Catering finalized     :c2, 2026-04-07, 3d
  Rehearsals             :c3, 2026-04-12, 2d
  section Event
  Conference Day         :milestone, 2026-04-14, 0d
  Post-event follow-up   :d1, 2026-04-15, 7d
```
