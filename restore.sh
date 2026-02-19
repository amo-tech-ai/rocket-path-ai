#!/bin/bash
# Restore Script for StartupAI16
# Restores protected folders and files from a backup directory

set -e

# Auto-detect latest backup if not specified
if [ -z "$1" ]; then
  BACKUP_DIR=$(ls -td .backup-* 2>/dev/null | head -1)
  if [ -z "$BACKUP_DIR" ]; then
    echo "❌ No backup directory found!"
    echo "Usage: $0 [backup-directory]"
    exit 1
  fi
  echo "📦 Auto-detected latest backup: $BACKUP_DIR"
else
  BACKUP_DIR="$1"
  if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
  fi
fi

echo "🔄 Restoring from: $BACKUP_DIR"
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
  "figma"
  "figma-2"
  "claude-reference"
  "claude-sdk"
  "notes"
  "roadmap"
  "website"
  "facts"
  "knowledge"
)

# Protected files
PROTECTED_FILES=(
  "CLAUDE.md"
  "claude.md"
  "roadmap.md"
  "prd.md"
  "skills.md"
  "index.md"
  ".env.local"
  ".mcp.json"
  "CLAUDE.local.md"
  "AGENTS.md"
  "progress-tracker.md"
  "IMPLEMENTATION_PLAN.md"
  "TASKS_TABLE.md"
  "style-guide.md"
  "README.md"
)

# Restore folders
RESTORE_COUNT=0
for folder in "${PROTECTED_FOLDERS[@]}"; do
  if [ -d "$BACKUP_DIR/$folder" ]; then
    if [ -d "$folder" ]; then
      echo "⚠️  $folder/ already exists (backing up current version first)"
      mv "$folder" "${folder}.old-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
    fi
    cp -r "$BACKUP_DIR/$folder" . && echo "✅ Restored $folder/" && ((RESTORE_COUNT++))
  else
    echo "⚠️  $folder/ not found in backup (skipping)"
  fi
done

# Restore files
for file in "${PROTECTED_FILES[@]}"; do
  if [ -f "$BACKUP_DIR/$file" ]; then
    if [ -f "$file" ]; then
      echo "⚠️  $file already exists (backing up current version first)"
      cp "$file" "${file}.old-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
    fi
    cp "$BACKUP_DIR/$file" . && echo "✅ Restored $file" && ((RESTORE_COUNT++))
  else
    echo "⚠️  $file not found in backup (skipping)"
  fi
done

echo ""
echo "📊 Restore Summary:"
echo "   - Source: $BACKUP_DIR"
echo "   - Items restored: $RESTORE_COUNT"
echo ""

# Verify critical items
echo "🔍 Verifying restoration..."
VERIFY_FAILED=0

# Verify critical folders
CRITICAL_FOLDERS=(".cursor" ".claude" "knowledge")
for folder in "${CRITICAL_FOLDERS[@]}"; do
  if [ -d "$folder" ]; then
    echo "✅ Verified: $folder/"
  else
    echo "❌ MISSING: $folder/"
    VERIFY_FAILED=1
  fi
done

if [ $VERIFY_FAILED -eq 0 ]; then
  echo ""
  echo "✅ Restore complete and verified!"
  exit 0
else
  echo ""
  echo "⚠️  Restore completed but some critical items are missing!"
  exit 1
fi
