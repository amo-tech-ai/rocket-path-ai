Context is the new skill: lessons from the Claude Code best practices guide
The newly published best practices guide captures everything Anthropic has learned from watching developers work with their AI coding agent
JP Caparas
JP Caparas

Follow
7 min read
·
Jan 22, 2026
37


1





Press enter or click to view image in full size

https://code.claude.com/docs/en/best-practices is the place to be.
Anthropic did something good for their bookworm users today.

The newly published Claude Code Best Practices guide represents months of observation packed into a single resource. Since launching in February 2025, Claude Code has processed over 195 million lines of code weekly, with 115,000+ active developers building real software. That’s a lot of data and telemetry on what works and what doesn’t.

Press enter or click to view image in full size

What makes this guide worth reading isn’t the tips themselves. It’s what they reveal about the real constraints of working with AI coding agents. Once you understand those constraints, the specific advice becomes obvious.

Here goes.

The core constraint: context is everything
The single most important sentence in the entire guide:

Claude’s context window fills up fast, and performance degrades as it fills.

This is THE constraint. Everything else flows from it.

Context windows aren’t just about fitting more text. They’re about signal-to-noise ratio (a term you hear a lot, especially in SysAdmin and DevOps). A 200K token window stuffed with irrelevant file contents, failed attempts, and meandering conversation history performs worse than a 50K window with focused, relevant information.

The guide is clear about this.

When your context fills with noise, Claude starts making worse decisions.

It loses track of what you actually asked for. It forgets constraints you mentioned earlier. It hallucinates solutions that contradict files it read 100 messages ago.

Press enter or click to view image in full size

Sassy, but obviously in the right.
This explains why experienced Claude Code users obsess over context hygiene. They use /clear between unrelated tasks. They run /compact when conversations get long. They start fresh sessions rather than trying to pivot a polluted one.

Think of context like a whiteboard in a meeting room. A clean whiteboard with the problem statement and key constraints helps everyone think clearly. A whiteboard covered in crossed-out ideas, tangential notes, and diagrams from three previous meetings? Everything gets harder.

Clean, focused context leads to high-quality outputs; polluted context degrades performance

The core workflow: explore, plan, code, commit
The guide recommends a specific workflow that feels counterintuitive at first. Before writing any code, you should spend time in Plan Mode.

Plan Mode restricts Claude from making changes. It can only read files and think. This sounds limiting. But it’s actually the highest-value phase of any task.

Boris Cherny, who worked on Claude Code, puts it simply: “The single biggest tip is: almost always start in plan mode.”

Here’s the full workflow:

Explore (Plan Mode): Point Claude at relevant code. Ask it to understand the architecture, find similar patterns, identify where changes need to happen. Let it read without acting.

Plan (Plan Mode): Once Claude understands the codebase, ask it to propose an approach. Review the plan. Poke holes in it. Ask about edge cases. This is cheap. Fixing a bad plan in conversation costs nothing. Fixing bad code costs time.

Implement (Normal Mode): Only now do you let Claude write code. With a solid plan and relevant context loaded, implementation becomes almost mechanical.

Commit: Use Claude’s git integration to create meaningful commits. The /commit command generates commit messages based on actual changes, not your vague description of what you asked for.

The recommended workflow: Explore and Plan in Plan Mode, then Implement in Normal Mode

The key insight: planning is cheap and implementation is expensive. Every minute spent in Plan Mode saves multiple minutes of debugging, reverting, and re-explaining.

Configuration that compounds: CLAUDE.md as context engineering
Claude Code reads a file called CLAUDE.md from your project root on every session start. This is your persistent context. Your accumulated wisdom about how this specific codebase works.

But here’s where most people go wrong. They treat CLAUDE.md like documentation. They dump everything they know about the project into it. Architecture decisions. Coding standards. Historical context. Team preferences.

The guide offers a brutal filter:

For each line, ask: Would removing this cause Claude to make mistakes? If not, cut it.

A good CLAUDE.md is short. Maybe 20–50 lines. It contains only the information that, if missing, would lead Claude astray.

Here’s what belongs:

# CLAUDE.md
​
## Build commands
- `npm run dev` - Start development server
- `npm test` - Run tests (required before commits)
- `npm run lint` - Check code style
​
## Architecture
- API routes in /src/api, each file is one endpoint
- Database queries use the repository pattern in /src/repos
- All dates stored as UTC, converted to local only in UI
​
## Conventions
- Use named exports, not default exports
- Error handling: throw AppError with error code, never raw Error
- Tests go next to source files as *.test.ts
Notice what’s NOT here. No explanation of what the app does. No history of why decisions were made. No aspirational coding standards that the team doesn’t actually follow. Just the minimum context Claude needs to avoid common mistakes.

Press enter or click to view image in full size

Yeah, that’s not very cooperative, but then again what bugs are we actually talking about.
You can also have nested CLAUDE.md files in subdirectories for area-specific context. A CLAUDE.md in /src/api might contain API-specific conventions that don't apply elsewhere.

Verification is the key lever
If you take one thing from the guide, make it this:

Include tests, screenshots, or expected outputs so Claude can check itself. This is the single highest-leverage thing you can do.

Verification changes everything. Without it, you’re the verification layer. You read every line of generated code. You manually test every change. You catch Claude’s mistakes through vigilance.

With verification, Claude catches its own mistakes. It runs the tests. It sees the failures. It fixes them. The feedback loop tightens from “you notice something wrong” to “Claude notices something wrong.”

The guide recommends several verification approaches:

Tests: The obvious one. If you have a test suite, tell Claude to run it. Better yet, have Claude write tests first, then implementation. Tests become the specification.

Type checking: For TypeScript projects, tsc --noEmit catches a huge class of errors instantly. Claude can run this after every change.

Linting: ESLint, Prettier, whatever your project uses. Automated style enforcement means Claude’s code matches your codebase.

Screenshots: For frontend work, Claude can take screenshots and visually verify its changes. This sounds gimmicky but actually works.

Expected outputs: For data processing or API work, provide example inputs and expected outputs. Claude can verify its implementation produces the right results.

The pattern here is making verification automatic and fast. Every verification mechanism you add is one less thing you need to manually check.

Common failure patterns (and how to avoid them)
The guide identifies five failure patterns that trip up even experienced users. Recognising these in your own work is half the battle.

The kitchen sink session: You start with one task, finish it, then pivot to something unrelated without clearing context. Now Claude has context from Task A polluting its work on Task B. Solution: Use /clear between unrelated tasks, or just start a new session.

The correction spiral: Claude makes a mistake. You correct it. It tries again, fails differently. You correct again. Now your context is full of failed approaches, and Claude keeps referencing them. Ugh. Solution: If you’ve corrected the same issue twice, run /clear or /compact and restate the problem fresh.

The over-specified CLAUDE.md: Your CLAUDE.md is 500 lines of detailed instructions. Claude can’t find the important bits in all the noise. Solution: Cut ruthlessly. If a rule isn’t preventing actual mistakes, delete it.

The trust-then-verify gap: You let Claude work for 20 minutes, then discover it went in the wrong direction 18 minutes ago. Solution: Check in frequently. Ask Claude to explain its approach before implementing. Use Plan Mode.

Infinite exploration: You ask Claude to understand the codebase, and it reads 200 files trying to be thorough. Your context is now full of irrelevant code. Solution: Be specific about what to read. Point Claude at specific directories or files. Use subagents for investigation tasks that shouldn’t pollute your main context.

Press enter or click to view image in full size

I really wish it responded to everyone the way it did to me.
Develop your intuition
The guide is clear that Claude Code is “intentionally low-level and unopinionated, providing close to raw model access without forcing specific workflows.”

This is both a strength and a challenge. There’s no single right way to use it. The best practices are starting points, not rules.

What the guide really teaches is a way of thinking about AI-assisted development. Context is precious. Verification beats vigilance. Planning is cheap. Specificity reduces iteration.

These principles will outlast any specific tool. They apply to Claude Code today, but they’ll apply to whatever comes next. And the developers who internalise them will adapt faster than those who just memorise commands.

Start with Plan Mode.
Keep your CLAUDE.md lean.
Clear context aggressively.
Build verification into your workflow.
Course-correct early.
The rest is practice.

