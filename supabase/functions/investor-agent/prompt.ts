/**
 * Investor Agent — Prompts & JSON Schemas
 * Extracted from inline prompts for G1 compliance.
 * 12 actions: 10 AI-powered, 2 DB-only (trackEngagement).
 */

// ============ SYSTEM PROMPTS ============

export const DISCOVER_INVESTORS_SYSTEM = `You are an expert investor matching AI. Generate realistic but fictional investor profiles that match the startup's profile.`;

export const ANALYZE_INVESTOR_FIT_SYSTEM = `You are an expert at matching startups with investors. Provide honest, actionable assessments.`;

export const FIND_WARM_PATHS_SYSTEM = `You are an expert at networking and finding warm introduction paths to investors.`;

export const GENERATE_OUTREACH_SYSTEM = `You are an expert at writing investor outreach emails that get responses. Be concise, specific, and personalized.`;

export const ANALYZE_PIPELINE_SYSTEM = `You are an expert at analyzing fundraising pipelines and providing actionable recommendations.`;

export const SCORE_DEAL_SYSTEM = `You are an expert at scoring fundraising deal quality and predicting close probability.`;

export const PREPARE_MEETING_SYSTEM = `You are an expert at preparing founders for investor meetings.`;

export const ENRICH_INVESTOR_SYSTEM = `You are an expert at researching and enriching investor profiles.`;

export const COMPARE_INVESTORS_SYSTEM = `You are an expert at comparing investors and advising founders on fundraising strategy.`;

export const ANALYZE_TERM_SHEET_SYSTEM = `You are an expert at analyzing term sheets and advising founders on fundraising negotiations.`;

export const GENERATE_REPORT_SYSTEM = `You are an expert at generating executive fundraising reports.`;

// ============ JSON SCHEMAS (G1 compliance) ============

export const discoverInvestorsSchema = {
  type: "object",
  required: ["investors", "search_strategy"],
  properties: {
    investors: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "firm", "type", "fit_score", "thesis_match", "check_size", "focus_areas", "stage_preference", "notable_investments", "outreach_angle"],
        properties: {
          name: { type: "string" },
          firm: { type: "string" },
          type: { type: "string", enum: ["vc", "angel", "accelerator", "family_office"] },
          fit_score: { type: "integer" },
          thesis_match: { type: "string" },
          check_size: { type: "string" },
          focus_areas: { type: "array", items: { type: "string" } },
          stage_preference: { type: "string" },
          notable_investments: { type: "array", items: { type: "string" } },
          outreach_angle: { type: "string" },
        },
      },
    },
    search_strategy: { type: "string" },
  },
};

export const analyzeInvestorFitSchema = {
  type: "object",
  required: ["overall_score", "breakdown", "strengths", "concerns", "recommendation", "next_steps"],
  properties: {
    overall_score: { type: "integer" },
    breakdown: {
      type: "object",
      required: ["thesis_alignment", "stage_match", "sector_fit", "geography", "check_size"],
      properties: {
        thesis_alignment: {
          type: "object",
          required: ["score", "reasoning"],
          properties: { score: { type: "integer" }, reasoning: { type: "string" } },
        },
        stage_match: {
          type: "object",
          required: ["score", "reasoning"],
          properties: { score: { type: "integer" }, reasoning: { type: "string" } },
        },
        sector_fit: {
          type: "object",
          required: ["score", "reasoning"],
          properties: { score: { type: "integer" }, reasoning: { type: "string" } },
        },
        geography: {
          type: "object",
          required: ["score", "reasoning"],
          properties: { score: { type: "integer" }, reasoning: { type: "string" } },
        },
        check_size: {
          type: "object",
          required: ["score", "reasoning"],
          properties: { score: { type: "integer" }, reasoning: { type: "string" } },
        },
      },
    },
    strengths: { type: "array", items: { type: "string" } },
    concerns: { type: "array", items: { type: "string" } },
    recommendation: { type: "string", enum: ["Pursue", "Consider", "Deprioritize"] },
    next_steps: { type: "array", items: { type: "string" } },
  },
};

export const findWarmPathsSchema = {
  type: "object",
  required: ["warm_paths", "cold_approach_tips", "best_entry_point"],
  properties: {
    warm_paths: {
      type: "array",
      items: {
        type: "object",
        required: ["path_type", "through", "connection_strength", "reasoning", "suggested_approach"],
        properties: {
          path_type: { type: "string", enum: ["portfolio_founder", "mutual_connection", "alumni", "event"] },
          through: { type: "string" },
          connection_strength: { type: "string", enum: ["strong", "medium", "weak"] },
          reasoning: { type: "string" },
          suggested_approach: { type: "string" },
        },
      },
    },
    cold_approach_tips: { type: "array", items: { type: "string" } },
    best_entry_point: { type: "string" },
  },
};

