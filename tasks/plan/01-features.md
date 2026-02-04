# StartupAI Features Planning Document

> **Version:** 1.0 | **Updated:** 2026-02-03 | **PRD:** v6.1

---

## Overview

| Metric | Existing | Planned | Total |
|--------|----------|---------|-------|
| **Feature Areas** | 12 | 6 | 18 |
| **Pages** | 33 | 8 | 41 |
| **Edge Functions** | 15 | 6 | 21 |
| **Database Tables** | 58 | 27 | 85 |

---

## Feature Status Legend

| Status | Meaning |
|--------|---------|
| ✅ | Complete - Production ready |
| 🔄 | In Progress - Partially built |
| 📋 | Planned - Designed, not built |
| ❌ | Not Started - Needs design |

---

## 1. ONBOARDING & WIZARD

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| 4-Step Wizard | ✅ | `OnboardingWizard.tsx` | `onboarding-agent` | URL, founder, context enrichment |
| AI Extraction | ✅ | `WizardStep1-4` | `onboarding-agent` | Extracts entities from free text |
| Readiness Scoring | ✅ | `ReadinessCard` | `onboarding-agent` | 6-dimension score |
| Industry Detection | ✅ | `IndustrySelector` | `onboarding-agent` | Auto-detects from description |
| Wizard Sessions | ✅ | DB | - | `wizard_sessions`, `wizard_extractions` |
| Completion Bridge | ✅ | `OnboardingComplete.tsx` | - | Redirects to dashboard |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Chat-First Onboarding | 📋 | `ChatOnboarding` | `ai-chat` | Conversational setup (5 questions max) |
| Progressive Enrichment | 📋 | - | `onboarding-agent` | Cards animate in individually (realtime) |
| Day 1 Task Generation | 📋 | `DailyFocus` | `ai-chat` | Single actionable first task |

---

## 2. CHAT SYSTEM (ATLAS)

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| AI Chat Interface | ✅ | `AIChat.tsx` | `ai-chat` | Multi-model streaming |
| Chat Sessions | ✅ | DB | - | `chat_sessions`, `chat_messages` |
| Chat Facts | ✅ | DB | - | `chat_facts` - extracted entities |
| Industry Context | ✅ | - | `industry-expert-agent` | Playbook injection |
| Stage Guidance | ✅ | - | `ai-chat` | Stage-appropriate responses |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Tool Calling (CRUD) | 📋 | - | `ai-chat` | Create/update/delete from chat |
| Entity Linking | 📋 | - | `ai-chat` | Link chat to contacts, tasks, canvas |
| Approval Flow | 📋 | `ActionConfirm` | - | Confirm destructive actions |
| Web Search | 📋 | - | `ai-chat` | Grounded responses |
| Document Generation | 📋 | - | `documents-agent` | Generate docs from chat |
| Proactive Suggestions | 📋 | `SuggestionPanel` | `ai-chat` | AI-initiated recommendations |

---

## 3. STARTUP VALIDATOR

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Validator Page | 🔄 | `Validator.tsx` | - | Shell exists |
| Validation Agent | 🔄 | - | `validation-agent` | Basic implementation |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Quick Form (30s) | 📋 | `QuickValidateForm` | `validation-agent` | Single textarea + submit |
| Chat Validator | 📋 | `ChatValidator` | `ai-chat` | Conversational input |
| Full Wizard | 📋 | `ValidatorWizard` | `validation-agent` | 5-step comprehensive |
| Validation Dashboard | 📋 | `ValidationReport` | - | Score, flags, recommendations |
| Market Analysis | 📋 | `MarketReport` | `market-agent` | TAM/SAM/SOM, trends |
| Competitor Intelligence | 📋 | `CompetitorReport` | `competitor-agent` | Positioning, SWOT |
| Financial Projections | 📋 | `FinancialReport` | `financial-agent` | Unit economics, revenue models |
| Roadmap Generation | 📋 | `RoadmapReport` | `roadmap-agent` | Phases, team, budget |

---

