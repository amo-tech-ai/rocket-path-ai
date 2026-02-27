import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { verifyAuth } from "../_shared/auth.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

// =============================================================================
// STAGE MILESTONES - What's expected at each stage
// =============================================================================
const STAGE_MILESTONES: Record<string, string[]> = {
  idea: [
    "problem_clarity",
    "target_customer",
    "solution_hypothesis",
  ],
  validation: [
    "customer_interviews",
    "problem_validation",
    "solution_fit",
    "early_traction",
  ],
  mvp: [
    "working_product",
    "first_users",
    "feedback_loop",
    "iteration_cycle",
  ],
  growth: [
    "product_market_fit",
    "revenue_growth",
    "team_building",
    "process_optimization",
  ],
  scale: [
    "market_expansion",
    "operational_excellence",
    "leadership_team",
    "fundraising_readiness",
  ],
};

// Signal weights for scoring
const SIGNAL_WEIGHTS = {
  health_gap: 0.25,
  task_priority: 0.25,
  stage_relevance: 0.25,
  time_urgency: 0.15,
  momentum: 0.10,
};

// =============================================================================
// SIGNAL FETCHERS
// =============================================================================

interface HealthScore {
  overall: number;
  breakdown: Record<string, number>;
}

async function fetchHealthScores(
  supabase: ReturnType<typeof createClient>,
  startupId: string
): Promise<HealthScore | null> {
  const { data } = await supabase
    .from("health_scores")
    .select("overall_score, breakdown")
    .eq("startup_id", startupId)
    .order("computed_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;
  return {
    overall: data.overall_score || 50,
    breakdown: data.breakdown || {},
  };
}

interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  due_at: string | null;
  created_at: string;
  source: string;
  trigger_rule_id: string | null;
}

async function fetchPendingTasks(
  supabase: ReturnType<typeof createClient>,
  startupId: string
): Promise<PendingTask[]> {
  const { data } = await supabase
    .from("tasks")
    .select("id, title, description, priority, category, due_at, created_at, source, trigger_rule_id")
    .eq("startup_id", startupId)
    .eq("status", "pending")
    .order("priority", { ascending: false })
    .order("due_at", { ascending: true, nullsFirst: false })
    .limit(20);

  return data || [];
}

async function fetchRecentActivities(
  supabase: ReturnType<typeof createClient>,
  startupId: string
): Promise<number> {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { count } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .eq("startup_id", startupId)
    .gte("created_at", threeDaysAgo.toISOString());

  return count || 0;
}

async function fetchStartupStage(
  supabase: ReturnType<typeof createClient>,
  startupId: string
): Promise<string> {
  const { data } = await supabase
    .from("startups")
    .select("stage")
    .eq("id", startupId)
    .single();

  return data?.stage || "validation";
}

// =============================================================================
// SCORING LOGIC
// =============================================================================

interface Candidate {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  source: string;
  scores: {
    health_gap: number;
    task_priority: number;
    stage_relevance: number;
    time_urgency: number;
    momentum: number;
  };
  total: number;
}

function calculateHealthGapScore(
  task: PendingTask,
  health: HealthScore | null
): number {
  if (!health) return 50; // Default if no health data

  // Check if task addresses a low health area
  const categoryToHealthMap: Record<string, string> = {
    fundraising: "investor_readiness",
    product: "product_market_fit",
    marketing: "traction",
    sales: "revenue",
    hiring: "team",
    operations: "operations",
    legal: "compliance",
  };

  const healthKey = categoryToHealthMap[task.category];
  if (healthKey && health.breakdown[healthKey] !== undefined) {
    // Lower health score = higher priority (invert the score)
    return Math.max(0, 100 - health.breakdown[healthKey]);
  }

  // AI-generated tasks from workflow trigger get bonus
  if (task.source === "ai_workflow" && task.trigger_rule_id) {
    return 80;
  }

  return 50;
}

function calculatePriorityScore(task: PendingTask): number {
  const priorityScores: Record<string, number> = {
    high: 100,
    medium: 60,
    low: 30,
  };
  return priorityScores[task.priority] || 50;
}

function calculateStageRelevance(task: PendingTask, stage: string): number {
  const milestones = STAGE_MILESTONES[stage] || [];

  // Check if task category aligns with stage milestones
  const categoryToMilestoneMap: Record<string, string[]> = {
    fundraising: ["fundraising_readiness", "investor_readiness"],
    product: ["working_product", "product_market_fit", "iteration_cycle"],
    marketing: ["early_traction", "market_expansion", "traction"],
    sales: ["first_users", "revenue_growth"],
    hiring: ["team_building", "leadership_team"],
    operations: ["process_optimization", "operational_excellence"],
  };

  const relevantMilestones = categoryToMilestoneMap[task.category] || [];
  const hasRelevantMilestone = milestones.some(m =>
    relevantMilestones.some(rm => m.includes(rm) || rm.includes(m))
  );

  return hasRelevantMilestone ? 90 : 50;
}

function calculateTimeUrgency(task: PendingTask): number {
  const now = new Date();

  // Check due date urgency
  if (task.due_at) {
    const dueDate = new Date(task.due_at);
    const daysUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (daysUntilDue < 0) return 100; // Overdue
    if (daysUntilDue <= 1) return 95;
    if (daysUntilDue <= 3) return 80;
    if (daysUntilDue <= 7) return 60;
    return 40;
  }

  // Check staleness (tasks created but not started)
  const createdAt = new Date(task.created_at);
  const daysOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (daysOld > 14) return 70; // Stale task
  if (daysOld > 7) return 50;
  return 30;
}

