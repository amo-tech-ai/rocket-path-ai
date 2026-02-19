/**
 * Competitors Agent Prompt
 * Finds competitors and creates feature comparison
 */

export const SYSTEM_PROMPT = `TODO: Add competitor analysis system prompt
- Use Google Search to find direct and indirect competitors
- Create feature comparison matrix
- Identify competitive advantages and gaps
- Include 3-5 key competitors with website URLs
- Compare pricing, features, target market`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          url: { type: "string" },
          description: { type: "string" },
          strengths: {
            type: "array",
            items: { type: "string" },
          },
          weaknesses: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["name", "url", "description"],
      },
      description: "List of 3-5 competitors",
    },
    feature_comparison: {
      type: "object",
      properties: {
        features: {
          type: "array",
          items: { type: "string" },
          description: "List of features to compare",
        },
        matrix: {
          type: "object",
          description: "Feature comparison matrix (competitor name -> feature availability)",
        },
      },
    },
  },
  required: ["competitors", "feature_comparison"],
};
