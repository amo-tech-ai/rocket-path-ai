/**
 * Validation Actions
 * Validate canvas hypotheses with risk levels and experiments
 */

import type { BoxKey, ValidationResult, ValidationResponse } from "../types.ts";
import { CANVAS_BOX_CONFIG } from "../types.ts";
import { callGemini, extractJSON } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

/**
 * Validate all canvas boxes with risk assessment and experiments
 */
export async function validateCanvas(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  canvasData: Record<string, unknown>
): Promise<ValidationResponse> {
  console.log(`[validateCanvas] Validating canvas for startup ${startupId}`);

  // Fetch startup profile for context
  const { data: startup } = await supabase
    .from("startups")
    .select("name, industry, stage")
    .eq("id", startupId)
    .single();

  // Fetch industry pack for benchmarks
  const { data: industryPack } = await supabase
    .from("industry_packs")
    .select("benchmarks, terminology")
    .eq("industry_key", startup?.industry?.toLowerCase())
    .eq("is_active", true)
    .single();

  const systemPrompt = `You are a startup advisor validating a Lean Canvas. Analyze each box for:
1. Clarity and specificity
2. Alignment with industry best practices
3. Testability of hypotheses
4. Risk level and suggested experiments

${industryPack ? `Industry benchmarks: ${JSON.stringify(industryPack.benchmarks)}` : ''}

Be critical but constructive. Focus on actionable improvements.`;

  const userPrompt = `Startup: ${startup?.name || 'Unknown'} (${startup?.industry || 'Unknown'}, ${startup?.stage || 'Unknown'} stage)

LEAN CANVAS TO VALIDATE:
${JSON.stringify(canvasData, null, 2)}

For each of the 9 boxes, provide validation. Return JSON:
{
  "results": [
    {
      "box": "problem",
      "score": 7,
      "feedback": "Clear problem statement but could be more specific about pain intensity",
      "risk_level": "moderate",
      "risk_reason": "Hasn't validated with target customers yet",
      "experiment": "Interview 5 target customers this week to validate problem severity"
    },
    // ... all 9 boxes
  ]
}

Scoring:
- 1-3: Critical issues, hypothesis likely wrong
- 4-6: Moderate issues, needs validation
- 7-8: Good, minor improvements possible
- 9-10: Strong, well-validated

Risk levels:
- "critical": High-risk assumption that could sink the business
- "moderate": Needs testing but not fatal if wrong
- "low": Low-risk or already validated`;

  const response = await callGemini("google/gemini-3-pro-preview", systemPrompt, userPrompt);
  const parsed = extractJSON<{ results: ValidationResult[] }>(response);

  if (parsed && Array.isArray(parsed.results)) {
    // Sort by risk level and score
    const sortedResults = parsed.results.sort((a, b) => {
      const riskOrder = { critical: 0, moderate: 1, low: 2 };
      const riskDiff = (riskOrder[a.risk_level] || 2) - (riskOrder[b.risk_level] || 2);
      if (riskDiff !== 0) return riskDiff;
      return (a.score || 0) - (b.score || 0);
    });

    // Calculate overall score
    const overallScore = Math.round(
      (sortedResults.reduce((sum, r) => sum + (r.score || 5), 0) / sortedResults.length) * 10
    );

    // Get top risks
    const topRisks = sortedResults
      .filter(r => r.risk_level === 'critical' || (r.risk_level === 'moderate' && r.score <= 5))
      .slice(0, 3);

    return {
      overall_score: overallScore,
      results: sortedResults,
      top_risks: topRisks,
    };
  }

  // Fallback with mock results
  return {
    overall_score: 50,
    results: CANVAS_BOX_CONFIG.map(box => ({
      box: box.key,
      score: 5,
      feedback: 'Validation in progress...',
      risk_level: 'moderate' as const,
      risk_reason: 'Unable to complete validation',
      experiment: 'Try validating again',
    })),
    top_risks: [],
  };
}
