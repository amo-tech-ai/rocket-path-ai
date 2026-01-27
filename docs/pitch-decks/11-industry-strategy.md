# Pitch Deck System — Industry Strategy

> **Version:** 1.0 | **Date:** January 27, 2026
> **Phase:** 1 (MVP) | **Priority:** P0
> **Purpose:** Industry playbooks, question packs, prompt templates, and shared architecture
> **Source of Truth:** Extracted from `100-pitch-deck-strategy.md` v2.0

---

## Overview

This document defines the **industry intelligence layer** that powers both the onboarding wizard and the pitch deck Smart Interviewer. It includes:

1. **Shared Question Pack Architecture** — Schema, scoring, stage filtering
2. **13 Industry Question Packs** — 8 questions each with input type, slide mapping, investor weight
3. **13 Industry Playbooks** — Narrative arc, slide emphasis, investor psychology, red flags, prompt context
4. **Cross-Industry Common Patterns** — Universal slide rules, stage-specific prompt injection
5. **AI Generation Prompt Template** — How playbooks + interview data are assembled
6. **Onboarding ↔ Pitch Deck Data Flow** — How shared packs feed both systems

---

## 1. Shared Question Pack Architecture

### Design Principle

Industry question packs are a **single source of truth** used by both onboarding and pitch deck wizards. Each pack is a JSON-configurable module stored in the codebase (not hardcoded in UI).

| Aspect | Onboarding Wizard | Pitch Deck Smart Interviewer |
|--------|-------------------|------------------------------|
| **Source** | Same industry pack | Same industry pack |
| **Questions shown** | 4-5 foundational (tagged `onboarding`) | 6-8 full set (tagged `pitch_deck`) |
| **AI research** | No (fast flow) | Yes (Gemini Search + URL Context) |
| **Output** | Startup profile fields | Slide-ready bullets + research context |
| **Suggestions** | Basic placeholder hints | Rich AI suggestions with +Add to slide |
| **Stage filtering** | No | Yes (Pre-Seed/Seed/Series A) |

### Pack Schema

```typescript
interface IndustryQuestionPack {
  industry_id: string;           // e.g. 'fintech'
  display_name: string;          // e.g. 'FinTech'
  questions: IndustryQuestion[];
}

interface IndustryQuestion {
  id: string;                    // e.g. 'fintech_target_customer'
  order: number;                 // Display order
  question: string;              // The question text
  why_investors_care: string;    // 1-line investor context
  input_type: 'text' | 'textarea' | 'select' | 'multi_select' | 'metrics' | 'bullets';
  options?: string[];            // For select/multi_select
  examples?: string[];           // Example answers
  ai_suggestions: string[];      // 3-6 suggestion strings
  slide_mapping: SlideType;      // Which slide this feeds
  investor_weight: 'high' | 'medium' | 'low'; // Scoring weight
  contexts: ('onboarding' | 'pitch_deck')[]; // Where to show
  stage_filter?: ('pre_seed' | 'seed' | 'series_a')[]; // Stage visibility
  conditional?: {               // Show only if condition met
    field: string;
    operator: 'exists' | 'equals' | 'gt' | 'lt';
    value?: unknown;
  };
}

type SlideType = 'problem' | 'solution' | 'market' | 'product' | 'traction' | 'business_model' | 'competition' | 'team' | 'financials' | 'ask';
```

### Question → Slide Auto-Mapping

| Question Category | Slide(s) It Feeds | How Answer Is Used |
|-------------------|-------------------|--------------------|
| Target Customer / Buyer | Market, Problem | Defines who and why |
| Problem / Pain | Problem | Data-backed pain point |
| Solution / Product | Solution, Product | What you built |
| AI Advantage / Moat | Solution, Competition | Defensibility |
| Integrations | Product | Ecosystem fit |
| Proof / Metrics | Traction | Evidence slide |
| Monetization / GTM | Business Model | Revenue explanation |
| Defensibility / Moat | Competition | Competitive positioning |

### Scoring Logic Per Question

| Weight | Investor Impact | Score Contribution | Examples |
|--------|----------------|-------------------|----------|
| **High** | Core investment thesis | 15 pts answered, 0 skipped | Problem, Proof/Metrics, AI Advantage |
| **Medium** | Important context | 10 pts answered, 0 skipped | Target Customer, Monetization, GTM |
| **Low** | Nice to have | 5 pts answered, 0 skipped | Integrations, Expansion, Workflow |

