# 106-1 - Validator Flow Prompt (Lovable)

> Complete design specification for the StartupAI Validator chat-to-results experience

---

## Overview

Create a conversational validator experience where users describe their startup idea in chat, watch a brief processing animation, then land on a complete validation dashboard with pre-filled results at `/startup-validator-v3`. The system uses AI agents to analyze the idea, research market data, score viability, and generate actionable recommendations.

---

## User Journey

### The Complete Path

**Step 1: Entry Point**
User clicks "Validate My Idea" from dashboard or navigation menu. They arrive at a welcoming chat interface.

**Step 2: Conversation**
AI coach greets user and asks about their startup idea. User describes their concept in natural language. Coach may ask 1-2 follow-up questions to clarify problem, customer, or solution.

**Step 3: Processing**
After user confirms their description is complete, a 4-phase animation plays showing the AI analyzing, researching, and scoring their idea.

**Step 4: Results**
User lands on the validator dashboard with all sections pre-filled. They see their overall score, verdict, and detailed breakdown across 7 dimensions.

**Step 5: Actions**
User can explore results, edit sections, generate a pitch deck, export PDF, or share a link with advisors or co-founders.

---

## Real-World Example Journey

### Sarah's Validation Experience

**Context:** Sarah has an idea for an AI-powered inventory management tool for small restaurants.

**Chat Interaction:**
- Coach: "Welcome! Tell me about your startup idea. What problem are you solving and for whom?"
- Sarah: "I want to build an AI tool that helps small restaurants predict their food inventory needs so they waste less and never run out of popular items."
- Coach: "Interesting! Who specifically would use this - the restaurant owner, kitchen manager, or someone else?"
- Sarah: "Mainly kitchen managers at restaurants doing $500K-2M annual revenue. They spend hours manually tracking inventory."
- Coach: "Got it. One more question - do these restaurants currently use any software for this, or is it all manual?"
- Sarah: "Most use spreadsheets or pen and paper. Some have basic POS systems but nothing smart."
- Coach: "Perfect, I have everything I need. Ready to analyze your idea?"
- Sarah clicks "Validate Now"

**Animation Plays:**
- "Analyzing your idea..." (shows brain icon)
- "Researching restaurant tech market..." (shows chart icon)
- "Calculating validation scores..." (shows progress bars)
- "Your validation report is ready!" (shows checkmark)

**Dashboard Results:**
- Startup Name: "RestockAI" (AI-suggested from description)
- Overall Score: 72/100
- Verdict: "Worth Pursuing" (green badge)
- Problem Score: 85/100 - "Clear pain point with measurable cost"
- Market Score: 68/100 - "Growing segment, fragmented competition"
- Solution Score: 74/100 - "Differentiated approach, execution risk medium"
- Business Model: 65/100 - "SaaS model viable, needs pricing validation"

**Sarah's Actions:**
- Expands "Competition" section to see similar products
- Clicks "Generate Pitch Deck" to create investor slides
- Shares link with her co-founder for feedback

---

## Wireframe Screens

### Screen 1: Chat Validator Input

**Header Area**
- Logo in top left corner
- "Idea Validator" title centered
- Close or back button in top right

**Chat Area (Main Content)**
- Full height scrollable message container
- AI messages appear on left with coach avatar
- User messages appear on right in brand color bubbles
- Typing indicator shows when AI is preparing response
- Timestamp shown beneath each message group

**Input Area (Fixed Bottom)**
- Large text input spanning most of width
- Placeholder text: "Describe your startup idea..."
- Send button with arrow icon on right side
- Voice input microphone icon (optional)
- Character count showing "0/500 recommended"

**Suggestion Chips (Above Input)**
- Quick prompt examples appear before user types
- "AI tool for small business"
- "Marketplace connecting X and Y"
- "SaaS platform for industry"
- Chips disappear once user starts typing

---

### Screen 2: Processing Animation

