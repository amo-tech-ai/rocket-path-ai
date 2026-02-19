/**
 * GET /validator-flow?session_id= — Get pipeline status
 * Proxies to validator-status
 */

import { FUNCTIONS } from "../config.ts";
import { invokeFunction } from "../lib/invoke.ts";

export async function handleStatus(
  req: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'session_id is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const res = await invokeFunction({
    functionName: FUNCTIONS.status,
    method: 'GET',
    headers: req.headers,
    searchParams: { session_id: sessionId },
  });

  const data = await res.json().catch(() => ({}));
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