export const generateOutreachSchema = {
  type: "object",
  required: ["subject_lines", "email_body", "personalization_points", "call_to_action", "follow_up_strategy", "tips"],
  properties: {
    subject_lines: { type: "array", items: { type: "string" } },
    email_body: { type: "string" },
    personalization_points: { type: "array", items: { type: "string" } },
    call_to_action: { type: "string" },
    follow_up_strategy: { type: "string" },
    tips: { type: "array", items: { type: "string" } },
  },
};

export const analyzePipelineSchema = {
  type: "object",
  required: ["health_score", "summary", "bottlenecks", "wins", "recommendations", "conversion_analysis", "forecast"],
  properties: {
    health_score: { type: "integer" },
    summary: { type: "string" },
    bottlenecks: { type: "array", items: { type: "string" } },
    wins: { type: "array", items: { type: "string" } },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        required: ["priority", "action", "reasoning"],
        properties: {
          priority: { type: "string", enum: ["high", "medium", "low"] },
          action: { type: "string" },
          reasoning: { type: "string" },
        },
      },
    },
    conversion_analysis: {
      type: "object",
      required: ["contact_to_meeting", "meeting_to_dd", "bottleneck_stage"],
      properties: {
        contact_to_meeting: { type: "string" },
        meeting_to_dd: { type: "string" },
        bottleneck_stage: { type: "string" },
      },
    },
    forecast: {
      type: "object",
      required: ["likely_closes", "estimated_amount", "timeline"],
      properties: {
        likely_closes: { type: "integer" },
        estimated_amount: { type: "string" },
        timeline: { type: "string" },
      },
    },
  },
};

export const scoreDealSchema = {
  type: "object",
  required: ["deal_score", "probability", "factors", "risk_factors", "accelerators", "recommended_next_action"],
  properties: {
    deal_score: { type: "integer" },
    probability: { type: "number" },
    factors: {
      type: "object",
      required: ["investor_interest", "timeline_alignment", "terms_likelihood", "strategic_value"],
      properties: {
        investor_interest: {
          type: "object",
          required: ["score", "evidence"],
          properties: { score: { type: "integer" }, evidence: { type: "string" } },
        },
        timeline_alignment: {
          type: "object",
          required: ["score", "evidence"],
          properties: { score: { type: "integer" }, evidence: { type: "string" } },
        },
        terms_likelihood: {
          type: "object",
          required: ["score", "evidence"],
          properties: { score: { type: "integer" }, evidence: { type: "string" } },
        },
        strategic_value: {
          type: "object",
          required: ["score", "evidence"],
          properties: { score: { type: "integer" }, evidence: { type: "string" } },
        },
      },
    },
    risk_factors: { type: "array", items: { type: "string" } },
    accelerators: { type: "array", items: { type: "string" } },
    recommended_next_action: { type: "string" },
  },
};

export const prepareMeetingSchema = {
  type: "object",
  required: ["key_talking_points", "questions_to_expect", "questions_to_ask", "portfolio_connections", "thesis_alignment_points", "red_flags_to_address", "desired_outcomes", "follow_up_plan"],
  properties: {
    key_talking_points: { type: "array", items: { type: "string" } },
    questions_to_expect: {
      type: "array",
      items: {
        type: "object",
        required: ["question", "suggested_answer"],
        properties: {
          question: { type: "string" },
          suggested_answer: { type: "string" },
        },
      },
    },
    questions_to_ask: { type: "array", items: { type: "string" } },
    portfolio_connections: { type: "array", items: { type: "string" } },
    thesis_alignment_points: { type: "array", items: { type: "string" } },
    red_flags_to_address: { type: "array", items: { type: "string" } },
    desired_outcomes: { type: "array", items: { type: "string" } },
    follow_up_plan: { type: "string" },
  },
};

