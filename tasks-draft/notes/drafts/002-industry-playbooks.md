---
task_id: 002-VAL
title: Industry Playbooks — 8 Expert Knowledge Bundles
diagram_ref: D-05 (Context Strategy)
phase: CORE
priority: P0
status: Not Started
skill: /gemini
ai_model: gemini-3-flash-preview
subagents: [code-reviewer]
edge_function: validator-followup, validator-start
schema_tables: []
depends_on: [001-VAL]
---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screens** | None (backend only) |
| **Features** | 8 industry playbooks as TypeScript objects, industry detection, prompt injection |
| **Agents** | All 7 pipeline agents + Interviewer |
| **Edge Functions** | /validator-followup, /validator-start |
| **Use Cases** | Detected SaaS -> inject SaaS benchmarks, questions, pitfalls into all agents |
| **Real-World** | "Founder says 'subscription app'. Industry: SaaS detected. Interviewer asks about churn + LTV:CAC. Scoring benchmarks: good churn <5%/mo." |

---

## Description

Create 8 industry playbook objects (SaaS, Marketplace, Fintech, Healthtech, Edtech, E-commerce, AI/ML, Hardware) as TypeScript code. Each playbook contains key_questions, key_metrics, benchmarks, common_pitfalls, and mvp_advice. Inject the relevant playbook into each agent's system prompt as a compact context block when the industry is detected. No new infrastructure -- just prompt engineering with typed data.

## Rationale

**Problem:** Same prompts run for SaaS and hardware. SaaS startups never get asked about churn. Hardware startups never get asked about supply chain or unit economics. Scoring has no industry-specific benchmarks.

**Solution:** Compact industry playbooks (each under 200 tokens when formatted) injected as system prompt context. Playbooks are pure TypeScript objects -- no database, no new tables, no API calls. Industry is detected from the Extractor output or the Interviewer conversation.

**Impact:** Highest-impact improvement per engineering effort. Turns a generic AI into an industry expert instantly. Research agent searches for industry-specific metrics. Scoring agent benchmarks against industry standards. Composer agent flags industry-specific pitfalls.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder building SaaS | get questions about churn, LTV:CAC, pricing model | the validation is relevant to my business type |
| Founder building hardware | get questions about supply chain, BOM cost, certification | I don't get generic SaaS advice |
| Research agent | know which metrics to search for per industry | I find specific benchmarks, not generic market data |
| Scoring agent | use industry benchmarks for "what good looks like" | scores are calibrated to the industry |
| Composer agent | know common pitfalls for this industry | the report flags industry-specific risks |

---

## Real-World Example

> Maria describes a fintech app for micro-investing. The Extractor outputs `industry: "fintech"`. The pipeline loads the Fintech playbook. Research now searches for "micro-investing app regulatory requirements 2025" and "robo-advisor market size 2025" instead of generic "micro-investing market". Scoring benchmarks against fintech standards: transaction volume growth, fraud rate baselines, regulatory approval timeline. The Composer flags: "Common fintech pitfall: Underestimating compliance costs and licensing timelines. Budget 6-12 months and $50K-$200K for money transmitter licenses."

---

## Goals

1. **Primary:** 8 playbooks created with consistent structure and accurate benchmarks
2. **Secondary:** Playbook auto-injects into agents when industry detected from Extractor output
3. **Quality:** Each playbook adds fewer than 200 tokens per agent call when formatted

---

## Acceptance Criteria

