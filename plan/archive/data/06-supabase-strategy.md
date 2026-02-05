# Supabase Strategy - StartupAI

> **Generated:** 2026-02-02 | **Source:** System Analysis | **Status:** Recommended Changes

---

## Executive Summary

Analysis of `startup-system/` documentation vs current Supabase implementation:

| Category | Current | MVP Required | Full Vision | Notes |
|----------|---------|--------------|-------------|-------|
| Tables | 60+ | 60+ ✅ | 82 | MVP complete; advanced tables for Phase 2-4 |
| Edge Functions | 18 | 18 ✅ | 32 | MVP complete; add agents with features |
| RLS Policies | 100% | 100% | 100% | ✓ All tables secured |
| Triggers | 5 | 5 ✅ | 12 | Add triggers with new tables |
| Helper Functions | 5 | 5 ✅ | 9 | Add helpers as needed |

**Status: MVP Complete** — Additional tables/functions should be built incrementally with features.

### Phased Approach (Recommended)

| Phase | Tables to Add | Edge Functions to Add |
|-------|---------------|----------------------|
| **Phase 1 (MVP)** | ✅ Complete (60+) | ✅ Complete (18) |
| **Phase 2 (Validation)** | experiments, assumptions | validation-agent |
| **Phase 3 (Customer)** | customer_canvases, customer_interviews | customer-agent |
| **Phase 4 (Growth)** | traction_metrics, pmf_assessments | pmf-agent, metrics-agent |

---

## Part 1: Missing Tables

### 1.1 Validation Lab Tables (Priority: HIGH)

```sql
-- experiments: Track validation experiments
CREATE TABLE experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  canvas_id uuid REFERENCES lean_canvases(id),
  experiment_type text NOT NULL CHECK (experiment_type IN (
    'landing_page', 'smoke_test', 'concierge', 'wizard_of_oz',
    'fake_door', 'split_test', 'survey', 'interview'
  )),
  hypothesis text NOT NULL,
  box_key text, -- Which canvas box this tests
  metric_name text NOT NULL,
  baseline_value numeric,
  target_value numeric NOT NULL,
  actual_value numeric,
  sample_size integer,
  confidence_level numeric,
  status text DEFAULT 'planned' CHECK (status IN (
    'planned', 'running', 'completed', 'invalidated'
  )),
  verdict text CHECK (verdict IN ('validated', 'invalidated', 'inconclusive')),
  learnings text,
  next_action text,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- experiment_results: Granular experiment data points
CREATE TABLE experiment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  data_point jsonb NOT NULL,
  recorded_at timestamptz DEFAULT now()
);
```

### 1.2 Customer Canvas Tables (Priority: HIGH)

```sql
-- customer_canvases: JTBD + Forces analysis
CREATE TABLE customer_canvases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  segment_name text NOT NULL,
  -- Jobs to be Done
  functional_jobs jsonb DEFAULT '[]',
  emotional_jobs jsonb DEFAULT '[]',
  social_jobs jsonb DEFAULT '[]',
  -- Forces Analysis
  push_forces jsonb DEFAULT '[]', -- Pain with current solution
  pull_forces jsonb DEFAULT '[]', -- Attraction to new solution
  anxiety_forces jsonb DEFAULT '[]', -- Fear of switching
  habit_forces jsonb DEFAULT '[]', -- Comfort with status quo
  -- Insights
  switch_trigger text,
  key_insight text,
  ai_analysis text,
  version integer DEFAULT 1,
  is_current boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- customer_interviews: Interview tracking
CREATE TABLE customer_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  canvas_id uuid REFERENCES customer_canvases(id),
  contact_id uuid REFERENCES contacts(id),
  interview_type text DEFAULT 'discovery' CHECK (interview_type IN (
    'discovery', 'problem', 'solution', 'usability'
  )),
  scheduled_at timestamptz,
  completed_at timestamptz,
  duration_minutes integer,
  recording_url text,
  transcript text,
  notes text,
  key_quotes jsonb DEFAULT '[]',
  insights jsonb DEFAULT '[]',
  ai_summary text,
  status text DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'completed', 'cancelled', 'no_show'
  )),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
```

### 1.3 MVP Canvas Tables (Priority: HIGH)

