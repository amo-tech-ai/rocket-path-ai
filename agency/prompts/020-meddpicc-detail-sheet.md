---
task_id: 020-MDD
title: MEDDPICC Investor Detail Sheet
phase: ADVANCED
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [deal-strategist, design]
subagents: [frontend-designer, code-reviewer]
edge_function: investor-agent
schema_tables: [investors]
depends_on: [006-IMS, 007-IMW]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Investor Pipeline — InvestorDetailSheet (new MEDDPICC tab) |
| **Features** | 8-dimension score grid, per-dimension evidence and gap flags, suggested actions, score history |
| **Edge Functions** | `investor-agent` (consumes existing `score_deal` action data) |
| **Real-World** | "Clicking an investor opens a detail sheet. The MEDDPICC tab shows 8 scored dimensions with evidence, gap flags, and suggested actions for the weakest areas." |

## Description

**The situation:** Tasks 006 and 007 added `meddpicc_score` (int, 0-40), `deal_verdict` (text), and `signal_data` (jsonb) to the `investors` table, and wired the `investor-agent` edge function to compute 8-dimension MEDDPICC scores via the `score_deal` action. The investor pipeline page shows a total score badge ("/40") and a verdict pill (Strong Buy / Buy / Hold / Pass) on each investor card. But there is no way to drill into the 8 individual dimensions. The `InvestorDetailSheet` component has two tabs — "Details" (static investor info) and "AI Intelligence" (fit analysis, meeting prep, outreach generation) — but no MEDDPICC dimension breakdown.

**Why it matters:** A total score of 28/40 tells a founder their deal is in the "Buy" range, but it does not explain which dimensions are strong and which are blocking progress. Without dimension-level visibility, founders cannot take targeted action. A Champion score of 1/5 requires a completely different action than a Decision Process score of 1/5 — but both contribute equally to a low total. The MEDDPICC detail view transforms a single number into a diagnostic tool. Founders see exactly where their deal is strong (reinforce those dimensions in meetings), where it is weak (take specific remediation actions), and whether their score is improving over time.

**What already exists:**
- `src/components/investors/InvestorDetailSheet.tsx` — Sheet component with tabs ("Details", "AI Intelligence"), props include `investor: Investor`, `open`, `onOpenChange`, `onEdit`, `startupId`
- `src/hooks/useInvestorAgent.ts` — Hook with `useAnalyzeInvestorFit`, `usePrepareMeeting`, `useGenerateOutreach` mutations. The `score_deal` action returns `meddpicc_score`, `deal_verdict`, and dimension breakdowns in `signal_data`
- `investors.signal_data` jsonb column — stores the per-dimension breakdown from the `score_deal` action. Structure: `{ dimensions: { metrics: { score: 4, evidence: "...", gap: null }, economic_buyer: { score: 2, evidence: "...", gap: "No identified buyer" }, ... } }`
- `investors.meddpicc_score` int column — total score (0-40), CHECK constraint
- `investors.deal_verdict` text column — "strong_buy" | "buy" | "hold" | "pass", CHECK constraint
- `agency/prompts/crm-investor-fragment.md` — MEDDPICC scoring rules: each dimension 0-5, thresholds for verdict levels, signal-based timing
- `.agents/skills/deal-strategist/SKILL.md` — Full MEDDPICC framework definitions, dimension descriptions, scoring rubrics

**The build:**

1. **Add "MEDDPICC" tab to `InvestorDetailSheet.tsx`** — Third tab alongside "Details" and "AI Intelligence". Only visible when the investor has been scored (meddpicc_score is not null). When unscored, show a CTA button to trigger scoring.

2. **Create `MEDDPICCGrid.tsx`** — 8-dimension detail grid component:
   - Header: total score "/40" (large text) + deal verdict badge (color-coded) + signal timing dot
   - 8 dimension rows, each containing:
     - Dimension name (Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition)
     - Score as 5-dot indicators (filled = scored, empty = remaining) or a horizontal progress bar (0-5 scale)
     - Color coding: green (4-5), amber (3), red (0-2)
     - Evidence text: one-line explanation from `signal_data.dimensions[key].evidence`
     - Gap flag: warning icon + gap text if score < 3, from `signal_data.dimensions[key].gap`
   - Collapsible per-row: click to expand for longer evidence text or AI-suggested remediation

3. **Create `MEDDPICCSuggestions.tsx`** — Suggested actions for weakest dimensions:
   - Filters dimensions with score < 3
   - Shows 2-3 concrete actions derived from the `deal-strategist` skill's remediation playbook
   - Each action has: dimension it addresses, action text, effort indicator (quick/medium/intensive)
   - "Re-score" button to trigger `score_deal` action again after founder has taken actions

4. **Score history (optional enhancement)** — If `signal_data` includes timestamped entries (e.g., `{ dimensions: {...}, scored_at: "2026-03-10T..." }`), show a mini sparkline or before/after comparison for dimensions that changed between scoring runs.