- [ ] 8 playbooks implemented: SaaS, Marketplace, Fintech, Healthtech, Edtech, E-commerce, AI/ML, Hardware #CORE
- [ ] Each playbook has: key_questions (3-5), key_metrics (3-5), benchmarks (object with metric:value pairs), common_pitfalls (3-5 strings), mvp_advice (1-2 sentence string) #CORE
- [ ] 1 general/fallback playbook for unrecognized industries #CORE
- [ ] Playbooks stored as typed TypeScript objects in `supabase/functions/validator-start/playbooks.ts` #CORE
- [ ] `getPlaybook(industry: string)` function returns matching playbook or general fallback #CORE
- [ ] Industry matching is case-insensitive and handles aliases (e.g., "saas", "SaaS", "b2b saas" all match SaaS) #CORE
- [ ] Injection format: `\nINDUSTRY CONTEXT ([industry]):\n...` appended to each agent's system prompt #CORE
- [ ] Playbook injection adds fewer than 200 tokens per agent call #CORE
- [ ] Interviewer's follow-up questions incorporate playbook key_questions when industry is detected #CORE

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Playbooks | `supabase/functions/validator-start/playbooks.ts` | **Create** -- 8 industry objects + general fallback + `getPlaybook(industry)` + `formatPlaybookForPrompt(playbook)` |
| Interviewer | `supabase/functions/validator-followup/prompt.ts` | **Modify** -- add optional industry context section; when industry known, append playbook key_questions |
| Interviewer handler | `supabase/functions/validator-followup/index.ts` | **Modify** -- accept optional `industry` field in request body; if provided, load playbook and append to system prompt |
| Config | `supabase/functions/validator-start/config.ts` | **No change** -- playbook injection happens in agent runner, not config |
| Pipeline | `supabase/functions/validator-start/pipeline.ts` | **Modify** -- after Extractor returns profile.industry, call `getPlaybook(industry)` and pass to subsequent agents |
| Extractor | `supabase/functions/validator-start/agents/extractor.ts` | **No change** -- already extracts `industry` field |
| Research | `supabase/functions/validator-start/agents/research.ts` | **Modify** -- accept playbook parameter, append formatted playbook to system prompt |
| Competitors | `supabase/functions/validator-start/agents/competitors.ts` | **Modify** -- accept playbook parameter, append formatted playbook to system prompt |
| Scoring | `supabase/functions/validator-start/agents/scoring.ts` | **Modify** -- accept playbook parameter, use benchmarks for calibration |
| MVP | `supabase/functions/validator-start/agents/mvp.ts` | **Modify** -- accept playbook parameter, use mvp_advice |
| Composer | `supabase/functions/validator-start/agents/composer.ts` | **Modify** -- accept playbook parameter, use common_pitfalls |
| Verifier | `supabase/functions/validator-start/agents/verifier.ts` | **No change** -- pure JS validation, no AI prompt |

### Playbook Type Specification

```typescript
// supabase/functions/validator-start/playbooks.ts

export interface IndustryPlaybook {
  id: string;                    // e.g., "saas", "fintech"
  label: string;                 // e.g., "SaaS", "Fintech"
  aliases: string[];             // e.g., ["b2b saas", "software as a service"]
  key_questions: string[];       // 3-5 industry-specific interview questions
  key_metrics: string[];         // 3-5 metrics names (e.g., "Monthly Churn Rate")
  benchmarks: Record<string, string>; // metric -> "good" value (e.g., "Monthly Churn": "<5%")
  common_pitfalls: string[];     // 3-5 common mistakes
  mvp_advice: string;            // 1-2 sentence MVP guidance
}
```

### Playbook Content (8 Industries + General)

**SaaS:**
- key_questions: "What's your pricing model (freemium, usage-based, seat-based)?", "What's your expected monthly churn rate?", "How do you plan to acquire your first 100 customers?", "What's your LTV:CAC target?"
- key_metrics: Monthly Churn Rate, LTV:CAC Ratio, MRR Growth, CAC Payback Period, Net Revenue Retention
- benchmarks: { "Monthly Churn": "<5%", "LTV:CAC": ">3:1", "CAC Payback": "<12 months", "NRR": ">100%" }
- common_pitfalls: "Building features before validating willingness to pay", "Underpricing to win early customers then struggling to raise prices", "Ignoring churn in favor of new acquisition", "No clear path from free tier to paid conversion"
- mvp_advice: "Launch with 1 core workflow that replaces a spreadsheet or manual process. Charge from day 1, even if it's $10/month -- willingness to pay is the strongest validation signal."

**Marketplace:**
- key_questions: "Which side of the marketplace will you build first -- supply or demand?", "How do transactions happen today without your platform?", "What's your take rate or commission model?", "How will you solve the chicken-and-egg problem in your first market?"
- key_metrics: GMV, Take Rate, Liquidity (matches/listings), Supply/Demand Ratio, Repeat Transaction Rate
- benchmarks: { "Take Rate": "10-25%", "Liquidity": ">30% of listings transact", "Repeat Rate": ">40% within 90 days" }
- common_pitfalls: "Trying to scale both sides simultaneously", "Take rate too low to sustain operations", "Disintermediation risk (buyers/sellers going direct)", "Ignoring trust and safety infrastructure"
- mvp_advice: "Constrain to one geography or niche. Manually match the first 50 transactions to prove the value exists before building matching algorithms."

