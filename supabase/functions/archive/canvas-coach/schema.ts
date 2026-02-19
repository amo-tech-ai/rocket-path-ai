/**
 * Canvas Coach response schema for Gemini structured output.
 * Uses responseJsonSchema for guaranteed JSON (G1 pattern).
 */

export interface CanvasCoachResponse {
  reply: string;
  weak_sections: string[];
  suggestions: Array<{
    box_key: string;
    item: string;
    reasoning: string;
  }>;
  next_chips: string[];
  canvas_score: number;
  reasoning: string;
}

export const canvasCoachResponseSchema = {
  type: "object",
  required: ["reply", "weak_sections", "suggestions", "next_chips", "canvas_score", "reasoning"],
  properties: {
    reply: {
      type: "string",
      description: "Markdown coaching message to show the user. Warm, direct, one focus area.",
    },
    weak_sections: {
      type: "array",
      items: { type: "string" },
      description: "Canvas box keys ordered by weakness (e.g. 'problem', 'uniqueValueProp').",
    },
    suggestions: {
      type: "array",
      items: {
        type: "object",
        required: ["box_key", "item", "reasoning"],
        properties: {
          box_key: {
            type: "string",
            description: "Canvas box key to add the item to (e.g. 'problem', 'solution').",
          },
          item: {
            type: "string",
            description: "Concrete item text the user can add to the canvas box.",
          },
          reasoning: {
            type: "string",
            description: "Brief explanation of why this item strengthens the canvas.",
          },
        },
      },
      description: "1-3 actionable suggestions with reasoning. Each can be added to a canvas box.",
    },
    next_chips: {
      type: "array",
      items: { type: "string" },
      description: "2-3 context-aware follow-up prompt chips for the user to click.",
    },
    canvas_score: {
      type: "integer",
      description: "Overall canvas quality score from 0 to 100.",
    },
    reasoning: {
      type: "string",
      description: "Internal analysis of canvas state (not shown to user).",
    },
  },
};
