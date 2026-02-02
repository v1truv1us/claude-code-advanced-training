# Module 01: Context Window Mastery

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 01: Context Window Mastery**  
*Optimizing Your Conversations for Maximum Efficiency*

### Slide 2: Learning Objectives
By the end of this module, you will be able to:
- Understand why context management is Claude's #1 constraint
- Monitor and optimize token usage effectively  
- Apply proven techniques to reduce token consumption
- Use context isolation strategies for complex tasks

### Slide 3: The Context Window Problem
**What is the Context Window?**
- Claude's working memory for your entire conversation
- Includes every message, file read, and command output
- Limited capacity (varies by model)

**Why It Matters**
```
Performance ↓ as Context ↑
├── More mistakes
├── Slower responses  
└── "Forgetting" earlier instructions
```

### Slide 4: Real-World Impact
**Before Optimization** (15k+ tokens):
- Claude: "I need to refactor this function..."
- Claude: "Let me read the test file..."
- Claude: "What was the original requirement again?"
- Result: Confused, inefficient conversation

**After Optimization** (<5k tokens):
- Claude: "I'll refactor the auth function following our standards"
- Claude: "Refactoring complete, tests passing"
- Result: Clear, focused, efficient work

### Slide 5: Monitoring Context Usage
**Visual Indicators**
```
Context: ████████░░ 3.2k/10k tokens
```

**Commands to Monitor**
```bash
# Check current context
/memory

# See conversation history
/history
```

**Signs of Context Bloat**
- Responses become generic or vague
- Claude asks about things you've already said
- Slower response times
- "I lost track of what we were doing"

### Slide 6: Core Strategy 1: /clear Between Tasks
**When to Use /clear**
- Switching between unrelated features
- Starting a new debugging session
- After long context-heavy conversations
- Before beginning Plan Mode

**Before /clear**
```
User: "Fix the login bug"
Claude: [reads 20 files, 5k tokens]
User: "Actually, let's add a feature instead"
Claude: [still has login context, confused]
```

**After /clear**
```
User: "/clear"
User: "Add a new feature"
Claude: [fresh context, focused on new task]
```

### Slide 7: Core Strategy 2: Compact with Instructions
**Basic /compact**
```bash
/compact
```
**Custom /compact**
```bash
/compact Focus on API changes and test failures
```

**CLAUDE.md Rule for Auto-Compaction**
```markdown
# Compaction Rules
When compacting, always preserve:
- Full list of modified files
- Any test commands that failed
- Key architectural decisions made
```

### Slide 8: Core Strategy 3: Subagents for Research
**The Problem**
```
Your session: "Investigate auth system"
Claude reads: auth.js, user.js, utils.js, tests/
Context cost: 8k tokens of research
```

**The Solution**
```
User: "Use subagents to investigate auth system"
Subagent result: "Auth uses JWT with refresh tokens, 3 middleware layers"
Your context cost: 200 tokens of summary
```

**Creating Research Subagent**
```markdown
---
name: researcher
description: Investigates codebase and returns concise findings
tools: Read, Grep, Glob
---
You are a codebase investigator. Read files, search for patterns, 
and return only the most important findings in bullet points.
```

### Slide 9: File Reference Patterns
**Inefficient: Read Entire File**
```bash
# BAD: Claude reads entire config file
User: "What port does the app use?"
Claude: [reads 200-line config.json]
```

**Efficient: @ Reference**
```bash
# GOOD: Claude gets just what's needed
User: "What port does @config.json use?"
Claude: [knows it's port 3000 from file metadata]
```

**Pattern Guide**
| Approach | When to Use | Context Cost |
|-----------|--------------|--------------|
| `@filename` | Simple questions about files | Minimal |
| Read entire | Complex analysis needed | High |
| Grep search | Find pattern across files | Medium |
| Glob pattern | List matching files | Low |

### Slide 10: Session Management Patterns
**Single Long Session vs Multiple Sessions**

