-- =============================================================================
-- Seed: Industry Packs
-- Purpose: Seed 13 industry packs with rich AI context for Smart Interviewer
-- Real-world scenarios: Each pack includes terminology, benchmarks, advisor persona,
--   market context, success stories, common mistakes, and investor expectations
-- =============================================================================

-- Clear existing data (for idempotency)
-- Using DELETE instead of TRUNCATE because industry_questions references this table
delete from public.industry_questions;
delete from public.industry_packs;

-- =============================================================================
-- Insert Industry Packs (13 Industries)
-- =============================================================================

insert into public.industry_packs (
  id,
  industry,
  display_name,
  description,
  icon,
  advisor_persona,
  advisor_system_prompt,
  terminology,
  benchmarks,
  competitive_intel,
  mental_models,
  diagnostics,
  market_context,
  success_stories,
  common_mistakes,
  investor_expectations,
  startup_types,
  question_intro,
  is_active,
  version,
  created_at,
  updated_at
) values

-- =============================================================================
-- 1. AI SaaS
-- =============================================================================
(
  '11111111-1111-1111-1111-111111111111'::uuid,
  'ai_saas',
  'AI SaaS',
  'Software-as-a-Service products powered by artificial intelligence and machine learning',
  'brain',
  'You are a seasoned AI startup advisor who has helped build and scale multiple AI companies. You''ve seen the hype cycles and know what separates successful AI products from demos that never ship. You push founders to think about data moats, model defensibility, and the gap between AI capability and product-market fit.',
  'You are an expert AI SaaS advisor. When reviewing founder responses:
- Challenge vague claims about "using AI" - ask what specific AI/ML technique and why
- Push for evidence of data advantage or unique training data
- Question the gap between demo accuracy and production reliability
- Emphasize the importance of human-in-the-loop for early products
- Watch for over-reliance on foundation models without differentiation
- Ask about compute costs and unit economics at scale',
  '[
    {"term": "LLM", "definition": "Large Language Model - foundation models like GPT-4 that can understand and generate text"},
    {"term": "RAG", "definition": "Retrieval-Augmented Generation - combining search with LLMs for grounded responses"},
    {"term": "Fine-tuning", "definition": "Customizing a pre-trained model on specific domain data"},
    {"term": "Inference cost", "definition": "The compute cost of running your model per prediction/request"},
    {"term": "Data moat", "definition": "Competitive advantage from proprietary training or user-generated data"},
    {"term": "Hallucination", "definition": "When AI generates plausible but incorrect or fabricated information"},
    {"term": "Prompt engineering", "definition": "Designing inputs to get optimal outputs from language models"},
    {"term": "Context window", "definition": "The amount of text an LLM can process at once"}
  ]'::jsonb,
  '[
    {"metric": "Gross Margin", "seed": "70-80%", "series_a": "75-85%", "why_matters": "AI compute costs can destroy margins if not managed"},
    {"metric": "Logo Retention", "seed": "85%+", "series_a": "90%+", "why_matters": "AI products that don''t deliver value churn fast"},
    {"metric": "NRR", "seed": "100%+", "series_a": "110%+", "why_matters": "Shows AI is becoming more valuable over time"},
    {"metric": "Inference cost per user", "seed": "<$1/mo", "series_a": "<$0.50/mo", "why_matters": "Must decrease as you scale"}
  ]'::jsonb,
  '{
    "top_players": ["OpenAI", "Anthropic", "Google DeepMind", "Microsoft Copilot"],
    "emerging_threats": ["Open-source models catching up", "Big tech bundling AI free"],
    "acquisition_targets": ["Vertical AI applications with data moats", "Infrastructure tooling"]
  }'::jsonb,
  '[
    {"model": "Wrapper vs. Platform", "description": "Are you building a thin wrapper on GPT or a true platform with data/model advantage?"},
    {"model": "AI-First vs. AI-Enhanced", "description": "Is AI the core product or a feature on existing workflow?"},
    {"model": "Horizontal vs. Vertical", "description": "General-purpose AI tool or deep industry-specific solution?"}
  ]'::jsonb,
  '[
    {"question": "What happens when GPT-5 comes out?", "why_matters": "Tests if you have defensibility beyond current foundation models"},
    {"question": "Show me a failure case", "why_matters": "Demonstrates understanding of AI limitations and edge cases"}
  ]'::jsonb,
  '{
    "tam_global": "$500B+ by 2027",
    "growth_rate": "35% CAGR",
    "key_trends": ["Agents replacing copilots", "Multi-modal becoming standard", "Enterprise AI governance", "Vertical AI outperforming horizontal"]
  }'::jsonb,
  '[
    {"company": "Jasper AI", "outcome": "Reached $75M ARR in 2 years", "lesson": "Move fast on emerging tech, vertical focus on marketing"},
    {"company": "Harvey AI", "outcome": "$80M Series B at $715M valuation", "lesson": "Deep vertical (legal) with strong enterprise sales"},
    {"company": "Notion AI", "outcome": "Millions of users, pricing power", "lesson": "AI as feature in beloved existing product"}
  ]'::jsonb,
  '[
    {"mistake": "Building a ChatGPT wrapper without differentiation", "why_bad": "Zero moat when OpenAI adds your feature", "better_approach": "Focus on unique data, workflow integration, or domain expertise"},
    {"mistake": "Ignoring inference costs in pricing", "why_bad": "Gross margins collapse at scale", "better_approach": "Build cost modeling from day 1, optimize prompts, consider tiered compute"},
    {"mistake": "Overselling AI capabilities", "why_bad": "Users discover limitations, churn increases", "better_approach": "Be honest about what AI can/cannot do, set expectations"}
  ]'::jsonb,
  '{
    "key_metrics": ["Gross margin trend", "Inference cost per user", "Model accuracy vs. baseline", "Time to value for users"],
    "red_flags": ["<60% gross margin", "100% dependent on OpenAI", "No unique data strategy", "Solving problem AI does poorly"],
    "green_flags": ["Proprietary data advantage", "Improving margins at scale", "Clear human-AI workflow", "Users would revolt if AI removed"]
  }'::jsonb,
  '[
    {"type": "CRM AI", "description": "AI-powered customer relationship management"},
    {"type": "Marketing AI", "description": "Content generation, campaign optimization"},
    {"type": "Sales AI", "description": "Lead scoring, outreach automation, forecasting"},
    {"type": "Analytics AI", "description": "Business intelligence, data analysis"},
    {"type": "Support AI", "description": "Customer service automation, ticket routing"},
    {"type": "HR AI", "description": "Recruiting, employee engagement, performance"}
  ]'::jsonb,
  'Let''s explore your AI SaaS idea. I''ll ask questions that help you think through the hard parts - from data moats to unit economics. The goal is to stress-test your assumptions so you can build something defensible.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 2. FinTech
