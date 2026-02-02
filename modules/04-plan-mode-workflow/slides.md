# Module 04: Plan Mode Workflow

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 04: Plan Mode Workflow**  
*The 4-Phase Method for Safe Code Analysis*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Master the 4-phase Plan Mode workflow
- Apply Plan Mode to complex code changes safely
- Use Plan Mode for codebase exploration and review
- Edit and refine plans before implementation
- Prevent "solving the wrong problem" scenarios

### Slide 3: Why Plan Mode Matters
**The Problem Without Planning**
```
User: "Add OAuth to our app"
Claude: [reads 2 files, starts coding]
User: "Actually, I need GitHub OAuth too"
Claude: [adds GitHub, breaks existing code]
User: "Wait, also need Google OAuth"
Claude: [adds Google, creates conflicts]
Result: Messy implementation, rework required
```

**The Plan Mode Solution**
```
Phase 1: Explore → Phase 2: Plan → Phase 3: Implement → Phase 4: Commit
```

**Benefits:**
- ✅ Understanding before changing
- ✅ Stakeholder alignment
- ✅ Comprehensive analysis
- ✅ Reduced rework
- ✅ Better architecture decisions

### Slide 4: The 4-Phase Workflow

### Phase 1: Explore (Read-Only Analysis)
**Duration**: 20-30 minutes  
**Context**: Clean, focused on understanding  
**Actions**: Read files, search code, ask clarifying questions  
**Deliverable**: Complete understanding of current state

**Key Questions Claude Answers:**
- "What does this component do?"
- "How are these modules connected?"
- "What are the edge cases here?"
- "What technical debt should I know about?"

### Phase 2: Plan (Strategic Design)
**Duration**: 15-20 minutes  
**Context**: Explore findings + requirements  
**Actions**: Create implementation strategy, identify risks  
**Deliverable**: Detailed step-by-step plan

**Plan Components:**
- Implementation approach and sequence
- File changes needed
- Risk assessment and mitigation
- Testing strategy
- Deployment considerations

### Phase 3: Implement (Execution)
**Duration**: Variable (based on plan complexity)  
**Context**: Plan as reference + new implementation details  
**Actions**: Write code following the plan  
**Deliverable**: Working implementation

**Implementation Guardrails:**
- Follow the approved plan
- Deviate with justification
- Update plan if major changes needed

### Phase 4: Commit (Closure)
**Duration**: 5-10 minutes  
**Context**: Final implementation + changes summary  
**Actions**: Git operations, documentation updates  
**Deliverable**: Completed feature with proper history

### Slide 5: Plan Mode in Action

**Live Demo Flow:**
```
User: "Plan the migration to our new auth system"

# Phase 1: Explore
Claude: [Reads auth.js, database.js, migration files]
Claude: "I can see you're using JWT with session storage. Current auth handles email/password. Migration needs to preserve existing users."

# Phase 2: Plan
Claude: [Creates detailed migration plan]
Claude: "Plan created. Key aspects: 
1. Create OAuth provider structure
2. Implement dual auth support during transition
3. Database migration with rollback plan
4. Preserve user sessions and data
5. Testing strategy for auth methods"

# Phase 3: Implement
Claude: [Implements OAuth providers, migration scripts]
Claude: "Implementation following plan. OAuth providers added, migration script created."

# Phase 4: Commit
Claude: [Commits changes, updates documentation]
Claude: "Migration completed and committed."
```

### Slide 6: Plan Mode Controls

**Enabling Plan Mode:**
```bash
# Method 1: Start in Plan Mode
claude --permission-mode plan

# Method 2: Toggle during session
Shift+Tab cycles through modes
```

**Editing Plans:**
```bash
# Open plan in editor
Ctrl+G

# Save and continue
Ctrl+G → Esc → Choose "Save and continue"
```

**Plan Mode Benefits:**
- Read-only exploration (no accidental changes)
- Comprehensive analysis before coding
- Better architecture decisions
- Stakeholder review and approval
- Reduced rework and bugs

### Slide 7: Advanced Plan Patterns

**Multi-File Exploration Plan:**
```
# Claude analyzes multiple related files
Files to read:
- src/auth/*
- src/middleware/*
- src/models/*
- database/migrations/*

Key findings:
- Current auth uses session tokens
- No OAuth infrastructure exists
- Database schema needs provider abstraction
```

**Risk Assessment:**
- Breaking change: Adding OAuth providers
- Migration complexity: High
- Rollback strategy: Dual auth support needed
- Timeline: 2-3 weeks for full migration

