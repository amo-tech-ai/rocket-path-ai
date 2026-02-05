# PostgreSQL Configuration Best Practices

**Document:** 15-configuration.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [PostgreSQL Configuration](https://supabase.com/docs/guides/database/postgres/configuration)

---

## Overview

PostgreSQL configuration parameters control database behavior, performance, and resource usage. This guide covers key configuration settings for Supabase and when to adjust them.

---

## Configuration Access

### Viewing Current Configuration

```sql
-- ✅ CORRECT - View all settings
show all;

-- View specific setting
show shared_buffers;
show work_mem;
show max_connections;

-- View setting with context
select name, setting, unit, context
from pg_settings
where name = 'shared_buffers';
```

### Setting Configuration

**Via Supabase Dashboard:**
1. Navigate to Database → Settings
2. Adjust configuration parameters
3. Apply changes (may require restart)

**Via SQL (if supported):**
```sql
-- Note: Most settings require superuser or are read-only
-- Check Supabase documentation for supported settings

-- Set session-level setting
set work_mem = '64MB';

-- Set transaction-level setting
set local work_mem = '128MB';
```

---

## Key Configuration Parameters

### Memory Settings

#### shared_buffers

**Purpose:** Memory used for caching data pages

```sql
-- Typical values
-- Small database (<2GB): 25% of RAM
-- Medium database (2-32GB): 25% of RAM
-- Large database (>32GB): 25% of RAM (max ~8GB)

-- Supabase manages this automatically
-- Check current value
show shared_buffers;
```

#### work_mem

**Purpose:** Memory for sort operations and hash tables

```sql
-- Typical values: 4MB - 64MB per operation
-- Total can be: work_mem * max_connections

-- Set per-session (if needed)
set work_mem = '32MB';

-- Check current value
show work_mem;
```

**Key Point:** Each sort/hash operation can use `work_mem`, so total usage can be much higher than the setting.

#### maintenance_work_mem

**Purpose:** Memory for maintenance operations (VACUUM, CREATE INDEX)

```sql
-- Typical values: 64MB - 2GB
-- Larger values speed up maintenance operations

-- Check current value
show maintenance_work_mem;
```

### Connection Settings

#### max_connections

**Purpose:** Maximum number of concurrent connections

```sql
-- Supabase manages this automatically
-- Typical values: 100-500 depending on plan

-- Check current value
show max_connections;

-- Check current connections
select count(*) from pg_stat_activity;
```

**Key Point:** Each connection uses memory, so more connections = less memory per connection.

### Query Planning

#### random_page_cost

**Purpose:** Cost estimate for random disk access

```sql
-- Default: 4.0 (spinning disk)
-- SSD: 1.1 - 1.5
-- Supabase (SSD): Typically 1.1

-- Check current value
show random_page_cost;
```

#### effective_cache_size

**Purpose:** Estimate of available cache for query planning

```sql
-- Typical: 50-75% of total RAM
-- Helps planner choose index vs sequential scan

-- Check current value
show effective_cache_size;
```

---

## Performance Tuning

### 1. Connection Pooling

**Use Supabase Connection Pooler:**

```typescript
// ✅ CORRECT - Use connection pooler
const supabase = createClient(
  'https://your-project.supabase.co',
  ANON_KEY,
  {
    db: {
      schema: 'public'
    },
    // Connection pooler URL (port 6543)
    // Direct connection URL (port 5432)
  }
);
```

**Benefits:**
- Reduces connection overhead
- Better resource utilization
- Improved performance

### 2. Query Timeout

```sql
-- ✅ CORRECT - Set query timeout
set statement_timeout = '30s';  -- Per-statement timeout

-- Check current value
show statement_timeout;
```

### 3. Lock Timeout

```sql
-- ✅ CORRECT - Set lock timeout
set lock_timeout = '5s';  -- Wait max 5s for lock

-- Check current value
show lock_timeout;
```

---

## Project-Specific Configuration

### Recommended Settings for StartupAI

**For High-Volume AI Operations:**

```sql
-- Increase work_mem for complex queries
set work_mem = '64MB';

-- Increase maintenance_work_mem for index creation
set maintenance_work_mem = '256MB';

-- Set reasonable timeouts
set statement_timeout = '60s';  -- AI queries can be slow
set lock_timeout = '10s';
```

**Note:** These are session-level settings. For persistent configuration, use Supabase Dashboard or contact support.

---

## Monitoring Configuration

### Check Resource Usage

```sql
-- ✅ CORRECT - Monitor connections
select
  count(*) as total_connections,
  count(*) filter (where state = 'active') as active_connections,
  count(*) filter (where state = 'idle') as idle_connections
from pg_stat_activity;

-- Monitor memory usage
select
  name,
  setting,
  unit,
  source
from pg_settings
where name in ('shared_buffers', 'work_mem', 'maintenance_work_mem')
order by name;
```

---

## Quick Reference

### Configuration Checklist

- [ ] `shared_buffers` appropriate for database size
- [ ] `work_mem` set for query complexity
- [ ] `max_connections` sufficient for load
- [ ] `random_page_cost` set for storage type (SSD)
- [ ] `effective_cache_size` reflects available RAM
- [ ] Timeouts configured appropriately
- [ ] Connection pooling enabled
- [ ] Configuration monitored regularly

---

## References

- **Official Docs:** [PostgreSQL Configuration](https://supabase.com/docs/guides/database/postgres/configuration)
- **Query Optimization:** [`16-query-optimization.md`](./16-query-optimization.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
