# Go-To-Market

> **Pipeline stage:** Composer Group C | **Merged from:** marketing-strategy-pmm (S4-6), startup-go-to-market, product-strategist

Systematic workflow for designing and executing market entry, product launches, sales enablement, and growth.

**Modern Best Practices (Jan 2026)**: Start from ICP + positioning, pick 1-2 channels to sequence, instrument the funnel end-to-end, use AI for execution (not strategy), align RevOps across sales/marketing/CS.

## Quick Start (Inputs)

Ask for the smallest set of inputs that makes decisions meaningful:

- **Stage**: pre-PMF, early PMF, growth, scale
- **Product and category**: what it is, who uses it, and what "first value" looks like
- **ICP and buyer**: firmographics, pains, procurement constraints, economic buyer vs champion
- **Pricing and economics**: current/target ACV/ARPA, COGS drivers (include variable compute), payback constraints
- **Motion constraints**: self-serve possible, sales cycle expectations, implementation/onboarding complexity
- **Channel constraints**: budget, time, audience access (communities, lists, partnerships), geo, compliance limits
- **Baseline metrics**: traffic, signup/demo rate, activation, retention, win rate, sales cycle length, pipeline
- **Team and tooling**: who executes (founder/marketing/sales/CS), CRM + analytics stack

If numbers are missing, proceed with ranges + explicit assumptions and list what to measure next.

## Workflow

1) **Define ICP and the buying path**
   - Primary/secondary ICP, anti-ICP, trigger events, and an "activation" definition.
   - Use `assets/icp-definition.md` to draft.

2) **Align on positioning and proof**
   - If positioning is unclear, use startup-competitive-analysis to map alternatives + differentiation, then marketing-content-strategy to express it as messaging.

3) **Choose the motion** (PLG / sales-led / hybrid)
   - Use the Decision Tree below for a fast cut.
   - For details: `references/plg-implementation.md` and `references/sales-motion-design.md`.

4) **Pick 1-2 channels to sequence** (not parallelize)
   - Use a bullseye-style test plan: quick tests, measure, double down.
   - For execution details: `references/channel-playbooks.md`.

5) **Define measurement and RevOps alignment**
   - Define shared lifecycle stages and the "one source of truth" for metrics (product + CRM).
   - Ensure handoffs are measurable (e.g., PQL -> SQL routing rules and SLAs for hybrid).

6) **Produce deliverables + operating cadence**
   - Draft GTM plan (`assets/gtm-strategy.md`) and launch plan (`assets/launch-playbook.md`).
   - Run a weekly GTM review: 30 min pipeline + funnel, 30 min experiments, 30 min decisions.

## Decision Tree

```
GTM QUESTION
  |-- "How do I reach customers?" -> Channel Strategy (Section 3)
  |-- "PLG or Sales-led?" -> Motion Selection (Section 1)
  |-- "How do I launch?" -> Launch Planning (Section 6)
  |-- "Who is my ICP?" -> ICP Definition (Section 2)
  `-- "How do I scale?" -> Growth Loops (Section 7)
```

---

## When to Use

- Designing go-to-market strategy for new product or feature
- Choosing between PLG, sales-led, hybrid, community-led, or partner-led motion
- Planning product launches (soft, beta, ProductHunt, full)
- Defining ICP, channel strategy, and PQL scoring
- Building sales enablement assets and training programs
- Planning international market entry
- Designing growth loops and PLG flywheels

## When NOT to Use

- Positioning / messaging deep dive -> marketing-content-strategy / startup-competitive-analysis
- Competitive intelligence / battlecards -> startup-competitive-analysis
- Fundraising strategy -> startup-fundraising
- Pricing / revenue models -> startup-business-models

---

## 1. GTM Motion Selection

| Motion | Best For | ACV | Examples |
|--------|----------|-----|----------|
| **PLG** | SMB, developers, self-serve | <$10K | Slack, Figma, Notion |
| **Hybrid (PLG + Sales-Assist)** | Mid-market, higher ACV PLG | $5K-$100K | HubSpot, Atlassian, Zoom |
| **Sales-Led** | Enterprise, complex sales | $25K+ | Salesforce, Workday |
| **Community-Led** | Developer tools, OSS | Varies | MongoDB, HashiCorp |
| **Partner-Led** | Enterprise, geographic expansion | Varies | Microsoft, Snowflake |

### Decision Tree

```
ACV < $5K and self-serve possible?
  YES -> PLG (add sales-assist for expansion at $2K+ ACV)
  NO  -> Is buyer technical?
           YES -> Developer/community-led (bottom-up)
           NO  -> Sales-led (outbound + inbound)

