/**
 * Agent 7: Verifier
 * Validates the composed report has all required sections.
 * No Gemini call — pure validation logic.
 */

import type { SupabaseClient, ValidatorReport, VerificationResult } from "../types.ts";
import { updateRunStatus, completeRun } from "../db.ts";

export async function runVerifier(
  supabase: SupabaseClient,
  sessionId: string,
  report: ValidatorReport | null,
  failedAgents: string[]
): Promise<VerificationResult> {
  const agentName = 'VerifierAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  // P02: Expanded to 15 required sections
  const requiredSections = [
    'summary_verdict',
    'problem_clarity',
    'customer_use_case',
    'market_sizing',
    'competition',
    'risks_assumptions',
    'mvp_scope',
    'next_steps',
    'technology_stack',
    'revenue_model',
    'team_hiring',
    'key_questions',
    'resources_links',
    'scores_matrix',
    'financial_projections',
  ];

  const missingSections: string[] = [];
  const warnings: string[] = [];
  const sectionMappings: Record<string, string> = {
    summary_verdict: 'ScoringAgent',
    problem_clarity: 'ExtractorAgent',
    customer_use_case: 'ExtractorAgent',
    market_sizing: 'ResearchAgent',
    competition: 'CompetitorAgent',
    risks_assumptions: 'ScoringAgent',
    mvp_scope: 'MVPAgent',
    next_steps: 'MVPAgent',
    technology_stack: 'ComposerAgent',
    revenue_model: 'ComposerAgent',
    team_hiring: 'ComposerAgent',
    key_questions: 'ComposerAgent',
    resources_links: 'ResearchAgent',
    scores_matrix: 'ScoringAgent',
    financial_projections: 'ComposerAgent',
  };

  if (!report) {
    const result: VerificationResult = {
      verified: false,
      missing_sections: requiredSections,
      failed_agents: failedAgents,
      warnings: ['Report composition failed'],
      section_mappings: sectionMappings,
    };
    await completeRun(supabase, sessionId, agentName, 'ok', result);
    return result;
  }

  // Check each section
  for (const section of requiredSections) {
    const value = report[section as keyof ValidatorReport];
    if (!value || (typeof value === 'string' && value.length < 10)) {
      missingSections.push(section);
    }
  }

  // Check citations exist for market and competition
  if (!report.market_sizing?.citations?.length) {
    warnings.push('Market sizing lacks citations - data may not be grounded');
  }
  if (!report.competition?.citations?.length) {
    warnings.push('Competition analysis lacks citations - data may not be grounded');
  }

  // H5 Fix: Data integrity checks
  // Validate TAM >= SAM >= SOM
  if (report.market_sizing) {
    const { tam, sam, som } = report.market_sizing;
    if (typeof tam === 'number' && typeof sam === 'number' && sam > tam) {
      warnings.push(`Data integrity: SAM ($${sam.toLocaleString()}) exceeds TAM ($${tam.toLocaleString()})`);
    }
    if (typeof sam === 'number' && typeof som === 'number' && som > sam) {
      warnings.push(`Data integrity: SOM ($${som.toLocaleString()}) exceeds SAM ($${sam.toLocaleString()})`);
    }
  }

  // Validate scores_matrix dimensions are in range
  if (report.scores_matrix?.dimensions) {
    for (const dim of report.scores_matrix.dimensions) {
      if (typeof dim.score === 'number' && (dim.score < 0 || dim.score > 100)) {
        warnings.push(`Data integrity: dimension '${dim.name}' score ${dim.score} is out of 0-100 range`);
      }
    }
  }

  // P04: Relaxed counts to match streamlined Composer output (4096 tokens)
  if (!report.next_steps || report.next_steps.length < 3) {
    warnings.push(`Only ${report.next_steps?.length || 0} next steps provided (expected 3-5)`);
  }

  if (report.key_questions && report.key_questions.length < 2) {
    warnings.push(`Only ${report.key_questions.length} key questions (expected 3)`);
  }
  if (report.scores_matrix?.dimensions && report.scores_matrix.dimensions.length < 3) {
    warnings.push('Scores matrix should have at least 3 dimensions');
  }

  // 021-CSP: Check new optional fields from parallel composer groups
  if (report.top_threat && (!report.top_threat.assumption || !report.top_threat.how_to_test)) {
    warnings.push('top_threat is present but incomplete (missing assumption or how_to_test)');
  }
  if (report.verdict_oneliner && report.verdict_oneliner.length > 100) {
    warnings.push(`verdict_oneliner is too long (${report.verdict_oneliner.length} chars, expected <100)`);
  }
  if (report.success_condition && report.success_condition.length < 10) {
    warnings.push('success_condition is too short to be meaningful');
  }
  if (report.biggest_risk && report.biggest_risk.length < 10) {
    warnings.push('biggest_risk is too short to be meaningful');
  }

  // 022-SKI: Unit economics sanity checks
  if (report.revenue_model?.unit_economics) {
    const ue = report.revenue_model.unit_economics;
    if (typeof ue.ltv_cac_ratio === 'number' && ue.ltv_cac_ratio > 0 && ue.ltv_cac_ratio < 1) {
      warnings.push(`Unit economics: LTV:CAC ratio ${ue.ltv_cac_ratio.toFixed(1)}:1 — losing money per customer`);
    }
    if (typeof ue.ltv_cac_ratio === 'number' && ue.ltv_cac_ratio > 20) {
      warnings.push(`Unit economics: LTV:CAC ratio ${ue.ltv_cac_ratio.toFixed(1)}:1 — unrealistically high, may indicate bad inputs`);
    }
    if (typeof ue.payback_months === 'number' && ue.payback_months > 36) {
      warnings.push(`Unit economics: ${ue.payback_months} month payback exceeds 36-month threshold — unsustainable`);
    }
    if (typeof ue.cac === 'number' && ue.cac <= 0) {
      warnings.push('Unit economics: CAC is zero or negative — likely missing data, not free acquisition');
    }
  }

  // 022-SKI: Financial projection sanity checks
  if (report.financial_projections?.scenarios) {
    for (const scenario of report.financial_projections.scenarios) {
      if (scenario.y3_revenue && scenario.y1_revenue &&
          scenario.y1_revenue > 0 &&
          scenario.y3_revenue > scenario.y1_revenue * 100) {
        warnings.push(`Projection: ${scenario.name || 'Scenario'} Y3 revenue is >100x Y1 — unrealistic growth assumption`);
      }
    }
  }

  // 022-SKI: Competitor count sanity check
  if (report.competition?.competitors) {
    if (report.competition.competitors.length === 0) {
      warnings.push('Competition: zero competitors found — every market has alternatives (including status quo)');
    }
    const highThreats = report.competition.competitors.filter(
      (c: { threat_level?: string }) => c.threat_level === 'high'
    );
    if (highThreats.length > 3) {
      warnings.push(`Competition: ${highThreats.length} high-threat competitors — crowded market, verify differentiation`);
    }
  }

  // 022-SKI: Team hiring burn rate check
  if (report.team_hiring?.monthly_burn) {
    if (typeof report.team_hiring.monthly_burn === 'number' && report.team_hiring.monthly_burn > 500_000) {
      warnings.push(`Team: $${report.team_hiring.monthly_burn.toLocaleString()}/mo burn exceeds $500K — verify stage-appropriateness`);
    }
    if (typeof report.team_hiring.monthly_burn === 'number' && report.team_hiring.monthly_burn < 1000 && report.team_hiring.mvp_roles?.length > 0) {
      warnings.push(`Team: $${report.team_hiring.monthly_burn.toLocaleString()}/mo burn with ${report.team_hiring.mvp_roles.length} roles — unrealistically low`);
    }
  }

  // CORE-06: Competition positioning quality check
  if (report.competition) {
    const comp = report.competition as Record<string, unknown>;
    if (comp.swot) {
      const swot = comp.swot as Record<string, unknown[]>;
      const totalItems = (swot.strengths?.length || 0) + (swot.weaknesses?.length || 0) +
        (swot.opportunities?.length || 0) + (swot.threats?.length || 0);
      if (totalItems < 4) {
        warnings.push('Competition SWOT analysis has fewer than 4 total items — may be too shallow');
      }
    }
    if (comp.positioning) {
      const pos = comp.positioning as Record<string, unknown>;
      const positions = pos.positions as unknown[];
      if (positions && positions.length < 3) {
        warnings.push('Competition positioning map has fewer than 3 entries — add more for useful comparison');
      }
    }
  }

  // 022-SKI: Market SOM as % of SAM check
  if (report.market_sizing) {
    const { tam, sam, som } = report.market_sizing;
    if (typeof tam === 'number' && tam > 0 && typeof som === 'number' && typeof sam === 'number' && sam > 0) {
      const somPercent = (som / sam) * 100;
      if (somPercent > 10) {
        warnings.push(`Market: SOM is ${somPercent.toFixed(1)}% of SAM — early-stage startups typically capture 1-5%`);
      }
    }
  }

  const verified = missingSections.length === 0 && failedAgents.length === 0;

  const result: VerificationResult = {
    verified,
    missing_sections: missingSections,
    failed_agents: failedAgents,
    warnings,
    section_mappings: sectionMappings,
  };

  await completeRun(supabase, sessionId, agentName, 'ok', result);
  return result;
}
