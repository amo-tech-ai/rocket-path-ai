                                                                                                                               
  Tasks Best Practices — What the Sources Say                                                                                       
                                                                                                                                    
  Project Scoping (Your Original Question)                                                                                          

  Tasks always live at ~/.claude/tasks/. There's no option to store them in-project at .claude/tasks/. But you can scope them       
  per-project two ways:                                                                                                             
                                                                                                                                    
  Option 1 — Per-session launch:
  CLAUDE_CODE_TASK_LIST_ID=startupai16L claude

  Option 2 — Permanent in settings.json (recommended):
  {
    "env": {
      "CLAUDE_CODE_TASK_LIST_ID": "startupai16L"
    }
  }

  This creates a named, persistent task list at ~/.claude/tasks/startupai16L/ instead of random UUIDs per session. All sessions in
  the project share it, sub-agents automatically inherit it, and updates broadcast in real-time.

  Key Best Practices from Sources

  Practice: 3-Task Rule
  Detail: Only use Tasks when 3+ related steps, natural dependencies, or multi-session work. Skip for simple linear flows
  ────────────────────────────────────────
  Practice: Subject matters
  Detail: TaskList omits description — put critical info in subject (visible) not just description
  ────────────────────────────────────────
  Practice: Hybrid approach
  Detail: Tasks API for status tracking + markdown files (tasks/next-steps.md) for implementation details. You're already doing this

    correctly
  ────────────────────────────────────────
  Practice: Granularity
  Detail: Avoid monolithic tasks (>10 steps) AND micro-tasks (individual lines). Sweet spot: meaningful units of work
  ────────────────────────────────────────
  Practice: Owner tracking
  Detail: TaskUpdate({ taskId, owner: "agent-name" }) prevents multiple agents working the same task
  ────────────────────────────────────────
  Practice: Background subagents
  Detail: Always run_in_background: true when spawning sub-agents to preserve orchestrator context
  ────────────────────────────────────────
  Practice: Dependencies
  Detail: Use blockedBy chains for wave-based parallel execution — independent tasks run simultaneously, dependent tasks
    auto-activate
  ────────────────────────────────────────
  Practice: N+1 problem
  Detail: TaskList → TaskGet per task = 1+N calls. Keep task lists small per wave, use selective TaskGet

  What You Should Do

  1. Add to .claude/settings.json:
  "env": { "CLAUDE_CODE_TASK_LIST_ID": "startupai16L" }

  2. Clean up the 72 orphaned UUID dirs in ~/.claude/tasks/ — those are all stale session leftovers
  3. Keep the hybrid system — tasks/next-steps.md as durable git-tracked source of truth, Tasks API as ephemeral session
  coordination

  Want me to configure the settings.json and clean up the stale task directories?

  ---
  Sources:
  - Claude Code Docs - How Claude Code Works
  - Dev.to - The Task Tool: Claude Code's Agent Orchestration System
  - DeepWiki - Task Management Guide
  - Dplooy - Claude Code Tasks Complete Guide
  - ClaudeLog - What Are Tasks in Claude Code








