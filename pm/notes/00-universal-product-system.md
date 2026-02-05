# MASTER_SPEC_V2.md
# Universal Product System — Website + Dashboard + Chatbot + AI

> A comprehensive, reusable blueprint for building products with **website marketing, dashboards, chatbots, wizards, AI agents, workflows, and automations** using a **safe, preview-first intelligence layer**.

---

## 1. PRODUCT PHILOSOPHY

### Core Principle
**Humans decide. AI assists. Nothing happens silently.**

### System Mental Model
```
LEFT  → Context & Navigation
MAIN  → Human Work
RIGHT → Intelligence & Actions
```

This separation:
- Scales to any domain
- Prevents AI chaos
- Keeps users oriented and in control

---

## 2. GLOBAL ROUTES & SCREENS

### 2.1 Website / Marketing
| Screen | Route | Purpose |
|---|---|---|
| Home | `/` | Explain value quickly |
| Use Cases | `/use-cases` | Match user intent |
| How It Works | `/how-it-works` | Trust & clarity |
| Pricing | `/pricing` | Monetization |
| Contact | `/contact` | Leads |

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
**Purpose**: Navigation & Scope definition.
**Contains**: Home, Explore, Domains, Saved, Chat/Concierge, Settings.
**Rule**: No editing, No AI execution.

### 3.2 MAIN PANEL — WORK
**Purpose**: Where users think and act.
**Contains**: Lists, Details, Editors, Dashboards, Wizards, Chat threads.
**Rule**: AI never replaces the human here.

### 3.3 RIGHT PANEL — INTELLIGENCE
**Purpose**: Suggestions, checks, optimizations.
**Contains**: AI Actions, Warnings, Smart optimizations, Automations, "Why this matters".
**Rule**: AI can propose, not commit.

---

## 4. UI/UX & WORKFLOW COMPONENTS

| Component | What it does (simple) | Use case | Real-world example | System Part |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **3-Panel Layout** | Context (L) · Work (M) · AI (R) | Complex apps | Main dashboard with AI sidebar helper | Structure |
| **Wizards** | Step-by-step generic flows | Onboarding/Setup | "Create new project" stepper | Interaction |
| **Chatbots** | Conversational interface | Help/Assistance | "Explain this data point to me" | Interaction |
| **Global Context** | Holds current state/selection | Navigation | "Selected Project: FashionOS" | State Logic |
| **Mermaid Docs** | Visual diagrams from text | Documentation | Auto-generate flowcharts from code | Generation |

---

## 5. STRATEGY: CORE vs ADVANCED

| Strategic Area | Core Approach (Must Have) | Advanced Approach (Scale) | Real-world example | Implementation Phase |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Agent Basics** | Agent loop, sessions | Subagents, skills | Simple Chatbot -> Research Team | Foundations |
| **Safety** | Permissions, hooks | Secure deployment | User Confirmation -> Enterprise SOC2 | Security |
| **Execution** | Custom tools | MCP, plugins | Basic Tools -> 3rd Party Ecosystem | Capability |
| **UX** | Streaming mode | Slash commands | Text Output -> Power User Shortcuts | Experience |
| **Cost** | Cost tracking | Prompt caching | Simple Billing -> High Scale Optimization | Operations |

---

## 6. AI SYSTEM ARCHITECTURE

### 6.1 GENERIC AGENT TYPES (Archetypes)

| Agent Archetype | What it does (simple) | Use case | Real-world example | Operations Role |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Orchestrator** | Decides order of operations | Traffic control | Directs query to "Sales" or "Support" Agent | Manager |
| **Planner** | Breaks goals into steps | Project initialization | "Create a launch plan for Q3 feature" | Strategist |
| **Analyst** | Finds patterns and risks | Data review | "Analyze customer churn reasons" | Researcher |
| **Ops Automation** | Watches triggers, runs actions | Background jobs | "If lead score > 80, message sales team" | Automator |
| **Content/Comms** | Drafts text/messages | communication | Draft personal follow-up emails | Creator |
| **Retriever (RAG)** | Semantic search on docs | Knowledge access | "Find liability clause in these contracts" | Librarian |
| **Extractor** | Pulls structured data | Data entry | Turn PDF invoices into JSON | Processor |
| **Controller** | Human approval gate | Safety checks | "Approve refund of $500?" | Security |

