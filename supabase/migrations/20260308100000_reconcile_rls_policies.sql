-- ============================================================================
-- Migration: 20260308100000_reconcile_rls_policies.sql
-- Purpose: Reconcile ~50 RLS policy changes made directly on remote DB
--          that are NOT in any local migration file.
--
-- Categories:
--   1. DROP redundant service_role FOR ALL policies (11 tables)
--   2. ADD WITH CHECK to UPDATE policies that were missing it (9 tables)
--   3. Split user_roles FOR ALL into per-operation policies
--   4. Clean up industry_playbooks: drop old FOR ALL policies
--   5. Add profiles CRUD policies (INSERT, UPDATE, DELETE)
--   6. Add validator_reports user-facing policies (SELECT, INSERT, UPDATE)
--   7. Replace old CRUD policies on activities, ai_runs, chat_messages,
--      chat_sessions, lean_canvases, org_members, organizations,
--      pitch_deck_slides, pitch_decks
--
-- Conventions:
--   - DROP POLICY IF EXISTS before CREATE for idempotency
--   - (SELECT auth.uid()) wrapped form for initPlan caching
--   - service_role bypasses RLS — never create explicit policies for it
--   - UPDATE policies always have both USING and WITH CHECK
--   - Multi-tenancy via user_org_id(), startup_in_org(uuid)
-- ============================================================================


-- ============================================================================
-- 1. DROP REDUNDANT service_role FOR ALL POLICIES
-- ============================================================================
-- service_role has BYPASSRLS; explicit policies are unnecessary and were
-- already dropped on remote. Some of these were already handled by
-- 20260307100000_drop_redundant_service_role_policies.sql but we include
-- the remaining ones here for completeness. DROP IF EXISTS is safe.

DROP POLICY IF EXISTS "service role has full access to activities" ON public.activities;
DROP POLICY IF EXISTS "service role has full access to ai runs" ON public.ai_runs;
DROP POLICY IF EXISTS "service role has full access to chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "service role has full access to chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "service role has full access to lean canvases" ON public.lean_canvases;
DROP POLICY IF EXISTS "service role has full access to org members" ON public.org_members;
DROP POLICY IF EXISTS "service role has full access to organizations" ON public.organizations;
DROP POLICY IF EXISTS "service role has full access to pitch decks" ON public.pitch_decks;
DROP POLICY IF EXISTS "Service role has full access to validation_reports" ON public.validator_reports;

-- pitch_deck_slides didn't have an explicit service_role policy in migrations
-- but drop it just in case one was created manually:
DROP POLICY IF EXISTS "service role has full access to pitch deck slides" ON public.pitch_deck_slides;


-- ============================================================================
-- 2. user_roles: SPLIT FOR ALL INTO PER-OPERATION POLICIES
-- ============================================================================
-- Original migration had:
--   "Users can view own roles" (SELECT, keep)
--   "Admins can manage all roles" (FOR ALL, drop and replace)
-- Remote now has 5 separate policies. Reconcile local.

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Recreate the 5 per-operation policies to match remote:
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING ((( SELECT auth.uid() AS uid) = user_id));

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));


-- ============================================================================
-- 3. industry_playbooks: DROP OLD FOR ALL POLICIES
-- ============================================================================
-- Original migration had "Public read access", "Admin write access",
-- "Service role bypass". Remote now has only a single SELECT policy.

DROP POLICY IF EXISTS "Public read access" ON public.industry_playbooks;
DROP POLICY IF EXISTS "Admin write access" ON public.industry_playbooks;
DROP POLICY IF EXISTS "Service role bypass" ON public.industry_playbooks;

DROP POLICY IF EXISTS "Anyone can view active industry playbooks" ON public.industry_playbooks;
CREATE POLICY "Anyone can view active industry playbooks"
  ON public.industry_playbooks FOR SELECT TO anon, authenticated
  USING ((is_active = true));


-- ============================================================================
-- 4. profiles: ADD INSERT, UPDATE, DELETE POLICIES
-- ============================================================================
-- Original migrations only had SELECT policies. Remote now has full CRUD.
-- Also update the SELECT policies to use wrapped (SELECT auth.uid()) form.

-- Drop old SELECT policies
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users view org member profiles" ON public.profiles;

