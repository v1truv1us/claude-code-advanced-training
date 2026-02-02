# Exercise 01-1: Context Cleanup Challenge

## 🎯 Objective
Transform a bloated, inefficient conversation into a clean, optimized workflow using context management strategies.

## 📋 Scenario

You've inherited this conversation log from a colleague who was struggling with Claude Code. The conversation covers multiple tasks and has grown to over 12k tokens, causing Claude to become confused and inefficient.

**Conversation Overview:**
- Started with adding a user profile feature
- Investigated database schema for user data
- Designed API endpoints for profile management
- Encountered a bug with avatar uploads
- Attempted to fix the bug multiple times
- Added test cases that kept failing
- Updated documentation
- All in one continuous session

## 🔍 Your Task

### Part 1: Analysis (30 minutes)
1. **Read the bloated conversation** in `bloated-conversation.md`
2. **Identify distinct task types** (feature development, investigation, bug fixing, testing, documentation)
3. **Mark transition points** where context strategy should have changed
4. **Calculate estimated token usage** at each major point

### Part 2: Redesign (45 minutes)
1. **Plan where `/clear` should have been used** between task types
2. **Design `/compact` instructions** for preserving critical context
3. **Identify opportunities for subagent delegation**
4. **Create a new conversation flow** that stays under 4k tokens per segment

### Part 3: Implementation (30 minutes)
1. **Write optimized conversation** in `optimized-workflow.md`
2. **Include context management decisions** as comments
3. **Show before/after token estimates** for each segment
4. **Document your reasoning** in `context-analysis.md`

## 📁 Files

### Starting Files
- `starter/bloated-conversation.md` - The problematic conversation to analyze
- `starter/context-analysis-template.md` - Template for your analysis
- `starter/optimized-workflow-template.md` - Template for improved workflow

### Deliverables
- `context-analysis.md` - Your complete analysis with recommendations
- `optimized-workflow.md` - Your redesigned conversation
- `token-comparison.md` - Before/after token usage comparison

## 🎯 Success Criteria

### Minimum Requirements
- [ ] Correctly identify all task type transitions
- [ ] Place `/clear` commands at optimal points
- [ ] Design effective `/compact` instructions
- [ ] Keep each conversation segment under 4k tokens
- [ ] Show measurable context reduction (target: 60% reduction)

### Excellence Criteria
- [ ] Demonstrate advanced patterns (subagent delegation, context partitioning)
- [ ] Include specific CLAUDE.md rules to prevent future bloat
- [ ] Provide token estimation methodology
- [ ] Create reusable context management guidelines

## 🚀 Getting Started

```bash
# Navigate to exercise directory
cd claude-code-advanced-training/modules/01-context-window-mastery/exercise

# Examine the bloated conversation
cat starter/bloated-conversation.md

# Create your analysis file
cp starter/context-analysis-template.md context-analysis.md

# Start your analysis
```

## 📊 Expected Deliverables Structure

### context-analysis.md
```markdown
# Context Analysis Report

## Task Type Identification
1. Feature Development (lines 10-45)
2. Database Investigation (lines 46-78)
...etc

## Transition Points
- Line 45: Feature → Investigation
- Line 78: Investigation → Bug Fix
...etc

## Token Estimates
- Initial segment: ~2.1k tokens
- After investigation: ~5.8k tokens
...etc

## Optimization Strategy
1. Where to use /clear
2. /compact instructions
3. Subagent opportunities
```

### optimized-workflow.md
```markdown
# Optimized Conversation Workflow

## Segment 1: Feature Planning (2.1k tokens)
User: /clear
User: "I want to add user profile management..."

## Segment 2: Database Research (2.8k tokens)
User: /clear  
User: "Use subagent to investigate user schema..."
...etc
```

## 💡 Tips for Success

1. **Look for topic changes** - When the conversation shifts from one major topic to another, that's a `/clear` opportunity
2. **Identify research phases** - Any time Claude reads multiple files just to understand something, that's a subagent task
3. **Preserve the right context** - Use `/compact` to keep findings from research while discarding the investigation process
4. **Measure, don't guess** - Count lines, estimate tokens roughly (100 chars ≈ 25 tokens)

## 🔍 Solution Approach

When you're ready to check your work, the solution demonstrates:
- Optimal placement of 4 `/clear` commands instead of 0
- Two strategic `/compact` operations  
- Three subagent delegation opportunities
- Token reduction from 12.4k to 4.1k tokens (67% savings)

## ✅ Completion Checklist

- [ ] Analyzed bloated conversation completely
- [ ] Identified all task type transitions
- [ ] Designed strategic `/clear` placement
- [ ] Created effective `/compact` instructions
- [ ] Optimized conversation workflow
- [ ] Documented token savings
- [ ] Wrote actionable guidelines for future sessions

**Time spent**: ____ minutes  
**Token reduction achieved**: ____%  
**Ready for**: Exercise 01-2