# RLS Policies - StartupAI

> **Generated:** 2026-02-02 | **Source:** MCP Supabase | **Schema:** public

---

## Overview

All 58 tables have Row Level Security (RLS) enabled. This document describes the security patterns and policies.

### Policy Patterns

| Pattern | Description | Tables |
|---------|-------------|--------|
| Org-based | Users access data in their organization | startups, tasks, contacts, deals |
| User-based | Users access only their own data | profiles, chat_sessions, notifications |
| Startup-based | Access via startup_in_org() function | activities, documents, investors |
| Public read | Anyone can read (anonymous + authenticated) | industry_playbooks, prompt_packs |
| Admin-only | Only owners/admins can modify | organizations, org_members, integrations |
| Service role | Only service_role can access | audit_log (write), validation_* |

---

## Core System Policies

### organizations

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own organization | SELECT | id = user_org_id() |
| Authenticated users create first organization | INSERT | true |
| Admins update organization | UPDATE | id = user_org_id() AND org_role() IN ('owner', 'admin') |
| Owners delete organization | DELETE | id = user_org_id() AND org_role() = 'owner' |

---

### profiles

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own profile | SELECT | id = auth.uid() |
| Users view org member profiles | SELECT | org_id = get_user_org_id() |
| Users create own profile | INSERT | id = auth.uid() |
| Users update own profile | UPDATE | id = auth.uid() |
| Users delete own profile | DELETE | id = auth.uid() |

---

### org_members

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view org memberships | SELECT | user_id = auth.uid() OR org_id = user_org_id() |
| Admins insert org memberships | INSERT | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |
| Admins update org memberships | UPDATE | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |
| Admins delete org memberships | DELETE | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |

---

### startups

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view startups in org | SELECT | org_id = user_org_id() |
| Users create startups in org | INSERT | org_id = user_org_id() |
| Users update startups in org | UPDATE | org_id = user_org_id() |
| Users delete startups in org | DELETE | org_id = user_org_id() |

---

## Startup-Based Policies

These tables use `startup_in_org(startup_id)` function for access control.

### tasks

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view tasks in org | SELECT | startup_in_org(startup_id) |
| Users create tasks in org | INSERT | startup_in_org(startup_id) |
| Users update tasks in org | UPDATE | startup_in_org(startup_id) |
| Users delete tasks in org | DELETE | startup_in_org(startup_id) |

---

### contacts

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view contacts in org | SELECT | startup_in_org(startup_id) |
| Users create contacts in org | INSERT | startup_in_org(startup_id) |
| Users update contacts in org | UPDATE | startup_in_org(startup_id) |
| Users delete contacts in org | DELETE | startup_in_org(startup_id) |

---

### deals

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view deals in org | SELECT | startup_in_org(startup_id) |
| Users create deals in org | INSERT | startup_in_org(startup_id) |
| Users update deals in org | UPDATE | startup_in_org(startup_id) |
| Users delete deals in org | DELETE | startup_in_org(startup_id) |

---

### documents

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view documents in org | SELECT | startup_in_org(startup_id) |
| Users insert documents in org | INSERT | startup_in_org(startup_id) |
| Users update documents in org | UPDATE | startup_in_org(startup_id) |
| Users delete documents in org | DELETE | startup_in_org(startup_id) |

---

### activities

| Policy | Command | Condition |
|--------|---------|-----------|
| users can view activities in their org | SELECT | startup_in_org(startup_id) |
| users can create activities in their org | INSERT | startup_in_org(startup_id) |
| users can update activities in their org | UPDATE | startup_in_org(startup_id) |
| users can delete own activities in their org | DELETE | startup_in_org(startup_id) AND (user_id = auth.uid() OR is_system_generated) |

---

### investors

