# Skills → Production Upgrade Plan

## Context

StartupAI has 29 startup-domain skills with 12,000+ lines of frameworks, scoring models, and benchmarks. Only 7/29 skills reach production via 2 TypeScript bridge files (`agency-fragments.ts` + `agency-chat-modes.ts`). The AI chat was upgraded in Session 45 with a 3-layer expert prompt, but the validator pipeline still has 5/7 agents running on inline-only prompts with no skill knowledge.

The edge function audit (`agency/audit/01-audit-edge.md`) confirmed 30 deployed functions, identified doc drift (deployed count, LOC, auth claims), and flagged public-mode rate limiting as a gap.

**Goal:** Make AI chat a $500/hr startup advisor and improve validator report quality by wiring skill knowledge into production edge functions.

---

## Phase 1: Validator Fragments (3 new fragments)

### 1a. RESEARCH_FRAGMENT (~55 lines)
**Source:** `.agents/skills/startup/market-intelligence/SKILL.md`
**Target:** `supabase/functions/validator-start/agents/research.ts`
**Content:**
- Porter's Five Forces quick assessment (5 forces rated High/Med/Low, overall attractiveness)
- Market accessibility scoring (4 dimensions: buyer reachability, sales cycle complexity, regulatory burden, distribution existing — composite score, flag <4)
- Founder optimism detection (compare founder estimates vs research data, flag >3x TAM divergence, >2x growth divergence, "no competitors" vs found competitors)

**Injection:** `systemPrompt += RESEARCH_FRAGMENT;` after line 180

**New optional fields on `MarketResearch`:**
- `market_forces?: { competitive_rivalry, threat_new_entrants, supplier_power, buyer_power, threat_substitutes, overall_attractiveness }`
- `market_accessibility?: { buyer_reachability, sales_cycle_complexity, regulatory_burden, distribution_existing, composite }`
- `optimism_flags?: Array<{ claim, founder_value, research_value, divergence_factor }>`

### 1b. COMPETITORS_FRAGMENT (~60 lines)
**Source:** `.agents/skills/startup/competitive-strategy/SKILL.md`
**Target:** `supabase/functions/validator-start/agents/competitors.ts`
**Content:**
- Competitive velocity assessment (feature shipping rate, funding trajectory, market share trend, response capability → velocity_rating: fast/moderate/slow)
- Zombie competitor detection (stale product, flat traffic, no funding → status: zombie, force threat_level: low)
- Pricing landscape comparison (model, entry price, enterprise price, price-to-value gap)
- Win/loss pattern analysis (win when, lose when, switching triggers)

**Injection:** `systemPrompt += COMPETITORS_FRAGMENT;` after line 180

**New optional fields on `CompetitorAnalysis`:**
- `pricing_landscape?: Array<{ competitor_name, model, entry_price, enterprise_price }>`
- `price_gap?: string`
- `win_loss_patterns?: { win_when[], lose_when[], switching_triggers[] }`

**New optional fields on `Competitor`:**
- `velocity_rating?: 'fast' | 'moderate' | 'slow'`
- `status?: 'active' | 'zombie' | 'unknown'`

### 1c. MVP_FRAGMENT (~55 lines)
**Source:** `.agents/skills/startup/mvp/mvp-execution/SKILL.md`
**Target:** `supabase/functions/validator-start/agents/mvp.ts`
**Content:**
- Build/Buy/Skip framework (decision tree: differentiator→build, commodity→buy, non-critical→skip)
- Resource allocation by team size (solo 2-3 features/4-6 weeks, 2-person 3-5/3-4 weeks, 3-5 person 5-7/2-3 weeks)
- Pivot decision criteria (OMTM up→persevere, flat 90d→pivot, zero WTP→pivot, <25% PMF→kill)
- GTM motion selection (ACV-based: <$1K PLG, $1-25K hybrid, >$25K sales-led)

**Injection:** `systemPrompt += MVP_FRAGMENT;` after line 159

**New optional fields on `MVPPlan`:**
- `feature_classifications?: Array<{ feature, classification: 'build'|'buy'|'skip', rationale }>`
- `resource_plan?: { team_size, max_features, timeline_weeks, sprint_cadence }`
- `pivot_assessment?: { recommended_decision: 'persevere'|'pivot'|'kill'|'too_early_to_tell', evidence_summary, pivot_signals[] }`
- `gtm_motion?: { recommended: 'plg'|'hybrid'|'sales_led', rationale, key_metric }`

### Files to modify (Phase 1):
1. `supabase/functions/_shared/agency-fragments.ts` — add 3 exports + update registry (+170 lines)
2. `supabase/functions/validator-start/agency-fragments.ts` — re-export 3 new fragments (+3 lines)
3. `supabase/functions/validator-start/types.ts` — add optional fields (+55 lines)
4. `supabase/functions/validator-start/schemas.ts` — add optional fields to Gemini schemas (+40 lines)
5. `supabase/functions/validator-start/agents/research.ts` — import + inject (+5 lines)
6. `supabase/functions/validator-start/agents/competitors.ts` — import + inject (+5 lines)
7. `supabase/functions/validator-start/agents/mvp.ts` — import + inject (+5 lines)

