import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Production-ready CORS headers supporting multiple origins
const ALLOWED_ORIGINS = [
  'https://rocket-path-ai.lovable.app',
  'https://startupai.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

interface PromptPackRequest {
  action: string;
  limit?: number;
  category?: string;
  industry?: string;
  stage?: string;
  module?: string;
  pack_id?: string;
  slug?: string;
  startup_id?: string;
  step_id?: string;
  context?: Record<string, unknown>;
  previous_outputs?: Record<string, unknown>;
  stop_on_error?: boolean;
  outputs_json?: Record<string, unknown>;
  apply_to?: string[];
  run_id?: string;
}

interface PromptPack {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  stage_tags: string[] | null;
  industry_tags: string[] | null;
  version: number;
  is_active: boolean;
  source: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface PromptPackStep {
  id: string;
  pack_id: string;
  step_order: number;
  purpose: string;
  prompt_template: string;
  input_schema: Record<string, unknown> | null;
  output_schema: Record<string, unknown>;
  model_preference: string | null;
  max_tokens: number | null;
  temperature: number | null;
}

// deno-lint-ignore no-explicit-any
type SupabaseClientType = SupabaseClient<any, any, any>;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    const body: PromptPackRequest = await req.json();
    const { action } = body;

    console.log(`[PromptPack] Action: ${action}`, JSON.stringify(body).substring(0, 200));

    switch (action) {
      case 'list':
        return await handleList(supabase, body, corsHeaders);
      case 'search':
        return await handleSearch(supabase, body, corsHeaders);
      case 'get':
        return await handleGet(supabase, body, corsHeaders);
      case 'run_step':
        return await handleRunStep(supabase, body, corsHeaders);
      case 'run_pack':
        return await handleRunPack(supabase, body, corsHeaders);
      case 'preview':
        return await handlePreview(supabase, body, corsHeaders);
      case 'apply':
        return await handleApply(supabase, body, corsHeaders);
      default:
        return jsonResponse({ error: `Unknown action: ${action}` }, 400, corsHeaders);
    }
  } catch (error) {
    console.error('[PromptPack] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: 'Internal server error', details: message }, 500, getCorsHeaders(req.headers.get('origin')));
  }
});

async function handleList(
  supabase: SupabaseClientType,
  body: PromptPackRequest,
  corsHeaders: Record<string, string>
) {
  const limit = body.limit || 20;

  const { data: packs, error } = await supabase
    .from('prompt_packs')
    .select('id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata, created_at, updated_at')
    .eq('is_active', true)
    .order('version', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[PromptPack] List error:', error);
    return jsonResponse({ error: error.message }, 500, corsHeaders);
  }

  const packsList = (packs || []) as PromptPack[];
  const byCategory: Record<string, PromptPack[]> = {};
  for (const pack of packsList) {
    if (!byCategory[pack.category]) {
      byCategory[pack.category] = [];
    }
    byCategory[pack.category].push(pack);
  }

  return jsonResponse({
    packs: packsList,
    by_category: byCategory,
    total: packsList.length,
  }, 200, corsHeaders);
}

async function handleSearch(
  supabase: SupabaseClientType,
  body: PromptPackRequest,
  corsHeaders: Record<string, string>
) {
  const { category, industry, stage, module, limit = 5 } = body;

  let query = supabase
    .from('prompt_packs')
    .select('id, title, slug, description, category, stage_tags, industry_tags, version, is_active, metadata')
    .eq('is_active', true);

  if (category) query = query.eq('category', category);
  if (module) query = query.eq('category', module);
  if (industry) query = query.contains('industry_tags', [industry]);
  if (stage) query = query.contains('stage_tags', [stage]);

  const { data: packs, error } = await query.limit(limit);

  if (error) {
    console.error('[PromptPack] Search error:', error);
    return jsonResponse({ error: error.message }, 500, corsHeaders);
  }

  const packsList = (packs || []) as PromptPack[];
  let nextStep = null;
  if (packsList.length > 0) {
    const { data: steps } = await supabase
      .from('prompt_pack_steps')
      .select('id, step_order, purpose, prompt_template, output_schema, model_preference, temperature')
      .eq('pack_id', packsList[0].id)
      .order('step_order')
      .limit(1);
    
    nextStep = steps?.[0] || null;
  }

  return jsonResponse({
    pack: packsList[0] || null,
    next_step: nextStep,
    alternatives: packsList.slice(1),
    meta: {
      query: { category, industry, stage, module },
      total_alternatives: packsList.length - 1,
    },
  }, 200, corsHeaders);
}

