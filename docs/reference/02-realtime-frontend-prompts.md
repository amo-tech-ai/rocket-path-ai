# Lovable Prompts: Realtime Frontend Fixes

**Date:** 2026-01-29
**Backend Status:** ✅ Migration applied (RLS, triggers, publication) — *fix migration bugs in 03-realtime-audit.md first*
**Frontend Status:** 🔴 Needs updates

---

## Clear Description

This document is a **prompt library for Lovable** (or any AI frontend agent) to fix and align the StartupAI frontend with Supabase Realtime **private channels** and **broadcast-from-database**. Each section includes copy-paste prompts that tell the agent exactly which files to change and how. The backend already has RLS on `realtime.messages`, broadcast triggers, and publication setup; the frontend must be updated to use private channel config, call `setAuth()` before subscribing, use broadcast instead of `postgres_changes` where applicable, and prevent duplicate subscriptions. Fix backend migration issues in `03-realtime-audit.md` before relying on private channels end-to-end.

---

## Description

This document defines **Lovable-ready prompts** to update the frontend so it works with Supabase Realtime **private channels** and **broadcast-from-database**. The backend already provides RLS on `realtime.messages`, broadcast triggers on key tables, and publication setup; the frontend must use private channel config, call `setAuth()` before subscribing, migrate from `postgres_changes` to broadcast where appropriate, and avoid duplicate subscriptions.

**In scope:** All Realtime hooks (dashboard, pitch deck, CRM, onboarding, presence, etc.), the Supabase client config, and a shared realtime channel hook.

**Out of scope:** Backend migration fixes (see `03-realtime-audit.md`); those must be applied before these prompts are fully effective.

---

## Rationale

**Purpose**
- Align the frontend with Supabase Realtime Authorization (private channels + RLS) so only authenticated users with correct data access can join or send on channels.
- Prefer broadcast (with DB triggers) over `postgres_changes` for table changes to reduce load and scale better.
- Establish a single, consistent pattern for all realtime hooks so reconnection, cleanup, and no duplicate subscriptions are guaranteed.

**Goals**
- Every protected subscription uses `config: { private: true }` and `await supabase.realtime.setAuth()` before `channel.subscribe()`.
- Dashboard and table-based subscriptions use broadcast on topics `{table}:{startupId}:changes` with INSERT/UPDATE/DELETE and `payload.new` / `payload.old`.
- One subscription per logical channel; hooks use a channel ref and state check to avoid duplicate subscriptions and clean up on unmount.

**Outcomes**
- Private channels + RLS; no anonymous access to realtime once "private only" is enabled.
- Fewer bottlenecks, better throughput, and room to grow.
- Stable realtime UX: no connection leaks, no double handlers, easier maintenance and fewer bugs.

| Purpose | Goals | Outcomes |
|--------|--------|----------|
| **Security** | Enforce Realtime Authorization so only authenticated users with the right data access can join/send on channels. | Private channels + RLS; no anonymous access to realtime once “private only” is enabled. |
| **Scalability** | Prefer broadcast (with DB triggers) over postgres_changes for table changes. | Fewer bottlenecks, better throughput, and room to grow. |
| **Reliability** | Reconnection, no duplicate subscriptions, and clear cleanup. | Stable realtime UX; no connection leaks or double handlers. |
| **Consistency** | One pattern for all hooks: private + setAuth + state check + cleanup. | Easier maintenance and fewer bugs. |

---

## User Stories

- **As a** logged-in user viewing the dashboard, **I want** task/deal/contact/event changes to appear in real time **so that** I see up-to-date data without refreshing.
- **As a** user on the pitch deck generating screen, **I want** step progress and completion events **so that** I see generation status and am redirected when the deck is ready.
- **As a** user in onboarding with a co-founder, **I want** presence and form sync **so that** we can collaborate without overwriting each other.
- **As a** developer, **I want** a single, consistent pattern for all realtime hooks **so that** adding or changing subscriptions is straightforward and safe.
- **As a** product owner, **I want** realtime to work with private channels only **so that** we can turn off public access and meet security requirements.

---

