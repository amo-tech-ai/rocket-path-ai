---
name: market-intelligence
description: "Market sizing (TAM/SAM/SOM), market analysis frameworks (Porter's, PESTLE, BCG, Value Chain, SWOT), trend prediction and timing (Bass Model, Gartner Hype Cycle, Rogers Diffusion), adoption curve positioning, market dynamics, and industry-specific approaches. Use for market opportunity assessment, trend trajectory, adoption stage, or market-entry timing (enter/wait/avoid)."
---

# Market Intelligence

> **Pipeline stage:** ResearchAgent | **Merged from:** market-research-reports, startup-trend-prediction, startup-analyst

## When to Use

- Sizing a market opportunity (TAM/SAM/SOM)
- Analyzing market structure, dynamics, or competitive forces
- Predicting trend trajectory (rising / peaking / declining)
- Determining adoption curve stage and market-entry timing (enter / wait / avoid)
- Evaluating market drivers, barriers, and risks
- Running PESTLE, Porter's Five Forces, BCG Matrix, or SWOT at the market level
- Segmenting customers or mapping value chains
- Assessing Technology Readiness Levels for a market
- Performing industry-specific market analysis (SaaS, marketplace, consumer, B2B, fintech)

**Do NOT use for:** competitive positioning / moat analysis (use competitive-strategy), financial modeling / unit economics (use financial-modeling), team planning / hiring (use financial-modeling).

---

## 1. Market Sizing Methodology

Three complementary approaches. Use at least two and cross-check results.

### 1.1 Top-Down Approach

Start from total industry size, narrow by segments, geography, and reachable share.

```
TAM = Total industry revenue (from analyst reports, government data)
SAM = TAM x % addressable by your solution (segment, geo, channel fit)
SOM = SAM x realistic capture rate (1-5% for startups, year 1-3)
```

**Sample Calculation (B2B SaaS, Construction PM):**

| Layer | Calculation | Result |
|-------|-------------|--------|
| TAM | Global construction software market | $12.4B |
| SAM | North America x project management segment (32% x 45%) | $1.78B |
| SOM | Realistic capture Year 1-3 (2%) | $35.6M |

**Common data sources:** Gartner, Forrester, IDC, Statista, IBISWorld, government census/BLS, industry associations, public company filings (10-K).

### 1.2 Bottom-Up Approach

Build from individual customer economics upward. More defensible for investors.

```
SOM = # reachable customers x avg revenue per customer x conversion rate
SAM = # total potential customers in segment x avg revenue per customer
TAM = # all possible customers globally x avg revenue per customer
```

**Sample Calculation (Vertical SaaS):**

| Layer | Calculation | Result |
|-------|-------------|--------|
| # target companies | 45,000 mid-market construction firms in NA | - |
| Avg contract value | $2,400/yr per seat x 8 seats avg | $19,200/yr |
| SAM | 45,000 x $19,200 | $864M |
| Realistic penetration Y3 | 2% of 45,000 = 900 firms | $17.3M ARR |

### 1.3 Value Theory Approach

For new market categories where no existing market data exists.

```
Market Value = # people with problem x willingness to pay x frequency
```

**Steps:**
1. Quantify the pain: hours wasted, dollars lost, opportunities missed
2. Survey or interview 20-50 target users for willingness to pay
3. Estimate frequency of purchase/usage
4. Apply conservative adoption rates

**Sample Calculation (AI Recruiting Platform):**

| Factor | Value | Source |
|--------|-------|--------|
| US companies with 50-500 employees | 98,000 | BLS |
| Avg hires/year | 12 | Industry survey |
| Cost per hire (current) | $4,700 | SHRM benchmark |
| Potential savings (30%) | $1,410/hire | Customer interviews |
| Willingness to pay (50% of savings) | $705/hire | Survey data |
| TAM | 98,000 x 12 x $705 | $829M |

### 1.4 Sizing Sanity Checks

Always validate market sizing with:

- **Comparable company revenue**: If no public company in the space exceeds $100M ARR, a $10B TAM claim needs scrutiny
- **Adjacent market benchmarks**: Similar markets in adjacent verticals
- **Bottom-up vs top-down delta**: If they differ by more than 3x, re-examine assumptions
- **Growth rate plausibility**: CAGR > 30% sustained for 10+ years is rare outside AI/biotech
- **Explicit assumptions**: Document who pays, how much, and why you can reach them

### 1.5 Market Sizing by Stage

| Stage | What Investors Expect | Depth |
|-------|----------------------|-------|
| Pre-seed | Napkin math, big vision | TAM order of magnitude |
| Seed | Bottom-up with assumptions | TAM + SAM with sources |
| Series A | Validated with customer data | Full TAM/SAM/SOM + cohort validation |

---

## 2. Market Analysis Frameworks

### 2.1 Porter's Five Forces

Rate each force **High / Medium / Low** with specific rationale.

| Force | Key Questions | Rating Criteria |
|-------|--------------|-----------------|
| **Competitive Rivalry** | How many competitors? Market growth rate? Differentiation? | High: >10 funded competitors, slow growth, low differentiation |
| **Threat of New Entrants** | Capital requirements? Regulatory barriers? Network effects? | High: Low capital, no regulation, no switching costs |
| **Bargaining Power of Suppliers** | Supplier concentration? Switching costs? Substitutes? | High: Few suppliers, high switching cost, no alternatives |
| **Bargaining Power of Buyers** | Buyer concentration? Price sensitivity? Switching costs? | High: Few large buyers, commodity product, low switching |
| **Threat of Substitutes** | Alternative solutions? Price-performance of substitutes? | High: Many alternatives, better price-performance ratio |

**Overall Market Attractiveness:**
- 0-1 forces High: Very attractive market
- 2 forces High: Moderately attractive
- 3+ forces High: Challenging market, need strong differentiation

### 2.2 PESTLE Analysis

Analyze each dimension with current trends and 1-3 year impact.

