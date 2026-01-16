# Core Prompt 10 — Tasks Screen Design

**Purpose:** Define the luxury, premium tasks management screen with wireframe, content, data, features, and AI agent interactions  
**Focus:** Tasks screen specification for core MVP phase  
**Status:** Core Foundation

---

## Screen Purpose

**Complete Task Management**

The tasks screen provides founders with a sophisticated, intelligent way to manage all their tasks with priority tracking, status management, and AI-powered task suggestions. This is the daily execution center where founders prioritize and complete work.

---

## Visual Design

### Luxury Premium Aesthetic

**Sophisticated Task Management**
- Clean, organized task list or table view
- Premium typography with clear hierarchy
- Elegant priority badges and status indicators
- Beautiful task cards with thoughtful spacing
- Polished animations for task completion

**Intelligent Organization**
- Smart filtering and sorting options
- Clear visual priority hierarchy
- Contextual task grouping
- Progress indicators for task completion
- Subtle animations for interactions

---

## Wireframe Structure

### Left Panel: Context & Filters

**Navigation**
- Current page: Tasks highlighted
- Navigation menu items
- Quick stats summary

**Task Filters**
- Filter by status (All, Pending, Completed)
- Filter by priority (All, Urgent, High, Normal)
- Filter by due date (All, Today, This Week, Overdue)
- Filter by project (All projects or specific project)
- Search input for task titles

**Quick Stats**
- Total tasks count
- Pending tasks count
- Completed tasks count
- Overdue tasks count

### Main Panel: Task List

**Task List Header**
- "Tasks" title
- "New Task" button
- View toggle (List / Grid)
- Bulk actions (when tasks selected)

**Task List Content**
- Task items in list or card format
- Each task shows: title, description, priority, due date, status, project
- Completion checkbox
- Edit and delete actions
- Drag handles for reordering (future)

**Task Item Display**
- Task title (prominent)
- Task description (secondary)
- Priority badge (color-coded)
- Due date indicator
- Status indicator
- Project badge (if linked)
- Actions menu (edit, delete)

**Empty State**
- "No tasks yet" message
- "Create your first task" button
- Helpful guidance text

### Right Panel: AI Intelligence

**Task AI Coach**
- Current focus message
- Task generation suggestions
- Priority reasoning
- Context-aware tips

**Task Statistics**
- Tasks by priority breakdown
- Tasks by status breakdown
- Completion rate
- Upcoming deadlines

**Suggested Actions**
- "Generate tasks" button
- "Prioritize with AI" button
- Quick task creation
- Context-aware recommendations

---

## Screen Content

### Data Sources

**Task Data**
- Tasks from tasks table
- Filtered by organization ID
- Sorted by priority and due date
- Real-time updates via subscriptions

**Project Data**
- Projects from projects table
- Linked to tasks via project_id
- Progress calculated from tasks
- Health status displayed

**AI Generated Data**
- TaskGenerator agent suggestions
- Priority reasoning from AI
- Task recommendations
- Context-aware tips

---

## Features

### Interactive Elements

**Task Creation**
- "New Task" button opens form
- Task creation form in modal or inline
- Fields: title, description, priority, due date, project
- Real-time validation
- Save creates task in database

**Task Editing**
- Click task to edit
- Inline editing or modal form
- Update any task field
- Save updates database
- Real-time sync across clients

**Task Completion**
- Checkbox marks task complete
- Status updates immediately
- Optimistic UI update
- Database sync in background
- Completion animation

**Task Filtering**
- Filter by status, priority, due date, project
- Multiple filters can be active
- Search by task title
- Clear filters option
- Filter state persists

**Task Sorting**
- Sort by priority (urgent first)
- Sort by due date (soonest first)
- Sort by created date (newest first)
- Sort by completion status
- Visual sort indicator

### Data Visualization

**Priority Badges**
- Color-coded priority levels
- Urgent (red), High (orange), Normal (green)
- Clear visual distinction
- Consistent across interface

**Status Indicators**
- Pending status (gray or blue)
- Completed status (green with checkmark)
- Overdue status (red warning)
- Visual status representation

**Progress Indicators**
- Task completion progress
- Project progress calculation
- Overall completion percentage
- Visual progress bars

---

## AI Agents Utilized

### TaskGenerator Agent

**Model:** gemini-3-flash-preview  
**Gemini Features:** Structured Output  
**Edge Function:** ai-helper → wizard_generate_tasks

**Interactions on Screen:**
- User clicks "Generate tasks" button in right panel
- System calls TaskGenerator agent with startup context
- Agent generates task suggestions based on context
- Suggestions displayed in right panel
- User reviews and accepts suggestions
- Tasks created in database

