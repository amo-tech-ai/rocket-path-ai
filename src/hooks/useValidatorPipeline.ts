 /**
  * useValidatorPipeline Hook
  * Manages the complete chat → validator → report flow
  */

 import { useState, useCallback } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { supabase } from '@/integrations/supabase/client';
 import { useToast } from '@/hooks/use-toast';
 import type { FollowupCoverage, ExtractedFields, ConfidenceMap, DiscoveredEntities } from '@/hooks/useValidatorFollowup';

 interface PipelineResult {
   session_id: string;
   report_id: string | null;
   status: 'running' | 'complete' | 'partial' | 'failed';
   verified: boolean;
   failed_agents: string[];
   warnings: string[];
 }

 export function useValidatorPipeline() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [isStarting, setIsStarting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   /**
    * Start the validation pipeline
    * @param inputText - The startup description from chat
    * @param startupId - Optional startup ID to link the report
    * @param redirectToProgress - Whether to navigate to the progress page
    * @param interviewContext - Optional context from chat interview (002-EFN)
    */
   const startValidation = useCallback(async (
     inputText: string,
     startupId?: string,
     redirectToProgress: boolean = true,
     interviewContext?: { coverage: FollowupCoverage; extracted: ExtractedFields; confidence?: ConfidenceMap; discoveredEntities?: DiscoveredEntities } | null,
   ): Promise<PipelineResult | null> => {
     if (!inputText || inputText.trim().length < 10) {
       toast({
         title: 'Input too short',
         description: 'Please describe your startup idea in more detail (min 10 characters)',
         variant: 'destructive',
       });
       return null;
     }

     setIsStarting(true);
     setError(null);

     try {
       // Get a fresh access token. refreshSession() forces a new token from the server.
       // We pass it explicitly to functions.invoke() because the FunctionsClient's
       // internal Authorization header may not update synchronously.
       const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
       if (refreshError || !refreshData?.session?.access_token) {
         console.error('[useValidatorPipeline] No valid session:', refreshError?.message);
         throw new Error('Please sign in to validate your idea');
       }

       const accessToken = refreshData.session.access_token;
       console.log('[useValidatorPipeline] Got fresh token:', accessToken.slice(0, 20) + '...');

       // 002-EFN: Build interview_context for pipeline when available
       const contextPayload = interviewContext ? {
         version: 1,
         extracted: interviewContext.extracted,
         coverage: interviewContext.coverage,
         confidence: interviewContext.confidence,
         discoveredEntities: interviewContext.discoveredEntities,
       } : undefined;

       // Explicitly pass Authorization header with fresh token
       const { data, error: fnError } = await supabase.functions.invoke('validator-start', {
         headers: { Authorization: `Bearer ${accessToken}` },
         body: {
           input_text: inputText.trim(),
           startup_id: startupId,
           interview_context: contextPayload,
         },
       });

       if (fnError) {
         console.error('[useValidatorPipeline] Edge function error:', fnError);
         if (fnError.message?.includes('401') || fnError.message?.includes('Unauthorized')) {
           throw new Error('Authentication failed. Please sign out and sign in again.');
         }
         throw fnError;
       }

       if (!data.success) {
         throw new Error(data.error || 'Failed to start validation');
       }

       const result: PipelineResult = {
         session_id: data.session_id,
         report_id: data.report_id || null,
         status: data.status,
         verified: data.verified || false,
         failed_agents: data.failed_agents || [],
         warnings: data.warnings || [],
       };

       // Navigate to progress page (pipeline runs in background)
       if (redirectToProgress) {
         navigate(`/validator/run/${result.session_id}`);
       }

       toast({
         title: 'Validation Started',
         description: 'Your report is being generated...',
       });

       return result;

     } catch (e) {
       const message = e instanceof Error ? e.message : 'Unknown error';
       setError(message);
       toast({
         title: 'Validation Failed',
         description: message,
         variant: 'destructive',
       });
       return null;
     } finally {
       setIsStarting(false);
     }
   }, [navigate, toast]);

   return {
     startValidation,
     isStarting,
     error,
   };
 }