| Dimension | What to Analyze | Impact Rating |
|-----------|----------------|---------------|
| **Political** | Government policy, trade, subsidies, stability | Positive / Neutral / Negative |
| **Economic** | GDP growth, interest rates, inflation, disposable income | Positive / Neutral / Negative |
| **Social** | Demographics, attitudes, lifestyle changes, education | Positive / Neutral / Negative |
| **Technological** | Innovation rate, automation, R&D, tech adoption | Positive / Neutral / Negative |
| **Legal** | Regulation, compliance, IP protection, labor laws | Positive / Neutral / Negative |
| **Environmental** | Sustainability, carbon regulations, resource scarcity | Positive / Neutral / Negative |

### 2.3 BCG Growth-Share Matrix

Plot market segments or product lines on two axes:

```
                    HIGH Market Share    LOW Market Share
HIGH Market Growth   Stars               Question Marks
LOW Market Growth    Cash Cows           Dogs
```

| Quadrant | Strategy | Resource Allocation |
|----------|----------|-------------------|
| **Stars** | Invest to maintain leadership | High investment, high return |
| **Cash Cows** | Harvest, fund Stars | Low investment, high cash flow |
| **Question Marks** | Invest selectively or divest | High investment, uncertain return |
| **Dogs** | Divest or reposition | Minimize investment |

### 2.4 Value Chain Analysis

Map the industry value chain to identify where value is created and captured.

```
[Raw Inputs] -> [Component Makers] -> [Assembly/Platform] -> [Distribution] -> [End Customer]
     5%              15%                   35%                  25%              20%
```

**Key questions per stage:**
- Where are margins highest?
- Where is consolidation occurring?
- Where can technology disrupt?
- Where are switching costs highest?

### 2.5 SWOT (Market-Level)

Market-level SWOT focuses on the market itself, not a specific company.

| | Helpful | Harmful |
|---|---------|---------|
| **Internal (to the market)** | **Strengths**: Large buyer base, growing budgets, clear pain points | **Weaknesses**: Fragmentation, low margins, long sales cycles |
| **External** | **Opportunities**: Regulatory tailwinds, tech enablement, demographic shifts | **Threats**: Economic downturn, substitute technologies, regulatory risk |

---

## 3. Trend Analysis & Timing

### 3.1 Leading vs Lagging Indicators

Separate signal types to avoid confusing hype with real adoption.

| Signal | Type | What It Indicates | Failure Mode |
|--------|------|-------------------|--------------|
| Regulation / standards | Leading | Constraints or enabling changes | Misreading scope/timeline |
| Platform primitives | Leading | New capability baseline | Confusing announcement with adoption |
| Buyer behavior (RFPs, procurement) | Leading | Willingness to buy | Sampling bias |
| Usage / revenue metrics | Lagging | Real adoption | Too slow to catch inflection |
| Media / social mentions | Weak | Attention only | Hype amplification |

### 3.2 Signal vs Noise Framework

**Strong Signals (High Confidence):**

| Signal Type | Detection Method | Weight |
|-------------|-----------------|--------|
| VC funding patterns | Track quarterly investment | High |
| Big tech acquisitions | Monitor M&A announcements | High |
| Job posting trends | Analyze LinkedIn/Indeed data | High |
| GitHub activity | Stars, forks, contributors | High |
| Enterprise adoption | Gartner/Forrester reports | Very High |

**Moderate Signals (Validate):**

| Signal Type | Detection Method | Weight |
|-------------|-----------------|--------|
| Conference talk themes | Track KubeCon, AWS re:Invent | Medium |
| Hacker News sentiment | Algolia search trends | Medium |
| Reddit discussions | Subreddit growth, sentiment | Medium |
| Influencer adoption | Key voices tweeting about | Medium |

**Weak Signals (Monitor Only):**

| Signal Type | Detection Method | Weight |
|-------------|-----------------|--------|
| ProductHunt launches | Daily tracking | Low |
| Blog post frequency | Content analysis | Low |
| Podcast mentions | Episode scanning | Low |
| Media hype | TechCrunch, Wired articles | Low (often lagging) |

**Noise Filters -- Exclude from prediction:**
- Single viral tweet without follow-up
- PR-driven announcements without product
- Predictions from parties with financial interest
- Old data recycled as "new trend"

**Multiple signals required:** Funding + Hiring + GitHub activity = Strong signal. Just media coverage = Hype, validate further.

### 3.3 Rogers Diffusion Model

| Stage | Market Penetration | Characteristics | Strategy |
|-------|-------------------|-----------------|----------|
| **Innovators** | <2.5% | Tech enthusiasts, high risk tolerance | Enter now, shape market |
| **Early Adopters** | 2.5-16% | Visionaries, want competitive edge | Enter now, premium pricing |
| **Early Majority** | 16-50% | Pragmatists, need proof | Enter with differentiation |
| **Late Majority** | 50-84% | Conservatives, follow herd | Compete on price/features |
| **Laggards** | 84-100% | Skeptics, forced adoption | Avoid or disrupt |

### 3.4 Bass Diffusion Model (Quantitative)

Mathematical model for predicting adoption timing.

```
F(t) = [1 - e^(-(p+q)*t)] / [1 + (q/p) * e^(-(p+q)*t)]

Where:
  F(t) = Fraction of market adopted by time t
  p    = Coefficient of innovation (external influence)
  q    = Coefficient of imitation (internal/word-of-mouth)
  t    = Time since introduction
```

**Parameters by Market Type:**

| Market Type | p (innovation) | q (imitation) | Time to 50% | Interpretation |
|-------------|----------------|---------------|-------------|----------------|
| Consumer products | 0.03 | 0.38 | ~4 years | Moderate external, strong WOM |
| Viral consumer | 0.05 | 0.50 | ~3 years | Fast, word-of-mouth driven |
| B2B SaaS | 0.02 | 0.30 | ~5 years | Moderate, reference-driven |
| B2B software | 0.01 | 0.25 | ~6 years | Slow external, moderate WOM |
| Enterprise tech | 0.005 | 0.15 | ~8 years | Slow, committee decisions |

### 3.5 Gartner Hype Cycle Mapping

