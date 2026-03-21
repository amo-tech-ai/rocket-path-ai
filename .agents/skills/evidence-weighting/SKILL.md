# Evidence Weighting Skill

> Domain knowledge for evidence tier classification, confidence calibration, and bias detection in AI-generated startup analysis.
> Feeds into: `validator-scoring-fragment.md` (evidence-weighted scoring), `validator-composer-fragment.md` (bias flag warnings), Report UI (evidence tier badges).

## StartupAI Integration

This knowledge feeds into:
- **Scoring Agent**: Weight scores by evidence quality (cited sources score higher than AI inference)
- **Composer Agent**: Bias flag warnings when report relies too heavily on AI-inferred data
- **Report UI**: Evidence tier badges (Cited/Founder/AI) on each scored dimension
- **AI Chat**: When coaching founders, distinguish "we know this" from "we're guessing"

## Evidence Tier System

### Three Tiers

| Tier | Label | Weight | Source Type | Example |
|------|-------|--------|-------------|---------|
| **Tier 1: Cited** | "Cited" | 1.0 | External source with URL, research report, government data, published benchmark | "IDC reports global SaaS spending at $232B (2025)" |
| **Tier 2: Founder** | "Founder-stated" | 0.8 | Founder's own data, customer conversations, personal experience, stated traction | "We have 47 paying customers at $99/mo" |
| **Tier 3: AI-inferred** | "AI-inferred" | 0.6 | AI estimation, analogical reasoning, market projection without primary data | "Based on competitor pricing patterns, CAC is likely $40-60" |

### Classification Rules

1. **Has a URL or named source?** -> Tier 1 (Cited)
2. **Founder explicitly stated the data?** -> Tier 2 (Founder)
3. **AI generated or estimated?** -> Tier 3 (AI-inferred)
4. **When ambiguous**: Default to the LOWER tier (conservative)
5. **Aggregated data**: Use the tier of the weakest source in the aggregation

### Weight Application

```
weighted_score = raw_score x evidence_weight

Example:
- Market size from IDC report: 8/10 x 1.0 = 8.0
- Revenue from founder claim: 7/10 x 0.8 = 5.6
- CAC from AI estimation: 7/10 x 0.6 = 4.2
```

Dimensions with mostly Tier 3 evidence should be flagged with amber warning.

## Bias Detection

### Six Bias Types to Detect

| Bias | Definition | Detection Signal | Flag Color |
|------|-----------|-----------------|------------|
| **Optimism** | Overestimating market size, growth rate, or conversion | TAM > 10x comparable companies, "everyone needs this" language | Amber |
| **Survivorship** | Only citing successful examples, ignoring failures | Competitor analysis only lists winners, no mention of failed attempts | Amber |
| **Anchoring** | Over-weighting first data point encountered | Market size unchanged from initial search despite contradictory sources | Yellow |
| **Confirmation** | Seeking data that supports the hypothesis, ignoring contradictions | All sources agree, no risk factors identified, no "however" qualifiers | Amber |
| **Recency** | Over-weighting recent trends, ignoring cycles | All trend data from last 12 months, no historical context | Yellow |
| **Availability** | Over-weighting easily found data, ignoring hard-to-find evidence | Only top Google results cited, no primary research or niche sources | Yellow |

### Bias Flag Rules

- Flag if 60%+ of a dimension's evidence is Tier 3 (AI-inferred)
- Flag if all sources agree and no contradictions are noted (confirmation bias risk)
- Flag if TAM/SAM/SOM ratios exceed industry norms by 3x+
- Flag if competitive analysis shows 0 high-threat competitors (optimism risk)
- Maximum 3 bias flags per report (prioritize by severity)

### Bias Flag Format

```json
{
  "type": "optimism",
  "dimension": "market_sizing",
  "severity": "amber",
  "message": "Market size estimate relies entirely on AI projection with no cited source",
  "recommendation": "Validate TAM with at least one analyst report or government data source"
}
```

## Confidence Calibration

### Signal Strength Levels

| Level | Label | Evidence Mix | Scoring Impact |
|-------|-------|-------------|----------------|
| **Level 4** | High confidence | 70%+ Tier 1 (Cited) | Score as-is |
| **Level 3** | Moderate confidence | Mix of Tier 1 + Tier 2 | Score as-is, note evidence quality |
| **Level 2** | Low confidence | Mostly Tier 2 (Founder-stated) | Cap dimension at 7/10 max |
| **Level 1** | Very low confidence | Mostly Tier 3 (AI-inferred) | Cap dimension at 5/10 max, flag for validation |

### Calibration Rules

- Never give a dimension 9+ if evidence is below Level 3
- If a dimension has Level 1 confidence, add it to "needs validation" list
- Report overall confidence = weighted average of dimension confidences
- Show confidence level alongside each dimension score in the report

## Gemini Output Schema

When scoring with evidence weighting, use this schema structure:

```json
{
  "dimension_name": "market_sizing",
  "raw_score": 8,
  "evidence_tier": "cited",
  "evidence_weight": 1.0,
  "weighted_score": 8.0,
  "confidence_level": 4,
  "sources": ["IDC 2025 SaaS report", "Gartner Magic Quadrant"],
  "bias_flags": []
}
```

## Implementation Checklist

- [ ] Evidence tier classification logic in scoring agent prompt
- [ ] Bias detection rules in scoring agent prompt (6 types)
- [ ] Confidence level calculation per dimension
- [ ] Evidence tier badges in report UI (3 colored pills)
- [ ] Bias flag banner in report UI (amber warning strip)
- [ ] Weighted score calculation applied to all 7/9 dimensions
- [ ] "Needs validation" list generated for Level 1 confidence dimensions
