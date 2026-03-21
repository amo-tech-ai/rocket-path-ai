---
task_id: 020-EKS
title: Expert Knowledge System
diagram_ref: D-03
phase: MVP
priority: P1
status: Not Started
skill: /edge-functions
ai_model: gemini-3-flash-preview
subagents: [ai-agent-dev, supabase-expert]
edge_function: validator-start
schema_tables: [knowledge_chunks, industry_playbooks, prompt_packs, prompt_pack_steps]
depends_on: [004-VEC, 016-VAR]
---

# 020 - Expert Knowledge System

> Wire playbooks, prompt packs, and vector RAG into all AI agents

## Scope Guard (Over-Engineering Score: 5/5 — MUST SPLIT)

**This task combines 3 independent systems. Split into:**
- **020a** (v1.0): Wire playbooks into validator agents (seed 19 playbooks, import `getIndustryContext`)
- **020b** (v1.1): Wire prompt packs into agent routing
- **020c** (v1.2): Unify RAG + playbooks + packs in all agents

**Ship in v1.0 (020a only):** Seed playbooks, detect industry from profile, inject into Research + Scoring + Composer agents.
**Defer to v1.1:** Prompt pack routing, AI Chat knowledge wiring, expert persona prompt in all agents.
**Defer to v1.2:** RAG + playbooks combined prompts, Canvas Coach RAG, full unification.

---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Chat, Validator Report, Lean Canvas, AI Chat, all agent-powered screens |
| **Features** | Industry-aware expert persona, playbook context injection, RAG grounding, prompt pack routing |
| **Agents** | All 7 validator agents, canvas-coach, validator-followup, ai-chat, industry-expert-agent |
| **Edge Functions** | /validator-start, /validator-followup, /canvas-coach, /ai-chat, /prompt-pack, /industry-expert-agent |
| **Use Cases** | Agent becomes a leading startup/industry expert with real data + proven frameworks |
| **Real-World** | "Fintech founder gets validation grounded in fintech benchmarks, failure patterns, AND actual market data" |

## Description

Wire the three disconnected knowledge layers into a unified expert system that makes every AI agent a leading startup and industry expert:

1. **Playbooks** (19 industries, 10 categories each) → inject industry-specific frameworks, benchmarks, failure patterns into agent system prompts
2. **Prompt Packs** (step-by-step AI recipes) → route the right pack based on context (screen + industry + stage) for structured outputs
3. **Vector RAG** (factual data with citations) → ground responses in real market data, reports, and statistics

Currently: All three exist as written content and edge functions but NONE are connected to the validator pipeline, canvas coach, followup agent, or AI chat.

## Rationale

**Problem:** AI agents use generic prompts with no industry expertise. The validator gives the same advice to a fintech founder and a fashion founder. 19 playbooks sit unused. Prompt packs exist but are never called. Vector RAG only works in the Research agent.
**Solution:** Build a knowledge injection pipeline: detect industry from startup profile → load playbook categories → inject into agent system prompts → combine with RAG factual data → route prompt packs for structured workflows.
**Impact:** Agent becomes an industry-specific expert (not a generic assistant). Validation reports cite real data AND use proven frameworks. ~40% better output quality.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get industry-specific advice in my validation | recommendations reflect my actual market |
| Founder | see benchmarks for my industry | I know what "good" looks like for my sector |
| Founder | get cited market data in responses | I can verify the numbers |
| Founder | have the chatbot know my industry deeply | it feels like talking to a domain expert |

## Architecture: Three Knowledge Layers

