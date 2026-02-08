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
