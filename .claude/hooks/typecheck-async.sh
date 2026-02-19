#!/bin/bash
# Async TypeScript type check after file edits (non-blocking)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check TypeScript files in src/
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

if [[ "$FILE_PATH" != *"/src/"* ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
RESULT=$(npx tsc --noEmit --pretty false 2>&1 | head -20)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  exit 0
else
  ERRORS=$(echo "$RESULT" | grep -c "error TS")
  echo "{\"systemMessage\": \"TypeCheck: ${ERRORS} type error(s). Run 'npx tsc --noEmit' for details.\"}"
fi