-- =============================================================================
(
  '22222222-2222-2222-2222-222222222222'::uuid,
  'fintech',
  'FinTech',
  'Financial technology products including payments, lending, banking, and investment platforms',
  'wallet',
  'You are a FinTech veteran who has built products at companies like Stripe, Square, and major banks. You understand the regulatory landscape, the complexity of money movement, and the trust required to handle people''s finances. You push founders to think about compliance from day one.',
  'You are an expert FinTech advisor. When reviewing founder responses:
- Always ask about regulatory strategy and licensing requirements
- Push for understanding of payment rails, settlement times, and compliance
- Question unit economics including interchange, fraud losses, and chargebacks
- Emphasize trust and security as table stakes
- Challenge assumptions about bank partnerships and API access
- Watch for underestimating compliance costs and time',
  '[
    {"term": "PCI-DSS", "definition": "Payment Card Industry Data Security Standard - required for handling card data"},
    {"term": "KYC/AML", "definition": "Know Your Customer / Anti-Money Laundering compliance requirements"},
    {"term": "Interchange", "definition": "Fees paid between banks for processing card transactions"},
    {"term": "Money Transmission License", "definition": "State-level licenses required to move money"},
    {"term": "ACH", "definition": "Automated Clearing House - US bank-to-bank transfer system"},
    {"term": "Sponsor bank", "definition": "Licensed bank that enables FinTech to offer banking services"},
    {"term": "Take rate", "definition": "Percentage of transaction value captured as revenue"},
    {"term": "Float", "definition": "Interest earned on money held between transactions"}
  ]'::jsonb,
  '[
    {"metric": "Take rate", "seed": "1-3%", "series_a": "0.5-2%", "why_matters": "Shows pricing power and market position"},
    {"metric": "CAC payback", "seed": "<18 months", "series_a": "<12 months", "why_matters": "Long payback kills FinTech unit economics"},
    {"metric": "Fraud rate", "seed": "<0.5%", "series_a": "<0.2%", "why_matters": "Fraud destroys margins and reputation"},
    {"metric": "Net Revenue Retention", "seed": "100%+", "series_a": "120%+", "why_matters": "FinTech products should grow with customers"}
  ]'::jsonb,
  '{
    "top_players": ["Stripe", "Square", "Plaid", "Chime", "Robinhood"],
    "emerging_threats": ["Embedded finance in non-FinTech apps", "BigTech entering payments"],
    "acquisition_targets": ["Compliance tech", "Vertical-specific payment solutions"]
  }'::jsonb,
  '[
    {"model": "Platform vs. Rails", "description": "Are you building a platform for others or the infrastructure itself?"},
    {"model": "B2B vs. B2C", "description": "Selling to businesses has different economics than consumers"},
    {"model": "Regulated vs. Enabling", "description": "Are you the licensed entity or enabling others to use licenses?"}
  ]'::jsonb,
  '[
    {"question": "Walk me through your compliance roadmap", "why_matters": "Tests regulatory sophistication"},
    {"question": "What happens when a transaction fails?", "why_matters": "Shows understanding of edge cases and customer impact"}
  ]'::jsonb,
  '{
    "tam_global": "$300B by 2027",
    "growth_rate": "25% CAGR",
    "key_trends": ["Embedded finance everywhere", "Real-time payments", "Open banking", "Crypto/stablecoin integration"]
  }'::jsonb,
  '[
    {"company": "Stripe", "outcome": "$95B valuation, 7-8% of internet payments", "lesson": "Developer experience can win against incumbents"},
    {"company": "Plaid", "outcome": "$13.4B valuation, connected 1 in 4 US bank accounts", "lesson": "Infrastructure layer becomes essential"},
    {"company": "Mercury", "outcome": "$1.6B valuation, $50B+ in transactions", "lesson": "Vertical focus (startups) with excellent UX"}
  ]'::jsonb,
  '[
    {"mistake": "Underestimating compliance timeline", "why_bad": "Launches delayed by 12-18 months, burns runway", "better_approach": "Start compliance workstreams in parallel with product"},
    {"mistake": "Ignoring fraud from day one", "why_bad": "Fraud losses can exceed revenue in early days", "better_approach": "Build fraud detection into v1, accept higher false positives"},
    {"mistake": "Assuming bank partnerships are easy", "why_bad": "Banks move slowly and have strict requirements", "better_approach": "Start conversations early, have backup sponsors"}
  ]'::jsonb,
  '{
    "key_metrics": ["Transaction volume growth", "Take rate", "Fraud loss rate", "Compliance incidents", "Bank partner relationships"],
    "red_flags": ["No regulatory strategy", "Single bank dependency", "Fraud rate >1%", "Take rate assumptions too high"],
    "green_flags": ["Clear path to licensing", "Multiple bank partnerships", "Strong compliance team early", "Proven fraud prevention"]
  }'::jsonb,
  '[
    {"type": "Payments", "description": "Payment processing, gateways, and infrastructure"},
    {"type": "Banking", "description": "Neobanks, business banking, banking-as-a-service"},
    {"type": "Lending", "description": "Consumer lending, SMB lending, buy-now-pay-later"},
    {"type": "WealthTech", "description": "Investment platforms, robo-advisors, trading"},
    {"type": "InsurTech", "description": "Insurance distribution, underwriting, claims"},
    {"type": "B2B Payments", "description": "Accounts payable, receivable, treasury"}
  ]'::jsonb,
  'Let''s explore your FinTech idea. Money is trust - I''ll ask questions that help you think through compliance, security, and the unique challenges of building products that touch people''s finances.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 3. Healthcare
-- =============================================================================
(
  '33333333-3333-3333-3333-333333333333'::uuid,
  'healthcare',
  'Healthcare',
  'Digital health products including clinical tools, patient engagement, and healthcare operations',
  'heart-pulse',
  'You are a healthcare technology expert who has built products for hospitals, clinics, and patients. You understand HIPAA, clinical workflows, and the long sales cycles in healthcare. You push founders to think about clinical validation and the unique challenges of selling to healthcare.',
  'You are an expert Healthcare advisor. When reviewing founder responses:
- Always verify HIPAA compliance understanding and strategy
- Push for clinical validation evidence and pathway
- Question the sales cycle assumptions - healthcare moves slowly
- Emphasize the complexity of EHR integration
- Challenge claims about "disrupting" healthcare without clinical buy-in
- Ask about reimbursement strategy (who pays?)',
  '[
    {"term": "HIPAA", "definition": "Health Insurance Portability and Accountability Act - privacy law for health data"},
    {"term": "PHI", "definition": "Protected Health Information - any data that identifies a patient"},
    {"term": "EHR/EMR", "definition": "Electronic Health Record / Electronic Medical Record systems"},
    {"term": "HL7/FHIR", "definition": "Healthcare interoperability standards for data exchange"},
    {"term": "FDA clearance", "definition": "Regulatory approval for medical devices (510k, De Novo, PMA)"},
    {"term": "CPT code", "definition": "Billing codes that determine reimbursement"},
    {"term": "Value-based care", "definition": "Payment models that reward outcomes, not volume"},
    {"term": "Clinical validation", "definition": "Evidence that a product works in real clinical settings"}
  ]'::jsonb,
  '[
    {"metric": "Contract Value", "seed": "$50K-$200K", "series_a": "$200K-$1M", "why_matters": "Healthcare has high cost of sale"},
    {"metric": "Sales Cycle", "seed": "6-12 months", "series_a": "3-9 months", "why_matters": "Long cycles require capital planning"},
    {"metric": "Net Revenue Retention", "seed": "100%+", "series_a": "115%+", "why_matters": "Healthcare contracts should expand"},
    {"metric": "Clinical Outcomes", "seed": "Pilot data", "series_a": "Published studies", "why_matters": "Evidence drives adoption"}
  ]'::jsonb,
  '{
    "top_players": ["Epic", "Cerner (Oracle)", "Teladoc", "Livongo", "Amwell"],
    "emerging_threats": ["Big tech health initiatives", "EHR vendors adding features"],
    "acquisition_targets": ["Clinical decision support", "Remote monitoring", "Practice automation"]
  }'::jsonb,
  '[
    {"model": "Clinical vs. Administrative", "description": "Does your product touch patient care or operations?"},
    {"model": "Provider vs. Payer vs. Patient", "description": "Who is your primary customer vs. user?"},
    {"model": "Regulated vs. Unregulated", "description": "Is this a medical device requiring FDA clearance?"}
  ]'::jsonb,
  '[
    {"question": "Who is your clinical champion?", "why_matters": "Healthcare adoption requires physician buy-in"},
    {"question": "How does this integrate with their EHR?", "why_matters": "Standalone tools often fail - integration is essential"}
  ]'::jsonb,
  '{
    "tam_global": "$650B by 2028",
    "growth_rate": "18% CAGR",
    "key_trends": ["AI-assisted diagnosis", "Remote patient monitoring", "Behavioral health digital tools", "Care coordination platforms"]
  }'::jsonb,
  '[
    {"company": "Livongo", "outcome": "Acquired by Teladoc for $18.5B", "lesson": "Measurable outcomes + employer/payer go-to-market"},
    {"company": "Doximity", "outcome": "$10B market cap, profitable at IPO", "lesson": "Network effects in professional community"},
    {"company": "Oscar Health", "outcome": "IPO at $7.7B valuation", "lesson": "Full-stack insurance + tech approach"}
  ]'::jsonb,
  '[
    {"mistake": "Building without clinical input", "why_bad": "Product doesn''t fit workflows, clinicians reject it", "better_approach": "Hire clinical advisors, co-design with end users"},
    {"mistake": "Underestimating EHR integration", "why_bad": "6-12 month integration delays, cost overruns", "better_approach": "Start EHR partnerships early, consider SMART on FHIR"},
    {"mistake": "Ignoring reimbursement strategy", "why_bad": "Great product but no one can pay for it", "better_approach": "Research CPT codes, talk to payers early"}
  ]'::jsonb,
  '{
    "key_metrics": ["Clinical outcomes improvement", "Time savings for clinicians", "Integration completion rate", "Reimbursement coverage"],
    "red_flags": ["No clinical advisors", "EHR integration not planned", "No reimbursement pathway", "Regulatory strategy unclear"],
    "green_flags": ["Clinical champions on board", "Published outcomes data", "EHR partnerships secured", "Clear reimbursement model"]
  }'::jsonb,
  '[
    {"type": "Clinical Decision Support", "description": "AI-assisted diagnosis, treatment recommendations"},
    {"type": "Patient Engagement", "description": "Care coordination, patient communication, adherence"},
    {"type": "Remote Monitoring", "description": "Chronic care management, post-acute monitoring"},
    {"type": "Practice Management", "description": "Scheduling, billing, operations for providers"},
    {"type": "Behavioral Health", "description": "Mental health platforms, therapy apps"},
    {"type": "Life Sciences", "description": "Clinical trials, drug development, research"}
  ]'::jsonb,
  'Let''s explore your healthcare idea. This is a complex industry with unique constraints - I''ll ask questions that help you navigate regulations, clinical validation, and the realities of selling to healthcare organizations.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 4. Cybersecurity
