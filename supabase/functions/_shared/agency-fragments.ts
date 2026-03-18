/**
 * Agency Prompt Fragments — Deno Deploy-safe exports
 *
 * Source: agency/prompts/036-fragment-validator-scoring.md
 *         agency/prompts/037-fragment-validator-composer.md
 *
 * These are exported as TypeScript string constants instead of loaded via
 * Deno.readTextFile() because Deno Deploy only bundles statically imported
 * files — .md files referenced at runtime would not be available.
 *
 * To update: edit the content here AND the corresponding .md file in agency/prompts/
 */

// ---------------------------------------------------------------------------
// Scoring Agent Fragment
// Source: agency/prompts/036-fragment-validator-scoring.md
// Enhances: evidence-weighted scoring, RICE priority actions, bias detection
// ---------------------------------------------------------------------------
export const SCORING_FRAGMENT = `
## Evidence-Weighted Scoring

Score each of the 7 dimensions using evidence tiers. Assign a confidence weight to each piece of supporting evidence:

| Evidence Tier | Confidence | Weight |
|---|---|---|
| Cited external source (report, study, public data) | High | 1.0x |
| Founder claim with partial corroboration | Medium | 0.8x |
| AI inference only (no external validation) | Low | 0.6x |

Rules:
- If the primary evidence for a dimension is AI inference only, discount the raw score by 20%.
- When multiple evidence tiers exist for one dimension, use the weighted average.
- In the score output, annotate each dimension with its primary evidence tier so downstream agents can assess reliability.
- A dimension with zero cited sources should never score above 70.

## RICE-Based Priority Actions

For each scored dimension, generate 1-2 priority actions. Score each action using RICE:

\`\`\`
RICE Score = (Reach x Impact x Confidence) / Effort
\`\`\`

- **Reach** (1-10): How many aspects of the business does this action affect?
- **Impact** (0.25 / 0.5 / 1 / 2 / 3): Minimal / Low / Medium / High / Massive
- **Confidence** (0.5 / 0.8 / 1.0): Low / Medium / High — based on evidence tier
- **Effort** (1-10): Person-weeks to complete. Solo founder baseline.

After scoring all actions across all dimensions, rank them globally. Return the top 5 as priority_actions. Each action must include:
- action: What to do (imperative, specific, under 15 words)
- rice_score: Numeric RICE score
- timeframe: "1 week" | "2 weeks" | "1 month" | "3 months"
- effort: "Low" | "Medium" | "High"
- dimension: Which scored dimension this addresses

## Bias Detection — Additional Checks

Before finalizing scores, run these bias checks:

1. **Confirmation Bias**: Does the scoring rely heavily on evidence that confirms the founder's pitch while ignoring contradictory signals? Flag if >3 dimensions use only founder-aligned evidence.
2. **Survivorship Bias**: Are comparable companies cited only because they succeeded? Check if failed competitors in the same space were considered.
3. **Anchoring Bias**: Is the TAM/SAM/SOM anchored to the founder's stated number without bottom-up validation? Flag if market sizing lacks independent calculation.
4. **Optimism Bias**: Are revenue projections or growth assumptions significantly above industry medians without justification?

If any bias is detected:
- Add a bias_flags array to the scoring output with { type, description, affected_dimensions }.
- Do NOT silently adjust scores. Surface the bias transparently so the Composer can include warnings in the report.`;

