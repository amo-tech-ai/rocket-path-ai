# Core Prompt 28 — Company Profile Dashboard Design

**Purpose:** Define the luxury, premium company profile dashboard with wireframe, content, data, features, and AI agent interactions  
**Focus:** Company/startup profile dashboard specification with 3-panel layout  
**Status:** Core Foundation

---

## Screen Purpose

**Source of Truth for Startup Data**

The company profile dashboard is the central data hub for all startup information. It serves as the foundation for Strategy Generator, Investor Matchmaker, and all other dashboards. This dashboard enables founders to manage company public information, business details, and provides AI-powered profile enhancement and completion tracking.

---

## Visual Design

### Luxury Premium Aesthetic

**Sophisticated Company Profile View**
- Clean, elegant company header with logo upload
- Premium typography with clear information hierarchy
- Refined color palette with subtle accents
- Polished micro-interactions and smooth transitions
- Professional profile completion visualization

**Intelligent Information Architecture**
- Most critical information prominently displayed
- Progressive disclosure of business details
- Contextual grouping of related information
- Clear visual flow from overview to details
- Smart defaults and AI-enhanced content

---

## Wireframe Structure

### 3-Panel Layout Logic

**Core Model: Context + Work + Intelligence**

**Left Panel = Context (240px)**
- WHERE AM I?
- Profile navigation sections
- Profile completion indicator
- Quick links to related dashboards
- Entity context explanation

**Main Panel = Work (Flexible width)**
- WHAT AM I DOING?
- Company profile form sections
- Company overview (logo, name, tagline, description)
- Business information (industry, model, segments, features)
- Social & web presence (website, LinkedIn, Twitter/X)
- Team, traction, and financial information

**Right Panel = Intelligence (320px)**
- HELP ME
- AI Profile Coach with data quality audit
- Profile strengths and opportunities
- Risk/gaps identification
- Auto-improve profile recommendations

---

## Left Panel: Context

### Profile Navigation

**Section Navigation:**
- **Overview** (Active) - Company basics and branding
- **Business** - Industry, model, segments, features
- **Traction** - Metrics, users, revenue, growth
- **Team** - Founders, key hires, team size
- **Financials** - Revenue streams, pricing, metrics
- **Fundraising** - Goals, stage, timeline, use of funds

### Profile Completion Indicator

**Completion Card:**
- Profile completion percentage (0-100%)
- Visual progress bar
- Missing fields list (by section)
- "Complete Profile" call-to-action when incomplete
- Breakdown by section (Overview, Business, Traction, etc.)

### Entity Context

**Context Box:**
- Explanation text: "A complete company profile serves as the bedrock for the Strategy Generator and Investor Matchmaker."
- Links to related features that use profile data
- System health indicator ("LIVE SYNC" status)

### Quick Links

**Related Dashboards:**
- "Dashboard" link → `/dashboard` (uses profile KPIs)
- "Projects" link → `/projects` (uses profile context)
- "Pitch Decks" link → `/pitch-decks` (generates from profile)
- "CRM" link → `/crm` (enriches contacts from profile)

---

## Main Panel: Work

### Page Header

**Header Section:**
- Page title: "Company Profile"
- Subtitle: "Manage your company's public information and business details"
- System status: "SYSTEM HEALTH • LIVE SYNC"
- "BACK TO DASHBOARD" button

### Company Overview Section

**Logo and Branding:**
- Logo upload area (building icon, "UPLOAD LOGO" placeholder)
- Image preview after upload
- Supported formats (JPG, PNG, SVG)
- Max file size (5MB)
- Logo displayed in dashboard and all company references

**Company Information:**
- Company Name (text input, required)
- Founded Year (number input, default: current year or from wizard)
- Tagline (text input, placeholder: "One-line value proposition...")
- Short Description (textarea, placeholder: "2-3 sentences about what your company does...")
- Headquarters Location (text input, default: "San Francisco, CA" or from wizard)
- Cover Image (image upload, optional)