## 4. LEAN SYSTEM

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Lean Canvas Editor | ✅ | `LeanCanvas.tsx` | `lean-canvas-agent` | 9-block visual editor |
| AI Prefill | ✅ | - | `lean-canvas-agent` | Maps from profile |
| AI Suggestions | ✅ | - | `lean-canvas-agent` | Per-block suggestions |
| Canvas Validation | ✅ | - | `lean-canvas-agent` | Score per block |
| Version History | ✅ | - | `lean-canvas-agent` | Track changes |
| Pivot Suggestions | ✅ | - | `lean-canvas-agent` | AI pivot recommendations |
| Benchmarks | ✅ | - | `lean-canvas-agent` | Industry comparisons |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Customer Forces | 📋 | `CustomerForces.tsx` | - | Push/pull forces, JTBD |
| Risk Board | 📋 | `RiskBoard.tsx` | - | Prioritized assumptions |
| Experiment Lab | 📋 | `ExperimentLab.tsx` | `validation-agent` | Design & track experiments |
| Multi-User Sync | 📋 | - | Realtime | Live collaboration |
| Assumptions Extraction | 📋 | - | `lean-canvas-agent` | Auto-extract from canvas |

---

## 5. FOUNDER ROADMAP

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Stage Analyzer | ✅ | - | `stage-analyzer` | Detect startup stage |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Visual Journey Map | 📋 | `FounderRoadmap.tsx` | - | 5-phase horizontal timeline |
| Phase Detail Cards | 📋 | `PhaseCard` | - | Expandable sub-stages |
| Now-Next-Later Board | 📋 | `StagePlanning` | - | Stage-scoped tasks |
| Stage Coach Agent | 📋 | - | `stage-coach-agent` | Personalized coaching |
| Gate Validator | 📋 | - | `gate-validator-agent` | Evidence validation |
| Stage Detector | 📋 | - | `stage-detector-agent` | Auto-detect from data |
| Milestone Tracking | 📋 | `MilestoneList` | - | Evidence-based progress |
| Gate Progress | 📋 | `GateProgress` | - | 80% readiness required |

---

## 6. PITCH DECK

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Pitch Deck Wizard | ✅ | `PitchDeckWizard.tsx` | `pitch-deck-agent` | 5-step creation |
| Pitch Deck Editor | ✅ | `PitchDeckEditor.tsx` | `pitch-deck-agent` | 3-panel slide editor |
| Deck Generation | ✅ | `PitchDeckGenerating.tsx` | `pitch-deck-agent` | AI slide generation |
| Deck Dashboard | ✅ | `PitchDecksDashboard.tsx` | - | List all decks |
| Slide Templates | ✅ | - | `pitch-deck-agent` | Multiple templates |
| AI Interview | ✅ | - | `pitch-deck-agent` | Guided Q&A for content |
| Research Mode | ✅ | - | `pitch-deck-agent` | Market research for slides |
| Image Generation | ✅ | - | `pitch-deck-agent` | AI images for slides |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Slide-by-Slide Stream | 📋 | - | Realtime | Progress as slides generate |
| Deck Benchmarks | 📋 | - | `pitch-deck-agent` | Compare to successful decks |
| Export Improvements | 📋 | - | - | PDF, PowerPoint |

---

## 7. DOCUMENTS

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Documents Page | ✅ | `Documents.tsx` | `documents-agent` | File management |
| Document Generation | ✅ | - | `documents-agent` | AI document creation |
| File Uploads | ✅ | - | Storage | `file_uploads` table |
| Version History | ✅ | - | - | `document_versions` table |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Category Cards | 📋 | `CategoryCards` | - | Fundraising, Planning, Financial, Operational |
| Document Readiness | 📋 | `ReadinessGauge` | - | Stage-specific requirements |
| AI Recommendations | 📋 | `DocRecommendations` | `documents-agent` | Contextual suggestions |
| Data Room Builder | 📋 | `DataRoom` | - | Due diligence package |

---

