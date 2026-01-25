# StartupAI Modules: Master Index

**Purpose:** Quick reference index for all module implementation prompts.

**Status:** Ready for Implementation  
**Last Updated:** 2025-01-25

---

## Modules Overview

| Module | Status | Completion | Document | Edge Function | Actions |
|--------|--------|------------|----------|---------------|---------|
| **Dashboard** | 🟡 90% | Needs real data integration | `01-dashboard.md` | `ai-platform` | 22 actions |
| **Events System** | ✅ 65% | 7 edge functions, schema, frontend | `02-events-system.md` | 8 functions | 8 functions |
| **Pitch Deck Generator** | ✅ 70% | Deck generation, image creation | `03-pitch-deck-generator.md` | `content-platform` | Deck actions |
| **Onboarding Wizard** | 🟡 85% | Needs AI integration completion | `04-onboarding-wizard.md` | `onboarding-wizard` | 11 actions |
| **CRM Platform** | 🔴 20% | Basic structure, needs consolidation | `05-crm-platform.md` | `crm-platform` | 27 actions |
| **AI Platform** | 🔴 40% | Basic chat, needs consolidation | `06-ai-platform.md` | `ai-platform` | 22 actions |
| **Content Platform** | 🔴 30% | Pitch decks only, needs expansion | `07-content-platform.md` | `content-platform` | 32 actions |

**Total:** 7 modules, 4 edge functions, 92 actions

---

## Quick Navigation

### By Status

**✅ High Completion (65-90%):**
- Dashboard (90%) - `01-dashboard.md`
- Events System (65%) - `02-events-system.md`
- Pitch Deck Generator (70%) - `03-pitch-deck-generator.md`
- Onboarding Wizard (85%) - `04-onboarding-wizard.md`

**🔴 Low Completion (20-40%):**
- CRM Platform (20%) - `05-crm-platform.md`
- AI Platform (40%) - `06-ai-platform.md`
- Content Platform (30%) - `07-content-platform.md`

### By Priority

**P0 (Critical):**
- Onboarding Wizard (85%) - Core user onboarding
- Dashboard (90%) - Main user interface
- AI Platform (40%) - Core AI functionality

**P1 (High):**
- CRM Platform (20%) - Contact and deal management
- Pitch Deck Generator (70%) - Content creation
- Events System (65%) - Event management

**P2 (Medium):**
- Content Platform (30%) - Additional content types

---

## Module Details

### 01. Dashboard Module

**File:** `01-dashboard.md`  
**Status:** 🟡 90% Complete  
**Screens:** 11 dashboard screens  
**Agents:** 6 types (Analyst, Planner, Scorer, Extractor, Retriever, Orchestrator, Content/Comms, Optimizer)

**Key Features:**
- Main Dashboard with KPIs and risks
- Projects with health tracking
- Deals pipeline with win probability
- Contacts with auto-enrichment
- Tasks with AI prioritization
- Discovery search for investors
- Events hub
- Pitch deck generation
- Lean canvas editor
- GTM strategy builder
- Document management

**Models:** claude-sonnet-4-5, claude-opus-4-5, gemini-3-pro-preview, gemini-3-flash-preview, gemini-3-pro-image-preview

---

### 02. Events System Module

**File:** `02-events-system.md`  
**Status:** ✅ 65% Complete  
**Screens:** 8 event screens  
**Agents:** 6 types (Planner, Analyst, Retriever, Content/Comms, Ops Automation)

**Key Features:**
- Event creation wizard (4 steps)
- Event dashboard with timeline
- Sponsor discovery with Google Search
- Venue finder with real-time data
- Attendee management
- Marketing content generation
- WhatsApp AI agent for communication
- Event analytics and ROI

**Models:** claude-sonnet-4-5, claude-opus-4-5, gemini-3-pro-preview, gemini-3-flash-preview, gemini-3-pro-image-preview

---

### 03. Pitch Deck Generator Module

**File:** `03-pitch-deck-generator.md`  
**Status:** ✅ 70% Complete  
**Screens:** 3 pitch deck screens  
**Agents:** 3 types (Orchestrator, Content/Comms, Optimizer)

**Key Features:**
- Complete deck generation (7-step workflow)
- Slide editing with AI suggestions
- Image generation for slides
- Slide quality analysis
- Presentation mode
- Export to PPTX/PDF

**Models:** claude-sonnet-4-5, claude-opus-4-5, gemini-3-pro-preview, gemini-3-pro-image-preview

---

### 04. Onboarding Wizard Module

**File:** `04-onboarding-wizard.md`  
**Status:** 🟡 85% Complete  
**Screens:** 5 wizard steps  
**Agents:** 4 types (Extractor, Analyst, Planner, Scorer)

**Key Features:**
- URL-based profile extraction
- Competitor analysis with Google Search
- Problem/solution definition
- Investor readiness scoring
- Task generation from profile

**Models:** gemini-3-flash-preview, gemini-3-pro-preview, claude-sonnet-4-5, claude-opus-4-5

---

### 05. CRM Platform Module

**File:** `05-crm-platform.md`  
**Status:** 🔴 20% Complete  
**Screens:** 5 CRM screens  
**Agents:** 5 types (Extractor, Scorer, Analyst, Planner, Retriever)

**Key Features:**
- Contact management with LinkedIn enrichment
- Deal pipeline with win probability scoring
- Investor discovery and matching
- Project management with health tracking
- Task prioritization

**Models:** gemini-3-flash-preview, gemini-3-pro-preview, claude-sonnet-4-5, claude-opus-4-5

---

### 06. AI Platform Module

