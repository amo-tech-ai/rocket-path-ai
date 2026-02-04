# Supabase Schema Summary — CORE + Coach + Vector + AI (010–020, 101, 105, 216, 218)

> **Source:** tasks/prompts/010–020, 101-coach-tables, 105-vector-db, 216-claude-sdk, 218-data-flows  
> **Format:** Display tables, descriptions, frontend/backend wiring, setup prompt

---

## 1. Overview by Prompt

| Prompt | Title | Description | Schema Tables / Artifacts |
|--------|--------|-------------|---------------------------|
| **010** | Auth Setup | OAuth (Google, LinkedIn), JWT, session management, protected routes | profiles, organizations; trigger handle_new_user |
| **011** | Core Schema | Multi-tenant foundation: orgs, profiles, startups, projects, tasks, contacts, deals, documents | organizations, profiles, startups, projects, tasks, contacts, deals, documents |
| **012** | RLS Policies | Org-based isolation; users see only their org data | All tables (policies); helpers: user_org_id(), startup_in_org() |
| **013** | Indexes | FK, filter/sort, partial, GIN, HNSW for vectors | Indexes on all core + chat + agent tables |
| **014** | Triggers | updated_at, activity log, new-user setup, integrity (e.g. project progress) | activities; handle_updated_at(), log_activity(), handle_new_user() |
| **015** | Core ERD | Entity relationship diagrams (Mermaid) for CORE tables | Documentation only |
| **016** | Chat Schema | Sessions, messages, context; RAG-ready (embeddings) | chat_sessions, chat_messages, chat_context |
| **017** | Agent Schema | Agent config, tools, execution logs | agents, agent_tools, agent_executions, agent_logs |
| **018** | Workflow Schema | Event/schedule triggers, action queue, runs | workflows, workflow_triggers, workflow_actions, workflow_runs, workflow_queue |
| **019** | Wizard Schema | Onboarding progress, draft per step, resume | onboarding_sessions, onboarding_steps, wizard_drafts |
| **020** | Dashboard Data | Aggregated metrics, activity feed, trend snapshots | dashboard_metrics (MV), metric_snapshots; activities |
| **101** | Coach Tables | Coach state machine, assessment/campaign/sprint memory, conversation history | validation_sessions, validation_assessments, validation_campaigns, validation_sprints, validation_experiments, validation_conversations |
| **105** | Vector DB | pgvector + Tier A stats for RAG; semantic search | knowledge_chunks; search_knowledge() |
| **216** | Claude SDK | Complex reasoning, extended thinking, tool use; Haiku/Sonnet/Opus | agent_executions; _shared/claude-client; retry, timeout, is_error |
| **218** | Data Flow Diagrams | Data flows for onboarding, chat, canvas, validation, workflow, dashboard | Documentation (Mermaid); no new tables |

---

## 2. Schema Tables — Display Format

### 2.1 Auth & Core (010, 011)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| **organizations** | Tenant root; one per team/company | id, name, slug (UK), settings, subscription_tier |
| **profiles** | User profile; extends auth.users | id (PK/FK auth.users), email, full_name, org_id, onboarding_completed, role |
| **startups** | Startup entity per org | id, org_id, name, industry, stage |
| **projects** | Projects under a startup | id, startup_id, name, status, progress, owner_id |
| **tasks** | Tasks; can link to project | id, startup_id, project_id?, title, status, due_at |
| **contacts** | CRM contacts per startup | id, startup_id, name, email, type (customer/investor) |
| **deals** | Deals linked to contact/startup | id, startup_id, contact_id, amount, stage |
| **documents** | Documents per startup | id, startup_id, title, content, type |

### 2.2 Chat (016)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| **chat_sessions** | One per conversation thread | id, startup_id, user_id, title, agent_type, status, total_tokens, message_count, summary |
| **chat_messages** | Messages in a session | id, session_id, role (user/assistant/system/tool), content, tokens, model, tool_calls, embedding |
| **chat_context** | Context window / RAG metadata | session_id, context_snapshot, token_count |

