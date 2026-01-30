# Roadmap: Industry & Prompt Packs

**Source:** [03-prd-industry-promptpacks.md](03-prd-industry-promptpacks.md)  
**Implementation order:** [1-index-tasks.md](1-index-tasks.md)  
**Version:** 1.0 | **Date:** 2026-01-30

---

## Executive summary

**Purpose:** Make the platform industry-aware and prompt-driven so founders get the right questions and AI outputs in the right place, without copy-paste or generic templates. Prompt packs are **automated**, **agentic**, **best-practices-driven**, and use **industry-conditional logic**.

This roadmap turns the **Industry & Prompt Packs** PRD into phases and milestones. One core stream: **Foundation → Industry context → Prompt library content → Prompt pack implementation**. Each phase has clear outcomes and a gate before the next.

### Key points (at a glance)

| Area | Key point |
|------|-----------|
| **Phases** | 0 Foundation → 1 Industry context → 2 Prompt library content → 3 Prompt pack implementation → 4 Integration. |
| **Gates** | Each phase has a gate; do not start next phase until gate is met (e.g. “industry content and logic ready for prompt library”). |
| **Industry** | Lock strategy, playbooks, 8 questions per industry, question→slide mapping, stage filter, 8 universal categories. |
| **Prompt library** | Index + domain prompts (ideation → pitch-deck) + agent routing (context → pack/step) + categories. |
| **Implementation** | DB (prompt_packs, steps, run history) + edge (search, run, apply) + seed + frontend apply. |
| **Success** | Industry selection used; 8+ questions/industry; search/run/apply used by onboarding, validator, canvas, pitch. |

---

## Purpose & goals (what we're building toward)

| Goal | In plain language |
|------|-------------------|
| **Industry is core** | Founder picks industry once (e.g. FinTech, Healthcare); every flow uses that industry’s questions, language, and benchmarks. |
| **Prompt packs power AI** | **Automated** + **agentic**: agent chooses pack from context (module + industry + stage); runs steps; applies. No "choose pack" in main flow. |
| **Best practices** | Pack prompts and step logic follow best-practices doc (playbooks, investor psychology, red flags). |
| **Industry-conditional logic** | Content, questions, and pack selection depend on `selected_industry` (and stage). FinTech ≠ Healthcare in questions and terminology. |
| **AI Agent Expertise** | Make the AI a true startup expert per industry with knowledge injection, benchmarks, and contextual advice that goes beyond generic prompts. |
| **Static Knowledge Injection** | Enrich each industry playbook with embedded expertise (success stories, failure patterns, investor expectations, benchmarks, red flags, terminology) injected into every prompt at runtime. |
| **Quality & consistency** | 8+ questions per industry; 40+ universal questions; structured JSON applied so data is consistent and reusable. |
| **Clarity for builders** | One schema, one routing table, one implementation order — so we don’t duplicate logic or break flows. |

### Real-world examples (user stories)

| Example | What happens |
|---------|----------------|
| **FinTech founder onboarding** | Maria picks "FinTech — Payments." The wizard asks compliance, CAC/LTV, and payment-metrics questions. Her answers flow into profile and later pre-fill pitch deck and canvas. |
| **Healthcare idea validation** | James runs the validator; the system uses the Healthcare pack automatically. He gets feedback in healthcare terms (clinical evidence, reimbursement, FDA path); results apply to his validation report. |
| **No copy-paste** | After onboarding, the "ICP and pain point" summary appears in profile and pre-fills the Lean Canvas customer box. Same data powers the pitch deck problem slide — one run, many places updated. |
| **New industry (admin)** | Ops adds "Climate Tech," seeds 8 questions and a playbook. Founders selecting Climate Tech immediately see those questions and benchmarks — no frontend deploy for content. |
| **Pitch deck that “gets” the industry** | FinTech deck emphasizes unit economics and compliance; Healthcare deck emphasizes clinical evidence. Same pitch pack, different playbook and terminology per industry. |

---

## Summary table

