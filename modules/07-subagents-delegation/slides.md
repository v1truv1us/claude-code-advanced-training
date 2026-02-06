# Module 07: Subagents & Delegation

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 07: Subagents & Delegation**  
*Scale work safely with specialized agents and context isolation*

### Slide 2: Learning Objectives
By the end of this module, you will be able to:
- Explain what subagents are and when to delegate
- Create **project** and **user** subagents using Markdown + YAML frontmatter
- Apply **scope precedence** rules so the right subagent is active
- Configure supported frontmatter fields: `tools`, `disallowedTools`, `model`, `permissionMode`, `skills`, `hooks`, `memory`
- Design robust delegation patterns (fan-out, pipeline, gates) with safe aggregation
- Use background subagents effectively (and understand their limitations)

### Slide 3: What Subagents Are (and Why They Matter)
**Definition (Claude Code):**
- A subagent is a **specialized AI assistant** that runs in its **own context window** with:
  - a custom system prompt
  - explicit tool access and permissions
  - an optional model choice (cost/speed control)

**Why they’re powerful**
- **Context preservation:** exploration and verbose output stays out of your main thread
- **Constraints:** principle of least privilege via tool allow/deny lists
- **Reuse:** user-level agents work across projects
- **Specialization:** focused system prompts produce more consistent results

Docs: <https://code.claude.com/docs/en/sub-agents>

### Slide 4: Built-in Subagents You’ll See
Claude Code ships with built-in subagents and uses them automatically when appropriate:
- **Explore** (Haiku, read-only): codebase search / discovery (no Write/Edit)
- **Plan** (read-only): used in plan mode for research
- **general-purpose** (inherits model, all tools): complex multi-step tasks

Key constraints:
- **Subagents cannot spawn other subagents** (no nesting). Design pipelines accordingly.

Docs: <https://code.claude.com/docs/en/sub-agents#built-in-subagents>

### Slide 5: Where Subagents Live (Scope + Precedence)
Subagents are Markdown files stored in specific directories. If names collide, higher priority wins.

**Priority order (highest → lowest):**
1. `--agents` CLI flag (current session only)
2. `.claude/agents/` (project scope)
3. `~/.claude/agents/` (user scope)
4. plugin `agents/` directory (where plugin is enabled)

**Rule of thumb**
- Put team/shared agents in **`.claude/agents/`** and commit them.
- Put personal helpers in **`~/.claude/agents/`**.

Docs: <https://code.claude.com/docs/en/sub-agents#choose-the-subagent-scope>

### Slide 6: Subagent File Format (Markdown + YAML Frontmatter)
A subagent is a Markdown file:
- YAML frontmatter = configuration
- Markdown body = the subagent’s **system prompt**

**Example: `.claude/agents/code-reviewer.md`**
```md
---
name: code-reviewer
description: Reviews code changes for quality and best practices. Use proactively after edits.
tools: Read, Glob, Grep
model: sonnet
permissionMode: default
---

You are a senior code reviewer.

When invoked:
- Read only what you need.
- Report actionable findings with file/line references.
- Separate MUST-FIX vs NICE-TO-HAVE.
```

Docs: <https://code.claude.com/docs/en/sub-agents#write-subagent-files>

### Slide 7: Supported Frontmatter Fields (Know What’s Real)
Only the following frontmatter fields are supported (others may be ignored):

Required:
- `name` — lowercase letters + hyphens
- `description` — when Claude should delegate to this agent

Optional:
- `tools` — allowlist of tool names (inherits all tools if omitted)
- `disallowedTools` — denylist (removes from inherited/specified)
- `model` — `haiku | sonnet | opus | inherit` (default: inherit)
- `permissionMode` — `default | acceptEdits | dontAsk | bypassPermissions | plan`
- `skills` — skills to **preload** into the subagent context (not inherited)
- `hooks` — lifecycle hooks scoped to this subagent
- `memory` — persistent memory directory scope: `user | project | local`

Docs: <https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields>

### Slide 8: Tools: Allowlist vs Denylist (Least Privilege)
Subagents can use any internal tools that Claude Code supports.

**Important details**
- If `tools` is **omitted**, the subagent **inherits all tools** from the main conversation (including MCP tools).
- You can tighten access with either:
  - `tools` (allowlist), and/or
  - `disallowedTools` (denylist)

**Safe researcher (read-only + bash for greps/tests):**
```md
---
name: safe-researcher
description: Read-only codebase research and summarization
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
---

Research thoroughly; never propose edits unless asked.
Return a concise summary with citations.
```

Docs: <https://code.claude.com/docs/en/sub-agents#available-tools>

### Slide 9: Permission Modes (and the Precedence Gotcha)
`permissionMode` controls how the subagent handles permission prompts:
- `default` — normal prompts
- `acceptEdits` — auto-accept file edits
- `dontAsk` — auto-deny prompts (explicitly allowed tools still work)
- `bypassPermissions` — skip permission checks
- `plan` — plan-mode behavior (read-only exploration)

**Precedence rule:**
- If the **parent** conversation uses `bypassPermissions`, it **takes precedence** and the subagent cannot override it.

Docs: <https://code.claude.com/docs/en/sub-agents#permission-modes>

### Slide 10: Skills Are Not Inherited (Preload Them)
Subagents **do not inherit skills** from the parent session. If a subagent needs team conventions, preload them:

```md
---
name: api-developer
description: Implements API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---

Implement endpoints following the preloaded conventions.
```

Best practice:
- Keep the agent prompt short; put detailed conventions in skills.

Docs:
- Subagents skills field: <https://code.claude.com/docs/en/sub-agents#preload-skills-into-subagents>
- Skills overview: <https://code.claude.com/docs/en/skills>

