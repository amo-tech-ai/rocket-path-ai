---
task_id: 024-MON
title: Production Monitoring Setup
phase: PRODUCTION
priority: P1
status: Not Started
estimated_effort: 0.25 day
skill: [devops, data]
subagents: [supabase-expert]
edge_function: all (monitoring)
schema_tables: [ai_runs]
depends_on: [023-STD]
---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Cost Monitoring panel (existing), Analytics page (existing widget area) |
| **Features** | Token usage baseline comparison, fragment metadata verification, rate limit stress test, cost threshold alerting, daily monitoring checklist |
| **Edge Functions** | All 6 agency-enhanced: `validator-start`, `sprint-agent`, `investor-agent`, `pitch-deck-agent`, `lean-canvas-agent`, `ai-chat` |
| **Real-World** | "After 50 pipeline runs, ai_runs shows average input_tokens increased from 2,400 to 3,100 — within the 30% budget threshold" |

## Description

**The situation:** All 6 agency-enhanced edge functions are deployed to production (task 023). Each function now loads prompt fragments via `agent-loader.ts`, injecting 800-2000 additional tokens of agency knowledge into every system prompt. The `ai_runs` table logs every AI invocation with `cost_usd`, `input_tokens`, `output_tokens`, `thinking_tokens`, `agent_name`, and `model`. Rate limiting is active in `_shared/rate-limit.ts` with 3 tiers (heavy: 5 requests per 5 minutes, standard: 30 per 60 seconds, light: 120 per 60 seconds). The AICostMonitoringPanel component on the frontend shows daily cost aggregations. However, there is no post-deploy monitoring process to verify: (1) fragments are actually loading in production, (2) token usage increase is within budget, (3) rate limits still work with larger prompts, (4) costs haven't spiked unexpectedly.

**Why it matters:** Agency fragments add ~1,000-2,000 tokens per system prompt. For the validator pipeline (7 agents), this compounds to an additional 7,000-14,000 input tokens per pipeline run. At Gemini Flash pricing ($0.075 per 1M input tokens), this adds approximately $0.001 per pipeline run — negligible in isolation but important to verify at scale. More critically, a misconfigured fragment that triggers excessive output (e.g., a prompt that causes Gemini to generate 8,000 tokens instead of 2,000) could increase costs 4x silently. Without monitoring baselines, the team would not detect this for weeks. Rate limits operate on request count, not token count, so larger prompts should not trigger them — but this assumption must be verified. Additionally, if `agent-loader.ts` fails silently in production (e.g., file path mismatch, Deno import error), the fragments won't load and the agency features will be invisible — the AI will produce pre-agency quality output without any error signal.

**What already exists:**
- `ai_runs` table — columns: `id`, `user_id`, `agent_name`, `model`, `cost_usd`, `input_tokens`, `output_tokens`, `thinking_tokens`, `created_at`, `org_id`. If task 017 ran: also `fragments_loaded text[]`, `evidence_tier_counts jsonb`, `bias_flags_count int`.
- `_shared/rate-limit.ts` — In-memory sliding window with 3 tiers. Heavy tier covers validator-start (5 requests per 5 min per user). Standard covers most other EFs. Light covers read-only operations.
- `src/components/dashboard/AICostMonitoringPanel.tsx` — Frontend panel showing daily cost aggregation, agent breakdown, token usage charts.
- `src/hooks/useAIUsageLimits.ts` — Hook for budget calculation and usage percentages.
- Supabase Dashboard — Edge function logs, invocation counts, error rates visible at `https://supabase.com/dashboard/project/yvyesmiczbjqwbqtlidy/functions`.
- `validator_agent_runs` table — Per-agent timing for pipeline runs.
- Pre-agency baseline data in `ai_runs` — historical entries from before the agency deploy.

**The build:**

