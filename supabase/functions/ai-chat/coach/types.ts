/**
 * Coach Mode Types
 * Type definitions for the validation coaching system
 */

export type ValidationPhase = 
  | 'onboarding'
  | 'assessment'
  | 'constraint'
  | 'campaign_setup'
  | 'sprint_planning'
  | 'sprint_execution'
  | 'cycle_review';

export type ConstraintType = 
  | 'acquisition'
  | 'monetization'
  | 'retention'
  | 'scalability';

export type CampaignType = 
  | 'mafia_offer'
  | 'demo_sell_build'
  | 'wizard_of_oz'
  | 'channel_validation'
  | 'pricing_validation';

export type PDCAStep = 'plan' | 'do' | 'check' | 'act';

export interface ValidationSession {
  id: string;
  startup_id: string;
  phase: ValidationPhase;
  state: ValidationState;
  is_active: boolean;
  started_at: string;
  last_interaction_at: string;
}

export interface ValidationState {
  // Assessment state
  completedDimensions?: string[];
  dimensionScores?: Record<string, number>;
  
  // Constraint state
  identifiedConstraint?: ConstraintType;
  constraintReasoning?: string;
  
  // Campaign state
  campaignType?: CampaignType;
  goal90Day?: string;
  
  // Sprint state
  currentSprint?: number;
  pdcaStep?: PDCAStep;
  sprintLearnings?: string[];
  
  // Review state
  cycleDecision?: 'persevere' | 'pivot' | 'pause';
}

export interface ValidationContext {
  startup: StartupData | null;
  canvas: CanvasData | null;
  traction: TractionData | null;
  session: ValidationSession | null;
  assessments: AssessmentData[];
  currentCampaign: CampaignData | null;
  currentSprint: SprintData | null;
  recentConversations: ConversationData[];
}

export interface StartupData {
  id: string;
  name: string;
  industry: string;
  stage: string;
  description: string;
  tagline?: string;
  target_market?: string;
  business_model?: string[];
  traction_data?: Record<string, unknown>;
  competitors?: string[];
  problem?: string;
  solution?: string;
}

export interface CanvasData {
  id: string;
  problem?: { items: string[] };
  solution?: { items: string[] };
  uniqueValueProp?: { items: string[] };
  customerSegments?: { items: string[] };
  channels?: { items: string[] };
  revenueStreams?: { items: string[] };
  costStructure?: { items: string[] };
  keyMetrics?: { items: string[] };
  unfairAdvantage?: { items: string[] };
}

export interface TractionData {
  id: string;
  mrr?: number;
  users?: number;
  growth_rate?: number;
  churn_rate?: number;
  cac?: number;
  ltv?: number;
}

export interface AssessmentData {
  id: string;
  dimension: string;
  score: number;
  evidence: string;
  assessed_at: string;
}

export interface CampaignData {
  id: string;
  type: CampaignType;
  goal: string;
  constraint: ConstraintType;
  status: string;
  started_at: string;
}

export interface SprintData {
  id: string;
  sprint_number: number;
  pdca_step: PDCAStep;
  hypothesis: string;
  success_criteria: string;
  learnings?: string;
}

export interface ConversationData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  phase: ValidationPhase;
  created_at: string;
}

export interface CoachResponse {
  message: string;
  phase: ValidationPhase;
  progress: ProgressInfo;
  suggestedActions: string[];
  stateUpdate?: Partial<ValidationState>;
}

export interface ProgressInfo {
  phase: string;
  step: number;
  totalSteps: number;
  percentage: number;
}

export const ASSESSMENT_DIMENSIONS = [
  'clarity',
  'desirability', 
  'viability',
  'feasibility',
  'defensibility',
  'timing',
  'mission'
] as const;

export const PHASE_STEPS: Record<ValidationPhase, number> = {
  onboarding: 3,
  assessment: 7,
  constraint: 2,
  campaign_setup: 3,
  sprint_planning: 4,
  sprint_execution: 4,
  cycle_review: 3,
};
