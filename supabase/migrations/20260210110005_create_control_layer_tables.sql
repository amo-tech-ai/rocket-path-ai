-- ============================================================
-- Week 5: Control Layer Tables (011-CTL + 012-CTL)
-- decisions, decision_evidence, shareable_links, ai_usage_limits
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. DECISIONS (011-CTL)
-- ─────────────────────────────────────────────
CREATE TABLE decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  decision_type text NOT NULL CHECK (decision_type IN ('pivot', 'persevere', 'launch', 'kill', 'invest', 'partner', 'hire', 'other')),
  title text NOT NULL,
  reasoning text,
  outcome text,
  outcome_at timestamptz,
  decided_by uuid REFERENCES auth.users(id),
  decided_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'reversed', 'superseded')),
  ai_suggested boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decisions_select" ON decisions FOR SELECT TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "decisions_insert" ON decisions FOR INSERT TO authenticated
  WITH CHECK (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "decisions_update" ON decisions FOR UPDATE TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "decisions_delete" ON decisions FOR DELETE TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "decisions_service" ON decisions FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_decisions_startup_id ON decisions(startup_id);
CREATE INDEX idx_decisions_decided_at ON decisions(decided_at DESC);
CREATE INDEX idx_decisions_decided_by ON decisions(decided_by);

CREATE TRIGGER set_decisions_updated_at
  BEFORE UPDATE ON decisions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─────────────────────────────────────────────
-- 2. DECISION EVIDENCE (011-CTL)
-- ─────────────────────────────────────────────
CREATE TABLE decision_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (evidence_type IN ('assumption', 'experiment', 'interview', 'metric', 'research', 'other')),
  evidence_id uuid,
  evidence_table text,
  summary text NOT NULL,
  supports_decision boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE decision_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evidence_select" ON decision_evidence FOR SELECT TO authenticated
  USING (decision_id IN (SELECT id FROM decisions WHERE startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid())));
CREATE POLICY "evidence_insert" ON decision_evidence FOR INSERT TO authenticated
  WITH CHECK (decision_id IN (SELECT id FROM decisions WHERE startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid())));
CREATE POLICY "evidence_update" ON decision_evidence FOR UPDATE TO authenticated
  USING (decision_id IN (SELECT id FROM decisions WHERE startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid())));
CREATE POLICY "evidence_delete" ON decision_evidence FOR DELETE TO authenticated
  USING (decision_id IN (SELECT id FROM decisions WHERE startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid())));
CREATE POLICY "evidence_service" ON decision_evidence FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_decision_evidence_decision_id ON decision_evidence(decision_id);

-- ─────────────────────────────────────────────
-- 3. SHAREABLE LINKS (012-CTL)
-- ─────────────────────────────────────────────
CREATE TABLE shareable_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  resource_type text NOT NULL CHECK (resource_type IN ('validation_report', 'pitch_deck', 'lean_canvas', 'decision_log')),
  resource_id uuid NOT NULL,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  revoked_at timestamptz,
  access_count integer DEFAULT 0,
  last_accessed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shareable_links ENABLE ROW LEVEL SECURITY;

-- Org members can manage their links
CREATE POLICY "links_select_org" ON shareable_links FOR SELECT TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "links_insert_org" ON shareable_links FOR INSERT TO authenticated
  WITH CHECK (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "links_update_org" ON shareable_links FOR UPDATE TO authenticated
  USING (startup_id IN (SELECT s.id FROM startups s JOIN org_members om ON om.org_id = s.org_id WHERE om.user_id = auth.uid()));
CREATE POLICY "links_service" ON shareable_links FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Public read via token — anon can read ONLY by passing x-share-token header
-- PostgREST lowercases header names; COALESCE handles edge cases
CREATE POLICY "links_public_read" ON shareable_links FOR SELECT TO anon
  USING (
    revoked_at IS NULL
    AND expires_at > now()
    AND token = COALESCE(
      (current_setting('request.headers', true)::json->>'x-share-token'),
      (current_setting('request.headers', true)::json->>'X-Share-Token')
    )
  );

CREATE INDEX idx_shareable_links_token ON shareable_links(token);
CREATE INDEX idx_shareable_links_resource ON shareable_links(resource_type, resource_id);
CREATE INDEX idx_shareable_links_startup_id ON shareable_links(startup_id);
CREATE INDEX idx_shareable_links_created_by ON shareable_links(created_by);

-- ─────────────────────────────────────────────
-- 4. AI USAGE LIMITS (012-CTL)
-- ─────────────────────────────────────────────
CREATE TABLE ai_usage_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  monthly_cap_cents integer NOT NULL DEFAULT 5000,
  current_month_total_cents integer DEFAULT 0,
  current_month_start date DEFAULT date_trunc('month', now())::date,
  last_reset_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_usage_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "limits_select" ON ai_usage_limits FOR SELECT TO authenticated
  USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "limits_insert" ON ai_usage_limits FOR INSERT TO authenticated
  WITH CHECK (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "limits_update" ON ai_usage_limits FOR UPDATE TO authenticated
  USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "limits_service" ON ai_usage_limits FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_ai_usage_limits_org ON ai_usage_limits(org_id);

CREATE TRIGGER set_ai_usage_limits_updated_at
  BEFORE UPDATE ON ai_usage_limits
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
