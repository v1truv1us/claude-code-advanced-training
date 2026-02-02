# Module 07 Exercise: Multi-Agent Code Review Pipeline

## 🎯 Objective
Build a parallel code review system using subagents that simultaneously checks for security, performance, and test coverage issues.

## 📋 Prerequisites
- Completed Modules 1-6
- Understanding of task() function
- Familiarity with YAML configuration

## 🏗️ Exercise Structure

### Part 1: Create Subagent Configurations (30 min)
Create three specialized subagents in `.claude/subagents/`:

1. **security-scanner.yaml** - Read-only security analysis
2. **performance-expert.yaml** - Performance bottleneck detection  
3. **test-coverage-checker.yaml** - Test coverage verification

### Part 2: Build the Pipeline (30 min)
Create `review-pipeline.ts` that:
- Takes a file path as input
- Spawns all three subagents in parallel
- Aggregates results into unified report
- Handles failures gracefully

### Part 3: Add Error Handling (20 min)
Implement:
- Retry logic for failed subagents
- Timeout handling
- Fallback to basic checks if subagents fail

## 🚀 Success Criteria

### Functional Requirements
✅ All three subagents execute in parallel  
✅ Results aggregated into structured report  
✅ Pipeline completes in under 60 seconds  
✅ Handles partial failures (1-2 subagents down)  
✅ Logs execution time and results  

### Code Quality
✅ Subagents have minimal tool permissions  
✅ Proper error handling with try/catch  
✅ Clean separation of concerns  
✅ Comments explaining subagent selection rationale  

## 📁 Starter Files

See `starter/` directory for:
- `subagent-templates/` - Template configurations
- `sample-code/` - Files to review
- `pipeline-starter.ts` - Partial implementation

## 🔧 Implementation Tips

### Subagent Tool Selection
```yaml
# Security scanner should be READ-ONLY
tools: [read, grep]

# Performance expert needs to analyze code structure
tools: [read, grep, task]

# Test checker needs to find and read test files
tools: [read, glob, grep]
```

### Parallel Execution Pattern
```typescript
// Use Promise.all for true parallelism
const results = await Promise.all([
  task({ subagent_type: "security-scanner", ... }),
  task({ subagent_type: "performance-expert", ... }),
  task({ subagent_type: "test-coverage-checker", ... })
]);
```

### Error Handling Strategy
```typescript
// Wrap each subagent call in try/catch
try {
  return await task({ ... });
} catch (error) {
  console.error(`Subagent failed: ${error.message}`);
  return { status: 'failed', error: error.message };
}
```

## 🎓 Learning Outcomes

After completing this exercise, you'll understand:
- How to design specialized subagents for specific tasks
- Parallel execution patterns with Promise.all
- Error handling in distributed agent systems
- Tool restriction for security
- Result aggregation strategies

## 🆘 Common Pitfalls

1. **Over-permissioning subagents** - Start with minimal tools
2. **Not handling timeouts** - Always set timeout limits
3. **Ignoring subagent failures** - Always check return values
4. **Sharing context when not needed** - Use fork context by default

## ✅ Checklist

- [ ] Created security-scanner.yaml with proper restrictions
- [ ] Created performance-expert.yaml with analysis focus
- [ ] Created test-coverage-checker.yaml with test file discovery
- [ ] Implemented parallel execution in review-pipeline.ts
- [ ] Added error handling for each subagent
- [ ] Created result aggregation function
- [ ] Added logging for debugging
- [ ] Tested with sample files in starter/sample-code/
- [ ] Verified all subagents complete in under 60 seconds
- [ ] Handled partial failure scenarios

## 📝 Submission

Submit:
1. Your three subagent YAML files
2. review-pipeline.ts implementation
3. Output from running on sample files
4. Brief writeup of what you learned about subagent design

Good luck! 🚀