async function handleGet(
  supabase: SupabaseClientType,
  body: PromptPackRequest,
  corsHeaders: Record<string, string>
) {
  const { pack_id, slug } = body;

  if (!pack_id && !slug) {
    return jsonResponse({ error: 'pack_id or slug required' }, 400, corsHeaders);
  }

  let query = supabase.from('prompt_packs').select('*');
  if (pack_id) query = query.eq('id', pack_id);
  else if (slug) query = query.eq('slug', slug);

  const { data: pack, error } = await query.maybeSingle();

  if (error) {
    console.error('[PromptPack] Get error:', error);
    return jsonResponse({ error: error.message }, 500, corsHeaders);
  }
  if (!pack) {
    return jsonResponse({ error: 'Pack not found' }, 404, corsHeaders);
  }

  const packData = pack as PromptPack;
  const { data: steps } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', packData.id)
    .order('step_order');

  const stepsList = (steps || []) as PromptPackStep[];

  return jsonResponse({
    pack: { ...packData, steps: stepsList },
    step_count: stepsList.length,
  }, 200, corsHeaders);
}

async function handleRunStep(
  supabase: SupabaseClientType,
  body: PromptPackRequest,
  corsHeaders: Record<string, string>
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
  }

  const { startup_id, pack_id, step_id, context, previous_outputs } = body;
  if (!startup_id || !pack_id || !step_id) {
    return jsonResponse({ error: 'startup_id, pack_id, and step_id required' }, 400, corsHeaders);
  }

  const { data: step, error: stepError } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('id', step_id)
    .maybeSingle();

  if (stepError || !step) {
    return jsonResponse({ error: 'Step not found' }, 404, corsHeaders);
  }

  const stepData = step as PromptPackStep;
  const { data: startup } = await supabase.from('startups').select('*').eq('id', startup_id).maybeSingle();

  const startTime = Date.now();
  const prompt = buildPromptFromTemplate(stepData.prompt_template, {
    startup,
    context: context || {},
    previous_outputs: previous_outputs || {},
  });

  const result = await callGemini(
    stepData.model_preference || 'gemini-2.0-flash',
    prompt,
    stepData.temperature || 0.7,
    stepData.max_tokens || 2048
  );

  const latencyMs = Date.now() - startTime;
  const costUsd = calculateCost(result.inputTokens, result.outputTokens);

  const { data: runRecord } = await supabase
    .from('prompt_runs')
    .insert({
      startup_id,
      user_id: user.id,
      pack_id,
      step_id,
      inputs_json: { context, previous_outputs },
      outputs_json: result.outputs,
      model_used: stepData.model_preference || 'gemini-2.0-flash',
      tokens_input: result.inputTokens,
      tokens_output: result.outputTokens,
      cost_usd: costUsd,
      latency_ms: latencyMs,
      status: result.error ? 'error' : 'completed',
      error_message: result.error,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle();

  return jsonResponse({
    success: !result.error,
    outputs: result.outputs,
    tokens: { input: result.inputTokens, output: result.outputTokens },
    cost_usd: costUsd,
    latency_ms: latencyMs,
    run_id: runRecord?.id,
    error: result.error,
  }, result.error ? 500 : 200, corsHeaders);
}

async function handleRunPack(
  supabase: SupabaseClientType,
  body: PromptPackRequest,
  corsHeaders: Record<string, string>
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
  }

  const { startup_id, pack_id, context, stop_on_error = true } = body;
  if (!startup_id || !pack_id) {
    return jsonResponse({ error: 'startup_id and pack_id required' }, 400, corsHeaders);
  }

  const { data: steps, error: stepsError } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', pack_id)
    .order('step_order');

  if (stepsError || !steps?.length) {
    return jsonResponse({ error: 'No steps found for pack' }, 404, corsHeaders);
  }

  const stepsList = steps as PromptPackStep[];
  const { data: startup } = await supabase.from('startups').select('*').eq('id', startup_id).maybeSingle();

  const results: Array<{
    step_id: string;
    step_order: number;
    purpose: string;
    success: boolean;
    outputs: Record<string, unknown>;
    tokens: { input: number; output: number };
    cost_usd: number;
    latency_ms: number;
  }> = [];

  let prevOutputs: Record<string, unknown> = {};
  let totalCost = 0;
  let totalLatency = 0;
  let totalTokens = { input: 0, output: 0 };

  for (const step of stepsList) {
    const startTime = Date.now();
    const prompt = buildPromptFromTemplate(step.prompt_template, {
      startup,
      context: context || {},
      previous_outputs: prevOutputs,
    });

    const result = await callGemini(
      step.model_preference || 'gemini-2.0-flash',
      prompt,
      step.temperature || 0.7,
      step.max_tokens || 2048
    );

    const latencyMs = Date.now() - startTime;
    const costUsd = calculateCost(result.inputTokens, result.outputTokens);

    results.push({
      step_id: step.id,
      step_order: step.step_order,
      purpose: step.purpose,
      success: !result.error,
      outputs: result.outputs,
      tokens: { input: result.inputTokens, output: result.outputTokens },
      cost_usd: costUsd,
      latency_ms: latencyMs,
    });

    totalCost += costUsd;
    totalLatency += latencyMs;
    totalTokens.input += result.inputTokens;
    totalTokens.output += result.outputTokens;
    prevOutputs = { ...prevOutputs, ...result.outputs };

    await supabase.from('prompt_runs').insert({
      startup_id,
      user_id: user.id,
      pack_id,
      step_id: step.id,
      inputs_json: { context, previous_outputs: prevOutputs },
      outputs_json: result.outputs,
      model_used: step.model_preference || 'gemini-2.0-flash',
      tokens_input: result.inputTokens,
      tokens_output: result.outputTokens,
      cost_usd: costUsd,
      latency_ms: latencyMs,
      status: result.error ? 'error' : 'completed',
      error_message: result.error,
      completed_at: new Date().toISOString(),
    });

    if (result.error && stop_on_error) break;
  }

  const completedSteps = results.filter(r => r.success).length;

  return jsonResponse({
    success: completedSteps === stepsList.length,
    results,
    final_output: prevOutputs,
    meta: {
      pack_id,
      startup_id,
      total_steps: stepsList.length,
      completed_steps: completedSteps,
      total_cost_usd: totalCost,
      total_latency_ms: totalLatency,
      total_tokens: totalTokens,
    },
    error: completedSteps < stepsList.length ? 'Some steps failed' : undefined,
  }, 200, corsHeaders);
}

