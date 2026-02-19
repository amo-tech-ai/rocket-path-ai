/**
 * Context Loader
 * Loads project context for coach mode
 *
 * NOTE: Legacy validation_sessions / validation_campaigns / validation_sprints /
 *       validation_conversations / validation_assessments tables have been dropped.
 *       Session & conversation persistence is disabled until coach mode is
 *       migrated to chat_sessions / chat_messages (see 004-CLN).
 */

import type { ValidationContext, ValidationSession } from "./types.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

/**
 * Load project context for a startup (read-only, no legacy tables)
 * Target: < 500ms total
 */
export async function loadValidationContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<ValidationContext> {
  const startTime = Date.now();

  try {
    const [startupResult, canvasResult, tractionResult] = await Promise.all([
      supabase
        .from('startups')
        .select('id, name, industry, stage, description, tagline, target_market, business_model, traction_data, competitors, problem, solution')
        .eq('id', startupId)
        .single(),

      supabase
        .from('lean_canvases')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from('traction_metrics')
        .select('*')
        .eq('startup_id', startupId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const loadTime = Date.now() - startTime;
    console.log(`[Context Loader] Loaded in ${loadTime}ms for startup ${startupId}`);

    return {
      startup: startupResult.data,
      canvas: canvasResult.data,
      traction: tractionResult.data,
      session: null,
      assessments: [],
      currentCampaign: null,
      currentSprint: null,
      recentConversations: [],
    };
  } catch (error) {
    console.error('[Context Loader] Error loading context:', error);
    return {
      startup: null,
      canvas: null,
      traction: null,
      session: null,
      assessments: [],
      currentCampaign: null,
      currentSprint: null,
      recentConversations: [],
    };
  }
}

/**
 * Create session — disabled (legacy tables dropped)
 */
export async function createSession(
  _supabase: SupabaseClient,
  _startupId: string
): Promise<ValidationSession | null> {
  console.log('[Context Loader] Session creation disabled (legacy tables dropped)');
  return null;
}

/**
 * Update session — disabled (legacy tables dropped)
 */
export async function updateSession(
  _supabase: SupabaseClient,
  _sessionId: string,
  _updates: { phase?: string; state?: unknown }
): Promise<void> {
  // no-op: legacy tables dropped
}

/**
 * Save conversation — disabled (legacy tables dropped)
 */
export async function saveConversation(
  _supabase: SupabaseClient,
  _sessionId: string,
  _role: 'user' | 'assistant',
  _content: string,
  _phase: string,
  _metadata?: {
    tokens_used?: number;
    model_used?: string;
    tool_calls?: unknown[];
  }
): Promise<void> {
  // no-op: legacy tables dropped
}
