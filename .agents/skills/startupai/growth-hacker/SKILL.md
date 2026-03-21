# Growth Hacker Skill

> Domain knowledge for growth strategy, funnel optimization, and scalable user acquisition.
> Feeds into: Composer Group C (revenue/channels), AI Chat growth strategy mode, `market-research` edge function.

## AARRR Pirate Metrics Framework

Every growth strategy maps to one of these five stages. Diagnose which stage is broken before optimizing.

| Stage | Question | Key Metric | Startup Benchmark |
|-------|----------|------------|-------------------|
| **Acquisition** | How do users find us? | Visitor count, CAC by channel | Track top 3 channels only |
| **Activation** | Do they have a good first experience? | Signup-to-value time, activation rate | 60%+ within first week |
| **Retention** | Do they come back? | D7/D30/D90 retention | 40% / 20% / 10% |
| **Revenue** | Do they pay? | Conversion rate, ARPU, LTV | Free-to-paid 2-5% (SaaS) |
| **Referral** | Do they tell others? | Viral coefficient (K-factor), NPS | K > 0.3 meaningful, K > 1.0 viral |

## Growth Channel Selection

### Channel Prioritization (ICE Score)

Score each channel 1-10 on three dimensions, then rank by average:

- **Impact**: If this works, how much growth does it drive?
- **Confidence**: How sure are we this will work for our ICP?
- **Ease**: How quickly can we test this with minimal resources?

### Channel Categories by Stage

| Startup Stage | Primary Channels | Why |
|---------------|-----------------|-----|
| Pre-PMF (0-100 users) | Manual outreach, communities, founder selling | Need direct feedback loops |
| Early traction (100-1K) | Content/SEO, partnerships, referrals | Organic compounds; paid is premature |
| Growth (1K-10K) | Paid acquisition, viral loops, integrations | Unit economics validated, scale levers |
| Scale (10K+) | Brand, platform effects, channel diversification | Defend position, reduce CAC |

## Viral Loop Design

A viral loop is a closed cycle where existing users bring new users through product usage (not marketing).

**Loop structure**: User experiences value -> Shares/invites -> New user joins -> Experiences value -> Repeats

**Types of viral loops**:
1. **Inherent**: Product requires others (Slack, Figma, Zoom)
2. **Collaborative**: Sharing improves experience (Google Docs, Notion)
3. **Incentivized**: Referral rewards (Dropbox extra storage, Uber credits)
4. **Social proof**: Usage visible to others (Spotify wrapped, Strava activities)

**Viral coefficient formula**: K = invites_per_user x conversion_rate_per_invite
- K < 0.3: No meaningful virality
- K = 0.3-0.7: Amplifies other channels
- K > 1.0: Self-sustaining viral growth (rare)

## CAC / LTV Analysis

### Unit Economics Health Check

| Metric | Formula | Healthy Range | Red Flag |
|--------|---------|---------------|----------|
| CAC | Total acquisition spend / new customers | Varies by ACV | Rising faster than LTV |
| LTV | ARPU x gross margin x avg lifespan (months) | 3x+ CAC | Below 1.5x CAC |
| LTV:CAC | LTV / CAC | 3:1 to 5:1 | Below 2:1 |
| CAC Payback | CAC / (ARPU x gross margin) | < 12 months | > 18 months |
| Months to LTV:CAC 3:1 | Time for cohort to repay 3x CAC | < 18 months | > 24 months |

### CAC Reduction Tactics

1. **Improve activation**: Reducing signup-to-value friction is the highest-ROI growth lever
2. **Increase organic share**: Content, SEO, community reduce blended CAC
3. **Optimize paid channels**: Kill underperformers weekly, reallocate to top 20% of campaigns
4. **Build referral loops**: Even a K-factor of 0.2 reduces effective CAC by 20%
5. **Shorten sales cycle**: For B2B, reducing cycle time = reducing CAC (fewer touches per deal)

## Funnel Optimization

### Conversion Benchmarks (SaaS)

| Funnel Step | Benchmark | Action if Below |
|-------------|-----------|-----------------|
| Landing -> Signup | 2-5% | Improve value prop clarity, reduce form fields |
| Signup -> Activation | 20-40% | Improve onboarding, reduce time-to-value |
| Activation -> Paid | 5-15% | Fix paywall timing, demonstrate value before ask |
| Paid -> Retained (M3) | 70-85% | Improve product stickiness, add switching costs |

### Experiment Velocity

Run 10+ growth experiments per month. Structure each as:

```
Hypothesis: [Changing X] will [improve Y metric] by [Z%]
Metric: [Primary metric to measure]
Duration: [1-2 weeks minimum for statistical significance]
Sample size: [Minimum needed for confidence]
Success criteria: [Specific threshold]
```

**Winner rate target**: 30% of experiments show statistically significant positive results. If your winner rate is above 50%, your experiments are not ambitious enough.

## North Star Metric

Every startup needs one metric that captures the core value delivered to users. All growth activity ladders up to this.

| Business Type | Example North Star | Why |
|---------------|-------------------|-----|
| SaaS | Weekly active users performing core action | Measures adoption + retention |
| Marketplace | Transactions completed per week | Measures both supply + demand health |
| Content/Media | Daily engaged reading time | Measures value beyond pageviews |
| E-commerce | Repeat purchase rate within 90 days | Measures product-market fit |

## Gemini Output Schema -- ICE Channel Chips

When the Growth Strategy chat mode recommends channels, use this structured output for Gemini's `responseJsonSchema`:

```json
{
  "type": "object",
  "properties": {
    "channels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "channel": { "type": "string", "description": "Channel name (e.g., Content Marketing, LinkedIn Outreach)" },
          "impact": { "type": "integer", "minimum": 1, "maximum": 10 },
          "confidence": { "type": "integer", "minimum": 1, "maximum": 10 },
          "ease": { "type": "integer", "minimum": 1, "maximum": 10 },
          "ice_score": { "type": "number", "description": "Average of impact, confidence, ease" },
          "recommendation": { "type": "string", "description": "One-line actionable recommendation" },
          "stage_fit": { "type": "string", "enum": ["pre-pmf", "early-traction", "growth", "scale"] }
        },
        "required": ["channel", "impact", "confidence", "ease", "ice_score", "recommendation"]
      }
    },
    "aarrr_stage": {
      "type": "string",
      "enum": ["acquisition", "activation", "retention", "revenue", "referral"],
      "description": "Which AARRR stage is the weakest and should be prioritized"
    },
    "north_star_metric": {
      "type": "string",
      "description": "Recommended north star metric for this startup"
    }
  }
}
```

### ICE Chip Rendering

Frontend renders each channel as a chip with:
- Channel name (bold)
- ICE score (colored: green >=7, amber 4-6, red <4)
- One-line recommendation on hover/expand

## StartupAI Integration Points

- **Composer Group C**: Revenue model, channels, and unit economics draw from CAC/LTV analysis and channel selection frameworks above
- **AI Chat growth mode**: When founders ask about growth, reference AARRR stage diagnosis, channel ICE scoring, and experiment velocity
- **market-research EF**: Channel benchmarks and viral coefficient data inform market sizing and go-to-market sections
- **Validator scoring**: Growth dimension evaluates whether the startup has identified scalable acquisition channels with viable unit economics