**1. Establish pre-agency baseline (run before task 023 deploy, or query historical data):**
- Query average `input_tokens` per `agent_name` for the 7 days before agency deploy.
- Query average `cost_usd` per pipeline run (sum of all validator agents per session).
- Store baseline numbers in a monitoring document for comparison.
- SQL: `SELECT agent_name, AVG(input_tokens) as avg_input, AVG(output_tokens) as avg_output, AVG(cost_usd) as avg_cost FROM ai_runs WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY agent_name ORDER BY agent_name;`

**2. Fragment loading verification (day 1 post-deploy):**
- If task 017 migration ran: Query `SELECT agent_name, fragments_loaded FROM ai_runs WHERE created_at > '[deploy_timestamp]' AND fragments_loaded IS NOT NULL ORDER BY created_at DESC LIMIT 20;` — verify fragment names appear.
- If task 017 migration did NOT run: Verify fragment loading by checking Supabase edge function logs. Search for `loadFragment` log messages. Alternatively, check output quality: reports should contain evidence_tier fields that only exist when the scoring fragment loads.
- Expected result: every post-deploy ai_runs entry for the 6 target EFs should show fragments loaded.

**3. Token usage comparison (day 1-3 post-deploy):**
- Query post-deploy averages: `SELECT agent_name, AVG(input_tokens) as avg_input, AVG(output_tokens) as avg_output, AVG(cost_usd) as avg_cost FROM ai_runs WHERE created_at > '[deploy_timestamp]' GROUP BY agent_name ORDER BY agent_name;`
- Compare against baseline. Expected increase: 10-30% in input_tokens (fragment injection). Output tokens should remain roughly constant (fragments guide format, not inflate output).
- Flag if any agent shows > 30% input_tokens increase or > 20% output_tokens increase.
- Pipeline cost comparison: `SELECT vs.id, SUM(ar.cost_usd) as pipeline_cost, SUM(ar.input_tokens) as total_input FROM ai_runs ar JOIN validation_sessions vs ON ar.user_id = vs.user_id WHERE ar.created_at > '[deploy_timestamp]' AND ar.agent_name LIKE 'validator%' GROUP BY vs.id ORDER BY vs.created_at DESC LIMIT 10;`

**4. Rate limit stress test (day 1 post-deploy):**
- Open `/validate` and rapidly submit 6 ideas within 5 minutes (exceeds heavy tier: 5/5min).
- Expected: 5th request succeeds, 6th returns 429 Too Many Requests.
- Verify rate limit response includes `Retry-After` header or meaningful error message.
- Repeat for sprint-agent (standard tier: send 31 rapid requests within 60 seconds).
- This confirms larger prompts don't bypass or break rate limiting.

**5. Cost dashboard verification (day 2 post-deploy):**
- Open AICostMonitoringPanel on the frontend.
- Verify daily cost shows post-deploy entries.
- Verify agent breakdown shows correct agent names.
- Verify total daily cost hasn't spiked more than 25% compared to pre-deploy daily average.
- If costs exceed 25% increase, investigate which agent is the outlier.

**6. Create daily monitoring checklist (run for 7 days post-deploy):**
- Document a checklist in `agency/docs/monitoring-checklist.md`:
  - [ ] Check Supabase EF logs for 500 errors (filter by 6 agency functions)
  - [ ] Query ai_runs: any entries with unusually high input_tokens (> 2x baseline)?
  - [ ] Query ai_runs: any entries with cost_usd > $0.05 (single invocation)?
  - [ ] Check AICostMonitoringPanel: daily total within expected range?
  - [ ] Check validator_agent_runs: any agents stuck at 'running' status > 5 minutes?
  - [ ] If task 017 columns exist: any entries where fragments_loaded is NULL for agency EFs?
- Run this checklist daily for the first week. After week 1, reduce to weekly.

**7. Optional: Alert threshold (stretch goal):**
- Create a Supabase database function `check_ai_cost_alert()` that runs via pg_cron daily.
- If `SUM(cost_usd)` for the day exceeds $5.00, insert a row into a `system_alerts` table (or send a webhook).
- Wire to frontend: AICostMonitoringPanel shows amber badge if daily cost exceeds threshold.
- This is a stretch goal — the manual checklist is the MVP.

