#!/usr/bin/env bash
# One-command Vector RAG verification (Step 0).
# Loads .env.local if present, then runs verify-vector-rag.mjs.
# Usage: ./scripts/run-vector-verification.sh   or   bash scripts/run-vector-verification.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
if [ -f "$ROOT/.env.local" ]; then
  export "$(grep -v '^#' "$ROOT/.env.local" | xargs)"
fi
cd "$ROOT"
node scripts/verify-vector-rag.mjs