### Slide 11: Persistent Memory (Cross-Session Learnings)
The `memory` field gives the subagent a persistent directory it can read/write across conversations.

```md
---
name: code-reviewer
description: Reviews code and remembers recurring issues
memory: user
---

Before reviewing, consult your memory for project patterns.
After reviewing, store any new recurring issues and conventions.
```

Scopes:
- `user` → `~/.claude/agent-memory/<agent-name>/`
- `project` → `.claude/agent-memory/<agent-name>/` (shareable)
- `local` → `.claude/agent-memory-local/<agent-name>/` (don’t commit)

Note:
- When memory is enabled, Claude Code automatically enables **Read/Write/Edit** so the agent can manage its memory files.

Docs: <https://code.claude.com/docs/en/sub-agents#enable-persistent-memory>

### Slide 12: Hooks for Guardrails (Optional, Powerful)
Subagents can define hooks in their own frontmatter.

Common events:
- `PreToolUse` — validate before tool runs
- `PostToolUse` — follow-up actions after tool runs
- `Stop` — runs when subagent finishes (converted to `SubagentStop` at runtime)

**Example: block dangerous Bash commands**
```md
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---

Only run SELECT queries. If a query is not read-only, refuse.
```

Docs:
- Subagent hooks: <https://code.claude.com/docs/en/sub-agents#define-hooks-for-subagents>
- Hooks reference: <https://code.claude.com/docs/en/hooks>

### Slide 13: How Delegation Actually Happens
Claude delegates based on:
- what you ask for
- the subagent’s `description`
- current context

**Make delegation more reliable**
- Write descriptions that are:
  - specific (“review recent changes for auth + secrets exposure”)
  - directive (“use proactively after edits”)
- Explicitly request an agent when needed:
  - “Have the **code-reviewer** subagent review my changes”

Docs: <https://code.claude.com/docs/en/sub-agents#understand-automatic-delegation>

### Slide 14: Background vs Foreground Subagents
Subagents can run:
- **Foreground**: blocks main chat; permission prompts and questions are passed through.
- **Background**: runs concurrently.

Background limitations (design around these):
- Claude Code pre-prompts for permissions up front; anything not approved is auto-denied.
- If the subagent needs to ask clarifying questions, those tool calls fail but the agent continues.
- **MCP tools are not available in background subagents.**

Docs: <https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background>

### Slide 15: Delegation Patterns That Scale (Best Practices)
**1) Fan-out → aggregate (independent analyses)**
- Security + performance + test coverage can run in parallel

**2) Pipeline (dependent steps)**
- Explore → plan → implement → verify

**3) Approval gates for risky actions**
- Separate “recommend” agent from “execute” agent

**4) Isolate high-volume output**
- Run tests/log processing in a subagent; return only a summary

Docs: <https://code.claude.com/docs/en/sub-agents#common-patterns>

### Slide 16: Example — Parallel Review Pipeline (matches this module’s exercise)
In code, you typically fan-out with `Promise.all()` and then aggregate.

```ts
import { task } from '@anthropic-ai/claude-code';

const [security, perf, coverage] = await Promise.all([
  task({
    description: 'Security review',
    prompt: 'Review for auth flaws, injection, secrets exposure. Return JSON.',
    subagent_type: 'security-scanner',
  }),
  task({
    description: 'Performance review',
    prompt: 'Find hotspots, N+1 patterns, sync I/O, memory bloat. Return JSON.',
    subagent_type: 'performance-expert',
  }),
  task({
    description: 'Coverage review',
    prompt: 'Assess tests and missing cases. Return JSON.',
    subagent_type: 'test-coverage-checker',
  }),
]);

return aggregate({ security, perf, coverage });
```

Best practices:
- Put **output format requirements** in the prompt (e.g., JSON schema).
- Always **validate** subagent output before using it.

### Slide 17: Reliability Patterns (Don’t Let Delegation Become Fragile)
**Guardrails you should add:**
- Per-subagent try/catch + structured error return
- Retry with exponential backoff for transient failures
- Timeouts for long-running tasks
- Output validation (JSON parse + required keys)

**Rule:** treat subagent output like an external API response.

### Slide 18: Anti-Patterns (Common Ways Teams Get Burned)
**❌ Micro-delegation**
- Spawning agents for tiny tasks increases overhead and decreases coherence

**❌ Over-broad tool access**
- Avoid “all tools” unless the agent truly needs it

**❌ Assuming skills are inherited**
- Explicitly preload skills via `skills:`

**❌ Backgrounding tasks that require MCP/tools/questions**
- Background agents can’t use MCP tools and can’t AskUserQuestion successfully

### Slide 19: Practical Setup Checklist
1. Create subagents with `/agents` (recommended) or manually in `.claude/agents/`
2. Start with minimal tools (Read/Grep/Glob) and expand only when needed
3. Encode expectations in the prompt body:
   - output format
   - “cite file/line”
   - “return MUST-FIX vs NICE-TO-HAVE”
4. If needed, add:
   - `skills` for conventions
   - `hooks` for guardrails
   - `memory` for long-term learning

### Slide 20: Summary
Key takeaways:
- Subagents = specialization + isolation + safer scaling
- Scope precedence matters: CLI > project > user > plugin
- Use only supported fields; prefer least privilege tools
- Skills are **not inherited**; preload them explicitly
- Use fan-out/pipeline/gates, validate outputs, and handle failures

Further reading:
- Subagents: <https://code.claude.com/docs/en/sub-agents>
- Hooks: <https://code.claude.com/docs/en/hooks>
- Skills: <https://code.claude.com/docs/en/skills>

---
*Video Duration: ~12 minutes*  
*Exercise: implement a parallel review pipeline using three specialist subagents.*
