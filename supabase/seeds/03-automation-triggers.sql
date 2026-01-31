-- =====================================================
-- AUTOMATION TRIGGERS AND CHAINS SEED DATA
-- Event-driven automations for StartupAI
-- =====================================================

-- =====================================================
-- ONBOARDING AUTOMATIONS
-- =====================================================

-- When onboarding starts, trigger ideation pack
insert into automation_triggers (
  name, description, trigger_type, event_name,
  pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Onboarding Start - Problem Sharpener',
  'When user starts onboarding, automatically run Problem Sharpener pack',
  'event',
  'onboarding.started',
  (select id from prompt_packs where title = 'Problem Sharpener' limit 1),
  'async',
  true,
  '["profile", "startup"]'::jsonb
);

-- When onboarding step 1 completes, trigger market analysis
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Onboarding Step 1 - Market Analysis',
  'After problem definition, analyze competitive landscape',
  'event',
  'onboarding.step.completed',
  '{"step": 1}'::jsonb,
  (select id from prompt_packs where title = 'Competitor Analysis' limit 1),
  'async',
  true,
  '["startup"]'::jsonb
);

-- When onboarding step 2 completes, enrich founder profile
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Onboarding Step 2 - Founder Enrichment',
  'After market analysis, enrich founder profile with insights',
  'event',
  'onboarding.step.completed',
  '{"step": 2}'::jsonb,
  (select id from prompt_packs where title = 'Founder Coach' limit 1),
  'async',
  true,
  '["profile"]'::jsonb
);

-- When onboarding completes, run full validation
insert into automation_triggers (
  name, description, trigger_type, event_name,
  pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Onboarding Complete - Full Validation',
  'When onboarding finishes, run comprehensive startup validation',
  'event',
  'onboarding.completed',
  (select id from prompt_packs where title = 'Deep Validation Pack' limit 1),
  'async',
  true,
  '["validation", "tasks"]'::jsonb
);

-- =====================================================
-- CANVAS AUTOMATIONS
-- =====================================================

-- When canvas is created, generate first draft
insert into automation_triggers (
  name, description, trigger_type, event_name,
  pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Canvas Created - Auto Generate',
  'When a new canvas is created, auto-generate initial content',
  'event',
  'canvas.created',
  (select id from prompt_packs where title = 'Canvas First Draft Generator' limit 1),
  'sync',
  true,
  '["canvas"]'::jsonb
);

-- When canvas is updated significantly, re-validate
insert into automation_triggers (
  name, description, trigger_type, event_name,
  pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Canvas Updated - Re-validate',
  'When canvas has major updates, run validation again',
  'event',
  'canvas.updated',
  (select id from prompt_packs where title = 'Quick Validate' limit 1),
  'async',
  true,
  '["validation"]'::jsonb
);

-- =====================================================
-- VALIDATION AUTOMATIONS
-- =====================================================

-- When validation score is low, suggest improvements
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Low Score - Improvement Tasks',
  'When validation score is below 60, generate improvement tasks',
  'event',
  'validation.completed',
  '{"score": {"operator": "<", "value": 60}}'::jsonb,
  (select id from prompt_packs where title = 'Problem Sharpener' limit 1),
  'async',
  true,
  '["tasks"]'::jsonb
);

-- When validation score is high, unlock investor matching
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'High Score - Investor Prep',
  'When validation score is 80+, prepare for investor matching',
  'event',
  'validation.completed',
  '{"score": {"operator": ">=", "value": 80}}'::jsonb,
  (select id from prompt_packs where title = 'Investor Critic' limit 1),
  'async',
  true,
  '["pitch_deck", "tasks"]'::jsonb
);

-- =====================================================
-- PITCH DECK AUTOMATIONS
-- =====================================================

-- When pitch deck is created, auto-generate slides
insert into automation_triggers (
  name, description, trigger_type, event_name,
  pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Pitch Deck Created - Auto Generate',
  'When pitch deck is created, generate all slides',
  'event',
  'pitch_deck.created',
  (select id from prompt_packs where title = 'Pitch Narrative Pack' limit 1),
  'async',
  true,
  '["pitch_deck"]'::jsonb
);

-- =====================================================
-- DEAL STAGE AUTOMATIONS
-- =====================================================

-- When deal moves to due diligence, prepare documents
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Deal Due Diligence - Prep Docs',
  'When deal enters due diligence, generate checklist tasks',
  'event',
  'deal.stage_changed',
  '{"to": "due_diligence"}'::jsonb,
  (select id from prompt_packs where title = 'Due Diligence Prep' limit 1),
  'async',
  true,
  '["tasks"]'::jsonb
);

-- =====================================================
-- INDUSTRY-SPECIFIC AUTOMATIONS
-- =====================================================

-- SaaS startup - auto-apply SaaS pack after onboarding
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'SaaS Startup - Industry Pack',
  'For SaaS startups, run specialized validation after onboarding',
  'event',
  'onboarding.completed',
  '{"industry": "saas"}'::jsonb,
  (select id from prompt_packs where title = 'SaaS Validation Pack' limit 1),
  'async',
  true,
  '["validation", "tasks"]'::jsonb
);

