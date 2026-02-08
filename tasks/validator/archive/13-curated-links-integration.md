# Prompt 13 — Curated Industry Links as Preferred Sources

> **Source:** Research assets `/research/links/` (500+ URLs, 14 verticals) | **Priority:** P1 | **Phase:** Lightweight Knowledge Integration
> **Prerequisite:** None. This is a zero-infrastructure prompt-injection approach — no vector DB, no embeddings, no RAG pipeline needed.
> **Relationship to Prompt 03:** This is a pragmatic alternative to the full RAG pipeline (03-knowledge-integration.md). Prompt 03 requires seeding pgvector, building an embedding pipeline, and wiring semantic search. This prompt achieves 80% of the value with 10% of the effort by injecting curated links directly into agent prompts. Can be replaced by Prompt 03 later when the full RAG pipeline is ready.

---

## Progress Tracker

| # | Task | Status | % | Note |
|---|------|:------:|--:|------|
| 1 | Create `curated-links.ts` in edge function | Not Started | 0% | Industry-to-URLs map + fallback logic |
| 2 | Modify `research.ts` prompt injection | Not Started | 0% | System prompt + user prompt changes |
| 3 | Modify `competitors.ts` prompt injection | Not Started | 0% | System prompt + user prompt changes |
| 4 | Deploy and verify | Not Started | 0% | No schema/contract changes |

---

## Strategy: Prompt-Level Link Injection (No RAG Required)

### Why This Works

Gemini 3 Flash with `googleSearch` enabled can **fetch and analyze URLs given directly in the prompt**. When we tell the model "prioritize these sources first," it:

1. Uses the curated URLs as **anchor points** for its Google Search grounding
2. Cites them in structured output (the `sources` array already exists in both agents)
3. Falls back to open web search only when curated sources lack the specific data needed

This is effectively "prompt-level RAG" — we give the model the best sources upfront, and it augments with live search as needed.

### Zero Breaking Changes

| Aspect | Before | After |
|--------|--------|-------|
| Function signatures | `runResearch(supabase, sessionId, profile)` | Same |
| Response schema | `MarketResearch` / `CompetitorAnalysis` | Same |
| Google Search | Enabled | Still enabled (fallback) |
| Gemini model | `gemini-3-flash-preview` | Same |
| Timeout budget | 30s each | Same |
| Pipeline orchestration | Parallel via `Promise.allSettled` | Same |

---

## File 1: `curated-links.ts` (NEW)

> Location: `supabase/functions/validator-start/curated-links.ts`

### Purpose

A single TypeScript module that maps `profile.industry` to the top curated URLs. Self-contained, no external dependencies.

### Industry Mapping

Map the `StartupProfile.industry` field (free-text from ExtractorAgent) to the correct curated link set using keyword matching:

```typescript
// Industry keyword → link set mapping
const INDUSTRY_ALIASES: Record<string, string> = {
  // Direct matches
  'healthcare': 'healthcare',
  'health': 'healthcare',
  'medical': 'healthcare',
  'biotech': 'healthcare',
  'healthtech': 'healthcare',
  'digital health': 'healthcare',

  'financial services': 'financial_services',
  'fintech': 'financial_services',
  'banking': 'financial_services',
  'insurance': 'financial_services',
  'insurtech': 'financial_services',
  'payments': 'financial_services',

  'saas': 'saas_ai',
  'software': 'saas_ai',
  'ai': 'saas_ai',
  'artificial intelligence': 'saas_ai',
  'enterprise software': 'saas_ai',
  'b2b': 'saas_ai',

  'fashion': 'fashion',
  'apparel': 'fashion',
  'luxury': 'fashion',
  'clothing': 'fashion',

  'ecommerce': 'retail_ecommerce',
  'e-commerce': 'retail_ecommerce',
  'retail': 'retail_ecommerce',
  'marketplace': 'retail_ecommerce',
  'dtc': 'retail_ecommerce',
  'd2c': 'retail_ecommerce',

  'education': 'education',
  'edtech': 'education',
  'learning': 'education',

  'cybersecurity': 'cybersecurity',
  'security': 'cybersecurity',
  'infosec': 'cybersecurity',

  'legal': 'legal_compliance',
  'legaltech': 'legal_compliance',
  'compliance': 'legal_compliance',
  'regtech': 'legal_compliance',

  'manufacturing': 'manufacturing',
  'industrial': 'manufacturing',
  'factory': 'manufacturing',

  'marketing': 'marketing_sales_crm',
  'sales': 'marketing_sales_crm',
  'crm': 'marketing_sales_crm',
  'advertising': 'marketing_sales_crm',
  'adtech': 'marketing_sales_crm',

  'media': 'media_entertainment',
  'entertainment': 'media_entertainment',
  'gaming': 'media_entertainment',
  'content': 'media_entertainment',

  'real estate': 'real_estate_proptech',
  'proptech': 'real_estate_proptech',
  'property': 'real_estate_proptech',

  'supply chain': 'supply_chain_logistics',
  'logistics': 'supply_chain_logistics',
  'shipping': 'supply_chain_logistics',
  'freight': 'supply_chain_logistics',

  'customer support': 'customer_support',
  'customer service': 'customer_support',
  'helpdesk': 'customer_support',
  'contact center': 'customer_support',

  'travel': 'travel_tourism',
  'tourism': 'travel_tourism',
  'hospitality': 'travel_tourism',
};
```

