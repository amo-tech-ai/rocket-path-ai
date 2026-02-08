# 109 - Share Links

> Generate unique shareable URLs for validation reports

---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator (share button), Public Report View |
| **Features** | Unique URLs, access control, view tracking |
| **Agents** | — |
| **Edge Functions** | — |
| **Use Cases** | Share reports without PDF, track views |
| **Real-World** | "Founder shares link → investor views report online" |

---

```yaml
---
task_id: 109-SHR
title: Share Links
diagram_ref: D-07
phase: MVP
priority: P2
status: Not Started
skill: /feature-dev
ai_model: —
subagents: [frontend-designer, supabase-expert]
edge_function: —
schema_tables: [report_shares, share_views]
depends_on: [106-validation]
---
```

---

## Description

Enable founders to generate unique shareable links for their validation reports. Links can be public or require email verification. Track view analytics so founders know when investors view their reports.

## Rationale

**Problem:** PDFs are static and can't track engagement.
**Solution:** Web-based shareable reports with analytics.
**Impact:** Founders see when investors engage with reports.

---

## Goals

1. **Primary:** Generate unique share URLs
2. **Secondary:** Track views and engagement
3. **Quality:** Links work without login

## Acceptance Criteria

- [ ] Share button generates unique URL
- [ ] Public view works without login
- [ ] Optional email gate for access
- [ ] View count tracked
- [ ] Founder sees view analytics
- [ ] Links can be revoked
- [ ] Copy-to-clipboard works

---

## Schema

### Table: report_shares

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| report_id | uuid | FK → validation_reports |
| share_token | text | UNIQUE, NOT NULL |
| is_public | boolean | default true |
| require_email | boolean | default false |
| expires_at | timestamptz | nullable |
| revoked_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

### Table: share_views

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| share_id | uuid | FK → report_shares |
| viewer_email | text | nullable |
| viewed_at | timestamptz | default now() |
| duration_seconds | integer | |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_report_shares.sql` | Create |
| Page | `src/pages/SharedReport.tsx` | Create |
| Component | `src/components/validator/ShareButton.tsx` | Create |
| Hook | `src/hooks/useShareLink.ts` | Create |
| Route | `src/App.tsx` | Add /share/:token route |

---

## URL Format

```
https://app.startupai.com/share/abc123xyz
                              └── 12-char token
```

---

## Verification

```bash
# Generate share link
# Copy link
# Open in incognito
# Verify report displays
# Check view count increments
```
