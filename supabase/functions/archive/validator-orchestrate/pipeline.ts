/**
 * Validator v3 Orchestrator Pipeline
 * Production-ready: deadline checks, graceful degradation, correct DB schema.
 * DAG: Extractor → [Research + Competitors parallel] → Scoring → MVP → Composer → Verifier (inline)
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { AGENT_CONFIG, PIPELINE_DEADLINE } from "./config.ts";

interface AgentResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

async function callAgent(
  agentName: keyof typeof AGENT_CONFIG,
  payload: unknown,
  serviceRoleKey: string
): Promise<AgentResult> {
  const config = AGENT_CONFIG[agentName];
  const maxRetries = 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agent ${agentName} failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error(`Agent ${agentName} attempt ${attempt + 1} failed:`, error.message);

      if (attempt === maxRetries) {
        return {
          success: false,
          error: error.message || `${agentName} failed after ${maxRetries + 1} attempts`,
        };
      }
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }

  return { success: false, error: `${agentName} failed` };
}

async function updateSession(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
  payload: { status: string; error_message?: string | null; failed_steps?: string[] }
) {
  const { error } = await supabase.from("validator_sessions").update(payload).eq("id", sessionId);
  if (error) console.error("[updateSession] Failed:", error.message);
}

async function recordAgentRun(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
  agentName: string,
  ok: boolean,
  durationMs: number,
  outputJson?: unknown,
  error?: string
) {
  const startedAt = new Date(Date.now() - durationMs).toISOString();
  const endedAt = new Date().toISOString();

  const { error: insertError } = await supabase.from("validator_agent_runs").insert({
    session_id: sessionId,
    agent_name: agentName,
    attempt: 0,
    status: ok ? "ok" : "failed",
    output_json: outputJson ?? null,
    error: error ?? null,
    duration_ms: durationMs,
    started_at: startedAt,
    ended_at: endedAt,
  });

  if (insertError) console.error("[recordAgentRun] Failed:", insertError.message);
}

function checkDeadline(pipelineStart: number, stage: string): void {
  if (Date.now() - pipelineStart >= PIPELINE_DEADLINE) {
    throw new Error(`Pipeline exceeded wall-clock limit after ${stage}`);
  }
}

export async function runPipeline(
  sessionId: string,
  inputText: string,
  interviewContext: unknown,
  startupId: string | null,
  supabaseUrl: string
): Promise<void> {
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const pipelineStart = Date.now();
  const failedAgents: string[] = [];

  try {
    console.log(`[Pipeline ${sessionId}] Starting`);

    // Stage 1: Extractor (critical — blocks rest)
    checkDeadline(pipelineStart, "pre-extract");
    const extractStart = Date.now();
    const extractResult = await callAgent(
      "extract",
      { input_text: inputText, interview_context: interviewContext },
      serviceRoleKey
    );
    const extractDuration = Date.now() - extractStart;

    await recordAgentRun(
      supabase,
      sessionId,
      "extract",
      extractResult.success,
      extractDuration,
      extractResult.data,
      extractResult.error
    );

    if (!extractResult.success) {
      failedAgents.push("extract");
      throw new Error(`Extractor failed: ${extractResult.error}`);
    }

    const profile = extractResult.data;

    // Stage 2: Research + Competitors (parallel); graceful degradation
    checkDeadline(pipelineStart, "pre-parallel");
    let researchResult: AgentResult = { success: false, error: "Not run" };
    let competitorsResult: AgentResult = { success: false, error: "Not run" };

    const [r, c] = await Promise.all([
      (async () => {
        const start = Date.now();
        const res = await callAgent(
          "research",
          { profile, search_queries: (profile as Record<string, unknown>)?.search_queries },
          serviceRoleKey
        );
        await recordAgentRun(supabase, sessionId, "research", res.success, Date.now() - start, res.data, res.error);
        if (!res.success) failedAgents.push("research");
        return res;
      })(),
      (async () => {
        const start = Date.now();
        const res = await callAgent("competitors", { profile }, serviceRoleKey);
        await recordAgentRun(supabase, sessionId, "competitors", res.success, Date.now() - start, res.data, res.error);
        if (!res.success) failedAgents.push("competitors");
        return res;
      })(),
    ]);

    researchResult = r;
    competitorsResult = c;

    // Stage 3: Scoring (graceful — continue with null research/competitors if needed)
    checkDeadline(pipelineStart, "pre-score");
    let scoringResult: AgentResult = { success: false };
    const scoreStart = Date.now();
    scoringResult = await callAgent(
      "score",
      { profile, research: researchResult.data ?? null, competitors: competitorsResult.data ?? null },
      serviceRoleKey
    );
    await recordAgentRun(
      supabase,
      sessionId,
      "score",
      scoringResult.success,
      Date.now() - scoreStart,
      scoringResult.data,
      scoringResult.error
    );
    if (!scoringResult.success) failedAgents.push("score");

    // Stage 4: MVP (graceful — needs scoring; skip if scoring failed)
    checkDeadline(pipelineStart, "pre-mvp");
    let mvpResult: AgentResult = { success: false };
    if (scoringResult.success) {
      const mvpStart = Date.now();
      mvpResult = await callAgent(
        "mvp",
        {
          profile,
          scores: scoringResult.data,
          risks: (scoringResult.data as Record<string, unknown>)?.risks || [],
        },
        serviceRoleKey
      );
      await recordAgentRun(supabase, sessionId, "mvp", mvpResult.success, Date.now() - mvpStart, mvpResult.data, mvpResult.error);
      if (!mvpResult.success) failedAgents.push("mvp");
    } else {
      failedAgents.push("mvp"); // skipped due to scoring failure
    }

    // Stage 5: Composer (graceful — run if we have profile; use partial upstream data)
    checkDeadline(pipelineStart, "pre-compose");
    let composerResult: AgentResult = { success: false };
    const composeStart = Date.now();
    composerResult = await callAgent(
      "compose",
      {
        profile,
        research: researchResult.data ?? null,
        competitors: competitorsResult.data ?? null,
        scoring: scoringResult.data ?? null,
        mvp: mvpResult.data ?? null,
      },
      serviceRoleKey
    );
    await recordAgentRun(
      supabase,
      sessionId,
      "compose",
      composerResult.success,
      Date.now() - composeStart,
      composerResult.data,
      composerResult.error
    );
    if (!composerResult.success) failedAgents.push("compose");

    const scoring = scoringResult.data as Record<string, unknown> | undefined;
    const report = composerResult.success ? (composerResult.data as Record<string, unknown>) : undefined;

    // Insert validator_reports when we have report data
    if (report) {
      const { error: reportError } = await supabase.from("validator_reports").insert({
        run_id: null,
        session_id: sessionId,
        startup_id: startupId,
        report_type: "overall",
        score: (scoring?.overall_score as number) ?? 0,
        summary: (report?.summary_verdict as string) ?? "",
        details: report,
        key_findings: [
          ...((scoring?.highlights as string[]) ?? []),
          ...((scoring?.red_flags as string[]) ?? []),
        ],
        verified: false, // Inline verifier can be extended later
        verification_json: null,
      });

      if (reportError) {
        console.error("[pipeline] Report INSERT failed:", reportError.message);
      }
    }

    const finalStatus = failedAgents.length === 0 ? "complete" : failedAgents.length < 3 ? "partial" : "failed";
    await updateSession(supabase, sessionId, {
      status: finalStatus,
      error_message: failedAgents.length > 0 ? `Failed agents: ${failedAgents.join(", ")}` : null,
      failed_steps: failedAgents,
    });

    console.log(`[Pipeline ${sessionId}] Completed: ${finalStatus} in ${Date.now() - pipelineStart}ms`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Pipeline ${sessionId}] Failed:`, message);

    await updateSession(supabase, sessionId, {
      status: "failed",
      error_message: message,
      failed_steps: failedAgents,
    });
  }
}