| Phase | Typical Duration | Startup Action |
|-------|-----------------|----------------|
| Technology Trigger | 0-2 years | Monitor, experiment, prototype |
| Peak of Inflated Expectations | 1-3 years | Caution -- don't overbuild, validate real demand |
| Trough of Disillusionment | 1-3 years | Build foundations, acquire talent cheaply |
| Slope of Enlightenment | 2-4 years | Scale proven solutions, expand distribution |
| Plateau of Productivity | 5+ years | Optimize, commoditize, defend position |

### 3.6 Hype-Cycle Defenses

Before accepting any trend as real, apply these filters:

- **Falsification**: What evidence would prove the trend is NOT real?
- **Base rates**: How often do similar trends reach mass adoption? Use reference class forecasting.
- **Adoption constraints**: Distribution channels, customer budgets, switching costs, compliance requirements, implementation complexity.

### 3.7 Cycle Pattern Library

**Technology Cycles (7-10 years):**

| Cycle | Previous Instance | Current Instance | Pattern |
|-------|------------------|------------------|---------|
| Client -> Cloud -> Edge | Desktop -> Web -> Mobile | Cloud -> Edge -> On-device | Compute moves to data |
| Monolith -> Services -> Composables | SOA -> Microservices | Microservices -> Composable workflows | Decomposition continues |
| Batch -> Stream -> Real-time | ETL -> Streaming | Streaming -> Real-time decisioning | Latency shrinks |
| Manual -> Assisted -> Automated | CLI -> GUI | Scripts -> Workflow automation | Automation increases |

**Market Cycles (5-7 years):**

| Cycle | Previous Instance | Current Instance | Pattern |
|-------|------------------|------------------|---------|
| Fragmentation -> Consolidation | 2015-2020 point solutions | 2020-2025 platforms | Bundling/unbundling |
| Horizontal -> Vertical | Horizontal SaaS | Vertical platforms | Specialization wins |
| Self-serve -> High-touch -> Hybrid | PLG pure | PLG + Sales | Motion evolves |

**Business Model Cycles (3-5 years):**

| Cycle | Previous Instance | Current Instance | Pattern |
|-------|------------------|------------------|---------|
| Perpetual -> Subscription -> Usage | License -> SaaS | SaaS -> Usage-based | Payment follows value |
| Direct -> Marketplace -> Embedded | Direct sales | Marketplace -> Embedded | Distribution evolves |

---

## 4. Adoption Curve Positioning

### 4.1 Position Identification

| Position | Penetration | Key Indicators | Strategy |
|----------|-------------|----------------|----------|
| **Innovators** | <2.5% | No established category, few funded startups, mostly R&D | Enter now, shape market, accept high risk |
| **Early Adopters** | 2.5-16% | Emerging category, 5-15 funded startups, first reference customers | Enter now, premium pricing, build brand |
| **Early Majority** | 16-50% | Clear category, 15-30 startups, first acquisitions, analyst coverage | Enter with strong differentiation |
| **Late Majority** | 50-84% | Mature category, consolidation, margin compression | Compete on price/features or niche down |
| **Laggards** | 84-100% | Commoditized, declining growth, replacement cycle | Avoid or disrupt with next-gen technology |

### 4.2 Timing Decision Framework

| Signal Pattern | Decision | Rationale |
|---------------|----------|-----------|
| 3+ strong leading indicators, <16% penetration | **Enter** | Early mover advantage, high CAC efficiency |
| Mixed signals, 2.5-16% penetration | **Enter with caution** | Validate demand before scaling |
| Strong lagging indicators only, 16-50% penetration | **Differentiate or niche** | Market proven but crowded |
| Declining signals, >50% penetration | **Avoid** | Commoditized, CAC too high |
| Strong signals but major adoption constraints | **Wait** | Monitor constraints quarterly |

### 4.3 Market Timing ROI Impact

| Entry Timing | CAC Multiplier | Market Share Potential | Typical Outcome |
|--------------|---------------|----------------------|-----------------|
| Early (Innovators) | 0.5x | High potential | High CAC efficiency, market-shaping risk |
| Optimal (Early Majority) | 1.0x (baseline) | Moderate | Proven demand, sustainable growth |
| Late (Late Majority) | 2-3x | Low | Commoditized, price competition |

**Timing ROI Formula:**
```
Timing_ROI = (Baseline_CAC / Actual_CAC) x Market_Share_Captured
```

**Example:** Enter at Early Majority (CAC = $100) vs Late Majority (CAC = $250):
- Early: $100 CAC, 15% share -> ROI factor = 1.0 x 0.15 = 0.15
- Late: $250 CAC, 5% share -> ROI factor = 0.4 x 0.05 = 0.02
- **7.5x better outcome** from optimal timing

### 4.4 Key Timing Principles

**History rhymes.** Past patterns repeat with new technology:
- Client-server -> Web apps -> Mobile -> On-device
- Mainframe -> PC -> Cloud -> Distributed
- Manual -> Scripted -> Automated -> Autonomous

**Timing beats being right.** Being right about a trend but wrong about timing = failure:
- Too early: Market not ready, burn runway
- Too late: Established players, commoditized
- Just right: Ride the wave

**Predictions are living documents:**
- Revisit quarterly
- Track accuracy over time
- Adjust for new data
- Document what changed and why

---

## 5. Market Dynamics

### 5.1 Growth Drivers & Inhibitors

**Driver categories to evaluate:**

| Category | Examples | Quantification Method |
|----------|---------|----------------------|
| Macroeconomic | GDP growth, digital transformation budgets | Government/analyst data |
| Technology | AI/ML maturity, cloud infrastructure, API economy | Platform adoption metrics |
| Regulatory | Compliance mandates, deregulation, subsidies | Legislative tracking |
| Demographic | Generational shifts, urbanization, workforce changes | Census/BLS data |
| Behavioral | Remote work, consumerization of IT, sustainability | Survey data, usage metrics |

Top 5-10 drivers should be quantified with estimated impact on market growth rate.

### 5.2 Customer Segmentation

