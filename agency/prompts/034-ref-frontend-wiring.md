---
task_id: 108-INF
title: Agency Frontend Wiring
phase: INFRASTRUCTURE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: [design/frontend-design, product/api-wiring]
subagents: [frontend-designer]
depends_on: [104-INF, 105-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Sprint Board, Investors, AI Chat, Validator Report, Lean Canvas, Pitch Deck Editor, Dashboard |
| **Features** | 7 new hooks, 14 new components, 7 page modifications, 1 shared types module |
| **Edge Functions** | Consumes: sprint-agent, investor-agent, ai-chat, lean-canvas-agent, pitch-deck-agent |
| **Real-World** | "Every agency feature — RICE scores, MEDDPICC badges, chat modes, evidence tiers, nudges — has a React hook, typed interface, and presentational component" |

## Description

**The situation:** The agency infrastructure introduces 8 domain-specific knowledge fragments (tasks 001–003), 5 edge function enhancements (tasks 005, 007–010), 4 chat modes (tasks 010–011), and multiple UI surfaces (tasks 004, 013–016, 020). Each feature prompt defines its own hook, component, and page modification independently. There is no single document that maps the complete frontend wiring — which hooks exist, which components consume them, which pages integrate them, and how the TypeScript type system ties everything together. Without a unified plan, implementers risk duplicated types, inconsistent patterns, and missed integrations.

**Why it matters:** The frontend is where founders see agency features. A RICE score computed by the sprint-agent is invisible without a `useSprintRICE` hook and `RICEScoreCard` component. A MEDDPICC verdict stored in the database is useless without a `useMEDDPICC` hook and `MEDDPICCScorecard` component. This prompt is the master reference for all 7 hooks, 14 components, 7 page modifications, and 1 shared types file — ensuring every agency capability surfaces in the UI with consistent patterns, backward compatibility, and proper TypeScript coverage.

**What already exists:**
- `src/hooks/useSprintAgent.ts` — Sprint task generation hook (React Query + Supabase)
- `src/hooks/useInvestorAgent.ts` — 12-action investor agent hook (mutations)
- `src/hooks/useAIChat.ts` — Chat interface hook
- `src/hooks/useLeanCanvas.ts` — Canvas CRUD + AI generation
- `src/pages/SprintPlan.tsx` — Kanban board with drag-and-drop
- `src/pages/Investors.tsx` — Investor pipeline page
- `src/pages/AIChat.tsx` — Chat page with message thread
- `src/pages/ValidatorReport.tsx` — Report page routing to ReportV2Layout
- `src/pages/LeanCanvas.tsx` — 9-box canvas editor
- `src/pages/PitchDeckEditor.tsx` — Slide editor with thumbnails
- `src/components/layout/DashboardLayout.tsx` — Main layout with sidebar + AI panel
- `src/components/ai/AIChatInput.tsx` — Chat input with auto-resize
- `src/components/validator/report/ReportV2Layout.tsx` — Report tab layout
- `src/components/validator/report/StrategicSummary.tsx` — Strategy tab
- `src/components/validator/v3/DimensionPage.tsx` — Dimension detail pages
- `src/components/lean-canvas/CanvasBox.tsx` — Individual canvas box
- `src/types/validation-report.ts` — Report type definitions
- `src/integrations/supabase/client.ts` — Supabase client singleton

**The build:** Create a unified types module (`src/types/agency.ts`), 7 domain hooks, 14 presentational components, and wire them into 7 existing pages. Every hook follows the React Query pattern (useQuery for reads, useMutation for writes). Every component uses shadcn/ui primitives and checks for field existence before rendering (backward compatibility with pre-agency data). Every page modification is additive — no existing behavior changes.

**Example:** Marcus opens his Investor pipeline. The page loads investors via the existing `useInvestors` hook. For each investor that has been AI-scored, `useMEDDPICC(investorId)` returns the 8-dimension breakdown. The `MEDDPICCScorecard` component renders a radar chart in the investor detail sheet. The `SignalTierBadge` shows "Hot" (green) on the card. The `DealVerdictBadge` shows "Strong Buy". All components render nothing when MEDDPICC data is absent — Marcus's older investors without scores look exactly the same as before.

## Rationale
**Problem:** Agency features exist in edge functions and database columns but have no path to the user's screen. 8 feature prompts (004–011, 013–016, 020) each define their own wiring in isolation, risking inconsistency.
**Solution:** A single infrastructure prompt that documents every hook interface, component prop signature, page integration point, and shared type definition — serving as the implementation blueprint for all agency frontend work.
**Impact:** Implementers have a single source of truth for all agency frontend wiring. Types are centralized. Patterns are consistent. No integration gaps.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Implementer | see all agency hooks in one place | I don't duplicate types or miss integrations |
| Implementer | see exact file paths and interfaces | I implement hooks with consistent patterns |
| Founder | see RICE scores on sprint tasks | I prioritize by impact per effort |
| Founder | see MEDDPICC badges on investors | I focus on highest-probability deals |
| Founder | pick a chat mode | I get specialized AI for my task |
| Founder | see evidence tiers on reports | I know which scores are well-supported |
| Founder | see specificity meters on canvas | I know which boxes need more research |
| Founder | see narrative steps on pitch slides | I understand my deck's persuasion arc |
| Founder | see contextual nudge banners | I stay accountable when momentum drops |

## Goals
1. **Primary:** Every agency feature has a typed hook, presentational component, and page integration
2. **Quality:** All components check for field existence — pre-agency data renders unchanged
3. **Consistency:** All hooks follow React Query pattern (useQuery / useMutation)
4. **Types:** Single `src/types/agency.ts` module exports all agency interfaces

## Acceptance Criteria
- [ ] `src/types/agency.ts` exports all agency interfaces (RICE, MEDDPICC, ChatMode, Nudge, EvidenceTier, Specificity, ChallengerNarrative)
- [ ] 7 hooks created with correct React Query patterns
- [ ] 14 components created using shadcn/ui primitives
- [ ] 7 pages modified with additive-only changes
- [ ] All components guard on field existence (`data?.rice_score && <RICEScoreCard />`)
- [ ] No runtime errors when agency fields are absent (backward compatibility)
- [ ] `npm run build` passes with 0 TypeScript errors
- [ ] `npm run test` passes with no regressions
- [ ] Mobile responsive: components stack vertically on screens < 768px

---

## Section 1: Shared Types Module

### File: `src/types/agency.ts`

All agency-specific interfaces live here. Hooks import from this module. Components import from this module. No inline type definitions in hooks or components.

```typescript
// === Sprint Board (RICE + Kano) ===

export interface RICEScore {
  reach: number;        // 1-10
  impact: number;       // 1-10
  confidence: number;   // 0.0-1.0
  effort: number;       // 1-10 (person-weeks)
  score: number;        // computed: (reach * impact * confidence) / effort
}

export type KanoCategory = 'must_have' | 'performance' | 'delight' | 'indifferent';

export interface KanoClassification {
  category: KanoCategory;
  rationale: string;
}

// === Investor Pipeline (MEDDPICC) ===

export interface MEDDPICCDimension {
  score: number;        // 1-5
  notes: string;
}

export interface MEDDPICCScore {
  metrics: MEDDPICCDimension;
  economic_buyer: MEDDPICCDimension;
  decision_criteria: MEDDPICCDimension;
  decision_process: MEDDPICCDimension;
  paper_process: MEDDPICCDimension;
  identified_pain: MEDDPICCDimension;
  champion: MEDDPICCDimension;
  competition: MEDDPICCDimension;
  total: number;        // 0-40
}

export type DealVerdict = 'strong_buy' | 'buy' | 'hold' | 'pass';
export type SignalTier = 'hot' | 'warm' | 'cold';

export interface InvestorSignalData {
  signal_tier: SignalTier;
  timing_reason: string;
  last_signal_date: string | null;
}

// === AI Chat Modes ===

export type ChatMode = 'general' | 'practice_pitch' | 'growth_strategy' | 'deal_review' | 'canvas_coach';

export interface ChatModeConfig {
  mode: ChatMode;
  label: string;
  description: string;
  icon: string;           // Lucide icon name
  quick_actions: string[];
  system_prompt_key: string;
}

export interface ChatModeSession {
  mode: ChatMode;
  started_at: string;
  message_count: number;
}

export interface PitchScore {
  clarity: number;        // 1-10
  structure: number;      // 1-10
  persuasion: number;     // 1-10
  data_quality: number;   // 1-10
  overall: number;        // 1-10
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface GrowthStrategyResult {
  funnel_stage: 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
  strategy: string;
  channels: string[];
  experiments: string[];
  metrics: string[];
}

// === Behavioral Nudges ===

export interface Nudge {
  id: string;
  trigger_key: string;
  title: string;
  message: string;
  cta_text: string;
  cta_route: string;
  priority: number;       // lower = higher priority
  type: 'progress' | 'suggestion' | 'warning';
}

export type NudgeTrigger =
  | 'empty_canvas_box'
  | 'stale_sprint'
  | 'low_coverage'
  | 'no_validation_run'
  | 'incomplete_profile';

export interface NudgeDismissal {
  trigger_key: string;
  dismissed_at: string;   // ISO timestamp — permanent
}

export interface NudgeSnooze {
  trigger_key: string;
  snoozed_until: string;  // ISO timestamp — 24h TTL
}

// === Evidence Tiers (Validator Report) ===

export type EvidenceTier = 'cited' | 'founder' | 'ai_inferred';

export interface EvidenceTierData {
  tier: EvidenceTier;
  source?: string;        // citation URL or founder claim reference
  confidence: number;     // 0.0-1.0
}

export interface EvidenceTierCounts {
  cited: number;
  founder: number;
  ai_inferred: number;
}

export interface BiasFlag {
  type: string;           // e.g. 'confirmation_bias', 'survivorship_bias'
  dimension: string;      // which report dimension triggered it
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

// === Canvas Specificity ===

export type SpecificityLevel = 'vague' | 'specific' | 'quantified';

export interface CanvasSpecificityScores {
  [boxKey: string]: SpecificityLevel;
}

export interface CanvasEvidenceGaps {
  [boxKey: string]: string[];
}

// === Pitch Deck (Challenger Narrative) ===

export type NarrativeStep =
  | 'warm_up'
  | 'reframe'
  | 'rational_drowning'
  | 'emotional_impact'
  | 'new_way';

export interface WinTheme {
  label: string;
  slide_indexes: number[];
  strength: 'primary' | 'secondary';
}

export interface ChallengerNarrative {
  win_themes: WinTheme[];
  narrative_arc: NarrativeStep[];  // per-slide mapping
  persuasion_techniques: string[]; // per-slide mapping
}

export interface SlideAgencyMetadata {
  win_theme?: string;
  narrative_step?: NarrativeStep;
  persuasion_technique?: string;
}
```

---

## Section 2: Hooks

Each hook follows the existing codebase patterns:
- `useQuery` for reads (with `queryKey` and `enabled` guard)
- `useMutation` with `onSuccess` → `queryClient.invalidateQueries`
- Supabase calls via `supabase.functions.invoke()` or direct table queries
- Error handling via `toast()` from sonner or `useToast` from shadcn

### 2a. `src/hooks/useSprintRICE.ts`

**Consumes:** `sprint_tasks` table columns (`rice_reach`, `rice_impact`, `rice_confidence`, `rice_effort`, `rice_score`, `kano_class`)
**Pattern:** Read from DB via useQuery, update via useMutation
**Used by:** `SprintPlan.tsx`, `RICEScoreCard.tsx`, `KanoBadge.tsx`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RICEScore, KanoCategory } from '@/types/agency';

