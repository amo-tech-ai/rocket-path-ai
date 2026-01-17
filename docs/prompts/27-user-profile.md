# Core Prompt 27 — User Profile Dashboard Design

**Purpose:** Define the luxury, premium user profile dashboard with wireframe, content, data, features, and AI agent interactions  
**Focus:** User profile dashboard specification with 3-panel layout  
**Status:** Core Foundation

---

## Screen Purpose

**Personal Identity Management**

The user profile dashboard enables founders to manage their personal account, professional identity, and preferences. It serves as the individual user's command center separate from the startup/company profile, providing account management, activity history, and AI-powered profile enhancement recommendations.

---

## Visual Design

### Luxury Premium Aesthetic

**Sophisticated Profile View**
- Clean, elegant profile header with large avatar
- Premium typography with clear information hierarchy
- Refined color palette with subtle accents
- Polished micro-interactions and smooth transitions
- Professional profile completion visualization

**Intelligent Information Architecture**
- Most important information prominently displayed
- Progressive disclosure of settings and preferences
- Contextual grouping of related items
- Clear visual flow from profile to preferences
- Smart defaults and personalized content

---

## Wireframe Structure

### 3-Panel Layout Logic

**Core Model: Context + Work + Intelligence**

**Left Panel = Context (240px)**
- WHERE AM I?
- Profile navigation tabs
- Profile completion indicator
- Quick links to related dashboards
- Account status badge

**Main Panel = Work (Flexible width)**
- WHAT AM I DOING?
- Profile information form
- Personal details (name, email, avatar)
- Professional information (role, LinkedIn, bio)
- Preferences (timezone, language, notifications)
- Activity history timeline

**Right Panel = Intelligence (320px)**
- HELP ME
- Profile completion recommendations
- AI suggestions for profile enhancement
- Activity insights and patterns
- Quick action suggestions

---

## Left Panel: Context

### Profile Navigation

**Tabs:**
- **Profile** (Active) - Personal information and details
- **Preferences** - Notification settings, timezone, language
- **Security** - Password, 2FA, API keys, connected accounts
- **Activity** - Recent activity history, login sessions

### Profile Completion Indicator

**Completion Card:**
- Profile completion percentage (0-100%)
- Visual progress bar
- Missing fields indicator
- "Complete Profile" call-to-action when incomplete

### Quick Links

**Related Dashboards:**
- "Company Profile" link → `/company-profile`
- "Settings" link → `/settings`
- "Dashboard" link → `/dashboard`

### Account Status

**Status Badge:**
- Account status (Active, Verified, Premium)
- Subscription tier (if applicable)
- Last login timestamp
- Account creation date

---

## Main Panel: Work

### Profile Header Section

**Avatar and Name:**
- Large profile avatar (circular, 120px)
- "Change Photo" button overlay
- Full name (editable inline)
- Job title and company (editable)
- Email address (read-only if OAuth, editable if email/password)

**Professional Links:**
- LinkedIn profile URL (with "Sync from LinkedIn" button)
- Twitter/X handle (optional)
- Personal website URL (optional)
- GitHub profile (optional)

### Personal Information Section

**Form Fields:**
- Full Name (text input, required)
- Email Address (email input, required, validated)
- Phone Number (tel input, optional)
- Timezone (dropdown select, default: browser detected)
- Language (dropdown select, default: English)

### Professional Information Section

**Form Fields:**
- Job Title (text input, optional)
- Company Name (text input, optional)
- LinkedIn URL (url input, optional, with validation)
- Twitter/X Handle (text input, optional)
- Personal Website (url input, optional)
- Bio (textarea, 500 character limit, optional)

### Preferences Section

**Notification Preferences:**
- Email notifications (toggle switch)
  - Deal updates
  - Task assignments
  - Project milestones
  - Mentions and comments
- Push notifications (toggle switch)
  - Urgent alerts
  - Meeting reminders
  - Daily digest
- Frequency settings (dropdown: Real-time, Daily, Weekly, Never)

### Activity History Section

