#!/usr/bin/env bash
# Verify idea-validator after deploy. Set IDEA_VALIDATOR_URL and JWT before running.
# Usage: IDEA_VALIDATOR_URL=https://xxx.supabase.co/functions/v1/idea-validator JWT=eyJ... ./verify.sh

set -e
URL="${IDEA_VALIDATOR_URL:-http://127.0.0.1:54321/functions/v1/idea-validator}"

echo "=== OPTIONS ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$URL")
echo "Status: $STATUS"
test "$STATUS" = "204" || test "$STATUS" = "200" || { echo "Expected 204/200"; exit 1; }

echo ""
echo "=== POST without JWT (expect 401) ==="
RES=$(curl -s -w "\n%{http_code}" -X POST "$URL" -H "Content-Type: application/json" -d '{"action":"quick","idea_text":"Test"}')
BODY=$(echo "$RES" | head -n -1)
CODE=$(echo "$RES" | tail -n 1)
echo "Status: $CODE"
echo "$BODY" | head -c 200
echo ""
test "$CODE" = "401" || { echo "Expected 401 without JWT"; exit 1; }

if [ -n "$JWT" ]; then
  echo ""
  echo "=== POST quick with JWT (expect 200) ==="
  RES=$(curl -s -w "\n%{http_code}" -X POST "$URL" -H "Content-Type: application/json" -H "Authorization: Bearer $JWT" -d '{"action":"quick","idea_text":"B2B SaaS for idea validation"}')
  BODY=$(echo "$RES" | head -n -1)
  CODE=$(echo "$RES" | tail -n 1)
  echo "Status: $CODE"
  echo "$BODY" | head -c 400
  echo ""
  test "$CODE" = "200" || { echo "Expected 200 with valid JWT"; exit 1; }
  echo "$BODY" | grep -q '"score"' || { echo "Response should contain score"; exit 1; }
  echo "$BODY" | grep -q '"verdict"' || { echo "Response should contain verdict"; exit 1; }
fi

echo ""
echo "All checks passed."
