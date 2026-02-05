# JSON & JSONB Best Practices

**Document:** 05-json-jsonb.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [JSON and unstructured data](https://supabase.com/docs/guides/database/json)

---

## Overview

PostgreSQL supports JSON and JSONB for unstructured data. JSONB (binary) is recommended for almost all cases due to better performance.

---

## JSON vs JSONB

### ✅ CORRECT: Use JSONB (Recommended)

```sql
-- ✅ CORRECT: JSONB for better performance
CREATE TABLE events (
  id UUID PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL  -- Use JSONB, not JSON
);

-- ❌ WRONG: JSON stores exact text (slower)
metadata JSON  -- Avoid unless you need exact formatting
```

**Why JSONB:**
- ✅ Faster queries (binary format)
- ✅ Indexable (GIN indexes)
- ✅ Supports operators (`->`, `->>`, `@>`)
- ✅ Validates on insert

**When to Use JSON:**
- ⚠️ Only if you need exact text formatting preserved

---

## Creating JSONB Columns

### ✅ CORRECT: JSONB Column Definition

```sql
CREATE TABLE ai_runs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  agent_name TEXT,
  input_payload JSONB,      -- Input data
  output_payload JSONB,     -- Output data
  metadata JSONB            -- Additional metadata
);
```

---

## Inserting JSON Data

### ✅ CORRECT: Insert JSON Values

```sql
-- ✅ CORRECT: Insert JSONB
INSERT INTO events (event_type, metadata)
VALUES (
  'user_action',
  '{"action": "login", "ip": "192.168.1.1", "timestamp": "2025-01-27T10:00:00Z"}'::JSONB
);
```

**JavaScript/TypeScript:**
```typescript
// ✅ CORRECT: Pass object directly
const { data, error } = await supabase
  .from('events')
  .insert({
    event_type: 'user_action',
    metadata: {
      action: 'login',
      ip: '192.168.1.1',
      timestamp: new Date().toISOString()
    }  // Automatically converted to JSONB
  })
```

---

## Querying JSONB

### ✅ CORRECT: JSONB Operators

```sql
-- ✅ CORRECT: Get JSON value as text (->>)
SELECT metadata->>'action' FROM events;

-- ✅ CORRECT: Get JSON value as JSONB (->)
SELECT metadata->'user' FROM events;

-- ✅ CORRECT: Nested access
SELECT metadata->'user'->>'email' FROM events;

-- ✅ CORRECT: Check if key exists
SELECT * FROM events WHERE metadata ? 'action';

-- ✅ CORRECT: Check if contains JSON
SELECT * FROM events WHERE metadata @> '{"action": "login"}'::JSONB;

-- ✅ CORRECT: Check if keys exist
SELECT * FROM events WHERE metadata ?& ARRAY['action', 'ip'];
```

### ✅ CORRECT: JSONB Functions

```sql
-- ✅ CORRECT: Extract keys
SELECT jsonb_object_keys(metadata) FROM events;

-- ✅ CORRECT: Extract array elements
SELECT jsonb_array_elements(metadata->'tags') FROM events;

-- ✅ CORRECT: Merge JSONB objects
UPDATE events 
SET metadata = metadata || '{"updated": true}'::JSONB
WHERE id = '...';
```

---

## Indexing JSONB

### ✅ CORRECT: GIN Index for JSONB

```sql
-- ✅ CORRECT: GIN index for JSONB queries
CREATE INDEX idx_events_metadata_gin ON events USING GIN (metadata);

-- Now these queries are fast:
SELECT * FROM events WHERE metadata @> '{"action": "login"}'::JSONB;
SELECT * FROM events WHERE metadata ? 'action';
```

### ✅ CORRECT: Expression Index

```sql
-- ✅ CORRECT: Index specific JSONB path
CREATE INDEX idx_events_action ON events ((metadata->>'action'));

-- Fast queries on action field:
SELECT * FROM events WHERE metadata->>'action' = 'login';
```

---

## Validating JSON

### ✅ CORRECT: JSON Schema Validation

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_jsonschema;

-- Add constraint
ALTER TABLE events
ADD CONSTRAINT check_metadata CHECK (
  json_matches_schema(
    '{
      "type": "object",
      "properties": {
        "action": {"type": "string"},
        "ip": {"type": "string", "format": "ipv4"},
        "timestamp": {"type": "string", "format": "date-time"}
      },
      "required": ["action", "timestamp"]
    }',
    metadata
  )
);
```

---

## Best Practices Summary

### ✅ DO

1. **Use JSONB, not JSON** - Better performance
2. **Index JSONB columns** - GIN index for queries
3. **Use expression indexes** - For specific JSON paths
4. **Validate with pg_jsonschema** - Ensure data structure
5. **Use appropriate operators** - `->>`, `->`, `@>`, `?`
6. **Store structured data** - When schema is variable

### ❌ DON'T

1. **Don't use JSON** - Use JSONB instead
2. **Don't store everything as JSONB** - Use structured columns when possible
3. **Don't skip indexes** - GIN index for JSONB queries
4. **Don't nest too deeply** - Keep JSON structure reasonable
5. **Don't ignore validation** - Use constraints for critical fields

---

## When to Use JSONB

### ✅ Good Use Cases

- ✅ Webhook payloads (variable structure)
- ✅ User preferences (flexible settings)
- ✅ Event metadata (dynamic fields)
- ✅ API responses (cached data)
- ✅ Configuration data (variable schemas)

### ❌ Poor Use Cases

- ❌ Structured relational data (use tables)
- ❌ Frequently queried fields (use columns)
- ❌ Data with fixed schema (use columns)
- ❌ Large documents (consider external storage)

---

## References

- **Official Docs:** [JSON and unstructured data](https://supabase.com/docs/guides/database/json)
- **Next:** [06-enums.md](./06-enums.md)

---

**Last Updated:** January 27, 2025
