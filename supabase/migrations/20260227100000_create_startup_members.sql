-- Ghost table fix: startup_members existed in production with no CREATE TABLE migration.
-- This migration captures the live schema (9 columns, 6 constraints, 5 indexes, 5 RLS policies).
-- Fixes applied: drop duplicate trigger, add WITH CHECK on UPDATE, fix invited_by FK cascade.
--
-- Context: startup_members tracks startup-level team roles (distinct from org_members which
-- handles org-level access/billing). See tasks/data/plan/06-domain-core-business.md.

-- ============================================================
-- 1. Table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.startup_members (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id  uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    user_id     uuid NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
    role        text NOT NULL DEFAULT 'member'
                CHECK (role = ANY (ARRAY['owner','admin','member','viewer'])),
    invited_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    invited_at  timestamptz,
    joined_at   timestamptz DEFAULT now(),
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),

    UNIQUE (startup_id, user_id)
);

COMMENT ON TABLE public.startup_members IS
    'Startup-level team membership. Distinct from org_members (org-level access/billing). '
    'Roles: owner, admin, member, viewer. One membership per user per startup.';

-- ============================================================
-- 2. Indexes (all FK columns + composite unique)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_startup_members_startup    ON public.startup_members (startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_members_user       ON public.startup_members (user_id);
CREATE INDEX IF NOT EXISTS idx_startup_members_invited_by ON public.startup_members (invited_by);

-- ============================================================
-- 3. Trigger — updated_at (use generic handler, no domain-specific duplicate)
-- ============================================================
CREATE TRIGGER handle_startup_members_updated_at
    BEFORE UPDATE ON public.startup_members
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 4. RLS
-- ============================================================
ALTER TABLE public.startup_members ENABLE ROW LEVEL SECURITY;

-- SELECT: users can see their own memberships
CREATE POLICY "Users can view their own memberships"
    ON public.startup_members FOR SELECT
    USING (( SELECT auth.uid()) = user_id);

-- SELECT: users can see co-members in their startups
CREATE POLICY "Users can view co-members"
    ON public.startup_members FOR SELECT
    USING (startup_id IN (
        SELECT sm.startup_id
        FROM public.startup_members sm
        WHERE sm.user_id = ( SELECT auth.uid())
    ));

-- INSERT: owners/admins can add members, OR first member (bootstrap)
CREATE POLICY "Owners/admins can insert members"
    ON public.startup_members FOR INSERT
    WITH CHECK (
        (EXISTS (
            SELECT 1 FROM public.startup_members sm
            WHERE sm.startup_id = startup_members.startup_id
              AND sm.user_id = ( SELECT auth.uid())
              AND sm.role = ANY (ARRAY['owner','admin'])
        ))
        OR
        (NOT EXISTS (
            SELECT 1 FROM public.startup_members sm
            WHERE sm.startup_id = startup_members.startup_id
        ))
    );

-- UPDATE: owners can update members (WITH CHECK prevents startup_id reassignment)
CREATE POLICY "Owners can update members"
    ON public.startup_members FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.startup_members sm
        WHERE sm.startup_id = startup_members.startup_id
          AND sm.user_id = ( SELECT auth.uid())
          AND sm.role = 'owner'
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.startup_members sm
        WHERE sm.startup_id = startup_members.startup_id
          AND sm.user_id = ( SELECT auth.uid())
          AND sm.role = 'owner'
    ));

-- DELETE: owners can remove any member, users can remove themselves
CREATE POLICY "Owners can delete or self-remove"
    ON public.startup_members FOR DELETE
    USING (
        (EXISTS (
            SELECT 1 FROM public.startup_members sm
            WHERE sm.startup_id = startup_members.startup_id
              AND sm.user_id = ( SELECT auth.uid())
              AND sm.role = 'owner'
        ))
        OR (( SELECT auth.uid()) = user_id)
    );
