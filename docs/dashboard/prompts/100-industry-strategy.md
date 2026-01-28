# Industry Packs & Playbooks — Full System Implementation Plan

> **Version:** 3.0 | **Date:** January 28, 2026
> **Phase:** 1-2 (MVP + Advanced) | **Priority:** P0
> **Status:** Planning Complete — Ready for Implementation
> **Estimated Effort:** 15-20 development days

---

## Executive Summary

**Industry Packs & Playbooks** is the intelligence layer that transforms StartupAI from a generic tool into an **expert advisor** for each industry vertical. When a founder selects "FinTech + Payments" or "Healthcare + Diagnostics", every downstream system adapts to help them **plan, validate, build, and launch** their startup.

**Core Purpose:** Help founders think through the hard questions BEFORE they build, not just when they pitch.

**What This System Does:**
- **Smart Interviewer** asks industry-specific questions that force clarity on strategy
- **Lean Canvas** pre-fills with industry-relevant assumptions to validate
- **Pitch Deck Wizard** generates investor-ready slides from validated answers
- **AI Agents** respond as domain experts who've built companies in this space

**Core Innovation:**
User selects **Industry + Startup Type** (e.g., "SaaS + CRM") → AI becomes an expert co-founder who asks the right questions and challenges assumptions.

---

## Progress Tracker

### Implementation Status Dashboard

| Module | Status | Progress | Owner | ETA |
|--------|--------|----------|-------|-----|
| **Database Schema** | 🔴 Not Started | 0% | Backend | Day 1-2 |
| **Seed Data (13 Industries)** | 🔴 Not Started | 0% | Backend | Day 2-4 |
| **Industry Selection UI** | 🔴 Not Started | 0% | Frontend | Day 3-5 |
| **Smart Interviewer Integration** | 🔴 Not Started | 0% | Frontend | Day 5-7 |
| **Lean Canvas Integration** | 🔴 Not Started | 0% | Frontend | Day 7-8 |
| **Pitch Deck Integration** | 🔴 Not Started | 0% | Frontend | Day 8-10 |
| **Industry Expert Agent** | 🔴 Not Started | 0% | Backend | Day 6-8 |
| **Edge Function Updates** | 🔴 Not Started | 0% | Backend | Day 8-10 |
| **GTM Strategy Module** | 🔴 Not Started | 0% | Full Stack | Day 10-12 |
| **Testing & QA** | 🔴 Not Started | 0% | QA | Day 12-15 |

### Task Matrix

| # | Task | Type | Priority | Depends On | Status |
|---|------|------|----------|------------|--------|
| 1 | Create `industry_questions` table migration | Database | P0 | - | 🔴 |
| 2 | Create `industry_playbooks` table migration | Database | P0 | - | 🔴 |
| 3 | Update `industry_packs` with new fields | Database | P0 | - | 🔴 |
| 4 | Seed 13 industry packs with question data | Database | P0 | 1,2,3 | 🔴 |
| 5 | Create IndustrySelectionScreen component | Frontend | P0 | 4 | 🔴 |
| 6 | Create IndustryCard component | Frontend | P0 | - | 🔴 |
| 7 | Create StartupTypeSelector component | Frontend | P0 | 5 | 🔴 |
| 8 | Integrate industry selection in onboarding wizard | Frontend | P0 | 5,6,7 | 🔴 |
| 9 | Create useIndustryPacks hook | Frontend | P0 | 4 | 🔴 |
| 10 | Update Smart Interviewer with industry questions | Frontend | P0 | 8,9 | 🔴 |
| 11 | Create industry-expert-agent edge function | Backend | P0 | 4 | 🔴 |
| 12 | Update lean-canvas-agent with industry context | Backend | P1 | 11 | 🔴 |
| 13 | Update pitch-deck-agent with playbook injection | Backend | P0 | 11 | 🔴 |
| 14 | Update onboarding-agent with industry routing | Backend | P0 | 11 | 🔴 |
| 15 | Create GTM Strategy screen | Frontend | P1 | 8 | 🔴 |
| 16 | Create Competitive Analysis component | Frontend | P1 | 11 | 🔴 |
| 17 | Add industry benchmarks display | Frontend | P1 | 9 | 🔴 |
| 18 | Create admin UI for industry pack management | Frontend | P2 | 4 | 🔴 |
| 19 | Write unit tests for industry logic | Testing | P0 | 10 | 🔴 |
| 20 | Write E2E tests for industry flows | Testing | P0 | 15 | 🔴 |

### Feature Matrix

