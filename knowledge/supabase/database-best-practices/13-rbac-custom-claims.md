# RBAC & Custom Claims Best Practices

**Document:** 13-rbac-custom-claims.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Custom Claims & RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)

---

## Overview

Custom claims in JWT tokens enable Role-Based Access Control (RBAC) by storing authorization data in the user's JWT. This allows fine-grained permissions without database lookups in every request.

---

## JWT Structure

### JWT Claims Location

**`raw_app_meta_data`** - ✅ **Use for Authorization**
- Cannot be modified by users
- Set via Admin API or database triggers
- Perfect for roles, permissions, org membership

**`raw_user_meta_data`** - ⚠️ **Use for User Preferences**
- Can be modified by users via `supabase.auth.update()`
- Not secure for authorization
- Use for display name, preferences, etc.

### Accessing Claims in Database

```sql
-- ✅ CORRECT - Access JWT claims in RLS policies
create policy "Users access based on org claim"
  on public.tasks
  for select
  to authenticated
  using (
    org_id = (auth.jwt() -> 'app_metadata' -> 'org_id')::uuid
  );

-- Access role claim
create policy "Admins have full access"
  on public.tasks
  for all
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' -> 'role')::text = 'admin'
  );
```

---

## Setting Custom Claims

### Via Admin API (Recommended)

```typescript
// ✅ CORRECT - Set custom claims via Admin API
import { createClient } from '@supabase/supabase-js';

const adminClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY  // ✅ Admin key
);

// Set org_id and role in app_metadata
await adminClient.auth.admin.updateUserById(userId, {
  app_metadata: {
    org_id: orgId,
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  }
});
```

### Via Database Trigger

```sql
-- ✅ CORRECT - Set claims on profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Set app_metadata via Supabase function (if available)
  -- Note: This requires Supabase-specific functions
  -- Typically done via Admin API or Edge Function
  
  return new;
end;
$$;

-- Trigger on profile creation
create trigger on_profile_created
  after insert on public.profiles
  for each row
  execute function public.handle_new_user();
```

**Note:** Setting JWT claims from database triggers requires Supabase-specific functions or should be done via Admin API/Edge Functions.

---

## RBAC Patterns

### Pattern 1: Organization-Based RBAC

```sql
-- ✅ CORRECT - Org-based RBAC with JWT claims
create policy "Users access their org's data"
  on public.tasks
  for select
  to authenticated
  using (
    org_id = (auth.jwt() -> 'app_metadata' -> 'org_id')::uuid
  );

-- Helper function for cleaner policies
create or replace function auth.jwt_org_id()
returns uuid
language sql
security definer
set search_path = ''
stable
as $$
  select (auth.jwt() -> 'app_metadata' -> 'org_id')::uuid
$$;

-- Use helper in policy
create policy "Users access their org's data"
  on public.tasks
  for select
  to authenticated
  using (org_id = auth.jwt_org_id());
```

### Pattern 2: Role-Based RBAC

```sql
-- ✅ CORRECT - Role-based RBAC
create policy "Admins have full access"
  on public.tasks
  for all
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' -> 'role')::text = 'admin'
    and org_id = auth.jwt_org_id()
  );

create policy "Members can view and create"
  on public.tasks
  for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' -> 'role')::text in ('admin', 'member')
    and org_id = auth.jwt_org_id()
  );

create policy "Members can create tasks"
  on public.tasks
  for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' -> 'role')::text in ('admin', 'member')
    and org_id = auth.jwt_org_id()
  );
```

### Pattern 3: Permission-Based RBAC

```sql
-- ✅ CORRECT - Permission-based RBAC
create policy "Users with read permission"
  on public.tasks
  for select
  to authenticated
  using (
    'read' = any(
      (auth.jwt() -> 'app_metadata' -> 'permissions')::text[]
    )
    and org_id = auth.jwt_org_id()
  );

create policy "Users with write permission"
  on public.tasks
  for insert
  to authenticated
  with check (
    'write' = any(
      (auth.jwt() -> 'app_metadata' -> 'permissions')::text[]
    )
    and org_id = auth.jwt_org_id()
  );
```

---

## Custom Claims Structure

### Recommended Claims Structure

```typescript
// ✅ CORRECT - JWT claims structure
interface AppMetadata {
  org_id: string;           // User's organization
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: string[];    // ['read', 'write', 'delete']
  startup_ids?: string[];   // Accessible startup IDs
  features?: string[];       // Enabled features
}

interface UserMetadata {
  display_name?: string;    // User preferences
  preferences?: object;     // UI preferences
  // ❌ NOT for authorization
}
```

