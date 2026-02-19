/**
 * Event Agent — Prompts & JSON Schemas
 * Extracted from inline prompts for G1 compliance.
 *
 * 5 actions, 6 AI call paths:
 *   1. discoverEvents
 *   2. analyzeEvent
 *   3. researchSpeakers (no speakers — archetypes)
 *   4. researchSpeakers (with speakers — analysis)
 *   5. generatePrep
 *   6. trackAttendance (post-attendance insights)
 */

// ============ SYSTEM PROMPTS ============

export const DISCOVER_EVENTS_SYSTEM =
  `You are an expert at identifying valuable networking and industry events for startups. Suggest realistic, well-known events that match the startup's profile.`;

export const ANALYZE_EVENT_SYSTEM =
  `You are an expert at evaluating event value for startups. Provide honest, actionable assessments.`;

export const RESEARCH_SPEAKERS_ARCHETYPES_SYSTEM =
  `You are a networking strategist helping startups understand what types of speakers attend industry events.`;

export const RESEARCH_SPEAKERS_ANALYSIS_SYSTEM =
  `You are a networking strategist helping startups connect with event speakers.`;

export const GENERATE_PREP_SYSTEM =
  `You are an expert at preparing founders for networking events. Create practical, actionable preparation materials.`;

export const TRACK_ATTENDANCE_SYSTEM =
  `You are a startup advisor analyzing event attendance outcomes to extract actionable follow-up insights.`;

// ============ JSON SCHEMAS (G1 compliance) ============

export const discoverEventsSchema = {
  type: "object",
  required: ["events", "event_strategy", "priority_events"],
  properties: {
    events: {
      type: "array",
      items: {
        type: "object",
        required: [
          "name",
          "event_type",
          "relevance_score",
          "industry_fit",
          "expected_attendees",
          "networking_value",
          "typical_date",
          "typical_location",
          "estimated_cost",
          "key_benefits",
          "application_deadline",
          "website_hint",
        ],
        properties: {
          name: { type: "string" },
          event_type: {
            type: "string",
            enum: ["conference", "meetup", "summit", "demo_day", "pitch_competition", "trade_show"],
          },
          relevance_score: { type: "integer" },
          industry_fit: { type: "string" },
          expected_attendees: { type: "string" },
          networking_value: { type: "string", enum: ["high", "medium", "low"] },
          typical_date: { type: "string" },
          typical_location: { type: "string" },
          estimated_cost: { type: "string" },
          key_benefits: { type: "array", items: { type: "string" } },
          application_deadline: { type: "string" },
          website_hint: { type: "string" },
        },
      },
    },
    event_strategy: { type: "string" },
    priority_events: { type: "array", items: { type: "string" } },
  },
};

export const analyzeEventSchema = {
  type: "object",
  required: [
    "fit_score",
    "value_breakdown",
    "should_attend",
    "recommendation",
    "preparation_tips",
    "networking_targets",
    "roi_estimate",
    "risks",
  ],
  properties: {
    fit_score: { type: "integer" },
    value_breakdown: {
      type: "object",
      required: ["networking", "learning", "visibility", "deals"],
      properties: {
        networking: {
          type: "object",
          required: ["score", "reason"],
          properties: { score: { type: "integer" }, reason: { type: "string" } },
        },
        learning: {
          type: "object",
          required: ["score", "reason"],
          properties: { score: { type: "integer" }, reason: { type: "string" } },
        },
        visibility: {
          type: "object",
          required: ["score", "reason"],
          properties: { score: { type: "integer" }, reason: { type: "string" } },
        },
        deals: {
          type: "object",
          required: ["score", "reason"],
          properties: { score: { type: "integer" }, reason: { type: "string" } },
        },
      },
    },
    should_attend: { type: "boolean" },
    recommendation: { type: "string" },
    preparation_tips: { type: "array", items: { type: "string" } },
    networking_targets: { type: "array", items: { type: "string" } },
    roi_estimate: { type: "string" },
    risks: { type: "array", items: { type: "string" } },
  },
};

export const researchSpeakersArchetypesSchema = {
  type: "object",
  required: ["speaker_types", "key_connections", "research_tips"],
  properties: {
    speaker_types: {
      type: "array",
      items: {
        type: "object",
        required: [
          "type",
          "typical_title",
          "typical_companies",
          "topics_covered",
          "networking_value",
          "approach_strategy",
        ],
        properties: {
          type: { type: "string" },
          typical_title: { type: "string" },
          typical_companies: { type: "array", items: { type: "string" } },
          topics_covered: { type: "array", items: { type: "string" } },
          networking_value: { type: "string", enum: ["high", "medium", "low"] },
          approach_strategy: { type: "string" },
        },
      },
    },
    key_connections: { type: "string" },
    research_tips: { type: "array", items: { type: "string" } },
  },
};

export const researchSpeakersAnalysisSchema = {
  type: "object",
  required: ["speaker_analysis", "priority_connections", "networking_plan"],
  properties: {
    speaker_analysis: {
      type: "array",
      items: {
        type: "object",
        required: [
          "name",
          "relevance_score",
          "connection_value",
          "common_ground",
          "approach_strategy",
          "key_questions",
        ],
        properties: {
          name: { type: "string" },
          relevance_score: { type: "integer" },
          connection_value: { type: "string" },
          common_ground: { type: "string" },
          approach_strategy: { type: "string" },
          key_questions: { type: "array", items: { type: "string" } },
        },
      },
    },
    priority_connections: { type: "array", items: { type: "string" } },
    networking_plan: { type: "string" },
  },
};

export const generatePrepSchema = {
  type: "object",
  required: [
    "elevator_pitch",
    "talking_points",
    "questions_to_ask",
    "goals",
    "logistics_checklist",
    "materials_needed",
    "follow_up_template",
  ],
  properties: {
    elevator_pitch: {
      type: "object",
      required: ["15_second", "30_second", "60_second"],
      properties: {
        "15_second": { type: "string" },
        "30_second": { type: "string" },
        "60_second": { type: "string" },
      },
    },
    talking_points: {
      type: "array",
      items: {
        type: "object",
        required: ["topic", "key_message", "supporting_fact"],
        properties: {
          topic: { type: "string" },
          key_message: { type: "string" },
          supporting_fact: { type: "string" },
        },
      },
    },
    questions_to_ask: {
      type: "array",
      items: {
        type: "object",
        required: ["target", "question", "why"],
        properties: {
          target: { type: "string" },
          question: { type: "string" },
          why: { type: "string" },
        },
      },
    },
    goals: {
      type: "object",
      required: ["primary", "secondary", "success_metrics"],
      properties: {
        primary: { type: "string" },
        secondary: { type: "array", items: { type: "string" } },
        success_metrics: { type: "array", items: { type: "string" } },
      },
    },
    logistics_checklist: { type: "array", items: { type: "string" } },
    materials_needed: { type: "array", items: { type: "string" } },
    follow_up_template: { type: "string" },
  },
};

export const trackAttendanceInsightsSchema = {
  type: "object",
  required: ["roi_assessment", "follow_up_actions", "lessons_learned", "similar_events"],
  properties: {
    roi_assessment: { type: "string" },
    follow_up_actions: { type: "array", items: { type: "string" } },
    lessons_learned: { type: "array", items: { type: "string" } },
    similar_events: { type: "array", items: { type: "string" } },
  },
};
