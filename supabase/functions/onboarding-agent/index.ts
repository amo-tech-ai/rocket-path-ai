import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    // Fix: Ensure org_id is a valid UUID or null to prevent Postgres errors
    const org_id = (params.org_id && params.org_id.length === 36) ? params.org_id : null;

    await supabase.from("ai_runs").insert({
      user_id: params.user_id,
      org_id: org_id,
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

// Ensure profile exists (handles race condition after OAuth signup)
// The auth trigger creates profile, but there's latency. This function
// creates the profile if it doesn't exist yet.
async function ensureProfileExists(
  supabase: SupabaseClient,
  userId: string,
  userEmail?: string
): Promise<boolean> {
  console.log("Ensuring profile exists for user:", userId);

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existingProfile) {
    console.log("Profile already exists");
    return true;
  }

  // Profile doesn't exist - create it now (handles trigger latency)
  console.log("Profile missing, creating directly...");

  const { error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email: userEmail || "",
      onboarding_completed: false,
    })
    .single();

  if (insertError) {
    // PGRST116 = not found is OK (race condition with trigger)
    // 23505 = unique violation means trigger already created it
    if (insertError.code === "23505") {
      console.log("Profile was created by trigger (race condition resolved)");
      return true;
    }
    console.error("Failed to create profile:", insertError);
    return false;
  }

  console.log("Profile created successfully");

  // Also ensure user_roles entry exists
  await supabase
    .from("user_roles")
    .insert({ user_id: userId, role: "user" })
    .single();

  return true;
}

// Create a new wizard session
async function createSession(
  supabase: SupabaseClient,
  userId: string,
  userEmail?: string
) {
  console.log("Creating session for user:", userId);

  // CRITICAL: Ensure profile exists before creating session
  // wizard_sessions has FK to profiles, so this must succeed first
  const profileCreated = await ensureProfileExists(supabase, userId, userEmail);
  if (!profileCreated) {
    throw new Error("Could not ensure profile exists for user");
  }

  // Get user's org_id (profile now definitely exists)
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .maybeSingle();

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

  // Create new session - profile now definitely exists
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

// Reset session - archive old and create new
async function resetSession(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string
) {
  console.log("Resetting session:", sessionId);

  // Mark old session as abandoned
  await supabase
    .from("wizard_sessions")
    .update({
      status: "abandoned",
      abandoned_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  // Create new session
  const { data: newSession, error } = await supabase
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

  if (error) {
    console.error("Reset session error:", error);
    throw new Error("Could not reset session");
  }

  return { session_id: newSession.id, reset: true };
}

// Validate that a URL actually exists (HEAD request with timeout)
async function validateUrl(url: string): Promise<boolean> {
  if (!url || url === "" || url === "N/A" || url === "Unknown") return false;

  // Validate URL format first
  try {
    new URL(url);
  } catch {
    return false;
  }

  // Skip HEAD request for known-good domains (performance optimization)
  const knownDomains = [
    "stripe.com", "shopify.com", "square.com", "paypal.com", "brex.com",
    "plaid.com", "ramp.com", "mercury.com", "pipe.com", "deel.com",
    "notion.com", "airtable.com", "monday.com", "asana.com", "trello.com",
    "figma.com", "canva.com", "webflow.com", "framer.com", "bubble.io",
  ];

  try {
    const urlObj = new URL(url);
    if (knownDomains.some(d => urlObj.hostname.includes(d))) {
      return true; // Trust known domains
    }
  } catch {
    return false;
  }

  // For unknown domains, do a quick HEAD request
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StartupAI/1.0)" },
    });

    clearTimeout(timeoutId);
    return response.status < 500; // Accept 2xx, 3xx, 4xx (site exists)
  } catch {
    return false;
  }
}

// Filter competitors to only include valid URLs
async function filterValidCompetitors(
  competitors: Array<{ name: string; website: string; description: string; funding?: string; differentiator?: string }>
): Promise<Array<{ name: string; website: string; description: string; funding?: string; differentiator?: string; verified?: boolean }>> {
  const validated = await Promise.all(
    competitors.map(async (comp) => {
      // If no website, keep competitor but mark as unverified
      if (!comp.website || comp.website === "" || comp.website === "N/A") {
        return { ...comp, website: "", verified: false };
      }

      // Validate URL exists
      const isValid = await validateUrl(comp.website);
      return {
        ...comp,
        website: isValid ? comp.website : "",
        verified: isValid,
      };
    })
  );

  // Filter out competitors with no valid website AND no meaningful description
  return validated.filter(
    c => c.website || (c.description && c.description.length > 20)
  );
}