**Max score per pack:** ~80-100 pts. Normalized to 0-100 for signal strength.

### Stage-Aware Filtering

| Stage | Questions Shown | Focus |
|-------|----------------|-------|
| **Pre-Seed** | Skip unit economics, CAC/LTV. Add: vision, founder-market fit | Qualitative wins, problem clarity |
| **Seed** | Full 8-question set | Balanced story + early traction |
| **Series A** | Add: unit economics, cohort data, CAC/LTV. Skip: basic problem | Metrics-driven, execution proof |

### Conditional Follow-Up Rules

| Condition | Follow-Up |
|-----------|-----------|
| Traction metrics are empty | "What qualitative wins have you achieved?" |
| Revenue = 0 | "What's your path to first revenue?" |
| No competitors listed | "Who do customers compare you to?" |
| Moat answer is generic | "What would it cost a competitor to replicate this?" |

---

## 2. All 13 Industry Question Packs

### 1. AI SaaS / B2B

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | Who is the primary buyer and user? | Persona dropdown + text | Market | Medium |
| 2 | What workflow do you automate or replace? | Bullet list | Problem | High |
| 3 | Where does AI materially outperform rules or humans? | 3 fields (speed, cost, quality) | Solution | High |
| 4 | What proprietary data do you collect or improve? | Text + checklist | Competition | High |
| 5 | What integrations are critical? | Multi-select (Slack, Salesforce, etc.) | Product | Low |
| 6 | What measurable impact have users seen? | Metrics fields | Traction | High |
| 7 | How do customers discover and buy? | Text | Business Model | Medium |
| 8 | How does revenue grow per customer over time? | Text | Financials | Medium |

### 2. FinTech

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | Who is the primary buyer (consumer, SMB, enterprise, institution)? | Select | Market | Medium |
| 2 | What financial pain exists today (cost, risk, speed, access)? | Textarea | Problem | High |
| 3 | What category do you operate in? | Select (Payments, Lending, Compliance, Fraud, Wealth, Infrastructure) | Market | Medium |
| 4 | What regulations apply? | Text | Competition | High |
| 5 | Where does AI materially outperform rules or humans? | Textarea | Solution | High |
| 6 | What proprietary or improving data do you control? | Text | Competition | High |
| 7 | What measurable impact have users seen? | Metrics (fraud %, approvals, cost savings) | Traction | High |
| 8 | How do customers discover and trust you? | Text | Business Model | Medium |

### 3. Healthcare

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | Who is the end user (clinician, patient, administrator, payer)? | Select | Market | Medium |
| 2 | What clinical or operational problem do you solve? | Textarea | Problem | High |
| 3 | How does AI improve patient outcomes or reduce costs? | Textarea | Solution | High |
| 4 | What compliance requirements apply (HIPAA, FDA, CE)? | Multi-select | Competition | High |
| 5 | What clinical evidence or validation do you have? | Text | Traction | High |
| 6 | What data do you use and how is it protected? | Text | Competition | High |
| 7 | What is the reimbursement or payment model? | Select (SaaS, per-patient, insurance) | Business Model | Medium |
| 8 | What is your path through regulatory approval? | Text | Ask | Medium |

### 4. Retail & eCommerce

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | Who is your core customer (DTC, marketplace, SMB, enterprise)? | Select | Market | Medium |
| 2 | What breaks today for merchants? | Textarea | Problem | High |
| 3 | Where does AI directly increase revenue or margin? | Select (Pricing, Recs, Forecasting, Content) | Solution | High |
| 4 | Which platforms do you integrate with? | Multi-select (Shopify, WooCommerce, Amazon, Stripe) | Product | Low |
| 5 | Why is this better than existing commerce tools? | Textarea | Competition | High |
| 6 | What improved after adoption? | Metrics (conversion, AOV, inventory) | Traction | High |
| 7 | What improves as more stores use you? | Textarea | Competition | Medium |
| 8 | How do you grow account value over time? | Text | Financials | Medium |

### 5. Cybersecurity

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | What is the threat vector you address? | Select (Endpoint, Network, Cloud, Identity, Data) | Problem | High |
| 2 | What is the cost of a breach in your segment? | Metrics | Problem | High |
| 3 | How does AI improve detection vs traditional tools? | Textarea | Solution | High |
| 4 | What compliance frameworks do you support (SOC 2, ISO, NIST)? | Multi-select | Competition | High |
| 5 | What is your false positive rate vs industry average? | Metrics | Traction | High |
| 6 | What proprietary threat intelligence do you collect? | Text | Competition | High |
| 7 | What is the deployment model (agent, cloud, hybrid)? | Select | Product | Medium |
| 8 | How do you sell (direct, channel, MSP)? | Text | Business Model | Medium |