### Tests (Phase 1):
- `src/test/validator/agency-fragments-v2.test.ts` (~45 tests: 3 fragments exist, content assertions, import verification)

### Deploy:
```bash
npx supabase functions deploy validator-start --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt
```

---

## Phase 2: Verifier + Scoring (cross-section rules)

### 2a. Verifier Cross-Section Consistency Rules (7 rules)

Add to `supabase/functions/validator-start/agents/verifier.ts`:

| # | Rule | Condition | Severity | Code |
|---|------|-----------|----------|------|
| 1 | TAM-score mismatch | TAM < $100M AND marketSize score > 70 | error | V_TAM_SCORE_MISMATCH |
| 2 | Revenue vs next steps | revenue_model says "subscription" but next_steps mention "per-transaction" | warn | V_REVENUE_NEXTSTEPS_MISMATCH |
| 3 | Projection growth | Y3 revenue > 50x Y1 | warn | V_PROJECTION_GROWTH_EXTREME |
| 4 | Low score no pivot | overall_score < 50 AND next_steps lack "pivot"/"reconsider" | warn | V_LOWSCORE_NO_PIVOT |
| 5 | Crowded high score | 5+ high-threat competitors AND competition score > 60 | warn | V_CROWDED_HIGH_SCORE |
| 6 | MVP overscoped | MVP lists >5 features AND team is solo | warn | V_MVP_OVERSCOPED |
| 7 | Unsourced TAM | TAM > $1B AND 0 cited sources | error | V_UNSOURCED_TAM |

### 2b. Scoring Evidence Quality (computed field)

Add to `supabase/functions/validator-start/agents/scoring.ts` post-processing:

```typescript
evidence_quality?: {
  grade_a_count: number;  // payment, usage data, LOI
  grade_b_count: number;  // interview, waitlist
  grade_c_count: number;  // survey, industry report
  grade_d_count: number;  // founder intuition, analogy
  overall_quality: 'strong' | 'moderate' | 'weak';
  confidence_note: string;
};
```

Deterministic computation from existing `evidence_grades` output. No Gemini schema change needed.

### Files to modify (Phase 2):
1. `supabase/functions/validator-start/agents/verifier.ts` — 7 new rules (+45 lines)
2. `supabase/functions/validator-start/agents/scoring.ts` — evidence_quality computation (+20 lines)
3. `supabase/functions/validator-start/types.ts` — add evidence_quality to ScoringResult (+10 lines)

### Tests (Phase 2):
- `src/test/validator/verifier-consistency-v2.test.ts` (~25 tests: one per rule + edge cases)

### Deploy:
```bash
npx supabase functions deploy validator-start --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt
```

---

## Phase 3: AI Chat Fixes + Structured Output

### 3a. Wire missing screen overlays

Add to `SCREEN_OVERLAYS` in `supabase/functions/_shared/startup-expert.ts`:

- `/market-research` — market sizing focus, bottom-up preferred, source freshness, Porter's
- `/investors` — MEDDPICC adaptation, signal-based outreach timing, pipeline health
- `/experiments` — match experiment type to risk, SMART goals, pre-PMF <$500/<2weeks

### 3b. Fix SCREEN_DOMAINS

- Add `gtm_strategy` to `/sprint-plan` and `/lean-canvas` domain arrays
- Narrow `/crm` overlay to customer CRM only (investor pipeline → `/investors`)

### 3c. Structured chat response (coaching modes only)

For coaching modes, add Gemini `responseJsonSchema`:
```typescript
{
  message: string;
  confidence: 'high' | 'medium' | 'low';
  framework_used?: string;
  next_step?: string;
  data_gaps?: string[];
}
```

Fallback: if Gemini returns plain string, wrap in `{ message: text, confidence: 'medium' }`.

### 3d. Audit fixes from 01-audit-edge.md

- Add public-mode IP-based rate limiting to `ai-chat/index.ts`
- Fix `index-functions.md`: deployed count 30 (not 31), add `validator-retry` and `weekly-review`

### Files to modify (Phase 3):
1. `supabase/functions/_shared/startup-expert.ts` — 3 screen overlays, SCREEN_DOMAINS fix (+30 lines)
2. `supabase/functions/ai-chat/index.ts` — structured response schema for coaching, public rate limit (+35 lines)
3. `supabase/functions/index-functions.md` — correct inventory numbers

### Tests (Phase 3):
- `src/test/validator/startup-expert-overlays.test.ts` (~20 tests: new overlays, domain mapping, gtm wiring)

### Deploy:
```bash
npx supabase functions deploy ai-chat --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt
```

---

## Verification

After all 3 phases:

