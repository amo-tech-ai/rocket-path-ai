# CORE Phase Roadmap

> **Version:** 1.0 | **Updated:** 2026-02-02
> **Phase Question:** Can it work at all?
> **Milestone:** Users can complete the basic flow end-to-end

---

## Executive Summary

The CORE phase establishes the foundational infrastructure for StartupAI. This phase focuses on building the essential architecture, authentication, data persistence, and basic user journey that all future features depend on.

**Key Objectives:**
- Establish technical architecture and database schema
- Implement OAuth authentication (Google + LinkedIn)
- Create onboarding wizard flow
- Define 10-stage startup lifecycle navigation
- Enable website scraping and data extraction

---

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CORE PHASE                               │
├─────────────────────────────────────────────────────────────────┤
│  Week 1-2          │  Week 3-4          │  Week 5-6             │
│  ─────────         │  ─────────         │  ─────────            │
│  D-01 Context      │  D-05 Onboarding   │  D-03 Journey         │
│  D-02 Container    │  D-04 Lifecycle    │  CORE COMPLETE        │
│  D-09 Schema       │                    │                        │
├─────────────────────────────────────────────────────────────────┤
│  Deliverable:      │  Deliverable:      │  Deliverable:         │
│  Architecture      │  User can sign up  │  Full flow works      │
│  defined           │  and navigate      │  end-to-end           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagrams in This Phase

| ID | Name | Type | Purpose | Skills |
|----|------|------|---------|--------|
| D-01 | System Context | C4 Context | High-level system overview | architecture |
| D-02 | Container Architecture | C4 Container | Technical architecture | architecture, supabase |
| D-03 | Founder Journey | Journey | User experience mapping | ux-design |
| D-04 | Lifecycle States | State | 10-stage startup lifecycle | lean-canvas, startup-expertise |
| D-05 | Onboarding Flow | Flowchart | New user onboarding | frontend-design, api-wiring |
| D-09 | Database Schema | ER | Data model | database-migration, supabase-schema |

---

## Behaviors to Implement

### B-01: User Authentication
```
User can sign up via OAuth (Google/LinkedIn)
├── Google OAuth flow works
├── LinkedIn OAuth flow works
├── Session persists across refreshes
└── Logout clears session
```

**Acceptance Criteria:**
- [ ] User sees "Sign in with Google" button
- [ ] User sees "Sign in with LinkedIn" button
- [ ] OAuth callback redirects to dashboard
- [ ] Session token stored securely
- [ ] Logout clears all session data

### B-02: Website Scraping
```
System can scrape and extract website data
├── URL validation works
├── Firecrawl integration functional
├── Data extraction returns structured JSON
└── Error handling for invalid URLs
```

**Acceptance Criteria:**
- [ ] User can enter a URL
- [ ] System validates URL format
- [ ] Firecrawl extracts page content
- [ ] AI processes content into structured data
- [ ] Errors display user-friendly messages

### B-03: Lifecycle Navigation
```
User can navigate 10-stage lifecycle
├── Stage selector visible
├── Current stage highlighted
├── Stage transitions work
└── Stage-specific content loads
```

**Acceptance Criteria:**
- [ ] All 10 stages visible in navigation
- [ ] User can select any stage
- [ ] Current stage indicator present
- [ ] Stage content updates on selection

### B-04: Onboarding Wizard
```
User can complete onboarding wizard
├── Step 1: Company basics
├── Step 2: Website extraction
├── Step 3: Industry selection
├── Step 4: Traction & funding
└── Dashboard redirect on complete
```

**Acceptance Criteria:**
- [ ] 4-step wizard flow works
- [ ] Progress indicator shows current step
- [ ] Back/Next navigation works
- [ ] Data persists between steps
- [ ] Completion redirects to dashboard

### B-05: Data Persistence
```
Data persists in PostgreSQL
├── Startup record created on signup
├── Onboarding data saved
├── RLS policies enforce isolation
└── Data survives page refresh
```

**Acceptance Criteria:**
- [ ] Startup created with user_id
- [ ] Onboarding data updates startup record
- [ ] User can only access own data
- [ ] Data persists across sessions

---

## Now-Next-Later Breakdown

### NOW (Weeks 1-2) — Architecture & Schema