// ---------------------------------------------------------------------------
// Composer Agent Fragment
// Source: agency/prompts/037-fragment-validator-composer.md
// Enhances: three-act narrative, win themes, growth channels, behavioral framing
// ---------------------------------------------------------------------------
export const COMPOSER_FRAGMENT = `
## Three-Act Report Narrative

Structure the executive summary using a three-act arc. Each act should flow naturally into the next:

**Act 1 — Understanding (Market Context)**
- Open with the market reality, not the startup. Establish the landscape: size, growth trajectory, and the structural problem creating the opportunity.
- Ground the reader in evidence. Use a specific data point from the Research agent within the first two sentences.
- End Act 1 with the tension: why current solutions fail, and what is changing now.

**Act 2 — Solution Journey (What This Startup Does Differently)**
- Introduce the startup's approach as a response to the tension from Act 1.
- Focus on mechanism, not features. Explain *how* this works differently, not just *what* it does.
- Include one concrete scenario: a named persona experiencing the product. Keep it under 3 sentences.
- Reference competitive positioning data from the Competitors agent.

**Act 3 — Transformed State (Quantified Future Outcome)**
- Paint the quantified future: revenue potential, market capture, or user impact.
- Connect back to the score and verdict. If the score is below 60, be honest about the gap between ambition and evidence.
- Close with a single decisive sentence: what should happen next.

## Win Theme Integration

Extract 2-3 win themes from the scoring data. A win theme is a recurring strength that appears across multiple dimensions.

Each win theme must be:
- **Buyer-specific**: Relevant to the target customer or investor, not generic.
- **Provable**: Backed by at least one data point from the report (market size, competitor gap, traction metric).
- **Differentiating**: Something competitors cannot easily claim.

Weave win themes throughout the report. Each major section should reinforce at least one theme. In the summary, explicitly name the win themes.

Example win themes (adapt to actual data):
- "Structural cost advantage from AI automation"
- "First-mover in regulatory-compliant [industry] vertical"
- "Network effects from marketplace model create compounding moat"

## Growth Channel Recommendations

In the revenue and channels sections, recommend specific growth channels using ICE scoring:

\`\`\`
ICE Score = Impact (1-10) x Confidence (1-10) x Ease (1-10)
\`\`\`

Match channel recommendations to the startup's current stage:

| Stage | Primary Channels | Avoid |
|---|---|---|
| Pre-PMF (idea/MVP) | Content marketing, community building, founder-led sales | Paid ads, programmatic |
| PMF (early traction) | Paid acquisition, strategic partnerships, referral programs | Mass media, expensive conferences |
| Scale (proven unit economics) | Programmatic channels, channel partnerships, brand marketing | Founder-led anything |

For each recommended channel:
- Name the channel specifically (not "social media" but "LinkedIn thought leadership targeting [ICP]").
- Estimate time-to-first-result (weeks).
- Note prerequisites (e.g., "requires content library" or "requires $5K/mo budget").

Limit to top 3 channels. Rank by ICE score.

## Behavioral Framing for Next Steps

Frame all recommended next steps using behavioral science principles:

1. **Lead with micro-wins**: The first recommended action should be completable in under 1 week and produce a visible result. This builds momentum.
2. **Momentum language**: Use "Start with X to unlock Y" framing instead of passive lists. Each action should connect to what it enables.
3. **Progressive commitment**: Order actions from smallest to largest commitment. Do not lead with "raise $2M" — lead with "validate pricing with 5 customer interviews."
4. **Loss framing for urgency**: For time-sensitive actions, frame as opportunity cost. Example: "Each month without competitor research costs you positioning clarity in a market moving at X% growth."
5. **Specificity over abstraction**: "Interview 5 customers in [segment] about [pain point]" not "Do customer discovery."

The next steps section should feel like a coach giving a game plan, not a consultant delivering a report.`;