-- Recreate SELECT with wrapped uid form
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING ((id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "Users view org member profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (((org_id IS NOT NULL) AND (org_id = ( SELECT user_org_id() AS user_org_id))));

-- New INSERT policy
DROP POLICY IF EXISTS "Users create own profile" ON public.profiles;
CREATE POLICY "Users create own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK ((id = ( SELECT auth.uid() AS uid)));

-- New UPDATE policy
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING ((id = ( SELECT auth.uid() AS uid)))
  WITH CHECK ((id = ( SELECT auth.uid() AS uid)));

-- New DELETE policy
DROP POLICY IF EXISTS "Users delete own profile" ON public.profiles;
CREATE POLICY "Users delete own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING ((id = ( SELECT auth.uid() AS uid)));


-- ============================================================================
-- 5. activities: REPLACE OLD POLICIES WITH NEW CRUD SET
-- ============================================================================
-- Old: SELECT + INSERT only (no update/delete for users) + service_role FOR ALL
-- Remote: 4 policies with startup_in_org() helper

DROP POLICY IF EXISTS "authenticated users can view activities" ON public.activities;
DROP POLICY IF EXISTS "authenticated users can create activities" ON public.activities;

DROP POLICY IF EXISTS "users can view activities in their org" ON public.activities;
CREATE POLICY "users can view activities in their org"
  ON public.activities FOR SELECT TO authenticated
  USING (startup_in_org(startup_id));

DROP POLICY IF EXISTS "users can create activities in their org" ON public.activities;
CREATE POLICY "users can create activities in their org"
  ON public.activities FOR INSERT TO authenticated
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "users can update activities in their org" ON public.activities;
CREATE POLICY "users can update activities in their org"
  ON public.activities FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id))
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "users can delete own activities in their org" ON public.activities;
CREATE POLICY "users can delete own activities in their org"
  ON public.activities FOR DELETE TO authenticated
  USING (startup_in_org(startup_id));


-- ============================================================================
-- 6. ai_runs: REPLACE OLD POLICIES WITH NEW CRUD SET
-- ============================================================================
-- Old: SELECT only + service_role FOR ALL
-- Remote: 4 policies using org_id = user_org_id()

DROP POLICY IF EXISTS "users can view ai runs for their startups" ON public.ai_runs;

DROP POLICY IF EXISTS "Users view ai runs in org" ON public.ai_runs;
CREATE POLICY "Users view ai runs in org"
  ON public.ai_runs FOR SELECT TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)) OR startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users insert ai runs in org" ON public.ai_runs;
CREATE POLICY "Users insert ai runs in org"
  ON public.ai_runs FOR INSERT TO authenticated
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)) OR startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users update ai runs in org" ON public.ai_runs;
CREATE POLICY "Users update ai runs in org"
  ON public.ai_runs FOR UPDATE TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)) OR startup_in_org(startup_id))
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)) OR startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users delete ai runs in org" ON public.ai_runs;
CREATE POLICY "Users delete ai runs in org"
  ON public.ai_runs FOR DELETE TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)) OR startup_in_org(startup_id));


-- ============================================================================
-- 7. chat_sessions: REPLACE OLD POLICIES WITH NEW OWNER-BASED SET
-- ============================================================================
-- Old: mixed user_id + startup_id policies + service_role FOR ALL
-- Remote: 4 policies using user_id = auth.uid() only

DROP POLICY IF EXISTS "users can view their chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "users can create chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "users can update their chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "users can delete their chat sessions" ON public.chat_sessions;

DROP POLICY IF EXISTS "Users view own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users view own chat sessions"
  ON public.chat_sessions FOR SELECT TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)));

DROP POLICY IF EXISTS "Users insert own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users insert own chat sessions"
  ON public.chat_sessions FOR INSERT TO authenticated
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));

DROP POLICY IF EXISTS "Users update own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users update own chat sessions"
  ON public.chat_sessions FOR UPDATE TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)))
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));

DROP POLICY IF EXISTS "Users delete own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users delete own chat sessions"
  ON public.chat_sessions FOR DELETE TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)));


-- ============================================================================
-- 8. chat_messages: REPLACE OLD POLICIES WITH NEW OWNER-BASED SET
-- ============================================================================
-- Old: session-based policies + service_role FOR ALL, no delete for users
-- Remote: 4 policies using user_id = auth.uid() directly

DROP POLICY IF EXISTS "users can view their chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "users can create chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "users can update message feedback" ON public.chat_messages;

