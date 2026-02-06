# Skills Quick Reference (Doc-aligned)

## 🎯 Core Operations

Skills are **custom slash commands** defined by directories containing a `SKILL.md`.

Common operations:
- **Create a skill**: create a directory + `SKILL.md` in one of the documented locations.
- **Invoke a skill**: run it as a slash command in interactive mode (e.g. `/<name> ...`).
- **Discover commands**: use `/` autocomplete / command menu.

## 📍 Where skills live

Where you store a skill determines scope:
- **Personal**: `~/.claude/skills/<skill-name>/SKILL.md`
- **Project**: `.claude/skills/<skill-name>/SKILL.md`
- **Plugin**: `<plugin>/skills/<skill-name>/SKILL.md` (namespaced)
- **Enterprise**: managed settings

Legacy: `.claude/commands/` works similarly, but skills take precedence if names conflict.

## 🧩 Skill Types

### Reference (Knowledge) Skills
- Conventions, patterns, style guides, troubleshooting guides
- Designed to be applied inline

### Task (Workflow) Skills
- Step-by-step processes (deploy/release/triage)
- Usually set `disable-model-invocation: true` to avoid accidental side effects

## 📋 Skill Structure Template

```yaml
---
name: your-skill-name
description: What this skill does and when to use it
# Optional:
# argument-hint: [arg1] [arg2]
# disable-model-invocation: true
# user-invocable: false
# allowed-tools: Read, Grep, Glob, Bash
# context: fork
# agent: Explore
---

# Skill Content

## Overview
...
```

### Resource Requirements

**Recommended**: `description` (helps Claude decide relevance)

### Tool configuration (important)
Use `allowed-tools` to limit which tools Claude can use while the skill is active.

---

## 📚 Official docs
- Skills: https://code.claude.com/docs/en/skills
- Frontmatter reference: https://code.claude.com/docs/en/skills#frontmatter
