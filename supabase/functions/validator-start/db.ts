/**
 * Validator Database Helpers
 * Functions for updating agent run status in validator_runs table.
 * H6 Fix: All writes check and log errors.
 */

import type { SupabaseClient } from "./types.ts";

export async function updateRunStatus(
  supabase: SupabaseClient,
  sessionId: string,
  agentName: string,
  status: 'running' | 'ok' | 'partial' | 'failed',
  output?: unknown,
  citations?: unknown[],
  error?: string
) {
  const now = new Date().toISOString();
  const update: Record<string, unknown> = { status };

  if (status === 'running') {
    update.started_at = now;
  } else {
    update.finished_at = now;
    if (output) update.output_json = output;
    if (citations) update.citations = citations;
    if (error) update.error_message = error;
  }

  const { error: dbError } = await supabase
    .from('validator_runs')
    .update(update)
    .eq('session_id', sessionId)
    .eq('agent_name', agentName);

  if (dbError) {
    console.error(`[db] updateRunStatus failed for ${agentName}:`, dbError.message);
  }
}

// Helper to calculate duration and update run with it
export async function completeRun(
  supabase: SupabaseClient,
  sessionId: string,
  agentName: string,
  status: 'ok' | 'partial' | 'failed',
  output?: unknown,
  citations?: unknown[],
  error?: string
) {
  // First get the started_at timestamp
  const { data: run, error: selectError } = await supabase
    .from('validator_runs')
    .select('started_at')
    .eq('session_id', sessionId)
    .eq('agent_name', agentName)
    .single();

  if (selectError) {
    console.error(`[db] completeRun select failed for ${agentName}:`, selectError.message);
  }

  const now = new Date();
  const startedAt = run?.started_at ? new Date(run.started_at) : now;
  const durationMs = Math.max(0, now.getTime() - startedAt.getTime());

  const update: Record<string, unknown> = {
    status,
    finished_at: now.toISOString(),
    duration_ms: durationMs,
  };

  if (output) update.output_json = output;
  if (citations) update.citations = citations;
  if (error) update.error_message = error;

  const { error: dbError } = await supabase
    .from('validator_runs')
    .update(update)
    .eq('session_id', sessionId)
    .eq('agent_name', agentName);

  if (dbError) {
    console.error(`[db] completeRun update failed for ${agentName}:`, dbError.message);
  }
}
