import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

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

// ============ HELPERS ============

async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
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
    console.error("[event-agent] Gemini API error:", error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

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

function createSupabaseClient(authHeader: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
}

type SupabaseClient = ReturnType<typeof createSupabaseClient>;

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

  const prompt = `Suggest 5-8 relevant industry events for this startup:

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

Generate relevant events as JSON:
{
  "events": [
    {
      "name": "Event Name",
      "event_type": "conference|meetup|summit|demo_day|pitch_competition|trade_show",
      "relevance_score": 85,
      "industry_fit": "Why this event matches the startup",
      "expected_attendees": "Who typically attends",
      "networking_value": "high|medium|low",
      "typical_date": "March 2026",
      "typical_location": "San Francisco, CA",
      "estimated_cost": "$500-1000",
      "key_benefits": ["Benefit 1", "Benefit 2"],
      "application_deadline": "2 months before",
      "website_hint": "example.com or 'search for [event name]'"
    }
  ],
  "event_strategy": "Overall recommendation for event attendance",
  "priority_events": ["Top 2-3 must-attend events"]
}`;

  const response = await callGemini(
    prompt,
    "You are an expert at identifying valuable networking and industry events for startups. Suggest realistic, well-known events that match the startup's profile."
  );

  const result = parseJsonResponse<{
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
  }>(response);

  return {
    success: true,
    startup_id: startupId,
    events: result.events,
    strategy: result.event_strategy,
    priority_events: result.priority_events,
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

  const prompt = `Analyze the fit between this startup and event:

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

Provide analysis as JSON:
{
  "fit_score": 85,
  "value_breakdown": {
    "networking": { "score": 90, "reason": "..." },
    "learning": { "score": 75, "reason": "..." },
    "visibility": { "score": 80, "reason": "..." },
    "deals": { "score": 70, "reason": "..." }
  },
  "should_attend": true,
  "recommendation": "Strong recommendation with reasoning",
  "preparation_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "networking_targets": ["Who to connect with"],
  "roi_estimate": "Expected return on time/money investment",
  "risks": ["Potential downsides"]
}`;

  const response = await callGemini(
    prompt,
    "You are an expert at evaluating event value for startups. Provide honest, actionable assessments."
  );

  const result = parseJsonResponse<{
    fit_score: number;
    value_breakdown: Record<string, { score: number; reason: string }>;
    should_attend: boolean;
    recommendation: string;
    preparation_tips: string[];
    networking_targets: string[];
    roi_estimate: string;
    risks: string[];
  }>(response);

  return {
    success: true,
    event_id: eventId,
    event_name: event.name,
    ...result,
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
    const prompt = `For an event like "${event?.name}" in the ${startup?.industry || "tech"} industry, suggest typical speaker profiles:

EVENT: ${event?.name} (${event?.event_type})
STARTUP INDUSTRY: ${startup?.industry}

Generate 5-7 speaker archetypes as JSON:
{
  "speaker_types": [
    {
      "type": "Industry Expert",
      "typical_title": "VP of Product",
      "typical_companies": ["FAANG", "Top Startups"],
      "topics_covered": ["Topic 1", "Topic 2"],
      "networking_value": "high|medium|low",
      "approach_strategy": "How to connect with this type"
    }
  ],
  "key_connections": "Who would be most valuable to connect with",
  "research_tips": ["How to find actual speakers"]
}`;

    const response = await callGemini(prompt);
    const result = parseJsonResponse<{
      speaker_types: unknown[];
      key_connections: string;
      research_tips: string[];
    }>(response);

    return {
      success: true,
      event_id: eventId,
      speakers_found: false,
      speaker_types: result.speaker_types,
      key_connections: result.key_connections,
      research_tips: result.research_tips,
    };
  }

  const speakerList = speakers.map(
    (s) => `- ${s.speaker_name} (${s.speaker_title || "Unknown"} at ${s.speaker_company || "Unknown"})`
  ).join("\n");

  const prompt = `Analyze these speakers for networking opportunities:

STARTUP:
- Name: ${startup?.name}
- Industry: ${startup?.industry}
- Stage: ${startup?.stage}

EVENT SPEAKERS:
${speakerList}

Analyze and prioritize as JSON:
{
  "speaker_analysis": [
    {
      "name": "Speaker Name",
      "relevance_score": 85,
      "connection_value": "Why valuable to connect",
      "common_ground": "Shared interests or background",
      "approach_strategy": "How to initiate conversation",
      "key_questions": ["Question to ask them"]
    }
  ],
  "priority_connections": ["Top 3 speakers to prioritize"],
  "networking_plan": "Overall strategy for speaker networking"
}`;

  const response = await callGemini(
    prompt,
    "You are a networking strategist helping startups connect with event speakers."
  );

  const result = parseJsonResponse<{
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
  }>(response);

  return {
    success: true,
    event_id: eventId,
    speakers_found: true,
    total_speakers: speakers.length,
    ...result,
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

  const prompt = `Create comprehensive event preparation materials:

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

Generate preparation materials as JSON:
{
  "elevator_pitch": {
    "15_second": "Ultra-short pitch",
    "30_second": "Standard elevator pitch",
    "60_second": "Extended pitch with traction"
  },
  "talking_points": [
    {
      "topic": "Topic name",
      "key_message": "What to communicate",
      "supporting_fact": "Data point or story"
    }
  ],
  "questions_to_ask": [
    {
      "target": "Who to ask",
      "question": "The question",
      "why": "Why this matters"
    }
  ],
  "goals": {
    "primary": "Main goal",
    "secondary": ["Other goals"],
    "success_metrics": ["How to measure success"]
  },
  "logistics_checklist": ["Item 1", "Item 2"],
  "materials_needed": ["Business cards", "Deck", "etc"],
  "follow_up_template": "Post-event follow-up email template"
}`;

  const response = await callGemini(
    prompt,
    "You are an expert at preparing founders for networking events. Create practical, actionable preparation materials."
  );

  const result = parseJsonResponse<{
    elevator_pitch: Record<string, string>;
    talking_points: Array<{ topic: string; key_message: string; supporting_fact: string }>;
    questions_to_ask: Array<{ target: string; question: string; why: string }>;
    goals: { primary: string; secondary: string[]; success_metrics: string[] };
    logistics_checklist: string[];
    materials_needed: string[];
    follow_up_template: string;
  }>(response);

  return {
    success: true,
    event_id: eventId,
    event_name: event.name,
    ...result,
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
    const prompt = `Based on this event attendance, provide follow-up insights:

EVENT: ${event.name}
RATING: ${attendance.rating}/5
CONNECTIONS: ${attendance.connections_made || 0}
LEADS: ${attendance.leads_generated || 0}
NOTES: ${attendance.notes || "None"}

Provide insights as JSON:
{
  "roi_assessment": "Was this event worth it?",
  "follow_up_actions": ["Action 1", "Action 2"],
  "lessons_learned": ["Lesson 1", "Lesson 2"],
  "similar_events": ["Events to consider based on this experience"]
}`;

    const response = await callGemini(prompt);
    insights = parseJsonResponse<{
      roi_assessment: string;
      follow_up_actions: string[];
      lessons_learned: string[];
      similar_events: string[];
    }>(response);
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

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createSupabaseClient(authHeader);

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
