# How It Works Section — Multistep Rebuild Prompts

**Purpose:** Step-by-step instructions to recreate the scroll-driven How It Works section UI/UX  
**Source:** Based on docs/02-how-it-works-section-plan.md and docs/03-pointer.md  
**Design Goal:** Show real product screens with animated cursor demonstrating AI workflow

---

## Overview

### What Are We Building?
A scroll-driven narrative section showing 4 product screens (Profile → Analysis → Pitch Deck → Execution) with an animated cursor demonstrating AI doing the work. Left side shows step titles, right side displays living product demonstration.

### Design Principles
- **Premium & Calm:** No aggressive animations, generous timing (800-1200ms)
- **Luxury Color System:** Emerald green (#0d5f4e) accents on soft grey (#f5f5f3) background
- **Typography:** Serif headlines paired with sans-serif body text
- **Intelligent Choreography:** Cursor movements show AI intelligence in action

---

## Task 1: Section Structure & Layout

### Goal
Create the foundational two-column layout with scroll-triggered step activation

### UI/UX Description
- **Section height:** 4x viewport height (400vh) to allow comfortable scrolling
- **Left column (40% width):** Sticky positioning with eyebrow, headline, and 4-step list
- **Right column (60% width):** Fixed app window mockup that changes content as user scrolls
- **Background:** Soft grey (#f5f5f3) for entire section
- **Responsive:** Stack vertically on mobile, horizontal split on desktop

### Wireframe Layout
```
┌─────────────────────────────────────────────────────────┐
│  Section (400vh tall, soft grey background)            │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Sticky Container (100vh)                          │ │
│  │  ┌──────────────────┐  ┌────────────────────────┐ │ │
│  │  │ LEFT COLUMN      │  │ RIGHT COLUMN           │ │ │
│  │  │ (40%, sticky)    │  │ (60%, fixed window)    │ │ │
│  │  │                  │  │                        │ │ │
│  │  │ HOW IT WORKS     │  │  ┌──────────────────┐  │ │ │
│  │  │ (eyebrow)        │  │  │  ●●●  StartupAI  │  │ │ │
│  │  │                  │  │  ├──────────────────┤  │ │ │
│  │  │ "From strategy   │  │  │                  │  │ │ │
│  │  │  to daily        │  │  │  [Active Screen] │  │ │ │
│  │  │  execution..."   │  │  │                  │  │ │ │
│  │  │  (headline)      │  │  │                  │  │ │ │
│  │  │                  │  │  │                  │  │ │ │
│  │  │ 1. Profile ●     │  │  │                  │  │ │ │
│  │  │ 2. Analysis      │  │  │                  │  │ │ │
│  │  │ 3. Pitch Deck    │  │  │                  │  │ │ │
│  │  │ 4. Execution     │  │  │                  │  │ │ │
│  │  └──────────────────┘  └────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Success Criteria
- ✅ Section is 400vh tall allowing 4 distinct scroll zones (100vh each)
- ✅ Left column stays sticky as user scrolls
- ✅ Right app window remains fixed in viewport
- ✅ Eyebrow text is emerald green, uppercase, 12px
- ✅ Headline uses serif font, 48-60px, dark gray
- ✅ Grid layout works on desktop (lg+), stacks on mobile

### How It Works
User scrolls through 400vh of content. Scroll position (0-25%, 25-50%, 50-75%, 75-100%) determines which step is active. Intersection Observer or scroll calculation updates activeStep state, which controls both left column highlighting and right panel screen display.

---

## Task 2: Step List Component with Active States

### Goal
Build the 4-step navigation list with emerald green active indicators and smooth transitions

### UI/UX Description
- **4 numbered steps** displayed vertically with generous spacing (12-16px between)
- **Active step:** Bold title, emerald dot indicator, full opacity, description visible
- **Inactive steps:** Gray, 40% opacity, description hidden or dimmed
- **Transition:** 300ms fade when switching between steps
- **Typography:** Sans-serif, 20px for titles, 16px for descriptions

### Wireframe Content
```
┌───────────────────────────────┐
│ 1 ● Profile                   │ ← Active (emerald dot, bold)
│   Tell us about your startup  │
│   once. We do the rest.       │
│                               │
│ 2   Analysis                  │ ← Inactive (gray, dim)
│   AI turns your info into...  │
│                               │
│ 3   Pitch Deck                │
│   Investor-ready materials... │
│                               │
│ 4   Execution                 │
│   Execution and relationships │
└───────────────────────────────┘
```

### Success Criteria
- ✅ Active step has emerald green (#0d5f4e) dot indicator (8px circle)
- ✅ Inactive steps use gray (#6b7280) with reduced opacity (40%)
- ✅ Active title is bold (font-semibold or font-bold)
- ✅ Step transitions are smooth (300ms opacity/color fade)
- ✅ Number and title are on same line, description below
- ✅ Accessible with aria-current="step" on active item

### How It Works
Component receives `activeStep` prop (1-4) from scroll detection. Maps over steps array, applying conditional classes for active state. Uses CSS transitions for smooth color/opacity changes. Each step div contains number, title, and description with proper spacing.

---

## Task 3: App Window Container & Screen Crossfade

### Goal
Create white app window mockup that smoothly crossfades between 4 different screens

### UI/UX Description
- **Window shell:** White card with subtle border, rounded corners (12px), soft shadow
- **Window header:** 56px tall with 3 colored dots (macOS style) and "StartupAI" title
- **Content area:** Variable height based on screen content, generous padding (32px)
- **Screen transitions:** 400ms crossfade (fade out → fade in) when activeStep changes
- **Visual style:** Clean, modern, hairline borders instead of heavy shadows

### Wireframe Structure
```
┌─────────────────────────────────────┐
│ ●●●          StartupAI              │ ← Header (56px)
├─────────────────────────────────────┤
│                                     │
│  [Screen Content Crossfades Here]  │ ← Content area
│                                     │
│  Profile → Analysis → Pitch → CRM  │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Success Criteria
- ✅ Window has white (#ffffff) background
- ✅ Border is hairline gray (#e5e7eb), 1px solid
- ✅ Header shows 3 dots (red, yellow, green, 12px each) on left
- ✅ "StartupAI" title centered in header, sans-serif, 16px
- ✅ Screen components fade with 400ms duration using opacity
- ✅ Only one screen visible at a time (conditional rendering or absolute positioning)
- ✅ Box shadow is subtle: 0 4px 12px rgba(0,0,0,0.06)

### How It Works
Component receives `activeStep` prop and conditionally renders one of 4 screen components. Uses opacity transitions or AnimatePresence for crossfade effect. Header is static, only content area changes. Z-index layering ensures smooth transitions without flicker.

---

## Task 4: Profile Screen with Auto-fill Animation

### Goal
Show startup profile form with cursor clicking URL field, triggering AI auto-fill for other fields

### UI/UX Description
- **Form title:** "Startup Profile Wizard" (serif, 20px)
- **4 input fields:** Startup Name (pre-filled), Website URL (target), Industry (auto-fills), Stage (auto-fills)
- **Auto-fill indicators:** Emerald checkmark icons (✓) with "(auto)" label next to auto-filled fields
- **Progress dots:** 4 dots at bottom showing step 3 of 4 active (emerald fill)
- **Continue button:** Emerald green, bottom right, with arrow icon
- **Spacing:** 24px between form fields, generous padding

### Wireframe Screen
```
┌─────────────────────────────────┐
│ Startup Profile Wizard          │
│ Tell us about your company      │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Startup Name              │  │
│ │ VertexAI                  │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Website URL        [◐]    │  │ ← Cursor target
│ │ https://vertex-ai.io      │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Industry           [✓]    │  │ ← Auto-filled
│ │ AI Infrastructure  (auto) │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │ Stage              [✓]    │  │ ← Auto-filled
│ │ Pre-seed          (auto)  │  │
│ └───────────────────────────┘  │
│                                 │
│ ◦ ◦ ● ◦      [Continue →]     │
└─────────────────────────────────┘
```

### Success Criteria
- ✅ All form fields have hairline borders (#e5e7eb)
- ✅ Website URL field shows focus ring when cursor clicks (emerald glow)
- ✅ Industry and Stage fields have emerald checkmarks (16px) on right
- ✅ "(auto)" label is gray, 12px, positioned next to checkmark
- ✅ Progress dots: 3rd dot filled with emerald, others outlined
- ✅ Continue button has emerald background (#0d5f4e) with white text
- ✅ Input fields use modern sans-serif, 14-16px

### How It Works
Receives `uiState` prop from cursor animation. When uiState equals 'focus-url', URL field shows focus ring. When cursor moves to AI badge positions, checkmarks and auto-filled values appear with 200ms stagger. Continue button shows pressed state when uiState is 'click-continue'.

---

## Task 5: Analysis Screen with Readiness Score

### Goal
Display AI-generated startup readiness analysis with score, gaps, and intelligent recommendations

### UI/UX Description
- **Title:** "Startup Readiness Analysis" with subtitle "Based on your profile"
- **Score display:** Large 72/100 (serif, 48px) with progress bar (72% filled, emerald gradient)
- **Gap list:** 3 detected gaps with orange/amber warning dots
- **AI Intelligence panel:** Soft grey background (#f5f5f3) with contextual explanation
- **Recommended action:** Tooltip-style card showing "+18 pts" impact in emerald
- **Layout:** Score and gaps on left, AI panel on right

### Wireframe Screen
```
┌──────────────────────────────────────┐
│ Startup Readiness Analysis           │
│ Based on your profile                │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Readiness Score                  │ │
│ │                                  │ │
│ │       72/100                     │ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ (72%)        │ │
│ │                                  │ │
│ │ ● Market Validation — Weak      │ │
│ │ ● Traction Metrics — Missing    │ │
│ │ ● Pricing Strategy — Undefined  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ AI Intelligence                  │ │
│ │                                  │ │
│ │ What this means:                 │ │
│ │ Your technical foundation is     │ │
│ │ strong, but market positioning   │ │
│ │ needs clarity.                   │ │
│ │                                  │ │
│ │ Next step:                       │ │
│ │ → Define pricing tiers           │ │
│ │   (Increases score +18 pts)      │ │ ← Tooltip appears
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Success Criteria
- ✅ Score number (72/100) is prominent, serif font, dark gray
- ✅ Progress bar uses emerald green (#0d5f4e) gradient, 72% filled
- ✅ Gap items have amber dots (#f59e0b) and clear labels
- ✅ AI Intelligence panel has soft grey background (#f5f5f3)
- ✅ Impact preview (+18 pts) highlighted in emerald green
- ✅ Tooltip expands when cursor hovers (300ms fade in)
- ✅ Clean card layout with generous whitespace (24px padding)

### How It Works
Progress bar animates from 0% to 72% on mount (800ms duration). Gap cards appear with 200ms stagger. When uiState includes 'hover-action', tooltip expands showing impact metrics. AI panel provides contextual intelligence based on analysis.

---

## Task 6: Pitch Deck Screen with Generation Flow

### Goal
Show pitch deck builder with slide sidebar, canvas preview, and auto-generation from profile

### UI/UX Description
- **Title:** "Pitch Deck Editor" with "Generated from Profile ✓" badge (emerald background)
- **Left sidebar:** 7 numbered slides (Problem, Solution, Market, Product, Traction, Team, Ask)
- **Slide 3 "Market"** is active/highlighted
- **Main canvas:** Shows Market slide with TAM/SAM/SOM breakdown and citation icons
- **Bottom actions:** Generate Deck (emerald), Export PDF (outlined), Share (outlined)
- **Citation tooltips:** Info icons that reveal data sources on hover

### Wireframe Screen
```
┌──────────────────────────────────────────┐
│ Pitch Deck Editor  [Generated ✓]        │
│                                          │
│ ┌───────┐ ┌─────────────────────────┐  │
│ │Slides │ │ Market Opportunity      │  │
│ ├───────┤ │                         │  │
│ │1.Prob │ │ TAM: $47B               │  │
│ │2.Soln │ │ SAM: $8.2B              │  │
│ │3.Mrkt │◀│ SOM: $420M              │  │ ← Active slide
│ │4.Prod │ │                         │  │
│ │5.Trac │ │ Sources:                │  │
│ │6.Team │ │ [i] Gartner 2025        │  │ ← Citation icon
│ │7.Ask  │ │ [i] IDC Research        │  │
│ │       │ │                         │  │
│ │[+Add] │ └─────────────────────────┘  │
│ └───────┘                              │
│                                          │
│ [Generate Deck] [Export PDF] [Share →] │
└──────────────────────────────────────────┘
```

### Success Criteria
- ✅ Badge "Generated from Profile ✓" has emerald background, white text, rounded
- ✅ Sidebar shows 7 slides numbered 1-7, slide 3 highlighted with emerald accent
- ✅ Canvas shows clean TAM/SAM/SOM data with serif numbers
- ✅ Citation icons ([i]) are small, gray, interactive (hover shows tooltip)
- ✅ Generate Deck button has emerald background, glows on click
- ✅ Slides populate top-to-bottom with 150ms stagger animation
- ✅ Canvas crossfades when active slide changes (400ms)

### How It Works
When uiState is 'generate-deck', Generate button shows pressed state and slides populate sidebar with stagger animation. Slide 3 auto-selects, triggering canvas crossfade to Market content. Cursor movement to citation icon triggers tooltip with source information. Clean editorial typography throughout.

---

## Task 7: Execution Screen with Investor CRM Drag

### Goal
Show Kanban-style investor pipeline with drag-and-drop functionality and AI-suggested actions

### UI/UX Description
- **Title:** "Investor Pipeline" with "+ Add Investor" button (top right)
- **4 Kanban columns:** Interested (1 card), Meeting (1 card), Active (1 card), Closed (empty)
- **Investor cards** show: Name, Firm, Deal size, AI probability score (emerald if >80%)
- **Drag animation:** Mark T. card dragged from Meeting to Active column
- **AI Suggested Actions panel:** Bottom panel with checkmarks and recommended tasks
- **Visual feedback:** Column highlights when card hovers, shadow lift during drag

### Wireframe Screen
```
┌────────────────────────────────────────────────┐
│ Investor Pipeline          [+ Add Investor]   │
│                                                │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│ │Interest│ │Meeting │ │Active  │ │Closed  │  │
│ ├────────┤ ├────────┤ ├────────┤ ├────────┤  │
│ │        │ │        │ │        │ │        │  │
│ │Sarah K.│ │Mark T. │→│Lisa C. │ │        │  │ ← Card drag
│ │Accel   │ │a16z    │ │Sequoia │ │        │  │
│ │$2M     │ │$5M     │ │$3M     │ │        │  │
│ │AI: 68% │ │AI: 82% │ │AI: 91% │ │        │  │
│ │        │ │        │ │        │ │        │  │
│ └────────┘ └────────┘ └────────┘ └────────┘  │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ AI Suggested Actions                       │ │
│ │                                            │ │
│ │ ✓ Follow up with Sarah K.                 │ │ ← Completed
│ │   Last contact: 4 days ago                │ │
│ │   → Send updated deck (traction slide)    │ │
│ │                                            │ │
│ │ ◦ Schedule check-in with Mark T.          │ │ ← Pending
│ │   Meeting was 2 weeks ago                 │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

### Success Criteria
- ✅ 4 columns have equal width with hairline dividers (#e5e7eb)
- ✅ Investor cards show firm, amount, and AI probability clearly
- ✅ High probability scores (>80%) use emerald green (#0d5f4e)
- ✅ Low scores (<70%) use gray (#6b7280)
- ✅ Card shows shadow lift when uiState is 'drag-start' (8px shadow)
- ✅ Target column highlights with emerald border during drag
- ✅ AI panel shows completed tasks with emerald checkmarks, pending with hollow circles
- ✅ New task slides in from bottom (400ms) after card drop

### How It Works
When uiState is 'hover-card', Mark T. card shows hover shadow. On 'drag-start', card lifts with increased shadow. During drag motion, Active column highlights with emerald border. On 'drag-end', card settles into Active column and AI panel updates with new suggested action appearing with slide-up animation.

---

## Task 8: Scroll Progress Detection System

### Goal
Detect user scroll position and map it to activeStep (1-4) for triggering screen transitions

### UI/UX Description
- **Scroll zones:** 0-25% = Step 1, 25-50% = Step 2, 50-75% = Step 3, 75-100% = Step 4
- **Detection method:** IntersectionObserver or scroll position calculation
- **Threshold:** Low threshold (0.1) for early activation as section enters viewport
- **State management:** activeStep state controls both StepList highlighting and AppWindow screen
- **Performance:** Use throttled scroll handler or Intersection Observer for 60fps

### How It Works
Container ref tracks scroll position within 400vh section. Calculate scroll percentage: (scrollTop / totalScrollHeight). Map percentage to activeStep: 0-0.25 → 1, 0.25-0.5 → 2, 0.5-0.75 → 3, 0.75-1 → 4. Update activeStep state triggers transitions in both columns. IntersectionObserver with 0.1 threshold pauses animations when section off-screen.

### Success Criteria
- ✅ activeStep updates smoothly as user scrolls (no jank)
- ✅ Step transitions trigger at correct scroll positions (25%, 50%, 75%)
- ✅ Scroll detection works in both directions (up and down)
- ✅ IntersectionObserver pauses animations when section not visible
- ✅ No performance issues (60fps maintained)
- ✅ Threshold set to 0.1 for early detection

---

## Task 9: Animated Cursor Choreography System

### Goal
Create custom cursor that moves, clicks, hovers, and drags to demonstrate AI workflow interactions

### UI/UX Description
- **Cursor visual:** SVG arrow pointer (24px), dark neutral (#111) with white stroke
- **Shadow:** Subtle drop shadow (0 2px 4px rgba(0,0,0,0.15))
- **Click feedback:** Scale 0.9 for 200ms, emerald ripple effect
- **Movement:** Curved bezier paths (not straight lines) for human-like motion
- **Timing:** 600-800ms for movements, 200-300ms for clicks, 400ms settle pauses
- **Z-index:** 9999 to ensure visibility above all UI elements
- **Pointer events:** None (decorative only, doesn't interfere with real cursor)

### Movement Sequences

#### Profile Screen (2.5s loop)
1. Fade in at starting position (200ms)
2. Move to Website URL field, curved path (800ms)
3. Click into field, scale 0.9→1, emerald ripple (200ms)
4. Idle during typing animation (400ms)
5. Move to Industry AI badge (600ms)
6. Hover observing auto-fill (300ms)
7. Move to Continue button (600ms)
8. Click button, press effect (200ms)

#### Pitch Deck Screen (2s loop)
1. Move to Generate Deck button (800ms)
2. Click button, emerald glow (200ms)
3. Wait for slides to populate (200ms)
4. Move to Market slide item (800ms)
5. Move to Export PDF button (600ms)
6. Hover on export (300ms)

#### Execution Screen (2.5s loop)
1. Move to Mark T. card in Meeting column (800ms)
2. Click card, drag start with shadow lift (200ms)
3. Drag motion to Active column, curved path (1000ms)
4. Drop card, settle animation (200ms)
5. Pause (200ms)
6. Move to AI action item (600ms)
7. Click action, background highlight (200ms)

### Success Criteria
- ✅ Cursor appears only on desktop (hidden on mobile)
- ✅ Movement uses curved bezier paths (not robotic straight lines)
- ✅ Click scale animation is subtle (0.9x, 200ms)
- ✅ Emerald ripple appears on clicks (#0d5f4e at 20% opacity)
- ✅ Timing feels premium (not rushed, 800-1200ms movements)
- ✅ Cursor syncs with UI state changes (focus rings, hover states)
- ✅ Respects prefers-reduced-motion (disables if preference set)
- ✅ Loops seamlessly with 700ms pause between cycles

### How It Works
useCursorAnimation hook manages cursor position {x, y}, scale, opacity, and visibility. Each screen has sequence array defining target coordinates and actions. Bezier curve utility generates 20-point curved paths between positions. Animation loop uses requestAnimationFrame for smooth 60fps. State updates trigger UI responses in screen components via uiState prop.

---

## Task 10: UI Response States Integration

### Goal
Sync cursor actions with visible UI feedback (focus rings, hover states, drag shadows)

### UI/UX Description
- **Focus rings:** Emerald glow around input when cursor clicks (2px, #0d5f4e at 40% opacity)
- **Button press:** Slight scale down (0.98x) and background darken on click
- **Hover states:** Subtle brightness increase or shadow on cards/buttons
- **Drag states:** Card lifts with 8px shadow, original position shows placeholder
- **Column highlights:** Emerald border (2px) on target column during drag
- **Auto-fill animations:** Checkmarks fade in (200ms) with slide-left motion
- **Stagger timing:** Multiple elements appear with 150-200ms delays

### State Coordination
```
uiState values → UI Responses:

'focus-url'       → URL input shows focus ring
'click-continue'  → Continue button pressed state
'generate-deck'   → Generate button press + slides populate
'hover-card'      → Investor card shadow increase
'drag-start'      → Card lifts with shadow
'drag-over'       → Target column highlights
'drag-end'        → Card settles, AI action appears
'click-action'    → Action item background tint
```

### Success Criteria
- ✅ All cursor interactions have matching UI feedback
- ✅ Focus rings appear exactly when cursor clicks inputs (no delay)
- ✅ Drag shadow is noticeable but subtle (8px blur, 10% opacity)
- ✅ Auto-fill animations feel intelligent (not instant, 200ms stagger)
- ✅ Button press states are immediate (no lag)
- ✅ Column highlights are clear during drag (emerald border)
- ✅ All transitions use smooth easing (cubic-bezier)

### How It Works
Screen components receive uiState prop from cursor animation system. Each component checks uiState string and conditionally applies classes or inline styles. Example: `className={uiState === 'focus-url' ? 'ring-2 ring-emerald-500/40' : ''}`. Transitions defined in CSS (300-400ms) for smooth state changes.

---

## Task 11: Mobile Adaptation & Responsive Behavior

### Goal
Gracefully degrade complex interactions on mobile while preserving narrative and content

### UI/UX Description
- **Breakpoint:** < 768px triggers mobile layout
- **Layout:** Stack left and right columns vertically, remove sticky positioning
- **Cursor:** Completely hidden on mobile (no cursor animations)
- **Screens:** Show final completed state (pre-filled forms, populated decks, completed drags)
- **Scroll:** Each step becomes discrete section, no complex scroll triggers
- **Preserved:** 4-step narrative order, content hierarchy, emerald color system

### Mobile Layout
```
┌─────────────────────────┐
│ HOW IT WORKS            │
│                         │
│ From strategy to daily  │
│ execution, in one...    │
│                         │
│ 1. Profile ●            │
│ Tell us about your...   │
│                         │
│ [Profile Screen]        │
│ (fields already filled) │
│                         │
├─────────────────────────┤
│ 2. Analysis             │
│ AI turns your info...   │
│                         │
│ [Analysis Screen]       │
│ (score already shown)   │
│                         │
├─────────────────────────┤
│ 3. Pitch Deck           │
│ Investor-ready...       │
│                         │
│ [Deck Screen]           │
│ (deck already generated)│
│                         │
├─────────────────────────┤
│ 4. Execution            │
│ Execution and...        │
│                         │
│ [CRM Screen]            │
│ (card already moved)    │
└─────────────────────────┘
```

### Success Criteria
- ✅ Mobile uses vertical stack (no horizontal grid)
- ✅ Cursor component doesn't render on mobile (display: none)
- ✅ Each screen shows completed state (no pending interactions)
- ✅ Text remains readable (16px minimum font size)
- ✅ Touch scrolling is smooth (no scroll conflicts)
- ✅ All content accessible without animations
- ✅ Images/mockups scale appropriately (max-width: 100%)

### How It Works
Media query (lg:) controls desktop grid layout. Below lg breakpoint, grid becomes single column. Cursor component wrapped in `<div className="hidden lg:block">`. Screens receive `isCompleted={true}` prop on mobile to show final states immediately. Remove sticky positioning on mobile, let content flow naturally.

---

## Task 12: Performance Optimization & Accessibility

### Goal
Ensure 60fps animations, respect motion preferences, and maintain accessibility standards

### Performance Optimizations
- **GPU acceleration:** Use `transform: translate3d()` for cursor movement (not top/left)
- **Will-change:** Apply `will-change: transform, opacity` to animated elements
- **requestAnimationFrame:** Use RAF loop for smooth cursor animation (60fps)
- **Intersection Observer:** Pause animations when section off-screen (battery saving)
- **Throttling:** Throttle scroll handlers to max 60fps (16.67ms)
- **Batch updates:** Group React state updates to minimize re-renders

### Accessibility Features
- **prefers-reduced-motion:** Detect and disable all animations if user preference set
- **Semantic HTML:** Use `<section>`, `<nav>`, `<article>` appropriately
- **ARIA labels:** Add `aria-label="How StartupAI works"` to section
- **Active state:** Use `aria-current="step"` on active step in list
- **Keyboard nav:** Provide skip link for keyboard users to bypass section
- **Screen readers:** Ensure content is readable without animations
- **Focus management:** Cursor is decorative only (pointer-events: none)

### Success Criteria
- ✅ Animations run at 60fps (no dropped frames)
- ✅ Cursor movement uses transform only (no layout thrashing)
- ✅ Animations pause when section off-screen (IntersectionObserver)
- ✅ prefers-reduced-motion disables cursor and transitions
- ✅ Section has descriptive aria-label
- ✅ Active step marked with aria-current
- ✅ Keyboard users can skip section
- ✅ Content readable without JavaScript

### How It Works
Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` on mount. If true, set cursor opacity to 0 and disable animation sequences. Use IntersectionObserver with threshold 0.1 to detect section visibility, pause animations when isInView is false. Apply `will-change` CSS property to cursor element. Use `transform: translate3d()` exclusively for movement to leverage GPU.

---

## Summary Progress Tracker

| Task | Description | Goal | Success Metrics | Status |
|------|-------------|------|-----------------|--------|
| **1** | Section Structure & Layout | Create 400vh scrollable section with sticky left, fixed right columns | ✅ 400vh height<br>✅ Left sticky, right fixed<br>✅ Emerald/grey colors | 🔲 TODO |
| **2** | Step List Component | Build 4-step navigation with active indicators | ✅ Emerald active dot<br>✅ Bold title on active<br>✅ Smooth transitions | 🔲 TODO |
| **3** | App Window Container | White mockup window with crossfade screens | ✅ macOS-style header<br>✅ 400ms crossfade<br>✅ Subtle shadow | 🔲 TODO |
| **4** | Profile Screen | Startup form with AI auto-fill demo | ✅ Focus ring on click<br>✅ Emerald checkmarks<br>✅ Auto-fill stagger | 🔲 TODO |
| **5** | Analysis Screen | Readiness score with gaps and recommendations | ✅ 72/100 score display<br>✅ Emerald progress bar<br>✅ AI tooltip | 🔲 TODO |
| **6** | Pitch Deck Screen | Deck builder with slide sidebar | ✅ Emerald badge<br>✅ Slide stagger<br>✅ Citation tooltips | 🔲 TODO |
| **7** | Execution Screen | Investor CRM with drag-drop Kanban | ✅ 4 columns<br>✅ Drag shadow lift<br>✅ AI actions panel | 🔲 TODO |
| **8** | Scroll Detection | Map scroll position to activeStep (1-4) | ✅ 25% zones<br>✅ IntersectionObserver<br>✅ 60fps smooth | 🔲 TODO |
| **9** | Cursor Choreography | Animated cursor with movement sequences | ✅ Curved paths<br>✅ Click feedback<br>✅ Seamless loop | 🔲 TODO |
| **10** | UI Response States | Sync cursor actions with UI feedback | ✅ Focus rings<br>✅ Hover states<br>✅ Drag shadows | 🔲 TODO |
| **11** | Mobile Adaptation | Vertical stack, no animations, final states | ✅ Single column<br>✅ No cursor<br>✅ Touch-friendly | 🔲 TODO |
| **12** | Performance & A11y | 60fps, reduced motion, accessibility | ✅ GPU acceleration<br>✅ Motion preference<br>✅ ARIA labels | 🔲 TODO |

---

## Design System Reference

### Color Palette
- **Emerald primary:** `#0d5f4e` — Active states, buttons, progress, accents
- **Sage secondary:** `#6b9d89` — Subtle AI indicators, badges
- **Soft grey BG:** `#f5f5f3` — Section background
- **White cards:** `#ffffff` — App window, panels
- **Border light:** `#e5e7eb` — Hairline borders
- **Text primary:** `#1a1a1a` — Headlines, titles
- **Text secondary:** `#6b7280` — Descriptions, inactive states
- **Amber warning:** `#f59e0b` — Gap indicators, alerts

### Typography Scale
- **Eyebrow:** 12px, uppercase, tracking-wider, sans-serif
- **Section headline:** 48-60px, serif, tight leading
- **Step titles:** 20px, sans-serif, bold when active
- **Step descriptions:** 16px, sans-serif, gray-600
- **Screen titles:** 20px, serif
- **Screen body:** 14-16px, sans-serif
- **Button text:** 14px, sans-serif, medium weight

### Spacing System
- **Section padding:** py-32 lg:py-40 (128-160px)
- **Column gap:** gap-16 lg:gap-24 (64-96px)
- **Card padding:** p-8 lg:p-12 (32-48px)
- **Form field spacing:** space-y-6 (24px)
- **Step list spacing:** space-y-3 (12px)

### Animation Timing
- **Panel crossfade:** 400ms, ease-in-out
- **Cursor movement:** 600-800ms, cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Click ripple:** 300ms, emerald at 20% opacity
- **Auto-fill stagger:** 200ms per field
- **Hover tooltips:** 200ms fade
- **Drag motion:** 800-1000ms with shadow lift
- **Settle pause:** 400ms after interactions

---

## Implementation Workflow

### Phase 1: Foundation (Tasks 1-3)
Build static layout structure with scroll container, sticky columns, app window shell, and basic screen components. No animations yet.

**Time estimate:** 2-3 hours  
**Deliverable:** Scrollable section with 4 static screens visible based on manual step prop

### Phase 2: Content & Screens (Tasks 4-7)
Create all 4 detailed screen UIs with proper styling, forms, data displays, and layouts. Static states only.

**Time estimate:** 4-5 hours  
**Deliverable:** All screens fully designed matching wireframes

### Phase 3: Scroll Interaction (Task 8)
Implement scroll detection and activeStep state management. Wire step transitions and screen crossfades.

**Time estimate:** 1-2 hours  
**Deliverable:** Screens change smoothly as user scrolls through section

### Phase 4: Cursor System (Task 9)
Build animated cursor component and choreography system with all movement sequences for 4 screens.

**Time estimate:** 3-4 hours  
**Deliverable:** Cursor demonstrates workflow with curved paths and timing

### Phase 5: UI Integration (Task 10)
Add UI response states synced to cursor actions (focus rings, hover effects, drag shadows).

**Time estimate:** 2-3 hours  
**Deliverable:** All cursor interactions trigger visible UI feedback

### Phase 6: Polish & Optimization (Tasks 11-12)
Mobile responsive layout, accessibility features, performance optimization, reduced motion support.

**Time estimate:** 2-3 hours  
**Deliverable:** Production-ready section working on all devices

**Total estimated time:** 14-20 hours

---

## Key Success Factors

### Visual Quality
- Matches luxury brand aesthetic (calm, premium, architectural)
- Emerald green used tastefully (not overwhelming)
- Hairline borders instead of heavy shadows
- Generous negative space (not cramped)
- Serif/sans typography mix creates editorial feel

### Interaction Quality
- Cursor movements feel human (curved paths, natural timing)
- Click feedback is immediate but subtle
- Scroll feels smooth at any speed (60fps)
- Transitions are calm, not jarring
- Timing reinforces premium positioning (800-1200ms moves)

### Narrative Clarity
- Users understand "AI does the work" within 10 seconds
- Each screen shows intelligent automation clearly
- Profile → Analysis → Pitch Deck → Execution flow is logical
- Progressive disclosure builds confidence
- Real product UI (not illustrations) proves legitimacy

### Technical Excellence
- 60fps scroll and animations (no jank)
- GPU-accelerated cursor (transform-only)
- Respects motion preferences (accessibility)
- Works across browsers (Chrome, Safari, Firefox)
- Mobile degrades gracefully (content preserved)
- Performance optimized (pauses off-screen)

---

**Document Status:** Complete multistep rebuild guide  
**Reference Docs:** docs/02-how-it-works-section-plan.md, docs/03-pointer.md  
**Total Tasks:** 12  
**Estimated Complexity:** High (cursor choreography is most complex)  
**Next Action:** Begin Phase 1 implementation or use as specification for outsourced development
