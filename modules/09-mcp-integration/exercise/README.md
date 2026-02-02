# Module 09 Exercise: MCP Integration Workflow

## 🎯 Objective
Configure and use MCP servers to build an automated workflow that analyzes GitHub issues, queries a database, and posts summaries to Slack.

## 📋 Prerequisites
- Completed Modules 1-8
- Understanding of MCP architecture
- Access to GitHub, Slack (or mock versions)

## 🏗️ Exercise Structure

### Part 1: Configure MCP Servers (25 min)
Set up three MCP servers:
1. **GitHub Server** - Access repository issues
2. **SQLite Server** - Store and query analysis results
3. **Slack Server** - Post notifications (or console mock)

### Part 2: Build Integration Workflow (30 min)
Create `issue-analyzer.ts` that:
- Fetches open issues from GitHub repo
- Analyzes issue patterns (labels, age, priority)
- Stores results in SQLite database
- Posts summary to Slack channel

### Part 3: Add Error Handling (15 min)
Implement:
- Retry logic for API failures
- Fallback to local storage if SQLite unavailable
- Graceful degradation when Slack fails

## 🚀 Success Criteria

### Functional Requirements
✅ Successfully configures 3 MCP servers  
✅ Fetches GitHub issues data  
✅ Analyzes and categorizes issues  
✅ Persists results to database  
✅ Posts formatted summary to Slack  
✅ Handles errors gracefully  

### Integration Quality
✅ Uses environment variables for secrets  
✅ Implements retry logic with backoff  
✅ Includes comprehensive error handling  
✅ Logs all operations for debugging  

## 📁 Starter Files

See `starter/` directory for:
- `mcp-config/` - Starter MCP configuration files
- `workflow/` - Partial workflow implementation
- `mock-server/` - Mock MCP servers for testing
- `database/` - SQLite schema and sample data

## 🔧 Implementation Tips

### MCP Configuration Pattern
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

### Error Handling Pattern
```typescript
async function resilientMcpCall(server: string, tool: string, params: any) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await mcp[server].callTool(tool, params);
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

### Multi-Server Workflow
```typescript
// 1. Fetch from GitHub
const issues = await mcp.github.callTool("search_issues", params);

// 2. Analyze and store
await mcp.sqlite.callTool("execute", { 
  sql: "INSERT INTO analysis (...) VALUES (...)" 
});

// 3. Notify
await mcp.slack.callTool("post_message", { 
  channel: "#updates", 
  text: summary 
});
```

## 🎓 Learning Outcomes

After completing this exercise, you'll understand:
- MCP server configuration patterns
- Multi-server workflow orchestration
- Error handling in distributed systems
- Environment-based credential management
- Cross-system data integration

## 🆘 Common Pitfalls

1. **Exposed credentials** - Always use environment variables
2. **No error handling** - MCP servers can fail, plan for it
3. **Rate limiting** - Add delays between API calls
4. **No validation** - Validate all inputs before processing
5. **Silent failures** - Always log and report errors

## ✅ Checklist

- [ ] Configured GitHub MCP server
- [ ] Configured SQLite MCP server
- [ ] Configured Slack MCP server (or mock)
- [ ] Created issue-analyzer.ts workflow
- [ ] Implemented GitHub issue fetching
- [ ] Added issue analysis and categorization
- [ ] Created SQLite schema for results
- [ ] Implemented database storage
- [ ] Added Slack notification
- [ ] Implemented retry logic (3 attempts)
- [ ] Added error handling for each server
- [ ] Created fallback mechanisms
- [ ] Added operation logging
- [ ] Tested with mock servers
- [ ] All operations complete successfully

## 📝 Submission

Submit:
1. Your MCP configuration files
2. issue-analyzer.ts implementation
3. SQLite schema definition
4. Test results showing successful integration
5. Brief writeup of error handling strategy

Good luck! 🚀
