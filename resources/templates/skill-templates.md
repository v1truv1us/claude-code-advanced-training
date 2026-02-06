# Skill Templates (Doc-aligned)

## 🎯 Basic Reference (Knowledge) Skill Template

```yaml
---
name: your-skill-name
description: Brief description of what this skill provides
---

# Knowledge Content

## Overview

## Best Practices

## Common Issues

## Code Examples
```javascript
// Example implementation
function exampleFunction() {
  return 'result';
}
```

## Usage
```text
/your-skill-name
```
```

---

## 📋 Task (Workflow) Skill Template

```yaml
---
name: workflow-automation
description: Repeatable process (manual invocation recommended)
argument-hint: [env] [optional-flags]
disable-model-invocation: true
# Restrict tool access as needed:
# allowed-tools: Read, Grep, Glob, Bash
context: fork
---

## Process Overview

## Steps
1. ...
2. ...

## Validation
- ...

## Rollback
- ...

## Usage
```text
/workflow-automation staging
```
```

---

## 🎯 Subagent Template (FYI: subagents are separate from skills)

Subagents are defined under `.claude/agents/` or `~/.claude/agents/` and support `skills:` to preload skill content.

Official docs: https://code.claude.com/docs/en/sub-agents
