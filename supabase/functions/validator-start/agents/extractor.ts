/**
 * Agent 1: Extractor
 * Extracts structured startup profile from raw input text.
 * 002-EFN: Supports refine mode when interview_context is provided.
 */

import type { SupabaseClient, StartupProfile, InterviewContext } from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { AGENT_SCHEMAS } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";

export async function runExtractor(
  supabase: SupabaseClient,
  sessionId: string,
  inputText: string,
  interviewContext?: InterviewContext,
): Promise<StartupProfile | null> {
  const agentName = 'ExtractorAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  // 002-EFN: Build context-aware prompt
  const hasContext = interviewContext?.version === 1 && interviewContext.extracted;
  const coverage = hasContext ? interviewContext.coverage : null;
  const contextBlock = hasContext
    ? `\n\n## Pre-extracted context from interview (use as starting point — refine, don't re-derive)
${Object.entries(interviewContext.extracted)
  .filter(([, v]) => v)
  .map(([k, v]) => {
    const depth = coverage?.[k] || 'none';
    return `- **${k}** (${depth}): ${v}`;
  })
  .join('\n')}

Note: Fields at "deep" coverage are reliable — use them directly. Fields at "shallow" need inference and sharpening. Fields at "none" should be marked as assumptions.`
    : '';

  // 3D: Seed search queries from chat discoveries
  const discoveries = interviewContext?.discoveredEntities;
  const discoveryBlock = discoveries
    ? `\n\n## Discoveries from interview chat (use to seed search_queries)
${discoveries.competitors?.length ? `- Known competitors: ${discoveries.competitors.join(', ')}` : ''}
${discoveries.urls?.length ? `- Research URLs: ${discoveries.urls.join(', ')}` : ''}
${discoveries.marketData?.length ? `- Market data: ${discoveries.marketData.join('; ')}` : ''}`
    : '';

  const mode = hasContext ? 'REFINE' : 'EXTRACT';
  console.log(`[ExtractorAgent] Mode: ${mode}, context fields: ${hasContext ? Object.values(interviewContext.extracted).filter(Boolean).length : 0}`);

  const systemPrompt = `You are a startup analyst. ${hasContext ? 'Refine and sharpen the pre-extracted context below using the full conversation.' : 'Extract and sharpen the founder\'s idea into structured fields.'}

## Domain Knowledge — Extraction Quality

### Idea Statement Formula
Format: "[Who] gets [what outcome] by [how]"
- Who = specific buyer (job title + company size)
- Outcome = measurable benefit (save time, reduce cost, increase revenue)
- How = the mechanism (not "AI-powered" but the specific approach)

### Problem Quality Bar
- Quantify the pain: "$X,000/month wasted" or "Y hours/week lost"
- Name the current workaround and its specific failure mode
- If founder doesn't quantify, infer from context and mark as assumption

### Customer Structured (PERSONA / WITHOUT / WITH / IMPACT)
This powers Section 2 of the report. The customer_structured field needs a vivid before/after story.
- Persona must feel real: use a plausible name, specific role, and company context
- "Without" must walk through a bad day step-by-step — show the friction, wasted time, and downstream consequences
- "With" must show the same workflow transformed — be specific about what the product changes
- Impact must include at least one hard number (hours, dollars, percentage)
- If the founder didn't describe a specific persona, create one that matches their target customer description

### Problem Structured (WHO / PAIN / TODAY'S FIX)
This is the most important extraction. The problem_structured field powers Section 1 of the report.
- WHO must include buying authority — the person who can write a check, not just the user
- PAIN must have at least one number. If the founder gave none, estimate from industry benchmarks and set evidence_tier to D
- TODAY'S FIX must name real tools (Notion, Excel, Airtable, etc.) and explain the structural gap — why a better spreadsheet won't fix it
- If the problem worsens at scale, note that in the pain field

### Assumption Identification
List 2-5 key assumptions the founder is making. Common categories:
- Problem assumption: "This pain is severe enough to pay for"
- Customer assumption: "This buyer has budget and authority"
- Solution assumption: "This approach solves the root cause"
- Market assumption: "The market is large enough and growing"

### Idea Quality Filters

Apply these 3 founder framework tests to every idea:

**Paul Graham Filters:**
1. WELL vs CRATER: Is this idea a "well" (deep, narrow, specific problem for specific people)
   or a "crater" (shallow, broad, vague — "platform for everything")?
   - Wells are better for startups. Craters need massive funding.
   - Flag as crater if: no specific customer, no specific problem, "platform" language
2. SCHLEP FILTER: Does this require hard, unpleasant, unglamorous work that competitors avoid?
   - Schlep = competitive advantage (others won't bother)
   - No schlep = low barrier to entry (everyone will copy)
3. ORGANIC vs MADE-UP: Did the founder discover this problem through personal experience
   or manufacture it by looking for startup ideas?
   - Organic = founder has domain insight, likely real problem
   - Made-up = higher risk of building something nobody wants

**Why Now Test:**
What changed in the last 1-2 years that makes this possible/necessary NOW?
Categories: technology shift, regulatory change, behavioral shift, market gap, cost reduction.
If no clear "Why Now" → flag timing_risk as HIGH.

**Tarpit Detection:**
Is this a "tarpit" idea — widely attempted with a graveyard of failed startups?
Common tarpits: social networks for niche, marketplace for local services,
"Uber for X", general-purpose AI assistants, recipe/meal planning apps.
If tarpit detected → REQUIRE clear differentiation explanation.
If no differentiation beyond "better UX" or "AI-powered" → flag as tarpit_risk HIGH.

Return JSON with exactly these fields:
{
  "idea": "One clear sentence: [Who] gets [what outcome] by [how]. Example: 'Independent fashion labels get a complete production workflow by using an AI that converts creative briefs into schedules, vendor lists, and marketing assets.'",
  "problem": "The core problem in plain language. Focus on the pain: who has it, how often, and what it costs them today (time, money, or missed opportunities). Quantify where possible.",
  "customer": "Specific buyer — job title, company size, and context. 'Production managers at independent fashion labels with 10-50 employees' not 'fashion companies'.",
  "solution": "How the product solves the problem — be specific about the mechanism, not just the category. 'AI converts moodboards into production schedules and vendor briefs' not 'AI-powered workflow tool'.",
  "differentiation": "What makes this different from alternatives — name the specific gap it fills.",
  "alternatives": "Current alternatives/competitors mentioned by the founder.",
  "validation": "Any existing validation or traction mentioned (customers, revenue, waitlist, letters of intent).",
  "industry": "Primary industry (e.g., fintech, healthtech, saas, ecommerce, fashiontech)",
  "websites": "Any URLs or websites the founder wants researched (empty string if none mentioned)",
  "assumptions": ["Key assumptions the founder is making — things that must be true for this to work"],
  "search_queries": [
    {"purpose": "Market size + growth", "query": "global [SPECIFIC INDUSTRY] market size CAGR forecast 2025-2033"},
    {"purpose": "Industry breakdown", "query": "[SPECIFIC INDUSTRY] market segmentation by type revenue"},
    {"purpose": "AI/tech disruption", "query": "how is AI changing [SPECIFIC INDUSTRY] market automation trends"},
    {"purpose": "Competitors", "query": "[SPECIFIC INDUSTRY] top companies competitive landscape market share"},
    {"purpose": "Pricing models", "query": "[SPECIFIC INDUSTRY] pricing models subscription per-unit enterprise"}
  ],
  "customer_structured": {
    "persona_name": "A realistic name + title. BAD: 'John from Company X'. GOOD: 'Sarah Chen, Production Manager at a 30-person fashion label in LA'.",
    "role_context": "What they're responsible for, who they report to, what budget they control. Include team size and company stage.",
    "workflow_without": "Walk through a specific bad day step-by-step. Show the friction: 'Opens 3 spreadsheets, manually cross-references shoot dates, discovers the studio is double-booked at 4pm.'",
    "workflow_with": "Same day with the product. Be concrete: 'Opens dashboard, sees today's shoots auto-scheduled with vendor confirmations. Reviews AI-generated briefs in 10 minutes instead of 2 hours.'",
    "quantified_impact": "Must include at least ONE number: hours saved per week, cost reduced per month, errors eliminated per quarter. BAD: 'saves time'. GOOD: '4 hours/week saved, 60% fewer revision rounds, campaigns launch 5 days faster'."
  },
  "problem_structured": {
    "who": "Specific role with buying authority + company type + team size + budget context. BAD: 'e-commerce companies'. GOOD: 'Creative Directors at mid-market e-commerce brands (10-250 employees) who own the production budget.'",
    "pain": "Quantify the cost: hours wasted, dollars lost, delays caused per week/month/quarter. BAD: 'planning takes too long'. GOOD: 'Teams waste 20-30 hours per shoot on manual planning — at $75/hr blended rate, that is $1,500-$2,250 lost per shoot.'",
    "todays_fix": "Name the specific tools/workarounds AND explain the structural failure. BAD: 'they use spreadsheets'. GOOD: 'Fragmented spreadsheets and Notion pages that cannot capture technical lighting specs or spatial dimensions — forcing last-minute rework on 40% of shoots.'",
    "evidence_tier": "A if founder provided revenue/usage data, B if prototype/beta evidence, C if survey/interview data, D if desk research or intuition only"
  },
  "idea_quality": {
    "well_or_crater": "well or crater — wells are deep, narrow, specific; craters are shallow, broad, vague",
    "schlep_factor": "high (hard work competitors avoid), medium, or low (easy to copy)",
    "organic_or_manufactured": "organic (founder experienced the problem) | manufactured (looking for ideas) | unclear",
    "why_now": {
      "trigger": "What specifically changed in 1-2 years",
      "category": "technology | regulatory | behavioral | market_gap | cost_reduction | none",
      "confidence": "strong | moderate | weak | none"
    },
    "tarpit_flag": false,
    "tarpit_reasoning": "Empty if not a tarpit, explanation if it is"
  }
}
${contextBlock}
If information is not provided, make reasonable inferences based on context. For websites, only include URLs that the user explicitly mentioned — do not invent any.

## Search Query Rules (CRITICAL)
Generate 5 purpose-tagged queries using the SPECIFIC industry name — never generic terms.
- ALWAYS name the exact industry vertical: "eCommerce product photography" not "AI content platform"
- ALWAYS name the exact market: "commercial photography services" not "creative tools"
- Include the words "market size", "CAGR", "forecast", "2025-2033" for sizing queries
- Include competitor names when known for competitive landscape queries
- BAD: "AI-powered content creation platform market size" (too vague, returns generic AI market data)
- GOOD: "global eCommerce product photography market size CAGR forecast 2025-2033" (returns exact market reports)
- BAD: "content planning competitors" (too broad)
- GOOD: "Soona Squareshot Snappr eCommerce photography competitive landscape market share" (finds real data)

For assumptions, identify 2-5 things the founder is betting on. If discoveries from the interview chat are provided, incorporate known competitors and market data into the profile and use them to generate more targeted search queries.${discoveryBlock}`;

  try {
    const { text } = await callGemini(
      AGENTS.extractor.model,
      systemPrompt,
      `${hasContext ? 'Refine' : 'Extract'} startup profile from:\n\n${inputText}`,
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
