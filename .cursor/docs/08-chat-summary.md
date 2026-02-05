# StartupAI — Chat Summary for New Sessions

**Last Updated:** January 21, 2026  
**Purpose:** Quick context for starting new chat sessions  
**Project Status:** 58% Production Ready

---

## 🎯 Project Overview

**StartupAI** is an AI-powered operating system for founders that transforms raw ideas into clear strategy, execution plans, and daily priorities using guided wizards, dashboards, and AI agents.

**Core Value:** `Idea → Clarity → Execution → Fundraising (in ~30 minutes)`

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI:** Google Gemini (Flash, Pro, Pro Image) + Anthropic Claude (Haiku, Sonnet)
- **Architecture:** 3-Panel Layout (Context | Work | Intelligence)

---

## 🏗️ Latest Architecture (v3.1 - Jan 21, 2026)

### Consolidated Edge Functions (86% Reduction)

**Strategy:** Consolidate 28 individual functions → 4 platform functions with action-based routing

| Platform Function | Actions | AI Actions | Purpose | Status |
|-------------------|---------|------------|---------|--------|
| `ai-platform` | 22 | 13 | Unified chatbot, industry awareness, service delivery | 🟡 Planned (40%) |
| `crm-platform` | 27 | 22 | CRM AI agents, investor search/matching | 🟡 Planned (30%) |
| `content-platform` | 32 | 24 | Pitch decks, documents, lean canvas, business plans | 🟡 Planned (25%) |
| `onboarding-wizard` | 11 | 6 | Startup profile creation, enrichment, scoring | 🟢 Deployed (85%) |

**Total:** 92 actions (65 AI, 27 Non-AI) across 4 platform functions

**Current State:** 13 functions deployed → Consolidation in progress (30% complete)

### 10 Core Agent Types Framework

| Agent Type | Primary Role | Primary Model | Use Cases |
|------------|-------------|---------------|-----------|
| **Orchestrator** | Coordinates multi-agent workflows | Claude Sonnet 4.5 | Service delivery, complex workflows |
| **Planner** | Breaks goals into plans/tasks | Gemini 3 Pro | Strategic planning, project breakdown |
| **Analyst** | Finds patterns, risks, insights | Gemini 3 Pro | Deal analysis, risk assessment |
| **Ops Automation** | Watches triggers, sends alerts | Claude Haiku 4.5 | Workflow automation, notifications |
| **Content/Comms** | Writes messages, emails, posts | Gemini 2.5 Flash | Email generation, outreach |
| **Retriever (RAG)** | Searches docs/knowledge base | Gemini 2.5 Flash | Industry pack search, knowledge retrieval |
| **Extractor** | Pulls structured data from sources | Gemini 2.5 Flash | Contact enrichment, document parsing |
| **Optimizer** | Improves timelines, budgets | Gemini 3 Pro | Schedule optimization, resource allocation |
| **Scorer** | Computes health/ROI/quality scores | Gemini 2.5 Flash/Pro | Lead scoring, deal scoring |
| **Controller** | Ensures AI proposes, not commits | Gemini 3 Pro | Action validation, approval gates |

**Hard Rule:** AI → PROPOSE, Human → APPROVE, System → EXECUTE

---

## 📊 Current Status (58% Complete)

### What's Working ✅

| Category | Status | % |
|----------|--------|---|
| Core Infrastructure | 🟢 Complete | 95% |
| Marketing Pages | 🟢 Complete | 100% |
| Supabase Database | 🟢 Complete | 92% (43 tables, 167 RLS policies) |
| Edge Functions (Deployed) | 🟢 Good | 85% (13 functions) |
| Dashboard Screens | 🟡 In Progress | 72% (13/18) |
| 3-Panel Layout | 🟡 In Progress | 75% (12/16) |

### What Needs Work 🔴

| Category | Status | % |
|----------|--------|---|
| AI Agents Integration | 🔴 Needs Work | 25% (4/16 wired) |
| Workflows & Automations | 🔴 Needs Work | 15% (1/8 implemented) |
| Edge Function Consolidation | 🟡 In Progress | 30% (13 → 4 functions) |
| Wizards | 🟡 In Progress | 45% (2/5 complete) |
| Chatbots & AI Panels | 🟡 In Progress | 40% (4/10 functional) |

### Critical Gaps 🚨

1. **Onboarding Wizard** - Missing (0% complete, P0 priority)
2. **User Profile Page** - Missing (`/profile` route not implemented)
3. **Company Profile Page** - Missing (`/company-profile` route not implemented)
4. **Pitch Deck Pages** - Missing (list and editor not implemented)
5. **AI Panel Wiring** - Most panels are placeholders (only Dashboard AIPanel functional)

---

## 📁 Key Files & Documentation

**Note:** Files are referenced, not loaded. Use dynamic context discovery - read files only when needed.

