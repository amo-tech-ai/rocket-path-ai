# Deterministic Scoring Formula

The validator pipeline uses a two-stage scoring approach:
1. **LLM stage:** Gemini evaluates qualitative dimensions and provides raw scores
2. **Deterministic stage:** `scoring-math.ts` computes final numbers from raw scores

This ensures the same raw scores always produce the same final result.

## Weighted Average Formula

```
overall_score = round(clamp(sum(dimension_score[i] * weight[i] / 100) + bias_correction, 0, 100))
```

### Dimension Weights (100% total)

| Dimension | Key | Weight |
|---|---|---:|
| Problem Clarity | `problemClarity` | 15% |
| Solution Strength | `solutionStrength` | 15% |
| Market Size | `marketSize` | 15% |
| Competition | `competition` | 10% |
| Business Model | `businessModel` | 15% |
| Team Fit | `teamFit` | 15% |
| Timing | `timing` | 15% |

Source: `DIMENSION_CONFIG` in `src/types/validation-report.ts`

## Verdict Thresholds

| Score Range | Verdict | Meaning |
|---|---|---|
| 75-100 | `go` | Strong foundation, proceed |
| 50-74 | `caution` | Address red flags first |
| 0-49 | `no_go` | Significant pivot needed |

## Factor Status Derivation

Factor scores (1-10) from the LLM are mapped to status labels:

| Score Range | Status |
|---|---|
| 7-10 | `strong` |
| 4-6 | `moderate` |
| 1-3 | `weak` |

## Processing Steps

1. **Clamp** each dimension score to `[0, 100]` (handles LLM over/under-shooting)
2. **Compute** weighted average using dimension weights
3. **Apply** bias correction (starts at 0, calibrate after 20+ runs)
4. **Clamp** result to `[0, 100]`, round to nearest integer
5. **Derive** verdict from threshold table
6. **Derive** factor statuses from factor scores
7. **Build** `scores_matrix` for frontend rendering

## Bias Correction

- Starts at `0` (no correction)
- `metadata.raw_weighted_average` is stored for auditing
- After 20+ pipeline runs, compare against human baseline scores
- Adjust per-dimension or global bias to calibrate

## Implementation Files

| File | Runtime | Purpose |
|---|---|---|
| `supabase/functions/validator-start/scoring-math.ts` | Deno | Edge function (canonical) |
| `src/lib/scoring-math.ts` | Browser | Frontend copy (identical logic) |
| `.agents/skills/.../scripts/scoring_math.py` | Python | CLI equivalent for testing |

## Example Calculation

Input dimensions: `{ problemClarity: 80, solutionStrength: 70, marketSize: 75, competition: 60, businessModel: 65, teamFit: 85, timing: 70 }`

```
80*0.15 = 12.00
70*0.15 = 10.50
75*0.15 = 11.25
60*0.10 =  6.00
65*0.15 =  9.75
85*0.15 = 12.75
70*0.15 = 10.50
─────────────────
Total   = 72.75 → round → 73
Verdict = caution (50 ≤ 73 < 75)
```
