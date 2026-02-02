# Module 08: Hooks & Automation

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 08: Hooks & Automation**
*Event-Driven Quality Gates and Automated Workflows*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Understand the hooks architecture and event system
- Configure pre-commit and pre-save hooks for quality gates
- Build automated workflows that enforce team standards
- Implement custom hooks for domain-specific validation
- Debug hook failures and handle edge cases
- Integrate hooks into CI/CD pipelines

### Slide 3: What Are Hooks?

**Definition**
Hooks are event-driven automation scripts that execute at specific points in your workflow - before saving files, before committing code, or on other custom triggers.

**Event Lifecycle**
```
Developer Action → Hook Triggered → Validation/Automation → Pass/Fail → Continue/Block
```

**Types of Hooks**
1. **Pre-Save Hooks** - Validate files before they're written
2. **Pre-Commit Hooks** - Check code quality before commits  
3. **Custom Triggers** - Domain-specific events
4. **Post-Action Hooks** - Notifications, logging, cleanup

**Why Hooks Matter**
- Enforce standards automatically (no human forgetting)
- Catch issues before they enter codebase
- Reduce code review burden
- Ensure consistency across team
- Enable "shift-left" testing

### Slide 4: Hook Architecture

**How Hooks Work**
```yaml
# .claude/hooks/pre-commit.yaml
hook:
  name: pre-commit
  trigger: commit  # Event that triggers hook
  script: validate-commit.ts  # Script to execute
  fail_action: block  # block | warn | log
  timeout: 30000  # Maximum execution time
```

**Hook Execution Flow**
```
1. Developer runs `git commit`
2. Claude detects commit event
3. Loads matching hook configurations
4. Executes hook scripts in sequence
5. Collects results from all hooks
6. If any hook fails with 'block' → abort commit
7. If all pass or only warnings → proceed
```

**Key Design Principles**
- **Deterministic**: Same input always produces same result
- **Fast**: Must complete quickly (target < 5 seconds)
- **Focused**: One hook = one responsibility
- **Isolated**: Hooks don't affect each other
- **Informative**: Clear error messages on failure

### Slide 5: Pre-Save Hooks

**Use Cases**
- Validate file syntax before saving
- Check for secrets accidentally being saved
- Ensure consistent formatting
- Validate file naming conventions
- Check file size limits

**Configuration Example**
```yaml
# .claude/hooks/pre-save.yaml
name: pre-save-validation
description: Validates files before they're saved
trigger: save
files:
  - "*.ts"
  - "*.tsx" 
  - "*.js"
exclude:
  - "node_modules/**"
  - "dist/**"
script: validate-file.ts
fail_action: block
timeout: 10000
---

# Script content below
Check for:
- Syntax errors in TypeScript/JavaScript
- Hardcoded secrets/tokens
- File size > 100KB
- Invalid characters in filenames
```

**Implementation Example**
```typescript
// .claude/hooks/scripts/validate-file.ts
export default async function(filePath: string, content: string) {
  const errors: string[] = [];
  
  // Check 1: File size
  if (content.length > 100000) {
    errors.push(`File exceeds 100KB limit: ${filePath}`);
  }
  
  // Check 2: Secrets
  const secretPatterns = [
    /password\s*=\s*['"][^'"]+['"]/i,
    /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
    /token\s*=\s*['"][^'"]+['"]/i
  ];
  
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      errors.push(`Potential secret detected in ${filePath}`);
      break;
    }
  }
  
  // Check 3: Syntax (for TypeScript)
  if (filePath.endsWith('.ts')) {
    try {
      // TypeScript syntax validation
      require('typescript').createSourceFile(
        filePath, content, require('typescript').ScriptTarget.Latest
      );
    } catch (e) {
      errors.push(`Syntax error in ${filePath}: ${e.message}`);
    }
  }
  
  return {
    success: errors.length === 0,
    errors,
    warnings: []
  };
}
```

### Slide 6: Pre-Commit Hooks

**Use Cases**
- Run test suite before commit
- Check code coverage thresholds
- Validate commit message format
- Run linting and formatting
- Check for debugging code (console.log, etc.)
- Validate branch naming conventions

**Configuration Example**
```yaml
# .claude/hooks/pre-commit.yaml
name: pre-commit-suite
description: Comprehensive checks before commits
trigger: commit
script: pre-commit-suite.ts
parallel: true  # Run checks in parallel for speed
fail_action: block
timeout: 60000
stages:
  - lint
  - test  
  - security
  - coverage
```