## Acceptance Criteria

1. **Private channels**
   - Every realtime subscription that should be protected uses `config: { private: true }` and `await supabase.realtime.setAuth()` before `channel.subscribe()`.

2. **No duplicate subscriptions**
   - Only one subscription per logical channel (e.g. one tasks channel per `startupId`); `useTasksRealtime` consolidated or aligned with `useDashboardRealtime`.

3. **Channel state check**
   - Hooks use a ref (and optionally state) to avoid subscribing twice (e.g. `if (channelRef.current?.state === 'subscribed') return`).

4. **Cleanup**
   - Every hook’s `useEffect` return calls `supabase.removeChannel(channel)` and clears the channel ref.

5. **Broadcast where applicable**
   - Dashboard and other table-based subscriptions use broadcast on topics `{table}:{startupId}:changes` (INSERT/UPDATE/DELETE) instead of postgres_changes, with callbacks using `payload.new` / `payload.old` and the event name.

6. **Documents in usePitchDeckRealtime**
   - Document updates for the current deck stay on postgres_changes with filter `id=eq.${deckId}` (no migration to broadcast on `pitchdeck:${deckId}:events`).

7. **usePitchDeckGeneration**
   - Subscribes to `pitch_deck_generation:${deckId}` with private + setAuth so generation progress works once RLS allows `pitch_decks.id`.

8. **Client config**
   - Supabase client includes `realtime.params.log_level` (e.g. `info` in dev, `warn` in prod) for debugging and reconnection visibility.

9. **Testing**
   - After changes: private channel auth works, no duplicate subscriptions in DevTools, task/deal/pitch deck/onboarding flows update in real time, and navigating away cleans up channels.

---

## Key Points

- **Backend first:** Fix migration issues in `03-realtime-audit.md` (realtime.send order, is_private TRUE, pitch_deck_generation RLS) before expecting private channels to work end-to-end.
- **Private + setAuth everywhere:** Any channel that must be protected uses `{ private: true }` and `await supabase.realtime.setAuth()` before subscribe.
- **Broadcast payload shape:** For `realtime.broadcast_changes`, use event name (INSERT/UPDATE/DELETE) and `payload.new` / `payload.old`; there is no `payload.eventType`.
- **Documents on pitch deck:** Keep postgres_changes for document updates in usePitchDeckRealtime; do not “migrate” that subscription to broadcast on `pitchdeck:${deckId}:events`.
- **usePitchDeckGeneration:** Must be updated (Prompt 3b); it was previously missing and is required for generation progress with private channels.
- **Order of work:** Client config → shared hook → usePitchDeckGeneration → deduplicate tasks → useDashboardRealtime → other hooks → presence.

---

## ⚠️ Prompt Correctness Audit (2026-01-29)

**Verdict: Not 100% correct.** Gaps and fixes below.

| Issue | Severity | Location | Fix |
|-------|----------|----------|-----|
| **usePitchDeckGeneration not covered** | 🔴 Critical | Missing | Add Prompt: private: true + setAuth() for `pitch_deck_generation:${deckId}` (required for generation progress). |
| **Prompt 5: documents “migrate to broadcast” wrong** | 🔴 Critical | Prompt 5 | Backend sends document changes to `documents:${startupId}:changes`, not `pitchdeck:${deckId}:events`. Either keep postgres_changes with filter `id=eq.${deckId}`, or add a second channel `documents:${startupId}:changes` and filter `payload.new?.id === deckId` (requires startupId in hook). |
| **Prompt 3: broadcast payload shape** | 🟡 Medium | Prompt 3 | Broadcast from `realtime.broadcast_changes` sends payload with `new`, `old` (no `eventType`). Tell implementer: use event name (INSERT/UPDATE/DELETE) and `payload.new` / `payload.old` instead of `payload.eventType`. |
| **Prompt 2: return values not reactive** | 🟢 Low | Prompt 2 | Hook returns `channelRef.current` / `isSubscribedRef.current`; they don’t update after subscribe. Optional: use state for isSubscribed so UI can react. |
| **Backend dependency** | 🟡 Medium | Summary | Backend migration has 3 critical bugs (03-realtime-audit.md). Fix migration (realtime.send order, is_private TRUE, pitch_deck_generation RLS) before relying on private channels. |

