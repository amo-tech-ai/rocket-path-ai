/**
 * Health Scorer Edge Function
 * Calculate and cache startup health scores across 6 dimensions.
 * Migrated to shared patterns: JWT auth, rate limiting, shared CORS.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

interface HealthScore {
  overall: number;
  trend: number;
  breakdown: {
    problemClarity: { score: number; weight: number; label: string };
    solutionFit: { score: number; weight: number; label: string };
    marketUnderstanding: { score: number; weight: number; label: string };
    tractionProof: { score: number; weight: number; label: string };
    teamReadiness: { score: number; weight: number; label: string };
    investorReadiness: { score: number; weight: number; label: string };
  };
  warnings: string[];
  lastCalculated: string;
}

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
    // Auth check
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
    // Auth validated
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit (standard — does computation)
    const rateResult = checkRateLimit(user.id, "health-scorer", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    const body = await req.json().catch(() => ({}));
    const { action, startupId } = body;

    if (!startupId) {
      return new Response(
        JSON.stringify({ error: 'Missing startupId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user access to startup via RLS on startups table
    // (RLS policy: org_id = user_org_id() AND deleted_at IS NULL)
    const { data: startupAccess, error: accessError } = await supabase
      .from('startups')
      .select('id')
      .eq('id', startupId)
      .maybeSingle();

    if (!startupAccess) {
      console.error(`[health-scorer] Access denied: userId=${user.id}, startupId=${startupId}, error=${accessError?.message || 'no access'}`);
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;
    switch (action) {
      case 'calculate':
        result = await calculateHealthScore(supabase, startupId);
        break;
      case 'get_cached':
        result = await getCachedScore(supabase, startupId);
        break;
      default:
        result = await calculateHealthScore(supabase, startupId);
    }

    console.log(`[health-scorer] Action: ${action}, StartupId: ${startupId}, Score: ${result?.overall ?? 'N/A'}`);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[health-scorer] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Map scores_matrix dimension names → health breakdown keys
const DIMENSION_MAP: Record<string, keyof HealthScore['breakdown']> = {
  'Problem Clarity': 'problemClarity',
  'Solution Strength': 'solutionFit',
  'Market Size': 'marketUnderstanding',
  'Competition': 'tractionProof',
  'Business Model': 'investorReadiness',
  'Team Fit': 'teamReadiness',
};

// Default weights for health dimensions (used when validator doesn't provide them)
const DEFAULT_WEIGHTS: Record<keyof HealthScore['breakdown'], number> = {
  problemClarity: 20,
  solutionFit: 15,
  marketUnderstanding: 15,
  tractionProof: 25,
  teamReadiness: 10,
  investorReadiness: 15,
};

const DIMENSION_LABELS: Record<keyof HealthScore['breakdown'], string> = {
  problemClarity: 'Problem Clarity',
  solutionFit: 'Solution Fit',
  marketUnderstanding: 'Market Understanding',
  tractionProof: 'Traction Proof',
  teamReadiness: 'Team Readiness',
  investorReadiness: 'Investor Readiness',
};

async function calculateHealthScore(supabase: any, startupId: string): Promise<HealthScore> {
  // Fetch startup (for previous score/trend) + latest validator report in parallel
  const [startupResult, reportResult] = await Promise.all([
    supabase.from('startups').select('health_score').eq('id', startupId).single(),
    supabase
      .from('validator_reports')
      .select('score, details')
      .eq('startup_id', startupId)
      .not('details->scores_matrix', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const previousScore = startupResult.data?.health_score ?? null;
  const report = reportResult.data;
  const scoresMatrix = report?.details?.scores_matrix;

  // If we have validator scores, use them directly
  if (scoresMatrix?.dimensions?.length > 0) {
    const result = buildFromValidatorScores(scoresMatrix, previousScore);
    await saveScore(supabase, startupId, result);
    return result;
  }

  // Fallback: canvas-based estimation (no validation run yet)
  const result = await buildFromCanvasData(supabase, startupId, previousScore);
  await saveScore(supabase, startupId, result);
  return result;
}

function buildFromValidatorScores(
  scoresMatrix: { dimensions: Array<{ name: string; score: number; weight?: number }>; overall_weighted: number },
  previousScore: number | null,
): HealthScore {
  const breakdown = {} as HealthScore['breakdown'];
  const warnings: string[] = [];

  // Initialize all dimensions with 0
  for (const key of Object.keys(DEFAULT_WEIGHTS) as Array<keyof HealthScore['breakdown']>) {
    breakdown[key] = { score: 0, weight: DEFAULT_WEIGHTS[key], label: DIMENSION_LABELS[key] };
  }

  // Map validator dimensions to health dimensions
  for (const dim of scoresMatrix.dimensions) {
    const healthKey = DIMENSION_MAP[dim.name];
    if (healthKey) {
      breakdown[healthKey] = {
        score: Math.round(dim.score),
        weight: DEFAULT_WEIGHTS[healthKey],
        label: DIMENSION_LABELS[healthKey],
      };
    }
  }

  // Generate warnings for low scores
  for (const [key, val] of Object.entries(breakdown)) {
    if (val.score > 0 && val.score < 50) {
      warnings.push(`${val.label} needs improvement (${val.score}/100)`);
    }
  }

  const overall = scoresMatrix.overall_weighted ?? Math.round(
    Object.values(breakdown).reduce((sum, d) => sum + d.score * (d.weight / 100), 0)
  );
  const trend = previousScore !== null ? overall - previousScore : 0;

  return {
    overall: Math.round(overall),
    trend,
    breakdown,
    warnings: warnings.slice(0, 3),
    lastCalculated: new Date().toISOString(),
  };
}

async function buildFromCanvasData(supabase: any, startupId: string, previousScore: number | null): Promise<HealthScore> {
  const [canvasResult, pitchDeckResult, tasksResult, contactsResult, startupFullResult, wizardResult] = await Promise.all([
    supabase.from('lean_canvases').select('problem, solution, unique_value_proposition, customer_segments, channels').eq('startup_id', startupId).order('updated_at', { ascending: false }).limit(1),
    supabase.from('pitch_decks').select('status').eq('startup_id', startupId).order('updated_at', { ascending: false }).limit(1),
    supabase.from('tasks').select('id, status').eq('startup_id', startupId),
    supabase.from('contacts').select('id, type').eq('startup_id', startupId),
    supabase.from('startups').select('problem_statement, one_liner, target_market, team_members').eq('id', startupId).single(),
    supabase.from('wizard_sessions').select('form_data').eq('startup_id', startupId).eq('status', 'completed').limit(1),
  ]);

  const canvas = canvasResult.data?.[0];
  const pitchDeck = pitchDeckResult.data?.[0];
  const tasks = tasksResult.data || [];
  const contacts = contactsResult.data || [];
  const startup = startupFullResult.data;
  const wizardData = wizardResult.data?.[0]?.form_data;
  const warnings: string[] = [];

  // 1. Problem Clarity (20%)
  let problemScore = 30;
  if (startup?.problem_statement) { problemScore += 20; if (startup.problem_statement.length > 100) problemScore += 15; }
  if (canvas?.problem) { problemScore += 20; if (typeof canvas.problem === 'string' && canvas.problem.length > 50) problemScore += 15; }
  if (wizardData?.problem) problemScore += 10;
  problemScore = Math.min(100, problemScore);
  if (problemScore < 50) warnings.push('Problem statement needs more detail');

  // 2. Solution Fit (15%)
  let solutionScore = 30;
  if (canvas?.solution) solutionScore += 25;
  if (canvas?.unique_value_proposition) solutionScore += 25;
  if (startup?.one_liner) solutionScore += 20;
  solutionScore = Math.min(100, solutionScore);
  if (solutionScore < 50) warnings.push('Define your unique value proposition');

  // 3. Market Understanding (15%)
  let marketScore = 25;
  if (canvas?.customer_segments) marketScore += 25;
  if (canvas?.channels) marketScore += 15;
  if (startup?.target_market) marketScore += 20;
  if (wizardData?.industry) marketScore += 15;
  marketScore = Math.min(100, marketScore);
  if (marketScore < 50) warnings.push('Add more market research');

  // 4. Traction Proof (25%)
  let tractionScore = 20;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  if (tasks.length > 0) tractionScore += Math.min(30, completedTasks * 5);
  const investorContacts = contacts.filter((c: any) => c.type === 'investor').length;
  const customerContacts = contacts.filter((c: any) => c.type === 'customer' || c.type === 'lead').length;
  tractionScore += Math.min(25, investorContacts * 5);
  tractionScore += Math.min(25, customerContacts * 3);
  tractionScore = Math.min(100, tractionScore);
  if (tractionScore < 50) warnings.push('No traction data in 14 days');

  // 5. Team Readiness (10%)
  let teamScore = 40;
  if (wizardData?.founder_experience) teamScore += 20;
  if (wizardData?.team_size && wizardData.team_size > 1) teamScore += 20;
  if (startup?.team_members) teamScore += 20;
  teamScore = Math.min(100, teamScore);

  // 6. Investor Readiness (15%)
  let investorScore = 20;
  if (pitchDeck) { investorScore += 30; if (pitchDeck.status === 'complete') investorScore += 20; }
  investorScore = Math.min(100, investorScore);
  if (investorScore < 50) warnings.push('Complete your pitch deck for investors');

  const breakdown = {
    problemClarity: { score: problemScore, weight: 20, label: 'Problem Clarity' },
    solutionFit: { score: solutionScore, weight: 15, label: 'Solution Fit' },
    marketUnderstanding: { score: marketScore, weight: 15, label: 'Market Understanding' },
    tractionProof: { score: tractionScore, weight: 25, label: 'Traction Proof' },
    teamReadiness: { score: teamScore, weight: 10, label: 'Team Readiness' },
    investorReadiness: { score: investorScore, weight: 15, label: 'Investor Readiness' },
  };

  const overall = Math.round(
    (problemScore * 0.20) + (solutionScore * 0.15) + (marketScore * 0.15) +
    (tractionScore * 0.25) + (teamScore * 0.10) + (investorScore * 0.15)
  );
  const trend = previousScore !== null ? overall - previousScore : 0;

  return { overall, trend, breakdown, warnings: warnings.slice(0, 3), lastCalculated: new Date().toISOString() };
}

async function saveScore(supabase: any, startupId: string, result: HealthScore): Promise<void> {
  await supabase
    .from('startups')
    .update({
      health_score: result.overall,
      score_breakdown: result.breakdown,
      last_health_check: result.lastCalculated,
    })
    .eq('id', startupId);
}

async function getCachedScore(supabase: any, startupId: string): Promise<HealthScore | null> {
  const { data: startup } = await supabase
    .from('startups')
    .select('health_score, score_breakdown, last_health_check')
    .eq('id', startupId)
    .single();

  if (!startup?.health_score) {
    return calculateHealthScore(supabase, startupId);
  }

  // If cached score is older than 1 hour, recalculate
  const lastCheck = new Date(startup.last_health_check || 0);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  if (lastCheck < oneHourAgo) {
    return calculateHealthScore(supabase, startupId);
  }

  return {
    overall: startup.health_score,
    trend: 0,
    breakdown: startup.score_breakdown || {},
    warnings: [],
    lastCalculated: startup.last_health_check,
  };
}
