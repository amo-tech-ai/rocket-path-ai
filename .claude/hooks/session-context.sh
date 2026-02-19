#!/bin/bash
# Re-inject critical context after compaction or session resume
cat <<'EOF'
Project: StartupAI (React 18 + Vite 5 + Supabase + Gemini 3)
Current phase: Frontend features for new schema (data strategy 100% complete)
Key conventions: @/ = ./src/, RLS on all tables, JWT on all edge functions
Gemini rules: G1 (responseJsonSchema), G2 (temp 1.0), G4 (x-goog-api-key header)
Edge function timeout: Promise.race (not AbortSignal.timeout)
Check lean/next-steps.md for current priorities
EOF