**Recent Activity Timeline:**
- Recent login sessions (date, time, location, device)
- Profile updates (what changed, when)
- Connected account changes (LinkedIn connected, Google OAuth, etc.)
- Dashboard visits and key actions
- Export activity log (button)

---

## Right Panel: Intelligence

### Profile Completion Section

**Completion Status:**
- Current completion percentage (0-100%)
- Missing fields list (bullet points)
- Impact indicator (how completion affects AI accuracy)
- "Complete Profile" quick action button

**Completion Recommendations:**
- "Add LinkedIn profile to enable automatic enrichment"
- "Complete your bio to improve AI-generated suggestions"
- "Set timezone for accurate meeting scheduling"
- "Enable notifications for important updates"

### AI Suggestions Section

**Profile Enhancement Tips:**
- "Your profile is 65% complete. Adding a bio and LinkedIn would improve AI recommendations."
- "Last updated 30 days ago. Consider refreshing your professional information."
- "LinkedIn sync available. Click to import latest profile data."

**Activity Insights:**
- "You've been most active on Tuesdays and Thursdays"
- "You typically check Dashboard 3 times per day"
- "Your most-used features: Projects, Tasks, CRM"

### Quick Actions Section

**Context-Aware Actions:**
- "Sync from LinkedIn" button (if LinkedIn not connected)
- "Update Avatar" button
- "Review Activity" button → Activity tab
- "Security Settings" button → Security tab
- "Connect Google Account" button (if not connected)

---

## Screen Content

### Data Sources

**User Profile Data:**
- Personal information from `profiles` table (Supabase Auth)
- Email, full name, avatar URL from `auth.users` metadata
- Professional information from `profiles` table extensions
- Preferences from `user_preferences` table (if exists) or `profiles` JSONB field
- Activity history from `user_activity` table or `profiles.activity_log` JSONB

**Integration Data:**
- OAuth connections from `auth.identities` table
- LinkedIn profile data (if connected)
- Google account data (if connected)
- API keys from `api_keys` table (if exists)

**Calculated Metrics:**
- Profile completion percentage (calculated from filled fields)
- Activity frequency patterns (from activity log)
- Last activity timestamp (from login sessions)
- Account age (from created_at timestamp)

---

## Features

### Profile Management

**Avatar Upload:**
- Click avatar to change photo
- File upload (JPG, PNG, max 5MB)
- Image cropping tool
- Preview before save
- Upload to Supabase Storage
- Update avatar URL in profile

**Inline Editing:**
- Click field to edit inline
- Auto-save on blur or Enter key
- Validation on save (email format, URL format)
- Loading state during save
- Success toast notification
- Error handling with user-friendly messages

**LinkedIn Sync:**
- "Sync from LinkedIn" button
- OAuth flow redirect to LinkedIn
- Extract profile data using LinkedIn API or AI enrichment
- Pre-fill form fields with LinkedIn data
- User reviews and approves before save
- Manual override always available

### Security Features

**Password Management:**
- Change password form (old password, new password, confirm)
- Password strength indicator
- Two-factor authentication (2FA) toggle
- Recovery email verification

**Connected Accounts:**
- List of connected OAuth providers (Google, LinkedIn, GitHub)
- Status for each (Connected, Expired, Disconnected)
- "Connect" button for available providers
- "Disconnect" button with confirmation
- Last synced timestamp for each

**API Keys:**
- List of generated API keys
- Key prefix displayed (last 4 characters visible)
- Environment (Production, Test)
- Scopes/permissions listed
- Created date and last used date
- Revoke key button with confirmation
- Generate new key button

### Activity Tracking

**Activity Timeline:**
- Chronological list of user actions
- Recent logins (date, time, IP address, device)
- Profile updates (field changed, old value → new value)
- Dashboard visits and key actions
- Export activity log (CSV download)
- Filter by activity type
- Date range selector

---

## AI Agents Utilized

### ProfileEnricher Agent (Phase 1+)

**Model:** gemini-2.5-flash-preview  
**Gemini Features:** Structured Output, URL Context  
**Edge Function:** ai-helper → enrich_profile

