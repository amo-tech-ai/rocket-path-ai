# Deno Unit Test Implementation (Edge Functions)

> **Version:** 1.0 | **Date:** January 30, 2026  
> **Purpose:** Implement a robust test suite for Supabase Edge Functions using Deno.  
> **Target:** `prompt-pack`, `industry-expert-agent`, `onboarding-agent`

---

## Summary Table

| Service | Test Category | Main Test Cases | tool/Command |
|---------|---------------|-----------------|--------------|
| `prompt-pack` | Integration | Pack loading, Step execution, JWT verification | `supabase test db` |
| `industry-expert`| Content Logic | Category filtering, Context injection, Response grounding | `deno test` |
| `onboarding-agent`| Workflow | Session creation, Enrichment mapping, Step transitions | `deno test --allow-net` |
| Shared Utils | Unit | `formatContext`, `validateSchema`, `mapAction` | `deno test` |

---

## Description

This task focuses on the **Operational Integrity** of the backend intelligence layer. While the scripts for testing exist in `/scripts`, the actual test files (`*.test.ts`) need to be implemented within each edge function directory to allow for CI/CD validation. This ensures that changes to the prompt templates or industry data do not break the core AI workflows.

---

## Rationale

**Why unit testing is required:**
- **Reliability** — AI agents are non-deterministic; unit tests ensure the *plumbing* (JWTs, DB queries, input/output schemas) is deterministic.
- **Security** — Verify that RLS and JWT checks are correctly enforced in the Edge Runtime.
- **Developer Velocity** — Catch breaking changes in shared utilities before they hit production.

---

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| TEST-1 | `prompt-pack` has 90%+ branch coverage | `deno test --coverage` |
| TEST-2 | Tests run in a fresh local Supabase environment | `supabase start` + `supabase test db` |
| TEST-3 | Mock Supabase Client used for unit tests | Tests do not require a live DB connection where possible |
| TEST-4 | Edge cases handled (missing industry, invalid pack ID) | Test cases for error paths |
| TEST-5 | JWT presence verification | Test fails if `Authorization` header is missing |

---

## Implementation Workflow

### 1. Test Environment Setup
- Configure `deno.json` in the `/supabase/functions` directory.
- Set up `tests/_shared/mock-supabase.ts` to provide a mock client.

### 2. Implementation by Function
- **`prompt-pack`**:
  - Test that `loadPack` returns the correct steps from the DB.
  - Test that `executeStep` calls the AI provider with expected parameters.
- **`industry-expert`**:
  - Test that `getIndustryKnowledge` retrieves the correct categories.
  - Test that `injectContext` correctly replaces `{{INJECTION_POINTS}}`.

### 3. CI/CD Integration
- Add a `test:edge` script to `package.json`.
- Ensure tests run on every Pull Request.

---

## Key Test Scenarios

### Scenario 1: Industry-Specific Injection
**Input:** Industry: `fintech`, Category: `benchmarks`  
**Expectation:** The injected string contains "FinTech Unit Economics" and not "Fashion Margins".

### Scenario 2: Pack Step Sequencing
**Input:** Pack ID: `industry-validation`  
**Expectation:** Step 1 (Risk Analyst) must complete and its output must be available as input for Step 2 (Benchmark Comparison).

### Scenario 3: Auth Failure
**Input:** Request with expired or missing JWT.  
**Expectation:** Function returns `401 Unauthorized` without calling AI.

---

## Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| `deno_std` | Testing framework | ✅ Available |
| `supabase-js` | Mocking client | ✅ Available |
| `audit_log` table | Verifying logs creation | ✅ Exists |
