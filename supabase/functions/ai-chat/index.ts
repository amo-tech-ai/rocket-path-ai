import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCoachMode, getWelcomeMessage } from "./coach/index.ts";
import { getRAGContext } from "./rag.ts";
import { generateEmbedding } from "../_shared/openai-embeddings.ts";
import { corsHeaders, getCorsHeaders, handleCors } from '../_shared/cors.ts';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '../_shared/rate-limit.ts';
import { callGeminiChat as sharedCallGeminiChat, callGeminiChatStream, type GeminiChatMessage } from '../_shared/gemini.ts';
import { CHAT_MODE_PROMPTS } from '../_shared/agency-chat-modes.ts';
import { buildExpertPrompt } from '../_shared/startup-expert.ts';


interface ChatRequest {
  messages?: Array<{ role: string; content: string }>;
  message?: string;
  session_id?: string;
  room_id?: string;
  mode?: 'public' | 'authenticated' | 'coach' | 'practice_pitch' | 'growth_strategy' | 'deal_review' | 'canvas_coach';
  action?: 'chat' | 'prioritize_tasks' | 'generate_tasks' | 'extract_profile' | 'stage_guidance' | 'coach' | 'search_knowledge';
  startupId?: string;
  query?: string;
  matchThreshold?: number;
  matchCount?: number;
  category?: string;
  industry?: string;
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

// Coaching mode system prompts — imported from _shared/agency-chat-modes.ts
// Source: agency/chat-modes/*.md (practice-pitch, growth-strategy, deal-review, canvas-coach)
// Full prompts with frameworks (MEDDPICC, AARRR, ICE), question banks, and coaching methodology

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

    // Rate limit all users — authenticated by user.id, public by IP
    if (user) {
      const rateCheck = checkRateLimit(user.id, 'ai-chat', RATE_LIMITS.standard);
      if (!rateCheck.allowed) {
        return rateLimitResponse(rateCheck, getCorsHeaders(req));
      }
    } else {
      // Public mode: rate limit by IP to prevent abuse/cost overrun
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown';
      const publicRateCheck = checkRateLimit(`public:${clientIp}`, 'ai-chat-public', RATE_LIMITS.light);
      if (!publicRateCheck.allowed) {
        return rateLimitResponse(publicRateCheck, getCorsHeaders(req));
      }
    }

    let body: ChatRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const {
      messages,
      message,
      session_id,
      room_id: explicit_room_id,
      mode = user ? 'authenticated' : 'public',
      action = 'chat',
      startupId,
      query,
      matchThreshold,
      matchCount,
      category,
      industry,
      context,
      stream = false
    } = body;
    // room_id can come as top-level or inside context (frontend sends it in context)
    const room_id = explicit_room_id || (context as Record<string, unknown>)?.room_id as string | undefined;

    // Handle search_knowledge action
    if (action === 'search_knowledge') {
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required for knowledge search' }),
          { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        );
      }
      
