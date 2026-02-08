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
