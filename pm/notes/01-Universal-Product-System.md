Below is a **single, complete `MASTER_SPEC.md`** you can **paste directly into any repository** and reuse for **any project or industry** (travel, SaaS, real estate, fintech, education, internal tools, etc.).

It is **tool-agnostic, scalable, and AI-ready**.

---

```md
# MASTER_SPEC.md
# Universal Product System — Website + Dashboard + Chatbot + AI

> A reusable blueprint for building products with  
> **website marketing, dashboards, chatbots, wizards, AI agents, workflows, and automations**  
> using a **safe, preview-first intelligence layer**.

---

## 1. PRODUCT PHILOSOPHY

### Core Principle
**Humans decide. AI assists. Nothing happens silently.**

### System Mental Model
```

LEFT  → Context & Navigation
MAIN  → Human Work
RIGHT → Intelligence & Actions

````

This separation:
- Scales to any domain
- Prevents AI chaos
- Keeps users oriented and in control

---

## 2. GLOBAL ROUTES & SCREENS (TEMPLATE)

### 2.1 Website / Marketing
| Screen | Route | Purpose |
|---|---|---|
| Home | `/` | Explain value quickly |
| Use Cases | `/use-cases` | Match user intent |
| How It Works | `/how-it-works` | Trust & clarity |
| Pricing (optional) | `/pricing` | Monetization |
| Contact (optional) | `/contact` | Leads |

**Real-world examples**
- "Plan a weekend in 5 minutes"
- "Compare options with AI help"
- "Preview before applying changes"

---

### 2.2 Application (Dashboard)
| Screen | Route |
|---|---|
| App Home | `/app` |
| Explore / Discover | `/app/explore` |
| Chatbot | `/app/chat` |
| Domain List | `/app/{domain}` |
| Domain Detail | `/app/{domain}/:id` |
| Map | `/app/maps` |
| Bookings / Records | `/app/bookings` |
| Saved / Favorites | `/app/saved` |
| Media | `/app/media` |
| Calendar | `/app/calendar` |
| Settings | `/app/settings` |

---

## 3. DASHBOARD LAYOUT (LEFT / MAIN / RIGHT)

### 3.1 LEFT PANEL — CONTEXT
**Purpose**
- Navigation
- Scope definition (project, trip, client, property, etc.)

**Contains**
- Home
- Explore
- Domains
- Saved
- Chat / Concierge
- Settings

**Never**
- No editing
- No AI execution

---

### 3.2 MAIN PANEL — WORK
**Purpose**
- Where users think and act

**Contains**
- Lists
- Detail pages
- Editors
- Dashboards
- Wizards
- Chat threads

**Rule**
> AI never replaces the human here.

---

### 3.3 RIGHT PANEL — INTELLIGENCE
**Purpose**
- Suggestions, checks, optimizations

**Contains**
- AI Actions
- Warnings
- Smart optimizations
- Automations
- "Why this matters" explanations

**Rule**
> AI can propose, not commit.

---

## 4. CHATBOT (UNIVERSAL ENTRY POINT)

### Structure
- **Single chatbot screen**
- **Top icon tabs** per domain (example):
  - Projects / Trips
  - Events / Tasks
  - Restaurants / Resources
  - Rentals / Assets
  - Map / Timeline

### Behavior
- One query → results across ALL tabs
- Same data, different views
- User switches context instantly

**Example**
User: "Good options near me"
- Items tab → multiple options
- Related tab → nearby activities
- Plan tab → suggested plan
- Map tab → clustered view

---

## 5. WIZARDS (GUIDED CREATION)

### Purpose
- Reduce friction
- Prevent errors
- Guide complex setup

### Wizard Rules
- Step-by-step
- Draft auto-saved
- AI assists but never skips steps

**Examples**
- Create Project / Trip
- Create Event
- Add Booking / Record
- Onboard Client / Property

---

## 6. FEATURES — CORE vs ADVANCED

