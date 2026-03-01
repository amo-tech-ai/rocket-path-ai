/**
 * Agent 6: Composer
 * 021-CSP: Split into 4 focused Gemini calls (3 parallel + 1 sequential synthesis).
 * Each group uses responseJsonSchema for strict JSON validation.
 * Group A: Problem & Customer | Group B: Market & Risk | Group C: Execution & Economics | Group D: Executive Synthesis
 */

import type {
  SupabaseClient,
  StartupProfile,
  MarketResearch,
  CompetitorAnalysis,
  ScoringResult,
  MVPPlan,
  ValidatorReport,
  InterviewContext,
  ComposerGroupA,
  ComposerGroupB,
  ComposerGroupC,
  ComposerGroupD,
} from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS, COMPOSER_GROUP_TIMEOUTS } from "../config.ts";
import { COMPOSER_GROUP_SCHEMAS, DIMENSION_SCHEMAS, DIMENSION_SUB_SCORES } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";

// Shared tone instructions — injected into every group prompt
const TONE = `You are a sharp startup advisor writing a validation report.
Write like a smart friend who knows startups inside out.
- Use "you" and "your"
- Short sentences. One idea per sentence.
- Lead with the number: "$10.4B total market" not "The market is valued at..."
- Every risk gets a plain consequence.
- Be honest, not polite.
Use real data from agent outputs. Be specific to THIS startup.`;

// ---------------------------------------------------------------------------
// Input trimming helpers (carried from original composer)
// ---------------------------------------------------------------------------
function trimMarket(market: MarketResearch | null) {
  if (!market) return {};
  return {
    tam: market.tam, sam: market.sam, som: market.som,
    methodology: market.methodology, growth_rate: market.growth_rate,
    sources: (market.sources || []).slice(0, 5),
  };
}

function trimCompetitors(competitors: CompetitorAnalysis | null) {
  if (!competitors) return {};
  return {
    // D-05 fix: Pass strengths/weaknesses through to Composer so competitor cards aren't empty
    direct_competitors: (competitors.direct_competitors || []).slice(0, 4).map(c => ({
      name: c.name, description: c.description?.slice(0, 200),
      strengths: c.strengths || [], weaknesses: c.weaknesses || [],
      threat_level: c.threat_level,
    })),
    indirect_competitors: (competitors.indirect_competitors || []).slice(0, 2).map(c => ({
      name: c.name, description: c.description?.slice(0, 150),
      strengths: c.strengths || [], weaknesses: c.weaknesses || [],
    })),
    market_gaps: (competitors.market_gaps || []).slice(0, 3),
    // CORE-06: Pass positioning, battlecard, white_space for deeper competitive analysis
    ...(competitors.positioning ? { positioning: competitors.positioning } : {}),
    ...(competitors.battlecard ? { battlecard: competitors.battlecard } : {}),
    ...(competitors.white_space ? { white_space: competitors.white_space } : {}),
  };
}

// ---------------------------------------------------------------------------
// Gemini call wrapper with per-group schema + fallback
// ---------------------------------------------------------------------------
async function callGroupGemini<T>(
  groupName: string,
  systemPrompt: string,
  userPrompt: string,
  schema: Record<string, unknown>,
  timeoutMs: number,
  maxOutputTokens: number,
): Promise<T | null> {
  try {
    // Try with responseJsonSchema first (strict validation, no extractJSON needed)
    const { text } = await callGemini(
      AGENTS.composer.model,
      systemPrompt,
      userPrompt,
      {
        thinkingLevel: AGENTS.composer.thinking,
        timeoutMs,
        maxRetries: 0,
        maxOutputTokens,
        responseJsonSchema: schema as Record<string, unknown>,
      }
    );

    console.log(`[Composer:${groupName}] Schema response received (${text?.length ?? 0} chars)`);
    let result = extractJSON<T>(text);
    // FIX: Gemini occasionally wraps JSON response in an array [{}] — unwrap
    if (Array.isArray(result)) result = (result as unknown[])[0] as T || null;
    if (!result) {
      console.warn(`[Composer:${groupName}] responseJsonSchema succeeded but extractJSON failed — raw: ${text?.slice(0, 500)}`);
    }
    return result;
  } catch (schemaErr) {
    // R-02 fix: Fallback on retryable schema errors (400, 413, 422, 500), not just 400
    const errMsg = schemaErr instanceof Error ? schemaErr.message : String(schemaErr);
    const RETRYABLE_SCHEMA_CODES = ['400', '413', '422', '500'];
    const isRetryable = RETRYABLE_SCHEMA_CODES.some(code => errMsg.includes(code));
    console.warn(`[Composer:${groupName}] Schema attempt error: ${errMsg.slice(0, 300)}`);
    if (!isRetryable) throw schemaErr;

    console.warn(`[Composer:${groupName}] Schema rejected, falling back to responseMimeType only`);
    const { text } = await callGemini(
      AGENTS.composer.model,
      systemPrompt,
      userPrompt,
      {
        thinkingLevel: AGENTS.composer.thinking,
        timeoutMs,
        maxRetries: 0,
        maxOutputTokens,
      }
    );

    let result = extractJSON<T>(text);
    if (Array.isArray(result)) result = (result as unknown[])[0] as T || null;
    return result;
  }
}

