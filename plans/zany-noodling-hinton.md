# Plan: Improve Tabbed Report Layout (Review Feedback)

## Context

The basic tabbed layout is already implemented in `ReportV2Layout.tsx` — 6 tabs with URL sync, hero above, print support. The review identified 7 improvements. This plan addresses all actionable ones in a single pass.

## Current State

- Tabs work: Overview, Problem & Customer, Market & Competition, Risks & MVP, Business Model, Key Questions
- URL sync via `?tab=` query param with `replace: true`
- Print renders all sections via `.report-print-sections` CSS approach
- Tests: 325/325 passing, 0 TS errors

## Changes (6 improvements)

### 1. Make Overview tab useful (not empty)

**Current:** Static placeholder text "Your overall score and dimension breakdown are displayed above."

**New:** Three compact cards showing data the hero doesn't surface in full:
- **Top Strengths** — All `d.highlights` (hero only uses first one in narrative)
- **Top Risks** — All `d.red_flags` (hero only uses first one in narrative)
- **Next Actions** — First 3 items from `d.next_steps` (hero mentions them narratively, but doesn't list them)

No new components — just inline JSX with existing data already computed in the component.

### 2. Add Next/Previous stepper buttons

Below each tab's content, add two buttons: "Previous: [tab label]" and "Next: [tab label]". Wraps around (last → first, first → last skipped — just hide the irrelevant button).

Uses the existing `REPORT_TABS` array for ordering. Uses `Button` from shadcn/ui + `ChevronLeft`/`ChevronRight` from lucide-react.

### 3. Scroll to tab content on tab change

When `handleTabChange` fires, scroll to the `TabsList` element (the anchor point just below the hero). Uses a ref on the `TabsList` wrapper and `scrollIntoView({ behavior: 'smooth', block: 'start' })`.

### 4. Validate tab query param

Currently `activeTab` casts any string to `ReportTab` without validation.

**Fix:** Check if the param is a valid tab value from `REPORT_TABS`. If not, fall back to `'overview'`.

```ts
const VALID_TABS = new Set(REPORT_TABS.map(t => t.value));
const rawTab = searchParams.get('tab');
const activeTab = (rawTab && VALID_TABS.has(rawTab) ? rawTab : 'overview') as ReportTab;
```

### 5. Reorder tabs to match investor narrative arc

**Current:** Overview → Problem & Customer → Market & Competition → Risks & MVP → Business Model → Key Questions

**New:** Overview → Problem & Customer → Market & Competition → **Business Model** → **Risks & Plan** → Key Questions

Investors expect: market → model → risks. "Risks & MVP" renamed to "Risks & Plan" since it includes MVP + Next Steps (execution plan, not just risks).

Update `REPORT_TABS` constant — no structural changes needed.

### 6. Extract section registry for future reuse

Refactor `REPORT_TABS` into a richer `REPORT_SECTIONS` registry that maps each tab to its render function name. This enables the print section and any future "export" or "share specific tabs" to use the same mapping. Light refactor — no new files.

---

## Files to Modify

### `src/components/validator/report/ReportV2Layout.tsx`
All 6 changes live here:
- Update `REPORT_TABS` order and labels (improvement 5)
- Add `VALID_TABS` set for param validation (improvement 4)
- Add `tabsRef` for scroll-to behavior (improvement 3)
- Enrich Overview tab content with highlights/red_flags/next_steps cards (improvement 1)
- Add `TabStepper` component for prev/next navigation (improvement 2)
- Minor type refinement on section registry (improvement 6)

### `src/index.css`
No changes needed — existing print CSS is correct.

### `src/test/components/ReportV2Layout.test.tsx`
No changes needed — existing tests render in BrowserRouter and find section text via the print-only block (always in DOM regardless of active tab).

---

## NOT in scope

- **SharedReport / EmbedReport tabs** — These pages have their own 500+ line inline rendering, not using ReportV2Layout. Migrating them to use ReportV2Layout is a separate task.
- **Per-tab scroll position memory** — Overkill for current usage. Scroll-to-top-of-tabs on change is sufficient.
- **Mobile swipe gestures** — Stepper buttons are the pragmatic mobile solution. Touch swipe can be added later.

---

## Implementation Steps

### Step 1: Update REPORT_TABS (reorder + rename)
```ts
const REPORT_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'problem-customer', label: 'Problem & Customer' },
  { value: 'market-competition', label: 'Market & Competition' },
  { value: 'business', label: 'Business Model' },
  { value: 'risks-plan', label: 'Risks & Plan' },
  { value: 'questions', label: 'Key Questions' },
] as const;
```
Note: `risks-mvp` → `risks-plan` (value + label change).

### Step 2: Add tab param validation
Add `VALID_TABS` set. Validate `searchParams.get('tab')` against it.

### Step 3: Add scroll-to-tabs on tab change
Add `tabsAnchorRef` on the Tabs container. In `handleTabChange`, call `tabsAnchorRef.current?.scrollIntoView(...)`.

### Step 4: Enrich Overview tab content
Replace the placeholder `<p>` with three card sections:
- Strengths card (green accent) — maps `d.highlights`
- Risks card (amber/red accent) — maps `d.red_flags`
- Next Actions card (blue accent) — first 3 from `d.next_steps` (handles both v1 strings and v2 objects)

### Step 5: Add TabStepper component
Small inline component below each `TabsContent`:
```tsx
function TabStepper({ currentTab, onNavigate }: { currentTab: string; onNavigate: (tab: string) => void })
```
Renders prev/next buttons using `REPORT_TABS` index math. Hidden on first/last tab edges (no wrap-around — just hide the irrelevant direction).

### Step 6: Update TabsContent values
Rename `risks-mvp` → `risks-plan` in all TabsContent value props and render function references.

---

## Verification

1. `npx tsc --noEmit` — 0 errors
2. `npx vitest run` — 325/325 tests pass
3. `npx vite build` — succeeds
4. Manual checks:
   - Navigate to report → Overview tab shows strengths/risks/actions
   - Click tabs → content switches, URL updates, page scrolls to tab area
   - Use stepper → navigates forward/backward between tabs
   - Visit `?tab=risks-plan` → correct tab active
   - Visit `?tab=garbage` → falls back to Overview
   - Print → all sections appear, no tabs visible
   - Mobile viewport → tabs wrap, stepper buttons usable