DROP POLICY IF EXISTS "Users view own chat messages" ON public.chat_messages;
CREATE POLICY "Users view own chat messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING ((session_id IN ( SELECT cs.id FROM chat_sessions cs WHERE cs.user_id = ( SELECT auth.uid() AS uid))));

DROP POLICY IF EXISTS "Users insert own chat messages" ON public.chat_messages;
CREATE POLICY "Users insert own chat messages"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK ((session_id IN ( SELECT cs.id FROM chat_sessions cs WHERE cs.user_id = ( SELECT auth.uid() AS uid))));

DROP POLICY IF EXISTS "Users update own chat messages" ON public.chat_messages;
CREATE POLICY "Users update own chat messages"
  ON public.chat_messages FOR UPDATE TO authenticated
  USING ((session_id IN ( SELECT cs.id FROM chat_sessions cs WHERE cs.user_id = ( SELECT auth.uid() AS uid))))
  WITH CHECK ((session_id IN ( SELECT cs.id FROM chat_sessions cs WHERE cs.user_id = ( SELECT auth.uid() AS uid))));

DROP POLICY IF EXISTS "Users delete own chat messages" ON public.chat_messages;
CREATE POLICY "Users delete own chat messages"
  ON public.chat_messages FOR DELETE TO authenticated
  USING ((session_id IN ( SELECT cs.id FROM chat_sessions cs WHERE cs.user_id = ( SELECT auth.uid() AS uid))));


-- ============================================================================
-- 9. lean_canvases: REPLACE OLD POLICIES WITH NEW EXPRESSION
-- ============================================================================
-- Old: startup_id IN (SELECT s.id FROM startups s WHERE s.org_id = user_org_id())
--      + service_role FOR ALL
-- Remote: startup_id IN (SELECT s.id FROM startups s JOIN profiles p ...)
-- Also need to add WITH CHECK on UPDATE (was missing locally)

DROP POLICY IF EXISTS "authenticated users can view lean canvases" ON public.lean_canvases;
DROP POLICY IF EXISTS "authenticated users can create lean canvases" ON public.lean_canvases;
DROP POLICY IF EXISTS "authenticated users can update lean canvases" ON public.lean_canvases;
DROP POLICY IF EXISTS "authenticated users can delete lean canvases" ON public.lean_canvases;

DROP POLICY IF EXISTS "lean_canvases_select_org" ON public.lean_canvases;
CREATE POLICY "lean_canvases_select_org"
  ON public.lean_canvases FOR SELECT TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "lean_canvases_insert_org" ON public.lean_canvases;
CREATE POLICY "lean_canvases_insert_org"
  ON public.lean_canvases FOR INSERT TO authenticated
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "lean_canvases_update_org" ON public.lean_canvases;
CREATE POLICY "lean_canvases_update_org"
  ON public.lean_canvases FOR UPDATE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "lean_canvases_delete_org" ON public.lean_canvases;
CREATE POLICY "lean_canvases_delete_org"
  ON public.lean_canvases FOR DELETE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));


-- ============================================================================
-- 10. org_members: REPLACE OLD POLICIES WITH NEW SET
-- ============================================================================
-- Old: session-based self-referencing policies + service_role FOR ALL
-- Remote: 4 policies using user_org_id() + org_role() helpers

DROP POLICY IF EXISTS "authenticated users can view org members" ON public.org_members;
DROP POLICY IF EXISTS "org admins can invite members" ON public.org_members;
DROP POLICY IF EXISTS "org admins can update members" ON public.org_members;
DROP POLICY IF EXISTS "org owners can remove members" ON public.org_members;

DROP POLICY IF EXISTS "Users view org memberships" ON public.org_members;
CREATE POLICY "Users view org memberships"
  ON public.org_members FOR SELECT TO authenticated
  USING (((user_id = ( SELECT auth.uid() AS uid)) OR (org_id = ( SELECT user_org_id() AS user_org_id))));

DROP POLICY IF EXISTS "Admins insert org memberships" ON public.org_members;
CREATE POLICY "Admins insert org memberships"
  ON public.org_members FOR INSERT TO authenticated
  WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));

DROP POLICY IF EXISTS "Admins update org memberships" ON public.org_members;
CREATE POLICY "Admins update org memberships"
  ON public.org_members FOR UPDATE TO authenticated
  USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))))
  WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));