**Fintech:**
- key_questions: "What regulatory approvals or licenses do you need?", "How will you handle KYC/AML compliance?", "What's your unit economics per transaction?", "Who is your banking/payments infrastructure partner?"
- key_metrics: Transaction Volume, Fraud Rate, Regulatory Approval Timeline, Cost per Transaction, Customer Acquisition Cost
- benchmarks: { "Fraud Rate": "<0.1%", "Cost per Transaction": "<$0.50", "Regulatory Timeline": "6-18 months" }
- common_pitfalls: "Underestimating compliance costs and licensing timelines ($50K-$200K+)", "Building before regulatory clarity", "Ignoring fraud prevention until scale", "Choosing the wrong banking partner"
- mvp_advice: "Use a licensed partner (Stripe Treasury, Unit, Synapse) to launch under their license. Prove demand before investing in your own licenses."

**Healthtech:**
- key_questions: "Does your product require FDA approval or HIPAA compliance?", "Who is the buyer -- the patient, the provider, or the payer (insurance)?", "What's the clinical validation path?", "How long is the typical sales cycle for health systems?"
- key_metrics: Clinical Outcome Improvement, Sales Cycle Length, HIPAA Compliance Status, Reimbursement Code Coverage, Patient Engagement Rate
- benchmarks: { "Sales Cycle": "6-18 months for health systems", "HIPAA": "Required for any PHI", "Clinical Validation": "Pilot with 1-3 health systems" }
- common_pitfalls: "Building for patients when the buyer is the health system", "Ignoring reimbursement codes (no code = no payment)", "Underestimating HIPAA compliance effort", "Clinical validation taking 2-3x longer than expected"
- mvp_advice: "Start with a non-regulated use case (wellness, scheduling, admin) to prove demand. If clinical, partner with one health system for a paid pilot before building the full product."

**Edtech:**
- key_questions: "Who pays -- the student, the parent, the school, or the employer?", "How do you measure learning outcomes?", "What's your content creation or curation strategy?", "How will you handle the seasonal buying cycle for schools?"
- key_metrics: Completion Rate, Learning Outcome Improvement, Student Engagement (DAU/MAU), Content Library Size, School District Sales Cycle
- benchmarks: { "Completion Rate": ">60% for paid courses", "DAU/MAU": ">30%", "School Sales Cycle": "6-12 months (budget cycles)" }
- common_pitfalls: "Building for students when the budget holder is the school district", "Low completion rates masking poor product-market fit", "Seasonal revenue cycles causing cash flow problems", "Content becoming stale without update process"
- mvp_advice: "Build one course or module and sell it directly to 20 students. Measure completion rate and NPS before building a platform. If B2B, get one school to pay for a pilot."

**E-commerce:**
- key_questions: "What's your customer acquisition strategy beyond paid ads?", "What are your unit economics (COGS, shipping, returns)?", "Do you have supply chain partnerships secured?", "What's your repeat purchase rate target?"
- key_metrics: Customer Acquisition Cost, Average Order Value, Repeat Purchase Rate, Return Rate, Gross Margin
- benchmarks: { "CAC": "<1/3 of first-order AOV", "Repeat Rate": ">25% within 6 months", "Return Rate": "<15%", "Gross Margin": ">50% for D2C" }
- common_pitfalls: "Relying solely on paid social for acquisition (unsustainable CAC)", "Ignoring return rates in unit economics", "Inventory risk before demand validation", "Underestimating shipping and fulfillment complexity"
- mvp_advice: "Sell 50 units through a landing page + Instagram/TikTok before building a full store. Validate willingness to pay and repeat purchase intent with real transactions."

**AI/ML:**
- key_questions: "What's your data moat -- where does your training data come from?", "How do you measure model quality (accuracy, latency, cost per inference)?", "What happens when the model is wrong -- what's the blast radius?", "Is this AI-native (impossible without AI) or AI-enhanced (existing workflow + AI layer)?"
- key_metrics: Model Accuracy, Inference Cost, Data Acquisition Cost, Time to Value, Error Impact Severity
- benchmarks: { "Accuracy": ">90% for production use", "Inference Cost": "<$0.01 per request for consumer", "Time to Value": "<30 seconds for user-facing AI" }
- common_pitfalls: "Building a model without a proprietary data advantage", "Demo accuracy does not equal production accuracy", "Ignoring edge cases and failure modes", "AI wrapper with no defensibility (GPT wrapper problem)"
- mvp_advice: "Use an existing foundation model (GPT, Gemini, Claude) with prompt engineering and fine-tuning. Prove the workflow value before investing in custom model training."