```
❌ Single 3-hour session
Context: ████████████████ 15k tokens
Issues: Claude confused, slow, forgetful

✅ Three 1-hour sessions with /clear
Context: ██████░░░░░░░░░░ 4k tokens each
Benefits: Fresh, focused, efficient
```

**Session Planning**
1. Plan your work in logical chunks
2. Use `/clear` between major transitions
3. Save work with git checkpoints
4. Resume with `/continue` if needed

### Slide 11: Advanced: Context Partitioning
**The Technique**
Split work across multiple focused subagents, each with clean context

**Example: Large Refactor**
```
Main: "Orchestrate database layer refactor"
├── Subagent 1: "Analyze current schema"
├── Subagent 2: "Design new schema"  
├── Subagent 3: "Plan migration"
└── Subagent 4: "Implement changes"
```

**Benefits**
- Each subagent has optimal context size
- Parallel processing possible
- Clear responsibility boundaries
- Easy to debug individual pieces

### Slide 12: Practical Demo
**Live Demo: Context Optimization**

Starting State:
```
Context: ████████████░░ 8.5k/10k tokens
Recent: API changes, bug fix, test failures, config updates
```

Step 1: Identify Bloat Sources
```bash
/memory  # Show loaded memories
/history  # Review conversation
```

Step 2: Strategic Compaction
```bash
/compact Focus on the API authentication bug
Result: ██████░░░░░░░░░ 3.2k/10k tokens
```

Step 3: Delegate Research
```bash
"use subagent to find similar auth bugs in history"
# Claude spawns researcher, gets summary
# Main context stays clean
```

Step 4: Focused Work
```bash
"Fix the auth timeout issue using the subagent's findings"
# Claude works with optimal context
```

### Slide 13: Common Pitfalls & Solutions
**Pitfall 1: The Kitchen Sink Session**
```
Problem: Start with bug fix → add feature → refactor → docs → tests
Solution: /clear between each major task type
```

**Pitfall 2: Correcting into Confusion**
```
Problem: Claude keeps making same mistake, context fills with failed attempts
Solution: /clear after 2 failures, start fresh with better prompt
```

**Pitfall 3: Analysis Paralysis**
```
Problem: Claude reads everything trying to be thorough
Solution: Scope investigation narrowly, use subagents
```

### Slide 14: Exercise Preview
**Exercise 01-1: Context Cleanup**
Transform a bloated conversation into an efficient one

**Exercise 01-2: Subagent Research**  
Build a research subagent and delegate investigation

**Exercise 01-3: Token Budgeting**
Maintain conversations under specific token limits

**Success Criteria**
- Keep all conversations under 5k tokens
- Use subagents for any task reading 5+ files
- Implement compaction rules in CLAUDE.md

### Slide 15: Key Takeaways
1. **Context is Your Most Limited Resource**
   - Treat tokens like CPU cycles or memory
   - Every character counts

2. **Strategic Reset > Slogging Through**
   - Use `/clear` liberally between task types
   - Fresh context is faster than confused context

3. **Delegate, Don't Accumulate**
   - Subagents for research, you for implementation
   - Isolation keeps your main session clean

4. **Measure and Optimize**
   - Monitor context usage continuously
   - Set personal token budgets
   - Refine based on what works

---

## 🎬 Video Script

### [0:00-0:30] Introduction
"Welcome to Module 01: Context Window Mastery. This is arguably the most important module in the entire series because context management is the single biggest factor that determines whether Claude Code helps you or frustrates you.

If you've ever had Claude seem to 'forget' what you asked for, give generic responses, or make the same mistakes repeatedly - that was almost certainly a context window problem. Master these techniques, and everything else in this training becomes 10x more effective."

### [0:30-2:00] The Context Window Problem
"Let's start by understanding what we're dealing with. Claude's context window is essentially its working memory. Every message you send, every file Claude reads, every command output - it all consumes space in this limited buffer.

