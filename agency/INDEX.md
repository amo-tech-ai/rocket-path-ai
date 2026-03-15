# Agency Agents Integration — Index

> **Source:** https://github.com/amo-tech-ai/agency-agents (SunAI fork, pinned `sunai-v1`)
> **Upstream:** https://github.com/msitarzewski/agency-agents (MIT license)
> **Created:** 2026-03-12

## Overview

27 files integrated from the 132-agent agency-agents library into StartupAI across 4 layers:

| Layer | Count | Location | Purpose |
|-------|-------|----------|---------|
| **Dev Workflow Agents** | 10 | `.claude/agents/agency-*.md` | Claude Code subagents for development tasks |
| **Domain Skills** | 8 | `.agents/skills/*/SKILL.md` | Reusable knowledge for AI features |
| **EF Prompt Fragments** | 5 | `agency/prompts/*.md` | Inject into edge function system prompts |
| **Chat Mode Prompts** | 4 | `agency/chat-modes/*.md` | Specialized AI Chat personalities |

---

## Phase A: Dev Workflow Agents (10 files)

Claude Code agents in `.claude/agents/` — use as subagent types or direct agents.

| File | Source Agent | Purpose |
|------|-------------|---------|
| `agency-frontend-developer.md` | engineering/frontend-developer | React + Tailwind + shadcn/ui development |
| `agency-backend-architect.md` | engineering/backend-architect | Supabase Edge Functions + API design |
| `agency-database-optimizer.md` | engineering/database-optimizer | PostgreSQL + RLS + pgvector optimization |
| `agency-security-engineer.md` | engineering/security-engineer | Security audit, STRIDE, RLS review |
| `agency-software-architect.md` | engineering/software-architect | System design, ADRs, domain modeling |
| `agency-code-reviewer.md` | engineering/code-reviewer | Code review with StartupAI conventions |
| `agency-ai-engineer.md` | engineering/ai-engineer | Gemini 3 + Claude integration |
| `agency-api-tester.md` | testing/api-tester | Edge function + RLS testing |
| `agency-performance-benchmarker.md` | testing/performance-benchmarker | Build, EF, DB performance analysis |
| `agency-reality-checker.md` | testing/reality-checker | Production readiness verification |

---

## Phase B: Domain Skills (8 directories)

Skills in `.agents/skills/` — invoke via `/skill-name` or reference in prompts.

| Skill | Source Agent | Feeds Into |
|-------|-------------|------------|
| `growth-hacker/` | marketing/growth-hacker | Composer Group C, AI Chat growth mode |
| `deal-strategist/` | sales/deal-strategist | investor-agent, CRM deal scoring |
| `sprint-prioritizer/` | product/sprint-prioritizer | sprint-agent, Composer Group D |
| `outbound-strategist/` | sales/outbound-strategist | crm-agent outreach, investor outreach |
| `feedback-synthesizer/` | product/feedback-synthesizer | Scoring Agent, AI Chat feedback mode |
| `behavioral-nudge/` | product/behavioral-nudge-engine | Dashboard, onboarding, sprint UX |
| `sales-coach/` | sales/sales-coach | AI Chat practice-pitch mode |
| `proposal-strategist/` | sales/proposal-strategist | pitch-deck-agent, Composer exec summary |

---

## Phase C: Edge Function Prompt Fragments (5 files)

Markdown fragments in `agency/prompts/` — append to edge function system prompts.

| Fragment | Target Edge Functions | Key Frameworks |
|----------|----------------------|----------------|
| `validator-scoring-fragment.md` | validator-start (scoring) | Evidence tiers, RICE actions, bias detection |
| `validator-composer-fragment.md` | validator-start (composer) | Three-act narrative, win themes, ICE channels |
| `crm-investor-fragment.md` | investor-agent, crm-agent | MEDDPICC for investors, signal-based timing, email template |
| `sprint-agent-fragment.md` | sprint-agent | RICE scoring, Kano classification, momentum sequencing |
| `pitch-deck-fragment.md` | pitch-deck-agent | Win themes, Challenger narrative, persuasion architecture |

### Usage in Edge Functions

