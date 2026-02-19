-- =============================================================================
-- Seed: Activities
-- Purpose: Create sample activity records for Recent Activity dashboard section
-- Startup: StartupAI (d33f795b-5a99-4df3-9819-52a4baba0895)
-- User: 4bf963de-44fa-4dcf-ab50-1d3b178497a3
-- Org: 81bbb7f8-0298-47f8-bb31-b05838b93b5a
-- UUID Range: 113-130
-- =============================================================================

-- Clear existing activities for this startup
DELETE FROM public.activities WHERE startup_id = 'd33f795b-5a99-4df3-9819-52a4baba0895';

-- Insert sample activities (most recent first for realistic timeline)
INSERT INTO public.activities (
  id,
  startup_id,
  org_id,
  user_id,
  activity_type,
  title,
  description,
  entity_type,
  entity_id,
  task_id,
  deal_id,
  contact_id,
  document_id,
  metadata,
  is_system_generated,
  importance,
  created_at
) VALUES

-- Activity 113: Task completed (today)
(
  '00000000-0000-0000-0000-000000000113'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'task_completed',
  'Completed: Create investor target list',
  'Researched and compiled 50+ relevant seed-stage investors',
  'task',
  '00000000-0000-0000-0000-000000000045'::uuid,
  '00000000-0000-0000-0000-000000000045'::uuid,
  NULL,
  NULL,
  NULL,
  '{"category": "fundraising"}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '2 hours'
),

-- Activity 114: AI insight (today)
(
  '00000000-0000-0000-0000-000000000114'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  NULL,
  'ai_insight_generated',
  'AI Insight: Add customer testimonials',
  'Your traction score could improve by 15 points with social proof',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"trigger_rule": "traction_proof_low", "score": 45, "source": "workflow_trigger"}'::jsonb,
  true,
  'high',
  NOW() - INTERVAL '4 hours'
),

-- Activity 115: Deck updated (today)
(
  '00000000-0000-0000-0000-000000000115'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'deck_updated',
  'Updated Seed Pitch Deck',
  'Added new traction metrics and revised financial projections',
  'pitch_deck',
  '00000000-0000-0000-0000-000000000086'::uuid,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"slides_changed": 3}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '6 hours'
),

-- Activity 116: Deal stage changed (yesterday)
(
  '00000000-0000-0000-0000-000000000116'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'deal_stage_changed',
  'Deal progressed: Accel Partners',
  'Moved from Outreach to Meeting stage',
  'deal',
  '00000000-0000-0000-0000-000000000061'::uuid,
  NULL,
  '00000000-0000-0000-0000-000000000061'::uuid,
  NULL,
  NULL,
  '{"old_stage": "outreach", "new_stage": "meeting"}'::jsonb,
  false,
  'high',
  NOW() - INTERVAL '1 day'
),

-- Activity 117: Contact created (yesterday)
(
  '00000000-0000-0000-0000-000000000117'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'contact_created',
  'Added investor: Sarah Chen (Accel)',
  'Warm intro from YC Network',
  'contact',
  '00000000-0000-0000-0000-000000000051'::uuid,
  NULL,
  NULL,
  '00000000-0000-0000-0000-000000000051'::uuid,
  NULL,
  '{"firm": "Accel Partners", "relationship": "warm"}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '1 day 2 hours'
),

-- Activity 118: AI analysis completed (yesterday)
(
  '00000000-0000-0000-0000-000000000118'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  NULL,
  'ai_analysis_completed',
  'Health Score improved to 72/100',
  'Traction and team readiness scores increased',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"previous_score": 65, "new_score": 72, "breakdown": {"traction": 70, "team": 68, "product": 78}}'::jsonb,
  true,
  'normal',
  NOW() - INTERVAL '1 day 5 hours'
),

-- Activity 119: AI task suggested (2 days ago)
(
  '00000000-0000-0000-0000-000000000119'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  NULL,
  'ai_task_suggested',
  'AI suggested task: Strengthen team profile',
  'Based on team readiness score of 50/100',
  'task',
  '00000000-0000-0000-0000-000000000050'::uuid,
  '00000000-0000-0000-0000-000000000050'::uuid,
  NULL,
  NULL,
  NULL,
  '{"source": "workflow_trigger", "trigger_rule": "team_readiness_low"}'::jsonb,
  true,
  'normal',
  NOW() - INTERVAL '2 days'
),

-- Activity 120: Document created (2 days ago)
(
  '00000000-0000-0000-0000-000000000120'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'document_created',
  'Created Executive Summary',
  'First draft of investor-ready executive summary',
  'document',
  '00000000-0000-0000-0000-000000000102'::uuid,
  NULL,
  NULL,
  NULL,
  '00000000-0000-0000-0000-000000000102'::uuid,
  '{"type": "executive_summary"}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '2 days 4 hours'
),

