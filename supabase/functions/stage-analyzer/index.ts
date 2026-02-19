/**
 * Stage Analyzer Edge Function
 * Analyze startup stage, criteria, and transition readiness.
 * Migrated to shared patterns: JWT auth, rate limiting, shared CORS.
 *
 * Actions:
 * - analyze_stage: Determine current stage from metrics (auth required)
 * - get_stage_criteria: Return criteria for each stage (public — static data)
 * - suggest_stage_transition: Check if ready for next stage (auth required)
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

type StartupStage = 'ideation' | 'validation' | 'mvp' | 'growth' | 'scale';

interface AuthContext {
  userId: string;
  startupId: string;
}

interface StageAnalysisResult {
  current_stage: StartupStage;
  detected_stage: StartupStage;
  score: number;
  category_scores: Record<string, number>;
  missing_for_next_stage: string[];
  ready_for_transition: boolean;
  recommendations: string[];
  next_stage: StartupStage | null;
}

interface StageCriteria {
  stage: StartupStage;
  label: string;
  minScore: number;
  requirements: string[];
  description: string;
}

interface StartupMetrics {
  // Ideation (0-20)
  has_pitch_deck: boolean;
  has_business_model: boolean;
  has_market_research: boolean;
  has_competitor_analysis: boolean;

  // Validation (20-40)
  customer_interviews: number;
  has_prototype: boolean;
  has_landing_page: boolean;
  waitlist_signups: number;

  // MVP (40-60)
  has_product: boolean;
  active_users: number;
  has_feedback_loop: boolean;
  feature_releases: number;

  // Growth (60-80)
  mrr: number;
  team_size: number;
  has_marketing: boolean;
  month_over_month_growth: number;

  // Scale (80-100)
  funding_raised: number;
  growth_rate: number;
  has_expansion_plan: boolean;
  has_partnerships: boolean;
}

const STAGE_CRITERIA: Record<StartupStage, StageCriteria> = {
  ideation: {
    stage: 'ideation',
    label: 'Ideation',
    minScore: 0,
    requirements: ['has_idea', 'has_target_market'],
    description: 'Exploring problem space and initial concept',
  },
  validation: {
    stage: 'validation',
    label: 'Validation',
    minScore: 20,
    requirements: ['has_pitch_deck', 'has_market_research', 'customer_interviews'],
    description: 'Testing assumptions with potential customers',
  },
  mvp: {
    stage: 'mvp',
    label: 'MVP',
    minScore: 40,
    requirements: ['has_product', 'has_users', 'has_feedback'],
    description: 'Building and iterating on first product version',
  },
  growth: {
    stage: 'growth',
    label: 'Growth',
    minScore: 60,
    requirements: ['has_revenue', 'has_team', 'has_metrics'],
    description: 'Scaling customer acquisition and revenue',
  },
  scale: {
    stage: 'scale',
    label: 'Scale',
    minScore: 80,
    requirements: ['has_funding', 'has_growth_rate', 'has_expansion_plan'],
    description: 'Expanding market presence and team',
  },
};

const STAGE_ORDER: StartupStage[] = ['ideation', 'validation', 'mvp', 'growth', 'scale'];

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = getCorsHeaders(req);

  try {
    const body = await req.json().catch(() => ({}));
    const { action, startupId } = body;

    // Allow get_stage_criteria without auth (static data, no DB access)
    if (action === 'get_stage_criteria') {
      console.log(`[stage-analyzer] Action: get_stage_criteria, No auth required`);
      return new Response(
        JSON.stringify(getStageCriteria()),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Auth validation for all other actions
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User-scoped client (RLS enforced)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit (standard — does computation)
    const rateResult = checkRateLimit(user.id, "stage-analyzer", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    if (!startupId) {
      return new Response(
        JSON.stringify({ error: 'Missing startupId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const auth: AuthContext = { userId: user.id, startupId };
    let result;

    switch (action) {
      case 'analyze_stage':
        result = await analyzeStage(supabase, auth);
        break;
      case 'suggest_stage_transition':
        result = await suggestStageTransition(supabase, auth);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action', validActions: ['analyze_stage', 'get_stage_criteria', 'suggest_stage_transition'] }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[stage-analyzer] Action: ${action}, StartupId: ${startupId}, Success`);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[stage-analyzer] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function gatherStartupMetrics(supabase: any, auth: AuthContext): Promise<StartupMetrics> {
  // Gather data from multiple tables in parallel
  const [
    startup,
    pitchDecks,
    leanCanvas,
    documents,
    investors,
    tasks,
    contacts,
    deals,
    projects,
    team,
  ] = await Promise.all([
    supabase.from('startups').select('*').eq('id', auth.startupId).single(),
    supabase.from('pitch_decks').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId),
    supabase.from('documents').select('id').eq('startup_id', auth.startupId).eq('type', 'lean_canvas'),
    supabase.from('documents').select('id, type').eq('startup_id', auth.startupId),
    supabase.from('investors').select('id, status').eq('startup_id', auth.startupId),
    supabase.from('tasks').select('id, status').eq('startup_id', auth.startupId),
    supabase.from('contacts').select('id, type').eq('startup_id', auth.startupId),
    supabase.from('deals').select('id, stage, amount').eq('startup_id', auth.startupId),
    supabase.from('projects').select('id, status').eq('startup_id', auth.startupId),
    supabase.from('startup_members').select('id', { count: 'exact', head: true }).eq('startup_id', auth.startupId),
  ]);

  const startupData = startup.data || {};
  const docs = documents.data || [];
  const investorList = investors.data || [];
  const taskList = tasks.data || [];
  const contactList = contacts.data || [];
  const dealList = deals.data || [];
  const projectList = projects.data || [];

  // Calculate metrics
  const customerContacts = contactList.filter((c: any) => c.type === 'customer' || c.type === 'prospect');
  const completedTasks = taskList.filter((t: any) => t.status === 'completed');
  const activeDeals = dealList.filter((d: any) => d.stage !== 'lost');
  const totalRevenue = dealList.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

  return {
    // Ideation
    has_pitch_deck: (pitchDecks.count || 0) > 0,
    has_business_model: (leanCanvas.data?.length || 0) > 0,
    has_market_research: docs.some((d: any) => d.type === 'market_research'),
    has_competitor_analysis: (startupData.competitors?.length || 0) > 0,

    // Validation
    customer_interviews: customerContacts.length,
    has_prototype: projectList.some((p: any) => p.status === 'active' || p.status === 'completed'),
    has_landing_page: !!startupData.website_url,
    waitlist_signups: 0, // Would need dedicated tracking

    // MVP
    has_product: projectList.some((p: any) => p.status === 'completed'),
    active_users: customerContacts.length, // Proxy metric
    has_feedback_loop: completedTasks.length > 5,
    feature_releases: completedTasks.filter((t: any) => t.category === 'feature').length,

    // Growth
    mrr: totalRevenue / 12, // Rough estimate
    team_size: team.count || 1,
    has_marketing: docs.some((d: any) => d.type === 'marketing'),
    month_over_month_growth: 0, // Would need historical data

    // Scale
    funding_raised: startupData.funding_raised || 0,
    growth_rate: 0, // Would need historical data
    has_expansion_plan: docs.some((d: any) => d.type === 'expansion' || d.type === 'business_plan'),
    has_partnerships: investorList.filter((i: any) => i.status === 'committed').length > 0,
  };
}

function calculateStageScore(metrics: StartupMetrics): { total: number; categories: Record<string, number> } {
  const categories: Record<string, number> = {
    ideation: 0,
    validation: 0,
    mvp: 0,
    growth: 0,
    scale: 0,
  };

  // Ideation (0-20)
  if (metrics.has_pitch_deck) categories.ideation += 5;
  if (metrics.has_business_model) categories.ideation += 5;
  if (metrics.has_market_research) categories.ideation += 5;
  if (metrics.has_competitor_analysis) categories.ideation += 5;

  // Validation (20-40)
  if (metrics.customer_interviews > 0) categories.validation += Math.min(5, metrics.customer_interviews);
  if (metrics.has_prototype) categories.validation += 5;
  if (metrics.has_landing_page) categories.validation += 5;
  if (metrics.waitlist_signups > 0) categories.validation += Math.min(5, Math.floor(metrics.waitlist_signups / 10));

  // MVP (40-60)
  if (metrics.has_product) categories.mvp += 5;
  if (metrics.active_users > 0) categories.mvp += Math.min(5, Math.floor(metrics.active_users / 10));
  if (metrics.has_feedback_loop) categories.mvp += 5;
  if (metrics.feature_releases > 0) categories.mvp += Math.min(5, metrics.feature_releases);

  // Growth (60-80)
  if (metrics.mrr > 0) categories.growth += Math.min(5, Math.floor(metrics.mrr / 1000));
  if (metrics.team_size > 1) categories.growth += Math.min(5, metrics.team_size);
  if (metrics.has_marketing) categories.growth += 5;
  if (metrics.month_over_month_growth > 0) categories.growth += Math.min(5, Math.floor(metrics.month_over_month_growth / 5));

  // Scale (80-100)
  if (metrics.funding_raised > 0) categories.scale += Math.min(5, Math.floor(metrics.funding_raised / 100000));
  if (metrics.growth_rate > 20) categories.scale += 5;
  if (metrics.has_expansion_plan) categories.scale += 5;
  if (metrics.has_partnerships) categories.scale += 5;

  const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

  return { total, categories };
}

function determineStage(score: number): StartupStage {
  if (score >= 80) return 'scale';
  if (score >= 60) return 'growth';
  if (score >= 40) return 'mvp';
  if (score >= 20) return 'validation';
  return 'ideation';
}

function getNextStage(stage: StartupStage): StartupStage | null {
  const index = STAGE_ORDER.indexOf(stage);
  return index < STAGE_ORDER.length - 1 ? STAGE_ORDER[index + 1] : null;
}

function getMissingRequirements(metrics: StartupMetrics, targetStage: StartupStage): string[] {
  const missing: string[] = [];

  switch (targetStage) {
    case 'validation':
      if (!metrics.has_pitch_deck) missing.push('Create a pitch deck');
      if (!metrics.has_market_research) missing.push('Complete market research');
      if (metrics.customer_interviews < 5) missing.push('Conduct 5+ customer interviews');
      break;
    case 'mvp':
      if (!metrics.has_product) missing.push('Build and launch MVP');
      if (metrics.active_users < 10) missing.push('Acquire 10+ active users');
      if (!metrics.has_feedback_loop) missing.push('Establish user feedback process');
      break;
    case 'growth':
      if (metrics.mrr < 1000) missing.push('Reach $1K MRR');
      if (metrics.team_size < 3) missing.push('Grow team to 3+ members');
      if (!metrics.has_marketing) missing.push('Develop marketing strategy');
      break;
    case 'scale':
      if (metrics.funding_raised < 100000) missing.push('Raise seed funding');
      if (!metrics.has_expansion_plan) missing.push('Create expansion plan');
      if (!metrics.has_partnerships) missing.push('Establish strategic partnerships');
      break;
  }

  return missing;
}

function generateRecommendations(metrics: StartupMetrics, currentStage: StartupStage): string[] {
  const recommendations: string[] = [];

  // Stage-specific recommendations
  switch (currentStage) {
    case 'ideation':
      if (!metrics.has_business_model) recommendations.push('Complete your Lean Canvas to clarify your business model');
      if (!metrics.has_competitor_analysis) recommendations.push('Research and document your competitors');
      if (metrics.customer_interviews < 10) recommendations.push('Schedule more customer discovery calls');
      break;
    case 'validation':
      if (!metrics.has_landing_page) recommendations.push('Launch a landing page to validate interest');
      if (!metrics.has_prototype) recommendations.push('Build a prototype or mockup to test with users');
      recommendations.push('Focus on finding product-market fit signals');
      break;
    case 'mvp':
      if (metrics.active_users < 100) recommendations.push('Prioritize user acquisition and activation');
      recommendations.push('Implement analytics to track key metrics');
      recommendations.push('Iterate based on user feedback');
      break;
    case 'growth':
      recommendations.push('Identify and double down on your best acquisition channel');
      recommendations.push('Focus on reducing churn and improving retention');
      if (!metrics.has_marketing) recommendations.push('Develop a content marketing strategy');
      break;
    case 'scale':
      recommendations.push('Prepare materials for Series A fundraising');
      recommendations.push('Build out leadership team');
      recommendations.push('Explore new market opportunities');
      break;
  }

  return recommendations.slice(0, 3); // Top 3 recommendations
}

async function analyzeStage(supabase: any, auth: AuthContext): Promise<StageAnalysisResult> {
  // Get current stage from startup profile
  const { data: startup } = await supabase
    .from('startups')
    .select('stage')
    .eq('id', auth.startupId)
    .single();

  const currentStage = (startup?.stage || 'ideation') as StartupStage;

  // Gather metrics
  const metrics = await gatherStartupMetrics(supabase, auth);

  // Calculate score
  const { total: score, categories } = calculateStageScore(metrics);

  // Determine detected stage
  const detectedStage = determineStage(score);

  // Get next stage and missing requirements
  const nextStage = getNextStage(detectedStage);
  const missingRequirements = nextStage ? getMissingRequirements(metrics, nextStage) : [];

  // Check transition readiness
  const readyForTransition = detectedStage !== currentStage &&
    STAGE_ORDER.indexOf(detectedStage) > STAGE_ORDER.indexOf(currentStage);

  // Generate recommendations
  const recommendations = generateRecommendations(metrics, detectedStage);

  return {
    current_stage: currentStage,
    detected_stage: detectedStage,
    score,
    category_scores: categories,
    missing_for_next_stage: missingRequirements,
    ready_for_transition: readyForTransition,
    recommendations,
    next_stage: nextStage,
  };
}

function getStageCriteria(): { stages: StageCriteria[] } {
  return {
    stages: STAGE_ORDER.map(stage => STAGE_CRITERIA[stage]),
  };
}

async function suggestStageTransition(supabase: any, auth: AuthContext): Promise<{
  should_transition: boolean;
  from_stage: StartupStage;
  to_stage: StartupStage | null;
  confidence: number;
  reasons: string[];
}> {
  const analysis = await analyzeStage(supabase, auth);

  const shouldTransition = analysis.ready_for_transition &&
    analysis.missing_for_next_stage.length === 0;

  const confidence = shouldTransition
    ? Math.min(100, analysis.score + 10)
    : Math.max(0, analysis.score - 20);

  const reasons: string[] = [];
  if (shouldTransition) {
    reasons.push(`Score of ${analysis.score} exceeds threshold for ${analysis.detected_stage}`);
    reasons.push(`All requirements for ${analysis.detected_stage} stage are met`);
  } else {
    if (analysis.missing_for_next_stage.length > 0) {
      reasons.push(`Missing ${analysis.missing_for_next_stage.length} requirements for next stage`);
    }
    reasons.push(`Current score: ${analysis.score}, need ${STAGE_CRITERIA[analysis.next_stage || 'validation'].minScore} for next stage`);
  }

  return {
    should_transition: shouldTransition,
    from_stage: analysis.current_stage,
    to_stage: shouldTransition ? analysis.detected_stage : null,
    confidence,
    reasons,
  };
}