## 8. INVESTORS & CRM

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Investors Page | ✅ | `Investors.tsx` | `investor-agent` | Investor database |
| CRM Page | ✅ | `CRM.tsx` | `crm-agent` | Contacts, deals, pipeline |
| Contact Management | ✅ | - | `crm-agent` | CRUD contacts |
| Deal Pipeline | ✅ | - | `crm-agent` | Kanban stages |
| AI Enrichment | ✅ | - | `crm-agent` | Auto-enrich contacts |
| Investor Fit Scoring | ✅ | - | `investor-agent` | Match investors to startup |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Deal Re-Scoring | 📋 | - | Realtime | Live probability updates |
| Investor Readiness | 📋 | `ReadinessChecker` | `investor-agent` | Checklist for fundraising |
| Scenario Planner | 📋 | `FundingScenarios` | `investor-agent` | Dilution, runway comparison |

---

## 9. PLAYBOOKS & PROMPT PACKS

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Industry Playbooks | ✅ | DB | `industry-expert-agent` | 21 verticals |
| Playbook Injection | ✅ | - | `industry-expert-agent` | Context in all responses |
| Prompt Packs | ✅ | DB | `prompt-pack` | 26 libraries |
| Prompt Pack Steps | ✅ | - | `prompt-pack` | Multi-step execution |
| Prompt Pack Runs | ✅ | - | `prompt-pack` | Track execution |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Playbook Browser | 📋 | `PlaybookBrowser` | - | Browse & apply playbooks |
| Stage-Gated Packs | 📋 | - | `prompt-pack` | One pack per stage |

---

## 10. TASKS & PROJECTS

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Tasks Page | ✅ | `Tasks.tsx` | `task-agent` | Task management |
| Projects Page | ✅ | `Projects.tsx` | - | Project containers |
| Project Detail | ✅ | `ProjectDetail.tsx` | - | Individual project view |
| Task CRUD | ✅ | - | `task-agent` | Create, update, delete |
| Daily Focus | ✅ | - | `compute-daily-focus` | Priority recommendations |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Strategy → Tasks | 📋 | - | Realtime | Auto-generate from strategy |
| Bottleneck Detection | 📋 | `BottleneckAlert` | `ai-chat` | Warn about task pileups |
| Task Alignment | 📋 | `AlignmentGauge` | `ai-chat` | Match tasks to strategy |

---

## 11. DASHBOARD & ANALYTICS

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Dashboard | ✅ | `Dashboard.tsx` | `dashboard-metrics` | Main command center |
| Health Score | ✅ | - | `health-scorer` | 6-dimension scoring |
| Analytics Page | ✅ | `Analytics.tsx` | - | Metrics visualization |
| Insights Generator | ✅ | - | `insights-generator` | AI insights |
| Action Recommender | ✅ | - | `action-recommender` | Next steps |
| Workflow Triggers | ✅ | - | `workflow-trigger` | Automated actions |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Live Health Score | 📋 | - | Realtime | Score updates on data change |
| Daily Focus View | 📋 | `DailyFocus` | - | One task, one metric, one insight |
| Risk Detection | 📋 | `RiskAlerts` | Realtime | Proactive warnings |
| Strategy Progress Feed | 📋 | `ProgressFeed` | Realtime | Timeline of AI actions |
| 30-60-90 Day Plan | 📋 | `DayPlan` | `ai-chat` | Generated after onboarding |

---

## 12. EVENTS

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Events Page | ✅ | `Events.tsx` | `event-agent` | Event management |
| Event Wizard | ✅ | `EventWizard.tsx` | `event-agent` | Create events |
| Event Detail | ✅ | `EventDetail.tsx` | - | View event |
| Public Events | ✅ | `PublicEventsDirectory.tsx` | - | Public listing |
| Event Agent | ✅ | - | `event-agent` | AI assistance |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Event Intelligence | 📋 | `EventInsights` | `event-agent` | Match events to startup |

---

## 13. STARTUP & MVP PLANNING

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Company Profile | ✅ | `CompanyProfile.tsx` | - | Startup overview |
| User Profile | ✅ | `UserProfile.tsx` | - | Founder profile |
| Settings | ✅ | `Settings.tsx` | - | App settings |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| MVP Canvas | 📋 | `MVPCanvas.tsx` | - | 7-block MVP planning |
| Feature Prioritization | 📋 | `FeaturePriority` | - | RICE scoring |
| Sprint Planning | 📋 | `SprintPlanner` | - | Lean sprints |

---

