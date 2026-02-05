---
name: Dashboard Development
description: Create 3-panel dashboard layouts (Left = Context, Main = Work, Right = Intelligence) with React, TypeScript, and Tailwind CSS. Use when implementing dashboard screens, creating new dashboard pages, or following 3-panel architecture.
version: 1.0.0
---

# Dashboard Development

This skill teaches agents how to create dashboard screens following the 3-panel layout architecture used throughout StartupAI.

## When to Use

- When implementing dashboard screens
- When creating new dashboard pages
- When following 3-panel layout architecture
- When building React components for dashboards
- When integrating AI Intelligence panels

## Core Principle: 3-Panel Layout

**All dashboards must use 3-panel layout:**

```
Left Panel = Context (240px)  |  Main Panel = Work (Flexible)  |  Right Panel = Intelligence (320px)
WHERE AM I?                   |  WHAT AM I DOING?              |  HELP ME
```

**Core Model: Context + Work + Intelligence**

### Panel Responsibilities

**Left Panel (Context):**
- Primary navigation menu
- Current page context
- Progress indicators
- Quick stats and filters
- Status badges
- **Never contains:** Forms, primary content, AI insights

**Main Panel (Work):**
- Primary content and data
- Forms and input fields
- Tables and lists
- Editors and wizards
- Kanban boards
- Primary action buttons
- **Never contains:** Navigation, AI insights, secondary info

**Right Panel (Intelligence):**
- AI-generated insights
- Risk alerts and warnings
- Suggested next actions
- AI Coach recommendations
- Explanation of AI reasoning
- Quick action buttons
- **Never contains:** Data entry forms, primary navigation, main content

## Implementation Pattern

### Component Structure

**Use `DashboardLayout` wrapper:**

```typescript
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIPanel } from '@/components/dashboard/AIPanel';

export function DashboardPage() {
  return (
    <DashboardLayout
      leftPanel={<Navigation />}
      mainPanel={<PrimaryContent />}
      aiPanel={<AIPanel />} // or custom Intelligence panel
    />
  );
}
```

**Location:** `src/components/layout/DashboardLayout.tsx`

### Dashboard Layout Component

**Props:**
- `leftPanel` — Left panel content (navigation)
- `mainPanel` — Main panel content (primary work)
- `aiPanel` — Right panel content (AI Intelligence, optional)

**Responsive behavior:**
- Desktop: All 3 panels visible
- Tablet: Collapsible left panel
- Mobile: Slide-over panels

## Left Panel: Context

### Navigation Menu

**Always include:**
- Dashboard link
- Projects link
- Tasks link
- CRM link
- Settings link
- Active page highlighting

### Context Indicators

**Page-specific context:**
- Current section tabs
- Progress indicators
- Completion status
- Quick stats

### Quick Links

**Related dashboards:**
- Links to related pages
- Navigation to connected features
- Breadcrumbs for deep navigation

## Main Panel: Work

### Content Structure

**Section organization:**
- Header with title and actions
- Primary content area
- Forms or data tables
- Action buttons

**Common patterns:**
- Card-based layouts
- Table views with filters
- Form wizards
- Kanban boards
- Timeline views

### Forms and Inputs

**Use shadcn/ui components:**
- `Input`, `Textarea`, `Select`
- `Button`, `Checkbox`, `Switch`
- `Card`, `Tabs`, `Dialog`
- `Skeleton`, `Badge`, `Progress`

**Form validation:**
- React Hook Form with Zod schemas
- Inline validation
- Error messages
- Loading states

## Right Panel: Intelligence

### AI Intelligence Components

**Common components:**
- `AIPanel` — Generic AI insights panel
- AI Coach widget
- Risk Radar
- Suggested Actions
- AI Chat interface

### AI Insights Display

**Show:**
- Profile completion recommendations
- Risk alerts
- Next best actions
- AI-generated suggestions
- Strengths and opportunities

### Interactive Elements

