---
task_number: "00"
title: "Lovable Prompts — Index"
category: "Documentation"
subcategory: "Index"
phase: 0
priority: "P2"
status: "Complete"
percent_complete: 100
owner: "Full Stack"
---

# Lovable Prompts — Index

> **Version:** 1.2 | **Date:** January 30, 2026  
> **Purpose:** Index of all Lovable-ready prompts for UI generation  
> **Total Prompts:** 15 prompts (8 screens + 7 integration/feature tasks)  
> **Format:** Each prompt follows the standard Lovable prompt structure

---

## Summary Table

| # | Prompt File | Screen | Key Features | Priority |
|---|------------|--------|--------------|----------|
| 01 | `01-onboarding-wizard.md` | `/onboarding` | 4-step wizard, industry picker, one-liner | P0 |
| 02 | `02-validation-dashboard.md` | `/validator` | Quick validate, deep validate, risk radar | P0 |
| 03 | `03-lean-canvas-builder.md` | `/canvas` | 9-box editor, AI fill, version history | P1 |
| 04 | `04-pitch-deck-generator.md` | `/pitch` | 5-step wizard, AI slides, critic review | P1 |
| 05 | `05-ai-chat-assistant.md` | `/app/chat` | Conversational AI, artifact generation | P1 |
| 06 | `06-task-management.md` | `/app/tasks` | Kanban, AI prioritization, stage tasks | P1 |
| 07 | `07-crm-contacts.md` | `/app/contacts` | Deal pipeline, enrichment, investor matching | P1 |
| 08 | `08-main-dashboard.md` | `/app/dashboard` | Health score, progress, AI insights | P0 |
| 17 | `17-playbook-screen-integration.md` | All Screens | Industry context injection, knowledge mapping | P0 |
| 18 | `18-deno-unit-testing.md` | Edge Functions | Test suite, mock client, coverage | P1 |
| 19 | `19-workflow-trigger-system.md` | Automation | Score-to-task triggers, closed-loop actions | P1 |
| 20 | `20-onboarding-dynamic-questions.md` | `/onboarding` | Industry-specific questions, adaptive interview | P1 |
| 22 | `22-agentic-routing-packs.md` | AI System | Feature-to-pack routing, multi-step execution | P1 |
| 23 | `23-fix-step4-score-summary.md` | `/onboarding` | Fix 400 errors, fallback scoring, model fixes | P0 |
| 24 | `24-fix-interview-persistence.md` | `/onboarding` | localStorage + Supabase sync, resume dialog | P1 |
| 27 | `27-wire-interview-persistence-ui.md` | `/onboarding` | Wire ResumeInterviewDialog, AutoSaveIndicator | P0 |
| 28 | `28-wire-dynamic-questions.md` | `/onboarding` | Replace generic with industry-specific questions | P1 |
| 29 | `29-wire-agentic-routing-ui.md` | AI Features | Connect usePromptPack + PackExecutionDrawer | P1 |
| 30 | `30-fix-backend-gaps.md` | Backend | Add get_validation_history, create template registry | P1 |

---

## Task Metadata Summary

All Lovable prompts use the [task metadata schema](../00-task-metadata-schema.md). Legend: [pm/notes/05-legend.md](../../pm/notes/05-legend.md).

