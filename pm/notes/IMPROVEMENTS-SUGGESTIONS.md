# Template Improvement Suggestions

**Date:** January 21, 2026  
**Templates Reviewed:** `01-prompt-template.md`, `100-task-template.md`

---

## 📋 01-prompt-template.md Improvements

### 1. **Add StartupAI Project Context**

**Current:** Generic Auto-Claude template  
**Improvement:** Add StartupAI-specific context and references

**Suggested Addition:**
```markdown
## 🎯 StartupAI Context

**Project:** StartupAI - AI-powered operating system for founders  
**Architecture:** 4 platform edge functions (ai-platform, crm-platform, content-platform, onboarding-wizard)  
**Agent Types:** 10 core types (Orchestrator, Planner, Analyst, Ops Automation, Content/Comms, Retriever/RAG, Extractor, Optimizer, Scorer, Controller)  
**Reference:** See `prd.md` for full architecture, `prompts/tasks-implement/00-tasks-index.md` for implementation prompts

**Key Patterns:**
- 3-panel layout (Left: Context, Main: Work, Right: Intelligence)
- AI proposes → Human approves → System executes
- Supabase backend with RLS policies
- React + TypeScript + Tailwind CSS frontend
```

### 2. **Clarify Interactive vs Non-Interactive**

**Current:** Brief mention in CRITICAL section  
**Improvement:** Add decision tree and examples

**Suggested Addition:**
```markdown
## INTERACTIVE vs NON-INTERACTIVE Decision

**Use NON-INTERACTIVE when:**
- Agent has all required inputs
- Task is deterministic (code analysis, file generation)
- Output structure is well-defined
- Example: Code analyzer, spec generator

**Use INTERACTIVE when:**
- Need user clarification (ambiguous requirements)
- User approval required before proceeding
- Multiple valid approaches exist
- Example: Feature design, architecture decisions

**Default:** NON-INTERACTIVE (most agents should be autonomous)
```

### 3. **Add Real StartupAI Command Examples**

**Current:** Generic bash examples  
**Improvement:** Use actual StartupAI project commands

**Suggested Addition:**
```markdown
## PHASE 0: LOAD CONTEXT (MANDATORY)

```bash
# 1. Read project structure
ls -la src/
ls -la supabase/functions/

# 2. Check existing implementations
grep -r "useEvents" src/hooks/
grep -r "event-wizard" supabase/functions/

# 3. Read relevant configs
cat prd.md | grep -A 10 "Events Management"
cat prompts/tasks-implement/00-tasks-index.md | grep -i "event"

