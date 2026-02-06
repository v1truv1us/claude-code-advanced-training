export function makeComment({ id, postId, parentId = null, author, text, createdAt = Date.now() }) {
  return { id, postId, parentId, author, text, createdAt };
}
