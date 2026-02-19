# Skills Master Index

> **Updated:** 2026-02-08 | **Version:** 5.0
> **Installed Skills:** 30 in `.claude/` (incl. 2 aliases) + 5 in `.agents/skills/`
> **Custom Agents:** 10 in `.claude/agents/`
> **Community Skills:** 7 superpowers installed

---

## Installed Skills (35 Total)

### Core Development Skills (`.claude/`)

| # | Skill | Command | Status | Purpose |
|---|-------|---------|--------|---------|
| 1 | Feature Development | `/feature-dev` | Active | Multi-file features, architecture |
| 2 | Frontend Design | `/frontend-design` | Active | UI components, Tailwind, shadcn |
| 3 | Claude Chrome | `/claude-chrome` | Active | Browser automation, testing |
| 4 | Doc Co-Authoring | `/doc-coauthoring` | Active | PRDs, specs, RFCs |
| 5 | Events Management | `/events` | Active | Speaker events, calendars |
| ~~6~~ | ~~Gemini AI~~ | ~~`/gemini`~~ | **Moved** | **Migrated to `.agents/skills/gemini/`** — see External Skills below |
| 7 | Claude SDK Agent | `/sdk-agent` | Active | Claude Agent SDK apps |

### Startup Domain Skills (`.claude/`)

| # | Skill | Command | Status | Purpose |
|---|-------|---------|--------|---------|
| 8 | Startup Expertise | `/startup` | Active | Domain knowledge, lifecycle |
| 9 | Lean Canvas | `/lean-canvas` | Active | 9-block canvas, AI assist |
| 10 | MVP Builder | `/mvp-builder` | Active | MVP definition, RICE scoring |
| 11 | Lean Sprints | `/lean-sprints` | Active | 90-day campaigns, PDCA |
| 12 | Traction | `/traction` | Active | Metrics, PMF, growth |
| 13 | Startup Metrics | `/startup-metrics` | Active | Health scoring, analytics |
| 14 | Playbooks | `/playbooks` | Active | Industry playbooks |
| 15 | Prompt Packs | `/prompt-packs` | Active | Workflow prompts |
| 16 | Fundraising | `/fundraising` | Active | Investors, term sheets |
| 17 | Validation Lab | `/validation-lab` | Active | 3-mode validation |
| 18 | Pitch Deck | `/pitch-deck` | Active | 12-slide generation |
| 19 | Idea Validator | `/idea-validator` | Active | Problem scoring |
| 20 | Atlas Chat | `/atlas-chat` | Active | AI Coach chatbot |

### Infrastructure Skills (`.claude/`)

| # | Skill | Command | Status | Purpose |
|---|-------|---------|--------|---------|
| 21 | Edge Function Creator | `/edge-functions` | Active | API endpoints |
| 22 | Database Migration | `/database-migration` | Active | Schema changes, RLS |
| — | **Supabase** (alias) | `/supabase` | Active | Alias → database-migration |
| — | **Edge Functions** (alias) | `/edge-functions` | Active | Alias → edge-function-creator |
| 23 | API Wiring | `/api-wiring` | Active | Backend → Frontend |
| 24 | Security Hardening | `/security-hardening` | Active | RLS audit, auth |
| 25 | Supabase Realtime | `/supabase-realtime` | Active | Realtime features |
| 26 | Realtime Features | `/realtime-features` | Active | WebSocket, broadcasts |
| 27 | CI/CD Pipeline | `/cicd-pipeline` | Active | Deployment automation |
| 28 | Performance Optimization | `/performance-optimization` | Active | Bundle, queries |
| 29 | Accessibility | `/accessibility` | Active | WCAG 2.1, a11y |

### External Skills (`.agents/skills/`)

| # | Skill | Command | Status | Purpose |
|---|-------|---------|--------|---------|
| 30 | Supabase Postgres Best Practices | Auto | Active | Query optimization, RLS |
| 31 | Vercel React Native | Auto | Active | Mobile app patterns |
| 32 | Mermaid Diagrams | `/mermaid-diagrams` | Active | Flowcharts, Gantt, Kanban, sequence, class, ERD, C4, user journey (see `.agents/skills/mermaid-diagrams/references/`) |
| 33 | Frontend Design (external) | Auto | Active | UI patterns |
| 34 | Gemini AI | `/gemini` | Active | Gemini 3 integration, structured output, Google Search grounding, thinking, REST API patterns (see `.agents/skills/gemini/references/` — 13 reference files) |

### Installed Superpowers (Community)

