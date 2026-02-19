/**
 * Coach Session Types
 * Shared types for the coaching system
 */

export type ValidationPhase = 
  | 'onboarding'
  | 'assessment'
  | 'constraint'
  | 'campaign_setup'
  | 'sprint_planning'
  | 'sprint_execution'
  | 'cycle_review';

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  phase?: ValidationPhase;
}

export interface ProgressInfo {
  phase: string;
  step: number;
  totalSteps: number;
  percentage: number;
}

export interface StateUpdate {
  assessmentScores?: Record<string, number>;
  highlightElement?: {
    type: string;
    id: string;
  };
  [key: string]: unknown;
}

export interface CoachResponse {
  message: string;
  phase: ValidationPhase;
  progress: ProgressInfo;
  suggestedActions: string[];
  stateUpdate?: StateUpdate;
  mode: 'coach';
}

export interface ValidationSession {
  id: string;
  startup_id: string;
  phase: ValidationPhase;
  state: Record<string, unknown>;
  is_active: boolean;
  started_at: string;
  last_interaction_at: string;
}

export const PHASE_LABELS: Record<ValidationPhase, string> = {
  onboarding: 'Onboarding',
  assessment: 'Assessment',
  constraint: 'Constraint',
  campaign_setup: 'Campaign',
  sprint_planning: 'Sprint Planning',
  sprint_execution: 'Sprint',
  cycle_review: 'Review',
};

export const PHASE_ORDER: ValidationPhase[] = [
  'onboarding',
  'assessment',
  'constraint',
  'campaign_setup',
  'sprint_planning',
  'sprint_execution',
  'cycle_review',
];
