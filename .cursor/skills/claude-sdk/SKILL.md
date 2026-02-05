---
name: Claude Agent SDK
description: Create and configure Claude Agent SDK applications with TypeScript or Python, including MCP integration, subagents, permissions, and custom tools. Use when building Claude Code agents, integrating MCP servers, or creating specialized AI agents.
version: 1.0.0
---

# Claude Agent SDK

This skill teaches agents how to create and configure Claude Agent SDK applications with TypeScript or Python, including MCP integration, subagents, permissions, and custom tools.

## When to Use

- When creating new Claude Agent SDK applications
- When integrating MCP (Model Context Protocol) servers
- When implementing subagents for specialized tasks
- When configuring permissions and tool access
- When creating custom tools for Claude Code
- When building AI agents with Claude Code capabilities

## Core Principles

### SDK Overview

**Claude Agent SDK** allows you to build applications that interact with Claude Code, providing access to:
- Code reading and writing tools
- File system operations
- Custom MCP tools
- Subagents for specialized tasks
- Streaming and single-mode responses
- Permissions and security controls

**Official Documentation:**
- Overview: https://docs.claude.com/en/api/agent-sdk/overview
- TypeScript: https://docs.claude.com/en/api/agent-sdk/typescript
- Python: https://docs.claude.com/en/api/agent-sdk/python

## Project Setup

### Language Selection

**Supported Languages:**
- TypeScript (recommended for Node.js projects)
- Python (recommended for Python ecosystems)

**Ask user:** "Would you like to use TypeScript or Python?"

### Installation

**TypeScript:**
```bash
npm install @anthropic-ai/claude-agent-sdk@latest
```

**Python:**
```bash
pip install claude-agent-sdk
```

**Always use latest versions** - Check npm/PyPI before installing.

### Project Initialization

**TypeScript Setup:**
```json
// package.json
{
  "type": "module",
  "scripts": {
    "start": "node --loader ts-node/esm index.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

**Python Setup:**
```txt
# requirements.txt
claude-agent-sdk>=latest
```

### Environment Configuration

**Create `.env.example`:**
```
ANTHROPIC_API_KEY=your_api_key_here
```

**Add to `.gitignore`:**
```
.env
```

**Get API Key:** https://console.anthropic.com/

## Basic Usage

### TypeScript Query Pattern

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "List all TypeScript files in the project",
  options: {
    allowedTools: ["Glob", "Read"]
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}
```

### Python Query Pattern

```python
from claude_agent_sdk import query

async for message in query(
    prompt="List all Python files in the project",
    options={
        "allowedTools": ["Glob", "Read"]
    }
):
    if message["type"] == "result" and message["subtype"] == "success":
        print(message["result"])
```

## MCP Integration

### MCP Configuration

**Configure MCP servers in `.mcp.json`:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_PATHS": "/Users/me/projects"
      }
    }
  }
}
```

### Using MCP Servers in SDK

**TypeScript:**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "List files in my project",
  options: {
    mcpServers: {
      "filesystem": {
        command: "npx",
        args: ["@modelcontextprotocol/server-filesystem"],
        env: {
          ALLOWED_PATHS: "/Users/me/projects"
        }
      }
    },
    allowedTools: ["mcp__filesystem__list_files"]
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}
```

**Python:**
```python
from claude_agent_sdk import query

async for message in query(
    prompt="List files in my project",
    options={
        "mcpServers": {
            "filesystem": {
                "command": "python",
                "args": ["-m", "mcp_server_filesystem"],
                "env": {
                    "ALLOWED_PATHS": "/Users/me/projects"
                }
            }
        },
        "allowedTools": ["mcp__filesystem__list_files"]
    }
):
    if message["type"] == "result" and message["subtype"] == "success":
        print(message["result"])
```

### MCP Transport Types

**stdio Servers** (external processes):
```json
{
  "mcpServers": {
    "my-tool": {
      "command": "node",
      "args": ["./my-mcp-server.js"],
      "env": {
        "DEBUG": "${DEBUG:-false}"
      }
    }
  }
}
```

**HTTP/SSE Servers** (remote):
```json
{
  "mcpServers": {
    "remote-api": {
      "type": "sse",
      "url": "https://api.example.com/mcp/sse",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**SDK MCP Servers** (in-process):
- See Custom Tools guide for creating SDK MCP servers
- Use `createSdkMcpServer()` in TypeScript
- Use `create_sdk_mcp_server()` in Python

## Subagents

### Creating Subagents

**Programmatic Definition (Recommended):**

**TypeScript:**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Review the authentication module for security issues",
  options: {
    allowedTools: ["Read", "Grep", "Glob", "Task"], // Task tool required
    agents: {
      "code-reviewer": {
        description: "Expert code review specialist. Use for quality, security, and maintainability reviews.",
        prompt: `You are a code review specialist with expertise in security, performance, and best practices.

