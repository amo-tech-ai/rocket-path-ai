---
prompt_number: 100
title: StartupAI Copilot — Comprehensive Chatbot System
category: Chat AI
focus: Multi-agent conversational AI for startup founders
phase: MVP
priority: P0
status: not_started
percent_complete: 0
owner: mixed
last_updated: 2026-01-28
---

# Prompt 100 — StartupAI Copilot

> **Phase:** MVP | **Priority:** P0
> **Route:** `/chat`, embedded in all dashboards
> **Edge Function:** `supabase/functions/ai-chat/index.ts`
> **AI Models:** Gemini 3 Flash (speed), Gemini 3 Pro (complex), Claude Sonnet 4.5 (reasoning)

---

## Section Summary Table

| # | Section | Purpose | Key Deliverables |
|---|---------|---------|------------------|
| 1 | Product Summary | What is StartupAI Copilot | Value proposition, positioning |
| 2 | Core Modules | Platform modules the copilot supports | 12 modules + AI agent mapping |
| 3 | UX Principles | Chat experience design | UI patterns, 3-panel integration |
| 4 | User Journeys | End-to-end flows | 5 journey maps with touchpoints |
| 5 | User Stories | Detailed requirements | 15+ stories with acceptance criteria |
| 6 | Features & Data | What the copilot can access | Data sources, **context priority levels** |
| 7 | AI Agents | Multi-agent architecture | **Split orchestrator**, agent ownership, QA spec, research trust |
| 8 | Workflows | Common copilot workflows | 8 documented flows |
| 9 | Frontend Components | React components needed | 12 components + hooks |
| 10 | Backend & Edge Functions | API specifications | 6 edge function actions |
| 11 | Database Schema | Tables and relationships | 4 tables + queries |
| 12 | Dashboard Interaction | "Do it for me" capabilities | **Execution safety system**, undo tokens |
| 13 | Example Content | Real prompts and responses | FinTech + eCommerce examples |
| 14 | **Phased Implementation** | **MVP scope control** | **4 phases, release gates** |
| 15 | Success Criteria | Launch requirements | MVP, quality, business metrics |

---

## 1. Product Summary

### What is StartupAI Copilot?

StartupAI Copilot is an **AI-powered co-founder** that helps startup founders:

- **Navigate** — Answer questions about fundraising, product, growth, operations
- **Execute** — Complete tasks directly in dashboards ("Do it for me")
- **Advise** — Provide stage-specific recommendations based on real data
- **Research** — Find investors, analyze competitors, identify market trends
- **Write** — Draft pitch decks, emails, one-pagers, investor updates

### Value Proposition

| Traditional Tools | StartupAI Copilot |
|-------------------|-------------------|
| Generic chatbots | Understands YOUR startup data |
| Manual research | Real-time market intelligence |
| Static templates | Dynamic content generation |
| Separate tools | Unified platform with context |

### Positioning

**Tagline:** "The AI co-founder that knows your startup."

**User understands:** "I can ask this AI anything about building my startup, and it actually knows my data, my stage, my industry — and can execute tasks for me."

---

## 2. Core Modules

StartupAI Copilot integrates with all 12 platform modules:

| Module | Copilot Capabilities | Primary Agent |
|--------|---------------------|---------------|
| **Onboarding** | Guide through 4-step wizard, auto-fill fields | Interviewer Agent |
| **Dashboard** | Summarize metrics, suggest focus areas | Strategist Agent |
| **Lean Canvas** | Generate canvas, validate assumptions | Strategist Agent |
| **Pitch Deck** | Create slides, improve content, score deck | Writer Agent |
| **CRM** | Add contacts, qualify leads, draft outreach | Ops Agent |
| **Investors** | Match investors, research firms, track pipeline | Fundraising Agent |
| **Documents** | Generate exec summary, one-pager, data room | Writer Agent |
| **Tasks** | Prioritize, assign, track progress | Ops Agent |
| **Events** | Find relevant events, prep for pitch nights | Research Agent |
| **Financials** | Explain metrics, project runway, model scenarios | Strategist Agent |
| **Team** | Define roles, create job descriptions | Ops Agent |
| **Market Research** | Analyze competitors, size TAM, identify trends | Research Agent |

---

## 3. UX Principles

### Core Experience

| Principle | Implementation |
|-----------|----------------|
| **Always available** | Chat accessible from any dashboard (right panel or floating) |
| **Context-aware** | Knows current page, selected item, user's history |
| **Action-oriented** | Every response includes suggested next actions |
| **Conversational** | Natural language, not commands |
| **Progressive** | Simple answers first, deep dives on request |

### 3-Panel Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header (fixed)                          │
├──────────┬──────────────────────────────────────┬───────────────┤
│          │                                      │               │
│   Left   │              Main Panel              │    Right      │
│  Panel   │                                      │    Panel      │
│  (nav)   │         Primary Content              │   (Copilot)   │
│          │                                      │               │
│  240px   │            Flexible                  │    360px      │
│          │                                      │               │
├──────────┴──────────────────────────────────────┴───────────────┤
│                    Copilot Input Bar (floating)                 │
└─────────────────────────────────────────────────────────────────┘
```

### Chat Panel Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Collapsed** | Default on small screens | Floating button, expands on click |
| **Docked** | Default on desktop | Fixed right panel, always visible |
| **Fullscreen** | `/chat` route | Dedicated chat page |
| **Embedded** | Dashboard-specific | Contextual chat in specific sections |

### Input Patterns

| Input Type | Example |
|------------|---------|
| **Question** | "What should I focus on this week?" |
| **Command** | "Add John Smith to my CRM" |
| **Request** | "Help me write an investor email" |
| **Context** | "Look at my pitch deck and suggest improvements" |
| **Follow-up** | "Tell me more about that investor" |

---

## 4. User Journeys

### Journey 1: First-Time User Onboarding

```
User signs up
    ↓
Copilot greets: "Welcome! I'm your AI co-founder. Let's set up your startup in 4 quick steps."
    ↓
User: "Okay, let's do it"
    ↓
Copilot guides through onboarding wizard
    ↓
User provides startup URL
    ↓
Copilot: "I found some info about your startup. Let me auto-fill the basics..."
    ↓
[AI enriches profile from URL]
    ↓
Copilot: "Great! Your FinTech startup is at Pre-Seed stage. Here's what founders in your position focus on..."
    ↓
User lands on dashboard with personalized recommendations
```

**Touchpoints:** Welcome message, guided wizard, URL enrichment, stage-specific advice

### Journey 2: Daily Check-In

```
User opens dashboard
    ↓
Copilot: "Good morning! Here's your startup status:
  • 3 tasks overdue
  • 2 investors responded
  • Pitch deck score: 72/100"
    ↓
User: "What should I work on today?"
    ↓