// Generate competitors using Google Search grounding
async function generateCompetitors(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
  orgId: string
) {
  console.log("Generating competitors for session:", sessionId);
  const startTime = Date.now();

  // Get session data
  const { data: session } = await supabase
    .from("wizard_sessions")
    .select("form_data, ai_extractions")
    .eq("id", sessionId)
    .single();

  const formData = (session?.form_data || {}) as Record<string, unknown>;
  const extractions = (session?.ai_extractions || {}) as Record<string, unknown>;
  const companyName = formData.company_name || extractions.company_name || "startup";
  const industry = formData.industry || extractions.industry || "technology";
  const description = formData.description || extractions.description || "";

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const prompt = `Find REAL direct competitors for this startup using Google Search.

Company: ${companyName}
Industry: ${industry}
Description: ${description}

CRITICAL REQUIREMENTS:
1. Only return REAL companies that exist TODAY - verify with search results
2. Every website URL MUST be a real, working domain starting with https://
3. Do NOT invent or hallucinate company names or URLs
4. If you cannot find real competitors with working websites, return an empty array
5. Prefer well-known funded companies that show up in search results

Return ONLY valid JSON:
{
  "competitors": [
    {
      "name": "string - REAL company name (verified from search)",
      "website": "string - REAL working website URL like https://company.com",
      "description": "string - what they do (1 sentence)",
      "funding": "string - known funding if available, or 'Unknown'",
      "differentiator": "string - how ${companyName} differs from them"
    }
  ],
  "market_trends": ["string array - 3-5 relevant market trends from search"],
  "search_queries_used": ["string array - queries used to find this data"]
}

Find 3-5 REAL competitors with REAL websites. If unsure about a company, exclude it.
An empty competitors array is better than fake data.`;

  // Try multiple models with fallback - use Gemini 3 models
  const models = ["gemini-3-flash-preview", "gemini-3-pro-preview"];
  let competitorData = null;
  let usedModel = "";

  for (const model of models) {
    try {
      console.log(`Trying competitor generation with model: ${model}`);
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 1.0, // Per Gemini 3 docs: must be 1.0
              maxOutputTokens: 2000,
              responseMimeType: "application/json",
            },
            tools: [{ google_search: {} }],
          }),
        }
      );

      if (!geminiResponse.ok) {
        console.warn(`Model ${model} returned status ${geminiResponse.status}`);
        continue;
      }

      const geminiData = await geminiResponse.json();
      const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        competitorData = JSON.parse(responseText);
        usedModel = model;
        break;
      }
    } catch (modelError) {
      console.warn(`Model ${model} failed:`, modelError);
      continue;
    }
  }

  // Fallback - return EMPTY array, not fake data
  if (!competitorData) {
    console.log("All models failed for competitor generation, returning empty");
    competitorData = {
      competitors: [], // EMPTY - no fake data
      market_trends: [
        "Unable to fetch market trends - please try again",
      ],
      search_queries_used: [],
      generation_failed: true, // Flag for UI to show retry option
    };
    usedModel = "fallback";
  }

  // Validate competitor URLs - remove fake/broken URLs
  if (competitorData && competitorData.competitors && competitorData.competitors.length > 0) {
    console.log(`Validating ${competitorData.competitors.length} competitor URLs...`);
    competitorData.competitors = await filterValidCompetitors(competitorData.competitors);
    console.log(`${competitorData.competitors.length} competitors after validation`);
  }

  const duration = Date.now() - startTime;

  // Log AI run
  if (orgId && usedModel !== "fallback") {
    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "generate_competitors",
      model: usedModel,
      duration_ms: duration,
      status: "success",
    });
  }

  // Merge with existing extractions
  const currentExtractions = session?.ai_extractions || {};
  const mergedExtractions = {
    ...currentExtractions,
    competitors: competitorData.competitors,
    market_trends: competitorData.market_trends,
    grounding_queries: competitorData.search_queries_used,
  };

  await supabase
    .from("wizard_sessions")
    .update({ ai_extractions: mergedExtractions })
    .eq("id", sessionId);

  return { success: true, ...competitorData };
}

