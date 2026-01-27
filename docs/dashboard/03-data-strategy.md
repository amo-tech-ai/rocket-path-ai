# StartupAI Data Strategy — Complete System

> **Date:** 2026-01-27 | **Version:** 1.0 | **Status:** Active
> **Source:** Supabase database (48 tables) + 14 edge functions + 8 AI agents
> **Design Reference:** `100-new-dashboard-system.md`, `01-ai-real-time.md`

---

## Table of Contents

1. Schema Overview
2. Entity Relationship Diagrams (ERD)
3. Table Catalog — Core
4. Table Catalog — Features
5. Table Catalog — AI and Chat
6. Table Catalog — Events
7. Table Catalog — Auxiliary
8. Relationships and Foreign Keys
9. Indexes
10. Row Level Security (RLS)
11. Database Functions
12. Database Triggers
13. Edge Functions (14)
14. AI Agent Architecture
15. Gemini 3 Features and Tools
16. Claude SDK Agents and Tools
17. Data Flow Diagrams
18. Automation and Workflow Logic
19. Wizard Data Flows
20. Dashboard Data Aggregation

---

## 1. Schema Overview

| Metric | Value |
|--------|-------|
| Total Tables | 48 |
| Core Tables | 16 |
| Feature Tables | 12 |
| AI and Chat Tables | 6 |
| Event Tables | 9 |
| Auxiliary Tables | 11 |
| Custom Enums | 20+ |
| Database Functions | 11 |
| Edge Functions | 14 |
| AI Agents | 8 |
| Realtime Channels | 10 |

| Category | Tables |
|----------|--------|
| Auth and Users | profiles, user_roles, org_members, organizations |
| Business Core | startups, contacts, deals, tasks, projects, documents |
| Investors | investors |
| Events | events, event_attendees, event_venues, event_assets, sponsors, startup_event_tasks, messages |
| AI and Chat | ai_runs, chat_sessions, chat_messages, chat_facts, chat_pending, agent_configs |
| Pitch Decks | pitch_decks, pitch_deck_slides, deck_templates |
| Onboarding | wizard_sessions, wizard_extractions |
| Automation | automation_rules, proposed_actions, action_executions |
| Audit | audit_log, activities |
| Storage | file_uploads |
| Industry | industry_packs, playbooks, startup_playbooks, benchmark_snapshots |
| Comms | communications, contact_tags, notifications |

---

## 2. Entity Relationship Diagrams (ERD)

### 2a. Core ERD — Multi-Tenant Foundation

```
auth.users (Supabase Auth)
    │
    ├──→ profiles (1:1)
    │       │
    │       ├──→ organizations (many:1 via org_id)
    │       │       │
    │       │       ├──→ startups (1:many)
    │       │       │       │
    │       │       │       ├──→ contacts (1:many)
    │       │       │       ├──→ deals (1:many)
    │       │       │       ├──→ tasks (1:many)
    │       │       │       ├──→ projects (1:many)
    │       │       │       ├──→ documents (1:many)
    │       │       │       ├──→ investors (1:many)
    │       │       │       ├──→ events (1:many)
    │       │       │       ├──→ pitch_decks (1:many)
    │       │       │       └──→ activities (1:many)
    │       │       │
    │       │       ├──→ org_members (1:many)
    │       │       ├──→ agent_configs (1:many)
    │       │       └──→ integrations (1:many)
    │       │
    │       ├──→ user_roles (1:many)
    │       ├──→ wizard_sessions (1:many)
    │       ├──→ chat_sessions (1:many)
    │       └──→ notifications (1:many)
```

### 2b. CRM ERD — Contacts, Deals, Communications

```
startups
    │
    ├──→ contacts (1:many)
    │       │
    │       ├──→ deals (many:1 via contact_id)
    │       │       │
    │       │       └──→ communications (1:many via deal_id)
    │       │
    │       ├──→ communications (1:many via contact_id)
    │       ├──→ contact_tags (1:many)
    │       └──→ contacts.referred_by ──→ contacts (self-ref)
    │
    ├──→ deals (1:many)
    │       │
    │       └──→ tasks (1:many via deal_id)
    │
    └──→ investors (1:many)
```

### 2c. AI and Chat ERD

```
profiles
    │
    ├──→ chat_sessions (1:many)
    │       │
    │       ├──→ chat_messages (1:many)
    │       │       └── role: user, assistant, system
    │       │
    │       └──→ chat_facts (1:many via session extraction)
    │
    ├──→ chat_facts (1:many via user_id)
    ├──→ chat_pending (1:many)
    └──→ ai_runs (1:many)

agent_configs ──→ organizations (many:1)
proposed_actions ──→ action_executions (1:many)
```

### 2d. Pitch Deck ERD

```
startups
    │
    └──→ pitch_decks (1:many)
            │
            ├──→ pitch_deck_slides (1:many, ordered by position)
            │       └── slide_type: title, problem, solution, product,
            │           market, business_model, traction, competition,
            │           team, financials, ask, contact, custom
            │
            └──→ deck_templates (many:1 via template_id)
```

### 2e. Events ERD

```
startups
    │
    └──→ events (1:many)
            │
            ├──→ event_attendees (1:many)
            ├──→ event_venues (1:many)
            ├──→ event_assets (1:many)
            │       └──→ event_assets.parent_asset_id (self-ref)
            ├──→ sponsors (1:many)
            ├──→ startup_event_tasks (1:many)
            │       ├──→ tasks (many:1 via task_id)
            │       └──→ blocks/depends_on (self-ref)
            └──→ messages (1:many)

industry_events (standalone public directory, no startup FK)
```

### 2f. Onboarding ERD

```
profiles
    │
    └──→ wizard_sessions (1:many)
            │
            ├──→ wizard_extractions (1:many)
            │       └── extraction_type: url, context, founder,
            │           readiness, interview, score, summary
            ├──→ startups (created on completion)
            └──→ industry_packs (many:1)
```

---

## 3. Table Catalog — Core

### 3a. Authentication and Users

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| profiles | User accounts linked to auth.users | id (FK auth.users), email, full_name, avatar_url, role, org_id, onboarding_completed, preferences (jsonb), timezone | belongs_to organizations, has_many user_roles, wizard_sessions, chat_sessions |
| user_roles | Role-based access control | id, user_id (FK profiles), role (app_role enum: admin, moderator, user) | belongs_to profiles |
| organizations | Multi-tenant isolation root | id, name, slug, logo_url, settings (jsonb), subscription_plan, subscription_status, trial_ends_at | has_many startups, profiles, org_members, agent_configs |
| org_members | Organization membership | id, org_id, user_id, role, status, invited_by, joined_at | belongs_to organizations, profiles |

