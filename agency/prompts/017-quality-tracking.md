---
task_id: 017-QTR
title: Agency Quality Tracking
phase: ADVANCED
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [data, startup]
subagents: [supabase-expert, code-reviewer]
edge_function: all (logging enhancement)
schema_tables: [ai_runs]
depends_on: [001-ALR]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Analytics page (new widget), AI Cost Monitoring panel |
| **Features** | Fragment usage logging, evidence tier tracking, bias flag counting, usage heatmap |
| **Edge Functions** | All 6 target EFs (validator-start, crm-agent, sprint-agent, pitch-deck-agent, lean-canvas-agent, ai-chat) |
| **Real-World** | "After 50 pipeline runs, we can see validator-scoring-fragment loaded 47 times with 62% cited-evidence tier — proving the fragment improves output quality" |

## Description

**The situation:** Agency fragments are loaded at runtime via `agent-loader.ts` (task 001) and injected into edge function system prompts. The `ai_runs` table already tracks per-invocation cost, token counts, and model used — but it records nothing about which agency fragments were loaded or whether they improved the quality of AI outputs. The `getLoadedFragments()` diagnostic from task 001 returns the current cache state, but this data is ephemeral and lost when the Deno isolate recycles. There is no persistent record of fragment usage, no quality signal capture, and no way to compare output quality before and after fragments were introduced.

**Why it matters:** Without tracking, the agency system is a black box. The team cannot answer basic questions: Is the scoring fragment actually being loaded? Did evidence quality improve after we added market-intelligence knowledge? Are bias flags firing in practice? If a fragment degrades output (hallucination, worse scores), there is no signal to detect it. Measuring ROI of the agency knowledge investment requires persistent quality data. Without it, fragments accumulate without pruning — some may be dead weight consuming tokens with no benefit.

**What already exists:**
- `ai_runs` table — columns: `id`, `user_id`, `agent_name`, `model`, `cost_usd`, `input_tokens`, `output_tokens`, `thinking_tokens`, `created_at`, `org_id`
- `agent-loader.ts` — `getLoadedFragments()` returns `string[]` of currently cached fragment names
- `loadFragment(name)` — returns fragment content string (task 001)
- Scoring agent — already produces `scores_matrix` with per-dimension scores and evidence references
- Validator pipeline — already tracks per-agent timing in `validator_agent_runs`
- Analytics page (`/analytics`) — exists with task trends and pipeline stats, can host new widgets

**The build:**
1. **Migration:** Add 3 columns to `ai_runs`: `fragments_loaded text[]` (array of fragment names loaded for this invocation), `evidence_tier_counts jsonb` (distribution of evidence quality: `{cited: N, inferred: N, assumed: N}`), `bias_flags_count int` (number of bias warnings detected in output).
2. **Edge function logging:** In each EF that loads fragments, after calling `loadFragment()`, collect the names into an array. When INSERTing to `ai_runs`, include the `fragments_loaded` array. For the scoring agent specifically, parse the output to extract evidence tier distribution and bias flag count.
3. **Frontend widget:** Add a "Fragment Usage" card on the Analytics page showing: top fragments by usage count, evidence tier distribution chart (stacked bar), trend line of bias flags over time. Uses a simple `useFragmentStats` hook querying `ai_runs` with aggregation.

**Example:** The team ships the agency system and runs 50 validator pipelines over a week. On Friday, the lead checks the Analytics page. The Fragment Usage card shows: `validator-scoring-fragment` loaded 47/50 times (3 failures were fallback runs), `validator-composer-fragment` loaded 50/50 times. Evidence tier distribution: 62% cited (up from 40% pre-agency), 28% inferred, 10% assumed. Bias flags averaged 0.3 per run (down from 1.2 pre-agency). This data proves the scoring fragment is working and justifies investing in more fragments.

## Rationale

**Problem:** No visibility into which agency fragments are loaded per invocation, no quality signal capture, no way to measure fragment ROI or detect quality regressions.

**Solution:** Extend `ai_runs` with fragment metadata columns. Log fragment names on every EF invocation. Capture quality signals (evidence tiers, bias flags) from scoring agent output. Surface aggregate stats on the Analytics page.

**Impact:** Data-driven fragment management. Detect unused fragments (pruning candidates). Measure quality improvement over time. Alert on quality regressions. Justify investment in new fragments with hard numbers.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | see which fragments loaded per EF call | I can debug missing fragment issues |
| Product lead | view evidence tier trends over time | I can measure if agency knowledge improves output quality |
| Developer | track bias flag frequency | I can detect when fragments introduce or reduce bias |
| Operator | see fragment usage heatmap | I can identify dead fragments and prune them |

## Goals

1. **Primary:** Every `ai_runs` INSERT includes the list of fragments loaded for that invocation
2. **Quality:** Evidence tier distribution captured for every scoring agent run
3. **Visibility:** Analytics page widget shows aggregate fragment usage and quality trends
4. **Non-regression:** Logging adds < 1ms overhead to EF invocations

## Acceptance Criteria

