---
task_id: 018-FRC
title: Fragment Caching Optimization
phase: ADVANCED
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [devops, startup]
subagents: [code-reviewer]
edge_function: all (agent-loader.ts)
schema_tables: []
depends_on: [001-ALR]
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (backend utility) |
| **Features** | TTL-based cache invalidation, cold-start benchmarking, cache stats export |
| **Edge Functions** | All EFs that use `agent-loader.ts` (validator-start, crm-agent, sprint-agent, pitch-deck-agent, lean-canvas-agent, ai-chat) |
| **Real-World** | "Developer edits a fragment file and the next EF call after 5 minutes picks up the change automatically — no process restart needed" |

## Description

**The situation:** Task 001 added a basic module-scope `Map<string, string>` cache to `agent-loader.ts`. Once a fragment is loaded from disk, it stays in memory for the lifetime of the Deno isolate. This works well in production (Deno Deploy isolates recycle periodically, picking up new file contents on next cold start) but creates friction in development. When a developer edits a fragment markdown file and immediately calls the edge function, the cached stale version is returned. The only way to pick up changes is to restart the Deno process or call `bustCache()` manually. There are also no metrics on cache performance — no hit/miss ratio, no load timing data, and no visibility into whether the cache is actually providing the expected latency benefit.

**Why it matters:** Fragment iteration speed directly affects agency development velocity. If every fragment edit requires a manual cache bust or process restart, developers lose 30-60 seconds per edit cycle. Over a day of fragment tuning (10-20 edits), that compounds to 5-20 minutes of wasted time. On the production side, without cache stats there is no way to confirm the caching is working as intended or to detect pathological cases (e.g., a fragment that fails to cache and reads from disk every time). Cold-start timing data is needed to set performance budgets for the agency system.

**What already exists:**
- `agency/lib/agent-loader.ts` — `loadFragment(name)`, `loadChatMode(name)`, `bustCache()`, `getLoadedFragments()`
- Cache: `Map<string, string>` — simple key-value, no metadata
- `bustCache()` — clears entire cache, requires explicit call
- `getLoadedFragments()` — returns array of cached fragment names
- 5 fragment files in `agency/prompts/` (800-2000 tokens each)
- 4 chat mode files in `agency/chat-modes/`
- Deno Deploy environment detection: `Deno.env.get('DENO_DEPLOYMENT_ID')` is set in production, absent in local dev

**The build:**
1. **Cache entry upgrade:** Change cache from `Map<string, string>` to `Map<string, CacheEntry>` where `CacheEntry = { content: string, loadedAt: number, loadTimeMs: number }`. The `loadedAt` timestamp enables TTL checking, and `loadTimeMs` records how long the disk read took.
2. **TTL logic:** On cache read, check if entry has expired. Dev mode (no `DENO_DEPLOYMENT_ID`): 5-minute TTL — after 5 minutes, next `loadFragment()` call re-reads from disk. Production mode: infinite TTL — entry is valid for the entire isolate lifecycle (Deno Deploy handles freshness through isolate recycling on deploys).
3. **Cache stats:** Add `getCacheStats()` export returning `{ hits: number, misses: number, entries: number, avgLoadTimeMs: number, mode: 'dev' | 'production' }`. Increment counters on every `loadFragment()` / `loadChatMode()` call. This feeds into task 017 quality tracking.
4. **Cold-start benchmark:** Write a test that loads all 9 fragments (5 prompts + 4 modes) in sequence and asserts total time < 50ms. This establishes the performance baseline and catches regressions if fragment files grow too large.
5. **Preserve existing API:** `bustCache()` continues to work as a hard invalidation. `getLoadedFragments()` still returns fragment names. No breaking changes to existing callers.

**Example:** Developer Priya is tuning the `validator-scoring-fragment.md` to improve evidence tier distribution. She edits the file, saves, and calls the validator pipeline via the browser. The first call hits the cache (still within 5-min window) and returns the old fragment. She waits 5 minutes and calls again — this time the TTL has expired, `loadFragment()` re-reads from disk, and the updated fragment is injected into the scoring agent's prompt. She checks `getCacheStats()` via the diagnostic endpoint and sees: 14 hits, 3 misses, avg load time 1.2ms. She confirms the cache is working as expected and the cold-start overhead is negligible.

## Rationale

**Problem:** Basic Map cache has no TTL — dev changes require process restart. No cache performance metrics to confirm caching works. No cold-start baseline for performance budgeting.

**Solution:** Timestamped cache entries with environment-aware TTL. Cache stats export for observability. Cold-start benchmark test for regression prevention.

**Impact:** 30-60 seconds saved per fragment edit in dev. Confirmed cache effectiveness in production via metrics. Performance baseline established for agency system scaling decisions.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | edit a fragment and have it auto-refresh in dev | I don't have to restart the EF process after every edit |
| Developer | see cache hit/miss ratio | I can confirm caching is working as expected |
| DevOps | verify cold-start fragment loading is fast | I can set performance budgets for edge function startup |
| Developer | infinite cache TTL in production | I get maximum performance with no unnecessary disk reads |

