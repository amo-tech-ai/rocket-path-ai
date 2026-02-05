# Working with Arrays Best Practices

**Document:** 02-arrays.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Working With Arrays](https://supabase.com/docs/guides/database/arrays)

---

## Overview

PostgreSQL supports flexible array types. This guide covers creating, querying, and optimizing array columns.

---

## Creating Array Columns

### ✅ CORRECT: Array Column Definition

```sql
-- ✅ CORRECT: Text array
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  tags TEXT[]  -- Array of text values
);

-- ✅ CORRECT: Integer array
CREATE TABLE events (
  id UUID PRIMARY KEY,
  event_name TEXT,
  participant_ids INTEGER[]  -- Array of integers
);

-- ✅ CORRECT: UUID array
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT,
  team_member_ids UUID[]  -- Array of UUIDs
);
```

---

## Inserting Array Data

### ✅ CORRECT: Insert Array Values

```sql
-- ✅ CORRECT: Insert with array literal
INSERT INTO tasks (title, tags)
VALUES (
  'Implement user authentication',
  ARRAY['backend', 'security', 'priority']
);

-- ✅ CORRECT: Using array constructor
INSERT INTO tasks (title, tags)
VALUES (
  'Fix bug in dashboard',
  ARRAY['bug', 'frontend', 'urgent']
);

-- ✅ CORRECT: Empty array
INSERT INTO tasks (title, tags)
VALUES (
  'New feature',
  ARRAY[]::TEXT[]
);
```

**JavaScript/TypeScript:**
```typescript
// ✅ CORRECT: Pass array directly
const { data, error } = await supabase
  .from('tasks')
  .insert({
    title: 'Implement feature',
    tags: ['backend', 'api', 'priority']  // Array passed directly
  })
```

---

## Querying Arrays

### ✅ CORRECT: Array Operators

```sql
-- ✅ CORRECT: Check if array contains value
SELECT * FROM tasks WHERE 'urgent' = ANY(tags);

-- ✅ CORRECT: Check if array contains all values
SELECT * FROM tasks WHERE tags @> ARRAY['backend', 'api'];

-- ✅ CORRECT: Check if arrays overlap
SELECT * FROM tasks WHERE tags && ARRAY['frontend', 'ui'];

-- ✅ CORRECT: Get array length
SELECT title, array_length(tags, 1) as tag_count FROM tasks;

-- ✅ CORRECT: Access array element (1-based indexing)
SELECT title, tags[1] as first_tag FROM tasks;
```

### ✅ CORRECT: Array Functions

```sql
-- ✅ CORRECT: Unnest array to rows
SELECT id, title, unnest(tags) as tag FROM tasks;

-- ✅ CORRECT: Append to array
UPDATE tasks 
SET tags = array_append(tags, 'new-tag')
WHERE id = 1;

-- ✅ CORRECT: Remove from array
UPDATE tasks 
SET tags = array_remove(tags, 'old-tag')
WHERE id = 1;

-- ✅ CORRECT: Concatenate arrays
UPDATE tasks 
SET tags = tags || ARRAY['additional', 'tags']
WHERE id = 1;
```

---

## Indexing Arrays

### ✅ CORRECT: GIN Index for Arrays

```sql
-- ✅ CORRECT: GIN index for array queries
CREATE INDEX idx_tasks_tags_gin ON tasks USING GIN (tags);

-- Now these queries are fast:
SELECT * FROM tasks WHERE 'urgent' = ANY(tags);
SELECT * FROM tasks WHERE tags @> ARRAY['backend'];
```

**When to Use:**
- ✅ Frequently querying array contents
- ✅ Using `ANY`, `@>`, `&&` operators
- ✅ Arrays with many elements

---

## Best Practices Summary

### ✅ DO

1. **Use arrays for simple lists** - Tags, categories, IDs
2. **Use GIN indexes** - For array queries
3. **Use appropriate operators** - `ANY`, `@>`, `&&`
4. **Handle empty arrays** - Use `ARRAY[]::TYPE[]`
5. **Consider array length** - Very large arrays may need normalization

### ❌ DON'T

1. **Don't use arrays for relationships** - Use foreign keys instead
2. **Don't store large arrays** - Normalize if >100 elements
3. **Don't skip indexes** - GIN index for array queries
4. **Don't mix data types** - Arrays must be homogeneous

---

## When to Use Arrays vs. Normalized Tables

### ✅ Use Arrays For:

- ✅ Simple tags/categories (limited set)
- ✅ Ordered lists (e.g., task checklist)
- ✅ Small, frequently accessed lists (<50 items)
- ✅ Data that's always accessed together

### ❌ Use Normalized Tables For:

- ❌ Relationships between entities
- ❌ Large lists (>100 items)
- ❌ Data that needs individual queries
- ❌ Data that changes frequently

**Example:**
```sql
-- ✅ CORRECT: Tags as array (small, simple)
CREATE TABLE tasks (
  tags TEXT[]  -- ['urgent', 'backend', 'api']
);

-- ✅ CORRECT: Team members as normalized table (relationships)
CREATE TABLE task_assignments (
  task_id BIGINT REFERENCES tasks(id),
  user_id UUID REFERENCES profiles(id),
  PRIMARY KEY (task_id, user_id)
);
```

---

## References

- **Official Docs:** [Working With Arrays](https://supabase.com/docs/guides/database/arrays)
- **Next:** [03-indexes.md](./03-indexes.md)

---

**Last Updated:** January 27, 2025