### Link Data Structure

Each industry has its **top 5 links** (highest scored from the markdown files) plus the **top 5 cross-industry startup sites** as fallback:

```typescript
interface CuratedLink {
  source: string;   // e.g. "BCG AI Radar 2026"
  url: string;      // e.g. "https://www.bcg.com/..."
  score: number;    // 81-95 (from scoring rubric)
}

interface IndustryLinks {
  industry: string;
  links: CuratedLink[];
}
```

### Fallback Logic

```
1. Match profile.industry → INDUSTRY_ALIASES → get industry key
2. If match found → return top 5 industry links + top 5 cross-industry links
3. If NO match → return top 5 cross-industry links only (TechCrunch, Crunchbase, VentureBeat, PitchBook, CB Insights)
4. Always return at least cross-industry links (never empty)
```

### Exported Function

```typescript
export function getCuratedLinks(industry: string): {
  industryLinks: CuratedLink[];
  crossIndustryLinks: CuratedLink[];
  matchedIndustry: string | null;
}
```

---

## File 2: `research.ts` Changes (MODIFY)

> Location: `supabase/functions/validator-start/agents/research.ts`

### What Changes

Only the **prompt construction** changes. No changes to:
- Function signature
- Gemini call parameters (`useSearch`, `responseJsonSchema`, `timeoutMs`)
- Error handling
- DB writes

### Current System Prompt (lines 20-32)

```
You are a market research analyst. Using real-time web search, find market sizing data for this startup idea.
...
Use industry reports, analyst data, and credible sources. Include real URLs.
```

### New System Prompt

```
You are a market research analyst. Find market sizing data for this startup idea.

## Preferred Sources (HIGH PRIORITY)
Consult these curated, high-authority sources FIRST for market data, TAM/SAM/SOM estimates, growth rates, and industry benchmarks. Cite them when they contain relevant data:

${curatedSourcesBlock}

## Research Strategy
1. FIRST: Check the preferred sources above for market sizing data, growth rates, and industry benchmarks
2. THEN: Use real-time web search to supplement with the latest data, validate numbers, and fill gaps
3. ALWAYS: Cite the actual sources you used (both preferred and discovered)

Return JSON with exactly these fields:
{
  "tam": <number in USD - Total Addressable Market>,
  "sam": <number in USD - Serviceable Addressable Market>,
  "som": <number in USD - Serviceable Obtainable Market>,
  "methodology": "Brief explanation of how you calculated these numbers",
  "growth_rate": <annual growth rate percentage>,
  "sources": [{"title": "Source name", "url": "https://..."}]
}

Prefer citing the preferred sources when they contain relevant data. Include real URLs for all sources.
```

### Where `curatedSourcesBlock` Comes From

```typescript
import { getCuratedLinks } from "../curated-links.ts";

// Inside runResearch(), before building the system prompt:
const { industryLinks, crossIndustryLinks, matchedIndustry } = getCuratedLinks(profile.industry);
const allLinks = [...industryLinks, ...crossIndustryLinks];

const curatedSourcesBlock = allLinks.length > 0
  ? allLinks.map(l => `- ${l.source} (authority: ${l.score}/100): ${l.url}`).join('\n')
  : 'No curated sources available for this industry. Rely on web search.';
```

### Current User Prompt (line 38)

```
Research market size for: ${profile.idea}\nIndustry: ${profile.industry}\nCustomer: ${profile.customer}
```

### New User Prompt

