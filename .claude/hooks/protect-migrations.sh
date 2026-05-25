#!/bin/bash
# PreToolUse hook: Warn before creating migration files or editing secrets
# Exit 0 = allow, Exit 2 = block with message

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

# Warn (not block) when writing env/secrets files. The Bash hook still prevents
# accidental shell-redirect writes (echo/cat > .env), which is the real risk.
# Editor tool writes are deliberate, so we just log and allow.
if [ "$TOOL" = "Write" ] && echo "$FILE_PATH" | grep -qE '\.env($|\.)'; then
  echo "NOTE: Writing env/secrets file: $FILE_PATH (review before commit)" >&2
fi

# Warn before creating migration files
if [ "$TOOL" = "Write" ] && echo "$FILE_PATH" | grep -q "supabase/migrations/"; then
  echo "Migration file creation detected: $FILE_PATH — verify this is intentional" >&2
  exit 0
fi

exit 0
