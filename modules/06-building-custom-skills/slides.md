# Module 06: Building Custom Skills

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 06: Building Custom Skills**  
*Advanced Skill Development for Domain Expertise and Automation*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Master advanced skill architecture and patterns
- Create complex knowledge skills with nested expertise
- Build workflow skills for multi-step automation
- Implement skill security and validation best practices
- Design skills for team distribution and versioning
- Debug and optimize skill performance

### Slide 3: Advanced Skill Architecture

**Skill Design Patterns**
```yaml
# Knowledge Skill Pattern
---
name: react-patterns
description: React best practices and common patterns
context: fork
model: sonnet
---
# Rich domain expertise with examples

# Workflow Skill Pattern  
---
name: pr-review
description: Automated pull request review workflow
context: fork
disable-model-invocation: true
skills: [code-quality, security-check]
---
# Multi-step automation with skills
```

**Key Architectural Decisions**
- **Context Strategy**: `fork` (isolated) vs `current` (shared)
- **Model Selection**: Choose based on complexity vs cost
- **Skill Dependencies**: Compose skills like building blocks
- **Invocation Control**: Manual vs automatic triggering

### Slide 4: Knowledge Skills - Deep Domain Expertise

**Beyond Basic Documentation**
```yaml
---
name: aws-security
description: AWS security best practices and compliance patterns
context: fork
---
# Security Principles
Always implement the principle of least privilege:
- Use IAM roles instead of access keys when possible
- Scope permissions to specific resources
- Regular audit of permissions with IAM Access Analyzer

# Common Anti-Patterns
❌ NEVER put credentials in code or environment variables
❌ Avoid wildcard permissions in production
❌ Don't use root account for daily operations

# Implementation Examples
## S3 Secure Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-secure-bucket",
        "arn:aws:s3:::my-secure-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```
```

### Slide 5: Workflow Skills - Multi-Step Automation

**Complex Workflow Example**
```yaml
---
name: production-deploy
description: Complete production deployment with validation
context: fork
disable-model-invocation: true
skills: [git-workflow, ci-cd-monitoring, rollback-procedures]
model: sonnet
---

# Production Deployment Workflow

## Step 1: Pre-Deployment Checks
- [ ] All tests passing in CI/CD
- [ ] Code coverage > 80%
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Stakeholder approval received

## Step 2: Environment Preparation
- [ ] Database migrations prepared
- [ ] Feature flags configured
- [ ] Backup procedures verified
- [ ] Monitoring dashboards ready

## Step 3: Deployment Execution
```bash
# Order matters for zero-downtime
git checkout main
git pull origin main
./scripts/pre-deploy-checks.sh
./scripts/deploy.sh
./scripts/post-deploy-verify.sh
```

## Step 4: Validation & Rollback Plan
- [ ] Health checks passing
- [ ] Key user journeys tested
- [ ] Error rates below threshold
- [ ] Rollback prepared if needed
```

### Slide 6: Advanced Frontmatter Configuration

**Configuration Options Deep Dive**
```yaml
---
name: advanced-skill
description: Demonstration of all configuration options

# Model Selection
model: sonnet  # haiku, sonnet, opus

# Context Management
context: fork  # current, fork

# Invocation Control
disable-model-invocation: false  # true for workflow skills

# Skill Dependencies
skills: [base-patterns, security-guidelines]

# Environment Variables (Claude Code 1.5+)
environment:
  NODE_ENV: production
  API_TIMEOUT: 30000

# Input Validation (Claude Code 1.5+)
input_schema:
  type: object
  required: [project_name]
  properties:
    project_name:
      type: string
      pattern: ^[a-z][a-z0-9-]*$

# Output Format (Claude Code 1.5+)
output_format: markdown  # json, yaml, plain
---
```

### Slide 7: Skill Security & Validation

**Security Best Practices**
```yaml
---
name: secure-patterns
description: Secure coding patterns with validation

# Input Sanitization Rules
ALWAYS validate user inputs:
- Length limits (prevent buffer overflow)
- Character encoding (prevent injection)
- Type checking (prevent type confusion)
- Business logic validation

# Sensitive Data Handling
NEVER expose in skills:
- API keys, tokens, passwords
- Internal network details
- Production credentials
- Personal user data

