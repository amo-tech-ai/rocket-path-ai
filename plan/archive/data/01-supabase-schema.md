# Supabase Schema - StartupAI

> **Generated:** 2026-02-02 | **Source:** MCP Supabase | **Schema:** public

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tables | 58 |
| Tables with RLS | 58 (100%) |
| Tables with Data | 38 |
| Empty Tables | 20 |

---

## Tables by Category

### Core System

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| organizations | 13 | ✅ | Multi-tenant organization management with Stripe integration |
| org_members | 8 | ✅ | Organization membership with role-based access control |
| profiles | 13 | ✅ | User profiles linked to Supabase auth.users |
| user_roles | 9 | ✅ | User role definitions |

### Startups & Onboarding

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| startups | 16 | ✅ | Core startup profiles with business details, traction, funding |
| wizard_sessions | 13 | ✅ | Multi-step wizard sessions for startup profile creation |
| wizard_extractions | 0 | ✅ | AI-powered data extraction from URLs, LinkedIn, pitch decks |
| onboarding_questions | 5 | ✅ | Dynamic question bank for onboarding wizard interviews |
| industry_playbooks | 19 | ✅ | Industry-specific playbook templates |
| playbook_runs | 0 | ✅ | Playbook execution tracking |

### Lean Canvas & Validation

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| lean_canvases | 2 | ✅ | Lean Canvas methodology storage for startup validation |
| validation_reports | 1 | ✅ | Validation analysis reports |
| validation_runs | 1 | ✅ | Validation execution tracking |
| validation_verdicts | 0 | ✅ | Validation results and verdicts |
| competitor_profiles | 0 | ✅ | Competitor data discovered during validation |

### Documents & Pitch Decks

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| documents | 29 | ✅ | Document management with versioning |
| document_versions | 0 | ✅ | Version snapshots for history and restore |
| pitch_decks | 11 | ✅ | Pitch decks created for startups |
| pitch_deck_slides | 12 | ✅ | Individual slides within pitch decks |
| deck_templates | 3 | ✅ | Pitch deck template library |
| file_uploads | 0 | ✅ | File upload management with Supabase Storage |

### AI Chat & Memory

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| chat_sessions | 0 | ✅ | Chat sessions with 4-tab interface (coach, research, planning, actions) |
| chat_messages | 0 | ✅ | Individual chat messages with sources and suggested actions |
| chat_facts | 0 | ✅ | Extracted facts as vector embeddings for semantic memory |
| chat_pending | 0 | ✅ | Pending suggestions from chat (expire after 24 hours) |

### AI Agents & Execution

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| agent_configs | 8 | ✅ | Per-organization AI agent configuration |
| ai_runs | 27 | ✅ | AI execution log tracking calls, tokens, costs, performance |
| proposed_actions | 5 | ✅ | AI-generated action proposals requiring approval |
| action_executions | 3 | ✅ | Execution log for approved AI actions |
| audit_log | 0 | ✅ | Comprehensive audit trail for all data changes |

### Tasks & Projects

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| tasks | 43 | ✅ | Task management with AI-generated tasks and priorities |
| projects | 14 | ✅ | Project management tracking health, progress, goals |
| daily_focus_recommendations | 1 | ✅ | AI-computed daily focus recommendations |

### CRM & Contacts

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| contacts | 21 | ✅ | CRM contact management with relationship tracking |
| contact_tags | 17 | ✅ | Tags for categorizing contacts |
| deals | 19 | ✅ | Deal pipeline for investors, customers, partnerships |
| investors | 23 | ✅ | Investor profiles and tracking |
| communications | 9 | ✅ | Communication history with sentiment analysis |

### Events Management

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| events | 5 | ✅ | Hosted events (demo days, pitch nights, meetups) |
| event_assets | 1 | ✅ | Marketing assets for events |
| event_attendees | 2 | ✅ | Attendee registrations and check-ins |
| event_speakers | 0 | ✅ | Verified speaker appearances |
| event_venues | 1 | ✅ | Venue options and booking details |
| startup_event_tasks | 0 | ✅ | Junction table linking events to tasks |
| industry_events | 30 | ✅ | Reference table of major AI conferences |
| user_event_tracking | 0 | ✅ | User event interest tracking |
| sponsors | 2 | ✅ | Sponsor relationships with outreach tracking |

### Activities & Workflow

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| activities | 39 | ✅ | Activity timeline and audit log for startups |
| workflow_activity_log | 22 | ✅ | Workflow execution activity log |
| notifications | 0 | ✅ | User notifications for tasks, deals, AI suggestions |
| messages | 0 | ✅ | WhatsApp and communication logs |

### Integrations & Config

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| integrations | 0 | ✅ | Third-party integrations (Stripe, Slack, HubSpot) |
| context_injection_configs | 8 | ✅ | Context injection configuration |
| feature_pack_routing | 12 | ✅ | Feature pack routing rules |

### Prompt System

| Table | Rows | RLS | Description |
|-------|------|-----|-------------|
| prompt_packs | 54 | ✅ | Prompt pack definitions |
| prompt_pack_steps | 67 | ✅ | Individual steps within prompt packs |
| prompt_pack_runs | 0 | ✅ | Prompt pack execution tracking |
| prompt_template_registry | 0 | ✅ | Prompt template registry |

---

## All Tables (Alphabetical)

