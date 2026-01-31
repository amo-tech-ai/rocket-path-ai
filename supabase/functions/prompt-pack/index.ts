/**
 * Prompt Pack Edge Function
 *
 * Implements the core pack operations:
 * - search: Find best pack for module/industry/stage
 * - run_step: Execute a single step
 * - run_pack: Execute full pack
 * - apply: Write outputs to target tables
 *
 * @see tasks/00-plan/prompts/07-edge-functions.md
 * @see tasks/00-plan/prompts/25-two-layer-integration.md
 * @see knowledge/supabase/best-practices-edge/01-architecture-setup.md
 */

import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2';
import {
  getIndustryContext,
  formatContextForPrompt,
  mapActionToFeatureContext,
  type FeatureContext,
  type FundingStage,
} from '../_shared/industry-context.ts';

// ============================================================================
// CORS & RESPONSE HELPERS (per best-practices/04-error-handling.md)
// ============================================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(error: string, status: number, code?: string, details?: unknown): Response {
  console.error(`[prompt-pack] Error ${status}:`, error, details);
  return jsonResponse({ error, code, details }, status);
}

const badRequest = (msg: string, details?: unknown) => errorResponse(msg, 400, 'BAD_REQUEST', details);
const unauthorized = (msg = 'Unauthorized') => errorResponse(msg, 401, 'UNAUTHORIZED');
const notFound = (msg: string) => errorResponse(msg, 404, 'NOT_FOUND');
const serverError = (msg: string, details?: unknown) => errorResponse(msg, 500, 'SERVER_ERROR', details);

// ============================================================================
// TYPES
// ============================================================================

interface SearchRequest {
  module: string;
  industry?: string;
  stage?: string;
}

interface RunStepRequest {
  pack_id: string;
  step_id?: number;
  context: Record<string, unknown>;
  industry?: string;
  stage?: string;
}

interface RunPackRequest {
  pack_id: string;
  context: Record<string, unknown>;
  industry?: string;
  stage?: string;
}

interface ApplyOptions {
  preview_only?: boolean;
  skip_conflicts?: boolean;
  merge_arrays?: boolean;
}

interface ApplyRequest {
  outputs_json: Record<string, unknown>;
  apply_to: ('profile' | 'startup' | 'canvas' | 'slides' | 'tasks' | 'validation')[];
  org_id?: string;
  user_id?: string;
  startup_id?: string;
  deck_id?: string;
  options?: ApplyOptions;
}

const FIELD_MAP: Record<string, Record<string, string>> = {
  startup: {
    who: 'target_market',
    struggle: 'problem_statement',
    why_now: 'why_now',
    problem_one_liner: 'problem_one_liner',
    tam: 'tam_size',
    sam: 'sam_size',
    som: 'som_size',
    category: 'market_category',
    competitors: 'competitors',
    market_trends: 'market_trends',
    one_sentence_pitch: 'one_liner',
    elevator_pitch: 'elevator_pitch',
  },
  canvas: {
    uvp_short: 'unique_value_proposition',
    channels: 'channels',
    customer_segments: 'customer_segments',
    cost_structure: 'cost_structure',
    revenue_streams: 'revenue_streams',
    key_metrics: 'key_metrics',
    unfair_advantage: 'unfair_advantage',
    struggle: 'problem',
    why_now: 'metadata.why_now',
  },
};

interface PromptPack {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  stage_tags: string[];
  industry_tags: string[];
  version: number;
  is_active: boolean;
}

interface PromptPackStep {
  id: string;
  pack_id: string;
  step_order: number;
  purpose: string;
  prompt_template: string;
  input_schema: Record<string, string>;
  output_schema: Record<string, string>;
  model_preference: string;
  max_tokens: number;
  temperature: number;
}

// ============================================================================
// DATABASE HELPERS
// ============================================================================

