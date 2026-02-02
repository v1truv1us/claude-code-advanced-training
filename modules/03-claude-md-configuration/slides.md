# Module 03: CLAUDE.md Configuration

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 03: CLAUDE.md Configuration**  
*Building Persistent Context and Team Standards*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Master the `/init` command for automatic configuration generation
- Write effective CLAUDE.md files that scale across teams
- Use hierarchical CLAUDE.md patterns for modular organization
- Implement import syntax for advanced configuration management
- Balance scope and specificity in persistent instructions

### Slide 3: CLAUDE.md vs Skills
**When to Use CLAUDE.md**
- Always-loaded project conventions
- "Always do X" rules
- Team standards that should never be violated
- Persistent context across all sessions

**When to Use Skills**
- Reference material loaded on-demand
- Specific workflows you trigger manually
- Domain knowledge for particular features
- Complex processes with multiple steps

**The Overlap Problem**
```markdown
# Confusing example
CLAUDE.md:
- Use our API patterns
- Handle validation errors gracefully
- Include tests for all new features

.skill:
- API endpoint patterns and examples
- Validation workflow with step-by-step instructions
```

**Solution**: Use clear separation principles

### Slide 4: Memory Types & Hierarchy
**The Four Memory Types**

| Type | Location | Scope | Use Case | Example |
|-------|-----------|-------|---------|---------|
| **Managed** | System-level | Organization-wide policies | Security rules, compliance requirements |
| **Project** | `./CLAUDE.md` | Team-shared | Project conventions, coding standards |
| **User** | `~/.claude/CLAUDE.md` | Personal preferences | Code style preferences, tooling shortcuts |
| **Local** | `./CLAUDE.local.md` | Project-specific | Private configs, sandbox URLs |

**Precedence Rules**
```
Managed > CLI Args > Project > User > Local
```

