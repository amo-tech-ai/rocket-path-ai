/**
 * CORS Headers Utility
 * Provides consistent CORS configuration across all Edge Functions
 *
 * Production: restricts to ALLOWED_ORIGINS env var or app domain
 * Development: falls back to wildcard '*' if no origins configured
 */

const ALLOWED_ORIGINS = Deno.env.get('ALLOWED_ORIGINS')?.split(',').map(s => s.trim()) || [];

function getAllowedOrigin(req: Request): string {
  const origin = req.headers.get('Origin') || '';

  // If explicit allowed origins are configured, check against them
  if (ALLOWED_ORIGINS.length > 0) {
    if (ALLOWED_ORIGINS.includes(origin)) {
      return origin;
    }
    // Return first allowed origin as default (won't match browser CORS check)
    return ALLOWED_ORIGINS[0];
  }

  // Fallback: allow all (dev mode / unconfigured)
  return '*';
}

export function getCorsHeaders(req: Request): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': getAllowedOrigin(req),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
}

// Static headers for cases where request is not available
export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS[0] : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Creates a CORS preflight response
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }
  return null;
}

/**
 * Returns a 405 response if the request method is not in the allowed list.
 * Call after handleCors / OPTIONS check. Returns null if method is allowed.
 *
 * Usage:
 *   const methodError = requireMethod(req, 'POST');
 *   if (methodError) return methodError;
 */
export function requireMethod(req: Request, ...methods: string[]): Response | null {
  if (!methods.includes(req.method)) {
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed` }),
      { status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
    );
  }
  return null;
}

/**
 * Adds CORS headers to a response
 */
export function withCors(response: Response, req?: Request): Response {
  const headers = new Headers(response.headers);
  const cors = req ? getCorsHeaders(req) : corsHeaders;
  Object.entries(cors).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
