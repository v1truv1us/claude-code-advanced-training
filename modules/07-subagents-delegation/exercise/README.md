# Module 07 Exercise: Multi-Agent Code Review Pipeline

## 🎯 Objective
Build a parallel code review system using subagents that simultaneously checks for security, performance, and test coverage issues.

## 📋 Prerequisites
- Completed Modules 1-6
- Familiarity with Claude Code subagents
- Comfortable editing Markdown + YAML frontmatter

## 🏗️ Exercise Structure

### Part 1: Create Subagent Configurations (30 min)
Create three specialized subagents in `.claude/agents/` (project scope):

1. **security-scanner.md** - Read-only security analysis
2. **performance-expert.md** - Performance bottleneck detection  
3. **test-coverage-checker.md** - Test coverage verification

Each subagent is a **Markdown file** with **YAML frontmatter** followed by a prompt body.
(See `starter/subagent-templates/*.md` for templates.)

### Part 2: Build the Pipeline (30 min)
Build a repeatable **fan-out / aggregate** workflow:
- Run the three subagents against the same target file(s)
- Aggregate their outputs into a single “review report”
- Handle partial failures gracefully (one agent fails, report still produced)

You can do this either:
- **Inside Claude Code** (recommended): ask Claude to delegate to each subagent and then synthesize.
- **Via automation** (optional): use `claude -p` with structured output and run one job per agent.

### Part 3: Add Error Handling (20 min)
Implement:
- Retry logic for failed subagents
- Timeout handling
- Fallback to basic checks if subagents fail

## 🚀 Success Criteria

### Functional Requirements
✅ All three subagents execute in parallel  
✅ Results aggregated into structured report  
✅ Pipeline completes in under 60 seconds  
✅ Handles partial failures (1-2 subagents down)  
✅ Logs execution time and results  

### Code Quality
✅ Subagents have minimal tool permissions  
✅ Proper error handling with try/catch  
✅ Clean separation of concerns  
✅ Comments explaining subagent selection rationale  

## 📁 Starter Files

See `starter/` directory for:
- `subagent-templates/` - Template configurations
- `sample-code/` - Files to review
- `pipeline-starter.ts` - Partial implementation

## 🔧 Implementation Tips

### Subagent Tool Selection (doc-aligned)
```md
---
name: security-scanner
description: Read-only security review
tools: Read, Grep, Glob
---
```

- Start read-only; only grant `Bash`/`Edit` if the exercise explicitly needs it.
- Use **Titlecase** tool names (`Read`, `Grep`, `Glob`, `Bash`, `Write`, `Edit`).

### Delegation prompt pattern (inside Claude Code)
- Ask Claude to delegate 3 parallel reviews:
  - “Use the security-scanner subagent to review X and return a bulleted risk list.”
  - “Use the performance-expert subagent to review X and return bottlenecks + fixes.”
  - “Use the test-coverage-checker subagent to review tests for X and return gaps.”
- Then: “Aggregate these into a single report with sections + priority.”

## 🎓 Learning Outcomes

After completing this exercise, you'll understand:
- How to design specialized subagents for specific tasks
- Parallel execution patterns with Promise.all
- Error handling in distributed agent systems
- Tool restriction for security
- Result aggregation strategies

## 🆘 Common Pitfalls

1. **Over-permissioning subagents** — start with minimal tools
2. **Assuming nesting works** — Claude Code subagents can’t spawn other subagents
3. **Forgetting scope** — project agents live in `.claude/agents/`
4. **No structure in outputs** — ask each agent to return a consistent format

## ✅ Checklist

- [ ] Created `security-scanner.md` with minimal, read-only tools
- [ ] Created `performance-expert.md` with the right analysis focus
- [ ] Created `test-coverage-checker.md` with test discovery guidance
- [ ] Ran a 3-agent fan-out review and aggregated a single report
- [ ] Verified partial-failure behavior (one agent fails → report still produced)
- [ ] Documented tool choices and why they’re minimal

## 📝 Submission

Submit:
1. Your three subagent Markdown files (`.claude/agents/*.md`)
2. A sample aggregated report output (paste or file)
3. Brief writeup: what you learned about agent boundaries + tool restrictions

Good luck! 🚀
