/**
 * Task Agent — Prompts & JSON Schemas
 * Extracted from inline prompts for G1 compliance.
 * 6 actions: generate_tasks, prioritize_tasks, suggest_next,
 *            breakdown_task, analyze_productivity, generate_daily_plan
 */

// ============ SYSTEM PROMPTS ============

export const GENERATE_TASKS_SYSTEM = `You are a startup advisor generating actionable, specific tasks. Focus on high-impact activities that match the startup's current stage.`;

export const PRIORITIZE_TASKS_SYSTEM = `You are a productivity expert helping founders prioritize effectively. Consider impact, urgency, and dependencies.`;

export const SUGGEST_NEXT_SYSTEM = `You are a productivity coach. Match task suggestions to available time and energy.`;

export const BREAKDOWN_TASK_SYSTEM = `You are a project management expert. Break tasks into concrete, achievable steps.`;

export const ANALYZE_PRODUCTIVITY_SYSTEM = `You are a productivity analyst. Provide actionable insights based on task completion patterns.`;

export const DAILY_PLAN_SYSTEM = `You are a time management expert. Create realistic, energy-aware daily plans.`;

// ============ JSON SCHEMAS (G1 compliance) ============

export const generateTasksSchema = {
  type: "object",
  required: ["tasks", "reasoning"],
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "description", "priority", "category", "estimated_hours", "suggested_due_days"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          category: { type: "string", enum: ["product", "marketing", "sales", "operations", "finance", "legal", "hiring"] },
          estimated_hours: { type: "number" },
          suggested_due_days: { type: "integer" },
        },
      },
    },
    reasoning: { type: "string" },
  },
};

export const prioritizeTasksSchema = {
  type: "object",
  required: ["prioritized_order", "focus_recommendation", "defer_recommendation"],
  properties: {
    prioritized_order: {
      type: "array",
      items: {
        type: "object",
        required: ["task_id", "new_priority", "rank", "reasoning", "impact_score", "urgency_score", "effort_estimate"],
        properties: {
          task_id: { type: "string" },
          new_priority: { type: "string", enum: ["high", "medium", "low"] },
          rank: { type: "integer" },
          reasoning: { type: "string" },
          impact_score: { type: "integer" },
          urgency_score: { type: "integer" },
          effort_estimate: { type: "string", enum: ["low", "medium", "high"] },
        },
      },
    },
    focus_recommendation: { type: "string" },
    defer_recommendation: { type: "string" },
  },
};

export const suggestNextSchema = {
  type: "object",
  required: ["suggestions", "batch_suggestion", "avoid_now"],
  properties: {
    suggestions: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "why_now", "estimated_time", "momentum_tip"],
        properties: {
          title: { type: "string" },
          why_now: { type: "string" },
          estimated_time: { type: "string" },
          momentum_tip: { type: "string" },
        },
      },
    },
    batch_suggestion: { type: "string" },
    avoid_now: { type: "string" },
  },
};

export const breakdownTaskSchema = {
  type: "object",
  required: ["subtasks", "total_estimated_hours", "complexity", "suggested_approach"],
  properties: {
    subtasks: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "description", "estimated_minutes", "order", "can_be_delegated", "tools_needed"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          estimated_minutes: { type: "integer" },
          order: { type: "integer" },
          can_be_delegated: { type: "boolean" },
          tools_needed: { type: "array", items: { type: "string" } },
        },
      },
    },
    total_estimated_hours: { type: "number" },
    complexity: { type: "string", enum: ["low", "medium", "high"] },
    suggested_approach: { type: "string" },
  },
};

export const analyzeProductivitySchema = {
  type: "object",
  required: ["health_score", "summary", "strengths", "areas_to_improve", "recommendations", "focus_suggestion"],
  properties: {
    health_score: { type: "integer" },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    areas_to_improve: { type: "array", items: { type: "string" } },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        required: ["action", "expected_impact"],
        properties: {
          action: { type: "string" },
          expected_impact: { type: "string" },
        },
      },
    },
    focus_suggestion: { type: "string" },
  },
};

export const dailyPlanSchema = {
  type: "object",
  required: ["plan", "breaks", "buffer_time", "daily_goal", "evening_prep"],
  properties: {
    plan: {
      type: "array",
      items: {
        type: "object",
        required: ["time_block", "task", "duration_minutes", "focus_type", "energy_required", "tip"],
        properties: {
          time_block: { type: "string" },
          task: { type: "string" },
          duration_minutes: { type: "integer" },
          focus_type: { type: "string", enum: ["deep_work", "meetings", "admin"] },
          energy_required: { type: "string", enum: ["high", "medium", "low"] },
          tip: { type: "string" },
        },
      },
    },
    breaks: { type: "array", items: { type: "string" } },
    buffer_time: { type: "string" },
    daily_goal: { type: "string" },
    evening_prep: { type: "string" },
  },
};