```sql
-- mvp_canvases: Paulo Caroli 7-block MVP Canvas
CREATE TABLE mvp_canvases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  lean_canvas_id uuid REFERENCES lean_canvases(id),
  -- 7 Blocks
  vision jsonb DEFAULT '{}', -- Product vision statement
  personas jsonb DEFAULT '[]', -- Target user personas
  journeys jsonb DEFAULT '[]', -- User journey maps
  features jsonb DEFAULT '[]', -- Feature brainstorm
  feature_sequencer jsonb DEFAULT '[]', -- Prioritized features
  mvp_canvas jsonb DEFAULT '{}', -- Final MVP scope
  cost_schedule jsonb DEFAULT '{}', -- Timeline and cost
  -- Metadata
  version integer DEFAULT 1,
  is_current boolean DEFAULT true,
  ai_suggestions text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- mvp_features: Feature tracking with RICE scoring
CREATE TABLE mvp_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mvp_canvas_id uuid NOT NULL REFERENCES mvp_canvases(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  user_value text, -- What user gains
  business_value text, -- What business gains
  -- RICE Scoring
  reach_score integer CHECK (reach_score BETWEEN 1 AND 10),
  impact_score integer CHECK (impact_score BETWEEN 1 AND 10),
  confidence_score integer CHECK (confidence_score BETWEEN 1 AND 10),
  effort_score integer CHECK (effort_score BETWEEN 1 AND 10),
  rice_score numeric GENERATED ALWAYS AS (
    (reach_score * impact_score * confidence_score) / NULLIF(effort_score, 0)
  ) STORED,
  -- Status
  priority_rank integer,
  included_in_mvp boolean DEFAULT false,
  status text DEFAULT 'proposed' CHECK (status IN (
    'proposed', 'approved', 'building', 'shipped', 'cut'
  )),
  shipped_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

### 1.4 Traction & Metrics Tables (Priority: HIGH)

```sql
-- traction_metrics: Daily metric tracking
CREATE TABLE traction_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  metric_date date NOT NULL,
  -- AARRR Metrics
  visitors integer DEFAULT 0,
  signups integer DEFAULT 0,
  activations integer DEFAULT 0,
  active_users integer DEFAULT 0,
  paying_users integer DEFAULT 0,
  churned_users integer DEFAULT 0,
  referrals integer DEFAULT 0,
  -- Revenue
  mrr numeric DEFAULT 0,
  arr numeric DEFAULT 0,
  revenue numeric DEFAULT 0,
  -- Costs
  cac numeric,
  ltv numeric,
  burn_rate numeric,
  runway_months numeric,
  -- Custom
  custom_metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(startup_id, metric_date)
);

-- traction_milestones: Key milestone tracking
CREATE TABLE traction_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  milestone_type text NOT NULL CHECK (milestone_type IN (
    'users', 'revenue', 'funding', 'product', 'team', 'press', 'other'
  )),
  title text NOT NULL,
  description text,
  target_value numeric,
  actual_value numeric,
  target_date date,
  achieved_date date,
  status text DEFAULT 'pending' CHECK (status IN (
    'pending', 'achieved', 'missed', 'cancelled'
  )),
  evidence_url text,
  created_at timestamptz DEFAULT now()
);

-- customer_factory_metrics: AARRR pipeline tracking
CREATE TABLE customer_factory_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  -- Funnel stages
  awareness_count integer DEFAULT 0,
  acquisition_count integer DEFAULT 0,
  activation_count integer DEFAULT 0,
  retention_count integer DEFAULT 0,
  revenue_count integer DEFAULT 0,
  referral_count integer DEFAULT 0,
  -- Conversion rates
  awareness_to_acquisition numeric,
  acquisition_to_activation numeric,
  activation_to_retention numeric,
  retention_to_revenue numeric,
  revenue_to_referral numeric,
  -- Analysis
  bottleneck_stage text,
  ai_recommendations jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
```

### 1.5 PMF Assessment Tables (Priority: HIGH)

```sql
-- pmf_assessments: Product-Market Fit tracking
CREATE TABLE pmf_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  assessment_date date NOT NULL,
  -- Sean Ellis Survey
  very_disappointed_pct numeric, -- Target: 40%+
  somewhat_disappointed_pct numeric,
  not_disappointed_pct numeric,
  sample_size integer,
  -- Qualitative signals
  organic_growth boolean DEFAULT false,
  word_of_mouth boolean DEFAULT false,
  retention_improving boolean DEFAULT false,
  expansion_revenue boolean DEFAULT false,
  -- Score
  pmf_score integer CHECK (pmf_score BETWEEN 0 AND 100),
  pmf_status text CHECK (pmf_status IN (
    'no_fit', 'weak_fit', 'moderate_fit', 'strong_fit'
  )),
  ai_analysis text,
  recommendations jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- pmf_survey_responses: Individual survey responses