5. **Empty state and CTA** — When `meddpicc_score` is null, the MEDDPICC tab shows: "This investor hasn't been scored yet." with a "Score with MEDDPICC" button that calls the `score_deal` action via `useInvestorAgent`, then refreshes the sheet.

**Example:** Marcus is reviewing his investor pipeline. He clicks on Sequoia Capital and opens the detail sheet. He clicks the "MEDDPICC" tab. The header shows "31/40 — Buy" in a blue badge. The grid shows: Metrics 5/5 (green, "Strong ARR growth: $240K ARR, 15% MoM"), Economic Buyer 4/5 (green, "Partner Alex Kim confirmed interested"), Decision Criteria 4/5 (green, "Aligns with AI-first thesis"), Decision Process 3/5 (amber, "Multi-partner vote required, timeline unclear"), Paper Process 3/5 (amber, "Standard SAFE terms likely"), Identify Pain 5/5 (green, "Clear pain point in target market"), Champion 2/5 (red flag, "No internal advocate at Sequoia yet"), Competition 5/5 (green, "No competing term sheets"). Below the grid, Suggested Actions: "1. Ask your advisor Sarah for a warm intro to a Sequoia associate (addresses Champion, quick effort)" and "2. Request a call with Alex Kim to understand the partnership vote timeline (addresses Decision Process, medium effort)."

## Rationale
**Problem:** MEDDPICC total score (/40) is visible on investor cards, but founders cannot see which of the 8 dimensions are strong or weak. A single number does not guide specific action.
**Solution:** New MEDDPICC tab in InvestorDetailSheet with per-dimension scores, evidence, gap flags, and suggested remediation actions.
**Impact:** Founders go from "this investor scores 28" to "my Champion score is weak — I need a warm intro before the next meeting." Deal preparation becomes targeted instead of generic.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see 8 MEDDPICC dimensions with individual scores | I know exactly where my deal is strong and where it needs work |
| Founder | see evidence text per dimension | I understand why each dimension scored the way it did |
| Founder | see gap flags on weak dimensions | I immediately spot the blockers in red |
| Founder | see suggested actions for weak dimensions | I have concrete steps to improve my deal readiness |
| Founder | trigger re-scoring after taking action | I can measure improvement over time |
| Founder | see the MEDDPICC tab only when data exists | I'm not confused by an empty tab on unscored investors |

## Goals
1. **Primary:** Founders can view 8 MEDDPICC dimension scores with evidence and gap flags for any scored investor
2. **Secondary:** Suggested actions for the weakest 2-3 dimensions guide next steps
3. **Quality:** Tab is hidden or shows CTA when investor has no MEDDPICC data — no confusing empty states

## Acceptance Criteria
- [ ] InvestorDetailSheet has a "MEDDPICC" tab (third tab)
- [ ] Tab is visible only when `meddpicc_score` is not null; otherwise shows "Score with MEDDPICC" CTA
- [ ] `MEDDPICCGrid` renders 8 dimensions with scores (0-5) from `signal_data.dimensions`
- [ ] Scores color-coded by threshold: green (4-5), amber (3), red (0-2)
- [ ] Evidence text shown per dimension from `signal_data.dimensions[key].evidence`
- [ ] Gap flag (warning icon + text) shown on dimensions scoring below 3
- [ ] `MEDDPICCSuggestions` shows 2-3 suggested actions for weakest dimensions
- [ ] Each action shows: target dimension, action text, effort level (quick/medium/intensive)
- [ ] "Re-score" button calls `score_deal` action and refreshes the data
- [ ] Total score and deal verdict displayed in header (e.g., "31/40 — Buy")
- [ ] Empty state: when meddpicc_score is null, shows CTA to trigger scoring
- [ ] Score data is read from `investors.signal_data` jsonb — no new DB columns needed

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/investors/MEDDPICCGrid.tsx` | Create — 8-dimension score grid with evidence and gap flags |
| Component | `src/components/investors/MEDDPICCSuggestions.tsx` | Create — suggested actions for weak dimensions |
| Sheet | `src/components/investors/InvestorDetailSheet.tsx` | Modify — add "MEDDPICC" tab, conditional visibility, CTA for unscored investors |
| Hook | `src/hooks/useInvestorAgent.ts` | Modify — add `useScoreDeal` mutation if not already exposed |
| Types | `src/types/investor.ts` or inline | Create/Modify — `MEDDPICCDimension`, `MEDDPICCData` interfaces |

### Type Definitions

```typescript
interface MEDDPICCDimension {
  score: number;        // 0-5
  evidence: string;     // one-line explanation
  gap: string | null;   // gap description if score < 3, otherwise null
}

