# Outbound Strategist Skill

> Domain knowledge for signal-based outbound, ICP definition, and multi-channel prospecting sequences.
> Feeds into: `crm-agent` (outreach sequence generation), `investor-agent` (investor outreach templates), AI Chat outbound coaching.

## Signal-Based Selling Framework

Outreach triggered by buying signals converts 4-8x compared to untriggered cold outreach. Every sequence should be signal-triggered, not calendar-triggered.

### Signal Tiers (Ranked by Intent Strength)

**Tier 1 -- Active Buying Signals (Highest Priority, act within 30 min)**
- Direct intent: review site visits, pricing page views, competitor comparison searches
- RFP or vendor evaluation announcements
- Explicit technology evaluation job postings
- Inbound demo requests or content downloads

**Tier 2 -- Organizational Change Signals (Act within 24 hours)**
- Leadership changes in the buying persona's function (new VP = new priorities)
- Funding events (Series B+ with stated growth goals = budget and urgency)
- Hiring surges in the department your product serves (scaling pain is real pain)
- M&A activity (integration creates tool consolidation pressure)

**Tier 3 -- Technographic and Behavioral Signals (Act within 1 week)**
- Technology stack changes (visible through job postings, BuiltWith)
- Conference attendance or speaking on adjacent topics
- Content engagement: whitepapers, webinars, social engagement with industry content
- Competitor contract renewal timing (if discoverable)

### Speed-to-Signal

The half-life of a buying signal is short:
- **< 30 minutes**: Optimal response window
- **24 hours**: Signal is going stale
- **72 hours**: A competitor has already had the conversation

## ICP Definition Template

A useful ICP is falsifiable. If it does not exclude companies, it is not an ICP.

### Firmographic Filters
- Industry verticals: 2-4 specific (not "enterprise" or "SMB")
- Revenue range or employee count band
- Geography (if relevant to go-to-market)
- Technology stack requirements (what must they already use?)

### Behavioral Qualifiers
- What business event makes them a buyer right now?
- What pain does the product solve that they cannot ignore?
- Who inside the org feels that pain most acutely?
- What does their current workaround look like?

### Disqualifiers (Equally Important)
- What makes an account look good on paper but never close?
- Industries or segments where win rate is below 15%
- Company stages where the product is premature or overkill
- Accounts with known budget constraints or long procurement cycles

## Account Tiering Model

| Tier | Account Count | Contacts/Account | Personalization | Channels |
|------|--------------|-------------------|-----------------|----------|
| **Tier 1** | 50-100 | 3-5 (multi-thread) | Fully custom per account | All channels + warm intros + direct mail |
| **Tier 2** | 200-500 | 2-3 | Industry-specific + account opening line | Email + LinkedIn + phone |
| **Tier 3** | Remaining ICP-fit | 1 (primary buyer) | Industry + role templates | Email + LinkedIn (automated) |

**Quarterly re-evaluation**: Promote Tier 3 to Tier 2 based on engagement signals. Promote Tier 2 to Tier 1 based on active buying signals.

## Multi-Channel Sequence Architecture

### Channel Selection by Persona

| Persona | Primary | Secondary | Tertiary |
|---------|---------|-----------|----------|
| C-Suite / GP | LinkedIn InMail | Warm intro / referral | Short direct email |
| VP-level | Email | LinkedIn | Phone |
| Director | Email | Phone | LinkedIn |
| Manager / IC | Email | LinkedIn | Video (Loom) |
| Technical buyers | Email (technical content) | Community / Slack | LinkedIn |

### 10-Touch Sequence (3-4 Weeks)

Each touch must add a new value angle. Repeating the same ask with different words is nagging, not sequencing.

```
Touch 1  (Day 1, Email):    Signal-based opening + specific value prop + soft CTA
Touch 2  (Day 3, LinkedIn): Connection request with personalized note (no pitch)
Touch 3  (Day 5, Email):    Share relevant insight/data point tied to their situation
Touch 4  (Day 8, Phone):    Call with voicemail drop referencing email thread
Touch 5  (Day 10, LinkedIn): Engage with their content or share relevant article
Touch 6  (Day 14, Email):   Case study from similar company/situation + clear CTA
Touch 7  (Day 17, Video):   60-second personalized Loom showing something specific
Touch 8  (Day 21, Email):   New angle -- different pain point or stakeholder perspective
Touch 9  (Day 24, Phone):   Final call attempt
Touch 10 (Day 28, Email):   Breakup email -- honest, brief, leave the door open
```

## Cold Email Anatomy

### Subject Line
- 3-5 words, lowercase, looks like an internal email
- Reference signal or specificity: "re: the new data team"
- Never clickbait, never ALL CAPS

