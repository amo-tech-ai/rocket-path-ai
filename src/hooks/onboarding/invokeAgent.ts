/**
 * Agent Invocation Helper
 * Secure edge function caller with JWT attachment
 */

import { supabase } from '@/integrations/supabase/client';
import { DEV_BYPASS_AUTH } from '@/lib/devConfig';
import { getMockAgentResponse } from '@/lib/devAgentMock';

/**
 * Invokes the onboarding-agent edge function with explicit JWT attachment.
 * This ensures authenticated requests even during high-latency AI operations.
 * 
 * @param body - The request body containing action and parameters
 * @returns The typed response from the edge function
 * @throws Error if no active session or if the request fails
 */
export async function invokeAgent<T>(body: Record<string, unknown>): Promise<T> {
  const action = body.action as string;

  if (DEV_BYPASS_AUTH) {
    console.log(`[DEV Bypassing Auth] Invoking agent with action: ${action}`);
    return getMockAgentResponse<T>(action, body);
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("No active Supabase session. User is not authenticated.");
  }

  const response = await supabase.functions.invoke('onboarding-agent', {
    body,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (response.error) throw response.error;
  return response.data as T;
}
