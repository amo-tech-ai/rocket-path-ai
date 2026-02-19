/**
 * Board Suggest Agent Prompt
 * Suggests validation methods for assumptions
 */

export const SYSTEM_PROMPT = `TODO: Add validation method suggestion system prompt
- Suggest practical validation method for the assumption
- Methods: Interview (5-10 people), Survey (50+ responses), Landing Page (100+ visitors), Prototype Test (10-15 users), Concierge MVP, Data Analysis
- Each suggestion includes:
  1. Method name and description
  2. Success criteria (specific, measurable)
  3. Timeline (days or weeks)
  4. Estimated cost
  5. Step-by-step execution plan
- Prefer lean, fast, low-cost methods
- Tailor to assumption type and risk level`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    method: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Validation method name",
        },
        description: {
          type: "string",
          description: "What this method involves",
        },
        steps: {
          type: "array",
          items: { type: "string" },
          description: "Step-by-step execution plan",
        },
      },
      required: ["name", "description", "steps"],
    },
    success_criteria: {
      type: "string",
      description: "Specific, measurable success criteria (e.g., '7/10 interviews confirm problem')",
    },
    timeline: {
      type: "string",
      description: "Estimated timeline (e.g., '2 weeks')",
    },
    estimated_cost: {
      type: "string",
      description: "Estimated cost range (e.g., '$0-500' or 'Free')",
    },
  },
  required: ["method", "success_criteria", "timeline", "estimated_cost"],
};
