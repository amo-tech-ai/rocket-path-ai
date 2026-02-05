-- =============================================================================
-- Seed: Validator Data (Ecommerce, SaaS, Fintech)
-- Purpose: Seed data for 3 diverse startups to demonstrate validator capabilities
-- Scenarios:
-- 1. Ecommerce: "StyleMatch AI" (Visual Try-on) - VERDICT: GO
-- 2. SaaS: "DocuFlow" (Legal Automation) - VERDICT: CONDITIONAL
-- 3. Fintech: "InvoiceAdvance" (Freelance Factoring) - VERDICT: NEEDS WORK
-- =============================================================================

-- Clean up existing validator data for these specific IDs if they exist
-- (Using specific UUIDs to ensure idempotency without wiping entire tables)

-- 1. ECOMMERCE STARTUP: StyleMatch AI
--------------------------------------------------------------------------------
INSERT INTO public.startups (
  id, org_id, name, industry, stage, description, tagline, 
  problem_statement, solution_description, business_model
) VALUES (
  '750e8400-e29b-41d4-a716-555555550001'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid, -- Standard Org
  'StyleMatch AI',
  'Ecommerce',
  'Seed',
  'AI-powered virtual try-on plugin for Shopify stores that uses generative AI to show clothes on user photos.',
  'Your Fitting Room, Everywhere',
  'Online returns cost retailers billions due to poor fit and style mismatch.',
  'A plugin that lets users upload a photo and see realistic draping of clothing items using diffusion models.',
  ARRAY['SaaS', 'Usage-based']
) ON CONFLICT (id) DO UPDATE SET 
  name = excluded.name,
  description = excluded.description;

-- Report for StyleMatch
INSERT INTO public.validation_reports (
  id, startup_id, overall_score, verdict, confidence, validation_type, 
  problem_score, market_score, solution_score, blue_ocean_score,
  idea_description
) VALUES (
  '880e8400-e29b-41d4-a716-555555550001'::uuid,
  '750e8400-e29b-41d4-a716-555555550001'::uuid,
  88.5,
  'go',
  0.9,
  'deep',
  90.0, -- Problem
  85.0, -- Market
  92.0, -- Solution
  7.5,  -- Blue Ocean
  'AI virtual try-on for Shopify'
) ON CONFLICT (id) DO NOTHING;

-- Score for StyleMatch
INSERT INTO public.validation_scores (
  id, validation_report_id, startup_id, 
  problem_score, market_score, extra_breakdown
  -- Using 'risk_adjustment' etc if columns exist, simplifying for seed compatibility
) VALUES (
  '990e8400-e29b-41d4-a716-555555550001'::uuid,
  '880e8400-e29b-41d4-a716-555555550001'::uuid,
  '750e8400-e29b-41d4-a716-555555550001'::uuid,
  90.0, 85.0,
  '{"solution": 92.0, "execution": 80.0, "competition": 75.0}'::jsonb
) ON CONFLICT (id) DO NOTHING;


-- 2. SaaS STARTUP: DocuFlow
--------------------------------------------------------------------------------
INSERT INTO public.startups (
  id, org_id, name, industry, stage, description, tagline,
  problem_statement, solution_description, business_model
) VALUES (
  '750e8400-e29b-41d4-a716-555555550002'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'DocuFlow',
  'SaaS',
  'Pre-Seed',
  'Automated legal document workflows for early-stage startups using simple natural language prompts.',
  'Legal Engineering for Everyone',
  'Legal costs are prohibitive for early stage founders, leading to dangerous shortcuts.',
  'LLM-based document generator that creates valid contracts from conversation logs.',
  ARRAY['Subscription', 'Freemium']
) ON CONFLICT (id) DO UPDATE SET name = excluded.name;

-- Report for DocuFlow
INSERT INTO public.validation_reports (
  id, startup_id, overall_score, verdict, confidence, validation_type,
  problem_score, market_score, solution_score, blue_ocean_score,
  idea_description
) VALUES (
  '880e8400-e29b-41d4-a716-555555550002'::uuid,
  '750e8400-e29b-41d4-a716-555555550002'::uuid,
  72.0,
  'conditional',
  0.8,
  'quick',
  85.0, -- Problem
  90.0, -- Market
  60.0, -- Solution (Concerns about accuracy/liability)
  5.0,  -- Blue Ocean (Crowded)
  'AI legal docs for startups'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.validation_conditions (
  id, validation_report_id, startup_id, title, status, priority, description
) VALUES (
  'aa0e8400-e29b-41d4-a716-555555550001'::uuid,
  '880e8400-e29b-41d4-a716-555555550002'::uuid,
  '750e8400-e29b-41d4-a716-555555550002'::uuid,
  'Verify Legal Liability Insurance',
  'pending',
  'critical',
  'Must secure partnership with a law firm or insurance to cover AI errors.'
) ON CONFLICT (id) DO NOTHING;


-- 3. FINTECH STARTUP: InvoiceAdvance
--------------------------------------------------------------------------------
INSERT INTO public.startups (
  id, org_id, name, industry, stage, description, tagline,
  problem_statement, solution_description, business_model
) VALUES (
  '750e8400-e29b-41d4-a716-555555550003'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'InvoiceAdvance',
  'Fintech',
  'Idea',
  'Peer-to-peer invoice factoring for freelance designers.',
  'Get Paid Now, Not Later',
  'Freelancers wait 30-90 days for payments, causing cashflow crunches.',
  'Marketplace where investors buy invoices at 5% discount for instant cash.',
  ARRAY['Marketplace', 'Transaction Fee']
) ON CONFLICT (id) DO UPDATE SET name = excluded.name;

-- Report for InvoiceAdvance
INSERT INTO public.validation_reports (
  id, startup_id, overall_score, verdict, confidence, validation_type,
  problem_score, market_score, solution_score, blue_ocean_score,
  idea_description
) VALUES (
  '880e8400-e29b-41d4-a716-555555550003'::uuid,
  '750e8400-e29b-41d4-a716-555555550003'::uuid,
  55.0,
  'needs_work',
  0.85,
  'deep',
  80.0, -- Problem (Real pain)
  40.0, -- Market (Niche, highly regulated)
  50.0, -- Solution
  3.0,  -- Blue Ocean (Red ocean, heavily regulated)
  'P2P invoice factoring'
) ON CONFLICT (id) DO NOTHING;

-- Critic Review for InvoiceAdvance
INSERT INTO public.critic_reviews (
  id, validation_report_id, startup_id, critic_persona,
  severity, sentiment, review_text
) VALUES (
  'bb0e8400-e29b-41d4-a716-555555550001'::uuid,
  '880e8400-e29b-41d4-a716-555555550003'::uuid,
  '750e8400-e29b-41d4-a716-555555550003'::uuid,
  'legal_advisor',
  'critical',
  'negative',
  'You are effectively operating a lending business. P2P lending requires banking licenses in most jurisdictions. The compliance cost alone will bankrupt you before you process dollar one.'
) ON CONFLICT (id) DO NOTHING;

-- Competitor for StyleMatch (Ecommerce)
INSERT INTO public.competitor_profiles (
  id, validation_report_id, startup_id, name, industry, thread_level,
  description
) VALUES (
  'cc0e8400-e29b-41d4-a716-555555550001'::uuid,
  '880e8400-e29b-41d4-a716-555555550001'::uuid, -- StyleMatch Report
  '750e8400-e29b-41d4-a716-555555550001'::uuid, -- StyleMatch Startup
  'Google Virtual Try-On',
  'Ecommerce',
  'high',
  'Google Search has integrated VTO for major brands.'
) ON CONFLICT (id) DO NOTHING;