### Opening Line (Signal-Based)
- **Bad**: "I hope this email finds you well."
- **Bad**: "I am reaching out because [company] helps companies like yours..."
- **Good**: "Saw you just hired 4 data engineers -- scaling the analytics team usually means the current tooling is hitting its ceiling."

### Value Proposition (Buyer's Language)
- One sentence connecting their situation to an outcome they care about
- Use their vocabulary, not marketing copy
- Specificity beats cleverness: numbers, timeframes, concrete outcomes

### Social Proof (Optional, One Line)
- "[Similar company] cut their [metric] by [number] in [timeframe]"
- Only include if genuinely relevant to their situation

### CTA (Single, Clear, Low Friction)
- **Bad**: "Would love to set up a 30-minute call to walk you through a demo"
- **Good**: "Worth a 15-minute conversation to see if this applies to your team?"
- **Good**: "Open to hearing how [similar company] handled this?"

## Reply Rate Benchmarks

| Outreach Quality | Reply Rate | Pipeline Conversion |
|-----------------|------------|---------------------|
| Generic, untargeted | 1-3% | Low quality meetings |
| Role/industry personalized | 5-8% | Mixed quality |
| Signal-based with account research | 12-25% | High quality pipeline |
| Warm introduction or referral-based | 30-50% | Highest quality |

## Metrics That Matter

| Metric | What It Tells You | Target |
|--------|-------------------|--------|
| Signal-to-contact time | How fast you act on signals | < 30 minutes |
| Reply rate | Message relevance and quality | 12-25% (signal-based) |
| Positive reply rate | Actual interest generated | 5-10% |
| Meeting conversion | Reply-to-meeting efficiency | 40-60% of positive replies |
| Sequence completion rate | Are reps finishing sequences? | 80%+ |
| Stage 1 to Stage 2 rate | Meeting quality / qualification | 50%+ |

## Rules of Engagement

1. Never send outreach without a reason the buyer should care right now
2. If you cannot articulate why this person, this company, this moment -- you are not ready to send
3. Respect opt-outs immediately and completely
4. Do not automate what should be personal, and do not personalize what should be automated
5. Test one variable at a time (subject line OR opening OR CTA, not all at once)
6. Document what works -- a playbook in one person's head is not a playbook

## StartupAI Integration Points

- **crm-agent EF**: `generate_email` action uses cold email anatomy and signal-based opening. Account tiering informs contact prioritization. Sequence architecture templates drive `suggest_follow_ups` action
- **investor-agent EF**: Investor outreach adapts the 10-touch sequence for fundraising (GP = C-Suite persona, signal = portfolio thesis match or fund deployment timing). `generate_outreach` action uses Challenger-style value props
- **AI Chat**: When founders ask about outbound or investor outreach, reference ICP definition template, signal tiers, and reply rate benchmarks
- **Validator scoring**: Go-to-market dimension evaluates whether the startup has identified ICP with firmographic + behavioral qualifiers, not just a TAM slide

## Investor Signal Adaptation

The signal-based framework adapted for StartupAI's investor pipeline:

| Signal Tier | Sales Context | Investor Context | Example | Action Speed |
|-------------|--------------|------------------|---------|-------------|
| **Tier 1 -- Active** | Demo request, pricing page visit | Fund just raised new vehicle, publicly seeking deals in your space, warm intro offered | "Sequoia just closed Fund XVI, deploying $500M in AI-first startups" | Act within 24h |
| **Tier 2 -- Organizational** | Leadership change, hiring surge | New GP joined fund, fund expanded thesis to your vertical, portfolio company exit creates follow-on budget | "New partner at a16z came from [your industry]" | Act within 3 days |
| **Tier 3 -- Behavioral** | Conference attendance, content engagement | Investor published thesis blog post on your space, spoke at relevant conference, portfolio company is adjacent | "Investor tweeted about problems in your vertical" | Act within 1 week |

### Cold Email Anatomy (Investor Version)

```
Subject: [Signal] -- [Value hook] for [Fund name]

[1 sentence: signal that triggered this outreach]
[1 sentence: specific value to this investor's thesis/portfolio]
[1 sentence: proof point -- traction metric or notable customer]
[1 sentence: clear CTA with specific ask]

Total: < 120 words
```

### Signal Detection in StartupAI

The investor-agent EF checks these signals when scoring:
- `signal_data.fund_raise_date` -> Tier 1 if within 6 months
- `signal_data.thesis_match` -> Tier 1 if exact match, Tier 3 if adjacent
- `signal_data.warm_intro_available` -> Tier 1 (always highest priority)
- `signal_data.portfolio_overlap` -> Tier 2 (competing or complementary)
- `signal_data.recent_activity` -> Tier 3 (blog posts, conference talks)
