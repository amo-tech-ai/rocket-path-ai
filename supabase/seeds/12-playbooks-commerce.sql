-- ============================================================================
-- Seed: Industry Playbooks - Commerce Sector
-- Contains: retail_ecommerce, ecommerce_pure, fashion_apparel
-- ============================================================================

-- 1. Retail & eCommerce
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns, warning_signs, stage_checklists,
  version, is_active, source
) VALUES (
  'retail_ecommerce',
  'Retail & eCommerce',
  'Omnichannel complexity → unified commerce → personalization → loyalty → market expansion',
  '{
    "pre_seed": {
      "focus": ["Clear pain point in commerce stack", "Merchant relationships", "Measurable efficiency gains"],
      "metrics": ["3-5 merchant pilots", "Clear before/after metrics", "Integration with major platforms"],
      "deal_breakers": ["No merchant relationships", "Consumer-only focus", "Single platform dependency"]
    },
    "seed": {
      "focus": ["GMV or revenue influenced", "Platform integrations", "Retention metrics"],
      "metrics": ["$20-50K MRR", "Top platform integrations", "Clear ROI per merchant"],
      "deal_breakers": ["Cant prove ROI", "No Shopify/BigCommerce integration", "High churn"]
    }
  }'::jsonb,
  '[
    {"pattern": "Platform Dependency", "why_fatal": "Shopify changes API or builds your feature", "early_warning": "Only works on one platform", "how_to_avoid": "Multi-platform from start. Own the data layer"},
    {"pattern": "Race to Bottom on Price", "why_fatal": "Commoditized. Margins disappear", "early_warning": "Competing on price not value", "how_to_avoid": "Differentiate on outcomes not features"},
    {"pattern": "SMB Churn Treadmill", "why_fatal": "High acquisition cost low retention", "early_warning": "30%+ annual churn", "how_to_avoid": "Move upmarket or build stickier product"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$20-50K", "great": ">$50K", "stage": "Seed"},
    {"metric": "Net Retention", "good": "90-100%", "great": ">110%", "stage": "Seed"},
    {"metric": "Merchants", "good": "50-100", "great": ">200", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["GMV influenced", "Conversion rate lift", "AOV increase", "Cart abandonment reduction", "Omnichannel", "Unified commerce"],
    "avoid_phrases": ["Amazon killer", "Shopify replacement", "One-stop shop for everything"],
    "investor_vocabulary": ["GMV", "AOV", "Conversion rate", "ROAS", "LTV/CAC", "Churn", "Cohort"]
  }'::jsonb,
  '[
    {"name": "App Store/Marketplace", "stages": ["Seed"], "channels": ["Shopify App Store", "BigCommerce Marketplace", "WooCommerce"], "best_for": "SMB distribution"},
    {"name": "Agency Partners", "stages": ["Seed", "Series A"], "channels": ["Shopify Plus partners", "Implementation agencies"], "best_for": "Enterprise merchants"}
  ]'::jsonb,
  '[
    {"signal": "Platform launches competing feature", "trigger": "Existential threat", "action": "Differentiate or pivot. Multi-platform urgently", "severity": "critical"},
    {"signal": "Churn >3% monthly", "trigger": "Business model broken", "action": "Customer research. Fix top churn reason or move upmarket", "severity": "critical"}
  ]'::jsonb,
  '[
    {"stage": "pre_seed", "tasks": ["Build on Shopify first", "Get 5 merchant pilots", "Prove clear ROI metric"]},
    {"stage": "seed", "tasks": ["Launch on 2+ platforms", "Reach 50+ merchants", "Document ROI by segment"]}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 2. eCommerce (Pure-Play)
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'ecommerce_pure',
  'eCommerce (Pure-Play)',
  'Niche market gap → curated experience → brand loyalty → category expansion → market leadership',
  '{
    "pre_seed": {
      "focus": ["Clear niche differentiation", "Supply chain strategy", "Early traction"],
      "metrics": ["$10-30K monthly revenue", "Repeat customer rate", "Clear path to margin"],
      "deal_breakers": ["No differentiation from Amazon", "Negative unit economics", "No path to brand"]
    },
    "seed": {
      "focus": ["Proven unit economics", "Repeat purchase behavior", "Brand recognition"],
      "metrics": ["$50-100K monthly revenue", "30%+ repeat rate", "Positive contribution margin"],
      "deal_breakers": ["Dependent on paid ads", "Commoditized product", "No defensible brand"]
    }
  }'::jsonb,
  '[
    {"pattern": "CAC Death Spiral", "why_fatal": "Paid acquisition costs grow faster than LTV", "early_warning": "CAC payback >12 months", "how_to_avoid": "Build organic channels and repeat purchase behavior"},
    {"pattern": "Margin Squeeze", "why_fatal": "Shipping and returns eat margin", "early_warning": "Negative contribution margin after fulfillment", "how_to_avoid": "Know true unit economics including returns"},
    {"pattern": "Amazon Competition", "why_fatal": "Amazon launches similar product at lower price", "early_warning": "Selling commodity products", "how_to_avoid": "Build brand and community Amazon cant replicate"}
  ]'::jsonb,
  '[
    {"metric": "Monthly Revenue", "good": "$50-100K", "great": ">$100K", "stage": "Seed"},
    {"metric": "Repeat Purchase Rate", "good": "25-35%", "great": ">40%", "stage": "Seed"},
    {"metric": "Contribution Margin", "good": "30-40%", "great": ">50%", "stage": "Seed"},
    {"metric": "CAC Payback", "good": "<6 months", "great": "<3 months", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Contribution margin", "Repeat purchase rate", "Customer lifetime value", "Organic acquisition", "Brand moat", "Community-driven"],
    "avoid_phrases": ["Like Amazon but", "Cheaper than", "Well outspend competition"],
    "investor_vocabulary": ["AOV", "LTV", "CAC", "Contribution margin", "Repeat rate", "Cohort", "Channel mix"]
  }'::jsonb,
  '[
    {"name": "Content/Community", "stages": ["Pre-Seed", "Seed"], "channels": ["Instagram", "TikTok", "YouTube", "Email"], "best_for": "Building organic audience"},
    {"name": "Influencer/Creator", "stages": ["Seed"], "channels": ["Creator partnerships", "Affiliate programs"], "best_for": "Reaching niche audiences"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 3. Fashion & Apparel AI
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns, warning_signs,
  version, is_active, source
) VALUES (
  'fashion_apparel',
  'Fashion & Apparel AI',
  'Fast fashion waste → AI-powered design/inventory → sustainable production → trend prediction → industry transformation',
  '{
    "pre_seed": {
      "focus": ["Fashion industry expertise", "Clear AI application", "Brand or retailer relationships"],
      "metrics": ["Team with fashion background", "Working prototype", "2-3 brand pilots"],
      "deal_breakers": ["No fashion expertise", "Solution without industry validation", "Pure tech approach"]
    },
    "seed": {
      "focus": ["Measurable impact", "Pilot results", "Category focus"],
      "metrics": ["$30-60K MRR", "3-5 brand customers", "Clear ROI metrics"],
      "deal_breakers": ["Cant prove ROI", "No brand relationships", "Horizontal positioning"]
    }
  }'::jsonb,
  '[
    {"pattern": "Tech First Fashion Second", "why_fatal": "Fashion is relationship-driven. Tech alone doesnt sell", "early_warning": "No fashion industry people on team", "how_to_avoid": "Hire fashion industry veterans"},
    {"pattern": "Trend Prediction Without Action", "why_fatal": "Insights dont sell. Outcomes do", "early_warning": "Dashboard without workflow", "how_to_avoid": "Connect prediction to action (buy, design, produce)"},
    {"pattern": "Ignoring Supply Chain Complexity", "why_fatal": "Fashion supply chains are global and complex", "early_warning": "Product requires supply chain changes", "how_to_avoid": "Work within existing supply chain first"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$30-60K", "great": ">$60K", "stage": "Seed"},
    {"metric": "Brand Logos", "good": "3-5", "great": ">5", "stage": "Seed"},
    {"metric": "Inventory Reduction", "good": "10-20%", "great": ">20%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Sell-through rate", "Markdown reduction", "Inventory optimization", "Trend prediction accuracy", "Design efficiency", "Sustainable fashion"],
    "avoid_phrases": ["AI fashion designer", "Replace human creativity", "Fast fashion at scale"],
    "investor_vocabulary": ["SKU", "Sell-through", "Markdown", "Lead time", "MOQ", "Assortment", "Open-to-buy"]
  }'::jsonb,
  '[
    {"name": "Industry Events", "stages": ["Seed"], "channels": ["Fashion weeks", "Trade shows", "Industry conferences"], "best_for": "Building brand relationships"},
    {"name": "Supply Chain Partners", "stages": ["Seed", "Series A"], "channels": ["PLM vendors", "ERP systems", "Sourcing platforms"], "best_for": "Distribution through existing tech stack"}
  ]'::jsonb,
  '[
    {"signal": "Pilot doesnt convert to paid", "trigger": "ROI not proven or sponsor left", "action": "Exit interview with every lost pilot. Fix top objection", "severity": "warning"},
    {"signal": "Fashion cycles move faster than product", "trigger": "Product cant keep up with trend speed", "action": "Reduce time to value. Real-time over batch", "severity": "critical"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();
