# Prompt 05 — Authentication & Authorization

> **Phase:** Foundation | **Priority:** P0 | **Overall:** 95%
> **No code — auth flows, role model, button specs, and access rules only**

---

## Authentication Methods

| Method | Provider | Status | Usage |
|--------|----------|--------|-------|
| Google OAuth | Supabase Auth (PKCE flow) | Deployed | Primary sign-in |
| LinkedIn OAuth | Supabase Auth (PKCE flow) | Deployed | Alternative sign-in |
| Email/Password | Supabase Auth | Available | Fallback (not promoted in UI) |

**No dedicated sign-up page.** First OAuth sign-in automatically creates account via `auth.users` + database trigger creates `profiles` row.

---

## Auth Buttons — Complete Inventory

### Landing Page Header (`/` — Marketing Header)

| Button | Variant | Destination | Visible When |
|--------|---------|-------------|--------------|
| **Sign In** | ghost (text only) | `/login` | Always (desktop + mobile menu) |
| **Get Started** | primary (filled) | `/login` | Always (desktop + mobile menu) |

### Landing Page Hero Section (`/`)

| Button | Variant | Destination | Notes |
|--------|---------|-------------|-------|
| **Start Your Profile** | primary, large | `/login` | Main CTA above the fold |
| **Watch How It Works** | secondary, outline | `#how-it-works` | Anchor scroll |

### Landing Page CTA Section (bottom of `/`)

| Button | Variant | Destination | Notes |
|--------|---------|-------------|-------|
| **Start Your Profile** | primary, large | `/login` | Bottom-of-page conversion CTA |
| | | | Shows "Free to start - No credit card required" below |

### Login Page (`/login`)

| Button | Variant | Action | Notes |
|--------|---------|--------|-------|
| **Continue with Google** | outline with Google SVG icon | `signInWithGoogle()` → OAuth redirect | Primary sign-in method |
| **Continue with LinkedIn** | outline with LinkedIn SVG icon | `signInWithLinkedIn()` → OAuth redirect | Alternative sign-in |
| **← Back to Home** | ghost | Navigate to `/` | Bottom of login card |
| Terms of Service | text link | `/terms` (placeholder) | Below OAuth buttons |
| Privacy Policy | text link | `/privacy` (placeholder) | Below OAuth buttons |

### Dashboard Header (authenticated layout)

| Button | Variant | Action | Visible When |
|--------|---------|--------|--------------|
| **Log in** | ghost | Navigate to `/login` | User NOT logged in |
| **Start Your Profile** | primary | Navigate to `/login` | User NOT logged in |
| **Avatar dropdown** | avatar image | Opens menu | User IS logged in |
| └ Dashboard | menu item | Navigate to `/dashboard` | Always in dropdown |
| └ Settings | menu item | Navigate to `/settings` | Always in dropdown |
| └ **Sign out** | menu item (destructive/red) | `signOut()` → redirect to `/` | Always in dropdown |

---

## Auth Flow — Sign Up (New User)

```
1. User clicks "Get Started" or "Start Your Profile" on landing page
   └→ Navigates to /login

2. User clicks "Continue with Google" or "Continue with LinkedIn"
   └→ supabase.auth.signInWithOAuth({ provider, options: { redirectTo: origin + '/auth/callback' } })
   └→ Browser redirects to OAuth provider consent screen

3. Provider authenticates user, redirects to /auth/callback
   └→ PKCE code exchange happens automatically (detectSessionInUrl: true)
   └→ Supabase creates auth.users record

4. Database trigger (on_auth_user_created) fires
   └→ Creates profiles row with: id = auth.users.id, email, onboarding_completed = false

5. AuthCallback page listens for SIGNED_IN event
   └→ Queries wizard_sessions to check onboarding status
   └→ onboarding_completed = false → redirect to /onboarding

6. Onboarding wizard (4 steps)
   └→ Step 1: Company URL + description
   └→ Step 2: Founder profile
   └→ Step 3: Business model + traction
   └→ Step 4: Review + submit
   └→ Creates organization, startup, sets profiles.onboarding_completed = true

7. Redirect to /dashboard
```

## Auth Flow — Sign In (Returning User)

