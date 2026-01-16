# Core Prompt 18 — Task Generation Workflow

**Purpose:** Define task generation workflow that creates prioritized onboarding tasks when wizard completes  
**Focus:** Wizard completion trigger, TaskGenerator agent integration, task creation workflow  
**Status:** Phase 2 MVP

---

## Workflow Purpose

**Automated Task Generation**

When a founder completes the startup wizard, TaskGenerator automatically creates five prioritized onboarding tasks. These tasks guide founders through initial setup, align with their startup stage and industry, and provide clear next actions.

---

## Workflow Overview

### Task Generation Trigger

**Trigger Event:** User completes wizard Step 3 and clicks "Complete Setup"

**Workflow Steps:**
1. User completes wizard Step 3
2. User reviews final summary
3. User clicks "Complete Setup" button
4. System validates all wizard data
5. System saves startup profile to database
6. System calls TaskGenerator agent automatically
7. Agent generates five prioritized tasks
8. Tasks created in database
9. User redirected to dashboard
10. Dashboard displays generated tasks

**Integration Point:** Wizard Step 3 - Review & Insights

---

## TaskGenerator Integration

### Agent Configuration

**AI Feature:** TaskGenerator agent  
**Model:** gemini-3-flash-preview  
**Gemini Features:** Structured Output  
**Edge Function:** ai-helper → wizard_generate_tasks

**Purpose:** Generate prioritized onboarding tasks based on startup profile

**Input:**
- Startup profile data (name, description, industry, stage)
- Traction data (if provided)
- Funding information (if provided)
- Industry context

**Output:**
- Five prioritized tasks
- Task titles and descriptions
- Priority levels (urgent, high, normal)
- Effort estimates (optional)
- Actionable guidance

---

## Task Generation Process

### Data Collection Phase

**Wizard Data Assembly:**
- Collect all data from wizard steps
- Compile startup profile information
- Include industry and stage data
- Add any traction or funding data
- Format data for agent input

**Context Preparation:**
- Structure data for AI processing
- Include relevant startup context
- Add industry-specific information
- Include stage-appropriate guidance
- Prepare for structured output

### Agent Call Phase

**Edge Function Call:**
- Call ai-helper with wizard_generate_tasks action
- Pass startup profile data as context
- Request structured task generation
- Wait for agent response

**Agent Processing:**
- Agent analyzes startup profile
- Agent considers industry and stage
- Agent generates relevant tasks
- Agent prioritizes tasks appropriately
- Agent returns structured JSON

**Response Processing:**
- Parse structured task response
- Validate task data format
- Extract task details
- Prepare for database insertion

### Task Creation Phase

**Database Insertion:**
- Create task records in tasks table
- Link tasks to startup and organization
- Set priority levels from agent
- Set initial status (pending)
- Store task descriptions

**Task Assignment:**
- Link tasks to user who completed wizard
- Assign to default project (if applicable)
- Set appropriate due dates
- Configure task metadata

**Notification:**
- Notify user of task generation
- Show task count in confirmation
- Provide link to view tasks
- Encourage task review

---

## Generated Task Structure

### Task Data Fields

**Required Fields:**
- Task title (clear, actionable)
- Task description (detailed guidance)
- Priority level (urgent, high, normal)
- Status (pending, assigned)
- Startup association

**Optional Fields:**
- Effort estimate (hours or days)
- Due date suggestion
- Category or tag
- Related resources
- Success criteria

### Task Prioritization

**Priority Levels:**
- Urgent: Critical, must do immediately
- High: Important, do soon
- Normal: Standard priority, do when possible

**Prioritization Logic:**
- Startup stage considerations
- Industry-specific priorities
- Immediate needs first
- Foundation-building tasks prioritized

### Task Alignment

**Stage Alignment:**
- Tasks match startup stage
- Pre-seed tasks for pre-seed startups
- Seed tasks for seed-stage startups
- Stage-appropriate guidance

**Industry Alignment:**
- Tasks relevant to industry
- Industry-specific best practices
- Sector-appropriate recommendations
- Tailored action items

---

## User Experience

### Wizard Completion Flow

**Step 1: Final Review**
- User reviews all wizard data in Step 3
- User verifies information accuracy
- User sees summary of captured data
- User ready to complete

**Step 2: Completion Action**
- User clicks "Complete Setup" button
- System shows processing state
- System indicates task generation in progress
- User waits for completion

**Step 3: Task Generation**
- System generates tasks automatically
- Processing takes under 3 seconds
- Tasks created in background
- User sees confirmation

**Step 4: Dashboard Redirect**
- User redirected to dashboard
- Dashboard displays generated tasks
- Tasks shown in priorities section
- User can start working immediately

### Task Display

**Dashboard Display:**
- Top 5 tasks shown in priorities card
- Tasks listed by priority
- Clear task titles and descriptions
- Easy to understand actions

**Tasks Page Display:**
- All generated tasks in task list
- Priority badges visible
- Full task details available
- Can edit or delete if needed

---

## Best Practices

### Task Quality

**Actionable Tasks:**
- Clear, specific task titles
- Detailed task descriptions
- Doable actions, not vague goals
- Appropriate for startup stage

**Relevant Tasks:**
- Aligned with startup industry
- Matched to startup stage
- Contextually appropriate
- Useful and practical

### User Experience

**Seamless Generation:**
- Automatic, no user action needed
- Fast generation (<3 seconds)
- Clear feedback during process
- Immediate availability after

**Task Control:**
- User can edit generated tasks
- User can delete if not relevant
- User can add own tasks
- User maintains full control

---

## Summary

The task generation workflow automatically creates five prioritized onboarding tasks when founders complete the wizard. TaskGenerator analyzes the startup profile to generate stage and industry-appropriate tasks that guide founders through initial setup. The seamless integration provides immediate value and clear next actions without requiring manual task creation.

**Key Elements:**
- Automatic task generation on wizard completion
- TaskGenerator agent integration
- Five prioritized onboarding tasks
- Stage and industry alignment
- Fast generation (<3 seconds)
- Dashboard task display
- User control over tasks
- Actionable task guidance