### 3b. Business Core

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| startups | Central entity per org | id, org_id, name, description, website, industry, stage, funding_stage, traction_data (jsonb), investor_ready_score, team_size, business_model | belongs_to organizations, has_many contacts, deals, tasks, projects, documents, events, investors, pitch_decks |
| contacts | CRM contact records | id, startup_id, name, email, phone, company, role, linkedin_url, type, tags (text[]), relationship_strength, score, enrichment_data (jsonb) | belongs_to startups, has_many deals, communications, contact_tags. Self-ref via referred_by |
| deals | Sales pipeline | id, startup_id, contact_id, title, amount, currency, stage, probability, ai_insights (jsonb), closed_at | belongs_to startups, contacts. has_many tasks, communications |
| tasks | Task management | id, startup_id, project_id, deal_id, contact_id, title, description, status, priority, assigned_to, due_at, parent_task_id, created_by | belongs_to startups, projects, deals, contacts. Self-ref via parent_task_id |
| projects | Strategic initiatives | id, startup_id, name, description, status, progress (0-100), health, team_members (text[]), owner_id, due_date | belongs_to startups. has_many tasks |
| documents | All document types | id, startup_id, title, type, content (text), content_json (jsonb), status, ai_generated (boolean), quality_score | belongs_to startups |

---

## 4. Table Catalog — Features

### 4a. Investors

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| investors | Investor tracking | id, startup_id, name, firm_name, email, linkedin_url, stage_focus (text[]), investment_focus (text[]), check_size_min, check_size_max, geography, thesis_summary, fit_score, status, warm_paths (jsonb), engagement_history (jsonb) | belongs_to startups |

### 4b. Pitch Decks

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| pitch_decks | Deck metadata | id, startup_id, title, status, template_id, deck_type, slide_count, signal_strength (0-100), version, exported_url | belongs_to startups, deck_templates. has_many pitch_deck_slides |
| pitch_deck_slides | Individual slides | id, deck_id, slide_number, slide_type (13 types), title, content (jsonb), layout, score (0-100), ai_suggestions (jsonb), version | belongs_to pitch_decks |
| deck_templates | Reusable templates | id, name, category, theme, color_scheme (jsonb), structure (jsonb), is_public, usage_count, preview_url | has_many pitch_decks |

### 4c. Industry Knowledge

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| industry_packs | Industry knowledge bases | id, industry, sub_industry, benchmarks (jsonb), playbooks_summary (jsonb), competitive_intel (jsonb), market_size, growth_rate | has_many playbooks, wizard_sessions |
| playbooks | Strategy templates | id, pack_id, title, type, difficulty, content_structured (jsonb), prerequisites (text[]), estimated_duration | belongs_to industry_packs. has_many startup_playbooks |
| startup_playbooks | Playbook adoption tracking | id, startup_id, playbook_id, status, progress (0-100), match_confidence, started_at, completed_at | belongs_to startups, playbooks |
| benchmark_snapshots | Performance tracking | id, startup_id, industry_pack_id, benchmarks (jsonb), metrics (jsonb), percentiles (jsonb), snapshot_date | belongs_to startups, industry_packs |

---

## 5. Table Catalog — AI and Chat

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| ai_runs | AI execution audit | id, org_id, startup_id, user_id, agent_name, action, model, provider (gemini/claude), input_tokens, output_tokens, cost_usd, latency_ms, status, error_message | belongs_to organizations, startups, profiles |
| chat_sessions | Conversation containers | id, user_id, startup_id, title, summary, message_count, industry, persona, context_snapshot (jsonb), last_message_at | belongs_to profiles, startups. has_many chat_messages |
| chat_messages | Individual messages | id, session_id, user_id, role (user/assistant/system), content, sources (jsonb), suggested_actions (jsonb), routing (jsonb), model_used, tokens_used | belongs_to chat_sessions |
| chat_facts | Extracted knowledge (RAG) | id, user_id, startup_id, session_id, fact_type, content, confidence (0-1), embedding (vector), expires_at | belongs_to profiles, startups, chat_sessions |
| chat_pending | Queued AI suggestions | id, user_id, suggestion_type, content, status (pending/accepted/dismissed), reasoning, priority | belongs_to profiles |
| agent_configs | Per-agent settings | id, org_id, agent_name, model, system_prompt, temperature, max_tokens, daily_budget, monthly_budget, is_active | belongs_to organizations |

---

## 6. Table Catalog — Events

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| events | User-created events | id, startup_id, title, description, event_type, event_scope, location_type, location, start_date, end_date, status, agenda (jsonb), capacity, budget, registration_url | belongs_to startups. has_many attendees, venues, assets, sponsors, tasks, messages |
| event_attendees | Attendee management | id, event_id, name, email, phone, attendee_type, rsvp_status, checked_in, check_in_time, feedback_rating, feedback_text, dietary_needs | belongs_to events |
| event_venues | Venue tracking | id, event_id, name, address, capacity, rental_cost, amenities (jsonb), contact_name, contact_email, fit_score, status | belongs_to events |
| event_assets | Marketing materials | id, event_id, asset_type, title, content, status, platform, ai_generated, scheduled_at, published_at, engagement_metrics (jsonb), parent_asset_id | belongs_to events. Self-ref for variants |
| sponsors | Sponsor management | id, event_id, name, company, tier, amount, status, deliverables (jsonb), contact_name, contact_email | belongs_to events |
| startup_event_tasks | Event task dependencies | id, startup_event_id, task_id, category, blocks (text[]), depends_on (text[]), status | belongs_to events, tasks |
| messages | Event communications | id, startup_event_id, channel, direction, message_type, content, status, recipient_id, template_name, template_params (jsonb), sent_at | belongs_to events |
| industry_events | Public event directory | id, name, description, date, end_date, location, category, subcategory, url, image_url, price, organizer, tags (text[]), is_featured, attendee_count | Standalone, no startup FK |

---

