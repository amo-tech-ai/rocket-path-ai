/**
 * Onboarding Constants
 * Centralized storage keys and constants for onboarding flow
 */

export const STORAGE_KEYS = {
  /** WelcomeBanner dismissed state */
  WELCOME_DISMISSED: 'startupai_welcome_dismissed',
  /** Guided dashboard mode state: 'pending' | 'completed' */
  FIRST_DASHBOARD: 'startupai_first_dashboard',
  /** First task completion state */
  FIRST_TASK_COMPLETED: 'startupai_first_task_completed',
} as const;

export const GUIDED_MODE_STATES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

/** Modules unlocked after onboarding */
export const UNLOCKED_MODULES = [
  'Tasks',
  'Lean Canvas',
  'Pitch Deck',
  'CRM',
  'Investors',
] as const;

/** Auto-redirect countdown duration in seconds */
export const COMPLETION_BRIDGE_COUNTDOWN = 10;