// Enrich startup data from URL using Gemini with URL context AND Google Search grounding
async function enrichUrl(
  supabase: SupabaseClient,
  sessionId: string,
  url: string,
  userId: string,
  orgId: string
) {
  console.log("Enriching URL with grounding:", url);
  const startTime = Date.now();

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  // Use Gemini with URL context AND Google Search grounding for competitor discovery
  const prompt = `You are a startup intelligence analyst. Analyze this website URL and extract comprehensive startup information.

URL: ${url}

IMPORTANT INSTRUCTIONS:
1. Use Google Search to find competitor companies and market trends for this startup.
2. ALWAYS provide values for ALL fields - use inference when explicit information is not available.
3. For brand-led or marketing-focused websites, SYNTHESIZE information from:
   - Product descriptions and value propositions
   - Marketing language and positioning statements
   - Visual content themes and messaging
   - Industry context and typical use cases

EXTRACTION RULES:
- key_features: If not explicitly listed, INFER from product descriptions, workflows, and capabilities mentioned. Look for verbs (automate, generate, manage, track, collaborate) and nouns (dashboard, AI, templates, integrations).
- target_audience: DERIVE from context - who would benefit from these features? What roles, industries, company sizes? If "for fashion brands" is mentioned, audience = "Fashion brands, apparel companies, fashion event organizers"
- detected_phrases: Extract 3-5 distinctive marketing phrases in quotes that capture the brand voice
- If confidence is low on any field, mark it as inferred and still provide your best synthesis

Return ONLY valid JSON with these fields:
{
  "company_name": "string - the company/startup name",
  "description": "string - what the company does (2-3 comprehensive sentences)",
  "tagline": "string - short tagline or main headline",
  "industry": ["string array - relevant industries: SaaS, AI, Fintech, E-commerce, Fashion, Healthcare, etc."],
  "business_model": ["string array - B2B, B2C, B2B2C, Marketplace, Platform, Services"],
  "stage": "string - Idea, Pre-seed, Seed, Series A, Series B+ (infer from polish, team, pricing)",
  "target_market": "string - primary customer segment with specifics",
  "target_audience": ["string array - 2-4 specific audience segments like 'Fashion brand managers', 'E-commerce teams'"],
  "key_features": ["string array - 3-6 core capabilities, ALWAYS infer if not explicit"],
  "detected_phrases": ["string array - 3-5 distinctive marketing phrases in quotes"],
  "competitors": ["string array - likely competitors found via web search"],
  "market_trends": ["string array - relevant market trends from search"],
  "pricing_model": "string - freemium, subscription, one-time, enterprise, etc.",
  "unique_value_proposition": "string - what makes them unique",
  "confidence": "number 0-1",
  "inferred_fields": ["string array - list field names that were inferred rather than explicitly found"]
}

CRITICAL: Never return empty arrays for key_features, target_audience, or detected_phrases. Always synthesize from available context.`;

  // Try multiple models with fallback - use Gemini 3 models
  const models = ["gemini-3-flash-preview", "gemini-3-pro-preview"];
  let extractions = null;
  let usedModel = "";

  for (const model of models) {
    try {
      console.log(`Trying URL enrichment with model: ${model}`);
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 1.0, // Per Gemini 3 docs: must be 1.0
              maxOutputTokens: 2000,
              responseMimeType: "application/json",
            },
            // CRITICAL: Enable BOTH tools per official Gemini docs
            tools: [
              { url_context: {} },   // Fetches actual URL content
              { google_search: {} }, // Search grounding for competitors
            ],
          }),
        }
      );

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.warn(`Model ${model} returned status ${geminiResponse.status}: ${errorText}`);
        continue;
      }

      const geminiData = await geminiResponse.json();

      // Log URL context metadata for debugging
      const urlContextMeta = geminiData.candidates?.[0]?.urlContextMetadata;
      if (urlContextMeta?.urlMetadata) {
        console.log("URL Context retrieval status:");
        for (const meta of urlContextMeta.urlMetadata) {
          console.log(`  ${meta.retrievedUrl}: ${meta.urlRetrievalStatus}`);
        }
      }

      // Log grounding metadata if present
      const groundingMeta = geminiData.candidates?.[0]?.groundingMetadata;
      if (groundingMeta?.webSearchQueries) {
        console.log("Search queries used:", groundingMeta.webSearchQueries);
      }

      const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        extractions = JSON.parse(responseText);
        usedModel = model;
        break;
      }
    } catch (modelError) {
      console.warn(`Model ${model} failed:`, modelError);
      continue;
    }
  }

  // Fallback extractions if all models fail - provide synthesized defaults
  if (!extractions) {
    console.log("All models failed for URL enrichment, using fallback");
    extractions = {
      error: "Could not analyze URL with AI",
      confidence: 0,
      key_features: ["AI-powered automation"],
      target_audience: ["Business teams"],
      detected_phrases: [],
      competitors: [],
      target_market: "Business professionals",
      inferred_fields: ["key_features", "target_audience", "target_market"],
    };
    usedModel = "fallback";
  }

  const duration = Date.now() - startTime;

  // Log the AI run (handle missing org gracefully)
  if (orgId && usedModel !== "fallback") {
    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "enrich_url",
      model: usedModel,
      duration_ms: duration,
      status: "success",
    });
  }

  // Update session with extractions
  await supabase
    .from("wizard_sessions")
    .update({ ai_extractions: extractions })
    .eq("id", sessionId);

  console.log("URL enrichment complete:", extractions);
  return { success: true, extractions, source: "url" };
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 1.0, // Per Gemini 3 docs: must be 1.0
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
      model: "gemini-3-pro-preview",
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

  // Try primary model, fallback to alternative models - use Gemini 3 models
  const models = ["gemini-3-flash-preview", "gemini-3-pro-preview"];
  let readinessScore = null;
  let usedModel = "";

  for (const model of models) {
    try {
      console.log(`Trying readiness calculation with model: ${model}`);
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 1.0, // Per Gemini 3 docs: must be 1.0
              maxOutputTokens: 1000,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!geminiResponse.ok) {
        console.warn(`Model ${model} returned status ${geminiResponse.status}`);
        continue;
      }

      const geminiData = await geminiResponse.json();
      const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        readinessScore = JSON.parse(responseText);
        usedModel = model;
        break;
      }
    } catch (modelError) {
      console.warn(`Model ${model} failed:`, modelError);
      continue;
    }
  }

  // Fallback to default scores if all models fail
  if (!readinessScore) {
    console.log("All Gemini models failed, using fallback readiness score");
    readinessScore = {
      overall_score: 50,
      category_scores: { product: 50, market: 50, team: 50, clarity: 50 },
      benchmarks: ["Complete more profile fields to improve accuracy"],
      recommendations: [
        "Add more details about your product features",
        "Specify your target market more clearly",
        "Add founder LinkedIn profiles for team assessment"
      ],
    };
    usedModel = "fallback";
  }

  const duration = Date.now() - startTime;

  if (orgId && usedModel !== "fallback") {
    await logAiRun(supabase, {
      user_id: userId,
      org_id: orgId,
      agent_name: "ProfileExtractor",
      action: "calculate_readiness",
      model: usedModel,
      duration_ms: duration,
      status: "success",
    });
  }

  // Update profile strength
  await supabase
    .from("wizard_sessions")
    .update({ profile_strength: readinessScore.overall_score })
    .eq("id", sessionId);

  return { success: true, readiness_score: readinessScore };
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

  // 1. Get current session state - include all fields we need to merge
  const { data: session } = await supabase
    .from("wizard_sessions")
    .select("interview_answers, signals, form_data, extracted_traction, extracted_funding")
    .eq("id", sessionId)
    .single();

  const currentAnswers = (session?.interview_answers || []) as any[];
  const currentSignals = (session?.signals || []) as string[];
  const currentTraction = (session?.extracted_traction || {}) as Record<string, unknown>;
  const currentFunding = (session?.extracted_funding || {}) as Record<string, unknown>;

  // 2. Extract signals and data from answer
  const newSignals: string[] = [];
  let extractedTraction: Record<string, unknown> | null = null;
  let extractedFunding: Record<string, unknown> | null = null;

  // Process based on question type - map answers to structured data
  if (questionId === "q1_traction") {
    if (answerId === "a4") {
      newSignals.push("has_revenue");
      extractedTraction = { mrr_range: "10k_plus", mrr_display: "$10K+ MRR" };
    } else if (answerId === "a3") {
      newSignals.push("has_revenue");
      extractedTraction = { mrr_range: "1k_10k", mrr_display: "$1K - $10K MRR" };
    } else if (answerId === "a2") {
      extractedTraction = { mrr_range: "under_1k", mrr_display: "Under $1K MRR" };
    } else if (answerId === "a1") {
      extractedTraction = { mrr_range: "pre_revenue", mrr_display: "Pre-revenue" };
    }
  } else if (questionId === "q2_users") {
    // Map user count question
    if (answerText) {
      extractedTraction = { users: answerText, users_display: answerText };
    }
  } else if (questionId === "q3_fundraising") {
    if (answerId === "a3" || answerId === "a4") {
      newSignals.push("actively_raising");
      extractedFunding = { is_raising: true, raising_display: "Yes, actively raising" };
    } else if (answerId === "a2") {
      extractedFunding = { is_raising: false, raising_display: "Planning to raise soon" };
    } else if (answerId === "a1") {
      extractedFunding = { is_raising: false, raising_display: "Bootstrapping" };
    }
  } else if (questionId === "q4_team") {
    // Map team size
    if (answerText) {
      extractedTraction = { team_size: answerText, team_display: answerText };
    }
  } else if (questionId === "q5_pmf") {
    if (answerId === "a3" || answerId === "a4") {
      newSignals.push("has_pmf");
      extractedTraction = { pmf_status: "achieved", pmf_display: "Product-market fit achieved" };
    } else if (answerId === "a2") {
      extractedTraction = { pmf_status: "seeking", pmf_display: "Seeking PMF" };
    } else if (answerId === "a1") {
      extractedTraction = { pmf_status: "pre_pmf", pmf_display: "Pre-PMF" };
    }
  }

  // 3. Update interview answers list
  const updatedAnswers = [
    ...currentAnswers.filter((a: any) => a.question_id !== questionId),
    {
      question_id: questionId,
      answer_id: answerId,
      answer_text: answerText,
      answered_at: new Date().toISOString()
    }
  ];

  const allSignals = Array.from(new Set([...currentSignals, ...newSignals]));

  // 4. Update session with ALL interview data atomically
  const updatePayload: Record<string, unknown> = {
    interview_answers: updatedAnswers,
    interview_progress: updatedAnswers.length,
    signals: allSignals,
    // Also update form_data for backwards compatibility and UI access
    form_data: {
      ...(session?.form_data || {}),
      interview_answers: updatedAnswers,
      current_question_index: updatedAnswers.length,
      signals: allSignals,
    },
  };

  // Merge traction data if extracted (don't overwrite existing)
  if (extractedTraction) {
    const mergedTraction = { ...currentTraction, ...extractedTraction };
    updatePayload.extracted_traction = mergedTraction;
    // Also add to form_data for UI access
    (updatePayload.form_data as Record<string, unknown>).extracted_traction = mergedTraction;
  }

  // Merge funding data if extracted (don't overwrite existing)
  if (extractedFunding) {
    const mergedFunding = { ...currentFunding, ...extractedFunding };
    updatePayload.extracted_funding = mergedFunding;
    (updatePayload.form_data as Record<string, unknown>).extracted_funding = mergedFunding;
  }

  const { error: updateError } = await supabase
    .from("wizard_sessions")
    .update(updatePayload)
    .eq("id", sessionId);

  if (updateError) {
    console.error("Failed to update interview progress:", updateError);
    throw new Error("Failed to save answer");
  }

  console.log("Answer saved. Progress:", updatedAnswers.length, "Signals:", allSignals);

  // Return the extracted data so client can update local state
  return {
    success: true,
    signals: newSignals,
    extracted_traction: extractedTraction,
    extracted_funding: extractedFunding,
    interview_progress: updatedAnswers.length,
    all_signals: allSignals,
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
    console.error("Session not found:", sessionId, error);
    throw new Error("Session not found");
  }

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  
  // Calculate base score from available data
  const formData = (session.form_data || {}) as Record<string, unknown>;
  const extractions = (session.ai_extractions || {}) as Record<string, unknown>;
  const traction = (session.extracted_traction || {}) as Record<string, unknown>;
  const funding = (session.extracted_funding || {}) as Record<string, unknown>;

  // Rule-based scoring fallback
  let teamScore = 50;
  let tractionScore = 30;
  let marketScore = 50;
  let productScore = 50;
  let fundraisingScore = 40;

  // Boost scores based on traction data
  if (traction.mrr_range === "10k_plus") {
    tractionScore = 90;
  } else if (traction.mrr_range === "1k_10k") {
    tractionScore = 70;
  } else if (formData.revenue || extractions.has_revenue) {
    tractionScore = 50;
  }

  // Check for team
  if (formData.team_size || extractions.team) {
    const teamSize = formData.team_size || extractions.team;
    if (teamSize === "10+" || (typeof teamSize === 'number' && teamSize >= 10)) {
      teamScore = 80;
    } else if (teamSize === "4-10" || (typeof teamSize === 'number' && teamSize >= 4)) {
      teamScore = 70;
    } else if (teamSize === "2-3" || (typeof teamSize === 'number' && teamSize >= 2)) {
      teamScore = 60;
    }
  }

  // Check for product
  if (extractions.key_features && Array.isArray(extractions.key_features) && extractions.key_features.length > 0) {
    productScore = Math.min(40 + extractions.key_features.length * 10, 80);
  }

  // Check for market
  if (extractions.target_market || extractions.industry) {
    marketScore = 60;
    if (extractions.competitors && Array.isArray(extractions.competitors) && extractions.competitors.length > 0) {
      marketScore = 75;
    }
  }

  // Check for fundraising
  if (funding.is_raising) {
    fundraisingScore = 70;
  }

  const recommendations = [
    { action: "Add more team member details to boost investor confidence", points_gain: 15 },
    { action: "Document your key metrics and KPIs", points_gain: 10 },
    { action: "Complete your competitive analysis", points_gain: 12 },
  ];

  let investorScore = {
    total_score: Math.round((teamScore + tractionScore + marketScore + productScore + fundraisingScore) / 5),
    breakdown: {
      team: teamScore,
      traction: tractionScore,
      market: marketScore,
      product: productScore,
      fundraising: fundraisingScore,
    },
    recommendations,
  };

  // Try AI enhancement if API key available
  if (GEMINI_API_KEY) {
    const prompt = `Calculate an investor readiness score for this startup.

Startup Data:
${JSON.stringify(session, null, 2)}

Evaluate like an investor would. Return ONLY valid JSON:
{
  "total_score": 65,
  "breakdown": {
    "team": 60,
    "traction": 50,
    "market": 70,
    "product": 65,
    "fundraising": 55
  },
  "recommendations": [
    {"action": "specific action to take", "points_gain": 10}
  ]
}`;

    // Try multiple models with fallback - use Gemini 3 models only
    const models = ["gemini-3-flash-preview", "gemini-3-pro-preview"];

    for (const model of models) {
      try {
        console.log(`Trying score calculation with model: ${model}`);
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 1.0, // Per Gemini 3 docs: must be 1.0
                maxOutputTokens: 1000,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (!geminiResponse.ok) {
          console.warn(`Model ${model} returned status ${geminiResponse.status}`);
          continue;
        }

        const geminiData = await geminiResponse.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
          const aiScore = JSON.parse(responseText);
          investorScore = aiScore;

          const duration = Date.now() - startTime;
          if (orgId) {
            await logAiRun(supabase, {
              user_id: userId,
              org_id: orgId,
              agent_name: "ProfileExtractor",
              action: "calculate_score",
              model: model,
              duration_ms: duration,
              status: "success",
            });
          }
          break;
        }
      } catch (modelError) {
        console.warn(`Model ${model} failed:`, modelError);
        continue;
      }
    }
  }

  console.log("Calculated score:", investorScore.total_score);
  return { success: true, investor_score: investorScore };
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
    console.error("Session not found:", sessionId, error);
    throw new Error("Session not found");
  }

  const formData = (session.form_data || {}) as Record<string, unknown>;
  const extractions = (session.ai_extractions || {}) as Record<string, unknown>;
  
  // Build fallback summary from available data
  const companyName = formData.company_name || extractions.company_name || "Your startup";
  const description = formData.description || extractions.description || "";
  const industry = formData.industry || extractions.industry || "technology";
  const features = (extractions.key_features as string[]) || [];

  // Generate rule-based summary as fallback
  let summaryData = {
    summary: `${companyName} is a ${industry} company${description ? ` that ${description.toString().toLowerCase().replace(/^we\s+/i, '').slice(0, 100)}` : ''}. The team is building innovative solutions to address key market needs.`,
    strengths: [
      "Clear value proposition",
      features.length > 0 ? `${features.length} key product features identified` : "Defined product concept",
      "Focused market approach",
    ],
    improvements: [
      "Add more traction data to strengthen investor appeal",
      "Document key metrics and KPIs",
      "Develop a clear go-to-market strategy",
    ],
  };

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  
  if (GEMINI_API_KEY) {
    const prompt = `Generate a compelling investor-ready summary for this startup.

Startup Data:
${JSON.stringify(session, null, 2)}

Return ONLY valid JSON:
{
  "summary": "2-3 sentence compelling pitch summary",
  "strengths": ["3-5 key strengths as strings"],
  "improvements": ["3-5 areas to improve as strings"]
}`;

    // Try multiple models with fallback - use Gemini 3 models only
    const models = ["gemini-3-flash-preview", "gemini-3-pro-preview"];

    for (const model of models) {
      try {
        console.log(`Trying summary generation with model: ${model}`);
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 1.0, // Per Gemini 3 docs: must be 1.0
                maxOutputTokens: 1000,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (!geminiResponse.ok) {
          console.warn(`Model ${model} returned status ${geminiResponse.status}`);
          continue;
        }

        const geminiData = await geminiResponse.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
          const aiSummary = JSON.parse(responseText);
          summaryData = aiSummary;

          const duration = Date.now() - startTime;
          if (orgId) {
            await logAiRun(supabase, {
              user_id: userId,
              org_id: orgId,
              agent_name: "ProfileExtractor",
              action: "generate_summary",
              model: model,
              duration_ms: duration,
              status: "success",
            });
          }
          break;
        }
      } catch (modelError) {
        console.warn(`Model ${model} failed:`, modelError);
        continue;
      }
    }
  }

  console.log("Generated summary for:", companyName);
  return { success: true, summary: summaryData };
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

  // Get user profile to check for existing org_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("org_id, email")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
  }

  let userOrgId = profile?.org_id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = (session.form_data || {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractions = (session.ai_extractions || {}) as any;

  // CRITICAL FIX: Create organization if user doesn't have one
  if (!userOrgId) {
    console.log("User has no org_id, creating organization...");

    const companyName = formData.name || formData.company_name || extractions.company_name || "My Startup";

    // Create organization for the user
    const { data: newOrg, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: `${companyName}`,
        owner_id: userId,
        created_by: userId,
      })
      .select("id")
      .single();

    if (orgError) {
      console.error("Organization creation error:", orgError);
      throw new Error(`Could not create organization: ${orgError.message}`);
    }

    userOrgId = newOrg.id;
    console.log("Created organization:", userOrgId);

    // Update user profile with new org_id
    await supabase
      .from("profiles")
      .update({ org_id: userOrgId })
      .eq("id", userId);
  }

  // Merge data, preferring user input over AI extractions
  const industryValue = formData.industry || extractions.industry;
  const industryArray = Array.isArray(industryValue) ? industryValue : (industryValue ? [industryValue] : null);

  // Build startup data with guaranteed org_id
  const startupData: Record<string, unknown> = {
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
    org_id: userOrgId, // Now guaranteed to have a value
  };

  // Create startup
  const { data: startup, error: startupError } = await supabase
    .from("startups")
    .insert(startupData)
    .select()
    .single();

  if (startupError) {
    console.error("Startup creation error:", startupError);
    console.error("Startup data attempted:", JSON.stringify(startupData, null, 2));
    throw new Error(`Could not create startup: ${startupError.message}`);
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

  // CRITICAL: Mark user profile as onboarding complete
  // This gates access to dashboard vs redirect to onboarding
  await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,
      org_id: userOrgId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

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

  console.log("Wizard completed successfully!");
  console.log("- Startup ID:", startup.id);
  console.log("- Org ID:", userOrgId);
  console.log("- Tasks created:", tasks?.length || 0);

  return {
    success: true,
    startup_id: startup.id,
    org_id: userOrgId,
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

    // Get user's org_id - use maybeSingle to handle new users whose profile
    // may not exist yet (database trigger latency during signup)
    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .maybeSingle();

    // For new users, org_id might not exist yet - gracefully handle missing profile
    const orgId = profile?.org_id || "";

    const body: RequestBody = await req.json();
    const { action } = body;

    console.log("Onboarding agent action:", action, "User:", user.id);

    let result;

    switch (action) {
      case "create_session":
        result = await createSession(supabase, user.id, user.email);
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

      case "reset_session":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await resetSession(supabase, body.session_id, user.id);
        break;

      case "generate_competitors":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await generateCompetitors(supabase, body.session_id, user.id, orgId);
        break;

      // Alias for backwards compatibility
      case "run_analysis":
        if (!body.session_id) {
          throw new Error("session_id required");
        }
        result = await calculateReadiness(supabase, body.session_id, user.id, orgId);
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