```
1. User clicks any auth button (Sign In, Get Started, Start Your Profile)
   └→ Navigates to /login

2. User clicks OAuth provider button
   └→ supabase.auth.signInWithOAuth() with PKCE

3. AuthCallback receives SIGNED_IN event
   └→ Queries wizard_sessions for onboarding status
   └→ onboarding_completed = true → redirect to /dashboard
   └→ onboarding_completed = false → redirect to /onboarding

4. useAuth hook loads profile + role from database
   └→ App renders authenticated layout
```

## Auth Flow — Sign Out

```
1. User clicks "Sign out" in avatar dropdown menu
   └→ signOut() calls supabase.auth.signOut()
   └→ Clears localStorage session
   └→ Redirects to / (landing page)
```

---

## Session Management

| Aspect | Behavior |
|--------|----------|
| Storage | localStorage via Supabase client |
| Refresh | Auto-refresh before JWT expiry via `onAuthStateChange` listener |
| Access token expiry | 1 hour |
| Refresh token expiry | 7 days |
| Logout | Clears session, redirects to `/` |
| Multi-tab | Session shared across tabs via localStorage |
| Timeout fallback | AuthCallback has 10-second timeout if auth event doesn't fire |
| Error display | OAuth errors from URL params shown with user-friendly messages |

---

## Authorization Model

### Role Hierarchy

| Role | Level | Source Table | Permissions |
|------|-------|-------------|-------------|
| admin | Organization | `user_roles` (role = 'admin') | Full CRUD on all org data, manage members, billing |
| moderator | Organization | `user_roles` (role = 'moderator') | Read/write on all org data, cannot manage members |
| user | Organization | `user_roles` (role = 'user') | Read/write on own startup data only |

### Data Isolation

| Level | Mechanism | Scope |
|-------|-----------|-------|
| Organization | `org_id` on all tables | Users only see their org's data |
| Startup | `startup_id` + `startup_in_org()` RLS | Multi-startup orgs see all their startups |
| User | `auth.uid()` match | Profile, chat sessions, notifications |
| Public | No auth check | Industry events directory, public templates |

### RLS Helper Functions (deployed in database)

| Function | Signature | Purpose | Used By |
|----------|-----------|---------|---------|
| `user_org_id()` | `() → uuid` | Returns current user's organization ID | All org-scoped RLS policies |
| `startup_in_org(startup_id)` | `(uuid) → boolean` | Validates startup belongs to user's org | All startup-scoped policies |
| `is_org_member(org_id)` | `(uuid) → boolean` | Checks membership in specific org | Org-level policies |
| `has_role(role, user_id)` | `(text, uuid) → boolean` | Checks if user has specific app role | Admin-gated features |

---

## Protected Routes

### Route Protection Rules

| Route | Auth Required | Additional Check | Redirect If Fail |
|-------|--------------|-----------------|-----------------|
| `/` | No | — | — (public landing page) |
| `/login` | No | If already logged in → skip | `/dashboard` if authenticated |
| `/auth/callback` | No | Handles OAuth return | `/login` on error |
| `/onboarding` | **Yes** | Must NOT have completed onboarding | `/dashboard` if already onboarded |
| `/dashboard` | **Yes** | Must have completed onboarding | `/login` if not authenticated |
| `/projects` | **Yes** | — | `/login` |
| `/projects/:projectId` | **Yes** | — | `/login` |
| `/tasks` | **Yes** | — | `/login` |
| `/crm` | **Yes** | — | `/login` |
| `/documents` | **Yes** | — | `/login` |
| `/investors` | **Yes** | — | `/login` |
| `/settings` | **Yes** | — | `/login` |
| `/lean-canvas` | **Yes** | — | `/login` |
| `/user-profile` | **Yes** | — | `/login` |
| `/company-profile` | **Yes** | — | `/login` |
| `/app/events` | **Yes** | — | `/login` |
| `/app/events/:id` | **Yes** | — | `/login` |
| `/app/events/new` | **Yes** | — | `/login` |

### ProtectedRoute Component

Wraps all authenticated routes. Logic:

1. Check `user` AND `session` exist (both required for real Supabase auth)
2. If loading → show spinner
3. If not authenticated → redirect to `/login` (preserves location state for return)
4. If `requireAdmin=true` and user is not admin → redirect to `/dashboard`
5. If `requireModerator=true` and user is not moderator → redirect to `/dashboard`
6. Otherwise → render children

