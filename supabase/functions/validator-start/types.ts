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
  // CORE-06: Idea quality filters (Paul Graham, Why Now, Tarpit)
  idea_quality?: {
    well_or_crater: string;
    schlep_factor: string;
    organic_or_manufactured: string;
    why_now: { trigger: string; category: string; confidence: string };
    tarpit_flag: boolean;
    tarpit_reasoning: string;
  };
}

export interface MarketResearch {
  tam: number;
  sam: number;
  som: number;
  methodology: string;
  growth_rate: number;
  sources: Array<{ title: string; url: string }>;
  // CORE-06: Value theory + cross-validation + trend analysis
  value_theory_tam?: number;
  sizing_cross_validation?: {
    bottom_up: number;
    top_down: number;
    value_theory: number;
    max_discrepancy_factor: number;
    primary_estimate: string;
  };
  source_freshness?: Array<{ source: string; year: number; stale_flag: boolean }>;
  trend_analysis?: {
    trajectory: string;
    adoption_curve_position: string;
    market_maturity: string;
  };
  primary_market_label?: string;
  alternate_market_labels?: string[];
  bottom_up_table?: Array<{
    buyer_segment: string;
    buyer_count: number;
    price_per_year: number;
    frequency: string;
    resulting_sam: number;
  }>;
  corrections_applied?: string[];
  confidence?: number;
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
  // CORE-06: Positioning, battlecard, white space
  positioning?: {
    competitive_alternatives: string[];
    unique_attributes: string[];
    value_proposition: string;
    target_segment: string;
    market_category: string;
    positioning_statement: string;
  };
  battlecard?: {
    competitor_name: string;
    win_themes: string[];
    lose_themes: string[];
    counter_arguments: string[];
    moat_durability: string;
  };
  white_space?: string;
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
  // CORE-06: Risk queue, bias detection, evidence grading
  risk_queue?: Array<{
    domain: string;
    category: string;
    assumption: string;
    impact: number;
    probability: number;
    composite_score: number;
    severity: string;
    suggested_experiment: string;
  }>;
  bias_flags?: Array<{
    bias_type: string;
    evidence_phrase: string;
    counter_question: string;
  }>;
  evidence_grades?: Array<{
    claim: string;
    grade: string;
    source: string;
    signal_level: number;
  }>;
  highest_signal_level?: number;
}

export interface MVPPlan {
  mvp_scope: string;
  phases: Array<{ phase: number; name: string; tasks: string[] }>;
  next_steps: string[];
  // CORE-06: Experiment cards, founder stage, recommended methods
  experiment_cards?: Array<{
    risk_domain: string;
    assumption: string;
    hypothesis: string;
    method: string;
    duration: string;
    smart_goal: string;
    pass_threshold: string;
    fail_threshold: string;
    estimated_cost: string;
  }>;
  founder_stage?: string;
  recommended_methods?: string[];
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

// V3: Dimension detail page types — SYNC: src/types/validation-report.ts
export interface SubScore {
  name: string;      // machine key, e.g. "pain_intensity"
  score: number;     // 0-100
  label: string;     // human-readable, e.g. "Pain Intensity"
}

export interface DimensionDetail {
  composite_score: number;        // 0-100, mirrors dimension score
  sub_scores: SubScore[];         // 3-5 sub-scores
  executive_summary: string;      // 2-3 sentences
  risk_signals: string[];         // 2-3 what could go wrong
  priority_actions: string[];     // 2-3 what to fix next
}

export interface AIStrategyAssessment {
  detail: DimensionDetail;
  automation_level: 'assist' | 'copilot' | 'agent';
  ai_capability_stack: Array<{
    layer: string;
    description: string;
    maturity: 'nascent' | 'developing' | 'mature';
  }>;
  data_strategy: 'owned' | 'borrowed' | 'hybrid';
  governance_readiness: 'not_ready' | 'basic' | 'compliant';
}

export interface ValidationProofAssessment {
  detail: DimensionDetail;
  evidence_items: Array<{
    type: 'interview' | 'signup' | 'conversion' | 'payment' | 'experiment';
    count: number;
    description: string;
  }>;
  evidence_confidence: 'high' | 'medium' | 'low' | 'none';
  assumption_map: Array<{
    assumption: string;
    tested: boolean;
    result?: string;
  }>;
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
  // V3: Per-dimension consulting-page detail (all optional for backward compat)
  problem_detail?: DimensionDetail;
  customer_detail?: DimensionDetail;
  market_detail?: DimensionDetail;
  competition_detail?: DimensionDetail;
  revenue_detail?: DimensionDetail;
  execution_detail?: DimensionDetail;
  risk_detail?: DimensionDetail;
  ai_strategy?: AIStrategyAssessment;
  validation_proof?: ValidationProofAssessment;
  // V3: Keyed dimension data for V3 report pages (populated by Composer Group E)
  // Keys are dimension IDs: problem, customer, market, competition, revenue, ai-strategy, execution, traction, risk
  // deno-lint-ignore no-explicit-any
  dimensions?: Record<string, any>;
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
  section_health?: Record<string, { status: 'ok' | 'weak' | 'missing'; reasons: string[] }>;
  detailed_warnings?: Array<{
    severity: 'info' | 'warn' | 'error';
    code: string;
    message: string;
    fix_hint: string;
    owner_agent: string;
    section: string;
  }>;
}

// 002-EFN: Interview context from chat-based discovery
export interface InterviewContext {
  version: number;
  extracted: Record<string, string>;
  coverage: Record<string, string>;
  // F-03 fix: Type matches extractor's access pattern (competitors/urls/marketData)
  discoveredEntities?: { competitors?: string[]; urls?: string[]; marketData?: string[] };
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

// V3: Composer Group E — dimension details + new assessments (MVP-02 will implement)
export interface ComposerGroupE {
  problem_detail: DimensionDetail;
  customer_detail: DimensionDetail;
  market_detail: DimensionDetail;
  competition_detail: DimensionDetail;
  revenue_detail: DimensionDetail;
  execution_detail: DimensionDetail;
  risk_detail: DimensionDetail;
  ai_strategy: AIStrategyAssessment;
  validation_proof: ValidationProofAssessment;
}

// deno-lint-ignore no-explicit-any
export type SupabaseClient = any;