```typescript
const industryContext = matchedIndustry
  ? `Industry: ${profile.industry} (matched: ${matchedIndustry})`
  : `Industry: ${profile.industry}`;

const userPrompt = `Research market size for: ${profile.idea}\n${industryContext}\nCustomer: ${profile.customer}`;
```

### Token Budget Impact

- 5 curated links = ~150 tokens added to system prompt
- 10 links (industry + cross-industry) = ~300 tokens
- Well within the 8192 `maxOutputTokens` and does not affect the 30s timeout meaningfully

---

## File 3: `competitors.ts` Changes (MODIFY)

> Location: `supabase/functions/validator-start/agents/competitors.ts`

### Same Pattern as Research

### New System Prompt

```
You are a competitive intelligence analyst. Identify competitors for this startup.

## Preferred Sources (HIGH PRIORITY)
Consult these curated, high-authority sources FIRST for competitor data, funding rounds, market maps, and industry landscapes. Cite them when they contain relevant data:

${curatedSourcesBlock}

## Research Strategy
1. FIRST: Check the preferred sources above for competitor lists, market maps, and industry landscapes
2. THEN: Use real-time web search for the latest funding, launches, pivots, and news
3. CROSS-REFERENCE: If a competitor appears in both curated and search sources, it's likely a significant player — prioritize it

Return JSON with exactly these fields:
{
  "direct_competitors": [...],
  "indirect_competitors": [...],
  "market_gaps": ["Gap 1", "Gap 2"],
  "sources": [{"title": "Source", "url": "https://..."}]
}

Find 3-5 direct competitors and 2-3 indirect. Include real company data and URLs.
Cite the preferred sources when they contributed to your analysis.
```

---

## Implementation Sequence

### Step 1: Create `curated-links.ts`

Create the new file with:
- `INDUSTRY_ALIASES` mapping (keyword → industry key)
- `INDUSTRY_LINKS` data (top 5 links per industry, extracted from markdown files)
- `CROSS_INDUSTRY_LINKS` (top 5 from `16-startup-sites-top-20.md`)
- `getCuratedLinks()` function with fuzzy matching and fallback
- Zero external dependencies (pure TypeScript, no imports)

### Step 2: Modify `research.ts`

- Add `import { getCuratedLinks } from "../curated-links.ts";`
- Call `getCuratedLinks(profile.industry)` at the start of `runResearch()`
- Build `curatedSourcesBlock` string from returned links
- Replace `systemPrompt` with the enhanced version (preferred sources section)
- Keep everything else identical

### Step 3: Modify `competitors.ts`

- Same pattern as research.ts
- Add import, call `getCuratedLinks`, build prompt block
- Replace system prompt with competitor-focused version
- Keep everything else identical

### Step 4: Deploy and Verify

- Deploy edge function: `supabase functions deploy validator-start`
- Test with known industries: "fintech", "healthcare", "saas"
- Test with unknown industry: "beekeeping" (should fallback to cross-industry links)
- Verify JSON response schemas are unchanged
- Check that `sources` in output include curated URLs when relevant

---

## Example: Full Prompt for a Fintech Startup

**Input:** `{ industry: "fintech", idea: "AI-powered credit scoring for gig workers", customer: "gig economy workers" }`

**System prompt sent to Gemini (ResearchAgent):**

```
You are a market research analyst. Find market sizing data for this startup idea.

## Preferred Sources (HIGH PRIORITY)
Consult these curated, high-authority sources FIRST for market data, TAM/SAM/SOM estimates, growth rates, and industry benchmarks. Cite them when they contain relevant data:

- BCG AI Radar 2026 (authority: 95/100): https://www.bcg.com/publications/2026/as-ai-investments-surge-ceos-take-the-lead
- McKinsey — GenAI in banking risk & compliance (authority: 94/100): https://www.mckinsey.com/capabilities/risk-and-resilience/our-insights/how-generative-ai-can-help-banks-manage-risk-and-compliance
- Deloitte Banking Outlook 2026 (authority: 92/100): https://www.deloitte.com/us/en/insights/industry/financial-services/financial-services-industry-outlooks/banking-industry-outlook.html
- PwC CEO Survey 2026 (authority: 91/100): https://www.pwc.com/gx/en/ceo-survey/2026/pwc-ceo-survey-2026.pdf
- SEC — AI and capital markets (authority: 88/100): https://www.sec.gov
- TechCrunch — Startups (authority: 95/100): https://techcrunch.com/category/startups/
- Crunchbase News (authority: 93/100): https://news.crunchbase.com/
- VentureBeat (authority: 91/100): https://venturebeat.com/
- PitchBook — News (authority: 88/100): https://pitchbook.com/news/articles
- CB Insights — Tech trends 2026 (authority: 86/100): https://www.cbinsights.com/research/report/top-tech-trends-2026/

## Research Strategy
1. FIRST: Check the preferred sources above for market sizing data, growth rates, and industry benchmarks
2. THEN: Use real-time web search to supplement with the latest data, validate numbers, and fill gaps
3. ALWAYS: Cite the actual sources you used (both preferred and discovered)

Return JSON with exactly these fields:
{
  "tam": <number in USD>,
  "sam": <number in USD>,
  "som": <number in USD>,
  "methodology": "Brief explanation",
  "growth_rate": <annual growth rate percentage>,
  "sources": [{"title": "Source name", "url": "https://..."}]
}

Prefer citing the preferred sources when they contain relevant data. Include real URLs for all sources.
```