| Feature | Onboarding | Lean Canvas | Pitch Deck | CRM | Dashboard |
|---------|------------|-------------|------------|-----|-----------|
| Industry Selection | ✅ Primary | ✅ Context | ✅ Context | ✅ Context | ✅ Display |
| Question Packs | ✅ Full | ❌ N/A | ✅ Smart Interview | ❌ N/A | ❌ N/A |
| Playbooks | ❌ N/A | ✅ Prefill | ✅ Generation | ❌ N/A | ❌ N/A |
| Benchmarks | ✅ Display | ✅ Validation | ✅ Comparison | ✅ Metrics | ✅ Charts |
| Terminology | ✅ Hints | ✅ Labels | ✅ Slides | ✅ Fields | ✅ Labels |
| Competitive Intel | ❌ N/A | ✅ Suggest | ✅ Slide | ✅ Contacts | ✅ View |
| AI Expert Persona | ✅ Chat | ✅ Suggest | ✅ Generate | ✅ Enrich | ✅ Insights |

### Agent Matrix

| Agent | Industry-Aware | Uses Packs | Uses Playbooks | Uses Questions |
|-------|----------------|------------|----------------|----------------|
| industry-expert-agent | ✅ Core | ✅ | ✅ | ✅ |
| onboarding-agent | ✅ Enhanced | ✅ | ❌ | ✅ |
| lean-canvas-agent | ✅ Enhanced | ✅ | ✅ | ❌ |
| pitch-deck-agent | ✅ Enhanced | ✅ | ✅ | ✅ |
| crm-agent | ✅ Enhanced | ✅ | ❌ | ❌ |
| investor-agent | ✅ Enhanced | ✅ | ✅ | ❌ |
| chatbot-agent | ✅ Enhanced | ✅ | ❌ | ❌ |

---

## Question Framework — Building a Startup

### Question Categories (Universal)

Every industry pack includes questions in these **8 categories** that map to the startup building journey:

| # | Category | Purpose | When Asked | Output |
|---|----------|---------|------------|--------|
| 1 | **Problem Validation** | Confirm the problem is real, painful, and worth solving | Onboarding | Lean Canvas Problem |
| 2 | **Customer Discovery** | Define exactly who has this problem and how to reach them | Onboarding | ICP, Lean Canvas Segments |
| 3 | **Solution Design** | Define what you're building and why it's better | Onboarding + Pitch | Lean Canvas Solution, MVP Scope |
| 4 | **MVP Planning** | Identify the minimum viable product to test assumptions | Onboarding | Product Roadmap, Tasks |
| 5 | **Go-to-Market** | Plan how to acquire first customers | Pitch + Strategy | GTM Strategy, Channels |
| 6 | **Business Model** | Define how you'll make money | Pitch + Strategy | Pricing, Revenue Model |
| 7 | **Competitive Strategy** | Understand the landscape and how to win | Pitch | Competition Slide, Positioning |
| 8 | **Execution Planning** | Set concrete 90-day goals and identify risks | Strategy | Tasks, Milestones, Risk Register |

### Question Schema (Enhanced)

```typescript
interface IndustryQuestion {
  id: string;                    // e.g. 'fintech_problem_validation'
  category: QuestionCategory;    // One of the 8 categories above
  order: number;                 // Display order within category
  question: string;              // The question text
  why_this_matters: string;      // Why founders need to answer this
  thinking_prompt: string;       // Helps founder think through the answer
  input_type: InputType;
  options?: string[];            // For select/multi_select
  examples?: Example[];          // Industry-specific examples
  ai_coach_prompt: string;       // How AI should respond/challenge
  follow_ups?: ConditionalQuestion[]; // Dynamic follow-ups
  outputs_to: OutputTarget[];    // Where this answer is used
  stage_filter?: FundingStage[]; // When to show this question
  is_required: boolean;          // Must answer to proceed
  validation_rules?: ValidationRule[];
}

type QuestionCategory =
  | 'problem_validation'
  | 'customer_discovery'
  | 'solution_design'
  | 'mvp_planning'
  | 'go_to_market'
  | 'business_model'
  | 'competitive_strategy'
  | 'execution_planning';

type OutputTarget =
  | 'lean_canvas'
  | 'pitch_deck'
  | 'startup_profile'
  | 'task_list'
  | 'gtm_strategy'
  | 'risk_register';

interface Example {
  context: string;      // "For a B2B payments startup..."
  good_answer: string;  // Strong example
  weak_answer: string;  // Common mistake
  why: string;          // Explanation
}

interface ConditionalQuestion {
  condition: { field: string; operator: string; value?: unknown };
  question: string;
  why: string;
}
```

---

## Universal Question Pack (All Industries)

These questions apply to ALL startups. Industry packs ADD to or MODIFY these based on domain.

