/**
 * useValidatorRegenerate Hook
 * Triggers report regeneration via validator-regenerate edge function.
 * Follows same auth pattern as useValidatorPipeline (refreshSession + explicit header).
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RegenerateResult {
  new_session_id: string;
  report_id: string;
  verified: boolean;
}

export function useValidatorRegenerate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Regenerate a validation report
   * @param sessionId - The original session to regenerate from
   * @param agentName - Optional specific agent to re-run (omit for full pipeline)
   * @param redirectToProgress - Whether to navigate to the progress page
   */
  const regenerate = useCallback(async (
    sessionId: string,
    agentName?: string,
    redirectToProgress: boolean = true,
  ): Promise<RegenerateResult | null> => {
    if (!sessionId) {
      toast({
        title: 'Cannot regenerate',
        description: 'No session ID available for this report',
        variant: 'destructive',
      });
      return null;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshData?.session?.access_token) {
        console.error('[useValidatorRegenerate] No valid session:', refreshError?.message);
        throw new Error('Please sign in to regenerate your report');
      }

      const accessToken = refreshData.session.access_token;

      const { data, error: fnError } = await supabase.functions.invoke('validator-regenerate', {
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          session_id: sessionId,
          ...(agentName ? { agent_name: agentName } : {}),
        },
      });

      if (fnError) {
        console.error('[useValidatorRegenerate] Edge function error:', fnError);
        if (fnError.message?.includes('401') || fnError.message?.includes('Unauthorized')) {
          throw new Error('Authentication failed. Please sign out and sign in again.');
        }
        if (fnError.message?.includes('403')) {
          throw new Error('You do not have permission to regenerate this report.');
        }
        throw fnError;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to regenerate report');
      }

      const result: RegenerateResult = {
        new_session_id: data.new_session_id,
        report_id: data.report_id,
        verified: data.verified || false,
      };

      if (redirectToProgress) {
        navigate(`/validator/run/${result.new_session_id}`);
      }

      toast({
        title: 'Regeneration Started',
        description: agentName
          ? `Re-running ${agentName}...`
          : 'Full report regeneration in progress...',
      });

      return result;

    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      toast({
        title: 'Regeneration Failed',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsRegenerating(false);
    }
  }, [navigate, toast]);

  return {
    regenerate,
    isRegenerating,
    error,
  };
}
