#!/bin/bash
# Block dangerous bash commands before execution
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Block destructive git commands
if echo "$COMMAND" | grep -qE 'git\s+(push\s+--force|reset\s+--hard|clean\s+-f)'; then
  echo "Blocked: destructive git command. Use safe alternatives or ask user." >&2
  exit 2
fi

# Block dropping tables/databases
if echo "$COMMAND" | grep -qiE 'DROP\s+(TABLE|DATABASE|SCHEMA)'; then
  echo "Blocked: DROP command detected. Run manually if needed." >&2
  exit 2
fi

# Block rm -rf on important directories
if echo "$COMMAND" | grep -qE 'rm\s+-rf\s+(\/|src|supabase|\.claude|\.agents)'; then
  echo "Blocked: dangerous rm -rf on protected directory." >&2
  exit 2
fi

# Block editing .env files directly
if echo "$COMMAND" | grep -qE '(cat|echo|printf).*>.*\.env'; then
  echo "Blocked: direct .env modification. Edit .env files manually." >&2
  exit 2
fi

exit 0
