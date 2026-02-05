# Table Schemas - StartupAI

> **Generated:** 2026-02-02 | **Source:** MCP Supabase | **Schema:** public

---

## Core Tables

### organizations

Multi-tenant organization management. Each organization can have multiple users and startups. Supports subscription tiers and Stripe integration.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| name | text | NO | — |
| slug | text | NO | — (unique) |
| logo_url | text | YES | — |
| settings | jsonb | YES | {"features": {...}, "default_model": "gemini-3-flash-preview", "ai_daily_cap_usd": 50} |
| subscription_tier | text | YES | 'free' |
| subscription_status | text | YES | 'active' |
| stripe_customer_id | text | YES | — |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- subscription_tier IN ('free', 'pro', 'enterprise')
- subscription_status IN ('active', 'past_due', 'cancelled')

---

### profiles

User profiles linked to Supabase auth.users. Stores user preferences, organization membership, and role-based permissions.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | — (FK → auth.users) |
| email | text | YES | — |
| full_name | text | YES | — |
| avatar_url | text | YES | — |
| org_id | uuid | YES | — (FK → organizations) |
| role | text | YES | 'member' |
| preferences | jsonb | YES | {} |
| onboarding_completed | boolean | YES | false |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- role IN ('owner', 'admin', 'member', 'viewer')

---

### org_members

Multi-tenant organization membership. Supports multiple users per organization with role-based access control.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| org_id | uuid | NO | — (FK → organizations) |
| user_id | uuid | NO | — (FK → auth.users) |
| role | text | NO | 'member' |
| invited_by | uuid | YES | — |
| invited_at | timestamptz | YES | — |
| joined_at | timestamptz | YES | now() |
| created_at | timestamptz | YES | now() |

**Unique Constraint:** (org_id, user_id)

---

### startups

