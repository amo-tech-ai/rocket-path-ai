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

interface StartupContext {
  startup: {
    id: string;
    name?: string;
    stage?: string;
    industry?: string;
    description?: string;
    is_raising?: boolean;
    raise_amount?: number;
  };
  taskStats: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
  };
  dealStats: {
    total: number;
    pipeline_value: number;
    won: number;
    lost: number;
  };
  investorStats: {
    total: number;
    contacted: number;
    meetings: number;
    interested: number;
  };
  documentStats: {
    total: number;
    drafts: number;
    published: number;
  };
  recentActivity: string[];
}

interface Insight {
  category: "opportunity" | "risk" | "action" | "milestone";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  suggested_action?: string;
  metric?: string;
  trend?: "up" | "down" | "stable";
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

// ============ CONTEXT GATHERING ============

async function gatherStartupContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<StartupContext> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Parallel data fetching
  const [
    startupRes,
    tasksRes,
    dealsRes,
    investorsRes,
    documentsRes,
    activitiesRes,
  ] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("tasks").select("id, status, due_at").eq("startup_id", startupId),
    supabase.from("deals").select("id, stage, amount, is_active").eq("startup_id", startupId),
    supabase.from("investors").select("id, status").eq("startup_id", startupId),
    supabase.from("documents").select("id, status").eq("startup_id", startupId),
    supabase
      .from("activities")
      .select("title, activity_type, created_at")
      .eq("startup_id", startupId)
      .gte("created_at", weekAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const startup = startupRes.data || {};
  const tasks = tasksRes.data || [];
  const deals = dealsRes.data || [];
  const investors = investorsRes.data || [];
  const documents = documentsRes.data || [];
  const activities = activitiesRes.data || [];

  // Calculate task stats
  const overdueTasks = tasks.filter(
    (t: { status: string; due_at?: string }) =>
      t.status !== "completed" && t.due_at && new Date(t.due_at) < now
  );

  // Calculate deal stats
  const activeDeals = deals.filter((d: { is_active?: boolean }) => d.is_active !== false);
  const pipelineValue = activeDeals.reduce((sum: number, d: { amount?: number }) => sum + (d.amount || 0), 0);
  const wonDeals = deals.filter((d: { stage?: string }) => d.stage === "won" || d.stage === "closed_won");
  const lostDeals = deals.filter((d: { stage?: string }) => d.stage === "lost" || d.stage === "closed_lost");

  return {
    startup: {
      id: startupId,
      name: startup.name,
      stage: startup.stage,
      industry: startup.industry,
      description: startup.description,
      is_raising: startup.is_raising,
      raise_amount: startup.raise_amount,
    },
    taskStats: {
      total: tasks.length,
      pending: tasks.filter((t: { status: string }) => t.status === "pending").length,
      completed: tasks.filter((t: { status: string }) => t.status === "completed").length,
      overdue: overdueTasks.length,
    },
    dealStats: {
      total: deals.length,
      pipeline_value: pipelineValue,
      won: wonDeals.length,
      lost: lostDeals.length,
    },
    investorStats: {
      total: investors.length,
      contacted: investors.filter((i: { status?: string }) => i.status === "contacted").length,
      meetings: investors.filter((i: { status?: string }) => i.status === "meeting_scheduled" || i.status === "met").length,
      interested: investors.filter((i: { status?: string }) => i.status === "interested" || i.status === "committed").length,
    },
    documentStats: {
      total: documents.length,
      drafts: documents.filter((d: { status?: string }) => d.status === "draft").length,
      published: documents.filter((d: { status?: string }) => d.status === "approved" || d.status === "published").length,
    },
    recentActivity: activities.map((a: { title: string; activity_type: string }) => `${a.activity_type}: ${a.title}`),
  };
}

// ============ ACTION HANDLERS ============

// 1. Generate daily insights
async function generateDailyInsights(
  supabase: SupabaseClient,
  startupId: string
) {
  const context = await gatherStartupContext(supabase, startupId);

  const prompt = `Analyze this startup's current state and generate actionable insights:

STARTUP:
- Name: ${context.startup.name || "Startup"}
- Stage: ${context.startup.stage || "early"}
- Industry: ${context.startup.industry || "Tech"}
- Currently Raising: ${context.startup.is_raising ? "Yes" : "No"}

TASK HEALTH:
- Total: ${context.taskStats.total}
- Pending: ${context.taskStats.pending}
- Completed: ${context.taskStats.completed}
- Overdue: ${context.taskStats.overdue}

SALES/DEALS:
- Pipeline: ${context.dealStats.total} deals worth $${context.dealStats.pipeline_value.toLocaleString()}
- Won: ${context.dealStats.won}
- Lost: ${context.dealStats.lost}

FUNDRAISING (if applicable):
- Investors Tracked: ${context.investorStats.total}
- Contacted: ${context.investorStats.contacted}
- Meetings: ${context.investorStats.meetings}
- Interested: ${context.investorStats.interested}

DOCUMENTS:
- Total: ${context.documentStats.total}
- Drafts: ${context.documentStats.drafts}

RECENT ACTIVITY:
${context.recentActivity.slice(0, 5).join("\n")}

Generate 3-5 high-priority insights as JSON:
{
  "insights": [
    {
      "category": "opportunity|risk|action|milestone",
      "title": "Brief insight title",
      "description": "Detailed explanation (2-3 sentences)",
      "priority": "high|medium|low",
      "actionable": true,
      "suggested_action": "Specific next step",
      "metric": "Relevant number or percentage",
      "trend": "up|down|stable"
    }
  ],
  "summary": "One-sentence overall assessment",
  "focus_area": "What deserves the most attention today",
  "quick_wins": ["3 quick wins that can be done today"]
}`;

  const response = await callGemini(
    prompt,
    "You are a startup advisor providing daily strategic insights. Focus on actionable, specific recommendations. Prioritize opportunities and risks that need immediate attention."
  );

  const result = parseJsonResponse<{
    insights: Insight[];
    summary: string;
    focus_area: string;
    quick_wins: string[];
  }>(response);

  return {
    success: true,
    startup_id: startupId,
    generated_at: new Date().toISOString(),
    ...result,
  };
}

// 2. Generate quick insights (faster, cached-friendly)
async function generateQuickInsights(
  supabase: SupabaseClient,
  startupId: string
) {
  // Simpler data fetch for quick insights
  const [tasksRes, dealsRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, status, priority")
      .eq("startup_id", startupId)
      .in("status", ["pending", "in_progress"]),
    supabase
      .from("deals")
      .select("id, stage, amount")
      .eq("startup_id", startupId)
      .eq("is_active", true),
  ]);

