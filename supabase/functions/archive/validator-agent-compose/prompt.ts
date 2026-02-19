/**
 * Composer Agent Prompt
 * Synthesizes all agent outputs into 14-section report
 */

export const SYSTEM_PROMPT = `TODO: Add composer system prompt
- Create 14 sections: Executive Summary, Problem Analysis, Solution Overview, Market Opportunity, Competitive Landscape, Business Model, Value Proposition, Target Customer, Go-to-Market Strategy, MVP Roadmap, Financial Projections, Risk Assessment, Team Requirements, Next Steps
- Each section: 200-400 words, actionable insights
- Use data from all previous agents
- Professional tone, investor-ready
- Include specific numbers, timelines, recommendations`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    sections: {
      type: "object",
      properties: {
        executive_summary: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            key_metrics: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        problem_analysis: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        solution_overview: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        market_opportunity: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            tam: { type: "number" },
            sam: { type: "number" },
            som: { type: "number" },
          },
        },
        competitive_landscape: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        business_model: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        value_proposition: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        target_customer: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        go_to_market: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        mvp_roadmap: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        financial_projections: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        risk_assessment: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        team_requirements: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
        next_steps: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            action_items: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
      required: [
        "executive_summary",
        "problem_analysis",
        "solution_overview",
        "market_opportunity",
        "competitive_landscape",
        "business_model",
        "value_proposition",
        "target_customer",
        "go_to_market",
        "mvp_roadmap",
        "financial_projections",
        "risk_assessment",
        "team_requirements",
        "next_steps",
      ],
    },
  },
  required: ["sections"],
};
