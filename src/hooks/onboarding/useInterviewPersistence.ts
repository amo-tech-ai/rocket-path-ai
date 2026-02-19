/**
 * Interview Answer Persistence Hook
 * Persists interview answers to localStorage with Supabase sync
 * Implements Task 24: Fix Interview Answer Persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface InterviewState {
  answers: Record<string, { answerId: string; answerText?: string }>;
  currentQuestionIndex: number;
  signals: string[];
  updatedAt: string;
  syncedAt?: string;
}

interface UseInterviewPersistenceOptions {
  startupId?: string;
  sessionId: string;
}

const STORAGE_PREFIX = 'interview_state_';

export function useInterviewPersistence({ startupId, sessionId }: UseInterviewPersistenceOptions) {
  const [isRestoring, setIsRestoring] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedState, setHasSavedState] = useState(false);
  const [restoredState, setRestoredState] = useState<InterviewState | null>(null);

  const storageKey = `${STORAGE_PREFIX}${sessionId}`;

  // Restore from localStorage on mount
  useEffect(() => {
    const restoreState = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as InterviewState;
          // Check if state is fresh (less than 24 hours old)
          const stateAge = Date.now() - new Date(parsed.updatedAt).getTime();
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (stateAge < maxAge && Object.keys(parsed.answers).length > 0) {
            console.log('[InterviewPersistence] Restored state:', {
              answersCount: Object.keys(parsed.answers).length,
              currentIndex: parsed.currentQuestionIndex,
            });
            setRestoredState(parsed);
            setHasSavedState(true);
          } else if (stateAge >= maxAge) {
            // State too old, clear it
            localStorage.removeItem(storageKey);
          }
        }
      } catch (e) {
        console.error('[InterviewPersistence] Failed to restore state:', e);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreState();
  }, [storageKey]);

  // Save answer to localStorage (instant) with optional Supabase sync
  const saveAnswer = useCallback(async (
    questionId: string,
    answerId: string,
    answerText?: string,
    signals: string[] = [],
    currentQuestionIndex: number = 0
  ) => {
    setIsSaving(true);
    
    try {
      // Get current state
      const currentRaw = localStorage.getItem(storageKey);
      const currentState: InterviewState = currentRaw 
        ? JSON.parse(currentRaw)
        : { answers: {}, currentQuestionIndex: 0, signals: [], updatedAt: new Date().toISOString() };

      // Update state
      const newState: InterviewState = {
        answers: {
          ...currentState.answers,
          [questionId]: { answerId, answerText },
        },
        currentQuestionIndex: currentQuestionIndex + 1,
        signals: [...new Set([...currentState.signals, ...signals])],
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage immediately
      localStorage.setItem(storageKey, JSON.stringify(newState));
      setRestoredState(newState);
      setHasSavedState(true);

      console.log('[InterviewPersistence] Saved answer:', { questionId, answerId });

      // Background sync to Supabase (non-blocking)
      if (sessionId) {
        try {
          // Cast to Json-compatible object for Supabase
          const stateForDb = {
            answers: Object.fromEntries(
              Object.entries(newState.answers).map(([k, v]) => [k, { answerId: v.answerId, answerText: v.answerText || null }])
            ),
            currentQuestionIndex: newState.currentQuestionIndex,
            signals: newState.signals,
            updatedAt: newState.updatedAt,
          };
          
          const { error } = await supabase
            .from('wizard_sessions')
            .update({
              // Store interview progress in the existing form_data field
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              form_data: stateForDb as any,
            })
            .eq('id', sessionId);

          if (!error) {
            newState.syncedAt = new Date().toISOString();
            localStorage.setItem(storageKey, JSON.stringify(newState));
          }
        } catch (syncError) {
          console.warn('[InterviewPersistence] Supabase sync failed:', syncError);
        }
      }
    } catch (e) {
      console.error('[InterviewPersistence] Failed to save:', e);
    } finally {
      setIsSaving(false);
    }
  }, [storageKey, sessionId, startupId]);

  // Clear saved state on completion
  const clearState = useCallback(() => {
    localStorage.removeItem(storageKey);
    setRestoredState(null);
    setHasSavedState(false);
    console.log('[InterviewPersistence] Cleared state');
  }, [storageKey]);

  // Get the number of answered questions
  const getAnsweredCount = useCallback(() => {
    return restoredState ? Object.keys(restoredState.answers).length : 0;
  }, [restoredState]);

  return {
    // State
    isRestoring,
    isSaving,
    hasSavedState,
    restoredState,
    
    // Actions
    saveAnswer,
    clearState,
    getAnsweredCount,
  };
}

export default useInterviewPersistence;