| # | Title | Category | Subcategory | Phase | Priority | Status | % | Owner |
|---|-------|----------|-------------|-------|----------|--------|---|-------|
| 00 | Lovable Prompts — Index | Documentation | Index | 0 | P2 | Complete | 100 | Full Stack |
| 00 | Backend Handoff Checklist | Documentation | Checklist | 0 | P1 | Complete | 100 | Backend Developer |
| 01 | Onboarding Wizard | Wizards | Onboarding | 1 | P0 | 🟢 Complete | 95 | Frontend Developer |
| 02 | Validation Dashboard | Dashboard | Validation | 1 | P0 | 🟢 Complete | 90 | Frontend Developer |
| 03 | Lean Canvas Builder | Lean Canvas | Lean Canvas Editor | 2 | P1 | 🟡 In Progress | 40 | Frontend Developer |
| 04 | Pitch Deck Generator | Pitch Deck | Pitch Deck Wizard | 2 | P1 | 🟡 In Progress | 50 | Frontend Developer |
| 05 | AI Chat Assistant | AI | AI Chatbot | 2 | P1 | 🟢 Complete | 90 | Frontend Developer |
| 06 | Task Management Dashboard | Features | Task Management | 2 | P1 | 🟡 In Progress | 50 | Frontend Developer |
| 07 | CRM & Contacts Dashboard | CRM | CRM Contacts | 2 | P1 | 🟡 In Progress | 40 | Frontend Developer |
| 08 | Main Dashboard & Health Score | Dashboard | Dashboard Home | 1 | P0 | 🟢 Complete | 95 | Frontend Developer |
| 17 | Playbook-Screen Integration | Integration | Context Injection | 3 | P0 | 🟢 Complete | 100 | Full Stack |
| 18 | Deno Unit Testing | Testing | Edge Functions | 3 | P1 | 🟢 Complete | 100 | Backend Developer |
| 19 | Workflow Trigger System | Automation | Score Triggers | 3 | P1 | 🟢 Complete | 100 | Full Stack |
| 20 | Dynamic Onboarding Questions | Feature | Onboarding | 3 | P1 | 🟢 Complete | 100 | Full Stack |
| 22 | Agentic Routing & Packs | AI | Agent Strategy | 3 | P1 | 🟢 Complete | 100 | Full Stack |
| 23 | Fix Step 4 Score/Summary | Bug Fix | Edge Functions | 0 | P0 | 🟢 Complete | 100 | Backend Developer |
| 24 | Interview Answer Persistence | Bug Fix | Frontend State | 1 | P1 | 🟢 Complete | 100 | Frontend Developer |
| 27 | Wire Interview Persistence UI | Integration Fix | Onboarding | 1 | P0 | 🟢 Complete | 100 | Frontend Developer |
| 28 | Wire Dynamic Industry Questions | Integration Fix | Onboarding | 1 | P1 | 🟢 Complete | 100 | Full Stack Developer |
| 29 | Wire Agentic Routing UI | Integration Fix | AI Features | 2 | P1 | 🟢 Complete | 100 | Full Stack Developer |
| 30 | Fix Backend Gaps | Bug Fix | Backend | 1 | P1 | 🟢 Complete | 100 | Backend Developer |

---

## Prompt Structure

Each Lovable prompt follows this standard structure:

| Section | Purpose |
|---------|---------|
| **Summary Table** | Quick overview of screen, features, agents, use cases |
| **Description** | What to build in 1-2 paragraphs |
| **Purpose & Goals** | Why this screen exists, what success looks like |
| **Real World Examples** | 3 concrete user scenarios |
| **3-Panel Layout** | Left (Context), Main (Work), Right (Intelligence) |
| **Frontend/Backend Wiring** | Components, edge functions, data flow |
| **Supabase Schema Mapping** | Tables and fields used |
| **Edge Function Mapping** | AI functions with models and knowledge slices |
| **AI Agent Behaviors** | Trigger, autonomy, behavior, output |
| **Acceptance Criteria** | Checklist of requirements |
| **Dependencies** | What's ready vs. needed |

---

## By Priority

### P0 — Core User Journey

| Screen | Status | Description |
|--------|--------|-------------|
| Onboarding Wizard | ✅ Ready | First-time user profile capture |
| Validation Dashboard | ✅ Ready | Idea validation hub |
| Main Dashboard | ✅ Ready | Daily command center |

### P1 — Value-Add Features

| Screen | Status | Description |
|--------|--------|-------------|
| Lean Canvas Builder | ✅ Ready | Business model design |
| Pitch Deck Generator | ✅ Ready | Investor deck creation |
| AI Chat Assistant | ✅ Ready | Conversational AI |
| Task Management | ✅ Ready | Work tracking |
| CRM & Contacts | ✅ Ready | Relationship management |

---

## AI Agents by Screen