- [ ] `ai_runs` table has `fragments_loaded text[]` column (nullable, default NULL)
- [ ] `ai_runs` table has `evidence_tier_counts jsonb` column (nullable, default NULL)
- [ ] `ai_runs` table has `bias_flags_count int` column (nullable, default NULL)
- [ ] Migration is backward-compatible (all new columns nullable, no NOT NULL constraints)
- [ ] Each target EF INSERT to `ai_runs` includes loaded fragment names array
- [ ] Scoring agent EF populates `evidence_tier_counts` from output parsing
- [ ] Scoring agent EF populates `bias_flags_count` from output parsing
- [ ] Analytics page shows "Fragment Usage" summary card with top fragments by count
- [ ] Analytics page shows evidence tier distribution (stacked bar or pie)
- [ ] Existing `ai_runs` queries still work (no breaking schema changes)
- [ ] No performance regression from additional logging (< 1ms overhead)
- [ ] RLS on `ai_runs` continues to enforce org-level isolation for new columns

| Layer | File | Action |
|-------|------|--------|
| **Backend** | `supabase/migrations/YYYYMMDD_agency_quality_tracking.sql` | Create — ALTER TABLE ai_runs ADD 3 columns |
| **Backend** | `supabase/functions/validator-start/pipeline.ts` | Modify — collect loaded fragment names, pass to ai_runs INSERT |
| **Backend** | `supabase/functions/validator-start/agents/scoring.ts` | Modify — parse evidence tiers + bias flags from output |
| **Backend** | `supabase/functions/crm-agent/index.ts` | Modify — log fragments_loaded in ai_runs INSERT |
| **Backend** | `supabase/functions/sprint-agent/index.ts` | Modify — log fragments_loaded in ai_runs INSERT |
| **Backend** | `supabase/functions/pitch-deck-agent/index.ts` | Modify — log fragments_loaded in ai_runs INSERT |
| **Backend** | `supabase/functions/lean-canvas-agent/index.ts` | Modify — log fragments_loaded in ai_runs INSERT |
| **Backend** | `supabase/functions/ai-chat/index.ts` | Modify — log fragments_loaded in ai_runs INSERT |
| **Frontend** | `src/hooks/useFragmentStats.ts` | Create — query ai_runs for aggregate fragment stats |
| **Frontend** | `src/components/analytics/FragmentUsageCard.tsx` | Create — usage heatmap + evidence tier chart |
| **Frontend** | `src/pages/Analytics.tsx` | Modify — add FragmentUsageCard to layout |
| **Verification** | Manual | Run 3 pipeline runs, verify ai_runs rows have fragments_loaded populated |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No fragments loaded (fallback run) | `fragments_loaded` is empty array `{}`, not NULL |
| Fragment loading fails (graceful fallback) | Fragment name still logged with suffix `-failed` (e.g., `validator-scoring-fragment-failed`) |
| Scoring agent times out before evidence parsing | `evidence_tier_counts` and `bias_flags_count` remain NULL for that row |
| Very old ai_runs rows (pre-migration) | New columns are NULL — frontend handles NULL gracefully (shows "N/A" or skips) |
| Multiple fragments loaded for single agent | Array contains all names: `{validator-scoring-fragment, market-intelligence-fragment}` |
| Evidence tier parsing finds unexpected format | Log warning, set `evidence_tier_counts` to `{"parse_error": true}`, don't crash |

## Real-World Examples

**Scenario 1 — Fragment ROI measurement:** After deploying the agency system, Maya (product lead) wants to justify the engineering investment to stakeholders. She opens Analytics and sees: over 200 pipeline runs, `validator-scoring-fragment` was loaded in 195 (97.5%). Evidence tier distribution shifted from 40% cited / 35% inferred / 25% assumed (pre-agency baseline) to 62% cited / 27% inferred / 11% assumed. **With quality tracking,** she can present a concrete 22-point improvement in evidence quality directly attributable to the scoring fragment.

**Scenario 2 — Dead fragment detection:** Three months after launch, the team has 12 fragments. Raj (developer) checks the heatmap and notices `market-intelligence-fragment` was loaded only 4 times in the last 30 days — it targets the research agent, but a code change 6 weeks ago accidentally removed the `loadFragment` call. **With usage tracking,** the dead fragment is caught in minutes instead of going unnoticed for months.

**Scenario 3 — Quality regression alert:** A new fragment for the composer agent is deployed. Over the next week, bias flag count spikes from 0.3/run average to 2.1/run. The fragment's competitive analysis section contains language that triggers the bias detector more often. **With bias flag tracking,** the team catches the regression within days and patches the fragment wording.

## Outcomes

| Before | After |
|--------|-------|
| No record of which fragments load per invocation | `fragments_loaded` array on every `ai_runs` row |
| No quality signal capture | Evidence tier distribution + bias flags logged per scoring run |
| Cannot measure fragment ROI | Trend data shows quality improvement over time |
| Dead fragments go undetected | Usage heatmap reveals unused or rarely-loaded fragments |
| Quality regressions invisible | Bias flag trends surface regressions within days |
| Fragment decisions based on intuition | Data-driven pruning, expansion, and optimization |
