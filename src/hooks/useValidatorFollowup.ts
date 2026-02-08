/**
 * useValidatorFollowup Hook
 * Calls the validator-followup edge function to get AI-powered next questions.
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FollowupCoverage {
  customer: boolean;
  problem: boolean;
  competitors: boolean;
  innovation: boolean;
  demand: boolean;
  research: boolean;
  uniqueness: boolean;
  websites: boolean;
}

export interface FollowupResult {
  action: "ask" | "ready";
  question: string;
  summary: string;
  coverage: FollowupCoverage;
  questionNumber: number;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export function useValidatorFollowup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNextQuestion = useCallback(async (
    messages: ConversationMessage[]
  ): Promise<FollowupResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('validator-followup', {
        body: { messages },
      });

      if (fnError) throw fnError;

      if (!data.success) {
        throw new Error(data.error || 'Failed to get follow-up question');
      }

      return {
        action: data.action,
        question: data.question,
        summary: data.summary,
        coverage: data.coverage,
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
  }, []);

  return { getNextQuestion, isLoading, error };
}