| Screen | Agents | Models |
|--------|--------|--------|
| **Onboarding** | Industry Expert, Problem Sharpener, Founder Analyst, Pitch Writer | Gemini Flash + Claude Sonnet |
| **Validation** | Validator Agent, Risk Analyzer, Opportunity Scout | Gemini Pro + Claude |
| **Canvas** | Canvas Builder, Box Advisor, Completeness Scorer | Gemini Pro + Claude |
| **Pitch Deck** | Deck Writer, Critic Agent, Slide Refiner | Claude Sonnet + Gemini Flash |
| **Chat** | Intent Router, Chat Agent, Action Executor | Gemini Flash + Claude Sonnet |
| **Tasks** | Task Generator, Prioritizer, Stage Advisor | Gemini Pro + Claude |
| **CRM** | Contact Enricher, Investor Matcher, Deal Advisor | Gemini Pro + Claude |
| **Dashboard** | Health Scorer, Action Recommender, Insight Generator | Gemini Pro + Claude |

---

## Edge Functions Required

**See `00-backend-handoff-checklist.md` for actual function names and mapping.**

| Lovable name | Actual function | Screens | Status |
|--------------|-----------------|---------|--------|
| `onboarding-agent` | `onboarding-agent` | Onboarding | ✅ Ready |
| `industry-expert-agent` | `industry-expert-agent` | Onboarding, Tasks, Dashboard | ✅ Ready |
| `prompt-pack` | `prompt-pack` | Onboarding, Chat, Pitch, Validation | ✅ Ready |
| `idea-validator` | Use `prompt-pack` (industry-validation, problem-validation) | Validation | ✅ Ready |
| `canvas-builder` | `lean-canvas-agent` | Canvas | ✅ Ready |
| `pitch-generator` | `pitch-deck-agent` | Pitch Deck | ✅ Ready |
| `chat-agent` | `chatbot-agent` | Chat | ✅ Ready |
| `task-generator` / `task-prioritizer` | `task-agent` | Tasks | ✅ Ready |
| `contact-enricher` / `investor-matcher` | `crm-agent`, `investor-agent` | CRM | ✅ Ready |
| `health-scorer` / `action-recommender` | `dashboard-metrics`, `insights-generator` | Dashboard | 🔄 Confirm |

---

## Supabase Tables Used

| Table | Screens |
|-------|---------|
| `profiles` | All |
| `startups` | All |
| `ai_runs` | All |
| `industry_playbooks` | Onboarding, Validation, Pitch, Tasks |
| `lean_canvases` | Canvas, Dashboard |
| `pitch_decks` | Pitch, Dashboard |
| `tasks` | Tasks, Dashboard |
| `contacts` | CRM |
| `deals` | CRM |
| `conversations` | Chat |
| `messages` | Chat |

---

## How to Use These Prompts

### With Lovable.dev

1. Copy the full content of a prompt file
2. Paste into Lovable's chat interface
3. Lovable generates the React components
4. Review and iterate on the generated code

### With Cursor/Claude

1. Reference the prompt file in your context
2. Ask to implement specific sections
3. Use the Frontend Components table as a checklist

### As Spec Documentation

1. Each prompt serves as a complete screen specification
2. Acceptance criteria can become test cases
3. Data flow diagrams guide implementation

---

## Implementation Order

Recommended order based on dependencies:

```
1. Main Dashboard (08)      — Core entry point
2. Onboarding Wizard (01)   — First-time user flow
3. Validation Dashboard (02) — Core value prop
4. Lean Canvas Builder (03) — Data for pitch
5. Pitch Deck Generator (04) — Uses canvas data
6. Task Management (06)      — Work tracking
7. CRM & Contacts (07)       — Relationship tracking
8. AI Chat Assistant (05)    — Ties everything together
```

---

## Related Documentation

| Doc | Purpose |
|-----|---------|
| **`00-backend-handoff-checklist.md`** | **Backend readiness & Lovable handoff — read before implementing** |
| `prd-industry-prompt-playbooks.md` | Product requirements |
| `prompt-library/` | Prompt templates for agents |
| `supabase/migrations/` | Database schema (migrations; no single schema.sql) |
| `supabase/functions/` | Edge function implementations |
| `tasks/01-playbooks/99-tasks-audit.md` | Gaps, failure points, recommendations |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-29 | Created prompts 01-04 (Claude Code) |
| 2026-01-29 | Created prompts 05-08 (Cursor) |
| 2026-01-29 | Created index file |
