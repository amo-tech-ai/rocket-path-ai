/**
 * Validation Report Types
 * 14-section validation report with TAM/SAM/SOM and factor scores
 */

export type ValidationVerdict = 'go' | 'caution' | 'no_go';
export type ValidationReportType = 'quick' | 'deep' | 'investor';

export interface DimensionScore {
  name: string;
  score: number;
  weight: number;
  factors: string[];
}

export interface MarketSizing {
  tam: number;
  sam: number;
  som: number;
  methodology?: string;
  sources?: string[];
  growthRate?: number;
}

export interface ReportSection {
  number: number;
  title: string;
  content: string;
  score?: number;
  citations?: Citation[];
  data?: Record<string, unknown>;
}

export interface Citation {
  source: string;
  url?: string;
  year?: number;
}

export interface MarketFactor {
  name: string;
  score: number;
  description: string;
  status: 'strong' | 'moderate' | 'weak';
}

export interface ExecutionFactor {
  name: string;
  score: number;
  description: string;
  status: 'strong' | 'moderate' | 'weak';
}

export interface ValidationReport {
  id: string;
  startupId: string;
  userId: string;
  
  // Verdict
  verdict: ValidationVerdict;
  overallScore: number;
  
  // 7-dimension scores
  dimensionScores: DimensionScore[];
  
  // Market sizing
  marketSizing: MarketSizing;
  
  // Key findings
  highlights: string[];
  redFlags: string[];
  
  // Executive summary
  executiveSummary: string;
  
  // Factors breakdown
  marketFactors: MarketFactor[];
  executionFactors: ExecutionFactor[];
  
  // Benchmarks
  benchmarks: {
    industry: string;
    averageScore: number;
    topPerformers: number;
    percentile: number;
  };
  
  // 14 sections
  sections: ReportSection[];
  
  // Metadata
  reportType: ValidationReportType;
  generationTimeMs?: number;
  aiModel?: string;
  createdAt: string;
}

// Section titles for the 14-section report
export const SECTION_TITLES: Record<number, { title: string; description: string }> = {
  1: { title: 'Executive Summary', description: 'Verdict, score, 3-sentence summary' },
  2: { title: 'Problem Analysis', description: 'Clarity, urgency, frequency' },
  3: { title: 'Solution Assessment', description: 'Uniqueness, feasibility, 10x factor' },
  4: { title: 'Market Size', description: 'TAM, SAM, SOM with methodology' },
  5: { title: 'Competition', description: 'Direct, indirect, alternatives' },
  6: { title: 'Business Model', description: 'Revenue streams, unit economics' },
  7: { title: 'Go-to-Market', description: 'Channels, acquisition strategy' },
  8: { title: 'Team Assessment', description: 'Founder-market fit, gaps' },
  9: { title: 'Timing Analysis', description: 'Why now, market readiness' },
  10: { title: 'Risk Assessment', description: 'Top 5 risks, mitigation' },
  11: { title: 'Financial Projections', description: '3-year forecast assumptions' },
  12: { title: 'Validation Status', description: 'Customer evidence, traction' },
  13: { title: 'Recommendations', description: 'Next 3 actions' },
  14: { title: 'Appendix', description: 'Sources, methodology, benchmarks' },
};

// 7-dimension scoring configuration
export const DIMENSION_CONFIG = [
  { key: 'problemClarity', name: 'Problem Clarity', weight: 15, factors: ['Pain severity', 'Frequency', 'Urgency'] },
  { key: 'solutionStrength', name: 'Solution Strength', weight: 15, factors: ['Uniqueness', 'Feasibility', 'Defensibility'] },
  { key: 'marketSize', name: 'Market Size', weight: 15, factors: ['TAM', 'SAM', 'SOM', 'Growth rate'] },
  { key: 'competition', name: 'Competition', weight: 10, factors: ['Differentiation', 'Barriers'] },
  { key: 'businessModel', name: 'Business Model', weight: 15, factors: ['Unit economics', 'Scalability'] },
  { key: 'teamFit', name: 'Team Fit', weight: 15, factors: ['Domain expertise', 'Execution ability'] },
  { key: 'timing', name: 'Timing', weight: 15, factors: ['Market readiness', 'Trends'] },
];

// Verdict thresholds
export function getVerdict(score: number): ValidationVerdict {
  if (score >= 75) return 'go';
  if (score >= 50) return 'caution';
  return 'no_go';
}