**Full Screen Overlay**
- Dark semi-transparent background
- Centered white card container

**Animation Container**
- Circular progress indicator in center
- Phase icon rotates or pulses
- Phase text appears below icon
- Progress dots or bar at bottom showing 4 phases

**Phase Content Rotation:**
1. Brain icon with "Analyzing your idea..."
2. Chart icon with "Researching market data..."
3. Calculator icon with "Calculating validation scores..."
4. Checkmark icon with "Your validation report is ready!"

**Timing**
- Each phase displays for approximately 1 second
- Smooth crossfade between phases
- Final phase triggers navigation after 0.5 seconds

---

### Screen 3: Validator Dashboard

**Header Bar**
- Back arrow to return to chat or dashboard
- Startup name as main title (extracted from description)
- Overall score badge showing number and color
- Verdict label in colored pill
- Action buttons: Share, Export, Edit

**Score Summary Strip**
- Horizontal bar below header
- Shows 7 dimension scores as mini progress bars
- Each labeled with dimension name
- Tapping any bar scrolls to that section

**Main Content Area (Scrollable)**

**Section 1: Executive Summary Card**
- Large verdict display with icon
- 3-sentence summary of the analysis
- Key strength highlighted in green
- Key risk highlighted in amber or red
- "What this means" explanation paragraph

**Section 2: Problem Analysis Card**
- Problem clarity score with progress bar
- Pain point severity indicator
- Frequency assessment (daily, weekly, monthly)
- Urgency level (critical, important, nice-to-have)
- Customer quote or pain description
- Expandable detailed breakdown

**Section 3: Market Opportunity Card**
- TAM/SAM/SOM visual (nested circles or funnel)
- TAM number with "Total Addressable Market" label
- SAM number with "Serviceable Addressable Market" label
- SOM number with "Serviceable Obtainable Market" label
- Market growth rate indicator
- Industry trend summary
- Expandable methodology explanation

**Section 4: Solution Assessment Card**
- Solution fit score with progress bar
- Unique value proposition summary
- Key differentiators as bullet list
- Technical feasibility assessment
- "10x better" factor evaluation
- Expandable competitive comparison

**Section 5: Competition Card**
- Number of direct competitors identified
- Competition intensity indicator (low, medium, high)
- Top 3 competitors with brief descriptions
- Your differentiation summary
- Market positioning statement
- Expandable full competitor list

**Section 6: Business Model Card**
- Revenue model type identified
- Unit economics summary
- Pricing strategy suggestion
- Scalability assessment
- Path to profitability indicator
- Expandable financial assumptions

**Section 7: Risk Assessment Card**
- Top 3 risks as warning cards
- Each risk shows severity and likelihood
- Mitigation suggestion for each
- Overall risk level indicator
- Expandable full risk matrix

**Section 8: Recommendations Card**
- Next 3 actions as numbered steps
- Each action has clear outcome
- Timeframe suggestion for each
- Priority indicator (do first, do next, do later)
- "Start with this" highlight on top action

**Action Bar (Fixed Bottom)**
- "Deep Dive" button for extended analysis
- "Generate Pitch Deck" button
- "Export PDF" button
- "Share Link" button

---

### Screen 4: Section Detail View (Modal or Slide-in)

**Header**
- Section title
- Score for this section
- Close button

**Content**
- Full detailed analysis for selected section
- Supporting data and sources
- Benchmark comparisons
- Edit capability for user refinement
- "AI Confidence" indicator showing certainty level

**Footer**
- "Got it" button to close
- "Ask Coach" button to discuss this section

---

### Screen 5: Share Modal

**Header**
- "Share Your Validation" title
- Close button

**Content**
- Shareable link with copy button
- Privacy options (public, anyone with link, specific emails)
- Email input for sending directly
- Social sharing buttons
- QR code for easy sharing

**Footer**
- "Copy Link" primary button
- "Send Email" secondary button

