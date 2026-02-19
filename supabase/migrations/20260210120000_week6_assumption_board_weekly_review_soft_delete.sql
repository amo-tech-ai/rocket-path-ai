-- ============================================================
-- Week 6: Schema Changes (013-CF + 014-CF + 015-SCH)
-- Assumption board ALTERs, weekly_reviews table, soft delete
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. ASSUMPTION BOARD (013-CF)
-- ─────────────────────────────────────────────
ALTER TABLE assumptions
  ADD COLUMN IF NOT EXISTS risk_score numeric DEFAULT 50
    CONSTRAINT assumptions_risk_score_range CHECK (risk_score >= 0 AND risk_score <= 100),
  ADD COLUMN IF NOT EXISTS evidence_count integer DEFAULT 0;

-- ─────────────────────────────────────────────
-- 2. WEEKLY REVIEWS (014-CF)
-- ─────────────────────────────────────────────
CREATE TABLE weekly_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  week_end date NOT NULL,
  summary text,
  key_learnings jsonb DEFAULT '[]'::jsonb,
  priorities_next_week jsonb DEFAULT '[]'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  assumptions_tested integer DEFAULT 0,
  experiments_run integer DEFAULT 0,
  decisions_made integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  health_score_start integer,
  health_score_end integer,
  ai_generated boolean DEFAULT true,
  edited_by_user boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select" ON weekly_reviews FOR SELECT TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "reviews_insert" ON weekly_reviews FOR INSERT TO authenticated
  WITH CHECK (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "reviews_update" ON weekly_reviews FOR UPDATE TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "reviews_delete" ON weekly_reviews FOR DELETE TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "reviews_service" ON weekly_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_weekly_reviews_startup_id ON weekly_reviews(startup_id);
CREATE INDEX idx_weekly_reviews_week_start ON weekly_reviews(week_start DESC);
CREATE INDEX idx_weekly_reviews_created_by ON weekly_reviews(created_by);
CREATE UNIQUE INDEX idx_weekly_reviews_startup_week ON weekly_reviews(startup_id, week_start);

CREATE TRIGGER set_weekly_reviews_updated_at
  BEFORE UPDATE ON weekly_reviews
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─────────────────────────────────────────────
-- 3. SOFT DELETE (015-SCH)
-- ─────────────────────────────────────────────

-- 3a. Add deleted_at column to 6 core tables
ALTER TABLE startups ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- 3b. Partial indexes for cleanup queries (find rows to hard-delete after 30 days)
CREATE INDEX IF NOT EXISTS idx_startups_deleted_at ON startups(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_deleted_at ON contacts(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deals_deleted_at ON deals(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NOT NULL;

-- 3c. Update RLS policies: add AND deleted_at IS NULL to SELECT/UPDATE/DELETE USING clauses
-- Pattern: DROP + CREATE (can't ALTER USING clause text)

-- === STARTUPS ===
DROP POLICY IF EXISTS "Users view startups in org" ON startups;
CREATE POLICY "Users view startups in org" ON startups FOR SELECT TO authenticated
  USING (org_id = (SELECT user_org_id()) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users update startups in org" ON startups;
CREATE POLICY "Users update startups in org" ON startups FOR UPDATE TO authenticated
  USING (org_id = (SELECT user_org_id()) AND deleted_at IS NULL)
  WITH CHECK (org_id = (SELECT user_org_id()));

DROP POLICY IF EXISTS "Users delete startups in org" ON startups;
CREATE POLICY "Users delete startups in org" ON startups FOR DELETE TO authenticated
  USING (org_id = (SELECT user_org_id()) AND deleted_at IS NULL);

-- === CONTACTS ===
DROP POLICY IF EXISTS "Users view contacts in org" ON contacts;
CREATE POLICY "Users view contacts in org" ON contacts FOR SELECT TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users update contacts in org" ON contacts;
CREATE POLICY "Users update contacts in org" ON contacts FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL)
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users delete contacts in org" ON contacts;
CREATE POLICY "Users delete contacts in org" ON contacts FOR DELETE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

-- === DEALS ===
DROP POLICY IF EXISTS "Users view deals in org" ON deals;
CREATE POLICY "Users view deals in org" ON deals FOR SELECT TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users update deals in org" ON deals;
CREATE POLICY "Users update deals in org" ON deals FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL)
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users delete deals in org" ON deals;
CREATE POLICY "Users delete deals in org" ON deals FOR DELETE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

-- === DOCUMENTS ===
DROP POLICY IF EXISTS "Users view documents in org" ON documents;
CREATE POLICY "Users view documents in org" ON documents FOR SELECT TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users update documents in org" ON documents;
CREATE POLICY "Users update documents in org" ON documents FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL)
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users delete documents in org" ON documents;
CREATE POLICY "Users delete documents in org" ON documents FOR DELETE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

-- === PROJECTS ===
DROP POLICY IF EXISTS "Users view projects in org" ON projects;
CREATE POLICY "Users view projects in org" ON projects FOR SELECT TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users update projects in org" ON projects;
CREATE POLICY "Users update projects in org" ON projects FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL)
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users delete projects in org" ON projects;
CREATE POLICY "Users delete projects in org" ON projects FOR DELETE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

-- === TASKS ===
DROP POLICY IF EXISTS "Users view tasks in org" ON tasks;
CREATE POLICY "Users view tasks in org" ON tasks FOR SELECT TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users update tasks in org" ON tasks;
CREATE POLICY "Users update tasks in org" ON tasks FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL)
  WITH CHECK (startup_in_org(startup_id));

DROP POLICY IF EXISTS "Users delete tasks in org" ON tasks;
CREATE POLICY "Users delete tasks in org" ON tasks FOR DELETE TO authenticated
  USING (startup_in_org(startup_id) AND deleted_at IS NULL);