### Category 1: Problem Validation

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 1.1 | **What specific problem are you solving?** | Vague problems lead to vague solutions. Investors and customers need to feel the pain. | Describe a real scenario where someone experiences this problem. What happens? What do they lose (time, money, opportunity)? |
| 1.2 | **How do people solve this problem today?** | Understanding current solutions reveals the bar you need to clear. | List every workaround, tool, or manual process people use. What's frustrating about each? |
| 1.3 | **How did you discover this problem?** | First-hand experience or deep research signals founder-market fit. | Did you experience it yourself? Interview potential customers? See it in data? |
| 1.4 | **What evidence do you have that this problem is worth solving?** | Assumptions kill startups. Validation saves them. | Have you talked to potential customers? Do you have letters of intent, waitlist signups, or pilot commitments? |
| 1.5 | **How painful is this problem on a scale of 1-10?** | Vitamins vs. painkillers. Investors want painkillers. | Is this a "nice to solve" or a "must solve"? Would people pay to make it go away TODAY? |

### Category 2: Customer Discovery

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 2.1 | **Who exactly has this problem?** | "Everyone" is not a customer. Specificity enables focus. | Describe your ideal customer in detail: job title, company size, industry, daily frustrations. |
| 2.2 | **Who is the buyer vs. the user?** | In B2B, these are often different people with different needs. | Who writes the check? Who uses the product daily? What does each care about? |
| 2.3 | **How many potential customers exist?** | Market size determines how big this can get. | How many companies/people fit your ideal customer profile? What's your realistic serviceable market? |
| 2.4 | **Where do these customers hang out?** | This determines your go-to-market channels. | What communities, events, publications, or platforms do they use? How do they discover new tools? |
| 2.5 | **What would make them switch from their current solution?** | Switching costs are real. You need a compelling reason. | What trigger event makes someone look for a new solution? What would 10x better look like? |

### Category 3: Solution Design

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 3.1 | **What is your solution in one sentence?** | Clarity of thought leads to clarity of product. | Can you explain it to a stranger in 10 seconds and have them understand? |
| 3.2 | **Why is your approach better than existing solutions?** | "Better" isn't enough. You need a clear, defensible advantage. | Is it faster? Cheaper? More accurate? Easier to use? More integrated? Be specific. |
| 3.3 | **What's the core insight or innovation?** | Every successful startup has a non-obvious insight. | What do you believe that others don't? What have you figured out that competitors haven't? |
| 3.4 | **What does the user experience look like?** | Features don't matter. Outcomes do. | Walk through how a customer uses your product. What do they do? What happens? How do they feel? |
| 3.5 | **What technology or approach enables this?** | Understanding your technical foundation reveals defensibility and feasibility. | Is this AI/ML? Unique data? Novel algorithm? Integration play? Process innovation? |

### Category 4: MVP Planning

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 4.1 | **What is the smallest thing you can build to test your core assumption?** | Most startups over-build before validating. MVPs save time and money. | If you had to launch in 2 weeks, what would you cut? What's the ONE feature that proves value? |
| 4.2 | **What assumptions are you testing with your MVP?** | Every MVP should have a hypothesis to validate. | What question does your MVP answer? What result would prove you're right? Wrong? |
| 4.3 | **What does success look like for your MVP?** | Without clear metrics, you can't learn. | What specific numbers would validate your approach? Users? Engagement? Revenue? Retention? |
| 4.4 | **What will you explicitly NOT build in v1?** | Scope creep kills startups. Saying no is a superpower. | List features that seem important but aren't essential. Why can they wait? |
| 4.5 | **How long will it take to build your MVP?** | Time is your scarcest resource. Honest timelines matter. | Break it down: design, build, test, launch. What could you ship this month? |

### Category 5: Go-to-Market

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 5.1 | **How will you get your first 10 customers?** | The first 10 are the hardest and most important. They require different tactics than scale. | Who do you know personally? What communities can you access? What's your unfair advantage for early customers? |
| 5.2 | **What's your primary acquisition channel?** | Focus beats spray-and-pray. Master one channel before expanding. | Will you do outbound sales? Content marketing? Paid ads? Partnerships? Referrals? Product-led growth? |
| 5.3 | **What's your sales motion?** | Self-serve vs. sales-assisted vs. enterprise changes everything. | Will customers sign up and use it alone? Do they need a demo? A proof-of-concept? |
| 5.4 | **How will you retain and expand customers?** | Acquisition without retention is a leaky bucket. | What keeps customers coming back? How do you increase value over time? What triggers expansion? |
| 5.5 | **What partnerships could accelerate your growth?** | Partnerships can provide distribution, credibility, or capability. | Who has access to your customers? Who do your customers already trust? What integrations are table-stakes? |