**Multi-Stage Hook Pattern**
```typescript
// .claude/hooks/scripts/pre-commit-suite.ts
export default async function(commitInfo: CommitInfo) {
  const results: StageResult[] = [];
  
  // Stage 1: Linting
  results.push(await runLinting());
  
  // Stage 2: Tests (parallel execution)
  results.push(await runTests());
  
  // Stage 3: Security scan
  results.push(await runSecurityCheck());
  
  // Stage 4: Coverage
  results.push(await checkCoverage());
  
  // Aggregate results
  const failedStages = results.filter(r => !r.success);
  
  return {
    success: failedStages.length === 0,
    errors: failedStages.flatMap(s => s.errors),
    warnings: results.flatMap(s => s.warnings),
    details: results
  };
}

async function runLinting(): Promise<StageResult> {
  // Run ESLint or similar
  return { stage: 'lint', success: true, errors: [], warnings: [] };
}

async function runTests(): Promise<StageResult> {
  // Run test suite
  return { stage: 'test', success: true, errors: [], warnings: [] };
}
```

### Slide 7: Custom Hook Triggers

**Beyond Save and Commit**
```yaml
# Custom trigger examples

# On branch creation
name: branch-standards
trigger: branch_create
script: validate-branch-name.ts

# Before push
name: pre-push
trigger: push
script: integration-tests.ts

# On PR open
name: pr-validation
trigger: pull_request
script: full-validation.ts

# Scheduled (cron)
name: nightly-audit
trigger: schedule
cron: "0 2 * * *"  # 2 AM daily
script: security-audit.ts
```

**Custom Trigger Implementation**
```typescript
// Trigger detection in hook system
interface TriggerEvent {
  type: 'save' | 'commit' | 'push' | 'branch_create' | 'pull_request' | 'schedule';
  data: any;
  timestamp: string;
}

async function onEvent(event: TriggerEvent) {
  // Load all hooks matching this trigger type
  const hooks = await loadHooksForTrigger(event.type);
  
  // Execute each hook
  for (const hook of hooks) {
    const result = await executeHook(hook, event);
    
    if (!result.success && hook.fail_action === 'block') {
      throw new Error(`Hook ${hook.name} failed: ${result.errors.join(', ')}`);
    }
  }
}
```

### Slide 8: Hook Scripts Deep Dive

**Script Structure**
```typescript
// Standard hook script structure
export default async function(eventData: any, context: HookContext) {
  // 1. Validation/Processing
  // 2. Return structured result
  
  return {
    success: boolean,
    errors: string[],      // Blocking issues
    warnings: string[],    // Non-blocking issues
    data?: any,           // Optional additional data
    metrics?: {           // Performance metrics
      duration: number,
      files_processed: number
    }
  };
}
```

**Context Object**
```typescript
interface HookContext {
  // Information about the trigger event
  event: {
    type: string;
    timestamp: string;
    data: any;
  };
  
  // Repository state
  repo: {
    root: string;
    branch: string;
    commit_hash?: string;
  };
  
  // Available tools
  tools: {
    read: (path: string) => Promise<string>;
    write: (path: string, content: string) => Promise<void>;
    exec: (command: string) => Promise<{ stdout: string; stderr: string }>;
  };
}
```

**Best Practices for Scripts**
1. **Fail Fast**: Check most likely issues first
2. **Clear Messages**: Explain what's wrong and how to fix
3. **Include Line Numbers**: When relevant
4. **Suggest Fixes**: Provide auto-fix commands when possible
5. **Log Timing**: Track performance for optimization

### Slide 9: Error Handling & Fail Actions

**Fail Action Types**
```yaml
# Block - Prevent the action entirely
fail_action: block
# Use for: Security issues, broken tests, syntax errors

# Warn - Allow but notify
fail_action: warn  
# Use for: Style issues, minor coverage gaps, TODO comments

# Log - Silent recording
fail_action: log
# Use for: Metrics collection, audit trails
```

**Graceful Failure Pattern**
```typescript
async function validateWithFallback(primary: Function, fallback: Function) {
  try {
    return await primary();
  } catch (error) {
    console.warn(`Primary validation failed: ${error.message}`);
    console.log('Attempting fallback validation...');
    
    try {
      return await fallback();
    } catch (fallbackError) {
      // If both fail, decide based on criticality
      return {
        success: false,
        errors: [`Validation failed: ${fallbackError.message}`],
        critical: true
      };
    }
  }
}
```

**Timeout Handling**
```yaml
# Timeout configuration
hook:
  timeout: 30000  # 30 seconds
  on_timeout: fail  # fail | warn | ignore
  timeout_message: "Hook exceeded 30s timeout"
```

### Slide 10: Performance Optimization

**Fast Hook Principles**
```
Target: < 3 seconds for pre-save
Target: < 10 seconds for pre-commit
Target: < 30 seconds for pre-push
```

**Optimization Strategies**

1. **Incremental Checks**
```typescript
// Only check changed files
async function incrementalValidation(changedFiles: string[]) {
  // Instead of checking entire codebase
  const filesToCheck = await getChangedFilesSinceLastCommit();
  
  for (const file of filesToCheck) {
    await validateFile(file);
  }
}
```

2. **Parallel Execution**
```typescript
// Run independent checks in parallel
const [lintResult, testResult, securityResult] = await Promise.all([
  runLinter(),
  runTests(),
  runSecurityScan()
]);
```