| Policy | Command | Condition |
|--------|---------|-----------|
| Authenticated users view investors in org | SELECT | startup_in_org(startup_id) |
| Authenticated users insert investors in org | INSERT | startup_in_org(startup_id) |
| Authenticated users update investors in org | UPDATE | startup_in_org(startup_id) |
| Authenticated users delete investors in org | DELETE | startup_in_org(startup_id) |

---

### communications

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view communications in org | SELECT | startup_in_org(startup_id) |
| Users create communications in org | INSERT | startup_in_org(startup_id) |
| Authenticated users update communications in org | UPDATE | startup_in_org(startup_id) |
| Users delete communications in org | DELETE | startup_in_org(startup_id) |

---

### projects

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view projects in org | SELECT | startup_in_org(startup_id) |
| Users create projects in org | INSERT | startup_in_org(startup_id) |
| Users update projects in org | UPDATE | startup_in_org(startup_id) |
| Users delete projects in org | DELETE | startup_in_org(startup_id) |

---

### file_uploads

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view file uploads in org | SELECT | startup_in_org(startup_id) |
| Users insert file uploads in org | INSERT | startup_in_org(startup_id) |
| Users update file uploads in org | UPDATE | startup_in_org(startup_id) |
| Users delete file uploads in org | DELETE | startup_in_org(startup_id) |

---

## User-Based Policies

These tables use `user_id = auth.uid()` for access control.

### chat_sessions

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own chat sessions | SELECT | user_id = auth.uid() |
| Users insert own chat sessions | INSERT | user_id = auth.uid() |
| Users update own chat sessions | UPDATE | user_id = auth.uid() |
| Users delete own chat sessions | DELETE | user_id = auth.uid() |

---

### chat_messages

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own chat messages | SELECT | user_id = auth.uid() |
| Users insert own chat messages | INSERT | user_id = auth.uid() |
| Users update own chat messages | UPDATE | user_id = auth.uid() |
| Users delete own chat messages | DELETE | user_id = auth.uid() |

---

### chat_facts

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own chat facts | SELECT | user_id = auth.uid() |
| Users insert chat facts | INSERT | user_id = auth.uid() |
| Users delete own chat facts | DELETE | user_id = auth.uid() |

---

### chat_pending

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own chat pending | SELECT | user_id = auth.uid() |
| System insert chat pending | INSERT | user_id = auth.uid() |
| Users update own chat pending | UPDATE | user_id = auth.uid() |
| Users delete own chat pending | DELETE | user_id = auth.uid() |

---

### notifications

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own notifications | SELECT | user_id = auth.uid() |
| Users insert own notifications | INSERT | user_id = auth.uid() |
| Users update own notifications | UPDATE | user_id = auth.uid() |
| Users delete own notifications | DELETE | user_id = auth.uid() |

---

### wizard_sessions

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view own wizard sessions | SELECT | user_id = auth.uid() |
| Users insert own wizard sessions | INSERT | user_id = auth.uid() |
| Users update own wizard sessions | UPDATE | user_id = auth.uid() |
| Users delete own wizard sessions | DELETE | user_id = auth.uid() |

---

## Organization-Based Policies (via org_id)

### ai_runs

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view ai runs in org | SELECT | org_id = user_org_id() |
| Users insert ai runs in org | INSERT | org_id = user_org_id() |
| Users update ai runs in org | UPDATE | org_id = user_org_id() |
| Users delete ai runs in org | DELETE | org_id = user_org_id() |

---

### proposed_actions

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view proposed actions in org | SELECT | org_id = user_org_id() |
| Users insert proposed actions in org | INSERT | org_id = user_org_id() |
| Users update proposed actions in org | UPDATE | org_id = user_org_id() |
| Users delete own proposed actions | DELETE | user_id = auth.uid() |

---

### integrations

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view integrations in org | SELECT | org_id = user_org_id() |
| Admins insert integrations | INSERT | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |
| Admins update integrations | UPDATE | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |
| Admins delete integrations | DELETE | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |

---