### Category 6: Business Model

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 6.1 | **How will you charge for your product?** | Pricing is product strategy. It signals value and determines unit economics. | Subscription? Per-user? Usage-based? Transaction fee? One-time? Freemium? |
| 6.2 | **What will you charge?** | Price too low and you can't sustain. Too high and you can't sell. | What do customers pay for alternatives? What's the value you deliver in dollars? What price tests your assumptions? |
| 6.3 | **What are your unit economics (or target unit economics)?** | LTV > CAC is the fundamental equation of sustainable growth. | What does it cost to acquire a customer? How much do they pay over their lifetime? When do you break even? |
| 6.4 | **What's your path to $1M ARR?** | $1M ARR is the first real milestone. The path reveals your strategy. | How many customers at what price? What conversion rate and pipeline do you need? |
| 6.5 | **What are your biggest cost drivers?** | Understanding costs reveals where to optimize and what to watch. | Is it people? Infrastructure? Customer acquisition? Compliance? Support? |

### Category 7: Competitive Strategy

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 7.1 | **Who are your direct competitors?** | Knowing your competition helps you differentiate and anticipate moves. | Who else solves this problem? Who would customers consider instead of you? |
| 7.2 | **Who are your indirect competitors?** | Often the real competition is the status quo or a different approach. | What do customers do if they don't buy your solution? Spreadsheets? Agencies? Manual processes? |
| 7.3 | **What's your unfair advantage?** | Sustainable competitive advantage comes from something hard to replicate. | Is it proprietary data? Network effects? Regulatory moat? Team expertise? Unique technology? Distribution? |
| 7.4 | **Why will you win?** | Optimism isn't a strategy. You need a clear theory of victory. | What would have to be true for you to dominate this market? What are you betting on? |
| 7.5 | **What would a well-funded competitor do to beat you?** | Thinking like your enemy reveals vulnerabilities. | If Google/Microsoft/a big player entered, what would they do? How would you respond? |

### Category 8: Execution Planning

| # | Question | Why This Matters | Thinking Prompt |
|---|----------|------------------|-----------------|
| 8.1 | **What are your goals for the next 90 days?** | Long-term vision is great. Short-term execution is everything. | What 3-5 things must happen in the next quarter? What would make this quarter a success? |
| 8.2 | **What milestones will trigger your next funding round?** | Investors fund progress. Know what "fundable progress" looks like. | What metrics or achievements would make investors excited? Revenue? Users? Product milestones? |
| 8.3 | **What are the biggest risks to your startup?** | Founders who know their risks can mitigate them. Blind spots kill. | What could kill this company? Technology risk? Market risk? Team risk? Regulatory risk? Funding risk? |
| 8.4 | **What resources do you need to execute?** | Knowing your needs enables planning and prioritization. | What team do you need? What tools? What budget? What partnerships? |
| 8.5 | **What will you do if your initial approach doesn't work?** | Pivots are normal. Having a Plan B shows maturity. | What signals would tell you to pivot? What adjacent opportunities exist? What have you learned that's transferable? |

---

## Industry-Specific Question Modifications

Each industry pack MODIFIES the universal questions with industry-specific context, examples, and additional questions.

### 1. AI SaaS / B2B

**Industry Context:**
- Buyers: VP/Director level, often separate from end users
- Sales cycle: 2-6 months for enterprise, days for SMB
- Key metrics: MRR, NRR, CAC payback, logo retention
- Critical factors: Integration ecosystem, AI accuracy, ROI demonstration

**Modified/Additional Questions:**

| Category | Question | Why Industry-Specific |
|----------|----------|----------------------|
| Problem | **What workflow or task does your AI automate?** | AI SaaS must replace a specific, repetitive workflow to show clear ROI |
| Problem | **How much time/money does this workflow cost today?** | Quantifying the pain in dollars justifies the sale |
| Solution | **Where does AI materially outperform the current approach?** | "AI-powered" isn't enough. Must show 10x better on something |
| Solution | **What data do you need to train/improve your AI?** | Data moats are key to AI defensibility |
| MVP | **What's your human-in-the-loop strategy for v1?** | Most AI MVPs need human fallback to handle edge cases |
| GTM | **What integrations are table-stakes for your buyer?** | Slack, Salesforce, HubSpot integration often required |
| Business Model | **Are you charging per seat, per usage, or per outcome?** | AI enables new pricing models (per-outcome often works best) |
| Competitive | **What happens when the platform you integrate with builds this feature?** | Platform risk is real for AI SaaS |

**Industry Benchmarks:**
- Good NRR: 100-120%, Great: 120%+
- Good CAC Payback: <18 months, Great: <12 months
- Good MoM growth: 15-20%, Great: 20%+

---

### 2. FinTech

**Industry Context:**
- Buyers: CFO, Head of Operations, or direct consumers
- Critical factor: Trust, compliance, security
- Regulatory: Heavy (varies by product: payments, lending, insurance, etc.)
- Key metrics: TPV, default rate, fraud rate, unit economics

**Modified/Additional Questions:**

