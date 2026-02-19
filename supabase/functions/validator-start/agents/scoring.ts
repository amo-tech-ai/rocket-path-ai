/**
 * Agent 4: Scoring
 * Scores startup across key dimensions and produces verdict.
 */

import type { SupabaseClient, StartupProfile, MarketResearch, CompetitorAnalysis, ScoringResult } from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { AGENT_SCHEMAS } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";
import { computeScore, type DimensionScoresInput, type FactorInput } from "../scoring-math.ts";

export async function runScoring(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile,
  market: MarketResearch | null,
  competitors: CompetitorAnalysis | null,
  interviewContext?: string
): Promise<ScoringResult | null> {
  const agentName = 'ScoringAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  const systemPrompt = `You are a sharp startup evaluator. Score this startup honestly and explain your reasoning in plain language.

## Domain Knowledge — Scoring Calibration

### 7-Dimension Rubric Anchors
For each dimension (0-100), use these anchor points:
- 90-100: Exceptional — clear evidence, validated demand, strong moat (rare at early stage)
- 70-89: Strong — solid evidence with some gaps, clear advantage
- 40-69: Moderate — mixed signals, needs more validation, some concerns
- 0-39: Weak — major gaps, red flags, or insufficient evidence

### Dimension-Specific Guidance
- problemClarity: Is pain quantified ($X/mo lost, Y hrs/week)? Is "who" specific (job title + company size)?
- solutionStrength: Does it address root cause? Is mechanism clear (not just "AI-powered")?
- marketSize: Is TAM from credible source? Is SOM < 5% of SAM for early stage?
- competition: Are competitors named with funding/scale? Is differentiation specific?
- businessModel: Is pricing validated (WTP data)? LTV:CAC > 3:1?
- teamFit: Domain expertise? Technical ability to build MVP? Missing co-founder?
- timing: What changed (tech, regulation, behavior) that enables this NOW?

### Evidence Requirements
- Score 70+: requires specific data points (market size, competitor names, customer quotes)
- Score 50-69: requires logical reasoning with some evidence
- Score < 50: acceptable with stated assumptions but flag as uncertain

### Unit Economics Check (if data available)
- LTV:CAC 3:1+ = healthy | < 1:1 = red flag | > 10:1 = likely bad inputs
- CAC payback: PLG < 12mo | Sales-led < 18mo
- Gross margin: SaaS 75-85% | SaaS+AI 60-75% | Marketplace 60-70%

## Writing style:
- Each description should be 1-2 sentences explaining the score with specific evidence
- Use concrete numbers and real comparisons — not vague qualifiers
- BAD: "The market presents significant growth opportunities in emerging sectors"
- GOOD: "A $8.8B market growing at 41% annually — strong tailwinds for a new entrant"
- BAD: "Competition is a moderate concern requiring strategic positioning"
- GOOD: "3 well-funded competitors exist, but none serve independent labels under 50 employees"
- Highlights should be reasons an investor would get excited
- Red flags should be honest concerns a founder needs to address

IMPORTANT: Do NOT compute overall_score or verdict — those are calculated deterministically from your dimension scores. Do NOT include a "status" field on factors — that is also derived automatically.

Return JSON with exactly these fields:
{
  "dimension_scores": {
    "problemClarity": <0-100>,
    "solutionStrength": <0-100>,
    "marketSize": <0-100>,
    "competition": <0-100>,
    "businessModel": <0-100>,
    "teamFit": <0-100>,
    "timing": <0-100>
  },
  "market_factors": [
    {"name": "Market Size", "score": <1-10>, "description": "Explain what the market size means for this specific idea — cite the TAM/SAM numbers"},
    {"name": "Growth Rate", "score": <1-10>, "description": "State the growth rate and what's driving it"},
    {"name": "Competition", "score": <1-10>, "description": "How crowded is it? Name the biggest threats and explain the gap this idea fills"},
    {"name": "Timing", "score": <1-10>, "description": "Why now? What changed in the market that makes this possible today"}
  ],
  "execution_factors": [
    {"name": "Team", "score": <1-10>, "description": "What domain expertise exists? What's missing?"},
    {"name": "Product", "score": <1-10>, "description": "How well does the product solve the stated problem? What's the core insight?"},
    {"name": "Go-to-Market", "score": <1-10>, "description": "How will they reach customers? Is the distribution channel clear?"},
    {"name": "Unit Economics", "score": <1-10>, "description": "Do the numbers work? Estimate CAC, LTV, and margins based on the business model"}
  ],
  "highlights": ["Strength 1 — specific and evidence-based", "Strength 2", "Strength 3"],
  "red_flags": ["Risk 1 — explain what breaks if this goes wrong", "Risk 2"],
  "risks_assumptions": ["Assumes X — if wrong, Y happens", "Risk: X could cause Y because Z"]
}`;

  try {
    // P01: thinkingLevel: 'high' enables deeper multi-criteria reasoning
    // Note: thinking mode disables responseJsonSchema — we rely on extractJSON fallback
    // 022-SKI: Build compact context pack instead of raw JSON.stringify
    const contextPack = [
      `IDEA: ${profile.idea}`,
      `PROBLEM: ${profile.problem}`,
      `CUSTOMER: ${profile.customer}`,
      `SOLUTION: ${profile.solution}`,
      `DIFFERENTIATION: ${profile.differentiation}`,
      `ALTERNATIVES: ${profile.alternatives}`,
      `VALIDATION: ${profile.validation}`,
      `INDUSTRY: ${profile.industry}`,
      market ? `MARKET: TAM=$${market.tam?.toLocaleString()}, SAM=$${market.sam?.toLocaleString()}, SOM=$${market.som?.toLocaleString()}, Growth=${market.growth_rate}%` : 'MARKET: No data',
      competitors?.direct_competitors?.length
        ? `COMPETITORS (${competitors.direct_competitors.length} direct): ${competitors.direct_competitors.map(c => `${c.name} [${c.threat_level}]`).join(', ')}`
        : 'COMPETITORS: No data',
      competitors?.market_gaps?.length ? `MARKET GAPS: ${competitors.market_gaps.join('; ')}` : '',
      interviewContext ? `FOUNDER INTERVIEW:\n${interviewContext}` : '',
    ].filter(Boolean).join('\n');

    const { text } = await callGemini(
      AGENTS.scoring.model,
      systemPrompt,
      `Score this startup:\n\n${contextPack}`,
      { thinkingLevel: 'high', responseJsonSchema: AGENT_SCHEMAS.scoring, timeoutMs: AGENT_TIMEOUTS.scoring }
    );

    const rawScoring = extractJSON<Record<string, unknown>>(text);
    if (!rawScoring) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }

    // Deterministic post-processing: compute overall_score, verdict, factor statuses
    const mathResult = computeScore(
      rawScoring.dimension_scores as DimensionScoresInput,
      (rawScoring.market_factors as FactorInput[]) || [],
      (rawScoring.execution_factors as FactorInput[]) || [],
    );

    const scoring: ScoringResult = {
      overall_score: mathResult.overall_score,
      verdict: mathResult.verdict,
      dimension_scores: rawScoring.dimension_scores as Record<string, number>,
      market_factors: mathResult.market_factors,
      execution_factors: mathResult.execution_factors,
      highlights: (rawScoring.highlights as string[]) || [],
      red_flags: (rawScoring.red_flags as string[]) || [],
      risks_assumptions: (rawScoring.risks_assumptions as string[]) || [],
      scores_matrix: mathResult.scores_matrix,
    };

    await completeRun(supabase, sessionId, agentName, 'ok', scoring);
    return scoring;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
