---
name: performance-optimization
description: Use when optimizing bundle size, load times, query performance, or before production launch. Triggers on "slow", "performance", "optimize", "bundle size", "lazy load", "cache", "lighthouse".
---

# Performance Optimization

## Overview

Identify and fix performance bottlenecks in the React SPA, Supabase queries, and edge functions.

## When to Use

- App feels slow
- Bundle > 500KB gzipped
- Lighthouse < 80
- Queries > 200ms
- Before production launch

## Workflow

### Phase 1: Measure

1. **Bundle:** `npx vite-bundle-visualizer` (target: < 300KB gzipped)
2. **Lighthouse:** DevTools > Lighthouse (target: Performance > 90, LCP < 2.5s)
3. **React Profiler:** DevTools > Profiler (look for > 16ms renders)
4. **DB queries:** Supabase Dashboard > Query Performance (look for > 200ms)

### Phase 2: Frontend

**Code splitting:**
```typescript
const Dashboard = lazy(() => import("@/pages/Dashboard"));
<Suspense fallback={<Loading />}><Route path="/dashboard" element={<Dashboard />} /></Suspense>
```

**Memoization** (only for expensive ops):
```typescript
const processed = useMemo(() => expensiveCalc(data), [data]);
const handleClick = useCallback(() => doThing(id), [id]);
```

**Images:** Cloudinary transforms `w_400,f_auto,q_auto`, `loading="lazy"` on below-fold.

### Phase 3: Queries

**Select only needed columns:**
```typescript
supabase.from("projects").select("id, name, status, updated_at")
```

**Add indexes:**
```sql
create index concurrently idx_<table>_<column> on public.<table>(<column>);
```

**React Query caching:**
```typescript
useQuery({ queryKey: ["projects"], queryFn: fetch, staleTime: 5 * 60 * 1000 });
```

### Phase 4: Verify

1. Re-run bundle analysis
2. Re-run Lighthouse
3. Test on Slow 3G throttle
4. Verify no regressions

## Checklist

- [ ] Bundle under target size
- [ ] Lighthouse Performance > 90
- [ ] Routes code-split with lazy loading
- [ ] Images optimized with Cloudinary
- [ ] DB queries use specific columns
- [ ] Indexes on slow queries
- [ ] React Query staleTime set
- [ ] Tested on slow network