| Category | Question | Why Industry-Specific |
|----------|----------|----------------------|
| Problem | **What's the financial cost of this problem to your customer?** | FinTech value prop must be quantified in dollars |
| Problem | **Is this a trust problem, cost problem, speed problem, or access problem?** | FinTech problems cluster into these four buckets |
| Solution | **What regulatory/compliance requirements apply?** | Can't build FinTech without knowing regulatory landscape |
| Solution | **How do you handle security and data protection?** | FinTech customers won't use products they don't trust |
| MVP | **What licenses or registrations do you need to launch?** | Compliance can take months. Plan accordingly |
| MVP | **How will you handle fraud and chargebacks in v1?** | Fraud risk is existential in FinTech |
| GTM | **How do you build trust with skeptical customers?** | FinTech requires trust before trial |
| GTM | **What partnerships (banks, processors) do you need?** | Most FinTech requires infrastructure partners |
| Business Model | **What's your revenue model: transaction fees, subscription, or spread?** | FinTech has unique monetization options |
| Competitive | **What regulatory moats can you build?** | Compliance can be a competitive advantage |
| Execution | **What's your compliance roadmap?** | Regulations change. Plan for ongoing compliance |

**Industry Benchmarks:**
- Good fraud rate: <1%, Great: <0.5%
- Good approval rate: >80%, Great: >90%
- Good unit economics: positive by transaction 3

---

### 3. Healthcare / HealthTech

**Industry Context:**
- Buyers: Clinicians, administrators, payers, or patients
- Critical factors: Clinical evidence, regulatory approval, patient safety
- Regulatory: FDA, HIPAA, CE marking (heavy)
- Sales cycle: Very long for clinical products

**Modified/Additional Questions:**

| Category | Question | Why Industry-Specific |
|----------|----------|----------------------|
| Problem | **What clinical or operational problem do you solve?** | Healthcare problems must map to outcomes or costs |
| Problem | **What's the patient impact if this problem isn't solved?** | Patient outcomes are the ultimate metric |
| Customer | **Who is the end user: clinician, patient, administrator, or payer?** | Healthcare has multiple stakeholders with different needs |
| Customer | **Who pays: the patient, hospital, insurer, or employer?** | Healthcare payment is complex |
| Solution | **What clinical evidence supports your approach?** | Healthcare requires proof, not just product |
| Solution | **What's your regulatory pathway (FDA, HIPAA, CE)?** | Regulatory is make-or-break in healthcare |
| MVP | **How will you run pilots with healthcare organizations?** | Healthcare customers require extensive pilots |
| MVP | **What patient data do you need and how will you protect it?** | HIPAA compliance is non-negotiable |
| GTM | **How do you navigate hospital procurement?** | Healthcare sales cycles are 12-24+ months |
| GTM | **What clinical champions will advocate for you?** | Clinician buy-in is critical for adoption |
| Business Model | **What's the reimbursement model?** | Getting paid by insurers requires specific codes and approvals |
| Competitive | **What clinical studies do competitors have?** | Clinical evidence is a key differentiator |
| Execution | **What's your FDA/regulatory timeline?** | Regulatory approval can take years |

**Industry Benchmarks:**
- Pilot to contract conversion: Good 30%, Great 50%+
- Clinical outcome improvement: Must be statistically significant
- Time to regulatory approval: 510(k) 6-12 months, PMA 2-5 years

---

### 4. Cybersecurity

**Industry Context:**
- Buyers: CISO, IT Director, Security Team
- Critical factors: Detection accuracy, false positive rate, integration with existing stack
- Compliance: SOC 2, ISO 27001, NIST, GDPR
- Key metrics: Threats detected, MTTD, MTTR, false positive rate

**Modified/Additional Questions:**

| Category | Question | Why Industry-Specific |
|----------|----------|----------------------|
| Problem | **What threat vector do you address?** | Cybersecurity must focus on specific attack types |
| Problem | **What's the cost of a breach in your segment?** | Quantify the risk to justify the spend |
| Customer | **What's your customer's security maturity level?** | SMB vs. enterprise have very different needs |
| Solution | **How does your detection compare to existing tools?** | Better accuracy + fewer false positives wins |
| Solution | **What compliance frameworks do you support?** | Compliance is often the forcing function for purchase |
| MVP | **How will you prove detection accuracy without real attacks?** | Testing security products is challenging |
| MVP | **What's your deployment model: agent, cloud, hybrid?** | Deployment complexity affects adoption |
| GTM | **How do you sell without creating FUD?** | Security buyers are skeptical of fear-based marketing |
| GTM | **What certifications/audits do you need to sell to enterprise?** | SOC 2 often required |
| Business Model | **Are you replacing a tool or adding to the stack?** | Consolidation vs. point solution affects positioning |
| Competitive | **How do you position against CrowdStrike, Palo Alto, etc.?** | Must have clear differentiation from giants |
| Execution | **How do you keep up with evolving threats?** | Threat research is ongoing work |

