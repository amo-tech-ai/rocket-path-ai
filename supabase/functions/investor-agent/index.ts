import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Type definitions
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

// Helper to call Gemini API
async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Parse JSON from AI response
function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                    text.match(/\{[\s\S]*\}/) ||
                    text.match(/\[[\s\S]*\]/);
  
  if (jsonMatch) {
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonStr);
  }
  throw new Error("Could not parse JSON from response");
}

// Create supabase client helper
function createSupabaseClient(authHeader: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
}

type SupabaseClient = ReturnType<typeof createSupabaseClient>;

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

  const prompt = `Analyze this startup and suggest ideal investor types:

Startup: ${startupData?.name || 'Unknown'}
Industry: ${criteria.industry || startupData?.industry || 'Tech'}
Stage: ${criteria.stage || startupData?.stage || 'seed'}
Geography: ${criteria.geography || 'Global'}
Target Check Size: ${criteria.checkSize ? `$${criteria.checkSize}` : 'Not specified'}

Generate a JSON response with 5-8 ideal investor profiles:
{
  "investors": [
    {
      "name": "Example VC",
      "firm": "Example Ventures",
      "type": "vc|angel|accelerator|family_office",
      "fit_score": 85,
      "thesis_match": "Why this investor is a good fit",
      "check_size": "$500K - $2M",
      "focus_areas": ["SaaS", "AI", "Healthcare"],
      "stage_preference": "seed",
      "notable_investments": ["Company A", "Company B"],
      "outreach_angle": "Suggested approach for this investor"
    }
  ],
  "search_strategy": "Recommended discovery approach"
}`;

  const response = await callGemini(prompt, "You are an expert investor matching AI. Generate realistic but fictional investor profiles that match the startup's profile.");
  const result = parseJsonResponse<{ investors: unknown[]; search_strategy: string }>(response);
  
  return {
    success: true,
    investors: result.investors,
    search_strategy: result.search_strategy,
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

  const prompt = `Analyze the fit between this startup and investor:

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

Provide a detailed fit analysis as JSON:
{
  "overall_score": 85,
  "breakdown": {
    "thesis_alignment": { "score": 90, "reasoning": "..." },
    "stage_match": { "score": 80, "reasoning": "..." },
    "sector_fit": { "score": 85, "reasoning": "..." },
    "geography": { "score": 90, "reasoning": "..." },
    "check_size": { "score": 75, "reasoning": "..." }
  },
  "strengths": ["Strength 1", "Strength 2"],
  "concerns": ["Concern 1", "Concern 2"],
  "recommendation": "Pursue|Consider|Deprioritize",
  "next_steps": ["Step 1", "Step 2"]
}`;

  const response = await callGemini(prompt, "You are an expert at matching startups with investors. Provide honest, actionable assessments.");
  const result = parseJsonResponse<{
    overall_score: number;
    breakdown: Record<string, { score: number; reasoning: string }>;
    strengths: string[];
    concerns: string[];
    recommendation: string;
    next_steps: string[];
  }>(response);

  // Update investor with fit score
  await supabase
    .from("investors")
    .update({ 
      fit_score: result.overall_score,
      ai_analysis: result 
    })
    .eq("id", investorId);

  return { success: true, ...result };
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

  const prompt = `Identify potential warm introduction paths to this investor:

TARGET INVESTOR:
- Name: ${investor?.name}
- Firm: ${investor?.firm_name}
- LinkedIn: ${investor?.linkedin_url || "Unknown"}
- Portfolio: ${notableInvestments}

STARTUP'S NETWORK (${contacts.length} contacts):
${contactsList}

STARTUP FOUNDERS:
${JSON.stringify(startup?.founders || [])}

Analyze and suggest warm intro paths as JSON:
{
  "warm_paths": [
    {
      "path_type": "portfolio_founder|mutual_connection|alumni|event",
      "through": "Name of intermediary",
      "connection_strength": "strong|medium|weak",
      "reasoning": "Why this path could work",
      "suggested_approach": "How to leverage this connection"
    }
  ],
  "cold_approach_tips": ["Tip 1", "Tip 2"],
  "best_entry_point": "Recommended first step"
}`;

  const response = await callGemini(prompt, "You are an expert at networking and finding warm introduction paths to investors.");
  const result = parseJsonResponse<{
    warm_paths: unknown[];
    cold_approach_tips: string[];
    best_entry_point: string;
  }>(response);

  return { success: true, investor_name: investor?.name, ...result };
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

  const prompt = `Generate a ${outreachType} outreach email to this investor:

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

Generate outreach email as JSON:
{
  "subject_lines": ["Option 1", "Option 2", "Option 3"],
  "email_body": "The full email body with personalization",
  "personalization_points": ["Point 1 referencing investor thesis", "Point 2 referencing portfolio"],
  "call_to_action": "Specific ask",
  "follow_up_strategy": "When and how to follow up",
  "tips": ["Tip to improve response rate"]
}`;

  const response = await callGemini(prompt, "You are an expert at writing investor outreach emails that get responses. Be concise, specific, and personalized.");
  const result = parseJsonResponse<{
    subject_lines: string[];
    email_body: string;
    personalization_points: string[];
    call_to_action: string;
    follow_up_strategy: string;
    tips: string[];
  }>(response);

  return { success: true, outreach_type: outreachType, ...result };
}

