# Legend for Prompts and Tasks

**Purpose:** Standardized metadata fields for all prompts and implementation tasks  
**Used By:** Auto Claude specs, prompt templates, task tracking  
**Last Updated:** January 22, 2026

---

## 📝 Status Legend

- ✅ **Complete** - File exists and verified, implementation complete
- 🟡 **Partial** - File exists, implementation incomplete or in progress
- 🔴 **Not Implemented** - Feature not implemented yet
- 🔴 **Missing** - Prompt file needs to be created
- 🚀 **MVP - Phase 1** - Core platform features (MUST-HAVE)
- ⚡ **Intermediate - Phase 2** - Smart workflows, automation (SHOULD-HAVE)
- 🎯 **Advanced - Phase 3** - Scale, performance, collaboration (SHOULD-HAVE)
- 🌟 **Production - Phase 4** - Growth, integrations, AI intelligence (COULD-HAVE)

---

## 📂 Category Legend

**Core Feature Categories:**
- 📊 **Dashboard** - Stats, overview, home screen, insights
- 🧙 **Wizards** - Guided flows (onboarding, pitch deck, lean canvas, event wizard)
- 📄 **Pitch Deck** - Deck generation, editing, templates, AI copilot
- 📋 **Lean Canvas** - Business model canvas, editing, AI assistance
- 🌐 **Website** - Landing pages, public pages, marketing
- ✨ **Features** - Core app functionality
- 👥 **CRM** - Contacts, pipelines, investor management, deal tracking
- 📅 **Events** - Calendars, scheduling, sponsors, venues, attendees
- 📄 **Documents** - Files, uploads, content generation, document management
- 🤖 **AI** - Chatbots, automation, agents, AI panels
- ⚙️ **Settings** - Config, preferences, user settings
- 🔒 **Security** - Auth, permissions, RLS policies
- ⚡ **Performance** - Speed, optimization, caching
- 🎨 **UI/UX** - Design, styling, components, accessibility
- 🗄️ **Supabase** - Database, schema, backend, migrations, edge functions

---

## 📋 Subcategory Legend

**Wizards & Onboarding:**
- 🚀 **Onboarding** - Startup profile wizard, first-time user experience
- 📄 **Pitch Deck Wizard** - Deck creation wizard (4-step flow)
- 📋 **Lean Canvas Wizard** - Canvas creation and editing wizard
- 📅 **Event Wizard** - Event creation and management wizard

**Pitch Deck:**
- 📄 **Pitch Deck Generator** - AI-powered deck generation
- 📄 **Pitch Deck Editor** - WYSIWYG editor with AI copilot
- 📄 **Pitch Deck Templates** - YC, Sequoia, Custom templates
- 📄 **Pitch Deck List** - Deck management, list view

**Lean Canvas:**
- 📋 **Lean Canvas Editor** - Canvas editing interface
- 📋 **Lean Canvas Templates** - Pre-built canvas templates
- 📋 **Lean Canvas AI** - AI assistance for canvas completion

**Dashboard:**
- 📊 **Dashboard Home** - Main overview screen
- 📊 **Dashboard Insights** - AI-powered insights panel
- 📊 **Dashboard Stats** - KPIs, metrics, health scores
- 📊 **Dashboard Actions** - Quick actions, next steps

**AI & Agents:**
- 🤖 **AI Agents** - Orchestrator, Planner, Analyst, Ops Automation, Content/Comms, Retriever/RAG, Extractor, Optimizer, Scorer, Controller
- 🤖 **AI Chatbot** - Context-aware chatbot, AI Coach
- 🤖 **AI Panels** - Right-side intelligence panels
- 🤖 **AI Automation** - Workflow automation, triggers

**CRM:**
- 👥 **CRM Contacts** - Contact management, enrichment
- 👥 **CRM Pipeline** - Deal tracking, Kanban board
- 👥 **CRM Investors** - Investor management, matching, scoring
- 👥 **CRM Deals** - Deal flow, automation, alerts

**Events:**
- 📅 **Events Management** - Event creation, editing, list
- 📅 **Event Sponsors** - Sponsor management, tracking
- 📅 **Event Venues** - Venue management, booking
- 📅 **Event Attendees** - Attendee management, check-in

