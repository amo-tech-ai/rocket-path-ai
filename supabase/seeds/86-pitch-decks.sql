-- =============================================================================
-- Seed: Pitch Decks
-- Purpose: Create sample pitch decks for /app/pitch-decks page
-- Startup: StartupAI (d33f795b-5a99-4df3-9819-52a4baba0895)
-- UUID Range: 86-89
-- =============================================================================

-- Clear existing pitch decks and slides for this startup
DELETE FROM public.pitch_deck_slides WHERE deck_id IN (
  SELECT id FROM public.pitch_decks WHERE startup_id = 'd33f795b-5a99-4df3-9819-52a4baba0895'
);
DELETE FROM public.pitch_decks WHERE startup_id = 'd33f795b-5a99-4df3-9819-52a4baba0895';

-- Insert pitch decks
INSERT INTO public.pitch_decks (
  id,
  startup_id,
  title,
  description,
  status,
  template,
  theme,
  deck_type,
  slide_count,
  is_public,
  signal_strength,
  signal_breakdown,
  created_by,
  created_at,
  updated_at
) VALUES
-- Deck 86: Main Seed Deck
(
  '00000000-0000-0000-0000-000000000086'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'StartupAI - Seed Pitch Deck',
  'Primary deck for seed round fundraising',
  'in_progress',
  'sequoia',
  'modern',
  'seed',
  12,
  false,
  78,
  '{"problem": 85, "solution": 80, "market": 75, "traction": 70, "team": 80, "ask": 75}'::jsonb,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  NOW() - INTERVAL '30 days',
  NOW()
),
-- Deck 87: Demo Day Deck
(
  '00000000-0000-0000-0000-000000000087'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'Demo Day Presentation',
  '5-minute pitch for accelerator demo day',
  'draft',
  'yc',
  'minimal',
  'custom',
  8,
  false,
  65,
  '{"problem": 80, "solution": 75, "traction": 60, "ask": 50}'::jsonb,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '7 days'
),
-- Deck 88: One Pager
(
  '00000000-0000-0000-0000-000000000088'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'Investor One Pager',
  'Single page executive summary for cold outreach',
  'final',
  'custom',
  'professional',
  'custom',
  1,
  true,
  82,
  '{"clarity": 85, "completeness": 80, "design": 80}'::jsonb,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  NOW() - INTERVAL '21 days',
  NOW() - INTERVAL '5 days'
),
-- Deck 89: Archived old deck
(
  '00000000-0000-0000-0000-000000000089'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'Pre-Seed Deck (v1)',
  'Original deck from pre-seed fundraising',
  'archived',
  'basic',
  'classic',
  'seed',
  10,
  false,
  55,
  '{"problem": 60, "solution": 55, "market": 50, "traction": 45}'::jsonb,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  NOW() - INTERVAL '180 days',
  NOW() - INTERVAL '90 days'
);