**Interactions on Screen:**
- Extracts professional information from LinkedIn URL when user syncs
- Analyzes profile completeness and suggests missing fields
- Generates profile enhancement recommendations
- Updates profile completion score based on filled fields

**Display Location:**
- Right panel "Profile Completion" section
- Right panel "AI Suggestions" section
- Completion percentage indicator in left panel

### ActivityAnalyzer Agent (Phase 2+)

**Model:** gemini-2.5-flash-preview  
**Gemini Features:** Structured Output  
**Edge Function:** ai-helper → analyze_activity

**Interactions on Screen:**
- Analyzes activity patterns (most active days, times, features)
- Generates activity insights for right panel
- Identifies usage trends and recommendations
- Provides personalized suggestions based on behavior

**Display Location:**
- Right panel "Activity Insights" section

---

## User Journey

### Profile View Flow

**Step 1: Navigate to Profile**
- User clicks avatar or "Profile" link from navigation
- System navigates to `/profile`
- System fetches user profile data from Supabase
- System displays profile with current information

**Step 2: Review Profile**
- User reviews profile completion status in left panel
- User checks AI suggestions in right panel
- User reviews activity history in main panel

**Step 3: Edit Profile**
- User clicks "Edit" or clicks inline field
- User updates profile information
- System validates input (email format, URL format)
- User saves changes
- System updates profile in Supabase
- System refreshes completion score
- System updates right panel suggestions

**Step 4: Sync from LinkedIn**
- User clicks "Sync from LinkedIn" button
- System redirects to LinkedIn OAuth (if not connected)
- System receives LinkedIn profile data
- ProfileEnricher agent extracts structured data
- System displays extracted data in right panel for review
- User approves or modifies data
- System saves to profile
- System updates completion score

---

## Workflows

### Profile Update Workflow

**Trigger:** User edits and saves profile field

**Steps:**
1. User clicks field to edit or clicks "Edit Profile" button
2. System enables edit mode for field(s)
3. User enters new value
4. System validates input (client-side validation)
5. User clicks "Save" or field auto-saves on blur
6. System sends update to Supabase (PATCH `/profiles/:id`)
7. Supabase updates profile record
8. System recalculates completion percentage
9. System refreshes right panel AI suggestions
10. System shows success toast notification
11. Activity log records profile update

**Data Flow:**
- Frontend → Supabase Client → Database (profiles table)
- Frontend → Edge Function → ProfileEnricher Agent → Right Panel

### LinkedIn Sync Workflow

**Trigger:** User clicks "Sync from LinkedIn" button

**Steps:**
1. User clicks "Sync from LinkedIn" button
2. If not connected: System redirects to LinkedIn OAuth
3. User authorizes LinkedIn access
4. System receives LinkedIn OAuth tokens
5. System stores OAuth tokens in auth.identities
6. System calls ProfileEnricher agent with LinkedIn URL
7. Agent extracts profile data (name, title, company, bio, etc.)
8. System displays extracted data in right panel
9. User reviews and approves or modifies
10. System saves approved data to profile
11. System updates completion percentage
12. System shows success toast notification

**Data Flow:**
- Frontend → LinkedIn OAuth → Supabase Auth (store tokens)
- Frontend → Edge Function → ProfileEnricher Agent → LinkedIn API/URL Context
- Edge Function → Frontend → Right Panel (preview)
- Frontend → Supabase Client → Database (save profile)

### Profile Completion Workflow

**Trigger:** Profile data changes or screen loads

**Steps:**
1. System loads profile data from Supabase
2. System calculates completion percentage (required vs filled fields)
3. System identifies missing fields
4. System calls ProfileEnricher agent to generate recommendations
5. System displays completion percentage in left panel
6. System displays missing fields in right panel
7. System generates AI suggestions for improvement

**Data Flow:**
- Supabase → Frontend → Completion Calculator
- Frontend → Edge Function → ProfileEnricher Agent → Right Panel

---

## Dashboard System Integration