❯ /context                                                                                                                          
  ⎿  Context Usage                                                             
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   claude-opus-4-6 · 154k/200k tokens (77%)                                                                 
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁                                                                                                          
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀ ⛀ ⛁   Estimated usage by category                                                                              
     ⛁ ⛀ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ System prompt: 24.3k tokens (12.2%)                                                                    
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ System tools: 16.4k tokens (8.2%)                                                                      
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ MCP tools: 15.1k tokens (7.5%)                                                                         
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   ⛁ Custom agents: 615 tokens (0.3%)                                                                       
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛶ ⛶ ⛶   ⛁ Memory files: 4.6k tokens (2.3%)
     ⛶ ⛶ ⛶ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛁ Skills: 1.1k tokens (0.5%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛁ Messages: 90.7k tokens (45.4%)
                           ⛶ Free space: 14k (7.1%)
                           ⛝ Autocompact buffer: 33k tokens (16.5%)

     MCP tools · /mcp
     └ mcp__plugin_context7_context7__resolve-library-id: 498 tokens
     └ mcp__plugin_context7_context7__query-docs: 407 tokens
     └ mcp__mermaid__generate_mermaid: 193 tokens
     └ mcp__mermaid__update_diagram: 172 tokens
     └ mcp__mermaid__list_diagrams: 75 tokens
     └ mcp__mermaid__export_diagram: 147 tokens
     └ mcp__claude-in-chrome__javascript_tool: 303 tokens
     └ mcp__claude-in-chrome__read_page: 380 tokens
     └ mcp__claude-in-chrome__find: 255 tokens
     └ mcp__claude-in-chrome__form_input: 238 tokens
     └ mcp__claude-in-chrome__computer: 1.3k tokens
     └ mcp__claude-in-chrome__navigate: 189 tokens
     └ mcp__claude-in-chrome__resize_window: 194 tokens
     └ mcp__claude-in-chrome__gif_creator: 640 tokens
     └ mcp__claude-in-chrome__upload_image: 351 tokens
     └ mcp__claude-in-chrome__get_page_text: 162 tokens
     └ mcp__claude-in-chrome__tabs_context_mcp: 199 tokens
     └ mcp__claude-in-chrome__tabs_create_mcp: 97 tokens
     └ mcp__claude-in-chrome__update_plan: 219 tokens
     └ mcp__claude-in-chrome__read_console_messages: 388 tokens
     └ mcp__claude-in-chrome__read_network_requests: 329 tokens
     └ mcp__claude-in-chrome__shortcuts_list: 142 tokens
     └ mcp__claude-in-chrome__shortcuts_execute: 228 tokens
     └ mcp__claude-in-chrome__switch_browser: 105 tokens
     └ mcp__supabase__search_docs: 584 tokens
     └ mcp__supabase__list_tables: 127 tokens
     └ mcp__supabase__list_extensions: 79 tokens
     └ mcp__supabase__list_migrations: 79 tokens
     └ mcp__supabase__apply_migration: 152 tokens
     └ mcp__supabase__execute_sql: 141 tokens
     └ mcp__supabase__get_logs: 150 tokens
     └ mcp__supabase__get_advisors: 183 tokens
     └ mcp__supabase__get_project_url: 82 tokens
     └ mcp__supabase__get_publishable_keys: 169 tokens
     └ mcp__supabase__generate_typescript_types: 83 tokens
     └ mcp__supabase__list_edge_functions: 86 tokens
     └ mcp__supabase__get_edge_function: 109 tokens
     └ mcp__supabase__deploy_edge_function: 527 tokens
     └ mcp__supabase__create_branch: 205 tokens
     └ mcp__supabase__list_branches: 108 tokens
     └ mcp__supabase__delete_branch: 97 tokens
     └ mcp__supabase__merge_branch: 104 tokens
     └ mcp__supabase__reset_branch: 137 tokens
     └ mcp__supabase__rebase_branch: 118 tokens
     └ mcp__supabase__list_storage_buckets: 88 tokens
     └ mcp__supabase__get_storage_config: 86 tokens
     └ mcp__supabase__update_storage_config: 244 tokens
     └ mcp__claude_ai_Hugging_Face__hf_whoami: 92 tokens
     └ mcp__claude_ai_Hugging_Face__space_search: 208 tokens
     └ mcp__claude_ai_Hugging_Face__model_search: 387 tokens
     └ mcp__claude_ai_Hugging_Face__paper_search: 230 tokens
     └ mcp__claude_ai_Hugging_Face__dataset_search: 371 tokens
     └ mcp__claude_ai_Hugging_Face__hub_repo_details: 235 tokens
     └ mcp__claude_ai_Hugging_Face__hf_doc_search: 211 tokens
     └ mcp__claude_ai_Hugging_Face__hf_doc_fetch: 184 tokens
     └ mcp__claude_ai_Hugging_Face__dynamic_space: 229 tokens
     └ mcp__claude_ai_Hugging_Face__hf_hub_community: 141 tokens
     └ mcp__claude_ai_Hugging_Face__gr1_z_image_turbo_generate: 900 tokens
     └ mcp__claude_ai_CopilotKit__search-code: 427 tokens
     └ mcp__claude_ai_CopilotKit__search-docs: 225 tokens
     └ mcp__ide__getDiagnostics: 112 tokens
     └ mcp__ide__executeCode: 183 tokens

     Custom agents · /agents

     Project
     └ code-reviewer: 40 tokens
     └ supabase-expert: 39 tokens
     └ security-auditor: 36 tokens
     └ ai-agent-dev: 35 tokens
     └ frontend-designer: 34 tokens
     └ debugger: 32 tokens

     Plugin
     └ superpowers:code-reviewer: 247 tokens
     └ feature-dev:code-architect: 53 tokens
     └ feature-dev:code-reviewer: 52 tokens
     └ feature-dev:code-explorer: 47 tokens

     Memory files · /memory
     └ CLAUDE.md: 1.4k tokens
     └ ~/.claude/projects/-home-sk-startupai16L/memory/MEMORY.md: 3.3k tokens

     Skills · /skills

     Project
     └ claude-chrome: 29 tokens
     └ catchup: 18 tokens
     └ github-update: 17 tokens
     └ code-review: 15 tokens
     └ dev-docs: 15 tokens
     └ build-and-fix: 15 tokens
     └ test-route: 14 tokens
     └ pr: 9 tokens

     User
     └ vercel-react-best-practices: 89 tokens
     └ find-skills: 79 tokens

     Plugin
     └ frontend-design: 67 tokens
     └ verification-before-completion: 67 tokens
     └ receiving-code-review: 67 tokens
     └ finishing-a-development-branch: 61 tokens
     └ using-git-worktrees: 59 tokens
     └ brainstorming: 56 tokens
     └ using-superpowers: 47 tokens
     └ dispatching-parallel-agents: 37 tokens
     └ requesting-code-review: 36 tokens
     └ executing-plans: 33 tokens
     └ systematic-debugging: 31 tokens
     └ writing-skills: 31 tokens
     └ subagent-driven-development: 31 tokens
     └ test-driven-development: 29 tokens
     └ writing-plans: 28 tokens
     └ feature-dev:feature-dev: 25 tokens
     └ code-review:code-review: 13 tokens