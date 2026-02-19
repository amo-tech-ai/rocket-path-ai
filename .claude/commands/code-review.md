---
description: Review code for quality, bugs, and best practices
---

# Code Review

Perform a thorough code review of recent changes.

## Review Scope

$ARGUMENTS - Files or branch to review (default: current branch vs main)

## Review Checklist

### Code Quality
- [ ] No spaghetti code or overly complex logic
- [ ] Functions are focused and reasonably sized
- [ ] No unnecessary imports or dead code
- [ ] Consistent naming conventions
- [ ] Code is readable without excessive comments

### Error Handling
- [ ] Try-catch blocks where needed
- [ ] Errors are logged appropriately
- [ ] User-facing errors are handled gracefully
- [ ] No silent failures

### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation present
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (escaped output)
- [ ] RLS policies for new tables

### Performance
- [ ] No N+1 queries
- [ ] Appropriate use of React Query caching
- [ ] No unnecessary re-renders
- [ ] Large lists are paginated or virtualized

### Testing
- [ ] Tests exist for new functionality
- [ ] Edge cases are covered
- [ ] Tests are meaningful (not just for coverage)

## Output

Provide findings in categories:
- **Critical** - Must fix before merge
- **Important** - Should fix before merge
- **Suggestions** - Nice to have improvements
