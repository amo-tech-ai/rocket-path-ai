---
name: edge-functions
description: Alias for edge-function-creator. Use when creating, modifying, or deploying Supabase Edge Functions. Triggers on "edge function", "create function", "deploy function", "serverless", "Deno function", "new endpoint".
alias_of: edge-function-creator
---

# Edge Functions

> **Alias:** This skill redirects to `/edge-function-creator` for all edge function operations.

## Overview

This is an alias for the `edge-function-creator` skill. Use `/edge-functions` or `/edge-function-creator` interchangeably for:

- Creating new edge functions
- Modifying existing functions
- Deploying functions
- Adding AI integration to functions

## Quick Reference

See `.claude/edge-function-creator/SKILL.md` for the full workflow.

### Key Commands

```bash
supabase functions serve <name> --env-file .env.local  # Local testing
supabase functions deploy <name>                        # Deploy
supabase secrets set KEY=value                          # Set secrets
```

### Checklist

- [ ] CORS headers on all responses
- [ ] JWT verification enabled by default
- [ ] Action routing via switch
- [ ] Supabase client with user JWT
- [ ] Error handling returns JSON with status codes
- [ ] Env vars via `Deno.env.get()`, never hardcoded

## References

- `.claude/edge-function-creator/SKILL.md` - Full workflow
- `.claude/edge-functions/references/` - Architecture and integration patterns
