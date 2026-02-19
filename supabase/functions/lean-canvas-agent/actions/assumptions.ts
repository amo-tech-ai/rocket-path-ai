/**
 * Assumptions Actions
 * Extract and manage assumptions from Lean Canvas
 * Integrates with assumptions, experiments tables
 */

import type { BoxKey, LeanCanvasData, ValidationResult } from "../types.ts";
import { CANVAS_BOX_CONFIG } from "../types.ts";
import { callGemini, extractJSON, logAIRun, type AIResponse } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

// =============================================================================
// Types
// =============================================================================

interface ExtractedAssumption {
  statement: string;
  source_block: string;
  impact_score: number;
  uncertainty_score: number;
  validation_criteria: string;
  tags: string[];
}

interface AssumptionExtractionResult {
  assumptions: Array<{
    id: string;
    statement: string;
    source_block: string;
    priority_score: number;
    status: string;
  }>;
  riskiest_assumption: string;
  recommended_experiment: string;
  total_extracted: number;
}

interface ExperimentSuggestion {
  experiment_type: string;
  hypothesis: string;
  metric: string;
  target_value: number;
  sample_size: number;
  duration_days: number;
  steps: string[];
  estimated_cost: string;
}

// =============================================================================
// Extract Assumptions from Canvas
// =============================================================================

/**
 * Extract testable assumptions from validated canvas
 */
export async function extractAssumptions(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  canvasData: Record<string, unknown>,
  validationResults?: ValidationResult[]
): Promise<AssumptionExtractionResult> {
  console.log(`[extractAssumptions] Extracting assumptions for startup ${startupId}`);

  // Get user's org_id for logging
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id || null;

  // Get startup context
  const { data: startup } = await supabase
    .from("startups")
    .select("name, industry, stage")
    .eq("id", startupId)
    .single();

  // Get current lean canvas ID
  const { data: canvas } = await supabase
    .from("lean_canvases")
    .select("id")
    .eq("startup_id", startupId)
    .eq("is_current", true)
    .single();

  const leanCanvasId = canvas?.id || null;

  const systemPrompt = `You are a Lean Startup expert specializing in identifying and prioritizing riskiest assumptions.

Your task is to extract testable assumptions from a Lean Canvas. Focus on:
1. Problem assumptions - Is this a real, urgent pain point?
2. Solution assumptions - Does our approach actually solve the problem?
3. Customer segment assumptions - Are we targeting the right people?
4. Channel assumptions - Can we effectively reach them?
5. Revenue assumptions - Will they pay this amount?
6. Unfair advantage assumptions - Is this truly defensible?

For each assumption:
- Write it as a clear, falsifiable hypothesis
- Score IMPACT (1-10): How much would being wrong hurt the business?
- Score UNCERTAINTY (1-10): How confident are we this is true? (10 = very uncertain)
- Priority = Impact × Uncertainty (higher = test first)
- Provide specific validation criteria`;

  const userPrompt = `Startup: ${startup?.name || 'Unknown'} (${startup?.industry || 'Unknown'}, ${startup?.stage || 'Unknown'})

LEAN CANVAS:
${JSON.stringify(canvasData, null, 2)}

${validationResults ? `
VALIDATION RESULTS (from risk assessment):
${JSON.stringify(validationResults, null, 2)}
` : ''}

Extract the TOP 5-8 riskiest assumptions from this canvas. Return JSON:
{
  "assumptions": [
    {
      "statement": "Clear, testable assumption statement",
      "source_block": "problem|solution|uniqueValueProp|customerSegments|channels|revenueStreams|costStructure|keyMetrics|unfairAdvantage",
      "impact_score": 8,
      "uncertainty_score": 7,
      "validation_criteria": "Specific criteria to validate/invalidate",
      "tags": ["customer", "pricing", "market"]
    }
  ],
  "riskiest_assumption": "The single highest priority assumption",
  "recommended_experiment": "Suggested experiment type for the riskiest assumption"
}

Focus on assumptions that, if wrong, would fundamentally break the business model.`;

  const response = await callGemini(
    "gemini-3-pro-preview",
    systemPrompt,
    userPrompt,
    { jsonMode: true, maxTokens: 2000 }
  );

  // Log AI run
  await logAIRun(supabase, userId, orgId, startupId, "extract_assumptions", response);

  const parsed = extractJSON<{
    assumptions: ExtractedAssumption[];
    riskiest_assumption: string;
    recommended_experiment: string;
  }>(response.text);

  if (!parsed || !Array.isArray(parsed.assumptions)) {
    return {
      assumptions: [],
      riskiest_assumption: '',
      recommended_experiment: '',
      total_extracted: 0,
    };
  }

  // Save assumptions to database
  const savedAssumptions: AssumptionExtractionResult['assumptions'] = [];

  for (const assumption of parsed.assumptions) {
    // Map canvas box keys to assumption source blocks
    const sourceBlockMap: Record<string, string> = {
      problem: 'problem',
      solution: 'solution',
      uniqueValueProp: 'uvp',
      customerSegments: 'customer_segments',
      channels: 'channels',
      revenueStreams: 'revenue_streams',
      costStructure: 'cost_structure',
      keyMetrics: 'key_metrics',
      unfairAdvantage: 'unfair_advantage',
    };

    const sourceBlock = sourceBlockMap[assumption.source_block] || 'other';

    const { data: saved, error } = await supabase
      .from("assumptions")
      .insert({
        startup_id: startupId,
        lean_canvas_id: leanCanvasId,
        statement: assumption.statement,
        source_block: sourceBlock,
        impact_score: Math.min(10, Math.max(1, assumption.impact_score)),
        uncertainty_score: Math.min(10, Math.max(1, assumption.uncertainty_score)),
        validation_criteria: assumption.validation_criteria,
        tags: assumption.tags || [],
        status: 'untested',
        ai_generated: true,
      })
      .select("id, statement, source_block, priority_score, status")
      .single();

    if (saved && !error) {
      savedAssumptions.push(saved);
    } else {
      console.error("[extractAssumptions] Failed to save assumption:", error);
    }
  }

  return {
    assumptions: savedAssumptions,
    riskiest_assumption: parsed.riskiest_assumption,
    recommended_experiment: parsed.recommended_experiment,
    total_extracted: savedAssumptions.length,
  };
}

