# Validator Report — Restore Point

> Date: 2026-02-08 11:59 AM
> Status: **WORKING** — 4th successful E2E run

---

## Latest Test Run

| Field | Value |
|-------|-------|
| Session | `5087933a-1ee5-45cd-948e-f6dc652802b9` |
| URL | `http://localhost:8080/validator/report/5087933a-1ee5-45cd-948e-f6dc652802b9` |
| Idea | AI-powered invoice factoring platform for SMBs |
| Score | **62/100** — CAUTION |
| Verified | AI Verified |
| All 14 sections | Populated |

### Agent Timings

| Agent | Time | Status |
|-------|------|--------|
| ExtractorAgent | 6.1s | OK |
| ResearchAgent | 26.5s | OK, Citations |
| CompetitorAgent | 30.8s | OK, Citations |
| ScoringAgent | 14.1s | OK |
| MVPAgent | 12.1s | OK |
| ComposerAgent | ~20s | OK |
| VerifierAgent | <1s | OK |

### Chat Flow
- 2 user messages to reach 8/8 coverage (100%)
- Follow-up question: "What's your unfair advantage or moat?"
- Generate button activated after 2nd message

---

## Report Content Summary

### Score: 62/100 CAUTION
While the $450B SME outsourcing SAM is massive and the shift from 'search' to 'structured intent' is timely, the lack of founder data and existing incumbent moats pose significant threats.

### Sections Verified

1. **Problem Clarity** — Operations managers waste hours vetting low-quality freelancers
2. **Customer Use Case** — VP Engineering needs React Native expert, AI generates spec + matches
3. **Market Sizing** — TAM $1,280B, SAM $450B, SOM $2.3B (3 sources)
4. **Competition Deep Dive** — Globality (high), A-Team (medium), Upwork Enterprise (high) (2 sources)
5. **Risks & Assumptions** — 3 risks: trust, CAC, AI vetting quality
6. **MVP Scope** — AI-powered Project Brief Generator for single niche
7. **Next Steps** — 4 steps with deliverables
8. **Scores Matrix** — 63/100, radar chart + factors breakdown rendering
9. **Technology Stack** — Feasibility HIGH, ~8 weeks, Next.js + OpenAI + Supabase
10. **Revenue Model** — Transaction commission, CAC $650, LTV $5K, 6.9x LTV/CAC
11. **Team & Hiring** — $23K burn, 3 gaps, 3 MVP roles
12. **Key Questions** — 3 questions (1 fatal: platform leakage)
13. **Resources & Links** — Market trends + competitor analysis with citations
14. **Financial Projections** — Revenue chart + 3 scenarios, 14mo break-even

### Visual Components Verified
- Score circle with gradient and verdict badge
- TAMSAMSOMChart (concentric circles) — Section 3
- DimensionScoresChart (radar) — Section 8
- FactorsBreakdownCard (market + execution) — Section 8
- Revenue AreaChart (conservative/moderate/aggressive) — Section 14
- Strengths/Concerns cards with actual data
- Sticky side navigation with 14 section links

---

## All Verified Runs (2026-02-08)

| # | Idea | Score | Total Time | Status |
|---|------|-------|------------|--------|
| 1 | Restaurant Menu Pricing | 72/100 | ~73s | All 7 agents OK |
| 2 | InboxPilot Email AI | 68/100 | ~67s | All 14 sections |
| 3 | AI Travel Planning | 62/100 | ~67s | Full report + charts |
| 4 | Invoice Factoring SMBs | 62/100 | ~85s | Full report + charts |

---

## Working File Versions

### Frontend
- `src/pages/ValidatorReport.tsx` — 14-section renderer with charts
- `src/pages/ValidateIdea.tsx` — Chat entry with 3-panel layout
- `src/pages/ValidatorProgress.tsx` — Pipeline progress UI
- `src/components/validator/chat/ValidatorChat.tsx` — Chat with follow-up + context-aware fallbacks
- `src/hooks/useValidatorPipeline.ts` — Pipeline trigger + polling
- `src/types/validation-report.ts` — Report type definitions

### Backend (Edge Functions — deployed)
- `validator-start` — Pipeline orchestrator (7 agents, 115s deadline)
- `validator-followup` — Chat follow-up (Gemini Flash, 25s)
- `validator-status` — Polling endpoint

### Shared
- `supabase/functions/_shared/gemini.ts` — Gemini client with Promise.race timeout fix
- `supabase/functions/validator-start/pipeline.ts` — Orchestrator with scoring injection fix
- `supabase/functions/validator-start/config.ts` — Agent timeouts and models
