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
  customer: CoverageDepth;
  problem: CoverageDepth;
  competitors: CoverageDepth;
  innovation: CoverageDepth;
  demand: CoverageDepth;
  research: CoverageDepth;
  uniqueness: CoverageDepth;
  websites: CoverageDepth;
}

export interface ExtractedFields {
  problem: string;
  customer: string;
  solution: string;
  differentiation: string;
  demand: string;
  competitors: string;
  business_model: string;
  websites: string;
}

export interface ConfidenceMap {
  problem: ConfidenceLevel;
  customer: ConfidenceLevel;
  solution: ConfidenceLevel;
  differentiation: ConfidenceLevel;
  demand: ConfidenceLevel;
  competitors: ConfidenceLevel;
  business_model: ConfidenceLevel;
  websites: ConfidenceLevel;
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
}

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

/** Check readiness based on v3 adaptive rules. */
export function checkReadiness(coverage: FollowupCoverage, userMessageCount: number): boolean {
  const shallowPlus = countAtDepth(coverage, "shallow");
  const deepCount = countAtDepth(coverage, "deep");

  // Minimum bar: problem AND customer must be at least shallow
  const problemCovered = isCovered(coverage.problem);
  const customerCovered = isCovered(coverage.customer);
  const minBarMet = problemCovered && customerCovered;

  // Quick ready: 3+ messages, 6+ shallow+, 3+ deep, min bar met
  if (userMessageCount >= 3 && shallowPlus >= 6 && deepCount >= 3 && minBarMet) return true;
  // Normal ready: 5+ messages, 5+ shallow+, 2+ deep, min bar met
  if (userMessageCount >= 5 && shallowPlus >= 5 && deepCount >= 2 && minBarMet) return true;
  // Forced ready: 10+ messages always ready
  if (userMessageCount >= 10) return true;

  return false;
}

/** Check minimum data threshold for enabling the Generate button. */
export function hasMinimumData(coverage: FollowupCoverage): boolean {
  const shallowPlus = countAtDepth(coverage, "shallow");
  return isCovered(coverage.problem) && isCovered(coverage.customer) && shallowPlus >= 3;
}

const EMPTY_EXTRACTED: ExtractedFields = {
  problem: "",
  customer: "",
  solution: "",
  differentiation: "",
  demand: "",
  competitors: "",
  business_model: "",
  websites: "",
};

const EMPTY_CONFIDENCE: ConfidenceMap = {
  problem: "low",
  customer: "low",
  solution: "low",
  differentiation: "low",
  demand: "low",
  competitors: "low",
  business_model: "low",
  websites: "low",
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
      // Force session refresh to ensure functions.invoke() sends a valid JWT.
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      console.log('[useValidatorFollowup] refreshSession result:', {
        hasSession: !!refreshData?.session,
        hasUser: !!refreshData?.user,
        accessToken: refreshData?.session?.access_token?.slice(0, 20) + '...',
        error: refreshError?.message,
      });
      if (refreshError || !refreshData?.session?.access_token) {
        const msg = 'Please sign in to continue the validation';
        console.error('[useValidatorFollowup] Session refresh failed:', refreshError);
        setError(msg);
        toast({ title: 'Sign in required', description: msg, variant: 'destructive' });
        return null;
      }

      const accessToken = refreshData.session.access_token;
      console.log('[useValidatorFollowup] Got fresh token:', accessToken.slice(0, 20) + '...');

      const { data, error: fnError } = await supabase.functions.invoke('validator-followup', {
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { messages, sessionId: sessionId || options?.sessionId },
      });

      if (fnError) {
        // Deterministic: prefer status from FunctionsHttpError.context (Response)
        const err = fnError as { context?: { status?: number }; status?: number; message?: string };
        const status = err?.context?.status ?? err?.status;
        const is401 = status === 401;
        if (is401) {
          toast({ title: 'Sign in required', description: 'Please sign in to continue.', variant: 'destructive' });
        }
        throw fnError;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to get follow-up question');
      }

      // Normalize coverage: handle boolean (v1) or depth string (v2)
      const rawCoverage = data.coverage || {};
      const coverage: FollowupCoverage = {
        customer: normalizeCoverageValue(rawCoverage.customer),
        problem: normalizeCoverageValue(rawCoverage.problem),
        competitors: normalizeCoverageValue(rawCoverage.competitors),
        innovation: normalizeCoverageValue(rawCoverage.innovation),
        demand: normalizeCoverageValue(rawCoverage.demand),
        research: normalizeCoverageValue(rawCoverage.research),
        uniqueness: normalizeCoverageValue(rawCoverage.uniqueness),
        websites: normalizeCoverageValue(rawCoverage.websites),
      };

      // Normalize confidence: map unknown values to "low"
      const rawConfidence = data.confidence || {};
      const confidence: ConfidenceMap = {
        problem: normalizeConfidence(rawConfidence.problem),
        customer: normalizeConfidence(rawConfidence.customer),
        solution: normalizeConfidence(rawConfidence.solution),
        differentiation: normalizeConfidence(rawConfidence.differentiation),
        demand: normalizeConfidence(rawConfidence.demand),
        competitors: normalizeConfidence(rawConfidence.competitors),
        business_model: normalizeConfidence(rawConfidence.business_model),
        websites: normalizeConfidence(rawConfidence.websites),
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
          customer: normalizeCoverageValue(rawCoverage.customer),
          problem: normalizeCoverageValue(rawCoverage.problem),
          competitors: normalizeCoverageValue(rawCoverage.competitors),
          innovation: normalizeCoverageValue(rawCoverage.innovation),
          demand: normalizeCoverageValue(rawCoverage.demand),
          research: normalizeCoverageValue(rawCoverage.research),
          uniqueness: normalizeCoverageValue(rawCoverage.uniqueness),
          websites: normalizeCoverageValue(rawCoverage.websites),
        };

        const rawConfidence = payload.confidence || {};
        const confidence: ConfidenceMap = {
          problem: normalizeConfidence(rawConfidence.problem),
          customer: normalizeConfidence(rawConfidence.customer),
          solution: normalizeConfidence(rawConfidence.solution),
          differentiation: normalizeConfidence(rawConfidence.differentiation),
          demand: normalizeConfidence(rawConfidence.demand),
          competitors: normalizeConfidence(rawConfidence.competitors),
          business_model: normalizeConfidence(rawConfidence.business_model),
          websites: normalizeConfidence(rawConfidence.websites),
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