---

### Screen 6: Export Modal

**Header**
- "Export Report" title
- Close button

**Content**
- Format options: PDF, Notion, Google Docs
- Include/exclude section checkboxes
- Branding options (with logo, without logo)
- Preview thumbnail

**Footer**
- "Download" primary button
- "Open in app" secondary button for Notion/Docs

---

## Content Features

### Chat Content

**Welcome Message**
"Hi! I'm your validation coach. Tell me about your startup idea - what problem are you solving and who are you solving it for?"

**Follow-up Questions (AI selects 1-2 based on missing info)**
- "Who specifically experiences this problem?"
- "How are people currently solving this?"
- "What makes your solution different?"
- "How would customers pay for this?"
- "Have you talked to potential customers yet?"

**Confirmation Message**
"Great, I have a clear picture of your idea. Ready to run the validation analysis? This will take about 30 seconds."

**Processing Started Message**
"Analyzing now... I'm researching your market, checking competition, and calculating viability scores."

### Dashboard Content

**Verdicts**
- "Worth Pursuing" (score 70-100): "Your idea shows strong potential. Focus on the recommendations below to strengthen your position."
- "Needs Work" (score 40-69): "Your idea has promise but needs refinement. Address the red flags before investing significant resources."
- "High Risk" (score 0-39): "This idea faces significant challenges. Consider a pivot or deeper validation before proceeding."

**Section Summaries (AI-generated, example patterns)**

Problem Analysis:
"Your target customers face [problem] on a [frequency] basis. This costs them approximately [time/money]. The pain is [severity level] because [reason]."

Market Opportunity:
"The [industry] market is valued at [TAM] and growing at [rate]% annually. Your addressable segment represents [SAM], with a realistic first-year target of [SOM]."

Solution Assessment:
"Your solution offers [key differentiator] which [competitor type] don't provide. The technical approach is [feasibility level] with [timeline estimate] to MVP."

**Confidence Indicators**
- High Confidence: "Based on verified industry data"
- Medium Confidence: "Based on comparable market analysis"
- Low Confidence: "Limited data available, estimates extrapolated"

---

## Data Model

### Data Captured from Chat

**User Input Data**
- Problem description (text from user messages)
- Customer segment (extracted from conversation)
- Current solutions mentioned
- Differentiators described
- Revenue model if mentioned
- Team background if mentioned

**AI Extracted Data**
- Startup name (suggested from description)
- Industry category
- Business model type
- Target customer persona
- Key pain points
- Proposed solution summary

### Validation Results Data

**Scores (0-100 scale)**
- Overall validation score
- Problem clarity score
- Market opportunity score
- Solution strength score
- Competition position score
- Business model viability score
- Team fit score (if applicable)
- Timing score

**Market Data**
- TAM (Total Addressable Market) in dollars
- SAM (Serviceable Addressable Market) in dollars
- SOM (Serviceable Obtainable Market) in dollars
- Market growth rate percentage
- Industry trend direction

**Qualitative Data**
- Verdict (worth_pursuing, needs_work, high_risk)
- Executive summary (3 sentences)
- Key strength (1 sentence)
- Key risk (1 sentence)
- Top 3 recommendations (action items)
- Top 3 risks with mitigations
- Competitor list with descriptions

**Metadata**
- Validation session identifier
- Created timestamp
- Last updated timestamp
- User identifier
- Startup/project identifier
- Share link token (if shared)

### Data Persistence

**Chat Session Data**
- Session identifier links to validation
- Message history preserved
- Can resume or reference later

**Validation Report Data**
- Stored as single record with nested sections
- Versions tracked if user re-runs validation
- Edit history if user modifies sections

**User Actions Data**
- Export events tracked
- Share events tracked
- Section expansions tracked (for analytics)

---

## AI Agents

### Agent 1: Chat Coach Agent

**Purpose:** Guide the user through describing their idea and extract key information