# Example Validation
function validateInput(input) {
  // Input from skill user
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .substring(0, 1000); // Length limit
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(sanitized)) {
    throw new Error('Invalid characters detected');
  }
  
  return sanitized.trim();
}
```

### Slide 8: Team Distribution Strategies

**Skill Sharing Patterns**

**1. Central Repository**
```bash
team-skills/
├── frontend/          # Frontend-specific skills
├── backend/           # Backend-specific skills  
├── devops/            # DevOps automation skills
└── security/          # Security guidelines
```

**2. Hierarchical Inheritance**
```yaml
# Base skill (company-wide)
---
name: company-standards
description: Company-wide coding standards
---

# Team skill (inherits from base)
---
name: frontend-standards
skills: [company-standards]
extends: frontend-specific patterns
---

# Personal skill (inherits from team)
---
name: my-workflow
skills: [frontend-standards]
extends: personal preferences
---
```

**3. Version Management**
```yaml
---
name: api-client-v2
description: API client patterns v2.0
version: 2.0.0
compatibility: ">=1.8.0"
deprecation_notice: "v1.0 deprecated, migrate by 2024-03-01"
---
```

### Slide 9: Debugging Skills

**Common Skill Issues & Solutions**

**Issue 1: Skill Not Loading**
```bash
# Debug: Check skill file syntax
claude /skill validate my-skill

# Debug: Check frontmatter YAML
cat ~/.claude/skills/my-skill.md | head -20

# Debug: Verify skill registration
claude /skill list
```

**Issue 2: Skill Context Pollution**
```yaml
# Problem: Skill loads too much context
---
name: heavy-skill
context: current  # Pollutes main context
---

# Solution: Use forked context
---
name: heavy-skill  
context: fork  # Clean isolation
---
```

**Issue 3: Performance Issues**
```yaml
# Add performance monitoring
---
name: monitored-skill
description: Skill with performance tracking
monitoring:
  max_execution_time: 30s
  memory_limit: 512MB
  log_level: debug
---
```

### Slide 10: Advanced Use Cases

**Use Case 1: Dynamic Skill Generation**
```yaml
---
name: skill-generator
description: Generate skills from templates
---

# Template-Based Skill Creation
## Usage
/skill generate --name=my-api --type=rest-client --framework=axios

## Generated Output
Creates personalized skill with:
- API endpoint patterns
- Error handling strategies  
- Testing templates
- Documentation generation
```

**Use Case 2: Cross-Skill Communication**
```yaml
---
name: orchestrator-skill
description: Coordinates multiple specialized skills
skills: [database-migration, api-updates, frontend-build]
---

# Orchestration Workflow
1. Database migration skill prepares schema
2. API update skill modifies endpoints  
3. Frontend build skill updates components
4. Integration testing skill validates all changes
```

**Use Case 3: Adaptive Learning**
```yaml
---
name: learning-skill
description: Learns from user interactions and adapts
learning_mode: true
feedback_collection: true
---

# Self-Improving Documentation
- Tracks user questions
- Identifies documentation gaps
- Suggests improvements
- Updates common patterns automatically
```

### Slide 11: Performance Optimization

**Optimizing Skill Performance**

**1. Context Optimization**
```yaml
# Bad: Loads entire codebase
---
name: codebase-analyzer
tools: [Read, Grep, Glob]
---

# Good: Targeted analysis
---
name: codebase-analyzer
tools: [Grep]  # More efficient than Read
scope: src/**/*.js  # Limit search scope
cache_results: true
---
```

**2. Caching Strategies**
```yaml
---
name: caching-skill
description: Skill with intelligent caching
cache:
  enabled: true
  ttl: 3600  # 1 hour
  key_patterns: ["user_query", "project_context"]
---
```

**3. Lazy Loading**
```yaml
---
name: modular-skill
description: Load components on demand
modules:
  core: always
  advanced: on_demand
  experimental: explicit_request