CREATE TABLE pmf_survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES pmf_assessments(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id),
  disappointment_level text NOT NULL CHECK (disappointment_level IN (
    'very_disappointed', 'somewhat_disappointed', 'not_disappointed'
  )),
  main_benefit text,
  improvement_suggestion text,
  alternative_solution text,
  submitted_at timestamptz DEFAULT now()
);
```

### 1.6 Stage & Gate Tables (Priority: MEDIUM)

```sql
-- stage_assessments: 10-stage progression tracking
CREATE TABLE stage_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  assessed_at timestamptz DEFAULT now(),
  -- Stage scores (0-100)
  ideation_score integer DEFAULT 0,
  validation_score integer DEFAULT 0,
  customer_discovery_score integer DEFAULT 0,
  solution_design_score integer DEFAULT 0,
  mvp_development_score integer DEFAULT 0,
  early_traction_score integer DEFAULT 0,
  pmf_score integer DEFAULT 0,
  growth_score integer DEFAULT 0,
  scaling_score integer DEFAULT 0,
  maturity_score integer DEFAULT 0,
  -- Current stage
  current_stage text NOT NULL CHECK (current_stage IN (
    'ideation', 'validation', 'customer_discovery', 'solution_design',
    'mvp_development', 'early_traction', 'pmf', 'growth', 'scaling', 'maturity'
  )),
  stage_confidence integer CHECK (stage_confidence BETWEEN 0 AND 100),
  -- Gate status
  gate_status text DEFAULT 'not_started' CHECK (gate_status IN (
    'not_started', 'in_progress', 'blocked', 'passed'
  )),
  gate_blockers jsonb DEFAULT '[]',
  ai_analysis text,
  next_actions jsonb DEFAULT '[]',
  created_by uuid REFERENCES auth.users(id)
);

-- gate_checks: Individual gate criteria checks
CREATE TABLE gate_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES stage_assessments(id) ON DELETE CASCADE,
  stage text NOT NULL,
  criterion_name text NOT NULL,
  criterion_description text,
  is_met boolean DEFAULT false,
  evidence text,
  checked_at timestamptz DEFAULT now()
);
```

### 1.7 Decision & Learning Tables (Priority: MEDIUM)

```sql
-- decisions: Track pivot/persevere decisions
CREATE TABLE decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  experiment_id uuid REFERENCES experiments(id),
  decision_type text NOT NULL CHECK (decision_type IN (
    'pivot', 'persevere', 'zoom_in', 'zoom_out', 'customer_pivot',
    'channel_pivot', 'technology_pivot', 'business_model_pivot', 'kill'
  )),
  context text NOT NULL, -- What prompted this decision
  decision text NOT NULL, -- What was decided
  rationale text NOT NULL, -- Why
  affected_canvas_boxes text[], -- Which canvas boxes change
  before_state jsonb, -- State before decision
  after_state jsonb, -- State after decision
  outcome text, -- How it turned out
  outcome_recorded_at timestamptz,
  decided_by uuid REFERENCES auth.users(id),
  decided_at timestamptz DEFAULT now()
);

-- assumptions: Track and test assumptions
CREATE TABLE assumptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  canvas_id uuid REFERENCES lean_canvases(id),
  box_key text, -- Which canvas box
  assumption_text text NOT NULL,
  risk_level text DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  confidence_level integer CHECK (confidence_level BETWEEN 0 AND 100),
  validation_status text DEFAULT 'untested' CHECK (validation_status IN (
    'untested', 'testing', 'validated', 'invalidated'
  )),
  experiment_id uuid REFERENCES experiments(id),
  evidence text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 1.8 Playbook Enhancement Tables (Priority: MEDIUM)