| Phase | Name | Outcome | Est. | Status |
|-------|------|---------|------|--------|
| 0 | Foundation | Schema and edge functions audited; baseline for changes. | 1–2 days | 🟢 Complete |
| 1 | Industry context | Strategy, logic, verification locked; industry docs and progress tracker current. | 2–3 days | 🟢 Complete |
| 2 | Prompt library content | Prompts-library complete by domain (ideation → pitch-deck); index and routing agreed. | 3–5 days | 🟢 Complete |
| 3 | Prompt pack implementation | DB live, edge (search/run/apply) deployed, seed data in, frontend apply wired. | 5–8 days | 🟢 Complete |
| 4 | Integration & verification | Onboarding + validator + canvas + pitch use industry + prompt packs; metrics checked. | 2–3 days | 🟡 In Progress |
| 5 | Playbook System Extension | Core/advanced playbooks, AI agents, automations, dashboards, schema extensions. | 50–67 days |
| 6 | Future Playbooks (Backlog) | Team, financial, product, customer success, legal, pivot playbooks. | TBD |

**Phase 0–4 Estimate:** ~15–21 days  
**Phase 5 Estimate:** ~50–67 days (can parallelize sub-phases)  
**Phase 6:** Backlog, prioritized based on user feedback

---

## Phase 0: Foundation

**Goal:** Know current state before changing schema or behavior.

| # | Milestone | Deliverable | Done |
|---|-----------|-------------|------|
| 0.1 | Schema audit | Supabase schema and edge functions documented. | ☑ |
| 0.2 | Baseline | List of tables, edge functions, and RLS relevant to industry + prompt packs. | ☑ |
| 0.3 | Gate | Agreement on what to add/change (industry_*, prompt_packs, etc.). | ☑ |

**Gate to Phase 1:** Schema audit done; no unplanned breaking changes.

---

## Phase 1: Industry context

**Goal:** Industry is the single source of truth for “what to ask” and “how to sound” per vertical.

| # | Milestone | Deliverable | Done |
|---|-----------|-------------|------|
| 1.1 | Progress tracker | Industry progress doc created/updated; sync with DB/seed (industries, questions, playbooks). | ☑ |
| 1.2 | Strategy & playbooks | Industry strategy and question packs (8 per industry) and playbooks defined. 19 industries. | ☑ |
| 1.3 | Industry logic | Conditional logic documented: Step 1 industry + sub_category; Step 2/3/4 use industry for metrics, questions, tone. | ☑ |
| 1.4 | 8 question categories | Universal categories agreed: problem_validation, customer_discovery, solution_design, mvp_planning, go_to_market, business_model, competitive_strategy, execution_planning. | ☑ |
| **1.5** | **AI Agent Expertise** | Define expertise components per industry: benchmarks, investor psychology, success/failure patterns, terminology, red flags, power/weak phrases. | ☑ |
| **1.6** | **Static Knowledge Injection** | Create knowledge schema: `industry_playbooks` table with success_stories, failure_patterns, investor_expectations, benchmark_data, red_flags, terminology per industry. | ☑ |
| **1.7** | **Knowledge Content** | Populate knowledge for 19 industries: 3+ success stories, 3+ failure patterns, 5+ benchmarks, 5+ red flags, 5+ power phrases per industry. | ☑ |
| **1.8** | **Context-Filtered Injection** | Define feature → knowledge mapping: Onboarding (failure patterns + terminology), Canvas (GTM + benchmarks), Pitch (investor expectations + success stories + red flags), Validator (benchmarks + red flags + failures), Tasks (GTM + failures), Chatbot (all). | ☑ |
| 1.9 | Verification | Best-practices verification and industry logic documented. | ☑ |
| 1.10 | Gate | Product/eng sign-off: industry content and logic ready for prompt library and DB. | ☑ |

**Gate to Phase 2:** Industry context, knowledge content, and context-filtered injection are stable; prompt library can reference them.