### Business Information Section

**Industry and Model:**
- Industry (text input or dropdown, required, can be enriched from LinkedIn/website)
- Business Model (text input or dropdown, pre-filled: "SaaS", "Marketplace", "B2B", etc.)
- Target Market (text input, optional)

**Customer Segments:**
- Interactive tag input field
- Tags displayed as removable badges (e.g., "ENTERPRISE", "B2B", "SAAS")
- "+ ADD" button to add new segments
- Suggested segments based on industry

**Key Features:**
- Interactive tag input field
- Tags displayed as removable badges (e.g., "AI DASHBOARD", "STRATEGIC PLANNING")
- "+ ADD" button to add new features
- Suggested features based on business model

**Primary Differentiator:**
- Textarea (placeholder: "What makes your approach unique?")
- Character limit (500 characters)
- AI can suggest improvements

### Social & Web Presence Section

**Website URLs:**
- Website URL (url input with globe icon, required for AI enrichment)
  - Primary company website
  - Used by ProfileExtractor agent for automatic data extraction
  - Validated URL format
  - "Extract from Website" button triggers AI enrichment

**LinkedIn Profile:**
- LinkedIn Company Profile URL (url input with LinkedIn icon)
  - Company LinkedIn page URL
  - Validated LinkedIn URL format
  - "Connect LinkedIn" button for OAuth integration
  - "Sync from LinkedIn" button (if connected) to refresh data
  - Status indicator (Connected, Not Connected, Sync Available)

**Social Media:**
- Twitter / X Handle (text input with Twitter/X icon, optional)
- GitHub Repository (url input, optional)
- Additional URLs (url input array, optional - press releases, blog posts)

**Website List:**
- Multiple website URLs can be added
- List of all associated websites
- Each URL can trigger ProfileExtractor enrichment
- Priority indicator (primary, secondary, additional)

### Traction Section

**Metrics:**
- Monthly Recurring Revenue (MRR) (currency input, optional)
- Active Users (number input, optional)
- Paying Customers (number input, optional)
- Growth Rate (percentage input, optional)
- Launch Date (date input, optional)

**Visual Indicators:**
- Metric cards with trend arrows
- Growth percentage displays
- Timeline visualization

### Team Section

**Founders:**
- Founder cards with name, title, LinkedIn
- Add founder button
- Remove founder option
- Founder photos (avatars)

**Team Information:**
- Team Size (number input)
- Key Hires (tag input field)
- Team growth timeline

### Financials Section

**Revenue Information:**
- Revenue Streams (textarea, optional)
- Pricing Model (text input, optional)
- ARPU - Average Revenue Per User (currency input, optional)
- LTV - Lifetime Value (currency input, optional)
- CAC - Customer Acquisition Cost (currency input, optional)
- Gross Margin (percentage input, optional)

### Fundraising Section

**Funding Goals:**
- Fundraising Stage (dropdown: Pre-seed, Seed, Series A, etc.)
- Funding Goal Amount (currency input, optional)
- Timeline (text input, optional)
- Use of Funds (textarea or tag input, optional)

**Previous Rounds:**
- List of previous funding rounds
- Amount, date, investors for each round
- Add round button

---

## Right Panel: Intelligence

### AI Profile Coach Section

**Panel Header:**
- "INTELLIGENCE" title
- "AI PROFILE COACH" subtitle
- "DATA QUALITY AUDIT" status indicator

### Strengths Section

**Strengths Card (Green Border):**
- List of profile strengths identified by AI
- Examples:
  - "Tagline is concise and punchy."
  - "Industry categorization is accurate."
  - "Traction metrics are well-documented."
  - "Team information is complete."
- Dynamic updates as profile improves

### Risks / Gaps Section

**Risks Card (Yellow/Orange Border):**
- List of profile gaps and risks identified by AI
- Examples:
  - "LinkedIn presence is not linked." (High priority)
  - "Differentiator statement needs more bite."
  - "Traction metrics are missing."
  - "Website URL not provided for AI enrichment."
  - "Tagline could be more compelling."
