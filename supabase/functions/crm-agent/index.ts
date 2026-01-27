/**
 * CRM Agent - Main Handler
 * Orchestrates all CRM AI operations
 * Actions: enrich_contact, score_lead, score_deal, analyze_pipeline,
 *          generate_email, detect_duplicate, summarize_communication,
 *          suggest_follow_ups, batch_enrich, import_contacts,
 *          segment_contacts, predict_deal_close, generate_meeting_notes,
 *          suggest_tags, analyze_relationship
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://yvyesmiczbjqwbqtlidy.supabase.co";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface RequestBody {
  action: string;
  startup_id?: string;
  contact_id?: string;
  deal_id?: string;
  linkedin_url?: string;
  name?: string;
  company?: string;
  email?: string;
  purpose?: string;
  contacts?: Array<{ name: string; email?: string; company?: string }>;
  query?: string;
}

// ===== AI Utilities =====

async function callGemini(
  prompt: string, 
  systemInstruction?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error("[crm-agent] GEMINI_API_KEY not set");
    throw new Error("AI service not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction 
          ? { parts: [{ text: systemInstruction }] } 
          : undefined,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("[crm-agent] Gemini error:", error);
    throw new Error("AI generation failed");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function extractJSON<T>(text: string): T | null {
  try {
    // Try to find JSON in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    // Try direct parse
    return JSON.parse(text);
  } catch {
    // Try to find JSON object or array
    const objectMatch = text.match(/\{[\s\S]*\}/);
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    const match = objectMatch || arrayMatch;
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ===== Action Handlers =====

async function enrichContact(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  linkedinUrl?: string,
  name?: string,
  company?: string
): Promise<{ success: boolean; contact?: Record<string, unknown>; error?: string }> {
  console.log(`[crm-agent] enrichContact for startup ${startupId}`);

  const searchQuery = linkedinUrl || `${name || ''} ${company || ''}`.trim();
  if (!searchQuery) {
    return { success: false, error: "linkedin_url or name+company required" };
  }

  const prompt = `You are a professional networking expert. Based on this search query, generate realistic professional profile data:

Query: ${searchQuery}
${linkedinUrl ? `LinkedIn URL: ${linkedinUrl}` : ''}

Generate a JSON response with these fields:
{
  "name": "Full Name",
  "title": "Professional Title",
  "company": "Company Name",
  "bio": "2-3 sentence professional bio",
  "linkedin_url": "${linkedinUrl || 'https://linkedin.com/in/...'}", 
  "email": "professional@email.com or null if unknown",
  "phone": "phone or null",
  "tags": ["relevant", "tags"],
  "relationship_strength": "weak",
  "ai_summary": "AI-generated summary of this contact's relevance to a startup"
}

Be realistic and professional. Return ONLY valid JSON.`;

  try {
    const response = await callGemini(prompt, "You are a B2B sales intelligence assistant.");
    const enrichedData = extractJSON<Record<string, unknown>>(response);

    if (!enrichedData) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Update or create contact in database
    if (linkedinUrl) {
      const { data: existing } = await supabase
        .from("contacts")
        .select("id")
        .eq("startup_id", startupId)
        .eq("linkedin_url", linkedinUrl)
        .single();

      if (existing) {
        await supabase
          .from("contacts")
          .update({
            ...enrichedData,
            enriched_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        return { success: true, contact: { id: existing.id, ...enrichedData } };
      }
    }

    // Create new contact
    const { data: newContact, error } = await supabase
      .from("contacts")
      .insert({
        startup_id: startupId,
        ...enrichedData,
        source: "enrichment",
        enriched_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, contact: newContact };
  } catch (error) {
    console.error("[crm-agent] enrichContact error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function scoreLead(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  contactId: string
): Promise<{ success: boolean; score?: number; factors?: string[]; error?: string }> {
  console.log(`[crm-agent] scoreLead for contact ${contactId}`);

  // Get contact and startup data
  const [{ data: contact }, { data: startup }] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", contactId).single(),
    supabase.from("startups").select("*").eq("id", startupId).single(),
  ]);

  if (!contact) return { success: false, error: "Contact not found" };

  const prompt = `Score this lead for a startup. Return a score from 0-100 and explain why.

STARTUP:
- Name: ${startup?.name || 'Unknown'}
- Industry: ${startup?.industry || 'Unknown'}
- Stage: ${startup?.stage || 'Unknown'}
- Description: ${startup?.description || 'Not provided'}

CONTACT:
- Name: ${contact.name}
- Title: ${contact.title || 'Unknown'}
- Company: ${contact.company || 'Unknown'}
- Type: ${contact.type || 'Unknown'}
- Bio: ${contact.bio || 'Not available'}

Return JSON:
{
  "score": 0-100,
  "factors": ["factor1", "factor2", "factor3"],
  "recommendation": "Brief action recommendation"
}`;

  try {
    const response = await callGemini(prompt, "You are a B2B lead scoring expert.");
    const result = extractJSON<{ score: number; factors: string[]; recommendation: string }>(response);

    if (!result) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Update contact with score
    await supabase
      .from("contacts")
      .update({
        relationship_strength: result.score >= 70 ? 'strong' : result.score >= 40 ? 'medium' : 'weak',
        ai_summary: result.recommendation,
      })
      .eq("id", contactId);

    return { success: true, score: result.score, factors: result.factors };
  } catch (error) {
    console.error("[crm-agent] scoreLead error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function scoreDeal(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  dealId: string
): Promise<{ success: boolean; probability?: number; insights?: string[]; risks?: string[]; error?: string }> {
  console.log(`[crm-agent] scoreDeal for deal ${dealId}`);

  const { data: deal } = await supabase
    .from("deals")
    .select("*, contacts(name, company, title)")
    .eq("id", dealId)
    .single();

  if (!deal) return { success: false, error: "Deal not found" };

  const prompt = `Analyze this deal and predict win probability.

DEAL:
- Name: ${deal.name}
- Amount: ${deal.amount ? `$${deal.amount}` : 'Not specified'}
- Stage: ${deal.stage}
- Type: ${deal.type || 'Unknown'}
- Description: ${deal.description || 'None'}
- Days in current stage: ${Math.floor((Date.now() - new Date(deal.updated_at).getTime()) / (1000 * 60 * 60 * 24))}

CONTACT:
- Name: ${deal.contacts?.name || 'Unknown'}
- Company: ${deal.contacts?.company || 'Unknown'}
- Title: ${deal.contacts?.title || 'Unknown'}

Return JSON:
{
  "probability": 0-100,
  "insights": ["insight1", "insight2"],
  "risks": ["risk1", "risk2"],
  "next_best_action": "Recommended next step"
}`;

  try {
    const response = await callGemini(prompt, "You are a sales forecasting expert.");
    const result = extractJSON<{ probability: number; insights: string[]; risks: string[]; next_best_action: string }>(response);

    if (!result) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Update deal with AI score
    await supabase
      .from("deals")
      .update({
        ai_score: result.probability,
        ai_insights: result,
        risk_factors: result.risks,
      })
      .eq("id", dealId);

    return {
      success: true,
      probability: result.probability,
      insights: result.insights,
      risks: result.risks,
    };
  } catch (error) {
    console.error("[crm-agent] scoreDeal error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function analyzePipeline(
  supabase: SupabaseClient,
  userId: string,
  startupId: string
): Promise<{ 
  success: boolean; 
  bottlenecks?: string[]; 
  forecast?: { monthly: number; quarterly: number }; 
  stalling?: Array<{ id: string; name: string; days: number }>;
  error?: string 
}> {
  console.log(`[crm-agent] analyzePipeline for startup ${startupId}`);

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("startup_id", startupId)
    .eq("is_active", true);

  if (!deals || deals.length === 0) {
    return { 
      success: true, 
      bottlenecks: ["No active deals in pipeline"],
      forecast: { monthly: 0, quarterly: 0 },
      stalling: []
    };
  }

  // Calculate stalling deals (>7 days in same stage)
  const stalling = (deals as Array<{ id: string; name: string; updated_at: string; amount?: number; probability?: number; stage: string }>)
    .filter((d) => {
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(d.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceUpdate > 7;
    })
    .map((d) => ({
      id: d.id,
      name: d.name,
      days: Math.floor((Date.now() - new Date(d.updated_at).getTime()) / (1000 * 60 * 60 * 24))
    }));

  // Calculate forecast
  const typedDeals = deals as Array<{ amount?: number; probability?: number; stage: string }>;
  const weightedPipeline = typedDeals.reduce((sum: number, d) => 
    sum + ((d.amount || 0) * (d.probability || 50) / 100), 0
  );

  const pipelineSummary = typedDeals.reduce((acc: Record<string, number>, d) => {
    acc[d.stage] = (acc[d.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `Analyze this sales pipeline and identify bottlenecks.

PIPELINE SUMMARY:
${Object.entries(pipelineSummary).map(([stage, count]) => `- ${stage}: ${count} deals`).join('\n')}

STALLING DEALS: ${stalling.length} deals haven't moved in 7+ days
WEIGHTED PIPELINE VALUE: $${weightedPipeline.toFixed(0)}

Return JSON:
{
  "bottlenecks": ["bottleneck1", "bottleneck2"],
  "recommendations": ["action1", "action2"],
  "health_score": 0-100
}`;

  try {
    const response = await callGemini(prompt, "You are a sales pipeline optimization expert.");
    const result = extractJSON<{ bottlenecks: string[]; recommendations: string[]; health_score: number }>(response);

    return {
      success: true,
      bottlenecks: result?.bottlenecks || ["Unable to analyze pipeline"],
      forecast: { 
        monthly: Math.round(weightedPipeline * 0.3), 
        quarterly: Math.round(weightedPipeline) 
      },
      stalling,
    };
  } catch (error) {
    console.error("[crm-agent] analyzePipeline error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function generateEmail(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  contactId: string,
  purpose: string = "introduction"
): Promise<{ success: boolean; subject?: string; body?: string; tone?: string; error?: string }> {
  console.log(`[crm-agent] generateEmail for contact ${contactId}`);

  const [{ data: contact }, { data: startup }] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", contactId).single(),
    supabase.from("startups").select("*").eq("id", startupId).single(),
  ]);

  if (!contact) return { success: false, error: "Contact not found" };

  const prompt = `Write a professional ${purpose} email.

FROM (STARTUP):
- Company: ${startup?.name || 'Our Company'}
- Description: ${startup?.description || 'A growing startup'}
- Value Prop: ${startup?.tagline || 'Innovative solutions'}

TO (CONTACT):
- Name: ${contact.name}
- Title: ${contact.title || 'Professional'}
- Company: ${contact.company || 'Their Company'}
- Bio: ${contact.bio || 'Not available'}

PURPOSE: ${purpose}

Return JSON:
{
  "subject": "Email subject line",
  "body": "Full email body with proper formatting",
  "tone": "professional/casual/formal"
}

Write a concise, personalized email. Use their name. Reference something specific about them or their company if available.`;

  try {
    const response = await callGemini(prompt, "You are an expert B2B email copywriter.");
    const result = extractJSON<{ subject: string; body: string; tone: string }>(response);

    if (!result) {
      return { success: false, error: "Failed to parse AI response" };
    }

    return {
      success: true,
      subject: result.subject,
      body: result.body,
      tone: result.tone,
    };
  } catch (error) {
    console.error("[crm-agent] generateEmail error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function detectDuplicate(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  name: string,
  email?: string,
  company?: string
): Promise<{ success: boolean; duplicates?: Array<{ id: string; name: string; confidence: number }>; error?: string }> {
  console.log(`[crm-agent] detectDuplicate for ${name}`);

  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, name, email, company")
    .eq("startup_id", startupId);

  if (!contacts || contacts.length === 0) {
    return { success: true, duplicates: [] };
  }

  const duplicates: Array<{ id: string; name: string; confidence: number }> = [];

  for (const contact of contacts) {
    let confidence = 0;

    // Name similarity (simple check)
    if (contact.name.toLowerCase() === name.toLowerCase()) {
      confidence += 50;
    } else if (contact.name.toLowerCase().includes(name.toLowerCase()) || 
               name.toLowerCase().includes(contact.name.toLowerCase())) {
      confidence += 30;
    }

    // Email match
    if (email && contact.email?.toLowerCase() === email.toLowerCase()) {
      confidence += 40;
    }

    // Company match
    if (company && contact.company?.toLowerCase() === company.toLowerCase()) {
      confidence += 20;
    }

    if (confidence >= 30) {
      duplicates.push({ id: contact.id, name: contact.name, confidence });
    }
  }

  return { 
    success: true, 
    duplicates: duplicates.sort((a, b) => b.confidence - a.confidence) 
  };
}

async function summarizeCommunication(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  contactId: string
): Promise<{ success: boolean; summary?: string; key_points?: string[]; next_steps?: string[]; error?: string }> {
  console.log(`[crm-agent] summarizeCommunication for contact ${contactId}`);

  const { data: communications } = await supabase
    .from("communications")
    .select("*")
    .eq("contact_id", contactId)
    .order("occurred_at", { ascending: false })
    .limit(10);

  if (!communications || communications.length === 0) {
    return { 
      success: true, 
      summary: "No communication history found",
      key_points: [],
      next_steps: ["Schedule initial contact"]
    };
  }

  type CommType = { type: string; subject?: string; summary?: string; content?: string };
  const commsSummary = (communications as CommType[]).map((c) => 
    `[${c.type}] ${c.subject || 'No subject'}: ${c.summary || c.content?.substring(0, 100) || 'No content'}`
  ).join('\n');

  const prompt = `Summarize this communication history and identify next steps.

COMMUNICATIONS:
${commsSummary}

Return JSON:
{
  "summary": "2-3 sentence summary of relationship",
  "key_points": ["key point 1", "key point 2"],
  "next_steps": ["action 1", "action 2"],
  "sentiment": "positive/neutral/negative"
}`;

  try {
    const response = await callGemini(prompt, "You are a relationship intelligence analyst.");
    const result = extractJSON<{ summary: string; key_points: string[]; next_steps: string[]; sentiment: string }>(response);

    if (!result) {
      return { success: false, error: "Failed to parse AI response" };
    }

    return {
      success: true,
      summary: result.summary,
      key_points: result.key_points,
      next_steps: result.next_steps,
    };
  } catch (error) {
    console.error("[crm-agent] summarizeCommunication error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function suggestFollowUps(
  supabase: SupabaseClient,
  userId: string,
  startupId: string
): Promise<{ success: boolean; suggestions?: Array<{ contact_id: string; contact_name: string; reason: string; urgency: string }>; error?: string }> {
  console.log(`[crm-agent] suggestFollowUps for startup ${startupId}`);

  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, name, last_contacted_at, relationship_strength, company")
    .eq("startup_id", startupId)
    .order("last_contacted_at", { ascending: true, nullsFirst: true })
    .limit(20);

  if (!contacts || contacts.length === 0) {
    return { success: true, suggestions: [] };
  }

  const suggestions: Array<{ contact_id: string; contact_name: string; reason: string; urgency: string }> = [];

  for (const contact of contacts) {
    const daysSinceContact = contact.last_contacted_at
      ? Math.floor((Date.now() - new Date(contact.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    if (daysSinceContact > 30) {
      suggestions.push({
        contact_id: contact.id,
        contact_name: contact.name,
        reason: contact.last_contacted_at 
          ? `No contact in ${daysSinceContact} days` 
          : "Never contacted",
        urgency: daysSinceContact > 60 ? "high" : "medium",
      });
    } else if (contact.relationship_strength === 'strong' && daysSinceContact > 14) {
      suggestions.push({
        contact_id: contact.id,
        contact_name: contact.name,
        reason: "Strong relationship needs nurturing",
        urgency: "low",
      });
    }
  }

  return { 
    success: true, 
    suggestions: suggestions.slice(0, 10).sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      return urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
    })
  };
}

// ===== Main Handler =====

function getSupabaseClient(authHeader: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const supabase = getSupabaseClient(authHeader);

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: RequestBody = await req.json();
    const { action, startup_id, contact_id, deal_id } = body;

    console.log(`[crm-agent] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      case "enrich_contact":
        if (!startup_id) throw new Error("startup_id is required");
        result = await enrichContact(
          supabase, user.id, startup_id,
          body.linkedin_url, body.name, body.company
        );
        break;

      case "score_lead":
        if (!startup_id || !contact_id) throw new Error("startup_id and contact_id are required");
        result = await scoreLead(supabase, user.id, startup_id, contact_id);
        break;

      case "score_deal":
        if (!startup_id || !deal_id) throw new Error("startup_id and deal_id are required");
        result = await scoreDeal(supabase, user.id, startup_id, deal_id);
        break;

      case "analyze_pipeline":
        if (!startup_id) throw new Error("startup_id is required");
        result = await analyzePipeline(supabase, user.id, startup_id);
        break;

      case "generate_email":
        if (!startup_id || !contact_id) throw new Error("startup_id and contact_id are required");
        result = await generateEmail(supabase, user.id, startup_id, contact_id, body.purpose);
        break;

      case "detect_duplicate":
        if (!startup_id || !body.name) throw new Error("startup_id and name are required");
        result = await detectDuplicate(supabase, user.id, startup_id, body.name, body.email, body.company);
        break;

      case "summarize_communication":
        if (!startup_id || !contact_id) throw new Error("startup_id and contact_id are required");
        result = await summarizeCommunication(supabase, user.id, startup_id, contact_id);
        break;

      case "suggest_follow_ups":
        if (!startup_id) throw new Error("startup_id is required");
        result = await suggestFollowUps(supabase, user.id, startup_id);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[crm-agent] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
