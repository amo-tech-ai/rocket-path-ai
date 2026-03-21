# Plan: ResearchAgent Overhaul — Decision-Grade Market Sizing

## Context

The ResearchAgent produces inconsistent market data. A Google search for "eCommerce product photography market" returns "$27.41B by 2033, 8.7-13.4% CAGR" while the validator returns generic "AI tools market" numbers. The root causes:

1. **Prompt drift**: Gemini defaults to the startup's technology ("AI market") instead of the customer's market ("product photography market")
2. **No bottom-up evidence**: The prompt says "bottom-up preferred" but never forces a buyer-count calculation
3. **Weak SOM logic**: Auto-correction uses fixed ratios (SAM=30% TAM, SOM=10% SAM) which can be wildly wrong
4. **No validation**: `extractJSON` only checks for null — partial/broken structures pass through
5. **Hallucinated sources**: No evidence quotes or year requirements — LLMs invent URLs

The goal: every run produces consistent numbers, credible sources, transparent math, and automatic sanity checks. Optimized for pre-seed (fast + conservative).

## Architecture Constraints

- **40s hard timeout** — single Gemini call, no multi-turn
- **No Zod in project** — `deno.json` only imports `@supabase/supabase-js`
- **Gemini `responseJsonSchema`** enforces output structure at the API level
- **Single call pattern** — curated links + RAG + search queries all injected into one prompt
- **Pipeline SLA** — research runs in parallel with competitors (Group B, 40s budget)

## Changes

### 1. System prompt rewrite — `research.ts`

Replace the current 156-line system prompt with a stricter, shorter version:

**A) Hard constraint block (top of prompt):**
```
Hard rules:
1. Market = WHAT customers buy (activity/category), NOT the technology (AI/SaaS/ML).
   BAD: "AI tools market" — GOOD: "eCommerce product photography market"
2. Every numeric claim needs (source + year) or label as "assumption".
3. Include bottom-up sizing table: buyers × price × frequency.
4. Cross-validate bottom-up vs top-down vs value theory. If >3x discrepancy, explain.
5. SAM = reachable segment (geo + ICP + channel). If unclear, propose 2 options.
6. SOM = 3-5 year obtainable revenue. Calibrate by stage. Never < $1M unless market is tiny.
```

**B) Required bottom-up table block:**
```
You MUST include a bottom_up_table with at least 2 segments:
  buyer_segment: who they are
  buyer_count: how many (with source)
  price_per_year: what they'd pay annually (with source or labeled "assumption")
  resulting_sam: buyer_count × price_per_year
```

**C) Source quality rules (replace current):**
```
Source rules:
- Minimum 3 DIFFERENT sources. No invented URLs.
- Include evidence_quote (≤20 words) from each source.
- Include published_year for each source.
- Classify each: gov | analyst | industry_report | news | company_filings | other
- If you cannot find a source for a number, label it "assumption" with justification.
```

**D) Keep existing sections:** Domain Knowledge methodology, SOM calibration table, growth rate calibration, value theory, cross-validation rules, curated sources block, RAG block, research strategy.

**E) Update user prompt** to include explicit market label instruction:
```
FIRST: Identify the PRIMARY MARKET (what customers buy, not the technology).
Example: If startup uses AI for product photography → market is "eCommerce product photography", NOT "AI tools".
State the market label before any numbers.
```

### 2. Output schema expansion — `schemas.ts` + `types.ts`

Add new fields to `AGENT_SCHEMAS.research` and `MarketResearch` type:

```typescript
// NEW required fields
primary_market_label: string,         // "eCommerce product photography"
alternate_market_labels: string[],    // ["visual commerce", "product content automation"]

// NEW optional fields
bottom_up_table: [{
  buyer_segment: string,
  buyer_count: number,
  buyer_count_source: string,
  price_per_year: number,
  price_source: string,
  resulting_sam: number
}],
assumptions: [{ name: string, value: string, justification: string }],
confidence: number,                   // 0-100
red_flags: string[],                  // model-generated warnings

// Expand sources[] with verification fields
sources: [{
  title: string,
  url: string,
  evidence_quote: string,            // ≤20 words from source
  published_year: number,
  source_type: string                // gov | analyst | industry_report | news | company_filings | other
}]
```

