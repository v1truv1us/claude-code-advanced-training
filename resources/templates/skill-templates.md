# Skill Templates

## 🎯 Basic Knowledge Skill Template

```yaml
---
name: your-skill-name
description: Brief description of what this skill provides
---

# Knowledge Content

## Overview
[Section 1: Core Concepts]
- Fundamental principles and terminology
- Key relationships and dependencies
- Common patterns and conventions

## Section 2: Best Practices
- Coding standards and style guidelines
- Performance considerations
- Security requirements
- Testing strategies

## Section 3: Common Issues
- Frequent problems and solutions
- Error handling patterns
- Troubleshooting guides

## Code Examples
```javascript
// Example implementation
function exampleFunction() {
  // Implementation following best practices
  return result;
}
```

## Usage Examples
```bash
# Invoke the skill
/your-skill-name
```

---

## 📋 Workflow Skill Template

```yaml
---
name: workflow-automation
description: Template for creating repeatable process skills
argument-hint: Brief description of what this workflow automates
---

## Process Overview

## Step 1: [Process Name]
Detailed instructions for first step.

## Step 2: [Process Name]
Detailed instructions for second step.

Continue with as many steps as needed...

## Error Handling
- What to do if step [N] fails
- Rollback procedures for failed steps
- Success criteria for each step

## Validation
- How to verify successful completion
- Tests to run before proceeding to next step

---

## 🎯 Subagent Template

```yaml
---
name: your-subagent-name
description: Brief description of what this subagent does
---
# Optional configuration
context: fork               # Run in isolated context
skills: []                  # Preload other skills
model: sonnet                # Model to use
tools: []                   # Available tools
---

# Instructions
You are a specialized AI assistant focused on [subagent purpose].

## Guidelines
- Focus on your specific domain
- Provide clear, step-by-step analysis
- Use the available tools effectively
- Return concise, actionable results
- Ask clarifying questions when needed

## Example Usage
```bash
# Ask Claude to use subagent
"Use the code-reviewer subagent to analyze src/auth/ for security issues"
```

---

## 📚 Plugin-Style Skill Template

```yaml
---
name: plugin-namespace:skill-name
description: Plugin-style skill with namespacing
---

# Plugin Structure
```yaml
---
name: plugin-namespace
description: Plugin with multiple skills
namespace: your-plugin-name
version: 1.0.0
skills:
  - skill-one: skills/skill-one.md
  - skill-two: skills/skill-two.md
```

---

## 🎚 Skill Categories Quick Reference

| Type | Use Case | Template Name | Example |
|------|-----------|--------------|-----------|
| **Knowledge** | Domain expertise, reference material | `domain-knowledge.md` | `api-standards.md` |
| **Workflow** | Multi-step processes, automation | `deploy-staging.md` | `ci-cd-pipeline.md` |
| **Analysis** | Code review, security audit | `security-audit.md` | `performance-analysis.md` |
| **Testing** | Test generation, execution | `test-runner.md` |
| **Generation** | Code creation, scaffolding | `component-generator.md` |

---

## 📝 YAML Best Practices

### Required Fields
- `name` (required): Skill name, becomes slash command
- `description` (recommended): Clear, concise description
- `disable-model-invocation` (optional): Prevent automatic loading for controlled skills

### Optional Fields
- `context: fork`: Isolated execution environment
- `skills`: Preload complementary skills
- `model`: Choose optimal model for task complexity
- `tools`: Restrict available tools for security/efficiency

### Naming Conventions
- Use kebab-case for skill names
- Be descriptive but concise
- Avoid generic names like `helper` or `utility`
- Include domain in name for context (e.g., `react-hooks`)

### Structure Guidelines
- Start with YAML frontmatter (`---`)
- Use markdown sections (`##`) for organization
- Include code blocks with language hints
- Add examples and usage instructions
- Keep content focused and actionable

---

## ✅ Validation Checklist

For each skill you create:
- [ ] Valid YAML frontmatter structure
- [ ] Name is descriptive and unique
- [ ] Description clearly explains purpose and usage
- [ ] Content is well-organized and scannable
- [ ] All examples work as documented
- [ ] Error handling is robust
- [ ] Skill loads and invokes correctly
- [ ] Documentation is complete