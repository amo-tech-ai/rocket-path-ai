---
task_id: 023-STD
title: Staged Edge Function Deploy
phase: PRODUCTION
priority: P0
status: Not Started
estimated_effort: 0.25 day
skill: [devops]
subagents: [supabase-expert]
edge_function: all (deployment)
schema_tables: []
depends_on: [021-BWC, 022-ATS]
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (infrastructure only) |
| **Features** | Staged deploy pipeline, rollback verification, per-function smoke tests |
| **Edge Functions** | `validator-start`, `sprint-agent`, `investor-agent`, `pitch-deck-agent`, `lean-canvas-agent`, `ai-chat` |
| **Real-World** | "Deploy validator-start first, verify the pipeline produces a report with evidence tiers, then move to the next function" |

## Description

**The situation:** The agency enhancement modifies 6 edge functions to load prompt fragments via `agent-loader.ts` and inject agency knowledge (evidence tiers, bias detection, RICE scoring, MEDDPICC frameworks, specificity meters, chat modes). All functions have been developed locally, passed backward compatibility checks (task 021), and have 38+ tests passing (task 022). Now they need to be deployed to production on Supabase.

Deploying all 6 simultaneously is risky. If the validator-start pipeline breaks after a batch deploy, it could be the scoring fragment, the composer fragment, or the loader itself. Isolating the problem in a 6-function batch deploy wastes hours. The current deploy command (`npx supabase functions deploy <name> --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`) deploys one function at a time, and Supabase keeps a version history per function in the dashboard. This means single-function rollback is straightforward: redeploy the previous version.

**Why it matters:** The validator pipeline is the core product. A broken deploy means founders cannot validate their ideas until the issue is resolved. Staged deployment means each function is verified independently before moving on. If function 3 fails, functions 1 and 2 are already live and working. The blast radius of any single failure is limited to one feature domain, not the entire agency system. Additionally, deploying highest-traffic functions first (validator-start handles 7 agents and is the most complex) means issues in critical paths are caught early rather than last.

**What already exists:**
- Supabase CLI deploy: `npx supabase functions deploy <name> --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
- Supabase Dashboard: edge function version history at `https://supabase.com/dashboard/project/yvyesmiczbjqwbqtlidy/functions`
- All 6 edge functions already deployed in pre-agency versions (latest versions known)
- `ai_runs` table — logs every AI invocation with cost, tokens, agent name
- `validator_agent_runs` table — logs per-agent timing for pipeline runs
- `agency/prompts/*.md` — 5 runtime fragment files loaded by `agent-loader.ts`
- Task 022 test suite — 38+ tests verifying fragment loading, backward compatibility, output schema

**The build:** Deploy in this exact order, verifying each function before proceeding to the next. The order is highest-traffic and highest-complexity first, so critical issues surface early.

**Step 1 — `validator-start` (most complex, 7 agents):**
- Deploy: `npx supabase functions deploy validator-start --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
- Verify: Open `/validate`, describe a test idea (e.g., "AI-powered inventory management for small restaurants"), let the pipeline run through all 7 agents.
- Check report: confirm `evidence_tier` fields present on dimension scores, `bias_flags` array present (even if empty), `signal_strength` field present on scoring output.
- Check logs: Supabase dashboard > Edge Functions > validator-start > Logs. Look for 500 errors or timeout failures.
- Check `ai_runs`: `SELECT * FROM ai_runs WHERE agent_name LIKE 'validator%' ORDER BY created_at DESC LIMIT 10;` — verify entries exist with reasonable token counts.
- Check `validator_agent_runs`: Verify all 7 agents completed with status `completed` or `skipped` (not stuck at `running`).

**Step 2 — `sprint-agent`:**
- Deploy: `npx supabase functions deploy sprint-agent --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
- Verify: Open `/sprint-plan`, click Generate Plan. Confirm tasks appear with `rice_score`, `kano_class`, and `momentum_order` fields.
- Check logs: no 500 errors.
- Check `ai_runs`: new entry with `agent_name = 'sprint-agent'`.