Core startup profiles with business details, traction data, funding information, and AI-generated summaries. Profile strength calculated automatically.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| org_id | uuid | NO | — (FK → organizations) |
| name | text | NO | — |
| slug | text | YES | — (unique) |
| one_liner | text | YES | — |
| description | text | YES | — |
| website_url | text | YES | — |
| logo_url | text | YES | — |
| industry | text | YES | — |
| stage | text | YES | — |
| business_model | text | YES | — |
| target_market | text | YES | — |
| founding_date | date | YES | — |
| employee_count | integer | YES | — |
| location | text | YES | — |
| funding_stage | text | YES | — |
| funding_raised | numeric | YES | — |
| funding_target | numeric | YES | — |
| monthly_revenue | numeric | YES | — |
| user_count | integer | YES | — |
| growth_rate | numeric | YES | — |
| profile_strength | integer | YES | 0 |
| ai_summary | text | YES | — |
| playbook_id | uuid | YES | — (FK → industry_playbooks) |
| settings | jsonb | YES | {} |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- stage IN ('idea', 'mvp', 'growth', 'scale')
- funding_stage IN ('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'ipo')

---

## Lean Canvas & Validation

### lean_canvases

Lean Canvas methodology storage for startup validation. Stores all 9 blocks with version history.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| startup_id | uuid | NO | — (FK → startups) |
| version | integer | YES | 1 |
| is_current | boolean | YES | true |
| problem | jsonb | YES | {} |
| solution | jsonb | YES | {} |
| unique_value | jsonb | YES | {} |
| unfair_advantage | jsonb | YES | {} |
| customer_segments | jsonb | YES | {} |
| channels | jsonb | YES | {} |
| revenue_streams | jsonb | YES | {} |
| cost_structure | jsonb | YES | {} |
| key_metrics | jsonb | YES | {} |
| overall_score | integer | YES | — |
| ai_feedback | text | YES | — |
| created_by | uuid | YES | — (FK → auth.users) |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

---

## CRM Tables

### contacts

CRM contact management with relationship tracking, enrichment data, and custom fields.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| startup_id | uuid | NO | — (FK → startups) |
| first_name | text | YES | — |
| last_name | text | YES | — |
| email | text | YES | — |
| phone | text | YES | — |
| company | text | YES | — |
| title | text | YES | — |
| linkedin_url | text | YES | — |
| contact_type | text | YES | 'other' |
| relationship_strength | text | YES | 'cold' |
| last_contacted | timestamptz | YES | — |
| notes | text | YES | — |
| enrichment_data | jsonb | YES | {} |
| custom_fields | jsonb | YES | {} |
| created_by | uuid | YES | — (FK → auth.users) |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- contact_type IN ('investor', 'customer', 'partner', 'advisor', 'other')
- relationship_strength IN ('cold', 'warm', 'hot', 'champion')

---

### deals

Deal pipeline management for investors, customers, and partnerships. Tracks stages, amounts, probabilities, and AI-generated scores.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| startup_id | uuid | NO | — (FK → startups) |
| contact_id | uuid | YES | — (FK → contacts) |
| title | text | NO | — |
| deal_type | text | YES | 'investment' |
| stage | text | YES | 'lead' |
| amount | numeric | YES | — |
| probability | integer | YES | 0 |
| expected_close | date | YES | — |
| actual_close | date | YES | — |
| won | boolean | YES | — |
| lost_reason | text | YES | — |
| notes | text | YES | — |
| ai_score | integer | YES | — |
| ai_next_action | text | YES | — |
| created_by | uuid | YES | — (FK → auth.users) |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- deal_type IN ('investment', 'customer', 'partnership')
- stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')

---

## Task Management

### tasks

Task management system with AI-generated tasks, priorities, assignments, and completion tracking.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| startup_id | uuid | NO | — (FK → startups) |
| project_id | uuid | YES | — (FK → projects) |
| title | text | NO | — |
| description | text | YES | — |
| status | text | YES | 'todo' |
| priority | text | YES | 'medium' |
| category | text | YES | — |
| due_date | date | YES | — |
| estimated_hours | numeric | YES | — |
| actual_hours | numeric | YES | — |
| assigned_to | uuid | YES | — (FK → auth.users) |
| source | text | YES | 'manual' |
| ai_generated | boolean | YES | false |
| ai_rationale | text | YES | — |
| completed_at | timestamptz | YES | — |
| created_by | uuid | YES | — (FK → auth.users) |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- status IN ('todo', 'in-progress', 'blocked', 'done', 'cancelled')
- priority IN ('low', 'medium', 'high', 'urgent')
- source IN ('manual', 'ai', 'playbook', 'experiment')

---

## Documents

### documents

Document management for startups. Stores pitch decks, lean canvases, strategies, and other generated documents with versioning.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| startup_id | uuid | NO | — (FK → startups) |
| document_type | text | NO | — |
| title | text | NO | — |
| content | jsonb | YES | {} |
| version | integer | YES | 1 |
| is_current | boolean | YES | true |
| storage_path | text | YES | — |
| ai_generated | boolean | YES | false |
| created_by | uuid | YES | — (FK → auth.users) |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- document_type IN ('lean-canvas', 'pitch-deck', 'strategy', 'report', 'other')

---

### pitch_decks

Pitch decks created for startups with slide management.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| startup_id | uuid | NO | — (FK → startups) |
| title | text | NO | — |
| template_id | uuid | YES | — (FK → deck_templates) |
| status | text | YES | 'draft' |
| version | integer | YES | 1 |
| slide_count | integer | YES | 0 |
| ai_generated | boolean | YES | false |
| shared_link | text | YES | — |
| view_count | integer | YES | 0 |
| created_by | uuid | YES | — (FK → auth.users) |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- status IN ('draft', 'review', 'final', 'archived')

---

## AI & Chat

### chat_sessions

Chat conversation sessions with 4-tab interface (coach, research, planning, actions). Tracks context snapshots and message counts.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| user_id | uuid | NO | — (FK → auth.users) |
| startup_id | uuid | YES | — (FK → startups) |
| session_type | text | YES | 'coach' |
| title | text | YES | — |
| message_count | integer | YES | 0 |
| context_snapshot | jsonb | YES | {} |
| is_active | boolean | YES | true |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**Check Constraints:**
- session_type IN ('coach', 'research', 'planning', 'actions')

---

### ai_runs

AI agent execution log tracking all AI model calls, token usage, costs, and performance metrics.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| org_id | uuid | NO | — (FK → organizations) |
| startup_id | uuid | YES | — (FK → startups) |
| user_id | uuid | YES | — (FK → auth.users) |
| agent_name | text | NO | — |
| model | text | NO | — |
| prompt_tokens | integer | YES | 0 |
| completion_tokens | integer | YES | 0 |
| total_tokens | integer | YES | 0 |
| cost_usd | numeric | YES | 0 |
| latency_ms | integer | YES | — |
| status | text | YES | 'success' |
| error_message | text | YES | — |
| metadata | jsonb | YES | {} |
| created_at | timestamptz | YES | now() |

**Check Constraints:**
- status IN ('success', 'error', 'timeout', 'rate_limited')

---

## Helper Functions

### user_org_id()

Returns the current user's organization ID.

### org_role()

Returns the current user's role within their organization.

### startup_in_org(startup_id uuid)

Returns true if the startup belongs to the current user's organization.

### has_role(user_id uuid, role app_role)

Returns true if the user has the specified role.

### get_user_org_id()

Alternative function to get user's org_id from profiles table.

---

*Generated by Claude Code — 2026-02-02*