// ---------------------------------------------------------------------------
// Group A — Problem & Customer (3 sections)
// ---------------------------------------------------------------------------
async function composeGroupA(
  profile: StartupProfile | null,
  scoring: ScoringResult | null,
  interviewContext: InterviewContext | undefined,
  timeoutMs: number,
): Promise<ComposerGroupA | null> {
  const contextNote = interviewContext?.extracted
    ? `\nInterview context available — leverage founder's own words for authenticity.`
    : '';

  const systemPrompt = `${TONE}
${contextNote}

## Your task: Problem & Customer analysis

### problem_clarity (Section 1 — must be sharp and quantified)
Use the extracted problem_structured data if available. If not, infer from profile.problem.

Rules:
1. "who" must include: job title, company type, team size, AND buying authority.
   BAD: "small businesses". GOOD: "Creative Directors at mid-market e-commerce brands (10-250 employees) who control the production budget."
2. "pain" must include at least ONE quantified metric (hours, dollars, delays, revenue impact).
   If the founder gave no numbers, estimate from industry benchmarks and mark with "[estimated]".
3. "current_fix" must name specific tools (not generic "spreadsheets") AND explain the structural reason they fail.
   Show why the problem gets WORSE over time (scaling pain, compounding cost, market pressure).
4. "severity": high = hair-on-fire daily pain with budget to solve, medium = recurring annoyance with workarounds, low = nice-to-have
5. Max 180 words total across who + pain + current_fix. No fluff, no hedging.

### customer_use_case (Section 2 — must tell a vivid before/after story)
Use the extracted customer_structured data if available. If not, infer from profile.customer.

Rules:
1. "persona" must feel like a real person — use a plausible full name, specific job title, company size, and industry context.
   BAD: "John, a manager". GOOD: "Sarah Chen, Production Manager at a 30-person fashion label in LA, responsible for 15 shoots/quarter."
2. "without" must walk through a SPECIFIC bad day step-by-step. Show the friction, wasted time, and downstream consequences.
   Include at least 3 concrete steps and their failure modes.
3. "with" must show the SAME day transformed by the product. Be specific about what changes — name the feature, not the category.
4. "time_saved" must be a real number with context — "4 hours/week" or "$2,400/month" — NEVER "significant time savings" or "improved efficiency".
5. End with a business-level consequence: faster launches, fewer errors, higher quality, or cost reduction.

### key_questions (3 items)
- Risk-weighted: fatal questions get the most detail
- Each must have a concrete "validation_method" — not "do market research" but "interview 10 wedding photographers about their editing workflow"
- "why_it_matters": connect to business viability, not abstract importance

## Reference: Validation Hierarchy
- A-tier evidence: Revenue, signed LOIs, prepayment
- B-tier: Consistent user behavior in prototype/beta
- C-tier: Survey data, stated intent, expert interviews
- D-tier: Desk research, analogies, founder intuition

## Domain Knowledge — Problem & Customer Depth
### Problem Severity Calibration
- HIGH: Hair-on-fire daily pain. Customer actively searching for solutions. Budget exists.
- MEDIUM: Recurring annoyance. Customer copes with workarounds. Would pay if easy.
- LOW: Nice-to-have. Customer unaware of problem. Requires education to sell.

### Persona Quality Bar
- Name a realistic person (not "John from Company X" but "Sarah Chen, Production Manager at a 30-person fashion label in LA")
- Context must include: role, company size, industry, and the specific workflow that's broken
- "Without" scenario: walk through a specific bad day step-by-step
- "With" scenario: same day with the product — be concrete about what changes`;

  // 031-PCE: Pass problem_structured separately so Composer can use it directly
  const problemStructuredBlock = profile?.problem_structured
    ? `\nPROBLEM_STRUCTURED (use as primary source for problem_clarity):\n${JSON.stringify(profile.problem_structured)}`
    : '\nPROBLEM_STRUCTURED: not available — infer WHO/PAIN/TODAY\'S FIX from profile.problem field';

  // 032-CUC: Pass customer_structured separately so Composer can use it directly
  const customerStructuredBlock = profile?.customer_structured
    ? `\nCUSTOMER_STRUCTURED (use as primary source for customer_use_case):\n${JSON.stringify(profile.customer_structured)}`
    : '\nCUSTOMER_STRUCTURED: not available — infer persona/workflow from profile.customer field';

  const userPrompt = `Generate Problem & Customer analysis from agent outputs:

PROFILE: ${JSON.stringify(profile || {})}${problemStructuredBlock}${customerStructuredBlock}
SCORING: ${JSON.stringify(scoring || {})}`;

  return callGroupGemini<ComposerGroupA>('GroupA', systemPrompt, userPrompt, COMPOSER_GROUP_SCHEMAS.groupA as Record<string, unknown>, timeoutMs, 2048);
}

// ---------------------------------------------------------------------------
// Group B — Market & Risk (5 sections)
// ---------------------------------------------------------------------------
async function composeGroupB(
  profile: StartupProfile | null,
  market: MarketResearch | null,
  competitors: CompetitorAnalysis | null,
  scoring: ScoringResult | null,
  timeoutMs: number,
): Promise<ComposerGroupB | null> {
  const systemPrompt = `${TONE}

## Your task: Market & Risk analysis

### market_sizing (Section 3 — must show the math, not just numbers)
Rules:
1. TAM: Start from a credible industry report. Show the source: "Global meal planning market: $15B (Grand View Research, 2025)".
2. SAM: Narrow with specific logic. Show buyer-count math: "12M dual-income US households with kids × $144/year avg subscription = $1.7B reachable".
3. SOM: Apply stage-appropriate capture rate. Show the scenario: "Capture 0.3% of SAM in Year 3 = $5.1M ARR with 3,500 subscribers".
4. Citations: Name the actual data source and year. No "industry reports suggest" — name the report.
5. Include one bottom-up revenue projection: "[target buyers] × [price] × [frequency] = [revenue]"
6. Flag if SOM > 5% of SAM as optimistic for early-stage.
7. End with investor lens: is this venture-scale ($1B+ TAM) or niche ($100M-$1B)?

### competition (up to 3 direct competitors)
- SWOT: 2-3 items per quadrant, specific to THIS market
- feature_comparison: 3-5 key features, boolean matrix vs competitors
- positioning: choose meaningful axes (not just price/quality), place the founder's idea AND competitors
- Each competitor needs a realistic threat_level

### scores_matrix
- 4-7 dimensions with 0-100 scores and weights summing to ~1.0
- For each dimension: the score should reflect the evidence, not optimism
- overall_weighted = weighted average of dimension scores

### top_threat
- Extract the single most dangerous risk — the one that could kill the business
- Must have a specific, cheap "how_to_test" (something doable in 1-2 weeks)

### risks_assumptions (3-5 items)
- Each assumption is something the founder is betting on
- "if_wrong": plain English consequence — "you'll burn $50K before discovering no one wants this"
- "how_to_test": specific and cheap — "cold email 20 studio owners, track reply rate"
- severity: fatal = business dies, risky = major pivot needed, watch = monitor closely

## Reference: Market Analysis Framework
- Bottom-up sizing: count actual buyers x realistic price x purchase frequency
- Porter's Five Forces: supplier power, buyer power, substitutes, new entrants, rivalry
- Risk taxonomy: market risk, execution risk, technology risk, regulatory risk, team risk

## Domain Knowledge — Market & Risk Depth

### SOM Early-Stage Calibration
| Stage | Realistic SOM as % of SAM | Evidence Required |
|-------|--------------------------|-------------------|
| Pre-seed | 0.1-0.5% | TAM/SAM from credible report |
| Seed | 1-3% | Bottoms-up math + early traction |
| Series A | 3-5% | Repeatable growth + distribution advantage |
If SOM > 5% of SAM, flag as optimistic and demand justification.

### Risk Taxonomy (15 domains)
- Desirability: Problem risk, Customer risk, Channel risk
- Viability: Revenue risk, Pricing risk, Market size risk, Cost structure risk
- Feasibility: Technical risk, Resource risk, Team risk, Dependency risk
- External: Regulatory risk, Competitive risk, Timing risk, Macro risk
Risk Score = Impact (1-10) x Probability (1-5). Top 3 by score → risks_assumptions, #1 → top_threat.

### Competition Threat Level Framework
High = well-funded + high feature overlap + growing fast
Medium = partial overlap OR bootstrapped with traction
Low = different segment OR declining/stagnant
Status quo (doing nothing) is ALWAYS a competitor — include it.

### CORE-06: Enhanced Inputs Available
- If scoring includes a "risk_queue" array, use it to build risks_assumptions — map composite_score to severity (35-50=fatal, 20-34=risky, 10-19=watch)
- If scoring includes "bias_flags", surface the top 1-2 biases as warnings in risks_assumptions
- If competitors include "positioning" (April Dunford), use it to inform the positioning map axes and placement
- If competitors include "battlecard", use win/lose themes to strengthen the SWOT analysis
- If competitors include "white_space", make it the basis for the strongest opportunity in SWOT`;

  const userPrompt = `Generate Market & Risk analysis from agent outputs:

PROFILE: ${JSON.stringify(profile || {})}
MARKET: ${JSON.stringify(trimMarket(market))}
COMPETITORS: ${JSON.stringify(trimCompetitors(competitors))}
SCORING: ${JSON.stringify(scoring || {})}`;

  return callGroupGemini<ComposerGroupB>('GroupB', systemPrompt, userPrompt, COMPOSER_GROUP_SCHEMAS.groupB as Record<string, unknown>, timeoutMs, 3072);
}

