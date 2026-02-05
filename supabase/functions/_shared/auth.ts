/**
 * Authentication Utilities
 * Provides JWT verification and user context extraction for Edge Functions
 */

import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

// =============================================================================
// Types
// =============================================================================

export interface UserContext {
  userId: string;
  email: string;
  orgId: string | null;
  startupId: string | null;
  role: string;
}

export interface AuthResult {
  user: UserContext | null;
  error: string | null;
  supabase: SupabaseClient;
}

// =============================================================================
// Environment
// =============================================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// =============================================================================
// Client Factories
// =============================================================================

/**
 * Create a Supabase client with user's auth token
 * Uses RLS - queries are scoped to user's permissions
 */
export function createUserClient(authHeader: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

/**
 * Create a Supabase client with service role
 * Bypasses RLS - use for admin operations only
 */
export function createServiceClient(): SupabaseClient {
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

// =============================================================================
// Auth Functions
// =============================================================================

/**
 * Verify JWT and extract user context
 * Returns user details and org membership
 */
export async function verifyAuth(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('Authorization');
  const supabase = createUserClient(authHeader);

  // Get user from JWT
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      user: null,
      error: authError?.message || 'Unauthorized',
      supabase,
    };
  }

  // Get user's profile with org membership
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, role')
    .eq('id', user.id)
    .maybeSingle();

  // Get user's startup if they have one
  let startupId: string | null = null;
  if (profile?.org_id) {
    const { data: startup } = await supabase
      .from('startups')
      .select('id')
      .eq('org_id', profile.org_id)
      .limit(1)
      .maybeSingle();
    startupId = startup?.id || null;
  }

  return {
    user: {
      userId: user.id,
      email: user.email || '',
      orgId: profile?.org_id || null,
      startupId,
      role: profile?.role || 'user',
    },
    error: null,
    supabase,
  };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(req: Request): Promise<{
  user: UserContext;
  supabase: SupabaseClient;
}> {
  const { user, error, supabase } = await verifyAuth(req);

  if (error || !user) {
    throw new Error(error || 'Authentication required');
  }

  return { user, supabase };
}

/**
 * Require specific role
 */
export async function requireRole(req: Request, allowedRoles: string[]): Promise<{
  user: UserContext;
  supabase: SupabaseClient;
}> {
  const { user, supabase } = await requireAuth(req);

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Insufficient permissions. Required role: ${allowedRoles.join(' or ')}`);
  }

  return { user, supabase };
}

/**
 * Check if user has access to a specific startup
 */
export async function canAccessStartup(
  supabase: SupabaseClient,
  userId: string,
  startupId: string
): Promise<boolean> {
  const { data: membership } = await supabase
    .from('startups')
    .select('id')
    .eq('id', startupId)
    .single();

  // RLS will filter - if we get data, user has access
  return !!membership;
}

/**
 * Ensure profile exists (handles OAuth signup race condition)
 */
export async function ensureProfileExists(
  supabase: SupabaseClient,
  userId: string,
  email?: string
): Promise<boolean> {
  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) return true;

  // Create profile if missing (use service client to bypass RLS)
  const serviceClient = createServiceClient();
  const { error } = await serviceClient
    .from('profiles')
    .insert({
      id: userId,
      email: email || '',
      onboarding_completed: false,
    });

  // 23505 = unique violation means trigger already created it
  if (error && error.code !== '23505') {
    console.error('Failed to create profile:', error);
    return false;
  }

  return true;
}