### 6. Logistics & Supply Chain

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | What part of the supply chain do you optimize? | Select (Warehouse, Last-mile, Planning, Procurement) | Market | Medium |
| 2 | What costs or delays exist today? | Textarea | Problem | High |
| 3 | How does AI reduce cost or improve speed? | Textarea | Solution | High |
| 4 | What systems do you integrate with (ERP, WMS, TMS)? | Multi-select | Product | Low |
| 5 | What measurable improvements have you delivered? | Metrics (delivery time, cost/shipment, accuracy) | Traction | High |
| 6 | What data gives you a compounding advantage? | Text | Competition | High |
| 7 | How do you charge (per shipment, per warehouse, SaaS)? | Select | Business Model | Medium |
| 8 | What happens as you add more customers/routes? | Text | Competition | Medium |

### 7. Education

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | Who is the user (student, teacher, administrator, parent)? | Select | Market | Medium |
| 2 | What learning or operational problem do you solve? | Textarea | Problem | High |
| 3 | How does AI personalize or improve outcomes? | Textarea | Solution | High |
| 4 | What compliance applies (FERPA, COPPA, accessibility)? | Multi-select | Competition | Medium |
| 5 | What engagement or outcome data do you have? | Metrics (engagement rate, learning outcomes) | Traction | High |
| 6 | What is the buying process (district, school, direct)? | Text | Business Model | Medium |
| 7 | How do you measure learning impact? | Text | Traction | High |
| 8 | What makes this hard to replicate? | Text | Competition | Medium |

### 8. Legal / Professional Services

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | What type of legal work do you automate? | Select (Contract, Discovery, Compliance, Research) | Market | Medium |
| 2 | How much time/cost does the current process waste? | Metrics (hours, cost) | Problem | High |
| 3 | How does AI match or exceed human accuracy? | Textarea | Solution | High |
| 4 | What confidentiality and security controls exist? | Text | Competition | High |
| 5 | What measurable time or cost savings have users seen? | Metrics | Traction | High |
| 6 | How do you sell (direct to firms, enterprise, platform)? | Text | Business Model | Medium |
| 7 | What proprietary legal data or models do you have? | Text | Competition | High |
| 8 | How does accuracy improve over time? | Text | Competition | Medium |

### 9. Financial Services

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | What financial service do you serve (banking, insurance, asset management)? | Select | Market | Medium |
| 2 | What risk, cost, or compliance problem exists? | Textarea | Problem | High |
| 3 | How does AI improve risk management or returns? | Textarea | Solution | High |
| 4 | What regulatory status do you have? | Text | Competition | High |
| 5 | What AUM, transactions, or risk reduction can you show? | Metrics | Traction | High |
| 6 | What proprietary models or data do you use? | Text | Competition | High |
| 7 | What is the revenue model (AUM %, per-transaction, SaaS)? | Select | Business Model | Medium |
| 8 | What institutional partnerships or approvals do you have? | Text | Traction | Medium |

### 10. Sales & Marketing AI

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | Who buys and who uses the product? | Text (buyer vs user) | Market | Medium |
| 2 | What revenue or growth problem exists today? | Textarea | Problem | High |
| 3 | Where does AI outperform existing marketing/sales tools? | Textarea | Solution | High |
| 4 | What actions does AI take automatically? | Bullet list | Product | High |
| 5 | Which platforms do you integrate with? | Multi-select (HubSpot, Salesforce, Meta, LinkedIn) | Product | Low |
| 6 | What improved after adoption? | Metrics (pipeline velocity, engagement, CAC) | Traction | High |
| 7 | What data or workflow lock-in exists? | Text | Competition | Medium |
| 8 | How does revenue grow per customer? | Text | Financials | Medium |

### 11. CRM & Social Media AI

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | What social/CRM channels do you cover? | Multi-select | Market | Medium |
| 2 | What engagement or response problem exists? | Textarea | Problem | High |
| 3 | How does AI improve engagement quality or speed? | Textarea | Solution | High |
| 4 | What automation runs without human input? | Bullet list | Product | High |
| 5 | What platforms do you connect to? | Multi-select (Instagram, TikTok, LinkedIn, Twitter) | Product | Low |
| 6 | What engagement or conversion improvements can you show? | Metrics | Traction | High |
| 7 | What content or behavioral data do you collect? | Text | Competition | Medium |
| 8 | How do you monetize (per seat, per channel, usage)? | Select | Business Model | Medium |

