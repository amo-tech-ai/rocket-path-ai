/**
 * Extractor Agent Prompt
 * Extracts structured startup profile from user input
 */

export const SYSTEM_PROMPT = `TODO: Add extraction system prompt
- Extract name, problem, customer, UVP, industry
- Generate 3-5 search queries for market research
- Handle both structured and unstructured input
- Use interview context to enrich extraction`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Startup name or product name",
    },
    problem: {
      type: "string",
      description: "Problem being solved",
    },
    customer: {
      type: "string",
      description: "Target customer segment",
    },
    uvp: {
      type: "string",
      description: "Unique value proposition",
    },
    industry: {
      type: "string",
      description: "Industry or sector",
    },
    search_queries: {
      type: "array",
      items: { type: "string" },
      description: "3-5 search queries for market research",
    },
  },
  required: ["name", "problem", "customer", "uvp", "industry", "search_queries"],
};
