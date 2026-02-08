/**
 * Agent 2: Research (with Google Search + RAG)
 * Finds market sizing data using curated links, knowledge base (vector DB), and real-time web search.
 */

import type { SupabaseClient, StartupProfile, MarketResearch } from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { AGENT_SCHEMAS } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";
import { getCuratedLinks, formatLinksForPrompt } from "../curated-links.ts";
import { searchKnowledge, formatKnowledgeForPrompt } from "../knowledge-search.ts";

export async function runResearch(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile
): Promise<MarketResearch | null> {
  const agentName = 'ResearchAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  // P01E: Pass keywords for smart platform search URLs
  const keywords = [profile.idea, profile.industry].filter(Boolean).join(' ');
  const { industryLinks, crossIndustryLinks, platformLinks, matchedIndustry } = getCuratedLinks(profile.industry, keywords);
  const allLinks = [...industryLinks, ...crossIndustryLinks, ...platformLinks];
  const curatedSourcesBlock = formatLinksForPrompt(allLinks);

  // RAG: Search knowledge base (vector DB) for relevant chunks; optional industry filter
  let knowledgeBlock = "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const ragQuery = [profile.idea, profile.industry, "market size TAM SAM SOM growth"].filter(Boolean).join(" ");
  const filterIndustry = profile.industry?.trim() ? profile.industry.trim().toLowerCase() : null;
  if (supabaseUrl && serviceKey && ragQuery) {
    try {
      const { results } = await searchKnowledge(supabaseUrl, serviceKey, ragQuery, filterIndustry);
      if (results.length > 0) {
        console.log("[ResearchAgent] RAG chunks:", results.length);
        knowledgeBlock = formatKnowledgeForPrompt(results, 4000);
      }
    } catch (e) {
      console.warn("[ResearchAgent] RAG search failed (continuing without):", e instanceof Error ? e.message : e);
    }
  }

  const knowledgeSection = knowledgeBlock
    ? `

## Knowledge base (RAG)
Use these internal research chunks when they contain relevant market data, TAM/SAM/SOM, or benchmarks. Cite source and year when used:

${knowledgeBlock}

`
    : "";

  const systemPrompt = `You are a market research analyst. Find market sizing data for this startup idea.

## Preferred Sources (HIGH PRIORITY)
Consult these curated, high-authority sources FIRST for market data, TAM/SAM/SOM estimates, growth rates, and industry benchmarks. Cite them when they contain relevant data:

${curatedSourcesBlock}
${knowledgeSection}
## Research Strategy
1. FIRST: Check the preferred sources and knowledge base above for market sizing data and benchmarks
2. THEN: Use real-time web search to supplement with latest data and fill gaps
3. ALWAYS: Cite the actual sources you used (preferred, knowledge base, and discovered)

Return JSON with exactly these fields:
{
  "tam": <number in USD - Total Addressable Market>,
  "sam": <number in USD - Serviceable Addressable Market>,
  "som": <number in USD - Serviceable Obtainable Market>,
  "methodology": "Brief explanation of how you calculated these numbers",
  "growth_rate": <annual growth rate percentage>,
  "sources": [{"title": "Source name", "url": "https://..."}]
}

Prefer citing the preferred sources when they contain relevant data. Include real URLs.`;

  const industryLine = matchedIndustry
    ? `Industry: ${profile.industry} (category: ${matchedIndustry})`
    : `Industry: ${profile.industry}`;

  const websitesLine = profile.websites && profile.websites.trim() && profile.websites.toLowerCase() !== 'skip'
    ? `\nFounder-provided websites to research: ${profile.websites}`
    : '';

  try {
    // P01: Enable URL Context so Gemini actually reads curated URLs (not just sees them as text)
    const { text, searchGrounding, citations } = await callGemini(
      AGENTS.research.model,
      systemPrompt,
      `Research market size for: ${profile.idea}\n${industryLine}\nCustomer: ${profile.customer}${websitesLine}`,
      { useSearch: true, useUrlContext: true, responseJsonSchema: AGENT_SCHEMAS.research, timeoutMs: AGENT_TIMEOUTS.research }
    );

    const research = extractJSON<MarketResearch>(text);
    if (!research) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }
    await completeRun(
      supabase, sessionId, agentName,
      searchGrounding ? 'ok' : 'partial',
      research,
      citations.length > 0 ? citations : research.sources
    );
    return research;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
