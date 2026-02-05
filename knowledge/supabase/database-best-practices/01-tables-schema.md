# Tables & Schema Design Best Practices

**Document:** 01-tables-schema.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Tables and Data](https://supabase.com/docs/guides/database/tables)

---

## Overview

Proper table design is the foundation of a scalable database. This guide covers table creation, primary keys, data types, and schema organization.

---

## Table Creation

### ✅ CORRECT: Complete Table Definition

```sql
CREATE TABLE tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

**Key Elements:**
- ✅ Primary key defined
- ✅ Foreign keys with cascade rules
- ✅ NOT NULL constraints where appropriate
- ✅ Default values for common fields
- ✅ Timestamps for audit trail

### ✅ CORRECT: Naming Conventions

```sql
-- ✅ CORRECT: Lowercase with underscores
CREATE TABLE user_profiles (...)
CREATE TABLE task_assignments (...)
CREATE TABLE ai_runs (...)

-- ❌ WRONG: Mixed case, spaces, or camelCase
CREATE TABLE UserProfiles (...)
CREATE TABLE "Task Assignments" (...)
CREATE TABLE taskAssignments (...)
```

**Rules:**
- ✅ Use lowercase
- ✅ Use underscores for word separation
- ✅ Use plural nouns for table names
- ✅ Be descriptive but concise

---

## Primary Keys

### ✅ CORRECT: Identity Column (Recommended)

```sql
-- ✅ CORRECT: Auto-incrementing identity
CREATE TABLE tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
);

-- Alternative: UUID primary key
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
```

**When to Use:**
- **BIGINT IDENTITY:** Sequential IDs, smaller storage, better for joins
- **UUID:** Distributed systems, security (non-guessable), no sequence conflicts

### ✅ CORRECT: Composite Primary Keys

```sql
-- ✅ CORRECT: Many-to-many join tables
CREATE TABLE task_assignments (
  task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (task_id, user_id)
);
```

---

## Data Types

### ✅ CORRECT: Common Type Selection

| Use Case | Type | Example |
|----------|------|---------|
| **Primary Key** | `BIGINT` or `UUID` | `id BIGINT GENERATED ALWAYS AS IDENTITY` |
| **Text (Short)** | `TEXT` or `VARCHAR(n)` | `title TEXT NOT NULL` |
| **Text (Fixed)** | `VARCHAR(n)` | `status_code VARCHAR(10)` |
| **Numbers** | `INTEGER`, `BIGINT`, `NUMERIC` | `priority INTEGER DEFAULT 0` |
| **Money** | `NUMERIC(10,2)` | `price NUMERIC(10,2)` |
| **Boolean** | `BOOLEAN` | `is_completed BOOLEAN DEFAULT FALSE` |
| **Dates** | `TIMESTAMPTZ` | `created_at TIMESTAMPTZ DEFAULT NOW()` |
| **JSON** | `JSONB` | `metadata JSONB` |
| **Arrays** | `TEXT[]`, `INTEGER[]` | `tags TEXT[]` |

### ✅ CORRECT: Timestamp Best Practices

```sql
-- ✅ CORRECT: Always use TIMESTAMPTZ (with timezone)
CREATE TABLE tasks (
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date TIMESTAMPTZ
);

-- ❌ WRONG: Don't use TIMESTAMP (without timezone)
created_at TIMESTAMP  -- Loses timezone information
```

**Why TIMESTAMPTZ:**
- ✅ Stores UTC internally
- ✅ Converts to user's timezone automatically
- ✅ Prevents timezone bugs

---

## Columns

### ✅ CORRECT: Column Constraints

```sql
CREATE TABLE tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,                    -- Required field
  description TEXT,                        -- Optional field
  status TEXT NOT NULL DEFAULT 'pending',  -- Default value
  priority INTEGER CHECK (priority >= 0 AND priority <= 5),  -- Validation
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,  -- Foreign key
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- Auto-timestamp
);
```

### ✅ CORRECT: Check Constraints

```sql
-- ✅ CORRECT: Validate data at database level
CREATE TABLE tasks (
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority INTEGER CHECK (priority >= 0 AND priority <= 5),
  due_date TIMESTAMPTZ CHECK (due_date > created_at)
);
```

---

## Foreign Keys

### ✅ CORRECT: Foreign Key Patterns

```sql
-- ✅ CORRECT: With cascade delete
ALTER TABLE tasks
  ADD COLUMN org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE;

-- ✅ CORRECT: With set null (preserve task, remove user reference)
ALTER TABLE tasks
  ADD COLUMN assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- ✅ CORRECT: With restrict (prevent delete if referenced)
ALTER TABLE tasks
  ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE RESTRICT;
```

**Cascade Rules:**
- **CASCADE:** Delete child records when parent deleted
- **SET NULL:** Set foreign key to NULL when parent deleted
- **RESTRICT:** Prevent parent deletion if children exist

---

## Schemas

### ✅ CORRECT: Schema Organization

```sql
-- ✅ CORRECT: Public schema for API-accessible tables
CREATE TABLE public.tasks (...);

-- ✅ CORRECT: Private schema for internal tables
CREATE SCHEMA private;
CREATE TABLE private.audit_logs (...);

-- ✅ CORRECT: API schema for views
CREATE SCHEMA api;
CREATE VIEW api.user_dashboard AS SELECT ...;
```

**Schema Strategy:**
- **public:** Tables accessible via Supabase API (with RLS)
- **private:** Internal tables, not exposed via API
- **api:** Views for complex queries

---

## Best Practices Summary

### ✅ DO

1. **Always define primary keys** - Every table needs unique identifier
2. **Use appropriate data types** - TEXT for strings, INTEGER for numbers
3. **Use TIMESTAMPTZ** - Never TIMESTAMP without timezone
4. **Add NOT NULL constraints** - For required fields
5. **Set default values** - For common fields (status, timestamps)
6. **Use foreign keys** - Enforce referential integrity
7. **Add check constraints** - Validate data at database level
8. **Use lowercase with underscores** - Consistent naming
9. **Include audit fields** - created_at, updated_at
10. **Organize with schemas** - public, private, api

### ❌ DON'T

1. **Don't skip primary keys** - Every table needs one
2. **Don't use mixed case** - Stick to lowercase
3. **Don't use TIMESTAMP** - Use TIMESTAMPTZ
4. **Don't skip foreign keys** - Enforce relationships
5. **Don't allow NULL everywhere** - Use NOT NULL for required fields
6. **Don't use TEXT for everything** - Choose appropriate types
7. **Don't skip defaults** - For status, timestamps, etc.
8. **Don't forget indexes** - On foreign keys and frequently queried columns

---

## Project-Specific Patterns

### Multi-Tenant Tables

```sql
-- ✅ CORRECT: All tables include org_id
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  -- ... other columns
);

-- Index for org-based queries
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
```

### Audit Fields

```sql
-- ✅ CORRECT: Standard audit fields
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ... business columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);
```

---

## References

- **Official Docs:** [Tables and Data](https://supabase.com/docs/guides/database/tables)
- **Next:** [02-arrays.md](./02-arrays.md)

---

**Last Updated:** January 27, 2025
