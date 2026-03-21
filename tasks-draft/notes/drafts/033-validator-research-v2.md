---
task_id: 033-RES
title: Validator Research Agent v2
diagram_ref: D-03
phase: ENHANCE
priority: P1
status: Not Started
skill: /gemini
ai_model: gemini-3-flash-preview
subagents: [code-reviewer]
edge_function: validator-start
schema_tables: [validator_sessions, validator_runs]
depends_on: [032-CTX]
---

| Aspect | Details |
|--------|---------|
| **Screens** | ValidatorReport (market sizing section) |
| **Features** | Adaptive search queries, TAM validation, source recency, dual methodology |
| **Agents** | ResearchAgent |
| **Edge Functions** | /validator-start (research agent) |
| **Use Cases** | Market sizing with real data, not generic estimates |
| **Real-World** | "AI searches 'dental practice management software market size 2025' instead of generic 'healthcare market size'" |

## Description

> Upgrade the Research agent to use adaptive search queries based on what the founder actually said, validate TAM > SAM > SOM mathematically, prefer recent sources, and use dual methodology (top-down + bottom-up).

## Rationale

**Problem:** Current Research agent uses a generic RAG query (`"[idea] [industry] market size TAM SAM SOM growth"`) regardless of the founder's specifics. For a niche like "AI scheduling for dentists," it searches generic healthcare market data. It doesn't validate TAM > SAM > SOM. Source recency is ignored.

**Solution:** Build search queries from the founder's specific language. Add mathematical validation. Weight recent data. Require dual methodology.

**Impact:** Market sizing sections become credible with specific numbers and real citations.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see market data specific to my niche | I know my real addressable market |
| Founder | see where the numbers came from | I can trust (and cite) the data |
| Investor reading report | verify TAM/SAM/SOM are logical | I take the analysis seriously |

## Real-World Example

> Founder: "AI scheduling for independent dental practices." Current agent searches "healthcare market size TAM SAM." v2 agent searches: "dental practice management software market 2025", "independent dental practice count US", "dental SaaS adoption rate." Returns: TAM=$4.2B (dental practice management), SAM=$890M (US independents), SOM=$45M (AI-first segment).

## Goals

1. **Primary:** Search queries adapt to founder's specific market/niche
2. **Secondary:** TAM >= SAM >= SOM validated mathematically
3. **Quality:** Sources cite year, prefer 2024-2026 data

## Acceptance Criteria

- [ ] Research agent builds 2-3 specific search queries from founder's problem + customer + industry
- [ ] TAM >= SAM >= SOM validation: if violated, agent re-derives or flags as approximate
- [ ] Source recency: prompt instructs to prefer 2024-2026 data, flag older sources
- [ ] Dual methodology: prompt asks for both top-down (industry reports) and bottom-up (unit economics * addressable count)
- [ ] Growth rate includes timeframe (e.g., "CAGR 2024-2028")
- [ ] RAG query adapted to founder's specific terms, not generic
- [ ] Build passes

## Wiring Plan

### Files

| Layer | File | Action |
|-------|------|--------|
| Agent | `supabase/functions/validator-start/agents/research.ts` | Rewrite system prompt + user prompt construction |
| Knowledge | `supabase/functions/validator-start/knowledge-search.ts` | Adapt query builder |
| Schema | `supabase/functions/validator-start/schemas.ts` | Add methodology_type, source_year to schema |

## New System Prompt

```
You are a market research analyst who writes investment memos for top-tier VCs. Your market sizing must withstand scrutiny from experienced investors.

## Research Strategy

1. Build SPECIFIC search queries from the founder's language:
   - If founder says "dental practices" → search "dental practice management software market", NOT "healthcare market"
   - If founder says "indie fashion labels, 10-50 employees" → search "fashion production management SMB market"
   - Always include the specific customer segment in queries

2. Use DUAL METHODOLOGY:
   - **Top-down:** Industry reports → narrow to segment → apply adoption rate
   - **Bottom-up:** Number of target customers × average revenue per customer × penetration rate
   - Show BOTH calculations. If they differ by >3x, explain why.

3. VALIDATE mathematically:
   - TAM must be >= SAM must be >= SOM
   - If your numbers violate this, re-derive or explain the special case
   - SOM should be 1-5% of SAM for a startup (flag if unrealistic)

4. Prefer RECENT sources (2024-2026). Flag data older than 2022.

5. Growth rate must specify timeframe: "15% CAGR 2024-2028" not just "15% growth"

## Output Fields
{
  "tam": <number USD>,
  "sam": <number USD>,
  "som": <number USD>,
  "methodology": "Top-down: [explanation]. Bottom-up: [explanation]. Reconciliation: [why they align or differ].",
  "growth_rate": <annual %>,
  "growth_timeframe": "CAGR 2024-2028",
  "sources": [{"title": str, "url": str, "year": number}]
}
```

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No industry match in curated links | Rely on Google Search + RAG only |
| TAM < SAM in initial output | Re-derive with validation prompt |
| All sources older than 2022 | Flag in methodology: "Note: latest available data is from [year]" |
| Very niche market (no reports) | Bottom-up methodology primary; flag limited data availability |

## Security Checklist

- [ ] No secrets in search queries
- [ ] Source URLs validated as http/https

## Production Ready Checklist

- [ ] `npm run build` passes
- [ ] Research agent returns valid TAM > SAM > SOM in 3 test runs
- [ ] Sources include year field
- [ ] Edge function deployed

## Regression Checklist

- [ ] Pipeline timing: Research still completes within 40s budget
- [ ] Downstream agents (Scoring, Composer) handle new schema fields
