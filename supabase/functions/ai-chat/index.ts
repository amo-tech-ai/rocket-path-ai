import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCoachMode, getWelcomeMessage } from "./coach/index.ts";
import { getRAGContext } from "./rag.ts";
import { corsHeaders, getCorsHeaders, handleCors } from '../_shared/cors.ts';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '../_shared/rate-limit.ts';

// OpenAI Embeddings API
const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";

interface ChatRequest {
  messages?: Array<{ role: string; content: string }>;
  message?: string;
  session_id?: string;
  room_id?: string;
  mode?: 'public' | 'authenticated' | 'coach';
  action?: 'chat' | 'prioritize_tasks' | 'generate_tasks' | 'extract_profile' | 'stage_guidance' | 'coach' | 'search_knowledge';
  startupId?: string;
  query?: string;
  matchThreshold?: number;
  matchCount?: number;
  category?: string;
  context?: {
    screen?: string;
    startup_id?: string;
    is_public?: boolean;
    data?: Record<string, unknown>;
  };
  stream?: boolean;
}

// Model configuration based on action type
const MODEL_CONFIG = {
  chat: { provider: 'gemini', model: 'gemini-3-flash-preview' },
  public_chat: { provider: 'gemini', model: 'gemini-3-flash-preview' },
  prioritize_tasks: { provider: 'anthropic', model: 'claude-sonnet-4-5-20250929' },
  generate_tasks: { provider: 'anthropic', model: 'claude-haiku-4-5-20251001' },
  extract_profile: { provider: 'gemini', model: 'gemini-3-flash-preview' },
  stage_guidance: { provider: 'gemini', model: 'gemini-3-flash-preview' },
} as const;

