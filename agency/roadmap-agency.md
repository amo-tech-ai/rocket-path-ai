# Agency-Enhanced Features — Implementation Roadmap

> **Created:** 2026-03-12
> **Source:** `agency/prd-agency.md` + `agency/wireframes/`
> **Total:** ~80 tasks, 5 phases, ~15 days solo

---

## Phase Overview

| Phase | Days | Focus | Key Outcome |
|-------|------|-------|-------------|
| **CORE** | 3 | Loader + Validator | Agent loader runtime proven, validator reports enriched |
| **MVP** | 5 | 4 Screens + Chat Modes | All 6 screens enhanced, 4 chat modes live |
| **POST-MVP** | 3 | Polish + Persistence | Chat sessions saved, right panels rich, nudges active |
| **ADVANCED** | 2 | Analytics + Optimization | Quality tracking, caching, remaining polish |
| **PRODUCTION** | 2 | Hardening + Deploy | 38+ tests, backward compat, staged rollout |

---

## CORE — Foundation + Validator (3 days)

Prove the loader pattern, wire the highest-value screen.

### C-01: Agent Loader Runtime (0.5d)

**File:** `agency/lib/agent-loader.ts`

- [ ] `loadFragment(name)` — reads `agency/prompts/{name}.md`, returns string
- [ ] `loadChatMode(name)` — reads `agency/chat-modes/{name}.md`, returns string
- [ ] File caching (read once per cold start)
- [ ] Graceful fallback: if file missing, log warning + return empty string
- [ ] Export both from barrel

**Test:** Import in any edge function, verify fragment text loads.

### C-02: Validator Scoring Fragment (1d)

**Fragment:** `agency/prompts/validator-scoring-fragment.md`
**Target:** `supabase/functions/validator-start/agents/scoring.ts`

- [ ] Import `loadFragment('validator-scoring-fragment')`
- [ ] Append to scoring system prompt
- [ ] New optional fields in scoring output: `evidence_tier`, `bias_flags[]`, `signal_strength`
- [ ] All new fields optional — existing reports unaffected
- [ ] Deploy `validator-start`

### C-03: Validator Composer Fragment (1d)

**Fragment:** `agency/prompts/validator-composer-fragment.md`
**Target:** `supabase/functions/validator-start/agents/composer.ts`

- [ ] Import `loadFragment('validator-composer-fragment')`
- [ ] Append to composer system prompt (Group A + Group D)
- [ ] New optional fields: `narrative_arc`, `win_themes[]`, `ice_channels[]`
- [ ] Three-act exec summary structure (Setup / Conflict / Resolution)
- [ ] ICE-scored growth channels in Group C
- [ ] Deploy `validator-start`

### C-04: Report UI — Agency Badges (0.5d)

**Target:** `src/components/validator/report/`

- [ ] Evidence tier badges on scored dimensions (Cited > Founder > AI-inferred)
- [ ] Bias flag amber banner when `bias_flags.length > 0`
- [ ] ICE score chips on growth channel recommendations
- [ ] All components check for field existence before rendering (backward compat)

---

## MVP — 4 Screens + Chat Modes (5 days)

Wire remaining fragments + chat modes. Each task is independent after C-01.

### M-01: Sprint Board — RICE + Kano (1d)

**Fragment:** `agency/prompts/sprint-agent-fragment.md`
**Target:** `supabase/functions/sprint-agent/index.ts`

- [ ] Import `loadFragment('sprint-agent-fragment')`
- [ ] Append RICE scoring + Kano classification to system prompt
- [ ] New optional task fields: `rice_score`, `kano_class`, `momentum_order`
- [ ] Frontend: RICE score badge on task cards
- [ ] Frontend: Kano filter tabs (Must-have / Performance / Delight)
- [ ] Deploy `sprint-agent`

### M-02: Investor Pipeline — MEDDPICC + Email (1d)

**Fragment:** `agency/prompts/crm-investor-fragment.md`
**Target:** `supabase/functions/investor-agent/index.ts`

- [ ] Import `loadFragment('crm-investor-fragment')`
- [ ] Append to investor-agent system prompt
- [ ] New optional fields: `meddpicc_score` (/40), `deal_verdict`, `signal_data`
- [ ] Migration: add `meddpicc_score int`, `deal_verdict text`, `signal_data jsonb` to `investors`
- [ ] Frontend: MEDDPICC score badge on investor cards
- [ ] Frontend: Deal verdict pill (Strong Buy / Buy / Hold / Pass)
- [ ] Deploy `investor-agent`

