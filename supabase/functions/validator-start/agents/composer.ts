/**
 * Agent 6: Composer
 * Combines all agent outputs into a final validation report.
 */

import type {
  SupabaseClient,
  StartupProfile,
  MarketResearch,
  CompetitorAnalysis,
  ScoringResult,
  MVPPlan,
  ValidatorReport,
} from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";

export async function runComposer(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile | null,
  market: MarketResearch | null,
  competitors: CompetitorAnalysis | null,
  scoring: ScoringResult | null,
  mvp: MVPPlan | null,
  timeoutBudgetMs?: number
): Promise<ValidatorReport | null> {
  const agentName = 'ComposerAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  // P04: STREAMLINED for speed — must complete within ~40s on Gemini Flash.
  // Removed highlights/red_flags (ScoringAgent already has them), removed SWOT
  // (not in ValidatorReport type), reduced item counts, simplified nested structures.
  // maxOutputTokens: 4096 (down from 8192) — forces concise output.
  const systemPrompt = `You are a sharp startup advisor. Be direct, specific, and CONCISE.

## RULES:
- Short sentences, active voice. Quantify everything.
- Keep each section brief. Aim for 1-2 sentences per paragraph, 1 sentence per list item.
- Every claim needs evidence. Every risk needs consequences.

Return JSON with EXACTLY these fields:

"summary_verdict": 2-3 sentences: score + verdict, top strength, top risk.
"problem_clarity": Who has this problem, how painful, what they do today. (1 short paragraph)
"customer_use_case": Buyer persona, daily pain, how product helps. (1 short paragraph)
"market_sizing": { "tam": USD, "sam": USD, "som": USD, "citations": ["source"] }
"competition": { "competitors": [{ "name": str, "description": str, "threat_level": "high"|"medium"|"low" }] (3 max), "citations": [] }
"risks_assumptions": [3 items: "Assumes X — if wrong, Y"]
"mvp_scope": What to build first, which assumptions it tests. (1 short paragraph)
"next_steps": [3-5 items: "action + deliverable"]
"technology_stack": { "stack_components": [{ "name": str, "choice": "build"|"buy"|"open_source", "rationale": str }], "feasibility": "high"|"medium"|"low", "feasibility_rationale": str, "technical_risks": [{ "risk": str, "mitigation": str }] (2 max), "mvp_timeline_weeks": number }
"revenue_model": { "recommended_model": str, "reasoning": str, "alternatives": [{ "model": str, "pros": [str], "cons": [str] }] (2 max), "unit_economics": { "cac": number, "ltv": number, "ltv_cac_ratio": number, "payback_months": number } }
"team_hiring": { "current_gaps": [str], "mvp_roles": [{ "role": str, "priority": number, "monthly_cost": number }] (3 max), "monthly_burn": number }
"key_questions": [{ "question": str, "why_it_matters": str, "risk_level": "fatal"|"important"|"minor" }] (3 max)
"resources_links": [{ "category": str, "links": [{ "title": str, "url": str, "description": str }] }] (3 categories max)
"scores_matrix": { "dimensions": [{ "name": str, "score": 0-100, "weight": 0.0-1.0 }], "overall_weighted": number }
"financial_projections": { "scenarios": [{ "name": str, "y1_revenue": number, "y3_revenue": number, "y5_revenue": number, "assumptions": [str] }] (3 scenarios), "break_even": { "months": number, "revenue_required": number }, "key_assumption": str }

Use real data from agent outputs. Be specific to THIS startup.`;

  try {
    // Composer schema is too complex for Gemini responseJsonSchema (400 error).
    // Use responseMimeType: 'application/json' (set in gemini.ts) + extractJSON fallback.
    // P03: maxRetries: 0 — Composer is the final expensive agent. Retries would push past
    // the wall-clock limit. If it fails once, report the failure immediately.
    // P06: maxOutputTokens restored to 8192 — 4096 caused truncation of financial_projections.
    // extractJSON repair (gemini.ts) handles any remaining truncation as safety net.
    // P04: Truncate large inputs — cap sources/citations to keep prompt under 10KB.
    const trimmedMarket = market ? {
      tam: market.tam, sam: market.sam, som: market.som,
      methodology: market.methodology, growth_rate: market.growth_rate,
      sources: (market.sources || []).slice(0, 5),
    } : {};
    const trimmedCompetitors = competitors ? {
      direct_competitors: (competitors.direct_competitors || []).slice(0, 4).map(c => ({
        name: c.name, description: c.description?.slice(0, 200),
        threat_level: c.threat_level,
      })),
      indirect_competitors: (competitors.indirect_competitors || []).slice(0, 2).map(c => ({
        name: c.name, description: c.description?.slice(0, 150),
      })),
      market_gaps: (competitors.market_gaps || []).slice(0, 3),
    } : {};

    const thinkingLevel = AGENTS.composer.thinking;
    const { text } = await callGemini(
      AGENTS.composer.model,
      systemPrompt,
      `Compose final report from agent outputs:

PROFILE: ${JSON.stringify(profile || {})}
MARKET: ${JSON.stringify(trimmedMarket)}
COMPETITORS: ${JSON.stringify(trimmedCompetitors)}
SCORING: ${JSON.stringify(scoring || {})}
MVP: ${JSON.stringify(mvp || {})}`,
      { thinkingLevel, timeoutMs: timeoutBudgetMs || AGENT_TIMEOUTS.composer, maxRetries: 0, maxOutputTokens: 8192 }
    );

    // FIX: Gemini occasionally wraps JSON response in an array [{}] — unwrap
    let report = extractJSON<ValidatorReport>(text);
    if (Array.isArray(report)) report = (report as unknown[])[0] as ValidatorReport || null;
    if (!report) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }
    await completeRun(supabase, sessionId, agentName, 'ok', report);
    return report;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