Hybrid (Series A default):
  Bottom-up: Free trial -> Paid team plan -> Enterprise upgrade
  Top-down:  Outbound -> Demo -> POC -> Close
```

### Segment Mapping

| Segment | Employees | Touch Model | ACV |
|---------|-----------|-------------|-----|
| SMB | 10-200 | Self-serve PLG | $100-$2K |
| Mid-Market | 200-2,000 | Hybrid, inside sales | $2K-$50K |
| Enterprise | 2,000+ | Sales-led, field sales | $50K+ |

---

## 2. ICP Definition

### ICP Components

| Component | Example |
|-----------|---------|
| **Firmographics** | 50-500 employees, B2B SaaS, US, $5M-$500M rev |
| **Technographics** | Cloud-first, API-driven, uses Salesforce |
| **Pain indicators** | Growing support tickets, manual processes |
| **Success indicators** | Strong product engagement, fast sales cycle |

### ICP Scoring (6 Factors)

| Factor | Weight |
|--------|--------|
| Problem severity | 25% |
| Budget available | 20% |
| Technical fit | 15% |
| Decision timeline | 15% |
| Champion identified | 15% |
| Expansion potential | 10% |

### ICP Fit Tiers

- **A**: All 6 factors, fastest cycles, highest LTV, <5% churn
- **B**: 4-5 factors, above-median deal size
- **C**: 3 factors, nurture until ready
- **D**: <3 factors, disqualify early

### Buyer Personas

**Economic Buyer** (VP/Director) -- signs contract
- Messaging: ROI calculator, case studies with $ impact, business outcomes

**Technical Buyer** (Sr Eng/Architect) -- evaluates product
- Messaging: Architecture docs, security whitepaper, API quality

**Champion** (Manager/Team Lead) -- advocates internally
- Messaging: UX demos, quick wins, free trial

---

## 3. Channel Strategy

| Category | Channels | Best For |
|----------|----------|----------|
| **Organic** | SEO, content, social, community | Long-term compounding |
| **Paid** | SEM, paid social, display | Fast, scalable |
| **Outbound** | Email, cold calls, LinkedIn | Enterprise, high ACV |
| **Product** | Viral, freemium, PLG loops | Self-serve |

### Sequencing by Stage

| Stage | Primary Channels |
|-------|------------------|
| **Pre-PMF** | Founder sales, communities |
| **Early PMF** | Content, outbound, founder network |
| **Growth** | Paid, SEO, partnerships |
| **Scale** | All channels optimized |

### Selection Rules

- **Sequence, don't parallelize**: 1-2 channels at a time, prove, then add
- **Budget split**: 70% proven / 20% promising / 10% experimental
- **Stop trigger**: Channel CAC > 2x target after 60 days -> pause and test next

---

## 4. PLG Flywheel

### 6-Stage Model with Metrics

| Stage | Key Metrics | Targets |
|-------|-------------|---------|
| **Acquire** | Visitors, sign-ups, activation rate | Track by channel + ICP |
| **Activate** | Time to value, aha moment, feature adoption | <5 min to first value |
| **Engage** | DAU/WAU/MAU, stickiness, session frequency | DAU/MAU > 25% |
| **Refer** | K-factor, NPS, referral sign-ups | K > 0.5, NPS > 50 |
| **Expand** | Seats added, usage growth, team invites | Net expansion > 110% |
| **Monetize** | Free-to-paid, expansion rev, NRR | Conversion > 5%, NRR > 120% |

### Activation Checklist

- Define "first value moment" as a concrete product action (not sign-up)
- Measure time-to-value, optimize onboarding to reduce it
- Track activation by cohort, channel, and ICP segment
- Build PQL triggers from activation + engagement signals

---

## 5. PQL Scoring

### Formula

```
PQL Score = (Engagement x 0.4) + (Fit x 0.3) + (Intent x 0.3)
```

**Engagement (40%)**: Core actions completed (3+ in 7 days), feature depth, session frequency, team collaboration signals (invites, shares)

**Fit (30%)**: ICP score (A/B/C/D), company size match, industry match, tech stack compatibility

**Intent (30%)**: Pricing page visits, integration setup, admin/billing views, security doc downloads, API key generation

### Product-Led Sales (Sales-Assist)

Use when PLG brings users in, but conversion/expansion benefits from a human touch.

Prefer lifecycle + cohorts over vanity metrics. Always break down by ICP/segment + channel. Define a single funnel per motion (PLG vs sales-led) with clear stage definitions and owners. Track leading indicators (activation/retention, PQL, win rate) before "scale" decisions.

### PQL -> SQL Routing

- [ ] PQL trigger threshold (e.g., score > 70)
- [ ] Disqualifiers (students, competitors, tiny companies, unsupported geo)
- [ ] SLA: <24 hours first touch for high-intent PQLs
- [ ] Handoff to AE: meeting booked or procurement requested
- [ ] Instrument outcomes: PQL -> meeting -> pipeline -> won (review weekly)

---

## 6. Launch Playbooks

### Launch Types

| Type | Timeline | Effort |
|------|----------|--------|
| **Soft** | 2-4 weeks | Low -- test and iterate |
| **Beta** | 4-8 weeks | Medium -- waitlist + feedback |
| **ProductHunt** | 1 day + 2 weeks prep | Medium -- awareness burst |
| **Full** | 1-2 weeks live + 8 weeks prep | High -- max pipeline |

### Launch Tiers

| Tier | Cadence | Budget (Series A) | Activities |
|------|---------|-------------------|------------|
| **1 Major** | Quarterly | $50K-$100K | Press, webinar, email series, paid ads, sales blitz |
| **2 Standard** | Monthly | $10K-$25K | Blog, email, product update, sales enablement |
| **3 Minor** | Weekly | <$5K | In-app notification, changelog, support docs |

### Major Launch: 8-Week Playbook

**Weeks -8 to -5 (Foundation)**:
- W-8: Kickoff (Product/Marketing/Sales/CS), define goals, ICP, positioning, assign owners
- W-7: GTM strategy, sales enablement (deck, demo script, FAQs), content plan, creative assets
- W-6: Landing pages, campaign tracking, press release, email sequences, demo video
- W-5: Beta test with customers, train sales + CS, finalize timeline, prep case studies

**Weeks -4 to -1 (Ramp)**:
- W-4: Launch paid ads, teaser content, pre-launch email, pitch press, webinar registration
- W-3: A/B test pages + copy, ramp content, outbound prospecting, finalize webinar
- W-2: Reminder emails, increase ad spend, sales follow-up on warmed leads, dry-run systems
- W-1: Final review all assets, VIP pre-launch email, teams ready, press embargo lifts

**Launch Week**:
- Day 1: Press release, email blast, social blitz, full-budget ads, sales outbound (top 500), in-app notify
- Days 2-5: Daily monitoring, A/B optimizations, <4hr lead SLA, press responses, webinar (Day 3-4)

**Post-Launch (Weeks +2 to +4)**:
- W+2: Analyze vs. goals, post-launch content, scale winners (+20%/week budget), pause underperformers
- W+3-4: Post-launch report, customer interviews, win/loss analysis, adjust messaging, apply learnings

### Launch Metrics Dashboard

**Leading (daily):** Page visitors, demo requests, trial signups, MQLs, pipeline $
**Lagging (weekly):** SQLs, deals closed (# + $), win rate vs. baseline, adoption rate, feature NPS

```
WEEK 1 TEMPLATE:
Traffic:  [actual] vs [goal]    | MQLs: [actual] vs [goal]
SQLs:     [actual] vs [goal]    | Pipeline: $[actual] vs $[goal]
Top channels: [by MQL + CPL]   | Underperforming: [action]
```

---

## 7. Growth Loops

| Loop | Mechanism | Example |
|------|-----------|---------|
| **Viral** | User invites users | Dropbox referrals, Calendly links |
| **Content** | Content -> SEO -> signups | HubSpot blog, Ahrefs |
| **UGC** | Users create content -> new users | YouTube, Notion templates |
| **Paid** | Revenue -> ads -> customers -> revenue | Performance marketing |
| **Sales** | Pipeline -> close -> hire -> more pipeline | Enterprise SaaS |
| **Partner** | Enable partners -> referrals -> deals -> more partners | Cloud marketplaces |

### Loop Health Metrics

- **Viral**: K-factor > 0.5, invite-to-signup > 20%
- **Content**: Organic traffic growth > 10% MoM, content-to-signup > 2%
- **Paid**: ROAS > 3:1, CAC payback < 12 months
- **Sales**: Pipeline coverage > 3x, win rate > 25%

### By Stage

- **Pre-PMF**: No loops -- manual acquisition and learning
- **Early PMF**: Identify natural loop (viral if collaborative, content if SEO-friendly, sales if high ACV)
- **Growth**: Invest in primary loop, test secondary
- **Scale**: 2-3 loops, optimize unit economics per loop

---

## 8. Sales Enablement

### 6 Core Assets

1. **Sales Deck** (15 slides): Title, problem, solution, benefits, demo, differentiation, logos, case study, pricing, implementation, next steps. Visual-first, modular, updated quarterly.

2. **One-Pagers** (1-page PDFs): Product overview, competitive comparison, case study with metrics, pricing sheet.

3. **Battlecards** (per competitor): Overview, strengths/weaknesses, our advantages, win/lose scenarios, talk tracks, proof points. Update monthly.

4. **Demo Script** (30-45 min): Intro (2 min) -> Discovery (5 min) -> Demo on their use case (20 min) -> Q&A (10 min) -> Next steps (3 min). Show don't tell, use realistic data, focus on outcomes.

5. **Email Templates**: Cold outreach (3-5 touches), demo follow-up (<2 hrs), trial conversion (Day 1/3/7/14), proposal follow-up, closing sequence.

6. **ROI Calculator**: Inputs: current costs, time, team size. Outputs: savings, payback, 3-year ROI. Example: "Save $150K/year, 6-month payback, 500% ROI."

### Training Program

**Monthly Call** (60 min): Product updates, competitive landscape, win/loss insights, top performer tips, Q&A

**Quarterly Workshop** (half-day): Messaging refresh, role-play objection handling, product training, customer panel

**New Hire Onboarding** (4 weeks): W1 company/product/market, W2 ICP/personas/messaging, W3 competitive/battlecards, W4 demo certification (must pass to sell)

### Marketing <-> Sales Handoffs

| Touchpoint | Cadence | Content |
|------------|---------|---------|
| Weekly sync | 30 min | Win/loss insights, new assets, field feedback |
| QBR | Quarterly | Pipeline, win rate, deal size, action items |
| Slack #sales-enablement | Daily | Quick questions, updates |

**SLAs**: Inbound lead follow-up <4 hrs, competitive questions <48 hrs, launch enablement 1 week before, campaign content 2-week lead time.

---

## 9. International Expansion

### 5-Phase Market Entry

| Phase | Market | Months | Budget % | ARR Target |
|-------|--------|--------|----------|------------|
| 1 | US | 1-6 | 50% ($200K) | $1M |
| 2 | UK | 4-9 | 20% ($80K) | $500K |
| 3 | DACH | 7-12 | 15% ($60K) | $300K |
| 4 | France | 10-15 | 10% ($40K) | $200K |
| 5 | Canada | 7-12 | 5% ($20K) | $100K |

**Total Year 1**: $400K spend, expected 3:1 pipeline ROI

### Key Entry Considerations

- **US**: Largest TAM, fastest cycles, USD pricing, US SDRs/AEs
- **UK**: English-speaking EU gateway, GBP pricing, GDPR compliance
- **DACH**: German translation required, GDPR-first positioning, local case studies
- **France**: Full French localization (website + product + support), local team
- **Canada**: Minimal localization (CAD pricing), leverage US sales team

### Localization Checklist (per market)

- [ ] Website: translate, local currency, local phone
- [ ] Pricing: local currency, VAT/taxes displayed
- [ ] Legal: data privacy (GDPR, CCPA, local regs)
- [ ] Sales: local reps or agency
- [ ] Marketing: localized ads, content, case studies
- [ ] Payments: local methods (SEPA, iDEAL, etc.)

---

## 10. Messaging Architecture

### Value Prop Template

```
[Product] helps [Target Customer] [Achieve Goal] by [Unique Approach]
```

### 4-Level Hierarchy

```
L1 Value Proposition: one-liner (why you exist)
L2 Key Benefits: 3-5 pillars (Speed, Quality, Cost, Collaboration)
L3 Features -> Benefits -> Outcomes:
   AI automation -> eliminates manual work -> save 10 hrs/week
   Real-time sync -> no conflicts -> 50% fewer errors
