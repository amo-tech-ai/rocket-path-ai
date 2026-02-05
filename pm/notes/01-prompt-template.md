# Auto-Claude Prompt Format

This template defines the standard structure for Auto-Claude agent prompts. All prompts should be Markdown (`.md`) files.

## 📋 Standard Template

```markdown
## YOUR ROLE - [AGENT_NAME]

You are the **[Agent Name]** in the Auto-Build framework. Your job is to [brief description of responsibility].

**Key Principle**: [One sentence guiding principle, e.g., "Deep understanding through autonomous analysis."]

**CRITICAL**: This agent runs [INTERACTIVELY/NON-INTERACTIVELY]. You [CAN/CANNOT] ask questions.

---

## YOUR CONTRACT

**Input**: `[input_file.json]` ([description])
**Output**: `[output_file.json]` ([description])

**MANDATORY**: You MUST create `[output_file.json]` in the **Output Directory** specified below.

You MUST create `[output_file.json]` with this EXACT structure:

\`\`\`json
{
  "key": "value description",
  "required_field": "Must be present"
}
\`\`\`

---

## PHASE 0: LOAD CONTEXT (MANDATORY)

Instructions for the agent to gather necessary context.

\`\`\`bash
# 1. Read input files
cat [input_file.json]

# 2. Check project structure
ls -la

# 3. Read specific configs
cat package.json 2>/dev/null
\`\`\`

---

## PHASE 1: [PHASE NAME] (AUTONOMOUS)

Instructions for the first analysis or action step.

1. **Goal**: [What to achieve in this phase]
2. **Action**: [What to do]

\`\`\`bash
# Example commands the agent should run
find . -name "*.ts"
\`\`\`

---

## PHASE 2: [PHASE NAME] (AUTONOMOUS)

Instructions for the next step.

- **Analyze**: [What to look for]
- **Infer**: [What to figure out]

---

## PHASE [N]: CREATE [OUTPUT_FILE] (MANDATORY)

**CRITICAL: You MUST create this file. The orchestrator WILL FAIL if you don't.**

**IMPORTANT**: Write the file to the **Output File** path specified at the end of this prompt.

\`\`\`bash
cat > [output_file.json] << 'EOF'
{
  "key": "value"
}
EOF
\`\`\`

---

## VALIDATION

Steps the agent must take to verify its own work.

1. Is valid JSON?
2. Are required fields present?

---

## COMPLETION

Signal completion with this exact format:

\`\`\`
=== [AGENT_NAME] COMPLETE ===

Summary: [Summary of work]
Output: [output_file.json] created.

Next phase: [Next step in workflow]
\`\`\`

---

## CRITICAL RULES

1. **[Rule 1]**: [Description]
2. **[Rule 2]**: [Description]
3. **Write to Output Directory**: Use the path provided at the end of the prompt.

---

## BEGIN

1. Read inputs
2. Analyze project
3. Create output file

**DO NOT** ask questions. **DO NOT** wait for user input.
```

## 🧩 Key Components Explained

| Component | Purpose |
|-----------|---------|
| **Role Definition** | Sets the persona and primary responsibility. |
| **Contract** | Clearly defines inputs (what enters) and outputs (what must be created). |
| **Phases** | Sequential steps (0, 1, 2...) guiding the agent's workflow. |
| **Bash Blocks** | Example commands ` ```bash ` that the agent "reads" as instructions to execute tools. |
| **Output Structure** | JSON schema defining exactly what the agent must produce. |
| **Validation** | Self-correction steps to ensure quality before finishing. |
| **Completion Signal** | Unique string pattern the orchestrator looks for to know the task is done. |

## 💡 Best Practices

1. **Be Explicit**: Don't say "analyze the code," say "count the lines of code using `wc -l`".
2. **Example Commands**: Provide exact `bash` commands you want the agent to try.
3. **JSON Schemas**: Always provide the full JSON structure required for output.
4. **Error Recovery**: Tell the agent what to do if it fails (e.g., "If file missing, create default").
5. **Context Loading**: Always start with a Phase 0 that reads necessary files (`project_index.json`, `README.md`, etc.).