**Industry Benchmarks:**
- False positive rate: Good <5%, Great <1%
- Detection rate: Good >90%, Great >99%
- Time to value: Good <30 days, Great <7 days

---

### 5. eCommerce / Retail Tech

**Industry Context:**
- Buyers: Head of eCommerce, COO, Founders (DTC)
- Critical factors: Revenue impact, integration with Shopify/BigCommerce/etc.
- Key metrics: Conversion rate, AOV, LTV, return rate
- Sales cycle: Fast for SMB, longer for enterprise

**Modified/Additional Questions:**

| Category | Question | Why Industry-Specific |
|----------|----------|----------------------|
| Problem | **What's the revenue impact of this problem?** | eCommerce buyers care about top-line growth |
| Problem | **Where in the funnel does this problem occur?** | Awareness, consideration, conversion, retention, advocacy |
| Customer | **What's your target merchant GMV range?** | SMB (<$1M) vs. mid-market ($1-100M) vs. enterprise ($100M+) |
| Solution | **What platforms do you integrate with?** | Shopify, WooCommerce, BigCommerce, Magento integrations often required |
| Solution | **What measurable impact do you deliver?** | Must show conversion lift, AOV increase, or cost reduction |
| MVP | **How will you prove ROI to skeptical merchants?** | A/B testing and clear metrics are essential |
| GTM | **How will you get discovered in crowded app stores?** | Shopify App Store, etc. are key distribution channels |
| GTM | **What agency partnerships could drive adoption?** | eCommerce agencies influence merchant tool choices |
| Business Model | **How do you align pricing with merchant success?** | Revenue share, % of GMV, or flat fee? |
| Competitive | **What happens when Shopify builds this feature?** | Platform risk is real |
| Execution | **How do you handle peak season (BFCM)?** | Must be reliable during highest-traffic periods |

**Industry Benchmarks:**
- Conversion rate improvement: Good 5-10%, Great 10%+
- Time to value: Good <7 days, Great <1 day
- Merchant retention: Good 80%+, Great 90%+

---

### 6. Education / EdTech

**Industry Context:**
- Buyers: School administrators, L&D leaders, parents, or students directly
- Critical factors: Learning outcomes, engagement, compliance (FERPA, COPPA)
- Sales cycle: Very long for K-12/Higher Ed (budget cycles), faster for corporate/consumer
- Key metrics: Engagement, completion rates, learning outcomes, NPS

**Modified/Additional Questions:**

| Category | Question | Why Industry-Specific |
|----------|----------|----------------------|
| Problem | **What learning or administrative problem do you solve?** | Education problems are either learning effectiveness or operational efficiency |
| Problem | **Who is frustrated: students, teachers, parents, or administrators?** | Different stakeholders have different pains |
| Customer | **What's your segment: K-12, Higher Ed, Corporate L&D, or Consumer?** | Each has completely different GTM |
| Customer | **Who makes the buying decision?** | Teachers rarely have budget authority |
| Solution | **How do you measure learning outcomes?** | Engagement isn't enough. Must show learning |
| Solution | **What compliance requirements apply (FERPA, COPPA)?** | Student data protection is legally mandated |
| MVP | **How will you pilot in educational institutions?** | Schools need extensive pilots before adoption |
| MVP | **How do you work within existing LMS/SIS systems?** | Integration with Canvas, Google Classroom, etc. |
| GTM | **How do you navigate school district procurement?** | K-12 procurement is complex and slow |
| GTM | **What teacher/professor champions will advocate for you?** | Bottom-up adoption can drive top-down sales |
| Business Model | **How do you price for education budgets?** | Education has limited budgets. Pricing must reflect this |
| Competitive | **What free alternatives exist?** | Education has many free resources. Why pay? |
| Execution | **How do you handle academic year cycles?** | Education is highly seasonal |

**Industry Benchmarks:**
- Student engagement: Good 60%+, Great 80%+
- Course completion: Good 70%+, Great 85%+
- Teacher NPS: Good 40+, Great 60+

---

### 7-13: Additional Industries

**The following industries follow the same pattern:**

| Industry | Key Buyer | Critical Factor | Unique Questions |
|----------|-----------|-----------------|------------------|
| **Logistics/Supply Chain** | VP Operations | ROI per shipment, integration with WMS/TMS | Deployment complexity, handling volume spikes |
| **Legal/Professional Services** | Managing Partner | Time savings, accuracy, confidentiality | Billable hour impact, malpractice risk |
| **Financial Services** | CRO, CTO | Regulatory status, risk management | AUM impact, institutional trust, compliance |
| **Sales & Marketing AI** | CMO, VP Sales | Pipeline impact, attribution | Integration with CRM, cannibalization risk |
| **CRM & Social Media AI** | Social Manager | Engagement quality, brand safety | Platform API dependencies, content approval |
| **Events Management** | Event Director | Time savings, attendee experience | Seasonality, vendor coordination |
| **Developer Tools** | Engineering Lead | Developer experience, time savings | Self-serve adoption, open source competition |

