/**
 * Validator Pipeline Types
 * All interfaces used across the validator agent pipeline.
 */

export interface StartupProfile {
  idea: string;
  problem: string;
  customer: string;
  solution: string;
  differentiation: string;
  alternatives: string;
  validation: string;
  industry: string;
  websites: string;
}

export interface MarketResearch {
  tam: number;
  sam: number;
  som: number;
  methodology: string;
  growth_rate: number;
  sources: Array<{ title: string; url: string }>;
}

export interface Competitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  threat_level: 'high' | 'medium' | 'low';
  source_url?: string;
}

export interface CompetitorAnalysis {
  direct_competitors: Competitor[];
  indirect_competitors: Competitor[];
  market_gaps: string[];
  sources: Array<{ title: string; url: string }>;
}

export interface RiskScore {
  name: string;
  score: number;
  description: string;
  status: 'strong' | 'moderate' | 'weak';
}

export interface ScoringResult {
  overall_score: number;
  verdict: 'go' | 'caution' | 'no_go';
  dimension_scores: Record<string, number>;
  market_factors: RiskScore[];
  execution_factors: RiskScore[];
  highlights: string[];
  red_flags: string[];
  risks_assumptions: string[];
}

export interface MVPPlan {
  mvp_scope: string;
  phases: Array<{ phase: number; name: string; tasks: string[] }>;
  next_steps: string[];
}

// P02: Expanded from 8 to 14 sections to match IdeaProof breadth
export interface ValidatorReport {
  // Original 8 sections
  summary_verdict: string;
  problem_clarity: string;
  customer_use_case: string;
  market_sizing: { tam: number; sam: number; som: number; citations: string[] };
  competition: { competitors: Competitor[]; citations: string[] };
  risks_assumptions: string[];
  mvp_scope: string;
  next_steps: string[];
  // P02: 6 new sections
  technology_stack: TechnologyAssessment;
  revenue_model: RevenueModelAssessment;
  team_hiring: TeamAssessment;
  key_questions: KeyQuestion[];
  resources_links: ResourceCategory[];
  scores_matrix: ScoresMatrix;
  financial_projections: FinancialProjections;
}

// P02: New section types
export interface TechnologyAssessment {
  stack_components: Array<{ name: string; choice: 'build' | 'buy' | 'open_source'; rationale: string }>;
  feasibility: 'high' | 'medium' | 'low';
  feasibility_rationale: string;
  technical_risks: Array<{ risk: string; likelihood: 'high' | 'medium' | 'low'; mitigation: string }>;
  mvp_timeline_weeks: number;
}

export interface RevenueModelAssessment {
  recommended_model: string;
  reasoning: string;
  alternatives: Array<{ model: string; pros: string[]; cons: string[] }>;
  unit_economics: { cac: number; ltv: number; ltv_cac_ratio: number; payback_months: number };
}

export interface TeamAssessment {
  current_gaps: string[];
  mvp_roles: Array<{ role: string; priority: number; rationale: string; monthly_cost: number }>;
  monthly_burn: number;
  advisory_needs: string[];
}

export interface KeyQuestion {
  question: string;
  why_it_matters: string;
  validation_method: string;
  risk_level: 'fatal' | 'important' | 'minor';
}

export interface ResourceCategory {
  category: string;
  links: Array<{ title: string; url: string; description: string }>;
}

export interface ScoresMatrix {
  dimensions: Array<{ name: string; score: number; weight: number }>;
  overall_weighted: number;
}

export interface FinancialProjections {
  scenarios: Array<{ name: string; y1_revenue: number; y3_revenue: number; y5_revenue: number; assumptions: string[] }>;
  monthly_y1?: Array<{ month: number; revenue: number; users: number }>;
  break_even: { months: number; revenue_required: number; assumptions: string };
  key_assumption: string;
}

export interface VerificationResult {
  verified: boolean;
  missing_sections: string[];
  failed_agents: string[];
  warnings: string[];
  section_mappings: Record<string, string>;
}

// deno-lint-ignore no-explicit-any
export type SupabaseClient = any;
