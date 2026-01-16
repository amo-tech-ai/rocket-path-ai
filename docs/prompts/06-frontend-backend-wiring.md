# Core Prompt 06 — Frontend Backend Wiring Setup

**Purpose:** Define what is needed for core setup: frontend components, backend services, data flow, and integration patterns  
**Focus:** Technical wiring between React frontend, Supabase backend, and edge functions  
**Status:** Core Foundation

---

## Core Setup Requirements

### Frontend Foundation

**React Application Structure**
- React 18 with functional components and hooks
- Vite build tool for fast development and production builds
- TypeScript for type safety and better developer experience
- React Router for client-side routing and navigation

**Styling System**
- Tailwind CSS for utility-first styling
- shadcn/ui component library for consistent UI elements
- Custom design tokens for brand colors and typography
- Responsive breakpoints for all device sizes

**State Management**
- TanStack React Query for server state and caching
- React Context for global app state (user, startup, organization)
- Local state for component-specific UI state
- Optimistic updates for better user experience

### Backend Foundation

**Supabase Database**
- PostgreSQL database with 42 tables
- Row Level Security policies for multi-tenant data isolation
- Real-time subscriptions for live data updates
- Database functions for complex queries

**Supabase Authentication**
- Email and password authentication
- Session management and persistence
- Protected route enforcement
- User profile creation on signup

**Supabase Edge Functions**
- Deno runtime for serverless functions
- AI gateway function (ai-helper) for all AI calls
- Structured request and response patterns
- Error handling and logging

---

## Frontend Components Needed

### Layout Components

**AppShell Component**
- Three-panel layout container
- Responsive behavior for all breakpoints
- Panel width management
- Navigation integration

**DashboardHeader Component**
- Application header with logo
- User avatar and settings menu
- Notification indicators
- Search functionality (future)

**DashboardNav Component**
- Left panel navigation menu
- Active route highlighting
- Collapsible sections
- Quick stats display

**AIPanel Component**
- Right panel AI intelligence display
- Scrollable content area
- Expandable sections
- Action buttons

### Screen Components

**Dashboard Page Component**
- KPI bar component
- Next best action card
- Task list component
- Project grid component
- AI insights integration

**Wizard Page Component**
- Step progress indicator
- Step form components (Step 1, 2, 3)
- AI extraction panel
- Navigation controls
- Auto-save functionality

**Tasks Page Component**
- Task list or table view
- Task creation form
- Task filters and sorting
- Task detail views

**Projects Page Component**
- Project grid or list
- Project cards with progress
- Project creation form
- Project detail views

### Shared Components

**Form Components**
- Input fields with validation
- Textarea with character count
- Select dropdowns
- Toggle switches
- Date pickers

**Data Display Components**
- KPI cards with trends
- Progress bars
- Status badges
- Priority indicators
- Health indicators

**AI Components**
- AI suggestion cards
- Risk alert components
- Loading states
- Error states
- Success confirmations

---

## Backend Services Needed

### Supabase Client Setup

**Client Configuration**
- Supabase URL and anon key from environment
- Auth configuration
- Real-time configuration
- Storage configuration (if needed)

**Client Instance**
- Singleton pattern for client
- Exported for use throughout app
- Type-safe with generated types
- Error handling wrapper

### Edge Function Services

**AI Service Layer**
- Service functions for each agent
- Error handling and retry logic
- Response parsing and validation
- Cost tracking integration

**Service Functions**
- ProfileExtractor service
- RiskAnalyzer service
- TaskGenerator service
- Common error handling
- Loading state management

### Data Service Layer

**Database Query Services**
- Startup data queries
- Task queries with filters
- Project queries
- Contact and deal queries (Phase 2)

**Query Patterns**
- React Query hooks for data fetching
- Optimistic updates
- Cache invalidation
- Real-time subscriptions

---

## Data Flow Patterns

### Read Pattern

**Frontend → Supabase → Database**
- React component calls query hook
- Query hook uses Supabase client
- Supabase client queries database
- Database returns data with RLS enforcement
- Data flows to React component
- Component renders with data

**Example:**
- Dashboard component calls useStartupData hook
- Hook queries startups table with org_id filter
- Supabase enforces RLS policy
- Data returned to component
- Component displays KPIs

### Write Pattern

**Frontend → Supabase → Database → Frontend**
- User action triggers mutation
- Mutation uses Supabase client
- Supabase client inserts/updates database
- Database validates and saves
- Real-time subscription updates UI
- Component reflects new state

**Example:**
- User creates task
- Task form calls createTask mutation
- Mutation inserts into tasks table
- Database saves with RLS
- Real-time subscription notifies
- Task list updates automatically

### AI Call Pattern

**Frontend → Edge Function → Gemini API → Frontend**
- User action triggers AI call
- Frontend calls edge function service
- Service calls Supabase edge function
- Edge function calls Gemini API
- Gemini returns structured response
- Edge function processes response
- Response flows to frontend
- Frontend displays AI output

