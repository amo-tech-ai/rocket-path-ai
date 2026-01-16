# Core Prompt 02 — Three-Panel Layout Architecture

**Purpose:** Define the core three-panel layout system that powers all StartupAI screens  
**Focus:** Layout logic, panel responsibilities, responsive behavior, user journey flow  
**Status:** Core Foundation

---

## Core Layout Model

### Three-Panel Structure

**Left Panel = Context**
- WHERE AM I?
- Navigation, progress, filters, status
- Fixed 240px width on desktop
- Collapsible on tablet and mobile

**Main Panel = Work**
- WHAT AM I DOING?
- Forms, tables, editors, primary content
- Flexible width that grows to fill space
- Always visible and primary focus

**Right Panel = Intelligence**
- HELP ME
- AI insights, suggestions, risks, next actions
- Fixed 320px width on desktop
- Slide-over or bottom sheet on mobile

---

## Layout Logic

### Panel Responsibilities

**Left Panel Contains:**
- Primary navigation menu
- Current page context
- Progress indicators
- Quick stats and filters
- Status badges
- Breadcrumbs

**Left Panel Never Contains:**
- Forms or data entry
- Primary content
- AI-generated content
- Action buttons

**Main Panel Contains:**
- Primary content and data
- Forms and input fields
- Tables and lists
- Editors and wizards
- Kanban boards
- Primary action buttons

**Main Panel Never Contains:**
- Navigation menus
- AI insights or suggestions
- Secondary information
- Context switching controls

**Right Panel Contains:**
- AI-generated insights
- Risk alerts and warnings
- Suggested next actions
- Explanation of AI reasoning
- Source citations
- Quick action buttons

**Right Panel Never Contains:**
- Data entry forms
- Primary navigation
- Main content
- Complex workflows

---

## Visual Hierarchy

### Layout Flow

**Reading Pattern**
- Left to right information flow
- Top to bottom content hierarchy
- Context → Action → Intelligence
- Natural eye movement patterns

**Visual Weight**
- Main panel has strongest visual presence
- Left panel provides structure and context
- Right panel supports without distracting
- Clear separation between panels

**Content Priority**
- Most important content in main panel
- Supporting context in left panel
- AI assistance in right panel
- Progressive disclosure throughout

---

## Responsive Behavior

### Desktop Experience

**Full Three-Panel Layout**
- All three panels visible simultaneously
- Fixed widths for left and right panels
- Flexible main panel adapts to screen size
- Generous spacing and typography
- Rich interactions and hover states

**Layout Specifications**
- Left panel: 240px fixed width
- Main panel: Flexible, minimum 600px
- Right panel: 320px fixed width
- Total minimum width: 1160px
- Optimal width: 1440px to 1920px

### Tablet Experience

**Adaptive Two-Panel Layout**
- Left panel becomes collapsible sidebar
- Main panel takes primary focus
- Right panel slides over when needed
- Touch-optimized interactions
- Streamlined navigation

**Layout Specifications**
- Left panel: Collapsible, 240px when open
- Main panel: Flexible, fills available space
- Right panel: Slide-over, 320px when open
- Breakpoint: 768px to 1279px

### Mobile Experience

**Single-Panel Focus**
- Main panel is primary focus
- Left panel becomes hamburger menu
- Right panel becomes bottom sheet
- Touch-first interactions
- Prioritized essential features

**Layout Specifications**
- Main panel: Full width, 100vw
- Left panel: Hamburger menu drawer
- Right panel: Bottom sheet modal
- Breakpoint: Below 768px

---

## Panel Interactions

### Left Panel Behavior

**Desktop**
- Always visible
- Fixed position
- Scrollable content
- Collapsible sections

**Tablet**
- Collapsible sidebar
- Overlay when open
- Swipe to dismiss
- Touch-friendly targets

**Mobile**
- Hidden by default
- Hamburger menu trigger
- Full-screen drawer
- Swipe to close

### Main Panel Behavior

**All Devices**
- Primary focus area
- Scrollable content
- Responsive grid layouts
- Adaptive content width

**Desktop**
- Generous spacing
- Multi-column layouts
- Rich interactions