function getSupabaseClient(authHeader?: string): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = authHeader
    ? Deno.env.get('SUPABASE_ANON_KEY')!
    : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  return createClient(url, key, {
    global: { headers: authHeader ? { Authorization: authHeader } : {} },
  });
}

async function verifyUser(supabase: SupabaseClient): Promise<{ id: string; email: string } | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { id: user.id, email: user.email || '' };
}

// ============================================================================
// PACK SEARCH
// ============================================================================

async function searchPack(
  supabase: SupabaseClient,
  { module, industry, stage }: SearchRequest
): Promise<{ pack: PromptPack; steps: PromptPackStep[] } | null> {
  console.log(`[prompt-pack] Searching for pack: module=${module}, industry=${industry}, stage=${stage}`);

  // First try feature_pack_routing table
  let packSlug: string | null = null;

  const { data: routing } = await supabase
    .from('feature_pack_routing')
    .select('default_pack_slug')
    .ilike('feature_route', `%${module}%`)
    .order('priority', { ascending: false })
    .limit(1)
    .single();

  if (routing?.default_pack_slug) {
    packSlug = routing.default_pack_slug;
  }

  // Build query for prompt_packs
  let query = supabase
    .from('prompt_packs')
    .select('*')
    .eq('is_active', true);

  if (packSlug) {
    query = query.eq('slug', packSlug);
  } else {
    // Fallback: search by category
    query = query.eq('category', module);
  }

  // Filter by industry if provided
  if (industry) {
    query = query.or(`industry_tags.cs.{${industry}},industry_tags.cs.{all}`);
  }

  // Filter by stage if provided
  if (stage) {
    query = query.contains('stage_tags', [stage]);
  }

  const { data: packs, error: packError } = await query.limit(1);

  if (packError || !packs?.length) {
    console.warn('[prompt-pack] Pack search failed:', packError?.message || 'No packs found');
    return null;
  }

  const pack = packs[0] as PromptPack;

  // Load steps
  const { data: steps, error: stepsError } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', pack.id)
    .order('step_order');

  if (stepsError) {
    console.warn('[prompt-pack] Steps load failed:', stepsError.message);
    return { pack, steps: [] };
  }

  console.log(`[prompt-pack] Found pack: ${pack.slug} with ${steps?.length || 0} steps`);
  return { pack, steps: (steps || []) as PromptPackStep[] };
}

// ============================================================================
// RUN STEP
// ============================================================================

