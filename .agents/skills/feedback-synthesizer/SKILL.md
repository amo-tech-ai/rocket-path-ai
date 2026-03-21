# Feedback Synthesizer

> Multi-channel feedback collection, analysis, and synthesis into actionable product insights.

## StartupAI Integration

This knowledge feeds into:
- **Scoring Agent**: Evidence-weighted risk assessment using real user feedback signals
- **AI Chat**: Feedback analysis mode for founders reviewing customer conversations
- **Validator Pipeline**: Customer evidence tier classification in problem_clarity extraction
- **Dashboard**: Feedback-derived health score dimensions (customer satisfaction, churn signals)

## Collection Strategy

### Channel Types
- **Proactive**: In-app surveys, email campaigns, user interviews, beta feedback programs
- **Reactive**: Support tickets, app store reviews, social media mentions, community forums
- **Passive**: Usage analytics, session recordings, heatmaps, feature adoption rates
- **Competitive**: Review site mining, competitor social monitoring, industry analyst reports

### Collection Rules
- Define collection cadence per channel (daily for reactive, weekly for proactive)
- Tag every feedback item with: source, user segment, product area, timestamp
- Preserve verbatim quotes — they carry more weight than analyst summaries
- Track response rates per channel to optimize collection effort

## Processing Pipeline

### 1. Ingestion
- Automated pull from APIs (support tools, review platforms, social listeners)
- Manual import for interview transcripts and survey exports
- Deduplication across channels (same user, same issue, different channels)

### 2. Cleaning and Normalization
- Strip PII while preserving segment metadata
- Standardize terminology (e.g., "crashes" / "freezes" / "hangs" = stability issue)
- Quality score each item: specificity (1-5), actionability (1-5), evidence strength (1-5)

### 3. Sentiment Analysis
- Classify: positive / negative / neutral / mixed
- Detect emotion intensity: frustration, delight, confusion, urgency
- Flag satisfaction score shifts (NPS drops, CSAT trend changes)

### 4. Categorization
- Theme tagging: feature requests, bugs, UX friction, pricing, onboarding, performance
- Priority classification: critical (blocking users), high (frequent pain), medium, low
- Impact assessment: number of users affected, revenue impact, churn correlation

### 5. Quality Assurance
- Manual review of automated categorization (sample 10-20%)
- Bias check: are certain user segments over/under-represented?
- Stakeholder validation: do product owners agree with theme groupings?

## Thematic Analysis Methods

### Pattern Identification
- Cluster feedback by theme across all sources
- Weight by frequency (how many users), severity (how painful), and trend (growing or stable)
- Cross-reference themes with usage data: do users who complain about X also show behavior Y?

### Priority Scoring (RICE Framework)
- **Reach**: How many users does this affect per quarter?
- **Impact**: How much does fixing this improve satisfaction? (1-3 scale)
- **Confidence**: How strong is the evidence? (low/medium/high based on source diversity)
- **Effort**: Engineering estimate to address (weeks)
- Score = (Reach x Impact x Confidence) / Effort

### Kano Model Classification
- **Must-be**: Expected features whose absence causes dissatisfaction (bugs, reliability)
- **One-dimensional**: Features where satisfaction scales linearly with investment (performance, UX)
- **Attractive**: Unexpected features that delight (AI suggestions, smart defaults)
- Use this to balance roadmap between fixing pain and creating delight

## Delivery Formats

### Executive Dashboard
- Real-time sentiment trend (rolling 30 days)
- Top 5 themes by RICE score with confidence intervals
- Customer satisfaction KPIs: NPS, CSAT, CES with benchmarks
- Early warning: themes growing >20% week-over-week

### Product Team Report
- Feature request analysis with user stories and acceptance criteria
- User journey pain points with specific improvement recommendations
- A/B test hypotheses generated from feedback themes
- Development priority recommendations with supporting evidence

### Churn Prevention Signals
- Feedback patterns that precede churn (3+ negative tickets, feature request abandonment)
- At-risk segment identification with intervention recommendations
- Proactive outreach triggers for customer success teams

## Continuous Improvement
- Track which feedback-driven changes actually improved satisfaction scores
- Measure prediction accuracy: did prioritized themes match actual impact?
- Optimize collection channels: retire low-signal channels, invest in high-signal ones
- Reduce time from feedback collection to product decision (<2 weeks target)

## Canvas Box Feedback Mapping

When the Canvas Coach synthesizes feedback for lean canvas improvements, map feedback categories to canvas boxes:

| Canvas Box | Feedback Sources | What to Surface |
|-----------|-----------------|-----------------|
| **Problem** | Support tickets, churn reasons, user complaints | Top 3 pain points by frequency |
| **Customer Segments** | User demographics, usage patterns, segment analysis | ICP characteristics, underserved segments |
| **Unique Value Prop** | App store reviews, NPS verbatims, testimonials | What users say they love (verbatim) |
| **Solution** | Feature requests, usage analytics, session recordings | Most-used features, requested features |
| **Channels** | Acquisition source data, referral tracking | Top performing channels, untapped channels |
| **Revenue Streams** | Billing data, pricing feedback, willingness-to-pay surveys | Pricing sentiment, expansion revenue signals |
| **Cost Structure** | Burn rate data, vendor costs, infrastructure usage | Cost drivers, optimization opportunities |
| **Key Metrics** | Analytics dashboards, cohort analysis | Trends (improving/declining), benchmark gaps |
| **Unfair Advantage** | Competitive analysis, moat indicators | Defensibility signals, competitive gaps |

### Synthesis Output Format

```json
{
  "box_name": "problem",
  "confidence": "high",
  "themes": [
    { "theme": "Time wasted on manual validation", "frequency": 23, "sentiment": "negative" },
    { "theme": "Lack of market data access", "frequency": 15, "sentiment": "negative" }
  ],
  "strength": "strong" | "moderate" | "weak",
  "gap_indicator": "Problem well-validated by user feedback" | "Problem lacks direct user evidence"
}
```