// ---------------------------------------------------------------------------
// Sprint Agent Fragment
// Source: agency/prompts/038-fragment-sprint-agent.md
// Enhances: RICE scoring, Kano classification, momentum sequencing, capacity planning
// ---------------------------------------------------------------------------
export const SPRINT_FRAGMENT = `
## RICE Scoring for Task Generation

Score every generated task using RICE before assigning it to a sprint:

\`\`\`
RICE Score = (Reach x Impact x Confidence) / Effort
\`\`\`

- **Reach** (1-10): How many users, customers, or business dimensions does this task affect?
- **Impact** (0.25 / 0.5 / 1 / 2 / 3): Minimal / Low / Medium / High / Massive
- **Confidence** (0.5 / 0.8 / 1.0): How certain are we this task will produce the expected outcome?
- **Effort** (1-10): Person-days for a solo founder. 1 = a few hours, 10 = two full weeks.

Classify tasks into quadrants based on RICE:

| Quadrant | Criteria | Action |
|---|---|---|
| **Quick Wins** | RICE >= 5, Effort <= 3 | Do first. Sprint 1 priority. |
| **Big Bets** | RICE >= 5, Effort > 3 | Plan carefully. Break into subtasks. Sprint 2-3. |
| **Fill-Ins** | RICE < 5, Effort <= 3 | Use for slack time between major tasks. |
| **Time Sinks** | RICE < 5, Effort > 3 | Skip unless explicitly requested. |

Include rice_score and quadrant in each task output.

## Kano Classification

Tag each task with a Kano category:

- **Must-Have**: Without this, the product/business fails a basic expectation. Examples: landing page, basic auth, legal compliance. Must-Haves go in Sprint 1 regardless of RICE score.
- **Performance**: More of this = more satisfaction. Linear relationship. Examples: speed improvements, additional features, broader integrations.
- **Delighter**: Unexpected value that creates outsized positive reaction. Examples: personalization, surprise features, exceptional design details. Save for Sprint 3+ unless effort is very low.

Sprint allocation rule: Sprint 1 = all Must-Haves + top Quick Wins. Sprint 2 = Big Bets + Performance tasks. Sprint 3+ = Performance + Delighters.

## Momentum Sequencing

Order tasks within each sprint to build psychological momentum:

1. **Start every sprint with a Quick Win** (completable in 1-2 days). Early completion builds confidence and establishes velocity.
2. **Place the hardest task in the middle** of the sprint, not at the beginning. By mid-sprint, momentum is established and cognitive load tolerance is higher.
3. **End every sprint with a visible deliverable**: something the founder can show, demo, or share. This creates completion satisfaction and motivates the next sprint.
4. **Never sequence two high-effort tasks back-to-back**. Alternate between high-effort and low-effort to prevent burnout.
5. **Group related tasks adjacently**. Context-switching between unrelated domains costs 20-30% productivity.

## Capacity Planning

Apply these capacity constraints when generating sprint plans:

| Team Size | Max Story Points / 2-Week Sprint | Buffer |
|---|---|---|
| Solo founder | 40 points | 20% (8 points reserved) |
| Team of 2-3 | 80 points | 20% (16 points reserved) |
| Team of 4-6 | 150 points | 25% (37 points reserved) |

Story point mapping: 1 = trivial (< 2 hours), 2 = small (half day), 3 = medium (1 day), 5 = large (2-3 days), 8 = very large (1 week), 13 = epic (break this down further).

If total generated tasks exceed capacity, defer lowest-RICE tasks to the next sprint. Never exceed 80% utilization target — the 20% buffer absorbs interrupts, bugs, and scope discovery.`;

