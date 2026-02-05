# Update from GitHub

## Overview
Safely update the codebase from `https://github.com/amo-tech-ai/rocket-path-ai.git` while preserving all local project knowledge, documentation, and secrets.

Implements **Hybrid Sync**:
- **GitHub Wins**: Application code (`src/`, `components/`, `supabase/migrations/`)
- **Local Wins**: Project knowledge (`.cursor/`, `plan/`, `docs/`, `prompts/`, etc.)

## Workflow

Execute this update workflow following `.cursor/rules/github-update.mdc`:

### 1. Secure Local State (Backup & Stash)

Create timestamped backup of all protected paths:

```bash
# Create backup directory
BACKUP_DIR=".backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup core knowledge directories
cp -r .cursor plan docs prompts screenshots figma figma-2 claude-reference claude-sdk notes roadmap "$BACKUP_DIR/" 2>/dev/null || true

# Backup Supabase documentation (but not migrations)
mkdir -p "$BACKUP_DIR/supabase"
cp -r supabase/docs supabase/schemas supabase/functions/_shared "$BACKUP_DIR/supabase/" 2>/dev/null || true

# Backup project documentation files
cp prd.md roadmap.md progress-tracker.md IMPLEMENTATION_PLAN.md TASKS_TABLE.md style-guide.md "$BACKUP_DIR/" 2>/dev/null || true

# Backup secrets and config
cp .env.local .mcp.json CLAUDE.md AGENTS.md "$BACKUP_DIR/" 2>/dev/null || true

# Stash ALL local changes (including new untracked files)
git stash push -m "Pre-Update Safety Stash $(date +%Y%m%d-%H%M%S)" --include-untracked || echo "No changes to stash"
```

### 2. Synchronize Code (GitHub Wins)

Fetch and sync code from GitHub:

```bash
# Fetch latest metadata
git fetch origin main

# Force Working Directory Sync - updates all tracked files to match origin/main
git checkout origin/main -- .

# Align branch pointer smoothly
git reset --soft origin/main 2>/dev/null || true
```

### 3. Restore Knowledge (Local Wins)

Restore all protected paths from backup:

```bash
# Restore core knowledge directories
cp -r "$BACKUP_DIR/.cursor" . 2>/dev/null || true
cp -r "$BACKUP_DIR/plan" . 2>/dev/null || true
cp -r "$BACKUP_DIR/docs" . 2>/dev/null || true
cp -r "$BACKUP_DIR/prompts" . 2>/dev/null || true
cp -r "$BACKUP_DIR/screenshots" . 2>/dev/null || true
cp -r "$BACKUP_DIR/figma" . 2>/dev/null || true
cp -r "$BACKUP_DIR/figma-2" . 2>/dev/null || true
cp -r "$BACKUP_DIR/claude-reference" . 2>/dev/null || true
cp -r "$BACKUP_DIR/claude-sdk" . 2>/dev/null || true
cp -r "$BACKUP_DIR/notes" . 2>/dev/null || true
cp -r "$BACKUP_DIR/roadmap" . 2>/dev/null || true

# Restore Supabase documentation (but not migrations)
if [ -d "$BACKUP_DIR/supabase" ]; then
  mkdir -p supabase
  cp -r "$BACKUP_DIR/supabase/docs" supabase/ 2>/dev/null || true
  cp -r "$BACKUP_DIR/supabase/schemas" supabase/ 2>/dev/null || true
  cp -r "$BACKUP_DIR/supabase/functions/_shared" supabase/functions/ 2>/dev/null || true
fi

# Restore project documentation
cp "$BACKUP_DIR/prd.md" . 2>/dev/null || true
cp "$BACKUP_DIR/roadmap.md" . 2>/dev/null || true
cp "$BACKUP_DIR/progress-tracker.md" . 2>/dev/null || true
cp "$BACKUP_DIR/IMPLEMENTATION_PLAN.md" . 2>/dev/null || true
cp "$BACKUP_DIR/TASKS_TABLE.md" . 2>/dev/null || true
cp "$BACKUP_DIR/style-guide.md" . 2>/dev/null || true

# Restore secrets and config
cp "$BACKUP_DIR/.env.local" . 2>/dev/null || true
cp "$BACKUP_DIR/.mcp.json" . 2>/dev/null || true
cp "$BACKUP_DIR/CLAUDE.md" . 2>/dev/null || true
cp "$BACKUP_DIR/AGENTS.md" . 2>/dev/null || true
```

### 4. Verification

Check status and provide next steps:

```bash
# Show git status
git status --short

# Show backup location
echo "Backup location: $BACKUP_DIR"
```

## Protected Paths (Preserved)

All these paths are automatically backed up and restored:

### Core Knowledge
- `.cursor/`, `plan/`, `docs/`, `prompts/`, `screenshots/`
- `figma/`, `figma-2/`, `claude-reference/`, `claude-sdk/`, `notes/`, `roadmap/`
- `supabase/docs/`, `supabase/schemas/`, `supabase/functions/_shared/`

### Documentation
- `prd.md`, `roadmap.md`, `progress-tracker.md`
- `IMPLEMENTATION_PLAN.md`, `TASKS_TABLE.md`, `style-guide.md`

### Secrets & Config
- `.env.local`, `.mcp.json`, `CLAUDE.md`, `AGENTS.md`

## Not Protected (Synced from GitHub)

These are updated from GitHub:
- Source code (`src/`, `components/`, `services/`)
- Supabase migrations (`supabase/migrations/`)
- Configuration files (except `.env.local`, `.mcp.json`)

## Next Steps After Update

1. Review changes: `git status`
2. Test application: `npm run dev`
3. Install dependencies if needed: `npm install`
4. Clean up old backups: `rm -rf .backup-*`

## Notes

- Backup is timestamped: `.backup-YYYYMMDD-HHMMSS/`
- All operations are safe - backup is created first
- Protected paths are never overwritten by GitHub
- Source code is always synced to match GitHub exactly