### 2.3 Agent (017)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| **agents** | Agent config (prompt, model, tools) | id, slug (UK), name, system_prompt, model, temperature, tools[], settings |
| **agent_tools** | Tool definitions (3–4 sentence descriptions) | id, slug, name, description, parameters (JSONB), handler |
| **agent_executions** | Per-request execution log | id, agent_id, session_id?, input_tokens, output_tokens, latency_ms, status |
| **agent_logs** | Debug / trace log | execution_id, level, message, payload |

### 2.4 Workflow (018)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| **workflows** | Workflow definition | id, startup_id?, name, trigger_type, trigger_config, actions, conditions, is_active |
| **workflow_triggers** | Trigger config (db_event, schedule, webhook) | id, workflow_id, trigger_type, table_name, event_type, schedule, filter |
| **workflow_actions** | Action chain | id, workflow_id, order_index, action_type, config |
| **workflow_runs** | Execution history | id, workflow_id, status, started_at, completed_at, error |
| **workflow_queue** | Pending actions (reliable queue) | id, workflow_id, payload, status, retry_count |

### 2.5 Wizard (019)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| **onboarding_sessions** | One per startup onboarding | id, startup_id (UK), user_id, current_step, completed_steps[], status |
| **onboarding_steps** | Step metadata / validation | session_id, step_number, status |
| **wizard_drafts** | Draft data per step | id, session_id, step_number, step_data (JSONB), ai_enrichments, validation_status |

### 2.6 Dashboard (020)

| Table / Object | Description | Key Columns / Notes |
|----------------|-------------|----------------------|
| **dashboard_metrics** | Materialized view per startup | startup_id, total_tasks, completed_tasks, overdue_tasks, open_deals, pipeline_value, health_score, last_updated |
| **metric_snapshots** | Historical metrics for trends | startup_id, metric_type, value, snapshot_date |
| **activities** | Audit/activity feed (from 014) | entity_type, entity_id, action, user_id, startup_id, created_at |

### 2.7 Coach (101)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| **validation_sessions** | One active session per startup; state machine root | id, startup_id, state (JSONB phase + progress), is_active; UNIQUE(startup_id) WHERE is_active |
| **validation_assessments** | Dimension scores over time (clarity, desirability, etc.) | id, session_id, dimension, score (0–10), feedback, assessed_at |
| **validation_campaigns** | 90-day campaign definitions | id, session_id, constraint_type, campaign_type, goal, start_date, end_date, status |
| **validation_sprints** | PDCA sprint tracking | id, campaign_id, sprint_number, purpose, pdca_step, outcomes (JSONB), started_at, completed_at |
| **validation_experiments** | Hypotheses and learnings per sprint | id, sprint_id, hypothesis, method, success_criteria, result, learning, status |
| **validation_conversations** | Coach chat history per session | id, session_id, role, content, phase, created_at |

### 2.8 Vector / RAG (105)

| Table / Object | Description | Key Columns / Notes |
|----------------|-------------|----------------------|
| **knowledge_chunks** | Tier A stats with embeddings for semantic search | id, content, embedding vector(768), source, source_type (deloitte/bcg/pwc/…), year, sample_size, confidence (high/medium/low), category, tags[] |
| **search_knowledge** | SQL function: semantic search by query embedding | query_embedding, match_threshold (default 0.75), match_count (default 5) → id, content, source, confidence, similarity |

---

## 3. RLS Summary (012)

| Pattern | Applies To | Rule |
|---------|------------|------|
| Own org | organizations, profiles | `id = user_org_id()` or `org_id = user_org_id()` |
| Via startup | startups, projects, tasks, contacts, deals, documents, chat_*, etc. | `startup_in_org(startup_id)` or `org_id = user_org_id()` |
| Own profile | profiles | `id = auth.uid()` (SELECT/UPDATE own row) |

Helper functions: `user_org_id()` (returns current user’s org_id), `startup_in_org(uuid)` (returns boolean).

| Coach (101) | validation_* | Via session: session_id IN (SELECT id FROM validation_sessions WHERE startup_id IN (…)) |
| Vector (105) | knowledge_chunks | SELECT for authenticated only: `auth.role() = 'authenticated'` |

---

## 4. Indexes Summary (013)