- Priority indicators (High, Medium, Low)
- Click to navigate to relevant field

### Recommended Actions Section

**Auto-Improve Profile Button:**
- Large primary button: "AUTO-IMPROVE PROFILE"
- Description: "ENHANCES COPY, CLARITY, AND POSITIONING."
- Triggers AI profile enhancement workflow
- Shows loading state during processing
- Displays preview of improvements before applying

**Individual Field Recommendations:**
- Field-specific improvement suggestions
- "Improve Tagline" button → AI-generated alternatives
- "Enhance Description" button → AI-generated version
- "Refine Differentiator" button → AI-generated improvement
- User can approve or modify each suggestion

### Profile Completion Insights

**Completion Analysis:**
- Current completion percentage breakdown by section
- Overview: 80% complete
- Business: 65% complete
- Traction: 40% complete
- Team: 90% complete
- Visual progress bars per section

**Completion Impact:**
- "How completion affects AI accuracy" explanation
- "Profile completeness improves Strategy Generator recommendations"
- "Complete profiles get better Investor Matchmaker results"

---

## Screen Content

### Data Sources

**Company Profile Data:**
- Company information from `startups` table (primary source)
- Profile fields: `name`, `tagline`, `description`, `website`, `linkedin_url`, `industry`, `business_model`, `founded_year`, `headquarters`
- Business data: `traction_data` (JSONB - MRR, users, growth)
- Team data: `team_data` (JSONB - founders, team size)
- Financial data: `financial_data` (JSONB - revenue streams, pricing)
- Fundraising data: `fundraising_data` (JSONB - stage, goal, timeline)

**Enrichment Sources:**
- Website URL (ProfileExtractor agent uses URL Context tool)
- LinkedIn Company Profile (OAuth + API or URL Context tool)
- Additional URLs (press releases, blog posts)

**Calculated Metrics:**
- Profile completion percentage (calculated from filled required fields)
- Profile strength score (0-100, based on completeness and quality)
- Data quality audit results (from AI Profile Coach)

---

## Features

### Logo Upload

**Upload Functionality:**
- Click logo area to upload
- File upload dialog (JPG, PNG, SVG formats)
- Image preview with cropping tool
- Upload to Supabase Storage (company-logos bucket)
- Update logo URL in `startups` table
- Logo displayed across all dashboards

### Website and LinkedIn Connection

