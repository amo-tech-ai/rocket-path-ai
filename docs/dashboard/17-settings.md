# Prompt 17 — Settings Module

> **Phase:** Module | **Priority:** P2 | **Overall:** 60%
> **No code — screen specs, data sources, workflows only**
> **Reference:** `100-dashboard-system.md` Section 10

---

## Purpose

User and application configuration. Profile management, theme, notifications, account.

## Goals

- Profile management (avatar, name, timezone)
- Dark/light theme toggle
- Notification preferences
- Account management (password, deletion)

## Outcomes

Founders customize their experience and manage their account securely.

---

## 4 Tabs Layout

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │                 │
│                 │  Settings                                    │                 │
│                 │                                              │                 │
│                 │  [Profile] [Appearance] [Notifications] [Account]              │
│                 │                                              │                 │
│                 │  ─────────────────────────────────────────── │                 │
│                 │                                              │                 │
│                 │  [Tab content based on selection]            │                 │
│                 │                                              │                 │
│                 │                                              │                 │
│                 │                                              │                 │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Tab 1: Profile

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| Avatar | Image upload | Cloudinary | Crop to square, max 5MB |
| Display Name | Text input | `profiles.full_name` | Required |
| Email | Text (read-only) | `profiles.email` | From auth |
| Timezone | Dropdown | `profiles.timezone` | Auto-detect on first visit |
| Bio | Textarea | `profiles.bio` | Optional |
| Role | Text input | `profiles.role` | e.g., "Founder & CEO" |

---

## Tab 2: Appearance

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| Theme | Toggle | `profiles.preferences.theme` | Light / Dark / System |
| Font Size | Slider | `profiles.preferences.fontSize` | Small / Medium / Large |
| Density | Toggle | `profiles.preferences.density` | Comfortable / Compact |
| Sidebar | Toggle | `profiles.preferences.sidebarCollapsed` | Expanded / Collapsed default |

---

## Tab 3: Notifications

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| Weekly Digest | Toggle | `profiles.notification_preferences.weekly_digest` | Email summary |
| AI Insights | Toggle | `profiles.notification_preferences.ai_insights` | AI-generated alerts |
| Event Reminders | Toggle | `profiles.notification_preferences.event_reminders` | Upcoming events |
| Task Due Dates | Toggle | `profiles.notification_preferences.task_reminders` | Task deadlines |

---

## Tab 4: Account

| Action | Type | Notes |
|--------|------|-------|
| Change Password | Button | Only if email/password auth used |
| Linked Accounts | Display | Show Google, LinkedIn connection status |
| Export Data | Button | Download all user data as JSON |
| Delete Account | Button (destructive) | Requires typing "DELETE" to confirm |

---

## Data Sources

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | User profile data | full_name, email, avatar_url, timezone, preferences |
| `auth.users` | Authentication | email, providers |

---

## User Stories

- As a founder, I upload a profile photo and it displays across the app
- As a founder, I switch to dark mode and the app respects my preference
- As a founder, I turn off weekly digest but keep event reminders on
- As a founder, I can delete my account with confirmation

---

## Acceptance Criteria

- [ ] Avatar upload previews before saving, crops to square
- [ ] Theme toggle applies immediately without page reload
- [ ] Notification preferences persist to database
- [ ] Account deletion requires typing "DELETE" to confirm
- [ ] Settings page loads current values on mount
- [ ] All form changes trigger autosave with indicator

---

## Frontend Components

| Component | File | Status |
|-----------|------|--------|
| `Settings.tsx` | `src/pages/Settings.tsx` | ✅ Exists |
| `ProfileSettings.tsx` | `src/components/settings/ProfileSettings.tsx` | ✅ Exists |
| `StartupSettings.tsx` | `src/components/settings/StartupSettings.tsx` | ✅ Exists |
| `TeamSettings.tsx` | `src/components/settings/TeamSettings.tsx` | ✅ Exists |
| `AppearanceSettings.tsx` | — | ⬜ Not created |
| `NotificationSettings.tsx` | — | ⬜ Not created |
| `AccountSettings.tsx` | — | ⬜ Not created |

---

## Missing Work

1. **Appearance tab** — Theme toggle, font size, density
2. **Notifications tab** — Preference toggles
3. **Account tab** — Linked accounts, delete account
4. **Avatar upload** — Cloudinary integration with crop

---

## Implementation Priority

| Step | Task | Effort | Impact |
|------|------|--------|--------|
| 1 | Build Appearance tab with theme toggle | 2h | High |
| 2 | Add notification preferences | 1h | Medium |
| 3 | Implement account deletion flow | 2h | Medium |
| 4 | Add avatar upload with Cloudinary | 2h | Medium |
| 5 | Wire all settings to autosave | 1h | Low |
