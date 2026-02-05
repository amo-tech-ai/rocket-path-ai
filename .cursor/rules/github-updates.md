# Safe GitHub Update - Preserve Local Files (StartupAI16)

When updating from GitHub, **NEVER DELETE** protected folders and files. Always preserve local changes.

## Repository

| What | Value |
|------|--------|
| **Origin** | `https://github.com/amo-tech-ai/rocket-path-ai.git` |
| **Default branch** | `main` |
| **Backup before** | Always run `./backup.sh` before pull; restore from `.backup-YYYYMMDD-HHMMSS` if needed. |

**Context files to preserve (reference for agents):** `index.md`, `notes.md`, `summary.md`, `system.md`, `skills.md`, `tasks-archive/`, `tasks-draft/`, `.agents/` — all protected below.

## 🛠️ Quick Scripts

### Main Command: `./github-update.sh`

**Complete automated workflow:**
- Creates backup automatically
- Stashes all changes
- Pulls from GitHub
- Restores protected files if missing
- Resolves conflicts (keeps local versions)
- Verifies all protected items exist

**Usage:**
```bash
# Single command does everything
./github-update.sh
```

**What it does:**
1. ✅ Creates backup (uses `backup.sh` if available)
2. ✅ Stashes all local changes (including untracked)
3. ✅ Pulls from GitHub (`git pull origin main --no-rebase`)
4. ✅ Restores protected folders/files if missing
5. ✅ Restores stashed changes
6. ✅ Resolves conflicts (keeps local for protected items)
7. ✅ Stages protected files/folders
8. ✅ Verifies all critical items exist

**Scripts are executable and ready to use:**
- ✅ `github-update.sh` - **Main command** (complete workflow)
- ✅ `backup.sh` - Creates `.backup-YYYYMMDD-HHMMSS/` directory
- ✅ `restore.sh` - Restores from backup directory

### Individual Scripts (if needed)

**Backup Script:** `./backup.sh`
- Creates timestamped backup before GitHub update
- Verifies all protected items are backed up
- **Location:** Project root (`/home/sk/startupai16/backup.sh`)

**Restore Script:** `./restore.sh [backup-directory]`
- Restores protected folders/files from backup
- Auto-detects latest backup if no directory specified
- Verifies restoration success
- **Location:** Project root (`/home/sk/startupai16/restore.sh`)

**Manual Usage (if not using github-update.sh):**
```bash
# 1. Create backup before update
./backup.sh

# 2. Update from GitHub (see workflow below)

# 3. If files were deleted, restore from backup
./restore.sh  # Uses latest backup automatically

# Or specify backup directory
./restore.sh .backup-20260121-182200
```

## ⚠️ CRITICAL RULES

1. **NEVER DELETE** `.cursor/` folder (includes all rules, especially `github-update.mdc` and `github-updates.md`)
2. **NEVER DELETE** `.claude/` folder (Claude skills, commands, agents, documentation)
3. **NEVER DELETE** `plan/` folder (implementation plans, feature specs)
4. **NEVER DELETE** `pm/` folder (project management, progress tracker, notes, audits)
5. **NEVER DELETE** `supabase/` folder (schema files, migrations, docs, functions, events, seeds)
6. **NEVER DELETE** `screenshots/` folder (design references, UI mockups - note: no hyphen)
7. **NEVER DELETE** `docs/` folder (local documentation - but note: `docs/` updates from GitHub/Lovable per main rule)
8. **NEVER DELETE** `prompts/` folder (implementation prompts)
9. **NEVER DELETE** `tasks/` folder (task documentation, specs, **including `tasks/events/`**)
10. **NEVER DELETE** `scripts/` folder (utility scripts, automation scripts, migration scripts)
11. **NEVER DELETE** `figma/` or `figma-2/` folders (Figma design system exports)
12. **NEVER DELETE** `claude-reference/` or `claude-sdk/` folders (Claude documentation)
13. **NEVER DELETE** `notes/` folder (project notes, Obsidian vaults)
14. **NEVER DELETE** `roadmap/` folder (product roadmap files)
15. **NEVER DELETE** `website/` folder (website assets, documentation)
16. **NEVER DELETE** `knowledge/` folder (Claude Gemini Supabase reference documentation)
16. **NEVER DELETE** `CLAUDE.md`, `claude.md`, or `prd.md` files
17. **NEVER DELETE** `roadmap.md` file
18. **NEVER DELETE** `skills.md` file
19. **NEVER DELETE** `index.md` file
20. **NEVER DELETE** `notes.md` file (root session notes)
21. **NEVER DELETE** `summary.md` file (project summary)
22. **NEVER DELETE** `system.md` file (system/phase definitions)
23. **NEVER DELETE** `CHANGELOG.md` file (merge with GitHub per procedure below)
24. **NEVER DELETE** `tasks-archive/` folder (archived task docs)
25. **NEVER DELETE** `tasks-draft/` folder (draft prompts/data)
26. **NEVER DELETE** `.agents/` folder (agent skills/specs); **NEVER DELETE** `.agent/` folder if present
27. **NEVER DELETE** `.env.local`, `.mcp.json`, `.gitignore` files
28. **NEVER DELETE** Configuration files: `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `playwright.config.ts`, `vitest.config.ts`, `eslint.config.js`, `components.json`
29. **NEVER DELETE** Documentation files: `README.md`, `CHANGELOG.md`, `QUICK-AUTH-CLOUDINARY.md`, `SIMPLE-AUTH.md`, `TEST-CLOUDINARY-MCP.md`, `README-PRODUCTION-READY.md`, `IMPLEMENTATION-COMPLETE.md`
30. **NEVER DELETE** `CLAUDE.local.md` file (personal Claude settings, git-ignored)
31. **ALWAYS preserve local changes** - Local work takes precedence
32. **Stash ALL changes** (tracked + untracked) before pulling
33. **Restore ALL stashed changes** after pulling
34. **VERIFY all protected folders/files exist** after restore

## ⚠️ Why Restore Was Skipped (and Fix)

**Previous behavior:** The script only restored a folder when it was **completely missing** (`[ ! -d .cursor ]`). So:

- If **git pull** overwrote `.cursor`, `.claude`, or `knowledge` with **fewer files** (e.g. remote had a stripped version), the folder still existed → condition false → **restore was skipped**.
- Result: You kept stripped content instead of the backup.

**Fix:** `.cursor`, `.claude`, and `knowledge` are now **always restored from backup after pull** (overwrite), so pull cannot leave you with stripped content. Other protected items (plan, pm, supabase, etc.) still use "restore only if missing."

**If you already ran an update and lost content:** Run `./restore.sh` (uses latest `.backup-*`) to overwrite from backup, or restore manually from a specific backup directory.

## 📋 CHANGELOG merge (local + GitHub)

When pulling from `origin` (rocket-path-ai), **CHANGELOG.md** may conflict or differ. Prefer **local** and merge remote entries only if needed.

**Procedure:**
1. **After pull:** If CHANGELOG.md is restored from backup, you already have local. If you want to merge remote additions: `git show origin/main:CHANGELOG.md > /tmp/changelog-remote.md`, then manually copy any **new** `## [x.y.z]` sections from `/tmp/changelog-remote.md` into your local CHANGELOG (above existing entries).
2. **On conflict:** `git checkout --ours CHANGELOG.md` to keep local; then optionally add remote-only sections by hand.
3. **Before push:** Ensure local CHANGELOG has all entries you want; push will overwrite remote.

