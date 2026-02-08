/**
 * In-memory rate limiter for Edge Functions
 *
 * Uses a sliding window counter per user ID.
 * State is per-isolate (resets when Deno Deploy spins up a new worker),
 * which is acceptable for basic protection. For strict enforcement,
 * upgrade to a Redis-backed solution.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 60s to prevent memory leaks
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/** Default limits per function type */
export const RATE_LIMITS = {
  /** Heavy AI pipeline (validator-start) */
  heavy: { maxRequests: 5, windowSeconds: 300 } as RateLimitConfig,
  /** Standard AI calls (canvas-coach, market-research, etc.) */
  standard: { maxRequests: 30, windowSeconds: 60 } as RateLimitConfig,
  /** Light/read-only (validator-status, dashboard-metrics) */
  light: { maxRequests: 120, windowSeconds: 60 } as RateLimitConfig,
};

/**
 * Check rate limit for a user + function combination.
 *
 * @param userId - The authenticated user's ID
 * @param functionName - Edge function name (e.g., 'validator-start')
 * @param config - Rate limit config (use RATE_LIMITS presets)
 * @returns Whether the request is allowed and remaining quota
 */
export function checkRateLimit(
  userId: string,
  functionName: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const key = `${userId}:${functionName}`;
  const now = Date.now();
  const entry = store.get(key);

  // No existing entry or window expired — allow
  if (!entry || entry.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowSeconds * 1000 };
  }

  // Within window — check count
  if (entry.count < config.maxRequests) {
    entry.count++;
    return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
  }

  // Rate limited
  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}

/**
 * Create a 429 Too Many Requests response with rate limit headers
 */
export function rateLimitResponse(result: RateLimitResult, corsHeaders: Record<string, string>): Response {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfterSeconds: retryAfter,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
      },
    }
  );
}
