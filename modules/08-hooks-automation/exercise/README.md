# Module 08 Exercise: Automated Quality Gates

## 🎯 Objective
Build a complete pre-commit hook system that enforces team standards: no secrets, passing tests, and code coverage thresholds.

## 📋 Prerequisites
- Completed Modules 1-7
- Understanding of YAML configuration
- Familiarity with testing frameworks

## 🏗️ Exercise Structure

### Part 1: Create Pre-Save Secret Detection Hook (25 min)
Build a hook that:
- Scans files before saving
- Detects common secret patterns (API keys, passwords, tokens)
- Blocks save if secrets detected
- Provides clear error messages with line numbers

### Part 2: Create Pre-Commit Test Runner (25 min)
Build a hook that:
- Runs test suite before commits
- Verifies all tests pass
- Checks code coverage meets threshold (80%)
- Blocks commit if tests fail or coverage is low

### Part 3: Add Smart Filtering & Performance (20 min)
Enhance with:
- File pattern filtering (only check relevant files)
- Incremental checking (only changed files)
- Parallel execution for speed
- Caching for repeated validations

## 🚀 Success Criteria

### Functional Requirements
✅ Pre-save hook blocks files with secrets  
✅ Pre-commit hook runs tests and checks coverage  
✅ Clear error messages with file/line information  
✅ Suggestions for fixing issues  
✅ Hooks complete in under 10 seconds  

### Code Quality
✅ Hooks use fail_action: block appropriately  
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
1. Your hook YAML configurations
2. Hook script implementations
3. Test results showing hooks catching issues
4. Performance metrics (execution time)
5. Brief writeup of design decisions

Good luck! 🚀