### Connection to Other Dashboards

**Profile → Dashboard:**
- User's first name displayed in Dashboard greeting ("Good morning, [firstName]")
- Profile avatar shown in navigation sidebar
- Profile completion status may influence Dashboard AI suggestions

**Profile → Company Profile:**
- User's role and company may pre-fill in Company Profile
- User can navigate from Profile to Company Profile via quick link
- Profile data enriches Company Profile team section

**Profile → CRM:**
- User's LinkedIn profile can be used for contact enrichment
- User's professional information helps match contacts
- Profile activity patterns may inform CRM automation

**Profile → Projects:**
- User's role determines project assignment capabilities
- Profile preferences (notifications) affect project update alerts
- Activity patterns may suggest project prioritization

**Profile → Tasks:**
- User's timezone affects task due date display
- Notification preferences control task assignment alerts
- Activity insights may inform task scheduling

**Profile → Settings:**
- Profile links to Settings for advanced configuration
- Settings has "Profile" tab that mirrors some Profile fields
- Changes sync between Profile and Settings

**Dashboard → Profile:**
- Dashboard greeting uses Profile first name
- Dashboard navigation avatar links to Profile
- Dashboard activity feeds into Profile activity history

**Company Profile → Profile:**
- User's role in Company Profile may update Profile job title
- Company Profile team member data links to user Profiles

**CRM → Profile:**
- Contact LinkedIn profiles may sync to user Profile
- Deal assignments may update Profile activity history

---

## Frontend Backend Wiring

### Frontend Components

**User Profile Page Component:**
- Main container with 3-panel layout
- Profile header component (avatar, name, links)
- Profile form component (personal info, professional info)
- Preferences component (notifications, timezone, language)
- Activity timeline component (recent actions, login sessions)
- Profile completion component (left panel)
- AI suggestions component (right panel)

**Data Fetching:**
- React Query for data management
- Supabase client for database queries (`profiles` table, `auth.users`)
- Edge function service for AI enrichment calls
- Real-time subscriptions for profile updates (if multi-user editing)

**State Management:**
- Local state for form editing and UI interactions
- React Query cache for profile data
- Context for user authentication and profile data
- Optimistic updates for profile changes

### Backend Integration

**Supabase Queries:**
- Select user profile from `profiles` table (filtered by `auth.uid()`)
- Select OAuth identities from `auth.identities` table
- Select activity log from `user_activity` table or `profiles.activity_log`
- Update profile record (PATCH with RLS enforcement)
- Insert activity log entries on profile changes

**Edge Function Calls:**
- Call `ai-helper` function for ProfileEnricher agent
- Pass LinkedIn URL or profile data as context
- Receive structured JSON response with enriched data
- Parse and display in right panel for user approval

**Data Flow Pattern:**
- Frontend → Supabase Client → Database (profiles table)
- Frontend → Edge Function Service → Supabase Edge Function
- Edge Function → Gemini API → Structured Response (ProfileEnricher)
- Edge Function → Frontend → Right Panel (preview)
- Frontend → Supabase Client → Database (save profile)

**Authentication:**
- Profile data scoped to authenticated user (`auth.uid()`)
- RLS policies enforce user can only read/update own profile
- OAuth tokens stored in `auth.identities` (Supabase Auth)
- API keys stored in `api_keys` table (if exists) with user_id foreign key

---

## Summary

The user profile dashboard provides founders with a premium, intelligent interface to manage their personal account and professional identity. The 3-panel layout (Context, Work, Intelligence) ensures clear navigation, efficient editing, and AI-powered profile enhancement. Integration with Dashboard, Company Profile, CRM, Projects, and Tasks creates a cohesive system where profile data enriches all dashboards and user preferences drive personalized experiences across the platform.

**Key Elements:**
- 3-panel layout (Context, Work, Intelligence)
- Profile completion tracking and recommendations
- LinkedIn sync with ProfileEnricher agent
- Activity history and insights
- Security features (password, 2FA, API keys)
- Cross-dashboard integration
- Seamless Supabase and edge function integration
