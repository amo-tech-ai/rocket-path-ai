/**
 * Onboarding Agent Hook
 * Composite hook that combines all onboarding mutations
 */

import { useEnrichment } from './useEnrichment';
import { useInterview } from './useInterview';
import { useScoring } from './useScoring';

export function useOnboardingAgent() {
  const enrichment = useEnrichment();
  const interview = useInterview();
  const scoring = useScoring();

  return {
    // Enrichment actions
    enrichUrl: enrichment.enrichUrl,
    enrichContext: enrichment.enrichContext,
    enrichFounder: enrichment.enrichFounder,
    isEnrichingUrl: enrichment.isEnrichingUrl,
    isEnrichingContext: enrichment.isEnrichingContext,
    isEnrichingFounder: enrichment.isEnrichingFounder,

    // Interview actions
    getQuestions: interview.getQuestions,
    processAnswer: interview.processAnswer,
    isGettingQuestions: interview.isGettingQuestions,
    isProcessingAnswer: interview.isProcessingAnswer,

    // Scoring actions
    calculateReadiness: scoring.calculateReadiness,
    calculateScore: scoring.calculateScore,
    generateSummary: scoring.generateSummary,
    completeWizard: scoring.completeWizard,
    isCalculatingReadiness: scoring.isCalculatingReadiness,
    isCalculatingScore: scoring.isCalculatingScore,
    isGeneratingSummary: scoring.isGeneratingSummary,
    isCompletingWizard: scoring.isCompletingWizard,

    // Composite state
    isProcessing:
      enrichment.isEnrichingUrl ||
      enrichment.isEnrichingContext ||
      enrichment.isEnrichingFounder ||
      interview.isGettingQuestions ||
      interview.isProcessingAnswer ||
      scoring.isCalculatingReadiness ||
      scoring.isCalculatingScore ||
      scoring.isGeneratingSummary ||
      scoring.isCompletingWizard,
  };
}

export default useOnboardingAgent;