| Segmentation Axis | Approach | Startup Relevance |
|-------------------|----------|-------------------|
| Firmographic (B2B) | Size, industry, geography, tech maturity | Target ICP definition |
| Demographic (B2C) | Age, income, location, education | Persona development |
| Behavioral | Usage patterns, buying frequency, channel preference | Product/GTM design |
| Needs-based | Pain point severity, willingness to pay, urgency | Pricing and positioning |
| Value-based | Revenue potential, cost-to-serve, expansion potential | Prioritization and unit economics |

### 5.3 Technology Readiness Levels (TRL)

| TRL | Description | Market Implication |
|-----|-------------|-------------------|
| 1-3 | Basic research, concept formulation | Too early for startups unless deep-tech |
| 4-5 | Lab validation, relevant environment testing | Deep-tech startups, grant funding |
| 6-7 | Prototype demonstration, system validation | Early-stage startups, angel/pre-seed |
| 8 | System complete and qualified | Seed-stage, first customers |
| 9 | Proven in operational environment | Series A+, scaling phase |

### 5.4 Risk Assessment (Market-Level)

**Risk Heatmap: Probability vs Impact**

| | Low Impact | Medium Impact | High Impact | Critical Impact |
|---|-----------|--------------|-------------|-----------------|
| **Very Likely** | Monitor | Mitigate | Mitigate urgently | Avoid / pivot |
| **Likely** | Accept | Monitor | Mitigate | Mitigate urgently |
| **Possible** | Accept | Accept | Monitor | Mitigate |
| **Unlikely** | Accept | Accept | Accept | Monitor |

**Risk categories to evaluate:**
- Market risk: Demand fails to materialize, market contracts
- Competitive risk: Incumbent response, new entrant flooding
- Regulatory risk: Unfavorable regulation, compliance cost
- Technology risk: Platform dependency, tech obsolescence
- Execution risk: Talent scarcity, channel access
- Financial risk: Funding environment, customer budget cuts

---

## 6. Data Sources & Validation

### 6.1 Primary Data Sources

| Source Type | Examples | Best For |
|-------------|---------|----------|
| Government data | BLS, Census, SEC filings, BEA | Market size baselines, industry structure |
| Analyst reports | Gartner, Forrester, IDC, McKinsey | Market forecasts, vendor landscapes |
| Industry associations | Trade groups, standards bodies | Segment data, regulatory outlook |
| Public company filings | 10-K, 10-Q, S-1, earnings calls | Revenue benchmarks, growth rates |
| Platform data | App stores, GitHub, npm, cloud marketplaces | Adoption metrics, developer trends |
| Job market data | LinkedIn, Indeed, Glassdoor | Demand signals, salary benchmarks |
| Survey/interview data | Customer discovery, willingness-to-pay studies | Bottom-up sizing, needs validation |

### 6.2 Data Quality Requirements

- **Currency**: Data no older than 2 years (prefer current year)
- **Sourcing**: All statistics attributed to specific sources with dates
- **Validation**: Cross-reference 2+ independent sources for key claims
- **Assumptions**: All projections state underlying assumptions explicitly
- **Limitations**: Acknowledge data gaps and uncertainty ranges

### 6.3 Reference Class Forecasting (Outside View)

Use historical analogs to calibrate predictions and avoid overconfidence.

| Item | What to Document |
|------|-----------------|
| Milestone | e.g., 10% enterprise adoption, $100M ARR category, regulatory clearance |
| Analog set | List 5-10 similar past trends (same buyer, budget, compliance, distribution) |
| Base rate | x/y analogs reached milestone within your horizon |
| Timing range | p10 / p50 / p90 estimates |
| Adjustment factors | What differs now vs analogs: distribution, budgets, compliance, infrastructure |

### 6.4 Hype-Cycle Defenses Checklist

Before committing to a trend thesis:

- [ ] Falsification criteria documented: what would disprove this trend?
- [ ] Base rate checked: how often do analogous trends succeed?
- [ ] Adoption constraints listed: distribution, budget, switching costs, compliance, implementation complexity
- [ ] Leading indicators identified (not just lagging/media)
- [ ] 3+ independent signal types confirm the trend
- [ ] At least 1 primary source (regulators, standards bodies, platform docs, filings)
- [ ] Assumptions are explicit and time-bound
- [ ] Review cadence set (quarterly recommended)

---

## 7. Industry-Specific Approaches

### 7.1 SaaS

**Key metrics to size and analyze:**
- MRR/ARR, Net Dollar Retention (NDR), CAC payback period
- Logo churn vs revenue churn
- ACV distribution: SMB $1-10K, Mid-market $10-100K, Enterprise $100K+

**Market sizing approach:**
```
SAM = # companies in ICP x avg seats x price/seat/year
```

**Benchmarks by stage:**

| Metric | Seed | Series A | Series B |
|--------|------|----------|----------|
| ARR | $0-1M | $1-5M | $5-20M |
| MoM growth | 15-20% | 10-15% | 7-10% |
| NDR | >100% | >110% | >120% |
| CAC payback | <18 mo | <15 mo | <12 mo |
| Gross margin | >70% | >75% | >80% |

**SaaS-specific market signals:**
- Category creation on G2/Capterra
- Gartner Magic Quadrant appearance
- Enterprise pilot programs

### 7.2 Marketplace

**Key metrics to size and analyze:**
- GMV, take rate, liquidity, supply/demand balance
- Typical take rates: 5-15% (goods), 15-30% (services), 20-40% (managed)

**Market sizing approach:**
```
TAM = Total spend in category (both sides)
SAM = Addressable spend that can flow through marketplace
SOM = SAM x realistic take rate x penetration
```

**Marketplace-specific dynamics:**
- Chicken-and-egg: Which side to seed first?
- Multi-homing risk: Can users easily use competitors simultaneously?
- Geographic density requirements for local marketplaces
- Disintermediation risk: Will users go direct after matching?

### 7.3 Consumer

**Key metrics to size and analyze:**
- DAU/MAU ratio, retention curves (D1/D7/D30), virality coefficient (K-factor)
- ARPU, conversion rate (free to paid), engagement depth

**Market sizing approach:**
```
TAM = # people with problem x frequency x willingness to pay
SAM = TAM x smartphone/internet penetration x demographic filter
SOM = SAM x realistic download/signup rate x activation rate
```

