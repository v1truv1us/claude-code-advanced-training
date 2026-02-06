import test from 'node:test';
import assert from 'node:assert/strict';
import { createComment, replyToComment } from '../src/commentService.js';

test('createComment creates comment with valid text', () => {
  const { id, state } = createComment({ text: 'hello', userId: 'u1' });
  assert.ok(id);
  assert.equal(state.comments.get(id).text, 'hello');
});

test('createComment rejects comments over character limit', () => {
  assert.throws(() => createComment({ text: 'a'.repeat(1001), userId: 'u1' }), /TEXT_TOO_LONG/);
});

test('replyToComment creates threaded comments correctly', () => {
  const a = createComment({ text: 'parent', userId: 'u1' });
  const b = replyToComment(a.id, { text: 'child', userId: 'u2' }, a.state);
  assert.equal(b.state.comments.get(b.id).parentId, a.id);
});