async function runStep(
  supabase: SupabaseClient,
  userId: string,
  { pack_id, step_id, context, industry, stage }: RunStepRequest
): Promise<{ outputs: Record<string, unknown>; model: string; tokens?: number; duration_ms: number }> {
  const startTime = Date.now();
  console.log(`[prompt-pack] Running step: pack=${pack_id}, step=${step_id}, industry=${industry}`);

  // Load pack and step
  const { data: pack } = await supabase
    .from('prompt_packs')
    .select('*')
    .eq('id', pack_id)
    .single();

  if (!pack) throw new Error('Pack not found');

  let stepQuery = supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', pack_id);

  if (step_id !== undefined) {
    stepQuery = stepQuery.eq('step_order', step_id);
  } else {
    stepQuery = stepQuery.order('step_order').limit(1);
  }

  const { data: steps } = await stepQuery;
  const step = steps?.[0] as PromptPackStep | undefined;

  if (!step) throw new Error('Step not found');

  // Get industry context if industry provided
  let industryContext = '';
  if (industry) {
    const featureContext = mapActionToFeatureContext(pack.category || 'chatbot');
    const playbook = await getIndustryContext(
      industry,
      featureContext,
      stage as FundingStage,
      supabase
    );
    if (playbook) {
      industryContext = formatContextForPrompt(playbook, featureContext);
      console.log(`[prompt-pack] Injected ${industryContext.length} chars of industry context`);
    }
  }

  // Build prompt
  let prompt = step.prompt_template;

  // Replace {{INDUSTRY_CONTEXT}} placeholder
  prompt = prompt.replace('{{INDUSTRY_CONTEXT}}', industryContext);

  // Replace other context placeholders
  for (const [key, value] of Object.entries(context)) {
    const placeholder = `{{${key.toUpperCase()}}}`;
    prompt = prompt.replace(placeholder, typeof value === 'string' ? value : JSON.stringify(value));
  }

  // Call AI
  const model = step.model_preference || 'gemini';
  let outputs: Record<string, unknown> = {};
  let tokens = 0;

  if (model === 'gemini' || model === 'any') {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: step.temperature || 0.3,
            maxOutputTokens: step.max_tokens || 2000,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    const result = await response.json();

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      try {
        outputs = JSON.parse(result.candidates[0].content.parts[0].text);
      } catch {
        outputs = { raw: result.candidates[0].content.parts[0].text };
      }
    }

    tokens = result.usageMetadata?.totalTokenCount || 0;
  } else if (model === 'claude') {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: step.max_tokens || 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await response.json();

    if (result.content?.[0]?.text) {
      try {
        outputs = JSON.parse(result.content[0].text);
      } catch {
        outputs = { raw: result.content[0].text };
      }
    }

    tokens = (result.usage?.input_tokens || 0) + (result.usage?.output_tokens || 0);
  }

  const duration_ms = Date.now() - startTime;
  console.log(`[prompt-pack] Step completed in ${duration_ms}ms, ${tokens} tokens`);

  // Log to ai_runs (per best-practices/09-ai-integration.md)
  // Include tracking columns for analytics (per audit 99-tasks-playbook-audit.md)
  const serviceClient = getSupabaseClient();
  const contextTokens = industryContext ? Math.ceil(industryContext.length / 4) : null;
  const featureCtx = industry ? mapActionToFeatureContext(pack.category || 'chatbot') : null;

  await serviceClient.from('ai_runs').insert({
    user_id: userId,
    agent_name: 'prompt-pack',
    action: `run_step:${pack.slug}:${step.step_order}`,
    model,
    input_tokens: Math.floor(tokens * 0.7),
    output_tokens: Math.floor(tokens * 0.3),
    duration_ms,
    status: 'success',
    metadata: { pack_id, step_order: step.step_order, industry, stage },
    // Industry context tracking for analytics
    industry_context_used: industry || null,
    feature_context: featureCtx,
    context_tokens: contextTokens,
  });

  return { outputs, model, tokens, duration_ms };
}

// ============================================================================
// RUN PACK (ALL STEPS)
// ============================================================================

async function runPack(
  supabase: SupabaseClient,
  userId: string,
  { pack_id, context, industry, stage }: RunPackRequest
): Promise<{ outputs: Record<string, unknown>[]; total_duration_ms: number }> {
  const startTime = Date.now();
  console.log(`[prompt-pack] Running full pack: ${pack_id}`);

  // Load all steps
  const { data: steps } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', pack_id)
    .order('step_order');

  if (!steps?.length) throw new Error('No steps found for pack');

  const outputs: Record<string, unknown>[] = [];
  let runningContext = { ...context };

  // Execute steps sequentially
  for (const step of steps) {
    const result = await runStep(supabase, userId, {
      pack_id,
      step_id: step.step_order,
      context: runningContext,
      industry,
      stage,
    });

    outputs.push(result.outputs);

    // Merge outputs into context for next step
    runningContext = { ...runningContext, ...result.outputs };
  }

  const total_duration_ms = Date.now() - startTime;
  console.log(`[prompt-pack] Pack completed in ${total_duration_ms}ms`);

  return { outputs, total_duration_ms };
}

// ============================================================================
// APPLY OUTPUTS
// ============================================================================

/**
 * Field Mapping Engine (Task 3.15)
 * Transforms AI output into structured DB updates with conflict resolution.
 */