When reviewing code:
- Identify security vulnerabilities
- Check for performance issues
- Verify adherence to coding standards
- Suggest specific improvements

Be thorough but concise in your feedback.`,
        tools: ["Read", "Grep", "Glob"], // Read-only access
        model: "sonnet" // Override default model
      }
    }
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

**Python:**
```python
from claude_agent_sdk import query, AgentDefinition

async for message in query(
    prompt="Review the authentication module for security issues",
    options={
        "allowedTools": ["Read", "Grep", "Glob", "Task"],
        "agents": {
            "code-reviewer": AgentDefinition(
                description="Expert code review specialist. Use for quality, security, and maintainability reviews.",
                prompt="""You are a code review specialist with expertise in security, performance, and best practices.

When reviewing code:
- Identify security vulnerabilities
- Check for performance issues
- Verify adherence to coding standards
- Suggest specific improvements

Be thorough but concise in your feedback.""",
                tools=["Read", "Grep", "Glob"],
                model="sonnet"
            )
        }
    }
):
    if message["type"] == "result":
        print(message["result"])
```

### Subagent Benefits

**Context Management:**
- Subagents maintain separate context from main agent
- Prevents information overload
- Keeps interactions focused

**Parallelization:**
- Multiple subagents can run concurrently
- Dramatically speeds up complex workflows
- Example: Run `style-checker`, `security-scanner`, and `test-coverage` simultaneously

**Specialized Instructions:**
- Each subagent can have tailored system prompts
- Specific expertise and best practices
- Tool restrictions for safety

**Tool Restrictions:**
- Limit subagents to specific tools
- Reduce risk of unintended actions
- Example: `doc-reviewer` with read-only access

## Custom Tools (SDK MCP Servers)

### Creating Custom Tools

**TypeScript:**
```typescript
import { tool, createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// Define tool with Zod schema
const calculateTool = tool(
  "calculate",
  "Performs mathematical calculations",
  {
    expression: z.string().describe("Mathematical expression to evaluate")
  },
  async (args) => {
    // Execute tool logic
    const result = eval(args.expression); // In production, use a safe evaluator
    return {
      success: true,
      result: result.toString()
    };
  }
);

// Create MCP server with tools
const calculatorServer = createSdkMcpServer({
  name: "calculator",
  version: "1.0.0",
  tools: [calculateTool]
});

// Use in query
for await (const message of query({
  prompt: "Calculate 2 + 2",
  options: {
    mcpServers: {
      "calculator": calculatorServer
    },
    allowedTools: ["mcp__calculator__calculate"]
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

**Python:**
```python
from claude_agent_sdk import tool, create_sdk_mcp_server, query
from pydantic import BaseModel

# Define tool with Pydantic schema
class CalculateInput(BaseModel):
    expression: str

@tool("calculate", "Performs mathematical calculations", CalculateInput)
async def calculate_handler(args: CalculateInput):
    # Execute tool logic
    result = eval(args.expression)  # In production, use a safe evaluator
    return {"success": True, "result": str(result)}

# Create MCP server with tools
calculator_server = create_sdk_mcp_server(
    name="calculator",
    version="1.0.0",
    tools=[calculate_handler]
)

# Use in query
async for message in query(
    prompt="Calculate 2 + 2",
    options={
        "mcpServers": {
            "calculator": calculator_server
        },
        "allowedTools": ["mcp__calculator__calculate"]
    }
):
    if message["type"] == "result":
        print(message["result"])
```

## Permissions

### Permission Modes

**Default:** `"promptUser"`
- Claude prompts user before executing actions
- Safest mode for production

**Bypass:** `"bypassPermissions"`
- Allows automatic execution without prompts
- Requires `allowDangerouslySkipPermissions: true`
- Use with caution

**Configuration:**
```typescript
options: {
  permissionMode: "promptUser", // or "bypassPermissions"
  allowDangerouslySkipPermissions: false // Required for bypass
}
```

## Streaming vs Single Mode

### Streaming Mode (Default)

**Real-time responses:**
```typescript
for await (const message of query({
  prompt: "Analyze the codebase",
  options: {
    streaming: true // Default
  }
})) {
  // Handle messages as they arrive
  if (message.type === "text_delta") {
    process.stdout.write(message.text);
  }
}
```

### Single Mode

**Complete response:**
```typescript
const result = await query({
  prompt: "List all files",
  options: {
    streaming: false
  }
}).then(async (query) => {
  let fullResult = "";
  for await (const message of query) {
    if (message.type === "result" && message.subtype === "success") {
      fullResult = message.result;
    }
  }
  return fullResult;
});
```

## Error Handling

### MCP Connection Failures

**Check MCP server status:**
```typescript
for await (const message of query({
  prompt: "Process data",
  options: {
    mcpServers: {
      "data-processor": dataServer
    }
  }
})) {
  if (message.type === "system" && message.subtype === "init") {
    // Check MCP server status
    const failedServers = message.mcp_servers.filter(
      s => s.status !== "connected"
    );
    
    if (failedServers.length > 0) {
      console.warn("Failed to connect:", failedServers);
    }
  }
  
  if (message.type === "result" && message.subtype === "error_during_execution") {
    console.error("Execution failed:", message.error);
  }
}
```

## Verification

### TypeScript Verification

**Run type checking:**
```bash
npx tsc --noEmit
```

**Verify SDK installation:**
```bash
npm list @anthropic-ai/claude-agent-sdk
```

**Use verification agent:** Launch `agent-sdk-verifier-ts` after setup to validate configuration.

### Verification Checklist

**SDK Installation:**
- ✅ Package installed with latest version
- ✅ `package.json` has `"type": "module"` for ES modules
- ✅ Node.js version requirements met

**TypeScript Configuration:**
- ✅ `tsconfig.json` exists with proper settings
- ✅ Module resolution supports ES modules
- ✅ Target is modern enough for SDK
- ✅ Type checking passes (`tsc --noEmit`)

**SDK Usage:**
- ✅ Correct imports from `@anthropic-ai/claude-agent-sdk`
- ✅ Agents properly initialized
- ✅ Configuration follows SDK patterns
- ✅ Methods called correctly with proper parameters
- ✅ Streaming vs single mode handled correctly

**Environment and Security:**
- ✅ `.env.example` exists with `ANTHROPIC_API_KEY`
- ✅ `.env` is in `.gitignore`
- ✅ API keys not hardcoded in source files
- ✅ Proper error handling around API calls

## Best Practices

### ✅ DO

- Always use latest SDK versions (check npm/PyPI before installing)
- Use TypeScript for type safety and better IDE support
- Verify code runs correctly before finishing (`tsc --noEmit` for TypeScript)
- Use `.env` for API keys, never hardcode
- Write clear subagent descriptions for automatic invocation
- Use tool restrictions for subagents to reduce risk
- Handle MCP connection failures gracefully
- Use streaming mode for real-time feedback
- Test with verification agents after setup

### ❌ DON'T

- Don't skip version checking (always use latest versions)
- Don't hardcode API keys in source files
- Don't forget to add `.env` to `.gitignore`
- Don't skip type checking (fix all errors before finishing)
- Don't use `bypassPermissions` without understanding risks
- Don't forget to include `Task` tool when using subagents
- Don't ignore MCP connection errors
- Don't skip verification after setup

## Common Patterns

### Code Review Agent

**Use case:** Automated code review with security focus

```typescript
agents: {
  "code-reviewer": {
    description: "Expert code review specialist. Use for quality, security, and maintainability reviews.",
    prompt: `You are a code review specialist focusing on:
- Security vulnerabilities
- Performance issues
- Code quality and maintainability
- Best practices adherence`,
    tools: ["Read", "Grep", "Glob"], // Read-only
    model: "sonnet"
  }
}
```

### Test Runner Agent

**Use case:** Run tests and report results

```typescript
agents: {
  "test-runner": {
    description: "Runs test suites and reports results. Use for automated testing.",
    prompt: `You are a test execution specialist. Run tests and report:
- Test results (pass/fail)
- Coverage metrics
- Performance benchmarks
- Error details`,
    tools: ["Bash"], // Can execute commands
    model: "sonnet"
  }
}
```

### Research Assistant Agent

**Use case:** Explore documentation and codebase

```typescript
agents: {
  "research-assistant": {
    description: "Research specialist. Use for exploring codebases and documentation.",
    prompt: `You are a research assistant. Explore and analyze:
- Codebase structure
- Documentation
- API references
- Implementation patterns`,
    tools: ["Read", "Grep", "Glob", "WebFetch"], // Read and fetch
    model: "sonnet"
  }
}
```

## Reference

- **Official Docs:**
  - Overview: https://docs.claude.com/en/api/agent-sdk/overview
  - TypeScript: https://docs.claude.com/en/api/agent-sdk/typescript
  - Python: https://docs.claude.com/en/api/agent-sdk/python
  - MCP Integration: https://docs.claude.com/en/api/agent-sdk/mcp
  - Subagents: https://docs.claude.com/en/api/agent-sdk/subagents
  - Custom Tools: https://docs.claude.com/en/api/agent-sdk/custom-tools

- **Project Files:**
  - `claude-reference/skills/sdk-agent-new.md` - Creating new SDK applications
  - `claude-reference/skills/sdk-verifier.md` - Verification patterns
  - `claude-reference/agents/mcp.md` - MCP integration details

- **Related Rules:**
  - `.cursor/rules/agent-skills.mdc` - Agent Skills pattern
  - `.cursor/rules/subagents.mdc` - Subagents pattern

---

**Created:** 2025-01-16  
**Based on:** Claude Agent SDK documentation and best practices  
**Version:** 1.0.0