### Setting Claims in Edge Functions

```typescript
// ✅ CORRECT - Set claims in Edge Function
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Update user's app_metadata
await supabaseAdmin.auth.admin.updateUserById(userId, {
  app_metadata: {
    org_id: orgId,
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
    startup_ids: [startupId1, startupId2]
  }
});
```

---

## Performance Considerations

### 1. Cache Claims in Helper Functions

```sql
-- ✅ CORRECT - Cached claim access
create or replace function auth.jwt_org_id()
returns uuid
language sql
security definer
set search_path = ''
stable  -- ✅ STABLE for caching
as $$
  select (auth.jwt() -> 'app_metadata' -> 'org_id')::uuid
$$;

-- Use in policy with subquery pattern
create policy "Users access org data"
  on public.tasks
  for select
  to authenticated
  using (org_id = (select auth.jwt_org_id()));  -- ✅ Cached
```

### 2. Avoid Complex JSON Operations in Policies

```sql
-- ❌ BAD - Complex JSON in policy
create policy "Users with permission"
  on public.tasks
  for select
  to authenticated
  using (
    jsonb_array_elements_text(
      (auth.jwt() -> 'app_metadata' -> 'permissions')::jsonb
    ) = 'read'  -- ❌ Complex operation
  );

-- ✅ GOOD - Use helper function
create or replace function auth.has_permission(permission text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select permission = any(
    (auth.jwt() -> 'app_metadata' -> 'permissions')::text[]
  )
$$;

create policy "Users with permission"
  on public.tasks
  for select
  to authenticated
  using (auth.has_permission('read'));
```

---

## Project-Specific RBAC

### Current Implementation

**Status:** ⚠️ **Partial Implementation**

**Current Pattern:**
- Organization-based isolation via `auth.user_org_id()` helper
- Role-based access via `auth.org_role()` helper
- Uses database lookups (not JWT claims)

**Recommended Enhancement:**
- Set `org_id` and `role` in JWT `app_metadata` on login
- Use JWT claims in RLS policies for better performance
- Keep database helpers as fallback

### Migration Plan

```typescript
// Step 1: Set claims on user login/creation
async function setUserClaims(userId: string, orgId: string, role: string) {
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: {
      org_id: orgId,
      role: role,
      permissions: getPermissionsForRole(role)
    }
  });
}

// Step 2: Update RLS policies to use JWT claims
-- Old: using (org_id = auth.user_org_id())
-- New: using (org_id = auth.jwt_org_id())

// Step 3: Keep database helpers as fallback
-- For cases where JWT claims not available
```

---

## Best Practices

### 1. Use app_metadata for Authorization

```typescript
// ✅ CORRECT - Authorization in app_metadata
app_metadata: {
  org_id: 'uuid',
  role: 'admin',
  permissions: ['read', 'write']
}

// ❌ WRONG - Authorization in user_metadata
user_metadata: {
  org_id: 'uuid',  // ❌ User can modify
  role: 'admin'    // ❌ User can modify
}
```

### 2. Keep Claims Small

```typescript
// ✅ GOOD - Small, essential claims
app_metadata: {
  org_id: 'uuid',
  role: 'admin'
}

// ❌ BAD - Large claims (increases JWT size)
app_metadata: {
  org_id: 'uuid',
  role: 'admin',
  all_startup_ids: [...1000 ids...],  // ❌ Too large
  full_permissions: {...large object...}  // ❌ Too large
}
```

### 3. Refresh Claims When Needed

```typescript
// ✅ CORRECT - Refresh claims on role change
async function updateUserRole(userId: string, newRole: string) {
  // Update database
  await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);
  
  // Update JWT claims
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: {
      role: newRole,
      permissions: getPermissionsForRole(newRole)
    }
  });
}
```

---

## Quick Reference

### JWT Claims Template

```typescript
// app_metadata (authorization)
app_metadata: {
  org_id: string,
  role: string,
  permissions: string[],
  startup_ids?: string[]
}

// user_metadata (preferences)
user_metadata: {
  display_name?: string,
  preferences?: object
}
```

### RBAC Checklist

- [ ] Claims set in `app_metadata` (not `user_metadata`)
- [ ] Claims updated on role/permission changes
- [ ] Helper functions created for claim access
- [ ] RLS policies use JWT claims
- [ ] Database helpers as fallback
- [ ] Claims kept small and essential
- [ ] Claims refreshed when needed

---

## References

- **Official Docs:** [Custom Claims & RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- **RLS Guide:** [`11-row-level-security.md`](./11-row-level-security.md)
- **Roles Guide:** [`14-roles.md`](./14-roles.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