interface UseSprintRICEReturn {
  riceScore: RICEScore | null;
  kanoCategory: KanoCategory | null;
  isLoading: boolean;
  updateRICE: (scores: Partial<RICEScore>) => void;
  classifyKano: () => void;
}

export function useSprintRICE(taskId: string | undefined): UseSprintRICEReturn
```

**Implementation notes:**
- `useQuery` reads RICE columns from `sprint_tasks` WHERE `id = taskId`
- `updateRICE` mutation writes individual dimension scores + recomputes `rice_score`
- `classifyKano` mutation calls `sprint-agent` EF with action `classify_kano` for AI classification
- Returns `null` for both scores when columns are absent (backward compat)
- Query key: `['sprint-rice', taskId]`

### 2b. `src/hooks/useMEDDPICC.ts`

**Consumes:** `investors` table columns (`meddpicc_scores`, `deal_verdict`, `signal_tier`, `signal_data`)
**Pattern:** Read JSONB from DB, mutation calls `investor-agent` EF
**Used by:** `Investors.tsx`, `MEDDPICCScorecard.tsx`, `SignalTierBadge.tsx`, `DealVerdictBadge.tsx`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MEDDPICCScore, DealVerdict, SignalTier, InvestorSignalData } from '@/types/agency';

interface UseMEDDPICCReturn {
  score: MEDDPICCScore | null;
  verdict: DealVerdict | null;
  signalTier: SignalTier | null;
  signalData: InvestorSignalData | null;
  isLoading: boolean;
  isScoring: boolean;
  scoreDeal: () => void;
  updateDimension: (dimension: string, score: number, notes: string) => void;
}

export function useMEDDPICC(investorId: string | undefined): UseMEDDPICCReturn
```

