# Dashboard Redesign: Focus + Expand

## Context

The current Dashboard (`src/pages/Dashboard.tsx`) renders **12 sections showing ~101 data points** in a single vertical scroll. Founders are overwhelmed. The AI panel already handles deep Q&A, so the dashboard should drive action, not display everything.

**Approach:** "Focus + Expand" — 3 zones with ~25 data points visible by default. Everything else is one click away via collapsible accordion.

```
┌─────────────────────────────────────────────────────┐
│  ZONE 1: Hero Status                                │
│  Score: 76/100  Stage: Validate  Industry: Market   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░  +3 ▲              │
├─────────────────────────────────────────────────────┤
│  ZONE 2: Today's Focus                              │
│  ① Complete Lean Canvas         [5 min]  [Start →]  │
│  ② Review your #1 risk          [2 min]  [View →]   │
│  ③ Add traction metrics          [10 min] [Add →]   │
├─────────────────────────────────────────────────────┤
│  ZONE 3: Quick Glance (all collapsed)               │
│  [▶ Risks (2)]  [▶ Health]  [▶ Feed]               │
└─────────────────────────────────────────────────────┘
```

**Data reduction:** 101 → ~25 visible data points. Zero scrolling on desktop.

---

## What Changes

### Removed entirely (dead/redundant):
| Component | Why |
|-----------|-----|
| `InsightsTabs` | Hardcoded static data, not wired to anything |
| `FundraisingReadiness` | Duplicates health score investor readiness |
| `ModuleProgress` | Sidebar already links to these pages |
| `QuickActions` | Sidebar already provides these nav links |
| `SummaryMetrics` | Counts are low-priority; available in Analytics |
| `JourneyStepper` | Replaced by inline stage badge in Hero |
| Dead `rightPanel` variable | 5 components built but never rendered |
| Search bar, bell, gear icons | Available via sidebar and global nav |

### Kept (conditional):
- `WelcomeBanner` — first-visit only (no change)
- `Day1PlanCard` — guided mode only (no change)

### Collapsed into Quick Glance accordion:
- `TopRisks` content → "Risks" section
- `StartupHealthEnhanced` breakdown bars → "Health" section
- `RecentActivity` (limit 5) → "Feed" section

---

## Implementation Tasks

### Task 1: `HeroStatus` Component (Zone 1)

**Create:** `src/components/dashboard/HeroStatus.tsx`

```typescript
interface HeroStatusProps {
  startupName: string;
  greeting: string;              // "Good afternoon"
  healthScore: number | null;    // useHealthScore().overall
  healthTrend: number | null;    // useHealthScore().trend
  journeyStep: JourneyStep;     // useJourneyStage().currentStep
  journeyPercent: number;        // useJourneyStage().percentComplete
  industry: string | null;
  stage: string | null;
  isLoading: boolean;
}
```

**Structure:**
- Compact card with greeting + startup name
- 48px SVG score ring (reuse circumference pattern from `StartupHealthEnhanced.tsx` lines 87-118)
- Trend badge (+3 ▲) with TrendingUp/Down icon (pattern from `StartupHealthEnhanced.tsx` lines 67-72)
- Journey stage badge + mini progress bar (shadcn `Progress`)
- Industry + stage tags as `Badge` components
- Skeleton loading state

**Data sources:** `useHealthScore`, `useJourneyStage`, `startup` object

---

### Task 2: `FocusActions` Component (Zone 2)

**Create:** `src/components/dashboard/FocusActions.tsx`

```typescript
interface FocusActionsProps {
  startupId: string | undefined;
  fallbackActions?: RecommendedAction[];
  fallbackLoading?: boolean;
}
```

**Dual-source strategy:**
1. Primary: `useDailyFocus(startupId)` — richer scoring, 18h cache, complete/skip actions
2. Fallback: `useActionRecommender` actions via props — rule-based, simpler

**Structure:**
- Header: "Today's Focus" + action count badge
- If dailyFocus exists: Primary action card with expected outcome
- 3 numbered `ActionCard` sub-components:
  - Number badge, title, impact badge, reason text, time estimate, CTA button
- Complete/skip mutations from `useDailyFocus.ts` for primary action
- Reuse `EFFORT_LABELS` / `IMPACT_COLORS` from `TodaysFocus.tsx` lines 28-38
- Follow `TodaysFocusCard.tsx` pattern (lines 186-221) for complete/skip UX