async function applyOutputs(
  supabase: SupabaseClient,
  userId: string,
  req: ApplyRequest
): Promise<{ success: boolean; results: any[] }> {
  const { outputs_json, apply_to, startup_id, deck_id, options = {} } = req;
  const results = [];

  console.log(`[prompt-pack] Apply Engine: Processing ${apply_to.length} targets for startup ${startup_id}`);

  for (const target of apply_to) {
    try {
      let result;
      switch (target) {
        case 'startup': {
          if (!startup_id) throw new Error('startup_id required');
          const mapping = FIELD_MAP.startup;
          const updateData: Record<string, any> = {};

          // Load existing for conflict resolution
          const { data: existing } = await supabase.from('startups').select('*').eq('id', startup_id).single();

          for (const [outField, dbField] of Object.entries(mapping)) {
            const newValue = outputs_json[outField];
            if (newValue === undefined) continue;

            const existingValue = existing?.[dbField];

            // Conflict Resolution
            if (existingValue && options.skip_conflicts) continue;

            if (Array.isArray(existingValue) && Array.isArray(newValue) && options.merge_arrays) {
              updateData[dbField] = Array.from(new Set([...existingValue, ...newValue]));
            } else {
              updateData[dbField] = newValue;
            }
          }

          if (Object.keys(updateData).length > 0) {
            const { error } = await supabase.from('startups').update(updateData).eq('id', startup_id);
            if (error) throw error;
            result = { target: 'startup', updated_fields: Object.keys(updateData) };
          }
          break;
        }

        case 'canvas': {
          if (!startup_id) throw new Error('startup_id required');
          const mapping = FIELD_MAP.canvas;
          const upsertData: Record<string, any> = { startup_id };

          for (const [outField, dbField] of Object.entries(mapping)) {
            const val = outputs_json[outField];
            if (val !== undefined) upsertData[dbField] = val;
          }

          const { error } = await supabase.from('lean_canvases').upsert(upsertData, { onConflict: 'startup_id' });
          if (error) throw error;
          result = { target: 'canvas', status: 'upserted' };
          break;
        }

        case 'tasks': {
          if (!startup_id) throw new Error('startup_id required');

          // Auto-trigger tasks from validation outputs
          const tasksToCreate: { title: string; priority: string; source: string }[] = [];

          if (Array.isArray(outputs_json.red_flags)) {
            outputs_json.red_flags.forEach(f => tasksToCreate.push({
              title: typeof f === 'string' ? f : (f as any).title,
              priority: 'high', source: 'critic'
            }));
          }
          if (Array.isArray(outputs_json.concerns)) {
            outputs_json.concerns.forEach(c => tasksToCreate.push({
              title: typeof c === 'string' ? c : (c as any).title,
              priority: 'medium', source: 'validation'
            }));
          }
          if (Array.isArray(outputs_json.next_steps)) {
            outputs_json.next_steps.forEach(s => tasksToCreate.push({
              title: typeof s === 'string' ? s : (s as any).action,
              priority: 'medium', source: 'playbook'
            }));
          }

          for (const t of tasksToCreate) {
            // Deduplicate by title
            const { data: exists } = await supabase.from('tasks')
              .select('id').eq('startup_id', startup_id).ilike('title', t.title).limit(1);

            if (!exists?.length) {
              await supabase.from('tasks').insert({
                title: t.title,
                priority: t.priority,
                ai_source: t.source,
                ai_generated: true,
                startup_id,
                user_id: userId
              });
            }
          }
          result = { target: 'tasks', created: tasksToCreate.length };
          break;
        }

        case 'validation': {
          if (!startup_id) throw new Error('startup_id required');

          // 1. Ensure a validation run exists
          let runId = outputs_json.run_id as string || outputs_json.validation_run_id as string;

          if (!runId) {
            const { data: run, error: runError } = await supabase.from('validation_runs').insert({
              startup_id,
              org_id: (await supabase.from('startups').select('org_id').eq('id', startup_id).single()).data?.org_id,
              validation_type: 'quick',
              status: 'success',
              metadata: { source: 'prompt_pack_apply' }
            }).select('id').single();

            if (runError) throw runError;
            runId = run.id;
          }

          // 2. Insert report
          const { error } = await supabase.from('validation_reports').insert({
            run_id: runId,
            score: outputs_json.score || outputs_json.readiness_score || 0,
            summary: outputs_json.verdict || outputs_json.summary || 'Insight applied',
            details: outputs_json,
            report_type: (outputs_json.report_type as any) || 'overall'
          });

          if (error) throw error;
          result = { target: 'validation', status: 'created', run_id: runId };
          break;
        }

        case 'slides': {
          const deckId = deck_id || (outputs_json.deck_id as string);
          if (!deckId) throw new Error('deck_id required');
          const slides = (outputs_json.slides as any[]) || [];

          for (const s of slides) {
            await supabase.from('pitch_deck_slides').upsert({
              deck_id: deckId,
              slide_number: s.slide_number || s.order,
              title: s.title,
              content: s.content,
              notes: s.notes,
              slide_type: s.slide_type || 'content'
            }, { onConflict: 'deck_id,slide_number' });
          }
          result = { target: 'slides', updated: slides.length };
          break;
        }
      }
      if (result) results.push(result);
    } catch (err) {
      console.error(`[prompt-pack] Apply failed for target ${target}:`, err);
      results.push({ target, error: (err as Error).message });
    }
  }

  return { success: true, results };
}