DROP POLICY IF EXISTS "Admins delete org memberships" ON public.org_members;
CREATE POLICY "Admins delete org memberships"
  ON public.org_members FOR DELETE TO authenticated
  USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));


-- ============================================================================
-- 11. organizations: REPLACE OLD POLICIES WITH NEW SET
-- ============================================================================
-- Old: org_members-based policies + service_role FOR ALL
-- Remote: 4 policies using user_org_id() + org_role()

DROP POLICY IF EXISTS "users can view own organizations" ON public.organizations;
DROP POLICY IF EXISTS "authenticated users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "org admins can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "org owners can delete organizations" ON public.organizations;

DROP POLICY IF EXISTS "Users view own organization" ON public.organizations;
CREATE POLICY "Users view own organization"
  ON public.organizations FOR SELECT TO authenticated
  USING ((id = ( SELECT user_org_id() AS user_org_id)));

DROP POLICY IF EXISTS "Users can create first organization only" ON public.organizations;
CREATE POLICY "Users can create first organization only"
  ON public.organizations FOR INSERT TO authenticated
  WITH CHECK ((( SELECT auth.uid() AS uid) IS NOT NULL) AND (NOT (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.org_id IS NOT NULL))))));

DROP POLICY IF EXISTS "Admins update organization" ON public.organizations;
CREATE POLICY "Admins update organization"
  ON public.organizations FOR UPDATE TO authenticated
  USING (((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))))
  WITH CHECK (((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));

DROP POLICY IF EXISTS "Owners delete organization" ON public.organizations;
CREATE POLICY "Owners delete organization"
  ON public.organizations FOR DELETE TO authenticated
  USING (((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = 'owner'::text)));


-- ============================================================================
-- 12. pitch_decks: REPLACE OLD POLICIES WITH startup_in_org() HELPER
-- ============================================================================
-- Old: startup_id IN (SELECT ... WHERE user_org_id()) + service_role FOR ALL
-- Remote: startup_in_org(startup_id) helper

DROP POLICY IF EXISTS "users can view pitch decks for their startups" ON public.pitch_decks;
DROP POLICY IF EXISTS "users can create pitch decks" ON public.pitch_decks;
DROP POLICY IF EXISTS "users can update pitch decks" ON public.pitch_decks;
DROP POLICY IF EXISTS "users can delete pitch decks" ON public.pitch_decks;

DROP POLICY IF EXISTS "Users can view pitch decks for their startups" ON public.pitch_decks;
CREATE POLICY "Users can view pitch decks for their startups"
  ON public.pitch_decks FOR SELECT TO authenticated
  USING (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users can create pitch decks for their startups" ON public.pitch_decks;
CREATE POLICY "Users can create pitch decks for their startups"
  ON public.pitch_decks FOR INSERT TO authenticated
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users can update pitch decks for their startups" ON public.pitch_decks;
CREATE POLICY "Users can update pitch decks for their startups"
  ON public.pitch_decks FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id))
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users can delete pitch decks for their startups" ON public.pitch_decks;
CREATE POLICY "Users can delete pitch decks for their startups"
  ON public.pitch_decks FOR DELETE TO authenticated
  USING (startup_in_org(startup_id));


-- ============================================================================
-- 13. pitch_deck_slides: REPLACE OLD POLICIES WITH startup_in_org() HELPER
-- ============================================================================
-- Old: startup_id IN (SELECT ... WHERE user_org_id()) via pitch_decks join
-- Remote: EXISTS (SELECT 1 FROM pitch_decks WHERE ... startup_in_org())

DROP POLICY IF EXISTS "users can view slides for accessible decks" ON public.pitch_deck_slides;
DROP POLICY IF EXISTS "users can create slides for accessible decks" ON public.pitch_deck_slides;
DROP POLICY IF EXISTS "users can update slides for accessible decks" ON public.pitch_deck_slides;
DROP POLICY IF EXISTS "users can delete slides for accessible decks" ON public.pitch_deck_slides;

DROP POLICY IF EXISTS "Users can view slides for accessible decks" ON public.pitch_deck_slides;
CREATE POLICY "Users can view slides for accessible decks"
  ON public.pitch_deck_slides FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND startup_in_org(pitch_decks.startup_id)))));

DROP POLICY IF EXISTS "Users can create slides for accessible decks" ON public.pitch_deck_slides;
CREATE POLICY "Users can create slides for accessible decks"
  ON public.pitch_deck_slides FOR INSERT TO authenticated
  WITH CHECK ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND startup_in_org(pitch_decks.startup_id)))));

