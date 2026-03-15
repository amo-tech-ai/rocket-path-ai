---
task_id: 102-INF
title: Agency ERD Diagrams
phase: INFRASTRUCTURE
priority: P1
status: Not Started
estimated_effort: 0.5 day
skill: [data/supabase-postgres-best-practices, infographic/mermaid-diagrams]
subagents: [supabase-expert]
depends_on: [100-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (documentation only) |
| **Features** | 4 Mermaid ERD diagrams covering agency data model |
| **Edge Functions** | None |
| **Real-World** | "Developer opens agency/mermaid/ and immediately understands how MEDDPICC scores, RICE tasks, chat modes, and nudges connect to the existing schema" |

## Description

**The situation:** The agency layer adds 15+ new columns across 6 existing tables (investors, sprint_tasks, validation_reports, lean_canvases, pitch_decks, deals) plus 2 new tables (chat_mode_sessions, behavioral_nudges). These additions span 4 domains — validation pipeline, task prioritization, investor scoring, and chat modes. Without visual diagrams, developers must read migration SQL and cross-reference the PRD to understand how tables relate. This slows onboarding, increases the risk of wiring mistakes (wrong FK, missing join), and makes code reviews harder because reviewers lack a shared mental model.

**Why it matters:** ERD diagrams are the fastest way for a developer to understand schema structure. When a new developer joins and asks "how does MEDDPICC scoring connect to the investor pipeline?", the answer should be a single diagram — not "read prompts 006, 007, 020, and the PRD section on data changes." These diagrams also serve as acceptance criteria for migrations: if the migration doesn't produce the relationships shown in the ERD, something is wrong.

**What already exists:**
- `agency/mermaid/00-index.md` — Index of 9 existing Mermaid diagrams (flowcharts, sequence diagrams)
- `agency/mermaid/03-validator-enhanced-pipeline.md` — Validator pipeline flow (not ERD)
- `agency/mermaid/06-investor-meddpicc-flow.md` — MEDDPICC flow (not ERD)
- `agency/mermaid/07-behavioral-nudge-system.md` — Nudge trigger flow (not ERD)
- `agency/prd-agency.md` — PRD with data changes table (Section: "Data model changes")
- `agency/prompts/100-index.md` — Schema migration infrastructure index
- `agency/prompts/006-investor-meddpicc-schema.md` — MEDDPICC column spec
- `agency/prompts/012-chat-session-persistence.md` — chat_mode_sessions table spec
- `tasks/mermaid/02-diagrams/` — Existing platform ERD diagrams (5 domain ERDs)

**The build:**
- Create 4 Mermaid ERD diagrams in `agency/mermaid/` as separate `.md` files
- ERD 1: Agency Core Domain — organizations, startups, and all 6 enhanced tables with agency-specific columns
- ERD 2: Chat and AI Modes — chat_mode_sessions, chat messages, profiles, organizations
- ERD 3: Behavioral Nudge — behavioral_nudges table with trigger/dismiss/snooze fields
- ERD 4: Validator Pipeline + Agency — validation_sessions, validation_reports (agency fields), validator_agent_runs, knowledge_chunks
- Each diagram uses Mermaid `erDiagram` syntax with cardinality notation and typed columns
- Update `agency/mermaid/00-index.md` to include the 4 new ERD entries

**Example:** Dev onboarding scenario. Raj joins the team and is assigned to wire the investor MEDDPICC detail sheet (task 020). He opens `agency/mermaid/10-agency-core-erd.md`, sees that `investors` has `meddpicc_score int`, `deal_verdict text`, and `signal_data jsonb`, all connected to `startups` via `startup_id FK`. He also sees that `deals` has its own `meddpicc_score` and `signal_tier`. In 30 seconds, Raj understands the schema without reading migration SQL. He writes the correct `SELECT` join on his first attempt.

## Rationale
**Problem:** Agency schema additions span 6 tables and 2 new tables across 4 domains — no visual reference exists.
**Solution:** 4 Mermaid ERD diagrams showing entities, relationships, column types, and constraints.
**Impact:** Developers understand the agency data model in seconds instead of cross-referencing 6+ prompt files.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | see the full agency schema as an ERD | I can write correct queries and joins on the first attempt |
| Reviewer | reference an ERD during code review | I can verify that migrations match the intended schema |
| New team member | understand table relationships visually | I onboard to the agency data model in minutes, not hours |

## Goals
1. **Primary:** 4 ERD diagrams cover all agency tables, columns, and relationships
2. **Quality:** Every FK, cardinality, and constraint matches the migration spec in 100-INF

## Acceptance Criteria
- [ ] ERD 1 (Agency Core Domain) shows organizations, startups, and all 6 enhanced tables with agency columns
- [ ] ERD 2 (Chat & AI Modes) shows chat_mode_sessions with mode enum, messages JSONB, and org/user FKs
- [ ] ERD 3 (Behavioral Nudge) shows behavioral_nudges with trigger, dismiss, snooze fields
- [ ] ERD 4 (Validator Pipeline + Agency) shows validation_sessions, validation_reports (agency fields), agent_runs, knowledge_chunks
- [ ] All diagrams use correct Mermaid `erDiagram` syntax and render without errors
- [ ] Cardinality notation is accurate (||--o{, ||--||, }o--||, etc.)
- [ ] Column types and key constraints (PK, FK) are shown in every entity
- [ ] Files saved in `agency/mermaid/` with filenames `10-agency-core-erd.md` through `13-validator-pipeline-agency-erd.md`
- [ ] `agency/mermaid/00-index.md` updated with 4 new entries

| Layer | File | Action |
|-------|------|--------|
| Diagram | `agency/mermaid/10-agency-core-erd.md` | Create |
| Diagram | `agency/mermaid/11-chat-ai-modes-erd.md` | Create |
| Diagram | `agency/mermaid/12-behavioral-nudge-erd.md` | Create |
| Diagram | `agency/mermaid/13-validator-pipeline-agency-erd.md` | Create |
| Index | `agency/mermaid/00-index.md` | Modify — add 4 new entries |

---

## ERD Diagrams

### ERD 1: Agency Core Domain

Save as `agency/mermaid/10-agency-core-erd.md`:

```markdown
# Agency Core Domain ERD

> Shows the central entity relationships for agency-enhanced tables.
> All agency columns are additions to existing tables (see migration 100-INF).

## Diagram

\```mermaid
erDiagram
    organizations ||--o{ startups : "has"
    organizations {
        uuid id PK
        text name
        jsonb settings
        timestamptz created_at
        timestamptz updated_at
    }

    startups ||--o{ validation_reports : "has"
    startups ||--o{ sprint_tasks : "has"
    startups ||--o{ investors : "has"
    startups ||--o{ deals : "has"
    startups ||--o{ lean_canvases : "has"
    startups ||--o{ pitch_decks : "has"
    startups {
        uuid id PK
        uuid org_id FK
        text name
        text industry
        text stage
        jsonb traction_data
        timestamptz created_at
        timestamptz updated_at
    }

    validation_reports {
        uuid id PK
        uuid session_id FK
        jsonb report_json
        int score
        text report_version "v2 or v3"
        jsonb details "contains agency fields below"
        jsonb evidence_tier_counts "cited/founder/ai counts"
        jsonb bias_flags "array of detected biases"
        int fragments_loaded "count of loaded fragments"
        timestamptz created_at
    }

    sprint_tasks {
        uuid id PK
        uuid startup_id FK
        text title
        text description
        text status "backlog|todo|doing|done"
        text priority "low|medium|high|critical"
        text sprint_name
        int rice_reach "0-100 users affected"
        int rice_impact "1-3 scale"
        decimal rice_confidence "0.0-1.0"
        int rice_effort "person-weeks"
        decimal rice_score "GENERATED reach*impact*confidence/effort"
        text kano_category "must_have|performance|delight|indifferent"
        int momentum_sequence "execution order"
        text source_action_id "dedup key for imports"
        timestamptz created_at
        timestamptz updated_at
    }

    investors {
        uuid id PK
        uuid org_id FK
        text name
        text type
        text focus_areas
        int check_size_min
        int check_size_max
        text status
        int meddpicc_metrics "0-5 score"
        int meddpicc_economic_buyer "0-5 score"
        int meddpicc_decision_criteria "0-5 score"
        int meddpicc_decision_process "0-5 score"
        int meddpicc_paper_process "0-5 score"
        int meddpicc_identify_pain "0-5 score"
        int meddpicc_champion "0-5 score"
        int meddpicc_competition "0-5 score"
        int meddpicc_score "0-40 composite"
        text signal_tier "hot|warm|cold|dead"
        text deal_verdict "strong_buy|buy|hold|pass"
        jsonb signal_data
        timestamptz created_at
        timestamptz updated_at
    }

    deals {
        uuid id PK
        uuid contact_id FK
        uuid startup_id FK
        text stage
        decimal amount
        int meddpicc_score "0-40 composite"
        text signal_tier "hot|warm|cold|dead"
        text deal_verdict "strong_buy|buy|hold|pass"
        timestamptz created_at
        timestamptz updated_at
    }

    lean_canvases {
        uuid id PK
        uuid org_id FK
        jsonb canvas_data "9 boxes"
        jsonb specificity_scores "per-box 0-100"
        jsonb evidence_gaps "boxes with weak evidence"
        int version
        timestamptz created_at
        timestamptz updated_at
    }

    pitch_decks {
        uuid id PK
        uuid org_id FK
        jsonb deck_json "slides array"
        jsonb win_themes "array of win theme strings"
        jsonb challenger_narrative "5-act narrative structure"
        jsonb persuasion_architecture "per-slide persuasion type"
        timestamptz created_at
        timestamptz updated_at
    }
\```

## Notes

- `validation_reports.evidence_tier_counts`, `bias_flags`, `fragments_loaded` are added as JSONB fields inside `details` column (no new top-level columns on this table — agency data lives within the existing `details` JSONB)
- `sprint_tasks` RICE fields are nullable — existing tasks without RICE render normally
- `investors` MEDDPICC has 8 individual dimension columns (0-5 each) plus a composite `meddpicc_score` (0-40)
- `lean_canvases.specificity_scores` is a JSONB map: `{ "problem": 72, "solution": 55, ... }`
- `pitch_decks.challenger_narrative` follows 5-act structure: `{ act1_status_quo, act2_disruption, act3_vision, act4_proof, act5_call }`
- All FK relationships enforce org-based isolation via RLS (see 101-INF)
```

---

### ERD 2: Chat & AI Modes

Save as `agency/mermaid/11-chat-ai-modes-erd.md`:

```markdown
# Chat & AI Modes ERD

> Shows the chat session persistence model for 4 specialized AI modes.
> Depends on: task 010 (chat modes backend), task 012 (session persistence).

## Diagram

\```mermaid
erDiagram
    organizations ||--o{ chat_mode_sessions : "scopes"
    profiles ||--o{ chat_mode_sessions : "owns"
    chat_mode_sessions ||--o{ chat_messages : "contains"

    organizations {
        uuid id PK
        text name
        jsonb settings
    }

    profiles {
        uuid id PK
        text email
        uuid org_id FK
        text role
    }

    chat_mode_sessions {
        uuid id PK
        uuid user_id FK "references auth.users"
        uuid org_id FK "references organizations"
        text mode "general|practice-pitch|growth-strategy|deal-review|canvas-coach"
        text title "default New conversation"
        jsonb messages "array of message objects"
        jsonb score "practice-pitch scores object"
        text[] feedback "array of feedback strings"
        timestamptz created_at
        timestamptz updated_at
    }

    chat_messages {
        uuid id PK
        uuid session_id FK "references chat_mode_sessions"
        text role "user|assistant|system"
        text content
        jsonb metadata "model, tokens, latency"
        timestamptz created_at
    }
\```

## Notes

- `chat_mode_sessions.mode` is an enum-like text column — validated at application level (not DB enum, for flexibility)
- `chat_mode_sessions.messages` is the primary message store (denormalized JSONB array for fast session load). The `chat_messages` table is an optional normalized view for analytics and search
- `score` JSONB is used by practice-pitch mode: `{ clarity: 8, confidence: 7, structure: 6, persuasion: 9, handling: 7, total: 37 }`
- `feedback` TEXT[] stores coaching feedback strings per session
- Sessions are capped at 50 messages (truncate oldest on overflow — application logic, not DB constraint)
- RLS: users see only their own sessions within their org
```

---

### ERD 3: Behavioral Nudge

Save as `agency/mermaid/12-behavioral-nudge-erd.md`:

```markdown
# Behavioral Nudge ERD

> Shows the server-side nudge tracking table for dismiss/snooze persistence.
> Depends on: task 015 (behavioral nudge system).
> Note: task 015 originally specified localStorage-only. This table enables
> cross-device persistence and server-side nudge analytics.

## Diagram

\```mermaid
erDiagram
    organizations ||--o{ behavioral_nudges : "scopes"
    profiles ||--o{ behavioral_nudges : "receives"

    organizations {
        uuid id PK
        text name
    }

    profiles {
        uuid id PK
        text email
        uuid org_id FK
    }

    behavioral_nudges {
        uuid id PK
        uuid user_id FK "references auth.users"
        uuid org_id FK "references organizations"
        text trigger_key "unique per user e.g. empty_canvas_box"
        text trigger_type "progress|suggestion|warning"
        text title "Nudge headline"
        text message "Nudge body text"
        text cta_text "Button label e.g. Review Sprint"
        text cta_route "Navigation target e.g. /sprint-plan"
        text priority "low|medium|high"
        timestamptz dismissed_at "null if not dismissed"
        timestamptz snoozed_until "null or future timestamp"
        timestamptz created_at
        timestamptz updated_at
    }
\```

## Notes

- `trigger_key` is unique per user: `UNIQUE(user_id, trigger_key)` — prevents duplicate nudges
- 5 initial trigger keys: `empty_canvas_box`, `stale_sprint`, `low_coverage`, `no_validation`, `incomplete_profile`
- `dismissed_at` is set once — permanent dismissal. `snoozed_until` is a future timestamp (24h default)
- Query for active nudges: `WHERE dismissed_at IS NULL AND (snoozed_until IS NULL OR snoozed_until < now())`
- `trigger_type` determines banner color: progress (green), suggestion (blue), warning (amber)
- `priority` determines display order when multiple nudges are active
- RLS: users manage only their own nudges within their org
```

---

### ERD 4: Validator Pipeline + Agency

Save as `agency/mermaid/13-validator-pipeline-agency-erd.md`:

```markdown
# Validator Pipeline + Agency ERD

> Shows the validator pipeline tables with agency-specific additions.
> Agency fields appear in `validation_reports.details` JSONB.
> Depends on: 100-INF (schema migrations).

## Diagram

\```mermaid
erDiagram
    startups ||--o{ validation_sessions : "validates"
    validation_sessions ||--|| validation_reports : "produces"
    validation_sessions ||--o{ validator_agent_runs : "tracks"
    knowledge_chunks }o--o{ validation_reports : "cited in"

    startups {
        uuid id PK
        uuid org_id FK
        text name
        text industry
        text stage
        text pitch_text
    }

    validation_sessions {
        uuid id PK
        uuid org_id FK
        uuid startup_id FK
        text status "pending|running|completed|failed"
        text pitch_text
        jsonb context "interview data from chat"
        int agent_count "7 agents"
        timestamptz started_at
        timestamptz completed_at
        timestamptz created_at
    }

    validation_reports {
        uuid id PK
        uuid session_id FK "references validation_sessions"
        jsonb report_json "14-section report"
        int score "0-100 overall"
        text report_version "v2|v3"
        jsonb details "structured sections"
        jsonb scores_matrix "7 dimension scores + weights"
        jsonb dimensions "v3 per-dimension detail pages"
        text summary_verdict "go|conditional_go|no_go"
        timestamptz created_at
    }

    validator_agent_runs {
        uuid id PK
        uuid session_id FK "references validation_sessions"
        text agent_name "extractor|research|competitors|scoring|mvp|composer|verifier"
        text status "queued|running|completed|failed|skipped"
        int duration_ms
        jsonb metadata "model, tokens, errors"
        timestamptz started_at
        timestamptz completed_at
    }

    knowledge_chunks {
        uuid id PK
        text content "minimum 20 chars"
        text industry
        text category
        vector embedding "1536 dimensions"
        uuid document_id FK
        timestamptz created_at
    }
\```

## Agency Additions (inside validation_reports.details JSONB)

The agency layer enriches the validator pipeline output. These fields live inside
the existing `details` JSONB column — not as new top-level columns:

| Field Path | Type | Source Agent | Purpose |
|------------|------|-------------|---------|
| `details.evidence_tier_counts` | `{ cited: int, founder: int, ai: int }` | Scoring | Evidence quality breakdown |
| `details.bias_flags` | `[{ type: string, description: string, severity: string }]` | Scoring | Detected reasoning biases |
| `details.fragments_loaded` | `int` | Pipeline | Count of skill fragments loaded via agent-loader |
| `details.win_themes` | `string[]` | Composer Group D | Key themes for pitch narrative |
| `details.ice_channels` | `[{ channel: string, impact: int, confidence: int, ease: int }]` | Composer Group C | ICE-scored go-to-market channels |

## Notes

- `validation_sessions` → `validation_reports` is 1:1 (one report per session)
- `validation_sessions` → `validator_agent_runs` is 1:many (7 agent runs per session)
- `knowledge_chunks` are linked to reports via semantic search at runtime — no FK, the connection is through vector similarity during the Research agent's RAG lookup
- `report_version` distinguishes v2 (14-section flat) from v3 (14-section + 9 dimension detail pages)
- Agency does not add new top-level columns to `validation_reports` — all enrichment flows through the existing `details` JSONB, keeping the schema backward-compatible
```

---

## Research Before Implementation

Before creating the diagrams, the implementer should:

1. Read `agency/prd-agency.md` (Section: "Data model changes") to verify all column names and types
2. Read `agency/prompts/006-investor-meddpicc-schema.md` for exact MEDDPICC column definitions
3. Read `agency/prompts/012-chat-session-persistence.md` for chat_mode_sessions table spec
4. Read `agency/prompts/005-sprint-board-rice-kano.md` for RICE column definitions
5. Check existing ERDs in `tasks/mermaid/02-diagrams/` for style consistency
6. Run `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('investors', 'sprint_tasks', 'validation_reports', 'lean_canvases', 'pitch_decks', 'deals')` to verify current column state before diagramming agency additions

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Mermaid syntax error in diagram | Validate each diagram with a Mermaid renderer (mermaid.live) before committing |
| Column name mismatch with migration | ERD is the source of intent — if migration differs, migration should be updated |
| Table already has a column the ERD shows as "new" | Mark column as existing (not agency-added) in the diagram notes |
| JSONB fields with nested structure | Show the top-level JSONB column in the ERD entity, document nested fields in a separate table below the diagram |
| Cardinality ambiguity (e.g. deals ↔ investors) | Verify with actual FK constraints in migration SQL; prefer explicit FK over inferred relationships |

## Real-World Examples

**Scenario 1 — New developer onboarding:** Raj joins the team and picks up task 020 (MEDDPICC Detail Sheet). He needs to write a `SELECT` joining `investors` with MEDDPICC dimension columns and `deals` with `signal_tier`. He opens `agency/mermaid/10-agency-core-erd.md`, sees the exact column names (`meddpicc_metrics`, `meddpicc_economic_buyer`, ... `meddpicc_score`), their types (`int`, `text`), and the FK from `investors` to `startups`. **With the ERD,** he writes the correct query in 2 minutes. Without it, he would have needed to read the migration SQL (100-INF), the schema prompt (006), and the PRD data changes section.

**Scenario 2 — Code review accuracy:** Priya submits a PR for the chat modes backend (task 010). The reviewer opens `agency/mermaid/11-chat-ai-modes-erd.md` to verify the schema. The PR creates `chat_mode_sessions` with a `score` JSONB column, but the ERD shows `score` should be present. The reviewer confirms the column type matches. The PR also omits the `feedback TEXT[]` column. **With the ERD as reference,** the reviewer catches the missing column before merge.

**Scenario 3 — Sprint planning alignment:** The team is planning Phase 2 (chat modes + nudges). The PM opens the ERD index, sees diagrams 11 (chat) and 12 (nudges), and immediately understands the data dependencies: chat_mode_sessions needs organizations and profiles tables, behavioral_nudges needs the same. **With the ERD,** the PM confirms both can be built in parallel since they share the same FKs but have no cross-dependencies.

## Outcomes

| Before | After |
|--------|-------|
| Agency schema spread across 6+ prompt files and the PRD | 4 focused ERD diagrams, one per domain |
| Developers read migration SQL to understand table relationships | Visual diagrams show entities, FKs, and cardinality at a glance |
| No visual reference for code reviews involving schema changes | Reviewer opens ERD to verify column names, types, and relationships |
| New team members need 30+ minutes to trace agency data model | ERD diagrams provide full understanding in under 5 minutes |
| Risk of FK/join mistakes when wiring hooks to tables | ERD shows exact column names and FK targets, reducing wiring errors |

---

## Cross References

| Document | Path | Relevance |
|----------|------|-----------|
| Schema Migrations (100-INF) | `agency/prompts/100-index.md` | Migration specs that ERDs visualize |
| MEDDPICC Schema (006) | `agency/prompts/006-investor-meddpicc-schema.md` | Investor column definitions |
| Chat Session Persistence (012) | `agency/prompts/012-chat-session-persistence.md` | chat_mode_sessions table spec |
| Sprint Board RICE (005) | `agency/prompts/005-sprint-board-rice-kano.md` | RICE column definitions |
| Behavioral Nudge (015) | `agency/prompts/015-behavioral-nudge-system.md` | Nudge system spec |
| Agency PRD Data Changes | `agency/prd-agency.md` | Source of truth for all data changes |
| Existing Mermaid Index | `agency/mermaid/00-index.md` | Index to update with new ERDs |
| Platform ERDs | `tasks/mermaid/02-diagrams/` | Style reference for ERD diagrams |
