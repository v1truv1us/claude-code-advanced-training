# Module 07: Subagents & Delegation

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 07: Subagents & Delegation**
*Scale Through Specialized Workers and Context Isolation*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Understand subagent architecture and delegation patterns
- Configure subagents with different tools and models
- Implement parallel processing for complex workflows
- Manage context isolation between parent and child agents
- Debug subagent interactions and failures
- Apply enterprise security patterns for subagent delegation

### Slide 3: The Subagent Paradigm

**What Are Subagents?**
```yaml
# Claude can spawn specialized child agents
Parent Agent
├── Subagent A (code reviewer)  
├── Subagent B (test generator)
├── Subagent C (security scanner)
└── Subagent D (docs writer)
```

**Core Benefits**
- **Context Isolation**: Child agents don't pollute parent context
- **Specialization**: Different tools/models for different tasks
- **Parallelization**: Multiple agents work simultaneously
- **Resilience**: Failed subagent doesn't crash parent

**When to Use Subagents**
- Complex multi-domain tasks (security + performance + testing)
- Long-running operations that need parallel execution
- Isolated workflows that shouldn't affect main context
- Tasks requiring different tool sets or model strengths

### Slide 4: Configuring Subagents

**Subagent Configuration Options**
```yaml
# .claude/subagents/code-reviewer.yaml
name: code-reviewer
description: Specialized code reviewer focused on quality and best practices
tools: [read, edit, bash, task]  # Restricted tool set
model: haiku  # Cheaper model for routine reviews
context: fork  # Isolated from parent
---
You are a senior code reviewer with 10 years of experience...
```

**Key Configuration Parameters**
| Parameter | Purpose | Example Values |
|-----------|---------|----------------|
| `tools` | Available tools (subset) | `['read', 'edit', 'bash']` |
| `model` | Model selection | `sonnet`, `haiku`, `opus` |
| `context` | Context inheritance | `fork` (isolated), `current` (shared) |
| `skills` | Inherited skills | `['typescript', 'testing']` |

**Tool Restriction Patterns**
```yaml
# Read-only reviewer (safe for untrusted code)
tools: [read, task]

# Editor with validation (can modify but not deploy)
tools: [read, edit, grep]

# Full automation (use with caution)
tools: [read, edit, bash, task, write]
```

### Slide 5: Invoking Subagents

**Direct Invocation**
```typescript
// Spawn a subagent for specific task
await task({
  description: "Review authentication code",
  prompt: `Please review src/auth/login.ts for:
    1. Security vulnerabilities  
    2. Input validation gaps
    3. Error handling issues
    
    Return findings in structured format.`,
  subagent_type: "code-reviewer"
});
```

**Parallel Invocation Pattern**
```typescript
// Launch multiple subagents simultaneously
const reviews = await Promise.all([
  task({
    description: "Security review",
    prompt: "Review for security vulnerabilities...",
    subagent_type: "security-scanner"
  }),
  task({
    description: "Performance analysis", 
    prompt: "Analyze for performance bottlenecks...",
    subagent_type: "performance-expert"
  }),
  task({
    description: "Test coverage check",
    prompt: "Verify test coverage is adequate...",
    subagent_type: "test-generator"
  })
]);

// Aggregate results
const combinedReport = aggregateReviews(reviews);
```

**Conditional Delegation**
```typescript
// Delegate based on task complexity
if (isComplexFeature(featureRequest)) {
  // Spawn specialized architecture subagent
  await task({
    description: "Architecture review",
    prompt: `Analyze ${featureRequest} for architectural implications...`,
    subagent_type: "architect-advisor"
  });
} else {
  // Handle directly
  await implementFeature(featureRequest);
}
```

### Slide 6: Context Management Strategies

**Fork Context (Recommended Default)**
```yaml
# Subagent has clean slate - no parent context pollution
context: fork
```
- Parent and child contexts are completely isolated
- Subagent can't accidentally modify parent state
- Clean slate ensures deterministic behavior
- Best for most use cases

**Current Context (Use Carefully)**
```yaml
# Subagent shares parent context
context: current  
```
- Subagent sees parent's files, variables, conversation history
- Use when subagent needs to build on parent's work
- Risk: Subagent can modify parent's state
- Use sparingly and with restricted tools

