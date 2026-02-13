const cacheStore = new Map();

const TTL_CONFIG = {
  livescore: parseInt(process.env.CACHE_TTL_LIVESCORE) || 15,
  fixtures: parseInt(process.env.CACHE_TTL_DEFAULT) || 60,
  standings: parseInt(process.env.CACHE_TTL_STANDINGS) || 300,
  leagues: parseInt(process.env.CACHE_TTL_LEAGUES) || 600,
  countries: parseInt(process.env.CACHE_TTL_COUNTRIES) || 3600,
  odds: parseInt(process.env.CACHE_TTL_ODDS) || 30,
  search: parseInt(process.env.CACHE_TTL_SEARCH) || 30,
  default: parseInt(process.env.CACHE_TTL_DEFAULT) || 60
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
  const ttlSeconds = TTL_CONFIG[endpoint] || TTL_CONFIG.default;
  const ttlMs = ttlSeconds * 1000;
  
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cacheStore.entries()) {
    if (now > value.expiresAt) {
      cacheStore.delete(key);
    }
  }
}, 60000);
