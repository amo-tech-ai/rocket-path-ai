-- =============================================================================
-- migration: 20260204100000_create_org_members.sql
-- purpose: create org_members table for multi-tenant team membership
-- affected tables: org_members
-- dependencies: organizations, profiles
-- =============================================================================

-- =============================================================================
-- 1. table: org_members
-- =============================================================================

-- org_members tracks which users belong to which organizations
-- this enables multi-tenant access control via RLS policies
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  -- membership details
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  invited_by uuid references auth.users(id) on delete set null,
  invited_at timestamptz,
  joined_at timestamptz default now(),

  -- status
  status text not null default 'active' check (status in ('pending', 'active', 'suspended')),

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- ensure one membership per user per org
  unique (org_id, user_id)
);

-- add table comment
comment on table public.org_members is 'Tracks user membership in organizations for multi-tenant access control.';
comment on column public.org_members.role is 'User role within the organization: owner, admin, member, or viewer.';
comment on column public.org_members.status is 'Membership status: pending (invited), active, or suspended.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- index on org_id for org member lookups
create index if not exists idx_org_members_org_id
  on public.org_members(org_id);

-- index on user_id for user's organizations lookup
create index if not exists idx_org_members_user_id
  on public.org_members(user_id);

-- composite index for checking membership
create index if not exists idx_org_members_user_org
  on public.org_members(user_id, org_id)
  where status = 'active';

-- =============================================================================
-- 3. triggers
-- =============================================================================

-- auto-update updated_at timestamp
create trigger trigger_org_members_updated_at
  before update on public.org_members
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- 4. row level security
-- =============================================================================

alter table public.org_members enable row level security;

-- select: authenticated users can view members of their organizations
create policy "authenticated users can view org members"
  on public.org_members
  for select
  to authenticated
  using (
    org_id in (
      select om.org_id
      from public.org_members om
      where om.user_id = (select auth.uid())
        and om.status = 'active'
    )
  );

-- insert: only org owners and admins can invite new members
create policy "org admins can invite members"
  on public.org_members
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.org_members om
      where om.org_id = org_id
        and om.user_id = (select auth.uid())
        and om.role in ('owner', 'admin')
        and om.status = 'active'
    )
  );

-- update: org owners and admins can update member roles
create policy "org admins can update members"
  on public.org_members
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.org_members om
      where om.org_id = org_id
        and om.user_id = (select auth.uid())
        and om.role in ('owner', 'admin')
        and om.status = 'active'
    )
  )
  with check (
    exists (
      select 1
      from public.org_members om
      where om.org_id = org_id
        and om.user_id = (select auth.uid())
        and om.role in ('owner', 'admin')
        and om.status = 'active'
    )
  );

-- delete: org owners can remove members (except themselves)
create policy "org owners can remove members"
  on public.org_members
  for delete
  to authenticated
  using (
    user_id != (select auth.uid()) -- cannot remove yourself
    and exists (
      select 1
      from public.org_members om
      where om.org_id = org_id
        and om.user_id = (select auth.uid())
        and om.role = 'owner'
        and om.status = 'active'
    )
  );

-- service role: full access for backend operations
create policy "service role has full access to org members"
  on public.org_members
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204100000_create_org_members.sql
-- =============================================================================