Copilot: "Based on your goals and stage, I recommend:
  1. Follow up with Sequoia (warm intro expires tomorrow)
  2. Update your financial projections (investors asking)
  3. Finalize problem slide (lowest score in deck)"
    ↓
User: "Help me with the investor follow-up"
    ↓
Copilot drafts personalized email
    ↓
User: "Send it"
    ↓
Copilot creates task + logs activity in CRM
```

**Touchpoints:** Morning briefing, prioritization, email drafting, task creation

### Journey 3: Pitch Deck Creation

```
User: "I need a pitch deck for investors"
    ↓
Copilot: "I'll create a 12-slide deck based on your lean canvas and startup data. Which stage are you raising for?"
    ↓
User: "Seed round"
    ↓
Copilot: "Perfect. Let me generate your Seed pitch deck..."
    ↓
[AI generates all slides with industry-specific content]
    ↓
Copilot: "Done! Your deck scores 76/100. Key improvements:
  • Problem slide needs more urgency
  • Add 2 more competitors to market slide
  • Traction section missing key metrics"
    ↓
User: "Improve the problem slide"
    ↓
Copilot rewrites problem slide with stronger narrative
    ↓
User: "Perfect, save it"
    ↓
Deck saved with version history
```

**Touchpoints:** Intent capture, stage selection, generation, scoring, iteration

### Journey 4: Investor Research

```
User: "Find me investors for my AI healthcare startup"
    ↓
Copilot: "I'll search for investors who:
  • Focus on healthcare + AI
  • Invest at Seed stage
  • Are active in your region (US West Coast)"
    ↓
[Research Agent queries investor database + web]
    ↓
Copilot: "Found 24 matches. Top 5:
  1. Andreessen Horowitz (Bio fund) — 92% match
  2. General Catalyst — 88% match
  3. Khosla Ventures — 85% match
  ..."
    ↓
User: "Tell me more about a]z Bio"
    ↓
Copilot: "a]z Bio invests $2-10M at Seed in AI healthcare. Recent investments: [list]. Partners: [names]. Best approach: warm intro via [mutual connection]"
    ↓
User: "Add them to my investor pipeline"
    ↓
Investor added to CRM with research notes
```

**Touchpoints:** Search request, filtering, detailed research, CRM integration

### Journey 5: "Do It For Me" — Dashboard Completion

```
User on Lean Canvas: "This is overwhelming. Can you just fill it out?"
    ↓
Copilot: "I'll draft your Lean Canvas based on what I know about your startup. Ready?"
    ↓
User: "Yes"
    ↓
[AI generates all 9 canvas sections]
    ↓
Copilot: "Done! Here's your draft:
  • Problem: [generated]
  • Solution: [generated]
  • UVP: [generated]
  ..."
    ↓
User: "The UVP isn't quite right. We focus more on speed than cost."
    ↓
Copilot rewrites UVP with speed emphasis
    ↓
User: "Save it"
    ↓