### 12. Events Management

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | What event types do you serve? | Select (Conference, Music, Corporate, Hybrid, Fashion) | Market | Medium |
| 2 | What is hardest today for organizers? | Textarea | Problem | High |
| 3 | Where does AI save time or increase outcomes? | Textarea | Solution | High |
| 4 | What manual workflows disappear? | Bullet list | Problem | High |
| 5 | What systems must connect? | Multi-select (Ticketing, CRM, Email, Social) | Product | Low |
| 6 | What measurable improvements exist? | Metrics (time saved, ticket uplift, engagement) | Traction | High |
| 7 | How do you charge? | Select (Per event, per seat, revenue share) | Business Model | Medium |
| 8 | Why is this hard to replicate? | Text | Competition | Medium |

### 13. eCommerce (Pure-Play)

| # | Question | Input | Slide | Weight |
|---|----------|-------|-------|--------|
| 1 | What GMV range do your merchants operate in? | Select (< $1M, $1-10M, $10-100M, $100M+) | Market | Medium |
| 2 | What is the biggest margin or conversion killer? | Textarea | Problem | High |
| 3 | How does AI improve unit economics? | Textarea | Solution | High |
| 4 | What platform integrations are required? | Multi-select | Product | Low |
| 5 | What is the measurable impact on AOV, conversion, or returns? | Metrics | Traction | High |
| 6 | What data flywheel exists as more orders flow through? | Text | Competition | High |
| 7 | What is the pricing model (% of GMV, flat, usage)? | Select | Business Model | Medium |
| 8 | What is the expansion motion (more SKUs, more channels)? | Text | Financials | Medium |

---

## 3. Industry Playbooks — Pitch Strategy Per Industry

Each playbook defines the **narrative arc**, **slide emphasis**, **investor psychology**, **red flags to avoid**, and **AI prompt context** specific to an industry. The playbook is injected into the Gemini generation prompt alongside question pack answers.

### Playbook Schema

```typescript
interface IndustryPlaybook {
  industry_id: string;
  narrative_arc: string;           // The story structure investors expect
  slide_emphasis: SlideEmphasis[]; // Which slides get extra depth
  investor_psychology: string;     // What drives investment decisions
  red_flags: string[];             // What kills the deal
  power_phrases: string[];         // Language that resonates
  weak_phrases: string[];          // Language to avoid
  benchmark_metrics: BenchmarkMetric[]; // Industry-standard KPIs
  prompt_context: string;          // Injected into AI generation prompt
  example_hooks: string[];         // Opening lines that work
  competitive_framing: string;     // How to position against incumbents
}

interface SlideEmphasis {
  slide_type: SlideType;
  weight: 'critical' | 'important' | 'standard' | 'optional';
  guidance: string;
}

interface BenchmarkMetric {
  name: string;
  good: string;
  great: string;
  source: string;
}
```

### 1. AI SaaS / B2B

**Narrative Arc:** Workflow broken → AI automates it → proven ROI → massive market → defensible moat

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Show the manual workflow with cost/time data |
| Solution | Critical | Demo the AI in action. Before/after comparison |
| Traction | Critical | MRR, growth rate, net retention. Graphs win |
| Competition | Important | 2x2 matrix. Position on automation level + vertical depth |
| Market | Standard | Bottom-up TAM from # of teams x ACV |
| Business Model | Standard | Per-seat or usage-based. Show expansion revenue |

**Investor Psychology:** Looking for workflow ownership + net revenue retention > 120%. Fear: "Is this a feature or a company?"

**Red Flags:** "We use AI" without explaining where/how | TAM from top-down only | No CAC/payback period | Claiming "no competitors"

**Power Phrases:** "Replaces X hours of manual work" | "Net retention above 130%" | "Data flywheel" | "Workflow lock-in" | "Land and expand"

**Weak Phrases:** "AI-powered platform" (generic) | "Disruptive" | "World-class team" | "Huge market"

**Benchmarks:** MRR Good: $10-50K, Great: $50K+ | MoM Growth Good: 15-20%, Great: 20%+ | Net Retention Good: 100-120%, Great: 120%+ | CAC Payback Good: <18mo, Great: <12mo