function calculateMomentumScore(recentActivityCount: number): number {
  // More recent activity = maintain momentum by suggesting related tasks
  if (recentActivityCount >= 10) return 90;
  if (recentActivityCount >= 5) return 70;
  if (recentActivityCount >= 2) return 50;
  return 30; // Low activity - suggest easy wins
}

function scoreCandidate(
  task: PendingTask,
  health: HealthScore | null,
  stage: string,
  activityCount: number
): Candidate {
  const scores = {
    health_gap: calculateHealthGapScore(task, health),
    task_priority: calculatePriorityScore(task),
    stage_relevance: calculateStageRelevance(task, stage),
    time_urgency: calculateTimeUrgency(task),
    momentum: calculateMomentumScore(activityCount),
  };

  const total =
    scores.health_gap * SIGNAL_WEIGHTS.health_gap +
    scores.task_priority * SIGNAL_WEIGHTS.task_priority +
    scores.stage_relevance * SIGNAL_WEIGHTS.stage_relevance +
    scores.time_urgency * SIGNAL_WEIGHTS.time_urgency +
    scores.momentum * SIGNAL_WEIGHTS.momentum;

  // Determine link based on category
  const categoryLinks: Record<string, string> = {
    fundraising: "/investors",
    product: "/tasks",
    marketing: "/tasks",
    sales: "/crm",
    hiring: "/tasks",
    operations: "/tasks",
    legal: "/documents",
    other: "/tasks",
  };

  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    category: task.category,
    link: categoryLinks[task.category] || "/tasks",
    source: task.trigger_rule_id ? `trigger:${task.trigger_rule_id}` : task.source,
    scores,
    total,
  };
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Verify JWT authentication
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: authError || "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit — daily focus computation (DB-heavy reads + scoring)
    const rateResult = checkRateLimit(user.id, 'compute-daily-focus', RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      console.warn(`[compute-daily-focus] Rate limit hit: user=${user.id}`);
      return rateLimitResponse(rateResult, corsHeaders);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { startup_id } = await req.json();

    if (!startup_id) {
      return new Response(
        JSON.stringify({ error: "startup_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user has access to this startup via org membership
    const { data: startup } = await supabase
      .from("startups")
      .select("id")
      .eq("id", startup_id)
      .eq("org_id", user.orgId)
      .single();

    if (!startup) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for existing valid recommendation
    const { data: existing } = await supabase
      .from("daily_focus_recommendations")
      .select("*")
      .eq("startup_id", startup_id)
      .gt("expires_at", new Date().toISOString())
      .is("action_completed_at", null)
      .is("skipped_at", null)
      .order("computed_at", { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({
          recommendation: existing,
          cached: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all signals in parallel
    const [health, tasks, activityCount, stage] = await Promise.all([
      fetchHealthScores(supabase, startup_id),
      fetchPendingTasks(supabase, startup_id),
      fetchRecentActivities(supabase, startup_id),
      fetchStartupStage(supabase, startup_id),
    ]);

    // If no pending tasks, return empty
    if (tasks.length === 0) {
      return new Response(
        JSON.stringify({
          recommendation: null,
          message: "No pending tasks. Great job staying on top of things!"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Score all candidates
    const candidates = tasks.map(task =>
      scoreCandidate(task, health, stage, activityCount)
    );

    // Sort by total score descending
    candidates.sort((a, b) => b.total - a.total);

    const topCandidate = candidates[0];
    const secondaryActions = candidates.slice(1, 4).map(c => ({
      title: c.title,
      description: c.description,
      link: c.link,
      source: c.source,
    }));

    // Build the recommendation
    const recommendation = {
      startup_id,
      computed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours
      primary_action: {
        title: topCandidate.title,
        description: topCandidate.description,
        reason: generateReason(topCandidate, health, stage),
        expected_outcome: generateExpectedOutcome(topCandidate.category),
        link: topCandidate.link,
        source: topCandidate.source,
      },
      secondary_actions: secondaryActions,
      signal_weights: SIGNAL_WEIGHTS,
      scoring_breakdown: {
        candidates_count: candidates.length,
        top_candidate_scores: topCandidate.scores,
        top_candidate_total: Math.round(topCandidate.total),
        health_overall: health?.overall || null,
        stage,
      },
    };

    // Store the recommendation
    const { data: stored, error } = await supabase
      .from("daily_focus_recommendations")
      .insert(recommendation)
      .select()
      .single();

    if (error) {
      console.error("Failed to store recommendation:", error);
    }

    return new Response(
      JSON.stringify({
        recommendation: stored || recommendation,
        cached: false
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error computing daily focus:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateReason(candidate: Candidate, health: HealthScore | null, stage: string): string {
  const { scores } = candidate;

  const reasons: string[] = [];

  if (scores.health_gap >= 70) {
    reasons.push("addresses a gap in your startup health");
  }
  if (scores.time_urgency >= 80) {
    reasons.push("has an approaching deadline");
  }
  if (scores.stage_relevance >= 80) {
    reasons.push(`is critical for the ${stage} stage`);
  }
  if (scores.task_priority >= 80) {
    reasons.push("is marked high priority");
  }

  if (reasons.length === 0) {
    return "This is a good next step to move your startup forward.";
  }

  return `This task ${reasons.join(" and ")}.`;
}

function generateExpectedOutcome(category: string): string {
  const outcomes: Record<string, string> = {
    fundraising: "Progress toward closing your funding round",
    product: "Improved product quality and user experience",
    marketing: "Increased visibility and user acquisition",
    sales: "More pipeline and revenue opportunities",
    hiring: "Stronger team to execute on your vision",
    operations: "Better efficiency and scalability",
    legal: "Reduced risk and compliance issues",
    other: "Forward progress on your startup journey",
  };

  return outcomes[category] || outcomes.other;
}