**Load Order**
1. Managed policies (can't be overridden)
2. Project conventions (team standards)
3. Personal preferences (your defaults)
4. Local overrides (project-specific)

### Slide 5: The `/init` Command Deep Dive

**What `/init` Does**
- Scans codebase for patterns and frameworks
- Detects build systems, test frameworks, package managers
- Identifies common commands and workflows
- Generates comprehensive starter configuration

**Detection Capabilities**
```bash
# Framework detection
Found: React with TypeScript
Found: Express.js with JWT auth
Found: Jest testing framework
Found: npm package manager
Found: ESLint + Prettier formatting

# Tool detection
Found: Git for version control
Found: Docker for containerization
Found: GitHub Actions for CI/CD
```

**Generated Structure**
```markdown
# Project Configuration
## Commands
```bash
pnpm install          # Install dependencies
pnpm test             # Run test suite
pnpm lint             # Check code style
pnpm build            # Build for production
pnpm dev               # Start development server
```

## Build System
- React with Vite
- TypeScript configuration
- ESLint + Prettier code formatting
- Jest for testing
- Docker support

## Code Style
- Use ES6+ modules with import/export
- Functional components with hooks
- 2-space indentation
- Semicolons for statements
- Trailing commas for multi-line structures

## Testing
- Unit tests with Jest
- Integration tests for API contracts
- E2E tests with Playwright
- Coverage minimum: 80%
```

### Slide 6: Writing Effective CLAUDE.md

**Keep It Focused & Actionable**
```markdown
# ❌ Bad: Vague instructions
Write good code.
Follow best practices.
Make sure tests pass.

# ✅ Good: Specific, actionable rules
## Commands
Always run `pnpm test` before committing changes.

## Code Style
- Use 2-space indentation (not tabs)
- Prefer `const` over `let` for constants
- Export functions explicitly
- Include JSDoc comments for public APIs
- Handle errors gracefully with try/catch

## Testing Requirements
- Write tests before implementation
- Maintain 80% minimum test coverage
- Test error paths explicitly
- Use descriptive test names
```

**The 500 Line Rule**
If your CLAUDE.md exceeds 500 lines, it's too bloated. Claude may ignore important rules.

**Import Syntax Mastery**
```markdown
# Basic imports
See @README.md for project overview
See @package.json for available scripts

# Nested imports
## Additional Guidelines
Team workflow: @docs/git-workflow.md
API standards: @docs/api-standards.md
Security considerations: @docs/security.md
```

### Slide 7: Import Syntax Deep Dive

**Three Import Methods**

1. **File References**: `@filename`
   ```markdown
   See @api/endpoints.md for API patterns
   ```

2. **Directory Imports**: `@directory/`
   ```markdown
   See @components/ for React component patterns
   ```

3. **Absolute Paths**: `@/path/to/file`
   ```markdown
   See @~/shared/standards.md for organization rules
   ```

4. **URL Imports**: `@https://docs.example.com/guide`
   ```markdown
   See @https://confluence.example.com/team-standards
   ```

**Import Resolution**
- Relative paths resolve from importing file's location
- Absolute paths work from anywhere
- URLs fetched in real-time (requires approval)
- Max 5 levels of nesting to prevent infinite loops
- One-time approval per project for external URLs

### Slide 8: Modular Rules with .claude/rules/

**When to Use Modular Rules**
- Large projects with multiple teams
- Different rules for different file types
- Conditional rules based on file paths
- Better organization than monolithic CLAUDE.md

**Directory Structure**
```
.claude/
├── CLAUDE.md              # Main project instructions
└── rules/
    ├── typescript.md        # TypeScript-specific rules
    ├── react.md            # React component rules
    ├── testing.md           # Testing guidelines
    ├── api.md              # API development rules
    └── security.md          # Security requirements
```

**Path-Specific Rules Example**
```markdown
---
paths:
  - "src/**/*.ts"
  - "lib/**/*.ts"
---
# TypeScript Rules
- Always use explicit return types
- Prefer interfaces over types for public APIs
- Use generic types where appropriate
- Include JSDoc for exported functions
```

**Rule Loading Order**
1. Global user rules (`~/.claude/rules/`)
2. Project rules (`.claude/rules/`)
3. Main CLAUDE.md (`.claude/CLAUDE.md`)

### Slide 9: Advanced Configuration Patterns

**Environment-Specific CLAUDE.md**
```markdown
# Development environment
## Node Configuration
Use `node --version` to check compatibility
Required: Node.js 18.0.0 or higher

## Database Setup
Local development: PostgreSQL on localhost:5432
Test environment: SQLite in-memory database
Production: AWS RDS with connection pooling
```

**Conditional Instructions**
```markdown
<!-- Development only -->
## Hot Reloading
If IS_DEVELOPMENT:
  - Enable hot module reloading
  - Use faster source maps
  - Enable debug logging
<!-- Production only -->
## Performance Optimization
If IS_PRODUCTION:
  - Enable bundle minification
  - Use aggressive caching
  - Disable debug logging
```

**Multi-Environment Variables**
```markdown
## Configuration
API_URL: ${API_URL}
NODE_ENV: ${NODE_ENV}
DATABASE_URL: ${DATABASE_URL}
```

### Slide 10: Team Collaboration Patterns

**Shared CLAUDE.md for Teams**
```markdown
# Team Workflow Integration
## Git Strategy
- Branch naming: `feature/feature-name`, `bugfix/description`
- Commit messages: Conventional Commits format
- PR templates: Use `.github/pull_request_template.md`

## Code Review Process
- All PRs require at least one approval
- Use GitHub's review tools
- Automated checks must pass
- Reviewer assignment rotates weekly

## Communication
- Use Slack `#development` channel for technical discussions
- Create GitHub issues for bugs with detailed reproduction steps
- Document decisions in project wiki

## Release Process
- Semantic versioning (SemVer)
- Create GitHub releases with changelog
- Deploy through staging environment first
- Tag releases with git tags
```

### Slide 11: Live Demo: /init in Action

**Starting Point**: Empty project directory

**Step 1: Run /init**
```bash
User: "Initialize this project with CLAUDE.md"
Claude:
"Scanning project structure..."
"Detected React + TypeScript + Vite project"
"Identified build tools and testing framework"
"Generating CLAUDE.md with project conventions..."
"✅ CLAUDE.md created successfully"
```

**Step 2: Review Generated Configuration**
```markdown
# Generated CLAUDE.md
## Project Overview
This is a React + TypeScript application built with Vite...

## Commands
```bash
pnpm install
pnpm test
pnpm lint
pnpm build
```

## Generated Configuration
Claude created a comprehensive CLAUDE.md with 180 lines including:
- Detected frameworks and tools
- Identified command patterns
- Suggested code style guidelines
- Added testing requirements
```

**Step 3: Customize and Extend**
```bash
User: "Add team-specific rules to the generated CLAUDE.md"
Claude:
"Adding Git workflow integration..."
"Including security best practices..."
"Adding team communication guidelines..."
"✅ CLAUDE.md customized with team standards"
```

### Slide 12: Common Pitfalls & Solutions

**Pitfall 1: The Kitchen Sink CLAUDE.md**
```
❌ Problem: 400+ lines covering everything
✅ Solution: Focus on essential rules, move reference material to skills
```

**Pitfall 2: Vague Instructions**
```
❌ Problem: "Follow coding standards"
✅ Solution: "Use 2-space indentation, prefer const over let"
```

**Pitfall 3: Missing Environment Variables**
```
❌ Problem: Forgetting to document required environment variables
✅ Solution: "## Required Environment Variables section with all vars"
```

**Pitfall 4: Ignoring Import Security**
```
❌ Problem: Importing from untrusted URLs without review
✅ Solution: "Use @local/ imports for personal reference, review external imports"
```

### Slide 13: Exercise Preview
**Exercise 03-1: /init Mastery**
Generate and customize CLAUDE.md for a real project

**Exercise 03-2: Modular Rules Setup**
Organize complex project rules using .claude/rules/ structure

**Exercise 03-3: Multi-Environment Configuration**
Create environment-specific CLAUDE.md files for dev/staging/production

**Success Criteria**
- Can generate effective CLAUDE.md files from scratch
- Understands when to use CLAUDE.md vs skills
- Can implement hierarchical organization with .claude/rules/
- Manages environment-specific configurations appropriately

---

## 🎬 Video Script

### [0:00-1:30] Introduction
"Welcome to Module 03: CLAUDE.md Configuration. While skills provide on-demand knowledge and workflows, CLAUDE.md creates the foundation - the persistent context that Claude carries into every single session.

Think of CLAUDE.md as your team's playbook - the rules, conventions, and knowledge that should guide every interaction. Master CLAUDE.md, and you create consistency, scalability, and reduce repetitive explanations."

### [1:30-3:30] Understanding Memory Types
"Claude Code offers four types of memory, each serving different purposes. Understanding this hierarchy is crucial for effective configuration.

Managed memory enforces organizational policies. Project memory creates team standards. User memory holds your personal preferences. Local memory handles project-specific tweaks. The precedence system ensures that critical rules can't be overridden accidentally."

### [3:30-5:30] The /init Command
"The `/init` command is your best starting point. It's like having a senior developer analyze your codebase and generate a comprehensive starter configuration.

I'll show you how `/init` detects your frameworks, identifies your build tools, and creates a tailored CLAUDE.md with all the commands and conventions your team uses. This eliminates guesswork and ensures everyone starts with the same foundation."

### [5:30-7:30] Writing Effective Configurations
"A great CLAUDE.md file is like a good README - it tells Claude exactly what it needs to know, nothing more, nothing less.

The key is specificity. Instead of 'write good code,' specify 'use 2-space indentation, prefer const over let for constants.' Instead of 'handle errors,' specify 'always wrap async operations in try/catch and log errors with context.'

I'll share proven patterns for organizing complex configurations and maintaining them as your team evolves."

### [7:30-9:30] Advanced Patterns
"For complex projects, you'll need advanced patterns like modular rules with `.claude/rules/`, environment-specific configurations, and sophisticated import strategies.

I'll demonstrate how to create path-specific rules that only apply to certain file types, how to manage environment-specific instructions, and how to build a hierarchical configuration system that scales across teams and projects."

### [9:30-11:00] Team Collaboration & Demo
"CLAUDE.md becomes truly powerful when used for team collaboration. It's how you encode your collective knowledge, workflows, and standards into Claude's context.

I'll show a live demo of setting up a complete project configuration from scratch using `/init`, then customizing it for team-specific needs. You'll see how a well-structured CLAUDE.md transforms team productivity."

### [11:00-12:00] Conclusion
"Master CLAUDE.md configuration and you create the foundation for consistent, high-quality AI-assisted development. Your CLAUDE.md files become your team's collective brain - the knowledge that guides every decision and action.

Invest time in creating great CLAUDE.md files now, and you'll save countless hours of repetitive explanations later. In our next module, we'll explore Plan Mode - the systematic approach to complex code changes. For now, practice these configuration techniques with the exercises."

---

## 📝 Exercise Details

### Exercise 03-1: /init Mastery
**Objective**: Master the `/init` command and understand how to generate effective CLAUDE.md files

**Scenario**: You have three different projects to configure:
1. A React + TypeScript frontend project
2. A Node.js + Express API project
3. A Python + FastAPI backend project

**Tasks**:
1. Run `/init` on each project and analyze the output
2. Compare generated configurations across projects
3. Identify what `/init` detects well and what it misses
4. Customize generated files for better accuracy
5. Add project-specific commands that `/init` didn't include

### Exercise 03-2: Modular Rules Implementation
**Objective**: Set up `.claude/rules/` directory for a complex project with multiple concerns

**Scenario**: You're working on a large enterprise application with:
- Frontend (React + TypeScript)
- Backend (Node.js + Express)
- Mobile app (React Native)
- Shared component library
- Database layer
- DevOps and deployment

**Tasks**:
1. Create rules for each domain (frontend, backend, mobile, shared)
2. Implement path-specific rules for TypeScript vs JavaScript files
3. Add conditional rules based on file directories
4. Organize rules logically in subdirectories
5. Test rule loading and precedence

### Exercise 03-3: Multi-Environment Setup
**Objective**: Create environment-specific CLAUDE.md files for development, staging, and production

**Scenario**: Your application has different requirements and behaviors across environments:
- Different database connections (local dev, cloud prod)
- Feature flags enabled/disabled per environment
- Different logging levels and debugging tools
- Security requirements vary by environment
- Performance optimizations specific to production

**Tasks**:
1. Create base CLAUDE.md with common configuration
2. Create environment-specific files with conditional sections
3. Use environment variables for sensitive configuration
4. Document deployment procedures for each environment
5. Test configuration switching and validation

---

## 📚 Additional Resources

### Documentation Links
- [Memory Management Guide](https://code.claude.com/docs/en/memory)
- [Settings Reference](https://code.claude.com/docs/en/settings)
- [File Suggestion Documentation](https://code.claude.com/docs/en/settings#file-suggestion-settings)
- [CLI Reference](https://code.claude.com/docs/en/cli-reference)

### Configuration Templates

```markdown
# Essential CLAUDE.md sections
## Project Information
- Name and purpose
- Technologies and frameworks
- Setup instructions

## Commands
- Development server
- Testing
- Build and deployment
- Database operations

## Code Standards
- Formatting and linting
- Testing requirements
- Security practices
- Performance guidelines

## Environment Variables
- Required variables with descriptions
- Optional variables with defaults
- Security considerations
```

### CLAUDE.md Best Practices Cheat Sheet

| Section | Best Practice | Example |
|----------|----------------|---------|
| **Commands** | Be specific with full command | `pnpm install --save-exact` |
| **Code Style** | Use concrete rules, not vague | `Use 2-space indentation, not tabs` |
| **Testing** | Specify coverage and types | `Maintain 80% test coverage with Jest and E2E tests` |
| **Environment** | Document all required variables | `DATABASE_URL, API_KEY, NODE_ENV` |
| **Security** | Include specific security rules | `Never commit secrets, validate all inputs` |

---

## ✅ Completion Checklist

- [ ] Watched all video content
- [ ] Completed Exercise 03-1 (/init Mastery)
- [ ] Completed Exercise 03-2 (Modular Rules)
- [ ] Completed Exercise 03-3 (Multi-Environment Setup)
- [ ] Created effective CLAUDE.md files for actual projects
- [ ] Implemented hierarchical organization with .claude/rules/
- [ ] Used import syntax for advanced configuration
- [ ] Balanced scope and specificity in instructions

**Ready for Module 04?** Ensure you have CLAUDE.md files that effectively guide Claude Code's behavior across your team's projects.