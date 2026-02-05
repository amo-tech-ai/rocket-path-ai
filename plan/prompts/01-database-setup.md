# Task 1: Database Setup for Prompt Pack System

> **Priority:** P0
> **Effort:** 4-6 hours
> **Dependencies:** None

---

## Objective

Create the database schema for storing prompt packs, steps, and run history in Supabase.

---

## Checklist

### 1.1 Create Migration File

- [ ] Create migration: `supabase/migrations/20260128_create_prompt_packs.sql`

### 1.2 Create Core Tables

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Prompt Packs (main content)
CREATE TABLE IF NOT EXISTS prompt_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN (
    'validation', 'pitch', 'gtm', 'pricing',
    'hiring', 'market', 'ideation', 'canvas'
  )),
  stage_tags text[] DEFAULT '{}',
  industry_tags text[] DEFAULT '{}',
  version int DEFAULT 1,
  is_active boolean DEFAULT true,
  source text DEFAULT 'custom',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Prompt Pack Steps
CREATE TABLE IF NOT EXISTS prompt_pack_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id uuid NOT NULL REFERENCES prompt_packs(id) ON DELETE CASCADE,
  step_order int NOT NULL,
  purpose text NOT NULL,
  prompt_template text NOT NULL,
  input_schema jsonb DEFAULT '{}',
  output_schema jsonb NOT NULL,
  model_preference text DEFAULT 'gemini' CHECK (model_preference IN ('gemini', 'claude', 'auto')),
  max_tokens int DEFAULT 2000,
  temperature float DEFAULT 0.7,
  created_at timestamptz DEFAULT now(),
  UNIQUE(pack_id, step_order)
);

-- 3. Prompt Runs (execution history)
CREATE TABLE IF NOT EXISTS prompt_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES startups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  pack_id uuid REFERENCES prompt_packs(id),
  step_id uuid REFERENCES prompt_pack_steps(id),
  inputs_json jsonb NOT NULL,
  outputs_json jsonb,
  model_used text,
  tokens_input int,
  tokens_output int,
  cost_usd numeric(10, 6),
  latency_ms int,
  status text DEFAULT 'pending' CHECK (status IN (
    'pending', 'running', 'completed', 'failed', 'cancelled'
  )),
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- 4. Startup Memory (optional, for RAG)
CREATE TABLE IF NOT EXISTS startup_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES startups(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid,
  content text NOT NULL,
  embedding extensions.vector(512),
  source text,
  created_at timestamptz DEFAULT now()
);
```

### 1.3 Create Indexes

```sql
-- Performance indexes
CREATE INDEX IF NOT EXISTS prompt_packs_category_idx ON prompt_packs(category);
CREATE INDEX IF NOT EXISTS prompt_packs_active_idx ON prompt_packs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS prompt_packs_tags_idx ON prompt_packs USING gin(stage_tags, industry_tags);
CREATE INDEX IF NOT EXISTS prompt_pack_steps_pack_idx ON prompt_pack_steps(pack_id);
CREATE INDEX IF NOT EXISTS prompt_pack_steps_order_idx ON prompt_pack_steps(pack_id, step_order);

CREATE INDEX IF NOT EXISTS prompt_runs_startup_idx ON prompt_runs(startup_id);
CREATE INDEX IF NOT EXISTS prompt_runs_user_idx ON prompt_runs(user_id);
CREATE INDEX IF NOT EXISTS prompt_runs_status_idx ON prompt_runs(status);
CREATE INDEX IF NOT EXISTS prompt_runs_created_idx ON prompt_runs(created_at DESC);

CREATE INDEX IF NOT EXISTS startup_memory_startup_idx ON startup_memory(startup_id);
CREATE INDEX IF NOT EXISTS startup_memory_type_idx ON startup_memory(entity_type);
CREATE INDEX IF NOT EXISTS startup_memory_embedding_idx ON startup_memory
  USING hnsw (embedding vector_cosine_ops);
```

### 1.4 Create RLS Policies

```sql
-- Enable RLS
ALTER TABLE prompt_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_pack_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_memory ENABLE ROW LEVEL SECURITY;

-- Prompt packs: Public read for active packs
CREATE POLICY "Anyone can read active prompt packs"
  ON prompt_packs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage prompt packs"
  ON prompt_packs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'moderator')
    )
  );

-- Steps: Public read
CREATE POLICY "Anyone can read prompt steps"
  ON prompt_pack_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prompt_packs
      WHERE id = prompt_pack_steps.pack_id
      AND is_active = true
    )
  );

