# Core Prompt 11 — Projects Screen Design

**Purpose:** Define the luxury, premium projects management screen with wireframe, content, data, features, and project health tracking  
**Focus:** Projects screen specification for core MVP phase  
**Status:** Core Foundation

---

## Screen Purpose

**Project Portfolio Management**

The projects screen provides founders with a sophisticated, intelligent view of their project portfolio. Projects are displayed as elegant cards showing progress, health status, and linked tasks. This screen helps founders track multiple initiatives and maintain oversight of all active work.

---

## Visual Design

### Luxury Premium Aesthetic

**Sophisticated Project Display**
- Beautiful project cards in grid or list layout
- Premium typography with clear hierarchy
- Elegant progress bars and health indicators
- Thoughtful spacing and visual balance
- Polished animations for interactions

**Intelligent Organization**
- Project cards grouped by status
- Clear visual health indicators
- Progress visualization
- Task linkage display
- Contextual information architecture

---

## Wireframe Structure

### Left Panel: Context & Filters

**Navigation**
- Current page: Projects highlighted
- Navigation menu items
- Quick stats summary

**Project Filters**
- Filter by status (All, Active, Completed, Archived)
- Filter by health (All, On Track, At Risk, Behind)
- Filter by project type (if applicable)
- Search input for project names

**Quick Stats**
- Total projects count
- Active projects count
- At risk projects count
- Completed projects count

### Main Panel: Project Grid

**Project Grid Header**
- "Projects" title
- "New Project" button
- View toggle (Grid / List)
- Filter indicators

**Project Cards Grid**
- Two or three column grid layout
- Project cards in grid format
- Responsive grid adapts to screen size
- Generous spacing between cards

**Project Card Display**
- Project name (prominent heading)
- Project description (secondary text)
- Progress bar with percentage
- Health status badge (on track, at risk, behind)
- Linked tasks count
- Completion percentage
- Last updated timestamp

**Empty State**
- "No projects yet" message
- "Create your first project" button
- Helpful guidance text

### Right Panel: AI Intelligence

**Project AI Coach**
- Current focus message
- Project health insights
- Risk alerts for at-risk projects
- Context-aware recommendations

**Project Statistics**
- Projects by health breakdown
- Overall portfolio progress
- At-risk projects list
- Completion trends

**Suggested Actions**
- "Create project" button
- Project health recommendations
- Risk mitigation suggestions
- Context-aware tips

---

## Screen Content

### Data Sources

**Project Data**
- Projects from projects table
- Filtered by organization ID
- Linked tasks via project_id
- Progress calculated from tasks
- Health status from metrics

**Task Data**
- Linked tasks from tasks table
- Task completion rates
- Task count per project
- Progress calculations

**Calculated Metrics**
- Project progress percentage
- Health status indicators
- Risk assessment
- Completion trends

---

## Features

### Interactive Elements

**Project Creation**
- "New Project" button opens form
- Project creation form in modal
- Fields: name, description, start date, end date, status
- Real-time validation
- Save creates project in database

**Project Viewing**
- Click project card to view details
- Project detail view or modal
- Shows all linked tasks
- Shows progress breakdown
- Shows health indicators

**Project Editing**
- Click edit on project card
- Update project fields
- Save updates database
- Real-time sync across clients

**Project Filtering**
- Filter by status and health
- Multiple filters can be active
- Search by project name
- Clear filters option
- Filter state persists

### Data Visualization

**Progress Bars**
- Visual progress indicators
- Percentage completion
- Color-coded by progress level
- Smooth progress updates
- Clear visual representation

**Health Badges**
- Color-coded health status
- On Track (green)
- At Risk (orange)
- Behind (red)
- Clear visual distinction
- Consistent across interface

**Task Linkage**
- Linked tasks count displayed
- Task completion percentage
- Visual task indicators
- Click to view tasks

---

## AI Agents Utilized

**None in Phase 1** — Projects screen has no AI agents in core MVP. AI analysis comes in Phase 2+ with advanced features.

**Future Enhancement (Phase 2+):**
- Project health analysis agent
- Risk prediction agent
- Project timeline optimization agent

---

## User Journey

### Project Management Flow