| Category | Examples |
|----------|----------|
| FK | idx_startups_org, idx_projects_startup, idx_tasks_startup, idx_chat_sessions_startup, idx_agent_executions_agent_id |
| Sort / filter | created_at, updated_at, due_at, status |
| Partial | status = 'todo', status = 'active' |
| GIN | tags[], settings (JSONB) |
| HNSW | embedding (vector) for RAG; knowledge_chunks.embedding (105) |
| Coach (101) | idx_validation_sessions_startup, idx_validation_sessions_active (partial), idx_validation_conversations_session, idx_validation_assessments_session, idx_validation_sprints_campaign |

---

## 5. Triggers Summary (014)

| Trigger | Table(s) | Purpose |
|---------|----------|---------|
| handle_updated_at | All tables | Set updated_at = now() |
| handle_new_user | auth.users | Insert profile (and optionally org/startup) |
| log_activity | tasks, projects, deals, documents | Insert into activities |
| update_session_stats | chat_messages | Update chat_sessions.message_count, total_tokens, last_message_at |
| update_project_progress | tasks | Recalc project progress on task status change |

---

## 6. Frontend / Backend Wiring

| Prompt | Layer | File | Action |
|--------|--------|------|--------|
| **010** | Migration | supabase/migrations/xxx_auth_setup.sql | Create profiles, handle_new_user trigger |
| **010** | Hook | src/hooks/useAuth.ts | signInWithGoogle, signInWithLinkedIn, signOut, session |
| **010** | Component | src/components/auth/LoginForm.tsx, OAuthButtons.tsx, ProtectedRoute.tsx | Create |
| **010** | Edge | All functions | Verify JWT via _shared/auth.ts |
| **011** | Migration | supabase/migrations/xxx_core_schema.sql | organizations, profiles, startups, projects, tasks, contacts, deals, documents |
| **012** | Migration | supabase/migrations/xxx_rls.sql | RLS policies + user_org_id(), startup_in_org() |
| **013** | Migration | supabase/migrations/xxx_indexes.sql | B-tree, partial, GIN, HNSW indexes |
| **014** | Migration | supabase/migrations/xxx_triggers.sql | handle_updated_at, log_activity, activities table |
| **016** | Migration | supabase/migrations/xxx_chat_schema.sql | chat_sessions, chat_messages, chat_context |
| **016** | Hooks | useChat.ts, useChatSession.ts | Create |
| **016** | Components | ChatPanel.tsx, MessageList.tsx | Create |
| **016** | Edge | supabase/functions/ai-chat/index.ts | Modify (read/write chat tables) |
| **017** | Migration | supabase/migrations/xxx_agent_schema.sql | agents, agent_tools, agent_executions, agent_logs |
| **017** | Edge | All agent functions | Read agent config; write executions/logs |
| **018** | Migration | supabase/migrations/xxx_workflow_schema.sql | workflows, workflow_* tables |
| **018** | Edge | supabase/functions/workflow-trigger/index.ts | Process triggers, queue, runs |
| **019** | Migration | supabase/migrations/xxx_wizard_schema.sql | onboarding_sessions, wizard_drafts |
| **019** | Hooks | useWizardSession.ts, useOnboardingAgent.ts | Create/verify |
| **019** | Edge | supabase/functions/onboarding-agent/index.ts | Read/write drafts, enrichments |
| **020** | Migration | supabase/migrations/xxx_dashboard_metrics.sql | dashboard_metrics (MV), metric_snapshots, capture_daily_metrics() |
| **020** | Hooks | useDashboardMetrics.ts, useActivityFeed.ts, useMetricTrend.ts | Create |
| **020** | Components | MetricsGrid.tsx, ActivityFeed.tsx, TrendChart.tsx | Create |
| **020** | Edge | supabase/functions/dashboard-metrics/index.ts | Create |
| **101** | Migration | supabase/migrations/xxx_coach_validation_tables.sql | validation_sessions, validation_assessments, validation_campaigns, validation_sprints, validation_experiments, validation_conversations |
| **101** | Types | src/types/validation.ts | ValidationPhase, Dimension, Constraint, PDCAStep, ValidationState, STATE_TRANSITIONS |
| **101** | Generated | src/integrations/supabase/types.ts | Regenerate after migration |
| **105** | Migration | supabase/migrations/xxx_knowledge_chunks.sql | pgvector extension; knowledge_chunks; HNSW index; search_knowledge() |
| **105** | Seed | supabase/seeds/knowledge_stats.sql | 200+ Tier A statistics |
| **105** | Types | src/types/knowledge.ts | Create |
| **105** | Hook | src/hooks/useKnowledgeSearch.ts | Create |
| **105** | Edge | supabase/functions/ai-chat/index.ts | Modify (add RAG retrieval) |
| **216** | Shared | supabase/functions/_shared/claude-client.ts | Create; retry (exponential backoff), timeout 30s, tool descriptions 3–4 sentences |
| **216** | Edge | ai-chat, pitch-deck-agent, validation-agent | Use Claude client; PreToolUse/PostToolUse hooks; is_error in tool results |
| **218** | Docs | tasks/docs/ or design/mermaid | Create/update data flow diagrams (onboarding, chat, canvas, validation, workflow, dashboard) |