| # | Skill | Trigger | Purpose |
|---|-------|---------|---------|
| 1 | `superpowers:brainstorming` | Before creative work | Explore intent, requirements |
| 2 | `superpowers:test-driven-development` | Before implementing | RED-GREEN-REFACTOR |
| 3 | `superpowers:systematic-debugging` | When encountering bugs | Deep error tracing |
| 4 | `superpowers:code-reviewer` | After completing steps | Review against plan |
| 5 | `superpowers:verification-before-completion` | Before claiming done | Run verification first |
| 6 | `superpowers:writing-plans` | When you have specs | Multi-step planning |
| 7 | `superpowers:using-git-worktrees` | Starting isolated work | Git worktrees |

---

## Custom Agents (10 Total)

Located in `.claude/agents/`:

| # | Agent | Model | Tools | Purpose |
|---|-------|-------|-------|---------|
| 1 | `code-reviewer` | Sonnet | Read, Grep, Glob, Bash | Code quality, security |
| 2 | `test-runner` | Sonnet | Bash, Read, Grep, Glob | Test execution |
| 3 | `supabase-expert` | Sonnet | Read, Edit, Write, Bash, Grep, Glob | Database, RLS |
| 4 | `startup-expert` | Sonnet | Read, Edit, Write, Grep, Glob | Domain expertise |
| 5 | `frontend-designer` | Sonnet | Read, Edit, Write, Grep, Glob | React, UI |
| 6 | `ai-agent-dev` | Sonnet | Read, Edit, Write, Bash, Grep, Glob | Gemini, Claude |
| 7 | `debugger` | Sonnet | Read, Edit, Bash, Grep, Glob | Bug fixing |
| 8 | `security-auditor` | Sonnet | Read, Grep, Glob, Bash | Vulnerability detection |
| 9 | `doc-writer` | Haiku | Read, Write, Grep, Glob | Documentation |
| 10 | `performance-optimizer` | Sonnet | Read, Edit, Bash, Grep, Glob | Performance tuning |

---

## Skill Activation Matrix

### By Task Type

| Task Type | Primary Skill | Secondary Skills |
|-----------|---------------|------------------|
| New Feature | `/feature-dev` | `/frontend-design`, `/supabase-realtime` |
| New Dashboard/Page | `/frontend-design` | `/feature-dev` |
| New API Endpoint | `/edge-functions` | `/database-migration` |
| Database Schema | `/database-migration` | `/supabase-realtime` |
| New AI Agent | `/sdk-agent` | `/gemini`, `/feature-dev` |
| AI Feature | `/gemini` or `/sdk-agent` | `/edge-functions` |
| Technical Spec/PRD | `/doc-coauthoring` | — |
| Browser Testing | `/claude-chrome` | — |
| Events Feature | `/events` | `/edge-functions` |
| Bug Fix | `superpowers:systematic-debugging` | — |
| UI Polish | `/frontend-design` | — |
| Lean Canvas | `/lean-canvas` | `/startup-expertise` |
| Validation | `/validation-lab` | `/idea-validator` |
| Pitch Deck | `/pitch-deck` | `/fundraising` |
| Traction/Metrics | `/traction` | `/startup-metrics` |
| Sprints/Campaigns | `/lean-sprints` | `/playbooks` |
| Coach/Chat | `/atlas-chat` | `/gemini`, `/sdk-agent` |
| System Diagrams | `/mermaid-diagrams` | — |
| Security Audit | `/security-hardening` | — |
| Performance | `/performance-optimization` | — |

### Automatic Triggers

| Pattern in Request | Required Skill |
|--------------------|----------------|
| "feature", "implement", "build" | `/feature-dev` |
| "dashboard", "UI", "component", "page" | `/frontend-design` |
| "migration", "RLS", "database", "table" | `/database-migration` |
| "edge function", "API endpoint" | `/edge-functions` |
| "Gemini", "URL context", "Google Search" | `/gemini` |
| "agent", "Claude SDK", "multi-agent" | `/sdk-agent` |
| "event", "speaker", "calendar" | `/events` |
| "browser", "test app", "screenshot" | `/claude-chrome` |
| "PRD", "spec", "proposal", "RFC" | `/doc-coauthoring` |
| "canvas", "9 blocks", "business model" | `/lean-canvas` |
| "validate", "validation", "score" | `/validation-lab` |
| "pitch", "deck", "slides" | `/pitch-deck` |
| "traction", "metrics", "PMF" | `/traction` |
| "sprint", "campaign", "90-day" | `/lean-sprints` |
| "coach", "atlas", "chat" | `/atlas-chat` |
| "diagram", "mermaid", "flowchart", "gantt", "kanban", "timeline", "sprint board" | `/mermaid-diagrams` |
| "security", "audit", "RLS" | `/security-hardening` |
| "performance", "optimize", "slow" | `/performance-optimization` |
| "bug", "error", "fix", "debug" | `superpowers:systematic-debugging` |
| "test", "verify" | `superpowers:test-driven-development` |
| "done", "complete", "finished" | `superpowers:verification-before-completion` |
| "plan", "design", "brainstorm" | `superpowers:brainstorming` |

