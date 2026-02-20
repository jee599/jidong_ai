interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const localCache = new Map<string, CacheEntry<unknown>>();

export function withCache<T>(key: string, ttlMs: number, loader: () => T): T {
  const now = Date.now();
  const cached = localCache.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }
  const value = loader();
  localCache.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

export function clearCache() {
  localCache.clear();
}
