# PostgreSQL Roles Best Practices

**Document:** 14-roles.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [PostgreSQL Roles](https://supabase.com/docs/guides/database/postgres/roles)

---

## Overview

PostgreSQL roles define database users and their permissions. Supabase uses roles like `anon` and `authenticated` for access control, but you can create custom roles for more granular permissions.

---

## Supabase Default Roles

### anon Role

**Use Case:** Unauthenticated users

```sql
-- ✅ CORRECT - Grant to anon role
grant select on public.profiles to anon;

-- Use in RLS policy
create policy "Public profiles viewable"
  on public.profiles
  for select
  to anon
  using (is_public = true);
```

**Characteristics:**
- No authentication required
- Limited permissions (read-only typically)
- Used for public-facing data

### authenticated Role

**Use Case:** Authenticated users

```sql
-- ✅ CORRECT - Grant to authenticated role
grant select, insert, update on public.tasks to authenticated;

-- Use in RLS policy
create policy "Users access own tasks"
  on public.tasks
  for select
  to authenticated
  using (user_id = (select auth.uid()));
```

**Characteristics:**
- Requires valid JWT token
- Full permissions (with RLS restrictions)
- Used for all authenticated operations

### service_role

**Use Case:** Server-side operations, bypassing RLS

```typescript
// ✅ CORRECT - Use service_role in Edge Functions
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // ✅ Bypasses RLS
);
```

**Characteristics:**
- Bypasses all RLS policies
- Full database access
- **Never expose to client-side code**

---

## Custom Roles

### Creating Custom Roles

```sql
-- ✅ CORRECT - Create custom role
create role admin_role;

-- Grant permissions
grant select, insert, update, delete on public.tasks to admin_role;
grant usage on schema public to admin_role;

-- Grant role to users
grant admin_role to authenticated;
```

### Role Hierarchy

```sql
-- ✅ CORRECT - Role hierarchy
create role admin_role;
create role editor_role;
create role viewer_role;

-- Grant permissions
grant all on public.tasks to admin_role;
grant select, insert, update on public.tasks to editor_role;
grant select on public.tasks to viewer_role;

-- Assign roles to users (via app_metadata or database)
-- See RBAC guide for JWT-based role assignment
```

---

## Role-Based Access Patterns

### Pattern 1: Table-Level Permissions

```sql
-- ✅ CORRECT - Role-based table access
grant select on public.tasks to viewer_role;
grant select, insert, update on public.tasks to editor_role;
grant all on public.tasks to admin_role;

-- Use in RLS policy
create policy "Viewers can view"
  on public.tasks
  for select
  to viewer_role
  using (org_id = auth.user_org_id());
```

### Pattern 2: Schema-Level Permissions

```sql
-- ✅ CORRECT - Schema-level permissions
grant usage on schema public to authenticated;
grant all on all tables in schema public to admin_role;
grant select on all tables in schema public to viewer_role;
```

### Pattern 3: Function Permissions

```sql
-- ✅ CORRECT - Function permissions
grant execute on function public.get_user_stats(uuid) to authenticated;
grant execute on all functions in schema public to admin_role;
```

---

## Project-Specific Roles

### Recommended Roles for StartupAI

**Organization Roles:**
- `org_owner` - Full access to organization
- `org_admin` - Administrative access
- `org_member` - Standard member access
- `org_viewer` - Read-only access

**Implementation:**

```sql
-- Create organization roles
create role org_owner;
create role org_admin;
create role org_member;
create role org_viewer;

-- Grant permissions
grant all on public.tasks to org_owner, org_admin;
grant select, insert, update on public.tasks to org_member;
grant select on public.tasks to org_viewer;

-- Use in RLS policies
create policy "Owners have full access"
  on public.tasks
  for all
  to org_owner
  using (org_id = auth.user_org_id());
```

**Note:** In Supabase, roles are typically managed via JWT claims (`app_metadata.role`) rather than PostgreSQL roles. See RBAC guide for JWT-based role management.

---

## Role Management

### Granting Roles

```sql
-- ✅ CORRECT - Grant role to user
grant admin_role to authenticated;

-- Grant with admin option (can grant to others)
grant admin_role to authenticated with admin option;
```

### Revoking Roles

```sql
-- ✅ CORRECT - Revoke role
revoke admin_role from authenticated;
```

### Checking Role Membership

```sql
-- ✅ CORRECT - Check current role
select current_user, session_user;

-- Check if user has role
select current_setting('role') = 'admin_role';
```

---

## Best Practices

### 1. Use JWT Claims for Application Roles

**Recommended:** Use JWT `app_metadata` for application-level roles

```typescript
// ✅ CORRECT - JWT-based roles
app_metadata: {
  role: 'admin',
  org_id: 'uuid'
}
```

**Why:** More flexible, easier to manage, works with Supabase Auth

### 2. Use PostgreSQL Roles for Database-Level Permissions

**Use PostgreSQL roles for:**
- Schema access
- Function execution
- Table-level grants
- Database administration

### 3. Combine Both Approaches

```sql
-- PostgreSQL role for database permissions
grant execute on function public.admin_function() to admin_role;

-- JWT claim for application logic
-- app_metadata.role = 'admin' used in RLS policies
```

---

## Quick Reference

### Role Creation Template

```sql
-- Create role
create role role_name;

-- Grant permissions
grant permission on object to role_name;

-- Grant role to user
grant role_name to authenticated;
```

### Role Checklist

- [ ] Roles created for different permission levels
- [ ] Permissions granted appropriately
- [ ] Roles assigned to users (JWT or PostgreSQL)
- [ ] RLS policies use roles
- [ ] Roles tested with different users

---

## References

- **Official Docs:** [PostgreSQL Roles](https://supabase.com/docs/guides/database/postgres/roles)
- **Storage Roles:** [Storage Custom Roles](https://supabase.com/docs/guides/storage/schema/custom-roles)
- **RBAC Guide:** [`13-rbac-custom-claims.md`](./13-rbac-custom-claims.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