| # | Table | Rows | RLS | Description |
|---|-------|------|-----|-------------|
| 1 | action_executions | 3 | ✅ | Execution log for approved AI actions |
| 2 | activities | 39 | ✅ | Activity timeline and audit log for startups |
| 3 | agent_configs | 8 | ✅ | Per-organization AI agent configuration |
| 4 | ai_runs | 27 | ✅ | AI execution log tracking calls, tokens, costs |
| 5 | audit_log | 0 | ✅ | Comprehensive audit trail for all data changes |
| 6 | chat_facts | 0 | ✅ | Extracted facts as vector embeddings |
| 7 | chat_messages | 0 | ✅ | Individual chat messages with sources |
| 8 | chat_pending | 0 | ✅ | Pending suggestions from chat |
| 9 | chat_sessions | 0 | ✅ | Chat sessions with 4-tab interface |
| 10 | communications | 9 | ✅ | Communication history with sentiment analysis |
| 11 | competitor_profiles | 0 | ✅ | Competitor data for market analysis |
| 12 | contacts | 21 | ✅ | CRM contact management |
| 13 | contact_tags | 17 | ✅ | Tags for categorizing contacts |
| 14 | context_injection_configs | 8 | ✅ | Context injection configuration |
| 15 | daily_focus_recommendations | 1 | ✅ | AI-computed daily focus recommendations |
| 16 | deals | 19 | ✅ | Deal pipeline management |
| 17 | deck_templates | 3 | ✅ | Pitch deck template library |
| 18 | documents | 29 | ✅ | Document management with versioning |
| 19 | document_versions | 0 | ✅ | Version snapshots for history |
| 20 | events | 5 | ✅ | Hosted events (demo days, meetups) |
| 21 | event_assets | 1 | ✅ | Marketing assets for events |
| 22 | event_attendees | 2 | ✅ | Attendee registrations |
| 23 | event_speakers | 0 | ✅ | Speaker appearances tracking |
| 24 | event_venues | 1 | ✅ | Venue options and booking |
| 25 | feature_pack_routing | 12 | ✅ | Feature pack routing rules |
| 26 | file_uploads | 0 | ✅ | File upload management |
| 27 | industry_events | 30 | ✅ | Reference table of conferences |
| 28 | industry_playbooks | 19 | ✅ | Industry-specific playbooks |
| 29 | integrations | 0 | ✅ | Third-party integrations |
| 30 | investors | 23 | ✅ | Investor profiles |
| 31 | lean_canvases | 2 | ✅ | Lean Canvas methodology storage |
| 32 | messages | 0 | ✅ | WhatsApp and communication logs |
| 33 | notifications | 0 | ✅ | User notification system |
| 34 | onboarding_questions | 5 | ✅ | Dynamic onboarding question bank |
| 35 | organizations | 13 | ✅ | Multi-tenant organization management |
| 36 | org_members | 8 | ✅ | Organization membership |
| 37 | pitch_decks | 11 | ✅ | Pitch decks for startups |
| 38 | pitch_deck_slides | 12 | ✅ | Individual pitch deck slides |
| 39 | playbook_runs | 0 | ✅ | Playbook execution tracking |
| 40 | profiles | 13 | ✅ | User profiles |
| 41 | projects | 14 | ✅ | Project management |
| 42 | prompt_packs | 54 | ✅ | Prompt pack definitions |
| 43 | prompt_pack_runs | 0 | ✅ | Prompt pack execution tracking |
| 44 | prompt_pack_steps | 67 | ✅ | Prompt pack steps |
| 45 | prompt_template_registry | 0 | ✅ | Prompt template registry |
| 46 | proposed_actions | 5 | ✅ | AI-generated action proposals |
| 47 | sponsors | 2 | ✅ | Sponsor relationships |
| 48 | startup_event_tasks | 0 | ✅ | Events-tasks junction |
| 49 | startups | 16 | ✅ | Core startup profiles |
| 50 | tasks | 43 | ✅ | Task management system |
| 51 | user_event_tracking | 0 | ✅ | User event interest tracking |
| 52 | user_roles | 9 | ✅ | User role definitions |
| 53 | validation_reports | 1 | ✅ | Validation analysis reports |
| 54 | validation_runs | 1 | ✅ | Validation execution tracking |
| 55 | validation_verdicts | 0 | ✅ | Validation results |
| 56 | wizard_extractions | 0 | ✅ | AI-powered data extraction |
| 57 | wizard_sessions | 13 | ✅ | Wizard sessions for onboarding |
| 58 | workflow_activity_log | 22 | ✅ | Workflow execution log |

---

## Row Count Summary

### Tables with Most Data

| Table | Rows |
|-------|------|
| prompt_pack_steps | 67 |
| prompt_packs | 54 |
| tasks | 43 |
| activities | 39 |
| industry_events | 30 |
| documents | 29 |
| ai_runs | 27 |
| investors | 23 |
| workflow_activity_log | 22 |
| contacts | 21 |

### Empty Tables (20)

- audit_log
- chat_facts
- chat_messages
- chat_pending
- chat_sessions
- competitor_profiles
- document_versions
- event_speakers
- file_uploads
- integrations
- messages
- notifications
- playbook_runs
- prompt_pack_runs
- prompt_template_registry
- startup_event_tasks
- user_event_tracking
- validation_verdicts
- wizard_extractions

---

## Security

All 58 tables have Row Level Security (RLS) enabled, ensuring:
- Users can only access data within their organization
- Proper isolation between tenants
- Secure access patterns enforced at database level

---

*Generated by Claude Code — 2026-02-02*