## 7. Table Catalog — Auxiliary

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| activities | Business activity log | id, startup_id, activity_type, entity_type, entity_id, description, metadata (jsonb), created_by, is_system_generated | belongs_to startups |
| audit_log | Change tracking | id, action (insert/update/delete), table_name, record_id, old_data (jsonb), new_data (jsonb), actor_id, ip_address | Independent |
| notifications | User notifications | id, user_id, type, title, body, is_read, priority, link, expires_at | belongs_to profiles |
| file_uploads | Storage tracking | id, startup_id, filename, original_name, mime_type, size_bytes, storage_path, bucket, url, ai_summary, uploaded_by | belongs_to startups |
| wizard_sessions | Onboarding state machine | id, user_id, startup_id, status, current_step (1-4), form_data (jsonb), ai_enrichments (jsonb), extracted_data (jsonb), industry_pack_id, readiness_score | belongs_to profiles, startups, industry_packs |
| wizard_extractions | AI extraction results | id, session_id, extraction_type, extracted_data (jsonb), confidence (0-1), source_url, model_used | belongs_to wizard_sessions |
| proposed_actions | AI action proposals | id, org_id, startup_id, user_id, action_type, title, description, payload (jsonb), status, requires_approval, confidence | belongs_to organizations, startups |
| action_executions | Action results | id, action_id, status, result (jsonb), error_message, rolled_back_at | belongs_to proposed_actions |
| automation_rules | Event-driven automation | id, startup_id, trigger_type, trigger_config (jsonb), action_type, action_config (jsonb), requires_approval, is_active, last_triggered_at | belongs_to startups |
| integrations | Third-party connections | id, org_id, provider, access_token_encrypted, refresh_token_encrypted, scopes (text[]), status, expires_at | belongs_to organizations |
| communications | Contact interaction log | id, startup_id, contact_id, deal_id, type, direction, subject, content, sentiment, action_items (jsonb), occurred_at | belongs_to startups, contacts, deals |
| contact_tags | Contact categorization | id, contact_id, tag, color, created_by | belongs_to contacts |

---

## 8. Relationships and Foreign Keys

### Primary Data Chains

| Chain | Path | Purpose |
|-------|------|---------|
| Auth → Org → Startup → All | auth.users → profiles → organizations → startups → (all feature tables) | Multi-tenant data isolation |
| Startup → CRM | startups → contacts → deals → communications | Sales pipeline flow |
| Startup → Projects → Tasks | startups → projects → tasks (with subtasks via parent_task_id) | Work breakdown |
| Startup → Pitch | startups → pitch_decks → pitch_deck_slides | Deck generation |
| User → Chat | profiles → chat_sessions → chat_messages → chat_facts | Conversation flow |
| User → Onboarding | profiles → wizard_sessions → wizard_extractions → startups (created) | Onboarding flow |
| Startup → Events | startups → events → (attendees, venues, assets, sponsors, tasks, messages) | Event management |

### Cross-Entity Joins

| Join | Tables | Purpose |
|------|--------|---------|
| Task context | tasks JOIN projects, deals, contacts | Show task in context of parent entity |
| Deal pipeline | deals JOIN contacts JOIN communications | Full deal history with contact info |
| Activity feed | activities JOIN startups | Org-wide activity timeline |
| AI cost tracking | ai_runs JOIN agent_configs | Budget monitoring per agent |
| Event logistics | events JOIN venues JOIN sponsors JOIN attendees | Full event picture |
| Playbook progress | startup_playbooks JOIN playbooks JOIN industry_packs | Strategy execution |

### Self-Referencing Relationships

| Table | Column | Purpose |
|-------|--------|---------|
| tasks | parent_task_id → tasks.id | Subtask hierarchy |
| contacts | referred_by → contacts.id | Referral tracking |
| event_assets | parent_asset_id → event_assets.id | Asset variants |
| startup_event_tasks | blocks, depends_on → startup_event_tasks.id | Task dependency graph |

---

## 9. Indexes

### Indexes by Access Pattern

| Table | Index Name | Columns | Access Pattern |
|-------|-----------|---------|----------------|
| profiles | idx_profiles_org | org_id | All org member lookups |
| profiles | idx_profiles_email | email | Login, search |
| startups | idx_startups_org | org_id | Org-scoped startup list |
| startups | idx_startups_industry | industry | Industry filtering |
| contacts | idx_contacts_startup | startup_id | CRM contact list |
| contacts | idx_contacts_type | startup_id, type | Filtered contact views |
| contacts | idx_contacts_score | startup_id, score DESC | Lead score sorting |
| deals | idx_deals_startup | startup_id | Deal list |
| deals | idx_deals_stage | startup_id, stage | Pipeline kanban columns |
| deals | idx_deals_contact | contact_id | Deals per contact |
| tasks | idx_tasks_startup | startup_id | Task list |
| tasks | idx_tasks_project | project_id | Project detail tasks |
| tasks | idx_tasks_status | startup_id, status | Kanban columns |
| tasks | idx_tasks_priority | startup_id, priority, due_at | Priority sorting |
| tasks | idx_tasks_parent | parent_task_id | Subtask lookup |
| projects | idx_projects_startup | startup_id | Project list |
| documents | idx_documents_startup | startup_id | Document library |
| documents | idx_documents_type | startup_id, type | Filtered doc views |
| investors | idx_investors_startup | startup_id | Investor list |
| investors | idx_investors_fit | startup_id, fit_score DESC | Fit score sorting |
| investors | idx_investors_status | startup_id, status | Pipeline columns |
| pitch_decks | idx_decks_startup | startup_id | Deck list |
| pitch_deck_slides | idx_slides_deck | deck_id, slide_number | Ordered slide list |
| events | idx_events_startup | startup_id | Event list |
| events | idx_events_date | start_date | Calendar view |
| industry_events | idx_ind_events_date | date | Directory sorting |
| industry_events | idx_ind_events_cat | category | Filtered directory |
| chat_sessions | idx_chat_user | user_id | Chat history |
| chat_messages | idx_chat_msg_session | session_id | Message thread |
| chat_facts | idx_facts_user | user_id, startup_id | RAG lookup |
| chat_facts | idx_facts_embedding | embedding (vector) | Semantic search |
| ai_runs | idx_ai_runs_org | org_id, created_at | Cost dashboard |
| ai_runs | idx_ai_runs_agent | agent_name, created_at | Per-agent analytics |
| activities | idx_activities_startup | startup_id, created_at DESC | Activity feed |
| audit_log | idx_audit_table | table_name, record_id | Record history |
| wizard_sessions | idx_wizard_user | user_id | Session lookup |
| wizard_extractions | idx_extractions_session | session_id | Extraction lookup |
| notifications | idx_notif_user | user_id, is_read | Unread count |
| event_attendees | idx_attendees_event | event_id | Attendee list |
| sponsors | idx_sponsors_event | event_id | Sponsor list |

### Dashboard Composite Indexes

| Index | Columns | Dashboard Widget |
|-------|---------|------------------|
| idx_dash_tasks_pending | startup_id, status WHERE status = 'pending' | KPI card: pending tasks |
| idx_dash_deals_active | startup_id, stage WHERE stage NOT IN ('won','lost') | Pipeline value |
| idx_dash_decks_recent | startup_id, updated_at DESC | Deck activity |
| idx_dash_events_upcoming | date WHERE date > now() | Upcoming events |

