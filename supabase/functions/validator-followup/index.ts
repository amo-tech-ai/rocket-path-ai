/**
 * Validator Follow-up Edge Function
 * Analyzes conversation and generates the next best follow-up question.
 * Uses Gemini Flash for fast, contextual question generation.
 * v4: URL context, Google Search, DB playbooks, discovered entities.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import { detectIndustry, formatPlaybookPrompt } from "../_shared/playbooks/index.ts";
import { getIndustryContext, formatContextForPrompt } from "../_shared/industry-context.ts";
import { FOLLOWUP_SYSTEM_PROMPT } from "./prompt.ts";
import { followupResponseSchema, type FollowupResponse } from "./schema.ts";

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // CORS preflight
  const preflight = handleCors(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Validate env vars
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required environment variables');
    }

    // Auth check
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

    // Rate limit: 30 requests per 60s
    const rl = checkRateLimit(user.id, 'validator-followup', RATE_LIMITS.standard);
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    // Parse JSON with error handling
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, sessionId } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize: max 20 messages, max 2000 chars each, strip HTML
    const sanitizedMessages = messages.slice(0, 20).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: (msg.content || '').replace(/<[^>]*>/g, '').trim().slice(0, 2000),
    }));

    // Build conversation text for Gemini
    const conversationText = sanitizedMessages
      .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n\n');

    const userMessageCount = sanitizedMessages.filter((m: { role: string }) => m.role === 'user').length;

    // --- Industry Detection: in-memory playbooks + DB playbook enrichment ---
    const playbook = detectIndustry(conversationText);
    let systemPrompt = playbook
      ? FOLLOWUP_SYSTEM_PROMPT + formatPlaybookPrompt(playbook)
      : FOLLOWUP_SYSTEM_PROMPT;

    if (playbook) {
      console.log(`[validator-followup] Industry detected: ${playbook.industry}`);

      // 1C: Try DB-backed playbook for richer context (falls back to in-memory if DB fails)
      try {
        // Map keyword-based industry name to industry_id format
        const industryId = playbook.industry.toLowerCase().replace(/[\s/]+/g, '_').replace(/_+/g, '_');
        const dbContext = await getIndustryContext(industryId, 'validator', undefined, supabase);
        if (dbContext) {
          const dbBlock = formatContextForPrompt(dbContext, 'validator');
          systemPrompt += '\n\n' + dbBlock;
          console.log(`[validator-followup] DB playbook injected for: ${dbContext.display_name}`);
        }
      } catch (dbErr) {
        console.warn('[validator-followup] DB playbook lookup failed, using in-memory only:', dbErr);
      }
    }

    // --- Detect URLs in conversation for URL context ---
    const urlPattern = /https?:\/\/[^\s,)"']+/gi;
    const detectedUrls = conversationText.match(urlPattern) || [];
    const hasUrls = detectedUrls.length > 0;

    // --- Determine if search should be enabled ---
    // Enable search after 2+ user messages when competitors or research topics are uncovered.
    // We can't check coverage before calling Gemini (chicken-and-egg), so we use keyword heuristics.
    const lowerConv = conversationText.toLowerCase();
    const hasCompetitorMention = ['competitor', 'alternative', 'rival', 'vs', 'compared to'].some(kw => lowerConv.includes(kw));
    const hasMarketMention = ['market size', 'tam', 'sam', 'billion', 'million', 'growth rate', 'market research'].some(kw => lowerConv.includes(kw));
    const enableSearch = userMessageCount >= 2 && (!hasCompetitorMention || !hasMarketMention);

    // --- Build user prompt with conditional URL inclusion ---
    let userPrompt = `Here is the conversation so far (${userMessageCount} user messages):\n\n${conversationText}`;

    if (hasUrls) {
      userPrompt += `\n\nFounder's websites: ${detectedUrls.join(', ')}`;
    }

    userPrompt += `\n\nAnalyze the coverage and generate the next follow-up question (or signal "ready" if enough info is gathered).`;

    // --- Timeout: base 25s, +10s if search enabled, +5s if URL context enabled ---
    let timeoutMs = 25000;
    if (enableSearch) timeoutMs += 10000;
    if (hasUrls) timeoutMs += 5000;

    console.log(`[validator-followup] Features: search=${enableSearch}, urlContext=${hasUrls}, timeout=${timeoutMs}ms, urls=${detectedUrls.length}`);

    // Gemini Flash call with conditional tools
    const result = await callGemini(
      'gemini-3-flash-preview',
      systemPrompt,
      userPrompt,
      {
        responseJsonSchema: followupResponseSchema,
        timeoutMs,
        maxRetries: 1,
        maxOutputTokens: 2048,
        useSearch: enableSearch,
        useUrlContext: hasUrls,
      }
    );

    console.log('[validator-followup] Raw Gemini text (first 500 chars):', result.text?.substring(0, 500));
    const parsed = extractJSON<FollowupResponse>(result.text);

    if (!parsed) {
      console.error('[validator-followup] Failed to parse Gemini response. Full text:', result.text);
      return new Response(
        JSON.stringify({ success: false, error: 'AI returned unexpected format — please try again' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure discoveredEntities arrays exist even if Gemini returned partial object
    if (!parsed.discoveredEntities) {
      parsed.discoveredEntities = { competitors: [], urls: [], marketData: [] };
    }
    if (!Array.isArray(parsed.discoveredEntities.urls)) parsed.discoveredEntities.urls = [];
    if (!Array.isArray(parsed.discoveredEntities.competitors)) parsed.discoveredEntities.competitors = [];
    if (!Array.isArray(parsed.discoveredEntities.marketData)) parsed.discoveredEntities.marketData = [];
    if (!Array.isArray(parsed.contradictions)) parsed.contradictions = [];

    // 037-DSC: Ensure suggestions array exists and is valid
    if (!Array.isArray(parsed.suggestions)) {
      parsed.suggestions = [];
    }
    // Cap at 4 suggestions, max 60 chars each, strip HTML for safety
    parsed.suggestions = parsed.suggestions.slice(0, 4).map((s: unknown) => {
      if (typeof s === 'string') return s.replace(/<[^>]*>/g, '').slice(0, 60);
      console.warn('[validator-followup] Non-string suggestion filtered:', typeof s);
      return '';
    }).filter((s: string) => s.length > 0);

    // Enrich discoveredEntities with search grounding results
    if (result.searchGrounding && result.citations?.length) {
      for (const citation of result.citations) {
        if (citation.url && !parsed.discoveredEntities.urls.includes(citation.url)) {
          parsed.discoveredEntities.urls.push(citation.url);
        }
      }
    }

    console.log(`[validator-followup] action=${parsed.action}, coverage=${JSON.stringify(parsed.coverage)}, q#=${parsed.questionNumber}, contradictions=${parsed.contradictions?.length || 0}`);
    if (parsed.extracted) {
      const filledFields = Object.entries(parsed.extracted).filter(([, v]) => v).length;
      const totalFields = Object.keys(parsed.extracted).length;
      console.log(`[validator-followup] extracted=${filledFields}/${totalFields} fields, discovered=${JSON.stringify(parsed.discoveredEntities)}`);
    }

    // RT-5 + L3: Broadcast follow-up with streaming tokens if sessionId provided
    if (sessionId && typeof sessionId === 'string') {
      try {
        const channel = supabase.channel(`validator:${sessionId}`);

        // RT-5: Send metadata immediately so frontend can update coverage/extraction state
        await channel.send({
          type: 'broadcast',
          event: 'followup_ready',
          payload: {
            sessionId,
            action: parsed.action,
            question: parsed.question,
            coverage: parsed.coverage,
            questionNumber: parsed.questionNumber,
            suggestions: parsed.suggestions || [],
            timestamp: Date.now(),
          },
        });

        // L3: Stream question text token-by-token for progressive display
        const questionText = parsed.question || '';
        if (questionText.length > 0) {
          const messageId = crypto.randomUUID();

          // Send metadata event first
          await channel.send({
            type: 'broadcast',
            event: 'followup_metadata',
            payload: {
              messageId,
              coverage: parsed.coverage,
              extracted: parsed.extracted || {},
              confidence: parsed.confidence || {},
              contradictions: parsed.contradictions || [],
              discoveredEntities: parsed.discoveredEntities,
              action: parsed.action,
              summary: parsed.summary,
              readiness_reason: parsed.readiness_reason || '',
              questionNumber: parsed.questionNumber,
              suggestions: parsed.suggestions || [],
            },
          });

          // Stream tokens (split by word boundaries for natural reading)
          const tokens = questionText.match(/\S+\s*/g) || [questionText];
          for (let i = 0; i < tokens.length; i++) {
            await channel.send({
              type: 'broadcast',
              event: 'token_chunk',
              payload: { messageId, token: tokens[i], index: i },
            });
            // 30ms per token ≈ natural reading speed (keeps total under 2s for typical questions)
            if (i < tokens.length - 1) {
              await new Promise(r => setTimeout(r, 30));
            }
          }

          // Signal completion
          await channel.send({
            type: 'broadcast',
            event: 'message_complete',
            payload: { messageId, totalTokens: tokens.length },
          });
        }

        await supabase.removeChannel(channel);
      } catch (e) {
        console.warn('[validator-followup] broadcast failed:', e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: parsed.action,
        question: parsed.question,
        summary: parsed.summary,
        readiness_reason: parsed.readiness_reason || '',
        coverage: parsed.coverage,
        extracted: parsed.extracted || {},
        confidence: parsed.confidence || {},
        contradictions: parsed.contradictions || [],
        discoveredEntities: parsed.discoveredEntities,
        questionNumber: parsed.questionNumber,
        suggestions: parsed.suggestions || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[validator-followup] Error:', msg);
    // Differentiate timeout vs generic — but never leak internal details
    const isTimeout = msg.includes('timed out') || msg.includes('hard timeout');
    return new Response(
      JSON.stringify({ success: false, error: isTimeout ? 'AI request timed out — please try again' : 'Internal server error' }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
