/**
 * Agent 1: Extractor
 * Extracts structured startup profile from raw input text.
 */

import type { SupabaseClient, StartupProfile } from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { AGENT_SCHEMAS } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";

export async function runExtractor(
  supabase: SupabaseClient,
  sessionId: string,
  inputText: string
): Promise<StartupProfile | null> {
  const agentName = 'ExtractorAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  const systemPrompt = `You are a startup analyst. Extract and sharpen the founder's idea into structured fields.

Return JSON with exactly these fields:
{
  "idea": "One clear sentence: [Who] gets [what outcome] by [how]. Example: 'Independent fashion labels get a complete production workflow by using an AI that converts creative briefs into schedules, vendor lists, and marketing assets.'",
  "problem": "The core problem in plain language. Focus on the pain: who has it, how often, and what it costs them today (time, money, or missed opportunities).",
  "customer": "Specific buyer — job title, company size, and context. 'Production managers at independent fashion labels with 10-50 employees' not 'fashion companies'.",
  "solution": "How the product solves the problem — be specific about the mechanism, not just the category. 'AI converts moodboards into production schedules and vendor briefs' not 'AI-powered workflow tool'.",
  "differentiation": "What makes this different from alternatives — name the specific gap it fills.",
  "alternatives": "Current alternatives/competitors mentioned by the founder.",
  "validation": "Any existing validation or traction mentioned (customers, revenue, waitlist, letters of intent).",
  "industry": "Primary industry (e.g., fintech, healthtech, saas, ecommerce, fashiontech)",
  "websites": "Any URLs or websites the founder wants researched (empty string if none mentioned)"
}

If information is not provided, make reasonable inferences based on context. For websites, only include URLs that the user explicitly mentioned — do not invent any.`;

  try {
    const { text } = await callGemini(
      AGENTS.extractor.model,
      systemPrompt,
      `Extract startup profile from:\n\n${inputText}`,
      { responseJsonSchema: AGENT_SCHEMAS.extractor, timeoutMs: AGENT_TIMEOUTS.extractor }
    );

    const profile = extractJSON<StartupProfile>(text);
    if (!profile) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }
    await completeRun(supabase, sessionId, agentName, 'ok', profile);
    return profile;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
