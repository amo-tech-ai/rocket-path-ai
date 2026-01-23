import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://yvyesmiczbjqwbqtlidy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4";

interface RequestBody {
  action: string;
  session_id?: string;
  user_id?: string;
  url?: string;
  description?: string;
  target_market?: string;
  linkedin_url?: string;
  name?: string;
  form_data?: Record<string, unknown>;
  current_step?: number;
  answered_question_ids?: string[];
  question_id?: string;
  answer_id?: string;
  answer_text?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

// Initialize Supabase client with user's auth
function getSupabaseClient(authHeader: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

// Log AI run for analytics
async function logAiRun(
  supabase: SupabaseClient,
  params: {
    user_id: string;
    org_id: string;
    agent_name: string;
    action: string;
    model: string;
    input_tokens?: number;
    output_tokens?: number;
    cost_usd?: number;
    duration_ms?: number;
    status?: string;
    error_message?: string;
    startup_id?: string;
  }
) {
  try {
    await supabase.from("ai_runs").insert({
      user_id: params.user_id,
      org_id: params.org_id,
      agent_name: params.agent_name,
      action: params.action,
      model: params.model,
      input_tokens: params.input_tokens,
      output_tokens: params.output_tokens,
      cost_usd: params.cost_usd,
      duration_ms: params.duration_ms,
      status: params.status || "success",
      error_message: params.error_message,
      startup_id: params.startup_id,
    });
  } catch (e) {
    console.error("Failed to log AI run:", e);
  }
}

// Create a new wizard session
async function createSession(
  supabase: SupabaseClient,
  userId: string
) {
  console.log("Creating session for user:", userId);
  
  // Get user's org_id (use maybeSingle to handle missing profile gracefully)
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .maybeSingle();

  // Continue even if profile doesn't exist yet (new signup race condition)
  const userOrgId = profile?.org_id || null;

  // Check for existing in-progress session
  const { data: existingSession } = await supabase
    .from("wizard_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSession) {
    console.log("Returning existing session:", existingSession.id);
    return { session_id: existingSession.id, resumed: true };
  }

  // Create new session
  const { data: session, error: sessionError } = await supabase
    .from("wizard_sessions")
    .insert({
      user_id: userId,
      status: "in_progress",
      current_step: 1,
      form_data: {},
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) {
    console.error("Session creation error:", sessionError);
    throw new Error("Could not create wizard session");
  }

  console.log("Created new session:", session.id);
  return { session_id: session.id, resumed: false };
}

// Update session with form data or step
async function updateSession(
  supabase: SupabaseClient,
  sessionId: string,
  updates: { form_data?: Record<string, unknown>; current_step?: number }
) {
  console.log("Updating session:", sessionId, updates);
  
  const updatePayload: Record<string, unknown> = {};
  
  if (updates.form_data !== undefined) {
    updatePayload.form_data = updates.form_data;
  }
  if (updates.current_step !== undefined) {
    updatePayload.current_step = updates.current_step;
  }

  const { error } = await supabase
    .from("wizard_sessions")
    .update(updatePayload)
    .eq("id", sessionId);

  if (error) {
    console.error("Session update error:", error);
    throw new Error("Could not update session");
  }

  return { success: true };
}

// Enrich startup data from URL using Gemini
async function enrichUrl(
  supabase: SupabaseClient,
  sessionId: string,
  url: string,
  userId: string,
  orgId: string
) {
  console.log("Enriching URL:", url);
  const startTime = Date.now();

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  // Use Gemini with URL context
  const prompt = `Analyze this website URL and extract structured startup information.
  
URL: ${url}

Extract the following information from the website content. Return ONLY valid JSON with these fields:
{
  "company_name": "string - the company/startup name",
  "description": "string - what the company does (2-3 sentences)",
  "tagline": "string - short tagline if found",
  "industry": ["string array - relevant industries like SaaS, Fintech, Healthcare, etc."],
  "business_model": ["string array - B2B, B2C, B2B2C, Marketplace, Platform, Services"],
  "stage": "string - Idea, Pre-seed, Seed, Series A, Series B+ (infer from team size, funding, etc.)",
  "target_market": "string - who are the customers (be specific about segment, geography)",
  "key_features": ["string array - main product features"],
  "competitors": ["string array - likely competitors"],
  "pricing_model": "string - freemium, subscription, one-time, etc.",
  "unique_value_proposition": "string - what makes them unique",
  "confidence": "number 0-1 - how confident you are in the extraction"
}

Only include fields you can confidently extract. If you cannot access the URL or extract information, return:
{"error": "Could not access or parse the website", "confidence": 0}`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2000,
            responseMimeType: "application/json",
          },
          tools: [
            {
              urlContext: {
                urls: [url],
              },
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const extractions = JSON.parse(responseText);
    const duration = Date.now() - startTime;

    // Log the AI run
    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "enrich_url",
      model: "gemini-2.0-flash",
      duration_ms: duration,
      status: "success",
    });

    // Update session with extractions
    await supabase
      .from("wizard_sessions")
      .update({ ai_extractions: extractions })
      .eq("id", sessionId);

    console.log("URL enrichment complete:", extractions);
    return { success: true, extractions, source: "url" };
  } catch (error) {
    console.error("URL enrichment error:", error);
    
    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "enrich_url",
      model: "gemini-2.0-flash",
      duration_ms: Date.now() - startTime,
      status: "error",
      error_message: String(error),
    });

