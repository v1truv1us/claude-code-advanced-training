# Module 08: Hooks & Automation

## 📋 Slide Deck

### Slide 1: Title
**Module 08: Hooks & Automation**
*Deterministic guardrails + event-driven workflow automation for Claude Code*

---

### Slide 2: Learning Objectives
By the end of this module, you will be able to:
- Explain what Claude Code hooks are (and what they are not)
- Configure hooks in `settings.json` (project + global scope)
- Choose the right hook event (SessionStart, PreToolUse, PostToolUse, Stop, …)
- Use matchers to target specific tools / notifications / lifecycle causes
- Parse hook **stdin JSON** and control behavior via **exit codes** or **structured JSON output**
- Implement safe, practical examples:
  - block dangerous shell commands
  - auto-format after edits
  - desktop notifications when Claude needs input

Docs:
- Hooks Guide: https://code.claude.com/docs/en/hooks-guide
- Hooks Reference: https://code.claude.com/docs/en/hooks

---

### Slide 3: What Hooks Are (and Aren’t)
**Hooks** are user-defined actions that run at specific points in Claude Code’s lifecycle.

- Hooks are **deterministic automation** ("this always runs")
- Hooks are configured in **JSON settings files** (not YAML workflows)
- Hooks run as one of three types:
  - `"type": "command"` → run a shell command
  - `"type": "prompt"` → single-turn model decision (`ok: true/false`)
  - `"type": "agent"` → subagent verification w/ tool access (`ok: true/false`)

Non-goals / limitations (important):
- Hooks **cannot** directly run slash commands or trigger tool calls; they communicate via stdout/stderr/exit codes only.

Docs:
- Limitations: https://code.claude.com/docs/en/hooks-guide#limitations-and-troubleshooting

---

### Slide 4: Where Hooks Live (Scope)
You add hooks to a **settings file**. Location controls scope and shareability:

- `~/.claude/settings.json` → all projects (local to your machine)
- `.claude/settings.json` → single project (commit to repo)
- `.claude/settings.local.json` → single project (gitignored)
- Org-managed policy settings → organization-wide
- Plugin: `hooks/hooks.json` (bundled)

Notes:
- Hooks added via `/hooks` take effect immediately.
- If you edit JSON manually while Claude is running, you typically need to open `/hooks` to reload or restart.

Docs:
- Configure hook location: https://code.claude.com/docs/en/hooks-guide#configure-hook-location
- The `/hooks` menu: https://code.claude.com/docs/en/hooks#the-hooks-menu

---

### Slide 5: Hook Events (Lifecycle)
Hooks fire on specific lifecycle events. Common ones:

- `SessionStart` — session begins/resumes (also after compaction)
- `UserPromptSubmit` — you submit a prompt (before Claude processes it)
- `PreToolUse` — **before** a tool runs (**can block/deny/ask**)
- `PermissionRequest` — a permission dialog appears
- `PostToolUse` — after a tool succeeds
- `PostToolUseFailure` — after a tool fails
- `Notification` — Claude Code sends a notification (e.g., needs attention)
- `SubagentStart` / `SubagentStop` — subagent lifecycle
- `Stop` — Claude finishes responding
- `PreCompact` — before context compaction
- `SessionEnd` — session ends

Docs:
- Events list: https://code.claude.com/docs/en/hooks-guide#how-hooks-work
- Reference lifecycle table: https://code.claude.com/docs/en/hooks#hook-lifecycle

---

### Slide 6: Minimal Hook Configuration (settings.json)
Hooks are configured under a top-level `"hooks"` object.

Example: notify whenever Claude needs input (Linux):
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Claude Code needs your attention'"
          }
        ]
      }
    ]
  }
}
```

Key points:
- Each event maps to an array of hook blocks.
- Each block can include a `matcher` and a list of `hooks`.

Docs:
- Notification example: https://code.claude.com/docs/en/hooks-guide#get-notified-when-claude-needs-input

---

### Slide 7: Matchers (Filter When Hooks Fire)
Without a matcher, a hook runs for **every** occurrence of the event.

Matchers are **case-sensitive** and can be exact strings or regex.

What the matcher filters depends on the event:
- `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`: **tool name**
  - examples: `Bash`, `Edit|Write`, `mcp__.*`
- `SessionStart`: how session started (`startup`, `resume`, `compact`, …)
- `Notification`: notification type (`permission_prompt`, `idle_prompt`, …)
- `PreCompact`: compaction trigger (`manual`, `auto`)
- `SessionEnd`: end reason (`clear`, `logout`, …)
- `UserPromptSubmit`, `Stop`: **no matcher support** (always fires)

Docs:
- Matchers: https://code.claude.com/docs/en/hooks-guide#filter-hooks-with-matchers

---

### Slide 8: Hook I/O: stdin JSON, stdout/stderr, exit codes
When an event fires, Claude Code sends JSON to **stdin**.

Example `PreToolUse` input for Bash:
```json
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

How your hook responds:
- **Exit 0**: proceed
  - for `SessionStart` / `UserPromptSubmit`: stdout is injected into Claude’s context
- **Exit 2**: block the action
  - write the reason to **stderr** (fed back to Claude)