**Capabilities:**
- Natural conversation about startup ideas
- Asking clarifying follow-up questions
- Recognizing when enough information is gathered
- Extracting structured data from unstructured chat
- Suggesting a startup name from the description

**Behavior:**
- Friendly, encouraging tone
- Asks one question at a time
- Acknowledges user responses before asking more
- Limits to 2-3 follow-up questions maximum
- Confirms readiness before triggering validation

### Agent 2: Idea Analyzer Agent

**Purpose:** Parse the chat conversation and extract structured idea components

**Capabilities:**
- Identifying problem statement from text
- Extracting customer segment
- Recognizing solution approach
- Detecting mentioned competitors or alternatives
- Categorizing industry and business model type

**Behavior:**
- Works behind the scenes (not user-facing)
- Runs during processing animation Phase 1
- Outputs structured data for other agents

### Agent 3: Market Research Agent

**Purpose:** Find relevant market data and benchmarks for the idea

**Capabilities:**
- Estimating TAM/SAM/SOM for the identified market
- Finding market growth rates
- Identifying industry trends
- Pulling relevant benchmarks from knowledge base
- Citing sources for market claims

**Behavior:**
- Searches knowledge base for industry statistics
- Uses embedding similarity to find relevant data
- Applies industry-specific benchmarks
- Runs during processing animation Phase 2

### Agent 4: Competition Analyzer Agent

**Purpose:** Identify and assess competitive landscape

**Capabilities:**
- Finding direct competitors
- Identifying indirect alternatives
- Assessing competition intensity
- Evaluating differentiation strength
- Suggesting positioning strategy

**Behavior:**
- Searches competitor database
- Compares startup description to known companies
- Rates competitive threat level
- Runs during processing animation Phase 2

### Agent 5: Validation Scorer Agent

**Purpose:** Calculate dimension scores and overall validation score

**Capabilities:**
- Scoring each of 7 dimensions (0-100)
- Weighing dimensions for overall score
- Determining verdict based on thresholds
- Identifying key strengths and risks
- Generating recommendations

**Behavior:**
- Takes inputs from all other agents
- Applies scoring rubrics per dimension
- Uses benchmarks for calibration
- Runs during processing animation Phase 3

### Agent 6: Report Generator Agent

**Purpose:** Create human-readable summaries and explanations

**Capabilities:**
- Writing executive summary
- Generating section narratives
- Creating actionable recommendations
- Explaining scores in plain language
- Formatting data for display

**Behavior:**
- Takes structured data from scorer
- Generates natural language content
- Maintains consistent tone
- Runs during processing animation Phase 4

---

## Workflows and Logic

### Workflow 1: Chat to Validation

**Trigger:** User clicks "Validate Now" in chat

**Steps:**
1. Chat coach agent confirms user is ready
2. System captures all chat messages
3. Display processing animation
4. Idea analyzer agent extracts structured data
5. Market research agent finds relevant statistics
6. Competition analyzer agent identifies competitors
7. Validation scorer agent calculates scores
8. Report generator agent creates narratives
9. System saves validation results to database
10. Navigate user to validator dashboard

**Duration:** 3-4 seconds (animation pacing)

**Error Handling:**
- If extraction fails: Show error, offer retry with prompts
- If market data unavailable: Use fallback estimates, flag confidence
- If scoring fails: Show partial results, highlight gaps

### Workflow 2: Edit and Re-score

**Trigger:** User edits a section on dashboard

**Steps:**
1. User modifies content in editable field
2. System detects change
3. Show "Recalculate" button
4. User clicks recalculate
5. Only affected scores update
6. Dashboard refreshes with new values

**Duration:** 1-2 seconds

### Workflow 3: Generate Pitch Deck

**Trigger:** User clicks "Generate Pitch Deck"