---

## Summary

The backend now has:
- RLS policies on `realtime.messages` (SELECT + INSERT)
- 9 broadcast triggers on key tables
- 10 tables in `supabase_realtime` publication
- Custom task event triggers

The frontend needs these changes to work with private channels and broadcast.

---

## Prompt 1: Update Supabase Client with Realtime Config

**File:** `src/integrations/supabase/client.ts`

**User Story**
- **As a** developer or support engineer, **I want** the Supabase client to log realtime connection and reconnection activity in dev **so that** I can debug subscription issues without guessing.

**Journey**
1. App loads → client created with `realtime.params.log_level: 'info'` (dev) or `'warn'` (prod).
2. User opens dashboard or any realtime screen → reconnection/subscription events appear in console (dev only).
3. Outcome: Easier diagnosis of “channel not subscribing” or “reconnect loop” without changing code.

**Real-world example**
- Sarah opens the dashboard; her teammate says "my task list isn't updating." She opens DevTools → Console and sees `[Realtime] Reconnecting…` every few seconds. With `log_level: 'info'` she confirms the client is reconnecting instead of staying subscribed, so she checks network/auth instead of guessing.
- In production, `log_level: 'warn'` keeps the console quiet so users don't see noisy realtime logs.

---

```
Update the Supabase client to include realtime configuration options for better reconnection handling and debugging.

In `src/integrations/supabase/client.ts`, modify the createClient call to add realtime params:

export const supabase = createClient<Database>(
  SUPABASE_URL_FINAL,
  SUPABASE_PUBLISHABLE_KEY_FINAL,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        log_level: import.meta.env.DEV ? 'info' : 'warn',
      }
    }
  }
);

This adds:
- log_level: 'info' in dev mode for debugging realtime connections
- log_level: 'warn' in production to reduce noise
```

---

## Prompt 2: Create Shared Realtime Hook with Private Channel Support

**File:** `src/hooks/realtime/useRealtimeChannel.ts` (NEW FILE)

**User Story**
- **As a** developer, **I want** one shared hook that creates private realtime channels with setAuth and no duplicates **so that** every feature uses the same safe pattern and I don’t repeat boilerplate.

**Journey**
1. Feature needs realtime → calls `useRealtimeChannel({ topic, onBroadcast, enabled })`.
2. Hook creates channel with `private: true`, calls `setAuth()`, checks state to avoid duplicate subscribe, then subscribes.
3. On unmount → hook removes channel and clears ref.
4. Outcome: One place to fix bugs (e.g. setAuth order); all consumers get private channels and cleanup.

**Real-world example**
- The CRM page needs live deal updates. Instead of each developer writing "create channel → setAuth → subscribe → cleanup" again, they call `useRealtimeChannel({ topic: \`deals:${startupId}:changes\`, onBroadcast: { INSERT: addDeal, UPDATE: updateDeal } })`. New features (events, documents) reuse the same hook; when Supabase changes the setAuth requirement, one file is updated and every screen benefits.

---

