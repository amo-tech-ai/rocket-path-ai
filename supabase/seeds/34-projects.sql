-- =============================================================================
-- Seed: Projects
-- Purpose: Create sample projects for /projects page
-- Startup: StartupAI (d33f795b-5a99-4df3-9819-52a4baba0895)
-- UUID Range: 34-37
-- =============================================================================

-- Clear existing projects for this startup
DELETE FROM public.projects WHERE startup_id = 'd33f795b-5a99-4df3-9819-52a4baba0895';

-- Insert sample projects
INSERT INTO public.projects (
  id,
  startup_id,
  name,
  description,
  type,
  status,
  health,
  progress,
  start_date,
  end_date,
  owner_id,
  goals,
  tags,
  created_at,
  updated_at
) VALUES
-- Project 34: Seed Fundraising
(
  '00000000-0000-0000-0000-000000000034'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'Seed Fundraising Round',
  'Raise $1.5M seed round to scale product development and go-to-market',
  'fundraising',
  'active',
  'on_track',
  35,
  '2026-01-15',
  '2026-04-30',
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '[
    {"title": "Create pitch deck", "completed": true},
    {"title": "Build investor pipeline (50+)", "completed": false},
    {"title": "Complete 20 investor meetings", "completed": false},
    {"title": "Secure term sheet", "completed": false}
  ]'::jsonb,
  ARRAY['fundraising', 'seed', 'q1-2026'],
  '2026-01-15 10:00:00+00'::timestamptz,
  NOW()
),
-- Project 35: Product Launch
(
  '00000000-0000-0000-0000-000000000035'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'V2 Product Launch',
  'Launch major product update with AI interview feature and enhanced CRM',
  'product',
  'active',
  'at_risk',
  60,
  '2026-01-01',
  '2026-02-28',
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '[
    {"title": "Complete AI interview feature", "completed": true},
    {"title": "CRM enhancement", "completed": true},
    {"title": "Beta testing with 20 users", "completed": false},
    {"title": "Launch announcement", "completed": false}
  ]'::jsonb,
  ARRAY['product', 'launch', 'v2'],
  '2026-01-01 10:00:00+00'::timestamptz,
  NOW()
),
-- Project 36: Customer Acquisition
(
  '00000000-0000-0000-0000-000000000036'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'Q1 Customer Acquisition',
  'Acquire 200 new customers through content marketing and partnerships',
  'marketing',
  'active',
  'on_track',
  25,
  '2026-01-01',
  '2026-03-31',
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '[
    {"title": "Launch blog content series", "completed": true},
    {"title": "Partner with 5 accelerators", "completed": false},
    {"title": "Launch referral program", "completed": false},
    {"title": "Hit 200 new customers", "completed": false}
  ]'::jsonb,
  ARRAY['marketing', 'growth', 'q1-2026'],
  '2026-01-01 10:00:00+00'::timestamptz,
  NOW()
),
-- Project 37: Completed Project (MVP)
(
  '00000000-0000-0000-0000-000000000037'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'MVP Development',
  'Build and launch minimum viable product',
  'product',
  'completed',
  'on_track',
  100,
  '2025-06-01',
  '2025-12-15',
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '[
    {"title": "Core platform development", "completed": true},
    {"title": "AI integration", "completed": true},
    {"title": "User authentication", "completed": true},
    {"title": "Initial launch", "completed": true}
  ]'::jsonb,
  ARRAY['mvp', 'product', '2025'],
  '2025-06-01 10:00:00+00'::timestamptz,
  '2025-12-15 10:00:00+00'::timestamptz
);

-- =============================================================================
-- END OF SEED: Projects (IDs 34-37)
-- =============================================================================
