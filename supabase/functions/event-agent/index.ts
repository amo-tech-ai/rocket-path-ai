/**
 * Event Agent - Main Handler
 * Discovers events, analyzes fit, researches speakers, generates prep, tracks attendance.
 * Migrated to shared patterns (006-EFN): G1 schemas, shared CORS, rate limiting.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import {
  DISCOVER_EVENTS_SYSTEM,
  ANALYZE_EVENT_SYSTEM,
  RESEARCH_SPEAKERS_ARCHETYPES_SYSTEM,
  RESEARCH_SPEAKERS_ANALYSIS_SYSTEM,
  GENERATE_PREP_SYSTEM,
  TRACK_ATTENDANCE_SYSTEM,
  discoverEventsSchema,
  analyzeEventSchema,
  researchSpeakersArchetypesSchema,
  researchSpeakersAnalysisSchema,
  generatePrepSchema,
  trackAttendanceInsightsSchema,
} from "./prompt.ts";

const MODEL = "gemini-3-flash-preview";

// ============ TYPES ============

interface Event {
  id: string;
  name: string;
  description?: string;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  venue_name?: string;
  city?: string;
  country?: string;
  is_virtual?: boolean;
  website_url?: string;
  capacity?: number;
  ticket_price?: number;
  tags?: string[];
  target_audience?: string;
}

interface Startup {
  id: string;
  name?: string;
  industry?: string;
  stage?: string;
  description?: string;
  target_market?: string;
}

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

// ============ ACTION HANDLERS ============

// 1. Discover relevant events for the startup
async function discoverEvents(
  supabase: SupabaseClient,
  startupId: string,
  criteria: {
    location?: string;
    eventType?: string;
    dateRange?: { start: string; end: string };
    maxBudget?: number;
  }
) {
  console.log(`[event-agent] discoverEvents for startup ${startupId}`);

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  const startupData = startup as Startup | null;

  // Get existing events for context
  const { data: existingEvents } = await supabase
    .from("events")
    .select("name")
    .eq("startup_id", startupId)
    .limit(10);

  const existingNames = (existingEvents || []).map((e: { name: string }) => e.name).join(", ");

  const userPrompt = `Suggest 5-8 relevant industry events for this startup:

STARTUP:
- Name: ${startupData?.name || "Startup"}
- Industry: ${startupData?.industry || "Tech"}
- Stage: ${startupData?.stage || "early"}
- Target Market: ${startupData?.target_market || "B2B"}
- Description: ${startupData?.description || ""}

SEARCH CRITERIA:
- Location Preference: ${criteria.location || "Global"}
- Event Type: ${criteria.eventType || "Any"}
- Date Range: ${criteria.dateRange ? `${criteria.dateRange.start} to ${criteria.dateRange.end}` : "Next 6 months"}
- Max Budget: ${criteria.maxBudget ? `$${criteria.maxBudget}` : "No limit"}

ALREADY TRACKING: ${existingNames || "None"}

Generate relevant events as JSON.`;

  const result = await callGemini(MODEL, DISCOVER_EVENTS_SYSTEM, userPrompt, {
    responseJsonSchema: discoverEventsSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    events: Array<{
      name: string;
      event_type: string;
      relevance_score: number;
      industry_fit: string;
      expected_attendees: string;
      networking_value: string;
      typical_date: string;
      typical_location: string;
      estimated_cost: string;
      key_benefits: string[];
    }>;
    event_strategy: string;
    priority_events: string[];
  }>(result.text);

  return {
    success: true,
    startup_id: startupId,
    events: parsed?.events || [],
    strategy: parsed?.event_strategy || "",
    priority_events: parsed?.priority_events || [],
    criteria_used: criteria,
  };
}

// 2. Analyze specific event fit
async function analyzeEvent(
  supabase: SupabaseClient,
  startupId: string,
  eventId: string
) {
  console.log(`[event-agent] analyzeEvent ${eventId} for startup ${startupId}`);

  const [startupRes, eventRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("events").select("*").eq("id", eventId).single(),
  ]);

  const startup = startupRes.data as Startup | null;
  const event = eventRes.data as Event | null;

  if (!event) {
    throw new Error("Event not found");
  }

  const userPrompt = `Analyze the fit between this startup and event:

STARTUP:
- Name: ${startup?.name}
- Industry: ${startup?.industry}
- Stage: ${startup?.stage}
- Target Market: ${startup?.target_market}
- Description: ${startup?.description}

EVENT:
- Name: ${event.name}
- Type: ${event.event_type}
- Date: ${event.start_date}
- Location: ${event.venue_name || event.city || "TBD"}
- Description: ${event.description}
- Target Audience: ${event.target_audience}
- Cost: ${event.ticket_price ? `$${event.ticket_price}` : "Unknown"}

Provide analysis as JSON.`;

  const result = await callGemini(MODEL, ANALYZE_EVENT_SYSTEM, userPrompt, {
    responseJsonSchema: analyzeEventSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    fit_score: number;
    value_breakdown: Record<string, { score: number; reason: string }>;
    should_attend: boolean;
    recommendation: string;
    preparation_tips: string[];
    networking_targets: string[];
    roi_estimate: string;
    risks: string[];
  }>(result.text);

  return {
    success: true,
    event_id: eventId,
    event_name: event.name,
    ...(parsed || {
      fit_score: 0,
      value_breakdown: {},
      should_attend: false,
      recommendation: "",
      preparation_tips: [],
      networking_targets: [],
      roi_estimate: "",
      risks: [],
    }),
  };
}

// 3. Research speakers at an event
async function researchSpeakers(
  supabase: SupabaseClient,
  startupId: string,
  eventId: string
) {
  console.log(`[event-agent] researchSpeakers for event ${eventId}`);

  const [startupRes, eventRes, speakersRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("events").select("*").eq("id", eventId).single(),
    supabase.from("event_speakers").select("*").eq("event_id", eventId).limit(20),
  ]);

  const startup = startupRes.data as Startup | null;
  const event = eventRes.data as Event | null;
  const speakers = (speakersRes.data || []) as Array<{
    speaker_name: string;
    speaker_title?: string;
    speaker_company?: string;
    speaker_linkedin?: string;
  }>;

  if (speakers.length === 0) {
    // Generate hypothetical speaker profiles
    const userPrompt = `For an event like "${event?.name}" in the ${startup?.industry || "tech"} industry, suggest typical speaker profiles:

EVENT: ${event?.name} (${event?.event_type})
STARTUP INDUSTRY: ${startup?.industry}

Generate 5-7 speaker archetypes as JSON.`;

    const result = await callGemini(MODEL, RESEARCH_SPEAKERS_ARCHETYPES_SYSTEM, userPrompt, {
      responseJsonSchema: researchSpeakersArchetypesSchema,
      timeoutMs: 30_000,
    });

    const parsed = extractJSON<{
      speaker_types: unknown[];
      key_connections: string;
      research_tips: string[];
    }>(result.text);

    return {
      success: true,
      event_id: eventId,
      speakers_found: false,
      speaker_types: parsed?.speaker_types || [],
      key_connections: parsed?.key_connections || "",
      research_tips: parsed?.research_tips || [],
    };
  }

  const speakerList = speakers.map(
    (s) => `- ${s.speaker_name} (${s.speaker_title || "Unknown"} at ${s.speaker_company || "Unknown"})`
  ).join("\n");

  const userPrompt = `Analyze these speakers for networking opportunities:

STARTUP:
- Name: ${startup?.name}
- Industry: ${startup?.industry}
- Stage: ${startup?.stage}

EVENT SPEAKERS:
${speakerList}

Analyze and prioritize as JSON.`;

  const result = await callGemini(MODEL, RESEARCH_SPEAKERS_ANALYSIS_SYSTEM, userPrompt, {
    responseJsonSchema: researchSpeakersAnalysisSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    speaker_analysis: Array<{
      name: string;
      relevance_score: number;
      connection_value: string;
      common_ground: string;
      approach_strategy: string;
      key_questions: string[];
    }>;
    priority_connections: string[];
    networking_plan: string;
  }>(result.text);

  return {
    success: true,
    event_id: eventId,
    speakers_found: true,
    total_speakers: speakers.length,
    ...(parsed || {
      speaker_analysis: [],
      priority_connections: [],
      networking_plan: "",
    }),
  };
}

// 4. Generate event preparation materials
async function generatePrep(
  supabase: SupabaseClient,
  startupId: string,
  eventId: string
) {
  console.log(`[event-agent] generatePrep for event ${eventId}`);

  const [startupRes, eventRes] = await Promise.all([
    supabase.from("startups").select("*").eq("id", startupId).single(),
    supabase.from("events").select("*").eq("id", eventId).single(),
  ]);

  const startup = startupRes.data as Startup | null;
  const event = eventRes.data as Event | null;

  if (!event) {
    throw new Error("Event not found");
  }

  const userPrompt = `Create comprehensive event preparation materials:

STARTUP:
- Name: ${startup?.name}
- Industry: ${startup?.industry}
- Stage: ${startup?.stage}
- Description: ${startup?.description}

EVENT:
- Name: ${event.name}
- Date: ${event.start_date}
- Location: ${event.venue_name || event.city}
- Type: ${event.event_type}

Generate preparation materials as JSON.`;

  const result = await callGemini(MODEL, GENERATE_PREP_SYSTEM, userPrompt, {
    responseJsonSchema: generatePrepSchema,
    timeoutMs: 30_000,
  });

  const parsed = extractJSON<{
    elevator_pitch: Record<string, string>;
    talking_points: Array<{ topic: string; key_message: string; supporting_fact: string }>;
    questions_to_ask: Array<{ target: string; question: string; why: string }>;
    goals: { primary: string; secondary: string[]; success_metrics: string[] };
    logistics_checklist: string[];
    materials_needed: string[];
    follow_up_template: string;
  }>(result.text);

  return {
    success: true,
    event_id: eventId,
    event_name: event.name,
    ...(parsed || {
      elevator_pitch: {},
      talking_points: [],
      questions_to_ask: [],
      goals: { primary: "", secondary: [], success_metrics: [] },
      logistics_checklist: [],
      materials_needed: [],
      follow_up_template: "",
    }),
  };
}

// 5. Track event attendance and outcomes
async function trackAttendance(
  supabase: SupabaseClient,
  startupId: string,
  eventId: string,
  attendance: {
    status: "registered" | "attended" | "cancelled" | "no_show";
    connections_made?: number;
    leads_generated?: number;
    notes?: string;
    rating?: number;
  }
) {
  console.log(`[event-agent] trackAttendance for event ${eventId}`);

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!event) {
    throw new Error("Event not found");
  }

  // Update event with attendance data
  const metadata = (event.metadata as Record<string, unknown>) || {};

  await supabase
    .from("events")
    .update({
      attending_status: attendance.status,
      metadata: {
        ...metadata,
        attendance_logged: new Date().toISOString(),
        connections_made: attendance.connections_made,
        leads_generated: attendance.leads_generated,
        attendee_notes: attendance.notes,
        event_rating: attendance.rating,
      },
    })
    .eq("id", eventId);

  // Generate insights if attended
  let insights = null;
  if (attendance.status === "attended" && attendance.rating) {
    const userPrompt = `Based on this event attendance, provide follow-up insights:

EVENT: ${event.name}
RATING: ${attendance.rating}/5
CONNECTIONS: ${attendance.connections_made || 0}
LEADS: ${attendance.leads_generated || 0}
NOTES: ${attendance.notes || "None"}

Provide insights as JSON.`;

    const result = await callGemini(MODEL, TRACK_ATTENDANCE_SYSTEM, userPrompt, {
      responseJsonSchema: trackAttendanceInsightsSchema,
      timeoutMs: 30_000,
    });

    insights = extractJSON<{
      roi_assessment: string;
      follow_up_actions: string[];
      lessons_learned: string[];
      similar_events: string[];
    }>(result.text);
  }

  return {
    success: true,
    event_id: eventId,
    event_name: event.name,
    status_updated: attendance.status,
    insights,
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
    const rateResult = checkRateLimit(user.id, "event-agent", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    const body = await req.json();
    const { action, startup_id, event_id, criteria, attendance } = body;

    console.log(`[event-agent] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      case "discover_events":
        if (!startup_id) throw new Error("startup_id required");
        result = await discoverEvents(supabase, startup_id, criteria || {});
        break;

      case "analyze_event":
        if (!startup_id || !event_id) throw new Error("startup_id and event_id required");
        result = await analyzeEvent(supabase, startup_id, event_id);
        break;

      case "research_speakers":
        if (!startup_id || !event_id) throw new Error("startup_id and event_id required");
        result = await researchSpeakers(supabase, startup_id, event_id);
        break;

      case "generate_prep":
        if (!startup_id || !event_id) throw new Error("startup_id and event_id required");
        result = await generatePrep(supabase, startup_id, event_id);
        break;

      case "track_attendance":
        if (!startup_id || !event_id || !attendance) {
          throw new Error("startup_id, event_id, and attendance required");
        }
        result = await trackAttendance(supabase, startup_id, event_id, attendance);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[event-agent] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
