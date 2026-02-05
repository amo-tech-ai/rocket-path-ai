# Table Partitioning Best Practices

**Document:** 10-partitions.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Database Partitions](https://supabase.com/docs/guides/database/partitions)

---

## Overview

Table partitioning splits large tables into smaller, manageable pieces (partitions) based on a partition key. This improves query performance, maintenance, and data management for large datasets.

---

## When to Use Partitioning

### ✅ Good Candidates for Partitioning

1. **Time-Series Data**
   - Audit logs, event logs, metrics
   - Tables with heavy time-based queries
   - Data with natural time-based expiration

2. **Large Tables (>10GB)**
   - Tables that are difficult to query efficiently
   - Tables with slow maintenance operations (VACUUM, REINDEX)

3. **Data Lifecycle Management**
   - Automatic archiving of old data
   - Easy deletion of expired partitions

### ❌ Poor Candidates

1. **Small Tables (<1GB)**
   - Overhead not worth the complexity

2. **Frequently Updated Data**
   - Cross-partition updates can be slow

3. **Complex Joins**
   - Partitioning can complicate join strategies

---

## Partition Types

### 1. Range Partitioning

**Best For:** Time-series data, sequential IDs

```sql
-- ✅ CORRECT - Range partition by date
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  action text not null,
  record_id uuid,
  created_at timestamptz not null default now()
) partition by range (created_at);

-- Create monthly partitions
create table public.audit_log_2025_01
  partition of public.audit_log
  for values from ('2025-01-01') to ('2025-02-01');

create table public.audit_log_2025_02
  partition of public.audit_log
  for values from ('2025-02-01') to ('2025-03-01');

-- Create default partition for future data
create table public.audit_log_default
  partition of public.audit_log
  default;
```

**Key Points:**
- Partition key must be included in primary key
- Use `FOR VALUES FROM ... TO ...` for ranges
- Create default partition for unmatched values

### 2. List Partitioning

**Best For:** Categorical data, regions, status values

```sql
-- ✅ CORRECT - List partition by status
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null,
  created_at timestamptz not null default now()
) partition by list (status);

-- Create partitions for each status
create table public.tasks_active
  partition of public.tasks
  for values in ('pending', 'in_progress');

create table public.tasks_completed
  partition of public.tasks
  for values in ('completed', 'archived');

create table public.tasks_cancelled
  partition of public.tasks
  for values in ('cancelled');
```

**Key Points:**
- Use `FOR VALUES IN (...)` for list values
- Each value must belong to exactly one partition
- Consider default partition for unexpected values

### 3. Hash Partitioning

**Best For:** Even distribution, load balancing

```sql
-- ✅ CORRECT - Hash partition by user_id
create table public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  session_data jsonb,
  created_at timestamptz not null default now()
) partition by hash (user_id);

-- Create hash partitions
create table public.user_sessions_0
  partition of public.user_sessions
  for values with (modulus 4, remainder 0);

create table public.user_sessions_1
  partition of public.user_sessions
  for values with (modulus 4, remainder 1);

create table public.user_sessions_2
  partition of public.user_sessions
  for values with (modulus 4, remainder 2);

create table public.user_sessions_3
  partition of public.user_sessions
  for values with (modulus 4, remainder 3);
```

**Key Points:**
- Use `MODULUS` and `REMAINDER` for hash distribution
- Number of partitions should be power of 2 for best distribution
- Good for evenly distributing load

---

## Partitioning Best Practices

### 1. Choose Appropriate Partition Key

```sql
-- ✅ GOOD - Partition by date (time-series)
create table public.ai_runs (
  id uuid,
  created_at timestamptz not null,
  -- ... other columns
) partition by range (date(created_at));

-- ✅ GOOD - Partition by org_id (multi-tenant)
create table public.org_events (
  id uuid,
  org_id uuid not null,
  -- ... other columns
) partition by list (org_id);

-- ❌ BAD - Partition by frequently updated column
create table public.tasks (
  id uuid,
  status text,  -- ❌ Changes frequently
  -- ...
) partition by list (status);  -- ❌ Cross-partition updates slow
```

### 2. Index Each Partition

```sql
-- ✅ CORRECT - Index on partition key
create index idx_audit_log_created_at
  on public.audit_log (created_at);

-- Indexes are automatically created on each partition
-- Verify indexes exist on all partitions
select schemaname, tablename, indexname
from pg_indexes
where tablename like 'audit_log%';
```

### 3. Automatic Partition Creation

**Use pg_partman Extension (if available):**

```sql
-- Enable pg_partman
create extension if not exists pg_partman;

-- Configure automatic partition creation
select partman.create_parent(
  p_parent_table => 'public.audit_log',
  p_control => 'created_at',
  p_type => 'range',
  p_interval => 'monthly',
  p_premake => 2  -- Create 2 months ahead
);
```

**Manual Approach:**

```sql
-- ✅ CORRECT - Function to create monthly partitions
create or replace function public.create_monthly_partition(
  table_name text,
  partition_date date
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  partition_name text;
  start_date date;
  end_date date;
begin
  partition_name := table_name || '_' || to_char(partition_date, 'YYYY_MM');
  start_date := date_trunc('month', partition_date);
  end_date := start_date + interval '1 month';
  
  execute format(
    'create table if not exists %I partition of %I for values from (%L) to (%L)',
    partition_name,
    table_name,
    start_date,
    end_date
  );
end;
$$;
```

### 4. Partition Maintenance

**Drop Old Partitions:**

```sql
-- ✅ CORRECT - Drop partitions older than 12 months
create or replace function public.drop_old_partitions(
  table_name text,
  retention_months integer default 12
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  partition_record record;
  cutoff_date date;
begin
  cutoff_date := date_trunc('month', current_date - (retention_months || ' months')::interval);
  
  for partition_record in
    select schemaname, tablename
    from pg_tables
    where tablename like table_name || '_%'
    and tablename != table_name
  loop
    -- Extract date from partition name (e.g., audit_log_2024_01)
    if partition_record.tablename ~ '_\d{4}_\d{2}$' then
      declare
        partition_date date;
      begin
        partition_date := to_date(
          substring(partition_record.tablename from '(\d{4}_\d{2})$'),
          'YYYY_MM'
        );
        
        if partition_date < cutoff_date then
          execute format('drop table if exists %I.%I cascade',
            partition_record.schemaname,
            partition_record.tablename
          );
          raise notice 'Dropped partition: %', partition_record.tablename;
        end if;
      end;
    end if;
  end loop;
end;
$$;
```

---

## Query Optimization with Partitions

### 1. Partition Pruning

**PostgreSQL automatically prunes partitions:**

```sql
-- ✅ GOOD - Partition pruning works
select *
from public.audit_log
where created_at >= '2025-01-01'
  and created_at < '2025-02-01';
-- Only scans audit_log_2025_01 partition

-- ✅ GOOD - Partition pruning with date functions
select *
from public.audit_log
where date(created_at) = '2025-01-15';
-- Only scans audit_log_2025_01 partition

-- ❌ BAD - Prevents partition pruning
select *
from public.audit_log
where extract(month from created_at) = 1;
-- Scans all partitions (can't use index on expression)
```

### 2. Index Strategy

```sql
-- ✅ CORRECT - Index on partition key
create index idx_audit_log_created_at
  on public.audit_log (created_at);

-- ✅ CORRECT - Composite index for common queries
create index idx_audit_log_table_action
  on public.audit_log (table_name, action, created_at);

-- Indexes are created on each partition automatically
```

---

## Project-Specific Partitioning

### Recommended Partitioned Tables

**For StartupAI Platform:**

1. **`audit_log`** - Range partition by `created_at` (monthly)
   - Large volume of audit records
   - Time-based queries
   - Easy archiving of old data

2. **`ai_runs`** - Range partition by `created_at` (monthly)
   - High volume of AI execution logs
   - Cost tracking queries by date
   - Automatic cleanup of old runs

3. **`notifications`** - Range partition by `created_at` (monthly)
   - High volume of user notifications
   - Time-based queries for recent notifications
   - Easy deletion of old notifications

### Implementation Plan

```sql
-- Step 1: Create partitioned table structure
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  action text not null,
  record_id uuid,
  created_at timestamptz not null default now()
) partition by range (date(created_at));

-- Step 2: Create initial partitions
select public.create_monthly_partition('public.audit_log', '2025-01-01'::date);
select public.create_monthly_partition('public.audit_log', '2025-02-01'::date);

-- Step 3: Create indexes
create index idx_audit_log_created_at on public.audit_log (created_at);
create index idx_audit_log_table_action on public.audit_log (table_name, action);

-- Step 4: Migrate existing data (if any)
-- Note: Requires downtime or careful migration strategy
```

---

## Migration Strategy

### Converting Existing Table to Partitioned

**Option 1: Create New Partitioned Table**

```sql
-- ✅ CORRECT - Create new partitioned table
create table public.audit_log_new (
  -- same structure
) partition by range (date(created_at));

-- Copy data in batches
insert into public.audit_log_new
select * from public.audit_log
where created_at >= '2025-01-01';

-- Rename tables
alter table public.audit_log rename to audit_log_old;
alter table public.audit_log_new rename to audit_log;
```

**Option 2: Use pg_partman (if available)**

```sql
-- Convert existing table to partitioned
select partman.create_parent(
  p_parent_table => 'public.audit_log',
  p_control => 'created_at',
  p_type => 'range',
  p_interval => 'monthly'
);
```

---

## Monitoring Partitions

### Check Partition Sizes

```sql
-- ✅ CORRECT - Monitor partition sizes
select
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
from pg_tables
where tablename like 'audit_log%'
order by pg_total_relation_size(schemaname||'.'||tablename) desc;
```

### Check Partition Pruning

```sql
-- ✅ CORRECT - Verify partition pruning in EXPLAIN
explain (analyze, buffers)
select *
from public.audit_log
where created_at >= '2025-01-01'
  and created_at < '2025-02-01';

-- Look for: "Partition Prune" in execution plan
```

---

## Quick Reference

### Partition Creation Checklist

- [ ] Partition key chosen (date, category, hash)
- [ ] Partition type selected (range, list, hash)
- [ ] Initial partitions created
- [ ] Default partition created (for range/list)
- [ ] Indexes created on partition key
- [ ] Automatic partition creation configured (if needed)
- [ ] Maintenance function for old partitions
- [ ] Migration strategy planned (if converting existing table)

---

## References

- **Official Docs:** [Database Partitions](https://supabase.com/docs/guides/database/partitions)
- **PostgreSQL Docs:** [Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
