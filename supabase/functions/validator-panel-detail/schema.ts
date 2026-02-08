/**
 * Response schema for the Right Panel Intelligence Agent.
 * Uses responseJsonSchema for guaranteed structured JSON output (G1).
 */

export interface PanelDetailResponse {
  section_number: number;
  more_detail: string;
  why_this_matters: string;
  risks_gaps: string[];
  validate_next: string[];
}

export const panelDetailResponseSchema = {
  type: "object",
  required: ["section_number", "more_detail", "why_this_matters", "risks_gaps", "validate_next"],
  properties: {
    section_number: {
      type: "integer",
      description: "The section number (1-14)",
    },
    more_detail: {
      type: "string",
      description: "Additional context not in summary, ~40 words",
    },
    why_this_matters: {
      type: "string",
      description: "Impact on score/risk/outcome, ~25 words",
    },
    risks_gaps: {
      type: "array",
      items: { type: "string" },
      maxItems: 3,
      description: "What is missing or uncertain, max 3 items",
    },
    validate_next: {
      type: "array",
      items: { type: "string" },
      maxItems: 3,
      description: "Concrete actions to reduce uncertainty, max 3 items",
    },
  },
};
