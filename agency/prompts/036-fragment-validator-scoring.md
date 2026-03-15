# Scoring Agent — Prompt Fragment

> Inject into the Scoring Agent system prompt to enhance dimension scoring quality.

---

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

```
RICE Score = (Reach x Impact x Confidence) / Effort
```

- **Reach** (1-10): How many aspects of the business does this action affect?
- **Impact** (0.25 / 0.5 / 1 / 2 / 3): Minimal / Low / Medium / High / Massive
- **Confidence** (0.5 / 0.8 / 1.0): Low / Medium / High — based on evidence tier
- **Effort** (1-10): Person-weeks to complete. Solo founder baseline.

After scoring all actions across all dimensions, rank them globally. Return the top 5 as `priority_actions`. Each action must include:
- `action`: What to do (imperative, specific, under 15 words)
- `rice_score`: Numeric RICE score
- `timeframe`: "1 week" | "2 weeks" | "1 month" | "3 months"
- `effort`: "Low" | "Medium" | "High"
- `dimension`: Which scored dimension this addresses

## Bias Detection

Before finalizing scores, run these bias checks:

1. **Confirmation Bias**: Does the scoring rely heavily on evidence that confirms the founder's pitch while ignoring contradictory signals? Flag if >3 dimensions use only founder-aligned evidence.
2. **Survivorship Bias**: Are comparable companies cited only because they succeeded? Check if failed competitors in the same space were considered.
3. **Anchoring Bias**: Is the TAM/SAM/SOM anchored to the founder's stated number without bottom-up validation? Flag if market sizing lacks independent calculation.
4. **Optimism Bias**: Are revenue projections or growth assumptions significantly above industry medians without justification?

If any bias is detected:
- Add a `bias_flags` array to the scoring output with `{ type, description, affected_dimensions }`.
- Do NOT silently adjust scores. Surface the bias transparently so the Composer can include warnings in the report.