**User prompt:**
```
Research market size for: AI-powered credit scoring for gig workers
Industry: fintech (matched: financial_services)
Customer: gig economy workers
```

---

## Link Data to Extract (Per Industry)

Extract the **top 5 highest-scored links** from each markdown file:

| Industry Key | Source File | Top Scores |
|-------------|------------|------------|
| `healthcare` | `07-industry-links-healthcare.md` | 95, 94, 93, 92, 91 |
| `financial_services` | `06-industry-links-financial-services.md` | 95, 94, 92, 91, 88 |
| `manufacturing` | `09-industry-links-manufacturing.md` | 95, 93, 92, 91, 90 |
| `supply_chain_logistics` | `15-industry-links-supply-chain-logistics.md` | 95, 93, 92, 90, 89 |
| `customer_support` | `02-industry-links-customer-support.md` | 93, 92, 91, 90, 89 |
| `cybersecurity` | `03-industry-links-cybersecurity.md` | 94, 93, 92, 91, 90 |
| `education` | `04-industry-links-education.md` | 93, 92, 91, 90, 88 |
| `fashion` | `05-industry-links-fashion.md` | 93, 92, 91, 89, 88 |
| `legal_compliance` | `08-industry-links-legal-compliance.md` | 93, 92, 91, 90, 89 |
| `marketing_sales_crm` | `10-industry-links-marketing-sales-crm.md` | 93, 92, 91, 90, 89 |
| `media_entertainment` | `11-industry-links-media-entertainment.md` | 92, 91, 90, 89, 88 |
| `real_estate_proptech` | `12-industry-links-real-estate-proptech.md` | 93, 92, 91, 89, 88 |
| `retail_ecommerce` | `13-industry-links-retail-ecommerce.md` | 93, 92, 91, 90, 89 |
| `saas_ai` | `14-industry-links-saas-ai.md` | 95, 94, 92, 91, 90 |
| `travel_tourism` | `20-industry-links-travel-tourism.md` | top 5 |

Cross-industry (from `16-startup-sites-top-20.md`):
| Source | URL | Score |
|--------|-----|-------|
| TechCrunch — Startups | https://techcrunch.com/category/startups/ | 95 |
| Crunchbase News | https://news.crunchbase.com/ | 93 |
| VentureBeat | https://venturebeat.com/ | 91 |
| PitchBook — News | https://pitchbook.com/news/articles | 88 |
| CB Insights — Tech trends 2026 | https://www.cbinsights.com/research/report/top-tech-trends-2026/ | 86 |

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Curated URLs go stale (404) | Medium | Low | Gemini handles gracefully — reports "source unavailable" and falls back to search |
| Industry mismatch (wrong links for niche) | Medium | Low | Fuzzy matching + cross-industry fallback ensures something useful is always provided |
| Token budget exceeded | Very Low | Medium | 10 links = ~300 tokens, well within budget. Cap at 10 links max. |
| Gemini ignores preferred sources | Low | Medium | "HIGH PRIORITY" + "FIRST" + explicit citation request makes it highly likely to use them |
| Slower response (more context) | Very Low | Low | 300 extra tokens adds negligible latency vs Google Search round-trip |

---

## Future: Upgrade Path to Full RAG (Prompt 03)

When Prompt 03 (Knowledge Integration) is ready:
1. Replace `curated-links.ts` static data with dynamic `knowledge_chunks` queries
2. Switch from "links in prompt" to "content chunks in prompt"
3. The prompt structure stays the same (preferred sources section) — only the data source changes
4. This makes Prompt 13 a stepping stone, not throwaway work
