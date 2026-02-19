/**
 * Insights Generator - Main Handler
 * Generates daily insights, stage recommendations, weekly summaries.
 * Migrated to shared patterns (006-EFN): G1 schemas, shared CORS, rate limiting.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import {
  DAILY_INSIGHTS_SYSTEM,
  STAGE_RECOMMENDATIONS_SYSTEM,
  WEEKLY_SUMMARY_SYSTEM,
  BUSINESS_READINESS_SYSTEM,
  OUTCOMES_DASHBOARD_SYSTEM,
  dailyInsightsSchema,
  stageRecommendationsSchema,
  weeklySummarySchema,
  businessReadinessSchema,
  outcomesDashboardSchema,
} from "./prompt.ts";

const MODEL = "gemini-3-flash-preview";

// ============ TYPES ============

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
  taskStats: { total: number; pending: number; completed: number; overdue: number };
  dealStats: { total: number; pipeline_value: number; won: number; lost: number };
  investorStats: { total: number; contacted: number; meetings: number; interested: number };
  documentStats: { total: number; drafts: number; published: number };
  recentActivity: string[];
}

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

// ============ CONTEXT GATHERING ============

async function gatherStartupContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<StartupContext> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [startupRes, tasksRes, dealsRes, investorsRes, documentsRes, activitiesRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("tasks").select("id, status, due_at").eq("startup_id", startupId),
    supabase.from("deals").select("id, stage, amount, is_active").eq("startup_id", startupId),
    supabase.from("investors").select("id, status").eq("startup_id", startupId),
    supabase.from("documents").select("id, status").eq("startup_id", startupId),
    supabase.from("activities").select("title, activity_type, created_at").eq("startup_id", startupId)
      .gte("created_at", weekAgo.toISOString()).order("created_at", { ascending: false }).limit(10),
  ]);

  const startup = startupRes.data || {};
  const tasks = tasksRes.data || [];
  const deals = dealsRes.data || [];
  const investors = investorsRes.data || [];
  const documents = documentsRes.data || [];
  const activities = activitiesRes.data || [];

  const overdueTasks = tasks.filter(
    (t: { status: string; due_at?: string }) => t.status !== "completed" && t.due_at && new Date(t.due_at) < now
  );
  const activeDeals = deals.filter((d: { is_active?: boolean }) => d.is_active !== false);
  const pipelineValue = activeDeals.reduce((sum: number, d: { amount?: number }) => sum + (d.amount || 0), 0);

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
      won: deals.filter((d: { stage?: string }) => d.stage === "won" || d.stage === "closed_won").length,
      lost: deals.filter((d: { stage?: string }) => d.stage === "lost" || d.stage === "closed_lost").length,
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

async function generateDailyInsights(supabase: SupabaseClient, startupId: string) {
  const context = await gatherStartupContext(supabase, startupId);

  const userPrompt = `Analyze this startup's current state and generate actionable insights:

STARTUP:
- Name: ${context.startup.name || "Startup"}
- Stage: ${context.startup.stage || "early"}
- Industry: ${context.startup.industry || "Tech"}
- Currently Raising: ${context.startup.is_raising ? "Yes" : "No"}

TASK HEALTH:
- Total: ${context.taskStats.total}, Pending: ${context.taskStats.pending}
- Completed: ${context.taskStats.completed}, Overdue: ${context.taskStats.overdue}

SALES/DEALS:
- Pipeline: ${context.dealStats.total} deals worth $${context.dealStats.pipeline_value.toLocaleString()}
- Won: ${context.dealStats.won}, Lost: ${context.dealStats.lost}

FUNDRAISING:
- Investors: ${context.investorStats.total}, Contacted: ${context.investorStats.contacted}
- Meetings: ${context.investorStats.meetings}, Interested: ${context.investorStats.interested}

DOCUMENTS: ${context.documentStats.total} total, ${context.documentStats.drafts} drafts

RECENT ACTIVITY:
${context.recentActivity.slice(0, 5).join("\n")}

Generate 3-5 high-priority insights.`;

  const result = await callGemini(MODEL, DAILY_INSIGHTS_SYSTEM, userPrompt, {
    responseJsonSchema: dailyInsightsSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    insights: Insight[];
    summary: string;
    focus_area: string;
    quick_wins: string[];
  }>(result.text);

  return {
    success: true,
    startup_id: startupId,
    generated_at: new Date().toISOString(),
    ...(parsed || { insights: [], summary: "Failed to generate insights", focus_area: "", quick_wins: [] }),
  };
}

function generateQuickInsights(tasks: { priority?: string }[], deals: { amount?: number }[], startupId: string) {
  const highPriorityTasks = tasks.filter((t) => t.priority === "high");
  const pipelineValue = deals.reduce((sum, d) => sum + (d.amount || 0), 0);

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

async function getStageRecommendations(supabase: SupabaseClient, startupId: string) {
  const { data: startup } = await supabase.from("startups").select("*").eq("id", startupId).single();

  const stage = startup?.stage || "idea";

  const userPrompt = `Provide stage-specific recommendations for a ${stage} stage startup:

STARTUP CONTEXT:
- Name: ${startup?.name || "Startup"}
- Industry: ${startup?.industry || "Tech"}
- Stage: ${stage}
- Currently Fundraising: ${startup?.is_raising ? "Yes" : "No"}
- Description: ${startup?.description || "N/A"}

Provide recommendations.`;

  const result = await callGemini(MODEL, STAGE_RECOMMENDATIONS_SYSTEM, userPrompt, {
    responseJsonSchema: stageRecommendationsSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    stage_assessment: string;
    key_milestones: { milestone: string; why_important: string; typical_timeline: string }[];
    priorities: { area: string; recommendation: string; anti_pattern: string }[];
    fundraising_readiness: { score: number; gaps: string[]; strengths: string[] };
    next_stage_requirements: string[];
  }>(result.text);

  return {
    success: true,
    startup_id: startupId,
    current_stage: stage,
    ...(parsed || { stage_assessment: "", key_milestones: [], priorities: [], fundraising_readiness: { score: 0, gaps: [], strengths: [] }, next_stage_requirements: [] }),
  };
}

async function generateWeeklySummary(supabase: SupabaseClient, startupId: string) {
  const context = await gatherStartupContext(supabase, startupId);

  const completionRate = context.taskStats.total > 0
    ? Math.round((context.taskStats.completed / context.taskStats.total) * 100)
    : 0;

  const userPrompt = `Generate a weekly summary and next week's plan:

STARTUP: ${context.startup.name || "Startup"} (${context.startup.stage} stage)

THIS WEEK'S METRICS:
- Tasks: ${context.taskStats.completed} completed of ${context.taskStats.total} (${completionRate}%)
- Overdue: ${context.taskStats.overdue}
- Deals: $${context.dealStats.pipeline_value.toLocaleString()} pipeline
- Investors: ${context.investorStats.meetings} meetings, ${context.investorStats.interested} interested
- Documents: ${context.documentStats.total} total, ${context.documentStats.drafts} in progress

RECENT ACTIVITY:
${context.recentActivity.join("\n")}

Generate weekly summary.`;

  const result = await callGemini(MODEL, WEEKLY_SUMMARY_SYSTEM, userPrompt, {
    responseJsonSchema: weeklySummarySchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    week_score: number;
    highlights: string[];
    challenges: string[];
    metrics_summary: Record<string, string>;
    next_week_priorities: { priority: string; reason: string; success_metric: string }[];
    ceo_note: string;
  }>(result.text);

  return {
    success: true,
    startup_id: startupId,
    week_ending: new Date().toISOString().split("T")[0],
    raw_stats: { tasks: context.taskStats, deals: context.dealStats, investors: context.investorStats },
    ...(parsed || { week_score: 0, highlights: [], challenges: [], metrics_summary: {}, next_week_priorities: [], ceo_note: "" }),
  };
}

// ============ READINESS CONTEXT ============

async function gatherReadinessContext(supabase: SupabaseClient, startupId: string) {
  const [startupRes, experimentsRes, sprintsRes, contactsRes, documentsRes, tasksRes, activitiesRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("experiments").select("id, status, hypothesis, results").eq("startup_id", startupId),
    supabase.from("sprints").select("id, status, start_date, end_date").eq("startup_id", startupId),
    supabase.from("contacts").select("id, type, status").eq("startup_id", startupId),
    supabase.from("documents").select("id, status, doc_type").eq("startup_id", startupId),
    supabase.from("tasks").select("id, status, priority, due_at, completed_at").eq("startup_id", startupId),
    supabase.from("activities").select("id, activity_type, created_at").eq("startup_id", startupId)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const startup = startupRes.data || {};
  const experiments = experimentsRes.data || [];
  const sprints = sprintsRes.data || [];
  const contacts = contactsRes.data || [];
  const documents = documentsRes.data || [];
  const tasks = tasksRes.data || [];
  const activities = activitiesRes.data || [];

  const completedTasks = tasks.filter((t: { status: string }) => t.status === "completed");
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const completedSprints = sprints.filter((s: { status: string }) => s.status === "completed");
  const sprintCompletionRate = sprints.length > 0 ? Math.round((completedSprints.length / sprints.length) * 100) : 0;

  const validatedExperiments = experiments.filter((e: { status: string }) => e.status === "completed" || e.status === "validated");

  return {
    startup,
    experiments: { total: experiments.length, validated: validatedExperiments.length },
    sprints: { total: sprints.length, completed: completedSprints.length, completionRate: sprintCompletionRate },
    contacts: { total: contacts.length, customers: contacts.filter((c: { type?: string }) => c.type === "customer").length },
    documents: { total: documents.length, published: documents.filter((d: { status?: string }) => d.status === "published" || d.status === "approved").length },
    tasks: { total: totalTasks, completed: completedTasks.length, completionRate },
    activities: { total30d: activities.length },
  };
}

async function computeReadiness(supabase: SupabaseClient, startupId: string) {
  const ctx = await gatherReadinessContext(supabase, startupId);

  const userPrompt = `Assess launch readiness for this startup:

STARTUP:
- Name: ${ctx.startup.name || "Startup"}
- Stage: ${ctx.startup.stage || "early"}
- Industry: ${ctx.startup.industry || "Tech"}
- Description: ${ctx.startup.description || "N/A"}
- Currently Raising: ${ctx.startup.is_raising ? `Yes ($${ctx.startup.raise_amount || "?"}k)` : "No"}

TRUST SIGNALS:
- Customer contacts: ${ctx.contacts.customers}
- Published documents: ${ctx.documents.published} of ${ctx.documents.total}
- Validated experiments: ${ctx.experiments.validated} of ${ctx.experiments.total}

RELIABILITY SIGNALS:
- Task completion rate: ${ctx.tasks.completionRate}% (${ctx.tasks.completed}/${ctx.tasks.total})
- Sprint completion rate: ${ctx.sprints.completionRate}% (${ctx.sprints.completed}/${ctx.sprints.total})

COST CONTROL SIGNALS:
- Stage: ${ctx.startup.stage || "early"}
- Is raising: ${ctx.startup.is_raising ? "Yes" : "No"}
- Raise amount: $${ctx.startup.raise_amount || 0}k

SUPPORT SIGNALS:
- Total documents: ${ctx.documents.total} (${ctx.documents.published} published)
- Total contacts: ${ctx.contacts.total}

ACTIVITY (last 30 days):
- ${ctx.activities.total30d} activities logged

Score each dimension 0-100. Determine verdict. Identify top 3 blockers. Create 4-week launch plan.`;

  const result = await callGemini(MODEL, BUSINESS_READINESS_SYSTEM, userPrompt, {
    responseJsonSchema: businessReadinessSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    overall_score: number;
    verdict: "GREEN" | "YELLOW" | "RED";
    summary: string;
    dimensions: Record<string, { score: number; label: string; evidence: string[]; gaps: string[] }>;
    blockers: { title: string; severity: string; dimension: string; fix: string }[];
    launch_plan: { week: number; goal: string; tasks: string[] }[];
  }>(result.text);

  return {
    success: true,
    startup_id: startupId,
    generated_at: new Date().toISOString(),
    ...(parsed || {
      overall_score: 0,
      verdict: "RED" as const,
      summary: "Failed to compute readiness",
      dimensions: {},
      blockers: [],
      launch_plan: [],
    }),
  };
}

// ============ OUTCOMES CONTEXT ============

async function gatherOutcomesContext(supabase: SupabaseClient, startupId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  const [decisionsRes, experimentsRes, assumptionsRes, interviewsRes, activitiesRes, aiUsageRes, sprintsRes, tasksRes] = await Promise.all([
    supabase.from("decisions").select("id, status, created_at").eq("startup_id", startupId),
    supabase.from("experiments").select("id, status, created_at").eq("startup_id", startupId),
    supabase.from("assumptions").select("id, status, created_at").eq("startup_id", startupId),
    supabase.from("interview_responses").select("id, created_at").eq("startup_id", startupId),
    supabase.from("activities").select("id, activity_type, created_at").eq("startup_id", startupId)
      .gte("created_at", ninetyDaysAgo),
    supabase.from("ai_usage_limits").select("monthly_cost, monthly_calls").eq("startup_id", startupId).single(),
    supabase.from("sprints").select("id, status, created_at").eq("startup_id", startupId),
    supabase.from("tasks").select("id, status, completed_at, created_at").eq("startup_id", startupId)
      .gte("created_at", thirtyDaysAgo),
  ]);

  const decisions = decisionsRes.data || [];
  const experiments = experimentsRes.data || [];
  const assumptions = assumptionsRes.data || [];
  const interviews = interviewsRes.data || [];
  const activities = activitiesRes.data || [];
  const aiUsage = aiUsageRes.data || { monthly_cost: 0, monthly_calls: 0 };
  const sprints = sprintsRes.data || [];
  const recentTasks = tasksRes.data || [];

  const actedDecisions = decisions.filter((d: { status?: string }) => d.status === "implemented" || d.status === "approved");
  const validatedExperiments = experiments.filter((e: { status: string }) => e.status === "completed" || e.status === "validated");
  const testedAssumptions = assumptions.filter((a: { status?: string }) => a.status === "validated" || a.status === "invalidated");
  const completedSprints = sprints.filter((s: { status: string }) => s.status === "completed");
  const completedTasks = recentTasks.filter((t: { status: string }) => t.status === "completed");

  // Activity vs outcomes ratio
  const totalActivity = activities.length;
  const totalOutcomes = actedDecisions.length + validatedExperiments.length + testedAssumptions.length + completedSprints.length;

  return {
    decisions: { total: decisions.length, acted: actedDecisions.length },
    experiments: { total: experiments.length, validated: validatedExperiments.length },
    assumptions: { total: assumptions.length, tested: testedAssumptions.length },
    interviews: { total: interviews.length },
    sprints: { total: sprints.length, completed: completedSprints.length },
    tasks: { recent: recentTasks.length, completed: completedTasks.length },
    aiUsage: { cost: aiUsage.monthly_cost || 0, calls: aiUsage.monthly_calls || 0 },
    activity: { total90d: totalActivity, outcomes: totalOutcomes },
  };
}

async function computeOutcomes(supabase: SupabaseClient, startupId: string) {
  const { data: startup } = await supabase.from("startups").select("name, stage, industry").eq("id", startupId).single();
  const ctx = await gatherOutcomesContext(supabase, startupId);

  const ratio = ctx.activity.outcomes > 0
    ? Math.round((ctx.activity.total90d / ctx.activity.outcomes) * 10) / 10
    : ctx.activity.total90d > 0 ? 99.0 : 0;

  const userPrompt = `Analyze outcomes and ROI for this startup:

STARTUP:
- Name: ${startup?.name || "Startup"}
- Stage: ${startup?.stage || "early"}
- Industry: ${startup?.industry || "Tech"}

OUTCOMES:
- Decisions made: ${ctx.decisions.total} (${ctx.decisions.acted} acted on)
- Experiments: ${ctx.experiments.total} (${ctx.experiments.validated} validated)
- Assumptions tested: ${ctx.assumptions.tested} of ${ctx.assumptions.total}
- Interviews conducted: ${ctx.interviews.total}
- Sprints completed: ${ctx.sprints.completed} of ${ctx.sprints.total}
- Recent tasks completed: ${ctx.tasks.completed} of ${ctx.tasks.recent} (last 30 days)

AI USAGE:
- Monthly cost: $${ctx.aiUsage.cost.toFixed(2)}
- Monthly calls: ${ctx.aiUsage.calls}
- Total insights generated: ${ctx.decisions.total + ctx.experiments.total + ctx.assumptions.total}

ACTIVITY vs OUTCOMES (90 days):
- Total activities: ${ctx.activity.total90d}
- Real outcomes: ${ctx.activity.outcomes}
- Activity-to-outcome ratio: ${ratio}:1
- ROI Mirage threshold: 6:1

Analyze outcomes, calculate time saved, cost per insight, retention funnel, detect ROI Mirage if ratio > 6:1, and provide founder decisions.`;

  const result = await callGemini(MODEL, OUTCOMES_DASHBOARD_SYSTEM, userPrompt, {
    responseJsonSchema: outcomesDashboardSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    summary: string;
    outcome_cards: { decisions_made: number; plans_completed: number; experiments_validated: number; assumptions_tested: number; interviews_conducted: number };
    time_saved: { hours_per_month: number; value_estimate: string; breakdown: { area: string; hours: number }[] };
    cost_per_insight: { total_ai_cost: number; total_insights: number; cost_per_insight: number; trend: string };
    retention_funnel: { stage: string; count: number; percentage: number }[];
    roi_mirage: { detected: boolean; activity_count: number; outcome_count: number; ratio: number; warnings: string[] };
    founder_decisions: { area: string; recommendation: string; reason: string; action: string }[];
  }>(result.text);

  return {
    success: true,
    startup_id: startupId,
    generated_at: new Date().toISOString(),
    raw_stats: {
      decisions: ctx.decisions,
      experiments: ctx.experiments,
      assumptions: ctx.assumptions,
      interviews: ctx.interviews,
      sprints: ctx.sprints,
      aiUsage: ctx.aiUsage,
      activityRatio: ratio,
    },
    ...(parsed || {
      summary: "Failed to compute outcomes",
      outcome_cards: { decisions_made: 0, plans_completed: 0, experiments_validated: 0, assumptions_tested: 0, interviews_conducted: 0 },
      time_saved: { hours_per_month: 0, value_estimate: "$0", breakdown: [] },
      cost_per_insight: { total_ai_cost: 0, total_insights: 0, cost_per_insight: 0, trend: "stable" },
      retention_funnel: [],
      roi_mirage: { detected: false, activity_count: 0, outcome_count: 0, ratio: 0, warnings: [] },
      founder_decisions: [],
    }),
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
    const rateResult = checkRateLimit(user.id, "insights-generator", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    let action: string;
    let payload: Record<string, unknown>;
    try {
      const parsed = await req.json();
      action = parsed.action;
      payload = parsed;
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log(`[insights-generator] Action: ${action}, User: ${user.id}`);

    let result: unknown;

    switch (action) {
      case "generate_daily_insights":
        result = await generateDailyInsights(supabase, payload.startup_id);
        break;

      case "generate_quick_insights": {
        const [tasksRes, dealsRes] = await Promise.all([
          supabase.from("tasks").select("id, status, priority").eq("startup_id", payload.startup_id).in("status", ["pending", "in_progress"]),
          supabase.from("deals").select("id, stage, amount").eq("startup_id", payload.startup_id).eq("is_active", true),
        ]);
        result = generateQuickInsights(tasksRes.data || [], dealsRes.data || [], payload.startup_id);
        break;
      }

      case "get_stage_recommendations":
        result = await getStageRecommendations(supabase, payload.startup_id);
        break;

      case "generate_weekly_summary":
        result = await generateWeeklySummary(supabase, payload.startup_id);
        break;

      case "compute_readiness":
        result = await computeReadiness(supabase, payload.startup_id);
        break;

      case "compute_outcomes":
        result = await computeOutcomes(supabase, payload.startup_id);
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
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error", success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
