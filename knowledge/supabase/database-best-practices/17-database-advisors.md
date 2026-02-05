# Database Advisors Best Practices

**Document:** 17-database-advisors.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Database Advisors](https://supabase.com/docs/guides/database/database-advisors)

---

## Overview

Supabase Database Advisors provide automated recommendations for optimizing database performance, security, and cost. This guide covers how to use advisors effectively and implement their recommendations.

---

## Available Advisors

### 1. Index Advisor

**Purpose:** Recommends missing indexes for slow queries

**Access:** Supabase Dashboard → Database → Advisors → Index Advisor

**Recommendations Include:**
- Missing indexes on foreign keys
- Missing indexes on WHERE clause columns
- Composite indexes for common query patterns
- Partial indexes for filtered queries

**Example Recommendation:**
```
Missing index on tasks.org_id
Impact: High (affects 95% of queries)
Query: SELECT * FROM tasks WHERE org_id = $1
Recommendation: CREATE INDEX idx_tasks_org_id ON tasks(org_id);
```

### 2. Query Performance Advisor

**Purpose:** Identifies slow queries and optimization opportunities

**Access:** Supabase Dashboard → Database → Advisors → Query Performance

**Recommendations Include:**
- Slow queries (>1s execution time)
- Queries using sequential scans
- Queries with high memory usage
- Queries with missing indexes

### 3. Security Advisor

**Purpose:** Identifies security vulnerabilities

**Access:** Supabase Dashboard → Database → Advisors → Security

**Recommendations Include:**
- Tables without RLS enabled
- Overly permissive RLS policies
- Missing indexes on RLS policy columns
- Unused roles or permissions

### 4. Cost Advisor

**Purpose:** Identifies cost optimization opportunities

**Access:** Supabase Dashboard → Database → Advisors → Cost

**Recommendations Include:**
- Unused indexes (storage cost)
- Large tables without partitioning
- Inefficient queries (compute cost)
- Unused functions or triggers

---

## Using Advisors

### Step 1: Review Recommendations

**Via Dashboard:**
1. Navigate to Database → Advisors
2. Review recommendations by category
3. Check impact and priority

**Via API (if available):**
```typescript
// ✅ CORRECT - Fetch advisor recommendations
const { data: recommendations } = await supabase
  .from('advisor_recommendations')  // If available
  .select('*')
  .order('priority', { ascending: false });
```

### Step 2: Evaluate Recommendations

**Check Each Recommendation:**
- ✅ **Impact:** How much will this improve performance?
- ✅ **Effort:** How difficult is this to implement?
- ✅ **Risk:** Will this break existing functionality?

**Example Evaluation:**
```
Recommendation: Add index on tasks.org_id
Impact: High (95% of queries)
Effort: Low (5 minutes)
Risk: Low (no breaking changes)
Decision: ✅ Implement immediately
```

### Step 3: Implement Recommendations

**Create Migration for Index:**
```sql
-- ✅ CORRECT - Implement advisor recommendation
-- Migration: 20260127130000_add_missing_indexes.sql

-- Index recommended by advisor
create index if not exists idx_tasks_org_id
  on public.tasks(org_id);

-- Verify index created
select indexname, tablename
from pg_indexes
where indexname = 'idx_tasks_org_id';
```

**Test After Implementation:**
```sql
-- ✅ CORRECT - Verify improvement
explain analyze
select * from public.tasks
where org_id = 'uuid-here';

-- Should show: Index Scan (not Seq Scan)
```

---

## Advisor Best Practices

### 1. Regular Reviews

**Schedule:**
- Weekly: Review high-priority recommendations
- Monthly: Review all recommendations
- Quarterly: Comprehensive optimization review

### 2. Prioritize by Impact

**High Impact, Low Effort:**
- ✅ Missing indexes on foreign keys
- ✅ Missing indexes on WHERE clauses
- ✅ Tables without RLS

**High Impact, High Effort:**
- ⚠️ Table partitioning
- ⚠️ Query refactoring
- ⚠️ Schema redesign

### 3. Test Before Applying

```sql
-- ✅ CORRECT - Test recommendation locally
-- 1. Create index in local database
create index idx_test on public.tasks(org_id);

-- 2. Test query performance
explain analyze
select * from public.tasks where org_id = 'uuid';

-- 3. Verify improvement
-- 4. Create migration if successful
```

### 4. Monitor After Implementation

```sql
-- ✅ CORRECT - Monitor index usage
select
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
from pg_stat_user_indexes
where indexname = 'idx_tasks_org_id';

-- Check if index is being used
-- Low idx_scan = Consider removing index
```

---

## Common Advisor Recommendations

### Recommendation 1: Missing Foreign Key Index

**Issue:** Foreign key column not indexed

**Fix:**
```sql
-- ✅ CORRECT - Add missing index
create index idx_tasks_contact_id on public.tasks(contact_id);
create index idx_tasks_deal_id on public.tasks(deal_id);
```

### Recommendation 2: Missing WHERE Clause Index

**Issue:** Filtered column not indexed

**Fix:**
```sql
-- ✅ CORRECT - Add missing index
create index idx_tasks_status on public.tasks(status)
where status != 'archived';  -- Partial index
```

### Recommendation 3: Sequential Scan on Large Table

**Issue:** Query uses Seq Scan instead of Index Scan

**Fix:**
```sql
-- 1. Identify missing index
explain analyze
select * from public.tasks where org_id = 'uuid';

-- 2. Create index
create index idx_tasks_org_id on public.tasks(org_id);

-- 3. Verify improvement
explain analyze
select * from public.tasks where org_id = 'uuid';
-- Should show: Index Scan
```

### Recommendation 4: Table Without RLS

**Issue:** Table has RLS disabled

**Fix:**
```sql
-- ✅ CORRECT - Enable RLS
alter table public.tasks enable row level security;

-- Create policies
create policy "Users access own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));
```

---

## Project-Specific Advisor Usage

### Current Status

**Index Advisor:**
- ✅ Most foreign keys indexed
- ⚠️ Some WHERE clause columns may need indexes
- ✅ Partial indexes implemented where appropriate

**Query Performance:**
- ✅ Most queries use indexes
- ⚠️ Some complex queries may need optimization
- ✅ EXPLAIN ANALYZE used for verification

**Security Advisor:**
- ✅ All tables have RLS enabled
- ✅ Policies follow best practices
- ✅ Helper functions used for performance

### Recommended Actions

1. **Run Index Advisor Weekly**
   - Check for new missing indexes
   - Review index usage statistics
   - Remove unused indexes

2. **Run Query Performance Advisor Monthly**
   - Identify slow queries
   - Optimize query patterns
   - Review EXPLAIN plans

3. **Run Security Advisor Quarterly**
   - Verify RLS coverage
   - Review policy performance
   - Check for overly permissive policies

---

## Automated Advisor Integration

### Edge Function for Advisor Checks

```typescript
// ✅ CORRECT - Automated advisor checks
async function checkAdvisorRecommendations() {
  // Fetch recommendations (if API available)
  const recommendations = await fetchAdvisorRecommendations();
  
  // Filter high-priority recommendations
  const highPriority = recommendations.filter(
    r => r.priority === 'high' && r.effort === 'low'
  );
  
  // Log recommendations
  for (const rec of highPriority) {
    console.log(`[Advisor] ${rec.title}: ${rec.description}`);
    console.log(`[Advisor] Impact: ${rec.impact}, Effort: ${rec.effort}`);
    console.log(`[Advisor] SQL: ${rec.sql}`);
  }
  
  return highPriority;
}
```

---

## Quick Reference

### Advisor Review Checklist

- [ ] Index Advisor reviewed weekly
- [ ] Query Performance Advisor reviewed monthly
- [ ] Security Advisor reviewed quarterly
- [ ] Cost Advisor reviewed quarterly
- [ ] High-impact recommendations implemented
- [ ] Recommendations tested before applying
- [ ] Performance monitored after implementation
- [ ] Unused indexes removed

---

## References

- **Official Docs:** [Database Advisors](https://supabase.com/docs/guides/database/database-advisors)
- **Query Optimization:** [`16-query-optimization.md`](./16-query-optimization.md)
- **Indexes Guide:** [`03-indexes.md`](./03-indexes.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
