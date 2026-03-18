/**
 * Validator Pipeline Orchestrator
 * Runs all 7 agents. Research + Competitors + Scoring run in parallel after Extractor.
 * Critical path: Extractor -> [Research||Scoring||Competitors] -> MVP -> [grace] -> Composer -> Verifier.
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
  InterviewContext,
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
import { completeRun, startAgentRun, completeAgentRun } from "./db.ts";
import { broadcastPipelineEvent, AGENT_STEPS, TOTAL_STEPS } from "./broadcast.ts";

// P03: Global pipeline wall-clock budget.
// Supabase Pro plan: 400s wall-clock.
// Budget: 300s for agents + DB writes, 100s reserve for HTTP overhead.
// Upgraded to Pro plan 2026-03-18. Free plan was 140s and caused "Isolate killed" errors.
const PIPELINE_TIMEOUT_MS = 300_000;

/**
 * Auto-create org + startup from extracted profile when user has none.
 * Mirrors the onboarding-agent pattern: create org → startup → update profile + session.
 * Returns the new startup_id, or null if creation failed.
 */
async function autoCreateStartup(
  supabaseAdmin: SupabaseClient,
  userId: string,
  sessionId: string,
  profile: StartupProfile,
): Promise<string | null> {
  try {
    // Check if user already has an org
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('org_id')
      .eq('id', userId)
      .maybeSingle();

    let orgId = existingProfile?.org_id;

    // If user has an org, check if they already have a startup
    if (orgId) {
      const { data: existingStartup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('org_id', orgId)
        .is('deleted_at', null)
        .maybeSingle();
      if (existingStartup?.id) {
        // User already has a startup — link it to this session
        const { error: linkError } = await supabaseAdmin
          .from('validator_sessions')
          .update({ startup_id: existingStartup.id })
          .eq('id', sessionId);
        if (linkError) {
          console.error(`[autoCreateStartup] Failed to link existing startup to session: ${linkError.message}`);
        }
        console.log(`[autoCreateStartup] User already has startup ${existingStartup.id}, linked to session`);
        return existingStartup.id;
      }
    }

    // Derive startup name from extracted idea (first sentence or first 60 chars)
    const ideaName = profile.idea
      ? (profile.idea.match(/^[^.!?]+/)?.[0] || profile.idea).slice(0, 60).trim()
      : 'My Startup';
    const startupName = ideaName.length < 5 ? 'My Startup' : ideaName;

    // Create org if user doesn't have one
    if (!orgId) {
      const baseSlug = startupName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      const { data: newOrg, error: orgError } = await supabaseAdmin
        .from('organizations')
        .insert({ name: startupName, slug })
        .select('id')
        .single();

      if (orgError || !newOrg) {
        console.error('[autoCreateStartup] Org creation failed:', orgError?.message);
        return null;
      }
      orgId = newOrg.id;

      // Link user profile to org
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ org_id: orgId })
        .eq('id', userId);
      if (profileError) {
        console.error(`[autoCreateStartup] Failed to link profile to org: ${profileError.message}`);
      }

      console.log(`[autoCreateStartup] Created org ${orgId} for user ${userId}`);
    }

    // Create startup from extracted data
    // NOTE: Only use columns that exist on the startups table schema
    const { data: startup, error: startupError } = await supabaseAdmin
      .from('startups')
      .insert({
        org_id: orgId,
        name: startupName,
        description: profile.idea || null,
        industry: profile.industry || null,
        problem: profile.problem || null,
        solution: profile.solution || null,
        value_prop: profile.differentiation || null,
        existing_alternatives: profile.alternatives || null,
        stage: 'idea',
        validation_stage: 'idea',
      })
      .select('id')
      .single();

    if (startupError || !startup) {
      console.error('[autoCreateStartup] Startup creation failed:', startupError?.message);
      return null;
    }

    // R-03 fix: Add error check to startup_members insert (race condition can cause 23505)
    const { error: memberError } = await supabaseAdmin
      .from('startup_members')
      .insert({ startup_id: startup.id, user_id: userId, role: 'owner' })
      .select('startup_id')
      .maybeSingle();
    if (memberError) {
      // 23505 = unique constraint violation (concurrent validation race)
      // Non-fatal: startup was created, just membership link failed
      console.warn(`[autoCreateStartup] startup_members insert failed (${memberError.code}): ${memberError.message}`);
    }

    // Link startup to validator session
    const { error: linkError } = await supabaseAdmin
      .from('validator_sessions')
      .update({ startup_id: startup.id })
      .eq('id', sessionId);
    if (linkError) {
      console.error(`[autoCreateStartup] Failed to link startup to session: ${linkError.message}`);
    }

    console.log(`[autoCreateStartup] Created startup ${startup.id}, linked to session ${sessionId}`);
    return startup.id;
  } catch (e) {
    console.error('[autoCreateStartup] Unexpected error:', e);
    return null;
  }
}

