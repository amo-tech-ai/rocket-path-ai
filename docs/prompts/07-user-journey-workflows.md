# Core Prompt 07 — User Journey and Workflows

**Purpose:** Define complete user journeys, workflow patterns, and automation logic for core MVP  
**Focus:** End-to-end user flows, workflow triggers, approval gates, best practices  
**Status:** Core Foundation

---

## Primary User Journey

### Complete Onboarding Journey

**Journey:** Signup → Wizard → Dashboard → Tasks

**Step 1: Signup**
- User visits landing page
- User clicks "Get Started" or "Sign Up"
- User sees signup form
- User enters email and password
- User submits form
- System creates account in Supabase Auth
- System creates profile in profiles table
- System creates organization in organizations table
- User redirected to wizard

**Step 2: Wizard Step 1**
- User sees wizard Step 1 form
- User enters company name OR pastes URL
- If URL entered, user clicks "Autofill"
- ProfileExtractor agent extracts data
- Suggestions appear in right panel
- User reviews and applies suggestions
- User fills remaining fields
- User clicks Continue

**Step 3: Wizard Step 2**
- User sees traction and funding form
- User enters MRR, users, growth metrics
- User enters funding information
- Data auto-saved to wizard_sessions
- User clicks Continue

**Step 4: Wizard Step 3**
- User sees summary of all data
- User can edit any section
- User clicks "Complete Setup"
- System saves startup to startups table
- TaskGenerator agent generates tasks
- Five tasks created in tasks table
- User sees task preview
- User redirected to dashboard

**Step 5: Dashboard**
- User lands on dashboard
- System fetches startup data
- System fetches tasks
- RiskAnalyzer agent analyzes data
- Dashboard displays KPIs, tasks, insights
- User reviews AI suggestions
- User takes actions on priorities

---

## Workflow Patterns

### Manual Trigger Workflows

**Wizard → Tasks Workflow**
- Trigger: User completes wizard
- Action: TaskGenerator generates tasks
- Output: Five onboarding tasks created
- Approval: User sees preview before redirect

**Dashboard Load → Risk Analysis Workflow**
- Trigger: User opens dashboard
- Action: RiskAnalyzer analyzes startup
- Output: Risk insights in right panel
- Approval: Informational only, no auto-actions

### User-Initiated Workflows

**URL Extraction Workflow**
- Trigger: User clicks "Autofill" button
- Action: ProfileExtractor extracts from URL
- Output: Suggestions in right panel
- Approval: User applies each suggestion

**Task Completion Workflow**
- Trigger: User marks task complete
- Action: Task status updated in database
- Output: Task marked complete, list updates
- Approval: User action required

---

## Approval Gates

### AI Suggestion Approval

**Pattern:** AI Proposes → User Reviews → User Approves → System Executes

**ProfileExtractor Approval**
- AI extracts data from URL
- Suggestions displayed in right panel
- User reviews each field suggestion
- User clicks "Apply" for each field
- Data populated in form
- User can edit any field manually

**RiskAnalyzer Approval**
- AI identifies risks from data
- Risks displayed in right panel
- User reviews risk descriptions
- User acknowledges risks
- User decides on mitigation actions
- No automatic task creation

**TaskGenerator Approval**
- AI generates tasks on wizard completion
- Tasks displayed in preview
- User sees task list before redirect
- User can edit tasks after creation
- User controls task execution

### Data Modification Approval

**Pattern:** User Edits → Validation → Save → Confirmation

**Wizard Data Changes**
- User edits any wizard field
- Auto-save after 500ms debounce
- Progress updated automatically
- Resume capability enabled

**Task Status Changes**
- User marks task complete
- Status updated immediately
- Optimistic UI update
- Database sync in background

---

## Automation Logic

### Auto-Save Logic

**Wizard Auto-Save**
- Trigger: User input in any wizard field
- Debounce: 500 milliseconds
- Action: Save to wizard_sessions table
- Result: Progress preserved, resume enabled

**Form Auto-Save**
- Trigger: User input in form fields
- Debounce: 500 milliseconds
- Action: Save to appropriate table
- Result: Data preserved on refresh

### Real-Time Updates

**Dashboard Real-Time**
- Trigger: Data changes in Supabase
- Action: Real-time subscription updates UI
- Result: Live data without refresh
- Scope: Tasks, projects, deals

**Task List Real-Time**
- Trigger: New task created or updated
- Action: Task list updates automatically
- Result: Immediate visibility of changes
- Scope: All tasks for user's organization

### Background Processing

**AI Analysis on Load**
- Trigger: Dashboard page load
- Action: RiskAnalyzer called in background
- Result: Insights appear when ready
- User Experience: Non-blocking, progressive

**Task Generation on Completion**
- Trigger: Wizard completion
- Action: TaskGenerator called
- Result: Tasks created and displayed
- User Experience: Preview before redirect

---

## Workflow Best Practices

### User Control

**Human in the Loop**
- All AI outputs require user approval
- No automatic data modifications
- User can override any AI suggestion
- Clear visual distinction between AI and user content

**Transparency**
- AI reasoning visible in right panel
- Source citations for extracted data
- Confidence levels shown
- Error states clearly communicated

### Error Handling

**Graceful Degradation**
- AI failures fall back to manual entry
- Network errors show retry options
- Validation errors provide guidance
- System errors show recovery paths

**User Feedback**
- Loading states for all async operations
- Success confirmations for actions
- Error messages with solutions
- Progress indicators for long operations

### Performance

**Optimization**
- Fast AI response times (under 5 seconds)
- Efficient database queries
- Optimistic UI updates
- Smart caching strategies

**User Experience**
- Smooth transitions between states
- Non-blocking background operations
- Instant feedback for user actions
- Progressive enhancement

---

## User Journey Variations

### Returning User Journey

**Resume Wizard**
- User returns to incomplete wizard
- System loads saved data from wizard_sessions
- User continues from last step
- All previous data preserved
- User completes remaining steps

**Daily Dashboard Routine**
- User opens dashboard
- System loads latest data
- AI analyzes current state
- User reviews priorities
- User takes actions
- User navigates to detail screens

### Error Recovery Journey

**AI Extraction Failure**
- User clicks "Autofill" with URL
- AI extraction fails or times out
- System shows error message
- User sees "Manual Entry" option
- User fills form manually
- User continues to next step

**Network Error Recovery**
- User action triggers API call
- Network request fails
- System shows error message
- User sees "Retry" button
- User retries or uses offline mode
- System recovers when connection restored

---

## Workflow Integration Points

### Supabase Integration

**Database Triggers**
- Profile creation on signup
- Organization creation on signup
- Task creation on wizard completion
- Real-time updates on data changes

**RLS Enforcement**
- All queries filtered by org_id
- Cross-org access prevented
- User data isolation guaranteed
- Secure multi-tenant architecture

### Edge Function Integration

**AI Gateway**
- Single ai-helper function for all agents
- Route-based agent selection
- Consistent request/response format
- Centralized error handling

**Cost Tracking**
- All AI calls logged to ai_runs table
- Token usage tracked
- Cost calculated per call
- Usage monitoring enabled

---

## Summary

The user journey and workflows create a smooth, intelligent experience that guides founders from signup through daily execution. The approval gates ensure user control, the automation logic reduces friction, and the error handling provides reliability.

**Key Principles:**
- Clear user journey from signup to dashboard
- AI suggests, user approves pattern
- Manual triggers for Phase 1
- Real-time updates for live data
- Graceful error handling
- Performance optimization
- User control at all gates
- Transparent AI reasoning