**Rule:** Local CHANGELOG is source of truth after update. Supabase and app changes are reflected in local entries; keep them.

## 🔄 Safe Update Workflow

```bash
# 1. Backup critical folders and files
BACKUP_DIR=".backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Backing up protected folders and files to $BACKUP_DIR..."

# Protected folders (matching startupai16 structure)
[ -d .cursor ] && cp -r .cursor "$BACKUP_DIR/" && echo "✅ Backed up .cursor/"
[ -d .claude ] && cp -r .claude "$BACKUP_DIR/" && echo "✅ Backed up .claude/"
[ -d plan ] && cp -r plan "$BACKUP_DIR/" && echo "✅ Backed up plan/"
[ -d pm ] && cp -r pm "$BACKUP_DIR/" && echo "✅ Backed up pm/"
[ -d supabase ] && cp -r supabase "$BACKUP_DIR/" && echo "✅ Backed up supabase/"
[ -d screenshots ] && cp -r screenshots "$BACKUP_DIR/" && echo "✅ Backed up screenshots/"
[ -d prompts ] && cp -r prompts "$BACKUP_DIR/" && echo "✅ Backed up prompts/"
[ -d tasks ] && cp -r tasks "$BACKUP_DIR/" && echo "✅ Backed up tasks/"
[ -d scripts ] && cp -r scripts "$BACKUP_DIR/" && echo "✅ Backed up scripts/"
[ -d figma ] && cp -r figma "$BACKUP_DIR/" && echo "✅ Backed up figma/"
[ -d figma-2 ] && cp -r figma-2 "$BACKUP_DIR/" && echo "✅ Backed up figma-2/"
[ -d claude-reference ] && cp -r claude-reference "$BACKUP_DIR/" && echo "✅ Backed up claude-reference/"
[ -d claude-sdk ] && cp -r claude-sdk "$BACKUP_DIR/" && echo "✅ Backed up claude-sdk/"
[ -d notes ] && cp -r notes "$BACKUP_DIR/" && echo "✅ Backed up notes/"
[ -d roadmap ] && cp -r roadmap "$BACKUP_DIR/" && echo "✅ Backed up roadmap/"
[ -d website ] && cp -r website "$BACKUP_DIR/" && echo "✅ Backed up website/"
[ -d facts ] && cp -r facts "$BACKUP_DIR/" && echo "✅ Backed up facts/"
[ -d knowledge ] && cp -r knowledge "$BACKUP_DIR/" && echo "✅ Backed up knowledge/"

# Protected files
[ -f CLAUDE.md ] && cp CLAUDE.md "$BACKUP_DIR/" && echo "✅ Backed up CLAUDE.md"
[ -f claude.md ] && cp claude.md "$BACKUP_DIR/" && echo "✅ Backed up claude.md"
[ -f roadmap.md ] && cp roadmap.md "$BACKUP_DIR/" && echo "✅ Backed up roadmap.md"
[ -f prd.md ] && cp prd.md "$BACKUP_DIR/" && echo "✅ Backed up prd.md"
[ -f skills.md ] && cp skills.md "$BACKUP_DIR/" && echo "✅ Backed up skills.md"
[ -f index.md ] && cp index.md "$BACKUP_DIR/" && echo "✅ Backed up index.md"
[ -f notes.md ] && cp notes.md "$BACKUP_DIR/" && echo "✅ Backed up notes.md"
[ -f summary.md ] && cp summary.md "$BACKUP_DIR/" && echo "✅ Backed up summary.md"
[ -f system.md ] && cp system.md "$BACKUP_DIR/" && echo "✅ Backed up system.md"
[ -f CHANGELOG.md ] && cp CHANGELOG.md "$BACKUP_DIR/" && echo "✅ Backed up CHANGELOG.md"
[ -d tasks-archive ] && cp -r tasks-archive "$BACKUP_DIR/" && echo "✅ Backed up tasks-archive/"
[ -d tasks-draft ] && cp -r tasks-draft "$BACKUP_DIR/" && echo "✅ Backed up tasks-draft/"
[ -d .agents ] && cp -r .agents "$BACKUP_DIR/" && echo "✅ Backed up .agents/"
[ -d .agent ] && cp -r .agent "$BACKUP_DIR/" && echo "✅ Backed up .agent/"
[ -f .env.local ] && cp .env.local "$BACKUP_DIR/" && echo "✅ Backed up .env.local"
[ -f .mcp.json ] && cp .mcp.json "$BACKUP_DIR/" && echo "✅ Backed up .mcp.json"
[ -f CLAUDE.local.md ] && cp CLAUDE.local.md "$BACKUP_DIR/" && echo "✅ Backed up CLAUDE.local.md"
[ -f AGENTS.md ] && cp AGENTS.md "$BACKUP_DIR/" 2>/dev/null && echo "✅ Backed up AGENTS.md"
[ -f progress-tracker.md ] && cp progress-tracker.md "$BACKUP_DIR/" 2>/dev/null && echo "✅ Backed up progress-tracker.md"
[ -f IMPLEMENTATION_PLAN.md ] && cp IMPLEMENTATION_PLAN.md "$BACKUP_DIR/" 2>/dev/null && echo "✅ Backed up IMPLEMENTATION_PLAN.md"
[ -f TASKS_TABLE.md ] && cp TASKS_TABLE.md "$BACKUP_DIR/" 2>/dev/null && echo "✅ Backed up TASKS_TABLE.md"
[ -f style-guide.md ] && cp style-guide.md "$BACKUP_DIR/" 2>/dev/null && echo "✅ Backed up style-guide.md"
[ -f README.md ] && cp README.md "$BACKUP_DIR/" 2>/dev/null && echo "✅ Backed up README.md"

# 2. Stash ALL local changes (including untracked)
echo "📦 Stashing all local changes..."
git stash push -m "Local changes before update $(date +%Y%m%d-%H%M%S)" --include-untracked

# 3. Pull from GitHub
echo "⬇️ Pulling from GitHub..."
git pull origin main --no-rebase

# 4. Restore critical folders/files from backup
# IMPORTANT: .cursor, .claude, knowledge are restored by OVERWRITE (not "if missing").
# Otherwise git pull can overwrite them with fewer files and the script skips restore
# because the folder still exists. See "Why restore was skipped" below.
echo "🔄 Restoring protected folders/files from backup..."
for critical in .cursor .claude knowledge; do
  [ -d "$BACKUP_DIR/$critical" ] && rm -rf "$critical" && cp -r "$BACKUP_DIR/$critical" . && echo "✅ Restored $critical/"
done
[ ! -d plan ] && [ -d "$BACKUP_DIR/plan" ] && cp -r "$BACKUP_DIR/plan" . && echo "✅ Restored plan/"
[ ! -d pm ] && [ -d "$BACKUP_DIR/pm" ] && cp -r "$BACKUP_DIR/pm" . && echo "✅ Restored pm/"
[ ! -d supabase ] && [ -d "$BACKUP_DIR/supabase" ] && cp -r "$BACKUP_DIR/supabase" . && echo "✅ Restored supabase/"
[ ! -d screenshots ] && [ -d "$BACKUP_DIR/screenshots" ] && cp -r "$BACKUP_DIR/screenshots" . && echo "✅ Restored screenshots/"
[ ! -d prompts ] && [ -d "$BACKUP_DIR/prompts" ] && cp -r "$BACKUP_DIR/prompts" . && echo "✅ Restored prompts/"
[ ! -d tasks ] && [ -d "$BACKUP_DIR/tasks" ] && cp -r "$BACKUP_DIR/tasks" . && echo "✅ Restored tasks/"
[ ! -d scripts ] && [ -d "$BACKUP_DIR/scripts" ] && cp -r "$BACKUP_DIR/scripts" . && echo "✅ Restored scripts/"
[ ! -d figma ] && [ -d "$BACKUP_DIR/figma" ] && cp -r "$BACKUP_DIR/figma" . && echo "✅ Restored figma/"
[ ! -d figma-2 ] && [ -d "$BACKUP_DIR/figma-2" ] && cp -r "$BACKUP_DIR/figma-2" . && echo "✅ Restored figma-2/"
[ ! -d claude-reference ] && [ -d "$BACKUP_DIR/claude-reference" ] && cp -r "$BACKUP_DIR/claude-reference" . && echo "✅ Restored claude-reference/"
[ ! -d claude-sdk ] && [ -d "$BACKUP_DIR/claude-sdk" ] && cp -r "$BACKUP_DIR/claude-sdk" . && echo "✅ Restored claude-sdk/"
[ ! -d notes ] && [ -d "$BACKUP_DIR/notes" ] && cp -r "$BACKUP_DIR/notes" . && echo "✅ Restored notes/"
[ ! -d roadmap ] && [ -d "$BACKUP_DIR/roadmap" ] && cp -r "$BACKUP_DIR/roadmap" . && echo "✅ Restored roadmap/"
[ ! -d website ] && [ -d "$BACKUP_DIR/website" ] && cp -r "$BACKUP_DIR/website" . && echo "✅ Restored website/"
[ ! -d facts ] && [ -d "$BACKUP_DIR/facts" ] && cp -r "$BACKUP_DIR/facts" . && echo "✅ Restored facts/"
[ ! -d knowledge ] && [ -d "$BACKUP_DIR/knowledge" ] && cp -r "$BACKUP_DIR/knowledge" . && echo "✅ Restored knowledge/"

# Restore protected files if missing
[ ! -f CLAUDE.md ] && [ -f "$BACKUP_DIR/CLAUDE.md" ] && cp "$BACKUP_DIR/CLAUDE.md" . && echo "✅ Restored CLAUDE.md"
[ ! -f claude.md ] && [ -f "$BACKUP_DIR/claude.md" ] && cp "$BACKUP_DIR/claude.md" . && echo "✅ Restored claude.md"
[ ! -f roadmap.md ] && [ -f "$BACKUP_DIR/roadmap.md" ] && cp "$BACKUP_DIR/roadmap.md" . && echo "✅ Restored roadmap.md"
[ ! -f prd.md ] && [ -f "$BACKUP_DIR/prd.md" ] && cp "$BACKUP_DIR/prd.md" . && echo "✅ Restored prd.md"
[ ! -f skills.md ] && [ -f "$BACKUP_DIR/skills.md" ] && cp "$BACKUP_DIR/skills.md" . && echo "✅ Restored skills.md"
[ ! -f index.md ] && [ -f "$BACKUP_DIR/index.md" ] && cp "$BACKUP_DIR/index.md" . && echo "✅ Restored index.md"
[ ! -f notes.md ] && [ -f "$BACKUP_DIR/notes.md" ] && cp "$BACKUP_DIR/notes.md" . && echo "✅ Restored notes.md"
[ ! -f summary.md ] && [ -f "$BACKUP_DIR/summary.md" ] && cp "$BACKUP_DIR/summary.md" . && echo "✅ Restored summary.md"
[ ! -f system.md ] && [ -f "$BACKUP_DIR/system.md" ] && cp "$BACKUP_DIR/system.md" . && echo "✅ Restored system.md"
[ ! -f CHANGELOG.md ] && [ -f "$BACKUP_DIR/CHANGELOG.md" ] && cp "$BACKUP_DIR/CHANGELOG.md" . && echo "✅ Restored CHANGELOG.md"
[ ! -d tasks-archive ] && [ -d "$BACKUP_DIR/tasks-archive" ] && cp -r "$BACKUP_DIR/tasks-archive" . && echo "✅ Restored tasks-archive/"
[ ! -d tasks-draft ] && [ -d "$BACKUP_DIR/tasks-draft" ] && cp -r "$BACKUP_DIR/tasks-draft" . && echo "✅ Restored tasks-draft/"
[ ! -d .agents ] && [ -d "$BACKUP_DIR/.agents" ] && cp -r "$BACKUP_DIR/.agents" . && echo "✅ Restored .agents/"
[ ! -d .agent ] && [ -d "$BACKUP_DIR/.agent" ] && cp -r "$BACKUP_DIR/.agent" . && echo "✅ Restored .agent/"
[ ! -f .env.local ] && [ -f "$BACKUP_DIR/.env.local" ] && cp "$BACKUP_DIR/.env.local" . && echo "✅ Restored .env.local"
[ ! -f .mcp.json ] && [ -f "$BACKUP_DIR/.mcp.json" ] && cp "$BACKUP_DIR/.mcp.json" . && echo "✅ Restored .mcp.json"
[ ! -f CLAUDE.local.md ] && [ -f "$BACKUP_DIR/CLAUDE.local.md" ] && cp "$BACKUP_DIR/CLAUDE.local.md" . && echo "✅ Restored CLAUDE.local.md"
[ ! -f AGENTS.md ] && [ -f "$BACKUP_DIR/AGENTS.md" ] && cp "$BACKUP_DIR/AGENTS.md" . 2>/dev/null && echo "✅ Restored AGENTS.md"
[ ! -f progress-tracker.md ] && [ -f "$BACKUP_DIR/progress-tracker.md" ] && cp "$BACKUP_DIR/progress-tracker.md" . 2>/dev/null && echo "✅ Restored progress-tracker.md"
[ ! -f IMPLEMENTATION_PLAN.md ] && [ -f "$BACKUP_DIR/IMPLEMENTATION_PLAN.md" ] && cp "$BACKUP_DIR/IMPLEMENTATION_PLAN.md" . 2>/dev/null && echo "✅ Restored IMPLEMENTATION_PLAN.md"
[ ! -f TASKS_TABLE.md ] && [ -f "$BACKUP_DIR/TASKS_TABLE.md" ] && cp "$BACKUP_DIR/TASKS_TABLE.md" . 2>/dev/null && echo "✅ Restored TASKS_TABLE.md"
[ ! -f style-guide.md ] && [ -f "$BACKUP_DIR/style-guide.md" ] && cp "$BACKUP_DIR/style-guide.md" . 2>/dev/null && echo "✅ Restored style-guide.md"
[ ! -f README.md ] && [ -f "$BACKUP_DIR/README.md" ] && cp "$BACKUP_DIR/README.md" . 2>/dev/null && echo "✅ Restored README.md"

# 5. Restore ALL stashed changes
echo "📦 Restoring stashed changes..."
git stash pop

# 6. For conflicts in protected files: ALWAYS keep local
echo "🔧 Resolving conflicts (keeping local versions)..."
git checkout --ours .cursor/ 2>/dev/null && echo "✅ Kept local .cursor/"
git checkout --ours .claude/ 2>/dev/null && echo "✅ Kept local .claude/"
git checkout --ours plan/ 2>/dev/null && echo "✅ Kept local plan/"
git checkout --ours pm/ 2>/dev/null && echo "✅ Kept local pm/"
git checkout --ours supabase/ 2>/dev/null && echo "✅ Kept local supabase/"
git checkout --ours screenshots/ 2>/dev/null && echo "✅ Kept local screenshots/"
git checkout --ours prompts/ 2>/dev/null && echo "✅ Kept local prompts/"
git checkout --ours tasks/ 2>/dev/null && echo "✅ Kept local tasks/"
git checkout --ours scripts/ 2>/dev/null && echo "✅ Kept local scripts/"
git checkout --ours figma/ 2>/dev/null && echo "✅ Kept local figma/"
git checkout --ours figma-2/ 2>/dev/null && echo "✅ Kept local figma-2/"
git checkout --ours claude-reference/ 2>/dev/null && echo "✅ Kept local claude-reference/"
git checkout --ours claude-sdk/ 2>/dev/null && echo "✅ Kept local claude-sdk/"
git checkout --ours notes/ 2>/dev/null && echo "✅ Kept local notes/"
git checkout --ours roadmap/ 2>/dev/null && echo "✅ Kept local roadmap/"
git checkout --ours website/ 2>/dev/null && echo "✅ Kept local website/"
git checkout --ours facts/ 2>/dev/null && echo "✅ Kept local facts/"
git checkout --ours knowledge/ 2>/dev/null && echo "✅ Kept local knowledge/"
git checkout --ours CLAUDE.md 2>/dev/null && echo "✅ Kept local CLAUDE.md"
git checkout --ours claude.md 2>/dev/null && echo "✅ Kept local claude.md"
git checkout --ours roadmap.md 2>/dev/null && echo "✅ Kept local roadmap.md"
git checkout --ours prd.md 2>/dev/null && echo "✅ Kept local prd.md"
git checkout --ours skills.md 2>/dev/null && echo "✅ Kept local skills.md"
git checkout --ours index.md 2>/dev/null && echo "✅ Kept local index.md"
git checkout --ours notes.md 2>/dev/null && echo "✅ Kept local notes.md"
git checkout --ours summary.md 2>/dev/null && echo "✅ Kept local summary.md"
git checkout --ours system.md 2>/dev/null && echo "✅ Kept local system.md"
git checkout --ours CHANGELOG.md 2>/dev/null && echo "✅ Kept local CHANGELOG.md"
git checkout --ours tasks-archive/ 2>/dev/null && echo "✅ Kept local tasks-archive/"
git checkout --ours tasks-draft/ 2>/dev/null && echo "✅ Kept local tasks-draft/"
git checkout --ours .agents/ 2>/dev/null && echo "✅ Kept local .agents/"
git checkout --ours .agent/ 2>/dev/null && echo "✅ Kept local .agent/"
git checkout --ours .env.local 2>/dev/null && echo "✅ Kept local .env.local"
git checkout --ours .mcp.json 2>/dev/null && echo "✅ Kept local .mcp.json"
git checkout --ours CLAUDE.local.md 2>/dev/null && echo "✅ Kept local CLAUDE.local.md"
git checkout --ours AGENTS.md 2>/dev/null && echo "✅ Kept local AGENTS.md"
git checkout --ours progress-tracker.md 2>/dev/null && echo "✅ Kept local progress-tracker.md"
git checkout --ours IMPLEMENTATION_PLAN.md 2>/dev/null && echo "✅ Kept local IMPLEMENTATION_PLAN.md"
git checkout --ours TASKS_TABLE.md 2>/dev/null && echo "✅ Kept local TASKS_TABLE.md"
git checkout --ours style-guide.md 2>/dev/null && echo "✅ Kept local style-guide.md"
git checkout --ours README.md 2>/dev/null && echo "✅ Kept local README.md"

# Stage protected files/folders
git add .cursor/ .claude/ plan/ pm/ supabase/ screenshots/ prompts/ tasks/ tasks-archive/ tasks-draft/ .agents/ .agent/ scripts/ figma/ figma-2/ claude-reference/ claude-sdk/ notes/ roadmap/ website/ facts/ knowledge/ CLAUDE.md claude.md CLAUDE.local.md roadmap.md prd.md skills.md index.md notes.md summary.md system.md CHANGELOG.md .env.local .mcp.json AGENTS.md progress-tracker.md IMPLEMENTATION_PLAN.md TASKS_TABLE.md style-guide.md README.md 2>/dev/null

# 7. VERIFY all protected folders/files exist
echo "🔍 Verifying protected folders/files..."
VERIFY_FAILED=0
[ ! -d .cursor ] && echo "❌ MISSING: .cursor/" && VERIFY_FAILED=1
[ ! -d .claude ] && echo "❌ MISSING: .claude/" && VERIFY_FAILED=1
[ ! -d plan ] && echo "❌ MISSING: plan/" && VERIFY_FAILED=1
[ ! -d pm ] && echo "❌ MISSING: pm/" && VERIFY_FAILED=1
[ ! -d supabase ] && echo "❌ MISSING: supabase/" && VERIFY_FAILED=1
[ ! -d screenshots ] && echo "❌ MISSING: screenshots/" && VERIFY_FAILED=1
[ ! -d prompts ] && echo "❌ MISSING: prompts/" && VERIFY_FAILED=1
[ ! -d tasks ] && echo "❌ MISSING: tasks/" && VERIFY_FAILED=1
[ ! -d scripts ] && echo "⚠️  MISSING: scripts/ (may not exist)" || echo "✅ Verified: scripts/"
[ ! -d figma ] && echo "❌ MISSING: figma/" && VERIFY_FAILED=1
[ ! -d website ] && echo "❌ MISSING: website/" && VERIFY_FAILED=1
[ ! -d roadmap ] && echo "❌ MISSING: roadmap/" && VERIFY_FAILED=1
[ ! -f roadmap.md ] && echo "❌ MISSING: roadmap.md" && VERIFY_FAILED=1
[ ! -f index.md ] && echo "❌ MISSING: index.md" && VERIFY_FAILED=1
[ ! -f notes.md ] && echo "❌ MISSING: notes.md" && VERIFY_FAILED=1
[ ! -f prd.md ] && echo "❌ MISSING: prd.md" && VERIFY_FAILED=1
[ ! -f skills.md ] && echo "❌ MISSING: skills.md" && VERIFY_FAILED=1

if [ $VERIFY_FAILED -eq 0 ]; then
  echo "✅ All protected folders/files verified!"
else
  echo "⚠️ Some protected items are missing. Check backup: $BACKUP_DIR"
fi

echo "✅ Update complete! Backup saved to: $BACKUP_DIR"
```