-- =============================================================================
(
  '44444444-4444-4444-4444-444444444444'::uuid,
  'cybersecurity',
  'Cybersecurity',
  'Security products protecting organizations from cyber threats, including detection, prevention, and response',
  'shield',
  'You are a cybersecurity expert who has built security products and led security teams at major tech companies. You understand the threat landscape, compliance requirements, and the challenge of selling security when nothing has gone wrong. You push founders to think about defensibility against sophisticated threats.',
  'You are an expert Cybersecurity advisor. When reviewing founder responses:
- Challenge claims about "complete protection" - security is layers
- Push for understanding of specific threats addressed
- Question how the product handles sophisticated attackers
- Emphasize the importance of security research and threat intelligence
- Watch for products that only work against known threats
- Ask about false positive rates and operational impact',
  '[
    {"term": "SOC 2", "definition": "Service Organization Control 2 - security compliance framework"},
    {"term": "SIEM", "definition": "Security Information and Event Management - log analysis and alerting"},
    {"term": "Zero Trust", "definition": "Security model where nothing is trusted by default"},
    {"term": "EDR", "definition": "Endpoint Detection and Response - device-level security monitoring"},
    {"term": "SOAR", "definition": "Security Orchestration, Automation, and Response"},
    {"term": "Threat intel", "definition": "Information about current and emerging cyber threats"},
    {"term": "Purple team", "definition": "Combined offensive and defensive security testing"},
    {"term": "CISO", "definition": "Chief Information Security Officer - your key buyer"}
  ]'::jsonb,
  '[
    {"metric": "ACV", "seed": "$50K-$150K", "series_a": "$100K-$500K", "why_matters": "Security is enterprise sale"},
    {"metric": "False positive rate", "seed": "<5%", "series_a": "<1%", "why_matters": "Alert fatigue kills products"},
    {"metric": "Detection rate", "seed": ">90%", "series_a": ">95%", "why_matters": "Missing threats is existential"},
    {"metric": "Time to detect", "seed": "<1 hour", "series_a": "<15 min", "why_matters": "Speed is everything in security"}
  ]'::jsonb,
  '{
    "top_players": ["CrowdStrike", "Palo Alto Networks", "SentinelOne", "Okta", "Zscaler"],
    "emerging_threats": ["AI-powered attacks", "Supply chain compromises", "Cloud misconfigurations"],
    "acquisition_targets": ["Detection capabilities", "Threat intelligence", "Compliance automation"]
  }'::jsonb,
  '[
    {"model": "Prevention vs. Detection", "description": "Do you stop threats or find them after the fact?"},
    {"model": "Platform vs. Point Solution", "description": "Comprehensive suite or best-of-breed capability?"},
    {"model": "Agent vs. Agentless", "description": "Does your product require software installation?"}
  ]'::jsonb,
  '[
    {"question": "What threat did you miss in testing?", "why_matters": "Shows honest understanding of limitations"},
    {"question": "How do you handle zero-days?", "why_matters": "Tests approach to unknown threats"}
  ]'::jsonb,
  '{
    "tam_global": "$350B by 2028",
    "growth_rate": "12% CAGR",
    "key_trends": ["AI in security operations", "Identity-first security", "Cloud-native security", "Security for AI systems"]
  }'::jsonb,
  '[
    {"company": "CrowdStrike", "outcome": "$70B+ market cap, leader in EDR", "lesson": "Cloud-native architecture beats legacy"},
    {"company": "Wiz", "outcome": "$12B valuation in 3 years", "lesson": "Focus on specific cloud security problem, world-class team"},
    {"company": "1Password", "outcome": "$6.8B valuation", "lesson": "Consumer traction can drive enterprise adoption"}
  ]'::jsonb,
  '[
    {"mistake": "Claiming to stop all threats", "why_bad": "CISOs know this is impossible, lose credibility", "better_approach": "Be specific about what you detect/prevent and your limitations"},
    {"mistake": "Ignoring false positive problem", "why_bad": "Security teams drown in alerts, disable your product", "better_approach": "Optimize for high signal, provide context for investigation"},
    {"mistake": "Building without security research", "why_bad": "Threats evolve, your product becomes obsolete", "better_approach": "Invest in threat research team from early stage"}
  ]'::jsonb,
  '{
    "key_metrics": ["Detection rate", "False positive rate", "Mean time to detect", "Coverage breadth"],
    "red_flags": ["No threat research capability", "High false positive rates", "Limited to known threats", "No enterprise references"],
    "green_flags": ["Published security research", "Low false positive rate with high detection", "SOC integration demonstrated", "CISO advisory board"]
  }'::jsonb,
  '[
    {"type": "Endpoint Security", "description": "Protection for devices, workstations, servers"},
    {"type": "Cloud Security", "description": "CSPM, CWPP, container security"},
    {"type": "Identity Security", "description": "IAM, PAM, access management"},
    {"type": "Network Security", "description": "Firewall, intrusion detection, NDR"},
    {"type": "Application Security", "description": "SAST, DAST, API security"},
    {"type": "Security Operations", "description": "SIEM, SOAR, threat intelligence"}
  ]'::jsonb,
  'Let''s explore your cybersecurity idea. Security is a trust business - I''ll ask questions that help you think through threat modeling, false positives, and how to convince security teams to bet their jobs on your product.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 5. eCommerce
-- =============================================================================
(
  '55555555-5555-5555-5555-555555555555'::uuid,
  'ecommerce',
  'eCommerce',
  'Online retail and commerce platforms including marketplaces, D2C brands, and commerce infrastructure',
  'shopping-cart',
  'You are an eCommerce expert who has built and scaled online retail businesses. You understand unit economics, customer acquisition, and the logistics of moving physical goods. You push founders to think about margins, repeat purchases, and brand differentiation.',
  'You are an expert eCommerce advisor. When reviewing founder responses:
- Challenge unit economics assumptions ruthlessly
- Push for understanding of CAC, LTV, and contribution margin
- Question logistics and fulfillment strategy
- Emphasize the importance of repeat purchase behavior
- Watch for over-reliance on paid acquisition
- Ask about supply chain and inventory management',
  '[
    {"term": "AOV", "definition": "Average Order Value - revenue per transaction"},
    {"term": "CAC", "definition": "Customer Acquisition Cost - cost to get one customer"},
    {"term": "LTV", "definition": "Lifetime Value - total revenue from a customer over time"},
    {"term": "ROAS", "definition": "Return on Ad Spend - revenue generated per ad dollar"},
    {"term": "3PL", "definition": "Third-Party Logistics - outsourced fulfillment"},
    {"term": "D2C", "definition": "Direct-to-Consumer - selling directly without retailers"},
    {"term": "GMV", "definition": "Gross Merchandise Value - total value of goods sold"},
    {"term": "Contribution margin", "definition": "Revenue minus variable costs per unit"}
  ]'::jsonb,
  '[
    {"metric": "LTV:CAC", "seed": "2:1", "series_a": "3:1", "why_matters": "Unit economics must work"},
    {"metric": "Repeat rate", "seed": "20%+", "series_a": "30%+", "why_matters": "Repeat buyers drive profitability"},
    {"metric": "Gross margin", "seed": "40%+", "series_a": "50%+", "why_matters": "Need margin for marketing"},
    {"metric": "Contribution margin", "seed": "15%+", "series_a": "25%+", "why_matters": "After all variable costs"}
  ]'::jsonb,
  '{
    "top_players": ["Amazon", "Shopify", "Shein", "Temu", "Alibaba"],
    "emerging_threats": ["Chinese direct-to-consumer brands", "Social commerce", "Amazon private label"],
    "acquisition_targets": ["Vertical-specific platforms", "Commerce enablement tools"]
  }'::jsonb,
  '[
    {"model": "Marketplace vs. D2C", "description": "Are you aggregating sellers or selling your own products?"},
    {"model": "Commodity vs. Brand", "description": "Are you competing on price or building a premium brand?"},
    {"model": "Owned vs. Infrastructure", "description": "Selling products or enabling others to sell?"}
  ]'::jsonb,
  '[
    {"question": "What happens when CAC doubles?", "why_matters": "Tests resilience of unit economics"},
    {"question": "Why would someone buy from you instead of Amazon?", "why_matters": "Tests differentiation and moat"}
  ]'::jsonb,
  '{
    "tam_global": "$6.3T by 2027",
    "growth_rate": "10% CAGR",
    "key_trends": ["Social commerce", "Live shopping", "Sustainable commerce", "AI personalization"]
  }'::jsonb,
  '[
    {"company": "Shopify", "outcome": "$50B+ market cap, powering millions of merchants", "lesson": "Enable others to succeed in commerce"},
    {"company": "Warby Parker", "outcome": "$2B+ public company", "lesson": "D2C brand with vertical integration works at scale"},
    {"company": "Faire", "outcome": "$12.4B valuation", "lesson": "B2B marketplace for wholesale can be massive"}
  ]'::jsonb,
  '[
    {"mistake": "Assuming paid ads will always work", "why_bad": "CAC rises, iOS privacy changes hurt tracking", "better_approach": "Build organic channels, community, and retention from day one"},
    {"mistake": "Ignoring fulfillment complexity", "why_bad": "Shipping costs and delays destroy margins and NPS", "better_approach": "Plan fulfillment strategy early, consider 3PL partnerships"},
    {"mistake": "Competing on price alone", "why_bad": "Race to bottom, no margin, Amazon always wins", "better_approach": "Build brand, community, and unique value proposition"}
  ]'::jsonb,
  '{
    "key_metrics": ["LTV:CAC ratio", "Repeat purchase rate", "Contribution margin", "Inventory turnover"],
    "red_flags": ["<1.5 LTV:CAC", "No repeat purchases", "Negative contribution margin", "100% paid acquisition"],
    "green_flags": [">3 LTV:CAC", ">30% repeat rate", "Positive unit economics", "Organic > paid acquisition"]
  }'::jsonb,
  '[
    {"type": "Marketplace", "description": "Multi-sided platforms connecting buyers and sellers"},
    {"type": "D2C Brand", "description": "Direct-to-consumer product brands"},
    {"type": "Commerce Platform", "description": "Infrastructure for online selling"},
    {"type": "Social Commerce", "description": "Commerce integrated with social platforms"},
    {"type": "B2B Commerce", "description": "Wholesale and business purchasing platforms"},
    {"type": "Vertical Commerce", "description": "Industry-specific retail (fashion, food, etc.)"}
  ]'::jsonb,
  'Let''s explore your eCommerce idea. This is a unit economics game - I''ll ask questions that help you think through customer acquisition, margins, and how to build a sustainable commerce business.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 6. Education