**Hardware:**
- key_questions: "What's your BOM (bill of materials) cost at 100 units vs 10,000 units?", "Do you need certifications (FCC, CE, UL)?", "What's your manufacturing partner situation?", "How will you handle returns, repairs, and warranty?"
- key_metrics: BOM Cost, Certification Timeline, Manufacturing Lead Time, Defect Rate, Gross Margin at Scale
- benchmarks: { "Gross Margin": ">40% at scale", "Defect Rate": "<2%", "Certification": "3-9 months for FCC/CE", "Manufacturing Lead": "8-16 weeks for first run" }
- common_pitfalls: "Prototype cost is not production cost (10x difference is common)", "Certification timelines delaying launch by 6+ months", "Inventory risk with minimum order quantities", "Support and warranty costs destroying margins"
- mvp_advice: "Build 10 prototypes with off-the-shelf components. Get 5 paying customers to use them for 30 days. Validate the problem and willingness to pay before tooling for manufacturing."

**General (fallback):**
- key_questions: "Who is your most specific target customer?", "What do they use today to solve this problem?", "Why would they switch to your solution?", "How will you reach your first 10 customers?"
- key_metrics: Customer Acquisition Cost, Retention Rate, Revenue per Customer, Time to Value
- benchmarks: { "LTV:CAC": ">3:1", "Retention": ">70% at 90 days" }
- common_pitfalls: "Building before talking to customers", "Targeting too broad a market", "No clear revenue model", "Solving a nice-to-have, not a must-have"
- mvp_advice: "Find 5 people who have the problem. Solve it manually for them. If they would pay for the manual solution, build the automated version."

### formatPlaybookForPrompt Specification

```typescript
export function formatPlaybookForPrompt(playbook: IndustryPlaybook): string {
  // Returns a compact text block under 200 tokens
  // Format:
  // INDUSTRY CONTEXT (SaaS):
  // Key metrics: Monthly Churn Rate (<5%), LTV:CAC (>3:1), ...
  // Pitfalls: Building features before validating willingness to pay; ...
  // MVP: Launch with 1 core workflow...
}
```

### getPlaybook Specification

```typescript
export function getPlaybook(industry: string): IndustryPlaybook {
  // 1. Normalize: lowercase, trim
  // 2. Exact match on playbook.id
  // 3. Alias match: check if input contains any alias
  // 4. Fuzzy match: check if input contains playbook.id or playbook.label
  // 5. Fallback: return GENERAL_PLAYBOOK
}
```

### Pipeline Integration

In `supabase/functions/validator-start/pipeline.ts`, after the Extractor agent returns `profile.industry`:

```typescript
import { getPlaybook, formatPlaybookForPrompt } from "./playbooks.ts";

// After extractor completes:
const playbook = getPlaybook(profile.industry);
const playbookContext = formatPlaybookForPrompt(playbook);
console.log(`[Pipeline] Industry: ${profile.industry} -> Playbook: ${playbook.label}`);

// Pass playbookContext to each subsequent agent
const research = await runResearch(supabase, sessionId, profile, playbookContext);
const competitors = runCompetitors(supabase, sessionId, profile, playbookContext); // background
const scoring = await runScoring(supabase, sessionId, profile, research, playbookContext);
// ...etc
```

### Agent Modification Pattern

Each agent that receives `playbookContext` appends it to the system prompt:

```typescript
// In each agent (research, competitors, scoring, mvp, composer):
export async function runResearch(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile,
  playbookContext?: string  // NEW optional parameter
): Promise<MarketResearch | null> {
  // ...existing code...

  const systemPrompt = `...existing prompt...${
    playbookContext ? `\n\n${playbookContext}` : ""
  }`;

  // ...rest of agent...
}
```

### Interviewer Integration

In `supabase/functions/validator-followup/index.ts`, accept an optional `industry` field:

```typescript
const { messages, industry } = body;

let systemPrompt = FOLLOWUP_SYSTEM_PROMPT;
if (industry) {
  const playbook = getPlaybook(industry);
  const playbookContext = formatPlaybookForPrompt(playbook);
  systemPrompt += `\n\n${playbookContext}\n\nUse the industry-specific questions above when relevant topics come up.`;
}
```

The frontend passes `industry` once it is detected (from the extracted fields added in 001-VAL).

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Industry not detected (Extractor returns empty or "other") | Use general fallback playbook with generic startup questions/benchmarks |
| Multi-industry (e.g., "fintech marketplace") | Match primary industry (first keyword match), log secondary for reference |
| Industry changes mid-conversation | Interviewer uses latest industry; pipeline uses Extractor output (final) |
| Playbook not found for detected industry (new category) | Fall back to general playbook, log warning: `[Pipeline] No playbook for: [industry], using general` |
| Playbook injection exceeds 200 tokens | formatPlaybookForPrompt truncates pitfalls/advice to stay under budget |
| Agent already has a long prompt | Playbook appended at end; total prompt length stays within Gemini context window (1M tokens, not a concern) |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Store playbooks in database | TypeScript objects -- no DB overhead, version-controlled, type-safe |
| Create a new edge function for playbooks | Inject into existing agents via prompt parameter |
| Hardcode industry detection in each agent | Centralize in `getPlaybook()` with alias matching |
| Make playbook injection mandatory | Optional parameter with graceful fallback |
| Write 500-token playbook descriptions | Keep under 200 tokens -- compact, high-signal content |
| Use playbook as the only prompt context | Append to existing prompts, never replace them |

---

## AI Prompt Instructions

### Context Block

You are implementing Industry Playbooks for the StartupAI validator pipeline.
- Stack: React 18 + TypeScript + Vite + Supabase + shadcn/ui
- Edge functions: Deno runtime, Gemini 3 Flash
- Path alias: `@/` maps to `./src/`
- Use existing patterns from `supabase/functions/validator-start/agents/`
- Follow the wiring plan exactly
- Depends on 001-VAL (Smart Interview depth tracking) for `extracted.industry` field

### Constraints

- Gemini: Always use `responseJsonSchema` + `responseMimeType` for guaranteed JSON (G1 rule)
- Gemini 3: Keep temperature at 1.0 (G2 rule)
- API key in `x-goog-api-key` header (G4 rule)
- Each playbook formatted output must be under 200 tokens
- No new database tables or migrations
- No new edge functions
- No `any` types

### Expected Output

1. Approach explanation (2-3 sentences)
2. New file: `supabase/functions/validator-start/playbooks.ts` with all 8 playbooks + general + getPlaybook + formatPlaybookForPrompt
3. Modified: each agent file to accept and use optional playbookContext
4. Modified: `supabase/functions/validator-followup/index.ts` to accept optional industry field
5. Modified: `supabase/functions/validator-followup/prompt.ts` to mention industry context when available

---

## Security Checklist

- [ ] No new secrets or API keys introduced #CORE
- [ ] Playbook content is static TypeScript -- no user input injection into playbooks #CORE
- [ ] Industry field from request body is sanitized (string, max 100 chars, used only for playbook lookup) #CORE
- [ ] No PII in playbook content #CORE
- [ ] JWT verification unchanged in all edge functions #CORE
- [ ] Rate limiting unchanged in all edge functions #CORE

---

## Production Ready Checklist

### Build Verification

- [ ] `npm run build` passes (no new errors) #CORE
- [ ] `npm run test` passes (no regressions, all 96+ tests green) #CORE
- [ ] `npm run lint` -- no new errors introduced #CORE
- [ ] No `console.log` left in frontend code #CORE

### Feature Verification

- [ ] `getPlaybook("saas")` returns SaaS playbook #CORE
- [ ] `getPlaybook("b2b saas")` returns SaaS playbook (alias match) #CORE
- [ ] `getPlaybook("unknown")` returns general playbook #CORE
- [ ] `getPlaybook("")` returns general playbook #CORE
- [ ] `formatPlaybookForPrompt(saasPlaybook)` produces fewer than 200 tokens #CORE
- [ ] Pipeline log shows correct playbook selection per industry #CORE
- [ ] All 7 agents complete without timeout regression (playbook adds minimal tokens) #CORE