| Initiative | Owner | Status | Target |
|------------|-------|--------|--------|
| D-01: Define system context diagram | Architecture | ⬜ | Week 1 |
| D-02: Design container architecture | Architecture | ⬜ | Week 1 |
| D-09: Create database schema | Backend | ⬜ | Week 2 |
| Set up Supabase project | Backend | ⬜ | Week 1 |
| Configure OAuth providers | Backend | ⬜ | Week 2 |
| Implement RLS policies | Backend | ⬜ | Week 2 |

### NEXT (Weeks 3-4) — Onboarding & Lifecycle

| Initiative | Depends On | Est. Effort |
|------------|------------|-------------|
| D-05: Build onboarding wizard | D-09 Schema | 2 weeks |
| D-04: Implement lifecycle states | D-09 Schema | 1 week |
| Website extraction integration | OAuth complete | 1 week |
| Dashboard shell | Onboarding complete | 0.5 weeks |

### LATER (Weeks 5-6) — Polish & Journey

| Theme | Strategic Value | Open Questions |
|-------|-----------------|----------------|
| D-03: Map founder journey | UX optimization | Which stages need most help? |
| Error handling polish | User trust | What error states exist? |
| Performance optimization | User experience | Target load times? |

---

## Dependencies Map

```
[OAuth Setup] ──blocks──> [Onboarding Wizard]
[Database Schema] ──blocks──> [Lifecycle States]
[Database Schema] ──blocks──> [Onboarding Wizard]
[Firecrawl API] ──requires──> [External: Firecrawl Account]
[Google OAuth] ──requires──> [External: Google Cloud Project]
[LinkedIn OAuth] ──requires──> [External: LinkedIn App]
```

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| OAuth provider rate limits | High | 20% | Implement caching, retry logic |
| Firecrawl API changes | Medium | 30% | Abstract extraction layer |
| Schema migration issues | High | 15% | Test migrations in staging first |
| RLS policy gaps | High | 25% | Security audit before launch |

---

## Success Metrics

| Metric | Current | Target | Timeframe |
|--------|---------|--------|-----------|
| Signup completion rate | 0% | 80% | Week 6 |
| Onboarding completion rate | 0% | 70% | Week 6 |
| OAuth success rate | 0% | 99% | Week 2 |
| Page load time (p95) | N/A | <2s | Week 6 |
| Data extraction success | 0% | 85% | Week 4 |

---

## Task Checklist

### Week 1: Foundation
- [ ] Create Supabase project
- [ ] Configure Google OAuth provider
- [ ] Configure LinkedIn OAuth provider
- [ ] Create D-01 system context diagram
- [ ] Create D-02 container architecture diagram
- [ ] Set up Vite + React project structure

### Week 2: Schema & Auth
- [ ] Create D-09 database schema diagram
- [ ] Implement startup table migration
- [ ] Implement user profile migration
- [ ] Create RLS policies for all tables
- [ ] Build useAuth hook
- [ ] Test OAuth flows end-to-end

### Week 3: Onboarding (Part 1)
- [ ] Create D-05 onboarding flow diagram
- [ ] Build Step 1: Company basics form
- [ ] Build Step 2: Website extraction
- [ ] Integrate Firecrawl API
- [ ] Build AI extraction processing

### Week 4: Onboarding (Part 2)
- [ ] Create D-04 lifecycle states diagram
- [ ] Build Step 3: Industry selection
- [ ] Build Step 4: Traction & funding
- [ ] Implement lifecycle state machine
- [ ] Build dashboard shell

### Week 5: Journey & Polish
- [ ] Create D-03 founder journey diagram
- [ ] Add error handling throughout
- [ ] Add loading states
- [ ] Add form validation
- [ ] Performance optimization

### Week 6: Validation
- [ ] End-to-end testing
- [ ] Security audit
- [ ] User testing (5 users)
- [ ] Bug fixes
- [ ] CORE phase complete

---

## Validation Criteria

**CORE Phase is complete when:**
1. ✅ User can sign up via Google or LinkedIn OAuth
2. ✅ User completes 4-step onboarding wizard
3. ✅ Website data is extracted and processed
4. ✅ User lands on dashboard with startup data visible
5. ✅ Data persists across sessions
6. ✅ User can only access their own data (RLS working)

---

## Skills Used

| Skill | Purpose in CORE |
|-------|-----------------|
| `supabase-auth` | OAuth configuration |
| `supabase-schema` | Database design |
| `supabase-create-rls-policies` | Data isolation |
| `frontend-design` | Onboarding UI |
| `api-wiring` | Firecrawl integration |
| `database-migration` | Schema changes |

---

*Generated by Claude Code — 2026-02-02*
