# Prompt 09 — Testing & QA Strategy

> **Phase:** Foundation | **Priority:** P1 | **Overall:** 40%
> **No code — test strategy, coverage targets, and QA checklists only**

---

## Test Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit tests | Vitest | Component logic, utility functions, hooks |
| Component tests | Vitest + React Testing Library | UI rendering, user interactions |
| Integration tests | Vitest | Hook + API integration, form submissions |
| E2E tests | Browser automation (Claude Chrome) | Full user flows across pages |
| Edge function tests | curl + Vitest | API contract testing |

---

## Test Commands

| Command | What It Does |
|---------|-------------|
| `npm run test` | Run all Vitest tests once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## Coverage Targets

| Area | Target | Priority |
|------|--------|----------|
| Auth flows | 90% | P0 |
| Edge function actions | 80% | P0 |
| React hooks (data fetching) | 80% | P0 |
| Form validation schemas | 100% | P0 |
| UI components | 60% | P1 |
| Utility functions | 90% | P1 |
| Page components | 50% | P2 |

---

## QA Checklist — Per Module

### Before Marking Module Complete

| Check | Description |
|-------|-------------|
| Auth | All routes protected; redirect works for unauthenticated users |
| Data loading | Lists load with skeleton states; empty states shown correctly |
| CRUD operations | Create, read, update, delete all work with success/error toasts |
| AI actions | Each AI button triggers correct edge function and shows loading state |
| Validation | Form validation errors shown inline; invalid submissions prevented |
| Responsive | Layout works at XL, LG, MD, SM breakpoints |
| Error handling | Network errors show user-friendly messages; retry available |
| Autosave | Changes save within 2 seconds where applicable |
| Navigation | Breadcrumbs correct; back navigation preserves state |
| Accessibility | Keyboard navigation works; focus states visible; labels on inputs |

---

## Edge Function Testing

### Test Matrix Per Agent

| Test Type | What to Verify |
|-----------|---------------|
| Auth | Rejects missing JWT; rejects invalid JWT; accepts valid JWT |
| Input validation | Rejects missing required fields; rejects invalid UUIDs; rejects invalid action |
| Happy path | Each action returns correct response shape |
| Error handling | AI timeout returns 504; DB error returns 500; invalid data returns 400 |
| RLS | User A cannot access User B's data through the function |
| Rate limiting | Excessive calls return 429 |

### Test via curl

For each edge function, test with:

1. No auth header (expect 401)
2. Valid auth + invalid action (expect 400)
3. Valid auth + valid action + missing required fields (expect 400)
4. Valid auth + valid action + correct data (expect 200)

---

## Browser Testing (E2E Flows)

### Critical User Journeys

| # | Flow | Steps | Pass Criteria |
|---|------|-------|---------------|
| 1 | New user onboarding | Sign up, 4-step wizard, reach dashboard | Dashboard loads with startup data |
| 2 | Lean canvas creation | Open canvas, AI prefill, edit boxes, save | Canvas saved with all 9 boxes |
| 3 | Pitch deck generation | Wizard steps, generate, view slides | 12 slides generated and viewable |
| 4 | CRM contact enrichment | Add contact, click Enrich, view enriched data | Contact updated with AI data |
| 5 | Deal pipeline management | Create deal, drag between stages, view AI score | Deal stage updates correctly |
| 6 | Investor discovery | Click Discover, view ranked list, check fit score | Investors sorted by fit |
| 7 | Document generation | Select template, generate, view document | Document created with AI content |
| 8 | AI chat conversation | Send message, receive response, follow action link | Chat response appears with sources |

---

## Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load (dashboard) | < 2 seconds | First contentful paint |
| AI action response | < 3 seconds | From click to result displayed |
| Deck generation | < 30 seconds | 12 slides complete |
| Form submission | < 500ms | Save confirmation shown |
| Route navigation | < 300ms | Next page visible |
| Autosave | 2 second debounce | From last keystroke to saved indicator |

---

## Smart AI QA Automation

The Smart AI system adds automated QA validation (see `03.1-smart-ai-system.md`):

| Feature | Description |
|---------|-------------|
| Automated acceptance criteria checking | QA Reviewer agent tests each criterion programmatically |
| Fix loop | QA Fixer agent resolves failures, max 8 iterations |
| Escalation | After 8 failures, task escalates to human review |
| QA results table | `ai_qa_results` tracks pass/fail per criterion per iteration |
| QA Dashboard | Visual pass/fail checklist with real-time streaming |

This automated QA layer runs before human review, catching issues before founders see them. Target: 90% first-pass QA rate (from current ~60%).

---

## Acceptance Criteria

- All critical user journeys pass in browser testing
- Edge functions reject invalid auth and bad input
- Forms validate before submission
- Error states are user-friendly (no raw error messages)
- Performance benchmarks met for page load and AI response times
- Responsive layout verified at all 4 breakpoints