interface MEDDPICCData {
  dimensions: {
    metrics: MEDDPICCDimension;
    economic_buyer: MEDDPICCDimension;
    decision_criteria: MEDDPICCDimension;
    decision_process: MEDDPICCDimension;
    paper_process: MEDDPICCDimension;
    identify_pain: MEDDPICCDimension;
    champion: MEDDPICCDimension;
    competition: MEDDPICCDimension;
  };
  scored_at?: string;   // ISO timestamp for history tracking
}
```

### Dimension Display Config

```typescript
const MEDDPICC_DIMENSIONS = [
  { key: 'metrics',           label: 'Metrics',           icon: TrendingUp },
  { key: 'economic_buyer',    label: 'Economic Buyer',    icon: DollarSign },
  { key: 'decision_criteria', label: 'Decision Criteria', icon: CheckCircle2 },
  { key: 'decision_process',  label: 'Decision Process',  icon: GitBranch },
  { key: 'paper_process',     label: 'Paper Process',     icon: FileText },
  { key: 'identify_pain',     label: 'Identify Pain',     icon: AlertCircle },
  { key: 'champion',          label: 'Champion',          icon: Users },
  { key: 'competition',       label: 'Competition',       icon: Shield },
] as const;
```

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Investor has no MEDDPICC score (meddpicc_score is null) | MEDDPICC tab shows CTA: "Score this investor with MEDDPICC" button |
| signal_data exists but dimensions key is missing | Parse gracefully — show "Data unavailable" per dimension, log warning |
| signal_data has partial dimensions (e.g., only 5 of 8 scored) | Render scored dimensions normally, show unscored as grey with "Not evaluated" text |
| Score is exactly 0 for a dimension | Show as red (0/5) with gap text — do not treat 0 as "missing" |
| signal_data is a string instead of object | Parse with try/catch — if invalid JSON, show empty state |
| Investor is deleted while sheet is open | Sheet closes gracefully via onOpenChange callback |
| User clicks "Re-score" while scoring is in progress | Button shows loading spinner, disable re-click until mutation completes |
| Network error during scoring | Toast error with retry option, do not clear existing score data |
| Multiple rapid tab switches | Each tab renders independently — no shared state conflicts |
| Very long evidence text (> 200 chars) | Truncate with ellipsis, expand on click to see full text |

## Real-World Examples

**Scenario 1 — Identifying a Champion gap:** Aisha has been in discussions with Lightspeed Ventures for 3 weeks. Her investor card shows 24/40 "Hold." She opens the detail sheet and clicks the MEDDPICC tab. The dimension grid reveals: Metrics 4/5, Economic Buyer 3/5, Decision Criteria 4/5, Decision Process 2/5, Paper Process 2/5, Identify Pain 4/5, Champion 1/5 (red flag: "No internal advocate identified — all conversations are with one associate"), Competition 4/5. **With the dimension breakdown,** Aisha sees that her Champion score is dragging down the entire deal. The suggested action reads: "Identify a partner-level advocate at Lightspeed who has invested in your vertical. Ask your current associate contact for an introduction." She realizes the deal is stuck not because of product fit (high scores) but because of internal process gaps. She asks her advisor network for a warm introduction to a Lightspeed partner.

**Scenario 2 — Triggering first-time scoring:** Raj just added a new investor, First Round Capital, to his pipeline. He opens the detail sheet — the MEDDPICC tab shows "This investor hasn't been scored yet" with a blue "Score with MEDDPICC" button. He clicks it. The button shows a loading spinner for 3 seconds while the `investor-agent` `score_deal` action runs. The grid populates: 29/40 "Buy." **With the scoring CTA,** Raj gets structured deal intelligence on a new investor in seconds instead of manually evaluating 8 dimensions.

**Scenario 3 — Score improvement after action:** Priya scored her lead investor (YC) two weeks ago at 22/40 "Hold" with a Champion score of 1/5. She then got a warm intro to a YC partner through her network. She clicks "Re-score" in the MEDDPICC tab. The new score comes back: 30/40 "Buy" — Champion jumped from 1/5 to 4/5. **With the re-scoring flow,** Priya sees measurable progress from her networking effort and can confidently move YC higher in her outreach priority list.

## Outcomes

| Before | After |
|--------|-------|
| Total MEDDPICC score visible on card (/40) but no dimension breakdown | 8 individual dimension scores with evidence text and gap flags |
| Founder sees "28/40" and cannot identify what is weak | Red flags on dimensions below 3/5 with specific gap descriptions |
| No suggested actions for improving deal readiness | Top 2-3 remediation actions tied to weakest dimensions |
| Unscored investors have no CTA to trigger scoring | "Score with MEDDPICC" button in the detail sheet triggers AI evaluation |
| No way to measure improvement after taking action | "Re-score" button shows updated dimensions after founder addresses gaps |
| InvestorDetailSheet has 2 tabs | InvestorDetailSheet has 3 tabs — MEDDPICC tab surfaces deal diagnostics |
