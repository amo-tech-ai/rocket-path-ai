---
name: atlas-chat
description: Use this skill when building AI chat features - context-aware routing, multi-agent orchestration, startup advisor responses, and integrated chatbot UI. Triggers on "AI chat", "chatbot", "Atlas", "chat interface", "agent routing", "conversational AI".
---

# Atlas Chat

## Overview

Build and operate the AI-powered chat interface that serves as the founder's startup advisor. Atlas routes queries to specialized agents, maintains conversation context, and provides industry-aware, stage-specific guidance across all startup topics.

## When to Use

- Building chat UI components
- Implementing agent routing logic
- Creating context-aware responses
- Designing conversation memory
- Integrating chat with playbooks/packs

## Chat Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       ATLAS CHAT SYSTEM                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                               │
│  │    USER     │                                               │
│  │   MESSAGE   │                                               │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   CONTEXT   │───▶│   ROUTER    │───▶│   AGENT     │        │
│  │   BUILDER   │    │  Intent +   │    │  Selected   │        │
│  │             │    │  Domain     │    │             │        │
│  │ • Industry  │    │             │    │ • Industry  │        │
│  │ • Stage     │    │ • Validate  │    │ • Problem   │        │
│  │ • Profile   │    │ • Canvas    │    │ • Canvas    │        │
│  │ • Canvas    │    │ • Pitch     │    │ • Pitch     │        │
│  │ • History   │    │ • Metrics   │    │ • Metrics   │        │
│  └─────────────┘    │ • General   │    │ • Funding   │        │
│                     └─────────────┘    └──────┬──────┘        │
│                                                │                │
│                                         ┌──────▼──────┐        │
│                                         │   RESPONSE  │        │
│                                         │  Generation │        │
│                                         │             │        │
│                                         │ + Knowledge │        │
│                                         │ + Benchmarks│        │
│                                         │ + Actions   │        │
│                                         └─────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Context Building

```typescript
interface ChatContext {
  // Startup context
  startup: {
    id: string;
    name: string;
    industry: string;
    sub_category: string;
    stage: string;
    one_liner: string;
  };

  // Current state
  current_page: string;  // "dashboard", "canvas", "validator"
  canvas_data: LeanCanvas | null;
  validation_score: number | null;

  // Conversation history
  messages: Message[];

  // User preferences
  preferences: {
    verbosity: 'concise' | 'detailed';
    tone: 'casual' | 'professional';
  };
}

function buildContext(userId: string, startupId: string): ChatContext {
  return {
    startup: await getStartupProfile(startupId),
    current_page: getCurrentPage(),
    canvas_data: await getLatestCanvas(startupId),
    validation_score: await getValidationScore(startupId),
    messages: await getRecentMessages(userId, startupId, 10),
    preferences: await getUserPreferences(userId)
  };
}
```

## Agent Routing

```typescript
type Domain = 'validation' | 'canvas' | 'pitch' | 'metrics' | 'funding' | 'gtm' | 'general';

interface RoutingResult {
  domain: Domain;
  agent: string;
  confidence: number;
  prompt_pack: string | null;
  context_slice: string[];
}

const ROUTING_PATTERNS = {
  validation: [
    /validate|score|assess|evaluate|problem|solution|idea/i,
    /is this a good idea|should I pivot/i
  ],
  canvas: [
    /canvas|customer segment|value prop|uvp|channel|revenue|cost/i,
    /business model|problem block|solution block/i
  ],
  pitch: [
    /pitch|deck|slide|investor|presentation|one-liner/i,
    /how do I pitch|what should I say/i
  ],
  metrics: [
    /metric|mrr|arr|cac|ltv|churn|retention|growth|burn|runway/i,
    /how am I doing|what should I track/i
  ],
  funding: [
    /raise|fund|investor|term sheet|valuation|series|seed|pre-seed/i,
    /how much should I raise|when should I fundraise/i
  ],
  gtm: [
    /go to market|gtm|launch|channel|marketing|sales|customer acquisition/i,
    /how do I get customers|where should I sell/i
  ]
};

function routeQuery(query: string, context: ChatContext): RoutingResult {
  for (const [domain, patterns] of Object.entries(ROUTING_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(query)) {
        return {
          domain: domain as Domain,
          agent: getAgentForDomain(domain),
          confidence: 0.9,
          prompt_pack: getPackForDomain(domain),
          context_slice: getContextSlice(domain, context)
        };
      }
    }
  }

  return {
    domain: 'general',
    agent: 'general_advisor',
    confidence: 0.5,
    prompt_pack: null,
    context_slice: ['startup', 'canvas_data']
  };
}
```

## Agent Configuration

