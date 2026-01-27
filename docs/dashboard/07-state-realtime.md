# Prompt 07 — State Management & Realtime

> **Phase:** Foundation | **Priority:** P1 | **Overall:** 60%
> **No code — state patterns, caching strategy, and realtime channel design only**

---

## State Management Strategy

| State Type | Tool | Usage |
|------------|------|-------|
| Server state | TanStack React Query | All Supabase data fetching, caching, mutations |
| Form state | React Hook Form + Zod | All forms with validation |
| UI state | React useState/useReducer | Modals, drawers, tabs, selection |
| Auth state | useAuth hook (context) | User, session, profile, org |
| URL state | React Router search params | Filters, pagination, sort |

---

## React Query Patterns

### Query Keys

| Pattern | Example | Invalidation |
|---------|---------|-------------|
| Entity list | `['contacts', startupId]` | On create, delete |
| Entity detail | `['contact', contactId]` | On update |
| Filtered list | `['contacts', startupId, { type: 'investor' }]` | On create, delete |
| AI result | `['canvas-suggestions', boxKey]` | Manual or on regenerate |
| Dashboard aggregation | `['dashboard', startupId]` | On any entity change |

### Stale Times

| Data Type | Stale Time | Refetch On |
|-----------|------------|------------|
| Entity lists (contacts, deals) | 30 seconds | Window focus, mutation |
| Entity detail | 60 seconds | Window focus, mutation |
| Dashboard KPIs | 5 minutes | Window focus |
| Industry events | 1 hour | Manual refresh |
| AI suggestions | 10 minutes | Manual regenerate |
| User profile | 5 minutes | Window focus |

### Mutation Pattern

| Step | What Happens |
|------|-------------|
| 1. Optimistic update | Update cache immediately for instant UI response |
| 2. API call | Send mutation to Supabase |
| 3. Success | Invalidate related query keys |
| 4. Error | Roll back optimistic update, show error toast |

---

## Autosave Pattern

Used by: Lean Canvas, Pitch Deck Editor, Document Editor

| Parameter | Value |
|-----------|-------|
| Debounce | 2 seconds after last keystroke |
| Indicator | "Saved" / "Saving..." / "Error — Retry" |
| Offline queue | Failed saves stored in localStorage, retried on reconnect |
| Conflict | Last-write-wins (no merge for single-user editing) |

---

## Supabase Realtime Channels

### Channel Design

| Channel | Pattern | Tables | Events | Used By |
|---------|---------|--------|--------|---------|
| Dashboard | `dashboard:{userId}` | startups, tasks, deals, pitch_decks | UPDATE | Main dashboard KPI refresh |
| CRM | `crm:{startupId}` | contacts, deals, communications | INSERT, UPDATE, DELETE | Contact list, pipeline |
| Canvas | `canvas:{documentId}` | documents | UPDATE | Multi-user canvas editing (future) |
| Pitch Deck | `pitchdeck:{deckId}` | pitch_decks, pitch_deck_slides | UPDATE | Deck generation progress |
| Wizard | `onboarding:{sessionId}` | wizard_sessions, wizard_extractions | UPDATE | Enrichment progress |
| Chat | `chat:{sessionId}` | chat_messages | INSERT | Streaming AI responses |

### Realtime Event Flow

| Step | What Happens |
|------|-------------|
| 1. Subscribe | Component mounts, subscribes to channel |
| 2. Receive event | Supabase broadcasts INSERT/UPDATE/DELETE |
| 3. Invalidate cache | React Query cache invalidated for affected keys |
| 4. UI updates | Components re-render with fresh data |
| 5. Unsubscribe | Component unmounts, channel cleaned up |

### Presence (Future — Lean Canvas Collaboration)

| Feature | Channel | Data |
|---------|---------|------|
| Who's online | `canvas:{id}:presence` | user_id, user_name, avatar_url |
| Who's editing what | `canvas:{id}:presence` | editing_box key |
| Box locking | Broadcast | lock/unlock events per box |

---

## Offline Behavior

| Scenario | Behavior |
|----------|----------|
| Network drops during save | Queue in localStorage, retry on reconnect |
| Network drops during AI call | Show error toast, allow manual retry |
| Page reload while offline | Show cached data from React Query |
| Reconnect | Flush save queue, resubscribe to realtime channels |

---

## Smart AI Realtime Layer

The Smart AI system adds 9 realtime channels on top of the 8 product channels (see `03.1-smart-ai-system.md`):

| Channel | Pattern | Purpose |
|---------|---------|---------|
| `kanban:{userId}:events` | Postgres Changes | Task status changes on Kanban |
| `agent:{taskId}:events` | Broadcast | Live agent terminal streaming |
| `qa:{taskId}:events` | Broadcast + Postgres | QA criterion pass/fail results |
| `spec:{specId}:events` | Broadcast | Spec pipeline phase progress |
| `cost:{userId}:events` | Broadcast | Token count and dollar cost |
| `patterns:{projectId}:events` | Postgres Changes | Pattern discoveries |
| `roadmap:{projectId}:events` | Postgres Changes | Dependency cascade |
| `changelog:{projectId}:events` | Postgres Changes | Release note generation |
| `memory:{projectId}:events` | Broadcast | Memory save/retrieve indicator |

**Key distinction:** Agent progress uses Supabase Broadcast (ephemeral, no DB writes). Final results use Postgres Changes (persisted).

Total channels: 17 (8 product + 9 Smart AI).

---

## Acceptance Criteria

- All server data fetched via React Query (never raw `useEffect` + `fetch`)
- Forms use React Hook Form with Zod schemas
- Autosave debounce works across lean canvas, pitch deck, and document editors
- Realtime subscriptions clean up on unmount (no memory leaks)
- Optimistic updates provide instant feedback on mutations
- Offline saves queue and retry automatically
- Dashboard refreshes when underlying data changes via realtime
