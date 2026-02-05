/**
 * Validation Agent Edge Function
 *
 * Handles assumption mapping, experiment design, and customer discovery insights.
 * Supports the lean startup validation workflow:
 * 1. Extract assumptions from lean canvas
 * 2. Design experiments to test assumptions
 * 3. Analyze interview transcripts for insights
 * 4. Update assumption status based on evidence
 *
 * @module validation-agent
 */

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { requireAuth, UserContext } from '../_shared/auth.ts';
import { getStartupContext, create, update, getById } from '../_shared/database.ts';
import {
  createHandler,
  successResponse,
  errorResponse,
  validateRequired,
  validateUUID,
  ValidationError,
  NotFoundError,
} from '../_shared/errors.ts';
import {
  callGemini,
  callClaude,
  parseAIJson,
  calculateCost,
  MODELS,
  AIResponse,
} from '../_shared/ai-client.ts';
import {
  Assumption,
  Experiment,
  InterviewInsight,
  CustomerSegment,
  JobToBeDone,
  CustomerForce,
} from '../_shared/types.ts';
import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

// =============================================================================
// Types
// =============================================================================

interface RequestBody {
  action: string;
  startup_id?: string;
  lean_canvas_id?: string;
  assumption_id?: string;
  experiment_id?: string;
  interview_id?: string;
  segment_id?: string;
  data?: Record<string, unknown>;
}

// =============================================================================
// AI Prompts
// =============================================================================

const ASSUMPTION_EXTRACTION_PROMPT = `You are an expert at identifying riskiest assumptions in startup business models.

Analyze the lean canvas and extract the key assumptions that need validation. Focus on:
1. Problem assumptions - Is this a real pain point?
2. Solution assumptions - Does our solution address the pain?
3. Customer segment assumptions - Are these the right customers?
4. Channel assumptions - Can we reach them this way?
5. Revenue assumptions - Will they pay this amount?
6. Unfair advantage assumptions - Is this really defensible?

For each assumption:
- Write it as a clear, testable statement
- Score impact (1-10): How much would being wrong hurt the business?
- Score uncertainty (1-10): How confident are we this is true?
- Suggest validation criteria

Return JSON:
{
  "assumptions": [
    {
      "statement": "clear testable assumption",
      "source_block": "problem|solution|uvp|customer_segments|channels|revenue_streams|cost_structure|key_metrics|unfair_advantage",
      "impact_score": 8,
      "uncertainty_score": 7,
      "validation_criteria": "How we would know this is true/false",
      "tags": ["customer", "pricing", "market"]
    }
  ],
  "riskiest_assumption": "The single riskiest assumption that should be tested first",
  "recommendation": "Suggested next step for validation"
}`;

const EXPERIMENT_DESIGN_PROMPT = `You are an expert at designing lean experiments to test startup assumptions.

Design an experiment to test this assumption:
ASSUMPTION: {{assumption}}

Consider these experiment types:
- smoke_test: Fake door test with signup
- landing_page: Test value prop with real traffic
- survey: Quick quantitative validation
- interview: Deep qualitative insights
- prototype: Test usability/desirability
- mvp: Minimum viable product test
- ab_test: Compare variations
- concierge: Manual delivery to validate value
- wizard_of_oz: Manual backend, real frontend

For the chosen experiment:
- Define a clear, measurable hypothesis
- Specify the key metric to track
- Set a target value (success threshold)
- Estimate required sample size
- List specific steps to run it

Return JSON:
{
  "experiment_type": "interview",
  "hypothesis": "If we [action], then [outcome] because [reason]",
  "metric": "Specific measurable metric",
  "target_value": 0.6,
  "sample_size": 10,
  "duration_days": 7,
  "steps": ["Step 1", "Step 2", "Step 3"],
  "success_criteria": "What would prove the assumption true",
  "failure_criteria": "What would prove it false",
  "estimated_cost": "Low/Medium/High"
}`;