**Steps:**
1. Show "Creating your deck..." modal
2. Pitch deck agent takes validation data
3. Maps validation sections to slide types
4. Generates content for each slide
5. Creates deck record in database
6. Navigate to pitch deck editor
7. Deck appears with pre-filled slides

**Duration:** 5-10 seconds

### Workflow 4: Export PDF

**Trigger:** User clicks "Export PDF"

**Steps:**
1. Show export options modal
2. User selects format and sections
3. System generates PDF document
4. Download starts automatically
5. Toast notification confirms completion

**Duration:** 2-3 seconds

### Workflow 5: Share Link

**Trigger:** User clicks "Share Link"

**Steps:**
1. Show share modal
2. System generates unique share token
3. Creates public-accessible version
4. Copy link to clipboard
5. Optional: Send via email

**Duration:** Instant for link generation

---

## Functions and Tools

### Frontend Functions

**Chat Functions**
- sendMessage: Submit user message to chat
- receiveMessage: Display AI response in chat
- showTypingIndicator: Show AI is preparing response
- extractSuggestions: Display prompt suggestion chips
- triggerValidation: Start the validation process

**Animation Functions**
- startProcessingAnimation: Begin 4-phase animation
- advancePhase: Move to next animation phase
- completeAnimation: Finish and trigger navigation
- showProgress: Update progress indicators

**Dashboard Functions**
- loadValidationResults: Fetch and display data
- expandSection: Show detailed view of section
- collapseSection: Hide detailed view
- editSection: Enable editing mode
- saveEdit: Persist user changes
- recalculateScores: Trigger re-scoring after edit

**Export Functions**
- generateShareLink: Create shareable URL
- copyToClipboard: Copy link for sharing
- downloadPDF: Generate and download report
- openExportModal: Show export options

**Navigation Functions**
- navigateToDashboard: Go to validator results
- navigateToChat: Return to conversation
- navigateToPitchDeck: Go to generated deck

### Backend Tools

**AI Tools**
- analyzeIdea: Extract structure from chat text
- searchKnowledge: Query vector database for benchmarks
- findCompetitors: Search competitor database
- calculateScore: Apply scoring rubric
- generateNarrative: Create human-readable text

**Database Tools**
- saveValidation: Persist validation record
- updateValidation: Modify existing validation
- loadValidation: Retrieve validation data
- createShareToken: Generate unique share link
- logUserAction: Track analytics events

**Integration Tools**
- generateEmbedding: Create vector from text
- searchSimilar: Find similar items by embedding
- fetchBenchmark: Get industry benchmark data
- createPDF: Generate PDF document

---

## Database Schema

### Tables

**validation_sessions**
- Identifier for each validation run
- Links to user who created it
- Links to startup/project
- Status (in_progress, completed, failed)
- Created and updated timestamps

**validation_results**
- Links to validation session
- Overall score (0-100)
- Verdict (worth_pursuing, needs_work, high_risk)
- Dimension scores as structured data
- Market data (TAM, SAM, SOM, growth rate)
- Qualitative content (summaries, recommendations)
- Source citations

**validation_sections**
- Links to validation result
- Section type (problem, market, solution, etc.)
- Section score (0-100)
- Section content (narrative text)
- Editable flag
- User modifications if edited

**chat_sessions**
- Links to validation session
- Message history as structured data
- Extracted data from conversation
- Session duration

**share_links**
- Unique token for public access
- Links to validation result
- Privacy settings
- Expiration date if set
- View count for analytics

### Relationships

- User has many validation sessions
- Validation session has one validation result
- Validation result has many validation sections
- Validation session has one chat session
- Validation result may have many share links

### Security

- Users can only view their own validations
- Shared validations visible via share token
- Editing requires ownership
- Export requires authentication

---

## Edge Functions

### validation-agent

**Purpose:** Orchestrate the validation process

**Trigger:** Called when user initiates validation

**Inputs:**
- Chat session identifier
- User identifier
- Startup/project identifier