---
```

### Slide 12: Live Demo: Complex Skill Creation

**Demo: Building an Enterprise Code Review Skill**

Starting Point:
```bash
# We need to standardize code reviews across the team
# Requirements: Security, performance, maintainability checks
```

Step 1: Design Architecture
```yaml
---
name: enterprise-pr-review
description: Comprehensive PR review automation
context: fork
skills: [security-scanner, performance-analyzer, style-checker]
disable-model-invocation: true
---
```

Step 2: Implement Core Logic
[Show implementing review criteria, validation, reporting]

Step 3: Add Team Integration
[Show skill distribution, permissions, customization]

Step 4: Deploy & Test
[Show real PR review, team feedback, iteration]

**Result**: Automated review that catches 85% of common issues before human review

### Slide 13: Common Pitfalls & Solutions

**Pitfall 1: Skills Try to Do Everything**
```
Problem: Single skill handles linting, testing, deploying, documenting
Solution: Create focused, single-purpose skills that compose together
```

**Pitfall 2: Hardcoded Environment Details**
```yaml
# Problem
---
name: api-client
base_url: "https://api.company.com/internal"  # Hardcoded
---

# Solution  
---
name: api-client
environment:
  API_BASE_URL: "${API_BASE_URL}"  # Configurable
---
```

**Pitfall 3: No Error Handling**
```yaml
# Problem: Skill fails silently
function fetchData() {
  return api.get(endpoint);  // No error handling
}