**User story this enables:** Maria sees FinTech questions and James sees Healthcare questions because we've locked strategy, playbooks, and the shared question schema. **AI agents speak the industry's language** with embedded expert knowledge, and **each feature gets exactly the right slice** — Pitch Deck gets investor expectations + success stories, Onboarding gets failure patterns to guide early decisions.

---

## Phase 2: Prompt library content

**Goal:** All prompt content (by domain) lives in prompt library; index and agent routing are defined.

| # | Milestone | Deliverable | Done |
|---|-----------|-------------|------|
| 2.1 | Library index | Prompt library index with “when to use” per file; align with PRD categories. | ☑ |
| 2.2 | Domain prompts | Ideation, market, marketing, product, funding, revenue, founder-fit, pitch, pitch-deck documented. | ☑ |
| 2.3 | Agent routing | Context detection agreed: route/intent → module. Routing table seeded. | ☑ |
| 2.4 | Categories | Categories fixed: validation, ideation, pitch, canvas, market, gtm, pricing. | ☑ |
| 2.5 | Gate | Content and routing agreed; ready to map into DB and edge. | ☑ |

**Gate to Phase 3:** Prompt library content and routing are ready for implementation.

**User story this enables:** We know *which* prompt runs *when* (e.g. onboarding step 2 → ICP/pain pack; validator → validation pack by industry). Content and routing are agreed so we can implement search/run/apply without guesswork.

---

## Phase 3: Prompt pack implementation

**Goal:** DB, edge, seed, and frontend apply are live; agent can search, run, and apply.

| # | Milestone | Deliverable | Done |
|---|-----------|-------------|------|
| 3.1 | DB schema | Migration: prompt_packs, prompt_pack_steps, run history; RLS; indexes. | ☑ |
| 3.2 | Edge: search | prompt_pack_search(module, industry, stage) returns best pack + next step. | ☑ |
| 3.3 | Edge: run | run_step / run_pack with context → structured JSON. | ☑ |
| 3.4 | Edge: apply | apply(outputs_json, apply_to) → profile, canvas, slides, tasks. | ☑ |
| 3.5 | Seed data | 54 prompt packs seeded across 19 industries. | ☑ |
| 3.6 | Frontend apply | Audited prompts for onboarding and validation ready. | ☑ |
| 3.7 | Gate | E2E: select industry → run flow → outputs land in correct place. | ☑ |

**Gate to Phase 4:** Prompt pack system is live and used by at least one flow (e.g. onboarding).

**User story this enables:** Maria’s answers actually land in her profile and canvas; James’s validator output lands in his report. Search → run → apply works end-to-end (no copy-paste).

---

## Phase 4: Integration & verification

**Goal:** All consuming flows use industry + prompt packs; success metrics checked.

| # | Milestone | Deliverable | Done |
|---|-----------|-------------|------|
| 4.1 | Onboarding | Industry selection in onboarding; questions and apply from prompt packs. | ☐ |
| 4.2 | Validator | Validator uses industry + prompt pack search/run/apply. | ☐ |
| 4.3 | Canvas & pitch | Lean canvas and pitch deck use industry context and prompt pack apply where specified. | ☐ |
| 4.4 | Metrics | Industry selection usage; 8+ questions per industry seeded; apply to profile/canvas/slides/tasks verified. | ☐ |
| 4.5 | Docs | Index and 1-index-tasks updated; roadmap and PRD references correct. | ☐ |

**Done:** PRD success metrics met; no P0 open.

**User story this enables:** Onboarding, validator, canvas, and pitch all use industry + prompt packs; we’ve verified metrics (industry selection usage, 8+ questions/industry, apply working). Maria and James get the full experience; admins can add new industries and see them in use.

---

## Phase 5: Playbook System Extension

> **Reference:** [101-startup-playbooks.md](prompts/101-startup-playbooks.md)

**Goal:** Extend prompt packs into a comprehensive playbook system with wizards, AI agents, automations, and dashboards.

### Phase 5.1: Core Playbooks