  const tasks = tasksRes.data || [];
  const deals = dealsRes.data || [];

  const highPriorityTasks = tasks.filter((t: { priority?: string }) => t.priority === "high");
  const pipelineValue = deals.reduce((sum: number, d: { amount?: number }) => sum + (d.amount || 0), 0);

  // Generate quick insights without AI for speed
  const insights: Insight[] = [];

  if (highPriorityTasks.length > 3) {
    insights.push({
      category: "action",
      title: "High-Priority Backlog",
      description: `You have ${highPriorityTasks.length} high-priority tasks pending. Consider delegating or re-prioritizing.`,
      priority: "high",
      actionable: true,
      suggested_action: "Review and prioritize your task list",
      metric: `${highPriorityTasks.length} high-priority`,
      trend: "stable",
    });
  }

  if (pipelineValue > 0) {
    insights.push({
      category: "opportunity",
      title: "Active Pipeline",
      description: `Your sales pipeline has $${pipelineValue.toLocaleString()} in potential value across ${deals.length} deals.`,
      priority: "medium",
      actionable: true,
      suggested_action: "Follow up on stalled deals",
      metric: `$${pipelineValue.toLocaleString()}`,
      trend: "stable",
    });
  }

  if (tasks.length === 0) {
    insights.push({
      category: "action",
      title: "No Active Tasks",
      description: "You have no pending tasks. Time to plan your next priorities!",
      priority: "medium",
      actionable: true,
      suggested_action: "Generate AI tasks based on your stage",
    });
  }

  return {
    success: true,
    startup_id: startupId,
    generated_at: new Date().toISOString(),
    insights,
    summary: `${tasks.length} active tasks, $${pipelineValue.toLocaleString()} in pipeline`,
    is_cached: false,
  };
}