-- =============================================================================
(
  '66666666-6666-6666-6666-666666666666'::uuid,
  'education',
  'Education',
  'EdTech products for learning, training, and educational institutions',
  'graduation-cap',
  'You are an EdTech expert who has built learning products for schools, universities, and corporations. You understand the difference between engagement and learning outcomes, and the challenge of selling to educational institutions. You push founders to think about efficacy and measurable learning gains.',
  'You are an expert Education advisor. When reviewing founder responses:
- Challenge claims about learning outcomes without evidence
- Push for understanding of buyer vs. user dynamics (admin vs. teacher vs. student)
- Question the difference between engagement and actual learning
- Emphasize the importance of curriculum alignment and standards
- Watch for products that optimize for time-on-site over learning
- Ask about teacher adoption and classroom integration',
  '[
    {"term": "LMS", "definition": "Learning Management System - platform for delivering courses"},
    {"term": "SCORM", "definition": "Sharable Content Object Reference Model - e-learning standard"},
    {"term": "Competency-based", "definition": "Learning measured by skill mastery, not seat time"},
    {"term": "Formative assessment", "definition": "Ongoing assessment during learning process"},
    {"term": "Efficacy study", "definition": "Research proving learning outcomes improvement"},
    {"term": "Title I", "definition": "Federal funding for schools with low-income students"},
    {"term": "FERPA", "definition": "Federal Educational Rights and Privacy Act"},
    {"term": "SEL", "definition": "Social-Emotional Learning - non-academic skill development"}
  ]'::jsonb,
  '[
    {"metric": "Learning gain", "seed": "0.2+ effect size", "series_a": "0.4+ effect size", "why_matters": "Proves your product works"},
    {"metric": "Teacher adoption", "seed": "50%+ weekly active", "series_a": "70%+ weekly active", "why_matters": "Teachers are gatekeepers"},
    {"metric": "Student engagement", "seed": "30 min/week", "series_a": "60 min/week", "why_matters": "Must be used to work"},
    {"metric": "Renewal rate", "seed": "70%+", "series_a": "85%+", "why_matters": "K-12 is annual cycle"}
  ]'::jsonb,
  '{
    "top_players": ["Coursera", "Duolingo", "Canvas", "Blackboard", "Renaissance"],
    "emerging_threats": ["AI tutoring at scale", "Free content from top universities"],
    "acquisition_targets": ["Assessment technology", "Curriculum content", "Data analytics"]
  }'::jsonb,
  '[
    {"model": "B2C vs. B2B vs. B2B2C", "description": "Selling to consumers, schools, or employers who provide to users?"},
    {"model": "Content vs. Platform", "description": "Are you providing learning content or the delivery mechanism?"},
    {"model": "Supplemental vs. Core", "description": "Enhancing existing curriculum or replacing it?"}
  ]'::jsonb,
  '[
    {"question": "How do you know students are actually learning?", "why_matters": "Distinguishes engagement from outcomes"},
    {"question": "What happens in a classroom without WiFi?", "why_matters": "Tests real-world usability in school settings"}
  ]'::jsonb,
  '{
    "tam_global": "$400B by 2027",
    "growth_rate": "16% CAGR",
    "key_trends": ["AI tutoring and personalization", "Skills-based learning", "Micro-credentials", "Lifelong learning platforms"]
  }'::jsonb,
  '[
    {"company": "Duolingo", "outcome": "$8B+ public company, 75M+ daily users", "lesson": "Gamification + accessibility = mass adoption"},
    {"company": "Coursera", "outcome": "$3B+ public company", "lesson": "Premium content from top institutions creates value"},
    {"company": "Quizlet", "outcome": "Acquired for $1B", "lesson": "User-generated content creates flywheel"}
  ]'::jsonb,
  '[
    {"mistake": "Optimizing for engagement over learning", "why_bad": "Creates addictive products that don''t help students", "better_approach": "Measure learning outcomes, not just time on platform"},
    {"mistake": "Building for students, selling to admins", "why_bad": "Buyer and user have different needs, neither satisfied", "better_approach": "Understand both stakeholders, design for teacher adoption"},
    {"mistake": "Ignoring the school year cycle", "why_bad": "Sales happen in spring for fall, miss window = wait a year", "better_approach": "Plan sales cycles around academic calendar"}
  ]'::jsonb,
  '{
    "key_metrics": ["Learning outcomes improvement", "Teacher adoption rate", "Student weekly active usage", "Renewal rate"],
    "red_flags": ["No efficacy data", "Low teacher adoption", "Only works with perfect conditions", "No standards alignment"],
    "green_flags": ["Published efficacy studies", "High teacher satisfaction", "Works in real classrooms", "Standards-aligned content"]
  }'::jsonb,
  '[
    {"type": "K-12 EdTech", "description": "Products for elementary and secondary education"},
    {"type": "Higher Ed", "description": "University learning platforms and tools"},
    {"type": "Corporate Training", "description": "Employee learning and development"},
    {"type": "Language Learning", "description": "Language acquisition platforms"},
    {"type": "Assessment", "description": "Testing, evaluation, and certification"},
    {"type": "Tutoring", "description": "One-on-one or AI-powered tutoring"}
  ]'::jsonb,
  'Let''s explore your EdTech idea. Education is about outcomes, not engagement - I''ll ask questions that help you think through learning efficacy, teacher adoption, and the realities of selling to educational institutions.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 7. Logistics & Supply Chain
