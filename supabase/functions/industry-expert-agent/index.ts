import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import { callGemini, callGeminiChat, extractJSON } from "../_shared/gemini.ts";

interface IndustryRequest {
  action: 'get_industry_context' | 'get_questions' | 'coach_answer' | 'validate_canvas' | 'pitch_feedback' | 'get_benchmarks' | 'analyze_competitors' | 'get_validation_history' | 'generate_validation_report';
  industry?: string;
  startup_id?: string;
  category?: string;
  stage?: string;
  context?: string;
  question_key?: string;
  answer?: string;
  canvas_data?: Record<string, unknown>;
  pitch_data?: Record<string, unknown>;
  limit?: number;
  report_type?: 'quick' | 'deep' | 'investor';
  validation_type?: 'quick' | 'deep' | 'investor';
  // Chat-to-validation context from ValidatorChat component
  chat_context?: {
    messages?: Array<{ role: string; content: string }>;
    extracted_data?: Record<string, string>;
    idea_description?: string;
  };
}

// Model configuration - using Gemini 3 Flash for speed
const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_PRO_MODEL = 'gemini-3-pro-preview';

// KNOW-P1-2: Migrated to _shared/gemini.ts (callGemini, callGeminiChat, extractJSON)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization');
    
    // deno-lint-ignore no-explicit-any
    const supabase: any = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('[industry-expert-agent] Auth error:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit expensive AI actions
    const EXPENSIVE_ACTIONS = [
      'coach_answer', 'validate_canvas', 'pitch_feedback',
      'analyze_competitors', 'generate_validation_report',
    ];

    const body: IndustryRequest = await req.json();
    const { action, industry, startup_id, category, stage = 'seed', context, question_key, answer, canvas_data, pitch_data, report_type, validation_type, chat_context } = body;

    if (EXPENSIVE_ACTIONS.includes(action)) {
      const rateResult = checkRateLimit(user.id, 'industry-expert-agent', RATE_LIMITS.standard);
      if (!rateResult.allowed) {
        console.warn(`[industry-expert-agent] Rate limit hit: user=${user.id}, action=${action}`);
        return rateLimitResponse(rateResult, corsHeaders);
      }
    }

    console.log(`[industry-expert-agent] Action: ${action}, Industry: ${industry}, User: ${user.id}`);

    // deno-lint-ignore no-explicit-any
    let result: Record<string, any> = {};

    switch (action) {
      case 'get_industry_context':
        result = await getIndustryContext(supabase, industry);
        break;

      case 'get_questions':
        result = await getQuestions(supabase, industry, category, stage, context);
        break;

      case 'coach_answer':
        result = await coachAnswer(supabase, industry, question_key, answer);
        break;

      case 'validate_canvas':
        result = await validateCanvas(supabase, industry, canvas_data);
        break;

      case 'pitch_feedback':
        result = await providePitchFeedback(supabase, industry, pitch_data);
        break;

      case 'get_benchmarks':
        result = await getBenchmarks(supabase, industry, stage);
        break;

      case 'analyze_competitors':
        result = await analyzeCompetitors(supabase, industry, startup_id);
        break;

      // Task 30: Add get_validation_history action
      case 'get_validation_history':
        result = await getValidationHistory(supabase, startup_id, body.limit);
        break;

      // Task 106: Generate full 14-section validation report
      case 'generate_validation_report':
        result = await generateValidationReport(supabase, startup_id, report_type || validation_type || 'quick', user.id, chat_context);
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Log AI run
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single();

    if (profile?.org_id) {
      await supabase.from('ai_runs').insert({
        user_id: user.id,
        org_id: profile.org_id,
        startup_id: startup_id || null,
        agent_name: 'IndustryExpert',
        action,
        model: action === 'coach_answer' || action === 'pitch_feedback' ? GEMINI_PRO_MODEL : GEMINI_MODEL,
        provider: 'gemini',
        status: 'completed',
      });
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[industry-expert-agent] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ============================================================================
// Action Handlers
// ============================================================================

// deno-lint-ignore no-explicit-any
async function getIndustryContext(supabase: any, industry?: string) {
  if (!industry) {
    // Return all active industry packs
    const { data: packs, error } = await supabase
      .from('industry_packs')
      .select('industry, display_name, description, icon, startup_types, is_active')
      .eq('is_active', true)
      .order('display_name');

    if (error) throw error;
    return { packs };
  }

  // Use the database function for full context
  const { data, error } = await supabase
    .rpc('get_industry_ai_context', { p_industry: industry });

  if (error) throw error;
  return { context: data };
}

// deno-lint-ignore no-explicit-any
async function getQuestions(
  supabase: any,
  industry?: string,
  category?: string,
  stage?: string,
  context?: string
) {
  if (!industry) {
    return { error: 'Industry is required' };
  }

  // Use the database function
  const { data: questions, error } = await supabase
    .rpc('get_industry_questions', {
      p_industry: industry,
      p_context: context || 'onboarding',
      p_stage: stage || 'seed'
    });

  if (error) throw error;

  // Filter by category if provided
  // deno-lint-ignore no-explicit-any
  let filtered: any[] = questions || [];
  if (category) {
    // deno-lint-ignore no-explicit-any
    filtered = filtered.filter((q: any) => q.category === category);
  }

  // deno-lint-ignore no-explicit-any
  const allCategories = questions?.map((q: any) => q.category) || [];

  return {
    questions: filtered,
    count: filtered.length,
    categories: [...new Set(allCategories)]
  };
}

// deno-lint-ignore no-explicit-any
async function coachAnswer(
  supabase: any,
  industry?: string,
  questionKey?: string,
  answer?: string
) {
  if (!industry || !questionKey || !answer) {
    return { error: 'Industry, question_key, and answer are required' };
  }

  // Get industry context for persona
  const { data: packData } = await supabase
    .rpc('get_industry_ai_context', { p_industry: industry });

  // deno-lint-ignore no-explicit-any
  const pack = packData as Record<string, any> | null;

  // Get the specific question
  const { data: questions } = await supabase
    .from('industry_questions')
    .select('*, pack:industry_packs!inner(industry)')
    .eq('question_key', questionKey)
    .eq('pack.industry', industry)
    .single();

  if (!questions) {
    return { error: 'Question not found' };
  }


  const systemPrompt = `You are an expert ${pack?.advisor_persona || 'startup advisor'} for the ${pack?.display_name || industry} industry.

${pack?.advisor_system_prompt || 'Help founders build successful startups.'}

Your role is to coach the founder on their answer to this question:
Question: ${questions.question}
Why it matters: ${questions.why_this_matters}
Thinking prompt: ${questions.thinking_prompt}

Quality criteria: ${JSON.stringify(questions.quality_criteria || {})}
Red flags: ${JSON.stringify(questions.red_flags || [])}

Provide coaching feedback that:
1. Acknowledges what's good about their answer
2. Identifies gaps or areas for improvement
3. Asks a follow-up question to deepen their thinking
4. Uses industry-specific examples when helpful

Keep your response concise (2-3 paragraphs max).`;

  const chatResult = await callGeminiChat(
    GEMINI_PRO_MODEL,
    systemPrompt,
    [{ role: 'user', content: `My answer: ${answer}` }],
    { maxOutputTokens: 1024, timeoutMs: 25_000 },
  );
  const coaching = chatResult.text;

  return {
    coaching,
    question: questions.question,
    outputs_to: questions.outputs_to,
  };
}

// deno-lint-ignore no-explicit-any
async function validateCanvas(
  supabase: any,
  industry?: string,
  canvasData?: Record<string, unknown>
) {
  if (!industry || !canvasData) {
    return { error: 'Industry and canvas_data are required' };
  }

  const { data: packData } = await supabase
    .rpc('get_industry_ai_context', { p_industry: industry });

  // deno-lint-ignore no-explicit-any
  const pack = packData as Record<string, any> | null;


  const systemPrompt = `You are an expert ${pack?.advisor_persona || 'startup advisor'} for the ${pack?.display_name || industry} industry.

Industry benchmarks: ${JSON.stringify(pack?.benchmarks || {})}
Common mistakes in this industry: ${JSON.stringify(pack?.common_mistakes || [])}
Success stories: ${JSON.stringify(pack?.success_stories || [])}

Validate this Lean Canvas and provide specific, actionable feedback for each section.
Score each section 1-10 and explain why.

Return JSON:
{
  "overall_score": number,
  "sections": {
    "problem": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "solution": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "unique_value": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "customer_segments": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "channels": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "revenue_streams": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "cost_structure": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "key_metrics": { "score": number, "feedback": "...", "suggestions": ["..."] },
    "unfair_advantage": { "score": number, "feedback": "...", "suggestions": ["..."] }
  },
  "industry_specific_insights": ["..."],
  "recommended_next_steps": ["..."]
}`;

  const result = await callGemini(
    GEMINI_PRO_MODEL,
    systemPrompt,
    `Lean Canvas data:\n${JSON.stringify(canvasData, null, 2)}`,
    { useSearch: true, maxOutputTokens: 2048, timeoutMs: 25_000 },
  );

  const validation = extractJSON<Record<string, unknown>>(result.text);
  return { validation: validation || { error: 'Failed to parse validation', raw: result.text } };
}

// deno-lint-ignore no-explicit-any
async function providePitchFeedback(
  supabase: any,
  industry?: string,
  pitchData?: Record<string, unknown>
) {
  if (!industry || !pitchData) {
    return { error: 'Industry and pitch_data are required' };
  }

  const { data: packData } = await supabase
    .rpc('get_industry_ai_context', { p_industry: industry });

  // deno-lint-ignore no-explicit-any
  const pack = packData as Record<string, any> | null;


  const systemPrompt = `You are a ${pack?.display_name || industry} investor evaluating a pitch deck.

Investor expectations for this industry: ${JSON.stringify(pack?.investor_expectations || {})}
Benchmarks: ${JSON.stringify(pack?.benchmarks || {})}

Review this pitch deck and provide feedback as an investor would.
Score 1-100 and give specific, actionable feedback per slide.

Return JSON:
{
  "overall_score": number,
  "investment_readiness": "not_ready" | "early" | "promising" | "investor_ready",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "critical_gaps": ["..."],
  "slide_feedback": [
    { "slide_type": "...", "score": number, "feedback": "...", "improvement": "..." }
  ],
  "investor_questions": ["Questions investors will likely ask"],
  "next_steps": ["..."]
}`;

  const result = await callGemini(
    GEMINI_PRO_MODEL,
    systemPrompt,
    `Pitch deck data:\n${JSON.stringify(pitchData, null, 2)}`,
    { maxOutputTokens: 2048, timeoutMs: 25_000 },
  );

  const feedback = extractJSON<Record<string, unknown>>(result.text);
  return { feedback: feedback || { error: 'Failed to parse feedback', raw: result.text } };
}

// deno-lint-ignore no-explicit-any
async function getBenchmarks(
  supabase: any,
  industry?: string,
  stage?: string
) {
  if (!industry) {
    return { error: 'Industry is required' };
  }

  const { data: pack, error } = await supabase
    .from('industry_packs')
    .select('benchmarks, terminology, competitive_intel, market_context')
    .eq('industry', industry)
    .eq('is_active', true)
    .single();

  if (error) throw error;

  return {
    benchmarks: pack?.benchmarks || {},
    terminology: pack?.terminology || [],
    competitive_intel: pack?.competitive_intel || {},
    market_context: pack?.market_context || {},
    stage: stage || 'seed'
  };
}

// deno-lint-ignore no-explicit-any
async function analyzeCompetitors(
  supabase: any,
  industry?: string,
  startupId?: string
) {
  if (!industry) {
    return { error: 'Industry is required' };
  }

  // Get industry competitive intel
  const { data: pack } = await supabase
    .from('industry_packs')
    .select('competitive_intel, benchmarks')
    .eq('industry', industry)
    .eq('is_active', true)
    .single();

  // Get startup data if provided
  // deno-lint-ignore no-explicit-any
  let startupData: any = null;
  if (startupId) {
    const { data } = await supabase
      .from('startups')
      .select('name, description, key_features, competitors')
      .eq('id', startupId)
      .single();
    startupData = data;
  }


  const systemPrompt = `You are a competitive intelligence analyst specializing in the ${industry} industry.

Known players in this space: ${JSON.stringify(pack?.competitive_intel || {})}
Industry benchmarks: ${JSON.stringify(pack?.benchmarks || {})}

${startupData ? `Analyze competitors for: ${startupData.name}\nDescription: ${startupData.description}\nFeatures: ${JSON.stringify(startupData.key_features)}` : 'Provide general competitive landscape analysis.'}

Return JSON:
{
  "direct_competitors": [
    { "name": "...", "description": "...", "strengths": ["..."], "weaknesses": ["..."], "pricing": "...", "target_segment": "..." }
  ],
  "indirect_competitors": [
    { "name": "...", "how_they_compete": "..." }
  ],
  "market_gaps": ["Opportunities not addressed by competitors"],
  "differentiation_opportunities": ["How to stand out"],
  "competitive_moat_suggestions": ["..."]
}`;

  const result = await callGemini(
    GEMINI_MODEL,
    systemPrompt,
    'Analyze the competitive landscape.',
    { useSearch: true, maxOutputTokens: 2048, timeoutMs: 25_000 },
  );

  const analysis = extractJSON<Record<string, unknown>>(result.text);
  return { analysis: analysis || { error: 'Failed to parse analysis', raw: result.text } };
}

// Task 30: Get validation history for a startup
// deno-lint-ignore no-explicit-any
async function getValidationHistory(
  supabase: any,
  startupId?: string,
  limit: number = 10
) {
  if (!startupId) {
    return { error: 'startup_id is required' };
  }

  // Query validation reports
  const { data: reports, error } = await supabase
    .from('validator_reports')
    .select('id, created_at, report_type, score, summary')
    .eq('run_id', startupId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[industry-expert-agent] Error fetching validation history:', error);
    // Fallback to ai_runs if validation_reports doesn't exist
    const { data: runs, error: runsError } = await supabase
      .from('ai_runs')
      .select('id, created_at, request_metadata, response_metadata, action')
      .eq('startup_id', startupId)
      .in('action', ['validate_canvas', 'generate_validation_report'])
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (runsError) throw runsError;
    
    // deno-lint-ignore no-explicit-any
    const history = (runs || []).map((run: any) => ({
      id: run.id,
      validation_type: run.request_metadata?.report_type || 'quick',
      score: run.response_metadata?.overall_score ?? 0,
      created_at: run.created_at,
    }));
    
    return { history };
  }

  // deno-lint-ignore no-explicit-any
  const history = (reports || []).map((r: any) => ({
    id: r.id,
    validation_type: r.report_type || 'quick',
    score: r.score || 0,
    created_at: r.created_at,
  }));

  return { history };
}

// Task 106: Generate full 14-section validation report
// deno-lint-ignore no-explicit-any
async function generateValidationReport(
  supabase: any,
  startupId?: string,
  reportType: 'quick' | 'deep' | 'investor' = 'quick',
  userId?: string,
  chatContext?: { messages?: Array<{ role: string; content: string }>; extracted_data?: Record<string, string>; idea_description?: string }
) {
  if (!startupId) {
    return { error: 'startup_id is required' };
  }

  const startTime = Date.now();

  // Get startup data
  const { data: startup, error: startupError } = await supabase
    .from('startups')
    .select('*')
    .eq('id', startupId)
    .single();

  if (startupError || !startup) {
    return { error: 'Startup not found' };
  }

  // Get industry context
  const { data: packData } = await supabase
    .rpc('get_industry_ai_context', { p_industry: startup.industry || 'saas' });

  // deno-lint-ignore no-explicit-any
  const pack = packData as Record<string, any> | null;


  // Build comprehensive startup context - merge with chat data if available
  const startupContext = {
    name: startup.name,
    description: chatContext?.idea_description || startup.description,
    industry: startup.industry,
    stage: startup.stage,
    problem: chatContext?.extracted_data?.idea || startup.problem,
    solution: startup.solution,
    unique_value: chatContext?.extracted_data?.differentiation || startup.unique_value,
    customer_segments: chatContext?.extracted_data?.customer || startup.customer_segments,
    channels: startup.channels,
    revenue_streams: startup.revenue_streams,
    key_metrics: startup.key_metrics,
    unfair_advantage: startup.unfair_advantage,
    team_size: startup.team_size,
    website: startup.website,
    founding_date: startup.founding_date,
    existing_alternatives: chatContext?.extracted_data?.alternatives || null,
    validation_evidence: chatContext?.extracted_data?.validation || null,
  };

  // Include chat transcript for richer context
  const chatTranscript = chatContext?.messages?.map(m => `${m.role}: ${m.content}`).join('\n\n') || '';

  const systemPrompt = `You are a ${reportType === 'investor' ? 'venture capital analyst' : 'expert startup advisor'} for the ${pack?.display_name || startup.industry || 'technology'} industry.

${reportType === 'investor' ? 'Evaluate this startup as if you are a VC doing due diligence.' : 'Help the founder understand their startup\'s strengths and weaknesses.'}

Industry benchmarks: ${JSON.stringify(pack?.benchmarks || {})}
Common mistakes: ${JSON.stringify(pack?.common_mistakes || [])}
Success patterns: ${JSON.stringify(pack?.success_stories || [])}
Investor expectations: ${JSON.stringify(pack?.investor_expectations || {})}

Generate a comprehensive ${reportType === 'quick' ? '5-section' : '14-section'} validation report.

Return JSON with this exact structure:
{
  "overall_score": <number 0-100>,
  "verdict": "<go|caution|no_go>",
  "executive_summary": "<2-3 sentence summary>",
  "dimension_scores": {
    "problemClarity": <0-100>,
    "solutionStrength": <0-100>,
    "marketSize": <0-100>,
    "competition": <0-100>,
    "businessModel": <0-100>,
    "teamFit": <0-100>,
    "timing": <0-100>
  },
  "market_sizing": {
    "tam": <number in USD>,
    "sam": <number in USD>,
    "som": <number in USD>,
    "methodology": "<brief methodology>",
    "growth_rate": <annual growth percentage>
  },
  "highlights": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "red_flags": ["<concern 1>", "<concern 2>"],
  "market_factors": [
    {"name": "Market Size", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"},
    {"name": "Growth Rate", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"},
    {"name": "Competition", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"},
    {"name": "Timing", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"}
  ],
  "execution_factors": [
    {"name": "Team", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"},
    {"name": "Product", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"},
    {"name": "Go-to-Market", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"},
    {"name": "Unit Economics", "score": <1-10>, "description": "<detail>", "status": "<strong|moderate|weak>"}
  ],
  "sections": [
    {"number": 1, "title": "Executive Summary", "content": "<markdown content>", "score": null},
    {"number": 2, "title": "Problem Analysis", "content": "<markdown content>", "score": <1-10>},
    {"number": 3, "title": "Solution Assessment", "content": "<markdown content>", "score": <1-10>},
    {"number": 4, "title": "Market Size", "content": "<markdown content>", "score": <1-10>},
    {"number": 5, "title": "Competition", "content": "<markdown content>", "score": <1-10>},
    {"number": 6, "title": "Business Model", "content": "<markdown content>", "score": <1-10>},
    {"number": 7, "title": "Go-to-Market", "content": "<markdown content>", "score": <1-10>},
    {"number": 8, "title": "Team Assessment", "content": "<markdown content>", "score": <1-10>},
    {"number": 9, "title": "Timing Analysis", "content": "<markdown content>", "score": <1-10>},
    {"number": 10, "title": "Risk Assessment", "content": "<markdown content>", "score": <1-10>},
    {"number": 11, "title": "Financial Projections", "content": "<markdown content>", "score": <1-10>},
    {"number": 12, "title": "Validation Status", "content": "<markdown content>", "score": <1-10>},
    {"number": 13, "title": "Recommendations", "content": "<markdown content>", "score": null},
    {"number": 14, "title": "Appendix", "content": "<sources and methodology>", "score": null}
  ],
  "benchmarks": {
    "industry": "${startup.industry || 'Technology'}",
    "average_score": 65,
    "top_performers": 85,
    "percentile": <calculated percentile>
  }
}

Be specific, data-driven, and actionable. Use industry-specific terminology and benchmarks.`;

  const userPrompt = chatTranscript 
    ? `Generate a ${reportType} validation report for this startup based on the founder's own description:\n\n**Chat Transcript:**\n${chatTranscript}\n\n**Startup Profile:**\n${JSON.stringify(startupContext, null, 2)}`
    : `Generate a ${reportType} validation report for this startup:\n${JSON.stringify(startupContext, null, 2)}`;

  // Use Gemini 3 with Google Search grounding for real-time market data
  const result = await callGemini(
    GEMINI_PRO_MODEL,
    systemPrompt,
    userPrompt,
    { useSearch: true, maxOutputTokens: 8192, timeoutMs: 40_000 },
  );
  const resultText = result.text;

  const generationTime = Date.now() - startTime;

  try {
    const report = JSON.parse(resultText);

    // Save report to database
    const { data: savedReport, error: saveError } = await supabase
      .from('validator_reports')
      .insert({
        run_id: startupId,
        report_type: reportType,
        score: report.overall_score,
        summary: report.executive_summary,
        details: report,
        key_findings: [...(report.highlights || []), ...(report.red_flags || [])],
      })
      .select()
      .single();

    if (saveError) {
      console.error('[industry-expert-agent] Error saving report:', saveError);
    }

    return {
      report: {
        id: savedReport?.id || crypto.randomUUID(),
        ...report,
        report_type: reportType,
        generation_time_ms: generationTime,
        created_at: new Date().toISOString(),
      }
    };
  } catch (parseError) {
    console.error('[industry-expert-agent] Parse error:', parseError, 'Raw:', resultText);
    return { 
      error: 'Failed to parse report',
      raw: resultText.substring(0, 500)
    };
  }
}