## 14. GO-TO-MARKET

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| None | - | - | - | - |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| GTM Strategy | 📋 | `GTMStrategy.tsx` | - | Channel planning |
| Channel Testing | 📋 | `ChannelTests` | - | CAC experiments |
| Traction Metrics | 📋 | `TractionDashboard` | - | Customer Factory model |
| PMF Checker | 📋 | `PMFChecker` | - | 40% "very disappointed" |

---

## 15. REALTIME AI

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| None | - | - | - | Supabase Realtime available |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Dashboard Health Score | 📋 | `HealthScoreLive` | Realtime | Live score updates |
| Onboarding AI Stream | 📋 | - | Realtime | Progressive card reveal |
| Strategy → Task Generator | 📋 | - | Realtime | Live task creation |
| Risk Detection Engine | 📋 | `RiskEngine` | Realtime | Proactive warnings |
| Lean Canvas AI Sync | 📋 | - | Realtime | Multi-user collaboration |
| Pitch Deck Stream | 📋 | - | Realtime | Slide-by-slide generation |
| Deal Re-Scoring | 📋 | - | Realtime | Live probability |
| Strategy Alignment | 📋 | - | Realtime | Task-strategy match |
| Live Re-Simulation | 📋 | - | Realtime | Assumption cascade |
| Fundraising Scenarios | 📋 | - | Realtime | Slider updates |
| Market Signals | 📋 | - | Realtime | External alerts |
| Pivot Recommendations | 📋 | - | Realtime | AI pivot options |

---

## 16. VECTOR DATABASE (RAG)

### Existing Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| None | - | - | - | pgvector available |

### Planned Features

| Feature | Status | Page/Component | Edge Function | Notes |
|---------|--------|----------------|---------------|-------|
| Knowledge Chunks | 📋 | - | - | RAG storage |
| Deck Benchmarks | 📋 | - | - | Pitch intelligence |
| Investor Feedback | 📋 | - | - | Feedback patterns |
| Decision Outcomes | 📋 | - | - | Decision intelligence |
| Industry Insights | 📋 | - | - | Vertical knowledge |

---

## IMPLEMENTATION PLAN

### Phase 1: Chat Tool Calling (Weeks 1-2)

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Chat CRUD operations | P0 | M | ai-chat agent |
| Entity linking | P0 | M | Database schema |
| Approval flow | P0 | S | UI components |
| Action feedback | P0 | S | - |

### Phase 2: Startup Validator (Weeks 3-6)

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Quick Form mode | P0 | M | validation-agent |
| Chat Validator mode | P0 | M | ai-chat |
| Validation Dashboard | P0 | L | 21 DB tables |
| Market Agent | P0 | L | New edge function |
| Competitor Agent | P0 | L | New edge function |
| Financial Agent | P0 | L | New edge function |
| Roadmap Agent | P0 | L | New edge function |

### Phase 3: Chat-First Onboarding (Weeks 7-8)

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Conversational onboarding | P0 | M | ai-chat |
| Auto-fill from conversation | P0 | M | Existing agents |
| Playbook assignment | P0 | S | Industry detection |
| Day 1 task | P0 | S | task-agent |

### Phase 4: Founder Roadmap (Weeks 9-10)

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Visual journey map | P1 | L | New page |
| Stage-scoped planning | P1 | M | Database tables |
| Stage Coach Agent | P1 | L | New edge function |
| Gate Validator Agent | P1 | M | New edge function |
| Stage Detector Agent | P1 | M | Extend stage-analyzer |

### Phase 5: Realtime AI (Weeks 11-14)

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Realtime channels | P1 | M | Supabase Realtime |
| Dashboard health score | P1 | M | health-scorer |
| Onboarding AI stream | P1 | M | onboarding-agent |
| Risk detection engine | P1 | L | New logic |
| Lean Canvas AI sync | P1 | M | lean-canvas-agent |

### Phase 6: Vector Search (Weeks 15-18)

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| pgvector setup | P1 | M | Database migration |
| Knowledge embeddings | P1 | L | Embedding generation |
| RAG retrieval | P1 | L | ai-chat integration |
| Daily focus view | P1 | M | UI + backend |
| Documents dashboard | P1 | M | Existing components |