async function handlePreview(
  supabase: SupabaseClientType,
  body: PromptPackRequest,
  corsHeaders: Record<string, string>
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
  }

  const { outputs_json, apply_to } = body;
  if (!outputs_json) {
    return jsonResponse({ error: 'outputs_json required' }, 400, corsHeaders);
  }

  const applied = analyzeOutputsForApply(outputs_json, apply_to);

  return jsonResponse({
    success: true,
    applied,
    summary: {
      tables_updated: applied.length,
      total_records: applied.reduce((sum, a) => sum + a.count, 0),
    },
  }, 200, corsHeaders);
}

async function handleApply(
  supabase: SupabaseClientType,
  body: PromptPackRequest,
  corsHeaders: Record<string, string>
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
  }

  const { startup_id, outputs_json, apply_to } = body;
  if (!startup_id || !outputs_json) {
    return jsonResponse({ error: 'startup_id and outputs_json required' }, 400, corsHeaders);
  }

  const applied: Array<{ table: string; count: number; action: string }> = [];

  if (outputs_json.lean_canvas && (!apply_to || apply_to.includes('lean_canvas'))) {
    const canvasData = outputs_json.lean_canvas as Record<string, unknown>;
    const { error } = await supabase
      .from('documents')
      .upsert({
        startup_id,
        type: 'lean_canvas',
        title: 'AI-Generated Lean Canvas',
        content_json: canvasData,
        ai_generated: true,
        status: 'draft',
      }, { onConflict: 'startup_id,type' });
    
    if (!error) applied.push({ table: 'documents', count: 1, action: 'upsert' });
  }

  if (outputs_json.tasks && Array.isArray(outputs_json.tasks) && (!apply_to || apply_to.includes('tasks'))) {
    const tasks = outputs_json.tasks as Array<Record<string, unknown>>;
    const tasksToInsert = tasks.map(t => ({
      startup_id,
      title: t.title,
      description: t.description,
      priority: t.priority || 'medium',
      status: 'todo',
      category: t.category,
      ai_generated: true,
      ai_source: 'prompt_pack',
    }));
    
    const { error } = await supabase.from('tasks').insert(tasksToInsert);
    if (!error) applied.push({ table: 'tasks', count: tasks.length, action: 'insert' });
  }

  if (outputs_json.startup && (!apply_to || apply_to.includes('startups'))) {
    const startupUpdates = outputs_json.startup as Record<string, unknown>;
    const { error } = await supabase.from('startups').update(startupUpdates).eq('id', startup_id);
    if (!error) applied.push({ table: 'startups', count: 1, action: 'update' });
  }

  return jsonResponse({
    success: true,
    applied,
    summary: {
      tables_updated: applied.length,
      total_records: applied.reduce((sum, a) => sum + a.count, 0),
    },
  }, 200, corsHeaders);
}

