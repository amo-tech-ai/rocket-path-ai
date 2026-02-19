/**
 * Investor Agent - Main Handler
 * AI-powered investor relationship management: discover, analyze, outreach, pipeline.
 * Migrated to shared patterns (006-EFN): G1 schemas, shared CORS, rate limiting.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import {
  DISCOVER_INVESTORS_SYSTEM,
  ANALYZE_INVESTOR_FIT_SYSTEM,
  FIND_WARM_PATHS_SYSTEM,
  GENERATE_OUTREACH_SYSTEM,
  ANALYZE_PIPELINE_SYSTEM,
  SCORE_DEAL_SYSTEM,
  PREPARE_MEETING_SYSTEM,
  ENRICH_INVESTOR_SYSTEM,
  COMPARE_INVESTORS_SYSTEM,
  ANALYZE_TERM_SHEET_SYSTEM,
  GENERATE_REPORT_SYSTEM,
  discoverInvestorsSchema,
  analyzeInvestorFitSchema,
  findWarmPathsSchema,
  generateOutreachSchema,
  analyzePipelineSchema,
  scoreDealSchema,
  prepareMeetingSchema,
  enrichInvestorSchema,
  compareInvestorsSchema,
  analyzeTermSheetSchema,
  generateReportSchema,
} from "./prompt.ts";

const MODEL = "gemini-3-flash-preview";

// ============ TYPES ============

interface Investor {
  id: string;
  name: string;
  firm_name?: string;
  type?: string;
  status: string;
  thesis_summary?: string;
  focus_areas?: string[];
  notable_investments?: string[];
  check_size_min?: number;
  check_size_max?: number;
  linkedin_url?: string;
  website_url?: string;
  fit_score?: number;
  committed_amount?: number;
  notes?: string;
  last_contact_date?: string;
  ai_analysis?: unknown;
  enriched_at?: string;
}

interface Startup {
  id: string;
  name?: string;
  industry?: string;
  stage?: string;
  description?: string;
  tagline?: string;
  traction_data?: Record<string, unknown>;
  founders?: unknown[];
  raise_amount?: number;
}

interface Contact {
  name: string;
  company?: string;
  title?: string;
  linkedin_url?: string;
}

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

// ============ ACTION HANDLERS ============

// 1. Discover investors matching startup profile
async function discoverInvestors(
  supabase: SupabaseClient,
  startupId: string,
  criteria: { stage?: string; industry?: string; geography?: string; checkSize?: number }
) {
  // Get startup data for context
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const startupData = startup as Startup | null;

  const userPrompt = `Analyze this startup and suggest ideal investor types:

Startup: ${startupData?.name || 'Unknown'}
Industry: ${criteria.industry || startupData?.industry || 'Tech'}
Stage: ${criteria.stage || startupData?.stage || 'seed'}
Geography: ${criteria.geography || 'Global'}
Target Check Size: ${criteria.checkSize ? `$${criteria.checkSize}` : 'Not specified'}

Generate 5-8 ideal investor profiles.`;

  const result = await callGemini(MODEL, DISCOVER_INVESTORS_SYSTEM, userPrompt, {
    responseJsonSchema: discoverInvestorsSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{ investors: unknown[]; search_strategy: string }>(result.text);

  return {
    success: true,
    investors: parsed?.investors || [],
    search_strategy: parsed?.search_strategy || "",
    criteria_used: criteria,
  };
}

// 2. Analyze investor fit score
async function analyzeInvestorFit(
  supabase: SupabaseClient,
  startupId: string,
  investorId: string
) {
  const [startupRes, investorRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("investors").select("*").eq("id", investorId).single(),
  ]);

  const startup = startupRes.data as Startup | null;
  const investor = investorRes.data as Investor | null;

  if (!investor) {
    throw new Error("Investor not found");
  }

  const focusAreas = Array.isArray(investor.focus_areas) ? investor.focus_areas.join(", ") : "Not specified";

  const userPrompt = `Analyze the fit between this startup and investor:

STARTUP:
- Name: ${startup?.name}
- Industry: ${startup?.industry}
- Stage: ${startup?.stage}
- Description: ${startup?.description}
- Traction: ${JSON.stringify(startup?.traction_data || {})}

INVESTOR:
- Name: ${investor.name}
- Firm: ${investor.firm_name}
- Type: ${investor.type}
- Thesis: ${investor.thesis_summary}
- Focus Areas: ${focusAreas}
- Check Size: ${investor.check_size_min} - ${investor.check_size_max}

Provide a detailed fit analysis.`;

  const result = await callGemini(MODEL, ANALYZE_INVESTOR_FIT_SYSTEM, userPrompt, {
    responseJsonSchema: analyzeInvestorFitSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    overall_score: number;
    breakdown: Record<string, { score: number; reasoning: string }>;
    strengths: string[];
    concerns: string[];
    recommendation: string;
    next_steps: string[];
  }>(result.text);

  if (!parsed) {
    throw new Error("Failed to parse investor fit analysis");
  }

  // Update investor with fit score
  await supabase
    .from("investors")
    .update({
      fit_score: parsed.overall_score,
      ai_analysis: parsed,
    })
    .eq("id", investorId);

  return { success: true, ...parsed };
}

// 3. Find warm introduction paths
async function findWarmPaths(
  supabase: SupabaseClient,
  startupId: string,
  investorId: string
) {
  const [startupRes, investorRes, contactsRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("investors").select("*").eq("id", investorId).single(),
    supabase.from("contacts").select("name, company, title, linkedin_url").eq("startup_id", startupId).limit(50),
  ]);

  const startup = startupRes.data as Startup | null;
  const investor = investorRes.data as Investor | null;
  const contacts = (contactsRes.data || []) as Contact[];

  const notableInvestments = Array.isArray(investor?.notable_investments)
    ? investor.notable_investments.join(", ")
    : "Unknown";

  const contactsList = contacts.slice(0, 20)
    .map((c) => `- ${c.name} (${c.company || 'N/A'}, ${c.title || 'N/A'}) - LinkedIn: ${c.linkedin_url || "N/A"}`)
    .join("\n");

  const userPrompt = `Identify potential warm introduction paths to this investor:

TARGET INVESTOR:
- Name: ${investor?.name}
- Firm: ${investor?.firm_name}
- LinkedIn: ${investor?.linkedin_url || "Unknown"}
- Portfolio: ${notableInvestments}

STARTUP'S NETWORK (${contacts.length} contacts):
${contactsList}

STARTUP FOUNDERS:
${JSON.stringify(startup?.founders || [])}

Analyze and suggest warm intro paths.`;

  const result = await callGemini(MODEL, FIND_WARM_PATHS_SYSTEM, userPrompt, {
    responseJsonSchema: findWarmPathsSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    warm_paths: unknown[];
    cold_approach_tips: string[];
    best_entry_point: string;
  }>(result.text);

  return { success: true, investor_name: investor?.name, ...(parsed || { warm_paths: [], cold_approach_tips: [], best_entry_point: "" }) };
}

// 4. Generate personalized outreach email
async function generateOutreach(
  supabase: SupabaseClient,
  startupId: string,
  investorId: string,
  outreachType: "cold" | "warm" | "follow_up"
) {
  const [startupRes, investorRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("investors").select("*").eq("id", investorId).single(),
  ]);

  const startup = startupRes.data as Startup | null;
  const investor = investorRes.data as Investor | null;

  const notableInvestments = Array.isArray(investor?.notable_investments)
    ? investor.notable_investments.join(", ")
    : "Unknown";

  const userPrompt = `Generate a ${outreachType} outreach email to this investor:

INVESTOR:
- Name: ${investor?.name}
- Firm: ${investor?.firm_name}
- Thesis: ${investor?.thesis_summary}
- Recent Investments: ${notableInvestments}

STARTUP:
- Name: ${startup?.name}
- Tagline: ${startup?.tagline}
- Stage: ${startup?.stage}
- Industry: ${startup?.industry}
- Traction: ${JSON.stringify(startup?.traction_data || {})}
- Description: ${startup?.description}

Generate outreach email.`;

  const result = await callGemini(MODEL, GENERATE_OUTREACH_SYSTEM, userPrompt, {
    responseJsonSchema: generateOutreachSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    subject_lines: string[];
    email_body: string;
    personalization_points: string[];
    call_to_action: string;
    follow_up_strategy: string;
    tips: string[];
  }>(result.text);

  return { success: true, outreach_type: outreachType, ...(parsed || { subject_lines: [], email_body: "", personalization_points: [], call_to_action: "", follow_up_strategy: "", tips: [] }) };
}

// 5. Track investor engagement (NO AI call — DB update only)
async function trackEngagement(
  supabase: SupabaseClient,
  investorId: string,
  engagement: {
    type: "email_sent" | "email_opened" | "meeting" | "follow_up" | "response";
    notes?: string;
    outcome?: string;
  }
) {
  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("id", investorId)
    .single();

  const investor = data as Investor | null;

  if (!investor) {
    throw new Error("Investor not found");
  }

  // Determine new status based on engagement
  const statusMap: Record<string, string> = {
    email_sent: "contacted",
    response: "responded",
    meeting: "meeting_scheduled",
    follow_up: investor.status,
  };

  const newStatus = statusMap[engagement.type] || investor.status;

  // Update investor
  await supabase
    .from("investors")
    .update({
      status: newStatus,
      last_contact_date: new Date().toISOString(),
      notes: engagement.notes
        ? `${investor.notes || ""}\n\n[${new Date().toLocaleDateString()}] ${engagement.type}: ${engagement.notes}`
        : investor.notes,
    })
    .eq("id", investorId);

  return {
    success: true,
    investor_id: investorId,
    previous_status: investor.status,
    new_status: newStatus,
    engagement_logged: engagement,
  };
}

// 6. Analyze fundraising pipeline
async function analyzePipeline(
  supabase: SupabaseClient,
  startupId: string
) {
  const { data: investorsData } = await supabase
    .from("investors")
    .select("*")
    .eq("startup_id", startupId);

  const { data: startupData } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const investors = (investorsData || []) as Investor[];
  const startup = startupData as Startup | null;

  if (investors.length === 0) {
    return {
      success: true,
      summary: "No investors in pipeline yet",
      recommendations: ["Start building your investor pipeline by adding target investors"],
    };
  }

  // Group by status
  const byStatus: Record<string, number> = {};
  investors.forEach((inv) => {
    const status = inv.status || "unknown";
    byStatus[status] = (byStatus[status] || 0) + 1;
  });

  const avgFitScore = Math.round(
    investors.reduce((sum, inv) => sum + (inv.fit_score || 0), 0) / investors.length
  );

  const highFitCount = investors.filter((inv) => (inv.fit_score || 0) >= 80).length;

  const userPrompt = `Analyze this fundraising pipeline:

TARGET RAISE: ${startup?.raise_amount ? `$${startup.raise_amount}` : "Not set"}
STAGE: ${startup?.stage}

PIPELINE BREAKDOWN:
${Object.entries(byStatus).map(([status, count]) => `- ${status}: ${count}`).join("\n")}

TOTAL INVESTORS: ${investors.length}
AVG FIT SCORE: ${avgFitScore}

HIGH FIT INVESTORS (80+): ${highFitCount}

Provide pipeline analysis.`;

  const result = await callGemini(MODEL, ANALYZE_PIPELINE_SYSTEM, userPrompt, {
    responseJsonSchema: analyzePipelineSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    health_score: number;
    summary: string;
    bottlenecks: string[];
    wins: string[];
    recommendations: { priority: string; action: string; reasoning: string }[];
    conversion_analysis: Record<string, string>;
    forecast: Record<string, unknown>;
  }>(result.text);

  return { success: true, total_investors: investors.length, by_status: byStatus, ...(parsed || { health_score: 0, summary: "", bottlenecks: [], wins: [], recommendations: [], conversion_analysis: {}, forecast: {} }) };
}

// 7. Score deal quality
async function scoreDeal(
  supabase: SupabaseClient,
  investorId: string
) {
  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("id", investorId)
    .single();

  const investor = data as Investor | null;

  if (!investor) {
    throw new Error("Investor not found");
  }

  const userPrompt = `Score this potential investment deal:

INVESTOR:
- Name: ${investor.name}
- Firm: ${investor.firm_name}
- Type: ${investor.type}
- Check Size: ${investor.check_size_min} - ${investor.check_size_max}
- Current Status: ${investor.status}
- Fit Score: ${investor.fit_score || "Not scored"}
- Last Contact: ${investor.last_contact_date || "Never"}

Provide deal scoring.`;

  const result = await callGemini(MODEL, SCORE_DEAL_SYSTEM, userPrompt, {
    responseJsonSchema: scoreDealSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    deal_score: number;
    probability: number;
    factors: Record<string, { score: number; evidence: string }>;
    risk_factors: string[];
    accelerators: string[];
    recommended_next_action: string;
  }>(result.text);

  if (!parsed) {
    throw new Error("Failed to parse deal score");
  }

  return { success: true, investor_name: investor.name, ...parsed };
}

// 8. Prepare for meeting
async function prepareMeeting(
  supabase: SupabaseClient,
  startupId: string,
  investorId: string
) {
  const [startupRes, investorRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("investors").select("*").eq("id", investorId).single(),
  ]);

  const startup = startupRes.data as Startup | null;
  const investor = investorRes.data as Investor | null;

  const notableInvestments = Array.isArray(investor?.notable_investments)
    ? investor.notable_investments.join(", ")
    : "Unknown";

  const userPrompt = `Prepare a meeting brief for this investor meeting:

STARTUP:
- Name: ${startup?.name}
- Stage: ${startup?.stage}
- Industry: ${startup?.industry}
- Traction: ${JSON.stringify(startup?.traction_data || {})}

INVESTOR:
- Name: ${investor?.name}
- Firm: ${investor?.firm_name}
- Thesis: ${investor?.thesis_summary}
- Portfolio: ${notableInvestments}

Generate meeting prep.`;

  const result = await callGemini(MODEL, PREPARE_MEETING_SYSTEM, userPrompt, {
    responseJsonSchema: prepareMeetingSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    key_talking_points: string[];
    questions_to_expect: { question: string; suggested_answer: string }[];
    questions_to_ask: string[];
    portfolio_connections: string[];
    thesis_alignment_points: string[];
    red_flags_to_address: string[];
    desired_outcomes: string[];
    follow_up_plan: string;
  }>(result.text);

  return { success: true, investor_name: investor?.name, ...(parsed || { key_talking_points: [], questions_to_expect: [], questions_to_ask: [], portfolio_connections: [], thesis_alignment_points: [], red_flags_to_address: [], desired_outcomes: [], follow_up_plan: "" }) };
}

// 9. Enrich investor profile
async function enrichInvestor(
  supabase: SupabaseClient,
  investorId: string,
  linkedinUrl?: string
) {
  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("id", investorId)
    .single();

  const investor = data as Investor | null;

  if (!investor) {
    throw new Error("Investor not found");
  }

  const userPrompt = `Enrich this investor profile with additional research insights:

CURRENT DATA:
- Name: ${investor.name}
- Firm: ${investor.firm_name}
- Type: ${investor.type}
- LinkedIn: ${linkedinUrl || investor.linkedin_url || "Unknown"}
- Website: ${investor.website_url || "Unknown"}

Research and provide enriched data.`;

  const result = await callGemini(MODEL, ENRICH_INVESTOR_SYSTEM, userPrompt, {
    responseJsonSchema: enrichInvestorSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    enriched_bio: string;
    investment_thesis: string;
    typical_check_size: { min: number; max: number };
    preferred_stages: string[];
    focus_sectors: string[];
    notable_investments: string[];
    board_positions: string[];
    media_mentions: string[];
    engagement_tips: string[];
    red_flags: string[];
  }>(result.text);

  if (!parsed) {
    throw new Error("Failed to parse enriched investor data");
  }

  // Update investor with enriched data
  await supabase
    .from("investors")
    .update({
      thesis_summary: parsed.investment_thesis,
      focus_areas: parsed.focus_sectors,
      check_size_min: parsed.typical_check_size.min,
      check_size_max: parsed.typical_check_size.max,
      notable_investments: parsed.notable_investments,
      enriched_at: new Date().toISOString(),
    })
    .eq("id", investorId);

  return { success: true, ...parsed };
}

// 10. Compare investors
async function compareInvestors(
  supabase: SupabaseClient,
  investorIds: string[]
) {
  const { data } = await supabase
    .from("investors")
    .select("*")
    .in("id", investorIds);

  const investors = (data || []) as Investor[];

  if (investors.length < 2) {
    throw new Error("Need at least 2 investors to compare");
  }

  const userPrompt = `Compare these investors for a fundraising decision:

INVESTORS:
${investors.map((inv, i) => `
${i + 1}. ${inv.name} (${inv.firm_name})
   - Type: ${inv.type}
   - Fit Score: ${inv.fit_score || "N/A"}
   - Check Size: ${inv.check_size_min} - ${inv.check_size_max}
   - Thesis: ${inv.thesis_summary}
   - Status: ${inv.status}
`).join("\n")}

Provide comparison.`;

  const result = await callGemini(MODEL, COMPARE_INVESTORS_SYSTEM, userPrompt, {
    responseJsonSchema: compareInvestorsSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    comparison_matrix: Record<string, { winner: string; analysis: string }>;
    overall_ranking: { rank: number; name: string; reasoning: string }[];
    recommendation: string;
    parallel_strategy: string;
  }>(result.text);

  return { success: true, investors_compared: investors.length, ...(parsed || { comparison_matrix: {}, overall_ranking: [], recommendation: "", parallel_strategy: "" }) };
}

// 11. Generate term sheet analysis
async function analyzeTermSheet(
  _startupId: string,
  termSheetData: {
    valuation: number;
    amount: number;
    investor_name: string;
    key_terms?: Record<string, unknown>;
  }
) {
  const userPrompt = `Analyze this term sheet offer:

OFFER:
- Investor: ${termSheetData.investor_name}
- Valuation: $${termSheetData.valuation}
- Amount: $${termSheetData.amount}
- Key Terms: ${JSON.stringify(termSheetData.key_terms || {})}

Provide analysis.`;

  const result = await callGemini(MODEL, ANALYZE_TERM_SHEET_SYSTEM, userPrompt, {
    responseJsonSchema: analyzeTermSheetSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    valuation_assessment: Record<string, unknown>;
    dilution_analysis: Record<string, unknown>;
    terms_review: { term: string; assessment: string; explanation: string }[];
    negotiation_points: string[];
    overall_recommendation: string;
    next_steps: string[];
  }>(result.text);

  if (!parsed) {
    throw new Error("Failed to parse term sheet analysis");
  }

  return { success: true, ...parsed };
}

// 12. Generate fundraising report
async function generateReport(
  supabase: SupabaseClient,
  startupId: string
) {
  const [startupRes, investorsRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("investors").select("*").eq("startup_id", startupId),
  ]);

  const startup = startupRes.data as Startup | null;
  const investors = (investorsRes.data || []) as Investor[];

  // Group investors by status
  const byStatus: Record<string, number> = {};
  investors.forEach((inv) => {
    const status = inv.status || "unknown";
    byStatus[status] = (byStatus[status] || 0) + 1;
  });

  const closedAmount = investors
    .filter((inv) => inv.status === "closed")
    .reduce((sum, inv) => sum + (inv.committed_amount || 0), 0);

  const raiseAmount = startup?.raise_amount || 0;
  const percentComplete = raiseAmount > 0 ? Math.round((closedAmount / raiseAmount) * 100) : 0;

  const userPrompt = `Generate a fundraising progress report:

STARTUP: ${startup?.name}
TARGET RAISE: $${raiseAmount}
STAGE: ${startup?.stage}

PIPELINE:
${Object.entries(byStatus).map(([status, count]) => `- ${status}: ${count}`).join("\n")}

TOTAL INVESTORS: ${investors.length}
CLOSED AMOUNT: $${closedAmount}

Generate report.`;

  const result = await callGemini(MODEL, GENERATE_REPORT_SYSTEM, userPrompt, {
    responseJsonSchema: generateReportSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    executive_summary: string;
    progress_metrics: Record<string, unknown>;
    funnel_analysis: Record<string, string>;
    top_prospects: string[];
    risks: string[];
    this_week_priorities: string[];
    forecast: Record<string, unknown>;
  }>(result.text);

  return {
    success: true,
    startup_name: startup?.name,
    generated_at: new Date().toISOString(),
    ...(parsed || { executive_summary: "", progress_metrics: {}, funnel_analysis: {}, top_prospects: [], risks: [], this_week_priorities: [], forecast: {} }),
  };
}

// ============ MAIN HANDLER ============

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = getCorsHeaders(req);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit
    const rateResult = checkRateLimit(user.id, "investor-agent", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    const body = await req.json();
    const { action, startup_id, ...params } = body;

    console.log(`[investor-agent] Action: ${action}, User: ${user.id}`);

    let result: unknown;

    switch (action) {
      case "discover_investors":
        result = await discoverInvestors(supabase, startup_id, params.criteria || {});
        break;
      case "analyze_investor_fit":
        result = await analyzeInvestorFit(supabase, startup_id, params.investor_id);
        break;
      case "find_warm_paths":
        result = await findWarmPaths(supabase, startup_id, params.investor_id);
        break;
      case "generate_outreach":
        result = await generateOutreach(supabase, startup_id, params.investor_id, params.outreach_type || "cold");
        break;
      case "track_engagement":
        result = await trackEngagement(supabase, params.investor_id, params.engagement);
        break;
      case "analyze_pipeline":
        result = await analyzePipeline(supabase, startup_id);
        break;
      case "score_deal":
        result = await scoreDeal(supabase, params.investor_id);
        break;
      case "prepare_meeting":
        result = await prepareMeeting(supabase, startup_id, params.investor_id);
        break;
      case "enrich_investor":
        result = await enrichInvestor(supabase, params.investor_id, params.linkedin_url);
        break;
      case "compare_investors":
        result = await compareInvestors(supabase, params.investor_ids);
        break;
      case "analyze_term_sheet":
        result = await analyzeTermSheet(startup_id, params.term_sheet_data);
        break;
      case "generate_report":
        result = await generateReport(supabase, startup_id);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[investor-agent] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