### 6.2 AI RULES (NON-NEGOTIABLE)
1. **No Silent Writes**: Every action is approved or previewed.
2. **Preview Before Apply**: Show the diff, not just the result.
3. **Undo Always Available**: "Ctrl+Z" for AI actions.
4. **Explain "Why"**: Rationale accompanies every suggestion.
5. **Log Every Action**: Audit trails for all intelligence.

---

## 7. TECHNOLOGY FEATURES & CAPABILITIES

### 7.1 GEMINI 3 CAPABILITIES (Google)

| Feature | What it does (simple) | Use case | Real-world example | Capability Type |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Gemini 3 Pro** | High-reasoning model | Complex analysis | Legal contract analysis & redlining | Core Model |
| **Gemini 3 Flash**| Fast, low-latency model | High volume tasks | Real-time chat responses | Core Model |
| **Gemini Thinking**| Extended reasoning steps | Hard logic puzzles | Debugging complex race conditions | Reasoning |
| **Search Grounding**| Connects to live Google Search | Fact-checking | "What is the latest pricing for X?" | Grounding |
| **Maps Grounding** | Connects to Geospatial data | Location tasks | "Find suppliers near manufacturing hub" | Grounding |
| **Code Execution** | Writes & runs Python code | Data analysis | "Plot this CSV data into a chart" | Tooling |
| **Structured Output**| Forces strict JSON schema | API integration | Extract specific fields for Database | Reliability |
| **Image Gen** | Creates images (Nano Banana) | Visual assets | "Generate concept art for homepage" | Multimodal |
| **RAG** | Retrieval Augmented Gen | Long-term memory | "Answer based on internal wiki" | Memory |

### 7.2 CLAUDE AGENT SDK FEATURES

| Feature | What it does (simple) | Use case | Real-world example | Agent type |
| ---------------------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Agent Loop** | Think → Act → Observe | Autonomous workflows | Research agent | Orchestrator |
| **Sessions** | Maintains state across turns | Long tasks | Onboarding wizard | Stateful |
| **Structured Outputs**| Forces JSON / schemas | Reliable automation | Generate strict JSON tasks | Planner |
| **Custom Tools** | Define agent actions | Execution | "create_task", "send_email" | Executor |
| **Permissions** | Limits actions | Security | Prevent DB misuse | Gatekeeper |
| **MCP Connector** | Connects external tools | Integration | Supabase, GitHub, Stripe | Integrator |
| **Subagents** | Delegate tasks | Complex flows | Planner → Executor | Manager |

---

## 8. DEPLOYMENT & PRODUCTION

| Feature | What it does (simple) | Use case | Real-world example | Operations Category |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Hosting** | Where agents run | Scalability | Deploying to AWS/GCP | Infrastructure |
| **Secure Deployment**| Secrets & isolation | Prevent data leaks | Managing API keys safe | Security |
| **File Checkpointing**| Save progress | Crash recovery | Resuming a long research job | Reliability |
| **Prompt Caching** | Reuse context | Cost + speed | Caching the system prompt | Optimization |
| **Context Editing** | Trim/update memory | Prevent drift | Removing old search results | Operations |

---

## 9. DATA & BACKEND

### Core Tables
- `profiles`
- `domains` (projects/trips/etc.)
- `domain_items`
- `saved_items`
- `media_items`
- `calendar_items`
- `bookings` / `records`

### AI Tables
- `chat_queries`
- `chat_results`
- `ai_runs` (audit)
- `automation_rules`
- `automation_runs`
- `knowledge_chunks` (pgvector)

### Edge Functions
- `POST /ai/chat_search`: Search via Gemini/Claude
- `POST /ai/run_action`: Execute authorized tool
- `POST /control/apply_patch`: Apply previewed change
- `POST /control/undo_patch`: Revert change

---

## 10. SYSTEM DIAGRAM

```mermaid
flowchart LR
  Left[Left: Context] --> Scope[(Scope)]
  Scope --> Main[Main: Screens & Editors]
  Scope --> Right[Right: AI Actions]
  Right --> Edge[Edge Functions]
  Edge --> DB[(Database)]
  Edge --> AI[AI Models (Gemini/Claude)]
  AI --> Edge
  Edge --> Audit[(AI Logs)]
```
