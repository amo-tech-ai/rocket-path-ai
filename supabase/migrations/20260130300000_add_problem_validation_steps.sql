-- Add steps to pack_problem_validation
-- This pack had ZERO steps, causing 400 errors when trying to execute Deep Analysis

-- Step 1: Validate problem clarity and urgency
INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  (
    gen_random_uuid(),
    'pack_problem_validation',
    1,
    'Validate problem clarity and urgency',
    E'Analyze this startup''s problem statement for clarity and market urgency.\n\nStartup: {{COMPANY_NAME}}\nProblem: {{PROBLEM_STATEMENT}}\nTarget Market: {{TARGET_MARKET}}\nIndustry: {{INDUSTRY}}\n\n{{INDUSTRY_CONTEXT}}\n\nEvaluate:\n1. Is the problem clearly defined?\n2. Is this a real pain point for the target market?\n3. How urgent is this problem?\n4. What evidence supports the problem exists?\n\nReturn JSON:\n{\n  "problem_score": "number 0-100",\n  "clarity_rating": "string - clear/unclear/partial",\n  "urgency_level": "string - high/medium/low",\n  "evidence_strength": "string - strong/moderate/weak",\n  "red_flags": ["string array - concerns"],\n  "recommendations": ["string array - improvements"]\n}',
    '{"company_name": "string", "problem_statement": "string", "target_market": "string", "industry": "string"}',
    '{"problem_score": "number", "clarity_rating": "string", "urgency_level": "string", "evidence_strength": "string", "red_flags": "array", "recommendations": "array"}',
    'gemini',
    1500,
    1.0
  )
ON CONFLICT (id) DO NOTHING;

-- Step 2: Market validation check
INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  (
    gen_random_uuid(),
    'pack_problem_validation',
    2,
    'Market validation check',
    E'Validate the market opportunity for this problem.\n\nStartup: {{COMPANY_NAME}}\nProblem: {{PROBLEM_STATEMENT}}\nTarget Market: {{TARGET_MARKET}}\nIndustry: {{INDUSTRY}}\n\n{{INDUSTRY_CONTEXT}}\n\nAnalyze:\n1. Market size potential\n2. Competitive landscape\n3. Timing factors\n4. Barriers to entry\n\nReturn JSON:\n{\n  "market_score": "number 0-100",\n  "tam_estimate": "string",\n  "competition_level": "string - high/medium/low",\n  "timing_assessment": "string",\n  "key_barriers": ["string array"],\n  "opportunities": ["string array"]\n}',
    '{"company_name": "string", "problem_statement": "string", "target_market": "string", "industry": "string"}',
    '{"market_score": "number", "tam_estimate": "string", "competition_level": "string", "timing_assessment": "string", "key_barriers": "array", "opportunities": "array"}',
    'gemini',
    1500,
    1.0
  )
ON CONFLICT (id) DO NOTHING;

-- Step 3: Generate validation verdict
INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  (
    gen_random_uuid(),
    'pack_problem_validation',
    3,
    'Generate validation verdict',
    E'Provide final validation verdict for this startup.\n\nProblem Analysis: {{STEP_1_OUTPUT}}\nMarket Analysis: {{STEP_2_OUTPUT}}\n\nSynthesize findings into actionable recommendations.\n\nReturn JSON:\n{\n  "overall_score": "number 0-100",\n  "verdict": "string - proceed/pivot/pause",\n  "summary": "string - 2-3 sentence summary",\n  "next_steps": [{"action": "string", "priority": "high/medium/low", "rationale": "string"}],\n  "concerns": ["string array"],\n  "strengths": ["string array"]\n}',
    '{"step_1_output": "object", "step_2_output": "object"}',
    '{"overall_score": "number", "verdict": "string", "summary": "string", "next_steps": "array", "concerns": "array", "strengths": "array"}',
    'claude',
    2000,
    1.0
  )
ON CONFLICT (id) DO NOTHING;

-- Verify steps were added
DO $$
DECLARE
  step_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO step_count
  FROM prompt_pack_steps
  WHERE pack_id = 'pack_problem_validation';

  IF step_count < 3 THEN
    RAISE NOTICE 'Warning: pack_problem_validation has % steps (expected 3)', step_count;
  ELSE
    RAISE NOTICE 'Success: pack_problem_validation now has % steps', step_count;
  END IF;
END $$;
