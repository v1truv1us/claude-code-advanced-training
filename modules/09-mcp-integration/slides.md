# Module 09: MCP Integration

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 09: MCP Integration**
*Connecting Claude Code to External Services and Data Sources*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Understand the Model Context Protocol (MCP) architecture
- Configure MCP servers for various data sources
- Implement authentication patterns for secure integrations
- Build custom MCP servers for domain-specific needs
- Handle errors and edge cases in MCP workflows
- Apply security best practices for external connections

### Slide 3: What is MCP?

**Definition**
MCP (Model Context Protocol) is an open protocol that standardizes how applications provide context to LLMs. It enables Claude Code to connect to external data sources, tools, and services.

**Key Capabilities**
- Access databases, APIs, and files
- Execute tools and commands on external systems
- Retrieve real-time data
- Integrate with enterprise systems
- Extend Claude's capabilities beyond code

**Architecture Overview**
```
Claude Code ←→ MCP Client ←→ MCP Server ←→ Data Source
                    ↑
              Standardized Protocol
              (Resources, Tools, Prompts)
```

**Why MCP Matters**
- Universal integration standard
- Vendor-neutral protocol
- Secure and auditable
- Enables AI to work with your existing infrastructure

### Slide 4: MCP Core Concepts

**Three Primitives**

1. **Resources** - Read-only data access
   ```typescript
   // Resource example: Database schema
   {
     uri: "postgres://localhost/mydb/schema",
     name: "Database Schema",
     mimeType: "application/json",
     text: JSON.stringify(schema)
   }
   ```

2. **Tools** - Executable functions
   ```typescript
   // Tool example: Execute SQL query
   {
     name: "execute_sql",
     description: "Run a SQL query against the database",
     parameters: {
       type: "object",
       properties: {
         query: { type: "string" },
         maxRows: { type: "number", default: 100 }
       }
     }
   }
   ```

3. **Prompts** - Reusable templates
   ```typescript
   // Prompt example: Database migration
   {
     name: "generate_migration",
     description: "Generate database migration script",
     arguments: [{
       name: "change_description",
       description: "What needs to change",
       required: true
     }]
   }
   ```

**MCP Server Types**

| Type | Use Case | Example |
|------|----------|---------|
| Built-in | Common integrations | Filesystem, SQLite |
| Third-party | Popular services | GitHub, Slack, AWS |
| Custom | Domain-specific | Internal APIs, legacy systems |

### Slide 5: Built-in MCP Servers

**Filesystem Server**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

**Capabilities:**
- Read/write files
- List directories
- Search file contents
- Watch for changes

**Use Cases:**
- Access project files outside workspace
- Work with multiple repositories
- Process large file sets

**SQLite Server**
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/db.sqlite"]
    }
  }
}
```

**Capabilities:**
- Execute SQL queries
- Read table schemas
- Database migrations
- Data analysis

### Slide 6: Third-Party MCP Servers

**GitHub Integration**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Available Tools:**
- Search repositories
- Create/manage issues
- Review pull requests
- Read file contents
- List commits

**Slack Integration**
```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

**Available Tools:**
- Send messages to channels
- Read channel history
- List users and channels
- Post notifications

**PostgreSQL Integration**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", 
               "postgresql://user:pass@localhost/db"]
    }
  }
}
```

### Slide 7: Configuring MCP in Claude Code

**Global Configuration**
```json
// ~/.config/claude/settings.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Project-Specific Configuration**
```json
// .claude/mcp.json (in project root)
{
  "mcpServers": {
    "project-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", 
               "postgresql://localhost/project_db"]
    },
    "local-files": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

**Environment Variables**
```bash
# Use env vars for sensitive data
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
export DATABASE_URL="postgresql://user:pass@localhost/db"
export SLACK_BOT_TOKEN="xoxb-xxxxxxxxxx"
```

### Slide 8: Authentication Patterns

**Token-Based Authentication**
```json
{
  "mcpServers": {
    "api-service": {
      "command": "npx",
      "args": ["-y", "@company/mcp-server-api"],
      "env": {
        "API_TOKEN": "${API_TOKEN}",
        "API_BASE_URL": "https://api.company.com/v1"
      }
    }
  }
}
```

**OAuth 2.0 Flow**
```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
      }
    }
  }
}
```

**Certificate-Based Auth**
```json
{
  "mcpServers": {
    "internal-api": {
      "command": "npx",
      "args": ["-y", "@company/mcp-internal-api"],
      "env": {
        "CLIENT_CERT_PATH": "${HOME}/.certs/client.crt",
        "CLIENT_KEY_PATH": "${HOME}/.certs/client.key",
        "CA_CERT_PATH": "${HOME}/.certs/ca.crt"
      }
    }
  }
}
```

**Credential Management Best Practices**
1. Never commit credentials to version control
2. Use environment variables for all secrets
3. Rotate tokens regularly
4. Use least-privilege access tokens
5. Audit MCP server access logs

### Slide 9: Using MCP Tools in Workflows

**Natural Language Invocation**
```
User: "List all issues in the repository"
→ Claude uses github server
→ Calls search_issues tool
→ Returns formatted results
```

**Explicit Tool Usage**
```typescript
// Direct tool invocation in scripts
const issues = await mcp.github.callTool("search_issues", {
  query: "is:open is:issue label:bug",
  sort: "updated",
  order: "desc"
});
```

**Multi-Server Workflows**
```typescript
// Cross-server data integration
// 1. Get data from database
const users = await mcp.postgres.callTool("query", {
  sql: "SELECT * FROM users WHERE active = true"
});