---

## Directory Structure

```
.claude/
├── agents/                      # 10 custom agents
│   ├── code-reviewer.md
│   ├── test-runner.md
│   ├── supabase-expert.md
│   ├── startup-expert.md
│   ├── frontend-designer.md
│   ├── ai-agent-dev.md
│   ├── debugger.md
│   ├── security-auditor.md
│   ├── doc-writer.md
│   └── performance-optimizer.md
│
├── feature-dev/SKILL.md         # Development skills
├── frontend-design/SKILL.md
├── claude-chrome/SKILL.md
├── doc-coauthoring/SKILL.md
├── events-management/SKILL.md
├── gemini/                     # REMOVED — migrated to .agents/skills/gemini/
├── sdk-agent/SKILL.md
│
├── startup-expertise/SKILL.md   # Startup domain skills
├── lean-canvas/SKILL.md
├── mvp-builder/SKILL.md
├── lean-sprints/SKILL.md
├── traction/SKILL.md
├── startup-metrics/SKILL.md
├── playbooks/SKILL.md
├── prompt-packs/SKILL.md
├── fundraising/SKILL.md
├── validation-lab/SKILL.md
├── pitch-deck/SKILL.md
├── idea-validator/SKILL.md
├── atlas-chat/SKILL.md
│
├── edge-function-creator/SKILL.md  # Infrastructure skills
├── edge-functions/SKILL.md         # Alias → edge-function-creator
├── database-migration/SKILL.md
├── supabase/SKILL.md               # Alias → database-migration
├── api-wiring/SKILL.md
├── security-hardening/SKILL.md
├── supabase-realtime/SKILL.md
├── realtime-features/SKILL.md
├── cicd-pipeline/SKILL.md
├── performance-optimization/SKILL.md
└── accessibility/SKILL.md

.agents/skills/                   # External skills
├── supabase-postgres-best-practices/
├── vercel-react-native-skills/
├── mermaid-diagrams/
│   ├── SKILL.md
│   └── references/               # flowcharts, gantt, kanban, sequence, class, erd, user-journey, c4, architecture, advanced-features
├── gemini/
│   ├── SKILL.md                  # Critical Rules (G1-G6), REST API patterns, structured output, Google Search citations
│   └── references/               # 13 files: gemini-3, text-generation, structured-output, google-search, function-calling,
│                                  #   thinking, thought-signatures, url-context, image-generation, document-processing,
│                                  #   deep-search, troubleshooting, api-setup
└── frontend-design/
```

---

## Community Skills & Resources

### Skill Repositories

