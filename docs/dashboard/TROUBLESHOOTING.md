# Lovable Preview Blank Screen — Troubleshooting Guide

> **Version:** 1.0 | **Last Updated:** 2026-01-28
> **Purpose:** Quick diagnosis and fix for blank preview screen issues

---

## Quick Diagnosis Flow

```
Preview Blank?
    ↓
Check Network Tab → Any 500 errors?
    ↓
Yes → Fix module crash (import, runtime, env)
    ↓
No → Check Console → Any red errors?
    ↓
Yes → Fix JS/React error
    ↓
No → Hard refresh (Ctrl+Shift+R)
```

---

## Error Categories

### ❌ BLOCKING (causes blank screen)

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to load resource: 500` on `.tsx` file | Module crash during load | Fix import path, runtime error, or env variable |
| `SyntaxError: Unexpected token` | Invalid JSX/TypeScript | Check component for syntax errors |
| `Cannot find module '@/...'` | Invalid import path | Verify file exists at path |
| `TypeError: Cannot read property of undefined` | Null reference at module scope | Add null checks, use optional chaining |

### ⚠️ NON-BLOCKING (safe to ignore)

| Error | Source | Action |
|-------|--------|--------|
| `runtime.lastError: Cannot create item with duplicate id` | LastPass extension | Ignore (test in Incognito) |
| `WebSocket connection to firebaseio.com failed` | Lovable internal tooling | Ignore |
| `Unrecognized feature: vr / battery / bluetooth` | Browser warnings | Ignore |
| `cdn.tailwindcss.com should not be used in production` | CDN warning | Ignore (Vite bundles in production) |
| `postMessage origin mismatch` | Cross-origin tooling | Ignore |

---

## Step-by-Step Fix Process

### Step 1: Identify the Failing Module

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **JS** or look for red entries
4. Find the 500 error (e.g., `src/pages/Settings.tsx`)
5. Click the request → view **Response** for stack trace

### Step 2: Common 500 Causes

| Cause | Example | Fix |
|-------|---------|-----|
| Invalid import | `import { Foo } from './nonexistent'` | Verify file/export exists |
| Circular dependency | A imports B, B imports A | Refactor to break cycle |
| Server-only code | `import fs from 'fs'` | Move to edge function |
| Undefined env var | `const key = import.meta.env.MISSING` | Add to .env or use fallback |
| Top-level exception | `const x = somethingUndefined.foo` | Wrap in try/catch or useEffect |
| Bad type import | `import { MissingType } from './types'` | Regenerate types or fix export |

### Step 3: Quick Isolation Test

Temporarily replace the failing file with a minimal component:

```tsx
export default function ComponentName() {
  return <div>Component OK</div>;
}
```

- **If preview loads** → Bug is inside the original component
- **If still blank** → Check next 500 error in Network tab

### Step 4: Verify Fix

- [ ] No 500 errors in Network tab
- [ ] App renders (not white screen)
- [ ] Console shows only warnings, no red errors
- [ ] Navigation between pages works

---

## Specific Component Fixes

### Settings.tsx Crash

**Common causes:**
1. Missing `useSettings` hook export
2. Invalid import in child component (e.g., `AppearanceSettings.tsx`)
3. Type error in form schema

**Quick check:**
```bash
# Search for the hook
grep -r "useSettings" src/hooks/
```

### Dashboard Crash

**Common causes:**
1. Missing data hook (e.g., `useDashboardData`)
2. Invalid Supabase query with `.single()` on empty result
3. Undefined startup context

**Fix:** Replace `.single()` with `.maybeSingle()` for nullable queries.

---

## Prevention Best Practices

| Practice | Implementation |
|----------|----------------|
| Null-safe queries | Use `.maybeSingle()` not `.single()` for optional data |
| Optional chaining | `user?.profile?.name` not `user.profile.name` |
| Error boundaries | Wrap pages in `<ErrorBoundary>` |
| Type safety | Run `tsc --noEmit` before committing |
| Lazy loading | Use `React.lazy()` for heavy components |

---

## When to Escalate

If after following this guide:
- [ ] All imports verified correct
- [ ] No 500 errors in Network
- [ ] Console shows no red errors
- [ ] Hard refresh didn't help

**Try:**
1. Clear browser cache
2. Open in Incognito/Private window
3. Check Lovable build logs
4. Restart Lovable preview

---

## Related Documentation

- [Production Status](./PRODUCTION-STATUS.md)
- [Progress Plan](./00-progress-plan.md)
- [Edge Functions Reference](./edge-functions.md)

---

**Last Verified:** January 28, 2026
