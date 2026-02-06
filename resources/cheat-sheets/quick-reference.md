# Claude Code — Quick Reference (Doc‑backed)

This cheat sheet only includes commands/flags documented in the official Claude Code docs.

Docs:
- CLI reference: https://code.claude.com/docs/en/cli-reference
- Interactive mode (slash commands + shortcuts): https://code.claude.com/docs/en/interactive-mode
- Headless / Agent SDK CLI (`claude -p`): https://code.claude.com/docs/en/headless
- MCP: https://code.claude.com/docs/en/mcp
- Permissions: https://code.claude.com/docs/en/permissions
- Settings & scopes: https://code.claude.com/docs/en/settings
- Skills: https://code.claude.com/docs/en/skills
- Subagents: https://code.claude.com/docs/en/sub-agents

---

## Core CLI

```bash
claude                 # start interactive REPL
claude "<query>"       # start REPL with an initial prompt
claude -p "<query>"    # headless: print result then exit
claude update          # update Claude Code
claude -v              # version
```
(Ref: CLI commands table in https://code.claude.com/docs/en/cli-reference)

### Resume / continue sessions (CLI)

```bash
claude -c                      # continue most recent session in this directory
claude -c -p "<query>"         # continue headless
claude -r "<session>" "<query>" # resume by session id or name
claude --from-pr 123           # resume sessions linked to GitHub PR 123
```
(Ref: https://code.claude.com/docs/en/common-workflows#resume-previous-conversations and https://code.claude.com/docs/en/cli-reference)

---

## Interactive essentials (slash commands)

Type `/` in the REPL to see the full list.

Common built-ins (from https://code.claude.com/docs/en/interactive-mode):

- `/clear` — clear conversation history
- `/compact [instructions]` — compact conversation (optionally with focus)
- `/config` — open Settings UI
- `/status` — open Status tab
- `/model` — change model (and effort level for Opus 4.6)
- `/permissions` — view/update tool permissions
- `/mcp` — manage MCP connections + OAuth
- `/memory` — edit CLAUDE.md “memory” files
- `/resume [session]` — resume by id/name or open session picker
- `/rename <name>` — rename current session
- `/rewind` — rewind conversation/code
- `/tasks` — manage background tasks
- `/help` `/doctor` `/exit` — help, health check, exit

Handy input prefixes (same doc):
- `@path/to/file` — include a file or directory quickly (triggers autocomplete)
- `! <command>` — run a shell command in “Bash mode” and add output to context

---

## Headless (CI / scripts): `claude -p`

Basic:

```bash
claude -p "What does the auth module do?"
cat logs.txt | claude -p "Explain the root cause"
```

Structured output:

```bash
claude -p "Summarize this project" --output-format json
claude -p "Extract function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

Auto-approve tools (permission rules syntax applies):

```bash
claude -p "Run tests and fix failures" --allowedTools "Bash,Read,Edit"
```

Continue headless sessions:

```bash
claude -p "Review this codebase" 
claude -p "Now focus on database queries" --continue
```

Refs:
- Headless overview: https://code.claude.com/docs/en/headless
- Flags: https://code.claude.com/docs/en/cli-reference

---

## MCP (Model Context Protocol)

### Add servers (HTTP / SSE / stdio)

```bash
# HTTP (recommended for remote)
claude mcp add --transport http <name> <url>

# SSE
claude mcp add --transport sse <name> <url>

# Local stdio
claude mcp add --transport stdio <name> -- <command> [args...]
```

Scopes (local is default):

```bash
claude mcp add --transport http stripe --scope local   https://mcp.stripe.com
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
claude mcp add --transport http hubspot --scope user   https://mcp.hubspot.com/anthropic
```

Manage servers:

```bash
claude mcp list
claude mcp get <name>
claude mcp remove <name>
```

In the REPL:
- `/mcp` — view status, authenticate, manage connections

Also:

```bash
claude mcp serve   # run Claude Code as an MCP server (stdio)
```

Ref: https://code.claude.com/docs/en/mcp

---

## Permissions & modes (high-signal)

### Permission modes

You can:
- Toggle modes interactively with **Shift+Tab** (cycles; includes Delegate Mode when an agent team is active).
- Start in a mode via CLI:

```bash
claude --permission-mode plan
claude --permission-mode plan -p "Analyze auth and suggest improvements"
```

Documented modes (https://code.claude.com/docs/en/permissions#permission-modes):
- `default` — standard prompts
- `acceptEditsAutomatically` — auto-accept file edits (session)
- `plan` — read-only analysis
- `delegate` — coordination-only (agent team leads)
- `dontAsk` — auto-deny unless pre-approved
- `bypassPermissions` — skip prompts (dangerous; see docs)

### Manage / pre-approve tools

- In REPL: `/permissions`
- In settings.json: `permissions.allow` / `permissions.ask` / `permissions.deny`
- In headless/CLI: `--allowedTools`, `--disallowedTools`, `--tools`

Examples (CLI reference + permissions docs):

```bash
claude -p "Create a commit" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"

claude -p "Do analysis only" --tools "Read,Grep,Glob"  # restrict toolset
```

Refs:
- Permissions: https://code.claude.com/docs/en/permissions
- CLI flags: https://code.claude.com/docs/en/cli-reference

---

## Skills & subagents (what’s real)

### Skills

- Invoke any installed skill with `/skill-name`.
- Skills live in (priority order):
  - `~/.claude/skills/<skill>/SKILL.md` (personal)
  - `.claude/skills/<skill>/SKILL.md` (project)
  - plugin skills (namespaced)

Ref: https://code.claude.com/docs/en/skills

### Subagents

- Manage via `/agents` (interactive UI)
- Or define on launch with `--agents '{...}'` (JSON)

Example (from docs):

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

Ref: https://code.claude.com/docs/en/sub-agents and https://code.claude.com/docs/en/cli-reference#agents-flag-format

---

## Memory / rules files & @imports

### CLAUDE.md “memory” files

Claude Code uses CLAUDE.md for project guidance; `/memory` lets you edit memory files.
Settings docs list common locations:
- `CLAUDE.md` or `.claude/CLAUDE.md` (project)
- `~/.claude/CLAUDE.md` (user)
- `CLAUDE.local.md` (local)

Ref: https://code.claude.com/docs/en/settings (see table listing CLAUDE.md locations) and https://code.claude.com/docs/en/interactive-mode (for `/memory`).

### Import files into context quickly

Use `@` mentions in prompts to include files/dirs without waiting for discovery:

- `@src/auth.ts`
- `@src/`

Ref: https://code.claude.com/docs/en/common-workflows#reference-files-and-directories and https://code.claude.com/docs/en/interactive-mode (Quick commands).
