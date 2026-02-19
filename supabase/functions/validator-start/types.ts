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
  // 022-SKI: New fields from extractor hardening
  assumptions?: string[];
  search_queries?: string[] | Array<{ purpose: string; query: string }>;
  // 031-PCE: Structured problem extraction for sharper report Section 1
  problem_structured?: {
    who: string;
    pain: string;
    todays_fix: string;
    evidence_tier?: 'A' | 'B' | 'C' | 'D';
  };
  // 032-CUC: Structured customer use case for sharper report Section 2
  customer_structured?: {
    persona_name: string;
    role_context: string;
    workflow_without: string;
    workflow_with: string;
    quantified_impact: string;
  };
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
  scores_matrix?: {
    dimensions: Array<{ name: string; score: number; weight: number }>;
    overall_weighted: number;
  };
}

export interface MVPPlan {
  mvp_scope: string;
  phases: Array<{ phase: number; name: string; tasks: string[] }>;
  next_steps: string[];
}

// V2 structured fields (Composer outputs these for v2 reports)
export interface ProblemClarityV2 {
  who: string;
  pain: string;
  current_fix: string;
  severity: 'high' | 'medium' | 'low';
}

export interface CustomerUseCaseV2 {
  persona: { name: string; role: string; context: string };
  without: string;
  with: string;
  time_saved: string;
}

export interface RiskAssumptionV2 {
  assumption: string;
  if_wrong: string;
  severity: 'fatal' | 'risky' | 'watch';
  impact: 'high' | 'low';
  probability: 'high' | 'low';
  how_to_test: string;
}

export interface MVPScopeV2 {
  one_liner: string;
  build: string[];
  buy: string[];
  skip_for_now: string[];
  tests_assumption: string;
  success_metric: string;
  timeline_weeks: number;
}

export interface NextStepV2 {
  action: string;
  timeframe: 'week_1' | 'month_1' | 'quarter_1';
  effort: 'low' | 'medium' | 'high';
}

// P02: Expanded from 8 to 14 sections to match IdeaProof breadth
export interface ValidatorReport {
  // Original 8 sections (v2: 6 fields upgraded to structured objects)
  summary_verdict: string;
  problem_clarity: string | ProblemClarityV2;
  customer_use_case: string | CustomerUseCaseV2;
  market_sizing: { tam: number; sam: number; som: number; citations: string[] };
  competition: {
    competitors: Competitor[];
    citations: string[];
    swot?: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
    feature_comparison?: { features: string[]; competitors: Array<{ name: string; has_feature: boolean[] }> };
    positioning?: { x_axis: string; y_axis: string; positions: Array<{ name: string; x: number; y: number; is_founder: boolean }> };
  };
  risks_assumptions: string[] | RiskAssumptionV2[];
  mvp_scope: string | MVPScopeV2;
  next_steps: string[] | NextStepV2[];
  // P02: 6 new sections
  technology_stack: TechnologyAssessment;
  revenue_model: RevenueModelAssessment;
  team_hiring: TeamAssessment;
  key_questions: KeyQuestion[];
  resources_links: ResourceCategory[];
  scores_matrix: ScoresMatrix;
  financial_projections: FinancialProjections;
  // 021-CSP: New optional fields from parallel composer groups
  top_threat?: RiskAssumptionV2;
  verdict_oneliner?: string;
  success_condition?: string;
  biggest_risk?: string;
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

// 002-EFN: Interview context from chat-based discovery
export interface InterviewContext {
  version: number;
  extracted: Record<string, string>;
  coverage: Record<string, string>;
  discoveredEntities?: Array<{ type: string; value: string }>;
}

// 021-CSP: Composer section groups — merged into ValidatorReport
export interface ComposerGroupA {
  problem_clarity: ProblemClarityV2;
  customer_use_case: CustomerUseCaseV2;
  key_questions: KeyQuestion[];
}

export interface ComposerGroupB {
  market_sizing: { tam: number; sam: number; som: number; citations: string[] };
  competition: {
    competitors: Competitor[];
    citations: string[];
    swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
    feature_comparison: { features: string[]; competitors: Array<{ name: string; has_feature: boolean[] }> };
    positioning: { x_axis: string; y_axis: string; positions: Array<{ name: string; x: number; y: number; is_founder: boolean }> };
  };
  scores_matrix: ScoresMatrix;
  top_threat: RiskAssumptionV2;
  risks_assumptions: RiskAssumptionV2[];
}

export interface ComposerGroupC {
  mvp_scope: MVPScopeV2;
  next_steps: NextStepV2[];
  revenue_model: RevenueModelAssessment;
  financial_projections: FinancialProjections;
  team_hiring: TeamAssessment;
  technology_stack: TechnologyAssessment;
  resources_links: ResourceCategory[];
}

export interface ComposerGroupD {
  summary_verdict: string;
  verdict_oneliner: string;
  success_condition: string;
  biggest_risk: string;
}

// deno-lint-ignore no-explicit-any
export type SupabaseClient = any;
