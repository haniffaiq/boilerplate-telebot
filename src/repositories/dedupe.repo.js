const store = new Map(); // key -> ts
export function setKey(key, ts = Date.now()) { store.set(key, ts); }
export function hasKey(key, ttlMs) {
  const ts = store.get(key);
  if (!ts) return false;
  if (Date.now() - ts > ttlMs) { store.delete(key); return false; }
  return true;
}
export function sweep(ttlMs) {
  const now = Date.now();
  for (const [k, ts] of store) if (now - ts > ttlMs) store.delete(k);
}