3. **Caching**
```typescript
// Cache expensive operations
const cache = new Map();

async function cachedValidation(file: string) {
  const hash = await getFileHash(file);
  
  if (cache.has(hash)) {
    return cache.get(hash);  // Instant return
  }
  
  const result = await expensiveValidation(file);
  cache.set(hash, result);
  return result;
}
```

4. **Smart Filtering**
```yaml
# Only run hooks on relevant files
files:
  - "*.ts"  # Only TypeScript files
exclude:
  - "**/*.test.ts"  # Skip test files
  - "node_modules/**"
```

### Slide 11: Enterprise Integration

**CI/CD Pipeline Integration**
```yaml
# .github/workflows/claude-hooks.yml
name: Claude Hooks
on: [push, pull_request]

jobs:
  hooks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Claude Pre-Commit Hooks
        run: |
          claude hooks run --trigger commit --headless
          
      - name: Run Extended Validation
        run: |
          claude hooks run --trigger ci --headless
```

**Team Standards Enforcement**
```yaml
# .claude/hooks/team-standards.yaml
name: team-standards
description: Enforces team coding standards
trigger: commit
required: true  # Cannot be skipped by developer
script: team-standards.ts
---

Checks:
- JIRA ticket reference in commit message
- Branch naming convention (feature/ABC-123-description)
- No console.log statements in production code
- All functions have JSDoc comments
- Test coverage > 80%
```

**Audit & Compliance**
```yaml
# Audit logging hook
name: compliance-audit
trigger: commit
fail_action: log
script: audit-logger.ts
---

Logs:
- Who committed
- What files changed
- Hook results
- Any policy violations (even if allowed)
```

### Slide 12: Common Hook Patterns

**Secret Detection Hook**
```typescript
// Prevents secrets from being committed
export default async function(event: CommitEvent) {
  const secrets = [];
  
  for (const file of event.changedFiles) {
    const content = await readFile(file);
    
    // Check for common secret patterns
    const patterns = [
      { name: 'AWS Key', regex: /AKIA[0-9A-Z]{16}/ },
      { name: 'Private Key', regex: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
      { name: 'Password', regex: /password\s*=\s*['"][^'"]{8,}['"]/i },
      { name: 'API Key', regex: /api[_-]?key\s*=\s*['"][^'"]{16,}['"]/i }
    ];
    
    for (const { name, regex } of patterns) {
      if (regex.test(content)) {
        secrets.push(`${file}: Potential ${name} detected`);
      }
    }
  }
  
  return {
    success: secrets.length === 0,
    errors: secrets,
    critical: true  // Always block secrets
  };
}
```

**Test Coverage Hook**
```typescript
// Ensures minimum test coverage
export default async function() {
  const coverage = await getTestCoverage();
  const threshold = 80;  // 80% minimum
  
  if (coverage < threshold) {
    return {
      success: false,
      errors: [`Test coverage ${coverage}% is below ${threshold}% threshold`],
      suggestions: [
        'Run: npm run test:coverage',
        'Add tests for uncovered functions',
        'Check coverage report in coverage/'
      ]
    };
  }
  
  return { success: true, errors: [], warnings: [] };
}
```

### Slide 13: Debugging Hooks

**Logging Best Practices**
```typescript
export default async function(event: any, context: HookContext) {
  const startTime = Date.now();
  
  console.log(`[Hook] Starting validation for ${event.files.length} files`);
  
  for (const file of event.files) {
    console.log(`[Hook] Checking: ${file}`);
    const result = await validateFile(file);
    
    if (!result.success) {
      console.error(`[Hook] Failed: ${file} - ${result.errors.join(', ')}`);
    }
  }
  
  const duration = Date.now() - startTime;
  console.log(`[Hook] Completed in ${duration}ms`);
  
  return result;
}
```

**Testing Hooks Locally**
```bash
# Run specific hook manually
claude hooks run pre-commit --manual

# Test with specific file
claude hooks test pre-save --file ./src/example.ts

# Debug mode with verbose output
claude hooks run --debug --verbose
```

**Common Issues**
1. **Hook not triggering** - Check trigger type and file patterns
2. **Timeout errors** - Increase timeout or optimize script
3. **False positives** - Refine validation logic
4. **Performance issues** - Use incremental checks and caching

### Slide 14: Summary & Key Takeaways

**Core Principles**
1. **Automate Everything** - If it can be automated, make it a hook
2. **Fail Fast** - Check most critical issues first
3. **Clear Feedback** - Explain failures and how to fix them
4. **Performance Matters** - Keep hooks under 10 seconds
5. **Gradual Adoption** - Start with warnings, then block

**Impact Metrics**
- 100% enforcement of team standards
- 70% reduction in CI failures
- 50% faster code reviews
- Near-zero secrets in commits

**Implementation Roadmap**
1. Week 1: Deploy pre-save hooks (syntax, secrets)
2. Week 2: Add pre-commit hooks (tests, lint)
3. Week 3: Implement custom triggers
4. Week 4: CI/CD integration and team rollout

---
*Video Duration: 12 minutes*