| # | Milestone | Deliverable | Est. | Done |
|---|-----------|-------------|------|------|
| 5.1.1 | Onboarding Playbook | 4-step wizard with Industry Expert, Problem Sharpener, Founder Analyst, Pitch Writer | 3-4 days | ☐ |
| 5.1.2 | Validation Playbook | Quick/Deep/Investor modes with Validator Agent and scorecard | 2-3 days | ☐ |
| 5.1.3 | Canvas Playbook | 9-box builder with Canvas Builder agent and pre-fill from profile | 3-4 days | ☐ |
| 5.1.4 | Pitch Deck Playbook | 5-step generator with Deck Writer, Critic, industry-specific templates | 4-5 days | ☐ |

**Gate:** Core playbooks functional; validation score, canvas completeness, and deck generation working E2E.

### Phase 5.2: Advanced Playbooks

| # | Milestone | Deliverable | Est. | Done |
|---|-----------|-------------|------|------|
| 5.2.1 | GTM Playbook | ICP definition, positioning, channel strategy, launch plan, metrics | 4-5 days | ☐ |
| 5.2.2 | Fundraising Playbook | Readiness check, materials prep, investor research, outreach, pipeline, close | 5-6 days | ☐ |
| 5.2.3 | Roadmap Playbook | 12-month development plan with milestones, resources, risks | 3-4 days | ☐ |

**Gate:** Advanced playbooks functional; GTM, fundraising, and roadmap flows working.

### Phase 5.3: AI Agent System

| # | Milestone | Deliverable | Est. | Done |
|---|-----------|-------------|------|------|
| 5.3.1 | Agent Registry | 10 agents defined: Industry Expert, Problem Sharpener, Validator, Canvas Builder, Deck Writer, Critic, Investor Research, Outreach, Task Generator, Chat Router | 2-3 days | ☐ |
| 5.3.2 | Agent Routing | Context → agent → pack routing table implemented | 2-3 days | ☐ |
| 5.3.3 | Model Configuration | Per-agent model (Gemini/Claude), temperature, max_tokens, tools | 1-2 days | ☐ |
| 5.3.4 | Agent Fallback | Model fallback (Gemini → Claude) on failure | 1 day | ☐ |

**Gate:** Agent system functional; routing, execution, and fallback working.

### Phase 5.4: Automations & Triggers

| # | Milestone | Deliverable | Est. | Done |
|---|-----------|-------------|------|------|
| 5.4.1 | Trigger System | 7 triggers: onboarding complete, validation score, canvas incomplete, deck generated, investor added, task overdue, competitive alert | 3-4 days | ☐ |
| 5.4.2 | Workflow Engine | Validation→Tasks, Pitch Review workflows with step-by-step execution | 2-3 days | ☐ |
| 5.4.3 | Notification System | Email/push alerts for triggers and task reminders | 2-3 days | ☐ |

**Gate:** Automations functional; triggers fire and workflows execute.

### Phase 5.5: Dashboards & Widgets

| # | Milestone | Deliverable | Est. | Done |
|---|-----------|-------------|------|------|
| 5.5.1 | Dashboard Schema | Widget definitions, data sources, update frequencies | 1-2 days | ☐ |
| 5.5.2 | Core Widgets | Validation Score, Canvas Completeness, Pitch Readiness, Task Progress | 3-4 days | ☐ |
| 5.5.3 | Advanced Widgets | Competitive Intel, Investor Pipeline, Benchmarks | 2-3 days | ☐ |
| 5.5.4 | Real-time Updates | Supabase subscriptions for live widget updates | 2-3 days | ☐ |

**Gate:** Dashboard functional; widgets display and update correctly.

### Phase 5.6: Playbook Schema Extensions

| # | Milestone | Deliverable | Est. | Done |
|---|-----------|-------------|------|------|
| 5.6.1 | playbook_runs table | Track playbook execution with steps, status, metadata | 1 day | ☐ |
| 5.6.2 | validation_reports table | Score, breakdown, risks, opportunities, generated tasks | 1 day | ☐ |
| 5.6.3 | lean_canvases table | All 9 boxes with completeness score | 1 day | ☐ |
| 5.6.4 | pitch_decks table | Template, industry pack, slides, critique, export | 1 day | ☐ |
| 5.6.5 | Audit log | Track all changes for compliance and debugging | 1 day | ☐ |