const INTERVIEW_ANALYSIS_PROMPT = `You are an expert at extracting actionable insights from customer interviews.

Analyze this interview transcript and extract key insights:

TRANSCRIPT:
{{transcript}}

STARTUP CONTEXT:
{{context}}

ASSUMPTIONS BEING TESTED:
{{assumptions}}

Extract these insight types:
- pain_point: Problems customers mention
- desired_outcome: What they want to achieve
- current_behavior: How they solve the problem now
- switching_trigger: What would make them switch
- objection: Concerns about our solution
- feature_request: Specific feature asks
- competitor_mention: References to alternatives
- pricing_feedback: Reactions to pricing
- aha_moment: Moments of strong interest
- job_to_be_done: Underlying jobs they're hiring for

For each insight:
- Extract the exact quote when possible
- Score confidence (0-1) in the interpretation
- Score importance (1-10)
- Identify sentiment (positive/negative/neutral/mixed)
- Link to relevant assumptions

Return JSON:
{
  "insights": [
    {
      "insight_type": "pain_point",
      "insight": "Synthesized insight statement",
      "source_quote": "Exact quote from transcript",
      "confidence": 0.85,
      "importance": 8,
      "sentiment": "negative",
      "linked_assumption_ids": ["uuid1", "uuid2"],
      "supports_assumptions": false,
      "tags": ["onboarding", "ux"]
    }
  ],
  "summary": "Overall interview summary (2-3 sentences)",
  "key_quotes": ["Top 3 most impactful quotes"],
  "sentiment_overall": "positive|negative|neutral|mixed",
  "recommendation": "Suggested next action based on findings"
}`;

const SEGMENT_ANALYSIS_PROMPT = `You are an expert at customer segmentation and persona development.

Analyze the interview data and create/refine customer segment profiles:

STARTUP CONTEXT:
{{context}}

INTERVIEW INSIGHTS:
{{insights}}

Build comprehensive segment profiles with:
- Demographics: Age, location, role, income
- Psychographics: Values, interests, attitudes
- Firmographics (B2B): Company size, industry, tech stack
- Pain points: Top 3-5 recurring problems
- Jobs to be done: Functional, emotional, social jobs
- Current solutions: How they solve problems today

Also analyze the Four Forces of Progress:
- Push: What's pushing them away from current solution?
- Pull: What's pulling them toward our solution?
- Inertia: What habits/investments keep them from switching?
- Friction: What concerns/anxieties slow adoption?

Return JSON:
{
  "segment": {
    "name": "Segment name",
    "description": "One-line description",
    "demographics": { "age_range": "", "location": "", "role": "" },
    "psychographics": { "values": [], "interests": [], "lifestyle": "" },
    "firmographics": { "company_size": "", "industry": "", "tech_stack": [] },
    "pain_points": ["Pain 1", "Pain 2"],
    "current_solutions": ["Solution 1", "Solution 2"]
  },
  "jobs_to_be_done": [
    {
      "job_type": "functional|emotional|social",
      "situation": "When I...",
      "motivation": "I want to...",
      "expected_outcome": "So I can...",
      "importance": 8,
      "current_satisfaction": 4
    }
  ],
  "forces": [
    { "force_type": "push", "description": "...", "intensity": 8 },
    { "force_type": "pull", "description": "...", "intensity": 7 },
    { "force_type": "inertia", "description": "...", "intensity": 5 },
    { "force_type": "friction", "description": "...", "intensity": 4 }
  ],
  "net_force_score": 6,
  "recommendation": "Segment-specific recommendation"
}`;

// =============================================================================
// Action Handlers
// =============================================================================

/**
 * Extract assumptions from lean canvas
 */
async function extractAssumptions(
  supabase: SupabaseClient,
  user: UserContext,
  startupId: string,
  leanCanvasId?: string
): Promise<Record<string, unknown>> {
  // Get lean canvas (current or specific version)
  let canvas;
  if (leanCanvasId) {
    canvas = await getById(supabase, 'lean_canvases', leanCanvasId);
  } else {
    const { data } = await supabase
      .from('lean_canvases')
      .select('*')
      .eq('startup_id', startupId)
      .eq('is_current', true)
      .single();
    canvas = data;
  }

  if (!canvas) {
    throw new NotFoundError('Lean Canvas', leanCanvasId);
  }

  // Get startup context
  const context = await getStartupContext(supabase, startupId);

  // Build prompt with canvas data
  const prompt = `${ASSUMPTION_EXTRACTION_PROMPT}

LEAN CANVAS:
${JSON.stringify(canvas, null, 2)}

STARTUP CONTEXT:
- Name: ${context.startup_name}
- Industry: ${context.industry}
- Stage: ${context.stage}
- Target Market: ${context.target_market}`;

  // Call AI
  const response = await callGemini(prompt, {
    jsonMode: true,
    maxTokens: 2000,
  });

  const result = parseAIJson<{
    assumptions: Array<{
      statement: string;
      source_block: string;
      impact_score: number;
      uncertainty_score: number;
      validation_criteria: string;
      tags: string[];
    }>;
    riskiest_assumption: string;
    recommendation: string;
  }>(response);

  if (!result) {
    throw new Error('Failed to parse AI response');
  }

  // Save assumptions to database
  const created: Assumption[] = [];
  for (const assumption of result.assumptions) {
    const saved = await create<Assumption>(supabase, 'assumptions', {
      startup_id: startupId,
      lean_canvas_id: canvas.id,
      statement: assumption.statement,
      source_block: assumption.source_block,
      impact_score: assumption.impact_score,
      uncertainty_score: assumption.uncertainty_score,
      validation_criteria: assumption.validation_criteria,
      tags: assumption.tags,
      status: 'untested',
      ai_generated: true,
    });
    created.push(saved);
  }

  // Log AI run
  await logAIRun(supabase, user, 'extract_assumptions', response, startupId);

  return {
    assumptions: created,
    riskiest_assumption: result.riskiest_assumption,
    recommendation: result.recommendation,
    ai_model: response.model,
  };
}

