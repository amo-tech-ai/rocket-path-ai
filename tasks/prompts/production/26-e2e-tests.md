---
task_id: PROD-07
title: E2E Tests (Playwright — Critical User Flows)
phase: PRODUCTION
priority: P1
status: Not Started
estimated_effort: 3 days
skill: [design/frontend-design]
subagents: [code-reviewer]
schema_tables: []
depends_on: [PROD-01]
---

# Prompt 07: E2E Tests with Playwright

> **Priority:** P1 | **Current:** 389 unit/integration tests, 0 E2E tests
> **Affects:** Auth flow, validator pipeline, report viewing, dashboard

---

## Summary

| Aspect | Details |
|--------|---------|
| **Scope** | Playwright setup + 5 critical flow tests |
| **Screens** | Login, Dashboard, Validator Chat, Progress, Report |
| **Targets** | 5 E2E test suites covering critical user journeys |
| **Real-World** | "Playwright catches that the validator chat page errors after a Supabase migration" |

## Description

**The situation:** The app has 389 unit and integration tests — all passing. But none of them test what a real user does: log in, navigate to the validator, type answers, watch the pipeline run, and read the report. A database migration could break the report page, and no test would catch it until a founder reports it.

**Why it matters:** Unit tests verify that individual hooks and components work in isolation. But real bugs happen at the seams — between the auth system and the dashboard, between the chat page and the edge function, between the progress page and the report page. E2E tests catch these integration failures before users do.

**What already exists:** Vitest handles unit and integration tests. The app runs on `localhost:8200` via Vite. Supabase provides a test user (`ai@sunai.one`). All critical flows work manually today.

**The build:** Install Playwright. Configure it to run against the dev server. Create 5 test suites for critical user flows: (1) Auth — login with test credentials, verify dashboard loads, logout. (2) Validator Chat — navigate to `/validate`, answer questions, verify chat UI works. (3) Dashboard — verify health card, recent reports, and navigation links render. (4) Report View — navigate to an existing report, verify sections render, navigate between dimensions. (5) Settings — verify settings page loads, profile section renders.

**Example:** A developer pushes a migration that accidentally drops the `report_version` column. The unit tests all pass (they mock Supabase). But the E2E test for Report View fails: "Expected element [data-testid='report-score'] to be visible, but page shows 'Something went wrong.'" The developer catches the bug before it reaches production.

## Rationale

**Problem:** 389 unit tests but 0 E2E tests. Real integration bugs between pages, auth, and the database go undetected until users report them.
**Solution:** Add Playwright E2E tests for the 5 most critical user flows.
**Impact:** Catches page-level regressions before they reach users. Confidence to deploy after migrations.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | run E2E tests before deploying | I know the critical flows still work |
| Developer | see which page broke after a migration | I can fix it before users notice |
| Admin | trust that auth and data isolation work | I know users can only see their own data |

## Goals

1. **Primary:** 5 E2E test suites covering critical user journeys
2. **Quality:** Tests run in < 60 seconds
3. **Setup:** Playwright configured with CI-friendly settings

## Acceptance Criteria

- [ ] Playwright installed and configured (`playwright.config.ts`)
- [ ] Test helper for authenticated sessions (reuse auth state)
- [ ] Test 1: Auth flow — login, verify dashboard, logout
- [ ] Test 2: Validator chat — navigate, type message, verify UI response
- [ ] Test 3: Dashboard — health card, recent reports, navigation links visible
- [ ] Test 4: Report view — open existing report, verify score and sections render
- [ ] Test 5: Settings — page loads, profile section visible
- [ ] All tests pass against dev server
- [ ] `npx playwright test` runs cleanly
- [ ] Test fixtures use test user credentials (not hardcoded in source — use env vars)

## Research Before Implementation

- Read `vite.config.ts` for dev server port (currently 8200)
- Check if test user `ai@sunai.one` has valid credentials in `.env.local`
- Read `src/App.tsx` for route structure and protected routes
- Check existing test patterns in `src/test/` for conventions

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Config | `playwright.config.ts` | Create — base URL, timeouts, retries, reporter |
| Config | `package.json` | Modify — add `test:e2e` script |
| Auth | `e2e/auth.setup.ts` | Create — login once, save auth state for reuse |
| Test | `e2e/auth-flow.spec.ts` | Create — login, dashboard load, logout |
| Test | `e2e/validator-chat.spec.ts` | Create — navigate to /validate, type, verify |
| Test | `e2e/dashboard.spec.ts` | Create — verify health card, reports, nav links |
| Test | `e2e/report-view.spec.ts` | Create — open report, check score, navigate sections |
| Test | `e2e/settings.spec.ts` | Create — page load, profile section |
| Fixture | `e2e/fixtures.ts` | Create — test data helpers, page object models |

### Playwright Config

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:8200',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 8200,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'tests',
      dependencies: ['setup'],
      use: { storageState: 'e2e/.auth/user.json' },
    },
  ],
});
```

### Auth Setup Pattern

```typescript
// e2e/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/auth');
  await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
```

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Dev server not running | Playwright starts it via `webServer` config |
| Test user doesn't exist | Fail with clear error message about missing env vars |
| Auth state expires between tests | Re-run auth setup automatically |
| Report page has no data | Test creates minimal test data or uses known test report |
| Flaky test due to loading state | Use `waitForSelector` with reasonable timeout |
| CI environment has no browser | Install with `npx playwright install --with-deps chromium` |

## Real-World Examples

**Scenario 1 — Migration regression:** A developer adds a new column to `validator_reports` and accidentally changes the SELECT query in `useValidatorReport`. All 389 unit tests pass because they mock the hook. The Playwright report-view test fails: the report page shows a blank screen. The developer sees the failure in CI before merging.

**Scenario 2 — Auth token expiry:** The Supabase JWT TTL is reduced from 1 hour to 15 minutes. Unit tests don't test real tokens. The E2E auth test catches that the dashboard redirects to login after 15 minutes of inactivity, verifying the refresh flow works.

## Outcomes

| Before | After |
|--------|-------|
| 389 unit tests, 0 E2E tests | 389 unit + 5 E2E test suites |
| Page-level regressions undetected | Critical flows verified on every change |
| Manual testing before deploys | Automated verification in < 60s |
| Auth flow untested end-to-end | Login/logout cycle verified |