// ---------------------------------------------------------------------------
// Group C — Execution & Economics (7 sections)
// ---------------------------------------------------------------------------
async function composeGroupC(
  profile: StartupProfile | null,
  scoring: ScoringResult | null,
  mvp: MVPPlan | null,
  timeoutMs: number,
): Promise<ComposerGroupC | null> {
  const systemPrompt = `${TONE}

## Your task: Execution & Economics plan

### mvp_scope
- "one_liner": what to build + what assumption it tests (one sentence)
- "build": only features you MUST code (3-5 items)
- "buy": name specific services (Stripe, Auth0, Resend) — not categories
- "skip_for_now": features founders always want but don't need yet
- "success_metric": one measurable number — "50 paying users in 8 weeks"

### next_steps (3-5 items)
- Each action has a concrete deliverable — not "validate market" but "complete 15 customer interviews and document 3 recurring pain patterns"
- Timeframes: week_1 = this week, month_1 = this month, quarter_1 = this quarter
- Mix of effort levels — at least one quick win (low effort, week_1)

### revenue_model
- "recommended_model": name the model (SaaS subscription, marketplace commission, etc.)
- "reasoning": why this model fits this specific startup (not generic)
- 2 alternatives with honest pros/cons
- unit_economics: realistic CAC, LTV, ratio, payback — stage-appropriate estimates

### financial_projections
- 3 scenarios: Conservative (pessimistic but viable), Base (realistic), Optimistic (everything clicks)
- Show different growth assumptions for each scenario
- break_even: months to reach profitability + monthly revenue needed
- key_assumption: the ONE thing that changes everything if wrong

### team_hiring
- current_gaps: what skills are missing for the MVP
- mvp_roles: 3 max, with realistic monthly costs and clear rationale
- monthly_burn: total team cost + infrastructure
- advisory_needs: specific expertise gaps

### technology_stack
- stack_components: build/buy/open_source decision for each
- 2 technical risks max, each with mitigation

### resources_links (3 categories max)
- Curated, useful links — not generic "startup resources"
- Each link has a one-line description of why it's relevant

## Reference: MVP & Financial Framework
- Build only what tests the riskiest assumption
- Seed stage benchmarks: $10K-50K MRR, 3:1+ LTV:CAC ratio, <12 month payback
- Revenue model selection: match pricing to value delivery cadence

## Domain Knowledge — Execution & Financial Depth

### Revenue Model Patterns by Business Type
- SaaS Subscription: $100-$2K/mo SMB, $2K-$50K/mo mid-market, $50K+/yr enterprise
- Marketplace: 10-30% take rate (Airbnb 3-15%, Uber 25%, Upwork 20%)
- Freemium: 2-5% conversion to paid, 15-20% annual billing discount
- Usage-based: Unit price x consumption; set minimum commits for predictability

### Unit Economics Benchmarks
- LTV:CAC ratio: 3:1 = healthy | <1:1 = losing money | >5:1 = under-investing in growth
- CAC payback: PLG <12mo | Sales-led <18mo | Enterprise <24mo
- Gross margin: Pure SaaS 75-85% | SaaS+AI 60-75% | Marketplace 60-70%
- Churn: Enterprise <1%/mo | SMB <3%/mo | Consumer <5%/mo

### Burn Rate Benchmarks by Stage
- Pre-seed (2-5 people): $15-40K/mo burn | 18-24mo runway target
- Seed (5-15 people): $40-120K/mo burn | 18-24mo runway target
- Series A (15-40 people): $120-350K/mo | 18-24mo runway target

### GTM Motion Selection
- ACV <$5K + self-serve product → PLG (product-led growth)
- ACV $5K-$100K + technical buyer → Hybrid (PLG + inside sales)
- ACV $25K+ + complex sale → Sales-led with SDR/AE team
Match the recommended next_steps to the appropriate GTM motion.

### CORE-06: Enhanced Inputs Available
- If MVP includes "experiment_cards", use them to inform next_steps — the first 1-2 next_steps should match the top experiment cards
- If MVP includes "founder_stage" (idea_only, problem_validated, demand_validated, presales_confirmed), calibrate the mvp_scope and next_steps to that stage:
  * idea_only → prioritize customer interviews and smoke tests, NOT building
  * problem_validated → prioritize fake door tests and demand validation
  * demand_validated → prioritize pre-sales and prototype
  * presales_confirmed → prioritize MVP build and actual usage testing
- If MVP includes "recommended_methods", align next_steps validation_methods to those recommendations`;

  const userPrompt = `Generate Execution & Economics plan from agent outputs:

PROFILE: ${JSON.stringify(profile || {})}
SCORING: ${JSON.stringify(scoring || {})}
MVP: ${JSON.stringify(mvp || {})}`;

  return callGroupGemini<ComposerGroupC>('GroupC', systemPrompt, userPrompt, COMPOSER_GROUP_SCHEMAS.groupC as Record<string, unknown>, timeoutMs, 3072);
}