**Example:** Day 2 post-deploy. Run the daily checklist. Supabase logs show 0 errors for agency EFs. Query ai_runs: 23 new entries, average input_tokens for validator agents is 3,100 (baseline was 2,400 — 29% increase, within 30% threshold). Average output_tokens is 1,850 (baseline 1,800 — 3% increase, negligible). Cost per pipeline run: $0.015 (baseline $0.012 — 25% increase, within budget). Rate limit test from day 1 passed — 6th rapid request returned 429 correctly. AICostMonitoringPanel shows $1.02 daily cost (baseline $0.85 — 20% increase). If task 017 columns exist: 23/23 entries have fragments_loaded populated. All green. Reduce checklist frequency to every other day.

## Rationale

**Problem:** Agency fragments increase system prompt size by 800-2000 tokens per invocation. Without monitoring, a misconfigured fragment could silently double costs, a failed fragment loader could produce pre-agency outputs undetected, or rate limits could behave unexpectedly with larger payloads.

**Solution:** Establish a pre-agency baseline, compare post-deploy token usage and costs against it, verify fragments are actually loading, stress-test rate limits, and run a daily monitoring checklist for the first week.

**Impact:** Confidence that the agency system is working as designed. Any cost anomaly detected within 24 hours instead of weeks. Fragment loading failures caught on day 1, not after user complaints.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | compare pre/post token usage | I know fragments aren't inflating costs beyond budget |
| Developer | verify fragments load in production | I catch silent loader failures on day 1 |
| Developer | stress-test rate limits post-deploy | I confirm larger prompts don't bypass protection |
| Product lead | see daily cost trends post-deploy | I can approve the agency system's cost footprint |
| Operator | have a daily monitoring checklist | I systematically catch issues during the first week |

## Goals

1. **Primary:** Post-deploy token usage and cost increase documented and within 30% of baseline
2. **Verification:** Fragment loading confirmed for all 6 target edge functions
3. **Safety:** Rate limits verified working with larger agency-enhanced prompts
4. **Visibility:** AICostMonitoringPanel accurately reflects post-deploy costs
5. **Process:** Daily monitoring checklist documented and followed for 7 days

## Acceptance Criteria

- [ ] Pre-agency baseline established: average input_tokens, output_tokens, cost_usd per agent_name
- [ ] Post-deploy averages queried and compared to baseline
- [ ] Input token increase within 30% threshold for all 6 target agents
- [ ] Output token increase within 20% threshold (should be minimal)
- [ ] Fragment loading verified in production (via ai_runs.fragments_loaded or log inspection or output quality check)
- [ ] Rate limit stress test passed: heavy tier (5/5min) correctly rejects 6th request
- [ ] Rate limit stress test passed: standard tier correctly rejects request exceeding threshold
- [ ] AICostMonitoringPanel shows accurate post-deploy cost data
- [ ] Daily cost increase within 25% of pre-deploy daily average
- [ ] Monitoring checklist document created at `agency/docs/monitoring-checklist.md`
- [ ] Checklist run daily for at least 3 days post-deploy (7 days recommended)

