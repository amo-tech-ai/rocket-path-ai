# Core Prompt 05 — AI Agents, Modules, and Workflows

**Purpose:** Define AI agents, modules, workflows, and automation logic for core MVP phase  
**Focus:** Agent interactions, workflow patterns, automation triggers, best practices  
**Status:** Core Foundation

---

## AI Agents Overview

### Core MVP Agents (Phase 1)

**Three AI Agents Active**

**ProfileExtractor**
- Extracts startup information from website URLs
- Uses URL Context tool to analyze web pages
- Returns structured JSON with company data
- Fast response time under 5 seconds

**RiskAnalyzer**
- Identifies risks from startup traction data
- Analyzes metrics, trends, and patterns
- Provides actionable risk mitigation suggestions
- Fast response time under 3 seconds

**TaskGenerator**
- Generates onboarding tasks for new startups
- Creates prioritized, actionable task list
- Aligns tasks with startup stage and industry
- Fast response time under 3 seconds

---

## Agent Modules

### ProfileExtractor Module

**Purpose**
Extract structured startup information from website URLs to accelerate wizard completion

**Input Module**
- Website URL from user input
- Optional LinkedIn URL or Twitter handle
- User context and preferences

**Processing Module**
- URL validation and sanitization
- Edge function call to ai-helper
- Gemini API call with URL Context tool
- Structured output parsing

**Output Module**
- Company name
- Company description
- Industry classification
- Key features and products
- Stage assessment
- Confidence scores per field

**Integration Points**
- Wizard Step 1 form
- Right panel suggestions display
- Apply to form functionality
- Manual override capability

### RiskAnalyzer Module

**Purpose**
Identify risks from startup data to provide proactive guidance and alerts

**Input Module**
- Startup traction data (MRR, users, growth)
- Task completion rates
- Deal pipeline status
- Historical trends

**Processing Module**
- Data aggregation and normalization
- Edge function call to ai-helper
- Gemini API analysis with structured output
- Risk scoring and prioritization

**Output Module**
- List of identified risks (max 5)
- Risk severity levels (high, medium, low)
- Suggested mitigation actions
- Explanation of risk reasoning
- Confidence levels

**Integration Points**
- Dashboard right panel
- Risk radar display
- Alert notifications
- Detailed risk analysis views

### TaskGenerator Module

**Purpose**
Generate actionable onboarding tasks to guide founders through initial setup

**Input Module**
- Startup profile data
- Industry context
- Profile completion percentage
- Current task status

**Processing Module**
- Context preparation and enrichment
- Edge function call to ai-helper
- Gemini API generation with structured output
- Task prioritization and validation

**Output Module**
- Five prioritized tasks
- Task titles and descriptions
- Priority levels for each task
- Estimated effort indicators
- Task dependencies

**Integration Points**
- Wizard Step 3 completion
- Dashboard task list
- Task management screen
- Task detail views

---

## Workflow Patterns

### Wizard Extraction Workflow

**Pattern:** User Input → AI Analysis → Suggestion Display → User Approval

**Steps:**
1. User enters company URL in wizard form
2. User clicks "Autofill" button
3. System validates URL format
4. System calls ProfileExtractor agent
5. Agent uses URL Context tool to analyze website
6. Agent returns structured extraction data
7. System displays suggestions in right panel
8. User reviews suggestions field by field
9. User applies suggestions to form
10. User can edit any field manually
11. User continues to next wizard step

**Approval Gates:**
- User must explicitly apply each suggestion
- User can override any AI suggestion
- No automatic form population
- User maintains full control

### Dashboard Analysis Workflow

**Pattern:** Data Load → AI Analysis → Insight Display → User Review

**Steps:**
1. User navigates to dashboard
2. System fetches startup data from Supabase
3. System calls RiskAnalyzer agent with data
4. Agent analyzes traction metrics and trends
5. Agent identifies risks and opportunities
6. Agent returns structured risk analysis
7. System displays insights in right panel
8. User reviews risk radar and suggestions
9. User acknowledges risks or takes actions
10. Dashboard updates with new state

**Approval Gates:**
- AI insights are informational only
- User decides on all actions
- No automatic task creation
- User controls workflow

### Task Generation Workflow

**Pattern:** Wizard Completion → AI Generation → Task Creation → Display

