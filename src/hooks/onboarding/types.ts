/**
 * Onboarding Agent Types
 * Shared type definitions for onboarding hooks and components
 */

// ============================================================================
// Core Data Types
// ============================================================================

export interface Founder {
  id: string;
  name: string;
  role: string;
  linkedin_url?: string;
  enriched?: boolean;
}

export interface TractionData {
  current_mrr?: number;
  mrr_range?: string;
  growth_rate?: number;
  growth_range?: string;
  users?: number;
  users_range?: string;
  customers?: number;
  [key: string]: unknown;
}

export interface FundingData {
  is_raising?: boolean | string;
  target_amount?: number | string;
  use_of_funds?: string[];
  [key: string]: unknown;
}

export interface ReadinessScore {
  overall_score: number;
  category_scores: {
    product: number;
    market: number;
    team: number;
    clarity: number;
  };
  benchmarks: string[];
  recommendations: string[];
}

export interface InvestorScore {
  total_score: number;
  breakdown: {
    team: number;
    traction: number;
    market: number;
    product: number;
    fundraising: number;
  };
  recommendations: { action: string; points_gain: number }[];
}

export interface AISummary {
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface InterviewAnswer {
  question_id: string;
  answer_id: string;
  answer_text?: string;
  answered_at: string;
}

// ============================================================================
// Wizard Form Data
// ============================================================================

export interface WizardFormData {
  // Step 1: Context & Enrichment
  name?: string;
  company_name?: string;
  website_url?: string;
  linkedin_url?: string;
  additional_urls?: string[];
  description?: string;
  target_market?: string;
  search_terms?: string;
  industry?: string | string[];
  subcategory?: string;
  business_model?: string[];
  stage?: string;
  year_founded?: number;
  cover_image_url?: string;
  tagline?: string;
  key_features?: string[];
  target_customers?: string[];
  competitors?: string[];
  founders?: Founder[];

  // Step 2: Analysis (read from session)
  readiness_score?: ReadinessScore | null;
  url_insights?: Record<string, unknown> | null;

  // Step 3: Interview
  interview_answers?: InterviewAnswer[];
  signals?: string[];
  extracted_traction?: TractionData;
  extracted_funding?: FundingData;
  current_question_index?: number;

  // Step 4: Review
  investor_score?: InvestorScore | null;
  ai_summary?: AISummary | null;
}

// ============================================================================
// Session Types
// ============================================================================

export interface WizardSession {
  id: string;
  user_id: string;
  startup_id: string | null;
  current_step: number;
  status: 'in_progress' | 'completed';
  form_data: WizardFormData;
  ai_extractions: Record<string, unknown> | null;
  extracted_traction: Record<string, unknown> | null;
  extracted_funding: Record<string, unknown> | null;
  profile_strength: number | null;
  interview_answers: InterviewAnswer[];
  interview_progress: number;
  started_at: string | null;
  completed_at: string | null;
}

// ============================================================================
// Agent Action Parameter Types
// ============================================================================

export interface EnrichUrlParams {
  session_id: string;
  url: string;
}

export interface EnrichContextParams {
  session_id: string;
  description: string;
  target_market?: string;
}

export interface EnrichFounderParams {
  session_id: string;
  linkedin_url: string;
  name?: string;
}

export interface GetQuestionsParams {
  session_id: string;
  answered_question_ids?: string[];
}

export interface ProcessAnswerParams {
  session_id: string;
  question_id: string;
  answer_id: string;
  answer_text?: string;
}

export interface SessionIdParams {
  session_id: string;
}

// ============================================================================
// Agent Response Types
// ============================================================================

export interface EnrichmentResult {
  success: boolean;
  extractions?: {
    company_name?: string;
    industry?: string;
    description?: string;
    features?: string[];
    target_audience?: string;
    competitors?: string[];
    pricing_model?: string;
    unique_value_proposition?: string;
  };
  error?: string;
}

export interface FounderEnrichmentResult {
  success: boolean;
  founder_data?: {
    name?: string;
    title?: string;
    bio?: string;
    experience?: string[];
  };
}

export interface ReadinessResult {
  success: boolean;
  readiness_score?: ReadinessScore;
}

export interface QuestionsResult {
  success: boolean;
  questions: Array<{
    id: string;
    text: string;
    type: 'multiple_choice' | 'multi_select' | 'text' | 'number';
    options?: Array<{ id: string; text: string; emoji?: string }>;
    topic: string;
    why_matters: string;
  }>;
  total_questions: number;
  answered: number;
  advisor: { name: string; title: string; intro: string } | null;
}

export interface ProcessAnswerResult {
  success: boolean;
  signals: string[];
  extracted_traction?: Record<string, unknown>;
  extracted_funding?: Record<string, unknown>;
}

export interface InvestorScoreResult {
  success: boolean;
  investor_score?: InvestorScore;
}

export interface SummaryResult {
  success: boolean;
  summary?: AISummary;
}

export interface CompleteWizardResult {
  success: boolean;
  startup_id?: string;
  tasks_created?: number;
  error?: string;
}