---

## Question Flow by Stage

### Pre-Seed (Idea Stage)

Focus: **Problem validation and customer discovery**

| Priority | Questions |
|----------|-----------|
| Must Answer | 1.1-1.5 (Problem Validation), 2.1-2.3 (Customer Discovery) |
| Should Answer | 3.1-3.3 (Solution Design), 4.1-4.2 (MVP Planning) |
| Skip | Unit economics, detailed competitive analysis |

### Seed (Building Stage)

Focus: **MVP execution and early traction**

| Priority | Questions |
|----------|-----------|
| Must Answer | All Category 1-4, 5.1-5.3 (GTM basics) |
| Should Answer | 6.1-6.2 (Pricing), 7.1-7.3 (Competition) |
| Add | Traction questions: "What early results do you have?" |

### Series A (Scaling Stage)

Focus: **Unit economics and scalable GTM**

| Priority | Questions |
|----------|-----------|
| Must Answer | All categories, with depth |
| Add | "What are your cohort retention curves?", "What's your CAC by channel?", "What's your expansion revenue?" |
| Emphasis | Metrics, metrics, metrics |

---

## AI Coach Behavior

The AI should act as an **experienced co-founder/advisor**, not a form-filler.

### Coaching Principles

1. **Challenge vague answers** — "Everyone" is not a customer. Push for specificity.
2. **Ask follow-ups** — If something doesn't make sense, probe deeper.
3. **Share relevant examples** — "Here's how [similar company] approached this..."
4. **Flag red flags** — Point out assumptions that seem risky.
5. **Celebrate clarity** — Acknowledge when founders have strong answers.

### Example AI Responses

**Weak answer detected:**
> User: "Our target customer is small businesses."
>
> AI: "That's a start, but 'small businesses' is a huge category. Let me help you narrow down:
> - What industry? (e.g., restaurants, retail, professional services)
> - What size? (1-10 employees? 10-50? 50-200?)
> - What role? (Owner? Office manager? Accountant?)
> - What specific pain do they have that your product solves?
>
> For example, 'Independent restaurant owners with 2-10 employees who struggle with inventory management' is much more actionable."

**Strong answer detected:**
> User: "Our target customer is Series A-C SaaS companies with 50-200 employees who have an SDR team of 5+ reps. The buyer is the VP of Sales who's frustrated with low email response rates."
>
> AI: "That's a well-defined ICP. A few follow-up questions:
> 1. How many companies fit this profile? (Rough estimate)
> 2. Where do these VP Sales hang out? (Communities, events, publications)
> 3. What's their current solution for improving response rates?"

---

## Output Mapping

### How Answers Flow to Products

| Question Category | Lean Canvas | Pitch Deck | Tasks | GTM Strategy |
|-------------------|-------------|------------|-------|--------------|
| Problem Validation | Problem box | Problem slide | Validation tasks | - |
| Customer Discovery | Segments box | Market slide | Customer interview tasks | ICP definition |
| Solution Design | Solution box, UVP box | Solution slide | Feature specs | - |
| MVP Planning | - | Product slide | Sprint backlog | - |
| Go-to-Market | Channels box | Traction slide | GTM tasks | Full GTM plan |
| Business Model | Revenue box, Cost box | Business Model slide | Pricing tasks | Revenue model |
| Competitive Strategy | Advantage box | Competition slide | Competitive research | Positioning |
| Execution Planning | - | Ask slide, Team slide | All tasks | Milestone plan |

---

## Success Criteria

### For Founders

| Criteria | Metric | Target |
|----------|--------|--------|
| Clarity | Founders report clearer thinking after questions | >80% |
| Actionability | Questions lead to specific next steps | >90% |
| Time saved | Reduces planning time vs. doing alone | >50% |
| Investor readiness | Founders feel more prepared for investor conversations | >85% |

### For the Product

| Criteria | Metric | Target |
|----------|--------|--------|
| Completion rate | % of founders who complete all questions | >70% |
| Answer quality | AI rates answers as "good" or "detailed" | >60% |
| Re-engagement | Founders return to update answers | >40% |
| NPS | "Would you recommend this to another founder?" | >50 |

---

## Production Readiness Checklist

### Database
- [ ] Migration created and tested locally
- [ ] Migration applied to staging
- [ ] Seed data loaded for all 13 industries
- [ ] RLS policies verified
- [ ] Indexes created and performing

### Edge Functions
- [ ] industry-expert-agent deployed with coaching behavior
- [ ] onboarding-agent updated with new questions
- [ ] pitch-deck-agent updated with answer-to-slide mapping
- [ ] lean-canvas-agent updated with answer-to-box mapping

