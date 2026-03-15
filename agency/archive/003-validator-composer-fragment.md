---
task_id: 003-VCF
title: Validator Composer Enhancement
phase: CORE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: [startup, gemeni]
subagents: [code-reviewer, supabase-expert]
edge_function: validator-start
schema_tables: [validation_reports]
depends_on: [001-ALR]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Report (executive summary, growth channels, SWOT) |
| **Features** | Three-act narrative, win themes, ICE-scored growth channels |
| **Edge Functions** | `validator-start` (composer agent — Groups A, B, C, D) |
| **Real-World** | "Executive summary now follows Setup-Conflict-Resolution structure instead of a flat paragraph" |

## Description

**The situation:** The validator composer agent (`validator-start/agents/composer.ts`) synthesizes a 14-section report from upstream agent outputs across 4 parallel groups (A: problem+customer, B: market+competition+risks, C: revenue+channels+technology, D: executive summary). Each group has its own system prompt and Gemini call. The output is a flat JSON with prose sections. There's no narrative structure — the exec summary reads like a Wikipedia entry.

**Why it matters:** VCs scan reports in 30 seconds. A flat summary with no narrative arc loses them. The Three-Act structure (Setup: the opportunity | Conflict: what could go wrong | Resolution: why this team wins anyway) creates a compelling read. Win themes give founders language for investor conversations. ICE-scored channels replace a flat list with prioritized growth recommendations.

**What already exists:**
- `supabase/functions/validator-start/agents/composer.ts` — 4 composer groups with separate Gemini calls
- `supabase/functions/validator-start/schemas.ts` — Group A/B/C/D JSON schemas
- `agency/prompts/validator-composer-fragment.md` — Markdown fragment with Three-Act rules, win themes, ICE channel scoring
- `agency/lib/agent-loader.ts` — `loadFragment()` utility (wired in task 001)

**The build:**
- Import `loadFragment` in composer.ts
- Load `validator-composer-fragment` and append to Group A (narrative), Group C (ICE channels), and Group D (exec summary) system prompts
- Add optional fields to Group D schema: `narrative_arc: { setup, conflict, resolution }`, `win_themes: string[]`
- Add optional fields to Group C schema: `ice_channels: Array<{ channel, impact, confidence, ease, score }>`
- Update TypeScript types in types.ts
- All new fields optional — no migration needed (stored in JSONB `details` column)
- Deploy `validator-start`

**Example:** After validation, Sarah's report executive summary reads: "**Setup:** The $32B content production market is shifting to AI-first workflows... **Conflict:** Three well-funded competitors already serve enterprise — but none solve the mid-market gap... **Resolution:** Sarah's team of ex-Adobe engineers + unique vision model gives them a 12-month head start." The Growth Channels section shows: "Product-Led Growth (ICE 8.3) > Content Marketing (ICE 6.7) > Partnerships (ICE 5.1)."

## Rationale
**Problem:** Flat executive summaries and unranked channel lists dilute report impact.
**Solution:** Fragment injects narrative structure into composer. Output gains dramatic arc and scored channels.
**Impact:** Reports read like VC memos instead of Wikipedia articles.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | a compelling exec summary | investors read past the first paragraph |
| Founder | ranked growth channels | I know which channels to test first |
| Investor | win theme labels | I can quickly assess the startup's core advantages |

## Goals
1. **Primary:** Exec summary follows Three-Act structure
2. **Secondary:** Growth channels scored by ICE (Impact × Confidence × Ease)

## Acceptance Criteria
- [ ] `loadFragment('validator-composer-fragment')` called in composer.ts
- [ ] Fragment appended to Group A, Group C, and Group D system prompts
- [ ] Group D output includes optional `narrative_arc: { setup: string, conflict: string, resolution: string }`
- [ ] Group D output includes optional `win_themes: string[]` (1-3 themes)
- [ ] Group C output includes optional `ice_channels: Array<{ channel: string, impact: number, confidence: number, ease: number, ice_score: number }>`
- [ ] TypeScript types updated in `types.ts`
- [ ] Gemini JSON schemas updated in `schemas.ts`
- [ ] Old reports without these fields render without errors
- [ ] `validator-start` deployed successfully

| Layer | File | Action |
|-------|------|--------|
| Agent | `supabase/functions/validator-start/agents/composer.ts` | Modify — import loadFragment, append to 3 groups |
| Types | `supabase/functions/validator-start/types.ts` | Modify — add optional narrative_arc, win_themes, ice_channels |
| Schema | `supabase/functions/validator-start/schemas.ts` | Modify — add optional fields to Group C/D schemas |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Fragment file missing | Composer runs with base prompts — reports unchanged |
| Gemini returns flat summary (no arc) | narrative_arc absent — frontend shows summary as-is |
| Gemini scores all channels equally | ICE scores tie — frontend shows in original order |
| Report with 0 growth channels | ice_channels empty array — section shows "No channels identified" |

## Real-World Examples

**Scenario 1 — Strong narrative:** Marcus validates his AI hiring platform. The composer generates: Setup (HR tech market growing 23% YoY), Conflict (3 incumbents + talent shortage), Resolution (Marcus's proprietary bias-detection model + 2 enterprise pilots). Win themes: ["Bias-free hiring at scale", "Enterprise-ready from day one"]. **With the narrative,** his pitch deck practically writes itself.

**Scenario 2 — Weak narrative data:** A founder enters a one-line idea with no traction. The composer can't build a strong resolution. **With graceful degradation,** it generates: Setup (market exists), Conflict (no differentiation yet), Resolution (potential if founder validates assumptions). Win themes: empty array. The report honestly reflects the early stage.

## Outcomes

| Before | After |
|--------|-------|
| Flat executive summary paragraph | Three-Act structure: Setup → Conflict → Resolution |
| No win themes for pitch preparation | 1-3 win themes extracted from validation data |
| Flat growth channel list | ICE-scored channels with Impact × Confidence × Ease |
| Channels in random order | Channels ranked by composite ICE score |