L4 Proof Points: logos, stats ("X teams, Y G2 rating"), case studies
```

### Messaging by Persona

| Persona | Key Message | Proof |
|---------|-------------|-------|
| Economic Buyer | "Increase revenue 25%, cut costs $200K/year" | ROI calculator, case studies |
| Technical Buyer | "99.99% uptime, SOC 2, enterprise architecture" | Docs, whitepaper |
| End User | "Less busywork, more impact" | Demo, trial, testimonials |

### Testing Cadence

- **Qualitative**: 10-15 customer interviews (quarterly)
- **Quantitative**: A/B test headlines, ad copy, email subjects (measure CTR, conversion, demos)
- **Sales feedback**: Monthly win/loss analysis (what resonates, what doesn't)
- **Cycle**: Test 2-4 weeks -> analyze 1 week -> update docs 1 week -> train sales 1 week -> repeat quarterly

---

## Do / Avoid

**Do**: Define activation as concrete product action | Track leading indicators before scaling | Sequence 1-2 channels | AI for execution, humans for strategy | Tier ICP by fit + intent | Weekly GTM review (pipeline + experiments + decisions)

**Avoid**: All channels in parallel | Content spam without measurement | Vanity metrics without retention | Scaling paid before activation is stable | Skipping sales enablement when adding reps

---

## Resources

| Resource | Purpose |
|----------|---------|
| [channel-playbooks.md](references/channel-playbooks.md) | Detailed channel execution |
| [sales-motion-design.md](references/sales-motion-design.md) | Sales process + RevOps |
| [plg-implementation.md](references/plg-implementation.md) | PLG execution + PQL frameworks |
| [ai-gtm-automation.md](references/ai-gtm-automation.md) | AI-powered GTM tools |

### Templates

| Template | Purpose |
|----------|---------|
| [gtm-strategy.md](assets/gtm-strategy.md) | Full GTM strategy document |
| [launch-playbook.md](assets/launch-playbook.md) | Launch planning |
| [icp-definition.md](assets/icp-definition.md) | ICP documentation |

### Data

| File | Purpose |
|------|---------|
| [sources.json](data/sources.json) | GTM resources |

---

## What Good Looks Like

- One primary ICP with clear anti-ICP and measurable triggers (signals) for targeting.
- A motion decision with explicit economics (ACV, payback, touch model) and defined handoffs.
- One primary channel with a test plan, success metrics, and stop/pivot triggers.
- Instrumented funnel from source -> activation/value -> revenue/expansion (by segment + channel).
- A weekly operating cadence with a backlog of experiments and a written decision log.

---

## Related Skills

| Skill | Use For |
|-------|---------|
| startup-competitive-analysis | Market mapping, battlecards, positioning inputs |
| marketing-content-strategy | Messaging deep dive, content calendar |
| startup-business-models | Pricing, unit economics, revenue models |
| marketing-leads-generation | Lead acquisition, demand gen |
| marketing-ai-search-optimization | GEO/AI search visibility |
| marketing-social-media | Social channel execution |