**Consumer-specific signals:**
- App store ranking trends
- Social media organic mentions (not sponsored)
- Influencer adoption without sponsorship
- Retention curve shape: concave = good, convex = churning

### 7.4 B2B (Non-SaaS)

**Key metrics to size and analyze:**
- ACV, sales cycle length, win rate, pipeline velocity
- Typical sales cycles: SMB 1-3 months, Mid-market 3-6 months, Enterprise 6-18 months

**Market sizing approach:**
```
SAM = # companies in target segment x avg deal size
SOM = SAM x realistic win rate x sales capacity
```

**B2B-specific dynamics:**
- Champion/economic buyer alignment
- Procurement process complexity
- Implementation/integration requirements
- Reference customer importance

### 7.5 Fintech

**Key metrics to size and analyze:**
- Transaction volume, revenue per transaction, regulatory cost
- Net interest margin (lending), AUM growth (wealth), loss ratios (insurance)

**Market sizing approach:**
```
TAM = Total financial flows in category
SAM = Flows addressable by your license/geography/segment
SOM = SAM x realistic capture rate (often <1% in Year 1)
```

**Fintech-specific considerations:**
- Regulatory licensing requirements and timeline (6-24 months)
- Compliance cost as % of revenue (often 15-25% early stage)
- Partnership vs direct licensing trade-offs
- Embedded finance as distribution channel
- Trust and security as adoption barriers

---

## 8. Prediction Methodology

### 8.1 Building a Trend View

**Step 1: Define the Decision**
- What decision: enter / wait / avoid?
- Horizon: 1-2 years (standard for startups)
- Target buyer and market segment

**Step 2: Collect Signals**
- Gather 3+ independent signals including at least 1 primary source
- Separate leading vs lagging indicators (see section 3.1)
- Apply signal weights (see section 3.2)

**Step 3: Apply Hype-Cycle Defenses**
- Document falsification criteria
- Check base rates via reference class forecasting
- List adoption constraints with severity

**Step 4: Position on Adoption Curve**
- Map current penetration to Rogers model (section 3.3)
- Estimate timing via Bass model parameters (section 3.4)
- Cross-reference with Gartner Hype Cycle phase (section 3.5)

**Step 5: Generate Prediction**

```
## Prediction: [TOPIC]

Thesis: [1-2 sentence prediction]
Confidence: High / Medium / Low
Timing: [When this will happen]
Evidence: [3-5 supporting data points]
Counter-evidence: [What could invalidate]
Decision: Enter / Wait / Avoid
Review cadence: Quarterly
```

**Step 6: Identify Opportunities**

| Opportunity | Timing Window | Competition | Constraints | Action |
|-------------|---------------|-------------|-------------|--------|
| [Opp 1] | [Window] | Low/Med/High | [Key blockers] | Build/Watch/Avoid |

### 8.2 Trend Awareness Protocol

When analyzing market trends or timing, use current data:

1. Search for `"[technology/market] trends [current year]"`
2. Search for `"[technology] adoption curve [current year]"`
3. Search for `"[market] market size forecast [current year]"`
4. Search for `"[technology] vs alternatives [current year]"`

**Report after searching:**
- **Current state**: Where is the technology/market NOW on adoption curve
- **Trajectory**: Growing, peaking, or declining based on data
- **Timing window**: Is now early, optimal, or late to enter
- **Evidence quality**: Distinguish hype from real adoption signals

### 8.3 What Good Looks Like

A complete market intelligence analysis includes:

- **Decision**: One clear enter/wait/avoid call with horizon and owner
- **Evidence**: 3+ independent signal types (not just media) with explicit confidence
- **Market size**: TAM/SAM/SOM with assumptions, both bottom-up and top-down cross-checked
- **Sensitivity ranges**: Optimistic/base/pessimistic scenarios
- **Falsification criteria**: Documented and reviewable
- **Constraints**: Adoption blockers listed with mitigations
- **Capital efficiency**: Break-even path documented (2026 investor priority)
- **Cadence**: Quarterly refresh with "what changed" and accuracy notes

---

## 9. Quality Standards

### Analysis Requirements

- Use credible, cited data sources with publication dates
- Document all assumptions clearly and explicitly
- Provide realistic, conservative estimates (not optimistic)
- Validate with multiple methods when possible (bottom-up + top-down)
- Include relevant industry benchmarks
- Present findings in structured tables and frameworks
- Offer actionable recommendations tied to decisions
- Acknowledge limitations, risks, and data gaps

### Common Pitfalls to Avoid

- Treating "attention" (media/social) as "adoption" (revenue/usage)
- Market sizing without explicit assumptions and bottom-up checks
- Extrapolating from a single platform, influencer, or funding headline
- Using overly optimistic penetration rates (>5% Year 1 for most startups)
- Ignoring adoption constraints (distribution, budget, switching, compliance)
- Conflating TAM with SAM -- investors see through this immediately
- Presenting a single point estimate without ranges or scenarios
- Making unsupported claims or skipping validation steps
- Providing generic advice without stage and industry context

### Stage Awareness

- **Pre-seed**: Focus on product-market fit signals, not revenue optimization
- **Seed**: Balance growth and efficiency, establish unit economics baseline
- **Series A**: Prove scalable, repeatable model with strong unit economics

### Investor Expectations by Round

| Investor Type | Focus Areas |
|--------------|-------------|
| Angels | Team, vision, early traction |
| Seed VCs | Product-market fit signals, market size, founding team |
| Series A VCs | Proven unit economics, growth rate, efficiency metrics |
| Corporate VCs | Strategic fit, partnership potential, technology |

---

## 10. Behavioral Traits & Response Methodology

### 10.1 Analyst Behavioral Traits

When performing market intelligence work, activate these traits:

- **Startup-focused:** Understand early-stage constraints and realities (budget, team size, time pressure)
- **Data-driven:** Always ground recommendations in data and benchmarks
- **Conservative:** Use realistic, defensible assumptions -- not optimistic projections
- **Pragmatic:** Balance rigor with speed and resource constraints
- **Transparent:** Document assumptions and limitations clearly
- **Founder-friendly:** Communicate in plain language, not jargon
- **Action-oriented:** Provide specific next steps and recommendations
- **Investor-aware:** Understand what VCs look for in each analysis at each stage
- **Rigorous:** Validate assumptions and triangulate findings from 2+ sources
- **Honest:** Acknowledge risks, data gaps, and limitations upfront

