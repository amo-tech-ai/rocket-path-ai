/**
 * Validator Pipeline Orchestrator
 * Runs all 7 agents. Competitors fires as background promise; critical path is
 * Extractor -> Research -> Scoring -> MVP -> [grace period] -> Composer -> Verifier.
 * F3: Catch-all safety net — session NEVER stays "running" forever.
 * H6: All DB writes check and log errors.
 */

import type {
  SupabaseClient,
  StartupProfile,
  MarketResearch,
  CompetitorAnalysis,
  ScoringResult,
  MVPPlan,
  ValidatorReport,
  VerificationResult,
} from "./types.ts";
import {
  runExtractor,
  runResearch,
  runCompetitors,
  runScoring,
  runMVP,
  runComposer,
  runVerifier,
} from "./agents/index.ts";

// P03: Global pipeline wall-clock budget.
// Supabase paid plan: 400s wall-clock. Free plan: 150s.
// Budget: 300s for agents, ~100s buffer for Verifier + DB writes + safety margin.
// Increased from 115s after discovering paid plan supports 400s (was 150s).
const PIPELINE_TIMEOUT_MS = 300_000;

export async function runPipeline(
  supabaseAdmin: SupabaseClient,
  sessionId: string,
  input_text: string,
  startup_id?: string
) {
// FIX: Use a start timestamp + deadline check instead of setTimeout.
// setTimeout was unreliable on Deno Deploy — the callback never fired when
// the event loop was blocked by pending fetch calls, causing zombie sessions.
// Now each agent checks the deadline before starting.
const pipelineStart = Date.now();
const pipelineDeadline = pipelineStart + PIPELINE_TIMEOUT_MS;

function remainingMs(): number {
  return Math.max(0, pipelineDeadline - Date.now());
}

function isExpired(): boolean {
  return Date.now() >= pipelineDeadline;
}

// F3: Catch-all safety net — session NEVER stays "running" forever
try {
  let profile: StartupProfile | null = null;
  let marketResearch: MarketResearch | null = null;
  let competitorAnalysis: CompetitorAnalysis | null = null;
  let scoring: ScoringResult | null = null;
  let mvpPlan: MVPPlan | null = null;
  let report: ValidatorReport | null = null;
  let verification: VerificationResult | null = null;
  const failedAgents: string[] = [];

  try {
    profile = await runExtractor(supabaseAdmin, sessionId, input_text);
    if (!profile) failedAgents.push('ExtractorAgent');
  } catch (e) {
    console.error('[ExtractorAgent] Failed:', e);
    failedAgents.push('ExtractorAgent');
  }

  // FIX: Deadline check before parallel agents
  if (isExpired()) {
    console.error(`[pipeline] DEADLINE EXCEEDED after ExtractorAgent (${Date.now() - pipelineStart}ms)`);
    throw new Error('Pipeline exceeded wall-clock limit');
  }

  // FIX: Fire Competitors as background promise — do NOT block critical path.
  // Scoring doesn't need competitor data; Composer gets it via grace period.
  let competitorPromise: Promise<CompetitorAnalysis | null> | null = null;
  if (profile) {
    competitorPromise = runCompetitors(supabaseAdmin, sessionId, profile)
      .catch((e) => {
        console.error('[CompetitorAgent] Failed:', e);
        failedAgents.push('CompetitorAgent');
        return null;
      });

    // Await only Research on the critical path
    try {
      marketResearch = await runResearch(supabaseAdmin, sessionId, profile);
      if (!marketResearch) failedAgents.push('ResearchAgent');
    } catch (e) {
      console.error('[ResearchAgent] Failed:', e);
      failedAgents.push('ResearchAgent');
    }
  }

  // FIX: Deadline check before Scoring
  if (isExpired()) {
    console.error(`[pipeline] DEADLINE EXCEEDED after Research (${Date.now() - pipelineStart}ms)`);
    throw new Error('Pipeline exceeded wall-clock limit');
  }

  try {
    if (profile) {
      scoring = await runScoring(supabaseAdmin, sessionId, profile, marketResearch, competitorAnalysis);
      if (!scoring) failedAgents.push('ScoringAgent');
    }
  } catch (e) {
    console.error('[ScoringAgent] Failed:', e);
    failedAgents.push('ScoringAgent');
  }

  // FIX: Deadline check before MVP
  if (isExpired()) {
    console.error(`[pipeline] DEADLINE EXCEEDED after ScoringAgent (${Date.now() - pipelineStart}ms)`);
    throw new Error('Pipeline exceeded wall-clock limit');
  }

  try {
    if (profile && scoring) {
      mvpPlan = await runMVP(supabaseAdmin, sessionId, profile, scoring);
      if (!mvpPlan) failedAgents.push('MVPAgent');
    }
  } catch (e) {
    console.error('[MVPAgent] Failed:', e);
    failedAgents.push('MVPAgent');
  }

  // COMPETITORS GRACE PERIOD: Give Competitors a chance to finish before Composer.
  // Grace = min(5s, remaining - 30s) to protect Composer's budget (tightened from 40s).
  if (competitorPromise && !competitorAnalysis) {
    const grace = Math.min(5_000, remainingMs() - 30_000);
    if (grace > 0) {
      console.log(`[pipeline] Waiting up to ${grace}ms for Competitors to finish...`);
      const result = await Promise.race([
        competitorPromise,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), grace)),
      ]);
      if (result) {
        competitorAnalysis = result;
        console.log('[pipeline] Competitors finished within grace period');
      } else {
        console.log('[pipeline] Competitors still running — proceeding without competitor data');
      }
    } else {
      console.log('[pipeline] No time for Competitors grace period — proceeding without competitor data');
    }
  }

  // PRE-COMPOSER CHECKPOINT: Save all agent results before running Composer.
  // If Deno Deploy kills the isolate during Composer, partial data survives in the DB.
  {
    const { error: checkpointError } = await supabaseAdmin
      .from('validator_sessions')
      .update({
        status: 'running', // Keep as running — frontend polls until terminal
        failed_steps: failedAgents,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);
    if (checkpointError) {
      console.error('[pipeline] Pre-composer checkpoint failed:', checkpointError.message);
    } else {
      console.log(`[pipeline] Checkpoint saved: ${5 - failedAgents.length}/5 agents OK, failed: [${failedAgents.join(',')}]`);
    }
  }

  // FIX: Deadline check before Composer — most critical check.
  // Composer is the most expensive agent. Cap its timeout to remaining budget minus 10s for DB writes.
  // P06: Increased cap from 30s to 90s — paid plan allows 400s, pipeline deadline is 300s.
  // With 8192 maxOutputTokens, Composer needs ~30-50s typical, up to 90s worst case.
  const COMPOSER_MAX_BUDGET_MS = 90_000;
  const composerBudget = Math.min(remainingMs() - 10_000, COMPOSER_MAX_BUDGET_MS);
  if (composerBudget < 15_000) {
    console.error(`[pipeline] Only ${composerBudget}ms left for Composer — skipping (need 15s minimum)`);
    failedAgents.push('ComposerAgent');
  } else {
    console.log(`[pipeline] Composer budget: ${composerBudget}ms (${remainingMs()}ms remaining)`);
    // M4: Only run composer if we have at least the profile (some data to compose from)
    try {
      if (profile) {
        report = await runComposer(supabaseAdmin, sessionId, profile, marketResearch, competitorAnalysis, scoring, mvpPlan, composerBudget);
        if (!report) failedAgents.push('ComposerAgent');
      } else {
        failedAgents.push('ComposerAgent');
      }
    } catch (e) {
      console.error('[ComposerAgent] Failed:', e);
      failedAgents.push('ComposerAgent');
    }
  }

  try {
    verification = await runVerifier(supabaseAdmin, sessionId, report, failedAgents);
  } catch (e) {
    console.error('[VerifierAgent] Failed:', e);
  }

  const finalStatus = failedAgents.length === 0 ? 'complete' :
                      failedAgents.length < 3 ? 'partial' : 'failed';

  // H6: Check error on report INSERT
  // P04: Slimmed details — don't re-embed profile/scoring (already stored in validator_runs).
  // Keeps INSERT payload small and fast, reducing risk of exceeding 150s wall-clock.
  if (report) {
    // Inject scoring data into report so the frontend can read it from details.
    // Scoring generates highlights, red_flags, market_factors, execution_factors
    // but Composer doesn't include them — merge them here before INSERT.
    if (scoring) {
      const enriched = report as Record<string, unknown>;
      if (scoring.highlights?.length) enriched.highlights = scoring.highlights;
      if (scoring.red_flags?.length) enriched.red_flags = scoring.red_flags;
      if (scoring.market_factors?.length) enriched.market_factors = scoring.market_factors;
      if (scoring.execution_factors?.length) enriched.execution_factors = scoring.execution_factors;
    }

    const { error: reportError } = await supabaseAdmin
      .from('validation_reports')
      .insert({
        run_id: null,
        session_id: sessionId,
        startup_id: startup_id || null,
        report_type: 'overall',
        score: scoring?.overall_score || 0,
        summary: report.summary_verdict,
        details: report,
        key_findings: [...(scoring?.highlights || []), ...(scoring?.red_flags || [])],
        verified: verification?.verified || false,
        verification_json: verification,
      });

    if (reportError) {
      console.error('[pipeline] Report INSERT failed:', reportError.message);
    }
  }

  // H6: Check error on session UPDATE
  const { error: sessionUpdateError } = await supabaseAdmin
    .from('validator_sessions')
    .update({
      status: finalStatus,
      failed_steps: failedAgents,
      error_message: failedAgents.length > 0 ? `Failed agents: ${failedAgents.join(', ')}` : null,
    })
    .eq('id', sessionId);

  if (sessionUpdateError) {
    console.error('[pipeline] Session UPDATE failed:', sessionUpdateError.message);
  }

  console.log(`[pipeline] Done in ${Date.now() - pipelineStart}ms: ${finalStatus}, failed: [${failedAgents.join(',')}]`);

} catch (unhandled) {
  // F3: Safety net — mark session failed on ANY unhandled error
  console.error('[pipeline] Unhandled error:', unhandled);
  const { error: safetyError } = await supabaseAdmin
    .from('validator_sessions')
    .update({
      status: 'failed',
      error_message: `Pipeline crashed: ${unhandled instanceof Error ? unhandled.message : 'Unknown error'}`,
    })
    .eq('id', sessionId);

  if (safetyError) {
    console.error('[pipeline] Safety net UPDATE also failed:', safetyError.message);
  }
}
}