---

## 10. Row Level Security (RLS)

### RLS Strategy by Level

| Level | Policy Pattern | Applied To |
|-------|---------------|------------|
| User-level | auth.uid() = user_id | profiles, user_roles, chat_sessions, chat_messages, chat_facts, chat_pending, notifications, wizard_sessions |
| Org-level | org_id = user_org_id() | organizations, org_members, agent_configs, integrations, ai_runs, proposed_actions |
| Startup-level | startup_id IN (SELECT id FROM startups WHERE org_id = user_org_id()) | contacts, deals, tasks, projects, documents, investors, events, pitch_decks, activities, communications, file_uploads |
| Nested-level | Via parent table join | pitch_deck_slides (deck → startup → org), event_attendees (event → startup → org), wizard_extractions (session → user) |
| Public | Authenticated read | industry_events, deck_templates (is_public = true), industry_packs |

### RLS Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Own record or same org | Own record only | Own record only | Not allowed |
| organizations | Member of org | Admin only | Admin only | Not allowed |
| startups | Org member | Org member | Org member | Org admin |
| contacts | Org member (via startup) | Org member | Org member | Org member |
| deals | Org member (via startup) | Org member | Org member | Org member |
| tasks | Org member (via startup) | Org member | Org member or assigned_to | Org member |
| projects | Org member (via startup) | Org member | Org member or owner_id | Org admin |
| documents | Org member (via startup) | Org member | Org member | Org member |
| investors | Org member (via startup) | Org member | Org member | Org member |
| pitch_decks | Org member (via startup) | Org member | Org member | Org member |
| pitch_deck_slides | Org member (via deck → startup) | Org member | Org member | Org member |
| events | Org member (via startup) | Org member | Org member | Org admin |
| event_attendees | Org member (via event) | Org member | Org member | Org member |
| chat_sessions | Own sessions only | Own sessions only | Own sessions only | Own sessions only |
| chat_messages | Own sessions only | Own sessions only | Not allowed | Not allowed |
| ai_runs | Org member | System only (edge functions) | Not allowed | Not allowed |
| wizard_sessions | Own sessions only | Own sessions only | Own sessions only | Not allowed |
| industry_events | All authenticated users | Admin only | Admin only | Admin only |
| deck_templates | Public or own org | Admin only | Admin only | Admin only |
| notifications | Own notifications | System only | Own (mark read) | Own |
| audit_log | Admin only | System only | Not allowed | Not allowed |

### RLS Helper Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| user_org_id | user_org_id() → uuid | Returns current user's org_id from profiles |
| is_org_member | is_org_member(check_org_id uuid) → boolean | Checks if user belongs to given org |
| org_role | org_role() → text | Returns user's role in their org |
| startup_in_org | startup_in_org(check_startup_id uuid) → boolean | Validates startup belongs to user's org |
| slide_in_org | slide_in_org(slide_deck_id uuid) → boolean | Validates slide's deck belongs to user's org |
| has_role | has_role(_role app_role, _user_id uuid) → boolean | Checks user has specific app role |
| get_user_role | get_user_role(_user_id uuid) → app_role | Returns user's app role |

---

## 11. Database Functions

### Business Logic Functions

| Function | Purpose | Called By | Parameters |
|----------|---------|-----------|------------|
| complete_wizard_atomic | Atomically creates org, startup, profile links on wizard completion | onboarding-agent | session_id, user_id, form_data, extracted_data, readiness_score |
| process_answer_atomic | Saves interview answer and updates session state atomically | onboarding-agent | session_id, topic, answer, extracted_signals |
| log_activity | Creates activity record for audit trail | All edge functions, triggers | startup_id, activity_type, entity_type, entity_id, description, metadata |
| increment_template_usage | Increments usage_count on deck_templates | pitch-deck-agent | template_id |

### Utility Functions

| Function | Purpose | Used In |
|----------|---------|---------|
| user_org_id | Get current user's org | All RLS policies |
| is_org_member | Check org membership | RLS policies, edge functions |
| org_role | Get user's org role | Admin-gated policies |
| startup_in_org | Validate startup access | Startup-scoped RLS |
| slide_in_org | Validate slide access | Slide-scoped RLS |
| has_role | Check app role | Admin features |
| get_user_role | Get app role | Role-based UI |

---

## 12. Database Triggers

### Existing Triggers

| Trigger | Table | Event | Action |
|---------|-------|-------|--------|
| on_auth_user_created | auth.users | AFTER INSERT | Creates matching profiles row with default values |
| on_profile_updated | profiles | AFTER UPDATE | Logs activity, updates updated_at |
| on_startup_updated | startups | AFTER UPDATE | Logs activity, broadcasts to dashboard channel |
| on_deal_stage_changed | deals | AFTER UPDATE (stage) | Logs activity, triggers AI rescore |
| on_task_status_changed | tasks | AFTER UPDATE (status) | Logs activity, recalculates project progress |
| on_document_updated | documents | AFTER UPDATE | Logs activity |

### Realtime Triggers (Planned)

| Trigger | Table | Event | Broadcasts To | Condition |
|---------|-------|-------|---------------|-----------|
| rt_wizard_enrichment | wizard_sessions | AFTER UPDATE | onboarding:{id}:events | ai_enrichments or current_step changes |
| rt_canvas_change | documents | AFTER UPDATE | canvas:{id}:events | type = 'lean_canvas' AND content_json changes |
| rt_deal_score | deals | AFTER UPDATE | crm:{startup_id}:events | stage or score changes |
| rt_deck_status | pitch_decks | AFTER UPDATE | pitchdeck:{id}:events | status changes |
| rt_ai_task | tasks | AFTER INSERT | tasks:{startup_id}:events | created_by = 'ai' |
| rt_startup_change | startups | AFTER UPDATE | dashboard:{user_id}:events | Any profile field changes |

---

## 13. Edge Functions (14 Deployed)

### Function Catalog

