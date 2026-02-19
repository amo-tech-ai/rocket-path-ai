import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

/**
 * Workflow Trigger System (Score-to-Task Automation)
 *
 * Automatically creates corrective tasks when validation scores fall below thresholds.
 * Logic: Score < threshold → Generate specific action items for the founder.
 *
 * Actions:
 * - process_score: Evaluate score and create tasks if needed
 * - process_validation_report: Process validation run results
 * - get_trigger_rules: Return the active trigger rules
 * - check_duplicates: Verify if similar task already exists
 *
 * Updated: 2026-01-31 - 18 trigger rules, proper category matching, activity logging
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface TriggerRule {
  id: string;
  source: 'investor_score' | 'readiness_score' | 'validation_report' | 'health_score';
  category: string;
  threshold: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  taskTemplate: {
    title: string;
    description: string;
    tags: string[];
  };
}

interface ScoreData {
  startup_id: string;
  org_id?: string;
  source: TriggerRule['source'];
  overall_score?: number;
  category_scores?: Record<string, number>;
  context?: Record<string, unknown>;
}

interface ProcessResult {
  success: boolean;
  tasks_created: number;
  tasks_skipped: number;
  tasks_failed: number;
  tasks: Array<{ title: string; priority: string; id?: string }>;
  errors?: string[];
}

// =============================================================================
// TRIGGER RULES CONFIGURATION (18 RULES)
// Categories match health-scorer breakdown keys (camelCase)
// =============================================================================

const TRIGGER_RULES: TriggerRule[] = [
  // ---------------------------------------------------------------------------
  // HEALTH SCORE RULES (8 rules) - matches health-scorer breakdown keys
  // ---------------------------------------------------------------------------
  {
    id: 'problem_clarity_low',
    source: 'health_score',
    category: 'problemClarity',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Clarify Problem Statement',
      description: 'Your problem clarity score is {{SCORE}}/100 (threshold: {{THRESHOLD}}). Refine your problem statement to clearly articulate the pain point you\'re solving. Include: who has this problem, how severe it is, and how often it occurs.',
      tags: ['foundation', 'validation', 'ai-triggered'],
    },
  },
  {
    id: 'solution_fit_low',
    source: 'health_score',
    category: 'solutionFit',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Define Unique Value Proposition',
      description: 'Your solution fit score is {{SCORE}}/100 (threshold: {{THRESHOLD}}). Document your unique value proposition: what makes your solution different from alternatives, and why customers should choose you.',
      tags: ['foundation', 'positioning', 'ai-triggered'],
    },
  },
  {
    id: 'market_understanding_low',
    source: 'health_score',
    category: 'marketUnderstanding',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Conduct Market Research',
      description: 'Your market understanding score is {{SCORE}}/100 (threshold: {{THRESHOLD}}). Research your target market: define customer segments, identify market size, and map competitor landscape.',
      tags: ['market', 'research', 'ai-triggered'],
    },
  },
  {
    id: 'traction_proof_low',
    source: 'health_score',
    category: 'tractionProof',
    threshold: 60,
    priority: 'urgent',
    taskTemplate: {
      title: 'Build Traction Evidence',
      description: 'Your traction score is {{SCORE}}/100 (threshold: {{THRESHOLD}}). Document evidence of progress: customer conversations, pilot users, LOIs, revenue, or engagement metrics.',
      tags: ['traction', 'validation', 'ai-triggered'],
    },
  },
  {
    id: 'team_readiness_low',
    source: 'health_score',
    category: 'teamReadiness',
    threshold: 60,
    priority: 'medium',
    taskTemplate: {
      title: 'Strengthen Team Profile',
      description: 'Your team readiness score is {{SCORE}}/100 (threshold: {{THRESHOLD}}). Document your team\'s relevant experience, identify skill gaps, and consider advisors or co-founders to fill them.',
      tags: ['team', 'advisory', 'ai-triggered'],
    },
  },
  {
    id: 'investor_readiness_low',
    source: 'health_score',
    category: 'investorReadiness',
    threshold: 60,
    priority: 'medium',
    taskTemplate: {
      title: 'Prepare Investor Materials',
      description: 'Your investor readiness score is {{SCORE}}/100 (threshold: {{THRESHOLD}}). Create or update your pitch deck, executive summary, and financial projections.',
      tags: ['fundraising', 'pitch', 'ai-triggered'],
    },
  },
  {
    id: 'canvas_incomplete',
    source: 'health_score',
    category: 'canvas',
    threshold: 40,
    priority: 'medium',
    taskTemplate: {
      title: 'Complete Lean Canvas',
      description: 'Your Lean Canvas is {{SCORE}}% complete. Fill in missing sections to clarify your business model.',
      tags: ['canvas', 'planning', 'ai-triggered'],
    },
  },
  {
    id: 'pitch_not_ready',
    source: 'health_score',
    category: 'pitch',
    threshold: 30,
    priority: 'medium',
    taskTemplate: {
      title: 'Create Pitch Deck',
      description: 'Start building your investor pitch deck. Focus on problem, solution, and traction slides first.',
      tags: ['pitch', 'fundraising', 'ai-triggered'],
    },
  },

  // ---------------------------------------------------------------------------
  // VALIDATION REPORT RULES (5 rules) - matches validation_reports.report_type
  // ---------------------------------------------------------------------------
  {
    id: 'validation_market_low',
    source: 'validation_report',
    category: 'market',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Address Market Validation Gaps',
      description: 'Market validation score: {{SCORE}}/100. Key gaps identified in your market analysis. Review validation report and address specific concerns.',
      tags: ['validation', 'market', 'ai-triggered'],
    },
  },
  {
    id: 'validation_product_low',
    source: 'validation_report',
    category: 'product',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Strengthen Product Definition',
      description: 'Product validation score: {{SCORE}}/100. Your product definition needs refinement. Review validation feedback and clarify your product roadmap.',
      tags: ['validation', 'product', 'ai-triggered'],
    },
  },
  {
    id: 'validation_founder_low',
    source: 'validation_report',
    category: 'founder',
    threshold: 60,
    priority: 'medium',
    taskTemplate: {
      title: 'Highlight Founder-Market Fit',
      description: 'Founder validation score: {{SCORE}}/100. Better demonstrate your unique qualifications to solve this problem and lead this company.',
      tags: ['validation', 'team', 'ai-triggered'],
    },
  },
  {
    id: 'validation_finance_low',
    source: 'validation_report',
    category: 'finance',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Improve Financial Projections',
      description: 'Finance validation score: {{SCORE}}/100. Your financial model needs work. Review unit economics, revenue projections, and funding requirements.',
      tags: ['validation', 'finance', 'ai-triggered'],
    },
  },
  {
    id: 'validation_overall_critical',
    source: 'validation_report',
    category: 'overall',
    threshold: 50,
    priority: 'urgent',
    taskTemplate: {
      title: 'Critical: Review Validation Results',
      description: 'Overall validation score: {{SCORE}}/100. Your startup needs significant improvements across multiple areas. Schedule a strategy review session.',
      tags: ['validation', 'critical', 'ai-triggered'],
    },
  },

  // ---------------------------------------------------------------------------
  // INVESTOR SCORE RULES (2 rules)
  // ---------------------------------------------------------------------------
  {
    id: 'team_strength_low',
    source: 'investor_score',
    category: 'team',
    threshold: 60,
    priority: 'medium',
    taskTemplate: {
      title: 'Strengthen Team Advisory',
      description: 'Identify 3 industry mentors or advisors to fill experience gaps in {{GAP_AREA}}.',
      tags: ['team', 'advisory', 'ai-triggered'],
    },
  },
  {
    id: 'financials_weak',
    source: 'investor_score',
    category: 'financials',
    threshold: 70,
    priority: 'high',
    taskTemplate: {
      title: 'Update Financial Model',
      description: 'Review and update financial projections. Industry average suggests including {{BENCHMARK}} in your model.',
      tags: ['financials', 'model', 'ai-triggered'],
    },
  },

  // ---------------------------------------------------------------------------
  // READINESS SCORE RULES (2 rules)
  // ---------------------------------------------------------------------------
  {
    id: 'market_fit_low',
    source: 'readiness_score',
    category: 'market',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Conduct Customer Discovery',
      description: 'Run 10 customer interviews with {{TARGET_SEGMENT}} to validate problem-solution fit.',
      tags: ['market', 'interviews', 'ai-triggered'],
    },
  },
  {
    id: 'product_incomplete',
    source: 'readiness_score',
    category: 'product',
    threshold: 50,
    priority: 'urgent',
    taskTemplate: {
      title: 'Complete MVP Definition',
      description: 'Define and document your Minimum Viable Product scope. Focus on core value proposition.',
      tags: ['product', 'mvp', 'ai-triggered'],
    },
  },
];

// =============================================================================
// MAIN HANDLER
// =============================================================================

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Use service role for internal operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Check if using service role key (for internal/system calls)
    const isServiceRole = token === supabaseServiceKey;
    let userId = 'service_role';

    if (!isServiceRole) {
      // Validate user JWT
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      userId = user.id;
    }

    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown> ?? {};
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const action = body.action as string | undefined;

    console.log(`[workflow-trigger] Action: ${action}, User: ${userId}, ServiceRole: ${isServiceRole}`);

    let result: Record<string, unknown> = {};

    switch (action) {
      case 'process_score':
        result = await processScore(supabase, body.score_data);
        break;

      case 'process_validation_report':
        result = await processValidationReport(supabase, body.validation_run_id);
        break;

      case 'get_trigger_rules':
        result = { success: true, rules: TRIGGER_RULES, count: TRIGGER_RULES.length };
        break;

      case 'check_duplicates':
        result = await checkDuplicates(supabase, body.startup_id, body.title);
        break;

      default:
        result = { error: 'Unknown action', success: false };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[workflow-trigger] Error:', errMsg);
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Process a score and create tasks if thresholds are breached
 */