| Agent | Domain | Model | Tools |
|-------|--------|-------|-------|
| Validator Agent | validation | Gemini 3 Pro | search, structured_output |
| Canvas Builder | canvas | Gemini 3 Flash | structured_output |
| Pitch Writer | pitch | Claude Sonnet | none |
| Metrics Analyst | metrics | Gemini 3 Pro | analysis |
| Funding Advisor | funding | Claude Sonnet | search |
| GTM Strategist | gtm | Gemini 3 Pro | search |
| General Advisor | general | Claude Sonnet | all |

## Response Generation

```typescript
interface ChatResponse {
  message: string;
  actions: ChatAction[];
  suggestions: string[];
  sources: Source[];
}

interface ChatAction {
  type: 'navigate' | 'run_pack' | 'create_task' | 'update_profile';
  label: string;
  payload: any;
}

async function generateResponse(
  query: string,
  context: ChatContext,
  routing: RoutingResult
): Promise<ChatResponse> {
  // Get industry knowledge
  const knowledge = await getFilteredKnowledge(
    context.startup.industry,
    context.startup.stage,
    routing.domain
  );

  // Build prompt with context
  const prompt = buildPrompt(query, context, knowledge, routing);

  // Call appropriate model
  const response = await callModel(routing.agent, prompt);

  // Extract actions and suggestions
  const actions = extractActions(response, context);
  const suggestions = generateFollowUpQuestions(response, context);

  return {
    message: response.text,
    actions,
    suggestions,
    sources: response.sources || []
  };
}
```

## Quick Actions

```typescript
const QUICK_ACTIONS = {
  validation: [
    { label: "Run Quick Validate", action: "run_pack", pack: "idea-validation" },
    { label: "Schedule Interviews", action: "navigate", path: "/validation/interviews" }
  ],
  canvas: [
    { label: "Complete Canvas", action: "navigate", path: "/canvas" },
    { label: "Suggest UVP", action: "run_pack", pack: "uvp-generator" }
  ],
  pitch: [
    { label: "Generate Deck", action: "navigate", path: "/pitch-deck" },
    { label: "Review One-Liner", action: "run_pack", pack: "one-liner-generator" }
  ],
  metrics: [
    { label: "View Dashboard", action: "navigate", path: "/dashboard" },
    { label: "Calculate Unit Economics", action: "run_pack", pack: "unit-economics" }
  ],
  funding: [
    { label: "Check Readiness", action: "navigate", path: "/fundraising/readiness" },
    { label: "Find Investors", action: "navigate", path: "/fundraising/investors" }
  ]
};
```

## Conversation Memory

```typescript
interface ConversationMemory {
  short_term: Message[];      // Last 10 messages
  session_facts: Fact[];      // Facts extracted this session
  long_term: Summary[];       // Summarized past conversations
}

interface Fact {
  key: string;               // "target_raise_amount"
  value: string;             // "$2M"
  extracted_from: string;    // message_id
  confidence: number;
}

async function updateMemory(
  message: Message,
  response: ChatResponse,
  memory: ConversationMemory
): Promise<ConversationMemory> {
  // Add to short-term
  memory.short_term.push(message);
  if (memory.short_term.length > 10) {
    memory.short_term.shift();
  }

  // Extract facts
  const newFacts = await extractFacts(message, response);
  memory.session_facts = [...memory.session_facts, ...newFacts];

  // Summarize if needed (every 20 messages)
  if (shouldSummarize(memory)) {
    const summary = await summarizeConversation(memory.short_term);
    memory.long_term.push(summary);
  }

  return memory;
}
```

## Chat UI Components

```typescript
interface ChatUIComponents {
  // Message display
  MessageBubble: { variant: 'user' | 'assistant'; message: Message };

  // Quick actions
  ActionChip: { action: ChatAction; onClick: () => void };

  // Suggestions
  SuggestionList: { suggestions: string[]; onSelect: (s: string) => void };

  // Context indicator
  ContextBadge: { domain: Domain; agent: string };

  // Input
  ChatInput: { onSubmit: (query: string) => void; placeholder: string };
}
```

## Edge Function: `ai-chat`

```typescript
// Actions
- 'route': Determine intent and select agent
- 'respond': Generate response with context
- 'extract_facts': Pull facts from conversation
- 'summarize': Create conversation summary
- 'suggest_actions': Generate quick actions
```

## AI Model Selection

| Task | Model |
|------|-------|
| Routing/Intent | `gemini-3-flash-preview` |
| General responses | `claude-sonnet-4-5-20250929` |
| Fact extraction | `gemini-3-flash-preview` |
| Summarization | `gemini-3-flash-preview` |
| Deep analysis | `gemini-3-pro-preview` |

## References

- PRD Section 13: AI Chat System
- Strategy Section 10: Conversational AI
- Diagram D-09: AI Agent Router
- `/supabase/functions/ai-chat/index.ts`
