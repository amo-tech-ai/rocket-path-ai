# StartupAI Core Prompts — Verification Status

> **Cross-referenced with:** [progress-tracker.md](../progress-tracker.md)  
> **Last Verified:** 2026-01-16  
> **Total Prompts:** 19 (Core + Advanced)

---

## Prompt Index & Implementation Status

### Core Prompts (01-10)

| # | Prompt | Status | Progress | Key Gaps |
|---|--------|--------|----------|----------|
| 00 | [Prompts Index](./00-prompts-index.md) | 📋 Reference | — | Master index of all 42 prompts |
| 02 | [Three-Panel Layout](./02-three-panel-layout-architecture.md) | 🟢 Implemented | 95% | Mobile slide-over for AI panel not yet done |
| 03 | [Dashboard Screen](./03-dashboard-screen-design.md) | 🟢 Implemented | 90% | AI Coach not connected to real AI |
| 04 | [Wizard Screen](./04-wizard-screen-design.md) | 🔴 Not Started | 0% | No wizard UI, no ProfileExtractor agent |
| 05 | [AI Agents & Workflows](./05-ai-agents-modules-workflows.md) | 🔴 Not Started | 0% | No edge functions, no AI gateway enabled |
| 06 | [Frontend-Backend Wiring](./06-frontend-backend-wiring.md) | 🟡 Partial | 60% | Supabase connected, edge functions missing |
| 07 | [User Journey Workflows](./07-user-journey-workflows.md) | 🟡 Partial | 40% | Auth flow works, wizard & AI flows missing |
| 08 | [System Architecture](./08-system-architecture-best-practices.md) | 🟢 Implemented | 85% | Missing error boundaries, rate limiting |
| 09 | [Login/Signup Screen](./09-login-signup-screen-design.md) | 🟢 Implemented | 90% | Google OAuth works, password auth works |
| 10 | [Tasks Screen](./10-tasks-screen-design.md) | 🟢 Implemented | 95% | Kanban, filters, CRUD all work |

### Screen Design Prompts (11.x)

| # | Prompt | Status | Progress | Key Gaps |
|---|--------|--------|----------|----------|
| 11 | [Projects Screen](./11-projects-screen-design.md) | 🟡 Partial | 40% | Basic cards exist, missing full CRUD |
| 11.1 | [Documents Screen](./11.1-documents-screen-design.md) | 🔴 Not Started | 0% | Placeholder page only |
| 11.2 | [Lean Canvas Screen](./11.2-lean-canvas-screen-design.md) | 🔴 Not Started | 0% | No page exists |
| 11.3 | [GTM Strategy Screen](./11.3-gtm-strategy-screen-design.md) | 🔴 Not Started | 0% | No page exists |
| 11.4 | [Discovery Screen](./11.4-discovery-screen-design.md) | 🔴 Not Started | 0% | No page exists |
| 11.5 | [Strategy Screen](./11.5-strategy-screen-design.md) | 🔴 Not Started | 0% | No page exists |

### AI Integration Prompts (16-23)

| # | Prompt | Status | Progress | Key Gaps |
|---|--------|--------|----------|----------|
| 16 | [Wizard AI Integration](./16-wizard-ai-integration.md) | 🔴 Not Started | 0% | No wizard, no ProfileExtractor |
| 18 | [Task Generation Workflow](./18-task-generation-workflow.md) | 🔴 Not Started | 0% | No TaskGenerator agent |
| 23 | [Task Prioritization](./23-task-prioritization.md) | 🔴 Not Started | 0% | No TaskPrioritizer agent |

---

## Detailed Verification

### 02 — Three-Panel Layout Architecture

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Left Panel 240px fixed | ✅ Done | `DashboardLayout.tsx` sidebar |
| Main Panel flexible | ✅ Done | Flex-grow in main content area |
| Right Panel 320px fixed | ✅ Done | AIPanel component |
| Collapsible on mobile | ⚠️ Partial | Sidebar collapses, AI panel needs work |
| Panel responsibilities correct | ✅ Done | Navigation left, content center, AI right |

### 03 — Dashboard Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| KPI Bar with 4 metrics | ✅ Done | MetricCard components |
| Next Best Action card | ⚠️ UI Only | No AI-generated action yet |
| Today's Priorities list | ✅ Done | TaskList component |
| Active Projects grid | ✅ Done | ProjectList component |
| AI Coach section | ⚠️ UI Only | AIPanel exists, no real AI |
| Risk Radar | ⚠️ UI Only | Static content only |
| Fundraising banner | ✅ Done | Shows when is_raising=true |

### 04 — Wizard Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Step 1: Profile & Business | ❌ Missing | No wizard page exists |
| Step 2: Traction & Funding | ❌ Missing | — |
| Step 3: Review & Generate | ❌ Missing | — |
| ProfileExtractor integration | ❌ Missing | No edge function |
| Progress indicator | ❌ Missing | — |
| AI suggestions panel | ❌ Missing | — |

### 05 — AI Agents, Modules, Workflows

| Requirement | Status | Evidence |
|-------------|--------|----------|
| ProfileExtractor agent | ❌ Missing | No edge function |
| RiskAnalyzer agent | ❌ Missing | — |
| TaskGenerator agent | ❌ Missing | — |
| ai-helper edge function | ❌ Missing | supabase/functions/ empty |
| AI runs tracking | ❌ Missing | Table exists, no data flow |
| Proposed actions system | ❌ Missing | Table exists, no UI |

### 06 — Frontend-Backend Wiring

