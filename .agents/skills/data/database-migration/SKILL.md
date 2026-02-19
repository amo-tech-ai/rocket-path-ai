---
name: database-migration
description: Use when creating tables, adding columns, writing RLS policies, creating database functions, or seeding data. Triggers on "migration", "new table", "schema", "RLS policy", "database function", "seed", "alter table".
---

# Database Migration

## Overview

Structured workflow for safe database schema changes with mandatory RLS policies and rollback planning.

## When to Use

- Creating new tables
- Adding/modifying columns
- Writing or updating RLS policies
- Creating database functions or triggers
- Seeding reference data

## Workflow

### Phase 1: Design

1. Define schema (columns, types, constraints)
2. Plan relationships (foreign keys)
3. Plan RLS policies (who can CRUD)
4. Identify indexes needed
5. Plan seed data if reference table

### Phase 2: Write Migration

```bash
supabase migration new <descriptive_name>
```

Template:
```sql
create table if not exists public.<table_name> (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.<table_name> enable row level security;

create policy "<table_name>_select_own" on public.<table_name>
  for select to authenticated using (user_id = (SELECT auth.uid()));

create policy "<table_name>_insert_own" on public.<table_name>
  for insert to authenticated with check (user_id = (SELECT auth.uid()));

create policy "<table_name>_update_own" on public.<table_name>
  for update to authenticated
  using (user_id = (SELECT auth.uid())) with check (user_id = (SELECT auth.uid()));

create policy "<table_name>_delete_own" on public.<table_name>
  for delete to authenticated using (user_id = (SELECT auth.uid()));

create index idx_<table_name>_user_id on public.<table_name>(user_id);
```

SQL style: lowercase keywords, snake_case names, `text` over `varchar`, always include `id`, `created_at`, `updated_at`.

### Phase 3: Apply & Verify

```bash
supabase db push
```

Verify:
1. Table exists
2. RLS enabled
3. All 4 CRUD policies exist
4. INSERT as auth user works
5. SELECT returns only own rows

## Checklist

- [ ] Migration file with timestamp prefix
- [ ] Table has `id`, `created_at`, `updated_at`
- [ ] User-owned tables have `user_id` FK
- [ ] RLS enabled
- [ ] SELECT/INSERT/UPDATE/DELETE policies with `(SELECT auth.uid())`
- [ ] Indexes on `user_id` and query columns
- [ ] Applied and verified

## References

- `.agents/skills/data/supabase-postgres-best-practices/SKILL.md`
- `.agents/skills/data/supabase-postgres-best-practices/references/security-rls-basics.md`
- `.agents/skills/data/supabase-postgres-best-practices/references/schema-data-types.md`
- `.agents/skills/data/supabase-postgres-best-practices/references/schema-lowercase-identifiers.md`