### Phase 7: Polish & Scale (Weeks 19-22)

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Advanced realtime | P2 | L | Phase 5 complete |
| Mobile chat UI | P2 | L | Responsive design |
| Team collaboration | P2 | L | RLS updates |
| Performance optimization | P2 | M | Caching, parallel |

---

## SUMMARY

### Existing vs Planned

| Area | Existing | Planned | Status |
|------|----------|---------|--------|
| Onboarding | 6 features | 3 features | ✅ Solid |
| Chat | 5 features | 6 features | 🔄 Needs tool calling |
| Validator | 2 features | 8 features | 📋 Major build needed |
| Lean System | 7 features | 5 features | ✅ Strong, needs experiments |
| Roadmap | 1 feature | 8 features | 📋 New screen |
| Pitch Deck | 8 features | 3 features | ✅ Mature |
| Documents | 4 features | 4 features | 🔄 Needs dashboard |
| CRM/Investors | 6 features | 3 features | ✅ Solid |
| Playbooks | 5 features | 2 features | ✅ Complete |
| Tasks | 5 features | 3 features | ✅ Needs realtime |
| Dashboard | 6 features | 5 features | 🔄 Needs realtime |
| Events | 5 features | 1 feature | ✅ Complete |
| Startup Planning | 3 features | 3 features | 📋 MVP Canvas needed |
| GTM | 0 features | 4 features | 📋 New area |
| Realtime | 0 features | 12 features | 📋 Major initiative |
| Vector/RAG | 0 features | 5 features | 📋 Infrastructure |

### Priority Summary

| Priority | Features | Effort |
|----------|----------|--------|
| **P0 (Must Have)** | 25 | Weeks 1-8 |
| **P1 (Should Have)** | 35 | Weeks 9-18 |
| **P2 (Nice to Have)** | 15 | Weeks 19-22 |

---

## EDGE FUNCTIONS

### Existing (15)

| Function | Status | Actions |
|----------|--------|---------|
| `ai-chat` | ✅ | chat, route, prioritize |
| `onboarding-agent` | ✅ | extract, enrich, score |
| `lean-canvas-agent` | ✅ | map, prefill, validate, pivot, benchmark |
| `pitch-deck-agent` | ✅ | generate, interview, research, slides |
| `validation-agent` | 🔄 | extract_assumptions |
| `crm-agent` | ✅ | enrich, score, segment |
| `documents-agent` | ✅ | generate, summarize |
| `event-agent` | ✅ | create, schedule |
| `investor-agent` | ✅ | find, score, analyze |
| `industry-expert-agent` | ✅ | context, tactics |
| `task-agent` | ✅ | crud, suggest |
| `health-scorer` | ✅ | calculate, update |
| `stage-analyzer` | ✅ | detect, compare |
| `workflow-trigger` | ✅ | trigger, execute |
| `compute-daily-focus` | ✅ | prioritize |

### Planned (6)

| Function | Status | Actions |
|----------|--------|---------|
| `market-agent` | 📋 | tam, segments, trends |
| `competitor-agent` | 📋 | profile, swot, positioning |
| `financial-agent` | 📋 | unit_economics, projections |
| `roadmap-agent` | 📋 | phases, team, budget |
| `stage-coach-agent` | 📋 | summarize, focus, warn |
| `gate-validator-agent` | 📋 | check_readiness, validate |

---

## DATABASE TABLES

### Existing (58)

Core, CRM, AI/Agents, Wizard, Documents, Chat, Investors/Pitch, Events, Lean Canvas, Validation, Playbooks, System

### Planned (27)

| Category | Tables | JSONB Strategy |
|----------|--------|----------------|
| Validator | 8 | ideas, validation_scores, market_analysis, competitors, financial_models, roadmap, risk_analysis, research_sources |
| Lean Validation | 5 | assumptions, experiments, customer_segments, interviews, industry_benchmarks |
| Vector | 4 | knowledge_chunks, deck_benchmarks, investor_feedback, decision_outcomes |
| Resources | 4 | curated_resources, strategic_partners, templates, glossary |
| Roadmap | 6 | founder_roadmap, roadmap_milestones, roadmap_gates, roadmap_tasks, coach_interactions, cross_phase_milestones |

---

*Document generated for PRD v6.1 — 2026-02-03*