// ============================================================================
// MAIN HANDLER (per best-practices/01-architecture-setup.md)
// ============================================================================

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return unauthorized('Missing authorization header');
    }

    const supabase = getSupabaseClient(authHeader);

    // Verify user
    const user = await verifyUser(supabase);
    if (!user) {
      return unauthorized('Invalid or missing authentication');
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return badRequest('Invalid JSON in request body');
    }

    const { action, ...payload } = body;

    if (!action) {
      return badRequest('Missing action parameter');
    }

    console.log(`[prompt-pack] Action: ${action}, User: ${user.id}`);

    // Route to handler
    switch (action) {
      case 'search': {
        const { module, industry, stage } = payload as SearchRequest;
        if (!module) return badRequest('Missing module parameter');

        const result = await searchPack(supabase, { module, industry, stage });
        if (!result) return notFound('No matching pack found');

        return jsonResponse({
          pack_id: result.pack.id,
          pack_slug: result.pack.slug,
          pack_title: result.pack.title,
          steps: result.steps.map((s) => ({
            step_order: s.step_order,
            purpose: s.purpose,
            model: s.model_preference,
          })),
        });
      }

      case 'run_step': {
        const { pack_id, step_id, context, industry, stage } = payload as RunStepRequest;
        if (!pack_id) return badRequest('Missing pack_id');
        if (!context) return badRequest('Missing context');

        const result = await runStep(supabase, user.id, {
          pack_id,
          step_id,
          context,
          industry,
          stage,
        });

        return jsonResponse(result);
      }

      case 'run_pack': {
        const { pack_id, context, industry, stage } = payload as RunPackRequest;
        if (!pack_id) return badRequest('Missing pack_id');
        if (!context) return badRequest('Missing context');

        const result = await runPack(supabase, user.id, {
          pack_id,
          context,
          industry,
          stage,
        });

        return jsonResponse(result);
      }

      case 'apply': {
        const { outputs_json, apply_to, org_id, user_id, startup_id, deck_id, options } = payload as ApplyRequest;
        if (!outputs_json) return badRequest('Missing outputs_json');
        if (!apply_to || !Array.isArray(apply_to)) return badRequest('Missing apply_to (must be an array)');

        const result = await applyOutputs(supabase, user.id, {
          outputs_json,
          apply_to,
          org_id,
          user_id,
          startup_id,
          deck_id,
          options,
        });

        return jsonResponse(result);
      }

      default:
        return badRequest(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('[prompt-pack] Unhandled error:', error);
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
});
