# Module 09: MCP Integration (Claude Code)

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 09: MCP Integration**  
*Connecting Claude Code to external tools & data sources via the Model Context Protocol (MCP)*

---

### Slide 2: Learning Objectives
By the end of this module, you will be able to:
- Explain what MCP is and what Claude Code gets from it (tools, resources, prompts)
- Add/manage MCP servers with the Claude CLI (`claude mcp add/list/get/remove`)
- Choose the right **transport** (stdio vs HTTP vs SSE)
- Choose the right **scope** (local vs project vs user) and understand precedence
- Use **.mcp.json** safely with env-var expansion and team-friendly patterns
- Understand Claude Code’s **approval flow** for project-scoped servers
- Apply safe defaults: least privilege, output limits, allow/deny policies

Docs:
- Claude Code MCP: https://code.claude.com/docs/en/mcp
- MCP intro: https://modelcontextprotocol.io/introduction

---

### Slide 3: MCP in 30 Seconds
**MCP (Model Context Protocol)** is an open standard that lets Claude Code connect to external systems.

**What MCP servers provide:**
- **Tools** (actions Claude can run)
- **Resources** (readable context you can @-mention)
- **Prompts** (reusable templates exposed as commands)

**Mental model**
```
Claude Code  ──(MCP client)──►  MCP Server  ──►  Your API / DB / SaaS / System
```

Why it matters:
- Standard integration surface
- Auditable tool calls
- Works for local automation and hosted services

---

### Slide 4: Transports (How Claude Talks to Servers)
Claude Code supports multiple MCP transports:

1) **HTTP (remote)** — *recommended for cloud/remote services*
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp

# with headers
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer $TOKEN"
```

2) **SSE (remote)** — server-sent events transport
```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

3) **stdio (local)** — runs a process on your machine
```bash
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=$AIRTABLE_API_KEY \
  -- npx -y airtable-mcp-server
```

Guideline:
- Prefer **HTTP** for hosted integrations
- Use **stdio** when the tool needs local filesystem access, local credentials, or custom scripts

Docs: https://code.claude.com/docs/en/mcp#installing-mcp-servers

---

### Slide 5: Core CLI Flows (Add / List / Get / Remove)
**Add a server**
```bash
# http
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# sse
claude mcp add --transport sse my-sse https://example.com/sse

# stdio (note the `--` separator)
claude mcp add --transport stdio local-db -- npx -y @bytebase/dbhub --help
```

**Inspect & manage**
```bash
claude mcp list
claude mcp get github
claude mcp remove github
```

**Inside Claude Code:** check status and connect/authenticate
```
/mcp
```

Docs: https://code.claude.com/docs/en/mcp#managing-your-servers

---

### Slide 6: Scopes (Where Config Lives) + Precedence
MCP servers can be installed at different **scopes**:

- **local** (default): private to you *in the current project directory*
- **project**: stored in **.mcp.json** at repo root (team-shared)
- **user**: stored in your user config (available across projects)

Examples:
```bash
# local (default)
claude mcp add --transport http stripe https://mcp.stripe.com

# project (team shared)
claude mcp add --transport http --scope project paypal https://mcp.paypal.com/mcp

# user (cross-project)
claude mcp add --transport http --scope user hubspot https://mcp.hubspot.com/anthropic
```

**Precedence when names collide:** local → project → user

Docs: https://code.claude.com/docs/en/mcp#mcp-installation-scopes

---

### Slide 7: .mcp.json (Team-Shareable MCP Config)
When you add a **project-scoped** server, Claude Code creates/updates a **.mcp.json** at the project root.

Canonical structure:
```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

Remote servers use URL + optional headers:
```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

**Team rule:** commit .mcp.json, but keep secrets out of git (use env expansion).

Docs: https://code.claude.com/docs/en/mcp#environment-variable-expansion-in-mcpjson

---

### Slide 8: Approval Flow for Project-Scoped Servers
**Important security behavior:** project-scoped servers in **.mcp.json** require user approval before Claude Code will use them.

Why:
- A repo could add an MCP server that executes a local command (stdio)
- Approval acts as a safeguard against supply-chain & repo-trust issues

Reset approvals if you changed your mind:
```bash
claude mcp reset-project-choices
```

Docs: https://code.claude.com/docs/en/mcp#mcp-installation-scopes

---

### Slide 9: Environment Variable Expansion in .mcp.json
Claude Code expands env vars inside **.mcp.json** so teams can share configs safely.

Supported syntax:
- `${VAR}`
- `${VAR:-default}`

