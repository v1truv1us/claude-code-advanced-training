# Claude Code Quick Reference

## 🎯 Essential Commands

### Core Commands
| Command | Description | Example |
|-------------|----------|---------|
| **Create skill** | `skill-create your-skill-name` | Creates skill directory and SKILL.md |
| **List skills** | `/skills` or `/agents` | Shows all available skills/subagents |
| **Invoke skill** | `/your-skill-name` | Manually trigger a skill |
| **Edit skill** | `/edit your-skill-name` | Opens skill in editor for modification |

## 🔍 Context Management Commands
| Command | Description | When to Use |
|-------------|-----------|----------|
| **Clear context** | `/clear` | Between unrelated tasks or when context is bloated |
| **Compact** | `/compact Focus on X` | When you want to preserve some context but clean up rest |
| **Memory check** | `/memory` | Review loaded memories and sessions |
| **Resume session** | `/resume` | Continue previous conversation |
| **Session management** | `/rename` | Give current session descriptive name |

## 📊 Status Line Configuration
```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```
Customize status line to show git branch, context usage, or deployment status.

## 🧪 Linting & Testing Commands
| Command | Description | Example |
|-------------|-----------|---------|
| **Run tests** | `pnpm test` | Execute test suite |
| **Type check** | `pnpm type-check` | Verify TypeScript types |
| **Lint code** | `pnpm lint` | Check code style |
| **Build** | `pnpm build` | Build for production |
| **Run e2e tests** | `pnpm test:e2e` | End-to-end testing |
| **Coverage** | `pnpm test:coverage` | Ensure 80%+ coverage |

## 🎯 CLI Reference

### File Navigation
| Command | Description | Example |
|-------------|-----------|---------|
| **Go to file** | `cd src/utils` | Navigate to directory |
| **Reference file** | `@src/utils/auth.js` | Include file in conversation |
| **List directory** | `ls src/components/` | See directory contents |
| **Create file** | `touch src/new-component.tsx` | Create new file |

### Pattern Matching
| Pattern | Command | Example |
|-----------|-----------|---------|
| **File with extension** | `@app.config.js` | Reference file with extension |
| **File in directory** | `@src/` | Reference directory |
| **Recursive search** | `grep -r "pattern" src/` | Search for pattern in files |

## 🧩 Subagent Commands
| Command | Description | Example |
|-------------|-----------|---------|
| **Use subagent** | `Use security-reviewer` | Delegate to security-focused agent |
| **Create subagent** | `/agents` → "Create New subagent" |
| **List subagents** | `/agents` | See available specialized agents |

## 🔗 MCP Commands
| Command | Description | Example |
|-------------|-----------|---------|
| **List MCP servers** | `/mcp` | Shows connected MCP servers |
| **Add MCP server** | `mcp add github` | Connect GitHub integration |
| **Use MCP resource** | `github:owner/repo/issues` | Access GitHub data |
| **Check MCP status** | `/mcp` | Verify connection status |

## 🎛 Environment Variables
| Variable | Description | Example | When to Use |
|-------------|-----------|---------|
| **Set variable** | `MY_API_KEY` | `export MY_API_KEY=value` |
| **Check variable** | `echo $MY_API_KEY` | `echo $MY_API_KEY` |
| **Path variable** | `$PROJECT_ROOT` | `cd $PROJECT_ROOT` |

## 🚀 Batch Processing
| Command | Description | Example |
|-------------|-----------|---------|
| **Pipe output** | `command | grep pattern *.js | jq '.'` | Process file line by line |
| **Parallel execution** | `for dir in */; do claude -p "task $dir" &` | Run Claude on multiple directories |

---

## 📋 Common Workflows

### Testing Workflow
1. **Test locally**: `pnpm test` → `pnpm build` → `git push`
2. **Deploy to staging**: Deploy → Verify → Deploy to production
3. **Code review**: Request review → Address feedback → Merge → Deploy

### Development Cycle
1. **Feature development**: Plan Mode → Implement → Test → Refactor → Commit
2. **Bug fixing**: Reproduce → Identify → Fix → Verify → Commit

## 💡 Pro Tips

### Context Optimization
- **Avoid large files in chat**: Use subagents for codebase analysis
- **Use compact strategically**: Before major changes or when context gets noisy
- **Clear between task types**: Different topics should use different sessions
- **Monitor usage**: Keep an eye on token consumption and context bar

### Error Prevention
- **Test before commit**: Never push code that fails tests
- **Use type checking**: Prevent runtime type errors
- **Gradual changes**: Make small, testable changes
- **Handle edge cases**: Think about nulls, empty states, malformed inputs

### Team Collaboration
- **Consistent CLAUDE.md**: Team shares coding standards
- **Git hygiene**: Clear commit messages, proper branching
- **Code reviews**: Required for all changes
- **Documentation**: Keep READMEs updated with new features

---

**Remember**: Good commands and organization prevent mistakes, poor code quality, and wasted debugging time! 🎯