Canvas saved, dashboard shows completion progress
```

**Touchpoints:** Overwhelm detection, full generation, feedback loop, refinement

---

## 5. User Stories

### US-001: Context-Aware Assistance

**As a** founder
**I want** the AI to understand my current context (page, selected item, stage)
**So that** responses are immediately relevant without re-explaining everything

**Acceptance Criteria:**
- [ ] Copilot knows current route (`/pitch-deck`, `/crm`, etc.)
- [ ] Copilot knows selected item (specific deck, contact, deal)
- [ ] Copilot knows user's startup stage, industry, team size
- [ ] Context is included in every AI prompt
- [ ] User can see what context Copilot is using (debug mode)

**Example:**
- On Pitch Deck page with "Problem" slide selected
- User: "Make this stronger"
- Copilot: "I'll rewrite your Problem slide with more urgency. Here's the improved version..."
- (Not: "What would you like me to make stronger?")

---

### US-002: Multi-Turn Conversation

**As a** founder
**I want** to have natural back-and-forth conversations
**So that** I can refine requests without starting over

**Acceptance Criteria:**
- [ ] Conversation history maintained per session
- [ ] Follow-up questions work naturally
- [ ] User can reference previous messages ("that investor you mentioned")
- [ ] Copilot remembers decisions made earlier in conversation
- [ ] "Start new conversation" button available

**Example:**
- User: "Find me SaaS investors"
- Copilot: [lists 10 investors]
- User: "Which ones focus on B2B?"
- Copilot: [filters to B2B subset]
- User: "Tell me more about the first one"
- Copilot: [detailed info on first B2B investor]

---

### US-003: Action Execution

**As a** founder
**I want** the AI to complete tasks directly in the app
**So that** I don't have to manually navigate and fill forms

**Acceptance Criteria:**
- [ ] Copilot can create/update CRM contacts
- [ ] Copilot can create/update tasks
- [ ] Copilot can generate and save documents
- [ ] Copilot can update startup profile fields
- [ ] User confirms before destructive actions
- [ ] Actions logged in activity feed

**Example:**
- User: "Add Sarah Chen as a contact. She's a partner at Sequoia, met her at TechCrunch."
- Copilot: "I'll add Sarah Chen to your CRM:
  - Name: Sarah Chen
  - Company: Sequoia Capital
  - Role: Partner
  - Source: TechCrunch event
  Confirm?"
- User: "Yes"
- Copilot: "Done! Sarah Chen added to contacts. Want me to draft an intro email?"

---

### US-004: Streaming Responses

**As a** founder
**I want** to see AI responses appear in real-time
**So that** I don't wait for the full response before reading

**Acceptance Criteria:**
- [ ] Responses stream token-by-token
- [ ] Typing indicator shows while generating
- [ ] User can stop generation mid-stream
- [ ] Partial responses visible immediately
- [ ] Markdown renders as it streams

---

### US-005: Suggested Prompts

**As a** new user
**I want** to see example prompts I can ask
**So that** I understand the Copilot's capabilities

**Acceptance Criteria:**
- [ ] 4-6 suggested prompts shown for empty state
- [ ] Prompts are contextual (different on each dashboard)
- [ ] Clicking a prompt sends it
- [ ] Prompts refresh periodically
- [ ] Power users can hide suggestions

**Examples by Dashboard:**
| Dashboard | Suggested Prompts |
|-----------|-------------------|
| Home | "What should I focus on today?", "Summarize my week" |
| Pitch Deck | "Score my deck", "Improve the problem slide" |
| CRM | "Find warm leads", "Draft outreach to [name]" |
| Investors | "Find matching investors", "Prep me for my next call" |

---

### US-006: Stage-Specific Advice

**As a** founder at different stages
**I want** advice tailored to my current stage
**So that** I don't get irrelevant guidance

**Acceptance Criteria:**
- [ ] Pre-Seed: Focus on problem validation, MVP, first users
- [ ] Seed: Focus on traction, team, initial fundraising
- [ ] Series A: Focus on growth metrics, scaling, larger raise
- [ ] Advice references stage in responses
- [ ] Copilot explains why advice is stage-appropriate

---

### US-007: Document Generation

**As a** founder
**I want** to generate startup documents through chat
**So that** I can create content quickly without using separate tools

**Acceptance Criteria:**
- [ ] Generate pitch deck (all slides)
- [ ] Generate executive summary
- [ ] Generate one-pager
- [ ] Generate investor email
- [ ] Generate investor update
- [ ] Documents use startup context
- [ ] Documents follow best practices for stage/industry

---

### US-008: Research Capabilities

**As a** founder
**I want** the AI to research topics for me
**So that** I get relevant information without leaving the app

**Acceptance Criteria:**
- [ ] Research investors by criteria
- [ ] Research competitors by industry
- [ ] Research market size and trends
- [ ] Research events and conferences
- [ ] Results include sources
- [ ] Research can be saved to documents

---

### US-009: Error Handling

**As a** user
**I want** clear error messages when something fails
**So that** I know what happened and what to do

**Acceptance Criteria:**
- [ ] Rate limit errors show wait time
- [ ] Network errors suggest retry
- [ ] Context errors explain missing data
- [ ] Long operations show progress
- [ ] Fallback responses for AI failures

---

### US-010: Chat History Persistence

**As a** founder
**I want** my chat history saved across sessions
**So that** I can reference past conversations

**Acceptance Criteria:**
- [ ] Conversations persist to database
- [ ] History loads on page refresh
- [ ] Can start new conversation
- [ ] Can delete old conversations
- [ ] Search through past messages

---

### US-011: "Do It For Me" Mode

**As a** busy founder
**I want** the AI to complete entire dashboard sections
**So that** I can make progress even when overwhelmed

**Acceptance Criteria:**
- [ ] Works on: Lean Canvas, Pitch Deck, Startup Profile
- [ ] User reviews before saving
- [ ] Can accept, reject, or modify individual items
- [ ] Progress tracked in real-time
- [ ] Undo available after completion

---

### US-012: Industry Intelligence

**As a** founder in a specific industry
**I want** industry-specific insights
**So that** advice is relevant to my market

**Acceptance Criteria:**
- [ ] 13 industries supported (fintech, healthtech, etc.)
- [ ] Industry benchmarks in responses
- [ ] Industry-specific terminology
- [ ] Competitor landscape per industry
- [ ] Investor preferences per industry

---

### US-013: Proactive Insights

**As a** founder
**I want** the AI to proactively surface insights
**So that** I don't miss important opportunities or risks

**Acceptance Criteria:**
- [ ] Morning briefing notification
- [ ] Deadline reminders
- [ ] Investor response alerts
- [ ] Score drops highlighted
- [ ] Growth opportunities identified

---

### US-014: Multi-Modal Input

**As a** founder
**I want** to share files and images with the AI
**So that** it can analyze my existing materials

**Acceptance Criteria:**
- [ ] Upload pitch deck PDF for analysis
- [ ] Share screenshots for feedback
- [ ] Paste URLs for content extraction
- [ ] Drag-and-drop file support
- [ ] File content included in context

---

### US-015: Voice Input (Future)

**As a** mobile user
**I want** to speak to the AI
**So that** I can interact hands-free

**Acceptance Criteria:**
- [ ] Voice-to-text input
- [ ] Natural language processing
- [ ] Text-to-speech responses (optional)
- [ ] Works in mobile app

---

## 6. Features & Data

### Data Sources

The Copilot has access to all user data (respecting RLS):

| Data Source | Used For | Table |
|-------------|----------|-------|
| Startup Profile | Context for all responses | `startups` |
| Projects | Project-specific advice | `projects` |
| Tasks | Prioritization, status | `tasks` |
| CRM Contacts | Relationship context | `contacts` |
| CRM Deals | Pipeline status | `deals` |
| Pitch Decks | Content, scores | `pitch_decks`, `pitch_deck_slides` |
| Lean Canvas | Strategy context | `lean_canvases` |
| Documents | Reference materials | `documents` |
| Investors | Matching, tracking | `investors`, `investor_startups` |
| Events | Calendar, opportunities | `industry_events` |
| Chat History | Conversation continuity | `chat_sessions`, `chat_messages` |

### Context Aggregation

Before every AI call, aggregate user context:

```typescript
interface UserContext {
  // Identity
  user_id: string;
  profile: UserProfile;

  // Startup
  startup: {
    id: string;
    name: string;
    industry: string;
    stage: string;
    description: string;
    team_size: number;
    location: string;
  };

  // Current State
  current_route: string;
  selected_item?: {
    type: 'pitch_deck' | 'slide' | 'contact' | 'deal' | 'task' | 'document';
    id: string;
    data: Record<string, any>;
  };

  // Metrics
  metrics: {
    pitch_deck_score?: number;
    lean_canvas_completion?: number;
    tasks_overdue: number;
    deals_active: number;
    investors_contacted: number;
  };

  // History
  recent_activity: Activity[];
  conversation_summary?: string;
}
```

### Context Priority Levels (Token Budget)

**Critical:** Context must be prioritized to prevent prompt truncation and ensure accuracy.

| Priority | Data | Max Tokens | When Included |
|----------|------|------------|---------------|
| **P0** | Current route + selected item | 500 | Always |
| **P1** | Startup summary (name, stage, industry) | 300 | Always |
| **P2** | Relevant metrics (based on query) | 400 | If query relates to metrics |
| **P3** | History (summarized, last 5 turns) | 600 | If follow-up question |
| **P4** | Full entity data (deck, canvas, etc.) | 1000 | Only if explicitly referenced |

**Total Budget:** 4,000 tokens max for context (leaves room for response)

```typescript
interface ContextBudget {
  total_tokens: 4000;
  priorities: {
    P0_route_selection: { max: 500, required: true };
    P1_startup_summary: { max: 300, required: true };
    P2_metrics: { max: 400, required: false, condition: 'metrics_query' };
    P3_history: { max: 600, required: false, condition: 'follow_up' };
    P4_entity_data: { max: 1000, required: false, condition: 'explicit_reference' };
  };
}

