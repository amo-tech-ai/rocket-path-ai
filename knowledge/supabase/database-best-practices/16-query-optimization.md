# Query Optimization Best Practices

**Document:** 16-query-optimization.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Query Optimization](https://supabase.com/docs/guides/database/query-optimization)

---

## Overview

Query optimization is essential for maintaining database performance as data grows. This guide covers index strategies, query analysis, and optimization techniques for Supabase PostgreSQL.

---

## Query Analysis

### EXPLAIN and EXPLAIN ANALYZE

**EXPLAIN** - Shows query plan without executing

```sql
-- ✅ CORRECT - Analyze query plan
explain
select *
from public.tasks
where org_id = 'uuid-here'
  and status = 'pending'
order by created_at desc
limit 10;
```

**EXPLAIN ANALYZE** - Executes query and shows actual performance

```sql
-- ✅ CORRECT - Analyze with execution stats
explain (analyze, buffers, verbose)
select *
from public.tasks
where org_id = 'uuid-here'
  and status = 'pending'
order by created_at desc
limit 10;
```

**Key Metrics:**
- **Execution Time** - Total query time
- **Planning Time** - Query planning time
- **Seq Scan** - Sequential scan (often slow, indicates missing index)
- **Index Scan** - Index scan (usually fast)
- **Buffers** - Disk I/O operations

### Understanding Query Plans

**Good Plan:**
```
Limit (cost=0.42..25.23 rows=10)
  -> Index Scan using idx_tasks_org_status on tasks
       Index Cond: (org_id = 'uuid'::uuid)
       Filter: (status = 'pending'::text)
```

**Bad Plan:**
```
Seq Scan on tasks
  Filter: (org_id = 'uuid'::uuid AND status = 'pending'::text)
  Rows Removed by Filter: 99990
```

**Key Indicators:**
- ✅ Index Scan = Good
- ❌ Seq Scan = Usually bad (unless small table)
- ❌ High "Rows Removed by Filter" = Missing index

---

## Index Strategies

### 1. Index Foreign Keys

```sql
-- ✅ CORRECT - Index all foreign keys
create index idx_tasks_org_id on public.tasks(org_id);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_startup_id on public.tasks(startup_id);
```

**Why:** Foreign keys are frequently used in JOINs and WHERE clauses.

### 2. Index WHERE Clause Columns

```sql
-- ✅ CORRECT - Index filtered columns
create index idx_tasks_status on public.tasks(status);
create index idx_tasks_priority on public.tasks(priority);

-- Use in queries
select * from public.tasks
where status = 'pending'  -- ✅ Indexed
  and priority > 5;  -- ✅ Indexed
```

### 3. Composite Indexes

```sql
-- ✅ CORRECT - Composite index for common query patterns
create index idx_tasks_org_status on public.tasks(org_id, status);

-- Query uses composite index
select * from public.tasks
where org_id = 'uuid'  -- ✅ Uses index
  and status = 'pending';  -- ✅ Uses index
```

**Key Point:** Order matters - put most selective column first.

### 4. Partial Indexes

```sql
-- ✅ CORRECT - Partial index for filtered queries
create index idx_active_tasks on public.tasks(org_id, created_at)
where status = 'active';

-- Query uses partial index
select * from public.tasks
where org_id = 'uuid'
  and status = 'active'  -- ✅ Matches partial index
order by created_at desc;
```

**Benefits:**
- Smaller index size
- Faster index scans
- Better for frequently filtered data

### 5. Expression Indexes

```sql
-- ✅ CORRECT - Index on expression
create index idx_tasks_created_date on public.tasks(date(created_at));

-- Query uses expression index
select * from public.tasks
where date(created_at) = '2025-01-27';  -- ✅ Uses index
```

**Use Cases:**
- Date functions
- Lowercase text searches
- JSONB path queries

---

## Query Optimization Techniques

### 1. Avoid SELECT *

```sql
-- ❌ BAD - Selects all columns
select * from public.tasks
where org_id = 'uuid';

-- ✅ GOOD - Select only needed columns
select id, title, status, created_at
from public.tasks
where org_id = 'uuid';
```

**Benefits:**
- Less data transferred
- Better use of covering indexes
- Clearer intent

### 2. Use LIMIT

```sql
-- ✅ CORRECT - Limit result set
select *
from public.tasks
where org_id = 'uuid'
order by created_at desc
limit 20;  -- ✅ Prevents large result sets
```

### 3. Avoid Functions in WHERE Clauses

```sql
-- ❌ BAD - Function prevents index use
select * from public.tasks
where extract(month from created_at) = 1;

-- ✅ GOOD - Direct comparison uses index
select * from public.tasks
where created_at >= '2025-01-01'
  and created_at < '2025-02-01';
```

### 4. Use EXISTS Instead of COUNT

```sql
-- ❌ BAD - Counts all rows
select count(*) > 0
from public.tasks
where user_id = 'uuid';

-- ✅ GOOD - Stops at first match
select exists (
  select 1
  from public.tasks
  where user_id = 'uuid'
);
```

### 5. Optimize JOINs

```sql
-- ❌ BAD - Cartesian product risk
select *
from public.tasks t
cross join public.projects p;

-- ✅ GOOD - Explicit JOIN with conditions
select *
from public.tasks t
inner join public.projects p on p.id = t.project_id
where t.org_id = 'uuid';
```

---

## Index Types

### B-Tree Index (Default)

**Best For:** Equality and range queries

```sql
-- ✅ CORRECT - B-Tree index
create index idx_tasks_created_at on public.tasks(created_at);

-- Supports:
-- WHERE created_at = '2025-01-27'
-- WHERE created_at > '2025-01-01'
-- WHERE created_at BETWEEN '2025-01-01' AND '2025-01-31'
```

### GIN Index

**Best For:** Arrays, JSONB, full-text search

```sql
-- ✅ CORRECT - GIN index for JSONB
create index idx_tasks_metadata_gin on public.tasks using gin(metadata);

-- Query uses GIN index
select * from public.tasks
where metadata @> '{"status": "active"}'::jsonb;
```

### HNSW Index (pgvector)

**Best For:** Vector similarity search

```sql
-- ✅ CORRECT - HNSW index for vectors
create index idx_chat_facts_embedding on public.chat_facts
using hnsw (embedding vector_cosine_ops);

-- Query uses HNSW index
select *
from public.chat_facts
order by embedding <-> query_vector
limit 10;
```

---

## Common Performance Issues

### Issue 1: Missing Indexes

**Symptoms:**
- Slow queries
- Seq Scan in EXPLAIN
- High "Rows Removed by Filter"

**Fix:**
```sql
-- Analyze query
explain analyze
select * from public.tasks where org_id = 'uuid';

-- If Seq Scan, create index
create index idx_tasks_org_id on public.tasks(org_id);
```

### Issue 2: N+1 Queries

**Symptoms:**
- Many small queries instead of one large query
- Slow application performance

**Fix:**
```sql
-- ❌ BAD - N+1 queries
-- Query 1: SELECT * FROM tasks WHERE org_id = 'uuid'
-- Query 2: SELECT * FROM users WHERE id = task1.user_id
-- Query 3: SELECT * FROM users WHERE id = task2.user_id
-- ...

-- ✅ GOOD - Single query with JOIN
select
  t.*,
  u.name as user_name,
  u.email as user_email
from public.tasks t
inner join public.profiles u on u.id = t.user_id
where t.org_id = 'uuid';
```

### Issue 3: Unnecessary ORDER BY

**Symptoms:**
- Slow queries with ORDER BY
- High memory usage

**Fix:**
```sql
-- ❌ BAD - Sorts entire table
select * from public.tasks
order by created_at desc;

-- ✅ GOOD - Limit before sorting
select * from public.tasks
order by created_at desc
limit 20;

-- ✅ BETTER - Index supports ORDER BY
create index idx_tasks_created_desc on public.tasks(created_at desc);
```

---

## Project-Specific Optimization

### Current Index Strategy

**Status:** ✅ **95% Optimized**

**Coverage:**
- ✅ All foreign keys indexed
- ✅ Common query patterns indexed
- ✅ Partial indexes for filtered queries
- ✅ Vector indexes for RAG
- ✅ Full-text search indexes

**Location:** `supabase/migrations/20260115120008_performance_indexes.sql`

### Recommended Additional Indexes

```sql
-- ✅ RECOMMENDED - Additional indexes for common queries

-- Tasks by status and date
create index idx_tasks_status_created
  on public.tasks(status, created_at desc)
  where status != 'archived';

-- AI runs by date (for cost tracking)
create index idx_ai_runs_date_org
  on public.ai_runs(date(created_at), org_id);

-- Deals by stage and value
create index idx_deals_stage_value
  on public.deals(stage, value desc)
  where value is not null;
```

---

## Monitoring Query Performance

### Slow Query Log

```sql
-- ✅ CORRECT - Enable slow query logging (if available)
-- Note: Typically configured via Supabase Dashboard

-- Check for slow queries
select
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
from pg_stat_statements
order by mean_exec_time desc
limit 10;
```

### Query Statistics

```sql
-- ✅ CORRECT - Monitor query performance
select
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch
from pg_stat_user_tables
where schemaname = 'public'
order by seq_scan desc;
```

**Key Metrics:**
- High `seq_scan` = Missing indexes
- Low `idx_scan` = Underutilized indexes
- Ratio of `seq_scan` to `idx_scan` should favor indexes

---

## Quick Reference

### Optimization Checklist

- [ ] All foreign keys indexed
- [ ] WHERE clause columns indexed
- [ ] Composite indexes for common patterns
- [ ] Partial indexes for filtered queries
- [ ] EXPLAIN ANALYZE used to verify plans
- [ ] Queries use indexes (no Seq Scan)
- [ ] LIMIT used for large result sets
- [ ] Functions avoided in WHERE clauses
- [ ] JOINs optimized with proper conditions
- [ ] Query performance monitored regularly

---

## References

- **Official Docs:** [Query Optimization](https://supabase.com/docs/guides/database/query-optimization)
- **Indexes Guide:** [`03-indexes.md`](./03-indexes.md)
- **Database Advisors:** [`17-database-advisors.md`](./17-database-advisors.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