function jsonResponse(data: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

function buildPromptFromTemplate(
  template: string,
  context: {
    startup?: Record<string, unknown> | null;
    context: Record<string, unknown>;
    previous_outputs: Record<string, unknown>;
  }
): string {
  let prompt = template;

  if (context.startup) {
    for (const [key, value] of Object.entries(context.startup)) {
      const placeholder = `{{startup.${key}}}`;
      prompt = prompt.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value || ''));
    }
  }

  for (const [key, value] of Object.entries(context.context)) {
    const placeholder = `{{context.${key}}}`;
    prompt = prompt.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value || ''));
  }

  for (const [key, value] of Object.entries(context.previous_outputs)) {
    const placeholder = `{{previous.${key}}}`;
    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value || '');
    prompt = prompt.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), valueStr);
  }

  return prompt;
}

async function callGemini(
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number
): Promise<{ outputs: Record<string, unknown>; inputTokens: number; outputTokens: number; error?: string }> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    return { outputs: {}, inputTokens: 0, outputTokens: 0, error: 'GEMINI_API_KEY not configured' };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PromptPack] Gemini error:', response.status, errorText);
      return { outputs: {}, inputTokens: 0, outputTokens: 0, error: `Gemini API error: ${response.status}` };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    let outputs: Record<string, unknown>;
    try {
      outputs = JSON.parse(text);
    } catch {
      outputs = { raw_response: text };
    }

    return {
      outputs,
      inputTokens: data.usageMetadata?.promptTokenCount || 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    };
  } catch (error) {
    console.error('[PromptPack] Gemini call failed:', error);
    return { outputs: {}, inputTokens: 0, outputTokens: 0, error: String(error) };
  }
}

function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputRate = 0.00001;
  const outputRate = 0.00003;
  return (inputTokens * inputRate / 1000) + (outputTokens * outputRate / 1000);
}

function analyzeOutputsForApply(
  outputs: Record<string, unknown>,
  applyTo?: string[]
): Array<{ table: string; count: number; action: 'insert' | 'update' | 'upsert' }> {
  const result: Array<{ table: string; count: number; action: 'insert' | 'update' | 'upsert' }> = [];

  if (outputs.lean_canvas && (!applyTo || applyTo.includes('lean_canvas'))) {
    result.push({ table: 'documents', count: 1, action: 'upsert' });
  }
  if (outputs.tasks && Array.isArray(outputs.tasks) && (!applyTo || applyTo.includes('tasks'))) {
    result.push({ table: 'tasks', count: outputs.tasks.length, action: 'insert' });
  }
  if (outputs.startup && (!applyTo || applyTo.includes('startups'))) {
    result.push({ table: 'startups', count: 1, action: 'update' });
  }

  return result;
}
