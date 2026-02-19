/**
 * MVP Agent Prompt
 * Creates MVP roadmap with phases, timeline, and budget
 */

export const SYSTEM_PROMPT = `TODO: Add MVP roadmap system prompt
- Create 3-phase MVP plan: Discovery, Build, Launch
- Each phase: duration, milestones, deliverables, cost estimate
- Identify next 5-7 actionable steps
- Total timeline: 3-6 months
- Budget: realistic ranges for bootstrapped/funded scenarios
- Address key risks from scoring`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          duration: { type: "string" },
          milestones: {
            type: "array",
            items: { type: "string" },
          },
          deliverables: {
            type: "array",
            items: { type: "string" },
          },
          cost_estimate: { type: "string" },
        },
        required: ["name", "duration", "milestones", "deliverables", "cost_estimate"],
      },
      description: "3 MVP phases",
    },
    next_steps: {
      type: "array",
      items: { type: "string" },
      description: "5-7 immediate next steps",
    },
    timeline: {
      type: "string",
      description: "Total timeline (e.g., '4 months')",
    },
    budget: {
      type: "object",
      properties: {
        bootstrapped: { type: "string" },
        funded: { type: "string" },
      },
      description: "Budget estimates for different scenarios",
    },
  },
  required: ["phases", "next_steps", "timeline", "budget"],
};