// =============================================================================
// Suggest Experiment for Assumption
// =============================================================================

/**
 * Design an experiment to test a specific assumption
 */
export async function suggestExperiment(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  assumptionId: string
): Promise<ExperimentSuggestion & { experiment_id?: string }> {
  console.log(`[suggestExperiment] Designing experiment for assumption ${assumptionId}`);

  // Get user's org_id for logging
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id || null;

  // Get assumption
  const { data: assumption } = await supabase
    .from("assumptions")
    .select("*")
    .eq("id", assumptionId)
    .single();

  if (!assumption) {
    throw new Error("Assumption not found");
  }

  // Get startup context
  const { data: startup } = await supabase
    .from("startups")
    .select("name, industry, stage")
    .eq("id", startupId)
    .single();

  const systemPrompt = `You are a Lean Startup expert specializing in designing validation experiments.

Design the most efficient experiment to test this assumption. Consider:
- Smoke tests (fake door, landing page)
- Customer interviews (problem/solution discovery)
- Surveys (quantitative validation)
- Prototypes (usability testing)
- Concierge MVP (manual delivery)
- Wizard of Oz (manual backend)
- Pre-orders / LOIs

Choose the fastest, cheapest method that provides sufficient evidence.`;

  const userPrompt = `Startup: ${startup?.name || 'Unknown'} (${startup?.industry || 'Unknown'}, ${startup?.stage || 'Unknown'})

ASSUMPTION TO TEST:
Statement: ${assumption.statement}
Source: ${assumption.source_block}
Impact Score: ${assumption.impact_score}/10
Uncertainty Score: ${assumption.uncertainty_score}/10
Priority Score: ${assumption.priority_score}

Validation Criteria: ${assumption.validation_criteria || 'Not specified'}

Design an experiment to validate or invalidate this assumption. Return JSON:
{
  "experiment_type": "interview|survey|landing_page|smoke_test|prototype|concierge|wizard_of_oz|ab_test|mvp",
  "hypothesis": "If we [action], then [expected outcome] because [reason]",
  "metric": "Specific measurable metric",
  "target_value": 0.6,
  "sample_size": 10,
  "duration_days": 7,
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "success_criteria": "What proves the assumption true",
  "failure_criteria": "What proves it false",
  "estimated_cost": "Low|Medium|High"
}`;

  const response = await callGemini(
    "gemini-3-flash-preview",
    systemPrompt,
    userPrompt,
    { jsonMode: true, maxTokens: 1500 }
  );

  // Log AI run
  await logAIRun(supabase, userId, orgId, startupId, "suggest_experiment", response);

  const parsed = extractJSON<ExperimentSuggestion & {
    success_criteria: string;
    failure_criteria: string;
  }>(response.text);

  if (!parsed) {
    return {
      experiment_type: 'interview',
      hypothesis: 'Unable to generate hypothesis',
      metric: 'TBD',
      target_value: 0.5,
      sample_size: 10,
      duration_days: 7,
      steps: ['Define experiment details manually'],
      estimated_cost: 'Low',
    };
  }

  // Save experiment to database
  const { data: experiment, error } = await supabase
    .from("experiments")
    .insert({
      startup_id: startupId,
      assumption_id: assumptionId,
      experiment_type: parsed.experiment_type,
      hypothesis: parsed.hypothesis,
      metric: parsed.metric,
      target_value: parsed.target_value,
      status: 'planned',
      tags: [],
      ai_generated: true,
    })
    .select("id")
    .single();

  // Update assumption with linked experiment
  if (experiment && !error) {
    const { data: currentAssumption } = await supabase
      .from("assumptions")
      .select("linked_experiment_ids")
      .eq("id", assumptionId)
      .single();

    const currentLinks = currentAssumption?.linked_experiment_ids || [];

    await supabase
      .from("assumptions")
      .update({
        linked_experiment_ids: [...currentLinks, experiment.id],
        status: 'testing',
      })
      .eq("id", assumptionId);
  }

  return {
    ...parsed,
    experiment_id: experiment?.id,
  };
}

