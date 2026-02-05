---
description: Prepare and create a pull request
---

# PR - Prepare Pull Request

Clean up code and create a pull request for the current branch.

## Pre-PR Checklist

1. Run `npm run lint` and fix any errors
2. Run `npx tsc --noEmit` and fix type errors
3. Run `npm run test` and ensure tests pass
4. Review all changed files for:
   - Console.log statements to remove
   - Commented-out code to remove
   - TODO comments that should be addressed
   - Proper error handling

## Create PR

1. Stage and commit any remaining changes
2. Push branch to origin
3. Create PR with:
   - Clear title describing the change
   - Summary of what was changed and why
   - Testing instructions
   - Screenshots if UI changes

$ARGUMENTS - Optional: PR title or description hints
