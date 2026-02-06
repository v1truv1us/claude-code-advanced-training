# Exercise 02-1: TDD Workflow Implementation

## 🎯 Objective
Build a complete comment system for blog posts using pure test-driven development with Claude Code. Demonstrate the red-green-refactor cycle and maintain 100% test coverage throughout development.

## 📋 Feature Requirements

**Comment System Specifications:**
- **Comment Creation**: Users can write comments with text validation
- **Nested Replies**: Comments can have threaded replies (unlimited depth)
- **Moderation**: Automatic profanity detection and manual moderation
- **Character Limits**: Max 1000 characters per comment, 10000 for nested replies
- **Rate Limiting**: Max 5 comments per minute per user
- **Persistence**: All comments saved to database with timestamps

**Technical Requirements:**
- Input validation for text length and forbidden content
- Recursive SQL queries for nested comment threads
- Real-time profanity filtering using word lists
- Database transaction handling for concurrent comment creation
- Error handling for database constraints and edge cases

## 🔍 Phase 1: Test-First Development (60 minutes)

### Task 1: Write Failing Tests (25 minutes)
**Objective**: Create comprehensive test suite that covers all comment functionality

**Test Categories to Implement:**
```javascript
// Core comment functionality
describe('Comment Creation', () => {
  test('creates comment with valid text', async () => {
    // Test implementation
  });
  
  test('rejects comments over character limit', async () => {
    // Test boundary conditions
  });
  
  test('detects and blocks profanity', async () => {
    // Test content moderation
  });
});

// Nested reply functionality
describe('Nested Replies', () => {
  test('creates threaded comments correctly', async () => {
    // Test parent-child relationships
  });
  
  test('enforces depth limits appropriately', async () => {
    // Test recursion limits
  });
});

// Rate limiting
describe('Rate Limiting', () => {
  test('enforces 5 comments per minute limit', async () => {
    // Test rate limiting logic
  });
  
  test('resets rate limit after time window', async () => {
    // Test time-based reset
  });
});

// Edge cases
describe('Edge Cases', () => {
  test('handles empty comments gracefully', async () => {
    // Test empty input handling
  });
  
  test('handles extremely long comments', async () => {
    // Test maximum boundary
  });
  
  test('handles concurrent comment creation', async () => {
    // Test race conditions
  });
});
```

**Deliverable**: `tests/comment.test.js` with complete failing test suite

### Task 2: Implement Minimum Viable Code (20 minutes)
**Objective**: Write the simplest code that makes all tests pass

**Implementation Order:**
1. Database model and schema
2. Comment creation logic
3. Nested reply handling
4. Basic profanity filtering
5. Simple rate limiting

**Deliverable**: Working implementation that passes all tests

### Task 3: Add Edge Cases and Error Handling (15 minutes)
**Objective**: Enhance implementation with robust error handling and edge cases

**Edge Cases to Handle:**
- SQL injection protection
- Concurrent database access
- Invalid parent comment IDs
- Malformed input sanitization
- Database transaction failures
- Network timeouts

**Deliverable**: Production-ready implementation with comprehensive error handling

## 🔍 Phase 2: Refactor and Optimize (45 minutes)

### Task 4: Performance Optimization (20 minutes)
**Objective**: Optimize the comment system for performance under load

**Optimization Targets:**
- Database query optimization (indexing, query structure)
- Caching frequently accessed comments
- Efficient profanity checking (trie data structure)
- Batch processing for bulk operations
- Memory usage optimization for large threads

**Benchmarking Tests to Add:**
```javascript
describe('Performance', () => {
  test('creates 1000 comments in under 1 second', async () => {
    // Performance test
  });
  
  test('handles deep nesting efficiently', async () => {
    // Recursive performance test
  });
  
  test('profanity check completes in under 10ms', async () => {
    // Filtering performance test
  });
});
```

### Task 5: Code Quality and Documentation (25 minutes)
**Objective**: Refactor for maintainability and add comprehensive documentation

**Refactoring Goals:**
- Extract reusable utilities (validation, filtering, rate limiting)
- Improve error message clarity
- Add comprehensive JSDoc comments
- Ensure consistent naming conventions
- Modularize database operations

**Documentation Requirements:**
- README with setup instructions
- API documentation for comment endpoints
- Database schema documentation
- Performance characteristics
- Security considerations

## 📁 Files Structure (what exists in this repo)

This exercise includes a minimal runnable scaffold:

```
starter/
  package.json
  src/commentService.js
  tests/comment.test.js
solution/
  package.json
  src/commentService.js
  tests/comment.test.js
```

You can expand the scaffold (integration tests, fixtures, docs) as stretch goals, but you are not required to build a full database-backed system to complete the exercise.

## 🎯 Success Criteria