export async function runPipeline(
  supabaseAdmin: SupabaseClient,
  sessionId: string,
  input_text: string,
  startup_id?: string,
  interviewContext?: InterviewContext | null,
  user_id?: string,
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

  // RT-1: Broadcast agent_started for Extractor
  await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
    agent: 'ExtractorAgent', step: AGENT_STEPS.ExtractorAgent, totalSteps: TOTAL_STEPS,
  });
  await startAgentRun(supabaseAdmin, sessionId, 'ExtractorAgent');
  try {
    profile = await runExtractor(supabaseAdmin, sessionId, input_text, interviewContext || undefined);
    if (!profile) {
      failedAgents.push('ExtractorAgent');
      await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
        agent: 'ExtractorAgent', step: AGENT_STEPS.ExtractorAgent, totalSteps: TOTAL_STEPS,
        error: 'Extractor returned null',
      });
      await completeAgentRun(supabaseAdmin, sessionId, 'ExtractorAgent', 'failed', Date.now() - pipelineStart, 'Extractor returned null');
    } else {
      const extractorDurationMs = Date.now() - pipelineStart;
      await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
        agent: 'ExtractorAgent', step: AGENT_STEPS.ExtractorAgent, totalSteps: TOTAL_STEPS,
        durationMs: extractorDurationMs,
      });
      await completeAgentRun(supabaseAdmin, sessionId, 'ExtractorAgent', 'completed', extractorDurationMs);
    }
  } catch (e) {
    console.error('[ExtractorAgent] Failed:', e);
    failedAgents.push('ExtractorAgent');
    const extractorError = e instanceof Error ? e.message : 'Unknown error';
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
      agent: 'ExtractorAgent', step: AGENT_STEPS.ExtractorAgent, totalSteps: TOTAL_STEPS,
      error: extractorError,
    });
    await completeAgentRun(supabaseAdmin, sessionId, 'ExtractorAgent', 'failed', Date.now() - pipelineStart, extractorError);
  }

  // Auto-create startup profile if user doesn't have one yet
  // This allows new users to validate ideas without completing onboarding first
  if (profile && !startup_id && user_id) {
    const newStartupId = await autoCreateStartup(supabaseAdmin, user_id, sessionId, profile);
    if (newStartupId) {
      startup_id = newStartupId;
      console.log(`[pipeline] Auto-created startup ${startup_id} from extraction`);
    }
  }

  // FIX: Deadline check before parallel agents
  if (isExpired()) {
    console.error(`[pipeline] DEADLINE EXCEEDED after ExtractorAgent (${Date.now() - pipelineStart}ms)`);
    throw new Error('Pipeline exceeded wall-clock limit');
  }

  // FIX: Fire Competitors as background promise alongside Research + Scoring.
  // All three run in parallel after Extractor. Scoring uses null for market/competitor data.
  let competitorPromise: Promise<CompetitorAnalysis | null> | null = null;
  if (profile) {
    // RT-1: Broadcast agent_started for Competitors (background)
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
      agent: 'CompetitorAgent', step: AGENT_STEPS.CompetitorAgent, totalSteps: TOTAL_STEPS,
    });
    await startAgentRun(supabaseAdmin, sessionId, 'CompetitorAgent');
    const competitorStartMs = Date.now();
    competitorPromise = runCompetitors(supabaseAdmin, sessionId, profile)
      .then((result) => {
        const compDuration = Date.now() - competitorStartMs;
        if (result) {
          broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
            agent: 'CompetitorAgent', step: AGENT_STEPS.CompetitorAgent, totalSteps: TOTAL_STEPS,
            durationMs: compDuration,
          });
          completeAgentRun(supabaseAdmin, sessionId, 'CompetitorAgent', 'completed', compDuration);
        } else {
          broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
            agent: 'CompetitorAgent', step: AGENT_STEPS.CompetitorAgent, totalSteps: TOTAL_STEPS,
            error: 'Returned null',
          });
          completeAgentRun(supabaseAdmin, sessionId, 'CompetitorAgent', 'failed', compDuration, 'Returned null');
        }
        return result;
      })
      .catch((e) => {
        console.error('[CompetitorAgent] Failed:', e);
        failedAgents.push('CompetitorAgent');
        const compError = e instanceof Error ? e.message : 'Unknown error';
        broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
          agent: 'CompetitorAgent', step: AGENT_STEPS.CompetitorAgent, totalSteps: TOTAL_STEPS,
          error: compError,
        });
        completeAgentRun(supabaseAdmin, sessionId, 'CompetitorAgent', 'failed', Date.now() - competitorStartMs, compError);
        return null;
      });

    // PARALLEL GROUP: Run Research + Scoring simultaneously.
    // Free plan = 150s wall-clock. Sequential took ~135s and crashed.
    // Parallel saves ~31s (Scoring's ~31s runs alongside Research's ~34s).
    // Scoring handles null market/competitor data gracefully ("No data" fallback in contextPack).

    // Start Research as promise
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
      agent: 'ResearchAgent', step: AGENT_STEPS.ResearchAgent, totalSteps: TOTAL_STEPS,
    });
    await startAgentRun(supabaseAdmin, sessionId, 'ResearchAgent');
    const researchStartMs = Date.now();
    const researchPromise = runResearch(supabaseAdmin, sessionId, profile)
      .then((result) => {
        const resDuration = Date.now() - researchStartMs;
        if (!result) {
          failedAgents.push('ResearchAgent');
          broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
            agent: 'ResearchAgent', step: AGENT_STEPS.ResearchAgent, totalSteps: TOTAL_STEPS,
            error: 'Returned null',
          });
          completeAgentRun(supabaseAdmin, sessionId, 'ResearchAgent', 'failed', resDuration, 'Returned null');
        } else {
          broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
            agent: 'ResearchAgent', step: AGENT_STEPS.ResearchAgent, totalSteps: TOTAL_STEPS,
            durationMs: resDuration,
          });
          completeAgentRun(supabaseAdmin, sessionId, 'ResearchAgent', 'completed', resDuration);
        }
        return result;
      })
      .catch((e) => {
        console.error('[ResearchAgent] Failed:', e);
        failedAgents.push('ResearchAgent');
        const resError = e instanceof Error ? e.message : 'Unknown error';
        broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
          agent: 'ResearchAgent', step: AGENT_STEPS.ResearchAgent, totalSteps: TOTAL_STEPS,
          error: resError,
        });
        completeAgentRun(supabaseAdmin, sessionId, 'ResearchAgent', 'failed', Date.now() - researchStartMs, resError);
        return null as MarketResearch | null;
      });

    // Start Scoring as promise IN PARALLEL with Research
    // Scoring uses profile + interviewContext primarily; market/competitor data is optional enrichment.
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
      agent: 'ScoringAgent', step: AGENT_STEPS.ScoringAgent, totalSteps: TOTAL_STEPS,
    });
    await startAgentRun(supabaseAdmin, sessionId, 'ScoringAgent');
    const scoringStartMs = Date.now();
    // F-02 fix: Serialize interviewContext to string — runScoring expects string, not object
    const interviewContextStr = interviewContext
      ? JSON.stringify(interviewContext.extracted || interviewContext, null, 2)
      : undefined;
    const scoringPromise = runScoring(supabaseAdmin, sessionId, profile, null, null, interviewContextStr)
      .then((result) => {
        const scoreDuration = Date.now() - scoringStartMs;
        if (!result) {
          failedAgents.push('ScoringAgent');
          broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
            agent: 'ScoringAgent', step: AGENT_STEPS.ScoringAgent, totalSteps: TOTAL_STEPS,
            error: 'Returned null',
          });
          completeAgentRun(supabaseAdmin, sessionId, 'ScoringAgent', 'failed', scoreDuration, 'Returned null');
        } else {
          broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
            agent: 'ScoringAgent', step: AGENT_STEPS.ScoringAgent, totalSteps: TOTAL_STEPS,
            durationMs: scoreDuration,
          });
          completeAgentRun(supabaseAdmin, sessionId, 'ScoringAgent', 'completed', scoreDuration);
        }
        return result;
      })
      .catch((e) => {
        console.error('[ScoringAgent] Failed:', e);
        failedAgents.push('ScoringAgent');
        const scoreError = e instanceof Error ? e.message : 'Unknown error';
        broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
          agent: 'ScoringAgent', step: AGENT_STEPS.ScoringAgent, totalSteps: TOTAL_STEPS,
          error: scoreError,
        });
        completeAgentRun(supabaseAdmin, sessionId, 'ScoringAgent', 'failed', Date.now() - scoringStartMs, scoreError);
        return null as ScoringResult | null;
      });

    // Await both in parallel: ~35s instead of ~65s sequential
    [marketResearch, scoring] = await Promise.all([researchPromise, scoringPromise]);
  } else {
    // B2 fix: Mark downstream agents as "skipped" when ExtractorAgent fails
    const skippedAgents = ['ResearchAgent', 'CompetitorAgent', 'ScoringAgent', 'MVPAgent', 'ComposerAgent'];
    for (const agentName of skippedAgents) {
      await completeRun(supabaseAdmin, sessionId, agentName, 'skipped', null, [], 'Skipped: ExtractorAgent failed');
      await completeAgentRun(supabaseAdmin, sessionId, agentName, 'skipped', undefined, 'Skipped: ExtractorAgent failed');
      failedAgents.push(agentName);
    }
  }

  // FIX: Deadline check before MVP (after parallel Research + Scoring group)
  if (isExpired()) {
    console.error(`[pipeline] DEADLINE EXCEEDED after parallel group (${Date.now() - pipelineStart}ms)`);
    throw new Error('Pipeline exceeded wall-clock limit');
  }

  await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
    agent: 'MVPAgent', step: AGENT_STEPS.MVPAgent, totalSteps: TOTAL_STEPS,
  });
  await startAgentRun(supabaseAdmin, sessionId, 'MVPAgent');
  const mvpStartMs = Date.now();
  try {
    if (profile && scoring) {
      mvpPlan = await runMVP(supabaseAdmin, sessionId, profile, scoring);
      const mvpDuration = Date.now() - mvpStartMs;
      if (!mvpPlan) {
        failedAgents.push('MVPAgent');
        await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
          agent: 'MVPAgent', step: AGENT_STEPS.MVPAgent, totalSteps: TOTAL_STEPS,
          error: 'Returned null',
        });
        await completeAgentRun(supabaseAdmin, sessionId, 'MVPAgent', 'failed', mvpDuration, 'Returned null');
      } else {
        await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
          agent: 'MVPAgent', step: AGENT_STEPS.MVPAgent, totalSteps: TOTAL_STEPS,
          durationMs: mvpDuration,
        });
        await completeAgentRun(supabaseAdmin, sessionId, 'MVPAgent', 'completed', mvpDuration);
      }
    } else if (profile && !scoring) {
      // B2 fix: Skip MVP when Scoring failed (MVP depends on scoring data)
      await completeRun(supabaseAdmin, sessionId, 'MVPAgent', 'skipped', null, [], 'Skipped: ScoringAgent failed');
      await completeAgentRun(supabaseAdmin, sessionId, 'MVPAgent', 'skipped', undefined, 'Skipped: ScoringAgent failed');
      failedAgents.push('MVPAgent');
      await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
        agent: 'MVPAgent', step: AGENT_STEPS.MVPAgent, totalSteps: TOTAL_STEPS,
        error: 'Skipped: ScoringAgent failed',
      });
    }
  } catch (e) {
    console.error('[MVPAgent] Failed:', e);
    failedAgents.push('MVPAgent');
    const mvpError = e instanceof Error ? e.message : 'Unknown error';
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
      agent: 'MVPAgent', step: AGENT_STEPS.MVPAgent, totalSteps: TOTAL_STEPS,
      error: mvpError,
    });
    await completeAgentRun(supabaseAdmin, sessionId, 'MVPAgent', 'failed', Date.now() - mvpStartMs, mvpError);
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
  // Free plan: Composer gets whatever remains from 140s budget, capped at 50s.
  // Skip Group E (dimension details) if < 20s remain — not enough time on free plan.
  const COMPOSER_MAX_BUDGET_MS = 90_000;
  const composerBudget = Math.min(remainingMs() - 10_000, COMPOSER_MAX_BUDGET_MS);
  await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
    agent: 'ComposerAgent', step: AGENT_STEPS.ComposerAgent, totalSteps: TOTAL_STEPS,
  });
  await startAgentRun(supabaseAdmin, sessionId, 'ComposerAgent');
  const composerStartMs = Date.now();
  if (composerBudget < 35_000) {
    console.error(`[pipeline] Only ${composerBudget}ms left for Composer — skipping (need 35s minimum)`);
    await completeRun(supabaseAdmin, sessionId, 'ComposerAgent', 'skipped', null, [], 'Skipped: insufficient time budget');
    await completeAgentRun(supabaseAdmin, sessionId, 'ComposerAgent', 'skipped', undefined, 'Skipped: insufficient time budget');
    failedAgents.push('ComposerAgent');
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
      agent: 'ComposerAgent', step: AGENT_STEPS.ComposerAgent, totalSteps: TOTAL_STEPS,
      error: 'Skipped: insufficient time budget',
    });
  } else {
    console.log(`[pipeline] Composer budget: ${composerBudget}ms (${remainingMs()}ms remaining)`);
    // M4: Only run composer if we have at least the profile (some data to compose from)
    try {
      if (profile) {
        report = await runComposer(supabaseAdmin, sessionId, profile, marketResearch, competitorAnalysis, scoring, mvpPlan, composerBudget, interviewContext || undefined);
        const composerDuration = Date.now() - composerStartMs;
        if (!report) {
          failedAgents.push('ComposerAgent');
          await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
            agent: 'ComposerAgent', step: AGENT_STEPS.ComposerAgent, totalSteps: TOTAL_STEPS,
            error: 'Returned null',
          });
          await completeAgentRun(supabaseAdmin, sessionId, 'ComposerAgent', 'failed', composerDuration, 'Returned null');
        } else {
          await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
            agent: 'ComposerAgent', step: AGENT_STEPS.ComposerAgent, totalSteps: TOTAL_STEPS,
            durationMs: composerDuration,
          });
          await completeAgentRun(supabaseAdmin, sessionId, 'ComposerAgent', 'completed', composerDuration);
        }
      } else {
        await completeRun(supabaseAdmin, sessionId, 'ComposerAgent', 'skipped', null, [], 'Skipped: no profile data available');
        await completeAgentRun(supabaseAdmin, sessionId, 'ComposerAgent', 'skipped', undefined, 'Skipped: no profile data');
        failedAgents.push('ComposerAgent');
        await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
          agent: 'ComposerAgent', step: AGENT_STEPS.ComposerAgent, totalSteps: TOTAL_STEPS,
          error: 'Skipped: no profile data',
        });
      }
    } catch (e) {
      console.error('[ComposerAgent] Failed:', e);
      failedAgents.push('ComposerAgent');
      const composerError = e instanceof Error ? e.message : 'Unknown error';
      await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
        agent: 'ComposerAgent', step: AGENT_STEPS.ComposerAgent, totalSteps: TOTAL_STEPS,
        error: composerError,
      });
      await completeAgentRun(supabaseAdmin, sessionId, 'ComposerAgent', 'failed', Date.now() - composerStartMs, composerError);
    }
  }

  await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_started', {
    agent: 'VerifierAgent', step: AGENT_STEPS.VerifierAgent, totalSteps: TOTAL_STEPS,
  });
  await startAgentRun(supabaseAdmin, sessionId, 'VerifierAgent');
  const verifierStartMs = Date.now();
  try {
    verification = await runVerifier(supabaseAdmin, sessionId, report, failedAgents);
    const verifierDuration = Date.now() - verifierStartMs;
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_completed', {
      agent: 'VerifierAgent', step: AGENT_STEPS.VerifierAgent, totalSteps: TOTAL_STEPS,
      durationMs: verifierDuration,
    });
    await completeAgentRun(supabaseAdmin, sessionId, 'VerifierAgent', 'completed', verifierDuration);
  } catch (e) {
    console.error('[VerifierAgent] Failed:', e);
    const verifierError = e instanceof Error ? e.message : 'Unknown error';
    await broadcastPipelineEvent(supabaseAdmin, sessionId, 'agent_failed', {
      agent: 'VerifierAgent', step: AGENT_STEPS.VerifierAgent, totalSteps: TOTAL_STEPS,
      error: verifierError,
    });
    await completeAgentRun(supabaseAdmin, sessionId, 'VerifierAgent', 'failed', Date.now() - verifierStartMs, verifierError);
  }

  // F-04 fix: If report is null (Composer skipped/failed), mark as 'failed' not 'partial'.
  // A session without a report row is unusable — 'partial' misleads the frontend into
  // showing a "View Report" button that leads to a 404.
  const finalStatus = failedAgents.length === 0 ? 'complete' :
                      !report ? 'failed' :
                      failedAgents.length < 3 ? 'partial' : 'failed';

  // H6: Check error on report INSERT
  // P04: Slimmed details — don't re-embed profile/scoring (already stored in validator_runs).
  // Keeps INSERT payload small and fast, reducing risk of exceeding 150s wall-clock.
  // R-05: reportId hoisted so broadcast can use it without re-querying
  let insertedReportId: string | undefined;
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
      if (scoring.scores_matrix) enriched.scores_matrix = scoring.scores_matrix;
      if (scoring.bias_flags?.length) enriched.bias_flags = scoring.bias_flags;
      if (scoring.evidence_grades?.length) enriched.evidence_grades = scoring.evidence_grades;
      if (scoring.highest_signal_level) enriched.highest_signal_level = scoring.highest_signal_level;
      if (scoring.risk_queue?.length) enriched.risk_queue = scoring.risk_queue;
    }

    // R-05 fix: Return inserted report ID directly via .select('id').single()
    // Avoids re-querying (getReportId) which can hit read-replica lag
    // MVP-02: Set report_version based on whether Group E dimension data exists
    const hasV3Dimensions = report.dimensions && Object.keys(report.dimensions).length > 0;
    const reportVersion = hasV3Dimensions ? 'v3' : 'v2';
    console.log(`[pipeline] Report version: ${reportVersion}${hasV3Dimensions ? ` (${Object.keys(report.dimensions!).length} dimensions)` : ''}`);

    const { data: insertedReport, error: reportError } = await supabaseAdmin
      .from('validator_reports')
      .insert({
        run_id: null,
        session_id: sessionId,
        startup_id: startup_id || null,
        report_type: 'overall',
        // D-04 fix: Store null when scoring failed — 0 renders as misleading "No-Go" verdict
        score: scoring?.overall_score ?? null,
        summary: report.summary_verdict,
        details: report,
        key_findings: [...(scoring?.highlights || []), ...(scoring?.red_flags || [])],
        verified: verification?.verified || false,
        verification_json: verification,
        report_version: reportVersion,
      })
      .select('id')
      .single();

    if (reportError) {
      console.error('[pipeline] Report INSERT failed:', reportError.message);
    }
    insertedReportId = insertedReport?.id;

    // Post-report guard: ensure startup linkage even if ExtractorAgent produced no profile.
    // Without this, reports are orphaned and dashboard/canvas can't find them.
    if (insertedReportId && !startup_id && user_id) {
      console.warn('[pipeline] Report created without startup_id — attempting late linkage');
      const lateStartupId = await autoCreateStartup(supabaseAdmin, user_id, sessionId, profile || { idea: input_text?.slice(0, 200) || 'Untitled' });
      if (lateStartupId) {
        startup_id = lateStartupId;
        await supabaseAdmin.from('validator_reports').update({ startup_id: lateStartupId }).eq('id', insertedReportId);
        console.log(`[pipeline] Late-linked report ${insertedReportId} to startup ${lateStartupId}`);
      }
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

  // RT-1: Broadcast pipeline completion with report ID for instant frontend navigation
  // R-05 fix: Use insertedReportId directly — no re-query needed
  const reportId = insertedReportId;
  await broadcastPipelineEvent(supabaseAdmin, sessionId,
    finalStatus === 'failed' ? 'pipeline_failed' : 'pipeline_complete', {
    status: finalStatus,
    score: scoring?.overall_score,
    reportId: reportId || undefined,
    durationMs: Date.now() - pipelineStart,
  });

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

  // RT-1: Broadcast pipeline failure
  await broadcastPipelineEvent(supabaseAdmin, sessionId, 'pipeline_failed', {
    status: 'failed',
    error: unhandled instanceof Error ? unhandled.message : 'Pipeline crashed',
    durationMs: Date.now() - pipelineStart,
  });
}
}

// R-05: getReportId removed — report ID now returned directly from INSERT .select('id').single()