**Prompt Context:**
```
INDUSTRY CONTEXT: AI SaaS / B2B
- Lead with workflow automation ROI, not technology
- Show before/after with quantified time/cost savings
- Investors want: MRR trajectory, net retention, CAC payback
- Position on automation depth (not just "AI")
- If early: focus on design partners + usage data, not revenue
- Competitive slide: use 2x2 matrix (automation level vs vertical depth)
```

**Example Hooks:** "Support teams waste 60% of time on tickets AI can solve" | "Every sales rep loses 12 hours/week to manual CRM updates" | "CFOs spend 3 days closing books that should take 3 hours"

---

### 2. FinTech

**Narrative Arc:** Financial friction/risk → regulated AI solution → trust + compliance → massive addressable market

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Quantify the cost of the financial pain |
| Solution | Critical | Show how AI reduces risk or cost. Must address trust |
| Competition | Critical | Regulatory barriers ARE the moat |
| Traction | Important | Transaction volume, fraud reduction %, approval speed |
| Market | Important | TAM by segment. Bottom-up |
| Ask | Important | Use of funds must include compliance/licensing costs |

**Investor Psychology:** Regulatory moat + trust acquisition strategy. Fear: "Can they survive a regulatory change?"

**Red Flags:** No regulatory compliance mention | "We'll figure out licensing later" | Consumer FinTech without unit economics | No fraud/risk metrics

**Power Phrases:** "Regulatory-first approach" | "Licensed in X jurisdictions" | "Reduced fraud by X% while cutting false positives" | "Bank-grade security"

**Benchmarks:** Transaction Volume Good: $1M+/mo, Great: $10M+/mo | Fraud Reduction Good: 30-50%, Great: 50%+ | False Positive Rate Good: <5%, Great: <2%

**Prompt Context:**
```
INDUSTRY CONTEXT: FinTech
- Regulatory compliance is existential — address it directly
- Show cost/risk reduction with specific numbers
- Trust acquisition is the hardest part — explain GTM for trust
- If payments: show transaction volume trajectory
- If lending: show default rates vs industry
- If compliance: show time savings vs manual review
- Competitive positioning: regulated moat > feature comparison
```

**Example Hooks:** "Banks lose $4.7B annually to payment fraud that AI can prevent" | "Compliance reviews take 40 hours per case — ours take 4"

---

### 3. Healthcare

**Narrative Arc:** Patient/provider pain → clinically validated AI → regulatory pathway clear → enormous market with strong barriers

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Patient outcome or cost data. Cite published sources |
| Solution | Critical | Clinical validation matters more than features |
| Competition | Critical | Regulatory barriers ARE the moat. Show pathway |
| Traction | Important | Patient volume, clinical outcomes, pilot results |
| Team | Important | Clinical/scientific credibility is essential |
| Ask | Important | FDA/CE pathway costs must be in use of funds |

**Investor Psychology:** Clinical evidence + clear regulatory path. Fear: "Will this get FDA approval?"

**Red Flags:** No clinical evidence | "We don't need FDA approval" without explaining why | No HIPAA mention | Team without clinical expertise

**Power Phrases:** "Clinically validated" | "FDA 510(k) pathway" | "HIPAA-compliant by design" | "Reduced readmissions by X%"

**Prompt Context:**
```
INDUSTRY CONTEXT: Healthcare
- Clinical evidence is non-negotiable — show validation data
- Regulatory pathway must be addressed (FDA, CE, HIPAA)
- Team slide is critical — must show clinical expertise
- If pre-revenue: pilot data with patient outcomes
- Reimbursement model must be clear (who pays?)
- Privacy/security is assumed — explicitly confirm
```

---

### 4. Retail & eCommerce

**Narrative Arc:** Merchant pain (conversion/margin) → AI solves it measurably → integrates with existing stack → scales with GMV

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Revenue impact in dollars |
| Traction | Critical | Conversion lift, AOV increase — with before/after |
| Product | Important | Show platform integrations |
| Business Model | Important | Revenue tied to merchant success |
| Competition | Standard | Position vs Shopify apps, standalone tools |

**Investor Psychology:** Measurable revenue impact + platform ecosystem fit. Fear: "Will Shopify build this?"

**Prompt Context:**
```
INDUSTRY CONTEXT: Retail & eCommerce
- Lead with revenue impact in dollars (not percentages alone)
- Show before/after from real merchants
- Platform integrations are table stakes — name them
- Fear to address: "Will the platform build this?"
```

