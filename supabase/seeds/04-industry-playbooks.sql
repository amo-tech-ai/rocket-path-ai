-- ============================================================================
-- Seed: Industry Playbooks (minimal)
-- Purpose: Insert at least one industry playbook so industry-expert-agent and
--          prompt-pack have data. Full 19-industry data: run
--          npx tsx scripts/parse-playbooks.ts then convert
--          supabase/seeds/industry-playbooks.json to SQL or use a loader.
-- Schema: 20260129000000_create_industry_playbooks.sql +
--         20260129180000_industry_playbooks_prompt_packs_complete.sql
-- ============================================================================

-- Idempotent: upsert by industry_id
INSERT INTO industry_playbooks (
  industry_id,
  display_name,
  narrative_arc,
  investor_expectations,
  failure_patterns,
  success_stories,
  benchmarks,
  terminology,
  gtm_patterns,
  decision_frameworks,
  investor_questions,
  warning_signs,
  stage_checklists,
  slide_emphasis,
  version,
  is_active,
  source
) VALUES (
  'fintech',
  'FinTech',
  'Financial friction/risk → regulated AI solution → trust + compliance → massive market',
  '{"pre_seed": {"focus": ["Founder-market fit", "Regulatory awareness", "Clear wedge"], "metrics": ["3-5 LOIs", "Advisory board", "Regulatory roadmap"], "deal_breakers": ["No finance background", "Unaware of licensing"]}, "seed": {"focus": ["First regulatory approval", "Unit economics thesis", "Trust acquisition"], "metrics": ["Transaction volume >$500K/month", "1-2 bank partnerships"], "deal_breakers": ["No path to licensing", "No CAC/LTV model"]}}'::jsonb,
  '[{"pattern": "Regulatory Afterthought", "why_fatal": "Banks won''t partner; one action can shut you down", "early_warning": "No compliance hire in first 6 months", "how_to_avoid": "Hire compliance advisor before product launch"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '{"use_phrases": ["unit economics", "compliance framework", "regulatory roadmap"], "avoid_phrases": ["we''ll figure out compliance later"], "investor_vocabulary": ["BaaS", "license", "fraud rate", "CAC payback"]}'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  1,
  true,
  'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  terminology = EXCLUDED.terminology,
  updated_at = now();
