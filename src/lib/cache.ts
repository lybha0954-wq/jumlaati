type CacheEntry = { data: any; expiry: number };

const cacheStore = new Map<string, CacheEntry>();

export const cache = {
  get<T>(key: string): T | null {
    const entry = cacheStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      cacheStore.delete(key);
      return null;
    }
    return entry.data as T;
  },
  set<T>(key: string, data: T, ttlSeconds: number = 60) {
    cacheStore.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
  },
  remove(key: string) {
    cacheStore.delete(key);
  },
  clear() {
    cacheStore.clear();
  }
};
