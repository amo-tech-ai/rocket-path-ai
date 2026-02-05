---
name: Supabase Database
description: Write Supabase migrations, RLS policies, database functions, and SQL queries following official best practices. Use when working with Supabase database schema, security policies, PostgreSQL functions, or any database-related task.
version: 1.0.0
---

# Supabase Database

This skill teaches agents how to work with Supabase database operations including migrations, RLS policies, database functions, and SQL queries following official best practices.

## When to Use

- When creating or modifying database schema
- When writing database migrations
- When implementing Row Level Security (RLS) policies
- When creating PostgreSQL functions or triggers
- When writing SQL queries for Supabase
- When working with database seeds or test data

## Core Principles

### Migration-Based Schema Changes

**All schema changes via migrations:**
- Create migrations: `supabase db diff -f migration_name`
- Apply migrations: `supabase db push`
- Never modify schema directly in Supabase Dashboard
- All migrations versioned and tracked in `supabase/migrations/`

### Row Level Security (RLS)

**Always enable RLS on new tables:**
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Write granular policies:**
- Separate policies for SELECT, INSERT, UPDATE, DELETE
- Separate policies for authenticated vs anon roles
- Test policies thoroughly before deploying

### Type Safety

**Use auto-generated types:**
- Generate types: `supabase gen types typescript --local > src/integrations/supabase/types.ts`
- Use generated types: `Tables<'startups'>`, `TablesInsert<'contacts'>`
- Never define types manually — always generate from schema

## Migration Workflow

### Creating Migrations

**1. Make schema changes in local database:**
```bash
supabase start
# Make changes via Supabase Studio or SQL editor
```

**2. Generate migration from diff:**
```bash
supabase db diff -f migration_name
```

**3. Review generated migration:**
```sql
-- supabase/migrations/YYYYMMDDHHmmss_migration_name.sql
-- Review SQL before applying
```

**4. Apply migration:**
```bash
# Local
supabase db reset

# Remote
supabase db push
```

### Migration Naming Convention

**Format:** `YYYYMMDDHHmmss_short_description.sql`

**Examples:**
- `20260115120001_extensions_and_helpers.sql`
- `20260115120002_core_tables.sql`
- `20260115120003_crm_tables.sql`

### Migration Structure

**Template:**
```sql
-- Migration: description
-- Created: YYYY-MM-DD

-- Step 1: Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create types
CREATE TYPE status_type AS ENUM ('active', 'inactive');

-- Step 3: Create tables
CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Enable RLS
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
CREATE POLICY "Users can read own org's startups"
  ON startups FOR SELECT
  USING (org_id = user_org_id());

-- Step 6: Create indexes
CREATE INDEX idx_startups_org_id ON startups(org_id);

-- Step 7: Create triggers (if needed)
CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON startups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## RLS Policies

### Policy Structure

**Granular Policies:**
```sql
-- Separate policy for each operation
CREATE POLICY "policy_name_select" ON table_name
  FOR SELECT USING (condition);

CREATE POLICY "policy_name_insert" ON table_name
  FOR INSERT WITH CHECK (condition);

CREATE POLICY "policy_name_update" ON table_name
  FOR UPDATE USING (condition) WITH CHECK (condition);

CREATE POLICY "policy_name_delete" ON table_name
  FOR DELETE USING (condition);
```

### Helper Functions

**Common helpers in this project:**
- `user_org_id()` — Current user's org_id
- `org_role()` — User's role in org
- `startup_in_org(id)` — Check startup belongs to user's org

**Example:**
```sql
CREATE POLICY "Users can read own org's startups"
  ON startups FOR SELECT
  USING (org_id = user_org_id());
```

### Policy Patterns

**Org-scoped tables:**
```sql
-- Users can only access their own org's data
USING (org_id = user_org_id())
```

**Startup-scoped tables:**
```sql
-- Users can access if startup belongs to their org
USING (startup_id IN (
  SELECT id FROM startups WHERE org_id = user_org_id()
))
```

**User-scoped tables:**
```sql
-- Users can only access their own data
USING (user_id = auth.uid())
```

## Database Functions

### Function Template

```sql
CREATE OR REPLACE FUNCTION function_name(param1 TYPE)
RETURNS RETURN_TYPE
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Function logic
  RETURN result;
END;
$$;
```

### Common Helper Functions

**Update updated_at trigger:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**User org helper:**
```sql
CREATE OR REPLACE FUNCTION user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM organization_members WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;
```

## Type Generation

### Generate TypeScript Types

**Command:**
```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

**Or from remote:**
```bash
supabase gen types typescript --project-id your-project-ref > src/integrations/supabase/types.ts
```

### Using Generated Types

**In TypeScript code:**
```typescript
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Startup = Tables<'startups'>;
type NewStartup = TablesInsert<'startups'>;
type UpdateStartup = TablesUpdate<'startups'>;
```

**Never define types manually** — always generate from schema.

## SQL Query Patterns

### Supabase Client Queries

**Select with filters:**
```typescript
const { data, error } = await supabase
  .from('startups')
  .select('*')
  .eq('org_id', orgId)
  .order('created_at', { ascending: false });
```

**Insert with RLS:**
```typescript
const { data, error } = await supabase
  .from('startups')
  .insert({ name: 'Startup Name', org_id: orgId })
  .select()
  .single();
```

**Update with RLS:**
```typescript
const { data, error } = await supabase
  .from('startups')
  .update({ name: 'New Name' })
  .eq('id', startupId)
  .select()
  .single();
```

## Best Practices

### ✅ DO

- Create migrations for all schema changes
- Enable RLS on all tables
- Write granular policies (separate SELECT/INSERT/UPDATE/DELETE)
- Test policies before deploying
- Generate types after schema changes
- Use helper functions for common patterns
- Add indexes for frequently queried columns
- Use proper foreign key constraints

### ❌ DON'T

- Don't modify schema directly in Dashboard (use migrations)
- Don't disable RLS (security risk)
- Don't create overly permissive policies
- Don't define types manually (generate from schema)
- Don't skip policy testing
- Don't forget to add indexes for foreign keys
- Don't use SELECT * in production (specify columns)

## Reference

- **Rules:** `.cursor/rules/supabase/supabase-*.mdc` (multiple files)
- **CLI Rules:** `.cursor/rules/supabase/supabase-cli.mdc`
- **Schema Rules:** `.cursor/rules/supabase/supabase-schema.mdc`
- **Migration Rules:** `.cursor/rules/supabase/supabase-create-migration.mdc`
- **RLS Rules:** `.cursor/rules/supabase/supabase-create-rls-policies.mdc`
- **Function Rules:** `.cursor/rules/supabase/supabase-create-db-functions.mdc`
- **Supabase Docs:** [PostgreSQL](https://supabase.com/docs/guides/database)

---

**Created:** 2025-01-16  
**Based on:** Supabase database best practices  
**Version:** 1.0.0