| # | Function | Actions | AI Model | Auth | Purpose |
|---|----------|---------|----------|------|---------|
| 1 | ai-chat | 5+ actions | Gemini Flash + Claude Sonnet/Opus | JWT | Multi-model AI routing hub |
| 2 | onboarding-agent | 12 actions | Gemini Flash + URL Context + Google Search | JWT | 4-step wizard AI enrichment |
| 3 | lean-canvas-agent | 5 actions | Gemini Flash | JWT | Canvas prefill, suggest, validate |
| 4 | pitch-deck-agent | 14 actions | Gemini Pro | JWT | Full pitch deck lifecycle |
| 5 | crm-agent | 15 actions | Gemini Flash + Google Search | JWT | CRM intelligence |
| 6 | investor-agent | 12 actions | Gemini Flash + Google Search | JWT | Fundraising intelligence |
| 7 | documents-agent | 6 actions | Gemini Flash | JWT | Document AI |
| 8 | event-agent | 8 actions | Gemini Flash | JWT | Event planning AI |
| 9 | chatbot-agent | 22 actions | Gemini Flash + Thinking | JWT | Industry-aware AI advisor |
| 10 | whatsapp-agent | 6 actions | None (API relay) | JWT + webhook | WhatsApp Business |
| 11 | generate-image | 4 actions | Gemini Image | JWT | AI image generation |
| 12 | health | 1 action | None | Public | System health check |
| 13 | auth-check | 1 action | None | JWT | Auth diagnostics |
| 14 | stripe-webhook | 7 actions | None | Stripe signature | Payment processing |

### Edge Function Actions Detail

| Agent | Action | Input | Output | Target Table |
|-------|--------|-------|--------|-------------|
| onboarding-agent | enrich_url | URL string | Company name, description, team, traction | wizard_extractions |
| onboarding-agent | enrich_context | Description, market | Competitors, trends, market data | wizard_extractions |
| onboarding-agent | enrich_founder | LinkedIn URL | Name, title, experience, education | wizard_extractions |
| onboarding-agent | calculate_readiness | All extracted data | Score 0-100, category breakdown | wizard_sessions |
| onboarding-agent | get_questions | Topic, context | 1-2 dynamic questions | Returned to UI |
| onboarding-agent | process_answer | Topic, answer | Extracted signals, quality score | wizard_extractions |
| onboarding-agent | calculate_score | All data | Final investor score | wizard_sessions |
| onboarding-agent | generate_summary | All data | AI narrative summary | wizard_sessions |
| onboarding-agent | complete_wizard | Session data | Org + startup + profile | organizations, startups, profiles |
| lean-canvas-agent | prefill_canvas | Startup data | 9 box contents | documents |
| lean-canvas-agent | suggest_box | Box key, content | 3 suggestions | Returned to UI |
| lean-canvas-agent | validate_canvas | All 9 boxes | Per-box scores, overall | Returned to UI |
| pitch-deck-agent | generate_deck | Template, startup data | 12 slides with content | pitch_decks, pitch_deck_slides |
| pitch-deck-agent | refine_slide | Slide content, context | Enhanced content | pitch_deck_slides |
| pitch-deck-agent | score_slide | Slide content | Score 0-100, suggestions | pitch_deck_slides |
| pitch-deck-agent | research_market | Competitor URLs | Market data, benchmarks | Returned to UI |
| pitch-deck-agent | export_deck | Deck ID, format | PDF/PPTX URL | pitch_decks |
| crm-agent | enrich_contact | LinkedIn URL or name | Full profile data | contacts |
| crm-agent | score_lead | Contact data | Score 0-100 | contacts |
| crm-agent | score_deal | Deal + contact data | Probability 0-100, next steps | deals |
| crm-agent | analyze_pipeline | All deals | Bottlenecks, forecast | Returned to UI |
| crm-agent | generate_email | Contact + startup context | Email draft | Returned to UI |
| crm-agent | detect_duplicate | Contact data | Match list | Returned to UI |
| investor-agent | discover_investors | Startup profile | Ranked investor list | investors |
| investor-agent | analyze_investor_fit | Investor + startup data | Fit score breakdown | investors |
| investor-agent | find_warm_paths | Investor profile | Mutual connections | Returned to UI |
| investor-agent | generate_outreach | Investor + startup data | Personalized email | Returned to UI |
| documents-agent | generate_document | Template type, startup data | Document content | documents |
| documents-agent | analyze_document | Document content | Quality score, suggestions | Returned to UI |
| documents-agent | search_documents | Query string | Ranked results | Returned to UI |
| event-agent | generate_plan | Event details | Timeline, tasks, budget | events, startup_event_tasks |
| event-agent | generate_marketing | Event details | Social posts, emails | event_assets |
| event-agent | search_sponsors | Event theme, industry | Ranked sponsor list | sponsors |
| event-agent | search_venues | Event requirements | Ranked venue list | event_venues |
| chatbot-agent | chat_message | Message, context | Response with sources | chat_messages |
| chatbot-agent | get_benchmarks | Industry, metric | Industry benchmarks | chat_messages |
| chatbot-agent | route_to_dashboard | Actionable request | Module link + context | Returned to UI |
| chatbot-agent | detect_industry | First message | Industry, persona | chat_sessions |
| chatbot-agent | rag_search | Query | Relevant facts | Returned to UI |
| ai-chat | prioritize_tasks | Task list, context | Ranked list with reasoning | tasks |
| ai-chat | generate_tasks | Project description | 5-10 tasks with priorities | tasks |
| ai-chat | complex_analysis | Multi-source data | Strategic analysis | chat_messages |

### Shared Modules

| Module | Path | Used By | Purpose |
|--------|------|---------|---------|
| cors | _shared/cors.ts | All functions | CORS headers for browser |
| supabase-client | _shared/supabase.ts | All functions | Authenticated Supabase client |
| gemini | _shared/gemini.ts | AI agents | Gemini API wrapper |
| claude | _shared/claude.ts | ai-chat | Claude SDK wrapper |
| error-handler | _shared/errors.ts | All functions | Standard error responses |
| rate-limiter | _shared/rate-limit.ts | AI agents | Per-user rate limiting |
| cost-tracker | _shared/costs.ts | AI agents | ai_runs logging |

---

## 14. AI Agent Architecture

### Agent Routing Matrix