function buildContext(query: string, fullContext: UserContext): PrioritizedContext {
  let budget = 4000;
  const result: PrioritizedContext = {};

  // P0: Always include (required)
  result.route = fullContext.current_route;
  result.selected_item = summarize(fullContext.selected_item, 500);
  budget -= tokenCount(result.route, result.selected_item);

  // P1: Always include (required)
  result.startup = {
    name: fullContext.startup.name,
    stage: fullContext.startup.stage,
    industry: fullContext.startup.industry,
  };
  budget -= tokenCount(result.startup);

  // P2: Only if query mentions metrics
  if (isMetricsQuery(query) && budget > 400) {
    result.metrics = fullContext.metrics;
    budget -= tokenCount(result.metrics);
  }

  // P3: Only if follow-up (has conversation history)
  if (fullContext.conversation_summary && budget > 600) {
    result.history = summarizeHistory(fullContext.conversation_summary, 600);
    budget -= tokenCount(result.history);
  }

  // P4: Only if explicitly referenced
  if (referencesEntity(query) && budget > 1000) {
    result.entity_data = getReferencedEntity(query, fullContext);
  }

  return result;
}
```

### Feature Matrix

| Feature | Free Tier | Pro Tier |
|---------|-----------|----------|
| Chat messages/day | 50 | Unlimited |
| Document generation | 3/month | Unlimited |
| Research queries | 10/month | Unlimited |
| "Do it for me" | Limited | Full |
| File uploads | 5MB | 50MB |
| Chat history | 7 days | Forever |

---

## 7. AI Agents

### Multi-Agent Architecture (Hardened)

**Critical Fix:** Split monolithic orchestrator into 3 specialized components to prevent single point of failure.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROL LAYER                                │
├───────────────────┬───────────────────┬─────────────────────────┤
│   Intent Router   │ Agent Orchestrator│   Action Executor       │
│   (Flash, <100ms) │ (Pro, reasoning)  │   (mutations only)      │
│   - Classify      │ - Select agent    │   - Validate params     │
│   - Route         │ - Coordinate      │   - Execute DB ops      │
│   - Fast reject   │ - Chain agents    │   - Log + undo token    │
└─────────┬─────────┴─────────┬─────────┴───────────┬─────────────┘
          │                   │                     │
          ▼                   ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SPECIALIST LAYER                             │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│  Strategist  │    Writer    │   Research   │    Fundraising     │
│  (Pro)       │    (Pro)     │   (Pro+Search)│    (Pro)          │
├──────────────┼──────────────┼──────────────┼────────────────────┤
│  Designer    │     Ops      │  Interviewer │                    │
│  (Flash)     │   (Flash)    │   (Flash)    │                    │
└──────────────┴──────────────┴──────────────┴────────────────────┘
          │                   │                     │
          ▼                   ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SAFETY LAYER                                 │
├─────────────────────────────┬───────────────────────────────────┤
│         QA Agent            │        Compliance Agent           │
│   (validates all outputs)   │   (filters PII, blocks unsafe)    │
└─────────────────────────────┴───────────────────────────────────┘
```

### Control Layer Components

| Component | Purpose | Model | Latency | Responsibilities |
|-----------|---------|-------|---------|------------------|
| **Intent Router** | Fast classification | Flash | <100ms | Classify intent, route to orchestrator or fast-reject |
| **Agent Orchestrator** | Reasoning coordination | Pro | 500ms-2s | Select specialist agent, chain multi-agent flows |
| **Action Executor** | Mutation safety | Flash | <200ms | Validate params, execute DB ops, generate undo tokens |

### Agent Ownership (Single Responsibility)

**Rule:** Each outcome has exactly ONE owning agent. No overlaps.

| Outcome | Owning Agent | NOT Handled By |
|---------|--------------|----------------|
| Business strategy advice | **Strategist** | ~~Fundraising~~ |
| Fundraising strategy | **Fundraising** | ~~Strategist~~ |
| Market/competitor research | **Research** | ~~Strategist~~ |
| Investor research/matching | **Fundraising** | ~~Research~~ |
| Content writing (text) | **Writer** | ~~Designer~~ |
| Visual feedback/layout | **Designer** | ~~Writer~~ |
| CRM/task mutations | **Ops** | ~~Writer~~ |
| Onboarding flows | **Interviewer** | ~~Ops~~ |

### Agent Descriptions

| Agent | Purpose | Model | Triggers |
|-------|---------|-------|----------|
| **Intent Router** | Fast classification, routing | Flash | Every request (first) |
| **Agent Orchestrator** | Coordinate specialist agents | Pro | After intent classification |
| **Action Executor** | Safe mutation execution | Flash | After action confirmation |
| **Strategist** | Business strategy, stage advice, prioritization | Pro | "What should I...", "How do I...", strategy questions |
| **Writer** | Content generation, pitch decks, emails | Pro | "Write...", "Generate...", "Draft..." |
| **Research** | Market research, competitor analysis (NOT investors) | Pro + Search | "Research market...", "Analyze competitors..." |
| **Fundraising** | Investor matching, pitch prep, investor research | Pro | "Find investors", "Prep for pitch", raise-related |
| **Designer** | Visual feedback only (no content writing) | Flash | "Design...", "Make it look...", visual requests |
| **Ops** | CRM updates, task management, scheduling | Flash | "Add contact", "Create task", "Schedule..." |
| **Interviewer** | Onboarding questions, information gathering | Flash | Onboarding, setup wizards |
| **QA** | Validate all outputs before delivery | Flash | Internal — validates other agents |
| **Compliance** | Filter PII, block unsafe outputs | Flash | Internal — runs on all outputs |

### QA Agent Specification (Expanded)

**Purpose:** Validate all agent outputs before delivery to user. Acts as quality gate.

**Validation Criteria:**

| Check | Description | Action on Fail |
|-------|-------------|----------------|
| **Missing Assumptions** | Output makes claims without supporting data | Add disclaimer: "Based on limited data..." |
| **Stage Mismatch** | Advice inappropriate for user's stage | Rewrite with stage-appropriate guidance |
| **Unsupported Claims** | Statistics or facts without source | Remove or add "unverified" tag |
| **Hallucinated Metrics** | Numbers that don't match user's actual data | Replace with actual data or remove |
| **Overpromise** | Claims like "guaranteed" or "will definitely" | Soften language to "likely" or "may" |
| **Action Without Confirmation** | Suggests mutation without confirmation step | Insert confirmation prompt |

**Rejection Rules:**
- If >2 validation failures → escalate to human review
- If hallucinated metric detected → hard reject, regenerate
- If stage mismatch on fundraising advice → hard reject

**Escalation Path:**
```
QA fails validation
    ↓
Attempt auto-fix (1 retry)
    ↓
If still fails → return "I need to verify some details before answering accurately. [specific issue]"
```

### Research Trust Framework

**Problem:** Mixed internal/external data creates misinformation risk.

**Source Classification:**

| Source Type | Label | Trust Level | Example |
|-------------|-------|-------------|---------|
| **Internal** | 🔵 Verified | High | User's CRM data, pitch deck scores |
| **Database** | 🟢 Reference | Medium | Investor database, industry benchmarks |
| **Web Search** | 🟡 External | Low | Google results, news articles |
| **AI Inference** | ⚪ Assumption | Lowest | AI-generated estimates, predictions |

**Required Output Format for Research:**

