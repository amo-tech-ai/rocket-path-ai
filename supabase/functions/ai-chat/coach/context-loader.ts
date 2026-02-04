/**
 * Context Loader
 * Loads full project memory for coach mode
 */

import type { ValidationContext, ValidationSession } from "./types.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

/**
 * Load complete validation context for a startup
 * Target: < 500ms total
 */
export async function loadValidationContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<ValidationContext> {
  const startTime = Date.now();
  
  try {
    // First, get the active session to use its ID for related queries
    const { data: session } = await supabase
      .from('validation_sessions')
      .select('*')
      .eq('startup_id', startupId)
      .eq('is_active', true)
      .single();
    
    // Now load all other data in parallel
    const [
      startupResult,
      canvasResult,
      tractionResult,
      assessmentsResult,
      campaignResult,
      conversationsResult,
    ] = await Promise.all([
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
      
      session?.id
        ? supabase
            .from('validation_assessments')
            .select('*')
            .eq('session_id', session.id)
            .order('assessed_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      
      session?.id
        ? supabase
            .from('validation_campaigns')
            .select('*')
            .eq('session_id', session.id)
            .eq('status', 'active')
            .maybeSingle()
        : Promise.resolve({ data: null }),
      
      session?.id
        ? supabase
            .from('validation_conversations')
            .select('*')
            .eq('session_id', session.id)
            .order('created_at', { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [] }),
    ]);
    
    // If we have a campaign, get the current sprint
    let sprintResult = { data: null };
    if (campaignResult.data?.id) {
      sprintResult = await supabase
        .from('validation_sprints')
        .select('*')
        .eq('campaign_id', campaignResult.data.id)
        .order('sprint_number', { ascending: false })
        .limit(1)
        .maybeSingle();
    }
    
    const loadTime = Date.now() - startTime;
    console.log(`[Context Loader] Loaded in ${loadTime}ms for startup ${startupId}`);
    
    if (loadTime > 500) {
      console.warn(`[Context Loader] Slow load: ${loadTime}ms (target: <500ms)`);
    }
    
    return {
      startup: startupResult.data,
      canvas: canvasResult.data,
      traction: tractionResult.data,
      session: session,
      assessments: assessmentsResult.data || [],
      currentCampaign: campaignResult.data,
      currentSprint: sprintResult.data,
      recentConversations: (conversationsResult.data || []).reverse(),
    };
  } catch (error) {
    console.error('[Context Loader] Error loading context:', error);
    
    // Return empty context on error
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
 * Create a new validation session
 */
export async function createSession(
  supabase: SupabaseClient,
  startupId: string
): Promise<ValidationSession | null> {
  try {
    // Deactivate any existing sessions
    await supabase
      .from('validation_sessions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('startup_id', startupId)
      .eq('is_active', true);
    
    // Create new session
    const { data, error } = await supabase
      .from('validation_sessions')
      .insert({
        startup_id: startupId,
        phase: 'onboarding',
        state: {},
        is_active: true,
        started_at: new Date().toISOString(),
        last_interaction_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('[Context Loader] Error creating session:', error);
      return null;
    }
    
    console.log(`[Context Loader] Created new session ${data.id}`);
    return data;
  } catch (error) {
    console.error('[Context Loader] Error in createSession:', error);
    return null;
  }
}

/**
 * Update session state and phase
 */
export async function updateSession(
  supabase: SupabaseClient,
  sessionId: string,
  updates: {
    phase?: string;
    // deno-lint-ignore no-explicit-any
    state?: any;
  }
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {
      last_interaction_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    if (updates.phase) {
      updateData.phase = updates.phase;
    }
    
    if (updates.state) {
      // Merge with existing state
      updateData.state = updates.state;
    }
    
    await supabase
      .from('validation_sessions')
      .update(updateData)
      .eq('id', sessionId);
      
  } catch (error) {
    console.error('[Context Loader] Error updating session:', error);
  }
}

/**
 * Save conversation message
 */
export async function saveConversation(
  supabase: SupabaseClient,
  sessionId: string,
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
    await supabase
      .from('validation_conversations')
      .insert({
        session_id: sessionId,
        role,
        content,
        phase,
        tokens_used: metadata?.tokens_used,
        model_used: metadata?.model_used,
        tool_calls: metadata?.tool_calls,
      });
  } catch (error) {
    console.error('[Context Loader] Error saving conversation:', error);
  }
}