      const searchQuery = query || message;
      if (!searchQuery) {
        return new Response(
          JSON.stringify({ error: 'Query is required for knowledge search' }),
          { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`[AI Chat] Knowledge search: "${searchQuery.substring(0, 100)}..."`);
      
      try {
        // Generate embedding using shared OpenAI module
        const { embedding } = await generateEmbedding(searchQuery);

        // Hybrid search: semantic + full-text with RRF merge
        const { data: results, error: searchError } = await supabase.rpc('hybrid_search_knowledge', {
          query_embedding: `[${embedding.join(",")}]`,
          query_text: searchQuery,
          match_threshold: matchThreshold || 0.5,
          match_count: matchCount || 10,
          filter_category: category || null,
          filter_industry: industry?.trim()?.toLowerCase() || null,
          rrf_k: 50,
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
          { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        );
      } catch (embeddingError) {
        console.error('[AI Chat] Embedding generation error:', embeddingError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate embedding', 
            details: embeddingError instanceof Error ? embeddingError.message : 'Unknown error' 
          }),
          { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
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
          { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
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

        // Ensure a coach session exists and persist the welcome message
        const { loadValidationContext, createSession, saveConversation } = await import("./coach/context-loader.ts");
        let ctx = await loadValidationContext(supabase, effectiveStartupId, user.id);
        if (!ctx.session) {
          const newSession = await createSession(supabase, effectiveStartupId, user.id);
          if (newSession) ctx = { ...ctx, session: newSession };
        }
        if (ctx.session) {
          await saveConversation(supabase, ctx.session.id, user.id, 'assistant', welcomeMessage, 'onboarding');
        }

        return new Response(
          JSON.stringify({
            message: welcomeMessage,
            phase: 'onboarding',
            progress: { phase: 'onboarding', step: 1, totalSteps: 3, percentage: 0 },
            suggestedActions: ['Tell me about my startup', 'Let\'s get started'],
            mode: 'coach',
            sessionId: ctx.session?.id || null,
          }),
          { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
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
        { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Handle coaching chat modes (practice_pitch, growth_strategy, deal_review, canvas_coach, research, planning)
    const COACHING_MODES = ['practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach', 'research', 'planning'] as const;
    type CoachingMode = typeof COACHING_MODES[number];

    if (user && COACHING_MODES.includes(mode as CoachingMode)) {
      const coachingMode = mode as CoachingMode;
      console.log(`[AI Chat] Coaching mode: ${coachingMode}`);

      if (!userMessage) {
        return new Response(
          JSON.stringify({ error: 'Message is required' }),
          { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        );
      }

      // Get startup context for personalization
      const { data: profileData } = await supabase
        .from('profiles')
        .select('org_id, full_name')
        .eq('id', user.id)
        .maybeSingle();

      let startupContext = '';
      if (profileData?.org_id) {
        const { data: startupData } = await supabase
          .from('startups')
          .select('name, industry, stage, description')
          .eq('org_id', profileData.org_id)
          .limit(1)
          .maybeSingle();
        if (startupData) {
          startupContext = `\n\nFOUNDER CONTEXT:\n- Name: ${profileData.full_name || 'Founder'}\n- Startup: ${startupData.name || 'Unknown'}\n- Industry: ${startupData.industry || 'Unknown'}\n- Stage: ${startupData.stage || 'Unknown'}\n- Description: ${(startupData.description || '').slice(0, 300)}`;
        }
      }

      const coachingSystemPrompt = CHAT_MODE_PROMPTS[coachingMode] + startupContext;

      // RAG context for coaching modes
      const ragBlock = await getRAGContext(supabase, userMessage, null);
      const finalPrompt = ragBlock
        ? `${coachingSystemPrompt}\n\nKNOWLEDGE BASE:\n${ragBlock}`
        : coachingSystemPrompt;

      const chatMessages: GeminiChatMessage[] = (messages || []).map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }],
      }));

      // Streaming: broadcast token_chunk events via Realtime, return JSON when done
      const canStream = stream && room_id && context?.startup_id;
      const messageId = crypto.randomUUID();

      if (canStream) {
        const streamTopic = `chat:${context!.startup_id}:${room_id}:ai`;
        console.log(`[AI Chat] Streaming coaching mode: ${coachingMode} → ${streamTopic}`);

        let chunkCount = 0;
        const streamChannel = supabase.channel(streamTopic);

        const result = await callGeminiChatStream(
          'gemini-3-flash-preview',
          finalPrompt,
          chatMessages,
          userMessage,
          (chunk: string) => {
            chunkCount++;
            // Broadcast each text chunk — frontend handleTokenChunk accumulates
            streamChannel.send({
              type: 'broadcast',
              event: 'token_chunk',
              payload: { messageId, token: chunk },
            }).catch(() => { /* fire-and-forget broadcast */ });
          },
          { timeoutMs: 30_000 }
        );

        // Broadcast completion so frontend marks isStreaming=false
        try {
          await streamChannel.send({
            type: 'broadcast',
            event: 'message_complete',
            payload: {
              id: messageId,
              content: result.text,
              role: 'assistant',
              metadata: {
                model: 'gemini-3-flash-preview',
                provider: 'gemini',
                tokens: result.inputTokens + result.outputTokens,
                streamComplete: true,
              },
              createdAt: new Date().toISOString(),
            },
          });
          await supabase.removeChannel(streamChannel);
        } catch (e) {
          console.warn('[AI Chat] Stream complete broadcast failed:', e);
        }

        console.log(`[AI Chat] Streamed ${chunkCount} chunks (${result.text.length} chars)`);

        return new Response(
          JSON.stringify({
            message: result.text,
            mode: coachingMode,
            model: 'gemini-3-flash-preview',
            streamed: true,
            chunks: chunkCount,
          }),
          { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        );
      }

      // Non-streaming fallback (no room_id or stream=false)
      const isResearchMode = coachingMode === 'research';
      const result = await sharedCallGeminiChat(
        'gemini-3-flash-preview',
        finalPrompt,
        chatMessages,
        userMessage,
        { timeoutMs: isResearchMode ? 45_000 : 30_000, useSearch: isResearchMode }
      );

      return new Response(
        JSON.stringify({
          message: result.text,
          mode: coachingMode,
          model: 'gemini-3-flash-preview',
          ...(result.citations?.length ? { citations: result.citations } : {}),
        }),
        { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
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

      // Use expert prompt for default chat, legacy buildSystemPrompt for specialized actions
      if (effectiveAction === 'chat') {
        systemPrompt = buildExpertPrompt({
          user_name: profile?.full_name || 'User',
          startup_name: startup?.name,
          startup_stage: startup?.stage,
          industry: startup?.industry,
          is_raising: startup?.is_raising,
          screen: context?.screen || 'dashboard',
          description: startup?.description,
        });
      } else {
        systemPrompt = buildSystemPrompt(effectiveAction, {
          user_name: profile?.full_name || 'User',
          startup_name: startup?.name,
          startup_stage: startup?.stage,
          industry: startup?.industry,
          is_raising: startup?.is_raising,
          screen: context?.screen || 'dashboard',
        });
      }

      // MVP-06: If report dimension context provided, load dimension data and inject into system prompt
      const reportCtx = context?.data?.report_context as { type?: string; report_id?: string; dimension_id?: string; dimension_label?: string } | undefined;
      if (reportCtx?.type === 'report-dimension' && reportCtx.report_id) {
        const dimensionBlock = await loadDimensionContext(supabase, reportCtx.report_id, reportCtx.dimension_id, reportCtx.dimension_label);
        if (dimensionBlock) {
          systemPrompt += `\n\n${dimensionBlock}`;
        }
      }

      // Dashboard context: inject health/risk summary when chatting from dashboard
      const dashCtx = context?.data?.dashboard_context as {
        healthScore?: number | null;
        healthTrend?: number | null;
        topRisks?: string[];
        currentStage?: string | null;
        journeyPercent?: number;
      } | undefined;
      if (dashCtx && (context?.screen === '/dashboard' || context?.screen === '/')) {
        const dashLines = [
          'DASHBOARD CONTEXT:',
          dashCtx.healthScore != null ? `Health Score: ${dashCtx.healthScore}/100${dashCtx.healthTrend ? ` (trend: ${dashCtx.healthTrend > 0 ? '+' : ''}${dashCtx.healthTrend})` : ''}` : null,
          dashCtx.currentStage ? `Stage: ${dashCtx.currentStage}${dashCtx.journeyPercent != null ? ` (${dashCtx.journeyPercent}% journey complete)` : ''}` : null,
          dashCtx.topRisks && dashCtx.topRisks.length > 0 ? `Top Risks: ${dashCtx.topRisks.join('; ')}` : 'Top Risks: None flagged',
          '',
          'When the user asks about their status, health, or risks, use the dashboard data above.',
        ].filter(Boolean);
        systemPrompt += `\n\n${dashLines.join('\n')}`;
      }

      // Task #4: Load industry playbook for calibrated advice
      if (startup?.industry) {
        try {
          const { data: playbook } = await supabase
            .from('industry_playbooks')
            .select('benchmarks, investor_expectations, stage_checklists, gtm_patterns')
            .eq('industry_id', startup.industry.trim().toLowerCase())
            .eq('is_active', true)
            .maybeSingle();
          if (playbook?.benchmarks) {
            systemPrompt += `\n\n## INDUSTRY BENCHMARKS for ${startup.industry} [INDUSTRY BENCHMARK]\n${JSON.stringify(playbook.benchmarks, null, 2)}`;
            if (playbook.stage_checklists && startup.stage) {
              const stageAdvice = playbook.stage_checklists[startup.stage as string];
              if (stageAdvice) systemPrompt += `\n\nSTAGE ADVICE (${startup.stage}): ${stageAdvice}`;
            }
          }
        } catch (e) {
          console.warn('[ai-chat] Playbook load failed (continuing):', e instanceof Error ? e.message : e);
        }
      }

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
        const thinkingTopic = `chat:${context.startup_id}:${room_id}:ai`;
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

    // Streaming: Gemini chat with token_chunk broadcasts via Realtime
    const canStreamAuth = stream && !isPublicMode && modelConfig.provider === 'gemini' && room_id && context?.startup_id;

    if (modelConfig.provider === 'anthropic') {
      const result = await callAnthropic(modelConfig.model, systemPrompt, messages || [], userMessage, context);
      responseText = result.text;
      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;
    } else if (canStreamAuth) {
      // Stream Gemini response via Realtime broadcasts
      const streamTopic = `chat:${context!.startup_id}:${room_id}:ai`;
      const streamChannel = supabase.channel(streamTopic);
      const streamMsgId = crypto.randomUUID();
      let chunkCount = 0;

      // Build messages for streaming call
      const chatMsgs: GeminiChatMessage[] = (messages || []).slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }));

      let currentMsg = userMessage;
      if (context?.data) {
        currentMsg += `\n\nContext:\n${JSON.stringify(context.data, null, 2)}`;
      }

      const result = await callGeminiChatStream(
        modelConfig.model,
        systemPrompt,
        chatMsgs,
        currentMsg,
        (chunk: string) => {
          chunkCount++;
          streamChannel.send({
            type: 'broadcast',
            event: 'token_chunk',
            payload: { messageId: streamMsgId, token: chunk },
          }).catch(() => {});
        },
        { timeoutMs: 30_000, maxOutputTokens: 2048 }
      );

      responseText = result.text;
      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;

      // Complete broadcast handled below in the existing message_complete block
      // (messageId will differ — but the block uses its own messageId; we need to align)
      // Override messageId for consistency
      console.log(`[AI Chat] Streamed auth ${chunkCount} chunks (${result.text.length} chars)`);
      try { await supabase.removeChannel(streamChannel); } catch { /* ignore */ }
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
          const topic = `chat:${context.startup_id}:${room_id}:ai`;
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
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * MVP-06: Load compact dimension context for the AI system prompt.
 * Queries validator_reports.details.dimensions[dimensionId] and builds
 * a ~200-400 token summary for the LLM.
 */
// deno-lint-ignore no-explicit-any
async function loadDimensionContext(
  supabase: any,
  reportId: string,
  dimensionId?: string | null,
  dimensionLabel?: string | null,
): Promise<string | null> {
  try {
    const { data: report, error } = await supabase
      .from('validator_reports')
      .select('details, score')
      .eq('id', reportId)
      .single();

    if (error || !report?.details) {
      console.warn('[AI Chat] Could not load report for dimension context:', error?.message);
      return null;
    }

    // deno-lint-ignore no-explicit-any
    const details = report.details as Record<string, any>;

    // If on the report overview (no specific dimension), give a high-level summary
    if (!dimensionId || !details.dimensions?.[dimensionId]) {
      return `REPORT CONTEXT:
The user is viewing their validation report (overall score: ${report.score ?? 'N/A'}/100).
When answering questions, reference the report's findings and scores.`;
    }

    // deno-lint-ignore no-explicit-any
    const dim = details.dimensions[dimensionId] as Record<string, any>;
    const label = dimensionLabel || dimensionId;
    const score = dim.composite_score ?? 'N/A';

    // Build compact sub-scores summary
    // deno-lint-ignore no-explicit-any
    const subScores = (dim.sub_scores || []).map((s: any) =>
      `${s.label || s.name}: ${s.score ?? 0}/100`
    ).join(', ');

    // Top action
    const topAction = dim.priority_actions?.[0] || null;

    // Risk signals count
    const riskCount = dim.risk_signals?.length || 0;
    // deno-lint-ignore no-explicit-any
    const highRiskCount = (dim.risk_signals || []).filter((s: any) =>
      typeof s === 'object' && s.severity === 'high'
    ).length;

    // Headline
    const headline = dim.headline || '';

    return `CURRENT DIMENSION CONTEXT: ${label} (${score}/100)
Headline: ${headline}
Sub-scores: ${subScores || 'None available'}
Top action: ${topAction || 'None specified'}
Risk signals: ${riskCount} flagged${highRiskCount > 0 ? ` (${highRiskCount} high severity)` : ''}

When the user asks about "this score", "this dimension", or "how to improve", use the ${label} data above.
Reference specific sub-scores and actions when giving advice.`;
  } catch (err) {
    console.error('[AI Chat] Error loading dimension context:', err);
    return null;
  }
}

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

// CHAT-P1-1: Delegates to _shared/gemini.ts callGeminiChat (single source of truth)
async function callGemini(
  model: string,
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  context?: { data?: Record<string, unknown> }
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  // Build message list from history + current message with context
  const chatMessages: GeminiChatMessage[] = [];
  for (const msg of history.slice(0, -1)) {
    chatMessages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  }
  let currentMessage = userMessage;
  if (context?.data) {
    currentMessage += `\n\nContext:\n${JSON.stringify(context.data, null, 2)}`;
  }
  chatMessages.push({ role: 'user', content: currentMessage });

  return sharedCallGeminiChat(model, systemPrompt, chatMessages, {
    timeoutMs: 30_000,
    maxOutputTokens: 2048,
  });
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

