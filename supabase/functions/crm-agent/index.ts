/**
 * CRM Agent - Main Handler
 * Orchestrates all CRM AI operations.
 * Migrated to shared patterns (006-EFN): G1 schemas, shared CORS, rate limiting.
 *
 * Actions: enrich_contact, score_lead, score_deal, analyze_pipeline,
 *          generate_email, detect_duplicate, summarize_communication,
 *          suggest_follow_ups
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import {
  ENRICH_CONTACT_SYSTEM,
  SCORE_LEAD_SYSTEM,
  SCORE_DEAL_SYSTEM,
  ANALYZE_PIPELINE_SYSTEM,
  GENERATE_EMAIL_SYSTEM,
  SUMMARIZE_COMMUNICATION_SYSTEM,
  enrichContactSchema,
  scoreLeadSchema,
  scoreDealSchema,
  analyzePipelineSchema,
  generateEmailSchema,
  summarizeCommunicationSchema,
} from "./prompt.ts";

const MODEL = "gemini-3-flash-preview";

// ============ TYPES ============

// deno-lint-ignore no-explicit-any
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

// ============ ACTION HANDLERS ============

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

  const userPrompt = `Based on this search query, generate realistic professional profile data:

Query: ${searchQuery}
${linkedinUrl ? `LinkedIn URL: ${linkedinUrl}` : ''}

Generate a professional profile with name, title, company, bio (2-3 sentences), linkedin_url, email (or null), phone (or null), relevant tags, relationship_strength as "weak", and an ai_summary of this contact's relevance to a startup.`;

  try {
    const result = await callGemini(MODEL, ENRICH_CONTACT_SYSTEM, userPrompt, {
      responseJsonSchema: enrichContactSchema,
      timeoutMs: 30_000,
    });
    const enrichedData = extractJSON<Record<string, unknown>>(result.text);

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

  const userPrompt = `Score this lead for a startup. Return a score from 0-100 and explain why.

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
- Bio: ${contact.bio || 'Not available'}`;

  try {
    const result = await callGemini(MODEL, SCORE_LEAD_SYSTEM, userPrompt, {
      responseJsonSchema: scoreLeadSchema,
      timeoutMs: 30_000,
    });
    const parsed = extractJSON<{ score: number; factors: string[]; recommendation: string }>(result.text);

    if (!parsed) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Update contact with score
    await supabase
      .from("contacts")
      .update({
        relationship_strength: parsed.score >= 70 ? 'strong' : parsed.score >= 40 ? 'medium' : 'weak',
        ai_summary: parsed.recommendation,
      })
      .eq("id", contactId);

    return { success: true, score: parsed.score, factors: parsed.factors };
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

  const userPrompt = `Analyze this deal and predict win probability.

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
- Title: ${deal.contacts?.title || 'Unknown'}`;

  try {
    const result = await callGemini(MODEL, SCORE_DEAL_SYSTEM, userPrompt, {
      responseJsonSchema: scoreDealSchema,
      timeoutMs: 30_000,
    });
    const parsed = extractJSON<{ probability: number; insights: string[]; risks: string[]; next_best_action: string }>(result.text);

    if (!parsed) {
      return { success: false, error: "Failed to parse AI response" };
    }

    // Update deal with AI score
    await supabase
      .from("deals")
      .update({
        ai_score: parsed.probability,
        ai_insights: parsed,
        risk_factors: parsed.risks,
      })
      .eq("id", dealId);

    return {
      success: true,
      probability: parsed.probability,
      insights: parsed.insights,
      risks: parsed.risks,
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

  const userPrompt = `Analyze this sales pipeline and identify bottlenecks.

PIPELINE SUMMARY:
${Object.entries(pipelineSummary).map(([stage, count]) => `- ${stage}: ${count} deals`).join('\n')}

STALLING DEALS: ${stalling.length} deals haven't moved in 7+ days
WEIGHTED PIPELINE VALUE: $${weightedPipeline.toFixed(0)}`;

  try {
    const result = await callGemini(MODEL, ANALYZE_PIPELINE_SYSTEM, userPrompt, {
      responseJsonSchema: analyzePipelineSchema,
      timeoutMs: 30_000,
    });
    const parsed = extractJSON<{ bottlenecks: string[]; recommendations: string[]; health_score: number }>(result.text);

    return {
      success: true,
      bottlenecks: parsed?.bottlenecks || ["Unable to analyze pipeline"],
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

  const userPrompt = `Write a professional ${purpose} email.

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

Write a concise, personalized email. Use their name. Reference something specific about them or their company if available.`;

  try {
    const result = await callGemini(MODEL, GENERATE_EMAIL_SYSTEM, userPrompt, {
      responseJsonSchema: generateEmailSchema,
      timeoutMs: 30_000,
    });
    const parsed = extractJSON<{ subject: string; body: string; tone: string }>(result.text);

    if (!parsed) {
      return { success: false, error: "Failed to parse AI response" };
    }

    return {
      success: true,
      subject: parsed.subject,
      body: parsed.body,
      tone: parsed.tone,
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

  const userPrompt = `Summarize this communication history and identify next steps.

COMMUNICATIONS:
${commsSummary}`;

  try {
    const result = await callGemini(MODEL, SUMMARIZE_COMMUNICATION_SYSTEM, userPrompt, {
      responseJsonSchema: summarizeCommunicationSchema,
      timeoutMs: 30_000,
    });
    const parsed = extractJSON<{ summary: string; key_points: string[]; next_steps: string[]; sentiment: string }>(result.text);

    if (!parsed) {
      return { success: false, error: "Failed to parse AI response" };
    }

    return {
      success: true,
      summary: parsed.summary,
      key_points: parsed.key_points,
      next_steps: parsed.next_steps,
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
        JSON.stringify({ error: "Unauthorized", message: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit
    const rateResult = checkRateLimit(user.id, "crm-agent", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
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
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
