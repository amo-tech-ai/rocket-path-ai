/**
 * useOnboardingAgent Hook
 * 
 * Re-exports from modular hook structure for backwards compatibility.
 * The implementation is now split into specialized hooks:
 * - useEnrichment: URL, context, and founder enrichment
 * - useInterview: Questions and answer processing
 * - useScoring: Readiness, investor score, and summary
 * 
 * @see src/hooks/onboarding/index.ts for the modular structure
 */

export { useOnboardingAgent as default } from './onboarding';
export { useOnboardingAgent } from './onboarding';
export * from './onboarding/types';
