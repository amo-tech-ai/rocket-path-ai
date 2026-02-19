/**
 * Scoring Agent Prompt
 * Scores startup across multiple dimensions with deep thinking
 */

export const SYSTEM_PROMPT = `TODO: Add scoring system prompt
- Score across 8 dimensions: Problem-Solution Fit, Market Size, Competitive Advantage, Execution Feasibility, Team Capability, Financial Viability, Scalability, Innovation
- Each dimension: 0-100 points with detailed reasoning
- Overall score: weighted average
- Verdict: Strong Buy (80+), Buy (65-79), Hold (50-64), Pass (<50)
- Identify top 3 risks and opportunities
- Use thinking mode for deep analysis`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    overall_score: {
      type: "number",
      description: "Overall score 0-100",
    },
    verdict: {
      type: "string",
      enum: ["Strong Buy", "Buy", "Hold", "Pass"],
      description: "Investment verdict",
    },
    dimension_scores: {
      type: "object",
      properties: {
        problem_solution_fit: { type: "number" },
        market_size: { type: "number" },
        competitive_advantage: { type: "number" },
        execution_feasibility: { type: "number" },
        team_capability: { type: "number" },
        financial_viability: { type: "number" },
        scalability: { type: "number" },
        innovation: { type: "number" },
      },
      required: [
        "problem_solution_fit",
        "market_size",
        "competitive_advantage",
        "execution_feasibility",
        "team_capability",
        "financial_viability",
        "scalability",
        "innovation",
      ],
    },
    reasoning: {
      type: "object",
      description: "Reasoning for each dimension score",
    },
    risks: {
      type: "array",
      items: { type: "string" },
      description: "Top 3 risks",
    },
    opportunities: {
      type: "array",
      items: { type: "string" },
      description: "Top 3 opportunities",
    },
  },
  required: ["overall_score", "verdict", "dimension_scores", "reasoning", "risks", "opportunities"],
};
