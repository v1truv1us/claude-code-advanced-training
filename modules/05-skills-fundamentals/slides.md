# Module 05: Skills Fundamentals

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 05: Skills Fundamentals**  
*Understanding, Creating, and Managing Claude Code Skills*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Understand the difference between skills and CLAUDE.md
- Master skill structure and YAML frontmatter
- Create knowledge skills for domain expertise
- Build workflow skills for repeatable processes
- Deploy and manage skills across teams
- Use skills in subagents and advanced workflows

### Slide 3: Skills vs CLAUDE.md

**When to Use Each**
```markdown
# CLAUDE.md - Always loaded context
- Use for: Team conventions, project-specific rules
- Examples: Coding standards, build commands, git workflow

# Skills - On-demand knowledge and workflows
- Use for: Reference material, domain expertise, automation
- Examples: API documentation, design patterns, troubleshooting guides
```

**Key Differences**
| Aspect | CLAUDE.md | Skills |
|--------|-------------|-----------|
| **Loading** | Every session | When relevant or invoked |
| **Scope** | Project/team-wide | User/personal |
| **Triggers** | Always available | Manual slash commands |
| **Content** | Instructions | Knowledge + workflows |

### Slide 4: Skill Structure Deep Dive

**Required Skill Structure**
```yaml
---
name: your-skill-name
description: What this skill does and when to use it
# Optional configuration fields
disable-model-invocation: true     # Hide from Claude unless invoked
context: fork               # Run in isolated context
skills: []                  # Preload other skills
model: sonnet                # Model to use
tools: []                   # Available tools (Read, Write, Bash, etc.)
---

# Skill content (markdown follows)
Your instructions and knowledge go here...
```

**Key Frontmatter Fields Explained**
- `name`: Becomes `/your-skill-name` command
- `description`: Helps Claude decide when to use the skill
- `disable-model-invocation`: Prevents automatic loading
- `context: fork`: Creates isolated context for clean execution
- `skills`: Preloads additional skills for complex workflows

### Slide 5: Knowledge Skills

**Domain Expertise in a Box**
```markdown
# API Design Patterns
- Use RESTful conventions (/api/v1/users)
- Implement proper error responses
- Follow rate limiting best practices
- Include OpenAPI specifications

# Security Best Practices
- Never log sensitive data
- Validate all inputs
- Use parameterized queries
```

**Example: API Knowledge Skill**
```yaml
---
name: api-standards
description: Teach Claude our API design patterns and conventions

## Authentication workflow for password reset:
1. Send email with reset link
2. User clicks link
3. Verify new password
4. Log security event
```

### Slide 6: Workflow Skills

**Multi-Step Automation**
```markdown
# Deploy to Staging
- Run database migrations
- Execute deployment scripts
- Run smoke tests
- Monitor for errors

# Notify Team
- Post deployment status to Slack
- Create GitHub release
```

**Benefits:**
- Reduces human error
- Ensures consistent process
- Provides audit trail
- Faster deployment cycles

### Slide 7: Advanced Skill Features

**Dynamic Skills with Arguments**
```yaml
---
name: create-user
description: Create a new user account
argument-hint: User email address
---

When invoked:
```bash
/create-user user@example.com
```

**Skill Implementation:**
```yaml
---
name: create-user
description: Create a new user account
argument-hint: User email address

# Check if user exists
if [ -f "users/$ARGUMENTS[0].json" ]; then
  echo "User already exists"
  exit 1
fi

# Create user
echo "Creating user: $ARGUMENTS[0]"
# Implementation here
```

### Slide 8: Skills in Subagents

**Specialized Subagents**
```yaml
---
name: code-reviewer
description: Specialized subagent for security-focused code reviews
context: fork
skills:
  - api-standards
  - security-checklist