/**
 * Design experiment for an assumption
 */
async function designExperiment(
  supabase: SupabaseClient,
  user: UserContext,
  startupId: string,
  assumptionId: string
): Promise<Record<string, unknown>> {
  // Get assumption
  const assumption = await getById<Assumption>(supabase, 'assumptions', assumptionId);
  if (!assumption) {
    throw new NotFoundError('Assumption', assumptionId);
  }

  // Get startup context
  const context = await getStartupContext(supabase, startupId);

  // Build prompt
  const prompt = EXPERIMENT_DESIGN_PROMPT
    .replace('{{assumption}}', assumption.statement) +
    `\n\nSTARTUP CONTEXT:
- Name: ${context.startup_name}
- Industry: ${context.industry}
- Stage: ${context.stage}`;

  // Use Claude for more nuanced experiment design
  const response = await callClaude(prompt, {
    maxTokens: 1500,
  });

  const result = parseAIJson<{
    experiment_type: string;
    hypothesis: string;
    metric: string;
    target_value: number;
    sample_size: number;
    duration_days: number;
    steps: string[];
    success_criteria: string;
    failure_criteria: string;
  }>(response);

  if (!result) {
    throw new Error('Failed to parse AI response');
  }

  // Create experiment
  const experiment = await create<Experiment>(supabase, 'experiments', {
    startup_id: startupId,
    assumption_id: assumptionId,
    experiment_type: result.experiment_type,
    hypothesis: result.hypothesis,
    metric: result.metric,
    target_value: result.target_value,
    status: 'planned',
    tags: [],
    ai_generated: true,
  });

  // Update assumption with linked experiment
  const currentLinks = assumption.linked_experiment_ids || [];
  await update(supabase, 'assumptions', assumptionId, {
    linked_experiment_ids: [...currentLinks, experiment.id],
    status: 'testing',
  });

  // Log AI run
  await logAIRun(supabase, user, 'design_experiment', response, startupId);

  return {
    experiment,
    steps: result.steps,
    success_criteria: result.success_criteria,
    failure_criteria: result.failure_criteria,
    duration_days: result.duration_days,
    ai_model: response.model,
  };
}

/**
 * Analyze interview transcript
 */