| Requirement | Status | Evidence |
|-------------|--------|----------|
| React Query for server state | ✅ Done | All hooks use useQuery |
| Supabase client configured | ✅ Done | `integrations/supabase/client.ts` |
| Edge functions directory | ❌ Missing | No `supabase/functions/` |
| Real-time subscriptions | ⚠️ Partial | Not widely used yet |
| Optimistic updates | ✅ Done | Mutations invalidate queries |

### 07 — User Journey Workflows

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Signup → Wizard → Dashboard | ⚠️ Partial | Signup works, no wizard |
| URL extraction workflow | ❌ Missing | No ProfileExtractor |
| Task completion workflow | ✅ Done | Status updates work |
| Risk analysis on dashboard | ❌ Missing | No RiskAnalyzer |

### 08 — System Architecture & Best Practices

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Feature-based organization | ✅ Done | Components organized by feature |
| Custom hooks for logic | ✅ Done | useTasks, useCRM, etc. |
| RLS policies | ✅ Done | All tables have RLS |
| Error boundaries | ❌ Missing | No React error boundaries |
| Loading states | ✅ Done | Skeleton components used |
| Rate limiting | ❌ Missing | No backend rate limits |

### 09 — Login/Signup Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Centered card layout | ✅ Done | Login.tsx styling |
| Email/password auth | ✅ Done | Supabase auth working |
| Google OAuth | ✅ Done | signInWithGoogle works |
| Mode toggle (signup/signin) | ✅ Done | Tab-based switching |
| Loading states | ✅ Done | Button loading indicator |
| Error messages | ✅ Done | Toast notifications |

### 10 — Tasks Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Kanban board view | ✅ Done | KanbanBoard component |
| List view alternative | ✅ Done | Toggle between views |
| Filter by status/priority | ✅ Done | Filter dropdowns |
| Search tasks | ✅ Done | Search input |
| Task CRUD | ✅ Done | TaskDialog, useTasks |
| AI task suggestions | ⚠️ UI Only | AIPanel placeholder |
| Drag & drop | ✅ Done | Status updates on drop |

### 11 — Projects Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Project cards grid | ✅ Done | ProjectCard components |
| Health status badges | ✅ Done | on_track, at_risk, behind |
| Progress bars | ✅ Done | Visual progress indicator |
| Create project dialog | ✅ Done | CreateProjectDialog |
| Full CRUD operations | ⚠️ Partial | Missing update/delete |
| Project detail page | ❌ Missing | No /projects/:id route |
| AI project insights | ❌ Missing | No AI integration |

### 11.1 — Documents Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Document list | ❌ Missing | Placeholder page only |
| Document editor | ❌ Missing | No rich text editor |
| AI content generation | ❌ Missing | No ContentGenerator agent |
| Template library | ❌ Missing | — |
| Export to PDF/Docs | ❌ Missing | — |

### 11.2 — Lean Canvas Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| 9-box canvas grid | ❌ Missing | No page exists |
| AI pre-fill from profile | ❌ Missing | — |
| Hypothesis validation | ❌ Missing | — |
| Version tracking | ❌ Missing | — |

### 11.3 — GTM Strategy Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| ICP card display | ❌ Missing | No page exists |
| Channel strategy grid | ❌ Missing | — |
| AI ICP generation | ❌ Missing | — |
| Timeline visualization | ❌ Missing | — |

### 11.4 — Discovery Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Natural language search | ❌ Missing | No page exists |
| Prospect scoring | ❌ Missing | — |
| DiscoveryMatcher agent | ❌ Missing | — |
| Add to CRM action | ❌ Missing | — |

### 11.5 — Strategy Screen Design

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Strategic question input | ❌ Missing | No page exists |
| Options evaluation | ❌ Missing | — |
| StrategicPlanner agent | ❌ Missing | — |
| Decision criteria | ❌ Missing | — |

### 16 — Wizard AI Integration

| Requirement | Status | Evidence |
|-------------|--------|----------|
| ProfileExtractor agent | ❌ Missing | No edge function |
| URL context extraction | ❌ Missing | — |
| Approval workflow | ❌ Missing | — |
| Auto-fill form fields | ❌ Missing | — |

### 18 — Task Generation Workflow

| Requirement | Status | Evidence |
|-------------|--------|----------|
| TaskGenerator agent | ❌ Missing | No edge function |
| Wizard completion trigger | ❌ Missing | No wizard |
| 5 prioritized tasks output | ❌ Missing | — |
| Task preview before save | ❌ Missing | — |

### 23 — Task Prioritization

| Requirement | Status | Evidence |
|-------------|--------|----------|
| TaskPrioritizer agent | ❌ Missing | No edge function |
| Urgency/impact scoring | ❌ Missing | — |
| Eisenhower matrix | ❌ Missing | — |
| Focus recommendation | ❌ Missing | — |

---

## Priority Gap Summary

### 🔴 Critical Gaps (Block Core Features)

1. **No Wizard** — Prompts 04, 16 completely unimplemented
2. **No AI Agents** — Prompts 05, 18, 23 require edge functions
3. **No Edge Functions** — Required for all AI features
4. **No Advanced Screens** — Prompts 11.1-11.5 not started

### 🟡 Important Gaps (Reduce Value)

5. **AI Panel static** — Dashboard/Tasks AI sections are placeholders
6. **No error boundaries** — App can crash on errors
7. **Mobile AI panel** — Right panel needs slide-over behavior
8. **Projects incomplete** — Missing full CRUD and detail page

### 🟢 Minor Gaps (Polish)

9. **Real-time subscriptions** — Not widely used
10. **Rate limiting** — Backend protection missing

---

*See [progress-tracker.md](../progress-tracker.md) for full implementation status*