### 6.1 Core Features (MVP)
- CRUD for all entities
- Search & filters
- Save / shortlist
- Manual planning
- Calendar & media
- Basic AI explanations (read-only)

**Example**
User manually builds a plan and saves items.

---

### 6.2 Advanced AI Features
- Multi-domain chatbot results
- Fit / value scoring
- Optimization (time, route, cost)
- Booking parsing & reconciliation
- Scenario planning
- Preview → Apply → Undo

**Example**
AI proposes a better plan; user approves.

---

## 7. AI SYSTEM (REUSABLE)

### 7.1 AI AGENTS
| Agent | Responsibility |
|---|---|
| Orchestrator | Decides what runs |
| Planner | Turns goals into steps |
| Analyst | Finds risks & gaps |
| Optimizer | Improves efficiency |
| Scorer | Computes fit/value |
| Retriever (RAG) | Searches internal data |
| Extractor | Structures raw input |
| Content/Comms | Writes messages |
| Ops Automation | Triggers reminders |
| Controller | Approval gate |

---

### 7.2 AI RULES (NON-NEGOTIABLE)
- No silent writes
- Preview before apply
- Undo always available
- Explain "why"
- Log every AI action
- Respect user scope

---

## 8. WORKFLOWS (HUMAN + AI)

### Generic Workflow Pattern
1. User intent
2. AI analysis
3. AI proposal (preview)
4. User approval
5. Apply action
6. Undo available

### Example Workflows
- Planning
- Reviewing documents
- Scheduling
- Optimization
- Reconciliation

---

## 9. AUTOMATIONS (BACKGROUND HELP)

### Purpose
- Reduce mental load
- Handle predictable tasks

### Rules
- Opt-in
- Visible
- Auditable

**Examples**
- Reminder before deadline
- Alert on conflict
- Suggestion when data missing

---

## 10. DATA & BACKEND (TEMPLATE)

### Core Tables
- profiles
- domains (projects/trips/etc.)
- domain_items
- saved_items
- media_items
- calendar_items
- bookings / records

### AI Tables
- chat_queries
- chat_results
- ai_runs (audit)
- automation_rules
- automation_runs
- knowledge_chunks (RAG vectors)

**Security**
- Strict RLS
- All writes via server functions

---

## 11. EDGE FUNCTIONS / API

### Required Endpoints
- POST `/ai/chat_search`
- POST `/ai/run_action`
- POST `/control/apply_patch`
- POST `/control/undo_patch`
- Domain CRUD APIs

### AI Models
- **Core AI**: fast, safe, read-only
- **Advanced AI**: planning, optimization (opt-in)

---

## 12. HOW IT ALL WORKS TOGETHER

```mermaid
flowchart LR
  Left[Left: Context] --> Scope[(Scope)]
  Scope --> Main[Main: Screens & Editors]
  Scope --> Right[Right: AI Actions]
  Right --> Edge[Edge Functions]
  Edge --> DB[(Database)]
  Edge --> AI[AI Models]
  AI --> Edge
  Edge --> Audit[(AI Logs)]
````

---

## 13. DESIGN PRINCIPLES

* Calm > clever
* Explain before acting
* Never surprise users
* AI earns trust gradually
* Humans stay in control

---

## 14. ONE-LINE TAKEAWAY

> **This spec is a universal blueprint for building products where dashboards, chatbots, wizards, and AI work together safely, clearly, and at scale.**

---

## 15. HOW TO USE THIS FILE

* Copy into any repo
* Rename domains (Trips → Projects → Clients, etc.)
* Keep structure unchanged
* Extend, never break

```

---

### ✅ What you now have
- A **single master spec**
- Reusable for **any project**
- Covers **screens, routes, AI, workflows, backend**
- Safe for **production & scaling**

If you want next, I can:
- Generate a **repo folder structure**
- Convert this into **Jira epics automatically**
- Create a **pitch-deck version**
```
