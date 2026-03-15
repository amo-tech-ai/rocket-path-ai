---
task_id: 004-RUI
title: Report UI Agency Badges
phase: CORE
priority: P0
status: Not Started
estimated_effort: 0.5 day
skill: [design, startup]
subagents: [code-reviewer, frontend-designer]
edge_function: none (frontend only)
schema_tables: []
depends_on: [003-VCF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Report — dimension scores, executive summary, growth channels |
| **Features** | Evidence tier badges, bias flag banners, ICE score chips, narrative arc display |
| **Edge Functions** | None (frontend only — consumes data from tasks 002 + 003) |
| **Real-World** | "Each dimension score now shows a green 'Cited', blue 'Founder', or grey 'AI' badge" |

## Description

**The situation:** The validator report (`src/components/validator/report/`) renders 14 sections with scores, charts, and text. Tasks 002 and 003 add new optional fields to the report data: evidence tiers per dimension, bias flags, signal strength, narrative arc, win themes, and ICE-scored growth channels. The frontend doesn't yet display any of these.

**Why it matters:** The agency knowledge enhancements are invisible without UI representation. Evidence tiers, bias warnings, and scored channels are the visible differentiation — they're what makes a StartupAI report look like a $5,000 consulting deliverable instead of a ChatGPT summary.

**What already exists:**
- `src/components/validator/report/ReportV2Layout.tsx` — Main report layout with tab navigation
- `src/components/validator/report/DimensionSection.tsx` — Per-dimension detail pages
- `src/components/validator/report/StrategicSummary.tsx` — Strategy tab content
- `src/components/validator/report/ReportHeroLuxury.tsx` — Hero with score ring
- `src/components/validator/v3/SubScoreBar.tsx` — Animated score bars
- `src/components/validator/v3/DimensionPage.tsx` — V3 dimension detail layout
- `src/types/validation-report.ts` — Frontend type definitions

**The build:**
- Create `EvidenceTierBadge` component — green (Cited), blue (Founder), grey (AI-inferred) pill
- Create `BiasAlertBanner` component — amber banner with bias type + explanation
- Create `ICEChannelChip` component — channel name + ICE score + impact/confidence/ease breakdown
- Create `NarrativeArcSummary` component — three cards: Setup | Conflict | Resolution
- Create `WinThemeLabel` component — highlight label for strategic advantages
- Wire all into existing report components with `field?.exists` guards
- Update TypeScript types in `validation-report.ts`

**Example:** Sarah opens her validation report. The "Market" dimension shows "89/100" with a green "Cited" badge because the TAM came from Gartner. The "Problem" dimension shows "72/100" with a blue "Founder" badge and an amber banner: "Confirmation bias detected — claim not independently verified." The Growth Channels section shows ranked chips: "Product-Led Growth (ICE 8.3)" > "Content Marketing (ICE 6.7)".

## Rationale
**Problem:** Agency-enhanced data exists in the report JSON but isn't visible to users.
**Solution:** 5 new presentational components render the evidence quality, bias, and scoring data.
**Impact:** Reports look like professional consulting deliverables with transparent evidence quality.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see evidence quality badges | I know which scores are well-supported |
| Founder | see bias warnings | I can address weak areas proactively |
| Founder | see ranked growth channels | I prioritize the highest-impact channels |

## Goals
1. **Primary:** All agency-enhanced fields visible in the report UI
2. **Quality:** Components render only when data exists (no empty badges on old reports)

## Acceptance Criteria
- [ ] `EvidenceTierBadge` renders green/blue/grey pills per dimension
- [ ] `BiasAlertBanner` renders amber banner when `bias_flags.length > 0`
- [ ] `ICEChannelChip` renders sorted channel pills with ICE scores
- [ ] `NarrativeArcSummary` renders three-card layout (Setup | Conflict | Resolution)
- [ ] `WinThemeLabel` renders highlight labels in strategic summary
- [ ] All components check for field existence before rendering
- [ ] Old reports (without new fields) render unchanged
- [ ] New components use shadcn/ui Badge, Alert, Card primitives
- [ ] Responsive: stack cards on mobile, side-by-side on desktop

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/validator/report/EvidenceTierBadge.tsx` | Create |
| Component | `src/components/validator/report/BiasAlertBanner.tsx` | Create |
| Component | `src/components/validator/report/ICEChannelChip.tsx` | Create |
| Component | `src/components/validator/report/NarrativeArcSummary.tsx` | Create |
| Component | `src/components/validator/report/WinThemeLabel.tsx` | Create |
| Layout | `src/components/validator/report/ReportV2Layout.tsx` | Modify — wire new components |
| Layout | `src/components/validator/report/StrategicSummary.tsx` | Modify — add win themes |
| Layout | `src/components/validator/v3/DimensionPage.tsx` | Modify — add evidence tier badge |
| Types | `src/types/validation-report.ts` | Modify — add optional agency fields |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Report has no evidence_tiers | No badges rendered — dimension shows score only |
| Report has empty bias_flags | No banner rendered |
| Report has no narrative_arc | Exec summary shows flat text as before |
| Report has no ice_channels | Growth section shows flat list as before |
| Single win theme | One label rendered (not a list) |

## Real-World Examples

**Scenario 1 — Full agency data:** Jake's fintech report includes all new fields. The hero shows signal_strength "Level 4" badge. Each dimension card shows a colored evidence tier pill. Two bias flags render as amber banners below the executive summary. Growth channels show 5 ICE-scored chips. **With the UI badges,** the report clearly communicates evidence quality at a glance.

**Scenario 2 — Legacy report:** Priya opens a report generated before the agency enhancement. None of the new fields exist in the JSON. **With existence guards,** the report renders exactly as before — no empty badges, no layout shifts, no errors.

## Outcomes

| Before | After |
|--------|-------|
| Scores shown without evidence quality | Green/blue/grey badges per dimension |
| No indication of AI bias risk | Amber banners flag potential bias |
| Flat growth channel list | ICE-scored, ranked channel chips |
| Flat executive summary | Three-card narrative arc (Setup/Conflict/Resolution) |
| No strategic advantage labels | Win theme highlight labels |