### M-03: Pitch Deck — Challenger + Persuasion (1d)

**Fragment:** `agency/prompts/pitch-deck-fragment.md`
**Target:** `supabase/functions/pitch-deck-agent/index.ts`

- [ ] Import `loadFragment('pitch-deck-fragment')`
- [ ] Append to pitch-deck-agent system prompt
- [ ] New optional fields per slide: `win_theme`, `narrative_step`, `persuasion_technique`
- [ ] Frontend: Win theme label above each slide in editor
- [ ] Frontend: Narrative arc indicator (which Challenger step)
- [ ] Deploy `pitch-deck-agent`

### M-04: Lean Canvas — Specificity + Evidence (0.5d)

**Fragment:** Uses composer fragment (already wired in C-03)
**Target:** `supabase/functions/lean-canvas-agent/index.ts`

- [ ] Canvas coach now references feedback-synthesizer + behavioral-nudge skills
- [ ] New optional coach output fields: `specificity_score`, `evidence_gaps[]`
- [ ] Frontend: Specificity meter per canvas box (vague / specific / quantified)
- [ ] Deploy `lean-canvas-agent`

### M-05: AI Chat — Mode Selector + 4 Modes (1.5d)

**Chat modes:** `agency/chat-modes/*.md` (4 files)
**Target:** `supabase/functions/ai-chat/index.ts`

- [ ] Import `loadChatMode(mode)` in ai-chat
- [ ] Add `mode` field to chat request body
- [ ] Mode selector UI: 4 cards (Practice Pitch, Growth Strategy, Deal Review, Canvas Coach)
- [ ] Each mode loads its system prompt from `agency/chat-modes/`
- [ ] Default mode = general (existing behavior, no chat-mode prompt)
- [ ] Frontend: Mode indicator pill in chat header
- [ ] Frontend: Mode-specific quick actions (e.g., "Score my pitch" in Practice Pitch)
- [ ] Deploy `ai-chat`

---

## POST-MVP — Polish + Persistence (3 days)

Rich panels, saved sessions, nudge system.

### P-01: Chat Mode Session Persistence (0.5d)

- [ ] Optional `chat_mode_sessions` table (id, user_id, mode, messages jsonb, created_at)
- [ ] Migration with RLS
- [ ] Save/resume chat sessions per mode
- [ ] Session list in mode selector sidebar

### P-02: Practice Pitch Right Panel (0.5d)

- [ ] Real-time pitch scoring (clarity, conviction, data, ask)
- [ ] Score breakdown cards update after each user message
- [ ] Investor objection library (top 10 common objections)

### P-03: Growth Strategy Right Panel (0.5d)

- [ ] AARRR funnel visualization
- [ ] ICE-scored experiment cards
- [ ] Channel recommendation chips

### P-04: Behavioral Nudge System (1d)

**Skill:** `.agents/skills/behavioral-nudge/SKILL.md`

- [ ] `NudgeBanner` component — contextual prompts based on user state
- [ ] Triggers: empty canvas box, stale sprint, low coverage score
- [ ] 3 nudge types: progress (green), suggestion (blue), warning (amber)
- [ ] Dismiss + snooze (24h) support
- [ ] Wire into: Dashboard, Lean Canvas, Sprint Board

### P-05: Export Overlays (0.5d)

- [ ] Validator report PDF: include evidence tiers + bias flags
- [ ] Sprint board export: include RICE scores
- [ ] Investor pipeline export: include MEDDPICC scores

---

## ADVANCED — Analytics + Optimization (2 days)

### A-01: Agency Quality Tracking (0.5d)

- [ ] Log which fragments were loaded per EF invocation (in `ai_runs` table)
- [ ] Track before/after quality signal (e.g., evidence tier distribution)
- [ ] Dashboard widget: fragment usage heatmap

### A-02: Fragment Caching (0.5d)

- [ ] Cache loaded fragments in module scope (already cold-start cached in C-01)
- [ ] Add cache TTL for dev iteration (5min in dev, infinite in prod)
- [ ] Measure cold-start impact

### A-03: Remaining Right Panels (0.5d)

