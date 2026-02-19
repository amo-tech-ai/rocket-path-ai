/**
 * AUTOMATION ENGINE
 * Event-driven automation for prompt pack system
 *
 * Actions:
 * - emit_event: Emit an automation event
 * - process_event: Find and execute matching triggers
 * - execute_automation: Run a specific automation
 * - get_executions: Get automation execution history
 * - start_chain: Start an automation chain
 * - get_chain_status: Get chain execution status
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Initialize clients with validation
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing required Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// AI clients initialized lazily to allow function to start even if keys missing
let genAI: GoogleGenerativeAI | null = null;
let anthropic: Anthropic | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");
    genAI = new GoogleGenerativeAI(geminiApiKey);
  }
  return genAI;
}

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!anthropicApiKey) throw new Error("ANTHROPIC_API_KEY not configured");
    anthropic = new Anthropic({ apiKey: anthropicApiKey });
  }
  return anthropic;
}

// AI Model selection
const AI_MODELS = {
  gemini: "gemini-2.0-flash",
  claude_fast: "claude-sonnet-4-5-20250514",
  claude_reasoning: "claude-opus-4-5-20250514",
};

// Output target handlers
const OUTPUT_TARGETS: Record<
  string,
  (userId: string, startupId: string, output: any) => Promise<void>
> = {
  profile: async (userId, startupId, output) => {
    await supabase
      .from("profiles")
      .update({
        ...output,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  },

  canvas: async (userId, startupId, output) => {
    // Upsert lean canvas
    const { data: existing } = await supabase
      .from("lean_canvases")
      .select("id")
      .eq("startup_id", startupId)
      .single();

    if (existing) {
      await supabase
        .from("lean_canvases")
        .update({
          ...output,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("lean_canvases").insert({
        startup_id: startupId,
        ...output,
      });
    }
  },

  startup: async (userId, startupId, output) => {
    await supabase
      .from("startups")
      .update({
        ...output,
        updated_at: new Date().toISOString(),
      })
      .eq("id", startupId);
  },

  tasks: async (userId, startupId, output) => {
    // Create tasks from output array (tasks table: startup_id, created_by, no user_id)
    if (Array.isArray(output)) {
      const tasks = output.map((task) => ({
        startup_id: startupId,
        created_by: userId,
        title: task.title,
        description: task.description ?? "",
        priority: task.priority || "medium",
        status: "todo",
        due_at: task.due_date ?? null,
        tags: task.tags || [],
      }));
      await supabase.from("tasks").insert(tasks);
    }
  },

  validation: async (userId, startupId, output) => {
    // Store validation results in validation_reports (schema: 20260129110000)
    await supabase.from("validation_reports").insert({
      user_id: userId,
      startup_id: startupId,
      overall_score: output.score ?? output.overall_score ?? null,
      problem_score: output.categories?.problem ?? null,
      market_score: output.categories?.market ?? null,
      solution_score: output.categories?.solution ?? null,
      business_score: output.categories?.business ?? null,
      verdict: output.verdict ?? null,
      report_data: output,
      validation_type: "prompt_pack",
    });
  },

  pitch_deck: async (userId, startupId, output) => {
    // Get or create pitch_decks row, then upsert pitch_deck_slides (deck_id, slide_number)
    if (!output.slides || !Array.isArray(output.slides) || output.slides.length === 0) return;
    const { data: existingDeck } = await supabase
      .from("pitch_decks")
      .select("id")
      .eq("startup_id", startupId)
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    let deckId: string;
    if (existingDeck?.id) {
      deckId = existingDeck.id;
    } else {
      const { data: newDeck, error: deckErr } = await supabase
        .from("pitch_decks")
        .insert({
          startup_id: startupId,
          status: "draft",
          deck_type: "investor",
          metadata: { source: "automation_engine" },
        })
        .select("id")
        .single();
      if (deckErr || !newDeck?.id) return;
      deckId = newDeck.id;
    }
    for (let i = 0; i < output.slides.length; i++) {
      const slide = output.slides[i];
      await supabase.from("pitch_deck_slides").upsert(
        {
          deck_id: deckId,
          slide_number: (slide.order ?? slide.order_index ?? i + 1) as number,
          slide_type: (slide.type ?? slide.slide_type ?? "custom") as string,
          title: slide.title ?? "",
          content: slide.content ?? null,
          subtitle: slide.subtitle ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "deck_id,slide_number" }
      );
    }
  },
};

// Execute a single prompt step
async function executeStep(
  step: any,
  context: any,
  previousOutputs: any[]
): Promise<any> {
  const model = step.ai_model || "gemini";
  const prompt = buildPromptWithContext(step.prompt_template, context, previousOutputs);

  let result: string;

  if (model === "gemini" || model.startsWith("gemini")) {
    const geminiClient = getGeminiClient();
    const geminiModel = geminiClient.getGenerativeModel({
      model: AI_MODELS.gemini,
    });
    const response = await geminiModel.generateContent(prompt);
    result = response.response.text();
  } else if (model === "claude" || model.startsWith("claude")) {
    const anthropicClient = getAnthropicClient();
    const modelId =
      step.requires_reasoning === true
        ? AI_MODELS.claude_reasoning
        : AI_MODELS.claude_fast;

    const response = await anthropicClient.messages.create({
      model: modelId,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    result =
      response.content[0].type === "text" ? response.content[0].text : "";
  } else {
    throw new Error(`Unknown AI model: ${model}`);
  }

  // Parse JSON if expected
  if (step.output_format === "json") {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : result;
      return JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("Failed to parse JSON output:", e);
      return { raw: result };
    }
  }

  return result;
}

// Build prompt with context substitution
function buildPromptWithContext(
  template: string,
  context: any,
  previousOutputs: any[]
): string {
  let prompt = template;

  // Replace context placeholders
  for (const [key, value] of Object.entries(context)) {
    const placeholder = `{{${key}}}`;
    const replacement =
      typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
    prompt = prompt.replaceAll(placeholder, replacement);
  }

  // Replace previous output placeholders
  previousOutputs.forEach((output, index) => {
    const placeholder = `{{step_${index + 1}_output}}`;
    const replacement =
      typeof output === "object" ? JSON.stringify(output, null, 2) : String(output);
    prompt = prompt.replaceAll(placeholder, replacement);
  });

  // Replace last output placeholder
  if (previousOutputs.length > 0) {
    const lastOutput = previousOutputs[previousOutputs.length - 1];
    const replacement =
      typeof lastOutput === "object"
        ? JSON.stringify(lastOutput, null, 2)
        : String(lastOutput);
    prompt = prompt.replaceAll("{{previous_output}}", replacement);
  }

  return prompt;
}

// Apply outputs to targets
async function applyOutputs(
  targets: string[],
  outputs: any,
  userId: string,
  startupId: string
): Promise<string[]> {
  const applied: string[] = [];

  for (const target of targets) {
    const handler = OUTPUT_TARGETS[target];
    if (handler && outputs[target]) {
      try {
        await handler(userId, startupId, outputs[target]);
        applied.push(target);
      } catch (e) {
        console.error(`Failed to apply output to ${target}:`, e);
      }
    }
  }

  return applied;
}

// Main handler
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
      } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    let result: any;

    switch (action) {
      // =====================================================
      // EMIT EVENT
      // =====================================================
      case "emit_event": {
        const { event_name, payload = {}, source = "frontend" } = params;

        if (!event_name) {
          throw new Error("event_name is required");
        }

        // Get user's startup via org (startups have org_id, not user_id)
        const { data: userStartup } = await supabase
          .from("profiles")
          .select("org_id")
          .eq("id", userId)
          .single();

        let startupId: string | null = null;
        if (userStartup?.org_id) {
          const { data: startup } = await supabase
            .from("startups")
            .select("id")
            .eq("org_id", userStartup.org_id)
            .limit(1)
            .single();
          startupId = startup?.id || null;
        }

        // Insert event
        const { data: event, error: eventError } = await supabase
          .from("automation_events")
          .insert({
            user_id: userId,
            startup_id: startupId,
            event_name,
            event_payload: payload,
            source,
          })
          .select()
          .single();

        if (eventError) throw eventError;

        // Find and trigger matching automations
        const { data: triggers } = await supabase
          .from("automation_triggers")
          .select("*")
          .eq("is_active", true)
          .eq("trigger_type", "event")
          .eq("event_name", event_name);

        const triggeredAutomations: string[] = [];

        if (triggers && triggers.length > 0) {
          for (const trigger of triggers) {
            // Check conditions
            if (
              trigger.condition_rules &&
              Object.keys(trigger.condition_rules).length > 0
            ) {
              const { data: matches } = await supabase.rpc(
                "check_condition_rules",
                {
                  p_rules: trigger.condition_rules,
                  p_payload: payload,
                }
              );
              if (!matches) continue;
            }

            // Create execution
            const { data: execution } = await supabase
              .from("automation_executions")
              .insert({
                trigger_id: trigger.id,
                user_id: userId,
                startup_id: startupId,
                pack_id: trigger.pack_id,
                playbook_id: trigger.playbook_id,
                trigger_event: event_name,
                trigger_payload: payload,
                status:
                  trigger.execution_mode === "sync" ? "running" : "pending",
                started_at:
                  trigger.execution_mode === "sync"
                    ? new Date().toISOString()
                    : null,
              })
              .select()
              .single();

            if (execution) {
              triggeredAutomations.push(execution.id);

              // Execute synchronously if needed
              if (trigger.execution_mode === "sync" && startupId) {
                await executeAutomation(
                  execution.id,
                  userId!,
                  startupId,
                  trigger
                );
              }
            }
          }
        }

        // Update event with triggered automations
        await supabase
          .from("automation_events")
          .update({
            processed: true,
            processed_at: new Date().toISOString(),
            triggered_automations: triggeredAutomations,
          })
          .eq("id", event.id);

        result = {
          event_id: event.id,
          triggered_count: triggeredAutomations.length,
          triggered_automations: triggeredAutomations,
        };
        break;
      }

      // =====================================================
      // EXECUTE AUTOMATION
      // =====================================================
      case "execute_automation": {
        const { execution_id } = params;

        if (!execution_id) {
          throw new Error("execution_id is required");
        }

        // Get execution details
        const { data: execution, error: execError } = await supabase
          .from("automation_executions")
          .select(
            `
            *,
            trigger:automation_triggers(*),
            pack:prompt_packs(*, steps:prompt_pack_steps(*))
          `
          )
          .eq("id", execution_id)
          .single();

        if (execError || !execution) {
          throw new Error("Execution not found");
        }

        result = await executeAutomation(
          execution_id,
          execution.user_id,
          execution.startup_id,
          execution.trigger
        );
        break;
      }

      // =====================================================
      // GET EXECUTIONS
      // =====================================================
      case "get_executions": {
        const { status, limit = 20, offset = 0 } = params;

        let query = supabase
          .from("automation_executions")
          .select(
            `
            *,
            trigger:automation_triggers(name, event_name),
            pack:prompt_packs(title, category)
          `
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (status) {
          query = query.eq("status", status);
        }

        const { data: executions, error } = await query;

        if (error) throw error;

        result = { executions };
        break;
      }

      // =====================================================
      // START CHAIN
      // =====================================================
      case "start_chain": {
        const { chain_id, initial_context = {} } = params;

        if (!chain_id) {
          throw new Error("chain_id is required");
        }

        // Get chain
        const { data: chain, error: chainError } = await supabase
          .from("automation_chains")
          .select("*")
          .eq("id", chain_id)
          .eq("is_active", true)
          .single();

        if (chainError || !chain) {
          throw new Error("Chain not found or inactive");
        }

        // Get user's startup via org (startups have org_id, not user_id)
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("org_id")
          .eq("id", userId)
          .single();

        let chainStartupId: string | null = null;
        if (userProfile?.org_id) {
          const { data: startup } = await supabase
            .from("startups")
            .select("id")
            .eq("org_id", userProfile.org_id)
            .limit(1)
            .single();
          chainStartupId = startup?.id || null;
        }

        // Create chain execution
        const { data: chainExec, error: execError } = await supabase
          .from("chain_executions")
          .insert({
            chain_id,
            user_id: userId,
            startup_id: chainStartupId,
            total_steps: chain.steps?.length || 0,
            status: "running",
            started_at: new Date().toISOString(),
            step_results: [{ step: 0, context: initial_context }],
          })
          .select()
          .single();

        if (execError) throw execError;

        // Execute first step
        const firstStep = chain.steps[0];
        if (firstStep) {
          await executeChainStep(chainExec.id, 0, chain.steps, initial_context);
        }

        result = {
          chain_execution_id: chainExec.id,
          status: "running",
          total_steps: chain.steps?.length || 0,
        };
        break;
      }

      // =====================================================
      // GET CHAIN STATUS
      // =====================================================
      case "get_chain_status": {
        const { chain_execution_id } = params;

        const { data: chainExec, error } = await supabase
          .from("chain_executions")
          .select(
            `
            *,
            chain:automation_chains(name, description)
          `
          )
          .eq("id", chain_execution_id)
          .eq("user_id", userId)
          .single();

        if (error) throw error;

        result = chainExec;
        break;
      }

      // =====================================================
      // LIST TRIGGERS
      // =====================================================
      case "list_triggers": {
        const { event_name } = params;

        let query = supabase
          .from("automation_triggers")
          .select(
            `
            *,
            pack:prompt_packs(title, category),
            playbook:playbooks(name, description)
          `
          )
          .eq("is_active", true);

        if (event_name) {
          query = query.eq("event_name", event_name);
        }

        const { data: triggers, error } = await query;

        if (error) throw error;

        result = { triggers };
        break;
      }

      // =====================================================
      // LIST CHAINS
      // =====================================================
      case "list_chains": {
        const { data: chains, error } = await supabase
          .from("automation_chains")
          .select("*")
          .eq("is_active", true);

        if (error) throw error;

        result = { chains };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Automation engine error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Execute a full automation
async function executeAutomation(
  executionId: string,
  userId: string,
  startupId: string,
  trigger: any
): Promise<any> {
  try {
    // Update status to running
    await supabase
      .from("automation_executions")
      .update({ status: "running", started_at: new Date().toISOString() })
      .eq("id", executionId);

    // Get pack steps
    const { data: pack } = await supabase
      .from("prompt_packs")
      .select("*, steps:prompt_pack_steps(*)")
      .eq("id", trigger.pack_id)
      .single();

    if (!pack) {
      throw new Error("Pack not found");
    }

    // Get context
    const context = await buildContext(userId, startupId);

    // Execute steps
    const outputs: any = {};
    const previousOutputs: any[] = [];
    let stepsCompleted = 0;

    const steps = pack.steps.sort(
      (a: any, b: any) => a.step_order - b.step_order
    );

    for (const step of steps) {
      const stepOutput = await executeStep(step, context, previousOutputs);
      previousOutputs.push(stepOutput);

      // Map output to target
      if (step.apply_to && step.apply_to.length > 0) {
        for (const target of step.apply_to) {
          outputs[target] = stepOutput;
        }
      }

      stepsCompleted++;

      // Update progress
      await supabase
        .from("automation_executions")
        .update({ steps_completed: stepsCompleted })
        .eq("id", executionId);
    }

    // Auto-apply outputs if enabled
    let appliedTo: string[] = [];
    if (trigger.auto_apply_outputs && trigger.output_targets) {
      appliedTo = await applyOutputs(
        trigger.output_targets,
        outputs,
        userId,
        startupId
      );
    }

    // Mark complete
    await supabase
      .from("automation_executions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        outputs,
        applied_to: appliedTo,
      })
      .eq("id", executionId);

    return {
      status: "completed",
      steps_completed: stepsCompleted,
      outputs,
      applied_to: appliedTo,
    };
  } catch (error) {
    // Mark failed
    await supabase
      .from("automation_executions")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
        completed_at: new Date().toISOString(),
      })
      .eq("id", executionId);

    throw error;
  }
}

// Execute a chain step
async function executeChainStep(
  chainExecutionId: string,
  stepIndex: number,
  steps: any[],
  context: any
): Promise<void> {
  const step = steps[stepIndex];
  if (!step) return;

  try {
    // Get chain execution
    const { data: chainExec } = await supabase
      .from("chain_executions")
      .select("*")
      .eq("id", chainExecutionId)
      .single();

    if (!chainExec || chainExec.status === "cancelled") return;

    // Resolve pack_id from slug if needed
    let packId = step.pack_id;
    if (!packId && step.pack_slug) {
      const { data: pack } = await supabase
        .from("prompt_packs")
        .select("id")
        .eq("slug", step.pack_slug)
        .single();
      packId = pack?.id;
    }

    if (!packId) {
      console.error(`Chain step ${stepIndex}: pack not found for slug ${step.pack_slug}`);
      return;
    }

    // Execute the pack for this step
    const { data: trigger } = await supabase
      .from("automation_triggers")
      .select("*")
      .eq("pack_id", packId)
      .maybeSingle();

    // Create execution for this step
    const { data: execution } = await supabase
      .from("automation_executions")
      .insert({
        trigger_id: trigger?.id,
        user_id: chainExec.user_id,
        startup_id: chainExec.startup_id,
        pack_id: packId,
        trigger_payload: context,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Execute
    const result = await executeAutomation(
      execution!.id,
      chainExec.user_id,
      chainExec.startup_id,
      { pack_id: packId, auto_apply_outputs: true, output_targets: step.apply_to || [] }
    );

    // Update chain progress
    const stepResults = [...(chainExec.step_results || []), { step: stepIndex, result }];

    // Check if more steps
    const nextIndex = stepIndex + 1;
    const hasMore = nextIndex < steps.length;

    await supabase
      .from("chain_executions")
      .update({
        current_step: nextIndex,
        step_results: stepResults,
        status: hasMore ? "running" : "completed",
        completed_at: hasMore ? null : new Date().toISOString(),
        next_step_at: hasMore && steps[nextIndex].delay_seconds
          ? new Date(Date.now() + steps[nextIndex].delay_seconds * 1000).toISOString()
          : null,
      })
      .eq("id", chainExecutionId);

    // Execute next step if no delay
    if (hasMore && !steps[nextIndex].delay_seconds) {
      await executeChainStep(chainExecutionId, nextIndex, steps, {
        ...context,
        previous_step_result: result,
      });
    }
  } catch (error) {
    await supabase
      .from("chain_executions")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", chainExecutionId);
  }
}

// Build context from user data
async function buildContext(
  userId: string,
  startupId: string
): Promise<Record<string, any>> {
  const [profileResult, startupResult, canvasResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase
      .from("lean_canvases")
      .select("*")
      .eq("startup_id", startupId)
      .single(),
  ]);

  return {
    profile: profileResult.data || {},
    startup: startupResult.data || {},
    canvas: canvasResult.data || {},
    startup_name: startupResult.data?.name || "Your startup",
    industry: startupResult.data?.industry || "technology",
    stage: startupResult.data?.stage || "idea",
    problem: canvasResult.data?.problem || "",
    solution: canvasResult.data?.solution || "",
    unique_value: canvasResult.data?.unique_value_proposition || "",
    customer_segments: canvasResult.data?.customer_segments || "",
    revenue_streams: canvasResult.data?.revenue_streams || "",
  };
}
