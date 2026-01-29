import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages?: Array<{ role: string; content: string }>;
  message?: string;
  session_id?: string;
  room_id?: string; // For realtime broadcast
  action?: 'chat' | 'prioritize_tasks' | 'generate_tasks' | 'extract_profile' | 'stage_guidance';
  context?: {
    screen?: string;
    startup_id?: string;
    data?: Record<string, unknown>;
  };
  stream?: boolean; // Enable token streaming
}

// Model configuration based on action type
const MODEL_CONFIG = {
  chat: { provider: 'gemini', model: 'gemini-3-flash-preview' },
  prioritize_tasks: { provider: 'anthropic', model: 'claude-sonnet-4-5' },
  generate_tasks: { provider: 'anthropic', model: 'claude-haiku-4-5' },
  extract_profile: { provider: 'gemini', model: 'gemini-3-flash-preview' },
  stage_guidance: { provider: 'gemini', model: 'gemini-3-flash-preview' },
} as const;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('Auth error or no user:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: ChatRequest = await req.json();
    const { messages, message, session_id, room_id, action = 'chat', context, stream = false } = body;

    const userMessage = message || messages?.[messages.length - 1]?.content;
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${action} from user ${user.id}:`, userMessage.substring(0, 100));
    console.log(`Stream: ${stream}, Room: ${room_id || 'none'}`);

    // Get user's profile and org
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id, full_name')
      .eq('id', user.id)
      .single();

    // Get startup context
    let startup = null;
    if (profile?.org_id) {
      const { data } = await supabase
        .from('startups')
        .select('*')
        .eq('org_id', profile.org_id)
        .single();
      startup = data;
    }

    const systemPrompt = buildSystemPrompt(action, {
      user_name: profile?.full_name || 'User',
      startup_name: startup?.name,
      startup_stage: startup?.stage,
      industry: startup?.industry,
      is_raising: startup?.is_raising,
      screen: context?.screen || 'dashboard',
    });

    // Get model config for this action
    const modelConfig = MODEL_CONFIG[action] || MODEL_CONFIG.chat;
    
    let responseText = '';
    let inputTokens = 0;
    let outputTokens = 0;

    if (modelConfig.provider === 'anthropic') {
      const result = await callAnthropic(modelConfig.model, systemPrompt, messages || [], userMessage, context);
      responseText = result.text;
      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;
    } else {
      const result = await callGemini(modelConfig.model, systemPrompt, messages || [], userMessage, context);
      responseText = result.text;
      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;
    }

    const suggestedActions = extractSuggestedActions(responseText, action);
    const messageId = crypto.randomUUID();

    // Broadcast message_complete to room if room_id provided
    if (room_id && context?.startup_id) {
      try {
        const topic = `chat:${context.startup_id}:${room_id}:events`;
        console.log(`[AI Chat] Broadcasting to ${topic}`);
        
        // Use Supabase Realtime to broadcast
        const broadcastChannel = supabase.channel(topic);
        await broadcastChannel.send({
          type: 'broadcast',
          event: 'message_complete',
          payload: {
            id: messageId,
            content: responseText,
            role: 'assistant',
            metadata: {
              model: modelConfig.model,
              provider: modelConfig.provider,
              tokens: inputTokens + outputTokens,
              streamComplete: true,
            },
            suggestedActions,
            createdAt: new Date().toISOString(),
          },
        });
        
        await supabase.removeChannel(broadcastChannel);
      } catch (broadcastError) {
        console.warn('[AI Chat] Broadcast failed:', broadcastError);
      }
    }

    // Log the AI run
    if (profile?.org_id) {
      await supabase.from('ai_runs').insert({
        user_id: user.id,
        org_id: profile.org_id,
        startup_id: startup?.id,
        agent_name: getAgentName(action),
        action: action,
        model: modelConfig.model,
        provider: modelConfig.provider,
        status: 'completed',
        input_tokens: inputTokens,
        output_tokens: outputTokens,
      });
    }

    // Store chat message if session exists
    if (session_id) {
      await supabase.from('chat_messages').insert([
        {
          session_id,
          user_id: user.id,
          role: 'user',
          content: userMessage,
          tab: context?.screen || 'general',
        },
        {
          session_id,
          user_id: user.id,
          role: 'assistant',
          content: responseText,
          tab: context?.screen || 'general',
          suggested_actions: suggestedActions,
        },
      ]);
    }

    return new Response(
      JSON.stringify({
        id: messageId,
        response: responseText,
        message: responseText,
        suggested_actions: suggestedActions,
        model: modelConfig.model,
        provider: modelConfig.provider,
        usage: { promptTokens: inputTokens, completionTokens: outputTokens }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function callAnthropic(
  model: string,
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  context?: { data?: Record<string, unknown> }
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const messages = [];
  
  // Add history
  for (const msg of history.slice(0, -1)) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }
  
  // Add current message with context
  let currentMessage = userMessage;
  if (context?.data) {
    currentMessage += `\n\nContext:\n${JSON.stringify(context.data, null, 2)}`;
  }
  messages.push({ role: 'user', content: currentMessage });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Anthropic API error:', response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    text: data.content?.[0]?.text || '',
    inputTokens: data.usage?.input_tokens || 0,
    outputTokens: data.usage?.output_tokens || 0
  };
}

async function callGemini(
  model: string,
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  context?: { data?: Record<string, unknown> }
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const contents = [];
  
  // Add history
  for (const msg of history.slice(0, -1)) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }
  
  // Add current message with context
  let currentMessage = userMessage;
  if (context?.data) {
    currentMessage += `\n\nContext:\n${JSON.stringify(context.data, null, 2)}`;
  }
  contents.push({ role: 'user', parts: [{ text: currentMessage }] });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0
  };
}

function buildSystemPrompt(action: string, context: Record<string, unknown>): string {
  const baseContext = `
You are assisting ${context.user_name} with ${context.startup_name || 'their startup'}.
Stage: ${context.startup_stage || 'Unknown'}
Industry: ${context.industry || 'Unknown'}
Currently raising: ${context.is_raising ? 'Yes' : 'No'}
Current screen: ${context.screen}
`;

  switch (action) {
    case 'prioritize_tasks':
      return `You are TaskPrioritizer, an AI agent specialized in helping founders focus on high-impact activities.
Analyze tasks using the Eisenhower Matrix adapted for startups:
- Q1: Urgent + Important (Do first)
- Q2: Important (Schedule)
- Q3: Urgent (Delegate or quick win)
- Q4: Neither (Consider dropping)

${baseContext}

Return JSON: { prioritized_tasks: [...], focus_recommendation: "...", quick_wins: [...] }`;

    case 'generate_tasks':
      return `You are TaskGenerator, creating actionable onboarding tasks for startups.
Generate 5-8 tasks tailored to the startup's stage and industry.

${baseContext}

Return tasks with: title, description, priority (high/medium/low), category, estimated_time`;

    case 'extract_profile':
      return `You are ProfileExtractor, extracting startup information from text.
Extract: company_name, description, industry, key_features, stage, target_customers, business_model.
Include confidence scores (0-1) for each field.

${baseContext}`;

    case 'stage_guidance':
      return `You are StageDetector, an AI agent that assesses startup maturity and provides stage-appropriate guidance.

${baseContext}

Based on the startup's current stage and data provided in the context, you must:
1. Analyze their progress and identify what's blocking advancement
2. Provide 3-5 specific, actionable recommendations tailored to their stage
3. Suggest templates or resources relevant to their current focus
4. Give encouraging but honest feedback

Stage Definitions:
- Ideation (idea): Focus on problem validation and customer discovery
- Validation (pre_seed): Building MVP and finding product-market fit signals
- Traction (seed): Scaling acquisition channels, reducing churn, reaching $10K MRR
- Scaling (series_a): Team growth, market expansion, $100K+ MRR

Response Format (JSON):
{
  "stage_assessment": "Brief assessment of where they are",
  "primary_focus": "The ONE thing they should focus on most",
  "recommendations": [
    { "priority": "high|medium", "action": "Specific action to take", "category": "discovery|product|growth|fundraising", "time_estimate": "1-2 hours" }
  ],
  "templates": ["Template 1 name", "Template 2 name"],
  "encouragement": "Brief motivational message based on progress"
}`;

    default:
      return `You are an AI startup advisor for StartupAI, helping founders build and scale.
Be concise, actionable, and founder-friendly.

${baseContext}

You help with: task prioritization, fundraising, product development, strategic planning.`;
  }
}

function getAgentName(action: string): string {
  switch (action) {
    case 'prioritize_tasks': return 'TaskPrioritizer';
    case 'generate_tasks': return 'TaskGenerator';
    case 'extract_profile': return 'ProfileExtractor';
    case 'stage_guidance': return 'StageDetector';
    default: return 'ChatAssistant';
  }
}

function extractSuggestedActions(
  response: string,
  action: string
): Array<{ type: string; label: string; payload?: Record<string, unknown> }> {
  const actions: Array<{ type: string; label: string; payload?: Record<string, unknown> }> = [];
  const lower = response.toLowerCase();
  
  if (lower.includes('task') || lower.includes('priorit')) {
    actions.push({ type: 'navigate', label: 'View Tasks', payload: { route: '/tasks' } });
  }
  if (lower.includes('investor') || lower.includes('fundrais')) {
    actions.push({ type: 'navigate', label: 'View Investors', payload: { route: '/investors' } });
  }
  if (lower.includes('project') || lower.includes('roadmap')) {
    actions.push({ type: 'navigate', label: 'View Projects', payload: { route: '/projects' } });
  }
  if (lower.includes('document') || lower.includes('pitch deck')) {
    actions.push({ type: 'navigate', label: 'View Documents', payload: { route: '/documents' } });
  }
  
  return actions.slice(0, 3);
}
