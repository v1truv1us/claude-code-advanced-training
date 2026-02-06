import { makeComment } from '../models/comment.js';

const KEY = 'comments:v1';

function loadAll() {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveAll(comments) {
  globalThis.localStorage?.setItem(KEY, JSON.stringify(comments));
}

export function listCommentsForPost(postId) {
  return loadAll().filter(c => c.postId === postId);
}

export function addComment({ postId, parentId = null, author, text }) {
  const all = loadAll();
  const id = `c_${Math.random().toString(16).slice(2)}`;
  const comment = makeComment({ id, postId, parentId, author, text });
  all.push(comment);
  saveAll(all);
  return comment;
}

export function deleteComment(id) {
  const all = loadAll().filter(c => c.id !== id);
  saveAll(all);
}
