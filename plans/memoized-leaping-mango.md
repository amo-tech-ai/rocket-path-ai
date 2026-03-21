# Validator Pipeline Improvement Plan — ✅ COMPLETE

> **Status:** All 6 phases implemented, deployed, and committed to main (`efeb220`)
> **Deployed:** Edge function via `npx supabase functions deploy validator-start --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
> **Commit:** `efeb220` — "feat(validator): decision-grade reports — 6-phase pipeline improvements" (8 files, +643/-46)

## Context

The validator pipeline (`supabase/functions/validator-start/`) runs 7 agents sequentially/parallel to produce a startup validation report. Current problems:

1. **Research produces wrong market** — searches "AI tools market" instead of the actual industry (e.g., "eCommerce product photography")
2. **Summary doesn't describe the business** — jumps to numbers without saying what the startup does
3. **Scores inflate without evidence** — 80+ scores with no traction, no signal-level gating in code
4. **Market math breaks** — SAM > TAM, SOM = $2, auto-correction is a band-aid (forces 30%/10% ratios)
5. **MVP plans are generic** — "validate market" without deliverables, thresholds, or kill criteria
6. **Verifier is shallow** — checks section presence but not quality, no cross-section consistency
7. **No post-processing guardrails** — prompts say rules but code doesn't enforce them

The goal: **decision-grade reports for any startup in any industry**, with verifiable data and transparent math.

---

## Approach
- **Improvements first, tests later** — focus on prompt upgrades + code guardrails across all agents. Test suite is a follow-up task.
- **Bottom-up sizing table is REQUIRED** — prompt says REQUIRED, code validates presence. If missing, add red_flag.

## Implementation Phases

### Phase 1: Research Agent — Fix Market Identification (highest user-visible impact)

**Files:** `agents/research.ts`, `schemas.ts`

**Problem:** Gemini drifts to "AI tools market" because the prompt doesn't hard-constrain market definition.

**Changes:**

1. **Add hard constraint to system prompt** (top of prompt, before methodology):
   ```
   HARD CONSTRAINT:
   - The market is defined by WHAT customers buy (activity/category), NOT the technology (HOW).
   - If the startup uses AI, ignore "AI market" unless AI itself is the product being sold.
   - Output 1 primary_market_label and 2 alternate_market_labels.
   ```

2. **Require bottom-up sizing table** in prompt:
   ```
   REQUIRED: Include a bottom-up sizing table:
   - buyer_segment (who buys this)
   - buyer_count (with source or "estimated")
   - price_per_year (with source or assumption basis)
   - frequency (one-time / annual / monthly)
   - resulting_sam = buyer_count × price_per_year
   ```

3. **Add schema fields** to `AGENT_SCHEMAS.research`:
   - `primary_market_label`: string (REQUIRED)
   - `alternate_market_labels`: string[] (optional)
   - `bottom_up_table`: `{buyer_segment, buyer_count, price_per_year, frequency, resulting_sam}[]` (REQUIRED — if missing, add red_flag "Missing bottom-up evidence")
   - `assumptions`: `{name, value, justification}[]` (optional)
   - `confidence`: number 0-100 (optional)

4. **Improve citation quality** — add to schema:
   - `sources[].published_year`: number
   - `sources[].source_type`: enum (gov | analyst | industry_report | news | company_filings | other)

5. **Replace auto-correct with smart validation** in post-processing (lines 197-215):
   - Keep TAM as reported
   - If SAM > TAM: flag as `red_flag`, set SAM = bottom_up_table.resulting_sam if available, else SAM = TAM × 0.3
   - If SOM > SAM: compute SOM from stage calibration (pre-seed 0.3%, seed 2%, series-A 4% of SAM)
   - Add `corrections_applied[]` to output for transparency
   - If CAGR > 40% for non-emerging market: add warning

6. **Add SOM floor** — if SOM < $500K and TAM > $1B, flag as likely broken (model returned placeholder)

---

### Phase 2: Scoring Agent — Enforce Evidence-Based Gating (prevents inflated scores)

**Files:** `agents/scoring.ts`, `scoring-math.ts`

**Problem:** Prompts say "Level 1-2 → cap at 65" but code doesn't enforce it. Scores inflate because there are no deterministic caps.

**Changes:**

1. **Add deterministic post-processing guardrails** after `computeScore()` (scoring.ts ~line 233):

   ```typescript
   // Signal-level gating (enforce what prompt says)
   if (scoring.highest_signal_level && scoring.highest_signal_level <= 2) {
     scoring.overall_score = Math.min(scoring.overall_score, 65);
     scoring.verdict = deriveVerdict(scoring.overall_score);
   }

   // Bias flag escalation
   if (scoring.bias_flags && scoring.bias_flags.length >= 3) {
     const biasFlag = "Multiple cognitive biases detected — high risk of founder self-delusion";
     if (!scoring.red_flags.includes(biasFlag)) {
       scoring.red_flags.push(biasFlag);
     }
   }

   // Market data gating
   if (market) {
     if (market.sam > market.tam || market.som > market.sam) {
       scoring.red_flags.push("Market sizing inconsistent — SAM/SOM hierarchy violated");
       scoring.dimension_scores.marketSize = Math.min(scoring.dimension_scores.marketSize, 55);
     }
   }

   // Missing data caps
   if (!competitors?.direct_competitors?.length) {
     scoring.dimension_scores.competition = Math.min(scoring.dimension_scores.competition, 55);
   }
   if (!profile.validation || profile.validation.toLowerCase() === 'none') {
     scoring.dimension_scores.businessModel = Math.min(scoring.dimension_scores.businessModel, 60);
   }
   ```

2. **Recompute overall_score after caps** — call `computeScore()` again with adjusted dimensions

3. **Sort risk_queue deterministically** in code (not just prompt):
   - Sort by: severity (fatal=0, high=1, medium=2, low=3) → composite_score DESC → experiment cost ASC
   - Trim to max 5

4. **Dedupe evidence_grades** by claim text (case-insensitive)

5. **Add optional `debug_trace`** field to output:
   - `caps_applied[]`, `penalties[]`, `gates_triggered[]`
   - Useful for QA without changing report display

---

### Phase 3: Extractor Agent — Better Search Queries + Validation (feeds Research quality)

**Files:** `agents/extractor.ts`

**Problem:** Search queries are still sometimes generic. No post-processing validation of output.

**Changes:**

1. **Add post-processing guards** after `extractJSON()`:
   ```typescript
   // Trim strings, ensure arrays exist
   profile.idea = profile.idea?.trim() || '';
   profile.assumptions = Array.isArray(profile.assumptions) ? profile.assumptions.filter(Boolean) : [];

   // Ensure evidence_tier is valid
   if (!['A', 'B', 'C', 'D'].includes(profile.problem_structured?.evidence_tier)) {
     profile.problem_structured.evidence_tier = 'D';
   }

   // Ensure websites contains only explicit URLs (no guessing)
   if (profile.websites && !profile.websites.match(/https?:\/\//)) {
     profile.websites = '';
   }

   // Ensure 2-5 assumptions
   if (profile.assumptions.length < 2) {
     profile.assumptions.push('Market assumption: sufficient demand exists');
     profile.assumptions.push('Problem assumption: pain is severe enough to pay for');
   }
   if (profile.assumptions.length > 5) {
     profile.assumptions = profile.assumptions.slice(0, 5);
   }

   // Ensure search_queries = 5 items with purpose+query
   if (!Array.isArray(profile.search_queries) || profile.search_queries.length < 5) {
     // Append default industry queries
   }
   ```

2. **Add `field_sources` map** (optional schema field):
   - `Record<string, "founder_text" | "interview_context" | "inference">`
   - Helps Composer know what's verified vs assumed

---

### Phase 4: MVP Agent — Actionable Plans with Kill Criteria

**Files:** `agents/mvp.ts`

**Problem:** Tasks are generic ("validate market"), no deliverables/thresholds, no kill criteria, no pricing test.

**Changes:**

1. **Add to system prompt:**
   ```
   HARD RULES:
   - Every task must include: deliverable (artifact) + measurement (number) + timebox (days)
   - Phase 1, Task 1 must target the #1 risk from scoring
   - Include kill_criteria: 2-3 thresholds that trigger pivot/stop
   - Include a pricing test in experiments for B2B unless evidence_tier = A
   ```

2. **Add schema fields** (optional):
   - `kill_criteria`: string[] (2-3 crisp thresholds)
   - `pricing_test`: `{hypothesis, method, price_points, pass_threshold}`

3. **Post-processing validation:**
   - Ensure `phases.length === 3`
   - Ensure `experiment_cards.length >= 3` (top 3 risks)
   - Ensure `next_steps.length` is 5-8
   - Check Phase 1 targets top risk (substring match on risk_queue[0].domain)

4. **Founder stage detection rules** in code (not just prompt):
   ```typescript
   function detectStage(profile: StartupProfile): string {
     const v = (profile.validation || '').toLowerCase();
     if (v.match(/paid|invoice|stripe|revenue|loi|letter of intent/)) return 'presales_confirmed';
     if (v.match(/waitlist|signup|landing|conversion|cpa/)) return 'demand_validated';
     if (v.match(/interview|survey|10\+|confirmed pain/)) return 'problem_validated';
     return 'idea_only';
   }
   ```

---

### Phase 5: Composer Agent — Business Description + Consistency Layer

**Files:** `agents/composer.ts`

**Problem:** Summary doesn't describe the business. No cross-group contradiction detection.

**Changes:**

1. **Require business description in Group D prompt:**
   ```
   The summary_verdict MUST open with what the business does in one sentence:
   "[Company] is a [what it does] for [who] — targeting a $[TAM] [market name]."
   Then the opportunity, risks, and verdict.
   ```

2. **Add consistency checks** between Phase 1 and Phase 2 (before Group D):
   ```typescript
   const consistencyNotes: string[] = [];
   // Existing checks (SOM, overall_score, LTV:CAC) + new:
   if (scoring?.highest_signal_level <= 2 && scoring?.overall_score > 65) {
     consistencyNotes.push('Signal level 1-2 but score >65 — language must reflect unvalidated status');
   }
   if (groupB?.risks_assumptions?.some(r => r.severity === 'fatal') && scoring?.verdict === 'go') {
     consistencyNotes.push('Fatal risk exists — verdict cannot be unconditional "Go"');
   }
   ```

3. **Add verdict gating rules** to Group D prompt:
   - If `highest_signal_level < 3`: verdict cannot be "Go."
   - If any fatal risk: verdict must be "Conditional go" or "No-go"
   - Add `verdict_rationale_points`: 3 short bullets justifying verdict

4. **Group E reliability:**
   - Replace 200ms stagger with concurrency limiter (max 3 in flight)
   - If remaining budget < 25s, run only lowest-scoring 3 dimensions
   - Add per-dimension schema validation: if `composite_score` not 0-100 or `sub_scores` missing → mark as `skipped`

---

### Phase 6: Verifier Agent — Deep Quality Checks

**Files:** `agents/verifier.ts`

**Problem:** Only checks presence (>10 chars), not quality. No cross-section consistency.

**Changes:**

1. **Add typed validation helpers:**
   ```typescript
   function isNonEmptyString(v: unknown, minLen = 10): boolean
   function isArrayOfMin(v: unknown, min: number): boolean
   function countPlaceholders(text: string): number  // "Unknown", "TBD", "N/A"
   function isUrlLike(str: string): boolean
   ```

2. **Replace binary missing/present with quality scoring:**
   - `section_health`: `Record<string, {status: 'ok'|'weak'|'missing', reasons: string[]}>`
   - Example: problem_clarity = `weak` if `who` < 15 chars or `pain` has no number

3. **Add cross-section consistency checks:**
   - If `scores_matrix.overall_weighted < 60` and `summary_verdict` contains "Go." without "Conditional" → error
   - If `top_threat` exists but not in `risks_assumptions` → warn
   - If `next_steps` missing pricing test (no "price"/"pricing"/"willingness to pay") → warn
   - If 0 competitors but competition score > 60 → warn

4. **Add severity levels + codes:**
   ```typescript
   interface DetailedWarning {
     severity: 'info' | 'warn' | 'error';
     code: string;  // V_MISSING_SECTION, V_BAD_MARKET_HIERARCHY, etc.
     message: string;
     fix_hint: string;
     owner_agent: string;
     section: string;
   }
   ```

5. **Fix verification logic:**
   - `verified = true` if no `missing` sections AND no `error` severity warnings
   - Failed agents with valid fallback sections → warn, don't auto-fail

---

## Implementation Order (by impact)

| Priority | Phase | Agent | User-Visible Impact | Effort |
|----------|-------|-------|---------------------|--------|
| P0 | 1 | Research | Correct market identification | Medium |
| P0 | 2 | Scoring | Honest scores, no inflation | Medium |
| P1 | 5 | Composer | Business description in summary | Small |
| P1 | 4 | MVP | Actionable plans, kill criteria | Medium |
| P2 | 3 | Extractor | Better search queries, validated output | Small |
| P2 | 6 | Verifier | Catch broken reports before delivery | Medium |

---

## Critical Files to Modify

```
supabase/functions/validator-start/
├── agents/research.ts      # Phase 1: market identification + bottom-up table
├── agents/scoring.ts       # Phase 2: deterministic caps + evidence gating
├── agents/extractor.ts     # Phase 3: post-processing guards
├── agents/mvp.ts           # Phase 4: kill criteria + stage detection
├── agents/composer.ts      # Phase 5: business description + consistency
├── agents/verifier.ts      # Phase 6: deep quality checks
├── schemas.ts              # Schema updates (all optional fields)
├── scoring-math.ts         # Reuse existing — no changes needed
└── types.ts                # Type updates for new optional fields
```

## Existing Code to Reuse

- `scoring-math.ts:computeScore()` — already handles clamping, weights, verdict derivation. Call it twice: once for raw scores, once after applying caps.
- `scoring-math.ts:deriveVerdict()` — reuse for re-deriving verdict after score adjustments
- `extractJSON()` from `gemini.ts` — JSON extraction with multiple fallbacks
- `getCuratedLinks()` / `searchKnowledge()` — RAG pipeline already works well
- `normalizeGroup()` in composer.ts — group output normalization
- Existing `consistencyNotes[]` pattern in composer.ts (lines 924-934) — extend, don't replace

## What NOT to Change

- **Pipeline orchestration** (pipeline.ts) — timing, groups, error handling all work well
- **Database schema** — no DB migrations needed
- **Frontend components** — all new fields are optional; existing display works
- **callGemini()** — shared utility is solid
- **scoring-math.ts** — deterministic layer stays untouched

---

## Verification

1. **Deploy validator-start** after each phase: `npx supabase functions deploy validator-start --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
2. **Run a test validation** at `/validate` with the iPix idea (eCommerce product photography) — verify:
   - Research returns "eCommerce product photography market" not "AI tools market"
   - Score reflects lack of traction (should be ≤65 with signal level 1-2)
   - Summary opens with what iPix does
   - MVP includes pricing test and kill criteria
   - Verifier catches any inconsistencies
3. **Run a second test** with a different industry (e.g., fintech, healthtech) to confirm generalization
4. **Check build**: `npm run build` passes (frontend unchanged)
5. **Check existing tests**: `npm run test` passes (no frontend breakage)
