const cacheStore = new Map();

const TTL_CONFIG = {
  livescore: 15 * 1000,
  fixtures: 60 * 1000,
  standings: 5 * 60 * 1000,
  leagues: 10 * 60 * 1000,
  countries: 60 * 60 * 1000,
  odds: 30 * 1000,
  search: 30 * 1000,
  default: 60 * 1000
};

export function getCacheKey(endpoint, params) {
  return `${endpoint}:${JSON.stringify(params)}`;
}

export function getFromCache(key) {
  const cached = cacheStore.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expiresAt) {
    cacheStore.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCache(key, data, endpoint) {
  const ttl = TTL_CONFIG[endpoint] || TTL_CONFIG.default;
  
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttl
  });
}

// Cleanup expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cacheStore.entries()) {
    if (now > value.expiresAt) {
      cacheStore.delete(key);
    }
  }
}, 60 * 1000);
