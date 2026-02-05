# Row-Level Security (RLS) Best Practices

**Document:** 11-row-level-security.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Row-Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## Overview

Row-Level Security (RLS) provides fine-grained access control at the row level, allowing you to restrict which rows users can SELECT, INSERT, UPDATE, or DELETE based on policies. This is essential for multi-tenant applications and data isolation.

---

## Core Concepts

### Enabling RLS

```sql
-- ✅ CORRECT - Enable RLS on table
alter table public.tasks enable row level security;

-- Verify RLS is enabled
select tablename, rowsecurity
from pg_tables
where schemaname = 'public' and tablename = 'tasks';
-- Expected: rowsecurity = true
```

**Key Point:** Once RLS is enabled, **all rows are blocked by default**. You must create policies to allow access.

---

## Policy Structure

### Policy Components

```sql
create policy "policy_name"
  on schema.table_name
  for operation  -- SELECT, INSERT, UPDATE, DELETE
  to role  -- authenticated, anon, or custom role
  using (condition)  -- For SELECT, UPDATE, DELETE
  with check (condition);  -- For INSERT, UPDATE
```

### Operation-Specific Policies

**SELECT Policies:**
```sql
-- ✅ CORRECT - SELECT policy
create policy "Users can view their org's tasks"
  on public.tasks
  for select
  to authenticated
  using (org_id = (select auth.uid()));
```

**INSERT Policies:**
```sql
-- ✅ CORRECT - INSERT policy
create policy "Users can create tasks in their org"
  on public.tasks
  for insert
  to authenticated
  with check (org_id = (select auth.uid()));
```

**UPDATE Policies:**
```sql
-- ✅ CORRECT - UPDATE policy
create policy "Users can update their org's tasks"
  on public.tasks
  for update
  to authenticated
  using (org_id = (select auth.uid()))  -- Can see
  with check (org_id = (select auth.uid()));  -- Can update to
```

**DELETE Policies:**
```sql
-- ✅ CORRECT - DELETE policy
create policy "Users can delete their org's tasks"
  on public.tasks
  for delete
  to authenticated
  using (org_id = (select auth.uid()));
```

---

## Performance Best Practices

### 1. Use `(select auth.uid())` Pattern

**CRITICAL:** Wrap function calls in subquery for performance

```sql
-- ❌ BAD - Slow (called for each row)
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = auth.uid());  -- ❌ Called per row

-- ✅ GOOD - Fast (cached per statement)
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));  -- ✅ Cached per statement
```

**Why:** `(select auth.uid())` creates an `initPlan` that PostgreSQL caches per statement, rather than calling the function for each row.

### 2. Index Columns Used in Policies

```sql
-- ✅ CORRECT - Index policy columns
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_org_id on public.tasks(org_id);

-- Policy uses indexed column
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));  -- ✅ Indexed
```

**Key Point:** Always index columns used in `USING` and `WITH CHECK` clauses.

### 3. Minimize Joins in Policies

```sql
-- ❌ BAD - Join in policy (slow)
create policy "Users see team tasks"
  on public.tasks
  for select
  to authenticated
  using (
    team_id in (
      select team_id
      from team_members
      where user_id = (select auth.uid())
        and team_id = tasks.team_id  -- ❌ Join to source table
    )
  );

-- ✅ GOOD - No join (fast)
create policy "Users see team tasks"
  on public.tasks
  for select
  to authenticated
  using (
    team_id in (
      select team_id
      from team_members
      where user_id = (select auth.uid())  -- ✅ No join
    )
  );
```

**Key Point:** Fetch filter criteria into a set, then use `IN` or `ANY` operation.

### 4. Specify Roles Explicitly

```sql
-- ❌ BAD - No role specified (runs for all roles)
create policy "Users see own tasks"
  on public.tasks
  for select
  using (user_id = (select auth.uid()));

-- ✅ GOOD - Role specified (stops early for anon)
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated  -- ✅ Stops evaluation for anon users
  using (user_id = (select auth.uid()));
```

**Key Point:** Specifying `TO authenticated` prevents policy evaluation for `anon` users, improving performance.

---

## Multi-Tenant Patterns

### Pattern 1: Organization-Based Isolation

```sql
-- ✅ CORRECT - Org-based RLS
create policy "Users see their org's data"
  on public.tasks
  for select
  to authenticated
  using (org_id = auth.user_org_id());  -- ✅ Uses helper function

-- Helper function (in auth schema)
create or replace function auth.user_org_id()
returns uuid
language sql
security definer
set search_path = ''
stable
as $$
  select org_id from public.profiles where id = auth.uid()
$$;
```

**Key Points:**
- Use helper function for performance
- Helper function uses `SECURITY DEFINER` to access `public.profiles`
- Index `org_id` column

### Pattern 2: Startup-Based Isolation

```sql
-- ✅ CORRECT - Startup-based RLS
create policy "Users see their startup's tasks"
  on public.tasks
  for select
  to authenticated
  using (
    startup_id in (
      select id
      from public.startups
      where org_id = auth.user_org_id()
    )
  );

-- Or use helper function
create policy "Users see their startup's tasks"
  on public.tasks
  for select
  to authenticated
  using (auth.startup_in_org(startup_id));
```

### Pattern 3: Role-Based Access

```sql
-- ✅ CORRECT - Role-based RLS
create policy "Owners can do everything"
  on public.tasks
  for all
  to authenticated
  using (
    auth.org_role() = 'owner'
    and org_id = auth.user_org_id()
  );

create policy "Members can view and create"
  on public.tasks
  for select
  to authenticated
  using (
    auth.org_role() in ('owner', 'admin', 'member')
    and org_id = auth.user_org_id()
  );

create policy "Members can create tasks"
  on public.tasks
  for insert
  to authenticated
  with check (
    auth.org_role() in ('owner', 'admin', 'member')
    and org_id = auth.user_org_id()
  );
```

