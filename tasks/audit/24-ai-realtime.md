# Audit 24 — Supabase Realtime Implementation

> **Date:** 2026-02-15 | **Auditor:** Claude Opus 4.6
> **Scope:** All 14 realtime hooks, validator pipeline, AI chat, edge functions, RLS policies
> **References:** [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime), [Broadcast](https://supabase.com/docs/guides/realtime/broadcast), [Broadcast from DB](https://supabase.com/blog/realtime-broadcast-from-database)
> **Rule file:** `.cursor/rules/supabase/ai-Realtime-assistant-.mdc`

---

## Executive Summary

| Area | Grade | Notes |
|------|:-----:|-------|
| Chat Realtime | **A** | Full broadcast + presence + token streaming |
| Dashboard Realtime | **A** | 7 parallel channels, proper cleanup |
| Module Hooks (CRM, Canvas, etc.) | **A** | Private channels, RLS, setAuth() |
| Validator Pipeline | **D** | HTTP polling every 2s — no realtime at all |
| Cleanup & Memory | **A** | All hooks unsubscribe on unmount |
| Security (RLS + private) | **A** | Private channels + topic-based RLS |
| **Overall** | **B+** | Excellent foundation, validator is the gap |

---

## 1. Current Architecture

### 1.1 Realtime Hooks Inventory (14 hooks)

| Hook | Channel Pattern | Events | Broadcast | Presence | postgres_changes |
|------|----------------|--------|:---------:|:--------:|:----------------:|
| `useRealtimeAIChat` | `chat:{startup}:{room}:ai` | token_chunk, ai_response | Yes | — | — |
| `useRealtimeChatRoom` | `chat:{startup}:{room}:events` | user_message, token_chunk, message_complete, typing_* | Yes | Yes | — |
| `useDashboardRealtime` | `{table}:{startup}:changes` x7 | INSERT, UPDATE, DELETE | Yes | — | — |
| `useCRMRealtime` | `crm:{startup}:events` | contact_enriched, deal_scored, pipeline_analyzed | Yes | — | — |
| `useCanvasRealtime` | `canvas:{docId}:events` | canvas_validated, canvas_saved | Yes | — | Yes (documents) |
| `usePitchDeckRealtime` | `pitchdeck:{deckId}:events` | slide_completed, deck_ready | Yes | — | Yes (documents) |
| `useInvestorsRealtime` | `investors:{startup}:events` | investor_scored, readiness_updated | Yes | — | — |
| `useDocumentsRealtime` | `documents:{startup}:events` | document_analyzed | Yes | — | — |
| `useEventsRealtime` | `events:{startup}:events` | event_enriched | Yes | — | — |
| `useOnboardingRealtime` | `onboarding:{session}:events` | enrichment_* completed | Yes | — | — |
| `useChatRealtime` | `chat:{session}:events` | message_chunk, message_received | Yes | — | — |
| `useRealtimeChannel` | (base hook) | — | — | — | — |
| `useRealtimeSubscription` | (legacy) | — | — | — | Yes |
| `usePipelineRealtime` | — | — | — | — | — |

**Total:** 11 active hooks + 1 base + 1 legacy + 1 unused

### 1.2 Channel Security

| Check | Status | Details |
|-------|:------:|---------|
| All hooks use `private: true` | ✅ | Every `supabase.channel()` call includes `config.private: true` |
| `setAuth()` before subscribe | ✅ | Called in all hooks before `.subscribe()` |
| RLS on `realtime.messages` | ✅ | Topic-based access via startup ownership (`20260129140000`) |
| Duplicate prevention | ✅ | State checks (`joined`/`joining`) before new channel |
| Cleanup on unmount | ✅ | `supabase.removeChannel()` + ref nulling in all hooks |
| Topic naming convention | ✅ | `scope:entityId:type` — consistent across all hooks |

### 1.3 Edge Functions Broadcasting

| Function | Broadcasts | Channel | Events |
|----------|:---------:|---------|--------|
| `ai-chat` | ✅ | `chat:{startup}:{room}:events` | `message_complete` |
| `pitch-deck-agent` | ✅ | `pitch_deck_generation:{deckId}` | `slide_completed`, `deck_ready` |
| `validator-start` | ❌ | — | — |
| `validator-status` | ❌ | — | — |
| `validator-followup` | ❌ | — | — |

---

## 2. Validator Pipeline — Current State

### 2.1 How It Works Now (Polling)

```
ValidateIdea.tsx → useValidatorPipeline → POST /validator-start
                                              ↓
                   navigate → ValidatorProgress.tsx
                                              ↓
                              setInterval(fetchStatus, 2000)  ← HTTP poll every 2s
                                              ↓
                              GET /validator-status (up to 180 polls / 6 min)
                                              ↓
                              status === 'complete' → navigate → ValidatorReport.tsx
```

### 2.2 Problems with Polling

| Issue | Impact | Severity |
|-------|--------|:--------:|
| 2s poll interval | ~2s latency for status updates | MEDIUM |
| 180 polls max (6 min timeout) | Battery drain on mobile, wasted bandwidth | MEDIUM |
| No graceful resume | If user refreshes, polling restarts from scratch | LOW |
| Zombie cleanup reactive | Only triggers on poll — dead sessions linger until someone checks | LOW |
| Rate limit pressure | 120 req/60s per user on `validator-status` | LOW |
| No per-agent progress | Only overall status, not individual agent steps | MEDIUM |

### 2.3 What the Validator Pipeline Does NOT Broadcast

| Event | Description | Currently |
|-------|-------------|-----------|
| Agent started | "ResearchAgent started" | Not broadcast — only logged in edge fn |
| Agent completed | "ResearchAgent done in 12s" | Not broadcast |
| Agent failed | "CompetitorAgent timeout" | Not broadcast |
| Pipeline phase change | "Scoring → MVP → Composing" | Not broadcast |
| Report ready | "Report generated, redirecting" | Not broadcast — polling detects it |

---

## 3. AI Chat — Current State

### 3.1 How It Works Now (Realtime)

```
AIChat.tsx → useRealtimeAIChat → channel: chat:{startup}:ai-chat:ai
                                    ↓
             User sends message → POST /ai-chat (edge fn)
                                    ↓
             Edge fn processes → broadcasts message_complete to channel
                                    ↓
             Frontend receives → updates messages array
```

### 3.2 What's Working Well

| Feature | Implementation | Status |
|---------|---------------|:------:|
| Message broadcasting | `ai_response` event on channel | ✅ |
| Token streaming display | `token_chunk` events | ✅ |
| Connection status | `isConnected` state + UI indicator | ✅ |
| Knowledge search panel | Separate panel with RAG results | ✅ |
| Private channels | `private: true` + `setAuth()` | ✅ |

### 3.3 Gaps in Chat Realtime

| Gap | Description | Priority |
|-----|-------------|:--------:|
| No server-side streaming | Edge fn returns full response, then broadcasts — not true SSE streaming | P1 |
| No typing indicator | Only `useRealtimeChatRoom` has typing — `useRealtimeAIChat` does not | P2 |
| No "AI thinking" broadcast | User has no feedback while AI processes (only spinner) | P1 |
| Public mode skips broadcast | Non-authenticated users get no realtime (line 328 check) | P3 |

---

## 4. Compliance with Rule File

### 4.1 Rules Checklist (from `ai-Realtime-assistant-.mdc`)

| Rule | Status | Evidence |
|------|:------:|---------|
| **DO: Use `broadcast` for all realtime events** | ✅ | 11/14 hooks use broadcast |
| **DO: Use `presence` sparingly** | ✅ | Only `useRealtimeChatRoom` |
| **DO: Topic names `scope:entity`** | ✅ | `crm:{id}:events`, `chat:{id}:ai` |
| **DO: snake_case events** | ✅ | `token_chunk`, `message_complete`, `deal_scored` |
| **DO: Include unsubscribe/cleanup** | ✅ | All hooks cleanup in useEffect return |
| **DO: `private: true`** | ✅ | All channels |
| **DO: Error handling + reconnection** | ✅ | Channel state monitoring in subscribe callback |
| **DON'T: `postgres_changes` for new apps** | ⚠️ | 2 hooks still use it (Canvas, PitchDeck) |
| **DON'T: Multiple subscriptions without cleanup** | ✅ | State checks prevent duplicates |
| **DON'T: Generic event names** | ✅ | All events are specific (`contact_enriched`, not `update`) |
| **DON'T: Subscribe in render functions** | ✅ | All in useEffect with deps |

### 4.2 Migration Needed: postgres_changes → broadcast

| Hook | Table | Current | Recommended |
|------|-------|---------|-------------|
| `useCanvasRealtime` | `documents` | `postgres_changes` UPDATE | Add trigger → `broadcast` |
| `usePitchDeckRealtime` | `documents` | `postgres_changes` UPDATE | Add trigger → `broadcast` |

**Migration pattern** (from Supabase docs):

```sql
-- 1. Create trigger function
CREATE OR REPLACE FUNCTION documents_broadcast_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'documents:' || COALESCE(NEW.id, OLD.id)::text,
    TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2. Create trigger
CREATE TRIGGER documents_broadcast
  AFTER INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW EXECUTE FUNCTION documents_broadcast_trigger();

-- 3. Client: replace postgres_changes with broadcast
-- channel.on('broadcast', { event: 'UPDATE' }, handleDocUpdate)
```

---

## 5. Enhancement Recommendations

### 5.1 RT-1 — Validator Realtime Progress (Replace Polling) — P0

**Impact:** Eliminates 2s latency, removes ~90 polling requests per validation, enables per-agent progress

**Architecture:**

```
validator-start (edge fn)
  ├── ExtractorAgent starts → broadcast { event: 'agent_started', agent: 'extractor' }
  ├── ExtractorAgent done   → broadcast { event: 'agent_completed', agent: 'extractor', duration: 8200 }
  ├── ResearchAgent starts  → broadcast { event: 'agent_started', agent: 'research' }
  ├── ResearchAgent done    → broadcast { event: 'agent_completed', agent: 'research' }
  ├── ...
  └── Pipeline complete     → broadcast { event: 'pipeline_complete', reportId: '...' }
```

**Implementation plan:**

| Step | What | Effort |
|------|------|:------:|
| 1 | Create `broadcastPipelineEvent()` helper in `validator-start/_shared/` | S |
| 2 | Add broadcast calls in `pipeline.ts` for each agent start/complete/fail | S |
| 3 | Create `useValidatorRealtime` hook (subscribe to `validator:{sessionId}`) | M |
| 4 | Update `ValidatorProgress.tsx` to use realtime with polling fallback | M |
| 5 | Add per-agent progress bars (7 agents with live status) | M |
| 6 | Keep `validator-status` as fallback for reconnection/resume | S |

**Channel design:**

```typescript
// Edge function (validator-start/pipeline.ts)
const channel = supabase.channel(`validator:${sessionId}`);
await channel.send({
  type: 'broadcast',
  event: 'agent_started',
  payload: { agent: 'research', step: 2, totalSteps: 7, timestamp: Date.now() }
});

// Frontend (useValidatorRealtime.ts)
const channel = supabase.channel(`validator:${sessionId}`, {
  config: { broadcast: { self: false }, private: true }
});
channel
  .on('broadcast', { event: 'agent_started' }, handleAgentStart)
  .on('broadcast', { event: 'agent_completed' }, handleAgentComplete)
  .on('broadcast', { event: 'agent_failed' }, handleAgentFailed)
  .on('broadcast', { event: 'pipeline_complete' }, handleComplete);
```

**RLS policy:**

```sql
-- Allow users to receive validator broadcasts for their own sessions
CREATE POLICY "users_receive_validator_broadcasts" ON realtime.messages
FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'validator:%' AND
  EXISTS (
    SELECT 1 FROM validation_sessions vs
    WHERE vs.user_id = auth.uid()
    AND realtime.topic() = 'validator:' || vs.id::text
  )
);
```

### 5.2 RT-2 — AI Chat "Thinking" Indicator — P1

**Impact:** User sees "AI is thinking..." while Gemini processes instead of just a spinner

```typescript
// Edge function: broadcast before calling Gemini
await channel.send({
  type: 'broadcast',
  event: 'ai_thinking',
  payload: { messageId, model: 'gemini-3-flash', startedAt: Date.now() }
});

// After Gemini responds
await channel.send({
  type: 'broadcast',
  event: 'ai_response',
  payload: { messageId, content, duration, tokens }
});
```

**Frontend:** Show animated "thinking" dots with elapsed time counter.

### 5.3 RT-3 — True Server-Side Token Streaming — P1

**Impact:** AI responses appear token-by-token from the server instead of all-at-once

**Current flow:** Edge fn calls Gemini → waits for full response → broadcasts `message_complete`

**Improved flow:**

```typescript
// Edge function: stream Gemini response
const stream = await gemini.generateContentStream(prompt);
for await (const chunk of stream) {
  await channel.send({
    type: 'broadcast',
    event: 'token_chunk',
    payload: { messageId, token: chunk.text(), index: i++ }
  });
}
await channel.send({
  type: 'broadcast',
  event: 'message_complete',
  payload: { messageId, fullContent, suggestedActions }
});
```

**Note:** Requires Gemini streaming API support in edge function. Current `callGemini()` in `_shared/gemini.ts` returns full response.

### 5.4 RT-4 — Migrate postgres_changes to broadcast — P2

**Impact:** Better scalability per Supabase recommendation. Only 2 hooks affected.

| Hook | Current | Migration |
|------|---------|-----------|
| `useCanvasRealtime` | `postgres_changes` on documents | Add DB trigger + switch to broadcast |
| `usePitchDeckRealtime` | `postgres_changes` on documents | Same trigger — shared function |

**SQL migration:**

```sql
-- Single trigger function for documents table
CREATE OR REPLACE FUNCTION documents_broadcast_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'documents:' || COALESCE(NEW.id, OLD.id)::text,
    TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER documents_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW EXECUTE FUNCTION documents_broadcast_changes();
```

### 5.5 RT-5 — Validator Follow-up Push Delivery — P2

**Impact:** New follow-up questions appear instantly instead of on page reload

```typescript
// validator-followup edge function
await channel.send({
  type: 'broadcast',
  event: 'followup_ready',
  payload: { sessionId, question, topics: ['market_size', 'competitors'] }
});

// Frontend: useValidatorRealtime
channel.on('broadcast', { event: 'followup_ready' }, ({ payload }) => {
  addFollowupQuestion(payload.question);
  toast.info('New follow-up question from AI Coach');
});
```

### 5.6 RT-6 — Broadcast from Database Triggers — P3

**Impact:** Replace edge function broadcasting with database-level triggers for tables that already have CRUD operations

**Candidate tables:**

| Table | Current Broadcast Source | Recommendation |
|-------|------------------------|----------------|
| `validation_sessions` | None | Add trigger → broadcast status changes |
| `validation_reports` | None | Add trigger → broadcast on INSERT |
| `contacts` | Edge fn (`crm-agent`) | Move to DB trigger |
| `deals` | Edge fn (`crm-agent`) | Move to DB trigger |
| `experiments` | Edge fn (`experiment-agent`) | Move to DB trigger |

**Benefits:**
- Broadcasting happens automatically on any data change (not just edge fn calls)
- Works even if data is changed via Supabase Dashboard or direct SQL
- Messages persist for 3 days (replay support)
- Scales to tens of thousands of concurrent users

### 5.7 RT-7 — Connection Quality Metrics — P3

**Impact:** Monitor realtime health, detect degraded connections

```typescript
// Track in useRealtimeChannel base hook
const metrics = {
  connectTime: null as number | null,
  reconnectCount: 0,
  lastMessageAt: null as number | null,
  latency: null as number | null,
};

channel.subscribe((status) => {
  if (status === 'SUBSCRIBED') metrics.connectTime = Date.now();
  if (status === 'CHANNEL_ERROR') metrics.reconnectCount++;
});
```

### 5.8 RT-8 — Broadcast Replay for Missed Events — P3

**Impact:** If user disconnects/reconnects, replay missed events from last 3 days

```typescript
// Supabase supports replay on private channels
channel.on('broadcast', { event: 'agent_completed' }, handler, {
  since: lastReceivedTimestamp, // Unix ms
  limit: 25 // max 25 replayed messages
});
```

**Use case:** User refreshes ValidatorProgress page mid-pipeline — replays all agent events instead of polling from scratch.

---

## 6. Implementation Priority Matrix

| # | Enhancement | Effort | Impact | Priority | Depends On |
|---|-------------|:------:|:------:|:--------:|------------|
| RT-1 | Validator realtime progress | M | HIGH | **P0** | — |
| RT-2 | AI Chat "thinking" indicator | S | HIGH | **P1** | — |
| RT-3 | Server-side token streaming | L | HIGH | **P1** | Gemini streaming API |
| RT-4 | Migrate postgres_changes → broadcast | S | MED | **P2** | DB trigger migration |
| RT-5 | Follow-up push delivery | M | MED | **P2** | RT-1 (shared channel) |
| RT-6 | Broadcast from DB triggers | M | MED | **P3** | RT-4 |
| RT-7 | Connection quality metrics | S | LOW | **P3** | — |
| RT-8 | Broadcast replay for missed events | S | LOW | **P3** | Private channels (done) |

**Effort:** S = 1-2 days, M = 3-5 days, L = 1-2 weeks

---

## 7. Implementation Sequence

```
NOW:       RT-1 (Validator realtime — biggest gap, core product)
           RT-2 (AI thinking indicator — quick win, 1 day)
NEXT:      RT-3 (Token streaming — needs Gemini streaming support in callGemini)
           RT-4 (postgres_changes migration — 2 hooks, 1 migration)
AFTER:     RT-5 (Follow-up push — uses RT-1 channel)
           RT-6 (DB triggers for contacts, deals, experiments)
LATER:     RT-7 (Metrics — nice to have)
           RT-8 (Replay — nice to have)
```

---

## 8. Files Reference

### Realtime Hooks

| File | Purpose |
|------|---------|
| `src/hooks/realtime/useRealtimeChannel.ts` | Base hook with RLS support |
| `src/hooks/realtime/useRealtimeAIChat.ts` | AI chat streaming + broadcast |
| `src/hooks/realtime/useRealtimeChatRoom.ts` | Multi-user chat + presence |
| `src/hooks/realtime/useDashboardRealtime.ts` | 7 parallel table channels |
| `src/hooks/realtime/useCRMRealtime.ts` | CRM events |
| `src/hooks/realtime/useCanvasRealtime.ts` | Canvas events + postgres_changes |
| `src/hooks/realtime/usePitchDeckRealtime.ts` | Pitch deck events + postgres_changes |
| `src/hooks/realtime/useInvestorsRealtime.ts` | Investor events |
| `src/hooks/realtime/useDocumentsRealtime.ts` | Document events |
| `src/hooks/realtime/useEventsRealtime.ts` | Event enrichment |
| `src/hooks/realtime/useOnboardingRealtime.ts` | Onboarding progress |
| `src/hooks/realtime/useChatRealtime.ts` | Basic chat events |
| `src/hooks/realtime/types.ts` | Shared types |
| `src/hooks/realtime/animations.ts` | Transition configs |

### Validator (Polling — No Realtime)

| File | Purpose |
|------|---------|
| `src/hooks/useValidatorPipeline.ts` | POST to validator-start |
| `src/pages/ValidatorProgress.tsx` | 2s polling loop (180 polls max) |
| `src/pages/ValidatorReport.tsx` | Static report display |
| `supabase/functions/validator-start/index.ts` | Pipeline trigger |
| `supabase/functions/validator-status/index.ts` | Polling endpoint |

### Edge Functions with Broadcasting

| File | Events |
|------|--------|
| `supabase/functions/ai-chat/index.ts` | `message_complete` |
| `supabase/functions/pitch-deck-agent/actions/generation.ts` | `slide_completed`, `deck_ready` |

### RLS & Config

| File | Purpose |
|------|---------|
| `supabase/archive/20260129140000_setup_realtime_authorization.sql` | RLS on realtime.messages |
| `.cursor/rules/supabase/ai-Realtime-assistant-.mdc` | Rule file (420 lines) |

---

## 9. Summary

**What's excellent:**
- 14 realtime hooks with proper cleanup, private channels, RLS, and setAuth()
- Chat features fully realtime with broadcast + presence + token streaming
- Dashboard listens to 7 tables simultaneously
- Consistent topic naming (`scope:entityId:type`)
- Zero memory leaks — all channels cleaned up on unmount

**The one big gap:**
- **Validator pipeline uses HTTP polling** — no realtime broadcasting for pipeline progress
- This is the core product feature, runs for 60-120s, and users stare at a progress page
- Switching to realtime broadcast would eliminate ~90 polling requests per validation run

**Quick wins:**
- RT-2 (AI thinking indicator): 1 day, immediate UX improvement
- RT-4 (postgres_changes migration): 1 day, 2 hooks, follows rule file recommendation

**Major improvement:**
- RT-1 (Validator realtime progress): 3-5 days, transforms the core UX from "am I stuck?" to real-time agent-by-agent progress
