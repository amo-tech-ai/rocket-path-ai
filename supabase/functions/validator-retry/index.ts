/**
 * Validator Retry Edge Function (V4: 040-VRT)
 * Selectively retries a single failed agent and cascades to downstream agents.
 * Loads completed agent outputs from validator_runs, re-runs the target agent,
 * then cascades to Composer + Verifier to update the report.
 *
 * Usage: POST { session_id, agent_name }
 * Returns immediately; retry runs in background via EdgeRuntime.waitUntil.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

// Import agent runners from validator-start
import {
  runExtractor,
  runResearch,
  runCompetitors,
  runScoring,
  runMVP,
  runComposer,
  runVerifier,
} from "../validator-start/agents/index.ts";

// Import DB + broadcast helpers
import { startAgentRun, completeAgentRun } from "../validator-start/db.ts";
import { broadcastPipelineEvent, AGENT_STEPS, TOTAL_STEPS } from "../validator-start/broadcast.ts";

// Import types
import type {
  // deno-lint-ignore no-unused-vars
  SupabaseClient,
  StartupProfile,
  MarketResearch,
  CompetitorAnalysis,
  ScoringResult,
  MVPPlan,
  ValidatorReport,
  InterviewContext,
} from "../validator-start/types.ts";

// Cascade map: when retrying agent X, also re-run these downstream agents.
// Composer is always included for data agents (to recompose report with new data).
// VerifierAgent is always last (re-verifies the updated report).
const CASCADE: Record<string, string[]> = {
  ExtractorAgent: ['ResearchAgent', 'CompetitorAgent', 'ScoringAgent', 'MVPAgent', 'ComposerAgent', 'VerifierAgent'],
  ResearchAgent: ['ComposerAgent', 'VerifierAgent'],
  CompetitorAgent: ['ComposerAgent', 'VerifierAgent'],
  ScoringAgent: ['MVPAgent', 'ComposerAgent', 'VerifierAgent'],
  MVPAgent: ['ComposerAgent', 'VerifierAgent'],
  ComposerAgent: ['VerifierAgent'],
  VerifierAgent: [],
};

const VALID_AGENTS = Object.keys(CASCADE);

// Required predecessors: these must have succeeded for the target agent to be retryable
const REQUIRED_PREDECESSORS: Record<string, string[]> = {
  ExtractorAgent: [],
  ResearchAgent: ['ExtractorAgent'],
  CompetitorAgent: ['ExtractorAgent'],
  ScoringAgent: ['ExtractorAgent'],
  MVPAgent: ['ExtractorAgent', 'ScoringAgent'],
  ComposerAgent: ['ExtractorAgent'],
  VerifierAgent: [],
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  const preflight = handleCors(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
      throw new Error('Missing required environment variables');
    }

    // Auth: verify JWT
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit: standard (10 requests per 60s)
    const rl = checkRateLimit(user.id, 'validator-retry', RATE_LIMITS.standard);
    if (!rl.allowed) return rateLimitResponse(rl, corsHeaders);

    // Parse body
    const body = await req.json();
    const { session_id, agent_name } = body;

    if (!session_id || !agent_name) {
      return new Response(
        JSON.stringify({ error: 'session_id and agent_name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!VALID_AGENTS.includes(agent_name)) {
      return new Response(
        JSON.stringify({ error: `Invalid agent: ${agent_name}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Admin client for writes (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Verify session ownership and load session data
    const { data: session, error: sessionError } = await supabase
      .from('validator_sessions')
      .select('id, input_text, interview_context, startup_id, status')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Don't retry if already running
    if (session.status === 'running') {
      return new Response(
        JSON.stringify({ error: 'Session is already running — wait for it to finish' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load existing agent outputs from validator_runs
    const { data: existingRuns } = await supabaseAdmin
      .from('validator_runs')
      .select('agent_name, status, output_json')
      .eq('session_id', session_id);

    const agentOutputs: Record<string, unknown> = {};
    for (const run of existingRuns || []) {
      if (run.status === 'ok' || run.status === 'partial') {
        agentOutputs[run.agent_name] = run.output_json;
      }
    }

    // Check required predecessors have succeeded
    const missingPredecessors = REQUIRED_PREDECESSORS[agent_name].filter(
      pred => !agentOutputs[pred]
    );
    if (missingPredecessors.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Cannot retry ${agent_name} — requires: ${missingPredecessors.join(', ')}`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine agents to run (target + cascade)
    const cascade = CASCADE[agent_name];
    const agentsToRun = [agent_name, ...cascade];

    console.log(`[validator-retry] User: ${user.id}, Session: ${session_id}, Agent: ${agent_name}, Cascade: [${cascade.join(',')}]`);

    // Reset agent_runs status to 'queued' for all agents we'll re-run
    await supabaseAdmin
      .from('validator_agent_runs')
      .update({ status: 'queued', started_at: null, ended_at: null, duration_ms: null, error: null })
      .eq('session_id', session_id)
      .in('agent_name', agentsToRun);

    // Also reset validator_runs for retry + cascade agents
    await supabaseAdmin
      .from('validator_runs')
      .update({ status: 'running', started_at: null, finished_at: null, duration_ms: null, output_json: null, citations: null, error_message: null })
      .eq('session_id', session_id)
      .in('agent_name', agentsToRun);

    // Set session back to running
    await supabaseAdmin
      .from('validator_sessions')
      .update({ status: 'running', error_message: null })
      .eq('id', session_id);

    // Return immediately — run retry in background via EdgeRuntime.waitUntil
    const retryPromise = executeRetry(
      supabaseAdmin,
      session_id,
      agent_name,
      agentsToRun,
      agentOutputs,
      session,
    );

    // deno-lint-ignore no-explicit-any
    (globalThis as any).EdgeRuntime?.waitUntil?.(retryPromise);

    return new Response(
      JSON.stringify({
        success: true,
        session_id,
        retrying: agent_name,
        cascade,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[validator-retry] Error:', error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});

// ===== Background retry execution =====

async function executeRetry(
  // deno-lint-ignore no-explicit-any
  supabaseAdmin: any,
  sessionId: string,
  targetAgent: string,
  agentsToRun: string[],
  existingOutputs: Record<string, unknown>,
  session: { input_text: string; interview_context?: InterviewContext; startup_id?: string },
) {
  const retryStart = Date.now();
  const failedAgents: string[] = [];

  // Mutable outputs — start with existing data, update as agents complete
  let profile = existingOutputs['ExtractorAgent'] as StartupProfile | null;
  let market = existingOutputs['ResearchAgent'] as MarketResearch | null;
  let competitors = existingOutputs['CompetitorAgent'] as CompetitorAnalysis | null;
  let scoring = existingOutputs['ScoringAgent'] as ScoringResult | null;
  let mvp = existingOutputs['MVPAgent'] as MVPPlan | null;
  let report: ValidatorReport | null = null;

  try {
    for (const agentName of agentsToRun) {
      const agentStart = Date.now();
      await startAgentRun(supabaseAdmin, sessionId, agentName);
      await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
        agent: agentName,
        step: AGENT_STEPS[agentName] || 1,
        totalSteps: TOTAL_STEPS,
      });

      try {
        switch (agentName) {
          case 'ExtractorAgent': {
            const interviewCtx = session.interview_context as InterviewContext | undefined;
            profile = await runExtractor(supabaseAdmin, sessionId, session.input_text, interviewCtx);
            if (!profile) throw new Error('Extraction failed — no profile returned');
            break;
          }
          case 'ResearchAgent': {
            if (!profile) throw new Error('Missing profile — ExtractorAgent must succeed first');
            market = await runResearch(supabaseAdmin, sessionId, profile);
            if (!market) throw new Error('Research failed — no market data returned');
            break;
          }
          case 'CompetitorAgent': {
            if (!profile) throw new Error('Missing profile — ExtractorAgent must succeed first');
            competitors = await runCompetitors(supabaseAdmin, sessionId, profile);
            if (!competitors) throw new Error('Competitor analysis failed');
            break;
          }
          case 'ScoringAgent': {
            if (!profile) throw new Error('Missing profile');
            const interviewStr = session.interview_context
              ? JSON.stringify((session.interview_context as InterviewContext).extracted || session.interview_context, null, 2)
              : undefined;
            scoring = await runScoring(supabaseAdmin, sessionId, profile, market, competitors, interviewStr);
            if (!scoring) throw new Error('Scoring failed');
            break;
          }
          case 'MVPAgent': {
            if (!profile || !scoring) throw new Error('Missing profile or scoring');
            mvp = await runMVP(supabaseAdmin, sessionId, profile, scoring);
            if (!mvp) throw new Error('MVP planning failed');
            break;
          }
          case 'ComposerAgent': {
            if (!profile) throw new Error('Missing profile');
            const interviewCtx = session.interview_context as InterviewContext | undefined;
            // Generous 90s budget — retry has no upstream time pressure
            report = await runComposer(supabaseAdmin, sessionId, profile, market, competitors, scoring, mvp, 90_000, interviewCtx);
            if (!report) throw new Error('Composition failed');
            break;
          }
          case 'VerifierAgent': {
            // If Composer wasn't in cascade, load existing report from DB
            if (!report) {
              const { data: existingReport } = await supabaseAdmin
                .from('validator_reports')
                .select('details')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
              report = existingReport?.details as ValidatorReport | null;
            }
            await runVerifier(supabaseAdmin, sessionId, report, failedAgents);
            break;
          }
        }

        // Agent succeeded
        const duration = Date.now() - agentStart;
        await completeAgentRun(supabaseAdmin, sessionId, agentName, 'completed', duration);
        await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
          agent: agentName,
          step: AGENT_STEPS[agentName] || 1,
          totalSteps: TOTAL_STEPS,
          durationMs: duration,
        });

      } catch (agentError) {
        // Agent failed — mark it and skip remaining cascade
        const duration = Date.now() - agentStart;
        const errMsg = agentError instanceof Error ? agentError.message : 'Unknown error';
        await completeAgentRun(supabaseAdmin, sessionId, agentName, 'failed', duration, errMsg);
        await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
          agent: agentName,
          step: AGENT_STEPS[agentName] || 1,
          totalSteps: TOTAL_STEPS,
          error: errMsg,
        });
        failedAgents.push(agentName);

        // Skip remaining cascade agents
        const remaining = agentsToRun.slice(agentsToRun.indexOf(agentName) + 1);
        for (const skip of remaining) {
          await completeAgentRun(supabaseAdmin, sessionId, skip, 'skipped', 0, `Skipped: ${agentName} failed during retry`);
          await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
            agent: skip,
            step: AGENT_STEPS[skip] || 1,
            totalSteps: TOTAL_STEPS,
            error: `Skipped: ${agentName} failed`,
          });
        }
        break;
      }
    }

    // === Post-retry: update report + session ===

    // If Composer was in cascade and succeeded, insert/update report
    let insertedReportId: string | undefined;
    if (agentsToRun.includes('ComposerAgent') && report && !failedAgents.includes('ComposerAgent')) {
      // Enrich report with scoring data (mirrors pipeline.ts)
      if (scoring) {
        const enriched = report as Record<string, unknown>;
        if (scoring.highlights?.length) enriched.highlights = scoring.highlights;
        if (scoring.red_flags?.length) enriched.red_flags = scoring.red_flags;
        if (scoring.market_factors?.length) enriched.market_factors = scoring.market_factors;
        if (scoring.execution_factors?.length) enriched.execution_factors = scoring.execution_factors;
        if (scoring.scores_matrix) enriched.scores_matrix = scoring.scores_matrix;
      }

      // Delete old report, insert new one with fresh data
      await supabaseAdmin
        .from('validator_reports')
        .delete()
        .eq('session_id', sessionId);

      const hasV3Dims = report.dimensions && Object.keys(report.dimensions).length > 0;
      const { data: newReport } = await supabaseAdmin
        .from('validator_reports')
        .insert({
          run_id: null,
          session_id: sessionId,
          startup_id: session.startup_id || null,
          report_type: 'overall',
          score: scoring?.overall_score ?? null,
          summary: report.summary_verdict,
          details: report,
          key_findings: [...(scoring?.highlights || []), ...(scoring?.red_flags || [])],
          verified: false,
          verification_json: null,
          report_version: hasV3Dims ? 'v3' : 'v2',
        })
        .select('id')
        .single();

      insertedReportId = newReport?.id;

      // If Verifier also ran successfully, update verification on new report
      if (!failedAgents.includes('VerifierAgent') && agentsToRun.includes('VerifierAgent') && insertedReportId) {
        const { data: verifierRun } = await supabaseAdmin
          .from('validator_runs')
          .select('output_json')
          .eq('session_id', sessionId)
          .eq('agent_name', 'VerifierAgent')
          .maybeSingle();

        if (verifierRun?.output_json) {
          await supabaseAdmin
            .from('validator_reports')
            .update({
              verified: verifierRun.output_json.verified || false,
              verification_json: verifierRun.output_json,
            })
            .eq('id', insertedReportId);
        }
      }
    }

    // Determine final session status
    const hasReport = insertedReportId || !agentsToRun.includes('ComposerAgent');
    const finalStatus = failedAgents.length === 0 ? 'complete' :
                        hasReport ? 'partial' : 'failed';

    await supabaseAdmin
      .from('validator_sessions')
      .update({
        status: finalStatus,
        failed_steps: failedAgents.length > 0 ? failedAgents : [],
        error_message: failedAgents.length > 0 ? `Retry failed: ${failedAgents.join(', ')}` : null,
      })
      .eq('id', sessionId);

    // Broadcast pipeline completion/failure
    await broadcastPipelineEvent(supabaseAdmin, sessionId,
      finalStatus === 'failed' ? 'pipeline_failed' : 'pipeline_complete', {
      status: finalStatus,
      score: scoring?.overall_score,
      reportId: insertedReportId,
      durationMs: Date.now() - retryStart,
    });

    console.log(`[validator-retry] Done: ${targetAgent} → ${finalStatus} (${Date.now() - retryStart}ms), failed: [${failedAgents.join(',')}]`);

  } catch (fatal) {
    // Safety net — never leave session in 'running' state
    console.error('[validator-retry] Fatal error:', fatal);
    await supabaseAdmin
      .from('validator_sessions')
      .update({
        status: 'failed',
        error_message: `Retry crashed: ${fatal instanceof Error ? fatal.message : 'Unknown'}`,
      })
      .eq('id', sessionId);

    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'pipeline_failed', {
      status: 'failed',
      error: fatal instanceof Error ? fatal.message : 'Retry crashed',
      durationMs: Date.now() - retryStart,
    });
  }
}