# Solution: Robust error handling
function fetchData() {
  try {
    const response = api.get(endpoint);
    return validateResponse(response);
  } catch (error) {
    logError(error);
    return getFallbackData();
  }
}
```

### Slide 14: Exercise Preview

**Exercise 06-1: Advanced Knowledge Skill**
Create a comprehensive knowledge skill for your tech stack

**Exercise 06-2: Workflow Automation**
Build a multi-step workflow skill for a complex process

**Exercise 06-3: Team Distribution**
Design skill distribution strategy for your team

**Success Criteria**
- Skills follow security best practices
- Efficient context management and performance
- Team-ready with proper versioning and documentation

### Slide 15: Key Takeaways

1. **Design for Composition**
   - Small, focused skills > large, monolithic skills
   - Use skill dependencies to build complex workflows
   - Think in building blocks, not finished solutions

2. **Security First**
   - Never embed secrets or sensitive data
   - Validate all inputs and outputs
   - Use principle of least privilege

3. **Performance Matters**
   - Choose optimal context strategy
   - Implement caching and lazy loading
   - Monitor and optimize resource usage

4. **Team Scalability**
   - Design for distribution from day one
   - Use hierarchical inheritance patterns
   - Plan for versioning and evolution

---

## 🎬 Video Script

### [0:00-0:30] Introduction
"Welcome to Module 06: Building Custom Skills. In Module 5, we covered the fundamentals of skills - what they are, when to use them, and basic structure. Today we're diving deep into advanced skill development.

We'll move beyond simple documentation skills to build complex, secure, and performant skills that can handle real enterprise workflows. If you've ever wanted to automate your team's code review process, create domain expertise that scales across your organization, or build sophisticated multi-step workflows, this module is for you."

### [0:30-2:30] Advanced Architecture Patterns
"Let's start with skill architecture. The fundamental decision you make when designing a skill is context strategy: `fork` versus `current`. 

Forked context creates a clean, isolated environment - perfect for complex analysis or when you don't want to pollute your main conversation. Current context shares your conversation context - ideal for quick assistance tools.

Your model selection matters too. Haiku is fast and cheap for simple tasks, Sonnet balances capability and cost for most work, and Opus handles the most complex reasoning but comes at higher cost.

The real power comes from skill dependencies. Just like you compose functions in code, you can compose skills to build sophisticated capabilities. Think of it like LEGO blocks - each skill is a specialized piece that you combine to create complex structures."

### [2:30-4:30] Knowledge Skills - Beyond Documentation
"Knowledge skills are where most teams start, but they often miss the opportunity to create truly valuable domain expertise. Instead of just documenting what exists, great knowledge skills capture the 'why' behind decisions, common anti-patterns to avoid, and concrete implementation examples.

Look at this AWS security skill example. It doesn't just list security rules - it explains the principle of least privilege, shows common anti-patterns with clear warnings, and provides concrete code examples like secure S3 bucket policies. This is the kind of expertise that normally lives in senior developers' heads, now captured and reusable.

The key is to think like a mentor, not a documentation generator. What would a senior developer tell a junior developer? What mistakes do people commonly make? What are the battle-tested patterns that have proven successful over time?"

### [4:30-6:30] Workflow Skills - Automation Powerhouses
"Workflow skills are where Claude Code really shines for team productivity. These aren't just documentation - they're complete automation workflows that guide users through complex processes.

Take this production deployment skill. It's not just a checklist - it's a complete workflow with pre-deployment validation, environment preparation, deployment execution, and post-deployment verification. Notice how it depends on other skills like git-workflow and ci-cd-monitoring - we're composing specialized capabilities into a comprehensive solution.

The beauty of workflow skills is that they capture your team's proven processes in a reusable, automated format. New team members can follow the exact same process as veterans, and everyone benefits from continuous improvement as the workflow evolves."

### [6:30-8:00] Security & Validation
"Security is non-negotiable for enterprise skills. Every skill that handles team workflows needs robust input validation, secure data handling, and proper error handling.

Always validate user inputs - check length, encoding, types, and business logic. Never expose sensitive data in skills - no API keys, no credentials, no internal network details. Implement proper error handling that fails gracefully and provides useful feedback without exposing internals.

Think of security like input validation in web applications. You wouldn't trust user input directly in your web app, so don't trust it in your skills either. Sanitize, validate, and handle edge cases."

### [8:00-9:30] Team Distribution Strategies
"Individual skills are great, but team-scale skills are transformative. The challenge is distributing skills across teams while maintaining consistency and enabling customization.

Three patterns work well: centralized repositories for skill sharing, hierarchical inheritance for base standards with team customization, and proper version management for skill evolution.

The hierarchical pattern is particularly powerful. Company-wide standards become base skills, teams extend them with domain-specific patterns, and individuals add personal preferences. This creates consistency where it matters while allowing flexibility where needed."

### [9:30-10:30] Live Demo: Enterprise PR Review Skill
"Let's build something real - an enterprise pull request review skill that automates 80% of the review process.

We'll start by defining the architecture with proper skill dependencies on security scanning, performance analysis, and style checking. Then we'll implement the core review logic that checks for security vulnerabilities, performance anti-patterns, and maintainability issues.

Next, we'll add team integration features like customizable rules, team-specific patterns, and integration with existing workflows. Finally, we'll deploy it and show it in action on a real pull request.

The result is a skill that catches most common issues automatically, leaving human reviewers to focus on the more complex architectural and business logic decisions."

### [10:30-11:30] Common Pitfalls & Solutions
"Let me cover the three most common mistakes I see when teams build advanced skills.

First, the 'do everything' skill. Teams try to build one skill that handles linting, testing, deploying, and documenting. The result is a monstrosity that's hard to maintain and debug. Solution: create focused, single-purpose skills that compose together.

Second, hardcoded environment details. Skills that only work in specific environments break when things change. Always use environment variables and configuration patterns.

Third, no error handling. Skills that fail silently or crash with cryptic errors frustrate users and damage adoption. Implement proper error handling with useful feedback and fallback mechanisms."

### [11:30-12:00] Conclusion
"Advanced skill development is where Claude Code transitions from a personal assistant to a team productivity platform. By mastering the patterns we've covered today - composition, security, performance, and distribution - you can build skills that scale across entire organizations.

Remember: design for composition, prioritize security, optimize for performance, and plan for team distribution from day one.

In our next module, we'll explore subagents and delegation patterns that complement these skills with context isolation and parallel processing. For now, practice these advanced skill techniques with the exercises, and I'll see you in Module 07."

---

## 📝 Exercise Details

### Exercise 06-1: Advanced Knowledge Skill
**Objective**: Create a comprehensive knowledge skill for your technology stack

**Scenario**: Your team needs a centralized knowledge base for your primary technology stack (React, Node.js, Python, etc.) that goes beyond basic documentation to include best practices, anti-patterns, and implementation examples.

**Tasks**:
1. Choose a technology stack your team uses heavily
2. Design skill architecture with proper frontmatter configuration
3. Create comprehensive knowledge sections including:
   - Core principles and patterns
   - Common anti-patterns with warnings
   - Implementation examples with code
   - Performance considerations
   - Security best practices
4. Add input validation and error handling
5. Test the skill with real scenarios

**Success Criteria**:
- Skill follows advanced architecture patterns
- Includes security considerations and input validation
- Provides actionable, implementation-focused guidance
- Demonstrates efficient context management

**Files**:
- `exercise/knowledge-skill-template.md` - Starter template
- `exercise/tech-stack-analysis.md` - Your technology assessment
- `exercise/my-advanced-skill.md` - Your completed skill

---

### Exercise 06-2: Workflow Automation Skill
**Objective**: Build a multi-step workflow skill for a complex team process

**Scenario**: Your team has a complex process that could benefit from automation - such as incident response, feature release, code review, or onboarding new developers.

**Tasks**:
1. Map out the current workflow with all steps and decision points
2. Design skill dependencies and composition strategy
3. Implement the workflow skill with:
   - Pre-condition validation
   - Step-by-step execution guidance
   - Error handling and rollback procedures
   - Integration with existing tools
   - Success criteria and validation
4. Add team-specific customization options
5. Test with a real workflow instance

**Example Workflows**:
- **Incident Response**: From detection to resolution to post-mortem
- **Feature Release**: From feature complete to production deployment
- **Developer Onboarding**: From hire to first productive contribution
- **Security Audit**: From planning to execution to reporting

**Success Criteria**:
- Workflow is comprehensive and covers all critical steps
- Includes proper error handling and validation
- Integrates with existing team tools and processes
- Reduces workflow time by at least 30%

---

### Exercise 06-3: Team Distribution Strategy
**Objective**: Design and implement a skill distribution strategy for your team

**Scenario**: You need to deploy skills across a team of 10+ developers with different roles (frontend, backend, DevOps) while maintaining consistency and allowing appropriate customization.

**Tasks**:
1. Analyze team structure and skill needs by role
2. Design hierarchical inheritance model:
   - Company-wide base skills
   - Team-specific extensions
   - Individual customizations
3. Create distribution mechanism:
   - Central repository structure
   - Version management strategy
   - Update and maintenance process
4. Implement 3-5 core skills following the distribution model
5. Create documentation and onboarding process
6. Plan for evolution and governance

**Deliverables**:
- Team skill architecture diagram
- Repository structure and file organization
- 3+ production-ready skills following the model
- Distribution and maintenance documentation
- Team onboarding guide

**Success Criteria**:
- Skills can be distributed and updated efficiently
- Consistent standards across team while allowing flexibility
- Clear ownership and maintenance responsibilities
- Scalable to support team growth

---

## 📚 Additional Resources

### Documentation Links
- [Advanced Skill Configuration](https://code.claude.com/docs/en/skills-advanced)
- [Skill Security Guidelines](https://code.claude.com/docs/en/skills-security)
- [Team Skill Distribution](https://code.claude.com/docs/en/skills-teams)

### Templates & Examples
```yaml
# Advanced skill template
---
name: your-advanced-skill
description: Comprehensive skill description
context: fork
model: sonnet
skills: [base-skill, security-patterns]
disable-model-invocation: false
environment:
  NODE_ENV: production
