---
task_id: 001-ALR
title: Agent Loader Runtime
phase: CORE
priority: P0
status: Not Started
estimated_effort: 0.5 day
skill: [startup, devops]
subagents: [code-reviewer, supabase-expert]
edge_function: all (shared utility)
schema_tables: []
depends_on: []
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (backend utility) |
| **Features** | Runtime fragment loading, chat mode loading, file caching |
| **Edge Functions** | All 6 target EFs consume this utility |
| **Real-World** | "Agent loader reads scoring-fragment.md and appends it to the scoring agent's system prompt" |

## Description

**The situation:** The agency integration has 5 prompt fragment files in `agency/prompts/` and 4 chat mode files in `agency/chat-modes/`. A loader utility exists at `agency/lib/agent-loader.ts` with `loadFragment()` and `loadChatMode()` functions. The utility uses `Deno.readTextFile()` and has graceful fallback (empty string on missing file), but it has no caching — every call reads from disk.

**Why it matters:** Every edge function invocation that uses agency knowledge will call `loadFragment()`. Without caching, each Gemini API call adds a filesystem read. In Deno Deploy, cold starts already cost 100-200ms — adding uncached file reads compounds this. The loader is the critical foundation that all 21 subsequent tasks depend on.

**What already exists:**
- `agency/lib/agent-loader.ts` — `loadFragment()`, `loadChatMode()`, type exports
- `agency/prompts/*.md` — 5 runtime fragment files (validator-scoring, validator-composer, crm-investor, sprint-agent, pitch-deck)
- `agency/chat-modes/*.md` — 4 mode files (practice-pitch, growth-strategy, deal-review, canvas-coach)
- All files use markdown format, typically 800-2000 tokens each

**The build:**
- Add module-scope `Map<string, string>` cache for loaded fragments and modes
- First call reads from disk, subsequent calls return cached string
- Add optional `bustCache()` export for dev iteration
- Add `getLoadedFragments()` diagnostic export for quality tracking (task 017)
- Verify import path works from `supabase/functions/validator-start/` (3 levels up)
- Write unit test for load + cache + missing file fallback

**Example:** Marcus runs the validator pipeline. The scoring agent calls `loadFragment('validator-scoring-fragment')`. First invocation reads the 1,200-token markdown file from disk and caches it. The composer agent calls the same fragment — cache hit, zero disk I/O. Next pipeline run on the same isolate: all fragments served from cache.

## Rationale
**Problem:** Fragment loading adds disk I/O to every edge function call.
**Solution:** Module-scope cache eliminates repeat reads within the same Deno isolate lifecycle.
**Impact:** Zero additional latency for cached fragment loads. Foundation for all 21 downstream tasks.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | import `loadFragment` in any edge function | I can inject agency knowledge into system prompts |
| Developer | cached fragment loads | edge function latency isn't affected by file reads |
| Developer | graceful fallback on missing files | edge functions don't crash if a fragment is removed |

## Goals
1. **Primary:** `loadFragment(name)` and `loadChatMode(name)` work from any edge function
2. **Quality:** Cached reads return in < 1ms after first load

## Acceptance Criteria
- [ ] `loadFragment('validator-scoring-fragment')` returns non-empty string
- [ ] `loadChatMode('practice-pitch')` returns non-empty string
- [ ] Second call returns cached result (no disk read)
- [ ] Missing file returns empty string + console.warn
- [ ] Import path resolves from `supabase/functions/*/` directories
- [ ] TypeScript types exported: `FragmentName`, `ChatModeName`
- [ ] `bustCache()` clears the cache (dev use only)

| Layer | File | Action |
|-------|------|--------|
| Utility | `agency/lib/agent-loader.ts` | Modify — add cache Map, bustCache, getLoadedFragments |
| Test | `agency/lib/agent-loader.test.ts` | Create — 6 tests |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Fragment file missing | Returns empty string, logs warning, doesn't throw |
| Fragment file empty | Returns empty string (valid) |
| Concurrent first loads | Both read from disk, second write to cache is idempotent |
| Very large fragment (>4K tokens) | Loads normally — Gemini handles 1M context window |

## Real-World Examples

**Scenario 1 — Cold start:** Aisha deploys a new version of validator-start. First pipeline run reads all fragments from disk (~3ms total). Second run on same isolate: all fragments cached, 0ms overhead. **With caching,** only the first invocation per isolate pays the disk cost.

**Scenario 2 — Missing file:** A developer accidentally deletes `sprint-agent-fragment.md`. The sprint-agent calls `loadFragment('sprint-agent-fragment')`. **With graceful fallback,** it returns empty string and the sprint agent runs with its existing prompt — no crash, just a warning in logs.

## Outcomes

| Before | After |
|--------|-------|
| No caching — every EF call reads disk | Module-scope cache, read once per isolate |
| No diagnostic for which fragments loaded | `getLoadedFragments()` returns cache keys |
| Import path untested across EF directories | Verified working from all 6 target EFs |
| No unit tests for loader | 6 tests covering load, cache, fallback |