async function analyzeInterview(
  supabase: SupabaseClient,
  user: UserContext,
  startupId: string,
  interviewId: string
): Promise<Record<string, unknown>> {
  // Get interview
  const interview = await getById(supabase, 'interviews', interviewId);
  if (!interview) {
    throw new NotFoundError('Interview', interviewId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interviewData = interview as any;

  if (!interviewData.transcript) {
    throw new ValidationError('Interview has no transcript to analyze');
  }

  // Get startup context
  const context = await getStartupContext(supabase, startupId);

  // Get assumptions for linking
  const { data: assumptions } = await supabase
    .from('assumptions')
    .select('id, statement, status')
    .eq('startup_id', startupId)
    .in('status', ['untested', 'testing']);

  // Build prompt
  const prompt = INTERVIEW_ANALYSIS_PROMPT
    .replace('{{transcript}}', interviewData.transcript)
    .replace('{{context}}', JSON.stringify(context, null, 2))
    .replace('{{assumptions}}', JSON.stringify(assumptions || [], null, 2));

  // Call AI
  const response = await callGemini(prompt, {
    jsonMode: true,
    maxTokens: 3000,
  });

  const result = parseAIJson<{
    insights: Array<{
      insight_type: string;
      insight: string;
      source_quote: string | null;
      confidence: number;
      importance: number;
      sentiment: string;
      linked_assumption_ids: string[];
      supports_assumptions: boolean;
      tags: string[];
    }>;
    summary: string;
    key_quotes: string[];
    sentiment_overall: string;
    recommendation: string;
  }>(response);

  if (!result) {
    throw new Error('Failed to parse AI response');
  }

  // Save insights
  const createdInsights: InterviewInsight[] = [];
  for (const insight of result.insights) {
    // Validate linked assumption IDs exist
    const validAssumptionIds = insight.linked_assumption_ids.filter(id =>
      assumptions?.some(a => a.id === id)
    );

    const saved = await create<InterviewInsight>(supabase, 'interview_insights', {
      interview_id: interviewId,
      insight_type: insight.insight_type,
      insight: insight.insight,
      source_quote: insight.source_quote,
      confidence: insight.confidence,
      importance: insight.importance,
      sentiment: insight.sentiment,
      linked_assumption_ids: validAssumptionIds,
      supports_assumptions: insight.supports_assumptions,
      tags: insight.tags,
      ai_model: response.model,
    });
    createdInsights.push(saved);
  }

  // Update interview with analysis
  await update(supabase, 'interviews', interviewId, {
    ai_analyzed: true,
    ai_analyzed_at: new Date().toISOString(),
    ai_summary: result.summary,
    ai_sentiment: result.sentiment_overall,
    ai_key_quotes: result.key_quotes,
  });

  // Log AI run
  await logAIRun(supabase, user, 'analyze_interview', response, startupId);

  return {
    insights: createdInsights,
    summary: result.summary,
    key_quotes: result.key_quotes,
    sentiment: result.sentiment_overall,
    recommendation: result.recommendation,
    ai_model: response.model,
  };
}

/**
 * Analyze customer segment from interviews
 */
async function analyzeSegment(
  supabase: SupabaseClient,
  user: UserContext,
  startupId: string,
  segmentId?: string
): Promise<Record<string, unknown>> {
  // Get startup context
  const context = await getStartupContext(supabase, startupId);

  // Get insights from recent interviews
  const { data: insights } = await supabase
    .from('interview_insights')
    .select(`
      *,
      interviews!inner(startup_id, segment_id)
    `)
    .eq('interviews.startup_id', startupId)
    .order('importance', { ascending: false })
    .limit(50);

  if (!insights || insights.length === 0) {
    throw new ValidationError('No interview insights found. Analyze some interviews first.');
  }

  // Build prompt
  const prompt = SEGMENT_ANALYSIS_PROMPT
    .replace('{{context}}', JSON.stringify(context, null, 2))
    .replace('{{insights}}', JSON.stringify(insights, null, 2));

  // Call AI
  const response = await callGemini(prompt, {
    jsonMode: true,
    maxTokens: 2500,
  });

  const result = parseAIJson<{
    segment: {
      name: string;
      description: string;
      demographics: Record<string, unknown>;
      psychographics: Record<string, unknown>;
      firmographics: Record<string, unknown>;
      pain_points: string[];
      current_solutions: string[];
    };
    jobs_to_be_done: Array<{
      job_type: string;
      situation: string;
      motivation: string;
      expected_outcome: string;
      importance: number;
      current_satisfaction: number;
    }>;
    forces: Array<{
      force_type: string;
      description: string;
      intensity: number;
    }>;
    net_force_score: number;
    recommendation: string;
  }>(response);

  if (!result) {
    throw new Error('Failed to parse AI response');
  }

  // Create or update segment
  let segment: CustomerSegment;
  if (segmentId) {
    segment = await update<CustomerSegment>(supabase, 'customer_segments', segmentId, {
      name: result.segment.name,
      description: result.segment.description,
      demographics: result.segment.demographics,
      psychographics: result.segment.psychographics,
      firmographics: result.segment.firmographics,
      pain_points: result.segment.pain_points,
      current_solutions: result.segment.current_solutions,
    });
  } else {
    segment = await create<CustomerSegment>(supabase, 'customer_segments', {
      startup_id: startupId,
      name: result.segment.name,
      description: result.segment.description,
      is_primary: true,
      demographics: result.segment.demographics,
      psychographics: result.segment.psychographics,
      firmographics: result.segment.firmographics,
      pain_points: result.segment.pain_points,
      current_solutions: result.segment.current_solutions,
      jobs_to_be_done: result.jobs_to_be_done.map(j =>
        `When I ${j.situation}, I want to ${j.motivation} so I can ${j.expected_outcome}`
      ),
      validated: false,
      priority: 1,
    });
  }

  // Create jobs to be done
  const jobs: JobToBeDone[] = [];
  for (const job of result.jobs_to_be_done) {
    const created = await create<JobToBeDone>(supabase, 'jobs_to_be_done', {
      segment_id: segment.id,
      job_type: job.job_type,
      situation: job.situation,
      motivation: job.motivation,
      expected_outcome: job.expected_outcome,
      importance: job.importance,
      current_satisfaction: job.current_satisfaction,
      ai_generated: true,
    });
    jobs.push(created);
  }

  // Create customer forces
  const forces: CustomerForce[] = [];
  for (const force of result.forces) {
    const created = await create<CustomerForce>(supabase, 'customer_forces', {
      segment_id: segment.id,
      force_type: force.force_type,
      description: force.description,
      intensity: force.intensity,
    });
    forces.push(created);
  }

  // Log AI run
  await logAIRun(supabase, user, 'analyze_segment', response, startupId);

  return {
    segment,
    jobs_to_be_done: jobs,
    forces,
    net_force_score: result.net_force_score,
    recommendation: result.recommendation,
    ai_model: response.model,
  };
}

/**
 * Update assumption status based on experiment results
 */
async function updateAssumptionStatus(
  supabase: SupabaseClient,
  user: UserContext,
  assumptionId: string,
  status: string,
  evidence?: string
): Promise<Record<string, unknown>> {
  validateUUID(assumptionId, 'assumption_id');

  const validStatuses = ['untested', 'testing', 'validated', 'invalidated', 'pivoted'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const assumption = await update<Assumption>(supabase, 'assumptions', assumptionId, {
    status,
    evidence: evidence || undefined,
    updated_at: new Date().toISOString(),
  });

  return { assumption };
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Log AI run for analytics
 */
async function logAIRun(
  supabase: SupabaseClient,
  user: UserContext,
  action: string,
  response: AIResponse,
  startupId?: string
): Promise<void> {
  try {
    await supabase.from('ai_runs').insert({
      user_id: user.userId,
      org_id: user.orgId,
      startup_id: startupId,
      agent_name: 'ValidationAgent',
      action,
      model: response.model,
      provider: response.provider,
      input_tokens: response.inputTokens,
      output_tokens: response.outputTokens,
      cost_usd: calculateCost(response),
      duration_ms: response.latencyMs,
      status: 'completed',
    });
  } catch (e) {
    console.error('Failed to log AI run:', e);
  }
}

// =============================================================================
// Main Handler
// =============================================================================

Deno.serve(createHandler(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Require authentication
  const { user, supabase } = await requireAuth(req);

  // Parse request body
  const body: RequestBody = await req.json();
  const { action, startup_id, lean_canvas_id, assumption_id, experiment_id, interview_id, segment_id, data } = body;

  console.log(`[Validation Agent] Action: ${action}, User: ${user.userId}`);

  // Validate startup_id for most actions
  if (action !== 'update_assumption_status' && !startup_id) {
    throw new ValidationError('startup_id is required');
  }

  let result: Record<string, unknown>;

  switch (action) {
    case 'extract_assumptions':
      result = await extractAssumptions(supabase, user, startup_id!, lean_canvas_id);
      break;

    case 'design_experiment':
      if (!assumption_id) throw new ValidationError('assumption_id is required');
      result = await designExperiment(supabase, user, startup_id!, assumption_id);
      break;

    case 'analyze_interview':
      if (!interview_id) throw new ValidationError('interview_id is required');
      result = await analyzeInterview(supabase, user, startup_id!, interview_id);
      break;

    case 'analyze_segment':
      result = await analyzeSegment(supabase, user, startup_id!, segment_id);
      break;

    case 'update_assumption_status':
      if (!assumption_id) throw new ValidationError('assumption_id is required');
      if (!data?.status) throw new ValidationError('status is required in data');
      result = await updateAssumptionStatus(
        supabase,
        user,
        assumption_id,
        data.status as string,
        data.evidence as string | undefined
      );
      break;

    default:
      throw new ValidationError(`Unknown action: ${action}`);
  }

  return successResponse(result);
}));