// ---------------------------------------------------------------------------
// Pitch Deck Agent Fragment
// Source: agency/prompts/040-fragment-pitch-deck.md
// Enhances: win themes, Challenger narrative, persuasion architecture, traction story
// ---------------------------------------------------------------------------
export const PITCH_DECK_FRAGMENT = `
## Win Theme Architecture

Build the entire deck around 2-3 win themes extracted from validation and scoring data. A win theme is a recurring competitive advantage that resonates across multiple slides.

Each win theme must be:
- **Investor-thesis-specific**: Aligned to what the target investor cares about (capital efficiency, market size, defensibility, team).
- **Provable with data**: Backed by at least one metric, benchmark, or customer proof point from the report.
- **Differentiating**: Something no current competitor can credibly claim.

Application rules:
- Every slide must reinforce at least one win theme. If a slide doesn't connect to a theme, question whether it belongs.
- The title of each slide should be a claim (not a label). "We reduce CAC by 60% through organic loops" not "Customer Acquisition."
- Introduce the strongest win theme within the first 3 slides (primacy effect).
- Return to the strongest win theme on the Ask slide (recency effect).

## Challenger Narrative for the Problem Slide

Structure the problem slide using Challenger Sale methodology:

1. **Industry insight** (1-2 sentences): Start with a non-obvious truth about the market that the investor may not have considered. This positions the founder as an expert, not a supplicant. Example: "78% of [industry] spend goes to [surprising category], but conversion rates have declined 30% since 2023."

2. **Cost of the status quo** (1-2 sentences): Quantify what the current approach costs. Use annual figures. Make the waste tangible. Example: "Enterprise teams waste $340K/year on manual [process] that fails 1 in 4 times."

3. **The new way** (1-2 sentences): Present the paradigm shift before revealing the product. The investor should understand *why* the old way is broken before seeing *what* replaces it. Example: "AI-native [approach] eliminates the core bottleneck: [specific constraint]."

4. **Product reveal**: Only after establishing the insight, cost, and new paradigm — then show the product as the embodiment of the new way.

## Persuasion Architecture

Apply these cognitive principles across the deck structure:

**Primacy Effect**: The first 3 slides form the investor's anchor impression. Lead with your strongest positioning: market size (if massive), traction (if impressive), or team (if exceptional). Never lead with the weakest element.

**Progressive Disclosure**: Reveal complexity gradually. Slide 1-4: simple narrative (problem, solution, market). Slide 5-8: supporting evidence (traction, business model, competition). Slide 9-12: detailed ask (financials, team, use of funds). Never front-load complexity.

**Loss Aversion**: On the opportunity/market slide, frame the investor's decision as potential regret avoidance. "This market is growing at X%/year. Early movers capture Y% of value." Quantify the cost of waiting, not just the upside of investing.

**Social Proof Cascade**: Stack proof points in increasing credibility: user metrics, customer logos, revenue numbers, advisor names, press mentions. Each proof point should be more impressive than the last.

**Recency Effect**: The Ask slide is the last substantive impression. Include: the specific amount, use of funds mapped to milestones, the single biggest number in the deck (projected ARR, market capture, or growth rate).

## Growth Story on the Traction Slide

The traction slide must tell a growth story, not just show numbers. Include:

- **Growth rate**: Month-over-month percentage. If pre-revenue, show user growth, engagement, or waitlist growth. Annualize if the monthly number looks small.
- **Unit economics trajectory**: Show CAC and LTV trending in the right direction, even if absolute values are early-stage. An improving ratio matters more than the current number.
- **Viral coefficient** (if applicable): K-factor, referral rate, or organic acquisition percentage. Investors pay premiums for products that grow themselves.
- **Channel diversification**: Show that growth is not dependent on a single channel. Even 2 channels reduce risk perception significantly.

If traction is limited (pre-launch), show proxy metrics: LOIs, pilot commitments, waitlist size, engagement depth (sessions per user, time in product). Frame as "validation velocity" — how fast you are learning, not just how much you have built.`;

