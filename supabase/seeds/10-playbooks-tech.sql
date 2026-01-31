-- ============================================================================
-- Seed: Industry Playbooks - Tech Sector
-- Contains: ai_saas, cybersecurity, sales_marketing_ai, crm_social_media
-- Run after: 04-industry-playbooks.sql (fintech)
-- ============================================================================

-- 1. AI SaaS / B2B
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, success_stories, benchmarks,
  terminology, gtm_patterns, decision_frameworks, investor_questions,
  warning_signs, stage_checklists, slide_emphasis,
  version, is_active, source
) VALUES (
  'ai_saas',
  'AI SaaS / B2B',
  'Workflow broken → AI automates it → proven ROI → massive market → defensible moat',
  '{
    "pre_seed": {
      "focus": ["Founder-market fit", "Clear workflow ownership", "Design partners with real usage"],
      "metrics": ["3-5 design partners using product weekly", "Clear before/after in time saved", "Waitlist or inbound interest"],
      "deal_breakers": ["We use AI without explaining where", "No domain expertise", "Solution looking for problem"]
    },
    "seed": {
      "focus": ["Early revenue or strong engagement", "Repeatable sales motion", "Data moat forming"],
      "metrics": ["$10-50K MRR", "15-20% MoM growth", "Net retention signal", "3+ paying customers"],
      "deal_breakers": ["No paying customers after 6+ months", "Usage drops after onboarding", "Horizontal positioning"]
    },
    "series_a": {
      "focus": ["Proven PMF", "Scalable GTM", "Clear path to $100M ARR"],
      "metrics": ["$50K+ MRR trending to $100K+", "NRR >120%", "CAC payback <18 months", "Logo retention >90%"],
      "deal_breakers": ["High churn", "No expansion revenue", "Founder-only sales"]
    }
  }'::jsonb,
  '[
    {"pattern": "AI Without Workflow Ownership", "why_fatal": "You become a feature, not a product. Workflow owner will add your feature.", "early_warning": "No standalone value without integration", "how_to_avoid": "Own the workflow end-to-end"},
    {"pattern": "Demo Wow Daily Meh", "why_fatal": "High churn. Customers leave when reality doesnt match", "early_warning": "Great demo-to-trial, poor trial-to-paid", "how_to_avoid": "Optimize for daily habit not demo wow"},
    {"pattern": "Horizontal Positioning", "why_fatal": "Compete with everyone. No differentiated story", "early_warning": "Website says AI for broad category", "how_to_avoid": "Pick one vertical or use case"},
    {"pattern": "Burning Cash Before PMF", "why_fatal": "Sales cant sell what doesnt stick", "early_warning": "Founder closes, reps cant", "how_to_avoid": "Founder sells first 20 customers"},
    {"pattern": "No Data Moat", "why_fatal": "No compounding advantage. Competitors catch up", "early_warning": "Model performance same for 10 vs 1000 users", "how_to_avoid": "Design for data collection from day one"}
  ]'::jsonb,
  '[
    {"archetype": "Vertical AI Wedge", "pattern": "One workflow for one buyer → expand to adjacent workflows", "outcome": "Net retention >150%. Competitors couldnt match depth"},
    {"archetype": "PLG to Enterprise", "pattern": "Free entry → usage grows → team adoption → enterprise deal", "outcome": "$0 CAC for initial adoption. 60% of enterprise deals started free"},
    {"archetype": "Workflow Replacement", "pattern": "Find 10-hour/week manual task → automate to 1 hour", "outcome": "3-week sales cycles. High expansion"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$10-50K", "great": ">$50K", "stage": "Seed"},
    {"metric": "MoM Growth", "good": "15-20%", "great": ">20%", "stage": "Seed"},
    {"metric": "Net Revenue Retention", "good": "100-120%", "great": ">120%", "stage": "Series A"},
    {"metric": "Logo Retention", "good": "85-90%", "great": ">90%", "stage": "Series A"},
    {"metric": "CAC Payback", "good": "<18 months", "great": "<12 months", "stage": "Series A"},
    {"metric": "DAU/MAU", "good": "30-40%", "great": ">50%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Workflow automation ROI", "Net retention above 130%", "Data flywheel", "Workflow lock-in", "Land and expand", "Replaces X hours of manual work", "Time to value under 48 hours"],
    "avoid_phrases": ["AI-powered platform", "Disruptive", "World-class team", "Huge market", "We use GPT-4", "No competitors", "First mover advantage"],
    "investor_vocabulary": ["ARR", "MRR", "ACV", "NRR", "GRR", "CAC", "LTV", "PLG", "PMF", "ICP", "Churn", "Cohort analysis"]
  }'::jsonb,
  '[
    {"name": "Product-Led Growth", "stages": ["Seed", "Series A"], "channels": ["SEO", "Product Hunt", "Community building", "Freemium referrals"], "best_for": "ACV <$5K, self-serve possible"},
    {"name": "Founder-Led Sales", "stages": ["Pre-Seed", "Seed"], "channels": ["Warm network", "Cold outreach", "LinkedIn", "Content"], "best_for": "ACV >$10K, complex product"},
    {"name": "Partner/Integration-Led", "stages": ["Seed", "Series A"], "channels": ["Marketplace listings", "Co-marketing", "Integration directories"], "best_for": "Products that enhance existing platforms"}
  ]'::jsonb,
  '[
    {"decision": "PLG vs Sales-Led", "if": "ACV <$5K and self-serve", "then": "Go PLG", "because": "Sales cost exceeds first-year revenue"},
    {"decision": "PLG vs Sales-Led", "if": "ACV >$25K and needs consensus", "then": "Go sales-led", "because": "Complex sales needs human touch"},
    {"decision": "Vertical vs Horizontal", "if": "You have deep domain expertise", "then": "Vertical first", "because": "Your advantage is domain knowledge"}
  ]'::jsonb,
  '[
    {"question": "What workflow do you replace?", "good_answer": "Finance teams spend 8 hours/week reconciling. We automate to 30 minutes.", "bad_answer": "We help companies with their data"},
    {"question": "Why is AI necessary here?", "good_answer": "Rules cant handle 40K categories. Our model learns each companys patterns.", "bad_answer": "AI makes everything better"},
    {"question": "Whats your net retention?", "good_answer": "125% at month 6. Expansion from seats +40% and modules +60%", "bad_answer": "We dont track that yet"}
  ]'::jsonb,
  '[
    {"signal": "DAU/MAU drops below 20%", "trigger": "Product isnt habit", "action": "Call active users. Fix for daily use case", "severity": "critical"},
    {"signal": "Customers need custom work to launch", "trigger": "Product isnt self-serve", "action": "Productize customization or narrow ICP", "severity": "warning"},
    {"signal": "Founder closes, AEs cant", "trigger": "No repeatable sales motion", "action": "Document founder sales. Ride along with AE", "severity": "critical"},
    {"signal": "NRR <100%", "trigger": "Churn exceeds expansion", "action": "Segment churn by reason. Fix #1 before scaling", "severity": "critical"}
  ]'::jsonb,
  '[
    {"stage": "pre_seed", "tasks": ["Sign 5 design partners", "Show before/after with real data", "Document ICP", "Build demo that sells"]},
    {"stage": "seed", "tasks": ["Get to $10-20K MRR", "Show 15%+ MoM growth", "Document sales playbook", "Get 3 referenceable logos"]},
    {"stage": "series_a", "tasks": ["Hit $50K+ MRR", "Prove NRR >110%", "Hire 1-2 AEs who can close", "Show cohort analysis"]}
  ]'::jsonb,
  '[
    {"slide": "Problem", "weight": "critical", "guidance": "Show manual workflow with cost/time data"},
    {"slide": "Solution", "weight": "critical", "guidance": "Demo the AI in action. Before/after"},
    {"slide": "Traction", "weight": "critical", "guidance": "MRR, growth rate, net retention. Graphs"},
    {"slide": "Competition", "weight": "important", "guidance": "2x2 matrix: automation level × vertical depth"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  success_stories = EXCLUDED.success_stories,
  benchmarks = EXCLUDED.benchmarks,
  terminology = EXCLUDED.terminology,
  gtm_patterns = EXCLUDED.gtm_patterns,
  decision_frameworks = EXCLUDED.decision_frameworks,
  investor_questions = EXCLUDED.investor_questions,
  warning_signs = EXCLUDED.warning_signs,
  stage_checklists = EXCLUDED.stage_checklists,
  slide_emphasis = EXCLUDED.slide_emphasis,
  updated_at = now();

-- 2. Cybersecurity
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, success_stories, benchmarks,
  terminology, gtm_patterns, decision_frameworks, investor_questions,
  warning_signs, stage_checklists, slide_emphasis,
  version, is_active, source
) VALUES (
  'cybersecurity',
  'Cybersecurity',
  'Threat landscape evolving → AI-powered detection → faster response → enterprise trust → critical infrastructure',
  '{
    "pre_seed": {
      "focus": ["Security domain expertise", "Novel threat detection approach", "Early enterprise interest"],
      "metrics": ["Team with security backgrounds", "Working prototype", "2-3 design partners"],
      "deal_breakers": ["No security expertise on team", "Me-too product", "Consumer focus without enterprise path"]
    },
    "seed": {
      "focus": ["Enterprise pilots", "Measurable threat reduction", "Compliance alignment"],
      "metrics": ["$50-100K ARR", "2-3 enterprise logos", "SOC 2 in progress"],
      "deal_breakers": ["No enterprise traction", "Security incident in own product", "Cant pass security review"]
    }
  }'::jsonb,
  '[
    {"pattern": "Feature Not Platform", "why_fatal": "Big vendors add your feature. No standalone value", "early_warning": "Only works with one SIEM/tool", "how_to_avoid": "Build platform or deep vertical"},
    {"pattern": "Alert Fatigue Addition", "why_fatal": "More alerts without context. SOC teams ignore", "early_warning": "High alert volume low action rate", "how_to_avoid": "Focus on actionable intelligence not alerts"},
    {"pattern": "Compliance Theater", "why_fatal": "Checks boxes but doesnt stop threats", "early_warning": "Customers buy for audit not security", "how_to_avoid": "Prove threat reduction metrics"}
  ]'::jsonb,
  '[
    {"archetype": "Threat Intelligence Platform", "pattern": "Novel data source → unique insights → platform expansion", "outcome": "Became standard for threat intel. High retention"},
    {"archetype": "Compliance Automation", "pattern": "Painful audit → automated evidence → continuous compliance", "outcome": "Land with compliance, expand to security"}
  ]'::jsonb,
  '[
    {"metric": "ARR", "good": "$100K-500K", "great": ">$500K", "stage": "Seed"},
    {"metric": "Enterprise Logos", "good": "3-5", "great": ">5", "stage": "Seed"},
    {"metric": "Net Retention", "good": "110-120%", "great": ">130%", "stage": "Series A"}
  ]'::jsonb,
  '{
    "use_phrases": ["Zero-day detection", "Mean time to detect", "Mean time to respond", "SOC 2 Type II", "Threat intelligence", "Attack surface", "Defense in depth"],
    "avoid_phrases": ["Unhackable", "100% secure", "Military-grade", "Blockchain security"],
    "investor_vocabulary": ["SIEM", "SOAR", "EDR", "XDR", "MDR", "CASB", "ZTNA", "CSPM"]
  }'::jsonb,
  '[
    {"name": "Enterprise Direct", "stages": ["Seed", "Series A"], "channels": ["CISO network", "Security conferences", "Analyst relations"], "best_for": "Complex enterprise security"},
    {"name": "Channel Partners", "stages": ["Series A"], "channels": ["MSSPs", "VARs", "System integrators"], "best_for": "Broad market reach"}
  ]'::jsonb,
  '[
    {"decision": "Platform vs Point Solution", "if": "Single use case with clear ROI", "then": "Start point solution", "because": "Faster sales, clearer value prop"},
    {"decision": "Enterprise vs SMB", "if": "Complex deployment needs", "then": "Enterprise first", "because": "SMB cant support deployment"}
  ]'::jsonb,
  '[
    {"question": "Why wont CrowdStrike/Palo Alto build this?", "good_answer": "They focus on endpoint. We own cloud workload security with 15 cloud-native integrations", "bad_answer": "We move faster"}
  ]'::jsonb,
  '[
    {"signal": "Security incident in own product", "trigger": "Credibility destroyed", "action": "Full disclosure, remediation, third-party audit", "severity": "critical"},
    {"signal": "Cant pass customer security review", "trigger": "Blocked sales", "action": "Fast-track SOC 2, hire security engineer", "severity": "critical"}
  ]'::jsonb,
  '[
    {"stage": "pre_seed", "tasks": ["Recruit security talent", "Build working threat detection", "Get 2-3 CISOs as advisors"]},
    {"stage": "seed", "tasks": ["Land 3 enterprise pilots", "Start SOC 2 certification", "Show measurable threat reduction"]}
  ]'::jsonb,
  '[
    {"slide": "Problem", "weight": "critical", "guidance": "Show specific threat landscape and cost of breaches"},
    {"slide": "Technology", "weight": "critical", "guidance": "Explain detection approach without revealing IP"},
    {"slide": "Team", "weight": "critical", "guidance": "Security credentials are table stakes"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  terminology = EXCLUDED.terminology,
  updated_at = now();

-- 3. Sales & Marketing AI
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'sales_marketing_ai',
  'Sales & Marketing AI',
  'Revenue teams overwhelmed → AI automates outreach/analysis → measurable pipeline impact → GTM transformation',
  '{
    "pre_seed": {
      "focus": ["Clear GTM use case", "Measurable pipeline impact", "Integration with existing stack"],
      "metrics": ["Working product", "3-5 design partners", "Clear before/after metrics"]
    },
    "seed": {
      "focus": ["Pipeline attribution", "Repeatable ROI story", "CRM/MAP integration"],
      "metrics": ["$20-50K MRR", "10+ paying customers", "Clear ROI per customer"]
    }
  }'::jsonb,
  '[
    {"pattern": "Generic AI Wrapper", "why_fatal": "ChatGPT plugin replaces you", "early_warning": "Value is just AI access not workflow", "how_to_avoid": "Own specific workflow end-to-end"},
    {"pattern": "No CRM Integration", "why_fatal": "Sales wont use tool outside their stack", "early_warning": "Manual data entry required", "how_to_avoid": "Native Salesforce/HubSpot integration from day 1"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$20-50K", "great": ">$50K", "stage": "Seed"},
    {"metric": "Pipeline Influenced", "good": "2x investment", "great": ">5x investment", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Pipeline velocity", "Conversion rate lift", "Rep productivity", "Time to first meeting", "Signal-based selling"],
    "avoid_phrases": ["AI SDR", "Replaces your sales team", "Spray and pray at scale"],
    "investor_vocabulary": ["ABM", "Intent data", "Buying signals", "Engagement scoring", "MAP", "CRM"]
  }'::jsonb,
  '[
    {"name": "PLG for Sales Tools", "stages": ["Seed"], "channels": ["Free tier for individuals", "LinkedIn content", "Sales communities"], "best_for": "Individual rep adoption"},
    {"name": "Integration Marketplace", "stages": ["Seed", "Series A"], "channels": ["Salesforce AppExchange", "HubSpot Marketplace"], "best_for": "Enterprise distribution"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 4. CRM & Social Media AI
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'crm_social_media',
  'CRM & Social Media AI',
  'Customer data fragmented → AI unifies insights → personalized engagement → relationship intelligence',
  '{
    "pre_seed": {
      "focus": ["Unique data angle", "Clear integration path", "Measurable engagement lift"],
      "metrics": ["Working integration", "3-5 design partners", "Engagement improvement data"]
    },
    "seed": {
      "focus": ["Platform partnerships", "Retention metrics", "Expansion within accounts"],
      "metrics": ["$15-40K MRR", "Native integrations live", "Clear retention data"]
    }
  }'::jsonb,
  '[
    {"pattern": "Platform Dependency", "why_fatal": "API changes break product overnight", "early_warning": "Single platform integration", "how_to_avoid": "Multi-platform from start, own data layer"},
    {"pattern": "Privacy Violations", "why_fatal": "One incident destroys trust", "early_warning": "Using personal data without clear consent", "how_to_avoid": "Privacy-first architecture, clear consent flows"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$15-40K", "great": ">$40K", "stage": "Seed"},
    {"metric": "Engagement Lift", "good": "20-30%", "great": ">50%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Relationship intelligence", "Engagement scoring", "Social listening", "Sentiment analysis", "Customer 360"],
    "avoid_phrases": ["Creepy accurate", "We know everything about customers", "Scraping social data"],
    "investor_vocabulary": ["CDP", "Social CRM", "Unified profile", "Cross-channel", "Attribution"]
  }'::jsonb,
  '[
    {"name": "CRM Marketplace", "stages": ["Seed"], "channels": ["Salesforce AppExchange", "HubSpot", "Zoho Marketplace"], "best_for": "Distribution through existing CRM users"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();