**Hybrid Pattern**
```typescript
// Pass specific context to subagent
await task({
  description: "Refactor module",
  prompt: `
    Context:
    - Module: ${modulePath}
    - Current implementation: ${readFileSync(modulePath)}
    - Requirements: ${requirements}
    
    Refactor following the requirements above.
  `,
  subagent_type: "refactoring-expert",
  context: "fork"  // Still forked for isolation
});
```

### Slide 7: Parallel Processing Patterns

**Fan-Out Pattern**
```typescript
// Distribute work across multiple subagents
async function analyzeCodebase(files: string[]) {
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(file => task({
        description: `Analyze ${file}`,
        prompt: `Analyze ${file} for code quality issues...`,
        subagent_type: "code-analyzer"
      }))
    );
    
    results.push(...batchResults);
  }
  
  return aggregateResults(results);
}
```

**Pipeline Pattern**
```typescript
// Chain subagents where output of one feeds into next
async function complexRefactor(file: string) {
  // Step 1: Analyze
  const analysis = await task({
    description: "Analyze for refactoring",
    prompt: `Analyze ${file} for refactoring opportunities...`,
    subagent_type: "code-analyzer"
  });
  
  // Step 2: Generate tests first (TDD)
  await task({
    description: "Generate tests",
    prompt: `Based on this analysis: ${analysis}, generate tests...`,
    subagent_type: "test-generator"
  });
  
  // Step 3: Refactor
  await task({
    description: "Execute refactor",
    prompt: `Refactor ${file} according to plan: ${analysis}...`,
    subagent_type: "refactoring-expert"
  });
  
  // Step 4: Verify
  return await task({
    description: "Verify refactor",
    prompt: `Verify the refactored code passes all tests...`,
    subagent_type: "code-reviewer"
  });
}
```

### Slide 8: Enterprise Security Patterns

**Principle of Least Privilege**
```yaml
# Security scanner - read-only to prevent accidents
tools: [read, grep]
---
You are a security scanner. You can only READ code, never modify it.
Focus on: SQL injection, XSS, authentication flaws, secrets exposure
```

**Approval Gates for Destructive Operations**
```typescript
// High-risk subagent requires approval
async function deployToProduction() {
  const approval = await task({
    description: "Get deployment approval",
    prompt: "Review deployment plan and return approved/rejected...",
    subagent_type: "approval-gate"
  });
  
  if (approval !== "approved") {
    throw new Error("Deployment not approved");
  }
  
  // Proceed with deployment
}
```

**Audit Logging Pattern**
```yaml
# All subagent actions logged
audit:
  log_level: detailed
  retention: 90_days
  include_context: true
```

### Slide 9: Error Handling & Resilience

**Graceful Degradation**
```typescript
async function resilientAnalysis(file: string) {
  try {
    // Try primary subagent
    return await task({
      description: "Security scan",
      prompt: `Security analysis of ${file}...`,
      subagent_type: "security-scanner",
      timeout: 30000
    });
  } catch (error) {
    // Fall back to simpler approach
    console.warn("Security scanner failed, using basic check");
    return await basicSecurityCheck(file);
  }
}
```

**Retry Logic with Exponential Backoff**
```typescript
async function retryableTask(prompt: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await task({
        description: "Retryable operation",
        prompt: prompt,
        subagent_type: "reliable-worker"
      });
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = Math.pow(2, attempt) * 1000;  // 2s, 4s, 8s
      await sleep(delay);
    }
  }
}
```

**Circuit Breaker Pattern**
```typescript
class SubagentCircuitBreaker {
  private failures = 0;
  private lastFailure: Date | null = null;
  private threshold = 5;
  private timeout = 60000; // 1 minute
  
  async invoke(prompt: string) {
    if (this.isOpen()) {
      throw new Error("Circuit breaker is open - subagent unavailable");
    }
    
    try {
      const result = await task({
        description: "Circuit breaker protected",
        prompt: prompt,
        subagent_type: "protected-service"
      });
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

### Slide 10: Debugging Subagent Interactions

**Logging Best Practices**
```typescript
// Always log subagent invocations
async function loggedTask(description: string, prompt: string) {
  console.log(`[Subagent] Starting: ${description}`);
  const startTime = Date.now();
  
  try {
    const result = await task({
      description: description,
      prompt: prompt,
      subagent_type: "worker"
    });
    
    console.log(`[Subagent] Success: ${description} (${Date.now() - startTime}ms)`);
    return result;
  } catch (error) {
    console.error(`[Subagent] Failed: ${description} - ${error.message}`);
    throw error;
  }
}
```

**Tracing Subagent Calls**
```yaml
# Enable detailed tracing
tracing:
  enabled: true
  level: verbose
  include_context: true
  include_prompts: true
