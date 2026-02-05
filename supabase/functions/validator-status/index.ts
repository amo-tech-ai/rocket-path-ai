 /**
  * Validator Status Edge Function
  * Returns current pipeline status for a session
  */
 
 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
     const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
     const authHeader = req.headers.get('Authorization');
     
     const supabase = createClient(supabaseUrl, supabaseAnonKey, {
       global: { headers: authHeader ? { Authorization: authHeader } : {} },
     });
 
     const { data: { user }, error: userError } = await supabase.auth.getUser();
     if (userError || !user) {
       return new Response(
         JSON.stringify({ error: 'Unauthorized' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const url = new URL(req.url);
     const sessionId = url.searchParams.get('session_id');
 
     if (!sessionId) {
       return new Response(
         JSON.stringify({ error: 'session_id is required' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Get session
     const { data: session, error: sessionError } = await supabase
       .from('validator_sessions')
       .select('*')
       .eq('id', sessionId)
       .single();
 
     if (sessionError || !session) {
       return new Response(
         JSON.stringify({ error: 'Session not found' }),
         { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Get runs
     const { data: runs, error: runsError } = await supabase
       .from('validator_runs')
       .select('*')
       .eq('session_id', sessionId)
       .order('created_at', { ascending: true });
 
     if (runsError) {
       throw runsError;
     }
 
     // Get report if complete
     let report = null;
     if (session.status === 'complete' || session.status === 'partial') {
       const { data: reportData } = await supabase
         .from('validation_reports')
         .select('id, score, summary, verified, verification_json')
         .eq('session_id', sessionId)
         .single();
       
       report = reportData;
     }
 
     // Format steps for UI
     const agentOrder = [
       'ExtractorAgent',
       'ResearchAgent',
       'CompetitorAgent',
       'ScoringAgent',
       'MVPAgent',
       'ComposerAgent',
       'VerifierAgent',
     ];
 
     const steps = agentOrder.map((agentName, index) => {
       const run = runs?.find(r => r.agent_name === agentName);
       return {
         step: index + 1,
         name: getStepName(agentName),
         agent: agentName,
         status: run?.status || 'queued',
         started_at: run?.started_at,
         finished_at: run?.finished_at,
         duration_ms: run?.duration_ms,
         has_citations: (run?.citations?.length || 0) > 0,
         error: run?.error_message,
       };
     });
 
     // Calculate progress
     const completedSteps = steps.filter(s => s.status === 'ok' || s.status === 'partial').length;
     const failedSteps = steps.filter(s => s.status === 'failed').length;
     const progress = Math.round((completedSteps / steps.length) * 100);
 
     return new Response(
       JSON.stringify({
         success: true,
         session_id: sessionId,
         status: session.status,
         progress,
         steps,
         report: report ? {
           id: report.id,
           score: report.score,
           summary: report.summary,
           verified: report.verified,
           verification: report.verification_json,
         } : null,
         error: session.error_message,
         created_at: session.created_at,
         updated_at: session.updated_at,
       }),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('[validator-status] Error:', error);
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     return new Response(
       JSON.stringify({ success: false, error: 'Internal server error', details: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });
 
 function getStepName(agentName: string): string {
   const names: Record<string, string> = {
     ExtractorAgent: 'Extract profile',
     ResearchAgent: 'Market research',
     CompetitorAgent: 'Competitors',
     ScoringAgent: 'Score',
     MVPAgent: 'MVP plan',
     ComposerAgent: 'Compose report',
     VerifierAgent: 'Verify report',
   };
   return names[agentName] || agentName;
 }