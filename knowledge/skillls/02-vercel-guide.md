# Vercel Agent Skills Guide

**Source:** [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
**Purpose:** Packaged instructions that extend AI coding agent capabilities

---

## Core Concept

Agent Skills are **dormant instructions** that activate when relevant tasks surface. No explicit invocation needed - the agent automatically engages matching skills.

```
User: "Deploy my app" → agent-skills/vercel-deploy activates
User: "Review this React component" → agent-skills/react-best-practices activates
```

---

## Vercel's 3 Production Skills

### 1. React Best Practices

**Triggers:** Performance requests, React optimization, component reviews

**8 Categories of 40+ Rules:**
| Category | Focus |
|----------|-------|
| Async Waterfalls | Eliminate sequential operations |
| Bundle Size | Reduce client JavaScript |
| Server Performance | Optimize SSR/SSG |
| Data Fetching | Efficient client fetching |
| Re-renders | Prevent unnecessary updates |
| Rendering | Component performance |
| Advanced Patterns | Complex optimizations |
| JS Performance | Runtime optimization |

**Impact Priority (High to Low):**
- CRITICAL: 600ms request waterfalls
- HIGH: Large bundle imports
- MEDIUM: Excessive re-renders
- LOW: Micro-optimizations

### 2. Web Design Guidelines

**Triggers:** UI reviews, accessibility checks, design audits, UX reviews

**100+ Audit Rules Covering:**
- Accessibility (a11y)
- Form best practices
- Animation patterns
- Image optimization
- Internationalization

**Workflow:**
1. Fetch guidelines from remote source
2. Parse target files
3. Evaluate against all rules
4. Report in `file:line` format

### 3. Vercel Deploy (Claimable)

**Triggers:** Deploy requests, Vercel deployment

**Features:**
- Auto-detect framework from package.json
- Deploy to Vercel
- Transfer ownership capability

---

## Skill File Structure

```
skills/
└── skill-name/
    ├── SKILL.md          # Core instructions (required)
    ├── scripts/          # Automation helpers (optional)
    └── references/       # Supporting docs (optional)
```

### SKILL.md Format

```markdown
| Name | Author | Version | Argument |
|------|--------|---------|----------|
| skill-name | Your Name | 1.0.0 | `<input-type>` |

## Description
What this skill does and when it triggers.

## Workflow
1. Step one
2. Step two
3. Output format

## References
- External resources
- Dynamic guideline sources
```

---

## Key Principles from Vercel

### 1. Impact-Ordered Fixes

> "Performance work fails because it starts too low in the stack."

Fix by **real-world impact**, not code depth:
- 600ms request waterfall (fix first)
- useMemo optimization (fix later)

### 2. Root Causes Over Symptoms

Focus on the 3 root causes:
1. **Async work becoming sequential**
2. **Large client bundles**
3. **Unnecessary re-renders**

### 3. Production-Grounded Rules

Every rule comes from:
- Actual production scenarios
- Measurable improvements
- Real-world code patterns

---

## Integrating with Claude Code

### Installation

```bash
npx add-skill vercel-labs/agent-skills
```

### Usage in CLAUDE.md

Reference skills in your project instructions:

```markdown
## Skills

When working on React performance:
- Use react-best-practices skill patterns
- Prioritize CRITICAL issues first
- Report findings in file:line format

When deploying:
- Use vercel-deploy skill for Vercel deployments
```

### Creating Custom Skills

1. **Create skill folder:** `.claude/skills/my-skill/`
2. **Add SKILL.md** with frontmatter and workflow
3. **Add references/** for supporting docs
4. **Test with sample requests**

---

## Applying to StartupAI

### React Best Practices Application

| Vercel Rule | StartupAI Application |
|-------------|----------------------|
| Eliminate waterfalls | Parallel data fetching in dashboard hooks |
| Reduce bundle | Dynamic imports for AI panels |
| Prevent re-renders | Memoize expensive computations |
| Server components | Move static content server-side |

### Web Design Guidelines Application

| Vercel Rule | StartupAI Application |
|-------------|----------------------|
| Accessibility | All form inputs labeled |
| Animation | Smooth wizard transitions |
| Images | Optimize startup logos |
| i18n | Prepare for multi-language |

---

## Resources

- **GitHub:** [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- **Blog:** [Introducing React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
- **Standard:** [agentskills.io](https://agentskills.io)
- **Install:** `npx add-skill vercel-labs/agent-skills`