```sql
-- playbook_questions: Diagnostic questions per stage
CREATE TABLE playbook_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid NOT NULL REFERENCES industry_playbooks(id) ON DELETE CASCADE,
  stage text NOT NULL,
  question_text text NOT NULL,
  question_type text DEFAULT 'scale' CHECK (question_type IN (
    'scale', 'yes_no', 'multiple_choice', 'text'
  )),
  options jsonb, -- For multiple choice
  weight numeric DEFAULT 1.0, -- Importance weight
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- playbook_responses: User responses to diagnostic questions
CREATE TABLE playbook_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES playbook_questions(id) ON DELETE CASCADE,
  response_value text NOT NULL,
  response_score numeric, -- Normalized score
  responded_at timestamptz DEFAULT now(),
  UNIQUE(startup_id, question_id)
);

-- playbook_benchmarks: Industry benchmarks per stage
CREATE TABLE playbook_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid NOT NULL REFERENCES industry_playbooks(id) ON DELETE CASCADE,
  stage text NOT NULL,
  metric_name text NOT NULL,
  percentile_25 numeric,
  percentile_50 numeric,
  percentile_75 numeric,
  percentile_90 numeric,
  unit text,
  description text,
  created_at timestamptz DEFAULT now()
);
```

### 1.9 Sprint & Task Enhancement Tables (Priority: LOW)

```sql
-- lean_sprints: Validation sprints
CREATE TABLE lean_sprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  sprint_number integer NOT NULL,
  goal text NOT NULL,
  hypothesis text,
  success_criteria text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'planned' CHECK (status IN (
    'planned', 'active', 'completed', 'cancelled'
  )),
  retrospective text,
  learnings jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- lean_sprint_tasks: Tasks within sprints
CREATE TABLE lean_sprint_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id uuid NOT NULL REFERENCES lean_sprints(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  order_index integer,
  UNIQUE(sprint_id, task_id)
);
```

---

## Part 2: Schema Modifications

### 2.1 Modify startups Table

```sql
-- Add missing columns to startups
ALTER TABLE startups ADD COLUMN IF NOT EXISTS
  current_stage text DEFAULT 'ideation' CHECK (current_stage IN (
    'ideation', 'validation', 'customer_discovery', 'solution_design',
    'mvp_development', 'early_traction', 'pmf', 'growth', 'scaling', 'maturity'
  ));

ALTER TABLE startups ADD COLUMN IF NOT EXISTS
  stage_entered_at timestamptz DEFAULT now();

ALTER TABLE startups ADD COLUMN IF NOT EXISTS
  pmf_score integer CHECK (pmf_score BETWEEN 0 AND 100);

ALTER TABLE startups ADD COLUMN IF NOT EXISTS
  north_star_metric text;

ALTER TABLE startups ADD COLUMN IF NOT EXISTS
  north_star_value numeric;
```

### 2.2 Modify lean_canvases Table

```sql
-- Add validation tracking to lean_canvases
ALTER TABLE lean_canvases ADD COLUMN IF NOT EXISTS
  validation_status jsonb DEFAULT '{}';
  -- Format: {"problem": "validated", "solution": "testing", ...}

ALTER TABLE lean_canvases ADD COLUMN IF NOT EXISTS
  risk_scores jsonb DEFAULT '{}';
  -- Format: {"problem": 85, "solution": 60, ...}

ALTER TABLE lean_canvases ADD COLUMN IF NOT EXISTS
  last_synced_from_profile_at timestamptz;
```

### 2.3 Modify tasks Table

```sql
-- Add lean methodology fields to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS
  experiment_id uuid REFERENCES experiments(id);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS
  sprint_id uuid REFERENCES lean_sprints(id);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS
  canvas_box text; -- Which canvas box this task relates to

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS
  learning_outcome text; -- What was learned from completing this task
```

---

## Part 3: New Indexes

### 3.1 Performance Indexes

```sql
-- Experiments
CREATE INDEX idx_experiments_startup_status ON experiments(startup_id, status);
CREATE INDEX idx_experiments_canvas ON experiments(canvas_id);
CREATE INDEX idx_experiments_type ON experiments(experiment_type);

-- Traction Metrics
CREATE INDEX idx_traction_metrics_startup_date ON traction_metrics(startup_id, metric_date DESC);
CREATE INDEX idx_traction_milestones_startup ON traction_milestones(startup_id, status);

-- Customer Canvas
CREATE INDEX idx_customer_canvases_startup ON customer_canvases(startup_id, is_current);
CREATE INDEX idx_customer_interviews_startup ON customer_interviews(startup_id, status);

-- PMF
CREATE INDEX idx_pmf_assessments_startup ON pmf_assessments(startup_id, assessment_date DESC);

-- Stage Assessments
CREATE INDEX idx_stage_assessments_startup ON stage_assessments(startup_id, assessed_at DESC);
CREATE INDEX idx_stage_assessments_stage ON stage_assessments(current_stage);

-- Decisions
CREATE INDEX idx_decisions_startup ON decisions(startup_id, decided_at DESC);
CREATE INDEX idx_decisions_type ON decisions(decision_type);

-- Assumptions
CREATE INDEX idx_assumptions_startup_status ON assumptions(startup_id, validation_status);
CREATE INDEX idx_assumptions_canvas ON assumptions(canvas_id);

-- MVP
CREATE INDEX idx_mvp_canvases_startup ON mvp_canvases(startup_id, is_current);
CREATE INDEX idx_mvp_features_canvas ON mvp_features(mvp_canvas_id, rice_score DESC);

-- Sprints
CREATE INDEX idx_lean_sprints_startup ON lean_sprints(startup_id, status);
```

