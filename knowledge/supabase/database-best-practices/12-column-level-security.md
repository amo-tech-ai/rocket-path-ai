# Column-Level Security Best Practices

**Document:** 12-column-level-security.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Column-Level Security](https://supabase.com/docs/guides/database/postgres/column-level-security)

---

## Overview

Column-Level Security allows you to restrict access to specific columns within a table, even when users have row-level access. This enables fine-grained control over sensitive data like passwords, API keys, and personal information.

---

## Core Concepts

### Grant Column Access

```sql
-- ✅ CORRECT - Grant column access
grant select (id, name, email) on public.profiles to authenticated;
grant select (id, title, status) on public.tasks to authenticated;

-- Revoke access to sensitive columns
revoke select (password_hash, api_key) on public.profiles from authenticated;
```

### Column-Level Policies

**PostgreSQL doesn't support column-level policies directly**, but you can achieve similar results using:

1. **Column Grants** (shown above)
2. **Views with Column Filtering**
3. **RLS Policies with Column Checks**

---

## Pattern 1: Column Grants

### Basic Column Access Control

```sql
-- ✅ CORRECT - Column-level grants
-- Grant access to safe columns
grant select (id, name, email, created_at) 
  on public.profiles 
  to authenticated;

-- Explicitly revoke sensitive columns
revoke select (password_hash, ssn, credit_card) 
  on public.profiles 
  from authenticated;

-- Grant update only to specific columns
grant update (name, email) 
  on public.profiles 
  to authenticated;
```

**Key Points:**
- Column grants work with RLS policies
- Users can only SELECT/UPDATE granted columns
- Sensitive columns are automatically hidden

### Role-Based Column Access

```sql
-- ✅ CORRECT - Different columns for different roles
-- Admins see all columns
grant select on public.profiles to admin_role;

-- Regular users see limited columns
grant select (id, name, email) on public.profiles to authenticated;

-- Public users see minimal columns
grant select (id, name) on public.profiles to anon;
```

---

## Pattern 2: Views with Column Filtering

### Creating Secure Views

```sql
-- ✅ CORRECT - View with column filtering
create view public.profiles_public as
select
  id,
  name,
  email,
  avatar_url,
  created_at
from public.profiles;

-- Grant access to view
grant select on public.profiles_public to authenticated, anon;

-- Keep original table restricted
revoke select on public.profiles from authenticated, anon;
```

**Key Points:**
- Views automatically filter columns
- Can combine with RLS for row-level filtering
- Easier to manage than column grants

### Role-Specific Views

```sql
-- ✅ CORRECT - Different views for different roles
-- Public view (minimal data)
create view public.profiles_public as
select id, name, avatar_url
from public.profiles;

-- Authenticated view (more data)
create view public.profiles_authenticated as
select id, name, email, avatar_url, bio, created_at
from public.profiles;

-- Admin view (all data)
create view public.profiles_admin as
select * from public.profiles;

-- Grant appropriate views
grant select on public.profiles_public to anon;
grant select on public.profiles_authenticated to authenticated;
grant select on public.profiles_admin to admin_role;
```

---

## Pattern 3: RLS with Column Masking

### Conditional Column Access

```sql
-- ✅ CORRECT - RLS policy with column check
create policy "Users see own email"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- Create function to mask email for others
create or replace function public.get_email(user_id uuid)
returns text
language plpgsql
security invoker
set search_path = ''
stable
as $$
begin
  if user_id = (select auth.uid()) then
    return (select email from public.profiles where id = user_id);
  else
    return null;  -- ✅ Mask email for other users
  end if;
end;
$$;
```

---

## Project-Specific Patterns

### Sensitive Data Columns

**For StartupAI Platform, consider column-level security for:**

1. **`profiles` table:**
   - `password_hash` - Never expose
   - `api_keys` - Only to owner
   - `billing_info` - Only to owner/admin

2. **`integrations` table:**
   - `access_token_encrypted` - Only to owner/admin
   - `refresh_token_encrypted` - Only to owner/admin

3. **`agent_configs` table:**
   - `system_prompt` - May contain sensitive business logic
   - `api_keys` - Never expose

### Implementation Example

```sql
-- ✅ CORRECT - Column-level security for profiles
-- Grant safe columns to all authenticated users
grant select (
  id,
  name,
  email,
  avatar_url,
  bio,
  role,
  created_at
) on public.profiles to authenticated;

-- Only owner can see sensitive columns
grant select (
  password_hash,
  api_keys,
  billing_info
) on public.profiles to authenticated
where id = (select auth.uid());  -- ✅ Conditional grant (if supported)

-- Or use view approach
create view public.profiles_safe as
select
  id,
  name,
  email,
  avatar_url,
  bio,
  role,
  created_at
from public.profiles;

grant select on public.profiles_safe to authenticated;
```

---

## Best Practices

### 1. Default Deny, Explicit Allow

```sql
-- ✅ CORRECT - Explicit column grants
-- Revoke all first
revoke all on public.profiles from authenticated;

-- Then grant specific columns
grant select (id, name, email) on public.profiles to authenticated;
```

### 2. Use Views for Complex Logic

```sql
-- ✅ CORRECT - View with business logic
create view public.profiles_with_masked_email as
select
  id,
  name,
  case
    when id = (select auth.uid()) then email
    else regexp_replace(email, '(.)(.*)(@)', '\1***\3', 'g')  -- Mask email
  end as email,
  avatar_url
from public.profiles;
```

### 3. Combine with RLS

```sql
-- ✅ CORRECT - RLS + Column Security
-- RLS for row-level access
create policy "Users see their org"
  on public.profiles
  for select
  to authenticated
  using (org_id = auth.user_org_id());

-- Column grants for column-level access
grant select (id, name, email) on public.profiles to authenticated;
revoke select (password_hash) on public.profiles from authenticated;
```

---

## Quick Reference

### Column Grant Template

```sql
-- Grant specific columns
grant select (column1, column2, column3)
  on schema.table_name
  to role_name;

-- Revoke sensitive columns
revoke select (sensitive_column)
  on schema.table_name
  from role_name;
```

### Column Security Checklist

- [ ] Sensitive columns identified
- [ ] Column grants configured
- [ ] Views created for filtered access (if needed)
- [ ] Role-based column access implemented
- [ ] Combined with RLS policies
- [ ] Tested with different user roles

---

## References

- **Official Docs:** [Column-Level Security](https://supabase.com/docs/guides/database/postgres/column-level-security)
- **RLS Guide:** [`11-row-level-security.md`](./11-row-level-security.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