**Action buttons:**
- "Auto-improve" actions
- "Generate" suggestions
- "Analyze" features
- Quick action shortcuts

## Data Fetching Pattern

### React Query Hooks

**All data fetching via React Query:**

```typescript
import { useStartup } from '@/hooks/useStartup';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

function DashboardPage() {
  const { data: startup } = useStartup();
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();
  
  // Use data in components
}
```

**Hook locations:** `src/hooks/use*.ts`

### Data Flow

**Pattern:**
```
Supabase Database → React Query Hooks → Components → UI
```

**Type safety:**
- Use generated types: `Tables<'startups'>`
- Never define types manually
- Type-safe queries and mutations

## Routing Pattern

### React Router Setup

**HashRouter for static hosting:**

```typescript
import { HashRouter, Routes, Route } from 'react-router-dom';

<HashRouter>
  <Routes>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
  </Routes>
</HashRouter>
```

**Route locations:** `src/pages/*.tsx`

## Styling Pattern

### Tailwind CSS Only

**No CDN Tailwind:**
- ❌ `https://cdn.tailwindcss.com` (forbidden)
- ✅ PostCSS + Tailwind (via `tailwind.config.js`)

**Custom theme colors:**
- `sage`, `warm`, `ai` color palettes
- Premium shadows: `shadow-premium-sm/md/lg/xl`

**Component styling:**
- shadcn/ui patterns
- Tailwind utility classes
- Custom theme via `tailwind.config.ts`

## Dashboard Pages in This Project

### Main Dashboard (`/dashboard`)

**Purpose:** Command center, overview, KPIs  
**Status:** ✅ Complete (100%)  
**3-Panel:** ✅ Full implementation

**Components:**
- KPI bar (MRR, users, customers, team size)
- Task list (today's priorities)
- Project list (active projects)
- Deals pipeline
- AI Panel (insights, suggestions, chat)

### User Profile (`/profile`)

**Purpose:** Personal identity management  
**Status:** 🔴 Missing (prompt created, needs implementation)  
**3-Panel:** ❌ Not started

**Expected structure:**
- Left: Profile navigation, completion indicator
- Main: Profile form (personal info, preferences, security)
- Right: Profile completion recommendations, AI suggestions

### Company Profile (`/company-profile`)

**Purpose:** Company profile management, source of truth  
**Status:** 🔴 Missing (prompt created, needs implementation)  
**3-Panel:** ❌ Not started

**Expected structure:**
- Left: Profile navigation, completion indicator
- Main: Profile form (overview, business, social, traction, team)
- Right: AI Profile Coach (strengths, risks/gaps, auto-improve)

## Best Practices

### ✅ DO

- Always use 3-panel layout (`DashboardLayout`)
- Place navigation in left panel
- Put primary content in main panel
- Include AI Intelligence in right panel
- Use React Query for all data fetching
- Use generated types from Supabase
- Follow shadcn/ui component patterns
- Use Tailwind CSS for styling

### ❌ DON'T

- Don't skip 3-panel layout
- Don't put forms in left or right panels
- Don't put navigation in main or right panels
- Don't put AI insights in main panel
- Don't fetch data directly (use React Query hooks)
- Don't define types manually (generate from schema)
- Don't use CDN Tailwind (use PostCSS)

## Reference

- **3-Panel Architecture:** `prompts/dashboard/02-three-panel-layout-architecture.md`
- **Dashboard Screen Design:** `prompts/dashboard/03-dashboard-screen-design.md`
- **User Profile Prompt:** `prompts/dashboard/27-user-profile.md`
- **Company Profile Prompt:** `prompts/dashboard/28-company-profile.md`
- **Progress Tracker:** `prompts/dashboard/00-dash-progress.md`
- **React/Vite Rules:** `.cursor/rules/react-vite.mdc`

---

**Created:** 2025-01-16  
**Based on:** 3-panel dashboard architecture  
**Version:** 1.0.0
