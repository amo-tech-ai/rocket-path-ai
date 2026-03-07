---
task_id: PROD-08
title: Edge Function Cleanup (Remove Legacy, Sync Local/Remote)
phase: PRODUCTION
priority: P2
status: Not Started
estimated_effort: 1 day
skill: [data/supabase-edge-functions]
subagents: [supabase-expert]
schema_tables: []
depends_on: [PROD-01]
---

# Prompt 08: Edge Function Cleanup

> **Priority:** P2 | **Current:** 31 local functions, 37 deployed (6 orphaned remote)
> **Affects:** Supabase edge functions, deployment pipeline

---

## Summary

| Aspect | Details |
|--------|---------|
| **Scope** | Remove orphaned remote functions, verify all local functions deployed |
| **Targets** | Local and remote function count match exactly |
| **Real-World** | "Admin sees only active functions in Supabase dashboard, no stale test endpoints" |

## Description

**The situation:** The Supabase project has 37 deployed edge functions, but only 31 exist in the local codebase (`supabase/functions/`). The 6 extras are legacy or test functions deployed during development — things like `gemini-test`, or functions that were renamed or replaced. They still accept HTTP requests and consume resources.

**Why it matters:** Orphaned functions are a security risk — they may have outdated auth checks, expose deprecated APIs, or accept requests to endpoints that nobody monitors. They also confuse developers who see functions in the Supabase dashboard that don't exist in the codebase. For a production launch, every deployed function should have a corresponding local source file.

**What already exists:** All 31 local functions are deployed and working. The orphaned functions are identified by comparing `supabase functions list` output against `ls supabase/functions/`.

**The fix:** (1) List all deployed functions via Supabase MCP or CLI. (2) Compare against local `supabase/functions/` directories. (3) For each orphaned function, check if it's referenced anywhere (other functions, frontend code, external webhooks). (4) Delete confirmed orphans via `supabase functions delete <name>`. (5) Document the cleanup in a brief log.

**Example:** The `gemini-test` function was deployed during early API testing. It has no JWT verification and returns raw Gemini API responses. Nobody calls it, but it's still accepting requests at `https://yvyesmiczbjqwbqtlidy.supabase.co/functions/v1/gemini-test`. After cleanup, it's deleted and the Supabase dashboard shows only the 31 active functions that match the codebase.

## Rationale

**Problem:** 6 orphaned edge functions deployed on Supabase with no local source code. Potential security risk and developer confusion.
**Solution:** Identify, verify, and delete orphaned functions. Ensure local and remote are in sync.
**Impact:** Clean deployment state. No stale endpoints accepting requests.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | see only active functions in Supabase dashboard | I know what's deployed matches the codebase |
| Admin | have no stale endpoints accepting requests | there's no security risk from forgotten test functions |

## Goals

1. **Primary:** Local and remote edge function counts match exactly
2. **Quality:** No orphaned functions accepting HTTP requests

## Acceptance Criteria

- [ ] All deployed functions identified and compared against local codebase
- [ ] Each orphaned function checked for references (frontend, other functions, webhooks)
- [ ] Confirmed orphans deleted via Supabase CLI or dashboard
- [ ] Remaining deployed functions match local `supabase/functions/` directories exactly
- [ ] Cleanup documented (which functions removed, why)

## Wiring Plan

| Layer | Action |
|-------|--------|
| Audit | List remote functions: `supabase functions list --project-ref yvyesmiczbjqwbqtlidy` |
| Audit | List local functions: `ls supabase/functions/` |
| Audit | Diff the two lists to find orphans |
| Verify | For each orphan: `grep -r "function-name" src/ supabase/` to check references |
| Delete | `supabase functions delete <name> --project-ref yvyesmiczbjqwbqtlidy` per confirmed orphan |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Orphaned function is called by an external webhook | Do not delete — add local source or document the dependency |
| Function was renamed (old name orphaned, new name active) | Safe to delete the old name |
| Function has active invocations in logs | Investigate before deleting — may have undocumented consumers |
| Supabase CLI can't delete a function | Use Supabase dashboard manually |

## Outcomes

| Before | After |
|--------|-------|
| 37 deployed, 31 local (6 orphaned) | N deployed = N local (0 orphaned) |
| Stale test endpoints accepting requests | Only active, monitored functions deployed |
| Developer confusion about dashboard functions | Dashboard matches codebase exactly |