```

**Common Failure Modes**
1. **Tool Not Available**: Subagent requests tool not in its allowed set
2. **Context Overflow**: Subagent hits token limit on large inputs
3. **Timeout**: Operation takes longer than expected
4. **Model Mismatch**: Wrong model selected for task complexity

### Slide 11: Common Anti-Patterns

**❌ Over-Delegating**
```typescript
// Bad: Too granular - overhead exceeds benefit
await task({ description: "Check semicolon", ... });
await task({ description: "Check indentation", ... });
await task({ description: "Check variable names", ... });
```

**✅ Right-Sized Delegation**
```typescript
// Good: Meaningful task worth the overhead
await task({ 
  description: "Code style review", 
  prompt: "Check all style issues in file...",
  ... 
});
```

**❌ Ignoring Failures**
```typescript
// Bad: Silent failure
await task({ ... });  // Ignoring return value and errors
```

**✅ Proper Error Handling**
```typescript
// Good: Explicit handling
try {
  const result = await task({ ... });
  validateResult(result);
} catch (error) {
  handleSubagentFailure(error);
}
```

**❌ Context Leakage**
```yaml
# Bad: Subagent can see parent's sensitive context
context: current
tools: [read, edit, bash]  # Can read parent's env vars!
```

**✅ Proper Isolation**
```yaml
# Good: Clean slate
tools: [read, edit]  # Minimal required tools
context: fork
```

### Slide 12: Practical Implementation Steps

**Step 1: Define Subagent Roles**
```yaml
# Create .claude/subagents/ directory with:
# - code-reviewer.yaml
# - security-scanner.yaml
# - test-generator.yaml
# - performance-expert.yaml
```

**Step 2: Start with Restricted Tools**
```yaml
# Begin with read-only, add tools as needed
tools: [read]
# Then: tools: [read, grep]
# Then: tools: [read, grep, task]
```

**Step 3: Build Up Complexity Gradually**
1. Single subagent for isolated task
2. Parallel subagents for independent work
3. Pipeline subagents for dependent workflows
4. Dynamic subagent selection based on task type

**Step 4: Monitor and Optimize**
- Track subagent success rates
- Measure context window savings
- Monitor latency and throughput
- Refine based on real usage

### Slide 13: Advanced Patterns

**Dynamic Subagent Selection**
```typescript
function selectSubagent(taskType: string) {
  const subagentMap = {
    'security': 'security-scanner',
    'performance': 'performance-expert',
    'testing': 'test-generator',
    'refactoring': 'refactoring-expert',
    'documentation': 'docs-writer'
  };
  
  return subagentMap[taskType] || 'general-purpose';
}

// Usage
await task({
  description: "Analyze task",
  prompt: `Perform ${taskType} analysis...`,
  subagent_type: selectSubagent(taskType)
});
```

**Subagent Composition**
```yaml
# Master orchestrator coordinates specialists
name: feature-implementer
description: End-to-end feature implementation coordinator
skills: [architect-advisor, code-reviewer, test-generator]
---
You coordinate multiple subagents to implement features...
```

### Slide 14: Summary & Key Takeaways

**Core Principles**
1. **Fork by Default**: Always start with isolated context
2. **Minimal Tools**: Grant only tools subagent needs
3. **Right-Size Tasks**: Delegate meaningful chunks, not micro-tasks
4. **Handle Failures**: Always plan for subagent failures
5. **Monitor Everything**: Log and trace all subagent interactions

**Performance Impact**
- 60% faster complex task completion
- 70% reduction in context window bloat
- Unlimited scalability through parallelization

**Security Benefits**
- Isolated execution prevents context leakage
- Tool restrictions limit blast radius
- Audit trails for compliance

---
*Video Duration: 12 minutes*