// ---------------------------------------------------------------------------
// CRM & Investor Agent Fragment
// Source: agency/prompts/039-fragment-crm-investor.md
// Enhances: MEDDPICC scoring, signal-based timing, cold email framework
// ---------------------------------------------------------------------------
export const CRM_INVESTOR_FRAGMENT = `
## Investor MEDDPICC Adaptation

Score each investor opportunity using an adapted MEDDPICC framework. Rate each element 1-5:

| Element | Question to Assess | Score Guide |
|---|---|---|
| **Metrics** | What ROI/multiple does this fund target? Does our trajectory match? | 5 = perfect fit, 1 = misaligned returns |
| **Economic Buyer** | Who makes the final investment decision at the fund? Do we have access? | 5 = direct contact with decision-maker, 1 = no access |
| **Decision Criteria** | What does this fund specifically look for (stage, sector, geo, metrics)? | 5 = we match all criteria, 1 = poor fit |
| **Decision Process** | How many partners approve? What is the IC structure? | 5 = single decision-maker, 1 = complex multi-stage IC |
| **Paper Process** | Term sheet to close timeline. Legal complexity. | 5 = standard docs, fast close, 1 = custom terms, slow |
| **Pain** | What portfolio gap does this startup fill for the fund? | 5 = fills stated thesis gap, 1 = no clear gap |
| **Champion** | Do we have an internal advocate at the fund (associate, advisor, portfolio founder)? | 5 = strong warm intro, 1 = cold outreach only |
| **Competition** | Who else is competing for this investor's attention/allocation? | 5 = no competing deals, 1 = crowded round |

**Total: /40**. Prioritize investors scoring 28+ for active outreach. 20-27 for nurture. Below 20, deprioritize.

Include the MEDDPICC breakdown in the analyze_investor_fit response so founders can see exactly where each investor is strong or weak.

## Signal-Based Outreach Timing

Prioritize investor outreach when buying signals are detected. Rank signals by strength:

**Strong Signals (reach out within 1 week):**
- Fund just announced a new vehicle raise (capital to deploy)
- Partner published content or spoke at a conference about your exact space
- Fund made a recent investment in an adjacent (non-competing) company
- A portfolio company in your space just exited successfully

**Medium Signals (reach out within 2-4 weeks):**
- Partner liked/shared content related to your industry on social media
- Fund's website updated their thesis to include your category
- Portfolio company in related space announced a pivot or shutdown (opens thesis gap)

**Weak Signals (add to nurture, don't rush):**
- Fund is generally active in your broad sector
- Partner attended a relevant conference (but no specific engagement signal)

When generating outreach recommendations, always note which signal triggered the timing suggestion. No signal = don't outreach yet. Build the relationship through content and warm intros first.

## Cold Email Framework

When generating investor outreach emails via generate_outreach, follow this structure:

**Subject Line:**
- 3-5 words, lowercase (except proper nouns)
- Reference a signal or shared context, never the ask
- Examples: "your [portfolio company] thesis, expanded" / "[industry] infrastructure gap" / "re: [conference] panel on [topic]"

**Body Structure (under 120 words):**

1. **Signal-based opening** (1 sentence): Reference the specific buying signal. "Saw [fund] led [company]'s round in [adjacent space]..."
2. **Value proposition** (1 sentence): In investor language — market size, growth rate, or unique wedge. Not product features.
3. **Social proof** (1 sentence): A metric, comparable outcome, or notable advisor/customer. "We're seeing [X] with [proof point], similar to early [comparable portfolio company]."
4. **Low-friction CTA** (1 sentence): Ask for 15 minutes, not a pitch meeting. Offer a specific time or ask for their calendar link. Never attach a deck unsolicited.

**Anti-patterns to avoid:**
- "We're disrupting..." (every startup says this)
- Attaching pitch decks in cold outreach
- Asking for funding in the first email
- Generic "I'd love to pick your brain"`;

