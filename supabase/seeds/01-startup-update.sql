-- =============================================================================
-- Seed: Startup Profile Update
-- Purpose: Update existing startup with realistic data
-- User: Sanjiv Khullar (ai@sunai.one)
-- =============================================================================

-- Update the existing startup with full data
UPDATE public.startups
SET
  name = 'StartupAI',
  description = 'AI-powered operating system for startup founders. We help early-stage founders validate ideas, build pitch decks, manage investor relationships, and execute faster.',
  tagline = 'Your AI Co-Founder',
  industry = 'artificial_intelligence',
  sub_industry = 'SaaS',
  stage = 'seed',
  business_model = ARRAY['saas', 'b2b'],
  pricing_model = 'subscription',
  website_url = 'https://startupai.one',
  linkedin_url = 'https://linkedin.com/company/startupai',
  target_customers = ARRAY['Early-stage founders', 'Pre-seed startups', 'Seed-stage companies', 'Accelerator participants'],
  customer_segments = '[
    {"segment": "Solo Founders", "size": "1 person", "pain": "Lack of co-founder support"},
    {"segment": "Pre-seed Startups", "size": "1-3 people", "pain": "No structured process"},
    {"segment": "Accelerator Cohorts", "size": "10-50 startups", "pain": "Need scalable mentorship"}
  ]'::jsonb,
  unique_value = 'AI-powered guidance that combines Y Combinator methodology with real-time market intelligence',
  key_features = ARRAY['AI Pitch Deck Builder', 'Smart CRM', 'Validation Engine', 'Investor Matching', 'Task Automation'],
  competitors = ARRAY['Notion', 'Airtable', 'Pitch', 'Canva'],
  team_size = 3,
  founders = '[
    {
      "name": "Sanjiv Khullar",
      "role": "CEO & Founder",
      "background": "Serial entrepreneur, 15+ years in enterprise software",
      "linkedin": "https://linkedin.com/in/sanjivkhullar"
    }
  ]'::jsonb,
  traction_data = '{
    "mrr": 8500,
    "arr": 102000,
    "users": 450,
    "customers": 85,
    "growth_rate_monthly": 22,
    "churn_rate": 4,
    "nrr": 115,
    "milestones": [
      {"date": "2025-06", "event": "Product Launch"},
      {"date": "2025-09", "event": "100 Active Users"},
      {"date": "2025-12", "event": "First Paying Customer"},
      {"date": "2026-01", "event": "500 Users Milestone"}
    ]
  }'::jsonb,
  is_raising = true,
  raise_amount = 1500000,
  valuation_cap = 8000000,
  use_of_funds = ARRAY['Engineering (40%)', 'Sales & Marketing (30%)', 'AI Infrastructure (20%)', 'Operations (10%)'],
  profile_strength = 72,
  investor_ready_score = 68,
  problem_statement = 'First-time founders waste 6+ months on the wrong activities because they lack experienced guidance. Traditional accelerators help only 1% of startups, leaving millions without support.',
  solution_description = 'StartupAI is an AI-powered OS that provides 24/7 strategic guidance, automates tedious tasks, and connects founders with the right resources at the right time.',
  why_now = 'Advances in LLMs enable personalized coaching at scale. The creator economy has 100M+ aspiring entrepreneurs who need affordable startup support.',
  one_liner = 'The AI co-founder for first-time entrepreneurs',
  elevator_pitch = 'StartupAI helps first-time founders build fundable companies 3x faster by providing AI-powered guidance, automated workflows, and investor-ready materials.',
  tam_size = 50000000000,
  sam_size = 5000000000,
  som_size = 250000000,
  market_category = 'Startup Infrastructure',
  updated_at = NOW()
WHERE id = 'd33f795b-5a99-4df3-9819-52a4baba0895';

-- =============================================================================
-- END OF SEED: Startup Profile Update
-- =============================================================================