### 3.2 Composite Indexes for Common Queries

```sql
-- Dashboard queries
CREATE INDEX idx_startups_org_stage ON startups(org_id, current_stage);
CREATE INDEX idx_tasks_startup_status_priority ON tasks(startup_id, status, priority);

-- Timeline queries
CREATE INDEX idx_activities_startup_created ON activities(startup_id, created_at DESC);
CREATE INDEX idx_decisions_startup_created ON decisions(startup_id, decided_at DESC);
```

---

## Part 4: RLS Policies for New Tables

### 4.1 Standard Startup-Based Policies

```sql
-- Template for all startup-owned tables
-- Apply to: experiments, customer_canvases, customer_interviews, mvp_canvases,
--           mvp_features, traction_metrics, traction_milestones, customer_factory_metrics,
--           pmf_assessments, pmf_survey_responses, stage_assessments, gate_checks,
--           decisions, assumptions, lean_sprints, lean_sprint_tasks

-- Example for experiments (repeat pattern for others):
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view experiments in org"
  ON experiments FOR SELECT
  USING (startup_in_org(startup_id));

CREATE POLICY "Users create experiments in org"
  ON experiments FOR INSERT
  WITH CHECK (startup_in_org(startup_id));

CREATE POLICY "Users update experiments in org"
  ON experiments FOR UPDATE
  USING (startup_in_org(startup_id));

CREATE POLICY "Users delete experiments in org"
  ON experiments FOR DELETE
  USING (startup_in_org(startup_id));
```

### 4.2 Playbook Public Read Policies

```sql
-- playbook_questions (public read)
ALTER TABLE playbook_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view playbook questions"
  ON playbook_questions FOR SELECT
  USING (
    playbook_id IN (SELECT id FROM industry_playbooks WHERE is_active = true)
  );

-- playbook_benchmarks (public read)
ALTER TABLE playbook_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view playbook benchmarks"
  ON playbook_benchmarks FOR SELECT
  USING (
    playbook_id IN (SELECT id FROM industry_playbooks WHERE is_active = true)
  );

-- playbook_responses (startup-based)
ALTER TABLE playbook_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage playbook responses in org"
  ON playbook_responses FOR ALL
  USING (startup_in_org(startup_id));
```

---

## Part 5: New Triggers

### 5.1 Stage Progression Triggers

```sql
-- Trigger: Auto-update startup stage when assessment passes gate
CREATE OR REPLACE FUNCTION update_startup_stage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.gate_status = 'passed' AND OLD.gate_status != 'passed' THEN
    UPDATE startups
    SET current_stage = NEW.current_stage,
        stage_entered_at = now(),
        updated_at = now()
    WHERE id = NEW.startup_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_startup_stage
  AFTER UPDATE ON stage_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_startup_stage();
```

### 5.2 Experiment Completion Triggers

```sql
-- Trigger: Log activity when experiment completes
CREATE OR REPLACE FUNCTION log_experiment_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO activities (
      startup_id, activity_type, title, description,
      metadata, is_system_generated
    ) VALUES (
      NEW.startup_id,
      'experiment_completed',
      'Experiment completed: ' || NEW.experiment_type,
      'Verdict: ' || COALESCE(NEW.verdict, 'pending'),
      jsonb_build_object(
        'experiment_id', NEW.id,
        'hypothesis', NEW.hypothesis,
        'verdict', NEW.verdict,
        'learnings', NEW.learnings
      ),
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_log_experiment_completion
  AFTER UPDATE ON experiments
  FOR EACH ROW
  EXECUTE FUNCTION log_experiment_completion();
```

### 5.3 PMF Score Update Trigger

