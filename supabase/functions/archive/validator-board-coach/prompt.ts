/**
 * Board Coach Agent Prompt
 * Provides coaching on what to do next with assumption board
 */

export const SYSTEM_PROMPT = `TODO: Add assumption board coaching system prompt
- Analyze current board state (assumptions, statuses, validation results)
- Recommend next action:
  1. Which assumption to tackle next (prioritize high-risk, unvalidated)
  2. Why this assumption is critical now
  3. Specific next step to take
- Consider:
  - Risk-first approach (validate riskiest first)
  - Dependencies (some assumptions unlock others)
  - Momentum (quick wins build confidence)
  - Resource constraints (time, budget)
- Encourage: "You're building evidence, not proving yourself right"
- Be specific, actionable, encouraging`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    next_action: {
      type: "string",
      description: "Specific next action to take (e.g., 'Start validating: [assumption name]')",
    },
    reasoning: {
      type: "string",
      description: "Why this is the right next step",
    },
    priority: {
      type: "string",
      enum: ["urgent", "high", "medium"],
      description: "Priority level",
    },
    encouragement: {
      type: "string",
      description: "Brief encouraging message for the founder",
    },
  },
  required: ["next_action", "reasoning", "priority", "encouragement"],
};
