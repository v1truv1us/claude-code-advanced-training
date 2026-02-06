# Skills Quick Reference

## 🎯 Core Operations (doc-backed)

Skills/slash commands are defined by **files/folders in your repo or user config**, not by a special `skill-create` CLI.

Common operations:
- **Create a skill**: add a new skill directory + `SKILL.md` in the location Claude Code docs specify for slash commands.
- **Invoke a skill**: run it as a **slash command** in interactive mode (e.g. `/<name> ...`).
- **Discover commands**: use Claude Code’s interactive help / command discovery UI (varies by version).

If you’re teaching teams, the safe guideline is: **only document commands/paths that are explicitly in the official docs**, and link to those pages from your training.

## 🧩 Skill Types

### Knowledge Skills
- **Domain knowledge** - API patterns, coding standards, architecture
- **Technology guides** - Framework-specific best practices
- **Troubleshooting** - Common issues and solutions
- **Reference material** - Documentation, external links

### Workflow Skills
- **Multi-step processes** - Deploy, build, test, release workflows
- **Automation scripts** - Repetitive task execution
- **Data processing** - ETL, validation, transformation
- **Integration tasks** - API calls, system updates

### Subagent Skills
- **Specialized analysis** - Security review, performance optimization
- **Research tasks** - Codebase investigation, documentation
- **Custom tools** - Project-specific utilities

## 📋 Skill Structure Template

```yaml
---
name: your-skill-name
description: Brief description of what this skill does and when to use it
context: [optional]
skills: []
disable-model-invocation: false
tools: [Read, Write, Bash, Grep, Glob]
---

# Skill Content

## Overview
[Brief description of your domain or purpose]

## Key Concepts
[Key concepts and terminology for your domain]

## Best Practices
[Specific coding standards and patterns for your technology stack]

## Code Examples
[Code snippets demonstrating the concepts and patterns]

## Resources
[Links to documentation, tools, or external references]
```

### Resource Requirements

**Required**: Name, description
**Optional**: Context, skills, tools, disable-model-invocation

### Optional YAML Fields
| Field | Description | When to Use |
|-------|-----------|----------|
| `context` | Additional context loaded automatically |
| `skills` | Skills to preload when this skill runs |
| `disable-model-invocation` | Prevents automatic loading |
| `tools` | Limit available tools |
| `agent` | Subagent type (Explore, Plan, General-purpose) |
| `model` | Model to use for subagent |

---

## 📝 Quick Reference Examples

### Simple Knowledge Skill
```yaml
---
name: eslint-rules
description: Teach Claude our ESLint configuration and rules
---

# ESLint Rules

## Code Style
- Use 2-space indentation
- Prefer const over let for constants
- Use single quotes for strings

## Error Handling
- Always handle try/catch for async operations
- Provide specific error messages
- Log errors with context

## Testing
- Mock fetch requests in tests
- Use assertive testing patterns
```

### Simple Workflow Skill
```yaml
---
name: deploy-app
description: Deploy our React application
argument-hint: Target environment (staging|production)
---

# Deployment Process

1. Build application
2. Run tests to verify build
3. Deploy to specified environment
4. Run smoke tests

## Usage
```bash
/deploy-app staging
/deploy-app production
```

---

## 📚 Cheat Sheet: Essential Skills

### YAML Frontmatter Fields
```yaml
name: api-designer
description: API design patterns and validation strategies
---

# API Design Patterns

## REST Conventions
- GET for data retrieval
- POST for creation
- PUT for updates
- DELETE for removal
- Status codes: 200 (success), 400 (client error), 500 (server error)

## Validation
- Input validation on all endpoints
- Response format consistency
- Error responses with proper HTTP status and messages

## Security
- Never log sensitive data
- Validate all inputs before processing
- Use parameterized queries to prevent injection
```

---

## 🛠 Best Practices

### For All Skills
- Keep descriptions clear and concise
- Use descriptive names
- Include examples in skills
- Add proper frontmatter structure
- Test skills thoroughly before using
- Document error handling and edge cases
- Consider performance impact
- Review and update skills regularly

---

**Ready for Module 06?** Create workflow automation skills that handle complex, multi-step processes efficiently.