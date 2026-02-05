---
name: Agent Best Practices
description: This skill should be used when the user asks about "agent best practices", "coding with agents", "plan mode", "agent workflows", "test-driven development with agents", "code review with agents", "pull request automation", mentions agent efficiency, or needs guidance on effective agent collaboration patterns.
version: 1.0.0
---

# Agent Best Practices for Claude Code

This skill provides comprehensive guidance for working effectively with Claude Code agents, based on proven practices from the Cursor development team and community.

## Core Principles

### Plan Before Coding

Enable Plan Mode by pressing `Shift+Tab` in the agent input. The agent researches the codebase, asks clarifying questions, and creates a detailed plan before implementation.

**When to use Plan Mode:**
- New features requiring multiple files
- Complex refactors affecting multiple components
- Database schema changes
- Production-critical code modifications
- Integration work spanning multiple systems

**Plan storage:** Save plans to `.cursor/plans/` directory for future reference and iteration.

### Context Discovery

Let the agent discover context automatically using semantic search. Avoid manually tagging every file unless the exact path is known.

**Effective context management:**
- Tag specific files when path is certain
- Use semantic search for general topics
- Avoid including irrelevant files
- Leverage `@Branch` for current work context
- Reference `@Past Chats` for previous conversations

**Tools for context:**
- Semantic search finds files by meaning
- `@Branch` provides context about current work
- `@Past Chats` references previous conversations
- File tagging for exact paths

### Conversation Management

Start fresh conversations when moving to different tasks, when the agent seems confused, after completing logical work units, or when context has accumulated noise.

Continue existing conversations when iterating on the same feature, debugging recent work, or making incremental improvements.

**Signs to start fresh:**
- Agent appears confused or off-track
- Moving to completely different task
- Finished logical unit of work
- Context window contains irrelevant information

**Signs to continue:**
- Iterating on same feature
- Debugging recent changes
- Making incremental improvements
- Building on previous work

### Prompt Specificity

Write specific, actionable prompts with clear requirements and constraints.

**Bad prompt example:**
```
add tests for auth.ts
```

**Good prompt example:**
```
Write a test case for auth.ts covering the logout edge case, using the patterns in __tests__/ and avoiding mocks. Test should verify session cleanup and token invalidation.
```

**Prompt structure:**
- Specify exact file or component
- Include requirements and constraints
- Reference existing patterns or conventions
- State what to avoid (mocks, specific approaches)
- Define expected behavior or outcome

### Code Review Process

Review agent-generated code carefully. Watch diffs as the agent works, interrupt with Escape if needed, and use Agent Review after completion.

**Review checklist:**
- Watch diffs in real-time as agent works
- Press Escape to interrupt if needed
- Use Agent Review command after completion
- Review thoroughly - AI code can look correct but have subtle issues
- Verify edge cases and error handling
- Check for security vulnerabilities
- Ensure code follows project conventions

## Common Workflows

### Test-Driven Development

Follow TDD workflow with agents for reliable, well-tested code.

**TDD workflow:**
1. Ask agent to write tests first (explicitly state it's TDD)
2. Run tests to confirm they fail
3. Commit the failing tests
4. Ask agent to write implementation
5. Iterate until tests pass
6. Commit implementation with passing tests

**Example prompt:**
```
Using TDD, write tests for the new user registration feature. Tests should cover:
- Valid registration flow
- Email validation
- Password strength requirements
- Duplicate email handling

After tests are written and confirmed failing, implement the feature.
```

### Code Review Workflow

Use `/review` command to check code quality, find common issues, and get summary of findings.

**Review command capabilities:**
- Check linters and style guides
- Find common code issues
- Review code quality metrics
- Get summary of findings
- Identify potential bugs
- Suggest improvements

**Usage:**
```
/review
```

Reviews all changes in current context and provides comprehensive feedback.

### Pull Request Automation

Use `/pr` command to automate pull request creation workflow.

**PR command workflow:**
1. Commits all changes
2. Pushes to current branch
3. Opens pull request
4. Returns PR URL

**Usage:**
```
/pr "Add user authentication feature"
```

Creates PR with commit message as title and description.

## Advanced Techniques

### Multi-File Coordination

Agents excel at coordinating changes across multiple files. Provide clear requirements and let the agent handle file relationships.

**Best practices:**
- Describe the feature or change clearly
- Let agent identify affected files
- Review all file changes together
- Verify cross-file consistency

### Incremental Development

Break large features into smaller, testable increments. Complete each increment before moving to the next.

**Incremental workflow:**
1. Define feature scope
2. Break into logical increments
3. Implement increment with tests
4. Review and commit
5. Move to next increment

### Context Preservation

Use plan files and documentation to preserve context across sessions.

**Context preservation:**
- Save plans to `.cursor/plans/`
- Document decisions in code comments
- Use clear commit messages
- Reference previous conversations with `@Past Chats`

## Command Reference

### Built-in Commands

**`/review`** - Review code quality and find issues
- Checks linters
- Finds common problems
- Reviews code quality
- Provides summary

**`/pr [message]`** - Create pull request
- Commits changes
- Pushes to branch
- Opens PR
- Returns PR URL

**Plan Mode** - `Shift+Tab` in agent input
- Researches codebase
- Asks clarifying questions
- Creates detailed plan
- Saves to `.cursor/plans/`

### Directory Structure

**Plans:** `.cursor/plans/` - Saved agent plans
**Commands:** `.cursor/commands/` - Custom commands
**Rules:** `.cursor/rules/` - Project rules and guidelines

## Troubleshooting

### Agent Confusion

When agent seems confused or off-track:
1. Start fresh conversation
2. Provide more specific context
3. Use Plan Mode for complex tasks
4. Break task into smaller steps

### Context Issues

If agent includes wrong files:
1. Be more specific in prompt
2. Tag exact files needed
3. Use semantic search effectively
4. Review context before proceeding

### Code Quality Issues

If generated code doesn't meet standards:
1. Use `/review` command
2. Provide specific feedback
3. Reference project conventions
4. Ask for improvements

## Best Practices Summary

**DO:**
- Use Plan Mode for complex tasks
- Let agent discover context automatically
- Write specific, actionable prompts
- Review code carefully before committing
- Use TDD for critical features
- Break large tasks into increments
- Save plans for future reference

**DON'T:**
- Manually tag every file
- Use vague prompts
- Skip code review
- Continue conversations when switching tasks
- Trust AI code without review
- Skip tests for critical features

## Additional Resources

### Reference Files

For detailed workflows and examples:
- **`references/workflows.md`** - Detailed workflow patterns
- **`references/prompting.md`** - Advanced prompting techniques
- **`references/troubleshooting.md`** - Common issues and solutions

### Examples

Working examples in `examples/`:
- **`example-tdd-workflow.md`** - Complete TDD example
- **`example-plan.md`** - Sample agent plan
- **`example-review.md`** - Code review output

### External Resources

- [Cursor Blog - Best practices for coding with agents](https://cursor.com/blog/agent-best-practices)
- Cursor Documentation
- Community forums and discussions

---

**Created:** 2025-01-27  
**Based on:** Cursor Blog - Best practices for coding with agents  
**Version:** 1.0.0