```
Create a new shared hook for realtime subscriptions that follows Supabase best practices:
- Uses private channels with `config: { private: true }`
- Calls `supabase.realtime.setAuth()` before subscribing
- Checks channel state before subscribing to prevent duplicates
- Uses refs to track channel state
- Includes proper cleanup

Create `src/hooks/realtime/useRealtimeChannel.ts`:

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeChannelOptions {
  topic: string;
  onBroadcast?: Record<string, (payload: unknown) => void>;
  enabled?: boolean;
}

export function useRealtimeChannel({ topic, onBroadcast, enabled = true }: UseRealtimeChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef(false);

  const subscribe = useCallback(async () => {
    // Prevent duplicate subscriptions
    if (isSubscribedRef.current || channelRef.current?.state === 'subscribed') {
      return;
    }

    // Create channel with private: true for RLS authorization
    const channel = supabase.channel(topic, {
      config: {
        broadcast: { self: true, ack: true },
        private: true
      }
    });

    channelRef.current = channel;

    // Register broadcast handlers
    if (onBroadcast) {
      Object.entries(onBroadcast).forEach(([event, handler]) => {
        channel.on('broadcast', { event }, ({ payload }) => handler(payload));
      });
    }

    // Set auth before subscribing (required for private channels)
    await supabase.realtime.setAuth();

    // Subscribe
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        isSubscribedRef.current = true;
        console.log(`[Realtime] Subscribed to ${topic}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`[Realtime] Error on ${topic}`);
        isSubscribedRef.current = false;
      }
    });
  }, [topic, onBroadcast]);

  useEffect(() => {
    if (!enabled || !topic) return;

    subscribe();

    return () => {
      if (channelRef.current) {
        console.log(`[Realtime] Unsubscribing from ${topic}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [topic, enabled, subscribe]);

  return {
    channel: channelRef.current,
    isSubscribed: isSubscribedRef.current,
  };
}
```

---

## Prompt 3: Update useDashboardRealtime to Use Broadcast

**File:** `src/hooks/useRealtimeSubscription.ts`

**User Story**
- **As a** logged-in user on the dashboard, **I want** task, deal, and contact changes to appear in real time **so that** I always see the latest data without refreshing.

**Journey**
1. User opens dashboard → `useDashboardRealtime(startupId)` runs.
2. Hook subscribes to broadcast topics `tasks:${startupId}:changes`, `deals:${startupId}:changes`, etc., with `private: true` and `setAuth()`.
3. Another user (or background job) creates/updates/deletes a task or deal → backend trigger broadcasts; user sees list update immediately.
4. User navigates away → channel removed; no duplicate subscription if they return.
5. Outcome: Live dashboard with one subscription per topic and correct cleanup.

**Real-world example**
- Alex has the dashboard open; Maria (same startup) creates a task "Prepare investor deck" from her laptop. Within a second, Alex’s task list shows the new row without a refresh. Later Maria moves a deal to "Closed Won"; Alex’s pipeline view updates live. Both are on private channels for their startup, so no other org’s data leaks in.

---

```
Update useDashboardRealtime in `src/hooks/useRealtimeSubscription.ts` to:
1. Use broadcast subscriptions instead of postgres_changes
2. Add private: true to channel config
3. Call setAuth() before subscribing
4. Add channel state checks to prevent duplicates
5. Subscribe to broadcast topics: `{table}:{startupId}:changes`

The backend now broadcasts changes on topics like:
- `tasks:${startupId}:changes`
- `deals:${startupId}:changes`
- `contacts:${startupId}:changes`
- etc.

Replace the postgres_changes subscriptions with broadcast subscriptions:

// Before (postgres_changes):
.on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `startup_id=eq.${startupId}` }, callback)

// After (broadcast):
supabase.channel(`tasks:${startupId}:changes`, { config: { private: true } })
  .on('broadcast', { event: 'INSERT' }, callback)
  .on('broadcast', { event: 'UPDATE' }, callback)
  .on('broadcast', { event: 'DELETE' }, callback)

Before subscribing, call: await supabase.realtime.setAuth()

Add a channelRef and check state before subscribing:
const channelRef = useRef(null);
if (channelRef.current?.state === 'subscribed') return;

Important: Broadcast payload shape from realtime.broadcast_changes has `new` and `old` (no `eventType`).
In each callback use the event name (INSERT/UPDATE/DELETE) and payload.new / payload.old.
Example: (payload) => { const record = payload.new ?? payload.old; ... }
```

---

## Prompt 3b: Update usePitchDeckGeneration with Private Channel (CRITICAL – was missing)

**File:** `src/hooks/usePitchDeckGeneration.ts`

**User Story**
- **As a** user on the pitch deck generating screen, **I want** step progress and completion events **so that** I see generation status and am redirected when the deck is ready.

**Journey**
1. User starts deck generation → lands on generating screen; `usePitchDeckGeneration(deckId)` runs.
2. Hook subscribes to `pitch_deck_generation:${deckId}` with `private: true` and `setAuth()` before subscribe.
3. Backend sends `step_progress`, `step_complete`, `generation_complete` (or `generation_failed`) → UI shows progress and then redirects or shows error.
4. Without private + setAuth, RLS blocks the channel once backend enforces private-only.
5. Outcome: Generation progress works end-to-end with private channels; no silent failures.

**Real-world example**
- Jordan clicks "Generate deck" and lands on the generating screen. They see "Analyzing business context…" then "Generating slides 3/10…" then "Done." and a redirect to the editor. Without private + setAuth, after the backend enforces private-only, the UI would stay stuck on "Generating…" with no errors; with the fix, progress events flow and the UX works.

---

```
usePitchDeckGeneration subscribes to pitch_deck_generation:${deckId} for generation progress.
Without private: true and setAuth(), RLS will block the subscription once backend enforces private channels.

Update the channel in usePitchDeckGeneration.ts:

1. Add config: { private: true } to the channel:
   supabase.channel(`pitch_deck_generation:${deckId}`, { config: { private: true } })

2. Call await supabase.realtime.setAuth() before subscribing (e.g. in useEffect before channel.subscribe()).

3. Add a channelRef and check state before subscribing to prevent duplicates:
   const channelRef = useRef<RealtimeChannel | null>(null);
   if (channelRef.current?.state === 'subscribed') return;

4. Keep existing .on('broadcast', { event: 'step_progress' }, ...) etc. and cleanup with removeChannel.

Example pattern:
  const channelRef = useRef<RealtimeChannel | null>(null);
  if (!deckId) return;
  if (channelRef.current?.state === 'subscribed') return;

  const channel = supabase.channel(`pitch_deck_generation:${deckId}`, { config: { private: true } })
    .on('broadcast', { event: 'step_progress' }, ...)
    .on('broadcast', { event: 'step_complete' }, ...)
    .on('broadcast', { event: 'generation_complete' }, ...)
    .on('broadcast', { event: 'generation_failed' }, ...);

  channelRef.current = channel;
  await supabase.realtime.setAuth();
  channel.subscribe(...);

  return () => { supabase.removeChannel(channelRef.current); channelRef.current = null; };
```

**Note:** Backend RLS for pitch_deck_generation must allow pitch_decks.id (deckId), not documents.id. See 03-realtime-audit.md — fix migration first.

---

## Prompt 4: Deduplicate Tasks Subscriptions

**File:** `src/hooks/useRealtimeSubscription.ts`

**User Story**
- **As a** user on the dashboard or tasks view, **I want** task updates to appear once and reliably **so that** I don’t see double updates or waste connections.

**Journey**
1. User opens dashboard → `useDashboardRealtime` subscribes to tasks.
2. Same user opens a “tasks-only” page that used `useTasksRealtime` → previously, a second subscription for the same data was created.
3. After fix: only one tasks subscription (e.g. in `useDashboardRealtime`); `useTasksRealtime` removed or reuses same channel.
4. Outcome: Single subscription per logical channel; fewer connections and no duplicate handlers.

**Real-world example**
- Sam opens Dashboard (tasks list loads via useDashboardRealtime), then clicks "Tasks" in the nav and the Tasks page mounts and used to call useTasksRealtime. Before the fix: two WebSocket subscriptions for the same startup’s tasks, so creating one task made the list update twice and DevTools showed two channels. After: one subscription; one new task → one UI update.

---

```
There are duplicate subscriptions for tasks:
- useDashboardRealtime subscribes to `tasks_${startupId}`
- useTasksRealtime subscribes to `tasks_realtime_${startupId}`

Both have the same filter: `startup_id=eq.${startupId}`

FIX: Remove useTasksRealtime and consolidate into useDashboardRealtime.

In useDashboardRealtime, the tasks channel should handle all task updates.

Delete or deprecate useTasksRealtime, and update any components that use it to use useDashboardRealtime instead.

If useTasksRealtime is needed for specific pages, have it reuse the same channel topic as useDashboardRealtime to avoid duplicate connections.
```

---

## Prompt 5: Update usePitchDeckRealtime with Private Channel

**File:** `src/hooks/realtime/usePitchDeckRealtime.ts`

**User Story**
- **As a** user editing a pitch deck, **I want** slide completion, deck-ready, and document updates for this deck in real time **so that** I see progress and final state without refreshing.

**Journey**
1. User opens deck editor for `deckId` → `usePitchDeckRealtime(deckId)` runs.
2. Hook subscribes to `pitchdeck:${deckId}:events` with `private: true` and `setAuth()`; listens for `slide_completed`, `deck_ready`, and keeps postgres_changes for documents (filter `id=eq.${deckId}`).
3. Backend completes a slide or marks deck ready → UI updates; document status change → query invalidated.
4. User leaves editor → channel removed.
5. Outcome: Deck editor stays in sync with one private channel and correct cleanup.

**Real-world example**
- Casey is editing "Seed Deck v2" (deckId = abc-123). The AI finishes a slide in the background; the editor shows a checkmark on that slide without refresh. When generation completes, the "Deck ready" banner appears and the document query refetches. Only this deck’s events are received (private channel + document filter); closing the editor unsubscribes so no stray updates later.

---

```
Update usePitchDeckRealtime to use private channels:

1. Add `config: { private: true }` to the channel creation
2. Add `await supabase.realtime.setAuth()` before subscribing
3. Add channel state check to prevent duplicate subscriptions
4. Keep the broadcast subscriptions for slide_completed and deck_ready events
5. Documents subscription: do NOT migrate to broadcast on this channel. Backend sends document changes to `documents:${startupId}:changes`, not to `pitchdeck:${deckId}:events`. Either (A) keep postgres_changes with filter `id=eq.${deckId}` for the single-document update, or (B) if you have startupId, add a second channel `documents:${startupId}:changes` and in the handler filter `payload.new?.id === deckId` then invalidate. Default: keep postgres_changes for documents in this hook.

Update:

const channelRef = useRef<RealtimeChannel | null>(null);

useEffect(() => {
  if (!deckId) return;

  // Prevent duplicate subscriptions
  if (channelRef.current?.state === 'subscribed') return;

  const channel = supabase
    .channel(`pitchdeck:${deckId}:events`, {
      config: { private: true }
    })
    .on('broadcast', { event: 'slide_completed' }, ({ payload }) => {
      handleSlideCompleted(payload as SlideCompletedPayload);
    })
    .on('broadcast', { event: 'deck_ready' }, ({ payload }) => {
      handleDeckReady(payload as DeckReadyPayload);
    })
    // Keep postgres_changes for documents (backend sends to documents:startupId:changes, not this topic)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'documents', filter: `id=eq.${deckId}` },
      (payload) => {
        const doc = payload.new as { status?: string };
        if (doc.status === 'completed') {
          queryClient.invalidateQueries({ queryKey: ['pitch-deck', deckId] });
        }
      }
    );

  channelRef.current = channel;

  // Set auth before subscribing (await so subscription runs after auth)
  supabase.realtime.setAuth().then(() => {
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[PitchDeck Realtime] Channel subscribed');
      }
    });
  });

  return () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };
}, [deckId, handleSlideCompleted, handleDeckReady, queryClient]);
```

---

## Prompt 6: Update useCRMRealtime with Private Channel

**File:** `src/hooks/realtime/useCRMRealtime.ts`

**User Story**
- **As a** user in the CRM, **I want** contact and deal changes (and enrichment/scoring events) in real time **so that** the pipeline and contact list stay up to date.

**Journey**
1. User opens CRM for `startupId` → `useCRMRealtime(startupId)` runs.
2. Hook subscribes to `contacts:${startupId}:changes`, `deals:${startupId}:changes`, and `crm:${startupId}:events` with `private: true` and `setAuth()`.
3. Contact enriched or deal scored in background → UI updates; another user moves a deal → pipeline updates.
4. User switches startup or leaves CRM → channel removed.
5. Outcome: CRM stays live with private channels and no duplicate subscriptions.

**Real-world example**
- Morgan has the CRM pipeline open. A background job enriches a contact (LinkedIn data); the contact card updates with the new title and company without a refresh. Their co-founder moves "Acme Corp" from "Qualified" to "Proposal sent"; Morgan sees the deal move in the pipeline in real time. Only their startup's contacts/deals are on the channel (private + RLS).

---

```
Update useCRMRealtime to:
1. Add `config: { private: true }` to channel
2. Add `await supabase.realtime.setAuth()` before subscribing
3. Add channel state check with useRef
4. Migrate postgres_changes subscriptions to broadcast

The backend now broadcasts to topics:
- `contacts:${startupId}:changes`
- `deals:${startupId}:changes`

For the CRM-specific events (contact_enriched, deal_scored, etc.), keep using `crm:${startupId}:events` with broadcast.

For database changes, subscribe to the new broadcast topics instead of postgres_changes.

Add ref:
const channelRef = useRef<RealtimeChannel | null>(null);

Before subscribing:
if (channelRef.current?.state === 'subscribed') return;
await supabase.realtime.setAuth();

Channel config:
supabase.channel(`crm:${startupId}:events`, {
  config: { private: true }
})
```

---

## Prompt 7: Update useOnboardingRealtime with Private Channel

**File:** `src/hooks/realtime/useOnboardingRealtime.ts`

**User Story**
- **As a** user (or co-founder) in onboarding, **I want** enrichment and readiness events in real time **so that** we see step completion and score updates without refreshing.

**Journey**
1. User in onboarding wizard with `sessionId` → `useOnboardingRealtime(sessionId)` runs.
2. Hook subscribes to `onboarding:${sessionId}:events` with `private: true` and `setAuth()`; listens for `enrichment_*_completed`, `readiness_score_updated`.
3. Backend completes URL/context/founder enrichment or updates readiness → UI updates.
4. User completes onboarding or leaves → channel removed.
5. Outcome: Onboarding feels live and stays secure with one private channel per session.

**Real-world example**
- Taylor and their co-founder are on step 2 of onboarding. Taylor pastes the company URL; the backend enriches it. Within a few seconds the "Company context" section fills in without either of them refreshing. When the readiness score is recalculated, the score badge updates live. Only that onboarding session receives the events (private channel per sessionId).

---

```
Update useOnboardingRealtime to use private channels:

1. Add `config: { private: true }` to the channel
2. Add `await supabase.realtime.setAuth()` before subscribing
3. Add channel state check

const channelRef = useRef<RealtimeChannel | null>(null);

useEffect(() => {
  if (!sessionId) return;

  if (channelRef.current?.state === 'subscribed') return;

  const channel = supabase
    .channel(`onboarding:${sessionId}:events`, {
      config: { private: true }
    })
    .on('broadcast', { event: 'enrichment_url_completed' }, ...)
    .on('broadcast', { event: 'enrichment_context_completed' }, ...)
    .on('broadcast', { event: 'enrichment_founder_completed' }, ...)
    .on('broadcast', { event: 'readiness_score_updated' }, ...);

  channelRef.current = channel;

  supabase.realtime.setAuth().then(() => {
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Onboarding Realtime] Channel subscribed');
      }
    });
  });

  return () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };
}, [sessionId, ...]);
```

---

## Prompt 8: Update All Other Realtime Hooks

**Files:**
- `src/hooks/realtime/useEventsRealtime.ts`
- `src/hooks/realtime/useDocumentsRealtime.ts`
- `src/hooks/realtime/useInvestorsRealtime.ts`
- `src/hooks/realtime/useCanvasRealtime.ts`
- `src/hooks/realtime/useChatRealtime.ts`

**User Story**
- **As a** user on events, documents, investors, canvas, or chat, **I want** those features to use the same private-channel pattern **so that** realtime is secure and consistent everywhere.

**Journey**
1. User opens any of these areas → the corresponding hook runs with the right topic (e.g. `events:${id}:events`).
2. Each hook: `private: true`, `setAuth()` before subscribe, channel ref + state check, cleanup on unmount; postgres_changes migrated to broadcast where backend supports it.
3. User sees live updates for that feature; leaves page → channel removed.
4. Outcome: Uniform security and behavior across events, documents, investors, canvas, and chat.

**Real-world example**
- Jamie opens the Events page: new events appear as they're added. They switch to Documents: shared doc list updates when someone uploads. On the Investors page, a teammate adds a note to an investor; Jamie sees it without refresh. Same pattern (private + setAuth + ref + cleanup) everywhere, so no feature is left on a public or leaky channel.

---

```
For each of these realtime hooks, apply the same pattern:

1. Add useRef for channel state tracking:
   const channelRef = useRef<RealtimeChannel | null>(null);

2. Add state check before subscribing:
   if (channelRef.current?.state === 'subscribed') return;

3. Add private: true to channel config:
   supabase.channel(`topic:${id}:events`, { config: { private: true } })

4. Call setAuth before subscribing:
   await supabase.realtime.setAuth();

5. If using postgres_changes, migrate to broadcast:
   - Subscribe to `{table}:{startupId}:changes` topic
   - Listen for 'INSERT', 'UPDATE', 'DELETE' events on broadcast

6. Update cleanup to null the ref:
   return () => {
     if (channelRef.current) {
       supabase.removeChannel(channelRef.current);
       channelRef.current = null;
     }
   };
```

---

## Prompt 9: Update useCofounderPresence (if exists)

**File:** Look for files containing "presence" in hooks

**User Story**
- **As a** user in onboarding (or a shared room) with a co-founder, **I want** presence (who’s here, cursor/selection) over a private channel **so that** we collaborate without exposing presence to unauthenticated users.

**Journey**
1. User joins onboarding or shared room → presence hook subscribes to `room:${roomId}:presence` with `private: true` and `presence: { key: userId }`.
2. Hook calls `setAuth()` before subscribe; tracks channel with ref and cleans up on unmount.
3. Co-founder joins → presence list updates; either user leaves → presence list updates.
4. Outcome: Presence works with RLS; only authorized users see who’s in the room.

**Real-world example**
- Riley and their co-founder are both on the onboarding summary step. Riley sees "2 people here" and a small avatar for the co-founder. When the co-founder leaves the page, the presence list updates to "1 person here." Without private + setAuth, anyone could join the room and see who's editing; with the fix, only authenticated users in that session see presence.

---

```
If there's a useCofounderPresence hook or similar presence hook:

1. Add `config: { private: true, presence: { key: 'user-session' } }`
2. Add `await supabase.realtime.setAuth()` before subscribing
3. Add channel state check with ref

Presence hooks should use:
supabase.channel(`room:${roomId}:presence`, {
  config: {
    private: true,
    presence: { key: userId || 'anonymous' }
  }
})
```

---

## Testing Checklist

After applying these changes, test:

1. **Private channel auth**: Verify subscriptions connect (check console for "Channel subscribed")
2. **No duplicate subscriptions**: Check DevTools Network tab for single channel per topic
3. **Task updates**: Create/update/delete tasks, verify real-time updates in dashboard
4. **Deal updates**: Move deals in pipeline, verify real-time updates
5. **Pitch deck generation**: Start generation, verify progress events received
6. **Cleanup**: Navigate away and back, verify no connection leaks

---

## Order of Implementation

1. **Prompt 1** - Client config (low risk, adds logging)
2. **Prompt 2** - New shared hook (no breaking changes)
3. **Prompt 3b** - Update usePitchDeckGeneration (private + setAuth for generation progress; critical)
4. **Prompt 4** - Deduplicate tasks (fix duplicate subscriptions first)
5. **Prompt 3** - Update useDashboardRealtime (main fix; note broadcast payload shape)
6. **Prompts 5-8** - Update other hooks (systematic)
7. **Prompt 9** - Presence hooks (if applicable)

---

## Rollback Plan

If issues arise:
1. Remove `private: true` from channel configs (allows public access)
2. Remove `setAuth()` calls
3. Revert to postgres_changes if broadcast not working

The backend migration is backwards compatible - it supports both postgres_changes (via publication) and broadcast (via triggers).