**File:** `06-ai-platform.md`  
**Status:** 🔴 40% Complete  
**Screens:** AI features across all screens  
**Agents:** 4 types (Retriever, Analyst, Ops Automation, Controller)

**Key Features:**
- Conversational AI chat
- Knowledge base search (RAG)
- Risk analysis and identification
- Real-time notifications
- Approval gates for AI actions

**Models:** gemini-3-flash-preview, gemini-3-pro-preview, claude-sonnet-4-5, claude-opus-4-5, claude-haiku-4-5

---

### 07. Content Platform Module

**File:** `07-content-platform.md`  
**Status:** 🔴 30% Complete  
**Screens:** 3 content screens  
**Agents:** 3 types (Planner, Analyst, Content/Comms, Optimizer)

**Key Features:**
- Lean canvas creation and editing
- Investor one-pager generation
- Market sizing (TAM/SAM/SOM) with Google Search
- GTM strategy document generation
- Business plan creation
- Document management and editing

**Models:** gemini-3-pro-preview, gemini-3-flash-preview, gemini-3-pro-image-preview, claude-sonnet-4-5, claude-opus-4-5

---

## Implementation Priority

### Phase 1: Complete High-Value Modules (Next 2 Weeks)

1. **Onboarding Wizard** (85% → 100%)
   - Complete AI integration
   - Add advanced validation
   - Link tasks to projects

2. **Dashboard** (90% → 100%)
   - Real data integration
   - Complete all 11 screens
   - Add advanced analytics

3. **Pitch Deck Generator** (70% → 100%)
   - Add templates
   - Improve image generation
   - Add collaboration features

### Phase 2: Consolidate and Expand (Weeks 3-4)

4. **CRM Platform** (20% → 80%)
   - Consolidate edge functions
   - Implement all 27 actions
   - Complete all 5 screens

5. **AI Platform** (40% → 80%)
   - Consolidate edge functions
   - Implement all 22 actions
   - Add advanced features

6. **Content Platform** (30% → 80%)
   - Add lean canvas
   - Add investor docs
   - Add business plans

### Phase 3: Polish and Optimize (Week 5)

7. **Events System** (65% → 100%)
   - Complete WhatsApp integration
   - Add advanced analytics
   - Optimize performance

---

## Common Patterns Across Modules

### 3-Panel Layout

All modules follow the same 3-panel pattern:
- **Left Panel (Context):** Navigation, filters, progress
- **Main Panel (Work):** User-controlled forms, data, actions
- **Right Panel (Intelligence):** AI proposals, suggestions, insights

### AI Integration Pattern

**Fast Tasks (< 30s):** Messages API / Gemini Flash  
**Heavy Tasks (> 30s):** Agent SDK / Gemini Pro  
**Specialized Tasks:** Gemini (images, search, URL context)

### Approval Pattern

**AI → PROPOSE** (right panel)  
**Human → APPROVE** (main panel)  
**System → EXECUTE** (backend)

---

## Model Usage Summary

### Claude Models

| Model | Primary Use | Modules |
|-------|------------|---------|
| **claude-sonnet-4-5** | General tasks, orchestration | All modules |
| **claude-opus-4-5** | Complex reasoning, strategic planning | Dashboard, Events, CRM, Content |
| **claude-haiku-4-5** | Fast notifications, simple tasks | AI Platform (notifications) |

### Gemini Models

| Model | Primary Use | Modules |
|-------|------------|---------|
| **gemini-3-pro-preview** | Complex tasks, research, structured output | All modules |
| **gemini-3-flash-preview** | Fast tasks, knowledge search, extractions | All modules |
| **gemini-3-pro-image-preview** | Image generation | Pitch Deck, Events, Content |

---

## Edge Function Mapping

| Edge Function | Modules | Actions | Status |
|---------------|---------|---------|--------|
| `ai-platform` | Dashboard, AI Platform | 22 actions | 🔴 Needs consolidation |
| `crm-platform` | CRM Platform | 27 actions | 🔴 Needs consolidation |
| `content-platform` | Pitch Deck, Content Platform | 32 actions | 🔴 Needs consolidation |
| `onboarding-wizard` | Onboarding Wizard | 11 actions | 🟡 85% complete |
| `event-*` (8 functions) | Events System | 8 functions | ✅ 65% complete |

**Total:** 4 platform functions + 8 event functions = 12 functions, 92 actions

---

## Quick Reference: Which Module for What?

| Need | Module | Screen | Agent |
|------|--------|--------|-------|
| View startup overview | Dashboard | Main Dashboard | RiskAnalyzer |
| Manage investor contacts | CRM Platform | Contacts | ContactEnricher |
| Track fundraising deals | CRM Platform | Deals | DealScorer |
| Organize work into projects | CRM Platform | Projects | ProjectRiskAnalyzer |
| Prioritize daily tasks | CRM Platform | Tasks | TaskPrioritizer |
| Create pitch deck | Pitch Deck Generator | Pitch Deck | Orchestrator |
| Plan startup event | Events System | Event Wizard | EventPlanner |
| Create lean canvas | Content Platform | Lean Canvas | Planner |
| Generate investor one-pager | Content Platform | Investor Docs | Content/Comms |
| Ask startup questions | AI Platform | AI Chat | RAGRetriever |
| Get risk analysis | AI Platform | Dashboard | RiskAnalyzer |

---

## Next Steps

1. **Review each module document** for detailed implementation guidance
2. **Start with high-completion modules** (Dashboard, Onboarding Wizard)
3. **Consolidate edge functions** (CRM, AI, Content platforms)
4. **Complete remaining features** in each module
5. **Test end-to-end workflows** across modules

---

**Reference:** Each module document contains complete implementation details, real-world examples, user stories, acceptance criteria, and model specifications.