```markdown
## Investor Matches for AI Healthcare (Seed)

### 1. Andreessen Horowitz Bio Fund
- Match Score: 92% 🔵 (based on your profile)
- Check Size: $2-10M 🟢 (from database)
- Recent Activity: Led Series A for Nuro Health 🟡 (web, Jan 2026)
- Estimated Interest: High ⚪ (AI inference based on portfolio fit)

**Confidence: Medium** — 2 verified sources, 1 external, 1 inference
```

**Confidence Scoring:**

| Confidence | Criteria |
|------------|----------|
| **High** | 80%+ data from internal/database sources |
| **Medium** | 50-80% from verified sources |
| **Low** | <50% from verified sources |
| **Speculative** | Primarily AI inference |

### Agent Selection Logic

```typescript
function selectAgent(message: string, context: UserContext): Agent {
  const intent = classifyIntent(message);

  switch (intent) {
    case 'strategy':
    case 'advice':
    case 'prioritization':
      return 'strategist';

    case 'write':
    case 'generate':
    case 'draft':
      return 'writer';

    case 'research':
    case 'find':
    case 'search':
      return 'research';

    case 'investor':
    case 'fundraise':
    case 'pitch':
      return 'fundraising';

    case 'design':
    case 'visual':
      return 'designer';

    case 'crm':
    case 'task':
    case 'schedule':
      return 'ops';

    case 'onboarding':
    case 'setup':
      return 'interviewer';

    default:
      return 'strategist'; // Default to strategist
  }
}
```

---

## 8. Workflows

### Workflow 1: Answer Question

```
User asks question
    ↓
[Orchestrator] Classify intent
    ↓
[Orchestrator] Select agent
    ↓
[Selected Agent] Generate response with context
    ↓
[QA Agent] Validate response quality
    ↓
[Compliance Agent] Check for PII/safety
    ↓
Stream response to user
    ↓
Save to chat_messages
```

### Workflow 2: Execute Action

```
User requests action ("Add contact")
    ↓
[Orchestrator] Detect action intent
    ↓
[Ops Agent] Parse action parameters
    ↓
[Ops Agent] Generate confirmation
    ↓
User confirms
    ↓
[Ops Agent] Execute mutation (insert/update)
    ↓
[Ops Agent] Format success message
    ↓
Log to activity feed
```

### Workflow 3: Generate Document

```
User requests document ("Create pitch deck")
    ↓
[Orchestrator] Route to Writer Agent
    ↓
[Writer Agent] Gather all context
    ↓
[Writer Agent] Generate content (streaming)
    ↓
[Designer Agent] Apply visual formatting
    ↓
[QA Agent] Check quality/completeness
    ↓
[Writer Agent] Present for review
    ↓
User approves/requests changes
    ↓
Save to database
```

### Workflow 4: Research Query

```
User asks for research ("Find AI investors")
    ↓
[Orchestrator] Route to Research Agent
    ↓
[Research Agent] Parse criteria
    ↓
[Research Agent] Query database + web search
    ↓
[Research Agent] Rank and filter results
    ↓
[Research Agent] Format response
    ↓
Present results with sources
```

### Workflow 5: "Do It For Me"

```
User requests bulk action ("Fill out my lean canvas")
    ↓
[Orchestrator] Detect bulk intent
    ↓
[Writer Agent] Generate all sections
    ↓
[QA Agent] Validate each section
    ↓
Present all generated content
    ↓
User reviews section by section
    ↓
User accepts/modifies each
    ↓
Batch save all changes
```

### Workflow 6: Proactive Notification

```
[Scheduler] Trigger daily check (8am user timezone)
    ↓
[Strategist Agent] Analyze user data
    ↓
[Strategist Agent] Identify:
  - Overdue tasks
  - Pending investor responses
  - Score changes
  - Upcoming deadlines
    ↓
[Writer Agent] Format briefing
    ↓
Push notification + email (if enabled)
```

### Workflow 7: Follow-Up Conversation

```
User sends follow-up message
    ↓
Load conversation history (last 10 messages)
    ↓
[Orchestrator] Analyze with context
    ↓
[Same Agent] Continue conversation
    ↓
Maintain entity references ("that investor" → specific investor)
    ↓
Update conversation in database
```

### Workflow 8: Error Recovery

```
AI request fails
    ↓
Classify error type:
  - Rate limit → "I need a moment. Try again in {n} seconds."
  - Context too large → Summarize and retry
  - Network → "Connection issue. Retrying..."
  - Unknown → "Something went wrong. Here's what you can do..."
    ↓
Log error for debugging
    ↓
Offer fallback (cached response, simplified query, manual path)
```

---

## 9. Frontend Components

### Component List

| Component | Purpose | Location |
|-----------|---------|----------|
| `CopilotPanel` | Main chat panel (right side) | `src/components/copilot/CopilotPanel.tsx` |
| `CopilotInput` | Message input with send button | `src/components/copilot/CopilotInput.tsx` |
| `CopilotMessage` | Single message display | `src/components/copilot/CopilotMessage.tsx` |
| `CopilotSuggestions` | Suggested prompts | `src/components/copilot/CopilotSuggestions.tsx` |
| `CopilotTyping` | Typing indicator | `src/components/copilot/CopilotTyping.tsx` |
| `CopilotActions` | Action buttons (copy, retry, etc.) | `src/components/copilot/CopilotActions.tsx` |
| `CopilotConfirm` | Action confirmation dialog | `src/components/copilot/CopilotConfirm.tsx` |
| `CopilotHistory` | Past conversations list | `src/components/copilot/CopilotHistory.tsx` |
| `CopilotContext` | Context display (debug mode) | `src/components/copilot/CopilotContext.tsx` |
| `CopilotFileUpload` | File attachment handler | `src/components/copilot/CopilotFileUpload.tsx` |
| `CopilotFloating` | Floating chat button | `src/components/copilot/CopilotFloating.tsx` |
| `ChatPage` | Dedicated chat page | `src/pages/Chat.tsx` |

### Hooks

| Hook | Purpose |
|------|---------|
| `useCopilot` | Core chat logic, message handling |
| `useCopilotContext` | Context aggregation |
| `useCopilotHistory` | Chat history management |
| `useCopilotActions` | Action execution |
| `useCopilotStream` | Streaming response handling |

### CopilotPanel Component

```tsx
interface CopilotPanelProps {
  defaultOpen?: boolean;
  context?: ContextOverride;
  onAction?: (action: CopilotAction) => void;
}

function CopilotPanel({ defaultOpen = true, context, onAction }: CopilotPanelProps) {
  const { messages, sendMessage, isLoading, error } = useCopilot();
  const { history, loadHistory, clearHistory } = useCopilotHistory();
  const contextData = useCopilotContext(context);

  return (
    <aside className="w-[360px] border-l bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">StartupAI Copilot</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={clearHistory}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <History className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <CopilotSuggestions onSelect={sendMessage} context={contextData} />
        )}
        {messages.map((msg) => (
          <CopilotMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <CopilotTyping />}
        {error && <CopilotError error={error} />}
      </div>

      {/* Input */}
      <CopilotInput
        onSend={sendMessage}
        disabled={isLoading}
        placeholder="Ask anything about your startup..."
      />
    </aside>
  );
}
```