**Implementation Strategy:**
1. Create OAuth interface first
2. Add provider abstraction layer
3. Implement new providers one at a time
4. Full regression testing
5. Gradual migration with feature flags
```

### Slide 8: Common Pitfalls

**Pitfall 1: Skipping Exploration**
```
❌ User: "Just implement OAuth integration"
Result: Incomplete understanding, broken edge cases
✅ Solution: "Use Plan Mode to explore auth system first"
```

**Pitfall 2: Poor Plan Quality**
```
❌ User: "Plan: add OAuth"
Result: "Add oauth table with token field" (vague)
✅ Solution: "Plan: Create OAuth providers table with: 
- provider_id, name, display_name, client_id, client_secret, scopes, created_at, updated_at"
```

**Pitfall 3: Ignoring Plan During Implementation**
```
❌ User: [Explores and plans] → [Starts implementing immediately]
→ [Deviates from plan] → "Issues arise"
✅ Solution: [Explores and plans] → [Follows plan] → [Deviate with justification]
```

### Slide 9: Exercise Preview

**Exercise 04-1: Small Project Planning**
- Use Plan Mode to add a search feature to a React app

**Exercise 04-2: Large Refactor Planning**
- Plan a database optimization refactor with proper analysis

**Exercise 04-3: API Design Planning**
- Design new REST API endpoints with proper planning

**Exercise 04-4: Multi-Service Integration**
- Plan integration between multiple microservices

**Success Criteria:**
- Comprehensive exploration before planning
- Clear, actionable plans
- Risk identification and mitigation
- Stakeholder communication patterns

---

## 🎬 Video Script

### [0:00-1:00] Introduction
"Welcome to Module 04: Plan Mode Workflow. This module addresses one of the most costly mistakes in software development: building the wrong thing.

How many times have you said 'That's not what I wanted' after spending hours implementing something? Or had to completely rewrite code because you discovered a fundamental misunderstanding late in the process?

Plan Mode is Claude Code's answer to this problem. It forces you to understand before you build, plan before you code, and commit with intention. It's the difference between chaotic development and systematic engineering."

### [1:00-3:00] The Problem Without Planning
"Let me show you a common scenario. Imagine you need to add OAuth authentication to your existing application. Without proper planning:

**Traditional approach:**
1. 'Add GitHub OAuth' - you implement GitHub OAuth
2. 'Actually need Google too' - you add Google OAuth  
3. 'Wait, also Microsoft' - you add Microsoft OAuth
4. 'This is getting messy' - you have conflicting auth systems
5. 'Let me refactor' - you spend weeks cleaning up the mess

**Cost of this approach:**
- Week 1: Initial implementation
- Week 2: Adding more providers
- Week 3: Refactoring and fixes
- Week 4: Documentation and cleanup
- **Total**: 4 weeks of rework

**The result?** A fragile system that's hard to maintain and extend."

### [3:00-5:00] The Plan Mode Solution

"Plan Mode introduces the scientific method to software development. It's not about slowing down - it's about being systematic.

**The 4 phases work like this:**

**Phase 1: Explore** - Claude Code becomes your research assistant. It reads files, searches for patterns, and answers your questions. All without making any changes. This is where you discover the current architecture, the hidden dependencies, the performance bottlenecks.

**Phase 2: Plan** - With exploration complete, Claude creates a strategic plan. This is where you identify risks, consider alternatives, and make architectural decisions. The plan lives in its own context - clean, focused, separate from your implementation work.

**Phase 3: Implement** - Now Claude codes, but with the plan as its reference. Every implementation decision can be checked against the plan. If Claude discovers something better, it updates the plan and justifies the change.

**Phase 4: Commit** - Finally, Claude commits the work with a clear description of what was done and why.

This workflow transforms development from chaotic to predictable."

### [5:00-7:00] Enabling and Using Plan Mode

"Getting started with Plan Mode is simple:

```bash
# Start in Plan Mode
claude --permission-mode plan