**Gate:** Schema extensions migrated and RLS policies applied.

### Phase 5 Summary

| Sub-Phase | Est. | Dependencies |
|-----------|------|--------------|
| 5.1 Core Playbooks | 12-16 days | Phase 4 complete |
| 5.2 Advanced Playbooks | 12-15 days | 5.1 complete |
| 5.3 AI Agent System | 6-9 days | 5.1 in progress |
| 5.4 Automations | 7-10 days | 5.3 complete |
| 5.5 Dashboards | 8-12 days | 5.1, 5.4 complete |
| 5.6 Schema Extensions | 5 days | Start with 5.1 |

**Total Phase 5 Estimate:** 50-67 days (can parallelize 5.3, 5.4, 5.5)

---

## Phase 6: Future Playbooks (Backlog)

**Goal:** Expand playbook coverage to complete startup journey.

| Playbook | Description | Priority | Est. |
|----------|-------------|----------|------|
| **Team Building** | Hiring, culture, equity, org design | P1 | 4-5 days |
| **Financial Planning** | Projections, burn, runway, scenarios | P1 | 4-5 days |
| **Product Development** | Spec, roadmap, sprint planning | P1 | 4-5 days |
| **Customer Success** | Onboarding, retention, expansion | P2 | 3-4 days |
| **Legal & Compliance** | Entity, IP, contracts, regulatory | P2 | 3-4 days |
| **Pivot Framework** | When to pivot, how, revalidation | P2 | 3-4 days |

**Priority:** P1 playbooks after Phase 5; P2 playbooks based on user feedback.

---

## Success criteria (from PRD)

| Goal | Metric |
|------|--------|
| Industry is core for “what to ask” | Industry selection in onboarding; 13 industries (or MVP subset) with question packs and playbooks. |
| Prompt packs power AI flows | Search + run used by onboarding, validator, canvas, pitch; apply to profile, canvas, slides, tasks. |
| Quality and consistency | 8+ questions per industry; 40+ universal questions; structured JSON applied automatically. |
| Developer clarity | Single schema and routing doc; implementation order (industry → content → implementation) followed. |

---

## Dependencies

- **Supabase:** Schema, RLS, migrations.
- **Edge functions:** industry-expert-agent, prompt-pack, onboarding-agent, lean-canvas-agent, pitch-deck-agent.
- **Frontend:** Profile (industry, stage); routes for onboarding, validator, canvas, pitch.

---

## References

| Doc | Purpose |
|-----|---------|
| [03-prd-industry-promptpacks.md](03-prd-industry-promptpacks.md) | Product requirements. |
| [1-index-tasks.md](1-index-tasks.md) | Step-by-step implementation order. |
| [index-tasks.md](index-tasks.md) | Task index. |
| [02-supabase-schema.md](02-supabase-schema.md) | Schema and edge functions audit. |
| [prompts/prompt-library/00-startupai-ai-agents-prompt-packs.md](prompts/prompt-library/00-startupai-ai-agents-prompt-packs.md) | Master spec: prompt packs + AI agents, flow, acceptance criteria. |
| [prompts/prompt-library/01-prompt-library-index.md](prompts/prompt-library/01-prompt-library-index.md) | When to use each prompt; list by domain. |
| [prompts/prompt-library/100-prompt-pack-strategy.md](prompts/prompt-library/100-prompt-pack-strategy.md) | Pack strategy, categories, flow. |
| [prompts/prompt-library/101-prompt-strategy.md](prompts/prompt-library/101-prompt-strategy.md) | Agent-driven routing, context detection, prompts vs playbooks. |
| [prompts/101-startup-playbooks.md](prompts/101-startup-playbooks.md) | **Startup Playbooks Master Guide** — comprehensive playbook system with architecture, core/advanced playbooks, AI agents, automations, dashboards, and implementation plan. |
