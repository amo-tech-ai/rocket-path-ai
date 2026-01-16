# Core Prompt 04 — Wizard Screen Design

**Purpose:** Define the luxury, premium startup wizard screen with wireframe, content, data, features, and AI agent interactions  
**Focus:** Three-step wizard screen specification for core MVP phase  
**Status:** Core Foundation

---

## Screen Purpose

**Structured Startup Context Capture**

The wizard is the founder's first interaction with StartupAI after signup. It transforms raw founder input into a structured, intelligent startup profile using AI assistance. The experience must feel premium, sophisticated, and intelligent while remaining simple and guided.

---

## Visual Design

### Luxury Premium Aesthetic

**Sophisticated Wizard Design**
- Clean, focused single-step interface
- Beautiful progress indicator showing journey
- Premium form design with thoughtful spacing
- Elegant typography and clear hierarchy
- Polished animations between steps

**Intelligent AI Integration**
- Seamless AI extraction in background
- Elegant suggestion display in right panel
- Clear visual distinction between manual and AI input
- Smooth transitions when AI suggestions appear
- Professional loading states

---

## Wireframe Structure

### Left Panel: Progress & Context

**Step Progress Indicator**
- Visual progress bar showing current step
- Step numbers (1 of 3, 2 of 3, 3 of 3)
- Step names clearly labeled
- Completed steps visually distinct
- Upcoming steps shown but inactive

**Current Step Context**
- Current step name and description
- What information is being collected
- Why this information matters
- Estimated time to complete

**Navigation Controls**
- Back button (disabled on step 1)
- Progress percentage indicator
- Save and continue later option

### Main Panel: Current Step Form

**Step 1: Profile & Business**
- Company name input field
- Website URL input field with autofill button
- Company description textarea
- Industry selection dropdown
- Key features/products multi-input field
- Continue button

**Step 2: Traction & Funding**
- Monthly Recurring Revenue input
- Number of users/customers input
- Growth rate percentage input
- Currently raising toggle
- Target raise amount input
- Currency selection
- Continue button

**Step 3: Review & Generate**
- Summary of all entered information
- Editable review sections
- AI-generated readiness summary
- Generated tasks preview
- Complete setup button

### Right Panel: AI Intelligence

**AI Extraction Status**
- Loading state during extraction
- Success state with extracted data
- Error state with manual entry option
- Progress indicator for extraction

**Extracted Suggestions**
- Company name suggestion
- Description suggestion
- Industry suggestion
- Features suggestion
- Apply all button
- Apply individual field buttons

**Step Guidance**
- Helpful tips for current step
- Examples of good input
- Common mistakes to avoid
- Next step preview

---

## Screen Content

### Data Sources

**Step 1 Data**
- User input: Company name, URL, description, industry, features
- AI extraction: ProfileExtractor agent extracts from URL
- Storage: wizard_sessions table, wizard_extractions table

**Step 2 Data**
- User input: MRR, users, growth rate, funding details
- Storage: wizard_sessions table, startups table traction_data field

**Step 3 Data**
- Aggregated data from steps 1 and 2
- AI generation: TaskGenerator agent creates onboarding tasks
- Storage: startups table, tasks table

**AI Panel Data**
- ProfileExtractor agent output (Step 1)
- TaskGenerator agent output (Step 3)
- Real-time extraction status
- Suggestion acceptance tracking

---

## Features

### Interactive Elements

**URL Autofill**
- User pastes company URL
- Clicks "Autofill" button
- AI extraction begins
- Loading state shown
- Suggestions appear in right panel
- User reviews and applies suggestions

**Form Fields**
- Clean, accessible input fields
- Real-time validation
- Helpful error messages
- Auto-save to wizard_sessions
- Resume capability

**Progress Navigation**
- Visual progress bar
- Step-by-step advancement
- Back navigation with data preservation
- Save and continue later option

**AI Suggestions**
- Field-by-field suggestions
- Apply all suggestions button
- Apply individual field buttons
- Manual override always available
- Clear visual distinction

### Data Visualization

**Progress Indicator**
- Visual progress bar
- Step completion checkmarks
- Current step highlight
- Percentage completion
- Estimated time remaining

**Extraction Status**
- Loading animation
- Success confirmation
- Error handling
- Retry option
- Manual entry fallback

---

## AI Agents Utilized

### ProfileExtractor Agent

**Model:** gemini-3-flash-preview  
**Gemini Features:** Structured Output, URL Context  
**Edge Function:** ai-helper → wizard_extract_startup

**Interactions on Screen:**
- User enters company URL in Step 1
- User clicks "Autofill" button
- System calls ProfileExtractor with URL
- Agent uses URL Context tool to analyze website
- Agent returns structured JSON with extracted data
- System displays suggestions in right panel
- User reviews and applies suggestions to form

**Display Location:**
- Right panel during Step 1
- Extracted suggestions section
- Field-by-field suggestions
- Apply buttons for each field

**User Flow:**
1. User pastes URL and clicks Autofill
2. Loading state appears in right panel
3. AI extraction completes (under 5 seconds)
4. Suggestions appear in right panel
5. User reviews each suggestion
6. User applies suggestions to form fields
7. User can edit any field manually
8. User continues to next step

### TaskGenerator Agent

**Model:** gemini-3-flash-preview  
**Gemini Features:** Structured Output  
**Edge Function:** ai-helper → wizard_generate_tasks

