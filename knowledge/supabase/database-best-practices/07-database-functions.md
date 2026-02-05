# Database Functions Best Practices

**Document:** 07-database-functions.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [PostgreSQL Functions](https://supabase.com/docs/guides/database/functions)

---

## Overview

PostgreSQL functions (stored procedures) enable reusable SQL logic, complex calculations, and secure data access patterns. This guide covers function creation, security, performance, and best practices for Supabase.

---

## Core Principles

### 1. Security Model

**Default: `SECURITY INVOKER`** ✅
- Function runs with permissions of the calling user
- Respects RLS policies automatically
- Safer for most use cases

**Use `SECURITY DEFINER`** ⚠️ Only When Needed
- Function runs with permissions of function owner
- Bypasses RLS (use carefully)
- Required for helper functions used in RLS policies

### 2. Search Path Security

**CRITICAL:** Always set `search_path = ''`

```sql
-- ✅ CORRECT
create or replace function public.calculate_total(amount numeric)
returns numeric
language plpgsql
security invoker
set search_path = ''  -- ✅ REQUIRED for security
as $$
begin
  return amount * 1.1;
end;
$$;

-- ❌ WRONG - Vulnerable to search_path injection
create or replace function public.calculate_total(amount numeric)
returns numeric
language plpgsql
-- Missing: set search_path = ''
as $$
begin
  return amount * 1.1;
end;
$$;
```

**Why:** Prevents malicious users from creating functions/tables in schemas that would be searched before `public`, causing your function to execute unintended code.

### 3. Fully Qualified Names

When `search_path = ''`, you **must** use fully qualified names:

```sql
-- ✅ CORRECT - Fully qualified
create or replace function public.get_user_org()
returns uuid
language sql
security definer
set search_path = ''
stable
as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- ❌ WRONG - Unqualified (will fail with empty search_path)
create or replace function public.get_user_org()
returns uuid
language sql
security definer
set search_path = ''
stable
as $$
  select org_id from profiles where id = auth.uid()  -- Missing 'public.'
$$;
```

---

## Function Types

### 1. SQL Functions

**Best For:** Simple calculations, data transformations

```sql
-- ✅ CORRECT - SQL function
create or replace function public.full_name(first_name text, last_name text)
returns text
language sql
security invoker
set search_path = ''
immutable  -- ✅ Can be marked immutable if deterministic
as $$
  select first_name || ' ' || last_name;
$$;
```

**Characteristics:**
- Fast execution (compiled to query plan)
- Can be marked `IMMUTABLE` if deterministic
- Limited to SQL expressions (no control flow)

### 2. PL/pgSQL Functions

**Best For:** Complex logic, control flow, error handling

```sql
-- ✅ CORRECT - PL/pgSQL function
create or replace function public.calculate_task_score(
  task_id uuid,
  user_id uuid
)
returns integer
language plpgsql
security invoker
set search_path = ''
stable  -- ✅ Stable (depends on database state)
as $$
declare
  base_score integer;
  priority_bonus integer;
  final_score integer;
begin
  -- Get base score
  select priority * 10
  into base_score
  from public.tasks
  where id = task_id and user_id = calculate_task_score.user_id;
  
  if base_score is null then
    raise exception 'Task not found or access denied';
  end if;
  
  -- Calculate bonus
  priority_bonus := case
    when base_score > 50 then 20
    when base_score > 30 then 10
    else 0
  end;
  
  final_score := base_score + priority_bonus;
  
  return final_score;
end;
$$;
```

**Characteristics:**
- Full control flow (IF/ELSE, loops, exceptions)
- Variable declarations
- Error handling with `RAISE EXCEPTION`
- Can modify data (INSERT, UPDATE, DELETE)

### 3. Trigger Functions

**Best For:** Automatic data updates, validation, audit logging

```sql
-- ✅ CORRECT - Trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer  -- ✅ Required for triggers
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Attach trigger
create trigger handle_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();
```

**Characteristics:**
- Must return `TRIGGER` type
- Access `NEW` and `OLD` record variables
- Must use `SECURITY DEFINER` (triggers run as table owner)
- Return `NEW` for INSERT/UPDATE, `OLD` for DELETE

---

## Volatility Categories

PostgreSQL uses volatility to optimize function execution:

### IMMUTABLE

**Use When:** Function always returns same output for same input (pure function)

```sql
-- ✅ CORRECT - Immutable function
create or replace function public.calculate_discount(price numeric, percent numeric)
returns numeric
language sql
security invoker
set search_path = ''
immutable  -- ✅ No database access, pure calculation
as $$
  select price * (percent / 100);
$$;
```

**Characteristics:**
- Can be evaluated at query planning time
- Can be used in indexes
- Cannot access database or use non-deterministic functions

### STABLE

**Use When:** Function returns same result within a transaction (most common)

```sql
-- ✅ CORRECT - Stable function
create or replace function public.get_user_org()
returns uuid
language sql
security definer
set search_path = ''
stable  -- ✅ Reads database, but result stable within transaction
as $$
  select org_id from public.profiles where id = auth.uid()
$$;
```

**Characteristics:**
- Can access database
- Result may change between transactions
- Cannot be used in indexes
- **Default for most functions**

### VOLATILE

**Use When:** Function has side effects or non-deterministic results

```sql
-- ✅ CORRECT - Volatile function
create or replace function public.generate_audit_log(
  table_name text,
  action text,
  record_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
volatile  -- ✅ Has side effects (INSERT), uses NOW()
as $$
declare
  log_id uuid;
begin
  insert into public.audit_log (table_name, action, record_id, created_at)
  values (generate_audit_log.table_name, generate_audit_log.action, generate_audit_log.record_id, now())
  returning id into log_id;
  
  return log_id;
end;
$$;
```

**Characteristics:**
- Default if not specified
- Can modify data
- Can use non-deterministic functions (NOW(), RANDOM())
- Cannot be optimized by planner

---

## Security Patterns

### Pattern 1: RLS Helper Functions

**Use Case:** Functions used in RLS policies

```sql
-- ✅ CORRECT - RLS helper function
create or replace function auth.user_org_id()
returns uuid
language sql
security definer  -- ✅ Required to bypass RLS in policy
set search_path = ''
stable
as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- Use in RLS policy
create policy "Users see only their org's data"
  on public.tasks
  for select
  to authenticated
  using (org_id = auth.user_org_id());  -- ✅ Uses helper function
```

**Key Points:**
- Must use `SECURITY DEFINER` to access `public.profiles` in policy
- Must use `set search_path = ''` for security
- Should be `STABLE` for performance
- Place in `auth` schema for clarity

### Pattern 2: Data Access Functions

**Use Case:** Complex queries with business logic

```sql
-- ✅ CORRECT - Data access function
create or replace function public.get_startup_metrics(startup_id uuid)
returns table (
  total_tasks integer,
  completed_tasks integer,
  completion_rate numeric,
  avg_priority numeric
)
language plpgsql
security invoker  -- ✅ Respects RLS
set search_path = ''
stable
as $$
begin
  return query
  select
    count(*)::integer as total_tasks,
    count(*) filter (where status = 'completed')::integer as completed_tasks,
    round(
      count(*) filter (where status = 'completed')::numeric / 
      nullif(count(*), 0) * 100, 
      2
    ) as completion_rate,
    round(avg(priority), 2) as avg_priority
  from public.tasks
  where startup_id = get_startup_metrics.startup_id;
end;
$$;
```

**Key Points:**
- Use `SECURITY INVOKER` to respect RLS
- Returns table type for multiple rows
- Uses `RETURN QUERY` for result sets

### Pattern 3: Validation Functions

**Use Case:** Data validation before INSERT/UPDATE

```sql
-- ✅ CORRECT - Validation function
create or replace function public.validate_email(email text)
returns boolean
language plpgsql
security invoker
set search_path = ''
immutable
as $$
begin
  -- Simple email validation
  return email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
end;
$$;

-- Use in CHECK constraint
alter table public.profiles
  add constraint profiles_email_valid
  check (public.validate_email(email));
```

**Key Points:**
- Can be `IMMUTABLE` if pure validation
- Can be used in CHECK constraints
- Useful for complex validation logic

---

## Performance Best Practices

### 1. Use Appropriate Volatility

```sql
-- ✅ GOOD - Immutable for pure calculations
create or replace function public.calculate_tax(amount numeric)
returns numeric
language sql
immutable
as $$ select amount * 0.1 $$;

-- ✅ GOOD - Stable for database reads
create or replace function public.get_user_name()
returns text
language sql
stable
as $$ select name from public.profiles where id = auth.uid() $$;

-- ✅ GOOD - Volatile for writes
create or replace function public.log_action(action text)
returns void
language plpgsql
volatile
as $$ begin insert into audit_log (action) values (action); end; $$;
```

### 2. Avoid Row-by-Row Processing

```sql
-- ❌ BAD - Row-by-row processing
create or replace function public.update_all_tasks()
returns void
language plpgsql
as $$
declare
  task_record record;
begin
  for task_record in select * from public.tasks loop
    update public.tasks
    set updated_at = now()
    where id = task_record.id;
  end loop;
end;
$$;

-- ✅ GOOD - Set-based operation
create or replace function public.update_all_tasks()
returns void
language sql
as $$
  update public.tasks set updated_at = now();
$$;
```

### 3. Use Indexes in Functions

```sql
-- ✅ GOOD - Function uses indexed column
create or replace function public.get_tasks_by_user(user_id uuid)
returns setof public.tasks
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  return query
  select *
  from public.tasks
  where user_id = get_tasks_by_user.user_id  -- ✅ Indexed column
  order by created_at desc;
end;
$$;

-- Ensure index exists
create index if not exists idx_tasks_user_id on public.tasks(user_id);
```

---

## Error Handling

### Pattern 1: Validation Errors

```sql
-- ✅ CORRECT - Clear error messages
create or replace function public.create_task(
  title text,
  user_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  task_id uuid;
begin
  -- Validate input
  if title is null or trim(title) = '' then
    raise exception 'Task title cannot be empty' using errcode = 'P0001';
  end if;
  
  if not exists (select 1 from public.profiles where id = create_task.user_id) then
    raise exception 'User not found' using errcode = 'P0002';
  end if;
  
  -- Create task
  insert into public.tasks (title, user_id)
  values (create_task.title, create_task.user_id)
  returning id into task_id;
  
  return task_id;
exception
  when unique_violation then
    raise exception 'Task already exists' using errcode = '23505';
  when foreign_key_violation then
    raise exception 'Invalid user_id' using errcode = '23503';
end;
$$;
```

### Pattern 2: Graceful Degradation

```sql
-- ✅ CORRECT - Returns null on error
create or replace function public.safe_get_user_name(user_id uuid)
returns text
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  return (
    select name
    from public.profiles
    where id = safe_get_user_name.user_id
  );
exception
  when others then
    return null;  -- ✅ Graceful fallback
end;
$$;
```

---

## Common Patterns

### Pattern 1: Upsert with Conflict Resolution

```sql
-- ✅ CORRECT - Upsert pattern
create or replace function public.upsert_contact(
  contact_email text,
  contact_name text,
  org_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = ''
volatile
as $$
declare
  contact_id uuid;
begin
  insert into public.contacts (email, name, org_id)
  values (contact_email, contact_name, upsert_contact.org_id)
  on conflict (email, org_id) do update
  set name = excluded.name,
      updated_at = now()
  returning id into contact_id;
  
  return contact_id;
end;
$$;
```

### Pattern 2: Batch Operations

```sql
-- ✅ CORRECT - Batch insert
create or replace function public.batch_create_tasks(
  task_data jsonb
)
returns table (id uuid, title text)
language plpgsql
security invoker
set search_path = ''
volatile
as $$
begin
  return query
  insert into public.tasks (title, user_id, org_id)
  select
    (item->>'title')::text,
    (item->>'user_id')::uuid,
    (item->>'org_id')::uuid
  from jsonb_array_elements(task_data) as item
  returning public.tasks.id, public.tasks.title;
end;
$$;
```

### Pattern 3: Aggregation Functions

```sql
-- ✅ CORRECT - Complex aggregation
create or replace function public.get_org_statistics(org_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = ''
stable
as $$
declare
  stats jsonb;
begin
  select jsonb_build_object(
    'total_tasks', count(*) filter (where t.id is not null),
    'completed_tasks', count(*) filter (where t.status = 'completed'),
    'total_projects', count(distinct p.id),
    'total_users', count(distinct pr.id)
  )
  into stats
  from public.organizations o
  left join public.tasks t on t.org_id = o.id
  left join public.projects p on p.org_id = o.id
  left join public.profiles pr on pr.org_id = o.id
  where o.id = get_org_statistics.org_id
  group by o.id;
  
  return stats;
end;
$$;
```

---

## Testing Functions

### Unit Testing Pattern

```sql
-- ✅ CORRECT - Test function
do $$
declare
  result numeric;
begin
  -- Test calculation
  select public.calculate_total(100) into result;
  
  if result != 110 then
    raise exception 'Test failed: expected 110, got %', result;
  end if;
  
  raise notice 'Test passed: calculate_total(100) = %', result;
end;
$$;
```

---

## Project-Specific Functions

### Current Helper Functions

**Location:** `supabase/migrations/20260115120001_extensions_and_helpers.sql`

1. **`auth.user_org_id()`** - Get current user's org_id
2. **`auth.is_org_member(uuid)`** - Check org membership
3. **`auth.org_role()`** - Get user's org role
4. **`auth.startup_in_org(uuid)`** - Check startup ownership
5. **`public.handle_updated_at()`** - Trigger function for timestamps

**All follow best practices:**
- ✅ `SECURITY DEFINER` (for RLS helpers) or `SECURITY INVOKER`
- ✅ `set search_path = ''`
- ✅ Fully qualified names (`public.profiles`)
- ✅ `STABLE` volatility
- ✅ Comprehensive comments

---

## Quick Reference

### Function Template

```sql
create or replace function schema.function_name(param1 type1, param2 type2)
returns return_type
language plpgsql | sql
security invoker | definer
set search_path = ''
immutable | stable | volatile
as $$
  -- Function body
$$;

comment on function schema.function_name(type1, type2) is
  'Description of what the function does.';
```

### Security Checklist

- [ ] `set search_path = ''` included
- [ ] All table/function references fully qualified
- [ ] Appropriate `SECURITY` level (INVOKER vs DEFINER)
- [ ] Appropriate volatility (IMMUTABLE/STABLE/VOLATILE)
- [ ] Input validation for user-provided data
- [ ] Error handling for edge cases
- [ ] Function documented with comments

---

## References

- **Official Docs:** [PostgreSQL Functions](https://supabase.com/docs/guides/database/functions)
- **Cursor Rules:** [`.cursor/rules/supabase/supabase-create-db-functions.mdc`](../../../.cursor/rules/supabase/supabase-create-db-functions.mdc)
- **Schema Docs:** [`../01-new-supabase.md`](../01-new-supabase.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
