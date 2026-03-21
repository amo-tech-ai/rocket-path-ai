#!/bin/bash
# PreCompact hook: Save task state before context compression
# Outputs a summary that gets included in the compacted context

echo "=== Pre-compact state ==="
echo "Working dir: $(pwd)"
echo "Branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
echo "Modified files:"
git diff --name-only 2>/dev/null | head -10
echo "Staged files:"
git diff --cached --name-only 2>/dev/null | head -10
echo "=== End pre-compact state ==="
