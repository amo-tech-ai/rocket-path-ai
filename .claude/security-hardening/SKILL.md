---
name: security-hardening
description: Use when auditing RLS policies, hardening auth sessions, adding CSP headers, rotating secrets, or before shipping any feature to production. Triggers on "security", "RLS audit", "auth hardening", "CSP", "secrets", "ship to production".
---

# Security Hardening

## Overview

Structured workflow to audit and harden security before any feature ships. Covers RLS policies, auth sessions, environment secrets, CSP headers, and rate limiting.

## When to Use

- Before shipping ANY new table or feature to production
- After creating or modifying RLS policies
- When auditing authentication flow
- When rotating secrets or API keys
- When adding security headers

## Workflow

### Phase 1: RLS Audit

1. List all tables: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
2. Verify RLS enabled: `SELECT relname, relrowsecurity FROM pg_class WHERE relname = '<table>';`
3. List policies: `SELECT * FROM pg_policies WHERE tablename = '<table>';`
4. Verify every policy uses `auth.uid()` for user isolation
5. Test: user A cannot read user B's data
6. Test: anonymous users get zero rows on protected tables

**Pass:** Every public table has RLS with SELECT + INSERT + UPDATE + DELETE policies using `auth.uid()`.

### Phase 2: Auth Session Hardening

1. Verify Supabase client has `autoRefreshToken: true`
2. Confirm `<ProtectedRoute>` wraps all authenticated pages in `App.tsx`
3. Check `useAuth` handles expired sessions (redirect to login)
4. Verify OAuth callback doesn't leak tokens in URL params
5. Confirm no session data in `console.log` or error messages

### Phase 3: Environment & Secrets

1. Scan: `grep -r "sk-\|sk_live\|SUPABASE_SERVICE" src/`
2. Verify `.env` in `.gitignore`
3. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` exposed to client
4. Edge functions use `Deno.env.get()`, never hardcoded
5. No secrets in git history

### Phase 4: Security Headers

1. `Content-Security-Policy` configured
2. `X-Frame-Options: DENY`
3. `X-Content-Type-Options: nosniff`
4. `Referrer-Policy: strict-origin-when-cross-origin`

### Phase 5: Rate Limiting

1. Rate limits on public edge functions
2. Per-IP: 100 req/min API, 10/min auth
3. Return `429` with `Retry-After` header

## Checklist

- [ ] All tables have RLS enabled
- [ ] All RLS policies use `auth.uid()`
- [ ] No cross-user data leakage
- [ ] Sessions auto-refresh, no tokens in URLs
- [ ] Zero hardcoded secrets in source
- [ ] `.env` in `.gitignore`
- [ ] Security headers configured
- [ ] Rate limiting on public endpoints

## References

- `.claude/supabase/references/RLS-POLICIES.md`
- `.claude/edge-functions/references/SECURITY.md`
- `plan/audit/` — Previous audit reports
