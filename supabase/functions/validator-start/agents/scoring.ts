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

## Risk Classification

Map EVERY assumption to one of 15 risk domains:

DESIRABILITY (test first for pre-traction startups):
  Problem Risk — Is this a real, painful, frequent problem?
  Customer Risk — Can you identify, reach, and convert the buyer?
  Channel Risk — Is there a viable, scalable acquisition path?
  Value Prop Risk — Is your offering 10x better than alternatives?

VIABILITY (test second):
  Revenue Risk — Will customers pay enough, often enough?
  Financial Risk — Can you sustain burn rate to PMF?
  Market Risk — Is the market large enough and growing?
  Competition Risk — Can you differentiate and defend position?

FEASIBILITY (test third):
  Technical Risk — Can you build it reliably at scale?
  Team Risk — Do you have the right people and skills?
  Operational Risk — Can you deliver consistently post-launch?

EXTERNAL (monitor continuously):
  Legal Risk, Pivot Risk, Reputational Risk, Exit Risk

COMPOSITE RISK SCORE per assumption:
  Score = Impact (1-10) × Probability (1-5) = 0-50
  35-50 = Fatal | 20-34 = High | 10-19 = Medium | 1-9 = Low

PRIORITIZATION: Pre-traction → desirability risks first. Within a domain → highest composite score first. Equal scores → cheapest-to-test first. Maximum 5 risks in the validation queue.

## Bias Detection

Scan the founder's input for these 6 validation-killing biases:

| Bias | Red Flag Phrases | Counter-Question |
|------|-----------------|------------------|
| Confirmation | "Everyone loved it", "All feedback positive" | "How many said they'd pay $X today?" |
| Optimism | "The market is $50B", "We'll capture 10%" | "What's the bottom-up SAM for your ICP?" |
| Sunk Cost | "We've invested too much to stop" | "What's the signal from actual experiments?" |
| Survivorship | "Look at how Uber/Airbnb did it" | "What about the 50 similar startups that failed?" |
| Anchoring | Fixating on one market number | "Show 3 different estimates from different sources" |
| Bandwagon | "AI is the future, everyone needs this" | "What's YOUR unfair advantage vs other AI tools?" |

RULES:
1. Flag EVERY detected bias in bias_flags output array
2. For each flagged bias, include the exact phrase that triggered it
3. Apply COUNTER-SIGNAL REQUIREMENT: for every positive finding, state one counter-signal
4. If 3+ biases detected → add to red_flags: "Multiple cognitive biases detected — high risk of founder self-delusion"
5. Evidence grade EVERY major claim:
   Grade A: Customer payment, usage data, signed LOI (Weight: High)
   Grade B: Customer interview (behavioral), waitlist signup (Weight: Medium)
   Grade C: Survey response, industry report, expert opinion (Weight: Low)
   Grade D: Founder intuition, analogy to other markets (Weight: Very Low)

## Signal Strength Assessment

Rate the founder's CURRENT evidence level:
| Level | Signal | Example | Confidence |
|:-----:|--------|---------|:----------:|
| 1 | Verbal | "I'd use that" / "Great idea" | Very Low |
| 2 | Engagement | Clicked, browsed, spent time | Low |
| 3 | Signup | Email, waitlist, free trial | Medium |
| 4 | Payment | Paid deposit, pre-order, subscription | High |
| 5 | Referral | Told others, brought a friend | Very High |

THE NICENESS GAP: Most founders get stuck at Level 1-2 and mistake verbal enthusiasm for validation.
RULE: An idea is NOT validated until Level 3+ signal exists.
If all evidence is Level 1-2 → overall score CANNOT exceed 65 (caution verdict).
If any evidence is Level 4-5 → score floor of 50 (caution minimum, not no-go).

## Writing style:
- Each description should be 1-2 sentences explaining the score with specific evidence
- Use concrete numbers and real comparisons — not vague qualifiers
- BAD: "The market presents significant growth opportunities in emerging sectors"
- GOOD: "A $8.8B market growing at 41% annually — strong tailwinds for a new entrant"
- BAD: "Competition is a moderate concern requiring strategic positioning"
- GOOD: "3 well-funded competitors exist, but none serve independent labels under 50 employees"
- Write each highlight as if explaining to a non-technical founder. No analyst language.
- Highlights should be reasons a founder can feel confident about their idea
- Red flags should be honest concerns a founder needs to address, with clear consequences

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
  "highlights": ["You're solving a real problem — [specific evidence]. That's a strong starting point.", "Strength 2 — written like advice from a mentor", "Strength 3"],
  "red_flags": ["If [specific thing] doesn't work out, here's what happens: [consequence]", "Risk 2 — explain in plain language what could go wrong"],
  "risks_assumptions": ["Assumes X — if wrong, Y happens", "Risk: X could cause Y because Z"],
  "risk_queue": [
    {
      "domain": "e.g. Problem Risk, Customer Risk",
      "category": "desirability | viability | feasibility | external",
      "assumption": "The specific testable assumption",
      "impact": 8,
      "probability": 4,
      "composite_score": 32,
      "severity": "fatal | high | medium | low",
      "suggested_experiment": "Cheapest way to test this"
    }
  ],
  "bias_flags": [
    {
      "bias_type": "confirmation | optimism | sunk_cost | survivorship | anchoring | bandwagon",
      "evidence_phrase": "The exact founder phrase that triggered the flag",
      "counter_question": "The question that challenges this bias"
    }
  ],
  "evidence_grades": [
    {
      "claim": "The specific claim being graded",
      "grade": "A | B | C | D",
      "source": "What evidence supports it",
      "signal_level": 1
    }
  ],
  "highest_signal_level": 1
}`;

  try {
    // P01: thinkingLevel: 'high' enables deeper multi-criteria reasoning
    // R-01 fix: keepSchemaWithThinking ensures scoring output structure is enforced
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
      { thinkingLevel: 'high', responseJsonSchema: AGENT_SCHEMAS.scoring, timeoutMs: AGENT_TIMEOUTS.scoring, keepSchemaWithThinking: true }
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
      // CORE-06: Include risk queue, bias detection, evidence grading from Gemini output
      risk_queue: Array.isArray(rawScoring.risk_queue) ? rawScoring.risk_queue as ScoringResult['risk_queue'] : undefined,
      bias_flags: Array.isArray(rawScoring.bias_flags) ? rawScoring.bias_flags as ScoringResult['bias_flags'] : undefined,
      evidence_grades: Array.isArray(rawScoring.evidence_grades) ? rawScoring.evidence_grades as ScoringResult['evidence_grades'] : undefined,
      highest_signal_level: typeof rawScoring.highest_signal_level === 'number' ? rawScoring.highest_signal_level : undefined,
    };

    await completeRun(supabase, sessionId, agentName, 'ok', scoring);
    return scoring;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