| User Action | Screen | Edge Function | AI Model | Input | Output | Target Table |
|-------------|--------|---------------|----------|-------|--------|-------------|
| Paste company URL | Onboarding Step 1 | onboarding-agent | Gemini Flash + URL Context | URL | Company data | wizard_extractions |
| Enter description | Onboarding Step 1 | onboarding-agent | Gemini Flash + Google Search | Text | Competitors, trends | wizard_extractions |
| Enter LinkedIn | Onboarding Step 1 | onboarding-agent | Gemini Flash + URL Context | URL | Founder profile | wizard_extractions |
| View analysis | Onboarding Step 2 | onboarding-agent | Gemini Flash | Extracted data | Score 0-100 | wizard_sessions |
| Answer question | Onboarding Step 3 | onboarding-agent | Gemini Flash | Topic, answer | Signals, quality | wizard_extractions |
| Click Complete | Onboarding Step 4 | onboarding-agent | None (DB) | Session | Records | orgs, startups, profiles |
| Click AI Prefill | Lean Canvas | lean-canvas-agent | Gemini Flash | Startup data | 9 boxes | documents |
| Select box | Lean Canvas | lean-canvas-agent | Gemini Flash | Box key | 3 suggestions | UI only |
| Click Validate | Lean Canvas | lean-canvas-agent | Gemini Flash | All boxes | Scores | UI only |
| Generate deck | Pitch Wizard | pitch-deck-agent | Gemini Pro | Template + data | 12 slides | pitch_decks, slides |
| Improve slide | Pitch Editor | pitch-deck-agent | Gemini Pro | Slide + context | Enhanced | pitch_deck_slides |
| Click Enrich | CRM Contact | crm-agent | Gemini Flash + Search | URL or name | Profile | contacts |
| Stage change | CRM Deal | crm-agent | Gemini Flash | Deal data | Probability | deals |
| Analyze pipeline | CRM | crm-agent | Gemini Flash | All deals | Insights | UI only |
| Generate email | CRM | crm-agent | Gemini Flash | Contact + startup | Draft | UI only |
| Discover investors | Investors | investor-agent | Gemini Flash + Search | Startup profile | Ranked list | investors |
| Score fit | Investors | investor-agent | Gemini Flash | Investor + startup | Breakdown | investors |
| Generate outreach | Investors | investor-agent | Gemini Flash | Investor + startup | Email | UI only |
| Generate doc | Documents | documents-agent | Gemini Flash | Type + data | Content | documents |
| Analyze doc | Documents | documents-agent | Gemini Flash | Content | Score | UI only |
| Send message | AI Chat | chatbot-agent | Gemini Flash | Message + context | Response | chat_messages |
| Ask benchmarks | AI Chat | chatbot-agent | Gemini + RAG | Industry, metric | Data | chat_messages |
| Plan event | Events | event-agent | Gemini Flash | Event details | Plan | events, tasks |
| Marketing | Events | event-agent | Gemini Flash | Event details | Copy | event_assets |
| Find sponsors | Events | event-agent | Gemini + Search | Theme | List | sponsors |
| Prioritize tasks | Tasks | ai-chat | Claude Sonnet | Tasks + context | Ranked | tasks |
| Generate tasks | Tasks | ai-chat | Claude Haiku | Description | 5-10 tasks | tasks |
| Complex analysis | Dashboard | ai-chat | Claude Opus | Multi-source | Analysis | chat_messages |

### Agent Cost Tracking

| Agent | Model | Avg Input Tokens | Avg Output Tokens | Avg Cost Per Call | Daily Budget |
|-------|-------|------------------|-------------------|-------------------|-------------|
| onboarding-agent | Gemini Flash | 2,000 | 1,500 | $0.002 | $5.00 |
| lean-canvas-agent | Gemini Flash | 1,500 | 800 | $0.001 | $3.00 |
| pitch-deck-agent | Gemini Pro | 3,000 | 2,000 | $0.008 | $10.00 |
| crm-agent | Gemini Flash | 1,800 | 1,000 | $0.002 | $5.00 |
| investor-agent | Gemini Flash | 2,000 | 1,200 | $0.002 | $5.00 |
| documents-agent | Gemini Flash | 2,500 | 1,500 | $0.002 | $3.00 |
| chatbot-agent | Gemini Flash | 3,000 | 1,500 | $0.003 | $8.00 |
| event-agent | Gemini Flash | 1,500 | 1,000 | $0.002 | $3.00 |
| ai-chat (Claude) | Sonnet/Opus | 2,000-5,000 | 1,000-3,000 | $0.01-$0.08 | $15.00 |

---

## 15. Gemini 3 Features and Tools

### Feature Usage Matrix

| Gemini Feature | Description | Agents Using It | How Used |
|----------------|-------------|-----------------|----------|
| URL Context | Extract structured data from any URL without scraping | onboarding-agent, pitch-deck-agent, crm-agent | Pass URL, Gemini reads page, extracts fields. Company enrichment, competitor research, investor profiles |
| Google Search Grounding | Real-time web search results as AI context | onboarding-agent, crm-agent, investor-agent, event-agent | Grounds responses in current data. Market sizes, competitor info, portfolios. Includes source citations |
| Structured Output | JSON schema-constrained responses | All 8 AI agents | Every call specifies a JSON schema. Returns typed objects. Eliminates parsing failures |
| Thinking Mode | Extended reasoning before response | chatbot-agent | Complex strategic questions. Multi-step analysis before responding. Benchmarking, pivot analysis |
| Function Calling | Tool use within conversation | chatbot-agent | AI calls dashboard functions: create_task, score_deal, navigate_to. Enables "do this for me" |
| Image Generation | Create images from prompts | generate-image | Event marketing graphics, pitch deck visuals, social media assets |
| Multimodal Input | Process images, PDFs, documents | documents-agent, pitch-deck-agent | Analyze uploaded PDFs, extract text from images, understand layouts |

### Gemini Model Selection

| Model | Speed | Cost | Quality | Used For |
|-------|-------|------|---------|----------|
| gemini-3-flash-preview | 1-3s | Low | Good | Most actions: enrichment, scoring, suggestions, chat |
| gemini-3-pro-preview | 3-8s | Medium | High | Pitch deck generation, complex documents |
| gemini-3-flash (thinking) | 2-5s | Low | High reasoning | Strategic analysis, benchmarks |

### Gemini Integration Flow

| Step | What Happens | Data Flow |
|------|-------------|-----------|
| 1. Request | Frontend calls edge function | Browser → Edge Function |
| 2. Context Build | Gather startup, user, relevant records | Edge Function → Supabase DB |
| 3. Prompt Assembly | System prompt + context + input + schema | Internal |
| 4. Gemini Call | POST with model, prompt, tools, schema | Edge Function → Gemini API |
| 5. Parse | Validate JSON against schema | Internal |
| 6. Store | Write to target table(s), log to ai_runs | Edge Function → DB |
| 7. Broadcast | Send realtime event | Edge Function → Realtime |
| 8. Return | Response to frontend | Edge Function → Browser |

---

## 16. Claude SDK Agents and Tools

### Claude Model Usage

| Model | Model ID | Agent | Action | Purpose |
|-------|----------|-------|--------|---------|
| Claude Sonnet 4.5 | claude-sonnet-4-5 | ai-chat | prioritize_tasks | Task ranking by impact, urgency, dependencies. Business context reasoning |
| Claude Haiku 4.5 | claude-haiku-4-5 | ai-chat | generate_tasks | Fast task generation from project descriptions |
| Claude Opus 4.5 | claude-opus-4-5 | ai-chat | complex_analysis | Deep strategic analysis: pivots, fundraising, competitive positioning |

