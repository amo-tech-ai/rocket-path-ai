/**
 * @deprecated Use prompt-pack with action "run_step" or "run_pack" instead.
 * POST /functions/v1/prompt-pack { "action": "run_step"|"run_pack", "startup_id", "pack_id", ... }
 *
 * Prompt Pack Run Edge Function
 *
 * Execute prompt pack steps with AI models (Gemini/Claude).
 * Actions: run_step | run_pack
 * @endpoint POST /functions/v1/prompt-pack-run
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, getCorsHeaders } from '../_shared/cors.ts';
import {
  interpolatePrompt,
  validateOutput,
  getStartupContext,
  calculateCost,
  createPromptRun,
  updatePromptRun,
  type PromptStep,
  type StartupContext,
} from '../_shared/prompt-utils.ts';
import { generateStructuredContent, GeminiModels } from '../_shared/gemini.ts';

// =============================================================================
// Types
// =============================================================================

interface RunStepRequest {
  action: 'run_step';
  startup_id: string;
  pack_id: string;
  step_id: string;
  context?: Record<string, unknown>;
  previous_outputs?: Record<string, unknown>;
}

interface RunPackRequest {
  action: 'run_pack';
  startup_id: string;
  pack_id: string;
  context?: Record<string, unknown>;
  stop_on_error?: boolean;
}

type RunRequest = RunStepRequest | RunPackRequest;

interface StepResult {
  step_id: string;
  step_order: number;
  purpose: string;
  outputs: Record<string, unknown>;
  model_used: string;
  tokens: { input: number; output: number };
  cost_usd: number;
  latency_ms: number;
  validation: { valid: boolean; errors: string[]; warnings: string[] };
}

// =============================================================================
// AI Model Execution
// =============================================================================

async function executeWithGemini(
  prompt: string,
  outputSchema: Record<string, unknown>,
  temperature: number,
  maxTokens: number
): Promise<{ outputs: Record<string, unknown>; model: string; tokens: { input: number; output: number } }> {
  const { data, usage } = await generateStructuredContent(prompt, outputSchema, {
    model: GeminiModels.FLASH,
    temperature,
    timeout: 60000,
  });

  return {
    outputs: data as Record<string, unknown>,
    model: GeminiModels.FLASH,
    tokens: { input: usage.inputTokens, output: usage.outputTokens },
  };
}

async function executeWithClaude(
  prompt: string,
  maxTokens: number
): Promise<{ outputs: Record<string, unknown>; model: string; tokens: { input: number; output: number } }> {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const responseText = result.content?.[0]?.text || '';

  // Parse JSON from response
  let outputs: Record<string, unknown>;
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    outputs = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_response: responseText };
  } catch {
    outputs = { raw_response: responseText };
  }

  return {
    outputs,
    model: 'claude-sonnet-4-20250514',
    tokens: {
      input: result.usage?.input_tokens || 0,
      output: result.usage?.output_tokens || 0,
    },
  };
}

// =============================================================================
// Step Execution
// =============================================================================

async function executeStep(
  supabase: ReturnType<typeof createClient>,
  step: PromptStep,
  context: Record<string, unknown>,
  userId: string | null,
  startupId: string,
  packId: string
): Promise<StepResult> {
  const startTime = Date.now();

  // Create run record
  const run = await createPromptRun(supabase, {
    startup_id: startupId,
    user_id: userId || undefined,
    pack_id: packId,
    step_id: step.id,
    inputs_json: context,
  });

  try {
    // Update status to running
    await updatePromptRun(supabase, run.id, { status: 'running' });

    // Interpolate the prompt template
    let prompt = interpolatePrompt(step.prompt_template, context);

    // Add JSON output instruction
    prompt += `\n\nIMPORTANT: Return your response as valid JSON matching this schema:\n${JSON.stringify(step.output_schema, null, 2)}\n\nDo not include any text outside the JSON object.`;

    // Execute with appropriate model
    let result: { outputs: Record<string, unknown>; model: string; tokens: { input: number; output: number } };

    const modelPref = step.model_preference || 'gemini';

    if (modelPref === 'claude' || modelPref === 'claude-sonnet') {
      result = await executeWithClaude(prompt, step.max_tokens);
    } else {
      // Default to Gemini (faster and cheaper)
      result = await executeWithGemini(
        prompt,
        step.output_schema as Record<string, unknown>,
        step.temperature,
        step.max_tokens
      );
    }

    const latencyMs = Date.now() - startTime;
    const costUsd = calculateCost(result.model, result.tokens.input, result.tokens.output);

    // Validate output
    const validation = validateOutput(result.outputs, step.output_schema as Record<string, unknown>);

    // Update run record with results
    await updatePromptRun(supabase, run.id, {
      outputs_json: result.outputs,
      model_used: result.model,
      tokens_input: result.tokens.input,
      tokens_output: result.tokens.output,
      cost_usd: costUsd,
      latency_ms: latencyMs,
      status: 'completed',
      completed_at: new Date().toISOString(),
    } as Partial<typeof run>);

    return {
      step_id: step.id,
      step_order: step.step_order,
      purpose: step.purpose,
      outputs: result.outputs,
      model_used: result.model,
      tokens: result.tokens,
      cost_usd: costUsd,
      latency_ms: latencyMs,
      validation,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // Update run record with error
    await updatePromptRun(supabase, run.id, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      latency_ms: latencyMs,
      completed_at: new Date().toISOString(),
    } as Partial<typeof run>);

    throw error;
  }
}

// =============================================================================
// Handlers
// =============================================================================

async function handleRunStep(
  supabase: ReturnType<typeof createClient>,
  params: RunStepRequest,
  userId: string | null
): Promise<Response> {
  const { startup_id, pack_id, step_id, context: userContext, previous_outputs } = params;

  // Fetch the step
  const { data: step, error: stepError } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('id', step_id)
    .single();

  if (stepError || !step) {
    return new Response(
      JSON.stringify({ success: false, error: `Step not found: ${step_id}` }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get startup context
  let startupContext: StartupContext;
  try {
    startupContext = await getStartupContext(supabase, startup_id);
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to get startup context' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Merge contexts: startup < previous_outputs < userContext
  const fullContext: Record<string, unknown> = {
    ...startupContext,
    ...(previous_outputs || {}),
    previous_output: previous_outputs?.previous_output || null,
    ...(userContext || {}),
  };

  try {
    const result = await executeStep(
      supabase,
      step as PromptStep,
      fullContext,
      userId,
      startup_id,
      pack_id
    );

    return new Response(
      JSON.stringify({
        success: true,
        ...result,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleRunPack(
  supabase: ReturnType<typeof createClient>,
  params: RunPackRequest,
  userId: string | null
): Promise<Response> {
  const { startup_id, pack_id, context: userContext, stop_on_error = true } = params;

  const startTime = Date.now();

  // Fetch all steps for the pack
  const { data: steps, error: stepsError } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', pack_id)
    .order('step_order', { ascending: true });

  if (stepsError || !steps || steps.length === 0) {
    return new Response(
      JSON.stringify({ success: false, error: 'No steps found for pack' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get startup context
  let startupContext: StartupContext;
  try {
    startupContext = await getStartupContext(supabase, startup_id);
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to get startup context' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Execute steps sequentially
  const results: StepResult[] = [];
  const errors: Array<{ step_id: string; error: string }> = [];
  let currentContext: Record<string, unknown> = {
    ...startupContext,
    ...(userContext || {}),
  };

  let totalTokensInput = 0;
  let totalTokensOutput = 0;
  let totalCost = 0;

  for (const step of steps) {
    try {
      const result = await executeStep(
        supabase,
        step as PromptStep,
        currentContext,
        userId,
        startup_id,
        pack_id
      );

      results.push(result);

      // Update context with this step's output for next step
      currentContext = {
        ...currentContext,
        previous_output: result.outputs,
        [`step_${step.step_order}_output`]: result.outputs,
      };

      // Accumulate totals
      totalTokensInput += result.tokens.input;
      totalTokensOutput += result.tokens.output;
      totalCost += result.cost_usd;
    } catch (error) {
      const errorInfo = {
        step_id: step.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      errors.push(errorInfo);

      if (stop_on_error) {
        break;
      }
    }
  }

  const totalLatencyMs = Date.now() - startTime;
  const allSucceeded = errors.length === 0;

  // Get final output (from last successful step)
  const finalOutput = results.length > 0 ? results[results.length - 1].outputs : null;

  return new Response(
    JSON.stringify({
      success: allSucceeded,
      completed_steps: results.length,
      total_steps: steps.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      final_output: finalOutput,
      meta: {
        total_latency_ms: totalLatencyMs,
        total_tokens: { input: totalTokensInput, output: totalTokensOutput },
        total_cost_usd: Number(totalCost.toFixed(6)),
        startup_id,
        pack_id,
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
    const body = await req.json() as RunRequest;
    const { action } = body;

    if (!action || typeof action !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'action is required (run_step | run_pack)' }),
        { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields per action
    if (action === 'run_step') {
      const r = body as RunStepRequest;
      if (!r.startup_id || !r.pack_id || !r.step_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'run_step requires startup_id, pack_id, and step_id' }),
          { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    if (action === 'run_pack') {
      const r = body as RunPackRequest;
      if (!r.startup_id || !r.pack_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'run_pack requires startup_id and pack_id' }),
          { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Route to handler
    switch (action) {
      case 'run_step':
        return await handleRunStep(supabase, body as RunStepRequest, user.id);

      case 'run_pack':
        return await handleRunPack(supabase, body as RunPackRequest, user.id);

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Run error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
