/**
 * @deprecated Use prompt-pack with action "apply" or "preview" instead.
 * POST /functions/v1/prompt-pack { "action": "apply"|"preview", "startup_id", "outputs_json", ... }
 *
 * Prompt Pack Apply Edge Function
 *
 * Apply prompt pack outputs to database tables (startup profile, canvas, slides, tasks).
 * Actions: apply | preview
 * @endpoint POST /functions/v1/prompt-pack-apply
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, getCorsHeaders } from '../_shared/cors.ts';

// =============================================================================
// Types
// =============================================================================

type ApplyTarget = 'profile' | 'canvas' | 'slides' | 'tasks' | 'score' | 'memory' | 'validation';

interface ApplyRequest {
  action: 'apply' | 'preview';
  startup_id: string;
  run_id?: string;
  outputs_json: Record<string, unknown>;
  apply_to?: ApplyTarget[];
}

interface ApplyResult {
  table: string;
  action: 'insert' | 'update' | 'upsert';
  count: number;
  ids?: string[];
}

// =============================================================================
// Apply Functions
// =============================================================================

async function applyToProfile(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  const profileUpdates: Record<string, unknown> = {};

  // Map output fields to startup columns (using actual column names from schema)
  const fieldMappings: Record<string, string> = {
    // ICP/target customer mappings
    icp: 'target_market',
    target_customer: 'target_market',
    target_market: 'target_market',

    // Problem/solution mappings
    problem: 'problem_statement',
    problem_statement: 'problem_statement',
    solution: 'solution_description',
    solution_description: 'solution_description',

    // UVP mappings (actual column is unique_value)
    uvp: 'unique_value',
    unique_value_proposition: 'unique_value',
    unique_value: 'unique_value',

    // Name/tagline mappings (actual columns are name, tagline)
    one_liner: 'tagline',
    tagline: 'tagline',
    company_name: 'name',
    startup_name: 'name',

    // Standard fields
    industry: 'industry',
    stage: 'stage',
    description: 'description',

    // Business model (array field)
    business_model: 'business_model',
    pricing_model: 'pricing_model',
  };

  for (const [outputKey, dbColumn] of Object.entries(fieldMappings)) {
    if (outputs[outputKey] !== undefined && outputs[outputKey] !== null) {
      profileUpdates[dbColumn] = outputs[outputKey];
    }
  }

  if (Object.keys(profileUpdates).length === 0) {
    return null;
  }

  profileUpdates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('startups')
    .update(profileUpdates)
    .eq('id', startupId);

  if (error) {
    console.error('Profile update error:', error);
    return null;
  }

  return {
    table: 'startups',
    action: 'update',
    count: Object.keys(profileUpdates).length - 1, // Exclude updated_at
  };
}

async function applyToCanvas(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  // Check for canvas data in outputs
  const canvasData = outputs.canvas as Record<string, unknown> || outputs;

  // Required canvas fields
  const canvasFields = [
    'problem', 'customer_segments', 'unique_value_proposition', 'solution',
    'channels', 'revenue_streams', 'cost_structure', 'key_metrics', 'unfair_advantage'
  ];

  // Check if we have any canvas fields
  const hasCanvasData = canvasFields.some(field => canvasData[field] !== undefined);
  if (!hasCanvasData) {
    return null;
  }

  // Check for existing canvas
  const { data: existingCanvas } = await supabase
    .from('lean_canvases')
    .select('id')
    .eq('startup_id', startupId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const canvasPayload: Record<string, unknown> = {
    startup_id: startupId,
    updated_at: new Date().toISOString(),
  };

  // Map canvas fields
  for (const field of canvasFields) {
    if (canvasData[field] !== undefined) {
      canvasPayload[field] = canvasData[field];
    }
  }

  // Additional fields
  if (canvasData.overall_score !== undefined) {
    canvasPayload.validation_score = canvasData.overall_score;
  }

  if (existingCanvas) {
    const { error } = await supabase
      .from('lean_canvases')
      .update(canvasPayload)
      .eq('id', existingCanvas.id);

    if (error) {
      console.error('Canvas update error:', error);
      return null;
    }

    return { table: 'lean_canvases', action: 'update', count: 1, ids: [existingCanvas.id] };
  } else {
    canvasPayload.created_at = new Date().toISOString();

    const { data: newCanvas, error } = await supabase
      .from('lean_canvases')
      .insert(canvasPayload)
      .select('id')
      .single();

    if (error) {
      console.error('Canvas insert error:', error);
      return null;
    }

    return { table: 'lean_canvases', action: 'insert', count: 1, ids: [newCanvas?.id] };
  }
}

async function applyToSlides(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  const slides = outputs.slides as Array<Record<string, unknown>> | undefined;

  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    return null;
  }

  // First, find or create a pitch_deck for this startup
  let deckId: string;

  const { data: existingDeck } = await supabase
    .from('pitch_decks')
    .select('id')
    .eq('startup_id', startupId)
    .eq('status', 'draft')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existingDeck) {
    deckId = existingDeck.id;
  } else {
    // Create a new deck
    const { data: newDeck, error: deckError } = await supabase
      .from('pitch_decks')
      .insert({
        startup_id: startupId,
        status: 'draft',
        deck_type: 'investor',
        metadata: {
          source: 'prompt_pack',
          generated_at: new Date().toISOString(),
        },
      })
      .select('id')
      .single();

    if (deckError || !newDeck) {
      console.error('Failed to create deck:', deckError);
      return null;
    }
    deckId = newDeck.id;
  }

  let insertedCount = 0;
  const insertedIds: string[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // Map slide type to enum value
    const slideType = (slide.type || slide.slide_type || 'custom') as string;

    const slidePayload = {
      deck_id: deckId,
      slide_type: slideType,
      slide_number: slide.order || slide.order_index || i + 1,
      title: slide.title || '',
      subtitle: slide.subtitle || null,
      content: slide.content || slide.bullets || slide.bullet_points || null,
      notes: slide.notes || slide.speaker_notes || null,
      layout: slide.layout || 'default',
      updated_at: new Date().toISOString(),
    };

    // Try upsert on deck_id + slide_number
    const { data, error } = await supabase
      .from('pitch_deck_slides')
      .upsert(slidePayload, { onConflict: 'deck_id,slide_number' })
      .select('id')
      .single();

    if (!error && data) {
      insertedCount++;
      insertedIds.push(data.id);
    } else if (error) {
      // If upsert fails (no unique constraint), try insert
      const { data: insertData, error: insertError } = await supabase
        .from('pitch_deck_slides')
        .insert(slidePayload)
        .select('id')
        .single();

      if (!insertError && insertData) {
        insertedCount++;
        insertedIds.push(insertData.id);
      }
    }
  }

  if (insertedCount === 0) {
    return null;
  }

  return { table: 'pitch_deck_slides', action: 'upsert', count: insertedCount, ids: insertedIds };
}

async function applyToTasks(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>,
  runId?: string
): Promise<ApplyResult | null> {
  const tasks = outputs.tasks as Array<Record<string, unknown>> | undefined;
  const nextSteps = outputs.next_steps as string[] | undefined;
  const conditions = outputs.conditions as Array<Record<string, unknown>> | undefined;

  const taskItems: Array<Record<string, unknown>> = [];

  // Extract from tasks array
  if (tasks && Array.isArray(tasks)) {
    for (const task of tasks) {
      taskItems.push({
        title: task.title || task.task || '',
        description: task.description || '',
        category: task.category || 'validation',
        priority: task.priority || 'medium',
      });
    }
  }

  // Extract from next_steps array
  if (nextSteps && Array.isArray(nextSteps)) {
    for (const step of nextSteps) {
      taskItems.push({
        title: step,
        description: '',
        category: 'action',
        priority: 'medium',
      });
    }
  }

  // Extract from conditions array
  if (conditions && Array.isArray(conditions)) {
    for (const condition of conditions) {
      if (condition.task) {
        const taskInfo = condition.task as Record<string, unknown>;
        taskItems.push({
          title: taskInfo.title || condition.title || '',
          description: taskInfo.description || condition.required_outcome || '',
          category: 'condition',
          priority: condition.priority || 'high',
        });
      }
    }
  }

  if (taskItems.length === 0) {
    return null;
  }

  let insertedCount = 0;
  const insertedIds: string[] = [];

  for (const task of taskItems) {
    if (!task.title) continue;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        startup_id: startupId,
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: 'pending',
        ai_generated: true,
        ai_source: runId ? `prompt_pack:${runId}` : 'prompt_pack',
      })
      .select('id')
      .single();

    if (!error && data) {
      insertedCount++;
      insertedIds.push(data.id);
    }
  }

  if (insertedCount === 0) {
    return null;
  }

  return { table: 'tasks', action: 'insert', count: insertedCount, ids: insertedIds };
}

async function applyToScore(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  const updates: Record<string, unknown> = {};

  // Look for various score fields
  if (outputs.readiness_score !== undefined) {
    updates.readiness_score = outputs.readiness_score;
  }
  if (outputs.overall_score !== undefined) {
    updates.readiness_score = outputs.overall_score;
  }
  if (outputs.validation_score !== undefined) {
    updates.readiness_score = outputs.validation_score;
  }

  // Rationale/recommendation
  if (outputs.readiness_rationale !== undefined) {
    updates.readiness_rationale = outputs.readiness_rationale;
  }
  if (outputs.recommendation !== undefined) {
    updates.readiness_rationale = outputs.recommendation;
  }

  // Verdict
  if (outputs.verdict !== undefined) {
    updates.validation_verdict = outputs.verdict;
  }

  if (Object.keys(updates).length === 0) {
    return null;
  }

  updates.readiness_updated_at = new Date().toISOString();
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('startups')
    .update(updates)
    .eq('id', startupId);

  if (error) {
    console.error('Score update error:', error);
    return null;
  }

  return { table: 'startups.readiness', action: 'update', count: Object.keys(updates).length - 2 };
}

async function applyToMemory(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>,
  runId?: string
): Promise<ApplyResult | null> {
  // Store summary or key insights in memory for RAG
  const content = outputs.summary as string ||
    (outputs.key_insights ? JSON.stringify(outputs.key_insights) : null);

  if (!content) {
    return null;
  }

  const { data, error } = await supabase
    .from('startup_memory')
    .insert({
      startup_id: startupId,
      entity_type: 'prompt_output',
      entity_id: runId || null,
      content,
      source: runId ? `prompt_run:${runId}` : 'prompt_pack',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Memory insert error:', error);
    return null;
  }

  return { table: 'startup_memory', action: 'insert', count: 1, ids: [data?.id] };
}

async function applyToValidation(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  userId: string | null,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  // Check if this looks like validation output
  const hasValidationData = outputs.overall_score !== undefined ||
    outputs.verdict !== undefined ||
    outputs.scores !== undefined;

  if (!hasValidationData) {
    return null;
  }

  const scores = outputs.scores as Record<string, unknown> || {};

  const validationPayload = {
    user_id: userId,
    startup_id: startupId,
    idea_description: outputs.idea_description || '',
    overall_score: outputs.overall_score || outputs.validation_score || null,
    problem_score: scores.problem || scores.problem_clarity || null,
    market_score: scores.market || scores.market_size || null,
    competition_score: scores.competition || null,
    solution_score: scores.solution || scores.solution_fit || null,
    business_score: scores.business || scores.business_model || null,
    execution_score: scores.execution || null,
    blue_ocean_score: outputs.blue_ocean_score || null,
    risk_adjustment: outputs.risk_deduction || outputs.total_deduction || 0,
    verdict: outputs.verdict || null,
    confidence: outputs.confidence || null,
    report_data: outputs,
    input_data: outputs.input_data || {},
    conditions: outputs.conditions || [],
    validation_type: 'prompt_pack',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('validation_reports')
    .insert(validationPayload)
    .select('id')
    .single();

  if (error) {
    console.error('Validation insert error:', error);
    return null;
  }

  return { table: 'validation_reports', action: 'insert', count: 1, ids: [data?.id] };
}

// =============================================================================
// Handlers
// =============================================================================

async function handleApply(
  supabase: ReturnType<typeof createClient>,
  params: ApplyRequest,
  userId: string | null,
  preview: boolean = false
): Promise<Response> {
  const { startup_id, run_id, outputs_json, apply_to } = params;

  // Default targets if not specified
  const targets: ApplyTarget[] = apply_to || ['profile', 'canvas', 'slides', 'tasks', 'score'];

  const applied: ApplyResult[] = [];
  const errors: string[] = [];

  // Process each target
  for (const target of targets) {
    try {
      let result: ApplyResult | null = null;

      if (preview) {
        // In preview mode, just indicate what would be applied
        switch (target) {
          case 'profile':
            if (outputs_json.icp || outputs_json.problem || outputs_json.solution || outputs_json.uvp) {
              result = { table: 'startups', action: 'update', count: 1 };
            }
            break;
          case 'canvas':
            if (outputs_json.canvas || outputs_json.problem || outputs_json.customer_segments) {
              result = { table: 'lean_canvases', action: 'upsert', count: 1 };
            }
            break;
          case 'slides':
            const slides = outputs_json.slides as unknown[];
            if (slides?.length) {
              result = { table: 'pitch_deck_slides', action: 'upsert', count: slides.length };
            }
            break;
          case 'tasks':
            const tasks = outputs_json.tasks as unknown[];
            const nextSteps = outputs_json.next_steps as unknown[];
            const count = (tasks?.length || 0) + (nextSteps?.length || 0);
            if (count > 0) {
              result = { table: 'tasks', action: 'insert', count };
            }
            break;
          case 'score':
            if (outputs_json.readiness_score || outputs_json.overall_score || outputs_json.verdict) {
              result = { table: 'startups.readiness', action: 'update', count: 1 };
            }
            break;
          case 'memory':
            if (outputs_json.summary || outputs_json.key_insights) {
              result = { table: 'startup_memory', action: 'insert', count: 1 };
            }
            break;
          case 'validation':
            if (outputs_json.overall_score || outputs_json.verdict) {
              result = { table: 'validation_reports', action: 'insert', count: 1 };
            }
            break;
        }
      } else {
        // Actually apply the changes
        switch (target) {
          case 'profile':
            result = await applyToProfile(supabase, startup_id, outputs_json);
            break;
          case 'canvas':
            result = await applyToCanvas(supabase, startup_id, outputs_json);
            break;
          case 'slides':
            result = await applyToSlides(supabase, startup_id, outputs_json);
            break;
          case 'tasks':
            result = await applyToTasks(supabase, startup_id, outputs_json, run_id);
            break;
          case 'score':
            result = await applyToScore(supabase, startup_id, outputs_json);
            break;
          case 'memory':
            result = await applyToMemory(supabase, startup_id, outputs_json, run_id);
            break;
          case 'validation':
            result = await applyToValidation(supabase, startup_id, userId, outputs_json);
            break;
        }
      }

      if (result) {
        applied.push(result);
      }
    } catch (error) {
      errors.push(`${target}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const totalRecords = applied.reduce((sum, a) => sum + a.count, 0);

  return new Response(
    JSON.stringify({
      success: errors.length === 0,
      preview,
      applied,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        tables_updated: applied.length,
        total_records: totalRecords,
      },
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// =============================================================================
// Main Handler
// =============================================================================

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const origin = req.headers.get('origin');
  const responseHeaders = getCorsHeaders(origin);

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authorization' }),
        { status: 401, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json() as ApplyRequest;
    const { action = 'apply' } = body;

    // Validate required fields
    if (!body.startup_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'startup_id is required' }),
        { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.outputs_json || typeof body.outputs_json !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'outputs_json is required and must be an object' }),
        { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Route to handler
    switch (action) {
      case 'apply':
        return await handleApply(supabase, body, user.id, false);

      case 'preview':
        return await handleApply(supabase, body, user.id, true);

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Apply error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
