# Agents

> Simplified from 8 archetypes → 3 core + 3 advanced

---

## Old Plan vs New Plan

| Old (Complex) | New (Simple) |
|---------------|--------------|
| 8 agent archetypes | 6 focused agents |
| 20+ individual agents | 3 core + 3 advanced |
| 13 documentation files | 1 page |
| Multi-agent orchestration | Coach handles most tasks |

---

## The Reality

**Most "agents" are just prompt templates.**

The Coach does 80% of the work. Other agents are specialists called when needed.

```
User → Coach → (calls specialist when needed) → Response
```

---

## Core Agents (MVP)

### 1. Coach Agent
**The main agent.** Handles all validation, guidance, and planning.

| Capability | How |
|------------|-----|
| Conversational guidance | Phase-aware prompts |
| Assessment scoring | 7-dimension evaluation |
| Sprint planning | PDCA methodology |
| Industry expertise | Playbook injection |

**Edge Function:** `ai-chat` (coach mode)

**Real World Example:**
```
User: "I'm building a fintech app for small businesses"
Coach: "Got it - fintech for SMBs. Let's start with the basics.
        What specific problem are you solving for them?"

[Coach continues through 6 questions, generates canvas + report]
```

---

### 2. Extractor Agent
**Pulls structured data from URLs and text.**

| Input | Output |
|-------|--------|
| Website URL | Company info, product description |
| LinkedIn URL | Founder profile, experience |
| Pitch deck PDF | Key slides, metrics |
| Interview transcript | Customer forces, insights |

**Edge Function:** `onboarding-agent` (extract action)

**Real World Example:**
```
User: [Pastes website URL]
Extractor: {
  company_name: "Acme Payments",
  description: "Payment processing for SMBs",
  industry: "fintech",
  stage: "seed"
}
→ Auto-fills onboarding fields
```

---

### 3. Generator Agent
**Creates documents from structured data.**

| Input | Output |
|-------|--------|
| 6 questions | Lean Canvas (9 boxes) |
| Canvas + context | Validation Report (7 scores) |
| Startup profile | Investor email draft |
| Sprint results | Progress summary |

**Edge Function:** `lean-canvas-agent` (generate action)

**Real World Example:**
```
Input: {
  problem: "SMBs waste 10hrs/week on invoicing",
  solution: "AI-powered invoicing automation",
  target_market: "Freelancers, small agencies",
  ...
}

Generator: {
  lean_canvas: { problem: "...", solution: "...", uvp: "..." },
  validation_report: { clarity: 8, desirability: 7, ... },
  top_concerns: ["No customer validation yet", ...],
  next_steps: ["Interview 10 target customers", ...]
}
```

---

## Advanced Agents (Phase 2)

### 4. Pitch Agent
**Creates investor materials.**

| Capability | Output |
|------------|--------|
| Deck generation | 12-slide pitch deck |
| Slide refinement | Individual slide edits |
| Story crafting | Narrative arc |

**Edge Function:** `pitch-deck-agent`

**Real World Example:**
```
User: "Create a pitch deck for my seed round"
Pitch Agent: Generates 12 slides with:
- Problem/Solution
- Market size (from canvas)
- Traction (from metrics)
- Team (from profiles)
- Ask (funding amount)
```

---

### 5. CRM Agent
**Manages investor relationships.**

| Capability | Output |
|------------|--------|
| Investor matching | Relevant investors for stage/industry |
| Email drafting | Personalized outreach |
| Follow-up tracking | Pipeline management |

**Edge Function:** `crm-agent`

**Real World Example:**
```
User: "Find seed investors for fintech in NYC"
CRM Agent: Returns 15 matches with:
- Fund name, partner
- Recent fintech investments
- Check size range
- Intro path (warm/cold)
```

---

### 6. Retriever Agent (RAG)
**Searches knowledge base for relevant context.**

| Source | Use Case |
|--------|----------|
| Industry playbooks | Inject benchmarks into coach |
| Pitch examples | Find similar decks |
| Startup patterns | "Companies like yours did X" |

**Edge Function:** `ai-chat` (with vector search)

**Real World Example:**
```
Coach needs: "What's good churn for B2B SaaS?"
Retriever: Searches playbooks →
  "B2B SaaS benchmark: <5% monthly churn, <10% annual"
Coach: Uses this in response to user
```

---

## Implementation Phases

### Phase 1: Core (MVP)

| Agent | Edge Function | Status |
|-------|---------------|--------|
| Coach | `ai-chat` | Task 102 |
| Extractor | `onboarding-agent` | Exists |
| Generator | `lean-canvas-agent` | Enhance |

**Timeline:** Tasks 100-104

### Phase 2: Advanced

| Agent | Edge Function | Status |
|-------|---------------|--------|
| Pitch | `pitch-deck-agent` | Exists |
| CRM | `crm-agent` | Exists |
| Retriever | `ai-chat` + vector | Future |

**Timeline:** After MVP validated

---

## Edge Function Mapping

| Function | Agent(s) | Actions |
|----------|----------|---------|
| `ai-chat` | Coach, Retriever | chat, coach_mode, search |
| `onboarding-agent` | Extractor | extract_url, extract_profile |
| `lean-canvas-agent` | Generator | generate_canvas, validate, score |
| `pitch-deck-agent` | Pitch | generate_deck, refine_slide |
| `crm-agent` | CRM | match_investors, draft_email |

---

## Model Assignment

| Agent | Model | Why |
|-------|-------|-----|
| Coach | `gemini-3-pro` | Deep reasoning, context |
| Extractor | `gemini-3-flash` | Fast parsing |
| Generator | `gemini-3-pro` | Quality output |
| Pitch | `claude-sonnet-4-5` | Writing quality |
| CRM | `gemini-3-flash` | Fast matching |
| Retriever | `gemini-3-flash` | Fast search |

---

## What We're NOT Building

| Old Plan | Why Skip |
|----------|----------|
| Orchestrator agent | Coach handles routing |
| Planner agents (3) | Coach does planning |
| Analyst agents (3) | Generator does analysis |
| Automation agents | Not needed for MVP |
| Controller agents | Overkill for validation |
| 8 separate archetypes | 6 focused agents is enough |

---

## Integration with Coach

The Coach is the **primary interface**. Other agents are called as tools:

```
User message
    ↓
Coach receives
    ↓
Coach decides: "I need to extract data"
    ↓
Coach calls: Extractor.extract(url)
    ↓
Extractor returns: {structured_data}
    ↓
Coach uses data in response
```

**The user only talks to Coach.** Other agents are invisible.

---

## Real World Flow

### New User Onboarding

```
1. User signs up
2. User pastes website URL
3. [Extractor] pulls company info
4. User answers 6 questions (wizard or chat)
5. [Generator] creates Canvas + Report
6. [Coach] presents results, identifies constraint
7. [Coach] designs 90-day campaign
8. User executes sprints with Coach guidance
```

### Preparing for Fundraising

```
1. User: "Help me prepare for seed round"
2. [Coach] reviews startup data
3. [Coach] suggests: "Let's create your pitch deck"
4. [Pitch Agent] generates 12 slides
5. User refines with Coach guidance
6. [CRM Agent] finds matching investors
7. [CRM Agent] drafts outreach emails
8. User sends, tracks in CRM
```

---

## Keep It Simple

- **1 main agent** (Coach) handles 80% of interactions
- **2 utility agents** (Extractor, Generator) for data processing
- **3 specialist agents** (Pitch, CRM, Retriever) for advanced features
- **User only talks to Coach** - other agents are tools