-- =============================================================================
(
  '77777777-7777-7777-7777-777777777777'::uuid,
  'logistics',
  'Logistics & Supply Chain',
  'Supply chain technology, freight, warehousing, and logistics optimization',
  'truck',
  'You are a logistics expert who has built supply chain technology for major retailers and freight companies. You understand the complexity of moving physical goods, the thin margins in logistics, and the importance of reliability. You push founders to think about operational excellence and network effects.',
  'You are an expert Logistics advisor. When reviewing founder responses:
- Challenge assumptions about margins in freight and logistics
- Push for understanding of the physical operations complexity
- Question how technology integrates with existing logistics providers
- Emphasize the importance of reliability and trust
- Watch for underestimating the capital intensity of logistics
- Ask about carrier/shipper relationships and network effects',
  '[
    {"term": "TMS", "definition": "Transportation Management System - software for managing shipments"},
    {"term": "WMS", "definition": "Warehouse Management System - software for warehouse operations"},
    {"term": "3PL/4PL", "definition": "Third/Fourth-Party Logistics - outsourced logistics providers"},
    {"term": "FTL/LTL", "definition": "Full Truckload / Less Than Truckload shipping"},
    {"term": "Bill of lading", "definition": "Legal document for shipment details and receipt"},
    {"term": "Deadhead", "definition": "When a truck drives empty (no paying cargo)"},
    {"term": "OTIF", "definition": "On-Time In-Full - key delivery performance metric"},
    {"term": "Last mile", "definition": "Final delivery leg to end customer"}
  ]'::jsonb,
  '[
    {"metric": "Take rate", "seed": "5-15%", "series_a": "8-20%", "why_matters": "Logistics margins are thin"},
    {"metric": "OTIF", "seed": "95%+", "series_a": "98%+", "why_matters": "Reliability is everything"},
    {"metric": "Carrier retention", "seed": "80%+", "series_a": "90%+", "why_matters": "Network is the moat"},
    {"metric": "Shipper NPS", "seed": "30+", "series_a": "50+", "why_matters": "Trust drives repeat business"}
  ]'::jsonb,
  '{
    "top_players": ["Flexport", "Project44", "FourKites", "Convoy (shut down)", "Uber Freight"],
    "emerging_threats": ["Amazon logistics expansion", "Traditional logistics tech modernization"],
    "acquisition_targets": ["Visibility platforms", "Automation technology", "Last-mile solutions"]
  }'::jsonb,
  '[
    {"model": "Asset-light vs. Asset-heavy", "description": "Technology platform or owning trucks/warehouses?"},
    {"model": "Marketplace vs. SaaS", "description": "Connecting shippers and carriers or selling software?"},
    {"model": "Horizontal vs. Vertical", "description": "All freight or specialized (cold chain, hazmat, etc.)?"}
  ]'::jsonb,
  '[
    {"question": "What happens when a shipment fails?", "why_matters": "Tests operational resilience"},
    {"question": "Why would carriers use your platform?", "why_matters": "Two-sided marketplace dynamics"}
  ]'::jsonb,
  '{
    "tam_global": "$15T+ global freight market",
    "growth_rate": "5-8% CAGR",
    "key_trends": ["Real-time visibility", "Autonomous vehicles", "Sustainability tracking", "AI-powered optimization"]
  }'::jsonb,
  '[
    {"company": "Flexport", "outcome": "$8B valuation (pre-correction), full-stack forwarder", "lesson": "Tech-enabled freight forwarding at scale"},
    {"company": "Project44", "outcome": "$2.7B valuation, visibility leader", "lesson": "Data and visibility create sticky platform"},
    {"company": "Convoy", "outcome": "Shut down despite $3.8B valuation", "lesson": "Marketplace economics are brutal, capital intensive"}
  ]'::jsonb,
  '[
    {"mistake": "Underestimating carrier economics", "why_bad": "Carriers have thin margins, won''t accept low rates", "better_approach": "Understand carrier unit economics deeply"},
    {"mistake": "Ignoring physical operations", "why_bad": "Technology alone doesn''t move goods", "better_approach": "Hire operators, understand the physical world"},
    {"mistake": "Assuming marketplaces are winner-take-all", "why_bad": "Logistics is regional, fragmented, complex", "better_approach": "Focus on specific lanes, verticals, or use cases"}
  ]'::jsonb,
  '{
    "key_metrics": ["Shipment volume growth", "Take rate", "OTIF performance", "Carrier/shipper retention"],
    "red_flags": ["Negative unit economics at scale", "High carrier churn", "No competitive differentiation", "Capital intensive without path to profitability"],
    "green_flags": ["Network effects demonstrated", "High retention both sides", "Clear path to profitability", "Defensible data asset"]
  }'::jsonb,
  '[
    {"type": "Freight Tech", "description": "Digital freight brokerage and marketplaces"},
    {"type": "Visibility", "description": "Real-time tracking and supply chain visibility"},
    {"type": "Warehouse Tech", "description": "WMS, robotics, and fulfillment automation"},
    {"type": "Last Mile", "description": "Final delivery solutions and optimization"},
    {"type": "Supply Chain Planning", "description": "Demand forecasting, inventory optimization"},
    {"type": "Cold Chain", "description": "Temperature-controlled logistics"}
  ]'::jsonb,
  'Let''s explore your logistics idea. Moving atoms is hard - I''ll ask questions that help you think through operational complexity, thin margins, and building network effects in a physical-world business.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 8. Legal / Professional Services
-- =============================================================================
(
  '88888888-8888-8888-8888-888888888888'::uuid,
  'legal',
  'Legal / Professional Services',
  'LegalTech and professional services automation for law firms and corporate legal teams',
  'scale',
  'You are a LegalTech expert who has built products for law firms and corporate legal departments. You understand the conservative nature of the legal profession, the importance of accuracy, and the complexity of selling to lawyers. You push founders to think about workflow integration and risk management.',
  'You are an expert LegalTech advisor. When reviewing founder responses:
- Challenge assumptions about lawyer adoption - they are conservative
- Push for understanding of workflow integration with existing tools
- Question accuracy claims - legal errors have serious consequences
- Emphasize the importance of security and confidentiality
- Watch for products that require lawyers to change behavior
- Ask about malpractice risk and professional responsibility',
  '[
    {"term": "Matter", "definition": "A legal case or project for a client"},
    {"term": "Billable hour", "definition": "Time billed to clients, fundamental law firm economics"},
    {"term": "AFA", "definition": "Alternative Fee Arrangement - non-hourly billing"},
    {"term": "DMS", "definition": "Document Management System for legal documents"},
    {"term": "e-Discovery", "definition": "Electronic discovery of documents for litigation"},
    {"term": "CLM", "definition": "Contract Lifecycle Management"},
    {"term": "Legal ops", "definition": "Legal operations - efficiency and technology function"},
    {"term": "IOLTA", "definition": "Interest on Lawyer Trust Accounts - regulated client funds"}
  ]'::jsonb,
  '[
    {"metric": "ACV", "seed": "$20K-$100K", "series_a": "$50K-$300K", "why_matters": "Law firms can pay for value"},
    {"metric": "Accuracy", "seed": "99%+", "series_a": "99.5%+", "why_matters": "Errors create malpractice risk"},
    {"metric": "Time savings", "seed": "30%+", "series_a": "50%+", "why_matters": "Must justify adoption cost"},
    {"metric": "Lawyer NPS", "seed": "30+", "series_a": "50+", "why_matters": "Word of mouth matters in legal"}
  ]'::jsonb,
  '{
    "top_players": ["Thomson Reuters", "LexisNexis", "Clio", "Ironclad", "Harvey AI"],
    "emerging_threats": ["Big law firms building internal tools", "AI commoditizing research"],
    "acquisition_targets": ["Practice-specific solutions", "AI legal assistants", "Contract automation"]
  }'::jsonb,
  '[
    {"model": "Law firm vs. In-house", "description": "Selling to law firms or corporate legal departments?"},
    {"model": "Practice-specific vs. Horizontal", "description": "Focused on one legal area or general purpose?"},
    {"model": "Replace vs. Augment", "description": "Replacing lawyer work or making lawyers more efficient?"}
  ]'::jsonb,
  '[
    {"question": "What happens when your product makes an error?", "why_matters": "Tests understanding of risk and liability"},
    {"question": "Why would a partner champion this internally?", "why_matters": "Law firm politics and change management"}
  ]'::jsonb,
  '{
    "tam_global": "$1T+ legal services market",
    "growth_rate": "8% CAGR",
    "key_trends": ["AI legal assistants", "Contract automation", "Legal operations software", "Access to justice tech"]
  }'::jsonb,
  '[
    {"company": "Harvey AI", "outcome": "$80M Series B at $715M valuation", "lesson": "AI-native legal assistant, strong product-market fit"},
    {"company": "Clio", "outcome": "$3B+ valuation, dominant in small law", "lesson": "Vertical SaaS for underserved segment"},
    {"company": "Ironclad", "outcome": "$3.2B valuation", "lesson": "CLM category creation with strong enterprise sales"}
  ]'::jsonb,
  '[
    {"mistake": "Underestimating lawyer conservatism", "why_bad": "Lawyers are risk-averse, slow to adopt new tools", "better_approach": "Build for early adopters, get champions, show clear ROI"},
    {"mistake": "Ignoring accuracy requirements", "why_bad": "Legal errors can cause malpractice, career damage", "better_approach": "Focus on accuracy, human-in-the-loop, clear limitations"},
    {"mistake": "Selling to wrong buyer", "why_bad": "IT says yes but lawyers don''t use it", "better_approach": "Get lawyer champions, understand adoption path"}
  ]'::jsonb,
  '{
    "key_metrics": ["Time savings demonstrated", "Accuracy rate", "Lawyer adoption rate", "Client satisfaction"],
    "red_flags": ["No lawyer on team", "Claims to replace lawyers", "Low accuracy tolerance", "No law firm customers"],
    "green_flags": ["Lawyer founders/advisors", "Augments rather than replaces", "High accuracy with clear limitations", "Law firm early adopters"]
  }'::jsonb,
  '[
    {"type": "Contract Management", "description": "CLM, contract review, negotiation"},
    {"type": "Legal Research", "description": "AI-powered research and analysis"},
    {"type": "Practice Management", "description": "Law firm operations and billing"},
    {"type": "e-Discovery", "description": "Document review and production"},
    {"type": "Compliance", "description": "Regulatory compliance automation"},
    {"type": "Access to Justice", "description": "Consumer legal services and self-help"}
  ]'::jsonb,
  'Let''s explore your LegalTech idea. Law is a conservative profession - I''ll ask questions that help you think through lawyer adoption, accuracy requirements, and the realities of selling to legal professionals.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 9. Financial Services
