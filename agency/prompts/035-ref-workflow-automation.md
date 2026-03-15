---
task_id: 109-INF
title: Agency Workflow Automation
phase: INFRASTRUCTURE
priority: P1
status: Not Started
estimated_effort: 0.5 day
skill: [behavioral-nudge, product/feature-dev]
subagents: [frontend-designer]
depends_on: [108-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Dashboard, Validator Report, Sprint Board, Lean Canvas, Investors, Pitch Deck, Onboarding Wizard Step 4 |
| **Features** | Cross-module workflows, behavioral nudge triggers, chat mode state machine, realtime channel map, dashboard agency sync |
| **Edge Functions** | `health-scorer` (modify), `ai-chat` (modify), `sprint-agent` (modify) |
| **Real-World** | "Founder completes validation, imports actions to sprint board, gets a nudge when tasks go stale, and sees agency-enriched health score on dashboard — all without manual context transfer" |

## Description

**The situation:** The agency layer (prompts 001-024) adds intelligence to 6 modules: validator scoring, sprint prioritization, investor MEDDPICC, pitch deck narratives, lean canvas specificity, and AI chat modes. Each module works in isolation — a validation report produces priority actions but the founder must manually create sprint tasks. The lean canvas coach detects low specificity but the dashboard health score does not reflect it. Behavioral nudge triggers are defined in prompt 015 but no orchestration ties triggers to page load checks and realtime events. Chat modes exist (prompts 010-011) but the state machine governing mode transitions, scoring, and completion is not documented as a wirable specification.

The platform already has 8 cross-module workflows that exist in various states of implementation. Some are fully built (validator-to-sprint import), some are partially built (validator-to-canvas generation), and some exist only as concepts (nudge trigger engine, dashboard agency sync, realtime channel map). Without a single authoritative document that maps every workflow trigger, data flow, state machine, and realtime channel, developers will wire agency features inconsistently — leading to orphaned events, duplicate realtime channels, missing nudge evaluations, and dashboard data that contradicts module-level data.

**Why it matters:** Workflow automation is the connective tissue of the agency layer. Without it, each agency feature is a dead end: the validator produces insights that sit in a report, the sprint board has RICE scores that do not feed the health scorer, the MEDDPICC assessments do not trigger stage guidance updates. The value of the agency layer compounds when modules communicate — a validation report triggers sprint imports, which surface in health score, which triggers nudges when stale. Without this document, each developer wires their own ad-hoc connections, creating a maintenance burden of undocumented side effects.

**What already exists:**
- `src/hooks/useSprintImport.ts` — Fully built POST-02 workflow: validator report priority_actions to sprint_tasks with dedup, auto-campaign, toast feedback
- `src/hooks/useLeanCanvas.ts` — `useGenerateCanvasFromReport()` mutation: report dimensions to 9 canvas boxes via `lean-canvas-agent` `generate_from_report` action (CORE-03)
- `src/hooks/useStrategicSummary.ts` — Derivation hook: synthesizes priority actions, positioning, fundability from report dimensions (POST-01)
- `src/components/validator/report/StrategicSummary.tsx` — "Start Next Sprint" button in Build Focus section
- `src/components/validator/v3/DimensionPage.tsx` — "Import to Sprint" button with per-dimension import
- `src/pages/ValidatorReport.tsx` — "Generate Canvas" button with overwrite confirmation dialog
- `src/hooks/realtime/index.ts` — 12 realtime hooks (dashboard consolidated, canvas, chat, investors, etc.)
- `src/hooks/realtime/useRealtimeHealth.ts` — Global health badge (green/yellow/red) with latency tooltip
- `src/hooks/useRealtimeSubscription.ts` — Dashboard consolidated channel (7 domains multiplexed into 1)
- `supabase/functions/_shared/broadcast.ts` — Generic broadcast helper for edge functions
- `supabase/functions/ai-chat/index.ts` — Chat handler (mode field planned in prompt 010)
- `supabase/functions/health-scorer/index.ts` — 6-dimension health score (uses validator_reports.details.scores_matrix when available)
- `agency/prompts/015-behavioral-nudge-system.md` — 5 nudge trigger conditions, NudgeBanner component spec
- `agency/chat-modes/practice-pitch.md`, `growth-strategy.md`, `deal-review.md`, `canvas-coach.md` — 4 chat mode prompts
- `agency/lib/agent-loader.ts` — `loadFragment()` and `loadChatMode()` runtime loaders
- `agency/mermaid/07-behavioral-nudge-system.md` — Nudge trigger flow diagram

**The build:**
1. Document all 8 cross-module workflows with trigger, action, data mapping, and dedup strategy
2. Specify the chat mode state machine with typed states, transitions, and per-mode sub-state
3. Define the behavioral nudge trigger engine: 5 trigger conditions, evaluation timing, creation logic, dismiss/snooze persistence
4. Map the dashboard agency sync: how health-scorer incorporates agency data (evidence tiers, MEDDPICC, RICE progress)
5. Define the realtime channel map: 5 agency channels, event names, payload shapes, consumer hooks
6. Specify the cross-module data flow from validation report through sprint board to dashboard to nudges to target screen
7. Document wizard enhancement: agency readiness indicators on onboarding Step 4
8. Provide wiring plan for all new and modified files

**Example:** Priya completes a validation run for her edtech startup. The report shows 9 dimensions scored, with "Customer Validation" at 45/100 (weak). She clicks "Start Next Sprint" in the Strategy tab — 5 priority actions import to her sprint board as RICE-scored tasks. Three days later, she has not moved any tasks. The nudge trigger engine evaluates `sprint_stale_3d` on her next dashboard visit and creates a nudge: "Your sprint has 5 tasks with no movement for 3 days — review or re-prioritize." The dashboard health score now factors in her evidence tier distribution (2 Level-1, 3 Level-2, 4 Level-3) alongside the traditional canvas-based estimate. The AI right panel says: "Customer Validation is your weakest dimension at 45/100 — the Canvas Coach can help refine your customer segment specificity." Every step connects without Priya manually transferring context between screens.

## Rationale
**Problem:** Agency features work in isolation — no orchestration ties validation insights to sprint tasks to health scores to nudges.
**Solution:** Document and specify all 8 workflows, the state machine, trigger engine, realtime channels, and dashboard sync as a wirable blueprint.
**Impact:** Developers implement cross-module features consistently; founders experience a connected platform where insights flow automatically.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | have validation actions flow into my sprint board | I do not manually re-type insights as tasks |
| Founder | see my dashboard health reflect agency data | my health score is accurate, not just canvas-based |
| Founder | get nudged when my sprint goes stale | I stay accountable without checking every screen daily |
| Founder | have chat modes track my progress | pitch practice scores persist across sessions |
| Developer | reference a single workflow spec | I wire cross-module features without guessing event names or data shapes |
| Developer | know the realtime channel map | I do not create duplicate channels or miss events |

## Goals
1. **Primary:** All 8 workflows have documented trigger, action, data mapping, and dedup strategy
2. **Secondary:** Chat mode state machine is typed with per-mode sub-state
3. **Quality:** Realtime channel map covers all agency events with payload types

## Acceptance Criteria
- [ ] 8 workflows documented with trigger condition, action flow, data mapping, and dedup/idempotency strategy
- [ ] Chat mode state machine defined with 5 states, transitions, and 4 per-mode sub-state types
- [ ] 5 behavioral nudge triggers specified with evaluation timing, creation logic, and dismiss/snooze rules
- [ ] Dashboard agency sync spec shows how health-scorer incorporates evidence tiers, MEDDPICC, and RICE progress
- [ ] Realtime channel map defines 5 channels with event names, payload shapes, and consumer hooks
- [ ] Cross-module data flow diagram from validator report through sprint to dashboard to nudges to target screen
- [ ] Wizard Step 4 agency readiness indicators specified
- [ ] Wiring plan lists all new and modified files
- [ ] No new tables created (all tables from prompt 100-INF, all RLS from prompt 101-INF)
- [ ] All realtime channels use private naming convention (`{domain}:{org_id}` or `{domain}:{session_id}`)

---

## Workflow 1: Validator to Sprint Import

**Status:** Fully built (POST-02, Session 38)

| Attribute | Value |
|-----------|-------|
| **Trigger** | Validation report completes with `details.dimensions[*].priority_actions` |
| **Entry point** | "Start Next Sprint" button in `StrategicSummary.tsx` Build Focus section |
| **Entry point 2** | "Import to Sprint" button in `DimensionPage.tsx` per-dimension |
| **Hook** | `src/hooks/useSprintImport.ts` |
| **Data mapping** | `priority_actions[i].action` to `sprint_tasks.title`, `timeframe` to `sprint_tasks.sprint_number` + `ai_tip`, `effort+impact` to `sprint_tasks.priority` |
| **Dedup** | `source_action_id` = `rpt_{djb2_hash(reportId:dimensionId:rank)}` — unique index on `sprint_tasks.source_action_id` |
| **Auto-create** | Creates campaign `"90-Day Validation Plan"` if none exists for startup |
| **Feedback** | Toast: "Imported N actions to Sprint Board" / "All actions already imported" |
| **Invalidation** | React Query keys: `sprint-tasks`, `sprint-tasks-action-ids`, `campaigns` |

**Agency enhancement (not yet built):**
- After import, RICE scores should be computed for each imported task via `sprint-agent` (trigger: `sprint_tasks INSERT` with `source_action_id LIKE 'rpt_%'`)
- Kano classification should be applied based on the source dimension (problem/customer dimensions tend to produce must-haves; revenue/ai-strategy tend to produce performance features)

## Workflow 2: Validator to Lean Canvas Auto-Populate

**Status:** Fully built (CORE-03, Session [0.10.29])

| Attribute | Value |
|-----------|-------|
| **Trigger** | Validation report exists (any status) |
| **Entry point** | "Generate Canvas" button in `ValidatorReport.tsx` header controls |
| **Hook** | `src/hooks/useLeanCanvas.ts` — `useGenerateCanvasFromReport()` |
| **Edge function** | `lean-canvas-agent` action `generate_from_report` |
| **Data mapping** | `problem_clarity` + `red_flags` to Problem box; `customer_use_case` to Customer Segments + Solution; `competition` gaps + SWOT strengths to Unfair Advantage; `summary_verdict` to UVP; `revenue_model` to Revenue Streams; `market_sizing` to Channels; `scores_matrix` to Key Metrics; `technology_stack` + `mvp_scope` to Cost Structure |
| **Overwrite guard** | AlertDialog confirmation when canvas already exists |
| **Navigation** | Success redirects to `/lean-canvas` |

**Agency enhancement (not yet built):**
- Append `specificity_scores` to generated canvas based on evidence tier of each mapped dimension (Level 3-4 evidence = HIGH specificity, Level 1-2 = LOW)
- Populate `evidence_gaps` array from dimensions with Level 1 evidence or missing sub-scores
- These fields feed into prompt 009 (Lean Canvas Specificity) for the canvas coach

## Workflow 3: Chat Mode State Machine

**Status:** Not built (specified in prompts 010-012, state machine is new)

### State Diagram

```
idle ──[select_mode]--> selecting_mode ──[confirm]--> mode_active
  ^                                                       |
  |                     ┌─────────────────────────────────┘
  |                     v
  |               (user interacts in mode)
  |                     |
  |              ──[complete/exit]--> scoring ──[score_saved]--> completed
  |                                                                  |
  └─────────────────────[new_session]────────────────────────────────┘
```

### State Types

```typescript
type ChatModeState =
  | { phase: 'idle' }
  | { phase: 'selecting_mode'; availableModes: ChatMode[] }
  | { phase: 'mode_active'; mode: ChatMode; subState: ModeSubState }
  | { phase: 'scoring'; mode: ChatMode; subState: ModeSubState }
  | { phase: 'completed'; mode: ChatMode; finalScore: number | null };

type ChatMode = 'practice-pitch' | 'growth-strategy' | 'deal-review' | 'canvas-coach' | 'general';

type ModeSubState =
  | PracticePitchState
  | GrowthStrategyState
  | DealReviewState
  | CanvasCoachState
  | GeneralState;

interface PracticePitchState {
  mode: 'practice-pitch';
  round: number;           // 1-5
  scores: PitchScore[];    // per-round scores
  overall_score: number | null;
  feedback_themes: string[];
}

interface PitchScore {
  round: number;
  clarity: number;         // 1-10
  conviction: number;      // 1-10
  conciseness: number;     // 1-10
  objection_handling: number; // 1-10
  overall: number;         // average
}

interface GrowthStrategyState {
  mode: 'growth-strategy';
  aarrr_stage: 'acquisition' | 'activation' | 'retention' | 'referral' | 'revenue';
  channels: string[];
  north_star: string;
  experiments: GrowthExperiment[];
}

interface GrowthExperiment {
  name: string;
  ice_score: number;       // Impact * Confidence * Ease
  status: 'proposed' | 'running' | 'concluded';
}

interface DealReviewState {
  mode: 'deal-review';
  investor_id: string;
  meddpicc_scores: Record<string, number>; // M/E/D/D/P/I/C/C -> 1-5
  verdict: 'pursue' | 'nurture' | 'pass' | null;
  signal_tier: 'hot' | 'warm' | 'cold' | null;
}

interface CanvasCoachState {
  mode: 'canvas-coach';
  active_box: string;      // problem, customer_segments, etc.
  specificity: Record<string, 'low' | 'medium' | 'high'>;
  nudges_shown: string[];  // nudge IDs shown during session
  evidence_gaps: string[]; // boxes with insufficient evidence
}

interface GeneralState {
  mode: 'general';
}
```

### Transitions

| From | Event | To | Side Effect |
|------|-------|----|-------------|
| `idle` | `select_mode` | `selecting_mode` | Show mode picker UI |
| `selecting_mode` | `confirm(mode)` | `mode_active` | `loadChatMode(mode)` injects system prompt; create `chat_mode_sessions` row |
| `mode_active` | `user_message` | `mode_active` | Update subState (e.g., increment round for pitch) |
| `mode_active` | `complete` | `scoring` | Compute final score from subState |
| `mode_active` | `exit` | `idle` | Save partial progress to `chat_mode_sessions.mode_state` |
| `scoring` | `score_saved` | `completed` | Persist score to DB; broadcast `mode_completed` event |
| `completed` | `new_session` | `idle` | Reset subState |

### Persistence (from prompt 012)

- Active state stored in `chat_mode_sessions` table (columns: `id`, `user_id`, `org_id`, `mode`, `mode_state jsonb`, `started_at`, `completed_at`, `final_score`)
- `mode_state` is serialized `ModeSubState` — allows session resume after page refresh
- On page load: query latest incomplete session for user; if exists, restore to `mode_active` with saved subState

## Workflow 4: Behavioral Nudge Trigger Engine

**Status:** Specified in prompt 015, trigger engine orchestration is new

### 5 Trigger Conditions

| Trigger Key | Condition | Check Timing | Target Page | Nudge Type | Message Template |
|-------------|-----------|--------------|-------------|------------|------------------|
| `sprint_stale_3d` | Sprint has tasks in `todo` or `doing` columns with no `updated_at` change for 3+ days | Sprint Board page load; Dashboard page load | Sprint Board | `warning` (amber) | "Your sprint has {count} tasks with no movement for {days} days -- review or re-prioritize" |
| `canvas_incomplete` | Lean canvas has 3+ boxes with empty `items` array | Lean Canvas page load; Dashboard page load | Lean Canvas | `suggestion` (blue) | "{count} canvas boxes need attention -- fill in {box_names}" |
| `report_generated` | Validation report completed in last 24h AND lean canvas not generated from report | Dashboard page load | Validator Report | `progress` (green) | "Your validation is complete -- generate a Lean Canvas from your report to start executing" |
| `investor_cold_7d` | Investor record with `signal_tier = 'cold'` AND no `deals` activity for 7+ days | Investors page load; Dashboard page load | Investors | `warning` (amber) | "{investor_name} has gone cold with no contact for {days} days -- reach out or update status" |
| `pitch_no_themes` | Pitch deck exists AND `win_themes` is null or empty array | Pitch Deck page load | Pitch Deck | `suggestion` (blue) | "Your pitch deck has no win themes -- the Challenger Narrative can strengthen your story" |

### Evaluation Logic

```typescript
// Pseudocode for nudge evaluation (runs in useNudgeState hook)
async function evaluateNudges(page: PageContext): Promise<Nudge[]> {
  const orgId = user.org_id;
  const now = new Date();

  // 1. Fetch existing active/snoozed nudges for org
  const existing = await supabase
    .from('behavioral_nudges')
    .select('*')
    .eq('org_id', orgId)
    .is('dismissed_at', null)
    .or(`snoozed_until.is.null,snoozed_until.lt.${now.toISOString()}`);

  const activeKeys = new Set(existing.map(n => n.trigger_key));

  // 2. Evaluate each trigger relevant to current page
  const triggers = TRIGGER_CONFIG.filter(t => t.pages.includes(page.name));

  for (const trigger of triggers) {
    if (activeKeys.has(trigger.key)) continue; // already active
    const result = await trigger.evaluate(orgId);
    if (result.triggered) {
      await supabase.from('behavioral_nudges').insert({
        org_id: orgId,
        trigger_key: trigger.key,
        nudge_type: trigger.type,
        message: trigger.formatMessage(result.data),
        target_page: trigger.targetPage,
        metadata: result.data,
      });
    }
  }

  // 3. Return nudges relevant to current page
  return existing.filter(n =>
    n.target_page === page.name || page.name === 'dashboard'
  );
}
```

### Dismiss and Snooze

| Action | DB Update | Effect |
|--------|-----------|--------|
| Dismiss | `SET dismissed_at = now()` | Nudge never reappears for that trigger instance |
| Snooze | `SET snoozed_until = now() + interval '24 hours'` | Nudge hidden for 24h, then re-evaluated |

### Important: Dashboard Shows All Nudges

The Dashboard page is the aggregation point. It shows nudges from all triggers, not just dashboard-specific ones. Each nudge's CTA button navigates to `target_page` (sprint board, canvas, investors, pitch deck). Other pages show only their own nudges.

## Workflow 5: Dashboard Realtime + Agency Sync

**Status:** Partially built (health-scorer uses validator scores since POST-03; agency enhancements are new)

### Health Score Agency Integration

The `health-scorer` edge function (v27) already uses `validator_reports.details.scores_matrix` when available. Agency data extends this further:

| Data Source | Health Dimension Affected | How It Integrates |
|-------------|--------------------------|-------------------|
| `evidence_tier_counts` (from validator scoring fragment, prompt 002) | All 6 dimensions | Higher evidence tiers (Level 3-4) increase confidence multiplier on the corresponding dimension score. Level 1 evidence applies a 0.8 penalty. |
| `meddpicc_score` (from investor MEDDPICC, prompt 006-007) | Fundraising readiness | MEDDPICC aggregate > 30/40 adds +5 to fundraising health dimension. < 15/40 applies -5 penalty. |
| Sprint task RICE completion rate | Execution health | % of RICE > 50 tasks in "done" column feeds execution dimension. > 60% done = +5 boost. |
| `specificity_scores` (from canvas specificity, prompt 009) | Strategy health | Average specificity > 0.7 adds +3 to strategy dimension. < 0.3 applies -3 penalty. |
| Active behavioral nudges count | Overall health | > 3 active warning nudges applies -2 to overall score (indicates multiple areas of inaction). |

### Stage Guidance Agency Integration

The dashboard right panel shows stage guidance. With agency data:

| Startup Stage | Agency-Enriched Guidance |
|---------------|--------------------------|
| `idea` / `pre_seed` | "Run the validator to get your startup score. Focus on Problem and Customer dimensions." |
| `seed` (with MEDDPICC data) | "Your MEDDPICC score with {investor} is {score}/40 -- focus on identifying a Champion (C) and quantifying Economic Buyer authority (E)." |
| `series_a` (with RICE data) | "Sprint has {stale_count} stale tasks. Your highest-RICE uncompleted task is '{task_title}' (RICE {score})." |
| Any (with nudge data) | "{nudge_count} areas need attention: {nudge_summaries}" |

### AI Right Panel Insights

The persistent AI panel (`src/components/ai/AIPanel.tsx`) shows agency-derived insights:

```typescript
interface AgencyInsight {
  source: 'meddpicc' | 'rice' | 'specificity' | 'evidence' | 'nudge';
  severity: 'info' | 'warning' | 'action';
  message: string;
  cta: { label: string; route: string } | null;
}

// Example insights:
[
  { source: 'meddpicc', severity: 'action', message: 'MEDDPICC score with Sequoia is 28/40 -- focus on identifying a Champion', cta: { label: 'Review MEDDPICC', route: '/investors' } },
  { source: 'rice', severity: 'warning', message: 'Sprint has 3 stale tasks -- consider RICE re-scoring', cta: { label: 'Open Sprint', route: '/sprint-plan' } },
  { source: 'specificity', severity: 'info', message: 'Canvas Problem box has LOW specificity -- AI Coach can help', cta: { label: 'Open Canvas', route: '/lean-canvas' } },
]
```

## Workflow 6: Cross-Module Data Flow

This is the end-to-end data flow that connects all agency features:

```
Validator Report (scores, evidence tiers, priority actions, dimensions)
    |
    ├──[Import to Sprint]──> Sprint Board (RICE-scored tasks, Kano-classified)
    |                             |
    |                             ├──[Task progress]──> Health Scorer (execution dimension)
    |                             |
    |                             └──[Stale detection]──> Nudge Engine (sprint_stale_3d)
    |
    ├──[Generate Canvas]──> Lean Canvas (specificity scores, evidence gaps)
    |                             |
    |                             ├──[Specificity data]──> Health Scorer (strategy dimension)
    |                             |
    |                             └──[Empty boxes]──> Nudge Engine (canvas_incomplete)
    |
    ├──[Evidence tiers]──> Health Scorer (confidence multiplier on all dimensions)
    |
    └──[Report complete]──> Nudge Engine (report_generated → suggest canvas)

Investor Pipeline (MEDDPICC scores, signal tiers, deal verdicts)
    |
    ├──[MEDDPICC aggregate]──> Health Scorer (fundraising dimension)
    |
    └──[Cold signals]──> Nudge Engine (investor_cold_7d)

Pitch Deck (win themes, challenger narrative)
    |
    └──[No themes]──> Nudge Engine (pitch_no_themes)

Nudge Engine
    |
    └──[Active nudge count]──> Health Scorer (overall penalty)
    |
    └──[CTA click]──> Target Screen (sprint, canvas, investors, pitch deck)

Health Scorer
    |
    └──[Updated score]──> Dashboard (health card, stage guidance, AI panel insights)
```

### Idempotency Rules

| Workflow | Idempotency Mechanism |
|----------|----------------------|
| Sprint import | `source_action_id` unique index — duplicate imports silently skip |
| Canvas generation | Overwrite confirmation dialog — user explicitly confirms replacement |
| Nudge creation | Check existing active/unsnoozed nudge for same `trigger_key` before INSERT |
| Health score | Computed on each call — no state accumulation, always recalculated from source data |
| Chat mode scoring | `chat_mode_sessions.completed_at` prevents re-scoring completed sessions |

## Workflow 7: Wizard Enhancement

**Status:** Not built (enhancement to existing onboarding wizard Step 4)

Onboarding wizard Step 4 (Review & Score) currently shows readiness score, summary, and generated tasks. With agency data available, add conditional agency readiness indicators:

### Conditional Sections (only shown when data exists)

| Condition | Section | Content |
|-----------|---------|---------|
| Startup has a completed validation report | Evidence Tier Distribution | Bar chart showing count of Level 1/2/3/4 evidence across dimensions. Label: "Your validation has {total} evidence signals at {avg_level} average tier." |
| Startup has investor records with MEDDPICC scores | Investor Readiness | MEDDPICC aggregate score badge. Label: "Investor pipeline readiness: {score}/40." |
| Startup has lean canvas with specificity scores | Canvas Specificity | 9-box mini-grid with color-coded specificity (red/amber/green). Label: "{high_count} boxes at high specificity, {low_count} need work." |
| None of the above | No agency section | Standard Step 4 (no change from existing behavior) |

### Implementation Notes

- These sections are display-only (no actions from wizard)
- Data fetched via existing hooks (`useValidationReport`, `useInvestors`, `useLeanCanvas`)
- Renders below the existing readiness score card, above the task list
- Wrapper component: `AgencyReadinessIndicators.tsx` — renders nothing if no agency data exists (zero visual change for new users)

## Workflow 8: Realtime Channel Map for Agency Features

### Channel Definitions

| Channel Name | Pattern | Events | Payload | Consumer Hook |
|-------------|---------|--------|---------|---------------|
| `sprint:{org_id}` | Private, org-scoped | `task_rice_updated`, `task_kano_classified`, `task_imported` | `{ task_id: string, rice_score?: number, kano_class?: string, source_action_id?: string }` | `useSprintRealtime` (existing, extend) |
| `investor:{org_id}` | Private, org-scoped | `meddpicc_scored`, `signal_changed`, `verdict_set` | `{ investor_id: string, meddpicc_score?: number, signal_tier?: string, deal_verdict?: string }` | `useInvestorsRealtime` (existing, extend) |
| `chat:{session_id}` | Private, session-scoped | `mode_changed`, `pitch_scored`, `growth_analyzed`, `round_completed` | `{ mode: ChatMode, subState: ModeSubState }` | `useRealtimeAIChat` (existing, extend) |
| `nudge:{org_id}` | Private, org-scoped | `nudge_created`, `nudge_dismissed`, `nudge_snoozed` | `{ nudge_id: string, trigger_key: string, nudge_type: string, message: string }` | `useNudgeRealtime` (new) |
| `canvas:{org_id}` | Private, org-scoped | `specificity_updated`, `evidence_gap_found`, `coach_suggestion` | `{ box_key: string, specificity?: number, gaps?: string[] }` | `useCanvasRealtime` (existing, extend) |

### Broadcast Pattern (Edge Function Side)

All edge functions use the shared `broadcast()` helper from `supabase/functions/_shared/broadcast.ts`:

```typescript
import { broadcast } from '../_shared/broadcast.ts';

// In sprint-agent after RICE scoring:
await broadcast(supabase, `sprint:${orgId}`, 'task_rice_updated', {
  task_id: taskId,
  rice_score: computedScore,
  kano_class: classification,
});

// In ai-chat after mode change:
await broadcast(supabase, `chat:${sessionId}`, 'mode_changed', {
  mode: selectedMode,
  subState: initialSubState,
});

// In nudge evaluation (client-side INSERT triggers realtime via postgres_changes or manual broadcast):
await broadcast(supabase, `nudge:${orgId}`, 'nudge_created', {
  nudge_id: newNudge.id,
  trigger_key: trigger.key,
  nudge_type: trigger.type,
  message: formattedMessage,
});
```

### Consumer Pattern (Frontend Side)

All realtime consumers follow the established `useRealtimeChannel` pattern from `src/hooks/realtime/useRealtimeChannel.ts`:

```typescript
// In useNudgeRealtime (new hook):
useRealtimeChannel({
  channelName: `nudge:${orgId}`,
  events: {
    nudge_created: (payload) => {
      queryClient.invalidateQueries({ queryKey: ['nudges', orgId] });
    },
    nudge_dismissed: (payload) => {
      queryClient.invalidateQueries({ queryKey: ['nudges', orgId] });
    },
  },
  enabled: !!orgId,
});
```

### Channel Naming Convention

All agency channels follow the existing platform convention:
- `{domain}:{scope_id}` where domain is the module name and scope_id is `org_id` (org-scoped) or `session_id` (session-scoped)
- Private channels (only authenticated users in the correct org/session can subscribe)
- No `postgres_changes` listeners — all events are explicit broadcasts (matches RT-AUDIT decision from Session 37)

## Research Before Implementation

Before wiring any workflow, verify the current state of these files:

1. Read `src/hooks/useSprintImport.ts` — confirm the dedup pattern and campaign auto-creation still work as documented
2. Read `src/hooks/useLeanCanvas.ts` — find `useGenerateCanvasFromReport` and confirm the mutation pattern
3. Read `supabase/functions/health-scorer/index.ts` — understand how validator scores currently integrate
4. Read `src/hooks/realtime/useRealtimeChannel.ts` — follow the existing pattern for new channels
5. Read `src/hooks/realtime/useRealtimeHealth.ts` — understand the health badge state management
6. Read `supabase/functions/_shared/broadcast.ts` — confirm the broadcast helper signature
7. Read `src/components/ai/AIPanel.tsx` — understand how insights are currently rendered
8. Read `agency/prompts/015-behavioral-nudge-system.md` — confirm the 5 trigger conditions match
9. Check `supabase/functions/ai-chat/index.ts` — verify the current system prompt injection pattern for chat modes

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Hook | `src/hooks/useNudgeState.ts` | Create — nudge trigger evaluation + dismiss/snooze logic |
| Hook | `src/hooks/realtime/useNudgeRealtime.ts` | Create — realtime listener for `nudge:{org_id}` channel |
| Hook | `src/hooks/useChatModeState.ts` | Create — state machine for chat mode transitions |
| Hook | `src/hooks/useAgencyInsights.ts` | Create — aggregates MEDDPICC/RICE/specificity/nudge data for AI panel |
| Component | `src/components/nudge/NudgeBanner.tsx` | Create — banner UI with dismiss/snooze/CTA (from prompt 015) |
| Component | `src/components/onboarding/AgencyReadinessIndicators.tsx` | Create — conditional agency indicators for wizard Step 4 |
| Component | `src/components/ai/AgencyInsightCard.tsx` | Create — card for agency insight in AI right panel |
| Edge Function | `supabase/functions/health-scorer/index.ts` | Modify — add evidence tier multiplier, MEDDPICC bonus, RICE completion, specificity, nudge penalty |
| Edge Function | `supabase/functions/ai-chat/index.ts` | Modify — state machine integration for mode transitions and scoring |
| Edge Function | `supabase/functions/sprint-agent/index.ts` | Modify — broadcast `task_rice_updated` and `task_kano_classified` events after scoring |
| Hook | `src/hooks/realtime/useSprintRealtime.ts` | Modify — extend with `task_rice_updated`, `task_kano_classified`, `task_imported` events |
| Hook | `src/hooks/realtime/useInvestorsRealtime.ts` | Modify — extend with `meddpicc_scored`, `signal_changed`, `verdict_set` events |
| Hook | `src/hooks/realtime/useCanvasRealtime.ts` | Modify — extend with `specificity_updated`, `evidence_gap_found` events |
| Hook | `src/hooks/realtime/useRealtimeAIChat.ts` | Modify — extend with `mode_changed`, `pitch_scored`, `round_completed` events |
| Page | `src/pages/Dashboard.tsx` | Modify — wire `useAgencyInsights` and `NudgeBanner` |
| Page | `src/pages/SprintPlan.tsx` | Modify — wire `NudgeBanner` for sprint-specific nudges |
| Page | `src/pages/LeanCanvas.tsx` | Modify — wire `NudgeBanner` for canvas-specific nudges |
| Page | `src/components/onboarding/steps/Step4Review.tsx` | Modify — add `AgencyReadinessIndicators` below readiness score |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Validation report has no `dimensions` field (v2 report, pre-agency) | Sprint import shows standard actions without RICE. Canvas generation uses string fields. Health scorer falls back to canvas-based estimate. |
| User has no startup selected | All workflows gracefully return empty/null. No nudges created. No errors thrown. |
| Nudge trigger fires but nudge for same key already active and not snoozed | Skip creation (idempotent — check `trigger_key` + `dismissed_at IS NULL` + `snoozed_until` expired) |
| Chat mode session interrupted (browser close during pitch practice round 3) | `mode_state` persisted on each round completion. On next page load, restore to `mode_active` at round 3. |
| Health scorer called before any agency data exists | All agency multipliers default to 1.0 (neutral). Score identical to pre-agency behavior. Zero breaking change. |
| Two users in same org both trigger `sprint_stale_3d` | One nudge created (first evaluation wins). Second evaluation sees existing active nudge and skips. Both users see the same org-scoped nudge. |
| User snoozes a nudge, then the condition resolves (tasks moved) | Snoozed nudge expires after 24h. Re-evaluation finds condition no longer true. No new nudge created. Old snoozed nudge remains dismissed-equivalent. |
| Real-time channel subscription fails (network error) | `useRealtimeHealth` badge turns yellow/red. Polling fallback via `usePollingFallback` activates for critical data (health score). Non-critical channels (nudge, sprint RICE) degrade gracefully — data refreshes on next page load. |
| Sprint import of 50+ actions from a report with many dimensions | Batch INSERT capped at 50 rows per operation. `source_action_id` dedup prevents double-import even if user clicks multiple times during slow insert. |
| Wizard Step 4 shown to brand-new user with zero agency data | `AgencyReadinessIndicators` component renders nothing (conditional sections all evaluate false). No visual change from existing wizard. |

## Real-World Examples

**Scenario 1 -- Full pipeline founder (Sarah, B2B SaaS):** Sarah validates her HR-tech idea and gets 71/100 with Customer Validation at 48/100. She clicks "Start Next Sprint" and 5 actions import. Over the next week she completes 3 tasks (all RICE > 60). On her dashboard, health score goes from 62 to 68 (execution dimension improved by RICE completion rate). The 2 remaining tasks stall for 4 days. On day 4, the dashboard shows an amber nudge: "2 sprint tasks stale for 4 days." She clicks the CTA, reviews the tasks, marks one as blocked and re-prioritizes the other. Meanwhile, the AI right panel says: "Customer Validation is weak at 48 -- open Canvas Coach to improve your customer segment specificity." **With workflow automation,** Sarah never loses context between modules. Each insight flows automatically into the next action.

**Scenario 2 -- Fundraising founder (Marcus, fintech):** Marcus has 8 investors in his pipeline. He runs MEDDPICC scoring on 3 (Sequoia 32/40, a16z 24/40, YC 18/40). His dashboard health score gets a +5 fundraising boost because Sequoia's MEDDPICC > 30. The AI panel shows: "YC MEDDPICC is 18/40 -- you haven't identified a Champion or quantified the Economic Buyer. Prepare before your next meeting." A week later, a16z goes cold (no deal activity for 8 days). The nudge engine creates an amber warning: "a16z has gone cold -- reach out or update their status." Marcus clicks the CTA, opens the investor page, and logs a follow-up email. **With workflow automation,** Marcus does not need to manually check each investor for staleness -- the system surfaces the problem proactively.

**Scenario 3 -- First-time founder (Aisha, edtech):** Aisha completes onboarding and runs her first validation (66/100). She has never used the sprint board or lean canvas before. On the dashboard, a green progress nudge says: "Your validation is complete -- generate a Lean Canvas from your report." She clicks the CTA, generates the canvas, and sees 3 boxes at LOW specificity (highlighted via agency enhancement). The canvas page shows a blue suggestion nudge: "3 canvas boxes need more detail -- Revenue Streams, Cost Structure, and Key Metrics." She opens Canvas Coach mode in the chat, which pre-loads the canvas-coach prompt with her specificity data. After 10 minutes of coaching, specificity improves from 0.3 to 0.7 average. Health score strategy dimension improves by +3. **With workflow automation,** Aisha is guided from validation to canvas to coaching without needing to know what to do next -- the platform tells her.

## Outcomes

| Before | After |
|--------|-------|
| Validation insights stay in the report — founders manually re-type them as tasks | One-click import to sprint board with dedup, RICE scoring, and Kano classification |
| Dashboard health score uses only canvas-based estimates | Health scorer incorporates evidence tiers, MEDDPICC, RICE completion, specificity, and nudge count |
| No proactive alerts when sprint tasks go stale or investors go cold | 5 behavioral nudge triggers evaluate on page load and surface contextual banners |
| Chat modes have no state machine — mode selection is stateless | Typed state machine with per-mode sub-state, persistence, and scoring |
| No realtime events for agency features (RICE, MEDDPICC, nudges) | 5 realtime channels with typed events, broadcast from edge functions, consumed by frontend hooks |
| AI right panel shows generic suggestions | Agency-enriched insights with source attribution (MEDDPICC, RICE, specificity) and CTA navigation |
| Wizard Step 4 shows only readiness score | Conditional agency readiness indicators (evidence tiers, MEDDPICC, canvas specificity) when data exists |
| Developers wire cross-module features ad-hoc with inconsistent event names | Single authoritative spec with all 8 workflows, state machines, channel maps, and idempotency rules |

## Checklist

### Production Ready
- [ ] `npm run build` passes
- [ ] `npm run test` passes (no regressions)
- [ ] No `console.log` in production code
- [ ] Loading, error, empty states handled for all new components
- [ ] All realtime channels use private naming convention
- [ ] No new tables created (schema from 100-INF, RLS from 101-INF)
- [ ] Edge function modifications deployed and verified
- [ ] Behavioral nudge evaluation does not block page render (async, non-blocking)
- [ ] Chat mode state machine handles all transitions without orphaned states

### Regression (manual spot-check)
- [ ] Validator: Chat to Progress to Report renders (existing flow unchanged)
- [ ] Sprint import: "Start Next Sprint" button works from StrategicSummary
- [ ] Canvas generation: "Generate Canvas" button works from ValidatorReport
- [ ] Dashboard: Health score displays with agency data (or without, for pre-agency startups)
- [ ] Nudge: Stale sprint banner appears on Sprint Board after 3+ days of inactivity
- [ ] Chat modes: Mode selection, interaction, and scoring complete without errors
- [ ] Wizard: Step 4 renders normally when no agency data exists

## Cross References

| Document | Path |
|----------|------|
| Infrastructure Index | `agency/prompts/100-index.md` |
| Feature Prompts Index | `agency/prompts/000-index.md` |
| Behavioral Nudge Feature | `agency/prompts/015-behavioral-nudge-system.md` |
| Chat Modes Backend | `agency/prompts/010-chat-modes-backend.md` |
| Chat Modes Frontend | `agency/prompts/011-chat-modes-frontend.md` |
| Chat Session Persistence | `agency/prompts/012-chat-session-persistence.md` |
| Sprint Board RICE/Kano | `agency/prompts/005-sprint-board-rice-kano.md` |
| Investor MEDDPICC Wiring | `agency/prompts/007-investor-meddpicc-wiring.md` |
| Lean Canvas Specificity | `agency/prompts/009-lean-canvas-specificity.md` |
| Agency RLS Policies | `agency/prompts/101-agency-rls-policies.md` |
| Frontend Wiring | `agency/prompts/108-agency-frontend-wiring.md` |
| Nudge Flow Diagram | `agency/mermaid/07-behavioral-nudge-system.md` |
| Broadcast Helper | `supabase/functions/_shared/broadcast.ts` |
| Sprint Import Hook | `src/hooks/useSprintImport.ts` |
| Canvas Generation | `src/hooks/useLeanCanvas.ts` |
| Strategic Summary | `src/hooks/useStrategicSummary.ts` |
| Realtime Hooks | `src/hooks/realtime/index.ts` |
| Health Scorer EF | `supabase/functions/health-scorer/index.ts` |