**Step 3 — `investor-agent`:**
- Deploy: `npx supabase functions deploy investor-agent --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
- Verify: Open `/investors`, select an investor, trigger a fit analysis. Confirm MEDDPICC breakdown fields are present in the response.
- Check logs: no 500 errors.

**Step 4 — `pitch-deck-agent`:**
- Deploy: `npx supabase functions deploy pitch-deck-agent --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
- Verify: Open Pitch Deck editor, generate a slide. Confirm `win_themes` and `challenger_narrative` fields present in generation output.
- Check logs: no 500 errors.

**Step 5 — `lean-canvas-agent`:**
- Deploy: `npx supabase functions deploy lean-canvas-agent --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
- Verify: Open `/lean-canvas`, trigger the AI coach. Confirm `specificity_meter` data present in coach response, evidence gap warnings appear for vague boxes.
- Check logs: no 500 errors.

**Step 6 — `ai-chat`:**
- Deploy: `npx supabase functions deploy ai-chat --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
- Verify: Open `/ai-chat`, select Practice Pitch mode. Confirm mode-specific system prompt behavior (Practice Pitch should respond as an investor asking tough questions). Test at least 2 modes.
- Check logs: no 500 errors.

**Rollback procedure (test on at least 1 function):**
- Go to Supabase Dashboard > Edge Functions > select function > Deployments tab
- Note the previous version number
- Redeploy previous version: `npx supabase functions deploy <name> --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt` from a git checkout of the pre-agency commit
- Alternative: keep pre-agency branch tagged as `pre-agency-deploy` for quick rollback
- Verify rollback: repeat the same smoke test to confirm pre-agency behavior restored

**Between each deploy:** Allow 2-3 minutes for the function to warm up. Check Supabase logs for errors. Verify frontend renders the new data correctly. Only proceed to the next function after current one is confirmed working.

**Example:** Deploy morning. Push `validator-start` at 9:00 AM. Run the FashionOS idea through the pipeline. Report generates in 87 seconds with evidence tiers on all 7 dimensions — market scored "Cited" (Gartner data), problem scored "Founder" (user-reported pain). No 500 errors in logs. ai_runs shows 8 new entries (1 per agent + 1 pipeline). Push `sprint-agent` at 9:15 AM. Generate tasks for FashionOS — 24 tasks appear, each with RICE scores ranging 18-94 and Kano classifications. Push `investor-agent` at 9:30 AM. Score a mock investor — MEDDPICC breakdown shows 7 criteria scored independently. Continue through remaining 3 functions by 10:30 AM. Test rollback on `sprint-agent` at 10:45 AM — redeploy pre-agency version, verify tasks generate without RICE fields, then redeploy agency version again. Full deploy complete by 11:00 AM.

## Rationale

**Problem:** Deploying all 6 modified edge functions simultaneously makes it impossible to isolate failures. A broken validator-start could be masked by a broken sprint-agent, or a subtle scoring regression could go unnoticed in a batch deploy.

**Solution:** Staged deployment with per-function verification. Deploy one function at a time, run a smoke test specific to that function, check logs and database for errors, then proceed. Test rollback on at least one function to confirm the escape hatch works.

**Impact:** Zero-downtime agency rollout. Any regression is caught before it affects more than one feature domain. Rollback is proven, not theoretical.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | deploy one EF at a time | I can isolate failures to a single function |
| Developer | verify each EF before moving on | I catch regressions early |
| Developer | test rollback on at least 1 function | I know the escape hatch works before I need it |
| Founder | continue using the app during deploy | I experience zero downtime |

## Goals

1. **Primary:** All 6 agency-enhanced edge functions deployed and verified in production
2. **Safety:** Each function verified independently before proceeding to next
3. **Recovery:** Rollback procedure tested and documented for at least 1 function
4. **Zero downtime:** Existing features work throughout the deploy process

## Acceptance Criteria

- [ ] `validator-start` deployed and verified (pipeline produces report with evidence_tier, bias_flags, signal_strength fields)
- [ ] `sprint-agent` deployed and verified (generated tasks include rice_score, kano_class, momentum_order)
- [ ] `investor-agent` deployed and verified (fit analysis returns MEDDPICC breakdown)
- [ ] `pitch-deck-agent` deployed and verified (generation output includes win_themes, challenger_narrative)
- [ ] `lean-canvas-agent` deployed and verified (coach response includes specificity_meter data)
- [ ] `ai-chat` deployed and verified (4 chat modes produce mode-specific responses)
- [ ] No 500 errors in Supabase edge function logs after each deploy
- [ ] `ai_runs` table shows new entries with correct agent_name for each deployed function
- [ ] Rollback procedure documented and successfully tested for at least 1 function
- [ ] All deploys use `--no-verify-jwt` flag (functions handle their own auth)

