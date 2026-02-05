# Triggers Best Practices

**Document:** 08-triggers.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [PostgreSQL Triggers](https://supabase.com/docs/guides/database/postgres/triggers)

---

## Overview

Triggers automatically execute functions in response to database events (INSERT, UPDATE, DELETE). This guide covers table triggers, event triggers, trigger functions, and best practices for Supabase.

---

## Table Triggers

### Trigger Timing

**BEFORE Triggers** - Execute before the operation
- Can modify `NEW` record before INSERT/UPDATE
- Can prevent operation by raising exception
- Use for: Validation, data transformation, default values

**AFTER Triggers** - Execute after the operation
- Cannot modify the record
- Use for: Audit logging, notifications, cascading operations

**INSTEAD OF Triggers** - Replace the operation (views only)
- Not commonly used in Supabase

### Trigger Granularity

**FOR EACH ROW** - Executes once per affected row
- Most common pattern
- Access to `NEW` and `OLD` record variables

**FOR EACH STATEMENT** - Executes once per statement
- Less common
- No access to `NEW`/`OLD` (use `TG_OP` to determine operation)

---

## Common Trigger Patterns

### Pattern 1: Automatic Timestamps

**Most Common Pattern** - Update `updated_at` on row modification

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

-- Attach to table
create trigger handle_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

-- Attach to multiple tables
create trigger handle_projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();
```

**Key Points:**
- Must use `BEFORE UPDATE` to modify `NEW`
- Must return `NEW` for INSERT/UPDATE triggers
- Use `SECURITY DEFINER` (triggers run as table owner)
- Set `search_path = ''` for security

### Pattern 2: Audit Logging

**Use Case:** Track all changes to sensitive tables

```sql
-- ✅ CORRECT - Audit trigger function
create or replace function public.handle_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_log (
    table_name,
    action,
    record_id,
    old_data,
    new_data,
    actor_id,
    created_at
  )
  values (
    tg_table_name,  -- ✅ Automatic trigger variable
    tg_op,  -- ✅ 'INSERT', 'UPDATE', or 'DELETE'
    coalesce(new.id, old.id),  -- ✅ Works for all operations
    case when tg_op = 'DELETE' then row_to_json(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then row_to_json(new) else null end,
    auth.uid(),  -- ✅ Current user
    now()
  );
  
  return coalesce(new, old);  -- ✅ Return appropriate record
end;
$$;

-- Attach to sensitive table
create trigger audit_tasks_changes
  after insert or update or delete on public.tasks
  for each row
  execute function public.handle_audit_log();
```

**Key Points:**
- Use `AFTER` trigger (cannot modify original record)
- Use `TG_OP` to determine operation type
- Use `TG_TABLE_NAME` for table name
- Handle both `NEW` and `OLD` appropriately

### Pattern 3: Data Validation

**Use Case:** Enforce business rules before INSERT/UPDATE

```sql
-- ✅ CORRECT - Validation trigger
create or replace function public.validate_task_dates()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Validate due_date is after created_at
  if new.due_date is not null and new.due_date < new.created_at then
    raise exception 'Due date cannot be before creation date'
      using errcode = 'P0001';
  end if;
  
  -- Validate completed_at is after created_at
  if new.completed_at is not null and new.completed_at < new.created_at then
    raise exception 'Completion date cannot be before creation date'
      using errcode = 'P0002';
  end if;
  
  return new;
end;
$$;

-- Attach to table
create trigger validate_task_dates_trigger
  before insert or update on public.tasks
  for each row
  execute function public.validate_task_dates();
```

**Key Points:**
- Use `BEFORE` trigger to prevent invalid data
- Raise exception to abort operation
- Return `NEW` to allow operation to proceed

### Pattern 4: Cascading Updates

**Use Case:** Update related records when parent changes

```sql
-- ✅ CORRECT - Cascading update trigger
create or replace function public.handle_startup_name_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Update all projects when startup name changes
  if new.name is distinct from old.name then
    update public.projects
    set startup_name = new.name,
        updated_at = now()
    where startup_id = new.id;
  end if;
  
  return new;
end;
$$;

-- Attach to startup table
create trigger cascade_startup_name_update
  after update of name on public.startups
  for each row
  execute function public.handle_startup_name_change();
```

**Key Points:**
- Use `AFTER` trigger (cannot modify `NEW` in AFTER)
- Use `UPDATE ... OF column` to trigger only on specific column changes
- Use `IS DISTINCT FROM` to detect actual changes (handles NULL)

---

## Event Triggers

**Use Case:** Database-level events (DDL operations)

```sql
-- ✅ CORRECT - Event trigger function
create or replace function public.handle_ddl_event()
returns event_trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_record record;
begin
  -- Get event details
  select * into event_record
  from pg_event_trigger_ddl_commands();
  
  -- Log DDL operations
  insert into public.ddl_audit_log (
    command_tag,
    object_type,
    object_identity,
    schema_name,
    created_at
  )
  values (
    event_record.command_tag,
    event_record.object_type,
    event_record.object_identity,
    event_record.schema_name,
    now()
  );
end;
$$;

-- Create event trigger
create event trigger ddl_audit_trigger
  on ddl_command_end
  execute function public.handle_ddl_event();
```

**Key Points:**
- Event triggers fire on DDL operations (CREATE, ALTER, DROP)
- Use `pg_event_trigger_ddl_commands()` to get event details
- Useful for audit logging, schema change tracking
- Requires superuser privileges (typically managed via Supabase dashboard)

---

## Trigger Function Best Practices

### 1. Security

```sql
-- ✅ CORRECT - Secure trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer  -- ✅ Required
set search_path = ''  -- ✅ Required
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
```

**Always:**
- Use `SECURITY DEFINER` (triggers run as table owner)
- Set `search_path = ''` to prevent injection
- Use fully qualified names if accessing other tables

### 2. Performance

```sql
-- ✅ GOOD - Efficient trigger
create or replace function public.handle_task_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Only update if status actually changed
  if tg_op = 'UPDATE' and new.status = old.status then
    return new;  -- ✅ Early return if no change
  end if;
  
  -- Update count only for relevant status changes
  if new.status = 'completed' then
    update public.startups
    set completed_tasks_count = completed_tasks_count + 1
    where id = new.startup_id;
  elsif old.status = 'completed' and new.status != 'completed' then
    update public.startups
    set completed_tasks_count = completed_tasks_count - 1
    where id = new.startup_id;
  end if;
  
  return new;
end;
$$;
```

**Optimization Tips:**
- Early return if no changes needed
- Only update when necessary
- Use indexes on columns used in trigger logic
- Avoid expensive operations in triggers

### 3. Error Handling

```sql
-- ✅ CORRECT - Error handling in trigger
create or replace function public.handle_validation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Validate business rules
  if new.priority < 0 or new.priority > 100 then
    raise exception 'Priority must be between 0 and 100'
      using errcode = 'P0001',
            hint = 'Use a value between 0 and 100';
  end if;
  
  return new;
exception
  when others then
    -- Log error but don't expose details
    raise exception 'Validation failed'
      using errcode = 'P0002';
end;
$$;
```

---

## Trigger Variables

PostgreSQL provides automatic variables in trigger functions:

| Variable | Type | Description |
|----------|------|-------------|
| `NEW` | RECORD | New row (INSERT/UPDATE) |
| `OLD` | RECORD | Old row (UPDATE/DELETE) |
| `TG_OP` | TEXT | Operation: 'INSERT', 'UPDATE', 'DELETE' |
| `TG_TABLE_NAME` | TEXT | Table name |
| `TG_TABLE_SCHEMA` | TEXT | Schema name |
| `TG_WHEN` | TEXT | Timing: 'BEFORE', 'AFTER' |
| `TG_LEVEL` | TEXT | Granularity: 'ROW', 'STATEMENT' |

**Example Usage:**

```sql
create or replace function public.handle_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_log (
    table_name,
    schema_name,
    operation,
    when_executed,
    level,
    record_id
  )
  values (
    tg_table_name,
    tg_table_schema,
    tg_op,
    tg_when,
    tg_level,
    coalesce(new.id, old.id)
  );
  
  return coalesce(new, old);
end;
$$;
```

---

## Conditional Triggers

### Trigger Only on Column Changes

```sql
-- ✅ CORRECT - Trigger only when specific column changes
create trigger handle_name_change
  after update of name on public.startups
  for each row
  when (new.name is distinct from old.name)  -- ✅ Additional condition
  execute function public.handle_name_change();
```

**Key Points:**
- `UPDATE OF column` limits trigger to specific column
- `WHEN` clause adds additional conditions
- Reduces unnecessary trigger executions

### Conditional Logic in Function

```sql
-- ✅ CORRECT - Conditional logic
create or replace function public.handle_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Only process if status actually changed
  if tg_op = 'UPDATE' and new.status = old.status then
    return new;  -- ✅ Skip processing
  end if;
  
  -- Process status change
  if new.status = 'completed' then
    -- Send notification, update metrics, etc.
    perform public.send_notification(new.id, 'task_completed');
  end if;
  
  return new;
end;
$$;
```

---

## Project-Specific Triggers

### Current Triggers

**Location:** Various migration files

1. **`handle_updated_at()`** - Automatic timestamp updates
   - Attached to: `tasks`, `projects`, `startups`, `contacts`, `deals`, etc.
   - Pattern: `BEFORE UPDATE` trigger

**All triggers follow best practices:**
- ✅ `SECURITY DEFINER`
- ✅ `set search_path = ''`
- ✅ `BEFORE UPDATE` for timestamp updates
- ✅ Consistent naming: `handle_<table>_updated_at`

---

## Common Pitfalls

### ❌ Pitfall 1: Infinite Trigger Loops

```sql
-- ❌ BAD - Can cause infinite loop
create trigger handle_update
  after update on public.tasks
  for each row
  execute function public.handle_update();  -- Function updates tasks table

-- Function updates same table
create or replace function public.handle_update()
returns trigger
as $$
begin
  update public.tasks set updated_at = now() where id = new.id;  -- ❌ Loops!
  return new;
end;
$$;
```

**Fix:** Use `BEFORE UPDATE` and modify `NEW` directly:

```sql
-- ✅ GOOD - No loop
create trigger handle_update
  before update on public.tasks
  for each row
  execute function public.handle_update();

create or replace function public.handle_update()
returns trigger
as $$
begin
  new.updated_at := now();  -- ✅ Modify NEW directly
  return new;
end;
$$;
```

### ❌ Pitfall 2: Missing NULL Checks

```sql
-- ❌ BAD - Fails on NULL values
create or replace function public.handle_calculation()
returns trigger
as $$
begin
  new.total := new.quantity * new.price;  -- ❌ Fails if quantity is NULL
  return new;
end;
$$;

-- ✅ GOOD - Handle NULLs
create or replace function public.handle_calculation()
returns trigger
as $$
begin
  new.total := coalesce(new.quantity, 0) * coalesce(new.price, 0);
  return new;
end;
$$;
```

### ❌ Pitfall 3: Not Returning Record

```sql
-- ❌ BAD - Missing return
create or replace function public.handle_update()
returns trigger
as $$
begin
  new.updated_at := now();
  -- ❌ Missing: return new;
end;
$$;

-- ✅ GOOD - Always return
create or replace function public.handle_update()
returns trigger
as $$
begin
  new.updated_at := now();
  return new;  -- ✅ Required
end;
$$;
```

---

## Testing Triggers

### Test Trigger Execution

```sql
-- ✅ CORRECT - Test trigger
do $$
declare
  test_task_id uuid;
begin
  -- Create test task
  insert into public.tasks (title, user_id, org_id)
  values ('Test Task', auth.uid(), auth.user_org_id())
  returning id into test_task_id;
  
  -- Update task (should trigger updated_at)
  update public.tasks
  set title = 'Updated Task'
  where id = test_task_id;
  
  -- Verify trigger executed
  if not exists (
    select 1 from public.tasks
    where id = test_task_id
    and updated_at > created_at
  ) then
    raise exception 'Trigger did not execute';
  end if;
  
  raise notice 'Trigger test passed';
end;
$$;
```

---

## Quick Reference

### Trigger Template

```sql
-- Trigger function
create or replace function schema.trigger_function_name()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Trigger logic
  return new;  -- or old, or null
end;
$$;

-- Attach trigger
create trigger trigger_name
  before | after insert | update | delete
  on schema.table_name
  for each row | for each statement
  when (condition)  -- optional
  execute function schema.trigger_function_name();
```

### Trigger Checklist

- [ ] Function uses `SECURITY DEFINER`
- [ ] Function uses `set search_path = ''`
- [ ] Function returns appropriate record (`NEW`, `OLD`, or `NULL`)
- [ ] Trigger timing is correct (`BEFORE` vs `AFTER`)
- [ ] Trigger granularity is correct (`ROW` vs `STATEMENT`)
- [ ] No infinite loops (avoid updating same table in AFTER trigger)
- [ ] NULL values handled appropriately
- [ ] Performance optimized (early returns, conditional logic)

---

## References

- **Official Docs:** [PostgreSQL Triggers](https://supabase.com/docs/guides/database/postgres/triggers)
- **Event Triggers:** [PostgreSQL Event Triggers](https://supabase.com/docs/guides/database/postgres/event-triggers)
- **Cursor Rules:** [`.cursor/rules/supabase/supabase-create-db-functions.mdc`](../../../.cursor/rules/supabase/supabase-create-db-functions.mdc)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