### Claude vs Gemini Routing

| Signal | Route To | Reason |
|--------|----------|--------|
| Chat, enrich, extract, score, suggest | Gemini Flash | Speed, cost, structured output native |
| Prioritize, rank, evaluate tradeoffs | Claude Sonnet | Superior reasoning about priorities |
| Generate tasks from description | Claude Haiku | Fast generation with good quality |
| Complex multi-factor strategic analysis | Claude Opus | Deepest reasoning, handles ambiguity |
| Requires URL reading | Gemini (URL Context) | Native feature, no scraping |
| Requires current web data | Gemini (Google Search) | Native grounding with citations |
| Requires image understanding | Gemini (Multimodal) | Native vision capability |

### Claude Integration Flow

| Step | What Happens | Data Flow |
|------|-------------|-----------|
| 1. Route | ai-chat determines action needs Claude | Internal |
| 2. Context | Gather startup, tasks, deals, strategy | Edge Function → DB |
| 3. Call | Anthropic SDK with model, prompt, tools | Edge Function → Claude API |
| 4. Tool Use | Claude may call tools (create_task, etc.) | Claude → Edge Function → DB |
| 5. Response | Structured result returned | Edge Function → Browser |
| 6. Log | Tokens, cost, latency to ai_runs | Edge Function → ai_runs |

---

## 17. Data Flow Diagrams

### 17a. Dashboard Aggregation

```
startups ──────┐
tasks ─────────┤
deals ─────────┤──→ useDashboardData (React Query) ──→ Dashboard.tsx
investors ─────┤        │
pitch_decks ───┤        ├── health_score (weighted composite)
events ────────┤        ├── kpi_cards (4 counts)
ai_runs ───────┘        ├── deck_activity (latest 3)
                        ├── insights (AI-generated, cached daily)
                        ├── stage_guidance (AI per stage)
                        └── risk_alerts (conditional queries)
```

### 17b. Onboarding Wizard

```
User Input → onboarding-agent → Gemini (3 parallel enrichments) → wizard_extractions
                                                                         │
wizard_extractions → calculate_readiness → wizard_sessions.readiness_score
                                                    │
User Answers → process_answer_atomic → wizard_extractions (interview type)
                                                    │
All Data → calculate_score + generate_summary → wizard_sessions (final)
                                                    │
Click Complete → complete_wizard_atomic → organizations + startups + profiles
```

### 17c. CRM Pipeline

```
User adds contact → crm-agent (enrich + score) → contacts (enriched, scored)
                                                      │
Deal created → crm-agent (score_deal) → deals (probability, insights)
                                              │
Stage dragged → DB trigger → crm-agent (rescore) → deals (updated)
                                                         │
User clicks Analyze → crm-agent (analyze_pipeline) → UI (bottlenecks, forecast)
```

### 17d. Pitch Deck Generation

```
Template + Context → pitch-deck-agent → Gemini Pro (per-slide loop)
                                              │
                                    For each of 12 slides:
                                    1. Generate content
                                    2. Score 0-100
                                    3. Save → pitch_deck_slides
                                    4. Broadcast slide_completed
                                              │
                                    All slides done → deck_ready event
                                    → signal_strength calculated
```

### 17e. AI Chat Routing

```
User message → chatbot-agent → detect intent
                                    │
                    ┌───────────────┼───────────────────┐
                    │               │                   │
              Gemini Flash    Gemini Thinking    Claude (via ai-chat)
              (chat, score)   (strategic)        (prioritize, generate)
                    │               │                   │
                    └───────────────┼───────────────────┘
                                    │
                              Response saved → chat_messages
                              Facts extracted → chat_facts
                              Actions suggested → UI
```

### 17f. Cross-Module Sync

```
startups.target_market changed ("SMB" → "Mid-Market")
    │
    ├──→ Dashboard: health_score recalculated
    ├──→ CRM: contact filters update, deal scoring adjusts
    ├──→ Tasks: priorities shift (enterprise up, SMB down)
    ├──→ Lean Canvas: customer_segments flagged
    ├──→ Pitch Deck: market slide marked for refresh
    ├──→ Investors: fit scores recalculate
    └──→ Chatbot: context_snapshot updated
```

---

## 18. Automation and Workflow Logic

### Automation Rules Engine

| Trigger Type | Example | Action | Approval |
|-------------|---------|--------|----------|
| deal_stage_changed | stage = 'won' | Create task: "Send onboarding email" | No |
| deal_stage_changed | stage = 'lost' | Create task: "Schedule post-mortem" | No |
| deal_idle | days_in_stage > 14 | Notify: "Deal stalling" | No |
| contact_created | type = 'investor' | Invoke investor-agent → score_fit | No |
| contact_score_updated | score >= 80 | Notify: "Hot lead" | No |
| task_overdue | due_at < now() | Notify: "Task overdue" | No |
| startup_updated | readiness_score changed | Invoke ai-chat → recalculate_health | No |
| wizard_completed | status = 'completed' | Invoke ai-chat → generate_30_60_90 | Yes |
| deck_generated | status = 'final' | Invoke pitch-deck-agent → score_all | No |
| event_approaching | days_until < 7 | Notify: "Event in 7 days" | No |

### Proposed Actions Workflow

| Step | Actor | Table | Status |
|------|-------|-------|--------|
| 1. AI proposes | Edge function | proposed_actions | pending |
| 2. User reviews | User | Shown in right panel | pending |
| 3a. Approve | User clicks Approve | proposed_actions | approved |
| 3b. Reject | User clicks Dismiss | proposed_actions | rejected |
| 4. Execute | System | action_executions | success/failed |
| 5. Rollback | User or system | action_executions | rolled_back |

### Human Approval Gates

| Action Category | Requires Approval | Auto-Approved |
|----------------|-------------------|---------------|
| Send email to external contact | Always | Never |
| Create tasks from AI | First time yes, then auto | After 5 approved |
| Modify deal stage | No | Always |
| Update startup profile | No | Always |
| Delete any record | Always | Never |
| Generate document | No | Always |
| Score/rank (read-only) | No | Always |
| Cross-module strategy sync | Always | Never |
| Pivot recommendation | Always | Never |

---

## 19. Wizard Data Flows

### Onboarding Data Map

