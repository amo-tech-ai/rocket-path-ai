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

  // 002-EFN: Use Extractor's search_queries when available for more targeted research
  // 022-SKI: Handle both string[] and {purpose, query}[] formats
  const rawQueries = profile.search_queries || [];
  const searchQueryStrings: string[] = rawQueries.map((q: string | { purpose: string; query: string }) =>
    typeof q === 'string' ? q : q.query
  );
  const hasSearchQueries = searchQueryStrings.length > 0;
  if (hasSearchQueries) {
    console.log(`[ResearchAgent] Using ${searchQueryStrings.length} search queries from Extractor`);
  }

  // P01E: Pass keywords for smart platform search URLs
  const keywords = [profile.idea, profile.industry].filter(Boolean).join(' ');
  const { allLinks, matchedIndustry } = getCuratedLinks(profile.industry, keywords);
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

HARD CONSTRAINTS (non-negotiable):
1. The market is defined by WHAT customers buy (the activity/category), NOT the technology used (HOW).
   - If the startup uses AI to serve photographers → market = "product photography services", NOT "AI tools"
   - If the startup uses AI for HR screening → market = "recruitment services", NOT "AI/ML market"
   - Only use "AI market" if AI itself is the product being sold (e.g., AI model marketplace)
2. Output 1 primary_market_label (the specific market) and 2 alternate_market_labels.
3. REQUIRED: Include a bottom_up_table with at least 1 row:
   - buyer_segment: who buys this (specific role + company type)
   - buyer_count: how many exist (cite source or mark "estimated")
   - price_per_year: average annual spend (cite source or state assumption basis)
   - frequency: one-time | annual | monthly
   - resulting_sam: buyer_count × price_per_year
   If you cannot produce this table, explain why in methodology and set confidence < 40.

## Domain Knowledge — Market Sizing Methodology

### Three Approaches (use bottom-up as primary)
1. **Bottom-up (preferred):** Count actual buyers × realistic price × purchase frequency
   - Example: 50,000 target companies × $24K/year avg contract = $1.2B SAM
2. **Top-down:** Start from total market reports, narrow by segment
3. **Value theory:** Calculate total value of problem solved × willingness to pay

### TAM/SAM/SOM Formulas
- TAM = Total global spend on this problem category
- SAM = TAM × (% reachable by your model/geography/segment)
- SOM = SAM × realistic capture rate (see table below)

### SOM Calibration by Stage
- Pre-seed: 0.1-0.5% of SAM (require TAM from credible report)
- Seed: 1-3% of SAM (require bottoms-up math + early traction)
- Series A: 3-5% of SAM (require repeatable growth + distribution)
If SOM > 5% of SAM at early stage, flag as optimistic.

### Growth Rate Calibration
- "Hot" = 20%+ CAGR (AI, cybersecurity, climate tech)
- "Healthy" = 10-20% CAGR (most B2B SaaS, fintech)
- "Mature" = 5-10% CAGR (retail, manufacturing)
- "Declining" = <5% CAGR (print media, legacy systems)

### Value Theory Sizing (Third Method)
In addition to bottom-up and top-down, apply VALUE THEORY:
  Value Theory TAM = (Pain cost per user per year) × (Total addressable users) × (Capture rate %)
  Pain cost: How much does the problem cost the user today? (time × hourly rate, or direct $ cost)
  Addressable users: How many people have this exact problem?
  Capture rate: What % of the value can you capture as price? (typically 10-30%)

CROSS-VALIDATE all three methods:
  - If bottom-up and top-down differ by >3x → flag discrepancy, explain why
  - If value theory suggests TAM < bottom-up → the problem may not be painful enough
  - Present all three numbers; use the MEDIAN as the primary estimate

### Source Quality Hierarchy
1. Government data (Census, BLS, SEC) — gold standard
2. Analyst firms (Gartner, McKinsey, BCG) — high credibility
3. Industry reports (Grand View, Precedence) — good for sizing
4. News articles — useful for trends, weak for sizing

### Source Quality Requirements
- Minimum 3 DIFFERENT sources per major data point (not 3 citations from same report)
- Flag source age: data >2 years old gets a STALE DATA warning
- Require at least 1 bottom-up data point (actual buyer counts, not just TAM projections)

### Trend & Maturity Analysis
  Growth trajectory: accelerating (CAGR increasing YoY) | steady | decelerating | declining
  Adoption curve: Innovators (<2.5%) | Early Adopters (2.5-16%) | Early Majority (16-50%) | Late Majority (50-84%) | Laggards (>84%)
  Market maturity: emerging (<$1B, few players) | growing ($1-10B, many entrants) | mature ($10B+, consolidated) | declining (shrinking TAM)

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
  "sources": [{"title": "Source name", "url": "https://..."}],
  "value_theory_tam": <number in USD — TAM calculated via value theory method>,
  "sizing_cross_validation": {
    "bottom_up": <number>,
    "top_down": <number>,
    "value_theory": <number>,
    "max_discrepancy_factor": <number — e.g. 2.5 means largest is 2.5x smallest>,
    "primary_estimate": "median or whichever method is most credible"
  },
  "source_freshness": [{"source": "Source name", "year": 2025, "stale_flag": false}],
  "trend_analysis": {
    "trajectory": "accelerating | steady | decelerating | declining",
    "adoption_curve_position": "innovators | early_adopters | early_majority | late_majority | laggards",
    "market_maturity": "emerging | growing | mature | declining"
  },
  "primary_market_label": "The specific market WHAT — e.g. 'eCommerce product photography services'",
  "alternate_market_labels": ["Alternative label 1", "Alternative label 2"],
  "bottom_up_table": [
    {
      "buyer_segment": "e.g. Mid-market eCommerce brands (50-500 employees)",
      "buyer_count": 45000,
      "price_per_year": 24000,
      "frequency": "annual",
      "resulting_sam": 1080000000
    }
  ],
  "confidence": 65
}

