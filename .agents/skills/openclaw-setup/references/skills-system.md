# OpenClaw Skills System

> Source: https://docs.openclaw.ai/tools/creating-skills, https://docs.openclaw.ai/tools/skills-config

## What Skills Are

Skills are markdown instruction files (SKILL.md) that define how the agent handles specific domains. When a user message matches a skill's triggers, the agent reads the SKILL.md and follows its instructions.

## Directory Precedence (highest first)

1. `<workspace>/skills/` — per-agent, workspace-specific
2. `~/.openclaw/skills/` — shared across all agents on the machine
3. Bundled skills — shipped with OpenClaw
4. `skills.load.extraDirs` — additional configured directories

When a skill name appears in multiple locations, highest-precedence wins.

## Creating a Skill

### Minimal structure
```
~/.openclaw/workspace/skills/my-skill/
  SKILL.md
```

### SKILL.md format
```markdown
---
name: my_skill
description: >
  One-line description shown to the agent.
  Include trigger words for matching.
version: 1.0.0
metadata: {"openclaw":{"requires":{"env":["MY_API_KEY"]},"primaryEnv":"MY_API_KEY"}}
---

# My Skill Title

Instructions for the agent in markdown.
Use code blocks for tool calls, curl commands, etc.
The agent reads this file via the `read` tool when triggered.
```

### Required frontmatter
- `name` — snake_case identifier (must match directory name)
- `description` — shown in skill list and used for matching

### Optional metadata
```yaml
metadata:
  openclaw:
    requires:
      env: ["API_KEY"]          # Required env vars
      bins: ["ffmpeg"]           # Required binaries on PATH
      config: ["channels.whatsapp"]  # Required config keys
    primaryEnv: "API_KEY"        # Main env var shown in status
    os: ["linux", "darwin"]      # Platform filter
```

## Skill Injection

OpenClaw builds a system prompt for every agent run. Eligible skills are injected as a compact reference list containing:
- Skill name
- Description
- File path

The agent then uses the `read` tool to load the full SKILL.md content when needed.

### Key: skills load in NEW sessions only
Old sessions have a cached skill list. After adding/modifying a skill:
```bash
openclaw gateway restart
# Use --to self or start a new session
openclaw agent --to self --message "test"
```

## Eligibility Filters

A skill is "eligible" when:
- All `requires.env` vars are set (in config or environment)
- All `requires.bins` are on PATH
- All `requires.config` keys exist and are truthy
- `os` matches current platform (or not specified)
- Not explicitly disabled via `skills.entries.<name>.enabled: false`

Skills without metadata are always eligible.

## Skills Configuration

```json5
{
  "skills": {
    "allowBundled": ["gemini", "weather"],  // Restrict bundled skills (optional)
    "load": {
      "extraDirs": ["~/my-project/skills"],  // Additional scan directories
      "watch": true,                          // Auto-reload on file change
      "watchDebounceMs": 250                  // Debounce for watcher
    },
    "entries": {
      "my-skill": {
        "enabled": true,                     // Toggle skill on/off
        "env": { "API_KEY": "secret" },      // Per-skill env vars
        "apiKey": {                           // Convenience for primary key
          "source": "env",
          "provider": "default",
          "id": "API_KEY"
        }
      }
    }
  }
}
```

## CLI Commands

```bash
openclaw skills list           # List all skills with status
openclaw skills check          # Show ready vs missing requirements
openclaw skills info <name>    # Detailed info about a skill
```

## Best Practices

1. **Workspace skills for project-specific tools** — put in `<workspace>/skills/`
2. **Managed skills for shared tools** — put in `~/.openclaw/skills/`
3. **Use descriptive triggers in description** — the agent matches on description text
4. **Keep SKILL.md under 15K chars** — large skills burn context
5. **Use code blocks for tool calls** — agent follows curl/exec examples literally
6. **Include error handling** — tell the agent what to do when API calls fail
7. **Test with `openclaw agent --to self`** — creates a fresh session
8. **Version your skills** — use semver in frontmatter
9. **Don't store secrets in SKILL.md** — use `requires.env` and env vars
10. **New sessions after changes** — old sessions cache the skill list
