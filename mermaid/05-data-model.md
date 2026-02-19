# Data Model - Core Tables

> **Type:** ER Diagram
> **PRD Section:** 15. Data Model
> **Database:** Supabase PostgreSQL with RLS

---

## Core Entity Relationships

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ PROFILES : has
    ORGANIZATIONS ||--o{ STARTUPS : owns

    PROFILES ||--o{ WIZARD_SESSIONS : creates
    PROFILES ||--o{ AI_RUNS : triggers

    STARTUPS ||--o{ PROJECTS : contains
    STARTUPS ||--o{ TASKS : has
    STARTUPS ||--o{ CONTACTS : tracks
    STARTUPS ||--o{ DOCUMENTS : stores
    STARTUPS ||--o{ STARTUP_EVENTS : plans
    STARTUPS ||--|{ LEAN_CANVAS : has

    CONTACTS ||--o{ DEALS : associated
    CONTACTS ||--o{ COMMUNICATIONS : has

    PROJECTS ||--o{ TASKS : contains

    ORGANIZATIONS {
        uuid id PK
        string name
        jsonb settings
        timestamp created_at
    }

    PROFILES {
        uuid id PK
        uuid org_id FK
        string email
        string role
        timestamp created_at
    }

    STARTUPS {
        uuid id PK
        uuid org_id FK
        string name
        string industry
        jsonb traction_data
        int profile_strength
        timestamp created_at
    }

    PROJECTS {
        uuid id PK
        uuid startup_id FK
        string name
        int health
        int progress
    }

    TASKS {
        uuid id PK
        uuid startup_id FK
        uuid project_id FK
        string title
        int priority
        string status
    }

    CONTACTS {
        uuid id PK
        uuid startup_id FK
        string name
        string type
        string email
    }

    DEALS {
        uuid id PK
        uuid contact_id FK
        string stage
        decimal amount
    }

    DOCUMENTS {
        uuid id PK
        uuid startup_id FK
        string type
        jsonb content_json
    }

    WIZARD_SESSIONS {
        uuid id PK
        uuid user_id FK
        int current_step
        jsonb ai_extractions
    }

    AI_RUNS {
        uuid id PK
        uuid user_id FK
        string agent_name
        string model
        decimal cost_usd
    }

    STARTUP_EVENTS {
        uuid id PK
        uuid startup_id FK
        string name
        string event_type
    }

    LEAN_CANVAS {
        uuid id PK
        uuid startup_id FK
        jsonb sections
        int validation_score
    }
```

---

## RLS Policy Pattern

```mermaid
flowchart TD
    subgraph Request["Incoming Request"]
        R1[User Request]
        R2[auth.uid]
    end

    subgraph Policy["RLS Policy"]
        P1{User in Org?}
        P2{Startup in Org?}
        P3{Resource belongs to Startup?}
    end

    subgraph Result["Access Result"]
        A1[Allow]
        D1[Deny]
    end

    R1 --> R2 --> P1
    P1 -->|Yes| P2
    P1 -->|No| D1
    P2 -->|Yes| P3
    P2 -->|No| D1
    P3 -->|Yes| A1
    P3 -->|No| D1

    classDef allow fill:#C8E6C9,stroke:#2E7D32
    classDef deny fill:#FFCDD2,stroke:#C62828
    class A1 allow
    class D1 deny
```

---

## Multi-Tenant Isolation

| Level | Mechanism |
|-------|-----------|
| Organization | `org_id` on all tables |
| User | `auth.uid()` → profiles → org_id |
| Startup | `startup_id` → org_id check |
| Resource | Foreign key to startup + RLS |

---

## Key Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| startups | org_id | Tenant isolation |
| tasks | startup_id, status | Task queries |
| contacts | startup_id, type | Contact filtering |
| deals | contact_id, stage | Pipeline views |
| ai_runs | user_id, created_at | Cost tracking |

---

## Verification

- [x] Core tables documented
- [x] Relationships show cardinality
- [x] RLS pattern explained
- [x] Multi-tenant isolation clear