input_schema:
  type: object
  required: [input_param]
  properties:
    input_param:
      type: string
      pattern: ^[a-z0-9\-_]+$
output_format: markdown
monitoring:
  max_execution_time: 60s
  memory_limit: 512MB
  log_level: info
---
```

### Performance Optimization Checklist
- [ ] Choose optimal context strategy (fork vs current)
- [ ] Implement appropriate caching mechanisms
- [ ] Use lazy loading for optional components
- [ ] Monitor execution time and memory usage
- [ ] Optimize tool usage (Grep vs Read)
- [ ] Limit search scopes and result sizes

### Security Validation Checklist
- [ ] No hardcoded secrets or credentials
- [ ] Input validation for all user inputs
- [ ] Output sanitization and validation
- [ ] Proper error handling without information leakage
- [ ] Principle of least privilege for tool access
- [ ] Regular security review of skill logic

### Team Distribution Templates
```
company-skills/
├── base/                    # Company-wide standards
│   ├── coding-standards.md
│   ├── security-guidelines.md
│   └── git-workflow.md
├── teams/                   # Team-specific extensions
│   ├── frontend/
│   ├── backend/
│   └── devops/
└── personal/                # Individual customizations
    └── README.md
```

---

## ✅ Completion Checklist

- [ ] Watched all video content
- [ ] Completed Exercise 06-1 (Advanced Knowledge Skill)
- [ ] Completed Exercise 06-2 (Workflow Automation Skill)
- [ ] Completed Exercise 06-3 (Team Distribution Strategy)
- [ ] Applied advanced skills to real team workflows
- [ ] Implemented security best practices
- [ ] Documented skill maintenance and evolution plan
- [ ] Shared skills with team for feedback

**Ready for Module 07?** Ensure you have at least 2 production-ready skills that demonstrate advanced patterns before proceeding.