// ---------------------------------------------------------------------------
// Research Agent Fragment
// Source: .agents/skills/startup/market-intelligence/SKILL.md
// Enhances: Porter's Five Forces, market accessibility, founder optimism detection
// ---------------------------------------------------------------------------
export const RESEARCH_FRAGMENT = `
## Porter's Five Forces — Quick Assessment

Rate each force as High / Medium / Low with specific rationale for this startup's market:

| Force | Key Questions | High = Unfavorable |
|---|---|---|
| **Competitive Rivalry** | How many competitors? Market growth rate? Differentiation? | >10 funded competitors, slow growth, low differentiation |
| **Threat of New Entrants** | Capital requirements? Regulatory barriers? Network effects? | Low capital needed, no regulation, no switching costs |
| **Supplier Power** | Supplier concentration? Switching costs? Platform dependency? | Few suppliers, high switching cost, platform lock-in |
| **Buyer Power** | Buyer concentration? Price sensitivity? Alternatives? | Few large buyers, commodity product, easy switching |
| **Threat of Substitutes** | Alternative solutions? Status quo viability? | Many alternatives, good-enough free options |

Overall attractiveness: 0-1 forces High = very attractive, 2 = moderate, 3+ = challenging (need strong moat).
Include as market_forces in output.

## Market Accessibility Scoring

Score how reachable this market is (1-10 per dimension):

- **Buyer Reachability** (10=easy): Can you find and contact buyers? Digital channels? Trade associations?
- **Sales Cycle Complexity** (10=simple): Single decision-maker = fast. 6+ stakeholders with procurement = slow.
- **Regulatory Burden** (10=none): No compliance = easy entry. FDA/SEC/HIPAA = expensive but also barrier for competitors.
- **Distribution Existing** (10=plug in): Marketplace/app store exists = distribution ready. New category needing education = hard.

Composite = average of 4 scores. Below 4.0 = flag as "hard-to-reach market."
A $10B TAM with composite 3.0 is less valuable than a $2B TAM with composite 8.0.
Include as market_accessibility in output.

## Founder Optimism Detection

Compare founder-provided estimates against your research. Surface divergences transparently:

- Founder TAM >3x research TAM → flag with both values and divergence factor
- Founder growth rate >2x industry CAGR → flag with industry median
- Founder claims "no competitors" but research finds 3+ → flag as optimism red flag
- Founder assumes >5% market capture in year 1 → flag vs typical SOM calibration

Output as optimism_flags array: { claim, founder_value, research_value, divergence_factor }.
Do NOT silently correct founder numbers. Surface the gap so Scoring and Composer can address it.`;

// ---------------------------------------------------------------------------
// Competitors Agent Fragment
// Source: .agents/skills/startup/competitive-strategy/SKILL.md
// Enhances: competitive velocity, zombie detection, pricing landscape, win/loss
// ---------------------------------------------------------------------------
export const COMPETITORS_FRAGMENT = `
## Competitive Velocity Assessment

For each Tier 1 (direct) competitor, assess velocity — how fast they are moving:

- **Feature Shipping Rate**: Weekly releases = high velocity. Quarterly = slow.
- **Funding Trajectory**: Series B+ with war chest = well-resourced. Last raised 2+ years ago = limited.
- **Market Share Trend**: Growing G2 reviews, aggressive hiring, segment expansion = growing. Flat traffic, layoffs = declining.
- **Response Capability**: If this startup ships their differentiator, how fast can this competitor copy? <3 months = high threat. >12 months = defensible window.

Output velocity_rating per direct competitor: fast | moderate | slow.
A competitor with velocity fast + threat high is existential — flag explicitly.

## Zombie Competitor Detection

Identify competitors that appear active but are effectively dead:
- Last product update >12 months ago
- Flat or declining web traffic
- No recent funding, press, or social media in 6+ months
- Job postings removed or minimal hiring

Mark as status: zombie. Zombies = threat_level: low regardless of past funding/brand.
Key: A market with 5 competitors where 3 are zombies is a 2-competitor market. Adjust analysis.

## Pricing Landscape

For each direct competitor where pricing is discoverable:
- **Model**: subscription | usage-based | freemium | one-time | hybrid
- **Entry Price**: lowest tier or free plan
- **Enterprise Price**: highest tier or custom signals
- **Price Gap**: Underserved tier? ($0 free vs $50K enterprise = mid-market opportunity)

If founder has no pricing yet, recommend positioning: below (volume), at (differentiation), above (premium/outcome).
Include as pricing_landscape array.

## Win/Loss Pattern Prediction

Based on competitor analysis, predict:
- **Win When**: Customer values [founder's unique capability] over [competitor's strength]. Specify the customer profile.
- **Lose When**: Customer prioritizes [competitor's moat] over [founder's differentiation]. Specify deal-breakers.
- **Switching Triggers**: Events that move competitor customers to founder (price hike, feature removal, acquisition, outage, contract renewal).

Include as win_loss_patterns.`;

