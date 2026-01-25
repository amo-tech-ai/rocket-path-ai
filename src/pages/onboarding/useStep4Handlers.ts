/**
 * Step 4 Handlers Hook
 * Manages scoring and completion for Review & Score step
 */

import { useCallback } from 'react';
import { WizardFormData, InvestorScore, AISummary } from '@/hooks/onboarding/types';

interface UseStep4HandlersParams {
  sessionId: string | undefined;
  setInvestorScore: (score: InvestorScore | null) => void;
  setAiSummary: (summary: AISummary | null) => void;
  updateFormData: (updates: Partial<WizardFormData>) => void;
  calculateScore: (params: { session_id: string }) => Promise<any>;
  generateSummary: (params: { session_id: string }) => Promise<any>;
  completeWizard: (params: { session_id: string }) => Promise<any>;
  navigate: (path: string, options?: { replace?: boolean }) => void;
}

export function useStep4Handlers({
  sessionId,
  setInvestorScore,
  setAiSummary,
  updateFormData,
  calculateScore,
  generateSummary,
  completeWizard,
  navigate,
}: UseStep4HandlersParams) {
  const handleCalculateScore = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const result = await calculateScore({ session_id: sessionId });
      if (result.investor_score) {
        setInvestorScore(result.investor_score);
        updateFormData({ investor_score: result.investor_score });
      }
    } catch (error) {
      console.error('Calculate score error:', error);
    }
  }, [sessionId, calculateScore, setInvestorScore, updateFormData]);

  const handleGenerateSummary = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      const result = await generateSummary({ session_id: sessionId });
      if (result.summary) {
        setAiSummary(result.summary);
        updateFormData({ ai_summary: result.summary });
      }
    } catch (error) {
      console.error('Generate summary error:', error);
    }
  }, [sessionId, generateSummary, setAiSummary, updateFormData]);

  const handleComplete = useCallback(async () => {
    if (!sessionId) return;

    try {
      const result = await completeWizard({ session_id: sessionId });
      if (result.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Complete wizard error:', error);
    }
  }, [sessionId, completeWizard, navigate]);

  return {
    handleCalculateScore,
    handleGenerateSummary,
    handleComplete,
  };
}