// ---------------------------------------------------------------------------
// Group D — Executive Synthesis (1 section, runs AFTER A+B+C)
// ---------------------------------------------------------------------------
async function composeGroupD(
  groupA: ComposerGroupA | null,
  groupB: ComposerGroupB | null,
  groupC: ComposerGroupC | null,
  scoring: ScoringResult | null,
  interviewContext: InterviewContext | undefined,
  timeoutMs: number,
  consistencyNotes: string[] = [],
): Promise<ComposerGroupD | null> {
  const contextNote = interviewContext?.extracted
    ? `The founder went through a discovery interview — weight their direct input.`
    : '';

  const systemPrompt = `${TONE}
${contextNote}

## Your task: Executive Summary synthesis

You have the COMPLETE analysis from three specialist groups. Synthesize into a decisive executive summary that a smart but non-technical founder or investor can read in 60 seconds.

### summary_verdict (STRICT: 180–220 words, flowing narrative)

Write in this exact 5-part structure:

**1. The opportunity (2-3 sentences)**
Explain the business opportunity in simple terms anyone can understand. Lead with a concrete number.
BAD: "The addressable market exhibits significant growth trajectories across multiple verticals."
GOOD: "Dental clinics waste $3,500/month per office on manual insurance verification. There are 140,000 independent clinics in the US alone."

**2. One relatable example (2-3 sentences)**
Start with "Imagine..." — paint a specific scenario the reader can see.
BAD: "Users experience suboptimal workflow efficiency."
GOOD: "Imagine a clinic manager who spends her entire morning on hold with insurance companies instead of helping patients. By 3pm she's behind on follow-ups for $12,000 in treatment plans."

**3. The core risk (1-2 sentences)**
State the single biggest danger in plain language, with its consequence.
BAD: "There are competitive dynamics in the space."
GOOD: "If major dental software vendors add this feature, your differentiation disappears overnight."

**4. Win / Must / Fail (3 sentences)**
- Why this could win: one specific advantage
- What must go right: one specific condition (with a number if possible)
- What happens if it fails: one specific consequence

**5. Verdict (1 sentence)**
End with exactly one of: "**Go.**" / "**Conditional go** — [one condition]." / "**No-go** — [one reason]."
No hedging. Pick one.

STRICT RULES:
- No jargon. No "leverage", "synergy", "paradigm", "ecosystem", "robust".
- No financial abbreviations: write "market size" not "TAM", "customer return" not "LTV:CAC", "target revenue" not "SOM", "customer acquisition cost" not "CAC".
- No bullet points — write flowing paragraphs.
- Use plain numbers: "$3,500/month" not "$3.5K MRR". "140,000 clinics" not "140K TAM".
- Every claim must connect to data from the analysis groups.
- The summary must feel like advice from a smart friend, not a consulting report.
- Highlights and red flags must read like advice from a mentor, not an analyst report.

### verdict_oneliner
- A complete sentence with a clear stance — not a fragment.
- BAD: "High upside, execution-sensitive"
- GOOD: "This is a strong niche play that works if you can acquire clinics at under $200 each."

### success_condition
- The single thing that must be true for this startup to work.
- Must be testable and specific — include a number or threshold.
- BAD: "Finding product-market fit"
- GOOD: "Signing 5 pilot clinics within 60 days at $299/month with 80%+ retention after month 3."

### biggest_risk
- The one risk that could kill the business, stated so a non-expert understands it.
- Connect it to data: cite the specific evidence from the analysis.
- BAD: "Competitive dynamics pose a threat."
- GOOD: "Dentrix (60% market share) could add insurance verification in a software update — your entire advantage would disappear."

## Domain Knowledge — Investor Expectations

### Stage-Appropriate Framing
- Pre-seed: "Is the problem real?" → Focus on customer pain evidence + team credibility.
  Expect: 20+ customer interviews, problem validation, early prototype.
- Seed: "Is it working?" → Focus on early traction + unit economics signals.
  Expect: $10-50K monthly recurring revenue, 15-20% month-over-month growth, willingness-to-pay confirmed.
- Series A: "Can it scale?" → Focus on repeatable growth + proven economics.
  Expect: $1-3M annual revenue, 3:1+ customer return ratio, under 18-month payback.
Match your language to the actual evidence tier, never oversell. NEVER use abbreviations like MRR, ARR, LTV, CAC, TAM, SAM, SOM in the output — always write them out in plain English.

### Timing & Market Entry Signals
- Strong entry signal: 3+ independent indicators (funding rounds, job postings, enterprise adoption) + <16% market penetration
- Cautious entry: Mixed signals, 2.5-16% penetration — validate demand before scaling
- Late entry: Strong lagging indicators only, >50% penetration — differentiate or avoid
Use these to inform the "Why now" element of the opportunity paragraph.

### Traction Language Calibration
- "Early signal" = interviews + smoke test data (pre-seed)
- "Initial traction" = paying users + retention data (seed)
- "Proven traction" = consistent MRR growth + unit economics (Series A)
Never use stronger language than the evidence supports.

### CORE-06: Bias & Signal Awareness
- If scoring shows bias_count > 0, mention the dominant bias in the risk paragraph (part 3) — e.g., "The founder shows signs of confirmation bias — all evidence cited is positive."
- If highest_signal_level is 1-2 (verbal/engagement only), the verdict CANNOT be "Go" — it must be "Conditional go" at best
- If highest_signal_level is 4-5 (payment/referral), this strengthens the "Go" case — cite the evidence level`;

  // 022-SKI: Include consistency notes to enforce cross-group alignment
  const consistencyBlock = consistencyNotes.length > 0
    ? `\nCONSISTENCY NOTES:\n${consistencyNotes.map(n => `- ${n}`).join('\n')}`
    : '';

  // 034: Compact context for Group D — only pass key data points, not full JSON dumps
  // Full group JSON was causing timeouts after 031-033 made outputs larger
  const compactA = groupA ? {
    problem_who: groupA.problem_clarity?.who,
    problem_pain: groupA.problem_clarity?.pain,
    problem_current_fix: groupA.problem_clarity?.current_fix,
    problem_severity: groupA.problem_clarity?.severity,
    customer_persona: groupA.customer_use_case?.persona?.name,
    customer_role: groupA.customer_use_case?.persona?.role,
    customer_without: groupA.customer_use_case?.without,
    customer_with: groupA.customer_use_case?.with,
    customer_time_saved: groupA.customer_use_case?.time_saved,
  } : {};
  const compactB = groupB ? {
    tam: groupB.market_sizing?.tam,
    sam: groupB.market_sizing?.sam,
    som: groupB.market_sizing?.som,
    top_threat: groupB.top_threat?.assumption,
    top_threat_severity: groupB.top_threat?.severity,
    competitor_count: groupB.competition?.competitors?.length ?? 0,
    top_risks: (groupB.risks_assumptions || []).slice(0, 3).map(r => r.assumption),
  } : {};
  const compactC = groupC ? {
    revenue_model: groupC.revenue_model?.recommended_model,
    ltv_cac: groupC.revenue_model?.unit_economics?.ltv_cac_ratio,
    cac: groupC.revenue_model?.unit_economics?.cac,
    ltv: groupC.revenue_model?.unit_economics?.ltv,
    payback_months: groupC.revenue_model?.unit_economics?.payback_months,
    burn: groupC.team_hiring?.monthly_burn,
    mvp_timeline_weeks: groupC.technology_stack?.mvp_timeline_weeks,
    break_even_months: groupC.financial_projections?.break_even?.months,
  } : {};
  const compactScoring = scoring ? {
    overall_score: scoring.overall_score,
    verdict: scoring.verdict,
    dimensions: (scoring.scores_matrix?.dimensions || []).map(d => `${d.name}: ${d.score}`).join(', '),
    // CORE-06: Pass bias and signal level context for informed synthesis
    ...(scoring.bias_flags?.length ? { bias_count: scoring.bias_flags.length, top_bias: scoring.bias_flags[0]?.bias_type } : {}),
    ...(scoring.highest_signal_level ? { highest_signal_level: scoring.highest_signal_level } : {}),
  } : {};

  const userPrompt = `Synthesize the executive summary from these completed analyses:

PROBLEM & CUSTOMER: ${JSON.stringify(compactA)}
MARKET & RISK: ${JSON.stringify(compactB)}
EXECUTION & ECONOMICS: ${JSON.stringify(compactC)}
SCORING: ${JSON.stringify(compactScoring)}${consistencyBlock}`;

  return callGroupGemini<ComposerGroupD>('GroupD', systemPrompt, userPrompt, COMPOSER_GROUP_SCHEMAS.groupD as Record<string, unknown>, timeoutMs, 2048);
}

