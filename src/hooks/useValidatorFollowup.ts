/**
 * useValidatorFollowup Hook
 * Calls the validator-followup edge function to get AI-powered next questions.
 * v2: Depth-based coverage (none/shallow/deep) + extracted fields.
 * v3: L3 streaming support — real-time token display via broadcast channel.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type CoverageDepth = "none" | "shallow" | "deep";
export type ConfidenceLevel = "low" | "medium" | "high";

export interface FollowupCoverage {
  company_name: CoverageDepth;
  customer: CoverageDepth;
  problem: CoverageDepth;
  solution: CoverageDepth;
  competitors: CoverageDepth;
  innovation: CoverageDepth;
  demand: CoverageDepth;
  research: CoverageDepth;
  uniqueness: CoverageDepth;
  websites: CoverageDepth;
  industry: CoverageDepth;
  business_model: CoverageDepth;
  stage: CoverageDepth;
  // Deep dive topics (optional, enhance V3 dimension quality)
  ai_strategy: CoverageDepth;
  risk_awareness: CoverageDepth;
  execution_plan: CoverageDepth;
  investor_readiness: CoverageDepth;
}

export interface ExtractedFields {
  company_name: string;
  problem: string;
  customer: string;
  solution: string;
  differentiation: string;
  demand: string;
  competitors: string;
  business_model: string;
  websites: string;
  industry_categories: string;
  stage: string;
  linkedin_url: string;
  // Deep dive extracted fields
  ai_strategy: string;
  risk_awareness: string;
  execution_plan: string;
  investor_readiness: string;
}

export interface ConfidenceMap {
  company_name: ConfidenceLevel;
  problem: ConfidenceLevel;
  customer: ConfidenceLevel;
  solution: ConfidenceLevel;
  differentiation: ConfidenceLevel;
  demand: ConfidenceLevel;
  competitors: ConfidenceLevel;
  business_model: ConfidenceLevel;
  websites: ConfidenceLevel;
  industry_categories: ConfidenceLevel;
  stage: ConfidenceLevel;
  linkedin_url: ConfidenceLevel;
  // Deep dive confidence
  ai_strategy: ConfidenceLevel;
  risk_awareness: ConfidenceLevel;
  execution_plan: ConfidenceLevel;
  investor_readiness: ConfidenceLevel;
}

export interface DiscoveredEntities {
  competitors: string[];
  urls: string[];
  marketData: string[];
}

export interface FollowupResult {
  action: "ask" | "ready";
  question: string;
  summary: string;
  readiness_reason: string;
  coverage: FollowupCoverage;
  extracted: ExtractedFields;
  confidence: ConfidenceMap;
  contradictions: string[];
  discoveredEntities: DiscoveredEntities;
  questionNumber: number;
  suggestions: string[];
}

export type CoverageTier = 'core' | 'deep';

/** Core topics (required for report generation) */
export const CORE_TOPIC_KEYS: (keyof FollowupCoverage)[] = [
  'company_name', 'customer', 'problem', 'solution', 'competitors',
  'innovation', 'demand', 'research', 'uniqueness', 'websites',
  'industry', 'business_model', 'stage',
];

/** Deep dive topics (optional, enhance V3 dimension quality) */
export const DEEP_DIVE_TOPIC_KEYS: (keyof FollowupCoverage)[] = [
  'ai_strategy', 'risk_awareness', 'execution_plan', 'investor_readiness',
];

/** Check if a topic is covered (shallow or deep). Handles boolean for backwards compat. */
export function isCovered(depth: CoverageDepth | boolean): boolean {
  if (typeof depth === "boolean") return depth;
  return depth !== "none";
}

/** Check if a topic is deep. */
export function isDeep(depth: CoverageDepth | boolean): boolean {
  if (typeof depth === "boolean") return depth;
  return depth === "deep";
}

/** Count topics at a given minimum depth. */
export function countAtDepth(coverage: FollowupCoverage, minDepth: "shallow" | "deep"): number {
  return Object.values(coverage).filter(d => {
    if (minDepth === "deep") return d === "deep";
    return d === "shallow" || d === "deep";
  }).length;
}

/** Count topics at a given minimum depth, filtered to specific keys. */
export function countAtDepthForKeys(coverage: FollowupCoverage, minDepth: "shallow" | "deep", keys: (keyof FollowupCoverage)[]): number {
  return keys.filter(k => {
    const d = coverage[k];
    if (minDepth === "deep") return d === "deep";
    return d === "shallow" || d === "deep";
  }).length;
}