- **Any other exit**: action proceeds; stderr is logged (visible in verbose mode)

Docs:
- Read input / return output: https://code.claude.com/docs/en/hooks-guide#read-input-and-return-output
- Common input fields: https://code.claude.com/docs/en/hooks#common-input-fields

---

### Slide 9: Structured JSON Output (More Than Allow/Block)
For some events you can return **structured JSON** on stdout (usually with exit 0) to control behavior.

Example: `PreToolUse` can set `permissionDecision`:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep for better performance"
  }
}
```

`permissionDecision` options:
- `allow` — proceed without permission prompt
- `deny` — cancel tool call and send reason back to Claude
- `ask` — show the permission prompt normally

Docs:
- Structured output: https://code.claude.com/docs/en/hooks-guide#structured-json-output
- Decision control table: https://code.claude.com/docs/en/hooks#decision-control

---

### Slide 10: Safe Example — Block Dangerous Bash (PreToolUse)
Goal: prevent risky commands **before** they run.

**settings.json** (project-local recommended):
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/block_dangerous_bash.py"
          }
        ]
      }
    ]
  }
}
```

**.claude/hooks/block_dangerous_bash.py** (reads stdin JSON, blocks with exit 2):
```python
#!/usr/bin/env python3
import json, sys, re

payload = json.load(sys.stdin)
cmd = (payload.get("tool_input") or {}).get("command") or ""

# Keep the blocklist focused + explain why.
DANGEROUS = [
  r"\brm\s+-rf\b",
  r"\bmkfs\b",
  r"\bshutdown\b|\breboot\b",
  r"\bDROP\s+TABLE\b",
  r"\bcurl\b.*\|\s*\b(bash|sh)\b"
]

if any(re.search(p, cmd, flags=re.IGNORECASE) for p in DANGEROUS):
  sys.stderr.write(
    "Blocked by policy: potentially destructive shell command. "
    "If you truly need this, run it manually outside Claude Code and paste results.\n"
  )
  sys.exit(2)

sys.exit(0)
```

Why this is safe:
- blocks *classes* of high-risk operations
- gives Claude feedback to adjust approach

Docs:
- Blocking with exit 2: https://code.claude.com/docs/en/hooks-guide#hook-output
- Security considerations: https://code.claude.com/docs/en/hooks#security-considerations

---

### Slide 11: Safe Example — Auto-format After Edits (PostToolUse)
Goal: keep formatting consistent after Claude edits files.

Run formatter only after `Edit` or `Write` tool calls.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs -r npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

Notes:
- `PostToolUse` runs **after** the tool succeeds; it can’t undo a bad edit.
- `jq` extracts the edited file path from stdin JSON.

Docs:
- Formatter example: https://code.claude.com/docs/en/hooks-guide#auto-format-code-after-edits

---

### Slide 12: Safe Example — Notification When Claude Needs You (Notification)
Goal: stop babysitting the terminal.

Linux example:
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Claude Code needs your attention'"
          }
        ]
      }
    ]
  }
}
```

Useful notification matchers (varies by UI state):
- `permission_prompt`
- `idle_prompt`
- `elicitation_dialog`

Docs:
- Notification matchers: https://code.claude.com/docs/en/hooks-guide#filter-hooks-with-matchers

---

### Slide 13: “Deterministic vs Judgment” — command vs prompt vs agent
Use the right hook type:

- `command` when:
  - the rule is mechanical (block patterns, log, format, validate)
  - you can decide from stdin + filesystem state quickly

- `prompt` when:
  - you need lightweight judgment on hook input data
  - you want a fast yes/no gate (e.g., Stop “are tasks complete?”)

- `agent` when:
  - verification requires tools (run tests, inspect repo, search code)
  - you need multi-turn validation (still returns `ok: true/false`)

Docs:
- Prompt hooks: https://code.claude.com/docs/en/hooks-guide#prompt-based-hooks
- Agent hooks: https://code.claude.com/docs/en/hooks-guide#agent-based-hooks

---

### Slide 14: Troubleshooting & Operational Tips
Common issues + fixes:

- Hook not firing
  - check event name and matcher (case-sensitive)
  - open `/hooks` to confirm it loaded

- JSON parse errors
  - your shell profile may be printing extra text; gate `echo` to interactive shells only

- Hook errors in transcript
  - test manually by piping sample JSON
  - ensure scripts are executable and paths are correct

- Debug output
  - toggle verbose mode (Ctrl+O) or run `claude --debug`

Docs:
- Troubleshooting: https://code.claude.com/docs/en/hooks-guide#limitations-and-troubleshooting

---

### Slide 15: Key Takeaways
- Hooks are the **enforcement layer**: deterministic automation at lifecycle events
- Configure in `settings.json` under `"hooks"` (global or project scope)
- Use **matchers** to keep hooks targeted and fast
- Control behavior via **exit codes** (0 allow, 2 block) and, where supported, **structured JSON output**
- Start with safe, high-leverage patterns:
  - block destructive Bash
  - auto-format after edits
  - notify on required input

Next: apply these patterns in the Module 08 exercise.

---
*Video Duration: 12 minutes (update as needed)*
