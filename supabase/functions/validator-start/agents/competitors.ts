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
import { searchKnowledge, formatKnowledgeForPrompt } from "../knowledge-search.ts";

export async function runCompetitors(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile
): Promise<CompetitorAnalysis | null> {
  const agentName = 'CompetitorAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  // P01E: Pass keywords for smart platform search URLs (competitors-focused)
  const keywords = [profile.idea, profile.alternatives].filter(Boolean).join(' ');
  const { allLinks, matchedIndustry } = getCuratedLinks(profile.industry, keywords);
  const curatedSourcesBlock = formatLinksForPrompt(allLinks);

  // RAG: Search knowledge base for competitor/industry reports; same pattern as ResearchAgent
  let knowledgeBlock = "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const ragQuery = [profile.idea, profile.industry, profile.alternatives, "competitors market landscape"].filter(Boolean).join(" ");
  const filterIndustry = profile.industry?.trim() ? profile.industry.trim().toLowerCase() : null;
  if (supabaseUrl && serviceKey && ragQuery) {
    try {
      const { results } = await searchKnowledge(supabaseUrl, serviceKey, ragQuery, filterIndustry);
      if (results.length > 0) {
        console.log("[CompetitorAgent] RAG chunks:", results.length);
        knowledgeBlock = formatKnowledgeForPrompt(results, 4000);
      }
    } catch (e) {
      console.warn("[CompetitorAgent] RAG search failed (continuing without):", e instanceof Error ? e.message : e);
    }
  }

  const knowledgeSection = knowledgeBlock
    ? `

## Knowledge base (RAG)
Use these internal research chunks when they contain competitor lists, market maps, or industry landscapes. Cite source and year when used:

${knowledgeBlock}

`
    : "";

  const systemPrompt = `You are a competitive intelligence analyst. Identify who the founder is really up against — be specific and honest.

## Domain Knowledge — Competitive Analysis

### Competitor Tiering
- Tier 1 (direct): Same problem, same customer, overlapping features — these are existential threats
- Tier 2 (adjacent): Same problem, different customer OR same customer, different solution
- Tier 3 (indirect): Alternatives including spreadsheets, manual processes, status quo (doing nothing)
ALWAYS include status quo as a competitor — it's the most common reason startups fail.

### Threat Level Calibration
- HIGH: Well-funded (>$10M raised) + high feature overlap + growing fast + same segment
- MEDIUM: Partial feature overlap OR bootstrapped with traction OR different segment
- LOW: Different segment OR declining/stagnant OR very early stage

### Competitive Moat Types (flag which the founder could build)
- Network effects — value grows with users
- Data moat — proprietary dataset improving over time
- Switching costs — deep workflow integration
- Scale economies — decreasing unit cost
- Brand/community — trust built over years
- Regulatory — compliance as barrier

### Positioning Analysis (April Dunford Method)
For the founder's startup, determine positioning using this 6-step method:
1. Competitive Alternatives: What would customers use if you didn't exist? (include "do nothing")
2. Unique Attributes: What capabilities do you have that alternatives don't?
3. Value: What value do those unique attributes enable for customers?
4. Target Customer: Who cares most about that value? (specific segment)
5. Market Category: What context makes the value obvious to the target?
6. Positioning Statement: "[Product] is a [category] that [unique value] for [target customer]
   unlike [alternatives] because [unique attributes]."

### Battlecard for Top Competitor
For the #1 direct competitor (highest threat_level), generate:
  - Win themes: 3 reasons a customer would choose the founder over this competitor
  - Lose themes: 3 reasons a customer would choose the competitor instead
  - Counter-arguments: For each lose theme, what can the founder say/do to neutralize it
  - Moat durability: Can this competitor copy the founder's advantage within 6 months?
    YES → differentiation is WEAK (flag it). NO → explain what makes it defensible.

### White Space Identification
After mapping all competitors, identify the positioning GAP:
  - What customer segment is underserved?
  - What feature combination does no competitor offer?
  - What price point is unaddressed?
  State the white space as a single clear sentence.

### Relevance Filtering Rules
- Only include competitors actually relevant to this startup's segment
- If a competitor serves enterprise and the startup targets SMB, note the segment difference
- Verify competitors still exist and are active (not acquired/shut down)
- Deduplicate: if same company appears under different names, merge

### Founder-Provided Competitors (MANDATORY)
When the user prompt includes "Founder-provided competitor websites:", these are companies the
founder encounters daily. You MUST:
1. Include EVERY founder-provided competitor as a direct_competitor entry — never omit them
2. Analyze their actual services, pricing, and positioning from their website content
3. Populate source_url with the founder-provided URL
4. Build SWOT (strengths/weaknesses) from real product details found on their site
5. If a URL fails to load, still include the competitor using Google Search data and note
   "Website unavailable — analysis based on public sources" in the description
Founder-provided competitors take priority. Then add 2-3 MORE competitors found via Google Search
to complete the competitive landscape. The founder named these for a reason — they are the
real threats the founder encounters daily.

## Writing style:
- Describe each competitor in plain language: what they do, who they serve, and why they matter
- BAD: "A comprehensive enterprise solution leveraging advanced technology for industry verticals"
- GOOD: "PR and event management platform used by 1,200+ luxury brands. Their main strength is a decade of historical performance data."
- For strengths/weaknesses: be specific and actionable, not generic
- Market gaps should explain WHY the gap exists, not just name it

## Preferred Sources (HIGH PRIORITY)
Consult these curated sources FIRST for competitor data, market maps, funding rounds, and industry landscapes:

${curatedSourcesBlock}
${knowledgeSection}
## Research Strategy
1. FIRST: Check preferred sources and knowledge base for competitor lists, market maps, and landscapes
2. THEN: Use real-time web search for latest funding, launches, pivots, and news
3. CROSS-REFERENCE: Competitors in both curated, knowledge base, and search sources are significant players

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
  "sources": [{"title": "Source", "url": "https://..."}],
  "positioning": {
    "competitive_alternatives": ["What customers use instead, including 'do nothing'"],
    "unique_attributes": ["Capabilities alternatives lack"],
    "value_proposition": "The value those unique attributes enable",
    "target_segment": "Who cares most about that value",
    "market_category": "Context that makes the value obvious",
    "positioning_statement": "[Product] is a [category] that [value] for [target] unlike [alternatives] because [attributes]"
  },
  "battlecard": {
    "competitor_name": "Name of #1 direct threat",
    "win_themes": ["3 reasons customer picks founder"],
    "lose_themes": ["3 reasons customer picks competitor"],
    "counter_arguments": ["Neutralize each lose theme"],
    "moat_durability": "defensible | weak | unknown"
  },
  "white_space": "Single sentence describing the unaddressed positioning gap"
}

Find 3-5 direct competitors and 2-3 indirect. Cite preferred sources when they contributed.`;

  const industryLine = matchedIndustry
    ? `Industry: ${profile.industry} (category: ${matchedIndustry})`
    : `Industry: ${profile.industry}`;

  // 036-CUC: Match label to system prompt mandate ("Founder-provided competitor websites:")
  const websitesLine = profile.websites && profile.websites.trim() && profile.websites.toLowerCase() !== 'skip'
    ? `\nFounder-provided competitor websites: ${profile.websites}`
    : '';

  // 036-CUC: Enable URL Context only when founder provided competitor URLs.
  // Without URLs → fast path (search only, ~15-20s). With URLs → Gemini visits sites (~30-40s).
  // Safe because CompetitorAgent runs as background promise — doesn't block critical path.
  const hasFounderUrls = websitesLine.length > 0;
  if (hasFounderUrls) {
    console.log(`[CompetitorAgent] Founder URLs detected — enabling URL Context: ${profile.websites}`);
  }

  try {
    const { text, searchGrounding, citations, urlContextMetadata } = await callGemini(
      AGENTS.competitors.model,
      systemPrompt,
      `Find competitors for: ${profile.idea}\n${industryLine}\nExisting alternatives mentioned: ${profile.alternatives}${websitesLine}`,
      { useSearch: true, useUrlContext: hasFounderUrls, responseJsonSchema: AGENT_SCHEMAS.competitors, timeoutMs: AGENT_TIMEOUTS.competitors }
    );

    // 036-CUC: Log URL fetch results for observability
    if (urlContextMetadata?.length) {
      const fetched = urlContextMetadata.filter(m => m.status === 'fetched').length;
      const failed = urlContextMetadata.filter(m => m.status !== 'fetched');
      console.log(`[CompetitorAgent] URL Context: ${fetched}/${urlContextMetadata.length} URLs fetched`);
      if (failed.length > 0) {
        console.warn(`[CompetitorAgent] URL fetch failures:`, failed.map(f => `${f.url} (${f.status})`).join(', '));
      }
    }

    const analysis = extractJSON<CompetitorAnalysis>(text);
    if (!analysis) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }

    // 022-SKI: Post-processing — deduplicate competitors by name
    if (analysis.direct_competitors?.length) {
      const seen = new Set<string>();
      analysis.direct_competitors = analysis.direct_competitors.filter(c => {
        const key = c.name.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    // Validate threat levels are valid values
    for (const c of [...(analysis.direct_competitors || []), ...(analysis.indirect_competitors || [])]) {
      if (!['high', 'medium', 'low'].includes(c.threat_level)) {
        c.threat_level = 'medium';
      }
    }

    // 036-CUC: Safety net — ensure founder-provided competitors appear in results.
    // Primary mechanism is the system prompt mandate, but LLMs are non-deterministic.
    if (hasFounderUrls && profile.websites) {
      const founderDomains = profile.websites
        .match(/https?:\/\/([^/\s,]+)/gi)
        ?.map(url => {
          try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); }
          catch { return null; }
        })
        .filter(Boolean) as string[] || [];

      const existingNames = new Set(
        [...(analysis.direct_competitors || []), ...(analysis.indirect_competitors || [])]
          .map(c => c.name.toLowerCase().trim())
      );
      const existingUrls = new Set(
        [...(analysis.direct_competitors || []), ...(analysis.indirect_competitors || [])]
          .filter(c => c.source_url)
          .map(c => { try { return new URL(c.source_url!).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } })
      );

      for (const domain of founderDomains) {
        const companyName = domain.replace(/\.\w+$/, ''); // "squareshot" from "squareshot.com"
        const alreadyPresent = existingNames.has(companyName) || existingUrls.has(domain) ||
          [...existingNames].some(n => n.includes(companyName) || companyName.includes(n));

        if (!alreadyPresent) {
          console.warn(`[CompetitorAgent] Founder URL ${domain} missing from Gemini results — adding stub`);
          analysis.direct_competitors = analysis.direct_competitors || [];
          analysis.direct_competitors.push({
            name: companyName.charAt(0).toUpperCase() + companyName.slice(1),
            description: `Founder-identified competitor (${domain}). Website data unavailable — analysis based on public sources.`,
            strengths: ['Identified as direct competitor by the founder'],
            weaknesses: ['Analysis pending — limited public data available'],
            threat_level: 'medium',
            source_url: `https://${domain}`,
          });
        }
      }
    }

    // 036-CUC: Enrich output with URL context metadata for debugging/observability
    const enrichedAnalysis = {
      ...analysis,
      ...(urlContextMetadata?.length ? { _url_context: urlContextMetadata } : {}),
    };

    await completeRun(
      supabase, sessionId, agentName,
      searchGrounding ? 'ok' : 'partial',
      enrichedAnalysis,
      citations.length > 0 ? citations : analysis.sources
    );
    return analysis;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