**Process:**
1. Load chat messages from session
2. Call idea analyzer to extract structure
3. Call market research for statistics
4. Call competition analyzer for landscape
5. Call scorer to calculate dimensions
6. Call generator for narratives
7. Save results to database
8. Return validation result identifier

**Outputs:**
- Validation result identifier
- Success or error status

### market-research-agent

**Purpose:** Find relevant market data

**Trigger:** Called by validation-agent

**Inputs:**
- Industry category
- Customer segment
- Business model type

**Process:**
1. Generate embedding from industry description
2. Search knowledge base for similar content
3. Extract TAM/SAM/SOM estimates
4. Find growth rate and trends
5. Compile source citations

**Outputs:**
- Market size estimates
- Growth data
- Trend summary
- Sources list

### competitor-agent

**Purpose:** Identify competitive landscape

**Trigger:** Called by validation-agent

**Inputs:**
- Solution description
- Industry category
- Target customer

**Process:**
1. Generate embedding from solution
2. Search competitor database
3. Rank by similarity
4. Assess threat level
5. Suggest differentiation

**Outputs:**
- Competitor list with details
- Competition intensity score
- Positioning recommendation

### score-calculator

**Purpose:** Calculate validation scores

**Trigger:** Called by validation-agent

**Inputs:**
- Extracted idea data
- Market research results
- Competition analysis
- Industry benchmarks

**Process:**
1. Score each dimension using rubric
2. Apply weights for overall score
3. Determine verdict from thresholds
4. Identify top strength and risk
5. Generate recommendations

**Outputs:**
- Dimension scores
- Overall score
- Verdict
- Strengths and risks
- Recommendations

### report-generator

**Purpose:** Create readable content

**Trigger:** Called by validation-agent

**Inputs:**
- All scores and data
- Template patterns

**Process:**
1. Generate executive summary
2. Write section narratives
3. Format recommendations
4. Explain scores in context
5. Add confidence indicators

**Outputs:**
- Executive summary text
- Section content
- Formatted recommendations

### share-link-creator

**Purpose:** Generate shareable validation link

**Trigger:** Called when user requests share

**Inputs:**
- Validation result identifier
- Privacy settings

**Process:**
1. Generate unique token
2. Create share record
3. Set permissions
4. Return shareable URL

**Outputs:**
- Share URL
- Token for tracking

---

## Frontend-Backend Wiring

### Chat to Validation Flow

**Frontend Action:** User clicks "Validate Now"

**API Call:** POST to /functions/v1/validation-agent
- Body: chat_session_id, user_id, startup_id

**Backend Process:** validation-agent orchestrates all sub-agents

**Response:** validation_result_id, status

**Frontend Update:** Navigate to /startup-validator-v3/{id}

### Load Dashboard Data

**Frontend Action:** Dashboard page loads

**API Call:** GET validation result by ID via Supabase client
- Query: validation_results with sections joined

**Backend Process:** Database query with row-level security

**Response:** Full validation data structure

**Frontend Update:** Populate all dashboard sections

### Edit Section

**Frontend Action:** User modifies section content

**API Call:** PATCH to validation_sections
- Body: section_id, new_content

**Backend Process:** Update section record

**Frontend Action:** User clicks "Recalculate"

**API Call:** POST to /functions/v1/score-calculator
- Body: validation_id, updated_data

**Backend Process:** Recalculate affected scores

**Response:** Updated scores

**Frontend Update:** Refresh score displays

### Generate Pitch Deck

**Frontend Action:** User clicks "Generate Pitch Deck"

**API Call:** POST to /functions/v1/pitch-deck-agent
- Body: validation_id, deck_options

**Backend Process:** Create deck from validation data

**Response:** pitch_deck_id

**Frontend Update:** Navigate to /pitch-deck/{id}

### Export PDF

**Frontend Action:** User clicks "Export PDF"

