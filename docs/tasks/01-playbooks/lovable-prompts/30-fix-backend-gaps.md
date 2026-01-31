---
task_number: "30"
title: "Fix Backend Gaps (Validation History + Template Registry)"
category: "Bug Fix"
subcategory: "Backend"
phase: 1
priority: "P1"
status: "Open"
percent_complete: 0
owner: "Backend Developer"
source: "tasks/testing/07-lovable-audit.md"
depends_on: []
---

# Prompt 30: Fix Backend Gaps

> **Forensic Findings:**
> 1. `get_validation_history` action is called by frontend but **does not exist** in `industry-expert-agent` → 400 error
> 2. `prompt_template_registry` table is **missing** from live database

---

## 📋 Summary Table

| Issue | Component | Impact | Fix Type |
|:---|:---|:---|:---|
| **get_validation_history** | `industry-expert-agent` edge function | 400 error when viewing validation history | Add action handler |
| **prompt_template_registry** | Supabase schema | System cannot store prompt templates | Create table + migration |

---

## 🎯 User Stories & Real-World Journeys

### Story 1: David — The Validation History Seeker

**Persona:** David, 36, founder who validated his idea 3 weeks ago.

**Journey (Current - Broken):**
1. David clicks "View Past Validations" in the Validator
2. Frontend calls `industry-expert-agent` with `action: 'get_validation_history'`
3. Edge function returns 400: "Unknown action: get_validation_history"
4. **Result:** David sees error toast, cannot view history

**Journey (Fixed):**
1. David clicks "View Past Validations"
2. Edge function returns his 3 validation runs with dates, scores, and summaries
3. David compares his Week 1 score (52) to Week 3 score (78)
4. **Reaction:** "Great, I can see my progress over time."

---

### Story 2: Alex — The Template Admin

**Persona:** Alex, 31, internal admin configuring AI prompt templates.

**Journey (Current - Broken):**
1. Alex wants to add a new prompt template for "Investor Objection Handling"
2. Goes to insert into `prompt_template_registry` table
3. **Error:** Table does not exist in production
4. Has to hardcode template in edge function instead

**Journey (Fixed):**
1. Alex inserts template into `prompt_template_registry`:
   ```sql
   INSERT INTO prompt_template_registry (
     slug, name, template, model, category
   ) VALUES (
     'investor-objection', 'Investor Objection Handling',
     'Given the startup {name} in {industry}...', 'gemini-3-flash', 'pitch'
   );
   ```
2. Edge function reads from registry instead of hardcoded strings
3. **Result:** Templates are configurable without code deploys

---

## ✅ Acceptance Criteria

### Issue 1: get_validation_history

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | `industry-expert-agent` has `get_validation_history` case | grep in edge function |
| 2 | Returns array of validation runs | API returns `{ runs: [...] }` |
| 3 | Runs include date, score, summary | Check response structure |
| 4 | Frontend no longer shows 400 error | Manual QA |

### Issue 2: prompt_template_registry

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Table exists in Supabase | `\d prompt_template_registry` |
| 2 | Has columns: id, slug, name, template, model, category, created_at | Schema inspection |
| 3 | RLS policy allows authenticated read | Policy check |
| 4 | Edge functions can query it | Test query in edge function |

---

## 🛠 Implementation Steps

### Fix 1: Add get_validation_history to industry-expert-agent

```typescript
// File: supabase/functions/industry-expert-agent/index.ts

// Add to the switch statement for action handling
case 'get_validation_history': {
  const { startup_id, limit = 10 } = body;

  if (!startup_id) {
    return new Response(
      JSON.stringify({ error: 'startup_id is required' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Query validation runs from playbook_runs or dedicated table
  const { data: runs, error } = await supabaseClient
    .from('playbook_runs')
    .select('id, created_at, data, updated_at')
    .eq('startup_id', startup_id)
    .eq('step', 'validation')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching validation history:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch validation history' }),
      { status: 500, headers: corsHeaders }
    );
  }

  // Transform runs to consistent format
  const history = runs.map(run => ({
    id: run.id,
    date: run.created_at,
    score: run.data?.total_score ?? run.data?.validation_score ?? null,
    summary: run.data?.summary ?? run.data?.ai_summary ?? null,
    breakdown: run.data?.breakdown ?? run.data?.scores ?? null,
  }));

  return new Response(
    JSON.stringify({ success: true, runs: history }),
    { status: 200, headers: corsHeaders }
  );
}
```

