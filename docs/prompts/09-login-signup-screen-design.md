# Core Prompt 09 — Login/Signup Screen Design

**Purpose:** Define the luxury, premium authentication screen with wireframe, content, features, and Supabase auth integration  
**Focus:** Login and signup screen specification for core MVP phase  
**Status:** Core Foundation

---

## Screen Purpose

**User Authentication Entry Point**

The login/signup screen is the first interaction users have with StartupAI. It must feel premium, sophisticated, and trustworthy while remaining simple and accessible. This screen provides secure authentication using Supabase Auth.

---

## Visual Design

### Luxury Premium Aesthetic

**Sophisticated Authentication Design**
- Clean, minimal interface with generous whitespace
- Premium typography with clear hierarchy
- Refined form design with thoughtful spacing
- Elegant toggle between sign up and sign in modes
- Polished error states and success confirmations

**Trustworthy Interface**
- Professional appearance that builds confidence
- Clear security indicators
- Helpful error messages
- Accessible form design
- Smooth transitions between modes

---

## Wireframe Structure

### Main Content Area

**Centered Card Layout**
- Centered authentication card on page
- Maximum width for comfortable form
- Generous padding for premium feel
- Subtle shadow for depth
- Rounded corners for softness

### Form Header

**Brand and Title**
- StartupAI logo at top
- Clear title: "Sign in to StartupAI" or "Create your account"
- Subtle tagline below title
- Mode toggle between sign up and sign in

### Form Fields

**Email Input**
- Large, accessible input field
- Clear label above input
- Helpful placeholder text
- Email validation feedback
- Error message display

**Password Input**
- Secure password input field
- Show/hide password toggle
- Password strength indicator (signup only)
- Clear label above input
- Error message display

**Signup Additional Fields** (Signup mode only)
- Full name input field
- Confirm password field
- Terms and conditions checkbox
- Privacy policy acknowledgment

### Action Buttons

**Primary Button**
- "Sign In" or "Create Account" button
- Prominent, confident appearance
- Loading state during submission
- Success state after completion

**Secondary Actions**
- "Forgot Password" link (sign in mode)
- Switch between sign up and sign in
- Terms and privacy links (signup mode)

### Footer

**Additional Options**
- Social login options (future)
- Help and support links
- Legal links (terms, privacy)

---

## Screen Content

### Data Sources

**Authentication Data**
- User email from form input
- User password from form input
- User name from form input (signup only)
- Supabase Auth for authentication
- Profiles table for user profile
- Organizations table for organization creation

**Form State**
- Current mode (sign up or sign in)
- Form validation state
- Error messages from Supabase
- Success confirmation state

---

## Features

### Interactive Elements

**Email Input**
- Real-time email format validation
- Clear validation feedback
- Helpful error messages
- Accessible keyboard navigation

**Password Input**
- Show/hide password toggle
- Password strength indicator (signup)
- Real-time validation feedback
- Secure input handling

**Mode Toggle**
- Switch between sign up and sign in
- Smooth transition animation
- Form fields adapt to mode
- Clear visual indication of current mode

**Form Submission**
- Submit button with loading state
- Form validation before submission
- Error handling with user-friendly messages
- Success confirmation with redirect

### Validation

**Email Validation**
- Format validation (email pattern)
- Required field validation
- Real-time feedback
- Clear error messages

**Password Validation**
- Minimum length requirement (signup)
- Password strength indicator (signup)
- Confirm password match (signup)
- Required field validation

**Form Validation**
- All required fields filled
- Valid email format
- Valid password format
- Terms accepted (signup)
- Real-time validation feedback

---

## User Journey

### Signup Flow

**Step 1: User Arrives at Signup**
- User navigates to signup page
- User sees "Create your account" form
- User enters email address
- User enters password
- User confirms password
- User accepts terms and conditions

**Step 2: Account Creation**
- User clicks "Create Account" button
- System validates form fields
- System calls Supabase Auth signup
- Supabase creates user account
- Database trigger creates profile
- Database trigger creates organization
- User redirected to wizard

**Step 3: First-Time Setup**
- User lands on wizard Step 1
- User completes startup wizard
- User sees dashboard after completion

