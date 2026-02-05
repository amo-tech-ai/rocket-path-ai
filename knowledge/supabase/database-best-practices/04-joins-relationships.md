# Joins & Relationships Best Practices

**Document:** 04-joins-relationships.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Querying Joins](https://supabase.com/docs/guides/database/joins-and-nesting)

---

## Overview

PostgreSQL relationships enable powerful queries across related tables. This guide covers foreign keys, one-to-many, many-to-many relationships, and nested queries.

---

## Foreign Keys

### ✅ CORRECT: Foreign Key Definition

```sql
-- ✅ CORRECT: One-to-many relationship
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE RESTRICT
);
```

**Cascade Rules:**
- **CASCADE:** Delete child when parent deleted
- **SET NULL:** Set FK to NULL when parent deleted
- **RESTRICT:** Prevent parent deletion if children exist

---

## One-to-Many Relationships

### ✅ CORRECT: Basic One-to-Many

```sql
-- Parent table
CREATE TABLE orgs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

-- Child table
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  title TEXT NOT NULL
);
```

### ✅ CORRECT: Nested Queries (Supabase Client)

```typescript
// ✅ CORRECT: Automatic relationship detection
const { data, error } = await supabase
  .from('orgs')
  .select(`
    id,
    name,
    tasks (
      id,
      title,
      status
    )
  `)

// Returns:
// {
//   id: '...',
//   name: 'Acme Corp',
//   tasks: [
//     { id: 1, title: 'Task 1', status: 'active' },
//     { id: 2, title: 'Task 2', status: 'pending' }
//   ]
// }
```

---

## Many-to-Many Relationships

### ✅ CORRECT: Join Table Pattern

```sql
-- Users table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

-- Join table
CREATE TABLE team_members (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, team_id)
);
```

### ✅ CORRECT: Querying Many-to-Many

```typescript
// ✅ CORRECT: Supabase automatically detects join table
const { data, error } = await supabase
  .from('teams')
  .select(`
    id,
    name,
    profiles (
      id,
      name,
      email
    )
  `)

// Returns teams with their members
```

---

## Complex Joins

### ✅ CORRECT: Multiple Foreign Keys to Same Table

```sql
-- Tasks with start and end events
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  title TEXT,
  start_event_id BIGINT REFERENCES events(id),
  end_event_id BIGINT REFERENCES events(id)
);
```

### ✅ CORRECT: Explicit Join Syntax

```typescript
// ✅ CORRECT: Specify which FK to use
const { data, error } = await supabase
  .from('tasks')
  .select(`
    *,
    start_event:events!start_event_id (
      id,
      name,
      timestamp
    ),
    end_event:events!end_event_id (
      id,
      name,
      timestamp
    )
  `)
```

---

## TypeScript Types for Joins

### ✅ CORRECT: Type-Safe Join Queries

```typescript
import { QueryData, QueryError } from '@supabase/supabase-js'

// Define query
const orgsWithTasksQuery = supabase
  .from('orgs')
  .select(`
    id,
    name,
    tasks (
      id,
      title,
      status
    )
  `)

// Extract type
type OrgsWithTasks = QueryData<typeof orgsWithTasksQuery>

// Use typed result
const { data, error } = await orgsWithTasksQuery
if (error) throw error
const orgs: OrgsWithTasks = data
```

---

## Best Practices Summary

### ✅ DO

1. **Always define foreign keys** - Enforce referential integrity
2. **Index foreign keys** - Critical for JOIN performance
3. **Use appropriate cascade rules** - CASCADE, SET NULL, RESTRICT
4. **Use nested selects** - Supabase auto-detects relationships
5. **Specify join columns** - When multiple FKs to same table
6. **Use TypeScript types** - QueryData for type safety

### ❌ DON'T

1. **Don't skip foreign keys** - Data integrity issues
2. **Don't forget indexes** - On all foreign key columns
3. **Don't use arrays for relationships** - Use proper foreign keys
4. **Don't over-nest queries** - Keep depth reasonable (2-3 levels)
5. **Don't ignore cascade rules** - Choose appropriate behavior

---

## Project-Specific Patterns

### Multi-Tenant Joins

```typescript
// ✅ CORRECT: Always filter by org_id in joins
const { data, error } = await supabase
  .from('orgs')
  .select(`
    id,
    name,
    tasks!inner (
      id,
      title,
      status
    )
  `)
  .eq('id', orgId)  // Filter by org
  .eq('tasks.org_id', orgId)  // Ensure tasks belong to org
```

---

## References

- **Official Docs:** [Querying Joins](https://supabase.com/docs/guides/database/joins-and-nesting)
- **Next:** [05-json-jsonb.md](./05-json-jsonb.md)

---

**Last Updated:** January 27, 2025
