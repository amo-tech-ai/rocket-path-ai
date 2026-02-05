 /**
  * Validator Regenerate Edge Function
  * Re-run specific agent and recompose report
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
 
     const body = await req.json();
     const { session_id, agent_name } = body;
 
     if (!session_id) {
       return new Response(
         JSON.stringify({ error: 'session_id is required' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Verify session ownership
     const { data: session, error: sessionError } = await supabase
       .from('validator_sessions')
       .select('*')
       .eq('id', session_id)
       .single();
 
     if (sessionError || !session) {
       return new Response(
         JSON.stringify({ error: 'Session not found' }),
         { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // For now, just restart the entire pipeline by calling validator-start
     // In production, you would re-run only the specific agent
     const response = await fetch(`${supabaseUrl}/functions/v1/validator-start`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': authHeader || '',
       },
       body: JSON.stringify({
         input_text: session.input_text,
         startup_id: session.startup_id,
       }),
     });
 
     const result = await response.json();
 
     return new Response(
       JSON.stringify({
         success: true,
         message: `Regenerating ${agent_name || 'full pipeline'}`,
         new_session_id: result.session_id,
         report_id: result.report_id,
         verified: result.verified,
       }),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('[validator-regenerate] Error:', error);
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     return new Response(
       JSON.stringify({ success: false, error: 'Internal server error', details: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });