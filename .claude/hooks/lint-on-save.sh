#!/bin/bash
# Runs ESLint --fix on .ts/.tsx files after Edit/Write
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only lint TypeScript/TSX files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Skip non-src files (migrations, configs, etc.)
if [[ "$FILE_PATH" != *"/src/"* && "$FILE_PATH" != *"/supabase/functions/"* ]]; then
  exit 0
fi

RESULT=$(cd "$CLAUDE_PROJECT_DIR" && npx eslint --fix "$FILE_PATH" 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  exit 0
else
  ERRORS=$(echo "$RESULT" | grep -c "error")
  echo "{\"systemMessage\": \"ESLint: ${ERRORS} error(s) in $(basename "$FILE_PATH")\"}"
fi
