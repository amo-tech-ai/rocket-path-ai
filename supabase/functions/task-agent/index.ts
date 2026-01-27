import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

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

// ============ HELPERS ============

async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                    text.match(/\{[\s\S]*\}/) ||
                    text.match(/\[[\s\S]*\]/);
  
  if (jsonMatch) {
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonStr);
  }
  throw new Error("Could not parse JSON from response");
}

function createSupabaseClient(authHeader: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
}

type SupabaseClient = ReturnType<typeof createSupabaseClient>;

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

  const prompt = `Generate ${options.count || 5} actionable tasks for this startup:

STARTUP:
- Name: ${startupData?.name || "Startup"}
- Stage: ${startupData?.stage || "early"}
- Industry: ${startupData?.industry || "Tech"}
- Description: ${startupData?.description || ""}
${projectContext}

FOCUS AREA: ${options.focusArea || "General growth and development"}
ADDITIONAL CONTEXT: ${options.context || ""}

EXISTING TASKS (avoid duplicates): ${existingTaskTitles || "None"}

Generate tasks as JSON:
{
  "tasks": [
    {
      "title": "Clear, actionable task title",
      "description": "Detailed description with specific steps",
      "priority": "high|medium|low",
      "category": "product|marketing|sales|operations|finance|legal|hiring",
      "estimated_hours": 2,
      "suggested_due_days": 7
    }
  ],
  "reasoning": "Why these tasks are recommended for this stage"
}`;

  const response = await callGemini(prompt, "You are a startup advisor generating actionable, specific tasks. Focus on high-impact activities that match the startup's current stage.");
  const result = parseJsonResponse<{
    tasks: Array<{
      title: string;
      description: string;
      priority: string;
      category: string;
      estimated_hours: number;
      suggested_due_days: number;
    }>;
    reasoning: string;
  }>(response);

  return {
    success: true,
    tasks: result.tasks,
    reasoning: result.reasoning,
    count: result.tasks.length,
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

  const prompt = `Prioritize these tasks for a ${startupData?.stage || "early"} stage ${startupData?.industry || "tech"} startup:

TASKS:
${taskDescriptions}

Provide prioritization as JSON:
{
  "prioritized_order": [
    {
      "task_id": "uuid",
      "new_priority": "high|medium|low",
      "rank": 1,
      "reasoning": "Why this should be done first",
      "impact_score": 85,
      "urgency_score": 70,
      "effort_estimate": "low|medium|high"
    }
  ],
  "focus_recommendation": "What to focus on this week",
  "defer_recommendation": "What can wait"
}`;

  const response = await callGemini(prompt, "You are a productivity expert helping founders prioritize effectively. Consider impact, urgency, and dependencies.");
  const result = parseJsonResponse<{
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
  }>(response);

  // Update task priorities in database
  for (const item of result.prioritized_order) {
    await supabase
      .from("tasks")
      .update({ priority: item.new_priority })
      .eq("id", item.task_id);
  }

  return {
    success: true,
    prioritized_tasks: result.prioritized_order,
    focus_recommendation: result.focus_recommendation,
    defer_recommendation: result.defer_recommendation,
    updated_count: result.prioritized_order.length,
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

  const prompt = `Suggest the best tasks to work on right now:

CONTEXT:
- Startup Stage: ${startupData?.stage || "early"}
- Available Time: ${options.availableTime || 60} minutes
- Energy Level: ${options.energyLevel || "medium"}
- Focus Area: ${options.focusArea || "Any"}

AVAILABLE TASKS:
${taskDescriptions}

Provide suggestions as JSON:
{
  "suggestions": [
    {
      "title": "Task title from list",
      "why_now": "Reason this is the best choice right now",
      "estimated_time": "30 min",
      "momentum_tip": "How to get started quickly"
    }
  ],
  "batch_suggestion": "Group of small tasks that can be done together",
  "avoid_now": "What to skip given current energy/time"
}`;

  const response = await callGemini(prompt, "You are a productivity coach. Match task suggestions to available time and energy.");
  const result = parseJsonResponse<{
    suggestions: Array<{
      title: string;
      why_now: string;
      estimated_time: string;
      momentum_tip: string;
    }>;
    batch_suggestion: string;
    avoid_now: string;
  }>(response);

  return {
    success: true,
    suggestions: result.suggestions,
    batch_suggestion: result.batch_suggestion,
    avoid_now: result.avoid_now,
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

  const prompt = `Break down this task into smaller, actionable subtasks:

TASK: ${taskData.title}
DESCRIPTION: ${taskData.description || "No description"}
PRIORITY: ${taskData.priority}

Create 3-7 subtasks as JSON:
{
  "subtasks": [
    {
      "title": "Specific subtask title",
      "description": "What exactly to do",
      "estimated_minutes": 30,
      "order": 1,
      "can_be_delegated": true,
      "tools_needed": ["Tool or resource needed"]
    }
  ],
  "total_estimated_hours": 4,
  "complexity": "low|medium|high",
  "suggested_approach": "Best way to tackle this task"
}`;

  const response = await callGemini(prompt, "You are a project management expert. Break tasks into concrete, achievable steps.");
  const result = parseJsonResponse<{
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
  }>(response);

  return {
    success: true,
    parent_task: taskData.title,
    subtasks: result.subtasks,
    total_estimated_hours: result.total_estimated_hours,
    complexity: result.complexity,
    suggested_approach: result.suggested_approach,
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

  const prompt = `Analyze this task completion data and provide insights:

PERIOD: Last ${days} days
TOTAL TASKS CREATED: ${taskList.length}
COMPLETED: ${completed.length}
IN PROGRESS: ${inProgress.length}
PENDING: ${pending.length}
COMPLETION RATE: ${Math.round((completed.length / Math.max(taskList.length, 1)) * 100)}%

BY CATEGORY (completed): ${JSON.stringify(byCategory)}
BY PRIORITY (completed): ${JSON.stringify(byPriority)}

Provide productivity analysis as JSON:
{
  "health_score": 75,
  "summary": "Brief productivity assessment",
  "strengths": ["What's working well"],
  "areas_to_improve": ["What needs attention"],
  "recommendations": [
    {
      "action": "Specific recommendation",
      "expected_impact": "How it will help"
    }
  ],
  "focus_suggestion": "What to prioritize next"
}`;

  const response = await callGemini(prompt, "You are a productivity analyst. Provide actionable insights based on task completion patterns.");
  const result = parseJsonResponse<{
    health_score: number;
    summary: string;
    strengths: string[];
    areas_to_improve: string[];
    recommendations: Array<{ action: string; expected_impact: string }>;
    focus_suggestion: string;
  }>(response);

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
    ...result,
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

  const prompt = `Create an optimal daily work plan:

STARTUP: ${startupData?.name || "Startup"} (${startupData?.stage || "early"} stage)
AVAILABLE HOURS: ${options.availableHours || 8}
PRIORITY FOCUS: ${options.priorities?.join(", ") || "balanced"}

TASKS TO CHOOSE FROM:
${taskDescriptions}

Create a daily plan as JSON:
{
  "plan": [
    {
      "time_block": "9:00 AM - 10:30 AM",
      "task": "Task title",
      "duration_minutes": 90,
      "focus_type": "deep_work|meetings|admin",
      "energy_required": "high|medium|low",
      "tip": "How to maximize this block"
    }
  ],
  "breaks": ["12:00 PM - 12:30 PM: Lunch"],
  "buffer_time": "30 min for unexpected items",
  "daily_goal": "Main accomplishment for the day",
  "evening_prep": "What to prepare for tomorrow"
}`;

  const response = await callGemini(prompt, "You are a time management expert. Create realistic, energy-aware daily plans.");
  const result = parseJsonResponse<{
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
  }>(response);

  return {
    success: true,
    available_hours: options.availableHours || 8,
    ...result,
  };
}

// ============ MAIN HANDLER ============

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createSupabaseClient(authHeader);
    const { action, ...payload } = await req.json();

    console.log(`[task-agent] Action: ${action}`, { startup_id: payload.startup_id });

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
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