    throw error;
  }
}

// Enrich from description context
async function enrichContext(
  supabase: SupabaseClient,
  sessionId: string,
  description: string,
  targetMarket: string | undefined,
  userId: string,
  orgId: string
) {
  console.log("Enriching context from description");
  const startTime = Date.now();

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const prompt = `Analyze this startup description and extract structured information.
  
Description: ${description}
${targetMarket ? `Target Market: ${targetMarket}` : ""}

Extract the following information. Return ONLY valid JSON:
{
  "industry": ["string array - relevant industries like SaaS, Fintech, Healthcare, EdTech, AI/ML, Marketplace, E-commerce, Consumer"],
  "business_model": ["string array - B2B, B2C, B2B2C, Marketplace, Platform, Services"],
  "stage": "string - Idea, Pre-seed, Seed, Series A, Series B+ (infer from language used)",
  "key_features": ["string array - main product/service features mentioned"],
  "target_audience": "string - who are the target customers",
  "signals": ["string array - any signals detected like 'b2b_saas', 'has_traction', 'pre_revenue', 'tech_enabled'"],
  "confidence": "number 0-1"
}`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const extractions = JSON.parse(responseText);
    const duration = Date.now() - startTime;

    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "enrich_context",
      model: "gemini-2.0-flash",
      duration_ms: duration,
      status: "success",
    });

    // Merge with existing extractions
    const { data: session } = await supabase
      .from("wizard_sessions")
      .select("ai_extractions")
      .eq("id", sessionId)
      .single();

    const mergedExtractions = {
      ...(session?.ai_extractions || {}),
      ...extractions,
    };

    await supabase
      .from("wizard_sessions")
      .update({ ai_extractions: mergedExtractions })
      .eq("id", sessionId);

    return { success: true, extractions, source: "context" };
  } catch (error) {
    console.error("Context enrichment error:", error);
    throw error;
  }
}

// Calculate readiness score (Step 2)
async function calculateReadiness(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
  orgId: string
) {
  console.log("Calculating readiness for session:", sessionId);
  const startTime = Date.now();

  // Get session data
  const { data: session, error } = await supabase
    .from("wizard_sessions")
    .select("form_data, ai_extractions")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    throw new Error("Session not found");
  }

  const formData = session.form_data || {};
  const extractions = session.ai_extractions || {};

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const prompt = `Analyze this startup profile and calculate a readiness score.

Startup Data:
${JSON.stringify({ ...formData, ...extractions }, null, 2)}

Calculate scores (0-100) for each category and provide benchmarks. Return ONLY valid JSON:
{
  "overall_score": "number 0-100",
  "category_scores": {
    "product": "number 0-100 - clarity of product/service",
    "market": "number 0-100 - market understanding and target definition",
    "team": "number 0-100 - team completeness and strength",
    "clarity": "number 0-100 - overall pitch clarity and completeness"
  },
  "benchmarks": ["string array - how this compares to similar startups at this stage"],
  "recommendations": ["string array - top 3 things to improve"]
}`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const readinessScore = JSON.parse(responseText);
    const duration = Date.now() - startTime;

    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "calculate_readiness",
      model: "gemini-2.0-flash",
      duration_ms: duration,
      status: "success",
    });

    // Update profile strength
    await supabase
      .from("wizard_sessions")
      .update({ profile_strength: readinessScore.overall_score })
      .eq("id", sessionId);

    return { success: true, readiness_score: readinessScore };
  } catch (error) {
    console.error("Readiness calculation error:", error);
    throw error;
  }
}

