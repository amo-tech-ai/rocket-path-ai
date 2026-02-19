/**
 * Task Agent - Main Handler
 * Generates, prioritizes, breaks down, and plans tasks for startups.
 * Migrated to shared patterns (006-EFN): G1 schemas, shared CORS, rate limiting.
 * 6 actions: generate_tasks, prioritize_tasks, suggest_next,
 *            breakdown_task, analyze_productivity, generate_daily_plan
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import {
  GENERATE_TASKS_SYSTEM,
  PRIORITIZE_TASKS_SYSTEM,
  SUGGEST_NEXT_SYSTEM,
  BREAKDOWN_TASK_SYSTEM,
  ANALYZE_PRODUCTIVITY_SYSTEM,
  DAILY_PLAN_SYSTEM,
  generateTasksSchema,
  prioritizeTasksSchema,
  suggestNextSchema,
  breakdownTaskSchema,
  analyzeProductivitySchema,
  dailyPlanSchema,
} from "./prompt.ts";

const MODEL = "gemini-3-flash-preview";

// ============ TYPES ============

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  due_at?: string;
  project_id?: string;
  startup_id: string;
  ai_generated?: boolean;
  ai_source?: string;
}

interface Startup {
  id: string;
  name?: string;
  stage?: string;
  industry?: string;
  description?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
}

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

// ============ ACTION HANDLERS ============

// 1. Generate tasks from project description or startup stage
async function generateTasks(
  supabase: SupabaseClient,
  startupId: string,
  options: {
    projectId?: string;
    context?: string;
    count?: number;
    focusArea?: string;
  }
) {
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const startupData = startup as Startup | null;

  let projectContext = "";
  if (options.projectId) {
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", options.projectId)
      .single();
    const projectData = project as Project | null;
    projectContext = projectData
      ? `\nProject: ${projectData.name}\nDescription: ${projectData.description || "No description"}`
      : "";
  }

  const { data: existingTasks } = await supabase
    .from("tasks")
    .select("title")
    .eq("startup_id", startupId)
    .limit(20);

  const existingTaskTitles = (existingTasks || []).map((t: { title: string }) => t.title).join(", ");

  const userPrompt = `Generate ${options.count || 5} actionable tasks for this startup:

STARTUP:
- Name: ${startupData?.name || "Startup"}
- Stage: ${startupData?.stage || "early"}
- Industry: ${startupData?.industry || "Tech"}
- Description: ${startupData?.description || ""}
${projectContext}

FOCUS AREA: ${options.focusArea || "General growth and development"}
ADDITIONAL CONTEXT: ${options.context || ""}

EXISTING TASKS (avoid duplicates): ${existingTaskTitles || "None"}`;

  const result = await callGemini(MODEL, GENERATE_TASKS_SYSTEM, userPrompt, {
    responseJsonSchema: generateTasksSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    tasks: Array<{
      title: string;
      description: string;
      priority: string;
      category: string;
      estimated_hours: number;
      suggested_due_days: number;
    }>;
    reasoning: string;
  }>(result.text);

  return {
    success: true,
    tasks: parsed?.tasks || [],
    reasoning: parsed?.reasoning || "",
    count: parsed?.tasks?.length || 0,
  };
}

// 2. Prioritize existing tasks
async function prioritizeTasks(
  supabase: SupabaseClient,
  startupId: string,
  taskIds?: string[]
) {
  let query = supabase
    .from("tasks")
    .select("*")
    .eq("startup_id", startupId)
    .in("status", ["pending", "in_progress"]);

  if (taskIds?.length) {
    query = query.in("id", taskIds);
  }

  const { data: tasks } = await query.limit(30);
  const taskList = (tasks || []) as Task[];

  if (taskList.length === 0) {
    return {
      success: true,
      prioritized_tasks: [],
      summary: "No tasks to prioritize",
    };
  }

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const startupData = startup as Startup | null;

  const taskDescriptions = taskList
    .map((t, i) => `${i + 1}. [${t.id}] "${t.title}" - Priority: ${t.priority}, Status: ${t.status}, Category: ${t.category || "uncategorized"}`)
    .join("\n");

  const userPrompt = `Prioritize these tasks for a ${startupData?.stage || "early"} stage ${startupData?.industry || "tech"} startup:

TASKS:
${taskDescriptions}`;

  const result = await callGemini(MODEL, PRIORITIZE_TASKS_SYSTEM, userPrompt, {
    responseJsonSchema: prioritizeTasksSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    prioritized_order: Array<{
      task_id: string;
      new_priority: string;
      rank: number;
      reasoning: string;
      impact_score: number;
      urgency_score: number;
      effort_estimate: string;
    }>;
    focus_recommendation: string;
    defer_recommendation: string;
  }>(result.text);

  const prioritizedOrder = parsed?.prioritized_order || [];

  // Update task priorities in database
  for (const item of prioritizedOrder) {
    await supabase
      .from("tasks")
      .update({ priority: item.new_priority })
      .eq("id", item.task_id);
  }

  return {
    success: true,
    prioritized_tasks: prioritizedOrder,
    focus_recommendation: parsed?.focus_recommendation || "",
    defer_recommendation: parsed?.defer_recommendation || "",
    updated_count: prioritizedOrder.length,
  };
}

// 3. Suggest next tasks to work on
async function suggestNextTasks(
  supabase: SupabaseClient,
  startupId: string,
  options: {
    availableTime?: number; // minutes
    energyLevel?: "high" | "medium" | "low";
    focusArea?: string;
  }
) {
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("startup_id", startupId)
    .in("status", ["pending", "in_progress"])
    .order("priority", { ascending: true })
    .limit(20);

  const taskList = (tasks || []) as Task[];

  if (taskList.length === 0) {
    return {
      success: true,
      suggestions: [],
      message: "No pending tasks. Time to generate some!",
    };
  }

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const startupData = startup as Startup | null;

  const taskDescriptions = taskList
    .map((t) => `- [${t.priority}] "${t.title}" (${t.status})${t.category ? ` [${t.category}]` : ""}`)
    .join("\n");

  const userPrompt = `Suggest the best tasks to work on right now:

CONTEXT:
- Startup Stage: ${startupData?.stage || "early"}
- Available Time: ${options.availableTime || 60} minutes
- Energy Level: ${options.energyLevel || "medium"}
- Focus Area: ${options.focusArea || "Any"}

AVAILABLE TASKS:
${taskDescriptions}`;

  const result = await callGemini(MODEL, SUGGEST_NEXT_SYSTEM, userPrompt, {
    responseJsonSchema: suggestNextSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    suggestions: Array<{
      title: string;
      why_now: string;
      estimated_time: string;
      momentum_tip: string;
    }>;
    batch_suggestion: string;
    avoid_now: string;
  }>(result.text);

  return {
    success: true,
    suggestions: parsed?.suggestions || [],
    batch_suggestion: parsed?.batch_suggestion || "",
    avoid_now: parsed?.avoid_now || "",
  };
}

// 4. Break down a complex task
async function breakdownTask(
  supabase: SupabaseClient,
  startupId: string,
  taskId: string
) {
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  const taskData = task as Task | null;

  if (!taskData) {
    throw new Error("Task not found");
  }

  const userPrompt = `Break down this task into smaller, actionable subtasks:

TASK: ${taskData.title}
DESCRIPTION: ${taskData.description || "No description"}
PRIORITY: ${taskData.priority}

Create 3-7 subtasks.`;

  const result = await callGemini(MODEL, BREAKDOWN_TASK_SYSTEM, userPrompt, {
    responseJsonSchema: breakdownTaskSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    subtasks: Array<{
      title: string;
      description: string;
      estimated_minutes: number;
      order: number;
      can_be_delegated: boolean;
      tools_needed: string[];
    }>;
    total_estimated_hours: number;
    complexity: string;
    suggested_approach: string;
  }>(result.text);

  return {
    success: true,
    parent_task: taskData.title,
    subtasks: parsed?.subtasks || [],
    total_estimated_hours: parsed?.total_estimated_hours || 0,
    complexity: parsed?.complexity || "medium",
    suggested_approach: parsed?.suggested_approach || "",
  };
}

// 5. Analyze task completion patterns
async function analyzeProductivity(
  supabase: SupabaseClient,
  startupId: string,
  days: number = 30
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("startup_id", startupId)
    .gte("created_at", since.toISOString());

  const taskList = (tasks || []) as Task[];

  const completed = taskList.filter((t) => t.status === "completed");
  const pending = taskList.filter((t) => t.status === "pending");
  const inProgress = taskList.filter((t) => t.status === "in_progress");

  const byCategory: Record<string, number> = {};
  const byPriority: Record<string, number> = {};

  completed.forEach((t) => {
    byCategory[t.category || "uncategorized"] = (byCategory[t.category || "uncategorized"] || 0) + 1;
    byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
  });

  const userPrompt = `Analyze this task completion data and provide insights:

PERIOD: Last ${days} days
TOTAL TASKS CREATED: ${taskList.length}
COMPLETED: ${completed.length}
IN PROGRESS: ${inProgress.length}
PENDING: ${pending.length}
COMPLETION RATE: ${Math.round((completed.length / Math.max(taskList.length, 1)) * 100)}%

BY CATEGORY (completed): ${JSON.stringify(byCategory)}
BY PRIORITY (completed): ${JSON.stringify(byPriority)}`;

  const result = await callGemini(MODEL, ANALYZE_PRODUCTIVITY_SYSTEM, userPrompt, {
    responseJsonSchema: analyzeProductivitySchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    health_score: number;
    summary: string;
    strengths: string[];
    areas_to_improve: string[];
    recommendations: Array<{ action: string; expected_impact: string }>;
    focus_suggestion: string;
  }>(result.text);

  return {
    success: true,
    period_days: days,
    stats: {
      total: taskList.length,
      completed: completed.length,
      in_progress: inProgress.length,
      pending: pending.length,
      completion_rate: Math.round((completed.length / Math.max(taskList.length, 1)) * 100),
    },
    health_score: parsed?.health_score || 0,
    summary: parsed?.summary || "",
    strengths: parsed?.strengths || [],
    areas_to_improve: parsed?.areas_to_improve || [],
    recommendations: parsed?.recommendations || [],
    focus_suggestion: parsed?.focus_suggestion || "",
  };
}

// 6. Generate daily task plan
async function generateDailyPlan(
  supabase: SupabaseClient,
  startupId: string,
  options: {
    availableHours?: number;
    priorities?: string[];
  }
) {
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("startup_id", startupId)
    .in("status", ["pending", "in_progress"])
    .order("priority", { ascending: true })
    .limit(30);

  const taskList = (tasks || []) as Task[];

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const startupData = startup as Startup | null;

  const taskDescriptions = taskList
    .map((t) => `- "${t.title}" [${t.priority}] ${t.status === "in_progress" ? "(in progress)" : ""}`)
    .join("\n");

  const userPrompt = `Create an optimal daily work plan:

STARTUP: ${startupData?.name || "Startup"} (${startupData?.stage || "early"} stage)
AVAILABLE HOURS: ${options.availableHours || 8}
PRIORITY FOCUS: ${options.priorities?.join(", ") || "balanced"}

TASKS TO CHOOSE FROM:
${taskDescriptions}`;

  const result = await callGemini(MODEL, DAILY_PLAN_SYSTEM, userPrompt, {
    responseJsonSchema: dailyPlanSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    plan: Array<{
      time_block: string;
      task: string;
      duration_minutes: number;
      focus_type: string;
      energy_required: string;
      tip: string;
    }>;
    breaks: string[];
    buffer_time: string;
    daily_goal: string;
    evening_prep: string;
  }>(result.text);

  return {
    success: true,
    available_hours: options.availableHours || 8,
    plan: parsed?.plan || [],
    breaks: parsed?.breaks || [],
    buffer_time: parsed?.buffer_time || "",
    daily_goal: parsed?.daily_goal || "",
    evening_prep: parsed?.evening_prep || "",
  };
}

// ============ MAIN HANDLER ============

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = getCorsHeaders(req);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit
    const rateResult = checkRateLimit(user.id, "task-agent", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    const { action, ...payload } = await req.json();
    console.log(`[task-agent] Action: ${action}, User: ${user.id}`);

    let result: unknown;

    switch (action) {
      case "generate_tasks":
        result = await generateTasks(supabase, payload.startup_id, {
          projectId: payload.project_id,
          context: payload.context,
          count: payload.count,
          focusArea: payload.focus_area,
        });
        break;

      case "prioritize_tasks":
        result = await prioritizeTasks(supabase, payload.startup_id, payload.task_ids);
        break;

      case "suggest_next":
        result = await suggestNextTasks(supabase, payload.startup_id, {
          availableTime: payload.available_time,
          energyLevel: payload.energy_level,
          focusArea: payload.focus_area,
        });
        break;

      case "breakdown_task":
        result = await breakdownTask(supabase, payload.startup_id, payload.task_id);
        break;

      case "analyze_productivity":
        result = await analyzeProductivity(supabase, payload.startup_id, payload.days);
        break;

      case "generate_daily_plan":
        result = await generateDailyPlan(supabase, payload.startup_id, {
          availableHours: payload.available_hours,
          priorities: payload.priorities,
        });
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[task-agent] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