**Note:** `primary_market_label` and `alternate_market_labels` become required. All other new fields are optional (schema `required` array stays backwards-compatible for existing reports).

### 3. Post-extraction validation — `research.ts`

Replace the current "auto-correct with fixed ratios" (lines 197-215) with intelligent validation:

```typescript
// A) Manual validation (no Zod — not in project dependencies)
function validateResearch(r: MarketResearch): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Required fields check
  if (!r.tam || r.tam <= 0) return { valid: false, warnings: ['TAM missing or zero'] };
  if (!r.sam || r.sam <= 0) return { valid: false, warnings: ['SAM missing or zero'] };
  if (!r.som || r.som <= 0) return { valid: false, warnings: ['SOM missing or zero'] };
  if (!r.methodology || r.methodology.length < 10) return { valid: false, warnings: ['Methodology too short'] };
  if (!r.sources || r.sources.length < 1) return { valid: false, warnings: ['No sources'] };

  // Hierarchy warnings (don't auto-fix — flag instead)
  if (r.sam > r.tam) warnings.push('SAM exceeds TAM: segment definition may be wrong');
  if (r.som > r.sam) warnings.push('SOM exceeds SAM: capture estimate may be inflated');

  // Reasonableness checks
  if (r.growth_rate > 40) warnings.push(`CAGR ${r.growth_rate}% unusually high — verify market maturity`);
  if (r.som < 1_000_000 && r.tam > 1_000_000_000) warnings.push('SOM < $1M in a $1B+ market — may be too conservative');
  if (r.som > r.sam * 0.15) warnings.push(`SOM is ${((r.som/r.sam)*100).toFixed(0)}% of SAM — optimistic for early stage`);

  return { valid: true, warnings };
}
```

**Key change**: Instead of silently fixing SAM=30% TAM, we:
1. Keep the model's numbers
2. Generate `red_flags` warnings
3. Append warnings to methodology
4. Still enforce hard floor (SAM ≤ TAM, SOM ≤ SAM) but use the model's ratio, not a fixed one

### 4. RAG chunk hygiene — `research.ts`

Add pre-filtering before `formatKnowledgeForPrompt`:

```typescript
// Dedupe by source URL, drop chunks older than 5 years
const currentYear = new Date().getFullYear();
const filtered = results
  .filter((chunk, i, arr) => {
    // Dedupe by source
    const firstIdx = arr.findIndex(c => c.source === chunk.source && c.section_title === chunk.section_title);
    if (firstIdx !== i) return false;
    // Drop stale chunks (>5 years old) unless foundational
    if (chunk.year && chunk.year < currentYear - 5) return false;
    return true;
  });
```

### 5. Composer integration — `composer.ts`

Update the market sizing section template to use `primary_market_label`:

```
When describing market size, ALWAYS start with the market label:
"[startup name] operates in the [primary_market_label] market — worth $X and growing at Y% annually."
```

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/validator-start/agents/research.ts` | Rewrite system prompt, add validation function, RAG filtering |
| `supabase/functions/validator-start/schemas.ts` | Add new schema fields (primary_market_label, bottom_up_table, etc.) |
| `supabase/functions/validator-start/types.ts` | Update MarketResearch interface to match schema |
| `supabase/functions/validator-start/agents/composer.ts` | Use primary_market_label in market description template |

## What We're NOT Doing (and Why)

| Suggestion | Decision | Reason |
|-----------|----------|--------|
| Add Zod validation | Skip | Not in project deps; manual validation achieves same result without new dependency |
| Separate search runs per query cluster | Skip | Would require multiple Gemini calls, breaking 40s timeout budget |
| Multiple Gemini calls for market/pricing/competitors | Skip | Single-call architecture is a hard constraint of pipeline SLA |

## Verification

1. `npm run build` — no compile errors (schema/type changes)
2. Deploy edge function: `npx supabase functions deploy validator-start --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
3. Run a validation for "iPix — AI product photography for eCommerce" — verify:
   - `primary_market_label` says "eCommerce product photography" (not "AI tools")
   - `bottom_up_table` has ≥2 segments with buyer counts
   - `sources` include `evidence_quote` and `published_year`
   - No silent SAM/SOM auto-correction — warnings in `red_flags` instead
4. Run a second validation for a different industry (e.g., "cybersecurity SaaS") to confirm universality
5. Check composer output uses the market label in the executive summary
