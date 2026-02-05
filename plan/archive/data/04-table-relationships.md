# Table Relationships - StartupAI

> **Generated:** 2026-02-02 | **Source:** MCP Supabase | **Schema:** public

---

## Entity Relationship Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  organizations  │────<│   org_members   │>────│    profiles     │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │                                               │
         │                                               │
         ▼                                               │
┌─────────────────┐                                      │
│    startups     │<─────────────────────────────────────┘
└────────┬────────┘
         │
    ┌────┴────┬─────────┬─────────┬─────────┬─────────┐
    │         │         │         │         │         │
    ▼         ▼         ▼         ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ tasks │ │ docs  │ │contacts│ │ deals │ │canvas │ │events │
└───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
```

---

## Core Relationships

### Organization Hierarchy

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| organizations | org_members | org_members.org_id → organizations.id | Org membership |
| organizations | startups | startups.org_id → organizations.id | Org's startups |
| organizations | profiles | profiles.org_id → organizations.id | User's primary org |
| organizations | ai_runs | ai_runs.org_id → organizations.id | AI cost tracking |
| organizations | integrations | integrations.org_id → organizations.id | Third-party apps |
| organizations | agent_configs | agent_configs.org_id → organizations.id | AI configuration |
| organizations | proposed_actions | proposed_actions.org_id → organizations.id | AI proposals |
| organizations | audit_log | audit_log.org_id → organizations.id | Audit trail |

---

### User Relationships

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| auth.users | profiles | profiles.id → auth.users.id | User profile |
| auth.users | org_members | org_members.user_id → auth.users.id | Org membership |
| auth.users | user_roles | user_roles.user_id → auth.users.id | App roles |
| profiles | chat_sessions | chat_sessions.user_id → profiles.id | Chat history |
| profiles | notifications | notifications.user_id → profiles.id | User alerts |
| profiles | wizard_sessions | wizard_sessions.user_id → profiles.id | Onboarding |

---

### Startup Relationships

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| startups | tasks | tasks.startup_id → startups.id | Startup tasks |
| startups | projects | projects.startup_id → startups.id | Project tracking |
| startups | contacts | contacts.startup_id → startups.id | CRM contacts |
| startups | deals | deals.startup_id → startups.id | Deal pipeline |
| startups | investors | investors.startup_id → startups.id | Investor tracking |
| startups | documents | documents.startup_id → startups.id | Document storage |
| startups | lean_canvases | lean_canvases.startup_id → startups.id | Business model |
| startups | pitch_decks | pitch_decks.startup_id → startups.id | Pitch presentations |
| startups | activities | activities.startup_id → startups.id | Activity log |
| startups | communications | communications.startup_id → startups.id | Comm history |
| startups | events | events.startup_id → startups.id | Hosted events |
| startups | file_uploads | file_uploads.startup_id → startups.id | Uploaded files |
| startups | ai_runs | ai_runs.startup_id → startups.id | AI usage |
| startups | daily_focus_recommendations | daily_focus_recommendations.startup_id → startups.id | Daily focus |
| industry_playbooks | startups | startups.playbook_id → industry_playbooks.id | Assigned playbook |

---

### Task & Project Relationships

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| projects | tasks | tasks.project_id → projects.id | Project tasks |
| tasks | startup_event_tasks | startup_event_tasks.task_id → tasks.id | Event task link |

---

### CRM Relationships

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| contacts | deals | deals.contact_id → contacts.id | Contact's deals |
| contacts | contact_tags | contact_tags.contact_id → contacts.id | Contact tags |
| contacts | communications | communications.contact_id → contacts.id | Contact comms |

---

### Document Relationships

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| documents | document_versions | document_versions.document_id → documents.id | Version history |
| pitch_decks | pitch_deck_slides | pitch_deck_slides.deck_id → pitch_decks.id | Deck slides |
| deck_templates | pitch_decks | pitch_decks.template_id → deck_templates.id | Template used |

---

### Event Relationships

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| events | event_assets | event_assets.event_id → events.id | Marketing assets |
| events | event_attendees | event_attendees.event_id → events.id | Attendee list |
| events | event_venues | event_venues.event_id → events.id | Venue info |
| events | sponsors | sponsors.event_id → events.id | Sponsors |
| events | messages | messages.event_id → events.id | Event messages |
| events | startup_event_tasks | startup_event_tasks.event_id → events.id | Event tasks |
| industry_events | user_event_tracking | user_event_tracking.event_id → industry_events.id | User tracking |

---

### Chat & AI Relationships

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| chat_sessions | chat_messages | chat_messages.session_id → chat_sessions.id | Session messages |
| proposed_actions | action_executions | action_executions.action_id → proposed_actions.id | Action execution |

---

### Wizard & Onboarding

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| wizard_sessions | wizard_extractions | wizard_extractions.session_id → wizard_sessions.id | AI extractions |
| playbook_runs | startups | playbook_runs.startup_id → startups.id | Playbook progress |

---

### Prompt System

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| prompt_packs | prompt_pack_steps | prompt_pack_steps.pack_id → prompt_packs.id | Pack steps |
| prompt_packs | prompt_pack_runs | prompt_pack_runs.pack_id → prompt_packs.id | Execution runs |

---

### Validation

| Parent | Child | Foreign Key | Description |
|--------|-------|-------------|-------------|
| validation_runs | validation_reports | validation_reports.run_id → validation_runs.id | Run reports |
| validation_runs | validation_verdicts | validation_verdicts.run_id → validation_runs.id | Run verdicts |

---

## Multi-Tenant Data Flow

```
User authenticates
       │
       ▼
