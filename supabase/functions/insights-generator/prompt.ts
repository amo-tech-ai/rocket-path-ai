/**
 * Insights Generator — Prompts & JSON Schemas
 * Extracted from inline prompts for G1 compliance.
 */

// ============ SYSTEM PROMPTS ============

export const DAILY_INSIGHTS_SYSTEM = `You are a startup advisor providing daily strategic insights. Focus on actionable, specific recommendations. Prioritize opportunities and risks that need immediate attention.`;

export const STAGE_RECOMMENDATIONS_SYSTEM = `You are an experienced startup advisor. Provide specific, actionable stage-appropriate guidance.`;

export const WEEKLY_SUMMARY_SYSTEM = `You are a supportive but honest startup advisor providing weekly performance reviews. Be specific and actionable.`;

// ============ JSON SCHEMAS (G1 compliance) ============

export const dailyInsightsSchema = {
  type: "object",
  required: ["insights", "summary", "focus_area", "quick_wins"],
  properties: {
    insights: {
      type: "array",
      items: {
        type: "object",
        required: ["category", "title", "description", "priority", "actionable"],
        properties: {
          category: { type: "string", enum: ["opportunity", "risk", "action", "milestone"] },
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          actionable: { type: "boolean" },
          suggested_action: { type: "string" },
          metric: { type: "string" },
          trend: { type: "string", enum: ["up", "down", "stable"] },
        },
      },
    },
    summary: { type: "string" },
    focus_area: { type: "string" },
    quick_wins: { type: "array", items: { type: "string" } },
  },
};

export const stageRecommendationsSchema = {
  type: "object",
  required: ["stage_assessment", "key_milestones", "priorities", "fundraising_readiness", "next_stage_requirements"],
  properties: {
    stage_assessment: { type: "string" },
    key_milestones: {
      type: "array",
      items: {
        type: "object",
        required: ["milestone", "why_important", "typical_timeline"],
        properties: {
          milestone: { type: "string" },
          why_important: { type: "string" },
          typical_timeline: { type: "string" },
        },
      },
    },
    priorities: {
      type: "array",
      items: {
        type: "object",
        required: ["area", "recommendation", "anti_pattern"],
        properties: {
          area: { type: "string" },
          recommendation: { type: "string" },
          anti_pattern: { type: "string" },
        },
      },
    },
    fundraising_readiness: {
      type: "object",
      required: ["score", "gaps", "strengths"],
      properties: {
        score: { type: "integer" },
        gaps: { type: "array", items: { type: "string" } },
        strengths: { type: "array", items: { type: "string" } },
      },
    },
    next_stage_requirements: { type: "array", items: { type: "string" } },
  },
};

// ============ BUSINESS READINESS (P1: Task 21) ============

export const BUSINESS_READINESS_SYSTEM = `You are a startup launch readiness advisor. Assess the startup across 4 dimensions: Trust (social proof, testimonials, press), Reliability (execution track record, sprint completion, deadline adherence), Cost Control (burn rate awareness, runway planning, budget discipline), and Support (onboarding, FAQ, help systems). Score each 0-100. Provide an overall verdict: GREEN if all dimensions >= 75, YELLOW if any < 75, RED if any < 50. Identify top 3 blockers with severity. Generate a realistic 4-week launch plan.`;