model: opus
tools: [Read, Grep, Bash]
---
```

**Benefits:**
- Isolated context prevents bias
- Specialized model for complex analysis
- Preloaded domain knowledge

### Slide 9: Skills Management

**Distribution Patterns**
- **Project Skills**: Share via git repository
- **Team Skills**: Use `.claude/skills/` directory
- **Personal Skills**: Use `~/.claude/skills/` directory
- **Plugins**: Bundle skills for distribution

### Slide 10: Live Demo: Skill Creation

**Live Skill Creation**
```bash
# Ask Claude to create a skill
"You are a senior React developer. Create a skill that teaches best practices for React component development."

# Expected Claude Response
Claude should:
1. Create the skill directory structure
2. Write comprehensive SKILL.md with frontmatter
3. Include React-specific patterns and examples
4. Add testing guidance for components
5. Include performance optimization tips

---

## 🎬 Video Script

### [0:00-1:30] Introduction
"Welcome to Module 05: Skills Fundamentals. This is where Claude Code transitions from following your instructions to empowering you with reusable knowledge and workflows.

Skills are the bridge between what Claude knows generally and what your team needs specifically. While CLAUDE.md provides the foundation, skills give you targeted expertise, automation, and complex workflows that can be invoked with a simple command."

### [1:30-3:30] Understanding Skills vs CLAUDE.md
"The fundamental difference is loading strategy. CLAUDE.md is like the operating system instructions that Claude always follows - like 'always use 2-space indentation' or 'run tests before committing'.

Skills are like plugins - they're loaded on-demand and contain specific knowledge. Think of it this way: CLAUDE.md is your team's playbook, while skills are your specialized tools that Claude can pick up when needed.

This separation gives you the best of both worlds: consistent behavior from CLAUDE.md plus powerful, targeted expertise from skills when you need them."

### [3:30-5:00] Skill Structure and YAML Frontmatter
"Every skill starts with YAML frontmatter - that's the metadata that tells Claude how to handle the skill. Let me break down the key fields:

The `name` field becomes the slash command - `/skill-name`. The `description` helps Claude decide when to invoke it. But there are other powerful options:

`disable-model-invocation` is crucial for skills that you want to control manually. Without it, Claude might load your skill automatically when it detects relevance, consuming context even when you don't want it to run.

The `context: fork` field creates an isolated environment - perfect for testing, security analysis, or any work where you don't want the main conversation affected.

The `skills` field lets you preload other skills - creating skill combinations. And `tools` controls exactly what the skill can access."

### [5:30-7:00] Creating Your First Knowledge Skill

"Let's create a simple knowledge skill together. Imagine your team frequently asks about React best practices. You could answer this every time, or create a skill that Claude can reference automatically.

Here's what a basic React best practices skill might look like:

```yaml
---
name: react-best-practices
description: React component development best practices and patterns
---

# React Component Patterns
- Use functional components with hooks
- Prefer hooks over classes for side effects
- Implement proper prop typing with TypeScript
- Use custom hooks for component lifecycle
- Follow the rules of hooks

# Styling and CSS
- Use CSS-in-JS for styling
- Implement responsive design with media queries
- Use CSS custom properties for theming
- Follow mobile-first approach with progressive enhancement

# State Management
- Use useState for local component state
- Use useReducer for complex state
- Implement proper prop drilling
- Avoid direct state mutations
- Use useCallback for memoization

# Performance
- Implement React.memo for expensive components
- Use code splitting for large applications
- Optimize re-renders with proper keys
- Implement virtual scrolling for long lists
- Use lazy loading for components below the fold
```

When you save this as `react-best-practices` in `.claude/skills/`, Claude can automatically reference it whenever you're working with React components, providing consistent guidance."

### [7:30-9:00] Workflow Skills in Action

"Workflow skills transform complex multi-step processes into repeatable commands. Instead of explaining the same 10 steps every time, you create a skill that does it once with a single invocation.

Let me show you a deployment workflow skill:

```yaml
---
name: deploy-staging
description: Deploy current application to staging environment
argument-hint: Branch name to deploy
---

## Deployment Process
1. Build application for staging
2. Run database migrations
3. Deploy to staging servers
4. Run smoke tests
5. Notify team of deployment
```

This skill automates a complex process that would normally require multiple Claude interactions. With one command, your entire team can deploy to staging consistently."

### [9:00-11:00] Advanced Skills and Subagents