// Public mode system prompt (persona: Amo per PRD/index-chat.md)
const PUBLIC_SYSTEM_PROMPT = `You are Amo, StartupAI's friendly assistant on the public website.

ABOUT STARTUPAI:
StartupAI is an AI-powered platform that helps founders:
- Plan and track their startup journey with AI guidance
- Generate professional pitch decks and documents
- Manage investor relations with smart CRM tools
- Get personalized strategic recommendations
- Validate ideas and track progress with data-driven insights

CAPABILITIES:
- Explain StartupAI features and benefits in detail
- Answer pricing and plan questions
- Share how founders use StartupAI with concrete examples
- Provide general startup advice and industry insights
- Guide visitors to sign up or log in

RESTRICTIONS:
- You cannot access any user dashboards or personal data
- You cannot perform startup planning, task creation, or CRM actions
- You cannot create documents, pitch decks, or any personalized content
- You cannot view or analyze any specific startup

RESPONSE STYLE:
- Friendly, helpful, and conversational
- Concise but informative (2-4 sentences per point)
- Highlight value propositions naturally
- Encourage exploration without being pushy

When asked to perform restricted actions like creating tasks, analyzing a startup, or generating documents, respond:
"To [specific action], you'll need to sign up or sign in. I'd be happy to explain how StartupAI helps with that!"

PRICING INFO (if asked):
- Free tier: Basic features to get started
- Pro tier: Full AI capabilities, unlimited documents, priority support
- Enterprise: Custom solutions for accelerators and VCs
Suggest they visit the pricing page or sign up for details.`;

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
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

    // Try to get user - allow unauthenticated for public mode
    const { data: { user } } = await supabase.auth.getUser();

    // Rate limit authenticated users
    if (user) {
      const rateCheck = checkRateLimit(user.id, 'ai-chat', RATE_LIMITS.standard);
      if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, corsHeaders);
      }
    }

    let body: ChatRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      messages, 
      message, 
      session_id, 
      room_id, 
      mode = user ? 'authenticated' : 'public',
      action = 'chat', 
      startupId,
      query,
      matchThreshold,
      matchCount,
      category,
      context, 
      stream = false 
    } = body;

    // Handle search_knowledge action
    if (action === 'search_knowledge') {
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required for knowledge search' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const searchQuery = query || message;
      if (!searchQuery) {
        return new Response(
          JSON.stringify({ error: 'Query is required for knowledge search' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`[AI Chat] Knowledge search: "${searchQuery.substring(0, 100)}..."`);
      
      try {
        // Generate embedding using OpenAI
        const embedding = await generateOpenAIEmbedding(searchQuery);
        
        // Search knowledge chunks using the embedding
        const { data: results, error: searchError } = await supabase.rpc('search_knowledge', {
          query_embedding: embedding,
          match_threshold: matchThreshold || 0.75,
          match_count: matchCount || 5,
          filter_category: category || null,
          filter_industry: null,
        });
        
        if (searchError) {
          console.error('[AI Chat] Knowledge search error:', searchError);
          throw searchError;
        }
        
        console.log(`[AI Chat] Found ${results?.length || 0} knowledge chunks`);
        
        return new Response(
          JSON.stringify({
            results: results || [],
            query: searchQuery,
            totalMatches: results?.length || 0,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (embeddingError) {
        console.error('[AI Chat] Embedding generation error:', embeddingError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate embedding', 
            details: embeddingError instanceof Error ? embeddingError.message : 'Unknown error' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const isPublicMode = mode === 'public' || !user;
    const isCoachMode = mode === 'coach' || action === 'coach';
    const userMessage = message || messages?.[messages.length - 1]?.content;
    
    // Handle coach mode
    if (isCoachMode && user) {
      const effectiveStartupId = startupId || context?.startup_id;
      
      if (!effectiveStartupId) {
        return new Response(
          JSON.stringify({ error: 'startupId is required for coach mode' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`[AI Chat] Coach mode for startup ${effectiveStartupId}`);
      
      // Handle initial greeting
      if (!userMessage || userMessage.toLowerCase() === 'start') {
        // Get startup name for personalized welcome
        const { data: startupData } = await supabase
          .from('startups')
          .select('name')
          .eq('id', effectiveStartupId)
          .single();
        
        const welcomeMessage = getWelcomeMessage(startupData?.name);
        
        return new Response(
          JSON.stringify({
            message: welcomeMessage,
            phase: 'onboarding',
            progress: { phase: 'onboarding', step: 1, totalSteps: 3, percentage: 0 },
            suggestedActions: ['Tell me about my startup', 'Let\'s get started'],
            mode: 'coach',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const coachResponse = await handleCoachMode(supabase, {
        message: userMessage,
        startupId: effectiveStartupId,
        userId: user.id,
      });
      
      return new Response(
        JSON.stringify({
          ...coachResponse,
          mode: 'coach',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[AI Chat] Mode: ${isPublicMode ? 'public' : 'authenticated'}, Action: ${action}`);
    console.log(`[AI Chat] Message: ${userMessage.substring(0, 100)}...`);

    // For public mode, only allow chat action
    const effectiveAction = isPublicMode ? 'chat' : action;

    let systemPrompt: string;
    let profile = null;
    let startup = null;

    if (isPublicMode) {
      // Public mode - use public system prompt
      systemPrompt = PUBLIC_SYSTEM_PROMPT;
    } else {
      // Authenticated mode - get user context
      const { data: profileData } = await supabase
        .from('profiles')
        .select('org_id, full_name')
        .eq('id', user!.id)
        .single();
      profile = profileData;

      if (profile?.org_id) {
        const { data: startupData } = await supabase
          .from('startups')
          .select('*')
          .eq('org_id', profile.org_id)
          .single();
        startup = startupData;
      }

      systemPrompt = buildSystemPrompt(effectiveAction, {
        user_name: profile?.full_name || 'User',
        startup_name: startup?.name,
        startup_stage: startup?.stage,
        industry: startup?.industry,
        is_raising: startup?.is_raising,
        screen: context?.screen || 'dashboard',
      });

      // RAG: Search knowledge base before LLM; inject server-side (no raw chunks to client)
      const ragBlock = await getRAGContext(supabase, userMessage, startup?.industry);
      if (ragBlock) {
        systemPrompt += `

KNOWLEDGE BASE (use when relevant for market data, benchmarks, or industry context):
${ragBlock}`;
      }
    }

    // Get model config for this action
    const modelKey = isPublicMode ? 'public_chat' : effectiveAction;
    const modelConfig = MODEL_CONFIG[modelKey as keyof typeof MODEL_CONFIG] || MODEL_CONFIG.chat;
    
    let responseText = '';
    let inputTokens = 0;
    let outputTokens = 0;

    // RT-2: Broadcast "AI is thinking" before calling the model
    if (!isPublicMode && user && room_id && context?.startup_id) {
      try {
        const thinkingTopic = `chat:${context.startup_id}:${room_id}:events`;
        const thinkingChannel = supabase.channel(thinkingTopic);
        await thinkingChannel.send({
          type: 'broadcast',
          event: 'ai_thinking',
          payload: {
            model: modelConfig.model,
            provider: modelConfig.provider,
            startedAt: Date.now(),
          },
        });
        await supabase.removeChannel(thinkingChannel);
      } catch (e) {
        console.warn('[AI Chat] ai_thinking broadcast failed:', e);
      }
    }

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

    const suggestedActions = extractSuggestedActions(responseText, effectiveAction, isPublicMode);
    const messageId = crypto.randomUUID();

    // Only broadcast and log for authenticated users
    if (!isPublicMode && user) {
      // Broadcast message_complete to room if room_id provided
      if (room_id && context?.startup_id) {
        try {
          const topic = `chat:${context.startup_id}:${room_id}:events`;
          console.log(`[AI Chat] Broadcasting to ${topic}`);
          
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
          agent_name: getAgentName(effectiveAction),
          action: effectiveAction,
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
    }

    return new Response(
      JSON.stringify({
        id: messageId,
        response: responseText,
        message: responseText,
        suggested_actions: suggestedActions,
        model: modelConfig.model,
        provider: modelConfig.provider,
        mode: isPublicMode ? 'public' : 'authenticated',
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
  
  for (const msg of history.slice(0, -1)) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }
  
  let currentMessage = userMessage;
  if (context?.data) {
    currentMessage += `\n\nContext:\n${JSON.stringify(context.data, null, 2)}`;
  }
  messages.push({ role: 'user', content: currentMessage });

  const TIMEOUT_MS = 30_000;

  const doFetch = async () => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'context-management-2025-06-27'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        system: [{
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }
        }],
        messages,
        context_management: {
          edits: [
            {
              type: 'clear_tool_uses_20250919',
              trigger: { type: 'input_tokens', value: 50000 },
              keep: { type: 'tool_uses', value: 5 }
            }
          ]
        }
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
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
  };

  // Promise.race: hard timeout backup for Deno Deploy body streaming hangs
  return await Promise.race([
    doFetch(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Anthropic API hard timeout after ${TIMEOUT_MS}ms`)), TIMEOUT_MS)
    ),
  ]);
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
  
  for (const msg of history.slice(0, -1)) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }
  
  let currentMessage = userMessage;
  if (context?.data) {
    currentMessage += `\n\nContext:\n${JSON.stringify(context.data, null, 2)}`;
  }
  contents.push({ role: 'user', parts: [{ text: currentMessage }] });

  const TIMEOUT_MS = 30_000;

  const doFetch = async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 2048,
          }
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
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
  };

  // Promise.race: hard timeout backup for Deno Deploy body streaming hangs
  return await Promise.race([
    doFetch(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini API hard timeout after ${TIMEOUT_MS}ms`)), TIMEOUT_MS)
    ),
  ]);
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
      return `You are Atlas, an AI startup advisor for StartupAI, helping founders build and scale their startups.

${baseContext}

CAPABILITIES:
- Provide personalized guidance based on their startup stage
- Help prioritize tasks and suggest next actions
- Answer questions about fundraising, product, and growth
- Explain insights from their dashboard and metrics
- Suggest relevant templates and resources

RULES:
- Be concise but actionable
- Reference their actual startup context when relevant
- Confirm before suggesting any database changes
- Use markdown formatting for clarity`;
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
  action: string,
  isPublicMode: boolean
): Array<{ type: string; label: string; payload?: Record<string, unknown> }> {
  const actions: Array<{ type: string; label: string; payload?: Record<string, unknown> }> = [];
  const lower = response.toLowerCase();
  
  // Public mode - suggest auth actions
  if (isPublicMode) {
    if (lower.includes('sign up') || lower.includes('sign in') || lower.includes('log in')) {
      actions.push({ type: 'auth', label: 'Sign Up', payload: { action: 'signup' } });
      actions.push({ type: 'auth', label: 'Sign In', payload: { action: 'login' } });
    }
    if (lower.includes('pricing') || lower.includes('plans')) {
      actions.push({ type: 'navigate', label: 'View Pricing', payload: { route: '/pricing' } });
    }
    if (lower.includes('features')) {
      actions.push({ type: 'navigate', label: 'Explore Features', payload: { route: '/features' } });
    }
    return actions.slice(0, 3);
  }
  
  // Authenticated mode - suggest app navigation
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
  if (lower.includes('crm') || lower.includes('contact')) {
    actions.push({ type: 'navigate', label: 'Open CRM', payload: { route: '/crm' } });
  }
  
  return actions.slice(0, 3);
}

// Generate embedding using OpenAI text-embedding-3-small (1536 dimensions)
async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const cleanedText = text.replace(/\n/g, ' ').trim();
  
  if (!cleanedText) {
    throw new Error('Text cannot be empty');
  }

  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: cleanedText,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenAI Embeddings] API error ${response.status}:`, errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 401) {
      throw new Error('Invalid OpenAI API key');
    }
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[OpenAI Embeddings] Generated embedding, tokens: ${data.usage?.total_tokens || 'N/A'}`);
  
  return data.data[0].embedding;
}
