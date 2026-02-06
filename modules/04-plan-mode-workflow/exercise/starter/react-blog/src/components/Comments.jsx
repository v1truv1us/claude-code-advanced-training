// Pseudo-React component (kept simple for planning/exploration)
// The goal is to have a file that looks like a UI integration point.

import { listCommentsForPost, addComment } from '../services/commentsStore.js';

export function renderComments({ postId }) {
  const comments = listCommentsForPost(postId);
  return comments.map(c => `@${c.author}: ${c.text}`).join('\n');
}

export function submitComment({ postId, author, text }) {
  return addComment({ postId, author, text });
}
