# Detailed Workflow Patterns

## Test-Driven Development (TDD) Workflow

### Complete TDD Example

**Step 1: Request Tests**
```
Using TDD, write comprehensive tests for the UserService.register() method. 
Tests should cover:
- Valid registration with email and password
- Email format validation
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)
- Duplicate email detection
- Database transaction rollback on failure

Use the testing patterns from __tests__/services/ and avoid mocks where possible.
```

**Step 2: Review and Run Tests**
- Review generated test file
- Run tests: `npm test -- UserService.test.ts`
- Verify all tests fail (red phase)
- Commit failing tests: `git commit -m "test: add UserService.register() tests (failing)"`

**Step 3: Request Implementation**
```
Now implement the UserService.register() method to make all tests pass.
Follow the existing service patterns in src/services/ and use the database
connection from src/integrations/supabase/client.ts.
```

**Step 4: Verify and Commit**
- Run tests: `npm test -- UserService.test.ts`
- Verify all tests pass (green phase)
- Review implementation
- Commit: `git commit -m "feat: implement UserService.register()"`

## Code Review Workflow

### Pre-Commit Review

**Step 1: Generate Code**
```
Add error handling to the payment processing function. Include:
- Network timeout handling (5 second timeout)
- Retry logic with exponential backoff (max 3 retries)
- Proper error logging
- User-friendly error messages
```

**Step 2: Review Changes**
- Watch diffs as agent works
- Use `/review` command after completion
- Check for:
  - Error handling completeness
  - Logging best practices
  - User experience considerations
  - Performance implications

**Step 3: Request Improvements**
```
The error handling looks good, but please:
- Add specific error types for different failure modes
- Include error codes for client-side handling
- Add metrics/logging for monitoring
```

**Step 4: Final Review and Commit**
- Review final changes
- Run tests
- Commit with descriptive message

## Multi-File Refactoring Workflow

### Example: Extract Common Utilities

**Step 1: Plan Phase**
```
I want to extract common validation logic from auth.ts, user.ts, and profile.ts
into a shared validation utility. Use Plan Mode to:
1. Identify all validation functions
2. Determine common patterns
3. Plan the new utility structure
4. Identify all files that need updates
```

**Step 2: Review Plan**
- Review generated plan in `.cursor/plans/`
- Verify all affected files identified
- Check for edge cases

**Step 3: Execute Refactoring**
```
Execute the refactoring plan. Create src/utils/validation.ts with the
extracted functions, then update all files that use the old validation
functions to import from the new utility.
```

**Step 4: Verify**
- Run all tests
- Check for TypeScript errors
- Verify no functionality broken
- Review all file changes together

## Feature Development Workflow

### Example: Add User Profile Editing

**Step 1: Plan**
```
Add user profile editing feature. Users should be able to edit:
- Display name
- Bio
- Profile picture
- Location

Use Plan Mode to create a comprehensive plan covering:
- Database schema changes
- API endpoints
- Frontend components
- Validation rules
- Permission checks
```

**Step 2: Database Changes**
```
Implement the database changes from the plan:
- Add migration for profile fields
- Update TypeScript types
- Add RLS policies for profile editing
```

**Step 3: Backend Implementation**
```
Implement the API endpoints for profile editing:
- PUT /api/profile endpoint
- Validation middleware
- Image upload handling
- Error responses
```

**Step 4: Frontend Implementation**
```
Create the profile editing UI:
- Edit form component
- Image upload component
- Validation feedback
- Success/error notifications
```

**Step 5: Integration and Testing**
```
Integrate all components and write integration tests:
- Test complete edit flow
- Test validation
- Test error handling
- Test permissions
```

## Debugging Workflow

### Example: Fix Authentication Bug

**Step 1: Reproduce Issue**
```
Users are reporting authentication failures. The error occurs when:
- User logs in with valid credentials
- Session is created successfully
- But subsequent API calls fail with "Unauthorized"

Help me debug this issue.
```

**Step 2: Investigate**
```
Let's investigate the authentication flow:
1. Check session creation in auth.ts
2. Review session validation middleware
3. Check token refresh logic
4. Review error logs
```

**Step 3: Identify Root Cause**
```
Based on the investigation, the issue appears to be in the session
validation. Let's add detailed logging to trace the exact failure point.
```

**Step 4: Fix and Test**
```
Implement the fix and add regression tests to prevent this issue
from recurring.
```

## Performance Optimization Workflow

### Example: Optimize Database Queries

**Step 1: Identify Bottlenecks**
```
The dashboard is loading slowly. Help me identify and fix performance
issues. Start by analyzing:
- Database query patterns
- N+1 query problems
- Missing indexes
- Unnecessary data fetching
```

**Step 2: Analyze and Plan**
```
Create a plan to optimize the identified bottlenecks:
- Add missing database indexes
- Implement query batching
- Add caching where appropriate
- Optimize data fetching
```

**Step 3: Implement Optimizations**
```
Implement the optimizations from the plan, starting with the highest
impact items first.
```

**Step 4: Measure and Verify**
```
Add performance monitoring and verify the improvements:
- Add query timing logs
- Measure before/after metrics
- Verify no functionality broken
```