// =============================================================================
// Get Assumptions for Canvas
// =============================================================================

/**
 * Get all assumptions for a startup's current canvas
 */
export async function getAssumptions(
  supabase: SupabaseClient,
  userId: string,
  startupId: string
): Promise<{
  assumptions: Array<{
    id: string;
    statement: string;
    source_block: string;
    impact_score: number;
    uncertainty_score: number;
    priority_score: number;
    status: string;
    experiments: Array<{ id: string; status: string; experiment_type: string }>;
  }>;
  summary: {
    total: number;
    untested: number;
    testing: number;
    validated: number;
    invalidated: number;
  };
}> {
  console.log(`[getAssumptions] Fetching assumptions for startup ${startupId}`);

  // Get assumptions with linked experiments
  const { data: assumptions, error } = await supabase
    .from("assumptions")
    .select(`
      id,
      statement,
      source_block,
      impact_score,
      uncertainty_score,
      priority_score,
      status,
      linked_experiment_ids
    `)
    .eq("startup_id", startupId)
    .order("priority_score", { ascending: false });

  if (error || !assumptions) {
    return {
      assumptions: [],
      summary: { total: 0, untested: 0, testing: 0, validated: 0, invalidated: 0 },
    };
  }

  // Fetch experiments for each assumption
  const assumptionsWithExperiments = await Promise.all(
    assumptions.map(async (assumption) => {
      const experimentIds = assumption.linked_experiment_ids || [];

      let experiments: Array<{ id: string; status: string; experiment_type: string }> = [];

      if (experimentIds.length > 0) {
        const { data: experimentData } = await supabase
          .from("experiments")
          .select("id, status, experiment_type")
          .in("id", experimentIds);

        experiments = experimentData || [];
      }

      return {
        id: assumption.id,
        statement: assumption.statement,
        source_block: assumption.source_block,
        impact_score: assumption.impact_score,
        uncertainty_score: assumption.uncertainty_score,
        priority_score: assumption.priority_score,
        status: assumption.status,
        experiments,
      };
    })
  );

  // Calculate summary
  const summary = {
    total: assumptions.length,
    untested: assumptions.filter(a => a.status === 'untested').length,
    testing: assumptions.filter(a => a.status === 'testing').length,
    validated: assumptions.filter(a => a.status === 'validated').length,
    invalidated: assumptions.filter(a => a.status === 'invalidated').length,
  };

  return {
    assumptions: assumptionsWithExperiments,
    summary,
  };
}

// =============================================================================
// Update Assumption Status
// =============================================================================

/**
 * Update assumption status based on experiment results
 */
export async function updateAssumptionStatus(
  supabase: SupabaseClient,
  userId: string,
  assumptionId: string,
  status: 'validated' | 'invalidated' | 'pivoted',
  evidence?: string
): Promise<{ success: boolean; assumption: unknown }> {
  console.log(`[updateAssumptionStatus] Updating assumption ${assumptionId} to ${status}`);

  const { data: assumption, error } = await supabase
    .from("assumptions")
    .update({
      status,
      evidence: evidence || null,
      validated_at: ['validated', 'invalidated', 'pivoted'].includes(status)
        ? new Date().toISOString()
        : null,
    })
    .eq("id", assumptionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update assumption: ${error.message}`);
  }

  return { success: true, assumption };
}
