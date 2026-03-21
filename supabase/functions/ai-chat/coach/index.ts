/**
 * Coach Mode Handler
 * Main entry point for coach mode in ai-chat
 */

import type { ValidationPhase, ValidationContext, CoachResponse, ValidationState } from "./types.ts";
import { buildCoachPersona, buildContextSummary, getPhaseInstructions } from "./persona.ts";
import { loadValidationContext, createSession, updateSession, saveConversation } from "./context-loader.ts";
import { detectTransition, extractStateUpdates, calculateProgress, getSuggestedActions, canTransition } from "./state-machine.ts";
import { getRAGContext } from "../rag.ts";
import { callGeminiChat } from "../../_shared/gemini.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

const DEFAULT_MODEL = "gemini-3.1-pro-preview";
const FALLBACK_MODEL = "gemini-3-flash-preview";
const AI_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

interface CoachRequest {
  message: string;
  startupId: string;
  userId: string;
}

/**
 * Handle coach mode request
 */
export async function handleCoachMode(
  supabase: SupabaseClient,
  request: CoachRequest
): Promise<CoachResponse> {
  const startTime = Date.now();
  console.log(`[Coach] Starting coach mode for startup ${request.startupId}`);
  
  // Load context (now queries chat_sessions + chat_messages)
  let context = await loadValidationContext(supabase, request.startupId, request.userId);

  // Create session if none exists
  if (!context.session) {
    console.log('[Coach] No active session, creating new one');
    const newSession = await createSession(supabase, request.startupId, request.userId);
    if (newSession) {
      context = { ...context, session: newSession };
    } else {
      return {
        message: "I'm having trouble setting up our coaching session. Please try again in a moment.",
        phase: 'onboarding',
        progress: { phase: 'onboarding', step: 1, totalSteps: 3, percentage: 0 },
        suggestedActions: ['Try again'],
      };
    }
  }
  
  const currentPhase = context.session!.phase as ValidationPhase;
  const currentState = context.session!.state as ValidationState || {};
  
  // RAG: Search knowledge base before AI call; inject into prompt (server-side, no raw chunks to client)
  const industry = (context.startup as { industry?: string })?.industry;
  const ragBlock = await getRAGContext(supabase, request.message, industry);
  const knowledgeSection = ragBlock
    ? `

KNOWLEDGE BASE (use when relevant):
${ragBlock}

`
    : "";

  // Save user message
  await saveConversation(
    supabase,
    context.session!.id,
    request.userId,
    'user',
    request.message,
    currentPhase
  );
  
  // Build prompt
  const persona = buildCoachPersona(context.startup);
  const contextSummary = buildContextSummary(context);
  const phaseInstructions = getPhaseInstructions(currentPhase, context);
  
  const systemPrompt = `${persona}
${knowledgeSection}
CURRENT CONTEXT:
${contextSummary}

CURRENT PHASE: ${currentPhase}
${phaseInstructions}

Remember:
- Be warm and direct
- One question at a time
- Reference their specific situation
- End with a clear next step`;

  // Build conversation history
  const messages = context.recentConversations.map(c => ({
    role: c.role === 'assistant' ? 'assistant' : 'user',
    content: c.content,
  }));
  messages.push({ role: 'user', content: request.message });
  
  // Call AI with retry logic
  let aiResponse = '';
  let tokensUsed = 0;
  let modelUsed = DEFAULT_MODEL;
  
  try {
    const result = await callAIWithRetry(systemPrompt, messages);
    aiResponse = result.text;
    tokensUsed = result.tokens;
    modelUsed = result.model;
  } catch (error) {
    console.error('[Coach] AI call failed:', error);
    return {
      message: "I'm having a moment - let me gather my thoughts. Could you try that again?",
      phase: currentPhase,
      progress: calculateProgress(currentPhase, currentState),
      suggestedActions: ['Try again', 'Start over'],
    };
  }
  
  // Extract state updates from response
  const stateUpdates = extractStateUpdates(currentPhase, currentState, aiResponse);
  const newState = stateUpdates ? { ...currentState, ...stateUpdates } : currentState;
  
  // Check for phase transition
  const newPhase = detectTransition(currentPhase, { ...context, session: { ...context.session!, state: newState } }, aiResponse);
  
  if (newPhase && canTransition(currentPhase, newPhase)) {
    console.log(`[Coach] Transitioning from ${currentPhase} to ${newPhase}`);
    await updateSession(supabase, context.session!.id, {
      phase: newPhase,
      state: newState,
    });
  } else if (stateUpdates) {
    // Just update state, no phase change
    await updateSession(supabase, context.session!.id, {
      state: newState,
    });
  }
  
  // Save assistant response
  await saveConversation(
    supabase,
    context.session!.id,
    request.userId,
    'assistant',
    aiResponse,
    newPhase || currentPhase,
    { tokens_used: tokensUsed, model_used: modelUsed }
  );
  
  const finalPhase = newPhase || currentPhase;
  const progress = calculateProgress(finalPhase, newState);
  const suggestedActions = getSuggestedActions(finalPhase, newState, aiResponse);
  
  const duration = Date.now() - startTime;
  console.log(`[Coach] Completed in ${duration}ms, phase: ${finalPhase}`);
  
  return {
    message: aiResponse,
    phase: finalPhase,
    progress,
    suggestedActions,
    stateUpdate: stateUpdates || undefined,
    sessionId: context.session!.id,
  };
}

/**
 * Call Gemini via _shared/gemini.ts with model fallback retry.
 * V08: Replaced Lovable AI Gateway with direct Gemini REST client.
 */
async function callAIWithRetry(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>
): Promise<{ text: string; tokens: number; model: string }> {
  let lastError: Error | null = null;
  let model = DEFAULT_MODEL;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Convert messages to the format callGeminiChat expects
      // callGeminiChat takes the full conversation including the latest user message
      const chatMessages = messages.map(m => ({
        role: m.role as 'user' | 'model',
        content: m.content,
      }));

      const result = await callGeminiChat(
        model,
        systemPrompt,
        chatMessages,
        {
          timeoutMs: AI_TIMEOUT,
          maxOutputTokens: 1024,
        },
      );

      return {
        text: result.text,
        tokens: (result.inputTokens ?? 0) + (result.outputTokens ?? 0),
        model,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[Coach] Attempt ${attempt + 1} failed:`, lastError.message);

      // Try fallback model on retry
      if (model === DEFAULT_MODEL) {
        console.log('[Coach] Switching to fallback model');
        model = FALLBACK_MODEL;
      }

      // Exponential backoff: 1s, 2s
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[Coach] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('AI call failed after retries');
}

/**
 * Get welcome message for new session
 */
export function getWelcomeMessage(startupName?: string): string {
  if (startupName) {
    return `Hey there! 👋 I'm your startup coach, and I'm excited to work with you on ${startupName}. 

I've helped hundreds of founders go from zero to their first customers, and I'm here to do the same for you.

Before we dive into a proper assessment, tell me: what's the one thing that's been keeping you up at night about this startup?`;
  }
  
  return `Hey there! 👋 I'm your startup coach. I've helped hundreds of founders go from zero to their first customers.

Let's start simple: what are you building? Give me the one-sentence version.`;
}