1. **Tests pass:** `npm test` — all existing 599 + ~90 new tests
2. **Build passes:** `npm run build` — 0 errors, <7s
3. **TypeScript clean:** `npx tsc --noEmit` — 0 errors
4. **E2E validator runs:** 3 pipeline runs (B2B SaaS, consumer, marketplace) — verify new fields appear in reports
5. **Chat verification:** Test default chat on `/dashboard`, `/validate`, `/lean-canvas` screens — verify screen-appropriate advice
6. **Fragment count:** `agency-fragments.ts` exports 8 fragments (was 5)
7. **Validator agents with fragments:** 5/7 (was 2/7) — scoring, composer, research, competitors, mvp

---

## Summary

| Phase | What | Files | Tests | Deploy |
|-------|------|-------|-------|--------|
| 1 | 3 new validator fragments | 7 modified | ~45 | validator-start |
| 2 | 7 verifier rules + evidence quality | 3 modified | ~25 | validator-start |
| 3 | 3 screen overlays + structured chat + audit fixes | 3 modified | ~20 | ai-chat |
| **Total** | | **13 modified** | **~90 new** | **2 deploys** |

---

## Audit Verification (01-audit-edge.md)

### Verified Correct
- **Deployed count: 30** — confirmed via `ls -d */` excluding archive/ and _shared/
- **Archived count: 16** — confirmed
- **`_shared/` count: 18** — 17 top-level `.ts` + `playbooks/index.ts` = 18 (audit says 18, correct)
- **prompt-pack auth claim:** Audit says README claims public catalog but code requires JWT. Verified: `getUser()` at line 160 rejects before routing. Audit correct.
- **ai-chat public rate limiting gap:** Audit flags no rate limit for unauthenticated public mode. Verified: `checkRateLimit` only runs `if (user)`. Audit correct — this is a real cost/abuse risk.
- **validator-start C1-C5:** All PASS ratings confirmed. JWT, CORS, rate limiting, Promise.race timeout, EdgeRuntime.waitUntil all present.

### Audit Errors Found
- **`_shared/` count edge case:** Audit claims 18 but only 17 `.ts` files exist at top level. The 18th is `playbooks/index.ts` in a subfolder. Audit should clarify this.
- **Skill doc drift:** Audit correctly flags skill claiming "42+ deployed" when repo has 30. This should be fixed in the skill file too.

### Best Practices from Skill Verification (supabase-edge-functions v2.1)

| Rule | Status | Action Needed |
|------|--------|---------------|
| C1: Promise.race timeout | ✅ All agents use `_shared/gemini.ts` | None |
| C2: JWT verification | ✅ validator-start, ⚠️ ai-chat (public mode) | Add public rate limit (Phase 3) |
| C3: CORS shared helper | ✅ Both functions | ai-chat: standardize to `getCorsHeaders(req)` everywhere |
| C4: Gemini shared helper | ✅ Both functions | None |
| C5: EdgeRuntime.waitUntil | ✅ validator-start | None |
| C6: npm: imports | ✅ Both functions | None |

### Red Flags from Audit
1. **beforeunload cleanup risk** — validator-start uses `beforeunload` for async DB cleanup, which is best-effort only on Deno Deploy isolate death. Mitigation: pipeline already marks failure on deadline timeout (confirmed in pipeline.ts).
2. **CORS mixed patterns in ai-chat** — some responses use static `corsHeaders` constant, others use `getCorsHeaders(req)`. Should standardize to dynamic.
3. **Anthropic model wiring** — `MODEL_CONFIG` references Anthropic model IDs for `prioritize_tasks` and `generate_tasks`. Confirmed intentional (Claude for reasoning tasks, Gemini for fast tasks).

### Fixes Incorporated into Plan
- Phase 3 now includes: public-mode IP rate limiting, CORS standardization, index-functions.md correction
- Skill doc (`_shared/supabase-edge-functions/SKILL.md`) should update "42+" to "30" (not in plan scope — separate doc fix)

---

## Failure Points + Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Fragment too long, token budget exceeded | Low | Medium | Each fragment 55-60 lines (~600 tokens). Total per agent stays <250 lines. |
| New optional fields break report rendering | Very Low | High | All fields `?` optional. Frontend uses `?.` access. |
| Verifier false positives | Medium | Low | All new rules are warnings, not errors. Surface info, never block. |
| Coaching schema breaks streaming | Medium | Medium | Fallback wraps plain text in `{ message: text }`. Streaming unaffected. |
| Deploy fails | Low | Medium | CLI pattern proven (45+ deploys). `--no-verify-jwt` required. |
| Validator timeout regression | Low | High | Fragments add ~600 tokens to system prompt (< 5% of context). Research/Competitors already use Google Search (bottleneck is API, not prompt size). |

---

Expected quality improvement:
- Research: 76 → 85 (Porter's Five Forces, accessibility, optimism detection)
- Competitors: 78 → 87 (velocity, zombie detection, pricing landscape)
- MVP: 74 → 83 (build/buy/skip, resource allocation, pivot criteria)
- Verifier: 75 → 85 (7 cross-section consistency checks)
- AI Chat: screen-aware, structured coaching responses, public rate limiting
