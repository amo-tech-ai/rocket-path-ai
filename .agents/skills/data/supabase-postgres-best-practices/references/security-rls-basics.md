---
title: Enable Row Level Security for Multi-Tenant Data
impact: CRITICAL
impactDescription: Database-enforced tenant isolation, prevent data leaks
tags: rls, row-level-security, multi-tenant, security
---

## Enable Row Level Security for Multi-Tenant Data

Row Level Security (RLS) enforces data access at the database level, ensuring users only see their own data.

**Incorrect (application-level filtering only):**

```sql
-- Relying only on application to filter
select * from orders where user_id = $current_user_id;

-- Bug or bypass means all data is exposed!
select * from orders;  -- Returns ALL orders
```

**Correct (database-enforced RLS):**

```sql
-- Enable RLS on the table
alter table orders enable row level security;

-- Create policy for authenticated users only
-- CRITICAL: Always use TO authenticated, never TO public
-- CRITICAL: Always wrap auth.uid() in (SELECT ...) for performance (see security-rls-performance.md)
create policy "Users read own orders" on orders
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users insert own orders" on orders
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users update own orders" on orders
  for update
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users delete own orders" on orders
  for delete
  to authenticated
  using (user_id = (select auth.uid()));
```

**Critical patterns:**

1. **Always specify `TO authenticated`** — never use `TO public` (which includes anonymous/unauthenticated users). Using `TO public` means the anon key can read/write data.

2. **Always wrap `auth.uid()` in `(SELECT ...)`** — this enables Postgres initPlan caching (evaluated once per query, not per row). See `security-rls-performance.md`.

3. **Use separate policies per operation** — `for select`, `for insert`, `for update`, `for delete` instead of `for all`. This gives finer-grained control.

4. **Org-based multi-tenancy pattern:**
```sql
-- Helper function for org isolation (evaluated once via initPlan)
create or replace function public.user_org_id()
returns uuid
language sql
security definer
set search_path = ''
as $$
  select org_id from public.profiles where id = (select auth.uid())
$$;

-- Policy using org isolation
create policy "Org members read startups" on startups
  for select
  to authenticated
  using (org_id = (select public.user_org_id()));
```

Reference: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
