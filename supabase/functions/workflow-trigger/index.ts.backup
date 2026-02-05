import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Workflow Trigger System (Score-to-Task Automation)
 * 
 * Automatically creates corrective tasks when validation scores fall below thresholds.
 * Logic: Score < threshold → Generate specific action items for the founder.
 * 
 * Actions:
 * - process_score: Evaluate score and create tasks if needed
 * - get_trigger_rules: Return the active trigger rules
 * - check_duplicates: Verify if similar task already exists
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version',
};

// Trigger rules configuration
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

const TRIGGER_RULES: TriggerRule[] = [
  // Investor Score Rules
  {
    id: 'team_strength_low',
    source: 'investor_score',
    category: 'team',
    threshold: 60,
    priority: 'medium',
    taskTemplate: {
      title: 'Strengthen Team Advisory',
      description: 'Identify 3 industry mentors or advisors to fill experience gaps in {{GAP_AREA}}.',
      tags: ['team', 'advisory', 'ai-generated'],
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
      tags: ['financials', 'model', 'ai-generated'],
    },
  },
  // Readiness Score Rules
  {
    id: 'market_fit_low',
    source: 'readiness_score',
    category: 'market',
    threshold: 60,
    priority: 'high',
    taskTemplate: {
      title: 'Conduct Customer Discovery',
      description: 'Run 10 customer interviews with {{TARGET_SEGMENT}} to validate problem-solution fit.',
      tags: ['market', 'interviews', 'ai-generated'],
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
      tags: ['product', 'mvp', 'ai-generated'],
    },
  },
  // Validation Report Rules
  {
    id: 'overall_risk_high',
    source: 'validation_report',
    category: 'overall',
    threshold: 50,
    priority: 'urgent',
    taskTemplate: {
      title: 'Schedule Strategy Review',
      description: 'High risk detected in validation. Schedule a strategy review to address: {{RISK_FACTORS}}.',
      tags: ['strategy', 'risk', 'ai-generated'],
    },
  },
  // Health Score Rules
  {
    id: 'canvas_incomplete',
    source: 'health_score',
    category: 'canvas',
    threshold: 40,
    priority: 'medium',
    taskTemplate: {
      title: 'Complete Lean Canvas',
      description: 'Your Lean Canvas is {{COMPLETION}}% complete. Fill in missing sections to clarify your business model.',
      tags: ['canvas', 'planning', 'ai-generated'],
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
      tags: ['pitch', 'fundraising', 'ai-generated'],
    },
  },
];

interface ScoreData {
  startup_id: string;
  source: TriggerRule['source'];
  overall_score?: number;
  category_scores?: Record<string, number>;
  context?: Record<string, unknown>;
}

interface TaskInput {
  startup_id: string;
  title: string;
  description: string;
  priority: string;
  tags: string[];
  source_score_id?: string;
  source_type?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization');

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action } = body;

    console.log(`[workflow-trigger] Action: ${action}, User: ${user.id}`);

    let result: Record<string, unknown> = {};

    switch (action) {
      case 'process_score':
        result = await processScore(supabase, body.score_data);
        break;

      case 'get_trigger_rules':
        result = { success: true, rules: TRIGGER_RULES };
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

/**
 * Process a score and create tasks if thresholds are breached
 */
async function processScore(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  scoreData: ScoreData
): Promise<Record<string, unknown>> {
  const { startup_id, source, overall_score, category_scores, context } = scoreData;
  
  if (!startup_id || !source) {
    return { error: 'Missing startup_id or source', success: false };
  }

  const triggeredTasks: TaskInput[] = [];
  const applicableRules = TRIGGER_RULES.filter(r => r.source === source);

  for (const rule of applicableRules) {
    // Get the relevant score
    let score: number | undefined;
    
    if (rule.category === 'overall') {
      score = overall_score;
    } else if (category_scores) {
      score = category_scores[rule.category];
    }

    // Skip if no score for this category
    if (score === undefined) continue;

    // Check if threshold is breached
    if (score < rule.threshold) {
      // Check for duplicate task
      const isDuplicate = await checkDuplicateTask(
        supabase,
        startup_id,
        rule.taskTemplate.title
      );

      if (!isDuplicate) {
        // Interpolate template with context
        const description = interpolateTemplate(
          rule.taskTemplate.description,
          { ...context, score, threshold: rule.threshold }
        );

        triggeredTasks.push({
          startup_id,
          title: rule.taskTemplate.title,
          description,
          priority: rule.priority,
          tags: rule.taskTemplate.tags,
          source_type: source,
        });
      }
    }
  }

  // Create the tasks
  if (triggeredTasks.length > 0) {
    const { error: insertError } = await supabase
      .from('tasks')
      .insert(triggeredTasks.map(task => ({
        startup_id: task.startup_id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: task.tags,
        status: 'pending',
        source: 'ai_workflow',
        ai_generated: true,
      })));

    if (insertError) {
      console.error('[workflow-trigger] Insert error:', insertError);
      return { error: insertError.message, success: false };
    }

    // Log activity
    await supabase.from('activities').insert({
      startup_id,
      activity_type: 'task_created',
      title: `${triggeredTasks.length} task(s) auto-generated from ${source}`,
      description: `AI detected low scores and created corrective action items.`,
      is_system_generated: true,
    });
  }

  return {
    success: true,
    tasks_created: triggeredTasks.length,
    tasks: triggeredTasks.map(t => ({ title: t.title, priority: t.priority })),
  };
}

/**
 * Check if a similar task already exists
 */
async function checkDuplicateTask(
  // deno-lint-ignore no-explicit-any
  supabase: any,
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
  // deno-lint-ignore no-explicit-any
  supabase: any,
  startupId: string,
  title: string
): Promise<Record<string, unknown>> {
  const isDuplicate = await checkDuplicateTask(supabase, startupId, title);
  return { success: true, is_duplicate: isDuplicate };
}

/**
 * Interpolate template placeholders with context values
 */
function interpolateTemplate(
  template: string,
  context: Record<string, unknown>
): string {
  let result = template;
  
  // Replace known placeholders
  const placeholders: Record<string, string> = {
    '{{GAP_AREA}}': String(context.gap_area || 'key areas'),
    '{{BENCHMARK}}': String(context.benchmark || 'industry-standard metrics'),
    '{{TARGET_SEGMENT}}': String(context.target_segment || 'target customers'),
    '{{RISK_FACTORS}}': String(context.risk_factors || 'identified risks'),
    '{{COMPLETION}}': String(context.completion || context.score || '0'),
  };
  
  Object.entries(placeholders).forEach(([key, value]) => {
    result = result.replace(key, value);
  });
  
  return result;
}