| Layer | File | Action |
|-------|------|--------|
| Infrastructure | `supabase/functions/validator-start/` | Deploy via CLI |
| Infrastructure | `supabase/functions/sprint-agent/` | Deploy via CLI |
| Infrastructure | `supabase/functions/investor-agent/` | Deploy via CLI |
| Infrastructure | `supabase/functions/pitch-deck-agent/` | Deploy via CLI |
| Infrastructure | `supabase/functions/lean-canvas-agent/` | Deploy via CLI |
| Infrastructure | `supabase/functions/ai-chat/` | Deploy via CLI |
| Verification | Supabase Dashboard | Check logs per function |
| Verification | SQL on `ai_runs` | Confirm new entries per function |
| Verification | Frontend | Smoke test each feature domain |
| Documentation | `agency/docs/deploy-runbook.md` | Create — deploy order, verify steps, rollback procedure |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Function deploy fails (CLI error) | Retry once. If persistent, check Supabase status page. Previous version stays live. |
| Function deploys but returns 500 | Check logs for error detail. Roll back to previous version. Fix and redeploy. |
| Fragment file missing on Supabase | `loadFragment()` returns empty string — function still works, just without agency enhancement. Not a deploy blocker. |
| Rate limit hit during verification | Wait 5 minutes (heavy tier: 5 requests per 5 minutes). Resume verification. |
| Supabase isolate cold start timeout | First request after deploy may take 3-5 seconds. Allow warm-up time before concluding failure. |
| Pipeline runs during deploy | In-progress pipelines use the previous function version. New requests get the new version. No conflict. |
| Rollback needed mid-deploy | Stop at current function. Roll back the broken one. Remaining functions stay at pre-agency versions (no harm, they just lack agency features). |
| ai_runs INSERT fails for new columns | If task 017 migration hasn't run, new columns don't exist. Fragment data silently dropped from INSERT (Supabase ignores unknown columns). Not a deploy blocker. |

## Real-World Examples

**Scenario 1 — Smooth sequential deploy:** Team deploys on Tuesday morning. validator-start goes first — pipeline completes in 92 seconds, report shows "Cited" evidence badge on Market dimension, "AI-inferred" on Execution dimension. Logs clean. sprint-agent next — 24 tasks generated, RICE scores ranging 22 to 91, Kano categories distributed as 8 Must-have, 10 Performance, 6 Delight. **With staged deploy,** each function is confirmed working before the next one goes live. Total deploy time: 90 minutes including verification.

**Scenario 2 — Failure isolation:** investor-agent deploy (step 3) returns 500 on the first fit analysis request. Logs show `TypeError: Cannot read property 'meddpicc' of undefined`. The MEDDPICC schema migration (task 006) added the column but the investor-agent is reading from the wrong field name. **With staged deploy,** validator-start and sprint-agent are already live and working. The team rolls back investor-agent to its pre-agency version, fixes the field name, and redeploys. Total downtime for investor features: 8 minutes. Other features unaffected.

**Scenario 3 — Rollback test:** After deploying all 6, the team tests rollback by reverting sprint-agent to its pre-agency version. Tasks generate without RICE scores or Kano classifications — confirming rollback works. They redeploy the agency version. **With a tested rollback,** the team has confidence that any future regression can be reverted in under 2 minutes.

## Outcomes

| Before | After |
|--------|-------|
| All 6 functions deployed simultaneously — failure isolation impossible | One function deployed at a time with per-function verification |
| No verification step between deploys | Each function smoke-tested before proceeding to next |
| Rollback is theoretical (never tested) | Rollback tested on at least 1 function, procedure documented |
| Failure in one function could mask failure in another | Each function verified independently — issues caught immediately |
| Deploy is a single high-risk event | Deploy is a sequence of low-risk steps over 90 minutes |