**Implementation notes:**
- `useQuery` reads `meddpicc_scores` JSONB + `deal_verdict` + `signal_tier` from `investors` WHERE `id = investorId`
- `scoreDeal` mutation calls `investor-agent` with action `score_deal`, includes `loadFragment` output from EF side
- `updateDimension` writes individual dimension to JSONB, recalculates total, re-derives verdict client-side
- Verdict thresholds: 32+ = `strong_buy`, 24+ = `buy`, 16+ = `hold`, <16 = `pass`
- Query key: `['meddpicc', investorId]`

### 2c. `src/hooks/useChatModes.ts`

**Consumes:** In-memory state (no DB persistence in MVP — task 012 adds persistence later)
**Pattern:** useState for mode, sends `mode` param to `ai-chat` EF
**Used by:** `AIChat.tsx`, `ChatModeSelector.tsx`, `ChatModePill.tsx`, `ChatModeQuickActions.tsx`

```typescript
import { useState, useCallback } from 'react';
import type { ChatMode, ChatModeConfig, ChatModeSession, PitchScore, GrowthStrategyResult } from '@/types/agency';

interface UseChatModesReturn {
  currentMode: ChatMode;
  modeConfig: ChatModeConfig;
  modeSession: ChatModeSession;
  setMode: (mode: ChatMode) => void;
  resetMode: () => void;
  allModes: ChatModeConfig[];
}

export function useChatModes(): UseChatModesReturn
```

**Implementation notes:**
- `allModes` is a static array of 5 `ChatModeConfig` objects with labels, icons, descriptions, and quick actions
- `setMode` updates state and resets `modeSession.message_count` to 0
- `resetMode` returns to `'general'` mode
- Mode persists in component state only (not localStorage — task 012 adds DB persistence)
- Mode-specific quick actions defined per config:
  - `general`: "Explain my dashboard", "What should I focus on?", "Help me plan"
  - `practice_pitch`: "Score my pitch", "Common objections", "Improve my ask"
  - `growth_strategy`: "Plan user acquisition", "Design an experiment", "Analyze my funnel"
  - `deal_review`: "Score this investor", "Prepare for meeting", "Analyze term sheet"
  - `canvas_coach`: "Validate my canvas", "Strengthen weak boxes", "Find evidence gaps"

