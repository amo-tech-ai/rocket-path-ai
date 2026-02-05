 /**
  * Validator Start Edge Function
  * Multi-agent pipeline: Extractor → Research → Competitors → Score → MVP → Compose → Verify
  * All sections verified AI-generated with citations tracking
  */
 
 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 // Agent configurations
 const AGENTS = {
   extractor: { name: 'ExtractorAgent', model: 'gemini-3-flash-preview', tools: [] },
   research: { name: 'ResearchAgent', model: 'gemini-3-pro-preview', tools: ['googleSearch'] },
   competitors: { name: 'CompetitorAgent', model: 'gemini-3-pro-preview', tools: ['googleSearch'] },
   scoring: { name: 'ScoringAgent', model: 'gemini-3-pro-preview', tools: [] },
   mvp: { name: 'MVPAgent', model: 'gemini-3-flash-preview', tools: [] },
   composer: { name: 'ComposerAgent', model: 'gemini-3-pro-preview', tools: [] },
   verifier: { name: 'VerifierAgent', model: 'gemini-3-flash-preview', tools: [] },
 } as const;
 
 type AgentName = keyof typeof AGENTS;
 
 interface StartupProfile {
   idea: string;
   problem: string;
   customer: string;
   solution: string;
   differentiation: string;
   alternatives: string;
   validation: string;
   industry: string;
 }
 
 interface MarketResearch {
   tam: number;
   sam: number;
   som: number;
   methodology: string;
   growth_rate: number;
   sources: Array<{ title: string; url: string }>;
 }
 
 interface Competitor {
   name: string;
   description: string;
   strengths: string[];
   weaknesses: string[];
   threat_level: 'high' | 'medium' | 'low';
   source_url?: string;
 }
 
 interface CompetitorAnalysis {
   direct_competitors: Competitor[];
   indirect_competitors: Competitor[];
   market_gaps: string[];
   sources: Array<{ title: string; url: string }>;
 }
 
 interface RiskScore {
   name: string;
   score: number;
   description: string;
   status: 'strong' | 'moderate' | 'weak';
 }
 
 interface ScoringResult {
   overall_score: number;
   verdict: 'go' | 'caution' | 'no_go';
   dimension_scores: Record<string, number>;
   market_factors: RiskScore[];
   execution_factors: RiskScore[];
   highlights: string[];
   red_flags: string[];
   risks_assumptions: string[];
 }
 
 interface MVPPlan {
   mvp_scope: string;
   phases: Array<{ phase: number; name: string; tasks: string[] }>;
   next_steps: string[];
 }
 
 interface ValidatorReport {
   summary_verdict: string;
   problem_clarity: string;
   customer_use_case: string;
   market_sizing: { tam: number; sam: number; som: number; citations: string[] };
   competition: { competitors: Competitor[]; citations: string[] };
   risks_assumptions: string[];
   mvp_scope: string;
   next_steps: string[];
 }
 
 interface VerificationResult {
   verified: boolean;
   missing_sections: string[];
   failed_agents: string[];
   warnings: string[];
   section_mappings: Record<string, string>;
 }
 
 // deno-lint-ignore no-explicit-any
 type SupabaseClient = any;
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
     const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
     const authHeader = req.headers.get('Authorization');
     
     // Use service role for admin operations on runs
     const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
     
     // Use user auth for session creation
     const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
       global: { headers: authHeader ? { Authorization: authHeader } : {} },
     });
 
     const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
     if (userError || !user) {
       return new Response(
         JSON.stringify({ error: 'Unauthorized' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const body = await req.json();
     const { input_text, startup_id } = body;
 
     if (!input_text || input_text.trim().length < 10) {
       return new Response(
         JSON.stringify({ error: 'Input text too short (min 10 characters)' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     console.log('[validator-start] Starting validation for user:', user.id);
 
     // 1. Create session
     const { data: session, error: sessionError } = await supabaseUser
       .from('validator_sessions')
       .insert({
         user_id: user.id,
         startup_id: startup_id || null,
         input_text: input_text.trim(),
         status: 'running',
       })
       .select()
       .single();
 
     if (sessionError) {
       console.error('[validator-start] Session creation failed:', sessionError);
       throw new Error('Failed to create session');
     }
 
     const sessionId = session.id;
     console.log('[validator-start] Session created:', sessionId);
 
     // 2. Create run entries for all agents (queued)
     const agentNames: AgentName[] = ['extractor', 'research', 'competitors', 'scoring', 'mvp', 'composer', 'verifier'];
     for (const agentKey of agentNames) {
       await supabaseAdmin.from('validator_runs').insert({
         session_id: sessionId,
         agent_name: AGENTS[agentKey].name,
         model_used: AGENTS[agentKey].model,
         tool_used: AGENTS[agentKey].tools,
         status: 'queued',
       });
     }
 
     // 3. Run pipeline sequentially with error handling
     let profile: StartupProfile | null = null;
     let marketResearch: MarketResearch | null = null;
     let competitorAnalysis: CompetitorAnalysis | null = null;
     let scoring: ScoringResult | null = null;
     let mvpPlan: MVPPlan | null = null;
     let report: ValidatorReport | null = null;
     let verification: VerificationResult | null = null;
     let failedAgents: string[] = [];
 
     try {
       // Step 1: Extract profile
       profile = await runExtractor(supabaseAdmin, sessionId, input_text);
       if (!profile) failedAgents.push('ExtractorAgent');
     } catch (e) {
       console.error('[ExtractorAgent] Failed:', e);
       failedAgents.push('ExtractorAgent');
     }
 
     try {
       // Step 2: Market research (with Google Search)
       if (profile) {
         marketResearch = await runResearch(supabaseAdmin, sessionId, profile);
         if (!marketResearch) failedAgents.push('ResearchAgent');
       }
     } catch (e) {
       console.error('[ResearchAgent] Failed:', e);
       failedAgents.push('ResearchAgent');
     }
 
     try {
       // Step 3: Competitor analysis (with Google Search)
       if (profile) {
         competitorAnalysis = await runCompetitors(supabaseAdmin, sessionId, profile);
         if (!competitorAnalysis) failedAgents.push('CompetitorAgent');
       }
     } catch (e) {
       console.error('[CompetitorAgent] Failed:', e);
       failedAgents.push('CompetitorAgent');
     }
 
     try {
       // Step 4: Scoring
       if (profile) {
         scoring = await runScoring(supabaseAdmin, sessionId, profile, marketResearch, competitorAnalysis);
         if (!scoring) failedAgents.push('ScoringAgent');
       }
     } catch (e) {
       console.error('[ScoringAgent] Failed:', e);
       failedAgents.push('ScoringAgent');
     }
 
     try {
       // Step 5: MVP Plan
       if (profile && scoring) {
         mvpPlan = await runMVP(supabaseAdmin, sessionId, profile, scoring);
         if (!mvpPlan) failedAgents.push('MVPAgent');
       }
     } catch (e) {
       console.error('[MVPAgent] Failed:', e);
       failedAgents.push('MVPAgent');
     }
 
     try {
       // Step 6: Compose final report
       report = await runComposer(supabaseAdmin, sessionId, profile, marketResearch, competitorAnalysis, scoring, mvpPlan);
       if (!report) failedAgents.push('ComposerAgent');
     } catch (e) {
       console.error('[ComposerAgent] Failed:', e);
       failedAgents.push('ComposerAgent');
     }
 
     try {
       // Step 7: Verify report
       verification = await runVerifier(supabaseAdmin, sessionId, report, failedAgents);
     } catch (e) {
       console.error('[VerifierAgent] Failed:', e);
     }
 
     // 4. Determine final session status
     const finalStatus = failedAgents.length === 0 ? 'complete' : 
                         failedAgents.length < 3 ? 'partial' : 'failed';
 
     // 5. Save report to validation_reports
     let reportId: string | null = null;
     if (report) {
       const { data: savedReport } = await supabaseAdmin
         .from('validation_reports')
         .insert({
           run_id: startup_id || sessionId,
           session_id: sessionId,
           report_type: 'deep',
           score: scoring?.overall_score || 0,
           summary: report.summary_verdict,
           details: {
             ...report,
             dimension_scores: scoring?.dimension_scores,
             market_factors: scoring?.market_factors,
             execution_factors: scoring?.execution_factors,
           },
           key_findings: [...(scoring?.highlights || []), ...(scoring?.red_flags || [])],
           verified: verification?.verified || false,
           verification_json: verification,
         })
         .select()
         .single();
       
       reportId = savedReport?.id || null;
     }
 
     // 6. Update session status
     await supabaseAdmin
       .from('validator_sessions')
       .update({ 
         status: finalStatus,
         error_message: failedAgents.length > 0 ? `Failed agents: ${failedAgents.join(', ')}` : null,
       })
       .eq('id', sessionId);
 
     return new Response(
       JSON.stringify({
         success: true,
         session_id: sessionId,
         report_id: reportId,
         status: finalStatus,
         verified: verification?.verified || false,
         failed_agents: failedAgents,
         warnings: verification?.warnings || [],
       }),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('[validator-start] Error:', error);
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     return new Response(
       JSON.stringify({ success: false, error: 'Internal server error', details: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });
 
 // ============================================================================
 // Agent Functions
 // ============================================================================
 
 async function callGemini(
   model: string,
   systemPrompt: string,
   userPrompt: string,
   useSearch: boolean = false
 ): Promise<{ text: string; searchGrounding?: boolean }> {
   const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
   if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');
 
   const body: Record<string, unknown> = {
     contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
     systemInstruction: { parts: [{ text: systemPrompt }] },
     generationConfig: {
       temperature: 0.4,
       maxOutputTokens: 8192,
       responseMimeType: 'application/json',
     },
     safetySettings: [
       { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
       { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
       { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
       { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
     ],
   };
 
   if (useSearch) {
     body.tools = [{ googleSearch: {} }];
   }
 
   const response = await fetch(
     `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
     {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(body),
     }
   );
 
   if (!response.ok) {
     const errorText = await response.text();
     console.error('[callGemini] Error:', response.status, errorText);
     throw new Error(`Gemini API error: ${response.status}`);
   }
 
   const data = await response.json();
   const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
   const searchGrounding = data.candidates?.[0]?.groundingMetadata?.webSearchQueries?.length > 0;
 
   return { text, searchGrounding };
 }
 
 async function updateRunStatus(
   supabase: SupabaseClient,
   sessionId: string,
   agentName: string,
   status: 'running' | 'ok' | 'partial' | 'failed',
   output?: unknown,
   citations?: unknown[],
   error?: string
 ) {
   const now = new Date().toISOString();
   const update: Record<string, unknown> = { status };
   
   if (status === 'running') {
     update.started_at = now;
   } else {
     update.finished_at = now;
     if (output) update.output_json = output;
     if (citations) update.citations = citations;
     if (error) update.error_message = error;
   }
 
   await supabase
     .from('validator_runs')
     .update(update)
     .eq('session_id', sessionId)
     .eq('agent_name', agentName);
 }
 
 // ============================================================================
 // Agent 1: Extractor
 // ============================================================================
 async function runExtractor(
   supabase: SupabaseClient,
   sessionId: string,
   inputText: string
 ): Promise<StartupProfile | null> {
   const agentName = 'ExtractorAgent';
   await updateRunStatus(supabase, sessionId, agentName, 'running');
 
   const systemPrompt = `You are a startup analyst. Extract structured information from the user's startup description.
 
 Return JSON with exactly these fields:
 {
   "idea": "One-sentence description of the startup idea",
   "problem": "The core problem being solved",
   "customer": "Target customer segment",
   "solution": "How the startup solves the problem",
   "differentiation": "What makes this unique vs alternatives",
   "alternatives": "Current alternatives/competitors mentioned",
   "validation": "Any existing validation or traction mentioned",
   "industry": "Primary industry (e.g., fintech, healthtech, saas, ecommerce)"
 }
 
 If information is not provided, make reasonable inferences based on context.`;
 
   try {
     const { text } = await callGemini(
       AGENTS.extractor.model,
       systemPrompt,
       `Extract startup profile from:\n\n${inputText}`
     );
 
     const profile = JSON.parse(text) as StartupProfile;
     await updateRunStatus(supabase, sessionId, agentName, 'ok', profile);
     return profile;
   } catch (e) {
     const msg = e instanceof Error ? e.message : 'Unknown error';
     await updateRunStatus(supabase, sessionId, agentName, 'failed', null, [], msg);
     return null;
   }
 }
 
 // ============================================================================
 // Agent 2: Research (with Google Search)
 // ============================================================================
 async function runResearch(
   supabase: SupabaseClient,
   sessionId: string,
   profile: StartupProfile
 ): Promise<MarketResearch | null> {
   const agentName = 'ResearchAgent';
   await updateRunStatus(supabase, sessionId, agentName, 'running');
 
   const systemPrompt = `You are a market research analyst. Using real-time web search, find market sizing data for this startup idea.
 
 Return JSON with exactly these fields:
 {
   "tam": <number in USD - Total Addressable Market>,
   "sam": <number in USD - Serviceable Addressable Market>,
   "som": <number in USD - Serviceable Obtainable Market>,
   "methodology": "Brief explanation of how you calculated these numbers",
   "growth_rate": <annual growth rate percentage>,
   "sources": [{"title": "Source name", "url": "https://..."}]
 }
 
 Use industry reports, analyst data, and credible sources. Include real URLs.`;
 
   try {
     const { text, searchGrounding } = await callGemini(
       AGENTS.research.model,
       systemPrompt,
       `Research market size for: ${profile.idea}\nIndustry: ${profile.industry}\nCustomer: ${profile.customer}`,
       true // Use Google Search
     );
 
     const research = JSON.parse(text) as MarketResearch;
     await updateRunStatus(
       supabase, sessionId, agentName,
       searchGrounding ? 'ok' : 'partial',
       research,
       research.sources
     );
     return research;
   } catch (e) {
     const msg = e instanceof Error ? e.message : 'Unknown error';
     await updateRunStatus(supabase, sessionId, agentName, 'failed', null, [], msg);
     return null;
   }
 }
 
 // ============================================================================
 // Agent 3: Competitors (with Google Search)
 // ============================================================================
 async function runCompetitors(
   supabase: SupabaseClient,
   sessionId: string,
   profile: StartupProfile
 ): Promise<CompetitorAnalysis | null> {
   const agentName = 'CompetitorAgent';
   await updateRunStatus(supabase, sessionId, agentName, 'running');
 
   const systemPrompt = `You are a competitive intelligence analyst. Using real-time web search, identify competitors for this startup.
 
 Return JSON with exactly these fields:
 {
   "direct_competitors": [
     {
       "name": "Company name",
       "description": "What they do",
       "strengths": ["strength1", "strength2"],
       "weaknesses": ["weakness1"],
       "threat_level": "high|medium|low",
       "source_url": "https://..."
     }
   ],
   "indirect_competitors": [
     {
       "name": "Company name",
       "description": "What they do and how they compete indirectly",
       "strengths": [],
       "weaknesses": [],
       "threat_level": "medium",
       "source_url": "https://..."
     }
   ],
   "market_gaps": ["Gap 1", "Gap 2"],
   "sources": [{"title": "Source", "url": "https://..."}]
 }
 
 Find 3-5 direct competitors and 2-3 indirect. Include real company data and URLs.`;
 
   try {
     const { text, searchGrounding } = await callGemini(
       AGENTS.competitors.model,
       systemPrompt,
       `Find competitors for: ${profile.idea}\nIndustry: ${profile.industry}\nExisting alternatives mentioned: ${profile.alternatives}`,
       true // Use Google Search
     );
 
     const analysis = JSON.parse(text) as CompetitorAnalysis;
     await updateRunStatus(
       supabase, sessionId, agentName,
       searchGrounding ? 'ok' : 'partial',
       analysis,
       analysis.sources
     );
     return analysis;
   } catch (e) {
     const msg = e instanceof Error ? e.message : 'Unknown error';
     await updateRunStatus(supabase, sessionId, agentName, 'failed', null, [], msg);
     return null;
   }
 }
 
 // ============================================================================
 // Agent 4: Scoring
 // ============================================================================
 async function runScoring(
   supabase: SupabaseClient,
   sessionId: string,
   profile: StartupProfile,
   market: MarketResearch | null,
   competitors: CompetitorAnalysis | null
 ): Promise<ScoringResult | null> {
   const agentName = 'ScoringAgent';
   await updateRunStatus(supabase, sessionId, agentName, 'running');
 
   const systemPrompt = `You are a startup evaluation expert. Score this startup across key dimensions.
 
 Return JSON with exactly these fields:
 {
   "overall_score": <0-100>,
   "verdict": "go|caution|no_go",
   "dimension_scores": {
     "problemClarity": <0-100>,
     "solutionStrength": <0-100>,
     "marketSize": <0-100>,
     "competition": <0-100>,
     "businessModel": <0-100>,
     "teamFit": <0-100>,
     "timing": <0-100>
   },
   "market_factors": [
     {"name": "Market Size", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"},
     {"name": "Growth Rate", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"},
     {"name": "Competition", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"},
     {"name": "Timing", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"}
   ],
   "execution_factors": [
     {"name": "Team", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"},
     {"name": "Product", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"},
     {"name": "Go-to-Market", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"},
     {"name": "Unit Economics", "score": <1-10>, "description": "...", "status": "strong|moderate|weak"}
   ],
   "highlights": ["Strength 1", "Strength 2", "Strength 3"],
   "red_flags": ["Risk 1", "Risk 2"],
   "risks_assumptions": ["Key assumption 1", "Key assumption 2", "Key risk 3"]
 }
 
 Score based on: 75+ = GO, 50-74 = CAUTION, <50 = NO-GO`;
 
   try {
     const { text } = await callGemini(
       AGENTS.scoring.model,
       systemPrompt,
       `Score this startup:
 Profile: ${JSON.stringify(profile)}
 Market Data: ${JSON.stringify(market || {})}
 Competitors: ${JSON.stringify(competitors || {})}`
     );
 
     const scoring = JSON.parse(text) as ScoringResult;
     await updateRunStatus(supabase, sessionId, agentName, 'ok', scoring);
     return scoring;
   } catch (e) {
     const msg = e instanceof Error ? e.message : 'Unknown error';
     await updateRunStatus(supabase, sessionId, agentName, 'failed', null, [], msg);
     return null;
   }
 }
 
 // ============================================================================
 // Agent 5: MVP Plan
 // ============================================================================
 async function runMVP(
   supabase: SupabaseClient,
   sessionId: string,
   profile: StartupProfile,
   scoring: ScoringResult
 ): Promise<MVPPlan | null> {
   const agentName = 'MVPAgent';
   await updateRunStatus(supabase, sessionId, agentName, 'running');
 
   const systemPrompt = `You are a product strategist. Create a practical MVP plan for this startup.
 
 Return JSON with exactly these fields:
 {
   "mvp_scope": "Clear description of minimum viable product scope (2-3 sentences)",
   "phases": [
     {
       "phase": 1,
       "name": "Phase name",
       "tasks": ["Task 1", "Task 2", "Task 3"]
     },
     {
       "phase": 2,
       "name": "Phase name",
       "tasks": ["Task 1", "Task 2"]
     },
     {
       "phase": 3,
       "name": "Phase name",
       "tasks": ["Task 1", "Task 2"]
     }
   ],
   "next_steps": [
     "Concrete next step 1",
     "Concrete next step 2",
     "Concrete next step 3",
     "Concrete next step 4",
     "Concrete next step 5",
     "Concrete next step 6",
     "Concrete next step 7"
   ]
 }
 
 Be specific and actionable. Focus on de-risking key assumptions first.`;
 
   try {
     const { text } = await callGemini(
       AGENTS.mvp.model,
       systemPrompt,
       `Create MVP plan for:
 Idea: ${profile.idea}
 Solution: ${profile.solution}
 Key risks: ${scoring.red_flags.join(', ')}
 Key assumptions: ${scoring.risks_assumptions.join(', ')}`
     );
 
     const plan = JSON.parse(text) as MVPPlan;
     await updateRunStatus(supabase, sessionId, agentName, 'ok', plan);
     return plan;
   } catch (e) {
     const msg = e instanceof Error ? e.message : 'Unknown error';
     await updateRunStatus(supabase, sessionId, agentName, 'failed', null, [], msg);
     return null;
   }
 }
 
 // ============================================================================
 // Agent 6: Composer
 // ============================================================================
 async function runComposer(
   supabase: SupabaseClient,
   sessionId: string,
   profile: StartupProfile | null,
   market: MarketResearch | null,
   competitors: CompetitorAnalysis | null,
   scoring: ScoringResult | null,
   mvp: MVPPlan | null
 ): Promise<ValidatorReport | null> {
   const agentName = 'ComposerAgent';
   await updateRunStatus(supabase, sessionId, agentName, 'running');
 
   const systemPrompt = `You are a report composer. Combine all agent outputs into a final validation report.
 
 Return JSON with EXACTLY these 8 sections:
 {
   "summary_verdict": "3-sentence executive summary with overall verdict and score",
   "problem_clarity": "Analysis of problem clarity, urgency, and customer pain (2-3 paragraphs)",
   "customer_use_case": "Clear description of target customer and use case (2-3 paragraphs)",
   "market_sizing": {
     "tam": <number>,
     "sam": <number>,
     "som": <number>,
     "citations": ["Source 1", "Source 2"]
   },
   "competition": {
     "competitors": [{"name": "...", "description": "...", "threat_level": "high|medium|low"}],
     "citations": ["Source 1", "Source 2"]
   },
   "risks_assumptions": ["Risk/assumption 1", "Risk/assumption 2", "Risk/assumption 3", "Risk/assumption 4", "Risk/assumption 5"],
   "mvp_scope": "Clear MVP scope description with key features",
   "next_steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6", "Step 7"]
 }
 
 Synthesize all inputs into a cohesive, actionable report.`;
 
   try {
     const { text } = await callGemini(
       AGENTS.composer.model,
       systemPrompt,
       `Compose final report from agent outputs:
 
 PROFILE: ${JSON.stringify(profile || {})}
 MARKET: ${JSON.stringify(market || {})}
 COMPETITORS: ${JSON.stringify(competitors || {})}
 SCORING: ${JSON.stringify(scoring || {})}
 MVP: ${JSON.stringify(mvp || {})}`
     );
 
     const report = JSON.parse(text) as ValidatorReport;
     await updateRunStatus(supabase, sessionId, agentName, 'ok', report);
     return report;
   } catch (e) {
     const msg = e instanceof Error ? e.message : 'Unknown error';
     await updateRunStatus(supabase, sessionId, agentName, 'failed', null, [], msg);
     return null;
   }
 }
 
 // ============================================================================
 // Agent 7: Verifier
 // ============================================================================
 async function runVerifier(
   supabase: SupabaseClient,
   sessionId: string,
   report: ValidatorReport | null,
   failedAgents: string[]
 ): Promise<VerificationResult> {
   const agentName = 'VerifierAgent';
   await updateRunStatus(supabase, sessionId, agentName, 'running');
 
   const requiredSections = [
     'summary_verdict',
     'problem_clarity',
     'customer_use_case',
     'market_sizing',
     'competition',
     'risks_assumptions',
     'mvp_scope',
     'next_steps',
   ];
 
   const missingSections: string[] = [];
   const warnings: string[] = [];
   const sectionMappings: Record<string, string> = {
     summary_verdict: 'ScoringAgent',
     problem_clarity: 'ExtractorAgent',
     customer_use_case: 'ExtractorAgent',
     market_sizing: 'ResearchAgent',
     competition: 'CompetitorAgent',
     risks_assumptions: 'ScoringAgent',
     mvp_scope: 'MVPAgent',
     next_steps: 'MVPAgent',
   };
 
   if (!report) {
     const result: VerificationResult = {
       verified: false,
       missing_sections: requiredSections,
       failed_agents: failedAgents,
       warnings: ['Report composition failed'],
       section_mappings: sectionMappings,
     };
     await updateRunStatus(supabase, sessionId, agentName, 'ok', result);
     return result;
   }
 
   // Check each section
   for (const section of requiredSections) {
     const value = report[section as keyof ValidatorReport];
     if (!value || (typeof value === 'string' && value.length < 10)) {
       missingSections.push(section);
     }
   }
 
   // Check citations exist for market and competition
   if (!report.market_sizing?.citations?.length) {
     warnings.push('Market sizing lacks citations - data may not be grounded');
   }
   if (!report.competition?.citations?.length) {
     warnings.push('Competition analysis lacks citations - data may not be grounded');
   }
 
   // Check next_steps has 7 items
   if (!report.next_steps || report.next_steps.length < 7) {
     warnings.push(`Only ${report.next_steps?.length || 0} next steps provided (expected 7)`);
   }
 
   const verified = missingSections.length === 0 && failedAgents.length === 0;
 
   const result: VerificationResult = {
     verified,
     missing_sections: missingSections,
     failed_agents: failedAgents,
     warnings,
     section_mappings: sectionMappings,
   };
 
   await updateRunStatus(supabase, sessionId, agentName, 'ok', result);
   return result;
 }