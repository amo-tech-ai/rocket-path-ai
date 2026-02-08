/**
 * Agent 4: Scoring
 * Scores startup across key dimensions and produces verdict.
 */

import type { SupabaseClient, StartupProfile, MarketResearch, CompetitorAnalysis, ScoringResult } from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { AGENT_SCHEMAS } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";

export async function runScoring(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile,
  market: MarketResearch | null,
  competitors: CompetitorAnalysis | null
): Promise<ScoringResult | null> {
  const agentName = 'ScoringAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  const systemPrompt = `You are a sharp startup evaluator. Score this startup honestly and explain your reasoning in plain language.

## Writing style:
- Each description should be 1-2 sentences explaining the score with specific evidence
- Use concrete numbers and real comparisons — not vague qualifiers
- BAD: "The market presents significant growth opportunities in emerging sectors"
- GOOD: "A $8.8B market growing at 41% annually — strong tailwinds for a new entrant"
- BAD: "Competition is a moderate concern requiring strategic positioning"
- GOOD: "3 well-funded competitors exist, but none serve independent labels under 50 employees"
- Highlights should be reasons an investor would get excited
- Red flags should be honest concerns a founder needs to address

Return JSON with exactly these fields:
{
  "overall_score": <0-100>,
  "verdict": "go|caution|no_go",
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
    {"name": "Market Size", "score": <1-10>, "description": "Explain what the market size means for this specific idea — cite the TAM/SAM numbers", "status": "strong|moderate|weak"},
    {"name": "Growth Rate", "score": <1-10>, "description": "State the growth rate and what's driving it", "status": "strong|moderate|weak"},
    {"name": "Competition", "score": <1-10>, "description": "How crowded is it? Name the biggest threats and explain the gap this idea fills", "status": "strong|moderate|weak"},
    {"name": "Timing", "score": <1-10>, "description": "Why now? What changed in the market that makes this possible today", "status": "strong|moderate|weak"}
  ],
  "execution_factors": [
    {"name": "Team", "score": <1-10>, "description": "What domain expertise exists? What's missing?", "status": "strong|moderate|weak"},
    {"name": "Product", "score": <1-10>, "description": "How well does the product solve the stated problem? What's the core insight?", "status": "strong|moderate|weak"},
    {"name": "Go-to-Market", "score": <1-10>, "description": "How will they reach customers? Is the distribution channel clear?", "status": "strong|moderate|weak"},
    {"name": "Unit Economics", "score": <1-10>, "description": "Do the numbers work? Estimate CAC, LTV, and margins based on the business model", "status": "strong|moderate|weak"}
  ],
  "highlights": ["Strength 1 — specific and evidence-based", "Strength 2", "Strength 3"],
  "red_flags": ["Risk 1 — explain what breaks if this goes wrong", "Risk 2"],
  "risks_assumptions": ["Assumes X — if wrong, Y happens", "Risk: X could cause Y because Z"]
}

Score based on: 75+ = GO, 50-74 = CAUTION, <50 = NO-GO`;

  try {
    // P01: thinkingLevel: 'high' enables deeper multi-criteria reasoning
    // Note: thinking mode disables responseJsonSchema — we rely on extractJSON fallback
    const { text } = await callGemini(
      AGENTS.scoring.model,
      systemPrompt,
      `Score this startup:
Profile: ${JSON.stringify(profile)}
Market Data: ${JSON.stringify(market || {})}
Competitors: ${JSON.stringify(competitors || {})}`,
      { thinkingLevel: 'high', responseJsonSchema: AGENT_SCHEMAS.scoring, timeoutMs: AGENT_TIMEOUTS.scoring }
    );

    const scoring = extractJSON<ScoringResult>(text);
    if (!scoring) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }
    await completeRun(supabase, sessionId, agentName, 'ok', scoring);
    return scoring;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
