#!/bin/bash
# Backup Script for StartupAI16
# Creates timestamped backup of all protected folders and files

# Don't exit on error - continue backing up what we can
set +e

BACKUP_DIR=".backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup to $BACKUP_DIR..."
echo ""

# Protected folders
PROTECTED_FOLDERS=(
  ".cursor"
  ".claude"
  "plan"
  "pm"
  "supabase"
  "screenshots"
  "prompts"
  "tasks"
  "scripts"
  "figma"
  "figma-2"
  "claude-reference"
  "claude-sdk"
  "notes"
  "roadmap"
  "website"
  "facts"
  "knowledge"
  "tasks-archive"
  "tasks-draft"
  ".agents"
  ".agent"
)

# Protected files
PROTECTED_FILES=(
  # Project documentation
  "CLAUDE.md"
  "claude.md"
  "roadmap.md"
  "prd.md"
  "skills.md"
  "index.md"
  "notes.md"
  "summary.md"
  "system.md"
  "CLAUDE.local.md"
  "AGENTS.md"
  "progress-tracker.md"
  "IMPLEMENTATION_PLAN.md"
  "TASKS_TABLE.md"
  "style-guide.md"
  "README.md"
  "CHANGELOG.md"
  "QUICK-AUTH-CLOUDINARY.md"
  "SIMPLE-AUTH.md"
  "TEST-CLOUDINARY-MCP.md"
  "README-PRODUCTION-READY.md"
  "IMPLEMENTATION-COMPLETE.md"
  # Configuration files
  ".env.local"
  ".mcp.json"
  ".gitignore"
  "package.json"
  "package-lock.json"
  "tsconfig.json"
  "tsconfig.app.json"
  "tsconfig.node.json"
  "vite.config.ts"
  "tailwind.config.ts"
  "postcss.config.js"
  "playwright.config.ts"
  "vitest.config.ts"
  "eslint.config.js"
  "components.json"
)

# Backup folders
BACKUP_COUNT=0
for folder in "${PROTECTED_FOLDERS[@]}"; do
  if [ -d "$folder" ]; then
    if cp -r "$folder" "$BACKUP_DIR/" 2>/dev/null; then
      echo "✅ Backed up $folder/"
      ((BACKUP_COUNT++))
    else
      echo "❌ Failed to backup $folder/"
    fi
  else
    echo "⚠️  $folder/ not found (skipping)"
  fi
done

# Backup files
for file in "${PROTECTED_FILES[@]}"; do
  if [ -f "$file" ]; then
    if cp "$file" "$BACKUP_DIR/" 2>/dev/null; then
      echo "✅ Backed up $file"
      ((BACKUP_COUNT++))
    else
      echo "❌ Failed to backup $file"
    fi
  else
    echo "⚠️  $file not found (skipping)"
  fi
done

echo ""
echo "📊 Backup Summary:"
echo "   - Backup directory: $BACKUP_DIR"
echo "   - Items backed up: $BACKUP_COUNT"
echo ""

# Verify critical items
echo "🔍 Verifying critical backups..."
VERIFY_FAILED=0

# Verify critical folders
CRITICAL_FOLDERS=(".cursor" ".claude" "knowledge" "supabase" "tasks" "screenshots" "figma" "website")
for folder in "${CRITICAL_FOLDERS[@]}"; do
  if [ -d "$BACKUP_DIR/$folder" ]; then
    FILE_COUNT=$(find "$BACKUP_DIR/$folder" -type f 2>/dev/null | wc -l)
    echo "✅ Verified: $folder/ ($FILE_COUNT files)"
  else
    echo "❌ MISSING in backup: $folder/"
    VERIFY_FAILED=1
  fi
done

# Verify critical root files (notes, index)
[ -f "$BACKUP_DIR/notes.md" ] && echo "✅ Verified: notes.md" || { echo "⚠️  notes.md not in backup (may not exist)"; }
[ -f "$BACKUP_DIR/index.md" ] && echo "✅ Verified: index.md" || { echo "❌ MISSING in backup: index.md"; VERIFY_FAILED=1; }

# Verify critical subdirectories
echo ""
echo "🔍 Verifying critical subdirectories..."
[ -d "$BACKUP_DIR/tasks/events" ] && echo "✅ tasks/events/ ($(find "$BACKUP_DIR/tasks/events" -type f 2>/dev/null | wc -l) files)" || echo "⚠️  tasks/events/ not in backup"
[ -d "$BACKUP_DIR/supabase/migrations" ] && echo "✅ supabase/migrations/ ($(find "$BACKUP_DIR/supabase/migrations" -type f 2>/dev/null | wc -l) files)" || echo "⚠️  supabase/migrations/ not in backup"
[ -d "$BACKUP_DIR/supabase/seeds" ] && echo "✅ supabase/seeds/ ($(find "$BACKUP_DIR/supabase/seeds" -type f 2>/dev/null | wc -l) files)" || echo "⚠️  supabase/seeds/ not in backup"
[ -d "$BACKUP_DIR/supabase/functions" ] && echo "✅ supabase/functions/ ($(find "$BACKUP_DIR/supabase/functions" -type f 2>/dev/null | wc -l) files)" || echo "⚠️  supabase/functions/ not in backup"
[ -d "$BACKUP_DIR/scripts" ] && echo "✅ scripts/ ($(find "$BACKUP_DIR/scripts" -type f 2>/dev/null | wc -l) files)" || echo "⚠️  scripts/ not in backup (may not exist locally)"

if [ $VERIFY_FAILED -eq 0 ]; then
  echo ""
  echo "✅ Backup complete and verified!"
  echo "   Location: $BACKUP_DIR"
  exit 0
else
  echo ""
  echo "⚠️  Backup completed but some critical items are missing!"
  exit 1
fi