### Login Flow

**Step 1: User Arrives at Login**
- User navigates to login page
- User sees "Sign in to StartupAI" form
- User enters email address
- User enters password

**Step 2: Authentication**
- User clicks "Sign In" button
- System validates form fields
- System calls Supabase Auth login
- Supabase authenticates user
- Session token stored
- User redirected to dashboard

**Step 3: Dashboard Access**
- User lands on dashboard
- User sees startup data and tasks
- User can navigate to all screens

---

## Workflows

### Signup Workflow

**Trigger:** User submits signup form

**Steps:**
1. Validate email format
2. Validate password strength
3. Validate password match
4. Check terms acceptance
5. Call Supabase Auth signup
6. Create profile in profiles table
7. Create organization in organizations table
8. Redirect to wizard

**Data Flow:**
- Frontend → Supabase Auth → User Account Creation
- Supabase Trigger → Database → Profile Creation
- Supabase Trigger → Database → Organization Creation
- Frontend → Navigation → Wizard Screen

### Login Workflow

**Trigger:** User submits login form

**Steps:**
1. Validate email format
2. Validate password presence
3. Call Supabase Auth login
4. Store session token
5. Redirect to dashboard

**Data Flow:**
- Frontend → Supabase Auth → Authentication
- Supabase Auth → Frontend → Session Token
- Frontend → Navigation → Dashboard Screen

### Session Management Workflow

**Trigger:** User navigates to protected route

**Steps:**
1. Check for existing session
2. Validate session token
3. Refresh session if needed
4. Allow access if authenticated
5. Redirect to login if not authenticated

**Data Flow:**
- Frontend → Supabase Auth → Session Check
- Supabase Auth → Frontend → Session Status
- Frontend → Navigation → Protected Route or Login

---

## Frontend Backend Wiring

### Frontend Components

**LoginPage Component**
- Sign up / sign in toggle
- Email input field
- Password input field
- Confirm password field (signup only)
- Name input field (signup only)
- Terms checkbox (signup only)
- Submit button
- Error message display
- Loading state management

**AuthContext Provider**
- Session state management
- Auth functions (signup, login, logout)
- Session persistence
- Protected route logic

**AuthGuard Component**
- Route protection wrapper
- Session validation
- Redirect logic
- Loading state during auth check

### Backend Integration

**Supabase Auth**
- Email/password authentication
- Session management
- Token refresh handling
- Password reset flow (future)
- Email verification (future)

**Database Triggers**
- Profile creation on user signup
- Organization creation on user signup
- Automatic user-org association
- Default settings initialization

**Data Flow Pattern**
- Frontend → Supabase Auth → User Account
- Supabase Trigger → Database → Profile + Organization
- Frontend → Supabase Client → Session Management
- Frontend → Protected Routes → Auth Check

---

## AI Agents Utilized

**None** — Authentication screen has no AI agents. This is a pure authentication interface.

**Future Enhancement:**
- AI-powered password strength analysis
- Smart form autofill suggestions
- Fraud detection and security analysis

---

## Best Practices

### Security

**Password Handling**
- Never log or display passwords
- Secure password transmission
- Password hashing by Supabase
- Session token security
- Secure cookie handling

**Input Validation**
- Client-side validation for UX
- Server-side validation for security
- Sanitize all user inputs
- Prevent injection attacks
- Rate limiting on auth attempts

### User Experience

**Clear Feedback**
- Real-time validation feedback
- Helpful error messages
- Success confirmations
- Loading states during auth
- Smooth transitions between modes

**Accessibility**
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management
- Clear form labels

### Error Handling

**Graceful Degradation**
- Network error handling
- Supabase error handling
- User-friendly error messages
- Recovery options provided
- Clear error explanations

---

## Summary

The login/signup screen provides a luxury, premium, sophisticated, intelligent entry point to StartupAI. The clean, minimal design, thoughtful form validation, and seamless Supabase Auth integration create a trustworthy, accessible authentication experience.

**Key Elements:**
- Centered authentication card
- Email and password inputs
- Sign up / sign in mode toggle
- Real-time validation feedback
- Supabase Auth integration
- Session management
- Protected route enforcement
- Error handling and recovery