# Or toggle during a session
Shift+Tab cycles through permission modes
```

Once in Plan Mode, Claude behaves differently. It asks clarifying questions instead of making assumptions. It pauses before taking actions. It's more conversational, more analytical.

You can edit the plan directly with Ctrl+G. This is incredibly powerful for complex projects - imagine having a senior architect review your plan before you write a single line of code."

### [7:00-9:00] Live Demo: Complex Refactor

"Let me show you Plan Mode in action with a realistic scenario. Imagine you need to refactor a critical authentication module that's used across your entire application.

**The task:** 'Refactor our authentication system to support multiple providers and improve security'

**Without Plan Mode:**
1. Claude starts coding immediately
2. Discovers edge cases during implementation
3. Makes inconsistent architectural decisions
4. Creates technical debt
5. Multiple stakeholders have different understandings

**With Plan Mode:**
1. **Exploration Phase**: Claude reads auth.js, database schemas, API endpoints
2. **Planning Phase**: Claude creates comprehensive refactor plan
3. **Implementation Phase**: Claude codes following the approved plan
4. **Review Phase**: Claude demonstrates the working system

I'll show you how Plan Mode catches issues early, facilitates communication, and ensures everyone is aligned before expensive work begins."

### [9:00-11:00] Advanced Patterns and Integration

"Plan Mode becomes even more powerful when combined with other Claude Code features:

- **Skills**: Load domain knowledge automatically in Plan Mode
- **Subagents**: Use specialized agents for complex analysis
- **Hooks**: Automate plan validation and execution
- **MCP**: Connect to external systems for comprehensive analysis

You can create workflows where Plan Mode triggers skills that gather stakeholder input, uses subagents for technical analysis, validates plans with automated hooks, and pulls in data from external systems via MCP.

This is enterprise-grade development workflow automation."

### [11:00-12:00] Conclusion

"Master Plan Mode and you'll transform how your team approaches complex projects. No more 'I thought that's what you wanted' conversations. No more late-night discoveries of fundamental flaws.

Instead, you'll have: comprehensive analysis, stakeholder alignment, architectural decisions that everyone understands, and implementation that follows a proven plan.

In our next module, we'll explore Skills - how to make Claude's knowledge reusable and invocable. For now, practice Plan Mode with the exercises, and I'll see you in Module 05."

---

## 📝 Exercise Details

### Exercise 04-1: Small Project Planning with Plan Mode
**Objective**: Add a comment moderation feature to a React blog application

**Tasks**:
1. Start Plan Mode and explore existing comment system
2. Identify all components that handle comments
3. Plan moderation workflow with UI components
4. Create implementation strategy considering existing patterns
5. Validate plan with stakeholder questions

### Exercise 04-2: Database Migration Planning
**Objective**: Plan migration from localStorage to PostgreSQL with zero downtime

**Scenario**: Current blog uses localStorage for comments, needs to move to database for persistence and scaling

**Tasks**:
1. Analyze current data structure and volume
2. Plan database schema changes
3. Design data migration strategy
4. Plan rollback and testing procedures
5. Create timeline with risk mitigation

### Exercise 04-3: API Integration Planning
**Objective**: Plan integration between frontend and new backend service

**Tasks**:
1. Map current API contracts and data flow
2. Plan new REST endpoints needed
3. Design authentication and authorization flow
4. Plan error handling and rate limiting
5. Create integration testing strategy

### Exercise 04-4: Multi-Service Architecture
**Objective**: Plan microservices communication for new feature

**Tasks**:
1. Analyze existing service boundaries and contracts
2. Plan service discovery and registration patterns
3. Design inter-service communication protocol
4. Plan data consistency and synchronization
5. Plan monitoring and debugging strategies

---

## 📚 Additional Resources

### Documentation Links
- [Plan Mode Guide](https://code.claude.com/docs/en/common-workflows#use-plan-mode-for-safe-code-analysis)
- [Permission Modes](https://code.claude.com/docs/en/settings#permission-modes)
- [Settings Reference](https://code.claude.com/docs/en/settings)

### Plan Mode Quick Reference

| Situation | When to Use Plan Mode | Command |
|------------|---------------------|---------|
| Complex feature | Multi-file changes | `--permission-mode plan` |
| Code review | Large refactoring | `--permission-mode plan` |
| Architecture decision | New system design | `--permission-mode plan` |
| Bug investigation | Performance issues | `--permission-mode plan` |
| Team alignment | Stakeholder buy-in | `--permission-mode plan` |

---

## ✅ Completion Checklist

- [ ] Watched all video content
- [ ] Completed Exercise 04-1 (Small Project Planning)
- [ ] Completed Exercise 04-2 (Database Migration Planning)
- [ ] Completed Exercise 04-3 (API Integration Planning)
- [ ] Completed Exercise 04-4 (Multi-Service Architecture)
- [ ] Used Plan Mode for real project work
- [ ] Created comprehensive plans before implementation
- [ ] Integrated stakeholder review process

**Ready for Module 05?** Ensure you can systematically approach complex projects using the 4-phase Plan Mode workflow.