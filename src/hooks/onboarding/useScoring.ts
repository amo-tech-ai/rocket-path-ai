/**
 * Scoring Mutations
 * Handles readiness calculation, investor scoring, and AI summary generation
 */

import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { invokeAgent } from './invokeAgent';
import type {
  SessionIdParams,
  ReadinessResult,
  InvestorScoreResult,
  SummaryResult,
  CompleteWizardResult,
} from './types';

export function useScoring() {
  const { toast } = useToast();

  // Calculate readiness score (Step 2)
  const calculateReadinessMutation = useMutation({
    mutationFn: (params: SessionIdParams): Promise<ReadinessResult> =>
      invokeAgent<ReadinessResult>({
        action: 'calculate_readiness',
        session_id: params.session_id,
      }),
    onError: (error) => {
      console.error('Readiness calculation failed:', error);
    },
  });

  // Calculate investor score (Step 4)
  const calculateScoreMutation = useMutation({
    mutationFn: (params: SessionIdParams): Promise<InvestorScoreResult> =>
      invokeAgent<InvestorScoreResult>({
        action: 'calculate_score',
        session_id: params.session_id,
      }),
    onError: (error) => {
      console.error('Calculate score failed:', error);
    },
  });

  // Generate summary (Step 4)
  const generateSummaryMutation = useMutation({
    mutationFn: (params: SessionIdParams): Promise<SummaryResult> =>
      invokeAgent<SummaryResult>({
        action: 'generate_summary',
        session_id: params.session_id,
      }),
    onError: (error) => {
      console.error('Generate summary failed:', error);
    },
  });

  // Complete wizard
  const completeWizardMutation = useMutation({
    mutationFn: (params: SessionIdParams): Promise<CompleteWizardResult> =>
      invokeAgent({
        action: 'complete_wizard',
        session_id: params.session_id,
      }),
    onSuccess: (data) => {
      toast({
        title: 'Setup complete!',
        description: `Your startup profile has been created${data.tasks_created ? ` with ${data.tasks_created} tasks` : ''}.`,
      });
    },
    onError: (error) => {
      console.error('Complete wizard failed:', error);
      toast({
        title: 'Setup failed',
        description: 'Could not complete setup. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    calculateReadiness: calculateReadinessMutation.mutateAsync,
    calculateScore: calculateScoreMutation.mutateAsync,
    generateSummary: generateSummaryMutation.mutateAsync,
    completeWizard: completeWizardMutation.mutateAsync,
    isCalculatingReadiness: calculateReadinessMutation.isPending,
    isCalculatingScore: calculateScoreMutation.isPending,
    isGeneratingSummary: generateSummaryMutation.isPending,
    isCompletingWizard: completeWizardMutation.isPending,
  };
}
