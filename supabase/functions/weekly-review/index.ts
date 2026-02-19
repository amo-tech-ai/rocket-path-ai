/**
 * Weekly Review Edge Function
 * AI-powered weekly review generation + coaching insights.
 * Actions: generate (create AI review), coach (coaching insights for a review)
 *
 * CRUD (create, update, delete, list) stays in the frontend hook via direct
 * Supabase calls — RLS policies protect those. This function handles the AI
 * operations that need server-side context gathering + Gemini calls.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

const MODEL = "gemini-3-flash-preview";

// ============ TYPES ============

interface StartupContext {
  startup: {
    id: string;
    name?: string;
    stage?: string;
    industry?: string;
    description?: string;
  };
  taskStats: { total: number; pending: number; completed: number; overdue: number };
  dealStats: { total: number; pipeline_value: number; won: number; lost: number };
  investorStats: { total: number; contacted: number; meetings: number; interested: number };
  recentActivity: string[];
  recentExperiments: { hypothesis: string; status: string }[];
  recentDecisions: { title: string; status: string }[];
}

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

// ============ SCHEMAS ============

const weeklyReviewSchema = {
  type: "object",
  required: ["week_score", "summary", "key_learnings", "priorities_next_week", "coaching"],
  properties: {
    week_score: { type: "integer", description: "Overall week score 0-100" },
    summary: { type: "string", description: "2-3 sentence CEO-style week summary" },
    key_learnings: {
      type: "array",
      items: { type: "string" },
      description: "Top 3-5 learnings from the week",
    },
    priorities_next_week: {
      type: "array",
      items: {
        type: "object",
        required: ["priority", "reason", "success_metric"],
        properties: {
          priority: { type: "string" },
          reason: { type: "string" },
          success_metric: { type: "string" },
        },
      },
      description: "Top 3 priorities for next week with reasons",
    },
    coaching: {
      type: "object",
      required: ["headline", "observation", "suggestion", "question"],
      properties: {
        headline: { type: "string", description: "One-line coaching headline" },
        observation: { type: "string", description: "What the data shows" },
        suggestion: { type: "string", description: "Concrete next step" },
        question: { type: "string", description: "Reflective question for the founder" },
      },
    },
    metrics_summary: {
      type: "object",
      properties: {
        productivity: { type: "string" },
        sales: { type: "string" },
        fundraising: { type: "string" },
      },
    },
  },
};

const coachingSchema = {
  type: "object",
  required: ["insights", "patterns", "action_items"],
  properties: {
    insights: {
      type: "array",
      items: {
        type: "object",
        required: ["type", "title", "detail"],
        properties: {
          type: { type: "string", enum: ["strength", "risk", "opportunity", "pattern"] },
          title: { type: "string" },
          detail: { type: "string" },
        },
      },
    },
    patterns: {
      type: "array",
      items: { type: "string" },
      description: "Patterns noticed across multiple reviews",
    },
    action_items: {
      type: "array",
      items: {
        type: "object",
        required: ["action", "why", "when"],
        properties: {
          action: { type: "string" },
          why: { type: "string" },
          when: { type: "string", enum: ["this_week", "next_week", "this_month"] },
        },
      },
    },
    coach_note: { type: "string", description: "Personal encouragement or tough-love note" },
  },
};

// ============ CONTEXT GATHERING ============

async function gatherStartupContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<StartupContext> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [startupRes, tasksRes, dealsRes, investorsRes, activitiesRes, experimentsRes, decisionsRes] =
    await Promise.all([
      supabase.from("startups").select("id, name, stage, industry, description").eq("id", startupId).single(),
      supabase.from("tasks").select("id, status, due_at").eq("startup_id", startupId),
      supabase.from("deals").select("id, stage, amount, is_active").eq("startup_id", startupId),
      supabase.from("investors").select("id, status").eq("startup_id", startupId),
      supabase
        .from("activities")
        .select("title, activity_type, created_at")
        .eq("startup_id", startupId)
        .gte("created_at", weekAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("experiments")
        .select("hypothesis, status")
        .eq("startup_id", startupId)
        .gte("created_at", weekAgo.toISOString())
        .limit(5),
      supabase
        .from("decisions")
        .select("title, status")
        .eq("startup_id", startupId)
        .gte("created_at", weekAgo.toISOString())
        .limit(5),
    ]);

  const startup = startupRes.data || {};
  const tasks = tasksRes.data || [];
  const deals = dealsRes.data || [];
  const investors = investorsRes.data || [];
  const activities = activitiesRes.data || [];
  const experiments = experimentsRes.data || [];
  const decisions = decisionsRes.data || [];

  const overdueTasks = tasks.filter(
    (t: { status: string; due_at?: string }) =>
      t.status !== "completed" && t.due_at && new Date(t.due_at) < now
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
      meetings: investors.filter(
        (i: { status?: string }) => i.status === "meeting_scheduled" || i.status === "met"
      ).length,
      interested: investors.filter(
        (i: { status?: string }) => i.status === "interested" || i.status === "committed"
      ).length,
    },
    recentActivity: activities.map(
      (a: { title: string; activity_type: string }) => `${a.activity_type}: ${a.title}`
    ),
    recentExperiments: experiments,
    recentDecisions: decisions,
  };
}

// ============ ACTION: GENERATE ============

async function generateReview(supabase: SupabaseClient, startupId: string, userId: string) {
  const context = await gatherStartupContext(supabase, startupId);

  const completionRate =
    context.taskStats.total > 0
      ? Math.round((context.taskStats.completed / context.taskStats.total) * 100)
      : 0;

  const systemPrompt = `You are a supportive but honest startup advisor providing weekly performance reviews with coaching insights. Be specific, actionable, and data-driven. Include a coaching insight that helps the founder reflect and improve.`;

  const userPrompt = `Generate a weekly review with coaching insight:

STARTUP: ${context.startup.name || "Startup"} (${context.startup.stage || "early"} stage, ${context.startup.industry || "Tech"})

THIS WEEK'S METRICS:
- Tasks: ${context.taskStats.completed} completed of ${context.taskStats.total} (${completionRate}%)
- Overdue: ${context.taskStats.overdue}
- Deals: $${context.dealStats.pipeline_value.toLocaleString()} pipeline, ${context.dealStats.won} won, ${context.dealStats.lost} lost
- Investors: ${context.investorStats.meetings} meetings, ${context.investorStats.interested} interested

RECENT EXPERIMENTS:
${context.recentExperiments.length > 0 ? context.recentExperiments.map((e) => `- ${e.hypothesis} (${e.status})`).join("\n") : "None this week"}

RECENT DECISIONS:
${context.recentDecisions.length > 0 ? context.recentDecisions.map((d) => `- ${d.title} (${d.status})`).join("\n") : "None this week"}

RECENT ACTIVITY:
${context.recentActivity.slice(0, 10).join("\n") || "No recent activity"}

Generate a weekly review with score, summary, learnings, next-week priorities, and a coaching insight.`;

  const result = await callGemini(MODEL, systemPrompt, userPrompt, {
    responseJsonSchema: weeklyReviewSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    week_score: number;
    summary: string;
    key_learnings: string[];
    priorities_next_week: { priority: string; reason: string; success_metric: string }[];
    coaching: { headline: string; observation: string; suggestion: string; question: string };
    metrics_summary?: Record<string, string>;
  }>(result.text);

  if (!parsed) {
    throw new Error("Failed to parse AI response");
  }

  // Calculate week boundaries (Monday-Sunday)
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() + mondayOffset);
  weekStart.setUTCHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);

  const weekStartStr = weekStart.toISOString().split("T")[0];
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  // Check for duplicate week
  const { data: existing } = await supabase
    .from("weekly_reviews")
    .select("id")
    .eq("startup_id", startupId)
    .eq("week_start", weekStartStr)
    .maybeSingle();

  if (existing) {
    // Update existing review instead of failing on unique constraint
    const { data: updated, error: updateErr } = await supabase
      .from("weekly_reviews")
      .update({
        summary: parsed.summary,
        key_learnings: parsed.key_learnings,
        priorities_next_week: parsed.priorities_next_week.map((p) => p.priority),
        health_score_end: parsed.week_score,
        tasks_completed: context.taskStats.completed,
        experiments_run: context.recentExperiments.length,
        decisions_made: context.recentDecisions.length,
        ai_generated: true,
        edited_by_user: false,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (updateErr) throw new Error(`Failed to update review: ${updateErr.message}`);

    return {
      success: true,
      review: updated,
      coaching: parsed.coaching,
      priorities_detail: parsed.priorities_next_week,
      metrics_summary: parsed.metrics_summary || {},
      is_update: true,
    };
  }

  // Insert new review
  const { data: review, error: insertErr } = await supabase
    .from("weekly_reviews")
    .insert({
      startup_id: startupId,
      week_start: weekStartStr,
      week_end: weekEndStr,
      summary: parsed.summary,
      key_learnings: parsed.key_learnings,
      priorities_next_week: parsed.priorities_next_week.map((p) => p.priority),
      health_score_end: parsed.week_score,
      tasks_completed: context.taskStats.completed,
      experiments_run: context.recentExperiments.length,
      decisions_made: context.recentDecisions.length,
      assumptions_tested: 0,
      ai_generated: true,
      created_by: userId,
    })
    .select()
    .single();

  if (insertErr) throw new Error(`Failed to create review: ${insertErr.message}`);

  return {
    success: true,
    review,
    coaching: parsed.coaching,
    priorities_detail: parsed.priorities_next_week,
    metrics_summary: parsed.metrics_summary || {},
    is_update: false,
  };
}

// ============ ACTION: COACH ============

async function coachReview(supabase: SupabaseClient, startupId: string, reviewId: string) {
  // Fetch the target review + recent history
  const [reviewRes, historyRes, startupRes] = await Promise.all([
    supabase.from("weekly_reviews").select("*").eq("id", reviewId).single(),
    supabase
      .from("weekly_reviews")
      .select("*")
      .eq("startup_id", startupId)
      .order("week_start", { ascending: false })
      .limit(5),
    supabase.from("startups").select("name, stage, industry").eq("id", startupId).single(),
  ]);

  if (reviewRes.error || !reviewRes.data) {
    throw new Error("Review not found");
  }

  const review = reviewRes.data;
  const history = historyRes.data || [];
  const startup = startupRes.data || {};

  const systemPrompt = `You are a seasoned startup coach analyzing a founder's weekly review. Identify patterns, strengths, and risks. Give honest, specific coaching — not generic motivational advice. Reference their actual data.`;

  const userPrompt = `Coach this founder based on their weekly review:

STARTUP: ${startup.name || "Startup"} (${startup.stage || "early"} stage, ${startup.industry || "Tech"})

THIS WEEK'S REVIEW (${review.week_start} to ${review.week_end}):
- Score: ${review.health_score_end || "N/A"}/100
- Summary: ${review.summary || "No summary"}
- Learnings: ${(review.key_learnings || []).join("; ") || "None"}
- Priorities: ${(review.priorities_next_week || []).join("; ") || "None"}
- Tasks completed: ${review.tasks_completed || 0}
- Experiments run: ${review.experiments_run || 0}
- Decisions made: ${review.decisions_made || 0}

REVIEW HISTORY (last ${history.length} weeks):
${history
  .map(
    (h: { week_start: string; health_score_end?: number; tasks_completed?: number; summary?: string }) =>
      `- ${h.week_start}: score ${h.health_score_end || "?"}, ${h.tasks_completed || 0} tasks, "${(h.summary || "").slice(0, 80)}"`
  )
  .join("\n")}

Provide coaching insights, patterns noticed, and specific action items.`;

  const result = await callGemini(MODEL, systemPrompt, userPrompt, {
    responseJsonSchema: coachingSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    insights: { type: string; title: string; detail: string }[];
    patterns: string[];
    action_items: { action: string; why: string; when: string }[];
    coach_note?: string;
  }>(result.text);

  return {
    success: true,
    review_id: reviewId,
    ...(parsed || { insights: [], patterns: [], action_items: [], coach_note: "" }),
  };
}

// ============ MAIN HANDLER ============

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const corsHeaders = getCorsHeaders(req);

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rateResult = checkRateLimit(user.id, "weekly-review", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, startup_id, review_id } = body as {
      action: string;
      startup_id?: string;
      review_id?: string;
    };

    console.log(`[weekly-review] Action: ${action}, User: ${user.id}`);

    if (!startup_id) {
      return new Response(JSON.stringify({ error: "startup_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: unknown;

    switch (action) {
      case "generate":
        result = await generateReview(supabase, startup_id as string, user.id);
        break;

      case "coach":
        if (!review_id) {
          return new Response(JSON.stringify({ error: "review_id is required for coach action" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        result = await coachReview(supabase, startup_id as string, review_id as string);
        break;

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[weekly-review] Error:", msg);
    const isTimeout = msg.includes("timed out") || msg.includes("hard timeout");
    return new Response(
      JSON.stringify({
        error: isTimeout ? "AI request timed out — please try again" : "Internal server error",
        success: false,
      }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