**Tablet**
- Optimized spacing
- Two-column layouts
- Touch interactions

**Mobile**
- Single column
- Compact spacing
- Swipe gestures

### Right Panel Behavior

**Desktop**
- Always visible
- Fixed position
- Scrollable content
- Context-aware updates

**Tablet**
- Slide-over panel
- Triggered by button
- Overlay main content
- Swipe to dismiss

**Mobile**
- Bottom sheet
- Triggered by button
- Slides up from bottom
- Swipe down to dismiss

---

## User Journey Flow

### Navigation Pattern

**Entry Point**
- User lands on main panel content
- Left panel shows current location
- Right panel shows relevant AI insights
- Clear visual hierarchy

**Context Switching**
- Left panel navigation updates
- Main panel content changes
- Right panel adapts to new context
- Smooth transitions between states

**Workflow Progression**
- Left panel shows progress
- Main panel shows current step
- Right panel provides guidance
- Clear forward and back navigation

### Information Flow

**Context → Work → Intelligence**
- Left panel provides context
- Main panel enables work
- Right panel offers intelligence
- Seamless flow between panels

**AI Interaction Pattern**
- AI analyzes context from left panel
- AI processes work in main panel
- AI displays insights in right panel
- User approves actions in main panel

---

## Layout Rules

### Hard Rules

**AI → PROPOSE (Right Panel)**
- All AI suggestions appear in right panel
- Never auto-execute in main panel
- Always require user approval
- Clear visual distinction

**Human → APPROVE (Main Panel)**
- All user actions happen in main panel
- User reviews AI suggestions
- User takes primary actions
- User controls workflow

**System → EXECUTE (Backend)**
- All data operations via Supabase
- Edge functions handle AI calls
- Database enforces business rules
- Secure and reliable execution

### Layout Constraints

**Panel Independence**
- Each panel can scroll independently
- Panels don't affect each other's layout
- Consistent spacing within panels
- Clear visual boundaries

**Content Adaptation**
- Content adapts to panel width
- Responsive typography scales
- Flexible grid systems
- Graceful content overflow

---

## Screen-Specific Layouts

### Dashboard Screen

**Left Panel**
- Navigation menu
- Quick stats summary
- Filter options
- Progress indicators

**Main Panel**
- KPI bar at top
- Next best action card
- Today's priorities list
- Active projects grid

**Right Panel**
- AI coach message
- Risk radar summary
- Suggested actions
- Context-aware insights

### Wizard Screen

**Left Panel**
- Step progress indicator
- Current step context
- Completion percentage
- Navigation between steps

**Main Panel**
- Current step form
- Input fields and controls
- Validation messages
- Primary action buttons

**Right Panel**
- AI-extracted suggestions
- Field-by-field guidance
- Helpful tips and examples
- Next step preview

### Tasks Screen

**Left Panel**
- Navigation menu
- Task filters
- Status indicators
- Quick stats

**Main Panel**
- Task list or table
- Task cards with details
- Create task form
- Bulk actions

**Right Panel**
- AI prioritization reasoning
- Task suggestions
- Context-aware tips
- Related tasks

---

## Best Practices

### Layout Consistency

**Standard Patterns**
- Consistent panel widths
- Standard spacing between panels
- Uniform content padding
- Predictable navigation

**Visual Cohesion**
- Shared design tokens
- Consistent typography
- Unified color palette
- Harmonious animations

### Performance

**Optimized Rendering**
- Lazy load right panel content
- Virtualize long lists
- Optimize panel transitions
- Efficient state management

**Responsive Performance**
- Fast layout calculations
- Smooth panel transitions
- Optimized breakpoint handling
- Graceful degradation

---

## Summary

The three-panel layout creates a sophisticated, intelligent interface that guides founders through their work while providing contextual AI assistance. The clear separation of context, work, and intelligence creates a natural flow that supports both focused work and AI-assisted decision-making.

**Key Principles:**
- Left = Context (WHERE AM I?)
- Main = Work (WHAT AM I DOING?)
- Right = Intelligence (HELP ME)
- Clear visual hierarchy and information flow
- Responsive adaptation to all devices
