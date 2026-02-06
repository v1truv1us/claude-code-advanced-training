// Minimal reference implementation (expand as needed).

export function createComment(input, state = {}) {
  if (!input || typeof input.text !== 'string') throw new Error('INVALID_TEXT');
  const text = input.text.trim();
  if (!text) throw new Error('EMPTY_TEXT');
  if (text.length > 1000) throw new Error('TEXT_TOO_LONG');

  const id = `c_${Math.random().toString(16).slice(2)}`;
  const now = Date.now();

  const next = { ...state };
  next.comments = next.comments ?? new Map();
  next.comments.set(id, { id, text, userId: input.userId ?? null, parentId: null, createdAt: now });

  return { id, state: next };
}

export function replyToComment(parentId, input, state = {}) {
  if (!parentId) throw new Error('INVALID_PARENT');
  if (!state.comments || !state.comments.get(parentId)) throw new Error('PARENT_NOT_FOUND');

  const { id, state: nextState } = createComment(input, state);
  nextState.comments.get(id).parentId = parentId;
  return { id, state: nextState };
}
