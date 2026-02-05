# Enums & Custom Types Best Practices

**Document:** 06-enums.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Managing Enums](https://supabase.com/docs/guides/database/postgres/enums)

---

## Overview

PostgreSQL Enums are custom data types for fixed sets of values. This guide covers when to use enums, how to create and manage them.

---

## Creating Enums

### ✅ CORRECT: Enum Definition

```sql
-- ✅ CORRECT: Create enum type
CREATE TYPE task_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled'
);

-- ✅ CORRECT: Use enum in table
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'pending'
);
```

---

## When to Use Enums

### ✅ Good Use Cases

- ✅ **Small, fixed sets** - Task status, priority levels
- ✅ **Rarely changing** - Continents, departments
- ✅ **Performance critical** - Single table vs. lookup join
- ✅ **Type safety** - Database enforces valid values

### ❌ Poor Use Cases

- ❌ **Frequently changing** - Use lookup table instead
- ❌ **Large sets** - Use foreign key to table
- ❌ **User-defined values** - Use TEXT with check constraint
- ❌ **Complex relationships** - Use normalized tables

---

## Managing Enums

### ✅ CORRECT: Adding Enum Values

```sql
-- ✅ CORRECT: Add new value to existing enum
ALTER TYPE task_status ADD VALUE 'on_hold';

-- ✅ CORRECT: Add value at specific position
ALTER TYPE task_status ADD VALUE 'blocked' BEFORE 'cancelled';
```

**⚠️ Important:**
- ✅ Can add values (safe)
- ❌ Cannot remove values (unsafe, breaks indexes)
- ✅ Can rename values (with migration)

### ✅ CORRECT: Querying Enum Values

```sql
-- ✅ CORRECT: Get all enum values
SELECT enum_range(NULL::task_status);

-- Returns: {pending,in_progress,completed,cancelled}
```

---

## Enum vs. Foreign Key

### ✅ CORRECT: Enum for Fixed Sets

```sql
-- ✅ CORRECT: Enum for small, fixed set
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE tasks (
  priority priority_level DEFAULT 'medium'
);
```

### ✅ CORRECT: Foreign Key for Dynamic Sets

```sql
-- ✅ CORRECT: Foreign key for dynamic, changing set
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE tasks (
  category_id UUID REFERENCES categories(id)
);
```

**Decision Matrix:**
- **Enum:** <10 values, rarely changes, performance critical
- **Foreign Key:** >10 values, frequently changes, needs metadata

---

## Best Practices Summary

### ✅ DO

1. **Use enums for fixed sets** - Small, stable value lists
2. **Add values carefully** - Can add, but can't remove
3. **Use descriptive names** - Clear enum type names
4. **Set defaults** - Default enum value in columns
5. **Document enum values** - In schema comments

### ❌ DON'T

1. **Don't use for dynamic sets** - Use foreign keys instead
2. **Don't create too many enums** - Prefer foreign keys for flexibility
3. **Don't remove enum values** - Breaks indexes, unsafe
4. **Don't use for user input** - Use TEXT with validation
5. **Don't ignore alternatives** - Consider check constraints

---

## Project-Specific Patterns

### Task Status Enum

```sql
-- ✅ CORRECT: Task status enum
CREATE TYPE task_status AS ENUM (
  'pending',
  'in_progress',
  'blocked',
  'completed',
  'cancelled'
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  status task_status NOT NULL DEFAULT 'pending',
  -- ...
);
```

### Priority Enum

```sql
-- ✅ CORRECT: Priority enum
CREATE TYPE priority_level AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TABLE tasks (
  priority priority_level DEFAULT 'medium',
  -- ...
);
```

---

## Alternatives to Enums

### ✅ CORRECT: Check Constraint

```sql
-- ✅ CORRECT: Check constraint for simple validation
CREATE TABLE tasks (
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);
```

**When to Use:**
- ✅ Simple validation
- ✅ May need to change values frequently
- ✅ Don't need type-level enforcement

---

## References

- **Official Docs:** [Managing Enums](https://supabase.com/docs/guides/database/postgres/enums)
- **Back to:** [00-index.md](./00-index.md)

---

**Last Updated:** January 27, 2025
