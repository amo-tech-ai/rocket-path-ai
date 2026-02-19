/**
 * CRM Agent — Prompts & JSON Schemas
 * Extracted from inline prompts for G1 compliance.
 */

// ============ SYSTEM PROMPTS ============

export const ENRICH_CONTACT_SYSTEM =
  `You are a B2B sales intelligence assistant. Generate realistic professional profile data based on search queries. Return ONLY valid JSON matching the provided schema.`;

export const SCORE_LEAD_SYSTEM =
  `You are a B2B lead scoring expert. Evaluate contacts against a startup's ideal customer profile and return a structured score with supporting factors.`;

export const SCORE_DEAL_SYSTEM =
  `You are a sales forecasting expert. Analyze deal data and predict win probability with supporting insights and risk factors.`;

export const ANALYZE_PIPELINE_SYSTEM =
  `You are a sales pipeline optimization expert. Identify bottlenecks, stalling patterns, and provide actionable recommendations to improve conversion.`;

export const GENERATE_EMAIL_SYSTEM =
  `You are an expert B2B email copywriter. Write concise, personalized emails. Use the recipient's name and reference something specific about them or their company when available.`;

export const SUMMARIZE_COMMUNICATION_SYSTEM =
  `You are a relationship intelligence analyst. Summarize communication history, identify key themes, and recommend next steps to strengthen the relationship.`;

// ============ JSON SCHEMAS (G1 compliance) ============

export const enrichContactSchema = {
  type: "object",
  required: ["name", "title", "company", "bio", "tags", "relationship_strength", "ai_summary"],
  properties: {
    name: { type: "string" },
    title: { type: "string" },
    company: { type: "string" },
    bio: { type: "string" },
    linkedin_url: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    relationship_strength: { type: "string", enum: ["weak", "medium", "strong"] },
    ai_summary: { type: "string" },
  },
};

export const scoreLeadSchema = {
  type: "object",
  required: ["score", "factors", "recommendation"],
  properties: {
    score: { type: "integer" },
    factors: { type: "array", items: { type: "string" } },
    recommendation: { type: "string" },
  },
};

export const scoreDealSchema = {
  type: "object",
  required: ["probability", "insights", "risks", "next_best_action"],
  properties: {
    probability: { type: "integer" },
    insights: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    next_best_action: { type: "string" },
  },
};

export const analyzePipelineSchema = {
  type: "object",
  required: ["bottlenecks", "recommendations", "health_score"],
  properties: {
    bottlenecks: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } },
    health_score: { type: "integer" },
  },
};

export const generateEmailSchema = {
  type: "object",
  required: ["subject", "body", "tone"],
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
    tone: { type: "string", enum: ["professional", "casual", "formal"] },
  },
};

export const summarizeCommunicationSchema = {
  type: "object",
  required: ["summary", "key_points", "next_steps", "sentiment"],
  properties: {
    summary: { type: "string" },
    key_points: { type: "array", items: { type: "string" } },
    next_steps: { type: "array", items: { type: "string" } },
    sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
  },
};