DROP POLICY IF EXISTS "Users can update slides for accessible decks" ON public.pitch_deck_slides;
CREATE POLICY "Users can update slides for accessible decks"
  ON public.pitch_deck_slides FOR UPDATE TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND startup_in_org(pitch_decks.startup_id)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND startup_in_org(pitch_decks.startup_id)))));

DROP POLICY IF EXISTS "Users can delete slides for accessible decks" ON public.pitch_deck_slides;
CREATE POLICY "Users can delete slides for accessible decks"
  ON public.pitch_deck_slides FOR DELETE TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND startup_in_org(pitch_decks.startup_id)))));


-- ============================================================================
-- 14. decisions: ADD WITH CHECK TO UPDATE (was missing in local migration)
-- ============================================================================
-- Old local had UPDATE USING only; remote has USING + WITH CHECK.
-- Also replace the join pattern with wrapped (SELECT auth.uid()) form.

DROP POLICY IF EXISTS "decisions_select" ON public.decisions;
CREATE POLICY "decisions_select"
  ON public.decisions FOR SELECT TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "decisions_insert" ON public.decisions;
CREATE POLICY "decisions_insert"
  ON public.decisions FOR INSERT TO authenticated
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "decisions_update" ON public.decisions;
CREATE POLICY "decisions_update"
  ON public.decisions FOR UPDATE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "decisions_delete" ON public.decisions;
CREATE POLICY "decisions_delete"
  ON public.decisions FOR DELETE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));


-- ============================================================================
-- 15. decision_evidence: ADD WITH CHECK TO UPDATE (was missing locally)
-- ============================================================================

DROP POLICY IF EXISTS "evidence_select" ON public.decision_evidence;
CREATE POLICY "evidence_select"
  ON public.decision_evidence FOR SELECT TO authenticated
  USING ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));

DROP POLICY IF EXISTS "evidence_insert" ON public.decision_evidence;
CREATE POLICY "evidence_insert"
  ON public.decision_evidence FOR INSERT TO authenticated
  WITH CHECK ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));

DROP POLICY IF EXISTS "evidence_update" ON public.decision_evidence;
CREATE POLICY "evidence_update"
  ON public.decision_evidence FOR UPDATE TO authenticated
  USING ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))))
  WITH CHECK ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));

DROP POLICY IF EXISTS "evidence_delete" ON public.decision_evidence;
CREATE POLICY "evidence_delete"
  ON public.decision_evidence FOR DELETE TO authenticated
  USING ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));


-- ============================================================================
-- 16. investors: REPLACE OLD POLICIES WITH startup_in_org() HELPER
-- ============================================================================
-- Old: startup_id-based join policies + Dev bypass
-- Remote: startup_in_org(startup_id) helper with WITH CHECK on UPDATE

DROP POLICY IF EXISTS "Users can view investors in their org startups" ON public.investors;
DROP POLICY IF EXISTS "Users can insert investors in their org startups" ON public.investors;
DROP POLICY IF EXISTS "Users can update investors in their org startups" ON public.investors;
DROP POLICY IF EXISTS "Users can delete investors in their org startups" ON public.investors;
DROP POLICY IF EXISTS "Dev bypass for investors" ON public.investors;
DROP POLICY IF EXISTS "Dev: Allow read investors when no auth" ON public.investors;

DROP POLICY IF EXISTS "Authenticated users view investors in org" ON public.investors;
CREATE POLICY "Authenticated users view investors in org"
  ON public.investors FOR SELECT TO authenticated
  USING (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Authenticated users insert investors in org" ON public.investors;
CREATE POLICY "Authenticated users insert investors in org"
  ON public.investors FOR INSERT TO authenticated
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Authenticated users update investors in org" ON public.investors;
CREATE POLICY "Authenticated users update investors in org"
  ON public.investors FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id))
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Authenticated users delete investors in org" ON public.investors;
CREATE POLICY "Authenticated users delete investors in org"
  ON public.investors FOR DELETE TO authenticated
  USING (startup_in_org(startup_id));


-- ============================================================================
-- 17. opportunity_canvas: REPLACE OLD POLICIES WITH startup_in_org() HELPER
-- ============================================================================
-- Old: startup_id IN (SELECT ... JOIN org_members) with no WITH CHECK on UPDATE
-- Remote: startup_in_org(startup_id) with WITH CHECK on UPDATE

