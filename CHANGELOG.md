# Changelog

All notable changes to StartupAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2026-01-19

### Added
- **Events Module - Core Complete**
  - Events Directory at `/app/events` with grid/list views
  - Event Detail page at `/app/events/:id` with tabs (Overview, Guests, Sponsors, Logistics)
  - EventCard component with health score, status badges, placeholder images
  - useEvents hook with full CRUD + filtering
  - Demo RLS policies for authenticated users

- **Event Wizard** (`/app/events/new`)
  - 4-step wizard: Context → Strategy → Logistics → Review
  - Step 1: Name, type, reference URL, AI description generation
  - Step 2: Goals, target audience, budget slider, success metrics
  - Step 3: Date/time, duration, location type (in-person/virtual/hybrid), venue
  - Step 4: Review summary and create button
  - localStorage progress saving (resume on refresh)
  - AI Assistant panel with step-specific guidance
  - Readiness score tracking
  - Creates event on completion and redirects to detail page

### Technical
- WizardStepContext, WizardStepStrategy, WizardStepLogistics, WizardStepReview components
- WizardAIPanel with readiness scoring and checklist
- Route added: `/app/events/new`

---

## [0.4.1] - 2026-01-16

## [0.4.0] - 2026-01-16

### Added
- **Edge Functions (13 Total)**
  - All 13 edge functions deployed and active
  - Claude-powered functions: `strategic-plan` (Opus 4.5), `audit-system` (Opus 4.5), `orchestrate` (Sonnet 4.5), `automation-run` (Haiku 4.5), `ai-chat` (Haiku 4.5)
  - Gemini-powered functions: `ai-helper` (3 Pro), `extract-contact-info` (3 Pro), `extract-insights` (3 Pro), `chat-copilot` (3 Flash), `generate-image` (3 Pro Image)
  - Infrastructure functions: `health`, `auth-check`, `stripe-webhook`
  - See `docs/prompts/11-edge-functions-summary.md` for full documentation

- **AI Integration Hooks**
  - `useAIChat` - Full chat interface with message history
  - `useAIInsights` - Quick AI queries without history
  - `useAITaskPrioritization` - Eisenhower matrix task prioritization
  - `useAITaskGeneration` - Onboarding task generation

- **Interactive AIPanel**
  - Connected to `ai-chat` edge function
  - Real-time chat interface with message history
  - Quick prompts for common questions
  - Suggested actions with navigation support
  - Animated transitions between insights and chat modes

- **Lean Canvas Screen** (New)
  - 9-box grid layout per Lean Canvas framework
  - Editable boxes with add/remove items
  - AI pre-fill from startup profile
  - AI hypothesis validation
  - Auto-save to documents table
  - Completion tracking and export options

- **AI Task Generation**
  - AITaskSuggestions component on Tasks page
  - Connected to ai-chat edge function with `generate_tasks` action
  - Accept/dismiss individual suggestions
  - Task parsing from AI response

### Changed
- Updated progress tracker to reflect edge functions completion
- AIPanel now uses live AI instead of static content

### Technical
- Model-aware edge function routing (Claude vs Gemini)
- Token usage tracking and AI run logging
- CORS-enabled edge functions for frontend integration

---


## [0.3.0] - 2026-01-15

### Added
- **Investors Module** (Complete)
  - `investors` database table with RLS policies
  - 8 sample seed investors (Sequoia, a16z, YC, Lightspeed, etc.)
  - InvestorPipeline kanban board with 8 status columns
  - Drag-and-drop status updates
  - InvestorCard with firm, check size, priority, investment focus
  - InvestorDialog with 3-tab form (Basic, Investment, Tracking)
  - InvestorDetailSheet with full profile, timeline, actions
  - FundraisingProgress component with target vs committed
  - useInvestors hook with full CRUD operations
  - Status and type filtering
  - Search functionality
  - Pipeline and list view toggle

- **Tasks Module** (Complete)
  - KanbanBoard with 3 columns (To Do, In Progress, Done)
  - Drag-and-drop task movement
  - TaskCard with priority, project, due date
  - TaskDialog for create/edit
  - useTasks hook with CRUD + status updates
  - Project filtering via dropdown
  - Search by title/description
  - List view alternative
  - Task statistics display

- **CRM Module** (Complete)
  - Contacts list with search and type filtering
  - ContactCard, ContactDialog, ContactDetailSheet
  - DealPipeline visualization by stage
  - DealDialog for deal management
  - useCRM hook with full CRUD for contacts and deals
  - Tabs for Contacts and Pipeline views

- **Dev Bypass RLS Policies**
  - Added SELECT policies for startups, projects, tasks, contacts, deals, documents, investors
  - Allows data access when user_org_id() is null (dev mode)

- **Progress Tracker**
  - Created `/docs/progress-tracker.md` with comprehensive status

### Fixed
- React StrictMode wrapper in main.tsx (fixes useEffect null error)
- TypeScript type compatibility for investor mutations
- Task due_at vs due_date field alignment

### Technical
- useInvestors, useTasks, useCRM hooks with React Query
- Proper error handling with toast notifications
- Skeleton loading states for all modules

---

## [0.2.0] - 2026-01-15

### Added
- **Authentication System**
  - Google OAuth integration via Supabase Auth
  - User profiles table with auto-creation trigger
  - Role-based access control (admin, moderator, user)
  - `user_roles` table with RLS policies
  - `has_role()` and `get_user_role()` security definer functions
  - `useAuth` hook for authentication state management
  - `ProtectedRoute` component for route protection
  - Login page with Google sign-in button
  - Auth-aware Header with user avatar dropdown
  
- **Database Functions**
  - `handle_new_user()` trigger for auto-creating profiles and roles
  - RLS policies for secure data access

### Changed
- Updated Header component to show authenticated user menu
- All dashboard routes now require authentication
- App.tsx wrapped with AuthProvider

### Security
- Implemented Row Level Security (RLS) on user_roles table
- Security definer functions to prevent RLS recursion
- Roles stored in separate table (not on profiles) to prevent privilege escalation

---

## [0.1.0] - 2026-01-15

### Added
- **Project Initialization**
  - React 18 + Vite 5 + TypeScript setup
  - Tailwind CSS with custom design system
  - shadcn/ui component library integration
  - Framer Motion for animations

- **Design System**
  - Premium light theme with warm whites and sage accents
  - Custom CSS variables for theming
  - Glass morphism effects
  - Premium shadow utilities
  - Responsive container utilities

- **Homepage (Public)**
  - Hero section with animated flow diagram
  - Problem statement section
  - "How It Works" section with visual diagrams
  - "What Changes" comparison section
  - Features grid with 6 feature cards
  - Final CTA section
  - Responsive header with navigation
  - Footer component

- **Dashboard (Protected)**
  - 3-panel layout system (Context | Work | Intelligence)
  - Key metrics cards (MRR, Active Users, Runway, Team Size)
  - Today's priorities list with completion states
  - Active projects with progress bars
  - Recent activity feed
  - AI Panel with insights, risks, and suggested actions

- **Placeholder Pages**
  - Projects page
  - Tasks page
  - CRM page
  - Documents page
  - Investors page
  - Settings page

- **Supabase Integration**
  - Connected to external Supabase project (startupai)
  - 29 pre-existing database tables
  - Supabase client configuration
  - TypeScript types auto-generated

- **Navigation**
  - React Router v6 setup
  - DashboardLayout with sidebar navigation
  - 404 Not Found page

### Technical
- ESLint configuration
- Vitest testing setup
- Path aliases configured (@/)
- SEO meta tags in index.html