**Website URL:**
- Primary company website input
- URL validation (must start with https://)
- "Extract from Website" button
- Multiple websites can be added (list)
- Each website can trigger ProfileExtractor enrichment

**LinkedIn Company Profile:**
- LinkedIn company page URL input
- URL validation (must be LinkedIn company URL format)
- "Connect LinkedIn" button (OAuth flow if not connected)
- "Sync from LinkedIn" button (if OAuth connected)
- Status indicator (Connected, Not Connected, Sync Available)
- ProfileExtractor agent enriches from LinkedIn when synced

**Website List Management:**
- Add multiple websites
- Priority indicator (Primary, Secondary, Additional)
- "Extract" button for each website
- Remove website option
- Website list stored in `startups.website_urls` JSONB array or separate table

### Profile Enrichment

**Automatic Extraction:**
- Enter website URL and click "Extract from Website"
- ProfileExtractor agent uses URL Context tool to analyze website
- Extracts: company name, tagline, description, industry, features, differentiator
- Displays extracted data in right panel for review
- User approves or modifies before saving

**LinkedIn Sync:**
- Click "Sync from LinkedIn" button
- If not connected: OAuth flow to LinkedIn
- If connected: Direct sync from LinkedIn API
- ProfileExtractor agent enriches from LinkedIn URL
- Extracts: company description, industry, employee count, headquarters, recent posts
- Displays enriched data in right panel
- User reviews and approves

### AI Profile Coach

**Data Quality Audit:**
- Automatically analyzes profile on load and after updates
- Evaluates completeness (required vs filled fields)
- Assesses quality (tagline clarity, description depth, differentiator strength)
- Generates strengths list (what's good)
- Generates risks/gaps list (what needs improvement)

**Auto-Improve Profile:**
- Click "AUTO-IMPROVE PROFILE" button
- AI analyzes entire profile
- Generates improved versions of:
  - Tagline (multiple alternatives)
  - Short description (enhanced clarity and positioning)
  - Differentiator statement (more compelling and specific)
  - Industry categorization (if ambiguous)
- Displays improvements in right panel
- User reviews and applies selected improvements
- Batch apply all or individual field approval

### Inline Editing

**Form Field Editing:**
- Click field to edit inline
- Auto-save on blur or Enter key (optional, or explicit Save button)
- Validation on save (URL format, email format, required fields)
- Loading state during save
- Success toast notification
- Error handling with user-friendly messages

**Tag Management:**
- Customer Segments (add/remove tags)
- Key Features (add/remove tags)
- Key Hires (add/remove tags)
- Use of Funds (add/remove tags)
- Tag suggestions based on industry/business model

---

## AI Agents Utilized

### ProfileExtractor Agent

**Model:** gemini-2.5-flash-preview or gemini-3-pro-preview  
**Gemini Features:** Structured Output, URL Context  
**Edge Function:** ai-helper → wizard_extract_startup or enrich_company_profile

**Interactions on Screen:**
- Extracts company information from website URL when user clicks "Extract from Website"
- Enriches profile from LinkedIn URL when user clicks "Sync from LinkedIn"
- Uses URL Context tool to analyze website/LinkedIn pages
- Extracts structured data: name, tagline, description, industry, features, differentiator
- Displays extracted data in right panel for user review
- User approves or modifies before saving

**Display Location:**
- Right panel "AI Profile Coach" section during enrichment
- Extracted data preview with field-by-field approval
- Apply buttons for each field

**Enrichment Flow:**
1. User enters website URL or LinkedIn URL
2. User clicks "Extract" or "Sync" button
3. Loading state appears in right panel
4. ProfileExtractor agent analyzes URL using URL Context tool
5. Agent returns structured JSON with extracted data
6. System displays suggestions in right panel
7. User reviews each suggestion
8. User applies suggestions to form fields
9. User can edit any field manually
10. User saves profile

### ProfileEnhancer Agent

**Model:** gemini-3-pro-preview  
**Gemini Features:** Structured Output, Thinking Mode  
**Edge Function:** ai-helper → auto_improve_profile

**Interactions on Screen:**
- Analyzes profile completeness and quality when user clicks "AUTO-IMPROVE PROFILE"
- Evaluates tagline clarity, description depth, differentiator strength
- Generates improved versions of profile copy
- Provides field-by-field enhancements
- Updates profile strength score

**Display Location:**
- Right panel "Recommended Actions" section
- Field-specific improvement suggestions
- Batch improvement preview

**Enhancement Flow:**
1. User clicks "AUTO-IMPROVE PROFILE" button
2. Loading state appears: "Analyzing profile quality..."
3. ProfileEnhancer agent evaluates all profile fields
4. Agent generates improvements for tagline, description, differentiator
5. System displays improvements in right panel
6. User reviews improvements side-by-side (original vs improved)
7. User applies individual improvements or batch apply all
8. System saves improved profile
9. Profile strength score updates

### ProfileValidator Agent

**Model:** gemini-2.5-flash-preview  
**Gemini Features:** Structured Output  
**Edge Function:** ai-helper → validate_profile

**Interactions on Screen:**
- Continuously audits profile data quality in background
- Identifies strengths (what's good)
- Identifies risks/gaps (what needs improvement)
- Updates "Strengths" and "Risks / Gaps" cards in right panel
- Runs on profile load and after profile updates

**Display Location:**
- Right panel "Strengths" card (green border)
- Right panel "Risks / Gaps" card (yellow/orange border)

---

## User Journey

### Profile View Flow

**Step 1: Navigate to Company Profile**
- User clicks "Company Profile" link from navigation or Dashboard
- System navigates to `/company-profile`
- System fetches startup profile data from Supabase
- System displays profile with current information
- System calls ProfileValidator agent to audit quality

**Step 2: Review Profile Status**
- User reviews profile completion percentage in left panel
- User checks AI Profile Coach insights in right panel
- User reviews strengths and risks/gaps
- User identifies missing or incomplete fields

**Step 3: Add Missing Information**
- User enters website URL in Social & Web Presence section
- User clicks "Extract from Website" button
- ProfileExtractor agent extracts data from website
- System displays extracted data in right panel
- User reviews and applies suggestions
- User adds LinkedIn URL and clicks "Sync from LinkedIn"
- System enriches from LinkedIn (OAuth or URL)
- User completes other missing fields

**Step 4: Improve Profile Quality**
- User reviews "Risks / Gaps" in right panel
- User clicks "AUTO-IMPROVE PROFILE" button
- ProfileEnhancer agent generates improvements
- System displays improvements in right panel
- User reviews tagline alternatives
- User applies selected improvements
- System saves enhanced profile
- Profile strength score updates

---

## Workflows

### Website Extraction Workflow

**Trigger:** User clicks "Extract from Website" button with URL entered

**Steps:**
1. User enters website URL in Website URL field
2. System validates URL format
3. User clicks "Extract from Website" button
4. System calls ProfileExtractor agent with website URL
5. Agent uses URL Context tool to analyze website
6. Agent extracts structured data (name, tagline, description, industry, features)
7. System displays extracted data in right panel
8. User reviews each extracted field
9. User clicks "Apply" for individual fields or "Apply All"
10. System pre-fills form fields with approved data
11. User can edit any field manually
12. User saves profile
13. Profile completion percentage updates

**Data Flow:**
- Frontend → Edge Function → ProfileExtractor Agent → URL Context Tool → Gemini API
- Gemini API → ProfileExtractor Agent → Edge Function → Frontend → Right Panel
- Frontend → Supabase Client → Database (save profile)

### LinkedIn Sync Workflow

**Trigger:** User clicks "Sync from LinkedIn" or "Connect LinkedIn" button

**Steps:**
1. User enters LinkedIn company profile URL OR clicks "Connect LinkedIn"
2. If URL entered: System validates LinkedIn URL format
3. If OAuth: System redirects to LinkedIn OAuth
4. If OAuth: User authorizes LinkedIn access
5. If OAuth: System stores OAuth tokens in `auth.identities`
6. System calls ProfileExtractor agent with LinkedIn URL
7. Agent uses URL Context tool (or LinkedIn API if OAuth) to analyze profile
8. Agent extracts: company description, industry, employee count, headquarters, recent posts
9. System displays extracted data in right panel
10. User reviews and approves or modifies
11. System saves enriched data to profile
12. System updates LinkedIn connection status
13. Profile completion percentage updates

**Data Flow:**
- Frontend → LinkedIn OAuth → Supabase Auth (store tokens) OR
- Frontend → Edge Function → ProfileExtractor Agent → URL Context Tool → LinkedIn
- Edge Function → Frontend → Right Panel (preview)
- Frontend → Supabase Client → Database (save profile)

### Auto-Improve Profile Workflow

**Trigger:** User clicks "AUTO-IMPROVE PROFILE" button

**Steps:**
1. User clicks "AUTO-IMPROVE PROFILE" button
2. System shows loading state: "Analyzing profile quality..."
3. System calls ProfileEnhancer agent with current profile data
4. Agent analyzes tagline clarity, description depth, differentiator strength
5. Agent generates improved versions using Thinking Mode
6. System displays improvements in right panel
   - Original tagline → Improved tagline (option A, B, C)
   - Original description → Enhanced description
   - Original differentiator → Refined differentiator
7. User reviews improvements side-by-side
8. User selects preferred improvements
9. User clicks "Apply Selected" or individual "Apply" buttons
10. System updates form fields with improvements
11. User can further edit if needed
12. User saves profile
13. Profile strength score recalculates
14. System shows success notification

**Data Flow:**
- Frontend → Edge Function → ProfileEnhancer Agent → Gemini API (Thinking Mode)
- Gemini API → ProfileEnhancer Agent → Edge Function → Frontend → Right Panel
- Frontend → Supabase Client → Database (save profile)

### Profile Validation Workflow

**Trigger:** Profile loads or profile data changes

**Steps:**
1. System loads profile data from Supabase
2. System calculates completion percentage (required vs filled fields)
3. System calls ProfileValidator agent with profile data
4. Agent evaluates data quality (completeness, clarity, positioning)
5. Agent identifies strengths (what's good)
6. Agent identifies risks/gaps (what needs improvement)
7. System displays strengths in green-bordered card
8. System displays risks/gaps in yellow-bordered card
9. System updates completion percentage in left panel
10. System generates field-specific recommendations

**Data Flow:**
- Supabase → Frontend → Completion Calculator
- Frontend → Edge Function → ProfileValidator Agent → Gemini API
- Edge Function → Frontend → Right Panel (Strengths, Risks/Gaps)

---

## Dashboard System Integration

### Connection to Other Dashboards

**Company Profile → Dashboard:**
- Company name displayed in Dashboard greeting
- Profile KPIs (MRR, users, customers, team size) displayed in KPI bar
- Profile strength score displayed in Profile Strength card (when implemented)
- Company logo displayed in Dashboard header
- Company tagline used in Dashboard subtitle

**Company Profile → Projects:**
- Company context pre-fills project creation forms
- Project templates suggested based on company profile
- Project types aligned with business model
- Industry context used for project prioritization

**Company Profile → Tasks:**
- Task generation uses company profile as context
- TaskGenerator agent generates tasks based on profile stage
- Industry-specific task templates
- Fundraising-related tasks auto-generated when fundraising stage set

**Company Profile → CRM:**
- Company information enriches contact records
- Contact enrichment uses company profile as context
- Deal scoring considers company profile stage
- Investor matching uses company profile data

**Company Profile → Pitch Decks:**
- Pitch deck generation uses company profile as primary data source
- ProfileExtractor enriches pitch deck data from profile
- Deck templates matched to company stage and industry
- All deck slides pre-filled from profile data
- Profile changes sync to existing pitch decks (optional)

**Company Profile → Discovery:**
- Company profile used for prospect matching
- Industry and business model drive discovery recommendations
- Market size data (TAM, SAM, SOM) from profile influences matching

**Company Profile → GTM Strategy:**
- Company profile provides context for strategy generation
- Target customer segments from profile drive strategy recommendations
- Business model from profile determines strategy templates

**Dashboard → Company Profile:**
- Dashboard completion prompts link to Company Profile
- "Complete Profile" CTA in Dashboard AI panel
- Profile strength score displayed in Dashboard

**Wizard → Company Profile:**
- Startup Wizard data saves to Company Profile
- Wizard completion redirects to Company Profile for review
- Company Profile is enhanced version of Wizard data

**Settings → Company Profile:**
- Settings has "Startup Profile" tab that links to Company Profile
- Some profile fields editable in Settings
- Changes sync between Settings and Company Profile

---

## Frontend Backend Wiring

### Frontend Components

**Company Profile Page Component:**
- Main container with 3-panel layout
- Company header component (logo upload, name, tagline)
- Company overview form section (basic info)
- Business information form section (industry, model, segments)
- Social & web presence form section (website, LinkedIn, Twitter)
- Traction section (metrics, growth)
- Team section (founders, team size)
- Financials section (revenue, pricing, metrics)
- Fundraising section (goals, stage, timeline)
- Profile completion component (left panel)
- AI Profile Coach component (right panel)

**Data Fetching:**
- React Query for data management
- Supabase client for database queries (`startups` table, filtered by `org_id`)
- Edge function service for AI enrichment calls (ProfileExtractor, ProfileEnhancer, ProfileValidator)
- Real-time subscriptions for profile updates (if multi-user editing)

**State Management:**
- Local state for form editing and UI interactions
- React Query cache for startup profile data
- Context for startup data (shared across dashboards)
- Optimistic updates for profile changes

### Backend Integration

**Supabase Queries:**
- Select startup profile from `startups` table (filtered by `org_id` and `id`)
- Profile fields: `name`, `tagline`, `description`, `website`, `linkedin_url`, `industry`, `business_model`, `founded_year`, `headquarters`
- JSONB fields: `traction_data`, `team_data`, `financial_data`, `fundraising_data`
- Update profile record (PATCH with RLS enforcement)
- Store logo URL in `startups.logo_url` after upload to Storage

**Storage:**
- Company logos uploaded to Supabase Storage (`company-logos` bucket)
- Cover images uploaded to Supabase Storage (`company-covers` bucket)
- RLS policies ensure users can only upload/update their own company assets

**Edge Function Calls:**
- Call `ai-helper` function for ProfileExtractor agent
- Pass website URL or LinkedIn URL as context
- Use URL Context tool to analyze pages
- Receive structured JSON response with extracted data
- Parse and display in right panel for user approval

**AI Enrichment Flow:**
- Frontend → Edge Function Service → Supabase Edge Function
- Edge Function → ProfileExtractor Agent → URL Context Tool → Website/LinkedIn
- ProfileExtractor → Gemini API → Structured Response
- Edge Function → Frontend → Right Panel (preview)
- Frontend → Supabase Client → Database (save profile)

**Profile Validation Flow:**
- Frontend → Edge Function Service → Supabase Edge Function
- Edge Function → ProfileValidator Agent → Gemini API
- ProfileValidator analyzes profile completeness and quality
- Edge Function → Frontend → Right Panel (Strengths, Risks/Gaps)

**Profile Enhancement Flow:**
- Frontend → Edge Function Service → Supabase Edge Function
- Edge Function → ProfileEnhancer Agent → Gemini API (Thinking Mode)
- ProfileEnhancer generates improved versions of profile copy
- Edge Function → Frontend → Right Panel (improvements preview)
- Frontend → Supabase Client → Database (save enhanced profile)

**Data Flow Pattern:**
- Frontend → Supabase Client → Database (read/write profile)
- Frontend → Edge Function Service → Supabase Edge Function (AI calls)
- Edge Function → Gemini API → Structured Response (enrichment, validation, enhancement)
- Edge Function → Frontend → Right Panel (preview, suggestions)
- Frontend → Supabase Client → Database (save approved changes)

**Authentication & Authorization:**
- Profile data scoped to authenticated user's organization (`org_id`)
- RLS policies enforce users can only read/update their own organization's profile
- Logo/cover uploads scoped to organization
- LinkedIn OAuth tokens stored in `auth.identities` (if OAuth used)

---

## Summary

The company profile dashboard is the central data hub and source of truth for all startup information. The 3-panel layout (Context, Work, Intelligence) ensures clear navigation, efficient editing, and AI-powered profile enhancement. Integration with Dashboard, Projects, Tasks, CRM, Pitch Decks, and other dashboards creates a cohesive system where profile data enriches all features and AI-driven recommendations improve across the platform.

**Key Elements:**
- 3-panel layout (Context, Work, Intelligence)
- Company overview with logo upload and branding
- Business information with industry, model, segments, features
- Social & web presence with website list and LinkedIn connection
- Profile enrichment from website and LinkedIn (ProfileExtractor agent)
- AI Profile Coach with data quality audit (ProfileValidator agent)
- Auto-improve profile with copy enhancement (ProfileEnhancer agent)
- Profile completion tracking and recommendations
- Cross-dashboard integration (source of truth for all features)
- Seamless Supabase and edge function integration