### Product Documents
- **PRD:** `/prd.md` (v3.1) - Complete product requirements
- **Roadmap:** `/roadmap.md` (v2.2) - Implementation roadmap
- **Progress Tracker:** `/plan/00-progress-tracker.md` - Detailed status tracking
- **Prompts List:** `/prompts/tasks/01-list-prompts.md` - 106+ prompts inventory

### Architecture Planning
- **Actions & Features:** `/plan/data/07-actions-features.md` - 92 actions breakdown
- **Agent Plan:** `/plan/data/09-supabase-agent-plan.md` - 10 agent types architecture
- **Current vs Proposed:** `/plan/data/10-audit-currentvsproposed.md` - Migration audit
- **Agents Reference:** `/plan/data/08-agents.md` - Complete agent inventory

### Prompts (106+ files)
- **Core Setup:** `/prompts/00-prompts-index.md` - 42 core prompts
- **Dashboard:** `/prompts/dashboard/` - 20+ dashboard prompts
- **Events:** `/prompts/events/` - 11 events prompts (see individual files when needed)
- **Pitch Deck:** `/prompts/pitch-deck/` - 9 pitch deck prompts
- **Agents:** `/prompts/agents/` - 12 AI agent prompts

### Code Structure
- **Frontend:** `/src/` - React components, pages, hooks
- **Edge Functions:** `/supabase/functions/` - 13 deployed functions
- **Database:** `/supabase/migrations/` - 43 tables, 167 RLS policies
- **Shared Modules:** `/supabase/functions/_shared/` - Common utilities

### Gemini Rules (Reference Only)
- **Index:** `.cursor/rules/gemeni/00-gemini-index.mdc` - Master index
- **Image Generation:** `.cursor/rules/gemeni/nano-banana.mdc` - Image patterns
- **Function Calling:** `.cursor/rules/gemeni/function-calling.mdc` - Tool integration
- **Structured Output:** `.cursor/rules/gemeni/structured-output.mdc` - JSON schemas
- **Prompting:** `.cursor/rules/gemeni/gemini-snippet.mdc` - Quick reference
- **Full Guide:** `.cursor/rules/gemeni/gemini-prompting.mdc` - Comprehensive guide

---

## 🔄 Recent Work (This Session)

### 1. Updated PRD & Roadmap
- ✅ Added consolidated edge function architecture (4 platform functions)
- ✅ Added 10 core agent types framework
- ✅ Updated implementation phases to reflect new strategy
- ✅ Updated action inventory (92 actions total)

### 2. Created Prompts Inventory
- ✅ Created `/prompts/tasks/01-list-prompts.md` with 106+ prompts cataloged
- ✅ Organized by category (Core, Dashboard, Events, Pitch Deck, Agents, etc.)
- ✅ Status tracking for each category

### 3. Updated Progress Tracker
- ✅ Added latest architecture update section
- ✅ Updated edge functions section with consolidation status
- ✅ Updated AI agents section with 10 agent types framework
- ✅ Added consolidation tasks to critical issues

---

## 🎯 Next Steps (Priority Order)

### 🚨 P0 - Critical (This Week)

1. **Consolidate Edge Functions** (2 weeks)
   - Implement action-based routing in 4 platform functions
   - Migrate 13 existing functions to consolidated architecture
   - Update frontend to use new function endpoints

2. **Wire EventsAIPanel** (2 hours)
   - Connect EventsAIPanel to `event-agent` backend
   - Replace mocked data with real API calls

3. **Wire WizardAIPanel** (2 hours)
   - Connect WizardAIPanel to `event-agent` wizard actions
   - Enable AI suggestions in event wizard

4. **Build Onboarding Wizard** (3 days)
   - Create 4-step wizard pages (`/wizard`)
   - Wire ProfileExtractor agent
   - Wire TaskGenerator agent

5. **Create User Profile Page** (1 day)
   - Build `/profile` route and page
   - Implement 3-panel layout
   - Wire ProfileEnricher agent

6. **Create Company Profile Page** (1 day)
   - Build `/company-profile` route and page
   - Implement 3-panel layout
   - Wire ProfileExtractor agent

### 🟡 P1 - High (Next Week)

7. **Create Pitch Deck Pages** (6 days)
   - List page (`/pitch-decks`)
   - Wizard (5 steps)
   - Editor with AI features

8. **Wire CRM AI Features** (8 hours)
   - Contact enrichment (ContactEnricher)
   - Deal scoring (DealScorer)

9. **Add Events Analytics Tab** (4 hours)
   - Analytics tab in Event Detail
   - Wire EventAnalytics agent

### 🟢 P2 - Medium (Following Weeks)

10. **Implement Approval Gates** (1 week)
    - Add Controller agent validation
    - Ensure AI proposes, human approves pattern

11. **Add Workflow Orchestration** (2 weeks)
    - Implement Orchestrator agent
    - Multi-step workflow coordination

---

## 🛠️ Development Workflow