**Documents:**
- 📄 **Document Management** - File storage, organization
- 📄 **Document Generation** - AI-powered document creation
- 📄 **Document Templates** - Pre-built document templates

**Supabase:**
- 🗄️ **Supabase Schema** - Database schema, tables, relationships
- 🗄️ **Supabase RLS** - Row-level security policies
- 🗄️ **Supabase Migrations** - Database migrations
- 🗄️ **Supabase Edge Functions** - Serverless functions, API endpoints
- 🗄️ **Supabase Triggers** - Database triggers, webhooks
- 🗄️ **Supabase Indexes** - Database indexes, performance optimization

**UI/UX:**
- 🎨 **UI Components** - Reusable components, shadcn/ui
- 🎨 **UX Patterns** - User experience patterns, flows
- 🎨 **Design System** - Design tokens, styling, themes
- 🎨 **Accessibility** - WCAG compliance, a11y features

**Performance:**
- ⚡ **Performance Optimization** - Speed, caching, lazy loading
- ⚡ **Code Quality** - Refactoring, optimization, best practices

**Security:**
- 🔒 **Authentication** - Auth flows, user management
- 🔒 **Authorization** - Permissions, RLS policies
- 🔒 **Security Best Practices** - Security patterns, validation

---

## 🎯 Phase Legend

**Priority Phases:**
- 🔒 **Security (P0)** - CRITICAL - Implement before MVP (auth, RLS, validation)
- 📦 **Core** - Foundational architecture and utilities

**Implementation Phases:**
- 🚀 **MVP - Phase 1** - MUST-HAVE - Core platform features
  - Startup Wizard (Onboarding)
  - Main Dashboard
  - Pitch Deck Generator
  - Lean Canvas Editor
  - Basic CRM
  - Task Management
- ⚡ **Intermediate - Phase 2** - SHOULD-HAVE - Smart workflows, automation
  - AI Agents Integration
  - Workflow Automation
  - Advanced CRM Features
  - Event Management
- 🎯 **Advanced - Phase 3** - SHOULD-HAVE - Scale, performance, collaboration
  - Advanced AI Features
  - Performance Optimization
  - Collaboration Features
  - Advanced Analytics
- 🌟 **Production - Phase 4** - COULD-HAVE - Growth, integrations, AI intelligence
  - Advanced Integrations
  - AI Intelligence Features
  - Growth Features
  - Enterprise Features

**Parallel Work:**
- 🛠️ **Code Quality** - Parallel with Phase 1-2 - Refactoring, optimization
- 🎨 **UI/UX** - Parallel with Phase 1-2 - UX enhancements, accessibility
- 📚 **Documentation** - As needed - Developer docs, guides

---

## 📊 Usage Examples

### Example 1: Pitch Deck Wizard
```markdown
**Status:** 🚀 **MVP - Phase 1**
**Category:** 🧙 **Wizards**
**Subcategory:** 📄 **Pitch Deck Wizard**
```

### Example 2: Lean Canvas Editor
```markdown
**Status:** 🚀 **MVP - Phase 1**
**Category:** 📋 **Lean Canvas**
**Subcategory:** 📋 **Lean Canvas Editor**
```

### Example 3: Onboarding Wizard
```markdown
**Status:** 🚀 **MVP - Phase 1**
**Category:** 🧙 **Wizards**
**Subcategory:** 🚀 **Onboarding**
```

### Example 4: Pitch Deck Generator
```markdown
**Status:** 🚀 **MVP - Phase 1**
**Category:** 📄 **Pitch Deck**
**Subcategory:** 📄 **Pitch Deck Generator**
```

---

## ✅ Verification Checklist

When creating or updating prompts, ensure:
- [ ] Status matches phase (MVP, Intermediate, Advanced, Production)
- [ ] Category is from Category Legend
- [ ] Subcategory is from Subcategory Legend
- [ ] All key features are represented (Pitch Deck, Wizards, Onboarding, Lean Canvas)
- [ ] Metadata is consistent across related prompts

---

**Reference:** See `prompts/tasks-implement/00-tasks-index.md` for complete implementation prompt index
