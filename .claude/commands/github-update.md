---
description: Safely update from GitHub while preserving local files
---

# GitHub Update - Safe Pull from Remote

Safely pull updates from GitHub while preserving all protected local files and folders.

## Quick Method (Recommended)

Run the automated script:
```bash
./github-update.sh
```

This handles everything automatically:
1. Creates backup
2. Stashes changes
3. Pulls from GitHub
4. Restores protected files
5. Verifies everything exists

## Manual Method

If the script isn't available:

### Step 1: Backup
```bash
./backup.sh
```

### Step 2: Stash and Pull
```bash
git stash push -m "Before GitHub update" --include-untracked
git pull origin main --no-rebase
```

### Step 3: Restore if Needed
```bash
./restore.sh
```

### Step 4: Pop Stash
```bash
git stash pop
```

## Protected Items (NEVER DELETE)

### Folders
- `.cursor/` - Cursor rules and configuration
- `.claude/` - Claude skills, commands, agents, docs
- `plan/` - Implementation plans
- `pm/` - Project management
- `supabase/` - Migrations, functions, docs
- `tasks/` - Task documentation
- `screenshots/` - Design references
- `prompts/` - Prompt templates
- `figma/`, `figma-2/` - Design exports
- `knowledge/` - Reference documentation
- `facts/` - Claude reference docs

### Files
- `CLAUDE.md` - Main Claude instructions
- `CLAUDE.local.md` - Personal settings
- `roadmap.md`, `prd.md`, `skills.md`, `index.md`
- `.env.local`, `.mcp.json`

## If Something Goes Wrong

```bash
# Find latest backup
ls -td .backup-* | head -1

# Restore from backup
./restore.sh

# Or restore specific folder
cp -r .backup-YYYYMMDD-HHMMSS/.claude .
```

## Rules

- **NEVER** use `git reset --hard`
- **NEVER** use `git clean -fd`
- **ALWAYS** backup before pulling
- **ALWAYS** verify protected folders exist after update

$ARGUMENTS - Optional: branch name (default: main)