```sql
-- Trigger: Update startup PMF score when assessment created
CREATE OR REPLACE FUNCTION update_startup_pmf()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE startups
  SET pmf_score = NEW.pmf_score,
      updated_at = now()
  WHERE id = NEW.startup_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_startup_pmf
  AFTER INSERT ON pmf_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_startup_pmf();
```

### 5.4 Traction Metrics Aggregation Trigger

```sql
-- Trigger: Update startup traction fields from latest metrics
CREATE OR REPLACE FUNCTION update_startup_traction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE startups
  SET monthly_revenue = NEW.mrr,
      user_count = NEW.active_users,
      updated_at = now()
  WHERE id = NEW.startup_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_startup_traction
  AFTER INSERT ON traction_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_startup_traction();
```

### 5.5 Canvas Validation Sync Trigger

```sql
-- Trigger: Update canvas validation status when experiment completes
CREATE OR REPLACE FUNCTION sync_canvas_validation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verdict IS NOT NULL AND NEW.canvas_id IS NOT NULL AND NEW.box_key IS NOT NULL THEN
    UPDATE lean_canvases
    SET validation_status = validation_status ||
        jsonb_build_object(NEW.box_key, NEW.verdict),
        updated_at = now()
    WHERE id = NEW.canvas_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sync_canvas_validation
  AFTER UPDATE ON experiments
  FOR EACH ROW
  WHEN (NEW.verdict IS DISTINCT FROM OLD.verdict)
  EXECUTE FUNCTION sync_canvas_validation();
```

---

## Part 6: New Helper Functions

### 6.1 Stage Calculation Functions

```sql
-- Calculate overall stage from scores
CREATE OR REPLACE FUNCTION calculate_current_stage(
  p_startup_id uuid
) RETURNS text AS $$
DECLARE
  v_scores jsonb;
  v_stage text;
BEGIN
  SELECT jsonb_build_object(
    'ideation', ideation_score,
    'validation', validation_score,
    'customer_discovery', customer_discovery_score,
    'solution_design', solution_design_score,
    'mvp_development', mvp_development_score,
    'early_traction', early_traction_score,
    'pmf', pmf_score,
    'growth', growth_score,
    'scaling', scaling_score,
    'maturity', maturity_score
  ) INTO v_scores
  FROM stage_assessments
  WHERE startup_id = p_startup_id
  ORDER BY assessed_at DESC
  LIMIT 1;

  -- Find highest stage with score >= 70
  v_stage := CASE
    WHEN (v_scores->>'maturity')::int >= 70 THEN 'maturity'
    WHEN (v_scores->>'scaling')::int >= 70 THEN 'scaling'
    WHEN (v_scores->>'growth')::int >= 70 THEN 'growth'
    WHEN (v_scores->>'pmf')::int >= 70 THEN 'pmf'
    WHEN (v_scores->>'early_traction')::int >= 70 THEN 'early_traction'
    WHEN (v_scores->>'mvp_development')::int >= 70 THEN 'mvp_development'
    WHEN (v_scores->>'solution_design')::int >= 70 THEN 'solution_design'
    WHEN (v_scores->>'customer_discovery')::int >= 70 THEN 'customer_discovery'
    WHEN (v_scores->>'validation')::int >= 70 THEN 'validation'
    ELSE 'ideation'
  END;

  RETURN v_stage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.2 PMF Calculation Function

```sql
-- Calculate PMF score from survey responses
CREATE OR REPLACE FUNCTION calculate_pmf_score(
  p_assessment_id uuid
) RETURNS integer AS $$
DECLARE
  v_total integer;
  v_very_disappointed integer;
  v_score integer;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE disappointment_level = 'very_disappointed')
  INTO v_total, v_very_disappointed
  FROM pmf_survey_responses
  WHERE assessment_id = p_assessment_id;

  IF v_total = 0 THEN
    RETURN 0;
  END IF;

  -- Score based on 40% threshold
  v_score := ROUND((v_very_disappointed::numeric / v_total) * 100);

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.3 RICE Score Function