export function getVerdictConfig(verdict: ValidationVerdict) {
  const configs = {
    go: {
      label: 'GO',
      message: 'Strong foundation, proceed with confidence',
      color: 'emerald',
      bgClass: 'bg-emerald-500/10',
      textClass: 'text-emerald-500',
      borderClass: 'border-emerald-500/30',
    },
    caution: {
      label: 'CAUTION',
      message: 'Address red flags before scaling',
      color: 'amber',
      bgClass: 'bg-amber-500/10',
      textClass: 'text-amber-500',
      borderClass: 'border-amber-500/30',
    },
    no_go: {
      label: 'NO-GO',
      message: 'Significant pivot or validation needed',
      color: 'rose',
      bgClass: 'bg-rose-500/10',
      textClass: 'text-rose-500',
      borderClass: 'border-rose-500/30',
    },
  };
  return configs[verdict];
}

// Format large numbers
export function formatMarketSize(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

// V2 structured report fields (Composer outputs these for v2 reports)
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

// P02: New report section types (matching backend validator-start/types.ts)
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

export interface ScoresMatrixData {
  dimensions: Array<{ name: string; score: number; weight: number }>;
  overall_weighted: number;
}

// P02 Task 32: Competition deep dive types
export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface FeatureComparison {
  features: string[];
  competitors: Array<{
    name: string;
    has_feature: boolean[];
  }>;
}

export interface CompetitorPosition {
  name: string;
  x: number; // 0-100
  y: number; // 0-100
  is_founder: boolean;
}

export interface PositioningMatrix {
  x_axis: string;
  y_axis: string;
  positions: CompetitorPosition[];
}

// P02 Tasks 33+35: Financial projections types
export interface RevenueScenario {
  name: string; // "Conservative", "Base", "Optimistic"
  y1_revenue: number;
  y3_revenue: number;
  y5_revenue: number;
  assumptions: string[];
}

export interface MonthlyRevenue {
  month: number;
  revenue: number;
  users: number;
}

export interface FinancialProjections {
  scenarios: RevenueScenario[];
  monthly_y1?: MonthlyRevenue[];
  break_even: {
    months: number;
    revenue_required: number;
    assumptions: string;
  };
  key_assumption: string;
}

// ============================================================================
// V3: Dimension Detail Page Types — SYNC: supabase/functions/validator-start/types.ts
// ============================================================================

export interface SubScore {
  name: string;
  score: number;
  label: string;
}

export interface DimensionDetail {
  composite_score: number;
  sub_scores: SubScore[];
  executive_summary: string;
  risk_signals: string[];
  priority_actions: string[];
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

/** Named type for report.details JSONB — replaces inline `any` */
export interface ReportDetailsV2 {
  highlights?: string[];
  red_flags?: string[];
  summary_verdict: string;
  verdict_oneliner?: string;
  success_condition?: string;
  biggest_risk?: string;
  problem_clarity: string | ProblemClarityV2;
  customer_use_case: string | CustomerUseCaseV2;
  key_questions?: KeyQuestion[];
  market_sizing: { tam: number; sam: number; som: number; citations: string[] };
  competition: {
    competitors: Array<{ name: string; description: string; threat_level: string; strengths?: string[]; weaknesses?: string[] }>;
    citations: string[];
    direct_competitors?: Array<{ name: string; description: string; threat_level: string; strengths?: string[]; weaknesses?: string[] }>;
    market_gaps?: string[];
    swot?: SWOT;
    feature_comparison?: FeatureComparison;
    positioning?: PositioningMatrix;
  };
  scores_matrix?: ScoresMatrixData;
  top_threat?: RiskAssumptionV2;
  risks_assumptions: string[] | RiskAssumptionV2[];
  mvp_scope: string | MVPScopeV2;
  next_steps: string[] | NextStepV2[];
  dimension_scores?: Record<string, number>;
  market_factors?: Array<{ name: string; score: number; description: string; status: string }>;
  execution_factors?: Array<{ name: string; score: number; description: string; status: string }>;
  technology_stack?: TechnologyAssessment;
  revenue_model?: RevenueModelAssessment;
  team_hiring?: TeamAssessment;
  resources_links?: ResourceCategory[];
  financial_projections?: FinancialProjections;
}

/** V3 extends V2 with dimension detail pages + new assessments */
export interface V3ReportDetails extends ReportDetailsV2 {
  problem_detail?: DimensionDetail;
  customer_detail?: DimensionDetail;
  market_detail?: DimensionDetail;
  competition_detail?: DimensionDetail;
  revenue_detail?: DimensionDetail;
  execution_detail?: DimensionDetail;
  risk_detail?: DimensionDetail;
  ai_strategy?: AIStrategyAssessment;
  validation_proof?: ValidationProofAssessment;
}

/** Detect V3: has at least one dimension detail populated */
export function isV3Report(details: ReportDetailsV2): details is V3ReportDetails {
  const d = details as V3ReportDetails;
  return !!(d.problem_detail || d.customer_detail || d.ai_strategy);
}
