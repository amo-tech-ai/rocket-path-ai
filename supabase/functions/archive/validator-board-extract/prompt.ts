/**
 * Board Extract Agent Prompt
 * Extracts assumptions from validation report for assumption board
 */

export const SYSTEM_PROMPT = `TODO: Add assumption extraction system prompt
- Extract 8-12 key assumptions from report
- Categorize: Problem, Solution, Market, Customer, Business Model, Competition
- Each assumption: clear statement, category, risk level (high/medium/low)
- Prioritize assumptions that are:
  1. Critical to success
  2. Currently unvalidated
  3. Testable within 2-4 weeks
- Format for assumption board tracking`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    assumptions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          statement: {
            type: "string",
            description: "Clear, testable assumption statement",
          },
          category: {
            type: "string",
            enum: ["Problem", "Solution", "Market", "Customer", "Business Model", "Competition"],
            description: "Assumption category",
          },
          risk_level: {
            type: "string",
            enum: ["high", "medium", "low"],
            description: "Risk if assumption is wrong",
          },
          source_section: {
            type: "string",
            description: "Which report section this came from",
          },
        },
        required: ["statement", "category", "risk_level", "source_section"],
      },
      description: "8-12 key assumptions to validate",
    },
  },
  required: ["assumptions"],
};
