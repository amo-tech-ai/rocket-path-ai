## Supabase Realtime — Application Audit Report

**Scope:** StartupAI frontend (`src/`) + Edge Functions usage (`supabase/functions/`) + DB support functions (migrations).  
**Audit date:** 2026-03-18  
**Realtime features in use:** **Broadcast + Presence** (no evidence of client `postgres_changes` subscriptions; broadcast is used for “table change” semantics).  

---

## Executive Summary (what matters)

Realtime is being used across the product for:

- **UI responsiveness** (invalidate queries on changes, show progress streams, typing indicators).
- **Collaboration** (presence + cursors + field locking).
- **Long-running AI workflows** (validator/pitch deck streaming updates).

The **frontend patterns are mostly good** (private channels, `setAuth()` before subscribe, cleanup).  
The **largest red flag is backend broadcasting**: multiple edge functions attempt to broadcast by opening Realtime channels via `supabase.channel(...).send(...)` server-side, despite the repo already having **database-side** realtime primitives (`public.send_realtime_event()`, `realtime.broadcast_changes()`, and HTTP broadcast API usage). This is a reliability/security/perf risk.

---

## Where we use Supabase Realtime (inventory)

### Shared abstractions (core)

- `src/hooks/realtime/useRealtimeChannel.ts` — generic subscription wrapper (broadcast, private channels, replay support, metrics)
- `src/hooks/useRealtimeSubscription.ts` — dashboard multiplex channel + generic “table changes via broadcast”

### Feature hooks/components (examples)

- **Validator streaming**: `src/hooks/realtime/useValidatorRealtime.ts` subscribes to `validator:{sessionId}`
- **AI chat streaming**: `src/hooks/realtime/useRealtimeAIChat.ts` subscribes to `chat:{startupId|userId}:{roomId}:ai`
- **Pitch deck generation progress**: `src/hooks/usePitchDeckGeneration.ts` (topic-based progress events)
- **Collaboration presence**:
  - `src/components/collaboration/MultiUserCanvasEditor.tsx` — presence + cursor tracking + broadcast field locks (`canvas:{documentId}`)
  - `src/components/collaboration/TeamPresenceIndicator.tsx` — team presence (`presence:{channelName}`)

### Edge Functions broadcasting (server-side)

Observed patterns:

- `supabase/functions/_shared/broadcast.ts` → `supabase.channel(topic).send({ type: 'broadcast', ... })`
- `supabase/functions/validator-start/broadcast.ts` → `supabase.channel('validator:{sessionId}').send(...)`
- `supabase/functions/pitch-deck-agent/actions/generation.ts` → `supabase.channel('pitch_deck_generation:{deckId}').send(...)`

### Database support for broadcast (already exists)

In `supabase/migrations/20260308090000_create_missing_functions.sql`:

- `public.send_realtime_event(topic, event_name, payload)` wraps `realtime.send(..., is_private := TRUE)`
- `public.broadcast_table_changes()` trigger uses `realtime.broadcast_changes(...)`
- `broadcast_validator_report_insert()` uses `net.http_post` to call `/realtime/v1/api/broadcast` (server API)

---

## Best practices vs implementation (pass/fail)

### 1) Private channels + auth (`private: true` + `setAuth()`)

- **Mostly PASS on frontend**:
  - `useRealtimeChannel` defaults `private: true` and calls `supabase.realtime.setAuth()` before `subscribe()`.
  - `useDashboardRealtime` uses `private: true` and calls `setAuth()` before subscribe.
  - Collaboration components use `private: true` and call `setAuth()` before subscribe.
- **Risk / Failure point**:
  - Some feature hooks create channels directly (not via `useRealtimeChannel`) → consistency drift risk.
  - If Realtime “private-only channels” setting is enabled, any missed `private: true` will hard-fail.

**Improvement:** centralize channel creation through `useRealtimeChannel` (or a single helper) for consistency.

### 2) Cleanup / unsubscribe on unmount

- **PASS**: widespread `supabase.removeChannel(channel)` on cleanup.
- **Minor red flag**: some code calls both `channel.unsubscribe()` and `removeChannel()`. This is usually fine but can create noisy logs/retries.

**Improvement:** standardize on *one* cleanup approach (`removeChannel` is typically enough).

### 3) Topic naming strategy (granularity + semantics)

Observed topic patterns:

- Good: scoped topics like `validator:{sessionId}`, `dashboard:{startupId}:changes`, `chat:{startupId}:{roomId}:ai`, `report:{id}:presence`
- Mixed: some “table change” topics like `${table}:${id}:changes` (ok if triggers match)

**PASS** overall — topics are generally scoped and not global.