-- =============================================================================
(
  '99999999-9999-9999-9999-999999999999'::uuid,
  'financial_services',
  'Financial Services',
  'Technology for financial institutions including banks, asset managers, and insurance companies',
  'building-2',
  'You are a financial services technology expert who has built products for banks, asset managers, and insurance companies. You understand the regulatory environment, the procurement complexity, and the importance of security and compliance. You push founders to think about enterprise sales and long-term relationships.',
  'You are an expert Financial Services advisor. When reviewing founder responses:
- Challenge assumptions about sales cycles - enterprise financial services is 12-18 months
- Push for understanding of regulatory requirements and compliance
- Question security architecture - financial data is highly sensitive
- Emphasize the importance of integration with legacy systems
- Watch for underestimating procurement and legal review timelines
- Ask about relationship building with compliance and risk teams',
  '[
    {"term": "AUM", "definition": "Assets Under Management - key metric for asset managers"},
    {"term": "Basis points", "definition": "One hundredth of one percent, used for fees"},
    {"term": "Core banking", "definition": "The fundamental systems that process banking transactions"},
    {"term": "RegTech", "definition": "Regulatory technology - compliance automation"},
    {"term": "Middle office", "definition": "Risk management and operations in trading firms"},
    {"term": "CCAR", "definition": "Comprehensive Capital Analysis and Review - bank stress testing"},
    {"term": "RFP", "definition": "Request for Proposal - formal procurement process"},
    {"term": "SLA", "definition": "Service Level Agreement - contractual performance guarantees"}
  ]'::jsonb,
  '[
    {"metric": "ACV", "seed": "$100K-$500K", "series_a": "$500K-$2M", "why_matters": "Enterprise deals are large"},
    {"metric": "Sales cycle", "seed": "9-15 months", "series_a": "6-12 months", "why_matters": "Long cycles require capital"},
    {"metric": "Logo retention", "seed": "95%+", "series_a": "98%+", "why_matters": "Switching costs are high"},
    {"metric": "NRR", "seed": "110%+", "series_a": "120%+", "why_matters": "Expansion drives growth"}
  ]'::jsonb,
  '{
    "top_players": ["Bloomberg", "Refinitiv", "SS&C", "BlackRock Aladdin", "FIS/Worldpay"],
    "emerging_threats": ["Bank internal build", "Big tech financial services"],
    "acquisition_targets": ["RegTech solutions", "Data and analytics", "Workflow automation"]
  }'::jsonb,
  '[
    {"model": "SaaS vs. On-Premise", "description": "Cloud delivery or installed in customer data centers?"},
    {"model": "Point solution vs. Platform", "description": "Solving one problem or becoming system of record?"},
    {"model": "Front/Middle/Back office", "description": "Which part of financial operations are you serving?"}
  ]'::jsonb,
  '[
    {"question": "Walk me through your security architecture", "why_matters": "Financial services requires enterprise-grade security"},
    {"question": "How do you handle a failed regulatory audit?", "why_matters": "Tests understanding of compliance stakes"}
  ]'::jsonb,
  '{
    "tam_global": "$800B+ financial technology market",
    "growth_rate": "10% CAGR",
    "key_trends": ["Cloud adoption by banks", "AI in risk management", "RegTech automation", "Real-time data and analytics"]
  }'::jsonb,
  '[
    {"company": "Stripe", "outcome": "$95B valuation, dominant in payments", "lesson": "Developer experience wins even in financial services"},
    {"company": "Plaid", "outcome": "$13.4B valuation", "lesson": "Infrastructure becomes essential, pricing power"},
    {"company": "SoFi", "outcome": "$10B+ public company", "lesson": "Full-stack financial services with technology core"}
  ]'::jsonb,
  '[
    {"mistake": "Underestimating compliance requirements", "why_bad": "Product doesn''t meet regulatory standards, can''t sell", "better_approach": "Hire compliance expertise early, get SOC 2 immediately"},
    {"mistake": "Assuming cloud-first is always okay", "why_bad": "Many financial institutions still require on-premise", "better_approach": "Build hybrid architecture, understand customer requirements"},
    {"mistake": "Ignoring procurement complexity", "why_bad": "12-month sales cycle becomes 24 months", "better_approach": "Map procurement process, build relationships with legal/compliance"}
  ]'::jsonb,
  '{
    "key_metrics": ["Contract value", "Sales cycle length", "Logo retention", "Compliance certifications"],
    "red_flags": ["No SOC 2", "No financial services references", "Underestimating sales cycle", "Weak security posture"],
    "green_flags": ["SOC 2 Type II certified", "Multiple financial services logos", "Compliance team in place", "Long-term customer relationships"]
  }'::jsonb,
  '[
    {"type": "Capital Markets", "description": "Trading, investment management, research"},
    {"type": "Banking Tech", "description": "Core banking, lending platforms, deposits"},
    {"type": "Insurance Tech", "description": "Underwriting, claims, distribution"},
    {"type": "RegTech", "description": "Compliance, AML, KYC, reporting"},
    {"type": "Wealth Management", "description": "Advisory, portfolio management, planning"},
    {"type": "Data & Analytics", "description": "Financial data, risk analytics, reporting"}
  ]'::jsonb,
  'Let''s explore your financial services technology idea. This is an enterprise sale with long cycles and high stakes - I''ll ask questions that help you think through compliance, security, and building relationships with financial institutions.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 10. Sales & Marketing
-- =============================================================================
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'sales_marketing',
  'Sales & Marketing',
  'Technology for sales teams and marketing organizations including CRM, automation, and analytics',
  'target',
  'You are a sales and marketing technology expert who has built products used by thousands of sales reps and marketing teams. You understand the crowded landscape, the importance of proving ROI, and the challenge of changing sales behavior. You push founders to think about workflow integration and measurable impact.',
  'You are an expert Sales & Marketing tech advisor. When reviewing founder responses:
- Challenge differentiation in an extremely crowded market
- Push for clear ROI metrics that justify the purchase
- Question how the product fits into existing sales workflows
- Emphasize the importance of CRM integration
- Watch for products that require major behavior change
- Ask about adoption metrics and actual usage data',
  '[
    {"term": "MQL/SQL", "definition": "Marketing/Sales Qualified Lead - lead stages"},
    {"term": "AE/SDR/BDR", "definition": "Account Executive / Sales/Business Development Rep roles"},
    {"term": "CAC", "definition": "Customer Acquisition Cost - cost to acquire a customer"},
    {"term": "Pipeline coverage", "definition": "Ratio of pipeline value to quota target"},
    {"term": "Win rate", "definition": "Percentage of opportunities that close won"},
    {"term": "Quota attainment", "definition": "Percentage of sales reps hitting their number"},
    {"term": "MarTech stack", "definition": "Collection of marketing technology tools"},
    {"term": "ABM", "definition": "Account-Based Marketing - targeting specific accounts"}
  ]'::jsonb,
  '[
    {"metric": "Integration rate", "seed": "80%+ with major CRMs", "series_a": "95%+", "why_matters": "No CRM integration = no adoption"},
    {"metric": "Rep adoption", "seed": "60%+ weekly active", "series_a": "80%+ weekly active", "why_matters": "Tools reps don''t use don''t help"},
    {"metric": "Quota impact", "seed": "10%+ improvement", "series_a": "20%+ improvement", "why_matters": "Must prove revenue impact"},
    {"metric": "Time saved", "seed": "5+ hours/week/rep", "series_a": "10+ hours/week/rep", "why_matters": "Time back to selling"}
  ]'::jsonb,
  '{
    "top_players": ["Salesforce", "HubSpot", "Outreach", "Gong", "ZoomInfo"],
    "emerging_threats": ["AI automation replacing tools", "CRM vendors adding features"],
    "acquisition_targets": ["Sales intelligence", "Conversation intelligence", "Pipeline analytics"]
  }'::jsonb,
  '[
    {"model": "System of Record vs. Point Solution", "description": "Becoming the CRM or integrating with it?"},
    {"model": "Rep vs. Manager vs. Ops", "description": "Who is your primary user and buyer?"},
    {"model": "Sales vs. Marketing", "description": "Focused on revenue or demand generation?"}
  ]'::jsonb,
  '[
    {"question": "Why wouldn''t Salesforce just build this?", "why_matters": "Tests defensibility against platforms"},
    {"question": "Show me the ROI calculation", "why_matters": "Sales tools must justify cost with revenue"}
  ]'::jsonb,
  '{
    "tam_global": "$200B+ sales and marketing tech",
    "growth_rate": "12% CAGR",
    "key_trends": ["AI sales assistants", "Revenue intelligence", "Unified customer data", "Product-led growth"]
  }'::jsonb,
  '[
    {"company": "Gong", "outcome": "$7.25B valuation", "lesson": "Category creation (revenue intelligence) with strong product"},
    {"company": "Outreach", "outcome": "$4.4B valuation", "lesson": "Sales engagement category leadership"},
    {"company": "ZoomInfo", "outcome": "$15B+ public company", "lesson": "Data is the moat, aggregation business"}
  ]'::jsonb,
  '[
    {"mistake": "Building another CRM", "why_bad": "Salesforce/HubSpot are entrenched, switching costs enormous", "better_approach": "Build on top of CRM, integrate deeply"},
    {"mistake": "Ignoring rep adoption", "why_bad": "Leadership buys but reps don''t use, churn follows", "better_approach": "Design for rep workflow, prove time savings"},
    {"mistake": "Unable to prove ROI", "why_bad": "Budget gets cut in downturn, lose to cheaper option", "better_approach": "Build ROI measurement into product, show pipeline impact"}
  ]'::jsonb,
  '{
    "key_metrics": ["Rep adoption rate", "Pipeline impact", "CRM integration depth", "Time savings"],
    "red_flags": ["No CRM integration", "Low rep adoption despite purchase", "Can''t quantify ROI", "Competes with Salesforce"],
    "green_flags": ["Deep CRM integration", "High rep NPS", "Clear quota impact data", "Complements rather than competes"]
  }'::jsonb,
  '[
    {"type": "CRM", "description": "Customer relationship management platforms"},
    {"type": "Sales Engagement", "description": "Outreach, sequencing, cadence tools"},
    {"type": "Sales Intelligence", "description": "Data, insights, intent signals"},
    {"type": "Conversation Intelligence", "description": "Call recording, analysis, coaching"},
    {"type": "Marketing Automation", "description": "Email, campaigns, lead nurturing"},
    {"type": "Revenue Operations", "description": "Forecasting, analytics, compensation"}
  ]'::jsonb,
  'Let''s explore your sales and marketing tech idea. This is a crowded space - I''ll ask questions that help you think through differentiation, CRM integration, and proving ROI to justify the purchase.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 11. CRM & Social Media AI