**Data sources:** `useDailyFocus`, `useActionRecommender` (fallback)

---

### Task 3: `QuickGlance` Component (Zone 3)

**Create:** `src/components/dashboard/QuickGlance.tsx`

```typescript
interface QuickGlanceProps {
  risks: Risk[];
  healthScore: HealthScore | undefined;
  healthLoading: boolean;
  startupId: string | undefined;
}
```

**Structure:** shadcn `Accordion` (`type="multiple"`, no `defaultValue` = all collapsed)

| Section | Trigger | Content |
|---------|---------|---------|
| Risks | `ShieldAlert` icon + "Risks" + count badge | Risk list extracted from `TopRisks.tsx` lines 42-58 |
| Health | `Activity` icon + "Health" + score badge | 6 category bars from `StartupHealthEnhanced.tsx` lines 123-139 |
| Feed | `Clock` icon + "Recent Activity" | `RecentActivity` component with `limit={5}` |

**Internal sub-components:**
- `RisksList` — risk items without card wrapper
- `HealthBars` — 6 progress bars without the ring or AI tip

**Data sources:** `useTopRisks` (passed), `useHealthScore` (passed), `RecentActivity` (internal query)

---

### Task 4: `useDashboardAIContext` Hook

**Create:** `src/hooks/useDashboardAIContext.ts`

**Pattern:** Follow `src/hooks/useReportAIContext.ts` (route-based context detection)

```typescript
export interface DashboardAIContext {
  isOnDashboard: boolean;
  quickActions: QuickAction[];
  contextSummary: {
    healthScore: number | null;
    healthTrend: number | null;
    topRisks: string[];
    currentStage: string | null;
    journeyPercent: number;
  } | null;
}
```

**4 dashboard-specific AI quick action prompts:**

| Chip Label | Prompt |
|------------|--------|
| My startup status | "Summarize my startup health score, top risks, and current stage. What should I focus on today?" |
| Prioritize my tasks | "Based on my health score breakdown and risks, rank my most impactful next tasks." |
| Suggest next steps | "What are the 3 most important actions I should take this week to improve my startup health?" |
| Weekly insights | "Give me a weekly digest: key changes in my health score, completed tasks, and what to watch for." |

---

### Task 5: Wire AI Dashboard Context

**Modify 3 files:**

#### 5a. `src/providers/AIAssistantProvider.tsx`
- Add `dashboardContext: DashboardContextData | null` to state
- Add `SET_DASHBOARD_CONTEXT` reducer action (follow `SET_REPORT_CONTEXT` pattern at line 84)
- Route-watching `useEffect`: dispatch context when `pathname === '/dashboard'`, clear on other routes
- Include `dashboard_context` in `context.data` of `ai-chat` request (line 317)

#### 5b. `src/components/ai/AIPanel.tsx`
- Import `useDashboardAIContext`
- Add priority chain: dimension context > dashboard context > default
```typescript
const effectiveQuickActions = isOnDimension
  ? reportAI.quickActions
  : isOnDashboard
    ? dashboardAI.quickActions
    : quickActions;
```

#### 5c. `supabase/functions/ai-chat/index.ts`
- In `buildSystemPrompt()`, detect `context.screen === '/dashboard'`
- Inject dashboard context into system prompt:
```
DASHBOARD CONTEXT:
Health Score: 76/100 (trend: +3)
Stage: Validate (17% journey complete)
Top Risks: No traction data; Burn rate exceeds runway
```

---

### Task 6: Rewrite `Dashboard.tsx`

**Modify:** `src/pages/Dashboard.tsx`

**Feature flag for safe migration:**
```typescript
const ENABLE_FOCUS_EXPAND = true;
```

**Remove imports:** `QuickActions`, `SummaryMetrics`, `InsightsTabs`, `FundraisingReadiness`, `ModuleProgress`, `CompletionUnlocks`, `TodaysFocus`, `JourneyStepper`, `IndustryBenchmarks`, `AIStrategicReview`, `EventCard`, `DashboardCalendar`, `StageGuidanceCard`

**Remove:** Dead `rightPanel` variable (lines 143-168), search/bell/gear header icons

**Add imports:** `HeroStatus`, `FocusActions`, `QuickGlance`