### "Get Started" Flow (Auth-Protected)

**All "Get Started" and "Start Your Profile" buttons route to `/login`.** The full protected flow:

```
Landing page button (Get Started / Start Your Profile)
  → /login (shows OAuth buttons)
    → OAuth provider (Google or LinkedIn)
      → /auth/callback (PKCE exchange)
        → /onboarding (if new user, 4-step wizard)
        → /dashboard (if returning user)
```

No unauthenticated user can reach `/onboarding`, `/dashboard`, or any app route. The login page is the single entry point for all authentication.

---

## useAuth Hook — Exported API

```typescript
const {
  user,                // Supabase User object | null
  session,             // Supabase Session | null
  profile,             // profiles row (full_name, avatar_url, org_id, role, preferences, onboarding_completed)
  userRole,            // user_roles row (role: admin | moderator | user)
  loading,             // boolean — true while checking auth state
  signInWithGoogle,    // () => Promise<void> — triggers Google OAuth PKCE flow
  signInWithLinkedIn,  // () => Promise<void> — triggers LinkedIn OAuth PKCE flow
  signOut,             // () => Promise<void> — clears session, redirects to /
  isAdmin,             // boolean — shortcut for userRole.role === 'admin'
  isModerator,         // boolean — shortcut for userRole.role === 'moderator'
} = useAuth();
```

---

## Edge Function Auth

All 14 edge functions verify JWT before processing:

| Step | Action |
|------|--------|
| 1 | Extract `Authorization: Bearer <JWT>` header from request |
| 2 | Call `verifyAuth(req)` from `_shared/auth.ts` |
| 3 | Decode user ID, fetch profile + org from database |
| 4 | Return `AuthContext` with: `user`, `orgId`, `startupId`, authenticated `supabase` client |
| 5 | All subsequent DB queries use RLS-enabled client (service role only for system operations) |
| 6 | Missing/invalid JWT → return `401 Unauthorized` |

---

## Database Tables (Auth-Related)

**`profiles`** — User profile data (auto-created on sign-up)

```
id                    uuid PK (= auth.users.id)
email                 text NOT NULL
full_name             text
avatar_url            text
org_id                uuid FK → organizations.id
role                  text              -- display role/title
preferences           jsonb             -- { theme, notifications, sidebar_collapsed, compact_mode }
onboarding_completed  boolean           -- gates access to dashboard
last_active_at        timestamptz
created_at            timestamptz
updated_at            timestamptz
```

**`user_roles`** — App-level RBAC

```
id              uuid PK
user_id         uuid FK NOT NULL → auth.users.id
role            enum NOT NULL     -- admin, moderator, user
created_at      timestamptz NOT NULL
```

**`organizations`** — Multi-tenant orgs

```
id                    uuid PK
name                  text NOT NULL
slug                  text NOT NULL UNIQUE
logo_url              text
settings              jsonb
subscription_tier     text    -- free, pro, enterprise
subscription_status   text    -- active, cancelled, past_due
created_at            timestamptz
updated_at            timestamptz
```

**`org_members`** — Org membership

```
id              uuid PK
user_id         uuid FK NOT NULL → auth.users.id
org_id          uuid FK NOT NULL → organizations.id
role            text              -- admin, member, viewer
invited_by      uuid FK
invited_email   text
joined_at       timestamptz
status          text              -- active, invited, removed
created_at      timestamptz
```

---

## Acceptance Criteria

- Google and LinkedIn OAuth work end-to-end (PKCE flow)
- "Get Started" and "Start Your Profile" buttons navigate to `/login` — no unauthenticated access to app routes
- New users always see onboarding wizard before dashboard
- Returning users skip onboarding and land on `/dashboard`
- Session persists across page reloads via localStorage
- Session auto-refreshes before JWT expiry
- Sign out clears all local data and redirects to `/`
- AuthCallback handles OAuth errors with user-friendly messages and 10-second timeout
- RLS prevents cross-org data access at database level
- Edge functions always verify JWT before processing (401 on missing/invalid token)
- Admin role can manage org members; user role cannot
- All 13+ app routes are wrapped in `<ProtectedRoute>`
- Login page redirects to `/dashboard` if user is already authenticated
- Avatar dropdown menu shows Dashboard, Settings, and Sign Out options