// ---------------------------------------------------------------------------
// Group E — V3 Dimension Detail Pages (9 parallel calls, one per dimension)
// MVP-02: Each call generates DimensionDetail + headline + diagram data.
// ---------------------------------------------------------------------------

/** Dimension-specific prompt context. Tells Gemini what to assess and what diagram to generate. */
const DIMENSION_PROMPTS: Record<string, { focus: string; diagramHint: string }> = {
  problem: {
    focus: 'Assess problem severity: how intense is the pain, how often does it occur, what is the economic impact, and how urgently do users need to replace current solutions. Use problem_structured data if available.',
    diagramHint: 'Generate a pain-chain diagram: 4-6 nodes showing trigger event → symptoms → consequences → business cost, connected by causal edges with brief labels.',
  },
  customer: {
    focus: 'Assess target customer clarity: how specific is the ICP, do they have buying authority, how disruptive is the workflow change, and are they willing to pay. Use customer_structured data if available.',
    diagramHint: 'Generate an ICP funnel diagram: 3-4 tiers narrowing from broad market → target segment → ideal customer, each with count estimate and qualifying criteria.',
  },
  market: {
    focus: 'Assess market opportunity: TAM/SAM/SOM methodology rigor, niche focus clarity, growth trajectory, and distribution feasibility. Use market research data.',
    diagramHint: 'Generate a TAM pyramid diagram: tam, sam, som each with dollar value and label. Include growth_rate if available.',
  },
  competition: {
    focus: 'Assess competitive position: depth of differentiation, switching costs for customers, replicability risk, and likely competitive reactions. Use competitor analysis data.',
    diagramHint: 'Generate a positioning matrix diagram: choose 2 meaningful axes, plot 3-5 competitors plus the founder\'s position (is_founder: true). x and y are 0-100.',
  },
  revenue: {
    focus: 'Assess revenue model: pricing clarity, monetization validation level, unit economics health, and margin sustainability. Use revenue model and financial data.',
    diagramHint: 'Generate a revenue engine diagram: 3-5 pipeline stages (e.g., Awareness → Trial → Paid → Expansion) with conversion rates, plus the pricing model name and unit economics.',
  },
  'ai-strategy': {
    focus: 'Assess AI/tech advantage: AI differentiation depth, data moat potential, automation readiness, and governance maturity. Evaluate the startup\'s tech stack.',
    diagramHint: 'Generate a capability stack diagram: 3-5 tech layers with maturity levels (nascent/developing/mature), plus automation_level (assist/copilot/agent) and data_strategy (owned/borrowed/hybrid).',
  },
  execution: {
    focus: 'Assess founder execution capability: team capability match, resource allocation realism, timeline feasibility, and operational complexity. Use team and MVP data.',
    diagramHint: 'Generate an execution timeline diagram: 3-4 phases with duration, milestones, and status (planned/in-progress/completed).',
  },
  traction: {
    focus: 'Assess traction evidence: evidence tier quality (A=revenue, B=prototype, C=surveys, D=desk research), experiment count, signal strength, and assumption coverage.',
    diagramHint: 'Generate an evidence funnel diagram: 2-4 evidence tiers (e.g., "Revenue signals", "User behavior", "Stated intent") each with claim/evidence/confidence items. Set overall_confidence.',
  },
  risk: {
    focus: 'Assess startup risk profile: financial risk, regulatory exposure, execution risk, market volatility, and dependency risk. Use risk queue and scoring data.',
    diagramHint: 'Generate a risk heat grid diagram: 4-8 specific risks with id, label, category, probability (high/medium/low), impact (high/medium/low), and optional mitigation. List risk categories.',
  },
};