┌─────────────────┐
│ auth.uid()      │ ← Supabase Auth
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ profiles        │ ← Get user's org_id
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ user_org_id()   │ ← Helper function
└────────┬────────┘
         │
         ├──────────────────────────────────────┐
         │                                      │
         ▼                                      ▼
┌─────────────────┐                    ┌─────────────────┐
│ Direct org_id   │                    │ startup_in_org()│
│ comparison      │                    │ function        │
└─────────────────┘                    └─────────────────┘
         │                                      │
         ▼                                      ▼
┌─────────────────┐                    ┌─────────────────┐
│ organizations   │                    │ startups        │
│ ai_runs         │                    │ → tasks         │
│ integrations    │                    │ → contacts      │
│ agent_configs   │                    │ → deals         │
└─────────────────┘                    │ → documents     │
                                       │ → etc.          │
                                       └─────────────────┘
```

---

## Junction Tables

| Table | Purpose | Links |
|-------|---------|-------|
| org_members | User ↔ Organization | users, organizations |
| contact_tags | Contact ↔ Tags | contacts, tags (embedded) |
| startup_event_tasks | Task ↔ Event | tasks, events |
| user_event_tracking | User ↔ Industry Event | profiles, industry_events |

---

## Cascade Behaviors

### On Delete Cascade

| Parent | Child | Behavior |
|--------|-------|----------|
| organizations | startups | CASCADE |
| startups | tasks | CASCADE |
| startups | contacts | CASCADE |
| startups | documents | CASCADE |
| contacts | contact_tags | CASCADE |
| documents | document_versions | CASCADE |
| pitch_decks | pitch_deck_slides | CASCADE |
| events | event_* | CASCADE |
| chat_sessions | chat_messages | CASCADE |

### On Delete Restrict

| Parent | Child | Behavior |
|--------|-------|----------|
| profiles | org_members | RESTRICT |
| startups | lean_canvases | RESTRICT |

---

## Indexes

### Primary Indexes (on all primary keys)

- All tables have UUID primary key indexes

### Foreign Key Indexes

- org_id on startup-related tables
- startup_id on all startup child tables
- user_id on user-owned tables
- session_id on chat_messages

### Additional Indexes

- startups.slug (unique)
- organizations.slug (unique)
- contacts.email
- tasks.status, tasks.priority
- deals.stage
- activities.created_at

---

*Generated by Claude Code — 2026-02-02*
