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
    company_name: CoverageDepth;
    customer: CoverageDepth;
    problem: CoverageDepth;
    solution: CoverageDepth;
    competitors: CoverageDepth;
    innovation: CoverageDepth;
    demand: CoverageDepth;
    research: CoverageDepth;
    uniqueness: CoverageDepth;
    websites: CoverageDepth;
    industry: CoverageDepth;
    business_model: CoverageDepth;
    stage: CoverageDepth;
    // Deep dive topics (optional, enhance V3 dimension quality)
    ai_strategy: CoverageDepth;
    risk_awareness: CoverageDepth;
    execution_plan: CoverageDepth;
    investor_readiness: CoverageDepth;
  };
  extracted: {
    company_name: string;
    problem: string;
    customer: string;
    solution: string;
    differentiation: string;
    demand: string;
    competitors: string;
    business_model: string;
    websites: string;
    industry_categories: string;
    stage: string;
    linkedin_url: string;
    // Deep dive extracted fields
    ai_strategy: string;
    risk_awareness: string;
    execution_plan: string;
    investor_readiness: string;
  };
  confidence: {
    company_name: ConfidenceLevel;
    problem: ConfidenceLevel;
    customer: ConfidenceLevel;
    solution: ConfidenceLevel;
    differentiation: ConfidenceLevel;
    demand: ConfidenceLevel;
    competitors: ConfidenceLevel;
    business_model: ConfidenceLevel;
    websites: ConfidenceLevel;
    industry_categories: ConfidenceLevel;
    stage: ConfidenceLevel;
    linkedin_url: ConfidenceLevel;
    // Deep dive confidence
    ai_strategy: ConfidenceLevel;
    risk_awareness: ConfidenceLevel;
    execution_plan: ConfidenceLevel;
    investor_readiness: ConfidenceLevel;
  };
  contradictions: string[];
  discoveredEntities: {
    competitors: string[];
    urls: string[];
    marketData: string[];
  };
  questionNumber: number;
  reasoning: string;
  suggestions: string[];
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
  required: ["action", "question", "summary", "readiness_reason", "coverage", "extracted", "confidence", "contradictions", "discoveredEntities", "questionNumber", "reasoning", "suggestions"],
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
      required: ["company_name", "customer", "problem", "solution", "competitors", "innovation", "demand", "research", "uniqueness", "websites", "industry", "business_model", "stage", "ai_strategy", "risk_awareness", "execution_plan", "investor_readiness"],
      properties: {
        company_name: { ...depthEnum, description: "Company or product name depth." },
        customer: { ...depthEnum, description: "Target customer segment depth." },
        problem: { ...depthEnum, description: "Problem being solved depth." },
        solution: { ...depthEnum, description: "Solution approach and core feature depth." },
        competitors: { ...depthEnum, description: "Competitors or alternatives depth." },
        innovation: { ...depthEnum, description: "Innovation or novel approach depth." },
        demand: { ...depthEnum, description: "Market demand or evidence depth." },
        research: { ...depthEnum, description: "Market research or validation depth." },
        uniqueness: { ...depthEnum, description: "Unique value proposition depth." },
        websites: { ...depthEnum, description: "Reference URLs or links depth." },
        industry: { ...depthEnum, description: "Industry category depth." },
        business_model: { ...depthEnum, description: "Business model type (B2B/B2C/Marketplace etc) depth." },
        stage: { ...depthEnum, description: "Company stage (Idea/Pre-seed/Seed/Series A/B+) depth." },
        ai_strategy: { ...depthEnum, description: "AI/technology advantage and data moat depth." },
        risk_awareness: { ...depthEnum, description: "Key risks, failure modes, and mitigation depth." },
        execution_plan: { ...depthEnum, description: "90-day milestones, hiring plan, and execution depth." },
        investor_readiness: { ...depthEnum, description: "Key metrics, fundraising timeline, and investor pitch depth." },
      },
    },
    extracted: {
      type: "object",
      required: ["company_name", "problem", "customer", "solution", "differentiation", "demand", "competitors", "business_model", "websites", "industry_categories", "stage", "linkedin_url", "ai_strategy", "risk_awareness", "execution_plan", "investor_readiness"],
      properties: {
        company_name: { type: "string", description: "Company or product name. Empty string if not mentioned." },
        problem: { type: "string", description: "Extracted problem statement from founder's words. Empty string if not discussed." },
        customer: { type: "string", description: "Extracted customer segment from founder's words. Empty string if not discussed." },
        solution: { type: "string", description: "Extracted solution approach and core feature. Empty string if not discussed." },
        differentiation: { type: "string", description: "Extracted differentiator or moat. Empty string if not discussed." },
        demand: { type: "string", description: "Extracted demand evidence. Empty string if not discussed." },
        competitors: { type: "string", description: "Extracted competitors mentioned. Empty string if not discussed." },
        business_model: { type: "string", description: "Business model type: B2B, B2C, B2B2C, Marketplace, Platform, or Services. Empty string if not discussed." },
        websites: { type: "string", description: "Extracted URLs or links. Empty string if not discussed." },
        industry_categories: { type: "string", description: "Industry categories (comma-separated): SaaS, AI, FinTech, E-commerce, Healthcare, Education, Media, Enterprise, Consumer, Logistics, Real Estate, Gaming, Other. Empty string if not discussed." },
        stage: { type: "string", description: "Company stage: Idea, Pre-seed, Seed, Series A, Series B+. Empty string if not discussed." },
        linkedin_url: { type: "string", description: "Founder or company LinkedIn URL. Empty string if not mentioned." },
        ai_strategy: { type: "string", description: "AI/technology advantage, data moat, tech stack edge. Empty string if not discussed." },
        risk_awareness: { type: "string", description: "Key risks, failure modes, mitigation strategies. Empty string if not discussed." },
        execution_plan: { type: "string", description: "90-day milestones, hiring plan, key next steps. Empty string if not discussed." },
        investor_readiness: { type: "string", description: "Key metrics, fundraising timeline, investor pitch points. Empty string if not discussed." },
      },
    },
    confidence: {
      type: "object",
      required: ["company_name", "problem", "customer", "solution", "differentiation", "demand", "competitors", "business_model", "websites", "industry_categories", "stage", "linkedin_url", "ai_strategy", "risk_awareness", "execution_plan", "investor_readiness"],
      properties: {
        company_name: { ...confidenceEnum, description: "Confidence in extracted company name." },
        problem: { ...confidenceEnum, description: "Confidence in extracted problem statement." },
        customer: { ...confidenceEnum, description: "Confidence in extracted customer segment." },
        solution: { ...confidenceEnum, description: "Confidence in extracted solution." },
        differentiation: { ...confidenceEnum, description: "Confidence in extracted differentiator." },
        demand: { ...confidenceEnum, description: "Confidence in extracted demand evidence." },
        competitors: { ...confidenceEnum, description: "Confidence in extracted competitors." },
        business_model: { ...confidenceEnum, description: "Confidence in extracted business model type." },
        websites: { ...confidenceEnum, description: "Confidence in extracted URLs." },
        industry_categories: { ...confidenceEnum, description: "Confidence in extracted industry categories." },
        stage: { ...confidenceEnum, description: "Confidence in extracted company stage." },
        linkedin_url: { ...confidenceEnum, description: "Confidence in extracted LinkedIn URL." },
        ai_strategy: { ...confidenceEnum, description: "Confidence in extracted AI/technology strategy." },
        risk_awareness: { ...confidenceEnum, description: "Confidence in extracted risk awareness." },
        execution_plan: { ...confidenceEnum, description: "Confidence in extracted execution plan." },
        investor_readiness: { ...confidenceEnum, description: "Confidence in extracted investor readiness." },
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
    suggestions: {
      type: "array",
      items: { type: "string" },
      minItems: 0,
      maxItems: 4,
      description: "2-4 short suggestion chips (under 60 chars each) the founder can tap to answer the current question. Context-specific to the question being asked. Empty array when action is 'ready'.",
    },
  },
};