/** Check readiness based on v4 two-tier rules. Core topics (13) determine readiness. Deep dive (4) are optional. */
export function checkReadiness(coverage: FollowupCoverage, userMessageCount: number): boolean {
  // Count CORE topics only for readiness
  const coreShallowPlus = countAtDepthForKeys(coverage, "shallow", CORE_TOPIC_KEYS);
  const coreDeepCount = countAtDepthForKeys(coverage, "deep", CORE_TOPIC_KEYS);

  // Minimum bar: problem AND customer AND company_name must be at least shallow
  const problemCovered = isCovered(coverage.problem);
  const customerCovered = isCovered(coverage.customer);
  const nameCovered = isCovered(coverage.company_name);
  const minBarMet = problemCovered && customerCovered && nameCovered;

  // Quick ready: 3+ messages, 9+ core shallow+, 4+ core deep, min bar met
  if (userMessageCount >= 3 && coreShallowPlus >= 9 && coreDeepCount >= 4 && minBarMet) return true;
  // Normal ready: 5+ messages, 8+ core shallow+, 3+ core deep, min bar met
  if (userMessageCount >= 5 && coreShallowPlus >= 8 && coreDeepCount >= 3 && minBarMet) return true;
  // Forced ready: 10+ messages always ready
  if (userMessageCount >= 10) return true;

  return false;
}

/** Check if all 13 core topics have at least shallow coverage. */
export function isCoreComplete(coverage: FollowupCoverage): boolean {
  return CORE_TOPIC_KEYS.every(k => isCovered(coverage[k]));
}

/** Determine coverage tier based on deep dive topic coverage. */
export function getCoverageTier(coverage: FollowupCoverage): CoverageTier {
  const deepDiveCovered = DEEP_DIVE_TOPIC_KEYS.filter(k => isCovered(coverage[k])).length;
  return deepDiveCovered >= DEEP_DIVE_TOPIC_KEYS.length ? 'deep' : 'core';
}

/** Check minimum data threshold for enabling the Generate button. Uses core topics only. */
export function hasMinimumData(coverage: FollowupCoverage): boolean {
  const coreShallowPlus = countAtDepthForKeys(coverage, "shallow", CORE_TOPIC_KEYS);
  return isCovered(coverage.problem) && isCovered(coverage.customer) && isCovered(coverage.company_name) && coreShallowPlus >= 4;
}

const EMPTY_EXTRACTED: ExtractedFields = {
  company_name: "",
  problem: "",
  customer: "",
  solution: "",
  differentiation: "",
  demand: "",
  competitors: "",
  business_model: "",
  websites: "",
  industry_categories: "",
  stage: "",
  linkedin_url: "",
  ai_strategy: "",
  risk_awareness: "",
  execution_plan: "",
  investor_readiness: "",
};

