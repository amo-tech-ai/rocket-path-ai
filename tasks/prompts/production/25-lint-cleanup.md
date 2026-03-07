---
task_id: PROD-06
title: Lint Cleanup (React Hooks Bugs, TypeScript Strictness)
phase: PRODUCTION
priority: P1
status: Not Started
estimated_effort: 2 days
skill: [design/frontend-design]
subagents: [code-reviewer]
schema_tables: []
depends_on: []
---

# Prompt 06: Lint Cleanup

> **Priority:** P1 | **Current:** 990 problems (801 `no-explicit-any`, 9 React hooks, 62 refresh, 24 case-declarations)
> **Affects:** All frontend code, especially hooks and components

---

## Summary

| Aspect | Details |
|--------|---------|
| **Scope** | Fix real bugs (React hooks), reduce `no-explicit-any` in critical paths |
| **Screens** | None (code quality only) |
| **Targets** | 0 React hooks violations, < 200 `no-explicit-any` (from 801) |
| **Real-World** | "Missing useEffect dependency causes stale data after validator report completes" |

## Description

**The situation:** `npm run lint` reports 990 problems. Most (801) are `no-explicit-any` — not immediately dangerous but making the codebase harder to refactor safely. However, 9 React hooks violations ARE real bugs: missing `useEffect` dependencies cause stale closures, and ref cleanup patterns risk accessing unmounted DOM nodes. These can cause silent data bugs that are hard to reproduce.

**Why it matters:** The 9 React hooks issues are ticking time bombs. A missing dependency in `useEffect` means a function captures a stale value — the user sees outdated data or the wrong callback fires. The ref cleanup issues mean an effect cleanup might access a DOM node that React has already removed, causing a TypeError in production. The `no-explicit-any` issues make TypeScript's type checker useless for catching refactoring mistakes.

**What already exists:** ESLint is configured with `react-hooks/exhaustive-deps` and `@typescript-eslint/no-explicit-any` rules. The lint runs in CI. All 389 tests pass. The build succeeds.

**The fix:** Two phases: (1) **Fix React hooks violations** — all 9 issues. For missing dependencies, add the dependency or wrap in `useCallback`. For ref cleanup, copy `ref.current` to a local variable inside the effect. (2) **Reduce `no-explicit-any`** — prioritize files in the critical path: hooks (`src/hooks/`), edge function types (`src/types/`), API response types, and Supabase query results. Replace `any` with proper types using the Supabase generated types. Target: reduce from 801 to under 200, focusing on the most-used files first.

**Example:** The `useEffect` in a component calls `generateSuggestions` but doesn't list it as a dependency. When the component re-renders with new data, the effect still calls the old `generateSuggestions` closure — which uses stale state. The fix: wrap `generateSuggestions` in `useCallback` with its dependencies, then add it to the `useEffect` dependency array.

## Rationale

**Problem:** 9 React hooks violations are real bugs (stale closures, ref cleanup). 801 `no-explicit-any` makes TypeScript's safety net useless.
**Solution:** Fix all hooks issues immediately. Systematically type the most critical files.
**Impact:** Eliminates silent data bugs. Makes refactoring safer.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | have zero React hooks violations | effects always use current values |
| Developer | have typed API responses | I catch breaking changes at compile time |
| Founder | not see stale data after actions | the UI always reflects the latest state |

## Goals

1. **Primary:** 0 React hooks violations (from 9)
2. **Secondary:** < 200 `no-explicit-any` (from 801)
3. **Quality:** All existing tests still pass

## Acceptance Criteria

- [ ] All 9 React hooks violations fixed (missing deps, ref cleanup)
- [ ] `no-explicit-any` reduced to < 200 (from 801)
- [ ] Priority files typed: all hooks in `src/hooks/`, all types in `src/types/`
- [ ] Supabase query results use generated types (not `any`)
- [ ] Edge function request/response types defined (not `any`)
- [ ] All 389 tests still pass
- [ ] `npm run build` still succeeds
- [ ] No new lint problems introduced

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Hooks | Files with `react-hooks/exhaustive-deps` violations | Fix — add deps or wrap in useCallback |
| Hooks | Files with ref cleanup violations | Fix — copy ref.current to local variable |
| Types | `src/types/` | Modify — replace `any` with proper types |
| Hooks | `src/hooks/*.ts` | Modify — type Supabase query results |
| Components | Files with `no-case-declarations` (24) | Fix — add braces to case blocks |
| Components | Files with `no-useless-escape` (12) | Fix — remove unnecessary backslashes |

### Phase 1: React Hooks (Day 1 — morning)

Run `npm run lint 2>&1 | grep "react-hooks"` to find all 9 violations. Fix each one:

**Missing dependency pattern:**
```typescript
// Before (bug: stale closure)
useEffect(() => { generateSuggestions(); }, [data]);

// After (fixed)
const generateSuggestions = useCallback(() => { /* ... */ }, [data, otherDep]);
useEffect(() => { generateSuggestions(); }, [generateSuggestions]);
```

**Ref cleanup pattern:**
```typescript
// Before (bug: ref may be null in cleanup)
useEffect(() => {
  const el = containerRef.current;
  // ...
  return () => { containerRef.current.removeEventListener(...); }; // BUG
}, []);

// After (fixed)
useEffect(() => {
  const el = containerRef.current;
  // ...
  return () => { el?.removeEventListener(...); }; // Safe
}, []);
```

### Phase 2: TypeScript Strictness (Day 1 afternoon — Day 2)

Target files by impact. Run `npm run lint 2>&1 | grep "no-explicit-any" | cut -d: -f1 | sort | uniq -c | sort -rn | head -20` to find worst offenders.

Priority order:
1. `src/types/` — define proper types for API responses, database rows
2. `src/hooks/` — type Supabase query results using generated types
3. `src/components/validator/` — type report data structures
4. `src/lib/` — type utility function params and returns

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Adding a dependency causes infinite re-render loop | Use `useCallback` or `useMemo` to stabilize the dependency |
| Typing a Supabase query changes the return shape | Update consuming components to match new types |
| Generated Supabase types are outdated | Regenerate with `npx supabase gen types typescript` first |
| A `no-explicit-any` is genuinely needed (e.g., JSON.parse) | Use `unknown` + type guard instead of `any` |

## Real-World Examples

**Scenario 1 — Stale suggestions:** A founder types in the validator chat. The `generateSuggestions` function fires inside a `useEffect`, but it captures the initial empty `messages` array because it's not in the dependency list. The suggestions never update as the conversation progresses. **With this fix,** `generateSuggestions` is wrapped in `useCallback` with `messages` as a dependency, so suggestions update after every message.

**Scenario 2 — Ref cleanup crash:** A founder navigates away from the Analytics page while a chart is animating. The cleanup function tries to call `containerRef.current.removeEventListener()`, but React has already unmounted the component and `containerRef.current` is null. A TypeError appears in the console. **With this fix,** the ref is copied to a local variable inside the effect, so cleanup always has a valid reference (or null-checks safely).

## Outcomes

| Before | After |
|--------|-------|
| 9 React hooks violations (stale data bugs) | 0 hooks violations |
| 801 `no-explicit-any` (no type safety) | < 200 (critical paths typed) |
| Supabase queries return `any` | Supabase queries return generated types |
| Console TypeErrors from ref cleanup | Clean unmount with no errors |