| Layer | File | Action |
|-------|------|--------|
| Documentation | `agency/docs/monitoring-checklist.md` | Create — daily checklist with SQL queries, thresholds, and pass/fail criteria |
| Documentation | `agency/docs/baseline-metrics.md` | Create — pre-agency token and cost averages per agent |
| Verification | SQL on `ai_runs` | Run baseline query before deploy, comparison query after deploy |
| Verification | SQL on `validator_agent_runs` | Check for stuck agents post-deploy |
| Verification | Supabase Dashboard | Check EF logs for 500 errors |
| Verification | Frontend | Verify AICostMonitoringPanel accuracy |
| Verification | Manual | Rate limit stress test (rapid requests) |
| Optional | `supabase/migrations/YYYYMMDD_ai_cost_alert.sql` | Create — pg_cron daily cost check (stretch goal) |
| Optional | `src/components/dashboard/AICostMonitoringPanel.tsx` | Modify — add amber badge for cost threshold (stretch goal) |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No pre-agency baseline data (new project) | Use first 3 days post-deploy as baseline. Compare day 4-7 against days 1-3. |
| Task 017 migration not yet applied | fragments_loaded column doesn't exist. Verify fragment loading via output quality (evidence_tier fields present) or EF log inspection instead. |
| ai_runs table has no recent entries | No production usage yet. Generate test data by running 3 pipeline runs + 3 sprint generations + 3 chat sessions manually. |
| Single agent shows > 30% token increase | Investigate that specific fragment. Check fragment line count. Compare fragment token count against the 2,000-token budget. May need to trim. |
| Rate limit test passes but returns generic 500 instead of 429 | Rate limit response handler in the EF may not be returning proper status code. Check `_shared/rate-limit.ts` returns `{ statusCode: 429 }`. |
| AICostMonitoringPanel shows $0 for post-deploy period | Check if the panel queries by date range. Verify timezone alignment (UTC vs local). Check if ai_runs INSERT is actually happening in the EF code. |
| Gemini API pricing changes between baseline and post-deploy | Cost comparison becomes invalid. Fall back to token count comparison only (which is pricing-independent). |
| Fragment loads but is empty string (file exists, no content) | Function works normally but without agency enhancement. Detectable by checking output: evidence_tier fields will be absent despite fragment "loading." |
| Multiple deploys in same day (iterating on fixes) | Baseline comparison becomes noisy. Use deploy timestamps to partition ai_runs queries precisely. |

## Real-World Examples

**Scenario 1 — Clean monitoring report:** Team deploys all 6 functions on Monday (task 023). On Tuesday morning, the developer runs the monitoring checklist. Pre-agency baseline shows validator-start averaged 2,400 input tokens per agent. Post-deploy average is 3,050 — a 27% increase, within the 30% threshold. Cost per pipeline run went from $0.012 to $0.015. Daily total: $1.02 (baseline $0.85). All 23 post-deploy ai_runs entries show fragments_loaded populated with correct names. Rate limit test on Monday passed correctly. **With the monitoring checklist,** the team has hard numbers proving the agency system is working within budget constraints after just one day.

**Scenario 2 — Token budget exceeded:** On Wednesday, the daily checklist reveals sprint-agent's input_tokens jumped from 1,800 to 3,200 — a 78% increase, well above the 30% threshold. The developer checks the sprint-agent-fragment: it is 2,400 tokens (exceeds the 2,000-token budget). The fragment includes a detailed RICE scoring example that could be summarized. **With threshold monitoring,** the oversized fragment is caught within 48 hours instead of accumulating costs for weeks. The team trims the fragment from 2,400 to 1,600 tokens and redeploys.

**Scenario 3 — Silent fragment failure:** On Thursday, the checklist query shows validator-start ai_runs entries with `fragments_loaded = NULL` (or output quality check shows no evidence_tier fields). Investigation reveals the Deno deploy bundled the fragment files incorrectly — `agent-loader.ts` cannot find them at the expected path. The functions work fine (graceful degradation), but agency features are invisible. **With fragment loading verification,** the issue is caught within 24 hours. The team fixes the import path and redeploys validator-start. Friday's checklist confirms fragments_loaded is populated again.

## Outcomes

| Before | After |
|--------|-------|
| No baseline for token usage comparison | Pre-agency averages documented per agent |
| Token cost impact of fragments unknown | Post-deploy comparison shows exact percentage increase |
| Fragment loading failures undetectable | Fragment loading verified via ai_runs data or output quality checks |
| Rate limit behavior with larger prompts untested | Stress test confirms rate limits work correctly post-deploy |
| Cost monitoring is ad-hoc | Daily checklist for first week, weekly thereafter |
| Cost spikes detected weeks later (or never) | Threshold monitoring catches anomalies within 24 hours |
| No documented monitoring process | `monitoring-checklist.md` provides repeatable verification procedure |