- [ ] Deal Review mode: MEDDPICC breakdown panel
- [ ] Canvas Coach mode: feedback synthesis panel
- [ ] Shared `AgencyInsightCard` component for consistent styling

### A-04: MEDDPICC Detail Sheet (0.5d)

- [ ] Expandable investor detail sheet with 8 MEDDPICC dimensions
- [ ] Score per dimension (0-5) with explanation
- [ ] Suggested actions per weak dimension

---

## PRODUCTION — Hardening + Deploy (2 days)

### PROD-01: Backward Compatibility Verification (0.5d)

- [ ] Run existing validator pipeline — verify old reports still render
- [ ] Run sprint agent — verify existing tasks unaffected
- [ ] Run investor agent — verify existing investors unaffected
- [ ] Run pitch deck agent — verify existing decks unaffected
- [ ] Run lean canvas agent — verify existing canvases unaffected
- [ ] Run ai-chat — verify general mode works without mode param

### PROD-02: Test Suite (1d)

- [ ] `agent-loader.test.ts` — loadFragment, loadChatMode, missing file fallback (6 tests)
- [ ] `validator-agency.test.ts` — evidence tiers, bias flags, ICE channels render (8 tests)
- [ ] `sprint-agency.test.ts` — RICE badges, Kano filter tabs (6 tests)
- [ ] `investor-agency.test.ts` — MEDDPICC badge, deal verdict pill (6 tests)
- [ ] `pitch-deck-agency.test.ts` — win theme label, narrative step (4 tests)
- [ ] `chat-modes.test.ts` — mode selector, mode switch, quick actions (8 tests)
- [ ] Total: 38+ new tests

### PROD-03: Staged Deploy (0.25d)

- [ ] Deploy edge functions one at a time: validator-start → sprint-agent → investor-agent → pitch-deck-agent → lean-canvas-agent → ai-chat
- [ ] Verify each before proceeding to next
- [ ] Rollback plan: revert to previous EF version (Supabase keeps history)

### PROD-04: Monitoring (0.25d)

- [ ] Check `ai_runs` table for new fragment-related entries
- [ ] Verify no 500 errors in Supabase logs
- [ ] Confirm rate limits still apply with enriched prompts

---

## Dependency Graph

```
C-01 (loader) ──┬── C-02 (scoring fragment)
                 ├── C-03 (composer fragment) ── C-04 (report UI)
                 ├── M-01 (sprint)
                 ├── M-02 (investor)
                 ├── M-03 (pitch deck)
                 ├── M-04 (canvas)
                 └── M-05 (chat modes)

M-05 ──┬── P-01 (session persistence)
       ├── P-02 (pitch panel)
       ├── P-03 (growth panel)
       └── A-03 (remaining panels)

C-04 ── P-05 (export overlays)

All MVP ── PROD-01 (backward compat)
All ── PROD-02 (tests)
PROD-01 + PROD-02 ── PROD-03 (deploy) ── PROD-04 (monitoring)
```

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Fragment too large for prompt window | Each fragment < 2000 tokens, total prompt stays under 8K |
| Gemini ignores appended rules | Fragments use same instruction style as existing prompts |
| New fields break existing reports | All fields optional, UI checks existence before render |
| Chat mode confusion | Default = general (no mode prompt), explicit mode selection required |
| Cold-start latency from file reads | Module-scope cache, read once per isolate lifecycle |

---

## Task Summary

| Phase | Tasks | New Components | Migrations | EF Deploys |
|-------|-------|---------------|------------|------------|
| CORE | 4 | 3 | 0 | 1 |
| MVP | 5 | 8 | 1 | 4 |
| POST-MVP | 5 | 5 | 1 | 0 |
| ADVANCED | 4 | 2 | 0 | 0 |
| PRODUCTION | 4 | 0 | 0 | 6 (redeploy) |
| **Total** | **22** | **18** | **2** | **11** |

---

## References

| Doc | Path |
|-----|------|
| Agency PRD | `agency/prd-agency.md` |
| Agency Index | `agency/INDEX.md` |
| Wireframes | `agency/wireframes/00-index.md` |
| Prompt Fragments | `agency/prompts/*.md` |
| Chat Modes | `agency/chat-modes/*.md` |
| Agent Loader | `agency/lib/agent-loader.ts` |
| Domain Skills | `.agents/skills/` (8 directories) |
