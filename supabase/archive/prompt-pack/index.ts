/**
 * Prompt Pack Edge Function (combined)
 *
 * Single function for prompt pack operations. Actions:
 * - search | get | list — catalog read (no JWT)
 * - run_step | run_pack — AI execution (JWT required)
 * - apply | preview — apply outputs to DB (JWT required)
 *
 * @endpoint POST /functions/v1/prompt-pack
 *
 * Compliance: .cursor/rules/supabase/writing-supabase-edge-functions.mdc
 * - Deno.serve (no std http/server)
 * - CORS headers + OPTIONS
 * - jsr:/npm: imports with version
 * - _shared for cors, prompt-utils, gemini
 * - Structured error handling (401/400/500)
 * - No file writes outside /tmp
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, getCorsHeaders } from "../../functions/_shared/cors.ts";
import {
  interpolatePrompt,
  validateOutput,
  getStartupContext,
  calculateCost,
  createPromptRun,
  updatePromptRun,
  type PromptStep,
  type StartupContext,
} from "../../functions/_shared/prompt-utils.ts";
import { generateStructuredContent, GeminiModels } from "../../functions/_shared/gemini.ts";

// =============================================================================
// Types
// =============================================================================

type ApplyTarget =
  | "profile"
  | "canvas"
  | "slides"
  | "tasks"
  | "score"
  | "memory"
  | "validation";

interface ApplyRequest {
  action: "apply" | "preview";
  startup_id: string;
  run_id?: string;
  outputs_json: Record<string, unknown>;
  apply_to?: ApplyTarget[];
}

interface ApplyResult {
  table: string;
  action: "insert" | "update" | "upsert";
  count: number;
  ids?: string[];
}

interface SearchRequest {
  action: "search" | "get" | "list" | "auto_select";
  module?:
    | "onboarding"
    | "canvas"
    | "pitch"
    | "validation"
    | "gtm"
    | "pricing"
    | "market"
    | "ideation"
    | "funding"
    | "founder-fit";
  industry?: string;
  stage?: string;
  goal?: string;
  startup_id?: string;
  limit?: number;
  pack_id?: string;
  slug?: string;
  // Auto-trigger fields (NEW)
  route?: string;        // current route: /onboarding/1, /validator
  intent?: string;       // detected intent: validate, sharpen, competitor
  message?: string;      // user message for intent detection
}

interface RunStepRequest {
  action: "run_step";
  startup_id: string;
  pack_id: string;
  step_id: string;
  context?: Record<string, unknown>;
  previous_outputs?: Record<string, unknown>;
}

interface RunPackRequest {
  action: "run_pack";
  startup_id: string;
  pack_id: string;
  context?: Record<string, unknown>;
  stop_on_error?: boolean;
}

interface PromptPackWithSteps {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  stage_tags: string[];
  industry_tags: string[];
  version: number;
  is_active: boolean;
  source: string;
  metadata: Record<string, unknown>;
  prompt_pack_steps: Array<{
    id: string;
    step_order: number;
    purpose: string;
    prompt_template: string;
    output_schema: Record<string, unknown>;
    model_preference: string;
    max_tokens: number;
    temperature: number;
  }>;
}

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

const MODULE_CATEGORY_MAP: Record<string, string[]> = {
  onboarding: ["validation", "ideation", "market"],
  canvas: ["canvas", "pricing", "gtm"],
  pitch: ["pitch"],
  validation: ["validation", "market"],
  gtm: ["gtm", "pricing"],
  pricing: ["pricing"],
  market: ["market"],
  ideation: ["ideation"],
  funding: ["funding"],
  "founder-fit": ["hiring"],
};

// Route-to-module mapping for auto-selection
const ROUTE_MODULE_MAP: Record<string, string> = {
  "/onboarding": "ideation",
  "/onboarding/1": "ideation",
  "/onboarding/2": "market",
  "/onboarding/3": "founder-fit",
  "/onboarding/4": "pitch",
  "/get-started": "ideation",
  "/validator": "validation",
  "/validate": "validation",
  "/canvas": "canvas",
  "/lean-canvas": "canvas",
  "/pitch-deck": "pitch",
  "/pitch": "pitch",
  "/funding": "funding",
};

// Intent keywords for auto-detection
const INTENT_KEYWORDS: Record<string, string[]> = {
  validation: ["validate", "score", "assess", "evaluate", "check", "readiness", "icp"],
  ideation: ["sharpen", "problem", "first principles", "idea", "refine", "clarify"],
  market: ["competitor", "competition", "market", "alternative", "landscape"],
  pitch: ["pitch", "elevator", "one sentence", "tagline", "investor"],
  canvas: ["canvas", "uvp", "value proposition", "lean"],
  pricing: ["price", "pricing", "monetize", "revenue model"],
  funding: ["funding", "raise", "investor", "capital", "investment"],
  "founder-fit": ["founder", "team", "fit", "background", "experience"],
};

// Detect module from user message
function detectIntentModule(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  for (const [module, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return module;
      }
    }
  }
  return null;
}

// =============================================================================
// Auto-Select: Agent-driven pack selection (NEW)
// =============================================================================

async function handleAutoSelect(
  supabase: ReturnType<typeof createClient>,
  params: SearchRequest,
  headers: Record<string, string>
): Promise<Response> {
  const { route, intent, message, industry, stage, startup_id } = params;

  // Step 1: Determine module from route or intent
  let module: string | null = null;

  // Route takes priority
  if (route) {
    module = ROUTE_MODULE_MAP[route] || null;
  }

  // Intent from message
  if (!module && message) {
    module = detectIntentModule(message);
  }

  // Explicit intent
  if (!module && intent) {
    module = intent;
  }

  if (!module) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Could not determine module from route, intent, or message",
        hint: "Provide route (e.g., /onboarding/1), intent (e.g., validation), or message",
      }),
      { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // Step 2: Get startup context for industry/stage if startup_id provided
  let detectedIndustry = industry;
  let detectedStage = stage;

  if (startup_id && (!detectedIndustry || !detectedStage)) {
    const { data: startup } = await supabase
      .from("startups")
      .select("industry, stage")
      .eq("id", startup_id)
      .single();

    if (startup) {
      detectedIndustry = detectedIndustry || startup.industry;
      detectedStage = detectedStage || startup.stage;
    }
  }

  // Step 3: Search for best pack using DB function (if available) or query
  const categories = MODULE_CATEGORY_MAP[module] || [module];

  // Build query with scoring
  let query = supabase
    .from("prompt_packs")
    .select(`
      id,title,slug,description,category,stage_tags,industry_tags,
      auto_trigger_routes,trigger_intents,priority,
      prompt_pack_steps(id,step_order,name,purpose,output_schema,apply_to)
    `)
    .eq("is_active", true)
    .in("category", categories)
    .order("priority", { ascending: false })
    .order("version", { ascending: false });

  const { data: packs, error } = await query.limit(10);

  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  // Step 4: Score and rank packs
  const scoredPacks = (packs || []).map((pack: any) => {
    let score = pack.priority || 0;

    // Route match bonus
    if (route && pack.auto_trigger_routes?.includes(route)) {
      score += 20;
    }

    // Intent match bonus
    if (intent && pack.trigger_intents?.includes(intent.toLowerCase())) {
      score += 15;
    }

    // Industry match bonus
    if (detectedIndustry && pack.industry_tags?.includes(detectedIndustry.toLowerCase())) {
      score += 10;
    }

    // Stage match bonus
    if (detectedStage && pack.stage_tags?.includes(detectedStage.toLowerCase())) {
      score += 5;
    }

    // Sort steps
    const sortedSteps = (pack.prompt_pack_steps || []).sort(
      (a: any, b: any) => a.step_order - b.step_order
    );

    return {
      ...pack,
      prompt_pack_steps: sortedSteps,
      match_score: score,
      first_step: sortedSteps[0] || null,
    };
  });

  // Sort by score
  scoredPacks.sort((a, b) => b.match_score - a.match_score);

  const bestPack = scoredPacks[0] || null;

  // Step 5: Get full startup context if pack found
  let startupContext = null;
  if (startup_id && bestPack) {
    const { data: startup } = await supabase
      .from("startups")
      .select("id, name, description, industry, stage, tagline, target_market, problem_statement, solution_description")
      .eq("id", startup_id)
      .single();
    startupContext = startup;
  }

  return new Response(
    JSON.stringify({
      success: true,
      auto_selected: true,
      detected: {
        module,
        industry: detectedIndustry,
        stage: detectedStage,
        from_route: !!route,
        from_intent: !!intent,
        from_message: !!message && !route && !intent,
      },
      pack: bestPack,
      first_step: bestPack?.first_step || null,
      alternatives: scoredPacks.slice(1, 4),
      context: startupContext,
      run_url: bestPack ? `/functions/v1/prompt-pack` : null,
      run_body: bestPack ? {
        action: "run_step",
        startup_id,
        pack_id: bestPack.id,
        step_id: bestPack.first_step?.id,
      } : null,
    }),
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
}

// =============================================================================
// Search handlers (catalog read — service role)
// =============================================================================

async function handleSearch(
  supabase: ReturnType<typeof createClient>,
  params: SearchRequest,
  headers: Record<string, string>
): Promise<Response> {
  const { module, industry, stage, startup_id, limit = 5 } = params;
  const categories = module ? MODULE_CATEGORY_MAP[module] || [module] : null;

  let query = supabase
    .from("prompt_packs")
    .select(
      `id,title,slug,description,category,stage_tags,industry_tags,version,is_active,source,metadata,prompt_pack_steps(id,step_order,purpose,prompt_template,output_schema,model_preference,max_tokens,temperature)`
    )
    .eq("is_active", true)
    .order("version", { ascending: false });

  if (categories?.length) query = query.in("category", categories);
  if (industry) query = query.contains("industry_tags", [industry.toLowerCase()]);
  if (stage) query = query.contains("stage_tags", [stage.toLowerCase()]);

  const { data: packs, error } = await query.limit(limit);

  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const packsWithSortedSteps = (packs as PromptPackWithSteps[] || []).map((pack) => ({
    ...pack,
    prompt_pack_steps: (pack.prompt_pack_steps || []).sort((a, b) => a.step_order - b.step_order),
    step_count: pack.prompt_pack_steps?.length || 0,
  }));

  const bestPack = packsWithSortedSteps[0] || null;
  const firstStep = bestPack?.prompt_pack_steps?.[0] || null;

  let startupContext = null;
  if (startup_id && bestPack) {
    const { data: startup } = await supabase
      .from("startups")
      .select("id, name, description, industry, stage, tagline")
      .eq("id", startup_id)
      .single();
    startupContext = startup;
  }

  return new Response(
    JSON.stringify({
      success: true,
      pack: bestPack,
      next_step: firstStep,
      alternatives: packsWithSortedSteps.slice(1),
      context: startupContext,
      meta: { searched_categories: categories, filters: { module, industry, stage }, total_found: packsWithSortedSteps.length },
    }),
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
}

async function handleGet(
  supabase: ReturnType<typeof createClient>,
  params: SearchRequest,
  headers: Record<string, string>
): Promise<Response> {
  const { pack_id, slug } = params;
  if (!pack_id && !slug) {
    return new Response(JSON.stringify({ success: false, error: "pack_id or slug required" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  let query = supabase
    .from("prompt_packs")
    .select(
      `id,title,slug,description,category,stage_tags,industry_tags,version,is_active,source,metadata,created_at,updated_at,prompt_pack_steps(id,step_order,purpose,prompt_template,input_schema,output_schema,model_preference,max_tokens,temperature)`
    );
  if (pack_id) query = query.eq("id", pack_id);
  else if (slug) query = query.eq("slug", slug);

  const { data: pack, error } = await query.single();

  if (error || !pack) {
    return new Response(JSON.stringify({ success: false, error: error?.message || "Pack not found" }), {
      status: 404,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const packWithSortedSteps = {
    ...pack,
    prompt_pack_steps: ((pack as PromptPackWithSteps).prompt_pack_steps || []).sort((a, b) => a.step_order - b.step_order),
  };

  return new Response(
    JSON.stringify({ success: true, pack: packWithSortedSteps, step_count: packWithSortedSteps.prompt_pack_steps.length }),
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
}

async function handleList(
  supabase: ReturnType<typeof createClient>,
  params: SearchRequest,
  headers: Record<string, string>
): Promise<Response> {
  const { limit = 50 } = params;
  const { data: packs, error } = await supabase
    .from("prompt_packs")
    .select("id,title,slug,description,category,stage_tags,industry_tags,version,is_active,source")
    .eq("is_active", true)
    .order("category")
    .order("title")
    .limit(limit);

  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const byCategory: Record<string, typeof packs> = {};
  for (const pack of packs || []) {
    if (!byCategory[pack.category]) byCategory[pack.category] = [];
    byCategory[pack.category].push(pack);
  }

  return new Response(
    JSON.stringify({ success: true, packs: packs || [], by_category: byCategory, total: packs?.length || 0 }),
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
}

// =============================================================================
// Run: AI execution (Gemini/Claude)
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
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const responseText = result.content?.[0]?.text || "";
  let outputs: Record<string, unknown>;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    outputs = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_response: responseText };
  } catch {
    outputs = { raw_response: responseText };
  }
  return {
    outputs,
    model: "claude-sonnet-4-20250514",
    tokens: { input: result.usage?.input_tokens || 0, output: result.usage?.output_tokens || 0 },
  };
}

async function executeStep(
  supabase: ReturnType<typeof createClient>,
  step: PromptStep,
  context: Record<string, unknown>,
  userId: string | null,
  startupId: string,
  packId: string
): Promise<StepResult> {
  const startTime = Date.now();
  const run = await createPromptRun(supabase, {
    startup_id: startupId,
    user_id: userId || undefined,
    pack_id: packId,
    step_id: step.id,
    inputs_json: context,
  });

  try {
    await updatePromptRun(supabase, run.id, { status: "running" });
    let prompt = interpolatePrompt(step.prompt_template, context);
    prompt += `\n\nIMPORTANT: Return your response as valid JSON matching this schema:\n${JSON.stringify(step.output_schema, null, 2)}\n\nDo not include any text outside the JSON object.`;

    const modelPref = step.model_preference || "gemini";
    let result: { outputs: Record<string, unknown>; model: string; tokens: { input: number; output: number } };

    if (modelPref === "claude" || modelPref === "claude-sonnet") {
      result = await executeWithClaude(prompt, step.max_tokens);
    } else {
      result = await executeWithGemini(
        prompt,
        step.output_schema as Record<string, unknown>,
        step.temperature,
        step.max_tokens
      );
    }

    const latencyMs = Date.now() - startTime;
    const costUsd = calculateCost(result.model, result.tokens.input, result.tokens.output);
    const validation = validateOutput(result.outputs, step.output_schema as Record<string, unknown>);

    await updatePromptRun(supabase, run.id, {
      outputs_json: result.outputs,
      model_used: result.model,
      tokens_input: result.tokens.input,
      tokens_output: result.tokens.output,
      cost_usd: costUsd,
      latency_ms: latencyMs,
      status: "completed",
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
    await updatePromptRun(supabase, run.id, {
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
      latency_ms: latencyMs,
      completed_at: new Date().toISOString(),
    } as Partial<typeof run>);
    throw error;
  }
}

async function handleRunStep(
  supabase: ReturnType<typeof createClient>,
  params: RunStepRequest,
  userId: string | null,
  headers: Record<string, string>
): Promise<Response> {
  const { startup_id, pack_id, step_id, context: userContext, previous_outputs } = params;

  const { data: step, error: stepError } = await supabase
    .from("prompt_pack_steps")
    .select("*")
    .eq("id", step_id)
    .single();

  if (stepError || !step) {
    return new Response(JSON.stringify({ success: false, error: `Step not found: ${step_id}` }), {
      status: 404,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  let startupContext: StartupContext;
  try {
    startupContext = await getStartupContext(supabase, startup_id);
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Failed to get startup context" }),
      { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  const fullContext: Record<string, unknown> = {
    ...startupContext,
    ...(previous_outputs || {}),
    previous_output: previous_outputs?.previous_output || null,
    ...(userContext || {}),
  };

  try {
    const result = await executeStep(supabase, step as PromptStep, fullContext, userId, startup_id, pack_id);
    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Execution failed" }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
}

async function handleRunPack(
  supabase: ReturnType<typeof createClient>,
  params: RunPackRequest,
  userId: string | null,
  headers: Record<string, string>
): Promise<Response> {
  const { startup_id, pack_id, context: userContext, stop_on_error = true } = params;
  const startTime = Date.now();

  const { data: steps, error: stepsError } = await supabase
    .from("prompt_pack_steps")
    .select("*")
    .eq("pack_id", pack_id)
    .order("step_order", { ascending: true });

  if (stepsError || !steps || steps.length === 0) {
    return new Response(JSON.stringify({ success: false, error: "No steps found for pack" }), {
      status: 404,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  let startupContext: StartupContext;
  try {
    startupContext = await getStartupContext(supabase, startup_id);
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Failed to get startup context" }),
      { status: 404, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  const results: StepResult[] = [];
  const errors: Array<{ step_id: string; error: string }> = [];
  let currentContext: Record<string, unknown> = { ...startupContext, ...(userContext || {}) };
  let totalTokensInput = 0;
  let totalTokensOutput = 0;
  let totalCost = 0;

  for (const step of steps) {
    try {
      const result = await executeStep(supabase, step as PromptStep, currentContext, userId, startup_id, pack_id);
      results.push(result);
      currentContext = { ...currentContext, previous_output: result.outputs, [`step_${step.step_order}_output`]: result.outputs };
      totalTokensInput += result.tokens.input;
      totalTokensOutput += result.tokens.output;
      totalCost += result.cost_usd;
    } catch (error) {
      errors.push({ step_id: step.id, error: error instanceof Error ? error.message : "Unknown error" });
      if (stop_on_error) break;
    }
  }

  const totalLatencyMs = Date.now() - startTime;
  const finalOutput = results.length > 0 ? results[results.length - 1].outputs : null;

  return new Response(
    JSON.stringify({
      success: errors.length === 0,
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
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
}

// =============================================================================
// Apply: DB write helpers (see prompt-pack-apply for full logic)
// =============================================================================

async function applyToProfile(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  const fieldMappings: Record<string, string> = {
    icp: "target_market", target_customer: "target_market", target_market: "target_market",
    problem: "problem_statement", problem_statement: "problem_statement",
    solution: "solution_description", solution_description: "solution_description",
    uvp: "unique_value", unique_value_proposition: "unique_value", unique_value: "unique_value",
    one_liner: "tagline", tagline: "tagline", company_name: "name", startup_name: "name",
    industry: "industry", stage: "stage", description: "description",
    business_model: "business_model", pricing_model: "pricing_model",
  };
  const profileUpdates: Record<string, unknown> = {};
  for (const [outputKey, dbColumn] of Object.entries(fieldMappings)) {
    if (outputs[outputKey] !== undefined && outputs[outputKey] !== null) {
      profileUpdates[dbColumn] = outputs[outputKey];
    }
  }
  if (Object.keys(profileUpdates).length === 0) return null;
  profileUpdates.updated_at = new Date().toISOString();
  const { error } = await supabase.from("startups").update(profileUpdates).eq("id", startupId);
  if (error) {
    console.error("Profile update error:", error);
    return null;
  }
  return { table: "startups", action: "update", count: Object.keys(profileUpdates).length - 1 };
}

async function applyToCanvas(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  const canvasData = (outputs.canvas as Record<string, unknown>) || outputs;
  const canvasFields = [
    "problem", "customer_segments", "unique_value_proposition", "solution",
    "channels", "revenue_streams", "cost_structure", "key_metrics", "unfair_advantage",
  ];
  if (!canvasFields.some((f) => canvasData[f] !== undefined)) return null;
  const { data: existingCanvas } = await supabase
    .from("lean_canvases")
    .select("id")
    .eq("startup_id", startupId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  const canvasPayload: Record<string, unknown> = {
    startup_id: startupId,
    updated_at: new Date().toISOString(),
  };
  for (const field of canvasFields) {
    if (canvasData[field] !== undefined) canvasPayload[field] = canvasData[field];
  }
  if (canvasData.overall_score !== undefined) canvasPayload.validation_score = canvasData.overall_score;
  if (existingCanvas) {
    const { error } = await supabase.from("lean_canvases").update(canvasPayload).eq("id", existingCanvas.id);
    if (error) {
      console.error("Canvas update error:", error);
      return null;
    }
    return { table: "lean_canvases", action: "update", count: 1, ids: [existingCanvas.id] };
  }
  canvasPayload.created_at = new Date().toISOString();
  const { data: newCanvas, error } = await supabase.from("lean_canvases").insert(canvasPayload).select("id").single();
  if (error) {
    console.error("Canvas insert error:", error);
    return null;
  }
  return { table: "lean_canvases", action: "insert", count: 1, ids: [newCanvas?.id] };
}

async function applyToSlides(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  const slides = outputs.slides as Array<Record<string, unknown>> | undefined;
  if (!slides || !Array.isArray(slides) || slides.length === 0) return null;
  const { data: existingDeck } = await supabase
    .from("pitch_decks")
    .select("id")
    .eq("startup_id", startupId)
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  let deckId: string;
  if (existingDeck) {
    deckId = existingDeck.id;
  } else {
    const { data: newDeck, error: deckError } = await supabase
      .from("pitch_decks")
      .insert({
        startup_id: startupId,
        status: "draft",
        deck_type: "investor",
        metadata: { source: "prompt_pack", generated_at: new Date().toISOString() },
      })
      .select("id")
      .single();
    if (deckError || !newDeck) {
      console.error("Failed to create deck:", deckError);
      return null;
    }
    deckId = newDeck.id;
  }
  let insertedCount = 0;
  const insertedIds: string[] = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const slideType = (slide.type || slide.slide_type || "custom") as string;
    const slidePayload = {
      deck_id: deckId,
      slide_type: slideType,
      slide_number: (slide.order ?? slide.order_index ?? i + 1) as number,
      title: (slide.title as string) || "",
      subtitle: (slide.subtitle as string) || null,
      content: (slide.content ?? slide.bullets ?? slide.bullet_points) as string | null ?? null,
      notes: (slide.notes ?? slide.speaker_notes) as string | null ?? null,
      layout: (slide.layout as string) || "default",
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("pitch_deck_slides")
      .upsert(slidePayload, { onConflict: "deck_id,slide_number" })
      .select("id")
      .single();
    if (!error && data) {
      insertedCount++;
      insertedIds.push(data.id);
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from("pitch_deck_slides")
        .insert(slidePayload)
        .select("id")
        .single();
      if (!insertError && insertData) {
        insertedCount++;
        insertedIds.push(insertData.id);
      }
    }
  }
  if (insertedCount === 0) return null;
  return { table: "pitch_deck_slides", action: "upsert", count: insertedCount, ids: insertedIds };
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
  if (tasks?.length) {
    for (const task of tasks) {
      taskItems.push({
        title: task.title || task.task || "",
        description: task.description || "",
        category: task.category || "validation",
        priority: task.priority || "medium",
      });
    }
  }
  if (nextSteps?.length) {
    for (const step of nextSteps) {
      taskItems.push({ title: step, description: "", category: "action", priority: "medium" });
    }
  }
  if (conditions?.length) {
    for (const condition of conditions) {
      if (condition.task) {
        const taskInfo = condition.task as Record<string, unknown>;
        taskItems.push({
          title: taskInfo.title || condition.title || "",
          description: taskInfo.description || condition.required_outcome || "",
          category: "condition",
          priority: condition.priority || "high",
        });
      }
    }
  }
  if (taskItems.length === 0) return null;
  let insertedCount = 0;
  const insertedIds: string[] = [];
  for (const task of taskItems) {
    if (!task.title) continue;
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        startup_id: startupId,
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: "pending",
        ai_generated: true,
        ai_source: runId ? `prompt_pack:${runId}` : "prompt_pack",
      })
      .select("id")
      .single();
    if (!error && data) {
      insertedCount++;
      insertedIds.push(data.id);
    }
  }
  if (insertedCount === 0) return null;
  return { table: "tasks", action: "insert", count: insertedCount, ids: insertedIds };
}

async function applyToScore(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  const updates: Record<string, unknown> = {};
  if (outputs.readiness_score !== undefined) updates.readiness_score = outputs.readiness_score;
  if (outputs.overall_score !== undefined) updates.readiness_score = outputs.overall_score;
  if (outputs.validation_score !== undefined) updates.readiness_score = outputs.validation_score;
  if (outputs.readiness_rationale !== undefined) updates.readiness_rationale = outputs.readiness_rationale;
  if (outputs.recommendation !== undefined) updates.readiness_rationale = outputs.recommendation;
  if (outputs.verdict !== undefined) updates.validation_verdict = outputs.verdict;
  if (Object.keys(updates).length === 0) return null;
  updates.readiness_updated_at = new Date().toISOString();
  updates.updated_at = new Date().toISOString();
  const { error } = await supabase.from("startups").update(updates).eq("id", startupId);
  if (error) {
    console.error("Score update error:", error);
    return null;
  }
  return { table: "startups.readiness", action: "update", count: Object.keys(updates).length - 2 };
}

async function applyToMemory(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  outputs: Record<string, unknown>,
  runId?: string
): Promise<ApplyResult | null> {
  const content = (outputs.summary as string) || (outputs.key_insights ? JSON.stringify(outputs.key_insights) : null);
  if (!content) return null;
  const { data, error } = await supabase
    .from("startup_memory")
    .insert({
      startup_id: startupId,
      entity_type: "prompt_output",
      entity_id: runId || null,
      content,
      source: runId ? `prompt_run:${runId}` : "prompt_pack",
    })
    .select("id")
    .single();
  if (error) {
    console.error("Memory insert error:", error);
    return null;
  }
  return { table: "startup_memory", action: "insert", count: 1, ids: [data?.id] };
}

async function applyToValidation(
  supabase: ReturnType<typeof createClient>,
  startupId: string,
  userId: string | null,
  outputs: Record<string, unknown>
): Promise<ApplyResult | null> {
  if (
    outputs.overall_score === undefined &&
    outputs.verdict === undefined &&
    outputs.scores === undefined
  ) {
    return null;
  }
  const scores = (outputs.scores as Record<string, unknown>) || {};
  const validationPayload = {
    user_id: userId,
    startup_id: startupId,
    idea_description: outputs.idea_description || "",
    overall_score: outputs.overall_score ?? outputs.validation_score ?? null,
    problem_score: scores.problem ?? scores.problem_clarity ?? null,
    market_score: scores.market ?? scores.market_size ?? null,
    competition_score: scores.competition ?? null,
    solution_score: scores.solution ?? scores.solution_fit ?? null,
    business_score: scores.business ?? scores.business_model ?? null,
    execution_score: scores.execution ?? null,
    blue_ocean_score: outputs.blue_ocean_score ?? null,
    risk_adjustment: (outputs.risk_deduction ?? outputs.total_deduction ?? 0) as number,
    verdict: outputs.verdict ?? null,
    confidence: outputs.confidence ?? null,
    report_data: outputs,
    input_data: (outputs.input_data as Record<string, unknown>) || {},
    conditions: (outputs.conditions as unknown[]) || [],
    validation_type: "prompt_pack",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("validation_reports").insert(validationPayload).select("id").single();
  if (error) {
    console.error("Validation insert error:", error);
    return null;
  }
  return { table: "validation_reports", action: "insert", count: 1, ids: [data?.id] };
}

async function handleApply(
  supabase: ReturnType<typeof createClient>,
  params: ApplyRequest,
  userId: string | null,
  preview: boolean,
  headers: Record<string, string>
): Promise<Response> {
  const { startup_id, run_id, outputs_json, apply_to } = params;
  const targets: ApplyTarget[] = apply_to || ["profile", "canvas", "slides", "tasks", "score"];
  const applied: ApplyResult[] = [];
  const errors: string[] = [];

  for (const target of targets) {
    try {
      let result: ApplyResult | null = null;
      if (preview) {
        if (target === "profile" && (outputs_json.icp || outputs_json.problem || outputs_json.solution || outputs_json.uvp)) {
          result = { table: "startups", action: "update", count: 1 };
        }
        if (target === "canvas" && (outputs_json.canvas || outputs_json.problem || outputs_json.customer_segments)) {
          result = { table: "lean_canvases", action: "upsert", count: 1 };
        }
        if (target === "slides") {
          const slides = outputs_json.slides as unknown[];
          if (slides?.length) result = { table: "pitch_deck_slides", action: "upsert", count: slides.length };
        }
        if (target === "tasks") {
          const tasks = outputs_json.tasks as unknown[];
          const nextSteps = outputs_json.next_steps as unknown[];
          const count = (tasks?.length || 0) + (nextSteps?.length || 0);
          if (count > 0) result = { table: "tasks", action: "insert", count };
        }
        if (target === "score" && (outputs_json.readiness_score || outputs_json.overall_score || outputs_json.verdict)) {
          result = { table: "startups.readiness", action: "update", count: 1 };
        }
        if (target === "memory" && (outputs_json.summary || outputs_json.key_insights)) {
          result = { table: "startup_memory", action: "insert", count: 1 };
        }
        if (target === "validation" && (outputs_json.overall_score || outputs_json.verdict)) {
          result = { table: "validation_reports", action: "insert", count: 1 };
        }
      } else {
        switch (target) {
          case "profile":
            result = await applyToProfile(supabase, startup_id, outputs_json);
            break;
          case "canvas":
            result = await applyToCanvas(supabase, startup_id, outputs_json);
            break;
          case "slides":
            result = await applyToSlides(supabase, startup_id, outputs_json);
            break;
          case "tasks":
            result = await applyToTasks(supabase, startup_id, outputs_json, run_id);
            break;
          case "score":
            result = await applyToScore(supabase, startup_id, outputs_json);
            break;
          case "memory":
            result = await applyToMemory(supabase, startup_id, outputs_json, run_id);
            break;
          case "validation":
            result = await applyToValidation(supabase, startup_id, userId, outputs_json);
            break;
        }
      }
      if (result) applied.push(result);
    } catch (error) {
      errors.push(`${target}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  const totalRecords = applied.reduce((sum, a) => sum + a.count, 0);
  return new Response(
    JSON.stringify({
      success: errors.length === 0,
      preview,
      applied,
      errors: errors.length > 0 ? errors : undefined,
      summary: { tables_updated: applied.length, total_records: totalRecords },
    }),
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
}

// =============================================================================
// Main handler (compliance: writing-supabase-edge-functions.mdc)
// =============================================================================

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const origin = req.headers.get("origin");
  const responseHeaders = getCorsHeaders(origin ?? "");

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = (body.action as string) ?? "search";

    // Catalog actions (no JWT required)
    const catalogActions = ["search", "get", "list", "auto_select"];
    if (catalogActions.includes(action)) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      switch (action) {
        case "auto_select":
          // Agent-driven automatic pack selection
          return await handleAutoSelect(supabase, body as SearchRequest, responseHeaders);
        case "search":
          return await handleSearch(supabase, body as SearchRequest, responseHeaders);
        case "get":
          return await handleGet(supabase, body as SearchRequest, responseHeaders);
        case "list":
          return await handleList(supabase, body as SearchRequest, responseHeaders);
        default:
          return new Response(
            JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
            { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } }
          );
      }
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Authorization required" }),
        { status: 401, headers: { ...responseHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid authorization" }),
        { status: 401, headers: { ...responseHeaders, "Content-Type": "application/json" } }
      );
    }

    switch (action) {
      case "run_step": {
        const r = body as RunStepRequest;
        if (!r.startup_id || !r.pack_id || !r.step_id) {
          return new Response(
            JSON.stringify({ success: false, error: "run_step requires startup_id, pack_id, and step_id" }),
            { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } }
          );
        }
        return await handleRunStep(supabase, r, user.id, responseHeaders);
      }
      case "run_pack": {
        const r = body as RunPackRequest;
        if (!r.startup_id || !r.pack_id) {
          return new Response(
            JSON.stringify({ success: false, error: "run_pack requires startup_id and pack_id" }),
            { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } }
          );
        }
        return await handleRunPack(supabase, r, user.id, responseHeaders);
      }
      case "apply":
      case "preview": {
        const r = body as ApplyRequest;
        if (!r.startup_id) {
          return new Response(
            JSON.stringify({ success: false, error: "startup_id is required" }),
            { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } }
          );
        }
        if (!r.outputs_json || typeof r.outputs_json !== "object") {
          return new Response(
            JSON.stringify({ success: false, error: "outputs_json is required and must be an object" }),
            { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } }
          );
        }
        return await handleApply(supabase, { ...r, action: r.action ?? "apply" }, user.id, action === "preview", responseHeaders);
      }
      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Unknown action: ${action}`,
            available: ["auto_select", "search", "get", "list", "run_step", "run_pack", "apply", "preview"],
            hint: "Use 'auto_select' for agent-driven pack selection based on route/intent",
          }),
          { status: 400, headers: { ...responseHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Prompt pack error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...responseHeaders, "Content-Type": "application/json" } }
    );
  }
});