---

## 7. Setup Prompt (Copy-Paste)

Use this prompt to implement or verify the CORE Supabase schema and wiring:

```
Implement the StartupAI CORE data layer per tasks/prompts 010–020.

1) Auth (010): Ensure profiles and organizations exist; trigger on auth.users insert creates profile. Wire useAuth (Google/LinkedIn), ProtectedRoute, and JWT verification in edge functions.

2) Core schema (011): organizations, profiles, startups, projects, tasks, contacts, deals, documents — UUID PKs, FKs, created_at/updated_at. RLS (012): enable on all tables; org isolation via user_org_id() and startup_in_org().

3) Indexes (013): FK indexes, composite for common filters/sorts, partial for status, GIN for JSONB/arrays, HNSW for vector if used.

4) Triggers (014): handle_updated_at on all tables; activity log for tasks, projects, deals, documents; handle_new_user; chat session stats on chat_messages insert.

5) Chat (016): chat_sessions, chat_messages (role, content, tokens, tool_calls, embedding optional). Wire useChat/useChatSession and ai-chat edge function.

6) Agent (017): agents, agent_tools (3–4 sentence descriptions), agent_executions, agent_logs. Edge functions read config and write execution logs.

7) Workflow (018): workflows, workflow_triggers, workflow_actions, workflow_runs, workflow_queue. Wire workflow-trigger edge function.

8) Wizard (019): onboarding_sessions, wizard_drafts (step_data JSONB per step). Wire onboarding-agent and wizard hooks.

9) Dashboard (020): Materialized view dashboard_metrics (per-startup aggregates); metric_snapshots for trends; activities for feed. Functions: get_metric_trend(), capture_daily_metrics(). Hooks: useDashboardMetrics, useActivityFeed, useMetricTrend. Edge: dashboard-metrics.

10) Coach (101): validation_sessions (state JSONB, one active per startup), validation_assessments, validation_campaigns, validation_sprints, validation_experiments, validation_conversations. RLS via session → startup. Types: src/types/validation.ts (ValidationPhase, Dimension, Constraint, PDCAStep, ValidationState, STATE_TRANSITIONS). Depends on startups.

11) Vector DB (105): pgvector extension; knowledge_chunks (content, embedding vector(768), source, source_type, year, confidence, category, tags). HNSW index on embedding. search_knowledge(query_embedding, match_threshold, match_count). Seed 200+ Tier A stats. RLS: SELECT for authenticated. Hook: useKnowledgeSearch. ai-chat: add RAG retrieval. Depends on 101.

Reference: tasks/docs/data/data-summary.md (this doc) and tasks/prompts/010–020, 101-coach-tables.md, 105-vector-db.md for full table definitions and SQL.
```

---

*Generated from tasks/prompts/010–020, 101-coach-tables.md, 105-vector-db.md, 216-claude-sdk.md, 218-data-flows.md. For ERD see 015-core-erd.md, 217-full-erd.md; for Coach design see plan/2026-02-04-startup-coach-design.md.*