DROP POLICY IF EXISTS "Users can view opportunity canvas for their startups" ON public.opportunity_canvas;
DROP POLICY IF EXISTS "Users can insert opportunity canvas for their startups" ON public.opportunity_canvas;
DROP POLICY IF EXISTS "Users can update opportunity canvas for their startups" ON public.opportunity_canvas;
DROP POLICY IF EXISTS "Users can delete opportunity canvas for their startups" ON public.opportunity_canvas;

CREATE POLICY "Users can view opportunity canvas for their startups"
  ON public.opportunity_canvas FOR SELECT TO authenticated
  USING (startup_in_org(startup_id));

CREATE POLICY "Users can insert opportunity canvas for their startups"
  ON public.opportunity_canvas FOR INSERT TO authenticated
  WITH CHECK (startup_in_org(startup_id));

CREATE POLICY "Users can update opportunity canvas for their startups"
  ON public.opportunity_canvas FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id))
  WITH CHECK (startup_in_org(startup_id));

CREATE POLICY "Users can delete opportunity canvas for their startups"
  ON public.opportunity_canvas FOR DELETE TO authenticated
  USING (startup_in_org(startup_id));


-- ============================================================================
-- 18. shareable_links: REPLACE OLD POLICIES
-- ============================================================================
-- Old: startup_id IN (JOIN org_members) + old anon token policy + service_role
-- Remote: same USING pattern but different anon policy name and expression

DROP POLICY IF EXISTS "links_select_org" ON public.shareable_links;
DROP POLICY IF EXISTS "links_insert_org" ON public.shareable_links;
DROP POLICY IF EXISTS "links_update_org" ON public.shareable_links;
DROP POLICY IF EXISTS "links_public_read" ON public.shareable_links;

CREATE POLICY "links_select_org"
  ON public.shareable_links FOR SELECT TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

CREATE POLICY "links_insert_org"
  ON public.shareable_links FOR INSERT TO authenticated
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

CREATE POLICY "links_update_org"
  ON public.shareable_links FOR UPDATE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

-- Replace old anon token policy with get_share_token() helper
DROP POLICY IF EXISTS "links_anon_check_status" ON public.shareable_links;
CREATE POLICY "links_anon_check_status"
  ON public.shareable_links FOR SELECT TO anon
  USING ((token = ( SELECT get_share_token() AS get_share_token)));


-- ============================================================================
-- 19. validator_sessions: ADD WITH CHECK TO UPDATE
-- ============================================================================
-- Old: no local policies for validator_sessions (only via edge function)
-- Remote: full CRUD on user_id = auth.uid()

DROP POLICY IF EXISTS "Users can view their own sessions" ON public.validator_sessions;
CREATE POLICY "Users can view their own sessions"
  ON public.validator_sessions FOR SELECT TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)));

DROP POLICY IF EXISTS "Users can create their own sessions" ON public.validator_sessions;
CREATE POLICY "Users can create their own sessions"
  ON public.validator_sessions FOR INSERT TO authenticated
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));

DROP POLICY IF EXISTS "Users can update their own sessions" ON public.validator_sessions;
CREATE POLICY "Users can update their own sessions"
  ON public.validator_sessions FOR UPDATE TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)))
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));

DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.validator_sessions;
CREATE POLICY "Users can delete their own sessions"
  ON public.validator_sessions FOR DELETE TO authenticated
  USING ((user_id = ( SELECT auth.uid() AS uid)));


-- ============================================================================
-- 20. validator_reports: REPLACE OLD POLICIES WITH SESSION-BASED USER ACCESS
-- ============================================================================
-- Old: run_id based SELECT + service_role FOR ALL
-- Remote: session_id based SELECT + INSERT + UPDATE + anon share token

DROP POLICY IF EXISTS "Users can view validation reports for their organization" ON public.validator_reports;

DROP POLICY IF EXISTS "Users can view reports from their validator sessions" ON public.validator_reports;
CREATE POLICY "Users can view reports from their validator sessions"
  ON public.validator_reports FOR SELECT TO authenticated
  USING ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "Users can insert reports via their sessions" ON public.validator_reports;
CREATE POLICY "Users can insert reports via their sessions"
  ON public.validator_reports FOR INSERT TO authenticated
  WITH CHECK ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "Users can update reports from their sessions" ON public.validator_reports;