## Goals

1. **Primary:** Fragment changes in dev auto-refresh after 5 minutes without process restart
2. **Observability:** `getCacheStats()` provides hit/miss ratio and average load time
3. **Performance:** Cold-start loading of all 9 fragments completes in < 50ms
4. **Compatibility:** Zero breaking changes to existing `loadFragment()` / `loadChatMode()` callers

## Acceptance Criteria

- [ ] Cache entries store `{ content: string, loadedAt: number, loadTimeMs: number }`
- [ ] Dev mode detected via absence of `DENO_DEPLOYMENT_ID` env var
- [ ] Dev mode: cache entries expire after 5 minutes (300,000 ms)
- [ ] Production mode: cache entries never expire (infinite TTL)
- [ ] `getCacheStats()` exported and returns `{ hits, misses, entries, avgLoadTimeMs, mode }`
- [ ] Cache hit counter increments on cached reads
- [ ] Cache miss counter increments on disk reads (first load + TTL expiry)
- [ ] Cold-start benchmark test loads all 9 fragments in < 50ms
- [ ] `bustCache()` still clears all entries and resets stats
- [ ] `getLoadedFragments()` still returns array of cached fragment names
- [ ] Existing `loadFragment()` / `loadChatMode()` callers require zero changes
- [ ] No regression in production edge function latency

| Layer | File | Action |
|-------|------|--------|
| **Utility** | `agency/lib/agent-loader.ts` | Modify — CacheEntry type, TTL logic, getCacheStats, hit/miss counters |
| **Types** | `agency/lib/agent-loader.ts` | Modify — export CacheEntry and CacheStats types |
| **Test** | `agency/lib/agent-loader.test.ts` | Modify — add TTL tests, cache stats tests, cold-start benchmark |
| **Verification** | Manual | Edit fragment file, wait 5 min, verify new content loaded in dev |
| **Verification** | Manual | Check getCacheStats() output after 10+ fragment loads |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| TTL expires during a running EF invocation | Current invocation uses cached content. Next invocation re-reads. No mid-request invalidation. |
| Fragment file deleted after caching | On TTL expiry, re-read attempt fails gracefully — returns empty string + warning (existing fallback). Cache entry removed. |
| Fragment file updated to empty content | On TTL expiry, re-reads empty file. Cache entry updated with empty string. Valid scenario (explicitly cleared fragment). |
| `DENO_DEPLOYMENT_ID` env var set in local testing | Treated as production mode (infinite TTL). Developer can override by calling `bustCache()`. |
| System clock skew | Minimal impact — TTL is relative (5 min from load time). Only affects if clock jumps backward mid-session. |
| Concurrent TTL expiry + reads | First reader re-reads from disk and updates cache. Concurrent readers may also re-read (no locking). Second write is idempotent — both writes produce same content. |
| `getCacheStats()` called before any loads | Returns `{ hits: 0, misses: 0, entries: 0, avgLoadTimeMs: 0, mode: 'dev' or 'production' }` |
| `bustCache()` called between loads | Resets all counters and entries. Next load is a fresh miss. |

## Real-World Examples

**Scenario 1 — Dev iteration loop:** Priya is improving the `validator-scoring-fragment.md` to add better evidence tier instructions. She edits the file, saves, and runs a test pipeline. The scoring agent uses the old cached fragment (TTL hasn't expired). She makes another edit 3 minutes later and runs again — still cached. After 5 minutes from the first load, she runs a third time. **With TTL caching,** this call detects the expired entry, re-reads from disk, and picks up both edits automatically. No process restart, no manual `bustCache()`.

**Scenario 2 — Production deploy verification:** After deploying a new version of the agency fragments, the DevOps engineer checks the diagnostic endpoint (wired in task 001). `getCacheStats()` shows: 0 hits, 6 misses — confirming this is a fresh isolate that loaded all fragments from disk. After 20 pipeline runs: 114 hits, 6 misses, avgLoadTimeMs: 1.4ms. **With cache stats,** the engineer confirms caching is working perfectly in production and the 1.4ms average disk read is well within budget.

**Scenario 3 — Cold-start performance audit:** The team notices edge function cold starts have increased from 200ms to 350ms over the past month. They check the cold-start benchmark test — all 9 fragments load in 38ms total. Fragment loading is not the bottleneck (it was a new npm dependency). **With the benchmark test,** fragment loading is ruled out as a performance culprit in under 10 seconds, saving an hour of manual profiling.

## Outcomes

| Before | After |
|--------|-------|
| No TTL — cache stale until process restart | 5-min dev TTL, infinite production TTL |
| Fragment edit requires process restart in dev | Auto-refresh after TTL expiry, zero friction |
| No cache metrics | `getCacheStats()` returns hits, misses, avg load time, mode |
| No cold-start performance baseline | Benchmark test asserts < 50ms for all 9 fragments |
| Cache entry stores only content string | Cache entry includes `loadedAt` timestamp and `loadTimeMs` |
| Cannot distinguish dev vs production cache behavior | `mode` field in cache stats, environment-aware TTL logic |
