/**
 * Deterministic Scoring Math Layer
 * LLM provides qualitative scores. This function computes everything else deterministically.
 * Same input always produces the same output — no LLM subjectivity in final numbers.
 *
 * Canonical weights from DIMENSION_CONFIG (src/types/validation-report.ts).
 * Frontend copy: src/lib/scoring-math.ts (identical logic).
 */

// Single source of truth: dimension weights
const DIMENSION_WEIGHTS: Record<string, number> = {
  problemClarity: 15,
  solutionStrength: 15,
  marketSize: 15,
  competition: 10,
  businessModel: 15,
  teamFit: 15,
  timing: 15,
};

const DIMENSION_NAMES: Record<string, string> = {
  problemClarity: 'Problem Clarity',
  solutionStrength: 'Solution Strength',
  marketSize: 'Market Size',
  competition: 'Competition',
  businessModel: 'Business Model',
  teamFit: 'Team Fit',
  timing: 'Timing',
};

// --- Input types (what the LLM produces) ---

export interface DimensionScoresInput {
  problemClarity: number;
  solutionStrength: number;
  marketSize: number;
  competition: number;
  businessModel: number;
  teamFit: number;
  timing: number;
}

export interface FactorInput {
  name: string;
  score: number;        // 1-10 from LLM
  description: string;
}

// --- Output types (deterministic results) ---

export interface FactorOutput {
  name: string;
  score: number;
  description: string;
  status: 'strong' | 'moderate' | 'weak';
}

export interface ScoresMatrixOutput {
  dimensions: Array<{ name: string; score: number; weight: number }>;
  overall_weighted: number;
}

export interface ScoringMathResult {
  overall_score: number;
  verdict: 'go' | 'caution' | 'no_go';
  market_factors: FactorOutput[];
  execution_factors: FactorOutput[];
  scores_matrix: ScoresMatrixOutput;
  metadata: {
    raw_weighted_average: number;
    bias_correction: number;
    clamped_dimensions: Record<string, number>;
  };
}

/** Clamp a number to [min, max]. NaN → min. */
function clamp(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/** Derive factor status from score (1-10 scale) */
function deriveFactorStatus(score: number): 'strong' | 'moderate' | 'weak' {
  if (score >= 7) return 'strong';
  if (score >= 4) return 'moderate';
  return 'weak';
}

/** Derive verdict from overall score */
function deriveVerdict(score: number): 'go' | 'caution' | 'no_go' {
  if (score >= 75) return 'go';
  if (score >= 50) return 'caution';
  return 'no_go';
}

/**
 * Compute deterministic scoring results from LLM-provided raw scores.
 *
 * Steps:
 * 1. Clamp dimension scores to [0, 100]
 * 2. Compute weighted average: sum(score * weight/100)
 * 3. Apply bias correction (0 initially, calibrate after 20+ runs)
 * 4. Clamp to [0, 100], round to integer
 * 5. Derive verdict from thresholds (75+ GO, 50+ CAUTION, <50 NO-GO)
 * 6. Derive factor statuses from scores (7+=strong, 4-6=moderate, <4=weak)
 * 7. Build scores_matrix for frontend
 */
export function computeScore(
  rawDimensions: DimensionScoresInput,
  rawMarketFactors: FactorInput[],
  rawExecutionFactors: FactorInput[],
  biasCorrection = 0,
): ScoringMathResult {
  // 1. Clamp dimension scores to [0, 100]
  const clamped: Record<string, number> = {};
  for (const key of Object.keys(DIMENSION_WEIGHTS)) {
    const raw = (rawDimensions as Record<string, number>)[key];
    clamped[key] = clamp(raw, 0, 100);
  }

  // 2. Compute weighted average
  let rawWeightedAverage = 0;
  for (const [key, weight] of Object.entries(DIMENSION_WEIGHTS)) {
    rawWeightedAverage += clamped[key] * (weight / 100);
  }

  // 3. Apply bias correction
  const corrected = rawWeightedAverage + biasCorrection;

  // 4. Clamp to [0, 100], round to integer
  const overallScore = Math.round(clamp(corrected, 0, 100));

  // 5. Derive verdict from thresholds
  const verdict = deriveVerdict(overallScore);

  // 6. Derive factor statuses
  const marketFactors: FactorOutput[] = (rawMarketFactors || []).map((f) => ({
    name: f.name,
    score: clamp(f.score, 1, 10),
    description: f.description || '',
    status: deriveFactorStatus(clamp(f.score, 1, 10)),
  }));

  const executionFactors: FactorOutput[] = (rawExecutionFactors || []).map((f) => ({
    name: f.name,
    score: clamp(f.score, 1, 10),
    description: f.description || '',
    status: deriveFactorStatus(clamp(f.score, 1, 10)),
  }));

  // 7. Build scores_matrix for frontend
  const dimensions = Object.entries(DIMENSION_WEIGHTS).map(([key, weight]) => ({
    name: DIMENSION_NAMES[key] || key,
    score: clamped[key],
    weight,
  }));

  return {
    overall_score: overallScore,
    verdict,
    market_factors: marketFactors,
    execution_factors: executionFactors,
    scores_matrix: {
      dimensions,
      overall_weighted: overallScore,
    },
    metadata: {
      raw_weighted_average: Math.round(rawWeightedAverage * 100) / 100,
      bias_correction: biasCorrection,
      clamped_dimensions: clamped,
    },
  };
}
