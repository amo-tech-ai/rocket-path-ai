# Plan: POST-01 — Strategic Summary Report Tab

## Context

The V3 report has 9 scored dimensions — founders see *how they scored* in each area. But knowing "Competitive Edge: 68/100" doesn't tell them *what to do strategically*. There's no synthesis view.

**Spec decision:** The original "4 separate tabs" (USP, VRIO, MVP Path, Investor) was consolidated into **1 "Strategy" tab with 3 sections** — per `tasks/prompts/post-mvp/12-unlock-report-tabs.md`. Reasoning: 4 tabs creates analysis fatigue and risks feeling like reformatted data.

**Approach:** Pure client-side derivation from existing report data (no new API calls). Follow the `useReportLeanCanvas` pattern: a `useMemo` hook that reads `ReportDetailsV2`/`V3ReportDetails`, extracts data from V3 dimensions first with V2 fallback, and returns typed section data.

## Files

| File | Action | Lines |
|------|--------|-------|
| `src/hooks/useStrategicSummary.ts` | **Create** | ~200 |
| `src/components/validator/report/StrategicSummary.tsx` | **Create** | ~250 |
| `src/components/validator/report/ReportV2Layout.tsx` | **Modify** (4 edits) | +20 |

## Changes

### 1. Create `src/hooks/useStrategicSummary.ts`

Derivation hook following `useReportLeanCanvas` pattern (L393-443 of that file).

**Types returned:**

```typescript
interface PositioningData {
  sentence: string;           // Synthesized positioning statement
  differentiators: string[];  // 3 bullets from competition + problem dims
  moatGap: string | null;     // Biggest weakness from competition dim
}

interface BuildItem {
  rank: number;
  action: string;
  source: DimensionId;
  timeframe: string;
  impact: string;
}

interface BuildFocusData {
  topActions: BuildItem[];    // Top 5 actions sorted by impact across all dims
  ninetyDayPreview: string;  // Synthesized from execution timeline
}

interface FundabilitySignal {
  label: string;
  dimension: DimensionId;
  score: number;
}

interface FundabilityData {
  strengths: FundabilitySignal[];   // Top 3 dims by score
  weaknesses: FundabilitySignal[];  // Bottom 3 dims by score
  improvementActions: string[];     // Actions from weakest dims
}

interface StrategicSummaryResult {
  hasData: boolean;
  hasV3Dimensions: boolean;
  positioning: PositioningData;
  buildFocus: BuildFocusData;
  fundability: FundabilityData;
}
```

**Derivation logic (all in `useMemo`):**

**A. Positioning Snapshot** — sources: `competition` + `problem` dimensions
- `sentence`: V3 → `competition.headline` + `problem.headline` combined. V2 → `competition.positioning?.description` + `problem_clarity.pain`
- `differentiators`: V3 → competition subScores with highest scores → derive 3 bullets. V2 → `competition.market_gaps` (take first 3)
- `moatGap`: V3 → lowest-scoring competition subScore label + description. V2 → first red_flag mentioning competition, or null

**B. Build Focus** — sources: all 9 dimensions' `actions` arrays
- Collect all `PriorityAction` items from V3 dimensions, tag each with source dimension
- Sort by: impact descending ("Critical" > "High" > "Medium"), then rank ascending
- Take top 5
- V2 fallback: `next_steps` array (first 5 items)
- `ninetyDayPreview`: V3 → execution dimension timeline phases (first 3 months). V2 → `mvp_scope.timeline_weeks` + first 2 next_steps

**C. Fundability Signals** — sources: all 9 dimensions' `compositeScore`
- Rank all dimensions by compositeScore
- `strengths`: Top 3 (highest scores) — label + dimension + score
- `weaknesses`: Bottom 3 (lowest scores) — label + dimension + score
- `improvementActions`: Take first action from each of the 3 weakest dimensions
- V2 fallback: `highlights` (strengths) and `red_flags` (weaknesses) arrays from report details; `next_steps` for improvement actions
- **No stage labels**, no "Pre-seed ready" — only signal-based language

**V3 detection pattern** (from `useReportLeanCanvas` L411):
```typescript
const dims = (details as V3ReportDetails).dimensions;
const hasV3 = !!(dims && typeof dims === 'object' && Object.keys(dims).length > 0);
```

### 2. Create `src/components/validator/report/StrategicSummary.tsx`

Single presentational component with 3 card sections. Uses existing shared components where possible.

**Props:**
```typescript
interface StrategicSummaryProps {
  details: ReportDetailsV2;
}
```

**Structure:**
```
<div className="space-y-8">
  {/* Section A: Positioning Snapshot */}
  <SectionShell title="Positioning Snapshot">
    <p>{positioning.sentence}</p>         // Positioning statement
    <ul>{positioning.differentiators}</ul> // 3 differentiation bullets
    {positioning.moatGap && <Alert>}       // Moat gap warning (amber)
  </SectionShell>

  {/* Section B: Build Focus */}
  <SectionShell title="Build Focus">
    <ol>{buildFocus.topActions}</ol>       // Numbered list, 5 items with dim badge + timeframe
    <div>{buildFocus.ninetyDayPreview}</div> // Timeline preview
  </SectionShell>

  {/* Section C: Fundability Signals */}
  <SectionShell title="Fundability Signals">
    <div className="grid grid-cols-2">
      <div>Strengths (green)</div>         // 3 items with score + dim label
      <div>Weaknesses (amber)</div>        // 3 items with score + dim label
    </div>
    <div>Improve before fundraising</div>  // Action items
  </SectionShell>
</div>
```

**Reuses:** `SectionShell` (existing), `Badge` (shadcn), `DIMENSION_CONFIG` (for labels/colors). No new shared components needed.

**Empty state:** If `!hasData`, show a notice: "Complete more dimension sections to unlock strategic insights."

### 3. Modify `ReportV2Layout.tsx` (4 surgical edits)

**Edit 1 — Import** (after L37):
```typescript
import { StrategicSummary } from './StrategicSummary';
```

**Edit 2 — Add tab to REPORT_TABS** (L148, before lean-canvas):
```typescript
{ value: 'strategy', label: 'Strategy' },
```

**Edit 3 — Add TabsContent** (after lean-canvas TabsContent, ~L793):
```tsx
<TabsContent value="strategy" className="mt-6">
  <PageCard>
    <StrategicSummary details={d} />
    <TabStepper currentTab="strategy" onNavigate={handleTabChange} />
  </PageCard>
</TabsContent>
```

**Edit 4 — No other changes needed.** `VALID_TABS` auto-derives from `REPORT_TABS.map(t => t.value)` (L156-158), so adding to `REPORT_TABS` automatically makes `strategy` a valid tab. `TabStepper` uses `REPORT_TABS.findIndex` so it gets prev/next for free.

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No V3 dimensions (V2 only report) | V2 fallback: highlights/red_flags/next_steps |
| Partial V3 (e.g., 4 of 9 dims) | Shows what's available, marks gaps |
| All scores low | Fundability honestly shows weaknesses |
| No competition data | Positioning shows "Insufficient data" for moat gap |
| Direct URL navigation to `/strategy` | Works — VALID_TABS includes it |

## Verification

1. `npm run build` — 0 TS errors
2. `npm run test` — 371+ pass (pre-existing ReportV2Layout test failure is known)
3. Dev server: navigate to any existing report → click "Strategy" tab → verify 3 sections render
4. Verify tab stepper shows correct prev/next (Lean Canvas ↔ Strategy)
5. Verify no predictive labels ("Pre-seed ready") appear anywhere
6. Check V2-only report still renders (fallback path)
