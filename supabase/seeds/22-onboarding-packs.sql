-- ============================================================================
-- Seed: Onboarding Expert Agent Prompt Packs
-- Source: tasks/prompt-library/16-onboarding-expert-agent.md
-- Contains: 3 prompt packs with ~5 steps total
-- Agent: Onboarding Orchestrator Agent | Model: Gemini 3 Flash + Claude Sonnet 4.5
-- ============================================================================

-- Pack 1: Industry Selection & Problem Discovery
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_onboarding_discovery',
  'Onboarding Discovery',
  'onboarding-discovery',
  'Extract industry classification and deep problem understanding in the first 6 minutes',
  'onboarding',
  ARRAY['idea', 'pre-seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "onboarding-orchestrator", "library_ref": "16-onboarding-expert-agent", "expertise": "industry classification, problem extraction"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_onboarding_discovery', 1, 'Classify industry and sub-vertical',
   E'You are a startup onboarding expert who has onboarded 10,000+ founders.\n\n**Industry Hierarchy:**\n| Industry | Sub-Industries |\n|----------|----------------|\n| FinTech | Payments, Lending, InsurTech, WealthTech, Banking, RegTech, Crypto |\n| Healthcare | HealthTech, MedTech, BioTech, Mental Health, Digital Health, Pharma |\n| SaaS | B2B, B2C, Vertical SaaS, Horizontal SaaS, DevTools, ProductOps |\n| Marketplace | B2C, B2B, P2P, On-demand, Vertical |\n| EdTech | K-12, Higher Ed, Corporate Training, Skill-based, Language |\n| Consumer | E-commerce, Social, Entertainment, Gaming, Lifestyle |\n| Enterprise | Security, Data, Analytics, Collaboration, HR, Finance |\n| Climate | Energy, AgTech, CleanTech, Carbon, Mobility |\n| PropTech | Residential, Commercial, Construction, Property Management |\n| Logistics | Supply Chain, Last Mile, Freight, Warehousing |\n| AI/ML | Infrastructure, Applications, Vertical AI, Agents |\n| Hardware | Consumer, Industrial, IoT, Robotics |\n\n**Business Description:**\n{{business_description}}\n\nClassify the industry and sub-vertical, then load appropriate industry context.',
   '{"business_description": "string"}'::jsonb,
   '{"industry_id": "string", "sub_industry": "string", "industry_context": "object", "next_step_guidance": "string"}'::jsonb,
   'gemini', 1500, 0.2),

  ('pack_onboarding_discovery', 2, 'Extract deep problem statement',
   E'You are extracting a deep, validated problem statement.\n\n**Problem Discovery Framework:**\n| Layer | Question | Purpose |\n|-------|----------|---------|\n| Surface | "What problem are you solving?" | Get initial framing |\n| Who | "Who has this problem?" | Identify customer |\n| Struggle | "What''s the biggest frustration?" | Find pain point |\n| Impact | "What does this cost them?" | Quantify pain |\n| Frequency | "How often does this happen?" | Assess urgency |\n| Alternatives | "What do they do today?" | Understand landscape |\n| Why now | "Why hasn''t this been solved?" | Find timing |\n\n**Industry-Specific Questions:**\n| Industry | Unique Questions |\n|----------|------------------|\n| FinTech | "Regulatory challenges?", "Trust factor?" |\n| Healthcare | "Clinical evidence?", "Who pays?" |\n| SaaS | "Tools replaced?", "Switching cost?" |\n| Marketplace | "Supply or demand harder?", "Quality?" |\n\n**Validation Signals:**\n| Signal | Strong | Weak |\n|--------|--------|------|\n| Specificity | "SMBs with 5-50 employees" | "Everyone" |\n| Quantification | "Costs $4K/month" | "Costs money" |\n| Frequency | "Every week" | "Once a year" |\n| Willingness to pay | "Would pay $100/month" | "Would be nice" |\n\n**Initial Input:**\nIndustry: {{industry_id}}\nBusiness: {{business_description}}\nProblem description: {{raw_problem}}\n\nExtract and sharpen the problem statement.',
   '{"industry_id": "string", "business_description": "string", "raw_problem": "string"}'::jsonb,
   '{"problem_statement": "string", "customer_profile": "object", "pain_quantification": "object", "current_alternatives": "array", "why_now": "string", "validation_confidence": "number"}'::jsonb,
   'claude', 2000, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 2: Founder-Market Fit Assessment
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_founder_fit_assessment',
  'Founder-Market Fit Assessment',
  'founder-fit-assessment',
  'Assess founder-market fit with scoring and gap identification',
  'onboarding',
  ARRAY['idea', 'pre-seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "onboarding-orchestrator", "library_ref": "16-onboarding-expert-agent", "expertise": "founder assessment, unfair advantages"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_founder_fit_assessment', 1, 'Assess founder-market fit',
   E'You are assessing founder-market fit.\n\n**Fit Dimensions:**\n| Dimension | Questions | Scoring |\n|-----------|-----------|--------|\n| Personal Connection | "Why do YOU care?" | 1-10 |\n| Domain Expertise | "What specific experience?" | 1-10 |\n| Network Access | "Who can you reach?" | 1-10 |\n| Unique Insight | "What do you believe others don''t?" | 1-10 |\n| Commitment Level | "What have you sacrificed?" | 1-10 |\n\n**Fit Scoring Guide:**\n| Score | Meaning | Example |\n|-------|---------|--------|\n| 9-10 | Perfect fit | Built payments at Stripe, now solving payment problem |\n| 7-8 | Strong fit | Worked in industry 5+ years, saw problem firsthand |\n| 5-6 | Moderate fit | Studied domain, talked to customers extensively |\n| 3-4 | Weak fit | Interested, but no direct experience |\n| 1-2 | No fit | Just seems like a good opportunity |\n\n**Industry-Specific Fit Signals:**\n| Industry | Strong Fit Signals |\n|----------|-------------------|\n| FinTech | Ex-banker, compliance experience, finance background |\n| Healthcare | Clinician, health system operator, patient experience |\n| SaaS | Built SaaS before, worked at target company type |\n| Marketplace | Operated one side of existing marketplace |\n| EdTech | Educator, administrator, or deeply affected learner |\n\n**Founder Information:**\nName: {{founder_name}}\nBackground: {{founder_background}}\nProblem: {{problem_statement}}\nConnection to problem: {{connection_to_problem}}\n\nAssess founder-market fit with scoring.',
   '{"founder_name": "string", "founder_background": "string", "problem_statement": "string", "connection_to_problem": "string"}'::jsonb,
   '{"fit_score": "number", "score_breakdown": "object", "advantages": "array", "gaps": "array", "verdict": "string", "enhancement_suggestions": "array"}'::jsonb,
   'gemini', 2000, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 3: One-Liner Generation & Profile Assembly
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_oneliner_profile',
  'One-Liner & Profile Assembly',
  'oneliner-profile-assembly',
  'Generate memorable one-liner and complete startup profile',
  'onboarding',
  ARRAY['idea', 'pre-seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "onboarding-orchestrator", "library_ref": "16-onboarding-expert-agent", "expertise": "copywriting, pitch writing"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_oneliner_profile', 1, 'Generate one-liner options',
   E'You are crafting a memorable, investor-ready one-liner.\n\n**One-Liner Formulas:**\n| Formula | Template | Example |\n|---------|----------|---------|\n| X for Y | "[Known company] for [new market]" | "Stripe for cross-border B2B" |\n| Category Killer | "The [category] that [differentiation]" | "The CRM that closes deals" |\n| Outcome-First | "[Outcome] for [customer]" | "10x faster payments for SMBs" |\n| Problem Solver | "[Problem eliminated] for [customer]" | "No more payment delays" |\n| Transformation | "Turn [before] into [after]" | "Turn manual invoicing into cash flow" |\n\n**Quality Tests:**\n| Test | Pass | Fail |\n|------|------|------|\n| Clarity | 5-year-old gets it | Requires explanation |\n| Specificity | One market, one problem | Generic |\n| Memorability | Sticks after hearing once | Forgettable |\n| Differentiation | Clearly different | Sounds like competitors |\n| Credibility | Believable | Sounds like hype |\n\n**Industry-Aware Patterns:**\n| Industry | Pattern | Example |\n|----------|---------|--------|\n| FinTech | Lead with trust/compliance | "The compliant way to do X" |\n| Healthcare | Lead with outcomes | "Better patient outcomes through X" |\n| SaaS | Lead with workflow | "X that runs itself" |\n| Marketplace | Lead with connection | "Platform that connects X to Y" |\n\n**Company Profile:**\nIndustry: {{industry_id}}\nProblem: {{problem_statement}}\nCustomer: {{customer_profile}}\nSolution: {{solution_summary}}\nFounder advantage: {{unfair_advantage}}\n\nGenerate 5 one-liner options.',
   '{"industry_id": "string", "problem_statement": "string", "customer_profile": "string", "solution_summary": "string", "unfair_advantage": "string"}'::jsonb,
   '{"one_liner_options": "array", "recommended": "string", "elevator_pitch_30s": "string", "hook_line": "string"}'::jsonb,
   'claude', 2000, 0.6),

  ('pack_oneliner_profile', 2, 'Assemble complete startup profile',
   E'You are assembling the complete startup profile from onboarding.\n\n**Profile Schema:**\n| Field | Source | Used In |\n|-------|--------|---------|\n| industry_id | Industry selection | All flows, knowledge injection |\n| sub_industry | Industry selection | Specific benchmarks |\n| problem_statement | Problem discovery | Canvas, Pitch |\n| customer_profile | Problem discovery | Canvas, Pitch |\n| pain_quantification | Problem discovery | Validation, Pitch |\n| why_now | Problem discovery | Pitch |\n| founder_fit_score | Fit assessment | Internal |\n| unfair_advantages | Fit assessment | Pitch, Canvas |\n| one_liner | One-liner generation | Pitch, Canvas, everywhere |\n| elevator_pitch | One-liner generation | Pitch, outreach |\n\n**Completeness Score:**\n| Section | Weight | Complete Criteria |\n|---------|--------|-------------------|\n| Industry | 10% | Industry + sub selected |\n| Problem | 30% | Problem, customer, quantification, why now |\n| Founder | 20% | Fit score, advantages, gaps |\n| One-liner | 20% | One-liner, variations |\n| Solution | 20% | Filled in Canvas or Pitch |\n\n**Profile Data:**\nIndustry: {{industry_id}}\nSub-industry: {{sub_industry}}\nProblem: {{problem_statement}}\nCustomer: {{customer_profile}}\nQuantification: {{pain_quantification}}\nWhy now: {{why_now}}\nFounder fit: {{founder_fit_score}}\nAdvantages: {{unfair_advantages}}\nOne-liner: {{one_liner}}\nElevator pitch: {{elevator_pitch}}\n\nAssemble and validate the complete profile.',
   '{"industry_id": "string", "sub_industry": "string", "problem_statement": "string", "customer_profile": "string", "pain_quantification": "string", "why_now": "string", "founder_fit_score": "string", "unfair_advantages": "string", "one_liner": "string", "elevator_pitch": "string"}'::jsonb,
   '{"complete_profile": "object", "completeness_score": "number", "missing_fields": "array", "next_steps": "array", "canvas_prefill": "object", "pitch_prefill": "object"}'::jsonb,
   'gemini', 2500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Verification
SELECT 'Onboarding packs seeded: ' || COUNT(DISTINCT id) || ' packs' as result
FROM prompt_packs 
WHERE metadata->>'agent' = 'onboarding-orchestrator';