// Get interview questions (Step 3)
async function getQuestions(
  supabase: SupabaseClient,
  sessionId: string,
  answeredQuestionIds: string[]
) {
  console.log("Getting questions for session:", sessionId);

  // Get session data to personalize questions
  const { data: session } = await supabase
    .from("wizard_sessions")
    .select("form_data, ai_extractions")
    .eq("id", sessionId)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = (session?.form_data || {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractions = (session?.ai_extractions || {}) as any;
  const stage = formData.stage || extractions.stage || "Seed";
  const industry = formData.industry || extractions.industry || [];

  // Define question bank based on stage and industry
  // Shape matches Step3Interview's Question interface: id, text, type, options, topic, why_matters
  const allQuestions = [
    {
      id: "q1_traction",
      text: "What's your current monthly revenue or traction?",
      type: "multiple_choice" as const,
      topic: "traction",
      why_matters: "Traction is one of the strongest predictors of investor interest.",
      options: [
        { id: "a1", text: "Pre-revenue" },
        { id: "a2", text: "Under $1K MRR" },
        { id: "a3", text: "$1K - $10K MRR" },
        { id: "a4", text: "$10K+ MRR" },
      ],
    },
    {
      id: "q2_users",
      text: "How many active users do you have?",
      type: "multiple_choice" as const,
      topic: "traction",
      why_matters: "User growth signals product-market fit and validates demand.",
      options: [
        { id: "a1", text: "None yet" },
        { id: "a2", text: "1-100" },
        { id: "a3", text: "100-1000" },
        { id: "a4", text: "1000+" },
      ],
    },
    {
      id: "q3_fundraising",
      text: "Are you currently fundraising?",
      type: "multiple_choice" as const,
      topic: "funding",
      why_matters: "Understanding your fundraising status helps tailor investor strategy.",
      options: [
        { id: "a1", text: "Not yet" },
        { id: "a2", text: "Planning to start" },
        { id: "a3", text: "Actively raising" },
        { id: "a4", text: "Just closed a round" },
      ],
    },
    {
      id: "q4_team",
      text: "What's your team size?",
      type: "multiple_choice" as const,
      topic: "team",
      why_matters: "Team composition is a key factor in early-stage investment decisions.",
      options: [
        { id: "a1", text: "Solo founder" },
        { id: "a2", text: "2-3 co-founders" },
        { id: "a3", text: "4-10 people" },
        { id: "a4", text: "10+ people" },
      ],
    },
    {
      id: "q5_pmf",
      text: "How would you describe your product-market fit?",
      type: "multiple_choice" as const,
      topic: "market",
      why_matters: "PMF signals determine whether investors see scalable potential.",
      options: [
        { id: "a1", text: "Still searching" },
        { id: "a2", text: "Early signals" },
        { id: "a3", text: "Strong indicators" },
        { id: "a4", text: "Achieved PMF" },
      ],
    },
  ];

  // Filter out already answered questions
  const remainingQuestions = allQuestions.filter(
    (q) => !answeredQuestionIds.includes(q.id)
  );

  // Select advisor persona based on stage - matches AdvisorPersona interface
  const advisor = {
    name: stage === "Idea" ? "Sarah Chen" : "Michael Torres",
    title: stage === "Idea" ? "Early-Stage Advisor" : "Growth Expert",
    intro: stage === "Idea"
      ? "Let's tighten the core story so your pitch is instantly clear."
      : "Let's pressure-test traction and positioning like an investor would.",
  };

  return {
    success: true,
    questions: remainingQuestions.slice(0, 5),
    total_questions: allQuestions.length,
    answered: answeredQuestionIds.length,
    advisor,
  };
}

// Process answer (Step 3)
async function processAnswer(
  supabase: SupabaseClient,
  sessionId: string,
  questionId: string,
  answerId: string,
  answerText: string | undefined
) {
  console.log("Processing answer:", { sessionId, questionId, answerId });

  // Extract signals and data from answer
  const signals: string[] = [];
  let extractedTraction: Record<string, unknown> | null = null;
  let extractedFunding: Record<string, unknown> | null = null;

  // Process based on question type
  if (questionId === "q1_traction") {
    if (answerId === "a4") {
      signals.push("has_revenue");
      extractedTraction = { mrr_range: "10k_plus" };
    } else if (answerId === "a3") {
      signals.push("has_revenue");
      extractedTraction = { mrr_range: "1k_10k" };
    }
  } else if (questionId === "q3_fundraising") {
    if (answerId === "a3") {
      signals.push("actively_raising");
      extractedFunding = { is_raising: true };
    }
  } else if (questionId === "q5_pmf") {
    if (answerId === "a3" || answerId === "a4") {
      signals.push("has_pmf");
    }
  }

  // Update session with extracted data
  if (extractedTraction) {
    await supabase
      .from("wizard_sessions")
      .update({ extracted_traction: extractedTraction })
      .eq("id", sessionId);
  }

  if (extractedFunding) {
    await supabase
      .from("wizard_sessions")
      .update({ extracted_funding: extractedFunding })
      .eq("id", sessionId);
  }

  return {
    success: true,
    signals,
    extracted_traction: extractedTraction,
    extracted_funding: extractedFunding,
  };
}

// Calculate investor score (Step 4)
async function calculateScore(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
  orgId: string
) {
  console.log("Calculating investor score for session:", sessionId);
  const startTime = Date.now();

  const { data: session, error } = await supabase
    .from("wizard_sessions")
    .select("form_data, ai_extractions, extracted_traction, extracted_funding")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    throw new Error("Session not found");
  }

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const prompt = `Calculate an investor readiness score for this startup.

Startup Data:
${JSON.stringify(session, null, 2)}

Evaluate like an investor would. Return ONLY valid JSON:
{
  "total_score": "number 0-100",
  "breakdown": {
    "team": "number 0-100",
    "traction": "number 0-100",
    "market": "number 0-100",
    "product": "number 0-100",
    "fundraising": "number 0-100"
  },
  "recommendations": [
    {"action": "string - specific action to take", "points_gain": "number - potential score increase"}
  ]
}`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const investorScore = JSON.parse(responseText);
    const duration = Date.now() - startTime;

    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "calculate_score",
      model: "gemini-2.0-flash",
      duration_ms: duration,
      status: "success",
    });

    return { success: true, investor_score: investorScore };
  } catch (error) {
    console.error("Score calculation error:", error);
    throw error;
  }
}