---

### 5. Cybersecurity

**Narrative Arc:** Evolving threat → AI detects what rules miss → compliance built-in → massive cost of inaction

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Breach cost data from published sources |
| Solution | Critical | Detection accuracy + speed vs traditional tools |
| Competition | Critical | Compliance frameworks = competitive moat |
| Traction | Important | Threats detected, false positive reduction |
| Team | Important | Security credentials matter |

**Prompt Context:**
```
INDUSTRY CONTEXT: Cybersecurity
- Lead with breach cost data (IBM reports, Ponemon Institute)
- Detection accuracy AND false positive rate together
- Compliance frameworks = competitive moat
- Threat vector must be specific (not "all security")
- Team credibility is critical
- Address: "Why can't CrowdStrike/Palo Alto add this?"
```

---

### 6. Logistics & Supply Chain

**Narrative Arc:** Supply chain inefficiency → AI optimizes specific link → proven ROI → scales across network

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Cost per shipment, delivery delays, waste data |
| Traction | Critical | Hard ROI: cost savings, time reduction |
| Solution | Important | Which part of chain you optimize |
| Product | Important | ERP/WMS/TMS integrations |

**Prompt Context:**
```
INDUSTRY CONTEXT: Logistics & Supply Chain
- Hard ROI data wins — cost savings in dollars per unit
- Integration with existing systems (ERP, WMS, TMS) is critical
- Specificity > breadth — own one link deeply
- Enterprise sales cycle: address procurement process
```

---

### 7. Education

**Narrative Arc:** Learning/admin pain → AI personalizes/automates → measurable outcome improvement → long procurement but sticky

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Student outcome data or admin time waste |
| Solution | Critical | How AI personalizes — concrete example |
| Traction | Critical | Engagement data, learning outcomes, district adoption |
| Business Model | Important | Procurement model |
| Team | Important | Education expertise matters |

**Prompt Context:**
```
INDUSTRY CONTEXT: Education
- Learning outcomes data is non-negotiable
- FERPA/COPPA compliance must be addressed (US market)
- Procurement cycle is long — show strategy to navigate it
- Team must show education expertise
```

---

### 8. Legal / Professional Services

**Narrative Arc:** Billable hour waste → AI matches human accuracy → dramatic time savings → confidentiality built-in

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Hours wasted + cost of current process |
| Traction | Critical | Time savings, accuracy metrics |
| Solution | Important | Accuracy vs human benchmark |
| Competition | Important | Confidentiality + security controls |

**Prompt Context:**
```
INDUSTRY CONTEXT: Legal / Professional Services
- Time/cost savings in billable hours is the key metric
- Accuracy must be quantified vs human baseline
- Confidentiality is existential — address security explicitly
- Trust matters — pilot with named firms if possible
```

---

### 9. Financial Services

**Narrative Arc:** Risk/compliance burden → AI-driven insight → regulatory approval → institutional trust

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Risk exposure or compliance cost data |
| Solution | Critical | How AI improves risk management or returns |
| Competition | Critical | Regulatory status IS the moat |
| Team | Important | Financial + regulatory credentials |

**Prompt Context:**
```
INDUSTRY CONTEXT: Financial Services
- Regulatory status/licensing is the #1 investor question
- Show risk-adjusted returns or cost reduction
- Institutional partnerships provide credibility
- Team must have financial services background
```

---

### 10. Sales & Marketing AI

**Narrative Arc:** Revenue leakage → AI finds/converts/retains → measurable pipeline impact → integrates with existing stack

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Pipeline velocity, lead decay, attribution gaps |
| Traction | Critical | Revenue impact: CAC reduction, conversion lift |
| Solution | Important | What AI does automatically |
| Product | Important | CRM/marketing platform integrations |

**Prompt Context:**
```
INDUSTRY CONTEXT: Sales & Marketing AI
- Revenue attribution is the killer metric — show pipeline impact
- "AI as operator" framing: what actions does it take automatically?
- Integration with CRM/marketing stack is table stakes
- Address: "Why can't Salesforce/HubSpot AI do this?"
```

---

### 11. CRM & Social Media AI

**Narrative Arc:** Engagement overload → AI automates quality responses → measurable engagement lift → data moat

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Response time, engagement quality |
| Solution | Critical | What automation runs without human input |
| Traction | Important | Engagement rate improvement |
| Product | Important | Platform coverage |