**API Call:** POST to /functions/v1/export-pdf
- Body: validation_id, export_options

**Backend Process:** Generate PDF document

**Response:** Download URL

**Frontend Update:** Trigger download

### Create Share Link

**Frontend Action:** User clicks "Share Link"

**API Call:** POST to /functions/v1/share-link-creator
- Body: validation_id, privacy_settings

**Backend Process:** Generate token and record

**Response:** shareable_url

**Frontend Update:** Display URL with copy button

---

## Responsive Behavior

### Desktop (1200px and wider)
- Three-column layout for validator sections
- Sidebar visible with full navigation
- Animations play at full fidelity
- Hover states active on interactive elements

### Tablet (768px to 1199px)
- Two-column layout with third section flowing below
- Collapsible sidebar
- Reduced animation complexity
- Touch-friendly tap targets

### Mobile (below 768px)
- Single column with stacked sections
- Bottom sheet navigation pattern
- Simplified animations
- Touch-optimized input areas with larger tap targets
- Swipe gestures for section navigation

---

## Transitions and Micro-interactions

### Chat to Animation Transition
- Chat messages fade out smoothly over 300ms
- Animation container scales in from center of screen
- Background dims with subtle blur effect

### Animation to Dashboard Transition
- Animation shrinks toward dashboard header position
- Dashboard sections slide in from bottom with 100ms stagger
- Scores animate from 0 to final value over 500ms
- Staggered reveal creates visual interest

### Dashboard Interactions
- Cards lift on hover with shadow increase
- Expand buttons rotate 180 degrees on section toggle
- Score bars fill with easing animation
- Toast notifications slide in from bottom right
- Edit mode shows subtle pulsing border

---

## Empty States

### No Description Entered
- Placeholder illustration of person thinking
- Text: "Tell us about your startup idea to begin validation"
- Example prompt suggestions displayed as clickable chips

### Analysis Failed
- Friendly error illustration
- Text: "We couldn't analyze your idea. Please try again with more detail."
- Retry button prominently displayed
- Help link for troubleshooting

### No Market Data Found
- Informational illustration
- Text: "Limited market data available for this category"
- Shows estimates with low confidence indicator
- Suggestion to provide more industry context

---

## Accessibility Requirements

- All animations respect prefers-reduced-motion preference
- Color contrast meets WCAG AA standards minimum
- Interactive elements have visible focus states
- Score information available as text, not just visual bars
- Screen reader announcements for phase transitions during animation
- Keyboard navigation for all interactive elements
- Form inputs have proper labels and error messages

---

## Design Tokens

### Colors
- Primary: Brand blue for actions and highlights
- Success: Green for positive scores (70+)
- Warning: Amber for medium scores (40-69)
- Danger: Red for low scores (below 40)
- Neutral: Gray scale for text and backgrounds
- Background: Light gray or white for cards

### Typography
- Headlines: Bold weight, larger size for section titles
- Body: Regular weight for descriptions and summaries
- Data: Monospace or tabular numbers for scores
- Labels: Small caps or uppercase for section labels
- Captions: Smaller size for timestamps and metadata

### Spacing
- Consistent 8px base unit throughout
- Card padding: 24px
- Section gaps: 32px
- Touch targets: 44px minimum height
- Input fields: 48px height

### Shadows
- Cards: Subtle shadow for depth
- Hover: Increased shadow on interaction
- Modals: Stronger shadow for elevation
- Focus: Outline or ring for accessibility

---

## Success Criteria

- User understands their validation results within 10 seconds of landing on dashboard
- Overall score is immediately visible without scrolling
- All validator fields appear pre-populated with no empty states on successful analysis
- Transition from chat feels smooth and purposeful (under 4 seconds)
- Dashboard feels comprehensive but not overwhelming
- User can take action (share, export, generate deck) within 2 clicks
- Mobile experience maintains full functionality
- Accessibility requirements are met for all users
