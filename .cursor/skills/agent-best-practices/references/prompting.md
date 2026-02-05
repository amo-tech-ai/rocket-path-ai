# Advanced Prompting Techniques

## Prompt Structure

### Effective Prompt Components

**1. Context Setting**
```
I'm working on the user authentication system. The current implementation
uses JWT tokens stored in httpOnly cookies. We're using Supabase for the
backend and React for the frontend.
```

**2. Specific Task**
```
Add password reset functionality that:
- Sends reset email via Supabase Auth
- Creates secure reset token
- Validates token on reset page
- Updates password in database
```

**3. Constraints and Requirements**
```
Requirements:
- Use existing Supabase client configuration
- Follow error handling patterns from auth.ts
- Include rate limiting (max 3 requests per hour)
- Add logging for security events
```

**4. Reference Existing Patterns**
```
Follow the patterns used in:
- src/services/auth.ts for authentication logic
- src/components/forms/LoginForm.tsx for form structure
- src/utils/validation.ts for input validation
```

**5. What to Avoid**
```
Avoid:
- Creating new authentication libraries
- Storing tokens in localStorage
- Bypassing existing validation utilities
- Duplicating error handling code
```

## Prompt Patterns by Task Type

### Feature Development

**Pattern:**
```
Add [feature name] that [primary functionality]. The feature should:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Follow patterns from [reference files] and avoid [anti-patterns].
Include tests using [testing approach].
```

**Example:**
```
Add user notification preferences that allow users to configure email
and push notification settings. The feature should:
- Save preferences to user_settings table
- Provide UI in user profile page
- Sync with notification service
- Persist across sessions

Follow patterns from src/components/settings/ and avoid direct database
queries in components. Include tests using React Testing Library.
```

### Bug Fixes

**Pattern:**
```
Fix [bug description]. The issue occurs when [conditions]. Expected
behavior is [correct behavior]. Current behavior is [actual behavior].

Investigate [areas to check] and implement fix following [patterns].
Add regression test to prevent recurrence.
```

**Example:**
```
Fix user profile image not updating. The issue occurs when user uploads
new profile picture. Expected behavior is image updates immediately.
Current behavior is image shows old version until page refresh.

Investigate image upload handler, cache invalidation, and state management.
Implement fix following patterns from src/hooks/useImageUpload.ts.
Add regression test to prevent recurrence.
```

### Refactoring

**Pattern:**
```
Refactor [component/system] to [goal]. Current issues:
- [Issue 1]
- [Issue 2]

Extract [what to extract] into [new location]. Update all references
in [files/directories]. Maintain backward compatibility for [aspects].
```

**Example:**
```
Refactor authentication utilities to use dependency injection. Current issues:
- Hard-coded Supabase client
- Difficult to test
- Tight coupling

Extract auth functions into service class that accepts client as dependency.
Update all references in src/services/ and src/components/auth/.
Maintain backward compatibility for existing API.
```

### Code Review Requests

**Pattern:**
```
Review [code/files] for:
- [Aspect 1 to check]
- [Aspect 2 to check]
- [Aspect 3 to check]

Focus on [specific concerns]. Check against [standards/patterns].
```

**Example:**
```
Review the new payment processing code for:
- Security vulnerabilities
- Error handling completeness
- Performance implications
- Test coverage

Focus on PCI compliance and transaction safety. Check against OWASP
guidelines and existing payment patterns.
```

## Context Management

### When to Provide Context

**Provide explicit context when:**
- Working with specific files that must be modified
- Referencing patterns from particular locations
- Working with complex systems requiring domain knowledge
- Agent needs to understand project structure

**Let agent discover when:**
- General feature requests
- Common patterns exist in codebase
- Semantic search can find relevant code
- Working with well-documented systems

### Context Tagging Strategies

**Tag specific files:**
```
@src/services/auth.ts @src/components/LoginForm.tsx
Add password strength validation to the login form.
```

**Tag directories:**
```
@src/components/forms/
Refactor all form components to use the new validation utility.
```

**Use semantic search:**
```
Find all components that handle user authentication and add
session timeout handling.
```

## Iterative Refinement

### Starting Broad, Then Narrowing

**Iteration 1: Broad Request**
```
Add user profile editing functionality.
```

**Iteration 2: Add Details**
```
The profile editing should include:
- Display name
- Bio
- Profile picture
- Location
```

**Iteration 3: Add Constraints**
```
Use the existing form patterns from src/components/forms/ and
validate inputs using src/utils/validation.ts.
```

**Iteration 4: Add Requirements**
```
Include error handling, loading states, and success notifications.
Follow the patterns from src/components/settings/ProfileSettings.tsx.
```

### Feedback Loops

**After agent generates code:**
```
The implementation looks good, but please:
- Add input sanitization for XSS prevention
- Include rate limiting for profile updates
- Add audit logging for security
```

**After review:**
```
The error handling needs improvement. Add:
- Specific error types for different failure modes
- User-friendly error messages
- Retry logic for network failures
```

## Anti-Patterns to Avoid

### Vague Prompts

**Bad:**
```
Fix the bug.
Make it better.
Add tests.
```

**Good:**
```
Fix the authentication timeout bug that occurs after 30 minutes of
inactivity. Users should remain logged in for 2 hours.
```

### Over-Specification

**Bad:**
```
Create a function called validateEmail that takes a string parameter
called email, checks if it contains @ symbol, has a domain with at
least one dot, and returns a boolean. Put it in src/utils/validation.ts
on line 45, and make sure it uses regex pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Good:**
```
Add email validation function to src/utils/validation.ts following
the existing validation patterns. Use a robust regex that handles
common email formats.
```

### Missing Context

**Bad:**
```
Add authentication.
```

**Good:**
```
Add JWT-based authentication to the React app. Use Supabase Auth
for backend, store tokens in httpOnly cookies, and create login/logout
components following the patterns in src/components/auth/.
```

### Ignoring Existing Patterns

**Bad:**
```
Create a new API client from scratch.
```

**Good:**
```
Extend the existing API client in src/integrations/supabase/client.ts
to add the new endpoints, following the current error handling and
request patterns.
```

## Prompt Templates

### New Feature Template

```
Add [feature name] that [primary functionality]. Requirements:
- [Requirement 1]
- [Requirement 2]

Follow patterns from:
- [Reference file 1] for [aspect]
- [Reference file 2] for [aspect]

Include:
- [Test type] tests
- [Documentation type] documentation
- [Error handling] error handling

Avoid:
- [Anti-pattern 1]
- [Anti-pattern 2]
```

### Bug Fix Template

```
Fix [bug description]. 

Issue: [What's wrong]
Expected: [Correct behavior]
Actual: [Current behavior]
Occurs when: [Conditions]

Investigate:
- [Area 1]
- [Area 2]

Fix following [patterns/references] and add regression test.
```

### Refactoring Template

```
Refactor [target] to [goal].

Current issues:
- [Issue 1]
- [Issue 2]

Extract [what] into [where]. Update references in [locations].
Maintain compatibility for [aspects]. Include tests for [coverage].
```