### 10.2 10-Step Response Methodology

When answering market intelligence questions, follow this sequence:

1. **Understand context** -- Company stage, business model, specific question, decision to be made
2. **Activate relevant section** -- Reference the appropriate framework section from this skill
3. **Gather necessary data** -- Use web search when current data is needed; cite sources with dates
4. **Apply frameworks** -- Use proven methodologies (Porter's, PESTLE, Bass, Rogers, etc.)
5. **Calculate and analyze** -- Show work, document assumptions, include formulas
6. **Validate findings** -- Cross-check with benchmarks, alternatives, and bottom-up vs top-down
7. **Present clearly** -- Use tables, structured output, clear section headers
8. **Provide recommendations** -- Actionable next steps with rationale
9. **Cite sources** -- Always include data sources and publication dates
10. **Acknowledge limitations** -- Be transparent about assumptions, data quality, and confidence level

### 10.3 Output Format Guidance

**For Market Sizing Analysis:**
- Clear headers and subheaders
- Tables for data presentation
- Formulas shown explicitly with step-by-step calculation
- Sources cited with URLs and dates
- Assumptions documented in a dedicated section
- Benchmarks referenced for comparison
- Next steps provided

**For Calculations:**
- Formula used
- Input values with sources
- Step-by-step calculation
- Result with units
- Interpretation of result
- Benchmark comparison

**For Recommendations:**
- Specific, actionable steps
- Rationale for each recommendation
- Expected outcomes
- Resource requirements
- Timeline or sequencing
- Risks and mitigation

### 10.4 Example Interactions

**Market Sizing:**
- "What's the TAM for a B2B SaaS project management tool for construction companies?"
- "Calculate the addressable market for an AI-powered recruiting platform"
- "Help me size the opportunity for a marketplace connecting freelance designers with startups"

**Trend Analysis:**
- "Is the AI agent market rising, peaking, or declining?"
- "When should we enter the vertical SaaS market for logistics?"
- "What adoption stage is the climate tech sector in right now?"

**Competitive Landscape:**
- "Analyze the competitive landscape for email marketing automation"
- "How should we position against Salesforce in the construction vertical?"
- "What are the barriers to entry in the fintech lending space?"

**Market Timing:**
- "Should we enter the AI coding tools market now or wait?"
- "Is the developer tools market too crowded for a new entrant?"
- "What's the timing window for embedded finance in healthcare?"

**Metrics & Benchmarks:**
- "What metrics should I track for my marketplace startup?"
- "Is my CAC of $2,500 and LTV of $8,000 good for enterprise SaaS?"
- "What growth rate do Series A investors expect for B2B SaaS?"

**Strategy:**
- "Should I target SMBs or enterprise customers first?"
- "How do I decide between freemium and sales-led go-to-market?"
- "What pricing strategy makes sense for my stage?"

### 10.5 Special Considerations

**Founder Context:**
- First-time founders need more education and framework explanation
- Repeat founders want faster, more tactical analysis
- Technical founders may need GTM and business model guidance
- Business founders may need product and technical strategy help

**Industry Nuances:**
- SaaS: Focus on MRR, NDR, CAC payback
- Marketplace: Emphasize GMV, take rate, liquidity
- Consumer: Prioritize retention, virality, engagement
- B2B: Highlight ACV, sales efficiency, win rate
- Fintech: Regulatory licensing, compliance cost, trust barriers

---

## 11. Do / Avoid Checklist

### Do

- Use a decision horizon (enter / wait / avoid) and revisit quarterly
- Track leading indicators and adoption constraints, not just hype
- Write assumptions explicitly and update them when data changes
- Require 3+ independent signals, including at least 1 primary source (standards, regulators, platform docs)
- Separate leading vs lagging indicators; don't overfit to social/media noise
- Add hype-cycle defenses: falsification, base rates, and adoption constraints
- Cross-check bottom-up and top-down market sizing (flag if delta > 3x)
- Document confidence levels explicitly (strong / medium / weak)
- Include sensitivity ranges (optimistic / base / pessimistic scenarios)
- Set a quarterly review cadence with "what changed" and accuracy notes

### Avoid

- Extrapolating from a single platform, influencer, or funding headline
- Treating "attention" (media/social mentions) as "adoption" (revenue/usage)
- Market sizing without explicit assumptions and bottom-up checks
- Using overly optimistic penetration rates (> 5% Year 1 for most startups)
- Conflating TAM with SAM -- investors see through this immediately
- Ignoring adoption constraints (distribution, budget, switching, compliance)
- Presenting a single point estimate without ranges or scenarios
- Making unsupported claims or skipping validation steps
- Providing generic advice without stage and industry context
- Forgetting to cite data sources with publication dates

---

## 12. Quick Reference Templates

### 12.1 Trend View Template

Use this template to quickly structure a trend analysis:

```
## Decision Context

- Decision: enter / wait / avoid
- Horizon: {{HORIZON}}
- Buyer and market: {{BUYER}} / {{MARKET}}

## Signals Collected

| Signal | Type | What it indicates | Source | Confidence |
|--------|------|-------------------|--------|------------|
| {{SIGNAL_1}} | Leading / Lagging / Weak | {{INDICATION}} | {{SOURCE}} | High / Med / Low |
| {{SIGNAL_2}} | | | | |
| {{SIGNAL_3}} | | | | |

## Hype-Cycle Defenses

- Falsification: {{WHAT_WOULD_DISPROVE_THIS}}
- Base rate: {{HOW_OFTEN_DO_SIMILAR_TRENDS_SUCCEED}}
- Adoption constraints: {{DISTRIBUTION, BUDGET, SWITCHING, COMPLIANCE}}

## Market Sizing Sanity Check

- Bottom-up: #customers x WTP x realistic penetration = {{RESULT}}
- Top-down: Total market x segment % x capture rate = {{RESULT}}
- Delta: {{RATIO}} (flag if > 3x)
```

### 12.2 Reference Class Forecasting Template

Use historical analogs to calibrate predictions and avoid overconfidence.

```
## Reference Class Forecast: {{TOPIC}}

| Item | Notes |
|------|-------|
| Milestone | {{e.g., 10% enterprise adoption, $100M ARR category, regulatory clearance}} |
| Analog set | {{List 5-10 similar past trends (same buyer, budget, compliance, distribution)}} |
| Base rate | {{x/y analogs reached milestone within horizon}} |
| Timing range | p10: {{FAST}} / p50: {{MEDIAN}} / p90: {{SLOW}} |
| Adjustment factors | {{What differs now vs analogs: distribution, budgets, compliance, infra}} |
| Net assessment | {{Higher / Lower / Same probability as base rate, and why}} |
```

### 12.3 Prediction Template

```
## Prediction: {{TOPIC}}

Domain: {{Technology / Market / Business Model}}
Lookback Period: {{2-3 years}}
Prediction Horizon: {{1-2 years}}
Geography: {{Global / Region-specific}}
Industry: {{Horizontal / Specific vertical}}

Thesis: {{1-2 sentence prediction}}
Confidence: High / Medium / Low
Timing: {{When this will happen}}
Evidence:
  1. {{Supporting data point 1}}
  2. {{Supporting data point 2}}
  3. {{Supporting data point 3}}
Counter-evidence: {{What could invalidate this prediction}}
Decision: Enter / Wait / Avoid
Review cadence: Quarterly
Next review: {{DATE}}
```

### 12.4 Opportunity Matrix Template

```
| Opportunity | Timing Window | Competition | Constraints | Action |
|-------------|---------------|-------------|-------------|--------|
| {{OPP_1}} | {{WINDOW}} | Low/Med/High | {{Key blockers}} | Build / Watch / Avoid |
| {{OPP_2}} | {{WINDOW}} | Low/Med/High | {{Key blockers}} | Build / Watch / Avoid |
| {{OPP_3}} | {{WINDOW}} | Low/Med/High | {{Key blockers}} | Build / Watch / Avoid |
```

---

## 13. Deep Research Report Framework

> Absorbed from the market-research-reports skill. Use this section when producing comprehensive, consulting-firm-quality market research reports (50+ pages).

### 13.1 Report Structure (11 Core Chapters)

**Front Matter (~5 pages)**

| Section | Pages | Content |
|---------|-------|---------|
| Cover Page | 1 | Report title, subtitle, hero visual, date, classification, prepared for/by |
| Table of Contents | 1-2 | Auto-generated, List of Figures, List of Tables |
| Executive Summary | 2-3 | Market Snapshot Box, Investment Thesis (3-5 bullets), Key Findings, Top 3-5 Recommendations, Infographic |

**Core Analysis (~35 pages)**

| Chapter | Pages | Required Visuals | Key Content |
|---------|-------|-----------------|-------------|
| Ch 1: Market Overview & Definition | 4-5 | Ecosystem/value chain diagram, industry structure diagram | Market definition, scope, stakeholders, boundaries, historical context |
| Ch 2: Market Size & Growth | 6-8 | Growth trajectory, TAM/SAM/SOM, regional breakdown, segment growth | TAM/SAM/SOM, historical growth (5-10yr), projections (5-10yr), drivers/inhibitors |
| Ch 3: Industry Drivers & Trends | 5-6 | Trends timeline/radar, driver impact matrix, PESTLE diagram | Macro, tech, regulatory, social, environmental factors |
| Ch 4: Competitive Landscape | 6-8 | Porter's Five Forces, market share, positioning matrix, strategic groups | Structure, player profiles, share, barriers, dynamics |
| Ch 5: Customer Analysis & Segmentation | 4-5 | Segmentation breakdown, attractiveness matrix, journey/value prop | Segment definitions, buying behavior, needs, decision process |
| Ch 6: Technology & Innovation | 4-5 | Technology roadmap, adoption/hype cycle | Current stack, emerging tech, R&D, patents |
| Ch 7: Regulatory & Policy | 3-4 | Regulatory timeline/framework | Current framework, bodies, compliance, upcoming changes |
| Ch 8: Risk Analysis | 3-4 | Risk heatmap, mitigation matrix | Market/competitive/regulatory/tech/operational/financial risks |

**Strategic Recommendations (~10 pages)**

| Chapter | Pages | Required Visuals | Key Content |
|---------|-------|-----------------|-------------|
| Ch 9: Strategic Opportunities | 4-5 | Opportunity matrix, strategic options, priority matrix | Opportunity sizing, options analysis, prioritization, success factors |
| Ch 10: Implementation Roadmap | 3-4 | Timeline/Gantt, milestone tracker | Phased plan, milestones, resources, dependencies, governance |
| Ch 11: Investment Thesis & Financials | 3-4 | Financial projections, scenario analysis | Investment summary, projections, scenarios, ROI/IRR, sensitivity |

**Back Matter (~5 pages)**

| Section | Pages | Content |
|---------|-------|---------|
| Appendix A: Methodology | 1-2 | Research methodology, data collection, sources, limitations |
| Appendix B: Data Tables | 2-3 | Comprehensive market data, regional breakdowns, historical series |
| Appendix C: Company Profiles | 1-2 | Key competitor profiles, financial highlights, strategic focus |
| References/Bibliography | 1 | All sources cited (BibTeX format for LaTeX) |

### 13.2 Page Count Targets

| Section | Minimum Pages | Target Pages |
|---------|---------------|--------------|
| Front Matter | 4 | 5 |
| Market Overview | 4 | 5 |
| Market Size & Growth | 5 | 7 |
| Industry Drivers | 4 | 6 |
| Competitive Landscape | 5 | 7 |
| Customer Analysis | 3 | 5 |
| Technology Landscape | 3 | 5 |
| Regulatory Environment | 2 | 4 |
| Risk Analysis | 2 | 4 |
| Strategic Recommendations | 3 | 5 |
| Implementation Roadmap | 2 | 4 |
| Investment Thesis | 2 | 4 |
| Back Matter | 4 | 5 |
| **TOTAL** | **43** | **66** |

### 13.3 Visual Generation Requirements

Every report should generate **6 essential visuals** at the start (priority), with additional visuals added per-section as needed.

**Priority Visuals (Generate First):**

| # | Visual | Tool | Section |
|---|--------|------|---------|
| 1 | Market growth trajectory chart | scientific-schematics | Ch 2 |
| 2 | TAM/SAM/SOM concentric circles | scientific-schematics | Ch 2 |
| 3 | Porter's Five Forces diagram | scientific-schematics | Ch 4 |
| 4 | Competitive positioning matrix | scientific-schematics | Ch 4 |
| 5 | Risk heatmap | scientific-schematics | Ch 8 |
| 6 | Executive summary infographic | generate-image | Exec Summary |

**Additional Visuals by Section:**

| Section | Visuals to Generate as Needed |
|---------|-------------------------------|
| Ch 1 | Market ecosystem diagram, industry structure |
| Ch 2 | Regional breakdown, segment growth comparison |
| Ch 3 | Trends timeline/radar, driver impact matrix, PESTLE diagram |
| Ch 4 | Market share chart, strategic group map |
| Ch 5 | Customer segmentation, attractiveness matrix, journey diagram |
| Ch 6 | Technology roadmap, adoption/hype cycle |
| Ch 7 | Regulatory timeline |
| Ch 9 | Opportunity matrix, strategic options, priority framework |
| Ch 10 | Implementation Gantt, milestone tracker |
| Ch 11 | Financial projections, scenario comparison |

**Visual Quality Standards:**
- Resolution: 300 DPI minimum
- Format: PNG for raster, PDF for vector
- Accessibility: Colorblind-friendly palettes
- Consistency: Same color scheme throughout the report
- Labeling: All axes, legends, and data points labeled
- Source attribution: Sources cited in figure captions

### 13.4 Five-Phase Deep Research Workflow

**Phase 1: Research & Data Gathering**

1. **Define Scope** -- Clarify market definition, geographic boundaries, time horizon, key questions
2. **Conduct Deep Research** -- Use research-lookup extensively for market size, competitive landscape, trends, regulatory environment
3. **Organize Data** -- Create sources folder, organize by section, identify data gaps, conduct follow-up research

**Phase 2: Analysis & Framework Application**

4. **Apply Frameworks** -- TAM/SAM/SOM, Porter's Five Forces, PESTLE, SWOT, Competitive Positioning (use sections 1-5 of this skill)
5. **Develop Insights** -- Synthesize findings, identify strategic implications, develop recommendations, prioritize opportunities

**Phase 3: Visual Generation**

6. **Generate All Visuals** -- Generate 6 priority visuals before writing; add section-specific visuals during writing

**Phase 4: Report Writing**

7. **Initialize Project Structure** -- Create output directory with progress.md, drafts/, references/, figures/, sources/, final/
8. **Write Report** -- Write each chapter following the structure guide; ensure comprehensive coverage, data-driven content, visual integration, professional tone

**Phase 5: Compilation & Review**

9. **Compile** -- LaTeX compilation (xelatex + bibtex, three passes)
10. **Quality Review** -- Verify against the completeness checklist (section 13.5)
11. **Peer Review** -- Assess comprehensiveness, data accuracy, logical flow, recommendation quality

### 13.5 LaTeX Box Environments

Use colored boxes to highlight key content in LaTeX reports:

```latex
% Key insight box (blue)
\begin{keyinsightbox}[Key Finding]
The market is projected to grow at 15.3% CAGR through 2030.
\end{keyinsightbox}

% Market data box (green)
\begin{marketdatabox}[Market Snapshot]
\begin{itemize}
    \item Market Size (2024): \$45.2B
    \item Projected Size (2030): \$98.7B
    \item CAGR: 15.3%
\end{itemize}
\end{marketdatabox}

% Risk box (orange/warning)
\begin{riskbox}[Critical Risk]
Regulatory changes could impact 40% of market participants.
\end{riskbox}

% Recommendation box (purple)
\begin{recommendationbox}[Strategic Recommendation]
Prioritize market entry in the Asia-Pacific region.
\end{recommendationbox}

% Callout box (gray)
\begin{calloutbox}[Definition]
TAM (Total Addressable Market) represents the total revenue opportunity.
\end{calloutbox}
```

### 13.6 Report Completeness Checklist

**Structure Completeness:**
- [ ] Cover page with hero visual
- [ ] Table of contents (auto-generated)
- [ ] List of figures and tables (auto-generated)
- [ ] Executive summary (2-3 pages)
- [ ] All 11 core chapters present
- [ ] Appendix A: Methodology
- [ ] Appendix B: Data tables
- [ ] Appendix C: Company profiles
- [ ] References/Bibliography

**Visual Completeness (Core 6):**
- [ ] Market growth trajectory chart
- [ ] TAM/SAM/SOM diagram
- [ ] Porter's Five Forces
- [ ] Competitive positioning matrix
- [ ] Risk heatmap
- [ ] Executive summary infographic

**Content Quality:**
- [ ] All statistics have sources with dates
- [ ] Projections include underlying assumptions
- [ ] Frameworks properly applied with ratings/rationale
- [ ] Recommendations are actionable and prioritized
- [ ] Writing is professional, consulting-firm quality
- [ ] No placeholder or incomplete sections

**Technical Quality:**
- [ ] PDF compiles without errors
- [ ] All figures render correctly
- [ ] Cross-references work
- [ ] Bibliography complete
- [ ] Page count exceeds 50

---

## 14. Integration Points

### Feeds Into
- Validator pipeline ResearchAgent: market size, trends, timing scores
- Competitive strategy skill: market structure context
- Financial modeling skill: market size inputs for revenue projections
- Product management: roadmap prioritization via trend timing
- Startup idea validation: market timing score
- Router startup: trend context for analysis routing

### Receives From
- Review mining: pain point trends over time
- Competitive analysis: competitor movement patterns
- Customer discovery: bottom-up sizing validation
