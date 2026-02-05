
---

## 🤖 GENERIC AGENT TYPES (Archetypes)

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

---

## 🎨 UI/UX & WORKFLOW COMPONENTS

| Component | What it does (simple) | Use case | Real-world example | System Part |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **3-Panel Layout** | Context (L) · Work (M) · AI (R) | Complex apps | Main dashboard with AI sidebar helper | Structure |
| **Wizards** | Step-by-step generic flows | Onboarding/Setup | "Create new project" stepper | Interaction |
| **Chatbots** | Conversational interface | Help/Assistance | "Explain this data point to me" | Interaction |
| **Global Context** | Holds current state/selection | Navigation | "Selected Project: FashionOS" | State Logic |
| **Mermaid Docs** | Visual diagrams from text | Documentation | Auto-generate flowcharts from code | Generation |

---

## 💎 GEMINI 3 CAPABILITIES (Google)

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


## 🧠 Claude Agent SDK — Feature Map (Core → Advanced)

### CORE FEATURES (You need these to build real agents)

| Feature                      | What it does (simple)                    | Use case             | Real-world example                         | Agent type     |
| ---------------------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Agent Loop (Overview)**    | Agent can think → act → observe → repeat | Autonomous workflows | Research agent that keeps refining results | Orchestrator   |
| **Sessions**                 | Maintains state across turns             | Long tasks           | Multi-step onboarding wizard               | Stateful agent |
| **User Input**               | Safely accepts user instructions         | Interactive agents   | "Generate pitch deck from my startup"      | Controller     |
| **Structured Outputs**       | Forces JSON / schemas                    | Reliable automation  | Generate tasks in strict JSON              | Planner        |
| **Streaming vs Single Mode** | Real-time vs batch execution             | UX vs backend jobs   | Streaming chat vs async job                | UI agent       |
| **Custom Tools**             | Define what the agent can do             | Controlled execution | "create_task", "send_email"                | Executor       |
| **Permissions**              | Limits agent actions                     | Security             | Prevent DB/file misuse                     | Security gate  |
| **Hooks**                    | Run logic before/after steps             | Logging, validation  | Audit every AI action                      | Observer       |
| **Cost Tracking**            | Track token spend                        | Cost control         | Per-org AI budgets                         | Finance agent  |
| **Todo Tracking**            | Tracks agent-generated tasks             | Execution plans      | Daily task planner                         | Task agent     |

---

### TOOL USE (How agents actually "do things")

| Tool                    | What it enables         | Use case        | Real-world example        | Risk level |
| ----------------------- | ----------------------- | --------------- | ------------------------- | ---------- |
| **Web Fetch Tool**      | Reads URLs              | Research        | Analyze competitor site   | Medium     |
| **Web Search Tool**     | Searches web            | Discovery       | Find latest AI tools      | Medium     |
| **Bash Tool**           | Runs shell commands     | DevOps          | Run tests, scripts        | High       |
| **Code Execution Tool** | Runs code safely        | Analysis        | Validate calculations     | Medium     |
| **Text Editor Tool**    | Edit files              | Content/code    | Update docs or code       | High       |
| **Computer Use Tool**   | Controls UI             | Automation      | Click through setup flows | Very High  |
| **Memory Tool**         | Persist agent memory    | Personalization | Remember user preferences | Medium     |
| **Tool Search Tool**    | Finds tools dynamically | Large systems   | Auto-select correct tool  | Medium     |

---

### MCP (Model Context Protocol) — INTEGRATIONS

| Feature                | What it solves          | Use case         | Real-world example         | Agent role     |
| ---------------------- | ----------------------- | ---------------- | -------------------------- | -------------- |
| **MCP Connector**      | Connects external tools | SaaS integration | Supabase, GitHub, Stripe   | Integrator     |
| **Remote MCP Servers** | External tool hosts     | Scalable systems | Shared CRM tools           | Platform agent |
| **Plugins**            | Packaged capabilities   | Extensibility    | "SEO plugin", "CRM plugin" | Plugin agent   |

---

## 🧩 AGENT COMPOSITION (Advanced)

| Feature                      | What it enables         | Use case             | Example                       |
| ---------------------------- | ----------------------- | -------------------- | ----------------------------- |
| **Subagents**                | Agents that delegate    | Complex workflows    | Planner → Executor → Reviewer |
| **Skills**                   | Reusable behaviors      | Standardization      | "Market research skill"       |
| **Slash Commands**           | User shortcuts          | Power users          | `/analyze`, `/generate`       |
| **Agent Skills (Guide)**     | Best-practice behaviors | Production agents    | Consistent outputs            |
| **Modifying System Prompts** | Dynamic control         | Context-aware agents | Switch modes per task         |

---


## 🏗️ DEPLOYMENT & PRODUCTION

| Feature | What it does (simple) | Use case | Real-world example | Operations Category |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Hosting** | Where agents run | Scalability | Deploying to AWS/GCP | Infrastructure |
| **Secure Deployment**| Secrets & isolation | Prevent data leaks | Managing API keys safe | Security |
| **File Checkpointing**| Save progress | Crash recovery | Resuming a long research job | Reliability |
| **Prompt Caching** | Reuse context | Cost + speed | Caching the system prompt | Optimization |
| **Context Editing** | Trim/update memory | Prevent drift | Removing old search results | Operations |
| **Extended Thinking**| Deeper reasoning | Complex planning | Solving a hard logic puzzle | Intelligence |
| **Multilingual** | Global users | Localization | Chatting in Spanish/Japanese | Accessibility |

---

## 🧠 CORE vs ADVANCED STRATEGY

| Strategic Area | Core Approach (Must Have) | Advanced Approach (Scale) | Real-world example | Implementation Phase |
| ----------------- | ---------------------------------------- | -------------------- | ------------------------------------------ | -------------- |
| **Agent Basics** | Agent loop, sessions | Subagents, skills | Simple Chatbot -> Research Team | Foundations |
| **Safety** | Permissions, hooks | Secure deployment | User Confirmation -> Enterprise SOC2 | Security |
| **Execution** | Custom tools | MCP, plugins | Basic Tools -> 3rd Party Ecosystem | Capability |
| **UX** | Streaming mode | Slash commands | Text Output -> Power User Shortcuts | Experience |
| **Cost** | Cost tracking | Prompt caching | Simple Billing -> High Scale Optimization | Operations |


---

## 🧪 REAL-WORLD STARTUP USE CASES

### Example 1 — **StartupAI Planner Agent**

* Uses: sessions, structured outputs, web search
* Output: roadmap + tasks (JSON)
* Agents: Planner + Analyst

### Example 2 — **DevOps Automation Agent**

* Uses: bash tool, hooks, permissions
* Output: test results, deployment status
* Agents: Executor + Observer

### Example 3 — **Market Research Agent**

* Uses: web search, web fetch, skills
* Output: competitor analysis
* Agents: Researcher + Summarizer

---

## 🧠 Mental Model (Easy to Remember)

```
Claude Agent SDK =
Agent Brain
+ Tools (what it can do)
+ Rules (what it's allowed to do)
+ Memory (what it remembers)
+ Hooks (who watches it)
```

---

## ✅ Bottom Line

* **Claude Agent SDK is best for autonomous execution**
* **Gemini is better for research, search grounding, images, structured extraction**
* **Together = production-grade AI system**
