---
task_id: 007-IMW
title: Investor MEDDPICC Wiring
phase: MVP
priority: P1
status: Not Started
estimated_effort: 1 day
skill: [deal-strategist, gemeni]
subagents: [code-reviewer, supabase-expert]
edge_function: investor-agent
schema_tables: [investors]
depends_on: [001-ALR, 006-IMS]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Investor Pipeline (cards, detail sheet) |
| **Features** | MEDDPICC scoring, deal verdict pills, signal timing, cold email builder |
| **Edge Functions** | `investor-agent` |
| **Real-World** | "Each investor card now shows a MEDDPICC score /40 and a Strong Buy / Buy / Hold / Pass pill" |

## Description

**The situation:** The investor-agent (`supabase/functions/investor-agent/index.ts`) has 12 actions (discover, analyze_fit, score_deal, etc.) but doesn't use MEDDPICC framework for structured deal scoring. Investor cards show basic info (name, check size, status) with no objective scoring. The schema now supports MEDDPICC data (task 006).

**Why it matters:** MEDDPICC is the standard framework for B2B deal qualification. Without it, founders rank investors by gut feel. Structured scoring surfaces which investors are most likely to close, and the cold email builder uses scoring data to personalize outreach.

**What already exists:**
- `supabase/functions/investor-agent/index.ts` — 12-action agent with prompt.ts system prompts
- `supabase/functions/investor-agent/prompt.ts` — Per-action system prompts (SCORE_DEAL_SYSTEM, etc.)
- `agency/prompts/crm-investor-fragment.md` — MEDDPICC scoring rules, signal-based timing, email anatomy
- `src/pages/Investors.tsx` — Investor pipeline page
- `src/hooks/useInvestorAgent.ts` — Hook for investor-agent calls

**The build:**
- Import `loadFragment('crm-investor-fragment')` in investor-agent
- Append MEDDPICC rules to `SCORE_DEAL_SYSTEM` prompt
- Scoring action returns: `meddpicc_score` (/40), `deal_verdict`, 8 dimension breakdowns, `signal_data`
- Write scores to investors table (uses task 006 columns)
- Frontend: MEDDPICC score badge on investor cards (/40 with color coding)
- Frontend: Deal verdict pill (Strong Buy green / Buy blue / Hold amber / Pass red)
- Frontend: Signal timing dot (green = act now / grey = monitor)
- Deploy `investor-agent`

**Example:** Marcus adds Sequoia to his pipeline and triggers AI scoring. The investor-agent evaluates 8 MEDDPICC dimensions: Metrics (4/5 — strong traction metrics), Economic Buyer (3/5 — partner identified), Champion (2/5 — no internal champion yet). Total: 28/40 = "Buy" verdict. Signal dot is green (recent fund close = timing opportunity). Card shows: "Sequoia | 28/40 | Buy | 🟢".

## Rationale
**Problem:** Investor prioritization is subjective — no framework for deal readiness.
**Solution:** MEDDPICC scoring via AI, persisted to DB, shown as badges.
**Impact:** Founders focus outreach on highest-probability investors.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | MEDDPICC score per investor | I know which deals are furthest along |
| Founder | deal verdict pills | I can quickly scan my pipeline quality |
| Founder | signal-based timing | I reach out when investors are most receptive |

## Goals
1. **Primary:** Each investor can be AI-scored with MEDDPICC
2. **Secondary:** Scores visible as badges on investor cards

## Acceptance Criteria
- [ ] `loadFragment('crm-investor-fragment')` loaded in investor-agent
- [ ] `score_deal` action returns meddpicc_score, deal_verdict, dimension_scores, signal_data
- [ ] Scores persisted to investors table columns
- [ ] MEDDPICC badge on investor cards (color-coded: 32+ green, 24+ blue, 16+ amber, <16 red)
- [ ] Deal verdict pill on investor cards
- [ ] Signal timing indicator (green dot / grey dot)
- [ ] Existing investors without scores show no badges (backward compat)
- [ ] `investor-agent` deployed

| Layer | File | Action |
|-------|------|--------|
| Edge Function | `supabase/functions/investor-agent/index.ts` | Modify — import loadFragment |
| Prompts | `supabase/functions/investor-agent/prompt.ts` | Modify — append fragment to SCORE_DEAL |
| Page | `src/pages/Investors.tsx` | Modify — add badges, pills, dots |
| Hook | `src/hooks/useInvestorAgent.ts` | Modify — add score types |

## Real-World Examples

**Scenario 1 — Strong deal:** Aisha scores a16z for her AI startup. MEDDPICC: Metrics 5, Economic Buyer 4, Decision Criteria 4, Decision Process 3, Paper Process 3, Identify Pain 5, Champion 4, Competition 3 = 31/40 "Buy". Signal: a16z just closed Fund VII (timing opportunity). **With MEDDPICC,** Aisha prioritizes a16z outreach this week.

**Scenario 2 — Weak deal:** Same founder scores a regional VC with no AI portfolio. MEDDPICC: 12/40 "Pass". **With the verdict pill,** the red "Pass" pill tells Aisha to spend zero time here and focus on better-fit investors.

## Outcomes

| Before | After |
|--------|-------|
| Investor cards show name and check size only | MEDDPICC /40 badge + verdict pill on every scored card |
| Gut-feel investor ranking | Objective 8-dimension scoring |
| No signal-based timing | Green/grey dot shows when to act |
| Generic outreach | Scoring data feeds cold email builder (future task) |
