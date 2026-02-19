#!/bin/bash
# Complete GitHub Update Workflow for StartupAI16
# Automates: backup → stash → pull → restore → verify

set -e

echo "🚀 Starting GitHub update workflow..."
echo ""

# Step 1: Create backup
echo "📦 Step 1: Creating backup..."
if [ -f "./backup.sh" ]; then
  bash ./backup.sh
  BACKUP_DIR=$(ls -td .backup-* 2>/dev/null | head -1)
else
  echo "⚠️  backup.sh not found, creating manual backup..."
  BACKUP_DIR=".backup-$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$BACKUP_DIR"
  [ -d .cursor ] && cp -r .cursor "$BACKUP_DIR/" && echo "✅ Backed up .cursor/"
  [ -d .claude ] && cp -r .claude "$BACKUP_DIR/" && echo "✅ Backed up .claude/"
  [ -d knowledge ] && cp -r knowledge "$BACKUP_DIR/" && echo "✅ Backed up knowledge/"
fi
echo ""

# Step 2: Stash all local changes (including untracked)
echo "📦 Step 2: Stashing all local changes..."
STASH_MSG="Local changes before update $(date +%Y%m%d-%H%M%S)"
if git stash push -m "$STASH_MSG" --include-untracked 2>/dev/null; then
  echo "✅ Stashed local changes"
else
  echo "⚠️  No changes to stash (or stash failed)"
fi
echo ""

# Step 3: Pull from GitHub
echo "⬇️  Step 3: Pulling from GitHub..."
if git pull origin main --no-rebase; then
  echo "✅ Pulled from GitHub"
else
  echo "⚠️  Pull failed or no updates available"
fi
echo ""

# Step 4: Restore protected folders/files from backup
# CRITICAL: .cursor, .claude, knowledge are restored by OVERWRITE after pull,
# so git pull cannot strip them (folder exists but with fewer files = still restore).
echo "🔄 Step 4: Restoring protected folders/files from backup..."
if [ -n "$BACKUP_DIR" ] && [ -d "$BACKUP_DIR" ]; then
  # Always restore these from backup after pull (overwrite) — prevents stripped content
  for critical in .cursor .claude knowledge pm; do
    if [ -d "$BACKUP_DIR/$critical" ]; then
      rm -rf "$critical"
      cp -r "$BACKUP_DIR/$critical" . && echo "✅ Restored $critical/"
    fi
  done
  # Restore only if missing (don't overwrite)
  [ ! -d plan ] && [ -d "$BACKUP_DIR/plan" ] && cp -r "$BACKUP_DIR/plan" . && echo "✅ Restored plan/"
  [ ! -d supabase ] && [ -d "$BACKUP_DIR/supabase" ] && cp -r "$BACKUP_DIR/supabase" . && echo "✅ Restored supabase/"
  [ ! -f .env.local ] && [ -f "$BACKUP_DIR/.env.local" ] && cp "$BACKUP_DIR/.env.local" . && echo "✅ Restored .env.local"
fi
echo ""

# Step 5: Restore stashed changes
echo "📦 Step 5: Restoring stashed changes..."
if git stash list | grep -q "$STASH_MSG"; then
  if git stash pop 2>/dev/null; then
    echo "✅ Restored stashed changes"
  else
    echo "⚠️  Stash pop had conflicts (check manually)"
  fi
else
  echo "⚠️  No matching stash found"
fi
echo ""

# Step 6: Resolve conflicts (keep local for protected items)
echo "🔧 Step 6: Resolving conflicts (keeping local versions)..."
git checkout --ours .cursor/ 2>/dev/null && echo "✅ Kept local .cursor/" || true
git checkout --ours .claude/ 2>/dev/null && echo "✅ Kept local .claude/" || true
git checkout --ours knowledge/ 2>/dev/null && echo "✅ Kept local knowledge/" || true
git checkout --ours plan/ 2>/dev/null && echo "✅ Kept local plan/" || true
git checkout --ours pm/ 2>/dev/null && echo "✅ Kept local pm/" || true
git checkout --ours supabase/ 2>/dev/null && echo "✅ Kept local supabase/" || true
git checkout --ours .env.local 2>/dev/null && echo "✅ Kept local .env.local" || true
echo ""

# Step 7: Stage protected files/folders
echo "📝 Step 7: Staging protected files/folders..."
git add .cursor/ .claude/ knowledge/ plan/ pm/ supabase/ .env.local 2>/dev/null || true
echo "✅ Staged protected items"
echo ""

# Step 8: Verify all protected folders/files exist
echo "🔍 Step 8: Verifying protected folders/files..."
VERIFY_FAILED=0

[ ! -d .cursor ] && echo "❌ MISSING: .cursor/" && VERIFY_FAILED=1
[ ! -d .claude ] && echo "❌ MISSING: .claude/" && VERIFY_FAILED=1
[ ! -d knowledge ] && echo "❌ MISSING: knowledge/" && VERIFY_FAILED=1

if [ $VERIFY_FAILED -eq 0 ]; then
  echo "✅ All critical folders verified!"
  echo ""
  echo "✅ Update complete!"
  echo "   - Backup saved to: $BACKUP_DIR"
  echo "   - All protected items preserved"
  exit 0
else
  echo ""
  echo "⚠️  Some protected items are missing!"
  echo "   - Check backup: $BACKUP_DIR"
  echo "   - Run restore.sh if needed"
  exit 1
fi