**New render:**
```tsx
<DashboardLayout>
  <div className="max-w-3xl space-y-6">
    <HeroStatus ... />
    {isFirstVisit && <WelcomeBanner ... />}
    {isGuidedMode && <Day1PlanCard ... />}
    <FocusActions ... />
    <QuickGlance ... />
  </div>
</DashboardLayout>
```

**Keep hooks:** `useStartup`, `useHealthScore`, `useActionRecommender`, `useTopRisks`, `useJourneyStage`, `useModuleProgress` (for journey input), `useFirstVisit`

**Remove hook calls:** `useCompletionUnlocks`, `useMetricChanges`

---

### Task 7: Tests

**Unit tests (4 files):**

| Test File | Key Assertions |
|-----------|---------------|
| `HeroStatus.test.tsx` | Renders score ring, trend, stage badge, tags; loading skeleton |
| `FocusActions.test.tsx` | Shows 3 numbered actions; falls back to recommender; complete/skip work |
| `QuickGlance.test.tsx` | All sections collapsed by default; expand shows content; risk count badge |
| `useDashboardAIContext.test.ts` | Returns `isOnDashboard: true` on `/dashboard`; 4 quick actions; context summary |

**Integration test:**

| Test File | Key Assertions |
|-----------|---------------|
| `Dashboard.test.tsx` (update) | Renders HeroStatus, FocusActions, QuickGlance; does NOT render removed components |

**Manual verification via preview:**
- Desktop 1440px: 3 zones + AI panel, no scrolling
- Desktop 1280px: 3 zones without AI panel
- Mobile 375px: Stacked layout, compact hero

---

## Execution Order

```
Tasks 1-4 (parallel) → Task 5 → Task 6 → Task 7
```

| # | Task | Files | Parallel? |
|---|------|-------|-----------|
| 1 | HeroStatus | `components/dashboard/HeroStatus.tsx` | ✅ Yes |
| 2 | FocusActions | `components/dashboard/FocusActions.tsx` | ✅ Yes |
| 3 | QuickGlance | `components/dashboard/QuickGlance.tsx` | ✅ Yes |
| 4 | useDashboardAIContext | `hooks/useDashboardAIContext.ts` | ✅ Yes |
| 5 | AI wiring | `AIPanel.tsx`, `AIAssistantProvider.tsx`, `ai-chat/index.ts` | After 4 |
| 6 | Dashboard rewrite | `pages/Dashboard.tsx` | After 1-5 |
| 7 | Tests | Test files | After 1-6 |

---

## Verification Plan

1. **Build:** `npm run build` — no errors
2. **Lint:** `npm run lint` — no new errors in created files
3. **Tests:** `npm run test -- --run` — all 357+ tests pass
4. **Preview (desktop 1440px):**
   - Hero shows score, stage, industry, trend
   - Today's Focus shows 3 numbered actions with CTAs
   - Quick Glance shows 3 collapsed sections
   - Expanding Risks shows risk items with severity badges
   - Expanding Health shows 6 category bars
   - Expanding Feed shows 5 recent activities
   - AI panel shows 4 dashboard-specific quick actions
5. **Preview (mobile 375px):**
   - Hero, Focus, Glance stack vertically
   - No horizontal overflow
   - Accordion works on touch
6. **Regression:** Verify removed components don't appear
7. **AI chat:** Click "My startup status" → AI responds with health/risk context

---

## Key Files Reference

| File | Role |
|------|------|
| `src/pages/Dashboard.tsx` | Central orchestrator — rewrite |
| `src/components/dashboard/TodaysFocusCard.tsx` | Pattern for FocusActions (unused but built) |
| `src/hooks/useReportAIContext.ts` | Pattern for useDashboardAIContext |
| `src/providers/AIAssistantProvider.tsx` | Add dashboard context dispatch |
| `src/components/ai/AIPanel.tsx` | Add dashboard quick actions |
| `supabase/functions/ai-chat/index.ts` | Add dashboard system prompt |
| `src/hooks/useDailyFocus.ts` | Primary data for FocusActions |
| `src/hooks/useActionRecommender.ts` | Fallback data for FocusActions |
| `src/components/dashboard/StartupHealthEnhanced.tsx` | Pattern for ScoreRing + HealthBars |
| `src/components/dashboard/TopRisks.tsx` | Pattern for RisksList |
| `src/components/ui/accordion.tsx` | Existing shadcn accordion |