-- Activity 121: AI extraction completed (3 days ago)
(
  '00000000-0000-0000-0000-000000000121'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'ai_extraction_completed',
  'Completed AI Interview',
  'Answered 5 strategic questions about market and traction',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"questions_answered": 5, "pack": "pack_problem_validation"}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '3 days'
),

-- Activity 122: Deck created (3 days ago)
(
  '00000000-0000-0000-0000-000000000122'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'deck_created',
  'Created Seed Pitch Deck',
  'Started building 12-slide investor deck',
  'pitch_deck',
  '00000000-0000-0000-0000-000000000086'::uuid,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"template": "sequoia", "deck_type": "seed"}'::jsonb,
  false,
  'high',
  NOW() - INTERVAL '3 days 6 hours'
),

-- Activity 123: Milestone reached (5 days ago)
(
  '00000000-0000-0000-0000-000000000123'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  NULL,
  'milestone_reached',
  'Milestone: First 50 customers!',
  'Crossed 50 paying customer threshold',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"milestone": "50_customers", "previous": 48, "current": 52}'::jsonb,
  true,
  'critical',
  NOW() - INTERVAL '5 days'
),

-- Activity 124: Deal won (6 days ago)
(
  '00000000-0000-0000-0000-000000000124'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'deal_won',
  'Deal closed: LaunchPad Ventures',
  'First fund customer signed annual license',
  'deal',
  '00000000-0000-0000-0000-000000000067'::uuid,
  NULL,
  '00000000-0000-0000-0000-000000000067'::uuid,
  NULL,
  NULL,
  '{"amount": 12000}'::jsonb,
  false,
  'critical',
  NOW() - INTERVAL '6 days'
),

-- Activity 125: Task completed (1 week ago)
(
  '00000000-0000-0000-0000-000000000125'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'task_completed',
  'Completed: Deploy AI interview feature',
  'Smart interviewer deployed to production',
  'task',
  '00000000-0000-0000-0000-000000000046'::uuid,
  '00000000-0000-0000-0000-000000000046'::uuid,
  NULL,
  NULL,
  NULL,
  '{"category": "product"}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '7 days'
),

-- Activity 126: AI insight (1 week ago)
(
  '00000000-0000-0000-0000-000000000126'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  NULL,
  'ai_insight_generated',
  'AI Insight: Focus on investor outreach',
  'Your fundraising readiness score is 75/100 - ideal time to start outreach',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"trigger_rule": "fundraising_ready", "score": 75}'::jsonb,
  true,
  'high',
  NOW() - INTERVAL '8 days'
),

-- Activity 127: Document created (10 days ago)
(
  '00000000-0000-0000-0000-000000000127'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'document_created',
  'Created Financial Model',
  '3-year projections with key assumptions',
  'document',
  '00000000-0000-0000-0000-000000000104'::uuid,
  NULL,
  NULL,
  NULL,
  '00000000-0000-0000-0000-000000000104'::uuid,
  '{"type": "financial_model"}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '10 days'
),

-- Activity 128: Contact created (12 days ago)
(
  '00000000-0000-0000-0000-000000000128'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'contact_created',
  'Added investor: Michael Park (a16z)',
  'Researching AI-focused investors',
  'contact',
  '00000000-0000-0000-0000-000000000052'::uuid,
  NULL,
  NULL,
  '00000000-0000-0000-0000-000000000052'::uuid,
  NULL,
  '{"firm": "Andreessen Horowitz", "relationship": "cold"}'::jsonb,
  false,
  'normal',
  NOW() - INTERVAL '12 days'
),

-- Activity 129: AI analysis (2 weeks ago)
(
  '00000000-0000-0000-0000-000000000129'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  NULL,
  'ai_analysis_completed',
  'Health Score calculated: 65/100',
  'Initial assessment after onboarding',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"previous_score": null, "new_score": 65, "breakdown": {"traction": 55, "team": 60, "product": 80}}'::jsonb,
  true,
  'normal',
  NOW() - INTERVAL '14 days'
),

-- Activity 130: User joined (3 weeks ago)
(
  '00000000-0000-0000-0000-000000000130'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '81bbb7f8-0298-47f8-bb31-b05838b93b5a'::uuid,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  'user_joined',
  'Welcome to StartupAI!',
  'Account created and onboarding completed',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"source": "organic"}'::jsonb,
  true,
  'normal',
  NOW() - INTERVAL '21 days'
);

-- =============================================================================
-- END OF SEED: Activities (IDs 113-130)
-- =============================================================================