---

## Policy Patterns

### Pattern 1: Public Read, Authenticated Write

```sql
-- ✅ CORRECT - Public read, authenticated write
create policy "Anyone can view"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "Only authenticated can create"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);  -- ✅ Can only create own profile
```

### Pattern 2: Owner-Only Access

```sql
-- ✅ CORRECT - Owner-only access
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users create own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users update own tasks"
  on public.tasks
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users delete own tasks"
  on public.tasks
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
```

### Pattern 3: Conditional Access

```sql
-- ✅ CORRECT - Conditional access
create policy "Users see active tasks"
  on public.tasks
  for select
  to authenticated
  using (
    org_id = auth.user_org_id()
    and status != 'archived'  -- ✅ Additional condition
  );
```

---

## Helper Functions for RLS

### Current Helper Functions

**Location:** `supabase/migrations/20260115120001_extensions_and_helpers.sql`

1. **`auth.user_org_id()`** - Get current user's org_id
2. **`auth.is_org_member(uuid)`** - Check org membership
3. **`auth.org_role()`** - Get user's org role
4. **`auth.startup_in_org(uuid)`** - Check startup ownership

**All follow best practices:**
- ✅ `SECURITY DEFINER` (required for RLS helpers)
- ✅ `set search_path = ''`
- ✅ `STABLE` volatility
- ✅ Fully qualified names

### Creating New Helper Functions

```sql
-- ✅ CORRECT - New RLS helper function
create or replace function auth.user_can_access_startup(startup_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.startups s
    inner join public.profiles p on p.org_id = s.org_id
    where s.id = user_can_access_startup.startup_id
      and p.id = auth.uid()
  )
$$;

-- Use in policy
create policy "Users access their startups"
  on public.projects
  for select
  to authenticated
  using (auth.user_can_access_startup(startup_id));
```

---

## Common Pitfalls

### ❌ Pitfall 1: Missing Indexes

```sql
-- ❌ BAD - No index on policy column
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));  -- ❌ user_id not indexed

-- ✅ GOOD - Index exists
create index idx_tasks_user_id on public.tasks(user_id);  -- ✅ Create index first
```

### ❌ Pitfall 2: Not Using Subquery Pattern

```sql
-- ❌ BAD - Function called per row
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = auth.uid());  -- ❌ Slow

-- ✅ GOOD - Cached per statement
create policy "Users see own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));  -- ✅ Fast
```

### ❌ Pitfall 3: Using FOR ALL

```sql
-- ❌ BAD - FOR ALL (not recommended)
create policy "Users access tasks"
  on public.tasks
  for all
  to authenticated
  using (user_id = (select auth.uid()));

-- ✅ GOOD - Separate policies
create policy "Users select tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users insert tasks"
  on public.tasks
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));
```

**Why:** Separate policies are more maintainable and allow different conditions for different operations.

---

## Testing RLS Policies

### Test Policy Enforcement

```sql
-- ✅ CORRECT - Test RLS policy
do $$
declare
  test_user_id uuid;
  test_org_id uuid;
  task_count integer;
begin
  -- Create test user and org
  test_user_id := gen_random_uuid();
  test_org_id := gen_random_uuid();
  
  -- Set role for testing
  perform set_config('request.jwt.claim.sub', test_user_id::text, true);
  
  -- Insert test data
  insert into public.tasks (title, user_id, org_id)
  values ('Test Task', test_user_id, test_org_id);
  
  -- Test policy
  select count(*) into task_count
  from public.tasks
  where user_id = test_user_id;
  
  if task_count != 1 then
    raise exception 'RLS policy test failed';
  end if;
  
  raise notice 'RLS policy test passed';
end;
$$;
```

---

## Project-Specific RLS

### Current RLS Implementation

**Status:** ✅ **98% Correct**

**Coverage:**
- ✅ All 42 tables have RLS enabled
- ✅ Policies separated by operation (SELECT, INSERT, UPDATE, DELETE)
- ✅ Policies separated by role (authenticated, anon)
- ✅ Helper functions used for performance
- ✅ Indexes on policy columns

**Pattern Used:**
- Organization-based isolation (primary)
- Startup-based isolation (secondary)
- Role-based access control (tertiary)

---

## Quick Reference

### RLS Policy Template

```sql
-- Enable RLS
alter table schema.table_name enable row level security;

-- Create policy
create policy "descriptive_policy_name"
  on schema.table_name
  for select | insert | update | delete
  to authenticated | anon | role_name
  using (condition)  -- For SELECT, UPDATE, DELETE
  with check (condition);  -- For INSERT, UPDATE
```

### RLS Checklist

- [ ] RLS enabled on all tables
- [ ] Policies separated by operation
- [ ] Policies separated by role
- [ ] Using `(select auth.uid())` pattern
- [ ] Indexes on policy columns
- [ ] Helper functions for complex checks
- [ ] No joins in policies (use IN/ANY instead)
- [ ] Roles specified explicitly
- [ ] Policies tested

---

## References

- **Official Docs:** [Row-Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- **Cursor Rules:** [`.cursor/rules/supabase/supabase-create-rls-policies.mdc`](../../../.cursor/rules/supabase/supabase-create-rls-policies.mdc)
- **Performance Guide:** [RLS Performance](https://github.com/GaryAustin1/RLS-Performance)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