// Generate AI summary (Step 4)
async function generateSummary(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
  orgId: string
) {
  console.log("Generating summary for session:", sessionId);
  const startTime = Date.now();

  const { data: session, error } = await supabase
    .from("wizard_sessions")
    .select("form_data, ai_extractions")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    throw new Error("Session not found");
  }

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const prompt = `Generate a compelling investor-ready summary for this startup.

Startup Data:
${JSON.stringify(session, null, 2)}

Return ONLY valid JSON:
{
  "summary": "string - 2-3 sentence compelling pitch summary",
  "strengths": ["string array - 3-5 key strengths"],
  "improvements": ["string array - 3-5 areas to improve"]
}`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const summary = JSON.parse(responseText);
    const duration = Date.now() - startTime;

    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "generate_summary",
      model: "gemini-2.0-flash",
      duration_ms: duration,
      status: "success",
    });

    return { success: true, summary };
  } catch (error) {
    console.error("Summary generation error:", error);
    throw error;
  }
}

// Complete wizard and create startup
async function completeWizard(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string
) {
  console.log("Completing wizard for session:", sessionId);

  // Get session data
  const { data: session, error: sessionError } = await supabase
    .from("wizard_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Session not found");
  }

  // Get user's org_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  if (!profile?.org_id) {
    throw new Error("User org not found");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = (session.form_data || {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractions = (session.ai_extractions || {}) as any;

  // Merge data, preferring user input over AI extractions
  const industryValue = formData.industry || extractions.industry;
  const industryArray = Array.isArray(industryValue) ? industryValue : (industryValue ? [industryValue] : null);

  const startupData = {
    org_id: profile.org_id,
    name: formData.name || formData.company_name || extractions.company_name || "My Startup",
    description: formData.description || extractions.description,
    tagline: formData.tagline || extractions.tagline,
    industry: industryArray?.[0] || null, // Primary industry
    stage: formData.stage || extractions.stage,
    business_model: formData.business_model || extractions.business_model,
    website_url: formData.website_url,
    linkedin_url: formData.linkedin_url,
    target_market: formData.target_market || extractions.target_market,
    target_customers: formData.target_customers || extractions.target_audience ? [formData.target_market || extractions.target_audience] : null,
    key_features: formData.key_features || extractions.key_features,
    competitors: extractions.competitors,
    founders: formData.founders,
    traction_data: session.extracted_traction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    is_raising: (session.extracted_funding as any)?.is_raising || false,
    profile_strength: session.profile_strength,
  };

  // Create startup
  const { data: startup, error: startupError } = await supabase
    .from("startups")
    .insert(startupData)
    .select()
    .single();

  if (startupError) {
    console.error("Startup creation error:", startupError);
    throw new Error("Could not create startup");
  }

  // Update session as completed
  await supabase
    .from("wizard_sessions")
    .update({
      status: "completed",
      startup_id: startup.id,
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  // Generate initial tasks
  const tasksToCreate = [
    {
      startup_id: startup.id,
      title: "Complete your pitch deck",
      description: "Create a compelling pitch deck to share with investors",
      priority: "high",
      status: "todo",
      category: "fundraising",
      ai_generated: true,
      ai_source: "onboarding",
    },
    {
      startup_id: startup.id,
      title: "Define your ICP (Ideal Customer Profile)",
      description: "Document your ideal customer profile with specific characteristics",
      priority: "high",
      status: "todo",
      category: "strategy",
      ai_generated: true,
      ai_source: "onboarding",
    },
    {
      startup_id: startup.id,
      title: "Set up analytics tracking",
      description: "Implement analytics to track key metrics and user behavior",
      priority: "medium",
      status: "todo",
      category: "product",
      ai_generated: true,
      ai_source: "onboarding",
    },
  ];

  const { data: tasks } = await supabase
    .from("tasks")
    .insert(tasksToCreate)
    .select();

  console.log("Wizard completed. Startup:", startup.id, "Tasks:", tasks?.length);

  return {
    success: true,
    startup_id: startup.id,
    tasks_created: tasks?.length || 0,
  };
}

// Enrich founder from LinkedIn
async function enrichFounder(
  supabase: SupabaseClient,
  sessionId: string,
  linkedinUrl: string,
  name: string | undefined
) {
  console.log("Enriching founder:", linkedinUrl);
  
  // For now, return success - LinkedIn enrichment would require additional API
  return {
    success: true,
    founder: {
      linkedin_url: linkedinUrl,
      name: name || "Founder",
      enriched: true,
    },
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabase = getSupabaseClient(authHeader);

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    const orgId = profile?.org_id || "";

    const body: RequestBody = await req.json();
    const { action } = body;

    console.log("Onboarding agent action:", action, "User:", user.id);

    let result;

    switch (action) {
      case "create_session":
        result = await createSession(supabase, user.id);
        break;

      case "update_session":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await updateSession(supabase, body.session_id, {
          form_data: body.form_data as Record<string, unknown>,
          current_step: body.current_step,
        });
        break;

      case "enrich_url":
        if (!body.session_id || !body.url) {
          throw new Error("session_id and url required");
        }
        result = await enrichUrl(supabase, body.session_id, body.url, user.id, orgId);
        break;

      case "enrich_context":
        if (!body.session_id || !body.description) {
          throw new Error("session_id and description required");
        }
        result = await enrichContext(
          supabase,
          body.session_id,
          body.description,
          body.target_market,
          user.id,
          orgId
        );
        break;

      case "enrich_founder":
        if (!body.session_id || !body.linkedin_url) {
          throw new Error("session_id and linkedin_url required");
        }
        result = await enrichFounder(supabase, body.session_id, body.linkedin_url, body.name);
        break;

      case "calculate_readiness":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await calculateReadiness(supabase, body.session_id, user.id, orgId);
        break;

      case "get_questions":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await getQuestions(supabase, body.session_id, body.answered_question_ids || []);
        break;

      case "process_answer":
        if (!body.session_id || !body.question_id || !body.answer_id) {
          throw new Error("session_id, question_id, and answer_id required");
        }
        result = await processAnswer(
          supabase,
          body.session_id,
          body.question_id,
          body.answer_id,
          body.answer_text
        );
        break;

      case "calculate_score":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await calculateScore(supabase, body.session_id, user.id, orgId);
        break;

      case "generate_summary":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await generateSummary(supabase, body.session_id, user.id, orgId);
        break;

      case "complete_wizard":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await completeWizard(supabase, body.session_id, user.id);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Onboarding agent error:", error);
    return new Response(
      JSON.stringify({ error: String(error), success: false }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
