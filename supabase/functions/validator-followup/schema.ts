/**
 * Response schema for Gemini follow-up question generation.
 * Uses responseJsonSchema for guaranteed structured JSON output.
 */

export interface FollowupResponse {
  action: "ask" | "ready";
  question: string;
  summary: string;
  coverage: {
    customer: boolean;
    problem: boolean;
    competitors: boolean;
    innovation: boolean;
    demand: boolean;
    research: boolean;
    uniqueness: boolean;
    websites: boolean;
  };
  questionNumber: number;
  reasoning: string;
}

export const followupResponseSchema = {
  type: "object",
  required: ["action", "question", "summary", "coverage", "questionNumber", "reasoning"],
  properties: {
    action: {
      type: "string",
      enum: ["ask", "ready"],
      description: "Whether to ask another question or signal readiness to generate.",
    },
    question: {
      type: "string",
      description: "The next follow-up question (empty string when action is 'ready').",
    },
    summary: {
      type: "string",
      description: "Brief summary of the founder's idea so far (used when action is 'ready').",
    },
    coverage: {
      type: "object",
      required: ["customer", "problem", "competitors", "innovation", "demand", "research", "uniqueness", "websites"],
      properties: {
        customer: { type: "boolean", description: "Target customer segment discussed." },
        problem: { type: "boolean", description: "Problem being solved discussed." },
        competitors: { type: "boolean", description: "Competitors or alternatives discussed." },
        innovation: { type: "boolean", description: "Innovation or novel approach discussed." },
        demand: { type: "boolean", description: "Market demand or evidence discussed." },
        research: { type: "boolean", description: "Market research or validation discussed." },
        uniqueness: { type: "boolean", description: "Unique value proposition discussed." },
        websites: { type: "boolean", description: "Reference URLs or links provided." },
      },
    },
    questionNumber: {
      type: "integer",
      description: "The current exchange number (1-based).",
    },
    reasoning: {
      type: "string",
      description: "Internal analysis of what's covered and what's missing (not shown to user).",
    },
  },
};