### Frontend
- [ ] Industry selection screen responsive
- [ ] Question flow with categories and progress
- [ ] AI coaching responses displayed
- [ ] Follow-up questions work dynamically
- [ ] Output mapping visible (where answers go)

### Testing
- [ ] All 13 industry packs tested
- [ ] AI coaching quality reviewed
- [ ] Output mapping verified
- [ ] Edge cases handled (skipped questions, etc.)

---

## Implementation Prompts

### Prompt 1: Database Migration (Updated)

```
Create a Supabase migration for the enhanced Industry Packs system.

Requirements:
1. Create industry_questions table with enhanced schema:
   - id, pack_id, category (enum), order
   - question, why_this_matters, thinking_prompt
   - input_type, options, examples (JSONB with good_answer, weak_answer)
   - ai_coach_prompt, follow_ups (JSONB)
   - outputs_to (array), stage_filter (array)
   - is_required, validation_rules (JSONB)

2. Create industry_playbooks table (same as before)

3. Add question_categories enum:
   problem_validation, customer_discovery, solution_design, mvp_planning,
   go_to_market, business_model, competitive_strategy, execution_planning

Reference: tasks/industry/100-industry-strategy.md (this document)
```

### Prompt 2: Seed Universal Questions

```
Create seed data for the universal question pack (applies to all industries).

Seed 40 questions (5 per category x 8 categories) with:
- Full question text, why_this_matters, thinking_prompt
- Input types appropriate for each question
- AI coach prompts that challenge weak answers
- Example good and weak answers
- Output mappings (lean_canvas, pitch_deck, task_list, etc.)

Reference: tasks/industry/100-industry-strategy.md "Universal Question Pack" section
```

### Prompt 3: Seed Industry-Specific Questions

```
Create seed data for industry-specific question modifications for all 13 industries.

For each industry:
1. Modify 5-8 universal questions with industry context
2. Add 3-5 industry-specific questions
3. Include industry-specific examples
4. Add industry benchmarks

Industries: AI SaaS, FinTech, Healthcare, Cybersecurity, eCommerce, Education,
Logistics, Legal, Financial Services, Sales & Marketing AI, CRM & Social Media AI,
Events Management, Developer Tools

Reference: tasks/industry/100-industry-strategy.md industry sections
```

### Prompt 4: AI Coaching Behavior

```
Update the industry-expert-agent to implement AI coaching behavior.

Requirements:
1. Analyze answer quality (vague, good, detailed)
2. Generate follow-up questions for vague answers
3. Provide industry-specific examples and benchmarks
4. Challenge assumptions politely
5. Celebrate strong answers

Use the ai_coach_prompt field from industry_questions to guide responses.

Coaching principles:
- Be a helpful co-founder, not a form validator
- Push for specificity without being annoying
- Share relevant examples from similar companies
- Flag risks and red flags

Reference: tasks/industry/100-industry-strategy.md "AI Coach Behavior" section
```

### Prompt 5: Question Flow UI

```
Create a multi-step question flow component for the Smart Interviewer.

Features:
1. Show questions grouped by category (8 categories)
2. Progress indicator showing completion by category
3. Display "Why This Matters" and "Thinking Prompt" for each question
4. Show AI coaching responses inline
5. Handle follow-up questions dynamically
6. Show where answers will be used (output mapping badges)

Components:
- QuestionFlow - Main container with category tabs/stepper
- QuestionCard - Individual question with all metadata
- AICoachResponse - Inline coaching feedback
- OutputBadges - Shows "→ Lean Canvas", "→ Pitch Deck", etc.

Reference: tasks/industry/100-industry-strategy.md "Question Flow by Stage" section
```

---

## Appendix: All 8 Question Categories

| Category | Questions | Primary Output |
|----------|-----------|----------------|
| Problem Validation | 5 | Lean Canvas Problem, Pitch Deck Problem Slide |
| Customer Discovery | 5 | ICP Profile, Lean Canvas Segments |
| Solution Design | 5 | Lean Canvas Solution/UVP, Pitch Deck Solution Slide |
| MVP Planning | 5 | Task List, Product Roadmap |
| Go-to-Market | 5 | GTM Strategy, Channels, Pitch Deck Traction |
| Business Model | 5 | Pricing, Revenue Model, Pitch Deck Business Model |
| Competitive Strategy | 5 | Positioning, Pitch Deck Competition Slide |
| Execution Planning | 5 | 90-Day Plan, Risk Register, Pitch Deck Ask |

**Total: 40 universal questions + 3-5 industry-specific per pack = 40-53 questions per industry**

---

**Document Status:** Complete — Version 3.0 with startup-building focused questions
**Next Action:** Execute Prompt 1 (Database Migration)
**Review Date:** January 28, 2026