"The most powerful pattern combines skills with subagents. Imagine you need to perform a comprehensive security audit of your codebase. You could create a `security-audit` skill that analyzes every file for vulnerabilities, then a `code-reviewer` subagent that reviews the findings.

Here's how it works:"

1. **Security Audit Skill**: Runs in main context, reads all files, identifies issues
2. **Code Reviewer Subagent**: Takes the audit results and provides specific recommendations
3. **Synthesis**: Main conversation receives both reports and creates comprehensive security plan

This is enterprise-grade automation that would normally require multiple engineers hours of work."

### [11:00-12:00] Conclusion and Best Practices

"Master skills, and you'll transform how Claude Code works with your team. Skills become your team's collective knowledge base, workflows become repeatable processes, and complex tasks become one-command operations.

The key insight is this: skills and subagents work together beautifully. A skill can create a subagent, preload it with domain knowledge, and send it off to solve problems independently. Multiple subagents can work in parallel, then return synthesized results."

---

## 📝 Exercise Details

### Exercise 05-1: Create Knowledge Skill
**Objective**: Build a knowledge skill for your domain

**Task**: Create a skill that teaches Claude about your tech stack's best practices

**Requirements**:
- Choose a domain you're familiar with (React, Node.js, Python, etc.)
- Include 5-10 key best practices or patterns
- Structure the knowledge clearly with sections
- Include code examples where helpful
- Add edge cases and common mistakes to avoid
- Make it scannable with grep patterns

### Exercise 05-2: Create Workflow Skill
**Objective**: Automate a multi-step process with a single command

**Task**: Create a skill that automates your team's deployment process

**Requirements**:
- Identify a 5+ step workflow in your organization
- Create a skill that executes each step sequentially
- Include error handling and rollback procedures
- Add validation at each step
- Provide clear success/failure feedback

### Exercise 05-3: Skills with Arguments
**Objective**: Create a skill that accepts dynamic input

**Task**: Build a skill that generates code or configuration based on user input

**Requirements**:
- Use `$ARGUMENTS` placeholder for dynamic content
- Include input validation with clear error messages
- Provide different modes or options based on arguments
- Demonstrate argument handling with examples

---

## 📚 Additional Resources

### Documentation Links
- [Skills Reference](https://code.claude.com/docs/en/skills)
- [Subagents Guide](https://code.claude.com/docs/en/sub-agents)
- [Frontmatter Reference](https://code.claude.com/docs/en/skills#frontmatter)

### Skill Templates
```yaml
---
name: knowledge-skill-template
description: Template for creating domain knowledge skills
---

name: your-domain-knowledge
description: Replace with your actual domain

# Your Domain Knowledge
[Section 1: Core Concepts]
- Fundamental principles and terminology
- Key relationships and dependencies
- Common patterns and conventions

[Section 2: Best Practices]
- Coding standards and style guidelines
- Performance considerations
- Security requirements
- Testing strategies

[Section 3: Common Issues]
- Frequent problems and solutions
- Error handling patterns
- Troubleshooting guides

## Workflow Skill Template
```yaml
---
name: workflow-automation
description: Template for creating repeatable process skills
---

## Argument: $ARGUMENTS
Description of what this workflow automates.

## Step 1: [Process Name]
Detailed instructions for first step.

## Step 2: [Process Name]
Detailed instructions for second step.

Continue with as many steps as needed...
```

---

## ✅ Completion Checklist

### For All Exercises
- [ ] Skill created with proper YAML frontmatter
- [ ] Markdown content is well-structured and actionable
- [ ] Skills can be invoked successfully
- [ ] Arguments are handled correctly
- [ ] Error messages are clear and helpful

### For Module 05
- [ ] Understand skills vs CLAUDE.md differences
- [ ] Can create effective knowledge skills
- [ ] Mastered skill structure and YAML frontmatter
- [ ] Created workflow skills with proper automation
- [ ] Understand advanced skill features and combinations

**Ready for Module 06?** You now have the foundation to create complex, multi-step skills and integrate them with subagents for powerful automation workflows.