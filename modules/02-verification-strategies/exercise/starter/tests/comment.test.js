import test from 'node:test';
import assert from 'node:assert/strict';
import { createComment } from '../src/commentService.js';

test('createComment creates comment with valid text', () => {
  const { id, state } = createComment({ text: 'hello', userId: 'u1' });
  assert.ok(id);
  assert.equal(state.comments.get(id).text, 'hello');
});
