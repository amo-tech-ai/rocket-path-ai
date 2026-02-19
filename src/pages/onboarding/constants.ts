/**
 * Wizard Constants
 * Centralized configuration for the onboarding wizard
 */

export const WIZARD_STEPS = [
  { number: 1, title: 'Context & Enrichment', description: 'Add your links and info' },
  { number: 2, title: 'AI Analysis', description: 'Review AI findings' },
  { number: 3, title: 'Smart Interviewer', description: 'Answer questions' },
  { number: 4, title: 'Review & Score', description: 'Finalize your profile' },
] as const;

export const STEP_DESCRIPTIONS = {
  1: 'Add your links and Gemini 3 will build your profile.',
  2: 'Review what AI discovered about your startup.',
  3: 'Answer a few questions to refine your profile.',
  4: 'Review your complete profile and score.',
} as const;

export type WizardStep = typeof WIZARD_STEPS[number];
export type StepNumber = 1 | 2 | 3 | 4;
