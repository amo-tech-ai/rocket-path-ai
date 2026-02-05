# MVP Phase Roadmap

> **Version:** 1.0 | **Updated:** 2026-02-02
> **Phase Question:** Does it solve the main problem?
> **Milestone:** Users can achieve the main goal reliably
> **Prerequisite:** CORE Phase complete

---

## Executive Summary

The MVP phase delivers the core value proposition of StartupAI: helping founders validate their ideas and build their business model with AI assistance. This phase introduces the Lean Canvas, Validation Lab, AI agents, prompt packs, and Atlas chat.

**Key Objectives:**
- Enable Lean Canvas completion with AI assistance
- Launch Validation Lab for experiment design
- Deploy AI agent orchestration system
- Implement guided prompt pack execution
- Introduce Atlas conversational assistant

---

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          MVP PHASE                               │
├─────────────────────────────────────────────────────────────────┤
│  Week 7-8          │  Week 9-10         │  Week 11-12           │
│  ─────────         │  ─────────         │  ─────────            │
│  D-06 Canvas       │  D-07 Validation   │  D-11 Chat            │
│  D-08 Agents       │  D-10 Prompts      │  MVP COMPLETE         │
├─────────────────────────────────────────────────────────────────┤
│  Deliverable:      │  Deliverable:      │  Deliverable:         │
│  Canvas + Agents   │  Validation works  │  Full AI assistance   │
│  functional        │  Prompts execute   │  available            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagrams in This Phase

| ID | Name | Type | Purpose | Skills |
|----|------|------|---------|--------|
| D-06 | Lean Canvas Flow | Flowchart | Canvas completion process | lean-canvas, gemini |
| D-07 | Validation Lab Flow | Flowchart | Experiment design & execution | validation-lab, idea-validator |
| D-08 | AI Agent Architecture | Class | Agent system design | sdk-agent, gemini |
| D-10 | Prompt Pack Flow | Sequence | Prompt pack execution | prompt-packs |
| D-11 | Atlas Chat Flow | Sequence | Chatbot interaction | atlas-chat, gemini |

---

## Behaviors to Implement

### B-06: Lean Canvas with AI
```
User can complete Lean Canvas with AI assistance
├── 9 blocks visible and editable
├── AI suggests content per block
├── User can accept/reject/edit suggestions
├── Progress saved automatically
└── Export to PDF/Markdown
```

**Acceptance Criteria:**
- [ ] All 9 Lean Canvas blocks displayed
- [ ] AI generates suggestions on demand
- [ ] Suggestions based on onboarding data
- [ ] User can edit all blocks manually
- [ ] Progress persists across sessions
- [ ] Export functionality works

### B-07: Validation Experiments
```
User can design and run validation experiments
├── Experiment template selection
├── Hypothesis definition
├── Success metrics defined
├── Results logging
└── Learn/pivot recommendations
```

**Acceptance Criteria:**
- [ ] 5+ experiment templates available
- [ ] User can create custom experiments
- [ ] Success/failure criteria defined upfront
- [ ] Results can be logged
- [ ] AI provides analysis of results

### B-08: AI Agent Orchestration
```
AI agents can be triggered and orchestrated
├── Agent router selects appropriate agent
├── Agent context loaded from startup data
├── Agent responses streamed
└── Agent actions logged
```

**Acceptance Criteria:**
- [ ] Router correctly identifies intent
- [ ] 4+ specialized agents available
- [ ] Context passed to agents
- [ ] Responses stream in real-time
- [ ] All agent actions logged

### B-09: Prompt Pack Execution
```
User can execute guided prompt packs
├── Pack selection by category
├── Step-by-step execution
├── Variables auto-filled from context
├── Results saved to startup
└── Pack progress tracked
```

**Acceptance Criteria:**
- [ ] 10+ prompt packs available
- [ ] Multi-step execution works
- [ ] Context variables populated
- [ ] Results stored in database
- [ ] Progress visible per pack

### B-10: Atlas Chat
```
User can chat with Atlas for advice
├── Natural language input
├── Context-aware responses
├── Agent routing when needed
├── Conversation history
└── Suggested actions
```

**Acceptance Criteria:**
- [ ] Chat interface functional
- [ ] Responses are context-aware
- [ ] Complex queries route to agents
- [ ] History persists per session
- [ ] Quick action buttons work

---

## Now-Next-Later Breakdown

### NOW (Weeks 7-8) — Canvas & Agents

| Initiative | Owner | Status | Target |
|------------|-------|--------|--------|
| D-06: Build Lean Canvas UI | Frontend | ⬜ | Week 7 |
| D-08: Design agent architecture | AI Team | ⬜ | Week 7 |
| Implement canvas block editor | Frontend | ⬜ | Week 7 |
| Build AI suggestion engine | AI Team | ⬜ | Week 8 |
| Create agent router | AI Team | ⬜ | Week 8 |
| Deploy first 4 agents | AI Team | ⬜ | Week 8 |

### NEXT (Weeks 9-10) — Validation & Prompts

| Initiative | Depends On | Est. Effort |
|------------|------------|-------------|
| D-07: Build Validation Lab | Canvas complete | 1.5 weeks |
| D-10: Implement prompt packs | Agents deployed | 1 week |
| Experiment templates | Validation Lab UI | 0.5 weeks |
| Prompt pack library (10) | Pack runner complete | 1 week |

### LATER (Weeks 11-12) — Chat & Integration

