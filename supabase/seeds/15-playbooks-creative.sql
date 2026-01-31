-- ============================================================================
-- Seed: Industry Playbooks - Creative Sector
-- Contains: photography_production, video_production, content_marketing, social_media_marketing
-- ============================================================================

-- 1. Photography & Visual Production AI
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'photography_production',
  'Photography & Visual Production AI',
  'Visual content bottleneck → AI generation/editing → faster production → brand consistency → creative transformation',
  '{
    "pre_seed": {
      "focus": ["Creative industry expertise", "Clear workflow improvement", "Quality that professionals accept"],
      "metrics": ["Creative background on team", "3-5 brand pilots", "Side-by-side quality comparison"],
      "deal_breakers": ["Output quality not professional grade", "No creative industry relationships", "Replacing photographers not helping them"]
    },
    "seed": {
      "focus": ["Brand adoption", "Volume metrics", "Quality consistency"],
      "metrics": ["$20-50K MRR", "1M+ images processed", "Quality approval rate >90%"],
      "deal_breakers": ["Quality inconsistency", "Cant handle brand guidelines", "No enterprise security"]
    }
  }'::jsonb,
  '[
    {"pattern": "Consumer Quality Enterprise Price", "why_fatal": "Enterprise wont pay for consumer-grade output", "early_warning": "Enterprise prospects need too many revisions", "how_to_avoid": "Build for enterprise quality first. Consumer can be easier tier"},
    {"pattern": "Creative Replacement Positioning", "why_fatal": "Creatives will sabotage adoption", "early_warning": "Marketing says replace photographer", "how_to_avoid": "Position as creative productivity tool. Augment not replace"},
    {"pattern": "No Brand Consistency", "why_fatal": "Brands need consistent visual identity. Random output fails", "early_warning": "Each output looks different", "how_to_avoid": "Build brand style learning. Consistent output per brand"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$20-50K", "great": ">$50K", "stage": "Seed"},
    {"metric": "Images Processed/Month", "good": "500K-1M", "great": ">5M", "stage": "Seed"},
    {"metric": "Quality Approval Rate", "good": "85-90%", "great": ">95%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Creative productivity", "Brand consistency", "Visual quality", "Production efficiency", "Asset generation", "Creative workflow"],
    "avoid_phrases": ["Replace photographers", "AI does it better", "No humans needed", "Unlimited images"],
    "investor_vocabulary": ["DAM", "Asset management", "Creative ops", "Brand guidelines", "Production workflow", "Creative brief"]
  }'::jsonb,
  '[
    {"name": "Creative Agency", "stages": ["Seed"], "channels": ["Agency partnerships", "Creative director network", "Industry conferences"], "best_for": "Volume through agencies"},
    {"name": "Brand Direct", "stages": ["Seed", "Series A"], "channels": ["Marketing/creative ops", "DAM integrations"], "best_for": "Enterprise brand accounts"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 2. Video Production AI
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'video_production',
  'Video Production AI',
  'Video production expensive → AI automation → faster turnaround → accessible video → content explosion',
  '{
    "pre_seed": {
      "focus": ["Video industry expertise", "Clear efficiency gain", "Quality at speed"],
      "metrics": ["Video background on team", "3-5 brand pilots", "Clear time savings"],
      "deal_breakers": ["Output not broadcast quality", "No video expertise", "Consumer only"]
    },
    "seed": {
      "focus": ["Volume and retention", "Enterprise security", "Workflow integration"],
      "metrics": ["$30-60K MRR", "1000+ videos processed/month", "Clear ROI per customer"],
      "deal_breakers": ["Quality inconsistency", "Cant handle branded content", "No enterprise features"]
    }
  }'::jsonb,
  '[
    {"pattern": "Demo Reel Not Production Ready", "why_fatal": "Demo videos look great but production fails at scale", "early_warning": "Cant reproduce demo quality consistently", "how_to_avoid": "Build for consistency at volume. Demo should be normal output"},
    {"pattern": "Ignoring Audio", "why_fatal": "Bad audio ruins video. Most AI focuses on visual", "early_warning": "Audio quality not addressed", "how_to_avoid": "Audio quality equal to video. Voice, music, sound design"},
    {"pattern": "No Revision Workflow", "why_fatal": "Video always needs revisions. Linear output fails", "early_warning": "Cant make targeted changes without full redo", "how_to_avoid": "Build for iterative editing. Scene-level changes"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$30-60K", "great": ">$80K", "stage": "Seed"},
    {"metric": "Videos Processed/Month", "good": "500-1000", "great": ">2000", "stage": "Seed"},
    {"metric": "Production Time Reduction", "good": "50%", "great": ">75%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Production efficiency", "Time to publish", "Video at scale", "Broadcast quality", "Content velocity", "Video workflow"],
    "avoid_phrases": ["Replace video editors", "AI director", "No human needed", "Hollywood quality"],
    "investor_vocabulary": ["Post-production", "Color grading", "NLE", "Render time", "Broadcast spec", "Content pipeline"]
  }'::jsonb,
  '[
    {"name": "Post-Production Services", "stages": ["Seed"], "channels": ["Post houses", "Production companies", "Broadcast networks"], "best_for": "Volume at scale"},
    {"name": "Brand Content Teams", "stages": ["Seed", "Series A"], "channels": ["In-house video teams", "Marketing ops", "Social media teams"], "best_for": "Recurring enterprise accounts"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 3. Content Marketing AI
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'content_marketing',
  'Content Marketing AI',
  'Content demand outpaces creation → AI generation → quality at scale → SEO/engagement wins → marketing transformation',
  '{
    "pre_seed": {
      "focus": ["Content marketing expertise", "Quality that passes editorial", "Clear workflow fit"],
      "metrics": ["Marketing background on team", "5-10 brand pilots", "Content that publishes without heavy editing"],
      "deal_breakers": ["Quality not publishable", "No content marketing expertise", "Generic AI wrapper"]
    },
    "seed": {
      "focus": ["SEO/engagement results", "Enterprise adoption", "Workflow integration"],
      "metrics": ["$30-60K MRR", "Content driving measurable results", "Integration with CMS/marketing stack"],
      "deal_breakers": ["Cant prove content performance", "No enterprise security", "Commodity positioning"]
    }
  }'::jsonb,
  '[
    {"pattern": "ChatGPT Wrapper", "why_fatal": "No defensibility. ChatGPT adds features you built", "early_warning": "Value is just prompt engineering", "how_to_avoid": "Own the workflow. Brand voice, SEO, publishing, analytics"},
    {"pattern": "Quality Quantity Tradeoff", "why_fatal": "More content but lower quality hurts brand", "early_warning": "Heavy editing required for all output", "how_to_avoid": "Quality metrics first. Quantity is secondary"},
    {"pattern": "SEO Spam Factory", "why_fatal": "Google updates kill traffic. Brand reputation damaged", "early_warning": "Focused only on keyword volume", "how_to_avoid": "Build for quality signals. Engagement not just traffic"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$30-60K", "great": ">$80K", "stage": "Seed"},
    {"metric": "Content Pieces/Customer/Month", "good": "20-50", "great": ">100", "stage": "Seed"},
    {"metric": "SEO Traffic Lift", "good": "20-50%", "great": ">100%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Content velocity", "Brand voice", "Editorial quality", "SEO performance", "Content workflow", "Publishing efficiency"],
    "avoid_phrases": ["Unlimited content", "Replace writers", "AI blog factory", "10x content"],
    "investor_vocabulary": ["CMS", "SEO", "Content marketing", "Editorial calendar", "Brand voice", "Content ops"]
  }'::jsonb,
  '[
    {"name": "Marketing Team Direct", "stages": ["Seed"], "channels": ["Content marketing teams", "SEO/growth teams", "Marketing ops"], "best_for": "Enterprise content teams"},
    {"name": "Agency Partners", "stages": ["Seed"], "channels": ["Content agencies", "SEO agencies", "Marketing agencies"], "best_for": "Volume through agencies"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 4. Social Media Marketing AI
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'social_media_marketing',
  'Social Media Marketing AI',
  'Social media overwhelming → AI scheduling/creation → engagement at scale → community growth → brand presence',
  '{
    "pre_seed": {
      "focus": ["Social media expertise", "Platform API relationships", "Clear engagement improvement"],
      "metrics": ["Social media background on team", "5-10 brand pilots", "Measurable engagement lift"],
      "deal_breakers": ["No social media expertise", "Single platform dependency", "Spam detection risk"]
    },
    "seed": {
      "focus": ["Multi-platform support", "Enterprise security", "Measurable ROI"],
      "metrics": ["$25-50K MRR", "Major platform integrations", "Clear engagement/growth metrics"],
      "deal_breakers": ["Platform API risk", "Cant prove ROI", "No differentiation from free tools"]
    }
  }'::jsonb,
  '[
    {"pattern": "Platform API Dependency", "why_fatal": "Meta/X changes API and breaks product", "early_warning": "Only works on one platform", "how_to_avoid": "Multi-platform from start. Build value beyond API access"},
    {"pattern": "Engagement Farming", "why_fatal": "Platforms detect and penalize. Brand reputation damaged", "early_warning": "Growth tactics over genuine engagement", "how_to_avoid": "Focus on authentic engagement. Quality over quantity"},
    {"pattern": "Commoditized Scheduling", "why_fatal": "Buffer, Hootsuite, Later are good enough and free/cheap", "early_warning": "Only feature is scheduling", "how_to_avoid": "Differentiate on AI generation, analytics, or specific use case"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$25-50K", "great": ">$60K", "stage": "Seed"},
    {"metric": "Brands Managed", "good": "100-300", "great": ">500", "stage": "Seed"},
    {"metric": "Engagement Rate Lift", "good": "20-50%", "great": ">100%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Social engagement", "Community growth", "Content performance", "Platform native", "Social analytics", "Audience insights"],
    "avoid_phrases": ["Go viral", "Guaranteed followers", "Influencer replacement", "Social media on autopilot"],
    "investor_vocabulary": ["Engagement rate", "Reach", "Impressions", "Social listening", "Community management", "UGC"]
  }'::jsonb,
  '[
    {"name": "Agency Partners", "stages": ["Seed"], "channels": ["Social media agencies", "Marketing agencies", "SMB resellers"], "best_for": "Volume through agencies"},
    {"name": "Brand Direct", "stages": ["Seed", "Series A"], "channels": ["Social media teams", "Marketing ops", "Brand marketing"], "best_for": "Enterprise accounts"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();