**Prompt Context:**
```
INDUSTRY CONTEXT: CRM & Social Media AI
- Show engagement quality improvement, not just volume
- Automation must be trustworthy — show approval/accuracy rate
- Data moat: behavioral data from interactions compounds over time
```

---

### 12. Events Management

**Narrative Arc:** Planning chaos → AI automates coordination → measurable event success → recurring lifecycle

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Time wasted, vendor coordination failures |
| Solution | Critical | Before/after workflow comparison |
| Traction | Important | Events managed, time saved |
| Business Model | Important | Per-event vs platform fee — show recurring |

**Prompt Context:**
```
INDUSTRY CONTEXT: Events Management
- Show before/after workflow — what disappears with AI
- Time savings for organizers is the key metric
- Revenue model must show recurring potential
- Address seasonality: how do you grow between events?
```

---

### 13. eCommerce (Pure-Play)

**Narrative Arc:** Unit economics pressure → AI improves per-order metrics → scales with GMV → data flywheel

| Slide | Weight | Guidance |
|-------|--------|----------|
| Problem | Critical | Margin/conversion pain in dollars per order |
| Traction | Critical | AOV, conversion, return rate improvements |
| Solution | Important | How AI improves unit economics |
| Competition | Important | Data flywheel as moat |

**Prompt Context:**
```
INDUSTRY CONTEXT: eCommerce (Pure-Play)
- Unit economics improvement in dollars per order
- Before/after from real merchants with A/B data
- Data flywheel: more orders → better AI → better results
- Platform integration is assumed — name the top 3
```

---

## 4. Cross-Industry Common Patterns

### Universal Slide Rules

| Rule | Detail |
|------|--------|
| **Problem slide must have numbers** | Cost, time, risk — never just a qualitative complaint |
| **Solution slide = before/after** | Show the transformation, not a feature list |
| **Traction slide = graph-ready data** | Numbers with timeframes, not isolated stats |
| **Competition slide = honest positioning** | Never "no competitors." Use 2x2 or feature matrix |
| **Team slide = achievements, not titles** | "Built X at Y" > "VP of Engineering" |
| **Ask slide = specific amount + use** | "$2M seed: 50% product, 30% GTM, 20% ops" |
| **Every slide = one idea** | If it needs explanation, split it |

### Stage-Specific Prompt Injection

```
IF stage === 'pre_seed':
  - Skip unit economics unless provided
  - Emphasize: vision, founder-market fit, problem clarity
  - Traction = design partners, waitlist, LOIs
  - "Ask" = smaller round, longer runway emphasis

IF stage === 'seed':
  - Balance story + early metrics
  - Traction = MRR, users, growth rate
  - Show path to product-market fit
  - Competition slide important — show awareness

IF stage === 'series_a':
  - Metrics-first throughout
  - Must include: CAC, LTV, payback period, cohort retention
  - Traction = revenue trajectory with cohort analysis
  - Competition = market position with data
  - Financial slide = detailed unit economics
```

---

## 5. AI Generation Prompt Template

```
You are a world-class pitch deck strategist generating a {template} pitch deck.

{INDUSTRY_PLAYBOOK.prompt_context}

COMPANY: {company_name} — {tagline}
STAGE: {stage} | INDUSTRY: {industry}

SMART INTERVIEW DATA:
{foreach answer in step3_smart_interview.answers}
- {answer.question}: {answer.response}
{/foreach}

RESEARCH CONTEXT:
{step3_smart_interview.research_context.industry_insights}
{step3_smart_interview.research_context.competitor_mentions}

LEAN CANVAS (if available):
{canvas_data}

STARTUP PROFILE:
{profile_data}

SLIDE EMPHASIS (from playbook):
{foreach emphasis in INDUSTRY_PLAYBOOK.slide_emphasis}
- {emphasis.slide_type}: {emphasis.weight} — {emphasis.guidance}
{/foreach}

AVOID: {INDUSTRY_PLAYBOOK.weak_phrases}
USE: {INDUSTRY_PLAYBOOK.power_phrases}

REQUIREMENTS:
- Generate exactly {slide_count} slides
- Follow {template} template structure
- Tone: {tone}
- Write for {stage} stage investors
- Be specific, use numbers, avoid generic language
- Each slide: title, type, content paragraph, 3-5 bullet points, speaker notes
```

---

## 6. Onboarding ↔ Pitch Deck Data Flow