| Source | URL |
|--------|-----|
| Anthropic Official | [github.com/anthropics/skills](https://github.com/anthropics/skills) |
| Awesome Claude Skills | [github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) |
| Superpowers | [github.com/obra/superpowers](https://github.com/obra/superpowers) |
| Skills Marketplace | [skillsmp.com](https://skillsmp.com/) |

---

## Creating New Skills

1. Create folder: `.claude/[skill-name]/`
2. Create `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: When to use this skill and triggers
   ---
   [Workflow steps in markdown]
   ```
3. Add `references/` folder for detailed docs
4. Update this index
5. Add to CLAUDE.md activation table

---

## Task Prompt → Skill → Mermaid Mapping

> Each task prompt in `lean/prompts/` needs specific skills and has corresponding mermaid diagrams.

### P1 CORE

| Task Prompt | Skills | Mermaid Diagram | Real-World Example |
|-------------|--------|-----------------|-------------------|
| `001-profile` | /feature-dev, /frontend-design | D-06 User Journey | Airbnb: host profile auto-fill from listing URL |
| `002-plan` | /feature-dev, /edge-functions | D-10 Lean System | Asana: AI sprint generation from project goals |
| `003-validator-flow` | /feature-dev, /edge-functions, /gemini | D-03 Validator Pipeline | Y Combinator: batch application scoring pipeline |
| `004-vector-deploy` | /supabase | D-04 Data Model | Notion: vector search across 100M+ blocks |

### P2 MVP — Screens

| Task Prompt | Skills | Mermaid Diagram | Real-World Example |
|-------------|--------|-----------------|-------------------|
| `005-experiments` | /feature-dev, /edge-functions | D-10 Lean System | Superhuman: A/B test email subject lines with AI coaching |
| `006-research` | /feature-dev, /edge-functions | D-05 AI Agent Map | CB Insights: market sizing with credibility-scored sources |
| `007-opportunity` | /feature-dev, /edge-functions | D-06 User Journey | Strategyzer: 9-block canvas with auto-fill from validation |
| `008-readiness` | /feature-dev, /edge-functions, /supabase | D-10 Lean System | Stripe Atlas: 6-dimension startup readiness gauge |
| `009-outcomes` | /feature-dev, /edge-functions, /supabase | D-10 Lean System | Mixpanel: ROI dashboard with benchmark comparison |
| `010-share-links` | /feature-dev, /supabase | D-09 Security | Loom: shareable link with view tracking and expiry |
| `011-market-analysis` | /feature-dev, /edge-functions | D-05 AI Agent Map | Pitchbook: TAM/SAM/SOM funnel visualization |
| `012-competitor-intel` | /feature-dev, /edge-functions | D-05 AI Agent Map | Crayon: competitive intelligence with SWOT + positioning |

### P2 MVP — Vector RAG

| Task Prompt | Skills | Mermaid Diagram | Real-World Example |
|-------------|--------|-----------------|-------------------|
| `013-vector-schema` | /supabase | D-04 Data Model | Pinecone: content-hash deduplication on ingest |
| `014-vector-chunking` | /supabase | D-04 Data Model | LlamaIndex: table-first extraction preserves structured data |
| `015-vector-search` | /supabase, /frontend-design | D-05 AI Agent Map | Perplexity: hybrid search (keyword + semantic) with citations |

### P2 MVP — Validator v2

| Task Prompt | Skills | Mermaid Diagram | Real-World Example |
|-------------|--------|-----------------|-------------------|
| `016-validator-agent-runs` | /supabase | D-03 Validator Pipeline | Temporal: per-step execution tracking with retry |
| `017-validator-composer-split` | /edge-functions, /gemini | D-03 Validator Pipeline | AWS Step Functions: isolate long-running steps |
| `018-validator-parallel-agents` | /edge-functions, /gemini | D-03 Validator Pipeline | Airflow: DAG parallel task execution |
| `019-validator-orchestrator` | /edge-functions | D-03 Validator Pipeline | Prefect: orchestrator pattern with feature flags |
| `020-expert-knowledge-system` | /edge-functions, /supabase | D-05 AI Agent Map | McKinsey: industry playbook + RAG in advisor prompts |

### P3 ADVANCED

| Task Prompt | Skills | Mermaid Diagram | Real-World Example |
|-------------|--------|-----------------|-------------------|
| `021-ideawall` | /feature-dev | D-10 Lean System | Miro: idea clustering with AI theme detection |
| `022-storymap` | /feature-dev | D-06 User Journey | Jira: story map with MVP cutline and swim lanes |
| `023-knowledge` | /feature-dev | D-04 Data Model | Notion: confidence scoring with stale data warnings |
| `024-capability` | /feature-dev, /edge-functions | D-05 AI Agent Map | Jasper: AI cost optimization by switching models |
| `025-guardrails` | /feature-dev, /edge-functions | D-09 Security | GitHub Copilot: 3-tier decision system (auto/approve/block) |
| `026-vector-production` | /supabase | D-04 Data Model | Supabase: HNSW tuning at 50k+ vectors |
| `028-agentpoc` | /feature-dev, /sdk-agent | D-05 AI Agent Map | LangChain: agent canvas with autonomy scoring |

### Special (Not Lean Tasks)

| File | Type | Skills | Notes |
|------|------|--------|-------|
| `01-ai-real-time` | Strategy doc | /supabase-realtime | Move to `lean/strategy/` |
| `027-my-documents` | Task (30%) | /feature-dev | 25 document types, stage-based recommendations |
| `030-i8n-plan` | Implementation plan | /feature-dev | Move to `tasks/i18n/` |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-08 | v5.0 — Added Task Prompt → Skill → Mermaid Mapping (30 tasks, real-world examples, multi-skill tags). Deep forensic audit verified all associations. |
| 2026-02-05 | v4.3 — Gemini skill migrated from `.claude/gemini/` to `.agents/skills/gemini/` with 13 reference files, Critical Rules (G1-G6), REST API patterns |
| 2026-02-05 | v4.2 — Mermaid: expanded purpose (Gantt, Kanban, refs), added triggers (gantt, kanban, timeline, sprint board), directory note |
| 2026-02-04 | v4.1 — Added `/supabase` and `/edge-functions` alias SKILL.md files |
| 2026-02-04 | v4.0 — Full inventory of 29 `.claude/` skills + 4 `.agents/skills/` + 10 agents |
| 2026-01-27 | v3.0 — Previous inventory (outdated) |