```
Layer 1: PLAYBOOKS (Expert Frameworks)
  Source: lean/playbooks/*.md (19 industries × 10 categories)
  Storage: industry_playbooks table (seeded from markdown)
  Access: _shared/industry-context.ts → getIndustryContext(industry, feature)
  Injects: benchmarks, failure_patterns, gtm_patterns, decision_frameworks
  When: On every agent call, based on detected industry

Layer 2: PROMPT PACKS (Structured Workflows)
  Source: lean/prompt-library/ (28 files + 19 industry packs)
  Storage: prompt_packs + prompt_pack_steps tables
  Access: prompt-pack edge function (search, run_step, run_pack, apply)
  Injects: Step-by-step structured prompts with JSON output schemas
  When: Agent-driven routing based on context (screen + industry + stage)

Layer 3: VECTOR RAG (Factual Data)
  Source: research/ markdown files, ingested documents
  Storage: knowledge_chunks + knowledge_documents tables
  Access: search_knowledge / hybrid_search_knowledge DB functions
  Injects: Relevant factual chunks with citations
  When: On research/analysis queries, semantic search match

COMBINED PROMPT:
  system_prompt = expert_persona
                + playbook_context(industry, feature)    ← Layer 1
                + prompt_pack_template(module, step)      ← Layer 2
                + rag_chunks(query, industry)             ← Layer 3
                + user_input
```

## Goals

1. **Primary:** Every AI agent uses industry-specific playbook context in its system prompt
2. **Secondary:** Prompt packs route automatically based on screen/industry/stage
3. **Tertiary:** Vector RAG provides cited factual data alongside playbook frameworks
4. **Quality:** Agent responses reference industry benchmarks AND real data

## Acceptance Criteria

### Phase A: Seed & Connect Playbooks (P0)

- [ ] Run DB migration for `industry_playbooks` table (if not applied)
- [ ] Seed 19 playbooks to database (run parser + seed script)
- [ ] Import `getIndustryContext` in `validator-start/agents/research.ts`
- [ ] Import `getIndustryContext` in `validator-start/agents/scoring.ts`
- [ ] Import `getIndustryContext` in `validator-start/agents/composer.ts`
- [ ] Import `getIndustryContext` in `validator-followup/index.ts`
- [ ] Import `getIndustryContext` in `canvas-coach/index.ts`
- [ ] Detect industry from startup profile or extractor output
- [ ] Inject relevant playbook categories into each agent's system prompt
- [ ] Validator report reflects industry-specific benchmarks and failure patterns
- [ ] Followup agent asks industry-relevant questions

### Phase B: Connect Prompt Packs (P1)

- [ ] Seed prompt packs to database (run seed SQL)
- [ ] Wire `prompt-pack` edge function into validator flow
- [ ] Wire `prompt-pack` into canvas coach flow
- [ ] Implement agent routing: context → module → pack search → run step
- [ ] Structured outputs from packs apply to correct tables (validation_reports, lean_canvases)
- [ ] Validator uses validation/market packs for scoring context
- [ ] Canvas coach uses canvas/pricing packs for suggestions

### Phase C: Unify with Vector RAG (P2)