**Step 1: View Projects**
- User navigates to Projects page
- System fetches projects from database
- Projects displayed in grid or list
- Filters and sorting applied
- Statistics shown in right panel

**Step 2: Review Portfolio**
- User scans project cards
- Health badges highlight at-risk projects
- Progress bars show completion status
- User identifies focus projects

**Step 3: View Project Details**
- User clicks project card
- Project detail view opens
- Shows all linked tasks
- Shows progress breakdown
- Shows health indicators

**Step 4: Create New Project**
- User clicks "New Project" button
- Project creation form appears
- User enters project details
- User saves project
- Project appears in grid

---

## Workflows

### Project Creation Workflow

**Trigger:** User clicks "New Project" button

**Steps:**
1. Project form appears in modal
2. User enters project name
3. User enters project description
4. User sets start date
5. User sets end date (optional)
6. User selects initial status
7. User clicks "Save"
8. Project created in database
9. Project appears in grid
10. Right panel updates with statistics

**Data Flow:**
- Frontend → Supabase Client → projects table
- Supabase → Real-time Subscription → UI Update
- Frontend → Right Panel → Statistics Refresh

### Project Progress Update Workflow

**Trigger:** Linked tasks are completed

**Steps:**
1. Task linked to project is completed
2. Project progress calculation runs
3. Progress percentage updated
4. Health status re-evaluated
5. Progress bar updates
6. Health badge updates if needed
7. Real-time subscription notifies other clients

**Data Flow:**
- Task Completion → Supabase → tasks table
- Supabase → Calculation → projects table (progress)
- Supabase → Real-time Subscription → UI Update

### Project Health Assessment Workflow

**Trigger:** Project data changes or periodic check

**Steps:**
1. System evaluates project metrics
2. Compares progress to timeline
3. Assesses task completion rates
4. Calculates health status
5. Updates health badge
6. Alerts shown if at risk

**Data Flow:**
- Project Metrics → Calculation → Health Status
- Health Status → Supabase → projects table
- Supabase → Real-time Subscription → UI Update

---

## Frontend Backend Wiring

### Frontend Components

**Projects Page Component**
- Three-panel layout container
- Project grid component
- Project card component
- Project creation form component
- Project detail view component
- Project filters component

**Data Management**
- React Query for project data
- Real-time subscriptions for live updates
- Local state for filters and view mode
- Optimistic updates for actions

### Backend Integration

**Supabase Tables**
- projects: Stores all project data
- tasks: Links tasks to projects via project_id
- startups: Provides context for projects

**Real-Time Subscriptions**
- Subscribe to projects table changes
- Subscribe to tasks table changes for progress
- Automatically update UI on changes
- Efficient update propagation

**Calculated Fields**
- Project progress calculated from tasks
- Health status calculated from metrics
- Task count per project
- Completion percentages

**Data Flow Pattern**
- Frontend → Supabase Client → projects table (create/update)
- Supabase → Real-time Subscription → Frontend (live updates)
- Task Completion → Calculation → Project Progress Update
- Frontend → Right Panel → Statistics Refresh

---

## Best Practices

### Performance

**Optimization**
- Efficient project queries with joins
- Virtualize long project lists (if needed)
- Lazy load project details
- Optimize progress calculations
- Smart cache invalidation

**User Experience**
- Smooth card animations
- Clear loading states
- Progressive image loading (if project images added)
- Fast filter application
- Instant feedback on actions

### Data Management

**Progress Calculation**
- Calculate progress from linked tasks
- Update progress on task completion
- Efficient calculation queries
- Cache progress calculations
- Real-time progress updates

**Health Assessment**
- Evaluate health from metrics
- Update health on progress changes
- Clear health criteria
- Visual health indicators
- Risk alerts for at-risk projects

---

## Summary

The projects screen provides a luxury, premium, sophisticated, intelligent project portfolio management experience. The beautiful project cards, clear progress visualization, health status indicators, and real-time updates create a comprehensive view that helps founders maintain oversight of all active initiatives.

**Key Elements:**
- Elegant project cards in grid layout
- Progress bars and completion percentages
- Health status badges (on track, at risk, behind)
- Project filters and search
- Real-time project updates
- Task linkage and progress calculation
- Project creation and editing
- Portfolio statistics in right panel
