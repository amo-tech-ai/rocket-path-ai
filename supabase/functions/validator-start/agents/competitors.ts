/**
 * Agent 3: Competitors (with Google Search)
 * Identifies direct and indirect competitors using real-time web search.
 */

import type { SupabaseClient, StartupProfile, CompetitorAnalysis } from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { AGENT_SCHEMAS } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";
import { getCuratedLinks, formatLinksForPrompt } from "../curated-links.ts";

export async function runCompetitors(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile
): Promise<CompetitorAnalysis | null> {
  const agentName = 'CompetitorAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  // P01E: Pass keywords for smart platform search URLs (competitors-focused)
  const keywords = [profile.idea, profile.alternatives].filter(Boolean).join(' ');
  const { industryLinks, crossIndustryLinks, platformLinks, matchedIndustry } = getCuratedLinks(profile.industry, keywords);
  const allLinks = [...industryLinks, ...crossIndustryLinks, ...platformLinks];
  const curatedSourcesBlock = formatLinksForPrompt(allLinks);

  const systemPrompt = `You are a competitive intelligence analyst. Identify who the founder is really up against — be specific and honest.

## Writing style:
- Describe each competitor in plain language: what they do, who they serve, and why they matter
- BAD: "A comprehensive enterprise solution leveraging advanced technology for industry verticals"
- GOOD: "PR and event management platform used by 1,200+ luxury brands. Their main strength is a decade of historical performance data."
- For strengths/weaknesses: be specific and actionable, not generic
- Market gaps should explain WHY the gap exists, not just name it

## Preferred Sources (HIGH PRIORITY)
Consult these curated sources FIRST for competitor data, market maps, funding rounds, and industry landscapes:

${curatedSourcesBlock}

## Research Strategy
1. FIRST: Check preferred sources for competitor lists, market maps, and landscapes
2. THEN: Use real-time web search for latest funding, launches, pivots, and news
3. CROSS-REFERENCE: Competitors in both curated and search sources are significant players

Return JSON with exactly these fields:
{
  "direct_competitors": [
    {
      "name": "Company name",
      "description": "One sentence: what they do, who they serve, and their scale (users/revenue/funding if known)",
      "strengths": ["Specific strength with evidence"],
      "weaknesses": ["Specific weakness — where they fall short"],
      "threat_level": "high|medium|low",
      "source_url": "https://..."
    }
  ],
  "indirect_competitors": [
    {
      "name": "Company name",
      "description": "What they do and specifically how they compete for the same budget or attention",
      "strengths": [],
      "weaknesses": [],
      "threat_level": "medium",
      "source_url": "https://..."
    }
  ],
  "market_gaps": ["Describe each gap: what's missing, who needs it, and why existing players haven't filled it"],
  "sources": [{"title": "Source", "url": "https://..."}]
}

Find 3-5 direct competitors and 2-3 indirect. Cite preferred sources when they contributed.`;

  const industryLine = matchedIndustry
    ? `Industry: ${profile.industry} (category: ${matchedIndustry})`
    : `Industry: ${profile.industry}`;

  const websitesLine = profile.websites && profile.websites.trim() && profile.websites.toLowerCase() !== 'skip'
    ? `\nFounder-provided websites to research: ${profile.websites}`
    : '';

  try {
    // P02: Removed urlContext — Google Search alone finds competitors in ~15-20s vs 40s+ with URL fetching.
    // Curated links remain in the prompt as reference context (Gemini can cite them via search grounding).
    const { text, searchGrounding, citations } = await callGemini(
      AGENTS.competitors.model,
      systemPrompt,
      `Find competitors for: ${profile.idea}\n${industryLine}\nExisting alternatives mentioned: ${profile.alternatives}${websitesLine}`,
      { useSearch: true, useUrlContext: false, responseJsonSchema: AGENT_SCHEMAS.competitors, timeoutMs: AGENT_TIMEOUTS.competitors }
    );

    const analysis = extractJSON<CompetitorAnalysis>(text);
    if (!analysis) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }
    await completeRun(
      supabase, sessionId, agentName,
      searchGrounding ? 'ok' : 'partial',
      analysis,
      citations.length > 0 ? citations : analysis.sources
    );
    return analysis;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