-- Fintech startup - auto-apply Fintech pack
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Fintech Startup - Industry Pack',
  'For Fintech startups, run specialized validation after onboarding',
  'event',
  'onboarding.completed',
  '{"industry": "fintech"}'::jsonb,
  (select id from prompt_packs where title = 'Fintech Validation Pack' limit 1),
  'async',
  true,
  '["validation", "tasks"]'::jsonb
);

-- Marketplace startup - auto-apply Marketplace pack
insert into automation_triggers (
  name, description, trigger_type, event_name,
  condition_rules, pack_id, execution_mode, auto_apply_outputs, output_targets
) values (
  'Marketplace Startup - Industry Pack',
  'For Marketplace startups, run specialized validation after onboarding',
  'event',
  'onboarding.completed',
  '{"industry": "marketplace"}'::jsonb,
  (select id from prompt_packs where title = 'Marketplace Validation Pack' limit 1),
  'async',
  true,
  '["validation", "tasks"]'::jsonb
);

-- =====================================================
-- AUTOMATION CHAINS
-- Multi-step workflows with dependencies
-- =====================================================

-- Full Onboarding Journey Chain
insert into automation_chains (
  name, description, trigger_event, trigger_conditions, steps
) values (
  'Complete Onboarding Journey',
  'Full onboarding flow with validation and pitch prep',
  'onboarding.started',
  '{}'::jsonb,
  '[
    {
      "pack_slug": "problem-sharpener",
      "description": "Sharpen the problem statement",
      "apply_to": ["startup", "canvas"],
      "on_success": "next",
      "on_failure": "stop"
    },
    {
      "pack_slug": "competitor-analysis",
      "description": "Analyze competitive landscape",
      "delay_seconds": 5,
      "apply_to": ["startup"],
      "on_success": "next"
    },
    {
      "pack_slug": "quick-validate",
      "description": "Quick validation check",
      "apply_to": ["validation"],
      "on_success": "next"
    },
    {
      "pack_slug": "pitch-narrative",
      "description": "Generate pitch deck",
      "apply_to": ["pitch_deck"],
      "condition": {"validation_score": {"operator": ">=", "value": 60}}
    }
  ]'::jsonb
);

-- Investor Readiness Chain
insert into automation_chains (
  name, description, trigger_event, trigger_conditions, steps
) values (
  'Investor Readiness Pipeline',
  'Prepare startup for investor meetings',
  'validation.completed',
  '{"score": {"operator": ">=", "value": 75}}'::jsonb,
  '[
    {
      "pack_slug": "investor-critic",
      "description": "Critical investor perspective",
      "apply_to": ["tasks"],
      "on_success": "next"
    },
    {
      "pack_slug": "pitch-narrative",
      "description": "Refine pitch narrative",
      "delay_seconds": 10,
      "apply_to": ["pitch_deck"],
      "on_success": "next"
    },
    {
      "pack_slug": "founder-coach",
      "description": "Pitch coaching",
      "apply_to": ["tasks"]
    }
  ]'::jsonb
);

-- Pivot Assessment Chain
insert into automation_chains (
  name, description, trigger_event, trigger_conditions, steps
) values (
  'Pivot Assessment Flow',
  'When validation fails, guide through pivot assessment',
  'validation.completed',
  '{"score": {"operator": "<", "value": 40}}'::jsonb,
  '[
    {
      "pack_slug": "problem-sharpener",
      "description": "Re-evaluate problem statement",
      "apply_to": ["startup"],
      "on_success": "next"
    },
    {
      "pack_slug": "competitor-analysis",
      "description": "Analyze adjacent markets",
      "delay_seconds": 5,
      "apply_to": ["startup"],
      "on_success": "next"
    },
    {
      "pack_slug": "quick-validate",
      "description": "Re-validate new direction",
      "apply_to": ["validation"]
    }
  ]'::jsonb
);

-- =====================================================
-- STANDARD EVENTS DOCUMENTATION
-- =====================================================

comment on table automation_triggers is 'Standard events that can trigger automations:

ONBOARDING EVENTS:
- onboarding.started          → User begins onboarding wizard
- onboarding.step.completed   → Step completed (payload: { step: 1-4 })
- onboarding.completed        → All onboarding steps done

PROFILE EVENTS:
- profile.created             → New user profile created
- profile.updated             → Profile information changed
- profile.linkedin_connected  → LinkedIn OAuth completed

CANVAS EVENTS:
- canvas.created              → New lean canvas created
- canvas.updated              → Canvas sections updated
- canvas.validated            → Canvas validation completed

VALIDATION EVENTS:
- validation.requested        → User requested validation
- validation.completed        → Validation finished (payload: { score: number })

PITCH DECK EVENTS:
- pitch_deck.created          → New pitch deck started
- pitch_deck.slide.generated  → Single slide generated
- pitch_deck.completed        → All slides generated

CRM EVENTS:
- contact.created             → New contact added
- contact.enriched            → Contact enriched with AI
- deal.created                → New deal created
- deal.stage_changed          → Deal moved stages (payload: { from, to })

INVESTOR EVENTS:
- investor.matched            → Investors matched to startup
- investor.contacted          → Investor outreach initiated

DOCUMENT EVENTS:
- document.uploaded           → File uploaded
- document.analyzed           → AI analysis complete

TASK EVENTS:
- task.created                → Task created
- task.completed              → Task marked done
- tasks.batch_created         → Multiple tasks created

SYSTEM EVENTS:
- weekly.digest               → Weekly progress check
- monthly.review              → Monthly startup review
';
