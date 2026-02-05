import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IndustryRequest {
  action: 'get_industry_context' | 'get_questions' | 'coach_answer' | 'validate_canvas' | 'pitch_feedback' | 'get_benchmarks' | 'analyze_competitors';
  industry?: string;
  startup_id?: string;
  category?: string;
  stage?: string;
  context?: string;
  question_key?: string;
  answer?: string;
  canvas_data?: Record<string, unknown>;
  pitch_data?: Record<string, unknown>;
}

// Model configuration - using Gemini 3 Flash for speed
const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_PRO_MODEL = 'gemini-3-pro-preview';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    const body: IndustryRequest = await req.json();
    const { action, industry, startup_id, category, stage = 'seed', context, question_key, answer, canvas_data, pitch_data } = body;

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

  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_PRO_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `My answer: ${answer}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[industry-expert-agent] Gemini error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const coaching = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

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

  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_PRO_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `Lean Canvas data:\n${JSON.stringify(canvasData, null, 2)}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  try {
    const validation = JSON.parse(resultText);
    return { validation };
  } catch {
    return { validation: { error: 'Failed to parse validation', raw: resultText } };
  }
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

  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_PRO_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `Pitch deck data:\n${JSON.stringify(pitchData, null, 2)}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  try {
    const feedback = JSON.parse(resultText);
    return { feedback };
  } catch {
    return { feedback: { error: 'Failed to parse feedback', raw: resultText } };
  }
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

  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Analyze the competitive landscape.' }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
        tools: [{ googleSearch: {} }]
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  try {
    const analysis = JSON.parse(resultText);
    return { analysis };
  } catch {
    return { analysis: { error: 'Failed to parse analysis', raw: resultText } };
  }
}