// 2. Post summary to Slack
await mcp.slack.callTool("post_message", {
  channel: "#analytics",
  text: `Daily user count: ${users.length}`
});

// 3. Create GitHub issue for tracking
await mcp.github.callTool("create_issue", {
  title: `Daily Report: ${users.length} active users`,
  body: generateReportBody(users),
  labels: ["daily-report", "automated"]
});
```

### Slide 10: Error Handling & Resilience

**Common MCP Errors**

1. **Connection Failures**
```typescript
try {
  const result = await mcp.server.callTool("query", params);
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    console.error('MCP server not running. Start it with: npm run mcp:start');
  }
}
```

2. **Authentication Errors**
```typescript
try {
  await mcp.github.callTool("create_issue", params);
} catch (error) {
  if (error.status === 401) {
    console.error('GitHub token expired or invalid. Run: gh auth login');
  }
}
```

3. **Rate Limiting**
```typescript
// Implement exponential backoff
async function resilientCall(tool: string, params: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await mcp.server.callTool(tool, params);
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
}
```

**Graceful Degradation**
```typescript
async function getDataWithFallback() {
  try {
    // Try MCP first
    return await mcp.database.callTool("query", { sql: "SELECT * FROM data" });
  } catch (error) {
    console.warn('MCP unavailable, using local cache');
    return await readLocalCache();
  }
}
```

### Slide 11: Building Custom MCP Servers

**Basic Server Structure**
```typescript
// mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'my-custom-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      resources: {},
      tools: {}
    }
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'custom_query',
        description: 'Execute custom business logic',
        parameters: {
          type: 'object',
          properties: {
            input: { type: 'string' }
          }
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'custom_query') {
    const result = await executeCustomLogic(request.params.arguments);
    return {
      content: [{ type: 'text', text: JSON.stringify(result) }]
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Custom Resource Provider**
```typescript
// Expose internal API as MCP resource
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'internal-api://users',
        name: 'User Directory',
        mimeType: 'application/json'
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === 'internal-api://users') {
    const users = await fetchInternalUsers();
    return {
      contents: [{
        uri: request.params.uri,
        mimeType: 'application/json',
        text: JSON.stringify(users)
      }]
    };
  }
});
```

### Slide 12: MCP Security Best Practices

**Network Security**
```json
{
  "mcpServers": {
    "secure-server": {
      "command": "npx",
      "args": ["-y", "@company/mcp-server"],
      "env": {
        "API_ENDPOINT": "https://api.internal.company.com",
        "VERIFY_SSL": "true"
      }
    }
  }
}
```

**Access Control**
```typescript
// Implement authorization in custom servers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Verify user permissions
  const user = await authenticateUser(request);
  
  if (!user.hasPermission(request.params.name)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }
  
  return executeTool(request.params);
});
```

**Data Sanitization**
```typescript
// Validate and sanitize all inputs
function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input.replace(/[<>\"']/g, '');
}

// Validate SQL queries
function validateQuery(query: string): boolean {
  const dangerous = /(DROP|DELETE|TRUNCATE)\s+/i;
  return !dangerous.test(query);
}
```

**Audit Logging**
```typescript
// Log all MCP operations
async function auditedCall(tool: string, params: any) {
  const startTime = Date.now();
  
  try {
    const result = await mcp.server.callTool(tool, params);
    
    auditLog.info({
      tool,
      params: sanitizeForLog(params),
      duration: Date.now() - startTime,
      success: true
    });
    
    return result;
  } catch (error) {
    auditLog.error({
      tool,
      params: sanitizeForLog(params),
      error: error.message,
      duration: Date.now() - startTime
    });
    throw error;
  }
}
```

### Slide 13: Enterprise Integration Patterns

**Multi-Environment Setup**
```json
// .claude/mcp.development.json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", 
               "postgresql://localhost/dev_db"]
    }
  }
}

// .claude/mcp.production.json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", 
               "postgresql://prod-db.internal:5432/prod_db"],
      "env": {
        "SSL_MODE": "require",
        "SSL_CERT": "${PROD_DB_CERT}"
      }
    }
  }
}
```

**Service Mesh Integration**
```yaml
# Kubernetes deployment with MCP sidecar
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claude-workspace
spec:
  template:
    spec:
      containers:
        - name: claude
          image: claude-code:latest
        - name: mcp-sidecar
          image: company/mcp-sidecar:latest
          env:
            - name: SERVICE_MESH_TOKEN
              valueFrom:
                secretKeyRef:
                  name: mesh-token
                  key: token
```

### Slide 14: Summary & Key Takeaways

**Core Concepts**
1. **Resources** - Read-only data access
2. **Tools** - Executable functions  
3. **Prompts** - Reusable templates
4. **Servers** - MCP protocol endpoints

**Security Essentials**
- Use environment variables for secrets
- Implement least-privilege access
- Validate all inputs
- Audit all operations
- Use TLS for all connections

**Integration Patterns**
- Built-in servers for common needs
- Third-party servers for popular services
- Custom servers for domain-specific needs
- Multi-server orchestration for complex workflows

**Impact**
- Access any data source or API
- Automate cross-system workflows
- Extend Claude's capabilities infinitely
- Maintain security and auditability

---
*Video Duration: 12 minutes*