CREATE POLICY "Users can update reports from their sessions"
  ON public.validator_reports FOR UPDATE TO authenticated
  USING ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));

-- Public read via share token for anon users
DROP POLICY IF EXISTS "reports_public_read_via_share_token" ON public.validator_reports;
CREATE POLICY "reports_public_read_via_share_token"
  ON public.validator_reports FOR SELECT TO anon
  USING ((EXISTS ( SELECT 1
   FROM shareable_links sl
  WHERE ((sl.resource_type = 'validation_report'::text) AND (sl.resource_id = validator_reports.id) AND (sl.revoked_at IS NULL) AND (sl.expires_at > now()) AND (sl.token = ( SELECT get_share_token() AS get_share_token))))));


-- ============================================================================
-- 21. weekly_reviews: ADD WITH CHECK TO UPDATE + REPLACE OLD POLICIES
-- ============================================================================
-- Old: startup_id IN (JOIN org_members WHERE user_id = auth.uid())
--      with no WITH CHECK on UPDATE + service_role FOR ALL
-- Remote: same pattern but with WITH CHECK on UPDATE, service_role dropped

DROP POLICY IF EXISTS "reviews_select" ON public.weekly_reviews;
CREATE POLICY "reviews_select"
  ON public.weekly_reviews FOR SELECT TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "reviews_insert" ON public.weekly_reviews;
CREATE POLICY "reviews_insert"
  ON public.weekly_reviews FOR INSERT TO authenticated
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "reviews_update" ON public.weekly_reviews;
CREATE POLICY "reviews_update"
  ON public.weekly_reviews FOR UPDATE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "reviews_delete" ON public.weekly_reviews;
CREATE POLICY "reviews_delete"
  ON public.weekly_reviews FOR DELETE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));


-- ============================================================================
-- 22. assumptions: ADD WITH CHECK TO UPDATE + REPLACE OLD POLICIES
-- ============================================================================
-- Old: startup_id IN (JOIN org_members) with no WITH CHECK on UPDATE
--      + service_role policies (already dropped by earlier migration)
-- Remote: same join pattern with WITH CHECK on UPDATE

DROP POLICY IF EXISTS "assumptions_select" ON public.assumptions;
DROP POLICY IF EXISTS "assumptions_insert" ON public.assumptions;
DROP POLICY IF EXISTS "assumptions_update" ON public.assumptions;
DROP POLICY IF EXISTS "assumptions_delete" ON public.assumptions;

DROP POLICY IF EXISTS "assumptions_select_authenticated" ON public.assumptions;
CREATE POLICY "assumptions_select_authenticated"
  ON public.assumptions FOR SELECT TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "assumptions_insert_authenticated" ON public.assumptions;
CREATE POLICY "assumptions_insert_authenticated"
  ON public.assumptions FOR INSERT TO authenticated
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "assumptions_update_authenticated" ON public.assumptions;
CREATE POLICY "assumptions_update_authenticated"
  ON public.assumptions FOR UPDATE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));

DROP POLICY IF EXISTS "assumptions_delete_authenticated" ON public.assumptions;
CREATE POLICY "assumptions_delete_authenticated"
  ON public.assumptions FOR DELETE TO authenticated
  USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));


-- ============================================================================
-- 23. prompt_packs & prompt_pack_steps: ENSURE CORRECT SELECT-ONLY POLICIES
-- ============================================================================
-- These are reference tables. Remote has single SELECT policy each.
-- Drop any old FOR ALL or write policies that may exist in local.

-- prompt_packs
DROP POLICY IF EXISTS "Anyone can view active prompt packs" ON public.prompt_packs;
CREATE POLICY "Anyone can view active prompt packs"
  ON public.prompt_packs FOR SELECT TO anon, authenticated
  USING ((is_active = true));

-- prompt_pack_steps
DROP POLICY IF EXISTS "Anyone can view prompt pack steps" ON public.prompt_pack_steps;
CREATE POLICY "Anyone can view prompt pack steps"
  ON public.prompt_pack_steps FOR SELECT TO anon, authenticated
  USING ((EXISTS ( SELECT 1
   FROM prompt_packs
  WHERE ((prompt_packs.id = prompt_pack_steps.pack_id) AND (prompt_packs.is_active = true)))));


-- ============================================================================
-- DONE
-- ============================================================================