### Key Commands
```bash
# Development
npm run dev              # Start Vite dev server (port 3000)
npm run build           # Production build
npm run test            # Run tests

# Supabase
supabase start          # Start local Supabase
supabase functions deploy <name>  # Deploy edge function
supabase db diff -f <name>        # Generate migration
```

### Import Alias
- `@` maps to `/src/` directory
- Example: `import { Button } from "@/components/ui/button"`

### Data Flow Pattern
```
Component → Custom Hook (useEvents, useCRM, etc.)
  ↓
React Query (caching + optimistic updates)
  ↓
Supabase Client (@/integrations/supabase/client)
  ↓
Supabase (PostgreSQL + RLS)
```

### AI Flow Pattern
```
Component → Hook → Edge Function → AI Provider (Gemini/Claude)
  ↓
Structured Output → Database Write (with approval gate)
```

---

## 📋 Quick Reference

### Edge Functions (Current → Target)

**Current (13 deployed):**
- `onboarding-agent`, `chatbot-agent`, `event-agent`, `crm-agent`, `investor-agent`, `pitch-deck-agent`, `documents-agent`, `lean-canvas-agent`, `whatsapp-agent`, `generate-image`, `stripe-webhook`, `health`, `auth-check`

**Target (4 platform):**
- `ai-platform` (22 actions)
- `crm-platform` (27 actions)
- `content-platform` (32 actions)
- `onboarding-wizard` (11 actions)

### AI Models Used

| Use Case | Provider | Model |
|----------|----------|-------|
| Fast chat/enrichment | Gemini | gemini-2.5-flash-preview |
| Complex analysis | Gemini | gemini-2.5-pro-preview |
| Task prioritization | Anthropic | claude-sonnet-4-5 |
| Quick generation | Anthropic | claude-haiku-4-5 |
| Image generation | Gemini | gemini-2.5-pro-image-preview |
| Orchestration | Anthropic | claude-sonnet-4-5 |

### Database Stats
- **43 tables** across 10 domains
- **167 RLS policies** (security audit passed)
- **300+ indexes** (some unused, need cleanup)
- **Multi-tenant** architecture with `organization_id`

---

## 🔗 Important Links

**Reference these files when needed (dynamic context discovery):**

### Master Indexes
- **Rules Index:** `.cursor/rules/00-rules-index.mdc` - All Cursor rules master index
- **Gemini Rules:** `.cursor/rules/gemeni/00-gemini-index.mdc` - Gemini API patterns index
- **Prompts Index:** `/prompts/00-prompts-index.md` - 42 core prompts
- **Events Index:** `/prompts/events/00-events-index.md` - Events prompts (11 files)
- **Tasks Index:** `/prompts/tasks/00-tasks-index.md` - Task prompts (3 files)
- **Plan Data Index:** `/plan/data/00-data-index.md` - Planning documents (5 files)

### Product Documents
- **PRD:** `/prd.md` - Complete product requirements
- **Roadmap:** `/roadmap.md` - Implementation roadmap
- **Progress Tracker:** `/plan/00-progress-tracker.md` - Detailed status

### Architecture Documents (Reference via index)
- **Prompts List:** `/prompts/tasks/01-list-prompts.md` - All prompts (106+)
- **Agent Plan:** `/plan/data/09-supabase-agent-plan.md` - Agent architecture
- **Actions Inventory:** `/plan/data/07-actions-features.md` - 92 actions

---

## 💡 Key Principles

1. **Revenue-First Development** - Every feature drives subscription/commission revenue
2. **MCP-First Architecture** - Use MCP server commands before manual implementations
3. **AI → PROPOSE, Human → APPROVE, System → EXECUTE** - Hard rule for all AI actions
4. **3-Panel Layout** - Left (Context), Main (Work), Right (Intelligence)
5. **Action-Based Routing** - Single platform function with action parameter routing
6. **10 Agent Types** - Categorize all agents into framework for consistency

---

## 🚀 Getting Started in New Chat

1. **Read this summary** - Understand current state and architecture
2. **Check progress tracker** - See what's done vs planned (`plan/00-progress-tracker.md`)
3. **Review PRD/Roadmap** - Understand product vision and phases (`prd.md`, `roadmap.md`)
4. **Check prompts** - See if prompt exists before creating new one (use indexes)
5. **Follow architecture** - Use consolidated functions, 10 agent types framework
6. **Use Cursor features** - See `CURSOR-FEATURES-ROADMAP.md` for optimization opportunities

## 🛠️ Cursor Features (Not Enabled)

**High-Impact Features Available:**
- **Debug Mode** - Not enabled (50-70% faster debugging)
- **AI Code Reviews** - Not enabled (20-30% fewer bugs)
- **Browser Layout** - Not used (30-40% faster UI dev)
- **Plan Mode** - Partially used (better visualization)

**See:** `CURSOR-FEATURES-ROADMAP.md` for full implementation guide

---

**Last Updated:** January 21, 2026  
**Next Review:** After P0 items complete  
**Maintained By:** Engineering Team