### Fix 2: Create prompt_template_registry table

```sql
-- File: supabase/migrations/20260130300000_create_prompt_template_registry.sql

-- Create prompt template registry table
CREATE TABLE IF NOT EXISTS prompt_template_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  model TEXT DEFAULT 'gemini-3-flash',
  category TEXT DEFAULT 'general',
  variables JSONB DEFAULT '[]'::jsonb,  -- List of {name, type, description}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_prompt_template_registry_slug ON prompt_template_registry(slug);
CREATE INDEX idx_prompt_template_registry_category ON prompt_template_registry(category);
CREATE INDEX idx_prompt_template_registry_active ON prompt_template_registry(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE prompt_template_registry ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read templates
CREATE POLICY "Authenticated users can read templates"
  ON prompt_template_registry
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Only admins can modify templates (via user_roles)
CREATE POLICY "Admins can manage templates"
  ON prompt_template_registry
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'superadmin')
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_prompt_template_registry_updated_at
  BEFORE UPDATE ON prompt_template_registry
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE prompt_template_registry IS 'Stores configurable AI prompt templates for various agent actions';
```

### Fix 3: Seed initial templates (optional)

```sql
-- File: supabase/seeds/prompt_template_registry.sql

INSERT INTO prompt_template_registry (slug, name, template, model, category, variables) VALUES
(
  'validation-analysis',
  'Startup Validation Analysis',
  'Analyze the startup "{startup_name}" in the {industry} industry. Consider: {context}. Provide a validation score and recommendations.',
  'gemini-3-flash',
  'validation',
  '[{"name": "startup_name", "type": "string"}, {"name": "industry", "type": "string"}, {"name": "context", "type": "object"}]'
),
(
  'investor-objection',
  'Investor Objection Handler',
  'For the startup "{startup_name}" pitching to investors, generate responses to common objections in the {industry} space.',
  'gemini-3-pro',
  'pitch',
  '[{"name": "startup_name", "type": "string"}, {"name": "industry", "type": "string"}]'
),
(
  'market-sizing',
  'TAM/SAM/SOM Analysis',
  'Calculate the Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) for {startup_name} in {industry}.',
  'gemini-3-flash',
  'analysis',
  '[{"name": "startup_name", "type": "string"}, {"name": "industry", "type": "string"}]'
);
```

---

## 📂 Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/industry-expert-agent/index.ts` | Modify | Add `get_validation_history` case |
| `supabase/migrations/20260130300000_create_prompt_template_registry.sql` | Create | New table migration |
| `supabase/seeds/prompt_template_registry.sql` | Create | Optional seed data |

---

## 🔬 Verification Commands

```bash
# 1. Check edge function has new action
grep -n "get_validation_history" supabase/functions/industry-expert-agent/index.ts

# 2. Apply migration
supabase db push

# 3. Verify table exists
supabase db run "SELECT * FROM prompt_template_registry LIMIT 1;"

# 4. Deploy edge function
supabase functions deploy industry-expert-agent

# 5. Test get_validation_history via curl
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/industry-expert-agent' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"action": "get_validation_history", "startup_id": "SOME_UUID"}'

# 6. Verify frontend no longer errors
# - Open Validator page
# - Click "View History" or similar
# - Should show list (or empty state), not 400 error
```

---

## 🚨 Common Pitfalls

1. **Migration order** — Ensure `update_updated_at_column()` function exists before running migration
2. **RLS policy conflict** — If `user_roles` table doesn't exist, admin policy will fail
3. **Edge function redeploy** — After modifying, must run `supabase functions deploy`
4. **Validation data location** — Check if validation results are in `playbook_runs` or another table

---

## 📊 Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Validation history 400 errors | 100% | 0% |
| Template configuration time | Code deploy | SQL insert |
| Admin template editing | Impossible | Self-service |

---

## 🔗 Dependencies

- `playbook_runs` table must exist with `step = 'validation'` entries
- `user_roles` table must exist for admin policy (or simplify policy)
- `update_updated_at_column()` trigger function must exist

---

## 📝 References

- **Audit finding:** `tasks/testing/07-lovable-audit.md` (Sections 6, 7)
- **Edge function location:** `supabase/functions/industry-expert-agent/index.ts`
- **Existing migrations:** `supabase/migrations/`
