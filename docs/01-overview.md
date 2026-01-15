# StartupAI - Technical Overview

> AI-Powered Operating System for Founders

## Table of Contents
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Routing & Navigation](#routing--navigation)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [Component Architecture](#component-architecture)
- [Import Paths](#import-paths)
- [Features](#features)
- [Deployment](#deployment)

---

## Tech Stack

### Core Frameworks

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI Library |
| Vite | ^5.4.19 | Build Tool & Dev Server |
| TypeScript | ^5.8.3 | Type Safety |
| React Router | ^6.30.1 | Client-side Routing |

### Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | ^3.4.17 | Utility-first CSS |
| shadcn/ui | Latest | Component Library (Radix-based) |
| Framer Motion | ^12.26.2 | Animations |
| Lucide React | ^0.462.0 | Icon Library |
| class-variance-authority | ^0.7.1 | Variant Management |
| tailwind-merge | ^2.6.0 | Class Merging |

### State & Data

| Technology | Version | Purpose |
|------------|---------|---------|
| TanStack React Query | ^5.83.0 | Server State Management |
| Supabase JS | ^2.90.1 | Backend as a Service |
| React Hook Form | ^7.61.1 | Form Management |
| Zod | ^3.25.76 | Schema Validation |

### UI Components (Radix Primitives)

| Component | Version |
|-----------|---------|
| @radix-ui/react-dialog | ^1.1.14 |
| @radix-ui/react-dropdown-menu | ^2.1.15 |
| @radix-ui/react-avatar | ^1.1.10 |
| @radix-ui/react-tabs | ^1.1.12 |
| @radix-ui/react-toast | ^1.2.14 |
| @radix-ui/react-tooltip | ^1.2.7 |
| + 20 more... | Various |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | ^9.32.0 | Linting |
| Vitest | ^3.2.4 | Unit Testing |
| Testing Library | ^16.0.0 | Component Testing |
| PostCSS | ^8.5.6 | CSS Processing |
| Autoprefixer | ^10.4.21 | CSS Vendor Prefixes |

---

## Architecture Overview

```mermaid
graph TB
    subgraph "Frontend (React + Vite)"
        A[App.tsx] --> B[AuthProvider]
        B --> C[Routes]
        C --> D[Public Pages]
        C --> E[Protected Pages]
        E --> F[ProtectedRoute]
        F --> G[Dashboard Layout]
    end
    
    subgraph "Backend (Supabase)"
        H[Supabase Auth]
        I[PostgreSQL Database]
        J[Edge Functions]
        K[Storage Buckets]
    end
    
    B <--> H
    G <--> I
    G <--> J
    
    style A fill:#10b981,color:#fff
    style H fill:#3b82f6,color:#fff
    style I fill:#8b5cf6,color:#fff
```

### Frontend-Backend Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React App
    participant A as Supabase Auth
    participant D as PostgreSQL
    
    U->>R: Visit /login
    U->>R: Click "Sign in with Google"
    R->>A: signInWithOAuth('google')
    A-->>U: Redirect to Google
    U->>A: Authenticate
    A-->>R: Redirect with session
    R->>A: onAuthStateChange
    A-->>R: Session + User
    R->>D: Fetch profile & roles
    D-->>R: User data
    R->>U: Redirect to /dashboard
```

---

## Directory Structure

```
startupai/
├── docs/                          # Documentation
│   └── 01-overview.md
├── public/                        # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── auth/                  # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   └── AIPanel.tsx
│   │   ├── home/                  # Homepage sections
│   │   │   ├── CTASection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   └── WhatChangesSection.tsx
│   │   ├── layout/                # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   └── ui/                    # shadcn/ui components (48 components)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ... (45 more)
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useAuth.tsx
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client config
│   │       └── types.ts           # Auto-generated types
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn)
│   ├── pages/                     # Route pages
│   │   ├── CRM.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Documents.tsx
│   │   ├── Index.tsx              # Homepage
│   │   ├── Investors.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Projects.tsx
│   │   ├── Settings.tsx
│   │   └── Tasks.tsx
│   ├── test/                      # Test files
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── App.css
│   ├── App.tsx                    # Root component
│   ├── index.css                  # Global styles + design tokens
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts
├── supabase/
│   ├── migrations/                # Database migrations
│   └── config.toml                # Supabase configuration
├── .env                           # Environment variables
├── CHANGELOG.md
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Routing & Navigation

### Sitemap

```mermaid
graph LR
    subgraph "Public Routes"
        A["/"] --> B["Homepage"]
        C["/login"] --> D["Login Page"]
    end
    
    subgraph "Protected Routes"
        E["/dashboard"] --> F["Main Dashboard"]
        G["/projects"] --> H["Projects"]
        I["/tasks"] --> J["Tasks"]
        K["/crm"] --> L["CRM"]
        M["/documents"] --> N["Documents"]
        O["/investors"] --> P["Investors"]
        Q["/settings"] --> R["Settings"]
    end
    
    S["/*"] --> T["404 Not Found"]
    
    style B fill:#10b981,color:#fff
    style F fill:#3b82f6,color:#fff
```

### Route Configuration

| Route | Component | Auth Required | Layout |
|-------|-----------|---------------|--------|
| `/` | Index | No | Header + Footer |
| `/login` | Login | No | Standalone |
| `/dashboard` | Dashboard | Yes | DashboardLayout |
| `/projects` | Projects | Yes | DashboardLayout |
| `/tasks` | Tasks | Yes | DashboardLayout |
| `/crm` | CRM | Yes | DashboardLayout |
| `/documents` | Documents | Yes | DashboardLayout |
| `/investors` | Investors | Yes | DashboardLayout |
| `/settings` | Settings | Yes | DashboardLayout |
| `*` | NotFound | No | Standalone |

### Router Setup (App.tsx)

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={
      <ProtectedRoute><Dashboard /></ProtectedRoute>
    } />
    {/* ... other protected routes */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

---

## Authentication Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    
    Unauthenticated --> GoogleAuth: Click "Sign in with Google"
    GoogleAuth --> Authenticated: Success
    GoogleAuth --> Unauthenticated: Cancel/Error
    
    Authenticated --> Dashboard: Redirect
    Authenticated --> Unauthenticated: Sign Out
    
    state Authenticated {
        [*] --> FetchProfile
        FetchProfile --> FetchRole
        FetchRole --> Ready
    }
    
    state Ready {
        [*] --> UserRole
        UserRole --> Admin: role = 'admin'
        UserRole --> Moderator: role = 'moderator'  
        UserRole --> User: role = 'user'
    }
```

### Auth Hook Usage

```tsx
import { useAuth } from '@/hooks/useAuth';

function Component() {
  const { 
    user,           // Supabase User object
    session,        // Supabase Session
    profile,        // profiles table data
    userRole,       // { role: 'admin' | 'moderator' | 'user' }
    loading,        // boolean
    signInWithGoogle,
    signOut,
    isAdmin,        // boolean
    isModerator,    // boolean
  } = useAuth();
}
```

---

## Database Schema

### Core Tables

```mermaid
erDiagram
    auth_users ||--o| profiles : "has"
    auth_users ||--o{ user_roles : "has"
    profiles ||--o| organizations : "belongs to"
    organizations ||--o{ startups : "owns"
    organizations ||--o{ org_members : "has"
    startups ||--o{ projects : "has"
    startups ||--o{ tasks : "has"
    startups ||--o{ contacts : "has"
    startups ||--o{ deals : "has"
    startups ||--o{ documents : "has"
    
    profiles {
        uuid id PK
        text email
        text full_name
        text avatar_url
        uuid org_id FK
        text role
        boolean onboarding_completed
        jsonb preferences
    }
    
    user_roles {
        uuid id PK
        uuid user_id FK
        app_role role
        timestamp created_at
    }
    
    organizations {
        uuid id PK
        text name
        text slug
        text subscription_tier
        jsonb settings
    }
    
    startups {
        uuid id PK
        uuid org_id FK
        text name
        text industry
        text stage
        jsonb traction_data
    }
```

### Role System

```mermaid
graph TD
    A[User Signs Up] --> B[Trigger: handle_new_user]
    B --> C[Create Profile]
    B --> D[Assign 'user' Role]
    
    E[Admin Action] --> F{has_role check}
    F -->|true| G[Execute Action]
    F -->|false| H[Access Denied]
    
    style A fill:#10b981,color:#fff
    style G fill:#3b82f6,color:#fff
    style H fill:#ef4444,color:#fff
```

---

## Component Architecture

### Layout System

```mermaid
graph TB
    subgraph "Homepage Layout"
        A[Header] --> B[Main Content]
        B --> C[Footer]
    end
    
    subgraph "Dashboard Layout (3-Panel)"
        D[Left Sidebar] --> E[Center Content]
        E --> F[Right AI Panel]
    end
    
    subgraph "Components"
        G[DashboardLayout.tsx]
        H[Header.tsx]
        I[Footer.tsx]
        J[AIPanel.tsx]
    end
```

### UI Component Library

48 shadcn/ui components available:

| Category | Components |
|----------|------------|
| **Feedback** | Alert, Toast, Sonner, Progress, Skeleton |
| **Form** | Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Calendar |
| **Data Display** | Table, Card, Avatar, Badge, Chart |
| **Navigation** | Tabs, Menubar, Breadcrumb, Pagination, Navigation Menu |
| **Overlay** | Dialog, Drawer, Sheet, Popover, Tooltip, Hover Card |
| **Layout** | Accordion, Collapsible, Separator, Resizable, Scroll Area |

---

## Import Paths

### Path Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Common Imports

```typescript
// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

// Integrations
import { supabase } from "@/integrations/supabase/client";

// Utilities
import { cn } from "@/lib/utils";
```

---

## Features

### Completed Features ✅

| Feature | Status | Description |
|---------|--------|-------------|
| Homepage | ✅ Complete | Marketing landing page with sections |
| Authentication | ✅ Complete | Google OAuth with profiles & roles |
| Dashboard | ✅ Complete | 3-panel layout with metrics |
| AI Panel | ✅ Complete | Insights, risks, suggestions UI |
| Protected Routes | ✅ Complete | Auth-gated pages |
| Design System | ✅ Complete | Premium light theme |

### Placeholder Pages 🔨

| Page | Status | Next Steps |
|------|--------|------------|
| Projects | Placeholder | Add Kanban board, project CRUD |
| Tasks | Placeholder | Add task list, filters, creation |
| CRM | Placeholder | Add contact management, deals |
| Documents | Placeholder | Add document editor, templates |
| Investors | Placeholder | Add investor pipeline |
| Settings | Placeholder | Add profile editing, preferences |

### Planned Features 📋

```mermaid
gantt
    title Feature Roadmap
    dateFormat  YYYY-MM-DD
    section Core
    Onboarding Flow       :a1, 2026-01-16, 3d
    Projects CRUD         :a2, after a1, 5d
    Tasks Management      :a3, after a2, 5d
    section Advanced
    CRM Contacts          :b1, after a3, 5d
    Document Editor       :b2, after b1, 5d
    AI Chat Integration   :b3, after b2, 7d
```

---

## Workflows

### User Journey

```mermaid
journey
    title User Journey - First Time User
    section Discovery
      Visit Homepage: 5: Visitor
      Read Value Prop: 4: Visitor
      Click Start Free: 5: Visitor
    section Onboarding
      Login with Google: 5: User
      Complete Profile: 3: User
      Create Organization: 4: User
      Add Startup Details: 3: User
    section Daily Use
      View Dashboard: 5: User
      Check Priorities: 5: User
      Update Tasks: 4: User
      Review AI Insights: 5: User
```

### Data Flow

```mermaid
flowchart LR
    A[User Action] --> B[React Component]
    B --> C{Needs Auth?}
    C -->|Yes| D[useAuth Hook]
    C -->|No| E[Direct API Call]
    D --> F[Supabase Client]
    E --> F
    F --> G[PostgreSQL + RLS]
    G --> H[Return Data]
    H --> I[React Query Cache]
    I --> J[Update UI]
```

---

## Deployment

### Environment Variables

```env
VITE_SUPABASE_PROJECT_ID="yvyesmiczbjqwbqtlidy"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbG..."
VITE_SUPABASE_URL="https://yvyesmiczbjqwbqtlidy.supabase.co"
```

### Build Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Run Tests
npm run test
```

### URLs

| Environment | URL |
|-------------|-----|
| Preview | https://id-preview--c853d8c8-40a1-4530-9351-9050838a00d9.lovable.app |
| Production | https://rocket-path-ai.lovable.app |
| Supabase | https://supabase.com/dashboard/project/yvyesmiczbjqwbqtlidy |

---

## Security Considerations

1. **Row Level Security (RLS)** - All tables have RLS policies
2. **Role-Based Access** - Roles stored in separate table to prevent privilege escalation
3. **Security Definer Functions** - Prevent RLS recursion attacks
4. **Auth State Listener** - Set up before getSession() to prevent race conditions
5. **Protected Routes** - Server-side validation via RLS, client-side via ProtectedRoute

---

*Last Updated: 2026-01-15*
