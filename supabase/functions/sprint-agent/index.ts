/**
 * Sprint Agent Edge Function
 * Generates validation sprint tasks from startup profile + Lean Canvas data.
 * Uses Gemini 3 Flash to create structured, measurable sprint cards.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

// ---------------------------------------------------------------------------
// Schema for AI-generated sprint tasks
// ---------------------------------------------------------------------------
const TASK_SCHEMA = {
  type: 'object',
  properties: {
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Short task title (5-10 words)' },
          source: { type: 'string', description: 'Which canvas section this derives from', enum: ['problem', 'solution', 'channels', 'revenue', 'customers', 'competition', 'metrics', 'advantage', 'risk'] },
          sprint_number: { type: 'integer', description: 'Sprint 1-6 this belongs to' },
          success_criteria: { type: 'string', description: 'Measurable success criteria (e.g. "15 conversations, 60% say would pay")' },
          ai_tip: { type: 'string', description: 'Tactical coaching advice (1-2 sentences)' },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['title', 'source', 'sprint_number', 'success_criteria', 'ai_tip', 'priority'],
      },
    },
  },
  required: ['tasks'],
};

const SYSTEM_PROMPT = `You are a startup validation sprint planner. Generate practical validation tasks for a 90-day plan (6 two-week sprints).

Rules:
- Generate exactly 4 tasks per sprint (24 total across 6 sprints).
- Sprint order: 1=Foundation, 2=Solution Fit, 3=Willingness to Pay, 4=Channel Test, 5=MVP Build, 6=Early Traction.
- Each task MUST have specific, measurable success criteria — never vague ("talk to people" ❌, "15 conversations, understand top 3 pains" ✅).
- AI tips should be tactical and specific to the startup's industry/context.
- Map tasks to canvas sections: problem, solution, channels, revenue, customers, competition, metrics, advantage, risk.
- Sprint 1 should include "Complete Lean Canvas" and "Interview target customers" tasks.
- Sprint 6 should include a traction/launch task.
- Adapt task difficulty to the startup's stage.`;

// Domain knowledge fragment: RICE scoring, Kano classification, momentum sequencing
// Source: agency/prompts/sprint-agent-fragment.md
const SPRINT_FRAGMENT = `
## RICE Scoring for Task Generation

Score every generated task using RICE before assigning it to a sprint:

RICE Score = (Reach x Impact x Confidence) / Effort

- Reach (1-10): How many users, customers, or business dimensions does this task affect?
- Impact (0.25 / 0.5 / 1 / 2 / 3): Minimal / Low / Medium / High / Massive
- Confidence (0.5 / 0.8 / 1.0): How certain are we this task will produce the expected outcome?
- Effort (1-10): Person-days for a solo founder. 1 = a few hours, 10 = two full weeks.

Classify tasks into quadrants based on RICE:
- Quick Wins (RICE >= 5, Effort <= 3): Do first. Sprint 1 priority.
- Big Bets (RICE >= 5, Effort > 3): Plan carefully. Break into subtasks. Sprint 2-3.
- Fill-Ins (RICE < 5, Effort <= 3): Use for slack time between major tasks.
- Time Sinks (RICE < 5, Effort > 3): Skip unless explicitly requested.

## Kano Classification

Tag each task with a Kano category:
- Must-Have: Without this, the product/business fails a basic expectation. Must-Haves go in Sprint 1 regardless of RICE score.
- Performance: More of this = more satisfaction. Linear relationship.
- Delighter: Unexpected value that creates outsized positive reaction. Save for Sprint 3+ unless effort is very low.

Sprint allocation rule: Sprint 1 = all Must-Haves + top Quick Wins. Sprint 2 = Big Bets + Performance tasks. Sprint 3+ = Performance + Delighters.

## Momentum Sequencing

Order tasks within each sprint to build psychological momentum:
1. Start every sprint with a Quick Win (completable in 1-2 days).
2. Place the hardest task in the middle of the sprint, not at the beginning.
3. End every sprint with a visible deliverable: something the founder can show, demo, or share.
4. Never sequence two high-effort tasks back-to-back.
5. Group related tasks adjacently — context-switching costs 20-30% productivity.

## Capacity Planning

Solo founder: max 40 story points per 2-week sprint (20% buffer = 8 points reserved).
Story point mapping: 1 = trivial (< 2 hours), 2 = small (half day), 3 = medium (1 day), 5 = large (2-3 days), 8 = very large (1 week).
If total generated tasks exceed capacity, defer lowest-RICE tasks to the next sprint.`;

const ENHANCED_SYSTEM_PROMPT = `${SYSTEM_PROMPT}\n\n${SPRINT_FRAGMENT}`;

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const corsHeaders = getCorsHeaders(req);

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    // Auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing env vars');

    const authHeader = req.headers.get('Authorization');
    const sb = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    const { data: { user }, error: userError } = await sb.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Rate limit — generates 24 tasks via Gemini (heavy)
    const rateResult = checkRateLimit(user.id, 'sprint-agent', RATE_LIMITS.heavy);
    if (!rateResult.allowed) {
      console.warn(`[sprint-agent] Rate limit hit: user=${user.id}`);
      return rateLimitResponse(rateResult, corsHeaders);
    }

    // Parse input
    let startup_id: string | undefined;
    try {
      const body = await req.json();
      startup_id = body.startup_id;
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    if (!startup_id) {
      return new Response(
        JSON.stringify({ error: 'Missing startup_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Fetch startup data
    const { data: startup, error: startupErr } = await sb
      .from('startups')
      .select('name, description, industry, stage, target_market, key_features, business_model, tagline')
      .eq('id', startup_id)
      .single();

    if (startupErr || !startup) {
      return new Response(
        JSON.stringify({ error: 'Startup not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Build prompt with startup context
    const context = [
      `Startup: ${startup.name || 'Unnamed'}`,
      startup.description ? `Description: ${startup.description}` : null,
      startup.industry ? `Industry: ${startup.industry}` : null,
      startup.stage ? `Stage: ${startup.stage}` : null,
      startup.target_market ? `Target Market: ${startup.target_market}` : null,
      startup.key_features ? `Key Features: ${JSON.stringify(startup.key_features)}` : null,
      startup.business_model ? `Business Model: ${startup.business_model}` : null,
      startup.tagline ? `Tagline: ${startup.tagline}` : null,
    ].filter(Boolean).join('\n');

    const userPrompt = `Generate a 90-day validation plan (24 tasks across 6 sprints) for this startup:\n\n${context}`;

    console.log(`[sprint-agent] Generating tasks for startup: ${startup.name} (${startup_id})`);

    const result = await callGemini(
      'gemini-3-flash-preview',
      ENHANCED_SYSTEM_PROMPT,
      userPrompt,
      {
        responseJsonSchema: TASK_SCHEMA,
        timeoutMs: 30_000,
        maxOutputTokens: 4096,
      },
    );

    const parsed = extractJSON<{ tasks: Array<Record<string, unknown>> }>(result.text);
    if (!parsed?.tasks?.length) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate sprint tasks' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ tasks: parsed.tasks }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[sprint-agent] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