// ---------------------------------------------------------------------------
// MVP Agent Fragment
// Source: .agents/skills/startup/mvp/mvp-execution/SKILL.md
// Enhances: build/buy/skip, resource allocation, pivot criteria, GTM motion
// ---------------------------------------------------------------------------
export const MVP_FRAGMENT = `
## Build / Buy / Skip Framework

Classify each MVP feature:

| Decision | Criteria | Examples |
|----------|----------|---------|
| **Build** | Core differentiator — why users choose this over alternatives | Proprietary algorithm, unique workflow, novel data model |
| **Buy** | Commodity capability — well-solved by existing tools | Auth (Supabase), payments (Stripe), email (SendGrid), analytics |
| **Skip** | Does not test riskiest assumption, nice-to-have, validate later | Admin dashboards, settings, multi-language, custom branding |

Rule: If it doesn't test the riskiest assumption AND isn't Must-Have for the core journey, Skip it.
Tag each task with classification: build | buy | skip as feature_classifications.

## Resource Allocation by Team Size

| Team Size | Max Features | Timeline | Sprint Cadence |
|-----------|-------------|----------|----------------|
| Solo founder | 2-3 core | 4-6 weeks | 1-week sprints |
| 2-person team | 3-5 core | 3-4 weeks | 2-week sprints |
| 3-5 person team | 5-7 core | 2-3 weeks | 2-week sprints |

Solo founder rule: no feature >5 days. If longer, break down or Buy. Reserve 20% buffer.
Include as resource_plan.

## Pivot Decision Criteria

At each 90-day checkpoint, assess evidence:

| Signal | Evidence | Decision |
|--------|----------|----------|
| OMTM trending up 3+ sprints | Quantitative growth | **Persevere** — double down |
| Retention improving cohort-over-cohort | Cohort analysis | **Persevere** — product improving |
| OMTM flat 90 days despite 3+ experiments | Plateau despite effort | **Pivot** — approach exhausted |
| Zero willingness to pay after sales attempts | Revenue experiment failed | **Pivot** — value not perceived |
| <25% PMF score after 90 days | Sean Ellis survey | **Kill** — no PMF evidence |

Output recommended_decision: persevere | pivot | kill | too_early_to_tell.
Include evidence_summary and pivot_signals.

## GTM Motion Selection

| ACV | Complexity | Motion | Key Metric |
|-----|-----------|--------|------------|
| <$1K/yr | Low (self-serve) | PLG | Activation rate, time-to-value |
| $1K-$25K/yr | Medium | Hybrid (PLG + inside sales) | PQL-to-SQL conversion |
| >$25K/yr | High (multi-stakeholder) | Sales-led | Pipeline velocity, win rate |

Pre-PMF rule: No sales team. Founder-led sales until 10 repeatable wins.
Include as gtm_motion with recommended, rationale, key_metric.`;

// ---------------------------------------------------------------------------
// Fragment registry — for diagnostics and validation
// ---------------------------------------------------------------------------
export const FRAGMENT_NAMES = ['scoring', 'composer', 'sprint', 'pitch_deck', 'crm_investor', 'research', 'competitors', 'mvp'] as const;
export type FragmentName = (typeof FRAGMENT_NAMES)[number];

export function getFragment(name: FragmentName): string {
  switch (name) {
    case 'scoring': return SCORING_FRAGMENT;
    case 'composer': return COMPOSER_FRAGMENT;
    case 'sprint': return SPRINT_FRAGMENT;
    case 'pitch_deck': return PITCH_DECK_FRAGMENT;
    case 'crm_investor': return CRM_INVESTOR_FRAGMENT;
    case 'research': return RESEARCH_FRAGMENT;
    case 'competitors': return COMPETITORS_FRAGMENT;
    case 'mvp': return MVP_FRAGMENT;
  }
}