```sql
-- Calculate RICE score for feature prioritization
CREATE OR REPLACE FUNCTION calculate_rice_score(
  p_reach integer,
  p_impact integer,
  p_confidence integer,
  p_effort integer
) RETURNS numeric AS $$
BEGIN
  IF p_effort = 0 OR p_effort IS NULL THEN
    RETURN 0;
  END IF;
  RETURN ROUND((p_reach * p_impact * p_confidence)::numeric / p_effort, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### 6.4 Experiment Status Check Function

```sql
-- Check if startup has active experiments for a canvas box
CREATE OR REPLACE FUNCTION has_active_experiment(
  p_startup_id uuid,
  p_box_key text
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM experiments
    WHERE startup_id = p_startup_id
      AND box_key = p_box_key
      AND status IN ('planned', 'running')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Part 7: Edge Function Strategy

### 7.1 New Edge Functions Required

| Function | Priority | Purpose |
|----------|----------|---------|
| validation-agent | HIGH | Run experiments, analyze results, suggest next experiments |
| customer-agent | HIGH | Customer canvas, interview scheduling, JTBD analysis |
| pmf-agent | HIGH | PMF surveys, score calculation, recommendations |
| stage-agent | HIGH | Stage assessment, gate checks, progression recommendations |
| mvp-agent | MEDIUM | MVP Canvas, feature prioritization, RICE scoring |
| metrics-agent | MEDIUM | Traction metrics ingestion, analysis, forecasting |
| sprint-agent | MEDIUM | Sprint planning, retrospectives, velocity tracking |
| decision-agent | LOW | Document decisions, analyze patterns, suggest pivots |

### 7.2 Validation Agent (validation-agent)

```typescript
interface ValidationRequest {
  action:
    | 'create_experiment'
    | 'record_result'
    | 'analyze_experiment'
    | 'suggest_experiments'
    | 'get_validation_status'
    | 'recommend_next';
  startup_id: string;
  experiment_id?: string;
  canvas_id?: string;
  box_key?: string;
  experiment_type?: ExperimentType;
  hypothesis?: string;
  result_data?: Record<string, unknown>;
}

interface ValidationResponse {
  success: boolean;
  experiment?: Experiment;
  analysis?: {
    verdict: 'validated' | 'invalidated' | 'inconclusive';
    confidence: number;
    learnings: string[];
    next_steps: string[];
  };
  suggestions?: Array<{
    box_key: string;
    experiment_type: string;
    hypothesis: string;
    priority: 'high' | 'medium' | 'low';
    rationale: string;
  }>;
  validation_status?: Record<string, string>;
}
```

### 7.3 Customer Agent (customer-agent)

```typescript
interface CustomerRequest {
  action:
    | 'create_canvas'
    | 'analyze_forces'
    | 'schedule_interview'
    | 'analyze_interview'
    | 'extract_insights'
    | 'suggest_segments';
  startup_id: string;
  canvas_id?: string;
  interview_id?: string;
  transcript?: string;
  segment_name?: string;
}

interface CustomerResponse {
  success: boolean;
  canvas?: CustomerCanvas;
  forces_analysis?: {
    push_strength: number;
    pull_strength: number;
    anxiety_level: number;
    habit_strength: number;
    switch_likelihood: number;
    recommendations: string[];
  };
  interview_insights?: {
    key_quotes: string[];
    jobs_discovered: string[];
    pain_points: string[];
    suggestions: string[];
  };
}
```

### 7.4 Stage Agent (stage-agent)

```typescript
interface StageRequest {
  action:
    | 'assess_stage'
    | 'check_gate'
    | 'get_blockers'
    | 'recommend_actions'
    | 'compare_benchmarks';
  startup_id: string;
  target_stage?: string;
}

interface StageResponse {
  success: boolean;
  assessment?: {
    current_stage: string;
    stage_scores: Record<string, number>;
    confidence: number;
    time_in_stage: string;
  };
  gate_status?: {
    criteria: Array<{
      name: string;
      is_met: boolean;
      evidence?: string;
      how_to_meet?: string;
    }>;
    ready_to_advance: boolean;
    blockers: string[];
  };
  recommendations?: Array<{
    action: string;
    rationale: string;
    priority: string;
    estimated_impact: string;
  }>;
}
```

### 7.5 PMF Agent (pmf-agent)

```typescript
interface PMFRequest {
  action:
    | 'create_survey'
    | 'record_response'
    | 'calculate_score'
    | 'analyze_pmf'
    | 'get_recommendations';
  startup_id: string;
  assessment_id?: string;
  response?: PMFSurveyResponse;
}

interface PMFResponse {
  success: boolean;
  survey_link?: string;
  score?: {
    pmf_score: number;
    status: 'no_fit' | 'weak_fit' | 'moderate_fit' | 'strong_fit';
    very_disappointed_pct: number;
    sample_size: number;
    confidence: number;
  };
  analysis?: {
    strengths: string[];
    weaknesses: string[];
    segments_with_fit: string[];
    improvement_areas: string[];
  };
  recommendations?: string[];
}
```

### 7.6 Modify Existing Edge Functions

#### lean-canvas-agent Updates

Add new actions:
- `get_validation_status` - Check which boxes are validated
- `link_experiment` - Link experiment to canvas box
- `get_risk_assessment` - AI risk analysis per box
- `sync_from_profile` - Re-sync from startup profile

#### task-agent Updates

Add new actions:
- `generate_sprint_tasks` - Generate tasks for a validation sprint
- `link_to_experiment` - Link task to experiment
- `get_learning_tasks` - Get tasks focused on learning vs doing

#### ai-chat Updates

Add new context injections:
- Current stage and gate status
- Active experiments and their status
- PMF score and trend
- Validation status per canvas box

---

## Part 8: Migration Strategy

### 8.1 Phase 1: Core Tables (Week 1)

1. Create experiments table + RLS
2. Create customer_canvases table + RLS
3. Create traction_metrics table + RLS
4. Create pmf_assessments table + RLS
5. Deploy validation-agent edge function

### 8.2 Phase 2: Stage System (Week 2)

1. Create stage_assessments table + RLS
2. Create gate_checks table + RLS
3. Add current_stage to startups
4. Deploy stage-agent edge function
5. Add stage progression triggers

### 8.3 Phase 3: MVP & Planning (Week 3)

1. Create mvp_canvases table + RLS
2. Create mvp_features table + RLS
3. Create lean_sprints table + RLS
4. Deploy mvp-agent edge function
5. Update task-agent for sprint support

### 8.4 Phase 4: Analytics & Decisions (Week 4)

1. Create customer_factory_metrics table + RLS
2. Create decisions table + RLS
3. Create assumptions table + RLS
4. Deploy metrics-agent edge function
5. Add analytics triggers

---

## Part 9: Current vs Required Comparison

### Tables Comparison

| Category | Current Tables | Required Tables | Status |
|----------|---------------|-----------------|--------|
| Core | organizations, profiles, startups | ✓ | Complete |
| Lean Canvas | lean_canvases | + validation_status column | Modify |
| Validation | — | experiments, experiment_results | **Missing** |
| Customer | contacts | + customer_canvases, customer_interviews | **Missing** |
| MVP | — | mvp_canvases, mvp_features | **Missing** |
| Traction | — | traction_metrics, traction_milestones | **Missing** |
| PMF | — | pmf_assessments, pmf_survey_responses | **Missing** |
| Stages | — | stage_assessments, gate_checks | **Missing** |
| Decisions | — | decisions, assumptions | **Missing** |
| Sprints | — | lean_sprints, lean_sprint_tasks | **Missing** |
| Playbooks | industry_playbooks | + playbook_questions, benchmarks | Partial |

### Edge Functions Comparison

| Category | Current | Required | Status |
|----------|---------|----------|--------|
| Chat | ai-chat | ✓ | Complete |
| Lean Canvas | lean-canvas-agent | + new actions | Modify |
| Investors | investor-agent | ✓ | Complete |
| CRM | crm-agent | ✓ | Complete |
| Tasks | task-agent | + sprint actions | Modify |
| Validation | — | validation-agent | **Missing** |
| Customer | — | customer-agent | **Missing** |
| PMF | — | pmf-agent | **Missing** |
| Stage | — | stage-agent | **Missing** |
| MVP | — | mvp-agent | **Missing** |
| Metrics | — | metrics-agent | **Missing** |

---

## Part 10: Priority Action Items

### Immediate (This Week)

1. **Create experiments table** - Foundation for Validation Lab
2. **Create traction_metrics table** - Essential for stage assessment
3. **Add current_stage to startups** - Enable stage tracking
4. **Deploy validation-agent** - Core validation workflow

### Short-term (Next 2 Weeks)

1. Create customer_canvases and customer_interviews tables
2. Create stage_assessments and gate_checks tables
3. Deploy stage-agent and customer-agent
4. Update lean-canvas-agent with validation linking

### Medium-term (Month 2)

1. Create MVP Canvas tables
2. Create PMF assessment tables
3. Create lean_sprints tables
4. Deploy remaining agents (pmf-agent, mvp-agent, sprint-agent)

### Long-term (Month 3+)

1. Create customer_factory_metrics
2. Create decisions and assumptions tables
3. Add playbook enhancement tables
4. Full analytics integration

---

*Generated by Claude Code — 2026-02-02*
