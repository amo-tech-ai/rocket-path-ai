# Prompt 04 — Navigation & Routing

> **Phase:** Foundation | **Priority:** P0 | **Overall:** 85%
> **No code — route map, nav structure, and navigation behavior only**

---

## Route Map

| Path | Page | Auth | Layout | Left Nav Label |
|------|------|------|--------|----------------|
| `/` | Landing / Marketing | Public | MarketingLayout | — |
| `/auth` | Login / Sign Up | Public | Minimal | — |
| `/onboarding` | 4-Step Wizard | Protected | WizardLayout (no nav) | — |
| `/dashboard` | Main Dashboard | Protected | DashboardLayout | Dashboard |
| `/crm` | CRM Contacts | Protected | DashboardLayout | CRM |
| `/crm/pipeline` | Deal Pipeline | Protected | DashboardLayout | CRM (sub) |
| `/investors` | Investor Discovery | Protected | DashboardLayout | Investors |
| `/investors/pipeline` | Investor Pipeline | Protected | DashboardLayout | Investors (sub) |
| `/projects` | Projects List | Protected | DashboardLayout | Projects |
| `/projects/:id` | Project Detail | Protected | DashboardLayout | Projects |
| `/projects/:id/tasks` | Tasks Board | Protected | DashboardLayout | Projects |
| `/documents` | Document Library | Protected | DashboardLayout | Documents |
| `/documents/:id` | Document Detail | Protected | DashboardLayout | Documents |
| `/lean-canvas` | Canvas Editor | Protected | DashboardLayout | Lean Canvas |
| `/pitch-decks` | Deck List | Protected | DashboardLayout | Pitch Deck |
| `/pitch-decks/new` | Deck Wizard | Protected | DashboardLayout | Pitch Deck |
| `/pitch-decks/:id` | Deck Editor | Protected | DashboardLayout | Pitch Deck |
| `/events` | Events Directory | Protected | DashboardLayout | Events |
| `/events/mine` | My Events | Protected | DashboardLayout | Events (sub) |
| `/events/:id` | Event Detail | Protected | DashboardLayout | Events |
| `/ai-chat` | AI Chat | Protected | DashboardLayout | AI Chat |
| `/settings` | Settings (4 tabs) | Protected | DashboardLayout | Settings |

---

## Left Navigation Sidebar

### Structure

| Order | Icon | Label | Route | Badge |
|-------|------|-------|-------|-------|
| 1 | LayoutDashboard | Dashboard | `/dashboard` | — |
| 2 | Users | CRM | `/crm` | Contact count |
| 3 | TrendingUp | Investors | `/investors` | — |
| 4 | FolderKanban | Projects | `/projects` | Pending tasks count |
| 5 | FileText | Documents | `/documents` | — |
| 6 | Grid3X3 | Lean Canvas | `/lean-canvas` | — |
| 7 | Presentation | Pitch Deck | `/pitch-decks` | — |
| 8 | Calendar | Events | `/events` | Upcoming count |
| 9 | MessageSquare | AI Chat | `/ai-chat` | — |
| — | separator | — | — | — |
| 10 | Settings | Settings | `/settings` | — |
| 11 | LogOut | Sign Out | (action) | — |

### Active State

- Active item: sage background (`bg-primary/10`), primary text, bold font
- Hover: subtle background (`bg-muted`), smooth transition
- Icons: Lucide React, 20px, stroke 1.5

### Bottom Section

- Startup health progress bar (sage fill)
- Percentage label: "42% Ready"
- User avatar + name + role below separator

---

## Protected Route Behavior

| Scenario | Behavior |
|----------|----------|
| Not authenticated | Redirect to `/auth` with return URL |
| Authenticated, no onboarding | Redirect to `/onboarding` |
| Authenticated, onboarding complete | Allow access to dashboard routes |
| Invalid route | Show 404 page with "Back to Dashboard" link |

---

## Navigation Patterns

### Breadcrumbs

- Show on detail pages: `Projects / Launch MVP / Tasks`
- Click parent to navigate back
- Current page is plain text (not clickable)

### Page Transitions

- Fade in on route change (200ms, Framer Motion)
- No full-page reloads — React Router client-side navigation
- Scroll to top on route change

### Deep Linking

- All routes are bookmarkable
- Share links work (no session-dependent state in URL)
- Query params for filters: `/crm?type=investor&sort=score`

### Cross-Module Navigation

| From | To | Trigger |
|------|-----|---------|
| Lean Canvas | Pitch Deck | "Generate Pitch Deck from Canvas" button |
| Dashboard | Any module | Click KPI card or activity item |
| CRM Contact | Deals | Click linked deal in contact detail |
| AI Chat | Any module | "Go to [module]" action from chat |
| Investor | CRM | "Add as Contact" button |

---

## Acceptance Criteria

- All routes are protected except landing and auth pages
- Left nav highlights active route
- Breadcrumbs show on all detail/nested pages
- 404 page exists for invalid routes
- New users always redirect to onboarding before dashboard
- Cross-module links preserve context (no data loss on navigate)
