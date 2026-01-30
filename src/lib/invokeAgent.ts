/**
 * Universal Agent Invocation Helper
 * 
 * Secure edge function caller with JWT attachment.
 * Use this for ALL edge function calls to ensure consistent auth handling.
 * 
 * Features:
 * - Automatic JWT attachment
 * - Type-safe responses
 * - Audit logging support
 * - Error handling
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// Types
// ============================================================================

export interface InvokeAgentOptions {
  /** Edge function name */
  functionName: string;
  /** Action to perform */
  action: string;
  /** Additional payload */
  payload?: Record<string, unknown>;
  /** Industry context (auto-injected if available) */
  industry?: string;
  /** Stage context */
  stage?: string;
  /** Feature context for pack routing */
  featureContext?: string;
}

export interface AgentResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Invokes an edge function with proper JWT authentication.
 * 
 * @param options - Configuration for the agent call
 * @returns Typed response from the edge function
 * @throws Error if not authenticated or request fails
 * 
 * @example
 * ```ts
 * const result = await invokeAgent<ValidationResult>({
 *   functionName: 'industry-expert-agent',
 *   action: 'validate_canvas',
 *   payload: { canvas_data: canvasData },
 *   industry: 'fintech',
 * });
 * ```
 */
export async function invokeAgent<T>(options: InvokeAgentOptions): Promise<T> {
  const { functionName, action, payload = {}, industry, stage, featureContext } = options;
  
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session?.access_token) {
    throw new Error('Not authenticated. Please sign in to continue.');
  }
  
  // Build request body with context injection
  const body = {
    action,
    ...payload,
    ...(industry && { industry }),
    ...(stage && { stage }),
    ...(featureContext && { feature_context: featureContext }),
    // Metadata for audit logging
    _meta: {
      timestamp: new Date().toISOString(),
      feature_context: featureContext,
    },
  };
  
  // Invoke the function with JWT
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  
  if (error) {
    console.error(`[invokeAgent] ${functionName}/${action} error:`, error);
    throw error;
  }
  
  return data as T;
}

// ============================================================================
// Specialized Invokers
// ============================================================================

/**
 * Invoke the onboarding agent
 */
export async function invokeOnboardingAgent<T>(
  action: string, 
  payload: Record<string, unknown> = {}
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'onboarding-agent',
    action,
    payload,
    featureContext: 'onboarding',
  });
}

/**
 * Invoke the industry expert agent
 */
export async function invokeIndustryExpert<T>(
  action: string, 
  payload: Record<string, unknown> = {}
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'industry-expert-agent',
    action,
    payload,
  });
}

/**
 * Invoke the lean canvas agent
 */
export async function invokeCanvasAgent<T>(
  action: string, 
  payload: Record<string, unknown> = {},
  industry?: string
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'lean-canvas-agent',
    action,
    payload,
    industry,
    featureContext: 'canvas',
  });
}

/**
 * Invoke the pitch deck agent
 */
export async function invokePitchAgent<T>(
  action: string, 
  payload: Record<string, unknown> = {},
  industry?: string
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'pitch-deck-agent',
    action,
    payload,
    industry,
    featureContext: 'pitch',
  });
}

/**
 * Invoke the validation agent (via industry-expert)
 */
export async function invokeValidator<T>(
  action: string, 
  payload: Record<string, unknown> = {},
  industry?: string
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'industry-expert-agent',
    action,
    payload,
    industry,
    featureContext: 'validator',
  });
}

/**
 * Invoke the CRM agent
 */
export async function invokeCRMAgent<T>(
  action: string, 
  payload: Record<string, unknown> = {}
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'crm-agent',
    action,
    payload,
    featureContext: 'crm',
  });
}

/**
 * Invoke the investor agent
 */
export async function invokeInvestorAgent<T>(
  action: string, 
  payload: Record<string, unknown> = {}
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'investor-agent',
    action,
    payload,
    featureContext: 'investors',
  });
}

/**
 * Invoke the task agent
 */
export async function invokeTaskAgent<T>(
  action: string, 
  payload: Record<string, unknown> = {}
): Promise<T> {
  return invokeAgent<T>({
    functionName: 'task-agent',
    action,
    payload,
    featureContext: 'tasks',
  });
}

export default invokeAgent;
