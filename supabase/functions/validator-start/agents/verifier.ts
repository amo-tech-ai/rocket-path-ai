/**
 * Agent 7: Verifier
 * Validates the composed report has all required sections.
 * No Gemini call — pure validation logic.
 */

import type { SupabaseClient, ValidatorReport, VerificationResult } from "../types.ts";
import { updateRunStatus, completeRun } from "../db.ts";

// --- Validation helpers ---

function isNonEmptyString(v: unknown, minLen = 10): boolean {
  return typeof v === 'string' && v.trim().length >= minLen;
}

function isArrayOfMin(v: unknown, min: number): boolean {
  return Array.isArray(v) && v.length >= min;
}

function countPlaceholders(text: string): number {
  const placeholders = /\b(Unknown|TBD|N\/A|Not specified|Data unavailable|unavailable|not available)\b/gi;
  return (text.match(placeholders) || []).length;
}

interface DetailedWarning {
  severity: 'info' | 'warn' | 'error';
  code: string;
  message: string;
  fix_hint: string;
  owner_agent: string;
  section: string;
}

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

  // Section health assessment: ok | weak | missing
  const sectionHealth: Record<string, { status: 'ok' | 'weak' | 'missing'; reasons: string[] }> = {};

  for (const section of requiredSections) {
    const value = report[section as keyof ValidatorReport];
    const reasons: string[] = [];

    if (!value || (typeof value === 'string' && value.length < 10)) {
      sectionHealth[section] = { status: 'missing', reasons: ['Section missing or too short'] };
      missingSections.push(section);
      continue;
    }

    // Section-specific quality checks
    if (section === 'problem_clarity' && typeof value === 'object') {
      const pc = value as Record<string, unknown>;
      if (!isNonEmptyString(pc.who, 15)) reasons.push('who field too short — needs job title + company type');
      if (!isNonEmptyString(pc.pain, 20)) reasons.push('pain field too short — needs quantified impact');
      if (typeof pc.pain === 'string' && !/\d/.test(pc.pain)) reasons.push('pain has no numbers — quantify the cost');
    }

    if (section === 'customer_use_case' && typeof value === 'object') {
      const cu = value as Record<string, unknown>;
      if (!isNonEmptyString(cu.without, 30)) reasons.push('without scenario too short — needs step-by-step friction');
      if (!isNonEmptyString(cu.with, 30)) reasons.push('with scenario too short — needs specific product interaction');
      if (typeof cu.time_saved === 'string' && !/\d/.test(cu.time_saved)) reasons.push('time_saved has no number');
    }

    if (section === 'market_sizing' && typeof value === 'object') {
      const ms = value as Record<string, unknown>;
      if (typeof ms.tam !== 'number' || ms.tam <= 0) reasons.push('TAM missing or zero');
      if (typeof ms.sam !== 'number' || ms.sam <= 0) reasons.push('SAM missing or zero');
    }

    if (section === 'summary_verdict' && typeof value === 'string') {
      const placeholderCount = countPlaceholders(value);
      if (placeholderCount >= 2) reasons.push(`${placeholderCount} placeholder phrases found`);
      if (value.length < 100) reasons.push('Summary too short for meaningful analysis');
    }

    if (section === 'scores_matrix' && typeof value === 'object') {
      const sm = value as Record<string, unknown>;
      const dims = sm.dimensions;
      if (!isArrayOfMin(dims, 3)) reasons.push('Fewer than 3 scored dimensions');
    }

    sectionHealth[section] = {
      status: reasons.length > 0 ? 'weak' : 'ok',
      reasons,
    };
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

  // === Cross-section consistency checks ===

  // Score vs verdict alignment
  if (report.scores_matrix?.overall_weighted !== undefined && typeof report.scores_matrix.overall_weighted === 'number') {
    const overallScore = report.scores_matrix.overall_weighted;
    if (overallScore < 60 && typeof report.summary_verdict === 'string' && /\*\*Go\.\*\*/.test(report.summary_verdict) && !/Conditional/.test(report.summary_verdict)) {
      warnings.push(`Consistency: overall score ${overallScore} but verdict is "Go" — should be "Conditional go" or "No-go"`);
    }
  }

  // Top threat present in risks
  if (report.top_threat && typeof report.top_threat === 'object') {
    const threatAssumption = (report.top_threat as Record<string, unknown>).assumption;
    if (threatAssumption && typeof threatAssumption === 'string') {
      const risks = report.risks_assumptions;
      if (Array.isArray(risks) && risks.length > 0) {
        const threatInRisks = risks.some((r: Record<string, unknown>) =>
          typeof r.assumption === 'string' && r.assumption.toLowerCase().includes(threatAssumption.toLowerCase().slice(0, 30))
        );
        if (!threatInRisks) {
          warnings.push('Consistency: top_threat not found in risks_assumptions list');
        }
      }
    }
  }

  // Missing pricing test in next_steps
  if (Array.isArray(report.next_steps) && report.next_steps.length > 0) {
    const hasPricingStep = report.next_steps.some((s: Record<string, unknown>) => {
      const text = JSON.stringify(s).toLowerCase();
      return text.includes('price') || text.includes('pricing') || text.includes('willingness to pay');
    });
    if (!hasPricingStep) {
      warnings.push('Consistency: no pricing validation step in next_steps — add willingness-to-pay test');
    }
  }

  // Zero competitors but high competition score
  if (report.competition && typeof report.competition === 'object') {
    const comp = report.competition as Record<string, unknown>;
    const competitors = comp.competitors as unknown[];
    if ((!competitors || competitors.length === 0) && report.scores_matrix?.dimensions) {
      const compDim = report.scores_matrix.dimensions.find((d: Record<string, unknown>) =>
        typeof d.name === 'string' && d.name.toLowerCase().includes('compet')
      );
      if (compDim && typeof compDim.score === 'number' && compDim.score > 60) {
        warnings.push(`Consistency: 0 competitors identified but competition score is ${compDim.score} — investigate`);
      }
    }
  }

  // === Classify warnings into detailed format ===
  const detailedWarnings: DetailedWarning[] = warnings.map(w => {
    let severity: 'info' | 'warn' | 'error' = 'warn';
    let code = 'V_GENERAL';
    let section = 'general';
    let owner = 'ComposerAgent';
    let fixHint = 'Review and correct the flagged issue';

    if (w.includes('Data integrity: SAM') || w.includes('Data integrity: SOM')) {
      severity = 'error'; code = 'V_BAD_MARKET_HIERARCHY'; section = 'market_sizing'; owner = 'ResearchAgent';
      fixHint = 'Ensure TAM >= SAM >= SOM — check Research agent market calculations';
    } else if (w.includes('lacks citations')) {
      severity = 'warn'; code = 'V_MISSING_CITATIONS';
      section = w.includes('Market') ? 'market_sizing' : 'competition';
      owner = w.includes('Market') ? 'ResearchAgent' : 'CompetitorAgent';
      fixHint = 'Add source citations with URLs and publication years';
    } else if (w.includes('Consistency:')) {
      severity = 'error'; code = 'V_CROSS_SECTION_MISMATCH'; section = 'summary_verdict';
      fixHint = 'Align verdict, scores, and risk assessments';
    } else if (w.includes('unrealistic')) {
      severity = 'warn'; code = 'V_UNREALISTIC_PROJECTION'; section = 'financial_projections';
      fixHint = 'Review growth assumptions and validate against benchmarks';
    } else if (w.includes('Unit economics')) {
      severity = 'warn'; code = 'V_UNIT_ECONOMICS'; section = 'revenue_model'; owner = 'ComposerAgent';
      fixHint = 'Review CAC, LTV, and payback period assumptions';
    } else if (w.includes('SOM is') && w.includes('% of SAM')) {
      severity = 'warn'; code = 'V_SOM_OVERESTIMATE'; section = 'market_sizing'; owner = 'ResearchAgent';
      fixHint = 'Apply stage-appropriate SOM calibration (pre-seed: 0.1-0.5% of SAM)';
    } else if (w.includes('zero competitors')) {
      severity = 'warn'; code = 'V_NO_COMPETITORS'; section = 'competition'; owner = 'CompetitorAgent';
      fixHint = 'Every market has alternatives — include status quo and indirect competitors';
    }

    return { severity, code, message: w, fix_hint: fixHint, owner_agent: owner, section };
  });

  // Section health: check for 'missing' sections and 'error' severity warnings
  const hasMissingSections = Object.values(sectionHealth).some(h => h.status === 'missing');
  const hasErrorWarnings = detailedWarnings.some(w => w.severity === 'error');

  // Failed agents with valid fallback sections -> warn, don't auto-fail
  const criticalFailedAgents = failedAgents.filter(a => {
    // If the agent failed but composer provided fallback content, downgrade to warning
    if (a === 'ResearchAgent' && report.market_sizing && typeof report.market_sizing === 'object') {
      const ms = report.market_sizing as Record<string, unknown>;
      if (typeof ms.tam === 'number' && ms.tam > 0) {
        warnings.push(`${a} failed but market_sizing has fallback data — verify quality`);
        return false;
      }
    }
    if (a === 'CompetitorAgent' && report.competition && typeof report.competition === 'object') {
      const comp = report.competition as Record<string, unknown>;
      if (isArrayOfMin(comp.competitors, 1)) {
        warnings.push(`${a} failed but competition has fallback data — verify quality`);
        return false;
      }
    }
    return true;
  });

  const verified = !hasMissingSections && !hasErrorWarnings && criticalFailedAgents.length === 0;

  const result: VerificationResult = {
    verified,
    missing_sections: missingSections,
    failed_agents: criticalFailedAgents,
    warnings,
    section_mappings: sectionMappings,
    section_health: sectionHealth,
    detailed_warnings: detailedWarnings,
  };

  await completeRun(supabase, sessionId, agentName, 'ok', result);
  return result;
}