const EMPTY_CONFIDENCE: ConfidenceMap = {
  company_name: "low",
  problem: "low",
  customer: "low",
  solution: "low",
  differentiation: "low",
  demand: "low",
  competitors: "low",
  business_model: "low",
  websites: "low",
  industry_categories: "low",
  stage: "low",
  linkedin_url: "low",
  ai_strategy: "low",
  risk_awareness: "low",
  execution_plan: "low",
  investor_readiness: "low",
};

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export function useValidatorFollowup(options?: { sessionId?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getNextQuestion = useCallback(async (
    messages: ConversationMessage[],
    sessionId?: string
  ): Promise<FollowupResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use getSession() (cache-first) instead of refreshSession() to avoid race
      // conditions with the no-op lock bypass. autoRefreshToken handles token refresh
      // in the background. If the edge function returns 401, we retry once after
      // an explicit refreshSession().
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        const msg = 'Please sign in to continue the validation';
        console.error('[useValidatorFollowup] No session available');
        setError(msg);
        toast({ title: 'Sign in required', description: msg, variant: 'destructive' });
        return null;
      }

      let accessToken = session.access_token;

      const invoke = async (token: string) =>
        supabase.functions.invoke('validator-followup', {
          headers: { Authorization: `Bearer ${token}` },
          body: { messages, sessionId: sessionId || options?.sessionId },
        });

      let { data, error: fnError } = await invoke(accessToken);

      // 401 retry: token may have expired between getSession() and invoke().
      // Refresh once and retry — this is the recovery path, not the hot path.
      if (fnError) {
        const err = fnError as { context?: { status?: number }; status?: number; message?: string };
        const status = err?.context?.status ?? err?.status;
        if (status === 401) {
          console.warn('[useValidatorFollowup] 401 — refreshing session and retrying');
          const { data: refreshData } = await supabase.auth.refreshSession();
          if (refreshData?.session?.access_token) {
            accessToken = refreshData.session.access_token;
            const retry = await invoke(accessToken);
            data = retry.data;
            fnError = retry.error;
          } else {
            toast({ title: 'Sign in required', description: 'Please sign in to continue.', variant: 'destructive' });
            throw fnError;
          }
        }
      }

      if (fnError) {
        const err = fnError as { context?: { status?: number }; status?: number; message?: string };
        const status = err?.context?.status ?? err?.status;
        if (status === 401) {
          toast({ title: 'Sign in required', description: 'Please sign in to continue.', variant: 'destructive' });
        }
        throw fnError;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to get follow-up question');
      }

      // Normalize coverage: handle boolean (v1) or depth string (v2/v4)
      const rawCoverage = data.coverage || {};
      const coverage: FollowupCoverage = {
        company_name: normalizeCoverageValue(rawCoverage.company_name),
        customer: normalizeCoverageValue(rawCoverage.customer),
        problem: normalizeCoverageValue(rawCoverage.problem),
        solution: normalizeCoverageValue(rawCoverage.solution),
        competitors: normalizeCoverageValue(rawCoverage.competitors),
        innovation: normalizeCoverageValue(rawCoverage.innovation),
        demand: normalizeCoverageValue(rawCoverage.demand),
        research: normalizeCoverageValue(rawCoverage.research),
        uniqueness: normalizeCoverageValue(rawCoverage.uniqueness),
        websites: normalizeCoverageValue(rawCoverage.websites),
        industry: normalizeCoverageValue(rawCoverage.industry),
        business_model: normalizeCoverageValue(rawCoverage.business_model),
        stage: normalizeCoverageValue(rawCoverage.stage),
        ai_strategy: normalizeCoverageValue(rawCoverage.ai_strategy),
        risk_awareness: normalizeCoverageValue(rawCoverage.risk_awareness),
        execution_plan: normalizeCoverageValue(rawCoverage.execution_plan),
        investor_readiness: normalizeCoverageValue(rawCoverage.investor_readiness),
      };

      // Normalize confidence: map unknown values to "low"
      const rawConfidence = data.confidence || {};
      const confidence: ConfidenceMap = {
        company_name: normalizeConfidence(rawConfidence.company_name),
        problem: normalizeConfidence(rawConfidence.problem),
        customer: normalizeConfidence(rawConfidence.customer),
        solution: normalizeConfidence(rawConfidence.solution),
        differentiation: normalizeConfidence(rawConfidence.differentiation),
        demand: normalizeConfidence(rawConfidence.demand),
        competitors: normalizeConfidence(rawConfidence.competitors),
        business_model: normalizeConfidence(rawConfidence.business_model),
        websites: normalizeConfidence(rawConfidence.websites),
        industry_categories: normalizeConfidence(rawConfidence.industry_categories),
        stage: normalizeConfidence(rawConfidence.stage),
        linkedin_url: normalizeConfidence(rawConfidence.linkedin_url),
        ai_strategy: normalizeConfidence(rawConfidence.ai_strategy),
        risk_awareness: normalizeConfidence(rawConfidence.risk_awareness),
        execution_plan: normalizeConfidence(rawConfidence.execution_plan),
        investor_readiness: normalizeConfidence(rawConfidence.investor_readiness),
      };

      return {
        action: data.action,
        question: data.question,
        summary: data.summary,
        readiness_reason: data.readiness_reason || '',
        coverage,
        extracted: data.extracted || EMPTY_EXTRACTED,
        confidence,
        contradictions: Array.isArray(data.contradictions) ? data.contradictions : [],
        discoveredEntities: data.discoveredEntities || { competitors: [], urls: [], marketData: [] },
        questionNumber: data.questionNumber,
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      console.error('[useValidatorFollowup] Error:', message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { getNextQuestion, isLoading, error };
}

/** Normalize a coverage value from v1 (boolean) or v2 (depth string). */
function normalizeCoverageValue(val: unknown): CoverageDepth {
  if (val === true) return "shallow";
  if (val === false || val === null || val === undefined) return "none";
  if (val === "none" || val === "shallow" || val === "deep") return val;
  return "none";
}

/** Normalize a confidence value. */
function normalizeConfidence(val: unknown): ConfidenceLevel {
  if (val === "low" || val === "medium" || val === "high") return val;
  return "low";
}

// ============ Streaming Support (L3) ============

export interface StreamingState {
  /** Whether we're currently receiving streamed tokens */
  isStreaming: boolean;
  /** Accumulated text so far */
  streamedText: string;
  /** The metadata from followup_metadata event */
  metadata: FollowupResult | null;
}

/**
 * Subscribe to the validator broadcast channel for streaming follow-up responses.
 * Returns streaming state that updates in real-time as tokens arrive.
 *
 * Usage: call `subscribe(sessionId)` before sending the edge function request.
 * When `message_complete` fires, the streaming state is finalized.
 * Call `reset()` to clear state between messages.
 */
export function useFollowupStreaming() {
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    streamedText: '',
    metadata: null,
  });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const bufferRef = useRef('');

  const subscribe = useCallback((sessionId: string) => {
    // Clean up previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    bufferRef.current = '';
    setStreamingState({ isStreaming: false, streamedText: '', metadata: null });

    const channel = supabase.channel(`validator:${sessionId}`);

    channel
      .on('broadcast', { event: 'followup_metadata' }, ({ payload }) => {
        if (!payload) return;
        const rawCoverage = payload.coverage || {};
        const coverage: FollowupCoverage = {
          company_name: normalizeCoverageValue(rawCoverage.company_name),
          customer: normalizeCoverageValue(rawCoverage.customer),
          problem: normalizeCoverageValue(rawCoverage.problem),
          solution: normalizeCoverageValue(rawCoverage.solution),
          competitors: normalizeCoverageValue(rawCoverage.competitors),
          innovation: normalizeCoverageValue(rawCoverage.innovation),
          demand: normalizeCoverageValue(rawCoverage.demand),
          research: normalizeCoverageValue(rawCoverage.research),
          uniqueness: normalizeCoverageValue(rawCoverage.uniqueness),
          websites: normalizeCoverageValue(rawCoverage.websites),
          industry: normalizeCoverageValue(rawCoverage.industry),
          business_model: normalizeCoverageValue(rawCoverage.business_model),
          stage: normalizeCoverageValue(rawCoverage.stage),
          ai_strategy: normalizeCoverageValue(rawCoverage.ai_strategy),
          risk_awareness: normalizeCoverageValue(rawCoverage.risk_awareness),
          execution_plan: normalizeCoverageValue(rawCoverage.execution_plan),
          investor_readiness: normalizeCoverageValue(rawCoverage.investor_readiness),
        };

        const rawConfidence = payload.confidence || {};
        const confidence: ConfidenceMap = {
          company_name: normalizeConfidence(rawConfidence.company_name),
          problem: normalizeConfidence(rawConfidence.problem),
          customer: normalizeConfidence(rawConfidence.customer),
          solution: normalizeConfidence(rawConfidence.solution),
          differentiation: normalizeConfidence(rawConfidence.differentiation),
          demand: normalizeConfidence(rawConfidence.demand),
          competitors: normalizeConfidence(rawConfidence.competitors),
          business_model: normalizeConfidence(rawConfidence.business_model),
          websites: normalizeConfidence(rawConfidence.websites),
          industry_categories: normalizeConfidence(rawConfidence.industry_categories),
          stage: normalizeConfidence(rawConfidence.stage),
          linkedin_url: normalizeConfidence(rawConfidence.linkedin_url),
          ai_strategy: normalizeConfidence(rawConfidence.ai_strategy),
          risk_awareness: normalizeConfidence(rawConfidence.risk_awareness),
          execution_plan: normalizeConfidence(rawConfidence.execution_plan),
          investor_readiness: normalizeConfidence(rawConfidence.investor_readiness),
        };

        const metadata: FollowupResult = {
          action: payload.action,
          question: '', // will be built from tokens
          summary: payload.summary || '',
          readiness_reason: payload.readiness_reason || '',
          coverage,
          extracted: payload.extracted || EMPTY_EXTRACTED,
          confidence,
          contradictions: Array.isArray(payload.contradictions) ? payload.contradictions : [],
          discoveredEntities: payload.discoveredEntities || { competitors: [], urls: [], marketData: [] },
          questionNumber: payload.questionNumber,
          suggestions: Array.isArray(payload.suggestions) ? payload.suggestions : [],
        };

        setStreamingState(prev => ({ ...prev, metadata, isStreaming: true }));
      })
      .on('broadcast', { event: 'token_chunk' }, ({ payload }) => {
        if (!payload?.token) return;
        bufferRef.current += payload.token;
        setStreamingState(prev => ({
          ...prev,
          isStreaming: true,
          streamedText: bufferRef.current,
        }));
      })
      .on('broadcast', { event: 'message_complete' }, () => {
        setStreamingState(prev => ({
          ...prev,
          isStreaming: false,
          streamedText: bufferRef.current,
          metadata: prev.metadata
            ? { ...prev.metadata, question: bufferRef.current }
            : prev.metadata,
        }));
      })
      .subscribe();

    channelRef.current = channel;
  }, []);

  const reset = useCallback(() => {
    bufferRef.current = '';
    setStreamingState({ isStreaming: false, streamedText: '', metadata: null });
  }, []);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    reset();
  }, [reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return { streamingState, subscribe, reset, cleanup };
}
