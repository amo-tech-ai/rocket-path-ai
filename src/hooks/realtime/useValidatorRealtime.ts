/**
 * RT-1: Validator Pipeline Realtime Hook
 *
 * Subscribes to `validator:{sessionId}` broadcast channel.
 * Receives per-agent progress events from the pipeline edge function.
 * Falls back gracefully if realtime connection fails.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRealtimeChannel } from './useRealtimeChannel';
import type {
  ValidatorAgentPayload,
  ValidatorPipelineCompletePayload,
  ValidatorRealtimeAgent,
  ValidatorRealtimeState,
  ValidatorAgentStatus,
} from './types';

const AGENT_NAMES = [
  'ExtractorAgent',
  'ResearchAgent',
  'CompetitorAgent',
  'ScoringAgent',
  'MVPAgent',
  'ComposerAgent',
  'VerifierAgent',
];

function createInitialAgents(): ValidatorRealtimeAgent[] {
  return AGENT_NAMES.map((name, i) => ({
    name,
    step: i + 1,
    status: 'queued' as ValidatorAgentStatus,
  }));
}

export interface ValidatorFollowupPayload {
  sessionId: string;
  action: 'ask' | 'ready';
  question: string;
  coverage: Record<string, string>;
  questionNumber: number;
  timestamp: number;
}

export interface UseValidatorRealtimeOptions {
  sessionId: string | undefined;
  enabled?: boolean;
  onPipelineComplete?: (payload: ValidatorPipelineCompletePayload) => void;
  onPipelineFailed?: (payload: ValidatorPipelineCompletePayload) => void;
  onFollowupReady?: (payload: ValidatorFollowupPayload) => void;
}

export interface UseValidatorRealtimeReturn extends ValidatorRealtimeState {
  /** Progress percentage 0-100 based on completed agents */
  progress: number;
  /** Whether realtime is connected (false = polling fallback needed) */
  isConnected: boolean;
  /** Number of events received (0 = likely no realtime) */
  eventCount: number;
  /** Latest follow-up question received via RT-5 */
  followup: ValidatorFollowupPayload | null;
}

export function useValidatorRealtime({
  sessionId,
  enabled = true,
  onPipelineComplete,
  onPipelineFailed,
  onFollowupReady,
}: UseValidatorRealtimeOptions): UseValidatorRealtimeReturn {
  const [agents, setAgents] = useState<ValidatorRealtimeAgent[]>(createInitialAgents);
  const [pipelineStatus, setPipelineStatus] = useState<'running' | 'complete' | 'partial' | 'failed'>('running');
  const [reportId, setReportId] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [followup, setFollowup] = useState<ValidatorFollowupPayload | null>(null);

  // Stable callback refs
  const onCompleteRef = useRef(onPipelineComplete);
  onCompleteRef.current = onPipelineComplete;
  const onFailedRef = useRef(onPipelineFailed);
  onFailedRef.current = onPipelineFailed;
  const onFollowupRef = useRef(onFollowupReady);
  onFollowupRef.current = onFollowupReady;

  const handleAgentStarted = useCallback((payload: unknown) => {
    const p = payload as ValidatorAgentPayload;
    setEventCount(c => c + 1);
    setLastEvent('agent_started');
    setAgents(prev => prev.map(a =>
      a.name === p.agent ? { ...a, status: 'running' } : a
    ));
  }, []);

  const handleAgentCompleted = useCallback((payload: unknown) => {
    const p = payload as ValidatorAgentPayload;
    setEventCount(c => c + 1);
    setLastEvent('agent_completed');
    setAgents(prev => prev.map(a =>
      a.name === p.agent ? { ...a, status: 'ok', durationMs: p.durationMs } : a
    ));
  }, []);

  const handleAgentFailed = useCallback((payload: unknown) => {
    const p = payload as ValidatorAgentPayload;
    setEventCount(c => c + 1);
    setLastEvent('agent_failed');
    setAgents(prev => prev.map(a =>
      a.name === p.agent ? { ...a, status: 'failed', error: p.error } : a
    ));
  }, []);

  const handlePipelineComplete = useCallback((payload: unknown) => {
    const p = payload as ValidatorPipelineCompletePayload;
    setEventCount(c => c + 1);
    setLastEvent('pipeline_complete');
    setPipelineStatus(p.status === 'failed' ? 'failed' : p.status === 'partial' ? 'partial' : 'complete');
    if (p.reportId) setReportId(p.reportId);
    if (p.score != null) setScore(p.score);
    onCompleteRef.current?.(p);
  }, []);

  const handlePipelineFailed = useCallback((payload: unknown) => {
    const p = payload as ValidatorPipelineCompletePayload;
    setEventCount(c => c + 1);
    setLastEvent('pipeline_failed');
    setPipelineStatus('failed');
    onFailedRef.current?.(p);
  }, []);

  // RT-6: DB trigger — session status changed
  const handleSessionStatusChanged = useCallback((payload: unknown) => {
    const p = payload as { sessionId: string; status: string; timestamp: number };
    setEventCount(c => c + 1);
    setLastEvent('session_status_changed');
    const validStatuses = ['running', 'complete', 'partial', 'failed'] as const;
    if (validStatuses.includes(p.status as 'running' | 'complete' | 'partial' | 'failed')) {
      setPipelineStatus(p.status as 'running' | 'complete' | 'partial' | 'failed');
    }
  }, []);

  // RT-6: DB trigger — report created
  const handleReportCreated = useCallback((payload: unknown) => {
    const p = payload as { reportId: string; sessionId: string; overallScore: number; timestamp: number };
    setEventCount(c => c + 1);
    setLastEvent('report_created');
    if (p.reportId) setReportId(p.reportId);
    if (p.overallScore != null) setScore(p.overallScore);
  }, []);

  // RT-5: Follow-up push delivery
  const handleFollowupReady = useCallback((payload: unknown) => {
    const p = payload as ValidatorFollowupPayload;
    setEventCount(c => c + 1);
    setLastEvent('followup_ready');
    setFollowup(p);
    onFollowupRef.current?.(p);
  }, []);

  // Reset state when sessionId changes
  useEffect(() => {
    setAgents(createInitialAgents());
    setPipelineStatus('running');
    setReportId(null);
    setScore(null);
    setLastEvent(null);
    setEventCount(0);
    setFollowup(null);
  }, [sessionId]);

  const { isSubscribed } = useRealtimeChannel({
    topic: `validator:${sessionId}`,
    enabled: enabled && !!sessionId,
    private: true,
    self: false,
    onBroadcast: {
      agent_started: handleAgentStarted,
      agent_completed: handleAgentCompleted,
      agent_failed: handleAgentFailed,
      pipeline_complete: handlePipelineComplete,
      pipeline_failed: handlePipelineFailed,
      followup_ready: handleFollowupReady,
      session_status_changed: handleSessionStatusChanged,
      report_created: handleReportCreated,
    },
  });

  // Calculate progress from agent statuses
  const completedCount = agents.filter(a =>
    a.status === 'ok' || a.status === 'partial' || a.status === 'failed' || a.status === 'skipped'
  ).length;
  const progress = Math.round((completedCount / AGENT_NAMES.length) * 100);

  return {
    agents,
    pipelineStatus,
    reportId,
    score,
    lastEvent,
    isConnected: isSubscribed,
    eventCount,
    progress,
    followup,
  };
}