**Interactions on Screen:**
- User completes Step 3 review
- User clicks "Complete Setup" button
- System calls TaskGenerator with startup profile
- Agent generates five prioritized onboarding tasks
- System displays task preview in Step 3
- System creates tasks in database
- User sees tasks on dashboard after wizard

**Display Location:**
- Step 3 main panel
- Task preview section
- Generated tasks list
- Task details and priorities

**User Flow:**
1. User reviews all wizard data in Step 3
2. User clicks "Complete Setup"
3. System saves startup to database
4. System calls TaskGenerator agent
5. Tasks generated and displayed
6. Tasks saved to tasks table
7. User redirected to dashboard
8. Dashboard shows new startup and tasks

---

## User Journey

### Complete Wizard Flow

**Step 1: Profile & Business**
1. User sees Step 1 form
2. User enters company name manually OR
3. User pastes URL and clicks Autofill
4. AI extraction happens in background
5. Suggestions appear in right panel
6. User reviews and applies suggestions
7. User fills remaining fields
8. User clicks Continue

**Step 2: Traction & Funding**
1. User sees Step 2 form
2. User enters traction metrics
3. User enters funding information
4. User clicks Continue
5. Data auto-saved to wizard_sessions

**Step 3: Review & Generate**
1. User sees summary of all data
2. User can edit any section
3. User clicks "Complete Setup"
4. System saves startup to database
5. AI generates onboarding tasks
6. Tasks displayed in preview
7. User redirected to dashboard

### Resume Flow

**Incomplete Wizard**
1. User returns to wizard
2. System loads saved data from wizard_sessions
3. User continues from last step
4. All previous data preserved
5. User completes remaining steps

---

## Workflows

### URL Extraction Workflow

**Trigger:** User clicks "Autofill" button with URL entered

**Steps:**
1. Validate URL format
2. Show loading state in right panel
3. Call ai-helper edge function with URL
4. ProfileExtractor agent uses URL Context tool
5. Agent analyzes website content
6. Agent returns structured JSON
7. Display suggestions in right panel
8. User reviews and applies suggestions

**Data Flow:**
- Frontend → Edge Function → Gemini API (URL Context)
- Gemini API → Edge Function → Structured JSON
- Edge Function → Frontend → Right Panel Display

### Wizard Completion Workflow

**Trigger:** User clicks "Complete Setup" in Step 3

**Steps:**
1. Validate all required fields
2. Save startup to startups table
3. Call TaskGenerator agent
4. Generate five onboarding tasks
5. Save tasks to tasks table
6. Display task preview
7. Redirect to dashboard

**Data Flow:**
- Frontend → Supabase → startups table
- Frontend → Edge Function → Gemini API
- Gemini API → Edge Function → Task JSON
- Edge Function → Supabase → tasks table
- Frontend → Dashboard → Display tasks

### Auto-Save Workflow

**Trigger:** User enters data in any form field

**Steps:**
1. Debounce input (500ms)
2. Save to wizard_sessions table
3. Update progress percentage
4. Show subtle save indicator
5. Enable resume capability

**Data Flow:**
- Frontend → Supabase → wizard_sessions table
- Supabase → Frontend → Progress Update

---

## Frontend Backend Wiring

### Frontend Components

**Wizard Page Component**
- Three-panel layout container
- Step progress indicator component
- Step form components (Step 1, 2, 3)
- AI panel component
- Navigation controls

**Data Management**
- React Query for wizard session data
- Local state for form inputs
- Auto-save to Supabase
- Resume from saved state

**AI Integration**
- Edge function service for ProfileExtractor
- Edge function service for TaskGenerator
- Loading states for AI calls
- Error handling for AI failures

### Backend Integration

**Supabase Tables**
- wizard_sessions: Stores wizard progress
- wizard_extractions: Stores AI extraction results
- startups: Stores completed startup profile
- tasks: Stores generated onboarding tasks

**Edge Functions**
- ai-helper: Handles ProfileExtractor and TaskGenerator
- Receives wizard data as input
- Calls Gemini API with appropriate tools
- Returns structured JSON responses

**Data Flow Pattern**
- Frontend → Supabase → wizard_sessions (auto-save)
- Frontend → Edge Function → Gemini API (extraction)
- Gemini API → Edge Function → Frontend (suggestions)
- Frontend → Supabase → startups + tasks (completion)

---

## Best Practices

### User Experience

**Clear Guidance**
- Helpful placeholder text
- Example inputs shown
- Step-by-step instructions
- Progress transparency

**Error Handling**
- Graceful AI extraction failures
- Manual entry always available
- Clear error messages
- Recovery options provided

**Performance**
- Fast AI extraction (under 5 seconds)
- Optimistic UI updates
- Smooth step transitions
- Efficient auto-save

### AI Integration

**Transparency**
- Clear indication when AI is working
- Show AI reasoning when available
- User control over AI suggestions
- Manual override always possible

**Reliability**
- Fallback to manual entry
- Retry failed extractions
- Cache successful extractions
- Validate AI output before display

---

## Summary

The wizard screen provides a luxury, premium, sophisticated, intelligent experience that transforms founder input into structured startup data. The seamless AI integration, beautiful form design, and clear progress indication create a guided experience that feels both powerful and approachable.

**Key Elements:**
- Three-step progressive wizard
- ProfileExtractor agent for URL extraction
- TaskGenerator agent for onboarding tasks
- Auto-save and resume capability
- Beautiful progress indicators
- Intelligent AI suggestions in right panel
- Seamless Supabase and edge function integration