Where expansion works:
- `command`, `args`, `env`
- `url`, `headers` (for HTTP/SSE)

Example:
```json
{
  "mcpServers": {
    "internal": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

Failure mode:
- If a required variable is missing and has no default, Claude Code fails to parse the config.

Docs: https://code.claude.com/docs/en/mcp#environment-variable-expansion-in-mcpjson

---

### Slide 10: Safe Patterns for Secrets & Credentials
**DO**
- Use `${VAR}` in `.mcp.json` and set secrets via your shell, `.env`, or OS keychain flow
- Keep **project** scope configs free of secrets (team-safe)
- Use least-privilege tokens (read-only where possible)

**DON’T**
- Commit tokens in `.mcp.json`
- Use powerful tokens for “quick experiments” that end up shared

Recommended layout:
- `.mcp.json` (committed): server endpoints + *variable references*
- `.env` (gitignored) or secret manager: actual secret values

---

### Slide 11: Server Output Limits + Tool Search (Scaling)
Two important scaling features:

1) **MCP output limits**
- Warn when MCP tool output exceeds ~10k tokens
- Default maximum ~25k tokens
- Configurable via environment variable:
```bash
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

2) **MCP Tool Search**
When tool definitions would consume >10% of the context window, Claude Code can defer tool loading and search on-demand.

Control with:
```bash
# default
ENABLE_TOOL_SEARCH=auto claude

# custom threshold
ENABLE_TOOL_SEARCH=auto:5 claude

# disable
ENABLE_TOOL_SEARCH=false claude
```

Docs: https://code.claude.com/docs/en/mcp#mcp-output-limits-and-warnings

---

### Slide 12: Using MCP Resources & Prompts in Claude Code
**Resources** can be referenced similarly to files using @ mentions (server-dependent):
- Example: a server might expose `schema://database/orders`
- You can reference it to ground the conversation

**Prompts** exposed by servers can appear as Claude Code commands.

Key takeaway:
- MCP isn’t just “tools” — it’s also reusable context and reusable workflows.

Docs:
- Resources: https://code.claude.com/docs/en/mcp#use-mcp-resources
- Prompts: https://code.claude.com/docs/en/mcp#use-mcp-prompts-as-commands

---

### Slide 13: Plugins and .mcp.json (Bundled Servers)
Claude Code plugins can bundle MCP servers:
- define servers in **.mcp.json** at plugin root, or inline in `plugin.json`
- servers start automatically when the plugin is enabled
- changes require a Claude Code restart to apply

Example (plugin root .mcp.json):
```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

Docs:
- Plugins + MCP: https://code.claude.com/docs/en/mcp#plugin-provided-mcp-servers
- Plugin MCP reference: https://code.claude.com/docs/en/plugins-reference#mcp-servers

---

### Slide 14: Managed MCP (Enterprise Guardrails)
Organizations can centrally manage MCP in two ways:

1) **Exclusive control** with `managed-mcp.json`
- Deploy a fixed set of servers; users cannot add/modify
- Locations:
  - macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
  - Linux/WSL: `/etc/claude-code/managed-mcp.json`
  - Windows: `C:\\Program Files\\ClaudeCode\\managed-mcp.json`

2) **Policy-based** allowlist/denylist
- Allow users to add servers but restrict by:
  - server name
  - exact stdio command+args
  - URL pattern (remote)

Docs: https://code.claude.com/docs/en/mcp#managed-mcp-configuration

---

### Slide 15: Safe-by-Default Checklist (Practical)
Before enabling an MCP server:
- **Trust boundary**: who controls the server endpoint or the stdio command?
- **Scope**: choose **project** only when it’s safe for the team and reviewable
- **Least privilege**: tokens scoped to the minimum permissions
- **Pin & audit**:
  - stdio: prefer reviewed binaries, pinned versions, or internal packages
  - remote: prefer HTTPS, review headers, and keep tokens out of git
- **Outputs**: cap large outputs; avoid dumping entire DB tables into chat

---

### Slide 16: Summary & Key Takeaways
- MCP is the standard way to connect Claude Code to tools, data, and workflows
- Use `claude mcp add/list/get/remove` to manage servers
- Choose the right transport: **HTTP** (recommended), **SSE**, or **stdio**
- Scopes matter (local/project/user) and follow local → project → user precedence
- `.mcp.json` is the team-shareable contract; use env var expansion for safety
- Expect an approval prompt for project-scoped servers; reset with `claude mcp reset-project-choices`

---
*Video Duration: ~12 minutes*  
*Last reviewed: 2026-02-05; align with Claude Code MCP docs.*
