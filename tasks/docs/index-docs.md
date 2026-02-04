# Docs Index

> **Total:** 220 docs | **Updated:** 2026-02-04
> **Purpose:** Quick reference to all planning docs

---

## Summary

| Folder | Docs | Purpose | Status |
|--------|------|---------|--------|
| **data/** | 2 | Database + Vector strategy | Review |
| **agents/** | 13 | Agent architecture | Revise |
| **chat/** | 20+ | Chat system plan | Review |
| **lean/** | 5 | Lean OS system | Improve |
| **validator/** | 2 | Validator plan | Revise |
| **playbooks/** | 21 | Industry playbooks | Ready |
| **prompt-library/** | 28+ | Prompts + industries | Migrate |
| **guides/** | 30+ | Startup guides | Reference |
| **tasks/** | 20+ | Old task definitions | Archive |
| **design/** | 10+ | UI designs | Reference |
| **research/** | 5+ | Research docs | Reference |

---

## Key Docs to Review

### 1. Data Strategy
| Doc | Description |
|-----|-------------|
| `data/supabase-summary.md` | 79 tables (58 existing + 21 proposed), JSONB strategy |
| `data/strategy-vector.md` | pgvector for RAG, industry expertise |

### 2. Agents
| Doc | Description |
|-----|-------------|
| `agents/00-agents-index.md` | 8 agent archetypes |
| `agents/01-orchestrator-agents.md` | Atlas routing |
| `agents/02-planner-agents.md` | Task/Sprint planning |
| `agents/03-analyst-agents.md` | Startup/PMF analysis |
| `agents/10-agent-workflows.md` | Multi-agent flows |

### 3. Chat System
| Doc | Description |
|-----|-------------|
| `chat/index-chat.md` | Chat system index |
| `chat/08-ai-chat-core.md` | Core chat architecture |
| `chat/11-agent-orchestration.md` | Agent routing in chat |
| `chat/chat-prd.md` | Chat PRD |

### 4. Lean System
| Doc | Description |
|-----|-------------|
| `lean/01-lean-system-plan.md` | Full Lean OS plan (10 frameworks) |
| `lean/51-lean-canvas-prompts.md` | Canvas AI prompts |
| `lean/52-lean-system-prompt.md` | System prompt |

### 5. Validator
| Doc | Description |
|-----|-------------|
| `validator/50-validator-plan.md` | 8 screens, 6 agents, 31 tables |

### 6. Playbooks (Ready)
| Industry | File |
|----------|------|
| AI SaaS | `playbooks/ai-saas.md` |
| Fintech | `playbooks/fintech.md` |
| Healthcare | `playbooks/healthcare.md` |
| E-commerce | `playbooks/ecommerce-pure.md` |
| + 17 more | See `playbooks/00-playbooks-index.md` |

### 7. Prompt Library
| Doc | Description |
|-----|-------------|
| `prompt-library/01-prompt-library-index.md` | Prompt index |
| `prompt-library/industries/` | Industry-specific prompts (NOT migrated) |
| `prompt-library/100-prompt-pack-strategy.md` | Pack strategy |

---

## Root Docs

| Doc | Description |
|-----|-------------|
| `01-ai-real-time.md` | AI real-time architecture |
| `01-i8n-plan.md` | Internationalization plan |
| `03-my-documents.md` | Documents feature |
| `07-startup-glossary.md` | Startup terms glossary |

---

## What to Consolidate → `/tasks/plan/`

| One-Page Doc | Consolidates |
|--------------|--------------|
| `coach.md` | agents + chat + lean system |
| `data.md` | supabase + vector strategy |
| `canvas.md` | lean canvas + validation |
| `playbooks.md` | playbook usage guide |

---

## Action Items

- [ ] Review `data/` - confirm table strategy
- [ ] Review `agents/` - simplify to coach role
- [ ] Review `chat/` - extract core for coach
- [ ] Review `lean/` - simplify for easy use
- [ ] Review `validator/` - merge with coach plan
- [ ] Migrate `prompt-library/industries/` - industry expertise
- [ ] Archive old `tasks/` - no longer needed
