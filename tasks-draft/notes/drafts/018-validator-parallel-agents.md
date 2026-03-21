---
task_id: 018-VPA
title: Validator Parallel Agents
diagram_ref: D-01
phase: MVP
priority: P1
status: Not Started
skill: /edge-functions
ai_model: gemini-3-flash-preview
subagents: [supabase-expert, ai-agent-dev]
edge_function: validator-agent-research
schema_tables: [validator_agent_runs]
depends_on: [017-VCS]
---

# 018 - Validator Parallel Agents

> Extract Research + Competitors to own edge functions for true parallel execution

---

| Aspect | Details |
|--------|---------|
| **Screens** | — (backend pipeline change, transparent to user) |
| **Features** | Independent Research + Competitors edge functions, true parallelism |
| **Agents** | Research agent, Competitors agent |
| **Edge Functions** | /validator-agent-research (new), /validator-agent-competitors (new) |
| **Use Cases** | Research and Competitors run simultaneously with independent timeouts |
| **Real-World** | "Research takes 40s and Competitors takes 30s — both run in parallel = 40s total" |

---


## Description

Extract Research and Competitors agents from `validator-start` into their own edge functions. Both run in parallel after Extractor completes, each with independent 90s/120s timeouts. Results write to `validator_agent_runs`. The pipeline (still in validator-start) dispatches both via `Promise.all([fetch(research), fetch(competitors)])` and waits for both before triggering Scoring.

## Rationale

**Problem:** Today Competitors runs as a background promise hack inside the monolith. Research runs sequentially. Both share the pipeline deadline.
**Solution:** Separate edge functions with independent Deno Deploy isolates. True `Promise.all` parallelism.
**Impact:** Pipeline critical path drops from ~67s to ~45s. Each agent gets full timeout independently.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get my report faster | research and competitor analysis run simultaneously |

## Goals

1. **Primary:** Research + Competitors run as independent edge functions
2. **Secondary:** True parallel dispatch via Promise.all
3. **Quality:** Each agent has independent 90-120s timeout (no shared deadline)

## Acceptance Criteria

- [ ] `validator-agent-research/index.ts` created — Google Search + URL Context + RAG
- [ ] `validator-agent-competitors/index.ts` created — Google Search competitor analysis
- [ ] Both read StartupProfile from `validator_agent_runs` (Extractor output)
- [ ] Both write results to `validator_agent_runs`
- [ ] Pipeline dispatches both via `Promise.all([fetch(research), fetch(competitors)])`
- [ ] Research gets 90s independent timeout
- [ ] Competitors gets 120s independent timeout
- [ ] Competitors failure = `degraded_success` (report still generates)
- [ ] JWT verified on both functions
- [ ] Research RAG integration preserved (searchKnowledge calls)
- [ ] E2E test: both agents complete in parallel, Scoring receives both outputs

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Edge Function | `supabase/functions/validator-agent-research/index.ts` | Create |
| Edge Function | `supabase/functions/validator-agent-competitors/index.ts` | Create |
| Pipeline | `supabase/functions/validator-start/pipeline.ts` | Replace inline with parallel fetch |
| Agent | `supabase/functions/validator-start/agents/research.ts` | Move logic to new fn |
| Agent | `supabase/functions/validator-start/agents/competitors.ts` | Move logic to new fn |

## Strategy Reference

Source: `lean/tasks/02-validator/strategy/04-agent-workflows.md` (Agent Dependency Graph — parallel paths)


---

## Production Ready Checklist

- [ ] `npm run build` passes (no new errors)
- [ ] `npm run test` passes (no regressions)
- [ ] New component renders without console errors
- [ ] Loading, error, empty states handled
- [ ] Works on desktop (1280px+) and mobile (375px)
- [ ] Data persists after page refresh
- [ ] RLS policies verified (if new tables)
- [ ] Edge function deployed and responds 200 (if applicable)
- [ ] No secrets in client code

## Regression Checklist

> Verify existing features still work after this task.

- [ ] Validator: Chat → Progress → Report flow works
- [ ] Lean Canvas: Auto-populate from report works
- [ ] Dashboard: Loads without errors
- [ ] Auth: Login/logout works
- [ ] Onboarding: Wizard completes

## Testing

- [ ] Unit tests for new hooks/utilities
- [ ] Manual test: happy path works end-to-end
- [ ] Manual test: error/empty states handled
- [ ] No console errors in browser DevTools
