# Edge Functions Deployment Best Practices

**Document:** 10-deployment.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Deploy to Production](https://supabase.com/docs/guides/functions/deploy)

---

## Overview

This guide covers deployment best practices, CI/CD integration, and production configuration.

---

## Deployment Process

### ✅ CORRECT: Deploy Single Function

```bash
# Deploy specific function
supabase functions deploy ai-helper
```

### ✅ CORRECT: Deploy All Functions

```bash
# Deploy all functions
supabase functions deploy
```

### ✅ CORRECT: Deploy Public Function

```bash
# Deploy without JWT verification (webhooks)
supabase functions deploy stripe-webhook --no-verify-jwt
```

---

## Pre-Deployment Checklist

- [ ] All secrets set in production
- [ ] `deno.json` configured per function
- [ ] JWT verification configured correctly
- [ ] Error handling implemented
- [ ] CORS headers included (if needed)
- [ ] Cost tracking implemented
- [ ] Logging added
- [ ] Function tested locally

---

## CI/CD Integration

### ✅ CORRECT: GitHub Actions

```yaml
name: Deploy Functions

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy --project-ref $PROJECT_ID
```

---

## Environment Variables

### ✅ CORRECT: Set Production Secrets

```bash
# Set individual secret
supabase secrets set GEMINI_API_KEY=your-key

# Set from .env file
supabase secrets set --env-file .env

# List all secrets
supabase secrets list
```

**Rules:**
- ✅ Never commit `.env` files
- ✅ Set secrets before deployment
- ✅ Secrets available immediately (no redeploy needed)

---

## Function Configuration

### ✅ CORRECT: config.toml

```toml
# supabase/config.toml

# Public webhook (no JWT)
[functions.stripe-webhook]
verify_jwt = false

# Custom entrypoint
[functions.legacy-processor]
entrypoint = './functions/legacy-processor/index.js'
```

---

## Best Practices

### ✅ DO

1. **Set secrets first** - Before deployment
2. **Test locally** - Verify before deploying
3. **Use CI/CD** - Automated deployments
4. **Configure per function** - In config.toml
5. **Monitor deployments** - Check logs after deploy

### ❌ DON'T

1. **Don't deploy without secrets** - Functions will fail
2. **Don't skip local testing** - Test before deploy
3. **Don't commit secrets** - Security risk
4. **Don't ignore deployment errors** - Fix before proceeding

---

## References

- **Official Docs:** [Deploy to Production](https://supabase.com/docs/guides/functions/deploy)
- **Next:** [11-testing.md](./11-testing.md)

---

**Last Updated:** February 2026
