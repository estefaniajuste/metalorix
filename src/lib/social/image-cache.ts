const cache = new Map<string, { data: Buffer; expires: number }>();

const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function cacheImage(id: string, data: Buffer): void {
  cache.set(id, { data, expires: Date.now() + TTL_MS });

  for (const [key, entry] of cache.entries()) {
    if (entry.expires < Date.now()) cache.delete(key);
  }
}

export function getCachedImage(id: string): Buffer | null {
  const entry = cache.get(id);
  if (!entry || entry.expires < Date.now()) {
    if (entry) cache.delete(id);
    return null;
  }
  return entry.data;
}