**Improvement:** formalize topic contracts in one place (a `realtimeTopics.ts`) to avoid typos and fragmentation.

### 4) Event naming (consistency)

Observed:

- Good snake_case events: `agent_started`, `pipeline_complete`, `token_chunk`, `canvas_saved`
- Mixed “table change” events: `INSERT/UPDATE/DELETE` (still workable; less semantic)

**PASS** — but consider preferring semantic events (`task_created`, `task_updated`) for higher-level UIs to reduce client logic branching.

### 5) Presence usage (rate + payload size)

**Major risk:** cursor tracking uses `.track()` on **every mouse move** in `MultiUserCanvasEditor`. This can:

- Hit presence rate limits (client/window based).
- Create unnecessary bandwidth/CPU usage.
- Cause “presence flapping” and lag for other users.

**Blocker risk:** under load, presence events can dominate the channel and drown out broadcast events (locks/messages).

**Improvements:**

- Throttle cursor `.track()` to ~10–20 Hz max (e.g., `requestAnimationFrame` + time budget).
- Reduce presence payload (cursor position only, not repeated name/email each time).
- Consider splitting channels: `canvas:{id}:presence` and `canvas:{id}:events` if collisions occur.

### 6) Postgres Changes vs Broadcast

No evidence of client `.on('postgres_changes', ...)` usage; the app uses **broadcast** for “changes”.

This aligns with the internal rule recommending broadcast+triggers for scalable DB-change notification (rather than relying on Postgres Changes subscriptions).

### 7) Backend broadcasting pattern (edge functions)

**FAIL / Red flag:** multiple edge functions broadcast by doing:

```ts
const channel = supabase.channel(topic)
await channel.send({ type: 'broadcast', event, payload })
```

Why this is risky:

- It requires a WebSocket connection from the edge runtime to Realtime (adds latency, resource use, failure modes).
- The channel config isn’t explicit (`private: true`, `ack`, auth) on the server side.
- It’s harder to enforce topic authorization consistently.

**Better alternatives (already available in your repo):**

- Use `supabase.rpc('send_realtime_event', { topic, event_name, payload })` which wraps `realtime.send(..., TRUE)` (private).
- For “table change” semantics, use DB triggers with `public.broadcast_table_changes()` / `realtime.broadcast_changes()`.
- For batch broadcasts, use the Realtime HTTP broadcast API (you already do this in `broadcast_validator_report_insert()`).

**Priority fix:** migrate `_shared/broadcast.ts` + validator + pitch-deck generation progress to DB-side send (`send_realtime_event`) or HTTP broadcast API.

---

## Concrete issues (errors / red flags / failure points / blockers)

### P0 — Must fix

- **Server-side websocket broadcasting from Edge Functions** (`_shared/broadcast.ts`, validator/pitch-deck broadcast helpers).  
  **Failure modes:** dropped events, unexpected auth behavior, additional latency, hard-to-debug intermittent disconnects.

### P1 — Should fix soon

- **Unthrottled presence tracking** (cursor `.track()` per mouse move).  
  **Failure modes:** rate limiting, degraded collaboration UX, higher costs.

### P2 — Nice improvements

- Centralize all channel creation through `useRealtimeChannel` abstraction.
- Standardize cleanup strategy.
- Move topic strings to a single module.
- Prefer semantic events where it simplifies client logic.

---

## Recommended implementation plan (fast, low risk)

1. **Replace edge-function broadcast helpers**:
   - Update `supabase/functions/_shared/broadcast.ts` to call `supabase.rpc('send_realtime_event', ...)` instead of `supabase.channel(...).send(...)`.
   - Update `validator-start/broadcast.ts` and `pitch-deck-agent/actions/generation.ts` to use that helper.
2. **Throttle presence updates**:
   - Implement throttling in `MultiUserCanvasEditor` and any typing indicator hooks using `.track()`.
3. **Add an app-level “Realtime contract” doc**:
   - One page listing topics, events, payload shapes, and which producer (DB trigger vs edge function) emits them.

---

## Verification checklist (definition of done)

- [ ] No edge function opens a Realtime websocket channel for broadcast
- [ ] Realtime messages are sent via DB function (`send_realtime_event`) or HTTP broadcast API
- [ ] Presence `.track()` is throttled (<= 20 updates/sec)
- [ ] All channels that require auth use `private: true` and call `setAuth()` before subscribe
- [ ] Cleanup removes channels reliably (no duplicate subscriptions on rerenders)

---

## References

- Supabase Realtime docs: [Realtime guide](https://supabase.com/docs/guides/realtime)
- Supabase Realtime server: [supabase/realtime](https://github.com/supabase/realtime)

