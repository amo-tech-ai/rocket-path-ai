/**
 * Validation State Machine Types
 * For the Startup Coach validation system
 */

// =============================================================================
// Enums and Literal Types
// =============================================================================

export type ValidationPhase =
  | 'onboarding'
  | 'assessment'
  | 'constraint'
  | 'campaign_setup'
  | 'sprint_planning'
  | 'sprint_execution'
  | 'cycle_review';

export type Dimension =
  | 'clarity'
  | 'desirability'
  | 'viability'
  | 'feasibility'
  | 'defensibility'
  | 'timing'
  | 'mission';

export type Constraint =
  | 'acquisition'
  | 'monetization'
  | 'retention'
  | 'scalability';

export type PDCAStep = 'plan' | 'do' | 'check' | 'act';

export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'abandoned';

export type ConversationRole = 'user' | 'assistant' | 'system';

// =============================================================================
// State Machine
// =============================================================================

export interface ValidationState {
  phase: ValidationPhase;
  assessmentScores?: Record<Dimension, number>;
  assessmentProgress?: number;
  constraint?: Constraint;
  campaignType?: string;
  goal90Day?: string;
  currentSprint?: number;
  pdcaStep?: PDCAStep;
  sprintResults?: SprintResult[];
  cycleDecisions?: CycleDecision[];
}

export interface SprintResult {
  sprintNumber: number;
  outcome: string;
  learnings: string[];
  decision: 'continue' | 'adjust' | 'pivot';
}

export interface CycleDecision {
  cycleNumber: number;
  decision: 'persevere' | 'pivot' | 'pause';
  reason: string;
  date: string;
}

// State transitions map
export const STATE_TRANSITIONS: Record<ValidationPhase, ValidationPhase[]> = {
  onboarding: ['assessment'],
  assessment: ['constraint'],
  constraint: ['campaign_setup'],
  campaign_setup: ['sprint_planning'],
  sprint_planning: ['sprint_execution'],
  sprint_execution: ['sprint_planning', 'cycle_review'],
  cycle_review: ['assessment', 'campaign_setup']
};

// =============================================================================
// Database Record Types
// =============================================================================

export interface ValidationSession {
  id: string;
  startup_id: string;
  state: ValidationState;
  is_active: boolean;
  started_at: string;
  last_interaction_at: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationAssessment {
  id: string;
  session_id: string;
  dimension: Dimension;
  score: number;
  feedback?: string;
  assessed_at: string;
}

export interface ValidationCampaign {
  id: string;
  session_id: string;
  constraint_type: Constraint;
  campaign_type: string;
  goal: string;
  target_metric?: string;
  target_value?: number;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface ValidationSprint {
  id: string;
  campaign_id: string;
  sprint_number: number;
  purpose?: string;
  pdca_step: PDCAStep;
  outcomes?: SprintOutcome;
  learnings?: string[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SprintOutcome {
  hypothesis_tested: string;
  result: 'validated' | 'invalidated' | 'inconclusive';
  key_metrics: Record<string, number>;
  next_action: string;
}

export interface ValidationExperiment {
  id: string;
  sprint_id: string;
  hypothesis: string;
  method?: string;
  success_criteria?: string;
  result?: string;
  learning?: string;
  evidence?: ExperimentEvidence[];
  status: ExperimentStatus;
  target_metric?: string;
  baseline_value?: number;
  actual_value?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ExperimentEvidence {
  type: 'quote' | 'data' | 'screenshot' | 'document';
  content: string;
  source?: string;
  timestamp?: string;
}

export interface ValidationConversation {
  id: string;
  session_id: string;
  role: ConversationRole;
  content: string;
  phase?: ValidationPhase;
  tool_calls?: ToolCall[];
  citations?: Citation[];
  tokens_used?: number;
  model_used?: string;
  created_at: string;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface Citation {
  source: string;
  content: string;
  confidence: 'high' | 'medium' | 'low';
  year?: number;
}

// =============================================================================
// Helper Functions
// =============================================================================

export function canTransition(from: ValidationPhase, to: ValidationPhase): boolean {
  return STATE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getNextPhases(current: ValidationPhase): ValidationPhase[] {
  return STATE_TRANSITIONS[current] ?? [];
}

export function calculateAssessmentProgress(scores: Record<Dimension, number>): number {
  const dimensions: Dimension[] = [
    'clarity', 'desirability', 'viability', 'feasibility',
    'defensibility', 'timing', 'mission'
  ];
  const completed = dimensions.filter(d => scores[d] !== undefined).length;
  return Math.round((completed / dimensions.length) * 100);
}

export function getDefaultState(): ValidationState {
  return {
    phase: 'onboarding',
    assessmentProgress: 0,
    assessmentScores: {} as Record<Dimension, number>
  };
}
