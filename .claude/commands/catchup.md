---
description: Read all changed files in current branch and summarize progress
---

# Catchup - Resume Work Session

Read all files changed in the current git branch compared to main.

## Steps

1. Run `git diff --name-only main...HEAD` to find changed files
2. Read each changed file to understand the modifications
3. Check `git log --oneline main..HEAD` for commit history
4. Look for any TODO comments or incomplete work
5. Check `tasks/` folder for current task documentation if it exists

## Output

Provide a summary:
- What features/changes have been implemented
- What's currently in progress
- Any blockers or issues found
- Suggested next steps

$ARGUMENTS - Optional: specific area to focus on (e.g., "events", "supabase")