When the context window gets full, Claude's performance degrades dramatically. It starts making mistakes, loses track of instructions, and gives increasingly generic responses. Think of it like RAM on your computer - when it's full, everything slows to a crawl.

The key insight is that most developers unknowingly operate with bloated contexts 80% of the time. They wonder why Claude seems confused, not realizing they're asking it to juggle dozens of unrelated concepts simultaneously."

### [2:00-4:00] Monitoring & Diagnosis
"Before we can optimize context, we need to measure it. Watch for these warning signs: Claude asking about things you just explained, slower response times, or the context bar showing mostly red.

The context bar is your dashboard - if it's consistently over 70% full, you're definitely losing efficiency. Use `/memory` to see what's loaded, and `/history` to review the conversation buildup.

Get into the habit of checking context like you check your phone's battery. A quick glance can tell you whether it's time for a reset."

### [4:00-6:30] Core Strategies
"Here are three foundational strategies that will solve 80% of your context problems:

First, use `/clear` between unrelated tasks. This is your most powerful tool. Switching from bug fix to feature development? `/clear`. Moving from frontend to backend? `/clear`. The cost of losing a little context is nothing compared to the cost of confusion.

Second, use `/compact` with specific instructions when you want to preserve some context. Instead of just `/compact`, try `/compact Focus on the API authentication issue`. This tells Claude what matters and what can be discarded.

Third, use subagents for anything that involves reading multiple files for research. Send a subagent to investigate the payment system, get back a 200-word summary, and keep your main context clean."

### [6:30-8:30] Advanced Patterns
"For complex work, you can combine these strategies into powerful workflows. Context partitioning lets you split large tasks across multiple subagents, each working with optimal context size.

Imagine refactoring a large service layer. You could have one subagent analyze the current implementation, another design the new architecture, a third plan the migration, and you orchestrate the whole thing. Each subagent works efficiently, and your main context stays clean.

This pattern scales beautifully. You can run multiple subagents in parallel, then synthesize their results. It's like having a team of specialists working for you."

### [8:30-10:30] Live Demo
"Let's see this in action. I'm starting with a conversation that's already at 8.5k tokens - you can see it's mostly red. This happened through a typical development session: some API changes, a bug fix, test failures, configuration updates.

First, I'll check what's loaded with `/memory`. Then I'll use `/compact Focus on the API authentication bug` to strip away everything except what matters for the current task. Watch the context bar drop to just 3.2k tokens.

Now I'll delegate the investigation to a subagent: 'Use a subagent to find similar authentication bugs in our codebase history.' The subagent will read through git history, find patterns, but return only a concise summary.

Finally, with clean context and focused research, I'll have Claude implement the fix. Watch how much faster and more accurate this approach is compared to slogging through with bloated context."

### [10:30-11:30] Common Pitfalls
"Let me show you the three most common context mistakes I see:

The kitchen sink session: starting to fix a bug, then adding a feature, then refactoring, then writing docs, all in one conversation. Solution: `/clear` between each major task type.

The correction loop: Claude makes a mistake, you correct it, it makes the same mistake, you correct again. After two failed corrections, the context is polluted with failed approaches. Solution: `/clear` and restart with a better prompt.

Analysis paralysis: Claude tries to be thorough by reading everything, but fills context with irrelevant details. Solution: scope investigations narrowly and use subagents."

### [11:30-12:00] Conclusion
"Master these context management techniques and you'll transform your Claude Code experience. The difference between working with clean, focused context versus bloated, confused context is night and day.

Remember: context is your most limited resource. Strategic resets beat slogging through. Delegate research, don't accumulate. And continuously measure and optimize.

In our next module, we'll build on this foundation with verification strategies that ensure Claude's work is always correct. For now, practice these context techniques with the exercises, and I'll see you in Module 02."

---

## 📝 Exercise Details

### Exercise 01-1: Context Cleanup Challenge
**Objective**: Transform a bloated conversation into an efficient one