### Security (edge function)

- [ ] JWT verification still works in validator-followup and validator-start #CORE
- [ ] No new environment variables needed #CORE
- [ ] Industry field input validated (string, bounded length) #CORE

### Deployment

- [ ] Edge functions deployed: `supabase functions deploy validator-followup` and `supabase functions deploy validator-start` #CORE
- [ ] Both respond 200 on valid requests #CORE
- [ ] Pipeline E2E: run with SaaS idea, verify SaaS playbook appears in agent logs #CORE
- [ ] Pipeline E2E: run with ambiguous idea, verify general fallback used #CORE

---

## Regression Checklist

- [ ] **Validator**: Chat follow-up still works without industry field (backwards compatible) #CORE
- [ ] **Validator**: Pipeline runs E2E -- all 7 agents complete within timeout budgets #CORE
- [ ] **Validator**: Report renders all 14 sections #CORE
- [ ] **Validator**: Agent timing not regressed (playbook adds <200 tokens, should not affect latency) #CORE
- [ ] **Lean Canvas**: Auto-populate from report still works #CORE
- [ ] **Dashboard**: Loads without errors #CORE
- [ ] **Auth**: Google OAuth login/logout cycle works #CORE

---

## Testing Requirements

| Type | Coverage | When |
|------|----------|------|
| Unit | getPlaybook matching logic (exact, alias, fuzzy, fallback) | This task |
| Unit | formatPlaybookForPrompt token count verification | This task |
| Integration | Pipeline E2E with SaaS idea -- verify playbook injection in logs | This task |
| Integration | Pipeline E2E with ambiguous idea -- verify general fallback | This task |
| Manual | Run 3 validations (SaaS, Fintech, Hardware) and check report quality | This task |

### Test Cases (minimum)

- [ ] Happy path: SaaS idea -> SaaS playbook detected -> agents receive SaaS context -> report mentions SaaS-specific metrics #CORE
- [ ] Alias match: "b2b software as a service" -> SaaS playbook #CORE
- [ ] Fuzzy match: "my fintech startup" -> Fintech playbook #CORE
- [ ] Fallback: "underwater basket weaving platform" -> general playbook #CORE
- [ ] Empty industry: Extractor returns `industry: ""` -> general playbook #CORE
- [ ] Interviewer with industry: follow-up questions include industry-specific topics #CORE
- [ ] Interviewer without industry: follow-up works as before (no regression) #CORE
- [ ] Timing: pipeline completes within 300s deadline with playbook injection #CORE

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Pipeline orchestration | `supabase/functions/validator-start/pipeline.ts` |
| Agent config and timeouts | `supabase/functions/validator-start/config.ts` |
| Extractor (extracts industry) | `supabase/functions/validator-start/agents/extractor.ts` |
| Research agent (longest prompt) | `supabase/functions/validator-start/agents/research.ts` |
| Competitors agent | `supabase/functions/validator-start/agents/competitors.ts` |
| Scoring agent | `supabase/functions/validator-start/agents/scoring.ts` |
| MVP agent | `supabase/functions/validator-start/agents/mvp.ts` |
| Composer agent | `supabase/functions/validator-start/agents/composer.ts` |
| Verifier agent (no AI, no change) | `supabase/functions/validator-start/agents/verifier.ts` |
| Interviewer prompt | `supabase/functions/validator-followup/prompt.ts` |
| Interviewer handler | `supabase/functions/validator-followup/index.ts` |
| Curated links (similar pattern) | `supabase/functions/validator-start/curated-links.ts` |
| Gemini shared client | `supabase/functions/_shared/gemini.ts` |

### Import Map

```typescript
// New file (Deno)
// supabase/functions/validator-start/playbooks.ts
export interface IndustryPlaybook { ... }
export function getPlaybook(industry: string): IndustryPlaybook { ... }
export function formatPlaybookForPrompt(playbook: IndustryPlaybook): string { ... }

// Agent imports (Deno)
import { getPlaybook, formatPlaybookForPrompt } from "../playbooks.ts";

// Interviewer import (Deno)
import { getPlaybook, formatPlaybookForPrompt } from "../validator-start/playbooks.ts";
// Note: Cross-function import may require shared location or duplication.
// Preferred: move playbooks.ts to supabase/functions/_shared/playbooks.ts
```