/** Maps frontend dimension IDs to the sub-score key in DIMENSION_SUB_SCORES */
const DIM_TO_SUBSCORES: Record<string, keyof typeof DIMENSION_SUB_SCORES> = {
  problem: 'problem',
  customer: 'customer',
  market: 'market',
  competition: 'competition',
  revenue: 'revenue',
  'ai-strategy': 'ai_strategy',
  execution: 'execution',
  traction: 'validation',
  risk: 'risk',
};

/** All 9 dimension IDs in call order */
const DIMENSION_IDS = ['problem', 'customer', 'market', 'competition', 'revenue', 'ai-strategy', 'execution', 'traction', 'risk'] as const;

/**
 * Single dimension Gemini call — returns DimensionDetail + headline + diagram.
 * Uses per-dimension schema from DIMENSION_SCHEMAS.
 */
// deno-lint-ignore no-explicit-any
async function composeDimension(
  dimensionId: string,
  profile: StartupProfile | null,
  market: MarketResearch | null,
  competitors: CompetitorAnalysis | null,
  scoring: ScoringResult | null,
  mvp: MVPPlan | null,
  interviewContext: InterviewContext | undefined,
  timeoutMs: number,
// deno-lint-ignore no-explicit-any
): Promise<Record<string, any> | null> {
  const prompt = DIMENSION_PROMPTS[dimensionId];
  const schema = DIMENSION_SCHEMAS[dimensionId];
  if (!prompt || !schema) {
    console.warn(`[Composer:GroupE:${dimensionId}] No prompt/schema found — skipping`);
    return null;
  }

  const subScoreKey = DIM_TO_SUBSCORES[dimensionId];
  const subScoreNames = subScoreKey ? DIMENSION_SUB_SCORES[subScoreKey] : [];

  const systemPrompt = `${TONE}

## Your task: Deep-dive assessment of the "${dimensionId}" dimension

${prompt.focus}

### Sub-scores to evaluate (score each 0-100):
${(subScoreNames as readonly string[]).map((name: string) => `- ${name}`).join('\n')}

### Diagram instructions:
${prompt.diagramHint}

### Output rules:
- composite_score: weighted average of your sub-scores (0-100)
- headline: one punchy assessment line (10-15 words), lead with the key insight
- executive_summary: 2-3 sentences, specific to THIS startup
- risk_signals: 2-3 concrete risks for this dimension
- priority_actions: 2-3 specific, actionable next steps
- diagram: follow the schema exactly`;

  // Build compact context — include relevant pipeline data
  const context: Record<string, unknown> = {};
  if (profile) {
    context.idea = profile.idea;
    context.problem = profile.problem;
    context.customer = profile.customer;
    context.solution = profile.solution;
    context.differentiation = profile.differentiation;
    context.industry = profile.industry;
    if (profile.problem_structured) context.problem_structured = profile.problem_structured;
    if (profile.customer_structured) context.customer_structured = profile.customer_structured;
    if (profile.idea_quality) context.idea_quality = profile.idea_quality;
  }
  if (market) {
    context.market = { tam: market.tam, sam: market.sam, som: market.som, growth_rate: market.growth_rate, methodology: market.methodology };
  }
  if (competitors) {
    context.competitors = {
      direct: (competitors.direct_competitors || []).slice(0, 3).map(c => ({ name: c.name, threat_level: c.threat_level })),
      market_gaps: (competitors.market_gaps || []).slice(0, 3),
      ...(competitors.positioning ? { positioning: competitors.positioning } : {}),
    };
  }
  if (scoring) {
    context.scoring = {
      overall: scoring.overall_score,
      verdict: scoring.verdict,
      dimension_scores: scoring.dimension_scores,
      ...(scoring.risk_queue ? { top_risks: scoring.risk_queue.slice(0, 3).map(r => r.assumption) } : {}),
      ...(scoring.evidence_grades ? { evidence_grades: scoring.evidence_grades.slice(0, 3) } : {}),
      ...(scoring.highest_signal_level ? { signal_level: scoring.highest_signal_level } : {}),
    };
  }
  if (mvp) {
    context.mvp = { scope: mvp.mvp_scope, founder_stage: mvp.founder_stage };
  }

  const userPrompt = `Assess the "${dimensionId}" dimension for this startup:

${JSON.stringify(context)}`;

  return callGroupGemini<Record<string, unknown>>(`GroupE:${dimensionId}`, systemPrompt, userPrompt, schema, timeoutMs, 1536);
}

/**
 * Group E orchestrator — runs 9 dimension calls in parallel with 200ms stagger.
 * Returns a Record<dimensionId, dimensionData> for dimensions that succeeded.
 */
async function composeGroupE(
  profile: StartupProfile | null,
  market: MarketResearch | null,
  competitors: CompetitorAnalysis | null,
  scoring: ScoringResult | null,
  mvp: MVPPlan | null,
  interviewContext: InterviewContext | undefined,
  timeoutMs: number,
// deno-lint-ignore no-explicit-any
): Promise<Record<string, any> | null> {
  const perCallTimeout = Math.min(30_000, timeoutMs - 2_000); // 30s max per call, 2s buffer
  if (perCallTimeout < 10_000) {
    console.warn(`[Composer:GroupE] Per-call timeout too low (${perCallTimeout}ms) — skipping`);
    return null;
  }

  console.log(`[Composer:GroupE] Starting 9 dimension calls (${perCallTimeout}ms per call, 200ms stagger)`);

  // Stagger calls by 200ms to avoid rate limiting
  const promises = DIMENSION_IDS.map((dimId, i) =>
    new Promise<void>(resolve => setTimeout(resolve, i * 200))
      .then(() => composeDimension(dimId, profile, market, competitors, scoring, mvp, interviewContext, perCallTimeout))
      .then(result => ({ dimId, result }))
      .catch(e => {
        console.error(`[Composer:GroupE:${dimId}] Failed:`, e instanceof Error ? e.message : e);
        return { dimId, result: null };
      })
  );

  const results = await Promise.all(promises);

  // Collect successful dimensions
  // deno-lint-ignore no-explicit-any
  const dimensions: Record<string, any> = {};
  let successCount = 0;
  for (const { dimId, result } of results) {
    if (result && typeof result === 'object' && 'composite_score' in result) {
      dimensions[dimId] = result;
      successCount++;
    }
  }

  console.log(`[Composer:GroupE] ${successCount}/${DIMENSION_IDS.length} dimensions succeeded`);
  return successCount > 0 ? dimensions : null;
}

