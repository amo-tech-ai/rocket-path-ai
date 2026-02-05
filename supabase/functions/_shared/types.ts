/**
 * Shared TypeScript Types
 * Common types used across Edge Functions
 */

// =============================================================================
// Database Entity Types
// =============================================================================

export interface Startup {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  tagline: string | null;
  industry: string | null;
  stage: StartupStage;
  business_model: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  target_market: string | null;
  target_customers: string[] | null;
  unique_value: string | null;
  key_features: string[] | null;
  competitors: unknown[] | null;
  founders: unknown[] | null;
  traction_data: TractionData | null;
  is_raising: boolean;
  raise_amount: number | null;
  profile_strength: number | null;
  created_at: string;
  updated_at: string;
}

export interface TractionData {
  arr?: number;
  mrr?: number;
  nrr?: number;
  users?: number;
  customers?: number;
  churn_rate?: number;
  milestones?: string[];
  growth_rate_monthly?: number;
}

export type StartupStage =
  | 'idea'
  | 'pre_seed'
  | 'seed'
  | 'series_a'
  | 'series_b'
  | 'series_c'
  | 'growth'
  | 'public';

// =============================================================================
// Assumption Types (New)
// =============================================================================

export interface Assumption {
  id: string;
  startup_id: string;
  lean_canvas_id: string | null;
  source_block: AssumptionSource;
  statement: string;
  impact_score: number;
  uncertainty_score: number;
  priority_score: number;
  status: AssumptionStatus;
  validation_criteria: string | null;
  evidence: string | null;
  linked_experiment_ids: string[];
  tags: string[];
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export type AssumptionStatus =
  | 'untested'
  | 'testing'
  | 'validated'
  | 'invalidated'
  | 'pivoted';

export type AssumptionSource =
  | 'problem'
  | 'solution'
  | 'uvp'
  | 'customer_segments'
  | 'channels'
  | 'revenue_streams'
  | 'cost_structure'
  | 'key_metrics'
  | 'unfair_advantage'
  | 'other';

// =============================================================================
// Experiment Types (New)
// =============================================================================

export interface Experiment {
  id: string;
  startup_id: string;
  assumption_id: string | null;
  experiment_type: ExperimentType;
  hypothesis: string;
  metric: string;
  target_value: number;
  current_value: number | null;
  status: ExperimentStatus;
  start_date: string | null;
  end_date: string | null;
  sample_size: number;
  conclusion: string | null;
  learnings: string | null;
  pivot_decision: string | null;
  tags: string[];
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export type ExperimentType =
  | 'smoke_test'
  | 'landing_page'
  | 'survey'
  | 'interview'
  | 'prototype'
  | 'mvp'
  | 'ab_test'
  | 'concierge'
  | 'wizard_of_oz'
  | 'other';

export type ExperimentStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'paused'
  | 'cancelled';

// =============================================================================
// Customer Segment Types (New)
// =============================================================================

export interface CustomerSegment {
  id: string;
  startup_id: string;
  name: string;
  description: string | null;
  is_primary: boolean;
  demographics: Demographics | null;
  psychographics: Psychographics | null;
  firmographics: Firmographics | null;
  pain_points: string[];
  jobs_to_be_done: string[];
  current_solutions: string[];
  interview_count: number;
  validated: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface Demographics {
  age_range?: string;
  gender?: string;
  location?: string;
  income_range?: string;
  education?: string;
  occupation?: string;
}

export interface Psychographics {
  values?: string[];
  interests?: string[];
  lifestyle?: string;
  personality?: string;
  attitudes?: string[];
}

export interface Firmographics {
  company_size?: string;
  industry?: string;
  revenue_range?: string;
  tech_stack?: string[];
  decision_makers?: string[];
}

// =============================================================================
// Interview Types (New)
// =============================================================================

export interface Interview {
  id: string;
  startup_id: string;
  segment_id: string | null;
  experiment_id: string | null;
  interview_type: InterviewType;
  status: InterviewStatus;
  interviewee_name: string | null;
  interviewee_role: string | null;
  interviewee_company: string | null;
  scheduled_at: string | null;
  conducted_at: string | null;
  duration_minutes: number | null;
  transcript: string | null;
  summary: string | null;
  ai_analyzed: boolean;
  ai_summary: string | null;
  ai_key_quotes: unknown[] | null;
  created_at: string;
  updated_at: string;
}

export type InterviewType =
  | 'problem_discovery'
  | 'solution_validation'
  | 'usability_test'
  | 'customer_development'
  | 'sales_call'
  | 'support_call'
  | 'other';

export type InterviewStatus =
  | 'scheduled'
  | 'completed'
  | 'transcribed'
  | 'analyzed'
  | 'cancelled'
  | 'no_show';

// =============================================================================
// Interview Insight Types (New)
// =============================================================================

export interface InterviewInsight {
  id: string;
  interview_id: string;
  insight_type: InsightType;
  insight: string;
  source_quote: string | null;
  confidence: number;
  importance: number;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed' | null;
  linked_assumption_ids: string[];
  supports_assumptions: boolean | null;
  tags: string[];
  is_validated: boolean;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
}

export type InsightType =
  | 'pain_point'
  | 'desired_outcome'
  | 'current_behavior'
  | 'switching_trigger'
  | 'objection'
  | 'feature_request'
  | 'competitor_mention'
  | 'pricing_feedback'
  | 'aha_moment'
  | 'job_to_be_done'
  | 'quote'
  | 'other';

// =============================================================================
// Jobs to be Done Types (New)
// =============================================================================

export interface JobToBeDone {
  id: string;
  segment_id: string;
  job_type: 'functional' | 'emotional' | 'social';
  situation: string;
  motivation: string;
  expected_outcome: string;
  job_statement: string;
  importance: number;
  current_satisfaction: number;
  opportunity_score: number;
  frequency: string | null;
  is_validated: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Customer Forces Types (New)
// =============================================================================

export interface CustomerForce {
  id: string;
  segment_id: string;
  force_type: 'push' | 'pull' | 'inertia' | 'friction';
  description: string;
  intensity: number;
  evidence: string | null;
  source_interview_id: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Task Types
// =============================================================================

export interface Task {
  id: string;
  startup_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  due_at: string | null;
  assigned_to: string | null;
  ai_generated: boolean;
  ai_source: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'blocked';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory =
  | 'fundraising'
  | 'product'
  | 'marketing'
  | 'operations'
  | 'sales'
  | 'hiring'
  | 'legal'
  | 'other';

// =============================================================================
// Lean Canvas Types
// =============================================================================

export interface LeanCanvas {
  id: string;
  startup_id: string;
  version: number;
  is_current: boolean;
  problem: string[] | null;
  solution: string[] | null;
  key_metrics: string[] | null;
  unique_value_proposition: string | null;
  unfair_advantage: string | null;
  channels: string[] | null;
  customer_segments: string[] | null;
  cost_structure: string[] | null;
  revenue_streams: string[] | null;
  completeness_score: number | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// AI Run Types
// =============================================================================

export interface AIRun {
  id: string;
  user_id: string;
  org_id: string | null;
  startup_id: string | null;
  agent_name: string;
  action: string;
  model: string;
  provider: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  duration_ms: number | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

// =============================================================================
// API Request/Response Types
// =============================================================================

export interface ActionRequest {
  action: string;
  startup_id?: string;
  session_id?: string;
  data?: Record<string, unknown>;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