**Display Location:**
- Right panel "Task AI Coach" section
- "Generate tasks" button
- Task suggestions list
- Accept/dismiss actions

---

## User Journey

### Daily Task Management Flow

**Step 1: View Tasks**
- User navigates to Tasks page
- System fetches tasks from database
- Tasks displayed in list or table
- Filters and sorting applied
- AI statistics shown in right panel

**Step 2: Review Priorities**
- User scans task list
- Priority badges highlight urgent items
- Due date indicators show deadlines
- User identifies focus tasks

**Step 3: Complete Tasks**
- User marks tasks complete
- Completion status updates
- Progress indicators update
- Statistics refresh automatically

**Step 4: Generate New Tasks**
- User clicks "Generate tasks" in right panel
- TaskGenerator agent suggests tasks
- User reviews suggestions
- User accepts desired tasks
- Tasks added to list

---

## Workflows

### Task Creation Workflow

**Trigger:** User clicks "New Task" button

**Steps:**
1. Task form appears (modal or inline)
2. User enters task title
3. User enters task description
4. User selects priority level
5. User sets due date
6. User links to project (optional)
7. User clicks "Save"
8. Task created in database
9. Task appears in list
10. Right panel updates with statistics

**Data Flow:**
- Frontend → Supabase Client → tasks table
- Supabase → Real-time Subscription → UI Update
- Frontend → Right Panel → Statistics Refresh

### Task Completion Workflow

**Trigger:** User checks task completion checkbox

**Steps:**
1. User clicks completion checkbox
2. Optimistic UI update (instant feedback)
3. Task status updated in database
4. Real-time subscription notifies other clients
5. Progress indicators update
6. Statistics refresh
7. Task moves to completed section (if filtered)

**Data Flow:**
- Frontend → Optimistic Update → UI Refresh
- Frontend → Supabase Client → tasks table
- Supabase → Real-time Subscription → UI Sync

### AI Task Generation Workflow

**Trigger:** User clicks "Generate tasks" in right panel

**Steps:**
1. User clicks "Generate tasks" button
2. Loading state shown in right panel
3. System calls TaskGenerator agent with startup context
4. Agent generates task suggestions
5. Suggestions displayed in right panel
6. User reviews each suggestion
7. User accepts desired tasks
8. Accepted tasks created in database
9. Tasks appear in task list
10. Statistics refresh

**Data Flow:**
- Frontend → Edge Function Service → ai-helper
- Edge Function → Gemini API → Structured Task JSON
- Edge Function → Frontend → Suggestions Display
- Frontend → Supabase Client → tasks table

---

## Frontend Backend Wiring

### Frontend Components

**Tasks Page Component**
- Three-panel layout container
- Task list component
- Task item component
- Task creation form component
- Task filters component
- AI panel component

**Data Management**
- React Query for task data
- Real-time subscriptions for live updates
- Local state for filters and sorting
- Optimistic updates for actions

### Backend Integration

**Supabase Tables**
- tasks: Stores all task data
- projects: Links tasks to projects
- startups: Provides context for AI

**Real-Time Subscriptions**
- Subscribe to tasks table changes
- Automatically update UI on changes
- Efficient update propagation
- Conflict resolution

**Edge Functions**
- ai-helper: Handles TaskGenerator agent
- Receives startup context as input
- Calls Gemini API with structured output
- Returns task suggestions as JSON

**Data Flow Pattern**
- Frontend → Supabase Client → tasks table (create/update)
- Supabase → Real-time Subscription → Frontend (live updates)
- Frontend → Edge Function → Gemini API (task generation)
- Gemini API → Edge Function → Frontend (suggestions)

---

## Best Practices

### Performance

**Optimization**
- Virtualize long task lists
- Lazy load AI panel content
- Debounce filter inputs
- Efficient database queries
- Smart cache invalidation

**User Experience**
- Instant task completion feedback
- Smooth animations
- Clear loading states
- Progressive enhancement
- Offline support (future)

### Data Management

**State Synchronization**
- Real-time subscriptions for live updates
- Optimistic updates for instant feedback
- Conflict resolution for concurrent edits
- Cache invalidation on changes
- Background refetching

**Filtering and Sorting**
- Efficient client-side filtering
- Database queries for large datasets
- Filter state persistence
- Clear filter indicators
- Quick filter reset

---

## Summary

The tasks screen provides a luxury, premium, sophisticated, intelligent task management experience. The clean interface, powerful filtering, AI-powered task generation, and real-time updates create a daily execution center that helps founders stay organized and productive.

**Key Elements:**
- Clean task list or table view
- Priority badges and status indicators
- Task filters and sorting
- Real-time task updates
- TaskGenerator agent for suggestions
- Task creation and editing
- Task completion tracking
- Project linking and progress calculation
