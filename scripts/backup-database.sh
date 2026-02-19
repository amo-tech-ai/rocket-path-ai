#!/bin/bash
# Database Backup Script - Before Pitch Deck Consolidation Migration
# Usage: ./scripts/backup-database.sh [local|remote]

set -e  # Exit on error

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ENV="${1:-local}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting database backup..."
echo "Environment: $ENV"
echo "Timestamp: $TIMESTAMP"
echo ""

if [ "$ENV" = "local" ]; then
  # Local backup using Supabase CLI
  echo "📊 Checking Supabase status..."
  if ! supabase status > /dev/null 2>&1; then
    echo "❌ Error: Supabase is not running locally"
    echo "   Start Supabase with: supabase start"
    exit 1
  fi

  # Get connection details from supabase status
  DB_PASSWORD=$(supabase status 2>/dev/null | grep "DB Password" | awk '{print $3}' || echo "")
  
  if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️  Warning: Could not extract DB password from supabase status"
    echo "   You may need to enter password manually"
  fi

  BACKUP_FILE="${BACKUP_DIR}/backup_local_${TIMESTAMP}.sql"
  
  echo "💾 Creating backup: $BACKUP_FILE"
  
  # Export full database
  if [ -n "$DB_PASSWORD" ]; then
    PGPASSWORD="$DB_PASSWORD" pg_dump \
      -h localhost \
      -p 54322 \
      -U postgres \
      -d postgres \
      --no-owner \
      --no-acl \
      -f "$BACKUP_FILE"
  else
    pg_dump \
      -h localhost \
      -p 54322 \
      -U postgres \
      -d postgres \
      --no-owner \
      --no-acl \
      -W \
      -f "$BACKUP_FILE"
  fi

  # Also export specific tables being migrated (for safety)
  BACKUP_TABLES_FILE="${BACKUP_DIR}/backup_pitch_deck_tables_${TIMESTAMP}.sql"
  echo "💾 Creating tables backup: $BACKUP_TABLES_FILE"
  
  if [ -n "$DB_PASSWORD" ]; then
    PGPASSWORD="$DB_PASSWORD" pg_dump \
      -h localhost \
      -p 54322 \
      -U postgres \
      -d postgres \
      -t pitch_deck_wizard_data \
      -t pitch_deck_generation_logs \
      -t pitch_deck_suggestions \
      -t pitch_deck_analytics \
      -t pitch_deck_shares \
      --no-owner \
      --no-acl \
      -f "$BACKUP_TABLES_FILE"
  else
    pg_dump \
      -h localhost \
      -p 54322 \
      -U postgres \
      -d postgres \
      -t pitch_deck_wizard_data \
      -t pitch_deck_generation_logs \
      -t pitch_deck_suggestions \
      -t pitch_deck_analytics \
      -t pitch_deck_shares \
      --no-owner \
      --no-acl \
      -W \
      -f "$BACKUP_TABLES_FILE"
  fi

elif [ "$ENV" = "remote" ]; then
  # Remote backup using Supabase CLI
  echo "📊 Checking Supabase link..."
  if ! supabase projects list > /dev/null 2>&1; then
    echo "❌ Error: Not linked to Supabase project"
    echo "   Link with: supabase link --project-ref <project-ref>"
    exit 1
  fi

  BACKUP_FILE="${BACKUP_DIR}/backup_remote_${TIMESTAMP}.sql"
  
  echo "💾 Creating remote backup: $BACKUP_FILE"
  supabase db dump -f "$BACKUP_FILE"
  
else
  echo "❌ Error: Invalid environment. Use 'local' or 'remote'"
  echo "   Usage: $0 [local|remote]"
  exit 1
fi

# Verify backup was created
if [ -f "$BACKUP_FILE" ]; then
  BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo ""
  echo "✅ Backup created successfully!"
  echo "   File: $BACKUP_FILE"
  echo "   Size: $BACKUP_SIZE"
  
  if [ "$ENV" = "local" ] && [ -f "$BACKUP_TABLES_FILE" ]; then
    TABLES_SIZE=$(du -h "$BACKUP_TABLES_FILE" | cut -f1)
    echo "   Tables backup: $BACKUP_TABLES_FILE"
    echo "   Tables size: $TABLES_SIZE"
  fi
  
  echo ""
  echo "📝 Next steps:"
  echo "   1. Review migration: supabase/migrations/20260127150030_consolidate_pitch_deck_tables_to_jsonb.sql"
  echo "   2. Apply migration: supabase db reset (local) or supabase db push (remote)"
  echo "   3. Verify data migration using queries in migration file"
else
  echo "❌ Error: Backup file was not created"
  exit 1
fi
