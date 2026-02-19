/**
 * useCanvasCoach Hook
 * Calls lean-canvas-agent with action:'coach' for conversational Lean Canvas coaching.
 * Follows useValidatorFollowup pattern: invoke + loading + error + concurrency guard.
 */

import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { LeanCanvasData } from '@/hooks/useLeanCanvas';

interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CoachSuggestion {
  box_key: string;
  item: string;
  reasoning: string;
}

export interface CoachResult {
  reply: string;
  weak_sections: string[];
  suggestions: CoachSuggestion[];
  next_chips: string[];
  canvas_score: number;
}

interface StartupContext {
  name: string;
  industry: string;
  stage: string;
  description: string;
}

export function useCanvasCoach() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflightRef = useRef(false);

  const sendMessage = useCallback(async (
    messages: CoachMessage[],
    canvasData: LeanCanvasData,
    startupContext: StartupContext,
    focusedBox?: string,
  ): Promise<CoachResult | null> => {
    // Concurrency guard
    if (inflightRef.current) return null;
    inflightRef.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('lean-canvas-agent', {
        body: {
          action: 'coach',
          messages,
          canvas_data: canvasData,
          startup_context: startupContext,
          focused_box: focusedBox,
        },
      });

      if (fnError) throw fnError;

      if (!data.success) {
        throw new Error(data.error || 'Failed to get coaching response');
      }

      return {
        reply: data.reply,
        weak_sections: data.weak_sections || [],
        suggestions: data.suggestions || [],
        next_chips: data.next_chips || [],
        canvas_score: data.canvas_score ?? 0,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      console.error('[useCanvasCoach] Error:', message);
      return null;
    } finally {
      setIsLoading(false);
      inflightRef.current = false;
    }
  }, []);

  return { sendMessage, isLoading, error };
}