-- Insert slides for main deck (86)
INSERT INTO public.pitch_deck_slides (
  id,
  deck_id,
  slide_number,
  slide_type,
  title,
  subtitle,
  content,
  notes,
  layout,
  is_visible,
  created_at,
  updated_at
) VALUES
-- Slide 1: Title
(
  '00000000-0000-0000-0000-000000000090'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  1,
  'title',
  'StartupAI',
  'The AI Co-Founder for First-Time Entrepreneurs',
  '{"tagline": "Build fundable companies 3x faster", "logo_url": null}'::jsonb,
  'Hook: 99% of startups fail, often due to lack of experienced guidance',
  'centered',
  true,
  NOW() - INTERVAL '30 days',
  NOW()
),
-- Slide 2: Problem
(
  '00000000-0000-0000-0000-000000000091'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  2,
  'problem',
  'The Problem',
  'First-time founders are flying blind',
  '{"points": ["99% of startups fail", "6+ months wasted on wrong activities", "Accelerators help only 1% of startups", "100M+ aspiring entrepreneurs have no support"]}'::jsonb,
  'Pause after each point. Let it sink in.',
  'bullets',
  true,
  NOW() - INTERVAL '30 days',
  NOW()
),
-- Slide 3: Solution
(
  '00000000-0000-0000-0000-000000000092'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  3,
  'solution',
  'The Solution',
  'AI-powered guidance at every step',
  '{"features": ["24/7 Strategic Coaching", "Automated Workflows", "Investor-Ready Materials", "Smart Task Prioritization"]}'::jsonb,
  'Demo the product briefly if time permits',
  'split',
  true,
  NOW() - INTERVAL '30 days',
  NOW()
),
-- Slide 4: Product
(
  '00000000-0000-0000-0000-000000000093'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  4,
  'product',
  'How It Works',
  'Your startup command center',
  '{"demo_url": null, "screenshots": []}'::jsonb,
  'Show live demo: Onboarding → Dashboard → Pitch Deck',
  'demo',
  true,
  NOW() - INTERVAL '28 days',
  NOW()
),
-- Slide 5: Market
(
  '00000000-0000-0000-0000-000000000094'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  5,
  'market',
  'Market Opportunity',
  '$50B+ market for startup infrastructure',
  '{"tam": 50000000000, "sam": 5000000000, "som": 250000000, "growth_rate": 25}'::jsonb,
  'Emphasize the creator economy trend',
  'tam_sam_som',
  true,
  NOW() - INTERVAL '28 days',
  NOW()
),
-- Slide 6: Traction
(
  '00000000-0000-0000-0000-000000000095'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  6,
  'traction',
  'Traction',
  'Growing 22% month-over-month',
  '{"metrics": {"mrr": 8500, "users": 450, "customers": 85, "growth": 22}}'::jsonb,
  'Highlight the acceleration in last 3 months',
  'metrics',
  true,
  NOW() - INTERVAL '25 days',
  NOW()
),
-- Slide 7: Business Model
(
  '00000000-0000-0000-0000-000000000096'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  7,
  'business_model',
  'Business Model',
  'SaaS with expansion revenue',
  '{"pricing": [{"tier": "Starter", "price": 29}, {"tier": "Pro", "price": 99}, {"tier": "Enterprise", "price": "Custom"}]}'::jsonb,
  'Show unit economics: LTV/CAC ratio',
  'pricing_table',
  true,
  NOW() - INTERVAL '25 days',
  NOW()
),
-- Slide 8: Competition
(
  '00000000-0000-0000-0000-000000000097'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  8,
  'competition',
  'Why We Win',
  'Purpose-built for founders',
  '{"competitors": ["Notion", "Airtable", "Generic AI"], "differentiators": ["Startup-specific", "AI-native", "End-to-end"]}'::jsonb,
  'We are the first AI-native solution built specifically for founders',
  'comparison',
  true,
  NOW() - INTERVAL '22 days',
  NOW()
),
-- Slide 9: Team
(
  '00000000-0000-0000-0000-000000000098'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  9,
  'team',
  'The Team',
  'Serial entrepreneurs + AI experts',
  '{"members": [{"name": "Sanjiv Khullar", "role": "CEO", "background": "15+ years enterprise software"}]}'::jsonb,
  'Mention advisory board and key hires planned',
  'team_grid',
  true,
  NOW() - INTERVAL '22 days',
  NOW()
),
-- Slide 10: Roadmap
(
  '00000000-0000-0000-0000-000000000099'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  10,
  'custom',
  'Product Roadmap',
  '2026 and beyond',
  '{"milestones": [{"q": "Q1", "items": ["V2 Launch", "Enterprise pilot"]}, {"q": "Q2", "items": ["API Platform", "Integrations"]}]}'::jsonb,
  'Show we have clear vision and execution plan',
  'timeline',
  true,
  NOW() - INTERVAL '20 days',
  NOW()
),
-- Slide 11: Financials
(
  '00000000-0000-0000-0000-000000000100'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  11,
  'financials',
  'Financial Projections',
  'Path to $10M ARR',
  '{"projections": [{"year": 2026, "arr": 500000}, {"year": 2027, "arr": 2500000}, {"year": 2028, "arr": 10000000}]}'::jsonb,
  'Conservative assumptions, upside from enterprise',
  'chart',
  true,
  NOW() - INTERVAL '18 days',
  NOW()
),
-- Slide 12: Ask
(
  '00000000-0000-0000-0000-000000000101'::uuid,
  '00000000-0000-0000-0000-000000000086'::uuid,
  12,
  'ask',
  'The Ask',
  'Raising $1.5M Seed Round',
  '{"amount": 1500000, "use_of_funds": {"Engineering": 40, "Sales": 30, "AI Infra": 20, "Ops": 10}, "milestones": ["$500K ARR", "Enterprise pilot", "Series A ready"]}'::jsonb,
  'Close with clear next steps and timeline',
  'ask',
  true,
  NOW() - INTERVAL '15 days',
  NOW()
);

-- =============================================================================
-- END OF SEED: Pitch Decks (IDs 86-89) & Slides (90-101)
-- =============================================================================