### useCopilot Hook

```typescript
interface UseCopilotReturn {
  messages: CopilotMessage[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  session: ChatSession | null;
  startNewSession: () => void;
  executeAction: (action: CopilotAction) => Promise<void>;
}

function useCopilot(): UseCopilotReturn {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const context = useCopilotContext();
  const { data: history } = useQuery(['chat-history'], fetchHistory);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMsg = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Stream response from edge function
      const response = await streamChat({
        message: content,
        context,
        session_id: session?.id,
      });

      // Handle streaming
      for await (const chunk of response) {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
          }
          return [...prev, { role: 'assistant', content: chunk, timestamp: new Date() }];
        });
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, error, session, startNewSession, executeAction };
}
```

---

## 10. Backend & Edge Functions

### Edge Function: ai-chat

**Location:** `supabase/functions/ai-chat/index.ts`

**Actions:**

| Action | Description | Input | Output |
|--------|-------------|-------|--------|
| `chat` | Send message, get response | `{ message, context, session_id }` | `{ response, session_id, tokens_used }` |
| `stream_chat` | Same as chat but streaming | Same | SSE stream |
| `get_history` | Retrieve chat history | `{ session_id?, limit }` | `{ sessions[], messages[] }` |
| `execute_action` | Perform CRM/task action | `{ action_type, params }` | `{ success, result }` |
| `generate_document` | Create document via chat | `{ doc_type, params }` | `{ document, preview }` |
| `get_suggestions` | Get contextual prompts | `{ route, context }` | `{ suggestions[] }` |

### Request/Response Schema

**Chat Request:**
```typescript
interface ChatRequest {
  action: 'chat' | 'stream_chat';
  message: string;
  session_id?: string;
  context: {
    route: string;
    selected_item?: { type: string; id: string };
    startup_id: string;
  };
}
```

**Chat Response:**
```typescript
interface ChatResponse {
  response: string;
  session_id: string;
  tokens_used: number;
  suggested_actions?: CopilotAction[];
  sources?: Source[];
}
```

**Action Request:**
```typescript
interface ActionRequest {
  action: 'execute_action';
  action_type: 'create_contact' | 'create_task' | 'update_startup' | 'save_document';
  params: Record<string, any>;
  confirmed: boolean;
}
```

### Streaming Implementation

```typescript
// In edge function
async function handleStreamChat(req: ChatRequest, context: UserContext) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const response = await gemini.generateContentStream({
        contents: buildPrompt(req.message, context),
      });

      for await (const chunk of response.stream) {
        const text = chunk.text();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Prompt Engineering

**System Prompt Template:**

```
You are StartupAI Copilot, an AI co-founder helping startup founders build successful companies.

## Your Capabilities
- Answer questions about startups, fundraising, product, growth
- Execute actions in the StartupAI platform (with user confirmation)
- Generate documents (pitch decks, emails, summaries)
- Research investors, competitors, markets
- Provide stage-specific advice

## User Context
- Startup: {startup.name} ({startup.industry})
- Stage: {startup.stage}
- Current Page: {context.route}
- Selected Item: {context.selected_item}

## Startup Data
{formatted_startup_data}

## Guidelines
1. Be concise but complete
2. Reference user's specific data
3. Suggest specific next actions
4. Ask clarifying questions when needed
5. Format responses with markdown
6. Include confidence level for advice
7. Cite sources for research

## Response Format
- Use bullet points for lists
- Bold key terms
- Include action buttons when relevant
- End with suggested next steps
```

---

## 11. Database Schema

### Tables

```sql
-- Chat sessions (conversations)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  title TEXT, -- Auto-generated from first message
  context JSONB DEFAULT '{}', -- Route, selected item at start
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Tokens, model, agent used
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Copilot actions log
CREATE TABLE copilot_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id),
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL, -- 'create_contact', 'create_task', etc.
  params JSONB NOT NULL,
  result JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'executed', 'cancelled', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  executed_at TIMESTAMPTZ
);

