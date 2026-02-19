/**
 * Documents Agent — Prompts & JSON Schemas
 * Extracted from inline prompts for G1 compliance.
 * 8 AI actions: generateDocument, analyzeDocument, improveSection,
 *   summarizeDocument, compareVersions, createDataRoom,
 *   generateInvestorUpdate, generateCompetitiveAnalysis
 */

// ============ SYSTEM PROMPTS ============

export const GENERATE_DOCUMENT_SYSTEM =
  "You are an expert startup document writer with experience creating investor-ready materials.";

export const ANALYZE_DOCUMENT_SYSTEM =
  "You are a startup document quality analyst.";

export const IMPROVE_SECTION_SYSTEM =
  "You are an expert startup document editor. Improve content to be investor-ready.";

export const SUMMARIZE_DOCUMENT_SYSTEM =
  "You are a document summarization expert.";

export const COMPARE_VERSIONS_SYSTEM =
  "You are a document comparison analyst.";

export const CREATE_DATA_ROOM_SYSTEM =
  "You are a fundraising advisor helping founders prepare investor data rooms.";

export const INVESTOR_UPDATE_SYSTEM =
  "You are an expert at writing concise, data-driven investor updates that keep investors engaged and informed.";

export const COMPETITIVE_ANALYSIS_SYSTEM =
  "You are a strategic analyst with expertise in competitive intelligence and market positioning for startups.";

// ============ JSON SCHEMAS (G1 compliance) ============

export const generateDocumentSchema = {
  type: "object",
  required: ["title", "sections", "summary"],
  properties: {
    title: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        required: ["heading", "content"],
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
        },
      },
    },
    summary: { type: "string" },
  },
};

export const analyzeDocumentSchema = {
  type: "object",
  required: ["score", "completeness", "clarity_score", "data_score", "suggestions", "strengths", "missing_sections"],
  properties: {
    score: { type: "integer" },
    completeness: { type: "integer" },
    clarity_score: { type: "integer" },
    data_score: { type: "integer" },
    suggestions: { type: "array", items: { type: "string" } },
    strengths: { type: "array", items: { type: "string" } },
    missing_sections: { type: "array", items: { type: "string" } },
  },
};

export const improveSectionSchema = {
  type: "object",
  required: ["improved_text"],
  properties: {
    improved_text: { type: "string" },
  },
};

export const summarizeDocumentSchema = {
  type: "object",
  required: ["summary", "key_points", "audience", "main_ask"],
  properties: {
    summary: { type: "string" },
    key_points: { type: "array", items: { type: "string" } },
    audience: { type: "string" },
    main_ask: { type: "string" },
  },
};

export const compareVersionsSchema = {
  type: "object",
  required: ["changes_summary", "additions", "removals", "modifications", "significance"],
  properties: {
    changes_summary: { type: "string" },
    additions: { type: "array", items: { type: "string" } },
    removals: { type: "array", items: { type: "string" } },
    modifications: { type: "array", items: { type: "string" } },
    significance: { type: "string", enum: ["minor", "moderate", "major"] },
  },
};

export const createDataRoomSchema = {
  type: "object",
  required: ["recommendations", "priority_document", "readiness_score"],
  properties: {
    recommendations: { type: "array", items: { type: "string" } },
    priority_document: { type: "string" },
    readiness_score: { type: "integer" },
  },
};

export const investorUpdateSchema = {
  type: "object",
  required: ["title", "sections", "key_metrics", "asks"],
  properties: {
    title: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        required: ["heading", "content"],
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
        },
      },
    },
    key_metrics: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "value"],
        properties: {
          name: { type: "string" },
          value: { type: "string" },
          change: { type: "string" },
        },
      },
    },
    asks: { type: "array", items: { type: "string" } },
  },
};

export const competitiveAnalysisSchema = {
  type: "object",
  required: ["title", "sections", "competitors", "positioning"],
  properties: {
    title: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        required: ["heading", "content"],
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
        },
      },
    },
    competitors: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "category", "strengths", "weaknesses", "threat_level"],
        properties: {
          name: { type: "string" },
          category: { type: "string", enum: ["direct", "indirect"] },
          strengths: { type: "array", items: { type: "string" } },
          weaknesses: { type: "array", items: { type: "string" } },
          threat_level: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
    positioning: {
      type: "object",
      required: ["unique_advantages", "vulnerabilities", "opportunities"],
      properties: {
        unique_advantages: { type: "array", items: { type: "string" } },
        vulnerabilities: { type: "array", items: { type: "string" } },
        opportunities: { type: "array", items: { type: "string" } },
      },
    },
  },
};