### 2d. `src/hooks/useBehavioralNudges.ts`

**Consumes:** localStorage for dismiss/snooze state, queries various tables for trigger conditions
**Pattern:** useQuery for trigger evaluation, localStorage for persistence
**Used by:** `DashboardLayout.tsx`, `NudgeBanner.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import type { Nudge, NudgeTrigger } from '@/types/agency';

interface UseBehavioralNudgesReturn {
  activeNudges: Nudge[];
  isLoading: boolean;
  dismissNudge: (triggerId: string) => void;
  snoozeNudge: (triggerId: string) => void;
}

export function useBehavioralNudges(startupId: string | undefined): UseBehavioralNudgesReturn
```

**Implementation notes:**
- Evaluates 5 trigger conditions on mount via parallel Supabase queries:
  1. `empty_canvas_box` — lean_canvases has boxes with empty content
  2. `stale_sprint` — sprint_tasks with no status change in 7+ days
  3. `low_coverage` — validation_sessions with coverage < 50%
  4. `no_validation_run` — zero validation_sessions for this startup
  5. `incomplete_profile` — startups profile_strength < 80%
- Checks localStorage for dismissed triggers (permanent) and snoozed triggers (24h TTL check)
- Returns filtered `activeNudges` sorted by priority (ascending)
- `dismissNudge` writes `{ trigger_key, dismissed_at }` to localStorage
- `snoozeNudge` writes `{ trigger_key, snoozed_until: now + 24h }` to localStorage
- Query key: `['nudges', startupId]`, `staleTime: 5 * 60 * 1000` (5 min — nudges don't need real-time updates)

### 2e. `src/hooks/useEvidenceTiers.ts`

**Consumes:** `validator_reports` table, `details` JSONB field (dimensions with `evidence_tier` sub-fields)
**Pattern:** useQuery reads report, derives tier counts client-side
**Used by:** `ValidatorReport.tsx`, `EvidenceTierBadge.tsx`, `BiasFlag.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import type { EvidenceTierCounts, EvidenceTierData, BiasFlag } from '@/types/agency';

interface UseEvidenceTiersReturn {
  tiers: Record<string, EvidenceTierData> | null;    // per-dimension
  tierCounts: EvidenceTierCounts;
  biasFlags: BiasFlag[];
  isLoading: boolean;
}

export function useEvidenceTiers(reportId: string | undefined): UseEvidenceTiersReturn
```

**Implementation notes:**
- `useQuery` reads `validator_reports` WHERE `id = reportId`, extracts `details.dimensions`
- Iterates dimensions to collect `evidence_tier` fields (added by task 002)
- Derives `tierCounts` by counting occurrences of each tier type
- Extracts `biasFlags` from `details.bias_flags` array (added by task 002)
- Returns empty counts `{ cited: 0, founder: 0, ai_inferred: 0 }` and `[]` biasFlags when fields absent
- Query key: `['evidence-tiers', reportId]`

### 2f. `src/hooks/useCanvasSpecificity.ts`

**Consumes:** `lean-canvas-agent` EF coach action response (specificity_scores, evidence_gaps)
**Pattern:** State from last coach response, refresh on demand
**Used by:** `LeanCanvas.tsx`, `SpecificityScoreBar.tsx`

```typescript
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CanvasSpecificityScores, CanvasEvidenceGaps, SpecificityLevel } from '@/types/agency';

interface UseCanvasSpecificityReturn {
  scores: CanvasSpecificityScores | null;
  evidenceGaps: CanvasEvidenceGaps | null;
  isEvaluating: boolean;
  evaluateSpecificity: () => void;
}

export function useCanvasSpecificity(canvasId: string | undefined, canvasData: Record<string, unknown> | null): UseCanvasSpecificityReturn
```

**Implementation notes:**
- `evaluateSpecificity` calls `lean-canvas-agent` with action `coach` and reads optional `specificity_scores` + `evidence_gaps` from response
- Scores stored in useState (no DB column — derived on demand from coach response)
- Returns `null` when not yet evaluated or when canvas has no data
- Auto-evaluates on mount if canvasData is non-empty (useEffect with canvasId dependency)

### 2g. `src/hooks/useChallengerNarrative.ts`

**Consumes:** `pitch_decks` table, `deck_json` JSONB field (slides with optional agency metadata)
**Pattern:** useQuery reads deck, extracts agency fields client-side
**Used by:** `PitchDeckEditor.tsx`, `WinThemeCard.tsx`, `ChallengerNarrativeView.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import type { WinTheme, NarrativeStep, ChallengerNarrative, SlideAgencyMetadata } from '@/types/agency';

interface UseChallengerNarrativeReturn {
  winThemes: WinTheme[];
  narrativeArc: NarrativeStep[];
  slideMetadata: SlideAgencyMetadata[];
  isLoading: boolean;
}

export function useChallengerNarrative(deckId: string | undefined): UseChallengerNarrativeReturn
```

**Implementation notes:**
- `useQuery` reads `pitch_decks` WHERE `id = deckId`, extracts `deck_json.slides`
- Iterates slides to collect `win_theme`, `narrative_step`, `persuasion_technique` per slide
- Groups win themes by label, computes `slide_indexes` for each theme
- Returns empty arrays when agency fields absent (backward compat)
- Query key: `['challenger-narrative', deckId]`

---

## Section 3: Components

All components use shadcn/ui primitives (`Badge`, `Card`, `Alert`, `Tooltip`, `Progress`). All check for data existence before rendering. All are responsive (stack on mobile).

### 3a. Sprint Board Components

**`src/components/sprint/RICEScoreCard.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `score` | `RICEScore \| null` | RICE breakdown — renders nothing when null |

- Renders a compact card with 4 mini bars (Reach, Impact, Confidence, Effort) and a bold total score
- Uses shadcn `Card` + `Progress` components
- Color coding: score >= 70 green, >= 40 amber, < 40 red
- Tooltip shows the formula: (R x I x C) / E

**`src/components/sprint/KanoBadge.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `category` | `KanoCategory \| null` | Kano class — renders nothing when null |

- Renders a shadcn `Badge` with color + icon:
  - `must_have`: red, ShieldCheck icon
  - `performance`: blue, TrendingUp icon
  - `delight`: purple, Sparkles icon
  - `indifferent`: grey, Minus icon

### 3b. Investor Pipeline Components

**`src/components/investors/MEDDPICCScorecard.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `score` | `MEDDPICCScore \| null` | 8-dimension breakdown — renders nothing when null |

- Renders a radar/spider chart of 8 dimensions (each 0-5 scale)
- Total score shown as large number with /40 denominator
- Each dimension clickable to show notes
- Uses `recharts` RadarChart (already in project dependencies)
- Falls back to horizontal bar list if recharts is not available

**`src/components/investors/SignalTierBadge.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `tier` | `SignalTier \| null` | Hot/warm/cold — renders nothing when null |
| `reason` | `string \| undefined` | Tooltip text explaining the signal |

- Renders a colored dot with label:
  - `hot`: green dot + "Hot" text
  - `warm`: amber dot + "Warm" text
  - `cold`: grey dot + "Cold" text
- Tooltip shows timing reason on hover

**`src/components/investors/DealVerdictBadge.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `verdict` | `DealVerdict \| null` | Verdict — renders nothing when null |

- Renders a shadcn `Badge` with variant:
  - `strong_buy`: green, "Strong Buy"
  - `buy`: blue, "Buy"
  - `hold`: amber, "Hold"
  - `pass`: red, "Pass"

### 3c. Chat Mode Components

**`src/components/chat/ChatModeSelector.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `modes` | `ChatModeConfig[]` | Available modes |
| `onSelect` | `(mode: ChatMode) => void` | Mode selection handler |

- Renders 4-5 cards in a 2x2 grid (mobile: single column)
- Each card has: icon, label, description, 2-3 quick action preview pills
- Uses shadcn `Card` with hover state
- Shown before first message in a conversation

**`src/components/chat/PracticePitchScore.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `score` | `PitchScore \| null` | Scoring rubric — renders nothing when null |

- Right panel component for Practice Pitch mode
- 5 dimension bars (clarity, structure, persuasion, data quality, overall)
- Strengths as green checkmark list, improvements as amber list
- Overall score as large centered number /10

**`src/components/chat/GrowthStrategyPanel.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `result` | `GrowthStrategyResult \| null` | Strategy — renders nothing when null |

- Right panel component for Growth Strategy mode
- AARRR funnel visualization (5 colored bars)
- Channels as pills, experiments as numbered list
- Key metrics highlighted

### 3d. Nudge Components

**`src/components/nudge/NudgeBanner.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `nudge` | `Nudge` | Nudge data |
| `onDismiss` | `() => void` | Permanent dismiss handler |
| `onSnooze` | `() => void` | 24h snooze handler |

- Renders a horizontal banner at the top of page content (below header, above main content)
- 3 visual styles:
  - `progress`: green left border, CheckCircle icon
  - `suggestion`: blue left border, Lightbulb icon
  - `warning`: amber left border, AlertTriangle icon
- CTA button navigates to `nudge.cta_route`
- X button triggers `onDismiss`, clock icon triggers `onSnooze`
- Animates in with fade-down (Tailwind `animate-in fade-in slide-in-from-top-2`)

### 3e. Report Components

**`src/components/report/EvidenceTierBadge.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `tier` | `EvidenceTier \| null` | Tier — renders nothing when null |
| `source` | `string \| undefined` | Citation source for tooltip |

- Small pill badge:
  - `cited`: green, BookOpen icon, "Cited"
  - `founder`: blue, User icon, "Founder"
  - `ai_inferred`: grey, Bot icon, "AI"
- Tooltip shows source when available

**`src/components/report/BiasFlag.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `flag` | `BiasFlag \| null` | Bias flag — renders nothing when null |

- Renders an amber shadcn `Alert` with AlertTriangle icon
- Shows bias type as bold label, explanation as body text
- Severity shown as small badge within the alert (low/medium/high)

### 3f. Canvas Components

**`src/components/canvas/SpecificityScoreBar.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `level` | `SpecificityLevel \| null` | Specificity — renders nothing when null |
| `gaps` | `string[]` | Evidence gaps for this box |

- Renders a thin horizontal bar in the canvas box header:
  - `vague`: red bar, 33% width
  - `specific`: amber bar, 66% width
  - `quantified`: green bar, 100% width
- Below bar: evidence gap pills (small amber pills with gap text)
- No bar rendered when `level` is null (backward compat)

### 3g. Pitch Deck Components

**`src/components/deck/WinThemeCard.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `WinTheme` | Win theme data |

- Compact card showing theme label with strength indicator (primary = bold, secondary = regular)
- Slide count badge: "Slides 1, 3, 7"
- Uses shadcn `Card` with colored left border (primary = green, secondary = blue)

**`src/components/deck/ChallengerNarrativeView.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `arc` | `NarrativeStep[]` | Per-slide narrative steps |
| `slideCount` | `number` | Total slides |

- Vertical stepper showing 5 Challenger steps with slide count per step
- Each step: icon, label, slide range (e.g., "Slides 3-4")
- Active/completed/upcoming visual states
- Uses shadcn layout primitives (no external stepper library)
- Steps: Warm-up (HandHeart), Reframe (RefreshCw), Rational Drowning (TrendingDown), Emotional Impact (Heart), New Way (Lightbulb)

---

## Section 4: Page Modifications

Each modification is additive — existing rendering logic untouched. New components conditionally render based on data presence.

### 4a. `src/pages/SprintPlan.tsx`

**What changes:**
- Import `useSprintRICE` hook (per task card)
- Import `RICEScoreCard`, `KanoBadge` components
- Add RICE score to each task card in Kanban view (below title, above success_criteria)
- Add Kano badge next to priority badge on task card
- Add Kano filter tabs above Kanban board: All | Must-have | Performance | Delight
- Add sort toggle: "Sort by RICE" (descending score order)

**Guard:** `task.rice_score && <RICEScoreCard score={task.rice_score} />`

### 4b. `src/pages/Investors.tsx`

**What changes:**
- Import `useMEDDPICC` hook (per investor)
- Import `MEDDPICCScorecard`, `SignalTierBadge`, `DealVerdictBadge` components
- Add MEDDPICC score badge on investor cards (next to check_size)
- Add deal verdict badge on investor cards
- Add signal tier dot on investor cards
- Add "Score" button on investor detail sheet to trigger `scoreDeal()`
- Add MEDDPICC tab in investor detail sheet with full scorecard

**Guard:** `investor.meddpicc_scores && <DealVerdictBadge verdict={investor.deal_verdict} />`

### 4c. `src/pages/AIChat.tsx`

**What changes:**
- Import `useChatModes` hook
- Import `ChatModeSelector`, `PracticePitchScore`, `GrowthStrategyPanel` components
- Show `ChatModeSelector` when no messages exist (replaces empty state)
- Show mode pill in chat header via existing layout
- Send `mode` parameter with each message to `ai-chat` EF
- Show mode-specific right panel (PracticePitchScore or GrowthStrategyPanel) based on active mode
- "Switch mode" button in header resets to selector view

**Guard:** Mode selector shown only when `messages.length === 0`

### 4d. `src/pages/ValidatorReport.tsx` + `ReportV2Layout.tsx` + `DimensionPage.tsx`

**What changes:**
- Import `useEvidenceTiers` hook
- Import `EvidenceTierBadge`, `BiasFlag` components
- Add evidence tier badge next to each dimension score in `DimensionPage.tsx`
- Add bias flag alerts below executive summary in `ReportV2Layout.tsx`
- Add tier counts summary in report header (e.g., "5 Cited, 2 Founder, 2 AI")

**Guard:** `tiers?.[dimensionKey] && <EvidenceTierBadge tier={tiers[dimensionKey].tier} />`

### 4e. `src/pages/LeanCanvas.tsx` + `CanvasBox.tsx`

**What changes:**
- Import `useCanvasSpecificity` hook
- Import `SpecificityScoreBar` component
- Add specificity bar to each `CanvasBox` header
- Add evidence gap pills below box content
- Add "Evaluate specificity" button in canvas toolbar (triggers `evaluateSpecificity()`)

**Guard:** `scores?.[boxKey] && <SpecificityScoreBar level={scores[boxKey]} gaps={evidenceGaps?.[boxKey] || []} />`

### 4f. `src/pages/PitchDeckEditor.tsx`

**What changes:**
- Import `useChallengerNarrative` hook
- Import `WinThemeCard`, `ChallengerNarrativeView` components
- Add win theme label above each slide in the editor
- Add narrative step badge on slide thumbnails in the sidebar
- Add persuasion technique as tooltip on slide
- Add Challenger narrative stepper in editor sidebar (below slide list)

**Guard:** `slideMetadata?.[index]?.narrative_step && <Badge>{slideMetadata[index].narrative_step}</Badge>`

### 4g. `src/components/layout/DashboardLayout.tsx`

**What changes:**
- Import `useBehavioralNudges` hook
- Import `NudgeBanner` component
- Add nudge banner slot between header and main content area
- Render highest-priority active nudge (one at a time, not stacked)
- Pass `dismissNudge` and `snoozeNudge` handlers to banner

**Guard:** `activeNudges.length > 0 && <NudgeBanner nudge={activeNudges[0]} ... />`

---

## Section 5: Wiring Plan

| Layer | File | Action | Source Task |
|-------|------|--------|-------------|
| Types | `src/types/agency.ts` | **Create** — all agency interfaces | 108-INF |
| Hook | `src/hooks/useSprintRICE.ts` | **Create** — RICE scoring hook | 005 |
| Hook | `src/hooks/useMEDDPICC.ts` | **Create** — MEDDPICC scoring hook | 007 |
| Hook | `src/hooks/useChatModes.ts` | **Create** — Chat mode management | 010, 011 |
| Hook | `src/hooks/useBehavioralNudges.ts` | **Create** — Nudge display + dismiss | 015 |
| Hook | `src/hooks/useEvidenceTiers.ts` | **Create** — Evidence tier display | 004 |
| Hook | `src/hooks/useCanvasSpecificity.ts` | **Create** — Canvas specificity | 009 |
| Hook | `src/hooks/useChallengerNarrative.ts` | **Create** — Pitch deck narrative | 008 |
| Component | `src/components/sprint/RICEScoreCard.tsx` | **Create** | 005 |
| Component | `src/components/sprint/KanoBadge.tsx` | **Create** | 005 |
| Component | `src/components/investors/MEDDPICCScorecard.tsx` | **Create** | 007, 020 |
| Component | `src/components/investors/SignalTierBadge.tsx` | **Create** | 007 |
| Component | `src/components/investors/DealVerdictBadge.tsx` | **Create** | 007 |
| Component | `src/components/chat/ChatModeSelector.tsx` | **Create** | 011 |
| Component | `src/components/chat/PracticePitchScore.tsx` | **Create** | 013 |
| Component | `src/components/chat/GrowthStrategyPanel.tsx` | **Create** | 014 |
| Component | `src/components/nudge/NudgeBanner.tsx` | **Create** | 015 |
| Component | `src/components/report/EvidenceTierBadge.tsx` | **Create** | 004 |
| Component | `src/components/report/BiasFlag.tsx` | **Create** | 004 |
| Component | `src/components/canvas/SpecificityScoreBar.tsx` | **Create** | 009 |
| Component | `src/components/deck/WinThemeCard.tsx` | **Create** | 008 |
| Component | `src/components/deck/ChallengerNarrativeView.tsx` | **Create** | 008 |
| Page | `src/pages/SprintPlan.tsx` | **Modify** — RICE + Kano | 005 |
| Page | `src/pages/Investors.tsx` | **Modify** — MEDDPICC badges | 007 |
| Page | `src/pages/AIChat.tsx` | **Modify** — mode selector + panels | 011 |
| Page | `src/pages/ValidatorReport.tsx` | **Modify** — evidence tiers | 004 |
| Layout | `src/components/validator/report/ReportV2Layout.tsx` | **Modify** — bias flags | 004 |
| Layout | `src/components/validator/v3/DimensionPage.tsx` | **Modify** — evidence badge | 004 |
| Page | `src/pages/LeanCanvas.tsx` | **Modify** — specificity bars | 009 |
| Component | `src/components/lean-canvas/CanvasBox.tsx` | **Modify** — specificity + gaps | 009 |
| Page | `src/pages/PitchDeckEditor.tsx` | **Modify** — narrative + themes | 008 |
| Layout | `src/components/layout/DashboardLayout.tsx` | **Modify** — nudge banner slot | 015 |

**Total: 1 types file + 7 hooks + 14 components + 7 page/layout modifications = 29 files**

---

## Section 6: Research Before Implementation

Before writing any code, read these existing files to follow established patterns:

| Read This | To Learn |
|-----------|----------|
| `src/hooks/useSprintAgent.ts` | React Query pattern for sprint hooks |
| `src/hooks/useInvestorAgent.ts` | Mutation pattern for EF calls + TypeScript interfaces |
| `src/hooks/useStrategicSummary.ts` | Client-side derivation hook pattern (no EF call) |
| `src/hooks/useLeanCanvas.ts` | Canvas hook patterns, query keys |
| `src/hooks/useBehavioralNudges.ts` pattern in `useDashboardMetrics.ts` | Parallel Supabase queries |
| `src/components/validator/v3/SubScoreBar.tsx` | Animated bar component pattern |
| `src/components/validator/report/EvidenceTierBadge.tsx` pattern in existing Badge usage | shadcn Badge pattern |
| `src/types/validation-report.ts` | Type organization pattern for report types |
| `src/components/lean-canvas/CanvasBox.tsx` | Canvas box component structure |
| `src/pages/PitchDeckEditor.tsx` | Slide editor structure and thumbnail list |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Sprint task has no `rice_score` column | `RICEScoreCard` renders nothing, task card shows as before |
| Investor has no `meddpicc_scores` JSONB | No badge, no verdict pill, no signal dot — card unchanged |
| Chat mode set but EF doesn't support modes yet | Falls back to `general` mode silently (no error) |
| All nudge triggers are dismissed | No banner rendered, no layout shift |
| Nudge snooze expires mid-session | Banner reappears on next page load (not real-time) |
| Report has `evidence_tiers` for some dimensions but not all | Badge renders only for dimensions that have tier data |
| Canvas specificity evaluation returns error | `scores` stays null, no meters shown, toast error |
| Pitch deck has no agency metadata on slides | No win theme labels, no narrative badges — editor unchanged |
| Investor has partial MEDDPICC (3 of 8 dimensions scored) | Radar chart shows scored dimensions, others at 0 |
| Browser localStorage is full | Nudge dismiss/snooze fails silently, nudges keep showing |
| Mobile viewport (< 768px) | All components stack vertically, radar chart collapses to bar list |

---

## Real-World Examples

**Scenario 1 — Full agency experience (happy path):** Aisha logs into her dashboard. A blue nudge banner says "Your canvas has 2 empty boxes — fill in Revenue Streams and Key Metrics" with a CTA button. She navigates to the Sprint Board and sees 24 tasks with RICE scores. The "Must-have" tab shows 8 high-priority tasks. She switches to Investors and sees 3 scored investors: Sequoia (31/40, "Buy", green dot), a16z (26/40, "Buy", amber dot), Regional VC (12/40, "Pass", grey dot). She opens AI Chat, picks "Practice Pitch" mode, pastes her pitch, and gets a 7.4/10 score with specific improvement suggestions. **With the agency frontend wiring,** every AI-computed insight surfaces exactly where she needs it.

**Scenario 2 — Pre-agency data (backward compatibility):** Jake created his startup profile 3 months ago before the agency enhancement. He opens his Sprint Board — tasks show titles and priorities but no RICE badges (data doesn't exist). He opens Investors — cards show name and check size but no MEDDPICC scores. He opens his validation report — all sections render as before, no evidence tier badges (pre-agency report). **With existence guards on every component,** Jake's experience is identical to before. No empty badges, no layout shifts, no errors.

**Scenario 3 — Progressive enhancement:** Priya runs a new validation after the agency update. Her report now shows green "Cited" badges on Market and Competition dimensions (backed by Google Search data) and grey "AI" badges on Problem and Customer (no independent verification). An amber bias flag appears: "Confirmation bias — traction claims not independently verified." She clicks through to her Lean Canvas where specificity meters show 3 boxes as "Vague" (red), 4 as "Specific" (amber), and 2 as "Quantified" (green). **With progressive enhancement,** agency features appear automatically on new data without requiring any user action.

---

## Outcomes

| Before | After |
|--------|-------|
| Agency features computed by EFs but invisible to users | 7 hooks + 14 components surface every insight in the UI |
| Each feature prompt defines types inline | Single `src/types/agency.ts` module with all interfaces |
| No consistency guarantee across agency hooks | All hooks follow React Query pattern with identical conventions |
| Pre-agency data could crash on missing fields | Every component guards on field existence — zero errors on old data |
| No clear implementation order for frontend work | Wiring plan lists all 29 files with layer, path, action, and source task |
| Sprint tasks show no prioritization data | RICE scores + Kano badges on every task card |
| Investor cards show name and check size only | MEDDPICC score /40 + verdict pill + signal dot |
| Chat is one generic conversation | 5 selectable modes with mode-specific panels and quick actions |
| No proactive engagement prompts | 5 trigger-based contextual nudge banners |
| Report scores have no evidence transparency | Green/blue/grey evidence tier badges + bias flag alerts |
| Canvas boxes all look the same | Red/amber/green specificity meters + evidence gap pills |
| Pitch slides are a flat numbered list | Win theme labels + Challenger narrative stepper |

---

## Cross References

| Document | Path | Relevance |
|----------|------|-----------|
| Feature Prompts Index | `agency/prompts/000-index.md` | Lists all 24 feature tasks this prompt supports |
| Infrastructure Index | `agency/prompts/100-index.md` | Dependency graph (108 depends on 104, 105) |
| Sprint RICE/Kano | `agency/prompts/005-sprint-board-rice-kano.md` | Sprint board feature spec |
| Investor MEDDPICC Wiring | `agency/prompts/007-investor-meddpicc-wiring.md` | Investor scoring feature spec |
| Pitch Deck Challenger | `agency/prompts/008-pitch-deck-challenger.md` | Deck narrative feature spec |
| Canvas Specificity | `agency/prompts/009-lean-canvas-specificity.md` | Canvas meters feature spec |
| Chat Modes Frontend | `agency/prompts/011-chat-modes-frontend.md` | Chat mode UI spec |
| Practice Pitch Panel | `agency/prompts/013-practice-pitch-panel.md` | Pitch scoring right panel |
| Growth Strategy Panel | `agency/prompts/014-growth-strategy-panel.md` | Growth strategy right panel |
| Behavioral Nudges | `agency/prompts/015-behavioral-nudge-system.md` | Nudge trigger conditions |
| Report UI Badges | `agency/prompts/004-report-ui-agency-badges.md` | Evidence tier + bias UI |
| MEDDPICC Detail Sheet | `agency/prompts/020-meddpicc-detail-sheet.md` | Full scorecard layout |
| Backward Compatibility | `agency/prompts/021-backward-compatibility.md` | Existence guard rules |
| Agency Test Suite | `agency/prompts/022-agency-test-suite.md` | Test coverage for all hooks |
| Existing Report Types | `src/types/validation-report.ts` | Pattern for types module |
| Existing Sprint Hook | `src/hooks/useSprintAgent.ts` | Pattern for React Query hooks |
| Existing Investor Hook | `src/hooks/useInvestorAgent.ts` | Pattern for EF mutation hooks |
| Task Template | `tasks/TASK-TEMPLATE.md` v4.0 | Template this prompt follows |