### agent_configs

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view agent configs | SELECT | org_id IS NULL OR org_id = user_org_id() |
| Admins insert agent configs | INSERT | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |
| Admins update agent configs | UPDATE | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |
| Admins delete agent configs | DELETE | org_id = user_org_id() AND org_role() IN ('owner', 'admin') |

---

## Public Read Policies

These tables allow read access to anonymous and authenticated users.

### industry_playbooks

| Policy | Command | Condition |
|--------|---------|-----------|
| Anyone can view active industry playbooks | SELECT | is_active = true |

---

### prompt_packs

| Policy | Command | Condition |
|--------|---------|-----------|
| Anyone can view active prompt packs | SELECT | is_active = true |

---

### prompt_pack_steps

| Policy | Command | Condition |
|--------|---------|-----------|
| Anyone can view prompt pack steps | SELECT | pack_id in active prompt_packs |

---

### industry_events

| Policy | Command | Condition |
|--------|---------|-----------|
| Anon users can read industry events | SELECT | true |
| Authenticated users can read industry events | SELECT | true |
| Admin users can insert/update/delete | ALL | has_role(auth.uid(), 'admin') |

---

### context_injection_configs

| Policy | Command | Condition |
|--------|---------|-----------|
| Anyone can view context injection configs | SELECT | is_active = true |

---

### feature_pack_routing

| Policy | Command | Condition |
|--------|---------|-----------|
| Anyone can view feature pack routing | SELECT | true |

---

## Service Role Only

### audit_log

| Policy | Command | Condition |
|--------|---------|-----------|
| Users view audit log in org | SELECT | org_id = user_org_id() |

*Note: Write access is service_role only (via triggers)*

---

### validation_runs / validation_reports / validation_verdicts

| Policy | Command | Condition |
|--------|---------|-----------|
| Service role has full access | ALL | auth.jwt() role = 'service_role' |
| Users can view for their organization | SELECT | via org_members join |

---

## Nested Policies (via Foreign Keys)

### lean_canvases

| Policy | Command | Condition |
|--------|---------|-----------|
| lean_canvases_select_org | SELECT | startup_id in user's org startups |
| lean_canvases_insert_org | INSERT | startup_id in user's org startups |
| lean_canvases_update_org | UPDATE | startup_id in user's org startups |
| lean_canvases_delete_org | DELETE | startup_id in user's org startups |

---

### pitch_decks / pitch_deck_slides

| Policy | Command | Condition |
|--------|---------|-----------|
| Users can view/create/update/delete | ALL | user_org_id() IS NULL OR startup_in_org(startup_id) |

---

### contact_tags

| Policy | Command | Condition |
|--------|---------|-----------|
| Users * contact tags in org | ALL | contact_id in contacts where startup_in_org() |

---

### document_versions

| Policy | Command | Condition |
|--------|---------|-----------|
| Users * document versions in org | ALL | document_id in documents where startup_in_org() |

---

### Events (events, event_assets, event_attendees, event_venues, sponsors, messages)

| Policy | Command | Condition |
|--------|---------|-----------|
| users can * events in their org | ALL | startup_in_org(startup_id) |
| authenticated can * event_* | ALL | event_id in events where startup_in_org() |

---

## Security Functions

### user_org_id()

Returns current user's organization ID from profiles table.

### org_role()

Returns current user's role within their organization.

### startup_in_org(startup_id uuid)

Returns true if startup belongs to user's organization.

### has_role(user_id uuid, role app_role)

Returns true if user has specified application role.

### get_user_org_id()

Alternative to user_org_id() - gets org_id from profiles.

---

## Best Practices

1. **Always use helper functions** - Use startup_in_org(), user_org_id() instead of raw joins
2. **Consistent patterns** - All startup-related tables use startup_in_org()
3. **Least privilege** - Only admins can modify org settings, integrations
4. **Service role isolation** - Audit writes and validation data restricted to service role
5. **Public data flagged** - Public-readable tables use is_active or is_public flags

---

*Generated by Claude Code — 2026-02-02*
