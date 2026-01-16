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
  action?: 'chat' | 'prioritize_tasks' | 'generate_tasks' | 'extract_profile';
  context?: {
    screen?: string;
    startup_id?: string;
    data?: Record<string, unknown>;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get authorization header for user context
    const authHeader = req.headers.get('Authorization');
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('Auth error or no user:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: ChatRequest = await req.json();
    const { messages, message, session_id, action = 'chat', context } = body;

    // Support both single message and messages array
    const userMessage = message || messages?.[messages.length - 1]?.content;
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${action} from user ${user.id}:`, userMessage.substring(0, 100));

    // Get user's profile and org
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id, full_name')
      .eq('id', user.id)
      .single();

    // Get startup context if available
    let startup = null;
    if (context?.startup_id || profile?.org_id) {
      const { data } = await supabase
        .from('startups')
        .select('*')
        .eq('org_id', profile?.org_id)
        .single();
      startup = data;
    }

    // Build system prompt based on action type
    let systemPrompt = buildSystemPrompt(action, {
      user_name: profile?.full_name || 'User',
      startup_name: startup?.name,
      startup_stage: startup?.stage,
      industry: startup?.industry,
      is_raising: startup?.is_raising,
      screen: context?.screen || 'dashboard',
    });

    // Build conversation history for Gemini
    const geminiContents = [];
    
    // Add previous messages if provided
    if (messages && messages.length > 1) {
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        geminiContents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }
    
    // Add current message with context
    let currentMessageText = userMessage;
    if (context?.data) {
      currentMessageText += `\n\nContext:\n${JSON.stringify(context.data, null, 2)}`;
    }
    geminiContents.push({
      role: 'user',
      parts: [{ text: currentMessageText }]
    });

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      
      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse suggested actions from response if present
    const suggestedActions = extractSuggestedActions(responseText, action);

    // Log the AI run
    if (profile?.org_id) {
      await supabase.from('ai_runs').insert({
        user_id: user.id,
        org_id: profile.org_id,
        startup_id: startup?.id,
        agent_name: getAgentName(action),
        action: action,
        model: 'gemini-2.0-flash',
        status: 'completed',
        input_tokens: geminiData.usageMetadata?.promptTokenCount || 0,
        output_tokens: geminiData.usageMetadata?.candidatesTokenCount || 0,
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
        response: responseText,
        message: responseText, // Alias for compatibility
        suggested_actions: suggestedActions,
        usage: {
          promptTokens: geminiData.usageMetadata?.promptTokenCount || 0,
          completionTokens: geminiData.usageMetadata?.candidatesTokenCount || 0,
        }
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

function buildSystemPrompt(
  action: string,
  context: Record<string, unknown>
): string {
  const baseContext = `
You are assisting ${context.user_name} with ${context.startup_name || 'their startup'}.
Stage: ${context.startup_stage || 'Unknown'}
Industry: ${context.industry || 'Unknown'}
Currently raising: ${context.is_raising ? 'Yes' : 'No'}
Current screen: ${context.screen}
`;

  switch (action) {
    case 'prioritize_tasks':
      return `You are TaskPrioritizer, an AI agent specialized in helping founders focus their limited time on the highest-impact activities.
Analyze tasks and return them ranked by urgency, importance, and strategic alignment.
Use the Eisenhower Matrix adapted for startups:
- Q1: Urgent + Important (Do first)
- Q2: Important (Schedule)
- Q3: Urgent (Delegate or quick win)
- Q4: Neither (Consider dropping)

${baseContext}

Return a JSON object with:
- prioritized_tasks: Array of tasks with rank, urgency_score, impact_score, reasoning
- focus_recommendation: What to work on right now
- quick_wins: Tasks under 30 minutes`;

    case 'generate_tasks':
      return `You are TaskGenerator, an AI agent that creates relevant, actionable onboarding tasks for startups.
Generate 5-8 tasks tailored to the startup's stage and industry.
Each task should be specific, achievable, and move the startup forward.

${baseContext}

Return tasks with: title, description, priority (high/medium/low), category, estimated_time`;

    case 'extract_profile':
      return `You are ProfileExtractor, an AI agent that extracts startup information from provided text or context.
Extract: company_name, description, industry, key_features, stage, target_customers, business_model.
Include confidence scores (0-1) for each field.

${baseContext}`;

    default:
      return `You are an AI startup advisor for StartupAI, helping founders build and scale their companies.
Be concise, actionable, and founder-friendly. Focus on practical advice.

${baseContext}

You can help with:
- Task prioritization and focus
- Fundraising strategy and investor relations
- Product development and go-to-market
- Strategic planning and growth

When appropriate, suggest specific actions the user can take.`;
  }
}

function getAgentName(action: string): string {
  switch (action) {
    case 'prioritize_tasks': return 'TaskPrioritizer';
    case 'generate_tasks': return 'TaskGenerator';
    case 'extract_profile': return 'ProfileExtractor';
    default: return 'ChatAssistant';
  }
}

function extractSuggestedActions(
  response: string,
  action: string
): Array<{ type: string; label: string; payload?: Record<string, unknown> }> {
  // Simple heuristic-based action extraction
  const actions: Array<{ type: string; label: string; payload?: Record<string, unknown> }> = [];
  
  const lowerResponse = response.toLowerCase();
  
  if (lowerResponse.includes('task') || lowerResponse.includes('priorit')) {
    actions.push({ type: 'navigate', label: 'View Tasks', payload: { route: '/tasks' } });
  }
  
  if (lowerResponse.includes('investor') || lowerResponse.includes('fundrais')) {
    actions.push({ type: 'navigate', label: 'View Investors', payload: { route: '/investors' } });
  }
  
  if (lowerResponse.includes('project') || lowerResponse.includes('roadmap')) {
    actions.push({ type: 'navigate', label: 'View Projects', payload: { route: '/projects' } });
  }
  
  if (lowerResponse.includes('document') || lowerResponse.includes('pitch deck')) {
    actions.push({ type: 'navigate', label: 'View Documents', payload: { route: '/documents' } });
  }
  
  return actions.slice(0, 3); // Max 3 actions
}
