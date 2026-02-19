/**
 * Research Agent Prompt
 * Performs market research using Google Search + URL context
 */

export const SYSTEM_PROMPT = `TODO: Add market research system prompt
- Use Google Search to find market data
- Extract information from URLs to calculate TAM, SAM, SOM
- Identify market trends and growth rates
- Cite sources with URLs
- Estimate market sizes with reasoning`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    tam: {
      type: "number",
      description: "Total Addressable Market in USD",
    },
    sam: {
      type: "number",
      description: "Serviceable Addressable Market in USD",
    },
    som: {
      type: "number",
      description: "Serviceable Obtainable Market in USD",
    },
    trends: {
      type: "array",
      items: { type: "string" },
      description: "Key market trends",
    },
    growth_rate: {
      type: "string",
      description: "Annual market growth rate (e.g., '15% CAGR')",
    },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          snippet: { type: "string" },
        },
      },
      description: "Sources used for research",
    },
  },
  required: ["tam", "sam", "som", "trends", "growth_rate", "sources"],
};