async function processScore(
  supabase: SupabaseClient,
  scoreData: ScoreData
): Promise<ProcessResult> {
  const { startup_id, org_id, source, overall_score, category_scores, context } = scoreData;

  if (!startup_id || !source) {
    return {
      success: false,
      tasks_created: 0,
      tasks_skipped: 0,
      tasks_failed: 0,
      tasks: [],
      errors: ['Missing startup_id or source']
    };
  }

  const tasksCreated: Array<{ title: string; priority: string; id?: string }> = [];
  const errors: string[] = [];
  let tasksSkipped = 0;
  let tasksFailed = 0;

  // Get applicable rules for this source
  const applicableRules = TRIGGER_RULES.filter(r => r.source === source);
  console.log(`[workflow-trigger] Found ${applicableRules.length} rules for source: ${source}`);

  for (const rule of applicableRules) {
    // Get the relevant score
    let score: number | undefined;

    if (rule.category === 'overall') {
      score = overall_score;
    } else if (category_scores) {
      score = category_scores[rule.category];
    }

    // Skip if no score for this category
    if (score === undefined) {
      console.log(`[workflow-trigger] No score for category: ${rule.category}`);
      continue;
    }

    // Check if threshold is breached
    if (score >= rule.threshold) {
      console.log(`[workflow-trigger] Score ${score} >= threshold ${rule.threshold} for ${rule.id}, skipping`);
      continue;
    }

    console.log(`[workflow-trigger] Score ${score} < threshold ${rule.threshold} for ${rule.id}, creating task`);

    // Check for duplicate task
    const isDuplicate = await checkDuplicateTask(supabase, startup_id, rule.taskTemplate.title);

    if (isDuplicate) {
      // Log skipped duplicate
      await logWorkflowActivity(supabase, {
        startupId: startup_id,
        orgId: org_id,
        eventType: 'task_skipped_duplicate',
        source,
        scoreValue: score,
        thresholdValue: rule.threshold,
        ruleId: rule.id,
        metadata: { rule_title: rule.taskTemplate.title }
      });
      tasksSkipped++;
      continue;
    }

    // Interpolate template with context
    const description = interpolateTemplate(rule.taskTemplate.description, {
      ...context,
      score,
      threshold: rule.threshold,
      SCORE: score,
      THRESHOLD: rule.threshold,
    });

    // Create the task
    const { data: task, error: insertError } = await supabase
      .from('tasks')
      .insert({
        startup_id,
        title: rule.taskTemplate.title,
        description,
        priority: rule.priority,
        status: 'pending',
        tags: rule.taskTemplate.tags,
        source: 'ai_workflow',
        ai_generated: true,
        trigger_rule_id: rule.id,
        trigger_score: score,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error(`[workflow-trigger] Insert error for rule ${rule.id}:`, insertError);
      errors.push(`Failed to create task for ${rule.id}: ${insertError.message}`);

      // Log failed task
      await logWorkflowActivity(supabase, {
        startupId: startup_id,
        orgId: org_id,
        eventType: 'task_failed',
        source,
        scoreValue: score,
        thresholdValue: rule.threshold,
        ruleId: rule.id,
        errorMessage: insertError.message,
        metadata: { rule_title: rule.taskTemplate.title }
      });
      tasksFailed++;
      continue;
    }

    // Log successful task creation
    await logWorkflowActivity(supabase, {
      startupId: startup_id,
      orgId: org_id,
      eventType: 'task_triggered',
      source,
      scoreValue: score,
      thresholdValue: rule.threshold,
      ruleId: rule.id,
      taskId: task?.id,
      metadata: { task_title: rule.taskTemplate.title, task_priority: rule.priority }
    });

    tasksCreated.push({
      title: rule.taskTemplate.title,
      priority: rule.priority,
      id: task?.id,
    });
  }

  // Log to activities table for UI visibility (using existing enum value)
  if (tasksCreated.length > 0) {
    await supabase.from('activities').insert({
      startup_id,
      activity_type: 'ai_task_suggested',
      title: `${tasksCreated.length} task(s) auto-generated from ${source}`,
      description: `AI detected low scores and created corrective action items.`,
      entity_type: 'task',
      metadata: {
        source,
        tasks_created: tasksCreated.length,
        task_titles: tasksCreated.map(t => t.title)
      },
      is_system_generated: true,
    }).then(({ error }) => {
      if (error) console.error('[workflow-trigger] Activity log error:', error);
    });
  }

  return {
    success: true,
    tasks_created: tasksCreated.length,
    tasks_skipped: tasksSkipped,
    tasks_failed: tasksFailed,
    tasks: tasksCreated,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Process a validation report and trigger tasks based on scores
 */
async function processValidationReport(
  supabase: SupabaseClient,
  validationRunId: string
): Promise<ProcessResult> {
  if (!validationRunId) {
    return {
      success: false,
      tasks_created: 0,
      tasks_skipped: 0,
      tasks_failed: 0,
      tasks: [],
      errors: ['Missing validation_run_id']
    };
  }

  // Fetch the validation run
  const { data: run, error: runError } = await supabase
    .from('validation_runs')
    .select('startup_id, org_id, status')
    .eq('id', validationRunId)
    .single();

  if (runError || !run) {
    return {
      success: false,
      tasks_created: 0,
      tasks_skipped: 0,
      tasks_failed: 0,
      tasks: [],
      errors: [`Validation run not found: ${runError?.message || 'Unknown'}`]
    };
  }

  if (run.status !== 'success') {
    return {
      success: false,
      tasks_created: 0,
      tasks_skipped: 0,
      tasks_failed: 0,
      tasks: [],
      errors: [`Validation run status is ${run.status}, not success`]
    };
  }

  // Fetch all reports for this run
  const { data: reports, error: reportsError } = await supabase
    .from('validator_reports')
    .select('report_type, score')
    .eq('run_id', validationRunId);

  if (reportsError || !reports || reports.length === 0) {
    return {
      success: false,
      tasks_created: 0,
      tasks_skipped: 0,
      tasks_failed: 0,
      tasks: [],
      errors: [`No validation reports found: ${reportsError?.message || 'Empty'}`]
    };
  }

  // Build category scores from reports
  const categoryScores: Record<string, number> = {};
  let overallScore: number | undefined;

  for (const report of reports) {
    const score = Number(report.score);
    if (isNaN(score)) continue;

    if (report.report_type === 'overall') {
      overallScore = score;
    } else {
      categoryScores[report.report_type] = score;
    }
  }

  console.log(`[workflow-trigger] Processing validation report with scores:`, { overallScore, categoryScores });

  // Process through standard score handler
  return processScore(supabase, {
    startup_id: run.startup_id,
    org_id: run.org_id,
    source: 'validation_report',
    overall_score: overallScore,
    category_scores: categoryScores,
  });
}

/**
 * Check if a similar task already exists (pending or in_progress)
 */
async function checkDuplicateTask(
  supabase: SupabaseClient,
  startupId: string,
  title: string
): Promise<boolean> {
  const { data } = await supabase
    .from('tasks')
    .select('id')
    .eq('startup_id', startupId)
    .eq('title', title)
    .in('status', ['pending', 'in_progress'])
    .limit(1);

  return (data?.length || 0) > 0;
}

/**
 * Check for duplicate tasks (exposed as action)
 */
async function checkDuplicates(
  supabase: SupabaseClient,
  startupId: string,
  title: string
): Promise<Record<string, unknown>> {
  if (!startupId || !title) {
    return { success: false, error: 'Missing startup_id or title' };
  }
  const isDuplicate = await checkDuplicateTask(supabase, startupId, title);
  return { success: true, is_duplicate: isDuplicate };
}

/**
 * Log workflow activity for audit trail
 */
async function logWorkflowActivity(
  supabase: SupabaseClient,
  data: {
    startupId: string;
    orgId?: string;
    eventType: 'score_calculated' | 'task_triggered' | 'task_skipped_duplicate' | 'task_failed';
    source: string;
    scoreValue?: number;
    thresholdValue?: number;
    ruleId?: string;
    taskId?: string;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  try {
    await supabase.from('workflow_activity_log').insert({
      startup_id: data.startupId,
      org_id: data.orgId,
      event_type: data.eventType,
      source: data.source,
      score_value: data.scoreValue,
      threshold_value: data.thresholdValue,
      rule_id: data.ruleId,
      task_id: data.taskId,
      error_message: data.errorMessage,
      metadata: data.metadata || {},
    });
  } catch (error) {
    console.error('[workflow-trigger] Activity log error:', error);
    // Non-blocking - don't fail the main operation
  }
}

/**
 * Interpolate template placeholders with context values
 * Supports: {{SCORE}}, {{THRESHOLD}}, {{GAP_AREA}}, {{BENCHMARK}}, {{TARGET_SEGMENT}}, {{RISK_FACTORS}}, {{COMPLETION}}
 */
function interpolateTemplate(
  template: string,
  context: Record<string, unknown>
): string {
  let result = template;

  const placeholders: Record<string, string> = {
    '{{SCORE}}': String(context.score ?? context.SCORE ?? '0'),
    '{{THRESHOLD}}': String(context.threshold ?? context.THRESHOLD ?? '60'),
    '{{GAP_AREA}}': String(context.gap_area ?? context.GAP_AREA ?? 'key areas'),
    '{{BENCHMARK}}': String(context.benchmark ?? context.BENCHMARK ?? 'industry-standard metrics'),
    '{{TARGET_SEGMENT}}': String(context.target_segment ?? context.TARGET_SEGMENT ?? 'target customers'),
    '{{RISK_FACTORS}}': String(context.risk_factors ?? context.RISK_FACTORS ?? 'identified risks'),
    '{{COMPLETION}}': String(context.completion ?? context.COMPLETION ?? context.score ?? '0'),
  };

  Object.entries(placeholders).forEach(([key, value]) => {
    result = result.replaceAll(key, value);
  });

  return result;
}