-- Suggested prompts (admin-managed)
CREATE TABLE copilot_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route TEXT NOT NULL, -- '/pitch-deck', '/crm', etc.
  industry TEXT, -- NULL = all industries
  stage TEXT, -- NULL = all stages
  prompt TEXT NOT NULL,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_startup ON chat_sessions(startup_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_copilot_actions_user ON copilot_actions(user_id);
CREATE INDEX idx_copilot_suggestions_route ON copilot_suggestions(route);

-- RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage messages in own sessions"
  ON chat_messages FOR ALL
  TO authenticated
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own actions"
  ON copilot_actions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can read active suggestions"
  ON copilot_suggestions FOR SELECT
  TO authenticated
  USING (is_active = true);
```

### Common Queries

**Load session with messages:**
```sql
SELECT
  s.*,
  json_agg(
    json_build_object(
      'id', m.id,
      'role', m.role,
      'content', m.content,
      'created_at', m.created_at
    ) ORDER BY m.created_at
  ) as messages
FROM chat_sessions s
LEFT JOIN chat_messages m ON m.session_id = s.id
WHERE s.user_id = auth.uid()
  AND s.id = $1
GROUP BY s.id;
```

**Get suggestions for route:**
```sql
SELECT prompt
FROM copilot_suggestions
WHERE is_active = true
  AND (route = $1 OR route = '*')
  AND (industry IS NULL OR industry = $2)
  AND (stage IS NULL OR stage = $3)
ORDER BY priority DESC, random()
LIMIT 6;
```

**Log action:**
```sql
INSERT INTO copilot_actions (session_id, user_id, action_type, params)
VALUES ($1, auth.uid(), $2, $3)
RETURNING id;
```

---

## 12. Dashboard Interaction

### Execution Safety System (Critical)

**Problem:** "Do It For Me" is powerful but dangerous without safeguards.

**3 Mandatory Execution Layers:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: DRY-RUN PREVIEW (Default)                              │
│ - Show exactly what will change                                 │
│ - No mutations until user approves                              │
│ - Visual diff of before/after                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: EXPLICIT SCOPE SUMMARY                                 │
│ - "I will update 9 Lean Canvas sections"                        │
│ - "I will create 1 contact, 0 updates, 0 deletes"               │
│ - Count of affected records                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: ATOMIC COMMIT + UNDO TOKEN                             │
│ - All changes in single transaction                             │
│ - Undo token valid for 24 hours                                 │
│ - One-click rollback                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Execution Safety Rules:**

| Rule | Requirement |
|------|-------------|
| **Preview Required** | All bulk actions show preview before execution |
| **Scope Summary** | Always show "X creates, Y updates, Z deletes" |
| **No Silent Overwrites** | Existing data changes highlighted in yellow |
| **Undo Token** | Every mutation returns undo token |
| **Undo Window** | 24 hours to undo any action |
| **Audit Log** | All actions logged to `copilot_actions` table |

**MVP Scope Limits (v1):**

| Operation | Allowed in v1 | Requires v2 |
|-----------|---------------|-------------|
| CREATE contact | ✅ Yes | - |
| UPDATE contact | ❌ No | v2 |
| DELETE contact | ❌ No | v2 |
| CREATE task | ✅ Yes | - |
| UPDATE task | ❌ No | v2 |
| DELETE task | ❌ No | v2 |
| GENERATE document | ✅ Yes (save only) | - |
| UPDATE document | ❌ No | v2 |
| GENERATE lean canvas | ✅ Yes (preview first) | - |
| OVERWRITE lean canvas | ❌ No | v2 |

**Undo Implementation:**

```typescript
interface UndoToken {
  id: string;
  action_id: string;
  user_id: string;
  created_at: Date;
  expires_at: Date; // +24 hours
  rollback_data: {
    table: string;
    operation: 'insert' | 'update' | 'delete';
    record_id: string;
    previous_state: Record<string, any> | null;
  }[];
}

async function executeWithUndo(action: CopilotAction): Promise<{ success: boolean; undo_token: string }> {
  const tx = await supabase.rpc('begin_transaction');

  try {
    // Capture previous state for rollback
    const previousState = await captureState(action.affected_records);

    // Execute the action
    const result = await executeAction(action);

    // Create undo token
    const undoToken = await createUndoToken({
      action_id: action.id,
      rollback_data: previousState,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await supabase.rpc('commit_transaction', { tx });

    return { success: true, undo_token: undoToken.id };
  } catch (error) {
    await supabase.rpc('rollback_transaction', { tx });
    throw error;
  }
}
```

---

### "Do It For Me" Capabilities

| Dashboard | Copilot Can Do (v1) | Trigger Phrases |
|-----------|---------------------|-----------------|
| **Onboarding** | Fill profile fields, enrich from URL | "Set up my startup", "Import from website" |
| **Lean Canvas** | Generate all 9 sections (preview first) | "Fill out my canvas", "Generate lean canvas" |
| **Pitch Deck** | Generate all slides (preview first) | "Create my pitch deck" |
| **CRM** | Add contacts only (no update/delete) | "Add contact" |
| **Tasks** | Create tasks only (no update/delete) | "Create task" |
| **Investors** | Research, add to pipeline, prep for calls | "Find investors", "Add to pipeline" |
| **Documents** | Generate any document type | "Create exec summary", "Write one-pager" |

### Dashboard-Specific Context

Each dashboard provides additional context to Copilot:

```typescript
// Pitch Deck context
const pitchDeckContext = {
  route: '/pitch-deck',
  deck_id: selectedDeck?.id,
  slide_id: selectedSlide?.id,
  slide_type: selectedSlide?.type,
  deck_score: selectedDeck?.signal_strength,
  slide_content: selectedSlide?.content,
};

// CRM context
const crmContext = {
  route: '/crm',
  view: 'contacts' | 'deals' | 'activity',
  selected_contact_id: selectedContact?.id,
  selected_deal_id: selectedDeal?.id,
  filter_applied: currentFilter,
};

// Lean Canvas context
const canvasContext = {
  route: '/lean-canvas',
  canvas_id: canvas?.id,
  selected_section: selectedSection,
  completion_percent: calculateCompletion(canvas),
};
```

### Action Execution Flow

```
User: "Add Sarah Chen to my contacts"
    ↓
Copilot parses: action=create_contact, params={name: "Sarah Chen"}
    ↓
Copilot: "I'll add Sarah Chen. Any details to include?"
    ↓
User: "She's a partner at Sequoia"
    ↓
Copilot: "Adding Sarah Chen:
  - Name: Sarah Chen
  - Company: Sequoia Capital
  - Role: Partner

  Confirm?"
    ↓
User: "Yes"
    ↓
[Execute: INSERT INTO contacts ...]
    ↓
Copilot: "Done! Sarah Chen added. Would you like to:
  - Draft an intro email
  - Add a follow-up task
  - View contact details"
```

---

## 13. Example Content

### Real-World Example: FinTech Startup

**Startup Context:**
- Name: PayFlow
- Industry: FinTech
- Stage: Seed
- Focus: B2B payments for SMBs

**Conversation:**

```
USER: What should I focus on this week?

COPILOT: Based on PayFlow's current state, here are your top 3 priorities this week:

1. **Follow up with Ribbit Capital** (High Priority)
   - They viewed your deck 3 days ago
   - Open rate: 100% (both partners)
   - Action: Send check-in email today

2. **Update your financial model** (Medium Priority)
   - Last updated 45 days ago
   - 3 investors have requested updated projections
   - Your burn rate assumptions may be outdated

3. **Improve your Competition slide** (Medium Priority)
   - Current score: 58/100
   - Missing: Stripe positioning, feature comparison matrix
   - Impact: This slide has highest investor attention

Would you like me to help with any of these?

---

USER: Help me with the investor follow-up

COPILOT: I'll draft a follow-up email to Ribbit Capital. Here's what I know:
- Contact: Micky Malka (Partner)
- Last interaction: Viewed deck Jan 25
- Your ask: $3M Seed

**Draft Email:**

Subject: Following up - PayFlow deck

Hi Micky,

Hope you had a chance to review PayFlow's deck. Since we spoke, we've hit two milestones I wanted to share:

• Added 12 new SMB customers (now at 47 total)
• MRR grew 23% to $28K

Would love to schedule 20 minutes to walk through our traction and answer questions. How does Thursday or Friday look?

Best,
[Your name]

---

Would you like me to:
- Send this email
- Make edits
- Add it as a task to follow up
```

### Real-World Example: eCommerce Startup

**Startup Context:**
- Name: GreenBox
- Industry: Consumer/eCommerce
- Stage: Pre-Seed
- Focus: Sustainable packaging subscription

**Conversation:**

```
USER: I'm stuck on my lean canvas. Can you help?

COPILOT: I'd be happy to help with GreenBox's Lean Canvas! I can see you've completed 3 of 9 sections. Let me suggest content for the remaining 6:

**Current Progress:**
✅ Problem (completed)
✅ Customer Segments (completed)
✅ Unique Value Proposition (completed)
⬜ Solution
⬜ Channels
⬜ Revenue Streams
⬜ Cost Structure
⬜ Key Metrics
⬜ Unfair Advantage

Want me to generate drafts for all 6 remaining sections?

---

USER: Yes, fill them all out

COPILOT: Generating your Lean Canvas sections...

**Solution:**
- Monthly subscription box of sustainable packaging
- AI-powered size recommendations based on shipping data
- Carbon offset tracking dashboard for brands
- Easy integration with Shopify/WooCommerce

**Channels:**
- Direct: Website, LinkedIn outreach to DTC brands
- Partners: Sustainability consultants, Shopify app store
- Content: "Sustainable eCommerce" blog, podcast appearances
- Events: ShopTalk, Sustainable Brands conference

**Revenue Streams:**
- Primary: Subscription ($99-$499/mo based on volume)
- Secondary: Custom packaging design ($500 one-time)
- Future: Carbon offset marketplace (% commission)

**Cost Structure:**
- Fixed: Packaging materials ($15K/mo), warehouse ($3K/mo)
- Variable: Shipping (25% of subscription), payment processing (2.9%)
- Team: 2 FTEs ($12K/mo)

**Key Metrics:**
- MRR (Monthly Recurring Revenue)
- Churn rate (target: <5%)
- CAC (Customer Acquisition Cost)
- Packaging waste reduced (lbs/customer)

**Unfair Advantage:**
- Proprietary packaging optimization algorithm
- Exclusive supplier relationships for recycled materials
- Team includes ex-Amazon packaging engineer

---

Review each section above. Want me to save them to your canvas?

---

USER: The revenue streams look off. We're not doing carbon offsets.

COPILOT: Got it! Let me update Revenue Streams:

**Revenue Streams (Updated):**
- Primary: Subscription ($99-$499/mo based on volume)
- Secondary: Custom packaging design ($500 one-time)
- Add-on: Premium eco-labels (+$49/mo)
- Future: Enterprise contracts (custom pricing)

Better? I'll save this version if you confirm.
```

---

## 14. Phased Implementation (Critical)

**Problem:** Original scope is 2-3 releases, not 1. Ship incrementally.

### Phase 1: Foundation (Week 1-2) — MVP v1

**Goal:** Chat + context awareness + read-only advice

| Feature | Included | Notes |
|---------|----------|-------|
| Chat panel UI | ✅ | Right panel, floating on mobile |
| Streaming responses | ✅ | SSE implementation |
| Context awareness | ✅ | Route + startup + selected item |
| Chat history | ✅ | Persist to database |
| Suggested prompts | ✅ | Per-dashboard |
| Document generation | ✅ | Save only (no overwrite) |
| CRM create | ✅ | Create contact only |
| Task create | ✅ | Create task only |
| Lean Canvas generate | ✅ | Preview first, save with confirm |
| Research (internal) | ✅ | Query own data only |

**NOT in Phase 1:**
- ❌ Web search research
- ❌ Update/delete operations
- ❌ Multi-agent coordination
- ❌ Proactive notifications
- ❌ File uploads

### Phase 2: Actions (Week 3-4) — MVP v2

**Goal:** Safe mutations with undo

| Feature | Included | Notes |
|---------|----------|-------|
| Update operations | ✅ | With preview + undo token |
| Delete operations | ✅ | Soft delete, 24hr recovery |
| Bulk "Do It For Me" | ✅ | With scope summary |
| Undo system | ✅ | 24hr rollback window |
| Action audit log | ✅ | Full action history |

### Phase 3: Intelligence (Week 5-6) — v1.1

**Goal:** Multi-agent + external research

| Feature | Included | Notes |
|---------|----------|-------|
| Multi-agent orchestration | ✅ | Intent Router → Orchestrator → Agent |
| Web search research | ✅ | With source labeling |
| Investor matching | ✅ | From database + web |
| QA validation | ✅ | All outputs validated |
| Confidence scoring | ✅ | On research results |

### Phase 4: Proactive (Week 7-8) — v1.2

**Goal:** Notifications + advanced features

| Feature | Included | Notes |
|---------|----------|-------|
| Morning briefings | ✅ | Daily email/push |
| Deadline alerts | ✅ | Task/investor follow-ups |
| Score change alerts | ✅ | Pitch deck score drops |
| File uploads | ✅ | PDF analysis, image feedback |

### Release Gates

| Phase | Gate Criteria |
|-------|---------------|
| Phase 1 → 2 | 100+ active users, <5% error rate, >3 messages/session |
| Phase 2 → 3 | 0 data loss incidents, undo used <2% of actions |
| Phase 3 → 4 | Research accuracy >80%, QA rejection rate <10% |

---

## 15. Success Criteria

### Launch Criteria (Phase 1 MVP)

- [ ] Chat panel renders on all dashboard pages
- [ ] Messages send and receive with streaming
- [ ] Context includes current route and startup data (P0-P1 only)
- [ ] Basic actions work (create contact, create task — no update/delete)
- [ ] Chat history persists across sessions
- [ ] Suggested prompts appear for empty state
- [ ] Error handling covers rate limits and failures
- [ ] Mobile responsive (collapsed → floating button)
- [ ] Preview shown before any mutation
- [ ] Scope summary displayed for bulk actions

### Quality Criteria

- [ ] Response time < 3 seconds for simple queries
- [ ] Streaming starts within 500ms
- [ ] Context is relevant (no generic advice)
- [ ] Actions execute correctly with undo token
- [ ] History loads quickly (< 1s for 100 messages)
- [ ] QA catches >90% of stage mismatches
- [ ] Research shows source labels on all insights

### Business Criteria

- [ ] Users send 5+ messages per session on average
- [ ] 60%+ of generated content is accepted
- [ ] "Do it for me" reduces task completion time by 50%
- [ ] NPS > 40 for Copilot feature
- [ ] 0 data loss incidents from Copilot actions

---

## 16. Files Reference

| File | Purpose |
|------|---------|
| `src/pages/Chat.tsx` | Dedicated chat page |
| `src/components/copilot/CopilotPanel.tsx` | Main panel component |
| `src/components/copilot/CopilotInput.tsx` | Message input |
| `src/components/copilot/CopilotMessage.tsx` | Message display |
| `src/components/copilot/CopilotSuggestions.tsx` | Prompt suggestions |
| `src/components/copilot/CopilotTyping.tsx` | Typing indicator |
| `src/components/copilot/CopilotActions.tsx` | Action buttons |
| `src/components/copilot/CopilotConfirm.tsx` | Confirmation dialog |
| `src/hooks/useCopilot.ts` | Core chat logic |
| `src/hooks/useCopilotContext.ts` | Context aggregation |
| `src/hooks/useCopilotHistory.ts` | History management |
| `src/hooks/useCopilotStream.ts` | Streaming handler |
| `supabase/functions/ai-chat/index.ts` | Edge function |
| `supabase/migrations/xxx_chat_tables.sql` | Database schema |

---

**Reference:** Related tasks: `023-ai-chat-assistant.md`, `003-ai-chat-assistant-with-context.md`