## 🛡️ Protected Folders & Files (NEVER DELETE)

### **CRITICAL Folders** (Local work takes precedence)
- `.cursor/` - **CRITICAL** Cursor configuration and rules (including `github-update.mdc` and `github-updates.md`)
- `.claude/` - **CRITICAL** Claude skills, commands, agents, and documentation
- `supabase/` - **CRITICAL** Supabase schema files, migrations, docs, functions, events, seeds
- `plan/` - **CRITICAL** Planning documents, implementation plans, feature specs
- `pm/` - **CRITICAL** Project management, progress tracker, notes, audits
- `prompts/` - **CRITICAL** Prompt templates and configurations
- `screenshots/` - **CRITICAL** Screenshot references (note: no hyphen, different from other project)
- `tasks/` - **CRITICAL** Task tracking and project management (**including `tasks/events/`**)
- `scripts/` - **CRITICAL** Utility scripts, automation scripts, migration scripts
- `figma/` - **CRITICAL** Figma design system exports
- `figma-2/` - **CRITICAL** Figma design system v2 exports
- `claude-reference/` - **CRITICAL** Claude API reference documentation
- `claude-sdk/` - **CRITICAL** Claude SDK documentation
- `notes/` - **CRITICAL** Project notes, Obsidian vaults
- `roadmap/` - **CRITICAL** Product roadmap files
- `website/` - **CRITICAL** Website documentation and content
- `facts/` - **CRITICAL** Claude reference documentation
- `knowledge/` - **CRITICAL** Claude Gemini Supabase reference documentation
- `tasks-archive/` - **CRITICAL** Archived task docs (do not delete)
- `tasks-draft/` - **CRITICAL** Draft prompts and data (do not delete)
- `.agents/` - **CRITICAL** Agent skills and specs (do not delete)
- `.agent/` - **CRITICAL** Agent workflow docs (if present; do not delete)

**Note:** `docs/` is **NOT protected** - it updates from GitHub/Lovable per main `github-update.mdc` rule.

### **CRITICAL Files** (Local work takes precedence)
- `CLAUDE.md` - Claude documentation (uppercase)
- `claude.md` - Claude documentation (lowercase, if exists)
- `CLAUDE.local.md` - **CRITICAL** Personal Claude settings (git-ignored)
- `roadmap.md` - **CRITICAL** Roadmap and implementation planning document
- `prd.md` - **CRITICAL** Product Requirements Document
- `skills.md` - **CRITICAL** AI Skills Master Index
- `index.md` - **CRITICAL** Project navigation hub
- `notes.md` - **CRITICAL** Root session notes
- `summary.md` - **CRITICAL** Project summary (StartupAI overview)
- `system.md` - **CRITICAL** System/phase definitions (PRD → diagrams → tasks)
- `CHANGELOG.md` - **CRITICAL** Changelog (merge local + GitHub per procedure below)
- `.env.local` - **CRITICAL** Secrets (Critical!)
- `.mcp.json` - **CRITICAL** MCP server configuration
- `AGENTS.md` - Agents documentation (if exists)
- `progress-tracker.md` - Progress tracking (if exists)
- `IMPLEMENTATION_PLAN.md` - Implementation plan (if exists)
- `TASKS_TABLE.md` - Tasks table (if exists)
- `style-guide.md` - Style guide (if exists)
- `README.md` - Project README

## 🔧 Conflict Resolution

**For protected folders (`.cursor/`, `.claude/`, `plan/`, `pm/`, `supabase/`, `screenshots/`, `prompts/`, `tasks/`, `tasks-archive/`, `tasks-draft/`, `.agents/`, `.agent/`, `figma/`, `figma-2/`, `claude-reference/`, `claude-sdk/`, `notes/`, `roadmap/`, `website/`, `facts/`):**
- **ALWAYS keep local version**
```bash
git checkout --ours .cursor/
git checkout --ours .claude/
git checkout --ours plan/
git checkout --ours pm/
git checkout --ours supabase/
git checkout --ours screenshots/
git checkout --ours prompts/
git checkout --ours tasks/
git checkout --ours tasks-archive/
git checkout --ours tasks-draft/
git checkout --ours .agents/
git checkout --ours .agent/
git checkout --ours figma/
git checkout --ours figma-2/
git checkout --ours claude-reference/
git checkout --ours claude-sdk/
git checkout --ours notes/
git checkout --ours roadmap/
git checkout --ours website/
git checkout --ours facts/
git checkout --ours knowledge/
```

**For protected files (`CLAUDE.md`, `claude.md`, `roadmap.md`, `prd.md`, `skills.md`, `index.md`, `notes.md`, `summary.md`, `system.md`, `CHANGELOG.md`, `.env.local`, `.mcp.json`, etc.):**
- **ALWAYS keep local version**
```bash
git checkout --ours CLAUDE.md
git checkout --ours claude.md
git checkout --ours roadmap.md
git checkout --ours prd.md
git checkout --ours skills.md
git checkout --ours index.md
git checkout --ours notes.md
git checkout --ours summary.md
git checkout --ours system.md
git checkout --ours CHANGELOG.md
git checkout --ours .env.local
git checkout --ours .mcp.json
git checkout --ours CLAUDE.local.md
git checkout --ours tasks-archive/
git checkout --ours tasks-draft/
git checkout --ours .agents/
git checkout --ours .agent/
```

**For source code conflicts:**
- Prefer local if unsure
- Review both versions manually

## ❌ NEVER DO

- ❌ `git reset --hard` (destroys local changes)
- ❌ `git clean -fd` (deletes untracked files)
- ❌ Delete `.cursor/`, `.claude/`, `plan/`, `pm/`, `supabase/`, `screenshots/`, `prompts/`, `tasks/`, `figma/`, `figma-2/`, `claude-reference/`, `claude-sdk/`, `notes/`, `roadmap/`, `website/`, `facts/`, or `knowledge/` folders
- ❌ Delete `CLAUDE.md`, `claude.md`, `CLAUDE.local.md`, `roadmap.md`, `prd.md`, `skills.md`, `index.md`, `notes.md`, `summary.md`, `system.md`, `CHANGELOG.md`, `.env.local`, `.mcp.json`, `AGENTS.md`, `progress-tracker.md`, `IMPLEMENTATION_PLAN.md`, `TASKS_TABLE.md`, `style-guide.md`, or `README.md` files
- ❌ Delete `tasks-archive/`, `tasks-draft/`, `.agents/`, or `.agent/` folders
- ❌ Skip backup step
- ❌ Skip restoring stashed changes
- ❌ Skip verification step

## ✅ ALWAYS DO

- ✅ Backup before update (all protected folders/files)
- ✅ Stash with `--include-untracked`
- ✅ Restore critical folders/files if missing after pull
- ✅ **Restore ALL stashed changes** after pull
- ✅ Keep local versions for protected files/folders
- ✅ **VERIFY all protected folders/files exist** after restore
- ✅ Check backup directory if verification fails

## 🚨 Emergency Restore

If folders/files are deleted:

```bash
# Find latest backup directory
BACKUP_DIR=$(ls -td .backup-* 2>/dev/null | head -1)
if [ -z "$BACKUP_DIR" ]; then
  echo "❌ No backup directory found!"
  exit 1
fi
echo "📦 Restoring from: $BACKUP_DIR"

# Restore protected folders
[ -d "$BACKUP_DIR/.cursor" ] && cp -r "$BACKUP_DIR/.cursor" . && echo "✅ Restored .cursor/"
[ -d "$BACKUP_DIR/.claude" ] && cp -r "$BACKUP_DIR/.claude" . && echo "✅ Restored .claude/"
[ -d "$BACKUP_DIR/plan" ] && cp -r "$BACKUP_DIR/plan" . && echo "✅ Restored plan/"
[ -d "$BACKUP_DIR/pm" ] && cp -r "$BACKUP_DIR/pm" . && echo "✅ Restored pm/"
[ -d "$BACKUP_DIR/supabase" ] && cp -r "$BACKUP_DIR/supabase" . && echo "✅ Restored supabase/"
[ -d "$BACKUP_DIR/screenshots" ] && cp -r "$BACKUP_DIR/screenshots" . && echo "✅ Restored screenshots/"
[ -d "$BACKUP_DIR/prompts" ] && cp -r "$BACKUP_DIR/prompts" . && echo "✅ Restored prompts/"
[ -d "$BACKUP_DIR/tasks" ] && cp -r "$BACKUP_DIR/tasks" . && echo "✅ Restored tasks/"
[ -d "$BACKUP_DIR/figma" ] && cp -r "$BACKUP_DIR/figma" . && echo "✅ Restored figma/"
[ -d "$BACKUP_DIR/figma-2" ] && cp -r "$BACKUP_DIR/figma-2" . && echo "✅ Restored figma-2/"
[ -d "$BACKUP_DIR/claude-reference" ] && cp -r "$BACKUP_DIR/claude-reference" . && echo "✅ Restored claude-reference/"
[ -d "$BACKUP_DIR/claude-sdk" ] && cp -r "$BACKUP_DIR/claude-sdk" . && echo "✅ Restored claude-sdk/"
[ -d "$BACKUP_DIR/notes" ] && cp -r "$BACKUP_DIR/notes" . && echo "✅ Restored notes/"
[ -d "$BACKUP_DIR/roadmap" ] && cp -r "$BACKUP_DIR/roadmap" . && echo "✅ Restored roadmap/"
[ -d "$BACKUP_DIR/website" ] && cp -r "$BACKUP_DIR/website" . && echo "✅ Restored website/"
[ -d "$BACKUP_DIR/facts" ] && cp -r "$BACKUP_DIR/facts" . && echo "✅ Restored facts/"
[ -d "$BACKUP_DIR/knowledge" ] && cp -r "$BACKUP_DIR/knowledge" . && echo "✅ Restored knowledge/"
[ -d "$BACKUP_DIR/tasks-archive" ] && cp -r "$BACKUP_DIR/tasks-archive" . && echo "✅ Restored tasks-archive/"
[ -d "$BACKUP_DIR/tasks-draft" ] && cp -r "$BACKUP_DIR/tasks-draft" . && echo "✅ Restored tasks-draft/"
[ -d "$BACKUP_DIR/.agents" ] && cp -r "$BACKUP_DIR/.agents" . && echo "✅ Restored .agents/"
[ -d "$BACKUP_DIR/.agent" ] && cp -r "$BACKUP_DIR/.agent" . && echo "✅ Restored .agent/"

# Restore protected files
[ -f "$BACKUP_DIR/CLAUDE.md" ] && cp "$BACKUP_DIR/CLAUDE.md" . && echo "✅ Restored CLAUDE.md"
[ -f "$BACKUP_DIR/claude.md" ] && cp "$BACKUP_DIR/claude.md" . && echo "✅ Restored claude.md"
[ -f "$BACKUP_DIR/roadmap.md" ] && cp "$BACKUP_DIR/roadmap.md" . && echo "✅ Restored roadmap.md"
[ -f "$BACKUP_DIR/prd.md" ] && cp "$BACKUP_DIR/prd.md" . && echo "✅ Restored prd.md"
[ -f "$BACKUP_DIR/skills.md" ] && cp "$BACKUP_DIR/skills.md" . && echo "✅ Restored skills.md"
[ -f "$BACKUP_DIR/index.md" ] && cp "$BACKUP_DIR/index.md" . && echo "✅ Restored index.md"
[ -f "$BACKUP_DIR/notes.md" ] && cp "$BACKUP_DIR/notes.md" . && echo "✅ Restored notes.md"
[ -f "$BACKUP_DIR/summary.md" ] && cp "$BACKUP_DIR/summary.md" . && echo "✅ Restored summary.md"
[ -f "$BACKUP_DIR/system.md" ] && cp "$BACKUP_DIR/system.md" . && echo "✅ Restored system.md"
[ -f "$BACKUP_DIR/CHANGELOG.md" ] && cp "$BACKUP_DIR/CHANGELOG.md" . && echo "✅ Restored CHANGELOG.md"
[ -f "$BACKUP_DIR/.env.local" ] && cp "$BACKUP_DIR/.env.local" . && echo "✅ Restored .env.local"
[ -f "$BACKUP_DIR/.mcp.json" ] && cp "$BACKUP_DIR/.mcp.json" . && echo "✅ Restored .mcp.json"
[ -f "$BACKUP_DIR/CLAUDE.local.md" ] && cp "$BACKUP_DIR/CLAUDE.local.md" . && echo "✅ Restored CLAUDE.local.md"
[ -f "$BACKUP_DIR/AGENTS.md" ] && cp "$BACKUP_DIR/AGENTS.md" . 2>/dev/null && echo "✅ Restored AGENTS.md"
[ -f "$BACKUP_DIR/progress-tracker.md" ] && cp "$BACKUP_DIR/progress-tracker.md" . 2>/dev/null && echo "✅ Restored progress-tracker.md"
[ -f "$BACKUP_DIR/IMPLEMENTATION_PLAN.md" ] && cp "$BACKUP_DIR/IMPLEMENTATION_PLAN.md" . 2>/dev/null && echo "✅ Restored IMPLEMENTATION_PLAN.md"
[ -f "$BACKUP_DIR/TASKS_TABLE.md" ] && cp "$BACKUP_DIR/TASKS_TABLE.md" . 2>/dev/null && echo "✅ Restored TASKS_TABLE.md"
[ -f "$BACKUP_DIR/style-guide.md" ] && cp "$BACKUP_DIR/style-guide.md" . 2>/dev/null && echo "✅ Restored style-guide.md"
[ -f "$BACKUP_DIR/README.md" ] && cp "$BACKUP_DIR/README.md" . 2>/dev/null && echo "✅ Restored README.md"

# Or restore from stash (if backup unavailable)
# git checkout stash@{0} -- .cursor .claude plan pm supabase screenshots prompts tasks figma figma-2 claude-reference claude-sdk notes roadmap website facts knowledge CLAUDE.md claude.md CLAUDE.local.md roadmap.md prd.md skills.md index.md .env.local .mcp.json AGENTS.md progress-tracker.md IMPLEMENTATION_PLAN.md TASKS_TABLE.md style-guide.md README.md
```

