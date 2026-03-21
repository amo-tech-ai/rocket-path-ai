# Validator Manual Test — Chat + Validation Report

**Prereq:** Dev server on port 8080, signed in.

## Quick Test

1. **Homepage** → Paste idea (>10 chars) → Click **Generate** or Enter
2. **Validate** → Chat loads with your idea, AI asks follow-ups
3. Answer 2–3 questions (or paste substantial text)
4. **Generate** enables → Click **Generate**
5. **Validator Progress** → Wait ~30s for pipeline
6. **Report** → 14-section validation report loads

## Acceptance

- [ ] No 401 on `validator-followup` or `validator-start`
- [ ] Generate enables after sufficient coverage (or substantial single message)
- [ ] Report completes without errors
- [ ] DEV_BYPASS banner (if on) shows when no JWT

## With DEV_BYPASS_AUTH

- Set `VITE_DEV_BYPASS_AUTH=true` in `.env.local`
- UI bypasses login; Edge Functions still need JWT
- Either: sign in for real, or run `supabase functions serve --no-verify-jwt` locally