// ---------------------------------------------------------------------------
// 022-SKI: Normalize group output — strip nulls, ensure arrays
// ---------------------------------------------------------------------------
// deno-lint-ignore no-explicit-any
function normalizeGroup<T>(group: T | null, groupName: string): T | null {
  if (!group) return null;
  const obj = group as Record<string, unknown>;
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      delete obj[key];
    }
    // Ensure array fields are actually arrays
    if (key === 'key_questions' || key === 'risks_assumptions' || key === 'next_steps' || key === 'resources_links') {
      if (!Array.isArray(val)) {
        obj[key] = val ? [val] : [];
      }
    }
  }
  console.log(`[Composer:normalize:${groupName}] Keys: ${Object.keys(obj).length}`);
  return group;
}

// ---------------------------------------------------------------------------
// Merge all groups into a single ValidatorReport
// ---------------------------------------------------------------------------
function mergeGroups(
  groupA: ComposerGroupA | null,
  groupB: ComposerGroupB | null,
  groupC: ComposerGroupC | null,
  groupD: ComposerGroupD | null,
  scoring: ScoringResult | null,
  // deno-lint-ignore no-explicit-any
  groupE?: Record<string, any> | null,
): ValidatorReport | null {
  // If all 3 parallel groups failed, return null (same as old behavior)
  if (!groupA && !groupB && !groupC) {
    console.error('[Composer:merge] All 3 parallel groups failed — no report');
    return null;
  }

  // Build report with fallbacks for failed groups
  const report: ValidatorReport = {
    // Group D (synthesis) — fallback to scoring verdict
    summary_verdict: groupD?.summary_verdict || scoring?.verdict || 'Report generation partially failed — see individual sections.',
    verdict_oneliner: groupD?.verdict_oneliner,
    success_condition: groupD?.success_condition,
    biggest_risk: groupD?.biggest_risk,

    // Group A (problem & customer) — D-01 fix: fallback to objects (strings trigger isV2Report()===false)
    problem_clarity: groupA?.problem_clarity || { who: 'Unknown', pain: 'Problem analysis unavailable — group A generation failed.', current_fix: 'Unknown', severity: 'low' as const },
    customer_use_case: groupA?.customer_use_case || { persona: { name: 'Unknown', role: 'Unknown', context: 'Data unavailable' }, without: 'Use case unavailable — group A generation failed.', with: 'N/A', time_saved: 'Unknown' },
    key_questions: groupA?.key_questions || [{ question: 'What is the core problem?', why_it_matters: 'Foundation of the business', validation_method: 'Customer interviews', risk_level: 'fatal' as const }],

    // Group B (market & risk) — fallback to minimal values
    market_sizing: groupB?.market_sizing || { tam: 0, sam: 0, som: 0, citations: [] },
    competition: groupB?.competition || { competitors: [], citations: [] },
    scores_matrix: groupB?.scores_matrix || scoring?.scores_matrix || { dimensions: [], overall_weighted: 0 },
    top_threat: groupB?.top_threat,
    risks_assumptions: groupB?.risks_assumptions || scoring?.risks_assumptions || [],

    // Group C (execution & economics) — fallback to minimal structures
    // D-01 fix: fallback to object (string triggers isV2Report()===false)
    mvp_scope: groupC?.mvp_scope || { one_liner: 'MVP scope unavailable — group C generation failed.', build: [], buy: [], skip_for_now: [], tests_assumption: 'Unknown', success_metric: 'Unknown', timeline_weeks: 0 },
    next_steps: groupC?.next_steps || [],
    revenue_model: groupC?.revenue_model || { recommended_model: 'TBD', reasoning: 'Revenue model analysis unavailable', alternatives: [], unit_economics: { cac: 0, ltv: 0, ltv_cac_ratio: 0, payback_months: 0 } },
    financial_projections: groupC?.financial_projections || { scenarios: [], break_even: { months: 0, revenue_required: 0, assumptions: 'Data unavailable' }, key_assumption: 'Data unavailable' },
    team_hiring: groupC?.team_hiring || { current_gaps: [], mvp_roles: [], monthly_burn: 0, advisory_needs: [] },
    technology_stack: groupC?.technology_stack || { stack_components: [], feasibility: 'medium' as const, feasibility_rationale: 'Data unavailable', technical_risks: [], mvp_timeline_weeks: 0 },
    resources_links: groupC?.resources_links || [],

    // V3: Group E dimension data — keyed by dimension ID
    ...(groupE ? { dimensions: groupE } : {}),
  };

  // Validate all 15 required fields are present
  const required = [
    'summary_verdict', 'problem_clarity', 'customer_use_case', 'market_sizing',
    'competition', 'risks_assumptions', 'mvp_scope', 'next_steps',
    'technology_stack', 'revenue_model', 'team_hiring', 'key_questions',
    'resources_links', 'scores_matrix', 'financial_projections',
  ];
  const missing = required.filter(k => !(k in report));
  if (missing.length > 0) {
    console.warn(`[Composer:merge] Missing fields after merge: ${missing.join(', ')}`);
  }

  return report;
}

