/**
 * Validator Pipeline Broadcast Helper
 * RT-1: Broadcasts pipeline events via Supabase Realtime.
 * Pattern matches pitch-deck-agent/actions/generation.ts broadcastProgress().
 */

import type { SupabaseClient } from "./types.ts";

export type PipelineEventType =
  | 'agent_started'
  | 'agent_completed'
  | 'agent_failed'
  | 'pipeline_complete'
  | 'pipeline_failed';

export interface PipelineEventPayload {
  sessionId: string;
  agent?: string;
  step?: number;
  totalSteps?: number;
  timestamp: number;
  durationMs?: number;
  error?: string;
  reportId?: string;
  score?: number;
  status?: string;
}

/**
 * Broadcast a pipeline event to the validator:{sessionId} channel.
 * Fire-and-forget — errors are logged but never block the pipeline.
 */
export async function broadcastPipelineEvent(
  supabase: SupabaseClient,
  sessionId: string,
  event: PipelineEventType,
  payload: Omit<PipelineEventPayload, 'sessionId' | 'timestamp'>
): Promise<void> {
  try {
    const channel = supabase.channel(`validator:${sessionId}`);
    await channel.send({
      type: 'broadcast',
      event,
      payload: {
        sessionId,
        timestamp: Date.now(),
        ...payload,
      },
    });
  } catch (error) {
    // Never block the pipeline on broadcast failures
    console.error(`[broadcast] Error broadcasting ${event} for session ${sessionId}:`, error);
  }
}

// Agent step mapping for progress tracking
export const AGENT_STEPS: Record<string, number> = {
  ExtractorAgent: 1,
  ResearchAgent: 2,
  CompetitorAgent: 3,
  ScoringAgent: 4,
  MVPAgent: 5,
  ComposerAgent: 6,
  VerifierAgent: 7,
};

export const TOTAL_STEPS = 7;
