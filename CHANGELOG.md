# Changelog

All notable changes to StartupAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
