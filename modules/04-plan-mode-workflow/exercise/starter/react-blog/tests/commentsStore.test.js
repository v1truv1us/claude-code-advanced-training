import test from 'node:test';
import assert from 'node:assert/strict';
import { addComment, listCommentsForPost } from '../src/services/commentsStore.js';

// A tiny localStorage shim for node
const mem = new Map();
globalThis.localStorage = {
  getItem(k){ return mem.has(k) ? mem.get(k) : null; },
  setItem(k,v){ mem.set(k,String(v)); },
  removeItem(k){ mem.delete(k); }
};

test('addComment adds and listCommentsForPost returns it', () => {
  const c = addComment({ postId: 'p1', author: 'alice', text: 'hello' });
  const all = listCommentsForPost('p1');
  assert.equal(all.length, 1);
  assert.equal(all[0].id, c.id);
});