-- =============================================================================
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'crm_social',
  'CRM & Social Media AI',
  'AI-powered customer relationship and social media management tools',
  'users',
  'You are an expert in AI-powered CRM and social media tools who has built products that leverage AI to understand customer relationships and social engagement at scale. You understand the balance between automation and authenticity, and the challenges of maintaining relationships through technology.',
  'You are an expert CRM & Social AI advisor. When reviewing founder responses:
- Challenge claims about AI personalization at scale
- Push for understanding of privacy and data usage concerns
- Question how AI maintains authentic voice and relationships
- Emphasize the importance of human oversight
- Watch for automation that feels robotic
- Ask about integration with existing CRM and social platforms',
  '[
    {"term": "Social listening", "definition": "Monitoring social media for brand mentions and trends"},
    {"term": "Sentiment analysis", "definition": "AI understanding of emotional tone in messages"},
    {"term": "NLP", "definition": "Natural Language Processing for understanding text"},
    {"term": "Community management", "definition": "Building and engaging online communities"},
    {"term": "Engagement rate", "definition": "Interactions divided by reach or impressions"},
    {"term": "Share of voice", "definition": "Brand mentions relative to competitors"},
    {"term": "Customer 360", "definition": "Complete view of customer across all touchpoints"},
    {"term": "Unified inbox", "definition": "Single view of all customer communications"}
  ]'::jsonb,
  '[
    {"metric": "Response time", "seed": "<1 hour", "series_a": "<15 minutes", "why_matters": "Speed matters in social"},
    {"metric": "Engagement improvement", "seed": "30%+", "series_a": "50%+", "why_matters": "Must prove AI adds value"},
    {"metric": "Human escalation rate", "seed": "<30%", "series_a": "<15%", "why_matters": "AI should handle most cases"},
    {"metric": "Customer satisfaction", "seed": "80%+ CSAT", "series_a": "90%+ CSAT", "why_matters": "AI shouldn''t hurt relationships"}
  ]'::jsonb,
  '{
    "top_players": ["Sprinklr", "Hootsuite", "Sprout Social", "Salesforce Social Studio"],
    "emerging_threats": ["Platform-native tools", "AI from social platforms themselves"],
    "acquisition_targets": ["AI engagement tools", "Customer data platforms", "Social analytics"]
  }'::jsonb,
  '[
    {"model": "Publishing vs. Engagement vs. Analytics", "description": "Which part of social management are you solving?"},
    {"model": "B2B vs. B2C vs. Creator", "description": "Who is using your tool and for what audience?"},
    {"model": "Platform-specific vs. Cross-platform", "description": "Focused on one network or unified management?"}
  ]'::jsonb,
  '[
    {"question": "How do you maintain brand voice with AI?", "why_matters": "Tests understanding of authenticity challenges"},
    {"question": "What happens when AI says something wrong?", "why_matters": "Tests risk management and human oversight"}
  ]'::jsonb,
  '{
    "tam_global": "$80B+ social media management and CRM",
    "growth_rate": "15% CAGR",
    "key_trends": ["AI-powered engagement", "Creator economy tools", "Social commerce", "Community-led growth"]
  }'::jsonb,
  '[
    {"company": "Sprinklr", "outcome": "$3B+ public company", "lesson": "Enterprise social management at scale"},
    {"company": "Sprout Social", "outcome": "$4B+ public company", "lesson": "SMB focus with strong product"},
    {"company": "Gong", "outcome": "$7.25B valuation", "lesson": "AI for customer conversations creates value"}
  ]'::jsonb,
  '[
    {"mistake": "Automating without oversight", "why_bad": "AI says something inappropriate, PR crisis", "better_approach": "Human-in-the-loop for risky content"},
    {"mistake": "Ignoring platform rules", "why_bad": "Account gets banned for automation", "better_approach": "Stay within platform ToS, build relationships"},
    {"mistake": "Over-promising AI capabilities", "why_bad": "AI sounds robotic, damages relationships", "better_approach": "Set realistic expectations, augment not replace"}
  ]'::jsonb,
  '{
    "key_metrics": ["Response time improvement", "Engagement rate increase", "CSAT scores", "Human escalation rate"],
    "red_flags": ["No human oversight", "Violates platform ToS", "Robotic-sounding outputs", "No CSAT tracking"],
    "green_flags": ["Human-in-the-loop design", "Platform partnerships", "Natural-sounding AI", "Strong CSAT metrics"]
  }'::jsonb,
  '[
    {"type": "Social Management", "description": "Publishing, scheduling, cross-platform management"},
    {"type": "Social Listening", "description": "Monitoring, sentiment, trend analysis"},
    {"type": "Community Management", "description": "Engagement, moderation, community building"},
    {"type": "Social CRM", "description": "Customer data from social integrated with CRM"},
    {"type": "Influencer Management", "description": "Creator partnerships and campaigns"},
    {"type": "Social Commerce", "description": "Selling through social platforms"}
  ]'::jsonb,
  'Let''s explore your CRM & Social AI idea. The challenge is automation without losing authenticity - I''ll ask questions that help you think through the balance between scale and genuine customer relationships.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 12. Events Management
-- =============================================================================
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
  'events',
  'Events Management',
  'Event technology for conferences, meetings, and experiences',
  'calendar',
  'You are an events technology expert who has built products for conferences, corporate events, and virtual experiences. You understand the complexity of event logistics, the importance of engagement, and the shift to hybrid formats. You push founders to think about the full event lifecycle and attendee experience.',
  'You are an expert Events Management advisor. When reviewing founder responses:
- Challenge assumptions about event budgets and decision-making
- Push for understanding of the full event lifecycle (before, during, after)
- Question how the product handles hybrid and virtual requirements
- Emphasize the importance of data and measurement
- Watch for products that only work for one event type
- Ask about integration with registration, marketing, and CRM',
  '[
    {"term": "Registration", "definition": "The process of signing up and ticketing for events"},
    {"term": "Check-in", "definition": "On-site or virtual arrival and verification"},
    {"term": "Session tracking", "definition": "Monitoring which sessions attendees attend"},
    {"term": "Lead retrieval", "definition": "Sponsors capturing attendee contact info"},
    {"term": "Event app", "definition": "Mobile application for event engagement"},
    {"term": "Hybrid event", "definition": "Events with both in-person and virtual attendance"},
    {"term": "ROI measurement", "definition": "Proving the value and impact of events"},
    {"term": "Exhibitor management", "definition": "Managing sponsors and exhibitors at events"}
  ]'::jsonb,
  '[
    {"metric": "Attendee satisfaction", "seed": "4.0+/5.0", "series_a": "4.5+/5.0", "why_matters": "Events must deliver value"},
    {"metric": "App adoption", "seed": "60%+", "series_a": "80%+", "why_matters": "Tech must be used to help"},
    {"metric": "Sponsor ROI", "seed": "3x+", "series_a": "5x+", "why_matters": "Sponsors fund many events"},
    {"metric": "Data capture rate", "seed": "70%+", "series_a": "90%+", "why_matters": "Data is the value"}
  ]'::jsonb,
  '{
    "top_players": ["Cvent", "Eventbrite", "Hopin", "Bizzabo", "Splash"],
    "emerging_threats": ["Virtual platforms from big tech", "Commoditization of basic features"],
    "acquisition_targets": ["Engagement tools", "Virtual event platforms", "Event analytics"]
  }'::jsonb,
  '[
    {"model": "Platform vs. Point Solution", "description": "Full event lifecycle or specific capability?"},
    {"model": "Enterprise vs. SMB", "description": "Large corporate events or small gatherings?"},
    {"model": "In-person vs. Virtual vs. Hybrid", "description": "Which format are you optimizing for?"}
  ]'::jsonb,
  '[
    {"question": "What happens when the internet goes down?", "why_matters": "Tests understanding of event reliability needs"},
    {"question": "How do you measure event ROI?", "why_matters": "Events must prove value"}
  ]'::jsonb,
  '{
    "tam_global": "$50B+ event technology market",
    "growth_rate": "12% CAGR",
    "key_trends": ["Hybrid events as default", "AI matchmaking", "Sustainability tracking", "Event data as marketing asset"]
  }'::jsonb,
  '[
    {"company": "Cvent", "outcome": "$5B+ (acquired)", "lesson": "Full-stack enterprise events platform"},
    {"company": "Eventbrite", "outcome": "$2B+ public company", "lesson": "Self-service events at scale"},
    {"company": "Hopin", "outcome": "Rapid rise and fall, $7.75B to layoffs", "lesson": "Virtual events alone not defensible"}
  ]'::jsonb,
  '[
    {"mistake": "Building for virtual-only", "why_bad": "In-person returned, pure virtual commoditized", "better_approach": "Build for hybrid, support all formats"},
    {"mistake": "Ignoring sponsor needs", "why_bad": "Sponsors fund events, their ROI matters", "better_approach": "Build sponsor tools and lead retrieval"},
    {"mistake": "No integration strategy", "why_bad": "Events connect to marketing, CRM, analytics", "better_approach": "Deep integrations with marketing stack"}
  ]'::jsonb,
  '{
    "key_metrics": ["Attendee satisfaction", "Sponsor ROI", "App adoption rate", "Data capture completeness"],
    "red_flags": ["Virtual-only focus", "No sponsor tools", "Poor integrations", "Low app adoption"],
    "green_flags": ["Hybrid-ready", "Strong sponsor features", "Deep marketing integrations", "High engagement rates"]
  }'::jsonb,
  '[
    {"type": "Event Management", "description": "Full lifecycle event planning and execution"},
    {"type": "Registration", "description": "Ticketing, registration, check-in"},
    {"type": "Virtual Events", "description": "Online event platforms and streaming"},
    {"type": "Event Apps", "description": "Mobile engagement and networking apps"},
    {"type": "Exhibitor/Sponsor", "description": "Sponsor management and lead retrieval"},
    {"type": "Event Analytics", "description": "ROI measurement and event intelligence"}
  ]'::jsonb,
  'Let''s explore your events technology idea. Events are about people and experiences - I''ll ask questions that help you think through the full event lifecycle, hybrid requirements, and proving ROI to event organizers.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
),

-- =============================================================================
-- 13. Retail & Brick-and-Mortar
-- =============================================================================
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
  'retail',
  'Retail & Brick-and-Mortar',
  'Technology for physical retail stores, restaurants, and service businesses',
  'store',
  'You are a retail technology expert who has built products for stores, restaurants, and physical businesses. You understand POS systems, inventory management, and the unique challenges of serving customers in person. You push founders to think about in-store operations and the connection between physical and digital.',
  'You are an expert Retail tech advisor. When reviewing founder responses:
- Challenge assumptions about integration with existing POS systems
- Push for understanding of in-store operations complexity
- Question how the product handles offline/connectivity issues
- Emphasize the importance of staff training and adoption
- Watch for products that ignore physical world constraints
- Ask about inventory accuracy and real-time data',
  '[
    {"term": "POS", "definition": "Point of Sale - the checkout system"},
    {"term": "SKU", "definition": "Stock Keeping Unit - unique product identifier"},
    {"term": "Inventory turnover", "definition": "How often inventory sells and is replaced"},
    {"term": "Shrinkage", "definition": "Inventory loss from theft, damage, or errors"},
    {"term": "Same-store sales", "definition": "Revenue growth for existing locations"},
    {"term": "Omnichannel", "definition": "Unified experience across physical and digital"},
    {"term": "BOPIS", "definition": "Buy Online, Pick Up In Store"},
    {"term": "Clienteling", "definition": "Building personal relationships with customers"}
  ]'::jsonb,
  '[
    {"metric": "POS integration", "seed": "Top 5 systems", "series_a": "Top 10 systems", "why_matters": "Must work with existing POS"},
    {"metric": "Staff adoption", "seed": "70%+ daily use", "series_a": "90%+ daily use", "why_matters": "Staff must use it to work"},
    {"metric": "Inventory accuracy", "seed": "95%+", "series_a": "98%+", "why_matters": "Inaccurate inventory = lost sales"},
    {"metric": "Implementation time", "seed": "<2 weeks", "series_a": "<1 week", "why_matters": "Stores can''t afford downtime"}
  ]'::jsonb,
  '{
    "top_players": ["Square", "Toast", "Shopify POS", "Lightspeed", "NCR"],
    "emerging_threats": ["Square/Toast expanding features", "Shopify retail push"],
    "acquisition_targets": ["Inventory management", "Staff scheduling", "Customer data platforms"]
  }'::jsonb,
  '[
    {"model": "POS vs. Add-on vs. Analytics", "description": "Are you the core system or augmenting it?"},
    {"model": "SMB vs. Enterprise", "description": "Small shops or large retail chains?"},
    {"model": "Vertical vs. Horizontal", "description": "Specific retail type or all retail?"}
  ]'::jsonb,
  '[
    {"question": "What happens when the internet goes out?", "why_matters": "Stores must keep selling offline"},
    {"question": "How do you handle a 16-year-old cashier?", "why_matters": "Tests understanding of frontline staff reality"}
  ]'::jsonb,
  '{
    "tam_global": "$30T+ global retail market",
    "growth_rate": "5% CAGR",
    "key_trends": ["Unified commerce", "AI-powered inventory", "Cashierless checkout", "Experiential retail"]
  }'::jsonb,
  '[
    {"company": "Square", "outcome": "$40B+ (Block)", "lesson": "Start simple, expand to full platform"},
    {"company": "Toast", "outcome": "$10B+ public company", "lesson": "Vertical focus (restaurants) with deep product"},
    {"company": "Shopify POS", "outcome": "Integrated with $200B GMV platform", "lesson": "Omnichannel with strong eCommerce base"}
  ]'::jsonb,
  '[
    {"mistake": "Ignoring offline functionality", "why_bad": "Internet outages happen, stores can''t stop selling", "better_approach": "Build offline-first with smart sync"},
    {"mistake": "Underestimating staff complexity", "why_bad": "High turnover, varying tech skills, time pressure", "better_approach": "Design for 30-second training, simple UX"},
    {"mistake": "No POS integration strategy", "why_bad": "Retailers won''t replace POS for your tool", "better_approach": "Integrate with major POS systems from day one"}
  ]'::jsonb,
  '{
    "key_metrics": ["POS integration coverage", "Staff adoption rate", "Implementation speed", "Offline reliability"],
    "red_flags": ["No POS integrations", "Requires internet for basic functions", "Complex training required", "Long implementation"],
    "green_flags": ["Deep POS integrations", "Offline-capable", "Simple staff UX", "Fast implementation"]
  }'::jsonb,
  '[
    {"type": "Point of Sale", "description": "Checkout and payment processing"},
    {"type": "Inventory Management", "description": "Stock tracking, ordering, warehouse"},
    {"type": "Staff Management", "description": "Scheduling, time tracking, labor"},
    {"type": "Customer Engagement", "description": "Loyalty, clienteling, marketing"},
    {"type": "Analytics", "description": "Sales analytics, foot traffic, optimization"},
    {"type": "Restaurant Tech", "description": "Kitchen, ordering, reservations"}
  ]'::jsonb,
  'Let''s explore your retail technology idea. Physical retail has unique constraints - I''ll ask questions that help you think through POS integration, staff adoption, and the realities of serving customers in physical locations.',
  true,
  1,
  '2026-01-28 10:00:00+00'::timestamptz,
  '2026-01-28 10:00:00+00'::timestamptz
);

-- =============================================================================
-- END OF SEED: Industry Packs
-- =============================================================================
