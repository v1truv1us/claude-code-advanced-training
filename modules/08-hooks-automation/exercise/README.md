# Module 08 Exercise: Automated Quality Gates

## 🎯 Objective
Build a Claude Code **hooks-based quality gate** system that enforces team standards during Claude’s workflow: prevent obvious secrets from being written, and automatically run checks after edits.

## 📋 Prerequisites
- Completed Modules 1-7
- Familiarity with JSON (`settings.json`) configuration
- Familiarity with running tests/lint (any stack)

## 🏗️ Exercise Structure

### Part 1: Block risky writes (25 min)
Build a **PreToolUse** hook that:
- Inspects pending `Write` / `Edit` tool usage (via stdin JSON)
- Detects common secret patterns (API keys, tokens, passwords)
- **Blocks** the action when a likely secret is detected (exit code `2`)
- Provides a clear, actionable error message

### Part 2: Auto-run checks after edits (25 min)
Build a **PostToolUse** hook (matcher `Edit|Write`) that:
- Extracts the edited file path from stdin JSON
- Runs a fast quality command (examples: `npm test -s`, `pnpm lint`, `ruff`, etc.)
- Emits results to stdout/stderr so Claude can react

### Part 3: Add filtering & performance (20 min)
Enhance with:
- Path filtering (only run on relevant files)
- Fast-fail on obvious issues
- Optional caching (hash file → skip repeat checks)
- Clear logging so teams can debug hook behavior

## 🚀 Success Criteria

### Functional Requirements
✅ Pre-save hook blocks files with secrets  
✅ Pre-commit hook runs tests and checks coverage  
✅ Clear error messages with file/line information  
✅ Suggestions for fixing issues  
✅ Hooks complete in under 10 seconds  

### Code Quality
✅ Hooks block correctly using exit code `2` (doc behavior)  
✅ Scripts are well-documented  
✅ Proper error handling with fallbacks  
✅ Performance optimized with caching/filtering  

## 📁 Starter Files

See `starter/` directory for:
- `hooks/` - Starter hook configurations
- `scripts/` - Partial hook script implementations
- `sample-code/` - Files to test hooks with
- `tests/` - Sample test files

## 🔧 Implementation Tips

### Secret Detection Pattern
```typescript
const secretPatterns = [
  { name: 'AWS Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Password', regex: /password\s*=\s*['"][^'"]{8,}['"]/i },
  { name: 'API Key', regex: /api[_-]?key\s*=\s*['"][^'"]{16,}['"]/i }
];

for (const { name, regex } of patterns) {
  const match = content.match(regex);
  if (match) {
    errors.push(`Line ${getLineNumber(content, match.index)}: ${name} detected`);
  }
}
```

### Performance Optimization
```typescript
// Cache results by file hash
const cache = new Map();

async function cachedValidation(file: string) {
  const hash = await getFileHash(file);
  if (cache.has(hash)) return cache.get(hash);
  
  const result = await validateFile(file);
  cache.set(hash, result);
  return result;
}
```

### Parallel Execution
```typescript
// Run independent checks in parallel
const [secretResult, testResult, coverageResult] = await Promise.all([
  checkSecrets(files),
  runTests(),
  checkCoverage()
]);
```

## 🎓 Learning Outcomes

After completing this exercise, you'll understand:
- How to design hooks that enforce standards
- Pattern matching for secret detection
- Test and coverage integration
- Performance optimization strategies
- Error handling in automated systems

## 🆘 Common Pitfalls

1. **Too many patterns** - Start with most common secrets
2. **False positives** - Test patterns on real code
3. **Slow execution** - Use caching and incremental checks
4. **Poor error messages** - Always explain how to fix issues
5. **No fallbacks** - Handle validation tool failures gracefully

## ✅ Checklist

- [ ] Created pre-save hook that detects secrets
- [ ] Added at least 5 secret patterns (AWS, password, API key, etc.)
- [ ] Pre-save hook includes line numbers in errors
- [ ] Created pre-commit hook that runs tests
- [ ] Pre-commit hook verifies 80% coverage threshold
- [ ] Added file filtering (only check relevant files)
- [ ] Implemented incremental checking (only changed files)
- [ ] Added performance logging
- [ ] Tested with sample files in starter/sample-code/
- [ ] All hooks complete in under 10 seconds

## 📝 Submission

Submit:
1. Your `settings.json` (or snippet) showing the `hooks` block
2. Hook script implementations
3. Example output showing a blocked write and a successful post-edit check
4. Performance metrics (execution time)
5. Brief writeup of design decisions

Good luck! 🚀
