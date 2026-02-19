/**
 * Response schema for Gemini follow-up question generation.
 * Uses responseJsonSchema for guaranteed structured JSON output.
 *
 * v2: Coverage uses depth enum (none/shallow/deep) instead of boolean.
 *     Adds extracted object for progressive structured capture.
 */

export type CoverageDepth = "none" | "shallow" | "deep";
export type ConfidenceLevel = "low" | "medium" | "high";

export interface FollowupResponse {
  action: "ask" | "ready";
  question: string;
  summary: string;
  readiness_reason: string;
  coverage: {
    customer: CoverageDepth;
    problem: CoverageDepth;
    competitors: CoverageDepth;
    innovation: CoverageDepth;
    demand: CoverageDepth;
    research: CoverageDepth;
    uniqueness: CoverageDepth;
    websites: CoverageDepth;
  };
  extracted: {
    problem: string;
    customer: string;
    solution: string;
    differentiation: string;
    demand: string;
    competitors: string;
    business_model: string;
    websites: string;
  };
  confidence: {
    problem: ConfidenceLevel;
    customer: ConfidenceLevel;
    solution: ConfidenceLevel;
    differentiation: ConfidenceLevel;
    demand: ConfidenceLevel;
    competitors: ConfidenceLevel;
    business_model: ConfidenceLevel;
    websites: ConfidenceLevel;
  };
  contradictions: string[];
  discoveredEntities: {
    competitors: string[];
    urls: string[];
    marketData: string[];
  };
  questionNumber: number;
  reasoning: string;
}

const depthEnum = {
  type: "string",
  enum: ["none", "shallow", "deep"],
};

const confidenceEnum = {
  type: "string",
  enum: ["low", "medium", "high"],
};

export const followupResponseSchema = {
  type: "object",
  required: ["action", "question", "summary", "readiness_reason", "coverage", "extracted", "confidence", "contradictions", "discoveredEntities", "questionNumber", "reasoning"],
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
    readiness_reason: {
      type: "string",
      description: "When ready: what triggered readiness. When asking: what's still missing (e.g., 'problem and customer covered, but no competitor data yet').",
    },
    coverage: {
      type: "object",
      required: ["customer", "problem", "competitors", "innovation", "demand", "research", "uniqueness", "websites"],
      properties: {
        customer: { ...depthEnum, description: "Target customer segment depth." },
        problem: { ...depthEnum, description: "Problem being solved depth." },
        competitors: { ...depthEnum, description: "Competitors or alternatives depth." },
        innovation: { ...depthEnum, description: "Innovation or novel approach depth." },
        demand: { ...depthEnum, description: "Market demand or evidence depth." },
        research: { ...depthEnum, description: "Market research or validation depth." },
        uniqueness: { ...depthEnum, description: "Unique value proposition depth." },
        websites: { ...depthEnum, description: "Reference URLs or links depth." },
      },
    },
    extracted: {
      type: "object",
      required: ["problem", "customer", "solution", "differentiation", "demand", "competitors", "business_model", "websites"],
      properties: {
        problem: { type: "string", description: "Extracted problem statement from founder's words. Empty string if not discussed." },
        customer: { type: "string", description: "Extracted customer segment from founder's words. Empty string if not discussed." },
        solution: { type: "string", description: "Extracted solution approach. Empty string if not discussed." },
        differentiation: { type: "string", description: "Extracted differentiator or moat. Empty string if not discussed." },
        demand: { type: "string", description: "Extracted demand evidence. Empty string if not discussed." },
        competitors: { type: "string", description: "Extracted competitors mentioned. Empty string if not discussed." },
        business_model: { type: "string", description: "Extracted business model or pricing. Empty string if not discussed." },
        websites: { type: "string", description: "Extracted URLs or links. Empty string if not discussed." },
      },
    },
    confidence: {
      type: "object",
      required: ["problem", "customer", "solution", "differentiation", "demand", "competitors", "business_model", "websites"],
      properties: {
        problem: { ...confidenceEnum, description: "Confidence in extracted problem statement." },
        customer: { ...confidenceEnum, description: "Confidence in extracted customer segment." },
        solution: { ...confidenceEnum, description: "Confidence in extracted solution." },
        differentiation: { ...confidenceEnum, description: "Confidence in extracted differentiator." },
        demand: { ...confidenceEnum, description: "Confidence in extracted demand evidence." },
        competitors: { ...confidenceEnum, description: "Confidence in extracted competitors." },
        business_model: { ...confidenceEnum, description: "Confidence in extracted business model." },
        websites: { ...confidenceEnum, description: "Confidence in extracted URLs." },
      },
    },
    contradictions: {
      type: "array",
      items: { type: "string" },
      description: "Detected contradictions between founder's earlier and later statements. Empty array if none.",
    },
    discoveredEntities: {
      type: "object",
      required: ["competitors", "urls", "marketData"],
      properties: {
        competitors: {
          type: "array",
          items: { type: "string" },
          description: "Competitor names discovered from conversation or search results.",
        },
        urls: {
          type: "array",
          items: { type: "string" },
          description: "URLs discovered from conversation or search results.",
        },
        marketData: {
          type: "array",
          items: { type: "string" },
          description: "Market data points discovered (e.g., 'Dental AI TAM $3.2B per Grand View Research').",
        },
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