// 5. Track investor engagement
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

  const prompt = `Analyze this fundraising pipeline:

TARGET RAISE: ${startup?.raise_amount ? `$${startup.raise_amount}` : "Not set"}
STAGE: ${startup?.stage}

PIPELINE BREAKDOWN:
${Object.entries(byStatus).map(([status, count]) => `- ${status}: ${count}`).join("\n")}

TOTAL INVESTORS: ${investors.length}
AVG FIT SCORE: ${avgFitScore}

HIGH FIT INVESTORS (80+): ${highFitCount}

Provide pipeline analysis as JSON:
{
  "health_score": 75,
  "summary": "Brief pipeline health summary",
  "bottlenecks": ["Bottleneck 1", "Bottleneck 2"],
  "wins": ["Recent win or positive trend"],
  "recommendations": [
    { "priority": "high", "action": "What to do", "reasoning": "Why" }
  ],
  "conversion_analysis": {
    "contact_to_meeting": "X%",
    "meeting_to_dd": "X%",
    "bottleneck_stage": "Stage with lowest conversion"
  },
  "forecast": {
    "likely_closes": 2,
    "estimated_amount": "$500K",
    "timeline": "4-6 weeks"
  }
}`;

  const response = await callGemini(prompt, "You are an expert at analyzing fundraising pipelines and providing actionable recommendations.");
  const result = parseJsonResponse<{
    health_score: number;
    summary: string;
    bottlenecks: string[];
    wins: string[];
    recommendations: { priority: string; action: string; reasoning: string }[];
    conversion_analysis: Record<string, string>;
    forecast: Record<string, unknown>;
  }>(response);

  return { success: true, total_investors: investors.length, by_status: byStatus, ...result };
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

  const prompt = `Score this potential investment deal:

INVESTOR:
- Name: ${investor.name}
- Firm: ${investor.firm_name}
- Type: ${investor.type}
- Check Size: ${investor.check_size_min} - ${investor.check_size_max}
- Current Status: ${investor.status}
- Fit Score: ${investor.fit_score || "Not scored"}
- Last Contact: ${investor.last_contact_date || "Never"}

Provide deal scoring as JSON:
{
  "deal_score": 75,
  "probability": 0.35,
  "factors": {
    "investor_interest": { "score": 80, "evidence": "..." },
    "timeline_alignment": { "score": 70, "evidence": "..." },
    "terms_likelihood": { "score": 75, "evidence": "..." },
    "strategic_value": { "score": 85, "evidence": "..." }
  },
  "risk_factors": ["Risk 1", "Risk 2"],
  "accelerators": ["What could speed this up"],
  "recommended_next_action": "Specific next step"
}`;

  const response = await callGemini(prompt, "You are an expert at scoring fundraising deal quality and predicting close probability.");
  const result = parseJsonResponse<{
    deal_score: number;
    probability: number;
    factors: Record<string, { score: number; evidence: string }>;
    risk_factors: string[];
    accelerators: string[];
    recommended_next_action: string;
  }>(response);

  return { success: true, investor_name: investor.name, ...result };
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

  const prompt = `Prepare a meeting brief for this investor meeting:

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

Generate meeting prep as JSON:
{
  "key_talking_points": ["Point 1", "Point 2", "Point 3"],
  "questions_to_expect": [
    { "question": "Expected question", "suggested_answer": "How to answer" }
  ],
  "questions_to_ask": ["Question 1", "Question 2"],
  "portfolio_connections": ["Relevant portfolio company and why"],
  "thesis_alignment_points": ["How you align with their thesis"],
  "red_flags_to_address": ["Potential concern and how to address"],
  "desired_outcomes": ["What to aim for in this meeting"],
  "follow_up_plan": "Suggested follow up after meeting"
}`;

  const response = await callGemini(prompt, "You are an expert at preparing founders for investor meetings.");
  const result = parseJsonResponse<{
    key_talking_points: string[];
    questions_to_expect: { question: string; suggested_answer: string }[];
    questions_to_ask: string[];
    portfolio_connections: string[];
    thesis_alignment_points: string[];
    red_flags_to_address: string[];
    desired_outcomes: string[];
    follow_up_plan: string;
  }>(response);

  return { success: true, investor_name: investor?.name, ...result };
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

  const prompt = `Enrich this investor profile with additional research insights:

CURRENT DATA:
- Name: ${investor.name}
- Firm: ${investor.firm_name}
- Type: ${investor.type}
- LinkedIn: ${linkedinUrl || investor.linkedin_url || "Unknown"}
- Website: ${investor.website_url || "Unknown"}

Research and provide enriched data as JSON:
{
  "enriched_bio": "Detailed professional background",
  "investment_thesis": "Their stated or inferred investment thesis",
  "typical_check_size": { "min": 100000, "max": 500000 },
  "preferred_stages": ["seed", "series_a"],
  "focus_sectors": ["SaaS", "AI", "Healthcare"],
  "notable_investments": ["Company A (outcome)", "Company B (outcome)"],
  "board_positions": ["Company A - Board Member"],
  "media_mentions": ["Recent article or podcast"],
  "engagement_tips": ["How to best approach this investor"],
  "red_flags": ["Any concerns to be aware of"]
}`;

  const response = await callGemini(prompt, "You are an expert at researching and enriching investor profiles.");
  const result = parseJsonResponse<{
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
  }>(response);

  // Update investor with enriched data
  await supabase
    .from("investors")
    .update({
      thesis_summary: result.investment_thesis,
      focus_areas: result.focus_sectors,
      check_size_min: result.typical_check_size.min,
      check_size_max: result.typical_check_size.max,
      notable_investments: result.notable_investments,
      enriched_at: new Date().toISOString(),
    })
    .eq("id", investorId);

  return { success: true, ...result };
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

  const prompt = `Compare these investors for a fundraising decision:

INVESTORS:
${investors.map((inv, i) => `
${i + 1}. ${inv.name} (${inv.firm_name})
   - Type: ${inv.type}
   - Fit Score: ${inv.fit_score || "N/A"}
   - Check Size: ${inv.check_size_min} - ${inv.check_size_max}
   - Thesis: ${inv.thesis_summary}
   - Status: ${inv.status}
