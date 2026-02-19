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

    // Verify user access to startup (defense-in-depth — RLS also enforces)
    const { data: membership } = await supabase
      .from('startup_members')
      .select('id')
      .eq('startup_id', startupId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
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

async function calculateHealthScore(supabase: any, startupId: string): Promise<HealthScore> {
  // Fetch all relevant data in parallel
  const [
    startupResult,
    canvasResult,
    pitchDeckResult,
    tasksResult,
    contactsResult,
    documentsResult,
    wizardResult,
  ] = await Promise.all([
    supabase.from('startups').select('*').eq('id', startupId).single(),
    supabase.from('lean_canvases').select('*').eq('startup_id', startupId).order('updated_at', { ascending: false }).limit(1),
    supabase.from('pitch_decks').select('*').eq('startup_id', startupId).order('updated_at', { ascending: false }).limit(1),
    supabase.from('tasks').select('id, status').eq('startup_id', startupId),
    supabase.from('contacts').select('id, type').eq('startup_id', startupId),
    supabase.from('documents').select('id, type').eq('startup_id', startupId),
    supabase.from('wizard_sessions').select('form_data').eq('startup_id', startupId).eq('status', 'completed').limit(1),
  ]);

  const startup = startupResult.data;
  const canvas = canvasResult.data?.[0];
  const pitchDeck = pitchDeckResult.data?.[0];
  const tasks = tasksResult.data || [];
  const contacts = contactsResult.data || [];
  const documents = documentsResult.data || [];
  const wizardData = wizardResult.data?.[0]?.form_data;

  const warnings: string[] = [];

  // 1. Problem Clarity (20%) - Based on canvas + startup problem statement
  let problemScore = 30; // Base score
  if (startup?.problem_statement) {
    problemScore += 20;
    if (startup.problem_statement.length > 100) problemScore += 15;
  }
  if (canvas?.problem) {
    problemScore += 20;
    if (typeof canvas.problem === 'string' && canvas.problem.length > 50) problemScore += 15;
  }
  if (wizardData?.problem) problemScore += 10;
  problemScore = Math.min(100, problemScore);
  if (problemScore < 50) warnings.push('Problem statement needs more detail');

  // 2. Solution Fit (15%) - Based on canvas solution + unique value
  let solutionScore = 30;
  if (canvas?.solution) solutionScore += 25;
  if (canvas?.unique_value_proposition) solutionScore += 25;
  if (startup?.one_liner) solutionScore += 20;
  solutionScore = Math.min(100, solutionScore);
  if (solutionScore < 50) warnings.push('Define your unique value proposition');

  // 3. Market Understanding (15%) - Based on canvas segments + research
  let marketScore = 25;
  if (canvas?.customer_segments) marketScore += 25;
  if (canvas?.channels) marketScore += 15;
  if (startup?.target_market) marketScore += 20;
  if (wizardData?.industry) marketScore += 15;
  marketScore = Math.min(100, marketScore);
  if (marketScore < 50) warnings.push('Add more market research');

  // 4. Traction Proof (25%) - Tasks, contacts, activity
  let tractionScore = 20;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  if (totalTasks > 0) {
    tractionScore += Math.min(30, completedTasks * 5);
  }
  const investorContacts = contacts.filter((c: any) => c.type === 'investor').length;
  const customerContacts = contacts.filter((c: any) => c.type === 'customer' || c.type === 'lead').length;
  tractionScore += Math.min(25, investorContacts * 5);
  tractionScore += Math.min(25, customerContacts * 3);
  tractionScore = Math.min(100, tractionScore);
  if (tractionScore < 50) warnings.push('No traction data in 14 days');

  // 5. Team Readiness (10%) - Founder fit assessment
  let teamScore = 40;
  if (wizardData?.founder_experience) teamScore += 20;
  if (wizardData?.team_size && wizardData.team_size > 1) teamScore += 20;
  if (startup?.team_members) teamScore += 20;
  teamScore = Math.min(100, teamScore);

  // 6. Investor Readiness (15%) - Pitch deck + documents
  let investorScore = 20;
  if (pitchDeck) {
    investorScore += 30;
    if (pitchDeck.status === 'complete') investorScore += 20;
  }
  const pitchDocs = documents.filter((d: any) => d.type === 'pitch' || d.type === 'investor').length;
  investorScore += Math.min(30, pitchDocs * 10);
  investorScore = Math.min(100, investorScore);
  if (investorScore < 50) warnings.push('Complete your pitch deck for investors');

  // Calculate weighted overall score
  const breakdown = {
    problemClarity: { score: problemScore, weight: 20, label: 'Problem Clarity' },
    solutionFit: { score: solutionScore, weight: 15, label: 'Solution Fit' },
    marketUnderstanding: { score: marketScore, weight: 15, label: 'Market Understanding' },
    tractionProof: { score: tractionScore, weight: 25, label: 'Traction Proof' },
    teamReadiness: { score: teamScore, weight: 10, label: 'Team Readiness' },
    investorReadiness: { score: investorScore, weight: 15, label: 'Investor Readiness' },
  };

  const overall = Math.round(
    (breakdown.problemClarity.score * 0.20) +
    (breakdown.solutionFit.score * 0.15) +
    (breakdown.marketUnderstanding.score * 0.15) +
    (breakdown.tractionProof.score * 0.25) +
    (breakdown.teamReadiness.score * 0.10) +
    (breakdown.investorReadiness.score * 0.15)
  );

  // Calculate trend (compare to previous score if exists)
  const previousScore = startup?.health_score || overall;
  const trend = overall - previousScore;

  // Update startup with new health score (RLS allows member updates)
  await supabase
    .from('startups')
    .update({
      health_score: overall,
      score_breakdown: breakdown,
      last_health_check: new Date().toISOString()
    })
    .eq('id', startupId);

  return {
    overall,
    trend,
    breakdown,
    warnings: warnings.slice(0, 3), // Top 3 warnings
    lastCalculated: new Date().toISOString(),
  };
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