**Scenario**: You're given a conversation log showing a typical development session that has grown to 12k tokens. The conversation covers:
- Initial feature request
- Database schema investigation
- API endpoint design
- Bug fix attempt
- Test failures
- Documentation updates

**Tasks**:
1. Identify the 3 main task types in this conversation
2. Plan where `/clear` should have been used
3. Design a `/compact` instruction that preserves critical information
4. Rewrite the conversation flow using optimal context management

**Success Criteria**:
- No single segment exceeds 4k tokens
- Critical context is preserved across task transitions
- Demonstrate understanding of when to use each strategy

**Files**:
- `exercise/bloated-conversation.md` - Starting conversation
- `exercise/context-analysis.md` - Your analysis document
- `exercise/optimized-workflow.md` - Your improved conversation

---

### Exercise 01-2: Subagent Research Delegation  
**Objective**: Build and use a research subagent

**Scenario**: Your team needs to understand how your authentication system works before making changes. The system spans 15+ files across multiple directories.

**Tasks**:
1. Create a research subagent in `.claude/agents/auth-researcher.md`
2. Configure it with appropriate tools and constraints
3. Test the subagent by having it investigate the auth system
4. Compare the subagent's output with manual investigation
5. Measure context savings

**Subagent Requirements**:
- Name: `auth-researcher`
- Tools: Read, Grep, Glob, Bash
- Focus: Return concise findings about authentication flow
- Security: Should not expose sensitive token patterns

**Success Criteria**:
- Subagent returns findings in under 300 tokens
- Main context stays under 2k tokens during investigation
- Findings are accurate and actionable

---

### Exercise 01-3: Token Budget Management
**Objective**: Maintain conversations within specific token limits

**Scenario**: You're working on a project with strict token budgets:
- Simple tasks: <2k tokens
- Medium tasks: <4k tokens  
- Complex tasks: <6k tokens

**Tasks**:
1. Implement CLAUDE.md rules for automatic compaction
2. Create token monitoring strategies
3. Practice with three scenarios of different complexity
4. Document your personal context optimization techniques

**Scenarios**:
- **Simple**: Add a new validation rule to existing form
- **Medium**: Refactor a service method with 3 dependencies
- **Complex**: Add OAuth integration to existing auth system

**Success Criteria**:
- All scenarios completed within token budgets
- CLAUDE.md rules are effective and non-intrusive
- Can consistently maintain context targets in real work

---

## 📚 Additional Resources

### Documentation Links
- [Memory Management Guide](https://code.claude.com/docs/en/memory)
- [Context Window Documentation](https://code.claude.com/docs/en/how-claude-code-works#context)
- [Subagents Reference](https://code.claude.com/docs/en/sub-agents)

### Tools & Commands
```bash
# Essential context commands
/clear           # Reset conversation
/compact <msg>   # Summarize with focus
/memory          # Show loaded memories
/history         # Review conversation
```

### Community Resources
- Discord #context-optimization channel
- Community examples of context-efficient workflows
- Shared CLAUDE.md compaction rules

### Quick Reference Card

| Situation | Strategy | Command |
|------------|------------|----------|
| Switch task types | Fresh start | `/clear` |
| Keep some context | Focused summary | `/compact Focus on X` |
| Need research | Delegate to subagent | "Use subagent to investigate Y" |
| Bloated context | Emergency cleanup | `/compact Current task only` |
| Check usage | Monitor health | `/memory` |

---

## ✅ Completion Checklist

- [ ] Watched all video content
- [ ] Completed Exercise 01-1 (Context Cleanup)
- [ ] Completed Exercise 01-2 (Subagent Delegation)  
- [ ] Completed Exercise 01-3 (Token Budgeting)
- [ ] Applied techniques to real project
- [ ] Documented personal context optimization rules
- [ ] Shared findings with team

**Ready for Module 02?** Ensure you can consistently keep conversations under 5k tokens before proceeding.