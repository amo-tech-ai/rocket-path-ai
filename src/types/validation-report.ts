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
