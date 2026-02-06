# Module 06: Building Custom Skills

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 06: Building Custom Skills**  
*Advanced Skill Authoring: Reference vs Task Skills, Safety, and Distribution*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Design skills that are **small, composable, and maintainable**
- Use `disable-model-invocation` + `user-invocable` to control invocation
- Use `allowed-tools` to enforce least privilege
- Use `context: fork` + subagent settings for isolation
- Structure skills with supporting files (templates/examples/scripts)
- Plan a team distribution strategy (project vs personal vs plugin)

### Slide 3: Advanced Architecture (Doc-accurate Patterns)

**Reference skill (inline guidance)**
```yaml
---
name: react-patterns
description: React best practices and common patterns for this codebase
---

# React patterns
- Prefer functional components + hooks
- Keep side effects in useEffect
- Extract custom hooks for reusable logic
```

**Task skill (manual workflow; isolated execution)**
```yaml
---
name: production-deploy
description: Production deployment checklist and command sequence
context: fork
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [service] [version]
---

Deploy $ARGUMENTS:
1. Verify CI is green
2. Run migrations (if any)
3. Deploy
4. Validate health checks
5. Roll back if thresholds exceeded
```

### Slide 4: Supporting Files (Keep SKILL.md Focused)

Skills can include additional files in the same directory:

```
production-deploy/
├── SKILL.md
├── checklist.md
├── examples/
│   └── successful-run.md
└── scripts/
    └── verify.sh
```

Reference them from `SKILL.md` so Claude knows when to load them.

### Slide 5: Invocation Control (Prevent Accidental Side Effects)

Two key fields:
- `disable-model-invocation: true` → only humans can invoke
- `user-invocable: false` → only Claude can invoke (background context)

Use `disable-model-invocation` for anything that could deploy, commit, delete, or otherwise cause side effects.

### Slide 6: Tool Security (Least Privilege)

Use `allowed-tools` to limit tool access while the skill is active:
```yaml
---
name: safe-reader
description: Read-only investigation helper
allowed-tools: Read, Grep, Glob
---
```

### Slide 7: Isolation with Subagents

Setting `context: fork` runs the skill in a forked subagent context.

If you want **preloaded skills** for the subagent, configure that in the subagent (subagents support a `skills:` field).

### Slide 8: Team Distribution Strategies (Doc-accurate Locations)

- Project skills: `.claude/skills/<skill-name>/SKILL.md`
- Personal skills: `~/.claude/skills/<skill-name>/SKILL.md`
- Plugin skills: `<plugin>/skills/<skill-name>/SKILL.md` (namespaced)
- Enterprise skills: managed settings

Also note: `.claude/commands/` is supported as a legacy location; skills take precedence on name conflict.

### Slide 9: Debugging & Troubleshooting (Don’t Invent CLIs)

Prefer doc-backed debugging steps:
- Confirm path + folder structure exists (`<skill-name>/SKILL.md`)
- Confirm YAML frontmatter is valid YAML
- Confirm the skill is in one of the documented locations
- Use `/` autocomplete menu to confirm the command is discovered

Avoid teaching undocumented commands like `claude /skill validate` unless you can cite an official reference.

### Slide 10: Performance Tips (What Actually Works)

- Keep `SKILL.md` short; move large reference docs to supporting files
- Use `allowed-tools` to constrain tool use and reduce unnecessary context churn
- Prefer targeted searches (Grep/Glob) over reading large files

### Slide 11: Exercise Preview

**Exercise 06-1: Advanced Reference Skill**
- Capture principles, anti-patterns, examples, troubleshooting
- Use supporting files for long docs

**Exercise 06-2: Workflow (Task) Skill**
- Set `disable-model-invocation: true`
- Add `argument-hint` and use `$ARGUMENTS`
- Limit tool access with `allowed-tools`

**Exercise 06-3: Team Distribution**
- Decide project vs personal vs plugin
- Document update process and ownership

---

## 📚 Additional Resources (Official Docs)
- Skills: https://code.claude.com/docs/en/skills
- Frontmatter: https://code.claude.com/docs/en/skills#frontmatter
- Subagents: https://code.claude.com/docs/en/sub-agents
- Hooks (for skills/agents lifecycle): https://code.claude.com/docs/en/hooks
- Plugins (distribution): https://code.claude.com/docs/en/plugins
