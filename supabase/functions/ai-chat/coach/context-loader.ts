/**
 * Context Loader
 * Loads project context for coach mode
 *
 * Migrated from legacy validation_sessions/validation_conversations to
 * chat_sessions/chat_messages (CORE-01, 2026-02-25).
 */

import type { ValidationContext, ValidationSession, ConversationData } from "./types.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

/**
 * Load project context for a startup
 * Queries chat_sessions (last_tab='coach') + chat_messages + startup data
 * Target: < 500ms total
 */
export async function loadValidationContext(
  supabase: SupabaseClient,
  startupId: string,
  userId: string
): Promise<ValidationContext> {
  const startTime = Date.now();

  try {
    const [startupResult, canvasResult, tractionResult, sessionResult] = await Promise.all([
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

      // Find active coach session for this startup+user
      supabase
        .from('chat_sessions')
        .select('id, startup_id, user_id, last_tab, context_snapshot, started_at, updated_at, ended_at')
        .eq('user_id', userId)
        .eq('startup_id', startupId)
        .eq('last_tab', 'coach')
        .is('ended_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    // Map chat_sessions row to ValidationSession interface
    let session: ValidationSession | null = null;
    let recentConversations: ConversationData[] = [];

    if (sessionResult.data) {
      const s = sessionResult.data;
      const snapshot = (s.context_snapshot || {}) as Record<string, unknown>;

      session = {
        id: s.id,
        startup_id: s.startup_id,
        phase: (snapshot.phase as string) || 'onboarding',
        state: (snapshot.state as Record<string, unknown>) || {},
        is_active: true,
        started_at: s.started_at,
        last_interaction_at: s.updated_at,
      };

      // Load recent messages (last 20 for context window)
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select('id, role, content, metadata, created_at')
        .eq('session_id', s.id)
        .order('created_at', { ascending: true })
        .limit(20);

      if (messagesData && messagesData.length > 0) {
        recentConversations = messagesData.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          role: m.role as string,
          content: m.content as string,
          phase: ((m.metadata as Record<string, unknown>)?.phase as string) || 'onboarding',
          created_at: m.created_at as string,
        }));
      }
    }

    const loadTime = Date.now() - startTime;
    console.log(`[Context Loader] Loaded in ${loadTime}ms for startup ${startupId} (session: ${session?.id || 'none'}, messages: ${recentConversations.length})`);

    return {
      startup: startupResult.data,
      canvas: canvasResult.data,
      traction: tractionResult.data,
      session,
      assessments: [],
      currentCampaign: null,
      currentSprint: null,
      recentConversations,
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
 * Create a new coach session in chat_sessions
 */
export async function createSession(
  supabase: SupabaseClient,
  startupId: string,
  userId: string
): Promise<ValidationSession | null> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        startup_id: startupId,
        last_tab: 'coach',
        title: 'Coach Session',
        context_snapshot: { phase: 'onboarding', state: {} },
        started_at: new Date().toISOString(),
        message_count: 0,
      })
      .select('id, startup_id, context_snapshot, started_at, updated_at')
      .single();

    if (error) {
      console.error('[Context Loader] Failed to create session:', error);
      return null;
    }

    console.log(`[Context Loader] Created coach session ${data.id}`);

    return {
      id: data.id,
      startup_id: data.startup_id,
      phase: 'onboarding',
      state: {},
      is_active: true,
      started_at: data.started_at,
      last_interaction_at: data.updated_at,
    };
  } catch (error) {
    console.error('[Context Loader] Session creation error:', error);
    return null;
  }
}

/**
 * Update session phase/state in chat_sessions.context_snapshot
 */
export async function updateSession(
  supabase: SupabaseClient,
  sessionId: string,
  updates: { phase?: string; state?: unknown }
): Promise<void> {
  try {
    // First read current snapshot
    const { data: current } = await supabase
      .from('chat_sessions')
      .select('context_snapshot')
      .eq('id', sessionId)
      .single();

    const snapshot = (current?.context_snapshot || {}) as Record<string, unknown>;

    if (updates.phase) snapshot.phase = updates.phase;
    if (updates.state) snapshot.state = updates.state;

    await supabase
      .from('chat_sessions')
      .update({
        context_snapshot: snapshot,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);
  } catch (error) {
    console.error('[Context Loader] Failed to update session:', error);
  }
}

/**
 * Save a message to chat_messages
 */
export async function saveConversation(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  phase: string,
  metadata?: {
    tokens_used?: number;
    model_used?: string;
    tool_calls?: unknown[];
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role,
        content,
        tab: 'coach',
        metadata: {
          phase,
          ...(metadata?.tokens_used && { tokens_used: metadata.tokens_used }),
          ...(metadata?.model_used && { model_used: metadata.model_used }),
          ...(metadata?.tool_calls && { tool_calls: metadata.tool_calls }),
        },
      });

    if (error) {
      console.error('[Context Loader] Failed to save conversation:', error);
    }
  } catch (error) {
    console.error('[Context Loader] Save conversation error:', error);
  }
}
