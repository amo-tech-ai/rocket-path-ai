-- 008-SI: Smart Interviewer Data Layer
-- 6 ALTER TABLEs + 1 CREATE TABLE + RLS + Indexes + Lock Enforcement + Trigger
-- Both tables have 0 rows — safe to alter without data migration.

----------------------------------------------------------------------
-- Phase 1: ALTER interview_insights (4 new columns)
----------------------------------------------------------------------

-- A1: Risk tagging (SI-006)
ALTER TABLE interview_insights
  ADD COLUMN risk_type text CHECK (risk_type IN ('market', 'technical', 'regulatory', 'competitive', 'financial'));

-- A2: Locked answers (SI-007)
ALTER TABLE interview_insights
  ADD COLUMN is_locked boolean DEFAULT false;

-- A3: Depth tracking (SI-005)
ALTER TABLE interview_insights
  ADD COLUMN depth text DEFAULT 'none' CHECK (depth IN ('none', 'shallow', 'deep'));

-- A4: Hypothesis link (SI-002)
ALTER TABLE interview_insights
  ADD COLUMN hypothesis_id uuid REFERENCES assumptions(id);

----------------------------------------------------------------------
-- Phase 2: ALTER interviews (2 new columns)
----------------------------------------------------------------------

-- A5: Interview mode (SI-012)
ALTER TABLE interviews
  ADD COLUMN interview_mode text DEFAULT 'smart' CHECK (interview_mode IN ('smart', 'quick', 'deep'));

-- A6: Readiness score (SI-004)
ALTER TABLE interviews
  ADD COLUMN readiness_score numeric CHECK (readiness_score >= 0 AND readiness_score <= 100);

----------------------------------------------------------------------
-- Phase 3: CREATE interview_questions (M1)
----------------------------------------------------------------------

CREATE TABLE interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('discovery', 'hypothesis', 'invalidation', 'depth', 'confirmation')),
  hypothesis_id uuid REFERENCES assumptions(id),
  decision_unlocked text,
  answer_text text,
  sequence_order integer NOT NULL,
  asked_at timestamptz,
  answered_at timestamptz,
  skipped boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

----------------------------------------------------------------------
-- Phase 4: Lock enforcement — interview_insights UPDATE policy
----------------------------------------------------------------------

DROP POLICY IF EXISTS "interview_insights_update_authenticated" ON interview_insights;

CREATE POLICY "interview_insights_update_authenticated"
  ON interview_insights FOR UPDATE TO authenticated
  USING (
    interview_id IN (
      SELECT i.id FROM interviews i
      INNER JOIN startups s ON s.id = i.startup_id
      INNER JOIN org_members om ON om.org_id = s.org_id
      WHERE om.user_id = (SELECT auth.uid())
    )
    AND (NOT is_locked)
  )
  WITH CHECK (
    interview_id IN (
      SELECT i.id FROM interviews i
      INNER JOIN startups s ON s.id = i.startup_id
      INNER JOIN org_members om ON om.org_id = s.org_id
      WHERE om.user_id = (SELECT auth.uid())
    )
  );

----------------------------------------------------------------------
-- Phase 5: RLS for interview_questions
----------------------------------------------------------------------

ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interview_questions_select_authenticated"
  ON interview_questions FOR SELECT TO authenticated
  USING (interview_id IN (
    SELECT i.id FROM interviews i
    JOIN startups s ON s.id = i.startup_id
    JOIN org_members om ON om.org_id = s.org_id
    WHERE om.user_id = (SELECT auth.uid())
  ));

CREATE POLICY "interview_questions_insert_authenticated"
  ON interview_questions FOR INSERT TO authenticated
  WITH CHECK (interview_id IN (
    SELECT i.id FROM interviews i
    JOIN startups s ON s.id = i.startup_id
    JOIN org_members om ON om.org_id = s.org_id
    WHERE om.user_id = (SELECT auth.uid())
  ));

CREATE POLICY "interview_questions_update_authenticated"
  ON interview_questions FOR UPDATE TO authenticated
  USING (interview_id IN (
    SELECT i.id FROM interviews i
    JOIN startups s ON s.id = i.startup_id
    JOIN org_members om ON om.org_id = s.org_id
    WHERE om.user_id = (SELECT auth.uid())
  ))
  WITH CHECK (interview_id IN (
    SELECT i.id FROM interviews i
    JOIN startups s ON s.id = i.startup_id
    JOIN org_members om ON om.org_id = s.org_id
    WHERE om.user_id = (SELECT auth.uid())
  ));

CREATE POLICY "interview_questions_delete_authenticated"
  ON interview_questions FOR DELETE TO authenticated
  USING (interview_id IN (
    SELECT i.id FROM interviews i
    JOIN startups s ON s.id = i.startup_id
    JOIN org_members om ON om.org_id = s.org_id
    WHERE om.user_id = (SELECT auth.uid())
  ));

CREATE POLICY "interview_questions_service_role"
  ON interview_questions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

----------------------------------------------------------------------
-- Phase 6: Indexes
----------------------------------------------------------------------

CREATE INDEX idx_interview_questions_interview_id ON interview_questions(interview_id);
CREATE INDEX idx_interview_questions_interview_sequence ON interview_questions(interview_id, sequence_order);
CREATE INDEX idx_interview_questions_hypothesis_id ON interview_questions(hypothesis_id);
CREATE INDEX idx_interview_insights_hypothesis_id ON interview_insights(hypothesis_id);

----------------------------------------------------------------------
-- Phase 7: Updated_at trigger
----------------------------------------------------------------------

CREATE TRIGGER trigger_interview_questions_updated_at
  BEFORE UPDATE ON interview_questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
