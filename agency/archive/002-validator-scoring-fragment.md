---
task_id: 002-VSF
title: Validator Scoring Enhancement
phase: CORE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: [startup, gemeni]
subagents: [code-reviewer, supabase-expert]
edge_function: validator-start
schema_tables: [validation_reports, validator_agent_runs]
depends_on: [001-ALR]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Report (dimension scores) |
| **Features** | Evidence tier scoring, bias detection, signal strength assessment |
| **Edge Functions** | `validator-start` (scoring agent) |
| **Real-World** | "Each scored dimension now shows whether evidence is Cited, Founder-stated, or AI-inferred" |

## Description

**The situation:** The validator scoring agent (`validator-start/agents/scoring.ts`) scores startups across 7 dimensions (0-100 each) using a system prompt and Gemini's thinking mode. The output is a `scores_matrix` with dimension scores and an `overall_weighted` score. However, it doesn't distinguish the quality of evidence behind each score — a dimension scored from a cited market report gets the same weight as one inferred by the AI.

**Why it matters:** Investors and founders need to know which parts of their validation are backed by real data vs. AI speculation. Evidence tier labeling (Cited > Founder > AI-inferred) creates trust and highlights where more research is needed. Bias detection flags where the AI might be optimistic about founder claims.

**What already exists:**
- `supabase/functions/validator-start/agents/scoring.ts` — Scoring agent with system prompt at L23-34, uses `callGemini` with `responseJsonSchema` and `thinkingLevel: 'high'`
- `supabase/functions/validator-start/types.ts` — `ScoringResult` interface with `scores_matrix`, `dimension_scores`
- `supabase/functions/validator-start/schemas.ts` — Gemini JSON schemas for scoring output
- `agency/prompts/validator-scoring-fragment.md` — Markdown fragment with evidence tier rules, bias detection, and signal strength assessment
- `agency/lib/agent-loader.ts` — `loadFragment()` utility (wired in task 001)

**The build:**
- Import `loadFragment` in scoring.ts
- Load `validator-scoring-fragment` and append to system prompt
- Add 3 optional fields to scoring schema: `evidence_tier` (per dimension), `bias_flags[]`, `signal_strength`
- Add matching fields to `ScoringResult` TypeScript interface
- All new fields optional — existing reports render unchanged
- Deploy `validator-start`

**Example:** Sarah runs validation for her B2B SaaS idea. The scoring agent evaluates the "Market" dimension. It finds a TAM figure cited from a Gartner report (evidence_tier: "cited", weight: 1.0). It also evaluates "Problem" severity — the founder claimed "everyone has this problem" with no data (evidence_tier: "founder", weight: 0.8, bias_flag: "optimism_bias"). The report shows these tiers as badges, helping Sarah see where she needs more evidence.

## Rationale
**Problem:** All evidence is treated equally regardless of source quality.
**Solution:** Fragment injects evidence tier rules into scoring prompt. Output includes tier labels per dimension.
**Impact:** Users see which scores are backed by real data vs. AI inference.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see evidence quality per dimension | I know where to strengthen my research |
| Investor | see bias flags on validation reports | I can discount optimistic claims |
| Developer | optional new fields | existing reports don't break |

## Goals
1. **Primary:** Each scored dimension includes an evidence tier label
2. **Quality:** Existing pipeline timing unaffected (< 2s added from fragment load)

## Acceptance Criteria
- [ ] `loadFragment('validator-scoring-fragment')` called in scoring.ts
- [ ] Fragment appended to scoring system prompt
- [ ] Scoring output includes optional `evidence_tiers: Record<string, 'cited' | 'founder' | 'ai_inferred'>`
- [ ] Scoring output includes optional `bias_flags: Array<{ dimension: string, bias_type: string, explanation: string }>`
- [ ] Scoring output includes optional `signal_strength: 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5'`
- [ ] TypeScript types updated in `types.ts`
- [ ] Gemini JSON schema updated in `schemas.ts`
- [ ] Old reports without these fields render without errors
- [ ] `validator-start` deployed successfully

| Layer | File | Action |
|-------|------|--------|
| Agent | `supabase/functions/validator-start/agents/scoring.ts` | Modify — import loadFragment, append to prompt |
| Types | `supabase/functions/validator-start/types.ts` | Modify — add optional fields to ScoringResult |
| Schema | `supabase/functions/validator-start/schemas.ts` | Modify — add optional fields to scoring schema |
| Utility | `agency/lib/agent-loader.ts` | Read (already built in 001) |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Fragment file missing | Empty string appended — scoring runs with base prompt only |
| Gemini ignores new fields | Fields are optional — report renders without them |
| Very long fragment (>2K tokens) | Scoring uses thinking mode — ample context budget |
| Pre-existing report without tiers | UI checks field existence before rendering badges |

## Real-World Examples

**Scenario 1 — Strong evidence:** Jake validates his fintech startup. The market dimension cites a McKinsey report ($4.2T digital payments market). **With evidence tiers,** the report shows "Market: 89/100 (Cited)" with a green badge. The problem dimension relies on founder anecdotes. **With bias detection,** it shows "Problem: 72/100 (Founder)" with an amber "Confirmation bias" flag. Jake knows to gather independent evidence for the problem.

**Scenario 2 — All AI-inferred:** Priya enters a one-line idea with no links. Every dimension is scored from AI inference only. **With evidence tiers,** all dimensions show "(AI-inferred)" grey badges and signal_strength is "level_1". The report suggests: "Add market research links to improve evidence quality."

## Outcomes

| Before | After |
|--------|-------|
| All dimensions scored equally | Each dimension labeled Cited / Founder / AI-inferred |
| No indication of AI confidence | Signal strength level (1-5) shows overall evidence quality |
| Optimistic claims go unchallenged | Bias flags highlight where founder claims lack evidence |
| No way to know what to research next | Low-tier dimensions tell founders exactly where to dig deeper |