**Steps:**
1. User completes wizard Step 3
2. User clicks "Complete Setup" button
3. System saves startup to database
4. System calls TaskGenerator agent
5. Agent generates five onboarding tasks
6. Agent returns structured task list
7. System creates tasks in database
8. System displays task preview
9. User redirected to dashboard
10. Dashboard shows new tasks

**Approval Gates:**
- Tasks generated on wizard completion only
- User sees task preview before redirect
- User can edit tasks after creation
- User controls task execution

---

## Automation Logic

### Auto-Save Logic

**Trigger:** User input in wizard form fields

**Action:**
- Debounce input for 500 milliseconds
- Save form data to wizard_sessions table
- Update progress percentage
- Show subtle save confirmation
- Enable resume capability

**Data Flow:**
- Frontend → Supabase → wizard_sessions table
- Real-time progress tracking
- Session restoration on return

### Real-Time Updates

**Trigger:** Data changes in Supabase

**Action:**
- Subscribe to table changes
- Update UI automatically
- Refresh relevant components
- Maintain optimistic updates

**Data Flow:**
- Supabase → Real-time Subscription → Frontend
- Automatic UI synchronization
- Efficient update propagation

### AI Call Optimization

**Trigger:** User action requiring AI

**Action:**
- Debounce rapid requests
- Cache successful extractions
- Rate limit API calls
- Queue concurrent requests

**Data Flow:**
- Frontend → Request Queue → Edge Function
- Efficient API usage
- Cost optimization

---

## Gemini 3 Features Utilized

### Structured Output

**Purpose:** Guarantee consistent JSON responses from all agents

**Implementation:**
- All agents use responseMimeType: application/json
- JSON Schema defined for each agent
- Type-safe response parsing
- Validation before display

**Benefits:**
- Reliable data format
- Type safety
- Error prevention
- Consistent parsing

### URL Context Tool

**Purpose:** Analyze website content for ProfileExtractor

**Implementation:**
- ProfileExtractor uses URL Context tool
- Automatic website content retrieval
- Semantic analysis of page content
- Structured data extraction

**Benefits:**
- Accurate extraction
- Respects robots.txt
- Automatic caching
- Fast retrieval

### Fast Response Models

**Purpose:** Low latency for user-facing interactions

**Implementation:**
- All Phase 1 agents use gemini-3-flash-preview
- Sub-2 second response times
- Cost-effective for high-frequency calls
- Maintains quality output

**Benefits:**
- Fast user experience
- Low cost per call
- High throughput
- Reliable performance

---

## Claude SDK (Not Used in Phase 1)

### Phase 1 Strategy

**Gemini Only Approach**
- All agents use Gemini API
- No Claude SDK integration
- Simple, focused implementation
- Fast time to market

**Rationale:**
- Gemini Flash is fast and cost-effective
- Structured output meets all needs
- URL Context handles extraction
- No orchestration complexity needed

### Future Integration (Phase 3+)

**Hybrid Approach**
- Claude SDK for workflow orchestration
- Gemini for specialized tasks
- Best of both worlds
- Advanced automation

---

## Best Practices

### Agent Design

**Clear Purpose**
- Each agent has single, well-defined purpose
- Input and output clearly specified
- Constraints and limits documented
- Error handling defined

**User Control**
- AI suggests, user decides
- All outputs require approval
- Manual override always available
- Transparent reasoning

### Workflow Design

**Simple Patterns**
- Start with manual triggers
- Add automation gradually
- Validate patterns before automating
- User approval at key gates

**Error Handling**
- Graceful degradation
- Fallback to manual processes
- Clear error messages
- Recovery options

### Performance

**Optimization**
- Fast response times
- Efficient API usage
- Caching where appropriate
- Cost monitoring

**User Experience**
- Loading states for all AI calls
- Progress indicators
- Optimistic updates
- Clear feedback

---

## Summary

The AI agents, modules, and workflows create an intelligent system that assists founders without replacing their decision-making. The three core agents (ProfileExtractor, RiskAnalyzer, TaskGenerator) work together to provide value at key moments in the user journey, all powered by Gemini 3 with structured output and URL Context capabilities.

**Key Principles:**
- Three core agents for Phase 1
- Gemini 3 Flash for speed and cost
- Structured output for reliability
- URL Context for extraction
- User approval at all gates
- Simple, focused workflows
- Clear error handling
- Performance optimization