// ---------------------------------------------------------------------------
// Main entry point — same signature as before + interviewContext bug fix
// ---------------------------------------------------------------------------
export async function runComposer(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile | null,
  market: MarketResearch | null,
  competitors: CompetitorAnalysis | null,
  scoring: ScoringResult | null,
  mvp: MVPPlan | null,
  timeoutBudgetMs?: number,
  interviewContext?: InterviewContext,  // BUG FIX: was passed by pipeline but not accepted
): Promise<ValidatorReport | null> {
  const agentName = 'ComposerAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  try {
    const totalBudget = timeoutBudgetMs || AGENT_TIMEOUTS.composer;
    const composerStart = Date.now();

    // Budget split: Phase 1 (A+B+C parallel) → Phase 2 (D synthesis) → Phase 3 (Group E dimensions)
    // Phase 3 uses remaining time after Phase 1+2, capped at groupE timeout.
    // Skip Group E if < 20s remain after Phase 2.
    let parallelTimeout: number;
    let synthesisTimeout: number;

    if (totalBudget < 45_000) {
      // Tight budget — minimal timeouts, no Group E
      parallelTimeout = 20_000;
      synthesisTimeout = 10_000;
    } else {
      parallelTimeout = Math.min(COMPOSER_GROUP_TIMEOUTS.parallel, Math.floor(totalBudget * 0.4));
      synthesisTimeout = Math.min(COMPOSER_GROUP_TIMEOUTS.synthesis, Math.floor(totalBudget * 0.2));
    }

    console.log(`[Composer] Budget: ${totalBudget}ms → parallel: ${parallelTimeout}ms, synthesis: ${synthesisTimeout}ms`);

    // Phase 1: Run groups A, B, C in parallel
    const startParallel = Date.now();
    const [groupA, groupB, groupC] = await Promise.all([
      composeGroupA(profile, scoring, interviewContext, parallelTimeout)
        .catch(e => { console.error('[Composer:GroupA] Failed:', e instanceof Error ? e.message : e); return null; }),
      composeGroupB(profile, market, competitors, scoring, parallelTimeout)
        .catch(e => { console.error('[Composer:GroupB] Failed:', e instanceof Error ? e.message : e); return null; }),
      composeGroupC(profile, scoring, mvp, parallelTimeout)
        .catch(e => { console.error('[Composer:GroupC] Failed:', e instanceof Error ? e.message : e); return null; }),
    ]);
    const parallelMs = Date.now() - startParallel;

    const groupStatus = [
      groupA ? 'A:ok' : 'A:FAIL',
      groupB ? 'B:ok' : 'B:FAIL',
      groupC ? 'C:ok' : 'C:FAIL',
    ].join(', ');
    console.log(`[Composer] Parallel phase done in ${parallelMs}ms — ${groupStatus}`);

    // 022-SKI: Deterministic top_threat extraction if Group B missed it
    if (groupB && groupB.risks_assumptions?.length > 0 && !groupB.top_threat?.assumption) {
      const severityOrder: Record<string, number> = { fatal: 0, risky: 1, watch: 2 };
      const sorted = [...groupB.risks_assumptions].sort((a, b) =>
        (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2)
      );
      groupB.top_threat = sorted[0];
      console.log('[Composer:GroupB] Deterministically extracted top_threat from risks');
    }

    // 022-SKI: Cross-group consistency hints for Group D
    const consistencyNotes: string[] = [];
    if (groupB?.market_sizing?.som && groupB.market_sizing.som < 50_000_000) {
      consistencyNotes.push('SOM < $50M — avoid "massive market" language');
    }
    if (scoring && scoring.overall_score < 50) {
      consistencyNotes.push(`Overall score ${scoring.overall_score} — verdict must reflect significant concerns`);
    }
    if (groupC?.revenue_model?.unit_economics?.ltv_cac_ratio && groupC.revenue_model.unit_economics.ltv_cac_ratio < 2) {
      consistencyNotes.push('LTV:CAC < 2:1 — flag unit economics as key risk');
    }

    // Phase 2: Run Group D (synthesis) sequentially — needs A+B+C outputs
    const startSynthesis = Date.now();
    const groupD = await composeGroupD(groupA, groupB, groupC, scoring, interviewContext, synthesisTimeout, consistencyNotes)
      .catch(e => { console.error('[Composer:GroupD] Failed:', e instanceof Error ? e.message : e); return null; });
    const synthesisMs = Date.now() - startSynthesis;
    console.log(`[Composer] Synthesis phase done in ${synthesisMs}ms — ${groupD ? 'D:ok' : 'D:FAIL'}`);

    // 022-SKI: Normalize group outputs before merging
    const normA = normalizeGroup(groupA, 'A');
    const normB = normalizeGroup(groupB, 'B');
    const normC = normalizeGroup(groupC, 'C');
    const normD = normalizeGroup(groupD, 'D');

    // Phase 3: Group E — 9 parallel dimension detail calls (V3)
    // Only runs if we have enough budget remaining. Skip = V2 report.
    // deno-lint-ignore no-explicit-any
    let groupEResult: Record<string, any> | null = null;
    const elapsedMs = Date.now() - composerStart;
    const remainingBudget = totalBudget - elapsedMs;
    const groupETimeout = Math.min(remainingBudget - 5_000, COMPOSER_GROUP_TIMEOUTS.groupE);

    if (groupETimeout >= 20_000 && profile) {
      console.log(`[Composer] Phase 3 (Group E): ${groupETimeout}ms budget (${remainingBudget}ms remaining)`);
      const startGroupE = Date.now();
      groupEResult = await composeGroupE(profile, market, competitors, scoring, mvp, interviewContext, groupETimeout)
        .catch(e => { console.error('[Composer:GroupE] Failed:', e instanceof Error ? e.message : e); return null; });
      const groupEMs = Date.now() - startGroupE;
      console.log(`[Composer] Phase 3 done in ${groupEMs}ms — ${groupEResult ? `${Object.keys(groupEResult).length}/9 dimensions` : 'FAIL'}`);
    } else {
      console.log(`[Composer] Skipping Group E: ${groupETimeout < 20_000 ? `insufficient budget (${groupETimeout}ms)` : 'no profile'} — saving as V2`);
    }

    // Phase 4: Merge all groups into a single ValidatorReport
    const report = mergeGroups(normA, normB, normC, normD, scoring, groupEResult);

    if (!report) {
      await completeRun(supabase, sessionId, agentName, 'failed', null, [], 'All parallel groups failed');
      return null;
    }

    const totalMs = Date.now() - composerStart;
    const callCount = 4 + (groupEResult ? Object.keys(groupEResult).length : 0);
    console.log(`[Composer] Total: ${totalMs}ms (${callCount} Gemini calls: 3 parallel + 1 sequential${groupEResult ? ` + ${Object.keys(groupEResult).length} dimension` : ''})`);
    await completeRun(supabase, sessionId, agentName, 'ok', report);
    return report;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
