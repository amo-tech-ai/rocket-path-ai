---
task_id: 019-RRP
title: Remaining Chat Mode Right Panels
phase: ADVANCED
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [design, deal-strategist]
subagents: [frontend-designer, code-reviewer]
edge_function: ai-chat
schema_tables: []
depends_on: [010-CMB, 011-CMF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Chat (right panel in Deal Review and Canvas Coach modes) |
| **Features** | MEDDPICC breakdown panel, canvas feedback synthesis panel, shared AgencyInsightCard |
| **Edge Functions** | None (frontend only — derives from chat response metadata) |
| **Real-World** | "In Deal Review mode, the right panel shows 8 MEDDPICC dimensions with per-dimension scores. In Canvas Coach mode, it shows canvas completion % and strength/gap indicators." |

## Description

**The situation:** Tasks 010 and 011 built the 4-mode AI chat system with a mode selector (Practice Pitch, Growth Strategy, Deal Review, Canvas Coach). Tasks 013 and 014 added dedicated right panels for Practice Pitch (pitch scorecard with 4 dimensions) and Growth Strategy (AARRR funnel + ICE experiments). But Deal Review and Canvas Coach modes still show the default generic AI panel content — a static summary, quick actions, and generic insights that have no relationship to the active conversation mode.

**Why it matters:** Without mode-specific panels, Deal Review and Canvas Coach feel like generic chat windows wearing a different label. The right panel is the visual differentiation between "ask a chatbot" and "use a specialized tool." Practice Pitch and Growth Strategy already demonstrate this — founders see scoring breakdowns and funnel visualizations that update as they chat. Deal Review and Canvas Coach need the same treatment. Deal Review should surface the MEDDPICC framework that the `deal-strategist` skill already scores against, and Canvas Coach should show the feedback synthesis that the `feedback-synthesizer` skill computes. Without these panels, two of the four modes are visually indistinguishable from the default AI assistant.

**What already exists:**
- `src/components/ai/AIPanel.tsx` — Persistent 360px right column in DashboardLayout, already supports mode-conditional rendering (tasks 013/014 established the pattern)
- `src/components/ai/PitchScoreCard.tsx` — Practice Pitch panel (reference pattern for structure)
- `src/components/ai/AARRRFunnel.tsx` — Growth Strategy panel (reference pattern for structure)
- `agency/chat-modes/deal-review.md` — Deal strategist prompt with MEDDPICC 8-dimension framework
- `agency/chat-modes/canvas-coach.md` — Feedback synthesizer prompt with canvas quality analysis
- `src/hooks/useLeanCanvasAgent.ts` — Hook for canvas operations (has `validate_canvas` action)
- `src/hooks/useInvestorAgent.ts` — Hook for investor operations (has `score_deal` action with MEDDPICC)
- `investors.signal_data` jsonb column — stores per-dimension MEDDPICC breakdown (from task 006)

**The build:**

1. **`DealReviewPanel.tsx`** — MEDDPICC breakdown for the active investor discussion:
   - Total score display: "/40" with color-coded badge (32+ green, 24-31 blue, 16-23 amber, <16 red)
   - 8 dimension mini-cards: Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition — each showing score (0-5) as a filled progress bar, one-line evidence text, and a gap flag icon if score < 3
   - Deal verdict pill at the top (Strong Buy / Buy / Hold / Pass)
   - Suggested actions section: top 2-3 actions for the weakest dimensions
   - Empty state when no investor context is available in the chat

2. **`CanvasCoachPanel.tsx`** — Feedback synthesis for canvas coaching:
   - Canvas completion percentage ring (9 boxes, each counts as filled/empty)
   - Per-box strength indicator: green (strong), amber (needs work), red (missing) — for all 9 Lean Canvas boxes (Problem, Customer Segments, Unique Value Proposition, Solution, Channels, Revenue Streams, Cost Structure, Key Metrics, Unfair Advantage)
   - Feedback synthesis summary: grouped themes from the coaching conversation (what the AI has flagged as strengths, gaps, and contradictions)
   - "Gaps to address" list: boxes that scored low or are empty, with one-line suggestions
   - Empty state when no canvas data is loaded

3. **`AgencyInsightCard.tsx`** — Shared presentational component extracted for consistent styling across all 4 mode panels:
   - Props: `title`, `icon`, `value` (string or number), `color` (green/amber/red/blue/default), `subtitle?`, `children?`
   - Used by PitchScoreCard, AARRRFunnel, DealReviewPanel, CanvasCoachPanel for individual metric/dimension rows
   - Replaces ad-hoc Card usage in existing panels with a uniform look

4. **Wire into `AIPanel.tsx`** — Add mode-conditional rendering for deal-review and canvas-coach modes, matching the existing pattern for practice-pitch and growth-strategy.

**Example:** Aisha opens AI Chat and selects Deal Review mode. She types "Let's review the Sequoia deal." The AI responds with analysis. The right panel shows MEDDPICC breakdown: Metrics 4/5 (green bar, "Strong ARR growth data"), Economic Buyer 3/5 (amber bar, "Partner identified, not confirmed"), Champion 1/5 (red bar with flag icon, "No internal advocate identified"). Below the grid: Suggested Actions — "1. Ask advisor network for Sequoia introductions to identify a champion" and "2. Confirm the decision-making partner for your round size." Total: 26/40, verdict pill shows "Buy" in blue.

## Rationale
**Problem:** Deal Review and Canvas Coach modes use the default generic AI panel, making them indistinguishable from the standard AI assistant. Two of four specialized modes lack visual context.
**Solution:** Dedicated right panels for both modes — MEDDPICC breakdown for Deal Review, canvas completion + feedback synthesis for Canvas Coach — plus a shared AgencyInsightCard component for visual consistency.
**Impact:** All 4 chat modes now have mode-specific right panels, completing the specialized tool experience. Founders see actionable visual context alongside their chat conversation.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see MEDDPICC dimension scores during Deal Review chat | I know exactly which dimensions are weak for this investor |
| Founder | see canvas completion and gap indicators during Canvas Coach | I know which canvas boxes need improvement |
| Founder | see suggested actions for weak dimensions | I have concrete next steps to improve deal readiness or canvas quality |
| Developer | use AgencyInsightCard in all mode panels | I maintain consistent styling without duplicating markup across 4 panels |

## Goals
1. **Primary:** Deal Review and Canvas Coach modes have dedicated right panels with structured data
2. **Secondary:** Shared AgencyInsightCard component used across all 4 mode panels
3. **Quality:** Panel content updates reactively as chat messages reference new data

## Acceptance Criteria
- [ ] `DealReviewPanel.tsx` renders MEDDPICC 8-dimension breakdown with per-dimension score bars (0-5)
- [ ] `DealReviewPanel.tsx` shows deal verdict pill (Strong Buy / Buy / Hold / Pass) with color coding
- [ ] `DealReviewPanel.tsx` shows suggested actions for weakest 2-3 dimensions
- [ ] `CanvasCoachPanel.tsx` renders canvas completion % as a progress ring
- [ ] `CanvasCoachPanel.tsx` shows 9-box strength/gap indicators (green/amber/red)
- [ ] `CanvasCoachPanel.tsx` shows feedback synthesis summary (themes grouped by strength/gap/contradiction)
- [ ] `AgencyInsightCard.tsx` is a shared component used by all 4 mode panels
- [ ] Panel content updates when chat messages reference relevant data (investor scores, canvas changes)
- [ ] Both panels show empty state when no contextual data is available for the mode
- [ ] Responsive: panels collapse to bottom sheet on mobile (< 768px), matching existing panel behavior
- [ ] Right panel reverts to default when user switches out of Deal Review or Canvas Coach mode

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/ai/DealReviewPanel.tsx` | Create — MEDDPICC 8-dimension breakdown |
| Component | `src/components/ai/CanvasCoachPanel.tsx` | Create — canvas completion + feedback synthesis |
| Component | `src/components/ai/AgencyInsightCard.tsx` | Create — shared metric card used by all 4 panels |
| Panel | `src/components/ai/AIPanel.tsx` | Modify — add mode-conditional rendering for deal-review and canvas-coach |
| Refactor | `src/components/ai/PitchScoreCard.tsx` | Modify — adopt AgencyInsightCard for dimension rows |
| Refactor | `src/components/ai/AARRRFunnel.tsx` | Modify — adopt AgencyInsightCard for stage cards |

### AgencyInsightCard Props

```typescript
interface AgencyInsightCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  color: 'green' | 'amber' | 'red' | 'blue' | 'default';
  subtitle?: string;
  children?: React.ReactNode;
}
```

The card renders a compact row (icon + title on the left, value badge on the right) with a color-coded left border. The `children` slot is for expandable detail content (evidence text, gap description, action link). This matches the density needed for a 360px panel — each dimension/metric should occupy roughly 48-56px height in collapsed state.

### Canvas Box Config

```typescript
const CANVAS_BOXES = [
  { key: 'problem',            label: 'Problem' },
  { key: 'customer_segments',  label: 'Customer Segments' },
  { key: 'unique_value_prop',  label: 'Unique Value Proposition' },
  { key: 'solution',           label: 'Solution' },
  { key: 'channels',           label: 'Channels' },
  { key: 'revenue_streams',    label: 'Revenue Streams' },
  { key: 'cost_structure',     label: 'Cost Structure' },
  { key: 'key_metrics',        label: 'Key Metrics' },
  { key: 'unfair_advantage',   label: 'Unfair Advantage' },
] as const;
```

Each box's strength is derived from: whether it has content (non-empty array in canvas data), length/depth of entries (>3 items = strong, 1-2 items = needs work, 0 = missing), and AI feedback themes that reference the box by name. The `CanvasCoachPanel` reads canvas data from the existing `useLeanCanvasAgent` hook rather than duplicating any fetch logic.

### MEDDPICC Dimension Config

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

Score thresholds for color coding match the `deal-strategist` skill: green (4-5), amber (3), red (0-2). Gap flags use the AlertTriangle icon with destructive text styling.

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No investor mentioned in Deal Review chat | DealReviewPanel shows empty state: "Start a conversation about an investor to see MEDDPICC analysis" |
| Investor has no MEDDPICC score yet (signal_data is empty) | DealReviewPanel shows 8 dimensions as grey/unscored with prompt: "Ask the AI to score this investor" |
| No canvas data loaded for Canvas Coach | CanvasCoachPanel shows empty state: "Open your Lean Canvas to get coaching feedback" |
| Canvas has only 3 of 9 boxes filled | Completion ring shows 33%, filled boxes are green, empty boxes are red with gap suggestions |
| User switches modes mid-conversation | Right panel content swaps immediately to match the new mode |
| Chat response includes updated scores | Panel re-renders with new values from response metadata |
| Mobile viewport (< 768px) | Both panels render as bottom sheet, matching PitchScoreCard and AARRRFunnel behavior |
| AI response metadata is malformed | Panel shows last valid state, does not crash — uses optional chaining throughout |

## Real-World Examples

**Scenario 1 — Deal Review with MEDDPICC gaps:** Aisha is preparing for a meeting with Lightspeed Ventures. She opens Deal Review mode and asks "What's my deal readiness for Lightspeed?" The AI evaluates based on her CRM data and conversation history. The right panel renders: Metrics 5/5 (green), Economic Buyer 4/5 (green), Decision Criteria 3/5 (amber), Decision Process 2/5 (red flag), Paper Process 1/5 (red flag), Identify Pain 4/5 (green), Champion 2/5 (red flag), Competition 3/5 (amber). Total: 24/40, "Hold" verdict. Suggested actions: "Map the internal decision process — who signs off on your check size?" and "Identify a GP champion who has invested in your vertical before." **With the MEDDPICC panel,** Aisha sees that her deal is stuck on process knowledge and internal advocacy, not on product fit. She adjusts her meeting prep accordingly.

**Scenario 2 — Canvas Coach with feedback synthesis:** Raj is refining his B2B SaaS canvas in Canvas Coach mode. He asks "Is my value proposition strong enough?" The right panel shows 7/9 boxes filled (78% completion ring). Problem and Customer Segments are green (strong). Unique Value Proposition is amber ("too generic — lacks quantified outcome"). Revenue Streams and Cost Structure are red (empty). Feedback themes: Strengths — "clear problem definition, validated customer segment"; Gaps — "no pricing model, UVP needs a measurable outcome claim." **With the feedback panel,** Raj immediately sees that Revenue Streams is the biggest gap and asks the coach to help him draft pricing tiers.

**Scenario 3 — Mode switching preserves context:** Priya starts in Canvas Coach mode reviewing her fintech startup's canvas. The right panel shows canvas analytics. She switches to Deal Review mode to check her Sequoia deal. The right panel immediately swaps to MEDDPICC breakdown. She switches back to Canvas Coach — canvas analytics reappear with the same state. **With mode-specific panels,** each mode feels like a dedicated tool rather than a chat skin.

## Outcomes

| Before | After |
|--------|-------|
| Deal Review mode shows generic AI panel — same as default assistant | MEDDPICC 8-dimension breakdown with scores, verdict, and suggested actions |
| Canvas Coach mode shows generic AI panel — no canvas context | Canvas completion %, 9-box strength indicators, and feedback synthesis summary |
| Each mode panel uses ad-hoc Card markup | Shared AgencyInsightCard component ensures visual consistency across all 4 modes |
| 2 of 4 modes have dedicated panels | All 4 modes have dedicated right panels, completing the specialized chat experience |
| No suggested actions for weak MEDDPICC dimensions | Top 2-3 actions shown for weakest dimensions — founders know what to do next |
| No visual indication of canvas gaps during coaching | Red/amber/green indicators per canvas box — founders see gaps at a glance |