| Theme | Strategic Value | Open Questions |
|-------|-----------------|----------------|
| D-11: Atlas Chat | Primary interface | How to handle ambiguity? |
| Cross-feature integration | Unified experience | Data sharing patterns? |
| User testing & iteration | Product-market fit | Which features resonate? |

---

## Dependencies Map

```
[CORE Complete] ──blocks──> [D-06 Lean Canvas]
[D-06 Canvas] ──blocks──> [D-08 Agents]
[D-08 Agents] ──blocks──> [D-10 Prompt Packs]
[D-08 Agents] ──blocks──> [D-11 Atlas Chat]
[D-06 Canvas] ──blocks──> [D-07 Validation Lab]
[Gemini API] ──requires──> [External: Google AI Studio]
[Claude API] ──requires──> [External: Anthropic API Key]
```

---

## AI Model Configuration

| Feature | Model | Why |
|---------|-------|-----|
| Canvas suggestions | `gemini-3-flash-preview` | Fast, cost-effective generation |
| Experiment analysis | `gemini-3-pro-preview` | Deep analytical reasoning |
| Atlas chat | `gemini-3-flash-preview` | Conversational, low latency |
| Agent reasoning | `claude-sonnet-4-5-20250929` | Complex multi-step reasoning |
| Prompt pack execution | `gemini-3-flash-preview` | Speed + cost optimization |

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI response quality inconsistent | High | 40% | Prompt engineering, fallbacks |
| Agent routing errors | Medium | 30% | Clear intent classification |
| Gemini API rate limits | Medium | 25% | Queue system, caching |
| Canvas data loss | High | 10% | Auto-save every 30s |
| User overwhelm | Medium | 35% | Progressive disclosure, tutorials |

---

## Success Metrics

| Metric | Current | Target | Timeframe |
|--------|---------|--------|-----------|
| Canvas completion rate | 0% | 60% | Week 12 |
| Avg blocks completed | 0 | 7/9 | Week 12 |
| Experiments created | 0 | 3/user | Week 12 |
| Prompt packs executed | 0 | 5/user | Week 12 |
| Atlas queries/session | 0 | 8 | Week 12 |
| AI suggestion acceptance | 0% | 50% | Week 12 |

---

## Task Checklist

### Week 7: Canvas Foundation
- [ ] Create D-06 Lean Canvas flow diagram
- [ ] Build 9-block canvas UI component
- [ ] Implement block editing with autosave
- [ ] Create canvas_blocks database table
- [ ] Create D-08 agent architecture diagram
- [ ] Design agent interface contract

### Week 8: Agents & AI
- [ ] Build agent router service
- [ ] Implement Canvas Builder agent
- [ ] Implement Idea Validator agent
- [ ] Implement Stage Advisor agent
- [ ] Implement GTM Strategist agent
- [ ] Build AI suggestion edge function
- [ ] Test canvas AI integration

### Week 9: Validation Lab
- [ ] Create D-07 Validation Lab flow diagram
- [ ] Build experiment creation UI
- [ ] Create experiment templates (5)
- [ ] Implement hypothesis builder
- [ ] Build results logging
- [ ] Create experiments database table

### Week 10: Prompt Packs
- [ ] Create D-10 Prompt Pack flow diagram
- [ ] Build pack selection UI
- [ ] Implement multi-step pack runner
- [ ] Create variable injection system
- [ ] Build 10 prompt packs
- [ ] Create pack_executions database table

### Week 11: Atlas Chat
- [ ] Create D-11 Atlas Chat flow diagram
- [ ] Build chat interface component
- [ ] Implement conversation history
- [ ] Build intent classification
- [ ] Connect chat to agent router
- [ ] Add suggested actions

### Week 12: Integration & Polish
- [ ] Cross-feature data sharing
- [ ] Performance optimization
- [ ] Error handling polish
- [ ] User testing (10 users)
- [ ] Bug fixes and iteration
- [ ] MVP phase complete

---

## Validation Criteria

**MVP Phase is complete when:**
1. ✅ User completes at least 7/9 Lean Canvas blocks with AI assistance
2. ✅ User can create and log experiment results
3. ✅ AI agents respond appropriately to user queries
4. ✅ User can execute prompt packs end-to-end
5. ✅ Atlas chat provides contextual advice
6. ✅ Data flows between features correctly

---

## Feature Prioritization (RICE)

| Feature | Reach | Impact | Confidence | Effort | Score | Priority |
|---------|-------|--------|------------|--------|-------|----------|
| Lean Canvas AI | 100% | 3 | 80% | 4 | 60 | 1 |
| Atlas Chat | 100% | 2 | 70% | 3 | 47 | 2 |
| Prompt Packs | 80% | 2 | 80% | 2 | 64 | 3 |
| Validation Lab | 60% | 2 | 60% | 3 | 24 | 4 |
| Agent Routing | 100% | 1 | 90% | 2 | 45 | 5 |

---

## Skills Used

| Skill | Purpose in MVP |
|-------|----------------|
| `lean-canvas` | Canvas completion flow |
| `validation-lab` | Experiment design |
| `idea-validator` | Hypothesis scoring |
| `prompt-packs` | Pack execution |
| `atlas-chat` | Conversational AI |
| `gemini` | AI model integration |
| `sdk-agent` | Agent development |
| `frontend-design` | Feature UIs |

---

*Generated by Claude Code — 2026-02-02*