export const enrichInvestorSchema = {
  type: "object",
  required: ["enriched_bio", "investment_thesis", "typical_check_size", "preferred_stages", "focus_sectors", "notable_investments", "board_positions", "media_mentions", "engagement_tips", "red_flags"],
  properties: {
    enriched_bio: { type: "string" },
    investment_thesis: { type: "string" },
    typical_check_size: {
      type: "object",
      required: ["min", "max"],
      properties: {
        min: { type: "integer" },
        max: { type: "integer" },
      },
    },
    preferred_stages: { type: "array", items: { type: "string" } },
    focus_sectors: { type: "array", items: { type: "string" } },
    notable_investments: { type: "array", items: { type: "string" } },
    board_positions: { type: "array", items: { type: "string" } },
    media_mentions: { type: "array", items: { type: "string" } },
    engagement_tips: { type: "array", items: { type: "string" } },
    red_flags: { type: "array", items: { type: "string" } },
  },
};

export const compareInvestorsSchema = {
  type: "object",
  required: ["comparison_matrix", "overall_ranking", "recommendation", "parallel_strategy"],
  properties: {
    comparison_matrix: {
      type: "object",
      required: ["check_size", "strategic_value", "speed_to_close", "founder_friendliness"],
      properties: {
        check_size: {
          type: "object",
          required: ["winner", "analysis"],
          properties: { winner: { type: "string" }, analysis: { type: "string" } },
        },
        strategic_value: {
          type: "object",
          required: ["winner", "analysis"],
          properties: { winner: { type: "string" }, analysis: { type: "string" } },
        },
        speed_to_close: {
          type: "object",
          required: ["winner", "analysis"],
          properties: { winner: { type: "string" }, analysis: { type: "string" } },
        },
        founder_friendliness: {
          type: "object",
          required: ["winner", "analysis"],
          properties: { winner: { type: "string" }, analysis: { type: "string" } },
        },
      },
    },
    overall_ranking: {
      type: "array",
      items: {
        type: "object",
        required: ["rank", "name", "reasoning"],
        properties: {
          rank: { type: "integer" },
          name: { type: "string" },
          reasoning: { type: "string" },
        },
      },
    },
    recommendation: { type: "string" },
    parallel_strategy: { type: "string" },
  },
};

export const analyzeTermSheetSchema = {
  type: "object",
  required: ["valuation_assessment", "dilution_analysis", "terms_review", "negotiation_points", "overall_recommendation", "next_steps"],
  properties: {
    valuation_assessment: {
      type: "object",
      required: ["fair_value_range", "offered_vs_fair", "reasoning"],
      properties: {
        fair_value_range: {
          type: "object",
          required: ["low", "high"],
          properties: { low: { type: "integer" }, high: { type: "integer" } },
        },
        offered_vs_fair: { type: "string", enum: ["above", "within", "below"] },
        reasoning: { type: "string" },
      },
    },
    dilution_analysis: {
      type: "object",
      required: ["percent_given", "post_money_ownership"],
      properties: {
        percent_given: { type: "number" },
        post_money_ownership: { type: "string" },
      },
    },
    terms_review: {
      type: "array",
      items: {
        type: "object",
        required: ["term", "assessment", "explanation"],
        properties: {
          term: { type: "string" },
          assessment: { type: "string", enum: ["standard", "favorable", "concerning"] },
          explanation: { type: "string" },
        },
      },
    },
    negotiation_points: { type: "array", items: { type: "string" } },
    overall_recommendation: { type: "string", enum: ["Accept", "Negotiate", "Decline"] },
    next_steps: { type: "array", items: { type: "string" } },
  },
};

export const generateReportSchema = {
  type: "object",
  required: ["executive_summary", "progress_metrics", "funnel_analysis", "top_prospects", "risks", "this_week_priorities", "forecast"],
  properties: {
    executive_summary: { type: "string" },
    progress_metrics: {
      type: "object",
      required: ["target", "raised", "percent_complete", "pipeline_value"],
      properties: {
        target: { type: "integer" },
        raised: { type: "integer" },
        percent_complete: { type: "integer" },
        pipeline_value: { type: "string" },
      },
    },
    funnel_analysis: {
      type: "object",
      required: ["contact_to_meeting_rate", "meeting_to_dd_rate", "dd_to_close_rate"],
      properties: {
        contact_to_meeting_rate: { type: "string" },
        meeting_to_dd_rate: { type: "string" },
        dd_to_close_rate: { type: "string" },
      },
    },
    top_prospects: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    this_week_priorities: { type: "array", items: { type: "string" } },
    forecast: {
      type: "object",
      required: ["expected_close_date", "confidence"],
      properties: {
        expected_close_date: { type: "string" },
        confidence: { type: "string", enum: ["high", "medium", "low"] },
      },
    },
  },
};
