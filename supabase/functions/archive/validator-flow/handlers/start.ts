/**
 * POST /validator-flow — Start validation pipeline
 * Proxies to validator-start with same body and auth
 */

import type { FlowStartRequest, FlowStartResponse } from "../types.ts";
import { FUNCTIONS } from "../config.ts";
import { invokeFunction } from "../lib/invoke.ts";

export async function handleStart(
  req: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  let body: FlowStartRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { input_text } = body;
  const sanitized = (input_text || '').replace(/<[^>]*>/g, '').trim();

  if (sanitized.length < 10) {
    return new Response(
      JSON.stringify({ error: 'Input text too short (min 10 characters)' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  if (sanitized.length > 5000) {
    return new Response(
      JSON.stringify({ error: 'Input text too long (max 5000 characters)' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const res = await invokeFunction({
    functionName: FUNCTIONS.start,
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify({
      input_text: sanitized,
      startup_id: body.startup_id,
      interview_context: body.interview_context,
    }),
  });

  const data = await res.json().catch(() => ({})) as FlowStartResponse;
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