```
┌──────────────────────────────────────────────────────┐
│                INDUSTRY QUESTION PACKS                │
│         (13 packs x 8 questions each)                │
│                                                      │
│  Each question tagged: contexts: ['onboarding',      │
│  'pitch_deck'] or both                               │
└──────────────┬───────────────────────┬───────────────┘
               │                       │
       ┌───────▼───────┐       ┌───────▼───────┐
       │  ONBOARDING   │       │  PITCH DECK   │
       │  WIZARD       │       │  SMART        │
       │               │       │  INTERVIEWER  │
       │ 4-5 questions │       │ 6-8 questions │
       │ No AI research│       │ + Gemini      │
       │ Basic hints   │       │   Search      │
       │               │       │ + URL Context │
       │ Output:       │       │ + AI suggest  │
       │ Profile fields│       │               │
       └───────┬───────┘       │ Output:       │
               │               │ Slide bullets │
               │               │ + research    │
               │               └───────┬───────┘
               │                       │
       ┌───────▼───────┐       ┌───────▼───────┐
       │  startups     │       │  pitch_decks  │
       │  table        │◄──────│  .metadata    │
       │  (profile)    │ reads │  .wizard_data │
       └───────────────┘       └───────┬───────┘
                                       │
                               ┌───────▼───────┐
                               │  DECK         │
                               │  GENERATION   │
                               │               │
                               │ Profile +     │
                               │ Canvas +      │
                               │ Interview +   │
                               │ Playbook +    │
                               │ Research      │
                               │  = Best Deck  │
                               └───────────────┘
```

### Data Reuse Rules

| Data | Source | Reused In | How |
|------|--------|-----------|-----|
| Company name, industry | Onboarding → `startups` | Pitch deck Step 1 pre-fill | Auto-loaded from profile |
| Problem statement | Onboarding question | Smart Interviewer context chip | Read from profile, skip if answered |
| Target customer | Onboarding question | Smart Interviewer context chip | Read from profile, skip if answered |
| Traction metrics | Onboarding question | Smart Interviewer pre-fill | If profile has metrics, show as editable |
| Lean canvas data | Canvas wizard → `documents` | Deck generation prompt | Merged into AI context |
| Interview answers | Smart Interviewer → `wizard_data` | Deck generation prompt | Highest-signal data source |
| Research context | Gemini Search/URL → `wizard_data` | Deck generation prompt | Industry insights + competitors |

### De-Duplication Logic

```typescript
function filterQuestions(
  pack: IndustryQuestionPack,
  profileData: Record<string, unknown>,
  step2Data: Record<string, unknown>,
): IndustryQuestion[] {
  return pack.questions.filter(q => {
    // Skip if already answered in profile or Step 2
    if (q.id.includes('target_customer') && profileData.target_market) return false;
    if (q.id.includes('problem') && step2Data.problem) return false;
    if (q.id.includes('solution') && step2Data.core_solution) return false;
    // Always show high-weight questions even if partially answered
    if (q.investor_weight === 'high') return true;
    return true;
  });
}
```

---

## Implementation Phases

### Phase 1 (MVP) — Core Industry Intelligence

| Task | What | Status |
|------|------|--------|
| Industry question pack data files | Create JSON/TS data for all 13 packs | Ready |
| Pack loading in Smart Interviewer | Filter by context + stage, render questions | Ready |
| Playbook prompt injection | Include playbook context in generation prompt | Ready |
| Industry selection in Step 1 | 13 industry tiles, store `selected_industry` | Ready |
| Stage-aware filtering | Filter questions by funding stage | Ready |

### Phase 2 (Advanced)

| Task | What | Status |
|------|------|--------|
| Onboarding pack integration | Use same packs for onboarding wizard | Pending |
| De-duplication logic | Skip already-answered questions | Pending |
| Conditional follow-ups | AI asks clarifying questions based on answer quality | Pending |
| Benchmark comparisons | Show how answers compare to industry benchmarks | Pending |

### Future Industries to Consider

| Industry | Why Add | Priority |
|----------|---------|----------|
| PropTech / Real Estate | Large market, unique data | P2 |
| AgTech / Climate | Growing investor interest, ESG | P2 |
| HRTech / Workforce | Large SaaS market, clear buyer | P2 |
| Gaming / Entertainment | Unique metrics (DAU, ARPU) | P3 |
| Biotech / Deep Tech | Very different deck structure | P3 |
| Developer Tools | PLG metrics, unique GTM | P2 |

---

**This document is the industry intelligence source of truth. Referenced by `100-pitch-deck-strategy.md` and all prompt files.**