`).join("\n")}

Provide comparison as JSON:
{
  "comparison_matrix": {
    "check_size": { "winner": "Investor name", "analysis": "..." },
    "strategic_value": { "winner": "Investor name", "analysis": "..." },
    "speed_to_close": { "winner": "Investor name", "analysis": "..." },
    "founder_friendliness": { "winner": "Investor name", "analysis": "..." }
  },
  "overall_ranking": [
    { "rank": 1, "name": "Investor name", "reasoning": "Why #1" }
  ],
  "recommendation": "Which investor to prioritize and why",
  "parallel_strategy": "How to manage multiple conversations"
}`;

  const response = await callGemini(prompt, "You are an expert at comparing investors and advising founders on fundraising strategy.");
  const result = parseJsonResponse<{
    comparison_matrix: Record<string, { winner: string; analysis: string }>;
    overall_ranking: { rank: number; name: string; reasoning: string }[];
    recommendation: string;
    parallel_strategy: string;
  }>(response);

  return { success: true, investors_compared: investors.length, ...result };
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
  const prompt = `Analyze this term sheet offer:

OFFER:
- Investor: ${termSheetData.investor_name}
- Valuation: $${termSheetData.valuation}
- Amount: $${termSheetData.amount}
- Key Terms: ${JSON.stringify(termSheetData.key_terms || {})}

Provide analysis as JSON:
{
  "valuation_assessment": {
    "fair_value_range": { "low": 5000000, "high": 8000000 },
    "offered_vs_fair": "above|within|below",
    "reasoning": "..."
  },
  "dilution_analysis": {
    "percent_given": 15,
    "post_money_ownership": "Founder ownership after round"
  },
  "terms_review": [
    { "term": "Term name", "assessment": "standard|favorable|concerning", "explanation": "..." }
  ],
  "negotiation_points": ["What to negotiate", "How to negotiate it"],
  "overall_recommendation": "Accept|Negotiate|Decline",
  "next_steps": ["Step 1", "Step 2"]
}`;

  const response = await callGemini(prompt, "You are an expert at analyzing term sheets and advising founders on fundraising negotiations.");
  const result = parseJsonResponse<{
    valuation_assessment: Record<string, unknown>;
    dilution_analysis: Record<string, unknown>;
    terms_review: { term: string; assessment: string; explanation: string }[];
    negotiation_points: string[];
    overall_recommendation: string;
    next_steps: string[];
  }>(response);

  return { success: true, ...result };
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

  const prompt = `Generate a fundraising progress report:

STARTUP: ${startup?.name}
TARGET RAISE: $${raiseAmount}
STAGE: ${startup?.stage}

PIPELINE:
${Object.entries(byStatus).map(([status, count]) => `- ${status}: ${count}`).join("\n")}

TOTAL INVESTORS: ${investors.length}
CLOSED AMOUNT: $${closedAmount}

Generate report as JSON:
{
  "executive_summary": "2-3 sentence overview",
  "progress_metrics": {
    "target": ${raiseAmount},
    "raised": ${closedAmount},
    "percent_complete": ${percentComplete},
    "pipeline_value": "Weighted pipeline value"
  },
  "funnel_analysis": {
    "contact_to_meeting_rate": "X%",
    "meeting_to_dd_rate": "X%",
    "dd_to_close_rate": "X%"
  },
  "top_prospects": ["Investor 1 - why", "Investor 2 - why"],
  "risks": ["Risk 1", "Risk 2"],
  "this_week_priorities": ["Priority 1", "Priority 2"],
  "forecast": {
    "expected_close_date": "YYYY-MM-DD",
    "confidence": "high|medium|low"
  }
}`;

  const response = await callGemini(prompt, "You are an expert at generating executive fundraising reports.");
  const result = parseJsonResponse<{
    executive_summary: string;
    progress_metrics: Record<string, unknown>;
    funnel_analysis: Record<string, string>;
    top_prospects: string[];
    risks: string[];
    this_week_priorities: string[];
    forecast: Record<string, unknown>;
  }>(response);

  return { 
    success: true, 
    startup_name: startup?.name,
    generated_at: new Date().toISOString(),
    ...result 
  };
}

// ============ MAIN HANDLER ============

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabase = createSupabaseClient(authHeader);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
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
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[investor-agent] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