-- Runs: Users can only see their own
CREATE POLICY "Users can view own prompt runs"
  ON prompt_runs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create prompt runs"
  ON prompt_runs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own prompt runs"
  ON prompt_runs FOR UPDATE
  USING (user_id = auth.uid());

-- Memory: Users can only see their startup's memory
CREATE POLICY "Users can view own startup memory"
  ON startup_memory FOR SELECT
  USING (
    startup_id IN (
      SELECT s.id FROM startups s
      JOIN profiles p ON s.organization_id = p.organization_id
      WHERE p.id = auth.uid()
    )
  );
```

### 1.5 Create Helper Functions

```sql
-- Function to get next step in a pack
CREATE OR REPLACE FUNCTION get_next_pack_step(
  p_pack_id uuid,
  p_current_step_order int DEFAULT 0
)
RETURNS TABLE (
  step_id uuid,
  step_order int,
  purpose text,
  prompt_template text,
  output_schema jsonb
)
LANGUAGE sql STABLE AS $$
  SELECT
    id as step_id,
    step_order,
    purpose,
    prompt_template,
    output_schema
  FROM prompt_pack_steps
  WHERE pack_id = p_pack_id
    AND step_order > p_current_step_order
  ORDER BY step_order
  LIMIT 1;
$$;

-- Function to search packs by criteria
CREATE OR REPLACE FUNCTION search_prompt_packs(
  p_category text DEFAULT NULL,
  p_industry text DEFAULT NULL,
  p_stage text DEFAULT NULL,
  p_limit int DEFAULT 5
)
RETURNS TABLE (
  pack_id uuid,
  title text,
  category text,
  description text,
  step_count bigint
)
LANGUAGE sql STABLE AS $$
  SELECT
    pp.id as pack_id,
    pp.title,
    pp.category,
    pp.description,
    COUNT(pps.id) as step_count
  FROM prompt_packs pp
  LEFT JOIN prompt_pack_steps pps ON pps.pack_id = pp.id
  WHERE pp.is_active = true
    AND (p_category IS NULL OR pp.category = p_category)
    AND (p_industry IS NULL OR p_industry = ANY(pp.industry_tags))
    AND (p_stage IS NULL OR p_stage = ANY(pp.stage_tags))
  GROUP BY pp.id
  ORDER BY pp.version DESC, pp.created_at DESC
  LIMIT p_limit;
$$;

-- Function to get run statistics
CREATE OR REPLACE FUNCTION get_pack_run_stats(p_pack_id uuid)
RETURNS TABLE (
  total_runs bigint,
  success_rate numeric,
  avg_latency_ms numeric,
  total_cost_usd numeric
)
LANGUAGE sql STABLE AS $$
  SELECT
    COUNT(*) as total_runs,
    ROUND(
      COUNT(*) FILTER (WHERE status = 'completed')::numeric /
      NULLIF(COUNT(*), 0) * 100, 2
    ) as success_rate,
    ROUND(AVG(latency_ms), 0) as avg_latency_ms,
    SUM(cost_usd) as total_cost_usd
  FROM prompt_runs
  WHERE pack_id = p_pack_id;
$$;
```

### 1.6 Create Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prompt_packs_updated
  BEFORE UPDATE ON prompt_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 1.7 Apply Migration

```bash
# Run migration
supabase db push

# Verify tables created
supabase db query "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'prompt%'"
```

---

## Verification

- [ ] All 4 tables created successfully
- [ ] Indexes created
- [ ] RLS policies active
- [ ] Helper functions work
- [ ] No migration errors

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/migrations/20260128_create_prompt_packs.sql` | Create |
| `src/integrations/supabase/types.ts` | Auto-update after migration |

---

## Acceptance Criteria

1. Tables exist: `prompt_packs`, `prompt_pack_steps`, `prompt_runs`, `startup_memory`
2. RLS policies prevent cross-user access
3. `search_prompt_packs()` returns results
4. `get_next_pack_step()` returns correct step
5. Migration is reversible

---

## Rollback

```sql
DROP TABLE IF EXISTS startup_memory CASCADE;
DROP TABLE IF EXISTS prompt_runs CASCADE;
DROP TABLE IF EXISTS prompt_pack_steps CASCADE;
DROP TABLE IF EXISTS prompt_packs CASCADE;
DROP FUNCTION IF EXISTS get_next_pack_step;
DROP FUNCTION IF EXISTS search_prompt_packs;
DROP FUNCTION IF EXISTS get_pack_run_stats;
```