// 3. Get stage-specific recommendations
async function getStageRecommendations(
  supabase: SupabaseClient,
  startupId: string
) {
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const stage = startup?.stage || "idea";
  const isRaising = startup?.is_raising || false;

  const prompt = `Provide stage-specific recommendations for a ${stage} stage startup:

STARTUP CONTEXT:
- Name: ${startup?.name || "Startup"}
- Industry: ${startup?.industry || "Tech"}
- Stage: ${stage}
- Currently Fundraising: ${isRaising ? "Yes" : "No"}
- Description: ${startup?.description || "N/A"}

Provide recommendations as JSON:
{
  "stage_assessment": "Where this startup is in its journey",
  "key_milestones": [
    {
      "milestone": "Next milestone to achieve",
      "why_important": "Why this matters at this stage",
      "typical_timeline": "2-4 weeks"
    }
  ],
  "priorities": [
    {
      "area": "product|market|team|funding",
      "recommendation": "What to focus on",
      "anti_pattern": "What to avoid"
    }
  ],
  "fundraising_readiness": {
    "score": 65,
    "gaps": ["What's missing for fundraising"],
    "strengths": ["What's strong for fundraising"]
  },
  "next_stage_requirements": ["What's needed to reach the next stage"]
}`;

  const response = await callGemini(
    prompt,
    "You are an experienced startup advisor. Provide specific, actionable stage-appropriate guidance."
  );

  const result = parseJsonResponse<{
    stage_assessment: string;
    key_milestones: Array<{
      milestone: string;
      why_important: string;
      typical_timeline: string;
    }>;
    priorities: Array<{
      area: string;
      recommendation: string;
      anti_pattern: string;
    }>;
    fundraising_readiness: {
      score: number;
      gaps: string[];
      strengths: string[];
    };
    next_stage_requirements: string[];
  }>(response);

  return {
    success: true,
    startup_id: startupId,
    current_stage: stage,
    ...result,
  };
}

// 4. Generate weekly summary
async function generateWeeklySummary(
  supabase: SupabaseClient,
  startupId: string
) {
  const context = await gatherStartupContext(supabase, startupId);

  const completionRate = context.taskStats.total > 0
    ? Math.round((context.taskStats.completed / context.taskStats.total) * 100)
    : 0;

  const prompt = `Generate a weekly summary and next week's plan:

STARTUP: ${context.startup.name || "Startup"} (${context.startup.stage} stage)

THIS WEEK'S METRICS:
- Tasks: ${context.taskStats.completed} completed of ${context.taskStats.total} (${completionRate}%)
- Overdue: ${context.taskStats.overdue}
- Deals: $${context.dealStats.pipeline_value.toLocaleString()} pipeline
- Investors: ${context.investorStats.meetings} meetings, ${context.investorStats.interested} interested
- Documents: ${context.documentStats.total} total, ${context.documentStats.drafts} in progress

RECENT ACTIVITY:
${context.recentActivity.join("\n")}

Generate weekly summary as JSON:
{
  "week_score": 75,
  "highlights": ["Top 3 wins this week"],
  "challenges": ["Top 2 challenges faced"],
  "metrics_summary": {
    "productivity": "Above average - good task completion",
    "sales": "Pipeline growing",
    "fundraising": "Making progress on outreach"
  },
  "next_week_priorities": [
    {
      "priority": "What to focus on",
      "reason": "Why this matters",
      "success_metric": "How to measure success"
    }
  ],
  "ceo_note": "Personalized encouragement or warning for the founder"
}`;

  const response = await callGemini(
    prompt,
    "You are a supportive but honest startup advisor providing weekly performance reviews. Be specific and actionable."
  );

  const result = parseJsonResponse<{
    week_score: number;
    highlights: string[];
    challenges: string[];
    metrics_summary: Record<string, string>;
    next_week_priorities: Array<{
      priority: string;
      reason: string;
      success_metric: string;
    }>;
    ceo_note: string;
  }>(response);

  return {
    success: true,
    startup_id: startupId,
    week_ending: new Date().toISOString().split("T")[0],
    raw_stats: {
      tasks: context.taskStats,
      deals: context.dealStats,
      investors: context.investorStats,
    },
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

    console.log(`[insights-generator] Action: ${action}`, { startup_id: payload.startup_id });

    let result: unknown;

    switch (action) {
      case "generate_daily_insights":
        result = await generateDailyInsights(supabase, payload.startup_id);
        break;

      case "generate_quick_insights":
        result = await generateQuickInsights(supabase, payload.startup_id);
        break;

      case "get_stage_recommendations":
        result = await getStageRecommendations(supabase, payload.startup_id);
        break;

      case "generate_weekly_summary":
        result = await generateWeeklySummary(supabase, payload.startup_id);
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
    console.error("[insights-generator] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