export const businessReadinessSchema = {
  type: "object",
  required: ["overall_score", "verdict", "dimensions", "blockers", "launch_plan", "summary"],
  properties: {
    overall_score: { type: "integer", minimum: 0, maximum: 100 },
    verdict: { type: "string", enum: ["GREEN", "YELLOW", "RED"] },
    summary: { type: "string" },
    dimensions: {
      type: "object",
      required: ["trust", "reliability", "cost_control", "support"],
      properties: {
        trust: {
          type: "object",
          required: ["score", "label", "evidence", "gaps"],
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            label: { type: "string" },
            evidence: { type: "array", items: { type: "string" } },
            gaps: { type: "array", items: { type: "string" } },
          },
        },
        reliability: {
          type: "object",
          required: ["score", "label", "evidence", "gaps"],
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            label: { type: "string" },
            evidence: { type: "array", items: { type: "string" } },
            gaps: { type: "array", items: { type: "string" } },
          },
        },
        cost_control: {
          type: "object",
          required: ["score", "label", "evidence", "gaps"],
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            label: { type: "string" },
            evidence: { type: "array", items: { type: "string" } },
            gaps: { type: "array", items: { type: "string" } },
          },
        },
        support: {
          type: "object",
          required: ["score", "label", "evidence", "gaps"],
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            label: { type: "string" },
            evidence: { type: "array", items: { type: "string" } },
            gaps: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    blockers: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "severity", "dimension", "fix"],
        properties: {
          title: { type: "string" },
          severity: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
          dimension: { type: "string" },
          fix: { type: "string" },
        },
      },
    },
    launch_plan: {
      type: "array",
      items: {
        type: "object",
        required: ["week", "goal", "tasks"],
        properties: {
          week: { type: "integer" },
          goal: { type: "string" },
          tasks: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

// ============ OUTCOMES & ROI (P2: Task 22) ============

export const OUTCOMES_DASHBOARD_SYSTEM = `You are a startup ROI analyst. Evaluate the startup's outcomes vs activity. Calculate efficiency metrics. Detect "ROI Mirage" — when activity is high but real progress (validated assumptions, completed experiments, decisions acted on) is low. A ratio of activity-to-outcomes > 6:1 triggers a warning. Provide a frank founder decision prompt: Double Down, Adjust, or Stop for each area.`;

export const outcomesDashboardSchema = {
  type: "object",
  required: ["outcome_cards", "time_saved", "cost_per_insight", "retention_funnel", "roi_mirage", "founder_decisions", "summary"],
  properties: {
    summary: { type: "string" },
    outcome_cards: {
      type: "object",
      required: ["decisions_made", "plans_completed", "experiments_validated", "assumptions_tested", "interviews_conducted"],
      properties: {
        decisions_made: { type: "integer" },
        plans_completed: { type: "integer" },
        experiments_validated: { type: "integer" },
        assumptions_tested: { type: "integer" },
        interviews_conducted: { type: "integer" },
      },
    },
    time_saved: {
      type: "object",
      required: ["hours_per_month", "value_estimate", "breakdown"],
      properties: {
        hours_per_month: { type: "number" },
        value_estimate: { type: "string" },
        breakdown: {
          type: "array",
          items: {
            type: "object",
            required: ["area", "hours"],
            properties: {
              area: { type: "string" },
              hours: { type: "number" },
            },
          },
        },
      },
    },
    cost_per_insight: {
      type: "object",
      required: ["total_ai_cost", "total_insights", "cost_per_insight", "trend"],
      properties: {
        total_ai_cost: { type: "number" },
        total_insights: { type: "integer" },
        cost_per_insight: { type: "number" },
        trend: { type: "string", enum: ["improving", "stable", "worsening"] },
      },
    },
    retention_funnel: {
      type: "array",
      items: {
        type: "object",
        required: ["stage", "count", "percentage"],
        properties: {
          stage: { type: "string" },
          count: { type: "integer" },
          percentage: { type: "number" },
        },
      },
    },
    roi_mirage: {
      type: "object",
      required: ["detected", "activity_count", "outcome_count", "ratio", "warnings"],
      properties: {
        detected: { type: "boolean" },
        activity_count: { type: "integer" },
        outcome_count: { type: "integer" },
        ratio: { type: "number" },
        warnings: { type: "array", items: { type: "string" } },
      },
    },
    founder_decisions: {
      type: "array",
      items: {
        type: "object",
        required: ["area", "recommendation", "reason", "action"],
        properties: {
          area: { type: "string" },
          recommendation: { type: "string", enum: ["Double Down", "Adjust", "Stop"] },
          reason: { type: "string" },
          action: { type: "string" },
        },
      },
    },
  },
};

export const weeklySummarySchema = {
  type: "object",
  required: ["week_score", "highlights", "challenges", "metrics_summary", "next_week_priorities", "ceo_note"],
  properties: {
    week_score: { type: "integer" },
    highlights: { type: "array", items: { type: "string" } },
    challenges: { type: "array", items: { type: "string" } },
    metrics_summary: {
      type: "object",
      properties: {
        productivity: { type: "string" },
        sales: { type: "string" },
        fundraising: { type: "string" },
      },
    },
    next_week_priorities: {
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
    },
    ceo_note: { type: "string" },
  },
};