| Step | User Input | AI Extraction | Stored In | Downstream Use |
|------|-----------|---------------|-----------|----------------|
| 1a: URL | Company website URL | Company name, description, team, traction, social links | wizard_extractions (type: url) | startups.name, description, website, traction_data |
| 1b: Context | Description, target market | Competitors (3-5), trends, industry classification | wizard_extractions (type: context) | startups.industry, industry_pack_id |
| 1c: Founder | LinkedIn URL | Name, title, experience, education, skills | wizard_extractions (type: founder) | profiles.full_name, startups.team_data |
| 2: Analysis | Automatic | Score 0-100, breakdown (brand, traction, team, market, funding) | wizard_sessions.readiness_score | startups.investor_ready_score, dashboard health |
| 3: Interview | 5 topic answers | Signals per answer, quality score | wizard_extractions (type: interview) | startups fields enrichment |
| 4: Complete | Click Complete | Final score, AI summary, atomic record creation | orgs, startups, profiles | All modules |

### Wizard Completion Cascade

| Record Created | Table | Populated From |
|---------------|-------|----------------|
| Organization | organizations | Name from startup, slug auto-generated |
| Startup | startups | All wizard_extractions merged: name, description, website, industry, stage, traction_data, investor_ready_score, team_size, business_model |
| Profile Link | profiles | org_id set, onboarding_completed = true |
| Initial Tasks | tasks | ai-chat → generate_tasks based on stage and gaps |
| Industry Pack | wizard_sessions | pack_id linked for chatbot persona and benchmarks |

---

## 20. Dashboard Data Aggregation

### KPI Card Sources

| KPI | Query | Table | Refresh Trigger |
|-----|-------|-------|-----------------|
| Decks | COUNT pitch_decks WHERE startup_id = X | pitch_decks | Deck created/deleted |
| Investors | COUNT investors WHERE startup_id = X | investors | Investor added |
| Tasks | COUNT tasks WHERE startup_id = X AND status != 'completed' | tasks | Task created/completed |
| Events | COUNT events WHERE startup_id = X AND start_date > now() | events | Event created |

### Health Score Calculation

| Category | Weight | Data Source | Scoring |
|----------|--------|-------------|---------|
| Brand Story | 20% | startups.description, documents (exec_summary) | Has description (20pts), has exec summary (40pts), quality > 70 (40pts) |
| Traction | 25% | startups.traction_data (MRR, users, growth) | Has MRR (30pts), has users (30pts), growth > 10% MoM (40pts) |
| Team | 20% | startups.team_size, wizard_extractions (founder) | Has founder profile (30pts), team > 2 (30pts), relevant experience (40pts) |
| Market | 20% | startups.industry, documents (market analysis) | Industry defined (20pts), TAM defined (40pts), competitors mapped (40pts) |
| Fundraising | 15% | pitch_decks, investors, deals | Has pitch deck (30pts), has investors (30pts), active deals (40pts) |

### Dashboard Widget Queries

| Widget | Data Needed | Tables | Aggregation |
|--------|-------------|--------|-------------|
| Greeting | User name | profiles | Single row |
| Health Score | Category scores | startups, documents, pitch_decks, investors, deals, wizard_extractions | Weighted sum |
| KPI Cards | Entity counts | pitch_decks, investors, tasks, events | COUNT per table |
| Deck Activity | Recent edits | pitch_decks | Latest 3 by updated_at |
| Insights | AI analysis | ai-chat → stage_guidance | Cached daily |
| Stage Guidance | Stage + next steps | startups.stage + AI | AI-generated |
| Upcoming Events | Next events | events/industry_events WHERE date > now() | Nearest 2 |
| Strategy Feed | AI actions | ai_runs | Latest 10 by created_at |
| Risk Alerts | Active risks | deals (stalled), tasks (overdue), startups (score drops) | Conditional |
| Alignment Gauge | Task-strategy match | tasks + startups.strategy | AI-scored |

---

## Appendix: Enum Reference

### Core Enums

| Enum | Values |
|------|--------|
| app_role | admin, moderator, user |
| activity_type | task_created, task_completed, deal_created, deal_stage_changed, contact_created, contact_enriched, email_sent, call_logged, meeting_scheduled, ai_enrichment, ai_generation, project_created, deck_generated, deck_exported, canvas_validated, event_created, investor_added, strategy_synced |

### CRM Enums

| Enum | Values |
|------|--------|
| deal_stage | lead, qualified, proposal, negotiation, won, lost |
| contact_type | customer, partner, investor, advisor, other |
| communication_type | email, call, meeting, note, linkedin |
| communication_direction | inbound, outbound |
| communication_sentiment | positive, neutral, negative |

### Pitch Deck Enums

| Enum | Values |
|------|--------|
| slide_type | title, problem, solution, product, market, business_model, traction, competition, team, financials, ask, contact, custom |
| pitch_deck_status | draft, in_progress, review, final, archived |
| template_category | startup, series_a, series_b, growth, enterprise, saas, marketplace, fintech, healthtech, general, custom |

### Event Enums

| Enum | Values |
|------|--------|
| event_status | scheduled, in_progress, completed, cancelled, rescheduled |
| event_type | meeting, deadline, reminder, milestone, call, demo, pitch, funding_round, other |
| event_scope | internal, hosted, external |
| event_location_type | in_person, virtual, hybrid |
| event_task_category | planning, venue, sponsors, speakers, marketing, registration, logistics, catering, av_tech, content, communications, post_event, other |
| attendee_type | general, vip, speaker, panelist, sponsor_rep, press, investor, founder, mentor, staff, volunteer |
| rsvp_status | invited, pending, registered, confirmed, waitlist, declined, cancelled, no_show |
| venue_status | researching, shortlisted, contacted, visiting, negotiating, booked, cancelled, rejected |
| sponsor_status | prospect, researching, contacted, negotiating, interested, confirmed, declined, cancelled |
| sponsor_tier | platinum, gold, silver, bronze, in_kind, media, community |

### Asset and Message Enums

| Enum | Values |
|------|--------|
| event_asset_type | social_post, email, graphic, banner, flyer, press_release, blog_post, video, landing_page, registration_form, agenda, speaker_bio, sponsor_logo_pack, photo, other |
| asset_status | draft, review, approved, scheduled, published, failed, archived |
| asset_platform | twitter, linkedin, instagram, facebook, tiktok, youtube, email, website, whatsapp, press, internal, other |
| message_channel | whatsapp, sms, email, in_app |
| message_direction | inbound, outbound |
| message_status | pending, sent, delivered, read, failed, cancelled |
| message_type | text, template, broadcast, image, document, location, contact, interactive |

### Task and Project Enums

| Enum | Values |
|------|--------|
| task_status | pending, in_progress, completed |
| task_priority | low, medium, high, urgent |
| project_status | active, completed, archived |
| project_health | on_track, at_risk, behind |

### Investor Enums

| Enum | Values |
|------|--------|
| investor_status | researching, reached_out, meeting, due_diligence, term_sheet, closed |