# 4. Check Supabase schema
cat supabase/migrations/*.sql | grep -i "startup_events"

# 5. Read related components
cat src/pages/Events.tsx
cat src/components/events/EventCard.tsx
```
```

### 4. **Add Error Handling Patterns**

**Current:** No error handling guidance  
**Improvement:** Add common error scenarios and recovery

**Suggested Addition:**
```markdown
## ERROR HANDLING

**Common Scenarios:**

1. **File Not Found**
   ```bash
   if [ ! -f "input.json" ]; then
     echo "ERROR: input.json not found. Creating default..."
     echo '{"default": true}' > input.json
   fi
   ```

2. **Invalid JSON**
   ```bash
   # Validate JSON before processing
   if ! jq empty input.json 2>/dev/null; then
     echo "ERROR: Invalid JSON in input.json"
     exit 1
   fi
   ```

3. **Missing Required Fields**
   ```bash
   # Check required fields exist
   if ! jq -e '.required_field' input.json > /dev/null; then
     echo "ERROR: Missing required_field"
     exit 1
   fi
   ```

**Recovery Strategy:**
- Log errors to `output/errors.log`
- Create partial output if possible
- Exit with clear error message
```

### 5. **Add Agent Type Mapping**

**Current:** No reference to agent types  
**Improvement:** Map agent types to use cases

**Suggested Addition:**
```markdown
## AGENT TYPE SELECTION

**Match your agent to one of 10 core types:**

| Agent Type | Use Case | Example |
|------------|----------|---------|
| **Orchestrator** | Coordinates multiple agents | Multi-step workflow |
| **Planner** | Breaks goals into tasks | Project breakdown |
| **Analyst** | Finds patterns, risks | Risk assessment |
| **Extractor** | Pulls structured data | Contact enrichment |
| **Scorer** | Computes scores | Deal scoring |
| **Retriever (RAG)** | Searches knowledge base | Industry pack search |
| **Content/Comms** | Generates content | Email generation |
| **Optimizer** | Improves resources | Schedule optimization |
| **Ops Automation** | Watches triggers | Notification automation |
| **Controller** | Approval gates | Action validation |

**Reference:** See `prd.md` Section 16 for full agent architecture
```

---

## 📋 100-task-template.md Improvements

### 1. **Add Prompts Index Integration**

**Current:** No reference to prompts index system  
**Improvement:** Link to 76 prompts organized by phase

**Suggested Addition:**
```markdown
## 📚 Prompts Index Integration

**Before creating a new spec, check:**
1. Does a prompt already exist? → See `prompts/tasks-implement/00-tasks-index.md`
2. What phase is this? → Security (P0), MVP, Intermediate, Advanced, Production
3. What category? → Dashboard, CRM, AI, Events, Documents, etc.
4. Link to existing prompt: Add `linked_prompts` in metadata

**Example:**
```json
{
  "linked_prompts": ["prompts/tasks-implement/21-contact-enrichment.md"],
  "prompt_phase": "MVP - Phase 1",
  "prompt_category": "CRM",
  "prompt_subcategory": "Contacts, pipelines"
}
```

**Reference:** `prompts/tasks-implement/00-tasks-index.md` (76 prompts total)
```

### 2. **Add PRD Section Mapping**

**Current:** Generic sections  
**Improvement:** Map to PRD structure for consistency

**Suggested Addition:**
```markdown
## 📖 PRD Section Mapping

**Align your spec sections with PRD structure:**

| Spec Section | PRD Section | Purpose |
|--------------|-------------|---------|
| Context & Role | Section 1 (Executive Summary) | Project context |
| Description | Section 5 (Core Features) | Feature overview |
| Purpose | Section 2 (Problem Statement) | Why it exists |
| Screens | Section 12 (Screen Specifications) | UI layout |
| 3-Panel Layout | Section 11 (3-Panel Layout Logic) | Dashboard pattern |
| AI Agents | Section 16 (AI Architecture) | Agent mapping |
| Supabase | Section 15 (Data Model) | Database schema |
| Edge Functions | Section 25 (Edge Function Inventory) | Backend functions |
| User Journeys | Section 9 (User Journeys) | User flows |
| Workflows | Section 10 (Workflows) | System flows |

**Reference:** `prd.md` for complete PRD structure
```

### 3. **Add Edge Function Platform Reference**

**Current:** Generic edge function examples  
**Improvement:** Reference 4 platform functions

**Suggested Addition:**
```markdown
## 🗄️ Edge Function Platform Integration

**StartupAI uses 4 platform functions (not individual functions):**

| Platform Function | Actions | Use For |
|-------------------|----------|---------|
| `ai-platform` | 22 actions | Chatbot, industry awareness, service delivery |
| `crm-platform` | 27 actions | CRM AI agents, investor search/matching |
| `content-platform` | 32 actions | Pitch decks, documents, lean canvas |
| `onboarding-wizard` | 11 actions | Startup profile creation, enrichment |

**Pattern:** Add action to existing platform function, don't create new function

**Example:**
```typescript
// In crm-platform/index.ts
case 'enrich_contact':
  return handleEnrichContact(params);
case 'score_deal':
  return handleScoreDeal(params);
// Add your new action here
case 'your_new_action':
  return handleYourNewAction(params);
```

**Reference:** `prd.md` Section 25 for complete edge function inventory
```

### 4. **Enhance 3-Panel Layout Guidance**

**Current:** Basic panel description  
**Improvement:** Add detailed patterns and examples

**Suggested Addition:**
```markdown
## 8. 3-Panel Layout Logic (Enhanced)

**Standard Pattern:**

| Panel | Width | Content | Examples |
|-------|-------|---------|----------|
| **Left** | 240px fixed | Navigation, filters, progress, quick stats | Sidebar nav, filter dropdowns, progress bars |
| **Main** | flex (grows) | Primary content, forms, tables, editors | Data tables, forms, kanban boards, wizards |
| **Right** | 320px fixed | AI recommendations, insights, risks | AI Coach, suggestions, risk alerts, next steps |

**Flow:** AI proposes (right) → Human approves (main) → System executes

**Implementation Pattern:**
```tsx
<DashboardLayout aiPanel={<YourAIPanel />}>
  <YourMainContent />
</DashboardLayout>
```

**Examples from Codebase:**
- `src/pages/Events.tsx` - Events list with EventsAIPanel
- `src/pages/Dashboard.tsx` - Dashboard with AI insights
- `src/components/layout/DashboardLayout.tsx` - Layout component

**Reference:** `prd.md` Section 11 for complete 3-panel layout logic
```

### 5. **Add Phase-Based Section Guidance**

**Current:** "Include only what's needed" but no clear mapping  
**Improvement:** Map sections to implementation phases

**Suggested Addition:**
```markdown
## 📊 Phase-Based Section Selection

**Security (P0):**
- Required: Description, Purpose, Supabase Requirements (RLS), Acceptance Criteria
- Optional: Screens, Workflows, AI Agents

**MVP Phase 1:**
- Required: Description, Screens, 3-Panel Layout, Supabase, Acceptance Criteria
- Optional: AI Agents, Edge Functions, User Journeys

**Intermediate Phase 2:**
- Required: All MVP sections + AI Agents, Edge Functions, Workflows
- Optional: Claude SDK, Gemini Integration, Mermaid Diagrams

**Advanced Phase 3:**
- Required: All Intermediate sections + Claude SDK, Gemini Integration
- Optional: Real-World Examples, Rationale

**Production Phase 4:**
- Required: All sections + Best Practices, Real-World Examples, Rationale

**Code Quality / UI/UX:**
- Required: Description, Affected Files, Acceptance Criteria
- Optional: Screens (if UI change), Best Practices

**Reference:** `prompts/tasks-implement/00-tasks-index.md` for phase breakdown
```

### 6. **Add Supabase Best Practices**

**Current:** Basic SQL example  
**Improvement:** Add RLS patterns, migration structure, indexing

**Suggested Addition:**
```markdown
## 12. Supabase Requirements (Enhanced)

**Standard Patterns:**

1. **Table Creation:**
```sql
-- Always include these fields
create table your_table (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid references startups(id) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  -- Your fields here
  name text not null
);

-- Always enable RLS
alter table your_table enable row level security;

-- Standard RLS policies (SELECT, INSERT, UPDATE, DELETE)
create policy "Users see own startup records"
  on your_table for select
  using (startup_id = get_user_startup_id());

create policy "Users insert own startup records"
  on your_table for insert
  with check (startup_id = get_user_startup_id());

create policy "Users update own startup records"
  on your_table for update
  using (startup_id = get_user_startup_id());

create policy "Users delete own startup records"
  on your_table for delete
  using (startup_id = get_user_startup_id());
```

2. **Indexes:**
```sql
-- Index foreign keys
create index idx_your_table_startup_id on your_table(startup_id);

-- Index frequently queried fields
create index idx_your_table_name on your_table(name);
```

3. **Migration File:**
- Format: `YYYYMMDDHHmmss_description.sql`
- Location: `supabase/migrations/`
- Example: `20260121120000_add_your_table.sql`

**Reference:** `supabase/docs/` for database best practices
```

### 7. **Add Agent Type Selection Guide**

**Current:** Basic agent list  
**Improvement:** Map agents to use cases with examples

**Suggested Addition:**
```markdown
## 9. AI Agents Utilized (Enhanced)

**Select agent type based on task:**

| Task Type | Agent Type | Model | Example |
|-----------|-----------|-------|---------|
| Extract data from URL | Extractor | gemini-3-flash | Contact enrichment |
| Score/match items | Scorer | gemini-3-pro | Deal scoring, investor matching |
| Generate content | Content/Comms | gemini-3-pro | Email generation, pitch decks |
| Find patterns/risks | Analyst | gemini-3-pro | Risk analysis, insights |
| Break into tasks | Planner | gemini-3-pro | Task generation |
| Search knowledge | Retriever (RAG) | gemini-3-flash | Industry pack search |
| Coordinate workflows | Orchestrator | claude-sonnet-4-5 | Multi-step automation |
| Optimize resources | Optimizer | gemini-3-pro | Schedule optimization |
| Watch triggers | Ops Automation | claude-haiku-4-5 | Notifications |
| Validate actions | Controller | gemini-3-pro | Approval gates |

**Platform Function Mapping:**
- `ai-platform`: Orchestrator, Retriever, Content/Comms
- `crm-platform`: Extractor, Scorer, Analyst, Retriever
- `content-platform`: Content/Comms, Planner, Optimizer
- `onboarding-wizard`: Extractor, Scorer, Planner

**Reference:** `prd.md` Section 16 for complete agent architecture
```

### 8. **Add Real-World Examples Section**

**Current:** Generic examples  
**Improvement:** Use actual StartupAI features as examples

**Suggested Addition:**
```markdown
## 18. Real-World Examples (Enhanced)

**Reference Existing Features:**

**Example 1: Events Management** (`src/pages/Events.tsx`)
- 3-panel layout with EventsAIPanel
- Supabase tables: `startup_events`, `event_sponsors`, `event_venues`
- Edge functions: `event-wizard`, `sponsor-search`, `venue-search`
- AI agents: EventPlanner, SponsorScout, VenueFinder

**Example 2: Contact Enrichment** (`src/hooks/useCRM.ts`)
- Extractor agent (gemini-3-flash)
- Edge function: `crm-platform` action `enrich_contact`
- LinkedIn URL → structured contact data
- User approval before saving

**Example 3: Task Generation** (`src/hooks/useTasks.ts`)
- Planner agent (gemini-3-pro)
- Edge function: `onboarding-wizard` action `generate_tasks`
- Startup profile → actionable tasks
- Linked to projects and goals

**Pattern:** Study existing implementations before creating new specs
```

### 9. **Add Verification Checklist**

**Current:** Basic acceptance criteria  
**Improvement:** Add comprehensive verification steps

**Suggested Addition:**
```markdown
## 20. Acceptance Criteria (Enhanced)

**Standard Checklist:**

**Functionality:**
- [ ] Feature works end-to-end (create → read → update → delete)
- [ ] All user actions have loading states
- [ ] Error states display properly
- [ ] Success feedback (toast/notification)

**3-Panel Layout:**
- [ ] Left panel: Navigation/filters work
- [ ] Main panel: Primary content displays correctly
- [ ] Right panel: AI panel shows relevant insights
- [ ] Responsive: Mobile collapses panels appropriately

**Supabase:**
- [ ] RLS policies tested (cross-org access blocked)
- [ ] Migrations run successfully
- [ ] Indexes created for query optimization
- [ ] Foreign keys properly constrained

**AI Integration:**
- [ ] AI agent responds correctly
- [ ] AI suggestions show in right panel
- [ ] User approval gates work
- [ ] AI actions logged to `ai_runs` table

**Testing:**
- [ ] Manual testing passes
- [ ] No console errors
- [ ] Network requests succeed (check DevTools)
- [ ] Performance acceptable (<3s load time)

**Reference:** `prd.md` Section 22 for verification checklist patterns
```

### 10. **Add Metadata Enhancement**

**Current:** Basic metadata  
**Improvement:** Link to prompts index, PRD, and related specs

**Suggested Addition:**
```markdown
## Metadata (Enhanced)

```json
{
  "status": "backlog | pending | in_progress | completed",
  "priority": "must | should | could",
  "complexity": "trivial | low | medium | high",
  "impact": "low | medium | high",
  "category": "feature | security | performance | documentation | quality | ui_ux",
  "tags": ["#dashboard", "#crm", "#ai", "#events"],
  
  "prompt_phase": "Security (P0) | MVP - Phase 1 | Intermediate - Phase 2 | Advanced - Phase 3 | Production - Phase 4 | Code Quality | UI/UX | Documentation",
  "prompt_category": "Dashboard | CRM | AI | Events | Documents | Security | Performance | UI/UX | Settings",
  "prompt_subcategory": "Contacts, pipelines | agents | Stats, overview, home screen",
  
  "linked_roadmap_feature": "feature-N",
  "linked_prompts": ["prompts/tasks-implement/NN-feature.md"],
  "linked_prd_section": "Section 12 (Screen Specifications)",
  "related_specs": ["specs/001-related-feature/"],
  
  "edge_function": "ai-platform | crm-platform | content-platform | onboarding-wizard",
  "edge_action": "your_action_name",
  "agent_type": "Extractor | Scorer | Planner | Analyst | Orchestrator | Retriever | Content/Comms | Optimizer | Ops Automation | Controller",
  "ai_model": "gemini-3-flash | gemini-3-pro | claude-sonnet-4-5",
  
  "estimatedEffort": "trivial | small | medium | large",
  "affectedFiles": ["src/pages/Feature.tsx", "src/hooks/useFeature.ts", "supabase/migrations/YYYYMMDDHHmmss_feature.sql"]
}
```
```

---

## 🎯 Summary of Key Improvements

### 01-prompt-template.md:
1. ✅ Add StartupAI project context
2. ✅ Clarify interactive vs non-interactive decision
3. ✅ Add real StartupAI command examples
4. ✅ Add error handling patterns
5. ✅ Add agent type mapping

### 100-task-template.md:
1. ✅ Add prompts index integration (76 prompts)
2. ✅ Add PRD section mapping
3. ✅ Add edge function platform reference (4 platform functions)
4. ✅ Enhance 3-panel layout guidance
5. ✅ Add phase-based section selection
6. ✅ Add Supabase best practices
7. ✅ Add agent type selection guide
8. ✅ Add real-world examples from StartupAI
9. ✅ Add verification checklist
10. ✅ Add enhanced metadata with links

---

## 📝 Next Steps

1. **Review** these suggestions with the team
2. **Prioritize** which improvements to implement first
3. **Update** templates incrementally
4. **Test** updated templates on next feature spec
5. **Iterate** based on feedback

---

**Last Updated:** January 21, 2026  
**Status:** Suggestions ready for review
