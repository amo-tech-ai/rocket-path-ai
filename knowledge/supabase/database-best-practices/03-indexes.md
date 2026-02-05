# Indexes & Performance Best Practices

**Document:** 03-indexes.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Managing Indexes](https://supabase.com/docs/guides/database/postgres/indexes)

---

## Overview

Indexes dramatically improve query performance. This guide covers when and how to create indexes, different index types, and optimization strategies.

---

## When to Create Indexes

### ✅ CORRECT: Index Foreign Keys

```sql
-- ✅ CORRECT: Always index foreign keys
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  user_id UUID REFERENCES profiles(id)
);

-- Index foreign keys
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

### ✅ CORRECT: Index Frequently Queried Columns

```sql
-- ✅ CORRECT: Index columns used in WHERE, JOIN, ORDER BY
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

**Index When:**
- ✅ Foreign key columns
- ✅ Columns in WHERE clauses
- ✅ Columns in JOIN conditions
- ✅ Columns in ORDER BY
- ✅ Columns in GROUP BY

---

## Index Types

### ✅ CORRECT: B-Tree Index (Default)

```sql
-- ✅ CORRECT: B-Tree for equality and range queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Supports:
-- WHERE status = 'pending'
-- WHERE due_date > '2025-01-01'
-- ORDER BY created_at DESC
```

### ✅ CORRECT: GIN Index (Arrays, JSONB, Full-Text)

```sql
-- ✅ CORRECT: GIN for array queries
CREATE INDEX idx_tasks_tags_gin ON tasks USING GIN (tags);

-- ✅ CORRECT: GIN for JSONB queries
CREATE INDEX idx_events_metadata_gin ON events USING GIN (metadata);

-- Supports:
-- WHERE 'urgent' = ANY(tags)
-- WHERE metadata @> '{"status": "active"}'
```

### ✅ CORRECT: Partial Index

```sql
-- ✅ CORRECT: Index only subset of rows
CREATE INDEX idx_active_tasks ON tasks(org_id, due_date)
WHERE status = 'active';

-- More efficient than full index when querying active tasks
SELECT * FROM tasks 
WHERE org_id = '...' AND status = 'active' 
ORDER BY due_date;
```

---

## Creating Indexes

### ✅ CORRECT: Concurrent Index Creation

```sql
-- ✅ CORRECT: Concurrent index (doesn't lock table)
CREATE INDEX CONCURRENTLY idx_tasks_org_id ON tasks(org_id);

-- Use for production tables with existing data
-- Takes longer but doesn't block writes
```

### ✅ CORRECT: Composite Indexes

```sql
-- ✅ CORRECT: Multi-column index for common query patterns
CREATE INDEX idx_tasks_org_status ON tasks(org_id, status);

-- Efficient for:
SELECT * FROM tasks WHERE org_id = '...' AND status = 'active';
```

**Column Order Matters:**
- ✅ Most selective column first
- ✅ Equality columns before range columns
- ✅ Match your query patterns

---

## Index Maintenance

### ✅ CORRECT: Reindexing

```sql
-- ✅ CORRECT: Reindex concurrently (production)
REINDEX INDEX CONCURRENTLY idx_tasks_org_id;

-- ✅ CORRECT: Reindex table
REINDEX TABLE CONCURRENTLY tasks;
```

**When to Reindex:**
- ✅ After bulk data loads
- ✅ When indexes become bloated
- ✅ After significant data changes

---

## Index Advisor

### ✅ CORRECT: Using Index Advisor

1. **Dashboard → Query Performance**
2. **Select slow query**
3. **Indexes tab → Enable Index Advisor**
4. **Review recommendations**

**Understanding Results:**
- **Startup cost:** Cost to fetch first row
- **Total cost:** Cost to fetch all rows
- **Recommendations:** Suggested indexes with estimated improvement

---

## Best Practices Summary

### ✅ DO

1. **Index all foreign keys** - Critical for JOIN performance
2. **Index frequently queried columns** - WHERE, ORDER BY, JOIN
3. **Use CONCURRENTLY** - For production tables
4. **Create partial indexes** - When querying subset of rows
5. **Use GIN for arrays/JSONB** - Special index types
6. **Monitor query performance** - Use Index Advisor
7. **Reindex periodically** - After bulk operations

### ❌ DON'T

1. **Don't over-index** - Each index adds write overhead
2. **Don't index rarely queried columns** - Wasted resources
3. **Don't skip foreign key indexes** - Major performance impact
4. **Don't create indexes without testing** - Verify they're used
5. **Don't ignore Index Advisor** - Valuable suggestions

---

## Project-Specific Patterns

### Multi-Tenant Indexes

```sql
-- ✅ CORRECT: Composite index for org-based queries
CREATE INDEX idx_tasks_org_status ON tasks(org_id, status);
CREATE INDEX idx_tasks_org_created ON tasks(org_id, created_at DESC);

-- Efficient for:
SELECT * FROM tasks 
WHERE org_id = '...' AND status = 'active'
ORDER BY created_at DESC;
```

### RLS Performance

```sql
-- ✅ CORRECT: Index columns used in RLS policies
CREATE INDEX idx_profiles_org_id ON profiles(org_id);

-- RLS policy uses this index:
CREATE POLICY "org_isolation" ON tasks
  USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));
```

---

## References

- **Official Docs:** [Managing Indexes](https://supabase.com/docs/guides/database/postgres/indexes)
- **Next:** [04-joins-relationships.md](./04-joins-relationships.md)

---

**Last Updated:** January 27, 2025
