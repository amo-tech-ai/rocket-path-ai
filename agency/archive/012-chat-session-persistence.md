---
task_id: 012-CSP
title: Chat Session Persistence
phase: POST-MVP
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [data, supabase-auth]
subagents: [supabase-expert, security-auditor]
edge_function: ai-chat
schema_tables: [chat_mode_sessions]
depends_on: [010-CMB]
---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Chat (session list sidebar) |
| **Features** | Persistent chat sessions per mode, resume conversations |
| **Edge Functions** | `ai-chat` (save/load session) |
| **Real-World** | "Founder can resume yesterday's Practice Pitch session without losing context" |

## Description

**The situation:** AI chat conversations are ephemeral — messages live in React state and disappear on page navigation or refresh. With 4 specialized modes (task 010), founders want to resume conversations, especially in Practice Pitch mode where they build up context over multiple sessions.

**Why it matters:** Founders iterate on pitches over days. Losing conversation context means re-explaining their startup every session. Persisted sessions let the AI reference prior feedback: "Last time you mentioned your CAC was $150 — have you validated that?"

**What already exists:**
- `supabase/functions/ai-chat/index.ts` — Chat handler (no persistence)
- `src/pages/AIChat.tsx` — Chat UI with message state
- Task 010 adds `mode` field to chat requests

**The build:**
- Create `chat_mode_sessions` table (id, user_id, org_id, mode, title, messages jsonb, created_at, updated_at)
- RLS: users see only their own sessions within their org
- Frontend: session list in sidebar (grouped by mode)
- Frontend: "New conversation" button per mode
- Frontend: auto-save messages on each exchange
- Edge function: accept optional `session_id` to load history as context

**Example:** Marcus has a Practice Pitch session from Monday. On Wednesday, he opens AI Chat, sees "Practice Pitch — AI Hiring Platform" in the sidebar, clicks it. The chat loads with history, and the AI says: "Welcome back! Last time, we identified your competitive moat needed work. Want to continue there?"

## Rationale
**Problem:** Chat conversations lost on navigation or refresh.
**Solution:** Persist sessions to database, load as context for continuity.
**Impact:** Multi-session coaching becomes possible.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | resume a previous chat session | I don't re-explain my startup every time |
| Founder | see my conversation history | I can track my progress over time |
| Founder | start new or continue existing | I control my conversation flow |

## Goals
1. **Primary:** Chat sessions persist across page reloads
2. **Quality:** Session load < 500ms

## Acceptance Criteria
- [ ] `chat_mode_sessions` table created with RLS
- [ ] Messages auto-saved after each AI response
- [ ] Session list sidebar shows past conversations grouped by mode
- [ ] Clicking a session loads its messages
- [ ] "New conversation" creates a fresh session
- [ ] Edge function accepts `session_id` and prepends history as context
- [ ] Sessions capped at 50 messages (truncate oldest on overflow)

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/YYYYMMDD_chat_mode_sessions.sql` | Create |
| Edge Function | `supabase/functions/ai-chat/index.ts` | Modify — session load/save |
| Page | `src/pages/AIChat.tsx` | Modify — session sidebar, load/save |
| Hook | `src/hooks/useChatSessions.ts` | Create — CRUD for sessions |

### Schema

#### Table: chat_mode_sessions
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → auth.users, NOT NULL |
| org_id | uuid | FK → organizations, NOT NULL |
| mode | text | NOT NULL |
| title | text | NOT NULL, default 'New conversation' |
| messages | jsonb | NOT NULL, default '[]'::jsonb |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

#### RLS Policies
| Policy | Operation | Rule |
|--------|-----------|------|
| select_own | SELECT | user_id = (SELECT auth.uid()) |
| insert_own | INSERT | user_id = (SELECT auth.uid()) AND org_id = user_org_id() |
| update_own | UPDATE | user_id = (SELECT auth.uid()) |
| delete_own | DELETE | user_id = (SELECT auth.uid()) |

#### Indexes
| Index | Columns | Purpose |
|-------|---------|---------|
| idx_chat_sessions_user_mode | (user_id, mode) | List sessions by mode |
| idx_chat_sessions_updated | (updated_at DESC) | Most recent first |

## Real-World Examples

**Scenario 1 — Multi-session coaching:** Aisha uses Practice Pitch mode 3 times this week. Each session builds on the last. On the third session, the AI references a weakness from session 1: "Your unit economics slide improved since Monday — LTV:CAC is now 4:1." **With persistence,** coaching quality compounds.

**Scenario 2 — Mode separation:** Jake has 2 Practice Pitch sessions and 3 Growth Strategy sessions. The sidebar groups them by mode with clear labels. **With grouping,** he finds the right conversation instantly.

## Outcomes

| Before | After |
|--------|-------|
| Messages lost on refresh | Sessions persist across reloads |
| No conversation history | Sidebar shows past sessions grouped by mode |
| AI has no memory of prior conversations | History loaded as context for continuity |
| Each session starts from scratch | Multi-session coaching builds over time |