### Minimum Requirements
- [ ] All tests fail initially (red phase)
- [ ] Implementation passes all tests (green phase)
- [ ] 100% test coverage achieved
- [ ] Basic edge cases handled
- [ ] Error scenarios tested

### Excellence Criteria
- [ ] Performance benchmarks met (1000 comments/sec)
- [ ] Advanced edge cases covered (concurrent access, malformed data)
- [ ] Code is well-documented with JSDoc
- [ ] Refactored for maintainability
- [ ] Security best practices implemented
- [ ] Integration tests pass
- [ ] Performance under load meets requirements

## 💡 TDD Best Practices Applied

### 1. Test Isolation
Each test should be independent:
```javascript
// Good: Isolated test
test('creates comment with valid data', async () => {
  const result = await createComment(validData);
  expect(result.success).toBe(true);
});

// Bad: Dependent tests
test('creates comment then replies', async () => {
  const comment = await createComment(validData);
  const reply = await createReply(comment.id, replyData);
  expect(reply.success).toBe(true); // Fails if createComment fails
});
```

### 2. Clear Test Names
Test names should describe the behavior, not the implementation:
```javascript
// Good: Behavior-focused
test('rejects comments exceeding character limit', () => {
  // Clear what is being tested
});

// Bad: Implementation-focused
test('calls validation service in comment creation', () => {
  // Describes how, not what
});
```

### 3. Triple A Pattern
Arrange-Act-Assert for every test:
```javascript
// Good: Clear AAA structure
test('creates nested comment with valid parent', async () => {
  // Arrange
  const parentComment = await createTestComment();
  const newCommentData = {
    text: 'Valid reply text',
    parentId: parentComment.id
  };
  
  // Act
  const result = await createComment(newCommentData);
  
  // Assert
  expect(result.success).toBe(true);
  expect(result.data.parentId).toBe(parentComment.id);
});
```

### 4. Test-Driven Refactoring
Only refactor when tests are green:
```javascript
// Process: Write failing test for improvement, implement, refactor, keep green
test('comment creation performance is optimized', async () => {
  // Test that fails before optimization
  expect(await timeCommentCreation(largeDataSet)).toBeLessThan(1000);
});

// Now implement optimization, ensure test passes
// Continue refactoring while this test stays green
```

## 🚀 Getting Started

```bash
# Navigate to exercise directory
cd claude-code-advanced-training/modules/02-verification-strategies/exercise

# Run the starter tests (they should fail initially)
cd starter
npm test
```

Then implement the service via strict red → green → refactor, expanding the test suite as you go.

**First Command to Try:**
```bash
# Ask Claude to start TDD workflow
claude
"I need to implement a comment system using test-driven development. 
Start by writing comprehensive failing tests for comment creation, nested replies, 
rate limiting, and edge cases. The comment system should support text validation, 
profanity detection, and database persistence."
```

## 🔍 Sample Test-First Interaction

**Initial Prompt to Claude:**
```
Write a failing test for comment creation that validates:
- Text length between 1-1000 characters
- Non-empty text
- Valid UTF-8 encoding
- No profanity words
Returns success for valid input, appropriate error for invalid input.
```

**Expected Claude Response:**
```javascript
// Claude should generate:
test('validateCommentInput with valid data', () => {
  const result = validateCommentInput({
    text: 'This is a valid comment'
  });
  
  expect(result.isValid).toBe(true);
  expect(result.errors).toEqual([]);
});

test('validateCommentInput rejects empty text', () => {
  const result = validateCommentInput({
    text: ''
  });
  
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('Comment text cannot be empty');
});
```

## ✅ Validation Checklist

### Phase 1: Test-First Development
- [ ] Test suite written before implementation
- [ ] All tests initially fail (red phase)
- [ ] Minimum implementation passes all tests
- [ ] Edge cases identified and tested
- [ ] Error handling implemented correctly

### Phase 2: Refactoring and Optimization
- [ ] Performance benchmarks established
- [ ] Code refactored for maintainability
- [ ] All tests remain green during refactoring
- [ ] 100% test coverage maintained
- [ ] Documentation is comprehensive

### Phase 3: Final Verification
- [ ] Integration tests pass
- [ ] Performance requirements met
- [ ] Security best practices followed
- [ ] Code quality standards met
- [ ] Ready for production deployment

**Time Tracking:**
- Test writing: ____ minutes
- Implementation: ____ minutes
- Refactoring: ____ minutes
- Documentation: ____ minutes
- Total: ____ minutes

**Lessons Learned:**
1. [Most valuable TDD principle discovered]
2. [Most challenging edge case encountered]
3. [Biggest performance improvement achieved]
4. [Most important refactoring insight]

---

**Ready for:** Exercise 02-2 (Visual Regression Testing)