## 📋 Quick Checklist

### Before Update
- [ ] Backup `.cursor/`, `.claude/`, `plan/`, `pm/`, `supabase/`, `screenshots/`, `prompts/`, `tasks/`, `figma/`, `figma-2/`, `claude-reference/`, `claude-sdk/`, `notes/`, `roadmap/`, `website/`, `facts/`, `knowledge/`
- [ ] Backup `CLAUDE.md`, `claude.md`, `CLAUDE.local.md`, `roadmap.md`, `prd.md`, `skills.md`, `index.md`, `notes.md`, `summary.md`, `system.md`, `CHANGELOG.md`, `.env.local`, `.mcp.json`, `AGENTS.md`, `progress-tracker.md`, `IMPLEMENTATION_PLAN.md`, `TASKS_TABLE.md`, `style-guide.md`, `README.md`
- [ ] Backup `tasks-archive/`, `tasks-draft/`, `.agents/`, `.agent/` if present
- [ ] Stash all changes (including untracked)

### During Update
- [ ] Pull from GitHub
- [ ] Restore folders/files if missing from backup
- [ ] Pop stash to restore local changes
- [ ] Resolve conflicts (keep local for protected files/folders)

### After Update
- [ ] **VERIFY** `.cursor/` exists
- [ ] **VERIFY** `.claude/` exists
- [ ] **VERIFY** `supabase/` exists
- [ ] **VERIFY** `plan/` exists
- [ ] **VERIFY** `pm/` exists
- [ ] **VERIFY** `screenshots/` exists (note: no hyphen)
- [ ] **VERIFY** `prompts/` exists
- [ ] **VERIFY** `tasks/` exists
- [ ] **VERIFY** `figma/` exists
- [ ] **VERIFY** `roadmap/` exists
- [ ] **VERIFY** `roadmap.md` exists
- [ ] **VERIFY** `prd.md` exists
- [ ] **VERIFY** `skills.md` exists
- [ ] **VERIFY** `index.md` exists
- [ ] **VERIFY** `notes.md` exists
- [ ] **VERIFY** `summary.md` exists
- [ ] **VERIFY** `system.md` exists
- [ ] **VERIFY** `CHANGELOG.md` exists
- [ ] **VERIFY** `tasks-archive/` exists (if used)
- [ ] **VERIFY** `tasks-draft/` exists (if used)
- [ ] **VERIFY** `.agents/` exists (if used)
- [ ] **VERIFY** `CLAUDE.md` or `claude.md` exists
- [ ] Check backup directory location for reference

### ✅ Complete backup verification (notes, index, screenshots, figma, website)

These items must be in every backup and restore:

| Item | Type | Rule | Backup | Restore | Verify |
|------|------|------|--------|---------|--------|
| `notes.md` | File | §20 | ✅ | ✅ | ✅ |
| `index.md` | File | §19 | ✅ | ✅ | ✅ |
| `screenshots/` | Folder | §5 | ✅ | ✅ | ✅ |
| `figma/` | Folder | §9 | ✅ | ✅ | ✅ |
| `figma-2/` | Folder | §9 | ✅ | ✅ | ✅ |
| `website/` | Folder | §15 | ✅ | ✅ | ✅ |

**Full backup** = all protected folders (including screenshots, figma, website, notes/) + all protected files (including index.md, notes.md). Use `./backup.sh` or the workflow in this doc.

---

## 🔗 Related Documentation

- **Main Rule:** `.cursor/rules/github-update.mdc` - Comprehensive update strategy with outside-repo backups
- **This File:** `.cursor/rules/github-updates.md` - Simplified workflow with backup/restore scripts

**Note:** The main `github-update.mdc` uses backups outside the repo (`../_backups/startupai/`) for maximum safety. This file provides a simpler alternative using in-repo backups (`.backup-*`).

---

**Remember:** Local work takes precedence. When in doubt, preserve local over remote.
