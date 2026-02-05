 /**
  * useValidatorPipeline Hook
  * Manages the complete chat → validator → report flow
  */
 
 import { useState, useCallback } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { supabase } from '@/integrations/supabase/client';
 import { useToast } from '@/hooks/use-toast';
 
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
    */
   const startValidation = useCallback(async (
     inputText: string,
     startupId?: string,
     redirectToProgress: boolean = true
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
       const { data, error: fnError } = await supabase.functions.invoke('validator-start', {
         body: {
           input_text: inputText.trim(),
           startup_id: startupId,
         },
       });
 
       if (fnError) throw fnError;
 
       if (!data.success) {
         throw new Error(data.error || 'Failed to start validation');
       }
 
       const result: PipelineResult = {
         session_id: data.session_id,
         report_id: data.report_id,
         status: data.status,
         verified: data.verified,
         failed_agents: data.failed_agents || [],
         warnings: data.warnings || [],
       };
 
       // Navigate to progress or report page
       if (redirectToProgress) {
         if (result.status === 'complete' && result.report_id) {
           navigate(`/validator/report/${result.report_id}`);
         } else {
           navigate(`/validator/run/${result.session_id}`);
         }
       }
 
       // Show appropriate toast
       if (result.status === 'complete' && result.verified) {
         toast({
           title: 'Validation Complete',
           description: 'Your AI-verified report is ready!',
         });
       } else if (result.status === 'complete') {
         toast({
           title: 'Validation Complete',
           description: 'Report generated with some warnings',
         });
       } else if (result.status === 'partial') {
         toast({
           title: 'Partial Validation',
           description: `Some agents failed: ${result.failed_agents.join(', ')}`,
           variant: 'destructive',
         });
       }
 
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