Prefer citing the preferred sources when they contain relevant data. Include real URLs.`;

  const industryLine = matchedIndustry
    ? `Industry: ${profile.industry} (category: ${matchedIndustry})`
    : `Industry: ${profile.industry}`;

  const websitesLine = profile.websites && profile.websites.trim() && profile.websites.toLowerCase() !== 'skip'
    ? `\nFounder-provided websites to research: ${profile.websites}`
    : '';

  // 002-EFN: Append Extractor's targeted search queries to the user prompt
  // 022-SKI: Support purpose-tagged queries
  const searchQueriesLine = hasSearchQueries
    ? `\n\nSuggested search queries (from extraction analysis):\n${rawQueries.map((q: string | { purpose: string; query: string }, i: number) =>
        typeof q === 'string' ? `${i + 1}. ${q}` : `${i + 1}. [${q.purpose}] ${q.query}`
      ).join('\n')}`
    : '';

  try {
    // P01: Enable URL Context so Gemini actually reads curated URLs (not just sees them as text)
    const { text, searchGrounding, citations } = await callGemini(
      AGENTS.research.model,
      systemPrompt,
      `Research the specific market this startup operates in.

Startup: ${profile.idea}
${industryLine}
Target customer: ${profile.customer}
Problem being solved: ${profile.problem || 'Not specified'}

IMPORTANT: Search for the SPECIFIC industry market (e.g., "eCommerce product photography market" not "AI tools market"). The startup's technology (AI, SaaS, etc.) is the HOW — search for the market of WHAT they sell to.
Include: current market valuation, CAGR, forecast period, regional breakdown, key drivers, major competitors, pricing models, and demand by segment.${websitesLine}${searchQueriesLine}`,
      { useSearch: true, useUrlContext: true, responseJsonSchema: AGENT_SCHEMAS.research, timeoutMs: AGENT_TIMEOUTS.research }
    );

    const research = extractJSON<MarketResearch>(text);
    if (!research) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }

    // Smart validation: TAM >= SAM >= SOM with transparent corrections
    const corrections: string[] = [];

    if (typeof research.tam === 'number' && typeof research.sam === 'number' && typeof research.som === 'number') {
      const origSam = research.sam, origSom = research.som;

      // Use bottom-up table SAM if available and hierarchy broken
      if (research.sam > research.tam) {
        const bottomUpSam = research.bottom_up_table?.[0]?.resulting_sam;
        if (bottomUpSam && bottomUpSam > 0 && bottomUpSam <= research.tam) {
          research.sam = bottomUpSam;
          corrections.push(`SAM corrected from $${origSam.toLocaleString()} to bottom-up table value $${bottomUpSam.toLocaleString()}`);
        } else {
          research.sam = Math.round(research.tam * 0.3);
          corrections.push(`SAM corrected from $${origSam.toLocaleString()} to 30% of TAM ($${research.sam.toLocaleString()}) — bottom-up data unavailable`);
        }
      }

      // SOM calibration by stage (not arbitrary 10%)
      if (research.som > research.sam) {
        research.som = Math.round(research.sam * 0.003);
        corrections.push(`SOM corrected from $${origSom.toLocaleString()} to 0.3% of SAM ($${research.som.toLocaleString()}) — pre-seed calibration`);
      }

      // SOM floor: if SOM < $500K but TAM > $1B, flag as likely broken
      if (research.som < 500_000 && research.tam > 1_000_000_000) {
        corrections.push(`SOM ($${research.som.toLocaleString()}) unusually low for a $${(research.tam / 1e9).toFixed(1)}B market — verify capture rate assumptions`);
      }

      // CAGR reasonableness check
      if (typeof research.growth_rate === 'number' && research.growth_rate > 40) {
        const maturity = research.trend_analysis?.market_maturity;
        if (maturity && maturity !== 'emerging') {
          corrections.push(`Growth rate ${research.growth_rate}% exceeds 40% for a ${maturity} market — verify source`);
        }
      }

      if (corrections.length > 0) {
        console.warn(`[ResearchAgent] Corrections applied: ${corrections.join('; ')}`);
        research.methodology = `${research.methodology} [Corrections: ${corrections.join('. ')}]`;
      }
    }

    // Validate bottom-up table presence
    if (!research.bottom_up_table || !Array.isArray(research.bottom_up_table) || research.bottom_up_table.length === 0) {
      corrections.push('Missing bottom-up evidence — market sizing relies on top-down estimates only');
    }

    // Store corrections for transparency
    research.corrections_applied = corrections;

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