```typescript
import { loadFragment } from '../../agency/lib/agent-loader.ts'

const fragment = await loadFragment('validator-scoring-fragment')
const systemPrompt = `${basePrompt}\n\n## Enhanced Scoring Rules\n${fragment}`
```

---

## Phase D: AI Chat Mode Prompts (4 files)

System prompts in `agency/chat-modes/` — activate when user selects a chat mode.

| Mode | Source Agents | User Scenario |
|------|-------------|---------------|
| `practice-pitch.md` | sales-coach + deal-strategist | Founder practices investor pitch with AI investor |
| `growth-strategy.md` | growth-hacker | Founder plans growth experiments with AI growth strategist |
| `deal-review.md` | deal-strategist + pipeline-analyst | Founder reviews investor pipeline with AI deal strategist |
| `canvas-coach.md` | feedback-synthesizer + behavioral-nudge | Founder improves lean canvas with AI coach |

### Usage in AI Chat

```typescript
import { loadChatMode } from '../../agency/lib/agent-loader.ts'

const modePrompt = await loadChatMode('practice-pitch')
const systemPrompt = `${baseContext}\n\n${modePrompt}`
```

---

## Wiring Map: Agency Knowledge → StartupAI Screens

```
agency-agents repo
    │
    ├─ Engineering Agents ──→ .claude/agents/ (dev workflow)
    │
    ├─ Sales Agents ────────→ .agents/skills/ (deal-strategist, outbound, sales-coach, proposal)
    │                       → agency/prompts/ (crm-investor, pitch-deck)
    │                       → agency/chat-modes/ (practice-pitch, deal-review)
    │
    ├─ Marketing Agents ───→ .agents/skills/ (growth-hacker)
    │                       → agency/prompts/ (validator-composer growth channels)
    │                       → agency/chat-modes/ (growth-strategy)
    │
    ├─ Product Agents ─────→ .agents/skills/ (sprint-prioritizer, feedback-synthesizer, behavioral-nudge)
    │                       → agency/prompts/ (validator-scoring, sprint-agent)
    │                       → agency/chat-modes/ (canvas-coach)
    │
    └─ Testing Agents ─────→ .claude/agents/ (api-tester, performance, reality-checker)
```

---

## File Tree

```
.claude/agents/
├── agency-frontend-developer.md
├── agency-backend-architect.md
├── agency-database-optimizer.md
├── agency-security-engineer.md
├── agency-software-architect.md
├── agency-code-reviewer.md
├── agency-ai-engineer.md
├── agency-api-tester.md
├── agency-performance-benchmarker.md
└── agency-reality-checker.md

.agents/skills/
├── growth-hacker/SKILL.md
├── deal-strategist/SKILL.md
├── sprint-prioritizer/SKILL.md
├── outbound-strategist/SKILL.md
├── feedback-synthesizer/SKILL.md
├── behavioral-nudge/SKILL.md
├── sales-coach/SKILL.md
└── proposal-strategist/SKILL.md

agency/
├── 00-PLAN.md              (master integration plan)
├── INDEX.md                (this file)
├── lib/
│   └── agent-loader.ts     (runtime loader for EF/chat prompts)
├── prompts/
│   ├── validator-scoring-fragment.md
│   ├── validator-composer-fragment.md
│   ├── crm-investor-fragment.md
│   ├── sprint-agent-fragment.md
│   └── pitch-deck-fragment.md
└── chat-modes/
    ├── practice-pitch.md
    ├── growth-strategy.md
    ├── deal-review.md
    └── canvas-coach.md
```

---

## Next Steps (Wiring)

These files are created but not yet wired into live edge functions. To activate:

1. **Scoring Agent** — Import `validator-scoring-fragment.md` into `validator-start/agents/scoring.ts` system prompt
2. **Composer Agent** — Import `validator-composer-fragment.md` into `validator-start/agents/composer.ts` system prompt
3. **Sprint Agent** — Import `sprint-agent-fragment.md` into `sprint-agent/index.ts` system prompt
4. **Investor Agent** — Import `crm-investor-fragment.md` into `investor-agent/index.ts` system prompt
5. **Pitch Deck Agent** — Import `pitch-deck-fragment.md` into `pitch-deck-agent/index.ts` system prompt
6. **AI Chat** — Add mode selector UI + import chat-mode prompts into `ai-chat/index.ts`

Each wiring task is independent and can be done incrementally.