- [ ] RAG chunks returned alongside playbook context (not either/or)
- [ ] Agent prompt combines: playbook frameworks + RAG factual data
- [ ] Citations from RAG appear in responses alongside playbook benchmarks
- [ ] Chatbot (AI Chat + Canvas Coach) searches both vector AND playbook for answers
- [ ] `industry-expert-agent` edge function called for deep industry questions

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/YYYYMMDD_seed_playbooks.sql` | Seed 19 playbooks |
| Migration | `supabase/migrations/YYYYMMDD_seed_prompt_packs.sql` | Seed prompt packs |
| Shared | `supabase/functions/_shared/industry-context.ts` | Already exists — import in agents |
| Agent | `supabase/functions/validator-start/agents/research.ts` | Add playbook context to prompt |
| Agent | `supabase/functions/validator-start/agents/scoring.ts` | Add playbook benchmarks to scoring |
| Agent | `supabase/functions/validator-start/agents/composer.ts` | Add playbook context to report assembly |
| Agent | `supabase/functions/validator-followup/index.ts` | Add industry context to followup questions |
| Agent | `supabase/functions/canvas-coach/index.ts` | Add playbook + prompt pack context |
| Agent | `supabase/functions/ai-chat/index.ts` | Add all three layers |
| Edge Function | `supabase/functions/prompt-pack/index.ts` | Already exists — wire into flows |
| Edge Function | `supabase/functions/industry-expert-agent/index.ts` | Already exists — wire into chat |

## Context Injection Map (from playbooks index)

| Feature | Playbook Categories Injected |
|---------|------------------------------|
| **Validator** | benchmarks, warning_signs, failure_patterns |
| **Lean Canvas** | gtm_patterns, benchmarks |
| **Pitch Deck** | investor_expectations, success_stories, failure_patterns, investor_questions |
| **Onboarding** | failure_patterns, terminology |
| **Chatbot** | All 10 categories |
| **Fundraising** | investor_expectations, investor_questions, stage_checklists |
| **GTM Planning** | gtm_patterns, failure_patterns, decision_frameworks |

## What Exists (Already Written, Not Connected)

| Component | Location | Size | Status |
|-----------|----------|------|--------|
| 19 industry playbooks | `lean/playbooks/*.md` | 280KB | Written, not seeded |
| 28 prompt library files | `lean/prompt-library/*.md` | 450KB | Written, not seeded |
| 19 industry prompt packs | `lean/prompt-library/industries/IND-*.md` | 190KB | Written, not seeded |
| `prompt-pack` edge fn | `supabase/functions/prompt-pack/index.ts` | 24KB | Deployed, not called |
| `industry-expert-agent` edge fn | `supabase/functions/industry-expert-agent/index.ts` | 29KB | Deployed, not called |
| `_shared/industry-context.ts` | `supabase/functions/_shared/industry-context.ts` | 22KB | Written, not imported |
| Routing rules | `lean/prompt-library/101-agent-prompt-pack-routing.md` | 5KB | Written, not implemented |
| Vector RAG | `knowledge_chunks` (108 rows) | DB | Working in Research agent only |

## Expert Persona Prompt (System Role)

All agents should include this persona foundation, augmented with industry-specific playbook context:

```
You are a world-class startup advisor with deep expertise across 19 industries
including AI/SaaS, fintech, healthcare, retail, cybersecurity, and more.

Your knowledge combines:
- Proven frameworks from 19 industry playbooks (benchmarks, failure patterns,
  GTM strategies, investor expectations, decision frameworks)
- Real market data from research reports and industry analysis (cited with sources)
- Battle-tested prompt workflows that guide founders through validation, canvas,
  pitch, and planning step by step

For this founder's {INDUSTRY} startup at {STAGE} stage:
{PLAYBOOK_CONTEXT}

Grounded in real data:
{RAG_CHUNKS}

Always:
- Reference industry-specific benchmarks when evaluating metrics
- Flag known failure patterns for this industry
- Use the right terminology for this sector
- Cite sources when using factual data
- Give actionable, stage-appropriate advice
```

## References

| Document | Path |
|----------|------|
| Playbooks Index | `lean/playbooks/00-playbooks-index.md` |
| Prompt Pack Strategy | `lean/prompt-library/100-prompt-pack-strategy.md` |
| Agent Routing Rules | `lean/prompt-library/101-agent-prompt-pack-routing.md` |
| Industry Context Utility | `supabase/functions/_shared/industry-context.ts` |
| Prompt Pack Edge Fn | `supabase/functions/prompt-pack/index.ts` |
| Industry Expert Edge Fn | `supabase/functions/industry-expert-agent/index.ts` |
| Vector RAG Plan | `lean/tasks/03-vector/100-vectordb-plan.md` |


---

## Production Ready Checklist

- [ ] `npm run build` passes (no new errors)
- [ ] `npm run test` passes (no regressions)
- [ ] New component renders without console errors
- [ ] Loading, error, empty states handled
- [ ] Works on desktop (1280px+) and mobile (375px)
- [ ] Data persists after page refresh
- [ ] RLS policies verified (if new tables)
- [ ] Edge function deployed and responds 200 (if applicable)
- [ ] No secrets in client code

## Regression Checklist

> Verify existing features still work after this task.

- [ ] Validator: Chat → Progress → Report flow works
- [ ] Lean Canvas: Auto-populate from report works
- [ ] Dashboard: Loads without errors
- [ ] Auth: Login/logout works
- [ ] Onboarding: Wizard completes

## Testing

- [ ] Unit tests for new hooks/utilities
- [ ] Manual test: happy path works end-to-end
- [ ] Manual test: error/empty states handled
- [ ] No console errors in browser DevTools