**Example:**
- User clicks "Autofill" in wizard
- Frontend calls extractStartupProfile service
- Service calls ai-helper edge function
- Edge function calls Gemini with URL Context
- Gemini returns structured extraction
- Edge function validates and returns
- Frontend displays suggestions in right panel

---

## Integration Points

### Authentication Integration

**Signup Flow**
- User submits signup form
- Supabase Auth creates user account
- Database trigger creates profile
- Database trigger creates organization
- User redirected to wizard

**Login Flow**
- User submits login form
- Supabase Auth authenticates
- Session token stored
- User redirected to dashboard
- Protected routes accessible

**Session Management**
- Session checked on app load
- Session persisted across refreshes
- Session expiration handled
- Logout clears session

### Data Integration

**Startup Data**
- Queried on dashboard load
- Real-time subscription for updates
- Cached with React Query
- Optimistic updates for edits

**Task Data**
- Queried with filters and sorting
- Real-time subscription for new tasks
- Optimistic updates for creates
- Cache invalidation on updates

**Project Data**
- Queried with status filters
- Real-time subscription for changes
- Progress calculated from tasks
- Health status from metrics

### AI Integration

**ProfileExtractor Integration**
- Wizard Step 1 form triggers
- URL input validated
- Edge function called with URL
- Gemini URL Context tool used
- Structured response parsed
- Suggestions displayed in right panel

**RiskAnalyzer Integration**
- Dashboard load triggers
- Startup data passed to agent
- Edge function called with context
- Gemini structured output used
- Risks displayed in right panel
- Alerts shown in dashboard

**TaskGenerator Integration**
- Wizard completion triggers
- Startup profile passed to agent
- Edge function called with data
- Gemini structured output used
- Tasks created in database
- Tasks displayed on dashboard

---

## Required Setup Steps

### Step 1: Frontend Foundation

**React + Vite Setup**
- Initialize Vite project with React template
- Configure TypeScript
- Set up Tailwind CSS
- Install shadcn/ui components
- Configure path aliases

**Routing Setup**
- Install React Router
- Configure route structure
- Set up protected route wrapper
- Create route components
- Configure navigation

### Step 2: Supabase Integration

**Client Setup**
- Install Supabase client library
- Create Supabase client instance
- Configure environment variables
- Set up type generation
- Create client singleton

**Auth Setup**
- Configure email/password auth
- Create AuthContext provider
- Implement signup flow
- Implement login flow
- Wire AuthGuard to routes

### Step 3: Service Layer

**Data Services**
- Create Supabase query hooks
- Set up React Query provider
- Create data fetching functions
- Implement real-time subscriptions
- Add error handling

**AI Services**
- Create edge function service layer
- Implement agent service functions
- Add error handling and retries
- Integrate loading states
- Add response validation

### Step 4: Component Integration

**Layout Components**
- Build AppShell with three panels
- Create DashboardHeader
- Create DashboardNav
- Create AIPanel
- Wire responsive behavior

**Screen Components**
- Build Dashboard page
- Build Wizard page
- Build Tasks page
- Build Projects page
- Integrate with services

### Step 5: AI Integration

**Agent Integration**
- Wire ProfileExtractor to wizard
- Wire RiskAnalyzer to dashboard
- Wire TaskGenerator to wizard
- Add loading and error states
- Implement user approval flows

---

## Best Practices

### Code Organization

**Directory Structure**
- Clear separation of concerns
- Feature-based organization
- Shared components in common location
- Service layer separate from UI
- Type definitions centralized

**Component Patterns**
- Functional components with hooks
- Custom hooks for data fetching
- Reusable UI components
- Composition over inheritance
- Clear prop interfaces

### Error Handling

**Frontend Errors**
- Try-catch blocks for async operations
- Error boundaries for component errors
- User-friendly error messages
- Recovery options provided
- Error logging to monitoring

**Backend Errors**
- Edge function error handling
- Database error handling
- API error responses
- Graceful degradation
- Fallback mechanisms

### Performance

**Optimization**
- Code splitting for routes
- Lazy loading for heavy components
- Image optimization
- Efficient re-renders
- Memoization where needed

**Caching**
- React Query cache strategy
- API response caching
- Static asset caching
- Browser caching headers
- Cache invalidation logic

---

## Summary

The frontend backend wiring creates a seamless connection between the React frontend, Supabase backend, and edge functions. The service layer abstracts complexity, React Query manages server state, and the three-panel layout provides a consistent structure for all screens.

**Key Requirements:**
- React + Vite + TypeScript frontend
- Supabase client and auth integration
- Edge function service layer
- React Query for data management
- Three-panel layout components
- AI agent service functions
- Real-time subscriptions
- Error handling throughout
- Performance optimization
- Type safety with TypeScript
