# Module 05: Skills Fundamentals

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 05: Skills Fundamentals**  
*Understanding, Creating, and Managing Claude Code Skills (Custom Slash Commands)*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Understand the difference between **project instructions (CLAUDE.md)** and **skills**
- Understand that **skills are invoked as slash commands** (`/skill-name`)
- Create skills with correct **directory layout** and **YAML frontmatter**
- Build two common skill types: **reference (knowledge)** and **task (workflow)**
- Control who can invoke a skill (you vs Claude) and what tools it may use
- Organize skills for personal vs project vs plugin distribution

### Slide 3: Skills vs CLAUDE.md

**When to Use Each**
```markdown
# CLAUDE.md - Always-loaded project instructions
- Use for: Team conventions, project-specific rules
- Examples: Coding standards, build commands, git workflow

# Skills - On-demand knowledge and workflows
- Use for: Reference material and repeatable tasks you invoke as /commands
- Examples: API conventions, troubleshooting guides, deploy checklists
```

**Key Differences**
| Aspect | CLAUDE.md | Skills |
|--------|----------|--------|
| **Loading** | Every session | Loaded when invoked; descriptions help discovery |
| **Scope** | Project/team-wide | Personal, project, enterprise, plugin |
| **How you run it** | Always applied | Invoked as a **slash command** (`/name ...`) |
| **Typical content** | Rules & conventions | Reference content and/or task workflows |

### Slide 4: Skill Structure (What Claude Code Actually Loads)

**Directory Layout (required entrypoint is `SKILL.md`)**
```
<skill-name>/
├── SKILL.md     # required
├── reference.md # optional supporting docs
├── examples/    # optional example outputs
└── scripts/     # optional scripts Claude can run (if permitted)
```

**Minimal Valid Frontmatter**
```yaml
---
name: my-skill
description: What this skill does and when to use it
---

# Instructions / content
```

**Frontmatter fields you’ll use most often** (see docs):
- `name` (optional): defaults to directory name; lowercase letters/numbers/hyphens
- `description` (recommended): how Claude decides relevance
- `argument-hint` (optional): autocomplete hint for expected args
- `disable-model-invocation` (optional): set `true` for workflows you only want humans to trigger
- `user-invocable` (optional): set `false` for background context Claude can use, but users shouldn’t run directly
- `allowed-tools` (optional): tool allowlist while the skill is active
- `context: fork` (optional): run in an isolated subagent context
- `agent` (optional): subagent type when `context: fork`

### Slide 5: Where Skills Live (Scope & Precedence)

Where you store a skill determines who can use it (higher priority wins on name conflicts):

- **Personal**: `~/.claude/skills/<skill-name>/SKILL.md`
- **Project**: `.claude/skills/<skill-name>/SKILL.md`
- **Plugin**: `<plugin>/skills/<skill-name>/SKILL.md` (namespaced as `plugin-name:skill-name`)
- **Enterprise**: via managed settings

**Note on legacy commands**: `.claude/commands/` still works, but if a skill and a command share a name, the skill wins.

### Slide 6: Knowledge (Reference) Skills

**Reference content** is meant to be applied inline alongside your current work.

Example:
```yaml
---
name: api-conventions
description: API design patterns for this codebase
---

# API conventions

When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Validate request input at boundaries
```

### Slide 7: Workflow (Task) Skills

**Task content** is step-by-step instructions for actions with side effects (deploy, commit, release, etc.).

Use **manual invocation only**:
```yaml
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---

Deploy $ARGUMENTS to production:

1. Run the test suite
2. Build the application
3. Push to the deployment target
4. Verify the deployment succeeded
```

### Slide 8: Skills and Subagents (Correct Composition Pattern)

Skills can run in a forked subagent context (`context: fork`) and can restrict tools via `allowed-tools`.

If you need **preloaded domain knowledge**, do that in **subagent config** (subagents have a `skills:` field). Skills themselves do not declare `skills:` dependencies in frontmatter.

### Slide 9: Skills Management & Team Sharing

**Distribution patterns**
- **Project skills**: commit `.claude/skills/` to your repo
- **Personal skills**: keep under `~/.claude/skills/`
- **Plugins**: bundle for re-use across multiple repos
- **Enterprise**: managed settings for org-wide skills

### Slide 10: Live Demo: Skill Creation (Doc-accurate)

Create a new directory and `SKILL.md`:
```bash
mkdir -p .claude/skills/react-best-practices
$EDITOR .claude/skills/react-best-practices/SKILL.md
```

Then invoke it in Claude Code interactive mode:
```text
/react-best-practices
```

---

## 📝 Exercise Details

### Exercise 05-1: Create a Knowledge Skill
**Objective**: Build a reference skill for your domain.

**Requirements**:
- Clear sections (principles, best practices, pitfalls)
- Concrete examples
- Keep it scannable

### Exercise 05-2: Create a Workflow Skill
**Objective**: Capture a 5+ step workflow as a task skill.

**Requirements**:
- Set `disable-model-invocation: true`
- Specify `allowed-tools` if the workflow uses tools
- Include validation/rollback steps (as instructions)

### Exercise 05-3: Skills with Arguments
**Objective**: Use `$ARGUMENTS`, `$ARGUMENTS[N]`, or `$N`.

**Requirements**:
- Document expected args with `argument-hint`
- Include examples:
  - `/my-skill foo`
  - `/my-skill foo bar`

---

## 📚 Additional Resources (Official Docs)
- Skills / custom slash commands: https://code.claude.com/docs/en/skills
- Frontmatter reference (skills): https://code.claude.com/docs/en/skills#frontmatter
- Subagents: https://code.claude.com/docs/en/sub-agents
